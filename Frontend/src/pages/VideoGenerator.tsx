import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import { Play, Download, Wand2, Video, Sparkles, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useUserActivities } from '@/hooks/useUserActivities';

interface VideoGenerationResponse {
  success: boolean;
  message: string;
  query: string;
  video_filename: string;
  video_path: string;
  code_path?: string;
  trans_path?: string;
}

const VideoGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoData, setVideoData] = useState<VideoGenerationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { trackActivity } = useUserActivities();

  // Track page access when component mounts
  useEffect(() => {
    const trackPageVisit = async () => {
      try {
        await trackActivity('page_visited', { 
          page: 'Video Generator',
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.warn('Failed to track page visit:', error);
        // Don't show error to user for tracking failures
      }
    };

    trackPageVisit();
  }, [trackActivity]);

  const safeTrackActivity = async (action: string, data: any) => {
    try {
      await trackActivity(action, data);
    } catch (error) {
      console.warn(`Failed to track activity: ${action}`, error);
      // Continue without throwing - tracking failures shouldn't break the app
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a question to generate a video');
      return;
    }
    
    setIsGenerating(true);
    setVideoUrl('');
    setVideoData(null);
    setError(null);

    // Track video generation attempt
    await safeTrackActivity('video_generation_started', { 
      prompt: prompt.slice(0, 100) + (prompt.length > 100 ? '...' : ''),
      timestamp: new Date().toISOString(),
      attempt: retryCount + 1
    });

    try {
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout for video generation

      const response = await fetch('http://localhost:5001/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: prompt // Changed from 'prompt' to 'query' to match your API format
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`API Error: ${response.status} ${response.statusText}. ${errorText}`);
      }

      const data: VideoGenerationResponse = await response.json();
      
      if (data.success && data.video_path) {
        setVideoData(data);
        
        // Convert the local file path to a URL that can be served
        // Assuming your backend serves videos from a static endpoint
        const videoFileName = data.video_filename;
        const videoServeUrl = `http://localhost:5001/video/${videoFileName}`;
        setVideoUrl(videoServeUrl);
        
        setRetryCount(0); // Reset retry count on success
        
        // Track successful video generation
        await safeTrackActivity('video_generated', { 
          title: prompt.slice(0, 50) + (prompt.length > 50 ? '...' : ''),
          query: prompt,
          timestamp: new Date().toISOString(),
          videoUrl: videoServeUrl,
          videoFilename: data.video_filename,
          success: data.success,
          message: data.message
        });
        
        toast.success(data.message || 'Video generated successfully!');
      } else {
        throw new Error(data.message || 'Failed to generate video. Please check your input and try again.');
      }

    } catch (error) {
      console.error('Error generating video:', error);
      
      let errorMessage = 'Failed to generate video. Please try again.';
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Request timed out. Video generation is taking longer than expected. Please try again.';
        } else if (error.message.includes('CORS')) {
          errorMessage = 'Connection error. Please ensure your API server is running and configured properly.';
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Cannot connect to the video generation service. Please check if the server is running on port 5001.';
        } else if (error.message.includes('ERR_NAME_NOT_RESOLVED')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        } else if (error.message.includes('400')) {
          errorMessage = 'Invalid request. Please check your input and try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      setRetryCount(prev => prev + 1);
      
      // Track failed video generation
      await safeTrackActivity('video_generation_failed', { 
        query: prompt.slice(0, 100) + (prompt.length > 100 ? '...' : ''),
        error: errorMessage,
        timestamp: new Date().toISOString(),
        attempt: retryCount + 1
      });
      
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    handleGenerate();
  };

  const handleDownload = async () => {
    if (videoUrl && videoData) {
      try {
        // Track video download attempt
        await safeTrackActivity('video_download_started', { 
          title: prompt.slice(0, 50) + (prompt.length > 50 ? '...' : ''),
          videoFilename: videoData.video_filename,
          timestamp: new Date().toISOString()
        });

        // Create download link
        const response = await fetch(videoUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch video for download');
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = videoData.video_filename || `generated-video-${Date.now()}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the blob URL
        window.URL.revokeObjectURL(url);

        // Track successful download
        await safeTrackActivity('video_downloaded', { 
          title: prompt.slice(0, 50) + (prompt.length > 50 ? '...' : ''),
          videoFilename: videoData.video_filename,
          timestamp: new Date().toISOString()
        });

        toast.success('Video downloaded successfully!');
      } catch (error) {
        console.error('Download error:', error);
        toast.error('Failed to download video. Please try again.');
        
        await safeTrackActivity('video_download_failed', { 
          title: prompt.slice(0, 50) + (prompt.length > 50 ? '...' : ''),
          videoFilename: videoData?.video_filename,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        });
      }
    }
  };

  const examplePrompts = [
    {
      title: "Two Sum Problem",
      description: "Visualize the classic LeetCode Two Sum algorithm",
      prompt: "Leetcode two sum problem"
    },
    {
      title: "Binary Search",
      description: "Understand binary search algorithm with visualization",
      prompt: "Binary search algorithm explanation"
    },
    {
      title: "Bubble Sort",
      description: "See how bubble sort works step by step",
      prompt: "Bubble sort algorithm visualization"
    },
    {
      title: "Linked List Reversal",
      description: "Learn how to reverse a linked list",
      prompt: "How to reverse a linked list"
    },
    {
      title: "Pythagorean Theorem",
      description: "Mathematical proof with visual demonstration",
      prompt: "Explain the Pythagorean theorem with a visual demonstration"
    },
    {
      title: "Photosynthesis Process",
      description: "Illustrate how plants convert sunlight to energy",
      prompt: "How does photosynthesis work in plants?"
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
              <Video className="h-8 w-8 mr-3 text-purple-600" />
              AI Video Generator
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create educational videos from simple text prompts using AI-powered animation and Manim.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Prompt Input */}
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wand2 className="h-5 w-5 mr-2" />
                  What do you want to learn?
                </CardTitle>
                <CardDescription>
                  Ask any question and we'll create an educational video to explain it
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[200px]"
                    placeholder="Ask any question you want to learn about. For example: 'Leetcode two sum problem', 'Binary search algorithm', 'How does gravity work?'"
                    disabled={isGenerating}
                  />
                  
                  {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                          {retryCount > 0 && (
                            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                              Attempt {retryCount + 1}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {videoData && (
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <Video className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                            {videoData.message}
                          </p>
                          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                            File: {videoData.video_filename}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button 
                      onClick={handleGenerate} 
                      disabled={isGenerating || !prompt.trim()}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      {isGenerating ? (
                        <>
                          <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                          Creating Video...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Create Video
                        </>
                      )}
                    </Button>
                    
                    {error && !isGenerating && (
                      <Button 
                        onClick={handleRetry}
                        variant="outline"
                        className="px-3"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Video Preview */}
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Your Video</CardTitle>
                <CardDescription>
                  Generated video will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isGenerating ? (
                  <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4"></div>
                        <Sparkles className="h-6 w-6 text-purple-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 font-medium">AI is creating your video...</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">This may take a few minutes</p>
                    </div>
                  </div>
                ) : videoUrl ? (
                  <div className="space-y-4">
                    <div className="aspect-video bg-black rounded-lg overflow-hidden">
                      <video 
                        controls 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          console.error('Video playback error:', e);
                          toast.error('Error loading video. Please try generating again.');
                        }}
                      >
                        <source src={videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => {
                          const video = document.querySelector('video');
                          if (video) {
                            if (video.paused) {
                              video.play();
                            } else {
                              video.pause();
                            }
                          }
                        }}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Play Video
                      </Button>
                      <Button variant="outline" className="flex-1" onClick={handleDownload}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Video className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 dark:text-gray-400">Ask a question to generate your video</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">AI will create educational content based on your question</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Example Prompts */}
          <Card className="mt-8 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2" />
                Example Questions
              </CardTitle>
              <CardDescription>Click on any example to load it as your question</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {examplePrompts.map((example, index) => (
                  <div 
                    key={index}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-transparent hover:border-purple-200 dark:hover:border-purple-700"
                    onClick={() => {
                      setPrompt(example.prompt);
                      setError(null); // Clear any existing errors
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{example.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{example.description}</p>
                        <div className="flex items-center text-xs text-purple-600 dark:text-purple-400">
                          <Clock className="h-3 w-3 mr-1" />
                          Click to use this question
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default VideoGenerator;
