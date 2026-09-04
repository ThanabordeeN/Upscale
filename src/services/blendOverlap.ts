/**
 * Raised-cosine overlap blending to eliminate tile boundary seams in super-resolution output.
 */

export class OverlapBlender {
  private width: number;
  private height: number;
  private accumR: Float32Array;
  private accumG: Float32Array;
  private accumB: Float32Array;
  private accumWeight: Float32Array;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    const totalPixels = width * height;
    this.accumR = new Float32Array(totalPixels);
    this.accumG = new Float32Array(totalPixels);
    this.accumB = new Float32Array(totalPixels);
    this.accumWeight = new Float32Array(totalPixels);
  }

  /**
   * Generates 1D smooth raised-cosine weight ramp
   */
  public static createWeightRamp(size: number, overlap: number, isStartEdge: boolean, isEndEdge: boolean): Float32Array {
    const ramp = new Float32Array(size);
    for (let i = 0; i < size; i++) {
      let weight = 1.0;

      // Leading overlap feathering
      if (!isStartEdge && i < overlap) {
        // Raised cosine feathering from 0.0 to 1.0
        const progress = i / overlap;
        weight = 0.5 - 0.5 * Math.cos(Math.PI * progress);
      }

      // Trailing overlap feathering
      if (!isEndEdge && i >= size - overlap) {
        const progress = (size - 1 - i) / overlap;
        const fade = 0.5 - 0.5 * Math.cos(Math.PI * progress);
        weight = Math.min(weight, fade);
      }

      ramp[i] = Math.max(0.0001, weight);
    }
    return ramp;
  }

  /**
   * Adds an upscaled tile's RGB channels into the global accumulation buffer with 2D blending weights
   */
  public blendTile(
    tileData: Uint8ClampedArray | Float32Array,
    tileX: number,
    tileY: number,
    tileW: number,
    tileH: number,
    overlap: number,
    isLeft: boolean,
    isTop: boolean,
    isRight: boolean,
    isBottom: boolean
  ): void {
    const rampX = OverlapBlender.createWeightRamp(tileW, overlap, isLeft, isRight);
    const rampY = OverlapBlender.createWeightRamp(tileH, overlap, isTop, isBottom);

    for (let row = 0; row < tileH; row++) {
      const globalY = tileY + row;
      if (globalY >= this.height) continue;

      const wy = rampY[row];
      const rowOffset = globalY * this.width;

      for (let col = 0; col < tileW; col++) {
        const globalX = tileX + col;
        if (globalX >= this.width) continue;

        const weight = rampX[col] * wy;
        const globalIdx = rowOffset + globalX;
        const tileIdx = (row * tileW + col) * 4; // Assuming RGBA layout

        const r = tileData[tileIdx];
        const g = tileData[tileIdx + 1];
        const b = tileData[tileIdx + 2];

        this.accumR[globalIdx] += r * weight;
        this.accumG[globalIdx] += g * weight;
        this.accumB[globalIdx] += b * weight;
        this.accumWeight[globalIdx] += weight;
      }
    }
  }

  /**
   * Resolves accumulated weighted colors into a final ImageData
   */
  public toImageData(): ImageData {
    const totalPixels = this.width * this.height;
    const outputData = new Uint8ClampedArray(totalPixels * 4);

    for (let i = 0; i < totalPixels; i++) {
      const w = this.accumWeight[i];
      const outIdx = i * 4;

      if (w > 0) {
        outputData[outIdx] = Math.min(255, Math.max(0, Math.round(this.accumR[i] / w)));
        outputData[outIdx + 1] = Math.min(255, Math.max(0, Math.round(this.accumG[i] / w)));
        outputData[outIdx + 2] = Math.min(255, Math.max(0, Math.round(this.accumB[i] / w)));
      } else {
        outputData[outIdx] = 0;
        outputData[outIdx + 1] = 0;
        outputData[outIdx + 2] = 0;
      }
      outputData[outIdx + 3] = 255; // Full opacity
    }

    return new ImageData(outputData, this.width, this.height);
  }

  /**
   * Immediately releases internal float buffers to prevent memory spikes
   */
  public dispose(): void {
    this.accumR = new Float32Array(0);
    this.accumG = new Float32Array(0);
    this.accumB = new Float32Array(0);
    this.accumWeight = new Float32Array(0);
  }
}
