//import { push } from 'core-js/core/array'
import { test } from "linkifyjs";
import { createStore } from "vuex";
//sorry for the bloated store, will try to use modules for settings and notes
import { toast } from 'bulma-toast'

const notes = {
  state: {
    isInstalled: false,
    notesFolder: "",
    notesList: [],
    selectedNote: "",
    noteContent: "",
  },
  mutations: {
    setInstalledState(state, arg) {
      state.isInstalled = arg;
    },
    setSelectedNote(state, arg) {
      state.selectedNote = arg;
    },
    setNoteContent(state, arg) {
      state.noteContent = arg;
    },
  },
  actions: {
    async InitializeNotes({ state, dispatch, rootState }) {
      var content = "## welcome to notes@uniClip!!  \nit uses [Markdown][1] for formatting your notes.   \nwith Markdown you can make your notes look ***just the way*** you want them to!\n\nfor eg, you can create lists:\n1. item1\n2. item2\n    - subitem 1\n    - subitem 2\n3. item3  \n\nsave [links][2] and cool images ![a cool pic][3] *(notes@uniClip doesn't yet support adding images directly from your local storage)*;  \n\nnote down codes:\n```\nfunction death(organism){\n    while(true){\n        sleep()\n    }\n}\n```\ncreate checkboxes:\n- [x] ~~code~~\n- [x] ~~eat~~\n- [ ] sleep  \n\n> and create blockquotes\n\nMarkdown supports all native `HTML` tags too!  \n<font color='crimson'>so</font> <font color='yellow'>go</font> <font color='steelblue'>all</font><font color='aquamarine'>-</font><font color='lightgreen'>out!!</font>\n\n---\n\n*edit this note to see how Markdown is used for formatting and for more in-depth info on how to use Markdown visit [this page][4]*\n\n[1]: https://www.markdownguide.org/\n[2]: https://github.com/Stravo1/uniClip\n[3]: https://images.unsplash.com/photo-1622565061755-fceb80b7549f\n[4]: https://www.markdownguide.org/basic-syntax/"
      var accessToken = rootState.accessToken;
      var outResolve, response;
      var promise = new Promise((resolve, reject) => {
        outResolve = resolve;
      });
      var xhr_up = new XMLHttpRequest();
      xhr_up.open(
        "POST",
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart"
      );
      xhr_up.setRequestHeader("Authorization", "Bearer " + accessToken);
      xhr_up.onload = async function() {
        if (this.status == 200) {
          //console.log("Uploaded", this.response);
          response = JSON.parse(this.response);
          state.notesFolder = response;
          state.isInstalled = true
          state.noteContent = content;
          await dispatch("saveNote", "About Notes");
          dispatch("setUpNotes");
        } else {
          //console.log("error", this.status);
        }
        outResolve();
      };
      var fileContent, fileType, fileName;

      fileType = "application/vnd.google-apps.folder";
      fileName = "notes";

      var metadata = {
        name: fileName,
        mimeType: fileType,
        parents: ["appDataFolder"],
      };

      var file = new Blob([fileContent], { type: fileType });

      var data = new FormData();
      data.append(
        "metadata",
        new Blob([JSON.stringify(metadata)], { type: "application/json" })
      );
      data.append("file", file);

      xhr_up.send(data);
      await promise;
      return response;
    },
    async setUpNotes({ state, commit, dispatch }) {
      //console.log(state.notesFolder, "in notes");
      state.notesList = await dispatch(
        "refreshFilesList",
        state.notesFolder.id
      );
      //console.log(state.notesList);
    },
    async refreshNotes({ state, dispatch }) {
      state.notesList = await dispatch(
        "refreshFilesList",
        state.notesFolder.id
      );
      //console.log("refreshed noteslist");
    },
    async saveNote({ state, rootState }, title) {
      rootState.isLoading = true;
      var method, url, fileName, fileContent, fileType;

      fileName = title;
      fileContent = state.noteContent;
      fileType = "text/plain";
      //console.log(fileContent, "ffffffff");

      var metadata = {
        name: fileName,
        mimeType: fileType,
      };

      if (state.selectedNote != "") {
        method = "PATCH";
        url =
          "https://www.googleapis.com/upload/drive/v3/files/" +
          state.selectedNote.id +
          "?uploadType=multipart";
      } else {
        method = "POST";
        url =
          "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart";
        metadata["parents"] = [state.notesFolder.id];
        //console.log(metadata);
      }
      var file = new Blob([fileContent], { type: fileType });

      var data = new FormData();
      data.append(
        "metadata",
        new Blob([JSON.stringify(metadata)], { type: "application/json" })
      );
      data.append("file", file);

      var response, outResolve;
      var promise = new Promise((resolve, reject) => {
        outResolve = resolve;
      });
      var xhr_up = new XMLHttpRequest();
      xhr_up.open(method, url);
      xhr_up.setRequestHeader(
        "Authorization",
        "Bearer " + rootState.accessToken
      );
      xhr_up.onload = function() {
        if (this.status == 200) {
          //console.log("Patched/saved", this.response);
          response = JSON.parse(this.response);
        } else {
          //console.log("error", this.status);
        }
        outResolve();
      };

      xhr_up.send(data);
      await promise;
      rootState.isLoading = false;

      return response;
    },
    async patchNotes({ state, commit, dispatch }, content) {},
  },
};

