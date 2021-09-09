<template>

<div class="settings-wrapper">
  <div class="settings-header">   
          <span @click="$router.go(-1)"><i class="mdi mdi-chevron-left mdi-24px"></i></span>
          <p class="title">settings</p>
  </div>
  <div class="settins-main">
    <div class="card">
      <header class="card-header">
        <p class="card-header-title set-title">
          &gt; DATA AND BANDWIDTH
        </p>
      </header>
      <div class="card-content">
        <ul class="settings-list">  
        <li>
          <div class="preview-size">
            <span class="item"> preview size limit: </span><output for="sliderWithValue">{{sizeLim}}</output>
            <input id="previewSize" class="slider is-fullwidth is-circle is-danger" min="0" max="60" :value="getSize" step="10" type="range" @change="previewSizeHandle">
          </div>
        </li>
        <li>
          <div class="refresh-timings">
            <span class="item"> clipboard refresh time: </span><output for="sliderWithValue">{{clipTime}}</output>
            <input id="clipboardTime" class="slider is-fullwidth is-circle is-danger" min="0" max="60" :value="getTime" step="10" type="range" @change="clipTimeHandle">
          </div>
        </li>
        </ul>
        </div>
    </div>
    <div class="card">
      <header class="card-header">
        <p class="card-header-title set-title">
          &gt; STORAGE MNAGEMENT
        </p>
      </header>
      <div class="card-content">
        under construction
        <i class="mdi mdi-account-hard-hat"></i>
        </div>
    </div>
    <div class="card">
      <header class="card-header">
        <p class="card-header-title set-title">
          &gt; DEVICE MANAGEMENT
        </p>
      </header>
      <div class="card-content">
        <ul style="disc" class="settings-list">
          <li>rename device (not yet available)</li>
          <br>
          <li @click="changeDev"><u>change device</u>
          </li>
        </ul>
      </div>
    </div>
    
  </div>
  <div class="card futer">
  
  <footer class="card-footer">
    <p class="card-footer-item">
      <span @click="$router.push({name:'about'})">
        About
      </span>
    </p>
    <p class="card-footer-item">
      <span @click="signOut" class="warning">
        Sign Out
      </span>
    </p>
  </footer>
</div>
</div>
</template>

<script>
import 'bulma-slider/dist/css/bulma-slider.min.css';

export default {
  data(){
    return {
      toggled: true,
      previewSize: "unset",
      size: ['No Preview','100kb', '500kb', '1mb', '5mb', '10mb', 'No limit'],
      actualValue : [0,100,500,1024,5*1024,10*1024,500*1024],
      time: ['2secs','5secs', '10secs', '20secs', '30secs', '1min', 'Always Manual'],
      actualTime: [2,5,10,20,30,60,1000]
    }
  },
  methods: {
    previewSizeHandle(){
      var value = document.getElementById('previewSize').value / 10;
      this.previewSize = this.size[value];
      localStorage.setItem('sizeLim', this.actualValue[value])
      this.$store.commit('setSizeLim', this.actualValue[value])
    },
    clipTimeHandle(){
      this.clipTime = this.time[document.getElementById('clipboardTime').value / 10]
      var time = document.getElementById('clipboardTime').value / 10;
      //this.previewSize = this.size[value];
      localStorage.setItem('clipTime', this.actualTime[time])
      this.$store.commit('setRefreshTime', this.actualTime[time])
    },
    changeDev(){
      //localStorage.setItem('thisDeviceId',0)
      this.$router.replace({name:'selectDevice'})
    },
    signOut(){
      this.$store.state.GAPI.auth2.getAuthInstance().signOut()
      localStorage.clear()
      this.$router.replace({name:'myDevice'})
    },
  },
  computed: {
    sizeLim(){
      if(this.$store.state.fileSizeLimit == 500*1024) return 'No limit'
      return (this.$store.state.fileSizeLimit/1024).toFixed(1) + ' mb'
    },
    clipTime(){
      if(this.$store.state.refreshTime == 1000) return 'Manual'
      return (this.$store.state.refreshTime).toFixed(0) + ' secs'
    },
    getSize(){ 
      //console.log(this.actualValue.indexOf(this.$store.state.fileSizeLimit))
      return this.actualValue.indexOf(this.$store.state.fileSizeLimit)*10
    },
    getTime(){ 
      //console.log(this.actualValue.indexOf(this.$store.state.fileSizeLimit))
      return this.actualTime.indexOf(this.$store.state.refreshTime)*10
    },
    
  }

}
</script>

<style scoped>

.settings-wrapper{
  padding: 1rem;
  white-space:nowrap;
  overflow: scroll;
  height: 95vh;
}
.settings-header .title{
     color: aqua;
     text-align: right;
}
.settings-header{
     position: sticky;
     top: 0;
     display: grid;
     grid-template-columns: 1fr 1fr;
     grid-template-rows: 1fr;
     gap: 1em 1em;
     grid-template-areas: ". .";
     padding: 0 0rem 1.5rem 0;
     color: aqua;
}
.deevaidar::after{
  content: '';
  width: 60px;
  height: 4px;
  background: rgb(255, 0, 0);
  position: absolute;
  bottom: -4px;
}
.settings-list{
  margin:1rem;
  list-style-type: disc;
}
hr{
  background-color: gray;
  height: 1px;
}
.underline {
  text-decoration-line: underline;
  text-decoration-style:dashed;
  text-decoration-color: gray;
  padding: 0 0 0 2px;
}
.futer{
  position: fixed;
  width: 100vw;
  left: 0;
  bottom: 0;
}
.card{
  background: rgb(25,25,25);
}
.warning{
  color: rgb(255, 181, 163);
}
.set-title{
  color: var(--m-color);
  font-size: larger;
}
</style>
