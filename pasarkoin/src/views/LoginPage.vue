<script>
import { mapActions } from 'pinia';
import { useRegisterStore } from '../stores/store';

export default {
  name: 'Login Page',
  data() {
    return {
      loginInput: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    ...mapActions(useRegisterStore, ['login'])
  }
}
</script>

<template>
  <main class="main-content  mt-0">
    <section>
      <div class="page-header min-vh-100">
        <div class="container">
          <div class="row">
            <div class="col-xl-4 col-md-6 d-flex flex-column mx-auto">
              <div class="card card-plain mt-8">
                <div class="card-header pb-0 text-left bg-transparent">
                  <h3 class="font-weight-black text-dark display-6">Welcome back</h3>
                  <p class="mb-0">Welcome back! Please enter your details.</p>
                </div>
                <div class="card-body">
                  <form role="form" @submit.prevent="login(loginInput)">
                    <!-- <label>Name</label>
                    <div class="mb-3">
                      <input type="text" class="form-control" placeholder="Enter your name" aria-label="Name"
                        aria-describedby="name-addon">
                    </div> -->
                    <label>Email Address</label>
                    <div class="mb-3">
                      <input v-model="loginInput.email" type="email" class="form-control"
                        placeholder="Enter your email address" aria-label="Email" aria-describedby="email-addon">
                    </div>
                    <label>Password</label>
                    <div class="mb-3">
                      <input v-model="loginInput.password" type="password" class="form-control"
                        placeholder="Enter password" aria-label="Password" aria-describedby="password-addon">
                    </div>
                    <!-- <div class="d-flex align-items-center">
                      <a href="javascript:;" class="text-xs font-weight-bold ms-auto">Forgot password</a>
                    </div> -->
                    <div class="text-center">
                      <button type="submit" class="btn btn-dark w-100 mt-4 mb-3">Sign in</button>
                      <!-- <button type="button" class="btn btn-white btn-icon w-100 mb-3">
                        <span class="btn-inner--icon me-1">
                          <img class="w-5" src="./src/assets/img/logos/google-logo.svg" alt="google-logo" />
                        </span>
                        <span class="btn-inner--text">Sign in with Google</span>
                      </button> -->
                    </div>
                  </form>
                </div>
                <div class="card-footer text-center pt-0 px-lg-2 px-1">
                  <p class="mb-4 text-xs mx-auto">
                    Don't have an account?
                    <RouterLink class="text-dark font-weight-bold" to="/register">Sign up</RouterLink>
                  </p>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="position-absolute top-0 end-0 h-100 d-md-block d-none">
                <img src="../assets/img/image-sign-in.jpg"
                  class="oblique-image position-absolute fixed-top ms-auto h-100 z-index-0 bg-cover ms-n8" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style></style>
