"use strict";
chrome.runtime.onMessage.addListener(function(e, t, n) {
    if (e["COMMAND"] === "GET_TITLE") {
        n({
            pageTitle: document.title
        })
    }
});
window.addEventListener("load", function() {
    function t() {
        chrome.runtime.sendMessage({
            youtube: "true",
            video_id: e,
            url: document.URL,
            title: document.title
        }, function(e) {
            console.log("DashNotes - YouTube")
        });
        var t = document.getElementsByClassName("html5-context-menu")[0];
        t.style.display = "none"
    }
    var e;
    if (window.location.hostname == "www.youtube.com") {
        e = window.location.search.split("v=")[1];
        var n = e.indexOf("&");
        if (n != -1) {
            e = e.substring(0, n)
        }
        if (e) {
            var r = document.createElement("li");
            var i = document.createElement("span");
            i.className = "yt-uix-button-menu-item";
            i.innerHTML = "Add Youtube Video to DashNotes";
            r.appendChild(i);
            r.onclick = t;
            var s = document.getElementsByClassName("html5-context-menu")[0];
            s.appendChild(r)
        }
    } else {
        chrome.runtime.sendMessage({
            other: "true"
        }, function(e) {
            console.log("DashNotes - YouTube")
        })
    }
})
