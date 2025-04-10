
// lib/offlineStorage.ts
import localforage from 'localforage'
import { v4 as uuidv4 } from 'uuid'

localforage.config({
  name: 'OakFanMediaStorage',
  storeName: 'media'
})

export interface PendingUpload {
  id: string
  file: File
  memoryId: string
  userId: string
  metadata: Record<string, any>
  createdAt: number
  isPrivate: boolean
}

export const saveForOfflineUpload = async (
  file: File,
  memoryId: string,
  userId: string,
  metadata: Record<string, any> = {},
  isPrivate = false
): Promise<string> => {
  const id = uuidv4()
  const pendingUpload: PendingUpload = {
    id,
    file,
    memoryId,
    userId,
    metadata,
    createdAt: Date.now(),
    isPrivate
  }
  await localforage.setItem(`pending-upload-${id}`, pendingUpload)
  return id
}

export const getPendingUploads = async (): Promise<PendingUpload[]> => {
  const keys = await localforage.keys()
  const pendingKeys = keys.filter(k => k.startsWith('pending-upload-'))
  const uploads: PendingUpload[] = []
  for (const key of pendingKeys) {
    const item = await localforage.getItem<PendingUpload>(key)
    if (item) uploads.push(item)
  }
  return uploads.sort((a, b) => a.createdAt - b.createdAt)
}

export const removePendingUpload = async (id: string) => {
  await localforage.removeItem(`pending-upload-${id}`)
}

// For offline memory creation, if desired:
export const saveMemoryForOffline = async (memory: Record<string, any>): Promise<string> => {
  const id = memory.id || uuidv4()
  memory.id = id
  memory.pendingSync = true
  memory.createdAt = memory.createdAt || Date.now()
  await localforage.setItem(`pending-memory-${id}`, memory)
  return id
}

export const getPendingMemories = async (): Promise<Record<string, any>[]> => {
  const keys = await localforage.keys()
  const pendingKeys = keys.filter(k => k.startsWith('pending-memory-'))
  const memories: Record<string, any>[] = []
  for (const key of pendingKeys) {
    const item = await localforage.getItem<Record<string, any>>(key)
    if (item) memories.push(item)
  }
  return memories.sort((a, b) => b.createdAt - a.createdAt)
}

export const removePendingMemory = async (id: string) => {
  await localforage.removeItem(`pending-memory-${id}`)
}
