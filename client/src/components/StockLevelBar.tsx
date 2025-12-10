import { Progress } from "@/components/ui/progress";

interface StockLevelBarProps {
  current: number;
  capacity: number;
}

export default function StockLevelBar({ current, capacity }: StockLevelBarProps) {
  const percentage = Math.round((current / capacity) * 100);
  
  const getColorClass = () => {
    if (percentage >= 60) return "bg-chart-2";
    if (percentage >= 30) return "bg-chart-3";
    return "bg-chart-4";
  };

  return (
    <div className="flex items-center gap-3" data-testid="stock-level-bar">
      <Progress value={percentage} className="flex-1 h-2" indicatorClassName={getColorClass()} />
      <span className="text-sm font-mono min-w-[3rem] text-right" data-testid="text-percentage">
        {percentage}%
      </span>
    </div>
  );
}
