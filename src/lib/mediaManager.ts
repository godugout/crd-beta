
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'sonner'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export interface MediaUploadOptions {
  file: File
  memoryId: string
  userId: string
  isPrivate?: boolean
  metadata?: Record<string, any>
  detectFaces?: boolean
  progressCallback?: (progress: number) => void
}

export interface MediaRecord {
  id?: string
  memoryId: string
  type: 'image' | 'video' | 'audio' | 'unknown'
  url: string
  thumbnailUrl?: string
  originalFilename: string
  size: number
  mimeType: string
  width?: number
  height?: number
  duration?: number
  metadata: Record<string, any>
}

export const mediaManager = {
  async uploadMedia({
    file,
    memoryId,
    userId,
    isPrivate = false,
    metadata = {},
    detectFaces = false,
    progressCallback
  }: MediaUploadOptions): Promise<MediaRecord> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${uuidv4()}.${fileExt}`
      const filePath = `${isPrivate ? 'private' : 'public'}/${userId}/${memoryId}/${fileName}`
      
      let mediaType: MediaRecord['type'] = 'unknown'
      if (file.type.startsWith('image/')) mediaType = 'image'
      else if (file.type.startsWith('video/')) mediaType = 'video'
      else if (file.type.startsWith('audio/')) mediaType = 'audio'
      
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })
      
      if (uploadError) {
        toast.error(`Upload failed: ${uploadError.message}`)
        throw uploadError
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath)
      
      // Prepare media record
      const mediaRecord: Omit<MediaRecord, 'id'> = {
        memoryId,
        type: mediaType,
        url: publicUrl,
        originalFilename: file.name,
        size: file.size,
        mimeType: file.type,
        metadata: {
          ...metadata,
          detectFaces
        }
      }
      
      // Insert media record into database
      const { data: savedMedia, error: dbError } = await supabase
        .from('media')
        .insert(mediaRecord)
        .select()
        .single()
      
      if (dbError) {
        toast.error(`Database error: ${dbError.message}`)
        throw dbError
      }
      
      toast.success('Media uploaded successfully')
      return savedMedia
      
    } catch (error) {
      console.error('Media upload error:', error)
      toast.error('Failed to upload media')
      throw error
    }
  },
  
  async getMediaByMemoryId(memoryId: string): Promise<MediaRecord[]> {
    try {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .eq('memory_id', memoryId)
        .order('created_at', { ascending: true })
      
      if (error) {
        toast.error(`Failed to fetch media: ${error.message}`)
        throw error
      }
      
      return data || []
    } catch (error) {
      console.error('Get media error:', error)
      toast.error('Failed to retrieve media')
      throw error
    }
  },
  
  async deleteMedia(mediaId: string, userId: string): Promise<void> {
    try {
      // First, fetch the media details to get the file path
      const { data: media, error: fetchError } = await supabase
        .from('media')
        .select('*')
        .eq('id', mediaId)
        .single()
      
      if (fetchError) {
        toast.error(`Media not found: ${fetchError.message}`)
        throw fetchError
      }
      
      // Extract file path from URL
      const urlParts = media.url.split('/media/')
      const filePath = urlParts[1]
      
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('media')
        .remove([filePath])
      
      if (storageError) {
        toast.error(`Storage deletion failed: ${storageError.message}`)
        throw storageError
      }
      
      // Delete from database
      const { error: dbError } = await supabase
        .from('media')
        .delete()
        .eq('id', mediaId)
      
      if (dbError) {
        toast.error(`Database deletion failed: ${dbError.message}`)
        throw dbError
      }
      
      toast.success('Media deleted successfully')
    } catch (error) {
      console.error('Media deletion error:', error)
      toast.error('Failed to delete media')
      throw error
    }
  }
}
