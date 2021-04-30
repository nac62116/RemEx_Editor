/* eslint-env browser */

import Experiment from "../model/Experiment.js";

// App controller controls the program flow. It has instances of all views and the model.
// It is the communication layer between the views and the data model.

class Controller {

    init() {
        let experiment = new Experiment();
        if (experiment.isValid() !== true) {
            console.log(experiment.isValid());
        }
        experiment.setName("Experiment");
        if (experiment.isValid() === true) {
            console.log(experiment.getName());
        }
    }
    
}

export default new Controller();