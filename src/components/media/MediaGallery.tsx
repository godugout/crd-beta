
import React, { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X, Download, Share, ChevronLeft, ChevronRight } from 'lucide-react'

interface MediaItem {
  id: string
  type: 'image' | 'video' | 'audio'
  url: string
  thumbnailUrl: string
  originalFilename: string
}

interface MediaGalleryProps {
  media: MediaItem[]
  onShare?: (id: string) => void
  allowDownload?: boolean
  allowShare?: boolean
}

export const MediaGallery: React.FC<MediaGalleryProps> = ({
  media,
  onShare,
  allowDownload = true,
  allowShare = true
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(-1)

  const openMedia = (idx: number) => setActiveIndex(idx)
  const closeMedia = () => setActiveIndex(-1)

  const handleNext = () => {
    if (activeIndex < media.length - 1) setActiveIndex(activeIndex+1)
  }
  const handlePrev = () => {
    if (activeIndex>0) setActiveIndex(activeIndex-1)
  }
  const handleDownload = (item: MediaItem) => {
    const a = document.createElement('a')
    a.href = item.url
    a.download = item.originalFilename
    a.click()
  }

  const activeItem = activeIndex>=0 && media[activeIndex]

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {media.map((item, index) => (
          <div key={item.id} 
            className="border rounded overflow-hidden cursor-pointer"
            onClick={()=>openMedia(index)}
          >
            <div className="aspect-square bg-black flex items-center justify-center">
              {item.type==='image' ? (
                <img src={item.thumbnailUrl||item.url} className="object-cover w-full h-full"/>
              ) : item.type==='video' ? (
                <div className="relative w-full h-full">
                  <img src={item.thumbnailUrl} className="object-cover w-full h-full"/>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black bg-opacity-50 p-3 rounded-full text-white">▶</div>
                  </div>
                </div>
              ) : (
                <div className="text-white px-2">AUDIO</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={activeIndex>=0} onOpenChange={closeMedia}>
        <DialogContent className="max-w-5xl w-full h-[90vh] p-0 flex flex-col">
          {activeItem && (
            <>
              <div className="p-4 flex justify-between bg-white items-center">
                <div className="truncate">{activeItem.originalFilename}</div>
                <div className="flex gap-2">
                  {allowDownload && (
                    <Button variant="ghost" size="icon" onClick={()=>handleDownload(activeItem)}>
                      <Download size={18}/>
                    </Button>
                  )}
                  {allowShare && onShare && (
                    <Button variant="ghost" size="icon" onClick={()=>onShare(activeItem.id)}>
                      <Share size={18}/>
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={closeMedia}><X size={18}/></Button>
                </div>
              </div>
              <div className="flex-1 relative bg-black flex items-center justify-center">
                {activeItem.type==='image' ? (
                  <img src={activeItem.url} className="max-w-full max-h-full object-contain"/>
                ) : activeItem.type==='video' ? (
                  <video src={activeItem.url} controls autoPlay className="max-w-full max-h-full"/>
                ) : (
                  <audio src={activeItem.url} controls className="w-full"/>
                )}
                {activeIndex>0 && (
                  <Button variant="ghost" size="icon"
                    className="absolute left-4 bg-black bg-opacity-50 text-white"
                    onClick={handlePrev}
                  >
                    <ChevronLeft size={20}/>
                  </Button>
                )}
                {activeIndex<media.length-1 && (
                  <Button variant="ghost" size="icon"
                    className="absolute right-4 bg-black bg-opacity-50 text-white"
                    onClick={handleNext}
                  >
                    <ChevronRight size={20}/>
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default MediaGallery;
