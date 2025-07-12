import { useState } from 'react';
import Table from '../components/Table';
import TextField from '../components/inputs/TextField';
import ConfirmButton from '../components/buttons/ConfirmButton';
import Modal from '../components/Modal';
import CancelButton from '../components/buttons/CancelButton';
import DeleteButton from '../components/buttons/DeleteButton';
import EditButton from '../components/buttons/EditButton';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'currentStock', label: 'Stock' },
  { key: 'price', label: 'Price' },
  { key: 'totalSales', label: 'Total Sales' },
  { key: 'actions', label: 'ACTIONS' },
] as const;

type ProductType = {
  id: string;
  name: string;
  currentStock: number;
  price: number;
  totalSales: number;
};

type ProductProps = {
  isAddModalOpen: boolean;
  closeAddModal: () => void;
};

const initialNewProduct = { name: '', stock: '', price: '' };
const initialEditProduct = { name: '', currentStock: 0, price: 0 };

export default function Product({
  isAddModalOpen,
  closeAddModal,
}: ProductProps) {
  const [products, setProducts] = useState<ProductType[]>([
    { id: '1', name: 'Apple', currentStock: 4, price: 5, totalSales: 1 },
    { id: '2', name: 'Carrot', currentStock: 4, price: 5, totalSales: 2 },
    { id: '3', name: 'Banana', currentStock: 4, price: 5, totalSales: 3 },
  ]);

  const [newProduct, setNewProduct] = useState(initialNewProduct);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editProduct, setEditProduct] = useState(initialEditProduct);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isConfirmAddOpen, setConfirmAddOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = () => {
    const name = newProduct.name.trim();
    const price = Number(newProduct.price);
    const stock = Number(newProduct.stock);

    if (!name || isNaN(price) || isNaN(stock)) return;

    const newEntry = {
      id: (products.length + 1).toString(),
      name,
      price,
      currentStock: stock,
      totalSales: 0,
    };
    setProducts([...products, newEntry]);
    setNewProduct({ name: '', price: '', stock: '' });
    closeAddModal();
  };

  const handleAddClick = () => {
    setConfirmAddOpen(true);
  };

  const handleConfirmAdd = () => {
    setConfirmAddOpen(false);
    handleAddProduct();
  };

  const handleCancelConfirm = () => {
    setConfirmAddOpen(false);
  };

  const handleEdit = (index: number) => {
    const product = products[index];
    setEditProduct({
      name: product.name,
      currentStock: product.currentStock,
      price: product.price,
    });
    setEditIndex(index);
  };

  const handleDelete = (index: number) => {
    const updated = [...products];
    updated.splice(index, 1);
    setProducts(updated);
  };

  const handleUpdate = () => {
    if (editIndex === null) return;
    const updated = [...products];
    updated[editIndex] = {
      ...updated[editIndex],
      name: editProduct.name,
      currentStock: editProduct.currentStock,
      price: editProduct.price,
    };
    setProducts(updated);
    setEditIndex(null);
  };

  return (
    <div>
      {isAddModalOpen && (
        <Modal title="Add New Product" onClose={closeAddModal}>
          <div className="grid gap-2 mb-4">
            <label className="text-sm">Name</label>
            <TextField
              name="name"
              type="text"
              placeholder="Name"
              value={newProduct.name}
              onChange={handleChange}
            />
            <label className="text-sm">Stock</label>
            <TextField
              name="stock"
              type="number"
              placeholder="Stock"
              value={newProduct.stock}
              onChange={handleChange}
            />
            <label className="text-sm">Price</label>
            <TextField
              name="price"
              type="number"
              placeholder="Price"
              value={newProduct.price}
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
        rows={products}
        rowKey="id"
        renderActions={(_, index) => (
          <div className="flex justify-center gap-2">
            <DeleteButton onClick={() => setDeleteIndex(index)} />
            <EditButton onClick={() => handleEdit(index)} />
          </div>
        )}
      />

      {isConfirmAddOpen && (
        <Modal title="Confirm Add Product" onClose={handleCancelConfirm}>
          <p>Are you sure you want to add this product?</p>
          <div className="flex justify-end gap-2 mt-4">
            <CancelButton onClick={handleCancelConfirm}>Cancel</CancelButton>
            <ConfirmButton onClick={handleConfirmAdd}>Confirm</ConfirmButton>
          </div>
        </Modal>
      )}
      {editIndex !== null && (
        <Modal title="Edit Product" onClose={() => setEditIndex(null)}>
          <div className="grid gap-2 mb-4">
            <label className="text-sm">Name</label>
            <TextField
              name="name"
              type="text"
              placeholder="Name"
              value={editProduct.name}
              onChange={(e) =>
                setEditProduct((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            <label className="text-sm">Stock</label>
            <TextField
              name="stock"
              type="number"
              placeholder="Stock"
              value={editProduct.currentStock.toString()}
              onChange={(e) =>
                setEditProduct((prev) => ({
                  ...prev,
                  currentStock: Number(e.target.value),
                }))
              }
            />
            <label className="text-sm">Price</label>

            <TextField
              name="price"
              type="number"
              placeholder="Price"
              value={editProduct.price.toString()}
              onChange={(e) =>
                setEditProduct((prev) => ({
                  ...prev,
                  price: Number(e.target.value),
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
                handleAddProduct();
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
        <Modal title="Delete Product" onClose={() => setDeleteIndex(null)}>
          <p className="mb-4">
            Do you want to delete this product{' '}
            <strong>{products[deleteIndex].name}</strong>?
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
              Confrim
            </ConfirmButton>
          </div>
        </Modal>
      )}
    </div>
  );
}
