<template>
  <div class="d-flex justify-content-center">
    <div class="card card-container col-12 col-sm-6">
      <img id="profile-img" src="../assets/icon-left-font-monochrome-black.png" class="profile-img-card" />
      <Form @submit="handleRegister" :validation-schema="schema">
        <div v-if="!successful">
          <div class="form-group">
            <label for="username">Nom d'utilisateur</label>
            <Field name="username" type="text" class="form-control" />
            <ErrorMessage name="username" class="error-feedback" />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <Field name="email" type="email" class="form-control" />
            <ErrorMessage name="email" class="error-feedback" />
          </div>
          <div class="form-group">
            <label for="password">Mot de passe</label>
            <Field name="password" type="password" class="form-control" />
            <ErrorMessage name="password" class="error-feedback" />
          </div>

          <div class="form-group">
            <button class="btn btn-primary btn-block" :disabled="loading">
              <span
                v-show="loading"
                class="spinner-border spinner-border-sm"
              ></span>
              <p>S'inscrire</p>
            </button>
          </div>
        </div>
      </Form>
      <div
        v-if="message"
        class="alert"
        :class="successful ? 'alert-success' : 'alert-danger'"
      >
        {{ message }}
      </div>
    </div>
  </div>
</template>
<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import EventBus from "../common/EventBus";

export default {
  name: "Register",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const schema = yup.object().shape({
      username: yup // Yup Validation basée sur un schéma
        .string()
        .required("Nom d'utilisateur est nécessaire!")
        .min(3, "Doit comporter au moins 3 caractères !")
        .max(20, "Doit comporter au maximum 20 caractères !"),
      email: yup
        .string()
        .required("L'e-mail est obligatoire !")
        .email("L'email est invalide!")
        .max(50, "Doit contenir au maximum 50 caractères !"),
      password: yup
        .string()
        .required("Mot de passe requis!")
        .min(6, "Doit être au moins 6 caractères!")
        .max(40, "Doit contenir au maximum 40 caractères !"),
    });

    return {
      successful: false,
      loading: false,
      message: "",
      schema,
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  mounted() {
    // Appelé après que l'instance a été montée
    if (this.loggedIn) {
      this.$router.push("/profile");
    }
  },
  methods: {
    handleRegister(user) {
      this.message = "";
      this.successful = false;
      this.loading = true;

      this.$store
        .dispatch("auth/register", user)
        .then(
          (data) => {
            this.message = data.message;
            this.successful = true;
            this.loading = false;
          },
          (error) => {
            this.message =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();
            this.successful = false;
            this.loading = false;
          }
        )
        .catch((e) => {
          if (e.response && e.response.status === 401) {
            EventBus.dispatch("logout"); // Revenir au login après expiration Token
          }
        });
    },
  },
};
</script>

<style scoped>
.btn-primary {
  background-color: #ffd7d7;
  border-color: #ffd7d7;
}
.btn-primary:hover,
.btn-primary:focus,
.btn-primary:not(:disabled):not(.disabled):active {
  background-color: #ffd7d7;
  border-color: #ffd7d7;
}
.btn-primary:focus {
  box-shadow: 0 0 0 0.2rem rgb(255 215 215 / 50%);
}
.error-feedback {
  color: #000;
  font-size: 12px;
}
p{
  color: #000;
  font-size: 18px;
}

</style>