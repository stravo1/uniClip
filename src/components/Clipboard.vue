<template>
<div id="clip_wrapper">
    <div class="field has-addons">
              <div class="control is-expanded">
                <textarea class="input input-text is-success" type="text" v-model="content"></textarea>
                  <!--
                  <span class="icon is-small is-left">
                    <i class="mdi mdi-clipboard"></i>
                  </span>
                  -->
        
              </div>
              <div class="control">
                
              <a class="button is-success is-outlined is-rounded" @click="fileSelect">
              
               <input type="file" style="display: none" ref="file" id="file" @change="fileChange" multiple> 
                <i class="mdi mdi-file-plus "></i>
              </a>
              
            </div>
            <div class="control">
                <a @click.prevent="upld(false)" class="button is-outlined is-success"> <!-- had to pass(false) to pld cos by defalut it passes $event-->
                    <span v-if="!loading"><i class="mdi mdi-content-paste"></i></span>
                    <i v-if="loading" class="fa fa-spinner fa-pulse"></i>
                </a>
                  
            </div>
            <div class="control">
                <a @click.prevent="upld(false)" class="button is-outlined is-success"> <!-- had to pass(false) to pld cos by defalut it passes $event-->
                    <span v-if="!loading"><i class="mdi mdi-content-copy"></i></span>
                    <i v-if="loading" class="fa fa-spinner fa-pulse"></i>
                </a>
                  
            </div>
    </div>
</div>
</template>

<script>
export default {
    data(){
        return{
            lastXHR: null,
            newXHR: null,
            loading:false,
        }
    },
    methods:{
        patch(){
            console.log('patching')
            this.$store.dispatch('saveClipBoardText');
        }
    },
    computed:{
        content: {
            get () {
            return this.$store.state.clipBoard.textContent
            },
            set (value) {
                //if(this.lastXHR!= null) this.lastXHR.abort()
                this.$store.commit('setClipTextContent', value)
                this.$store.dispatch('saveClipBoardText')
                //console.log(this.lastXHR)
            }
        },
    }
}
</script>

<style scoped>
#clip_wrapper{
    padding: 1.25rem;
    width: 100vw;
}
.compose-box, .media-box {
  width: 98vw;
  position: absolute;
  bottom:0.25rem;
  padding: 0rem 0rem 0rem 0.5rem;
  background-color:unset;

}
.input-text{
  background-color: rgb(20, 20, 20);
  color: whitesmoke;
}
.input-text::placeholder{
  color: rgb(73, 73, 73);
}
.emptyMessage{
  font-weight: 500;
  text-align: center;
  padding: 1rem;
}
/*
.futer {
  position:fixed;
  width: 100vw;
  bottom: 0;
  padding: 0rem 0rem 0rem 0rem;
  background-color: black;
  height: 3rem;
  border-radius: 7px;
}
*/
.fileSelected{
  width: inherit - 1.5rem;
  align-content: center; 
  border-radius: 5px 5px 0 0; 
  padding: inherit; 
  background: rgba( 00, 00, 00 , 0.625);
  box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
  backdrop-filter: blur( 1.5px );
  -webkit-backdrop-filter: blur( 1.5px );
  color: rgb(200, 200, 200);
  font-weight: 500;
}
.cross{
  position:absolute;
  right: 1rem;
}
</style>