<template>
  <div class="post">
    <div class="post-header d-flex justify-content-between px-2 py-1">
      <span
        ><strong>{{ currentPost.username }}</strong></span
      >
      <span class="date-creation">Créé le : {{ getDateUtc() }}</span>
    </div>
    <div class="post-footer d-flex justify-content-between px-2 py-1">
    
    </div>
    <div class="d-flex p-2">
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

    <div class="d-flex buttons-container align-items-center p-2 justify-content-end">
      <font-awesome-icon  v-if="!isEditable()" class="mr-2 thumbs-up" icon="thumbs-up" @click="reaction(1)"/>
      <font-awesome-icon  v-if="!isEditable()" class="mr-2 thumbs-down" icon="thumbs-down" @click="reaction(-1)"/>
       <button
       v-if="!isEditable()"
        type="submit"
        class="btn btn-success mr-2 btn-sm"
        @click="telecharge"
      >
        Répondre
      </button>
      <button
        v-if="modifying && isEditable()"
        type="submit"
        class="btn btn-success mr-2 btn-sm"
        @click="telecharge"
      >
        Ajouter un Fichier
      </button>
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

    const getDateUtc = function() {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',hour: '2-digit',minute:'2-digit',second:'2-digit' };
      return new Date(currentPost.createdAt).toLocaleDateString('fr-FR', options);
    }

    

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
        currentUser.id === currentPost.userId ||
        currentUser.roles.includes("ROLE_ADMIN")
      ) {
        isEditable = true;
      }
      return isEditable;
    };

    const reaction = function(like) {
      PostDataService.reaction(currentPost.id, currentPost, like)
        .then(() => {})
        .catch((e) => {
          console.log(e);
        });
    }

    const telecharge = function() {
      PostDataService.telecharge(currentPost.id, currentPost)
        .then(() => {})
        .catch((e) => {
          console.log(e);
        });
    }

    return {
      currentPost,
      deletePost,
      updatePost,
      modifying,
      isEditable,
      getDateUtc,
      reaction,
      telecharge
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
.thumbs-down{
  color: red;
}
.thumbs-up{
  color: green;
}
</style>  

