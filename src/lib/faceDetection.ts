
// lib/faceDetection.ts
import * as faceapi from 'face-api.js'

let modelsLoaded = false

export const loadFaceDetectionModels = async () => {
  if (modelsLoaded) return
  try {
    const MODEL_URL = '/models'
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
    ])
    modelsLoaded = true
  } catch (error) {
    console.error('Error loading face detection models:', error)
    throw error
  }
}

export interface DetectedFace {
  x: number
  y: number
  width: number
  height: number
  confidence: number
  landmarks?: any
  expressions?: Record<string, number>
}

export const detectFaces = async (imageFile: File): Promise<DetectedFace[]> => {
  if (!modelsLoaded) {
    await loadFaceDetectionModels()
  }
  try {
    const img = await createImageFromFile(imageFile)
    const detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions()
    URL.revokeObjectURL(img.src)
    return detections.map(d => ({
      x: d.detection.box.x,
      y: d.detection.box.y,
      width: d.detection.box.width,
      height: d.detection.box.height,
      confidence: d.detection.score,
      landmarks: d.landmarks?.positions.map(pos => ({ x: pos.x, y: pos.y })),
      expressions: d.expressions
    }))
  } catch (error) {
    console.error('Error detecting faces:', error)
    return []
  }
}

const createImageFromFile = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}
