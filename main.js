import TextureLoaderTool from "./assets/scripts/TextureLoaderTool.js";
import { listImagePaths } from "./assets/scripts/Utils.js";

const progressBarElement = 'progressElement';
const loadingScene = document.createElement('div');
const loadingLogo = document.createElement('img');
loadingLogo.src = './assets/images/Logo.png';
loadingLogo.style.width = '24%';
loadingLogo.style.margin = '24px';
loadingScene.style.width = '100%';
loadingScene.style.height = '100%';
loadingScene.style.position = 'absolute';
loadingScene.style.display = 'flex';
loadingScene.style.flexDirection = 'column';
loadingScene.style.justifyContent = 'center';
loadingScene.style.alignItems = 'center';
loadingScene.style.zIndex = '1000';
loadingScene.appendChild(loadingLogo);

const loadingText = document.createElement('label');
loadingText.innerText = 'Loading...';
loadingText.style.fontSize = '48%%';
loadingText.style.margin = '36px';
loadingText.style.color = 'antiquewhite';
loadingText.style.fontFamily = '\'Bebas Neue\', sans-serif';
loadingScene.appendChild(loadingText);
const progressBar = document.createElement('div');
progressBar.id = 'progressBar';
progressBar.style.width = '300px';
progressBar.style.height = '10px';
progressBar.style.backgroundColor = '#252525';
progressBar.style.borderRadius = '10px';
progressBar.style.overflow = 'hidden';

const progressElement = document.createElement('div');
progressElement.id = progressBarElement;
progressElement.style.height = '100%';
progressElement.style.backgroundColor = '#e28743';
progressElement.style.width = '0';
progressElement.style.transition = 'width 0.3s ease-in-out';

progressBar.appendChild(progressElement);
loadingScene.appendChild(progressBar);

document.body.appendChild(loadingScene);
var scene = document.querySelector('a-scene');
    scene.addEventListener('loaded', function (e) {
        loadingScene.remove();

    });
let percent = 0;
let currentProgress = 0;

function loadView(percentage) {
    currentProgress += percentage;
    console.log('Loading ', currentProgress, '%');
    loadingText.innerText = 'Loading...' + currentProgress.toFixed(2) + '%';
    progressElement.style.width = `${currentProgress}%`;
    if (currentProgress >= 100) {
        loadingScene.remove();
        setTimeout(()=> {
            loadModel();
        }, 500);
    }
}

let object = null;
const modelElement = document.getElementById('girlModel');

const listTextures = [];
percent = 100 / listImagePaths.length;

listImagePaths.forEach((path) => {
    listTextures.push(TextureLoaderTool.instance().load(path, (data) => {
        loadView(percent);
    }));
});
loadModel();


function loadModel() {
    modelElement.addEventListener('model-loaded', (e) => {
        object = e.detail.model;
        console.log(object);
        object.traverse(function (child) {
            if (child.isMesh) {
                if (child.material instanceof Array) {
                    child.material.forEach((m) => {
                        for (let property in m) {
                            if (m[property] instanceof THREE.Texture && (m[property] !== undefined || m[property] != null)) {
                                listTextures.forEach((texture) => {
                                    if (m[property].name.includes(texture.name)) {
                                        m[property].source = texture.source;
                                    }
                                })
                            }
                        }
                    });
                }
                else {
                    for (let property in child.material) {
                        if (child.material[property] instanceof THREE.Texture && (child.material[property] !== undefined || child.material[property] != null)) {
                            listTextures.forEach((texture) => {
                                if (child.material[property].name.includes(texture.name)) {
                                    child.material[property].source = texture.source;
                                }
                            })
                        }
                    }
                }
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    });
}
