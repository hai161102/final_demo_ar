import TextureLoaderTool from "./assets/scripts/TextureLoaderTool.js";
import { listImagePaths } from "./assets/scripts/Utils.js";
const loadingScene = document.getElementById('loading-scene');

const loadingText = document.getElementById('percent-text');
const progressBar = document.getElementById('loading-bar');

const progressElement = document.getElementById('bar');
var scene = document.querySelector('a-scene');

scene.addEventListener('loaded', function (e) {
    loadingScene.remove();
    scene.systems.arjs.el.isAR = true;
    console.log('canvas', scene.canvas);
    console.log(scene.systems);
});
let percent = 0;
let currentProgress = 0;

function loadView(percentage) {
    currentProgress += percentage;
    console.log('Loading ', currentProgress, '%');
    loadingText.innerText = Number.parseInt(currentProgress.toString()) + '';
    progressElement.style.width = `${currentProgress}%`;
    if (currentProgress >= 100) {
        console.log('Loaded')
        loadModel();
    }
}

let object = null;
const modelElement = document.getElementById('girlModel');

const listTextures = [];
percent = parseFloat((100 / listImagePaths.length).toFixed(2));
console.log('Loading percent: ', percent, '%');

listImagePaths.forEach((path) => {
    listTextures.push(TextureLoaderTool.instance().load(path, (data) => {
        loadView(percent);
    }));
});


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
