import React from 'react';
import { Pencil } from 'lucide-react';
import { User } from './UserTable';
import { dateService } from "../../services/date_service";

interface UserRowProps {
    user: User;
    onEdit: (user: User) => void;
    onRowClick: (id: string) => void;
}

export const UserRow = ({
                            user,
                            onEdit,
                            onRowClick
                        }: UserRowProps) => {
    return (
        <tr
            onClick={() => onRowClick(user.id)}
            className="cursor-pointer align-middle"
        >
            <td className="font-monospace text-muted py-3">
                {`${user.id.substring(0, 8)}...`}
            </td>

            <td className="fw-semibold py-3 text-start">{user.firstName}</td>
            <td className="fw-semibold py-3 text-start">{user.lastName}</td>
            <td className="fw-semibold py-3 text-start">{user.email}</td>
            <td className="fw-semibold py-3 text-start">{dateService.formatDate(user.birthDate)}</td>

            <td className="py-3 text-center">
                <span className={`badge rounded-pill fw-semibold ${user.active ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>
                    {user.active ? 'Active' : 'Inactive'}
                </span>
            </td>

            <td className="py-3 text-center" onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={() => onEdit(user)}
                    className="btn btn-sm btn-link text-primary p-1 d-inline-flex align-items-center justify-content-center"
                    title="Edit"
                >
                    <Pencil size={16} />
                </button>
            </td>
        </tr>
    );
};
