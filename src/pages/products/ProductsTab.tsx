import React, {useCallback, useEffect, useState} from 'react';
import {User as UserIcon, UserPlus} from 'lucide-react';
import {apiClient} from "../../services/api_client";

import {Pagination} from '../../components/Pagination';
import {CreateProductComponent} from '../../components/CreateProductComponent';
import {LoadingSpinner} from "../../components/LoadingSpinner";
import {ProductsFilters} from "./ProductsFilters";
import {ProductTable} from "./ProductTable";
import {ProductDetail} from "./detail/ProductDetail";
import {ErrorModal} from "../../components/ErrorModal";
import {CartComponent} from "../../components/CartComponent";
import {Order, OrderItem} from "../orders/OrdersTab";
import {orderService} from "../../services/order_service";
import {productService} from "../../services/product_service";

export interface ProductData {
    id: string;
    name: string;
    description: string;
    price: number;
    deleted: boolean;
}

export interface CartItem {
    product: ProductData;
    quantity: number;
}

export interface Cart {
    name: string;
    orderId: string | null;
    orderItems: OrderItem[];
    items: Record<string, CartItem>;
    ids: string[];
    totalPrice: number;
    isEmpty: boolean;
    status: string;
}

export interface CartActions {
    addToCard: (e: any, product: ProductData | null, count: number) => void;
    updateOrder: (order: Order) => void;
    updateCartOrder: (e: any, orderId: string) => void;
    closeForm: (e: any) => void;
    deleteItem: (e: any, productId: string) => void;
    saveOrder: () => void;
    cancelOrder: () => void;
    deleteOrderItem: (e: any, orderItemId: string) => void;
    setIsSaving: (e: any) => void;
}

interface ProductsTabProps {
    isAdmin: boolean;
    editingOrderId: string | null;
    setEditingOrderId: (editingOrderId: string | null) => void;
}

