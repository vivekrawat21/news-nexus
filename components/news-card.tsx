import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, MessageCircle, Share2 } from 'lucide-react'

interface NewsCardProps {
  title: string
  source: string
  views: string
  comments: string
  time: string
  imageUrl: string
}

export function NewsCard({ title, source, views, comments, time, imageUrl }: NewsCardProps) {
  return (
    <Card className="overflow-hidden h-full">
      <div className="aspect-video relative">
        <img
          src={imageUrl}
          alt={title}
          className="object-cover w-full h-full"
        />
      </div>
      <CardHeader className="p-4">
        <CardTitle className="text-sm font-medium line-clamp-2">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:justify-between text-sm text-muted-foreground">
          <span>{source}</span>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="h-4 w-4" />
              <span>{comments}</span>
            </div>
            <div className="flex items-center">
              <Share2 className="h-4 w-4" />
            </div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-2">{time}</div>
      </CardContent>
    </Card>
  )
}

