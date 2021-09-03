<template>
<Preview @complete="$store.commit('setSelectedFile', '')" />
    <div id="clip_wrapper">
      <div v-show="$store.state.notes.isInstalled">
        
    
    <textarea class="input input-text is-success" type="text" v-model="content" :disabled='isClipLoading' :placeholder="$store.state.clipBoard.textContent" id="clipInp" style="border-bottom: none" autocomplete="off" spellcheck="false"></textarea>
    <div class="field has-addons" style="background: rgb(33, 33, 33); border-radius: 0 0 0.35rem 0.35rem;">
      <div class="control is-expanded fileClipNameWrapper" @click="preview">
        <span class="fileClipName">{{ fileName() }}</span>
      </div>
              <div class="control separator">
                
              <a class="button is-success is-outlined no-border" @click="fileSelectClip">
              
               <input type="file" style="display: none" ref="fileClip" id="fileClip" @change="fileChangeClip"> 
                <i class="mdi mdi-clipboard-file-outline"></i>
              </a>
              
            </div>
            <div class="control separator">
                <a @click="view" class="button is-outlined is-success no-border">
                    <span v-if="!loading"><i class="mdi mdi-content-paste"></i></span>
                </a>
                  
            </div>
            <div class="control separator">
                <a @click="copy" class="button is-outlined is-success no-border">  
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
                
              <a class="button is-success is-outlined is-rounded" @click="fileSelectClip">
              
               <input type="file" style="display: none" ref="fileClip" id="fileClip" @change="fileChangeClip"> 
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
import Preview from './actions/Preview.vue';
import {toast} from 'bulma-toast';

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
      setInterval(() => {store.dispatch('refreshClipBoard')}, 15000)
    },
    methods:{
        patch(){
            //console..log('patching')
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
        fileName(){
          //if(this.$store.state.clipBoard.mediaFile == null) return 'Loading...'
          if(this.$store.state.clipBoard.mediaFile == undefined) return 'No files'

          return this.$store.state.clipBoard.mediaFile.name
        },
        async fileChangeClip(){
            this.fileInp = this.$refs.fileClip.files
            toast({
                message: 'Uploading',
                type: 'is-dark',
                pauseOnHover: false,
                position: 'bottom-center',
                closeOnClick: true,
                animate: { in: 'fadeIn', out: 'fadeOut' },
            })
            await this.$store.dispatch('saveClipBoardText', this.fileInp[0])
            toast({
                message: 'Complete',
                type: 'is-dark',
                pauseOnHover: false,
                position: 'bottom-center',
                closeOnClick: true,
                animate: { in: 'fadeIn', out: 'fadeOut' },
            })
            ////console..log(this.fileInp)
        },
        fileSelectClip(){
            document.getElementById('fileClip').click()
        },
        preview(){
          //console..log('entered')
          var file = this.$store.state.clipBoard.mediaFile
          this.$store.commit('dirtyLoadFile',{name: file.name, id: file.id, size: file.size})
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
                  //console..log('Timer closed');
                  clearTimeout(this.timer);
                  this.typing = true
                  this.$store.commit('setIsTyping', true)
                }
                var store = this.$store
                var ths = this;
                this.$store.commit('setClipTextContent', value);
                this.timer = setTimeout(() => {
                  //console..log(store.state.clipBoard.textContent, ths)
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
        
    },
    components: {Preview}
}
</script>

<style scoped>
#clipInp{
  height: 23.5vh;
  border: none;
  border-radius: 0.35rem 0.35rem 0 0;
  padding: 1rem;
  resize: none;
}
.fileClipName{
    /* height: 1rem; */
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    /* width: 5vw;*/
    padding: 0.25rem;
    font-weight: bold;
    color: #777777;
}
.fileClipNameWrapper{
    border-radius: 0.35rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: 5vw;
    display: flex;
    align-items: center;
    background: rgb(33, 33, 33);
    padding: 0 1rem;

}
.input-text{
  background-color: rgb(25, 25, 25);
  font-weight: 500;
  color: var(--m-color);
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
.cross{
  grid-column: 3;
  right: 1rem;
}
.no-border{
    border: none;
}
.separator::after{
  content: "";
  background: rgb(77, 77, 77);
  position: absolute;
  bottom: 25%;
  left: 0;
  height: 50%;
  width: 2px;
}
</style>