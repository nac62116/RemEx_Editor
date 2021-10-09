import Config from "./Config.js";

// Class to find unique ids for surveys, steps, questions...

class IdManager {

    constructor() {
        this.ids = [];
    }

    setIds(ids) {
        this.ids = ids;
    }

    removeIds() {
        this.ids = [];
    }

    getUnusedId() {
        let id = 0;
        while (id !== Config.MAX_ID_SIZE) {
            if (!this.ids.includes(id)) {
                this.ids.push(id);
                return id;
            }
            id++;
        }
        return Config.MAX_ID_ALERT;
    }

    removeId(id) {
        let index = this.ids.indexOf(id);
        if (index !== -1) {
            this.ids.splice(index, 1);
        }
    }
}

export default new IdManager();