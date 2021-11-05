<!-- Profil de l' utilisateur -->
<template>
  <div class="container">
    <header class="jumbotron">
      <h3>
        <strong>Bienvenue : {{ currentUser.username }}</strong>
      </h3>
      
    </header>
    <div>
      <strong>
        <label for="email">Email: {{ currentUser.email }}</label>
      </strong>
    </div>
    <div>
      <strong>
        <label for="password">Nouveau mot de passe: {{ currentUser.password }}</label>
      </strong>
      <input class="ml-4" name="password" v-model="currentUser.password" />
    </div>
     
      <div class="col-12">
      <h4>Liste de vos Publications</h4>
      <div class="post-list-container">
        <div class="post-container my-4" v-for="post in posts" :key="post.id">
          <Post @refreshList="retrievePost" :post="post" />
        </div>
      </div>

    <div class="d-flex mt-4">
      <button  v-if="isNotAdmin" @click="modifyUser" class="btn btn-success">
        Modifier informations
      </button>
      <button  v-if="isNotAdmin" @click="deleteUser" class="btn ml-4 btn-danger">
        Supprimer compte
      </button>
    </div>
  </div>
  </div>
</template>

<script>
import UserDataService from "../services/userDataService";
import PostDataService from "../services/PostDataService";
import { onMounted, ref } from "vue";
import Post from "./Post";
export default {
  name: "Profile",
  components: {
    Post
  },
  
  setup() {
    const currentUser = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
      : null;
    let posts = ref([]); //Pour être reactive; tableau vide.
    const isNotAdmin = !currentUser.roles.includes("ROLE_ADMIN");
    const retrievePosts = function () {
      // Fonction pour récupérer toutes les publications
      PostDataService.getPostsByUser(currentUser.id)
        .then((response) => {
          posts.value = response.data;
          posts.value = posts.value.sort(function (a, b) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }); //Pour mettre la dernière publication de l'utilisateur au dessus
          console.log("reponse find all", posts.value);
        })
        .catch((e) => {
          console.log(e);
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
   const modifyUser = function  () {
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
      modifyUser,
    };
  }
}

</script>