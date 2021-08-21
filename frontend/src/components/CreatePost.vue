<template>
  <div class="create-post-container col-12">
    <h3>Creer votre post :</h3>
    <div class="form-group">
      <textarea
        class="form-control mb-3"
        id="newPost"
        required
        v-model="userPost.post"
        name="newPost"
        rows="3"
      ></textarea>
      <div class="d-flex justify-content-end">
        <button @click="savePost" class="btn btn-success">Poster</button>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from '@vue/reactivity';
import PostDataService from "../services/PostDataService";

export default {
  name: "create-post",
  setup(props, context) {
    const user = localStorage.getItem('user'); 
    const username = user ? JSON.parse(user).username : 'anonymous';
    const roles = user ? JSON.parse(user).roles.toString() : '[]';

    let userPost = reactive({
      post: '',
      username,
      roles
    });

    const savePost = function () {
      PostDataService.create(userPost)
        .then((response) => {
          userPost.post = '';
          console.log(response.data);
          context.emit("newPost");
        })
        .catch((e) => {
          console.log(e);
        });
    };

    return {
      savePost,
      userPost
    };
  },
};
</script>

<style>
.submit-form {
  max-width: 300px;
  margin: auto;
}
</style>    