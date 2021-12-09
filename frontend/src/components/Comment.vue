<!-- Commentaire -->
<template>
  <div class="comment">
    <div class="comment-header d-flex justify-content-between px-2 py-1">
      <span>
        <strong>{{ currentComment.user.username }}</strong>
      </span>
      <span class="date-creation"
        >Créé le : {{ getDateUtc(currentComment.createdAt) }}</span
      >
    </div>

    <div class="d-flex p-2">
      <div class="w-100" v-if="modifying">
        <textarea
          rows="5"
          class="w-100"
          name="modifiedText"
          v-model="currentComment.content"
        />
      </div>
      <div v-if="!modifying">{{ currentComment.content }}</div>
    </div>

    <div
      class="
        d-flex
        buttons-container
        align-items-center
        p-2
        justify-content-end
      "
    >
      <button
        class="btn btn-danger mr-2 btn-sm"
        @click="deleteComment"
        v-if="isEditable(currentComment.user)"
      >
        Supprimer
      </button>
      <button
        v-if="!modifying && isEditable(currentComment.user)"
        type="submit"
        class="btn btn-success btn-sm"
        @click="modifying = true"
      >
        Modifier
      </button>
      <button
        v-if="modifying && isEditable(currentComment.user)"
        type="submit"
        class="btn btn-success mr-2 btn-sm"
        @click="updateComment"
      >
        Confirmer
      </button>
      <button
        v-if="modifying && isEditable(currentComment.user)"
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
import { ref, reactive } from "vue";
import CommentService from "../services/comment.service";

export default {
  name: "posts-list",
  props: {
    comment: {
      createdAt: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      id: {
        type: Number,
        required: true,
      },
      user: {
        type: Object,
        required: true,
      },
      postId: {
        type: Number,
        required: true,
      },
      updatedAt: {
        type: String,
        required: true,
      },
    },
  },
  setup(props, context) {
    //Retourner une fonction de rendu ,utiliser l'état réactif déclaré.
    const currentComment = reactive(props.comment);
    const currentUser = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null;
    let modifying = ref(false);

    const isEditable = function (commentUser) {
      let isEditable = false;
      if (
        currentUser.id === commentUser.id ||
        currentUser.roles.includes("ROLE_ADMIN")
      ) {
        isEditable = true;
      }
      return isEditable;
    };

    const getDateUtc = function (dateString) {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      return new Date(dateString).toLocaleDateString("fr-FR", options);
    };

    const deleteComment = function () {
      CommentService.delete(currentComment.postId, currentComment.id)
        .then((response) => {
          console.log(response.data);
          context.emit("refreshComment");
        })
        .catch((e) => {
          console.log(e);
        });
    };

    const updateComment = function () {
      modifying.value = false;
      CommentService.update(
        currentComment.postId,
        currentComment.id,
        currentComment
      )
        .then(() => {})
        .catch((e) => {
          console.log(e);
        });
    };

    return {
      isEditable,
      getDateUtc,
      updateComment,
      deleteComment,
      modifying,
      currentComment,
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
.comment-container {
  border: 1px solid #838181;
  border-radius: 3px;
}
.date-creation {
  color:#000;
  font-size: 12px;
}
.comment-header {
  background-color: #ffd7d7;
}
.thumbs-down {
  color: red;
}
.thumbs-up {
  color: green;
}
.btn-danger {
  background-color: #A72532 !important;
}
.btn-success {
  background-color: #1A612A !important;
}
.comment-button{
  color: #1A612A !important;

}
</style>