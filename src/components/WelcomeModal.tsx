import React, { useState } from 'react';
import { Brain, MapPin, BarChart3, Calendar, Hash, Upload, Wifi, X, ArrowRight, CheckCircle } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDocumentation: () => void;
}

export function WelcomeModal({ isOpen, onClose, onOpenDocumentation }: WelcomeModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to GeoSentiment Lens!",
      icon: <Brain className="h-12 w-12 text-blue-600" />,
      content: (
        <div className="text-center space-y-4">
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Your powerful platform for <strong>real-time sentiment analysis</strong> and <strong>geographic visualization</strong> of social media and news data.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              🔒 <strong>Privacy First:</strong> All your uploaded data is stored privately and securely. 
              No other users can see your datasets - they remain completely private to you.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Key Features Overview",
      icon: <MapPin className="h-12 w-12 text-green-600" />,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-gray-900 dark:text-white">Geographic Map</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Interactive world map with sentiment markers, heatmaps, and emoji visualization
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                <h4 className="font-semibold text-gray-900 dark:text-white">Timeline Analysis</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Track sentiment and emotion trends over time with interactive charts
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-5 w-5 text-orange-600" />
                <h4 className="font-semibold text-gray-900 dark:text-white">Smart Dashboard</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AI-generated insights, regional analysis, and comprehensive metrics
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Hash className="h-5 w-5 text-red-600" />
                <h4 className="font-semibold text-gray-900 dark:text-white">Keyword Explorer</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Word clouds, hashtag analysis, and sentiment-keyword correlation
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Data Sources & Privacy",
      icon: <Upload className="h-12 w-12 text-purple-600" />,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <Upload className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-green-900 dark:text-green-100">Upload Your Data</h4>
              </div>
              <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                <li>• CSV, JSON, or TXT files</li>
                <li>• Automatic sentiment analysis</li>
                <li>• <strong>100% Private Storage</strong></li>
                <li>• No sharing with other users</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <Wifi className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Live Data Feed</h4>
              </div>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Real-time Twitter data</li>
                <li>• Global news sources</li>
                <li>• Emotion-based filtering</li>
                <li>• Regional customization</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-yellow-600" />
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">Privacy Guarantee</h4>
            </div>
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Your uploaded datasets are stored with a unique user ID and remain completely private. 
              Other users cannot access, view, or interact with your data in any way.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Ready to Explore!",
      icon: <CheckCircle className="h-12 w-12 text-green-600" />,
      content: (
        <div className="text-center space-y-6">
          <p className="text-lg text-gray-700 dark:text-gray-300">
            You're all set to start analyzing sentiment data! Here's what you can do next:
          </p>
          
          <div className="space-y-3">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">📊 Start with Sample Data</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Explore the app features using our demo dataset to understand how everything works
              </p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">📁 Upload Your Dataset</h4>
              <p className="text-sm text-green-800 dark:text-green-200">
                Upload your own CSV file with text data for personalized sentiment analysis
              </p>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">🔴 Try Live Feed</h4>
              <p className="text-sm text-purple-800 dark:text-purple-200">
                Enable real-time data from Twitter and news sources for current sentiment trends
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onOpenDocumentation}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              📚 View Full Documentation
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Start Exploring
            </button>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            {currentStepData.icon}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentStepData.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-2">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {currentStepData.content}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          
          <div className="flex items-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? 'bg-blue-600' : 
                  index < currentStep ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
          
          {currentStep < steps.length - 1 ? (
            <button
              onClick={nextStep}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              Get Started!
            </button>
          )}
        </div>
      </div>
    </div>
  );
}