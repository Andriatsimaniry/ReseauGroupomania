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
      <div>
        <span>Ancien mot de passe : </span>
        <!-- <span v-if="modifying"</span> -->
          <input name="password" v-model="currentUser.password"
        />
      </div>
      <div>
        <span>Nouveau mot de passe : </span>
        <!-- <span v-if="!modifying">{{ currentUser.password }}</span>
        <span v-if="modifying"></span> -->
          <input class="ml-4" name="password" v-model="currentUser.password" />
        
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
        <button
          v-if="!modifying"
          type="submit"
          class="btn btn-success btn-sm"
          @click="modifying = true"
        >
          Modifier
        </button>
        <button
          v-if="modifying"
          type="submit"
          class="btn btn-success btn-sm"
          @click="updateUser"
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
    </div>
  </div>
</template>

<script>
import { reactive, ref } from "vue";
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
    let modifying = ref(false);

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

    const updateUser = function () {
      modifying.value = false;
      UserDataService.update(currentUser.id, currentUser)
        .then(() => {})
        .catch((e) => {
          console.log(e);
        });
    };

    return {
      currentUser,
      deleteUser,
      updateUser,
      modifying,
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

