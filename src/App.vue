<template>
<div class="progress" v-if="$store.state.isLoading">
  <span class="progress-bar" style="width: 100%"></span>
</div>
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
  watch: {
    '$route.params.device': function() {
      //alert('device changed'+this.$route.params.device)
      var deviceNames = []
      this.$store.state.deviceList.forEach(device => deviceNames.push(device.name))
      //alert(!deviceNames.includes(this.$route.params.device) && this.$route.params.device != undefined)
      if(!deviceNames.includes(this.$route.params.device) && this.$route.params.device != undefined) this.$router.push({name:'NotFound'})
    },
    '$route.params.media': function() { //bugs exist down
      //alert('media changed'+this.$route.params.media)
      var mediaNames = []
      this.$store.state.mediaFolders.forEach(media => mediaNames.push(media.name))
      //alert(!mediaNames.includes(this.$route.params.media) && this.$route.params.media != undefined)
      if(!mediaNames.includes(this.$route.params.media) && this.$route.params.media != undefined) {this.$router.push({name:'NotFound'})}
    }
  },
methods: {
       
},
    //mixins:[touchMixin]
}
</script>

<style>
.loaderDiv {
    color: honeydew;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 0.25rem;
    backdrop-filter: blur(5px);
    width: 100vw;
    height: 100vh;
}
.loaderText{
    display: flex;
    align-content: center;
    justify-content: center;
    grid-row: 2;
    font-size: larger;
}
.loaderLoader{
    display: flex;
    justify-content: center;
    align-items: flex-end;
}
.loaderLoader:last-child{
    grid-row: 2;
    display: flex;
    align-content: center;
    justify-content: center;
    align-items: flex-start;
    position: relative;
    top: -1.5rem;
}
/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-leave-active {
  transition: all .75s ease-in-out;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  /*transform: translateY(-250px);*/
  opacity: 0;
}
:root{
     --m-color: rgb(145, 145, 145);
     --o-color: rgb(95, 95, 95);
}
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
.nanobar {
  width: 100%;
  height: 5px;
  z-index: 9999;
  top:0
}
.bar {
  width: 0;
  height: 100%;
  transition: height .3s;
  background:whitesmoke;
}
</style>
