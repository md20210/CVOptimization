/**
 * n8n API Service for CV Optimization
 * Connects React Frontend to n8n Workflow Backend
 */

import axios, { AxiosInstance } from 'axios';

// n8n Instance Configuration
const N8N_BASE_URL = import.meta.env.VITE_N8N_URL || 'https://n8n-production-5303.up.railway.app';

// Create axios instance
const n8nClient: AxiosInstance = axios.create({
  baseURL: N8N_BASE_URL,
  timeout: 180000, // 3 minutes for long-running LLM tasks
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface LLMProvider {
  id: 'claude' | 'grok' | 'llama';
  name: string;
  model: string;
  icon: string;
  description: string;
}

export interface OptimizationRequest {
  llm_provider: 'claude' | 'grok' | 'llama';
  job_title: string;
  job_description: string;
  cv_text: string;
}

export interface StepResult {
  current: number;
  total: number;
  status: string;
}

export interface KeywordData {
  keywords: Array<{
    keyword: string;
    category: string;
    importance: string;
  }>;
  total_count: number;
}

export interface GapAnalysis {
  matched_keywords: Array<{ keyword: string; found_in: string }>;
  missing_keywords: Array<{ keyword: string; importance: string }>;
  ats_score_original: number;
  coverage_by_section: Record<string, string[]>;
}

export interface SummaryData {
  optimized_summary: string;
  keywords_added: string[];
  keywords_emphasized: string[];
}

export interface BulletsData {
  optimized_bullets: Array<{
    original: string;
    optimized: string;
    keywords_added: string[];
    metrics_added: string[];
  }>;
}

export interface SkillsData {
  skills_categories: Array<{
    category: string;
    skills: string[];
    priority: string;
  }>;
  skills_added: string[];
  skills_removed: string[];
}

export interface AssemblyData {
  optimized_cv: {
    summary: string;
    experience: Array<{ title: string; bullets: string[] }>;
    skills: Record<string, string[]>;
    full_text: string;
  };
}

export interface QAData {
  ats_score_optimized: number;
  improvement: string;
  keyword_coverage: {
    total: number;
    matched: number;
    missing: string[];
  };
  quality_flags: string[];
  strengths: string[];
  remaining_gaps: string[];
  recommendations: string[];
  ready_to_submit: boolean;
}

export interface OptimizationResponse {
  success: boolean;
  jobId: string;
  llmProvider: string;
  timestamp: string;
  scores: {
    original: number;
    optimized: number;
    improvement: string;
  };
  steps: {
    step1_keywords: KeywordData;
    step2_gap_analysis: GapAnalysis;
    step3_summary: SummaryData;
    step4_bullets: BulletsData;
    step5_skills: SkillsData;
    step6_assembly: AssemblyData;
    step7_qa: QAData;
  };
  optimized_cv: {
    summary: string;
    experience: any[];
    skills: Record<string, any>;
    full_text: string;
  };
  qa_report: {
    strengths: string[];
    remaining_gaps: string[];
    recommendations: string[];
    ready_to_submit: boolean;
    quality_flags: string[];
  };
}

export interface StatusResponse {
  status: string;
  version: string;
  workflow: string;
  supported_llms: string[];
  features: string[];
  timestamp: string;
}

// Available LLM Providers
export const LLM_PROVIDERS: LLMProvider[] = [
  {
    id: 'claude',
    name: 'Anthropic Claude',
    model: 'claude-sonnet-4-20250514',
    icon: '🧠',
    description: 'Most accurate, best for complex analysis',
  },
  {
    id: 'grok',
    name: 'Grok (xAI)',
    model: 'grok-2-latest',
    icon: '⚡',
    description: 'Fast and efficient, great for quick optimizations',
  },
  {
    id: 'llama',
    name: 'Local Llama',
    model: 'llama-3-70b',
    icon: '🏠',
    description: 'GDPR-compliant, runs locally (slower)',
  },
];

/**
 * Check n8n workflow status
 */
export async function checkN8NStatus(): Promise<StatusResponse> {
  try {
    const response = await n8nClient.get<StatusResponse>('/webhook/cv-optimizer-status');
    return response.data;
  } catch (error) {
    console.error('Failed to check n8n status:', error);
    throw new Error('n8n backend is not reachable');
  }
}

/**
 * Optimize CV using n8n workflow
 */
export async function optimizeCV(
  request: OptimizationRequest,
  onProgress?: (step: number) => void
): Promise<OptimizationResponse> {
  try {
    // For now, direct call (no polling)
    // TODO: Implement polling for progress updates
    const response = await n8nClient.post<OptimizationResponse>(
      '/webhook/cv-optimizer',
      request
    );

    return response.data;
  } catch (error: any) {
    console.error('CV optimization failed:', error);

    if (error.response) {
      throw new Error(
        `Optimization failed: ${error.response.data?.message || error.response.statusText}`
      );
    } else if (error.request) {
      throw new Error('No response from n8n backend. Please check if the workflow is active.');
    } else {
      throw new Error(`Request error: ${error.message}`);
    }
  }
}

/**
 * Extract text from uploaded CV file
 * (This could be done client-side or sent to n8n)
 */
export async function extractCVText(file: File): Promise<string> {
  // TODO: Implement PDF/DOCX text extraction
  // For MVP, we can use a simple FileReader for TXT or send to n8n

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      resolve(text);
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    if (file.type === 'text/plain') {
      reader.readAsText(file);
    } else {
      // For PDF/DOCX, we'd need a library or backend processing
      reject(new Error('Only .txt files supported for now. PDF/DOCX coming soon.'));
    }
  });
}

/**
 * Poll for job status (for future progress tracking)
 */
export async function pollJobStatus(jobId: string): Promise<StepResult> {
  // TODO: Implement when n8n supports progress webhooks
  // For now, just return a placeholder
  return {
    current: 0,
    total: 7,
    status: 'pending',
  };
}

export default {
  checkN8NStatus,
  optimizeCV,
  extractCVText,
  pollJobStatus,
  LLM_PROVIDERS,
};
