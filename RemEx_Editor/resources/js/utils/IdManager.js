import Config from "./Config.js";

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

// Class to find unique ids for surveys, steps, questions...

class IdManager {

    constructor() {
        this.ids = [];
    }

    setIds(ids) {
        this.ids = ids;
    }

    removeIds() {
        this.ids = [];
    }

    getUnusedId() {
        let id = 0;
        while (id !== Config.MAX_ID_SIZE) {
            if (!this.ids.includes(id)) {
                this.ids.push(id);
                return id;
            }
            id++;
        }
        return Config.MAX_ID_ALERT;
    }

    removeId(id) {
        let index = this.ids.indexOf(id);
        if (index !== -1) {
            this.ids.splice(index, 1);
        }
    }
}

export default new IdManager();