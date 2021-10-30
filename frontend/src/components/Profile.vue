<!-- Profil de l' utilisateur -->
<template>
  <div class="container">
    <header class="jumbotron">
      <h3>
        <strong>Nom d'utilisateur : {{ currentUser.username }}</strong>
      </h3>
      <input class="ml-4" name="username" v-model="currentUser.username" />
    </header>
    <div>
      <strong>
        <label for="username">Email: {{ currentUser.email }}</label>
      </strong>
    </div>

    <div class="d-flex mt-4">
      <button @click="modifyUser" class="btn btn-success">
        Modifier informations
      </button>
      <button @click="deleteUser" class="btn ml-4 btn-danger">
        Supprimer compte
      </button>
    </div>
  </div>
</template>

<script>
import UserDataService from "../services/userDataService";

export default {
  name: "Profile",
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
  },

  // L'utilisateur peut supprimer son compte
  methods: {
    deleteUser() {
      UserDataService.delete(this.currentUser.id)
        .then(() => {
          this.$store.dispatch("auth/logout");
          this.$router.push("/login");
        })
        .catch((e) => {
          console.log(e);
        });
    },

    // l'Utilisateur peut modifier son compte
    modifyUser() {
      UserDataService.update(this.currentUser.id, this.currentUser)
        .then(() => {
          this.$store.dispatch("auth/update", this.currentUser);
          localStorage.setItem("users", JSON.stringify(this.currentUser));
          this.$router.push("/users");
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>