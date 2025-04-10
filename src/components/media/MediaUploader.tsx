
import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Upload, Camera, Trash } from 'lucide-react'
import { uploadMedia } from '@/lib/mediaManager'

interface MediaUploaderProps {
  memoryId: string
  userId: string
  onUploadComplete: (mediaItem: any) => void
  isPrivate?: boolean
  detectFaces?: boolean
  onError?: (err: Error) => void
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  memoryId,
  userId,
  onUploadComplete,
  isPrivate = false,
  detectFaces = false,
  onError
}) => {
  const [selectedFile, setSelectedFile] = useState<File|null>(null)
  const [preview, setPreview] = useState<string|null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }
  
  const handleUpload = async () => {
    if (!selectedFile) return
    setIsUploading(true)
    setUploadProgress(0)
    try {
      const meta = { detectFaces }
      const mediaItem = await uploadMedia({
        file: selectedFile,
        memoryId,
        userId,
        isPrivate,
        metadata: meta,
        progressCallback: (pct) => setUploadProgress(pct)
      })
      onUploadComplete(mediaItem)
      setSelectedFile(null)
      setPreview(null)
      setUploadProgress(0)
    } catch (err: any) {
      console.error('Upload error:', err)
      if (onError) onError(err)
    } finally {
      setIsUploading(false)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    setPreview(null)
    if (fileRef.current) {
      fileRef.current.value = ''
    }
  }

  return (
    <div>
      <input
        type="file"
        className="hidden"
        ref={fileRef}
        accept="image/*, video/*"
        onChange={handleFileChange}
      />
      {!selectedFile ? (
        <div
          className="border-2 border-dashed p-6 rounded-lg text-center cursor-pointer"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <p className="mb-2">Drag & drop or click to select a file</p>
          <div className="flex justify-center gap-2">
            <Button variant="outline" onClick={() => fileRef.current?.click()}><Upload size={16}/> Browse</Button>
            <Button variant="outline" onClick={() => {
              if (fileRef.current) {
                fileRef.current.setAttribute('capture','environment')
                fileRef.current.click()
              }
            }}>
              <Camera size={16}/> Camera
            </Button>
          </div>
        </div>
      ) : (
        <div className="border rounded p-2">
          {preview && (
            <div className="w-full aspect-video mb-2 flex items-center justify-center bg-gray-100">
              {selectedFile.type.startsWith('image/') ? (
                <img src={preview} alt="preview" className="max-h-full max-w-full object-contain" />
              ) : selectedFile.type.startsWith('video/') ? (
                <video src={preview} className="max-h-full max-w-full" controls/>
              ) : (
                <div>Unsupported file type</div>
              )}
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="truncate text-sm">{selectedFile.name}</span>
            <Button variant="ghost" size="icon" onClick={removeFile}><Trash size={16}/></Button>
          </div>
          {isUploading ? (
            <div>
              <Progress value={uploadProgress}/>
              <div className="text-right text-xs">{Math.round(uploadProgress)}%</div>
            </div>
          ) : (
            <Button onClick={handleUpload} className="w-full mt-2">Upload</Button>
          )}
        </div>
      )}
    </div>
  )
}
