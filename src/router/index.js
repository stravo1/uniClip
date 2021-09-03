import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/myDevice",
  },
  {
    path: "/myDevice",
    name: "myDevice",
    component: () => import("../views/LandingPage.vue"),
  },
  {
    path: "/myDevice/messages/:device",
    name: "messages",
    component: () => import("../views/Messages.vue"),
    children: [
      {
        path: ":media",
        name: "media",
        component: () => import("../views/MediaInfo.vue"),
      },
      {
        path: "media",
        name: "mediainf",
        component: () => import("../views/MediaInfo.vue"),
      },
    ],
  },
  {
    path: "/selectDevice",
    name: "selectDevice",
    component: () => import("../views/selectDevice.vue"),
  },
  {
    path: "/settings",
    name: "settings",
    component: () =>
      import("../views/Settings.vue"),
  },
  {
    path: "/notes",
    name: "notes",
    component: () => import("../views/Notes"),
  },
  {
    path: "/notesViewer",
    name: "nView",
    component: () => import("../views/NotesViewer.vue"),
  },
  {
    path: "/noteEditor",
    name: "nEdit",
    component: () => import("../views/NoteEditor.vue"),
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../views/About"),
  },
  {
    path: "/initialize",
    name: "initialize",
    component: () => import("../views/Initialize"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../views/NotFound"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
