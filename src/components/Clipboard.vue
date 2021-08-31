<template>
<div id="clip_wrapper">
  <div v-show="$store.state.notes.isInstalled">
    <div class="glance-header">
        <i class="mdi mdi-24px mdi-clipboard-outline"></i>
        <p class="subtitle">
            clipboard n <span @click="$router.push({name: 'notes'})"><u>notes</u></span>
        </p>
        <span class="icon" @click="$store.dispatch('refreshClipBoard')">
          <i v-show="isClipLoading" class="mdi mdi-autorenew mdi-spin"></i>
          <i v-show="!isClipLoading" class="mdi mdi-autorenew"></i>
        </span>
    </div>
    <textarea class="input input-text is-success" type="text" v-model="content" :disabled='isClipLoading' :placeholder="$store.state.clipBoard.textContent" id="clipInp"></textarea>
    <div class="field has-addons">
      <div class="control is-expanded">
        <span class="fileClip"></span>
      </div>
              <div class="control">
                
              <a class="button is-success is-outlined" @click="fileSelect">
              
               <input type="file" style="display: none" ref="file" id="file" @change="fileChange" multiple> 
                <i class="mdi mdi-file-plus "></i>
              </a>
              
            </div>
            <div class="control">
                <a @click="view" class="button is-outlined is-success">
                    <span v-if="!loading"><i class="mdi mdi-content-paste"></i></span>
                    
                </a>
                  
            </div>
            <div class="control">
                <a @click="copy" class="button is-outlined is-success">  
                    <span v-if="!loading"><i class="mdi mdi-content-copy"></i></span>
                    
                </a>
                  
            </div>
    </div>
</div>

  <!--
    <div class="field has-addons">
              <div class="control has-icons-left is-expanded">
                <textarea class="input input-text is-success" type="text" v-model="content" :disabled='isClipLoading' :placeholder="$store.state.clipBoard.textContent" id="clipInp"></textarea>
                  
                  <span class="icon is-small is-left">
                    <i v-show="isClipLoading" class="mdi mdi-autorenew mdi-spin"></i>
                    <i v-show="!isClipLoading" class="mdi mdi-autorenew"></i>
                  </span>
                  
        
              </div>
              <div class="control">
                
              <a class="button is-success is-outlined is-rounded" @click="fileSelect">
              
               <input type="file" style="display: none" ref="file" id="file" @change="fileChange" multiple> 
                <i class="mdi mdi-file-plus "></i>
              </a>
              
            </div>
            <div class="control">
                <a @click="view" class="button is-outlined is-success">  had to pass(false) to pld cos by defalut it passes $event
                    <span v-if="!loading"><i class="mdi mdi-content-paste"></i></span>
                    
                </a>
                  
            </div>
            <div class="control">
                <a @click="copy" class="button is-outlined is-success">  had to pass(false) to pld cos by defalut it passes $event
                    <span v-if="!loading"><i class="mdi mdi-content-copy"></i></span>
                    
                </a>
                  
            </div>
    </div>
    -->
</div>
</template>

<script>


export default {
    data(){
        return{
            loading:false,
            timer: null,
            typing: false,
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
        }
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
#clipInp{
  height: 27vh;
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