/**
 * Configuration object for values shared by multiple components
 */

const Config = {

    // General app settings:

    LINE_SPACING: "1.2em",
    LINE_SPACING_TWO_LINES: "2.4em",
    MAX_ID_SIZE: 10000,
    MAX_ID_ALERT: "Du kannst maximal 10.000 Schritte auf einer Ebene erstellen. Kontaktiere den Support falls du die Grenze erweitern möchtest.",
    STEP_CONSTRUCTOR_ERROR: "Cannot construct Step instances directly. Please construct subclasses of Step.",
    QUESTION_CONSTRUCTOR_ERROR: "Cannot construct Question instances directly. Please construct subclasses of Question.",
    NODE_VIEW_CONSTRUCTOR_ERROR: "Cannot construct NodeView instances directly. Please construct subclasses of NodeView.",
 
    // View related:

    // View events:

    EVENT_NODE_CLICKED: "nodeclicked",
    EVENT_NODE_MOUSE_ENTER: "nodeMouseEnter",
    EVENT_NODE_MOUSE_LEAVE: "nodeMouseLeave",
    EVENT_NODE_START_DRAG: "nodeStartDrag",
    EVENT_NODE_ON_DRAG: "nodeOnDrag",
    EVENT_NODE_ON_DROP: "nodeOnDrop",
    EVENT_ADD_NEXT_NODE: "addNextNode",
    EVENT_ADD_PREV_NODE: "addPrevNode",
    EVENT_ADD_CHILD_NODE: "addChildNode",
    EVENT_INPUT_CHANGED: "inputChanged",
    EVENT_REMOVE_NODE: "removeNode",
    EVENT_TIMELINE_MOUSE_ENTER: "timelineMouseEnter",
    EVENT_TIMELINE_MOUSE_LEAVE: "timelineMouseLeave",
    EVENT_TIMELINE_CLICKED: "timelineClicked",

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

    // Colors, styles and dimensions:

    // Tree view
    TREE_VIEW_BACKGROUND_COLOR: "black",
    TREE_VIEW_BACKGROUND_OPACITY: "0.5",
    TREE_VIEW_ROW_DISTANCE_FACTOR: 0.7,
    TREE_VIEW_ROW_DISTANCE: "140",
    TREE_MOVEMENT_ANIMATION_STEPS: 10,
    TREE_MOVEMENT_ANIMATION_FRAME_RATE_MS: 10,
    INSERT_BEFORE: "insertBeforeNode",
    INSERT_AFTER: "insertAfterNode",
    INSERT_SURVEY: "insertSurveyNode",

    // TimelineView
    TIMELINE_WIDTH_RATIO: 0.9,
    TIMELINE_INITIAL_TIME_SPAN_IN_DAYS: 7,
    TIMELINE_DISTANCE_FROM_BORDER: 20,
    TIMELINE_ID: "timeline",
    TIMELINE_Y1: "50%",
    TIMELINE_Y2: "50%",
    TIMELINE_STROKE_WIDTH: "5",
    TIMELINE_COLOR: "black",
    TIMELINE_STROKE_OPACITY_DEEMPHASIZED: "0.3",
    TIMELINE_STROKE_OPACITY_EMPHASIZED: "1",

    // TimelineView description
    TIMELINE_DESCRIPTION_ID: "timelineDescription",
    TIMELINE_DESCRIPTION_X: "50%",
    TIMELINE_DESCRIPTION_Y: "10%",
    TIMELINE_DESCRIPTION_TEXT_ANCHOR: "middle",
    TIMELINE_DESCRIPTION_TEXT_FIRST_LINE: "Zeitachse der Befragungen",
    TIMELINE_DESCRIPTION_COLOR: "white",
    TIMELINE_DESCRIPTION_FILL_OPACITY_DEEMPHASIZED: "0.7",
    TIMELINE_DESCRIPTION_FILL_OPACITY_EMPHASIZED: "1",
    TIMELINE_DESCRIPTION_FONT_FAMILY: "Helvetica",
    TIMELINE_DESCRIPTION_FONT_SIZE: "80%",
    TIMELINE_DESCRIPTION_FONT_WEIGHT: "bold",

    // TimelineView label strokes
    TIMELINE_LABEL_STROKE_ID: "timelineLabelStroke",
    TIMELINE_LABEL_STROKE_Y1_NORMAL: "40%",
    TIMELINE_LABEL_STROKE_Y1_GREATER: "35%",
    TIMELINE_LABEL_STROKE_Y2_NORMAL: "60%",
    TIMELINE_LABEL_STROKE_Y2_GREATER: "65%",
    TIMELINE_LABEL_STROKE_WIDTH_NORMAL: "1",
    TIMELINE_LABEL_STROKE_WIDTH_GREATER: "3",
    TIMELINE_LABEL_STROKE_OPACITY_EMPHASIZED: "1",
    TIMELINE_LABEL_STROKE_OPACITY_DEEMPHASIZED: "0.3",

    // TimelineView label description
    TIMELINE_LABEL_DESCRIPTION_ID: "timelineLabelDescription",
    TIMELINE_LABEL_DESCRIPTION_CENTER_OFFSET_Y_NORMAL: "40",
    TIMELINE_LABEL_DESCRIPTION_CENTER_OFFSET_Y_GREATER: "30",
    TIMELINE_LABEL_DESCRIPTION_TEXT_ANCHOR: "middle",
    TIMELINE_LABEL_DESCRIPTION_COLOR: "white",
    TIMELINE_LABEL_DESCRIPTION_FONT_WEIGHT: "bold",
    TIMELINE_LABEL_DESCRIPTION_FONT_FAMILY: "Helvetica",
    TIMELINE_LABEL_DESCRIPTION_FONT_SIZE_NORMAL: "40%",
    TIMELINE_LABEL_DESCRIPTION_FONT_SIZE_GREATER: "50%",
    TIMELINE_LABEL_DESCRIPTION_FILL_OPACITY_EMPHASIZED: "1",
    TIMELINE_LABEL_DESCRIPTION_FILL_OPACITY_DEEMPHASIZED: "0.7",
    TIMELINE_LABEL_DESCRIPTIONS_PREFIX: "Tag",
    TIMELINE_LABEL_DESCRIPTIONS_SUFFIX: "Uhr",
    TIMELINE_LABEL_DESCRIPTIONS_HALF_HOURLY: ["00:00", "00:30", "01:00", "01:30", "02:0r", "02:30", "03:00", "03:30", "04:00", "04:30", "05:00", "05:30", "6:00", "06:30", "07:00", "07:30", "08:00", "08:30", "9:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30", "24:00"],
    TIMELINE_LABEL_DESCRIPTIONS_HOURLY: ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "6:00", "07:00", "08:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00", "24:00"],
    TIMELINE_LABEL_DESCRIPTIONS_DAILY: ["00:00"],
    TIMELINE_LABEL_DESCRIPTIONS_TYPE_HALF_HOURLY: "halfHourlyLabelDescriptions",
    TIMELINE_LABEL_DESCRIPTIONS_TYPE_HOURLY: "hourlyLabelDescriptions",
    TIMELINE_LABEL_DESCRIPTIONS_TYPE_QUARTER_DAILY: "quarterDailyLabelDescriptions",
    TIMELINE_LABEL_DESCRIPTIONS_TYPE_DAILY: "dailyLabelDescriptions",
    TIMELINE_LABEL_DESCRIPTIONS_PER_DAY_TIME_SPAN_ONE_DAY: 48,
    TIMELINE_LABEL_DESCRIPTIONS_IS_GREATER_FREQUENCY_TIME_SPAN_ONE_DAY: 2,
    TIMELINE_LABEL_DESCRIPTIONS_PER_DAY_TIME_SPAN_THREE_DAYS: 24,
    TIMELINE_LABEL_DESCRIPTIONS_IS_GREATER_FREQUENCY_TIME_SPAN_THREE_DAYS: 3,
    TIMELINE_LABEL_DESCRIPTIONS_PER_DAY_TIME_SPAN_ABOVE_THREE_DAYS: 1,
    TIMELINE_LABEL_DESCRIPTIONS_IS_GREATER_FREQUENCY_TIME_SPAN_ABOVE_THREE_DAYS: undefined,

    // NodeView 
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
    NODE_BODY_WIDTH: "100",
    NODE_BODY_WIDTH_DEFLATED: "10",
    NODE_BODY_HEIGHT: "120",
    NODE_BODY_HEIGHT_DEFLATED: "12",
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
    NODE_ADD_PREV_BUTTON_ID: "addPrevNodeButton",
    NODE_ADD_NEXT_BUTTON_ID: "addNextNodeButton",
    NODE_ADD_CHILD_BUTTON_ID: "addChildNodeButton",
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
    NODE_DESCRIPTION_FIRST_LINE_ID: "nodeDescriptionFirstLine",
    NODE_DESCRIPTION_SECOND_LINE_ID: "nodeDescriptionSecondLine",
    NODE_DESCRIPTION_THIRD_LINE_ID: "nodeDescriptionThirdLine",
    NODE_DESCRIPTION_MAX_LENGTH: 25,
    NODE_DESCRIPTION_CENTER_OFFSET: "20",
    NODE_DESCRIPTION_TEXT_ANCHOR: "middle",
    // How many symbols until a linebreak is inserted
    NODE_DESCRIPTION_LINE_BREAK_COUNT: 11,
    NODE_DESCRIPTION_COLOR: "white",
    NODE_DESCRIPTION_FILL_OPACITY_DEEMPHASIZED: "0.7",
    NODE_DESCRIPTION_FILL_OPACITY_EMPHASIZED: "1",
    NODE_DESCRIPTION_FONT_FAMILY: "Helvetica",
    NODE_DESCRIPTION_FONT_SIZE: "80%",
    NODE_DESCRIPTION_FONT_WEIGHT: "bold",

    // New node properties
    NEW_EXPERIMENT_NAME: "Neues Experiment",
    NEW_EXPERIMENT_GROUP_NAME: "Neue Experiment Gruppe",
    NEW_SURVEY_NAME: "Neue Befragung",
    NEW_SURVEY_MAX_DURATION_IN_MIN: 5,
    NEW_SURVEY_NOTIFICATION_DURATION_IN_MIN: 15,
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
    // Answer
    TYPE_ANSWER: "answer",

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