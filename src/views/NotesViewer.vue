<template>

<div class="notes-view-wrapper">
  <XyzTransition xyz="fade">
    <div class="notes-view-header">   
      <div class="load" v-show="loading">loading your note...</div>
        <span v-show="!loading" class="icon" @click="close"><i class="mdi mdi-chevron-left mdi-24px"></i></span>
        <div class="title is-4"> {{ title }} </div>
    </div>
  </XyzTransition>
  <div class="box">
    <span v-if="loading">until then let's see how long you can hold your breath...</span>
    <XyzTransition xyz="fade">
        <div class="content" id="notesView" v-show="!loading">
        </div>
    </XyzTransition>
  </div>
  <!--
  <div class="modal is-active">
    <div class="modal-background" @click="close"></div>
    <div class="modal-card">
      <header class="modal-card-head">
          <p class="modal-card-title">
            
              <span v-if="loading">loading your note...</span>
            
            <XyzTransition xyz="fade">
              <span v-if="!loading">
                <span class="title is-3"> {{ title }} </span>
                <br>
                <span class="subtitle is-7">{{time}}</span>
              </span>
            </XyzTransition>
          </p>
          
        <button class="delete" aria-label="close" @click="close"></button>
      </header>
      <section class="modal-card-body">
        <span v-if="loading">until then let's see how long you can hold your breath...</span>
        <XyzTransition xyz="fade">
          <div class="content" id="notesView" v-show="!loading"></div>
        </XyzTransition>
      </section>
      
        <footer class="card-footer">
          <span class="card-footer-item" v-if="loading">~~~</span>
          <span class="card-footer-item" @click="toggle = !toggle" v-if="!loading">Edit</span>
          <span class="card-footer-item danger" @click="dlt" v-if="!loading">
            <i v-if="deleting" class="fa fa-spinner fa-pulse"></i><span v-if="!deleting">Delete</span>
          </span>
      </footer>
    </div>
  </div>
  -->
  <footer class="notes-view-footer">
    <div class="footer-menu">
      <span class="icon edit" @click="$router.replace({name: 'nEdit'})"><i class="mdi mdi-square-edit-outline mdi-24px"></i></span>
      <span class="time">{{time}}</span>
      <span class="icon dlt" @click="dlt"><i v-if="deleting" class="fa fa-spinner fa-pulse"></i><i class="mdi mdi-delete mdi-24px" v-if="!deleting"></i></span>
    </div>
  </footer>
  
</div>
  <span v-show="false"> {{ refresh }} </span>
</template>


<script>

async function deleteFile(id, accessToken) {
  var outResolve;
  var promise = new Promise((resolve, reject) => {outResolve = resolve})
  var xhr_dlt = new XMLHttpRequest;
  var link = "https://www.googleapis.com/drive/v3/files/" + id
  xhr_dlt.open("DELETE", link)
  xhr_dlt.setRequestHeader('Authorization', 'Bearer '+accessToken)
  xhr_dlt.onload = function (){
    if (this.status == 204){ // 204 = success => No Content
      console.log("Deleted!")
    }
    console.log(this.response, this.status)
    outResolve()
  }
  xhr_dlt.send()
  await promise
  return true
}

import marked from "marked";
import DOMpurify from "dompurify";
import NoteEditor from './NoteEditor';
export default {
  data() {
    return {
      content: "",
      title: "",
      time: "",
      loading: false,
      toggle: false,
      deleting: false,
    };
  },
  methods:{
    test(){
      console.log(1099)
    },
    close(){
      //console.log('hello')
      
      this.$router.replace({name: 'notes'})
    },
    async dlt(){
      this.deleting = true
      this.deleting = !await deleteFile(this.$store.state.notes.selectedNote.id, this.$store.state.accessToken)
      this.close()
    }
  },
  mounted(){
    if(this.$store.state.notes.selectedNote ==""){
      this.$router.replace({name: "notes"})
      return
    }
  },
  computed: {
    async refresh() {
      this.loading = true
      
      console.log('notesrefresh')
      var noteFile = this.$store.state.notes.selectedNote;
      if (noteFile == "") return 0; //dont bother if nothing selected
      var markedownContent = await this.$store.dispatch("getFileContent", {
        fileId: noteFile.id,
        format: "raw",
      });
      console.log(markedownContent, 'md')
      
      this.content = this.$store.state.notes.noteContent;
      this.title = noteFile.name;
      this.time = noteFile.modifiedTime
      this.loading = false
      this.$store.commit('setNoteContent', '')
      this.$store.commit('setNoteContent', markedownContent)
      console.log(this.$store.state.notes.noteContent,'refresh')
      var notesView = document.getElementById("notesView")
      notesView.innerHTML = DOMpurify.sanitize(
          marked(this.$store.state.notes.noteContent)
        );
      notesView.classList.add('dynamic')
      return markedownContent;
    },
  },
  /*
  watch: {
    '$store.state.notes.noteContent': function() {
    console.log(this.$store.state.notes.noteContent,'refresh')
    var notesView = document.getElementById("notesView")
    notesView.innerHTML = DOMpurify.sanitize(
        marked(this.$store.state.notes.noteContent)
      );
    notesView.classList.add('dynamic')
    }
  },*/
  components:{
    NoteEditor
  },
  beforeRouteLeave (to, from, next) {
    
    if(to.name == 'notes'){
      console.log(to, from, 'router')
      this.$store.commit('setSelectedNote', '')
      this.$store.commit('setNoteContent', '')
      this.$store.dispatch('refreshNotes')
    }
    next()
  }
  
  /*
    props:{
        content: String
    }*/
};
</script>

<style scoped>
.notes-view-wrapper{
}
.load{
  width: 100vw;
  margin: 50vh 25vw;
}
.title, .subtitle{
  color: lightslategrey;
  font-family: monospace;
  max-width: 95vw;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.notes-view-header .title{
  grid-column: 2;
  text-align: right;
  grid-row: 1;
}
.notes-view-header .icon{
  grid-column: 1;
  text-align: right;
}
.danger{
  color: hsl(348, 86%, 61%);
}
.divider {
  text-transform: lowercase;
}

.notes-view-header{
    position: sticky;
    top: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
    gap: 1em 1em;
    grid-template-areas: ". .";
    padding: 0.75rem 1rem 0 0.75rem;
    color: lightslategrey;
}
.notes-view-footer{
  position: fixed;
  bottom: 0;
  width: 100vw;
  padding: 1rem 0 1rem 0
}
.footer-menu{
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  gap: 1em 1em;
  grid-template-areas:
    ". . . . .";
  color: lightslategrey;
}
.footer-menu .edit{
  grid-column: 1;
  text-align: center;
  width: 100%;
}
.footer-menu .time{
  text-align: center;
  grid-column: 2/5;
  grid-row: 1;
  width: 100%;
}
.footer-menu .dlt{
  grid-column: 5;
  text-align: center;
  width: 100%;
}
.custom{
  position: absolute;
  top: 0.75rem;
}
.box{
    background-color: rgb(12, 12, 12);
    color: black;
    /* overflow: auto; */
    margin: 1rem;
    margin-top: 1.5rem;
    padding: 0.75rem;
}
.content{
    max-height: 82vh;
    font-size: 0.9rem;
    overflow: auto;
}
#notesBody{
  margin-bottom: 0;
  height: 82.5vh;
  overflow: auto;
}
</style>