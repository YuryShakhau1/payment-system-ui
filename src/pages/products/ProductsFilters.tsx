import React from 'react';
import {RotateCcw, Search} from 'lucide-react';

interface ProductFiltersProps {
    isAdmin: boolean;
    searchString: string;
    checkInStockOnly: boolean;
    onSearchStringChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCheckInStockOnly: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onReset: () => void;
    onSearch: () => void;
}

export const ProductsFilters = ({
                                    isAdmin,
                                    searchString,
                                    checkInStockOnly,
                                    onSearchStringChange,
                                    onCheckInStockOnly,
                                    onReset,
                                    onSearch
                                }: ProductFiltersProps) => {

    const handleSearchProduct = (e: any) => {
        e.preventDefault();
        onSearch();
    };

    return (
        <div className="d-flex align-items-center justify-content-start gap-2 w-100">
            <form onSubmit={handleSearchProduct} className="w-100">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchString}
                    onChange={onSearchStringChange}
                    className="form-control form-control-sm"
                    style={{maxWidth: '500px'}}
                />
            </form>

            {isAdmin && (
                <label htmlFor="inStock" className="d-flex align-items-center form-check form-switch cursor-pointer small m-0 p-0">
                    <span className="me-2">Check in Stock Only</span>
                    <input
                        type="checkbox"
                        id="inStock"
                        checked={checkInStockOnly}
                        onChange={onCheckInStockOnly}
                        className="form-check-input cursor-pointer m-0"
                    />
                </label>
            )}

            <div className="d-flex align-items-center gap-2 ms-3">
                <button type="submit" onClick={handleSearchProduct} className="btn btn-sm btn-primary d-flex align-items-center gap-1">
                    <Search size={14}/> Search
                </button>

                {(searchString || checkInStockOnly) && (
                    <button type="button" onClick={onReset} className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1">
                        <RotateCcw size={14}/> Reset
                    </button>
                )}
            </div>
        </div>
    );
};
