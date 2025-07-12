import { useState } from 'react';
import CancelButton from '../components/buttons/CancelButton';
import ConfirmButton from '../components/buttons/ConfirmButton';
import TextField from '../components/inputs/TextField';
import Modal from '../components/Modal';
import Table from '../components/Table';
import DeleteButton from '../components/buttons/DeleteButton';
import EditButton from '../components/buttons/EditButton';

const columns = [
  { key: 'productId', label: 'Product ID' },
  { key: 'sale', label: 'Sale' },
  { key: 'saleHistory', label: 'Sale History' },
  { key: 'actions', label: 'ACTIONS' },
] as const;

type SaleType = {
  id: string;
  productId: string;
  sale: number;
  saleHistory: number;
};

type SalesProps = {
  isAddModalOpen: boolean;
  closeAddModal: () => void;
};

const initialNewSale = { productId: '', sale: '', saleHistory: '' };
const initialEditSale = { productId: '', sale: 0, saleHistory: 0 };

export default function Sales({ isAddModalOpen, closeAddModal }: SalesProps) {
  const [sales, setSales] = useState<SaleType[]>([
    { id: '1', productId: '1', sale: 1, saleHistory: 2 },
    { id: '2', productId: '2', sale: 3, saleHistory: 5 },
  ]);

  const [newSale, setNewSale] = useState(initialNewSale);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editSale, setEditSale] = useState(initialEditSale);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isConfirmAddOpen, setConfirmAddOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSale((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSale = () => {
    const productId = newSale.productId.trim();
    const sale = Number(newSale.sale);
    const saleHistory = Number(newSale.saleHistory);

    if (!productId || isNaN(sale) || isNaN(saleHistory)) return;

    const newEntry = {
      id: (sales.length + 1).toString(),
      productId,
      sale,
      saleHistory,
    };
    setSales([...sales, newEntry]);
    setNewSale({ productId: '', sale: '', saleHistory: '' });
    closeAddModal();
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

  const handleEdit = (index: number) => {
    const sale = sales[index];
    setEditSale({
      productId: sale.productId,
      sale: sale.sale,
      saleHistory: sale.saleHistory,
    });
    setEditIndex(index);
  };

  const handleDelete = (index: number) => {
    const updated = [...sales];
    updated.splice(index, 1);
    setSales(updated);
  };

  const handleUpdate = () => {
    if (editIndex === null) return;
    const updated = [...sales];
    updated[editIndex] = {
      ...updated[editIndex],
      productId: editSale.productId,
      sale: editSale.sale,
      saleHistory: editSale.saleHistory,
    };
    setSales(updated);
    setEditIndex(null);
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
            <label className="text-sm">Sale</label>
            <TextField
              name="sale"
              type="number"
              placeholder="Sale"
              value={newSale.sale}
              onChange={handleChange}
            />
            <label className="text-sm">Sale History</label>
            <TextField
              name="saleHistory"
              type="number"
              placeholder="Sale History"
              value={newSale.saleHistory}
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
          <p>Are you sure you want to add this sale?</p>
          <div className="flex justify-end gap-2 mt-4">
            <CancelButton onClick={handleCancelConfirm}>Cancel</CancelButton>
            <ConfirmButton onClick={handleConfirmAdd}>Confirm</ConfirmButton>
          </div>
        </Modal>
      )}

      {editIndex !== null && (
        <Modal title="Edit Sale" onClose={() => setEditIndex(null)}>
          <div className="grid gap-2 mb-4">
            <label className="text-sm">Sale</label>
            <TextField
              name="sale"
              type="number"
              placeholder="Sale"
              value={editSale.sale.toString()}
              onChange={(e) =>
                setEditSale((prev) => ({
                  ...prev,
                  sale: Number(e.target.value),
                }))
              }
            />
            <label className="text-sm">Sale History</label>
            <TextField
              name="saleHistory"
              type="number"
              placeholder="Sale History"
              value={editSale.saleHistory.toString()}
              onChange={(e) =>
                setEditSale((prev) => ({
                  ...prev,
                  saleHistory: Number(e.target.value),
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
        <Modal title="Delete Sale" onClose={() => setDeleteIndex(null)}>
          <p className="mb-4">
            Do you want to delete this sale record for product id{' '}
            <strong>{sales[deleteIndex].productId}</strong>?
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
