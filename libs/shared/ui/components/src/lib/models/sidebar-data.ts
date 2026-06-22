export interface SidebarData {
    user: {
        name: string;
        email: string;
        avatar: string;
        logout: () => void;
    };
    navMain: NavItemWithChildren[];
    navSecondary: NavItem[];
    projects: NavItem[];
}


interface BaseNavItem {
    title: string;
    url: string;
}

interface NavItem extends BaseNavItem {
    icon: string;
}

interface NavItemWithChildren extends NavItem {
    isActive?: boolean;
    items?: BaseNavItem[];
}