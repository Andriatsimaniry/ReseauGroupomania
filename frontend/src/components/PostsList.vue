<!-- Liste de toutes les Publications -->
<template>
  <div class="list row">
    <CreatePost @newPost="retrievePosts" />

    <div class="col-12">
      <h4>Liste des Publications</h4>
      <div class="post-list-container">
        <div class="post-container my-4" v-for="post in posts" :key="post.id">
          <Post @refreshList="retrievePosts" :post="post" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PostDataService from "../services/PostDataService";
import CreatePost from "./CreatePost";
import Post from "./Post";
import { onMounted, ref } from "vue";
import EventBus from "../common/EventBus";

export default {
  name: "posts-list",
  components: {
    CreatePost,
    Post,
  },
  setup() {
    //Retourner une fonction de rendu ,utiliser l'état réactif déclaré.
    let posts = ref([]); //Pour être reactive; tableau vide.
    const retrievePosts = function () {
      // Fonction pour récupérer toutes les publications
      PostDataService.getAll()
        .then((response) => {
          posts.value = response.data;
          posts.value = posts.value.sort(function (a, b) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }); //Pour mettre la dernière publication de l'utilisateur au dessus
          console.log("reponse find all", posts.value);
        })
        .catch((e) => {
          if (e.response && e.response.status === 401) { 
            EventBus.dispatch("logout");// Revenir au login après expiration Token
          }
        });
    };

    onMounted(retrievePosts); //Appelé après que l'instance à été monté

    return {
      retrievePosts,
      posts,
    };
  },
};
</script>

<style>
.list {
  text-align: left;
  max-width: 750px;
  margin: auto;
}
.post-container {
  border: 1px solid #838181;
  border-radius: 3px;
}
</style>