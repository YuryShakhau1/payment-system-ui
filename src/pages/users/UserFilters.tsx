import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

interface UserFiltersProps {
    searchFirstName: string;
    searchLastName: string;
    onFirstNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onLastNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onReset: () => void;
    onSearch: () => void;
}

export const UserFilters = ({
                                searchFirstName,
                                searchLastName,
                                onFirstNameChange,
                                onLastNameChange,
                                onReset,
                                onSearch
                            }: UserFiltersProps) => {

    const handleSearchUser = (e: any) => {
        e.preventDefault();
        onSearch();
    };

    return (
        <form onSubmit={handleSearchUser} className="d-flex flex-wrap align-items-center gap-2 bg-white w-100">
            <input
                type="text"
                placeholder="First Name..."
                value={searchFirstName}
                onChange={onFirstNameChange}
                className="form-control form-control-sm"
                style={{ maxWidth: '240px' }}
            />

            <input
                type="text"
                placeholder="Last Name..."
                value={searchLastName}
                onChange={onLastNameChange}
                className="form-control form-control-sm"
                style={{ maxWidth: '240px' }}
            />

            <div className="d-flex align-items-center gap-2">
                <button type="submit" className="btn btn-sm btn-primary d-flex align-items-center gap-1 fw-medium">
                    <Search size={14} /> Search
                </button>

                {(searchFirstName || searchLastName) && (
                    <button type="button" onClick={onReset} className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 fw-medium">
                        <RotateCcw size={14} /> Reset
                    </button>
                )}
            </div>
        </form>
    );
};
