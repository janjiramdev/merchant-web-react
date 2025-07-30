import { useEffect, useState, type ChangeEvent } from 'react';
import FailedAlert from '../components/alerts/FailedAlert';
import CancelButton from '../components/buttons/CancelButton';
import ConfirmButton from '../components/buttons/ConfirmButton';
import TextField from '../components/inputs/TextField';
import Modal from '../components/modals/Modal';
import Table from '../components/Table';
import type {
  IAddModalProps,
  IStockAdjust,
} from '../interfaces/features.interface';
import type {
  IAdjustStockRequestBody,
  IStockAdjustHistoriesResponseData,
} from '../interfaces/services.interface';
import {
  adjustStock,
  getStockAdjustHistories,
} from '../services/stock-adjustment.service';

const columns = [
  { key: 'productId', label: 'Product ID' },
  { key: 'adjustType', label: 'Adjust Type' },
  { key: 'quantity', label: 'Quantity' },
] as const;

export default function StockAdjustment({ isOpen, onClose }: IAddModalProps) {
  const [stockAdjustment, setStockAdjustment] = useState<IStockAdjust[]>([]);
  const [newStock, setNewStock] = useState<IAdjustStockRequestBody>({
    productId: '',
    adjustType: 'add',
    quantity: 0,
  });
  const [isConfirmAddOpen, setConfirmAddOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const fetchStocks = async () => {
    try {
      const response: IStockAdjustHistoriesResponseData[] =
        await getStockAdjustHistories();
      setStockAdjustment(response);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Get Aujust Stock Histories Failed',
      );
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
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

    try {
      await adjustStock({ productId, adjustType, quantity });
      await fetchStocks();
      setNewStock(newStock);
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Create Adjust Stock Failed',
      );
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

  useEffect(() => {
    if (!isOpen) {
      setErrorMessage('');
      setNewStock(newStock);
      fetchStocks();
    }
  }, [isOpen, newStock]);

  return (
    <div>
      {isOpen && (
        <Modal title="Add New Stock" onClose={onClose}>
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
            <CancelButton onClick={onClose}>Cancel</CancelButton>
            <ConfirmButton onClick={handleAddClick}>Add</ConfirmButton>
          </div>
        </Modal>
      )}

      <Table
        columns={columns}
        rows={stockAdjustment}
        rowKey="_id"
        renderActions={() => undefined}
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
