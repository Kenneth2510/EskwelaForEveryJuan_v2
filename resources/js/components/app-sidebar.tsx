
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { LayoutGrid, SlidersHorizontal, SquareUser, User, UserCog } from 'lucide-react';
import AppLogo from './app-logo';

type SidebarNavItem = NavItem & {
  icon?: React.ComponentType<any>;
  children?: SidebarNavItem[];
};

const mainNavItems: SidebarNavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'User Management',
        icon: SquareUser,
        children: [
            {
                title: 'Learners',
                href: '/user-management/learner',
                icon: User,
            },
            {
                title: 'Instructors',
                href: '/user-management/instructor',
                icon: User,
            },
            {
                title: 'Admins',
                href: '/user-management/admin',
                icon: User,
            }
        ],
    },
    {
        title: 'Master Setup',
        icon: SlidersHorizontal,
        children: [
            {
                title: 'Role Management',
                href: '/master-setup/role',
                icon: UserCog,
            },
            {
                title: 'Configure Application',
                href: '/configure',
                icon: SlidersHorizontal,
            }
        ],
    }
];


export function AppSidebar() {
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
