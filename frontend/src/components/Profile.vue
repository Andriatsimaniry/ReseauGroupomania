<!-- Profil de l' utilisateur -->
<template>
  <div class="container">
    <header class="jumbotron">
      <img
        class="right floated mini ui image"
        src="https://www.gravatar.com/avatar/default?s=200&r=pg&d=mm"
      />
      <h3>
        <strong>Bienvenue : {{ currentUser.username }}</strong>
      </h3>

      <div>
        <strong>
          <label for="email">Email: {{ currentUser.email }}</label>
        </strong>
      </div>
      <strong>Autorité:</strong>
      <ul>
        <li v-for="role in currentUser.roles" :key="role">{{ role }}</li>
      </ul>
      <div v-if="modifying">
        <div class="form-group">
          <strong>
            <label for="password">Ancien mot de passe: </label>
          </strong>
          <input
            :type="oldPasswordFieldType"
            name="password"
            v-model="motDePasseObj.oldPassword"
          />
          <button @click="switchVisibility('old')">show / hide</button>
        </div>
        <div class="form-group">
          <strong>
            <label for="password">Nouveau mot de passe: </label>
          </strong>
          <input
            :type="newPasswordFieldType"
            name="password"
            v-model="motDePasseObj.newPassword"
          />
          <button @click="switchVisibility('new')">show / hide</button>
        </div>
        <div class="form-group">
          <strong>
            <label for="password">Confirmer mot de passe: </label>
          </strong>
          <input
            :type="newPasswordConfirmFieldType"
            name="password"
            v-model="motDePasseObj.newPasswordConfirm"
          />
          <button @click="switchVisibility('confirm')">show / hide</button>
        </div>
        <span style="color: red">{{ errorMessage }}</span>
      </div>

      <div class="d-flex mt-4">
        <button
          v-if="isNotAdmin"
          class="btn btn-danger btn-sm mr-2"
          @click="deleteUser"
        >
          Supprimer le Compte
        </button>
        <button
          v-if="!modifying"
          type="submit"
          class="btn btn-success btn-sm"
          @click="modifying = true"
        >
          Modifier le mot de passe
        </button>
        <button
          v-if="modifying"
          type="submit"
          class="btn btn-success btn-sm"
          @click="updatePassword"
        >
          Confirmer
        </button>
        <button
          v-if="modifying"
          type="submit"
          class="btn btn-danger btn-sm"
          @click="modifying = false"
        >
          Annuler
        </button>
      </div>
    </header>
    <div class="col-12">
      <h4>Liste de vos Publications</h4>
      <div class="post-list-container">
        <div class="post-container my-4" v-for="post in posts" :key="post.id">
          <Post @refreshList="retrievePost" :post="post" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UserDataService from "../services/userDataService";
import PostDataService from "../services/PostDataService";
import { onMounted, ref, reactive } from "vue";
import Post from "./Post";
import EventBus from "../common/EventBus";
export default {
  name: "Profile",
  components: {
    Post,
  },
  setup() {
    const currentUser = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null;

    let motDePasseObj = reactive({
      oldPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
    });

    let oldPasswordFieldType = ref("password");
    let newPasswordFieldType = ref("password");
    let newPasswordConfirmFieldType = ref("password");

    let errorMessage = ref("");

    let posts = ref([]); //Pour être reactive; tableau vide.
    const isNotAdmin = !currentUser.roles.includes("ROLE_ADMIN");

    // Fonction pour récupérer  les publications d'un utilisateur
    const retrievePosts = function () {
      PostDataService.getPostsByUser(currentUser.id)
        .then((response) => {
          posts.value = response.data;
          //Pour mettre la dernière publication de l'utilisateur au dessus
          posts.value = posts.value.sort(function (a, b) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
          console.log("reponse find all", posts.value);
        })
        .catch((e) => {
          if (e.response && e.response.status === 401) {
            EventBus.dispatch("logout"); // Revenir au login après expiration Token
          }
        });
    };

    // L'utilisateur peut supprimer son compte

    const deleteUser = function () {
      UserDataService.delete(this.currentUser.id)
        .then(() => {
          console.log("supprime");
          // this.$store.dispatch("auth/logout");
          EventBus.dispatch("logout");
        })
        .catch((err) => {
          console.log(err);
        });
    };

    // l'Utilisateur peut modifier son mot de passe
    let modifying = ref(false);

    const updatePassword = function () {
      UserDataService.updatePassword(this.currentUser.id, motDePasseObj)
        .then((res) => {
          if (res?.data?.error) {
            errorMessage.value = res.data.error;
          } else if (res?.data?.message) {
            modifying.value = false;
            errorMessage.value = "";
            motDePasseObj.oldPassword = "";
            motDePasseObj.newPassword = "";
            motDePasseObj.newPasswordConfirm = "";
            EventBus.dispatch("logout");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    };

    const switchVisibility = function (value) {
      switch (value) {
        case "old":
          oldPasswordFieldType.value =
            oldPasswordFieldType.value === "password" ? "text" : "password";
          break;
        case "new":
          newPasswordFieldType.value =
            newPasswordFieldType.value === "password" ? "text" : "password";
          break;
        case "confirm":
          newPasswordConfirmFieldType.value =
            newPasswordConfirmFieldType.value === "password"
              ? "text"
              : "password";
          break;
      }
    };

    onMounted(retrievePosts); //Appelé après que l'instance à été monté
    return {
      retrievePosts,
      posts,
      isNotAdmin,
      currentUser,
      deleteUser,
      updatePassword,
      modifying,
      switchVisibility,
      motDePasseObj,
      oldPasswordFieldType,
      newPasswordFieldType,
      newPasswordConfirmFieldType,
      errorMessage,
    };
  },
};
</script>
<style scoped>
ul {
  list-style-type: none;
}
</style>