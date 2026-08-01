import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Cpu, HardDrive, MemoryStick } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/api/client";

export function InferenceMonitor() {
  const [metrics, setMetrics] = useState({
    cpu: { percent: 0 },
    ram: { total_gb: 32, used_gb: 0, percent: 0 },
    disk: { total_gb: 1000, free_gb: 500, read_speed_mb_s: 0 }
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await api.get('/system_metrics');
        setMetrics(res.data);
      } catch (err) {
        console.error("Failed to fetch system metrics", err);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-500" />
          Live Hardware Telemetry
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* RAM */}
          <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30">
            <div className="p-3 bg-purple-500/10 rounded-full text-purple-600 dark:text-purple-400">
              <MemoryStick className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">System RAM</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold">{metrics.ram.used_gb}</h3>
                <span className="text-sm font-medium text-muted-foreground">/ {metrics.ram.total_gb} GB</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {metrics.ram.percent}% utilized
              </p>
            </div>
          </div>

          {/* SSD SPEED */}
          <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30">
            <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-600 dark:text-emerald-400">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">SSD Read Speed</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold">{metrics.disk.read_speed_mb_s}</h3>
                <span className="text-sm font-medium text-muted-foreground">MB/s</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Colibrì streaming bandwidth
              </p>
            </div>
          </div>

          {/* CPU */}
          <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30">
            <div className="p-3 bg-blue-500/10 rounded-full text-blue-600 dark:text-blue-400">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">CPU Usage</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold">{metrics.cpu.percent}</h3>
                <span className="text-sm font-medium text-muted-foreground">%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                System average
              </p>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
