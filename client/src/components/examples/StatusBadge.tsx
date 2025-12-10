import StatusBadge from '../StatusBadge';

export default function StatusBadgeExample() {
  return (
    <div className="flex gap-2 p-4">
      <StatusBadge status="operational" />
      <StatusBadge status="needs_refill" />
      <StatusBadge status="maintenance" />
    </div>
  );
}
