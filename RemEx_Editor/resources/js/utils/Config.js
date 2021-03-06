/*
MIT License

Copyright (c) 2021 Colin Nash

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/**
 * Configuration object for values shared by multiple components
 */

const Config = {

    // General values:

    LINE_SPACING: 15,
    LINE_SPACING_SMALL: 10,
    MAX_RESOURCE_FILE_SIZE: 500000000,
    MAX_RESOURCE_FILE_SIZE_NOT_GECKO: 300000000,
    MAX_ZIP_SIZE: 1000000000,
    ACCEPTED_RESOURCE_MIME_TYPES: ["video/webm", "video/mp4", "image/jpeg", "image/png", "image/bmp", "image/gif"],
    MIME_SNIFFING_HEADER_LENGTH_IN_BYTES: 12,
    MAX_VIDEO_HEIGHT: 1080,
    MAX_VIDEO_WIDTH: 1920,
    MAX_ID_SIZE: 65535,
    MAX_ID_ALERT: "Du kannst maximal 10.000 Schritte auf einer Ebene erstellen. Kontaktiere den Support falls du die Grenze erweitern möchtest.",
    LOAD_EXPERIMENT_ALERT: "Wenn du ein neues Experiment lädtst, musst du das aktuelle Experiment speichern und herunterladen, damit es nicht verloren geht. Möchtest du ein neues Experiment laden? Falls ja erscheint jetzt ein \"Durchsuchen\" Button über den die Experiment.zip Datei ausgewählt werden kann. Bei großen Experimenten (>100MB), z.B. durch viele Videos, kann es zu längeren Ladezeiten kommen.",
    READ_ZIP_ALERT: "Die .zip Datei konnte nicht richtig gelesen werden. Bitte erneut versuchen oder den Support kontaktieren.",
    RESOURCE_NOT_SHOWABLE: "Die Resource ist zu groß um sie auf MSEdge, Internet Explorer, Chrome oder Opera anzuzeigen. Sie ist trotzdem noch im Experiment enthalten. Bitte den Browser wechseln um die volle Funktionalität zu bekommen (z.B. Firefox).",
    ZIP_TOO_LARGE: "Das Experiment ist größer als 1GB und überschreitet somit die zulässige Größe für die Browser MSEdge, Internet Explorer, Chrome und Opera. Das Experiment wurde nicht hoch- bzw. heruntergeladen. Bitte das Experiment verkleinern oder den Browser wechseln (z.B. Firefox) um die volle Funktionalität zu bekommen.",
    NEW_EXPERIMENT_ALERT: "Wenn du ein neues Experiment erstellst, musst du das aktuelle Experiment speichern und herunterladen, damit es nicht verloren geht. Möchtest du ein neues Experiment erstellen?",
    STEP_CONSTRUCTOR_ERROR: "Cannot construct Step instances directly. Please construct subclasses of Step.",
    QUESTION_CONSTRUCTOR_ERROR: "Cannot construct Question instances directly. Please construct subclasses of Question.",
    NODE_VIEW_CONSTRUCTOR_ERROR: "Cannot construct NodeView instances directly. Please construct subclasses of NodeView.",
    SAVING_PROMPT: "Das Experiment wird komprimiert.",
    UPLOADING_PROMPT: "Das Experiment wird extrahiert.",
    LOADING_RESOURCE_PROMPT: "Die Resource wird geladen.",
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
    EVENT_SAVING_PROGRESS: "savingProgress",
    EVENT_EXPERIMENT_SAVED: "experimentSaved",
    EVENT_UPLOAD_EXPERIMENT: "uploadExperiment",
    EVENT_EXPERIMENT_UPLOADED: "experimentUploaded",
    EVENT_EXPERIMENT_UPLOAD_STARTED: "experimentUploadStarted",
    EVENT_NEW_EXPERIMENT: "newExperiment",
    EVENT_NODE_CLICKED: "nodeclicked",
    EVENT_NODE_MOUSE_ENTER: "nodeMouseEnter",
    EVENT_NODE_MOUSE_LEAVE: "nodeMouseLeave",
    EVENT_SWITCH_NODE_LEFT: "moveNodeLeft",
    EVENT_SWITCH_NODE_RIGHT: "moveNodeRight",
    EVENT_ADD_NEXT_NODE: "addNextNode",
    EVENT_ADD_PREVIOUS_NODE: "addPrevNode",
    EVENT_ADD_CHILD_NODE: "addChildNode",
    EVENT_TIMELINE_CLICKED: "timelineClicked",
    EVENT_INPUT_CHANGED: "inputChanged",
    EVENT_UPLOAD_RESOURCE: "uploadResource",
    EVENT_RESOURCE_LOADED: "resourceLoaded",
    EVENT_REMOVE_NODE: "removeNode",
    EVENT_CHANGE_NODE: "changeNode",
    EVENT_REPEAT_SURVEY: "repeatSurvey",
    EVENT_COPY_NODE: "copyNode",
    EVENT_PASTE_NODE: "pasteNode",
    EVENT_KEY_NAVIGATION: "keyNavigation",

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
    INPUT_RESOURCE_CONTAINER_WIDTH_RATIO: 0.92,
    INPUT_SURVEY_FREQUENCY: "surveyFrequency",
    INPUT_SURVEY_FREQUENCY_HOURLY_REPETITION: "Stündlich",
    INPUT_SURVEY_FREQUENCY_DAILY_REPETITION: "Täglich",
    INPUT_SURVEY_FREQUENCY_MONTHLY_REPETITION: "Monatlich",
    INPUT_SURVEY_FREQUENCY_YEARLY_REPETITION: "Jährlich",

    INPUT_FIELD_SURVEY_FREQUENCY_DATA: {
        label: "Wiederholungsfrequenz:",
        type: "surveyFrequency",
        values: [
            {
                value: "Stündlich",
                property: "hourly",
                inputType: "button",
            },
            {
                value: "Täglich",
                property: "daily",
                inputType: "button",
            },
            {
                value: "Wöchentlich",
                property: "weekly",
                inputType: "button",
            },
            {
                value: "Monatlich",
                property: "monthly",
                inputType: "button",
                
            },
            {
                value: "Jährlich",
                property: "yearly",
                inputType: "button",
            },
            {
                value: "1",
                property: "repeatCount",
                inputType: "number",
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
    NODE_COPY_SUFFIX: "(Kopie)",
    
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
    NODE_SWITCH_RIGHT_BUTTON_ID: "switchNodeRightButton",
    NODE_SWITCH_LEFT_BUTTON_ID: "switchNodeLeftButton",
    NODE_SWITCH_BUTTON_CENTER_OFFSET_X: 70,
    NODE_SWITCH_BUTTON_CENTER_OFFSET_Y: 30,
    NODE_SWITCH_LEFT_ICON_ID: "switchNodeLeftIcon",
    NODE_SWITCH_RIGHT_ICON_ID: "switchNodeRightIcon",
    NODE_SWITCH_ICON_WIDTH: "12",
    NODE_SWITCH_ICON_HEIGHT: "12",
    NODE_SWITCH_ICON_SRC: "images/switch_icon.png",
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
    NODE_ADD_NEXT_ICON_ID: "addNextNodeIcon",
    NODE_ADD_PREV_ICON_ID: "addPrevNodeIcon",
    NODE_ADD_CHILD_ICON_ID: "addChildNodeIcon",
    NODE_ADD_ICON_SRC: "images/add_icon.png",
    NODE_ADD_ICON_WIDTH: "18",
    NODE_ADD_ICON_HEIGHT: "18",

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
    NEW_EXPERIMENT_GROUP_NAME: "Neue Experiment Gruppe ",
    NEW_SURVEY_NAME: "Neue Befragung ",
    NEW_SURVEY_START_DAYSOFFSET: 0,
    NEW_SURVEY_START_HOUR: 12,
    NEW_SURVEY_START_MINUTE: 0,
    NEW_SURVEY_MAX_DURATION: 15,
    NEW_SURVEY_NOTIFICATION_DURATION: 5,
    NEW_INSTRUCTION_NAME: "Neue Instruktion ",
    NEW_INSTRUCTION_HEADER: "Überschrift",
    NEW_INSTRUCTION_TEXT: "Text",
    NEW_INSTRUCTION_WAITING_TEXT: "Wartetext",
    NEW_INSTRUCTION_DURATION: 0,
    NEW_BREATHING_EXERCISE_NAME: "Neue Atemübung ",
    NEW_QUESTIONNAIRE_NAME: "Neuer Fragebogen ",
    NEW_QUESTION_TEXT: "Text",
    NEW_QUESTION_HINT: "Hinweis",
    NEW_CHOICE_QUESTION_NAME: "Neue Auswahlfrage ",
    NEW_LIKERT_QUESTION_NAME: "Neue Likertfrage ",
    NEW_LIKERT_QUESTION_SCALE_MIN_LABEL: "Sehr schlecht",
    NEW_LIKERT_QUESTION_SCALE_MAX_LABEL: "Sehr gut",
    NEW_LIKERT_QUESTION_INITIAL_VALUE: 1,
    NEW_LIKERT_QUESTION_ITEM_COUNT: 5,
    NEW_POINT_OF_TIME_QUESTION_NAME: "Neue Zeitpunktfrage ",
    NEW_TEXT_QUESTION_NAME: "Neue Textfrage ",
    NEW_TIME_INTERVAL_QUESTION_NAME: "Neue Zeitraumfrage ",
    NEW_ANSWER_TEXT: "Antworttext",
    NEW_ANSWER_CODE: "Code ",
    
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
    SURVEY_REPETITION_LIMIT_MAX_DIGITS: 2,
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
    FILE_TOO_LARGE: "Die hochgeladene Resource überschreitet die maximal zuläassige Größe von 500MB.",
    FILE_TOO_LARGE_NOT_GECKO: "Die hochgeladene Resource überschreitet die maximal zuläassige Größe von 300MB bei dem Browser MSEdge, Internet Explorer, Chrome und Opera. Bei der Nutzung eines anderen Browsers (z.B. Firefox) können Dateien bis zu einer Größe von 500MB hochgeladen werden.",
    FILE_TYPE_NOT_SUPPORTED: "Der Dateityp wird nicht unterstützt. Unterstützte Videoformate sind: .mp4, .webm. Unterstützte Bildformate sind: .jpg, .jpeg, .jpe, .png, .bmp, .gif.",
    FILE_TYPE_INSIDE_ZIP_NOT_SUPPORTED: "Der Dateityp einer Resource im Experiment wird nicht unterstützt. Diese Ressource wird nicht geladen. Unterstützte Videoformate sind: .mp4, .webm. Unterstützte Bildformate sind: .jpg, .jpeg, .jpe, .png, .bmp, .gif.",
    VIDEO_RESOLUTION_TOO_HIGH: "Die Auflösung des hochgeladenen Videos ist zu hoch. Die maximal unterstützte Auflösung für Videos ist 1920 x 1080.",
    DATABASE_FULL: "Die Resourcen des Experiments sind bereits zu groß um weitere hochzuladen.",
    LOADING_RESOURCE_FAILED: "Die Ressource der aktuellen Instruktion konnte leider nicht geladen werden. Bitte erneut hochladen.",
    MISSING_RESOURCES_IN_DB: "Eine oder mehrere Ressource/n konnten nicht in der Datenbank gefunden werden. Das Experiment wird trotzdem heruntergeladen. Die fehlenden Ressourcen können entweder in die .zip Datei im Unterordner /resources hinzugefügt werden. Oder sie müssen neu in den Editor geladen werden.",
    NO_COPY_OF_EXPERIMENT: "Nur einzelne Teilschritte des Experiments können kopiert werden. Falls das Experiment selber kopiert werden soll kann es einfach gespeichert werden.",
    SURVEY_TIME_CHANGED: "Eine oder mehrere der wiederholenden Befragungen überlappen mit bereits bestehenden. Um das zu verhindern wurden sie stündlich angepasst.",
};

Object.freeze(Config);

export default Config;