<script >
import SideBar from '../components/SideBar.vue'
import { useRegisterStore } from '../stores/store';
import { mapActions, mapState } from 'pinia';

export default {
  name: 'HomePage',
  components: {
    SideBar
  },
  methods: {
    ...mapActions(useRegisterStore, ['checkLogin', 'fetchProfile'])
  },
  created() {
    this.checkLogin()
    this.fetchProfile()
  }

}

</script>

<template>
  <SideBar />
  <RouterView />
</template>
