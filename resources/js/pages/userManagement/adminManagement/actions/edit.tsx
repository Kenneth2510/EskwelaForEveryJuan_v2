import MySwal from '@/components/swal-alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, BookOpen, Calendar, Check, ChevronsUpDown, Hash, Mail, Phone, Save, ShieldCheck, User, UserCheck } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Management',
        href: '/user-management/admin',
    },
    {
        title: 'Edit Admin',
        href: '#',
    },
];

const userSchema = z.object({
    fname: z
        .string()
        .regex(/^[A-Za-z\s\-]+$/, 'Only letters, spaces, and hyphens are allowed')
        .min(1, 'First name is required'),
    mname: z
        .string()
        .regex(/^[A-Za-z\s\-]*$/, 'Only letters, spaces, and hyphens are allowed')
        .optional(),
    lname: z
        .string()
        .regex(/^[A-Za-z\s\-]+$/, 'Only letters, spaces, and hyphens are allowed')
        .min(1, 'Last name is required'),
    email: z.email('Invalid email address').min(1, 'Email is required'),
    phone: z.string().regex(/^\+63\d{10}$/, 'Phone must start with +63 and contain exactly 10 digits after it'),
    bday: z.string().min(1, 'Birthday is required'),
    admin_code: z
        .string()
        .min(1, 'Admin code is required')
        .regex(/^[A-Z0-9\-]+$/, 'Admin code can only contain uppercase letters, numbers, and hyphens'),
    status: z.enum(['active', 'inactive'], {
        required_error: 'Status is required',
    }),
});

