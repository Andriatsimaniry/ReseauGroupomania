<!-- Les cartes de vues des utilisateurs -->
<template>
  <div class="user-card-container">
    <div>
        <div>
          <span>Username : </span>
          <span v-if="!modifying">{{ currentUser.username }}</span>
          <span v-if="modifying"><input name="modifiedText" v-model="currentUser.username" /></span>
        </div>
        <div>
          <span>Email : </span>
          <span v-if="!modifying">{{ currentUser.email }}</span>
          <span v-if="modifying"><input name="modifiedText" v-model="currentUser.email" /></span>
        </div>
    </div>

    <div class="d-flex justify-content-between mt-4">
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
        type: Boolean,
        required: true,
      },
      email: {
        type: String,
        required: true,
      }
    },
  },
  setup(props, context) {
    const currentUser = reactive(props.user);
    let modifying = ref(false);

    const deletePost = function () {
      UserDataService.delete(currentUser.id)
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
      UserDataService.update(currentUser.id, currentUser)
        .then(() => {
        })
        .catch((e) => {
          console.log(e);
        });
    };

    return {
      currentUser,
      deletePost,
      updatePost,
      modifying
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

