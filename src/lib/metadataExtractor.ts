
import exifr from 'exifr'

export interface ImageMetadata {
  dateTaken?: Date
  location?: { latitude?: number; longitude?: number }
  camera?: { make?: string; model?: string }
  orientation?: number
  exposureTime?: number
  fNumber?: number
  iso?: number
  focalLength?: number
  dimensions?: { width: number; height: number }
}

export const extractImageMetadata = async (file: File): Promise<ImageMetadata> => {
  try {
    const dimensions = await getImageDimensions(file)
    if (!file.type.startsWith('image/')) {
      return { dimensions }
    }
    const exif = await exifr.parse(file, {
      pick: [
        'Make','Model','DateTimeOriginal','GPSLatitude','GPSLongitude',
        'Orientation','ExposureTime','FNumber','ISO','FocalLength'
      ]
    })
    if (!exif) {
      return { dimensions }
    }
    return {
      dateTaken: exif.DateTimeOriginal,
      location: exif.GPSLatitude && exif.GPSLongitude
        ? { latitude: exif.GPSLatitude, longitude: exif.GPSLongitude } 
        : undefined,
      camera: { make: exif.Make, model: exif.Model },
      orientation: exif.Orientation,
      exposureTime: exif.ExposureTime,
      fNumber: exif.FNumber,
      iso: exif.ISO,
      focalLength: exif.FocalLength,
      dimensions
    }
  } catch (error) {
    console.error('Error extracting image metadata:', error)
    return {}
  }
}

const getImageDimensions = async (file: File): Promise<{ width: number; height: number }> => {
  return new Promise(resolve => {
    if (file.type.startsWith('image/')) {
      const img = new Image()
      img.onload = () => {
        URL.revokeObjectURL(img.src)
        resolve({ width: img.width, height: img.height })
      }
      img.onerror = () => {
        URL.revokeObjectURL(img.src)
        resolve({ width: 0, height: 0 })
      }
      img.src = URL.createObjectURL(file)
    } else if (file.type.startsWith('video/')) {
      const video = document.createElement('video')
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src)
        resolve({ width: video.videoWidth, height: video.videoHeight })
      }
      video.onerror = () => {
        URL.revokeObjectURL(video.src)
        resolve({ width: 0, height: 0 })
      }
      video.src = URL.createObjectURL(file)
    } else {
      resolve({ width: 0, height: 0 })
    }
  })
}

export const extractVideoMetadata = async (file: File): Promise<{
  duration?: number
  dimensions?: { width: number; height: number }
}> => {
  return new Promise(resolve => {
    const video = document.createElement('video')
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src)
      resolve({
        duration: video.duration,
        dimensions: { width: video.videoWidth, height: video.videoHeight }
      })
    }
    video.onerror = () => {
      URL.revokeObjectURL(video.src)
      resolve({})
    }
    video.src = URL.createObjectURL(file)
  })
}
