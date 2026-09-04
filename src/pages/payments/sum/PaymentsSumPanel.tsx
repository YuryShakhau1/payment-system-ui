import React, {useEffect, useState} from 'react';
import {User as UserIcon} from 'lucide-react';
import {apiClient} from "../../../services/api_client";
import {dateService} from "../../../services/date_service";

import {Pagination} from '../../../components/Pagination';
import {LoadingSpinner} from "../../../components/LoadingSpinner";
import {ErrorModal} from "../../../components/ErrorModal";
import {FilterSearch} from "../../../components/FiltersComponent";
import {ShortUser} from "../../orders/OrdersTab";

export interface PaymentSum {
    id: string;
    user: ShortUser | null;
    total: number;
}

interface PaymentTabProps {
    isAdmin: boolean;
    userId: string | null;
    search: FilterSearch;
}

export const PaymentsSumPanel = ({
                                     isAdmin,
                                     userId,
                                     search
                                 }: PaymentTabProps) => {
    const [paymentsSum, setPaymentsSum] = useState<PaymentSum[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(0);

    const fetchPaymentsSum = async (from: string, to: string) => {
        try {
            setIsLoading(true);
            setError(null);

            const params = new URLSearchParams({
                page: String(currentPage),
                size: '10'
            });

            if (userId) params.append('userId', userId);

            params.append('from', `${dateService.fromBeginOfDay(from, 'Z')}`);
            params.append('to', `${dateService.toEndOfDay(to, 'Z')}`);
            params.append('status', 'SUCCESS');

            const url = isAdmin
                ? `/payments/total-sum?${params.toString()}`
                : `/payments/total-sum/me?${params.toString()}`;

            const response = await apiClient.get(url);

            const content = response.data.content || [];
            const totalPagesCount = response.data.totalPages || 0;
            const totalElementsCount = response.data.totalElements || 0;

            setPaymentsSum(content);
            setTotalPages(totalPagesCount);
            setTotalElements(totalElementsCount);
        } catch (err: any) {
            console.error('Failed to load payment management:', err);
            const message = err.response?.data?.message || 'Could not load payment list. Please try again.';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        void fetchPaymentsSum(search.from, search.to);
    }, [search]);

    const handlePrevPage = () => {
        if (currentPage > 0) setCurrentPage(prev => prev - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) setCurrentPage(prev => prev + 1);
    };

    return (
        <div className="w-100 d-flex flex-column gap-4 p-2">
            <div className="row g-4">
                <div className="col-lg-8 col-md-7 d-flex flex-column gap-3">
                    <div className="d-flex align-items-start gap-3 border-secondary-subtle">
                        <div className="border-bottom">
                            <h2 className="h3 fw-bold tracking-tight text-dark mb-0">Paid Amount</h2>
                        </div>
                    </div>
                </div>
            </div>

            <LoadingSpinner isLoading={isLoading}/>
            <ErrorModal error={error}/>

            {paymentsSum.length === 0 ? (
                <div
                    className="d-flex flex-column align-items-center justify-content-center text-center p-5 border border-dashed border-secondary-subtle rounded-3 bg-light"
                    style={{minHeight: '300px'}}>
                    <UserIcon size={48} className="text-muted opacity-50 mb-3"/>
                    <h3 className="h5 fw-bold text-dark mb-1">No payments found.</h3>
                    <p className="text-muted small max-w-sm mb-0">No system identities match your current search
                        filters.</p>
                </div>
            ) : (
                <>
                    <div className="table-responsive w-100 border rounded">
                        <table className="table table-hover mb-0 align-middle fs-6">
                            <thead className="table-light text-secondary">
                            <tr>
                                <th className="py-2 ps-3">User</th>
                                <th>Total</th>
                            </tr>
                            </thead>
                            <tbody>
                            {paymentsSum.map((paymentSum) => (
                                <tr key={paymentSum.id}>
                                    <td className="fw-bold py-2 ps-3">{paymentSum.user ? `${paymentSum.user.firstName} ${paymentSum.user.lastName}` : `${paymentSum.id}...`}</td>
                                    <td className="fw-bold">{paymentSum.total}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

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

export default PaymentsSumPanel;
