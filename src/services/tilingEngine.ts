import { TileCoordinates } from '../types';

export interface GridPartition {
  tiles: TileCoordinates[];
  totalCols: number;
  totalRows: number;
  tileSize: number;
  overlap: number;
}

export class TilingEngine {
  /**
   * Generates overlapping tile coordinates covering the entire source image
   */
  public static planTiles(
    width: number,
    height: number,
    tileSize = 256,
    overlap = 16
  ): GridPartition {
    const tiles: TileCoordinates[] = [];

    // Safety guard: if tile size is larger than image, clamp or single tile
    if (width <= tileSize && height <= tileSize) {
      tiles.push({
        index: 0,
        x: 0,
        y: 0,
        width,
        height,
        padLeft: 0,
        padTop: 0,
        padRight: tileSize - width,
        padBottom: tileSize - height,
        isEdgeX: true,
        isEdgeY: true,
      });
      return { tiles, totalCols: 1, totalRows: 1, tileSize, overlap };
    }

    const effectiveStep = Math.max(32, tileSize - overlap * 2);

    const xPositions: number[] = [];
    let curX = 0;
    while (curX < width) {
      xPositions.push(curX);
      if (curX + tileSize >= width) break;
      curX += effectiveStep;
      if (curX + tileSize > width) {
        // Shift last tile to align with right edge
        const lastX = Math.max(0, width - tileSize);
        if (lastX > xPositions[xPositions.length - 1]) {
          xPositions.push(lastX);
        }
        break;
      }
    }

    const yPositions: number[] = [];
    let curY = 0;
    while (curY < height) {
      yPositions.push(curY);
      if (curY + tileSize >= height) break;
      curY += effectiveStep;
      if (curY + tileSize > height) {
        // Shift last tile to align with bottom edge
        const lastY = Math.max(0, height - tileSize);
        if (lastY > yPositions[yPositions.length - 1]) {
          yPositions.push(lastY);
        }
        break;
      }
    }

    let index = 0;
    for (let r = 0; r < yPositions.length; r++) {
      const y = yPositions[r];
      const isTop = r === 0;
      const isBottom = r === yPositions.length - 1;

      for (let c = 0; c < xPositions.length; c++) {
        const x = xPositions[c];
        const isLeft = c === 0;
        const isRight = c === xPositions.length - 1;

        const tileW = Math.min(tileSize, width - x);
        const tileH = Math.min(tileSize, height - y);

        tiles.push({
          index: index++,
          x,
          y,
          width: tileW,
          height: tileH,
          padLeft: 0,
          padTop: 0,
          padRight: tileSize - tileW,
          padBottom: tileSize - tileH,
          isEdgeX: isLeft || isRight,
          isEdgeY: isTop || isBottom,
        });
      }
    }

    return {
      tiles,
      totalCols: xPositions.length,
      totalRows: yPositions.length,
      tileSize,
      overlap,
    };
  }
}
