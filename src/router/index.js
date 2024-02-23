import { createRouter, createWebHistory } from "vue-router";
const Home = () => import("../views/Home.vue");
const SignIn = () => import("../views/SignIn.vue");
const routes = [
    {
        path: '/',
        name: "home",
        component: Home,
        meta: { requiresAuth: true },
    },
    {
        name: "signin",
        path: '/signin',
        component: SignIn,
        meta: { requiresAuth: false },
    },
    {
        path: "/:catchAll(.*)*",
        redirect: { name: "login" },
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    linkExactActiveClass: "text-yellow-500",
});
import { useAuthStore } from '../stores/authStore.js';

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    if (to.meta.requiresAuth
        && !authStore.isAuthenticated
        && to.name !== 'signin') {
        next({ name: 'signin' })
    } else if (authStore.isAuthenticated
        && to.name === 'signin') {
        next({ name: 'home' });
    } else {
        next();
    }
})
export default router;