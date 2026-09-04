import React from 'react';

interface LoadingSpinnerProps {
    isLoading: boolean;
}

export const LoadingSpinner = ({isLoading}: LoadingSpinnerProps) => {
    return isLoading && (
        <div className="d-flex flex-column align-items-center justify-content-center text-muted" style={{ minHeight: '250px' }}>
            <div className="spinner-border text-primary mb-2" role="status"></div>
            <p className="small">Loading details...</p>
        </div>
    );
}
