import { useState } from 'react';
import ConfirmButton from '../components/buttons/ConfirmButton';
import TableViewButton from '../components/buttons/TableViewButton';
import Product from '../features/Product';
import Sales from '../features/Sales';
import StockAdjustment from '../features/StockAdjustment';

export default function HomePage() {
  const [tableView, setTableView] = useState<string>('Product');
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [isSalesModalOpen, setIsSalesModalOpen] = useState<boolean>(false);
  const [isStockAdjustmentModalOpen, setIsStockAdjustmentModalOpen] =
    useState<boolean>(false);

  const openAddModal = () => {
    if (tableView === 'Product') setIsProductModalOpen(true);
    else if (tableView === 'Sales') setIsSalesModalOpen(true);
    else if (tableView === 'StockAdjustment')
      setIsStockAdjustmentModalOpen(true);
  };

  const closeAddModal = () => {
    if (tableView === 'Product') setIsProductModalOpen(false);
    else if (tableView === 'Sales') setIsSalesModalOpen(false);
    else if (tableView === 'StockAdjustment')
      setIsStockAdjustmentModalOpen(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div className="mb-6 flex gap-4">
          {['Product', 'StockAdjustment', 'Sales'].map((view) => (
            <TableViewButton
              key={view}
              nextView={view}
              currentView={tableView}
              onClick={setTableView}
            />
          ))}
        </div>

        <div>
          <ConfirmButton onClick={openAddModal}>Add</ConfirmButton>
        </div>
      </div>

      {tableView === 'Product' && (
        <Product isOpen={isProductModalOpen} onClose={closeAddModal} />
      )}

      {tableView === 'StockAdjustment' && (
        <StockAdjustment
          isOpen={isStockAdjustmentModalOpen}
          onClose={closeAddModal}
        />
      )}

      {tableView === 'Sales' && (
        <Sales isOpen={isSalesModalOpen} onClose={closeAddModal} />
      )}
    </div>
  );
}
