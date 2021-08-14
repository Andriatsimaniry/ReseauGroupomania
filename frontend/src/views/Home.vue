<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <CreateUser />
    <Users />
    
  </div>
</template>

<script>
// @ is an alias to /src

import CreateUser from '@/components/CreateUser.vue'
import Users from '@/components/Users.vue'
export default {
  name: 'Home', 
  components: {
     CreateUser, 
     Users
  }
}
</script>
