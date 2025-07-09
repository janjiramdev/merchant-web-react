import { useState } from 'react';
import Product from '../features/Product';
import Sales from '../features/Sales';
import StockAdjustment from '../features/StockAdjustment';
import ViewButton from '../components/buttons/ViewButton';

export default function HomePage() {
  const [tableView, setTableView] = useState<string>('Product');

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex gap-4">
        {['Product', 'Sales', 'StockAdjustment'].map((view) => (
          <ViewButton
            key={view}
            view={view}
            activeView={tableView}
            onClick={setTableView}
          />
        ))}
      </div>

      {tableView === 'Product' && <Product />}
      {tableView === 'Sales' && <Sales />}
      {tableView === 'StockAdjustment' && <StockAdjustment />}
    </div>
  );
}
