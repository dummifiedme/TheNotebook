'use strict';

var obsidian = require('obsidian');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var Review = /** @class */ (function (_super) {
    __extends(Review, _super);
    function Review() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Review.prototype.onload = function () {
        return __awaiter(this, void 0, void 0, function () {
            var naturalLanguageDates, _a;
            var _this_1 = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log('Loading the Review plugin.');
                        // Check that plugins can be accessed.
                        console.log(app.plugins.plugins);
                        naturalLanguageDates = app.plugins.getPlugin('nldates-obsidian');
                        if (!naturalLanguageDates) {
                            new obsidian.Notice("The Natural Language Dates plugin was not found. The Review plugin requires the Natural Language Dates plugin. Please install it first and make sure it is enabled before using Review.");
                        }
                        _a = this;
                        return [4 /*yield*/, this.loadData()];
                    case 1:
                        _a.settings = (_b.sent()) || new ReviewSettings();
                        this.addCommand({
                            id: 'future-review',
                            name: 'Add this note to a daily note for review',
                            checkCallback: function (checking) {
                                var leaf = _this_1.app.workspace.activeLeaf;
                                if (leaf) {
                                    if (!checking) {
                                        new ReviewModal(_this_1.app).open();
                                    }
                                    return true;
                                }
                                return false;
                            }
                        });
                        this.addCommand({
                            id: 'future-review-block',
                            name: 'Add this block to a daily note for review',
                            checkCallback: function (checking) {
                                var leaf = _this_1.app.workspace.activeLeaf;
                                if (leaf) {
                                    if (!checking) {
                                        new ReviewBlockModal(_this_1.app).open();
                                    }
                                    return true;
                                }
                                return false;
                            }
                        });
                        this.addSettingTab(new ReviewSettingTab(this.app, this));
                        return [2 /*return*/];
                }
            });
        });
    };
    Review.prototype.onunload = function () {
        console.log('The Review Dates plugin has been disabled and unloaded.');
    };
    Review.prototype.createBlockHash = function (inputText) {
        var obsidianApp = this.app;
        var result = '';
        var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < 7; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    };
    Review.prototype.getBlock = function (inputLine, noteFile) {
        var obsidianApp = this.app;
        var noteBlocks = obsidianApp.metadataCache.getFileCache(noteFile).blocks;
        console.log("Checking if line '" + inputLine + "' is a block.");
        var blockString = "";
        if (noteBlocks) { // the file does contain blocks. If not, return ""
            for (var eachBlock in noteBlocks) { // iterate through the blocks. 
                console.log("Checking block ^" + eachBlock);
                var blockRegExp = new RegExp("(" + eachBlock + ")$", "gim");
                if (inputLine.match(blockRegExp)) { // if end of inputLine matches block, return it
                    blockString = eachBlock;
                    console.log("Found block ^" + blockString);
                    return blockString;
                }
            }
            return blockString;
        }
        return blockString;
    };
    Review.prototype.setReviewDate = function (someDate, someBlock) {
        var obsidianApp = this.app;
        var naturalLanguageDates = obsidianApp.plugins.getPlugin('nldates-obsidian'); // Get the Natural Language Dates plugin.
        if (!naturalLanguageDates) {
            new obsidian.Notice("The Natural Language Dates plugin is not available. Please make sure it is installed and enabled before trying again.");
            return;
        }
        if (someDate === "") {
            someDate = this.settings.defaultReviewDate;
        }
        // Use the Natural Language Dates plugin's processDate method to convert the input date into a daily note title.
        var parsedResult = naturalLanguageDates.parseDate(someDate);
        var inputDate = parsedResult.formattedString;
        console.log("Date string to use: " + inputDate);
        // Get the folder path.
        var notesFolder = this.settings.dailyNotesFolder;
        var notesPath = "";
        if (notesFolder === "") {
            notesPath = "/"; // If the user is using the root for their daily notes, don't add a second /.
        }
        else {
            notesPath = "/" + notesFolder + "/";
        }
        console.log("The path to daily notes: " + notesPath);
        // Get the review section header.
        var reviewHeading = this.settings.reviewSectionHeading;
        console.log("The review section heading is: " + reviewHeading);
        // Get the line prefix.
        var reviewLinePrefix = this.settings.linePrefix;
        console.log("The line prefix is: " + reviewLinePrefix);
        // If the date is recognized and valid
        if (parsedResult.moment.isValid()) {
            // get the current note name
            var noteName_1 = obsidianApp.workspace.activeLeaf.getDisplayText();
            var noteFile_1 = obsidianApp.workspace.activeLeaf.view.file;
            var noteLink_1 = obsidianApp.metadataCache.fileToLinktext(noteFile_1, noteFile_1.path, true);
            if (someBlock != undefined) {
                console.log("Checking for block:");
                var lineBlockID = this.getBlock(someBlock, noteFile_1);
                console.log(lineBlockID);
                if (this.getBlock(someBlock, noteFile_1) === "") { // The line is not already a block
                    console.log("This line is not currently a block. Adding a block ID.");
                    lineBlockID = this.createBlockHash(someBlock).toString();
                    var lineWithBlock_1 = someBlock + " ^" + lineBlockID;
                    obsidianApp.vault.read(noteFile_1).then(function (result) {
                        var previousNoteText = result;
                        var newNoteText = previousNoteText.replace(someBlock, lineWithBlock_1);
                        obsidianApp.vault.modify(noteFile_1, newNoteText);
                    });
                }
                noteLink_1 = noteLink_1 + "#^" + lineBlockID;
                reviewLinePrefix = this.settings.blockLinePrefix;
            }
            // check if the daily note file exists
            var files = obsidianApp.vault.getFiles();
            var dateFile_1 = files.filter(function (e) { return e.name === inputDate //hat-tip 🎩 to @MrJackPhil for this little workflow 
                || e.path === inputDate
                || e.basename === inputDate; })[0];
            console.log("File found:" + dateFile_1);
            if (!dateFile_1) { //the date file does not already exist
                console.log("The daily note for the given date does not exist yet. Creating it, then appending the review section.");
                var noteText = reviewHeading + "\n" + reviewLinePrefix + "[[" + noteLink_1 + "]]";
                var newDateFile = obsidianApp.vault.create(notesPath + inputDate + ".md", noteText);
                new obsidian.Notice("Set note \"" + noteName_1 + "\" for review on " + inputDate + ".");
            }
            else { //the file exists
                console.log("The daily note already exists for the date given. Adding this note to it for review.");
                var previousNoteText_1 = "";
                obsidianApp.vault.read(dateFile_1).then(function (result) {
                    previousNoteText_1 = result;
                    console.log("Previous Note text:\n" + previousNoteText_1);
                    var newNoteText = "";
                    if (previousNoteText_1.includes(reviewHeading)) {
                        newNoteText = previousNoteText_1.replace(reviewHeading, reviewHeading + "\n" + reviewLinePrefix + "[[" + noteLink_1 + "]]");
                    }
                    else {
                        newNoteText = previousNoteText_1 + "\n" + reviewHeading + "\n" + reviewLinePrefix + "[[" + noteLink_1 + "]]";
                    }
                    obsidianApp.vault.modify(dateFile_1, newNoteText);
                    new obsidian.Notice("Set note \"" + noteName_1 + "\" for review on " + inputDate + ".");
                });
            }
        }
        else {
            new obsidian.Notice("You've entered an invalid date (note that \"two weeks\" will not work, but \"in two weeks\" will). The note was not set for review. Please try again.");
        }
        return;
    };
    return Review;
}(obsidian.Plugin));
var ReviewSettings = /** @class */ (function () {
    function ReviewSettings() {
        this.dailyNotesFolder = "";
        this.reviewSectionHeading = "## Review";
        this.linePrefix = "- ";
        this.defaultReviewDate = "tomorrow";
        this.blockLinePrefix = "!";
    }
    return ReviewSettings;
}());
var ReviewModal = /** @class */ (function (_super) {
    __extends(ReviewModal, _super);
    function ReviewModal(app) {
        return _super.call(this, app) || this;
    }
    ReviewModal.prototype.onOpen = function () {
        var _this_1 = this;
        var _this = this;
        console.log(_this);
        var contentEl = this.contentEl;
        var inputDateField = new obsidian.TextComponent(contentEl)
            .setPlaceholder(this.app.plugins.getPlugin("review-obsidian").settings.defaultReviewDate);
        var inputButton = new obsidian.ButtonComponent(contentEl)
            .setButtonText("Set Review Date")
            .onClick(function () {
            var inputDate = inputDateField.getValue();
            _this.app.plugins.getPlugin("review-obsidian").setReviewDate(inputDate);
            _this_1.close();
        });
        inputDateField.inputEl.focus();
        inputDateField.inputEl.addEventListener('keypress', function (keypressed) {
            if (keypressed.key === 'Enter') {
                var inputDate = inputDateField.getValue();
                _this.app.plugins.getPlugin("review-obsidian").setReviewDate(inputDate);
                _this.close();
            }
        });
    };
    ReviewModal.prototype.onClose = function () {
        var contentEl = this.contentEl;
        contentEl.empty();
    };
    return ReviewModal;
}(obsidian.Modal));
var ReviewBlockModal = /** @class */ (function (_super) {
    __extends(ReviewBlockModal, _super);
    function ReviewBlockModal(app) {
        return _super.call(this, app) || this;
    }
    ReviewBlockModal.prototype.onOpen = function () {
        var _this_1 = this;
        var _this = this;
        var editor = this.app.workspace.activeLeaf.view.sourceMode.cmEditor;
        var cursor = editor.getCursor();
        var lineText = editor.getLine(cursor.line);
        console.log(_this);
        var contentEl = this.contentEl;
        var inputDateField = new obsidian.TextComponent(contentEl)
            .setPlaceholder(this.app.plugins.getPlugin("review-obsidian").settings.defaultReviewDate);
        var inputButton = new obsidian.ButtonComponent(contentEl)
            .setButtonText("Set Review Date")
            .onClick(function () {
            var inputDate = inputDateField.getValue();
            _this.app.plugins.getPlugin("review-obsidian").setReviewDate(inputDate, lineText);
            _this_1.close();
        });
        inputDateField.inputEl.focus();
        inputDateField.inputEl.addEventListener('keypress', function (keypressed) {
            if (keypressed.key === 'Enter') {
                var inputDate = inputDateField.getValue();
                _this.app.plugins.getPlugin("review-obsidian").setReviewDate(inputDate, lineText);
                _this.close();
            }
        });
    };
    ReviewBlockModal.prototype.onClose = function () {
        var contentEl = this.contentEl;
        contentEl.empty();
    };
    return ReviewBlockModal;
}(obsidian.Modal));
var ReviewSettingTab = /** @class */ (function (_super) {
    __extends(ReviewSettingTab, _super);
    function ReviewSettingTab() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ReviewSettingTab.prototype.display = function () {
        var containerEl = this.containerEl;
        var plugin = this.plugin;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Review Settings' });
        new obsidian.Setting(containerEl)
            .setName('Daily note location')
            .setDesc('Set the path to your daily notes. Use the format "folder/subfolder". Do not use leading or trailing slashes "/".')
            .addText(function (text) {
            return text
                .setPlaceholder('')
                .setValue(plugin.settings.dailyNotesFolder)
                .onChange(function (value) {
                console.log("The new daily notes folder:" + value);
                plugin.settings.dailyNotesFolder = value;
                plugin.saveData(plugin.settings);
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Review section heading')
            .setDesc('Set the heading to use for the review section. BE CAREFUL: it must be unique in each daily note.')
            .addText(function (text) {
            return text
                .setPlaceholder('## Review')
                .setValue(plugin.settings.reviewSectionHeading)
                .onChange(function (value) {
                if (value === "") {
                    plugin.settings.reviewSectionHeading = "## Review";
                }
                else {
                    plugin.settings.reviewSectionHeading = value;
                }
                plugin.saveData(plugin.settings);
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Line prefix')
            .setDesc('Set the prefix to use on each new line. E.g., use `- ` for bullets or `- [ ] ` for tasks. **Include the trailing space.**')
            .addText(function (text) {
            return text
                .setPlaceholder('- ')
                .setValue(plugin.settings.linePrefix)
                .onChange(function (value) {
                plugin.settings.linePrefix = value;
                plugin.saveData(plugin.settings);
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Block review line prefix')
            .setDesc('Set the prefix used when adding blocks to daily notes with Review. Use e.g., `- [ ] ` to link the block as a task, or `!` to create embeds.')
            .addText(function (text) {
            return text
                .setPlaceholder('!')
                .setValue(plugin.settings.blockLinePrefix)
                .onChange(function (value) {
                plugin.settings.blockLinePrefix = value;
                plugin.saveData(plugin.settings);
            });
        });
        new obsidian.Setting(containerEl)
            .setName('Default review date')
            .setDesc('Set a default date to be used when no date is entered. Use natural language: "Next Monday", "November 5th", and "tomorrow" all work.')
            .addText(function (text) {
            return text
                .setPlaceholder('')
                .setValue(plugin.settings.defaultReviewDate)
                .onChange(function (value) {
                plugin.settings.defaultReviewDate = value;
                plugin.saveData(plugin.settings);
            });
        });
        // containerEl.createEl('h3', { text: 'Preset review schedules' });
        /*
        TKTKTK: Figure out how to add a function to a button inside the setting element. Currently `doSomething`, below, throws errors.
        containerEl.createEl('button', { text: "Add a new review schedule preset", attr: { onclick: "doSomething({ console.log('button clicked') });"}});
        */
    };
    return ReviewSettingTab;
}(obsidian.PluginSettingTab));

module.exports = Review;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIm1haW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxyXG5cclxuUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55XHJcbnB1cnBvc2Ugd2l0aCBvciB3aXRob3V0IGZlZSBpcyBoZXJlYnkgZ3JhbnRlZC5cclxuXHJcblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEhcclxuUkVHQVJEIFRPIFRISVMgU09GVFdBUkUgSU5DTFVESU5HIEFMTCBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZXHJcbkFORCBGSVRORVNTLiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SIEJFIExJQUJMRSBGT1IgQU5ZIFNQRUNJQUwsIERJUkVDVCxcclxuSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NXHJcbkxPU1MgT0YgVVNFLCBEQVRBIE9SIFBST0ZJVFMsIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBORUdMSUdFTkNFIE9SXHJcbk9USEVSIFRPUlRJT1VTIEFDVElPTiwgQVJJU0lORyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1JcclxuUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMCAmJiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocywgcFtpXSkpXHJcbiAgICAgICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgICAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fY3JlYXRlQmluZGluZyA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XHJcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgb1trMl0gPSBtW2tdO1xyXG59KTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgbykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvLCBwKSkgX19jcmVhdGVCaW5kaW5nKG8sIG0sIHApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yLCBtID0gcyAmJiBvW3NdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgaWYgKG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHMgPyBcIk9iamVjdCBpcyBub3QgaXRlcmFibGUuXCIgOiBcIlN5bWJvbC5pdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5cygpIHtcclxuICAgIGZvciAodmFyIHMgPSAwLCBpID0gMCwgaWwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykgcyArPSBhcmd1bWVudHNbaV0ubGVuZ3RoO1xyXG4gICAgZm9yICh2YXIgciA9IEFycmF5KHMpLCBrID0gMCwgaSA9IDA7IGkgPCBpbDsgaSsrKVxyXG4gICAgICAgIGZvciAodmFyIGEgPSBhcmd1bWVudHNbaV0sIGogPSAwLCBqbCA9IGEubGVuZ3RoOyBqIDwgamw7IGorKywgaysrKVxyXG4gICAgICAgICAgICByW2tdID0gYVtqXTtcclxuICAgIHJldHVybiByO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xyXG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xyXG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEdldChyZWNlaXZlciwgcHJpdmF0ZU1hcCkge1xyXG4gICAgaWYgKCFwcml2YXRlTWFwLmhhcyhyZWNlaXZlcikpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiYXR0ZW1wdGVkIHRvIGdldCBwcml2YXRlIGZpZWxkIG9uIG5vbi1pbnN0YW5jZVwiKTtcclxuICAgIH1cclxuICAgIHJldHVybiBwcml2YXRlTWFwLmdldChyZWNlaXZlcik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkU2V0KHJlY2VpdmVyLCBwcml2YXRlTWFwLCB2YWx1ZSkge1xyXG4gICAgaWYgKCFwcml2YXRlTWFwLmhhcyhyZWNlaXZlcikpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiYXR0ZW1wdGVkIHRvIHNldCBwcml2YXRlIGZpZWxkIG9uIG5vbi1pbnN0YW5jZVwiKTtcclxuICAgIH1cclxuICAgIHByaXZhdGVNYXAuc2V0KHJlY2VpdmVyLCB2YWx1ZSk7XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbn1cclxuIiwiaW1wb3J0IHsgQXBwLCBCdXR0b25Db21wb25lbnQsIE1vZGFsLCBOb3RpY2UsIFBsdWdpbiwgUGx1Z2luU2V0dGluZ1RhYiwgU2V0dGluZywgVGV4dENvbXBvbmVudCB9IGZyb20gJ29ic2lkaWFuJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJldmlldyBleHRlbmRzIFBsdWdpbiB7XHJcblx0c2V0dGluZ3M6IFJldmlld1NldHRpbmdzO1xyXG5cclxuXHRhc3luYyBvbmxvYWQoKSB7XHJcblx0XHRjb25zb2xlLmxvZygnTG9hZGluZyB0aGUgUmV2aWV3IHBsdWdpbi4nKTtcclxuXHJcblx0XHQvLyBDaGVjayB0aGF0IHBsdWdpbnMgY2FuIGJlIGFjY2Vzc2VkLlxyXG5cdFx0Y29uc29sZS5sb2coYXBwLnBsdWdpbnMucGx1Z2lucyk7XHJcblxyXG5cdFx0Ly8gQ2hlY2sgZm9yIHRoZSBOYXR1cmFsIExhbmd1YWdlIERhdGVzIHBsdWdpbi4gSWYgbm90IGZvdW5kLCB0ZWxsIHRoZSB1c2VyIHRvIGluc3RhbGwgaXQvaW5pdGlhbGl6ZSBpdC5cclxuXHRcdGxldCBuYXR1cmFsTGFuZ3VhZ2VEYXRlcyA9IGFwcC5wbHVnaW5zLmdldFBsdWdpbignbmxkYXRlcy1vYnNpZGlhbicpO1xyXG5cdFx0aWYgKCFuYXR1cmFsTGFuZ3VhZ2VEYXRlcykge1xyXG5cdFx0XHRuZXcgTm90aWNlKFwiVGhlIE5hdHVyYWwgTGFuZ3VhZ2UgRGF0ZXMgcGx1Z2luIHdhcyBub3QgZm91bmQuIFRoZSBSZXZpZXcgcGx1Z2luIHJlcXVpcmVzIHRoZSBOYXR1cmFsIExhbmd1YWdlIERhdGVzIHBsdWdpbi4gUGxlYXNlIGluc3RhbGwgaXQgZmlyc3QgYW5kIG1ha2Ugc3VyZSBpdCBpcyBlbmFibGVkIGJlZm9yZSB1c2luZyBSZXZpZXcuXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuc2V0dGluZ3MgPSAoYXdhaXQgdGhpcy5sb2FkRGF0YSgpKSB8fCBuZXcgUmV2aWV3U2V0dGluZ3MoKTtcclxuXHJcblx0XHR0aGlzLmFkZENvbW1hbmQoe1xyXG5cdFx0XHRpZDogJ2Z1dHVyZS1yZXZpZXcnLFxyXG5cdFx0XHRuYW1lOiAnQWRkIHRoaXMgbm90ZSB0byBhIGRhaWx5IG5vdGUgZm9yIHJldmlldycsXHJcblxyXG5cdFx0XHRjaGVja0NhbGxiYWNrOiAoY2hlY2tpbmc6IGJvb2xlYW4pID0+IHsgLy8gSWYgYSBub3RlIGlzIGN1cnJlbnRseSBhY3RpdmUsIG9wZW4gdGhlIHBsdWdpbidzIG1vZGFsIHRvIHJlY2VpdmUgYSBkYXRlIHN0cmluZy5cclxuXHRcdFx0XHRsZXQgbGVhZiA9IHRoaXMuYXBwLndvcmtzcGFjZS5hY3RpdmVMZWFmO1xyXG5cdFx0XHRcdGlmIChsZWFmKSB7XHJcblx0XHRcdFx0XHRpZiAoIWNoZWNraW5nKSB7XHJcblx0XHRcdFx0XHRcdG5ldyBSZXZpZXdNb2RhbCh0aGlzLmFwcCkub3BlbigpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0dGhpcy5hZGRDb21tYW5kKHtcclxuXHRcdFx0aWQ6ICdmdXR1cmUtcmV2aWV3LWJsb2NrJyxcclxuXHRcdFx0bmFtZTogJ0FkZCB0aGlzIGJsb2NrIHRvIGEgZGFpbHkgbm90ZSBmb3IgcmV2aWV3JyxcclxuXHJcblx0XHRcdGNoZWNrQ2FsbGJhY2s6IChjaGVja2luZzogYm9vbGVhbikgPT4ge1xyXG5cdFx0XHRcdGxldCBsZWFmID0gdGhpcy5hcHAud29ya3NwYWNlLmFjdGl2ZUxlYWY7XHJcblx0XHRcdFx0aWYgKGxlYWYpIHtcclxuXHRcdFx0XHRcdGlmICghY2hlY2tpbmcpIHtcclxuXHRcdFx0XHRcdFx0bmV3IFJldmlld0Jsb2NrTW9kYWwodGhpcy5hcHApLm9wZW4oKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdHRoaXMuYWRkU2V0dGluZ1RhYihuZXcgUmV2aWV3U2V0dGluZ1RhYih0aGlzLmFwcCwgdGhpcykpO1xyXG5cclxuXHR9XHJcblxyXG5cdG9udW5sb2FkKCkge1xyXG5cdFx0Y29uc29sZS5sb2coJ1RoZSBSZXZpZXcgRGF0ZXMgcGx1Z2luIGhhcyBiZWVuIGRpc2FibGVkIGFuZCB1bmxvYWRlZC4nKTtcclxuXHR9XHJcblxyXG5cdGNyZWF0ZUJsb2NrSGFzaChpbnB1dFRleHQ6IHN0cmluZyk6IHN0cmluZyB7IC8vIENyZWRpdCB0byBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMTM0OTQyNlxyXG5cdFx0bGV0IG9ic2lkaWFuQXBwID0gdGhpcy5hcHA7XHJcblxyXG5cdFx0bGV0IHJlc3VsdCA9ICcnO1xyXG5cdFx0dmFyIGNoYXJhY3RlcnMgPSAnYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5JztcclxuXHRcdHZhciBjaGFyYWN0ZXJzTGVuZ3RoID0gY2hhcmFjdGVycy5sZW5ndGg7XHJcblx0XHRmb3IgKCB2YXIgaSA9IDA7IGkgPCA3OyBpKysgKSB7XHJcblx0XHQgICByZXN1bHQgKz0gY2hhcmFjdGVycy5jaGFyQXQoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY2hhcmFjdGVyc0xlbmd0aCkpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9XHJcblxyXG5cdGdldEJsb2NrKGlucHV0TGluZTogc3RyaW5nLCBub3RlRmlsZTogb2JqZWN0KTogc3RyaW5nIHsgLy9SZXR1cm5zIHRoZSBzdHJpbmcgb2YgYSBibG9jayBJRCBpZiBibG9jayBpcyBmb3VuZCwgb3IgXCJcIiBpZiBub3QuXHJcblx0XHRsZXQgb2JzaWRpYW5BcHAgPSB0aGlzLmFwcDtcclxuXHRcdGxldCBub3RlQmxvY2tzID0gb2JzaWRpYW5BcHAubWV0YWRhdGFDYWNoZS5nZXRGaWxlQ2FjaGUobm90ZUZpbGUpLmJsb2NrcztcclxuXHRcdGNvbnNvbGUubG9nKFwiQ2hlY2tpbmcgaWYgbGluZSAnXCIgKyBpbnB1dExpbmUgKyBcIicgaXMgYSBibG9jay5cIik7XHJcblx0XHRsZXQgYmxvY2tTdHJpbmcgPSBcIlwiO1xyXG5cdFx0aWYgKG5vdGVCbG9ja3MpIHsgLy8gdGhlIGZpbGUgZG9lcyBjb250YWluIGJsb2Nrcy4gSWYgbm90LCByZXR1cm4gXCJcIlxyXG5cdFx0XHRmb3IgKGxldCBlYWNoQmxvY2sgaW4gbm90ZUJsb2NrcykgeyAvLyBpdGVyYXRlIHRocm91Z2ggdGhlIGJsb2Nrcy4gXHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJDaGVja2luZyBibG9jayBeXCIgKyBlYWNoQmxvY2spO1xyXG5cdFx0XHRcdGxldCBibG9ja1JlZ0V4cCA9IG5ldyBSZWdFeHAoXCIoXCIgKyBlYWNoQmxvY2sgKyBcIikkXCIsIFwiZ2ltXCIpO1xyXG5cdFx0XHRcdGlmIChpbnB1dExpbmUubWF0Y2goYmxvY2tSZWdFeHApKSB7IC8vIGlmIGVuZCBvZiBpbnB1dExpbmUgbWF0Y2hlcyBibG9jaywgcmV0dXJuIGl0XHJcblx0XHRcdFx0XHRibG9ja1N0cmluZyA9IGVhY2hCbG9jaztcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiRm91bmQgYmxvY2sgXlwiICsgYmxvY2tTdHJpbmcpO1xyXG5cdFx0XHRcdFx0cmV0dXJuIGJsb2NrU3RyaW5nO1xyXG5cdFx0XHRcdH0gXHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGJsb2NrU3RyaW5nO1xyXG5cdFx0fSBcclxuXHRcdHJldHVybiBibG9ja1N0cmluZztcclxuXHR9XHJcblxyXG5cdHNldFJldmlld0RhdGUoc29tZURhdGU6IHN0cmluZywgc29tZUJsb2NrPzogc3RyaW5nKSB7XHJcblx0XHRsZXQgb2JzaWRpYW5BcHAgPSB0aGlzLmFwcDtcclxuXHRcdGxldCBuYXR1cmFsTGFuZ3VhZ2VEYXRlcyA9IG9ic2lkaWFuQXBwLnBsdWdpbnMuZ2V0UGx1Z2luKCdubGRhdGVzLW9ic2lkaWFuJyk7IC8vIEdldCB0aGUgTmF0dXJhbCBMYW5ndWFnZSBEYXRlcyBwbHVnaW4uXHJcblxyXG5cdFx0aWYgKCFuYXR1cmFsTGFuZ3VhZ2VEYXRlcykge1xyXG5cdFx0XHRuZXcgTm90aWNlKFwiVGhlIE5hdHVyYWwgTGFuZ3VhZ2UgRGF0ZXMgcGx1Z2luIGlzIG5vdCBhdmFpbGFibGUuIFBsZWFzZSBtYWtlIHN1cmUgaXQgaXMgaW5zdGFsbGVkIGFuZCBlbmFibGVkIGJlZm9yZSB0cnlpbmcgYWdhaW4uXCIpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHNvbWVEYXRlID09PSBcIlwiKSB7XHJcblx0XHRcdHNvbWVEYXRlID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0UmV2aWV3RGF0ZTtcclxuXHRcdH1cclxuXHRcdC8vIFVzZSB0aGUgTmF0dXJhbCBMYW5ndWFnZSBEYXRlcyBwbHVnaW4ncyBwcm9jZXNzRGF0ZSBtZXRob2QgdG8gY29udmVydCB0aGUgaW5wdXQgZGF0ZSBpbnRvIGEgZGFpbHkgbm90ZSB0aXRsZS5cclxuXHRcdGxldCBwYXJzZWRSZXN1bHQgPSBuYXR1cmFsTGFuZ3VhZ2VEYXRlcy5wYXJzZURhdGUoc29tZURhdGUpO1xyXG5cdFx0bGV0IGlucHV0RGF0ZSA9IHBhcnNlZFJlc3VsdC5mb3JtYXR0ZWRTdHJpbmc7XHJcblxyXG5cdFx0Y29uc29sZS5sb2coXCJEYXRlIHN0cmluZyB0byB1c2U6IFwiICsgaW5wdXREYXRlKTtcclxuXHJcblx0XHQvLyBHZXQgdGhlIGZvbGRlciBwYXRoLlxyXG5cdFx0bGV0IG5vdGVzRm9sZGVyID0gdGhpcy5zZXR0aW5ncy5kYWlseU5vdGVzRm9sZGVyO1xyXG5cdFx0bGV0IG5vdGVzUGF0aCA9IFwiXCI7XHJcblx0XHRpZiAobm90ZXNGb2xkZXIgPT09IFwiXCIpIHtcclxuXHRcdFx0bm90ZXNQYXRoID0gXCIvXCI7IC8vIElmIHRoZSB1c2VyIGlzIHVzaW5nIHRoZSByb290IGZvciB0aGVpciBkYWlseSBub3RlcywgZG9uJ3QgYWRkIGEgc2Vjb25kIC8uXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRub3Rlc1BhdGggPSBcIi9cIiArIG5vdGVzRm9sZGVyICsgXCIvXCI7XHJcblx0XHR9XHJcblx0XHRjb25zb2xlLmxvZyhcIlRoZSBwYXRoIHRvIGRhaWx5IG5vdGVzOiBcIiArIG5vdGVzUGF0aCk7XHJcblxyXG5cdFx0Ly8gR2V0IHRoZSByZXZpZXcgc2VjdGlvbiBoZWFkZXIuXHJcblx0XHRsZXQgcmV2aWV3SGVhZGluZyA9IHRoaXMuc2V0dGluZ3MucmV2aWV3U2VjdGlvbkhlYWRpbmc7XHJcblx0XHRjb25zb2xlLmxvZyhcIlRoZSByZXZpZXcgc2VjdGlvbiBoZWFkaW5nIGlzOiBcIiArIHJldmlld0hlYWRpbmcpO1xyXG5cclxuXHRcdC8vIEdldCB0aGUgbGluZSBwcmVmaXguXHJcblx0XHRsZXQgcmV2aWV3TGluZVByZWZpeCA9IHRoaXMuc2V0dGluZ3MubGluZVByZWZpeDtcclxuXHRcdGNvbnNvbGUubG9nKFwiVGhlIGxpbmUgcHJlZml4IGlzOiBcIiArIHJldmlld0xpbmVQcmVmaXgpO1xyXG5cclxuXHRcdC8vIElmIHRoZSBkYXRlIGlzIHJlY29nbml6ZWQgYW5kIHZhbGlkXHJcblx0XHRpZiAocGFyc2VkUmVzdWx0Lm1vbWVudC5pc1ZhbGlkKCkpIHtcclxuXHRcdFx0Ly8gZ2V0IHRoZSBjdXJyZW50IG5vdGUgbmFtZVxyXG5cdFx0XHRsZXQgbm90ZU5hbWUgPSBvYnNpZGlhbkFwcC53b3Jrc3BhY2UuYWN0aXZlTGVhZi5nZXREaXNwbGF5VGV4dCgpO1xyXG5cdFx0XHRsZXQgbm90ZUZpbGUgPSBvYnNpZGlhbkFwcC53b3Jrc3BhY2UuYWN0aXZlTGVhZi52aWV3LmZpbGU7XHJcblx0XHRcdGxldCBub3RlTGluayA9IG9ic2lkaWFuQXBwLm1ldGFkYXRhQ2FjaGUuZmlsZVRvTGlua3RleHQobm90ZUZpbGUsIG5vdGVGaWxlLnBhdGgsIHRydWUpO1xyXG5cclxuXHRcdFx0aWYgKHNvbWVCbG9jayAhPSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIkNoZWNraW5nIGZvciBibG9jazpcIik7XHJcblx0XHRcdFx0bGV0IGxpbmVCbG9ja0lEID0gdGhpcy5nZXRCbG9jayhzb21lQmxvY2ssIG5vdGVGaWxlKTtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhsaW5lQmxvY2tJRCk7XHJcblxyXG5cdFx0XHRcdGlmICh0aGlzLmdldEJsb2NrKHNvbWVCbG9jaywgbm90ZUZpbGUpID09PSBcIlwiKSB7IC8vIFRoZSBsaW5lIGlzIG5vdCBhbHJlYWR5IGEgYmxvY2tcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiVGhpcyBsaW5lIGlzIG5vdCBjdXJyZW50bHkgYSBibG9jay4gQWRkaW5nIGEgYmxvY2sgSUQuXCIpO1xyXG5cdFx0XHRcdFx0bGluZUJsb2NrSUQgPSB0aGlzLmNyZWF0ZUJsb2NrSGFzaChzb21lQmxvY2spLnRvU3RyaW5nKCk7XHJcblx0XHRcdFx0XHRsZXQgbGluZVdpdGhCbG9jayA9IHNvbWVCbG9jayArIFwiIF5cIiArIGxpbmVCbG9ja0lEO1xyXG5cdFx0XHRcdFx0b2JzaWRpYW5BcHAudmF1bHQucmVhZChub3RlRmlsZSkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XHJcblx0XHRcdFx0XHRcdGxldCBwcmV2aW91c05vdGVUZXh0ID0gcmVzdWx0O1xyXG5cdFx0XHRcdFx0XHRsZXQgbmV3Tm90ZVRleHQgPSBwcmV2aW91c05vdGVUZXh0LnJlcGxhY2Uoc29tZUJsb2NrLCBsaW5lV2l0aEJsb2NrKTtcclxuXHRcdFx0XHRcdFx0b2JzaWRpYW5BcHAudmF1bHQubW9kaWZ5KG5vdGVGaWxlLCBuZXdOb3RlVGV4dCk7XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRub3RlTGluayA9IG5vdGVMaW5rICsgXCIjXlwiICsgbGluZUJsb2NrSUQ7XHJcblx0XHRcdFx0cmV2aWV3TGluZVByZWZpeCA9IHRoaXMuc2V0dGluZ3MuYmxvY2tMaW5lUHJlZml4O1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBjaGVjayBpZiB0aGUgZGFpbHkgbm90ZSBmaWxlIGV4aXN0c1xyXG5cdFx0XHRsZXQgZmlsZXMgPSBvYnNpZGlhbkFwcC52YXVsdC5nZXRGaWxlcygpO1xyXG5cdFx0XHRjb25zdCBkYXRlRmlsZSA9IGZpbGVzLmZpbHRlcihlID0+IGUubmFtZSA9PT0gaW5wdXREYXRlIC8vaGF0LXRpcCDwn46pIHRvIEBNckphY2tQaGlsIGZvciB0aGlzIGxpdHRsZSB3b3JrZmxvdyBcclxuXHRcdFx0XHR8fCBlLnBhdGggPT09IGlucHV0RGF0ZVxyXG5cdFx0XHRcdHx8IGUuYmFzZW5hbWUgPT09IGlucHV0RGF0ZVxyXG5cdFx0XHQpWzBdO1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIkZpbGUgZm91bmQ6XCIgKyBkYXRlRmlsZSk7XHJcblxyXG5cdFx0XHRpZiAoIWRhdGVGaWxlKSB7IC8vdGhlIGRhdGUgZmlsZSBkb2VzIG5vdCBhbHJlYWR5IGV4aXN0XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJUaGUgZGFpbHkgbm90ZSBmb3IgdGhlIGdpdmVuIGRhdGUgZG9lcyBub3QgZXhpc3QgeWV0LiBDcmVhdGluZyBpdCwgdGhlbiBhcHBlbmRpbmcgdGhlIHJldmlldyBzZWN0aW9uLlwiKVxyXG5cdFx0XHRcdGxldCBub3RlVGV4dCA9IHJldmlld0hlYWRpbmcgKyBcIlxcblwiICsgcmV2aWV3TGluZVByZWZpeCArIFwiW1tcIiArIG5vdGVMaW5rICsgXCJdXVwiO1xyXG5cdFx0XHRcdGxldCBuZXdEYXRlRmlsZSA9IG9ic2lkaWFuQXBwLnZhdWx0LmNyZWF0ZShub3Rlc1BhdGggKyBpbnB1dERhdGUgKyBcIi5tZFwiLCBub3RlVGV4dCk7XHJcblx0XHRcdFx0bmV3IE5vdGljZShcIlNldCBub3RlIFxcXCJcIiArIG5vdGVOYW1lICsgXCJcXFwiIGZvciByZXZpZXcgb24gXCIgKyBpbnB1dERhdGUgKyBcIi5cIik7XHJcblx0XHRcdH0gZWxzZSB7IC8vdGhlIGZpbGUgZXhpc3RzXHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJUaGUgZGFpbHkgbm90ZSBhbHJlYWR5IGV4aXN0cyBmb3IgdGhlIGRhdGUgZ2l2ZW4uIEFkZGluZyB0aGlzIG5vdGUgdG8gaXQgZm9yIHJldmlldy5cIilcclxuXHRcdFx0XHRsZXQgcHJldmlvdXNOb3RlVGV4dCA9IFwiXCI7XHJcblx0XHRcdFx0b2JzaWRpYW5BcHAudmF1bHQucmVhZChkYXRlRmlsZSkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7IC8vIEdldCB0aGUgdGV4dCBpbiB0aGUgbm90ZS4gU2VhcmNoIGl0IGZvciAjIyBSZXZpZXcgYW5kIGFwcGVuZCB0byB0aGF0IHNlY3Rpb24uIEVsc2UsIGFwcGVuZCAjIyBSZXZpZXcgYW5kIHRoZSBsaW5rIHRvIHRoZSBub3RlIGZvciByZXZpZXcuXHJcblx0XHRcdFx0XHRwcmV2aW91c05vdGVUZXh0ID0gcmVzdWx0O1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJQcmV2aW91cyBOb3RlIHRleHQ6XFxuXCIgKyBwcmV2aW91c05vdGVUZXh0KTtcclxuXHRcdFx0XHRcdGxldCBuZXdOb3RlVGV4dCA9IFwiXCI7XHJcblx0XHRcdFx0XHRpZiAocHJldmlvdXNOb3RlVGV4dC5pbmNsdWRlcyhyZXZpZXdIZWFkaW5nKSkge1xyXG5cdFx0XHRcdFx0XHRuZXdOb3RlVGV4dCA9IHByZXZpb3VzTm90ZVRleHQucmVwbGFjZShyZXZpZXdIZWFkaW5nLCByZXZpZXdIZWFkaW5nICsgXCJcXG5cIiArIHJldmlld0xpbmVQcmVmaXggKyBcIltbXCIgKyBub3RlTGluayArIFwiXV1cIik7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRuZXdOb3RlVGV4dCA9IHByZXZpb3VzTm90ZVRleHQgKyBcIlxcblwiICsgcmV2aWV3SGVhZGluZyArIFwiXFxuXCIgKyByZXZpZXdMaW5lUHJlZml4ICsgXCJbW1wiICsgbm90ZUxpbmsgKyBcIl1dXCI7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRvYnNpZGlhbkFwcC52YXVsdC5tb2RpZnkoZGF0ZUZpbGUsIG5ld05vdGVUZXh0KTtcclxuXHRcdFx0XHRcdG5ldyBOb3RpY2UoXCJTZXQgbm90ZSBcXFwiXCIgKyBub3RlTmFtZSArIFwiXFxcIiBmb3IgcmV2aWV3IG9uIFwiICsgaW5wdXREYXRlICsgXCIuXCIpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRuZXcgTm90aWNlKFwiWW91J3ZlIGVudGVyZWQgYW4gaW52YWxpZCBkYXRlIChub3RlIHRoYXQgXFxcInR3byB3ZWVrc1xcXCIgd2lsbCBub3Qgd29yaywgYnV0IFxcXCJpbiB0d28gd2Vla3NcXFwiIHdpbGwpLiBUaGUgbm90ZSB3YXMgbm90IHNldCBmb3IgcmV2aWV3LiBQbGVhc2UgdHJ5IGFnYWluLlwiKTtcclxuXHRcdH1cclxuXHRcdHJldHVybjtcclxuXHR9XHJcbn1cclxuXHJcbmNsYXNzIFJldmlld1NldHRpbmdzIHtcclxuXHRkYWlseU5vdGVzRm9sZGVyID0gXCJcIjtcclxuXHRyZXZpZXdTZWN0aW9uSGVhZGluZyA9IFwiIyMgUmV2aWV3XCI7XHJcblx0bGluZVByZWZpeCA9IFwiLSBcIjtcclxuXHRkZWZhdWx0UmV2aWV3RGF0ZSA9IFwidG9tb3Jyb3dcIjtcclxuXHRibG9ja0xpbmVQcmVmaXggPSBcIiFcIjtcclxufVxyXG5cclxuY2xhc3MgUmV2aWV3TW9kYWwgZXh0ZW5kcyBNb2RhbCB7XHJcblx0Y29uc3RydWN0b3IoYXBwOiBBcHApIHtcclxuXHRcdHN1cGVyKGFwcCk7XHJcblx0fVxyXG5cclxuXHRvbk9wZW4oKSB7XHJcblx0XHRsZXQgX3RoaXMgPSB0aGlzO1xyXG5cdFx0Y29uc29sZS5sb2coX3RoaXMpO1xyXG5cdFx0bGV0IHsgY29udGVudEVsIH0gPSB0aGlzO1xyXG5cdFx0bGV0IGlucHV0RGF0ZUZpZWxkID0gbmV3IFRleHRDb21wb25lbnQoY29udGVudEVsKVxyXG5cdFx0XHQuc2V0UGxhY2Vob2xkZXIodGhpcy5hcHAucGx1Z2lucy5nZXRQbHVnaW4oXCJyZXZpZXctb2JzaWRpYW5cIikuc2V0dGluZ3MuZGVmYXVsdFJldmlld0RhdGUpO1xyXG5cdFx0bGV0IGlucHV0QnV0dG9uID0gbmV3IEJ1dHRvbkNvbXBvbmVudChjb250ZW50RWwpXHJcblx0XHRcdC5zZXRCdXR0b25UZXh0KFwiU2V0IFJldmlldyBEYXRlXCIpXHJcblx0XHRcdC5vbkNsaWNrKCgpID0+IHtcclxuXHRcdFx0XHRsZXQgaW5wdXREYXRlID0gaW5wdXREYXRlRmllbGQuZ2V0VmFsdWUoKTtcclxuXHRcdFx0XHRfdGhpcy5hcHAucGx1Z2lucy5nZXRQbHVnaW4oXCJyZXZpZXctb2JzaWRpYW5cIikuc2V0UmV2aWV3RGF0ZShpbnB1dERhdGUpO1xyXG5cdFx0XHRcdHRoaXMuY2xvc2UoKTtcclxuXHRcdFx0fSk7XHJcblx0XHRpbnB1dERhdGVGaWVsZC5pbnB1dEVsLmZvY3VzKCk7XHJcblx0XHRpbnB1dERhdGVGaWVsZC5pbnB1dEVsLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXByZXNzJywgZnVuY3Rpb24gKGtleXByZXNzZWQpIHtcclxuXHRcdFx0aWYgKGtleXByZXNzZWQua2V5ID09PSAnRW50ZXInKSB7XHJcblx0XHRcdFx0dmFyIGlucHV0RGF0ZSA9IGlucHV0RGF0ZUZpZWxkLmdldFZhbHVlKClcclxuXHRcdFx0XHRfdGhpcy5hcHAucGx1Z2lucy5nZXRQbHVnaW4oXCJyZXZpZXctb2JzaWRpYW5cIikuc2V0UmV2aWV3RGF0ZShpbnB1dERhdGUpO1xyXG5cdFx0XHRcdF90aGlzLmNsb3NlKCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0b25DbG9zZSgpIHtcclxuXHRcdGxldCB7IGNvbnRlbnRFbCB9ID0gdGhpcztcclxuXHRcdGNvbnRlbnRFbC5lbXB0eSgpO1xyXG5cdH1cclxufVxyXG5cclxuY2xhc3MgUmV2aWV3QmxvY2tNb2RhbCBleHRlbmRzIE1vZGFsIHtcclxuXHRjb25zdHJ1Y3RvcihhcHA6IEFwcCkge1xyXG5cdFx0c3VwZXIoYXBwKTtcclxuXHR9XHJcblxyXG5cdG9uT3BlbigpIHtcclxuXHRcdGxldCBfdGhpcyA9IHRoaXM7XHJcblx0XHRsZXQgZWRpdG9yID0gdGhpcy5hcHAud29ya3NwYWNlLmFjdGl2ZUxlYWYudmlldy5zb3VyY2VNb2RlLmNtRWRpdG9yO1xyXG5cdFx0bGV0IGN1cnNvciA9IGVkaXRvci5nZXRDdXJzb3IoKTtcclxuXHRcdGxldCBsaW5lVGV4dCA9IGVkaXRvci5nZXRMaW5lKGN1cnNvci5saW5lKTtcclxuXHRcdGNvbnNvbGUubG9nKF90aGlzKTtcclxuXHRcdGxldCB7IGNvbnRlbnRFbCB9ID0gdGhpcztcclxuXHRcdGxldCBpbnB1dERhdGVGaWVsZCA9IG5ldyBUZXh0Q29tcG9uZW50KGNvbnRlbnRFbClcclxuXHRcdFx0LnNldFBsYWNlaG9sZGVyKHRoaXMuYXBwLnBsdWdpbnMuZ2V0UGx1Z2luKFwicmV2aWV3LW9ic2lkaWFuXCIpLnNldHRpbmdzLmRlZmF1bHRSZXZpZXdEYXRlKTtcclxuXHRcdGxldCBpbnB1dEJ1dHRvbiA9IG5ldyBCdXR0b25Db21wb25lbnQoY29udGVudEVsKVxyXG5cdFx0XHQuc2V0QnV0dG9uVGV4dChcIlNldCBSZXZpZXcgRGF0ZVwiKVxyXG5cdFx0XHQub25DbGljaygoKSA9PiB7XHJcblx0XHRcdFx0bGV0IGlucHV0RGF0ZSA9IGlucHV0RGF0ZUZpZWxkLmdldFZhbHVlKCk7XHJcblx0XHRcdFx0X3RoaXMuYXBwLnBsdWdpbnMuZ2V0UGx1Z2luKFwicmV2aWV3LW9ic2lkaWFuXCIpLnNldFJldmlld0RhdGUoaW5wdXREYXRlLCBsaW5lVGV4dCk7XHJcblx0XHRcdFx0dGhpcy5jbG9zZSgpO1xyXG5cdFx0XHR9KTtcclxuXHRcdGlucHV0RGF0ZUZpZWxkLmlucHV0RWwuZm9jdXMoKTtcclxuXHRcdGlucHV0RGF0ZUZpZWxkLmlucHV0RWwuYWRkRXZlbnRMaXN0ZW5lcigna2V5cHJlc3MnLCBmdW5jdGlvbiAoa2V5cHJlc3NlZCkge1xyXG5cdFx0XHRpZiAoa2V5cHJlc3NlZC5rZXkgPT09ICdFbnRlcicpIHtcclxuXHRcdFx0XHR2YXIgaW5wdXREYXRlID0gaW5wdXREYXRlRmllbGQuZ2V0VmFsdWUoKVxyXG5cdFx0XHRcdF90aGlzLmFwcC5wbHVnaW5zLmdldFBsdWdpbihcInJldmlldy1vYnNpZGlhblwiKS5zZXRSZXZpZXdEYXRlKGlucHV0RGF0ZSwgbGluZVRleHQpO1xyXG5cdFx0XHRcdF90aGlzLmNsb3NlKCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0b25DbG9zZSgpIHtcclxuXHRcdGxldCB7IGNvbnRlbnRFbCB9ID0gdGhpcztcclxuXHRcdGNvbnRlbnRFbC5lbXB0eSgpO1xyXG5cdH1cclxufVxyXG5cclxuY2xhc3MgUmV2aWV3U2V0dGluZ1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xyXG5cdGRpc3BsYXkoKTogdm9pZCB7XHJcblx0XHRsZXQgeyBjb250YWluZXJFbCB9ID0gdGhpcztcclxuXHRcdGNvbnN0IHBsdWdpbjogYW55ID0gKHRoaXMgYXMgYW55KS5wbHVnaW47XHJcblxyXG5cdFx0Y29udGFpbmVyRWwuZW1wdHkoKTtcclxuXHJcblx0XHRjb250YWluZXJFbC5jcmVhdGVFbCgnaDInLCB7IHRleHQ6ICdSZXZpZXcgU2V0dGluZ3MnIH0pO1xyXG5cclxuXHRcdG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG5cdFx0XHQuc2V0TmFtZSgnRGFpbHkgbm90ZSBsb2NhdGlvbicpXHJcblx0XHRcdC5zZXREZXNjKCdTZXQgdGhlIHBhdGggdG8geW91ciBkYWlseSBub3Rlcy4gVXNlIHRoZSBmb3JtYXQgXCJmb2xkZXIvc3ViZm9sZGVyXCIuIERvIG5vdCB1c2UgbGVhZGluZyBvciB0cmFpbGluZyBzbGFzaGVzIFwiL1wiLicpXHJcblx0XHRcdC5hZGRUZXh0KCh0ZXh0KSA9PlxyXG5cdFx0XHRcdHRleHRcclxuXHRcdFx0XHRcdC5zZXRQbGFjZWhvbGRlcignJylcclxuXHRcdFx0XHRcdC5zZXRWYWx1ZShwbHVnaW4uc2V0dGluZ3MuZGFpbHlOb3Rlc0ZvbGRlcilcclxuXHRcdFx0XHRcdC5vbkNoYW5nZSgodmFsdWUpID0+IHtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coXCJUaGUgbmV3IGRhaWx5IG5vdGVzIGZvbGRlcjpcIiArIHZhbHVlKTtcclxuXHRcdFx0XHRcdFx0cGx1Z2luLnNldHRpbmdzLmRhaWx5Tm90ZXNGb2xkZXIgPSB2YWx1ZTtcclxuXHRcdFx0XHRcdFx0cGx1Z2luLnNhdmVEYXRhKHBsdWdpbi5zZXR0aW5ncyk7XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHQpO1xyXG5cdFx0bmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcblx0XHRcdC5zZXROYW1lKCdSZXZpZXcgc2VjdGlvbiBoZWFkaW5nJylcclxuXHRcdFx0LnNldERlc2MoJ1NldCB0aGUgaGVhZGluZyB0byB1c2UgZm9yIHRoZSByZXZpZXcgc2VjdGlvbi4gQkUgQ0FSRUZVTDogaXQgbXVzdCBiZSB1bmlxdWUgaW4gZWFjaCBkYWlseSBub3RlLicpXHJcblx0XHRcdC5hZGRUZXh0KCh0ZXh0KSA9PlxyXG5cdFx0XHRcdHRleHRcclxuXHRcdFx0XHRcdC5zZXRQbGFjZWhvbGRlcignIyMgUmV2aWV3JylcclxuXHRcdFx0XHRcdC5zZXRWYWx1ZShwbHVnaW4uc2V0dGluZ3MucmV2aWV3U2VjdGlvbkhlYWRpbmcpXHJcblx0XHRcdFx0XHQub25DaGFuZ2UoKHZhbHVlKSA9PiB7XHJcblx0XHRcdFx0XHRcdGlmICh2YWx1ZSA9PT0gXCJcIikge1xyXG5cdFx0XHRcdFx0XHRcdHBsdWdpbi5zZXR0aW5ncy5yZXZpZXdTZWN0aW9uSGVhZGluZyA9IFwiIyMgUmV2aWV3XCI7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0cGx1Z2luLnNldHRpbmdzLnJldmlld1NlY3Rpb25IZWFkaW5nID0gdmFsdWU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0cGx1Z2luLnNhdmVEYXRhKHBsdWdpbi5zZXR0aW5ncyk7XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHQpO1xyXG5cdFx0bmV3IFNldHRpbmcoY29udGFpbmVyRWwpXHJcblx0XHRcdC5zZXROYW1lKCdMaW5lIHByZWZpeCcpXHJcblx0XHRcdC5zZXREZXNjKCdTZXQgdGhlIHByZWZpeCB0byB1c2Ugb24gZWFjaCBuZXcgbGluZS4gRS5nLiwgdXNlIGAtIGAgZm9yIGJ1bGxldHMgb3IgYC0gWyBdIGAgZm9yIHRhc2tzLiAqKkluY2x1ZGUgdGhlIHRyYWlsaW5nIHNwYWNlLioqJylcclxuXHRcdFx0LmFkZFRleHQoKHRleHQpID0+XHJcblx0XHRcdFx0dGV4dFxyXG5cdFx0XHRcdFx0LnNldFBsYWNlaG9sZGVyKCctICcpXHJcblx0XHRcdFx0XHQuc2V0VmFsdWUocGx1Z2luLnNldHRpbmdzLmxpbmVQcmVmaXgpXHJcblx0XHRcdFx0XHQub25DaGFuZ2UoKHZhbHVlKSA9PiB7XHJcblx0XHRcdFx0XHRcdHBsdWdpbi5zZXR0aW5ncy5saW5lUHJlZml4ID0gdmFsdWU7XHJcblx0XHRcdFx0XHRcdHBsdWdpbi5zYXZlRGF0YShwbHVnaW4uc2V0dGluZ3MpO1xyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0KTtcclxuXHRcdG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG5cdFx0XHQuc2V0TmFtZSgnQmxvY2sgcmV2aWV3IGxpbmUgcHJlZml4JylcclxuXHRcdFx0LnNldERlc2MoJ1NldCB0aGUgcHJlZml4IHVzZWQgd2hlbiBhZGRpbmcgYmxvY2tzIHRvIGRhaWx5IG5vdGVzIHdpdGggUmV2aWV3LiBVc2UgZS5nLiwgYC0gWyBdIGAgdG8gbGluayB0aGUgYmxvY2sgYXMgYSB0YXNrLCBvciBgIWAgdG8gY3JlYXRlIGVtYmVkcy4nKVxyXG5cdFx0XHQuYWRkVGV4dCgodGV4dCkgPT4gXHJcblx0XHRcdFx0dGV4dFxyXG5cdFx0XHRcdFx0LnNldFBsYWNlaG9sZGVyKCchJylcclxuXHRcdFx0XHRcdC5zZXRWYWx1ZShwbHVnaW4uc2V0dGluZ3MuYmxvY2tMaW5lUHJlZml4KVxyXG5cdFx0XHRcdFx0Lm9uQ2hhbmdlKCh2YWx1ZSkgPT4ge1xyXG5cdFx0XHRcdFx0XHRwbHVnaW4uc2V0dGluZ3MuYmxvY2tMaW5lUHJlZml4ID0gdmFsdWU7XHJcblx0XHRcdFx0XHRcdHBsdWdpbi5zYXZlRGF0YShwbHVnaW4uc2V0dGluZ3MpO1xyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0KTtcclxuXHRcdG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG5cdFx0XHQuc2V0TmFtZSgnRGVmYXVsdCByZXZpZXcgZGF0ZScpXHJcblx0XHRcdC5zZXREZXNjKCdTZXQgYSBkZWZhdWx0IGRhdGUgdG8gYmUgdXNlZCB3aGVuIG5vIGRhdGUgaXMgZW50ZXJlZC4gVXNlIG5hdHVyYWwgbGFuZ3VhZ2U6IFwiTmV4dCBNb25kYXlcIiwgXCJOb3ZlbWJlciA1dGhcIiwgYW5kIFwidG9tb3Jyb3dcIiBhbGwgd29yay4nKVxyXG5cdFx0XHQuYWRkVGV4dCgodGV4dCkgPT4gXHJcblx0XHRcdFx0dGV4dFxyXG5cdFx0XHRcdFx0LnNldFBsYWNlaG9sZGVyKCcnKVxyXG5cdFx0XHRcdFx0LnNldFZhbHVlKHBsdWdpbi5zZXR0aW5ncy5kZWZhdWx0UmV2aWV3RGF0ZSlcclxuXHRcdFx0XHRcdC5vbkNoYW5nZSgodmFsdWUpID0+IHtcclxuXHRcdFx0XHRcdFx0cGx1Z2luLnNldHRpbmdzLmRlZmF1bHRSZXZpZXdEYXRlID0gdmFsdWU7XHJcblx0XHRcdFx0XHRcdHBsdWdpbi5zYXZlRGF0YShwbHVnaW4uc2V0dGluZ3MpO1xyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0KTtcclxuXHRcdFxyXG5cdFx0Ly8gY29udGFpbmVyRWwuY3JlYXRlRWwoJ2gzJywgeyB0ZXh0OiAnUHJlc2V0IHJldmlldyBzY2hlZHVsZXMnIH0pO1xyXG5cclxuXHRcdC8qXHJcblx0XHRUS1RLVEs6IEZpZ3VyZSBvdXQgaG93IHRvIGFkZCBhIGZ1bmN0aW9uIHRvIGEgYnV0dG9uIGluc2lkZSB0aGUgc2V0dGluZyBlbGVtZW50LiBDdXJyZW50bHkgYGRvU29tZXRoaW5nYCwgYmVsb3csIHRocm93cyBlcnJvcnMuXHJcblx0XHRjb250YWluZXJFbC5jcmVhdGVFbCgnYnV0dG9uJywgeyB0ZXh0OiBcIkFkZCBhIG5ldyByZXZpZXcgc2NoZWR1bGUgcHJlc2V0XCIsIGF0dHI6IHsgb25jbGljazogXCJkb1NvbWV0aGluZyh7IGNvbnNvbGUubG9nKCdidXR0b24gY2xpY2tlZCcpIH0pO1wifX0pO1xyXG5cdFx0Ki9cclxuXHR9XHRcclxufVxyXG4iXSwibmFtZXMiOlsiTm90aWNlIiwiUGx1Z2luIiwiVGV4dENvbXBvbmVu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LEtBQUssQ0FBQyxPQUFPLEVBQUUsVUFBVSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDOUUsS0FBSyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBQ0Q7QUFDTyxTQUFTLFdBQVcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFO0FBQzNDLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNySCxJQUFJLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxPQUFPLE1BQU0sS0FBSyxVQUFVLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxXQUFXLEVBQUUsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzdKLElBQUksU0FBUyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsT0FBTyxVQUFVLENBQUMsRUFBRSxFQUFFLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDdEUsSUFBSSxTQUFTLElBQUksQ0FBQyxFQUFFLEVBQUU7QUFDdEIsUUFBUSxJQUFJLENBQUMsRUFBRSxNQUFNLElBQUksU0FBUyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7QUFDdEUsUUFBUSxPQUFPLENBQUMsRUFBRSxJQUFJO0FBQ3RCLFlBQVksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDekssWUFBWSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3BELFlBQVksUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3pCLGdCQUFnQixLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxNQUFNO0FBQzlDLGdCQUFnQixLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUM7QUFDeEUsZ0JBQWdCLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FB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
