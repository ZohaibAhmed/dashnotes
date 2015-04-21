"use strict";

function clip(e, t) {
    var n = {}, r;
    if (e.selectionText) {
        n["text"] = e.selectionText;
        n["type"] = "text"
    }
    if (e.srcUrl && e.mediaType == "image") {
        n["image"] = e.srcUrl;
        n["type"] = "image"
    }
    if (!e.srcUrl && !e.selectionText) {
        n["type"] = "page"
    }
    if (e.mediaType == "video") {
        n["type"] = "video";
        n["video"] = e.srcUrl
    }
    n["url"] = e.pageUrl;
    n["title"] = t.title;
    if (localStorage.getItem("notebox")) {
        r = JSON.parse(localStorage.getItem("notebox"))
    }
    if (!r) {
        r = [n]
    } else {
        r.push(n)
    }
    localStorage.setItem("notebox", JSON.stringify(r))
}

function clipYoutube(e, t, n) {
    var r = {}, i;
    r["url"] = e;
    r["type"] = "youtube";
    r["title"] = t;
    r["video_id"] = n;
    if (localStorage.getItem("notebox")) {
        i = JSON.parse(localStorage.getItem("notebox"))
    }
    if (!i) {
        i = [r]
    } else {
        i.push(r)
    }
    localStorage.setItem("notebox", JSON.stringify(i))
}
var clipTextTitle = "Add Text to DashNotes",
    clipPageTitle = "Add Page to DashNotes",
    clipImageTitle = "Add Image to DashNotes",
    clipVideoTitle = "Add Video to DashNotes";
chrome.contextMenus.create({
    title: clipTextTitle,
    onclick: clip,
    contexts: ["selection"]
});
chrome.contextMenus.create({
    title: clipPageTitle,
    onclick: clip,
    contexts: ["page"]
});
chrome.contextMenus.create({
    title: clipImageTitle,
    onclick: clip,
    contexts: ["image"]
});
chrome.contextMenus.create({
    title: clipVideoTitle,
    onclick: clip,
    contexts: ["video"]
});
chrome.runtime.onInstalled.addListener(function(e) {
    chrome.tabs.create({
        url: "chrome://newtab"
    })
});
chrome.runtime.onMessage.addListener(function(e, t, n) {
    if (e.youtube) {
        clipYoutube(e.url, e.title, e.video_id)
    } else if (e.other) {
        chrome.contextMenus.remove("YouTube")
    } else {
        if (localStorage.getItem("notebox")) {
            if (e.appRequest == "notes") n({
                allNotes: JSON.parse(localStorage.getItem("notebox"))
            })
        } else {
            n({})
        }
    }
})
