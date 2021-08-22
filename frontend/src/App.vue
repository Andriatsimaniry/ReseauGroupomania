<template>
  <div id="app">
    <nav class="navbar navbar-expand navbar-dark bg-dark">
      <a href="/" class="navbar-brand">GroupoMania</a>
      <div class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link to="/posts" class="nav-link">Posts</router-link>
        </li>
        <li v-if="showAdminBoard" class="nav-item">
          <router-link to="/users" class="nav-link">Utilisateurs</router-link>
        </li>
      </div>

      <div v-if="!currentUser" class="navbar-nav ml-auto">
        <li class="nav-item">
          <router-link to="/register" class="nav-link">
            <font-awesome-icon icon="user-plus" /> Sign Up
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/login" class="nav-link">
            <font-awesome-icon icon="sign-in-alt" /> Login
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
            <font-awesome-icon icon="sign-out-alt" /> LogOut
          </a>
        </li>
      </div>
    </nav>

    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>

export default {
  computed: {   // La fonction est mise en cache en fonction de leurs dépendances réactive
    currentUser() {
      return this.$store.state.auth.user; //Chaque modification apportée /mise à jour DOM déclenchées.
    },
    showAdminBoard() {
      if (this.currentUser && this.currentUser['roles']) {
        return this.currentUser['roles'].includes('ROLE_ADMIN');
      }

      return false;
    }
  },
  methods: {  // La fonction est exécutée à chaque fois qu'un nouveau rendu se produit
    logOut() {
      this.$store.dispatch('auth/logout'); //la valeur renvoyée sera une promesse qui se résout / si ts les gest ont résolus
      this.$router.push('/login'); // Renvoie sur la page Loggin
    }
  }
};
</script>