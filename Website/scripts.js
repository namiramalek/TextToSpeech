"use strict";

const serverUrl = "http://127.0.0.1:8000";

async function uploadImage() {
  console.log("inside uploadImage");
    // encode input file as base64 string for upload
    let file = document.getElementById("file").files[0];
    let converter = new Promise(function(resolve, reject) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result
            .toString().replace(/^data:(.*,)?/, ''));
        reader.onerror = (error) => reject(error);
    });
    let encodedString = await converter;

    // clear file upload input field
    document.getElementById("file").value = "";

    // make server call to upload image
    // and return the server upload promise
    return fetch(serverUrl + "/images", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({filename: file.name, filebytes: encodedString})
    }).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new HttpError(response);
        }
    })
}

function updateImage(image) {
    console.log("inside updateimage");
    document.getElementById("view").style.display = "block";

    let imageElem = document.getElementById("image");
    imageElem.src = image["fileUrl"];
    imageElem.alt = image["fileId"];
    console.log("end updateImage");

    return image;
}



function translateImage(image) {
    // make server call to translate image
    // and return the server upload promise
    console.log("inside translateImage!");
    
    return fetch(serverUrl + "/images/" + image["fileId"] + "/translate-text", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({fromLang: "auto", toLang: "en"})
    }).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new HttpError(response);
        }
    })
   

    console.log("End translateImage!");
}

function annotateImage(translations) {
    console.log("inside annotateImage!");
    let translationsElem = document.getElementById("translations");
    while (translationsElem.firstChild) {
        translationsElem.removeChild(translationsElem.firstChild);
    }
    translationsElem.clear
    for (let i = 0; i < translations.length; i++) {
        let translationElem = document.createElement("h6");
        translationElem.appendChild(document.createTextNode(
            translations[i]["text"] + " -> " + translations[i]["translation"]["translatedText"]
        ));
        translationsElem.appendChild(document.createElement("hr"));
        translationsElem.appendChild(translationElem);
    }

    
    

    
    console.log("End annotateImage!");
}

function uploadAndTranslate() {
    uploadImage()
        .then(image => updateImage(image))
        .then(image => translateImage(image))
        .then(translations => annotateImage(translations))
        .catch(error => {
            alert("Error: " + error);
        })
}


function myFunction() {
  

    var x = document.createElement("AUDIO");
                    
        if (x.canPlayType("audio/mpeg")) {
        x.setAttribute("src","namira_speaking_pictorial.mp3");
            }              
        x.setAttribute("controls", "controls");
        document.body.appendChild(x);
}
                    

class HttpError extends Error {
    constructor(response) {
        super(`${response.status} for ${response.url}`);
        this.name = "HttpError";
        this.response = response;
    }
}

