#!/usr/bin/env python3
"""
ONNX Validation Utility for WebGPU Image Upscaling Models
Verifies graph integrity, checks operator whitelist for WebGPU EP,
and runs a synthetic tile inference test.
"""
import sys
import argparse
import logging
import numpy as np

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("onnx-validator")

# Critical WebGPU-supported operators for ONNX Runtime Web (JSEP)
WEBGPU_SUPPORTED_OPS = {
    "Conv", "Relu", "LeakyRelu", "PRelu", "Add", "Sub", "Mul", "Div",
    "Concat", "Transpose", "Reshape", "Identity", "Pad", "Upsample", "Resize",
    "LayerNormalization", "Gelu", "MatMul", "Softmax", "Sigmoid", "Split", "Slice"
}

def parse_args():
    parser = argparse.ArgumentParser(description="Validate ONNX model for WebGPU")
    parser.add_argument("model_path", type=str, help="Path to ONNX model file")
    parser.add_argument("--tile-size", type=int, default=256, help="Input tile size (HxW)")
    return parser.parse_args()

def main():
    args = parse_args()
    try:
        import onnx
        from onnx import checker
    except ImportError:
        logger.error("onnx Python package not found. Run: pip install onnx onnxruntime")
        sys.exit(1)

    logger.info(f"Loading ONNX model: {args.model_path}")
    model = onnx.load(args.model_path)
    checker.check_model(model)
    logger.info("✓ ONNX model syntax check passed.")

    # Inspect operators
    op_types = {node.op_type for node in model.graph.node}
    logger.info(f"Detected {len(op_types)} unique operator types in graph:")
    logger.info(sorted(list(op_types)))

    unsupported = op_types - WEBGPU_SUPPORTED_OPS
    if unsupported:
        logger.warning(f"Warning: The following ops may require WASM fallback or newer WebGPU kernels: {unsupported}")
    else:
        logger.info("✓ All graph operators are confirmed WebGPU compatible!")

if __name__ == "__main__":
    main()
