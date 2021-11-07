<template>
  <div>
    <nav class="navbar navbar-expand">
      <a href="/" class="navbar-brand">
        <img src="./assets/icon-left-font-monochrome-white.svg" />
      </a>
      <div class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link to="/posts" class="nav-link">Publications</router-link>
        </li>
        <li v-if="showAdminBoard" class="nav-item">
          <router-link to="/users" class="nav-link">Utilisateurs</router-link>
        </li>
      </div>

      <div v-if="!currentUser" class="navbar-nav ml-auto">
        <li class="nav-item">
          <router-link to="/register" class="nav-link">
            <font-awesome-icon icon="user-plus" /> S'inscrire
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/login" class="nav-link">
            <font-awesome-icon icon="sign-in-alt" /> Se connecter
          </router-link>
        </li>
      </div>

      <div v-if="currentUser" class="navbar-nav ml-auto">
        <li class="nav-item">
          <router-link to="/profile" class="nav-link">
            <font-awesome-icon icon="user" />
            {{ currentUser.username }}
          </router-link>
        </li>
        <li class="nav-item">
          <a class="nav-link" @click.prevent="logOut">
            <font-awesome-icon icon="sign-out-alt" /> Se déconnecter
          </a>
        </li>
      </div>
    </nav>

    <div class="container py-4">
      <router-view />
    </div>
  </div>
</template>

<script>
import EventBus from "./common/EventBus";
export default {
  computed: {
    // La fonction est mise en cache en fonction de leurs dépendances réactive
    currentUser() {
      return this.$store.state.auth.user; //Chaque modification apportée /mise à jour DOM déclenchées.
    },
    showAdminBoard() {
      if (this.currentUser && this.currentUser["roles"]) {
        return this.currentUser["roles"].includes("ROLE_ADMIN");
      }

      return false;
    },
  },

  methods: {
    // La fonction est exécutée à chaque fois qu'un nouveau rendu se produit
    logOut() {
      this.$store.dispatch("auth/logout"); //la valeur renvoyée sera une promesse qui se résout / si ts les gets ont résolus
      this.$router.push("/login"); // Renvoie sur la page Loggin
    },
  },
  mounted() {
    EventBus.on("logout", () => {
      this.logOut();
    });
  },
};
</script>

<style scoped>
.navbar {
  background: #fd2d02;
}
a.nav-link {
  color: white;
  cursor: pointer;
}
a.navbar-brand img {
  height: 20px;
}
</style>