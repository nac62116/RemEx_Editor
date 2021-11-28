import Config from "../utils/Config.js";

class LoadingScreenView {

    init(loadingScreenElement) {
        this.loadingScreen = loadingScreenElement;
    }

    show(message) {
        this.loadingScreen.firstElementChild.innerHTML = message;
        this.loadingScreen.classList.remove(Config.HIDDEN_CSS_CLASS_NAME);
    }

    hide() {
        if (!this.loadingScreen.classList.contains(Config.HIDDEN_CSS_CLASS_NAME)) {
            this.loadingScreen.classList.add(Config.HIDDEN_CSS_CLASS_NAME);
        }
    }
}

export default new LoadingScreenView();