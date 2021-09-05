<template>
<div class="modal" :class="{'is-active': !loading}">
    <div class="modal-background"></div>
    <div class="modal-content">
        <div class="menu">
  <p class="menu-label">
    select current device
  </p>
  <ul class="menu-list">
    <li class="device-list" v-for="device in deviceList" :key="device" v-if="!registerLoading">
        <div class="box">
            <img src="../assets/pp2.png" class="profile-img">
                <a @click="selectDevice(device.id)" class="profile-name">{{ device.name }}</a>
        </div>
    </li>
    <li class="device-list">
        <NewDevice :folders='folders' :init='false' @load="registerLoading = true" />
    </li>
  </ul>
</div>
    </div>
  <button class="modal-close is-large" aria-label="close" @click="$router.push({name: 'about'})"></button>
</div>
  <loading v-model:active="loading"
                 :is-full-page="fullPage"
                 :blur="loader.blur"
                 :background-color="loader.bgColor"
                 
                 >
                 <div class="loaderDiv">
                    <div class="loaderLoader">
                        <self-building-square-spinner
                        :animation-duration="5000"
                        :size="40"
                        :color="loader.color"
                        />
                    </div>
                    <br>
                    <span class="loaderText">Setting up devices...</span>
                 </div>
  </loading>
</template>

<script>
import { SelfBuildingSquareSpinner } from 'epic-spinners'

import NewDevice from '../components/NewDevice';
import { toHandlers } from '@vue/runtime-core';

export default {
    data(){
        return{
            deviceList: [],
            loading: false,
            registerLoading: false,
            loader: {
                color: '#ffffff',
                blur: '100px',
                bgColor: 'hsl(0, 0%, 30%)'
            }
        }
    },
    computed:{
        
    },
    async mounted(){
        if(!this.$store.state.signInState){alert('Please sign in first....'); this.$router.replace({name: 'myDevice'})}
        this.loading = true
        //if(localStorage.getItem('thisDeviceId')){alert('You are already signed in! To shift to any other registered device sign out first...'); this.$router.replace({name: 'myDevice'})}
        var init = await this.$store.dispatch('searchFiles',{name:'initialized.json', folder:'appDataFolder', mType:'application/json'})
        //console.log(init.length, 'init')
        if (!init.length) {/*console.log(100)*/; this.$router.replace({name: 'initialize'}); this.loading = false; return}
        var arg = {name:null,folder:'appDataFolder',mType:'application/vnd.google-apps.folder'}
        var deviceList = await this.$store.dispatch('searchFiles',arg)
        this.deviceList = deviceList.filter(file => file.name != 'allDevices' && file.name != 'notes' && file.name != 'clipBoard')
        this.loading = false
    },
    methods:{
        async selectDevice(arg){
            localStorage.setItem('thisDeviceId',arg)
            await this.$store.dispatch('setMyDevice', arg)
            this.$store.dispatch('setUpDevices')
            this.$router.push({name:'myDevice'})
        }
    },
    computed:{
        folders(){
            return this.deviceList
        }
    },
    components:{
        NewDevice, SelfBuildingSquareSpinner
    }
}
</script>

<style scoped>
.modal-content{
    padding: 0.75rem;
}
 

menu {
    padding: 0.5rem 0.25rem;
}
.menu-label{
    position: relative;
    padding: 0.5rem 2rem;
    right: 0em;
    text-transform: lowercase;
    color:aqua;
}
.menu-list{
    padding: 0.25rem 0rem;
    max-height: 45vh;
    overflow: auto;
}
.box{
    background-color: rgb(36, 36, 36);
    height: 5rem;
    margin: 0.5rem 0rem;
}
.profile-img{
position: relative;
width: 40px;
height: 40px;
left: 0.5rem;
top: auto;
border-radius: 50%;
display: inline-block;
}
.profile-name{
position: relative;
max-width: 50vw;
left: 3.5rem;
top: -2.5rem;
font-weight:500;
color:var(--m-color);
border-radius: 7px;
} 
.device-list{
    padding: 0.25rem 0; 
}
.load{
  display:flex;
  justify-content: center 
}
</style>