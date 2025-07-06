
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserActivities } from '@/hooks/useUserActivities';
import { Clock, Video, BarChart, FileText, Image, Youtube, Globe, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const getActivityIcon = (activityType: string) => {
  switch (activityType) {
    case 'video_generated':
    case 'video_generation_started':
    case 'video_downloaded':
    case 'video_generation_failed':
      return Video;
    case 'graph_visualized':
      return BarChart;
    case 'document_analyzed':
      return FileText;
    case 'canvas_used':
      return Image;
    case 'youtube_transcribed':
      return Youtube;
    case 'page_visited':
      return getPageIcon;
    default:
      return Clock;
  }
};

const getPageIcon = (details: any) => {
  const page = details?.page?.toLowerCase();
  switch (page) {
    case 'video generator':
      return Video;
    case 'graph visualizer':
      return BarChart;
    case 'document analyzer':
      return FileText;
    case 'canvas ai':
      return Image;
    case 'youtube transcriber':
      return Youtube;
    default:
      return Globe;
  }
};

const getActivityColor = (activityType: string) => {
  switch (activityType) {
    case 'video_generated':
    case 'video_downloaded':
      return 'text-green-600';
    case 'video_generation_started':
      return 'text-blue-600';
    case 'video_generation_failed':
      return 'text-red-600';
    case 'graph_visualized':
      return 'text-blue-600';
    case 'document_analyzed':
      return 'text-green-600';
    case 'canvas_used':
      return 'text-purple-600';
    case 'youtube_transcribed':
      return 'text-orange-600';
    case 'page_visited':
      return getPageColor;
    default:
      return 'text-gray-500';
  }
};

const getPageColor = (details: any) => {
  const page = details?.page?.toLowerCase();
  switch (page) {
    case 'video generator':
      return 'text-red-600';
    case 'graph visualizer':
      return 'text-blue-600';
    case 'document analyzer':
      return 'text-green-600';
    case 'canvas ai':
      return 'text-purple-600';
    case 'youtube transcriber':
      return 'text-orange-600';
    default:
      return 'text-indigo-600';
  }
};

const formatActivityTitle = (activityType: string, details: any) => {
  switch (activityType) {
    case 'video_generated':
      return details?.title || 'Video Generated';
    case 'video_generation_started':
      return 'Started Video Generation';
    case 'video_generation_failed':
      return 'Video Generation Failed';
    case 'video_downloaded':
      return 'Downloaded Video';
    case 'graph_visualized':
      return 'Visualized Graph';
    case 'document_analyzed':
      return details?.filename ? `Analyzed ${details.filename}` : 'Document Analyzed';
    case 'canvas_used':
      return 'Used Canvas AI';
    case 'youtube_transcribed':
      return details?.title || 'YouTube Video Transcribed';
    case 'page_visited':
      return `Opened ${details?.page || 'Feature'}`;
    default:
      return 'Activity';
  }
};

const getActivityDescription = (activityType: string, details: any) => {
  switch (activityType) {
    case 'video_generated':
    case 'video_generation_started':
      return details?.prompt ? `"${details.prompt.slice(0, 60)}${details.prompt.length > 60 ? '...' : ''}"` : '';
    case 'video_generation_failed':
      return details?.error ? `Error: ${details.error.slice(0, 50)}${details.error.length > 50 ? '...' : ''}` : '';
    case 'graph_visualized':
      return details?.function ? `Function: ${details.function}` : '';
    case 'document_analyzed':
      return 'Generated quizzes and study materials';
    case 'page_visited':
      return `Accessed ${details?.page || 'feature'}`;
    default:
      return '';
  }
};

export const UserActivities = () => {
  const { activities, loading } = useUserActivities();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Recently Accessed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Recently Accessed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-gray-500 text-sm">No activities yet. Start using the tools to see your activity history!</p>
          ) : (
            activities.map((activity) => {
              let Icon, colorClass;
              
              if (activity.activity_type === 'page_visited') {
                Icon = getPageIcon(activity.details);
                colorClass = getPageColor(activity.details);
              } else {
                Icon = getActivityIcon(activity.activity_type);
                colorClass = getActivityColor(activity.activity_type);
              }
              
              const title = formatActivityTitle(activity.activity_type, activity.details);
              const description = getActivityDescription(activity.activity_type, activity.details);
              
              return (
                <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-lg bg-white dark:bg-gray-800 shadow-sm border flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${colorClass}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {title}
                    </p>
                    {description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {description}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};
