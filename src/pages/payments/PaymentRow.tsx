import React from 'react';

import {orderService} from "../../services/order_service";

import {Payment} from './PaymentsTab'

interface PaymentRowProps {
    payment: Payment;
}

export const PaymentRow = ({
                             payment
                         }: PaymentRowProps) => {

    const paymentDate = new Date(payment.createdAt).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });

    const paymentId = `${payment.id.substring(0, 8)}...`;
    const orderId = `${payment.orderId.substring(0, 8)}...`;

    return (
        <tr key={payment.id}>
            <td className="font-monospace fw-bold py-2 ps-3">{paymentDate}</td>
            <td className="fw-bold">{paymentId}</td>
            <td className="fw-bold">{orderId}</td>
            <td className="fw-bold">{payment.user ? `${payment.user.firstName} ${payment.user.lastName}` : `${payment.userId.substring(0, 8)}...`}</td>
            <td>
                <span className={`badge rounded-pill ${orderService.getStatusBadgeClass(payment.status)}`}>
                    {payment.status}
                </span>
            </td>

            <td>{payment.paymentAmount}</td>
        </tr>
    );
};
