import React from 'react';

import {PaymentRow} from "./PaymentRow";
import {Payment} from "./PaymentsTab";

interface PaymentTableProps {
    isAdmin: boolean;
    payments: Payment[];
    onOpenPaymentClick: (payment: Payment) => void;
}

export const PaymentTable = ({
                                 isAdmin,
                                 payments,
                                 onOpenPaymentClick
                             }: PaymentTableProps) => {
    return (
        <div className="table-responsive w-100 border rounded">
            <table className="table table-hover mb-0 align-middle fs-6">
                <thead className="table-light text-secondary">
                <tr>
                    <th className="py-2 ps-3">Date</th>
                    <th>Payment ID</th>
                    <th>Order ID</th>
                    <th>User</th>
                    <th>Status</th>
                    <th>Amount</th>
                </tr>
                </thead>
                <tbody>
                {payments.map((payment) => (
                    <React.Fragment key={payment.id}>
                        <PaymentRow payment={payment}/>
                    </React.Fragment>
                ))}
                </tbody>
            </table>
        </div>
    );
};
