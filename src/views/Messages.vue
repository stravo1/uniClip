<template>
<div class="message-window">
<Preview @complete="clear(0)" />


<XyzTransition xyz="fade up-5">
  <div id="z-wrapperU" v-if="isSearch">
    <Search/>
</div>
</XyzTransition>

<div class="message-window-header">
  <div class="current-state title is-4 ">{{ current }}</div>
</div>
<XyzTransition xyz="fade">

  <router-view v-if="!isInMessages" @click="isSearch=false"/>

</XyzTransition>


<XyzTransition xyz="fade">

<div class="wrapper" v-show="isInMessages" ref="scroll" @click="isSearch=false">
<MessagePreview :message="selectedMessage" v-if="selectedMessage != ''" @close="selectMessage('')"/>
<div class="emptyMessage" v-if="!(readMessages.length || unreadMessages.length)"> It's empty here</div>
<div class="message-wrapper" v-for="message in readMessages" :key="message">
   <div :class="{'fix-to-right':message.context=='sent' && message.sender == $store.state.myDevice.name}">
  <article class="message is-link" :class="{'is-success':message.context=='sent' && message.sender == $store.state.myDevice.name}">
    <div class="message-body" @click="selectMessage(message)">
     
      <div :class="{'reverse':message.context=='sent' && message.sender == $store.state.myDevice.name}">
         <div v-if="message.type != 'text'">
           <span v-if="message.type != 'text'" class="icon">
             
             <i class="mdi" :class="{'mdi-image': message.type.includes('image'),'mdi-video': message.type.includes('video'),'mdi-file-document': message.type.includes('application') || message.type.includes('text'),'mdi-volume-high': message.type.includes('audio')}"></i>
           </span>
            File: {{message.fileName}}
         </div>
         
        {{ message.message }}
        </div>
      
    </div>
  </article>
  </div>
</div>
<div class="new-messages message-wrapper" v-if="unreadMessages.length">
  <span class="tag is-info is-light is-medium">New messages</span> 
  <!--
  <button @click="this.$store.dispatch('markAsRead')" class="button is-small is-rounded is-warning">Mark as read</button>
  <button class=" button is-info is-light is-small" @click="isSearch = !isSearch">Toggle</button>
  -->
<div class="message-wrapper" v-for="message in unreadMessages" :key="message">
  
  <article class="message is-info">
    <div class="message-body">
      <div>{{ message.message }}</div>
      
    </div>
  </article>
</div>
</div>
</div>
</XyzTransition>

<div class="futer" ref="touchSwipe"><!--footer reserved by bulma-->


<XyzTransition xyz="fade">

<div class="compose-box" v-if="compose" @click="$store.commit('setIsInMessageState',true)">
        <div class="fileSelected" v-if="fileInp.length">
            <span class="icon"><i class="mdi mdi-file"></i> </span> {{fileInp.length}} file(s) selected
        <span class="icon cross" @click="fileInp = []"><i class="mdi mdi-close-thick"></i></span>
        </div> 

        <div class="field has-addons">
              <div class="control has-icons-left is-expanded">
                <input class="input input-text is-info" type="text" :placeholder="'message to ' + $route.params.device" v-model="txt">
                  <span class="icon is-small is-left">
                    <i class="mdi mdi-message"></i>
                  </span>
        
              </div>
              <div class="control">
                
              <a class="button is-info is-outlined is-rounded" @click="fileSelect">
              
               <input type="file" style="display: none" ref="file" id="file" @change="fileChange" multiple> 
                <i class="mdi mdi-file-plus "></i>
              </a>
              
            </div>
            <div class="control">
              
              <Upload :uploadContent="upload" @complete="clear(1)" :slotUsed='true'>
                
                  <i class="mdi mdi-send"></i>
                
              </Upload>
              
            </div>
        </div>
      </div>
</XyzTransition>
<XyzTransition xyz="fade">
<div class="media-box" v-if="!compose">
<div class="tabs is-toggle is-fullwidth">
  <ul class="media-tabs">
    <li v-for="media in $store.state.mediaFolders" :key="media" :class="media.name">
      <a tabindex="2" @click.prevent="setMedia(media.name)" ref="media.name" @focus="onFocus(media.name)" @blur="onBlur(media.name)"> 
        <span>{{ media.name }}</span>
      </a>
    </li>
  </ul>
</div>
</div>
</XyzTransition>
</div><!--footer--> 
</div>

</template>

<script>



import touchMixin from './touchMixin_modified.js';

