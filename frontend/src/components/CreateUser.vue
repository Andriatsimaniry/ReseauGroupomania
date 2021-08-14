<template>
  <div class="container-fluid">
    <div class="container">
      <h2 class="text-center" id="title">GOUPOMANIA Network</h2>
      <p class="text-center">
        <small id="passwordHelpInline" class="text-muted"
          ><a> Site reseau social interne de l'entreprise</a>.</small
        >
      </p>
      <hr />
      <div class="row">
        <div class="col-md-12">
          <form role="form" method="post">
            <fieldset>
              <p class="text-uppercase pull-center">CREEZ VOTRE COMPTE.</p>
              <div class="form-group">
                <input
                  type="text"
                  name="nom"
                  id="username"
                  class="form-control input-lg"
                  placeholder="Nom"
                />
              </div>

              <div class="form-group">
                <input
                  type="email"
                  name="email"
                  id="email"
                  class="form-control input-lg"
                  placeholder="Adresse email"
                />
              </div>
              <div class="form-group">
                <input
                  type="password"
                  name="password"
                  id="password"
                  class="form-control input-lg"
                  placeholder="Mot de passe"
                />
              </div>
              <div>
                <input
                  type="submit"
                  class="btn btn-md btn-primary"
                  value="s'inscrire"
                />
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CreateUser",
  data() {
    return {
      Username: "",
      password: "",
      email: "",
    };
  },

  methods: {
    createUser() {
      console.log(this.firstName);
      const payload = {
        firstName: this.firstName,
        password: this.password,
        email: this.email,
      };
      this.$emit("createUser", payload);
      this.clearForm();
    },
    clearForm() {
      this.firstName = "";
      this.lastName = "";
      this.email = "";
    },
  },
};
</script>

 