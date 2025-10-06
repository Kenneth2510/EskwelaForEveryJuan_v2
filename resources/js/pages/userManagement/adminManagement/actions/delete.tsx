'use client';

import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

export default function DeleteAdmin({ admin }) {
    const handleDelete = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone. The admin record will be permanently deleted.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#b91c1c', // red-700
            cancelButtonColor: '#6b7280', // gray-500
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    html: `
                        <div>
                            <h2 style="font-size:18px; font-weight:bold;">Deleting...</h2>
                            <p>Deleting Admin Data...</p>
                        </div>
                    `,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                });

                router.delete(route('admin.destroy', admin), {
                    onSuccess: () => {
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'The admin record has been deleted.',
                            icon: 'success',
                            timer: 2000,
                            showConfirmButton: false,
                        });
                    },
                    onError: () => {
                        Swal.fire({
                            title: 'Error',
                            text: 'Something went wrong while deleting.',
                            icon: 'error',
                        });
                    },
                });
            }
        });
    };

    return (
        <Button
            onClick={handleDelete}
            variant="ghost"
            className="flex w-full items-center gap-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
        >
            <Trash2 className="h-4 w-4" />
            <span>Delete Admin</span>
        </Button>
    );
}
