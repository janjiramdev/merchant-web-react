import { useEffect, useState, type ChangeEvent } from 'react';
import FailedAlert from '../components/alerts/FailedAlert';
import CancelButton from '../components/buttons/CancelButton';
import ConfirmButton from '../components/buttons/ConfirmButton';
import TextField from '../components/inputs/TextField';
import Modal from '../components/modals/Modal';
import Table from '../components/Table';
import type { IAddModalProps, ISale } from '../interfaces/features.interface';
import type {
  ISaleHistoriesResponseData,
  ISaleRequestBody,
} from '../interfaces/services.interface';
import { getSaleHistories, sale } from '../services/sales.service';

const columns = [
  { key: 'productId', label: 'Product ID' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'totalPrice', label: 'Total Price' },
] as const;

export default function Sales({ isOpen, onClose }: IAddModalProps) {
  const [sales, setSales] = useState<ISale[]>([]);
  const [newSale, setNewSale] = useState<ISaleRequestBody>({
    productId: '',
    quantity: 0,
  });
  const [isConfirmAddOpen, setConfirmAddOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const fetchSales = async () => {
    try {
      const response: ISaleHistoriesResponseData[] = await getSaleHistories();
      setSales(response);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Get Sale Histories Failed',
      );
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSale((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSale = async () => {
    const productId = newSale.productId.trim();
    const quantity = Number(newSale.quantity);
    if (!productId || isNaN(quantity)) return;

    try {
      const created = await sale({ productId, quantity });
      setSales([...sales, created]);
      setNewSale({ productId: '', quantity: 0 });
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Create Sale Failed',
      );
    }
  };

  const handleAddClick = () => {
    setConfirmAddOpen(true);
  };

  const handleConfirmAdd = () => {
    setConfirmAddOpen(false);
    handleAddSale();
  };

  const handleCancelConfirm = () => {
    setConfirmAddOpen(false);
  };

  useEffect(() => {
    if (!isOpen) {
      setErrorMessage('');
      setNewSale(newSale);
      fetchSales();
    }
  }, [isOpen, newSale]);

  return (
    <div>
      {isOpen && (
        <Modal title="Add New Sale" onClose={onClose}>
          <div className="grid gap-2 mb-4">
            <label className="text-sm">Product ID</label>
            <TextField
              name="productId"
              type="text"
              placeholder="Product ID"
              value={newSale.productId}
              onChange={handleChange}
            />

            <label className="text-sm">Quantity</label>
            <TextField
              name="quantity"
              type="number"
              placeholder="Quantityle"
              value={newSale.quantity}
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
        rows={sales}
        rowKey="_id"
        renderActions={() => undefined}
      />

      {isConfirmAddOpen && (
        <Modal title="Confirm Add" onClose={handleCancelConfirm}>
          <p>Are you sure you want to add this sale?</p>
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
