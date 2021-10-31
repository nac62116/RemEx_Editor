/**
 * Configuration object for values shared by multiple components
 */

const Config = {

    // General values:

    LINE_SPACING: 15,
    LINE_SPACING_SMALL: 10,
    MAX_ID_SIZE: 65535,
    MAX_ID_ALERT: "Du kannst maximal 10.000 Schritte auf einer Ebene erstellen. Kontaktiere den Support falls du die Grenze erweitern möchtest.",
    LOAD_EXPERIMENT_ALERT: "Wenn du ein neues Experiment lädtst, musst du das aktuelle Experiment speichern und herunterladen, damit es nicht verloren geht. Möchtest du ein neues Experiment laden?",
    NEW_EXPERIMENT_ALERT: "Wenn du ein neues Experiment erstellst, musst du das aktuelle Experiment speichern und herunterladen, damit es nicht verloren geht. Möchtest du ein neues Experiment erstellen?",
    STEP_CONSTRUCTOR_ERROR: "Cannot construct Step instances directly. Please construct subclasses of Step.",
    QUESTION_CONSTRUCTOR_ERROR: "Cannot construct Question instances directly. Please construct subclasses of Question.",
    NODE_VIEW_CONSTRUCTOR_ERROR: "Cannot construct NodeView instances directly. Please construct subclasses of NodeView.",
    HALF_HOUR_IN_MIN: 30,
    ONE_HOUR_IN_MIN: 60,
    SIX_HOURS_IN_MIN: 360,
    ONE_DAY_IN_MIN: 1440,
    THREE_DAYS_IN_MIN: 4320,
    ONE_WEEK_IN_MIN: 10080,
    TWO_WEEKS_IN_MIN: 20160,
    ONE_MONTH_IN_MIN: 44640,
    ONE_YEAR_IN_MIN: 535680,
    ONE_WEEK_IN_DAYS: 7,
    ONE_MONTH_IN_DAYS: 30,
    ONE_YEAR_IN_DAYS: 365,
    MOVING_MODE_TIMELINE: "moveNodesOnTimeline",
    MOVING_MODE_ROW: "moveNodesInsideRow",
    MOVING_MODE_TREE: "moveTree",
    RESOURCE_ADDED: "resourceAdded",
 
    // View related:

    // View events:

    EVENT_SAVE_EXPERIMENT: "saveExperiment",
    EVENT_LOAD_EXPERIMENT: "loadExperiment",
    EVENT_NEW_EXPERIMENT: "newExperiment",
    EVENT_NODE_CLICKED: "nodeclicked",
    EVENT_NODE_MOUSE_ENTER: "nodeMouseEnter",
    EVENT_NODE_MOUSE_LEAVE: "nodeMouseLeave",
    EVENT_MOVE_NODE_LEFT: "moveNodeLeft",
    EVENT_MOVE_NODE_RIGHT: "moveNodeRight",
    EVENT_ADD_NEXT_NODE: "addNextNode",
    EVENT_ADD_PREV_NODE: "addPrevNode",
    EVENT_ADD_CHILD_NODE: "addChildNode",
    EVENT_INPUT_CHANGED: "inputChanged",
    EVENT_REMOVE_NODE: "removeNode",
    EVENT_CHANGE_NODE: "changeNode",
    EVENT_TIMELINE_MOUSE_ENTER: "timelineMouseEnter",
    EVENT_TIMELINE_MOUSE_LEAVE: "timelineMouseLeave",
    EVENT_TIMELINE_CLICKED: "timelineClicked",

    // DOM Element ids:

    LOADING_SCREEN_ID: "loadingScreen",
    DOWNLOAD_LINK_ID: "downloadLink",
    UPLOAD_INPUT_ID: "uploadInput",
    TREE_VIEW_CONTAINER_ID: "treeContainer",
    IMPORT_EXPORT_CONTAINER_ID: "importExportContainer",
    SAVE_EXPERIMENT_BUTTON_ID: "saveExperimentButton",
    UPLOAD_EXPERIMENT_BUTTON_ID: "uploadExperimentButton",
    NEW_EXPERIMENT_BUTTON_ID: "newExperimentButton",
    WHERE_AM_I_VIEW_CONTAINER_ID: "whereAmIContainer",
    NODE_TEMPLATE_ID: "nodeTemplate",
    INPUT_VIEW_CONTAINER_ID: "inputContainer",
    INPUT_VIEW_FIELDS_CONTAINER_ID: "inputFieldsContainer",
    INPUT_VIEW_ALERT_ID: "inputAlert",
    INPUT_VIEW_HEADER_ID: "inputHeader",
    INPUT_VIEW_DELETE_BUTTON_ID: "inputDeleteButton",
    INPUT_FIELD_TEMPLATE_ID: "inputField",

    // CSS Class names:

    HIDDEN_CSS_CLASS_NAME: "hidden",
    INPUT_FIELD_CSS_CLASS_NAME: "input-field",
    INPUT_FIELD_CONTAINER_CSS_CLASS_NAME: "input-field-container",

    // Input view
    INPUT_EXPERIMENT_NAME_ID: "experimentNameInput",
    INPUT_EXPERIMENT_NAME_LABEL: "Name des Experiments:",
    INPUT_EXPERIMENT_GROUP_NAME_ID: "experimentGroupNameInput",
    INPUT_EXPERIMENT_GROUP_NAME_LABEL: "Name der Experimentgruppe:",
    INPUT_SURVEY_FREQUENCY: "surveyFrequency",
    INPUT_SURVEY_FREQUENCY_HOURLY_REPETITION: "Stündlich",
    INPUT_SURVEY_FREQUENCY_DAILY_REPETITION: "Täglich",
    INPUT_SURVEY_FREQUENCY_MONTHLY_REPETITION: "Monatlich",
    INPUT_SURVEY_FREQUENCY_YEARLY_REPETITION: "Jährlich",

    INPUT_FIELD_SURVEY_FREQUENCY_DATA: {
        label: "Wiederholungsfrequenz:",
        inputType: "button",
        values: [
            {
                value: "Stündlich",
            },
            {
                value: "Täglich",
            },
            {
                value: "Monatlich",
            },
            {
                value: "Jährlich",
            },
        ],
    },
    INPUT_FIELD_STEP_TYPE_DATA: {
        label: "Typ:",
        inputType: "radio",
        values: [
            {
                label: "Instruktion",
                // For value see Configs model values
                value: "INSTRUCTION",
            },
            {
                label: "Fragebogen",
                // For value see Configs model values
                value: "QUESTIONNAIRE",
            },
            {
                label: "Atemübung",
                // For value see Configs model values
                value: "BREATHING_EXERCISE",
            },
        ],
    },
    INPUT_FIELD_QUESTION_TYPE_DATA: {
        label: "Typ:",
        inputType: "radio",
        values: [
            {
                label: "Textfrage",
                // For value see Configs model values
                value: "TEXT",
            },
            {
                label: "Auswahlfrage",
                // For value see Configs model values
                value: "CHOICE",
            },
            {
                label: "Likertfrage",
                // For value see Configs model values
                value: "LIKERT",
            },
            {
                label: "Zeitpunktfrage",
                // For value see Configs model values
                value: "POINT_OF_TIME",
            },
            {
                label: "Zeitraumfrage",
                // For value see Configs model values
                value: "TIME_INTERVAL",
            },
        ],
    },
    INPUT_FIELD_DATA: [
        {
            label: "Name:",
            correspondingModelProperty: "name",
            inputType: "text",
        },
        {
            label: "Überschrift:",
            correspondingModelProperty: "header",
            inputType: "text",
        },
        {
            label: "Text:",
            correspondingModelProperty: "text",
            inputType: "text",
        },
        {
            label: "Hinweis:",
            correspondingModelProperty: "hint",
            inputType: "text",
        },
        {
            label: "Bild:",
            correspondingModelProperty: "imageFileName",
            inputType: "image",
        },
        {
            label: "Video:",
            correspondingModelProperty: "videoFileName",
            inputType: "video",
        },
        {
            label: "Befragungstag:",
            correspondingModelProperty: "absoluteStartDaysOffset",
            inputType: "number",
        },
        {
            label: "Uhrzeit der Befragung:",
            correspondingModelProperty: "absoluteStartAtHour",
            inputType: "time",
        },
        {
            label: "Maximale Dauer der Befragung (Minuten):",
            correspondingModelProperty: "maxDurationInMin",
            inputType: "number",
        },
        {
            label: "Dauer der Benachrichtigung (Minuten):",
            correspondingModelProperty: "notificationDurationInMin",
            inputType: "number",
        },
        {
            label: "Dauer (Minuten):",
            correspondingModelProperty: "durationInMin",
            inputType: "number",
        },
        {
            label: "Wartetext:",
            correspondingModelProperty: "waitingText",
            inputType: "text",
        },
        {
            label: "Auf Instruktion warten:",
            correspondingModelProperty: "waitForStep",
            inputType: "radio",
        },
        {
            label: "Atemfrequenz (Sekunden):",
            correspondingModelProperty: "breathingFrequencyInSec",
            inputType: "number",
        },
        {
            label: "Modus:",
            correspondingModelProperty: "mode",
            inputType: "radio",
            values: [
                {
                    label: "Bewegender Kreis",
                    // For value see Configs model values
                    value: "MOVING_CIRCLE",
                },
                {
                    label: "Stehender Kreis",
                    // For value see Configs model values
                    value: "STATIC_CIRCLE",
                },
            ],
        },
        {
            label: "Nächste Frage:",
            correspondingModelProperty: "nextQuestionId",
            inputType: "radio",
        },
        {
            label: "Auswahltyp:",
            correspondingModelProperty: "choiceType",
            inputType: "radio",
            values: [
                {
                    label: "Einfachauswahl",
                    // For value see Configs model values
                    value: "SINGLE_CHOICE",
                },
                {
                    label: "Mehrfachauswahl",
                    // For value see Configs model values
                    value: "MULTIPLE_CHOICE",
                },
            ],
        },
        {
            label: "Skalenbeschriftung am Minimum:",
            correspondingModelProperty: "scaleMinimumLabel",
            inputType: "text",
        },
        {
            label: "Skalenbeschriftung am Maximum:",
            correspondingModelProperty: "scaleMaximumLabel",
            inputType: "text",
        },
        {
            label: "Skalenlänge:",
            correspondingModelProperty: "itemCount",
            inputType: "number",
        },
        {
            label: "Anfangswert:",
            correspondingModelProperty: "initialValue",
            inputType: "number",
        },
        {
            label: "Zeitpunktauswahl:",
            correspondingModelProperty: "pointOfTimeTypes",
            inputType: "checkbox",
            values: [
                {
                    label: "Datum",
                    // For value see Configs model values
                    value: "DATE",
                },
                {
                    label: "Uhrzeit",
                    // For value see Configs model values
                    value: "DAYTIME",
                },
            ],
        },
        {
            label: "Zeitraumauswahl:",
            correspondingModelProperty: "timeIntervalTypes",
            inputType: "checkbox",
            values: [
                {
                    label: "Jahre",
                    // For value see Configs model values
                    value: "YEARS",
                },
                {
                    label: "Monate",
                    // For value see Configs model values
                    value: "MONTHS",
                },
                {
                    label: "Tage",
                    // For value see Configs model values
                    value: "DAYS",
                },
                {
                    label: "Stunden",
                    // For value see Configs model values
                    value: "HOURS",
                },
                {
                    label: "Minuten",
                    // For value see Configs model values
                    value: "MINUTES",
                },
                {
                    label: "Sekunden",
                    // For value see Configs model values
                    value: "SECONDS",
                },
            ],
        },
        {
            label: "Antwortkodierung:",
            correspondingModelProperty: "code",
            inputType: "text",
        },
    ],

    // Colors, styles and dimensions:

    // Tree view
    TREE_VIEW_ID: "treeView",
    TREE_VIEW_WIDTH: "100%",
    TREE_VIEW_HEIGHT: "100%",
    TREE_VIEW_BACKGROUND_COLOR: "black",
    TREE_VIEW_BACKGROUND_OPACITY: "0.5",
    TREE_MOVEMENT_ANIMATION_STEPS: 10,
    TREE_MOVEMENT_ANIMATION_FRAME_RATE_MS: 10,

    // TimelineView
    TIMELINE_WIDTH_IN_PERCENTAGE: 0.8,
    TIMELINE_X1: "10%",
    TIMELINE_X2: "90%",
    TIMELINE_ID: "timeline",
    TIMELINE_STROKE_WIDTH: "5",
    TIMELINE_COLOR: "black",
    TIMELINE_STROKE_OPACITY_DEEMPHASIZED: "0.3",
    TIMELINE_STROKE_OPACITY_EMPHASIZED: "1",

    // TimelineView description
    TIMELINE_DESCRIPTION_ID: "timelineDescription",
    TIMELINE_DESCRIPTION_TEXT_ANCHOR: "middle",
    TIMELINE_DESCRIPTION_TEXT: "Zeitachse der Befragungen",
    TIMELINE_DESCRIPTION_COLOR: "white",
    TIMELINE_DESCRIPTION_FILL_OPACITY_DEEMPHASIZED: "0.7",
    TIMELINE_DESCRIPTION_FILL_OPACITY_EMPHASIZED: "1",
    TIMELINE_DESCRIPTION_FONT_FAMILY: "Helvetica",
    TIMELINE_DESCRIPTION_FONT_SIZE: "80%",
    TIMELINE_DESCRIPTION_FONT_WEIGHT: "bold",
    TIMELINE_DESCRIPTION_CENTER_OFFSET_Y: 50,

    // TimelineView label strokes
    TIMELINE_LABEL_STROKE_ID: "timelineLabelStroke",
    TIMELINE_LABEL_STROKE_OFFSET_Y: 5,
    TIMELINE_LABEL_STROKE_OFFSET_Y_GREATER: 10,
    TIMELINE_LABEL_STROKE_WIDTH_NORMAL: "1",
    TIMELINE_LABEL_STROKE_WIDTH_GREATER: "3",
    TIMELINE_LABEL_STROKE_OPACITY_EMPHASIZED: "1",
    TIMELINE_LABEL_STROKE_OPACITY_DEEMPHASIZED: "0.3",

    // TimelineView label description
    TIMELINE_LABEL_DESCRIPTION_ID: "timelineLabelDescription",
    TIMELINE_LABEL_DESCRIPTION_CENTER_OFFSET_Y: 20,
    TIMELINE_LABEL_DESCRIPTION_CENTER_OFFSET_Y_GREATER: 25,
    TIMELINE_LABEL_DESCRIPTION_TEXT_ANCHOR: "middle",
    TIMELINE_LABEL_DESCRIPTION_COLOR: "white",
    TIMELINE_LABEL_DESCRIPTION_FONT_WEIGHT: "bold",
    TIMELINE_LABEL_DESCRIPTION_FONT_FAMILY: "Helvetica",
    TIMELINE_LABEL_DESCRIPTION_FONT_SIZE: "40%",
    TIMELINE_LABEL_DESCRIPTION_FONT_SIZE_GREATER: "50%",
    TIMELINE_LABEL_DESCRIPTION_FILL_OPACITY_EMPHASIZED: "1",
    TIMELINE_LABEL_DESCRIPTION_FILL_OPACITY_DEEMPHASIZED: "0.7",
    TIMELINE_LABEL_DESCRIPTIONS_PREFIX: "Tag",
    TIMELINE_LABEL_DESCRIPTIONS_SUFFIX: "Uhr",
    TIMELINE_LABEL_DESCRIPTIONS_HALF_HOURLY: ["00:00", "00:30", "01:00", "01:30", "02:0r", "02:30", "03:00", "03:30", "04:00", "04:30", "05:00", "05:30", "6:00", "06:30", "07:00", "07:30", "08:00", "08:30", "9:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"],
    TIMELINE_LABEL_DESCRIPTIONS_HOURLY: ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "6:00", "07:00", "08:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"],
    TIMELINE_LABEL_DESCRIPTIONS_QUARTER_DAILY: ["00:00", "06:00", "12:00", "18:00"],
    TIMELINE_LABEL_DESCRIPTIONS_DAILY: ["00:00"],
    TIMELINE_LABEL_DESCRIPTIONS_PER_DAY_TIME_SPAN_ONE_DAY: 48,
    TIMELINE_LABEL_DESCRIPTIONS_IS_GREATER_FREQUENCY_TIME_SPAN_ONE_DAY: 2,
    TIMELINE_LABEL_DESCRIPTIONS_PER_DAY_TIME_SPAN_THREE_DAYS: 24,
    TIMELINE_LABEL_DESCRIPTIONS_IS_GREATER_FREQUENCY_TIME_SPAN_THREE_DAYS: 3,
    TIMELINE_LABEL_DESCRIPTIONS_PER_DAY_TIME_SPAN_ABOVE_THREE_DAYS: 1,
    TIMELINE_LABEL_DESCRIPTIONS_IS_GREATER_FREQUENCY_TIME_SPAN_ABOVE_THREE_DAYS: undefined,

    // NodeView 
    NODE_DISTANCE_HORIZONTAL: 140,
    NODE_DISTANCE_VERTICAL: 140,
    
    // NodeView input path
    NODE_INPUT_PATH_STROKE_WIDTH: "2",
    NODE_INPUT_PATH_STROKE_COLOR: "black",
    NODE_INPUT_PATH_STROKE_OPACITY_DEEMPHASIZED: "0.3",
    NODE_INPUT_PATH_STROKE_OPACITY_EMPHASIZED: "1",

    // NodeView icon
    NODE_ICON_ID: "nodeIcon",
    NODE_ICON_WIDTH: "50",
    NODE_ICON_HEIGHT: "50",
    NODE_ICON_CENTER_OFFSET_X: 25,
    NODE_ICON_CENTER_OFFSET_Y: 50,
    NODE_ICON_OPACITY_DEEMPHASIZED: "0.3",
    NODE_ICON_OPACITY_EMPHASIZED: "1",
    EXPERIMENT_ICON_SRC: "images/experiment_icon.png",
    EXPERIMENT_GROUP_ICON_SRC: "images/experiment_group_icon.png",
    SURVEY_ICON_SRC: "images/survey_icon.png",
    INSTRUCTION_ICON_SRC: "images/instruction_icon.png",
    BREATHING_EXERCISE_ICON_SRC: "images/breathing_exercise_icon.png",
    QUESTIONNAIRE_ICON_SRC: "images/questionnaire_icon.png",
    QUESTION_ICON_SRC: "images/question_icon.png",
    ANSWER_ICON_SRC: "images/answer_icon.png",

    // NodeView body
    NODE_BODY_ID: "nodeBody",
    NODE_BODY_WIDTH: "100",
    NODE_BODY_WIDTH_DEFLATED: "10",
    NODE_BODY_HEIGHT: "120",
    NODE_BODY_HEIGHT_DEFLATED: "15",
    NODE_BODY_BORDER_RADIUS: "10",
    NODE_BODY_FILL_COLOR: "black",
    NODE_BODY_FILL_COLOR_FOCUSED: "rgb(30, 50, 30)",
    NODE_BODY_FILL_OPACITY_DEEMPHASIZED: "0.1",
    NODE_BODY_FILL_OPACITY_EMPHASIZED: "0.5",
    NODE_BODY_FILL_OPACITY_FOCUSED: "1",
    NODE_BODY_STROKE_WIDTH: "2",
    NODE_BODY_STROKE_COLOR: "black",
    NODE_BODY_STROKE_OPACITY_DEEMPHASIZED: "0.3",
    NODE_BODY_STROKE_OPACITY_EMPHASIZED: "1",

    // NodeView add and move buttons
    NODE_MOVE_RIGHT_BUTTON_ID: "moveNodeRightButton",
    NODE_MOVE_LEFT_BUTTON_ID: "moveNodeLeftButton",
    NODE_MOVE_BUTTON_CENTER_OFFSET_X: 70,
    NODE_MOVE_BUTTON_CENTER_OFFSET_Y: 30,
    NODE_ADD_PREV_BUTTON_ID: "addPrevNodeButton",
    NODE_ADD_NEXT_BUTTON_ID: "addNextNodeButton",
    NODE_ADD_CHILD_BUTTON_ID: "addChildNodeButton",
    NODE_ADD_PREV_NEXT_BUTTON_CENTER_OFFSET_X: 70,
    NODE_ADD_CHILD_BUTTON_CENTER_OFFSET_Y: 80,
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
    NODE_DESCRIPTION_NEW_LINE_ID: "nodeDescriptionNewLine",
    NODE_DESCRIPTION_MAX_LENGTH: 25,
    NODE_DESCRIPTION_CENTER_OFFSET_Y: 20,
    NODE_DESCRIPTION_TEXT_ANCHOR: "middle",
    // How many symbols until a linebreak is inserted
    NODE_DESCRIPTION_LINE_BREAK_COUNT: 11,
    NODE_DESCRIPTION_MAX_NEW_LINE_COUNT: 2,
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
    NEW_INSTRUCTION_NAME: "Neue Instruktion",
    NEW_BREATHING_EXERCISE_NAME: "Neue Atemübung",
    NEW_QUESTIONNAIRE_NAME: "Neuer Fragebogen",
    NEW_CHOICE_QUESTION_NAME: "Neue Auswahlfrage",
    NEW_LIKERT_QUESTION_NAME: "Neue Likertfrage",
    NEW_POINT_OF_TIME_QUESTION_NAME: "Neue Zeitpunktfrage",
    NEW_TEXT_QUESTION_NAME: "Neue Textfrage",
    NEW_TIME_INTERVAL_QUESTION_NAME: "Neue Zeitintervallfrage",
    NEW_ANSWER_TEXT: "Neue Antwort",
    
    // WhereAmIView
    
    WHERE_AM_I_VIEW_ROOT_POINT_Y: 37.5,
    WHERE_AM_I_VIEW_ID: "whereAmIView",
    WHERE_AM_I_VIEW_WIDTH: "100%",
    WHERE_AM_I_VIEW_HEIGHT: "100%",
    WHERE_AM_I_VIEW_BACKGROUND_COLOR: "rgb(5, 5, 5)",
    WHERE_AM_I_VIEW_BACKGROUND_OPACITY: "0.7",
    WHERE_AM_I_NODE_HEIGHT: 60,
    WHERE_AM_I_NODE_DISTANCE: 70,
    WHERE_AM_I_NODE_DESCRIPTION_CENTER_OFFSET_Y: 12,

    // Types

    // Experiment
    TYPE_EXPERIMENT: "experiment",
    // Experiment group
    TYPE_EXPERIMENT_GROUP: "experimentGroup",
    // Survey
    TYPE_SURVEY: "survey",
    // Step
    TYPE_STEP: "step",
    // Question
    TYPE_QUESTION: "question",
    // Answer
    TYPE_ANSWER: "answer",
    
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

    // Point of time types:

    // If you change these values, change them accordingly in the RemEx_App model
    // -> https://github.com/nac62116/RemEx_App/tree/main/app/src/main/java/de/ur/remex/model/experiment
    POINT_OF_TIME_TYPE_DATE: "DATE",
    POINT_OF_TIME_TYPE_DAYTIME: "DAYTIME",

    // Time interval types:

    // If you change these values, change them accordingly in the RemEx_App model
    // -> https://github.com/nac62116/RemEx_App/tree/main/app/src/main/java/de/ur/remex/model/experiment
    TIME_INTERVAL_TYPE_YEARS: "YEARS",
    TIME_INTERVAL_TYPE_MONTHS: "MONTHS",
    TIME_INTERVAL_TYPE_DAYS: "DAYS",
    TIME_INTERVAL_TYPE_HOURS: "HOURS",
    TIME_INTERVAL_TYPE_MINUTES: "MINUTES",
    TIME_INTERVAL_TYPE_SECONDS: "SECONDS",

    // Input validation
    
    SURVEY_UPPER_DAY_LIMIT_MAX_DIGITS: 5,
    SURVEY_MAX_DURATION_IN_MIN: 720,
    INSTRUCTION_HEADER_MAX_LENGTH: 50,
    INSTRUCTION_TEXT_WITH_RESOURCE_MAX_LENGTH: 350,
    INSTRUCTION_TEXT_MAX_LENGTH: 500,
    INSTRUCTION_WAITING_TEXT_MAX_LENGTH: 500,
    BREATHING_EXERCISE_MAX_DURATION_IN_MIN: 60,
    BREATHING_EXERCISE_MAX_FREQUENCY_IN_SEC: 20,
    QUESTION_TEXT_MAX_LENGTH: 130,
    QUESTION_HINT_MAX_LENGTH: 90,
    LIKERT_QUESTION_SCALE_LABEL_TEXT_MAX_LENGTH: 30,
    LIKERT_QUESTION_MAX_ITEM_COUNT: 100,

    // Input invalid messages:
    
    EXPERIMENT_NAME_EMPTY: "Bitte wähle einen geeigneten Namen für dein Experiment um fortzufahren.",
    EXPERIMENT_AT_LEAST_ONE_GROUP: "Das Experiment hat keine Gruppen. Bitte füge mindestens eine Gruppe hinzu um dein Experiment zu speichern.",
    EXPERIMENT_GROUP_NAME_EMPTY: "Bitte wähle einen geeigneten Namen für deine Experiment Gruppe um fortzufahren.",
    EXPERIMENT_GROUP_NAME_NOT_UNIQUE: "Der gewählte Name deiner Experiment Gruppe existiert bereits. Bitte wähle einen einzigartigen Namen um bei der Auswertung der späteren CSV-Daten keine Duplikate zu erzeugen.",
    EXPERIMENT_GROUP_AT_LEAST_ONE_SURVEY: "Die Experiment Gruppe hat keine Befragungen. Bitte füge mindestens eine Befragung hinzu indem du auf die Zeitachse klickst.",
    SURVEY_NAME_EMPTY: "Um deine Befragung erfolgreich zu erstellen musst du ihr einen Namen geben.",
    SURVEY_DURATION_INVALID: "Die Dauer deiner Befragung wurde noch nicht angegeben oder beinhaltet einen Wert unter 0. Bitte gebe die Dauer deiner Befragung in Minuten an.",
    SURVEY_TIME_NOT_SET: "Es wurde noch keine Erinnerungszeit für deine Befragung angegeben. Bitte wähle eine absolute Uhrzeit (z.B. 15:30 Uhr am ersten Befragungstag, 8:45 Uhr am dritten Befragungstag, ...) oder eine relative Erinnerungszeit, im Verhältnis zur letzten Befragung (z.B. +30 Min, +2 Std, +2 Tage, ...)",
    RELATIVE_SURVEY_TIME_INVALID: "Die relative Erinnerungszeit darf keinen Wert unter 0 haben, da sie den Zeitabstand zur letzten Befragung definiert.",
    ABSOLUTE_SURVEY_TIME_INVALID: "Deine eingestellte Absolute Erinnerungszeit entspricht nicht der richtigen Formatierung. Bitte gebe für den Minutenwert eine Zahl zwischen 0 und 59, für den Stundenwert eine Zahl zwischen 0 und 24 und für den Tagewert eine Zahl größer oder gleich 0 ein.",
    SURVEY_NOTIFICATION_DURATION_INVALID: "Du hast noch keine Erinnerungsdauer angegeben. Bitte wähle eine Dauer die größer als 0 ist.",
    SURVEY_NAME_NOT_UNIQUE: "Der gewählte Name deiner Befragung existiert bereits. Bitte wähle einen einzigartigen Namen um bei der Auswertung der späteren CSV-Daten keine Duplikate zu erzeugen.",
    SURVEY_OVERLAPS: "Die gewählte Startzeit und Dauer der Befragung überlappt mit dem Zeitfenster einer anderen Befragungen. Das Zeitfenster einer Befragung berechnet sich aus der Benachrichtigungsdauer und der Befragungsdauer. In diesem Zeitfenster sollten keine weiteren Befragungen geplant werden.",
    SURVEY_DAY_UPPER_LIMIT_ALERT: "Eine Befragung kann bisher leider nur maximal 100 Jahre in der Zukunft liegen. Melde dich gerne beim Support um die Zeitspanne zu erhöhen.",
    SURVEY_MAX_DURATION_IN_MIN_ALERT: "Eine Befragung die länger als 12 Stunden dauert ist dann doch etwas erschöpfend. Auch Versuchspersonen brauchen Schlaf.",
    SURVEY_MAX_NOTIFICATION_DURATION_IN_MIN: 10080,
    SURVEY_MAX_NOTIFICATION_DURATION_IN_MIN_ALERT: "Eine Erinnerung kann aktuell maximal eine Woche existieren. Falls dieses Limit erhöht werden soll, bitte den Support kontaktieren.",
    SURVEY_AT_LEAST_ONE_STEP: "Die Befragung hat keine Schritte. Bitte füge mindestens einen Schritt hinzu. Zum Beispiel eine Instruktion als Begrüßung.",
    QUESTIONNAIRE_AT_LEAST_ONE_QUESTION: "Der Fragebogen enthält keine Fragen. Bitte füge mindestens eine Frage hinzu.",
    QUESTION_NAME_NOT_UNIQUE: "Der gewählte Name deiner Frage existiert bereits. Bitte wähle einen einzigartigen Namen um bei der Auswertung der späteren CSV-Daten keine Duplikate zu erzeugen.",
    BREATHING_EXERCISE_DURATION_TOO_LONG: "Die längste Atemübung die in dieser Anwendung unterstützt wird dauert 60 Minuten. Bitte reduziere die Dauer der Atemübung.",
    BREATHING_EXERCISE_MAX_FREQUENCY_ALERT: "Länger als 20 Sekunden einatmen ist schwierig. Falls das trotzdem erwünscht ist, bitte den Support kontaktieren.",
    CHOICE_QUESTION_AT_LEAST_ONE_ANSWER: "Eine Auswahlfrage muss mindestens zwei Antwortmöglichkeiten haben. Wo bleibt sonst die Wahl?",
    LIKERT_QUESTION_SCALE_INITIAL_VALUE_NOT_IN_RANGE: "Der Anfangswert liegt nicht im Bereich der Skala. Bitte wähle einen Anfangswert der kleiner oder gleich der Skalenlänge ist.",
    LIKERT_QUESTION_MAX_ITEM_COUNT_ALERT: "Die maximal unterstützte Länge einer Likertskala beträgt bisher 100. Bitte den Support kontaktieren, wenn das Limit angehoben werden muss.",
    POINT_OF_TIME_QUESTION_SELECT_AT_LEAST_ONE_TYPE: "Mindestens ein Zeitpunkttyp muss gewählt werden.",
    TIME_INTERVAL_QUESTION_SELECT_AT_LEAST_ONE_TYPE: "Mindestens ein Zeitraumtyp muss gewählt werden.",
    ANSWER_CODE_NOT_UNIQUE: "Der gewählte Code deiner Antwort existiert bereits. Bitte wähle einen einzigartigen Namen um bei der Auswertung der späteren CSV-Daten keine Duplikate zu erzeugen.",
    INPUT_TOO_LONG: "Die Eingabe überschreitet die maximal zulassige Länge. Bitte kürze deine Eingabe.",
    INPUT_TOO_LONG_WITH_RESOURCE: "Die Eingabe überschreitet die maximal zulassige Länge für Instruktionen mit Bildern oder Videos. Bitte kürze deine Eingabe.",
    SAME_FILE_NAME_ALERT: "Eine andere Resource in diesem Experiment hat bereits diesen Dateinamen. Bitte benenne die Resource erst um bevor du sie hochlädst.",
    FILE_TOO_LARGE: "Die hochgeladene Resource überschreitet die maximal zuläassige Größe.",
    DATABASE_FULL: "Die Resourcen des Experiments sind bereits zu groß um weitere hochzuladen.",
};

Object.freeze(Config);

export default Config;