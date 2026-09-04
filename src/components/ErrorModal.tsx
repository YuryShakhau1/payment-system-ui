import React from "react";
import {AlertCircle} from "lucide-react";

interface ErrorModalProps {
    error: string | null;
}

export const ErrorModal = ({error}: ErrorModalProps) => {
    return error && (
        <div
            className="alert alert-danger d-flex align-items-center gap-2 shadow-sm rounded-3 max-w-2xl mx-auto my-4"
            role="alert">
            <AlertCircle size={22} className="flex-shrink-0"/>
            <span className="small fw-medium">{error}</span>
        </div>
    );
}