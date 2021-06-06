<template>
<div id="z-wrapperU" tabindex="1">
     <Search :folderId="notesFolderId" @selected="select" v-if="isSearch" />
</div>
<div class="notes-wrapper">
<!--
<NotesViewer v-if="$store.state.notes.selectedNote != ''"/>
<NoteEditor v-if="toggle" @close="close"/>
-->
<div tabindex='1' class="notesMain" @focus="isSearch =false" v-if="$store.state.notes.selectedNote == ''">
     
     <div class="notes-header">   
          <span @click="$router.replace({name:'myDevice'})"><i class="mdi mdi-chevron-left mdi-24px"></i></span>
          <p class="title">notes</p>
     </div>
    <div class="notes-glance">
     <NotesGlance>most recent note </NotesGlance>
     </div>
     <div class="notes-list">
          <aside class="menu">
               <div class="menu-label">
                    <div class="label-grid">
                         
                         <span class="icon" @click="toggleSearch"><i class="mdi mdi-24px mdi-text-search"></i></span>
                         <span class="icon end" @click="$router.push({name:'nEdit'})"><i class="mdi mdi-24px mdi-plus-box-outline"></i></span>
                         <p class="subtitle is-4">
                              all notes
                         </p>
                    </div>
               </div>
               <ul class="menu-list">
                    <li class="notes-list-member" v-for="note in notes" :key="note" @click="selectNote(note)">
                         <span class="icon"><i class="mdi mdi-text mdi-24px"></i></span>
                         <span class="note-title"> {{note.name}}</span>
                         <div class="note-time"> <span>{{$store.getters.timeFormatter(note.modifiedTime)}}</span></div> 
                    </li>
               </ul>
          </aside>
     </div>
</div>
</div>
</template>

<script>

import Search from '../components/actions/Search';

import NotesGlance from '../components/NotesGlance';

export default {
     data(){
          return{
               toggle: false,
               isSearch: false,
          }
     },
     methods:{
          toggleSearch(){
               this.isSearch = !this.isSearch;
               //console.log(this.$store.state.notes.notesList,'gg')
               document.getElementById('z-wrapperU').focus()
          },
          select(id){
               //console.log('select', this.$store.state.notes.notesList)
               this.$store.commit('setSelectedNote', this.$store.state.notes.notesList.filter(note => note.id = id)[0])
               this.$store.commit('setNoteContent','')
               this.$router.push({name: 'nView'})
          },
          selectNote(note){
               this.$store.commit('setSelectedNote', note)
               this.$store.commit('setNoteContent','')
               this.$router.push({name: 'nView'})
          },
     },
     async mounted(){
          
          if(!this.$store.state.notes.isInstalled ){
               console.log('initializing notes')
               alert('Intalling notes, it might take a minute...')
               await this.$store.dispatch('InitializeNotes')
          }
          //console.log(this.$store.state.rootFolders)
          //this.$store.dispatch('setUpNotes')
     },
     computed:{
          notesFolderId(){
               if(!this.$store.state.notes.isInstalled ){
                    return 'unset'
               }
               return this.$store.state.notes.notesFolder.id
          },
          notes(){
               return this.$store.state.notes.notesList
          }
     },
     components:{
          Search, NotesGlance
     },
}
</script>

<style>

.notes-wrapper{
     padding: 1rem;
}
.notesMain .title{
     color: aqua;
     text-align: right;
}
.notes-header{
     position: sticky;
     top: 0;
     display: grid;
     grid-template-columns: 1fr 1fr;
     grid-template-rows: 1fr;
     gap: 1em 1em;
     grid-template-areas: ". .";
     padding: 0 0rem 1.5rem 0;
     color: aqua;
}
.notes-glance{
  }
.notes-list{
     position: fixed;
     top: 65vh;
     width: 90vw;
}
.notesMain .menu-label{
     text-transform: lowercase;
     margin-bottom: 0.5rem
}
.label-grid{
    display: grid;
    grid-template-columns: 1.5fr 0.25fr 0.25fr;
    grid-template-rows: 1fr;
    gap: 1em 1em;
    grid-template-areas: ". . .";
}
.label-grid .subtitle{
    grid-column: 1;
    grid-row: 1;
    width: 100%;
    padding: 0.25rem 0.25rem;
}
.label-grid .icon{
    grid-column: 2;
    grid-row: 1;
    width: 100%;
    text-align: right;
    padding: 1rem 0;
}
.label-grid .end{
    grid-column: 3;
    grid-row: 1;
    width: 100%;
    text-align: right;
    padding: 1rem 0;
}
.label-grid .icon, .label-grid .end{
     padding: 1rem 0 0 0;
}
.notesMain .menu-list{
     height: 30vh;
     overflow: auto;
}
.notes-list-member{
     padding: 0.75rem;
     background-color: rgb(24, 24, 24);
     margin: 0.5rem 0;
     border-radius: 5px;
     color: aliceblue;
     display: flex;
}
.note-title{
     position: relative;
     padding: 0 1rem;
     font-size: larger;
     font-weight: 500;
     width: 100%;
     overflow: hidden;
     text-overflow: ellipsis;
     white-space: nowrap;
}
.note-time{
     font-size: smaller;
     width: 100%;
     /* text-align: left; */
     display: flex;
     justify-content: flex-end;
     padding: 0.3rem 0 0 0;
}

#z-wrapperU {
    z-index: 3;
    position: fixed;
    width: 100vw;
    --xyz-translate-y: -350%;
}
.dynamic{
    color:var(--m-color);
    
}
.dynamic h1, .dynamic h2, .dynamic h3, .dynamic h4, .dynamic h5, .dynamic h6, .dynamic strong, .dynamic em{
    color: var(--o-color);
}
.dynamic code{
     background: var(--o-color);
     color: whitesmoke;
}
</style>