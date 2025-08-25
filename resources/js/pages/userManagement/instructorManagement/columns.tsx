'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Activity, ArrowUpDown, Eye, Hash, Mail, MoreHorizontal, UserCog } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
import ResetPassword from './actions/reset';
import DeleteInstructor from './actions/delete';

export type Instructor = {
    id: string;
    name: string;
    email: string;
    status: 'inactive' | 'active';
    phone?: string;
    profile_picture?: string;
    updated_at?: string;
    instructor_code?: string;
    instructor_type?: string;
};

export const columns: ColumnDef<Instructor>[] = [
    {
        accessorKey: 'instructor_code',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="h-auto p-0 text-left font-semibold transition-colors hover:bg-transparent hover:text-red-700 dark:hover:text-red-300"
                >
                    <Hash className="mr-2 h-4 w-4" />
                    Instructor Code
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const instructor_code = row.original.instructor_code;
            return (
                <div className="inline-block rounded-md bg-red-50 px-2 py-1 font-mono text-sm font-semibold text-red-800 dark:bg-red-950/30 dark:text-red-300">
                    {instructor_code}
                </div>
            );
        },
        size: 120,
    },
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="h-auto p-0 text-left font-semibold transition-colors hover:bg-transparent hover:text-red-700 dark:hover:text-red-300"
                >
                    Instructor Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const name = row.original.name;
            const email = row.original.email;
            const avatar = row.original.profile_picture;

            return (
                <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-red-200 dark:border-red-700">
                        <AvatarImage src={avatar} alt={name} />
                        <AvatarFallback className="bg-red-100 font-semibold text-red-800 dark:bg-red-900 dark:text-red-200">
                            {name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .toUpperCase()
                                .slice(0, 2)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                        <div className="truncate font-semibold text-gray-900 dark:text-gray-100">{name}</div>
                        <div className="flex items-center gap-1 truncate text-sm text-gray-500 dark:text-gray-400">
                            <Mail className="h-3 w-3 flex-shrink-0" />
                            {email}
                        </div>
                    </div>
                </div>
            );
        },
        minSize: 250,
    },
    {
        accessorKey: 'instructor_type',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="h-auto p-0 text-left font-semibold transition-colors hover:bg-transparent hover:text-red-700 dark:hover:text-red-300"
                >
                    Course
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const instructor_type = row.original.instructor_type;
            return (
                <div className="flex min-w-0 items-center gap-3">
                    <div className="min-w-0 flex-1">
                        <div className="truncate font-semibold text-gray-900 dark:text-gray-100">{instructor_type}</div>
                    </div>
                </div>
            );
        },
        minSize: 150,
    },
    {
        accessorKey: 'email',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="hidden h-auto p-0 text-left font-semibold transition-colors hover:bg-transparent hover:text-red-700 lg:flex dark:hover:text-red-300"
                >
                    <Mail className="mr-2 h-4 w-4" />
                    Contact Info
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const email = row.original.email;
            const phone = row.original.phone || 'Not provided';

            return (
                <div className="hidden space-y-1 lg:block">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{email}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">📱 {phone}</div>
                </div>
            );
        },
        size: 200,
    },
    {
        accessorKey: 'status',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="h-auto p-0 text-left font-semibold transition-colors hover:bg-transparent hover:text-red-700 dark:hover:text-red-300"
                >
                    <Activity className="mr-2 h-4 w-4" />
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const status = row.original.status;
            const updated_at = row.original.updated_at;

            return (
                <div className="space-y-2">
                    <Badge
                        variant={status === 'active' ? 'default' : 'destructive'}
                        className={
                            status === 'active'
                                ? 'border-green-300 bg-green-100 text-green-800 hover:bg-green-200 dark:border-green-700 dark:bg-green-900/30 dark:text-green-300'
                                : 'border-red-300 bg-red-100 text-red-800 hover:bg-red-200 dark:border-red-700 dark:bg-red-900/30 dark:text-red-300'
                        }
                    >
                        <div className={`mr-2 h-2 w-2 rounded-full ${status === 'active' ? 'animate-pulse bg-green-500' : 'bg-red-500'}`} />
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Badge>
                    {updated_at && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">Last modified: {new Date(updated_at).toLocaleDateString()}</div>
                    )}
                </div>
            );
        },
        size: 150,
    },
    {
        id: 'actions',
        header: () => <div className="text-center font-semibold">Actions</div>,
        cell: ({ row }) => {
            const instructor = row.original;

            return (
                <div className="flex justify-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 rounded-lg p-0 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
                                <span className="sr-only">Open instructor menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                            <DropdownMenuLabel className="font-semibold text-gray-900 dark:text-gray-100">Instructor Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-600" />

                            <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                                <Link
                                    href={route('instructor.show', instructor.id)}
                                    className="flex items-center gap-3 px-2 py-2 text-gray-700 dark:text-gray-300"
                                >
                                    <Eye className="h-4 w-4" />
                                    <span>View Profile</span>
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                                <Link
                                    href={route('instructor.edit', instructor.id)}
                                    className="flex items-center gap-3 px-2 py-2 text-gray-700 dark:text-gray-300"
                                >
                                    <UserCog className="h-4 w-4" />
                                    <span>Edit Instructor</span>
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-600" />
                            <DropdownMenuItem asChild className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/20">
                                <div className="w-full">
                                    <ResetPassword instructor={instructor.id} />
                                </div>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/20">
                                <div className="w-full">
                                    <DeleteInstructor instructor={instructor.id} />
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
