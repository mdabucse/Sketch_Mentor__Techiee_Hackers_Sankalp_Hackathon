
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navigation from '../components/Navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Star, Zap, Crown } from 'lucide-react';

const Pricing = () => {
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
                Pricing Plans
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Choose the perfect plan for your learning journey. All plans include access to our core AI-powered tools.
            </p>
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full">
              <Star className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
              <span className="text-purple-700 dark:text-purple-300 font-medium">Coming Soon - Currently in Development</span>
            </div>
          </motion.div>

          {/* Coming Soon Notice */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white border-0 shadow-2xl">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
                  <Zap className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Pricing Plans Coming Soon!</h2>
                <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                  We're working hard to bring you flexible pricing options that suit every learner's needs. 
                  Sign up now to get early access and special launch pricing when we go live.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white/10 rounded-lg p-4">
                    <Check className="h-6 w-6 mx-auto mb-2" />
                    <p className="text-sm">Free Trial Period</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <Crown className="h-6 w-6 mx-auto mb-2" />
                    <p className="text-sm">Premium Features</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <Star className="h-6 w-6 mx-auto mb-2" />
                    <p className="text-sm">Educational Discounts</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/signup">
                    <Button size="lg" variant="secondary" className="text-lg px-8 py-4 bg-white text-purple-600 hover:bg-gray-100">
                      Join Early Access
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="text-lg px-8 py-4 text-white border-white hover:bg-white/10">
                    Notify Me When Ready
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Preview Pricing Tiers */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Expected Pricing Tiers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 opacity-60">
              <Card className="border-2 border-gray-200 dark:border-gray-700">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Free</CardTitle>
                  <div className="text-4xl font-bold">$0</div>
                  <p className="text-gray-600 dark:text-gray-400">Perfect for getting started</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" />Basic AI tools</li>
                    <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" />Limited usage</li>
                    <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" />Community support</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-300 dark:border-purple-600 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Pro</CardTitle>
                  <div className="text-4xl font-bold">$19</div>
                  <p className="text-gray-600 dark:text-gray-400">For serious learners</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" />All AI features</li>
                    <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" />Unlimited usage</li>
                    <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" />Priority support</li>
                    <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" />Advanced analytics</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200 dark:border-gray-700">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Education</CardTitle>
                  <div className="text-4xl font-bold">$49</div>
                  <p className="text-gray-600 dark:text-gray-400">For institutions</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" />Everything in Pro</li>
                    <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" />Classroom management</li>
                    <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" />Custom integrations</li>
                    <li className="flex items-center"><Check className="h-4 w-4 mr-2 text-green-500" />Dedicated support</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
