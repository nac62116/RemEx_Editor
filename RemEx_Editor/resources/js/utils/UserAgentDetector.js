class UserAgentDetector {

    constructor() {
        let userAgent = navigator.userAgent;

        this.isGeckoEngine = false;

        if (userAgent.includes("Gecko/")) {
            this.isGeckoEngine = true;
        }
    }

}

export default new UserAgentDetector();