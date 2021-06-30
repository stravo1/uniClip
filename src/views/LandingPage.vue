<template>

<div class="sign-in">
  <SignIn/>
</div>
<div class="notes-glance">
  <NotesGlance :custom="true"><span @click="$router.push({name: 'notes'})"><u>notes</u></span> at a glance </NotesGlance>
</div>
<div class="device-list">
<DeviceList/>
</div>
</template>

<script>
// @ is an alias to /src
import DeviceList from '@/components/DeviceList.vue'
import SignIn from '../components/SignIn'
import NotesGlance from '../components/NotesGlance';
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
    DeviceList, SignIn, NotesGlance
  },
  methods: {
   },

  //mixins:[touchMixin]
  
  beforeRouteLeave (to, from) {
    if(to.name == "messages") {
      this.$store.commit('setRefreshState', true)
      this.$store.commit('setIsInMessageState',true)
    }
    if(to.name == "messages" && this.$store.state.selectedDevice.name == "allDevices") {
      this.$store.commit('setRefreshState', "allDevices") //special refresh for allDevices
    }
  /*
  const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
  if (!answer) return false
  */
  }
}
</script>

<style scoped>

.device-list{
  position: fixed;
  width: 95vw;
  top: 55vh;
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
.notes-glance{
  position: fixed;
  width: 100vw;
  padding: 1.5rem;
  top: 10vh;
}

</style>
