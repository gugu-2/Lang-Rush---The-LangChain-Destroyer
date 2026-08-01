import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { HardDrive, Download, Trash2, Play, CheckCircle2 } from "lucide-react";

interface ModelDownloadCardProps {
  id: string;
  name: string;
  sizeGb: number;
  minRamGb: number;
  status: "not_downloaded" | "downloading" | "downloaded" | "running";
  progress?: number;
  onDownload?: (id: string) => void;
  onDelete?: (id: string) => void;
  onRun?: (id: string) => void;
}

export function ModelDownloadCard({
  id,
  name,
  sizeGb,
  minRamGb,
  status,
  progress = 0,
  onDownload,
  onDelete,
  onRun
}: ModelDownloadCardProps) {
  return (
    <Card className="overflow-hidden border-border/50 bg-background/50 backdrop-blur-sm transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{name}</CardTitle>
            <CardDescription className="mt-1.5 flex items-center gap-3">
              <span className="flex items-center gap-1"><HardDrive className="w-3.5 h-3.5"/> {sizeGb} GB SSD</span>
              <span className="text-muted-foreground/40">•</span>
              <span>Min RAM: {minRamGb} GB</span>
            </CardDescription>
          </div>
          {status === "downloaded" && <Badge className="bg-green-500/10 text-green-600 border-green-200">Available</Badge>}
          {status === "running" && <Badge className="bg-blue-500/10 text-blue-600 border-blue-200 animate-pulse">Running</Badge>}
          {status === "downloading" && <Badge variant="outline">Downloading</Badge>}
          {status === "not_downloaded" && <Badge variant="secondary">Not Installed</Badge>}
        </div>
      </CardHeader>
      
      <CardContent className="pb-4">
        {status === "downloading" && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Downloading weights...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        {status === "downloaded" && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle2 className="w-4 h-4" />
            Ready for air-gapped inference
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 flex gap-2">
        {status === "not_downloaded" && (
          <Button variant="outline" className="w-full gap-2" onClick={() => onDownload?.(id)}>
            <Download className="w-4 h-4" />
            Download Model
          </Button>
        )}
        
        {status === "downloading" && (
          <Button variant="outline" className="w-full gap-2" disabled>
            <span className="animate-spin text-lg leading-none mb-1">⟳</span>
            Cancel
          </Button>
        )}
        
        {(status === "downloaded" || status === "running") && (
          <>
            <Button 
              className="flex-1 gap-2" 
              variant={status === "running" ? "secondary" : "default"}
              onClick={() => onRun?.(id)}
            >
              <Play className="w-4 h-4" />
              {status === "running" ? "Stop Engine" : "Test Engine"}
            </Button>
            <Button variant="outline" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50" onClick={() => onDelete?.(id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
