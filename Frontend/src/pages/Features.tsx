
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navigation from '../components/Navigation';
import { motion } from 'framer-motion';
import { Video, BarChart, FileText, Image, Youtube, ArrowLeft, Star, Zap, Target, Sparkles } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Video,
      title: "AI Video Generator",
      description: "Transform mathematical concepts into engaging educational videos using advanced Manim integration and AI-powered narration.",
      benefits: [
        "Automated video creation from text descriptions",
        "Professional mathematical animations",
        "AI-generated voice narration",
        "Customizable visual styles"
      ],
      gradient: "from-red-500 to-pink-500"
    },
    {
      icon: BarChart,
      title: "Interactive Graph Visualizer",
      description: "Create stunning 2D and 3D mathematical visualizations with real-time plotting and interactive exploration tools.",
      benefits: [
        "Real-time function plotting",
        "3D mathematical visualizations",
        "Interactive parameter adjustment",
        "Export capabilities"
      ],
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: FileText,
      title: "Smart Document Analyzer",
      description: "Upload educational content and automatically generate quizzes, flashcards, and personalized learning pathways.",
      benefits: [
        "AI-powered content analysis",
        "Automatic quiz generation",
        "Flashcard creation",
        "Personalized learning paths"
      ],
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Image,
      title: "Canvas AI Solver",
      description: "Draw mathematical equations by hand and get instant step-by-step solutions with detailed explanations.",
      benefits: [
        "Handwriting recognition",
        "Step-by-step solutions",
        "Multiple solving methods",
        "Interactive problem solving"
      ],
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      icon: Youtube,
      title: "YouTube Transcriber",
      description: "Extract transcriptions from educational videos and chat with AI to deepen your understanding of the content.",
      benefits: [
        "Automatic video transcription",
        "AI-powered content chat",
        "Key concept extraction",
        "Study note generation"
      ],
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const comingSoonFeatures = [
    {
      icon: Zap,
      title: "Live Collaboration",
      description: "Real-time collaborative learning with classmates and teachers.",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: Target,
      title: "Adaptive Learning",
      description: "Personalized learning paths that adapt to your progress.",
      gradient: "from-teal-500 to-blue-500"
    },
    {
      icon: Sparkles,
      title: "AR Visualizations",
      description: "Augmented reality for immersive mathematical experiences.",
      gradient: "from-pink-500 to-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <Navigation />
      
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
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
                Powerful Features
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover all the AI-powered tools that make SketchMentor the ultimate platform for mathematical learning and teaching.
            </p>
          </motion.div>

          {/* Current Features */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Available Now
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="h-full bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center shadow-lg`}>
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-center text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
                        {feature.description}
                      </p>
                      <ul className="space-y-2">
                        {feature.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-center space-x-2">
                            <Star className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Coming Soon Features */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Coming Soon
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {comingSoonFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + 0.1 * index }}
                >
                  <Card className="h-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 relative overflow-hidden">
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      Coming Soon
                    </div>
                    <CardHeader>
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center shadow-lg opacity-70`}>
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-center text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-300 text-center">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 text-white"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Experience These Features?</h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Start using SketchMentor today and unlock the power of AI-driven mathematical learning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="text-lg px-8 py-4 text-white border-white hover:bg-white/10">
                  View Pricing
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Features;
