import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StockLevelBar from "./StockLevelBar";
import type { Product } from "@shared/schema";

interface InventoryTableProps {
  products: Product[];
}

export default function InventoryTable({ products }: InventoryTableProps) {
  return (
    <Card className="glass-card" data-testid="card-inventory">
      <CardHeader>
        <CardTitle>Current Inventory</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="text-center">Current</TableHead>
              <TableHead className="text-center">Capacity</TableHead>
              <TableHead>Stock Level</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} data-testid={`row-product-${product.id}`}>
                <TableCell className="font-medium" data-testid={`text-product-name-${product.id}`}>
                  {product.name}
                </TableCell>
                <TableCell className="text-center font-mono" data-testid={`text-current-stock-${product.id}`}>
                  {product.currentStock}
                </TableCell>
                <TableCell className="text-center font-mono" data-testid={`text-capacity-${product.id}`}>
                  {product.capacity}
                </TableCell>
                <TableCell>
                  <StockLevelBar current={product.currentStock} capacity={product.capacity} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
