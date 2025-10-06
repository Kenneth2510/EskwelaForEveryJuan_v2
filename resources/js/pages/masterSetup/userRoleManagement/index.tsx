import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { columns, type UserWithRole } from './columns';
import { DataTable } from './data-table';
import { Users, Shield, CheckCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'User Role Assignment',
    href: '/user-role-assignment',
  },
];

type UserRoleProps = {
  users: UserWithRole[];
  roles: { id: number; name: string }[];
};

export default function UserRoleAssignment({ users, roles }: UserRoleProps) {

  const stats = [
    {
      title: 'Total Users',
      value: users.length,
      icon: Users,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    },
    {
      title: 'Roles Available',
      value: roles.length,
      icon: Shield,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950/30',
    },
    {
      title: 'Assigned Roles',
      value: users.filter(u => u.roles.length > 0).length,
      icon: CheckCircle,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="User Role Assignment" />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            User Role Assignment
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Assign roles to users depending on their category
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className={`p-6 rounded-xl shadow-sm border bg-white dark:bg-gray-800`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6">
          <DataTable columns={columns(roles)} data={users} />
        </div>
      </div>
    </AppLayout>
  );
}
