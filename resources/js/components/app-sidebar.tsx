import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { canAny } from '@/lib/can';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { LayoutGrid, SlidersHorizontal, SquareUser, User, UserCog } from 'lucide-react';
import AppLogo from './app-logo';

type SidebarNavItem = NavItem & {
    icon?: React.ComponentType<any>;
    children?: SidebarNavItem[];
};

export function AppSidebar() {
    const mainNavItems: SidebarNavItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
        ...(canAny(['user_management.view'])
            ? [
                  {
                      title: 'User Management',
                      icon: SquareUser,
                      children: [
                          ...(canAny(['user_management.view']) ? [{ title: 'Learners', href: '/user-management/learner', icon: User }] : []),
                          ...(canAny(['user_management.view']) ? [{ title: 'Instructors', href: '/user-management/instructor', icon: User }] : []),
                          ...(canAny(['admin_management.view']) ? [{ title: 'Admins', href: '/user-management/admin', icon: User }] : []),
                      ],
                  },
              ]
            : []),
        ...(canAny(['settings.roles_permissions', 'user_management.assignRoles', 'admin_management.assignRoles', 'settings.update'])
            ? [
                  {
                      title: 'Master Setup',
                      icon: SlidersHorizontal,
                      children: [
                          ...(canAny(['settings.roles_permissions']) ? [{ title: 'Role Management', href: '/master-setup/role', icon: UserCog }] : []),
                          ...(canAny(['user_management.assignRoles', 'admin_management.assignRoles']) ? [{ title: 'Assign Roles', href: '/master-setup/role-assign', icon: UserCog }] : []),
                          ...(canAny(['settings.update']) ? [{ title: 'Configure Application', href: '/configure', icon: SlidersHorizontal }] : []),
                      ],
                  },
              ]
            : []),
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
