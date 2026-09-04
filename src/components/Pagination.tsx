import React from 'react';
import {ChevronLeft, ChevronRight} from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    onPrevPage: () => void;
    onNextPage: () => void;
}

export const Pagination = ({
                               currentPage,
                               totalPages,
                               totalElements,
                               onPrevPage,
                               onNextPage,
                           }: PaginationProps) => {
    if (totalPages <= 1) {

        return (
            <div className="text-sm text-base-content text-center sm:text-left">
                Showing page <strong className="text-base-content font-semibold">{currentPage + 1}</strong> of{' '}
                <strong className="text-base-content font-semibold">{totalPages}</strong>{' '}
                (<span className="font-mono text-xs">{totalElements}</span> total)
            </div>
        );
    }

    return (
        <div
            className="flex flex-col sm:flex-row gap-4 justify-between items-center w-full px-2 py-5 border-t border-base-200">

            <div className="text-sm text-base-content text-center sm:text-left">
                Showing page <strong className="text-base-content font-semibold">{currentPage + 1}</strong> of{' '}
                <strong className="text-base-content font-semibold">{totalPages}</strong>{' '}
                (<span className="font-mono text-xs">{totalElements}</span> total)
            </div>

            <div className="join shadow-sm border border-base-300">
                <button
                    onClick={onPrevPage}
                    disabled={currentPage === 0}
                    className="btn btn-sm sm:btn-md join-item btn-ghost hover:bg-base-200 gap-1 disabled:bg-base-100 disabled:opacity-40"
                >
                    <ChevronLeft size={16}/>
                    <span className="hidden xs:inline">Previous</span>
                </button>

                <button
                    className="btn btn-sm sm:btn-md join-item btn-active no-animation pointer-events-none bg-base-200 border-x border-base-300 px-4 text-xs sm:text-sm font-semibold">
                    Page {currentPage + 1}
                </button>

                <button
                    onClick={onNextPage}
                    disabled={currentPage === totalPages - 1}
                    className="btn btn-sm sm:btn-md join-item btn-ghost hover:bg-base-200 gap-1 disabled:bg-base-100 disabled:opacity-40"
                >
                    <span className="hidden xs:inline">Next</span>
                    <ChevronRight size={16}/>
                </button>
            </div>
        </div>
    );
};
