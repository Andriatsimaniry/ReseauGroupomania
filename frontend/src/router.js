// définit les routes pour chaque composant.

import { createWebHistory, createRouter } from "vue-router";
// CreatWebHistory pour passer de l'utilisation du hachage au history mode dans le navigateur,
// en utilisant l'API d'historique HTML5.
 
import Login from "./components/Login.vue";
import Register from "./components/Register.vue";
import UserList from "./components/UserList.vue";

const Profile = () => import("./components/Profile.vue");

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
  
    component: Profile,
  },
  {
    path: "/users",
    name: "users",
    beforeEnter(to, from, next) {
      if(isAdmin()) {
        next();
      } else {
        next(from.path);
      }
    },
    
    component: UserList,
  },

  // Routes Posts
  {
    path: "/", // Chemin de l'Url pour la route Posts
    alias: "/posts",
    name: "posts", // Nom de la route
    component: () => import("./components/PostsList"), //Composant à charger lorsque cette route est appelée
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const isAdmin = function() {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  if (user) {
    return user.roles.includes("ROLE_ADMIN");
  }
  return false;
};

router.beforeEach((to, from, next) => {
  const publicPages = ["/login", "/register"];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem("user");

// rediriger vers la page de connexion
  if (authRequired && !loggedIn) {
    next("/login");
  } else {
    next();
  }
});

export default router;
