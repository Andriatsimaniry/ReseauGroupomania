<template>
  <div class="post">
    <div class="post-header d-flex justify-content-between px-2 py-1">
      <span
        ><strong>{{ currentPost.user.username }}</strong></span
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
      <font-awesome-icon  v-if="!isEditable()" class="mr-3 thumbs-up" icon="thumbs-up" @click="reaction(1)"/>
      <font-awesome-icon  v-if="!isEditable()" class="mr-3 thumbs-down" icon="thumbs-down" @click="reaction(-1)"/>
      <button
        v-if="modifying && isEditable()"
        type="submit"
        class="btn btn-success mr-2 btn-sm"
        @click="UploadImage"
      >
      <upload-image>Ajouter une image</upload-image>
        
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
    <div
      class="comment-container my-1 mx-3"
      v-for="comment in comments"
      :key="comment.id"
    >
      <Comment @refreshComment="retrieveComments" :comment="comment" />
    </div>
    <div class="comment-section d-flex flex-grow-1">
      <textarea id="newComment" class="flex-grow-1" placeholder="Entrez votre commentaire ici." rows=1 v-model="userComment.content"></textarea>
      <button class="comment-button" @click="commenter">Envoyer</button>
    </div>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from "vue";
import PostDataService from "../services/PostDataService";
import CommentService from "../services/comment.service";
import Comment from "./Comment.vue";
import UploadImage from "./UploadImage";


export default {
  name: "post",
  components: {
    Comment,
    UploadImage
  },
  
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
       upload: {
        type: ImageData,
        required: true,
      },
    },
  },
  setup(props, context) {
    const currentPost = reactive(props.post);
    let comments = ref([]); 

    const currentUser = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null;
    let modifying = ref(false);

    let userComment = reactive({
      postId: currentPost.id,
      userId: currentUser.id,
      content: ''
    });

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

    const commenter = function() {
      CommentService.create(currentPost.id, userComment)
      .then(() => {
          // vide  le contenu  du commentaire courrant
          userComment.content = '';
          retrieveComments();
        })
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

    const UploadImage = function() {
      PostDataService.UploadImage(currentPost.id, currentPost)
        .then(() => {})
        .catch((e) => {
          console.log(e);
        });
    }

    const retrieveComments = function() { // Fonction pour récupérer toutes les publications
      CommentService.getAll(currentPost.id)
        .then(response => {
          comments.value = response.data;
           //Pour mettre le dernier commentaire de l'utilisateur en dessous
          comments.value = comments.value.sort(
            function(a,b){
              return new Date(a.createdAt) - new Date(b.createdAt);
            });
          console.log('reponse find all comments', comments.value);
        })
        .catch(e => {
          console.log(e);
        });
    };

    onMounted(retrieveComments); //Appelé après que l'instance à été monté

    return {
      currentPost,
      userComment,
      comments,
      deletePost,
      updatePost,
      modifying,
      isEditable,
      getDateUtc,
      reaction,
      UploadImage,
      commenter,
      retrieveComments
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
.comment-section{
  border: 1px lightgray solid;
  margin: 1rem;
  border-radius: 16px;
  padding: 0 12px;
}
textarea {
   resize: none;
   border: none;
}
textarea:focus-visible{
  outline: none;
}
.comment-button{
  background-color: transparent;
  border: none;
  color: green;
}
.comment-button:hover{
  color: darkgreen;
}

</style>  

