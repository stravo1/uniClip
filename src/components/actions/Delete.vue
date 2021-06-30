<template>
  <a class="button is-inverted is-danger" @click.prevent="dlt(folder)" :class="cls">
      <span v-if="!loading"><slot></slot></span>
      <i v-if="loading" class="fa fa-spinner fa-pulse"></i>
  </a>
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
      //console.log("Deleted!")
    }
    //console.log(this.response, this.status)
    outResolve()
  }
  xhr_dlt.send()
  await promise
  return true
}

export default {
    data(){
        return{
            loading: false,
        }
    },
    methods: {
        async dlt(folder){
          //console.log(folder,"fld")
            if(!folder && this.$store.state.selectedFile == '') {alert("Nothing to delete, select a file..."); return}
            ////console.log(this.$store.state.selectedFile, 'ss')
            this.loading = true
            folder ? this.loading =  !await deleteFile(this.$store.state.selectedFolder.id, this.$store.state.accessToken) : this.loading =  !await deleteFile(this.$store.state.selectedFile.id, this.$store.state.accessToken)
            
            //bug_fix
            var prevFolders = this.$store.state.previousFolders
            var arg = {
              name: prevFolders[prevFolders.length - 1],
              flow: 'backward'
            }
            //console.log(arg)
            this.$store.commit('setSelectedFolder', arg)
            //bug_fix_end
            this.$store.dispatch('refreshFilesList')
            this.$store.dispatch('refreshFoldersList')
            this.$emit('complete')
        }
    },
    props:{
      folder: Boolean,
      cls: String
    },
    emits: ['complete']
}
</script>

<style>

</style>