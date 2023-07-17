var editEnabled = true;
window.addEventListener("load", function load() {
    chrome.storage.sync.get("ManageInterface", function (data) {
        if (data['ManageInterface'] == 'remove') {
            document.getElementById('remove').checked = true;
        } else {
            document.getElementById('tint').checked = true;
        }
    });
    // chrome.storage.sync.get("editEnabled", function (data) {
    //     if (data['editEnabled']) {
    //         document.getElementById("edit").className = "editEnabled";
    //         editEnabled = true;
    //         document.getElementById("editTooltip").innerHTML = "Click to disable quick edit mode";
    //     } else {
    //         console.log("disabled");
    //         document.getElementById("edit").className = "editDisabled";
    //         document.getElementById("editTooltip").innerHTML = "Click to enable quick edit mode";
    //     }
    // });
    // document.getElementById("edit").addEventListener("click", function click() {
    //     if (editEnabled) {
    //         this.className = "editDisabled";
    //         editEnabled = false;
    //         document.getElementById("editTooltip").innerHTML = "Click to enable quick edit mode";
    //     } else {
    //         this.className = "editEnabled";
    //         editEnabled = true;
    //         document.getElementById("editTooltip").innerHTML = "Click to disable quick edit mode";
    //     }
    //     chrome.storage.sync.set({"editEnabled": editEnabled}, function (data) {
    //         chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    //             chrome.tabs.sendMessage(tabs[0].id, "edit");
    //         });
    //     });
    // });
    document.getElementById("remove").addEventListener("click", function click() {
        chrome.storage.sync.set({'ManageInterface': 'remove'}, function () {
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, "Refresh");
            });
        });
    });
    document.getElementById("tint").addEventListener("click", function click() {
        chrome.storage.sync.set({'ManageInterface': 'tint'}, function () {
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, "Refresh");
            });
        });
    });
    document.getElementById("reset").addEventListener("click", function click() {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, "Reset");
        });
    });
}, false);
