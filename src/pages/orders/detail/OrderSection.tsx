import React, {useEffect, useState} from 'react';
import {apiClient} from "../../../services/api_client";
import {Order, OrderItem} from '../OrdersTab';
import {Pencil} from "lucide-react";
import {orderService} from "../../../services/order_service";
import {LoadingSpinner} from "../../../components/LoadingSpinner";
import {productService} from "../../../services/product_service";

interface EditOrderSectionProps {
    isAdmin: boolean;
    orderId: string;
    onSaveOrder: (order: Order) => void;
    onBackClick: (order: Order) => void;
    updateCart: (orderId: string) => void;
}

export const OrderSection = ({
                                 isAdmin,
                                 orderId,
                                 onSaveOrder,
                                 onBackClick,
                                 updateCart
                             }: EditOrderSectionProps) => {
    const [order, setOrder] = useState<Order | null>(null);

    const [isSaving, setIsSaving] = useState(false);

    const fetchOrder = async () => {
        const url = isAdmin ? `orders/${orderId}` : `orders/${orderId}/me`;
        const orderRes = await apiClient.get(url);
        const orderData: Order = orderRes.data;
        setOrder(orderData);
    };

    useEffect(() => {
        void fetchOrder();
    }, [orderId]);

    const deleteItem = (itemId: string) => {
        if (!order) return null;

        setOrder({
            ...order,
            items: order.items.filter(item => item.id !== itemId) || []
        });
    }

    const updateOrder = async (order: Order) => {
        try {
            setIsSaving(true);
            const url = isAdmin
                ? `/orders/${order.id}?userId=${order.userId}`
                : `orders/${order.id}/me`;
            const updatedOrderRes = await apiClient.put(url, {
                createItems: [],
                updateItems: order.items
            });

            const updatedOrder: Order = updatedOrderRes.data;
            onSaveOrder(updatedOrder)
            onBackClick(order);
        } catch (err) {
            alert('Error while saving order.');
        } finally {
            setIsSaving(false);
        }
    }

    const cancelOrder = async () => {
        const orderRes = await orderService.cancelOrder(orderId, order ? order.userId : '', isAdmin);
        onBackClick(orderRes)
    }

    const deleteOrder = async () => {
        const orderRes = await orderService.deleteOrder(orderId, order ? order.userId : '', isAdmin);
        onBackClick(orderRes)
    }

    const changeOrderStatus = async (status: string) => {
        const orderRes = await orderService.changeOrderStatus(
            orderId, order ? order.userId : '', isAdmin, status);
        onBackClick(orderRes)
    }

    const editOrder = () => {
        updateCart(orderId);
    }

    if (!order) return <LoadingSpinner isLoading={!order}/>;

    const orderIsCreated = orderService.isCreated(order)

    return (
        <div className="w-100">
            <div className="bg-white p-3 border rounded shadow-sm"
                 style={{width: '100%', maxWidth: '850px', minWidth: '360px'}}>

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="m-0 h6 fw-bold">Order Details</h5>
                    <div className="d-flex gap-2 justify-content-end mt-2">
                        {!isAdmin && orderIsCreated && (
                            <button
                                type="button"
                                className="btn btn-sm border-0 p-0 d-flex align-items-center justify-content-end"
                                onClick={editOrder}
                                title="Edit Order"
                            >
                                <Pencil className="mt-n2" size={16}/>
                            </button>
                        )}
                        <button
                            type="button"
                            title="Close"
                            className="btn-close text-center"
                            onClick={() => onBackClick(order)}
                        />
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label small mb-1 fw-bold d-block text-muted">ID</label>
                    <div className="text-dark font-monospace fw-bold">{order.id || '—'}</div>
                </div>

                <div className="mb-3">
                    <label className="form-label small mb-1 fw-bold d-block text-muted">Status</label>
                    <div className={`fw-medium ${orderService.getStatusTextClass(order.status)}`}>
                        {order.status || '—'}
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label small mb-1 fw-bold d-block text-muted">Total Price</label>
                    <div className="text-dark fw-bold">
                        {order.totalPrice || '—'}
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label small mb-1 fw-bold d-block text-muted">Active</label>
                    <span
                        className={`badge rounded-pill fw-semibold ${order.deleted ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success'}`}>
                         {order.deleted ? 'Deleted' : 'Active'}
                    </span>
                </div>

                <hr className="text-muted my-4"/>

                <div className="mb-0">
                    <label
                        className="form-label small mb-2 fw-bold d-block text-uppercase font-monospace"
                        style={{fontSize: '11px', letterSpacing: '0.5px'}}>
                        Items ({order.items.length || 0})
                    </label>

                    {!order.items || order.items.length === 0 ? (
                        <div className="text-muted small py-2">No items.</div>
                    ) : (
                        <div className="table-responsive border rounded bg-light-subtle">
                            <table className="table table-sm table-borderless mb-0 align-middle small">
                                <thead
                                    className="table-light border-bottom text-muted font-monospace text-uppercase"
                                    style={{fontSize: '11px'}}>
                                <tr>
                                    <th className="py-2 ps-3">Item ID</th>
                                    <th className="py-2 text-start">Product ID</th>
                                    <th className="py-2 text-start">Product</th>
                                    <th className="py-2 text-center">Quantity</th>
                                    <th className="py-2 text-end pe-3">Item Price</th>
                                    {orderIsCreated && (
                                        <th className="py-2 text-center pe-3">Item Price</th>
                                    )}
                                </tr>
                                </thead>
                                <tbody>
                                {order.items.map((item) => (
                                    <tr key={item.id} className="border-bottom"
                                        style={{lastChild: {borderBottom: 0}} as any}>
                                        <td className="py-2 ps-3 font-monospace text-secondary">
                                            {item.id ? `${item.id.slice(0, 8)}...` : '—'}
                                        </td>
                                        <td className="py-2 text-start font-monospace text-secondary">
                                            {item.productId ? `${item.productId.slice(0, 8)}...` : '—'}
                                        </td>
                                        <td className="py-2 text-start font-monospace fw-bold">
                                            {item.productSnapshot.name}
                                        </td>
                                        <td className="py-2 text-center text-dark fw-medium">
                                            {item.quantity} pcs.
                                        </td>
                                        <td className="py-2 text-end pe-3 text-dark fw-bold">
                                            {item.itemPrice}
                                        </td>
                                        {orderIsCreated && (
                                            <th className="py-2 text-center">
                                                <button
                                                    type="button"
                                                    className="btn-close text-center"
                                                    title="Delete Order Item"
                                                    onClick={() => deleteItem(item.id)}
                                                >
                                                </button>
                                            </th>
                                        )}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <div className="d-flex justify-content-between pt-2 border-top mb-2">
                        <div className="d-flex gap-2">
                            {orderIsCreated && (
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={cancelOrder}
                                    disabled={isSaving}
                                >
                                    Cancel Order
                                </button>
                            )}
                            {isAdmin && (
                                <>
                                    {order.status === 'CANCELLED' && (
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-danger"
                                            onClick={deleteOrder}
                                            disabled={isSaving}
                                        >
                                            Delete Order
                                        </button>
                                    )}
                                    {order.status === 'DELETED' && (
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-success"
                                            onClick={() => changeOrderStatus('CANCELLED')}
                                            disabled={isSaving}
                                        >
                                            Restore Order
                                        </button>
                                    )}
                                </>
                            )}
                            {order.status == 'CANCELLED' && (
                                <button
                                    type="button"
                                    className="btn btn-sm btn-success"
                                    onClick={() => changeOrderStatus('CREATED')}
                                    disabled={isSaving}
                                >
                                    Restore Order
                                </button>
                            )}
                        </div>
                        <div className="d-flex gap-2">
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => onBackClick(order)}
                                disabled={isSaving}
                            >
                                Cancel
                            </button>
                            {orderIsCreated && (
                                <button
                                    type="button"
                                    className="btn btn-sm btn-primary me-3"
                                    style={{minWidth: '90px'}}
                                    onClick={() => updateOrder(order)}
                                    disabled={isSaving}
                                >
                                    {isSaving ? 'Saving...' : 'Save Order'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
