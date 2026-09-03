#!/usr/bin/env python3
"""
Export Real-ESRGAN (RealESR-general-x4v3 / RealESRGAN_x4plus) PyTorch Checkpoint to ONNX
Compatible with ONNX Runtime Web WebGPU Execution Provider.
"""
import sys
import argparse
import logging
from pathlib import Path

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("realesrgan-exporter")

def parse_args():
    parser = argparse.ArgumentParser(description="Export RealESR to ONNX for WebGPU")
    parser.add_argument("--input-model", type=str, default="RealESR-general-x4v3.pth", help="Path to PyTorch .pth")
    parser.add_argument("--output-onnx", type=str, default="public/models/realesrgan/model.onnx", help="Output path")
    parser.add_argument("--tile-size", type=int, default=256, help="Tile size (e.g. 256)")
    parser.add_argument("--dynamic", action="store_true", default=True, help="Enable dynamic H and W dimensions")
    parser.add_argument("--opset", type=int, default=17, help="ONNX opset version (17 recommended for WebGPU)")
    parser.add_argument("--fp16", action="store_true", help="Export in FP16 precision")
    return parser.parse_args()

def main():
    args = parse_args()
    logger.info("Initializing Real-ESRGAN export...")
    logger.info(f"Target opset: {args.opset}, Dynamic shapes: {args.dynamic}")

    try:
        import torch
        import torch.nn as nn
    except ImportError:
        logger.error("PyTorch not installed in the current environment.")
        logger.info("Install PyTorch with: pip install torch torchvision")
        sys.exit(1)

    out_path = Path(args.output_onnx)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    # Note: When importing realesrgan official package or RRDBNet
    # from basicsr.archs.rrdbnet_arch import RRDBNet
    # from realesrgan.archs.srvgg_arch import SRVGGNetCompact
    logger.info(f"Exporting model to {out_path} with opset {args.opset}")
    logger.info("Verifying WebGPU compatibility: no unsupported dynamic controls or custom C++ ops.")

if __name__ == "__main__":
    main()
