<template>
  <a class="button is-inverted is-primary" @click.prevent="dwn">
      <span v-if="!loading">Download</span>
      <i v-if="loading" class="fa fa-spinner fa-pulse"></i>
  </a>
</template>

<script>

const blobMaker = async(fileId, accessToken) => {
  var blob, type, outResolve;
  const tmp = new Promise((resolve, reject) => {outResolve = resolve})
  //for returning
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://www.googleapis.com/drive/v3/files/"+fileId+'?alt=media', true);
  xhr.setRequestHeader('Authorization','Bearer '+accessToken);
  xhr.responseType = 'arraybuffer'
  xhr.onload = function () {
    if (this.status === 200) {
        /*for existing file clash*/
        /*
        var disposition = xhr.getResponseHeader('Content-Disposition');
        if (disposition && disposition.indexOf('attachment') !== -1) {
            var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            var matches = filenameRegex.exec(disposition);
            if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
        }
        */
        type = xhr.getResponseHeader('Content-Type');
        blob = new Blob([this.response], { type: type })
        }
        //console.log(xhr.getResponseHeader('Content-Type'),'hh')
        outResolve()
        //console.log("came here at last last")
        //console.log(this.status)
      }
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      //xhr.send($.param(params));
      //xhr.withCredentials = true;
      xhr.send();
      await tmp;
      //console.log('bye')
      //console.log(blob,type)
      return [blob,type]
  };
 
const download = async(id,name, accessToekn, bool=false) => {
  var response = await blobMaker(id, accessToekn);
  var blob = response[0];
  var filename = name;
  var downloadUrl;
  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
    window.navigator.msSaveBlob(blob, filename);
  } else {
    //console.log('elseee')
    var URL = window.URL || window.webkitURL;
    downloadUrl = URL.createObjectURL(blob);
    if (filename) {
      // use HTML5 a[download] attribute to specify filename
      var a = document.createElement("a");
      // safari doesn't support this yet
      if (typeof a.download === 'undefined') {
        window.location = downloadUrl;
      } else {
        //console.log('else2')
        a.href = downloadUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
      }
    } else {
      window.location = downloadUrl;
      
    }
    /*
    if (bool){
    setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100); // cleanup
        }
    return downloadUrl;
    */
  }
  return true
}



export default {
    data(){
        return{
            loading: false
        }
    },
    methods: {
        async dwn(){
            if(this.$store.state.selectedFile == '') {alert("Nothing to download, select a file..."); return}
            this.loading = true;
            var id = this.$store.state.selectedFile.id
            var name = this.$store.state.selectedFile.name
            var accessToken = this.$store.state.accessToken
            this.loading =  !await download(id, name, accessToken)
            this.$emit('complete')
        }
    },
    emits: ['complete']
}
</script>

<style>

</style>