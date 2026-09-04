import React, {useCallback, useEffect, useState} from 'react';
import {User as UserIcon} from 'lucide-react';
import {apiClient} from "../../services/api_client";
import {dateService} from "../../services/date_service";

import {Pagination} from '../../components/Pagination';
import {LoadingSpinner} from "../../components/LoadingSpinner";
import {ErrorModal} from "../../components/ErrorModal";
import {FiltersComponent, FilterSearch} from "../../components/FiltersComponent";
import {PaymentTable} from "./PaymentTable";
import {PaymentDetail} from "./detail/PaymentDetail";
import PaymentsSumPanel from "./sum/PaymentsSumPanel";
import {ShortUser} from "../orders/OrdersTab";

export interface Payment {
    id: string;
    orderId: string;
    userId: string;
    user: ShortUser | null;
    status: string;
    createdAt: string;
    paymentAmount: number;
}

interface PaymentTabProps {
    isAdmin: boolean;
    userId: string | null;
}

const currentSearch: FilterSearch = {
    from: dateService.formatDateForInput(new Date()),
    to: dateService.formatDateForInput(new Date())
};

const PaymentsTab = ({
                      isAdmin,
                      userId
}: PaymentTabProps) => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(0);

    const [search, setSearch] = useState<FilterSearch>(currentSearch);
    const [appliedSearch, setAppliedSearch] = useState<FilterSearch>(currentSearch);

    const [activePayment, setActivePayment] = useState<Payment | null>(null);

    const fetchPayments = useCallback(async (from: string, to: string) => {
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

            const url = isAdmin
                ? `/payments?${params.toString()}`
                : `/payments/me?${params.toString()}`;

            const response = await apiClient.get(url);

            const payments: Payment[] = response.data.content || [];
            const totalPagesCount = response.data.totalPages || 0;
            const totalElementsCount = response.data.totalElements || 0;

            payments.sort((p1, p2) => p1.createdAt.localeCompare(p2.createdAt));

            setPayments(payments);
            setTotalPages(totalPagesCount);
            setTotalElements(totalElementsCount);
        } catch (err: any) {
            console.error('Failed to load payment management:', err);
            const message = err.response?.data?.message || 'Could not load payment list. Please try again.';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage]);

    useEffect(() => {
        void fetchPayments(search.from, search.to);
    }, [currentPage, fetchPayments]);

    const handleResetFilters = () => {
        currentSearch.from = dateService.formatDateForInput(new Date());
        currentSearch.to = dateService.formatDateForInput(new Date());
        setSearch({...currentSearch});
        handleSearch();
    };

    const handleSearch = () => {
        setAppliedSearch({...search});

        if (currentPage === 0) {
            void fetchPayments(search.from, search.to);
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

    if (activePayment) {
        return (
            <PaymentDetail
                isAdmin={isAdmin}
                payment={activePayment}
                onBack={() => setActivePayment(null)}
                updateUserInfo={() => {}}
            />
        );
    }

    return (
        <>
            <div className="w-100 d-flex flex-column gap-4 p-2 pt-4">
                <FiltersComponent
                    search={search}
                    setSearch={setSearch}
                    onReset={handleResetFilters}
                    onSearch={handleSearch}
                />
            </div>

            <PaymentsSumPanel isAdmin={isAdmin} userId={userId} search={appliedSearch} />

            <div className="w-100 d-flex flex-column gap-4 p-2">
                <div className="row g-4">
                    <div className="col-lg-8 col-md-7 d-flex flex-column gap-3">
                        <div className="d-flex align-items-start gap-3 border-secondary-subtle">
                            <div className="border-bottom">
                                <h2 className="h3 fw-bold tracking-tight text-dark mb-0">Payments</h2>
                            </div>
                        </div>
                    </div>
                </div>

                <LoadingSpinner isLoading={isLoading} />
                <ErrorModal error={error} />

                {payments.length === 0 ? (
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
                        <PaymentTable
                            isAdmin={isAdmin}
                            payments={payments}
                            onOpenPaymentClick={(payment) => setActivePayment(payment)}
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
        </>
    );
};

export default PaymentsTab;
