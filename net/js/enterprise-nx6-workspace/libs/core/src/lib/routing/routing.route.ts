import { RouteLinkModel } from "../router.state";

export const UserMenu: RouteLinkModel[] = [{
    title: 'Profile',
    route: '/',
    icon: 'account_box',
}, {
    title: 'Settings',
    route: '/',
    icon: 'settings',
},
];
export const AppMenu: RouteLinkModel[] = [{
    title: 'Commerce Management',
    route: 'http://localhost:4200',
    icon: 'account_box',
}, {
    title: 'Commerce',
    route: 'http://localhost:4201',
    icon: 'settings',
},
];