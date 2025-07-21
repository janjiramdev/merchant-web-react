import { useEffect, useState } from 'react';
import FailedAlert from '../components/alerts/FailedAlert';
import CancelButton from '../components/buttons/CancelButton';
import ConfirmButton from '../components/buttons/ConfirmButton';
import TextField from '../components/inputs/TextField';
import Modal from '../components/modals/Modal';
import Table from '../components/Table';
import { getSaleHistories, sale } from '../services/salesService';

const columns = [
  { key: 'productId', label: 'Product ID' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'totalPrice', label: 'Total Price' },
] as const;

type SalesType = {
  _id: string;
  productId: string;
  quantity: number;
  totalPrice: number;
};

type SalesProps = {
  isAddModalOpen: boolean;
  closeAddModal: () => void;
};

type ApiSalesType = {
  _id: string;
  product: string;
  quantity: number;
  totalPrice: number;
  createdAt: string;
  createdBy: string;
  __v: number;
};

const initialNewSale = { productId: '', quantity: '' };

export default function Sales({ isAddModalOpen, closeAddModal }: SalesProps) {
  const [sales, setSales] = useState<SalesType[]>([]);
  const [newSale, setNewSale] = useState(initialNewSale);
  const [isConfirmAddOpen, setConfirmAddOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchSales = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('token not found');

      const sales: ApiSalesType[] = await getSaleHistories(undefined, token);
      const mappedSales = sales.map((item) => ({
        _id: item._id,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
        productId: item.product,
      }));

      setSales(mappedSales);
    } catch {
      setErrorMessage('failed to fetch products');
    }
  };

  useEffect(() => {
    if (!isAddModalOpen) {
      setErrorMessage('');
      setNewSale(initialNewSale);
      fetchSales();
    }
  }, [isAddModalOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSale((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSale = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setErrorMessage('token not found');
      return;
    }

    const productId = newSale.productId.trim();
    const quantity = Number(newSale.quantity);
    if (!productId || isNaN(quantity)) return;

    try {
      const created = await sale({ productId, quantity }, token);
      setSales([...sales, created]);
      setNewSale({ productId: '', quantity: '' });
      closeAddModal();
    } catch (err) {
      console.error(err);
      let message = 'failed to create sale';
      if (err instanceof Error) message = err.message;
      else if (typeof err === 'string') message = err;
      setErrorMessage(message);
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

  return (
    <div>
      {isAddModalOpen && (
        <Modal title="Add New Sale" onClose={closeAddModal}>
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
            <CancelButton onClick={closeAddModal}>Cancel</CancelButton>
            <ConfirmButton onClick={handleAddClick}>Add</ConfirmButton>
          </div>
        </Modal>
      )}

      <Table
        columns={columns}
        rows={sales}
        rowKey="_id"
        renderActions={() => null}
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
