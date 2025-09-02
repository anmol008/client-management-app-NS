import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { productApi, Product, CreateProductRequest, UpdateProductRequest } from "@/services/api";
import { toast } from "sonner";

interface ProductsContextType {
  products: Product[];
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  loadProducts: () => Promise<void>;
  createProduct: (productData: CreateProductRequest) => Promise<boolean>;
  updateProduct: (productData: UpdateProductRequest) => Promise<boolean>;
  deleteProduct: (productId: number) => Promise<boolean>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productApi.getAll();
      setProducts(data);
    } catch (error) {
      toast.error("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: CreateProductRequest): Promise<boolean> => {
    try {
      setCreating(true);
      const newProduct = await productApi.create(productData);
      setProducts(prev => [...prev, newProduct]);
      toast.success("Product created successfully");
      return true;
    } catch (error) {
      toast.error("Failed to create product. Please try again.");
      return false;
    } finally {
      setCreating(false);
    }
  };

  const updateProduct = async (productData: UpdateProductRequest): Promise<boolean> => {
    try {
      setUpdating(true);
      await productApi.update(productData);
      setProducts(prev =>
        prev.map(product =>
          product.main_app_id === productData.main_app_id
            ? { ...product, ...productData }
            : product
        )
      );
      toast.success("Product updated successfully");
      return true;
    } catch (error) {
      toast.error("Failed to update product. Please try again.");
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const deleteProduct = async (productId: number): Promise<boolean> => {
    try {
      setDeleting(true);
      await productApi.delete({ main_app_id: productId, is_active: false });
      setProducts(prev => prev.filter(product => product.main_app_id !== productId));
      toast.success("Product deleted successfully");
      return true;
    } catch (error) {
      toast.error("Failed to delete product. Please try again.");
      return false;
    } finally {
      setDeleting(false);
    }
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
        creating,
        updating,
        deleting,
        loadProducts,
        createProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
};