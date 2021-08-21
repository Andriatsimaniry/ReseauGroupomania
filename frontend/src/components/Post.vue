<template>
  <div class="post-container">
    <div>
      <div>user: {{ currentPost.username }}</div>
      <div v-if="modifying">
        <input name="modifiedText" v-model="currentPost.post" />
      </div>
      <div v-if="!modifying">{{ currentPost.post }}</div>
    </div>

    <div class="d-flex justify-content-between mt-4">
      <span class="date-creation">Créé le : {{ currentPost.createdAt }}</span>

      <div class="d-flex buttons-container">
        <button class="badge badge-danger mr-2" @click="deletePost">
          Supprimer
        </button>
        <button
          v-if="!modifying"
          type="submit"
          class="badge badge-success"
          @click="modifying = true"
        >
          Modifier
        </button>
        <button
          v-if="modifying"
          type="submit"
          class="badge badge-success"
          @click="updatePost"
        >
          Confirmer
        </button>
        <button
          v-if="modifying"
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
      description: {
        type: String,
        required: true,
      },
      id: {
        type: Number,
        required: true,
      },
      published: {
        type: Boolean,
        required: true,
      },
      title: {
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
        .then((response) => {
          console.log(response.data);
          this.message = "Le Post a été mise à jour avec succès!";
        })
        .catch((e) => {
          console.log(e);
        });
    };

    return {
      currentPost,
      deletePost,
      updatePost,
      modifying,
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