import Upload from '../components/actions/Upload';
import Preview from '../components/actions/Preview';
import MessagePreview from '../components/MessagePreview';
import Search from '../components/actions/Search';
export default {
  data(){
    return{
      showNewMessages: true,
      txt:'',
      fileInp: [],
      refresher: '',
      isSearch:false,
      selectedMessage: '',
      compose:true,
    }
  },
  async mounted(){
    if(!this.$store.state.signInState){alert('Please sign in first....'); this.$router.push({name: 'myDevice'})}
    await this.$store.dispatch('setUpMessages', this.$route.params.device == 'allDevices' ? 'allDevices' : this.$route.params.device == 'myDevice' ? 'myDevice' : false )


    this.$store.commit('setIsInMessageState',true)
    

    //this.refresher = await this.$store.dispatch('refreshAll')
    var scroller = this.$refs.scroll
     //alert(scroller)
    setTimeout(() => {scroller.scrollTo({top:  scroller.scrollHeight, behavior: 'smooth'})}, 1)
    //alert('done')

  },
  
  computed: {
    current(){
      var x;
      !this.$store.state.isInMessages ? (this.$route.params.media ? x = this.$route.params.media : x = 'messages') : x = 'messages' //reverse the order later, too confusing
      return x
    },
    readMessages(){
      console.log('mmm',this.$store.state.messagesList.filter(message => message.read == 'true'))
      return this.$store.state.messagesList
    },
    unreadMessages(){
      console.log(this.$store.state.unreadMessages,"kk")
      return this.$store.state.unreadMessages
    },
    upload(){
      return [this.txt,this.fileInp]
    },
    isInMessages(){
      return this.$store.state.isInMessages
    }

  },
  methods: {
    touchSwipeToLeft() {
            //alert("Left")
            this.compose=false
        },
 
        /* → */
        touchSwipeToRight() {
            //alert("Right")
            this.compose=true
        },
    touchSwipeToUp() {
            //alert("Up")
            this.$router.push({name:'myDevice'})
        },
    touchSwipeToDown() {
            //alert("Down")
            this.isSearch = !this.isSearch;
            this.$refs.scroll.scrollTop=this.$refs.scroll.scrollHeight
        },


    setMedia(arg){
      var device = this.$route.params.device
      this.$store.commit('setSelectedMedia', arg) //use setSelectedFolder plzzzz
      this.$router.push({ path: '/myDevice/messages/'+device+'/'+arg})
      this.$store.commit('setIsInMessageState',false)
      //console.log(this.$refs)
    },
    clear(arg){
      if(arg){this.fileInp = []; this.txt = ''; return}
      this.$store.commit('setSelectedFile', '')
    },
    fileChange(){
        this.fileInp = this.$refs.file.files
        console.log(this.fileInp)
    },
    fileSelect(){
        document.getElementById('file').click()
    },
    onFocus(arg){
      //console.log('focused',arg)
      document.getElementsByClassName(arg)[0].classList.add('is-active')
    },
    onBlur(arg){
      //console.log('blurred',arg)
      document.getElementsByClassName(arg)[0].classList.remove('is-active')
    },
    selectMessage(arg){
      console.log(arg,'arg')
      this.selectedMessage = arg
      console.log(this.selectedMessage)
    },
  },/*
  watch: {
  '$store.state.isInMessages': function() {
    //alert(this.$store.state.isInMessages)
    
  }
},*/
  components:{
    Upload, Preview, MessagePreview, Search
  },
  mixins:[touchMixin],
  beforeRouteLeave (to, from, next) {
    //alert('leaving')
    //alert(this.refresher)
    this.$store.commit('setIsInMessageState',false)
    this.$store.commit('setRefreshState',false)

    //clearInterval(this.refresher)
    next()
  }
  
}
</script>

<style scoped>

.message-wrapper, .new-messages{
  padding: 0.5rem;
 
}
.message{
  display:inline-block; 
  max-width:60vw;
}
.fix-to-right{
  display:flex;
  justify-content: flex-end
}

.is-success {
  position: relative;
  max-width: 60vw;
  transform: rotateY(180DEG);
  
 align-tems:center;
}
.reverse {
  transform: rotateY(-180DEG);
}
.message-body {
  word-wrap: break-word;
}
.wrapper {
  margin: 0.5rem 0.5rem;
  height: 80vh;
  overflow: auto;
  border-radius: 10px;
  background-color: rgb(36, 36, 36)
}


.title, .subtitle {
  color:  aqua;
  margin: 0.5rem 0.5rem;
}
#z-wrapperU {
    z-index: 3;
    position: absolute;
    width: 100vw;
    --xyz-translate-y: -350%;
}

.compose-box, .media-box {
  width: 98vw;
  position: absolute;
  bottom:0.25rem;
  padding: 0rem 0rem 0rem 0.5rem;
  background-color:unset;

}
.compose-box{
  --xyz-translate-x: -225%;
}
.media-box{
  --xyz-translate-x: 225%;
}
.input-text{
  background-color: rgb(20, 20, 20);
  color: whitesmoke;
}
.input-text::placeholder{
  color: rgb(73, 73, 73);
}
.message-window-header{
  position: sticky;
  padding: 1rem;
  display: inline-block;
}
/*
.media-tabs{
  position: relative;
  white-space: nowrap;
  left: 60vw;
  max-width: 30vw;
  max-height: 4rem;
  overflow: hidden;
  text-overflow: ellipsis;
}
*/
.title {
  white-space: nowrap;
  text-align:right;

}
.message-window-header {
  display:flex;
  justify-content:flex-end;
}
.emptyMessage{
  font-weight: 500;
  text-align: center;
  padding: 1rem;
}
.futer {
  position:fixed;
  width: 100vw;
  bottom: 0;
  padding: 0rem 0rem 0rem 0rem;
  background-color: black;
  height: 3rem;
  border-radius: 7px;
}
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
.media-tabs {
  color:black;
  font-weight:600;
  padding: 0rem;
}
</style>
