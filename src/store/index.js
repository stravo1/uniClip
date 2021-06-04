//import { push } from 'core-js/core/array'
import { createStore } from 'vuex'
//sorry for the bloated store, will try to use modules for settings and notes
const notes = {
    state: {
        isInstalled: false,
        notesFolder: '',
        notesList: [],
        selectedNote: '',
        noteContent: '',
    },
    mutations: {
        setInstalledState(state, arg) {
            state.isInstalled = arg
        },
        setSelectedNote(state, arg) {
            state.selectedNote = arg
        },
        setNoteContent(state, arg){
            state.noteContent = arg
        }
    },
    actions: {
        async InitializeNotes({state, dispatch, rootState}) {
            var accessToken = rootState.accessToken
            var outResolve, response;
            var promise = new Promise((resolve, reject) => {outResolve = resolve})
            var xhr_up = new XMLHttpRequest;
            xhr_up.open("POST","https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart")
            xhr_up.setRequestHeader('Authorization', 'Bearer '+ accessToken)
            xhr_up.onload = async function(){
              if (this.status == 200){
                console.log("Uploaded", this.response)
                response = JSON.parse(this.response)
                state.notesFolder = response
                state.noteContent = "Demo"
                await dispatch('saveNote', 'About Notes')
                dispatch('setUpNotes')
              }
              else {
                console.log("error", this.status)
              }
              outResolve()
            }
            var fileContent, fileType, fileName

            fileType = 'application/vnd.google-apps.folder';
            fileName = 'notes' ;
          
            var metadata = {
              'name' : fileName,
              'mimeType' : fileType,
              'parents': ['appDataFolder']
            }
            
            var file = new Blob([fileContent], {type: fileType});
            
            var data = new FormData();
            data.append("metadata", new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
            data.append("file", file);
             
            xhr_up.send(data)
            await promise
            return response
          },
        async setUpNotes({ state, commit, dispatch }) {
            console.log(state.notesFolder, "in notes")
            state.notesList = await dispatch('refreshFilesList', state.notesFolder.id)
            console.log(state.notesList)
        },
        async refreshNotes({state, dispatch}){
            state.notesList = await dispatch('refreshFilesList', state.notesFolder.id)
            console.log('refreshed noteslist')
        },
        async saveNote({ state, rootState }, title){
            rootState.isLoading = true
            var method, url, fileName, fileContent, fileType
            
            fileName = title
            fileContent = state.noteContent
            fileType = 'text/plain';
            console.log(fileContent, "ffffffff")

            var metadata = {
                'name': fileName,
                'mimeType': fileType,
            }
            
            if (state.selectedNote != '') {
                method = 'PATCH'
                url = "https://www.googleapis.com/upload/drive/v3/files/" + state.selectedNote.id + "?uploadType=multipart"
            } else {
                method = 'POST'
                url = "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart"
                metadata['parents'] = [state.notesFolder.id]
                console.log(metadata)
            }
            var file = new Blob([fileContent], { type: fileType });

            var data = new FormData();
            data.append("metadata", new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
            data.append("file", file);
            
            var response, outResolve;
            var promise = new Promise((resolve, reject) => { outResolve = resolve })
            var xhr_up = new XMLHttpRequest;
            xhr_up.open(method, url)
            xhr_up.setRequestHeader('Authorization', 'Bearer ' + rootState.accessToken)
            xhr_up.onload = function() {
                if (this.status == 200) {
                    console.log("Patched/saved", this.response)
                    response = JSON.parse(this.response)
                } else {
                    console.log("error", this.status)
                }
                outResolve()
            }
            

            xhr_up.send(data)
            await promise
            rootState.isLoading = false

            return response
        },
        async patchNotes({ state, commit, dispatch }, content) {

        }
    }
}


export default createStore({
    state: {
        signInState: false,
        refreshState: false,
        accessToken: '',
        isLoading: false,
        myDevice: '',
        filesList: [],
        foldersList: [],
        selectedFile: '',
        selectedFolder: { name: 'root', id: 'appDataFolder' },
        //previousFolders: [],
        allDevicesfolder: [],
        rootFolders:[],
        rootDevices: [], // == allDevicesFolder
        deviceList: [],
        selectedDevice: '',
        mediaFolders: [],
        recievingDevice: '',
        recievingDeviceMediafolders: [],
        messageFileId: [],
        messagesList: [],
        newnotifications: [],
        unreadMessages: [],
        fU: '',
        isInMessages: false,
        //filesList: [{ name: 'file1', id: 1 }, { name: 'file2', id: 2 }, { name: 'file3', id: 3 }]
    },
    mutations: {
        setSignInState(state, bool) {
            console.log('updated', bool)
            state.signInState = bool
        },
        setAccessToken(state, arg) {
            console.log('updated', arg)
            state.accessToken = arg
        },
        setRefreshState(state, arg) {
            state.refreshState = arg;
        },
        setFilesList(state, list) {
            state.filesList = list
        },
        setFoldersList(state, list) {
            state.foldersList = list
        },
        setSelectedFile(state, id) {
            //console.log(name, "name")
            state.selectedFile = state.filesList.filter(file => file.id == id)[0]
                //console.log(state.selectedFile.name)
        },
        setSelectedFolder(state, arg) { //only one 'payload' allowed it seems; i.e., (state, para1, para2) not allowed
            state.selectedFolder = state.foldersList.filter(folder => folder.name == arg)[0]

            console.log(state.selectedFolder.name, "hh", state.previousFolders)

        },
        setMyDevice(state, arg) {
            state.myDevice = state.selectedFolder = state.foldersList.filter(folder => folder.id == arg)[0]
            console.log(state.myDevice, "mm")
        },
        setSelectedDevice(state, arg) { //only one 'payload' allowed it seems; i.e., (state, para1, para2) not allowed

            state.selectedDevice = state.selectedFolder = state.deviceList.filter(folder => folder.name == arg)[0]
            console.log(state.selectedDevice, "selectedDevice set")

        },
        setDeviceList(state, list) {
            state.deviceList = list
            console.log('hh', list)
        },
        setMediaFolders(state, list) {
            state.mediaFolders = list
            console.log('hh')
        },
        setReceivingDeviceMediaFoldrs(state, list) {
            state.recievingDeviceMediafolders = list
        },
        setSelectedMedia(state, arg) { //only one 'payload' allowed it seems; i.e., (state, para1, para2) not allowed
            state.selectedFolder = state.mediaFolders.filter(folder => folder.name == arg)[0]

            console.log(state.selectedFolder.name, "hh")
        },
        setNewnotifications(state, list) {
            state.newnotifications = list
            console.log("nn", state.newnotifications, list)
        },
        setIsInMessageState(state, bool) {
            state.isInMessages = bool
        },
        dirtyLoadFile(state, arg) {
            state.selectedFile = arg
            console.log('dirty set', arg)
        }
    },
    actions: {
        async searchFiles({ state }, arg) {
            state.isLoading = true
            var folder = arg.folder
            var mType = arg.mType
            var name = arg.name
            var outResolve, response;
            //console.log(setFolders, "gg")
            var promise = new Promise((resolve, reject) => { outResolve = resolve })
            var s = {
                    " ": "%20",
                    "=": "%3D",
                    ",": "%2C",
                    '"': "%22"
                }
                //try to simplify the following code later... future me sorry
            var fLink;
            folder != null ? fLink = "'" + folder + "'" + s[" "] + "in" + s[" "] + "parents" : fLink = "";

            var mLink;
            mType != null ? mLink = "mimeType" + s["="] + "'" + mType + "'" : mLink = "";

            var nLink;
            name != null ? nLink = "name" + s[" "] + "contains" + s[" "] + "'" + name + "'" : nLink = "";

            var and = s[" "] + "and" + s[" "];

            var link = "https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&fields=files(id%2C%20name%2C%20size%2C%20createdTime%2C%20mimeType)&q=" + nLink; //complex turnary upcoming lol xb
            name != null ? (folder != null ? link += and : (mType != null ? link += and : link += "")) : link += ""
            link += fLink;
            mType != null ? (name != null ? link += and : (folder != null ? link += and : link += "")) : link += ""
            link += mLink

            console.log(link)
            var xhr_s = new XMLHttpRequest;

            xhr_s.open("GET", link);

            xhr_s.setRequestHeader('Authorization', 'Bearer ' + state.accessToken);

            xhr_s.onload = function() {
                response = JSON.parse(this.response).files
                console.log(response, "resp")
                    //setFolders ? commit('setFoldersList', JSON.parse(this.response).files) : false
                    //setFolders ? console.log(state.foldersList) : console.log(response)
                outResolve()
            }

            xhr_s.send();
            await promise
            state.isLoading = false
            return response
        },
        async deleteFiles({ state }, id) {
            state.isLoading = true
            var outResolve;
            var promise = new Promise((resolve, reject) => { outResolve = resolve })
            var xhr_dlt = new XMLHttpRequest;
            var link = "https://www.googleapis.com/drive/v3/files/" + id
            xhr_dlt.open("DELETE", link)
            xhr_dlt.setRequestHeader('Authorization', 'Bearer ' + state.accessToken)
            xhr_dlt.onload = function() {
                if (this.status == 204) { // 204 = success => No Content
                    console.log("Deleted!")
                }
                console.log(this.response, this.status)
                outResolve()
            }
            xhr_dlt.send()
            await promise
            state.isLoading = false
            return true

        },
        async refreshFilesList({ commit, state }, folder = state.selectedFolder.id, setFiles = true) {

            var outResolve, response;
            var promise = new Promise((resolve, reject) => { outResolve = resolve })
            var s = {
                    " ": "%20",
                    "=": "%3D",
                    ",": "%2C",
                    '"': "%22"
                }
                //try to simplify the following code later... future me sorry
            var fLink;
            folder != null ? fLink = "'" + folder + "'" + s[" "] + "in" + s[" "] + "parents" : fLink = "";
            var and = s[" "] + "and" + s[" "];

            var link = "https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&fields=files(id%2C%20name%2C%20size%2C%20modifiedTime%2C%20createdTime%2C%20mimeType)&q=" //complex turnary upcoming lol xb

            link += fLink;

            console.log(link)
            var xhr_s = new XMLHttpRequest;

            xhr_s.open("GET", link);

            xhr_s.setRequestHeader('Authorization', 'Bearer ' + state.accessToken);

            xhr_s.onload = function() {
                console.log(this.response, "files")
                response = JSON.parse(this.response).files.filter(file => file.mimeType != "application/vnd.google-apps.folder")
                setFiles ? commit('setFilesList', response) : false
                setFiles ? console.log(response, state.filesList) : false
                outResolve()
            }

            xhr_s.send();
            await promise

            return response

        },
        async refreshFoldersList({ dispatch, state }, folder = state.selectedFolder.id, setFolders = true, mType = 'application/vnd.google-apps.folder', name = null) {
            var resposne = await dispatch('searchFiles', { folder: folder, mType: mType, name: name })
            return resposne
        },
        async goIntoFolder({ commit, state }, name = null, mType = null, folder = state.selectedFolder.id) {
            var outResolve;
            var promise = new Promise((resolve, reject) => { outResolve = resolve })
            var s = {
                    " ": "%20",
                    "=": "%3D",
                    ",": "%2C",
                    '"': "%22"
                }
                //try to simplify the following code later... future me sorry
            var fLink;
            folder != null ? fLink = "'" + folder + "'" + s[" "] + "in" + s[" "] + "parents" : fLink = "";

            var mLink;
            mType != null ? mLink = "mimeType" + s["="] + "'" + mType + "'" : mLink = "";

            var nLink;
            name != null ? nLink = "name" + s[" "] + "contains" + s[" "] + "'" + name + "'" : nLink = "";

            var and = s[" "] + "and" + s[" "];

            var link = "https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=" + nLink; //complex turnary upcoming lol xb
            name != null ? (folder != null ? link += and : (mType != null ? link += and : link += "")) : link += ""
            link += fLink;
            mType != null ? (name != null ? link += and : (folder != null ? link += and : link += "")) : link += ""
            link += mLink

            console.log(link)
            var xhr_s = new XMLHttpRequest;

            xhr_s.open("GET", link);

            xhr_s.setRequestHeader('Authorization', 'Bearer ' + state.accessToken);

            xhr_s.onload = function() {
                state.selectedFolder = JSON.parse(this.response).files[0]
                outResolve()
                console.log(state.selectedFolder)
            }

            xhr_s.send();
            await promise
            return true

        },
        async setMyDevice({ state, dispatch }, id) {
            state.isLoading = true
            var rootFolders = await dispatch('refreshFoldersList', 'appDataFolder')

            state.rootFolders = rootFolders
            state.rootDevices = rootFolders.filter(folder => folder.name != 'notes')
            state.allDevicesfolder = rootFolders.filter(folder => folder.name == "allDevices")[0]

            state.notes.notesFolder = rootFolders.filter(folder => folder.name == 'notes')[0]
            if(state.notes.notesFolder) {state.notes.isInstalled  = true; dispatch('setUpNotes')}

            console.log(state.notes.notesFolder, state.notes.isInstalled, "notes")
            state.myDevice = state.selectedFolder = rootFolders.filter(folder => folder.id == id)[0]
            console.log(state.myDevice, "mm")
            state.isLoading = false
            return true
        },
        async setUpDevices({ commit, state, dispatch }, id) {
            state.isLoading = true

            //dispatch('refreshFilesList', state.myDevice.id)
            var deviceList = await dispatch('refreshFoldersList', state.myDevice.id, false) //level 2 folders
            deviceList.push(state.allDevicesfolder)
            console.log(115, deviceList, "deviceList")
            commit('setDeviceList', deviceList)


            state.isLoading = false

            return true
        },
        async setReceivingDevice({ dispatch, state }, arg) {
            state.isLoading = true

            if (arg == 'myDevice') { arg = state.myDevice.name }
            var rootDevices = await dispatch('refreshFoldersList', 'appDataFolder')
            state.recievingDevice = rootDevices.filter(device => device.name == arg)[0]
                //alert(state.recievingDevice, rootDevices, "recieving")
        },
        async setUpMessages({ commit, dispatch, state }, arg = false) {
            console.log(state.selectedDevice, "ss")
            var mediaList = await dispatch('refreshFoldersList', state.selectedDevice.id, false)
            var thisDevice;
            if (arg == 'allDevices') {
                thisDevice = state.allDevicesfolder
            } else if (arg == 'myDevice') {
                thisDevice = state.deviceList.filter(device => device.name == 'myDevice')[0]
            } else {
                var device_square_list = await dispatch('refreshFoldersList', state.recievingDevice.id) //level2 folders
                thisDevice = device_square_list.filter(devices => devices.name == state.myDevice.name)[0]
                state.fU = thisDevice
                console.log(state.fU)
            }

            var receivingMediaList = await dispatch('refreshFoldersList', thisDevice.id)
                //var receivingFileList = await dispatch('refreshFilesList', thisDevice.id)
                //state.recievingDeviceMessageFile = receivingFileList.filter(file => file.name == 'newNotification.json')[0]
                //console.log(state.recievingDeviceMessageFile)
            console.log(receivingMediaList, "receiveingmedia")
            console.log(state.selectedDevice, mediaList, "medialIst") //level 3 folders
            commit('setMediaFolders', mediaList)
            commit('setReceivingDeviceMediaFoldrs', receivingMediaList)
                //dispatch('goIntoFolder', 'messages')
            await dispatch('refreshFilesList')
            await dispatch('setMessagesList')
            dispatch('refreshMessagesList')
            state.isLoading = false

            return true
        },
        async getFileContent({ state }, arg) {
            state.isLoading = true
            var fileId = arg.fileId
            var format = arg.format
            var outResolve, response;
            console.log(state.filesList, "messages")
            const promise = new Promise((resolve, reject) => { outResolve = resolve })
                //for returning
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "https://www.googleapis.com/drive/v3/files/" + fileId + '?alt=media', true);
            xhr.setRequestHeader('Authorization', 'Bearer ' + state.accessToken);
            xhr.onload = function() {
                if (this.status === 200) {
                    //console.log(this.response)
                    if (format == 'messages') response = JSON.parse(this.response).messages
                    else response = this.response
                    outResolve()
                        //console.log("came here at last last")
                        //console.log(this.status)
                }
            }

            //xhr.withCredentials = true;
            xhr.send();
            await promise;
            console.log('bye')
            state.isLoading = false

            return response
        },
        async setMessagesList({ state, dispatch }) {
            state.isLoading = true

            var fileId = state.filesList.filter(file => file.name == 'messages.json')[0].id
                //var accessToken = state.accessToken
            state.messageFileId = fileId
            state.messagesList = await dispatch("getFileContent", { fileId: fileId, format: 'messages' })
            state.isLoading = false
            return true //added




        },
        async refreshMessagesList({ state, dispatch, commit }) {
            //console.log(state.filesList, "unrd")
            var outResolve;
            var promise = new Promise((resolve, reject) => { outResolve = resolve })
            await dispatch('refreshFilesList')
            var files = state.filesList.filter(file => file.name.includes("newnotification"))
            files = files.reverse()
            commit('setNewnotifications', files)
            console.log(files, state.newnotifications, "newnotifivations")
            console.log(files, "unrd1", files.length)
            for (var i = 0; i < files.length; i++) {
                var unRead = await dispatch('getFileContent', { fileId: files[i].id, format: 'messages' })
                state.unreadMessages.push(unRead[0])
                console.log(state.unreadMessages, 'unread')
            }
            if (!state.refreshState) { return true }
            setTimeout(async() => {
                await dispatch('markAsRead');
                outResolve()
            }, 1500)
            await promise
            //alert('awaited')
            setTimeout(() => {
                dispatch('refreshMessagesList');
                console.log('refreshed')
            }, 5000)
            return true
        },
        async markAsRead({ state, dispatch }) {
            console.log(state.unreadMessages.length, 'lngth')
            var length = state.unreadMessages.length
            for (var i = 0; i < length; i++) { //nice... (i < state.unreadMessages.length) <= this one had me
                state.messagesList.push(state.unreadMessages.shift())
                console.log(state.unreadMessages)
                await dispatch('deleteFiles', state.newnotifications[i].id)
            }
            await dispatch('patchMessageFile')
            return true
                //dispatch('refreshFilesList')
        },
        async patchMessageFile({ state }) {
            state.isLoading = true

            var id = state.messageFileId
            var outResolve;
            var promise = new Promise((resolve, reject) => { outResolve = resolve })
            var xhr_up = new XMLHttpRequest;
            xhr_up.open("PATCH", "https://www.googleapis.com/upload/drive/v3/files/" + id + "?uploadType=multipart")
            xhr_up.setRequestHeader('Authorization', 'Bearer ' + state.accessToken)
            xhr_up.onload = function() {
                if (this.status == 200) {
                    console.log("Patched", this.response)
                } else {
                    console.log("error", this.status)
                }
                outResolve()
            }
            var fileContent, fileType

            fileContent = '{"messages":' + JSON.stringify(state.messagesList) + '}'
            fileType = 'application/json';
            console.log(fileContent, "ffffffff")

            var metadata = {
                'mimeType': fileType,
            }

            var file = new Blob([fileContent], { type: fileType });

            var data = new FormData();
            data.append("metadata", new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
            data.append("file", file);

            xhr_up.send(data)
            await promise
            state.isLoading = false

            return fileContent
        },
        async refreshAll({ dispatch }) {
            return setInterval(async() => {
                console.log('refreshing')
                    //await dispatch('refreshFilesList');
                await dispatch('refreshMessagesList')
            }, 7000);
        },
        async deleteMessage({ state, dispatch }, arg) {
            state.messagesList.splice(state.messagesList.indexOf(arg), 1)
            setTimeout(() => dispatch('patchMessageFile'), 500)
            console.log('deleted')
        }
    },
    modules: {
        notes: notes
    }
})