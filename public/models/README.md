
# Face Detection Models

This directory should contain the required models for face detection using face-api.js.

You need to download the following model files from the face-api.js GitHub repository:

1. `tiny_face_detector_model-weights_manifest.json`
2. `tiny_face_detector_model-shard1`
3. `face_landmark_68_model-weights_manifest.json`
4. `face_landmark_68_model-shard1`

These files can be downloaded from:
https://github.com/justadudewhohacks/face-api.js/tree/master/weights

Place these files directly in this directory to enable face detection functionality.

## Usage

The face detection models are automatically loaded when needed by the FaceDetectionService.
