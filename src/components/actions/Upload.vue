<template>
  <a v-if="!slotUsed" class="button is-inverted is-info" @click.prevent="upld('folder')" :class="cls">
      <span v-if="!loading">Upload Folder</span>
      <i v-if="loading" class="fa fa-spinner fa-pulse"></i>
  </a>
  <a @click.prevent="upld(false)" v-if="slotUsed" class="button is-outlined is-info"> <!-- had to pass(false) to pld cos by defalut it passes $event-->
    <slot v-if="!loading"></slot>
    <i v-if="loading" class="fa fa-spinner fa-pulse"></i>
  </a>
</template>

<script>

const uploadFiles = async(accessToken, content, parent) => {
  var outResolve,response;
  var promise = new Promise((resolve, reject) => {outResolve = resolve})
  var xhr_up = new XMLHttpRequest;
  xhr_up.open("POST","https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart")
  xhr_up.setRequestHeader('Authorization', 'Bearer '+ accessToken)
  xhr_up.onload = function(){
    if (this.status == 200){
      console.log("Uploaded", this.response)
      response = JSON.parse(this.response)
    }
    else {
      console.log("error", this.status)
    }
    outResolve()
  }
  var fileContent, fileType, fileName
    fileContent = content
    fileType = fileContent.type;
    fileName = fileContent.name;

  
  

  var metadata = {
    'name' : fileName,
    'mimeType' : fileType,
    'parents': [parent]
  }
  
  var file = new Blob([fileContent], {type: fileType});
  
  var data = new FormData();
  data.append("metadata", new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
  data.append("file", file);
   
  xhr_up.send(data)
  await promise
  return response
}

const sendMessage = async(message, parent, accessToken, device, selectedDevice, filetype='text',fileid=null, fileName = null) => {
  //alert(selectedDevice)
  var body = '{"messages":[{"message":"'+ message + '", "time" : '+ JSON.stringify(new Date()) + ',"type":"'+filetype+'","fileId":"'+fileid+'","sender":"'+ device + '","fileName":"'+ fileName + '","context":"received"}]}'
  console.log(body,"body")
  if(selectedDevice == 'allDevices' || selectedDevice == 'myDevice'){
    //alert('In all deivces')
    return body
  }
  var outResolve;
  var promise = new Promise((resolve, reject) => {outResolve = resolve})
  var xhr_up = new XMLHttpRequest;
  xhr_up.open("POST","https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart")
  xhr_up.setRequestHeader('Authorization', 'Bearer '+ accessToken)
  xhr_up.onload = function(){
    if (this.status == 200){
      console.log("Uploaded", this.response)
    }
    else {
      console.log("error", this.status)
    }
    outResolve()
  }
  var fileContent, fileType, fileName

    fileContent = body
    fileType = 'application/json';
    fileName = 'newnotification'+ JSON.stringify(new Date().getTime());
  

  var metadata = {
    'name' : fileName,
    'mimeType' : fileType,
    'parents': [parent]
  }
  
  var file = new Blob([fileContent], {type: fileType});
  
  var data = new FormData();
  data.append("metadata", new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
  data.append("file", file);
   
  xhr_up.send(data)
  await promise
  return body
}

const matchMedia = (arg) => {
  console.log('mediaArg',arg)
  if(arg.includes('image')) return 'pics'
  else if (arg.includes('video')) return 'vids'
  else if (arg.includes('audio')) return 'music'
  else return 'docs'
}

export default {
    data(){
        return{
          loading: false,
        }
    },
    methods: {
        async upld(folder){
            //make it less repeating as both if else has almost same code
            /*
            if(!this.uploadContent[0] && !this.uploadContent[1].length){alert('Nothing to upload'); return}
            console.log(folder)
            var accessToken = this.$store.state.accessToken
            var parent = this.$store.state.selectedFolder.id
            
            if(folder && this.uploadContent[0]){
              this.loading = true
              
              this.loading = !await uploadFiles(accessToken, this.uploadContent[0], false, true, parent)
              console.log('folder done')
            }
            if(!folder && this.uploadContent[0]){
                this.loading = true
                this.loading = !await uploadFiles(accessToken, this.uploadContent[0], true, false, parent)
                console.log('text done')
                
            }
            if(this.uploadContent[1].length){
                this.loading = true
                this.loading = !await uploadFiles(accessToken, this.uploadContent[1][0], false, false, parent)
                console.log('file done')
            }
            */
           if(!this.uploadContent[0] && !this.uploadContent[1].length){alert('Nothing to upload'); return}

           this.loading = true
           var files = this.uploadContent[1]
           var txt = this.uploadContent[0].replace(/\n/g,'<br>').replace(/"/g, "'")
           var accessToken = this.$store.state.accessToken
           var selectedDevice = this.$store.state.selectedDevice.name
           var device = this.$store.state.myDevice.name
           if(!files.length){
              var body = await sendMessage(txt, this.$store.state.fU.id, accessToken, device, selectedDevice)
              console.log(body)
              var inMyMessageList = JSON.parse(body).messages[0]
              inMyMessageList.context = 'sent'
              console.log(inMyMessageList,"inm")
              this.$store.state.messagesList.push(inMyMessageList)
              //this.$store.dispatch('refreshFilesList')
              //this.$store.dispatch('refreshFoldersList')
              this.$store.dispatch('patchMessageFile')
              this.$emit('complete')
           }
           else{
             for(var i = 0; i < files.length; i++){
               var mediaFolder = matchMedia(files[i].type)
               console.log(files, files[i], mediaFolder,"mtype folder")
               var parentId = this.$store.state.recievingDeviceMediafolders.filter(folder => folder.name == mediaFolder)[0].id
               var fileId = await uploadFiles(accessToken,files[i],parentId)
               var caption;
               if(!this.uploadContent[0]){
                 caption = files[i].name
               }
               else{
                 caption = this.uploadContent[0]
               }
               var body = await sendMessage(caption,this.$store.state.fU.id, accessToken, device, selectedDevice, files[i].type, fileId.id, files[i].name)
               var inMyMessageList = JSON.parse(body).messages[0]
               //console.log(inMyMessageList,'oriiginal', inMyMessageList.context,'context')
               inMyMessageList.context = 'sent'
               console.log(inMyMessageList,"inm")
               this.$store.state.messagesList.push(inMyMessageList)
             }
             this.$store.dispatch('patchMessageFile')
             this.$emit('complete')

           }

        this.loading = false

        }
    },
    props:{
        uploadContent: Array,
        slotUsed: Boolean,
        cls: String,
    },
    emits: ['complete']
}
</script>

<style>

</style>