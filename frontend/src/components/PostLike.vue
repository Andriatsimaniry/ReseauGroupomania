<template>
  <div id="PostLike">
    <vue-like-dislike-buttons
      :likes="likes"
      :dislikes="dislikes"
      :likeChecked="likeChecked"
      :dislikeChecked="dislikeChecked"
      @like="like"
      @dislike="dislike"
    />
  </div>
</template>

<script>
import VueLikeDislikeButtons from "vue-like-dislike-buttons";

export default {
  name: "PostLike",
  components: {
    VueLikeDislikeButtons
  },
  data() {
    return {
      likes:0,
      dislikes: 0,
      likeChecked: false,
      dislikeChecked: false
    };
  },
  methods: {
    like() {
      this.likes += 1;
    },
    dislike() {
      this.dislikes += 1;
    }
  }
};
</script>

<style>
#PostLike {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
