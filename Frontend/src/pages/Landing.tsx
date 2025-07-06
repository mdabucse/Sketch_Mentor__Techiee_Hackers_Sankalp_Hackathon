import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navigation from '../components/Navigation';
import { motion } from 'framer-motion';
import { Video, BarChart, FileText, Image, CheckCircle, Users, Star, ArrowRight, Play, Youtube } from 'lucide-react';
const Landing = () => {
  const features = [{
    icon: Video,
    title: "AI Video Generator",
    description: "Transform mathematical concepts into engaging educational videos using advanced Manim integration and AI-powered narration.",
    gradient: "from-red-500 to-pink-500"
  }, {
    icon: BarChart,
    title: "Interactive Graph Visualizer",
    description: "Create stunning 2D and 3D mathematical visualizations with real-time plotting and interactive exploration tools.",
    gradient: "from-blue-500 to-cyan-500"
  }, {
    icon: FileText,
    title: "Smart Document Analyzer",
    description: "Upload educational content and automatically generate quizzes, flashcards, and personalized learning pathways.",
    gradient: "from-green-500 to-emerald-500"
  }, {
    icon: Image,
    title: "Canvas AI Solver",
    description: "Draw mathematical equations by hand and get instant step-by-step solutions with detailed explanations.",
    gradient: "from-purple-500 to-indigo-500"
  }, {
    icon: Youtube,
    title: "YouTube Transcriber",
    description: "Extract transcriptions from educational videos and chat with AI to deepen your understanding of the content.",
    gradient: "from-orange-500 to-red-500"
  }];
  const benefits = ["Accelerate learning with AI-powered explanations", "Visual learning through interactive content", "Personalized study materials generation", "24/7 intelligent tutoring assistance", "Multi-modal learning approach", "Real-time problem solving support"];
  const stats = [{
    number: "50K+",
    label: "Active Learners"
  }, {
    number: "1M+",
    label: "Problems Solved"
  }, {
    number: "95%",
    label: "Success Rate"
  }, {
    number: "24/7",
    label: "AI Support"
  }];
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <Navigation />
      
      {/* Hero Section */}
      <motion.section initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.8
    }} className="pt-20 pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 dark:from-purple-400/5 dark:to-blue-400/5"></div>
        <div className="max-w-7xl mx-auto text-center relative">
          <motion.div initial={{
          scale: 0.9
        }} animate={{
          scale: 1
        }} transition={{
          duration: 0.8,
          delay: 0.2
        }} className="mb-8">
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Master Mathematics
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">
                with AI-Powered Learning
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
              Transform your learning experience with cutting-edge AI tools that make complex mathematical concepts 
              intuitive and engaging through interactive videos, visualizations, and personalized tutoring.
            </p>
          </motion.div>
          
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.6
        }} className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/signup">
              <Button size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all">
                Start Learning Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-2 hover:bg-gray-50 dark:hover:bg-gray-800">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Stats Section */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.8
        }} className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {stats.map((stat, index) => <div key={index} className="text-center">
                
                
              </div>)}
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section variants={containerVariants} initial="hidden" whileInView="visible" viewport={{
      once: true
    }} className="py-24 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Powerful Tools for
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Modern Learning</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our comprehensive suite of AI-powered educational tools transforms how you learn and teach mathematics.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {features.map((feature, index) => <motion.div key={feature.title} variants={itemVariants} whileHover={{
            scale: 1.02,
            y: -5
          }} className="group">
                <Card className="h-full bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-8">
                    <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <feature.icon className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>)}
          </div>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section variants={containerVariants} initial="hidden" whileInView="visible" viewport={{
      once: true
    }} className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={itemVariants}>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8">
                Why Choose
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> SketchMentor?</span>
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => <motion.div key={index} variants={itemVariants} className="flex items-center space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="text-lg text-gray-700 dark:text-gray-300">{benefit}</span>
                  </motion.div>)}
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="relative">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 text-white">
                <Users className="h-16 w-16 mb-6 opacity-80" />
                <h3 className="text-2xl font-bold mb-4">Join Our Community</h3>
                <p className="text-purple-100 mb-6">
                  Connect with thousands of learners and educators who are already transforming their mathematical journey with SketchMentor.
                </p>
                <Link to="/signup">
                  <Button variant="secondary" size="lg" className="w-full">
                    Get Started Today
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section initial={{
      opacity: 0
    }} whileInView={{
      opacity: 1
    }} viewport={{
      once: true
    }} className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Ready to Transform Your Learning Experience?
          </h2>
          <p className="text-xl text-purple-100 mb-12 max-w-2xl mx-auto">
            Join thousands of students and educators who are already using SketchMentor to make learning more interactive, engaging, and effective.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4 shadow-lg hover:shadow-xl">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/signin">
              
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">SM</span>
                </div>
                <span className="text-2xl font-bold">SketchMentor</span>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                Revolutionizing mathematics education through AI-powered interactive learning tools. 
                Making complex concepts accessible to everyone, everywhere.
              </p>
              <div className="flex space-x-4">
                
                
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6 text-lg">Product</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/documentation" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link to="/integrations" className="hover:text-white transition-colors">Integrations</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6 text-lg">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link to="#" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">Community</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">Status</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">&copy; 2024 SketchMentor. All rights reserved.</p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-gray-400">Made with</span>
              <span className="text-red-500">♥</span>
              <span className="text-gray-400">for educators and students worldwide</span>
            </div>
          </div>
        </div>
      </footer>
    </div>;
};
export default Landing;