'use client';

import MySwal from '@/components/swal-alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { CheckSquare, Shield, UserPlus } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Role Management',
        href: '/role-management',
    },
    {
        title: 'Create Role',
        href: '/role-management/create',
    },
];

type UserCategory = 'learner' | 'instructor' | 'admin';

type PermissionItem = {
    id: string;
    label: string;
};

type PermissionGroup = {
    id: string;
    label: string;
    permissions: PermissionItem[];
};

/**
 * Local fallback presets (used only when server doesn't send presets).
 * Keep this in sync with your backend presets if possible.
 */
const FALLBACK_PRESETS: Record<UserCategory, PermissionGroup[]> = {
    learner: [
        {
            id: 'learner.dashboard',
            label: 'Dashboard',
            permissions: [{ id: 'dashboard.view', label: 'View Dashboard' }],
        },
        {
            id: 'learner.courses',
            label: 'Course Access',
            permissions: [
                { id: 'course_enrollment.enroll', label: 'Enroll to Course' },
                { id: 'course_enrollment.view', label: 'View Enrollments' },
                { id: 'course_management.viewOwn', label: 'View Own Courses' },
            ],
        },
    ],
    instructor: [
        {
            id: 'instructor.courses',
            label: 'Course Management',
            permissions: [
                { id: 'course_management.create', label: 'Create Course' },
                { id: 'course_management.viewOwn', label: 'View Own Courses' },
            ],
        },
    ],
    admin: [
        {
            id: 'admin.core',
            label: 'System Core',
            permissions: [{ id: 'dashboard.viewAll', label: 'View All Dashboards/Overview' }],
        },
    ],
};

