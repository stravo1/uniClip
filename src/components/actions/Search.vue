<template>
<div class="search-wrapper">
  <nav class="panel">
  <div class="panel-block">
    <p class="control has-icons-left">
      <input class="input" type="text" placeholder="search files..." v-model="searchText">
      <span class="icon is-left">
        <i class="fa fa-search" aria-hidden="true"></i>
      </span>
    </p>
  </div>
  <p class="panel-tabs">
    <a tabindex="0" @click="setParent('all'), setActive('all')" class='all'>all</a>
    <a tabindex="0" :class="media.name" v-for="media in $store.state.mediaFolders" :key="media" @click.prevent="setParent(media.id), setActive(media.name)">{{ media.name }}</a>
    
</p>
  
  <a 
  class="panel-block" 
  v-for="file in $store.state.filesList.filter(file => file.name != 'messages.json' && !file.name.includes('newnotification'))"
  :key="file"
  @click="setSelected(file.id)">
    <span class="panel-icon is-medium">
      <i class="mdi mdi-18px" :class="{'mdi-image': file.mimeType.includes('image'),'mdi-video': file.mimeType.includes('video'),'mdi-file-document': file.mimeType.includes('application') || file.mimeType.includes('text'),'mdi-volume-high': file.mimeType.includes('audio')}"></i>

    </span>
    {{file.name}}
  </a>
  
  </nav>
</div>
</template>

<script>
export default {
    data(){
        return{
            searchText: null,
            parentMedia: 'all',
        }
    },
    methods:{
        setParent(arg){
            this.parentMedia = arg
        },
        setSelected(arg){
            this.$store.commit('setSelectedFile',arg)
        },
        setActive(arg){ //so much of work man... bulma really fucks up sometimes... maybe... or its somehow my fault//
            var menuElse = this.$store.state.mediaFolders.filter(media => media.name != arg)
            menuElse.push({name:"all"})
            this.onFocus(arg)
            //alert((menuElse))
            for(var i = 0; i < menuElse.length; i++){
                 this.onBlur(menuElse[i].name)
            }
        },
        onFocus(arg){
          //alert('focused: ' + JSON.stringify(arg))

          document.getElementsByClassName(arg)[0].classList.add('is-active')
         },
        onBlur(arg){
           //alert('blurred: ' + JSON.stringify(arg))
           document.getElementsByClassName(arg)[0].classList.remove('is-active')
        }

    },
    watch:{
        async searchText(newText){
            if(this.parentMedia == 'all'){ //global search workaround
                var allFolders = this.$store.state.mediaFolders
                var filesList = []
                for(var i = 0; i < allFolders.length; i++){
                    var arg = {name : this.searchText, folder : allFolders[i].id, mType : null}
                    var list = await this.$store.dispatch('searchFiles', arg)
                    filesList = filesList.concat(list)
                }
                this.$store.commit('setFilesList', filesList.filter(file => file.mimeType != 'application/vnd.google-apps.folder'))
                return
            }
            var arg = {name : newText, folder : this.parentMedia, mType : null}
            var list = await this.$store.dispatch('searchFiles', arg)
            console.log(list,'listtt')
            this.$store.commit('setFilesList', list.filter(file => file.mimeType != 'application/vnd.google-apps.folder'))
        },
        async parentMedia(newParent){
            
            if(newParent == 'all'){ //global search workaround
                var allFolders = this.$store.state.mediaFolders
                var filesList = []
                for(var i = 0; i < allFolders.length; i++){
                    var arg = {name : this.searchText, folder : allFolders[i].id, mType : null}
                    var list = await this.$store.dispatch('searchFiles', arg)
                    filesList = filesList.concat(list)
                }
                this.$store.commit('setFilesList', filesList.filter(file => file.mimeType != 'application/vnd.google-apps.folder'))
                return
            }
            var arg = {name : this.searchText, folder : newParent, mType : null}
            var list = await this.$store.dispatch('searchFiles', arg)
            console.log(list,'listtt')
            this.$store.commit('setFilesList', list.filter(file => file.mimeType != 'application/vnd.google-apps.folder'))
        }
    }
}
</script>

<style scoped>

.search-wrapper{
    padding: 1rem 1rem 0 1rem;
    backdrop-filter: blur(2px);
    background-color: rgba(00, 00, 00, 0.625);
    border-radius: 7px;

}
.panel-tabs{
    max-width: 98vw;
    overflow: auto;
    font-size: 1.25rem;
    font-weight: 600;
}
.panel-block{
    color: #75d5fd;
    font-weight:500;
}
.panel-icon{
    color: #75d5fd;
}

.all{
    color: #ff2079
}
</style>