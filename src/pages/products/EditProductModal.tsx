import React from 'react';
import {ProductData} from './ProductsTab'
import {orderService} from "../../services/order_service";

interface EditProductModalProps {
    product: ProductData | null;
    setProduct: (product: ProductData | null) => void;
    isSaving: boolean;
    modalError: string | null;
    onProductSave: (e: any) => Promise<void>;
    onClose: () => void;
}

export const EditProductModal = ({
                                     product,
                                     setProduct,
                                     isSaving,
                                     modalError,
                                     onProductSave,
                                     onClose,
                                 }: EditProductModalProps) => {
    if (!product) return null;

    return (
        <div className="d-flex w-100">
            <div
                className="bg-white p-4 border rounded shadow-sm me-auto my-3"
                style={{ width: '100%', maxWidth: '650px', minWidth: '360px' }}
            >
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="m-0 h6 fw-bold">Edit Product</h5>
                    <button type="button" className="btn-close" onClick={onClose} disabled={isSaving}></button>
                </div>

                <form onSubmit={onProductSave}>
                    {modalError && (
                        <div className="alert alert-danger py-2 small mb-3">{modalError}</div>
                    )}

                    <div className="mb-3">
                        <label className="form-label fw-bold mb-1">Product Name</label>
                        <input
                            type="text"
                            value={product.name}
                            onChange={(e) => setProduct({...product, name: e.target.value})}
                            required
                            className="form-control form-control-sm"
                            disabled={isSaving}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold mb-1">Description</label>
                        <textarea
                            value={product.description}
                            onChange={(e) => setProduct({...product, description: e.target.value})}
                            required
                            rows={4}
                            className="form-control form-control-sm"
                            disabled={isSaving}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold mb-1">Product Price</label>
                        <input
                            type="number"
                            value={product.price}
                            onChange={(e) => setProduct({...product, price: parseFloat(e.target.value)})}
                            required
                            className="form-control form-control-sm"
                            disabled={isSaving}
                        />
                    </div>

                    <div className="form-check form-switch mb-3">
                        <input
                            type="checkbox"
                            id="productActiveStatus"
                            checked={!product.deleted}
                            onChange={(e) => setProduct({...product, deleted: !e.target.checked})}
                            className="form-check-input cursor-pointer"
                            disabled={isSaving}
                        />
                        <label
                            htmlFor="productActiveStatus"
                            className={`form-check-label fw-bold cursor-pointer ${orderService.getActiveTextClass(!product.deleted)}`}
                        >
                            {product.deleted ? 'Deleted' : 'In Stock'}
                        </label>
                    </div>

                    <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={onClose}
                            disabled={isSaving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-sm btn-primary"
                            style={{ minWidth: '90px' }}
                            disabled={isSaving}
                        >
                            {isSaving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
