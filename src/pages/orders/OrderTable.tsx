import React from 'react';

import {Order} from "./OrdersTab";
import {OrderRow} from "./OrderRow";

interface OrderTableProps {
    isAdmin: boolean;
    orders: Order[];
    onOpenOrderClick: (order: Order) => void;
    editSelectedOrder: (orderId: string) => void;
}

export const OrderTable = ({
                               isAdmin,
                               orders,
                               onOpenOrderClick,
                               editSelectedOrder
                           }: OrderTableProps) => {
    return (
        <div className="table-responsive w-100 border rounded">
            <table className="table table-hover mb-0 align-middle fs-6">
                <thead className="table-light text-secondary font-monospace text-uppercase">
                <tr>
                    <th className="py-3 text-start">Date</th>
                    <th className="py-3 text-start">Order ID</th>
                    <th className="py-3 text-start">User</th>
                    <th className="py-3 text-center">Status</th>
                    <th className="py-3 text-start">Total Price</th>

                    {isAdmin ? (
                        <th className="py-3 text-center">Active</th>
                    ) : (
                        <th className="py-3 text-center"></th>
                    )}
                </tr>
                </thead>
                <tbody>
                {orders.map((order) => (
                    <React.Fragment key={order.id}>
                        <OrderRow
                            isAdmin={isAdmin}
                            order={order}
                            onOpenOrderClick={onOpenOrderClick}
                            editSelectedOrder={editSelectedOrder}
                        />
                    </React.Fragment>
                ))}
                </tbody>
            </table>
        </div>
    );
};