export default function CreateRole() {
    const { props } = usePage();
    const successMessage = props.flash?.success;

    // backend-provided presets (if controller create() returned 'presets')
    // typed as any because page props are dynamic; shape expected: Record<UserCategory, PermissionGroup[]>
    const serverPresets = (props as any).presets as Record<string, PermissionGroup[]> | undefined;

    // choose presets source: server => fallback
    const presets: Record<UserCategory, PermissionGroup[]> = (serverPresets as any) ?? FALLBACK_PRESETS;

    // Inertia form - fields: name, description, category, permissions[]
    const form = useForm({
        name: '',
        description: '',
        category: 'learner' as UserCategory,
        permissions: [] as string[],
    });

    const [category, setCategory] = useState<UserCategory>('learner');

    // groups derived from presets and selected category
    const groups = useMemo(() => {
        return presets[category] ?? [];
    }, [presets, category]);

    // set form.category when local category changes
    useEffect(() => {
        form.setData('category', category);
    }, [category]);

    // When the category changes, auto-select (tick) all preset permissions for that category.
    // If you prefer to start with no selection, change this effect to set [] instead.
    useEffect(() => {
        const allIds = groups.flatMap((g) => g.permissions.map((p) => p.id));
        form.setData('permissions', allIds);
    }, [groups]); // run when groups change (which changes when category or presets change)

    // show success popup on navigation flash
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
                    content: 'text-gray-700 dark:text-gray-300',
                },
            });
        }
    }, [successMessage]);

    // helper: check if a permission is selected
    const hasPermission = (permId: string) => form.data.permissions.includes(permId);

    // toggle a single permission
    const togglePermission = (permId: string) => {
        const exists = hasPermission(permId);
        if (exists) {
            form.setData(
                'permissions',
                form.data.permissions.filter((p) => p !== permId),
            );
        } else {
            form.setData('permissions', [...form.data.permissions, permId]);
        }
    };

    // toggle all permissions in a group
    const toggleGroup = (group: PermissionGroup) => {
        const allSelected = group.permissions.every((p) => hasPermission(p.id));
        if (allSelected) {
            // remove group permissions
            form.setData(
                'permissions',
                form.data.permissions.filter((p) => !group.permissions.some((g) => g.id === p)),
            );
        } else {
            // add missing permissions
            const newPerms = group.permissions.map((p) => p.id).filter((id) => !form.data.permissions.includes(id));
            form.setData('permissions', [...form.data.permissions, ...newPerms]);
        }
    };

    // select/deselect all visible permissions
    const toggleAllVisible = () => {
        const visibleIds = groups.flatMap((g) => g.permissions.map((p) => p.id));
        const allVisible = visibleIds.every((id) => form.data.permissions.includes(id));
        if (allVisible) {
            form.setData(
                'permissions',
                form.data.permissions.filter((p) => !visibleIds.includes(p)),
            );
        } else {
            const newOnes = visibleIds.filter((id) => !form.data.permissions.includes(id));
            form.setData('permissions', [...form.data.permissions, ...newOnes]);
        }
    };

    // submit handler -> post to your roles.store route (spatie expects 'permissions' as array of strings)
    const escapeHtml = (unsafe: string) =>
        unsafe.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.data.name.trim()) {
            MySwal.fire({
                icon: 'error',
                title: 'Validation',
                text: 'Please provide a role name.',
                background: 'var(--background)',
                color: 'var(--foreground)',
            });
            return;
        }

        // show loading modal
        MySwal.fire({
            title: 'Creating role...',
            html: 'Please wait while we create the role.',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                // show spinner (SweetAlert2's built-in)
                // @ts-ignore - MySwal proxies Swal
                MySwal.showLoading();
            },
            background: 'var(--background)',
            color: 'var(--foreground)',
            showConfirmButton: false,
        });

        form.post(route('role.store'), {
            // called when the request is successful (Inertia handled redirect may also occur)
            onSuccess: (page) => {
                // try to read a flash success message returned from the backend
                const successText = (page.props as any)?.flash?.success ?? 'Role created successfully.';

                MySwal.fire({
                    icon: 'success',
                    title: 'Created',
                    text: String(successText),
                    timer: 1800,
                    showConfirmButton: false,
                    background: 'var(--background)',
                    color: 'var(--foreground)',
                    customClass: {
                        popup: 'rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700',
                    },
                });
            },

            // called when validation errors are returned (server-side)
            onError: (errors) => {
                // Prefer to render the form.errors which Inertia populates
                const msgs = Object.values(form.errors)
                    .flat()
                    .filter(Boolean)
                    .map((m) => String(m))
                    .join('<br/>');

                const html = msgs
                    ? `<div style="text-align:left">${escapeHtml(msgs).replace(/\n/g, '<br/>')}</div>`
                    : 'An unexpected error occurred.';

                MySwal.fire({
                    icon: 'error',
                    title: 'Error',
                    html,
                    background: 'var(--background)',
                    color: 'var(--foreground)',
                    confirmButtonText: 'OK',
                    customClass: {
                        popup: 'rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700',
                    },
                });
            },

            // always run at the end (success or error); ensure loading modal closed
            onFinish: () => {
                // close loading if still open (Swal.close is safe even if already closed)
                // @ts-ignore
                if (MySwal.isVisible && MySwal.isVisible()) {
                    // @ts-ignore
                    MySwal.close();
                }
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Role" />

            <div className="min-h-screen bg-white transition-colors duration-300 dark:bg-gray-900">
                <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center gap-4">
                            <div className="rounded-xl bg-gradient-to-br from-red-800 to-red-900 p-3 shadow-lg">
                                <Shield className="h-7 w-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100">Create Role</h1>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Define a role and assign permissions (Spatie)</p>
                            </div>
                        </div>
                    </div>

                    {/* Form Card */}
                    <form onSubmit={submit} className="space-y-6">
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            {/* Basic Info */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div className="sm:col-span-2">
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Role Name</label>
                                    <Input
                                        value={form.data.name}
                                        onChange={(e) => form.setData('name', e.target.value)}
                                        placeholder="e.g. course-instructor, content-editor"
                                        className="w-full"
                                    />
                                    {form.errors.name && <p className="mt-1 text-xs text-red-600">{form.errors.name}</p>}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">User Category</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setCategory('learner')}
                                            className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold ${
                                                category === 'learner'
                                                    ? 'border-red-800 bg-red-800 text-white'
                                                    : 'border-gray-200 bg-white text-gray-700 dark:bg-gray-700 dark:text-gray-200'
                                            }`}
                                        >
                                            <UserPlus className="h-4 w-4" />
                                            Learner
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setCategory('instructor')}
                                            className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold ${
                                                category === 'instructor'
                                                    ? 'border-red-800 bg-red-800 text-white'
                                                    : 'border-gray-200 bg-white text-gray-700 dark:bg-gray-700 dark:text-gray-200'
                                            }`}
                                        >
                                            <Shield className="h-4 w-4" />
                                            Instructor
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setCategory('admin')}
                                            className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold ${
                                                category === 'admin'
                                                    ? 'border-red-800 bg-red-800 text-white'
                                                    : 'border-gray-200 bg-white text-gray-700 dark:bg-gray-700 dark:text-gray-200'
                                            }`}
                                        >
                                            <CheckSquare className="h-4 w-4" />
                                            Admin
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Description (optional)</label>
                                <Textarea
                                    value={form.data.description}
                                    onChange={(e) => form.setData('description', e.target.value)}
                                    placeholder="Short description to remind admins what this role is for"
                                    className="w-full"
                                />
                                {form.errors.description && <p className="mt-1 text-xs text-red-600">{form.errors.description}</p>}
                            </div>
                        </div>

                        {/* Permissions */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Permissions</h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Choose permissions to assign to this role.</p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button type="button" variant="outline" onClick={toggleAllVisible} className="text-sm">
                                        Toggle All Visible
                                    </Button>
                                </div>
                            </div>

                            <div className="mt-4 space-y-4">
                                {groups.map((group) => {
                                    const groupAll = group.permissions.every((p) => hasPermission(p.id));
                                    const groupSome = group.permissions.some((p) => hasPermission(p.id)) && !groupAll;

                                    return (
                                        <div key={group.id} className="rounded-lg border border-gray-100 p-4 dark:border-gray-700">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Checkbox
                                                        id={`group-${group.id}`}
                                                        checked={groupAll}
                                                        onCheckedChange={() => toggleGroup(group)}
                                                        aria-checked={groupSome ? 'mixed' : groupAll}
                                                    />
                                                    <div>
                                                        <div className="font-semibold text-gray-900 dark:text-gray-100">{group.label}</div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            {group.permissions.length} permissions
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="text-sm text-gray-500 dark:text-gray-400">Select group</div>
                                            </div>

                                            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                                                {group.permissions.map((perm) => (
                                                    <label
                                                        key={perm.id}
                                                        className="flex items-center gap-2 rounded-md border border-gray-100 px-3 py-2 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
                                                    >
                                                        <Checkbox
                                                            id={perm.id}
                                                            checked={hasPermission(perm.id)}
                                                            onCheckedChange={() => togglePermission(perm.id)}
                                                        />
                                                        <div className="truncate">
                                                            <div className="font-medium text-gray-900 dark:text-gray-100">{perm.label}</div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">{perm.id}</div>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between gap-4">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Assigning permissions will be saved under Spatie permissions. Make sure permissions exist in DB.
                            </div>
                            <div className="flex items-center gap-2">
                                <Button asChild variant="outline">
                                    <Link href="/master-setup/role" className="px-4 py-2">
                                        Cancel
                                    </Link>
                                </Button>

                                <Button type="submit" className="bg-red-800 px-5 py-2 text-white">
                                    Create Role
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
