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

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function inlineLog(str) {
    console.log(str);
    return str;
}
var TextExpander = /** @class */ (function (_super) {
    __extends(TextExpander, _super);
    function TextExpander(app, plugin) {
        var _this = _super.call(this, app, plugin) || this;
        _this.delay = 2000;
        _this.search = _this.search.bind(_this);
        _this.initExpander = _this.initExpander.bind(_this);
        _this.getLastLineNum = _this.getLastLineNum.bind(_this);
        _this.reformatLinks = _this.reformatLinks.bind(_this);
        return _this;
    }
    TextExpander.prototype.reformatLinks = function (links, mapFunc) {
        if (mapFunc === void 0) { mapFunc = function (s) { return '[[' + s + ']]'; }; }
        var currentView = this.app.workspace.activeLeaf.view;
        if (currentView instanceof obsidian.FileView) {
            return links.map(function (e) { return e.file.basename; })
                .filter(function (e) { return currentView.file.basename !== e; })
                .map(mapFunc).join('\n');
        }
        return links.map(function (e) { return e.file.basename; }).map(mapFunc).join('\n');
    };
    TextExpander.prototype.getFstLineNum = function (doc, line) {
        if (line === void 0) { line = 0; }
        var lineNum = line === 0
            ? doc.getCursor().line
            : line;
        if (doc.lineCount() === lineNum) {
            return doc.getCursor().line + 1;
        }
        return doc.getLine(lineNum) === '```'
            ? lineNum + 1
            : this.getFstLineNum(doc, lineNum + 1);
    };
    TextExpander.prototype.getLastLineNum = function (doc, line) {
        if (line === void 0) { line = 0; }
        var lineNum = line === 0
            ? doc.getCursor().line
            : line;
        if (doc.lineCount() === lineNum) {
            return doc.getCursor().line + 1;
        }
        return doc.getLine(lineNum) === '---'
            ? lineNum
            : this.getLastLineNum(doc, lineNum + 1);
    };
    TextExpander.prototype.getLinesOffsetToGoal = function (start, goal, step) {
        if (step === void 0) { step = 1; }
        var lineCount = this.cm.lineCount();
        var offset = 0;
        while (!isNaN(start + offset) && start + offset < lineCount && start + offset >= 0) {
            var result = goal === this.cm.getLine(start + offset);
            if (result) {
                return offset;
            }
            offset += step;
        }
        return start;
    };
    TextExpander.prototype.getContentBetweenLines = function (fromLineNum, startLine, endLine) {
        var _a;
        var cm = this.cm;
        var topOffset = this.getLinesOffsetToGoal(fromLineNum, startLine, -1);
        var botOffset = this.getLinesOffsetToGoal(fromLineNum, endLine, 1);
        var topLine = fromLineNum + topOffset + 1;
        var botLine = fromLineNum + botOffset - 1;
        return cm.getRange({ line: topLine || fromLineNum, ch: 0 }, { line: botLine || fromLineNum, ch: (_a = cm.getLine(botLine)) === null || _a === void 0 ? void 0 : _a.length });
    };
    TextExpander.prototype.search = function (s) {
        // @ts-ignore
        var globalSearchFn = this.app.internalPlugins.getPluginById('global-search').instance.openGlobalSearch.bind(this);
        var search = function (query) { return globalSearchFn(inlineLog(query)); };
        search(s);
    };
    TextExpander.prototype.getFoundAfterDelay = function (mapFunc) {
        return __awaiter(this, void 0, void 0, function () {
            var searchLeaf, view;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        searchLeaf = this.app.workspace.getLeavesOfType('search')[0];
                        return [4 /*yield*/, searchLeaf.open(searchLeaf.view)];
                    case 1:
                        view = _a.sent();
                        return [2 /*return*/, new Promise(function (resolve) {
                                // @ts-ignore
                                setTimeout(function () { return resolve(view.dom.resultDoms.map(function (e) { return e.file; })); }, _this.delay);
                            })];
                }
            });
        });
    };
    TextExpander.prototype.initExpander = function () {
        var _this = this;
        var _a = this, reformatLinks = _a.reformatLinks, getLastLineNum = _a.getLastLineNum, search = _a.search;
        var getFoundFilenames = function (callback) {
            var searchLeaf = _this.app.workspace.getLeavesOfType('search')[0];
            searchLeaf.open(searchLeaf.view)
                .then(function (view) { return setTimeout(function () {
                // @ts-ignore
                var result = reformatLinks(view.dom.resultDoms);
                callback(result);
            }, _this.delay); });
        };
        var currentView = this.app.workspace.activeLeaf.view;
        if (!(currentView instanceof obsidian.MarkdownView)) {
            return;
        }
        var cmDoc = this.cm = currentView.sourceMode.cmEditor;
        var curNum = cmDoc.getCursor().line;
        var curText = cmDoc.getLine(curNum);
        var workingLine = this.getContentBetweenLines(curNum, '```expander', '```') || curText;
        console.log('between', this.getContentBetweenLines(curNum, '```expander', '```'));
        var hasFormulaRegexp = /^{{.+}}/;
        if (!hasFormulaRegexp.test(workingLine)) {
            return;
        }
        var isEmbed = workingLine.split('\n').length > 1 || cmDoc.getLine(curNum - 1) === '```expander';
        if (isEmbed && this.checkTemplateMode(workingLine, curNum)) {
            return;
        }
        var fstLineNumToReplace = isEmbed
            ? curNum - 1
            : curNum;
        var lstLineNumToReplace = isEmbed
            ? getLastLineNum(cmDoc)
            : curNum;
        var searchQuery = curText.replace('{{', '').replace('}}', '');
        var embedFormula = '```expander\n' +
            '{{' + searchQuery + '}}\n' +
            '```\n';
        var replaceLine = function (content) { return cmDoc.replaceRange(embedFormula + content + '\n\n---', { line: fstLineNumToReplace, ch: 0 }, { line: lstLineNumToReplace, ch: cmDoc.getLine(lstLineNumToReplace).length }); };
        search(inlineLog(searchQuery));
        getFoundFilenames(replaceLine);
    };
    TextExpander.prototype.checkTemplateMode = function (content, curLineNum) {
        var hasTemplate = content.split('\n').length > 1;
        if (!hasTemplate) {
            return false;
        }
        this.startTemplateMode(content, curLineNum);
        return true;
    };
    TextExpander.prototype.startTemplateMode = function (content, n) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, searchFormula, templateContent, files, currentView, currentFileName, heading, footer, repeatableContent, filesWithoutCurrent, format, changed, result, fstLine, lstLine;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = __read(content.split('\n')), searchFormula = _a[0], templateContent = _a.slice(1);
                        this.search(searchFormula.replace(/[\{\{|\}\}]/g, ''));
                        return [4 /*yield*/, this.getFoundAfterDelay(function (s) { return s; })];
                    case 1:
                        files = _b.sent();
                        currentView = this.app.workspace.activeLeaf.view;
                        currentFileName = '';
                        heading = templateContent.filter(function (e) { return e[0] === '^'; }).map(function (_a) {
                            var _b = __read(_a), _ = _b[0], tail = _b.slice(1);
                            return tail;
                        });
                        footer = templateContent.filter(function (e) { return e[0] === '>'; }).map(function (_a) {
                            var _b = __read(_a), _ = _b[0], tail = _b.slice(1);
                            return tail;
                        });
                        repeatableContent = templateContent.filter(function (e) { return e[0] !== '^' && e[0] !== '>'; });
                        if (currentView instanceof obsidian.FileView) {
                            currentFileName = currentView.file.basename;
                        }
                        filesWithoutCurrent = files.filter(function (file) { return file.basename !== currentFileName; });
                        format = function (r, s) { return s
                            .replace(/\$filename/g, r.basename)
                            .replace(/\$letters:\d+/g, 
                        // @ts-ignore
                        function (str) { return r.cachedData
                            .split('')
                            .filter(function (_, i) { return i < Number(str.split(':')[1]); }).join(''); })
                            .replace(/\$lines:\d+/g, 
                        // @ts-ignore
                        function (str) { return r.cachedData
                            .split('\n')
                            .filter(function (_, i) { return i < Number(str.split(':')[1]); }).join('\n'); })
                            // @ts-ignore
                            .replace(/\$letters+/g, r.cachedData)
                            // @ts-ignore
                            .replace(/\$lines+/g, r.cachedData)
                            .replace(/\$ext/g, r.extension)
                            .replace(/\$created/g, String(r.stat.ctime))
                            .replace(/\$size/g, String(r.stat.size))
                            .replace(/\$path/g, r.path)
                            .replace(/\$parent/g, r.parent.name); };
                        changed = filesWithoutCurrent.map(function (file) { return repeatableContent.map(function (s) { return format(file, s); }).join('\n'); });
                        result = heading.join('\n') + '\n' + changed.join('\n') + '\n' + footer.join('\n') + '\n\n---';
                        fstLine = this.getFstLineNum(this.cm, n);
                        lstLine = this.getLastLineNum(this.cm, fstLine);
                        this.cm.replaceRange(result, { line: fstLine, ch: 0 }, { line: lstLine, ch: this.cm.getLine(lstLine).length });
                        return [2 /*return*/];
                }
            });
        });
    };
    TextExpander.prototype.onload = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.addSettingTab(new SettingTab(this.app, this));
                        this.addCommand({
                            id: 'editor-expand',
                            name: 'expand',
                            callback: this.initExpander,
                            hotkeys: []
                        });
                        return [4 /*yield*/, this.loadData()];
                    case 1:
                        data = _a.sent();
                        this.delay = (data === null || data === void 0 ? void 0 : data.delay) || 2000;
                        return [2 /*return*/];
                }
            });
        });
    };
    TextExpander.prototype.onunload = function () {
        console.log('unloading plugin');
    };
    return TextExpander;
}(obsidian.Plugin));
var SettingTab = /** @class */ (function (_super) {
    __extends(SettingTab, _super);
    function SettingTab(app, plugin) {
        var _this = _super.call(this, app, plugin) || this;
        _this.app = app;
        _this.plugin = plugin;
        return _this;
    }
    SettingTab.prototype.display = function () {
        var _this = this;
        var containerEl = this.containerEl;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Settings for Text Expander' });
        new obsidian.Setting(containerEl)
            .setName('Delay')
            .setDesc('Text expander don\' wait until search completed. It waits for a delay and paste result after that.')
            .addSlider(function (slider) {
            slider.setLimits(1000, 10000, 1000);
            slider.setValue(_this.plugin.delay);
            slider.onChange(function (value) {
                _this.plugin.delay = value;
                _this.plugin.saveData({ delay: value });
            });
            slider.setDynamicTooltip();
        });
    };
    return SettingTab;
}(obsidian.PluginSettingTab));

