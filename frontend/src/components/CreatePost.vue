<!-- Création de la Publication -->
<template>
  <div class="create-post-container col-12">
    <h3>Créez votre publication :</h3>
    <div class="form-group">
      <div v-if="imgPost.previewImage">
        <div>
          <img class="preview my-3" :src="imgPost.previewImage" alt="" />
        </div>
      </div>
      <textarea
        class="form-control mb-3"
        id="newPost"
        required
        v-model="userPost.post"
        name="newPost"
        rows="3"
      ></textarea>
      <div class="d-flex justify-content-between">
        <label class="btn btn-default p-0">
          <input
            type="file"
            accept="image/*"
            ref="fileInput"
            @change="selectImage"
          />
        </label>
        <button
          @click="savePost"
          :disabled="userPost.post == ''"
          class="btn btn-success"
        >
          Publier
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from "@vue/reactivity";
import PostDataService from "../services/PostDataService";
import UploadService from "../services/UploadFilesService";

export default {
  name: "create-post",
  setup(props, context) {
    const user = localStorage.getItem("user");
    const userId = user ? JSON.parse(user).id : null;
    const roles = user ? JSON.parse(user).roles.toString() : "";

    let fileInput = ref(null);

    let userPost = reactive({
      post: "",
      userId,
      img: null,
      roles,
    });

    let imgPost = reactive({
      currentImage: undefined,
      previewImage: undefined,
      message: "",
      imageInfos: [],
    });

    const savePost = function () {
      // Rajouter la publication actuelle dans la liste de toutes les publications
      // first upload file if any
      if (imgPost.currentImage) {
        UploadService.upload(imgPost.currentImage)
          .then((response) => {
            userPost.img = response.data.imgUrl;
            return PostDataService.create(userPost);
          })
          .then(() => {
            // vider  le contenu  de la publication courrante
            userPost.post = "";
            userPost.img = null;
            imgPost.currentImage = undefined;
            imgPost.previewImage = undefined;
            imgPost.message = "";
            imgPost.imageInfos = [];
            fileInput.value.value = "";
            context.emit("newPost");
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        PostDataService.create(userPost)
          .then(() => {
            // vider  le contenu  de la publication courrante
            userPost.post = "";
            context.emit("newPost");
          })
          .catch((e) => {
            console.log(e);
          });
      }
    };

    const selectImage = function () {
      imgPost.currentImage = fileInput.value.files.item(0);
      imgPost.previewImage = URL.createObjectURL(imgPost.currentImage);
      imgPost.message = "";
    };

    const upload = function () {
      UploadService.upload(imgPost.currentImage)
        .then((response) => {
          imgPost.message = response.data.message;
          return UploadService.getFiles();
        })
        .then((images) => {
          imgPost.imageInfos = images.data;
        })
        .catch((err) => {
          imgPost.message = "Impossible de télécharger l'image ! " + err;
          imgPost.currentImage = undefined;
        });
    };

    return {
      // Pour pouvoir accessible au template
      savePost,
      selectImage,
      upload,
      userPost,
      imgPost,
      fileInput,
    };
  },
};
</script>

<style>
.submit-form {
  max-width: 300px;
  margin: auto;
}
.preview {
  max-width: 200px;
}
</style>    