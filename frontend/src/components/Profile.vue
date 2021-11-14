<!-- Profil de l' utilisateur -->
<template>
  <div class="container">
    <header class="jumbotron">
      <h3>
        <strong>Bienvenue : {{ currentUser.username }}</strong>
      </h3>

      <div>
        <strong>
          <label for="email">Email: {{ currentUser.email }}</label>
        </strong>
      </div>
      <div>
        <strong>
          <label for="password"
            >Ancien mot de passe: {{ currentUser.password }}</label
          >
        </strong>
        <input class="ml-4" name="password" v-model="currentUser.password" />
      </div>

      <div>
        <strong>
          <label for="password"
            >Nouveau mot de passe: {{ currentUser.password }}</label
          >
        </strong>
        <input class="ml-4" name="password" v-model="currentUser.password" />
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
          this.$store.dispatch("auth/logout");
          this.$router.push("/login");
        })
        .catch((e) => {
          console.log(e);
        });
    };
    // l'Utilisateur peut modifier son compte
let modifying = ref(false);
    const updateUser = function () {
      modifying.value = false;
      UserDataService.update(this.currentUser.id, this.currentUser)
        .then(() => {
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
    };
//     logout () {
//     localStorage.removeItem('accessToken')

//     this.$router.push('/login')
// }
  },
};
</script>