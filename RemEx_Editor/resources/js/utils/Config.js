/* eslint-env browser */

/**
 * Configuration object for values shared by multiple components
 */

const Config = {

    // General app settings

    MAX_ID_SIZE: 10000,
    MAX_ID_ALERT: "Du kannst maximal 10.000 Schritte auf einer Ebene erstellen. Kontaktiere den Support falls du die Grenze erweitern möchtest.",
    STEP_CONSTRUCTOR_ERROR: "Cannot construct Step instances directly. Please construct subclasses of Step.",
    QUESTION_CONSTRUCTOR_ERROR: "Cannot construct Question instances directly. Please construct subclasses of Question.",

    // Step types 
    // If you change these values, change them accordingly in the RemEx_App model
    // -> https://github.com/nac62116/RemEx_App/tree/main/app/src/main/java/de/ur/remex/model/experiment

    STEP_TYPE_INSTRUCTION: "INSTRUCTION",
    STEP_TYPE_BREATHING_EXERCISE: "BREATHING_EXERCISE",
    STEP_TYPE_QUESTIONNAIRE: "QUESTIONNAIRE",

    // Question types 
    // If you change these values, change them accordingly in the RemEx_App model
    // -> https://github.com/nac62116/RemEx_App/tree/main/app/src/main/java/de/ur/remex/model/experiment

    QUESTION_TYPE_CHOICE: "CHOICE",
    QUESTION_TYPE_TEXT: "TEXT",
    QUESTION_TYPE_LIKERT: "LIKERT",
    QUESTION_TYPE_TIME_INTERVAL: "TIME_INTERVAL",
    QUESTION_TYPE_POINT_OF_TIME: "POINT_OF_TIME",

    // Breathing modes 
    // If you change these values, change them accordingly in the RemEx_App model
    // -> https://github.com/nac62116/RemEx_App/tree/main/app/src/main/java/de/ur/remex/model/experiment

    BREATHING_MODE_MOVING_CIRCLE: "MOVING_CIRCLE",
    BREATHING_MODE_STATIC_CIRCLE: "STATIC_CIRCLE",

    // Choice types
    // If you change these values, change them accordingly in the RemEx_App model
    // -> https://github.com/nac62116/RemEx_App/tree/main/app/src/main/java/de/ur/remex/model/experiment

    CHOICE_TYPE_SINGLE_CHOICE: "SINGLE_CHOICE",
    CHOICE_TYPE_MULTIPLE_CHOICE: "MULTIPLE_CHOICE",

    // Input invalid messages

    EXPERIMENT_NAME_EMPTY: "Bitte wähle einen geeigneten Namen für dein Experiment um fortzufahren.",
    EXPERIMENT_GROUP_NAME_EMPTY: "Bitte wähle einen geeigneten Namen für deine Experiment Gruppe um fortzufahren.",
    EXPERIMENT_GROUP_NAME_NOT_UNIQUE: "Der gewählte Name deiner Experiment Gruppe existiert bereits. Bitte wähle einen einzigartigen Namen.",
    SURVEY_NAME_NOT_UNIQUE: "Der gewählte Name deiner Befragung existiert bereits. Bitte wähle einen einzigartigen Namen.",
    SURVEY_OVERLAPS: "Die gewählte Startzeit und Dauer der Befragung überlappt mit dem Zeitfenster einer anderen Befragungen. Das Zeitfenster einer Befragung berechnet sich aus der Erinnerungsdauer und der Befragungsdauer. In diesem Zeitfenster sollten keine weiteren Befragungen geplant werden.",
};

Object.freeze(Config);

export default Config;