import React from 'react';
import PaymentsTab from "../../payments/PaymentsTab";

interface PaymentProps {
    isAdmin: boolean;
    userId: string | null;
}

export const PaymentsSection = ({
                                    isAdmin,
                                    userId
}: PaymentProps) => {
    return <PaymentsTab isAdmin={isAdmin} userId={userId} />;
}
