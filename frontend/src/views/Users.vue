<template>
  <div class="container">
    <div class="col-lg-8">
      <form role="form">
        <fieldset>
          <p class="text-uppercase">CONNECTEZ-VOUS AVEC VOTRE COMPTE:</p>

          <div class="form-group">
            <input
              type="email"
              name="username"
              id="username"
              class="form-control input-lg"
              placeholder="Nom"
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
              value="s'identifier"
            />
          </div>
        </fieldset>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Users",
  props: ["users"],
};
</script>