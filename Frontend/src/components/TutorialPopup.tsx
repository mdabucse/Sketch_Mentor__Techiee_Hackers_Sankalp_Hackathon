
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, X, Video, BarChart, FileText, Image, Youtube } from 'lucide-react';

interface TutorialPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const TutorialPopup: React.FC<TutorialPopupProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      title: 'Welcome to SketchMentor!',
      description: 'Let\'s take a quick tour of our AI-powered educational tools.',
      content: (
        <div className="text-center p-6">
          <h3 className="text-2xl font-bold mb-4">Ready to get started?</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            SketchMentor offers powerful AI tools to enhance your learning experience.
            This quick tutorial will show you what's available.
          </p>
          <div className="text-6xl mb-4">🎓</div>
        </div>
      )
    },
    {
      title: 'Video Generator',
      description: 'Create educational videos from Manim code',
      content: (
        <div className="flex items-center space-x-4 p-4">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Video className="h-8 w-8 text-white" />
          </div>
          <div>
            <h4 className="font-semibold mb-2">Video Generator</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Transform your mathematical concepts into engaging videos using Manim code.
              Perfect for creating educational content and visualizing complex topics.
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Graph Visualizer',
      description: 'Plot and analyze mathematical functions',
      content: (
        <div className="flex items-center space-x-4 p-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <BarChart className="h-8 w-8 text-white" />
          </div>
          <div>
            <h4 className="font-semibold mb-2">Graph Visualizer</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Visualize mathematical functions and data with interactive charts and graphs.
              Great for understanding relationships and patterns in your data.
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Document Analyzer',
      description: 'Extract insights from uploaded documents',
      content: (
        <div className="flex items-center space-x-4 p-4">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <div>
            <h4 className="font-semibold mb-2">Document Analyzer</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upload documents to extract key insights, generate summaries, and create quizzes.
              Perfect for studying and content analysis.
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Canvas AI',
      description: 'Solve handwritten equations with AI',
      content: (
        <div className="flex items-center space-x-4 p-4">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
            <Image className="h-8 w-8 text-white" />
          </div>
          <div>
            <h4 className="font-semibold mb-2">Canvas AI</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Draw equations by hand and let AI solve them for you.
              Natural handwriting recognition makes math problem-solving intuitive.
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'YouTube Transcriber',
      description: 'Transcribe and chat with YouTube videos',
      content: (
        <div className="flex items-center space-x-4 p-4">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <Youtube className="h-8 w-8 text-white" />
          </div>
          <div>
            <h4 className="font-semibold mb-2">YouTube Transcriber</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Transcribe YouTube videos and have AI-powered conversations about the content.
              Perfect for learning from video content and taking notes.
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'You\'re all set!',
      description: 'Start exploring and learning with SketchMentor',
      content: (
        <div className="text-center p-6">
          <h3 className="text-2xl font-bold mb-4">Ready to start learning!</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You now know about all the amazing tools available. Click on any feature card
            on your dashboard to get started, or explore the getting started guide.
          </p>
          <div className="text-6xl mb-4">🚀</div>
          <p className="text-sm text-gray-500">
            You can always access help and tutorials from the settings menu.
          </p>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTutorial = () => {
    onClose();
  };

  const finishTutorial = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>{tutorialSteps[currentStep].title}</DialogTitle>
              <DialogDescription>{tutorialSteps[currentStep].description}</DialogDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={skipTutorial}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <Card className="border-0 shadow-none">
          <CardContent className="p-0">
            {tutorialSteps[currentStep].content}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between mt-6">
          <div className="flex space-x-1">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${
                  index === currentStep ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>

          <div className="flex space-x-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={prevStep}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
            )}
            
            {currentStep < tutorialSteps.length - 1 ? (
              <Button onClick={nextStep}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={finishTutorial}>
                Get Started!
              </Button>
            )}
          </div>
        </div>

        <div className="text-center mt-4">
          <span className="text-sm text-gray-500">
            Step {currentStep + 1} of {tutorialSteps.length}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TutorialPopup;
