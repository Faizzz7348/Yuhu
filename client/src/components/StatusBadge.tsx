import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: "operational" | "needs_refill" | "maintenance";
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    operational: {
      label: "Operational",
      color: "bg-chart-2 text-white",
      dot: "bg-chart-2"
    },
    needs_refill: {
      label: "Needs Refill",
      color: "bg-chart-3 text-white",
      dot: "bg-chart-3"
    },
    maintenance: {
      label: "Maintenance Required",
      color: "bg-chart-4 text-white",
      dot: "bg-chart-4"
    }
  };

  const config = statusConfig[status];

  return (
    <Badge className={`${config.color} inline-flex items-center gap-2 transition-all duration-200`} data-testid={`badge-status-${status}`}>
      <span className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`} />
      {config.label}
    </Badge>
  );
}
