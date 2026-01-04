'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Code,
  Shield,
  TestTube,
  Workflow,
  Sparkles,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAppState } from '@/hooks/use-app-state';
import {
  generateCodeAction,
  generateEnhancedAnalysisAction,
  generateTestSuiteAction,
  generateMultiModalWorkflowAction,
} from '@/app/actions';
import { GenerateCodeInput } from '@/ai/flows/generate-code';
import { GenerateEnhancedAnalysisInput } from '@/ai/flows/generate-enhanced-analysis';
import { GenerateTestSuiteInput } from '@/ai/flows/generate-test-suite';
import { GenerateMultiModalWorkflowInput } from '@/ai/flows/generate-multi-modal-workflow';

interface AIToolsPanelProps {
  className?: string;
}

export function AIToolsPanel({ className }: AIToolsPanelProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const { toast } = useToast();
  const { analysisReport, projectName } = useAppState();

  const handleGenerateCode = async () => {
    if (!analysisReport) {
      toast({
        title: "No Analysis Available",
        description: "Please analyze your project first before generating code.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating('code');
    try {
      const input: GenerateCodeInput = {
        analysisReport,
        componentType: 'frontend',
        requirements: `Generate a modern React component for ${projectName || 'the project'}`,
        technology: 'React/TypeScript'
      };

      const result = await generateCodeAction(input);

      if (result.success) {
        toast({
          title: "Code Generated Successfully",
          description: "The AI has generated code based on your project analysis."
        });
        // Here you could open a modal or navigate to show the generated code
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Code Generation Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(null);
    }
  };

  const handleEnhancedAnalysis = async () => {
    if (!analysisReport) {
      toast({
        title: "No Analysis Available",
        description: "Please analyze your project first.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating('analysis');
    try {
      const input: GenerateEnhancedAnalysisInput = {
        fileStructure: 'Project structure from current workspace',
        codeSnippets: analysisReport,
        requirements: projectName || 'Current project'
      };

      const result = await generateEnhancedAnalysisAction(input);

      if (result.success) {
        toast({
          title: "Enhanced Analysis Complete",
          description: "Comprehensive analysis with security and performance insights generated."
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Enhanced Analysis Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(null);
    }
  };

  const handleGenerateTests = async () => {
    if (!analysisReport) {
      toast({
        title: "No Analysis Available",
        description: "Please analyze your project first before generating tests.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating('tests');
    try {
      const input: GenerateTestSuiteInput = {
        analysisReport,
        codeStructure: 'Current project structure',
        technology: 'React/TypeScript',
        testingFramework: 'Jest/Vitest'
      };

      const result = await generateTestSuiteAction(input);

      if (result.success) {
        toast({
          title: "Test Suite Generated",
          description: "Comprehensive test suite with unit, integration, and E2E tests created."
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Test Generation Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(null);
    }
  };

  const handleMultiModalWorkflow = async () => {
    setIsGenerating('workflow');
    try {
      const input: GenerateMultiModalWorkflowInput = {
        projectGoals: `Create a multi-modal workflow for ${projectName || 'the project'}`,
        contentTypes: ['text', 'image', 'document'],
        targetPlatform: 'Web Application'
      };

      const result = await generateMultiModalWorkflowAction(input);

      if (result.success) {
        toast({
          title: "Multi-Modal Workflow Generated",
          description: "Workflow for integrating text, images, and documents created."
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Workflow Generation Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(null);
    }
  };

  const tools = [
    {
      id: 'code',
      name: 'Generate Code',
      description: 'Create production-ready components and features',
      icon: Code,
      action: handleGenerateCode,
      available: !!analysisReport,
      badge: 'Production Ready'
    },
    {
      id: 'analysis',
      name: 'Enhanced Analysis',
      description: 'Deep security and performance analysis',
      icon: Shield,
      action: handleEnhancedAnalysis,
      available: !!analysisReport,
      badge: 'Security & Performance'
    },
    {
      id: 'tests',
      name: 'Generate Tests',
      description: 'Create comprehensive test suites',
      icon: TestTube,
      action: handleGenerateTests,
      available: !!analysisReport,
      badge: 'Quality Assurance'
    },
    {
      id: 'workflow',
      name: 'Multi-Modal Workflow',
      description: 'Design workflows across content types',
      icon: Workflow,
      action: handleMultiModalWorkflow,
      available: true,
      badge: 'Content Integration'
    }
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Development Tools
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">
                🚀 <strong>Enhanced AI Capabilities</strong> - Aetherium now includes advanced AI tools for comprehensive development assistance.
              </p>
              <p>
                These tools leverage your project analysis to provide production-ready code, security insights, testing strategies, and multi-modal workflows.
              </p>
            </div>

            {!analysisReport && (
              <div className="p-4 bg-muted/50 rounded-lg border border-dashed">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Tip:</strong> Analyze your project first to unlock all AI capabilities.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="tools" className="space-y-3">
            {tools.map((tool) => {
              const Icon = tool.icon;
              const isLoading = isGenerating === tool.id;

              return (
                <div
                  key={tool.id}
                  className={`p-4 border rounded-lg transition-all ${
                    tool.available
                      ? 'hover:bg-muted/50 cursor-pointer'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  onClick={tool.available ? tool.action : undefined}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-md ${
                      tool.available ? 'bg-primary/10' : 'bg-muted'
                    }`}>
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Icon className={`h-4 w-4 ${
                          tool.available ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-medium text-sm ${
                          tool.available ? '' : 'text-muted-foreground'
                        }`}>
                          {tool.name}
                        </h4>
                        <Badge variant="secondary" className="text-xs">
                          {tool.badge}
                        </Badge>
                      </div>
                      <p className={`text-xs ${
                        tool.available ? 'text-muted-foreground' : 'text-muted-foreground/70'
                      }`}>
                        {tool.description}
                      </p>
                    </div>

                    <Button
                      size="sm"
                      variant={tool.available ? "default" : "secondary"}
                      disabled={!tool.available || isLoading}
                      onClick={(e) => {
                        e.stopPropagation();
                        tool.action();
                      }}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin mr-1" />
                          Generating...
                        </>
                      ) : (
                        'Generate'
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
