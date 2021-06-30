<template>
<div class="note-editor-wrapper">
    <section class="note-editor-main">
                <div class="editor-header">
                    <div class="field has-addons">
                        <p class="control is-expanded">
                            <input class="input" type="text" :placeholder="placeholder" v-model="title" @click="fill">
                        </p>
                    </div>
                </div>
                <br>
                <textarea v-model="content" class="textarea is-focused" placeholder="your note here..." :disabled='title == "" && $store.state.notes.selectedNote ==""'></textarea>
    </section>
</div>
    <footer class="note-editor-footer">
        <span class="icon edit"  @click="save"><i v-if="saving" class="fa fa-spinner fa-pulse fa-lg"></i><i v-if="!saving" class="mdi mdi-progress-check mdi-24px"></i></span>
      <span class="time">markdown format</span>
      <span class="icon dlt" @click="close(0)"><i class="mdi mdi-close-circle-outline mdi-24px"></i></span>
    </footer>
</template>

<script>
export default {
    data(){
        return{
            title: '',
            oldContent: '',
            saving: false,
            autosave: true,
        }
    },
    methods:{
        async save(){
            var title;
            if(this.content == '') {this.$emit('close'); return}
            this.title == '' ? title = this.$store.state.notes.selectedNote.name : title = this.title
            this.saving = true
            var file = await this.$store.dispatch('saveNote', title)
            file['modifiedTime'] = 'just now'
            this.saving = false
            this.autosave = false;
            this.close(file)
        },
        async close(arg){
            if (arg) {
                this.$store.commit('setSelectedNote', arg)
                this.$router.replace({name: 'nView'})
                this.$store.dispatch('refreshNotes')
                //this.$store.commit('setNoteContent', '')
                this.saving = false
                //this.$emit('close', file)
            } else {
                console.log(1088)
                this.$store.commit('setNoteContent', this.oldContent)
                this.$router.replace({name: 'nView'})
                //this.$emit('close')
            }
        }
    },
    mounted(){
         if(!this.$store.state.signInState){alert('Please sign in first....'); this.$router.replace({name: 'myDevice'})}
        if(!this.$store.state.notes.isInstalled){alert('Please install notes in first....'); this.$router.replace({name: 'notes'})}

        console.log('editor mounted')
        this.oldContent = this.$store.state.notes.noteContent
    },
    computed: {
        content: {
            get () {
            return this.$store.state.notes.noteContent
            },
            set (value) {
            this.$store.commit('setNoteContent', value)
            }
        },
        placeholder(){
            if(this.$store.state.notes.selectedNote == '') return 'your title here...'
            return this.$store.state.notes.selectedNote.name
        },
        fill(){
           if(this.placeholder == 'your title here...') this.title = ''
           else this.title = this.placeholder
        }
    },
    emits:['close'],
    async beforeRouteLeave (to, from, next) {
        
        var title;
        if(this.content == '' || this.content == this.oldContent || !this.autosave) {this.$emit('close'); next(); return}
        if(this.$store.state.notes.selectedNote == ''){
            //alert("new save")

            this.save()
            return
        }
        this.title == '' ? title = this.$store.state.notes.selectedNote.name : title = this.title
        this.saving = true
        var file = await this.$store.dispatch('saveNote', title)
        file['modifiedTime'] = 'just now'
        this.saving = false
        this.$store.commit('setSelectedNote', file)
        next()
    }
}
</script>

<style scoped>

.note-editor-main{
    height: 100vh;
    border-radius: 7px 7px 0 0;
    padding: 1rem;
}
.note-editor-footer{
    position: fixed;
    bottom: 0;
    width: 100vw;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr;
    gap: 1em 1em;
    grid-template-areas:
        ". . . . .";
    color: lightslategrey;
    padding: 0 0 0.25rem 0;
    background: black;
}
.note-editor-footer .edit, .note-editor-footer .time, .note-editor-footer .dlt{
    display: flex;
    justify-content: center;
    align-items: center;
}

.note-editor-footer .edit{
  grid-column: 1;
  text-align: center;
  width: 100%;
}
.note-editor-footer .time{
  text-align: center;
  grid-column: 2/5;
  grid-row: 1;
  width: 100%;
}
.note-editor-footer  .dlt{
  grid-column: 5;
  text-align: center;
  width: 100%;
}
.editor-header{
    position: sticky;
    width: 100%;
}
.icon{
    padding: 1rem 1rem;
}
.input, .textarea{
    background: black;
    color: grey;
}
.textarea{
    width: 100%;
    height: 80%;
}
.danger{
  color: hsl(348, 86%, 61%);
}

::placeholder{
    color:slategrey;
    font-size: larger;
}
</style>