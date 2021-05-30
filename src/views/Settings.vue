<template>
<div class="settings-wrapper">
  <p class="title is-1">sorry</p>
    <img src="../assets/6.svg">
    <p class="subtitle">No settings are custmoizable yet...</p>
    <button class="button is-warning" @click="$router.replace({name:'myDevice'})">Return home</button>
</div>
</template>

<script>

export default {
  data(){
    return {
      toggled: true
    }
  },
  methods: {
    },

}
</script>

<style scoped>

.settings-wrapper{
  text-align: center;
  padding: 2rem
}
</style>
