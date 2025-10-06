'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Eye, MoreHorizontal, Shield, ClipboardList, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from '@inertiajs/react';
import DeleteRole from './actions/delete';

export type Role = {
    id: number | string;
    name: string;
    description?: string;
    permissionsCount: number;
    updated_at?: string;
};

export const columns: ColumnDef<Role>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                className="h-auto p-0 text-left font-semibold hover:bg-transparent hover:text-red-700 dark:hover:text-red-300"
            >
                <Shield className="mr-2 h-4 w-4" />
                Role Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <span className="font-semibold text-gray-900 dark:text-gray-100">{row.original.name}</span>
        ),
    },
    {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => (
            <span className="text-gray-600 dark:text-gray-400">{row.original.description || '—'}</span>
        ),
    },
    {
        accessorKey: 'permissionsCount',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                className="h-auto p-0 text-left font-semibold hover:bg-transparent hover:text-red-700 dark:hover:text-red-300"
            >
                <ClipboardList className="mr-2 h-4 w-4" />
                Permissions
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="inline-flex items-center justify-center rounded-md bg-red-50 px-2 py-1 text-sm font-semibold text-red-800 dark:bg-red-950/30 dark:text-red-300">
                {row.original.permissionsCount}
            </div>
        ),
    },
    {
        accessorKey: 'updated_at',
        header: 'Last Updated',
        cell: ({ row }) => (
            <span className="text-xs text-gray-500 dark:text-gray-400">
                {row.original.updated_at ? new Date(row.original.updated_at).toLocaleDateString() : '—'}
            </span>
        ),
    },
    {
        id: 'actions',
        header: () => <div className="text-center font-semibold">Actions</div>,
        cell: ({ row }) => {
            const role = row.original;

            return (
                <div className="flex justify-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 rounded-lg p-0 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
                                <span className="sr-only">Open role menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-56 border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                            <DropdownMenuLabel className="font-semibold text-gray-900 dark:text-gray-100">Role Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-600" />

                            <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                                <Link
                                    href={route('role.show', role.id)}
                                    className="flex items-center gap-3 px-2 py-2 text-gray-700 dark:text-gray-300"
                                >
                                    <Eye className="h-4 w-4" />
                                    <span>View</span>
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                                <Link
                                    href={route('role.edit', role.id)}
                                    className="flex items-center gap-3 px-2 py-2 text-gray-700 dark:text-gray-300"
                                >
                                    <UserCog className="h-4 w-4" />
                                    <span>Edit</span>
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-600" />

                            <DropdownMenuItem asChild className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/20">
                                <div className="w-full px-2 py-1">
                                    {/* Delete is a button component that will show its own confirmation modal */}
                                    <DeleteRole roleId={role.id} roleName={role.name} />
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
        size: 150,
    },
];
