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
        title: 'Student Management',
        href: '/user-management/learner',
    },
    {
        title: 'Edit Student',
        href: '/user-management/learner/edit',
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
    student_number: z
        .string()
        .min(1, 'Student number is required')
        .regex(/^[A-Z0-9\-]+$/, 'Student number can only contain uppercase letters, numbers, and hyphens'),
    course: z.string().min(1, 'Course is required'),
    enrollment_date: z.string().optional(),
    status: z.enum(['active', 'inactive'], {
        required_error: 'Status is required',
    }),
});

// Course options - you can modify these based on your institution
const courseOptions = [
    {
        value: 'Bachelor of Science in Accountancy',
    },
    {
        value: 'Bachelor of Science in Business Administration',
    },
    {
        value: 'Bachelor of Science in Human Resources Management',
    },
    {
        value: 'Bachelor of Science in Information Technology',
    },
    {
        value: 'Bachelor of Science in Enterpreneurship',
    },
    {
        value: 'Bachelor of Science in Education Major in English',
    },
    {
        value: 'Bachelor of Science in Education Major in Mathematics',
    },
];

export default function EditLearner({ learner }: { learner: any }) {
    type UserFormData = z.infer<typeof userSchema>;

    const [cbOpen, setCbOpen] = useState(false);
    const [cbValue, setCbValue] = useState<string[]>(learner.learner.course);

    const {
        data,
        setData,
        put,
        processing,
        errors: serverErrors,
    } = useForm<UserFormData>({
        fname: learner.fname ?? '',
        mname: learner.mname ?? '',
        lname: learner.lname ?? '',
        email: learner.email ?? '',
        phone: learner.phone ?? '+63',
        bday: learner.bday ?? '',
        student_number: learner.learner.student_number ?? '',
        course: learner.learner.course ?? '',
        enrollment_date: learner.learner.enrollment_date ?? '',
        status: learner.status ?? 'active',
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
            title: <p className="text-gray-900 dark:text-gray-100">Update Student Data...</p>,
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

        put(route('learner.update', { id: learner.id }), {
            onError: () => {
                MySwal.fire({
                    icon: 'error',
                    title: 'Error Updating Student',
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
    const handleStudentNumberChange = (value: string) => {
        const formattedValue = value.toUpperCase();
        setData('student_number', formattedValue);
    };

    const getFieldError = (field: keyof UserFormData) => {
        return clientErrors[field] || serverErrors[field];
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Student" />
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
                                <Link href={route('learner.index')}>
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    <span className="hidden sm:inline">Back to Students</span>
                                    <span className="sm:hidden">Back</span>
                                </Link>
                            </Button>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="rounded-xl bg-gradient-to-br from-red-800 to-red-900 p-3 shadow-lg">
                                <UserCheck className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">Edit Student</h1>
                                <p className="mt-1 text-base text-gray-600 sm:text-lg dark:text-gray-400">
                                    Update the student account with the latest information
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
                                            Set whether this student account is active or inactive
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
                                            Basic student details and contact information
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
                                        <CardTitle className="text-xl text-gray-900 dark:text-gray-100">Academic Information</CardTitle>
                                        <CardDescription className="text-gray-600 dark:text-gray-400">
                                            Course details and enrollment information
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {/* Student Number */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="student_number"
                                            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            <Hash className="h-4 w-4" />
                                            Student Number *
                                        </Label>
                                        <Input
                                            id="student_number"
                                            type="text"
                                            value={data.student_number}
                                            onChange={(e) => handleStudentNumberChange(e.target.value)}
                                            className="border-gray-200 bg-gray-50 font-mono transition-colors focus:border-red-500 focus:ring-red-500/20 dark:border-gray-600 dark:bg-gray-700 dark:focus:border-red-400"
                                            placeholder="2024-1234 (will be used as username)"
                                        />
                                        {getFieldError('student_number') && (
                                            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                                <AlertCircle className="h-4 w-4" />
                                                {getFieldError('student_number')}
                                            </div>
                                        )}
                                        <p className="text-xs text-gray-500 dark:text-gray-400">This will also be used as the student's username</p>
                                    </div>

                                    {/* Course */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="course"
                                            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            <BookOpen className="h-4 w-4" />
                                            Course/Program *
                                        </Label>

                                        <Popover open={cbOpen} onOpenChange={setCbOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={cbOpen}
                                                    className="w-full border-gray-200 bg-gray-50 focus:border-red-500 focus:ring-red-500/20 dark:border-gray-600 dark:bg-gray-700 dark:focus:border-red-400"
                                                >
                                                    {cbValue ? courseOptions.find((course) => course.value === cbValue)?.value : 'Select Course'}
                                                    <ChevronsUpDown className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[200px] border border-gray-200 bg-white p-0 dark:border-gray-700 dark:bg-gray-800">
                                                <Command>
                                                    <CommandInput placeholder="Search course..." />
                                                    <CommandList>
                                                        <CommandEmpty>No course found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {courseOptions.map((course) => (
                                                                <CommandItem
                                                                    key={course.value}
                                                                    value={course.value}
                                                                    onSelect={(currentValue) => {
                                                                        setCbValue(currentValue === cbValue ? '' : currentValue);
                                                                        setData('course', currentValue);
                                                                        setCbOpen(false);
                                                                    }}
                                                                >
                                                                    {course.value}
                                                                    <Check
                                                                        className={cn(
                                                                            'ml-auto',
                                                                            cbValue === course.value ? 'opacity-100' : 'opacity-0',
                                                                        )}
                                                                    />
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>

                                        {getFieldError('course') && (
                                            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                                <AlertCircle className="h-4 w-4" />
                                                {getFieldError('course')}
                                            </div>
                                        )}
                                    </div>

                                    {/* Enrollment Date */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="enrollment_date"
                                            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            <Calendar className="h-4 w-4" />
                                            Enrollment Date
                                        </Label>
                                        <Input
                                            id="enrollment_date"
                                            type="date"
                                            value={data.enrollment_date}
                                            onChange={(e) => setData('enrollment_date', e.target.value)}
                                            className="border-gray-200 bg-gray-50 transition-colors focus:border-red-500 focus:ring-red-500/20 dark:border-gray-600 dark:bg-gray-700 dark:focus:border-red-400"
                                        />
                                        {getFieldError('enrollment_date') && (
                                            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                                <AlertCircle className="h-4 w-4" />
                                                {getFieldError('enrollment_date')}
                                            </div>
                                        )}
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
                                                        {data.student_number || 'Enter student number above'}
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
                                        Updating Student Data...
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
                            All fields marked with * are required. Student will receive auto-generated login credentials via email.
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
