import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import ort from '../node_modules/onnxruntime-web/dist/ort.node.min.js';

async function upscaleTestImage(inputPath, outputPath) {
  console.log('====================================================');
  console.log(' WebGPU Free Image Upscaler — Real ONNX Test Runner ');
  console.log('====================================================');
  console.log('Input file:', inputPath);

  // 1. Read input image with sharp
  const metadata = await sharp(inputPath).metadata();
  console.log(`Original dimensions: ${metadata.width} × ${metadata.height} px (${metadata.channels} channels, format: ${metadata.format})`);

  const { data: inputBuffer, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const inputW = info.width;
  const inputH = info.height;
  const scale = 4;
  const targetW = inputW * scale;
  const targetH = inputH * scale;
  const tileSize = 256;
  const overlap = 16;
  const effectiveStep = tileSize - overlap * 2;

  console.log(`Target dimensions:   ${targetW} × ${targetH} px (4× Scale)`);
  console.log(`Tile configuration:  ${tileSize}px tiles with ${overlap}px overlap`);

  // 2. Load ONNX model
  const modelPath = 'public/models/realesrgan/model.onnx';
  console.log('Loading ONNX model from:', modelPath);
  const modelBuf = fs.readFileSync(modelPath);
  const session = await ort.InferenceSession.create(modelBuf);
  console.log('✓ Model loaded successfully! Input:', session.inputNames, 'Output:', session.outputNames);

  // 3. Plan tiles
  const xPositions = [];
  let curX = 0;
  while (curX < inputW) {
    xPositions.push(curX);
    if (curX + tileSize >= inputW) break;
    curX += effectiveStep;
    if (curX + tileSize > inputW) {
      const lastX = Math.max(0, inputW - tileSize);
      if (lastX > xPositions[xPositions.length - 1]) xPositions.push(lastX);
      break;
    }
  }

  const yPositions = [];
  let curY = 0;
  while (curY < inputH) {
    yPositions.push(curY);
    if (curY + tileSize >= inputH) break;
    curY += effectiveStep;
    if (curY + tileSize > inputH) {
      const lastY = Math.max(0, inputH - tileSize);
      if (lastY > yPositions[yPositions.length - 1]) yPositions.push(lastY);
      break;
    }
  }

  const totalTiles = xPositions.length * yPositions.length;
  console.log(`Grid layout: ${xPositions.length} columns × ${yPositions.length} rows = ${totalTiles} tiles total`);

  // Accumulation buffers
  const totalOutputPixels = targetW * targetH;
  const accumR = new Float32Array(totalOutputPixels);
  const accumG = new Float32Array(totalOutputPixels);
  const accumB = new Float32Array(totalOutputPixels);
  const accumW = new Float32Array(totalOutputPixels);

  // Raised-cosine weight ramp generator
  function createWeightRamp(size, ov, isStart, isEnd) {
    const ramp = new Float32Array(size);
    for (let i = 0; i < size; i++) {
      let weight = 1.0;
      if (!isStart && i < ov) {
        weight = 0.5 - 0.5 * Math.cos(Math.PI * (i / ov));
      }
      if (!isEnd && i >= size - ov) {
        const fade = 0.5 - 0.5 * Math.cos(Math.PI * ((size - 1 - i) / ov));
        weight = Math.min(weight, fade);
      }
      ramp[i] = Math.max(0.0001, weight);
    }
    return ramp;
  }

  const scaledTileSize = tileSize * scale;
  const scaledOverlap = overlap * scale;

  console.log('\n--- Starting Real Neural Network Inference ---');
  const startTime = Date.now();
  let tileIndex = 0;

  for (let r = 0; r < yPositions.length; r++) {
    const y = yPositions[r];
    const isTop = r === 0;
    const isBottom = r === yPositions.length - 1;

    for (let c = 0; c < xPositions.length; c++) {
      tileIndex++;
      const x = xPositions[c];
      const isLeft = c === 0;
      const isRight = c === xPositions.length - 1;

      const tStart = Date.now();

      // Extract 256x256 tile in planar CHW float32 [0..1]
      const floatData = new Float32Array(3 * tileSize * tileSize);
      const pixelCount = tileSize * tileSize;

      for (let ty = 0; ty < tileSize; ty++) {
        const srcY = Math.min(inputH - 1, y + ty);
        const srcRowOffset = srcY * inputW * 4;

        for (let tx = 0; tx < tileSize; tx++) {
          const srcX = Math.min(inputW - 1, x + tx);
          const srcIdx = srcRowOffset + srcX * 4;
          const targetPixelIdx = ty * tileSize + tx;

          floatData[targetPixelIdx] = inputBuffer[srcIdx] / 255.0;                   // R
          floatData[pixelCount + targetPixelIdx] = inputBuffer[srcIdx + 1] / 255.0; // G
          floatData[2 * pixelCount + targetPixelIdx] = inputBuffer[srcIdx + 2] / 255.0; // B
        }
      }

      // Run ONNX Session on tile
      const inputTensor = new ort.Tensor('float32', floatData, [1, 3, tileSize, tileSize]);
      const results = await session.run({ [session.inputNames[0]]: inputTensor });
      const outTensor = results[session.outputNames[0]];
      const outData = outTensor.data;

      // Blend output into accumulation buffers
      const rampX = createWeightRamp(scaledTileSize, scaledOverlap, isLeft, isRight);
      const rampY = createWeightRamp(scaledTileSize, scaledOverlap, isTop, isBottom);

      const tileTargetX = x * scale;
      const tileTargetY = y * scale;
      const outPlaneSize = scaledTileSize * scaledTileSize;

      for (let row = 0; row < scaledTileSize; row++) {
        const outY = tileTargetY + row;
        if (outY >= targetH) continue;
        const wy = rampY[row];
        const rowOffset = outY * targetW;

        for (let col = 0; col < scaledTileSize; col++) {
          const outX = tileTargetX + col;
          if (outX >= targetW) continue;
          const weight = rampX[col] * wy;

          const gIdx = rowOffset + outX;
          const tIdx = row * scaledTileSize + col;

          const rVal = outData[tIdx] * 255.0;
          const gVal = outData[outPlaneSize + tIdx] * 255.0;
          const bVal = outData[2 * outPlaneSize + tIdx] * 255.0;

          accumR[gIdx] += rVal * weight;
          accumG[gIdx] += gVal * weight;
          accumB[gIdx] += bVal * weight;
          accumW[gIdx] += weight;
        }
      }

      const tElapsed = Date.now() - tStart;
      console.log(`[Tile ${tileIndex}/${totalTiles}] inferred at (${x}, ${y}) in ${tElapsed}ms`);
    }
  }

  const totalInferenceTime = Date.now() - startTime;
  console.log(`\n✓ All ${totalTiles} tiles inferred in ${(totalInferenceTime / 1000).toFixed(2)}s`);

  // 4. Resolve accumulation buffer into final image
  console.log('Composing final seamless image buffer...');
  const finalRgba = Buffer.alloc(targetW * targetH * 4);

  for (let i = 0; i < totalOutputPixels; i++) {
    const w = accumW[i];
    const outIdx = i * 4;
    if (w > 0) {
      finalRgba[outIdx] = Math.min(255, Math.max(0, Math.round(accumR[i] / w)));
      finalRgba[outIdx + 1] = Math.min(255, Math.max(0, Math.round(accumG[i] / w)));
      finalRgba[outIdx + 2] = Math.min(255, Math.max(0, Math.round(accumB[i] / w)));
    } else {
      finalRgba[outIdx] = 0;
      finalRgba[outIdx + 1] = 0;
      finalRgba[outIdx + 2] = 0;
    }
    finalRgba[outIdx + 3] = 255;
  }

  // 5. Save using sharp
  console.log('Writing 4× upscaled result to:', outputPath);
  await sharp(finalRgba, {
    raw: {
      width: targetW,
      height: targetH,
      channels: 4,
    },
  })
    .png()
    .toFile(outputPath);

  const outStat = fs.statSync(outputPath);
  console.log(`✓ SUCCESS! Output created: ${outputPath}`);
  console.log(`Output file size: ${(outStat.size / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Resolution: ${targetW} × ${targetH} px`);
  console.log('====================================================\n');
}

const inputPath = '/home/cepheusn/Pictures/Screenshots/Screenshot_20260903_123642.png';
const outputPath = '/home/cepheusn/Developments/AI-App/Upscale/test_upscaled_result.png';

upscaleTestImage(inputPath, outputPath).catch(console.error);
