<template>
<div id="clip_wrapper">
    <div class="fileSelected" v-if="fileInp.length">
            <span class="icon"><i class="mdi mdi-file"></i> </span> <div class="fileClip">{{fileInp[0].name}}</div>
        <span class="icon cross" @click="fileInp = []"><i class="mdi mdi-close-thick"></i></span>
    </div>
    <div class="field has-addons">
              <div class="control has-icons-left is-expanded">
                <textarea class="input input-text is-success" type="text" v-model="content" :disabled='isClipLoading' :placeholder="$store.state.clipBoard.textContent" id="clipInp"></textarea>
                  
                  <span class="icon is-small is-left">
                    <i v-show="isClipLoading" class="mdi mdi-autorenew mdi-spin"></i>
                    <i v-show="!isClipLoading" class="mdi mdi-autorenew"></i>
                  </span>
                  
        
              </div>
              <div class="control">
                
              <a class="button is-success is-outlined is-rounded" @click="fileSelectClip">
              
               <input type="file" style="display: none" ref="fileClip" id="fileClip" @change="fileChangeClip"> 
                <i class="mdi mdi-file-plus "></i>
              </a>
              
            </div>
            <div class="control">
                <a @click="view" class="button is-outlined is-success"> <!-- had to pass(false) to pld cos by defalut it passes $event-->
                    <span v-if="!loading"><i class="mdi mdi-content-paste"></i></span>
                    
                </a>
                  
            </div>
            <div class="control">
                <a @click="copy" class="button is-outlined is-success"> <!-- had to pass(false) to pld cos by defalut it passes $event-->
                    <span v-if="!loading"><i class="mdi mdi-content-copy"></i></span>
                    
                </a>
                  
            </div>
    </div>
</div>
</template>

<script>


export default {
    data(){
        return{
            loading:false,
            timer: null,
            typing: false,
            fileInp: []
        }
    },
    mounted(){
      var store = this.$store;
      setInterval(() => {store.dispatch('refreshClipBoard')}, 5000)
    },
    methods:{
        patch(){
            console.log('patching')
            this.$store.dispatch('saveClipBoardText');
        },
        view(){
          var store = this.$store;
            function append(params) {
              store.commit('setClipTextContent', params);
              store.dispatch('saveClipBoardText');
            }
            navigator.clipboard.readText().then(
            clipText => append(clipText))
            //this.$store.commit('setClipTextContent', document.querySelector("#clipInp").value);
            //this.$store.dispatch('saveClipBoardText');
        },
        copy(){
            navigator.clipboard.writeText(document.getElementById('clipInp').value)
        },
        fileChangeClip(){
            this.fileInp = this.$refs.fileClip.files
            this.$store.dispatch('saveClipBoardText', this.fileInp[0])
            //console.log(this.fileInp)
        },
        fileSelectClip(){
            document.getElementById('fileClip').click()
        },
    },
    computed:{
        content: {
            get () {
              if(this.$store.state.clipBoard.isClipLoading) return ''
              return this.$store.state.clipBoard.textContent
            },
            set (value) {
                if(this.timer!= null){
                  console.log('Timer closed');
                  clearTimeout(this.timer);
                  this.typing = true
                  this.$store.commit('setIsTyping', true)
                }
                var store = this.$store
                var ths = this;
                this.$store.commit('setClipTextContent', value);
                this.timer = setTimeout(() => {
                  console.log(store.state.clipBoard.textContent, ths)
                  store.dispatch('saveClipBoardText')
                  ths.typing = false;
                  store.commit('setIsTyping', false)
                }, 1500)
                this.typing = ths.typing
            }
        },
        isClipLoading(){
          return this.$store.state.clipBoard.isClipLoading
        }
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
  color: rgb(161, 161, 161);
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
  width: 95vw;
  display: grid;
  align-content: center; 
  border-radius: 5px 5px 0 0; 
  padding: 0.5rem; 
  background: rgba( 00, 00, 00 , 0.625);
  box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
  backdrop-filter: blur( 1.5px );
  -webkit-backdrop-filter: blur( 1.5px );
  color: rgb(200, 200, 200);
  font-weight: 500;
}
.fileClip{
  width: 65vw;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.cross{
  grid-column: 3;
  right: 1rem;
}
</style>