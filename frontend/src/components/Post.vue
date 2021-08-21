<template>
  <div class="post-container">
    <div>
      <div>user: {{ currentPost.username }}</div>
      <div v-if="modifying">
        <textarea rows="5" class="w-100" name="modifiedText" v-model="currentPost.post" />
      </div>
      <div v-if="!modifying">{{ currentPost.post }}</div>
    </div>

    <div class="d-flex justify-content-between mt-4">
      <span class="date-creation">Créé le : {{ currentPost.createdAt }}</span>

      <div class="d-flex buttons-container">
        <button
          class="badge badge-danger mr-2"
          @click="deletePost"
          v-if="isEditable()"
        >
          Supprimer
        </button>
        <button
          v-if="!modifying && isEditable()"
          type="submit"
          class="badge badge-success"
          @click="modifying = true"
        >
          Modifier
        </button>
        <button
          v-if="modifying && isEditable()"
          type="submit"
          class="badge badge-success"
          @click="updatePost"
        >
          Confirmer
        </button>
        <button
          v-if="modifying && isEditable()"
          type="submit"
          class="badge badge-danger"
          @click="modifying = false"
        >
          Annuler
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from "vue";
import PostDataService from "../services/PostDataService";

export default {
  name: "post",
  props: {
    post: {
      createdAt: {
        type: String,
        required: true,
      },
      post: {
        type: String,
        required: true,
      },
      id: {
        type: Number,
        required: true,
      },
      roles: {
        type: Boolean,
        required: true,
      },
      username: {
        type: String,
        required: true,
      },
      updatedAt: {
        type: String,
        required: true,
      },
    },
  },
  setup(props, context) {
    const currentPost = reactive(props.post);
    const currentUser = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null;
    let modifying = ref(false);

    const deletePost = function () {
      PostDataService.delete(currentPost.id)
        .then((response) => {
          console.log(response.data);
          context.emit("refreshList");
        })
        .catch((e) => {
          console.log(e);
        });
    };

    const updatePost = function () {
      modifying.value = false;
      PostDataService.update(currentPost.id, currentPost)
        .then(() => {})
        .catch((e) => {
          console.log(e);
        });
    };

    const isEditable = function () {
      let isEditable = false;
      if (
        currentUser.username === currentPost.username ||
        currentUser.roles.includes("ROLE_ADMIN")
      ) {
        isEditable = true;
      }
      return isEditable;
    };

    return {
      currentPost,
      deletePost,
      updatePost,
      modifying,
      isEditable,
    };
  },
};
</script>
   <style>
.date-creation {
  color: lightgray;
  font-size: 12px;
}
</style>  

