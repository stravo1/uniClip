<template>
  <div class="about-wrapper">
    <div class="content">
      <h1>Welcome to uniClip!</h1>
      <br>
      <blockquote>
          This About page will be updated soon with more info and reference pics.
      </blockquote>
      <br>
      <h2>Why uniclip?</h2>
      If you have multiple devices and want to very quickly share small files, links, etc. between them your options include 
      <li>uploading to Google Drive/ DropBox (or any other cloud storage services),</li> 
      <li>using Bluetooth,</li>
      <li>using USB (for transfers between phone and PC)</li>
      <li>using a file sharing app</li>
      <li>using Nearby Share (between android devices only)</li>
      <br>
      Each of the above options are either slow(Bluetooth) or just too much effort for quickly sharing small files and links.
      <br>
      uniClip makes this process easier by using a familiar chatbox/chatroom like interface for sharing files, no need for Bluetooth or Wi-Fi.
      <br>
      No need to open or even install any app (if you are short on storage) as uniClip runs on web, so you just need a browser (although you can install the webapp if you wish to)
      <br>
      Moral of the story:
      <br>  
      <blockquote>uniClip is like a chat app but for your devices. You can easily and quickly send messages, small files, links from one device to another.</blockquote>
      <br><br><br>
      <h2>How to use uniClip?</h2>
      Let's say you have two phones: 'phone1' and 'phone2', and one Laptop: 'laptop1'.
      <br>
      <li>You open uniClip on any of the devics and register that device with it's name in the 'Initial Setup' window.</li>
      <li>Then you open uniClip on your other devices and register each of them as new devices with their resp. name in the 'select device' window.</li>
      Now you have three devices setup.
      <br>
      In the 'device list' (comparable to 'contacts' in other chat apps) of all your devices you will have 'myDevice' and 'allDevices'.
      <br>
      'myDevice' is like a chatroom which is accessible to only that specific device and none other (like a safe-vault), while 'allDevices' as the name suggests, is like a global chatroom accessibleto all your devices.

      <h2>Navigation:</h2>
      There are four gesture navigations while you are in a chatroom/chatbox:
      <li>swipe up from bottom: go to home/ device list</li>
      <li>swipe down from bottom: open search bar</li>
      <li>swipe left/right from bottom: toggle the compose-message/media-folders bar</li>
    </div>
    <button class="button is-warning" @click="$router.go(-1)">Go Back</button>
  </div>
</template>

<script>
export default {

}
</script>

<style>
.about-wrapper{
    background-color: #141414;
    border-radius: 7px;
    padding: 2rem;
    max-height: 95vh;
    overflow: auto;
}
</style>