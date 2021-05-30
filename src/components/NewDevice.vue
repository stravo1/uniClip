<template>
<div class="field has-addons">
  <div class="control has-icons-left is-expanded">
    <input class="input" type="text" placeholder="Register new device" @focus="focused = true" @blur="focused = false" v-model="name">
    <span class="icon is-small is-left">
      <i class="mdi mdi-plus-box"></i>
    </span>
  </div>
  <div class="control">
    <a class="button is-danger" @click="start">
      <span v-if="!loading">Register</span>
      <i v-if="loading" class="fa fa-spinner fa-pulse"></i>
    </a> <!--changed start() to start-->
  </div>
</div>
<p class="help is-danger" v-show="focused">You will NOT be able to change names later!</p>
</template>

<script>
const createFolder = async(accessToken, name, parent, last=false) => {
  var outResolve, response;
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


    fileType = 'application/vnd.google-apps.folder';
    fileName = name ;
  
  if(last){
    fileContent = '{"messages":[]}'
    fileType = 'application/json'
  }

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
export default {
    data(){
        return{
          focused:false,
            //deviceList: ['devce1','device2','device3'],
            name:'',
            loading: false,
        }
    },
    methods:{
      async start(){
        this.loading = true;
        var folders = this.folders;
        var mediaList = ['audio','docs','vids','pics']
        var accessToken = this.$store.state.accessToken
        var name = this.name
        //handling this in other devices
        for(var i = 0; i < folders.length; i++){
          var createdThisDeviceInOthers = await createFolder(accessToken,name,folders[i].id)
          console.log('created ',name,' in ', folders[i].name)
          for(var j = 0; j < mediaList.length; j++){
            await createFolder(accessToken, mediaList[j], createdThisDeviceInOthers.id)
            console.log('created ', mediaList[j], ' in me')
          }
          await createFolder(accessToken,'messages.json',createdThisDeviceInOthers.id, true)
          console.log('messages done')
        }
        console.log("this in others completed")
        //handling others in this device
        var createdThisDeviceInRoot = await  createFolder(accessToken,name,'appDataFolder')
        if(this.init){
          await createFolder(accessToken, 'initialized.json', 'appDataFolder', true)
          var allDevices = await createFolder(accessToken, 'allDevices', 'appDataFolder');
          for(var a = 0; a < mediaList.length; a++){
            await createFolder(accessToken, mediaList[a], allDevices.id)
          }
          console.log('allDevices Done')
          await createFolder(accessToken, 'messages.json', allDevices.id, true)
          console.log('messages done, all devices')
        }
        folders.push({name:'myDevice'})
        console.log('created ',name,' in root')
        for(var k = 0; k < folders.length; k++){
          var othersInThis = await createFolder(accessToken,folders[k].name, createdThisDeviceInRoot.id)
          console.log('created ',folders[k].name, ' in me')
          for(var m = 0; m < mediaList.length; m++){
            await createFolder(accessToken,mediaList[m],othersInThis.id)
            console.log('created ',mediaList[m],' in ', folders[k].name, ' in me')
          }
          await createFolder(accessToken,'messages.json',othersInThis.id, true)
          console.log('messages done')
        }
        localStorage.setItem('thisDeviceId', createdThisDeviceInRoot.id)
        this.$router.push({name: 'myDevice'}) //added on 26th may
        this.loading = false

      }
    },
    props:{
      folders: Array,
      init: Boolean,
    }
}
</script>

<style>

</style>