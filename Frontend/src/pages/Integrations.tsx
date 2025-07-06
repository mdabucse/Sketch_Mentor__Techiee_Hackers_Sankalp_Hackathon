
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navigation from '../components/Navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Puzzle, Zap, Star, Globe, Smartphone, Monitor, Cloud } from 'lucide-react';

const Integrations = () => {
  const integrationCategories = [
    {
      icon: Globe,
      title: "Learning Management Systems",
      description: "Seamlessly integrate with popular LMS platforms",
      integrations: ["Canvas", "Blackboard", "Moodle", "Google Classroom"],
      status: "coming-soon"
    },
    {
      icon: Cloud,
      title: "Cloud Storage",
      description: "Connect with your favorite cloud storage providers",
      integrations: ["Google Drive", "Dropbox", "OneDrive", "iCloud"],
      status: "coming-soon"
    },
    {
      icon: Monitor,
      title: "Video Platforms",
      description: "Import and export content from video platforms",
      integrations: ["YouTube", "Vimeo", "Kaltura", "Panopto"],
      status: "coming-soon"
    },
    {
      icon: Smartphone,
      title: "Communication Tools",
      description: "Stay connected with messaging and communication apps",
      integrations: ["Slack", "Microsoft Teams", "Discord", "Zoom"],
      status: "coming-soon"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <Navigation />
      
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Link to="/">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Integrations
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Connect SketchMentor with your favorite tools and platforms to create a seamless learning ecosystem.
            </p>
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full">
              <Star className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
              <span className="text-purple-700 dark:text-purple-300 font-medium">Integrations Coming Soon</span>
            </div>
          </motion.div>

          {/* Coming Soon Notice */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <Card className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white border-0 shadow-2xl">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
                  <Puzzle className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Powerful Integrations in Development</h2>
                <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                  We're building seamless integrations with the tools you already use. Connect SketchMentor 
                  to your existing workflow and supercharge your learning experience.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white/10 rounded-lg p-4">
                    <Zap className="h-6 w-6 mx-auto mb-2" />
                    <p className="text-sm">One-Click Setup</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <Globe className="h-6 w-6 mx-auto mb-2" />
                    <p className="text-sm">Cross-Platform Sync</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <Star className="h-6 w-6 mx-auto mb-2" />
                    <p className="text-sm">Enterprise Ready</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/signup">
                    <Button size="lg" variant="secondary" className="text-lg px-8 py-4 bg-white text-purple-600 hover:bg-gray-100">
                      Get Early Access
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="text-lg px-8 py-4 text-white border-white hover:bg-white/10">
                    Request Integration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Integration Categories */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Planned Integrations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {integrationCategories.map((category, index) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="h-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 relative">
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      Coming Soon
                    </div>
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center opacity-70">
                        <category.icon className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-xl">{category.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                        {category.description}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {category.integrations.map((integration, idx) => (
                          <div key={idx} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-2 text-center text-sm opacity-70">
                            {integration}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* API Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-16"
          >
            <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
              <CardContent className="p-12 text-center">
                <h2 className="text-3xl font-bold mb-4">Custom Integrations</h2>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  Need a custom integration? Our API will allow developers to build powerful connections 
                  between SketchMentor and any platform or service.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/documentation">
                    <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                      View API Docs
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="text-lg px-8 py-4 text-white border-white hover:bg-white/10">
                    Contact Developer Team
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Integrations;
