<!-- Profil de l' utilisateur -->
<template>
  <div class="container">
    <header class="jumbotron">
      <img
        class="right floated mini ui image"
        src="https://www.gravatar.com/avatar/default?s=200&r=pg&d=mm"
      />
      <h3>
        <strong>Bienvenue : {{ currentUser.username }}</strong>
      </h3>

      <div>
        <strong>
          <label for="email">Email: {{ currentUser.email }}</label>
        </strong>
      </div>
      <strong>Autorité:</strong>
      <ul>
        <li v-for="role in currentUser.roles" :key="role">{{ role }}</li>
      </ul>
      <div class="form-group" v-if="modifying">
        <div class="d-flex mt-4">
          <label for="password">Ancien mot de Passe :  {{ oldPassword }}</label>
          <input
            :type="passwordFieldType"
            name="password"
            v-model="oldPassword"
            placeholder="Ancien mot de passe"
          />
          <button type="password" @click="switchVisibility">show / hide</button>
        </div>
        <div class="d-flex mt-4">
          <label for="newPassword">Nouveau mot de passe :  {{ newPassword }}
            
          </label>
          <input
            type="password"
            v-model="newPassword"
            placeholder="Nouveau mot de passe"
          />
        </div>
        <div class="d-flex mt-4">
          <label for="password">Confirmation :  {{ newPasswordConfirm }}</label>
          <input
            type="password"
            name="newPasswordConfirm"
            v-model="newPasswordConfirm"
            placeholder="Confirmez le nouveau mot de passe"
          />
        </div>
      </div>

      <div class="d-flex mt-4">
        <button
          v-if="isNotAdmin"
          class="btn btn-danger btn-sm mr-2"
          @click="deleteUser"
        >
          Supprimer le Compte
        </button>
        <button
          v-if="!modifying"
          type="submit"
          class="btn btn-success btn-sm"
          @click="modifying = true"
        >
          Modifier le mot de passe
        </button>
        <button
          v-if="modifying"
          type="submit"
          class="btn btn-success btn-sm"
          @click="updateUser"
        >
          Confirmer
        </button>
        <button
          v-if="modifying"
          type="submit"
          class="btn btn-danger btn-sm"
          @click="modifying = false"
        >
          Annuler
        </button>
      </div>
    </header>
    <div class="col-12">
      <h4>Liste de vos Publications</h4>
      <div class="post-list-container">
        <div class="post-container my-4" v-for="post in posts" :key="post.id">
          <Post @refreshList="retrievePost" :post="post" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UserDataService from "../services/userDataService";
import PostDataService from "../services/PostDataService";
import { onMounted, ref } from "vue";
import Post from "./Post";
import EventBus from "../common/EventBus";
export default {
  name: "Profile",
  components: {
    Post,
  },
  setup() {
    const currentUser = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null;

    let posts = ref([]); //Pour être reactive; tableau vide.
    const isNotAdmin = !currentUser.roles.includes("ROLE_ADMIN");

    // Fonction pour récupérer  les publications d'un utilisateur
    const retrievePosts = function () {
      PostDataService.getPostsByUser(currentUser.id)
        .then((response) => {
          posts.value = response.data;
          posts.value = posts.value.sort(function (a, b) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }); //Pour mettre la dernière publication de l'utilisateur au dessus
          console.log("reponse find all", posts.value);
        })
        .catch((e) => {
          if (e.response && e.response.status === 401) {
            EventBus.dispatch("logout"); // Revenir au login après expiration Token
          }
        });
    };

    // L'utilisateur peut supprimer son compte

    const deleteUser = function () {
      UserDataService.delete(this.currentUser.id)
        .then(() => {
          console.log("supprime");
          // this.$store.dispatch("auth/logout");
          EventBus.dispatch("logout");
        })
        .catch((err) => {
          console.log(err);
        });
    };

    let password = ref("");
    let passwordFieldType = ref("currentUser.password");
    const switchVisibility = () =>
      (passwordFieldType.value =
        passwordFieldType.value === "password" ? "text" : "password");

    // l'Utilisateur peut modifier son mot de passe
    let modifying = ref(false);
    const updateUser = function () {
      modifying.value = false;

      UserDataService.update(this.currentUser.id)

        .then(() => {
          password.value = currentUser.password;
          this.$store.dispatch("auth/update", this.currentUser);
          localStorage.setItem("users", JSON.stringify(this.currentUser));
          this.$router.push("/users");
        })
        .catch((e) => {
          console.log(e);
        });
    };
    onMounted(retrievePosts); //Appelé après que l'instance à été monté
    return {
      retrievePosts,
      posts,
      isNotAdmin,
      currentUser,
      deleteUser,
      updateUser,
      modifying,
      password,
      passwordFieldType,
      switchVisibility,
    };
  },
};
</script>
<style scoped>
ul {
  list-style-type: none;
}
</style>