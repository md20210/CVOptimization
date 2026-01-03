/**
 * CVOptimizer Main Component
 * Orchestrates the CV optimization flow with n8n backend
 */

import React, { useState, useEffect } from 'react';
import {
  Upload,
  FileText,
  Sparkles,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import {
  checkN8NStatus,
  optimizeCV,
  extractCVText,
  LLM_PROVIDERS,
  type LLMProvider,
  type OptimizationResponse,
} from '../services/n8nApi';
import StepProgress from './StepProgress';
import StepDetails from './StepDetails';

type ProcessingState = 'idle' | 'processing' | 'completed' | 'error';

export const CVOptimizer: React.FC = () => {
  // State
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [selectedLLM, setSelectedLLM] = useState<LLMProvider>(LLM_PROVIDERS[0]); // Claude default
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvText, setCvText] = useState<string>('');
  const [jobTitle, setJobTitle] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [processingState, setProcessingState] = useState<ProcessingState>('idle');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [results, setResults] = useState<OptimizationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check backend status on mount
  useEffect(() => {
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      setBackendStatus('checking');
      await checkN8NStatus();
      setBackendStatus('online');
    } catch (err) {
      console.error('Backend offline:', err);
      setBackendStatus('offline');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCvFile(file);

    // Try to extract text
    try {
      const text = await extractCVText(file);
      setCvText(text);
    } catch (err: any) {
      console.error('Failed to extract text:', err);
      // For now, user must paste text manually if extraction fails
    }
  };

  const handleOptimize = async () => {
    if (!cvText || !jobTitle || !jobDescription) {
      setError('Please provide CV text, job title, and job description');
      return;
    }

    setError(null);
    setProcessingState('processing');
    setCurrentStep(0);

    try {
      // Simulate progress updates (since n8n doesn't stream yet)
      const progressInterval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < 7) return prev + 1;
          return prev;
        });
      }, 3000); // Update every 3 seconds

      const response = await optimizeCV({
        llm_provider: selectedLLM.id,
        job_title: jobTitle,
        job_description: jobDescription,
        cv_text: cvText,
      });

      clearInterval(progressInterval);
      setCurrentStep(7); // Completed
      setResults(response);
      setProcessingState('completed');
    } catch (err: any) {
      console.error('Optimization failed:', err);
      setError(err.message || 'Optimization failed. Please try again.');
      setProcessingState('error');
    }
  };

  const handleReset = () => {
    setProcessingState('idle');
    setCurrentStep(0);
    setResults(null);
    setError(null);
    // Keep form data for easy retry
  };

  const handleDownloadResults = () => {
    if (!results) return;

    const dataStr = JSON.stringify(results, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cv-optimization-${results.jobId}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-3">
            <Sparkles className="w-10 h-10 text-blue-500" />
            CV Optimizer
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            AI-powered CV optimization with n8n workflow engine
          </p>

          {/* Backend Status Badge */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium">
            {backendStatus === 'online' && (
              <span className="flex items-center gap-2 text-green-600 bg-green-100 px-3 py-1 rounded-full dark:bg-green-900 dark:text-green-300">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Backend Online
              </span>
            )}
            {backendStatus === 'offline' && (
              <span className="flex items-center gap-2 text-red-600 bg-red-100 px-3 py-1 rounded-full dark:bg-red-900 dark:text-red-300">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                Backend Offline
                <button
                  onClick={checkBackendStatus}
                  className="ml-2 text-red-600 hover:text-red-700"
                >
                  <RefreshCw className="w-3 h-3" />
                </button>
              </span>
            )}
            {backendStatus === 'checking' && (
              <span className="flex items-center gap-2 text-gray-600 bg-gray-100 px-3 py-1 rounded-full dark:bg-gray-700 dark:text-gray-300">
                <RefreshCw className="w-3 h-3 animate-spin" />
                Checking...
              </span>
            )}
          </div>
        </div>

        {/* Input Form */}
        {processingState === 'idle' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left: CV Upload */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Upload className="w-5 h-5 text-blue-500" />
                  1. Upload Your CV
                </h2>

                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    id="cv-upload"
                    accept=".txt,.pdf,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label htmlFor="cv-upload" className="cursor-pointer">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {cvFile ? cvFile.name : 'Click to upload CV'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">.txt, .pdf, or .docx</p>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Or paste CV text:
                  </label>
                  <textarea
                    value={cvText}
                    onChange={(e) => setCvText(e.target.value)}
                    className="w-full h-40 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Paste your CV text here..."
                  />
                </div>

                {/* LLM Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    2. Select AI Model:
                  </label>
                  <div className="space-y-2">
                    {LLM_PROVIDERS.map((provider) => (
                      <button
                        key={provider.id}
                        onClick={() => setSelectedLLM(provider)}
                        className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                          selectedLLM.id === provider.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{provider.icon}</span>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {provider.name}
                            </p>
                            <p className="text-xs text-gray-500">{provider.description}</p>
                          </div>
                          {selectedLLM.id === provider.id && (
                            <CheckCircle className="w-5 h-5 text-blue-500" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Job Info */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  3. Job Details
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Job Title:
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Senior AI Engineer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Job Description:
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="w-full h-64 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Paste the complete job description here..."
                  />
                </div>

                <button
                  onClick={handleOptimize}
                  disabled={
                    !cvText || !jobTitle || !jobDescription || backendStatus !== 'online'
                  }
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Optimize with {selectedLLM.name}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Processing State */}
        {processingState === 'processing' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
              Optimizing Your CV with {selectedLLM.name}
            </h2>

            <StepProgress currentStep={currentStep} variant="horizontal" />

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                This may take 30-60 seconds depending on the LLM provider...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {processingState === 'error' && error && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertCircle className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Optimization Failed</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
            <button
              onClick={handleReset}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Results */}
        {processingState === 'completed' && results && (
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  Optimization Complete!
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleDownloadResults}
                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download Results
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    New Optimization
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-red-50 dark:bg-red-900 rounded-lg">
                  <p className="text-3xl font-bold text-red-600 dark:text-red-300">
                    {results.scores.original}%
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Original ATS Score</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
                  <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-300">
                    {results.scores.improvement}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Improvement</p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900 rounded-lg">
                  <p className="text-3xl font-bold text-green-600 dark:text-green-300">
                    {results.scores.optimized}%
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Optimized Score</p>
                </div>
              </div>
            </div>

            {/* Step Details */}
            <StepDetails results={results} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CVOptimizer;
