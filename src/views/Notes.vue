<template>
<NotesViewer v-if="$store.state.notes.selectedNote != ''"/>
<div class="notesMain" v-if="$store.state.notes.selectedNote == ''">
     <p class="title">Notes</p>
     <li v-for="note in $store.state.notes.notesList" :key="note" @click="$store.commit('setSelectedNote', note)"> {{note}} </li>
</div>

</template>

<script>


import NotesViewer from '../components/NotesViewer';

export default {
     data(){
          return{

          }
     },
     mounted(){
          this.$store.dispatch('setUpNotes')
     },
     components:{
          NotesViewer
     }
}
</script>

<style>
.notes-wrapper{
     text-align: center;
     padding: 2rem;
}
.title{
     color: antiquewhite;
}
</style>