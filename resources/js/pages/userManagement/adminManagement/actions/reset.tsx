'use client';

import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { KeyRound } from 'lucide-react';
import Swal from 'sweetalert2';

export default function ResetPassword({ admin }) {
    const handleResetPassword = () => {
        Swal.fire({
            title: 'Reset Password?',
            text: 'This will reset the admin’s password to the system default.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#2563eb', // blue-600
            cancelButtonColor: '#6b7280', // gray-500
            confirmButtonText: 'Yes, reset it!',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    html: `
                        <div>
                            <h2 style="font-size:18px; font-weight:bold;">Resetting...</h2>
                            <p>Resetting admin password...</p>
                        </div>
                    `,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                });

                router.post(route('admin.resetPassword', admin), {
                    onSuccess: () => {
                        Swal.fire({
                            title: 'Password Reset!',
                            text: 'The admin password has been reset successfully.',
                            icon: 'success',
                            timer: 2000,
                            showConfirmButton: false,
                        });
                    },
                    onError: () => {
                        Swal.fire({
                            title: 'Error',
                            text: 'Something went wrong while resetting the password.',
                            icon: 'error',
                        });
                    },
                });
            }
        });
    };

    return (
        <Button
            onClick={handleResetPassword}
            variant="ghost"
            className="flex w-full items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
            <KeyRound className="h-4 w-4" />
            <span>Reset Password</span>
        </Button>
    );
}
