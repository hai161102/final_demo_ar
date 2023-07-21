
export default class TextureLoaderTool {
    static _instance = null;
    textureLoader = null;
    constructor() {
        
        this.textureLoader = new THREE.TextureLoader();
    }

    static instance() {
        if(TextureLoaderTool._instance == null) TextureLoaderTool._instance = new TextureLoaderTool();
        return TextureLoaderTool._instance;
    }

    load(path, onLoaded, onLoadProgress, onLoadError) {
        let texture = this.textureLoader.load(path, onLoaded, onLoadProgress, onLoadError);
        let pathSplits = path.split('/');
        let fileName = pathSplits[pathSplits.length - 1].split('.')[0];

        texture.name = fileName;
        return texture;
    }

}