import { useState } from 'react';
import Table from '../components/Table';
import Modal from '../components/Modal';
import TextField from '../components/inputs/TextField';
import CancelButton from '../components/buttons/CancelButton';
import ConfirmButton from '../components/buttons/ConfirmButton';
import DeleteButton from '../components/buttons/DeleteButton';
import EditButton from '../components/buttons/EditButton';

const columns = [
  { key: 'productId', label: 'Product ID' },
  { key: 'adjustType', label: 'Adjust Type' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'actions', label: 'ACTIONS' },
] as const;

type StockAdjustmentType = {
  id: string;
  productId: string;
  adjustType: number;
  quantity: number;
};
type StockAdjustmentProps = {
  isAddModalOpen: boolean;
  closeAddModal: () => void;
};

const initialNewStockAdjustment = {
  productId: '',
  adjustType: '',
  quantity: '',
};
const initialEditStockAdjustment = {
  productId: '',
  adjustType: 0,
  quantity: 0,
};

export default function StockAdjustment({
  isAddModalOpen,
  closeAddModal,
}: StockAdjustmentProps) {
  const [stockAdjustment, setStockAdjustment] = useState<StockAdjustmentType[]>(
    [
      { id: '1', productId: '1', adjustType: 1, quantity: 2 },
      { id: '2', productId: '2', adjustType: 3, quantity: 5 },
    ],
  );

  const [newStock, setNewStock] = useState(initialNewStockAdjustment);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editStock, setEditStock] = useState(initialEditStockAdjustment);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isConfirmAddOpen, setConfirmAddOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStock((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddStock = () => {
    const productId = newStock.productId.trim();
    const adjustType = Number(newStock.adjustType);
    const quantity = Number(newStock.quantity);

    if (!productId || isNaN(adjustType) || isNaN(quantity)) return;

    const newEntry = {
      id: (stockAdjustment.length + 1).toString(),
      productId,
      adjustType,
      quantity,
    };
    setStockAdjustment([...stockAdjustment, newEntry]);
    setNewStock({ productId: '', adjustType: '', quantity: '' });
    closeAddModal();
  };

  const handleAddClick = () => {
    setConfirmAddOpen(true);
  };

  const handleConfirmAdd = () => {
    setConfirmAddOpen(false);
    handleAddStock();
  };

  const handleCancelConfirm = () => {
    setConfirmAddOpen(false);
  };

  const handleEdit = (index: number) => {
    const sale = stockAdjustment[index];
    setEditStock({
      productId: sale.productId,
      adjustType: sale.adjustType,
      quantity: sale.quantity,
    });
    setEditIndex(index);
  };

  const handleDelete = (index: number) => {
    const updated = [...stockAdjustment];
    updated.splice(index, 1);
    setStockAdjustment(updated);
  };

  const handleUpdate = () => {
    if (editIndex === null) return;
    const updated = [...stockAdjustment];
    updated[editIndex] = {
      ...updated[editIndex],
      productId: editStock.productId,
      adjustType: editStock.adjustType,
      quantity: editStock.quantity,
    };
    setStockAdjustment(updated);
    setEditIndex(null);
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
            <TextField
              name="adjustType"
              type="number"
              placeholder="Adjust Type"
              value={newStock.adjustType}
              onChange={handleChange}
            />
            <label className="text-sm">Quantity</label>
            <TextField
              name="quantity"
              type="number"
              placeholder="Quantity"
              value={newStock.quantity}
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
        rowKey="id"
        renderActions={(_, index) => (
          <div className="flex justify-center gap-2">
            <DeleteButton onClick={() => setDeleteIndex(index)} />
            <EditButton onClick={() => handleEdit(index)} />
          </div>
        )}
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

      {editIndex !== null && (
        <Modal title="Edit Stock" onClose={() => setEditIndex(null)}>
          <div className="grid gap-2 mb-4">
            <label className="text-sm">Adjust Type</label>
            <TextField
              name="adjustType"
              type="number"
              placeholder="Adjust Type"
              value={editStock.adjustType.toString()}
              onChange={(e) =>
                setEditStock((prev) => ({
                  ...prev,
                  adjustType: Number(e.target.value),
                }))
              }
            />
            <label className="text-sm">Quantity</label>
            <TextField
              name="quantity"
              type="number"
              placeholder="Quantity"
              value={editStock.quantity.toString()}
              onChange={(e) =>
                setEditStock((prev) => ({
                  ...prev,
                  quantity: Number(e.target.value),
                }))
              }
            />
          </div>
          <div className="flex justify-end gap-2">
            <CancelButton onClick={() => setEditIndex(null)}>
              Cancel
            </CancelButton>
            <ConfirmButton onClick={() => setShowConfirm(true)}>
              Save
            </ConfirmButton>
          </div>
        </Modal>
      )}

      {showConfirm && (
        <Modal title="Confirm Save" onClose={() => setShowConfirm(false)}>
          <p>Are you sure you want to save the changes?</p>
          <div className="flex justify-end gap-2 mt-4">
            <CancelButton onClick={() => setShowConfirm(false)}>
              Cancel
            </CancelButton>
            <ConfirmButton
              onClick={() => {
                handleUpdate();
                setShowConfirm(false);
                setEditIndex(null);
              }}
            >
              Confirm
            </ConfirmButton>
          </div>
        </Modal>
      )}

      {deleteIndex !== null && (
        <Modal title="Delete Stock" onClose={() => setDeleteIndex(null)}>
          <p className="mb-4">
            Do you want to delete this stock record for product id{' '}
            <strong>{stockAdjustment[deleteIndex].productId}</strong>?
          </p>
          <div className="flex justify-end gap-2">
            <CancelButton onClick={() => setDeleteIndex(null)}>
              Cancel
            </CancelButton>
            <ConfirmButton
              onClick={() => {
                handleDelete(deleteIndex);
                setDeleteIndex(null);
              }}
            >
              Confirm
            </ConfirmButton>
          </div>
        </Modal>
      )}
    </div>
  );
}
