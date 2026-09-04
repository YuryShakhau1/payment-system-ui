export const dateService = {
    formatDate: (dateValue: Date | string) => {
        if (!dateValue) return 'N/A';
        try {
            const date = new Date(dateValue);
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        } catch (e) { return String(dateValue); }
    },

    formatDateForInput: (dateInput: Date | string | number): string => {
        const date = new Date(dateInput);

        if (isNaN(date.getTime())) {
            return '';
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    },

    formatZonedDateForInput: (dateInput: Date | string | number): string => {
        return `${dateService.formatDateForInput(dateInput)}Z`;
    },

    inputStringToDate: (dateInput: string): Date => {
        const [year, month, day] = dateInput.split('-').map(Number);
        return new Date(year, month - 1, day);
    },

    fromBeginOfDay: (date: string, postfix = '') => {
        return `${date}T00:00:00${postfix}`;
    },

    toEndOfDay: (date: string, postfix = '') => {
        return `${date}T23:59:59${postfix}`;
    },

    convertDisplayDate: (date: string | null | undefined): string => {
        if (!date) return '';

        if (date.includes('-')) {
            const parts = date.split('-');
            const year = parts[0];
            const month = parts[1];
            return `${month}/${year.slice(2)}`;
        }

        const digits = date.replace(/\D/g, '');
        if (digits.length > 4) return date;

        let formattedDate = digits;
        if (digits.length > 2) {
            formattedDate = `${digits.slice(0, 2)}/${digits.slice(2)}`;
        }
        return formattedDate;
    }
};
