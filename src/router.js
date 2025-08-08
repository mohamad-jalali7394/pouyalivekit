import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router';
import LoginPage from "./pages/LoginPage";
import TheConference from "./pages/TheConference";
import WaitingRoom from "./components/WaitingRoom";
import CalendarPage from "./pages/CalendarPage";
import MeetingEnded from "./pages/MeetingEnded";
import UserManagement from "@/components/UserManagement.vue";
import GroupManagement from "@/components/GroupManagement.vue";
import MeetingsManagement from "@/components/MeetingsManagement.vue";
import ReportManagement from "@/components/ReportManagement.vue";
import RoomManagement from "@/components/RoomManagement.vue";
import ActiveDirectory from "@/components/ActiveDirectory.vue";
import SystemIncident from "@/components/SystemIncident.vue";
import MeetingSettings from "@/components/MeetingSettings.vue";
import CalendarItem from "@/components/CalendarItem.vue";
import auth from './store/auth';
const isServer = typeof window === 'undefined';
const history = isServer ? createMemoryHistory(process.env.BASE_URL) : createWebHistory(process.env.BASE_URL);
const routes = [
    {
        path: '/',
        redirect: '/Login',
        meta: {
            public: true,
            onlyWhenLoggedOut: true
        }
    },
    {
        path: '/Login',
        component: LoginPage,
        name: 'Login',
        meta: {
            public: true,
            onlyWhenLoggedOut: true
        }
    },
    {
        path: '/calendar',
        component: CalendarPage,
        name: 'CalendarPage',
        props: true,
        meta: {
            public: false,
            requiresAuth: true
        },
        children: [
            {
                path: 'userManagement',
                component: UserManagement,
                name: 'UserManagement',
                meta: {
                    public: false,
                    requiresAuth: true
                }
            },
            {
                path: 'groupManagement',
                component: GroupManagement,
                name: 'GroupManagement',
                meta: {
                    public: false,
                    requiresAuth: true
                }
            },
            {
                path: 'meetingManagement',
                component: MeetingsManagement,
                name: 'MeetingsManagement',
                meta: {
                    public: false,
                    requiresAuth: true
                }
            },
            {
                path: 'webinarManagement',
                component: MeetingsManagement,
                name: 'WebinarsManagement',
                meta: {
                    public: false,
                    requiresAuth: true
                }
            },
            {
                path: 'reportManagement',
                component: ReportManagement,
                name: 'ReportManagement',
                meta: {
                    public: false,
                    requiresAuth: true
                }
            },
            {
                path: 'roomManagement',
                component: RoomManagement,
                name: 'RoomManagement',
                meta: {
                    public: false,
                    requiresAuth: true
                }
            },
            {
                path: 'activeDirectory',
                component: ActiveDirectory,
                name: 'ActiveDirectory',
                meta: {
                    public: false,
                    requiresAuth: true
                }
            },
            {
                path: 'systemIncident',
                component: SystemIncident,
                name: 'SystemIncident',
                meta: {
                    public: false,
                    requiresAuth: true
                }
            },
            {
                path: 'meetingSettings',
                component: MeetingSettings,
                name: 'MeetingSettings',
                meta: {
                    public: false,
                    requiresAuth: true
                }
            },
            {
                path: 'calendar',
                component: CalendarItem,
                name: 'CalendarItem',
                meta: {
                    public: false,
                    requiresAuth: true
                }
            },
        ]
    },
    {
        path: '/conference',
        component: TheConference,
        name: 'Conference',
        props: true,
        meta: {
            public: true,
            requiresAuth: false
        }
    },

    {
        path: '/meeting',
        component: TheConference,
        name: 'Meeting',
        props: true,
        meta: {
            public: true,
            requiresAuth: false
        }
    },
    {
        path: '/MeetingEnded',
        component: MeetingEnded,
        name: 'MeetingEnded',
        meta: {
            public: true,
            requiresAuth: false
        }
    },
    {
        path: '/mic-test',
        component: WaitingRoom,
        meta: {
            public: false
        }
    }
]

const router = createRouter({
    history,
    routes,
});

router.beforeEach(async (to) => {

    const authenticated = auth.getIsAuthenticated()
    // redirect the user to login page if he is not authenticated

        if (!authenticated && to.name !== 'Login' && to.name !==  'Conference'&& to.name !==  'Meeting'&& to.name !==  'MeetingEnded') {
            return { name: 'Login' }

    }

})

export default router