export default function EditAdmin({ admin }: { admin: any }) {
    type UserFormData = z.infer<typeof userSchema>;

    const [cbOpen, setCbOpen] = useState(false);
    const [cbValue, setCbValue] = useState<string[]>(admin.admin.course);

    const {
        data,
        setData,
        put,
        processing,
        errors: serverErrors,
    } = useForm<UserFormData>({
        fname: admin.fname ?? '',
        mname: admin.mname ?? '',
        lname: admin.lname ?? '',
        email: admin.email ?? '',
        phone: admin.phone ?? '+63',
        bday: admin.bday ?? '',
        admin_code: admin.admin.admin_code ?? '',
        status: admin.status ?? 'active',
    });

    const [clientErrors, setClientErrors] = useState<Partial<Record<keyof UserFormData, string>>>({});

    const handleUserSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const result = userSchema.safeParse(data);

        if (!result.success) {
            const fieldErrors: Partial<Record<keyof UserFormData, string>> = {};
            result.error.issues.forEach((err) => {
                fieldErrors[err.path[0] as keyof UserFormData] = err.message;
            });
            setClientErrors(fieldErrors);

            // Scroll to first error
            const firstError = Object.keys(fieldErrors)[0];
            const element = document.getElementById(firstError);
            element?.scrollIntoView({ behavior: 'smooth', block: 'center' });

            return;
        }

        setClientErrors({});

        MySwal.fire({
            title: <p className="text-gray-900 dark:text-gray-100">Update Admin Data...</p>,
            allowOutsideClick: false,
            allowEscapeKey: false,
            background: 'var(--background)',
            color: 'var(--foreground)',
            customClass: {
                popup: 'rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700',
                title: 'text-gray-900 dark:text-gray-100',
            },
            didOpen: () => {
                MySwal.showLoading();
            },
        });

        put(route('admin.update', { id: admin.id }), {
            onError: () => {
                MySwal.fire({
                    icon: 'error',
                    title: 'Error Updating Admin',
                    text: 'Please check the form and try again.',
                    background: 'var(--background)',
                    color: 'var(--foreground)',
                    customClass: {
                        popup: 'rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700',
                        title: 'text-gray-900 dark:text-gray-100',
                    },
                });
            },
        });
    };

    // Auto-set username when student number changes
    const handleAdminCodeChange = (value: string) => {
        const formattedValue = value.toUpperCase();
        setData('admin_code', formattedValue);
    };

    const getFieldError = (field: keyof UserFormData) => {
        return clientErrors[field] || serverErrors[field];
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Admin" />
            <div className="min-h-screen bg-white transition-colors duration-300 dark:bg-gray-900">
                <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="mb-6 flex items-center gap-4">
                            <Button
                                asChild
                                variant="outline"
                                className="border-gray-200 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                            >
                                <Link href={route('admin.index')}>
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    <span className="hidden sm:inline">Back to Admins</span>
                                    <span className="sm:hidden">Back</span>
                                </Link>
                            </Button>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="rounded-xl bg-gradient-to-br from-red-800 to-red-900 p-3 shadow-lg">
                                <UserCheck className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">Edit Admin</h1>
                                <p className="mt-1 text-base text-gray-600 sm:text-lg dark:text-gray-400">
                                    Update the admin account with the latest information
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form Section */}
                    <form onSubmit={handleUserSubmit} className="space-y-8">
                        {/* Account Status Card */}
                        <Card className="w-full border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900/30">
                                        <ShieldCheck className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl text-gray-900 dark:text-gray-100">Account Status</CardTitle>
                                        <CardDescription className="text-gray-600 dark:text-gray-400">
                                            Set whether this admin account is active or inactive
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-2 w-full justify-center">
                                    <Label htmlFor="status" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Status *
                                    </Label>
                                    <Select value={data.status} onValueChange={(value) => setData('status', value as 'active' | 'inactive')}>
                                        <SelectTrigger className="w-full border-gray-200 bg-gray-50 focus:border-red-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:border-red-400">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent className="w-full border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                                            <SelectItem value="active">🟢 Active</SelectItem>
                                            <SelectItem value="inactive">🔴 Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {getFieldError('status') && (
                                        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                            <AlertCircle className="h-4 w-4" />
                                            {getFieldError('status')}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Personal Information Card */}
                        <Card className="border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                                        <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl text-gray-900 dark:text-gray-100">Personal Information</CardTitle>
                                        <CardDescription className="text-gray-600 dark:text-gray-400">
                                            Basic admin details and contact information
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {/* First Name */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="fname"
                                            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            <User className="h-4 w-4" />
                                            First Name *
                                        </Label>
                                        <Input
                                            id="fname"
                                            type="text"
                                            value={data.fname}
                                            onChange={(e) => setData('fname', e.target.value)}
                                            className="border-gray-200 bg-gray-50 transition-colors focus:border-red-500 focus:ring-red-500/20 dark:border-gray-600 dark:bg-gray-700 dark:focus:border-red-400"
                                            placeholder="Enter first name"
                                        />
                                        {getFieldError('fname') && (
                                            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                                <AlertCircle className="h-4 w-4" />
                                                {getFieldError('fname')}
                                            </div>
                                        )}
                                    </div>

                                    {/* Middle Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="mname" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Middle Name
                                        </Label>
                                        <Input
                                            id="mname"
                                            type="text"
                                            value={data.mname}
                                            onChange={(e) => setData('mname', e.target.value)}
                                            className="border-gray-200 bg-gray-50 transition-colors focus:border-red-500 focus:ring-red-500/20 dark:border-gray-600 dark:bg-gray-700 dark:focus:border-red-400"
                                            placeholder="Enter middle name (optional)"
                                        />
                                        {getFieldError('mname') && (
                                            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                                <AlertCircle className="h-4 w-4" />
                                                {getFieldError('mname')}
                                            </div>
                                        )}
                                    </div>

                                    {/* Last Name */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="lname"
                                            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            <User className="h-4 w-4" />
                                            Last Name *
                                        </Label>
                                        <Input
                                            id="lname"
                                            type="text"
                                            value={data.lname}
                                            onChange={(e) => setData('lname', e.target.value)}
                                            className="border-gray-200 bg-gray-50 transition-colors focus:border-red-500 focus:ring-red-500/20 dark:border-gray-600 dark:bg-gray-700 dark:focus:border-red-400"
                                            placeholder="Enter last name"
                                        />
                                        {getFieldError('lname') && (
                                            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                                <AlertCircle className="h-4 w-4" />
                                                {getFieldError('lname')}
                                            </div>
                                        )}
                                    </div>

                                    {/* Birthday */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="bday"
                                            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            <Calendar className="h-4 w-4" />
                                            Date of Birth *
                                        </Label>
                                        <Input
                                            id="bday"
                                            type="date"
                                            value={data.bday}
                                            onChange={(e) => setData('bday', e.target.value)}
                                            max={new Date(new Date().setFullYear(new Date().getFullYear() - 13)).toISOString().split('T')[0]}
                                            className="border-gray-200 bg-gray-50 transition-colors focus:border-red-500 focus:ring-red-500/20 dark:border-gray-600 dark:bg-gray-700 dark:focus:border-red-400"
                                        />
                                        {getFieldError('bday') && (
                                            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                                <AlertCircle className="h-4 w-4" />
                                                {getFieldError('bday')}
                                            </div>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="email"
                                            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            <Mail className="h-4 w-4" />
                                            Email Address *
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="border-gray-200 bg-gray-50 transition-colors focus:border-red-500 focus:ring-red-500/20 dark:border-gray-600 dark:bg-gray-700 dark:focus:border-red-400"
                                            placeholder="student@example.com"
                                        />
                                        {getFieldError('email') && (
                                            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                                <AlertCircle className="h-4 w-4" />
                                                {getFieldError('email')}
                                            </div>
                                        )}
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="phone"
                                            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            <Phone className="h-4 w-4" />
                                            Phone Number *
                                        </Label>
                                        <div className="flex items-center rounded-md border border-gray-200 bg-gray-50 transition-colors focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500/20 dark:border-gray-600 dark:bg-gray-700 dark:focus-within:border-red-400">
                                            <span className="border-r border-gray-200 px-3 text-sm font-medium text-gray-500 select-none dark:border-gray-600 dark:text-gray-400">
                                                +63
                                            </span>
                                            <Input
                                                id="phone"
                                                type="text"
                                                value={data.phone.replace('+63', '')}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/\D/g, '');
                                                    if (value.length <= 10) {
                                                        setData('phone', `+63${value}`);
                                                    }
                                                }}
                                                className="flex-1 border-0 bg-transparent focus:ring-0"
                                                placeholder="9123456789"
                                                maxLength={10}
                                            />
                                        </div>
                                        {getFieldError('phone') && (
                                            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                                <AlertCircle className="h-4 w-4" />
                                                {getFieldError('phone')}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Academic Information Card */}
                        <Card className="border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
                                        <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl text-gray-900 dark:text-gray-100">Admin Information</CardTitle>
                                        <CardDescription className="text-gray-600 dark:text-gray-400">
                                            Admin details and Faculty information
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {/* Admin Code */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="admin_code"
                                            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            <Hash className="h-4 w-4" />
                                            Admin Code *
                                        </Label>
                                        <Input
                                            id="admin_code"
                                            type="text"
                                            value={data.admin_code}
                                            onChange={(e) => handleAdminCodeChange(e.target.value)}
                                            className="border-gray-200 bg-gray-50 font-mono transition-colors focus:border-red-500 focus:ring-red-500/20 dark:border-gray-600 dark:bg-gray-700 dark:focus:border-red-400"
                                            placeholder="2024-1234 (will be used as username)"
                                        />
                                        {getFieldError('admin_code') && (
                                            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                                <AlertCircle className="h-4 w-4" />
                                                {getFieldError('admin_code')}
                                            </div>
                                        )}
                                        <p className="text-xs text-gray-500 dark:text-gray-400">This will also be used as the student's username</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Account Information Card */}
                        <Card className="border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
                                        <UserCheck className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl text-gray-900 dark:text-gray-100">Account Information</CardTitle>
                                        <CardDescription className="text-gray-600 dark:text-gray-400">
                                            Login credentials will be auto-generated
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
                                    <div className="flex items-start gap-3">
                                        <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/50">
                                            <UserCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">Login Credentials</h4>
                                            <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4" />
                                                    <span className="font-medium">Username:</span>
                                                    <span className="rounded border bg-white px-2 py-1 font-mono dark:bg-gray-800">
                                                        {data.admin_code || 'Enter student number above'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <UserCheck className="h-4 w-4" />
                                                    <span className="font-medium">Password:</span>
                                                    <span className="text-blue-600 dark:text-blue-400">Auto-generated (sent via email)</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Submit Button */}
                        <div className="flex justify-center pt-4">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-red-800 px-8 py-3 text-base font-medium text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-red-900 hover:shadow-md dark:bg-red-700 dark:hover:bg-red-600"
                            >
                                {processing ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        Updating Admin Data...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Save className="h-5 w-5" />
                                        Apply Changes
                                    </div>
                                )}
                            </Button>
                        </div>
                    </form>

                    {/* Footer Info */}
                    <div className="mt-12 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            All fields marked with * are required. Admin will receive auto-generated login credentials via email.
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
