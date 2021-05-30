 <template>
<div class="four04">
  <p class="title is-1">oops!</p>
  <img src="../assets/24.svg">
  <p class="subtitle">ERROR 404<br>stop goofing around</p>
  <button class="button is-warning" @click="$router.replace({name:'myDevice'})">Return home</button>
</div>
</template>

<script>
export default {

}
</script>

<style scoped>
.four04{
     text-align: center;
     padding: 2rem
}
h1{color:white}
</style>