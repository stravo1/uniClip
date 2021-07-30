<template>
<div class="message-window">
<Preview @complete="clear(0)" />


<XyzTransition xyz="fade up-5">
  <div id="z-wrapperU" v-if="isSearch">
    <Search/>
</div>
</XyzTransition>

<div class="message-window-header">
  <span @click="$router.go(-1)"><i class="mdi mdi-chevron-left mdi-24px"></i></span>
  <div class="current-state title is-3">{{ current }}</div>
</div>
<XyzTransition xyz="fade">

  <router-view v-if="!isInMessages" @click="isSearch=false"/>

</XyzTransition>


<XyzTransition xyz="fade">

<div class="wrapper" v-show="isInMessages && !loading" ref="scroll" @click="isSearch=false">
<MessagePreview :message="selectedMessage" v-if="selectedMessage != ''" @close="selectMessage('')"/>
<div class="emptyMessage" v-if="!(readMessages.length || unreadMessages.length)"> It's empty here</div>
<div class="message-wrapper" v-for="message in readMessages" :key="message" :class="addClass(message.message)">
   <div :class="{'fix-to-right':message.context=='sent' && message.sender == $store.state.myDevice.name}">
  <article class="message is-link" :class="{'is-success sent':message.context=='sent' && message.sender == $store.state.myDevice.name, 'received' : message.context != 'sent' || message.sender != $store.state.myDevice.name}">
    <div class="message-body" @click="selectMessage(message)">
     
      <div :class="{'reverse':message.context=='sent' && message.sender == $store.state.myDevice.name}">
         <div class="message-file" v-if="message.type != 'text'">
           <span class="icon">
             <i class="mdi" :class="{'mdi-image': message.type.includes('image'),'mdi-video': message.type.includes('video'),'mdi-file-document': message.type.includes('application') || message.type.includes('text'),'mdi-volume-high': message.type.includes('audio')}"></i>
           </span>
            {{message.type.includes('application') || message.type.includes('text') ? message.type.slice(message.type.indexOf('/')+1, message.type.length) : message.type.slice(0, message.type.indexOf('/'))}} : {{message.fileName}}
         </div>
         
        <span v-html="checkForLink(message.message)"></span>
        </div>
      
    </div>
  </article>
  </div>

  <div class="sub">
    <span :class="{'fix-to-right':message.context=='sent' && message.sender == $store.state.myDevice.name}" class="time"><i style="padding: 0 3px 0 3px;" class="mdi mdi-clock"></i>{{$store.getters.timeFormatter(message.time)}}</span>
    <br v-if="!(message.context=='sent' && message.sender == $store.state.myDevice.name)">
    <span v-show="groupsText(message)" :class="{'fix-to-right':message.context=='sent' && message.sender == $store.state.myDevice.name}" class="groupText" @click="toggleGroup(message.message)"><i style="padding: 0 3px 0 3px;" class="mdi mdi-dots-horizontal"></i></span>
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

<div class="compose-box" v-if="compose" @click="composeClick">
        <div class="fileSelected" v-if="fileInp.length">
            <span class="icon"><i class="mdi mdi-file"></i> </span> {{fileInp.length}} file(s) selected
        <span class="icon cross" @click="fileInp = []"><i class="mdi mdi-close-thick"></i></span>
        </div> 

        <div class="field has-addons">
              <div class="control has-icons-left is-expanded">
                <textarea class="input input-text is-info" type="text" :placeholder="'message to ' + $route.params.device" v-model="txt"></textarea>
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
import linkifyHTMl from 'linkifyjs/html';
import DOMpurfiy from 'dompurify';
import marked from 'marked';

import Upload from '../components/actions/Upload';
import Preview from '../components/actions/Preview';
import MessagePreview from '../components/MessagePreview';
import Search from '../components/actions/Search';

