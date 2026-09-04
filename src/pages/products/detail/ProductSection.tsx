import React, {useEffect, useState} from 'react';
import {apiClient} from "../../../services/api_client";
import {EditProductModal} from "../EditProductModal";
import {ProductData} from '../ProductsTab';
import {Pencil} from "lucide-react";

interface EditProductModalProps {
    isAdmin: boolean;
    productId: string;
    onProductUpdated: any;
    onClose: () => void;
}

export const ProductSection = (
    {
        isAdmin,
        productId,
        onProductUpdated,
        onClose
    }: EditProductModalProps) => {
    const [product, setProduct] = useState<ProductData | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const [editProductData, setEditProductData] = useState<ProductData | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [modalError, setModalError] = useState<string | null>(null);

    const fetchProduct = async () => {
        const res = await apiClient.get(`products/${productId}`);
        setProduct(res.data);
    };

    useEffect(() => {
        void fetchProduct();
    }, [productId]);

    const onProductSave = async (e: any) => {
        e.preventDefault();

        if (!editProductData) return;

        try {
            setIsSaving(true);
            setModalError(null);
            const res = await apiClient.patch(`products/${productId}`, editProductData);
            setProduct(res.data);
            setIsEditing(false);

            if (onProductUpdated) {
                onProductUpdated(res.data);
            }
        } catch (err: any) {
            setModalError(err.response?.data?.message || "Error saving product changes.");
        } finally {
            setIsSaving(false);
        }
    };

    if (!product) return <div className="p-3 text-muted small font-monospace">Loading...</div>;

    return (
        <div className="w-100">
            {!isEditing ? (
                <div className="bg-white p-3 border rounded shadow-sm"
                     style={{width: '100%', maxWidth: '850px', minWidth: '360px'}}>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="m-0 h6 fw-bold">Product Details</h5>
                        {isAdmin && (
                            <div className="d-flex justify-content-end">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-secondary border-0 p-0 d-flex align-items-center justify-content-center"
                                    style={{width: '32px', height: '32px', minWidth: '32px'}}
                                    onClick={() => {
                                        setEditProductData({...product});
                                        setModalError(null);
                                        setIsEditing(true);
                                    }}
                                    title="Edit Product"
                                >
                                    <Pencil size={16}/>
                                </button>
                                <button
                                    type="button"
                                    title="Remove cart item"
                                    className="btn-close text-center"
                                    onClick={onClose}
                                />
                            </div>
                        )}
                    </div>

                    <div className="mb-3">
                        <label className="form-label small mb-1 fw-bold d-block">Product Name</label>
                        <div className="text-dark fw-medium">{product.name || '—'}</div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label small mb-1 fw-bold d-block">Description</label>
                        <div className="text-dark text-wrap text-break">{product.description || '—'}</div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label small mb-1 fw-bold d-block">Price</label>
                        <div className="text-dark fw-bold">{product.price}</div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label small mb-1 fw-bold d-block">Status</label>
                        <span className={`badge rounded-pill fw-semibold ${product.deleted ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success'}`}>
                             {product.deleted ? 'Deleted' : 'In stock'}
                        </span>
                    </div>
                </div>
            ) : (
                <EditProductModal
                    product={editProductData}
                    setProduct={setEditProductData}
                    isSaving={isSaving}
                    modalError={modalError}
                    onProductSave={onProductSave}
                    onClose={() => setIsEditing(false)}
                />
            )}
        </div>
    );
};
