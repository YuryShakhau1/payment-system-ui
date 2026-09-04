import React from 'react';
import {Pencil} from 'lucide-react';
import {Cart, CartActions, ProductData} from './ProductsTab'
import {AdjustProductQuantity} from "../../components/AdjustProductQuantity";

interface ProductRowProps {
    isAdmin: boolean;
    product: ProductData;
    cart: Cart;
    cartActions: CartActions;
    onDeletedChange: (e: any, product: ProductData, deleted: boolean) => void;
    onEdit: (product: ProductData) => void;
    onRowClick: (id: string) => void;
}

export const ProductRow = ({
                               isAdmin,
                               product,
                               cart,
                               cartActions,
                               onDeletedChange,
                               onEdit,
                               onRowClick
                           }: ProductRowProps) => {
    return (
        <tr
            onClick={() => onRowClick(product.id)}
            className="cursor-pointer align-middle"
        >
            {isAdmin && (
                <td className="font-monospace text-muted py-3">
                    {`${product.id.substring(0, 8)}...`}
                </td>
            )}

            <td className="fw-semibold py-3 text-start">{product.name}</td>
            <td className="fw-normal py-3 text-start">{product.description}</td>
            <td className="fw-semibold py-3 text-start">{product.price}</td>

            {isAdmin ? (
                <>
                    <td className="py-3 text-center">
                        <div className="form-check form-switch">
                            <input
                                type="checkbox"
                                id="productActiveStatus"
                                checked={!product.deleted}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => onDeletedChange(e, product, !e.target.checked)}
                                className="form-check-input cursor-pointer"
                            />
                            <label htmlFor="productActiveStatus" className={`form-check-label cursor-pointer`}>
                                <span className={`badge rounded-pill fw-semibold ${product.deleted ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success'}`}>
                                    {product.deleted ? 'Deleted' : 'In stock'}
                                </span>
                            </label>
                        </div>
                    </td>
                    <td className="py-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => onEdit(product)}
                            className="btn btn-sm btn-link text-primary p-1 d-inline-flex align-items-center justify-content-center"
                            title="Edit"
                        >
                            <Pencil size={16}/>
                        </button>
                    </td>
                </>
            ) : (
                <td className="fw-semibold py-3 text-start">
                    <AdjustProductQuantity
                        product={product}
                        cart={cart}
                        cartActions={cartActions}
                    />
                </td>
            )}
        </tr>
    );
};
