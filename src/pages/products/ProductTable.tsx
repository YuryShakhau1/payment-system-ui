import React from 'react';

import {ProductRow} from "./ProductRow";
import {EditProductModal} from "./EditProductModal";
import {Cart, CartActions, ProductData} from './ProductsTab'

interface ProductTableProps {
    isAdmin: boolean;
    products: ProductData[];
    onDeletedChange: (e: any, product: ProductData, deleted: boolean) => void;
    onEdit: (user: ProductData) => void;
    onRowClick: (id: string) => void;
    selectedProduct: ProductData | null;
    setSelectedProduct: (user: ProductData | null) => void;
    isSaving: boolean;
    modalError: string | null;
    cart: Cart;
    cartActions: CartActions;
    onSaveChanges: any;
}

export const ProductTable = ({
                                 isAdmin,
                                 products,
                                 onDeletedChange,
                                 onEdit,
                                 onRowClick,
                                 selectedProduct,
                                 setSelectedProduct,
                                 isSaving,
                                 modalError,
                                 cart,
                                 cartActions,
                                 onSaveChanges
                             }: ProductTableProps) => {
    return (
        <div className="table-responsive w-100 border rounded shadow-sm bg-white">
            <table className="table table-hover align-middle mb-0 small">
                <thead className="table-light text-secondary">
                <tr>
                    {isAdmin && (
                        <th className="py-3 text-start">Product ID</th>
                    )}
                    <th className="py-3 text-start">Name</th>
                    <th className="py-3 text-start">Description</th>
                    <th className="py-3 text-start">Price</th>

                    {isAdmin ? (
                        <>
                            <th className="py-3 text-center">Status</th>
                            <th className="py-3 text-center"></th>
                        </>
                    ) : (
                        <th className="py-3 text-start"></th>
                    )}
                </tr>
                </thead>
                {products.map((product) => (
                    <tbody>
                        <ProductRow
                            isAdmin={isAdmin}
                            product={product}
                            cart={cart}
                            cartActions={cartActions}
                            onDeletedChange={onDeletedChange}
                            onEdit={onEdit}
                            onRowClick={onRowClick}
                        />
                        {selectedProduct && selectedProduct.id === product.id && (
                            <tr className="cursor-pointer align-middle">
                                <td colSpan={6}>
                                    <EditProductModal
                                        product={selectedProduct}
                                        setProduct={setSelectedProduct}
                                        isSaving={isSaving}
                                        modalError={modalError}
                                        onProductSave={onSaveChanges}
                                        onClose={() => setSelectedProduct(null)}
                                    />
                                </td>
                            </tr>
                        )}
                    </tbody>
                ))}
            </table>
        </div>
    );
};
