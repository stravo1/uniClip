<template>
  <div class="modal is-active">
    <div class="modal-background" @click="close"></div>
    <div class="modal-content">
        <div class="card is-centered">
            <div class="card-header">
                <div class="card-header-title">
                    <div class="">
                        <p class="title is-4" style="text-align:left">Message Info</p>
                        
                    </div>
                </div>
            </div>
            <div class="card-content">
            <div class="content">
                <div  id='preview'>
                    <span v-html="checkForLink(message.message)"></span>
                </div>
                <div class="content">
                    <blockquote  id="info">
                        time: {{new Date(message.time).toLocaleString('en-GB', { timeZone: 'IST' })}} <br>
                        sender: {{message.sender}} <br>
                        file included: {{message.fileName}} <br>
                        type: {{message.type}} <br>
                    </blockquote>
                </div>
            </div>
            </div>
            <footer class="card-footer">
            <button class="button is-dark card-footer-item is-inverted" @click="preview" v-if="message.type != 'text'">Preview File</button>
            <button class="button is-danger card-footer-item is-inverted" @click="dlt">Delete Message</button>
            </footer>
        </div>
    </div>
  </div>
</template>

<script>
import linkifyHTMl from 'linkifyjs/html';
import DOMpurify from 'dompurify';
import marked from 'marked';

export default {
    data(){
        return{

        }
    },
    methods:{
        checkForLink(arg){
            return DOMpurify.sanitize(marked(linkifyHTMl(arg,{target: {
                    url: '_blank'
                    },
                })
              )
            )
        },  
        dlt(){
            const answer = window.confirm("Are you sure? This action can't be undone!")
            if (!answer) return false
            this.$store.dispatch('deleteMessage',this.message)
            this.$emit('close')
        },
        preview(){
            this.$store.commit('dirtyLoadFile',{name : this.message.fileName, id: this.message.fileId, size: this.message.fileSize})
            //alert('Preview of file will appear soon...')
            this.$emit('close')
        },
        close(){
            this.$emit('close')
        }
    },
    props:{
        message: Object
    },
    emits:['close']
}
</script>

<style>

.button{
    font-weight: bolder;
}
.modal{
    padding: 2rem;
}
#preview{
    font-weight:600;
    padding: 0 0 1rem 0;
}
#info, #preview{
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

</style>