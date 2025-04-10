
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Plus } from 'lucide-react'
import { format } from 'date-fns'
import { BatchMediaUploader } from '@/components/media/BatchMediaUploader'
import { useUser } from '@/hooks/useUser'
import { useTeams } from '@/hooks/useTeams'
import { createMemory } from '@/repositories/memoryRepository'
import { toast } from 'sonner'

interface MemoryCreatorProps {
  onComplete: (memoryId: string) => void
}

export const MemoryCreator: React.FC<MemoryCreatorProps> = ({ onComplete }) => {
  const { user } = useUser()
  const { teams } = useTeams()
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [eventDate, setEventDate] = useState<Date | undefined>(new Date())
  const [isPrivate, setIsPrivate] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<string | undefined>()
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [mediaItems, setMediaItems] = useState<any[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [memoryId, setMemoryId] = useState<string | null>(null)
  
  const handleAddTag = () => {
    if (!tagInput.trim()) return
    setTags(prev => [...new Set([...prev, tagInput.trim()])])
    setTagInput('')
  }
  
  const handleRemoveTag = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag))
  }
  
  const handleMediaUpload = (items: any[]) => {
    setMediaItems(prev => [...prev, ...items])
  }
  
  const handleCreateMemory = async () => {
    if (!user?.id) return
    if (!title.trim()) {
      toast.error('Please enter a title')
      return
    }
    
    setIsCreating(true)
    try {
      // In a real app, you'd validate everything before proceeding
      const memory = await createMemory({
        title,
        description,
        userId: user.id,
        date: eventDate,
        isPrivate,
        teamId: selectedTeam,
        tags,
        media: mediaItems.map(item => item.id)
      })
      
      setMemoryId(memory.id)
      toast.success('Memory created successfully')
      onComplete(memory.id)
    } catch (err: any) {
      console.error('Error creating memory:', err)
      toast.error('Failed to create memory')
    } finally {
      setIsCreating(false)
    }
  }
  
  // If we don't have a memory ID yet, we need to create one 
  // to attach media to during the upload process
  const getMemoryId = (): string => {
    if (!memoryId) {
      // This would be a UUID in a real app
      const tempId = `temp-${Date.now()}`
      setMemoryId(tempId)
      return tempId
    }
    return memoryId
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create New Memory</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              placeholder="Enter a title for your memory"
              value={title}
              onChange={e => setTitle(e.target.value)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="What happened in this memory?"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Event Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {eventDate ? format(eventDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={eventDate}
                    onSelect={setEventDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>Team</Label>
              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal</SelectItem>
                  {teams.map(team => (
                    <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map(tag => (
                <div key={tag} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md flex items-center gap-1">
                  <span>{tag}</span>
                  <button 
                    className="ml-1 text-secondary-foreground/70 hover:text-secondary-foreground"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add tags"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddTag()}
              />
              <Button type="button" size="icon" onClick={handleAddTag}>
                <Plus size={16}/>
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="private" 
              checked={isPrivate} 
              onCheckedChange={(checked) => setIsPrivate(checked === true)}
            />
            <Label htmlFor="private">Make this memory private</Label>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Media</Label>
          {user?.id && (
            <BatchMediaUploader
              memoryId={getMemoryId()}
              userId={user.id}
              onUploadComplete={handleMediaUpload}
              isPrivate={isPrivate}
              detectFaces={true}
            />
          )}
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleCreateMemory} disabled={isCreating || !title.trim()}>
            {isCreating ? "Creating..." : "Create Memory"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default MemoryCreator
