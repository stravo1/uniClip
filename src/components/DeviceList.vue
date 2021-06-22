<template>
<div class="menu">
  <div class="menu-label">
    <i class="mdi mdi-24px mdi-cellphone-link" style="padding : 0rem;"></i>
    <span class="icon"><i class="mdi mdi-information-outline md-24px" @click="$router.push({name:'about' })" ></i></span>
    <p class="subtitle is-5">devices</p>
  </div>
  <ul class="menu-list">
      <XyzTransitionGroup class="example-grid" xyz="fade-100% down ease-in-out stagger-2.5 out-up-1" mode="out-in">

        <li v-for="device in deviceList" :key="device" v-if="loaded"> <!-- i can get away with v-if set to isLoading cos here, on this oage, of its isLoading then its the device list which is being refreshed for sure, nothing else...maybe  -->
            <div class="box">
                <img src="../assets/pp2.png" class="profile-img">
                <a @click="selectDevice(device.name)" class="profile-name">{{ device.name }}</a>
            </div>
        </li>

    </XyzTransitionGroup>
  </ul>
</div>
</template>

<script>
export default {
    data(){
        return{
        }
    },
    mounted(){

    },
    computed:{
        deviceList(){
            return this.$store.state.deviceList
        },
        loaded(){
            var deviceList = this.$store.state.deviceList
            console.log(deviceList,'dd')
            return deviceList.length
        }
    },
    methods:{
        async selectDevice(arg){
            this.$store.commit('setSelectedDevice', arg)
            await this.$store.dispatch('setReceivingDevice', arg)
            this.$router.push({ name: 'messages', params: { device: arg } })
            console.log(100)
        },
        /* ↑ */
        touchSwipeToUp() {
            console.log("Up")
        },
 
        /* ← */
        touchSwipeToLeft() {
            console.log("Left")
        },
 
        /* → */
        touchSwipeToRight() {
            console.log("Right")
        },
 
        /* ↓ */
        touchSwipeToDown() {
            console.log("Down")
        },
    },

}
</script>

<style  scoped>
.menu {
    padding: 0.5rem 0 0 0;
}
.menu-label{
    position: relative;
    width: 105%; /* bad fix */
    padding: 0.5rem 1.5rem;
    right: 0em;
    text-transform: lowercase;
    color: hsl(0, 0%, 60%);
    margin-bottom: 0;
    display: grid;
    grid-template-columns: 0.15fr 1.5fr 0.25fr;
    grid-template-rows: 1fr;
    gap: 0.5rem;
    grid-template-areas: ". . .";

}
.menu-label .subtitle{
    grid-column: 2;
    grid-row: 1;
    width: 100%;
    padding: 0.25rem 0.7rem 0.25rem;
    font-weight: 500;
}
.menu-label .icon{
    grid-column: 3;
    grid-row:1;
    padding: 0.75rem 0rem 0 1.5rem;
    width: 100%;
}
.menu-list{
    padding: 0.25rem 0.5rem  0.25em 1.5em;
    height: 35vh;
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
max-width: 60vw;
left: 3.5rem;
top: -2.5rem;
font-weight:500;
color:var(--m-color);
border-radius: 7px;
}
</style>