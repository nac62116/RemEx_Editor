/* eslint-env browser */

const STORAGE_KEY = "experiment-data-storage";

class Storage {

    save(experiment) {
        let experimentJSON = JSON.stringify(experiment);
        localStorage.setItem(STORAGE_KEY, experimentJSON);
    }

    load() {
        let experiment,
        experimentJSON = localStorage.getItem(STORAGE_KEY) || "";
        if (experimentJSON === "") {
            return undefined;
        }
        experiment = JSON.parse(experimentJSON);
        return experiment;
    }

    clear() {
        localStorage.clear();
    }
}

export default new Storage();