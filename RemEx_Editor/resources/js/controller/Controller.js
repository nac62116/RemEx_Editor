/* eslint-env browser */

import Experiment from "../model/Experiment.js";

// App controller controls the program flow. It has instances of all views and the model.
// It is the communication layer between the views and the data model.

// TODO: Input checks:
// - Checking if bad characters like ", {}, etc. are automatically escaped
// - Defining max characters for several input fields
// - Input fields that allow only one type or type check after input
// - Format checks inside the views input fields (Delete the ones without usage in the model)

// TODO: Calculate the optimal duration for a survey depending on its steps

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