import { createWebHistory, createRouter } from "vue-router";
// CreatWebHistory pour passer de l'utilisation du hachage au historymode dans le navigateur, en utilisant l'API d'historique HTML5.

import Login from "./components/Login.vue";
import Register from "./components/Register.vue";
// lazy-loaded
const Profile = () => import("./components/Profile.vue")
const BoardAdmin = () => import("./components/BoardAdmin.vue")
const BoardModerator = () => import("./components/BoardModerator.vue")
const BoardUser = () => import("./components/BoardUser.vue")

const routes = [
  
  
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/register",
    component: Register,
  },
  {
    path: "/profile",
    name: "profile",
    // lazy-loaded
    component: Profile,
  },
  {
    path: "/admin",
    name: "admin",
    // lazy-loaded
    component: BoardAdmin,
  },
  {
    path: "/mod",
    name: "moderator",
    // lazy-loaded
    component: BoardModerator,
  },
  {
    path: "/user",
    name: "user",
    // lazy-loaded
    component: BoardUser,
  },

  // Routes Posts
  {
    path: "/", // Chemin de l'Url pour la route Posts
    alias: "/posts", 
    name: "posts", // Nom de la route
    component: () => import("./components/PostsList") //Composant à charge lorsque cette route est appelée
  },
  {
    path: "/posts/:id", 
    name: "post-details",
    component: () => import("./components/Post") 
  },
  {
    path: "/add",
    name: "add",
    component: () => import("./components/AddPost")
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
    const publicPages = ['/login', '/register'];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = localStorage.getItem('user');
  
    // trying to access a restricted page + not logged in
    // redirect to login page
    if (authRequired && !loggedIn) {
      next('/login');
    } else {
      next();
    }
  });

export default router;