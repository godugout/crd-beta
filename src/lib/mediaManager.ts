
// lib/mediaManager.ts
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'
import { extractImageMetadata, extractVideoMetadata } from '@/lib/metadataExtractor'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export interface MediaUploadOptions {
  file: File
  memoryId: string
  userId: string
  isPrivate?: boolean
  metadata?: Record<string, any>
  progressCallback?: (progress: number) => void
}

export interface MediaRecord {
  id?: string
  memoryId: string
  type: 'image' | 'video' | 'audio' | 'unknown'
  url: string
  thumbnailUrl: string
  originalFilename: string
  size: number
  mimeType: string
  width?: number
  height?: number
  duration?: number
  metadata: Record<string, any>
}

export const uploadMedia = async ({
  file,
  memoryId,
  userId,
  isPrivate = false,
  metadata = {},
  progressCallback
}: MediaUploadOptions): Promise<MediaRecord> => {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `${isPrivate ? 'private' : 'public'}/${userId}/${memoryId}/${fileName}`
    let mediaType: MediaRecord['type'] = 'unknown'
    if (file.type.startsWith('image/')) mediaType = 'image'
    else if (file.type.startsWith('video/')) mediaType = 'video'
    else if (file.type.startsWith('audio/')) mediaType = 'audio'

    const { error: uploadErr } = await supabase.storage
      .from('media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        onUploadProgress: progress => {
          if (progressCallback) {
            progressCallback(progress.percent || 0)
          }
        }
      })

    if (uploadErr) throw uploadErr

    // Public URL (or signed URL if isPrivate)
    // For demonstration, we'll get a public link for all:
    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(filePath)

    // Extract metadata
    let extracted: any = {}
    let thumbnailUrl = publicUrl

    if (mediaType === 'image') {
      extracted = await extractImageMetadata(file)
      // thumbnailUrl = some function to create & upload a thumbnail
      // omitted here for brevity; use the full-size URL
    } else if (mediaType === 'video') {
      extracted = await extractVideoMetadata(file)
      // thumbnailUrl = some function to create & upload a video poster
    }

    const mediaRecord: MediaRecord = {
      memoryId,
      type: mediaType,
      url: publicUrl,
      thumbnailUrl,
      originalFilename: file.name,
      size: file.size,
      mimeType: file.type,
      width: extracted.dimensions?.width,
      height: extracted.dimensions?.height,
      duration: extracted.duration,
      metadata: { ...metadata, ...extracted }
    }

    // Save to DB
    const { data, error } = await supabase
      .from('media')
      .insert(mediaRecord)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error uploading media:', error)
    throw error
  }
}

export const deleteMedia = async (mediaId: string, userId: string) => {
  const { data: media, error: fetchError } = await supabase
    .from('media')
    .select('*')
    .eq('id', mediaId)
    .single()
  if (fetchError) throw fetchError

  // TODO: Confirm ownership if needed
  const filePath = media.url.split('/media/')[1]

  const { error: storageError } = await supabase.storage
    .from('media')
    .remove([filePath])
  if (storageError) throw storageError

  if (media.thumbnailUrl && media.thumbnailUrl !== media.url) {
    const thumbPath = media.thumbnailUrl.split('/media/')[1]
    await supabase.storage.from('media').remove([thumbPath])
  }

  const { error: dbError } = await supabase
    .from('media')
    .delete()
    .eq('id', mediaId)
  if (dbError) throw dbError

  return { success: true }
}
