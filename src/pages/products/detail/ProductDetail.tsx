import React, {useState} from 'react';
import {ProductSection} from "./ProductSection";
import {ProductData} from '../ProductsTab'

interface UserDetailProps {
    isAdmin: boolean;
    productId: string;
    onBack: () => void;
    onProductUpdated?: (updatedProduct: ProductData) => void;
}

export const ProductDetail = ({isAdmin, productId, onBack, onProductUpdated}: UserDetailProps) => {
    const [error] = useState<string | null>(null);

    if (error) {
        return (
            <div className="alert alert-danger m-3 d-flex flex-column align-items-start gap-2" role="alert">
                <span>{error}</span>
                <button onClick={onBack} className="btn btn-sm btn-outline-danger">← Back</button>
            </div>
        );
    }

    return (
        <div className="w-100 d-flex flex-column gap-3 p-2">
            <div>
                <button onClick={onBack} className="btn btn-sm btn-outline-secondary">← Back</button>
            </div>

            <ProductSection
                isAdmin={isAdmin}
                productId={productId}
                onProductUpdated={onProductUpdated}
                onClose={onBack}
            />
        </div>
    );
};
