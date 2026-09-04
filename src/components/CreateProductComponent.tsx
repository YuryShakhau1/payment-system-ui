import React, {useState} from 'react';

interface CreateProductData {
    name: string;
    description: string;
    price: number | null;
}

interface CreateProductModalProps {
    onClose: () => void;
    isSaving: boolean;
    modalError: string | null;
    onProductCreated: (newProduct: any) => void;
    apiClient: any;
}

export const CreateProductComponent = ({
                                       onClose,
                                       isSaving,
                                       modalError,
                                       onProductCreated,
                                       apiClient
                                   }: CreateProductModalProps) => {
    const [productData, setProductData] = useState<CreateProductData>({name: '', description: '', price: null});
    const [localError, setLocalError] = useState<string | null>(null);
    const [localSaving, setLocalSaving] = useState(false);

    const handleCreateProduct = async (e: any) => {
        e.preventDefault();

        if (productData.name === '' || productData.description === '' || productData.price === 0) {
            alert("Please fill out all fields.");
            return
        }

        try {
            setLocalSaving(true);
            setLocalError(null);
            const response = await apiClient.post(`/products`, productData);

            onProductCreated(response.data);
        } catch (err: any) {
            setLocalError(err.response?.data?.message || 'Failed to create product.');
        } finally {
            setLocalSaving(false);
            setProductData({name: '', description: '', price: 0});
        }
    };

    const activeSaving = isSaving || localSaving;
    const activeError = modalError || localError;

    return (
        <div className="w-100 bg-white p-3 border rounded shadow-sm mb-4" style={{maxWidth: '500px'}}>
            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                <h5 className="m-0 h5 fw-bold">Create Product</h5>
                <button type="button" className="btn-close" onClick={onClose} disabled={activeSaving}></button>
            </div>

            {activeError && <div className="alert alert-danger py-2 small mb-3">{activeError}</div>}

            <form onSubmit={handleCreateProduct}>
                <div className="mb-2">
                    <label className="form-label fw-bold mb-1">Name</label>
                    <input
                        type="text"
                        value={productData.name}
                        onChange={(e) => setProductData({...productData, name: e.target.value})}
                        placeholder="Product Name"
                        className="form-control form-control-sm"
                        disabled={activeSaving}
                    />
                </div>

                <div className="mb-2">
                    <label className="form-label fw-bold mb-1">Description</label>
                    <textarea
                        value={productData.description}
                        required
                        rows={4}
                        onChange={(e) => setProductData({...productData, description: e.target.value})}
                        placeholder="Description"
                        className="form-control form-control-sm"
                        disabled={activeSaving}
                    />
                </div>

                <div className="mb-2">
                    <label className="form-label fw-bold mb-1">Price</label>
                    <input
                        type="number"
                        value={productData.price ? productData.price : ''}
                        onChange={(e) => setProductData({...productData, price: parseFloat(e.target.value)})}
                        placeholder="Product Price"
                        className="form-control form-control-sm"
                        disabled={activeSaving}
                    />
                </div>

                <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={onClose}
                        disabled={activeSaving}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-sm btn-primary"
                        style={{minWidth: '100px'}}
                        disabled={activeSaving}
                    >
                        {activeSaving ? 'Creating...' : 'Create Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};
