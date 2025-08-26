'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import MySwal from '@/components/swal-alert';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, UserPlus, CheckSquare } from 'lucide-react';
import Delete from './delete';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Role Management',
    href: '/role-management',
  },
  {
    title: 'Edit Role',
    href: '#',
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
 * Minimal fallback (only used if server didn't send presets)
 */
const FALLBACK_PRESETS: Record<UserCategory, PermissionGroup[]> = {
  learner: [
    {
      id: 'learner.dashboard',
      label: 'Dashboard',
      permissions: [{ id: 'dashboard.view', label: 'View Dashboard' }],
    },
  ],
  instructor: [
    {
      id: 'instructor.courses',
      label: 'Course Management',
      permissions: [{ id: 'course_management.create', label: 'Create Course' }],
    },
  ],
  admin: [
    {
      id: 'admin.core',
      label: 'System',
      permissions: [{ id: 'dashboard.viewAll', label: 'View All' }],
    },
  ],
};

export default function EditRole() {
  const { props } = usePage();
  // role shape expected from controller service: { id, name, description, permissions: array of names }
  const serverRole = (props as any).role as {
    id: number | string;
    name: string;
    description?: string | null;
    permissions?: string[] | any; // may be collection
  } | undefined;

  const serverPresets = (props as any).presets as Record<string, PermissionGroup[]> | undefined;
  const presets: Record<UserCategory, PermissionGroup[]> = (serverPresets as any) ?? FALLBACK_PRESETS;

  // Default to 'learner' but try to auto-detect category based on membership overlap
  const detectCategory = (): UserCategory => {
    if (!serverRole?.permissions || !Array.isArray(serverRole.permissions)) {
      return 'learner';
    }
    const rolePerms = serverRole.permissions.map(String);

    let best: { cat: UserCategory; matches: number } = { cat: 'learner', matches: 0 };

    (Object.keys(presets) as UserCategory[]).forEach((cat) => {
      const allIds = presets[cat].flatMap((g) => g.permissions.map((p) => p.id));
      const matches = allIds.filter((id) => rolePerms.includes(id)).length;
      if (matches > best.matches) {
        best = { cat, matches };
      }
    });

    return best.matches > 0 ? best.cat : 'learner';
  };

  const initialCategory = detectCategory();
  const [category, setCategory] = useState<UserCategory>(initialCategory);

  // Inertia form prefilled with role values
  const form = useForm({
    name: serverRole?.name ?? '',
    description: serverRole?.description ?? '',
    permissions: Array.isArray(serverRole?.permissions) ? serverRole.permissions.map(String) : [],
  });

  // groups computed for current category
  const groups = useMemo(() => presets[category] ?? [], [presets, category]);

  // show any flash success
  const successMessage = (props as any).flash?.success;

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
        },
      });
    }
  }, [successMessage]);

  // helper check
  const hasPermission = (permId: string) => form.data.permissions.includes(permId);

  const togglePermission = (permId: string) => {
    const exists = hasPermission(permId);
    if (exists) {
      form.setData('permissions', form.data.permissions.filter((p) => p !== permId));
    } else {
      form.setData('permissions', [...form.data.permissions, permId]);
    }
  };

  const toggleGroup = (group: PermissionGroup) => {
    const groupAll = group.permissions.every((p) => hasPermission(p.id));
    if (groupAll) {
      form.setData('permissions', form.data.permissions.filter((p) => !group.permissions.some((g) => g.id === p)));
    } else {
      const newOnes = group.permissions.map((p) => p.id).filter((id) => !form.data.permissions.includes(id));
      form.setData('permissions', [...form.data.permissions, ...newOnes]);
    }
  };

  const toggleAllVisible = () => {
    const visibleIds = groups.flatMap((g) => g.permissions.map((p) => p.id));
    const allVisible = visibleIds.every((id) => form.data.permissions.includes(id));
    if (allVisible) {
      form.setData('permissions', form.data.permissions.filter((p) => !visibleIds.includes(p)));
    } else {
      const newOnes = visibleIds.filter((id) => !form.data.permissions.includes(id));
      form.setData('permissions', [...form.data.permissions, ...newOnes]);
    }
  };

  // Improved submit with SweetAlert flow (loading, success, error)
  const escapeHtml = (unsafe: string) =>
    unsafe
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');

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

    MySwal.fire({
      title: 'Updating role...',
      html: 'Please wait while we update the role.',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        // @ts-ignore
        MySwal.showLoading();
      },
      background: 'var(--background)',
      color: 'var(--foreground)',
      showConfirmButton: false,
    });

    form.put(route('role.update', serverRole?.id), {
      onSuccess: (page) => {
        const successText = (page.props as any)?.flash?.success ?? 'Role updated successfully.';
        MySwal.fire({
          icon: 'success',
          title: 'Updated',
          text: String(successText),
          timer: 1500,
          showConfirmButton: false,
          background: 'var(--background)',
          color: 'var(--foreground)',
          customClass: {
            popup: 'rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700',
          },
        });
      },
      onError: () => {
        const msgs = Object.values(form.errors)
          .flat()
          .filter(Boolean)
          .map((m) => String(m))
          .join('<br/>');

        const html = msgs ? `<div style="text-align:left">${escapeHtml(msgs).replace(/\n/g, '<br/>')}</div>` : 'An unexpected error occurred.';
        MySwal.fire({
          icon: 'error',
          title: 'Error',
          html,
          confirmButtonText: 'OK',
          background: 'var(--background)',
          color: 'var(--foreground)',
          customClass: {
            popup: 'rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700',
          },
        });
      },
      onFinish: () => {
        // @ts-ignore
        try {
          if (MySwal.isVisible && MySwal.isVisible()) {
            // @ts-ignore
            MySwal.close();
          }
        } catch (e) {
          // ignore
        }
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Role" />

      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-red-800 to-red-900 rounded-xl shadow-lg">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Edit Role</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Update role details and permissions</p>
              </div>
            </div>

            {/* Delete button */}
            {serverRole && (
              <div>
                <Delete roleId={Number(serverRole.id)} roleName={serverRole.name} />
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={submit} className="space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Role Name</label>
                  <Input
                    value={form.data.name}
                    onChange={(e) => form.setData('name', e.target.value)}
                    placeholder="e.g. course-instructor, content-editor"
                    className="w-full"
                  />
                  {form.errors.name && <p className="mt-1 text-xs text-red-600">{form.errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">User Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setCategory('learner')}
                      className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold border ${
                        category === 'learner'
                          ? 'bg-red-800 text-white border-red-800'
                          : 'bg-white text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-200'
                      }`}
                    >
                      <UserPlus className="h-4 w-4" />
                      Learner
                    </button>

                    <button
                      type="button"
                      onClick={() => setCategory('instructor')}
                      className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold border ${
                        category === 'instructor'
                          ? 'bg-red-800 text-white border-red-800'
                          : 'bg-white text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-200'
                      }`}
                    >
                      <Shield className="h-4 w-4" />
                      Instructor
                    </button>

                    <button
                      type="button"
                      onClick={() => setCategory('admin')}
                      className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold border ${
                        category === 'admin'
                          ? 'bg-red-800 text-white border-red-800'
                          : 'bg-white text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-200'
                      }`}
                    >
                      <CheckSquare className="h-4 w-4" />
                      Admin
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Description (optional)</label>
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
                            <div className="text-xs text-gray-500 dark:text-gray-400">{group.permissions.length} permissions</div>
                          </div>
                        </div>

                        <div className="text-sm text-gray-500 dark:text-gray-400">Select group</div>
                      </div>

                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {group.permissions.map((perm) => (
                          <label key={perm.id} className="flex items-center gap-2 rounded-md border border-gray-100 px-3 py-2 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50">
                            <Checkbox id={perm.id} checked={hasPermission(perm.id)} onCheckedChange={() => togglePermission(perm.id)} />
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
                  <Link href="/role-management" className="px-4 py-2">
                    Cancel
                  </Link>
                </Button>

                <Button type="submit" className="bg-red-800 text-white px-5 py-2">
                  Update Role
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
