<template>
  <b-container>
    <h1 class="mb-3">Login</h1>

    <b-row align-h="center">
      <b-col md="6">
        <b-form @submit="onSubmit">
          <b-form-group label="Username" label-for="username" label-cols-sm="4" label-cols-lg="3">
            <b-input id="username" type="text" v-model="username" trim></b-input>
          </b-form-group>
          <b-form-group label="Password" label-for="password" label-cols-sm="4" label-cols-lg="3">
            <b-input id="password" type="password" v-model="password"></b-input>
          </b-form-group>
          <b-button type="submit">Submit</b-button>
        </b-form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import Api from "@/api/mixin";

@Component
export default class Login extends Vue {
  public username: string = "";
  public password: string = "";

  async onSubmit(e: Event) {
    e.preventDefault();

    const response = await this.$api.login(this.username, this.password);

    this.$store.commit("setToken", response.token);
  }
}
</script>
