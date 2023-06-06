<script>
import { useRegisterStore } from '../stores/store'
import { mapState, mapActions } from 'pinia'

export default {
  name: 'RegisterPage',
  data() {
    return {
      registerInput: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    ...mapActions(useRegisterStore, ['register'])
  }
}
</script>

<template>
  <main class="main-content  mt-0">
    <section>
      <div class="page-header min-vh-100">
        <div class="container">
          <div class="row">
            <div class="col-md-6">
              <div class="position-absolute w-30 top-0 start-0 h-100 d-md-block d-none d-flex justify-content-start">
                <img src="../assets/img/image-sign-up.jpg"
                  class="oblique-image position-absolute d-flex fixed-top ms-auto h-100 z-index-0 bg-cover me-n8" />
              </div>
            </div>
            <div class="col-md-4 d-flex flex-column mx-auto">
              <div class="card card-plain mt-8">
                <div class="card-header pb-0 text-left bg-transparent">
                  <h3 class="font-weight-black text-dark display-6">Sign up</h3>
                  <p class="mb-0">Nice to meet you! Please enter your details.</p>
                </div>
                <div class="card-body">
                  <form role="form" @submit.prevent="register(registerInput)">
                    <!-- <label>Name</label>
                    <div class="mb-3">
                      <input type="text" class="form-control" placeholder="Enter your name" aria-label="Name"
                        aria-describedby="name-addon">
                    </div> -->
                    <label>Email Address</label>
                    <div class="mb-3">
                      <input v-model="registerInput.email" type="email" class="form-control"
                        placeholder="Enter your email address" aria-label="Email" aria-describedby="email-addon">
                    </div>
                    <label>Password</label>
                    <div class="mb-3">
                      <input v-model="registerInput.password" type="password" class="form-control"
                        placeholder="Create a password" aria-label="Password" aria-describedby="password-addon">
                    </div>
                    <!-- <div class="form-check form-check-info text-left mb-0">
                      <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                      <label class="font-weight-normal text-dark mb-0" for="flexCheckDefault">
                        I agree the <a href="javascript:;" class="text-dark font-weight-bold">Terms and Conditions</a>.
                      </label>
                    </div> -->
                    <div class="text-center">
                      <button type="submit" class="btn btn-dark w-100 mt-4 mb-3">Sign up</button>
                      <!-- <button type="button" class="btn btn-white btn-icon w-100 mb-3">
                        <span class="btn-inner--icon me-1">
                          <img class="w-5" src="../assets/img/logos/google-logo.svg" alt="google-logo" />
                        </span>
                        <span class="btn-inner--text">Sign up with Google</span>
                      </button> -->
                    </div>
                  </form>
                </div>
                <div class="card-footer text-center pt-0 px-lg-2 px-1">
                  <p class="mb-4 text-xs mx-auto">
                    Already have an account?
                    <RouterLink class="text-dark font-weight-bold" to="/login">Sign in</RouterLink>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style></style>
