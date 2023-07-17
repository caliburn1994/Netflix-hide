let movies = null;
let removeOrTint = 'tint';
let edit = true;


const mainConfig = {childList: true, subtree: true};

// 点击按钮
function createButton(sliderDiv) {
    if (!sliderDiv.firstChild || !sliderDiv.firstChild.className.includes('select-style')) {
        const divNode = document.createElement("div");
        divNode.className = "select-style";
        const imgNode = document.createElement("button");
        imgNode.innerHTML = "O";
        imgNode.addEventListener("click", imgClose);
        divNode.appendChild(imgNode);
        sliderDiv.insertBefore(divNode, sliderDiv.firstChild);
    }
}

// 修改样式
function changeView(sliderDiv) {
    createButton(sliderDiv)
    if (removeOrTint === 'tint') {
        sliderDiv.style.opacity = "0.2";
    } else {
        sliderDiv.style.display = "none";
    }
}

// 点击按钮
const hideOrTint = function (sliderDiv) {
    let name = getMovieName(sliderDiv);
    if (name == null) {
        sliderDiv.style.display = "none";
    } else if (movies != null && movies[name]) {
        // 修改样式
        changeView(sliderDiv);
    } else if (edit && !sliderDiv.querySelector("div[class='select-style']")) {
        // 创建按钮
        createButton(sliderDiv);
    }
};




const callback = function (mutationsList) {
    for (let mutation of mutationsList) {
        let div = mutation.target;
        let sliderDiv = getSliderDiv(div);
        if (sliderDiv) {
            hideOrTint(sliderDiv);
        }
    }
};
const observer = new MutationObserver(callback);
const mainCallback = function (mutationsList) {
    for (var mutation of mutationsList) {
        let div = mutation.target;
        let subList = div.querySelectorAll("div[class^='slider']");
        for (let i = 0; i < subList.length; i++) {
            if (movies != null) {
                let divList = subList[i].querySelectorAll("div[class^='slider-item slider-item']");
                for (let sliderDiv of divList) {
                    hideOrTint(sliderDiv);
                }
            }
            observer.observe(subList[i], config);
        }
    }
};
const mainObserver = new MutationObserver(mainCallback);
const addMainListener = function () {
    let main = document.querySelector("div[class='mainView']");
    if (main != null) {
        let subList = main.querySelectorAll("div[class='slider']");
        for (let i = 0; i < subList.length; i++) {
            if (movies != null) {
                let divList = subList[i].querySelectorAll("div[class^='slider-item slider-item']");
                for (let sliderDiv of divList) {
                    hideOrTint(sliderDiv);
                }
            }
            observer.observe(subList[i], config);
        }
        mainObserver.observe(main, mainConfig);
    }
};

document.addEventListener('load', function (e) {
    if (e.target.tagName === "IFRAME") {
        if (edit) {
            addMainListener();
        }
    }
}, true);

let clickedElement = null;
document.addEventListener('mousedown', function (e) {
    if (e.button == 2) {
        clickedElement = e.target;
    }
}, false);
var config = {attributes: true, childList: true, subtree: true};
;
const getMovieName = function (target) {
    let movieElement = target.querySelector("a[aria-label]");
    if (movieElement) {
        return movieElement.getAttribute("aria-label");
    }
    return null;
};
const imgClose = function () {
    saveAndRemoveSlider(this);
};
const getSliderDiv = function (target) {
    return getNearestParent(target, "div[class^='slider-item slider-item']");
};


const editMode = function () {
    if (edit) {
        edit = false;
        observer.disconnect();
        let selectList = document.querySelectorAll("div[class='select-style']");
        for (let i = 0; i < selectList.length; i++) {
            let selectNode = selectList[i];
            let div = selectNode.parentElement;
            div.removeChild(selectNode);
            let movieName = getMovieName(div);
            if (movies[movieName]) {


                changeView(sliderDiv)
            }
        }
        alert("Disabled Quick Editing Mode");
    } else {
        edit = true;
        addMainListener();
        alert("Enabled Quick Editing Mode");
    }
};

const saveAndRemoveSlider = function (clickedElement) {
    let sliderDiv = getSliderDiv(clickedElement);   if (sliderDiv == null) {alert("Please try again.");return;}
    let movieName = getMovieName(sliderDiv);    if (movieName == null) {return;}

    try {


        chrome.storage.sync.get(movieName, function(result) {
            // if it exists, remove
            if (result[movieName]) {
                chrome.storage.sync.remove(movieName, function() {
                    movies[movieName] = null;
                    sliderDiv.style = null;
                });
            } else {
                let tmp = {};
                tmp[movieName] = "Remove";
                movies[movieName] = "Remove";
                chrome.storage.sync.set(tmp, function () {
                    changeView(sliderDiv);
                });
            }
        });

    }
    catch (e) {
    }
};


const resetChromeData = function () {
    chrome.storage.sync.clear(function () {
        window.location.reload(true);
    });
};
chrome.runtime.onMessage.addListener(function (requestMsg, sender, sendResponse) {
    switch (requestMsg) {
        case"Remove":
            saveAndRemoveSlider(clickedElement);
            break;
        case"Reset":
            alert("Reset");
            resetChromeData();
            break;
        case"edit":
            editMode();
            break;
        case"Refresh":
            window.location.reload(true);
            break;
        default:
            break;
    }
});


const getNearestParent = function (elem, selector) {
    for (; elem && elem !== document; elem = elem.parentNode) {
        if (selector) {
            if (elem.matches(selector)) {
                return elem;
            }
        }
    }
    return null;
};
const profileCallback = function (mutationsList) {
    profileObserver.disconnect();
    addMainListener();
};
const profileObserver = new MutationObserver(profileCallback);


// init
function init() {
    chrome.storage.sync.get(["ManageInterface"], function (data) {
        if (data['ManageInterface'] != null) {
            removeOrTint = data['ManageInterface'];
        } else {
            chrome.storage.sync.set({"ManageInterface": removeOrTint}, function() {if(chrome.runtime.error) {console.log("Runtime error.");} else {console.log('Data is stored in Chrome storage');}});
        }

        chrome.storage.sync.get(null, function (e) {
            movies = e;
            let profile = document.querySelector("div[class^='profile']");
            if (profile != null) {
                profileObserver.observe(profile, {childList: true,});
            }
            addMainListener();
        });
    });
}
if (document.readyState === 'complete') {if (movies == null) {init();}}
window.onload = function load() {init();}
