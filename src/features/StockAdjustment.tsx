import { useEffect, useState } from 'react';
import FailedAlert from '../components/alerts/FailedAlert';
import CancelButton from '../components/buttons/CancelButton';
import ConfirmButton from '../components/buttons/ConfirmButton';
import TextField from '../components/inputs/TextField';
import Modal from '../components/modals/Modal';
import Table from '../components/Table';
import {
  adjustStock,
  getStockAdjustHistories,
} from '../services/stockAdjustmentService';

const columns = [
  { key: 'productId', label: 'Product ID' },
  { key: 'adjustType', label: 'Adjust Type' },
  { key: 'quantity', label: 'Quantity' },
] as const;

type StockAdjustmentType = {
  _id: string;
  productId: string;
  adjustType: 'add' | 'remove';
  quantity: number;
};

type StockAdjustmentProps = {
  isAddModalOpen: boolean;
  closeAddModal: () => void;
};

type ApiStockType = {
  _id: string;
  product: string;
  adjustType: 'add' | 'remove';
  quantity: number;
  createdAt: string;
  createdBy: string;
  __v: number;
};

const initialNewStockAdjustment = {
  productId: '',
  adjustType: 'add' as 'add' | 'remove' | '',
  quantity: 0,
};

export default function StockAdjustment({
  isAddModalOpen,
  closeAddModal,
}: StockAdjustmentProps) {
  const [stockAdjustment, setStockAdjustment] = useState<StockAdjustmentType[]>(
    [],
  );
  const [newStock, setNewStock] = useState(initialNewStockAdjustment);
  const [isConfirmAddOpen, setConfirmAddOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchStocks = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('token not found');

      const stocks: ApiStockType[] = await getStockAdjustHistories(
        undefined,
        token,
      );
      const mappedStocks = stocks.map((item) => ({
        ...item,
        productId: item.product,
      }));

      setStockAdjustment(mappedStocks);
    } catch {
      setErrorMessage('failed to fetch products');
    }
  };

  useEffect(() => {
    if (!isAddModalOpen) {
      setErrorMessage('');
      setNewStock(initialNewStockAdjustment);
      fetchStocks();
    }
  }, [isAddModalOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setNewStock((prev) => ({
      ...prev,
      [name]: name === 'adjustType' ? value.toLowerCase() : value,
    }));
  };

  const handleAddStock = async () => {
    const productId = newStock.productId.trim();
    const adjustType = newStock.adjustType.toLowerCase();
    const quantity = Number(newStock.quantity);

    if (
      !productId ||
      (adjustType !== 'add' && adjustType !== 'remove') ||
      isNaN(quantity)
    ) {
      setErrorMessage('invalid input');
      return;
    }
    if (quantity <= 0) {
      setErrorMessage('quantity must be greater than 0');
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('token not found');

    try {
      await adjustStock({ productId, adjustType, quantity }, token);
      await fetchStocks();
      setNewStock(initialNewStockAdjustment);
      closeAddModal();
    } catch (err) {
      console.error(err);
      let message = 'failed to create adjust stock';
      if (err instanceof Error) message = err.message;
      else if (typeof err === 'string') message = err;
      setErrorMessage(message);
    }
  };

  const handleAddClick = () => {
    setConfirmAddOpen(true);
  };

  const handleConfirmAdd = async () => {
    setConfirmAddOpen(false);
    await handleAddStock();
  };

  const handleCancelConfirm = () => {
    setConfirmAddOpen(false);
  };

  return (
    <div>
      {isAddModalOpen && (
        <Modal title="Add New Stock" onClose={closeAddModal}>
          <div className="grid gap-2 mb-4">
            <label className="text-sm">Product ID</label>
            <TextField
              name="productId"
              type="text"
              placeholder="Product ID"
              value={newStock.productId}
              onChange={handleChange}
            />

            <label className="text-sm">Adjust Type</label>
            <select
              name="adjustType"
              value={newStock.adjustType}
              onChange={handleChange}
              className="border rounded p-1"
            >
              <option value="">Select Adjust Type</option>
              <option value="add">ADD</option>
              <option value="remove">REMOVE</option>
            </select>

            <label className="text-sm">Quantity</label>
            <TextField
              name="quantity"
              type="number"
              placeholder="Quantity"
              value={newStock.quantity.toString()}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end gap-2">
            <CancelButton onClick={closeAddModal}>Cancel</CancelButton>
            <ConfirmButton onClick={handleAddClick}>Add</ConfirmButton>
          </div>
        </Modal>
      )}

      <Table
        columns={columns}
        rows={stockAdjustment}
        rowKey="_id"
        renderActions={() => null}
      />

      {isConfirmAddOpen && (
        <Modal title="Confirm Add" onClose={handleCancelConfirm}>
          <p>Are you sure you want to add this stock?</p>
          <div className="flex justify-end gap-2 mt-4">
            <CancelButton onClick={handleCancelConfirm}>Cancel</CancelButton>
            <ConfirmButton onClick={handleConfirmAdd}>Confirm</ConfirmButton>
          </div>
        </Modal>
      )}

      {errorMessage && (
        <FailedAlert
          message={errorMessage}
          onClose={() => setErrorMessage('')}
        />
      )}
    </div>
  );
}
