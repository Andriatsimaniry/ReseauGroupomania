<template>
  <div class="post">
    <div class="post-header d-flex justify-content-between px-2 py-1">
      <span><strong>{{ currentPost.username }}</strong></span>
      <span class="date-creation">Créé le : {{ currentPost.createdAt }}</span>
    </div>

    <div class="d-flex  p-2">
      <div class="w-100" v-if="modifying">
        <textarea
          rows="5"
          class="w-100"
          name="modifiedText"
          v-model="currentPost.post"
        />
      </div>
      <div v-if="!modifying">{{ currentPost.post }}</div>
    </div>

    <div class="d-flex buttons-container p-2 justify-content-end">
      <button
        class="btn btn-danger mr-2 btn-sm"
        @click="deletePost"
        v-if="isEditable()"
      >
        Supprimer
      </button>
      <button
        v-if="!modifying && isEditable()"
        type="submit"
        class="btn btn-success btn-sm"
        @click="modifying = true"
      >
        Modifier
      </button>
      <button
        v-if="modifying && isEditable()"
        type="submit"
        class="btn btn-success mr-2 btn-sm"
        @click="updatePost"
      >
        Confirmer
      </button>
      <button
        v-if="modifying && isEditable()"
        type="submit"
        class="btn btn-danger btn-sm"
        @click="modifying = false"
      >
        Annuler
      </button>
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
<style scoped>
  .date-creation {
    color: gray;
    font-size: 12px;
  }
  .post-header {
    background-color: #ffd7d7;
  }
</style>  

