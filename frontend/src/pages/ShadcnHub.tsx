import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Sparkles, Shield, Zap, Activity, CheckCircle2, Play, Sliders, Database, Layers } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

export default function ShadcnHub() {
  const [prompt, setPrompt] = useState("Summarize patient symptoms and output structured JSON briefing for doctor.");
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const runTest = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post(`${API_BASE}/power/guardrails/scan`, {
        prompt: prompt,
        check_pii: true,
        check_injection: true
      });
      setResult(res.data);
    } catch (err: any) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-foreground bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-6">
        <div>
          <div className="flex items-center gap-3">
            <Badge variant="default" className="gap-1.5 px-3 py-1 bg-primary text-primary-foreground font-semibold">
              <Sparkles className="w-4 h-4" /> Shadcn/ui Edition
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">LangRush Shadcn Engine</h1>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            Fully modular UI powered entirely by shadcn/ui Radix primitives and Tailwind CSS design tokens.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={() => setActiveTab("playground")}>
            <Sliders className="w-4 h-4 mr-2" /> Controls
          </Button>
          <Button variant="default" size="sm" onClick={runTest} disabled={loading}>
            <Play className="w-4 h-4 mr-2" /> {loading ? "Scanning..." : "Execute Scan"}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 max-w-xl mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="playground">Playground</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Traces</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">14,823</div>
                <p className="text-xs text-emerald-500 font-medium mt-1">+12.5% from last week</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Security Guardrails</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">99.9% Safe</div>
                <p className="text-xs text-muted-foreground mt-1">0 PII leaks detected</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">JEPA Latency</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">320 ms</div>
                <p className="text-xs text-emerald-500 font-medium mt-1">-45 ms optimization</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Shadcn Pure UI Components</CardTitle>
              <CardDescription>
                Native Radix UI accessible primitive cards, buttons, badges, inputs, and tab triggers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">Primary Badge</Badge>
                <Badge variant="secondary">Secondary Badge</Badge>

                <Badge variant="outline">Outline Badge</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Shadcn Input Field</label>
                  <Input placeholder="Enter prompt or query..." defaultValue={prompt} onChange={(e) => setPrompt(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Shadcn Action Controls</label>
                  <div className="flex gap-2">
                    <Button variant="default" className="w-full">
                      <CheckCircle2 className="w-4 h-4 mr-2" /> Save Rule
                    </Button>
                    <Button variant="outline" className="w-full">
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="playground" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shadcn Interactive Playground</CardTitle>
              <CardDescription>Test prompt execution live with shadcn/ui textareas and input components.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea 
                rows={5} 
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)} 
                className="font-mono text-sm"
              />
              <Button variant="default" onClick={runTest} disabled={loading} className="w-full">
                {loading ? "Running Scan..." : "Execute Test via Gemini"}
              </Button>
              {result && (
                <div className="p-4 bg-muted rounded-lg font-mono text-xs overflow-x-auto border">
                  <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>PII & Security Scan Hub</CardTitle>
              <CardDescription>Real-time threat scanner powered by Gemini guardrail rules.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-semibold text-sm">PII Redaction Defense</div>
                    <div className="text-xs text-muted-foreground">Scans for SSNs, credit cards, emails, API keys</div>
                  </div>
                </div>
                <Badge variant="default">Active</Badge>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-semibold text-sm">Prompt Injection Firewall</div>
                    <div className="text-xs text-muted-foreground">Blocks DAN mode and systemic jailbreak payloads</div>
                  </div>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shadcn Telemetry Metrics</CardTitle>
              <CardDescription>Live stats across workspace projects.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-3xl font-bold text-primary">26</div>
                  <div className="text-xs text-muted-foreground mt-1">Platform Modules</div>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-3xl font-bold text-primary">100%</div>
                  <div className="text-xs text-muted-foreground mt-1">Verification Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
