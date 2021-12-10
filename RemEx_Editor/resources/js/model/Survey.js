import Config from "../utils/Config.js";

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

class Survey {

    constructor(id) {
        this.id = id;
        this.type = Config.TYPE_SURVEY;
        this.name = Config.NEW_SURVEY_NAME + id;
        this.maxDurationInMin = Config.NEW_SURVEY_MAX_DURATION;
        this.absoluteStartAtMinute = Config.NEW_SURVEY_START_MINUTE;
        this.absoluteStartAtHour = Config.NEW_SURVEY_START_HOUR;
        this.absoluteStartDaysOffset = Config.NEW_SURVEY_START_DAYSOFFSET;
        this.notificationDurationInMin = Config.NEW_SURVEY_NOTIFICATION_DURATION;
        this.nextSurveyId = null;
        this.previousSurveyId = null;
        this.steps = [];
    }
}

export default Survey;