const clipBoard = {
  state: {
    isInstalled: false,
    isClipLoading: false,
    clipBoardFolder: '',
    textFile: null,
    textContent: 'syncing clipboard',
    mediaFile: null,
    xhr_l: null,
    isTyping: false,
  },
  mutations: {
    setInstalledState(state, bool){
      state.isInstalled = bool;
    },
    setClipTextContent(state, text){
      state.textContent = text
    },
    setIsTyping(state, bool){
      state.isTyping = bool
    },
  },
  actions: {
    async InstallClpiboard({state, dispatch, rootState}){
      var accessToken = rootState.accessToken;
      var outResolve, response;
      var promise = new Promise((resolve, reject) => {
        outResolve = resolve;
      });
      var xhr_up = new XMLHttpRequest();
      xhr_up.open(
        "POST",
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart"
      );
      xhr_up.setRequestHeader("Authorization", "Bearer " + accessToken);
      xhr_up.onload = async function() {
        if (this.status == 200) {
          //console.log("Uploaded", this.response);
          response = JSON.parse(this.response);
          state.clipBoardFolder = response;
          state.isInstalled = true;
          state.textContent = "access synced clipboard here"
          dispatch('saveClipBoardText')
          dispatch('setUpClipBoard');
        } else {
          //console.log("error", this.status);
        }
        outResolve();
      };
      var fileContent, fileType, fileName;

      fileType = "application/vnd.google-apps.folder";
      fileName = "clipBoard";

      var metadata = {
        name: fileName,
        mimeType: fileType,
        parents: ["appDataFolder"],
      };

      var file = new Blob([fileContent], { type: fileType });

      var data = new FormData();
      data.append(
        "metadata",
        new Blob([JSON.stringify(metadata)], { type: "application/json" })
      );
      data.append("file", file);

      xhr_up.send(data);
      await promise;
      return response;
    },
    async setUpClipBoard({ state, commit, dispatch }) {
      //console.log(state.notesFolder, "in notes");
      state.isClipLoading = true
      var files = await dispatch(
        "refreshFilesList",
        state.clipBoardFolder.id
      )
      state.textFile = files.filter((file) => file.name == 'clipText')[0];
      state.mediaFile = files.filter((file) => file.name != 'clipText')[0];
      state.textContent = await dispatch('getFileContent', {
        fileId: state.textFile.id,
        format: "raw",
        size: state.textFile.size
      })
      state.isClipLoading = false;
      //console.log(state.notesList);
    },
    async saveClipBoardText({ state, commit, dispatch, rootState }, fileClip=null) {
      state.isClipLoading = true;

      var method, url, fileName, fileContent, fileType;
      if(fileClip==null){
        fileName = "clipText";
        fileContent = state.textContent;
        fileType = "text/plain";
      } else {
        fileContent = fileClip
        fileType = fileContent.type;
        fileName = fileContent.name;
      }
      
      var metadata = {
        'name' : fileName,
        'mimeType' : fileType,
      }

      if (state.textFile!= null && fileClip==null) {
        method = "PATCH";
        url =
          "https://www.googleapis.com/upload/drive/v3/files/" +
          state.textFile.id +
          "?uploadType=multipart";
      } else {
        method = "POST";
        url =
          "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart";
        metadata["parents"] = [state.clipBoardFolder.id];
        //console.log(metadata);
      }
      var file = new Blob([fileContent], { type: fileType });

      var data = new FormData();
      data.append(
        "metadata",
        new Blob([JSON.stringify(metadata)], { type: "application/json" })
      );
      data.append("file", file);

      var response, outResolve;
      
      var promise = new Promise((resolve, reject) => {
        outResolve = resolve;
      });
      
      
      var xhr_up, response;
      xhr_up = new XMLHttpRequest();
      xhr_up.open(method, url);
      xhr_up.setRequestHeader(
        "Authorization",
        "Bearer " + rootState.accessToken
      );
      //xhr_up.onprogress = () => console.log(xhr_up.status)
      xhr_up.onabort = () => {
        console.log('aborted');
      }
      xhr_up.onload = function() {
        if (this.status == 200) {
          
          response = JSON.parse(this.response);
          if(fileClip!=null){
            if(state.mediaFile!=null) dispatch('deleteFiles', state.mediaFile)
            state.mediaFile = response
          }
        } else {
          console.log("error", this.status);
        }
        outResolve();
        //state.stack.pop()
        console.log("Patched/saved", response);
      };

      /*
      if(state.xhr_l != null){
        state.xhr_l.abort()
      }
      */
      xhr_up.send(data);
      await promise
      state.isClipLoading = false;
      return response;
    },
    async refreshClipBoard({state, commit, dispatch}){
      console.log('refreshing')
      if(state.isClipLoading || state.isTyping) return;
      state.isClipLoading = true;
      state.textContent = await dispatch('getFileContent', {
        fileId: state.textFile.id,
        format: "raw",
        size: state.textFile.size,
        refresh: false,
      })
      state.isClipLoading = false;
    }
  }
}

