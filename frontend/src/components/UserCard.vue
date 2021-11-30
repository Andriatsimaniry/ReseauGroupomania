<!-- Les cartes de vues des utilisateurs -->
<template>
  <div
    class="
      user-card-container
      d-flex
      justify-content-between
      align-items-center
    "
  >
    <div>
      <div>
        <span>Nom d'utilisateur : {{ currentUser.username }} </span>
      </div>
      <div>
        <span>E-mail : {{ currentUser.email }} </span>
      </div>
    </div>
    <div class="d-flex justify-content-between">
      <div class="d-flex buttons-container">
        <button
          v-if="isNotAdmin"
          class="btn btn-danger btn-sm mr-2"
          @click="deleteUser"
        >
          Supprimer
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from "vue";
import UserDataService from "../services/userDataService";

export default {
  name: "user",
  props: {
    user: {
      username: {
        type: String,
        required: true,
      },
      id: {
        type: Number,
        required: true,
      },
      roles: {
        type: Array,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
  },
  setup(props, context) {
    const currentUser = reactive(props.user);
    const isNotAdmin = !currentUser.roles.find((role) => {
      //Si l'utilisateur est administrateur on enleve supprimer
      return role.name === "admin";
    });
    function deleteUser() {
      UserDataService.delete(currentUser.id)
        .then((response) => {
          console.log(response.data);
          context.emit("refreshList");
        })
        .catch((e) => {
          console.log(e);
        });
    }
    return {
      currentUser,
      deleteUser,
      isNotAdmin,
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

