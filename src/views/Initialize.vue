<template>
  <div class="modal" :class="{'is-active': !signInState && !loading}">
    <div class="modal-background"></div>
      <div class="modal-content">
        <div class="card is-centered">
            <div class="card-header">
                <div class="card-header-icon">
                    <span class="icon">
                        <i class="mdi mdi-account-arrow-right mdi-36px"></i>
                    </span>
                </div>
                <div class="card-header-title">
                    <div class="">
                        <p class="title is-4" style="text-align:left">Initial Setup</p>
                        <p class="subtitle is-6" style="text-align:left">seems like you're new here</p>
                    </div>
                </div>
        </div>

        <div class="card-content">
            <div class="content">
                <blockquote>welcome to uniClip, to get started register your first device:
                <br>
                <br>
                <NewDevice :folders='[]' :init='true'/>
                </blockquote>
                
                
            </div>
        <footer class="card-footer">
            <button class="button is-primary card-footer-item" @click="$router.push({name: 'about'})">View About Page</button>
            
        </footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NewDevice from '../components/NewDevice';
export default {
    data(){
        return{

        }
    },
    mounted(){
        if(confirm("Please take a look at the About Page if you are completely new, click Cancel of you wish to continue")){this.$router.push({name: 'about'})}

        if(!this.$store.state.signInState){alert('Please sign in first....'); this.$router.push({name: 'myDevice'}); return}
        if(localStorage.getItem('thisDeviceId')){alert('You are already signed in! To shift to any other registered device sign out first...'); this.$router.push({name: 'myDevice'}); return}
        if(this.$store.state.rootDevices.length){alert('No need to go through this step anymore'); this.$router.push({name: 'selectDevice'}); return}
    },
    components:{
        NewDevice
    }
}
</script>

<style scoped>
.modal-content{
    padding: 1rem
}
</style>