export default createStore({
  state: {
    signInState: false,
    refreshState: false,
    accessToken: "",
    isLoading: false,
    myDevice: "",
    filesList: [],
    foldersList: [],
    selectedFile: "",
    selectedFolder: { name: "root", id: "appDataFolder" },
    //previousFolders: [],
    allDevicesfolder: [],
    rootFolders: [],
    rootDevices: [], // == allDevicesFolder
    deviceList: [],
    selectedDevice: "",
    mediaFolders: [],
    recievingDevice: "",
    recievingDeviceMediafolders: [],
    messageFileId: [],
    messagesList: [],
    newnotifications: [],
    unreadMessages: [],
    fU: "",
    isInMessages: false,
    //filesList: [{ name: 'file1', id: 1 }, { name: 'file2', id: 2 }, { name: 'file3', id: 3 }]
  },
  mutations: {
    setSignInState(state, bool) {
      //console.log("updated", bool);
      state.signInState = bool;
    },
    setAccessToken(state, arg) {
      //console.log("updated", arg);
      state.accessToken = arg;
    },
    setRefreshState(state, arg) {
      state.refreshState = arg;
    },
    setFilesList(state, list) {
      state.filesList = list;
    },
    setFoldersList(state, list) {
      state.foldersList = list;
    },
    setSelectedFile(state, id) {
      ////console.log(name, "name")
      state.selectedFile = state.filesList.filter((file) => file.id == id)[0];
      ////console.log(state.selectedFile.name)
    },
    setSelectedFolder(state, arg) {
      //only one 'payload' allowed it seems; i.e., (state, para1, para2) not allowed
      state.selectedFolder = state.foldersList.filter(
        (folder) => folder.name == arg
      )[0];

      //console.log(state.selectedFolder.name, "hh", state.previousFolders);
    },
    setMyDevice(state, arg) {
      state.myDevice = state.selectedFolder = state.foldersList.filter(
        (folder) => folder.id == arg
      )[0];
      //console.log(state.myDevice, "mm");
    },
    setSelectedDevice(state, arg) {
      //only one 'payload' allowed it seems; i.e., (state, para1, para2) not allowed

      state.selectedDevice = state.selectedFolder = state.deviceList.filter(
        (folder) => folder.name == arg
      )[0];
      //console.log(state.selectedDevice, "selectedDevice set");
    },
    setDeviceList(state, list) {
      state.deviceList = list;
      //console.log("hh", list);
    },
    setMediaFolders(state, list) {
      state.mediaFolders = list;
      //console.log("hh");
    },
    setReceivingDeviceMediaFoldrs(state, list) {
      state.recievingDeviceMediafolders = list;
    },
    setSelectedMedia(state, arg) {
      //only one 'payload' allowed it seems; i.e., (state, para1, para2) not allowed
      state.selectedFolder = state.mediaFolders.filter(
        (folder) => folder.name == arg
      )[0];

      //console.log(state.selectedFolder.name, "hh");
    },
    setNewnotifications(state, list) {
      state.newnotifications = list;
      //console.log("nn", state.newnotifications, list);
    },
    setIsInMessageState(state, bool) {
      state.isInMessages = bool;
    },
    setMessagesList(state, lst){
      state.messagesList = lst
    },
    dirtyLoadFile(state, arg) {
      state.selectedFile = arg;
      //console.log("dirty set", arg);
    },
  },
  actions: {
    async searchFiles({ state }, arg) {
      state.isLoading = true;
      var folder = arg.folder;
      var mType = arg.mType;
      var name = arg.name;
      var outResolve, response;
      ////console.log(setFolders, "gg")
      var promise = new Promise((resolve, reject) => {
        outResolve = resolve;
      });
      var s = {
        " ": "%20",
        "=": "%3D",
        ",": "%2C",
        '"': "%22",
      };
      //try to simplify the following code later... future me sorry
      var fLink;
      folder != null
        ? (fLink = "'" + folder + "'" + s[" "] + "in" + s[" "] + "parents")
        : (fLink = "");

      var mLink;
      mType != null
        ? (mLink = "mimeType" + s["="] + "'" + mType + "'")
        : (mLink = "");

      var nLink;
      name != null
        ? (nLink = "name" + s[" "] + "contains" + s[" "] + "'" + name + "'")
        : (nLink = "");

      var and = s[" "] + "and" + s[" "];

      var link =
        "https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&fields=files(id%2C%20name%2C%20size%2C%20createdTime%2C%20mimeType)&q=" +
        nLink; //complex turnary upcoming lol xb
      name != null
        ? folder != null
          ? (link += and)
          : mType != null
          ? (link += and)
          : (link += "")
        : (link += "");
      link += fLink;
      mType != null
        ? name != null
          ? (link += and)
          : folder != null
          ? (link += and)
          : (link += "")
        : (link += "");
      link += mLink;

      //console.log(link);
      var xhr_s = new XMLHttpRequest();

      xhr_s.open("GET", link);

      xhr_s.setRequestHeader("Authorization", "Bearer " + state.accessToken);

      xhr_s.onload = function() {
        response = JSON.parse(this.response).files;
        //console.log(response, "resp");
        //setFolders ? commit('setFoldersList', JSON.parse(this.response).files) : false
        //setFolders ? //console.log(state.foldersList) : //console.log(response)
        outResolve();
      };

      xhr_s.send();
      await promise;
      state.isLoading = false;
      return response;
    },
    async deleteFiles({ state }, arg) {
      var id = arg.id
      var toastEnable = arg.toast
      state.isLoading = true;
      var outResolve;
      var promise = new Promise((resolve, reject) => {
        outResolve = resolve;
      });
      var xhr_dlt = new XMLHttpRequest();
      var link = "https://www.googleapis.com/drive/v3/files/" + id;
      xhr_dlt.open("DELETE", link);
      xhr_dlt.setRequestHeader("Authorization", "Bearer " + state.accessToken);
      xhr_dlt.onload = function() {
        if (this.status == 204) {
          // 204 = success => No Content
          //console.log("Deleted!");
          if(toastEnable) toast({
            message: 'Deleted',
            type: 'is-dark',
            pauseOnHover: false,
            position: 'bottom-center',
            closeOnClick: true,
            animate: { in: 'fadeIn', out: 'fadeOut' },
          })
        }
        if (this.status === 404) {
          toast({
              message: 'File is missing\n(may already be deleted)',
              type: 'is-dark',
              pauseOnHover: false,
              position: 'bottom-center',
              closeOnClick: true,
              animate: { in: 'fadeIn', out: 'fadeOut' },
          })
      }
        //console.log(this.response, this.status);
        outResolve();
      };
      xhr_dlt.send();
      await promise;
      state.isLoading = false;
      return true;
    },
    async refreshFilesList(
      { commit, state },
      folder = state.selectedFolder.id,
      setFiles = true
    ) {
      var outResolve, response;
      var promise = new Promise((resolve, reject) => {
        outResolve = resolve;
      });
      var s = {
        " ": "%20",
        "=": "%3D",
        ",": "%2C",
        '"': "%22",
      };
      //try to simplify the following code later... future me sorry
      var fLink;
      folder != null
        ? (fLink = "'" + folder + "'" + s[" "] + "in" + s[" "] + "parents")
        : (fLink = "");
      var and = s[" "] + "and" + s[" "];

      var link =
        "https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&fields=files(id%2C%20name%2C%20size%2C%20modifiedTime%2C%20createdTime%2C%20mimeType)&q="; //complex turnary upcoming lol xb

      link += fLink;

      //console.log(link);
      var xhr_s = new XMLHttpRequest();

      xhr_s.open("GET", link);

      xhr_s.setRequestHeader("Authorization", "Bearer " + state.accessToken);

      xhr_s.onload = function() {
        //console.log(this.response, "files");
        response = JSON.parse(this.response).files.filter(
          (file) => file.mimeType != "application/vnd.google-apps.folder"
        );
        setFiles ? commit("setFilesList", response) : false;
        //setFiles ? //console.log(response, state.filesList) : false;
        outResolve();
      };

      xhr_s.send();
      await promise;

      return response;
    },
    async refreshFoldersList(
      { dispatch, state },
      folder = state.selectedFolder.id,
      setFolders = true,
      mType = "application/vnd.google-apps.folder",
      name = null
    ) {
      var resposne = await dispatch("searchFiles", {
        folder: folder,
        mType: mType,
        name: name,
      });
      return resposne;
    },
    async goIntoFolder(
      { commit, state },
      name = null,
      mType = null,
      folder = state.selectedFolder.id
    ) {
      var outResolve;
      var promise = new Promise((resolve, reject) => {
        outResolve = resolve;
      });
      var s = {
        " ": "%20",
        "=": "%3D",
        ",": "%2C",
        '"': "%22",
      };
      //try to simplify the following code later... future me sorry
      var fLink;
      folder != null
        ? (fLink = "'" + folder + "'" + s[" "] + "in" + s[" "] + "parents")
        : (fLink = "");

      var mLink;
      mType != null
        ? (mLink = "mimeType" + s["="] + "'" + mType + "'")
        : (mLink = "");

      var nLink;
      name != null
        ? (nLink = "name" + s[" "] + "contains" + s[" "] + "'" + name + "'")
        : (nLink = "");

      var and = s[" "] + "and" + s[" "];

      var link =
        "https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=" +
        nLink; //complex turnary upcoming lol xb
      name != null
        ? folder != null
          ? (link += and)
          : mType != null
          ? (link += and)
          : (link += "")
        : (link += "");
      link += fLink;
      mType != null
        ? name != null
          ? (link += and)
          : folder != null
          ? (link += and)
          : (link += "")
        : (link += "");
      link += mLink;

      //console.log(link);
      var xhr_s = new XMLHttpRequest();

      xhr_s.open("GET", link);

      xhr_s.setRequestHeader("Authorization", "Bearer " + state.accessToken);

      xhr_s.onload = function() {
        state.selectedFolder = JSON.parse(this.response).files[0];
        outResolve();
        //console.log(state.selectedFolder);
      };

      xhr_s.send();
      await promise;
      return true;
    },
    async setMyDevice({ state, dispatch }, id) {
      state.isLoading = true;
      var rootFolders = await dispatch("refreshFoldersList", "appDataFolder");

      state.rootFolders = rootFolders;
      state.rootDevices = rootFolders.filter(
        (folder) => (folder.name != "notes" && folder.name != "clipBoard")
      );
      state.allDevicesfolder = rootFolders.filter(
        (folder) => folder.name == "allDevices"
      )[0];

      state.notes.notesFolder = rootFolders.filter(
        (folder) => folder.name == "notes"
      )[0];
      if (state.notes.notesFolder) {
        state.notes.isInstalled = true;
        dispatch("setUpNotes");
      }
      state.clipBoard.clipBoardFolder = rootFolders.filter(
        (folder) => folder.name == "clipBoard"
      )[0];
      if (state.clipBoard.clipBoardFolder) {
        state.notes.isInstalled = true;
        dispatch("setUpClipBoard");
      } else{
        alert('Initializing clipboard, please wait');
        await dispatch('InstallClpiboard');
        alert('Clipboard sync is now available');
      }

      //console.log(state.notes.notesFolder, state.notes.isInstalled, "notes");
      state.myDevice = state.selectedFolder = rootFolders.filter(
        (folder) => folder.id == id
      )[0];
      //console.log(state.myDevice, "mm");
      state.isLoading = false;
      return true;
    },
    async setUpDevices({ commit, state, dispatch }, id) {
      state.isLoading = true;

      //dispatch('refreshFilesList', state.myDevice.id)
      var deviceList = await dispatch(
        "refreshFoldersList",
        state.myDevice.id,
        false
      ); //level 2 folders
      deviceList.push(state.allDevicesfolder);
      ////console.log(115, deviceList, "deviceList");
      commit("setDeviceList", deviceList);

      state.isLoading = false;

      return true;
    },
    async setReceivingDevice({ dispatch, state }, arg) {
      state.isLoading = true;

      if (arg == "myDevice") {
        arg = state.myDevice.name;
      }
      var rootDevices = await dispatch("refreshFoldersList", "appDataFolder");
      state.recievingDevice = rootDevices.filter(
        (device) => device.name == arg
      )[0];
      //alert(state.recievingDevice, rootDevices, "recieving")
    },
    async setUpMessages({ commit, dispatch, state }, arg = false) {
      //console.log(state.selectedDevice, "ss");
      var mediaList = await dispatch(
        "refreshFoldersList",
        state.selectedDevice.id,
        false
      );
      var thisDevice;
      if (arg == "allDevices") {
        thisDevice = state.allDevicesfolder;
      } else if (arg == "myDevice") {
        thisDevice = state.deviceList.filter(
          (device) => device.name == "myDevice"
        )[0];
      } else {
        var device_square_list = await dispatch(
          "refreshFoldersList",
          state.recievingDevice.id
        ); //level2 folders
        thisDevice = device_square_list.filter(
          (devices) => devices.name == state.myDevice.name
        )[0];
        state.fU = thisDevice;
        //console.log(state.fU);
      }

      var receivingMediaList = await dispatch(
        "refreshFoldersList",
        thisDevice.id
      );
      //var receivingFileList = await dispatch('refreshFilesList', thisDevice.id)
      //state.recievingDeviceMessageFile = receivingFileList.filter(file => file.name == 'newNotification.json')[0]
      ////console.log(state.recievingDeviceMessageFile)
      //console.log(receivingMediaList, "receiveingmedia");
      //console.log(state.selectedDevice, mediaList, "medialIst"); //level 3 folders
      commit("setMediaFolders", mediaList);
      commit("setReceivingDeviceMediaFoldrs", receivingMediaList);
      //dispatch('goIntoFolder', 'messages')
      await dispatch("refreshFilesList");
      await dispatch("setMessagesList");
      dispatch("refreshMessagesList");
      state.isLoading = false;

      return true;
    },
    async getFileContent({ state }, arg) {
      if(state.selectedDevice.name != 'allDevices' && arg.refresh!=false)state.isLoading = true;
      ////console.log(arg, "messages/notes")
      //console.log(arg.refresh)
      var fileId = arg.fileId;
      var format = arg.format;
      var outResolve, response;
      //console.log(state.filesList, "messages");
      const promise = new Promise((resolve, reject) => {
        outResolve = resolve;
      });
      //for returning
      var xhr = new XMLHttpRequest();
      xhr.open(
        "GET",
        "https://www.googleapis.com/drive/v3/files/" + fileId + "?alt=media",
        true
      );
      xhr.setRequestHeader("Authorization", "Bearer " + state.accessToken);
      xhr.onload = function() {
        if (this.status === 200) {
          ////console.log(this.response)
          if (format == "messages")
            response = JSON.parse(this.response).messages;
          else response = this.response;
          outResolve();
          ////console.log("came here at last last")
          ////console.log(this.status)
        }
      };

      //xhr.withCredentials = true;
      xhr.send();
      await promise;
      //console.log("bye");
      state.isLoading = false;

      return response;
    },
    async setMessagesList({ state, dispatch }) {
      state.isLoading = true;

      var file = state.filesList.filter(
        (file) => file.name == "messages.json"
      )[0];
      //var accessToken = state.accessToken
      state.messageFileId = file.id;
      state.messagesList = await dispatch("getFileContent", {
        fileId: file.id,
        format: "messages",
        size: file.size
      });
      state.isLoading = false;
      return true; //added
    },
    async refreshMessagesList({ state, dispatch, commit }) {
      ////console.log(state.filesList, "unrd")
      if (!state.refreshState) {
        return true;
      }
      if(state.refreshState == 'paused'){
        setTimeout(() => {
          dispatch("refreshMessagesList");
          ////console.log("refreshed ALLDEVICES");
        }, 10000);
        console.log('paused')
        return true
      }
      if(state.refreshState == 'allDevices'){
        state.messagesList = await dispatch("getFileContent", {
          fileId: state.filesList.filter(
            (file) => file.name == "messages.json"
          )[0].id,
          format: "messages",
          size: state.filesList.filter(
            (file) => file.name == "messages.json"
          )[0].size
        });
        setTimeout(() => {
          dispatch("refreshMessagesList");
          ////console.log("refreshed ALLDEVICES");
        }, 10000);
        return true
      }
      var outResolve;
      var promise = new Promise((resolve, reject) => {
        outResolve = resolve;
      });
      await dispatch("refreshFilesList");
      var files = state.filesList.filter((file) =>
        file.name.includes("newnotification")
      );
      files = files.reverse();
      commit("setNewnotifications", files);
      console.log(files, state.filesList, state.newnotifications, "newnotifivations");
      ////console.log(files, "unrd1", files.length);
      for (var i = 0; i < files.length; i++) {
        var unRead = await dispatch("getFileContent", {
          fileId: files[i].id,
          format: "messages",
          size: files[i].size
        });
        state.unreadMessages.push(unRead[0]);
        //console.log(state.unreadMessages, "unread");
      }
      setTimeout(async () => {
        state.unreadMessages.length ? await dispatch("markAsRead") : false;
        outResolve();
      }, 1500);
      await promise;
      //alert('awaited')
      setTimeout(() => {
        dispatch("refreshMessagesList");
        //console.log("refreshed");
      }, 5000);
      return true;
    },
    async markAsRead({ state, dispatch }) {
      //console.log(state.unreadMessages.length, "lngth");
      var length = state.unreadMessages.length;
      for (var i = 0; i < length; i++) {
        //nice... (i < state.unreadMessages.length) <= this one had me
        state.messagesList.push(state.unreadMessages.shift());
        //console.log(state.unreadMessages);
        await dispatch("deleteFiles", {id: state.newnotifications[i].id, toast: false});
      }
      await dispatch("patchMessageFile");
      return true;
      //dispatch('refreshFilesList')
    },
    async patchMessageFile({ state }) {
      state.isLoading = true;
      var oldRefreshstate = state.refreshState //prevention of any tampering while patching + patch zombie mesages in alldevices
      state.refreshState = "paused"
      var id = state.messageFileId;
      var outResolve;
      var promise = new Promise((resolve, reject) => {
        outResolve = resolve;
      });
      var xhr_up = new XMLHttpRequest();
      xhr_up.open(
        "PATCH",
        "https://www.googleapis.com/upload/drive/v3/files/" +
          id +
          "?uploadType=multipart"
      );
      xhr_up.setRequestHeader("Authorization", "Bearer " + state.accessToken);
      xhr_up.onload = function() {
        if (this.status == 200) {
          //console.log("Patched", this.response);
        } else {
          //console.log("error", this.status);
        }
        outResolve();
      };
      var fileContent, fileType;

      fileContent = '{"messages":' + JSON.stringify(state.messagesList) + "}";
      fileType = "application/json";
      //console.log(fileContent, "ffffffff");

      var metadata = {
        mimeType: fileType,
      };

      var file = new Blob([fileContent], { type: fileType });

      var data = new FormData();
      data.append(
        "metadata",
        new Blob([JSON.stringify(metadata)], { type: "application/json" })
      );
      data.append("file", file);

      xhr_up.send(data);
      await promise;
      state.isLoading = false;
      state.refreshState = oldRefreshstate
      return fileContent;
    },
    async refreshAll({ dispatch }) {
      return setInterval(async () => {
        //console.log("refreshing");
        //await dispatch('refreshFilesList');
        await dispatch("refreshMessagesList");
      }, 7000);
    },
    async deleteMessage({ state, dispatch }, message) {
      state.messagesList.splice(state.messagesList.indexOf(message), 1);
      setTimeout(() => dispatch("patchMessageFile"), 1);
      if(message.type != 'text'){
        const answer = window.confirm("There's a file associated with this message, do you want to delete the associated file too?")
        if (answer) {
              dispatch("deleteFiles", {id: message.fileId, toast: true})
        }
      }
      //console.log("deleted");
    },
  },
  getters: {
    timeFormatter: (state) => (arg) => {
        if (arg == "just now") return arg;
        var then = new Date(arg);
        var now = new Date();
        if (now.getFullYear() - then.getFullYear() > 0) {
          return (
            JSON.stringify(then.getFullYear()) +
            new Intl.DateTimeFormat("en-US", { month: "long" }).format(then)
          );
        } else if (now.getMonth() - then.getMonth() > 0) {
          return (
            new Intl.DateTimeFormat("en-US", { month: "long" }).format(then) + ", " +
            JSON.stringify(then.getDate())
          );
        } else if (now.getDate() - then.getDate() >= 7) {
          return +JSON.stringify(then.getDate()) + "th, this month";
        } else if (now.getDay() - then.getDay() == 1 || now.getDay() - then.getDay() == -6) {
          return (
            "yesterday " +
            new Intl.DateTimeFormat("en-US", { hour: "numeric" }).format(then)
          );

        } else if (now.getDay() - then.getDay() > 1 || now.getDay() - then.getDay() <= -1) {
          return (
            
            new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(then) + " " +
            new Intl.DateTimeFormat("en-US", { hour: "numeric" }).format(then)
          );
        } else if (now.getHours() - then.getHours() > 1) {
          return JSON.stringify(now.getHours() - then.getHours()) + " hours ago";
        } else if (now.getHours() - then.getHours() == 1 && now.getMinutes() - then.getMinutes() > 1) {
          return "1 hour ago";

        } else if (now.getMinutes() - then.getMinutes() > 1) {
          return (
            JSON.stringify(now.getMinutes() - then.getMinutes()) + " minutes ago"
          );
        } else if(now.getMinutes() - then.getMinutes() < - 1) {
          return (
            JSON.stringify(60 + (now.getMinutes() - then.getMinutes()) ) + " minutes ago"

          ); 
        } else {
          return "moments ago";
        }
      },
  },
  modules: {
    notes: notes,
    clipBoard: clipBoard,
  },
});
