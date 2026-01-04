'use server';

/**
 * @fileOverview Automated testing flow for generating comprehensive test suites.
 *
 * This flow analyzes project structure and generates:
 * - Unit tests for individual components and functions
 * - Integration tests for component interactions
 * - End-to-end test scenarios
 * - Test utilities and mocking strategies
 * - Testing best practices and recommendations
 *
 * - generateTestSuite - Main function for test generation
 * - GenerateTestSuiteInput - Input schema for the flow
 * - GenerateTestSuiteOutput - Output schema for the flow
 */

import 'dotenv/config';
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const GenerateTestSuiteInputSchema = z.object({
  analysisReport: z.string().describe('Project analysis report with component details.'),
  codeStructure: z.string().describe('Detailed code structure and component breakdown.'),
  technology: z.string().optional().describe('Technology stack (React, Node.js, etc.).'),
  testingFramework: z.string().optional().describe('Preferred testing framework (Jest, Vitest, etc.).'),
  focusAreas: z.array(z.string()).optional().describe('Specific areas to focus testing on.'),
});

export type GenerateTestSuiteInput = z.infer<typeof GenerateTestSuiteInputSchema>;

const GenerateTestSuiteOutputSchema = z.object({
  testStructure: z.object({
    unitTests: z.array(z.object({
      component: z.string(),
      testFile: z.string(),
      testCases: z.array(z.string()),
    })),
    integrationTests: z.array(z.object({
      component: z.string(),
      testFile: z.string(),
      testCases: z.array(z.string()),
    })),
    e2eTests: z.array(z.object({
      scenario: z.string(),
      testFile: z.string(),
      testSteps: z.array(z.string()),
    })),
  }),
  testUtils: z.array(z.object({
    utility: z.string(),
    purpose: z.string(),
    code: z.string(),
  })),
  mockingStrategies: z.array(z.object({
    component: z.string(),
    mockImplementation: z.string(),
    rationale: z.string(),
  })),
  testSetup: z.object({
    configuration: z.string(),
    dependencies: z.array(z.string()),
    scripts: z.object({
      setup: z.string(),
      run: z.string(),
      cleanup: z.string(),
    }),
  }),
  testingBestPractices: z.array(z.string()),
  coverageGoals: z.object({
    statements: z.number(),
    branches: z.number(),
    functions: z.number(),
    lines: z.number(),
  }),
});

export type GenerateTestSuiteOutput = z.infer<typeof GenerateTestSuiteOutputSchema>;

export async function generateTestSuite(
  input: GenerateTestSuiteInput
): Promise<GenerateTestSuiteOutput> {
  return generateTestSuiteFlow(input);
}

const generateTestSuitePrompt = ai.definePrompt({
  name: 'generateTestSuitePrompt',
  input: { schema: GenerateTestSuiteInputSchema },
  output: { schema: GenerateTestSuiteOutputSchema },
  prompt: `You are a senior QA engineer and testing expert. Based on the project analysis, generate a comprehensive testing strategy and test code:

**Project Analysis:**
{{{analysisReport}}}

**Code Structure:**
{{{codeStructure}}}

**Technology Stack:** {{#if technology}}{{{technology}}}{{else}}Not specified{{/if}}

**Testing Framework:** {{#if testingFramework}}{{{testingFramework}}}{{else}}Use modern best practices{{/if}}

**Focus Areas:** {{#if focusAreas}}{{#each focusAreas}}{{this}}, {{/each}}{{else}}All components{{/if}}

**Testing Requirements:**

1. **Unit Tests**: Create focused tests for individual functions, components, and utilities
2. **Integration Tests**: Test component interactions and data flow
3. **End-to-End Tests**: Test complete user workflows and scenarios
4. **Test Utilities**: Generate helpful testing utilities and mocks
5. **Mocking Strategies**: Provide comprehensive mocking for external dependencies
6. **Test Setup**: Complete testing configuration and setup instructions

**Guidelines:**
- Generate actual test code that can be run immediately
- Include proper assertions and edge case testing
- Provide realistic mock data and scenarios
- Follow testing best practices (AAA pattern, descriptive test names)
- Include setup and teardown procedures
- Suggest appropriate testing frameworks and tools
- Define coverage goals and metrics

**Output Structure:**
Provide a complete testing suite with actual code examples, configuration files, and detailed explanations for each testing level.`,
});

const generateTestSuiteFlow = ai.defineFlow(
  {
    name: 'generateTestSuiteFlow',
    inputSchema: GenerateTestSuiteInputSchema,
    outputSchema: GenerateTestSuiteOutputSchema,
  },
  async (input) => {
    const { output } = await generateTestSuitePrompt(input, {
      model: googleAI.model('gemini-1.5-flash')
    });

    if (!output) {
      throw new Error("Failed to generate test suite. The AI response was incomplete.");
    }

    return output;
  }
);
