import TextureLoaderTool from "./assets/scripts/TextureLoaderTool.js";
import { listImagePaths } from "./assets/scripts/Utils.js";


const loadingView = document.getElementById('loadingView');
const loadingBar = document.getElementById('loadingBar');
const scene = document.getElementById('scene');
let percent = 0;
let currentProgress = 0;

function loadView(percentage) {
    currentProgress += percentage;
    loadingBar.style.width = `${currentProgress}%`;
    if (currentProgress >= 100) {
        loadingView.remove();
    }
}

let object = null;
const modelElement = document.getElementById('girlModel');

const listTextures = [];

listImagePaths.forEach((path) => {
    listTextures.push(TextureLoaderTool.instance().load(path));
});

percent = 100/ listImagePaths.length;

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
                                    loadView(percent)
                                }
                            })
                        }
                    }
                });
            }
            else {
                for (let property in child.material) {
                    if (child.material[property] instanceof THREE.Texture && (child.material[property]!== undefined || child.material[property]!= null)) {
                        listTextures.forEach((texture) => {
                            if (child.material[property].name.includes(texture.name)) {
                                child.material[property].source = texture.source;
                                loadView(percent)
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