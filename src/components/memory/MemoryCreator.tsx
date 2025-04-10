import React, { useState } from 'react'
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useUser } from '@/hooks/useUser'
import { useTeams } from '@/hooks/useTeams'
import { createMemory } from '@/repositories/memoryRepository'
import { BatchMediaUploader } from '@/components/media/BatchMediaUploader'

export const MemoryCreator: React.FC<{
  onCreated?: (id: string) => void
}> = ({ onCreated }) => {
  const { user } = useUser()
  const { teams } = useTeams()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [teamId, setTeamId] = useState('')
  const [visibility, setVisibility] = useState<'public'|'private'|'shared'>('private')
  const [createdMemoryId, setCreatedMemoryId] = useState<string|null>(null)
  const [creating, setCreating] = useState(false)

  const handleCreate = async () => {
    if (!user) return
    setCreating(true)
    try {
      const mem = await createMemory({
        userId: user.id,
        title,
        description,
        teamId: teamId || undefined,
        visibility,
        tags: [],
        metadata: {}
        // Removed 'date' property as it's not part of CreateMemoryParams
      })
      setCreatedMemoryId(mem.id)
      onCreated?.(mem.id)
    } catch (err) {
      console.error('Error creating memory:', err)
    } finally {
      setCreating(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create Memory</CardTitle>
        <CardDescription>Preserve your sports moment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!createdMemoryId ? (
          <>
            <div>
              <Label>Title</Label>
              <Input value={title} onChange={e=>setTitle(e.target.value)}/>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea rows={3} value={description} onChange={e=>setDescription(e.target.value)}/>
            </div>
            <div>
              <Label>Team</Label>
              <select value={teamId} onChange={e=>setTeamId(e.target.value)} className="border rounded w-full">
                <option value="">No Team</option>
                {teams.map(t=>(
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Visibility</Label>
              <select value={visibility} onChange={e=>setVisibility(e.target.value as any)} className="border rounded w-full">
                <option value="private">Private</option>
                <option value="shared">Shared</option>
                <option value="public">Public</option>
              </select>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-600">Memory created! Upload media below:</p>
            <BatchMediaUploader
              memoryId={createdMemoryId}
              userId={user?.id || ''}
              onUploadComplete={items => console.log('Uploaded items:', items)}
            />
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        {!createdMemoryId ? (
          <Button onClick={handleCreate} disabled={!title.trim() || creating}>
            {creating ? 'Creating...' : 'Create Memory'}
          </Button>
        ) : (
          <Button variant="outline" onClick={()=>setCreatedMemoryId(null)}>
            Create Another
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
