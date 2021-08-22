<!--  Liste de tous les Utilisateurs       -->

<template>
  <div class="list row">
    <div class="col-12">
      <h4>Liste des utilisateurs</h4>
      <div class="user-list-container">
        <div class="user-card my-2 p-2"
          v-for="user in users"
          :key="user.id"
        >
          <UserCard @refreshList="retrieveUsers" :user="user" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UserDataService from "../services/userDataService";
import UserCard from "./UserCard";
import { onMounted, ref } from "vue";

export default {
  name: "posts-list",
  components: {
    UserCard
  },
  setup() {
    let users = ref([]);
    const retrieveUsers = function() {
      UserDataService.getAll()
        .then(response => {
          users.value = response.data;
          console.log('REFRESH LIST §!!!!!!!!!!', users.value);
        })
        .catch(e => {
          console.log(e);
        });
    };

    onMounted(retrieveUsers);

    return {
      retrieveUsers,
      users
    }
  }
};
</script>

<style>
.list {
  text-align: left;
  max-width: 750px;
  margin: auto;
}
.user-card {
  border: 1px solid lightgray;
  border-radius: 3px;
}
</style>