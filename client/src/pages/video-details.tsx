import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Play, Trash2, Video, Home, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatBytes } from "@/lib/utils";
import { useLocation } from "wouter";

interface VideoFile {
  id: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  duration?: number;
  path: string;
  uploadedAt: Date;
}

export default function VideoDetails() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();

  const { data: videos = [], isLoading } = useQuery<VideoFile[]>({
    queryKey: ['/api/videos'],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/videos/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete video');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/videos'] });
      toast({ title: "Video deleted successfully!" });
    },
    onError: () => {
      toast({
        title: "Delete failed",
        description: "Could not delete the video",
        variant: "destructive",
      });
    },
  });

  const handlePlay = (video: VideoFile) => {
    window.open(`/api/videos/${video.id}/stream`, '_blank');
  };

  const handleDownload = (video: VideoFile) => {
    const link = document.createElement('a');
    link.href = `/api/videos/${video.id}/stream`;
    link.download = video.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDuration = (duration?: number) => {
    if (!duration) return 'Unknown';
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Video className="w-8 h-8" />
            Video Details
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View all uploaded videos with detailed information
          </p>
        </div>
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Videos ({videos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading videos...</div>
          ) : videos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No videos uploaded yet. Go to the video upload page to add videos!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {videos.map((video) => (
                    <TableRow key={video.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4 text-blue-500" />
                          {video.originalName}
                        </div>
                      </TableCell>
                      <TableCell>{formatBytes(video.size)}</TableCell>
                      <TableCell>{formatDuration(video.duration)}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                          {video.mimeType}
                        </span>
                      </TableCell>
                      <TableCell>{formatDate(video.uploadedAt)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePlay(video)}
                            className="flex items-center gap-1"
                            title="Play video"
                          >
                            <Play className="w-4 h-4" />
                            Play
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleDownload(video)}
                            className="flex items-center gap-1"
                            title="Download video"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteMutation.mutate(video.id)}
                            className="flex items-center gap-1"
                            title="Delete video"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}