
import React, { useState, useEffect } from 'react'
import { detectFaces, loadFaceDetectionModels, DetectedFace } from '@/lib/faceDetection'
import { uploadMedia } from '@/lib/mediaManager'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card } from '@/components/ui/card'
import { LoaderCircle } from 'lucide-react'

interface GroupFaceDetectionProps {
  files: File[]
  memoryId: string
  userId: string
  onComplete: (results: any[]) => void
  onCancel: () => void
}

export const GroupFaceDetection: React.FC<GroupFaceDetectionProps> = ({
  files,
  memoryId,
  userId,
  onComplete,
  onCancel
}) => {
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<Array<{file: File, faces: DetectedFace[] }>>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [selectedFaces, setSelectedFaces] = useState<Record<string, boolean>>({})

  useEffect(()=> {
    loadFaceDetectionModels('/models').then(()=> setModelsLoaded(true))
  },[])

  useEffect(()=> {
    if (!modelsLoaded || currentIndex>=files.length) {
      if (modelsLoaded && currentIndex===files.length) {
        setLoading(false)
      }
      return
    }
    const detectNext = async () => {
      const file = files[currentIndex]
      try {
        const faces = await detectFaces(file)
        setResults(prev => [...prev, { file, faces }])
        faces.forEach((_, faceIndex) => {
          const faceId = `${currentIndex}-${faceIndex}`
          setSelectedFaces(prev => ({...prev, [faceId]: true}))
        })
      } catch (err) {
        console.error('Face detection error:', err)
      } finally {
        setCurrentIndex(prev=>prev+1)
        setProgress(((currentIndex+1)/files.length)*100)
      }
    }
    detectNext()
  }, [modelsLoaded, currentIndex, files])

  const toggleFace = (fileIdx: number, faceIdx: number) => {
    const faceId = `${fileIdx}-${faceIdx}`
    setSelectedFaces(prev => ({ ...prev, [faceId]: !prev[faceId] }))
  }

  const handleCreateCards = async () => {
    setProcessing(true)
    const finalUploads = []
    try {
      for (let i=0; i<results.length; i++) {
        const { file, faces } = results[i]
        const mainImage = await uploadMedia({
          file,
          memoryId,
          userId,
          metadata: { isGroupPhoto: true, faceCount: faces.length }
        })
        finalUploads.push(mainImage)
        // If you wanted to upload individual face crops, you'd do that here
        for (let f=0; f<faces.length; f++) {
          const faceId = `${i}-${f}`
          if (!selectedFaces[faceId]) continue
          // (In a real app, you'd crop the face and upload)
        }
      }
      onComplete(finalUploads)
    } catch (err) {
      console.error('Error creating cards:', err)
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex flex-col gap-2 items-center">
          <LoaderCircle className="animate-spin text-primary"/>
          <p>Analyzing Photos... {Math.round(progress)}%</p>
          <Progress value={progress}/>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Select Faces to Create Cards</h3>
        <p className="text-sm text-gray-500">
          Found {results.reduce((acc, item)=> acc+item.faces.length, 0)} faces in {files.length} images.
        </p>
      </div>
      <div className="space-y-4">
        {results.map((r, fileIdx) => (
          <div key={fileIdx} className="border rounded overflow-hidden mb-4">
            <img src={URL.createObjectURL(r.file)} alt="Detected faces" className="max-w-full"/>
            <div className="p-2 bg-gray-50">
              {r.faces.map((face, faceIdx) => {
                const faceId = `${fileIdx}-${faceIdx}`
                const checked = selectedFaces[faceId]
                return (
                  <label key={faceId} className="inline-flex items-center mr-4 mb-2">
                    <input 
                      type="checkbox"
                      checked={checked}
                      onChange={()=>toggleFace(fileIdx, faceIdx)}
                      className="mr-1"
                    />
                    <span className="ml-1 text-sm">Face {faceIdx+1}</span>
                  </label>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleCreateCards} disabled={processing}>
          {processing ? 'Creating...' : 'Create Cards'}
        </Button>
      </div>
    </Card>
  )
}
