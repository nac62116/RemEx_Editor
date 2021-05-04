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
    NODE_VIEW_CONSTRUCTOR_ERROR: "Cannot construct NodeView instances directly. Please construct subclasses of NodeView.",

    // Colors and styles

    // Tree view
    TREE_VIEW_BACKGROUND_COLOR: "black",
    TREE_VIEW_BACKGROUND_OPACITY: "0.5",

    // Tree node view
    TREE_NODE_WIDTH: "100",
    TREE_NODE_HEIGHT: "150",
    TREE_NODE_BORDER_RADIUS: "10",
    TREE_NODE_BACKGROUND_COLOR: "black",
    TREE_NODE_BACKGROUND_OPACITY: "0.8",
    TREE_NODE_STROKE_WIDTH: "5",
    TREE_NODE_STROKE_COLOR: "black",
    TREE_NODE_STROKE_OPACITY: "1",
    TREE_NODE_PATH_STROKE_WIDTH: "2",
    TREE_NODE_PATH_STROKE_COLOR: "black",
    TREE_NODE_PATH_STROKE_OPACITY: "1",

    // DOM Element ids

    TREE_VIEW_CONTAINER_ID: "treeContainer",
    NODE_TEMPLATE_ID: "nodeTemplate",

    // Tree node types

    TREE_NODE_TYPE_EXPERIMENT: "experimentNode",
    TREE_NODE_TYPE_EXPERIMENT_GROUP: "experimentGroupNode",
    TREE_NODE_TYPE_INSTRUCTION: "instructionNode",
    TREE_NODE_TYPE_BREATHING_EXERCISE: "breathingExerciseNode",
    TREE_NODE_TYPE_QUESTIONNAIRE: "questionnaireNode",
    TREE_NODE_TYPE_QUESTION: "questionNode",

    // TODO

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
    EXPERIMENT_GROUP_NAME_NOT_UNIQUE: "Der gewählte Name deiner Experiment Gruppe existiert bereits. Bitte wähle einen einzigartigen Namen um bei der Auswertung der späteren CSV-Daten keine Duplikate zu erzeugen.",
    SURVEY_NAME_EMPTY: "Um deine Befragung erfolgreich zu erstellen musst du ihr einen Namen geben.",
    SURVEY_DURATION_INVALID: "Die Dauer deiner Befragung wurde noch nicht angegeben oder beinhaltet einen Wert unter 0. Bitte gebe die Dauer deiner Befragung in Minuten an.",
    SURVEY_TIME_NOT_SET: "Es wurde noch keine Erinnerungszeit für deine Befragung angegeben. Bitte wähle eine absolute Uhrzeit (z.B. 15:30 Uhr am ersten Befragungstag, 8:45 Uhr am dritten Befragungstag, ...) oder eine relative Erinnerungszeit, im Verhältnis zur letzten Befragung (z.B. +30 Min, +2 Std, +2 Tage, ...)",
    RELATIVE_SURVEY_TIME_INVALID: "Die relative Erinnerungszeit darf keinen Wert unter 0 haben, da sie den Zeitabstand zur letzten Befragung definiert.",
    ABSOLUTE_SURVEY_TIME_INVALID: "Deine eingestellte Absolute Erinnerungszeit entspricht nicht der richtigen Formatierung. Bitte gebe für den Minutenwert eine Zahl zwischen 0 und 59, für den Stundenwert eine Zahl zwischen 0 und 24 und für den Tagewert eine Zahl größer oder gleich 0 ein.",
    SURVEY_NOTIFICATION_DURATION_INVALID: "Du hast noch keine Erinnerungsdauer angegeben. Bitte wähle eine Dauer die größer als 0 ist.",
    SURVEY_NAME_NOT_UNIQUE: "Der gewählte Name deiner Befragung existiert bereits. Bitte wähle einen einzigartigen Namen um bei der Auswertung der späteren CSV-Daten keine Duplikate zu erzeugen.",
    SURVEY_OVERLAPS: "Die gewählte Startzeit und Dauer der Befragung überlappt mit dem Zeitfenster einer anderen Befragungen. Das Zeitfenster einer Befragung berechnet sich aus der Erinnerungsdauer und der Befragungsdauer. In diesem Zeitfenster sollten keine weiteren Befragungen geplant werden.",
    QUESTION_NAME_NOT_UNIQUE: "Der gewählte Name deiner Frage existiert bereits. Bitte wähle einen einzigartigen Namen um bei der Auswertung der späteren CSV-Daten keine Duplikate zu erzeugen.",
    ANSWER_CODE_NOT_UNIQUE: "Der gewählte Code deiner Antwort existiert bereits. Bitte wähle einen einzigartigen Namen um bei der Auswertung der späteren CSV-Daten keine Duplikate zu erzeugen.",
};

Object.freeze(Config);

export default Config;