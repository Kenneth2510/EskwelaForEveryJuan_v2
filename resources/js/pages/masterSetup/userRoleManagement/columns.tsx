'use client';

import MySwal from '@/components/swal-alert';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

export type UserWithRole = {
    id: number;
    name: string;
    email: string;
    category: string;
    roles: { id: number; name: string }[];
};

export const columns = (allRoles: { id: number; name: string }[]): ColumnDef<UserWithRole>[] => [
    {
        accessorKey: 'name',
        header: 'User',
        cell: ({ row }) => (
            <div>
                <p className="font-semibold">{row.original.name}</p>
                <p className="text-xs text-gray-500">{row.original.email}</p>
            </div>
        ),
    },
    {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) => <span className="text-gray-600">{row.original.category}</span>,
    },
    {
        id: 'role',
        header: 'Role',
        cell: ({ row }) => {
            const user = row.original;
            const [open, setOpen] = useState(false);
            const [value, setValue] = useState<string>(user.roles[0]?.id.toString() ?? '');
            const [loading, setLoading] = useState(false);

            const selectedRole = allRoles.find((role) => role.id.toString() === value);

            const handleSync = (roleId: string) => {
                setLoading(true);
                router.put(
                    route('role-assign.update', user.id),
                    { roles: [parseInt(roleId, 10)] },
                    {
                        preserveScroll: true,
                        onSuccess: () => {
                            MySwal.fire({
                                title: 'Success',
                                text: 'Role has been updated successfully!',
                                icon: 'success',
                            });
                        },
                        onError: () => {
                            MySwal.fire({
                                title: 'Error',
                                text: 'Failed to update role. Please try again.',
                                icon: 'error',
                            });
                        },
                        onFinish: () => setLoading(false),
                    },
                );
            };

            return (
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" role="combobox" aria-expanded={open} className="w-48 justify-between" disabled={loading}>
                            {selectedRole ? selectedRole.name : 'Select role'}
                            <ChevronsUpDown className="h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-0">
                        <Command>
                            <CommandInput placeholder="Search role..." className="h-9" />
                            <CommandList>
                                <CommandEmpty>No role found.</CommandEmpty>
                                <CommandGroup>
                                    {allRoles.map((role) => (
                                        <CommandItem
                                            key={role.id}
                                            value={role.id.toString()}
                                            onSelect={(currentValue) => {
                                                setValue(currentValue);
                                                setOpen(false);
                                                handleSync(currentValue); // auto sync on select
                                            }}
                                        >
                                            {role.name}
                                            <Check className={cn('ml-auto h-4 w-4', value === role.id.toString() ? 'opacity-100' : 'opacity-0')} />
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            );
        },
    },
];
