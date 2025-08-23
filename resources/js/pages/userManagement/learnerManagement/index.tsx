import MySwal from '@/components/swal-alert';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { columns, type Learner } from './columns';
import { DataTable } from './data-table';
import { GraduationCap, Users, UserCheck, UserX, TrendingUp } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Learner Management',
        href: '/user-management/learner',
    },
];

type LearnerProps = {
    learners: Learner[];
};

export default function Dashboard({ learners }: LearnerProps) {

    const { props } = usePage();
    const successMessage = props.flash?.success;

    useEffect(() => {
        if (successMessage) {
            MySwal.fire({
                icon: 'success',
                title: 'Success!',
                text: successMessage,
                timer: 2000,
                showConfirmButton: false,
                background: 'var(--background)',
                color: 'var(--foreground)',
                customClass: {
                    popup: 'rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700',
                    title: 'text-gray-900 dark:text-gray-100',
                    content: 'text-gray-700 dark:text-gray-300'
                }
            });
        }
    }, [successMessage]);

    // Calculate statistics
    const totalStudents = learners.length;
    const activeStudents = learners.filter(learner => learner.status === 'active').length;
    const inactiveStudents = learners.filter(learner => learner.status === 'inactive').length;
    const activePercentage = totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0;

    const stats = [
        {
            title: 'Total Students',
            value: totalStudents,
            icon: Users,
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-50 dark:bg-blue-950/30',
            borderColor: 'border-blue-200 dark:border-blue-800',
        },
        {
            title: 'Active Students',
            value: activeStudents,
            icon: UserCheck,
            color: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-50 dark:bg-green-950/30',
            borderColor: 'border-green-200 dark:border-green-800',
        },
        {
            title: 'Inactive Students',
            value: inactiveStudents,
            icon: UserX,
            color: 'text-red-600 dark:text-red-400',
            bgColor: 'bg-red-50 dark:bg-red-950/30',
            borderColor: 'border-red-200 dark:border-red-800',
        },
        {
            title: 'Activity Rate',
            value: `${activePercentage}%`,
            icon: TrendingUp,
            color: 'text-purple-600 dark:text-purple-400',
            bgColor: 'bg-purple-50 dark:bg-purple-950/30',
            borderColor: 'border-purple-200 dark:border-purple-800',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Student Management" />
            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gradient-to-br from-red-800 to-red-900 rounded-xl shadow-lg">
                                    <GraduationCap className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                                        Student Management
                                    </h1>
                                    <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg mt-1">
                                        Manage and monitor your student community
                                    </p>
                                </div>
                            </div>

                            {/* Quick Stats Badge */}
                            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg px-4 py-2 shadow-sm border border-gray-200 dark:border-gray-700">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    System Active
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                            {stat.title}
                                        </p>
                                        <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                                            {stat.value}
                                        </p>
                                    </div>
                                    <div className={`p-3 rounded-lg bg-gray-50 dark:bg-gray-700 ${stat.color}`}>
                                        <stat.icon className="h-6 w-6" />
                                    </div>
                                </div>

                                {/* Progress bar for activity rate */}
                                {stat.title === 'Activity Rate' && (
                                    <div className="mt-4">
                                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                            <div
                                                className="bg-red-500 dark:bg-red-400 h-2 rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${activePercentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Data Table */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="p-6">
                            <DataTable columns={columns} data={learners} />
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Last updated: {new Date().toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
