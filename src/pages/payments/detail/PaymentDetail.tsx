import React, {useState} from 'react';
import {PaymentSection} from "./PaymentSection";
import {Payment} from "../PaymentsTab";
import {UserInfoSection} from "../../users/detail/UserInfoSection";
import {User} from "../../users/UserTable.tsx";

export interface PaymentDetailProps {
    isAdmin: boolean;
    payment: Payment;
    onBack: () => void;
    updateUserInfo: (user: User) => void;
}

export const PaymentDetail = ({
                                  isAdmin,
                                  payment,
                                  onBack,
                                  updateUserInfo
                              }: PaymentDetailProps) => {
    const [error] = useState<string | null>(null);

    if (error) {
        return (
            <div className="alert alert-danger m-3 d-flex flex-column align-items-start gap-2" role="alert">
                <span>{error}</span>
                <button onClick={onBack} className="btn btn-sm btn-outline-danger">← Back</button>
            </div>
        );
    }

    return (
        <div className="w-100 d-flex flex-column gap-3 p-2">
            <div>
                <button onClick={onBack} className="btn btn-sm btn-outline-secondary">← Back</button>
            </div>

            <div className="bg-white p-3">
                <div className="row g-4">
                    <div className="col-12 col-md-7 border shadow-sm rounded pe-md-4">
                        <UserInfoSection
                            isAdmin={isAdmin}
                            userId={payment.userId}
                            updateUserInfo={updateUserInfo}
                        />
                    </div>
                </div>
            </div>

            <PaymentSection
                isAdmin={isAdmin}
                paymentId={payment.id}
                onBackClick={onBack}/>
        </div>
    );
};
