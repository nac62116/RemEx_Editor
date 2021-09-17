/**
 * Configuration object for values shared by multiple components
 */

const Config = {

    // General app settings:

    MAX_ID_SIZE: 10000,
    MAX_ID_ALERT: "Du kannst maximal 10.000 Schritte auf einer Ebene erstellen. Kontaktiere den Support falls du die Grenze erweitern möchtest.",
    STEP_CONSTRUCTOR_ERROR: "Cannot construct Step instances directly. Please construct subclasses of Step.",
    QUESTION_CONSTRUCTOR_ERROR: "Cannot construct Question instances directly. Please construct subclasses of Question.",
    NODE_VIEW_CONSTRUCTOR_ERROR: "Cannot construct NodeView instances directly. Please construct subclasses of NodeView.",
 
    // View related:

    // View events:

    EVENT_NODE_CLICKED: "nodeclicked",
    EVENT_NODE_MOUSE_ENTER: "nodemouseenter",
    EVENT_NODE_MOUSE_LEAVE: "nodemouseleave",
    EVENT_NODE_START_DRAG: "nodestartdrag",
    EVENT_NODE_ON_DRAG: "nodeondrag",
    EVENT_NODE_ON_DROP: "nodeondrop",
    EVENT_ADD_NODE: "addnextnode",
    EVENT_ADD_PREV_NODE: "addprevnode",
    EVENT_INPUT_CHANGED: "inputchanged",
    EVENT_REMOVE_NODE: "removeNode",

    // DOM Element ids:

    TREE_VIEW_CONTAINER_ID: "treeContainer",
    NODE_TEMPLATE_ID: "nodeTemplate",
    INPUT_VIEW_CONTAINER_ID: "inputContainer",
    INPUT_VIEW_FIELDS_CONTAINER_ID: "inputFieldsContainer",
    INPUT_VIEW_HEADER_ID: "inputHeader",
    INPUT_VIEW_DELETE_BUTTON_ID: "inputDeleteButton",
    INPUT_VIEW_SAVE_BUTTON_ID: "inputSaveButton",

    // CSS Class names:

    HIDDEN_CSS_CLASS_NAME: "hidden",
    INPUT_FIELD_CSS_CLASS_NAME: "input-field",

    // Input view
    INPUT_EXPERIMENT_NAME_ID: "experimentNameInput",
    INPUT_EXPERIMENT_NAME_LABEL: "Name des Experiments:",
    INPUT_EXPERIMENT_GROUP_NAME_ID: "experimentGroupNameInput",
    INPUT_EXPERIMENT_GROUP_NAME_LABEL: "Name der Experimentgruppe:",

    // Selfmade attributes:

    EMPHASIZE_FILL_OPACITY_BY: "emphasize-fill-opacity-by",
    EMPHASIZE_STROKE_OPACITY_BY: "emphasize-stroke-opacity-by",

    // Colors, styles and dimensions:

    // Tree view
    TREE_VIEW_BACKGROUND_COLOR: "black",
    TREE_VIEW_BACKGROUND_OPACITY: "0.5",
    TREE_VIEW_ROW_DISTANCE_FACTOR: 0.7,
    TREE_MOVEMENT_ANIMATION_STEPS: 10,
    TREE_MOVEMENT_ANIMATION_FRAME_RATE_MS: 10,
    INSERT_BEFORE: "insertBeforeNode",
    INSERT_AFTER: "insertAfterNode",

    // TimelineView
    TIMELINE_WIDTH_RATIO: 0.9,
    TIMELINE_INITIAL_TIME_SPAN_IN_DAYS: 7,
    TIMELINE_DISTANCE_FROM_TREE_VIEW_BORDER: 10,
    TIMELINE_ID: "timeline",
    TIMELINE_Y1: "50%",
    TIMELINE_Y2: "50%",
    TIMELINE_STROKE_WIDTH: "3",
    TIMELINE_COLOR: "black",
    TIMELINE_STROKE_OPACITY_DEEMPHASIZED: "0.3",
    TIMELINE_STROKE_OPACITY_EMPHASIZE_BY: "0.7",
    TIMELINE_DESCRIPTION_ID: "timelineDescription",
    TIMELINE_DESCRIPTION_X: "0",
    TIMELINE_DESCRIPTION_Y: "0",
    TIMELINE_DESCRIPTION_TEXT_ANCHOR: "middle",
    TIMELINE_DESCRIPTION_COLOR: "white",
    TIMELINE_DESCRIPTION_FILL_OPACITY_DEEMPHASIZED: "0.3",
    TIMELINE_DESCRIPTION_FILL_OPACITY_EMPHASIZE_BY: "0.7",
    TIMELINE_DESCRIPTION_STROKE_OPACITY_DEEMPHASIZED: "0",
    TIMELINE_DESCRIPTION_STROKE_OPACITY_EMPHASIZE_BY: "0",
    TIMELINE_DESCRIPTION_FONT_FAMILY: "Helvetica",
    TIMELINE_DESCRIPTION_FONT_SIZE: "80%",
    TIMELINE_DESCRIPTION_FONT_WEIGHT: "bold",

    // NodeView 
    NODE_WIDTH: "100",
    NODE_HEIGHT: "120",
    NODE_DISTANCE_HORIZONTAL: 130,
    
    // NodeView input path
    NODE_INPUT_PATH_STROKE_WIDTH: "2",
    NODE_INPUT_PATH_STROKE_COLOR: "black",
    NODE_INPUT_PATH_STROKE_OPACITY_DEEMPHASIZED: "0.3",
    NODE_INPUT_PATH_STROKE_OPACITY_EMPHASIZED: "1",

    // NodeView body (Sizes are relative to the tree node)
    NODE_BODY_ID: "nodeBody",
    NODE_BODY_X: "2%",
    NODE_BODY_Y: "2%",
    NODE_BODY_WIDTH: "96%",
    NODE_BODY_HEIGHT: "96%",
    NODE_BODY_BORDER_RADIUS: "10%",
    NODE_BODY_FILL_COLOR: "black",
    NODE_BODY_FILL_COLOR_FOCUSED: "rgb(0, 102, 204)",
    NODE_BODY_FILL_OPACITY_DEEMPHASIZED: "0.1",
    NODE_BODY_FILL_OPACITY_EMPHASIZED: "0.5",
    NODE_BODY_STROKE_WIDTH: "2%",
    NODE_BODY_STROKE_COLOR: "black",
    NODE_BODY_STROKE_OPACITY_DEEMPHASIZED: "0.3",
    NODE_BODY_STROKE_OPACITY_EMPHASIZED: "1",

    // NodeView add buttons
    NODE_ADD_BUTTON_DISTANCE: 65,
    NODE_ADD_BUTTON_RADIUS: "10",
    NODE_ADD_BUTTON_FILL_COLOR_DEEMPHASIZED: "black",
    NODE_ADD_BUTTON_FILL_COLOR_EMPHASIZED: "rgb(0, 102, 204)",
    NODE_ADD_BUTTON_FILL_OPACITY_DEEMPHASIZED: "0.1",
    NODE_ADD_BUTTON_FILL_OPACITY_EMPHASIZED: "0.5",
    NODE_ADD_BUTTON_STROKE_WIDTH: "2",
    NODE_ADD_BUTTON_STROKE_COLOR: "black",
    NODE_ADD_BUTTON_STROKE_OPACITY_DEEMPHASIZED: "0.3",
    NODE_ADD_BUTTON_STROKE_OPACITY_EMPHASIZED: "1",

    // NodeView description (Sizes are relative to the tree node)
    NODE_DESCRIPTION_ID: "nodeDescription",
    NODE_DESCRIPTION_MAX_LENGTH: 25,
    NODE_DESCRIPTION_X: "50%",
    NODE_DESCRIPTION_Y: "66%",
    NODE_DESCRIPTION_TEXT_ANCHOR: "middle",
    // How many symbols until a linebreak is inserted
    NODE_DESCRIPTION_LINE_BREAK_COUNT: 11,
    NODE_DESCRIPTION_LINE_SPACING: "1.2em",
    NODE_DESCRIPTION_COLOR: "white",
    NODE_DESCRIPTION_FILL_OPACITY_DEEMPHASIZED: "0.3",
    NODE_DESCRIPTION_FILL_OPACITY_EMPHASIZED: "1",
    NODE_DESCRIPTION_FONT_FAMILY: "Helvetica",
    NODE_DESCRIPTION_FONT_SIZE: "80%",
    NODE_DESCRIPTION_FONT_WEIGHT: "bold",

    // Node descriptions
    NEW_EXPERIMENT_NAME: "Neues Experiment",
    NEW_EXPERIMENT_GROUP_NAME: "Neue Experiment Gruppe",
    NEW_STEP_DESCRIPTION: "Neuer Schritt",
    NEW_QUESTION_DESCRIPTION: "Neue Frage",
    BREATHING_EXERCISE_DESCRIPTION: "Atemübung",
    
    // Types

    // Experiment
    TYPE_EXPERIMENT: "experiment",
    // Experiment group
    TYPE_EXPERIMENT_GROUP: "experimentGroup",
    // Survey
    TYPE_SURVEY: "survey",
    // Instruction
    TYPE_INSTRUCTION: "instruction",
    // Breathing exercise
    TYPE_BREATHING_EXERCISE: "breathingExercise",
    // Questionnaire
    TYPE_QUESTIONNAIRE: "questionnaire",
    // Question
    TYPE_QUESTION: "question",

    // Input invalid messages:
    
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
    
    // Model related:
    
    // Step types:

    // If you change these values, change them accordingly in the RemEx_App model
    // -> https://github.com/nac62116/RemEx_App/tree/main/app/src/main/java/de/ur/remex/model/experiment
    STEP_TYPE_INSTRUCTION: "INSTRUCTION",
    STEP_TYPE_BREATHING_EXERCISE: "BREATHING_EXERCISE",
    STEP_TYPE_QUESTIONNAIRE: "QUESTIONNAIRE",

    // Question types:

    // If you change these values, change them accordingly in the RemEx_App model
    // -> https://github.com/nac62116/RemEx_App/tree/main/app/src/main/java/de/ur/remex/model/experiment
    QUESTION_TYPE_CHOICE: "CHOICE",
    QUESTION_TYPE_TEXT: "TEXT",
    QUESTION_TYPE_LIKERT: "LIKERT",
    QUESTION_TYPE_TIME_INTERVAL: "TIME_INTERVAL",
    QUESTION_TYPE_POINT_OF_TIME: "POINT_OF_TIME",

    // Breathing modes:

    // If you change these values, change them accordingly in the RemEx_App model
    // -> https://github.com/nac62116/RemEx_App/tree/main/app/src/main/java/de/ur/remex/model/experiment
    BREATHING_MODE_MOVING_CIRCLE: "MOVING_CIRCLE",
    BREATHING_MODE_STATIC_CIRCLE: "STATIC_CIRCLE",

    // Choice types:

    // If you change these values, change them accordingly in the RemEx_App model
    // -> https://github.com/nac62116/RemEx_App/tree/main/app/src/main/java/de/ur/remex/model/experiment
    CHOICE_TYPE_SINGLE_CHOICE: "SINGLE_CHOICE",
    CHOICE_TYPE_MULTIPLE_CHOICE: "MULTIPLE_CHOICE",
};

Object.freeze(Config);

export default Config;