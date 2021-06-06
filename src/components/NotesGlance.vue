<template>
<div v-show="$store.state.notes.isInstalled">
    <div class="glance-header">
        <i class="mdi mdi-24px mdi-text"></i>
        <p class="subtitle">
            <slot></slot>
        </p>
        <span class="icon" @click="expand"><i class="mdi mdi-24px mdi-fullscreen"></i></span>
    </div>
  <div class="box notes">
      <div @click="expand" class="content glanceContent" id="glanceContent"></div>
  </div>
</div>
<div v-show="!$store.state.notes.isInstalled">
    <div class="glance-header">
        <i class="mdi mdi-24px mdi-text"></i>
        <p class="subtitle">
            notes is not installed
        </p>
        <span class="icon" @click="$router.push({name:'notes'})"><i class="mdi mdi-24px mdi-cellphone-arrow-down"></i></span>
    </div>
  <div class="box notes">
        <div class="content custom">
          <a @click="$router.push({name:'notes'})">install notes</a>
          <br><br>
          <em>(installing doesn't require any additional downloads, it just creates a notes component within the app. if already installed, please wait, your most recent note will be visible very soon)</em>
        </div>
  </div>
</div>
  <span v-show="false">{{refresh}}</span>

</template>

<script>

import marked from "marked";
import DOMpurify from "dompurify";

export default {
    data(){
        return{

        }
    },
    methods:{
        expand(){
            this.$store.commit('setSelectedNote', this.$store.state.notes.notesList[0])
            this.$store.commit('setNoteContent','')
            this.$router.push({name: 'nView'})
        }
    },
    mounted(){
        if(this.custom){
            var glance = document.getElementById("glanceContent")
            glance.classList.remove('glanceContent')
            glance.classList.add('custom')
        }
    },
    computed:{
        async refresh(){
            var markedownContent = await this.$store.dispatch("getFileContent", {
                fileId: this.$store.state.notes.notesList[0].id,
                format: "raw",
            });
            var glance = document.getElementById("glanceContent")
            glance.innerHTML = DOMpurify.sanitize(
                marked(markedownContent)
            );
            glance.classList.add('dynamic');
            return this.$store.state.notes.notesList
        }
    },
    props:['custom']
}
</script>

<style>
.notes{
    background: rgb(24, 24, 24);
}
.glance-header{
    display: grid;
    grid-template-columns: 0.15fr 1.5fr 0.25fr;
    grid-template-rows: 1fr;
    gap: 1em 1em;
    grid-template-areas: ". . .";
}
.glance-header .subtitle{
    grid-column: 2;
    width: 100%;
    padding: 0.25rem 0.25rem;
}
.glance-header .icon{
    grid-column: 3;
    width: 100%;
    text-align: right;
    padding: 1rem 0;
}
.glanceContent{
    height: 33vh;
    overflow: auto;
    text-overflow: ellipsis;
    font-size: 0.9rem;
}
.custom{
    height: 23vh;
    overflow:auto;
    text-overflow: ellipsis;
    font-size: 0.9rem;
    font-family: Poppins;
    color:unset;
}
.custom h1, .custom h2, .custom h3, .custom h4, .custom h5, .custom h6, .custom strong, .custom em{
    color: var(--o-color);
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
     border-radius: 2px;
}
.dynamic pre{
     background: var(--o-color);
     color: whitesmoke;
     border-radius: 5px;
}
.dynamic blockquote{
     background: var(--o-color);
     background: ivory;
     color: var(--m-color);
     border-radius: 2px;
}
</style>