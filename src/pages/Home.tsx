import { useState } from 'react';
import Product from '../features/Product';
import Sales from '../features/Sales';
import StockAdjustment from '../features/StockAdjustment';
import ViewButton from '../components/buttons/ViewButton';
import ConfirmButton from '../components/buttons/ConfirmButton';

export default function HomePage() {
  const [tableView, setTableView] = useState<string>('Product');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isSalesModalOpen, setIsSalesModalOpen] = useState(false);
  const [isStockAdjustmentModalOpen, setIsStockAdjustmentModalOpen] =
    useState(false);

  function openAddModal() {
    if (tableView === 'Product') setIsProductModalOpen(true);
    else if (tableView === 'Sales') setIsSalesModalOpen(true);
    else if (tableView === 'StockAdjustment')
      setIsStockAdjustmentModalOpen(true);
  }
  function closeAddModal() {
    if (tableView === 'Product') setIsProductModalOpen(false);
    else if (tableView === 'Sales') setIsSalesModalOpen(false);
    else if (tableView === 'StockAdjustment')
      setIsStockAdjustmentModalOpen(false);
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
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

        <div>
          <ConfirmButton onClick={openAddModal}>Add</ConfirmButton>
        </div>
      </div>
      {tableView === 'Product' && (
        <Product
          isAddModalOpen={isProductModalOpen}
          closeAddModal={closeAddModal}
        />
      )}
      {tableView === 'Sales' && (
        <Sales
          isAddModalOpen={isSalesModalOpen}
          closeAddModal={closeAddModal}
        />
      )}
      {tableView === 'StockAdjustment' && (
        <StockAdjustment
          isAddModalOpen={isStockAdjustmentModalOpen}
          closeAddModal={closeAddModal}
        />
      )}{' '}
    </div>
  );
}
