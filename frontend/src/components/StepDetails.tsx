/**
 * StepDetails Component
 * Displays detailed results for each optimization step
 */

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Tag,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  FileText,
  Target,
  Sparkles,
  ClipboardCheck,
} from 'lucide-react';
import { OptimizationResponse } from '../services/n8nApi';

interface StepDetailsProps {
  results: OptimizationResponse;
  className?: string;
}

interface StepCardProps {
  title: string;
  icon: React.ReactNode;
  stepNumber: number;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const StepCard: React.FC<StepCardProps> = ({
  title,
  icon,
  stepNumber,
  isExpanded,
  onToggle,
  children,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            {icon}
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Step {stepNumber}: {title}
            </h3>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          {children}
        </div>
      )}
    </div>
  );
};

export const StepDetails: React.FC<StepDetailsProps> = ({ results, className = '' }) => {
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([1, 2, 7])); // Expand 1, 2, 7 by default

  const toggleStep = (stepNumber: number) => {
    setExpandedSteps((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(stepNumber)) {
        newSet.delete(stepNumber);
      } else {
        newSet.add(stepNumber);
      }
      return newSet;
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Step 1: Keywords */}
      <StepCard
        title="Keyword Extraction"
        icon={<Tag className="w-5 h-5 text-blue-600" />}
        stepNumber={1}
        isExpanded={expandedSteps.has(1)}
        onToggle={() => toggleStep(1)}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Extracted {results.steps.step1_keywords.total_count} keywords from job description
          </p>

          <div className="flex flex-wrap gap-2">
            {results.steps.step1_keywords.keywords.slice(0, 20).map((kw, idx) => (
              <span
                key={idx}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  kw.importance === 'high'
                    ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    : kw.importance === 'medium'
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {kw.keyword}
                {kw.importance === 'high' && ' 🔥'}
              </span>
            ))}
          </div>

          {results.steps.step1_keywords.keywords.length > 20 && (
            <p className="text-xs text-gray-500">
              ...and {results.steps.step1_keywords.keywords.length - 20} more
            </p>
          )}
        </div>
      </StepCard>

      {/* Step 2: Gap Analysis */}
      <StepCard
        title="Gap Analysis"
        icon={<Target className="w-5 h-5 text-blue-600" />}
        stepNumber={2}
        isExpanded={expandedSteps.has(2)}
        onToggle={() => toggleStep(2)}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900 rounded-lg">
              <p className="text-2xl font-bold text-green-600 dark:text-green-300">
                {results.steps.step2_gap_analysis.matched_keywords.length}
              </p>
              <p className="text-sm text-green-700 dark:text-green-400">Matched</p>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-900 rounded-lg">
              <p className="text-2xl font-bold text-red-600 dark:text-red-300">
                {results.steps.step2_gap_analysis.missing_keywords.length}
              </p>
              <p className="text-sm text-red-700 dark:text-red-400">Missing</p>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">
                {results.steps.step2_gap_analysis.ats_score_original}%
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-400">Original Score</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              Matched Keywords
            </h4>
            <div className="flex flex-wrap gap-2">
              {results.steps.step2_gap_analysis.matched_keywords.slice(0, 10).map((kw, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs dark:bg-green-900 dark:text-green-300"
                >
                  {kw.keyword}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
              <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
              Missing Keywords (to be added)
            </h4>
            <div className="flex flex-wrap gap-2">
              {results.steps.step2_gap_analysis.missing_keywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs dark:bg-red-900 dark:text-red-300"
                >
                  {kw.keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </StepCard>

      {/* Step 3: Summary */}
      <StepCard
        title="Professional Summary"
        icon={<FileText className="w-5 h-5 text-blue-600" />}
        stepNumber={3}
        isExpanded={expandedSteps.has(3)}
        onToggle={() => toggleStep(3)}
      >
        <div className="space-y-3">
          <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {results.steps.step3_summary.optimized_summary}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-2">Keywords added to summary:</p>
            <div className="flex flex-wrap gap-2">
              {results.steps.step3_summary.keywords_added.map((kw, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs dark:bg-purple-900 dark:text-purple-300"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      </StepCard>

      {/* Step 4: Bullets */}
      <StepCard
        title="Experience Bullets (STAR Format)"
        icon={<Sparkles className="w-5 h-5 text-blue-600" />}
        stepNumber={4}
        isExpanded={expandedSteps.has(4)}
        onToggle={() => toggleStep(4)}
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-500">
            Optimized {results.steps.step4_bullets.optimized_bullets.length} experience bullets
          </p>

          {results.steps.step4_bullets.optimized_bullets.slice(0, 3).map((bullet, idx) => (
            <div key={idx} className="border-l-4 border-blue-500 pl-4 space-y-2">
              <div>
                <p className="text-xs text-gray-500 mb-1">Original:</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-through">
                  {bullet.original}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Optimized:</p>
                <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">
                  {bullet.optimized}
                </p>
              </div>
              {bullet.keywords_added.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {bullet.keywords_added.map((kw, kidx) => (
                    <span
                      key={kidx}
                      className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs dark:bg-green-900 dark:text-green-300"
                    >
                      +{kw}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}

          {results.steps.step4_bullets.optimized_bullets.length > 3 && (
            <p className="text-xs text-gray-500">
              ...and {results.steps.step4_bullets.optimized_bullets.length - 3} more bullets
            </p>
          )}
        </div>
      </StepCard>

      {/* Step 5: Skills */}
      <StepCard
        title="Skills Organization"
        icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
        stepNumber={5}
        isExpanded={expandedSteps.has(5)}
        onToggle={() => toggleStep(5)}
      >
        <div className="space-y-4">
          {results.steps.step5_skills.skills_categories.map((category, idx) => (
            <div key={idx}>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {category.category}
                <span className="ml-2 text-xs text-gray-500">({category.priority} priority)</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, sidx) => (
                  <span
                    key={sidx}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs dark:bg-gray-700 dark:text-gray-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {results.steps.step5_skills.skills_added.length > 0 && (
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-green-600 dark:text-green-400">
                ✅ Added: {results.steps.step5_skills.skills_added.join(', ')}
              </p>
            </div>
          )}
        </div>
      </StepCard>

      {/* Step 6: Assembly */}
      <StepCard
        title="CV Assembly"
        icon={<FileText className="w-5 h-5 text-blue-600" />}
        stepNumber={6}
        isExpanded={expandedSteps.has(6)}
        onToggle={() => toggleStep(6)}
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            All components assembled into optimized CV format
          </p>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg max-h-60 overflow-y-auto">
            <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono">
              {results.steps.step6_assembly.optimized_cv.full_text.substring(0, 500)}
              {results.steps.step6_assembly.optimized_cv.full_text.length > 500 && '...'}
            </pre>
          </div>
        </div>
      </StepCard>

      {/* Step 7: QA */}
      <StepCard
        title="Quality Assurance"
        icon={<ClipboardCheck className="w-5 h-5 text-blue-600" />}
        stepNumber={7}
        isExpanded={expandedSteps.has(7)}
        onToggle={() => toggleStep(7)}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900 rounded-lg">
              <p className="text-3xl font-bold text-green-600 dark:text-green-300">
                {results.steps.step7_qa.ats_score_optimized}%
              </p>
              <p className="text-sm text-green-700 dark:text-green-400">Final ATS Score</p>
              <p className="text-xs text-green-600 mt-1">{results.steps.step7_qa.improvement}</p>
            </div>
            <div
              className={`p-4 rounded-lg ${
                results.steps.step7_qa.ready_to_submit
                  ? 'bg-blue-50 dark:bg-blue-900'
                  : 'bg-yellow-50 dark:bg-yellow-900'
              }`}
            >
              <p className="text-sm font-semibold">
                {results.steps.step7_qa.ready_to_submit ? '✅ Ready to Submit' : '⚠️ Needs Review'}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {results.steps.step7_qa.quality_flags.length} quality flags
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              💪 Strengths
            </h4>
            <ul className="list-disc list-inside space-y-1">
              {results.steps.step7_qa.strengths.map((strength, idx) => (
                <li key={idx} className="text-sm text-gray-600 dark:text-gray-300">
                  {strength}
                </li>
              ))}
            </ul>
          </div>

          {results.steps.step7_qa.remaining_gaps.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                🔍 Remaining Gaps
              </h4>
              <ul className="list-disc list-inside space-y-1">
                {results.steps.step7_qa.remaining_gaps.map((gap, idx) => (
                  <li key={idx} className="text-sm text-red-600 dark:text-red-400">
                    {gap}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              💡 Recommendations
            </h4>
            <ul className="list-disc list-inside space-y-1">
              {results.steps.step7_qa.recommendations.map((rec, idx) => (
                <li key={idx} className="text-sm text-blue-600 dark:text-blue-400">
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </StepCard>
    </div>
  );
};

export default StepDetails;
