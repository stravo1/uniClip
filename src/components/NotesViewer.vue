<template>
<div class="notes-view-wrapper">
<div class="box">
  <div class="notesHeader">
    <p class="title">{{ title }}</p>
    <p class="subtitle is-6">{{ time }}</p>
    <div class="divider">contents</div>
  </div>

  
  <div class="content" id="notesView"></div>
  <div class="notesFooter">
  </div>
</div>

<div class="card-footer">
      <button
        class="button card-footer-item is-danger"
        @click="$store.commit('setSelectedNote', '')"
      >
        Hi
      </button>
      <span class=" card-footer-item">Hi</span>
</div>

</div>
  <span v-show="false"> {{ refresh }} </span>
</template>


<script>
import marked from "marked";
import DOMpurify from "dompurify";
export default {
  data() {
    return {
      content: "",
      title: "",
      time: "",
    };
  },
  computed: {
    async refresh() {
      var noteFile = this.$store.state.notes.selectedNote;
      if (noteFile == "") return 0; //dont bother if nothing selected
      var markedownContent = await this.$store.dispatch("getFileContent", {
        fileId: noteFile.id,
        format: "raw",
      });
      this.content = markedownContent;
      this.title = noteFile.name;
      this.time = noteFile.modifiedTime;
      return markedownContent;
    },
  },
  watch: {
    content(newContent) {
      document.getElementById("notesView").innerHTML = DOMpurify.sanitize(
        marked(newContent)
      );
    },
  },
  /*
    props:{
        content: String
    }*/
};
</script>

<style scoped>
.notes-view-wrapper{
    height: 100vh;
    background-color: lightslategrey;
}
.title, .subtitle{
    color: black;
}
.divider {
  text-transform: lowercase;
}
.notesHeader{
    position: fixed;
    width: 100vw;
    top: 0;
    background-color: lightslategrey;
    box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
}
.notesFooter {
  position: fixed;
  bottom: 0;
  width: 100vw;
}
.box{
    background-color:lightslategrey;
    color: black;
    height: 95vh;
    overflow: auto;
}
 
</style>