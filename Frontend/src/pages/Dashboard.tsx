
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useUserActivities } from '../hooks/useUserActivities';
import { UserActivities } from '../components/UserActivities';
import Sidebar from '../components/Sidebar';
import TutorialPopup from '../components/TutorialPopup';
import { motion } from 'framer-motion';
import { Video, BarChart, FileText, Image, Plus, Clock, BookOpen, Youtube } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { trackActivity, activities } = useUserActivities();
  const [showTutorial, setShowTutorial] = useState(false);

  // Track dashboard page visit when component loads
  useEffect(() => {
    if (currentUser) {
      trackActivity('page_visited', { 
        page: 'Dashboard',
        timestamp: new Date().toISOString()
      });
      
      // Check if this is a new user (first time visiting dashboard)
      const hasSeenTutorial = localStorage.getItem(`tutorial_seen_${currentUser.uid}`);
      if (!hasSeenTutorial) {
        setShowTutorial(true);
      }
    }
  }, [currentUser, trackActivity]);

  const handleCloseTutorial = () => {
    setShowTutorial(false);
    if (currentUser) {
      localStorage.setItem(`tutorial_seen_${currentUser.uid}`, 'true');
    }
  };

  // Function to get last access time for a feature
  const getLastAccessTime = (featurePage: string) => {
    const pageActivity = activities.find(activity => 
      activity.activity_type === 'page_visited' && 
      activity.details?.page === featurePage
    );
    
    if (pageActivity) {
      return formatDistanceToNow(new Date(pageActivity.timestamp), { addSuffix: true });
    }
    
    return 'Never used';
  };

  const features = [
    {
      title: 'Video Generator',
      description: 'Create educational videos from Manim code',
      icon: Video,
      href: '/video-generator',
      color: 'from-red-500 to-pink-500',
      page: 'Video Generator'
    },
    {
      title: 'Graph Visualizer',
      description: 'Plot and analyze mathematical functions',
      icon: BarChart,
      href: '/graph-visualizer',
      color: 'from-blue-500 to-cyan-500',
      page: 'Graph Visualizer'
    },
    {
      title: 'Document Analyzer',
      description: 'Extract insights from uploaded documents',
      icon: FileText,
      href: '/document-analyzer',
      color: 'from-green-500 to-emerald-500',
      page: 'Document Analyzer'
    },
    {
      title: 'Canvas AI',
      description: 'Solve handwritten equations with AI',
      icon: Image,
      href: '/canvas-ai',
      color: 'from-purple-500 to-indigo-500',
      page: 'Canvas AI'
    },
    {
      title: 'YouTube Transcriber',
      description: 'Transcribe and chat with YouTube videos',
      icon: Youtube,
      href: '/youtube-transcriber',
      color: 'from-orange-500 to-red-500',
      page: 'YouTube Transcriber'
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
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {currentUser?.email?.split('@')[0] || 'User'}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Continue your learning journey with SketchMentor's AI-powered tools.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={feature.href}>
                  <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group bg-white dark:bg-gray-800">
                    <CardHeader className="pb-3">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="h-4 w-4 mr-1" />
                        {getLastAccessTime(feature.page)}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Recent Activity and Quick Start */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <UserActivities />
            </motion.div>

            {/* Quick Start Guide */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Getting Started
                  </CardTitle>
                  <CardDescription className="text-purple-100">
                    New to SketchMentor? Try these features first!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Create your first video with our Video Generator
                    </div>
                    <div className="flex items-center text-sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Transcribe a YouTube video and chat about it
                    </div>
                    <div className="flex items-center text-sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Visualize functions with the Graph Visualizer
                    </div>
                    <div className="flex items-center text-sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Upload a document to analyze and create quizzes
                    </div>
                    <Button variant="secondary" className="w-full mt-4">
                      View Tutorial
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <TutorialPopup 
        isOpen={showTutorial} 
        onClose={handleCloseTutorial}
      />
    </div>
  );
};

export default Dashboard;
