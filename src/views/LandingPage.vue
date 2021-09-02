<template>



<div class="sign-in">
  <SignIn/>
</div>


<div class="device-list">
<DeviceList/>
</div>
<div class="clipboard_n_notes">
  <div class="glance-header">
        <span class="bodge2"><i v-show="isClipboard" class="mdi mdi-24px mdi-clipboard-outline"></i><i v-show="!isClipboard" class="mdi mdi-24px mdi-text"></i></span>
        <p class="subtitle">
            <div class="tabs is-boxed">
              <ul>
                <li :class="{'is-active' : isClipboard}"><a @click="isClipboard = true">Clipboard</a></li>
                <li :class="{'is-active' : !isClipboard}"><a @click="isClipboard = false">Notes <XyzTransition xyz="fade"> <span @click="$router.push({name: 'notes'})" v-if="!isClipboard">&emsp;<i class="mdi mdi-arrow-right"></i></span> </XyzTransition> </a></li>
              </ul>
            </div>
            <!--clipboard n <span @click="$router.push({name: 'notes'})"><u>notes</u></span>-->
        </p>
        <XyzTransition xyz="fade">
        <span v-show="isClipboard" class="icon bodge1" @click="$store.dispatch('refreshClipBoard')">
          <i v-show="isClipLoading" class="mdi mdi-autorenew mdi-spin"></i>
          <i v-show="!isClipLoading" class="mdi mdi-autorenew"></i>
        </span>
        </XyzTransition>
    </div>
  <div v-show="isClipboard"><Clipboard></Clipboard></div>
  <div v-show="!isClipboard">
  <NotesGlance :custom="true" :headerDisable="true" ></NotesGlance>
</div>
</div>
</template>

<script>
// @ is an alias to /src
import DeviceList from '@/components/DeviceList.vue'
import SignIn from '../components/SignIn'
import NotesGlance from '../components/NotesGlance';
import Clipboard from '../components/Clipboard.vue';
//import touchMixin from '@vue-mixin/touch';
export default {
  name: 'Home',
  data(){
    return{
      isClipboard: true,
    }
  },
  mounted(){

  },
  components: {
    DeviceList, SignIn, NotesGlance, Clipboard
  },
  methods: {
   },
   computed: {
     isClipLoading(){
          return this.$store.state.clipBoard.isClipLoading
        }
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
.clipboard_n_notes{
  position: fixed;
  width: 100vw;
  padding: 1.5rem;
  top: 10vh;
}
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
.bodge1{
  padding: 1.5rem 0;
}
.bodge2{
  padding: 0.5rem 0 0 0;
}
</style>
