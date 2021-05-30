<template>
<div class="menu">
  <p class="menu-label">
    Device list
  </p>
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
    padding: 0.25rem 0.5rem  0.25em 1.5em;
    max-height: 45vh;
    overflow: auto;
}
.box{
    background-color: #4f4f4f;
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
color:whitesmoke;
border-radius: 7px;
}
</style>