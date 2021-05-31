<template>
<div class="progress" v-if="$store.state.isLoading">
  <span class="progress-bar" style="width: 100%"></span>
</div>
<!--
  <div id="nav">
    <router-link to="/notes">Notes</router-link> |
    <router-link to="/myDevice/">Home</router-link> |
    <router-link to="/settings">Settings</router-link>
  </div>
  -->
<div class="body-wrapper" ></div>
  <router-view/>
</template>

<script>


export default{
  data(){
    return{

    }
  },
  components:{
    
  },
mounted(){
        this.$router.push({name: 'myDevice'}) //added on 26th may (future use this step for state resumption)
        //alert(108)
},
  methods: {
       
    },
    //mixins:[touchMixin]

}
</script>

<style>
/* temp disabled 
.body-wrapper{
  position: fixed;
  height: 95vh;
  width: 100vw;
}*/
#app {
  height: 100vh;
  width: 100vw;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  background-color: #000000;
}
/*
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
*/
.button{
  font-weight: bolder
}
.progress{
  position: fixed;
  top: 0;
  z-index: 10;
}
</style>
