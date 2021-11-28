import Config from "../utils/Config.js";

class Experiment {

    constructor() {
        this.id = null;
        this.type = Config.TYPE_EXPERIMENT;
        this.name = "Neues Experiment";
        this.groups = [];
    }
}

export default Experiment;