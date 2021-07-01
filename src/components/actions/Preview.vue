<template>
    <div class="modal" :class="{'is-active' : isActive}">
    <div class="modal-background" @click="close"></div>
    <div class="modal-content">
        <div class="card is-centered">
            <div class="card-header">
                <div class="card-header-title">
                    <div class="">
                        <p class="title is-4" style="text-align:left">Preview</p>
                        
                    </div>
                </div>
            </div>
            <div class="card-content">
            <div class="content">
                <div  id='preview'>
                    Preview of file will appear here...
                </div>
                <div class="content">
                    <blockquote  id="info">
                        info of file will appear here...
                    </blockquote>
                </div>
            </div>
            </div>
            <footer class="card-footer">
            <button class="button is-dark card-footer-item is-inverted" @click="share">Share</button>
            <button class="button is-dark card-footer-item is-inverted" @click="download">Download</button>
            <button class="button is-danger card-footer-item is-inverted" @click="dlt">Delete</button>
            </footer>
        </div>
    </div>
  </div>
    <!--
    <div class="box">
      <p class="subtitle is-6" v-if="!isSelected">Preview of selected files will appear here</p>
      <div id="holder"></div>
  </div>
  <div class="container" id="info" v-show="isSelected"> <!- handy v-show, try using if to see the problem--

  </div>
  -->
 <span v-show="false">{{ refresh }}</span>
</template>

<script>
import {toast} from 'bulma-toast';
var Nanobar = require('nanobar/nanobar')
var nanobar = new Nanobar()

var fileSize
function updateProgress(progress){
    //console.log(progress)
    var percent;
    if(progress.lengthComputable){
        percent = (progress.loaded / progress.total) * 100;
    }
    else{
        percent = (progress.loaded / fileSize) * 100;
    }
    nanobar.go(percent)
}
const blobMaker = async(fileId, accessToken) => {
  var blob, type, outResolve;
  const tmp = new Promise((resolve, reject) => {outResolve = resolve})
  //for returning
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://www.googleapis.com/drive/v3/files/"+fileId+'?alt=media', true);
  xhr.setRequestHeader('Authorization','Bearer '+accessToken);
  xhr.responseType = 'arraybuffer'
  xhr.onprogress = updateProgress
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
        if(type=="application/json"){
            var arrayBufferToJSON  = JSON.parse(String.fromCharCode.apply(null, new Uint8Array(this.response)))
            if(arrayBufferToJSON.messages){
                //console.log('Messege found')
                blob = arrayBufferToJSON.messages
                outResolve()
                return [blob,type]
            }
        }
        blob = new Blob([this.response], { type: type })
        }
        if (this.status === 404) {
            toast({
                message: 'File is missing',
                type: 'is-dark',
                pauseOnHover: false,
                position: 'bottom-center',
                closeOnClick: true,
                animate: { in: 'fadeIn', out: 'fadeOut' },
            })
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
const urlMaker = async(file, accessToekn) => {
    /*if(file.size > 500*1000){
        //console.log("too big to preview!!")
        var html = "<embed style='width : 50vw' src='" + "../../assets/error.png'" + "'id='preview' type='"+file.type+"'>"
        document.getElementById('preview').innerHTML=html
 
        var html2 = "<p class='title is-5'>Name: " + file.name + "</p>"+"<p class='subtitle is-5'>Type: " + file.type + "</p>"
        document.getElementById('info').innerHTML=html2
        return true
    }*/ //future feature

    var id = file.id
    var name = file.name
    var response = await blobMaker(id, accessToekn);
    var blob = response[0];
    //console.log(blob)
    if(Array.isArray(blob)){
        var html_message = "<blockquote><p>"+JSON.stringyfy(blob)+"</p></blockquote>"
        document.getElementById('preview').innerHTML = html_message
        return [blob,name]
    }
    var filename = name;
    var downloadUrl;
    if (typeof window.navigator.msSaveBlob !== 'undefined') {
        // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
        window.navigator.msSaveBlob(blob, filename);
    } else {
        //console.log('elseee')
        var URL = window.URL || window.webkitURL;
        downloadUrl = URL.createObjectURL(blob);

    }
    /*
    var embed = document.createElement('embed')
    embed.type = response[1]
    embed.src = downloadUrl
    embed.height = embed.width = "200px"
    document.getElementById('holder').appendChild(embed)
    return downloadUrl
    */
    //console.log(110)
    
    var html = "<a target='_blank' href='" + downloadUrl + "'><embed style='max-width : 50vw' src='" + downloadUrl + "'id='preview' type='"+response[1]+"'></a>"
    document.getElementById('preview').innerHTML=html
    
    var html2 = "<p class='title is-6'>name: " + name + "</p>"+"<span></span><p class='subtitle is-6'>type: " + response[1] +"<br>size: " + (blob.size/1024).toFixed() + "kb</p>"

    document.getElementById('info').innerHTML=html2
    return [blob, name]
}

const download = async(arg) => {
  var blob = arg[0];
  var filename = arg[1];
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
  }
}

async function share(arg) {
    //console.log(arg)
  var blob = arg[0];
  var type = arg[1];
  var name = arg[2]
  var file = new File([blob], name, {type: type});
  var filesArray = [file];
  var shareData = {
      title: name,
      files: filesArray,
      text: 'Shared via uniClip: '+ name,
    }
    return shareData;
}
export default {
    data(){
        return{
            isActive:false,
            req:[]
        }
    },
    methods:{
        close(){
            this.$emit('complete')
        },
        download(){
            download(this.req)
        },
        async dlt(){ //add Are You Sure prompt
            const answer = window.confirm("Are you sure? This action can't be undone!")
            if (!answer) return false
            await this.$store.dispatch("deleteFiles",{id:this.$store.state.selectedFile.id, toast:true})
            this.close()
        },
        async share(){
            var resultPara = {}
            var req = this.req
            try {
                var shareData = await share([req[0], req[0].type, req[1]])
                await navigator.share(shareData)

                resultPara.textContent = 'MDN shared successfully'
            } catch(err) {
                resultPara.textContent = 'Error: ' + err
                //console.log(JSON.stringify(resultPara))
            }
        }
    },
    computed:{
        async refresh(){
            //console.log(108)
            var file = this.$store.state.selectedFile
            //console.log("fileeee",file, "file")
            if(file){
                fileSize = file.size
                nanobar.go(5)
                this.req = await urlMaker(file,this.$store.state.accessToken)
                this.isActive = true
                
            }
            else{
                this.isActive = false
            }
        }
    },
    emits:['complete']
}
</script>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
.box{
  width: 75vw;
  right: 0;
  left: 0;
  margin-right: auto;
  margin-left: auto; 
}
.subtitle{
    font-family: 'VT323', monospace;
}
#preview {
    display:flex;
    justify-content:center;
    padding: 0 0 1rem 0;
}
#info{
    font-size:smaller;
}
.button{
    font-weight: bolder;
}
.modal{
    padding: 2rem;
}
</style>