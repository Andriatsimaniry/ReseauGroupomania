<template>
  <div class="list row">
    <div class="col-12">
      <h4>Liste des utilisateurs</h4>
      <ul class="list-group">
        <li class="list-group-item"
          v-for="user in users"
          :key="user.id"
        >
          <UserCard @refreshList="retrieveUsers" :user="user" />
        </li>
      </ul>
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
</style>