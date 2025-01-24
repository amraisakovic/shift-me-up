import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';

import HomePage from './views/HomePage.vue';
import JobsPage from './views/JobsPage.vue';
import ProfilePage from './views/ProfilePage.vue';
import AdminPanel from './views/AdminPanel.vue';
import LoginPage from './views/LoginPage.vue';
import MyShifts from "@/views/MyShifts.vue";
import SetupPage from "@/views/SetupPage.vue";
import AdminNews from "@/views/AdminNews.vue";

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

// Define routes with meta fields for roles
const routes = [
    { path: '/', component: HomePage },
    { path: '/jobs', component: JobsPage, meta: { requiresAuth: true, role: 'nanny' } },
    { path: '/profile', component: ProfilePage, meta: { requiresAuth: true, role: 'nanny' } },
    { path: '/admin', component: AdminPanel, meta: { requiresAuth: true, role: 'admin' } },
    { path: '/login', component: LoginPage },
    { path: '/my-shifts', component: MyShifts, meta: { requiresAuth: true, role: 'nanny' } },
    { path: '/setup', component: SetupPage, meta: { requiresAuth: true, role: 'nanny' } },
    { path: '/admin-news', component: AdminNews, meta: { requiresAuth: true, role: 'admin' } },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Firebase Authentication Observer
const auth = getAuth();
let userRole = null;

onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            userRole = userDoc.data()?.role;
        } catch (error) {
            console.error('Error fetching user role: ', error);
        }
    } else {
        userRole = null;
    }
});

// Navigation Guard
router.beforeEach(async (to, from, next) => {
    if (to.meta.requiresAuth) {
        if (auth.currentUser) {
            if (to.meta.role === userRole) {
                next();
            } else {
                alert('Access Denied: Unauthorized Role');
                next('/login');
            }
        } else {
            alert('Please log in to access this page.');
            next('/login');
        }
    } else {
        next();
    }
});

const app = createApp(App);
app.use(router);
app.mount('#app');
