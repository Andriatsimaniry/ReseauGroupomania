<!-- Liste de toutes les Publications -->
<template>
  <div class="list row">

    <CreatePost @newPost="retrievePosts"/>

    <div class="col-12">
      <h4>Liste des Publications</h4>
      <ul class="list-group">
        <li class="list-group-item"
          v-for="post in posts"
          :key="post.id"
        >
          <Post @refreshList="retrievePosts" :post="post" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import PostDataService from "../services/PostDataService";
import CreatePost from "./CreatePost";
import Post from "./Post";
import { onMounted, ref } from "vue";

export default {
  name: "posts-list",
  components: {
    CreatePost,
    Post
  },
  setup() { //Retourner une fonction de rendu ,utiliser l'état réactif déclaré.
    let posts = ref([]);  //Pour être reactive; tableau vide.
    const retrievePosts = function() { // Fonction pour récupérer toutes les publications
      PostDataService.getAll()
        .then(response => {
          posts.value = response.data;
          posts.value = posts.value.reverse(); //Pour mettre la dernière publication de l'utilisateur au dessus
          console.log('reponse find all', posts.value);
        })
        .catch(e => {
          console.log(e);
        });
    };

    onMounted(retrievePosts); //Appelé après que l'instance à été monté

    return {
      retrievePosts,
      posts
    }
  }
};
</script>

<style>
.list {
  text-align: left;
  max-width: 750px;
  margin: auto;
}
</style>