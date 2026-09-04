import React, {useCallback, useEffect, useState} from 'react';
import {User as UserIcon} from 'lucide-react';
import {apiClient} from "../../services/api_client";
import {dateService} from "../../services/date_service";

import {Pagination} from '../../components/Pagination';
import {LoadingSpinner} from "../../components/LoadingSpinner";
import {OrderTable} from "./OrderTable";
import {ErrorModal} from "../../components/ErrorModal";
import {OrderDetail} from "./detail/OrderDetail";
import {FiltersComponent, FilterSearch} from "../../components/FiltersComponent";

export interface ProductSnapshot {
    id: string;
    name: string;
    description: string;
    price: number;
    deleted: boolean;
}

export interface OrderItem {
    id: string;
    orderId: string;
    productSnapshot: ProductSnapshot;
    productId: string;
    quantity: number;
    itemPrice: number;
}

export interface ShortUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}

export interface Order {
    id: string;
    user: ShortUser | null;
    userId: string;
    status: string;
    totalPrice: number;
    deleted: boolean;
    createdAt: string;
    items: OrderItem[];
}

interface OrderTabProps {
    isAdmin: boolean;
    userId: string | null;
    updateCart: (orderId: string) => void;
}

const currentSearch: FilterSearch = {
    from: dateService.formatDateForInput(new Date()),
    to: dateService.formatDateForInput(new Date())
};

const OrderTab = ({
                      isAdmin,
                      userId,
                      updateCart
                  }: OrderTabProps) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(0);

    const [search, setSearch] = useState<FilterSearch>(currentSearch);

    const [activeOrder, setActiveOrder] = useState<Order | null>(null);

    const fetchOrders = useCallback(async (from: string, to: string) => {
        try {
            setIsLoading(true);
            setError(null);

            const params = new URLSearchParams({
                page: String(currentPage),
                size: '10'
            });

            if (!isAdmin) params.append('deleted', 'false');

            if (userId) params.append('userId', userId);

            params.append('from', dateService.fromBeginOfDay(from));
            params.append('to', dateService.toEndOfDay(to));

            const url = isAdmin
                ? `/orders/filtered?${params.toString()}`
                : `/orders/me/filtered?${params.toString()}`;

            const ordersRes = await apiClient.get(url);

            const orders: Order[] = ordersRes.data.content || [];
            const totalPagesCount = ordersRes.data.totalPages || 0;
            const totalElementsCount = ordersRes.data.totalElements || 0;

            orders.sort((o1, o2) => o1.createdAt.localeCompare(o2.createdAt));

            setOrders(orders);
            setTotalPages(totalPagesCount);
            setTotalElements(totalElementsCount);
        } catch (err: any) {
            console.error('Failed to load order management:', err);
            const message = err.response?.data?.message || 'Could not load order list. Please try again.';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage]);

    useEffect(() => {
        void fetchOrders(search.from, search.to);
    }, [currentPage, fetchOrders]);

    const handleResetFilters = () => {
        const from = new Date();
        const to = new Date();
        currentSearch.from = dateService.formatDateForInput(from);
        currentSearch.to = dateService.formatDateForInput(to);
        setSearch({...currentSearch});
        if (currentPage === 0) {
            void fetchOrders(search.from, search.to);
        } else {
            setCurrentPage(0);
        }
    };

    const handleSearch = () => {
        if (currentPage === 0) {
            void fetchOrders(search.from, search.to);
        } else {
            setCurrentPage(0);
        }
    };

    const onSaveOrder = (order: Order) => {
        setOrders(orders.map(o => o.id !== order.id ? o : order));
    }

    const handlePrevPage = () => {
        if (currentPage > 0) setCurrentPage(prev => prev - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) setCurrentPage(prev => prev + 1);
    };

    const handleOnBack = (order: Order | null) => {
        if (order) {
            setOrders([...orders.map(o => o.id !== order.id ? o : order)]);
        }
        setActiveOrder(null);
    }

    if (activeOrder) {
        return (
            <OrderDetail
                isAdmin={isAdmin}
                order={activeOrder}
                onSaveOrder={onSaveOrder}
                onBack={(order) => handleOnBack(order)}
                updateCart={updateCart}
                updateUserInfo={() => {}}
            />
        );
    }

    return (
        <div className="w-100 d-flex flex-column gap-4 p-2">
            <div className="row g-4">
                <div className="col-lg-8 col-md-7 d-flex flex-column gap-3">
                    <div className="d-flex align-items-start gap-3 border-secondary-subtle">
                        <div className="border-bottom">
                            <h2 className="h3 fw-bold tracking-tight text-dark mb-0">Orders</h2>
                        </div>
                    </div>
                    <FiltersComponent
                        search={search}
                        setSearch={setSearch}
                        onReset={handleResetFilters}
                        onSearch={handleSearch}
                    />
                </div>
            </div>

            <LoadingSpinner isLoading={isLoading}/>
            <ErrorModal error={error}/>

            {orders.length === 0 ? (
                <div
                    className="d-flex flex-column align-items-center justify-content-center text-center p-5 border border-dashed border-secondary-subtle rounded-3 bg-light"
                    style={{minHeight: '300px'}}>
                    <UserIcon size={48} className="text-muted opacity-50 mb-3"/>
                    <h3 className="h5 fw-bold text-dark mb-1">No orders found.</h3>
                    <p className="text-muted small max-w-sm mb-0">No system identities match your current search
                        filters.</p>
                </div>
            ) : (
                <>
                    <OrderTable
                        isAdmin={isAdmin}
                        orders={orders}
                        onOpenOrderClick={(order) => setActiveOrder(order)}
                        editSelectedOrder={(orderId) => updateCart(orderId)}
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

export default OrderTab;
