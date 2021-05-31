<template>
  <div class="about-wrapper"></div>
  <div class="modal is-active">
  <div class="modal-background"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">About uniClip</p>
      <button class="delete" aria-label="close" @click="$router.go(-1)"></button>
    </header>
    <section class="modal-card-body">
    <div class="content">
      <h1>Welcome to uniClip!</h1>
      <p>
      uniClip is like a chat app but for your devices. You can quickly send messages, small files, links from one device to another with ease via uniClip!
      </p>
      <blockquote>
          This About page will be updated frequently with more info and reference pics.
      </blockquote>
      <br>
      <p>
      Skip to:
      <li><a @click.prevent="scroll('setup')">Setup</a></li>
      <li><a @click.prevent="scroll('navigation')">Navigation</a></li>
      <li><a @click.prevent="scroll('issues')">Issues</a></li>
      <li><a @click.prevent="scroll('fplans')">Future Plans</a></li>
      </p>
      <h2>Why uniClip?</h2>
      <p>
      uniClip solves a problem which I encounter very often, a problem which you might face too:
      </p>
      <h6 @click="problem=!problem"><i class="mdi mdi-chevron-right"></i><u>The problem </u></h6>
      <p v-if="problem">
      If you have multiple devices and want to quickly share texts(links), small files between them, your current options include: 
      
      <li>using Bluetooth [con: too slow],</li>
      <li>using USB [cons: cables (btw good luck sharing messages/links)]</li>
      <li>using a file sharing app [cons: shady, space consuming, full of adverts, frustrating cross-platform support] </li>
      <li>using Nearby Share or AirDrop [cons: limited to short range connections, platform specific]</li>
      <li>using Google Drive, DropBox etc.[cons : very difficult to manage over long term, too much effort just for sharing small files, links, etc],</li>
      </p>
      
      <h6 @click="solution=!solution"><i class="mdi mdi-chevron-right"></i><u>The solution</u></h6>
      <p v-if="solution">
      uniClip! although not perfect (issues discussed <a @click.prevent="scroll('issues')">later</a>) but you do get some benefits upon using uniClip: 
      <li>a familiar chatbox/chatroom like interface</li>
      <li>faster than Bluetooth speeds (speed depends on your internet connection)</li>
      <li>cross-platform support (it's an web app)</li>
      <li>requires just a browser, so no extra space consumption</li>
      <li>free and open-source, forever</li>
      <br>
      Along with these benefits you also get other features like device specific storages ('myDevice') and global storages ('allDevices') which are discussed <a @click.prevent="scroll('setup')">later</a>
      </p>
      <br>
      <h4>TLDR:</h4>
      <blockquote>sharing files and messages between devices can sometimes be a pain in the ass, uniClip  reduces that pain a lot</blockquote>
      <br>
      <h2>How to use uniClip?</h2>
      <h6 @click="setup=!setup" id="setup"><i class="mdi mdi-chevron-right"></i><u>Setup</u></h6>
      <p v-if="setup">
      Let's say you have two phones: 'phone1' and 'phone2', and one laptop: 'laptop1' (use the name of your devices, not 'phone1', 'phone2')
      <br><br>
      <u>Step 1:</u><br>Open uniClip on any of your devices (say 'phone2'). You should be redirected to the <code>Initial Setup</code> window. Register/create your first device here (in this example we register 'phone2'). <br><br>
      <blockquote>the <code>Intial Setup</code> window appears only when you use uniClip for the first time with an account, to initialize the files and folders required by the app and then create the first device.<br>Once initialized, you will manage your devices from the <code>select current device</code> menu (as we'll see next)</blockquote><br><br>
            <img src="../assets/about/init.jpg">
            <p class="caption"><i>setup the first device</i></p><br>
      
      <u>Step 2:</u><br>Keep 'phone2' aside and open uniClip on 'phone1'. You should now be redirected to <code>select current device</code> menu [instead of <code>Initial Setup</code>]. <br>But 'phone2' is not your current device is it? Nope, it's 'phone1', but that has not been registered yet. So now we create/register a new device: 'phone1'. <br>Upon clicking the 'Register',  'phone1' will be created and selected as your current device automatically. <br>Repeat the same for your 'laptop1' (or any other device)
      <br><br>
      <img src="../assets/about/dev1.jpg">
            <p class="caption"><i>register 'phone1' as a new device on your other phone</i></p><br>
      <img src="../assets/about/dev2.jpg">
            <p class="caption"><i>register 'laptop1' as a new device on your laptop</i></p><br>

      Now you have three devices setup.
      <br>
      A similar 'device list' should be visible once the setup is done on each of your devices:
      <br><br>
      <img src="../assets/about/devS.jpg">
            <p class="caption"><i>screenshot from phone2</i></p><br>


      Now you can send messages, files directly from your current device to your other devices.
      <br>Next,
      <li><u>allDevices:</u> as the name suggests, it is like a global chatroom, or like a group chat of all your devices, i.e, this chatroom is accessible to all your devices: phone1, phone2, laptop1</li>
      <li><u>myDevice:</u> entirely opposite to 'allDevices', it is a chatroom which is accessible to only the current device and none other (like a safe-vault), i.e., 'myDevice' chatroom of phone2 will not be accessible to phone1 or laptop1 and vice-versa.</li>
      <br>If you are logged out of the app, use the select current device menu to use required device<br><br>
      <blockquote>I know the setup seems complicated, but believe me it's not, I'm not good at explaining. So a demo video will be released soon</blockquote>
      </p>
      <h6 @click="navigation=!navigation" id="navigation"><i class="mdi mdi-chevron-right"></i><u>Navigation</u></h6>
      <p v-if="navigation">
      There are four swipe-gesture navigations while you are in a chatroom/chatbox and the gestures are recognized only when performed on the bottom bar. The bottom bar includes:
      <br><br>
      <img src="../assets/about/compose.jpg">
      <p class="caption"><i>message-bar</i></p>
      <img src="../assets/about/media.jpg">
      <p class="caption"><i>media-bar</i></p>


      <li>swipe up: go to home/ device list</li>
      <li>swipe down: open search bar</li>
      <li>swipe left/right: toggle the message/media bar</li>
      </p>
    <h2 id="issues">Issues</h2>
      <p class="message-body danger">Major issue: Desktop version of this app is not yet available</p>
      <p class="message-body">Other issues:
            <li>You can't forward messages</li>
            <li>You can't edit media (crop/clip) before sending</li>
            <li>You can't directly share files from other apps to uniClip</li>
            <li>You can't rename/delete devices.</li>
            <li>Uses internet connection for sharing files, so using uniClip for sharing large files is not recommended</li>

           
      </p>


    <h2 id="fplans">Future Plans</h2>
      <p class="message-body"><li>ability to take <router-link to="/notes">notes</router-link ></li>
<li>change various <router-link to="/settings">settings</router-link></li> <li>customizable themes</li><li>message forwarding</li><li>direct sharing</li><li>resumable uploads</li><li>online status</li><li>push notifications</li><li>state resumption</li><li>caching</li><li>rename/delete devices</li> and a hell lot... stay tuned</p>

    </div>
    
     </section>
<footer class="modal-card-foot">
      <a class="button is-primary" href="https://github.com/Stravo1/uniClip">Visit Github Repo</a>
      <button class="button" @click="$router.go(-1)">Go Back</button>
</footer>

    </div>
  </div>
</template>

<script>
export default {
    data(){
        return{
            problem: false,
            solution: false,
            setup: false,
            navigation: false,
        }
    },
    methods:{
        scroll(arg){document.getElementById(arg).scrollIntoView({behavior:'smooth'})}
    }
}
</script>

<style scoped>
.about-wrapper{
    background-color: #141414;
    border-radius: 7px;
    padding: 2rem;
    max-height: 85vh;
    overflow: auto;
}
.modal{
    padding: 0.75rem
}
a{
    color: #3db1f5;
}
.image{
    display: flex;
    justify-content: center;
    padding: 0.25rem;
}
.caption{
    font-size: smaller;
    font-weight: lighter;
    text-align: center
}
.danger{
    color: red;
}
</style>