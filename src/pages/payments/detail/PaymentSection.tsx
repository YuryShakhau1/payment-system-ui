import React, {useEffect, useState} from 'react';
import {apiClient} from "../../../services/api_client";
import {Payment} from '../PaymentsTab';
import {Pencil} from "lucide-react";
import {orderService} from "../../../services/order_service";
import {LoadingSpinner} from "../../../components/LoadingSpinner";

interface PaymentDetailProps {
    isAdmin: boolean;
    paymentId: string;
    onBackClick: () => void;
}

export const PaymentSection = ({
                                 isAdmin,
                                 paymentId,
                                 onBackClick
                             }: PaymentDetailProps) => {
    const [payment, setPayment] = useState<Payment | null>(null);

    const fetchOrder = async () => {
        const url = isAdmin ? `payments/${paymentId}` : `payments/${paymentId}/me`;
        const paymentRes = await apiClient.get(url);
        const paymentData: Payment = paymentRes.data;
        setPayment(paymentData);
    };

    useEffect(() => {
        void fetchOrder();
    }, [paymentId]);

    if (!payment) return <LoadingSpinner isLoading={!payment}/>;

    return (
        <div className="w-100">
            <div className="bg-white p-3 border rounded shadow-sm"
                 style={{width: '100%', maxWidth: '850px', minWidth: '360px'}}>

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="m-0 h6 fw-bold">Payment Details</h5>
                    <div className="d-flex gap-2 justify-content-end mt-2">
                        <button
                            type="button"
                            title="Close"
                            className="btn-close text-center"
                            onClick={onBackClick}
                        />
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label small mb-1 fw-bold d-block text-muted">Created At</label>
                    <div className="text-dark font-monospace fw-bold">
                        {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString('ru-RU', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                        }) : '—'}
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label small mb-1 fw-bold d-block text-muted">ID</label>
                    <div className="text-dark font-monospace fw-bold">{payment.id || '—'}</div>
                </div>

                <div className="mb-3">
                    <label className="form-label small mb-1 fw-bold d-block text-muted">Order ID</label>
                    <div className="text-dark font-monospace fw-bold">{payment.orderId || '—'}</div>
                </div>

                <div className="mb-3">
                    <label className="form-label small mb-1 fw-bold d-block text-muted">User ID</label>
                    <div className="text-dark font-monospace fw-bold">{payment.userId || '—'}</div>
                </div>

                <div className="mb-3">
                    <label className="form-label small mb-1 fw-bold d-block text-muted">Status</label>
                    <div className={`fw-medium ${orderService.getStatusTextClass(payment.status)}`}>
                        {payment.status || '—'}
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label small mb-1 fw-bold d-block text-muted">Amount</label>
                    <div className="text-dark fw-bold">
                        {payment.paymentAmount || '—'}
                    </div>
                </div>
            </div>
        </div>
    );
};
