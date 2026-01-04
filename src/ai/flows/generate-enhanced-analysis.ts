'use server';

/**
 * @fileOverview Enhanced analysis flow with dependency analysis, security scanning, and performance insights.
 *
 * This flow provides comprehensive project analysis including:
 * - Dependency analysis and vulnerability assessment
 * - Security scanning and recommendations
 * - Performance analysis and optimization suggestions
 * - Architecture quality assessment
 * - Code quality metrics
 *
 * - generateEnhancedAnalysis - Main function for comprehensive analysis
 * - GenerateEnhancedAnalysisInput - Input schema for the flow
 * - GenerateEnhancedAnalysisOutput - Output schema for the flow
 */

import 'dotenv/config';
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const GenerateEnhancedAnalysisInputSchema = z.object({
  fileStructure: z.string().describe('Complete file structure of the project.'),
  codeSnippets: z.string().describe('Content from key project files.'),
  packageJson: z.string().optional().describe('Package.json content for dependency analysis.'),
  requirements: z.string().optional().describe('Project requirements and user intent.'),
});

export type GenerateEnhancedAnalysisInput = z.infer<typeof GenerateEnhancedAnalysisInputSchema>;

const GenerateEnhancedAnalysisOutputSchema = z.object({
  projectOverview: z.string().describe('High-level project summary and architecture overview.'),
  dependencyAnalysis: z.object({
    dependencies: z.array(z.object({
      name: z.string(),
      version: z.string(),
      type: z.enum(['production', 'development']),
      vulnerabilities: z.array(z.string()),
      recommendations: z.array(z.string()),
    })),
    overallRisk: z.enum(['low', 'medium', 'high', 'critical']),
    updatePriority: z.enum(['low', 'medium', 'high']),
  }),
  securityAnalysis: z.object({
    vulnerabilities: z.array(z.object({
      severity: z.enum(['low', 'medium', 'high', 'critical']),
      title: z.string(),
      description: z.string(),
      remediation: z.string(),
    })),
    overallSecurityScore: z.number().min(0).max(100),
    securityRecommendations: z.array(z.string()),
  }),
  performanceAnalysis: z.object({
    bottlenecks: z.array(z.string()),
    optimizationOpportunities: z.array(z.string()),
    estimatedPerformanceScore: z.number().min(0).max(100),
  }),
  codeQuality: z.object({
    maintainability: z.number().min(0).max(100),
    testCoverage: z.string(),
    technicalDebt: z.array(z.string()),
    bestPractices: z.array(z.string()),
  }),
  developmentRecommendations: z.array(z.string()),
  nextSteps: z.array(z.string()),
});

export type GenerateEnhancedAnalysisOutput = z.infer<typeof GenerateEnhancedAnalysisOutputSchema>;

export async function generateEnhancedAnalysis(
  input: GenerateEnhancedAnalysisInput
): Promise<GenerateEnhancedAnalysisOutput> {
  return generateEnhancedAnalysisFlow(input);
}

const generateEnhancedAnalysisPrompt = ai.definePrompt({
  name: 'generateEnhancedAnalysisPrompt',
  input: { schema: GenerateEnhancedAnalysisInputSchema },
  output: { schema: GenerateEnhancedAnalysisOutputSchema },
  prompt: `You are a senior software architect and security expert. Analyze the following project comprehensively:

**File Structure:**
{{{fileStructure}}}

**Code Content:**
{{{codeSnippets}}}

**Package Dependencies:** {{#if packageJson}}{{{packageJson}}}{{else}}No package.json provided{{/if}}

**Project Requirements:** {{#if requirements}}{{{requirements}}}{{else}}No specific requirements provided{{/if}}

**Analysis Requirements:**
1. **Project Overview**: Provide a comprehensive summary of the project architecture, technology stack, and overall structure.

2. **Dependency Analysis**:
   - Analyze all dependencies for security vulnerabilities
   - Assess version currency and maintenance status
   - Identify potential licensing issues
   - Recommend updates and alternatives

3. **Security Analysis**:
   - Identify security vulnerabilities in dependencies and code
   - Assess authentication and authorization mechanisms
   - Check for common security anti-patterns
   - Provide specific remediation steps

4. **Performance Analysis**:
   - Identify potential performance bottlenecks
   - Suggest optimization opportunities
   - Assess scalability considerations
   - Provide performance improvement recommendations

5. **Code Quality Assessment**:
   - Evaluate code maintainability and readability
   - Assess adherence to best practices
   - Identify technical debt and refactoring opportunities
   - Suggest testing strategy improvements

6. **Development Recommendations**: Provide actionable next steps for improvement.

**Output Format:**
Provide a detailed, structured analysis covering all aspects mentioned above. Be specific and actionable in your recommendations.`,
});

const generateEnhancedAnalysisFlow = ai.defineFlow(
  {
    name: 'generateEnhancedAnalysisFlow',
    inputSchema: GenerateEnhancedAnalysisInputSchema,
    outputSchema: GenerateEnhancedAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await generateEnhancedAnalysisPrompt(input, {
      model: googleAI.model('gemini-1.5-flash')
    });

    if (!output) {
      throw new Error("Failed to generate enhanced analysis. The AI response was incomplete.");
    }

    return output;
  }
);
