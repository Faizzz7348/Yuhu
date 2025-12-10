import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { User, Calendar } from "lucide-react";

interface RefillHistoryProps {
  records: Array<{
    id: string;
    date: Date;
    technician: string;
    lorry?: string;
    notes?: string;
  }>;
}

export default function RefillHistory({ records }: RefillHistoryProps) {
  return (
    <Card className="glass-card" data-testid="card-refill-history">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {records.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8" data-testid="text-no-history">
            No refill history available
          </p>
        ) : (
          <div className="space-y-4">
            {records.map((record) => (
              <div 
                key={record.id} 
                className="flex gap-4 pb-4 border-b last:border-0 last:pb-0"
                data-testid={`record-${record.id}`}
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    <span className="font-medium" data-testid={`text-date-${record.id}`}>
                      {format(record.date, "MMM d, yyyy 'at' h:mm a")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-3 h-3" />
                    <span data-testid={`text-technician-${record.id}`}>
                      {record.technician}
                      {record.lorry && ` • Lorry: ${record.lorry}`}
                    </span>
                  </div>
                  {record.notes && (
                    <p className="text-sm text-muted-foreground mt-2" data-testid={`text-notes-${record.id}`}>
                      {record.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
