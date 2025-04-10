
// lib/syncService.ts
import { uploadMedia } from './mediaManager'
import { createMemory } from '@/repositories/memoryRepository'
import {
  getPendingUploads,
  removePendingUpload,
  getPendingMemories,
  removePendingMemory
} from './offlineStorage'

export interface SyncProgress {
  total: number
  completed: number
  current: string
  success: number
  failed: number
}

type ProgressCallback = (p: SyncProgress) => void

export const syncOfflineData = async (
  progressCallback?: ProgressCallback
): Promise<{ success: boolean; syncedItems: number; failedItems: number }> => {
  let syncProgress: SyncProgress = {
    total: 0,
    completed: 0,
    current: '',
    success: 0,
    failed: 0
  }
  try {
    const pendingMemories = await getPendingMemories()
    const pendingUploads = await getPendingUploads()
    syncProgress.total = pendingMemories.length + pendingUploads.length

    if (progressCallback) {
      progressCallback(syncProgress)
    }

    // Sync memories
    for (const mem of pendingMemories) {
      syncProgress.current = `Syncing memory: ${mem.title}`
      if (progressCallback) progressCallback(syncProgress)
      try {
        const { pendingSync, ...memToCreate } = mem
        await createMemory(memToCreate)
        await removePendingMemory(mem.id)
        syncProgress.success++
      } catch {
        syncProgress.failed++
      } finally {
        syncProgress.completed++
        if (progressCallback) progressCallback(syncProgress)
      }
    }

    // Sync uploads
    for (const up of pendingUploads) {
      syncProgress.current = `Uploading media: ${up.file.name}`
      if (progressCallback) progressCallback(syncProgress)
      try {
        await uploadMedia({
          file: up.file,
          memoryId: up.memoryId,
          userId: up.userId,
          isPrivate: up.isPrivate,
          metadata: up.metadata
        })
        await removePendingUpload(up.id)
        syncProgress.success++
      } catch {
        syncProgress.failed++
      } finally {
        syncProgress.completed++
        if (progressCallback) progressCallback(syncProgress)
      }
    }

    return {
      success: true,
      syncedItems: syncProgress.success,
      failedItems: syncProgress.failed
    }
  } catch (error) {
    console.error('Sync error:', error)
    return {
      success: false,
      syncedItems: syncProgress.success,
      failedItems: syncProgress.failed
    }
  }
}

export const initializeAutoSync = (progressCallback?: ProgressCallback): () => void => {
  let syncInProgress = false

  const handleOnline = async () => {
    if (syncInProgress) return
    syncInProgress = true
    try {
      await syncOfflineData(progressCallback)
    } finally {
      syncInProgress = false
    }
  }
  window.addEventListener('online', handleOnline)
  if (navigator.onLine) handleOnline()
  return () => {
    window.removeEventListener('online', handleOnline)
  }
}
