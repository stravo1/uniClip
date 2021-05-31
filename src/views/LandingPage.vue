<template>

<div class="sign-in">
  <SignIn/>
</div>

<div class="device-list">
<DeviceList/>
</div>
<!--
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
  -->
</template>

<script>
// @ is an alias to /src
import DeviceList from '@/components/DeviceList.vue'
import SignIn from '../components/SignIn'
//import touchMixin from '@vue-mixin/touch';
export default {
  name: 'Home',
  data(){
    return{

    }
  },
  mounted(){

  },
  components: {
    DeviceList, SignIn
  },
  methods: {
   },

  //mixins:[touchMixin]
  
  beforeRouteLeave (to, from) {
    this.$store.commit('setRefreshState', true)
  /*
  const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
  if (!answer) return false
}*/
}
}
</script>

<style scoped>

.device-list{
  position: fixed;
  width: 95vw;
  bottom: 0;
}
.contaier{
  padding:30px;
}
.sign-in{
  position: absolute;
  right: 0.25em;
  top: 0.25em;
}
.info{
  position: fixed;
  bottom: 50vh;
  right: 1rem;
  z-index: 10;
  height: 36px;
  width: 36px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(200, 200, 200 , 0.625);
  box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
  backdrop-filter: blur( 1px );
  -webkit-backdrop-filter: blur( 1px );
  color: rgb(00, 00, 00);
  font-weight: 500; 

}
</style>