var tempClass
var tempClass2
function removeSpace(param) {
  var wSpace = param.split(" ") //removing spaces from added classnames ("gg hh jj" => "gghhjj")
  return wSpace.join("")
}
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
      loading: true,
    }
  },
  async mounted(){
    if(!this.$store.state.signInState){alert('Please sign in first....'); this.$router.push({name: 'myDevice'})}
    await this.$store.dispatch('setUpMessages', this.$route.params.device == 'allDevices' ? 'allDevices' : this.$route.params.device == 'myDevice' ? 'myDevice' : false )
    this.loading = false
    //this.$store.commit('setIsInMessageState',true)
    

    //this.refresher = await this.$store.dispatch('refreshAll')
    var scroller = this.$refs.scroll
     //alert(scroller)
    setTimeout(() => {scroller.scrollTo({top:  scroller.scrollHeight, behavior: 'smooth'})}, 1)
    //alert('done')

  },
  
  computed: {
    current(){
      var x;
      !this.$store.state.isInMessages ? (this.$route.params.media ? x = this.$route.params.media : x = 'texts') : x = 'texts' //reverse the order later, too confusing
      return x
    },
    readMessages(){
      //console.log('mmm',this.$store.state.messagesList.filter(message => message.read == 'true'))
      return this.$store.state.messagesList
    },
    unreadMessages(){
      //console.log(this.$store.state.unreadMessages,"kk")
      if(this.$store.state.unreadMessages.length) {
        var scroller = this.$refs.scroll
        setTimeout(() => {scroller.scrollTo({top:  scroller.scrollHeight, behavior: 'smooth'})}, 1)
      }
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
    checkForLink(arg){
      var x = DOMpurfiy.sanitize(marked(linkifyHTMl(arg,{target: {
          url: '_blank'
          },
        })
        )
      )
      return x
    },
    setMedia(arg){
      var device = this.$route.params.device
      this.$store.commit('setSelectedMedia', arg) //use setSelectedFolder plzzzz
      if (this.$store.state.isInMessages){ //fixing the back action issue
        this.$router.push({ path: '/myDevice/messages/'+device+'/'+arg})
      } else {
        this.$router.replace({ path: '/myDevice/messages/'+device+'/'+arg})
      }
      this.$store.commit('setIsInMessageState',false)
      ////console.log(this.$refs)
    },
    clear(arg){
      if(arg){
        this.fileInp = []; this.txt = '';
        var scroller = this.$refs.scroll;
        setTimeout(() => {scroller.scrollTo({top:  scroller.scrollHeight, behavior: 'smooth'})}, 100);
        return
      }
      this.$store.commit('setSelectedFile', '')
    },
    fileChange(){
        this.fileInp = this.$refs.file.files
        //console.log(this.fileInp)
    },
    fileSelect(){
        document.getElementById('file').click()
    },
    onFocus(arg){
      ////console.log('focused',arg)
      document.getElementsByClassName(arg)[0].classList.add('is-active')
    },
    onBlur(arg){
      ////console.log('blurred',arg)
      document.getElementsByClassName(arg)[0].classList.remove('is-active')
    },
    composeClick(){
      if(!this.$store.state.isInMessages) {
        this.$store.commit('setIsInMessageState',true)
        this.$router.go(-1)}
    },
    selectMessage(arg){
      //console.log(arg,'arg')
      this.selectedMessage = arg
      //console.log(this.selectedMessage)
    },
    addClass(arg){
      var name = removeSpace(arg)
      //var prev = this.tempClass
      //this.tempClass = name
      if (tempClass == name){
        return name + " group"
      }
      //console.log(name)
      tempClass = String(name)
      //onsole.log(tempClass)
      return ''
    },
    groupsText(arg){
      //console.log(tempClass, tempClass2, arg.message)
      //console.log(tempClass2 != arg.message)
      if(this.readMessages.length != this.readMessages.indexOf(arg)+1){
        if(this.readMessages[this.readMessages.indexOf(arg) + 1].message == arg.message && tempClass2 != arg.message){
          console.log("gg")
          tempClass2 = arg.message
          return true
          }
        }
      if(this.readMessages.length == this.readMessages.indexOf(arg)+1){
        tempClass2 = ''
      }
      return false
    },
    toggleGroup(arg){
      console.log('clicked',document.getElementsByClassName(removeSpace(arg))[0].classList.contains('group'))
      var elements = document.getElementsByClassName(removeSpace(arg));
      for (var i in elements) {
        var toggle = ['ungroup','group']
        if(document.getElementsByClassName(removeSpace(arg))[i].classList.contains('ungroup')){
          toggle = ['group','ungroup']
        }
          elements[i].classList.add(toggle[0]);
          elements[i].classList.remove(toggle[1]);
        
      }
    }
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
    this.$store.commit('setMessagesList',[])
    //clearInterval(this.refresher)
    next()
  }
  
}
</script>

<style scoped>

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
.message-wrapper, .new-messages{
  padding: 0.5rem;
}
/*
.message-window-header{
  position: sticky;
  padding: 1rem;
  display: inline-block;
}

.media-tabs{
  position: relative;
  white-space: nowrap;
  left: 60vw;
  max-width: 30vw;
  max-height: 4rem;
  overflow: hidden;
  text-overflow: ellipsis;
}

.message-window-header {
  display:flex;
  justify-content:flex-end;
}
*/
.message-window-header{
    position: sticky;
    top: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
    gap: 1em 1em;
    grid-template-areas: ". .";
    padding: 0 0rem 1.5rem 0;
    color: aqua;
    padding: 0.5rem 0.5rem 1.5rem 0.5rem;
}
.message-window-header .title{
  white-space: nowrap;
  text-align:right;
}
.message-window-header span{
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
.message{
  display:inline-block; 
  max-width:60vw;
}
.fix-to-right{
  display:flex;
  justify-content: flex-end
}

.sent {
  position: relative;
  max-width: 60vw;
  transform: rotateY(180DEG);
  align-items:center;
  background: rgb(63, 0, 25);
}
.sent .message-body{
  color: rgb(255, 59, 137);
}
.received{
  background: rgb(0, 44, 63);
}
.received .message-body{
  color: rgb(102, 209, 253);
}
.reverse {
  transform: rotateY(-180DEG);
}
.message-body {
  word-wrap: break-word;
}
.received .message-file{
  background: rgb(0, 34, 49);
  padding: 0.25rem;
  border-radius: 3px;
}
.sent .message-file{
  background: rgb(50, 0, 15);
  padding: 0.25rem;
  border-radius: 3px;
}
.wrapper {
  margin: 0.5rem 0.5rem;
  height: 80vh;
  overflow: auto;
  border-radius: 10px;
  background-color: rgb(25, 25, 30)
}
.group{
  display: none;
}
.ungroup{
  display: inline;
}
.message-wrapper .time{
  font-size: small;
  font-weight: lighter;
}
.message-wrapper .groupText{
  font-size: small;
  font-weight: lighter;
  grid-row: 1;
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
