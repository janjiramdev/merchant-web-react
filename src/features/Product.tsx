import { useEffect, useState, type ChangeEvent } from 'react';
import FailedAlert from '../components/alerts/FailedAlert';
import CancelButton from '../components/buttons/CancelButton';
import ConfirmButton from '../components/buttons/ConfirmButton';
import DeleteButton from '../components/buttons/DeleteButton';
import EditButton from '../components/buttons/EditButton';
import TextField from '../components/inputs/TextField';
import Modal from '../components/modals/Modal';
import Table from '../components/Table';
import type {
  IAddModalProps,
  IProduct,
} from '../interfaces/features.interface';
import {
  createProduct,
  deleteProduct,
  searchProducts,
  updateProduct,
} from '../services/productsService';
import type {
  ICreateProductData,
  ISearchProductResponse,
  IUpdateProductData,
} from '../interfaces/services.interface';

const columns = [
  { key: '_id', label: 'Product ID' },
  { key: 'name', label: 'Name' },
  { key: 'description', label: 'Description' },
  { key: 'currentStock', label: 'Stock' },
  { key: 'price', label: 'Price' },
  { key: 'totalSales', label: 'Total Sales' },
  { key: 'actions', label: 'ACTIONS' },
] as const;

export default function Product({ isOpen, close }: IAddModalProps) {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [newProduct, setNewProduct] = useState<ICreateProductData>({
    name: '',
    description: '',
    price: 0,
  });
  const [editIndex, setEditIndex] = useState<number | undefined>(undefined);
  const [editProduct, setEditProduct] = useState<IUpdateProductData>({
    name: '',
    description: '',
    price: 0,
  });
  const [deleteId, setDeleteId] = useState<string | undefined>(undefined);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [isConfirmAddOpen, setConfirmAddOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = async () => {
    const name = newProduct.name.trim();
    const description = newProduct.description?.trim() ?? '';
    const price = Number(newProduct.price);

    if (!name || isNaN(price) || price <= 0) {
      setErrorMessage('please enter a valid name and price greater than 0.');
      return;
    }

    try {
      const payload: {
        name: string;
        price: number;
        description?: string;
      } = { name, price };

      if (description && description !== '') payload.description = description;
      const createdProduct = await createProduct(payload);

      setProducts([...products, createdProduct]);
      setNewProduct({ name: '', description: '', price: 0 });
      close();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Create Product Failed',
      );
    }
  };

  const handleAddClick = () => {
    setConfirmAddOpen(true);
  };

  const handleConfirmAdd = async () => {
    setConfirmAddOpen(false);
    await handleAddProduct();
  };

  const handleCancelConfirm = () => {
    setConfirmAddOpen(false);
  };

  const handleEdit = (index: number) => {
    const product = products[index];
    setEditProduct({
      name: product.name,
      description: product.description ?? '',
      price: product.price,
    });
    setEditIndex(index);
  };

  const handleUpdate = async () => {
    if (editIndex === undefined) return;

    const product = products[editIndex];
    const id = product._id;
    const name = editProduct?.name?.trim();
    const price = Number(editProduct.price);
    const description = editProduct.description?.trim();

    const payload: {
      name?: string;
      price?: number;
      description?: string;
    } = {};

    if (name) payload.name = name;
    if (!isNaN(price) && price > 0) payload.price = price;
    if (description) payload.description = description;
    if (Object.keys(payload).length === 0) {
      setErrorMessage('please enter at least one valid field to update.');
      return;
    }

    try {
      await updateProduct(id, payload);

      const updated = [...products];
      updated[editIndex] = {
        ...updated[editIndex],
        ...payload,
      };

      setProducts(updated);
      setEditIndex(undefined);
      setShowConfirm(false);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Update Product Failed',
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p._id !== id));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Delete Product Failed',
      );
    }
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const data: ISearchProductResponse[] = await searchProducts();
        setProducts(data);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : 'Search Product Failed',
        );
      }
    };
    fetch();
  }, []);

  return (
    <div>
      {isOpen && (
        <Modal title="Add New Product" onClose={close}>
          <div className="grid gap-2 mb-4">
            {errorMessage && (
              <FailedAlert
                message={errorMessage}
                onClose={() => setErrorMessage('')}
              />
            )}

            <label className="text-sm">Name</label>
            <TextField
              name="name"
              type="text"
              placeholder="Name"
              value={newProduct.name}
              onChange={handleChange}
            />

            <label className="text-sm">Description</label>
            <TextField
              name="description"
              type="text"
              placeholder="Description"
              value={newProduct.description}
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
            <CancelButton onClick={close}>Cancel</CancelButton>
            <ConfirmButton onClick={handleAddClick}>Add</ConfirmButton>
          </div>
        </Modal>
      )}

      <Table
        columns={columns}
        rows={products}
        rowKey="_id"
        renderActions={(row) => (
          <div className="flex justify-center gap-2">
            <DeleteButton onClick={() => setDeleteId(row._id)} />
            <EditButton
              onClick={() =>
                handleEdit(products.findIndex((p) => p._id === row._id))
              }
            />
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

      {editIndex !== undefined && (
        <Modal title="Edit Product" onClose={() => setEditIndex(undefined)}>
          <div className="grid gap-2 mb-4">
            {errorMessage && (
              <FailedAlert
                message={errorMessage}
                onClose={() => setErrorMessage('')}
              />
            )}

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

            <label className="text-sm">Description</label>
            <TextField
              name="description"
              type="text"
              placeholder="Description"
              value={editProduct.description ?? ''}
              onChange={(e) =>
                setEditProduct((prev) => ({
                  ...prev,
                  description: String(e.target.value),
                }))
              }
            />

            <label className="text-sm">Price</label>
            <TextField
              name="price"
              type="number"
              placeholder="Price"
              value={editProduct.price?.toString() ?? ''}
              onChange={(e) =>
                setEditProduct((prev) => ({
                  ...prev,
                  price: Number(e.target.value),
                }))
              }
            />
          </div>

          <div className="flex justify-end gap-2">
            <CancelButton
              onClick={() => {
                setEditIndex(undefined);
                setErrorMessage('');
              }}
            >
              Cancel
            </CancelButton>

            <ConfirmButton
              onClick={() => {
                if (
                  !editProduct.name ||
                  editProduct.price == undefined ||
                  editProduct.price <= 0
                ) {
                  setErrorMessage(
                    'Please enter a valid name and price greater than 0',
                  );
                  return;
                }
                setShowConfirm(true);
              }}
            >
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
              }}
            >
              Confirm
            </ConfirmButton>
          </div>
        </Modal>
      )}

      {deleteId !== undefined && (
        <Modal title="Delete Product" onClose={() => setDeleteId(undefined)}>
          <p className="mb-4">
            Do you want to delete this product{' '}
            <strong>{products.find((p) => p._id === deleteId)?.name}</strong>
            ?{' '}
          </p>
          <div className="flex justify-end gap-2">
            <CancelButton onClick={() => setDeleteId(undefined)}>
              Cancel
            </CancelButton>

            <ConfirmButton
              onClick={() => {
                handleDelete(deleteId);
                setDeleteId(undefined);
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