const ProductsTab = ({
                         isAdmin,
                         editingOrderId,
                         setEditingOrderId
                     }: ProductsTabProps) => {
    const [cart, setCart] = useState<Cart>(() => {
        const savedCart = localStorage.getItem('shoppingCart');

        if (savedCart) {
            return JSON.parse(savedCart);
        }

        return orderService.createNewCart();
    });

    const [products, setProducts] = useState<ProductData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(0);

    const [searchString, setSearchString] = useState<string>('');
    const [checkInStockOnly, setCheckInStockOnly] = useState<boolean>(false);

    const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [modalError, setModalError] = useState<string | null>(null);

    const [activeDetailProductId, setActiveDetailProductId] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

    const addToCard = (e: any, product: ProductData | null, count: number) => {
        e.stopPropagation();

        if (!product) {
            return;
        }

        const currenCart = (cart.orderId && !orderService.isStatusCreated(cart.status))
            ? orderService.createNewCart()
            : cart;

        const id = product.id;
        const items = {...currenCart.items};
        let ids = [...currenCart.ids];
        const exist = items[id];
        if (!exist) {
            if (count <= 0) return;
            items[id] = {product: product, quantity: count};
            ids.push(id);
        } else {
            const item = {...items[id]};
            item.quantity = item.quantity + count;
            if (item.quantity <= 0) {
                item.quantity = 0;
            }
            items[id] = item;
        }

        const updateCart = {
            ...currenCart,
            name: currenCart.name,
            status: currenCart.status,
            orderId: currenCart.orderId,
            orderItems: currenCart.orderItems,
            items: items,
            ids: ids,
            totalPrice: orderService.getTotalPrice(items, ids, cart.orderItems),
            isEmpty: (cart.orderItems.length + ids.length === 0)
        }

        localStorage.setItem('shoppingCart', JSON.stringify(updateCart));
        setCart(updateCart);
    }

    const updateOrder = async (order: Order) => {
        const orderItems = [...order.items];
        const updateCart: Cart = {
            ...cart,
            name: 'Order',
            orderItems: orderItems,
            items: {},
            ids: [],
            orderId: order.id,
            status: order.status
        }

        localStorage.setItem('shoppingCart', JSON.stringify(updateCart));
        setCart(updateCart);
    }

    const loadCart = async (orderId: string): Promise<Cart> => {
        const order = await orderService.loadOrder(orderId, null, false);
        const orderItems = [...order.items];

        const updateCart: Cart = {
            ...cart,
            name: 'Order',
            orderId: order.id,
            orderItems: orderItems,
            ids: [],
            items: {},
            status: order.status,
            totalPrice: orderService.getTotalPrice({}, [], order.items),
            isEmpty: orderItems.length === 0
        }

        localStorage.setItem('shoppingCart', JSON.stringify(updateCart));
        return updateCart;
    }

    const updateCartOrder = async (e: any, orderId: string) => {
        if (e) {
            e.stopPropagation();
        }

        try {
            cartActions.setIsSaving(true);
            const updateCart = await loadCart(orderId);
            setCart(updateCart);
        } finally {
            cartActions.setIsSaving(false);
        }
    }

    const closeForm = (e: any) => {
        e.stopPropagation();

        const updateCart = orderService.createNewCart();
        localStorage.setItem('shoppingCart', JSON.stringify(updateCart));
        setCart(updateCart);
    }

    const deleteItem = (e: any, productId: string) => {
        e.stopPropagation();

        const items = {...cart.items};
        delete items[productId];
        const ids = cart.ids.filter(id => id !== productId);
        const isEmpty = (cart.orderItems.length === 0 && ids.length === 0);

        if (isEmpty) {
            cartActions.closeForm(e);
            return;
        }

        const updateCart = {
            ...cart,
            items: items,
            ids: ids,
            totalPrice: orderService.getTotalPrice(items, ids, cart.orderItems),
            isEmpty: isEmpty
        }

        localStorage.setItem('shoppingCart', JSON.stringify(updateCart));
        setCart(updateCart)
    }

    const deleteOrderItem = (e: any, orderItemId: string) => {
        e.stopPropagation();

        setCart({
            ...cart,
            orderItems: cart.orderItems.filter((orderItem) => orderItem.id !== orderItemId)
        })
    }

    const saveOrder = async () => {
        try {
            cartActions.setIsSaving(true);
            const orderItems = cart.ids.map(productId => {
                const item = cart.items[productId];

                return {
                    productId: item.product.id,
                    quantity: item.quantity
                }
            });

            const url = cart.orderId === null ? `/orders` : `orders/${cart.orderId}/me`;
            const orderRes = orderService.isStatusCreated(cart.status)
                ? await apiClient.put(url, {
                    createItems: orderItems,
                    updateItems: cart.orderItems
                })
                : await apiClient.post(url, {items: orderItems});

            cartActions.updateOrder(orderRes.data);
        } finally {
            cartActions.setIsSaving(false);
        }
    }

    const cancelOrder = async () => {
        try {
            setIsSaving(true);
            const order = await orderService.cancelOrder(cart.orderId ? cart.orderId : '', null, false)
            cartActions.updateOrder(order);
        } catch (err: any) {
            if (err.response) {
                const message = err.response.data?.message || 'Failed to cancel order. Please try again.';
                setError(message);
            } else if (err.request) {
                setError('Server is not responding. Please check your internet connection.');
            } else {
                setError('An unexpected error occurred. Please try again later.');
            }
        } finally {
            setIsSaving(false);
        }
    }

    const cartActions: CartActions = {
        addToCard: addToCard,
        updateOrder: updateOrder,
        updateCartOrder: updateCartOrder,
        closeForm: closeForm,
        deleteItem: deleteItem,
        saveOrder: saveOrder,
        cancelOrder: cancelOrder,
        deleteOrderItem: deleteOrderItem,
        setIsSaving: (isSaving: boolean) => false
    };

    const fetchProducts = useCallback(async (
        name = searchString, inStockOnly = checkInStockOnly) => {
        try {
            setIsLoading(true);
            setError(null);

            const params = new URLSearchParams({
                page: String(currentPage),
                size: '10'
            });

            if (name.trim()) params.append('search', name.trim());
            if (isAdmin) {
                if (inStockOnly) {
                    params.append('deleted', 'false');
                }
            } else {
                params.append('deleted', 'false');
            }

            const response = await apiClient.get(`/products?${params.toString()}`);

            const content = response.data?.content || [];
            const totalPagesCount = response.data?.totalPages || 0;
            const totalElementsCount = response.data?.totalElements || 0;

            setProducts(content);
            setTotalPages(totalPagesCount);
            setTotalElements(totalElementsCount);
        } catch (err: any) {
            console.error('Failed to load product management:', err);
            const message = err.response?.data?.message || 'Could not load product list. Please try again.';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage]);

    useEffect(() => {
        void fetchProducts();
    }, [currentPage]);

    useEffect(() => {
        const initCart = async () => {
            if (cart.orderId) {
                const freshCart = await loadCart(cart.orderId);
                setCart(freshCart);
            }
        };

        void initCart();
    }, []);


        useEffect(() => {
            if (editingOrderId) {
                void updateCartOrder(null, editingOrderId);
                setEditingOrderId(null);
            }
        });

    const handleResetFilters = () => {
        setSearchString('');
        setCheckInStockOnly(false)
        if (currentPage === 0) {
            void fetchProducts('', false);
        } else {
            setCurrentPage(0);
        }
    };

    const handleSearch = () => {
        if (currentPage === 0) {
            void fetchProducts(searchString, checkInStockOnly);
        } else {
            setCurrentPage(0);
        }
    };

    const handleSearchStringChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchString(e.target.value);
    };

    const handleCheckInStockOnly = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {checked} = e.target;
        setCheckInStockOnly(checked);
    };

    const handleProductChanged = () => {
        if (currentPage === 0) {
            void fetchProducts();
        } else {
            setCurrentPage(0);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 0) setCurrentPage(prev => prev - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) setCurrentPage(prev => prev + 1);
    };

    const handleOpenEditModal = (product: ProductData) => {
        setSelectedProduct({...product});
        setModalError(null);
    };

    const handleOnDeletedChange = async (e: any, product: ProductData, deleted: boolean) => {
        const productRes = await apiClient.patch(`/products/${product.id}`, {
            deleted: deleted,
        });

        const productData = productRes.data;
        setProducts(prevProducts => prevProducts.map(p => p.id === productData.id ? {...p, ...productData} : p));
    }

    const handleSaveChanges = async (e: any) => {
        e.preventDefault();

        if (!selectedProduct) return;
        try {
            setIsSaving(true);
            setModalError(null);
            const response = await apiClient.patch(`/products/${selectedProduct.id}`, {
                name: selectedProduct.name,
                description: selectedProduct.description,
                price: selectedProduct.price,
                deleted: selectedProduct.deleted,
            });

            const updatedProduct = response.data || selectedProduct;
            setProducts(prevProducts => prevProducts.map(p => p.id === selectedProduct.id ? {...p, ...updatedProduct} : p));
            setSelectedProduct(null);
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to update product. Please try again.';
            setModalError(message);
        } finally {
            setIsSaving(false);
        }
    };

    if (activeDetailProductId) {
        return (
            <ProductDetail
                isAdmin={isAdmin}
                productId={activeDetailProductId}
                onBack={() => setActiveDetailProductId(null)}
                onProductUpdated={(updatedProduct) => {
                    setProducts(prevProducts =>
                        prevProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p)
                    );
                }}
            />
        );
    }

    return (
        <div className="w-100 d-flex flex-column gap-4 p-2">
            <div className="row g-4">
                <div className="col-lg-8 col-md-7 d-flex flex-column gap-3">
                    <div className="d-flex align-items-start gap-3 border-secondary-subtle">
                        <div className="border-bottom">
                            <h2 className="h3 fw-bold tracking-tight text-dark mb-0">Products</h2>
                        </div>
                    </div>
                    {isAdmin && (
                        <button
                            className="btn btn-primary d-flex align-self-start gap-2 shadow-sm"
                            onClick={() => setIsCreateModalOpen(!isCreateModalOpen)}
                        >
                            <UserPlus size={16}/>
                            {isCreateModalOpen ? 'Hide Form' : 'Add Product'}
                        </button>
                    )}
                    {isCreateModalOpen && (
                        <div className="d-flex justify-content-start w-100">
                            <CreateProductComponent
                                onClose={() => setIsCreateModalOpen(false)}
                                isSaving={isSaving}
                                modalError={modalError}
                                onProductCreated={handleProductChanged}
                                apiClient={apiClient}
                            />
                        </div>
                    )}
                    <ProductsFilters
                        isAdmin={isAdmin}
                        searchString={searchString}
                        checkInStockOnly={checkInStockOnly}
                        onSearchStringChange={handleSearchStringChange}
                        onCheckInStockOnly={handleCheckInStockOnly}
                        onReset={handleResetFilters}
                        onSearch={handleSearch}
                    />
                </div>
                <CartComponent
                    cart={cart}
                    cartActions={cartActions}
                />
            </div>

            <LoadingSpinner isLoading={isLoading}/>
            <ErrorModal error={error}/>

            {products.length === 0 ? (
                <div
                    className="d-flex flex-column align-items-center justify-content-center text-center p-5 border border-dashed border-secondary-subtle rounded-3 bg-light"
                    style={{minHeight: '300px'}}>
                    <UserIcon size={48} className="text-muted opacity-50 mb-3"/>
                    <h3 className="h5 fw-bold text-dark mb-1">No products found.</h3>
                    <p className="text-muted small max-w-sm mb-0">No system identities match your current search
                        filters.</p>
                </div>
            ) : (
                <>
                    <ProductTable
                        isAdmin={isAdmin}
                        products={products}
                        onDeletedChange={handleOnDeletedChange}
                        onEdit={handleOpenEditModal}
                        onRowClick={(id) => setActiveDetailProductId(id)}
                        selectedProduct={selectedProduct}
                        setSelectedProduct={setSelectedProduct}
                        isSaving={isSaving}
                        modalError={modalError}
                        cart={cart}
                        cartActions={cartActions}
                        onSaveChanges={handleSaveChanges}
                    />

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalElements={totalElements}
                        onPrevPage={handlePrevPage}
                        onNextPage={handleNextPage}
                    />
                </>
            )}
        </div>
    );
};

export default ProductsTab
