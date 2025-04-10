
import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Upload, Camera, X } from 'lucide-react'
import { uploadMedia } from '@/lib/mediaManager'

interface BatchMediaUploaderProps {
  memoryId: string
  userId: string
  onUploadComplete: (uploadedItems: any[]) => void
  isPrivate?: boolean
  detectFaces?: boolean
  maxFiles?: number
  onError?: (err: Error) => void
}

export const BatchMediaUploader: React.FC<BatchMediaUploaderProps> = ({
  memoryId,
  userId,
  onUploadComplete,
  isPrivate = false,
  detectFaces = false,
  maxFiles = 10,
  onError
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState<Record<string, number>>({})
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const newFiles = Array.from(e.target.files)
    const allowedFiles = newFiles.slice(0, maxFiles - selectedFiles.length)
    setSelectedFiles(prev => [...prev, ...allowedFiles])
    allowedFiles.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => setPreviews(prev => [...prev, reader.result as string])
      reader.readAsDataURL(file)
    })
  }

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault() }
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (!e.dataTransfer.files) return
    const newFiles = Array.from(e.dataTransfer.files)
    const allowedFiles = newFiles.slice(0, maxFiles - selectedFiles.length)
    setSelectedFiles(prev => [...prev, ...allowedFiles])
    allowedFiles.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => setPreviews(prev => [...prev, reader.result as string])
      reader.readAsDataURL(file)
    })
  }

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => {
      const c = [...prev]; c.splice(index,1); return c
    })
    setPreviews(prev => {
      const c = [...prev]; c.splice(index,1); return c
    })
  }

  const handleUploadAll = async () => {
    if (selectedFiles.length === 0) return
    setUploading(true)
    const uploadedItems: any[] = []

    try {
      const chunkSize = 3
      for (let i=0; i<selectedFiles.length; i+=chunkSize) {
        const slice = selectedFiles.slice(i, i+chunkSize)
        const uploads = slice.map(async (file, idx) => {
          const key = file.name + idx
          setProgress(prev => ({ ...prev, [key]: 0 }))
          try {
            const meta = { detectFaces }
            const mediaItem = await uploadMedia({
              file,
              memoryId,
              userId,
              isPrivate,
              metadata: meta,
              progressCallback: (pct) => {
                setProgress(prev => ({ ...prev, [key]: pct }))
              }
            })
            uploadedItems.push(mediaItem)
          } catch (err: any) {
            console.error('Error uploading file:', err)
            if (onError) onError(err)
          }
        })
        await Promise.all(uploads)
      }
      onUploadComplete(uploadedItems)
      setSelectedFiles([])
      setPreviews([])
      setProgress({})
      fileRef.current && (fileRef.current.value = '')
    } finally {
      setUploading(false)
    }
  }

  const overallProgress = () => {
    const keys = Object.keys(progress)
    if (keys.length === 0) return 0
    const sum = Object.values(progress).reduce((a,b) => a+b, 0)
    return sum / keys.length
  }

  return (
    <div className="w-full">
      <input 
        type="file"
        className="hidden"
        ref={fileRef}
        multiple
        accept="image/*,video/*"
        onChange={handleFileChange}
      />
      <div className="space-y-4">
        {selectedFiles.length < maxFiles && (
          <div
            className="border-2 border-dashed rounded p-6 text-center"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <p className="mb-2">
              {selectedFiles.length>0 
                ? `Add more files (${selectedFiles.length}/${maxFiles})`
                : 'Drag & drop or click to select multiple files'}
            </p>
            <div className="flex justify-center gap-2">
              <Button variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading}>
                <Upload size={16}/> Browse
              </Button>
              <Button variant="outline" onClick={() => {
                if (fileRef.current) {
                  fileRef.current.setAttribute('capture','environment')
                  fileRef.current.click()
                }
              }} disabled={uploading}>
                <Camera size={16}/> Camera
              </Button>
            </div>
          </div>
        )}
        {selectedFiles.length>0 && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {selectedFiles.map((file, idx) => (
                <div key={idx} className="border relative rounded overflow-hidden">
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 w-6 h-6 rounded-full"
                    onClick={()=>handleRemoveFile(idx)}
                    disabled={uploading}
                  >
                    <X size={14}/>
                  </Button>
                  {idx<previews.length && (
                    <div className="aspect-square bg-black flex items-center justify-center">
                      {file.type.startsWith('image/') ? (
                        <img src={previews[idx]} className="w-full h-full object-cover"/>
                      ) : file.type.startsWith('video/') ? (
                        <video src={previews[idx]} className="w-full h-full object-cover"/>
                      ) : (
                        <div className="text-white">Unsupported</div>
                      )}
                    </div>
                  )}
                  <div className="p-2 text-xs truncate">
                    {file.name}
                  </div>
                </div>
              ))}
            </div>
            {uploading ? (
              <div className="flex flex-col gap-2">
                <Progress value={overallProgress()}/>
                <div className="text-right text-xs">
                  {Math.round(overallProgress())}%
                </div>
              </div>
            ) : (
              <Button onClick={handleUploadAll} className="w-full">
                Upload All ({selectedFiles.length})
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
