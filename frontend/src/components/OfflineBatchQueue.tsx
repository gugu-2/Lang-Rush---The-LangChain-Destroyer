import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Clock, PlayCircle, CheckCircle2, XCircle } from "lucide-react";

export function OfflineBatchQueue() {
  // Placeholder data - this will eventually come from the backend OfflineJob table
  const jobs = [
    { id: "JOB-4821", name: "Evaluation Dataset (500)", model: "OLMoE-7B", status: "running", time: "2.3h elapsed", progress: "124/500" },
    { id: "JOB-4820", name: "Compliance Audit v2", model: "GLM-744B", status: "completed", time: "4.1h", progress: "100%" },
    { id: "JOB-4819", name: "PII Scrubbing Batch", model: "OLMoE-7B", status: "failed", time: "12m", progress: "OOM" },
    { id: "JOB-4822", name: "AgentBench Overnight", model: "GLM-744B", status: "queued", time: "-", progress: "0/1000" },
  ];

  return (
    <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Offline Job Queue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-border/50">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Job ID</TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead className="text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id} className="hover:bg-muted/50">
                  <TableCell className="font-mono text-xs font-medium text-muted-foreground">{job.id}</TableCell>
                  <TableCell className="font-medium">{job.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">{job.model}</Badge>
                  </TableCell>
                  <TableCell>
                    {job.status === "running" && (
                      <span className="flex items-center gap-1.5 text-blue-500 text-sm">
                        <PlayCircle className="w-4 h-4" /> Running
                      </span>
                    )}
                    {job.status === "completed" && (
                      <span className="flex items-center gap-1.5 text-green-500 text-sm">
                        <CheckCircle2 className="w-4 h-4" /> Completed
                      </span>
                    )}
                    {job.status === "failed" && (
                      <span className="flex items-center gap-1.5 text-red-500 text-sm">
                        <XCircle className="w-4 h-4" /> Failed
                      </span>
                    )}
                    {job.status === "queued" && (
                      <span className="flex items-center gap-1.5 text-muted-foreground text-sm">
                        <Clock className="w-4 h-4" /> Queued
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {job.progress}
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {job.time}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
