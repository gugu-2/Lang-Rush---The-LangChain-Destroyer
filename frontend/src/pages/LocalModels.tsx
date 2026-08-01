import { HardDriveDownload, Info } from "lucide-react";
import { ModelDownloadCard } from "@/components/ModelDownloadCard";
import { InferenceMonitor } from "@/components/InferenceMonitor";
import { OfflineBatchQueue } from "@/components/OfflineBatchQueue";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";

type ModelStatus = "not_downloaded" | "downloading" | "downloaded" | "running";

interface Model {
  id: string;
  name: string;
  sizeGb: number;
  minRamGb: number;
  status: ModelStatus;
  progress: number;
}

export function LocalModels() {
  const [models, setModels] = useState<Model[]>([
    {
      id: "olmoe-7b",
      name: "OLMoE-7B",
      sizeGb: 15.3,
      minRamGb: 24,
      status: "not_downloaded",
      progress: 0,
    },
    {
      id: "glm-744b",
      name: "GLM-5.2 744B",
      sizeGb: 412.0,
      minRamGb: 32,
      status: "not_downloaded",
      progress: 0,
    },
    {
      id: "kimi-k3",
      name: "Kimi K3 2.8T",
      sizeGb: 1500.0,
      minRamGb: 64,
      status: "not_downloaded",
      progress: 0,
    }
  ]);

  const handleDownload = (id: string) => {
    // Mock download process
    setModels(models.map(m => m.id === id ? { ...m, status: "downloading", progress: 0 } : m));
    
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.random() * 5;
      if (prog >= 100) {
        clearInterval(interval);
        setModels(current => current.map(m => m.id === id ? { ...m, status: "downloaded", progress: 100 } : m));
      } else {
        setModels(current => current.map(m => m.id === id ? { ...m, progress: prog } : m));
      }
    }, 500);
  };

  const handleDelete = (id: string) => {
    setModels(models.map(m => m.id === id ? { ...m, status: "not_downloaded", progress: 0 } : m));
  };

  const handleRun = (id: string) => {
    setModels(models.map(m => {
      if (m.id === id) {
        return { ...m, status: m.status === "running" ? "downloaded" : "running" };
      }
      return m;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-500/10 rounded-xl">
          <HardDriveDownload className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Local Models</h1>
          <p className="text-muted-foreground">Manage air-gapped Colibrì MoE models for offline inference</p>
        </div>
      </div>

      <Alert className="bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400">
        <Info className="w-4 h-4" />
        <AlertTitle>Disk Streaming Inference</AlertTitle>
        <AlertDescription>
          These models use the Colibrì engine to stream weights directly from your SSD. This uses zero VRAM but requires fast NVMe storage and runs significantly slower than cloud APIs. 
          Use for batch jobs and offline compliance audits.
        </AlertDescription>
      </Alert>

      <InferenceMonitor />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {models.map(model => (
          <ModelDownloadCard 
            key={model.id}
            {...model}
            onDownload={handleDownload}
            onDelete={handleDelete}
            onRun={handleRun}
          />
        ))}
      </div>

      <OfflineBatchQueue />
    </div>
  );
}
