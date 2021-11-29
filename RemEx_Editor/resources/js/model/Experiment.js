import Config from "../utils/Config.js";

class Experiment {

    constructor(id) {
        this.id = id;
        this.type = Config.TYPE_EXPERIMENT;
        this.name = "Neues Experiment";
        this.groups = [];
    }
}

export default Experiment;