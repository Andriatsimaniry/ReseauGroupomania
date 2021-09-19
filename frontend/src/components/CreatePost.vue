<!-- Création de la Publication -->
<template>
  <div class="create-post-container col-12">
    <h3>Créer votre publication :</h3>
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
        <!-- on écoute l'évenement click qui est emis la publication / désactiver si c'est vide -->
         <button
        type="submit"
        class="btn btn-success mr-2 btn-sm"
        @click="telecharge"
      >
        Ajouter un Fichier
      </button>
        <button @click="savePost" :disabled="userPost.post == ''" class="btn btn-success">Publier</button>
        
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
    const userId = user ? JSON.parse(user).id : null;
    const roles = user ? JSON.parse(user).roles.toString() : '';
    
    let userPost = reactive({
      post: '',
      userId,
      roles,
      like: 0
    });

    const savePost = function () {  // Rajouter la publication actuelle dans la liste de toutes les publications
      PostDataService.create(userPost)
        .then(() => {
          // vide  le contenu  de la publication courrante
          userPost.post = '';
          context.emit("newPost");
        })
        .catch((e) => {
          console.log(e);
        });
    };

    return {  // Pour pouvoir accessible au template 
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