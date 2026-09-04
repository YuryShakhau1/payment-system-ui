import React from 'react';
import {RotateCcw, Search} from 'lucide-react';
import {dateService} from "../services/date_service.ts";

export interface FilterSearch {
    from: string;
    to: string;
}

export interface FiltersProps {
    search: FilterSearch;
    setSearch: (search: FilterSearch) => void;
    onReset: () => void;
    onSearch: () => void;
}

export const FiltersComponent = ({
                                     search,
                                     setSearch,
                                     onReset,
                                     onSearch
                                 }: FiltersProps) => {

    const handleSearch = (e: any) => {
        e.preventDefault();
        onSearch();
    };

    const handleDateChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        search[e.target.name as keyof typeof search] = e.target.value;

        if (name === 'from' || name === 'to') {
            const from = dateService.inputStringToDate(search['from']);
            const to = dateService.inputStringToDate(search['to']);

            if (from > to) {
                if (name === 'from') {
                    search['to'] = dateService.formatDateForInput(from);
                } else if (name === 'to') {
                    search['from'] = dateService.formatDateForInput(to);
                }
            }
        }

        setSearch({...search});
    };

    return (
        <div className="d-flex align-items-center justify-content-start gap-2 w-100">
            <input
                type="date"
                name="from"
                placeholder="From"
                value={search.from}
                onChange={handleDateChanged}
                className="form-control form-control-sm"
                style={{maxWidth: '240px'}}
            />

            <input
                type="date"
                name="to"
                placeholder="To"
                value={search.to}
                onChange={handleDateChanged}
                className="form-control form-control-sm"
                style={{maxWidth: '240px'}}
            />

            <div className="d-flex align-items-center gap-2 ms-3">
                <button type="submit" onClick={handleSearch}
                        className="btn btn-sm btn-primary d-flex align-items-center gap-1">
                    <Search size={14}/> Search
                </button>

                <button type="button" onClick={onReset}
                        className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1">
                    <RotateCcw size={14}/> Reset
                </button>
            </div>
        </div>
    );
};
