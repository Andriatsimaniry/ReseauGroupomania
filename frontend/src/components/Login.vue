<template>
  <div class="d-flex justify-content-center">
    <div class="card card-container col-12 col-sm-6">
      <img id="profile-img" src="../assets/logo.svg" class="profile-img-card" />
      <Form @submit="handleLogin" :validation-schema="schema">
        <div class="form-group">
          <label for="email">E-mail</label>
          <Field name="email" type="text" class="form-control" />
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
            <span>Se connecter</span>
          </button>
        </div>
        <div class="form-group">
          <div v-if="message" class="error-feedback" role="alert">
            {{ message }}
          </div>
        </div>
      </Form>
    </div>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate"; // Composant pour gerer les validations des formulaires
import * as yup from "yup"; // Yup Validation de saisie basée sur un schéma

export default {
  name: "Login",
  components: {
    Form,
    Field,
    ErrorMessage,
  },

  data() {
    const schema = yup.object().shape({
      email: yup.string().required("Email d'utilisateur est necessaire!"),
      password: yup.string().required("Mot de passe requis!"),
    });

    return {
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
  created() {
    if (this.loggedIn) {
      this.$router.push("/profile");
    }
  },
  methods: {
    handleLogin(user) {
      this.loading = true;

      this.$store.dispatch("auth/login", user).then(
        () => {
          this.$router.push("/posts");
        },
        (error) => {
          this.loading = false;
          this.message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        }
      );
    },
  },
};
</script>

<style scoped>
.btn-primary {
  background-color: #fd2d02;
  border-color: #fd2d02;
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
  color: red;
  font-size: 12px;
}
</style>