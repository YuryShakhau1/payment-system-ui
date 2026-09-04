import React from 'react';
import {Pencil} from 'lucide-react';

import {orderService} from "../../services/order_service";

import {Order} from './OrdersTab'

interface OrderRowProps {
    isAdmin: boolean;
    order: Order;
    onOpenOrderClick: (order: Order) => void;
    editSelectedOrder: (orderId: string) => void;
}

export const OrderRow = ({
                             isAdmin,
                             order,
                             onOpenOrderClick,
                             editSelectedOrder
                         }: OrderRowProps) => {
    return (
        <tr key={order.id}
            onClick={() => onOpenOrderClick(order)}
            className="cursor-pointer align-middle"
        >
            <td className="text-secondary">
                {order.createdAt ? new Date(order.createdAt).toLocaleDateString('ru-RU', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                }) : '—'}
            </td>

            <td className="font-monospace text-muted py-3 text-start fw-bold">{`${order.id.substring(0, 8)}...`}</td>
            <td className="fw-semibold py-3 text-start">
                {order.user ? `${order.user.firstName} ${order.user.lastName}` : `${order.userId.substring(0, 8)}...`}
            </td>

            <td className="fw-semibold py-3 text-center">
                <span
                    className={`badge rounded-pill fw-semibold ${orderService.getStatusBadgeClass(order.status)}`}
                >
                     {order.status}
                </span>
            </td>

            <td className="fw-semibold py-3 text-start fw-bold text-dark">{order.totalPrice}</td>

            {isAdmin ? (
                <>
                    <td className="py-3 text-center">
                        <span
                            className={`badge rounded-pill fw-semibold ${order.deleted ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success'}`}>
                            {order.deleted ? 'Deleted' : 'Active'}
                        </span>
                    </td>
                </>
            ) : (
                <>
                    {orderService.isCreated(order) ? (
                        <td className="py-3 text-center" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => editSelectedOrder(order.id)}
                                className="btn btn-sm btn-link text-primary p-1 d-inline-flex align-items-center justify-content-center"
                                title="Edit"
                            >
                                <Pencil size={16}/>
                            </button>
                        </td>
                    ) : (
                        <td className="py-3 text-center"></td>
                    )}
                </>
            )}
        </tr>
    );
};
