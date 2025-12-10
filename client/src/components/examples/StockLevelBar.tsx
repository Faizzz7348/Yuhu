import StockLevelBar from '../StockLevelBar';

export default function StockLevelBarExample() {
  return (
    <div className="space-y-4 p-4">
      <StockLevelBar current={80} capacity={100} />
      <StockLevelBar current={45} capacity={100} />
      <StockLevelBar current={15} capacity={100} />
    </div>
  );
}
