<template>
<aside class="menu">
  <p class="menu-label">
    from {{ this.$route.params.device }}
  </p>
  <ul class="menu-list media-wrapper">
<XyzTransitionGroup xyz="fade down">
    <li v-if="$store.state.filesList.length"><a v-for="file in this.$store.state.filesList.filter(file =>file.name!='messages.json') " :key="file" @click.capture="selectFile(file.id)">
        <div class="fl">
            <div class="fl-icon">
                <i class="mdi mdi-24px" :class="{'mdi-image': file.mimeType.includes('image'),'mdi-video': file.mimeType.includes('video'),'mdi-file -document': file.mimeType.includes('application') || file.mimeType.includes('text'),'mdi-volume-high': file.mimeType.includes('audio')}"></i>
            </div><div class="fl-name">{{file.name}}</div>
        </div>
</a></li>
</XyzTransitionGroup>
  </ul>
</aside>
</template>

<script>
export default {
    created(){
        this.$watch(
            () => this.$route.params,
            () => {
                console.log(108)
                this.$store.dispatch('refreshFilesList')
        },
            // fetch the data when the view is created and the data is
            // already being observed
            { immediate: true }
        )
    },
    mounted(){
      if(!this.$store.state.signInState){alert('Please sign in first....'); this.$router.push({name: 'myDevice'})}
      console.log('muntred')
      this.$store.commit('setIsInMessageState',false)
    },
    methods:{
      selectFile(arg){
        this.$store.commit('setSelectedFile',arg)
      }
    },
    beforeRouteLeave (to, from, next) {
      this.$store.commit('setIsInMessageState',true)
    }
}
</script>

<style>
 .media-wrapper{

    border-radius: 7px;
    height: 70vh;
    overflow: auto
}
.menu-label{
    position: relative;
    text-align: right;
    padding: 0.5rem 1rem;
    text-transform: lowercase;
    color: #75d5fd;
    font-weight: 600;
}
.fl{
    display: flex;
    padding: 0.5rem;
    border-radius: 7px;
    background-color: unset;
}
.fl-icon{
    align-self: flex-start;
    position: relative;
    color: whitesmoke;
    margin: -0.3rem 0;
}
.fl-name{
    align-self: center;
    width: 90vw;
    overflow:hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding: 0rem 0rem 0 0.5rem;
    font-weight: 500;
    color: whitesmoke;
}
</style>