<template>
  <div class="notes-wrapper">
    <p class="title is-1">sorry</p>
    <img src="../assets/6.svg">
    <p class="subtitle">'Notes' is under construction, will be available soon...</p>
    <button class="button is-warning" @click="$router.replace({name:'myDevice'})">Return home</button>
  </div>
</template>

<script>
export default {

}
</script>

<style>
.notes-wrapper{
     text-align: center;
     padding: 2rem
}
</style>