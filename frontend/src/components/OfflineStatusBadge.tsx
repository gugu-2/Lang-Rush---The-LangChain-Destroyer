import { Badge } from "@/components/ui/badge";
import { ServerOff, Server } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export function OfflineStatusBadge() {
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const location = useLocation();

  // For now, we simulate offline mode being active when on the LocalModels page or if globally toggled
  // Later this can be tied to a global context or backend setting
  useEffect(() => {
    // Check if we're on a local engine page
    if (location.pathname === "/local-models" || location.pathname === "/offline-hub") {
      setIsOfflineMode(true);
    } else {
      // Simulate checking a global store (localStorage for MVP)
      const isEnabled = localStorage.getItem("langrush_offline_mode") === "true";
      setIsOfflineMode(isEnabled);
    }
  }, [location.pathname]);

  if (!isOfflineMode) {
    return (
      <Badge variant="outline" className="flex items-center gap-1.5 font-normal bg-green-500/10 text-green-600 border-green-200">
        <Server className="w-3.5 h-3.5" />
        Cloud Connected
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="flex items-center gap-1.5 font-normal bg-amber-500/10 text-amber-600 border-amber-200 animate-pulse">
      <ServerOff className="w-3.5 h-3.5" />
      Air-Gapped
    </Badge>
  );
}
