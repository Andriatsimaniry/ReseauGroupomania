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
  setup() {
    let posts = ref([]);  //Pour être reactive; tableau vide
    const retrievePosts = function() {
      PostDataService.getAll()
        .then(response => {
          posts.value = response.data;
          posts.value = posts.value.reverse();
          console.log('reponse find all', posts.value);
        })
        .catch(e => {
          console.log(e);
        });
    };

    onMounted(retrievePosts);

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