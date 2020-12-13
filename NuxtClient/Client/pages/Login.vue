<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-4 is-offset-4">
          <h2 class="title has-text-centered">Welcome back!</h2>

          <Notification :message="message" v-if="message"/>

          <form method="post" @submit.prevent="login">
            <div class="field">
              <label class="label">Email</label>
              <div class="control">
                <input
                  type="email"
                  class="input"
                  name="email"
                  v-model="email"
                >
              </div>
            </div>
            <div class="field">
              <label class="label">Password</label>
              <div class="control">
                <input
                  type="password"
                  class="input"
                  name="password"
                  v-model="password"
                >
              </div>
            </div>
            <div class="control">
              <button type="submit" class="button is-dark is-fullwidth">Log In</button>
            </div>
          </form>
          
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Notification from '~/components/Notification'
import config from '~/configuration/config.js'
export default {
  components: {
    Notification,
  },

  data() {
    return {
      email: '',
      password: '',
      message: null
    }
  },

  methods: {
    async login() {
      try {
        console.log("Login url",`${config.REACT_APP_XOXO_URL}/api/v1/owner/login`);
        const response =  await this.$axios.$post(`${config.REACT_APP_XOXO_URL}/api/v1/owner/login`, {
            email: this.email,
            password: this.password
        },{
    //AxiosRequestConfig parameter
    withCredentials: true //correct
  })
        console.log("Response",response);
        this.message = "Logged in"
      } catch (e) {
        this.message = e.response.data.message
      }
    }
  }
}
</script>