module.exports = TextExpander;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIm1haW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxyXG5cclxuUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55XHJcbnB1cnBvc2Ugd2l0aCBvciB3aXRob3V0IGZlZSBpcyBoZXJlYnkgZ3JhbnRlZC5cclxuXHJcblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEhcclxuUkVHQVJEIFRPIFRISVMgU09GVFdBUkUgSU5DTFVESU5HIEFMTCBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZXHJcbkFORCBGSVRORVNTLiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SIEJFIExJQUJMRSBGT1IgQU5ZIFNQRUNJQUwsIERJUkVDVCxcclxuSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NXHJcbkxPU1MgT0YgVVNFLCBEQVRBIE9SIFBST0ZJVFMsIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBORUdMSUdFTkNFIE9SXHJcbk9USEVSIFRPUlRJT1VTIEFDVElPTiwgQVJJU0lORyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1JcclxuUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMCAmJiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocywgcFtpXSkpXHJcbiAgICAgICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgICAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fY3JlYXRlQmluZGluZyA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XHJcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgb1trMl0gPSBtW2tdO1xyXG59KTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgbykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvLCBwKSkgX19jcmVhdGVCaW5kaW5nKG8sIG0sIHApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yLCBtID0gcyAmJiBvW3NdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgaWYgKG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHMgPyBcIk9iamVjdCBpcyBub3QgaXRlcmFibGUuXCIgOiBcIlN5bWJvbC5pdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWQoKSB7XHJcbiAgICBmb3IgKHZhciBhciA9IFtdLCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuICAgICAgICBhciA9IGFyLmNvbmNhdChfX3JlYWQoYXJndW1lbnRzW2ldKSk7XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5cygpIHtcclxuICAgIGZvciAodmFyIHMgPSAwLCBpID0gMCwgaWwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykgcyArPSBhcmd1bWVudHNbaV0ubGVuZ3RoO1xyXG4gICAgZm9yICh2YXIgciA9IEFycmF5KHMpLCBrID0gMCwgaSA9IDA7IGkgPCBpbDsgaSsrKVxyXG4gICAgICAgIGZvciAodmFyIGEgPSBhcmd1bWVudHNbaV0sIGogPSAwLCBqbCA9IGEubGVuZ3RoOyBqIDwgamw7IGorKywgaysrKVxyXG4gICAgICAgICAgICByW2tdID0gYVtqXTtcclxuICAgIHJldHVybiByO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xyXG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydFN0YXIobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xyXG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZEdldChyZWNlaXZlciwgcHJpdmF0ZU1hcCkge1xyXG4gICAgaWYgKCFwcml2YXRlTWFwLmhhcyhyZWNlaXZlcikpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiYXR0ZW1wdGVkIHRvIGdldCBwcml2YXRlIGZpZWxkIG9uIG5vbi1pbnN0YW5jZVwiKTtcclxuICAgIH1cclxuICAgIHJldHVybiBwcml2YXRlTWFwLmdldChyZWNlaXZlcik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkU2V0KHJlY2VpdmVyLCBwcml2YXRlTWFwLCB2YWx1ZSkge1xyXG4gICAgaWYgKCFwcml2YXRlTWFwLmhhcyhyZWNlaXZlcikpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiYXR0ZW1wdGVkIHRvIHNldCBwcml2YXRlIGZpZWxkIG9uIG5vbi1pbnN0YW5jZVwiKTtcclxuICAgIH1cclxuICAgIHByaXZhdGVNYXAuc2V0KHJlY2VpdmVyLCB2YWx1ZSk7XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbn1cclxuIiwiaW1wb3J0IHtBcHAsIFZpZXcsIFBsdWdpbiwgUGx1Z2luU2V0dGluZ1RhYiwgU2V0dGluZywgVEZpbGUsIEZpbGVWaWV3LCBNYXJrZG93blZpZXcsIFBsdWdpbk1hbmlmZXN0fSBmcm9tICdvYnNpZGlhbic7XHJcblxyXG5pbnRlcmZhY2UgRmlsZXMge1xyXG4gICAgZmlsZTogVEZpbGVcclxufVxyXG5cclxuZnVuY3Rpb24gaW5saW5lTG9nKHN0cjogc3RyaW5nKSB7XHJcbiAgICBjb25zb2xlLmxvZyhzdHIpXHJcbiAgICByZXR1cm4gc3RyXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRleHRFeHBhbmRlciBleHRlbmRzIFBsdWdpbiB7XHJcbiAgICBkZWxheSA9IDIwMDA7XHJcbiAgICBjbTogQ29kZU1pcnJvci5FZGl0b3JcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcGx1Z2luOiBQbHVnaW5NYW5pZmVzdCkge1xyXG4gICAgICAgIHN1cGVyKGFwcCwgcGx1Z2luKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZWFyY2ggPSB0aGlzLnNlYXJjaC5iaW5kKHRoaXMpXHJcbiAgICAgICAgdGhpcy5pbml0RXhwYW5kZXIgPSB0aGlzLmluaXRFeHBhbmRlci5iaW5kKHRoaXMpXHJcbiAgICAgICAgdGhpcy5nZXRMYXN0TGluZU51bSA9IHRoaXMuZ2V0TGFzdExpbmVOdW0uYmluZCh0aGlzKVxyXG4gICAgICAgIHRoaXMucmVmb3JtYXRMaW5rcyA9IHRoaXMucmVmb3JtYXRMaW5rcy5iaW5kKHRoaXMpXHJcbiAgICB9XHJcblxyXG4gICAgcmVmb3JtYXRMaW5rcyhsaW5rczogRmlsZXNbXSwgbWFwRnVuYyA9IChzOiBzdHJpbmcpID0+ICdbWycgKyBzICsgJ11dJykge1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRWaWV3ID0gdGhpcy5hcHAud29ya3NwYWNlLmFjdGl2ZUxlYWYudmlld1xyXG5cclxuICAgICAgICBpZiAoY3VycmVudFZpZXcgaW5zdGFuY2VvZiBGaWxlVmlldykge1xyXG4gICAgICAgICAgICByZXR1cm4gbGlua3MubWFwKGUgPT4gZS5maWxlLmJhc2VuYW1lKVxyXG4gICAgICAgICAgICAgICAgLmZpbHRlcihlID0+IGN1cnJlbnRWaWV3LmZpbGUuYmFzZW5hbWUgIT09IGUpXHJcbiAgICAgICAgICAgICAgICAubWFwKG1hcEZ1bmMpLmpvaW4oJ1xcbicpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbGlua3MubWFwKGUgPT4gZS5maWxlLmJhc2VuYW1lKS5tYXAobWFwRnVuYykuam9pbignXFxuJylcclxuICAgIH1cclxuXHJcbiAgICBnZXRGc3RMaW5lTnVtKGRvYzogQ29kZU1pcnJvci5Eb2MsIGxpbmUgPSAwKTogbnVtYmVyIHtcclxuICAgICAgICBjb25zdCBsaW5lTnVtID0gbGluZSA9PT0gMFxyXG4gICAgICAgICAgICA/IGRvYy5nZXRDdXJzb3IoKS5saW5lXHJcbiAgICAgICAgICAgIDogbGluZVxyXG5cclxuICAgICAgICBpZiAoZG9jLmxpbmVDb3VudCgpID09PSBsaW5lTnVtKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkb2MuZ2V0Q3Vyc29yKCkubGluZSArIDFcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBkb2MuZ2V0TGluZShsaW5lTnVtKSA9PT0gJ2BgYCdcclxuICAgICAgICAgICAgPyBsaW5lTnVtICsgMVxyXG4gICAgICAgICAgICA6IHRoaXMuZ2V0RnN0TGluZU51bShkb2MsIGxpbmVOdW0gKyAxKVxyXG4gICAgfVxyXG5cclxuICAgIGdldExhc3RMaW5lTnVtKGRvYzogQ29kZU1pcnJvci5Eb2MsIGxpbmUgPSAwKTogbnVtYmVyIHtcclxuICAgICAgICBjb25zdCBsaW5lTnVtID0gbGluZSA9PT0gMFxyXG4gICAgICAgICAgICA/IGRvYy5nZXRDdXJzb3IoKS5saW5lXHJcbiAgICAgICAgICAgIDogbGluZVxyXG5cclxuICAgICAgICBpZiAoZG9jLmxpbmVDb3VudCgpID09PSBsaW5lTnVtKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkb2MuZ2V0Q3Vyc29yKCkubGluZSArIDFcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBkb2MuZ2V0TGluZShsaW5lTnVtKSA9PT0gJy0tLSdcclxuICAgICAgICAgICAgPyBsaW5lTnVtXHJcbiAgICAgICAgICAgIDogdGhpcy5nZXRMYXN0TGluZU51bShkb2MsIGxpbmVOdW0gKyAxKVxyXG4gICAgfVxyXG5cclxuICAgIGdldExpbmVzT2Zmc2V0VG9Hb2FsKHN0YXJ0OiBudW1iZXIsIGdvYWw6IHN0cmluZywgc3RlcCA9IDEpOiBudW1iZXIge1xyXG4gICAgICAgIGNvbnN0IGxpbmVDb3VudCA9IHRoaXMuY20ubGluZUNvdW50KClcclxuICAgICAgICBsZXQgb2Zmc2V0ID0gMFxyXG5cclxuICAgICAgICB3aGlsZSAoIWlzTmFOKHN0YXJ0ICsgb2Zmc2V0KSAmJiBzdGFydCArIG9mZnNldCA8IGxpbmVDb3VudCAmJiBzdGFydCArIG9mZnNldCA+PSAwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGdvYWwgPT09IHRoaXMuY20uZ2V0TGluZShzdGFydCArIG9mZnNldClcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvZmZzZXRcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgb2Zmc2V0ICs9IHN0ZXBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdGFydFxyXG4gICAgfVxyXG5cclxuICAgIGdldENvbnRlbnRCZXR3ZWVuTGluZXMoZnJvbUxpbmVOdW06IG51bWJlciwgc3RhcnRMaW5lOiBzdHJpbmcsIGVuZExpbmU6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IHtjbX0gPSB0aGlzXHJcbiAgICAgICAgY29uc3QgdG9wT2Zmc2V0ID0gdGhpcy5nZXRMaW5lc09mZnNldFRvR29hbChmcm9tTGluZU51bSwgc3RhcnRMaW5lLCAtMSlcclxuICAgICAgICBjb25zdCBib3RPZmZzZXQgPSB0aGlzLmdldExpbmVzT2Zmc2V0VG9Hb2FsKGZyb21MaW5lTnVtLCBlbmRMaW5lLCAxKVxyXG5cclxuICAgICAgICBjb25zdCB0b3BMaW5lID0gZnJvbUxpbmVOdW0gKyB0b3BPZmZzZXQgKyAxXHJcbiAgICAgICAgY29uc3QgYm90TGluZSA9IGZyb21MaW5lTnVtICsgYm90T2Zmc2V0IC0gMVxyXG5cclxuICAgICAgICByZXR1cm4gY20uZ2V0UmFuZ2Uoe2xpbmU6IHRvcExpbmUgfHwgZnJvbUxpbmVOdW0sIGNoOiAwfSxcclxuICAgICAgICAgICAge2xpbmU6IGJvdExpbmUgfHwgZnJvbUxpbmVOdW0sIGNoOiBjbS5nZXRMaW5lKGJvdExpbmUpPy5sZW5ndGggfSlcclxuICAgIH1cclxuXHJcbiAgICBzZWFyY2goczogc3RyaW5nKSB7XHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIGNvbnN0IGdsb2JhbFNlYXJjaEZuID0gdGhpcy5hcHAuaW50ZXJuYWxQbHVnaW5zLmdldFBsdWdpbkJ5SWQoJ2dsb2JhbC1zZWFyY2gnKS5pbnN0YW5jZS5vcGVuR2xvYmFsU2VhcmNoLmJpbmQodGhpcylcclxuICAgICAgICBjb25zdCBzZWFyY2ggPSAocXVlcnk6IHN0cmluZykgPT4gZ2xvYmFsU2VhcmNoRm4oaW5saW5lTG9nKHF1ZXJ5KSlcclxuXHJcbiAgICAgICAgc2VhcmNoKHMpXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgZ2V0Rm91bmRBZnRlckRlbGF5KG1hcEZ1bmMgPSAoczogc3RyaW5nKSA9PiAnW1snICsgcyArICddXScgKSB7XHJcbiAgICAgICAgY29uc3Qgc2VhcmNoTGVhZiA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWF2ZXNPZlR5cGUoJ3NlYXJjaCcpWzBdXHJcbiAgICAgICAgY29uc3QgdmlldyA9IGF3YWl0IHNlYXJjaExlYWYub3BlbihzZWFyY2hMZWFmLnZpZXcpXHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gcmVzb2x2ZSh2aWV3LmRvbS5yZXN1bHREb21zLm1hcChlID0+IGUuZmlsZSkpLCB0aGlzLmRlbGF5KVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgaW5pdEV4cGFuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHtyZWZvcm1hdExpbmtzLCBnZXRMYXN0TGluZU51bSwgc2VhcmNofSA9IHRoaXNcclxuICAgICAgICBjb25zdCBnZXRGb3VuZEZpbGVuYW1lcyA9IChjYWxsYmFjazogKHM6IHN0cmluZykgPT4gYW55KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNlYXJjaExlYWYgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0TGVhdmVzT2ZUeXBlKCdzZWFyY2gnKVswXVxyXG4gICAgICAgICAgICBzZWFyY2hMZWFmLm9wZW4oc2VhcmNoTGVhZi52aWV3KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHZpZXc6IFZpZXcpID0+IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSByZWZvcm1hdExpbmtzKHZpZXcuZG9tLnJlc3VsdERvbXMpXHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2socmVzdWx0KVxyXG4gICAgICAgICAgICAgICAgfSwgdGhpcy5kZWxheSkpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBjdXJyZW50VmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5hY3RpdmVMZWFmLnZpZXdcclxuXHJcbiAgICAgICAgaWYgKCEoY3VycmVudFZpZXcgaW5zdGFuY2VvZiBNYXJrZG93blZpZXcpKSB7XHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgY21Eb2MgPSB0aGlzLmNtID0gY3VycmVudFZpZXcuc291cmNlTW9kZS5jbUVkaXRvclxyXG5cclxuICAgICAgICBjb25zdCBjdXJOdW0gPSBjbURvYy5nZXRDdXJzb3IoKS5saW5lXHJcbiAgICAgICAgY29uc3QgY3VyVGV4dCA9IGNtRG9jLmdldExpbmUoY3VyTnVtKVxyXG4gICAgICAgIGNvbnN0IHdvcmtpbmdMaW5lID0gdGhpcy5nZXRDb250ZW50QmV0d2VlbkxpbmVzKGN1ck51bSwgJ2BgYGV4cGFuZGVyJywgJ2BgYCcpIHx8IGN1clRleHRcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coJ2JldHdlZW4nLCB0aGlzLmdldENvbnRlbnRCZXR3ZWVuTGluZXMoY3VyTnVtLCAnYGBgZXhwYW5kZXInLCAnYGBgJykpXHJcbiAgICAgICAgY29uc3QgaGFzRm9ybXVsYVJlZ2V4cCA9IC9ee3suK319L1xyXG5cclxuICAgICAgICBpZiAoIWhhc0Zvcm11bGFSZWdleHAudGVzdCh3b3JraW5nTGluZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBpc0VtYmVkID0gd29ya2luZ0xpbmUuc3BsaXQoJ1xcbicpLmxlbmd0aCA+IDEgfHwgY21Eb2MuZ2V0TGluZShjdXJOdW0gLSAxKSA9PT0gJ2BgYGV4cGFuZGVyJ1xyXG5cclxuICAgICAgICBpZiAoaXNFbWJlZCAmJiB0aGlzLmNoZWNrVGVtcGxhdGVNb2RlKHdvcmtpbmdMaW5lLCBjdXJOdW0pKSB7IHJldHVybiB9XHJcblxyXG4gICAgICAgIGNvbnN0IGZzdExpbmVOdW1Ub1JlcGxhY2UgPSBpc0VtYmVkXHJcbiAgICAgICAgICAgID8gY3VyTnVtIC0gMVxyXG4gICAgICAgICAgICA6IGN1ck51bVxyXG4gICAgICAgIGNvbnN0IGxzdExpbmVOdW1Ub1JlcGxhY2UgPSBpc0VtYmVkXHJcbiAgICAgICAgICAgID8gZ2V0TGFzdExpbmVOdW0oY21Eb2MpXHJcbiAgICAgICAgICAgIDogY3VyTnVtXHJcblxyXG4gICAgICAgIGNvbnN0IHNlYXJjaFF1ZXJ5ID0gY3VyVGV4dC5yZXBsYWNlKCd7eycsICcnKS5yZXBsYWNlKCd9fScsICcnKVxyXG4gICAgICAgIGNvbnN0IGVtYmVkRm9ybXVsYSA9ICdgYGBleHBhbmRlclxcbicgK1xyXG4gICAgICAgICAgICAne3snICsgc2VhcmNoUXVlcnkgKyAnfX1cXG4nICtcclxuICAgICAgICAgICAgJ2BgYFxcbidcclxuXHJcbiAgICAgICAgY29uc3QgcmVwbGFjZUxpbmUgPSAoY29udGVudDogc3RyaW5nKSA9PiBjbURvYy5yZXBsYWNlUmFuZ2UoZW1iZWRGb3JtdWxhICsgY29udGVudCArICdcXG5cXG4tLS0nLFxyXG4gICAgICAgICAgICB7bGluZTogZnN0TGluZU51bVRvUmVwbGFjZSwgY2g6IDB9LFxyXG4gICAgICAgICAgICB7bGluZTogbHN0TGluZU51bVRvUmVwbGFjZSwgY2g6IGNtRG9jLmdldExpbmUobHN0TGluZU51bVRvUmVwbGFjZSkubGVuZ3RofVxyXG4gICAgICAgIClcclxuXHJcbiAgICAgICAgc2VhcmNoKGlubGluZUxvZyhzZWFyY2hRdWVyeSkpXHJcbiAgICAgICAgZ2V0Rm91bmRGaWxlbmFtZXMocmVwbGFjZUxpbmUpXHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tUZW1wbGF0ZU1vZGUoY29udGVudDogc3RyaW5nLCBjdXJMaW5lTnVtOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBoYXNUZW1wbGF0ZSA9IGNvbnRlbnQuc3BsaXQoJ1xcbicpLmxlbmd0aCA+IDFcclxuXHJcbiAgICAgICAgaWYgKCFoYXNUZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc3RhcnRUZW1wbGF0ZU1vZGUoY29udGVudCwgY3VyTGluZU51bSlcclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWVcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBzdGFydFRlbXBsYXRlTW9kZShjb250ZW50OiBzdHJpbmcsIG46IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IFtzZWFyY2hGb3JtdWxhLCAuLi50ZW1wbGF0ZUNvbnRlbnRdID0gY29udGVudC5zcGxpdCgnXFxuJylcclxuICAgICAgICB0aGlzLnNlYXJjaChzZWFyY2hGb3JtdWxhLnJlcGxhY2UoL1tcXHtcXHt8XFx9XFx9XS9nLCAnJykpXHJcbiAgICAgICAgY29uc3QgZmlsZXMgPSBhd2FpdCB0aGlzLmdldEZvdW5kQWZ0ZXJEZWxheShzID0+IHMpIGFzIFRGaWxlW11cclxuICAgICAgICBjb25zdCBjdXJyZW50VmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5hY3RpdmVMZWFmLnZpZXdcclxuICAgICAgICBsZXQgY3VycmVudEZpbGVOYW1lID0gJydcclxuXHJcbiAgICAgICAgY29uc3QgaGVhZGluZyA9IHRlbXBsYXRlQ29udGVudC5maWx0ZXIoZSA9PiBlWzBdID09PSAnXicpLm1hcCgoW18sIC4uLnRhaWxdKSA9PiB0YWlsKVxyXG4gICAgICAgIGNvbnN0IGZvb3RlciA9IHRlbXBsYXRlQ29udGVudC5maWx0ZXIoZSA9PiBlWzBdID09PSAnPicpLm1hcCgoW18sIC4uLnRhaWxdKSA9PiB0YWlsKVxyXG4gICAgICAgIGNvbnN0IHJlcGVhdGFibGVDb250ZW50ID0gdGVtcGxhdGVDb250ZW50LmZpbHRlcihlID0+IGVbMF0gIT09ICdeJyAmJiBlWzBdICE9PSAnPicpXHJcblxyXG4gICAgICAgIGlmIChjdXJyZW50VmlldyBpbnN0YW5jZW9mIEZpbGVWaWV3KSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRGaWxlTmFtZSA9IGN1cnJlbnRWaWV3LmZpbGUuYmFzZW5hbWVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGZpbGVzV2l0aG91dEN1cnJlbnQgPSBmaWxlcy5maWx0ZXIoZmlsZSA9PiBmaWxlLmJhc2VuYW1lICE9PSBjdXJyZW50RmlsZU5hbWUpXHJcblxyXG4gICAgICAgIGNvbnN0IGZvcm1hdCA9IChyOiBURmlsZSwgczogc3RyaW5nKSA9PiBzXHJcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFwkZmlsZW5hbWUvZywgci5iYXNlbmFtZSlcclxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXCRsZXR0ZXJzOlxcZCsvZyxcclxuICAgICAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICAgICAgc3RyID0+IHIuY2FjaGVkRGF0YVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3BsaXQoJycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoXzogc3RyaW5nLCBpOiBudW1iZXIpID0+IGkgPCBOdW1iZXIoc3RyLnNwbGl0KCc6JylbMV0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICkuam9pbignJylcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXCRsaW5lczpcXGQrL2csXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICAgICAgICAgIHN0ciA9PiByLmNhY2hlZERhdGFcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnNwbGl0KCdcXG4nKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKF86IHN0cmluZywgaTogbnVtYmVyKSA9PiBpIDwgTnVtYmVyKHN0ci5zcGxpdCgnOicpWzFdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApLmpvaW4oJ1xcbicpXHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFwkbGV0dGVycysvZywgci5jYWNoZWREYXRhKVxyXG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcJGxpbmVzKy9nLCByLmNhY2hlZERhdGEpXHJcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFwkZXh0L2csIHIuZXh0ZW5zaW9uKVxyXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcJGNyZWF0ZWQvZywgU3RyaW5nKHIuc3RhdC5jdGltZSkpXHJcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFwkc2l6ZS9nLCBTdHJpbmcoci5zdGF0LnNpemUpKVxyXG5cdFx0XHRcdC5yZXBsYWNlKC9cXCRwYXRoL2csIHIucGF0aClcclxuXHRcdFx0XHQucmVwbGFjZSgvXFwkcGFyZW50L2csIHIucGFyZW50Lm5hbWUpXHJcblxyXG4gICAgICAgIGNvbnN0IGNoYW5nZWQgPSBmaWxlc1dpdGhvdXRDdXJyZW50Lm1hcChmaWxlID0+IHJlcGVhdGFibGVDb250ZW50Lm1hcChzID0+IGZvcm1hdChmaWxlLCBzKSkuam9pbignXFxuJykpXHJcblxyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGhlYWRpbmcuam9pbignXFxuJykgKyAnXFxuJyArIGNoYW5nZWQuam9pbignXFxuJykgKyAnXFxuJyArIGZvb3Rlci5qb2luKCdcXG4nKSArICdcXG5cXG4tLS0nXHJcblxyXG4gICAgICAgIGNvbnN0IGZzdExpbmUgPSB0aGlzLmdldEZzdExpbmVOdW0odGhpcy5jbSwgbilcclxuICAgICAgICBjb25zdCBsc3RMaW5lID0gdGhpcy5nZXRMYXN0TGluZU51bSh0aGlzLmNtLCBmc3RMaW5lKVxyXG5cclxuICAgICAgICB0aGlzLmNtLnJlcGxhY2VSYW5nZShyZXN1bHQsXHJcbiAgICAgICAgICAgIHtsaW5lOiBmc3RMaW5lLCBjaDogMH0sXHJcbiAgICAgICAgICAgIHtsaW5lOiBsc3RMaW5lLCBjaDogdGhpcy5jbS5nZXRMaW5lKGxzdExpbmUpLmxlbmd0aH0pXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25sb2FkKCkge1xyXG4gICAgICAgIHRoaXMuYWRkU2V0dGluZ1RhYihuZXcgU2V0dGluZ1RhYih0aGlzLmFwcCwgdGhpcykpO1xyXG5cclxuICAgICAgICB0aGlzLmFkZENvbW1hbmQoe1xyXG4gICAgICAgICAgICBpZDogJ2VkaXRvci1leHBhbmQnLFxyXG4gICAgICAgICAgICBuYW1lOiAnZXhwYW5kJyxcclxuICAgICAgICAgICAgY2FsbGJhY2s6IHRoaXMuaW5pdEV4cGFuZGVyLFxyXG4gICAgICAgICAgICBob3RrZXlzOiBbXVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCB0aGlzLmxvYWREYXRhKClcclxuICAgICAgICB0aGlzLmRlbGF5ID0gZGF0YT8uZGVsYXkgfHwgMjAwMFxyXG4gICAgfVxyXG5cclxuICAgIG9udW5sb2FkKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCd1bmxvYWRpbmcgcGx1Z2luJyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFNldHRpbmdUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcclxuICAgIHBsdWdpbjogVGV4dEV4cGFuZGVyXHJcblxyXG4gICAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHBsdWdpbjogVGV4dEV4cGFuZGVyKSB7XHJcbiAgICAgICAgc3VwZXIoYXBwLCBwbHVnaW4pO1xyXG5cclxuICAgICAgICB0aGlzLmFwcCA9IGFwcFxyXG4gICAgICAgIHRoaXMucGx1Z2luID0gcGx1Z2luXHJcbiAgICB9XHJcblxyXG4gICAgZGlzcGxheSgpOiB2b2lkIHtcclxuICAgICAgICBsZXQge2NvbnRhaW5lckVsfSA9IHRoaXM7XHJcblxyXG4gICAgICAgIGNvbnRhaW5lckVsLmVtcHR5KCk7XHJcblxyXG4gICAgICAgIGNvbnRhaW5lckVsLmNyZWF0ZUVsKCdoMicsIHt0ZXh0OiAnU2V0dGluZ3MgZm9yIFRleHQgRXhwYW5kZXInfSk7XHJcblxyXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG4gICAgICAgICAgICAuc2V0TmFtZSgnRGVsYXknKVxyXG4gICAgICAgICAgICAuc2V0RGVzYygnVGV4dCBleHBhbmRlciBkb25cXCcgd2FpdCB1bnRpbCBzZWFyY2ggY29tcGxldGVkLiBJdCB3YWl0cyBmb3IgYSBkZWxheSBhbmQgcGFzdGUgcmVzdWx0IGFmdGVyIHRoYXQuJylcclxuICAgICAgICAgICAgLmFkZFNsaWRlcihzbGlkZXIgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2xpZGVyLnNldExpbWl0cygxMDAwLCAxMDAwMCwgMTAwMClcclxuICAgICAgICAgICAgICAgIHNsaWRlci5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5kZWxheSlcclxuICAgICAgICAgICAgICAgIHNsaWRlci5vbkNoYW5nZSh2YWx1ZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZGVsYXkgPSB2YWx1ZVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVEYXRhKHsgZGVsYXk6IHZhbHVlIH0pXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgc2xpZGVyLnNldER5bmFtaWNUb29sdGlwKClcclxuICAgICAgICAgICAgfSlcclxuICAgIH1cclxufVxyXG4iXSwibmFtZXMiOlsiRmlsZVZpZXciLCJNYXJrZG93blZpZXciLCJQbHVnaW4iLCJTZXR0aW5nIiwiUGx1Z2luU2V0dGluZ1RhYiJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxhQUFhLEdBQUcsU0FBUyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ25DLElBQUksYUFBYSxHQUFHLE1BQU0sQ0FBQyxjQUFjO0FBQ3pDLFNBQVMsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFLFlBQVksS0FBSyxJQUFJLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUNwRixRQUFRLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUMxRyxJQUFJLE9BQU8sYUFBYSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMvQixDQUFDLENBQUM7QUFDRjtBQUNPLFNBQVMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDaEMsSUFBSSxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3hCLElBQUksU0FBUyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxFQUFFO0FBQzNDLElBQUksQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLEtBQUssSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN6RixDQUFDO0FBdUNEO0FBQ08sU0FBUyxTQUFTLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFO0FBQzdELElBQUksU0FBUyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsT0FBTyxLQUFLLFlBQVksQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxVQUFVLE9BQU8sRUFBRSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFO0FBQ2hILElBQUksT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsVUFBVSxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQy9ELFFBQVEsU0FBUyxTQUFTLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtBQUNuRyxRQUFRLFNBQVMsUUFBUSxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtBQUN0RyxRQUFRLFNBQVMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLE1BQU0sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRTtBQUN0SCxRQUFRLElBQUksQ0FBQyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxVQUFVLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUM5RSxLQUFLLENBQUMsQ0FBQztBQUNQLENBQUM7QUFDRDtBQUNPLFNBQVMsV0FBVyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUU7QUFDM0MsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3JILElBQUksT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLE9BQU8sTUFBTSxLQUFLLFVBQVUsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLFdBQVcsRUFBRSxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDN0osSUFBSSxTQUFTLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFBRSxPQUFPLFVBQVUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUN0RSxJQUFJLFNBQVMsSUFBSSxDQUFDLEVBQUUsRUFBRTtBQUN0QixRQUFRLElBQUksQ0FBQyxFQUFFLE1BQU0sSUFBSSxTQUFTLENBQUMsaUNBQWlDLENBQUMsQ0FBQztBQUN0RSxRQUFRLE9BQU8sQ0FBQyxFQUFFLElBQUk7QUFDdEIsWUFBWSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN6SyxZQUFZLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDcEQsWUFBWSxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDekIsZ0JBQWdCLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLE1BQU07QUFDOUMsZ0JBQWdCLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQztBQUN4RSxnQkFBZ0IsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUztBQUNqRSxnQkFBZ0IsS0FBSyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsU0FBUztBQUNqRSxnQkFBZ0I7QUFDaEIsb0JBQW9CLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUU7QUFDaEksb0JBQW9CLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFN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
