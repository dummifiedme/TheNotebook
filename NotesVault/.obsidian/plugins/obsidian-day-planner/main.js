'use strict';

var obsidian = require('obsidian');

class DayPlannerSettings {
    constructor() {
        this.customFolder = 'Day Planners';
        this.mode = DayPlannerMode.File;
        this.mermaid = false;
        this.notesToDates = [];
        this.completePastItems = true;
        this.circularProgress = false;
        this.nowAndNextInStatusBar = false;
        this.showTaskNotification = false;
        this.timelineZoomLevel = 4;
    }
}
class NoteForDate {
    constructor(notePath, date) {
        this.notePath = notePath;
        this.date = date;
    }
}
class NoteForDateQuery {
    exists(source) {
        return this.active(source) !== undefined;
    }
    active(source) {
        const now = new Date().toDateString();
        return source && source.filter(ntd => ntd.date === now)[0];
    }
}
var DayPlannerMode;
(function (DayPlannerMode) {
    DayPlannerMode[DayPlannerMode["File"] = 0] = "File";
    DayPlannerMode[DayPlannerMode["Command"] = 1] = "Command";
})(DayPlannerMode || (DayPlannerMode = {}));

const DEFAULT_DATE_FORMAT = 'YYYYMMDD';
const DATE_REGEX = /(?<target>{{date:?(?<date>[^}]*)}})/g;
const DAY_PLANNER_FILENAME = 'Day Planner-{{date}}.md';
//https://regex101.com/r/VAxRnc/3
const PLAN_PARSER_REGEX = /^(((-?[\s]*\[?(?<completion>[x ]*)\])?(\d.)?\s*?(?<hours>\d{1,2}):(?<minutes>\d{2})\s)((?<break>BREAK)|(?<end>END|finish)|((?<text>.*))))|((?<unmatched>[ \t]*- .*))$/gmi;
const DAY_PLANNER_DEFAULT_CONTENT = `## Day Planner
- [ ] 

---`;
const VIEW_TYPE_TIMELINE = 'timeline';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, basedir, module) {
	return module = {
		path: basedir,
		exports: {},
		require: function (path, base) {
			return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
		}
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var moment = createCommonjsModule(function (module, exports) {
(function (global, factory) {
     module.exports = factory() ;
}(commonjsGlobal, (function () {
    var hookCallback;

    function hooks() {
        return hookCallback.apply(null, arguments);
    }

    // This is done to register the method called with moment()
    // without creating circular dependencies.
    function setHookCallback(callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return (
            input instanceof Array ||
            Object.prototype.toString.call(input) === '[object Array]'
        );
    }

    function isObject(input) {
        // IE8 will treat undefined and null as object if it wasn't for
        // input != null
        return (
            input != null &&
            Object.prototype.toString.call(input) === '[object Object]'
        );
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function isObjectEmpty(obj) {
        if (Object.getOwnPropertyNames) {
            return Object.getOwnPropertyNames(obj).length === 0;
        } else {
            var k;
            for (k in obj) {
                if (hasOwnProp(obj, k)) {
                    return false;
                }
            }
            return true;
        }
    }

    function isUndefined(input) {
        return input === void 0;
    }

    function isNumber(input) {
        return (
            typeof input === 'number' ||
            Object.prototype.toString.call(input) === '[object Number]'
        );
    }

    function isDate(input) {
        return (
            input instanceof Date ||
            Object.prototype.toString.call(input) === '[object Date]'
        );
    }

    function map(arr, fn) {
        var res = [],
            i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function createUTC(input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty: false,
            unusedTokens: [],
            unusedInput: [],
            overflow: -2,
            charsLeftOver: 0,
            nullInput: false,
            invalidEra: null,
            invalidMonth: null,
            invalidFormat: false,
            userInvalidated: false,
            iso: false,
            parsedDateParts: [],
            era: null,
            meridiem: null,
            rfc2822: false,
            weekdayMismatch: false,
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    var some;
    if (Array.prototype.some) {
        some = Array.prototype.some;
    } else {
        some = function (fun) {
            var t = Object(this),
                len = t.length >>> 0,
                i;

            for (i = 0; i < len; i++) {
                if (i in t && fun.call(this, t[i], i, t)) {
                    return true;
                }
            }

            return false;
        };
    }

    function isValid(m) {
        if (m._isValid == null) {
            var flags = getParsingFlags(m),
                parsedParts = some.call(flags.parsedDateParts, function (i) {
                    return i != null;
                }),
                isNowValid =
                    !isNaN(m._d.getTime()) &&
                    flags.overflow < 0 &&
                    !flags.empty &&
                    !flags.invalidEra &&
                    !flags.invalidMonth &&
                    !flags.invalidWeekday &&
                    !flags.weekdayMismatch &&
                    !flags.nullInput &&
                    !flags.invalidFormat &&
                    !flags.userInvalidated &&
                    (!flags.meridiem || (flags.meridiem && parsedParts));

            if (m._strict) {
                isNowValid =
                    isNowValid &&
                    flags.charsLeftOver === 0 &&
                    flags.unusedTokens.length === 0 &&
                    flags.bigHour === undefined;
            }

            if (Object.isFrozen == null || !Object.isFrozen(m)) {
                m._isValid = isNowValid;
            } else {
                return isNowValid;
            }
        }
        return m._isValid;
    }

    function createInvalid(flags) {
        var m = createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        } else {
            getParsingFlags(m).userInvalidated = true;
        }

        return m;
    }

    // Plugins that add properties should also add the key here (null value),
    // so we can properly clone ourselves.
    var momentProperties = (hooks.momentProperties = []),
        updateInProgress = false;

    function copyConfig(to, from) {
        var i, prop, val;

        if (!isUndefined(from._isAMomentObject)) {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (!isUndefined(from._i)) {
            to._i = from._i;
        }
        if (!isUndefined(from._f)) {
            to._f = from._f;
        }
        if (!isUndefined(from._l)) {
            to._l = from._l;
        }
        if (!isUndefined(from._strict)) {
            to._strict = from._strict;
        }
        if (!isUndefined(from._tzm)) {
            to._tzm = from._tzm;
        }
        if (!isUndefined(from._isUTC)) {
            to._isUTC = from._isUTC;
        }
        if (!isUndefined(from._offset)) {
            to._offset = from._offset;
        }
        if (!isUndefined(from._pf)) {
            to._pf = getParsingFlags(from);
        }
        if (!isUndefined(from._locale)) {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i = 0; i < momentProperties.length; i++) {
                prop = momentProperties[i];
                val = from[prop];
                if (!isUndefined(val)) {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        if (!this.isValid()) {
            this._d = new Date(NaN);
        }
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment(obj) {
        return (
            obj instanceof Moment || (obj != null && obj._isAMomentObject != null)
        );
    }

    function warn(msg) {
        if (
            hooks.suppressDeprecationWarnings === false &&
            typeof console !== 'undefined' &&
            console.warn
        ) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;

        return extend(function () {
            if (hooks.deprecationHandler != null) {
                hooks.deprecationHandler(null, msg);
            }
            if (firstTime) {
                var args = [],
                    arg,
                    i,
                    key;
                for (i = 0; i < arguments.length; i++) {
                    arg = '';
                    if (typeof arguments[i] === 'object') {
                        arg += '\n[' + i + '] ';
                        for (key in arguments[0]) {
                            if (hasOwnProp(arguments[0], key)) {
                                arg += key + ': ' + arguments[0][key] + ', ';
                            }
                        }
                        arg = arg.slice(0, -2); // Remove trailing comma and space
                    } else {
                        arg = arguments[i];
                    }
                    args.push(arg);
                }
                warn(
                    msg +
                        '\nArguments: ' +
                        Array.prototype.slice.call(args).join('') +
                        '\n' +
                        new Error().stack
                );
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (hooks.deprecationHandler != null) {
            hooks.deprecationHandler(name, msg);
        }
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    hooks.suppressDeprecationWarnings = false;
    hooks.deprecationHandler = null;

    function isFunction(input) {
        return (
            (typeof Function !== 'undefined' && input instanceof Function) ||
            Object.prototype.toString.call(input) === '[object Function]'
        );
    }

    function set(config) {
        var prop, i;
        for (i in config) {
            if (hasOwnProp(config, i)) {
                prop = config[i];
                if (isFunction(prop)) {
                    this[i] = prop;
                } else {
                    this['_' + i] = prop;
                }
            }
        }
        this._config = config;
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
        // TODO: Remove "ordinalParse" fallback in next major release.
        this._dayOfMonthOrdinalParseLenient = new RegExp(
            (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) +
                '|' +
                /\d{1,2}/.source
        );
    }

    function mergeConfigs(parentConfig, childConfig) {
        var res = extend({}, parentConfig),
            prop;
        for (prop in childConfig) {
            if (hasOwnProp(childConfig, prop)) {
                if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                    res[prop] = {};
                    extend(res[prop], parentConfig[prop]);
                    extend(res[prop], childConfig[prop]);
                } else if (childConfig[prop] != null) {
                    res[prop] = childConfig[prop];
                } else {
                    delete res[prop];
                }
            }
        }
        for (prop in parentConfig) {
            if (
                hasOwnProp(parentConfig, prop) &&
                !hasOwnProp(childConfig, prop) &&
                isObject(parentConfig[prop])
            ) {
                // make sure changes to properties don't modify parent config
                res[prop] = extend({}, res[prop]);
            }
        }
        return res;
    }

    function Locale(config) {
        if (config != null) {
            this.set(config);
        }
    }

    var keys;

    if (Object.keys) {
        keys = Object.keys;
    } else {
        keys = function (obj) {
            var i,
                res = [];
            for (i in obj) {
                if (hasOwnProp(obj, i)) {
                    res.push(i);
                }
            }
            return res;
        };
    }

    var defaultCalendar = {
        sameDay: '[Today at] LT',
        nextDay: '[Tomorrow at] LT',
        nextWeek: 'dddd [at] LT',
        lastDay: '[Yesterday at] LT',
        lastWeek: '[Last] dddd [at] LT',
        sameElse: 'L',
    };

    function calendar(key, mom, now) {
        var output = this._calendar[key] || this._calendar['sameElse'];
        return isFunction(output) ? output.call(mom, now) : output;
    }

    function zeroFill(number, targetLength, forceSign) {
        var absNumber = '' + Math.abs(number),
            zerosToFill = targetLength - absNumber.length,
            sign = number >= 0;
        return (
            (sign ? (forceSign ? '+' : '') : '-') +
            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) +
            absNumber
        );
    }

    var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,
        localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,
        formatFunctions = {},
        formatTokenFunctions = {};

    // token:    'M'
    // padded:   ['MM', 2]
    // ordinal:  'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken(token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function () {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function () {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
                return this.localeData().ordinal(
                    func.apply(this, arguments),
                    token
                );
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens),
            i,
            length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '',
                i;
            for (i = 0; i < length; i++) {
                output += isFunction(array[i])
                    ? array[i].call(mom, format)
                    : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());
        formatFunctions[format] =
            formatFunctions[format] || makeFormatFunction(format);

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(
                localFormattingTokens,
                replaceLongDateFormatTokens
            );
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var defaultLongDateFormat = {
        LTS: 'h:mm:ss A',
        LT: 'h:mm A',
        L: 'MM/DD/YYYY',
        LL: 'MMMM D, YYYY',
        LLL: 'MMMM D, YYYY h:mm A',
        LLLL: 'dddd, MMMM D, YYYY h:mm A',
    };

    function longDateFormat(key) {
        var format = this._longDateFormat[key],
            formatUpper = this._longDateFormat[key.toUpperCase()];

        if (format || !formatUpper) {
            return format;
        }

        this._longDateFormat[key] = formatUpper
            .match(formattingTokens)
            .map(function (tok) {
                if (
                    tok === 'MMMM' ||
                    tok === 'MM' ||
                    tok === 'DD' ||
                    tok === 'dddd'
                ) {
                    return tok.slice(1);
                }
                return tok;
            })
            .join('');

        return this._longDateFormat[key];
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate() {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d',
        defaultDayOfMonthOrdinalParse = /\d{1,2}/;

    function ordinal(number) {
        return this._ordinal.replace('%d', number);
    }

    var defaultRelativeTime = {
        future: 'in %s',
        past: '%s ago',
        s: 'a few seconds',
        ss: '%d seconds',
        m: 'a minute',
        mm: '%d minutes',
        h: 'an hour',
        hh: '%d hours',
        d: 'a day',
        dd: '%d days',
        w: 'a week',
        ww: '%d weeks',
        M: 'a month',
        MM: '%d months',
        y: 'a year',
        yy: '%d years',
    };

    function relativeTime(number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return isFunction(output)
            ? output(number, withoutSuffix, string, isFuture)
            : output.replace(/%d/i, number);
    }

    function pastFuture(diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return isFunction(format) ? format(output) : format.replace(/%s/i, output);
    }

    var aliases = {};

    function addUnitAlias(unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string'
            ? aliases[units] || aliases[units.toLowerCase()]
            : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    var priorities = {};

    function addUnitPriority(unit, priority) {
        priorities[unit] = priority;
    }

    function getPrioritizedUnits(unitsObj) {
        var units = [],
            u;
        for (u in unitsObj) {
            if (hasOwnProp(unitsObj, u)) {
                units.push({ unit: u, priority: priorities[u] });
            }
        }
        units.sort(function (a, b) {
            return a.priority - b.priority;
        });
        return units;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    function absFloor(number) {
        if (number < 0) {
            // -0 -> 0
            return Math.ceil(number) || 0;
        } else {
            return Math.floor(number);
        }
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            value = absFloor(coercedNumber);
        }

        return value;
    }

    function makeGetSet(unit, keepTime) {
        return function (value) {
            if (value != null) {
                set$1(this, unit, value);
                hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get(this, unit);
            }
        };
    }

    function get(mom, unit) {
        return mom.isValid()
            ? mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]()
            : NaN;
    }

    function set$1(mom, unit, value) {
        if (mom.isValid() && !isNaN(value)) {
            if (
                unit === 'FullYear' &&
                isLeapYear(mom.year()) &&
                mom.month() === 1 &&
                mom.date() === 29
            ) {
                value = toInt(value);
                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](
                    value,
                    mom.month(),
                    daysInMonth(value, mom.month())
                );
            } else {
                mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
            }
        }
    }

    // MOMENTS

    function stringGet(units) {
        units = normalizeUnits(units);
        if (isFunction(this[units])) {
            return this[units]();
        }
        return this;
    }

    function stringSet(units, value) {
        if (typeof units === 'object') {
            units = normalizeObjectUnits(units);
            var prioritized = getPrioritizedUnits(units),
                i;
            for (i = 0; i < prioritized.length; i++) {
                this[prioritized[i].unit](units[prioritized[i].unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (isFunction(this[units])) {
                return this[units](value);
            }
        }
        return this;
    }

    var match1 = /\d/, //       0 - 9
        match2 = /\d\d/, //      00 - 99
        match3 = /\d{3}/, //     000 - 999
        match4 = /\d{4}/, //    0000 - 9999
        match6 = /[+-]?\d{6}/, // -999999 - 999999
        match1to2 = /\d\d?/, //       0 - 99
        match3to4 = /\d\d\d\d?/, //     999 - 9999
        match5to6 = /\d\d\d\d\d\d?/, //   99999 - 999999
        match1to3 = /\d{1,3}/, //       0 - 999
        match1to4 = /\d{1,4}/, //       0 - 9999
        match1to6 = /[+-]?\d{1,6}/, // -999999 - 999999
        matchUnsigned = /\d+/, //       0 - inf
        matchSigned = /[+-]?\d+/, //    -inf - inf
        matchOffset = /Z|[+-]\d\d:?\d\d/gi, // +00:00 -00:00 +0000 -0000 or Z
        matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi, // +00 -00 +00:00 -00:00 +0000 -0000 or Z
        matchTimestamp = /[+-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123
        // any word (or two) characters or numbers including two/three word month in arabic.
        // includes scottish gaelic two word and hyphenated months
        matchWord = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i,
        regexes;

    regexes = {};

    function addRegexToken(token, regex, strictRegex) {
        regexes[token] = isFunction(regex)
            ? regex
            : function (isStrict, localeData) {
                  return isStrict && strictRegex ? strictRegex : regex;
              };
    }

    function getParseRegexForToken(token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return regexEscape(
            s
                .replace('\\', '')
                .replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (
                    matched,
                    p1,
                    p2,
                    p3,
                    p4
                ) {
                    return p1 || p2 || p3 || p4;
                })
        );
    }

    function regexEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken(token, callback) {
        var i,
            func = callback;
        if (typeof token === 'string') {
            token = [token];
        }
        if (isNumber(callback)) {
            func = function (input, array) {
                array[callback] = toInt(input);
            };
        }
        for (i = 0; i < token.length; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken(token, callback) {
        addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0,
        MONTH = 1,
        DATE = 2,
        HOUR = 3,
        MINUTE = 4,
        SECOND = 5,
        MILLISECOND = 6,
        WEEK = 7,
        WEEKDAY = 8;

    function mod(n, x) {
        return ((n % x) + x) % x;
    }

    var indexOf;

    if (Array.prototype.indexOf) {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function (o) {
            // I know
            var i;
            for (i = 0; i < this.length; ++i) {
                if (this[i] === o) {
                    return i;
                }
            }
            return -1;
        };
    }

    function daysInMonth(year, month) {
        if (isNaN(year) || isNaN(month)) {
            return NaN;
        }
        var modMonth = mod(month, 12);
        year += (month - modMonth) / 12;
        return modMonth === 1
            ? isLeapYear(year)
                ? 29
                : 28
            : 31 - ((modMonth % 7) % 2);
    }

    // FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function (format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function (format) {
        return this.localeData().months(this, format);
    });

    // ALIASES

    addUnitAlias('month', 'M');

    // PRIORITY

    addUnitPriority('month', 8);

    // PARSING

    addRegexToken('M', match1to2);
    addRegexToken('MM', match1to2, match2);
    addRegexToken('MMM', function (isStrict, locale) {
        return locale.monthsShortRegex(isStrict);
    });
    addRegexToken('MMMM', function (isStrict, locale) {
        return locale.monthsRegex(isStrict);
    });

    addParseToken(['M', 'MM'], function (input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });

    // LOCALES

    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split(
            '_'
        ),
        defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split(
            '_'
        ),
        MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,
        defaultMonthsShortRegex = matchWord,
        defaultMonthsRegex = matchWord;

    function localeMonths(m, format) {
        if (!m) {
            return isArray(this._months)
                ? this._months
                : this._months['standalone'];
        }
        return isArray(this._months)
            ? this._months[m.month()]
            : this._months[
                  (this._months.isFormat || MONTHS_IN_FORMAT).test(format)
                      ? 'format'
                      : 'standalone'
              ][m.month()];
    }

    function localeMonthsShort(m, format) {
        if (!m) {
            return isArray(this._monthsShort)
                ? this._monthsShort
                : this._monthsShort['standalone'];
        }
        return isArray(this._monthsShort)
            ? this._monthsShort[m.month()]
            : this._monthsShort[
                  MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'
              ][m.month()];
    }

    function handleStrictParse(monthName, format, strict) {
        var i,
            ii,
            mom,
            llc = monthName.toLocaleLowerCase();
        if (!this._monthsParse) {
            // this is not used
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
            for (i = 0; i < 12; ++i) {
                mom = createUTC([2000, i]);
                this._shortMonthsParse[i] = this.monthsShort(
                    mom,
                    ''
                ).toLocaleLowerCase();
                this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeMonthsParse(monthName, format, strict) {
        var i, mom, regex;

        if (this._monthsParseExact) {
            return handleStrictParse.call(this, monthName, format, strict);
        }

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        // TODO: add sorting
        // Sorting makes sure if one month (or abbr) is a prefix of another
        // see sorting in computeMonthsParse
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp(
                    '^' + this.months(mom, '').replace('.', '') + '$',
                    'i'
                );
                this._shortMonthsParse[i] = new RegExp(
                    '^' + this.monthsShort(mom, '').replace('.', '') + '$',
                    'i'
                );
            }
            if (!strict && !this._monthsParse[i]) {
                regex =
                    '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (
                strict &&
                format === 'MMMM' &&
                this._longMonthsParse[i].test(monthName)
            ) {
                return i;
            } else if (
                strict &&
                format === 'MMM' &&
                this._shortMonthsParse[i].test(monthName)
            ) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function setMonth(mom, value) {
        var dayOfMonth;

        if (!mom.isValid()) {
            // No op
            return mom;
        }

        if (typeof value === 'string') {
            if (/^\d+$/.test(value)) {
                value = toInt(value);
            } else {
                value = mom.localeData().monthsParse(value);
                // TODO: Another silent failure?
                if (!isNumber(value)) {
                    return mom;
                }
            }
        }

        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth(value) {
        if (value != null) {
            setMonth(this, value);
            hooks.updateOffset(this, true);
            return this;
        } else {
            return get(this, 'Month');
        }
    }

    function getDaysInMonth() {
        return daysInMonth(this.year(), this.month());
    }

    function monthsShortRegex(isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsShortStrictRegex;
            } else {
                return this._monthsShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsShortRegex')) {
                this._monthsShortRegex = defaultMonthsShortRegex;
            }
            return this._monthsShortStrictRegex && isStrict
                ? this._monthsShortStrictRegex
                : this._monthsShortRegex;
        }
    }

    function monthsRegex(isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsStrictRegex;
            } else {
                return this._monthsRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsRegex')) {
                this._monthsRegex = defaultMonthsRegex;
            }
            return this._monthsStrictRegex && isStrict
                ? this._monthsStrictRegex
                : this._monthsRegex;
        }
    }

    function computeMonthsParse() {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var shortPieces = [],
            longPieces = [],
            mixedPieces = [],
            i,
            mom;
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, i]);
            shortPieces.push(this.monthsShort(mom, ''));
            longPieces.push(this.months(mom, ''));
            mixedPieces.push(this.months(mom, ''));
            mixedPieces.push(this.monthsShort(mom, ''));
        }
        // Sorting makes sure if one month (or abbr) is a prefix of another it
        // will match the longer piece.
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 12; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
        }
        for (i = 0; i < 24; i++) {
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._monthsShortRegex = this._monthsRegex;
        this._monthsStrictRegex = new RegExp(
            '^(' + longPieces.join('|') + ')',
            'i'
        );
        this._monthsShortStrictRegex = new RegExp(
            '^(' + shortPieces.join('|') + ')',
            'i'
        );
    }

    // FORMATTING

    addFormatToken('Y', 0, 0, function () {
        var y = this.year();
        return y <= 9999 ? zeroFill(y, 4) : '+' + y;
    });

    addFormatToken(0, ['YY', 2], 0, function () {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY', 4], 0, 'year');
    addFormatToken(0, ['YYYYY', 5], 0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // ALIASES

    addUnitAlias('year', 'y');

    // PRIORITIES

    addUnitPriority('year', 1);

    // PARSING

    addRegexToken('Y', matchSigned);
    addRegexToken('YY', match1to2, match2);
    addRegexToken('YYYY', match1to4, match4);
    addRegexToken('YYYYY', match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YYYY', function (input, array) {
        array[YEAR] =
            input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
    });
    addParseToken('YY', function (input, array) {
        array[YEAR] = hooks.parseTwoDigitYear(input);
    });
    addParseToken('Y', function (input, array) {
        array[YEAR] = parseInt(input, 10);
    });

    // HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    // HOOKS

    hooks.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    // MOMENTS

    var getSetYear = makeGetSet('FullYear', true);

    function getIsLeapYear() {
        return isLeapYear(this.year());
    }

    function createDate(y, m, d, h, M, s, ms) {
        // can't just apply() to create a date:
        // https://stackoverflow.com/q/181348
        var date;
        // the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            date = new Date(y + 400, m, d, h, M, s, ms);
            if (isFinite(date.getFullYear())) {
                date.setFullYear(y);
            }
        } else {
            date = new Date(y, m, d, h, M, s, ms);
        }

        return date;
    }

    function createUTCDate(y) {
        var date, args;
        // the Date.UTC function remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            args = Array.prototype.slice.call(arguments);
            // preserve leap years using a full 400 year cycle, then reset
            args[0] = y + 400;
            date = new Date(Date.UTC.apply(null, args));
            if (isFinite(date.getUTCFullYear())) {
                date.setUTCFullYear(y);
            }
        } else {
            date = new Date(Date.UTC.apply(null, arguments));
        }

        return date;
    }

    // start-of-first-week - start-of-year
    function firstWeekOffset(year, dow, doy) {
        var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
            fwd = 7 + dow - doy,
            // first-week day local weekday -- which local weekday is fwd
            fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

        return -fwdlw + fwd - 1;
    }

    // https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
        var localWeekday = (7 + weekday - dow) % 7,
            weekOffset = firstWeekOffset(year, dow, doy),
            dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
            resYear,
            resDayOfYear;

        if (dayOfYear <= 0) {
            resYear = year - 1;
            resDayOfYear = daysInYear(resYear) + dayOfYear;
        } else if (dayOfYear > daysInYear(year)) {
            resYear = year + 1;
            resDayOfYear = dayOfYear - daysInYear(year);
        } else {
            resYear = year;
            resDayOfYear = dayOfYear;
        }

        return {
            year: resYear,
            dayOfYear: resDayOfYear,
        };
    }

    function weekOfYear(mom, dow, doy) {
        var weekOffset = firstWeekOffset(mom.year(), dow, doy),
            week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
            resWeek,
            resYear;

        if (week < 1) {
            resYear = mom.year() - 1;
            resWeek = week + weeksInYear(resYear, dow, doy);
        } else if (week > weeksInYear(mom.year(), dow, doy)) {
            resWeek = week - weeksInYear(mom.year(), dow, doy);
            resYear = mom.year() + 1;
        } else {
            resYear = mom.year();
            resWeek = week;
        }

        return {
            week: resWeek,
            year: resYear,
        };
    }

    function weeksInYear(year, dow, doy) {
        var weekOffset = firstWeekOffset(year, dow, doy),
            weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
    }

    // FORMATTING

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // ALIASES

    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');

    // PRIORITIES

    addUnitPriority('week', 5);
    addUnitPriority('isoWeek', 5);

    // PARSING

    addRegexToken('w', match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W', match1to2);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (
        input,
        week,
        config,
        token
    ) {
        week[token.substr(0, 1)] = toInt(input);
    });

    // HELPERS

    // LOCALES

    function localeWeek(mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow: 0, // Sunday is the first day of the week.
        doy: 6, // The week that contains Jan 6th is the first week of the year.
    };

    function localeFirstDayOfWeek() {
        return this._week.dow;
    }

    function localeFirstDayOfYear() {
        return this._week.doy;
    }

    // MOMENTS

    function getSetWeek(input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek(input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    // FORMATTING

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function (format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function (format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function (format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

    // ALIASES

    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');

    // PRIORITY
    addUnitPriority('day', 11);
    addUnitPriority('weekday', 11);
    addUnitPriority('isoWeekday', 11);

    // PARSING

    addRegexToken('d', match1to2);
    addRegexToken('e', match1to2);
    addRegexToken('E', match1to2);
    addRegexToken('dd', function (isStrict, locale) {
        return locale.weekdaysMinRegex(isStrict);
    });
    addRegexToken('ddd', function (isStrict, locale) {
        return locale.weekdaysShortRegex(isStrict);
    });
    addRegexToken('dddd', function (isStrict, locale) {
        return locale.weekdaysRegex(isStrict);
    });

    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
        var weekday = config._locale.weekdaysParse(input, token, config._strict);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
        week[token] = toInt(input);
    });

    // HELPERS

    function parseWeekday(input, locale) {
        if (typeof input !== 'string') {
            return input;
        }

        if (!isNaN(input)) {
            return parseInt(input, 10);
        }

        input = locale.weekdaysParse(input);
        if (typeof input === 'number') {
            return input;
        }

        return null;
    }

    function parseIsoWeekday(input, locale) {
        if (typeof input === 'string') {
            return locale.weekdaysParse(input) % 7 || 7;
        }
        return isNaN(input) ? null : input;
    }

    // LOCALES
    function shiftWeekdays(ws, n) {
        return ws.slice(n, 7).concat(ws.slice(0, n));
    }

    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split(
            '_'
        ),
        defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
        defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
        defaultWeekdaysRegex = matchWord,
        defaultWeekdaysShortRegex = matchWord,
        defaultWeekdaysMinRegex = matchWord;

    function localeWeekdays(m, format) {
        var weekdays = isArray(this._weekdays)
            ? this._weekdays
            : this._weekdays[
                  m && m !== true && this._weekdays.isFormat.test(format)
                      ? 'format'
                      : 'standalone'
              ];
        return m === true
            ? shiftWeekdays(weekdays, this._week.dow)
            : m
            ? weekdays[m.day()]
            : weekdays;
    }

    function localeWeekdaysShort(m) {
        return m === true
            ? shiftWeekdays(this._weekdaysShort, this._week.dow)
            : m
            ? this._weekdaysShort[m.day()]
            : this._weekdaysShort;
    }

    function localeWeekdaysMin(m) {
        return m === true
            ? shiftWeekdays(this._weekdaysMin, this._week.dow)
            : m
            ? this._weekdaysMin[m.day()]
            : this._weekdaysMin;
    }

    function handleStrictParse$1(weekdayName, format, strict) {
        var i,
            ii,
            mom,
            llc = weekdayName.toLocaleLowerCase();
        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._minWeekdaysParse = [];

            for (i = 0; i < 7; ++i) {
                mom = createUTC([2000, 1]).day(i);
                this._minWeekdaysParse[i] = this.weekdaysMin(
                    mom,
                    ''
                ).toLocaleLowerCase();
                this._shortWeekdaysParse[i] = this.weekdaysShort(
                    mom,
                    ''
                ).toLocaleLowerCase();
                this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeWeekdaysParse(weekdayName, format, strict) {
        var i, mom, regex;

        if (this._weekdaysParseExact) {
            return handleStrictParse$1.call(this, weekdayName, format, strict);
        }

        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._minWeekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._fullWeekdaysParse = [];
        }

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already

            mom = createUTC([2000, 1]).day(i);
            if (strict && !this._fullWeekdaysParse[i]) {
                this._fullWeekdaysParse[i] = new RegExp(
                    '^' + this.weekdays(mom, '').replace('.', '\\.?') + '$',
                    'i'
                );
                this._shortWeekdaysParse[i] = new RegExp(
                    '^' + this.weekdaysShort(mom, '').replace('.', '\\.?') + '$',
                    'i'
                );
                this._minWeekdaysParse[i] = new RegExp(
                    '^' + this.weekdaysMin(mom, '').replace('.', '\\.?') + '$',
                    'i'
                );
            }
            if (!this._weekdaysParse[i]) {
                regex =
                    '^' +
                    this.weekdays(mom, '') +
                    '|^' +
                    this.weekdaysShort(mom, '') +
                    '|^' +
                    this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (
                strict &&
                format === 'dddd' &&
                this._fullWeekdaysParse[i].test(weekdayName)
            ) {
                return i;
            } else if (
                strict &&
                format === 'ddd' &&
                this._shortWeekdaysParse[i].test(weekdayName)
            ) {
                return i;
            } else if (
                strict &&
                format === 'dd' &&
                this._minWeekdaysParse[i].test(weekdayName)
            ) {
                return i;
            } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function getSetDayOfWeek(input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek(input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek(input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }

        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.

        if (input != null) {
            var weekday = parseIsoWeekday(input, this.localeData());
            return this.day(this.day() % 7 ? weekday : weekday - 7);
        } else {
            return this.day() || 7;
        }
    }

    function weekdaysRegex(isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysStrictRegex;
            } else {
                return this._weekdaysRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                this._weekdaysRegex = defaultWeekdaysRegex;
            }
            return this._weekdaysStrictRegex && isStrict
                ? this._weekdaysStrictRegex
                : this._weekdaysRegex;
        }
    }

    function weekdaysShortRegex(isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysShortStrictRegex;
            } else {
                return this._weekdaysShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysShortRegex')) {
                this._weekdaysShortRegex = defaultWeekdaysShortRegex;
            }
            return this._weekdaysShortStrictRegex && isStrict
                ? this._weekdaysShortStrictRegex
                : this._weekdaysShortRegex;
        }
    }

    function weekdaysMinRegex(isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysMinStrictRegex;
            } else {
                return this._weekdaysMinRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysMinRegex')) {
                this._weekdaysMinRegex = defaultWeekdaysMinRegex;
            }
            return this._weekdaysMinStrictRegex && isStrict
                ? this._weekdaysMinStrictRegex
                : this._weekdaysMinRegex;
        }
    }

    function computeWeekdaysParse() {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var minPieces = [],
            shortPieces = [],
            longPieces = [],
            mixedPieces = [],
            i,
            mom,
            minp,
            shortp,
            longp;
        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already
            mom = createUTC([2000, 1]).day(i);
            minp = regexEscape(this.weekdaysMin(mom, ''));
            shortp = regexEscape(this.weekdaysShort(mom, ''));
            longp = regexEscape(this.weekdays(mom, ''));
            minPieces.push(minp);
            shortPieces.push(shortp);
            longPieces.push(longp);
            mixedPieces.push(minp);
            mixedPieces.push(shortp);
            mixedPieces.push(longp);
        }
        // Sorting makes sure if one weekday (or abbr) is a prefix of another it
        // will match the longer piece.
        minPieces.sort(cmpLenRev);
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);

        this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._weekdaysShortRegex = this._weekdaysRegex;
        this._weekdaysMinRegex = this._weekdaysRegex;

        this._weekdaysStrictRegex = new RegExp(
            '^(' + longPieces.join('|') + ')',
            'i'
        );
        this._weekdaysShortStrictRegex = new RegExp(
            '^(' + shortPieces.join('|') + ')',
            'i'
        );
        this._weekdaysMinStrictRegex = new RegExp(
            '^(' + minPieces.join('|') + ')',
            'i'
        );
    }

    // FORMATTING

    function hFormat() {
        return this.hours() % 12 || 12;
    }

    function kFormat() {
        return this.hours() || 24;
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, hFormat);
    addFormatToken('k', ['kk', 2], 0, kFormat);

    addFormatToken('hmm', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
    });

    addFormatToken('hmmss', 0, 0, function () {
        return (
            '' +
            hFormat.apply(this) +
            zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2)
        );
    });

    addFormatToken('Hmm', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2);
    });

    addFormatToken('Hmmss', 0, 0, function () {
        return (
            '' +
            this.hours() +
            zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2)
        );
    });

    function meridiem(token, lowercase) {
        addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(
                this.hours(),
                this.minutes(),
                lowercase
            );
        });
    }

    meridiem('a', true);
    meridiem('A', false);

    // ALIASES

    addUnitAlias('hour', 'h');

    // PRIORITY
    addUnitPriority('hour', 13);

    // PARSING

    function matchMeridiem(isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a', matchMeridiem);
    addRegexToken('A', matchMeridiem);
    addRegexToken('H', match1to2);
    addRegexToken('h', match1to2);
    addRegexToken('k', match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);
    addRegexToken('kk', match1to2, match2);

    addRegexToken('hmm', match3to4);
    addRegexToken('hmmss', match5to6);
    addRegexToken('Hmm', match3to4);
    addRegexToken('Hmmss', match5to6);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['k', 'kk'], function (input, array, config) {
        var kInput = toInt(input);
        array[HOUR] = kInput === 24 ? 0 : kInput;
    });
    addParseToken(['a', 'A'], function (input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function (input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmmss', function (input, array, config) {
        var pos1 = input.length - 4,
            pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('Hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
    });
    addParseToken('Hmmss', function (input, array, config) {
        var pos1 = input.length - 4,
            pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
    });

    // LOCALES

    function localeIsPM(input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return (input + '').toLowerCase().charAt(0) === 'p';
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i,
        // Setting the hour should keep the time, because the user explicitly
        // specified which hour they want. So trying to maintain the same hour (in
        // a new timezone) makes sense. Adding/subtracting hours does not follow
        // this rule.
        getSetHour = makeGetSet('Hours', true);

    function localeMeridiem(hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }

    var baseConfig = {
        calendar: defaultCalendar,
        longDateFormat: defaultLongDateFormat,
        invalidDate: defaultInvalidDate,
        ordinal: defaultOrdinal,
        dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
        relativeTime: defaultRelativeTime,

        months: defaultLocaleMonths,
        monthsShort: defaultLocaleMonthsShort,

        week: defaultLocaleWeek,

        weekdays: defaultLocaleWeekdays,
        weekdaysMin: defaultLocaleWeekdaysMin,
        weekdaysShort: defaultLocaleWeekdaysShort,

        meridiemParse: defaultLocaleMeridiemParse,
    };

    // internal storage for locale config files
    var locales = {},
        localeFamilies = {},
        globalLocale;

    function commonPrefix(arr1, arr2) {
        var i,
            minl = Math.min(arr1.length, arr2.length);
        for (i = 0; i < minl; i += 1) {
            if (arr1[i] !== arr2[i]) {
                return i;
            }
        }
        return minl;
    }

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0,
            j,
            next,
            locale,
            split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (
                    next &&
                    next.length >= j &&
                    commonPrefix(split, next) >= j - 1
                ) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return globalLocale;
    }

    function loadLocale(name) {
        var oldLocale = null,
            aliasedRequire;
        // TODO: Find a better way to register and load all the locales in Node
        if (
            locales[name] === undefined &&
            'object' !== 'undefined' &&
            module &&
            module.exports
        ) {
            try {
                oldLocale = globalLocale._abbr;
                aliasedRequire = commonjsRequire;
                aliasedRequire('./locale/' + name);
                getSetGlobalLocale(oldLocale);
            } catch (e) {
                // mark as not found to avoid repeating expensive file require call causing high CPU
                // when trying to find en-US, en_US, en-us for every format call
                locales[name] = null; // null means not found
            }
        }
        return locales[name];
    }

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function getSetGlobalLocale(key, values) {
        var data;
        if (key) {
            if (isUndefined(values)) {
                data = getLocale(key);
            } else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            } else {
                if (typeof console !== 'undefined' && console.warn) {
                    //warn user if arguments are passed but the locale could not be set
                    console.warn(
                        'Locale ' + key + ' not found. Did you forget to load it?'
                    );
                }
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale(name, config) {
        if (config !== null) {
            var locale,
                parentConfig = baseConfig;
            config.abbr = name;
            if (locales[name] != null) {
                deprecateSimple(
                    'defineLocaleOverride',
                    'use moment.updateLocale(localeName, config) to change ' +
                        'an existing locale. moment.defineLocale(localeName, ' +
                        'config) should only be used for creating a new locale ' +
                        'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.'
                );
                parentConfig = locales[name]._config;
            } else if (config.parentLocale != null) {
                if (locales[config.parentLocale] != null) {
                    parentConfig = locales[config.parentLocale]._config;
                } else {
                    locale = loadLocale(config.parentLocale);
                    if (locale != null) {
                        parentConfig = locale._config;
                    } else {
                        if (!localeFamilies[config.parentLocale]) {
                            localeFamilies[config.parentLocale] = [];
                        }
                        localeFamilies[config.parentLocale].push({
                            name: name,
                            config: config,
                        });
                        return null;
                    }
                }
            }
            locales[name] = new Locale(mergeConfigs(parentConfig, config));

            if (localeFamilies[name]) {
                localeFamilies[name].forEach(function (x) {
                    defineLocale(x.name, x.config);
                });
            }

            // backwards compat for now: also set the locale
            // make sure we set the locale AFTER all child locales have been
            // created, so we won't end up with the child locale set.
            getSetGlobalLocale(name);

            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    function updateLocale(name, config) {
        if (config != null) {
            var locale,
                tmpLocale,
                parentConfig = baseConfig;

            if (locales[name] != null && locales[name].parentLocale != null) {
                // Update existing child locale in-place to avoid memory-leaks
                locales[name].set(mergeConfigs(locales[name]._config, config));
            } else {
                // MERGE
                tmpLocale = loadLocale(name);
                if (tmpLocale != null) {
                    parentConfig = tmpLocale._config;
                }
                config = mergeConfigs(parentConfig, config);
                if (tmpLocale == null) {
                    // updateLocale is called for creating a new locale
                    // Set abbr so it will have a name (getters return
                    // undefined otherwise).
                    config.abbr = name;
                }
                locale = new Locale(config);
                locale.parentLocale = locales[name];
                locales[name] = locale;
            }

            // backwards compat for now: also set the locale
            getSetGlobalLocale(name);
        } else {
            // pass null for config to unupdate, useful for tests
            if (locales[name] != null) {
                if (locales[name].parentLocale != null) {
                    locales[name] = locales[name].parentLocale;
                    if (name === getSetGlobalLocale()) {
                        getSetGlobalLocale(name);
                    }
                } else if (locales[name] != null) {
                    delete locales[name];
                }
            }
        }
        return locales[name];
    }

    // returns locale data
    function getLocale(key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    function listLocales() {
        return keys(locales);
    }

    function checkOverflow(m) {
        var overflow,
            a = m._a;

        if (a && getParsingFlags(m).overflow === -2) {
            overflow =
                a[MONTH] < 0 || a[MONTH] > 11
                    ? MONTH
                    : a[DATE] < 1 || a[DATE] > daysInMonth(a[YEAR], a[MONTH])
                    ? DATE
                    : a[HOUR] < 0 ||
                      a[HOUR] > 24 ||
                      (a[HOUR] === 24 &&
                          (a[MINUTE] !== 0 ||
                              a[SECOND] !== 0 ||
                              a[MILLISECOND] !== 0))
                    ? HOUR
                    : a[MINUTE] < 0 || a[MINUTE] > 59
                    ? MINUTE
                    : a[SECOND] < 0 || a[SECOND] > 59
                    ? SECOND
                    : a[MILLISECOND] < 0 || a[MILLISECOND] > 999
                    ? MILLISECOND
                    : -1;

            if (
                getParsingFlags(m)._overflowDayOfYear &&
                (overflow < YEAR || overflow > DATE)
            ) {
                overflow = DATE;
            }
            if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
                overflow = WEEK;
            }
            if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
                overflow = WEEKDAY;
            }

            getParsingFlags(m).overflow = overflow;
        }

        return m;
    }

    // iso 8601 regex
    // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
    var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
        basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
        tzRegex = /Z|[+-]\d\d(?::?\d\d)?/,
        isoDates = [
            ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
            ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
            ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
            ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
            ['YYYY-DDD', /\d{4}-\d{3}/],
            ['YYYY-MM', /\d{4}-\d\d/, false],
            ['YYYYYYMMDD', /[+-]\d{10}/],
            ['YYYYMMDD', /\d{8}/],
            ['GGGG[W]WWE', /\d{4}W\d{3}/],
            ['GGGG[W]WW', /\d{4}W\d{2}/, false],
            ['YYYYDDD', /\d{7}/],
            ['YYYYMM', /\d{6}/, false],
            ['YYYY', /\d{4}/, false],
        ],
        // iso time formats and regexes
        isoTimes = [
            ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
            ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
            ['HH:mm:ss', /\d\d:\d\d:\d\d/],
            ['HH:mm', /\d\d:\d\d/],
            ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
            ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
            ['HHmmss', /\d\d\d\d\d\d/],
            ['HHmm', /\d\d\d\d/],
            ['HH', /\d\d/],
        ],
        aspNetJsonRegex = /^\/?Date\((-?\d+)/i,
        // RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
        rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/,
        obsOffsets = {
            UT: 0,
            GMT: 0,
            EDT: -4 * 60,
            EST: -5 * 60,
            CDT: -5 * 60,
            CST: -6 * 60,
            MDT: -6 * 60,
            MST: -7 * 60,
            PDT: -7 * 60,
            PST: -8 * 60,
        };

    // date from iso format
    function configFromISO(config) {
        var i,
            l,
            string = config._i,
            match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
            allowTime,
            dateFormat,
            timeFormat,
            tzFormat;

        if (match) {
            getParsingFlags(config).iso = true;

            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(match[1])) {
                    dateFormat = isoDates[i][0];
                    allowTime = isoDates[i][2] !== false;
                    break;
                }
            }
            if (dateFormat == null) {
                config._isValid = false;
                return;
            }
            if (match[3]) {
                for (i = 0, l = isoTimes.length; i < l; i++) {
                    if (isoTimes[i][1].exec(match[3])) {
                        // match[2] should be 'T' or space
                        timeFormat = (match[2] || ' ') + isoTimes[i][0];
                        break;
                    }
                }
                if (timeFormat == null) {
                    config._isValid = false;
                    return;
                }
            }
            if (!allowTime && timeFormat != null) {
                config._isValid = false;
                return;
            }
            if (match[4]) {
                if (tzRegex.exec(match[4])) {
                    tzFormat = 'Z';
                } else {
                    config._isValid = false;
                    return;
                }
            }
            config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    function extractFromRFC2822Strings(
        yearStr,
        monthStr,
        dayStr,
        hourStr,
        minuteStr,
        secondStr
    ) {
        var result = [
            untruncateYear(yearStr),
            defaultLocaleMonthsShort.indexOf(monthStr),
            parseInt(dayStr, 10),
            parseInt(hourStr, 10),
            parseInt(minuteStr, 10),
        ];

        if (secondStr) {
            result.push(parseInt(secondStr, 10));
        }

        return result;
    }

    function untruncateYear(yearStr) {
        var year = parseInt(yearStr, 10);
        if (year <= 49) {
            return 2000 + year;
        } else if (year <= 999) {
            return 1900 + year;
        }
        return year;
    }

    function preprocessRFC2822(s) {
        // Remove comments and folding whitespace and replace multiple-spaces with a single space
        return s
            .replace(/\([^)]*\)|[\n\t]/g, ' ')
            .replace(/(\s\s+)/g, ' ')
            .replace(/^\s\s*/, '')
            .replace(/\s\s*$/, '');
    }

    function checkWeekday(weekdayStr, parsedInput, config) {
        if (weekdayStr) {
            // TODO: Replace the vanilla JS Date object with an independent day-of-week check.
            var weekdayProvided = defaultLocaleWeekdaysShort.indexOf(weekdayStr),
                weekdayActual = new Date(
                    parsedInput[0],
                    parsedInput[1],
                    parsedInput[2]
                ).getDay();
            if (weekdayProvided !== weekdayActual) {
                getParsingFlags(config).weekdayMismatch = true;
                config._isValid = false;
                return false;
            }
        }
        return true;
    }

    function calculateOffset(obsOffset, militaryOffset, numOffset) {
        if (obsOffset) {
            return obsOffsets[obsOffset];
        } else if (militaryOffset) {
            // the only allowed military tz is Z
            return 0;
        } else {
            var hm = parseInt(numOffset, 10),
                m = hm % 100,
                h = (hm - m) / 100;
            return h * 60 + m;
        }
    }

    // date and time from ref 2822 format
    function configFromRFC2822(config) {
        var match = rfc2822.exec(preprocessRFC2822(config._i)),
            parsedArray;
        if (match) {
            parsedArray = extractFromRFC2822Strings(
                match[4],
                match[3],
                match[2],
                match[5],
                match[6],
                match[7]
            );
            if (!checkWeekday(match[1], parsedArray, config)) {
                return;
            }

            config._a = parsedArray;
            config._tzm = calculateOffset(match[8], match[9], match[10]);

            config._d = createUTCDate.apply(null, config._a);
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);

            getParsingFlags(config).rfc2822 = true;
        } else {
            config._isValid = false;
        }
    }

    // date from 1) ASP.NET, 2) ISO, 3) RFC 2822 formats, or 4) optional fallback if parsing isn't strict
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);
        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
        } else {
            return;
        }

        configFromRFC2822(config);
        if (config._isValid === false) {
            delete config._isValid;
        } else {
            return;
        }

        if (config._strict) {
            config._isValid = false;
        } else {
            // Final attempt, use Input Fallback
            hooks.createFromInputFallback(config);
        }
    }

    hooks.createFromInputFallback = deprecate(
        'value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' +
            'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' +
            'discouraged. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        // hooks is actually the exported moment object
        var nowValue = new Date(hooks.now());
        if (config._useUTC) {
            return [
                nowValue.getUTCFullYear(),
                nowValue.getUTCMonth(),
                nowValue.getUTCDate(),
            ];
        }
        return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray(config) {
        var i,
            date,
            input = [],
            currentDate,
            expectedWeekday,
            yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear != null) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (
                config._dayOfYear > daysInYear(yearToUse) ||
                config._dayOfYear === 0
            ) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] =
                config._a[i] == null ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (
            config._a[HOUR] === 24 &&
            config._a[MINUTE] === 0 &&
            config._a[SECOND] === 0 &&
            config._a[MILLISECOND] === 0
        ) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(
            null,
            input
        );
        expectedWeekday = config._useUTC
            ? config._d.getUTCDay()
            : config._d.getDay();

        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }

        // check for mismatching day of week
        if (
            config._w &&
            typeof config._w.d !== 'undefined' &&
            config._w.d !== expectedWeekday
        ) {
            getParsingFlags(config).weekdayMismatch = true;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow, curWeek;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(
                w.GG,
                config._a[YEAR],
                weekOfYear(createLocal(), 1, 4).year
            );
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
            if (weekday < 1 || weekday > 7) {
                weekdayOverflow = true;
            }
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            curWeek = weekOfYear(createLocal(), dow, doy);

            weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

            // Default to current week.
            week = defaults(w.w, curWeek.week);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < 0 || weekday > 6) {
                    weekdayOverflow = true;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from beginning of week
                weekday = w.e + dow;
                if (w.e < 0 || w.e > 6) {
                    weekdayOverflow = true;
                }
            } else {
                // default to beginning of week
                weekday = dow;
            }
        }
        if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
            getParsingFlags(config)._overflowWeeks = true;
        } else if (weekdayOverflow != null) {
            getParsingFlags(config)._overflowWeekday = true;
        } else {
            temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
            config._a[YEAR] = temp.year;
            config._dayOfYear = temp.dayOfYear;
        }
    }

    // constant that refers to the ISO standard
    hooks.ISO_8601 = function () {};

    // constant that refers to the RFC 2822 form
    hooks.RFC_2822 = function () {};

    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === hooks.ISO_8601) {
            configFromISO(config);
            return;
        }
        if (config._f === hooks.RFC_2822) {
            configFromRFC2822(config);
            return;
        }
        config._a = [];
        getParsingFlags(config).empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i,
            parsedInput,
            tokens,
            token,
            skipped,
            stringLength = string.length,
            totalParsedInputLength = 0,
            era;

        tokens =
            expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) ||
                [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(
                    string.indexOf(parsedInput) + parsedInput.length
                );
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                } else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            } else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver =
            stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (
            config._a[HOUR] <= 12 &&
            getParsingFlags(config).bigHour === true &&
            config._a[HOUR] > 0
        ) {
            getParsingFlags(config).bigHour = undefined;
        }

        getParsingFlags(config).parsedDateParts = config._a.slice(0);
        getParsingFlags(config).meridiem = config._meridiem;
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(
            config._locale,
            config._a[HOUR],
            config._meridiem
        );

        // handle era
        era = getParsingFlags(config).era;
        if (era !== null) {
            config._a[YEAR] = config._locale.erasConvertYear(era, config._a[YEAR]);
        }

        configFromArray(config);
        checkOverflow(config);
    }

    function meridiemFixWrap(locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    // date from string and array of format strings
    function configFromStringAndArray(config) {
        var tempConfig,
            bestMoment,
            scoreToBeat,
            i,
            currentScore,
            validFormatFound,
            bestFormatIsValid = false;

        if (config._f.length === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            validFormatFound = false;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (isValid(tempConfig)) {
                validFormatFound = true;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += getParsingFlags(tempConfig).charsLeftOver;

            //or tokens
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

            getParsingFlags(tempConfig).score = currentScore;

            if (!bestFormatIsValid) {
                if (
                    scoreToBeat == null ||
                    currentScore < scoreToBeat ||
                    validFormatFound
                ) {
                    scoreToBeat = currentScore;
                    bestMoment = tempConfig;
                    if (validFormatFound) {
                        bestFormatIsValid = true;
                    }
                }
            } else {
                if (currentScore < scoreToBeat) {
                    scoreToBeat = currentScore;
                    bestMoment = tempConfig;
                }
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i),
            dayOrDate = i.day === undefined ? i.date : i.day;
        config._a = map(
            [i.year, i.month, dayOrDate, i.hour, i.minute, i.second, i.millisecond],
            function (obj) {
                return obj && parseInt(obj, 10);
            }
        );

        configFromArray(config);
    }

    function createFromConfig(config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function prepareConfig(config) {
        var input = config._i,
            format = config._f;

        config._locale = config._locale || getLocale(config._l);

        if (input === null || (format === undefined && input === '')) {
            return createInvalid({ nullInput: true });
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isDate(input)) {
            config._d = input;
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (format) {
            configFromStringAndFormat(config);
        } else {
            configFromInput(config);
        }

        if (!isValid(config)) {
            config._d = null;
        }

        return config;
    }

    function configFromInput(config) {
        var input = config._i;
        if (isUndefined(input)) {
            config._d = new Date(hooks.now());
        } else if (isDate(input)) {
            config._d = new Date(input.valueOf());
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (isObject(input)) {
            configFromObject(config);
        } else if (isNumber(input)) {
            // from milliseconds
            config._d = new Date(input);
        } else {
            hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC(input, format, locale, strict, isUTC) {
        var c = {};

        if (format === true || format === false) {
            strict = format;
            format = undefined;
        }

        if (locale === true || locale === false) {
            strict = locale;
            locale = undefined;
        }

        if (
            (isObject(input) && isObjectEmpty(input)) ||
            (isArray(input) && input.length === 0)
        ) {
            input = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createFromConfig(c);
    }

    function createLocal(input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate(
            'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
            function () {
                var other = createLocal.apply(null, arguments);
                if (this.isValid() && other.isValid()) {
                    return other < this ? this : other;
                } else {
                    return createInvalid();
                }
            }
        ),
        prototypeMax = deprecate(
            'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
            function () {
                var other = createLocal.apply(null, arguments);
                if (this.isValid() && other.isValid()) {
                    return other > this ? this : other;
                } else {
                    return createInvalid();
                }
            }
        );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (!moments[i].isValid() || moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // TODO: Use [].sort instead?
    function min() {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max() {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    var now = function () {
        return Date.now ? Date.now() : +new Date();
    };

    var ordering = [
        'year',
        'quarter',
        'month',
        'week',
        'day',
        'hour',
        'minute',
        'second',
        'millisecond',
    ];

    function isDurationValid(m) {
        var key,
            unitHasDecimal = false,
            i;
        for (key in m) {
            if (
                hasOwnProp(m, key) &&
                !(
                    indexOf.call(ordering, key) !== -1 &&
                    (m[key] == null || !isNaN(m[key]))
                )
            ) {
                return false;
            }
        }

        for (i = 0; i < ordering.length; ++i) {
            if (m[ordering[i]]) {
                if (unitHasDecimal) {
                    return false; // only allow non-integers for smallest unit
                }
                if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
                    unitHasDecimal = true;
                }
            }
        }

        return true;
    }

    function isValid$1() {
        return this._isValid;
    }

    function createInvalid$1() {
        return createDuration(NaN);
    }

    function Duration(duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || normalizedInput.isoWeek || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        this._isValid = isDurationValid(normalizedInput);

        // representation for dateAddRemove
        this._milliseconds =
            +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days + weeks * 7;
        // It is impossible to translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months + quarters * 3 + years * 12;

        this._data = {};

        this._locale = getLocale();

        this._bubble();
    }

    function isDuration(obj) {
        return obj instanceof Duration;
    }

    function absRound(number) {
        if (number < 0) {
            return Math.round(-1 * number) * -1;
        } else {
            return Math.round(number);
        }
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if (
                (dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))
            ) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    // FORMATTING

    function offset(token, separator) {
        addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset(),
                sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return (
                sign +
                zeroFill(~~(offset / 60), 2) +
                separator +
                zeroFill(~~offset % 60, 2)
            );
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

    // PARSING

    addRegexToken('Z', matchShortOffset);
    addRegexToken('ZZ', matchShortOffset);
    addParseToken(['Z', 'ZZ'], function (input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(matchShortOffset, input);
    });

    // HELPERS

    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(matcher, string) {
        var matches = (string || '').match(matcher),
            chunk,
            parts,
            minutes;

        if (matches === null) {
            return null;
        }

        chunk = matches[matches.length - 1] || [];
        parts = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        minutes = +(parts[1] * 60) + toInt(parts[2]);

        return minutes === 0 ? 0 : parts[0] === '+' ? minutes : -minutes;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff =
                (isMoment(input) || isDate(input)
                    ? input.valueOf()
                    : createLocal(input).valueOf()) - res.valueOf();
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(res._d.valueOf() + diff);
            hooks.updateOffset(res, false);
            return res;
        } else {
            return createLocal(input).local();
        }
    }

    function getDateOffset(m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset());
    }

    // HOOKS

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    hooks.updateOffset = function () {};

    // MOMENTS

    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getSetOffset(input, keepLocalTime, keepMinutes) {
        var offset = this._offset || 0,
            localAdjust;
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(matchShortOffset, input);
                if (input === null) {
                    return this;
                }
            } else if (Math.abs(input) < 16 && !keepMinutes) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    addSubtract(
                        this,
                        createDuration(input - offset, 'm'),
                        1,
                        false
                    );
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone(input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC(keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal(keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset() {
        if (this._tzm != null) {
            this.utcOffset(this._tzm, false, true);
        } else if (typeof this._i === 'string') {
            var tZone = offsetFromString(matchOffset, this._i);
            if (tZone != null) {
                this.utcOffset(tZone);
            } else {
                this.utcOffset(0, true);
            }
        }
        return this;
    }

    function hasAlignedHourOffset(input) {
        if (!this.isValid()) {
            return false;
        }
        input = input ? createLocal(input).utcOffset() : 0;

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime() {
        return (
            this.utcOffset() > this.clone().month(0).utcOffset() ||
            this.utcOffset() > this.clone().month(5).utcOffset()
        );
    }

    function isDaylightSavingTimeShifted() {
        if (!isUndefined(this._isDSTShifted)) {
            return this._isDSTShifted;
        }

        var c = {},
            other;

        copyConfig(c, this);
        c = prepareConfig(c);

        if (c._a) {
            other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
            this._isDSTShifted =
                this.isValid() && compareArrays(c._a, other.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }

        return this._isDSTShifted;
    }

    function isLocal() {
        return this.isValid() ? !this._isUTC : false;
    }

    function isUtcOffset() {
        return this.isValid() ? this._isUTC : false;
    }

    function isUtc() {
        return this.isValid() ? this._isUTC && this._offset === 0 : false;
    }

    // ASP.NET json date format regex
    var aspNetRegex = /^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/,
        // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
        // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
        // and further modified to allow for strings containing both week and day
        isoRegex = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;

    function createDuration(input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms: input._milliseconds,
                d: input._days,
                M: input._months,
            };
        } else if (isNumber(input) || !isNaN(+input)) {
            duration = {};
            if (key) {
                duration[key] = +input;
            } else {
                duration.milliseconds = +input;
            }
        } else if ((match = aspNetRegex.exec(input))) {
            sign = match[1] === '-' ? -1 : 1;
            duration = {
                y: 0,
                d: toInt(match[DATE]) * sign,
                h: toInt(match[HOUR]) * sign,
                m: toInt(match[MINUTE]) * sign,
                s: toInt(match[SECOND]) * sign,
                ms: toInt(absRound(match[MILLISECOND] * 1000)) * sign, // the millisecond decimal point is included in the match
            };
        } else if ((match = isoRegex.exec(input))) {
            sign = match[1] === '-' ? -1 : 1;
            duration = {
                y: parseIso(match[2], sign),
                M: parseIso(match[3], sign),
                w: parseIso(match[4], sign),
                d: parseIso(match[5], sign),
                h: parseIso(match[6], sign),
                m: parseIso(match[7], sign),
                s: parseIso(match[8], sign),
            };
        } else if (duration == null) {
            // checks for null or undefined
            duration = {};
        } else if (
            typeof duration === 'object' &&
            ('from' in duration || 'to' in duration)
        ) {
            diffRes = momentsDifference(
                createLocal(duration.from),
                createLocal(duration.to)
            );

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        if (isDuration(input) && hasOwnProp(input, '_isValid')) {
            ret._isValid = input._isValid;
        }

        return ret;
    }

    createDuration.fn = Duration.prototype;
    createDuration.invalid = createInvalid$1;

    function parseIso(inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = {};

        res.months =
            other.month() - base.month() + (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +base.clone().add(res.months, 'M');

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        if (!(base.isValid() && other.isValid())) {
            return { milliseconds: 0, months: 0 };
        }

        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    // TODO: remove 'name' arg after deprecation is removed
    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(
                    name,
                    'moment().' +
                        name +
                        '(period, number) is deprecated. Please use moment().' +
                        name +
                        '(number, period). ' +
                        'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.'
                );
                tmp = val;
                val = period;
                period = tmp;
            }

            dur = createDuration(val, period);
            addSubtract(this, dur, direction);
            return this;
        };
    }

    function addSubtract(mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = absRound(duration._days),
            months = absRound(duration._months);

        if (!mom.isValid()) {
            // No op
            return;
        }

        updateOffset = updateOffset == null ? true : updateOffset;

        if (months) {
            setMonth(mom, get(mom, 'Month') + months * isAdding);
        }
        if (days) {
            set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
        }
        if (milliseconds) {
            mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
        }
        if (updateOffset) {
            hooks.updateOffset(mom, days || months);
        }
    }

    var add = createAdder(1, 'add'),
        subtract = createAdder(-1, 'subtract');

    function isString(input) {
        return typeof input === 'string' || input instanceof String;
    }

    // type MomentInput = Moment | Date | string | number | (number | string)[] | MomentInputObject | void; // null | undefined
    function isMomentInput(input) {
        return (
            isMoment(input) ||
            isDate(input) ||
            isString(input) ||
            isNumber(input) ||
            isNumberOrStringArray(input) ||
            isMomentInputObject(input) ||
            input === null ||
            input === undefined
        );
    }

    function isMomentInputObject(input) {
        var objectTest = isObject(input) && !isObjectEmpty(input),
            propertyTest = false,
            properties = [
                'years',
                'year',
                'y',
                'months',
                'month',
                'M',
                'days',
                'day',
                'd',
                'dates',
                'date',
                'D',
                'hours',
                'hour',
                'h',
                'minutes',
                'minute',
                'm',
                'seconds',
                'second',
                's',
                'milliseconds',
                'millisecond',
                'ms',
            ],
            i,
            property;

        for (i = 0; i < properties.length; i += 1) {
            property = properties[i];
            propertyTest = propertyTest || hasOwnProp(input, property);
        }

        return objectTest && propertyTest;
    }

    function isNumberOrStringArray(input) {
        var arrayTest = isArray(input),
            dataTypeTest = false;
        if (arrayTest) {
            dataTypeTest =
                input.filter(function (item) {
                    return !isNumber(item) && isString(input);
                }).length === 0;
        }
        return arrayTest && dataTypeTest;
    }

    function isCalendarSpec(input) {
        var objectTest = isObject(input) && !isObjectEmpty(input),
            propertyTest = false,
            properties = [
                'sameDay',
                'nextDay',
                'lastDay',
                'nextWeek',
                'lastWeek',
                'sameElse',
            ],
            i,
            property;

        for (i = 0; i < properties.length; i += 1) {
            property = properties[i];
            propertyTest = propertyTest || hasOwnProp(input, property);
        }

        return objectTest && propertyTest;
    }

    function getCalendarFormat(myMoment, now) {
        var diff = myMoment.diff(now, 'days', true);
        return diff < -6
            ? 'sameElse'
            : diff < -1
            ? 'lastWeek'
            : diff < 0
            ? 'lastDay'
            : diff < 1
            ? 'sameDay'
            : diff < 2
            ? 'nextDay'
            : diff < 7
            ? 'nextWeek'
            : 'sameElse';
    }

    function calendar$1(time, formats) {
        // Support for single parameter, formats only overload to the calendar function
        if (arguments.length === 1) {
            if (!arguments[0]) {
                time = undefined;
                formats = undefined;
            } else if (isMomentInput(arguments[0])) {
                time = arguments[0];
                formats = undefined;
            } else if (isCalendarSpec(arguments[0])) {
                formats = arguments[0];
                time = undefined;
            }
        }
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            format = hooks.calendarFormat(this, sod) || 'sameElse',
            output =
                formats &&
                (isFunction(formats[format])
                    ? formats[format].call(this, now)
                    : formats[format]);

        return this.format(
            output || this.localeData().calendar(format, this, createLocal(now))
        );
    }

    function clone() {
        return new Moment(this);
    }

    function isAfter(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueOf() > localInput.valueOf();
        } else {
            return localInput.valueOf() < this.clone().startOf(units).valueOf();
        }
    }

    function isBefore(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueOf() < localInput.valueOf();
        } else {
            return this.clone().endOf(units).valueOf() < localInput.valueOf();
        }
    }

    function isBetween(from, to, units, inclusivity) {
        var localFrom = isMoment(from) ? from : createLocal(from),
            localTo = isMoment(to) ? to : createLocal(to);
        if (!(this.isValid() && localFrom.isValid() && localTo.isValid())) {
            return false;
        }
        inclusivity = inclusivity || '()';
        return (
            (inclusivity[0] === '('
                ? this.isAfter(localFrom, units)
                : !this.isBefore(localFrom, units)) &&
            (inclusivity[1] === ')'
                ? this.isBefore(localTo, units)
                : !this.isAfter(localTo, units))
        );
    }

    function isSame(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input),
            inputMs;
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units) || 'millisecond';
        if (units === 'millisecond') {
            return this.valueOf() === localInput.valueOf();
        } else {
            inputMs = localInput.valueOf();
            return (
                this.clone().startOf(units).valueOf() <= inputMs &&
                inputMs <= this.clone().endOf(units).valueOf()
            );
        }
    }

    function isSameOrAfter(input, units) {
        return this.isSame(input, units) || this.isAfter(input, units);
    }

    function isSameOrBefore(input, units) {
        return this.isSame(input, units) || this.isBefore(input, units);
    }

    function diff(input, units, asFloat) {
        var that, zoneDelta, output;

        if (!this.isValid()) {
            return NaN;
        }

        that = cloneWithOffset(input, this);

        if (!that.isValid()) {
            return NaN;
        }

        zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

        units = normalizeUnits(units);

        switch (units) {
            case 'year':
                output = monthDiff(this, that) / 12;
                break;
            case 'month':
                output = monthDiff(this, that);
                break;
            case 'quarter':
                output = monthDiff(this, that) / 3;
                break;
            case 'second':
                output = (this - that) / 1e3;
                break; // 1000
            case 'minute':
                output = (this - that) / 6e4;
                break; // 1000 * 60
            case 'hour':
                output = (this - that) / 36e5;
                break; // 1000 * 60 * 60
            case 'day':
                output = (this - that - zoneDelta) / 864e5;
                break; // 1000 * 60 * 60 * 24, negate dst
            case 'week':
                output = (this - that - zoneDelta) / 6048e5;
                break; // 1000 * 60 * 60 * 24 * 7, negate dst
            default:
                output = this - that;
        }

        return asFloat ? output : absFloor(output);
    }

    function monthDiff(a, b) {
        if (a.date() < b.date()) {
            // end-of-month calculations work correct when the start month has more
            // days than the end month.
            return -monthDiff(b, a);
        }
        // difference in months
        var wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2,
            adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        //check for negative zero, return zero if negative zero
        return -(wholeMonthDiff + adjust) || 0;
    }

    hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
    hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

    function toString() {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function toISOString(keepOffset) {
        if (!this.isValid()) {
            return null;
        }
        var utc = keepOffset !== true,
            m = utc ? this.clone().utc() : this;
        if (m.year() < 0 || m.year() > 9999) {
            return formatMoment(
                m,
                utc
                    ? 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]'
                    : 'YYYYYY-MM-DD[T]HH:mm:ss.SSSZ'
            );
        }
        if (isFunction(Date.prototype.toISOString)) {
            // native implementation is ~50x faster, use it when we can
            if (utc) {
                return this.toDate().toISOString();
            } else {
                return new Date(this.valueOf() + this.utcOffset() * 60 * 1000)
                    .toISOString()
                    .replace('Z', formatMoment(m, 'Z'));
            }
        }
        return formatMoment(
            m,
            utc ? 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYY-MM-DD[T]HH:mm:ss.SSSZ'
        );
    }

    /**
     * Return a human readable representation of a moment that can
     * also be evaluated to get a new moment which is the same
     *
     * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
     */
    function inspect() {
        if (!this.isValid()) {
            return 'moment.invalid(/* ' + this._i + ' */)';
        }
        var func = 'moment',
            zone = '',
            prefix,
            year,
            datetime,
            suffix;
        if (!this.isLocal()) {
            func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
            zone = 'Z';
        }
        prefix = '[' + func + '("]';
        year = 0 <= this.year() && this.year() <= 9999 ? 'YYYY' : 'YYYYYY';
        datetime = '-MM-DD[T]HH:mm:ss.SSS';
        suffix = zone + '[")]';

        return this.format(prefix + year + datetime + suffix);
    }

    function format(inputString) {
        if (!inputString) {
            inputString = this.isUtc()
                ? hooks.defaultFormatUtc
                : hooks.defaultFormat;
        }
        var output = formatMoment(this, inputString);
        return this.localeData().postformat(output);
    }

    function from(time, withoutSuffix) {
        if (
            this.isValid() &&
            ((isMoment(time) && time.isValid()) || createLocal(time).isValid())
        ) {
            return createDuration({ to: this, from: time })
                .locale(this.locale())
                .humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function fromNow(withoutSuffix) {
        return this.from(createLocal(), withoutSuffix);
    }

    function to(time, withoutSuffix) {
        if (
            this.isValid() &&
            ((isMoment(time) && time.isValid()) || createLocal(time).isValid())
        ) {
            return createDuration({ from: this, to: time })
                .locale(this.locale())
                .humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function toNow(withoutSuffix) {
        return this.to(createLocal(), withoutSuffix);
    }

    // If passed a locale key, it will set the locale for this
    // instance.  Otherwise, it will return the locale configuration
    // variables for this instance.
    function locale(key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function (key) {
            if (key === undefined) {
                return this.localeData();
            } else {
                return this.locale(key);
            }
        }
    );

    function localeData() {
        return this._locale;
    }

    var MS_PER_SECOND = 1000,
        MS_PER_MINUTE = 60 * MS_PER_SECOND,
        MS_PER_HOUR = 60 * MS_PER_MINUTE,
        MS_PER_400_YEARS = (365 * 400 + 97) * 24 * MS_PER_HOUR;

    // actual modulo - handles negative numbers (for dates before 1970):
    function mod$1(dividend, divisor) {
        return ((dividend % divisor) + divisor) % divisor;
    }

    function localStartOfDate(y, m, d) {
        // the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            return new Date(y + 400, m, d) - MS_PER_400_YEARS;
        } else {
            return new Date(y, m, d).valueOf();
        }
    }

    function utcStartOfDate(y, m, d) {
        // Date.UTC remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0) {
            // preserve leap years using a full 400 year cycle, then reset
            return Date.UTC(y + 400, m, d) - MS_PER_400_YEARS;
        } else {
            return Date.UTC(y, m, d);
        }
    }

    function startOf(units) {
        var time, startOfDate;
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond' || !this.isValid()) {
            return this;
        }

        startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

        switch (units) {
            case 'year':
                time = startOfDate(this.year(), 0, 1);
                break;
            case 'quarter':
                time = startOfDate(
                    this.year(),
                    this.month() - (this.month() % 3),
                    1
                );
                break;
            case 'month':
                time = startOfDate(this.year(), this.month(), 1);
                break;
            case 'week':
                time = startOfDate(
                    this.year(),
                    this.month(),
                    this.date() - this.weekday()
                );
                break;
            case 'isoWeek':
                time = startOfDate(
                    this.year(),
                    this.month(),
                    this.date() - (this.isoWeekday() - 1)
                );
                break;
            case 'day':
            case 'date':
                time = startOfDate(this.year(), this.month(), this.date());
                break;
            case 'hour':
                time = this._d.valueOf();
                time -= mod$1(
                    time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),
                    MS_PER_HOUR
                );
                break;
            case 'minute':
                time = this._d.valueOf();
                time -= mod$1(time, MS_PER_MINUTE);
                break;
            case 'second':
                time = this._d.valueOf();
                time -= mod$1(time, MS_PER_SECOND);
                break;
        }

        this._d.setTime(time);
        hooks.updateOffset(this, true);
        return this;
    }

    function endOf(units) {
        var time, startOfDate;
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond' || !this.isValid()) {
            return this;
        }

        startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

        switch (units) {
            case 'year':
                time = startOfDate(this.year() + 1, 0, 1) - 1;
                break;
            case 'quarter':
                time =
                    startOfDate(
                        this.year(),
                        this.month() - (this.month() % 3) + 3,
                        1
                    ) - 1;
                break;
            case 'month':
                time = startOfDate(this.year(), this.month() + 1, 1) - 1;
                break;
            case 'week':
                time =
                    startOfDate(
                        this.year(),
                        this.month(),
                        this.date() - this.weekday() + 7
                    ) - 1;
                break;
            case 'isoWeek':
                time =
                    startOfDate(
                        this.year(),
                        this.month(),
                        this.date() - (this.isoWeekday() - 1) + 7
                    ) - 1;
                break;
            case 'day':
            case 'date':
                time = startOfDate(this.year(), this.month(), this.date() + 1) - 1;
                break;
            case 'hour':
                time = this._d.valueOf();
                time +=
                    MS_PER_HOUR -
                    mod$1(
                        time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),
                        MS_PER_HOUR
                    ) -
                    1;
                break;
            case 'minute':
                time = this._d.valueOf();
                time += MS_PER_MINUTE - mod$1(time, MS_PER_MINUTE) - 1;
                break;
            case 'second':
                time = this._d.valueOf();
                time += MS_PER_SECOND - mod$1(time, MS_PER_SECOND) - 1;
                break;
        }

        this._d.setTime(time);
        hooks.updateOffset(this, true);
        return this;
    }

    function valueOf() {
        return this._d.valueOf() - (this._offset || 0) * 60000;
    }

    function unix() {
        return Math.floor(this.valueOf() / 1000);
    }

    function toDate() {
        return new Date(this.valueOf());
    }

    function toArray() {
        var m = this;
        return [
            m.year(),
            m.month(),
            m.date(),
            m.hour(),
            m.minute(),
            m.second(),
            m.millisecond(),
        ];
    }

    function toObject() {
        var m = this;
        return {
            years: m.year(),
            months: m.month(),
            date: m.date(),
            hours: m.hours(),
            minutes: m.minutes(),
            seconds: m.seconds(),
            milliseconds: m.milliseconds(),
        };
    }

    function toJSON() {
        // new Date(NaN).toJSON() === null
        return this.isValid() ? this.toISOString() : null;
    }

    function isValid$2() {
        return isValid(this);
    }

    function parsingFlags() {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt() {
        return getParsingFlags(this).overflow;
    }

    function creationData() {
        return {
            input: this._i,
            format: this._f,
            locale: this._locale,
            isUTC: this._isUTC,
            strict: this._strict,
        };
    }

    addFormatToken('N', 0, 0, 'eraAbbr');
    addFormatToken('NN', 0, 0, 'eraAbbr');
    addFormatToken('NNN', 0, 0, 'eraAbbr');
    addFormatToken('NNNN', 0, 0, 'eraName');
    addFormatToken('NNNNN', 0, 0, 'eraNarrow');

    addFormatToken('y', ['y', 1], 'yo', 'eraYear');
    addFormatToken('y', ['yy', 2], 0, 'eraYear');
    addFormatToken('y', ['yyy', 3], 0, 'eraYear');
    addFormatToken('y', ['yyyy', 4], 0, 'eraYear');

    addRegexToken('N', matchEraAbbr);
    addRegexToken('NN', matchEraAbbr);
    addRegexToken('NNN', matchEraAbbr);
    addRegexToken('NNNN', matchEraName);
    addRegexToken('NNNNN', matchEraNarrow);

    addParseToken(['N', 'NN', 'NNN', 'NNNN', 'NNNNN'], function (
        input,
        array,
        config,
        token
    ) {
        var era = config._locale.erasParse(input, token, config._strict);
        if (era) {
            getParsingFlags(config).era = era;
        } else {
            getParsingFlags(config).invalidEra = input;
        }
    });

    addRegexToken('y', matchUnsigned);
    addRegexToken('yy', matchUnsigned);
    addRegexToken('yyy', matchUnsigned);
    addRegexToken('yyyy', matchUnsigned);
    addRegexToken('yo', matchEraYearOrdinal);

    addParseToken(['y', 'yy', 'yyy', 'yyyy'], YEAR);
    addParseToken(['yo'], function (input, array, config, token) {
        var match;
        if (config._locale._eraYearOrdinalRegex) {
            match = input.match(config._locale._eraYearOrdinalRegex);
        }

        if (config._locale.eraYearOrdinalParse) {
            array[YEAR] = config._locale.eraYearOrdinalParse(input, match);
        } else {
            array[YEAR] = parseInt(input, 10);
        }
    });

    function localeEras(m, format) {
        var i,
            l,
            date,
            eras = this._eras || getLocale('en')._eras;
        for (i = 0, l = eras.length; i < l; ++i) {
            switch (typeof eras[i].since) {
                case 'string':
                    // truncate time
                    date = hooks(eras[i].since).startOf('day');
                    eras[i].since = date.valueOf();
                    break;
            }

            switch (typeof eras[i].until) {
                case 'undefined':
                    eras[i].until = +Infinity;
                    break;
                case 'string':
                    // truncate time
                    date = hooks(eras[i].until).startOf('day').valueOf();
                    eras[i].until = date.valueOf();
                    break;
            }
        }
        return eras;
    }

    function localeErasParse(eraName, format, strict) {
        var i,
            l,
            eras = this.eras(),
            name,
            abbr,
            narrow;
        eraName = eraName.toUpperCase();

        for (i = 0, l = eras.length; i < l; ++i) {
            name = eras[i].name.toUpperCase();
            abbr = eras[i].abbr.toUpperCase();
            narrow = eras[i].narrow.toUpperCase();

            if (strict) {
                switch (format) {
                    case 'N':
                    case 'NN':
                    case 'NNN':
                        if (abbr === eraName) {
                            return eras[i];
                        }
                        break;

                    case 'NNNN':
                        if (name === eraName) {
                            return eras[i];
                        }
                        break;

                    case 'NNNNN':
                        if (narrow === eraName) {
                            return eras[i];
                        }
                        break;
                }
            } else if ([name, abbr, narrow].indexOf(eraName) >= 0) {
                return eras[i];
            }
        }
    }

    function localeErasConvertYear(era, year) {
        var dir = era.since <= era.until ? +1 : -1;
        if (year === undefined) {
            return hooks(era.since).year();
        } else {
            return hooks(era.since).year() + (year - era.offset) * dir;
        }
    }

    function getEraName() {
        var i,
            l,
            val,
            eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
            // truncate time
            val = this.clone().startOf('day').valueOf();

            if (eras[i].since <= val && val <= eras[i].until) {
                return eras[i].name;
            }
            if (eras[i].until <= val && val <= eras[i].since) {
                return eras[i].name;
            }
        }

        return '';
    }

    function getEraNarrow() {
        var i,
            l,
            val,
            eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
            // truncate time
            val = this.clone().startOf('day').valueOf();

            if (eras[i].since <= val && val <= eras[i].until) {
                return eras[i].narrow;
            }
            if (eras[i].until <= val && val <= eras[i].since) {
                return eras[i].narrow;
            }
        }

        return '';
    }

    function getEraAbbr() {
        var i,
            l,
            val,
            eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
            // truncate time
            val = this.clone().startOf('day').valueOf();

            if (eras[i].since <= val && val <= eras[i].until) {
                return eras[i].abbr;
            }
            if (eras[i].until <= val && val <= eras[i].since) {
                return eras[i].abbr;
            }
        }

        return '';
    }

    function getEraYear() {
        var i,
            l,
            dir,
            val,
            eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
            dir = eras[i].since <= eras[i].until ? +1 : -1;

            // truncate time
            val = this.clone().startOf('day').valueOf();

            if (
                (eras[i].since <= val && val <= eras[i].until) ||
                (eras[i].until <= val && val <= eras[i].since)
            ) {
                return (
                    (this.year() - hooks(eras[i].since).year()) * dir +
                    eras[i].offset
                );
            }
        }

        return this.year();
    }

    function erasNameRegex(isStrict) {
        if (!hasOwnProp(this, '_erasNameRegex')) {
            computeErasParse.call(this);
        }
        return isStrict ? this._erasNameRegex : this._erasRegex;
    }

    function erasAbbrRegex(isStrict) {
        if (!hasOwnProp(this, '_erasAbbrRegex')) {
            computeErasParse.call(this);
        }
        return isStrict ? this._erasAbbrRegex : this._erasRegex;
    }

    function erasNarrowRegex(isStrict) {
        if (!hasOwnProp(this, '_erasNarrowRegex')) {
            computeErasParse.call(this);
        }
        return isStrict ? this._erasNarrowRegex : this._erasRegex;
    }

    function matchEraAbbr(isStrict, locale) {
        return locale.erasAbbrRegex(isStrict);
    }

    function matchEraName(isStrict, locale) {
        return locale.erasNameRegex(isStrict);
    }

    function matchEraNarrow(isStrict, locale) {
        return locale.erasNarrowRegex(isStrict);
    }

    function matchEraYearOrdinal(isStrict, locale) {
        return locale._eraYearOrdinalRegex || matchUnsigned;
    }

    function computeErasParse() {
        var abbrPieces = [],
            namePieces = [],
            narrowPieces = [],
            mixedPieces = [],
            i,
            l,
            eras = this.eras();

        for (i = 0, l = eras.length; i < l; ++i) {
            namePieces.push(regexEscape(eras[i].name));
            abbrPieces.push(regexEscape(eras[i].abbr));
            narrowPieces.push(regexEscape(eras[i].narrow));

            mixedPieces.push(regexEscape(eras[i].name));
            mixedPieces.push(regexEscape(eras[i].abbr));
            mixedPieces.push(regexEscape(eras[i].narrow));
        }

        this._erasRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._erasNameRegex = new RegExp('^(' + namePieces.join('|') + ')', 'i');
        this._erasAbbrRegex = new RegExp('^(' + abbrPieces.join('|') + ')', 'i');
        this._erasNarrowRegex = new RegExp(
            '^(' + narrowPieces.join('|') + ')',
            'i'
        );
    }

    // FORMATTING

    addFormatToken(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function () {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken(token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg', 'weekYear');
    addWeekYearFormatToken('ggggg', 'weekYear');
    addWeekYearFormatToken('GGGG', 'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // ALIASES

    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');

    // PRIORITY

    addUnitPriority('weekYear', 1);
    addUnitPriority('isoWeekYear', 1);

    // PARSING

    addRegexToken('G', matchSigned);
    addRegexToken('g', matchSigned);
    addRegexToken('GG', match1to2, match2);
    addRegexToken('gg', match1to2, match2);
    addRegexToken('GGGG', match1to4, match4);
    addRegexToken('gggg', match1to4, match4);
    addRegexToken('GGGGG', match1to6, match6);
    addRegexToken('ggggg', match1to6, match6);

    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (
        input,
        week,
        config,
        token
    ) {
        week[token.substr(0, 2)] = toInt(input);
    });

    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
        week[token] = hooks.parseTwoDigitYear(input);
    });

    // MOMENTS

    function getSetWeekYear(input) {
        return getSetWeekYearHelper.call(
            this,
            input,
            this.week(),
            this.weekday(),
            this.localeData()._week.dow,
            this.localeData()._week.doy
        );
    }

    function getSetISOWeekYear(input) {
        return getSetWeekYearHelper.call(
            this,
            input,
            this.isoWeek(),
            this.isoWeekday(),
            1,
            4
        );
    }

    function getISOWeeksInYear() {
        return weeksInYear(this.year(), 1, 4);
    }

    function getISOWeeksInISOWeekYear() {
        return weeksInYear(this.isoWeekYear(), 1, 4);
    }

    function getWeeksInYear() {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    function getWeeksInWeekYear() {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.weekYear(), weekInfo.dow, weekInfo.doy);
    }

    function getSetWeekYearHelper(input, week, weekday, dow, doy) {
        var weeksTarget;
        if (input == null) {
            return weekOfYear(this, dow, doy).year;
        } else {
            weeksTarget = weeksInYear(input, dow, doy);
            if (week > weeksTarget) {
                week = weeksTarget;
            }
            return setWeekAll.call(this, input, week, weekday, dow, doy);
        }
    }

    function setWeekAll(weekYear, week, weekday, dow, doy) {
        var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
            date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

        this.year(date.getUTCFullYear());
        this.month(date.getUTCMonth());
        this.date(date.getUTCDate());
        return this;
    }

    // FORMATTING

    addFormatToken('Q', 0, 'Qo', 'quarter');

    // ALIASES

    addUnitAlias('quarter', 'Q');

    // PRIORITY

    addUnitPriority('quarter', 7);

    // PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function (input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    // MOMENTS

    function getSetQuarter(input) {
        return input == null
            ? Math.ceil((this.month() + 1) / 3)
            : this.month((input - 1) * 3 + (this.month() % 3));
    }

    // FORMATTING

    addFormatToken('D', ['DD', 2], 'Do', 'date');

    // ALIASES

    addUnitAlias('date', 'D');

    // PRIORITY
    addUnitPriority('date', 9);

    // PARSING

    addRegexToken('D', match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function (isStrict, locale) {
        // TODO: Remove "ordinalParse" fallback in next major release.
        return isStrict
            ? locale._dayOfMonthOrdinalParse || locale._ordinalParse
            : locale._dayOfMonthOrdinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function (input, array) {
        array[DATE] = toInt(input.match(match1to2)[0]);
    });

    // MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

    // FORMATTING

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // ALIASES

    addUnitAlias('dayOfYear', 'DDD');

    // PRIORITY
    addUnitPriority('dayOfYear', 4);

    // PARSING

    addRegexToken('DDD', match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
        config._dayOfYear = toInt(input);
    });

    // HELPERS

    // MOMENTS

    function getSetDayOfYear(input) {
        var dayOfYear =
            Math.round(
                (this.clone().startOf('day') - this.clone().startOf('year')) / 864e5
            ) + 1;
        return input == null ? dayOfYear : this.add(input - dayOfYear, 'd');
    }

    // FORMATTING

    addFormatToken('m', ['mm', 2], 0, 'minute');

    // ALIASES

    addUnitAlias('minute', 'm');

    // PRIORITY

    addUnitPriority('minute', 14);

    // PARSING

    addRegexToken('m', match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

    // MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

    // FORMATTING

    addFormatToken('s', ['ss', 2], 0, 'second');

    // ALIASES

    addUnitAlias('second', 's');

    // PRIORITY

    addUnitPriority('second', 15);

    // PARSING

    addRegexToken('s', match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

    // MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

    // FORMATTING

    addFormatToken('S', 0, 0, function () {
        return ~~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function () {
        return ~~(this.millisecond() / 10);
    });

    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
    addFormatToken(0, ['SSSS', 4], 0, function () {
        return this.millisecond() * 10;
    });
    addFormatToken(0, ['SSSSS', 5], 0, function () {
        return this.millisecond() * 100;
    });
    addFormatToken(0, ['SSSSSS', 6], 0, function () {
        return this.millisecond() * 1000;
    });
    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
        return this.millisecond() * 10000;
    });
    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
        return this.millisecond() * 100000;
    });
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
        return this.millisecond() * 1000000;
    });

    // ALIASES

    addUnitAlias('millisecond', 'ms');

    // PRIORITY

    addUnitPriority('millisecond', 16);

    // PARSING

    addRegexToken('S', match1to3, match1);
    addRegexToken('SS', match1to3, match2);
    addRegexToken('SSS', match1to3, match3);

    var token, getSetMillisecond;
    for (token = 'SSSS'; token.length <= 9; token += 'S') {
        addRegexToken(token, matchUnsigned);
    }

    function parseMs(input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    }

    for (token = 'S'; token.length <= 9; token += 'S') {
        addParseToken(token, parseMs);
    }

    getSetMillisecond = makeGetSet('Milliseconds', false);

    // FORMATTING

    addFormatToken('z', 0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    // MOMENTS

    function getZoneAbbr() {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName() {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var proto = Moment.prototype;

    proto.add = add;
    proto.calendar = calendar$1;
    proto.clone = clone;
    proto.diff = diff;
    proto.endOf = endOf;
    proto.format = format;
    proto.from = from;
    proto.fromNow = fromNow;
    proto.to = to;
    proto.toNow = toNow;
    proto.get = stringGet;
    proto.invalidAt = invalidAt;
    proto.isAfter = isAfter;
    proto.isBefore = isBefore;
    proto.isBetween = isBetween;
    proto.isSame = isSame;
    proto.isSameOrAfter = isSameOrAfter;
    proto.isSameOrBefore = isSameOrBefore;
    proto.isValid = isValid$2;
    proto.lang = lang;
    proto.locale = locale;
    proto.localeData = localeData;
    proto.max = prototypeMax;
    proto.min = prototypeMin;
    proto.parsingFlags = parsingFlags;
    proto.set = stringSet;
    proto.startOf = startOf;
    proto.subtract = subtract;
    proto.toArray = toArray;
    proto.toObject = toObject;
    proto.toDate = toDate;
    proto.toISOString = toISOString;
    proto.inspect = inspect;
    if (typeof Symbol !== 'undefined' && Symbol.for != null) {
        proto[Symbol.for('nodejs.util.inspect.custom')] = function () {
            return 'Moment<' + this.format() + '>';
        };
    }
    proto.toJSON = toJSON;
    proto.toString = toString;
    proto.unix = unix;
    proto.valueOf = valueOf;
    proto.creationData = creationData;
    proto.eraName = getEraName;
    proto.eraNarrow = getEraNarrow;
    proto.eraAbbr = getEraAbbr;
    proto.eraYear = getEraYear;
    proto.year = getSetYear;
    proto.isLeapYear = getIsLeapYear;
    proto.weekYear = getSetWeekYear;
    proto.isoWeekYear = getSetISOWeekYear;
    proto.quarter = proto.quarters = getSetQuarter;
    proto.month = getSetMonth;
    proto.daysInMonth = getDaysInMonth;
    proto.week = proto.weeks = getSetWeek;
    proto.isoWeek = proto.isoWeeks = getSetISOWeek;
    proto.weeksInYear = getWeeksInYear;
    proto.weeksInWeekYear = getWeeksInWeekYear;
    proto.isoWeeksInYear = getISOWeeksInYear;
    proto.isoWeeksInISOWeekYear = getISOWeeksInISOWeekYear;
    proto.date = getSetDayOfMonth;
    proto.day = proto.days = getSetDayOfWeek;
    proto.weekday = getSetLocaleDayOfWeek;
    proto.isoWeekday = getSetISODayOfWeek;
    proto.dayOfYear = getSetDayOfYear;
    proto.hour = proto.hours = getSetHour;
    proto.minute = proto.minutes = getSetMinute;
    proto.second = proto.seconds = getSetSecond;
    proto.millisecond = proto.milliseconds = getSetMillisecond;
    proto.utcOffset = getSetOffset;
    proto.utc = setOffsetToUTC;
    proto.local = setOffsetToLocal;
    proto.parseZone = setOffsetToParsedOffset;
    proto.hasAlignedHourOffset = hasAlignedHourOffset;
    proto.isDST = isDaylightSavingTime;
    proto.isLocal = isLocal;
    proto.isUtcOffset = isUtcOffset;
    proto.isUtc = isUtc;
    proto.isUTC = isUtc;
    proto.zoneAbbr = getZoneAbbr;
    proto.zoneName = getZoneName;
    proto.dates = deprecate(
        'dates accessor is deprecated. Use date instead.',
        getSetDayOfMonth
    );
    proto.months = deprecate(
        'months accessor is deprecated. Use month instead',
        getSetMonth
    );
    proto.years = deprecate(
        'years accessor is deprecated. Use year instead',
        getSetYear
    );
    proto.zone = deprecate(
        'moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/',
        getSetZone
    );
    proto.isDSTShifted = deprecate(
        'isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information',
        isDaylightSavingTimeShifted
    );

    function createUnix(input) {
        return createLocal(input * 1000);
    }

    function createInZone() {
        return createLocal.apply(null, arguments).parseZone();
    }

    function preParsePostFormat(string) {
        return string;
    }

    var proto$1 = Locale.prototype;

    proto$1.calendar = calendar;
    proto$1.longDateFormat = longDateFormat;
    proto$1.invalidDate = invalidDate;
    proto$1.ordinal = ordinal;
    proto$1.preparse = preParsePostFormat;
    proto$1.postformat = preParsePostFormat;
    proto$1.relativeTime = relativeTime;
    proto$1.pastFuture = pastFuture;
    proto$1.set = set;
    proto$1.eras = localeEras;
    proto$1.erasParse = localeErasParse;
    proto$1.erasConvertYear = localeErasConvertYear;
    proto$1.erasAbbrRegex = erasAbbrRegex;
    proto$1.erasNameRegex = erasNameRegex;
    proto$1.erasNarrowRegex = erasNarrowRegex;

    proto$1.months = localeMonths;
    proto$1.monthsShort = localeMonthsShort;
    proto$1.monthsParse = localeMonthsParse;
    proto$1.monthsRegex = monthsRegex;
    proto$1.monthsShortRegex = monthsShortRegex;
    proto$1.week = localeWeek;
    proto$1.firstDayOfYear = localeFirstDayOfYear;
    proto$1.firstDayOfWeek = localeFirstDayOfWeek;

    proto$1.weekdays = localeWeekdays;
    proto$1.weekdaysMin = localeWeekdaysMin;
    proto$1.weekdaysShort = localeWeekdaysShort;
    proto$1.weekdaysParse = localeWeekdaysParse;

    proto$1.weekdaysRegex = weekdaysRegex;
    proto$1.weekdaysShortRegex = weekdaysShortRegex;
    proto$1.weekdaysMinRegex = weekdaysMinRegex;

    proto$1.isPM = localeIsPM;
    proto$1.meridiem = localeMeridiem;

    function get$1(format, index, field, setter) {
        var locale = getLocale(),
            utc = createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function listMonthsImpl(format, index, field) {
        if (isNumber(format)) {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return get$1(format, index, field, 'month');
        }

        var i,
            out = [];
        for (i = 0; i < 12; i++) {
            out[i] = get$1(format, i, field, 'month');
        }
        return out;
    }

    // ()
    // (5)
    // (fmt, 5)
    // (fmt)
    // (true)
    // (true, 5)
    // (true, fmt, 5)
    // (true, fmt)
    function listWeekdaysImpl(localeSorted, format, index, field) {
        if (typeof localeSorted === 'boolean') {
            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        } else {
            format = localeSorted;
            index = format;
            localeSorted = false;

            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';
        }

        var locale = getLocale(),
            shift = localeSorted ? locale._week.dow : 0,
            i,
            out = [];

        if (index != null) {
            return get$1(format, (index + shift) % 7, field, 'day');
        }

        for (i = 0; i < 7; i++) {
            out[i] = get$1(format, (i + shift) % 7, field, 'day');
        }
        return out;
    }

    function listMonths(format, index) {
        return listMonthsImpl(format, index, 'months');
    }

    function listMonthsShort(format, index) {
        return listMonthsImpl(format, index, 'monthsShort');
    }

    function listWeekdays(localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
    }

    function listWeekdaysShort(localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
    }

    function listWeekdaysMin(localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
    }

    getSetGlobalLocale('en', {
        eras: [
            {
                since: '0001-01-01',
                until: +Infinity,
                offset: 1,
                name: 'Anno Domini',
                narrow: 'AD',
                abbr: 'AD',
            },
            {
                since: '0000-12-31',
                until: -Infinity,
                offset: 1,
                name: 'Before Christ',
                narrow: 'BC',
                abbr: 'BC',
            },
        ],
        dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal: function (number) {
            var b = number % 10,
                output =
                    toInt((number % 100) / 10) === 1
                        ? 'th'
                        : b === 1
                        ? 'st'
                        : b === 2
                        ? 'nd'
                        : b === 3
                        ? 'rd'
                        : 'th';
            return number + output;
        },
    });

    // Side effect imports

    hooks.lang = deprecate(
        'moment.lang is deprecated. Use moment.locale instead.',
        getSetGlobalLocale
    );
    hooks.langData = deprecate(
        'moment.langData is deprecated. Use moment.localeData instead.',
        getLocale
    );

    var mathAbs = Math.abs;

    function abs() {
        var data = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days = mathAbs(this._days);
        this._months = mathAbs(this._months);

        data.milliseconds = mathAbs(data.milliseconds);
        data.seconds = mathAbs(data.seconds);
        data.minutes = mathAbs(data.minutes);
        data.hours = mathAbs(data.hours);
        data.months = mathAbs(data.months);
        data.years = mathAbs(data.years);

        return this;
    }

    function addSubtract$1(duration, input, value, direction) {
        var other = createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days += direction * other._days;
        duration._months += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function add$1(input, value) {
        return addSubtract$1(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function subtract$1(input, value) {
        return addSubtract$1(this, input, value, -1);
    }

    function absCeil(number) {
        if (number < 0) {
            return Math.floor(number);
        } else {
            return Math.ceil(number);
        }
    }

    function bubble() {
        var milliseconds = this._milliseconds,
            days = this._days,
            months = this._months,
            data = this._data,
            seconds,
            minutes,
            hours,
            years,
            monthsFromDays;

        // if we have a mix of positive and negative values, bubble down first
        // check: https://github.com/moment/moment/issues/2166
        if (
            !(
                (milliseconds >= 0 && days >= 0 && months >= 0) ||
                (milliseconds <= 0 && days <= 0 && months <= 0)
            )
        ) {
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
            days = 0;
            months = 0;
        }

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds = absFloor(milliseconds / 1000);
        data.seconds = seconds % 60;

        minutes = absFloor(seconds / 60);
        data.minutes = minutes % 60;

        hours = absFloor(minutes / 60);
        data.hours = hours % 24;

        days += absFloor(hours / 24);

        // convert days to months
        monthsFromDays = absFloor(daysToMonths(days));
        months += monthsFromDays;
        days -= absCeil(monthsToDays(monthsFromDays));

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        data.days = days;
        data.months = months;
        data.years = years;

        return this;
    }

    function daysToMonths(days) {
        // 400 years have 146097 days (taking into account leap year rules)
        // 400 years have 12 months === 4800
        return (days * 4800) / 146097;
    }

    function monthsToDays(months) {
        // the reverse of daysToMonths
        return (months * 146097) / 4800;
    }

    function as(units) {
        if (!this.isValid()) {
            return NaN;
        }
        var days,
            months,
            milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'quarter' || units === 'year') {
            days = this._days + milliseconds / 864e5;
            months = this._months + daysToMonths(days);
            switch (units) {
                case 'month':
                    return months;
                case 'quarter':
                    return months / 3;
                case 'year':
                    return months / 12;
            }
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(monthsToDays(this._months));
            switch (units) {
                case 'week':
                    return days / 7 + milliseconds / 6048e5;
                case 'day':
                    return days + milliseconds / 864e5;
                case 'hour':
                    return days * 24 + milliseconds / 36e5;
                case 'minute':
                    return days * 1440 + milliseconds / 6e4;
                case 'second':
                    return days * 86400 + milliseconds / 1000;
                // Math.floor prevents floating point math errors here
                case 'millisecond':
                    return Math.floor(days * 864e5) + milliseconds;
                default:
                    throw new Error('Unknown unit ' + units);
            }
        }
    }

    // TODO: Use this.as('ms')?
    function valueOf$1() {
        if (!this.isValid()) {
            return NaN;
        }
        return (
            this._milliseconds +
            this._days * 864e5 +
            (this._months % 12) * 2592e6 +
            toInt(this._months / 12) * 31536e6
        );
    }

    function makeAs(alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms'),
        asSeconds = makeAs('s'),
        asMinutes = makeAs('m'),
        asHours = makeAs('h'),
        asDays = makeAs('d'),
        asWeeks = makeAs('w'),
        asMonths = makeAs('M'),
        asQuarters = makeAs('Q'),
        asYears = makeAs('y');

    function clone$1() {
        return createDuration(this);
    }

    function get$2(units) {
        units = normalizeUnits(units);
        return this.isValid() ? this[units + 's']() : NaN;
    }

    function makeGetter(name) {
        return function () {
            return this.isValid() ? this._data[name] : NaN;
        };
    }

    var milliseconds = makeGetter('milliseconds'),
        seconds = makeGetter('seconds'),
        minutes = makeGetter('minutes'),
        hours = makeGetter('hours'),
        days = makeGetter('days'),
        months = makeGetter('months'),
        years = makeGetter('years');

    function weeks() {
        return absFloor(this.days() / 7);
    }

    var round = Math.round,
        thresholds = {
            ss: 44, // a few seconds to seconds
            s: 45, // seconds to minute
            m: 45, // minutes to hour
            h: 22, // hours to day
            d: 26, // days to month/week
            w: null, // weeks to month
            M: 11, // months to year
        };

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function relativeTime$1(posNegDuration, withoutSuffix, thresholds, locale) {
        var duration = createDuration(posNegDuration).abs(),
            seconds = round(duration.as('s')),
            minutes = round(duration.as('m')),
            hours = round(duration.as('h')),
            days = round(duration.as('d')),
            months = round(duration.as('M')),
            weeks = round(duration.as('w')),
            years = round(duration.as('y')),
            a =
                (seconds <= thresholds.ss && ['s', seconds]) ||
                (seconds < thresholds.s && ['ss', seconds]) ||
                (minutes <= 1 && ['m']) ||
                (minutes < thresholds.m && ['mm', minutes]) ||
                (hours <= 1 && ['h']) ||
                (hours < thresholds.h && ['hh', hours]) ||
                (days <= 1 && ['d']) ||
                (days < thresholds.d && ['dd', days]);

        if (thresholds.w != null) {
            a =
                a ||
                (weeks <= 1 && ['w']) ||
                (weeks < thresholds.w && ['ww', weeks]);
        }
        a = a ||
            (months <= 1 && ['M']) ||
            (months < thresholds.M && ['MM', months]) ||
            (years <= 1 && ['y']) || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    // This function allows you to set the rounding function for relative time strings
    function getSetRelativeTimeRounding(roundingFunction) {
        if (roundingFunction === undefined) {
            return round;
        }
        if (typeof roundingFunction === 'function') {
            round = roundingFunction;
            return true;
        }
        return false;
    }

    // This function allows you to set a threshold for relative time strings
    function getSetRelativeTimeThreshold(threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        if (threshold === 's') {
            thresholds.ss = limit - 1;
        }
        return true;
    }

    function humanize(argWithSuffix, argThresholds) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }

        var withSuffix = false,
            th = thresholds,
            locale,
            output;

        if (typeof argWithSuffix === 'object') {
            argThresholds = argWithSuffix;
            argWithSuffix = false;
        }
        if (typeof argWithSuffix === 'boolean') {
            withSuffix = argWithSuffix;
        }
        if (typeof argThresholds === 'object') {
            th = Object.assign({}, thresholds, argThresholds);
            if (argThresholds.s != null && argThresholds.ss == null) {
                th.ss = argThresholds.s - 1;
            }
        }

        locale = this.localeData();
        output = relativeTime$1(this, !withSuffix, th, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var abs$1 = Math.abs;

    function sign(x) {
        return (x > 0) - (x < 0) || +x;
    }

    function toISOString$1() {
        // for ISO strings we do not use the normal bubbling rules:
        //  * milliseconds bubble up until they become hours
        //  * days do not bubble at all
        //  * months bubble up until they become years
        // This is because there is no context-free conversion between hours and days
        // (think of clock changes)
        // and also not between days and months (28-31 days per month)
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }

        var seconds = abs$1(this._milliseconds) / 1000,
            days = abs$1(this._days),
            months = abs$1(this._months),
            minutes,
            hours,
            years,
            s,
            total = this.asSeconds(),
            totalSign,
            ymSign,
            daysSign,
            hmsSign;

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        // 3600 seconds -> 60 minutes -> 1 hour
        minutes = absFloor(seconds / 60);
        hours = absFloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        s = seconds ? seconds.toFixed(3).replace(/\.?0+$/, '') : '';

        totalSign = total < 0 ? '-' : '';
        ymSign = sign(this._months) !== sign(total) ? '-' : '';
        daysSign = sign(this._days) !== sign(total) ? '-' : '';
        hmsSign = sign(this._milliseconds) !== sign(total) ? '-' : '';

        return (
            totalSign +
            'P' +
            (years ? ymSign + years + 'Y' : '') +
            (months ? ymSign + months + 'M' : '') +
            (days ? daysSign + days + 'D' : '') +
            (hours || minutes || seconds ? 'T' : '') +
            (hours ? hmsSign + hours + 'H' : '') +
            (minutes ? hmsSign + minutes + 'M' : '') +
            (seconds ? hmsSign + s + 'S' : '')
        );
    }

    var proto$2 = Duration.prototype;

    proto$2.isValid = isValid$1;
    proto$2.abs = abs;
    proto$2.add = add$1;
    proto$2.subtract = subtract$1;
    proto$2.as = as;
    proto$2.asMilliseconds = asMilliseconds;
    proto$2.asSeconds = asSeconds;
    proto$2.asMinutes = asMinutes;
    proto$2.asHours = asHours;
    proto$2.asDays = asDays;
    proto$2.asWeeks = asWeeks;
    proto$2.asMonths = asMonths;
    proto$2.asQuarters = asQuarters;
    proto$2.asYears = asYears;
    proto$2.valueOf = valueOf$1;
    proto$2._bubble = bubble;
    proto$2.clone = clone$1;
    proto$2.get = get$2;
    proto$2.milliseconds = milliseconds;
    proto$2.seconds = seconds;
    proto$2.minutes = minutes;
    proto$2.hours = hours;
    proto$2.days = days;
    proto$2.weeks = weeks;
    proto$2.months = months;
    proto$2.years = years;
    proto$2.humanize = humanize;
    proto$2.toISOString = toISOString$1;
    proto$2.toString = toISOString$1;
    proto$2.toJSON = toISOString$1;
    proto$2.locale = locale;
    proto$2.localeData = localeData;

    proto$2.toIsoString = deprecate(
        'toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)',
        toISOString$1
    );
    proto$2.lang = lang;

    // FORMATTING

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

    // PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function (input, array, config) {
        config._d = new Date(parseFloat(input) * 1000);
    });
    addParseToken('x', function (input, array, config) {
        config._d = new Date(toInt(input));
    });

    //! moment.js

    hooks.version = '2.29.1';

    setHookCallback(createLocal);

    hooks.fn = proto;
    hooks.min = min;
    hooks.max = max;
    hooks.now = now;
    hooks.utc = createUTC;
    hooks.unix = createUnix;
    hooks.months = listMonths;
    hooks.isDate = isDate;
    hooks.locale = getSetGlobalLocale;
    hooks.invalid = createInvalid;
    hooks.duration = createDuration;
    hooks.isMoment = isMoment;
    hooks.weekdays = listWeekdays;
    hooks.parseZone = createInZone;
    hooks.localeData = getLocale;
    hooks.isDuration = isDuration;
    hooks.monthsShort = listMonthsShort;
    hooks.weekdaysMin = listWeekdaysMin;
    hooks.defineLocale = defineLocale;
    hooks.updateLocale = updateLocale;
    hooks.locales = listLocales;
    hooks.weekdaysShort = listWeekdaysShort;
    hooks.normalizeUnits = normalizeUnits;
    hooks.relativeTimeRounding = getSetRelativeTimeRounding;
    hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
    hooks.calendarFormat = getCalendarFormat;
    hooks.prototype = proto;

    // currently HTML5 input type only supports 24-hour formats
    hooks.HTML5_FMT = {
        DATETIME_LOCAL: 'YYYY-MM-DDTHH:mm', // <input type="datetime-local" />
        DATETIME_LOCAL_SECONDS: 'YYYY-MM-DDTHH:mm:ss', // <input type="datetime-local" step="1" />
        DATETIME_LOCAL_MS: 'YYYY-MM-DDTHH:mm:ss.SSS', // <input type="datetime-local" step="0.001" />
        DATE: 'YYYY-MM-DD', // <input type="date" />
        TIME: 'HH:mm', // <input type="time" />
        TIME_SECONDS: 'HH:mm:ss', // <input type="time" step="1" />
        TIME_MS: 'HH:mm:ss.SSS', // <input type="time" step="0.001" />
        WEEK: 'GGGG-[W]WW', // <input type="week" />
        MONTH: 'YYYY-MM', // <input type="month" />
    };

    return hooks;

})));
});

class MomentDateRegex {
    replace(input) {
        //A regex to capture multiple matches, each with a target group ({date:YYMMDD}) and date group (YYMMDD)
        const dateRegex = DATE_REGEX;
        const customFolderString = input;
        //Iterate through the matches to collect them in a single array
        const matches = [];
        let match;
        while (match = dateRegex.exec(customFolderString)) {
            matches.push(match);
        }
        //Return the custom folder setting value if no dates are found
        if (!matches || matches.length === 0) {
            return input;
        }
        const now = new Date();
        //Transform date matches into moment formatted dates
        const formattedDates = matches.map(m => {
            //Default to YYYYMMDDHHmm if {{date}} is used
            const dateFormat = m.groups.date === '' ? DEFAULT_DATE_FORMAT : m.groups.date;
            return [m.groups.target,
                this.getMoment(now, dateFormat)];
        });
        //Check to see if any date formatting is needed. If not return the unformatted setting text.
        let output = customFolderString;
        formattedDates.forEach(fd => {
            output = output.replace(fd[0], fd[1]);
        });
        return output;
    }
    getMoment(now, dateFormat) {
        if (window.moment) {
            return window
                .moment(now)
                .format(dateFormat);
        }
        else {
            return moment(now).format(dateFormat);
        }
    }
}

class DayPlannerSettingsTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.momentDateRegex = new MomentDateRegex();
        this.plugin = plugin;
    }
    display() {
        const { containerEl } = this;
        containerEl.empty();
        new obsidian.Setting(containerEl)
            .setName('Day Planner Mode')
            .setDesc(this.modeDescriptionContent())
            .addDropdown(dropDown => dropDown
            .addOption(DayPlannerMode[DayPlannerMode.File], "File mode")
            .addOption(DayPlannerMode[DayPlannerMode.Command], "Command mode")
            .setValue(DayPlannerMode[this.plugin.settings.mode] || DayPlannerMode.File.toString())
            .onChange((value) => {
            this.plugin.settings.mode = DayPlannerMode[value];
            this.plugin.saveData(this.plugin.settings);
        }));
        new obsidian.Setting(containerEl)
            .setName('Complete past planner items')
            .setDesc('The plugin will automatically mark checkboxes for tasks and breaks in the past as complete')
            .addToggle(toggle => toggle
            .setValue(this.plugin.settings.completePastItems)
            .onChange((value) => {
            this.plugin.settings.completePastItems = value;
            this.plugin.saveData(this.plugin.settings);
        }));
        new obsidian.Setting(containerEl)
            .setName('Mermaid Gantt')
            .setDesc('Include a mermaid gantt chart generated for the day planner')
            .addToggle(toggle => toggle
            .setValue(this.plugin.settings.mermaid)
            .onChange((value) => {
            this.plugin.settings.mermaid = value;
            this.plugin.saveData(this.plugin.settings);
        }));
        new obsidian.Setting(containerEl)
            .setName('Status Bar - Circular Progress')
            .setDesc('Display a circular progress bar in the status bar')
            .addToggle(toggle => toggle
            .setValue(this.plugin.settings.circularProgress)
            .onChange((value) => {
            this.plugin.settings.circularProgress = value;
            this.plugin.saveData(this.plugin.settings);
        }));
        new obsidian.Setting(containerEl)
            .setName('Status Bar - Now and Next')
            .setDesc('Display now and next tasks in the status bar')
            .addToggle(toggle => toggle
            .setValue(this.plugin.settings.nowAndNextInStatusBar)
            .onChange((value) => {
            this.plugin.settings.nowAndNextInStatusBar = value;
            this.plugin.saveData(this.plugin.settings);
        }));
        new obsidian.Setting(containerEl)
            .setName('Task Notification')
            .setDesc('Display a notification when a new task is started')
            .addToggle(toggle => toggle
            .setValue(this.plugin.settings.showTaskNotification)
            .onChange((value) => {
            this.plugin.settings.showTaskNotification = value;
            this.plugin.saveData(this.plugin.settings);
        }));
        new obsidian.Setting(containerEl)
            .setName('Timeline Zoom Level')
            .setDesc('The zoom level to display the timeline. The larger, the higher the zoom level.')
            .addSlider(slider => {
            var _a;
            return slider
                .setLimits(1, 5, 1)
                .setValue((_a = this.plugin.settings.timelineZoomLevel) !== null && _a !== void 0 ? _a : 4)
                .setDynamicTooltip()
                .onChange((value) => {
                this.plugin.settings.timelineZoomLevel = value;
                this.plugin.saveData(this.plugin.settings);
            });
        });
    }
    modeDescriptionContent() {
        const descEl = document.createDocumentFragment();
        descEl.appendText('Choose between 2 modes to use the Day Planner plugin:');
        descEl.appendChild(document.createElement('br'));
        descEl.appendChild(document.createElement('strong')).appendText('File mode');
        descEl.appendChild(document.createElement('br'));
        descEl.appendText('Plugin automatically generates day planner notes for each day within a Day Planners folder.');
        descEl.appendChild(document.createElement('br'));
        descEl.appendChild(document.createElement('strong')).appendText('Command mode');
        descEl.appendChild(document.createElement('br'));
        descEl.appendText('Command used to insert a Day Planner for today within the current note.');
        descEl.appendChild(document.createElement('br'));
        this.addDocsLink(descEl);
        return descEl;
    }
    addDocsLink(descEl) {
        const a = document.createElement('a');
        a.href = 'https://github.com/lynchjames/obsidian-day-plannerhttps://github.com/lynchjames/obsidian-day-planner/blob/main/README.md';
        a.text = 'plugin README';
        a.target = '_blank';
        descEl.appendChild(a);
        descEl.appendChild(document.createElement('br'));
    }
}

class StatusBar {
    constructor(settings, statusBar, workspace, progress, plannerMD, file) {
        this.settings = settings;
        this.statusBar = statusBar;
        this.workspace = workspace;
        this.progress = progress;
        this.plannerMD = plannerMD;
        this.file = file;
    }
    initStatusBar() {
        if (this.statusBarAdded) {
            return;
        }
        let status = this.statusBar.createEl('div', { cls: 'day-planner', title: 'View the Day Planner', prepend: true });
        this.setupCard(status);
        this.statusBarText = status.createEl('span', { cls: ['status-bar-item-segment', 'day-planner-status-bar-text'] });
        this.setupCircularProgressBar(status);
        this.setupHorizontalProgressBar(status);
        this.nextText = status.createEl('span', { cls: ['status-bar-item-segment', 'day-planner-status-bar-text'] });
        this.setupStatusBarEvents(status);
        this.statusBarAdded = true;
    }
    setupStatusBarEvents(status) {
        status.onClickEvent(async (ev) => {
            try {
                const fileName = this.file.todayPlannerFilePath();
                this.workspace.openLinkText(fileName, '', false);
            }
            catch (error) {
                console.log(error);
            }
        });
        status.on('mouseenter', '.day-planner', () => {
            this.show(this.card);
        });
        status.on('mouseleave', '.day-planner', () => {
            this.hide(this.card);
        });
    }
    async refreshStatusBar(planSummary) {
        if (!planSummary.empty && !planSummary.invalid) {
            this.updateProgress(planSummary.current, planSummary.next);
        }
        else {
            this.hide(this.statusBar);
        }
        return planSummary;
    }
    hide(el) {
        if (el) {
            el.style.display = 'none';
        }
    }
    show(el) {
        if (el) {
            el.style.display = 'block';
        }
    }
    hideProgress() {
        this.hide(this.statusBarProgress);
        this.hide(this.circle);
        this.hide(this.nextText);
    }
    updateProgress(current, next) {
        if (!current || !next || current.isEnd) {
            this.hideProgress();
            this.statusBarText.innerText = 'ALL DONE!';
            return;
        }
        const { percentageComplete, minsUntilNext } = this.progress.getProgress(current, next);
        if (this.settings.circularProgress) {
            this.hide(this.statusBarProgress);
            this.progressCircle(percentageComplete, current);
        }
        else {
            this.hide(this.circle);
            this.progressBar(percentageComplete, current);
        }
        this.statusText(minsUntilNext, current, next, percentageComplete);
    }
    progressBar(percentageComplete, current) {
        if (current.isBreak) {
            this.statusBarCurrentProgress.addClass('green');
        }
        else {
            this.statusBarCurrentProgress.removeClass('green');
        }
        this.statusBarCurrentProgress.style.width = `${percentageComplete}%`;
        this.show(this.statusBarProgress);
    }
    progressCircle(percentageComplete, current) {
        if (current.isBreak) {
            this.circle.addClass('green');
        }
        else {
            this.circle.removeClass('green');
        }
        this.circle.setAttr('data-value', percentageComplete.toFixed(0));
        this.show(this.circle);
    }
    statusText(minsUntilNext, current, next, percentageComplete) {
        minsUntilNext = minsUntilNext === '0' ? '1' : minsUntilNext;
        const minsText = `${minsUntilNext} min${minsUntilNext === '1' ? '' : 's'}`;
        if (this.settings.nowAndNextInStatusBar) {
            this.statusBarText.innerHTML = `<strong>Now</strong> ${current.rawTime} ${this.ellipsis(current.displayText(), 10)}`;
            this.nextText.innerHTML = `<strong>Next</strong> ${next.rawTime} ${this.ellipsis(next.displayText(), 10)}`;
            this.show(this.nextText);
        }
        else {
            this.hide(this.nextText);
            const statusText = (current.isBreak ? `Break for ${minsText}` : `${minsText} left`);
            this.statusBarText.innerText = statusText;
        }
        const currentTaskStatus = `Current Task (${percentageComplete.toFixed(0)}% complete)`;
        const currentTaskTimeAndText = `${current.rawTime} ${current.displayText()}`;
        const nextTask = `Next Task (in ${minsText})`;
        const nextTaskTimeAndText = `${next.rawTime} ${next.displayText()}`;
        this.cardCurrent.innerHTML = `<strong>${currentTaskStatus}</strong><br> ${currentTaskTimeAndText}`;
        this.cardNext.innerHTML = `<strong>${nextTask}</strong><br> ${nextTaskTimeAndText}`;
        this.taskNotification(current, currentTaskTimeAndText, nextTask, nextTaskTimeAndText);
    }
    taskNotification(current, currentTaskTimeAndText, nextTask, nextTaskText) {
        if (this.settings.showTaskNotification && this.currentTime !== undefined && this.currentTime !== current.time.toUTCString()) {
            new Notification(`Task started, ${currentTaskTimeAndText}`, { body: `${nextTask}: ${nextTaskText}`, requireInteraction: true });
        }
        this.currentTime = current.time.toUTCString();
    }
    ellipsis(input, limit) {
        if (input.length <= limit) {
            return input;
        }
        return input.substring(0, limit) + '...';
    }
    setupHorizontalProgressBar(status) {
        this.statusBarProgress = status.createEl('div', { cls: ['status-bar-item-segment', 'day-planner-progress-bar'] });
        this.statusBarProgress.style.display = 'none';
        this.statusBarCurrentProgress = this.statusBarProgress.createEl('div', { cls: 'day-planner-progress-value' });
    }
    setupCircularProgressBar(status) {
        this.circle = status.createEl('div', { cls: ['status-bar-item-segment', 'progress-pie day-planner'] });
    }
    setupCard(status) {
        this.card = status.createEl('div', { cls: 'day-planner-status-card' });
        this.cardCurrent = this.card.createEl('span');
        this.card.createEl('br');
        this.card.createEl('br');
        this.cardNext = this.card.createEl('span');
        this.card.createEl('div', { cls: 'arrow-down' });
    }
}

const moment$1 = window.moment;
class Progress {
    getProgress(current, next) {
        try {
            const now = new Date();
            const nowMoment = moment$1(now);
            const currentMoment = moment$1(current.time);
            const nextMoment = moment$1(next.time);
            const diff = moment$1.duration(nextMoment.diff(currentMoment));
            const fromStart = moment$1.duration(nowMoment.diff(currentMoment));
            const untilNext = moment$1.duration(nextMoment.diff(nowMoment));
            let percentageComplete = (fromStart.asMinutes() / diff.asMinutes()) * 100;
            const minsUntilNext = untilNext.asMinutes().toFixed(0);
            return { percentageComplete, minsUntilNext };
        }
        catch (error) {
            console.log(error);
        }
    }
    progressMarkdown(current, next) {
        try {
            const { percentageComplete } = this.getProgress(current, next);
            const completeCount = Math.floor(20 * (percentageComplete / 100));
            return new Array(completeCount).join('->') + new Array(20 - completeCount).join('_ ');
        }
        catch (error) {
            console.log(error);
        }
    }
}

const moment$2 = window.moment;
const mermmaidEscapedCharacters = [
    { key: ';', replacement: '#59;' },
    { key: ':', replacement: '#58;' },
    { key: '#', replacement: '#35;' },
    //HACK to re-introduce partially replaced replacements!
    { key: '#35;59;', replacement: '#59;' },
];
class PlannerMermaid {
    constructor(progress) {
        this.progress = progress;
    }
    generate(planSummary) {
        const { tasks, breaks } = this.generateEntries(planSummary.validItems());
        return this.mermaidTemplate(tasks, breaks);
    }
    generateEntries(items) {
        const tasks = [];
        const breaks = [];
        items.forEach((item, i) => {
            const next = items[i + 1];
            const mins = this.minuteInterval(item, next);
            const text = `    ${this.escape(item.displayText())}     :${item.rawTime.replace(':', '-')}${mins}`;
            if (item.isBreak) {
                breaks.push(text);
            }
            else {
                tasks.push(text);
            }
        });
        return { tasks, breaks };
    }
    minuteInterval(item, next) {
        if (next === undefined) {
            return ', 0mm';
        }
        const currentMoment = moment$2(item.time);
        const nextMoment = moment$2(next.time);
        const untilNext = Math.floor(moment$2.duration(nextMoment.diff(currentMoment)).asMinutes());
        return ', ' + untilNext + 'mm';
    }
    escape(input) {
        mermmaidEscapedCharacters.forEach(mec => {
            input = input.replace(mec.key, mec.replacement);
        });
        return input;
    }
    mermaidTemplate(tasks, breaks) {
        return `
\`\`\`mermaid
gantt
    dateFormat  HH-mm
    axisFormat %H:%M
    section Tasks
${tasks.join('\n')}
    section Breaks
${breaks.join('\n')}
\`\`\`
`;
    }
}

class PlannerMarkdown {
    constructor(workspace, settings, file, parser, progress) {
        this.workspace = workspace;
        this.settings = settings;
        this.file = file;
        this.parser = parser;
        this.progress = progress;
        this.mermaid = new PlannerMermaid(this.progress);
        this.noteForDateQuery = new NoteForDateQuery();
    }
    async insertPlanner() {
        const filePath = this.file.todayPlannerFilePath();
        const fileContents = await (await this.file.getFileContents(filePath)).split('\n');
        const view = this.workspace.activeLeaf.view;
        const currentLine = view.sourceMode.cmEditor.getCursor().line;
        const insertResult = [...fileContents.slice(0, currentLine), ...DAY_PLANNER_DEFAULT_CONTENT.split('\n'), ...fileContents.slice(currentLine)];
        this.file.updateFile(filePath, insertResult.join('\n'));
    }
    async parseDayPlanner() {
        try {
            const filePath = this.file.todayPlannerFilePath();
            const fileContent = await (await this.file.getFileContents(filePath)).split('\n');
            const { dayPlannerContents } = this.getPlannerSegment(fileContent);
            const planData = await this.parser.parseMarkdown(dayPlannerContents);
            return planData;
        }
        catch (error) {
            console.log(error);
        }
    }
    async updateDayPlannerMarkdown(planSummary) {
        if ((this.dayPlannerLastEdit + 6000) > new Date().getTime()) {
            return;
        }
        try {
            const filePath = this.file.todayPlannerFilePath();
            const fileContents = await (await this.file.getFileContents(filePath));
            const fileContentsArr = fileContents.split('\n');
            const { startLine, endLine } = this.getPlannerSegment(fileContentsArr);
            planSummary.calculate();
            if (planSummary.empty) {
                return;
            }
            const results = planSummary.items.map((item, i) => {
                let result = '';
                if (item === planSummary.current) {
                    result = item.isEnd ? this.updateItemCompletion(item, true) : this.currentItemText(planSummary);
                }
                else if (item.isUnMatched) {
                    result = item.raw;
                }
                else {
                    result = this.updateItemCompletion(item, item.isPast);
                }
                return result;
            });
            const mermaidResult = this.settings.mermaid ? this.mermaid.generate(planSummary).split('\n') : [];
            const newFileContentsArr = fileContentsArr.slice(0, startLine).concat(mermaidResult).concat(results).concat(fileContentsArr.slice(endLine));
            const newFileContents = newFileContentsArr.join('\n');
            if (fileContents !== newFileContents) {
                this.file.updateFile(filePath, newFileContents);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    getPlannerSegment(fileContents) {
        let startLine = -1;
        let endLine = 0;
        for (let i = 0; i < fileContents.length; i++) {
            const dpc = fileContents[i];
            if (dpc.contains('# Day Planner')) {
                startLine = i + 1;
            }
            if (dpc === '---' && startLine >= 0) {
                endLine = i - 1;
                break;
            }
        }
        const dayPlannerContents = fileContents.slice(startLine, endLine);
        return { startLine, endLine, dayPlannerContents };
    }
    updateItemCompletion(item, complete) {
        let check = this.check(complete);
        //Override to use current (user inputted) state if plugin setting is enabled
        if (!this.settings.completePastItems) {
            check = this.check(item.isCompleted);
        }
        return `- [${check}] ${item.rawTime} ${item.displayText()}`;
    }
    check(check) {
        return check ? 'x' : ' ';
    }
    currentItemText(planSummary) {
        try {
            const current = planSummary.current;
            const next = planSummary.next;
            const progressMarkdown = `> ||${current.rawTime}||${this.progress.progressMarkdown(current, next)}||${next.rawTime}||`;
            let replacementItem = `\n**Current Task**\n\n${progressMarkdown}\n\n${this.updateItemCompletion(current, false)}`;
            return replacementItem;
        }
        catch (error) {
            console.log(error);
        }
    }
    checkIsDayPlannerEditing() {
        const activeLeaf = this.workspace.activeLeaf;
        if (!activeLeaf) {
            return;
        }
        const viewState = activeLeaf.view.getState();
        if (viewState.file === this.file.todayPlannerFilePath()) {
            this.dayPlannerLastEdit = new Date().getTime();
        }
    }
}

class DayPlannerFile {
    constructor(vault, settings) {
        this.vault = vault;
        this.settings = settings;
        this.momentDateRegex = new MomentDateRegex();
        this.noteForDateQuery = new NoteForDateQuery();
    }
    hasTodayNote() {
        return this.settings.mode === DayPlannerMode.File || this.noteForDateQuery.exists(this.settings.notesToDates);
    }
    todayPlannerFilePath() {
        var _a;
        if (this.settings.mode === DayPlannerMode.Command) {
            return this.noteForDateQuery.active(this.settings.notesToDates).notePath;
        }
        const fileName = this.todayPlannerFileName();
        return `${(_a = this.settings.customFolder) !== null && _a !== void 0 ? _a : 'Day Planners'}/${fileName}`;
    }
    todayPlannerFileName() {
        return this.momentDateRegex.replace(DAY_PLANNER_FILENAME);
    }
    async prepareFile() {
        try {
            if (this.settings.mode === DayPlannerMode.File) {
                await this.createFolderIfNotExists(this.settings.customFolder);
                await this.createFileIfNotExists(this.todayPlannerFilePath());
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async createFolderIfNotExists(path) {
        try {
            const normalizedPath = this.normalizePath(path);
            const folderExists = await this.vault.adapter.exists(normalizedPath, false);
            if (!folderExists) {
                await this.vault.createFolder(normalizedPath);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async createFileIfNotExists(fileName) {
        try {
            const normalizedFileName = this.normalizePath(fileName);
            if (!await this.vault.adapter.exists(normalizedFileName, false)) {
                await this.vault.create(normalizedFileName, DAY_PLANNER_DEFAULT_CONTENT);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async getFileContents(fileName) {
        this.prepareFile();
        try {
            return await this.vault.adapter.read(fileName);
        }
        catch (error) {
            console.log(error);
        }
    }
    async updateFile(fileName, fileContents) {
        this.prepareFile();
        try {
            return await this.vault.adapter.write(this.normalizePath(fileName), fileContents);
        }
        catch (error) {
            console.log(error);
        }
    }
    normalizePath(path) {
        // Always use forward slash
        path = path.replace(/\\/g, '/');
        // Strip start/end slash
        while (path.startsWith('/') && path !== '/') {
            path = path.substr(1);
        }
        while (path.endsWith('/') && path !== '/') {
            path = path.substr(0, path.length - 1);
        }
        // Use / for root
        if (path === '') {
            path = '/';
        }
        path = path
            // Replace non-breaking spaces with regular spaces
            .replace('\u00A0', ' ')
            // Normalize unicode to NFC form
            .normalize('NFC');
        return path;
    }
}

const moment$3 = window.moment;
class PlanSummaryData {
    constructor(items) {
        this.empty = items.length < 1;
        this.invalid = false;
        this.items = items;
        this.past = [];
    }
    calculate() {
        try {
            const now = new Date();
            const validItems = this.validItems();
            if (validItems.length === 0) {
                this.empty = true;
                return;
            }
            validItems.forEach((item, i) => {
                const next = validItems[i + 1];
                if (item.time < now && (item.isEnd || (next && now < next.time))) {
                    this.current = item;
                    this.next = item.isEnd ? null : next;
                }
                else if (item.time < now) {
                    item.isPast = true;
                    this.past.push(item);
                }
                if (next) {
                    const untilNext = moment$3.duration(moment$3(next.time).diff(moment$3(item.time))).asMinutes();
                    item.durationMins = untilNext;
                }
            });
        }
        catch (error) {
            console.log(error);
        }
    }
    validItems() {
        return this.items.filter(item => !item.isUnMatched);
    }
}
class PlanItem {
    constructor(matchIndex, charIndex, isCompleted, isBreak, isEnd, isUnMatched, time, rawTime, text, raw) {
        this.matchIndex = matchIndex;
        this.charIndex = charIndex;
        this.isCompleted = isCompleted;
        this.isBreak = isBreak;
        this.isEnd = isEnd;
        this.isUnMatched = isUnMatched;
        this.time = time;
        this.rawTime = rawTime;
        this.text = text;
        this.raw = raw;
    }
    displayText() {
        if (this.isBreak) {
            return 'BREAK';
        }
        if (this.isEnd) {
            return 'END';
        }
        return this.text;
    }
}

class Parser {
    constructor(vault) {
        this.vault = vault;
    }
    async parseMarkdown(fileContent) {
        const parsed = this.parse(fileContent.join('\n'));
        const transformed = this.transform(parsed);
        return new PlanSummaryData(transformed);
    }
    parse(input) {
        try {
            const matches = [];
            let match;
            while (match = PLAN_PARSER_REGEX.exec(input)) {
                matches.push(match);
            }
            return matches;
        }
        catch (error) {
            console.log(error);
        }
    }
    transform(regexMatches) {
        const results = regexMatches.map((value, index) => {
            var _a;
            try {
                const isUnmatched = value.groups.unmatched !== undefined;
                if (isUnmatched) {
                    const unMatchedText = value[0];
                    return new PlanItem(index, value.index, false, false, false, true, undefined, undefined, unMatchedText, unMatchedText);
                }
                const isCompleted = this.matchValue(value.groups.completion, 'x');
                const isBreak = this.matchValue(value.groups.break, 'break');
                const isEnd = this.matchValue(value.groups.end, 'end');
                const time = new Date();
                time.setHours(parseInt(value.groups.hours));
                time.setMinutes(parseInt(value.groups.minutes));
                time.setSeconds(0);
                return new PlanItem(index, value.index, isCompleted, isBreak, isEnd, false, time, `${value.groups.hours.padStart(2, '0')}:${value.groups.minutes}`, (_a = value.groups.text) === null || _a === void 0 ? void 0 : _a.trim(), value[0]);
            }
            catch (error) {
                console.log(error);
            }
        });
        return results;
    }
    matchValue(input, match) {
        return (input === null || input === void 0 ? void 0 : input.trim().toLocaleLowerCase()) === match;
    }
}

function noop() { }
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function is_empty(obj) {
    return Object.keys(obj).length === 0;
}

function append(target, node) {
    target.appendChild(node);
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    node.parentNode.removeChild(node);
}
function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
        if (iterations[i])
            iterations[i].d(detaching);
    }
}
function element(name) {
    return document.createElement(name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function empty() {
    return text('');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
function children(element) {
    return Array.from(element.childNodes);
}
function set_data(text, data) {
    data = '' + data;
    if (text.wholeText !== data)
        text.data = data;
}
function set_style(node, key, value, important) {
    node.style.setProperty(key, value, important ? 'important' : '');
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error('Function called outside component initialization');
    return current_component;
}
function onDestroy(fn) {
    get_current_component().$$.on_destroy.push(fn);
}

const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
let flushing = false;
const seen_callbacks = new Set();
function flush() {
    if (flushing)
        return;
    flushing = true;
    do {
        // first, call beforeUpdate functions
        // and update components
        for (let i = 0; i < dirty_components.length; i += 1) {
            const component = dirty_components[i];
            set_current_component(component);
            update(component.$$);
        }
        set_current_component(null);
        dirty_components.length = 0;
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
                callback();
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
    flushing = false;
    seen_callbacks.clear();
}
function update($$) {
    if ($$.fragment !== null) {
        $$.update();
        run_all($$.before_update);
        const dirty = $$.dirty;
        $$.dirty = [-1];
        $$.fragment && $$.fragment.p($$.ctx, dirty);
        $$.after_update.forEach(add_render_callback);
    }
}
const outroing = new Set();
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function mount_component(component, target, anchor) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    // onMount happens before the initial afterUpdate
    add_render_callback(() => {
        const new_on_destroy = on_mount.map(run).filter(is_function);
        if (on_destroy) {
            on_destroy.push(...new_on_destroy);
        }
        else {
            // Edge case - component was destroyed immediately,
            // most likely as a result of a binding initialising
            run_all(new_on_destroy);
        }
        component.$$.on_mount = [];
    });
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        run_all($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        $$.on_destroy = $$.fragment = null;
        $$.ctx = [];
    }
}
function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
}
function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const prop_values = options.props || {};
    const $$ = component.$$ = {
        fragment: null,
        ctx: null,
        // state
        props,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        before_update: [],
        after_update: [],
        context: new Map(parent_component ? parent_component.$$.context : []),
        // everything else
        callbacks: blank_object(),
        dirty,
        skip_bound: false
    };
    let ready = false;
    $$.ctx = instance
        ? instance(component, prop_values, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if (!$$.skip_bound && $$.bound[i])
                    $$.bound[i](value);
                if (ready)
                    make_dirty(component, i);
            }
            return ret;
        })
        : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            const nodes = children(options.target);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(nodes);
            nodes.forEach(detach);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor);
        flush();
    }
    set_current_component(parent_component);
}
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
    }
    $on(type, callback) {
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set($$props) {
        if (this.$$set && !is_empty($$props)) {
            this.$$.skip_bound = true;
            this.$$set($$props);
            this.$$.skip_bound = false;
        }
    }
}

const subscriber_queue = [];
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */
function writable(value, start = noop) {
    let stop;
    const subscribers = [];
    function set(new_value) {
        if (safe_not_equal(value, new_value)) {
            value = new_value;
            if (stop) { // store is ready
                const run_queue = !subscriber_queue.length;
                for (let i = 0; i < subscribers.length; i += 1) {
                    const s = subscribers[i];
                    s[1]();
                    subscriber_queue.push(s, value);
                }
                if (run_queue) {
                    for (let i = 0; i < subscriber_queue.length; i += 2) {
                        subscriber_queue[i][0](subscriber_queue[i + 1]);
                    }
                    subscriber_queue.length = 0;
                }
            }
        }
    }
    function update(fn) {
        set(fn(value));
    }
    function subscribe(run, invalidate = noop) {
        const subscriber = [run, invalidate];
        subscribers.push(subscriber);
        if (subscribers.length === 1) {
            stop = start(set) || noop;
        }
        run(value);
        return () => {
            const index = subscribers.indexOf(subscriber);
            if (index !== -1) {
                subscribers.splice(index, 1);
            }
            if (subscribers.length === 0) {
                stop();
                stop = null;
            }
        };
    }
    return { set, update, subscribe };
}

const planSummary = writable(new PlanSummaryData([]));
const nowPosition = writable(0);
const now = writable(new Date());
const zoomLevel = writable(4);

/* src/timeline.svelte generated by Svelte v3.29.7 */

function add_css() {
	var style = element("style");
	style.id = "svelte-4nsrdz-style";
	style.textContent = "#day-planner-timeline-container.svelte-4nsrdz.svelte-4nsrdz{position:relative;height:1440px;--skobeloff:#006466ff;--midnight-green-eagle-green:#065a60ff;--midnight-green-eagle-green-2:#0b525bff;--midnight-green-eagle-green-3:#144552ff;--charcoal:#1b3a4bff;--prussian-blue:#212f45ff;--space-cadet:#272640ff;--dark-purple:#312244ff;--russian-violet:#3e1f47ff;--russian-violet-2:#4d194dff}.aside.svelte-4nsrdz.svelte-4nsrdz{position:absolute;top:-1px;left:0;width:65px;height:100%;background-repeat:repeat-y;opacity:80%}.aside-x5.svelte-4nsrdz.svelte-4nsrdz{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAEsCAYAAADHIkNEAAAAAXNSR0IArs4c6QAAAFBlWElmTU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAFqADAAQAAAABAAABLAAAAAAuMW7GAAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgpMwidZAAAAsElEQVR4Ae3ZMQoAIAgFUL3/ocsO0GBLFE9wESJ8jj8jYlQrAgQIECBAgAABAgQIECBAgAABAgQIECBAgACBbwWyNutGQuuNIkCAAAECBAgQIECAAAECBAgQIECAAAECBAgQeEbgJBLaLScq2smYEyBAgAABAgQIECBAgAABAgQIECBAgAABAgSuCpxEQqKfqyfzOQECBAgQIECAAAECBAgQIECAAAECBAgQIECgKzABwWUEBHBCyqYAAAAASUVORK5CYII=)}.aside-x4.svelte-4nsrdz.svelte-4nsrdz{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAADwCAYAAAAEqZSkAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAeGVYSWZNTQAqAAAACAAEARIAAwAAAAEAAQAAARoABQAAAAEAAAA+ARsABQAAAAEAAABGh2kABAAAAAEAAABOAAAAAAAAAEgAAAABAAAASAAAAAEAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAFqADAAQAAAABAAAA8AAAAABUK6+SAAAACXBIWXMAAAsTAAALEwEAmpwYAAACMWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8ZXhpZjpDb2xvclNwYWNlPjE8L2V4aWY6Q29sb3JTcGFjZT4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjIyPC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjMwMDwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgrL2/xqAAAA2klEQVR4Ae3bMQqEMBBA0QT2Bh7G+5d2e5G9wRZruliM6CCBsE8QQghxeOUHaynlvb/zPHUf9TXPuCYlQIAAAQIECBAgQIAAAQIECBAg8N8CLegtNwk+V863i7crB7sza7cev8y0ze/4MX2RAAECBAgQIECAAAECBAgQIECAAIEmkGmbkdyheWbaZnTxmOaZaZvRxJpnJGOfAAECBAgQIECAAAECBAgQIECAwEMCmbZ5aJjRHJm2OaZhnk189590DTPStE+AAAECBAgQIECAAAECBAgQIEBgVoEfgLcJ4JWKwMAAAAAASUVORK5CYII=)}.aside-x3.svelte-4nsrdz.svelte-4nsrdz{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAC0CAYAAACQYNzeAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAeGVYSWZNTQAqAAAACAAEARIAAwAAAAEAAQAAARoABQAAAAEAAAA+ARsABQAAAAEAAABGh2kABAAAAAEAAABOAAAAAAAAAEgAAAABAAAASAAAAAEAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAFqADAAQAAAABAAAAtAAAAAD5WFEbAAAACXBIWXMAAAsTAAALEwEAmpwYAAACMWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8ZXhpZjpDb2xvclNwYWNlPjE8L2V4aWY6Q29sb3JTcGFjZT4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjIyPC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjMwMDwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgrL2/xqAAAA6UlEQVRoBe3XQQrCQAwF0Bb0Hr2heB4v14MIOtmli8GmlFHhBQbimA7h7f48TdOjnf+pua16/Z91bUqAAAECBAgQIECAAAECHwQi58Wp1KsyfPpsbLsUX133zF/a0G3PYJq5p358GxSxdaWelWGzBAgQIECAAAECBAgQIDBUIHJenDNqTHiPbZcz1m1vrPmdIyE9f5/7MeE9KKohPW+Ze+E9a+gJECBAgAABAgQIECDwHYHIeXEqNSaM9zaKbZfen537tXO/uT4S0seE8c2a6UdQVEO6MJ4AtQQIECBAgAABAgQIECDwqwJv9lMMWDcoNMAAAAAASUVORK5CYII=)}.aside-x2.svelte-4nsrdz.svelte-4nsrdz{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAB4CAYAAAD2SgIRAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAeGVYSWZNTQAqAAAACAAEARIAAwAAAAEAAQAAARoABQAAAAEAAAA+ARsABQAAAAEAAABGh2kABAAAAAEAAABOAAAAAAAAAEgAAAABAAAASAAAAAEAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAFqADAAQAAAABAAAAeAAAAADVvVTBAAAACXBIWXMAAAsTAAALEwEAmpwYAAACMWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8ZXhpZjpDb2xvclNwYWNlPjE8L2V4aWY6Q29sb3JTcGFjZT4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjIyPC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjMwMDwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgrL2/xqAAAAt0lEQVRoBe3YMQqAMAyF4VYUD+Ii7p7JK7t4EkVsnOoSEtql+AuC2GdIPxxCYwhhS3c7V0ytju20S6cIIIAAAggg8EcBGVh658YvZ75uXDqenSV3S14YFkswy5gKZ3keEUAAAQQQQACBnwnI7NZV2vNdqY5eRjqe9Ih59ciTMm2u+YuC50/hgjr6p0Ix6BHz6mlOEkQAAQQQQAABBBwCMrBwtvmCcbbp+G+IIoAAAggggAACCDgFHqn/Cpqy3VM1AAAAAElFTkSuQmCC)}.aside-x1.svelte-4nsrdz.svelte-4nsrdz{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAA8CAYAAABig0prAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAeGVYSWZNTQAqAAAACAAEARIAAwAAAAEAAQAAARoABQAAAAEAAAA+ARsABQAAAAEAAABGh2kABAAAAAEAAABOAAAAAAAAAEgAAAABAAAASAAAAAEAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAFqADAAQAAAABAAAAPAAAAAB4zqpIAAAACXBIWXMAAAsTAAALEwEAmpwYAAACMWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8ZXhpZjpDb2xvclNwYWNlPjE8L2V4aWY6Q29sb3JTcGFjZT4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjIyPC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjMwMDwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgrL2/xqAAAArElEQVRYCe2VSwqAMAxEW3WjK3eCHsT7H0bBQ/jp7LqokIQirUyhUMIkJA8y9c65Ndx6jg+tdvW0y05J4CcEsHmtcpZTqc8rR8eLsuQm0cOAeomwGA1Q4GrOrRFTSwIkkCCArWsScUvosiSpc9DxrM5KJ+xxGLY5xIHi3xbbfBuKdvpGhnESqJ8AvGJSjnFI9LDNUSKMNKLCkT7v0/LnffO35Z2T1UiABAol8ACZ6QleECm8BQAAAABJRU5ErkJggg==)}.aside__line.svelte-4nsrdz.svelte-4nsrdz{position:absolute;left:65px;transform:translateX(-50%);width:4px;height:100%;background:var(--text-accent)}.filled.svelte-4nsrdz.svelte-4nsrdz{transform-origin:top center;z-index:1;animation:scaleDown 1s ease-in-out;animation-fill-mode:forwards}.filled__line__completed.svelte-4nsrdz.svelte-4nsrdz{position:absolute;top:0;left:0;width:100%}.events.svelte-4nsrdz.svelte-4nsrdz{position:relative}.event_item.svelte-4nsrdz.svelte-4nsrdz{border-bottom:2px solid var(--background-primary);margin:0;cursor:pointer;padding:5px 10px 10px 0;width:100%;overflow:hidden}.event_item.short.svelte-4nsrdz.svelte-4nsrdz{padding:0}.event_item.svelte-4nsrdz.svelte-4nsrdz:hover{background-color:var(--interactive-accent-hover);box-shadow:0px 0px 52px -18px rgba(0, 0, 0, 0.75)}.event_item_color1.svelte-4nsrdz.svelte-4nsrdz{background-color:var(--skobeloff)}.event_item_color2.svelte-4nsrdz.svelte-4nsrdz{background-color:var(--midnight-green-eagle-green)}.event_item_color3.svelte-4nsrdz.svelte-4nsrdz{background-color:var(--midnight-green-eagle-green-2)}.event_item_color4.svelte-4nsrdz.svelte-4nsrdz{background-color:var(--midnight-green-eagle-green-3)}.event_item_color5.svelte-4nsrdz.svelte-4nsrdz{background-color:var(--charcoal)}.event_item_color6.svelte-4nsrdz.svelte-4nsrdz{background-color:var(--prussian-blue)}.event_item_color7.svelte-4nsrdz.svelte-4nsrdz{background-color:var(--space-cadet)}.event_item_color8.svelte-4nsrdz.svelte-4nsrdz{background-color:var(--dark-purple)}.event_item_color9.svelte-4nsrdz.svelte-4nsrdz{background-color:var(--russian-violet)}.event_item_color10.svelte-4nsrdz.svelte-4nsrdz{background-color:var(--russian-violet-2)}.event_item_contents.svelte-4nsrdz.svelte-4nsrdz{padding-left:58px}.ei_Copy.svelte-4nsrdz.svelte-4nsrdz,.ei_Title.svelte-4nsrdz.svelte-4nsrdz{color:var(--text-on-accent)}.ei_Dot.svelte-4nsrdz.svelte-4nsrdz,.ei_Title.svelte-4nsrdz.svelte-4nsrdz{display:inline-block}.ei_Dot.svelte-4nsrdz.svelte-4nsrdz{position:absolute;border-radius:50%;width:14px;height:14px;margin-top:5px;background-color:var(--text-accent);box-shadow:0px 0px 52px -18px rgba(0, 0, 0, 0.75);z-index:2}.dot_active.svelte-4nsrdz.svelte-4nsrdz{background-color:var(--text-error-hover)}.ei_Title.svelte-4nsrdz.svelte-4nsrdz{margin-left:26px}.ei_Copy.svelte-4nsrdz.svelte-4nsrdz{font-size:15px;display:inline-block;margin-left:28px}.header_title.svelte-4nsrdz.svelte-4nsrdz,.ei_Title.svelte-4nsrdz.svelte-4nsrdz,.ce_title.svelte-4nsrdz.svelte-4nsrdz{color:#fff}#now-line.svelte-4nsrdz.svelte-4nsrdz{height:4px;background-color:darkred;opacity:80%;position:absolute;z-index:3;width:100%}#now-line.svelte-4nsrdz .timeline-time.svelte-4nsrdz{position:relative;left:5px;top:0;background-color:darkred;color:#fff;padding:0 4px 2px 4px;border-radius:0 0 4px 4px;text-align:center}#scroll-controls.svelte-4nsrdz.svelte-4nsrdz{background-color:var(--background-secondary);position:fixed;bottom:0;width:100%;z-index:4;padding:8px 15px;left:0;text-align:center}#scroll-controls.svelte-4nsrdz label.svelte-4nsrdz{display:block;float:left;margin:2px 10px}#scroll-controls.svelte-4nsrdz .toggle.svelte-4nsrdz{-webkit-appearance:none;-moz-appearance:none;appearance:none;width:50px;height:20px;display:block;float:left;position:relative;margin-top:5px;border-radius:50px;overflow:hidden;outline:none;border:none;cursor:pointer;background-color:var(--background-secondary-alt);transition:background-color ease 0.3s}#scroll-controls.svelte-4nsrdz .toggle.svelte-4nsrdz:before{content:\"on off\";display:block;position:absolute;z-index:2;width:17px;height:17px;background:#fff;left:2px;top:1px;border-radius:50%;font:9px/18px Helvetica;text-transform:uppercase;font-weight:bold;text-indent:-20px;word-spacing:30px;color:#fff;text-shadow:-1px -1px rgba(0,0,0,0.15);white-space:nowrap;box-shadow:0 1px 2px rgba(0,0,0,0.2);transition:all cubic-bezier(0.3, 1.5, 0.7, 1) 0.3s}#scroll-controls.svelte-4nsrdz .toggle.svelte-4nsrdz:checked{background-color:var(--interactive-accent)}#scroll-controls.svelte-4nsrdz .toggle.svelte-4nsrdz:checked:before{left:31px}.empty-timeline.svelte-4nsrdz.svelte-4nsrdz{text-align:center;vertical-align:middle;margin-top:50%}";
	append(document.head, style);
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[16] = list[i];
	child_ctx[18] = i;
	return child_ctx;
}

// (354:2) {:else}
function create_else_block(ctx) {
	let div;

	return {
		c() {
			div = element("div");
			div.textContent = "No Planner Data";
			attr(div, "class", "empty-timeline svelte-4nsrdz");
		},
		m(target, anchor) {
			insert(target, div, anchor);
		},
		p: noop,
		d(detaching) {
			if (detaching) detach(div);
		}
	};
}

// (325:0) {#if summary.validItems().length > 0}
function create_if_block(ctx) {
	let div6;
	let div2;
	let div1;
	let div0;
	let div2_class_value;
	let t0;
	let div3;
	let t1;
	let div4;
	let span;
	let t2_value = /*moment*/ ctx[5](/*currentTime*/ ctx[3]).format("HH:mm") + "";
	let t2;
	let t3;
	let div5;
	let label;
	let t5;
	let input;
	let mounted;
	let dispose;
	let each_value = /*summary*/ ctx[0].validItems();
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	return {
		c() {
			div6 = element("div");
			div2 = element("div");
			div1 = element("div");
			div0 = element("div");
			t0 = space();
			div3 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t1 = space();
			div4 = element("div");
			span = element("span");
			t2 = text(t2_value);
			t3 = space();
			div5 = element("div");
			label = element("label");
			label.textContent = "Track current time";
			t5 = space();
			input = element("input");
			attr(div0, "class", "filled__line__completed svelte-4nsrdz");
			set_style(div0, "height", nowPosition + "px");
			attr(div1, "class", "aside__line filled__line svelte-4nsrdz");
			attr(div2, "class", div2_class_value = "aside aside-x" + /*timelineZoomLevel*/ ctx[1] + " filled" + " svelte-4nsrdz");
			attr(div3, "class", "events svelte-4nsrdz");
			set_style(div3, "top", /*offset*/ ctx[6](/*summary*/ ctx[0].validItems().first()) + "px");
			attr(span, "class", "timeline-time svelte-4nsrdz");
			attr(div4, "id", "now-line");
			set_style(div4, "top", /*position*/ ctx[2] + "px");
			attr(div4, "class", "svelte-4nsrdz");
			attr(label, "for", "auto-scroll");
			attr(label, "class", "svelte-4nsrdz");
			attr(input, "id", "auto-scroll");
			attr(input, "type", "checkbox");
			attr(input, "class", "toggle svelte-4nsrdz");
			attr(div5, "id", "scroll-controls");
			attr(div5, "class", "svelte-4nsrdz");
			attr(div6, "id", "day-planner-timeline-container");
			set_style(div6, "height", 1440 * /*timelineZoomLevel*/ ctx[1] + "px");
			attr(div6, "class", "svelte-4nsrdz");
		},
		m(target, anchor) {
			insert(target, div6, anchor);
			append(div6, div2);
			append(div2, div1);
			append(div1, div0);
			append(div6, t0);
			append(div6, div3);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div3, null);
			}

			append(div6, t1);
			append(div6, div4);
			append(div4, span);
			append(span, t2);
			append(div6, t3);
			append(div6, div5);
			append(div5, label);
			append(div5, t5);
			append(div5, input);
			input.checked = /*autoScroll*/ ctx[4];

			if (!mounted) {
				dispose = listen(input, "change", /*input_change_handler*/ ctx[9]);
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty & /*timelineZoomLevel*/ 2 && div2_class_value !== (div2_class_value = "aside aside-x" + /*timelineZoomLevel*/ ctx[1] + " filled" + " svelte-4nsrdz")) {
				attr(div2, "class", div2_class_value);
			}

			if (dirty & /*shortClass, summary, pastClass, timelineZoomLevel*/ 131) {
				each_value = /*summary*/ ctx[0].validItems();
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div3, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*summary*/ 1) {
				set_style(div3, "top", /*offset*/ ctx[6](/*summary*/ ctx[0].validItems().first()) + "px");
			}

			if (dirty & /*currentTime*/ 8 && t2_value !== (t2_value = /*moment*/ ctx[5](/*currentTime*/ ctx[3]).format("HH:mm") + "")) set_data(t2, t2_value);

			if (dirty & /*position*/ 4) {
				set_style(div4, "top", /*position*/ ctx[2] + "px");
			}

			if (dirty & /*autoScroll*/ 16) {
				input.checked = /*autoScroll*/ ctx[4];
			}

			if (dirty & /*timelineZoomLevel*/ 2) {
				set_style(div6, "height", 1440 * /*timelineZoomLevel*/ ctx[1] + "px");
			}
		},
		d(detaching) {
			if (detaching) detach(div6);
			destroy_each(each_blocks, detaching);
			mounted = false;
			dispose();
		}
	};
}

// (334:8) {#each summary.validItems() as item, i}
function create_each_block(ctx) {
	let div4;
	let div3;
	let div0;
	let div0_class_value;
	let t0;
	let div1;
	let t1_value = /*item*/ ctx[16].rawTime + "";
	let t1;
	let t2;
	let div2;
	let t3_value = (/*item*/ ctx[16].displayText() ?? "") + "";
	let t3;
	let t4;
	let div4_class_value;

	return {
		c() {
			div4 = element("div");
			div3 = element("div");
			div0 = element("div");
			t0 = space();
			div1 = element("div");
			t1 = text(t1_value);
			t2 = space();
			div2 = element("div");
			t3 = text(t3_value);
			t4 = space();

			attr(div0, "class", div0_class_value = "ei_Dot " + (/*item*/ ctx[16] === /*summary*/ ctx[0].current
			? "dot_active"
			: "") + " svelte-4nsrdz");

			attr(div1, "class", "ei_Title svelte-4nsrdz");
			attr(div2, "class", "ei_Copy svelte-4nsrdz");
			attr(div3, "class", "event_item_contents svelte-4nsrdz");
			attr(div4, "class", div4_class_value = "event_item event_item_color" + (/*i*/ ctx[18] % 10 + 1) + " " + /*shortClass*/ ctx[7](/*item*/ ctx[16]) + " " + pastClass(/*item*/ ctx[16]) + " svelte-4nsrdz");
			set_style(div4, "height", /*item*/ ctx[16].durationMins * /*timelineZoomLevel*/ ctx[1] + "px");
		},
		m(target, anchor) {
			insert(target, div4, anchor);
			append(div4, div3);
			append(div3, div0);
			append(div3, t0);
			append(div3, div1);
			append(div1, t1);
			append(div3, t2);
			append(div3, div2);
			append(div2, t3);
			append(div4, t4);
		},
		p(ctx, dirty) {
			if (dirty & /*summary*/ 1 && div0_class_value !== (div0_class_value = "ei_Dot " + (/*item*/ ctx[16] === /*summary*/ ctx[0].current
			? "dot_active"
			: "") + " svelte-4nsrdz")) {
				attr(div0, "class", div0_class_value);
			}

			if (dirty & /*summary*/ 1 && t1_value !== (t1_value = /*item*/ ctx[16].rawTime + "")) set_data(t1, t1_value);
			if (dirty & /*summary*/ 1 && t3_value !== (t3_value = (/*item*/ ctx[16].displayText() ?? "") + "")) set_data(t3, t3_value);

			if (dirty & /*summary*/ 1 && div4_class_value !== (div4_class_value = "event_item event_item_color" + (/*i*/ ctx[18] % 10 + 1) + " " + /*shortClass*/ ctx[7](/*item*/ ctx[16]) + " " + pastClass(/*item*/ ctx[16]) + " svelte-4nsrdz")) {
				attr(div4, "class", div4_class_value);
			}

			if (dirty & /*summary, timelineZoomLevel*/ 3) {
				set_style(div4, "height", /*item*/ ctx[16].durationMins * /*timelineZoomLevel*/ ctx[1] + "px");
			}
		},
		d(detaching) {
			if (detaching) detach(div4);
		}
	};
}

function create_fragment(ctx) {
	let show_if;
	let if_block_anchor;

	function select_block_type(ctx, dirty) {
		if (show_if == null || dirty & /*summary*/ 1) show_if = !!(/*summary*/ ctx[0].validItems().length > 0);
		if (show_if) return create_if_block;
		return create_else_block;
	}

	let current_block_type = select_block_type(ctx, -1);
	let if_block = current_block_type(ctx);

	return {
		c() {
			if_block.c();
			if_block_anchor = empty();
		},
		m(target, anchor) {
			if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);
		},
		p(ctx, [dirty]) {
			if (current_block_type === (current_block_type = select_block_type(ctx, dirty)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if_block.d(detaching);
			if (detaching) detach(if_block_anchor);
		}
	};
}

function pastClass(item) {
	return item.isPast ? "past" : "";
}

function instance($$self, $$props, $$invalidate) {
	
	const moment = window.moment;
	let { summary } = $$props;
	let { rootEl } = $$props;
	let timelineZoomLevel;
	let position;
	let currentTime;
	let autoScroll = true;

	const unsubSummary = planSummary.subscribe(val => {
		$$invalidate(0, summary = val);
	});

	const unsubPosition = nowPosition.subscribe(val => {
		$$invalidate(2, position = val);
	});

	const unsubCurrentTime = now.subscribe(val => {
		$$invalidate(3, currentTime = val);
		scrollToPosition(position - 150);

		if (!timelineZoomLevel) {
			$$invalidate(1, timelineZoomLevel = 4);
		}
	});

	const unsubSettings = zoomLevel.subscribe(val => {
		$$invalidate(1, timelineZoomLevel = val);
	});

	onDestroy(unsubSummary);
	onDestroy(unsubPosition);
	onDestroy(unsubCurrentTime);
	onDestroy(unsubSettings);

	function scrollToPosition(position) {
		if (autoScroll) {
			rootEl.scrollTo({
				left: 0,
				top: position,
				behavior: "smooth"
			});
		}
	}

	function inMins(time) {
		return moment.duration(moment(time).format("HH:mm")).asMinutes();
	}

	function offset(item) {
		const minuteOffset = inMins(item.time) * timelineZoomLevel;
		return minuteOffset;
	}

	function shortClass(item) {
		return item.durationMins < 75 / timelineZoomLevel
		? "short"
		: "";
	}

	function input_change_handler() {
		autoScroll = this.checked;
		$$invalidate(4, autoScroll);
	}

	$$self.$$set = $$props => {
		if ("summary" in $$props) $$invalidate(0, summary = $$props.summary);
		if ("rootEl" in $$props) $$invalidate(8, rootEl = $$props.rootEl);
	};

	return [
		summary,
		timelineZoomLevel,
		position,
		currentTime,
		autoScroll,
		moment,
		offset,
		shortClass,
		rootEl,
		input_change_handler
	];
}

class Timeline extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-4nsrdz-style")) add_css();
		init(this, options, instance, create_fragment, safe_not_equal, { summary: 0, rootEl: 8 });
	}
}

const moment$4 = window.moment;
class TimelineView extends obsidian.ItemView {
    constructor(leaf, settings) {
        super(leaf);
        this.settings = settings;
    }
    getViewType() {
        return VIEW_TYPE_TIMELINE;
    }
    getDisplayText() {
        return 'Day Planner Timeline';
    }
    getIcon() {
        return "calendar-with-checkmark";
    }
    update(summaryData) {
        planSummary.update(n => n = summaryData);
        const currentTime = new Date();
        now.update(n => n = currentTime);
        const currentPosition = this.positionFromTime(currentTime);
        nowPosition.update(n => n = currentPosition);
        zoomLevel.update(n => n = this.settings.timelineZoomLevel);
    }
    positionFromTime(time) {
        return moment$4.duration(moment$4(time).format('HH:mm')).asMinutes() * this.settings.timelineZoomLevel;
    }
    async onOpen() {
        const { workspace: { activeLeaf }, } = this.app;
        this.timeline = new Timeline({
            target: this.contentEl,
            props: {
                planSummary: planSummary,
                rootEl: this.containerEl.children[1]
            },
        });
    }
}

class DayPlanner extends obsidian.Plugin {
    constructor() {
        super(...arguments);
        this.codeMirror = (cm) => {
            cm.on('change', async () => {
                if (this.file.hasTodayNote()) {
                    // console.log('Active note found, starting CodeMirror monitoring')
                    this.plannerMD.checkIsDayPlannerEditing();
                }
            });
        };
    }
    async onload() {
        console.log("Loading Day Planner plugin");
        this.vault = this.app.vault;
        this.settings = (await this.loadData()) || new DayPlannerSettings();
        this.notesForDatesQuery = new NoteForDateQuery();
        this.file = new DayPlannerFile(this.vault, this.settings);
        const progress = new Progress();
        const parser = new Parser(this.vault);
        this.plannerMD = new PlannerMarkdown(this.app.workspace, this.settings, this.file, parser, progress);
        this.statusBar = new StatusBar(this.settings, this.addStatusBarItem(), this.app.workspace, progress, new PlannerMarkdown(this.app.workspace, this.settings, this.file, parser, progress), this.file);
        this.statusBar.initStatusBar();
        this.registerEvent(this.app.on("codemirror", this.codeMirror));
        this.addCommand({
            id: 'app:add-day-planner-to-note',
            name: 'Add a Day Planner template for today to the current note',
            callback: () => this.modeGuard(async () => await this.insertDayPlannerIntoCurrentNote(true)),
            hotkeys: []
        });
        this.addCommand({
            id: 'app:link-day-planner-to-note',
            name: 'Link today\'s Day Planner to the current note',
            callback: () => this.modeGuard(async () => await this.insertDayPlannerIntoCurrentNote(false)),
            hotkeys: []
        });
        this.addCommand({
            id: 'app:unlink-day-planner-from-note',
            name: 'Unlink today\'s Day Planner from its note',
            callback: () => this.modeGuard(async () => await this.unlinkDayPlanner()),
            hotkeys: []
        });
        this.addCommand({
            id: 'app:show-day-planner-timeline',
            name: 'Show the Day Planner Timeline',
            callback: () => this.initLeaf(),
            hotkeys: []
        });
        this.registerView(VIEW_TYPE_TIMELINE, (leaf) => (this.timelineView = new TimelineView(leaf, this.settings)));
        this.addSettingTab(new DayPlannerSettingsTab(this.app, this));
        this.registerInterval(window.setInterval(async () => {
            try {
                if (this.file.hasTodayNote()) {
                    // console.log('Active note found, starting file processing')
                    const planSummary = await this.plannerMD.parseDayPlanner();
                    planSummary.calculate();
                    await this.statusBar.refreshStatusBar(planSummary);
                    await this.plannerMD.updateDayPlannerMarkdown(planSummary);
                    this.timelineView && this.timelineView.update(planSummary);
                }
                else {
                    // console.log('No active note, skipping file processing')
                }
            }
            catch (error) {
                console.log(error);
            }
        }, 2000));
    }
    initLeaf() {
        if (this.app.workspace.getLeavesOfType(VIEW_TYPE_TIMELINE).length > 0) {
            return;
        }
        this.app.workspace.getRightLeaf(true).setViewState({
            type: VIEW_TYPE_TIMELINE,
        });
    }
    modeGuard(command) {
        if (this.settings.mode !== DayPlannerMode.Command) {
            new Notification('Day Planner plugin in File mode', { silent: true, body: 'Switch to Command mode in settings to use this command' });
            return;
        }
        else {
            command();
        }
    }
    async insertDayPlannerIntoCurrentNote(insertTemplate) {
        var _a;
        try {
            if (!this.settings.notesToDates) {
                this.settings.notesToDates = [];
                this.saveData(this.settings);
            }
            const view = this.app.workspace.activeLeaf.view;
            const filePath = view.getState().file;
            const dayPlannerExists = this.notesForDatesQuery.exists(this.settings.notesToDates);
            const activeDayPlannerPath = (_a = this.notesForDatesQuery.active(this.settings.notesToDates)) === null || _a === void 0 ? void 0 : _a.notePath;
            if (dayPlannerExists && activeDayPlannerPath !== filePath) {
                new Notification('Day Planner exists', { silent: true, body: `A Day Planner for today already exists in ${activeDayPlannerPath}` });
                return;
            }
            if (!dayPlannerExists) {
                this.settings.notesToDates.push(new NoteForDate(filePath, new Date().toDateString()));
                await this.saveData(this.settings);
            }
            if (insertTemplate) {
                this.plannerMD.insertPlanner();
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    async unlinkDayPlanner() {
        try {
            const activePlanner = this.notesForDatesQuery.active(this.settings.notesToDates);
            this.settings.notesToDates.remove(activePlanner);
            await this.saveData(this.settings);
            await this.loadData();
            this.statusBar.hide(this.statusBar.statusBar);
            this.timelineView && this.timelineView.update(new PlanSummaryData([]));
            new Notification('Day Planner reset', { silent: true, body: `The Day Planner for today has been dissociated from ${activePlanner.notePath} and can be added to another note` });
        }
        catch (error) {
            console.error(error);
        }
    }
    onunload() {
        console.log("Unloading Day Planner plugin");
        this.app.workspace
            .getLeavesOfType(VIEW_TYPE_TIMELINE)
            .forEach((leaf) => leaf.detach());
    }
}

module.exports = DayPlanner;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL3NldHRpbmdzLnRzIiwiLi4vc3JjL2NvbnN0YW50cy50cyIsIi4uL25vZGVfbW9kdWxlcy9tb21lbnQvbW9tZW50LmpzIiwiLi4vc3JjL21vbWVudC1kYXRlLXJlZ2V4LnRzIiwiLi4vc3JjL3NldHRpbmdzLXRhYi50cyIsIi4uL3NyYy9zdGF0dXMtYmFyLnRzIiwiLi4vc3JjL3Byb2dyZXNzLnRzIiwiLi4vc3JjL21lcm1haWQudHMiLCIuLi9zcmMvcGxhbm5lci1tZC50cyIsIi4uL3NyYy9maWxlLnRzIiwiLi4vc3JjL3BsYW4tZGF0YS50cyIsIi4uL3NyYy9wYXJzZXIudHMiLCIuLi9ub2RlX21vZHVsZXMvc3ZlbHRlL2ludGVybmFsL2luZGV4Lm1qcyIsIi4uL25vZGVfbW9kdWxlcy9zdmVsdGUvc3RvcmUvaW5kZXgubWpzIiwiLi4vc3JjL3RpbWVsaW5lLXN0b3JlLnRzIiwiLi4vc3JjL3RpbWVsaW5lLnN2ZWx0ZSIsIi4uL3NyYy90aW1lbGluZS12aWV3LnRzIiwiLi4vc3JjL21haW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIERheVBsYW5uZXJTZXR0aW5ncyB7XG4gIGN1c3RvbUZvbGRlcjogc3RyaW5nID0gJ0RheSBQbGFubmVycyc7XG4gIG1vZGU6IERheVBsYW5uZXJNb2RlID0gRGF5UGxhbm5lck1vZGUuRmlsZTtcbiAgbWVybWFpZDogYm9vbGVhbiA9IGZhbHNlO1xuICBub3Rlc1RvRGF0ZXM6IE5vdGVGb3JEYXRlW10gPSBbXTtcbiAgY29tcGxldGVQYXN0SXRlbXM6IGJvb2xlYW4gPSB0cnVlO1xuICBjaXJjdWxhclByb2dyZXNzOiBib29sZWFuID0gZmFsc2U7XG4gIG5vd0FuZE5leHRJblN0YXR1c0JhcjogYm9vbGVhbiA9IGZhbHNlO1xuICBzaG93VGFza05vdGlmaWNhdGlvbjogYm9vbGVhbiA9IGZhbHNlXG4gIHRpbWVsaW5lWm9vbUxldmVsOiBudW1iZXIgPSA0O1xufVxuXG5leHBvcnQgY2xhc3MgTm90ZUZvckRhdGUge1xuICBub3RlUGF0aDogc3RyaW5nO1xuICBkYXRlOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3Iobm90ZVBhdGg6IHN0cmluZywgZGF0ZTpzdHJpbmcpe1xuICAgIHRoaXMubm90ZVBhdGggPSBub3RlUGF0aDtcbiAgICB0aGlzLmRhdGUgPSBkYXRlO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBOb3RlRm9yRGF0ZVF1ZXJ5IHtcbiAgZXhpc3RzKHNvdXJjZTogTm90ZUZvckRhdGVbXSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmFjdGl2ZShzb3VyY2UpICE9PSB1bmRlZmluZWQ7XG4gIH1cblxuICBhY3RpdmUoc291cmNlOiBOb3RlRm9yRGF0ZVtdKTogTm90ZUZvckRhdGV7XG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKS50b0RhdGVTdHJpbmcoKTtcbiAgICByZXR1cm4gc291cmNlICYmIHNvdXJjZS5maWx0ZXIobnRkID0+IG50ZC5kYXRlID09PSBub3cpWzBdO1xuICB9XG59XG4gIFxuZXhwb3J0IGVudW0gRGF5UGxhbm5lck1vZGUge1xuICBGaWxlLFxuICBDb21tYW5kXG59IiwiZXhwb3J0IGNvbnN0IERFRkFVTFRfREFURV9GT1JNQVQgPSAnWVlZWU1NREQnO1xuZXhwb3J0IGNvbnN0IERBVEVfUkVHRVggPSAvKD88dGFyZ2V0Pnt7ZGF0ZTo/KD88ZGF0ZT5bXn1dKil9fSkvZztcblxuZXhwb3J0IGNvbnN0IERBWV9QTEFOTkVSX0ZJTEVOQU1FID0gJ0RheSBQbGFubmVyLXt7ZGF0ZX19Lm1kJztcblxuLy9odHRwczovL3JlZ2V4MTAxLmNvbS9yL1ZBeFJuYy8zXG5leHBvcnQgY29uc3QgUExBTl9QQVJTRVJfUkVHRVggPSBcbi9eKCgoLT9bXFxzXSpcXFs/KD88Y29tcGxldGlvbj5beCBdKilcXF0pPyhcXGQuKT9cXHMqPyg/PGhvdXJzPlxcZHsxLDJ9KTooPzxtaW51dGVzPlxcZHsyfSlcXHMpKCg/PGJyZWFrPkJSRUFLKXwoPzxlbmQ+RU5EfGZpbmlzaCl8KCg/PHRleHQ+LiopKSkpfCgoPzx1bm1hdGNoZWQ+WyBcXHRdKi0gLiopKSQvZ21pO1xuXG5leHBvcnQgY29uc3QgREFZX1BMQU5ORVJfREVGQVVMVF9DT05URU5UID1cbmAjIyBEYXkgUGxhbm5lclxuLSBbIF0gXG5cbi0tLWBcblxuZXhwb3J0IGNvbnN0IFZJRVdfVFlQRV9USU1FTElORSA9ICd0aW1lbGluZSc7XG5leHBvcnQgY29uc3QgTUlOVVRFX01VTFRJUExJRVIgPSA0OyIsIi8vISBtb21lbnQuanNcbi8vISB2ZXJzaW9uIDogMi4yOS4xXG4vLyEgYXV0aG9ycyA6IFRpbSBXb29kLCBJc2tyZW4gQ2hlcm5ldiwgTW9tZW50LmpzIGNvbnRyaWJ1dG9yc1xuLy8hIGxpY2Vuc2UgOiBNSVRcbi8vISBtb21lbnRqcy5jb21cblxuOyhmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gICAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuICAgIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG4gICAgZ2xvYmFsLm1vbWVudCA9IGZhY3RvcnkoKVxufSh0aGlzLCAoZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgaG9va0NhbGxiYWNrO1xuXG4gICAgZnVuY3Rpb24gaG9va3MoKSB7XG4gICAgICAgIHJldHVybiBob29rQ2FsbGJhY2suYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICB9XG5cbiAgICAvLyBUaGlzIGlzIGRvbmUgdG8gcmVnaXN0ZXIgdGhlIG1ldGhvZCBjYWxsZWQgd2l0aCBtb21lbnQoKVxuICAgIC8vIHdpdGhvdXQgY3JlYXRpbmcgY2lyY3VsYXIgZGVwZW5kZW5jaWVzLlxuICAgIGZ1bmN0aW9uIHNldEhvb2tDYWxsYmFjayhjYWxsYmFjaykge1xuICAgICAgICBob29rQ2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0FycmF5KGlucHV0KSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBpbnB1dCBpbnN0YW5jZW9mIEFycmF5IHx8XG4gICAgICAgICAgICBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaW5wdXQpID09PSAnW29iamVjdCBBcnJheV0nXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNPYmplY3QoaW5wdXQpIHtcbiAgICAgICAgLy8gSUU4IHdpbGwgdHJlYXQgdW5kZWZpbmVkIGFuZCBudWxsIGFzIG9iamVjdCBpZiBpdCB3YXNuJ3QgZm9yXG4gICAgICAgIC8vIGlucHV0ICE9IG51bGxcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIGlucHV0ICE9IG51bGwgJiZcbiAgICAgICAgICAgIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpbnB1dCkgPT09ICdbb2JqZWN0IE9iamVjdF0nXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGFzT3duUHJvcChhLCBiKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYSwgYik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNPYmplY3RFbXB0eShvYmopIHtcbiAgICAgICAgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKSB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMob2JqKS5sZW5ndGggPT09IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgaztcbiAgICAgICAgICAgIGZvciAoayBpbiBvYmopIHtcbiAgICAgICAgICAgICAgICBpZiAoaGFzT3duUHJvcChvYmosIGspKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzVW5kZWZpbmVkKGlucHV0KSB7XG4gICAgICAgIHJldHVybiBpbnB1dCA9PT0gdm9pZCAwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzTnVtYmVyKGlucHV0KSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICB0eXBlb2YgaW5wdXQgPT09ICdudW1iZXInIHx8XG4gICAgICAgICAgICBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaW5wdXQpID09PSAnW29iamVjdCBOdW1iZXJdJ1xuICAgICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzRGF0ZShpbnB1dCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgaW5wdXQgaW5zdGFuY2VvZiBEYXRlIHx8XG4gICAgICAgICAgICBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaW5wdXQpID09PSAnW29iamVjdCBEYXRlXSdcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYXAoYXJyLCBmbikge1xuICAgICAgICB2YXIgcmVzID0gW10sXG4gICAgICAgICAgICBpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICByZXMucHVzaChmbihhcnJbaV0sIGkpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGV4dGVuZChhLCBiKSB7XG4gICAgICAgIGZvciAodmFyIGkgaW4gYikge1xuICAgICAgICAgICAgaWYgKGhhc093blByb3AoYiwgaSkpIHtcbiAgICAgICAgICAgICAgICBhW2ldID0gYltpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoYXNPd25Qcm9wKGIsICd0b1N0cmluZycpKSB7XG4gICAgICAgICAgICBhLnRvU3RyaW5nID0gYi50b1N0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChoYXNPd25Qcm9wKGIsICd2YWx1ZU9mJykpIHtcbiAgICAgICAgICAgIGEudmFsdWVPZiA9IGIudmFsdWVPZjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZVVUQyhpbnB1dCwgZm9ybWF0LCBsb2NhbGUsIHN0cmljdCkge1xuICAgICAgICByZXR1cm4gY3JlYXRlTG9jYWxPclVUQyhpbnB1dCwgZm9ybWF0LCBsb2NhbGUsIHN0cmljdCwgdHJ1ZSkudXRjKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVmYXVsdFBhcnNpbmdGbGFncygpIHtcbiAgICAgICAgLy8gV2UgbmVlZCB0byBkZWVwIGNsb25lIHRoaXMgb2JqZWN0LlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZW1wdHk6IGZhbHNlLFxuICAgICAgICAgICAgdW51c2VkVG9rZW5zOiBbXSxcbiAgICAgICAgICAgIHVudXNlZElucHV0OiBbXSxcbiAgICAgICAgICAgIG92ZXJmbG93OiAtMixcbiAgICAgICAgICAgIGNoYXJzTGVmdE92ZXI6IDAsXG4gICAgICAgICAgICBudWxsSW5wdXQ6IGZhbHNlLFxuICAgICAgICAgICAgaW52YWxpZEVyYTogbnVsbCxcbiAgICAgICAgICAgIGludmFsaWRNb250aDogbnVsbCxcbiAgICAgICAgICAgIGludmFsaWRGb3JtYXQ6IGZhbHNlLFxuICAgICAgICAgICAgdXNlckludmFsaWRhdGVkOiBmYWxzZSxcbiAgICAgICAgICAgIGlzbzogZmFsc2UsXG4gICAgICAgICAgICBwYXJzZWREYXRlUGFydHM6IFtdLFxuICAgICAgICAgICAgZXJhOiBudWxsLFxuICAgICAgICAgICAgbWVyaWRpZW06IG51bGwsXG4gICAgICAgICAgICByZmMyODIyOiBmYWxzZSxcbiAgICAgICAgICAgIHdlZWtkYXlNaXNtYXRjaDogZmFsc2UsXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0UGFyc2luZ0ZsYWdzKG0pIHtcbiAgICAgICAgaWYgKG0uX3BmID09IG51bGwpIHtcbiAgICAgICAgICAgIG0uX3BmID0gZGVmYXVsdFBhcnNpbmdGbGFncygpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtLl9wZjtcbiAgICB9XG5cbiAgICB2YXIgc29tZTtcbiAgICBpZiAoQXJyYXkucHJvdG90eXBlLnNvbWUpIHtcbiAgICAgICAgc29tZSA9IEFycmF5LnByb3RvdHlwZS5zb21lO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHNvbWUgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgICAgICAgICB2YXIgdCA9IE9iamVjdCh0aGlzKSxcbiAgICAgICAgICAgICAgICBsZW4gPSB0Lmxlbmd0aCA+Pj4gMCxcbiAgICAgICAgICAgICAgICBpO1xuXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaSBpbiB0ICYmIGZ1bi5jYWxsKHRoaXMsIHRbaV0sIGksIHQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzVmFsaWQobSkge1xuICAgICAgICBpZiAobS5faXNWYWxpZCA9PSBudWxsKSB7XG4gICAgICAgICAgICB2YXIgZmxhZ3MgPSBnZXRQYXJzaW5nRmxhZ3MobSksXG4gICAgICAgICAgICAgICAgcGFyc2VkUGFydHMgPSBzb21lLmNhbGwoZmxhZ3MucGFyc2VkRGF0ZVBhcnRzLCBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaSAhPSBudWxsO1xuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIGlzTm93VmFsaWQgPVxuICAgICAgICAgICAgICAgICAgICAhaXNOYU4obS5fZC5nZXRUaW1lKCkpICYmXG4gICAgICAgICAgICAgICAgICAgIGZsYWdzLm92ZXJmbG93IDwgMCAmJlxuICAgICAgICAgICAgICAgICAgICAhZmxhZ3MuZW1wdHkgJiZcbiAgICAgICAgICAgICAgICAgICAgIWZsYWdzLmludmFsaWRFcmEgJiZcbiAgICAgICAgICAgICAgICAgICAgIWZsYWdzLmludmFsaWRNb250aCAmJlxuICAgICAgICAgICAgICAgICAgICAhZmxhZ3MuaW52YWxpZFdlZWtkYXkgJiZcbiAgICAgICAgICAgICAgICAgICAgIWZsYWdzLndlZWtkYXlNaXNtYXRjaCAmJlxuICAgICAgICAgICAgICAgICAgICAhZmxhZ3MubnVsbElucHV0ICYmXG4gICAgICAgICAgICAgICAgICAgICFmbGFncy5pbnZhbGlkRm9ybWF0ICYmXG4gICAgICAgICAgICAgICAgICAgICFmbGFncy51c2VySW52YWxpZGF0ZWQgJiZcbiAgICAgICAgICAgICAgICAgICAgKCFmbGFncy5tZXJpZGllbSB8fCAoZmxhZ3MubWVyaWRpZW0gJiYgcGFyc2VkUGFydHMpKTtcblxuICAgICAgICAgICAgaWYgKG0uX3N0cmljdCkge1xuICAgICAgICAgICAgICAgIGlzTm93VmFsaWQgPVxuICAgICAgICAgICAgICAgICAgICBpc05vd1ZhbGlkICYmXG4gICAgICAgICAgICAgICAgICAgIGZsYWdzLmNoYXJzTGVmdE92ZXIgPT09IDAgJiZcbiAgICAgICAgICAgICAgICAgICAgZmxhZ3MudW51c2VkVG9rZW5zLmxlbmd0aCA9PT0gMCAmJlxuICAgICAgICAgICAgICAgICAgICBmbGFncy5iaWdIb3VyID09PSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChPYmplY3QuaXNGcm96ZW4gPT0gbnVsbCB8fCAhT2JqZWN0LmlzRnJvemVuKG0pKSB7XG4gICAgICAgICAgICAgICAgbS5faXNWYWxpZCA9IGlzTm93VmFsaWQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBpc05vd1ZhbGlkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtLl9pc1ZhbGlkO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUludmFsaWQoZmxhZ3MpIHtcbiAgICAgICAgdmFyIG0gPSBjcmVhdGVVVEMoTmFOKTtcbiAgICAgICAgaWYgKGZsYWdzICE9IG51bGwpIHtcbiAgICAgICAgICAgIGV4dGVuZChnZXRQYXJzaW5nRmxhZ3MobSksIGZsYWdzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhtKS51c2VySW52YWxpZGF0ZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG07XG4gICAgfVxuXG4gICAgLy8gUGx1Z2lucyB0aGF0IGFkZCBwcm9wZXJ0aWVzIHNob3VsZCBhbHNvIGFkZCB0aGUga2V5IGhlcmUgKG51bGwgdmFsdWUpLFxuICAgIC8vIHNvIHdlIGNhbiBwcm9wZXJseSBjbG9uZSBvdXJzZWx2ZXMuXG4gICAgdmFyIG1vbWVudFByb3BlcnRpZXMgPSAoaG9va3MubW9tZW50UHJvcGVydGllcyA9IFtdKSxcbiAgICAgICAgdXBkYXRlSW5Qcm9ncmVzcyA9IGZhbHNlO1xuXG4gICAgZnVuY3Rpb24gY29weUNvbmZpZyh0bywgZnJvbSkge1xuICAgICAgICB2YXIgaSwgcHJvcCwgdmFsO1xuXG4gICAgICAgIGlmICghaXNVbmRlZmluZWQoZnJvbS5faXNBTW9tZW50T2JqZWN0KSkge1xuICAgICAgICAgICAgdG8uX2lzQU1vbWVudE9iamVjdCA9IGZyb20uX2lzQU1vbWVudE9iamVjdDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWlzVW5kZWZpbmVkKGZyb20uX2kpKSB7XG4gICAgICAgICAgICB0by5faSA9IGZyb20uX2k7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFpc1VuZGVmaW5lZChmcm9tLl9mKSkge1xuICAgICAgICAgICAgdG8uX2YgPSBmcm9tLl9mO1xuICAgICAgICB9XG4gICAgICAgIGlmICghaXNVbmRlZmluZWQoZnJvbS5fbCkpIHtcbiAgICAgICAgICAgIHRvLl9sID0gZnJvbS5fbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWlzVW5kZWZpbmVkKGZyb20uX3N0cmljdCkpIHtcbiAgICAgICAgICAgIHRvLl9zdHJpY3QgPSBmcm9tLl9zdHJpY3Q7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFpc1VuZGVmaW5lZChmcm9tLl90em0pKSB7XG4gICAgICAgICAgICB0by5fdHptID0gZnJvbS5fdHptO1xuICAgICAgICB9XG4gICAgICAgIGlmICghaXNVbmRlZmluZWQoZnJvbS5faXNVVEMpKSB7XG4gICAgICAgICAgICB0by5faXNVVEMgPSBmcm9tLl9pc1VUQztcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWlzVW5kZWZpbmVkKGZyb20uX29mZnNldCkpIHtcbiAgICAgICAgICAgIHRvLl9vZmZzZXQgPSBmcm9tLl9vZmZzZXQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFpc1VuZGVmaW5lZChmcm9tLl9wZikpIHtcbiAgICAgICAgICAgIHRvLl9wZiA9IGdldFBhcnNpbmdGbGFncyhmcm9tKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWlzVW5kZWZpbmVkKGZyb20uX2xvY2FsZSkpIHtcbiAgICAgICAgICAgIHRvLl9sb2NhbGUgPSBmcm9tLl9sb2NhbGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobW9tZW50UHJvcGVydGllcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbW9tZW50UHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHByb3AgPSBtb21lbnRQcm9wZXJ0aWVzW2ldO1xuICAgICAgICAgICAgICAgIHZhbCA9IGZyb21bcHJvcF07XG4gICAgICAgICAgICAgICAgaWYgKCFpc1VuZGVmaW5lZCh2YWwpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvW3Byb3BdID0gdmFsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0bztcbiAgICB9XG5cbiAgICAvLyBNb21lbnQgcHJvdG90eXBlIG9iamVjdFxuICAgIGZ1bmN0aW9uIE1vbWVudChjb25maWcpIHtcbiAgICAgICAgY29weUNvbmZpZyh0aGlzLCBjb25maWcpO1xuICAgICAgICB0aGlzLl9kID0gbmV3IERhdGUoY29uZmlnLl9kICE9IG51bGwgPyBjb25maWcuX2QuZ2V0VGltZSgpIDogTmFOKTtcbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgdGhpcy5fZCA9IG5ldyBEYXRlKE5hTik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gUHJldmVudCBpbmZpbml0ZSBsb29wIGluIGNhc2UgdXBkYXRlT2Zmc2V0IGNyZWF0ZXMgbmV3IG1vbWVudFxuICAgICAgICAvLyBvYmplY3RzLlxuICAgICAgICBpZiAodXBkYXRlSW5Qcm9ncmVzcyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHVwZGF0ZUluUHJvZ3Jlc3MgPSB0cnVlO1xuICAgICAgICAgICAgaG9va3MudXBkYXRlT2Zmc2V0KHRoaXMpO1xuICAgICAgICAgICAgdXBkYXRlSW5Qcm9ncmVzcyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNNb21lbnQob2JqKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBvYmogaW5zdGFuY2VvZiBNb21lbnQgfHwgKG9iaiAhPSBudWxsICYmIG9iai5faXNBTW9tZW50T2JqZWN0ICE9IG51bGwpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gd2Fybihtc2cpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgaG9va3Muc3VwcHJlc3NEZXByZWNhdGlvbldhcm5pbmdzID09PSBmYWxzZSAmJlxuICAgICAgICAgICAgdHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICAgICAgICBjb25zb2xlLndhcm5cbiAgICAgICAgKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ0RlcHJlY2F0aW9uIHdhcm5pbmc6ICcgKyBtc2cpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVwcmVjYXRlKG1zZywgZm4pIHtcbiAgICAgICAgdmFyIGZpcnN0VGltZSA9IHRydWU7XG5cbiAgICAgICAgcmV0dXJuIGV4dGVuZChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoaG9va3MuZGVwcmVjYXRpb25IYW5kbGVyICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBob29rcy5kZXByZWNhdGlvbkhhbmRsZXIobnVsbCwgbXNnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChmaXJzdFRpbWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXJncyA9IFtdLFxuICAgICAgICAgICAgICAgICAgICBhcmcsXG4gICAgICAgICAgICAgICAgICAgIGksXG4gICAgICAgICAgICAgICAgICAgIGtleTtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGFyZyA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1tpXSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyArPSAnXFxuWycgKyBpICsgJ10gJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoa2V5IGluIGFyZ3VtZW50c1swXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoYXNPd25Qcm9wKGFyZ3VtZW50c1swXSwga2V5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmcgKz0ga2V5ICsgJzogJyArIGFyZ3VtZW50c1swXVtrZXldICsgJywgJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBhcmcuc2xpY2UoMCwgLTIpOyAvLyBSZW1vdmUgdHJhaWxpbmcgY29tbWEgYW5kIHNwYWNlXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYXJncy5wdXNoKGFyZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHdhcm4oXG4gICAgICAgICAgICAgICAgICAgIG1zZyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnXFxuQXJndW1lbnRzOiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3MpLmpvaW4oJycpICtcbiAgICAgICAgICAgICAgICAgICAgICAgICdcXG4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBFcnJvcigpLnN0YWNrXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBmaXJzdFRpbWUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9LCBmbik7XG4gICAgfVxuXG4gICAgdmFyIGRlcHJlY2F0aW9ucyA9IHt9O1xuXG4gICAgZnVuY3Rpb24gZGVwcmVjYXRlU2ltcGxlKG5hbWUsIG1zZykge1xuICAgICAgICBpZiAoaG9va3MuZGVwcmVjYXRpb25IYW5kbGVyICE9IG51bGwpIHtcbiAgICAgICAgICAgIGhvb2tzLmRlcHJlY2F0aW9uSGFuZGxlcihuYW1lLCBtc2cpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZGVwcmVjYXRpb25zW25hbWVdKSB7XG4gICAgICAgICAgICB3YXJuKG1zZyk7XG4gICAgICAgICAgICBkZXByZWNhdGlvbnNbbmFtZV0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaG9va3Muc3VwcHJlc3NEZXByZWNhdGlvbldhcm5pbmdzID0gZmFsc2U7XG4gICAgaG9va3MuZGVwcmVjYXRpb25IYW5kbGVyID0gbnVsbDtcblxuICAgIGZ1bmN0aW9uIGlzRnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICh0eXBlb2YgRnVuY3Rpb24gIT09ICd1bmRlZmluZWQnICYmIGlucHV0IGluc3RhbmNlb2YgRnVuY3Rpb24pIHx8XG4gICAgICAgICAgICBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaW5wdXQpID09PSAnW29iamVjdCBGdW5jdGlvbl0nXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0KGNvbmZpZykge1xuICAgICAgICB2YXIgcHJvcCwgaTtcbiAgICAgICAgZm9yIChpIGluIGNvbmZpZykge1xuICAgICAgICAgICAgaWYgKGhhc093blByb3AoY29uZmlnLCBpKSkge1xuICAgICAgICAgICAgICAgIHByb3AgPSBjb25maWdbaV07XG4gICAgICAgICAgICAgICAgaWYgKGlzRnVuY3Rpb24ocHJvcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpc1tpXSA9IHByb3A7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpc1snXycgKyBpXSA9IHByb3A7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2NvbmZpZyA9IGNvbmZpZztcbiAgICAgICAgLy8gTGVuaWVudCBvcmRpbmFsIHBhcnNpbmcgYWNjZXB0cyBqdXN0IGEgbnVtYmVyIGluIGFkZGl0aW9uIHRvXG4gICAgICAgIC8vIG51bWJlciArIChwb3NzaWJseSkgc3R1ZmYgY29taW5nIGZyb20gX2RheU9mTW9udGhPcmRpbmFsUGFyc2UuXG4gICAgICAgIC8vIFRPRE86IFJlbW92ZSBcIm9yZGluYWxQYXJzZVwiIGZhbGxiYWNrIGluIG5leHQgbWFqb3IgcmVsZWFzZS5cbiAgICAgICAgdGhpcy5fZGF5T2ZNb250aE9yZGluYWxQYXJzZUxlbmllbnQgPSBuZXcgUmVnRXhwKFxuICAgICAgICAgICAgKHRoaXMuX2RheU9mTW9udGhPcmRpbmFsUGFyc2Uuc291cmNlIHx8IHRoaXMuX29yZGluYWxQYXJzZS5zb3VyY2UpICtcbiAgICAgICAgICAgICAgICAnfCcgK1xuICAgICAgICAgICAgICAgIC9cXGR7MSwyfS8uc291cmNlXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWVyZ2VDb25maWdzKHBhcmVudENvbmZpZywgY2hpbGRDb25maWcpIHtcbiAgICAgICAgdmFyIHJlcyA9IGV4dGVuZCh7fSwgcGFyZW50Q29uZmlnKSxcbiAgICAgICAgICAgIHByb3A7XG4gICAgICAgIGZvciAocHJvcCBpbiBjaGlsZENvbmZpZykge1xuICAgICAgICAgICAgaWYgKGhhc093blByb3AoY2hpbGRDb25maWcsIHByb3ApKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzT2JqZWN0KHBhcmVudENvbmZpZ1twcm9wXSkgJiYgaXNPYmplY3QoY2hpbGRDb25maWdbcHJvcF0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc1twcm9wXSA9IHt9O1xuICAgICAgICAgICAgICAgICAgICBleHRlbmQocmVzW3Byb3BdLCBwYXJlbnRDb25maWdbcHJvcF0pO1xuICAgICAgICAgICAgICAgICAgICBleHRlbmQocmVzW3Byb3BdLCBjaGlsZENvbmZpZ1twcm9wXSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjaGlsZENvbmZpZ1twcm9wXSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc1twcm9wXSA9IGNoaWxkQ29uZmlnW3Byb3BdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSByZXNbcHJvcF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAocHJvcCBpbiBwYXJlbnRDb25maWcpIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBoYXNPd25Qcm9wKHBhcmVudENvbmZpZywgcHJvcCkgJiZcbiAgICAgICAgICAgICAgICAhaGFzT3duUHJvcChjaGlsZENvbmZpZywgcHJvcCkgJiZcbiAgICAgICAgICAgICAgICBpc09iamVjdChwYXJlbnRDb25maWdbcHJvcF0pXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAvLyBtYWtlIHN1cmUgY2hhbmdlcyB0byBwcm9wZXJ0aWVzIGRvbid0IG1vZGlmeSBwYXJlbnQgY29uZmlnXG4gICAgICAgICAgICAgICAgcmVzW3Byb3BdID0gZXh0ZW5kKHt9LCByZXNbcHJvcF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gTG9jYWxlKGNvbmZpZykge1xuICAgICAgICBpZiAoY29uZmlnICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0KGNvbmZpZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIga2V5cztcblxuICAgIGlmIChPYmplY3Qua2V5cykge1xuICAgICAgICBrZXlzID0gT2JqZWN0LmtleXM7XG4gICAgfSBlbHNlIHtcbiAgICAgICAga2V5cyA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICAgIHZhciBpLFxuICAgICAgICAgICAgICAgIHJlcyA9IFtdO1xuICAgICAgICAgICAgZm9yIChpIGluIG9iaikge1xuICAgICAgICAgICAgICAgIGlmIChoYXNPd25Qcm9wKG9iaiwgaSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzLnB1c2goaSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdENhbGVuZGFyID0ge1xuICAgICAgICBzYW1lRGF5OiAnW1RvZGF5IGF0XSBMVCcsXG4gICAgICAgIG5leHREYXk6ICdbVG9tb3Jyb3cgYXRdIExUJyxcbiAgICAgICAgbmV4dFdlZWs6ICdkZGRkIFthdF0gTFQnLFxuICAgICAgICBsYXN0RGF5OiAnW1llc3RlcmRheSBhdF0gTFQnLFxuICAgICAgICBsYXN0V2VlazogJ1tMYXN0XSBkZGRkIFthdF0gTFQnLFxuICAgICAgICBzYW1lRWxzZTogJ0wnLFxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBjYWxlbmRhcihrZXksIG1vbSwgbm93KSB7XG4gICAgICAgIHZhciBvdXRwdXQgPSB0aGlzLl9jYWxlbmRhcltrZXldIHx8IHRoaXMuX2NhbGVuZGFyWydzYW1lRWxzZSddO1xuICAgICAgICByZXR1cm4gaXNGdW5jdGlvbihvdXRwdXQpID8gb3V0cHV0LmNhbGwobW9tLCBub3cpIDogb3V0cHV0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHplcm9GaWxsKG51bWJlciwgdGFyZ2V0TGVuZ3RoLCBmb3JjZVNpZ24pIHtcbiAgICAgICAgdmFyIGFic051bWJlciA9ICcnICsgTWF0aC5hYnMobnVtYmVyKSxcbiAgICAgICAgICAgIHplcm9zVG9GaWxsID0gdGFyZ2V0TGVuZ3RoIC0gYWJzTnVtYmVyLmxlbmd0aCxcbiAgICAgICAgICAgIHNpZ24gPSBudW1iZXIgPj0gMDtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIChzaWduID8gKGZvcmNlU2lnbiA/ICcrJyA6ICcnKSA6ICctJykgK1xuICAgICAgICAgICAgTWF0aC5wb3coMTAsIE1hdGgubWF4KDAsIHplcm9zVG9GaWxsKSkudG9TdHJpbmcoKS5zdWJzdHIoMSkgK1xuICAgICAgICAgICAgYWJzTnVtYmVyXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgdmFyIGZvcm1hdHRpbmdUb2tlbnMgPSAvKFxcW1teXFxbXSpcXF0pfChcXFxcKT8oW0hoXW1tKHNzKT98TW98TU0/TT9NP3xEb3xERERvfEREP0Q/RD98ZGRkP2Q/fGRvP3x3W298d10/fFdbb3xXXT98UW8/fE57MSw1fXxZWVlZWVl8WVlZWVl8WVlZWXxZWXx5ezIsNH18eW8/fGdnKGdnZz8pP3xHRyhHR0c/KT98ZXxFfGF8QXxoaD98SEg/fGtrP3xtbT98c3M/fFN7MSw5fXx4fFh8eno/fFpaP3wuKS9nLFxuICAgICAgICBsb2NhbEZvcm1hdHRpbmdUb2tlbnMgPSAvKFxcW1teXFxbXSpcXF0pfChcXFxcKT8oTFRTfExUfExMP0w/TD98bHsxLDR9KS9nLFxuICAgICAgICBmb3JtYXRGdW5jdGlvbnMgPSB7fSxcbiAgICAgICAgZm9ybWF0VG9rZW5GdW5jdGlvbnMgPSB7fTtcblxuICAgIC8vIHRva2VuOiAgICAnTSdcbiAgICAvLyBwYWRkZWQ6ICAgWydNTScsIDJdXG4gICAgLy8gb3JkaW5hbDogICdNbydcbiAgICAvLyBjYWxsYmFjazogZnVuY3Rpb24gKCkgeyB0aGlzLm1vbnRoKCkgKyAxIH1cbiAgICBmdW5jdGlvbiBhZGRGb3JtYXRUb2tlbih0b2tlbiwgcGFkZGVkLCBvcmRpbmFsLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgZnVuYyA9IGNhbGxiYWNrO1xuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgZnVuYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpc1tjYWxsYmFja10oKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRva2VuKSB7XG4gICAgICAgICAgICBmb3JtYXRUb2tlbkZ1bmN0aW9uc1t0b2tlbl0gPSBmdW5jO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYWRkZWQpIHtcbiAgICAgICAgICAgIGZvcm1hdFRva2VuRnVuY3Rpb25zW3BhZGRlZFswXV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHplcm9GaWxsKGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKSwgcGFkZGVkWzFdLCBwYWRkZWRbMl0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3JkaW5hbCkge1xuICAgICAgICAgICAgZm9ybWF0VG9rZW5GdW5jdGlvbnNbb3JkaW5hbF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLm9yZGluYWwoXG4gICAgICAgICAgICAgICAgICAgIGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKSxcbiAgICAgICAgICAgICAgICAgICAgdG9rZW5cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbW92ZUZvcm1hdHRpbmdUb2tlbnMoaW5wdXQpIHtcbiAgICAgICAgaWYgKGlucHV0Lm1hdGNoKC9cXFtbXFxzXFxTXS8pKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQucmVwbGFjZSgvXlxcW3xcXF0kL2csICcnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW5wdXQucmVwbGFjZSgvXFxcXC9nLCAnJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFrZUZvcm1hdEZ1bmN0aW9uKGZvcm1hdCkge1xuICAgICAgICB2YXIgYXJyYXkgPSBmb3JtYXQubWF0Y2goZm9ybWF0dGluZ1Rva2VucyksXG4gICAgICAgICAgICBpLFxuICAgICAgICAgICAgbGVuZ3RoO1xuXG4gICAgICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZm9ybWF0VG9rZW5GdW5jdGlvbnNbYXJyYXlbaV1dKSB7XG4gICAgICAgICAgICAgICAgYXJyYXlbaV0gPSBmb3JtYXRUb2tlbkZ1bmN0aW9uc1thcnJheVtpXV07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFycmF5W2ldID0gcmVtb3ZlRm9ybWF0dGluZ1Rva2VucyhhcnJheVtpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKG1vbSkge1xuICAgICAgICAgICAgdmFyIG91dHB1dCA9ICcnLFxuICAgICAgICAgICAgICAgIGk7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gaXNGdW5jdGlvbihhcnJheVtpXSlcbiAgICAgICAgICAgICAgICAgICAgPyBhcnJheVtpXS5jYWxsKG1vbSwgZm9ybWF0KVxuICAgICAgICAgICAgICAgICAgICA6IGFycmF5W2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBmb3JtYXQgZGF0ZSB1c2luZyBuYXRpdmUgZGF0ZSBvYmplY3RcbiAgICBmdW5jdGlvbiBmb3JtYXRNb21lbnQobSwgZm9ybWF0KSB7XG4gICAgICAgIGlmICghbS5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBtLmxvY2FsZURhdGEoKS5pbnZhbGlkRGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9ybWF0ID0gZXhwYW5kRm9ybWF0KGZvcm1hdCwgbS5sb2NhbGVEYXRhKCkpO1xuICAgICAgICBmb3JtYXRGdW5jdGlvbnNbZm9ybWF0XSA9XG4gICAgICAgICAgICBmb3JtYXRGdW5jdGlvbnNbZm9ybWF0XSB8fCBtYWtlRm9ybWF0RnVuY3Rpb24oZm9ybWF0KTtcblxuICAgICAgICByZXR1cm4gZm9ybWF0RnVuY3Rpb25zW2Zvcm1hdF0obSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXhwYW5kRm9ybWF0KGZvcm1hdCwgbG9jYWxlKSB7XG4gICAgICAgIHZhciBpID0gNTtcblxuICAgICAgICBmdW5jdGlvbiByZXBsYWNlTG9uZ0RhdGVGb3JtYXRUb2tlbnMoaW5wdXQpIHtcbiAgICAgICAgICAgIHJldHVybiBsb2NhbGUubG9uZ0RhdGVGb3JtYXQoaW5wdXQpIHx8IGlucHV0O1xuICAgICAgICB9XG5cbiAgICAgICAgbG9jYWxGb3JtYXR0aW5nVG9rZW5zLmxhc3RJbmRleCA9IDA7XG4gICAgICAgIHdoaWxlIChpID49IDAgJiYgbG9jYWxGb3JtYXR0aW5nVG9rZW5zLnRlc3QoZm9ybWF0KSkge1xuICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UoXG4gICAgICAgICAgICAgICAgbG9jYWxGb3JtYXR0aW5nVG9rZW5zLFxuICAgICAgICAgICAgICAgIHJlcGxhY2VMb25nRGF0ZUZvcm1hdFRva2Vuc1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGxvY2FsRm9ybWF0dGluZ1Rva2Vucy5sYXN0SW5kZXggPSAwO1xuICAgICAgICAgICAgaSAtPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZvcm1hdDtcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdExvbmdEYXRlRm9ybWF0ID0ge1xuICAgICAgICBMVFM6ICdoOm1tOnNzIEEnLFxuICAgICAgICBMVDogJ2g6bW0gQScsXG4gICAgICAgIEw6ICdNTS9ERC9ZWVlZJyxcbiAgICAgICAgTEw6ICdNTU1NIEQsIFlZWVknLFxuICAgICAgICBMTEw6ICdNTU1NIEQsIFlZWVkgaDptbSBBJyxcbiAgICAgICAgTExMTDogJ2RkZGQsIE1NTU0gRCwgWVlZWSBoOm1tIEEnLFxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBsb25nRGF0ZUZvcm1hdChrZXkpIHtcbiAgICAgICAgdmFyIGZvcm1hdCA9IHRoaXMuX2xvbmdEYXRlRm9ybWF0W2tleV0sXG4gICAgICAgICAgICBmb3JtYXRVcHBlciA9IHRoaXMuX2xvbmdEYXRlRm9ybWF0W2tleS50b1VwcGVyQ2FzZSgpXTtcblxuICAgICAgICBpZiAoZm9ybWF0IHx8ICFmb3JtYXRVcHBlcikge1xuICAgICAgICAgICAgcmV0dXJuIGZvcm1hdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2xvbmdEYXRlRm9ybWF0W2tleV0gPSBmb3JtYXRVcHBlclxuICAgICAgICAgICAgLm1hdGNoKGZvcm1hdHRpbmdUb2tlbnMpXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uICh0b2spIHtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIHRvayA9PT0gJ01NTU0nIHx8XG4gICAgICAgICAgICAgICAgICAgIHRvayA9PT0gJ01NJyB8fFxuICAgICAgICAgICAgICAgICAgICB0b2sgPT09ICdERCcgfHxcbiAgICAgICAgICAgICAgICAgICAgdG9rID09PSAnZGRkZCdcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRvay5zbGljZSgxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRvaztcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuam9pbignJyk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvbmdEYXRlRm9ybWF0W2tleV07XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRJbnZhbGlkRGF0ZSA9ICdJbnZhbGlkIGRhdGUnO1xuXG4gICAgZnVuY3Rpb24gaW52YWxpZERhdGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnZhbGlkRGF0ZTtcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdE9yZGluYWwgPSAnJWQnLFxuICAgICAgICBkZWZhdWx0RGF5T2ZNb250aE9yZGluYWxQYXJzZSA9IC9cXGR7MSwyfS87XG5cbiAgICBmdW5jdGlvbiBvcmRpbmFsKG51bWJlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5fb3JkaW5hbC5yZXBsYWNlKCclZCcsIG51bWJlcik7XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRSZWxhdGl2ZVRpbWUgPSB7XG4gICAgICAgIGZ1dHVyZTogJ2luICVzJyxcbiAgICAgICAgcGFzdDogJyVzIGFnbycsXG4gICAgICAgIHM6ICdhIGZldyBzZWNvbmRzJyxcbiAgICAgICAgc3M6ICclZCBzZWNvbmRzJyxcbiAgICAgICAgbTogJ2EgbWludXRlJyxcbiAgICAgICAgbW06ICclZCBtaW51dGVzJyxcbiAgICAgICAgaDogJ2FuIGhvdXInLFxuICAgICAgICBoaDogJyVkIGhvdXJzJyxcbiAgICAgICAgZDogJ2EgZGF5JyxcbiAgICAgICAgZGQ6ICclZCBkYXlzJyxcbiAgICAgICAgdzogJ2Egd2VlaycsXG4gICAgICAgIHd3OiAnJWQgd2Vla3MnLFxuICAgICAgICBNOiAnYSBtb250aCcsXG4gICAgICAgIE1NOiAnJWQgbW9udGhzJyxcbiAgICAgICAgeTogJ2EgeWVhcicsXG4gICAgICAgIHl5OiAnJWQgeWVhcnMnLFxuICAgIH07XG5cbiAgICBmdW5jdGlvbiByZWxhdGl2ZVRpbWUobnVtYmVyLCB3aXRob3V0U3VmZml4LCBzdHJpbmcsIGlzRnV0dXJlKSB7XG4gICAgICAgIHZhciBvdXRwdXQgPSB0aGlzLl9yZWxhdGl2ZVRpbWVbc3RyaW5nXTtcbiAgICAgICAgcmV0dXJuIGlzRnVuY3Rpb24ob3V0cHV0KVxuICAgICAgICAgICAgPyBvdXRwdXQobnVtYmVyLCB3aXRob3V0U3VmZml4LCBzdHJpbmcsIGlzRnV0dXJlKVxuICAgICAgICAgICAgOiBvdXRwdXQucmVwbGFjZSgvJWQvaSwgbnVtYmVyKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXN0RnV0dXJlKGRpZmYsIG91dHB1dCkge1xuICAgICAgICB2YXIgZm9ybWF0ID0gdGhpcy5fcmVsYXRpdmVUaW1lW2RpZmYgPiAwID8gJ2Z1dHVyZScgOiAncGFzdCddO1xuICAgICAgICByZXR1cm4gaXNGdW5jdGlvbihmb3JtYXQpID8gZm9ybWF0KG91dHB1dCkgOiBmb3JtYXQucmVwbGFjZSgvJXMvaSwgb3V0cHV0KTtcbiAgICB9XG5cbiAgICB2YXIgYWxpYXNlcyA9IHt9O1xuXG4gICAgZnVuY3Rpb24gYWRkVW5pdEFsaWFzKHVuaXQsIHNob3J0aGFuZCkge1xuICAgICAgICB2YXIgbG93ZXJDYXNlID0gdW5pdC50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBhbGlhc2VzW2xvd2VyQ2FzZV0gPSBhbGlhc2VzW2xvd2VyQ2FzZSArICdzJ10gPSBhbGlhc2VzW3Nob3J0aGFuZF0gPSB1bml0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG5vcm1hbGl6ZVVuaXRzKHVuaXRzKSB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgdW5pdHMgPT09ICdzdHJpbmcnXG4gICAgICAgICAgICA/IGFsaWFzZXNbdW5pdHNdIHx8IGFsaWFzZXNbdW5pdHMudG9Mb3dlckNhc2UoKV1cbiAgICAgICAgICAgIDogdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG5vcm1hbGl6ZU9iamVjdFVuaXRzKGlucHV0T2JqZWN0KSB7XG4gICAgICAgIHZhciBub3JtYWxpemVkSW5wdXQgPSB7fSxcbiAgICAgICAgICAgIG5vcm1hbGl6ZWRQcm9wLFxuICAgICAgICAgICAgcHJvcDtcblxuICAgICAgICBmb3IgKHByb3AgaW4gaW5wdXRPYmplY3QpIHtcbiAgICAgICAgICAgIGlmIChoYXNPd25Qcm9wKGlucHV0T2JqZWN0LCBwcm9wKSkge1xuICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWRQcm9wID0gbm9ybWFsaXplVW5pdHMocHJvcCk7XG4gICAgICAgICAgICAgICAgaWYgKG5vcm1hbGl6ZWRQcm9wKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWRJbnB1dFtub3JtYWxpemVkUHJvcF0gPSBpbnB1dE9iamVjdFtwcm9wXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbm9ybWFsaXplZElucHV0O1xuICAgIH1cblxuICAgIHZhciBwcmlvcml0aWVzID0ge307XG5cbiAgICBmdW5jdGlvbiBhZGRVbml0UHJpb3JpdHkodW5pdCwgcHJpb3JpdHkpIHtcbiAgICAgICAgcHJpb3JpdGllc1t1bml0XSA9IHByaW9yaXR5O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFByaW9yaXRpemVkVW5pdHModW5pdHNPYmopIHtcbiAgICAgICAgdmFyIHVuaXRzID0gW10sXG4gICAgICAgICAgICB1O1xuICAgICAgICBmb3IgKHUgaW4gdW5pdHNPYmopIHtcbiAgICAgICAgICAgIGlmIChoYXNPd25Qcm9wKHVuaXRzT2JqLCB1KSkge1xuICAgICAgICAgICAgICAgIHVuaXRzLnB1c2goeyB1bml0OiB1LCBwcmlvcml0eTogcHJpb3JpdGllc1t1XSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB1bml0cy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICByZXR1cm4gYS5wcmlvcml0eSAtIGIucHJpb3JpdHk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdW5pdHM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNMZWFwWWVhcih5ZWFyKSB7XG4gICAgICAgIHJldHVybiAoeWVhciAlIDQgPT09IDAgJiYgeWVhciAlIDEwMCAhPT0gMCkgfHwgeWVhciAlIDQwMCA9PT0gMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhYnNGbG9vcihudW1iZXIpIHtcbiAgICAgICAgaWYgKG51bWJlciA8IDApIHtcbiAgICAgICAgICAgIC8vIC0wIC0+IDBcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmNlaWwobnVtYmVyKSB8fCAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IobnVtYmVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvSW50KGFyZ3VtZW50Rm9yQ29lcmNpb24pIHtcbiAgICAgICAgdmFyIGNvZXJjZWROdW1iZXIgPSArYXJndW1lbnRGb3JDb2VyY2lvbixcbiAgICAgICAgICAgIHZhbHVlID0gMDtcblxuICAgICAgICBpZiAoY29lcmNlZE51bWJlciAhPT0gMCAmJiBpc0Zpbml0ZShjb2VyY2VkTnVtYmVyKSkge1xuICAgICAgICAgICAgdmFsdWUgPSBhYnNGbG9vcihjb2VyY2VkTnVtYmVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlR2V0U2V0KHVuaXQsIGtlZXBUaW1lKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgc2V0JDEodGhpcywgdW5pdCwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIGhvb2tzLnVwZGF0ZU9mZnNldCh0aGlzLCBrZWVwVGltZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBnZXQodGhpcywgdW5pdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0KG1vbSwgdW5pdCkge1xuICAgICAgICByZXR1cm4gbW9tLmlzVmFsaWQoKVxuICAgICAgICAgICAgPyBtb20uX2RbJ2dldCcgKyAobW9tLl9pc1VUQyA/ICdVVEMnIDogJycpICsgdW5pdF0oKVxuICAgICAgICAgICAgOiBOYU47XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0JDEobW9tLCB1bml0LCB2YWx1ZSkge1xuICAgICAgICBpZiAobW9tLmlzVmFsaWQoKSAmJiAhaXNOYU4odmFsdWUpKSB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgdW5pdCA9PT0gJ0Z1bGxZZWFyJyAmJlxuICAgICAgICAgICAgICAgIGlzTGVhcFllYXIobW9tLnllYXIoKSkgJiZcbiAgICAgICAgICAgICAgICBtb20ubW9udGgoKSA9PT0gMSAmJlxuICAgICAgICAgICAgICAgIG1vbS5kYXRlKCkgPT09IDI5XG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHRvSW50KHZhbHVlKTtcbiAgICAgICAgICAgICAgICBtb20uX2RbJ3NldCcgKyAobW9tLl9pc1VUQyA/ICdVVEMnIDogJycpICsgdW5pdF0oXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICBtb20ubW9udGgoKSxcbiAgICAgICAgICAgICAgICAgICAgZGF5c0luTW9udGgodmFsdWUsIG1vbS5tb250aCgpKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1vbS5fZFsnc2V0JyArIChtb20uX2lzVVRDID8gJ1VUQycgOiAnJykgKyB1bml0XSh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICBmdW5jdGlvbiBzdHJpbmdHZXQodW5pdHMpIHtcbiAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG4gICAgICAgIGlmIChpc0Z1bmN0aW9uKHRoaXNbdW5pdHNdKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXNbdW5pdHNdKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3RyaW5nU2V0KHVuaXRzLCB2YWx1ZSkge1xuICAgICAgICBpZiAodHlwZW9mIHVuaXRzID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgdW5pdHMgPSBub3JtYWxpemVPYmplY3RVbml0cyh1bml0cyk7XG4gICAgICAgICAgICB2YXIgcHJpb3JpdGl6ZWQgPSBnZXRQcmlvcml0aXplZFVuaXRzKHVuaXRzKSxcbiAgICAgICAgICAgICAgICBpO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHByaW9yaXRpemVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpc1twcmlvcml0aXplZFtpXS51bml0XSh1bml0c1twcmlvcml0aXplZFtpXS51bml0XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcbiAgICAgICAgICAgIGlmIChpc0Z1bmN0aW9uKHRoaXNbdW5pdHNdKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzW3VuaXRzXSh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdmFyIG1hdGNoMSA9IC9cXGQvLCAvLyAgICAgICAwIC0gOVxuICAgICAgICBtYXRjaDIgPSAvXFxkXFxkLywgLy8gICAgICAwMCAtIDk5XG4gICAgICAgIG1hdGNoMyA9IC9cXGR7M30vLCAvLyAgICAgMDAwIC0gOTk5XG4gICAgICAgIG1hdGNoNCA9IC9cXGR7NH0vLCAvLyAgICAwMDAwIC0gOTk5OVxuICAgICAgICBtYXRjaDYgPSAvWystXT9cXGR7Nn0vLCAvLyAtOTk5OTk5IC0gOTk5OTk5XG4gICAgICAgIG1hdGNoMXRvMiA9IC9cXGRcXGQ/LywgLy8gICAgICAgMCAtIDk5XG4gICAgICAgIG1hdGNoM3RvNCA9IC9cXGRcXGRcXGRcXGQ/LywgLy8gICAgIDk5OSAtIDk5OTlcbiAgICAgICAgbWF0Y2g1dG82ID0gL1xcZFxcZFxcZFxcZFxcZFxcZD8vLCAvLyAgIDk5OTk5IC0gOTk5OTk5XG4gICAgICAgIG1hdGNoMXRvMyA9IC9cXGR7MSwzfS8sIC8vICAgICAgIDAgLSA5OTlcbiAgICAgICAgbWF0Y2gxdG80ID0gL1xcZHsxLDR9LywgLy8gICAgICAgMCAtIDk5OTlcbiAgICAgICAgbWF0Y2gxdG82ID0gL1srLV0/XFxkezEsNn0vLCAvLyAtOTk5OTk5IC0gOTk5OTk5XG4gICAgICAgIG1hdGNoVW5zaWduZWQgPSAvXFxkKy8sIC8vICAgICAgIDAgLSBpbmZcbiAgICAgICAgbWF0Y2hTaWduZWQgPSAvWystXT9cXGQrLywgLy8gICAgLWluZiAtIGluZlxuICAgICAgICBtYXRjaE9mZnNldCA9IC9afFsrLV1cXGRcXGQ6P1xcZFxcZC9naSwgLy8gKzAwOjAwIC0wMDowMCArMDAwMCAtMDAwMCBvciBaXG4gICAgICAgIG1hdGNoU2hvcnRPZmZzZXQgPSAvWnxbKy1dXFxkXFxkKD86Oj9cXGRcXGQpPy9naSwgLy8gKzAwIC0wMCArMDA6MDAgLTAwOjAwICswMDAwIC0wMDAwIG9yIFpcbiAgICAgICAgbWF0Y2hUaW1lc3RhbXAgPSAvWystXT9cXGQrKFxcLlxcZHsxLDN9KT8vLCAvLyAxMjM0NTY3ODkgMTIzNDU2Nzg5LjEyM1xuICAgICAgICAvLyBhbnkgd29yZCAob3IgdHdvKSBjaGFyYWN0ZXJzIG9yIG51bWJlcnMgaW5jbHVkaW5nIHR3by90aHJlZSB3b3JkIG1vbnRoIGluIGFyYWJpYy5cbiAgICAgICAgLy8gaW5jbHVkZXMgc2NvdHRpc2ggZ2FlbGljIHR3byB3b3JkIGFuZCBoeXBoZW5hdGVkIG1vbnRoc1xuICAgICAgICBtYXRjaFdvcmQgPSAvWzAtOV17MCwyNTZ9WydhLXpcXHUwMEEwLVxcdTA1RkZcXHUwNzAwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGMDdcXHVGRjEwLVxcdUZGRUZdezEsMjU2fXxbXFx1MDYwMC1cXHUwNkZGXFwvXXsxLDI1Nn0oXFxzKj9bXFx1MDYwMC1cXHUwNkZGXXsxLDI1Nn0pezEsMn0vaSxcbiAgICAgICAgcmVnZXhlcztcblxuICAgIHJlZ2V4ZXMgPSB7fTtcblxuICAgIGZ1bmN0aW9uIGFkZFJlZ2V4VG9rZW4odG9rZW4sIHJlZ2V4LCBzdHJpY3RSZWdleCkge1xuICAgICAgICByZWdleGVzW3Rva2VuXSA9IGlzRnVuY3Rpb24ocmVnZXgpXG4gICAgICAgICAgICA/IHJlZ2V4XG4gICAgICAgICAgICA6IGZ1bmN0aW9uIChpc1N0cmljdCwgbG9jYWxlRGF0YSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGlzU3RyaWN0ICYmIHN0cmljdFJlZ2V4ID8gc3RyaWN0UmVnZXggOiByZWdleDtcbiAgICAgICAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRQYXJzZVJlZ2V4Rm9yVG9rZW4odG9rZW4sIGNvbmZpZykge1xuICAgICAgICBpZiAoIWhhc093blByb3AocmVnZXhlcywgdG9rZW4pKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFJlZ0V4cCh1bmVzY2FwZUZvcm1hdCh0b2tlbikpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlZ2V4ZXNbdG9rZW5dKGNvbmZpZy5fc3RyaWN0LCBjb25maWcuX2xvY2FsZSk7XG4gICAgfVxuXG4gICAgLy8gQ29kZSBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzU2MTQ5My9pcy10aGVyZS1hLXJlZ2V4cC1lc2NhcGUtZnVuY3Rpb24taW4tamF2YXNjcmlwdFxuICAgIGZ1bmN0aW9uIHVuZXNjYXBlRm9ybWF0KHMpIHtcbiAgICAgICAgcmV0dXJuIHJlZ2V4RXNjYXBlKFxuICAgICAgICAgICAgc1xuICAgICAgICAgICAgICAgIC5yZXBsYWNlKCdcXFxcJywgJycpXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFwoXFxbKXxcXFxcKFxcXSl8XFxbKFteXFxdXFxbXSopXFxdfFxcXFwoLikvZywgZnVuY3Rpb24gKFxuICAgICAgICAgICAgICAgICAgICBtYXRjaGVkLFxuICAgICAgICAgICAgICAgICAgICBwMSxcbiAgICAgICAgICAgICAgICAgICAgcDIsXG4gICAgICAgICAgICAgICAgICAgIHAzLFxuICAgICAgICAgICAgICAgICAgICBwNFxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcDEgfHwgcDIgfHwgcDMgfHwgcDQ7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZWdleEVzY2FwZShzKSB7XG4gICAgICAgIHJldHVybiBzLnJlcGxhY2UoL1stXFwvXFxcXF4kKis/LigpfFtcXF17fV0vZywgJ1xcXFwkJicpO1xuICAgIH1cblxuICAgIHZhciB0b2tlbnMgPSB7fTtcblxuICAgIGZ1bmN0aW9uIGFkZFBhcnNlVG9rZW4odG9rZW4sIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBpLFxuICAgICAgICAgICAgZnVuYyA9IGNhbGxiYWNrO1xuICAgICAgICBpZiAodHlwZW9mIHRva2VuID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdG9rZW4gPSBbdG9rZW5dO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc051bWJlcihjYWxsYmFjaykpIHtcbiAgICAgICAgICAgIGZ1bmMgPSBmdW5jdGlvbiAoaW5wdXQsIGFycmF5KSB7XG4gICAgICAgICAgICAgICAgYXJyYXlbY2FsbGJhY2tdID0gdG9JbnQoaW5wdXQpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdG9rZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRva2Vuc1t0b2tlbltpXV0gPSBmdW5jO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkV2Vla1BhcnNlVG9rZW4odG9rZW4sIGNhbGxiYWNrKSB7XG4gICAgICAgIGFkZFBhcnNlVG9rZW4odG9rZW4sIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZywgdG9rZW4pIHtcbiAgICAgICAgICAgIGNvbmZpZy5fdyA9IGNvbmZpZy5fdyB8fCB7fTtcbiAgICAgICAgICAgIGNhbGxiYWNrKGlucHV0LCBjb25maWcuX3csIGNvbmZpZywgdG9rZW4pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRUaW1lVG9BcnJheUZyb21Ub2tlbih0b2tlbiwgaW5wdXQsIGNvbmZpZykge1xuICAgICAgICBpZiAoaW5wdXQgIT0gbnVsbCAmJiBoYXNPd25Qcm9wKHRva2VucywgdG9rZW4pKSB7XG4gICAgICAgICAgICB0b2tlbnNbdG9rZW5dKGlucHV0LCBjb25maWcuX2EsIGNvbmZpZywgdG9rZW4pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIFlFQVIgPSAwLFxuICAgICAgICBNT05USCA9IDEsXG4gICAgICAgIERBVEUgPSAyLFxuICAgICAgICBIT1VSID0gMyxcbiAgICAgICAgTUlOVVRFID0gNCxcbiAgICAgICAgU0VDT05EID0gNSxcbiAgICAgICAgTUlMTElTRUNPTkQgPSA2LFxuICAgICAgICBXRUVLID0gNyxcbiAgICAgICAgV0VFS0RBWSA9IDg7XG5cbiAgICBmdW5jdGlvbiBtb2QobiwgeCkge1xuICAgICAgICByZXR1cm4gKChuICUgeCkgKyB4KSAlIHg7XG4gICAgfVxuXG4gICAgdmFyIGluZGV4T2Y7XG5cbiAgICBpZiAoQXJyYXkucHJvdG90eXBlLmluZGV4T2YpIHtcbiAgICAgICAgaW5kZXhPZiA9IEFycmF5LnByb3RvdHlwZS5pbmRleE9mO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGluZGV4T2YgPSBmdW5jdGlvbiAobykge1xuICAgICAgICAgICAgLy8gSSBrbm93XG4gICAgICAgICAgICB2YXIgaTtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXNbaV0gPT09IG8pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRheXNJbk1vbnRoKHllYXIsIG1vbnRoKSB7XG4gICAgICAgIGlmIChpc05hTih5ZWFyKSB8fCBpc05hTihtb250aCkpIHtcbiAgICAgICAgICAgIHJldHVybiBOYU47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG1vZE1vbnRoID0gbW9kKG1vbnRoLCAxMik7XG4gICAgICAgIHllYXIgKz0gKG1vbnRoIC0gbW9kTW9udGgpIC8gMTI7XG4gICAgICAgIHJldHVybiBtb2RNb250aCA9PT0gMVxuICAgICAgICAgICAgPyBpc0xlYXBZZWFyKHllYXIpXG4gICAgICAgICAgICAgICAgPyAyOVxuICAgICAgICAgICAgICAgIDogMjhcbiAgICAgICAgICAgIDogMzEgLSAoKG1vZE1vbnRoICUgNykgJSAyKTtcbiAgICB9XG5cbiAgICAvLyBGT1JNQVRUSU5HXG5cbiAgICBhZGRGb3JtYXRUb2tlbignTScsIFsnTU0nLCAyXSwgJ01vJywgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tb250aCgpICsgMTtcbiAgICB9KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdNTU0nLCAwLCAwLCBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5tb250aHNTaG9ydCh0aGlzLCBmb3JtYXQpO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ01NTU0nLCAwLCAwLCBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5tb250aHModGhpcywgZm9ybWF0KTtcbiAgICB9KTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygnbW9udGgnLCAnTScpO1xuXG4gICAgLy8gUFJJT1JJVFlcblxuICAgIGFkZFVuaXRQcmlvcml0eSgnbW9udGgnLCA4KTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ00nLCBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ01NJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ01NTScsIGZ1bmN0aW9uIChpc1N0cmljdCwgbG9jYWxlKSB7XG4gICAgICAgIHJldHVybiBsb2NhbGUubW9udGhzU2hvcnRSZWdleChpc1N0cmljdCk7XG4gICAgfSk7XG4gICAgYWRkUmVnZXhUb2tlbignTU1NTScsIGZ1bmN0aW9uIChpc1N0cmljdCwgbG9jYWxlKSB7XG4gICAgICAgIHJldHVybiBsb2NhbGUubW9udGhzUmVnZXgoaXNTdHJpY3QpO1xuICAgIH0pO1xuXG4gICAgYWRkUGFyc2VUb2tlbihbJ00nLCAnTU0nXSwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSkge1xuICAgICAgICBhcnJheVtNT05USF0gPSB0b0ludChpbnB1dCkgLSAxO1xuICAgIH0pO1xuXG4gICAgYWRkUGFyc2VUb2tlbihbJ01NTScsICdNTU1NJ10sIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZywgdG9rZW4pIHtcbiAgICAgICAgdmFyIG1vbnRoID0gY29uZmlnLl9sb2NhbGUubW9udGhzUGFyc2UoaW5wdXQsIHRva2VuLCBjb25maWcuX3N0cmljdCk7XG4gICAgICAgIC8vIGlmIHdlIGRpZG4ndCBmaW5kIGEgbW9udGggbmFtZSwgbWFyayB0aGUgZGF0ZSBhcyBpbnZhbGlkLlxuICAgICAgICBpZiAobW9udGggIT0gbnVsbCkge1xuICAgICAgICAgICAgYXJyYXlbTU9OVEhdID0gbW9udGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5pbnZhbGlkTW9udGggPSBpbnB1dDtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gTE9DQUxFU1xuXG4gICAgdmFyIGRlZmF1bHRMb2NhbGVNb250aHMgPSAnSmFudWFyeV9GZWJydWFyeV9NYXJjaF9BcHJpbF9NYXlfSnVuZV9KdWx5X0F1Z3VzdF9TZXB0ZW1iZXJfT2N0b2Jlcl9Ob3ZlbWJlcl9EZWNlbWJlcicuc3BsaXQoXG4gICAgICAgICAgICAnXydcbiAgICAgICAgKSxcbiAgICAgICAgZGVmYXVsdExvY2FsZU1vbnRoc1Nob3J0ID0gJ0phbl9GZWJfTWFyX0Fwcl9NYXlfSnVuX0p1bF9BdWdfU2VwX09jdF9Ob3ZfRGVjJy5zcGxpdChcbiAgICAgICAgICAgICdfJ1xuICAgICAgICApLFxuICAgICAgICBNT05USFNfSU5fRk9STUFUID0gL0Rbb0RdPyhcXFtbXlxcW1xcXV0qXFxdfFxccykrTU1NTT8vLFxuICAgICAgICBkZWZhdWx0TW9udGhzU2hvcnRSZWdleCA9IG1hdGNoV29yZCxcbiAgICAgICAgZGVmYXVsdE1vbnRoc1JlZ2V4ID0gbWF0Y2hXb3JkO1xuXG4gICAgZnVuY3Rpb24gbG9jYWxlTW9udGhzKG0sIGZvcm1hdCkge1xuICAgICAgICBpZiAoIW0pIHtcbiAgICAgICAgICAgIHJldHVybiBpc0FycmF5KHRoaXMuX21vbnRocylcbiAgICAgICAgICAgICAgICA/IHRoaXMuX21vbnRoc1xuICAgICAgICAgICAgICAgIDogdGhpcy5fbW9udGhzWydzdGFuZGFsb25lJ107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlzQXJyYXkodGhpcy5fbW9udGhzKVxuICAgICAgICAgICAgPyB0aGlzLl9tb250aHNbbS5tb250aCgpXVxuICAgICAgICAgICAgOiB0aGlzLl9tb250aHNbXG4gICAgICAgICAgICAgICAgICAodGhpcy5fbW9udGhzLmlzRm9ybWF0IHx8IE1PTlRIU19JTl9GT1JNQVQpLnRlc3QoZm9ybWF0KVxuICAgICAgICAgICAgICAgICAgICAgID8gJ2Zvcm1hdCdcbiAgICAgICAgICAgICAgICAgICAgICA6ICdzdGFuZGFsb25lJ1xuICAgICAgICAgICAgICBdW20ubW9udGgoKV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9jYWxlTW9udGhzU2hvcnQobSwgZm9ybWF0KSB7XG4gICAgICAgIGlmICghbSkge1xuICAgICAgICAgICAgcmV0dXJuIGlzQXJyYXkodGhpcy5fbW9udGhzU2hvcnQpXG4gICAgICAgICAgICAgICAgPyB0aGlzLl9tb250aHNTaG9ydFxuICAgICAgICAgICAgICAgIDogdGhpcy5fbW9udGhzU2hvcnRbJ3N0YW5kYWxvbmUnXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXNBcnJheSh0aGlzLl9tb250aHNTaG9ydClcbiAgICAgICAgICAgID8gdGhpcy5fbW9udGhzU2hvcnRbbS5tb250aCgpXVxuICAgICAgICAgICAgOiB0aGlzLl9tb250aHNTaG9ydFtcbiAgICAgICAgICAgICAgICAgIE1PTlRIU19JTl9GT1JNQVQudGVzdChmb3JtYXQpID8gJ2Zvcm1hdCcgOiAnc3RhbmRhbG9uZSdcbiAgICAgICAgICAgICAgXVttLm1vbnRoKCldO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhbmRsZVN0cmljdFBhcnNlKG1vbnRoTmFtZSwgZm9ybWF0LCBzdHJpY3QpIHtcbiAgICAgICAgdmFyIGksXG4gICAgICAgICAgICBpaSxcbiAgICAgICAgICAgIG1vbSxcbiAgICAgICAgICAgIGxsYyA9IG1vbnRoTmFtZS50b0xvY2FsZUxvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAoIXRoaXMuX21vbnRoc1BhcnNlKSB7XG4gICAgICAgICAgICAvLyB0aGlzIGlzIG5vdCB1c2VkXG4gICAgICAgICAgICB0aGlzLl9tb250aHNQYXJzZSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5fbG9uZ01vbnRoc1BhcnNlID0gW107XG4gICAgICAgICAgICB0aGlzLl9zaG9ydE1vbnRoc1BhcnNlID0gW107XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgMTI7ICsraSkge1xuICAgICAgICAgICAgICAgIG1vbSA9IGNyZWF0ZVVUQyhbMjAwMCwgaV0pO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Nob3J0TW9udGhzUGFyc2VbaV0gPSB0aGlzLm1vbnRoc1Nob3J0KFxuICAgICAgICAgICAgICAgICAgICBtb20sXG4gICAgICAgICAgICAgICAgICAgICcnXG4gICAgICAgICAgICAgICAgKS50b0xvY2FsZUxvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvbmdNb250aHNQYXJzZVtpXSA9IHRoaXMubW9udGhzKG1vbSwgJycpLnRvTG9jYWxlTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3RyaWN0KSB7XG4gICAgICAgICAgICBpZiAoZm9ybWF0ID09PSAnTU1NJykge1xuICAgICAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX3Nob3J0TW9udGhzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlpICE9PSAtMSA/IGlpIDogbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fbG9uZ01vbnRoc1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgICAgIHJldHVybiBpaSAhPT0gLTEgPyBpaSA6IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZm9ybWF0ID09PSAnTU1NJykge1xuICAgICAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX3Nob3J0TW9udGhzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICAgICAgaWYgKGlpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaWk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX2xvbmdNb250aHNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaWkgIT09IC0xID8gaWkgOiBudWxsO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl9sb25nTW9udGhzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICAgICAgaWYgKGlpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaWk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX3Nob3J0TW9udGhzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlpICE9PSAtMSA/IGlpIDogbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvY2FsZU1vbnRoc1BhcnNlKG1vbnRoTmFtZSwgZm9ybWF0LCBzdHJpY3QpIHtcbiAgICAgICAgdmFyIGksIG1vbSwgcmVnZXg7XG5cbiAgICAgICAgaWYgKHRoaXMuX21vbnRoc1BhcnNlRXhhY3QpIHtcbiAgICAgICAgICAgIHJldHVybiBoYW5kbGVTdHJpY3RQYXJzZS5jYWxsKHRoaXMsIG1vbnRoTmFtZSwgZm9ybWF0LCBzdHJpY3QpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLl9tb250aHNQYXJzZSkge1xuICAgICAgICAgICAgdGhpcy5fbW9udGhzUGFyc2UgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuX2xvbmdNb250aHNQYXJzZSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5fc2hvcnRNb250aHNQYXJzZSA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVE9ETzogYWRkIHNvcnRpbmdcbiAgICAgICAgLy8gU29ydGluZyBtYWtlcyBzdXJlIGlmIG9uZSBtb250aCAob3IgYWJicikgaXMgYSBwcmVmaXggb2YgYW5vdGhlclxuICAgICAgICAvLyBzZWUgc29ydGluZyBpbiBjb21wdXRlTW9udGhzUGFyc2VcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDEyOyBpKyspIHtcbiAgICAgICAgICAgIC8vIG1ha2UgdGhlIHJlZ2V4IGlmIHdlIGRvbid0IGhhdmUgaXQgYWxyZWFkeVxuICAgICAgICAgICAgbW9tID0gY3JlYXRlVVRDKFsyMDAwLCBpXSk7XG4gICAgICAgICAgICBpZiAoc3RyaWN0ICYmICF0aGlzLl9sb25nTW9udGhzUGFyc2VbaV0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb25nTW9udGhzUGFyc2VbaV0gPSBuZXcgUmVnRXhwKFxuICAgICAgICAgICAgICAgICAgICAnXicgKyB0aGlzLm1vbnRocyhtb20sICcnKS5yZXBsYWNlKCcuJywgJycpICsgJyQnLFxuICAgICAgICAgICAgICAgICAgICAnaSdcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Nob3J0TW9udGhzUGFyc2VbaV0gPSBuZXcgUmVnRXhwKFxuICAgICAgICAgICAgICAgICAgICAnXicgKyB0aGlzLm1vbnRoc1Nob3J0KG1vbSwgJycpLnJlcGxhY2UoJy4nLCAnJykgKyAnJCcsXG4gICAgICAgICAgICAgICAgICAgICdpJ1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXN0cmljdCAmJiAhdGhpcy5fbW9udGhzUGFyc2VbaV0pIHtcbiAgICAgICAgICAgICAgICByZWdleCA9XG4gICAgICAgICAgICAgICAgICAgICdeJyArIHRoaXMubW9udGhzKG1vbSwgJycpICsgJ3xeJyArIHRoaXMubW9udGhzU2hvcnQobW9tLCAnJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fbW9udGhzUGFyc2VbaV0gPSBuZXcgUmVnRXhwKHJlZ2V4LnJlcGxhY2UoJy4nLCAnJyksICdpJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB0ZXN0IHRoZSByZWdleFxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHN0cmljdCAmJlxuICAgICAgICAgICAgICAgIGZvcm1hdCA9PT0gJ01NTU0nICYmXG4gICAgICAgICAgICAgICAgdGhpcy5fbG9uZ01vbnRoc1BhcnNlW2ldLnRlc3QobW9udGhOYW1lKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgIHN0cmljdCAmJlxuICAgICAgICAgICAgICAgIGZvcm1hdCA9PT0gJ01NTScgJiZcbiAgICAgICAgICAgICAgICB0aGlzLl9zaG9ydE1vbnRoc1BhcnNlW2ldLnRlc3QobW9udGhOYW1lKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFzdHJpY3QgJiYgdGhpcy5fbW9udGhzUGFyc2VbaV0udGVzdChtb250aE5hbWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICBmdW5jdGlvbiBzZXRNb250aChtb20sIHZhbHVlKSB7XG4gICAgICAgIHZhciBkYXlPZk1vbnRoO1xuXG4gICAgICAgIGlmICghbW9tLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgLy8gTm8gb3BcbiAgICAgICAgICAgIHJldHVybiBtb207XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgaWYgKC9eXFxkKyQvLnRlc3QodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0b0ludCh2YWx1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gbW9tLmxvY2FsZURhdGEoKS5tb250aHNQYXJzZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgLy8gVE9ETzogQW5vdGhlciBzaWxlbnQgZmFpbHVyZT9cbiAgICAgICAgICAgICAgICBpZiAoIWlzTnVtYmVyKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbW9tO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGRheU9mTW9udGggPSBNYXRoLm1pbihtb20uZGF0ZSgpLCBkYXlzSW5Nb250aChtb20ueWVhcigpLCB2YWx1ZSkpO1xuICAgICAgICBtb20uX2RbJ3NldCcgKyAobW9tLl9pc1VUQyA/ICdVVEMnIDogJycpICsgJ01vbnRoJ10odmFsdWUsIGRheU9mTW9udGgpO1xuICAgICAgICByZXR1cm4gbW9tO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFNldE1vbnRoKHZhbHVlKSB7XG4gICAgICAgIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICAgICAgICBzZXRNb250aCh0aGlzLCB2YWx1ZSk7XG4gICAgICAgICAgICBob29rcy51cGRhdGVPZmZzZXQodGhpcywgdHJ1ZSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBnZXQodGhpcywgJ01vbnRoJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXREYXlzSW5Nb250aCgpIHtcbiAgICAgICAgcmV0dXJuIGRheXNJbk1vbnRoKHRoaXMueWVhcigpLCB0aGlzLm1vbnRoKCkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vbnRoc1Nob3J0UmVnZXgoaXNTdHJpY3QpIHtcbiAgICAgICAgaWYgKHRoaXMuX21vbnRoc1BhcnNlRXhhY3QpIHtcbiAgICAgICAgICAgIGlmICghaGFzT3duUHJvcCh0aGlzLCAnX21vbnRoc1JlZ2V4JykpIHtcbiAgICAgICAgICAgICAgICBjb21wdXRlTW9udGhzUGFyc2UuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpc1N0cmljdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9tb250aHNTaG9ydFN0cmljdFJlZ2V4O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbW9udGhzU2hvcnRSZWdleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghaGFzT3duUHJvcCh0aGlzLCAnX21vbnRoc1Nob3J0UmVnZXgnKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX21vbnRoc1Nob3J0UmVnZXggPSBkZWZhdWx0TW9udGhzU2hvcnRSZWdleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tb250aHNTaG9ydFN0cmljdFJlZ2V4ICYmIGlzU3RyaWN0XG4gICAgICAgICAgICAgICAgPyB0aGlzLl9tb250aHNTaG9ydFN0cmljdFJlZ2V4XG4gICAgICAgICAgICAgICAgOiB0aGlzLl9tb250aHNTaG9ydFJlZ2V4O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW9udGhzUmVnZXgoaXNTdHJpY3QpIHtcbiAgICAgICAgaWYgKHRoaXMuX21vbnRoc1BhcnNlRXhhY3QpIHtcbiAgICAgICAgICAgIGlmICghaGFzT3duUHJvcCh0aGlzLCAnX21vbnRoc1JlZ2V4JykpIHtcbiAgICAgICAgICAgICAgICBjb21wdXRlTW9udGhzUGFyc2UuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpc1N0cmljdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9tb250aHNTdHJpY3RSZWdleDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21vbnRoc1JlZ2V4O1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCFoYXNPd25Qcm9wKHRoaXMsICdfbW9udGhzUmVnZXgnKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX21vbnRoc1JlZ2V4ID0gZGVmYXVsdE1vbnRoc1JlZ2V4O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21vbnRoc1N0cmljdFJlZ2V4ICYmIGlzU3RyaWN0XG4gICAgICAgICAgICAgICAgPyB0aGlzLl9tb250aHNTdHJpY3RSZWdleFxuICAgICAgICAgICAgICAgIDogdGhpcy5fbW9udGhzUmVnZXg7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb21wdXRlTW9udGhzUGFyc2UoKSB7XG4gICAgICAgIGZ1bmN0aW9uIGNtcExlblJldihhLCBiKSB7XG4gICAgICAgICAgICByZXR1cm4gYi5sZW5ndGggLSBhLmxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzaG9ydFBpZWNlcyA9IFtdLFxuICAgICAgICAgICAgbG9uZ1BpZWNlcyA9IFtdLFxuICAgICAgICAgICAgbWl4ZWRQaWVjZXMgPSBbXSxcbiAgICAgICAgICAgIGksXG4gICAgICAgICAgICBtb207XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCAxMjsgaSsrKSB7XG4gICAgICAgICAgICAvLyBtYWtlIHRoZSByZWdleCBpZiB3ZSBkb24ndCBoYXZlIGl0IGFscmVhZHlcbiAgICAgICAgICAgIG1vbSA9IGNyZWF0ZVVUQyhbMjAwMCwgaV0pO1xuICAgICAgICAgICAgc2hvcnRQaWVjZXMucHVzaCh0aGlzLm1vbnRoc1Nob3J0KG1vbSwgJycpKTtcbiAgICAgICAgICAgIGxvbmdQaWVjZXMucHVzaCh0aGlzLm1vbnRocyhtb20sICcnKSk7XG4gICAgICAgICAgICBtaXhlZFBpZWNlcy5wdXNoKHRoaXMubW9udGhzKG1vbSwgJycpKTtcbiAgICAgICAgICAgIG1peGVkUGllY2VzLnB1c2godGhpcy5tb250aHNTaG9ydChtb20sICcnKSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gU29ydGluZyBtYWtlcyBzdXJlIGlmIG9uZSBtb250aCAob3IgYWJicikgaXMgYSBwcmVmaXggb2YgYW5vdGhlciBpdFxuICAgICAgICAvLyB3aWxsIG1hdGNoIHRoZSBsb25nZXIgcGllY2UuXG4gICAgICAgIHNob3J0UGllY2VzLnNvcnQoY21wTGVuUmV2KTtcbiAgICAgICAgbG9uZ1BpZWNlcy5zb3J0KGNtcExlblJldik7XG4gICAgICAgIG1peGVkUGllY2VzLnNvcnQoY21wTGVuUmV2KTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDEyOyBpKyspIHtcbiAgICAgICAgICAgIHNob3J0UGllY2VzW2ldID0gcmVnZXhFc2NhcGUoc2hvcnRQaWVjZXNbaV0pO1xuICAgICAgICAgICAgbG9uZ1BpZWNlc1tpXSA9IHJlZ2V4RXNjYXBlKGxvbmdQaWVjZXNbaV0pO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCAyNDsgaSsrKSB7XG4gICAgICAgICAgICBtaXhlZFBpZWNlc1tpXSA9IHJlZ2V4RXNjYXBlKG1peGVkUGllY2VzW2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX21vbnRoc1JlZ2V4ID0gbmV3IFJlZ0V4cCgnXignICsgbWl4ZWRQaWVjZXMuam9pbignfCcpICsgJyknLCAnaScpO1xuICAgICAgICB0aGlzLl9tb250aHNTaG9ydFJlZ2V4ID0gdGhpcy5fbW9udGhzUmVnZXg7XG4gICAgICAgIHRoaXMuX21vbnRoc1N0cmljdFJlZ2V4ID0gbmV3IFJlZ0V4cChcbiAgICAgICAgICAgICdeKCcgKyBsb25nUGllY2VzLmpvaW4oJ3wnKSArICcpJyxcbiAgICAgICAgICAgICdpJ1xuICAgICAgICApO1xuICAgICAgICB0aGlzLl9tb250aHNTaG9ydFN0cmljdFJlZ2V4ID0gbmV3IFJlZ0V4cChcbiAgICAgICAgICAgICdeKCcgKyBzaG9ydFBpZWNlcy5qb2luKCd8JykgKyAnKScsXG4gICAgICAgICAgICAnaSdcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBGT1JNQVRUSU5HXG5cbiAgICBhZGRGb3JtYXRUb2tlbignWScsIDAsIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHkgPSB0aGlzLnllYXIoKTtcbiAgICAgICAgcmV0dXJuIHkgPD0gOTk5OSA/IHplcm9GaWxsKHksIDQpIDogJysnICsgeTtcbiAgICB9KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnWVknLCAyXSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy55ZWFyKCkgJSAxMDA7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1lZWVknLCA0XSwgMCwgJ3llYXInKTtcbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1lZWVlZJywgNV0sIDAsICd5ZWFyJyk7XG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydZWVlZWVknLCA2LCB0cnVlXSwgMCwgJ3llYXInKTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygneWVhcicsICd5Jyk7XG5cbiAgICAvLyBQUklPUklUSUVTXG5cbiAgICBhZGRVbml0UHJpb3JpdHkoJ3llYXInLCAxKTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ1knLCBtYXRjaFNpZ25lZCk7XG4gICAgYWRkUmVnZXhUb2tlbignWVknLCBtYXRjaDF0bzIsIG1hdGNoMik7XG4gICAgYWRkUmVnZXhUb2tlbignWVlZWScsIG1hdGNoMXRvNCwgbWF0Y2g0KTtcbiAgICBhZGRSZWdleFRva2VuKCdZWVlZWScsIG1hdGNoMXRvNiwgbWF0Y2g2KTtcbiAgICBhZGRSZWdleFRva2VuKCdZWVlZWVknLCBtYXRjaDF0bzYsIG1hdGNoNik7XG5cbiAgICBhZGRQYXJzZVRva2VuKFsnWVlZWVknLCAnWVlZWVlZJ10sIFlFQVIpO1xuICAgIGFkZFBhcnNlVG9rZW4oJ1lZWVknLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5KSB7XG4gICAgICAgIGFycmF5W1lFQVJdID1cbiAgICAgICAgICAgIGlucHV0Lmxlbmd0aCA9PT0gMiA/IGhvb2tzLnBhcnNlVHdvRGlnaXRZZWFyKGlucHV0KSA6IHRvSW50KGlucHV0KTtcbiAgICB9KTtcbiAgICBhZGRQYXJzZVRva2VuKCdZWScsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXkpIHtcbiAgICAgICAgYXJyYXlbWUVBUl0gPSBob29rcy5wYXJzZVR3b0RpZ2l0WWVhcihpbnB1dCk7XG4gICAgfSk7XG4gICAgYWRkUGFyc2VUb2tlbignWScsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXkpIHtcbiAgICAgICAgYXJyYXlbWUVBUl0gPSBwYXJzZUludChpbnB1dCwgMTApO1xuICAgIH0pO1xuXG4gICAgLy8gSEVMUEVSU1xuXG4gICAgZnVuY3Rpb24gZGF5c0luWWVhcih5ZWFyKSB7XG4gICAgICAgIHJldHVybiBpc0xlYXBZZWFyKHllYXIpID8gMzY2IDogMzY1O1xuICAgIH1cblxuICAgIC8vIEhPT0tTXG5cbiAgICBob29rcy5wYXJzZVR3b0RpZ2l0WWVhciA9IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgICByZXR1cm4gdG9JbnQoaW5wdXQpICsgKHRvSW50KGlucHV0KSA+IDY4ID8gMTkwMCA6IDIwMDApO1xuICAgIH07XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICB2YXIgZ2V0U2V0WWVhciA9IG1ha2VHZXRTZXQoJ0Z1bGxZZWFyJywgdHJ1ZSk7XG5cbiAgICBmdW5jdGlvbiBnZXRJc0xlYXBZZWFyKCkge1xuICAgICAgICByZXR1cm4gaXNMZWFwWWVhcih0aGlzLnllYXIoKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlRGF0ZSh5LCBtLCBkLCBoLCBNLCBzLCBtcykge1xuICAgICAgICAvLyBjYW4ndCBqdXN0IGFwcGx5KCkgdG8gY3JlYXRlIGEgZGF0ZTpcbiAgICAgICAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xLzE4MTM0OFxuICAgICAgICB2YXIgZGF0ZTtcbiAgICAgICAgLy8gdGhlIGRhdGUgY29uc3RydWN0b3IgcmVtYXBzIHllYXJzIDAtOTkgdG8gMTkwMC0xOTk5XG4gICAgICAgIGlmICh5IDwgMTAwICYmIHkgPj0gMCkge1xuICAgICAgICAgICAgLy8gcHJlc2VydmUgbGVhcCB5ZWFycyB1c2luZyBhIGZ1bGwgNDAwIHllYXIgY3ljbGUsIHRoZW4gcmVzZXRcbiAgICAgICAgICAgIGRhdGUgPSBuZXcgRGF0ZSh5ICsgNDAwLCBtLCBkLCBoLCBNLCBzLCBtcyk7XG4gICAgICAgICAgICBpZiAoaXNGaW5pdGUoZGF0ZS5nZXRGdWxsWWVhcigpKSkge1xuICAgICAgICAgICAgICAgIGRhdGUuc2V0RnVsbFllYXIoeSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkYXRlID0gbmV3IERhdGUoeSwgbSwgZCwgaCwgTSwgcywgbXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRhdGU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlVVRDRGF0ZSh5KSB7XG4gICAgICAgIHZhciBkYXRlLCBhcmdzO1xuICAgICAgICAvLyB0aGUgRGF0ZS5VVEMgZnVuY3Rpb24gcmVtYXBzIHllYXJzIDAtOTkgdG8gMTkwMC0xOTk5XG4gICAgICAgIGlmICh5IDwgMTAwICYmIHkgPj0gMCkge1xuICAgICAgICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAvLyBwcmVzZXJ2ZSBsZWFwIHllYXJzIHVzaW5nIGEgZnVsbCA0MDAgeWVhciBjeWNsZSwgdGhlbiByZXNldFxuICAgICAgICAgICAgYXJnc1swXSA9IHkgKyA0MDA7XG4gICAgICAgICAgICBkYXRlID0gbmV3IERhdGUoRGF0ZS5VVEMuYXBwbHkobnVsbCwgYXJncykpO1xuICAgICAgICAgICAgaWYgKGlzRmluaXRlKGRhdGUuZ2V0VVRDRnVsbFllYXIoKSkpIHtcbiAgICAgICAgICAgICAgICBkYXRlLnNldFVUQ0Z1bGxZZWFyKHkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGF0ZSA9IG5ldyBEYXRlKERhdGUuVVRDLmFwcGx5KG51bGwsIGFyZ3VtZW50cykpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRhdGU7XG4gICAgfVxuXG4gICAgLy8gc3RhcnQtb2YtZmlyc3Qtd2VlayAtIHN0YXJ0LW9mLXllYXJcbiAgICBmdW5jdGlvbiBmaXJzdFdlZWtPZmZzZXQoeWVhciwgZG93LCBkb3kpIHtcbiAgICAgICAgdmFyIC8vIGZpcnN0LXdlZWsgZGF5IC0tIHdoaWNoIGphbnVhcnkgaXMgYWx3YXlzIGluIHRoZSBmaXJzdCB3ZWVrICg0IGZvciBpc28sIDEgZm9yIG90aGVyKVxuICAgICAgICAgICAgZndkID0gNyArIGRvdyAtIGRveSxcbiAgICAgICAgICAgIC8vIGZpcnN0LXdlZWsgZGF5IGxvY2FsIHdlZWtkYXkgLS0gd2hpY2ggbG9jYWwgd2Vla2RheSBpcyBmd2RcbiAgICAgICAgICAgIGZ3ZGx3ID0gKDcgKyBjcmVhdGVVVENEYXRlKHllYXIsIDAsIGZ3ZCkuZ2V0VVRDRGF5KCkgLSBkb3cpICUgNztcblxuICAgICAgICByZXR1cm4gLWZ3ZGx3ICsgZndkIC0gMTtcbiAgICB9XG5cbiAgICAvLyBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9JU09fd2Vla19kYXRlI0NhbGN1bGF0aW5nX2FfZGF0ZV9naXZlbl90aGVfeWVhci4yQ193ZWVrX251bWJlcl9hbmRfd2Vla2RheVxuICAgIGZ1bmN0aW9uIGRheU9mWWVhckZyb21XZWVrcyh5ZWFyLCB3ZWVrLCB3ZWVrZGF5LCBkb3csIGRveSkge1xuICAgICAgICB2YXIgbG9jYWxXZWVrZGF5ID0gKDcgKyB3ZWVrZGF5IC0gZG93KSAlIDcsXG4gICAgICAgICAgICB3ZWVrT2Zmc2V0ID0gZmlyc3RXZWVrT2Zmc2V0KHllYXIsIGRvdywgZG95KSxcbiAgICAgICAgICAgIGRheU9mWWVhciA9IDEgKyA3ICogKHdlZWsgLSAxKSArIGxvY2FsV2Vla2RheSArIHdlZWtPZmZzZXQsXG4gICAgICAgICAgICByZXNZZWFyLFxuICAgICAgICAgICAgcmVzRGF5T2ZZZWFyO1xuXG4gICAgICAgIGlmIChkYXlPZlllYXIgPD0gMCkge1xuICAgICAgICAgICAgcmVzWWVhciA9IHllYXIgLSAxO1xuICAgICAgICAgICAgcmVzRGF5T2ZZZWFyID0gZGF5c0luWWVhcihyZXNZZWFyKSArIGRheU9mWWVhcjtcbiAgICAgICAgfSBlbHNlIGlmIChkYXlPZlllYXIgPiBkYXlzSW5ZZWFyKHllYXIpKSB7XG4gICAgICAgICAgICByZXNZZWFyID0geWVhciArIDE7XG4gICAgICAgICAgICByZXNEYXlPZlllYXIgPSBkYXlPZlllYXIgLSBkYXlzSW5ZZWFyKHllYXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzWWVhciA9IHllYXI7XG4gICAgICAgICAgICByZXNEYXlPZlllYXIgPSBkYXlPZlllYXI7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeWVhcjogcmVzWWVhcixcbiAgICAgICAgICAgIGRheU9mWWVhcjogcmVzRGF5T2ZZZWFyLFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHdlZWtPZlllYXIobW9tLCBkb3csIGRveSkge1xuICAgICAgICB2YXIgd2Vla09mZnNldCA9IGZpcnN0V2Vla09mZnNldChtb20ueWVhcigpLCBkb3csIGRveSksXG4gICAgICAgICAgICB3ZWVrID0gTWF0aC5mbG9vcigobW9tLmRheU9mWWVhcigpIC0gd2Vla09mZnNldCAtIDEpIC8gNykgKyAxLFxuICAgICAgICAgICAgcmVzV2VlayxcbiAgICAgICAgICAgIHJlc1llYXI7XG5cbiAgICAgICAgaWYgKHdlZWsgPCAxKSB7XG4gICAgICAgICAgICByZXNZZWFyID0gbW9tLnllYXIoKSAtIDE7XG4gICAgICAgICAgICByZXNXZWVrID0gd2VlayArIHdlZWtzSW5ZZWFyKHJlc1llYXIsIGRvdywgZG95KTtcbiAgICAgICAgfSBlbHNlIGlmICh3ZWVrID4gd2Vla3NJblllYXIobW9tLnllYXIoKSwgZG93LCBkb3kpKSB7XG4gICAgICAgICAgICByZXNXZWVrID0gd2VlayAtIHdlZWtzSW5ZZWFyKG1vbS55ZWFyKCksIGRvdywgZG95KTtcbiAgICAgICAgICAgIHJlc1llYXIgPSBtb20ueWVhcigpICsgMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc1llYXIgPSBtb20ueWVhcigpO1xuICAgICAgICAgICAgcmVzV2VlayA9IHdlZWs7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgd2VlazogcmVzV2VlayxcbiAgICAgICAgICAgIHllYXI6IHJlc1llYXIsXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gd2Vla3NJblllYXIoeWVhciwgZG93LCBkb3kpIHtcbiAgICAgICAgdmFyIHdlZWtPZmZzZXQgPSBmaXJzdFdlZWtPZmZzZXQoeWVhciwgZG93LCBkb3kpLFxuICAgICAgICAgICAgd2Vla09mZnNldE5leHQgPSBmaXJzdFdlZWtPZmZzZXQoeWVhciArIDEsIGRvdywgZG95KTtcbiAgICAgICAgcmV0dXJuIChkYXlzSW5ZZWFyKHllYXIpIC0gd2Vla09mZnNldCArIHdlZWtPZmZzZXROZXh0KSAvIDc7XG4gICAgfVxuXG4gICAgLy8gRk9STUFUVElOR1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ3cnLCBbJ3d3JywgMl0sICd3bycsICd3ZWVrJyk7XG4gICAgYWRkRm9ybWF0VG9rZW4oJ1cnLCBbJ1dXJywgMl0sICdXbycsICdpc29XZWVrJyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ3dlZWsnLCAndycpO1xuICAgIGFkZFVuaXRBbGlhcygnaXNvV2VlaycsICdXJyk7XG5cbiAgICAvLyBQUklPUklUSUVTXG5cbiAgICBhZGRVbml0UHJpb3JpdHkoJ3dlZWsnLCA1KTtcbiAgICBhZGRVbml0UHJpb3JpdHkoJ2lzb1dlZWsnLCA1KTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ3cnLCBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ3d3JywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1cnLCBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1dXJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuXG4gICAgYWRkV2Vla1BhcnNlVG9rZW4oWyd3JywgJ3d3JywgJ1cnLCAnV1cnXSwgZnVuY3Rpb24gKFxuICAgICAgICBpbnB1dCxcbiAgICAgICAgd2VlayxcbiAgICAgICAgY29uZmlnLFxuICAgICAgICB0b2tlblxuICAgICkge1xuICAgICAgICB3ZWVrW3Rva2VuLnN1YnN0cigwLCAxKV0gPSB0b0ludChpbnB1dCk7XG4gICAgfSk7XG5cbiAgICAvLyBIRUxQRVJTXG5cbiAgICAvLyBMT0NBTEVTXG5cbiAgICBmdW5jdGlvbiBsb2NhbGVXZWVrKG1vbSkge1xuICAgICAgICByZXR1cm4gd2Vla09mWWVhcihtb20sIHRoaXMuX3dlZWsuZG93LCB0aGlzLl93ZWVrLmRveSkud2VlaztcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdExvY2FsZVdlZWsgPSB7XG4gICAgICAgIGRvdzogMCwgLy8gU3VuZGF5IGlzIHRoZSBmaXJzdCBkYXkgb2YgdGhlIHdlZWsuXG4gICAgICAgIGRveTogNiwgLy8gVGhlIHdlZWsgdGhhdCBjb250YWlucyBKYW4gNnRoIGlzIHRoZSBmaXJzdCB3ZWVrIG9mIHRoZSB5ZWFyLlxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBsb2NhbGVGaXJzdERheU9mV2VlaygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWsuZG93O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvY2FsZUZpcnN0RGF5T2ZZZWFyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fd2Vlay5kb3k7XG4gICAgfVxuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgZnVuY3Rpb24gZ2V0U2V0V2VlayhpbnB1dCkge1xuICAgICAgICB2YXIgd2VlayA9IHRoaXMubG9jYWxlRGF0YSgpLndlZWsodGhpcyk7XG4gICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gd2VlayA6IHRoaXMuYWRkKChpbnB1dCAtIHdlZWspICogNywgJ2QnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRTZXRJU09XZWVrKGlucHV0KSB7XG4gICAgICAgIHZhciB3ZWVrID0gd2Vla09mWWVhcih0aGlzLCAxLCA0KS53ZWVrO1xuICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IHdlZWsgOiB0aGlzLmFkZCgoaW5wdXQgLSB3ZWVrKSAqIDcsICdkJyk7XG4gICAgfVxuXG4gICAgLy8gRk9STUFUVElOR1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ2QnLCAwLCAnZG8nLCAnZGF5Jyk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbignZGQnLCAwLCAwLCBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS53ZWVrZGF5c01pbih0aGlzLCBmb3JtYXQpO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ2RkZCcsIDAsIDAsIGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLndlZWtkYXlzU2hvcnQodGhpcywgZm9ybWF0KTtcbiAgICB9KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdkZGRkJywgMCwgMCwgZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkud2Vla2RheXModGhpcywgZm9ybWF0KTtcbiAgICB9KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdlJywgMCwgMCwgJ3dlZWtkYXknKTtcbiAgICBhZGRGb3JtYXRUb2tlbignRScsIDAsIDAsICdpc29XZWVrZGF5Jyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ2RheScsICdkJyk7XG4gICAgYWRkVW5pdEFsaWFzKCd3ZWVrZGF5JywgJ2UnKTtcbiAgICBhZGRVbml0QWxpYXMoJ2lzb1dlZWtkYXknLCAnRScpO1xuXG4gICAgLy8gUFJJT1JJVFlcbiAgICBhZGRVbml0UHJpb3JpdHkoJ2RheScsIDExKTtcbiAgICBhZGRVbml0UHJpb3JpdHkoJ3dlZWtkYXknLCAxMSk7XG4gICAgYWRkVW5pdFByaW9yaXR5KCdpc29XZWVrZGF5JywgMTEpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignZCcsIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignZScsIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignRScsIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignZGQnLCBmdW5jdGlvbiAoaXNTdHJpY3QsIGxvY2FsZSkge1xuICAgICAgICByZXR1cm4gbG9jYWxlLndlZWtkYXlzTWluUmVnZXgoaXNTdHJpY3QpO1xuICAgIH0pO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ2RkZCcsIGZ1bmN0aW9uIChpc1N0cmljdCwgbG9jYWxlKSB7XG4gICAgICAgIHJldHVybiBsb2NhbGUud2Vla2RheXNTaG9ydFJlZ2V4KGlzU3RyaWN0KTtcbiAgICB9KTtcbiAgICBhZGRSZWdleFRva2VuKCdkZGRkJywgZnVuY3Rpb24gKGlzU3RyaWN0LCBsb2NhbGUpIHtcbiAgICAgICAgcmV0dXJuIGxvY2FsZS53ZWVrZGF5c1JlZ2V4KGlzU3RyaWN0KTtcbiAgICB9KTtcblxuICAgIGFkZFdlZWtQYXJzZVRva2VuKFsnZGQnLCAnZGRkJywgJ2RkZGQnXSwgZnVuY3Rpb24gKGlucHV0LCB3ZWVrLCBjb25maWcsIHRva2VuKSB7XG4gICAgICAgIHZhciB3ZWVrZGF5ID0gY29uZmlnLl9sb2NhbGUud2Vla2RheXNQYXJzZShpbnB1dCwgdG9rZW4sIGNvbmZpZy5fc3RyaWN0KTtcbiAgICAgICAgLy8gaWYgd2UgZGlkbid0IGdldCBhIHdlZWtkYXkgbmFtZSwgbWFyayB0aGUgZGF0ZSBhcyBpbnZhbGlkXG4gICAgICAgIGlmICh3ZWVrZGF5ICE9IG51bGwpIHtcbiAgICAgICAgICAgIHdlZWsuZCA9IHdlZWtkYXk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5pbnZhbGlkV2Vla2RheSA9IGlucHV0O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBhZGRXZWVrUGFyc2VUb2tlbihbJ2QnLCAnZScsICdFJ10sIGZ1bmN0aW9uIChpbnB1dCwgd2VlaywgY29uZmlnLCB0b2tlbikge1xuICAgICAgICB3ZWVrW3Rva2VuXSA9IHRvSW50KGlucHV0KTtcbiAgICB9KTtcblxuICAgIC8vIEhFTFBFUlNcblxuICAgIGZ1bmN0aW9uIHBhcnNlV2Vla2RheShpbnB1dCwgbG9jYWxlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaW5wdXQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlzTmFOKGlucHV0KSkge1xuICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KGlucHV0LCAxMCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbnB1dCA9IGxvY2FsZS53ZWVrZGF5c1BhcnNlKGlucHV0KTtcbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlSXNvV2Vla2RheShpbnB1dCwgbG9jYWxlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gbG9jYWxlLndlZWtkYXlzUGFyc2UoaW5wdXQpICUgNyB8fCA3O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpc05hTihpbnB1dCkgPyBudWxsIDogaW5wdXQ7XG4gICAgfVxuXG4gICAgLy8gTE9DQUxFU1xuICAgIGZ1bmN0aW9uIHNoaWZ0V2Vla2RheXMod3MsIG4pIHtcbiAgICAgICAgcmV0dXJuIHdzLnNsaWNlKG4sIDcpLmNvbmNhdCh3cy5zbGljZSgwLCBuKSk7XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRMb2NhbGVXZWVrZGF5cyA9ICdTdW5kYXlfTW9uZGF5X1R1ZXNkYXlfV2VkbmVzZGF5X1RodXJzZGF5X0ZyaWRheV9TYXR1cmRheScuc3BsaXQoXG4gICAgICAgICAgICAnXydcbiAgICAgICAgKSxcbiAgICAgICAgZGVmYXVsdExvY2FsZVdlZWtkYXlzU2hvcnQgPSAnU3VuX01vbl9UdWVfV2VkX1RodV9GcmlfU2F0Jy5zcGxpdCgnXycpLFxuICAgICAgICBkZWZhdWx0TG9jYWxlV2Vla2RheXNNaW4gPSAnU3VfTW9fVHVfV2VfVGhfRnJfU2EnLnNwbGl0KCdfJyksXG4gICAgICAgIGRlZmF1bHRXZWVrZGF5c1JlZ2V4ID0gbWF0Y2hXb3JkLFxuICAgICAgICBkZWZhdWx0V2Vla2RheXNTaG9ydFJlZ2V4ID0gbWF0Y2hXb3JkLFxuICAgICAgICBkZWZhdWx0V2Vla2RheXNNaW5SZWdleCA9IG1hdGNoV29yZDtcblxuICAgIGZ1bmN0aW9uIGxvY2FsZVdlZWtkYXlzKG0sIGZvcm1hdCkge1xuICAgICAgICB2YXIgd2Vla2RheXMgPSBpc0FycmF5KHRoaXMuX3dlZWtkYXlzKVxuICAgICAgICAgICAgPyB0aGlzLl93ZWVrZGF5c1xuICAgICAgICAgICAgOiB0aGlzLl93ZWVrZGF5c1tcbiAgICAgICAgICAgICAgICAgIG0gJiYgbSAhPT0gdHJ1ZSAmJiB0aGlzLl93ZWVrZGF5cy5pc0Zvcm1hdC50ZXN0KGZvcm1hdClcbiAgICAgICAgICAgICAgICAgICAgICA/ICdmb3JtYXQnXG4gICAgICAgICAgICAgICAgICAgICAgOiAnc3RhbmRhbG9uZSdcbiAgICAgICAgICAgICAgXTtcbiAgICAgICAgcmV0dXJuIG0gPT09IHRydWVcbiAgICAgICAgICAgID8gc2hpZnRXZWVrZGF5cyh3ZWVrZGF5cywgdGhpcy5fd2Vlay5kb3cpXG4gICAgICAgICAgICA6IG1cbiAgICAgICAgICAgID8gd2Vla2RheXNbbS5kYXkoKV1cbiAgICAgICAgICAgIDogd2Vla2RheXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9jYWxlV2Vla2RheXNTaG9ydChtKSB7XG4gICAgICAgIHJldHVybiBtID09PSB0cnVlXG4gICAgICAgICAgICA/IHNoaWZ0V2Vla2RheXModGhpcy5fd2Vla2RheXNTaG9ydCwgdGhpcy5fd2Vlay5kb3cpXG4gICAgICAgICAgICA6IG1cbiAgICAgICAgICAgID8gdGhpcy5fd2Vla2RheXNTaG9ydFttLmRheSgpXVxuICAgICAgICAgICAgOiB0aGlzLl93ZWVrZGF5c1Nob3J0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvY2FsZVdlZWtkYXlzTWluKG0pIHtcbiAgICAgICAgcmV0dXJuIG0gPT09IHRydWVcbiAgICAgICAgICAgID8gc2hpZnRXZWVrZGF5cyh0aGlzLl93ZWVrZGF5c01pbiwgdGhpcy5fd2Vlay5kb3cpXG4gICAgICAgICAgICA6IG1cbiAgICAgICAgICAgID8gdGhpcy5fd2Vla2RheXNNaW5bbS5kYXkoKV1cbiAgICAgICAgICAgIDogdGhpcy5fd2Vla2RheXNNaW47XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGFuZGxlU3RyaWN0UGFyc2UkMSh3ZWVrZGF5TmFtZSwgZm9ybWF0LCBzdHJpY3QpIHtcbiAgICAgICAgdmFyIGksXG4gICAgICAgICAgICBpaSxcbiAgICAgICAgICAgIG1vbSxcbiAgICAgICAgICAgIGxsYyA9IHdlZWtkYXlOYW1lLnRvTG9jYWxlTG93ZXJDYXNlKCk7XG4gICAgICAgIGlmICghdGhpcy5fd2Vla2RheXNQYXJzZSkge1xuICAgICAgICAgICAgdGhpcy5fd2Vla2RheXNQYXJzZSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5fc2hvcnRXZWVrZGF5c1BhcnNlID0gW107XG4gICAgICAgICAgICB0aGlzLl9taW5XZWVrZGF5c1BhcnNlID0gW107XG5cbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCA3OyArK2kpIHtcbiAgICAgICAgICAgICAgICBtb20gPSBjcmVhdGVVVEMoWzIwMDAsIDFdKS5kYXkoaSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fbWluV2Vla2RheXNQYXJzZVtpXSA9IHRoaXMud2Vla2RheXNNaW4oXG4gICAgICAgICAgICAgICAgICAgIG1vbSxcbiAgICAgICAgICAgICAgICAgICAgJydcbiAgICAgICAgICAgICAgICApLnRvTG9jYWxlTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2hvcnRXZWVrZGF5c1BhcnNlW2ldID0gdGhpcy53ZWVrZGF5c1Nob3J0KFxuICAgICAgICAgICAgICAgICAgICBtb20sXG4gICAgICAgICAgICAgICAgICAgICcnXG4gICAgICAgICAgICAgICAgKS50b0xvY2FsZUxvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlZWtkYXlzUGFyc2VbaV0gPSB0aGlzLndlZWtkYXlzKG1vbSwgJycpLnRvTG9jYWxlTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3RyaWN0KSB7XG4gICAgICAgICAgICBpZiAoZm9ybWF0ID09PSAnZGRkZCcpIHtcbiAgICAgICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl93ZWVrZGF5c1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgICAgIHJldHVybiBpaSAhPT0gLTEgPyBpaSA6IG51bGw7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZvcm1hdCA9PT0gJ2RkZCcpIHtcbiAgICAgICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl9zaG9ydFdlZWtkYXlzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlpICE9PSAtMSA/IGlpIDogbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fbWluV2Vla2RheXNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaWkgIT09IC0xID8gaWkgOiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGZvcm1hdCA9PT0gJ2RkZGQnKSB7XG4gICAgICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fd2Vla2RheXNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgICAgICBpZiAoaWkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fc2hvcnRXZWVrZGF5c1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgICAgIGlmIChpaSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl9taW5XZWVrZGF5c1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgICAgIHJldHVybiBpaSAhPT0gLTEgPyBpaSA6IG51bGw7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZvcm1hdCA9PT0gJ2RkZCcpIHtcbiAgICAgICAgICAgICAgICBpaSA9IGluZGV4T2YuY2FsbCh0aGlzLl9zaG9ydFdlZWtkYXlzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICAgICAgaWYgKGlpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaWk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX3dlZWtkYXlzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICAgICAgaWYgKGlpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaWk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlpID0gaW5kZXhPZi5jYWxsKHRoaXMuX21pbldlZWtkYXlzUGFyc2UsIGxsYyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlpICE9PSAtMSA/IGlpIDogbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fbWluV2Vla2RheXNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgICAgICBpZiAoaWkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fd2Vla2RheXNQYXJzZSwgbGxjKTtcbiAgICAgICAgICAgICAgICBpZiAoaWkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWkgPSBpbmRleE9mLmNhbGwodGhpcy5fc2hvcnRXZWVrZGF5c1BhcnNlLCBsbGMpO1xuICAgICAgICAgICAgICAgIHJldHVybiBpaSAhPT0gLTEgPyBpaSA6IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2NhbGVXZWVrZGF5c1BhcnNlKHdlZWtkYXlOYW1lLCBmb3JtYXQsIHN0cmljdCkge1xuICAgICAgICB2YXIgaSwgbW9tLCByZWdleDtcblxuICAgICAgICBpZiAodGhpcy5fd2Vla2RheXNQYXJzZUV4YWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gaGFuZGxlU3RyaWN0UGFyc2UkMS5jYWxsKHRoaXMsIHdlZWtkYXlOYW1lLCBmb3JtYXQsIHN0cmljdCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuX3dlZWtkYXlzUGFyc2UpIHtcbiAgICAgICAgICAgIHRoaXMuX3dlZWtkYXlzUGFyc2UgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuX21pbldlZWtkYXlzUGFyc2UgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuX3Nob3J0V2Vla2RheXNQYXJzZSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5fZnVsbFdlZWtkYXlzUGFyc2UgPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCA3OyBpKyspIHtcbiAgICAgICAgICAgIC8vIG1ha2UgdGhlIHJlZ2V4IGlmIHdlIGRvbid0IGhhdmUgaXQgYWxyZWFkeVxuXG4gICAgICAgICAgICBtb20gPSBjcmVhdGVVVEMoWzIwMDAsIDFdKS5kYXkoaSk7XG4gICAgICAgICAgICBpZiAoc3RyaWN0ICYmICF0aGlzLl9mdWxsV2Vla2RheXNQYXJzZVtpXSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2Z1bGxXZWVrZGF5c1BhcnNlW2ldID0gbmV3IFJlZ0V4cChcbiAgICAgICAgICAgICAgICAgICAgJ14nICsgdGhpcy53ZWVrZGF5cyhtb20sICcnKS5yZXBsYWNlKCcuJywgJ1xcXFwuPycpICsgJyQnLFxuICAgICAgICAgICAgICAgICAgICAnaSdcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHRoaXMuX3Nob3J0V2Vla2RheXNQYXJzZVtpXSA9IG5ldyBSZWdFeHAoXG4gICAgICAgICAgICAgICAgICAgICdeJyArIHRoaXMud2Vla2RheXNTaG9ydChtb20sICcnKS5yZXBsYWNlKCcuJywgJ1xcXFwuPycpICsgJyQnLFxuICAgICAgICAgICAgICAgICAgICAnaSdcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHRoaXMuX21pbldlZWtkYXlzUGFyc2VbaV0gPSBuZXcgUmVnRXhwKFxuICAgICAgICAgICAgICAgICAgICAnXicgKyB0aGlzLndlZWtkYXlzTWluKG1vbSwgJycpLnJlcGxhY2UoJy4nLCAnXFxcXC4/JykgKyAnJCcsXG4gICAgICAgICAgICAgICAgICAgICdpJ1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXRoaXMuX3dlZWtkYXlzUGFyc2VbaV0pIHtcbiAgICAgICAgICAgICAgICByZWdleCA9XG4gICAgICAgICAgICAgICAgICAgICdeJyArXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2Vla2RheXMobW9tLCAnJykgK1xuICAgICAgICAgICAgICAgICAgICAnfF4nICtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53ZWVrZGF5c1Nob3J0KG1vbSwgJycpICtcbiAgICAgICAgICAgICAgICAgICAgJ3xeJyArXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2Vla2RheXNNaW4obW9tLCAnJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fd2Vla2RheXNQYXJzZVtpXSA9IG5ldyBSZWdFeHAocmVnZXgucmVwbGFjZSgnLicsICcnKSwgJ2knKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHRlc3QgdGhlIHJlZ2V4XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgc3RyaWN0ICYmXG4gICAgICAgICAgICAgICAgZm9ybWF0ID09PSAnZGRkZCcgJiZcbiAgICAgICAgICAgICAgICB0aGlzLl9mdWxsV2Vla2RheXNQYXJzZVtpXS50ZXN0KHdlZWtkYXlOYW1lKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgIHN0cmljdCAmJlxuICAgICAgICAgICAgICAgIGZvcm1hdCA9PT0gJ2RkZCcgJiZcbiAgICAgICAgICAgICAgICB0aGlzLl9zaG9ydFdlZWtkYXlzUGFyc2VbaV0udGVzdCh3ZWVrZGF5TmFtZSlcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICBzdHJpY3QgJiZcbiAgICAgICAgICAgICAgICBmb3JtYXQgPT09ICdkZCcgJiZcbiAgICAgICAgICAgICAgICB0aGlzLl9taW5XZWVrZGF5c1BhcnNlW2ldLnRlc3Qod2Vla2RheU5hbWUpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXN0cmljdCAmJiB0aGlzLl93ZWVrZGF5c1BhcnNlW2ldLnRlc3Qod2Vla2RheU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICBmdW5jdGlvbiBnZXRTZXREYXlPZldlZWsoaW5wdXQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0ICE9IG51bGwgPyB0aGlzIDogTmFOO1xuICAgICAgICB9XG4gICAgICAgIHZhciBkYXkgPSB0aGlzLl9pc1VUQyA/IHRoaXMuX2QuZ2V0VVRDRGF5KCkgOiB0aGlzLl9kLmdldERheSgpO1xuICAgICAgICBpZiAoaW5wdXQgIT0gbnVsbCkge1xuICAgICAgICAgICAgaW5wdXQgPSBwYXJzZVdlZWtkYXkoaW5wdXQsIHRoaXMubG9jYWxlRGF0YSgpKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmFkZChpbnB1dCAtIGRheSwgJ2QnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBkYXk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRTZXRMb2NhbGVEYXlPZldlZWsoaW5wdXQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0ICE9IG51bGwgPyB0aGlzIDogTmFOO1xuICAgICAgICB9XG4gICAgICAgIHZhciB3ZWVrZGF5ID0gKHRoaXMuZGF5KCkgKyA3IC0gdGhpcy5sb2NhbGVEYXRhKCkuX3dlZWsuZG93KSAlIDc7XG4gICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gd2Vla2RheSA6IHRoaXMuYWRkKGlucHV0IC0gd2Vla2RheSwgJ2QnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRTZXRJU09EYXlPZldlZWsoaW5wdXQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0ICE9IG51bGwgPyB0aGlzIDogTmFOO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gYmVoYXZlcyB0aGUgc2FtZSBhcyBtb21lbnQjZGF5IGV4Y2VwdFxuICAgICAgICAvLyBhcyBhIGdldHRlciwgcmV0dXJucyA3IGluc3RlYWQgb2YgMCAoMS03IHJhbmdlIGluc3RlYWQgb2YgMC02KVxuICAgICAgICAvLyBhcyBhIHNldHRlciwgc3VuZGF5IHNob3VsZCBiZWxvbmcgdG8gdGhlIHByZXZpb3VzIHdlZWsuXG5cbiAgICAgICAgaWYgKGlucHV0ICE9IG51bGwpIHtcbiAgICAgICAgICAgIHZhciB3ZWVrZGF5ID0gcGFyc2VJc29XZWVrZGF5KGlucHV0LCB0aGlzLmxvY2FsZURhdGEoKSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXkodGhpcy5kYXkoKSAlIDcgPyB3ZWVrZGF5IDogd2Vla2RheSAtIDcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF5KCkgfHwgNztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHdlZWtkYXlzUmVnZXgoaXNTdHJpY3QpIHtcbiAgICAgICAgaWYgKHRoaXMuX3dlZWtkYXlzUGFyc2VFeGFjdCkge1xuICAgICAgICAgICAgaWYgKCFoYXNPd25Qcm9wKHRoaXMsICdfd2Vla2RheXNSZWdleCcpKSB7XG4gICAgICAgICAgICAgICAgY29tcHV0ZVdlZWtkYXlzUGFyc2UuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpc1N0cmljdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c1N0cmljdFJlZ2V4O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fd2Vla2RheXNSZWdleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghaGFzT3duUHJvcCh0aGlzLCAnX3dlZWtkYXlzUmVnZXgnKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlZWtkYXlzUmVnZXggPSBkZWZhdWx0V2Vla2RheXNSZWdleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c1N0cmljdFJlZ2V4ICYmIGlzU3RyaWN0XG4gICAgICAgICAgICAgICAgPyB0aGlzLl93ZWVrZGF5c1N0cmljdFJlZ2V4XG4gICAgICAgICAgICAgICAgOiB0aGlzLl93ZWVrZGF5c1JlZ2V4O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gd2Vla2RheXNTaG9ydFJlZ2V4KGlzU3RyaWN0KSB7XG4gICAgICAgIGlmICh0aGlzLl93ZWVrZGF5c1BhcnNlRXhhY3QpIHtcbiAgICAgICAgICAgIGlmICghaGFzT3duUHJvcCh0aGlzLCAnX3dlZWtkYXlzUmVnZXgnKSkge1xuICAgICAgICAgICAgICAgIGNvbXB1dGVXZWVrZGF5c1BhcnNlLmNhbGwodGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXNTdHJpY3QpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fd2Vla2RheXNTaG9ydFN0cmljdFJlZ2V4O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fd2Vla2RheXNTaG9ydFJlZ2V4O1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCFoYXNPd25Qcm9wKHRoaXMsICdfd2Vla2RheXNTaG9ydFJlZ2V4JykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl93ZWVrZGF5c1Nob3J0UmVnZXggPSBkZWZhdWx0V2Vla2RheXNTaG9ydFJlZ2V4O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWtkYXlzU2hvcnRTdHJpY3RSZWdleCAmJiBpc1N0cmljdFxuICAgICAgICAgICAgICAgID8gdGhpcy5fd2Vla2RheXNTaG9ydFN0cmljdFJlZ2V4XG4gICAgICAgICAgICAgICAgOiB0aGlzLl93ZWVrZGF5c1Nob3J0UmVnZXg7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB3ZWVrZGF5c01pblJlZ2V4KGlzU3RyaWN0KSB7XG4gICAgICAgIGlmICh0aGlzLl93ZWVrZGF5c1BhcnNlRXhhY3QpIHtcbiAgICAgICAgICAgIGlmICghaGFzT3duUHJvcCh0aGlzLCAnX3dlZWtkYXlzUmVnZXgnKSkge1xuICAgICAgICAgICAgICAgIGNvbXB1dGVXZWVrZGF5c1BhcnNlLmNhbGwodGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXNTdHJpY3QpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fd2Vla2RheXNNaW5TdHJpY3RSZWdleDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWtkYXlzTWluUmVnZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIWhhc093blByb3AodGhpcywgJ193ZWVrZGF5c01pblJlZ2V4JykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl93ZWVrZGF5c01pblJlZ2V4ID0gZGVmYXVsdFdlZWtkYXlzTWluUmVnZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fd2Vla2RheXNNaW5TdHJpY3RSZWdleCAmJiBpc1N0cmljdFxuICAgICAgICAgICAgICAgID8gdGhpcy5fd2Vla2RheXNNaW5TdHJpY3RSZWdleFxuICAgICAgICAgICAgICAgIDogdGhpcy5fd2Vla2RheXNNaW5SZWdleDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbXB1dGVXZWVrZGF5c1BhcnNlKCkge1xuICAgICAgICBmdW5jdGlvbiBjbXBMZW5SZXYoYSwgYikge1xuICAgICAgICAgICAgcmV0dXJuIGIubGVuZ3RoIC0gYS5sZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbWluUGllY2VzID0gW10sXG4gICAgICAgICAgICBzaG9ydFBpZWNlcyA9IFtdLFxuICAgICAgICAgICAgbG9uZ1BpZWNlcyA9IFtdLFxuICAgICAgICAgICAgbWl4ZWRQaWVjZXMgPSBbXSxcbiAgICAgICAgICAgIGksXG4gICAgICAgICAgICBtb20sXG4gICAgICAgICAgICBtaW5wLFxuICAgICAgICAgICAgc2hvcnRwLFxuICAgICAgICAgICAgbG9uZ3A7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCA3OyBpKyspIHtcbiAgICAgICAgICAgIC8vIG1ha2UgdGhlIHJlZ2V4IGlmIHdlIGRvbid0IGhhdmUgaXQgYWxyZWFkeVxuICAgICAgICAgICAgbW9tID0gY3JlYXRlVVRDKFsyMDAwLCAxXSkuZGF5KGkpO1xuICAgICAgICAgICAgbWlucCA9IHJlZ2V4RXNjYXBlKHRoaXMud2Vla2RheXNNaW4obW9tLCAnJykpO1xuICAgICAgICAgICAgc2hvcnRwID0gcmVnZXhFc2NhcGUodGhpcy53ZWVrZGF5c1Nob3J0KG1vbSwgJycpKTtcbiAgICAgICAgICAgIGxvbmdwID0gcmVnZXhFc2NhcGUodGhpcy53ZWVrZGF5cyhtb20sICcnKSk7XG4gICAgICAgICAgICBtaW5QaWVjZXMucHVzaChtaW5wKTtcbiAgICAgICAgICAgIHNob3J0UGllY2VzLnB1c2goc2hvcnRwKTtcbiAgICAgICAgICAgIGxvbmdQaWVjZXMucHVzaChsb25ncCk7XG4gICAgICAgICAgICBtaXhlZFBpZWNlcy5wdXNoKG1pbnApO1xuICAgICAgICAgICAgbWl4ZWRQaWVjZXMucHVzaChzaG9ydHApO1xuICAgICAgICAgICAgbWl4ZWRQaWVjZXMucHVzaChsb25ncCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gU29ydGluZyBtYWtlcyBzdXJlIGlmIG9uZSB3ZWVrZGF5IChvciBhYmJyKSBpcyBhIHByZWZpeCBvZiBhbm90aGVyIGl0XG4gICAgICAgIC8vIHdpbGwgbWF0Y2ggdGhlIGxvbmdlciBwaWVjZS5cbiAgICAgICAgbWluUGllY2VzLnNvcnQoY21wTGVuUmV2KTtcbiAgICAgICAgc2hvcnRQaWVjZXMuc29ydChjbXBMZW5SZXYpO1xuICAgICAgICBsb25nUGllY2VzLnNvcnQoY21wTGVuUmV2KTtcbiAgICAgICAgbWl4ZWRQaWVjZXMuc29ydChjbXBMZW5SZXYpO1xuXG4gICAgICAgIHRoaXMuX3dlZWtkYXlzUmVnZXggPSBuZXcgUmVnRXhwKCdeKCcgKyBtaXhlZFBpZWNlcy5qb2luKCd8JykgKyAnKScsICdpJyk7XG4gICAgICAgIHRoaXMuX3dlZWtkYXlzU2hvcnRSZWdleCA9IHRoaXMuX3dlZWtkYXlzUmVnZXg7XG4gICAgICAgIHRoaXMuX3dlZWtkYXlzTWluUmVnZXggPSB0aGlzLl93ZWVrZGF5c1JlZ2V4O1xuXG4gICAgICAgIHRoaXMuX3dlZWtkYXlzU3RyaWN0UmVnZXggPSBuZXcgUmVnRXhwKFxuICAgICAgICAgICAgJ14oJyArIGxvbmdQaWVjZXMuam9pbignfCcpICsgJyknLFxuICAgICAgICAgICAgJ2knXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuX3dlZWtkYXlzU2hvcnRTdHJpY3RSZWdleCA9IG5ldyBSZWdFeHAoXG4gICAgICAgICAgICAnXignICsgc2hvcnRQaWVjZXMuam9pbignfCcpICsgJyknLFxuICAgICAgICAgICAgJ2knXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuX3dlZWtkYXlzTWluU3RyaWN0UmVnZXggPSBuZXcgUmVnRXhwKFxuICAgICAgICAgICAgJ14oJyArIG1pblBpZWNlcy5qb2luKCd8JykgKyAnKScsXG4gICAgICAgICAgICAnaSdcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBGT1JNQVRUSU5HXG5cbiAgICBmdW5jdGlvbiBoRm9ybWF0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5ob3VycygpICUgMTIgfHwgMTI7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24ga0Zvcm1hdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaG91cnMoKSB8fCAyNDtcbiAgICB9XG5cbiAgICBhZGRGb3JtYXRUb2tlbignSCcsIFsnSEgnLCAyXSwgMCwgJ2hvdXInKTtcbiAgICBhZGRGb3JtYXRUb2tlbignaCcsIFsnaGgnLCAyXSwgMCwgaEZvcm1hdCk7XG4gICAgYWRkRm9ybWF0VG9rZW4oJ2snLCBbJ2trJywgMl0sIDAsIGtGb3JtYXQpO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ2htbScsIDAsIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICcnICsgaEZvcm1hdC5hcHBseSh0aGlzKSArIHplcm9GaWxsKHRoaXMubWludXRlcygpLCAyKTtcbiAgICB9KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdobW1zcycsIDAsIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICcnICtcbiAgICAgICAgICAgIGhGb3JtYXQuYXBwbHkodGhpcykgK1xuICAgICAgICAgICAgemVyb0ZpbGwodGhpcy5taW51dGVzKCksIDIpICtcbiAgICAgICAgICAgIHplcm9GaWxsKHRoaXMuc2Vjb25kcygpLCAyKVxuICAgICAgICApO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ0htbScsIDAsIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICcnICsgdGhpcy5ob3VycygpICsgemVyb0ZpbGwodGhpcy5taW51dGVzKCksIDIpO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ0htbXNzJywgMCwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgJycgK1xuICAgICAgICAgICAgdGhpcy5ob3VycygpICtcbiAgICAgICAgICAgIHplcm9GaWxsKHRoaXMubWludXRlcygpLCAyKSArXG4gICAgICAgICAgICB6ZXJvRmlsbCh0aGlzLnNlY29uZHMoKSwgMilcbiAgICAgICAgKTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIG1lcmlkaWVtKHRva2VuLCBsb3dlcmNhc2UpIHtcbiAgICAgICAgYWRkRm9ybWF0VG9rZW4odG9rZW4sIDAsIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5tZXJpZGllbShcbiAgICAgICAgICAgICAgICB0aGlzLmhvdXJzKCksXG4gICAgICAgICAgICAgICAgdGhpcy5taW51dGVzKCksXG4gICAgICAgICAgICAgICAgbG93ZXJjYXNlXG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBtZXJpZGllbSgnYScsIHRydWUpO1xuICAgIG1lcmlkaWVtKCdBJywgZmFsc2UpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdob3VyJywgJ2gnKTtcblxuICAgIC8vIFBSSU9SSVRZXG4gICAgYWRkVW5pdFByaW9yaXR5KCdob3VyJywgMTMpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgZnVuY3Rpb24gbWF0Y2hNZXJpZGllbShpc1N0cmljdCwgbG9jYWxlKSB7XG4gICAgICAgIHJldHVybiBsb2NhbGUuX21lcmlkaWVtUGFyc2U7XG4gICAgfVxuXG4gICAgYWRkUmVnZXhUb2tlbignYScsIG1hdGNoTWVyaWRpZW0pO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0EnLCBtYXRjaE1lcmlkaWVtKTtcbiAgICBhZGRSZWdleFRva2VuKCdIJywgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdoJywgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdrJywgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdISCcsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRSZWdleFRva2VuKCdoaCcsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRSZWdleFRva2VuKCdraycsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ2htbScsIG1hdGNoM3RvNCk7XG4gICAgYWRkUmVnZXhUb2tlbignaG1tc3MnLCBtYXRjaDV0bzYpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0htbScsIG1hdGNoM3RvNCk7XG4gICAgYWRkUmVnZXhUb2tlbignSG1tc3MnLCBtYXRjaDV0bzYpO1xuXG4gICAgYWRkUGFyc2VUb2tlbihbJ0gnLCAnSEgnXSwgSE9VUik7XG4gICAgYWRkUGFyc2VUb2tlbihbJ2snLCAna2snXSwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgICAgIHZhciBrSW5wdXQgPSB0b0ludChpbnB1dCk7XG4gICAgICAgIGFycmF5W0hPVVJdID0ga0lucHV0ID09PSAyNCA/IDAgOiBrSW5wdXQ7XG4gICAgfSk7XG4gICAgYWRkUGFyc2VUb2tlbihbJ2EnLCAnQSddLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICAgICAgY29uZmlnLl9pc1BtID0gY29uZmlnLl9sb2NhbGUuaXNQTShpbnB1dCk7XG4gICAgICAgIGNvbmZpZy5fbWVyaWRpZW0gPSBpbnB1dDtcbiAgICB9KTtcbiAgICBhZGRQYXJzZVRva2VuKFsnaCcsICdoaCddLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICAgICAgYXJyYXlbSE9VUl0gPSB0b0ludChpbnB1dCk7XG4gICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmJpZ0hvdXIgPSB0cnVlO1xuICAgIH0pO1xuICAgIGFkZFBhcnNlVG9rZW4oJ2htbScsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgICAgICB2YXIgcG9zID0gaW5wdXQubGVuZ3RoIC0gMjtcbiAgICAgICAgYXJyYXlbSE9VUl0gPSB0b0ludChpbnB1dC5zdWJzdHIoMCwgcG9zKSk7XG4gICAgICAgIGFycmF5W01JTlVURV0gPSB0b0ludChpbnB1dC5zdWJzdHIocG9zKSk7XG4gICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmJpZ0hvdXIgPSB0cnVlO1xuICAgIH0pO1xuICAgIGFkZFBhcnNlVG9rZW4oJ2htbXNzJywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgICAgIHZhciBwb3MxID0gaW5wdXQubGVuZ3RoIC0gNCxcbiAgICAgICAgICAgIHBvczIgPSBpbnB1dC5sZW5ndGggLSAyO1xuICAgICAgICBhcnJheVtIT1VSXSA9IHRvSW50KGlucHV0LnN1YnN0cigwLCBwb3MxKSk7XG4gICAgICAgIGFycmF5W01JTlVURV0gPSB0b0ludChpbnB1dC5zdWJzdHIocG9zMSwgMikpO1xuICAgICAgICBhcnJheVtTRUNPTkRdID0gdG9JbnQoaW5wdXQuc3Vic3RyKHBvczIpKTtcbiAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuYmlnSG91ciA9IHRydWU7XG4gICAgfSk7XG4gICAgYWRkUGFyc2VUb2tlbignSG1tJywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgICAgIHZhciBwb3MgPSBpbnB1dC5sZW5ndGggLSAyO1xuICAgICAgICBhcnJheVtIT1VSXSA9IHRvSW50KGlucHV0LnN1YnN0cigwLCBwb3MpKTtcbiAgICAgICAgYXJyYXlbTUlOVVRFXSA9IHRvSW50KGlucHV0LnN1YnN0cihwb3MpKTtcbiAgICB9KTtcbiAgICBhZGRQYXJzZVRva2VuKCdIbW1zcycsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgICAgICB2YXIgcG9zMSA9IGlucHV0Lmxlbmd0aCAtIDQsXG4gICAgICAgICAgICBwb3MyID0gaW5wdXQubGVuZ3RoIC0gMjtcbiAgICAgICAgYXJyYXlbSE9VUl0gPSB0b0ludChpbnB1dC5zdWJzdHIoMCwgcG9zMSkpO1xuICAgICAgICBhcnJheVtNSU5VVEVdID0gdG9JbnQoaW5wdXQuc3Vic3RyKHBvczEsIDIpKTtcbiAgICAgICAgYXJyYXlbU0VDT05EXSA9IHRvSW50KGlucHV0LnN1YnN0cihwb3MyKSk7XG4gICAgfSk7XG5cbiAgICAvLyBMT0NBTEVTXG5cbiAgICBmdW5jdGlvbiBsb2NhbGVJc1BNKGlucHV0KSB7XG4gICAgICAgIC8vIElFOCBRdWlya3MgTW9kZSAmIElFNyBTdGFuZGFyZHMgTW9kZSBkbyBub3QgYWxsb3cgYWNjZXNzaW5nIHN0cmluZ3MgbGlrZSBhcnJheXNcbiAgICAgICAgLy8gVXNpbmcgY2hhckF0IHNob3VsZCBiZSBtb3JlIGNvbXBhdGlibGUuXG4gICAgICAgIHJldHVybiAoaW5wdXQgKyAnJykudG9Mb3dlckNhc2UoKS5jaGFyQXQoMCkgPT09ICdwJztcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdExvY2FsZU1lcmlkaWVtUGFyc2UgPSAvW2FwXVxcLj9tP1xcLj8vaSxcbiAgICAgICAgLy8gU2V0dGluZyB0aGUgaG91ciBzaG91bGQga2VlcCB0aGUgdGltZSwgYmVjYXVzZSB0aGUgdXNlciBleHBsaWNpdGx5XG4gICAgICAgIC8vIHNwZWNpZmllZCB3aGljaCBob3VyIHRoZXkgd2FudC4gU28gdHJ5aW5nIHRvIG1haW50YWluIHRoZSBzYW1lIGhvdXIgKGluXG4gICAgICAgIC8vIGEgbmV3IHRpbWV6b25lKSBtYWtlcyBzZW5zZS4gQWRkaW5nL3N1YnRyYWN0aW5nIGhvdXJzIGRvZXMgbm90IGZvbGxvd1xuICAgICAgICAvLyB0aGlzIHJ1bGUuXG4gICAgICAgIGdldFNldEhvdXIgPSBtYWtlR2V0U2V0KCdIb3VycycsIHRydWUpO1xuXG4gICAgZnVuY3Rpb24gbG9jYWxlTWVyaWRpZW0oaG91cnMsIG1pbnV0ZXMsIGlzTG93ZXIpIHtcbiAgICAgICAgaWYgKGhvdXJzID4gMTEpIHtcbiAgICAgICAgICAgIHJldHVybiBpc0xvd2VyID8gJ3BtJyA6ICdQTSc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gaXNMb3dlciA/ICdhbScgOiAnQU0nO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGJhc2VDb25maWcgPSB7XG4gICAgICAgIGNhbGVuZGFyOiBkZWZhdWx0Q2FsZW5kYXIsXG4gICAgICAgIGxvbmdEYXRlRm9ybWF0OiBkZWZhdWx0TG9uZ0RhdGVGb3JtYXQsXG4gICAgICAgIGludmFsaWREYXRlOiBkZWZhdWx0SW52YWxpZERhdGUsXG4gICAgICAgIG9yZGluYWw6IGRlZmF1bHRPcmRpbmFsLFxuICAgICAgICBkYXlPZk1vbnRoT3JkaW5hbFBhcnNlOiBkZWZhdWx0RGF5T2ZNb250aE9yZGluYWxQYXJzZSxcbiAgICAgICAgcmVsYXRpdmVUaW1lOiBkZWZhdWx0UmVsYXRpdmVUaW1lLFxuXG4gICAgICAgIG1vbnRoczogZGVmYXVsdExvY2FsZU1vbnRocyxcbiAgICAgICAgbW9udGhzU2hvcnQ6IGRlZmF1bHRMb2NhbGVNb250aHNTaG9ydCxcblxuICAgICAgICB3ZWVrOiBkZWZhdWx0TG9jYWxlV2VlayxcblxuICAgICAgICB3ZWVrZGF5czogZGVmYXVsdExvY2FsZVdlZWtkYXlzLFxuICAgICAgICB3ZWVrZGF5c01pbjogZGVmYXVsdExvY2FsZVdlZWtkYXlzTWluLFxuICAgICAgICB3ZWVrZGF5c1Nob3J0OiBkZWZhdWx0TG9jYWxlV2Vla2RheXNTaG9ydCxcblxuICAgICAgICBtZXJpZGllbVBhcnNlOiBkZWZhdWx0TG9jYWxlTWVyaWRpZW1QYXJzZSxcbiAgICB9O1xuXG4gICAgLy8gaW50ZXJuYWwgc3RvcmFnZSBmb3IgbG9jYWxlIGNvbmZpZyBmaWxlc1xuICAgIHZhciBsb2NhbGVzID0ge30sXG4gICAgICAgIGxvY2FsZUZhbWlsaWVzID0ge30sXG4gICAgICAgIGdsb2JhbExvY2FsZTtcblxuICAgIGZ1bmN0aW9uIGNvbW1vblByZWZpeChhcnIxLCBhcnIyKSB7XG4gICAgICAgIHZhciBpLFxuICAgICAgICAgICAgbWlubCA9IE1hdGgubWluKGFycjEubGVuZ3RoLCBhcnIyLmxlbmd0aCk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBtaW5sOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGlmIChhcnIxW2ldICE9PSBhcnIyW2ldKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1pbmw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbm9ybWFsaXplTG9jYWxlKGtleSkge1xuICAgICAgICByZXR1cm4ga2V5ID8ga2V5LnRvTG93ZXJDYXNlKCkucmVwbGFjZSgnXycsICctJykgOiBrZXk7XG4gICAgfVxuXG4gICAgLy8gcGljayB0aGUgbG9jYWxlIGZyb20gdGhlIGFycmF5XG4gICAgLy8gdHJ5IFsnZW4tYXUnLCAnZW4tZ2InXSBhcyAnZW4tYXUnLCAnZW4tZ2InLCAnZW4nLCBhcyBpbiBtb3ZlIHRocm91Z2ggdGhlIGxpc3QgdHJ5aW5nIGVhY2hcbiAgICAvLyBzdWJzdHJpbmcgZnJvbSBtb3N0IHNwZWNpZmljIHRvIGxlYXN0LCBidXQgbW92ZSB0byB0aGUgbmV4dCBhcnJheSBpdGVtIGlmIGl0J3MgYSBtb3JlIHNwZWNpZmljIHZhcmlhbnQgdGhhbiB0aGUgY3VycmVudCByb290XG4gICAgZnVuY3Rpb24gY2hvb3NlTG9jYWxlKG5hbWVzKSB7XG4gICAgICAgIHZhciBpID0gMCxcbiAgICAgICAgICAgIGosXG4gICAgICAgICAgICBuZXh0LFxuICAgICAgICAgICAgbG9jYWxlLFxuICAgICAgICAgICAgc3BsaXQ7XG5cbiAgICAgICAgd2hpbGUgKGkgPCBuYW1lcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHNwbGl0ID0gbm9ybWFsaXplTG9jYWxlKG5hbWVzW2ldKS5zcGxpdCgnLScpO1xuICAgICAgICAgICAgaiA9IHNwbGl0Lmxlbmd0aDtcbiAgICAgICAgICAgIG5leHQgPSBub3JtYWxpemVMb2NhbGUobmFtZXNbaSArIDFdKTtcbiAgICAgICAgICAgIG5leHQgPSBuZXh0ID8gbmV4dC5zcGxpdCgnLScpIDogbnVsbDtcbiAgICAgICAgICAgIHdoaWxlIChqID4gMCkge1xuICAgICAgICAgICAgICAgIGxvY2FsZSA9IGxvYWRMb2NhbGUoc3BsaXQuc2xpY2UoMCwgaikuam9pbignLScpKTtcbiAgICAgICAgICAgICAgICBpZiAobG9jYWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsb2NhbGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgbmV4dCAmJlxuICAgICAgICAgICAgICAgICAgICBuZXh0Lmxlbmd0aCA+PSBqICYmXG4gICAgICAgICAgICAgICAgICAgIGNvbW1vblByZWZpeChzcGxpdCwgbmV4dCkgPj0gaiAtIDFcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgLy90aGUgbmV4dCBhcnJheSBpdGVtIGlzIGJldHRlciB0aGFuIGEgc2hhbGxvd2VyIHN1YnN0cmluZyBvZiB0aGlzIG9uZVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgai0tO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBnbG9iYWxMb2NhbGU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9hZExvY2FsZShuYW1lKSB7XG4gICAgICAgIHZhciBvbGRMb2NhbGUgPSBudWxsLFxuICAgICAgICAgICAgYWxpYXNlZFJlcXVpcmU7XG4gICAgICAgIC8vIFRPRE86IEZpbmQgYSBiZXR0ZXIgd2F5IHRvIHJlZ2lzdGVyIGFuZCBsb2FkIGFsbCB0aGUgbG9jYWxlcyBpbiBOb2RlXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIGxvY2FsZXNbbmFtZV0gPT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgICAgIG1vZHVsZSAmJlxuICAgICAgICAgICAgbW9kdWxlLmV4cG9ydHNcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIG9sZExvY2FsZSA9IGdsb2JhbExvY2FsZS5fYWJicjtcbiAgICAgICAgICAgICAgICBhbGlhc2VkUmVxdWlyZSA9IHJlcXVpcmU7XG4gICAgICAgICAgICAgICAgYWxpYXNlZFJlcXVpcmUoJy4vbG9jYWxlLycgKyBuYW1lKTtcbiAgICAgICAgICAgICAgICBnZXRTZXRHbG9iYWxMb2NhbGUob2xkTG9jYWxlKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAvLyBtYXJrIGFzIG5vdCBmb3VuZCB0byBhdm9pZCByZXBlYXRpbmcgZXhwZW5zaXZlIGZpbGUgcmVxdWlyZSBjYWxsIGNhdXNpbmcgaGlnaCBDUFVcbiAgICAgICAgICAgICAgICAvLyB3aGVuIHRyeWluZyB0byBmaW5kIGVuLVVTLCBlbl9VUywgZW4tdXMgZm9yIGV2ZXJ5IGZvcm1hdCBjYWxsXG4gICAgICAgICAgICAgICAgbG9jYWxlc1tuYW1lXSA9IG51bGw7IC8vIG51bGwgbWVhbnMgbm90IGZvdW5kXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxvY2FsZXNbbmFtZV07XG4gICAgfVxuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGxvYWQgbG9jYWxlIGFuZCB0aGVuIHNldCB0aGUgZ2xvYmFsIGxvY2FsZS4gIElmXG4gICAgLy8gbm8gYXJndW1lbnRzIGFyZSBwYXNzZWQgaW4sIGl0IHdpbGwgc2ltcGx5IHJldHVybiB0aGUgY3VycmVudCBnbG9iYWxcbiAgICAvLyBsb2NhbGUga2V5LlxuICAgIGZ1bmN0aW9uIGdldFNldEdsb2JhbExvY2FsZShrZXksIHZhbHVlcykge1xuICAgICAgICB2YXIgZGF0YTtcbiAgICAgICAgaWYgKGtleSkge1xuICAgICAgICAgICAgaWYgKGlzVW5kZWZpbmVkKHZhbHVlcykpIHtcbiAgICAgICAgICAgICAgICBkYXRhID0gZ2V0TG9jYWxlKGtleSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBkZWZpbmVMb2NhbGUoa2V5LCB2YWx1ZXMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIC8vIG1vbWVudC5kdXJhdGlvbi5fbG9jYWxlID0gbW9tZW50Ll9sb2NhbGUgPSBkYXRhO1xuICAgICAgICAgICAgICAgIGdsb2JhbExvY2FsZSA9IGRhdGE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgY29uc29sZS53YXJuKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vd2FybiB1c2VyIGlmIGFyZ3VtZW50cyBhcmUgcGFzc2VkIGJ1dCB0aGUgbG9jYWxlIGNvdWxkIG5vdCBiZSBzZXRcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICAgICAgICAgICAgICAgJ0xvY2FsZSAnICsga2V5ICsgJyBub3QgZm91bmQuIERpZCB5b3UgZm9yZ2V0IHRvIGxvYWQgaXQ/J1xuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBnbG9iYWxMb2NhbGUuX2FiYnI7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVmaW5lTG9jYWxlKG5hbWUsIGNvbmZpZykge1xuICAgICAgICBpZiAoY29uZmlnICE9PSBudWxsKSB7XG4gICAgICAgICAgICB2YXIgbG9jYWxlLFxuICAgICAgICAgICAgICAgIHBhcmVudENvbmZpZyA9IGJhc2VDb25maWc7XG4gICAgICAgICAgICBjb25maWcuYWJiciA9IG5hbWU7XG4gICAgICAgICAgICBpZiAobG9jYWxlc1tuYW1lXSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZGVwcmVjYXRlU2ltcGxlKFxuICAgICAgICAgICAgICAgICAgICAnZGVmaW5lTG9jYWxlT3ZlcnJpZGUnLFxuICAgICAgICAgICAgICAgICAgICAndXNlIG1vbWVudC51cGRhdGVMb2NhbGUobG9jYWxlTmFtZSwgY29uZmlnKSB0byBjaGFuZ2UgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnYW4gZXhpc3RpbmcgbG9jYWxlLiBtb21lbnQuZGVmaW5lTG9jYWxlKGxvY2FsZU5hbWUsICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2NvbmZpZykgc2hvdWxkIG9ubHkgYmUgdXNlZCBmb3IgY3JlYXRpbmcgYSBuZXcgbG9jYWxlICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ1NlZSBodHRwOi8vbW9tZW50anMuY29tL2d1aWRlcy8jL3dhcm5pbmdzL2RlZmluZS1sb2NhbGUvIGZvciBtb3JlIGluZm8uJ1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgcGFyZW50Q29uZmlnID0gbG9jYWxlc1tuYW1lXS5fY29uZmlnO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb25maWcucGFyZW50TG9jYWxlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAobG9jYWxlc1tjb25maWcucGFyZW50TG9jYWxlXSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcmVudENvbmZpZyA9IGxvY2FsZXNbY29uZmlnLnBhcmVudExvY2FsZV0uX2NvbmZpZztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsb2NhbGUgPSBsb2FkTG9jYWxlKGNvbmZpZy5wYXJlbnRMb2NhbGUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobG9jYWxlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudENvbmZpZyA9IGxvY2FsZS5fY29uZmlnO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFsb2NhbGVGYW1pbGllc1tjb25maWcucGFyZW50TG9jYWxlXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsZUZhbWlsaWVzW2NvbmZpZy5wYXJlbnRMb2NhbGVdID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhbGVGYW1pbGllc1tjb25maWcucGFyZW50TG9jYWxlXS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzogY29uZmlnLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxvY2FsZXNbbmFtZV0gPSBuZXcgTG9jYWxlKG1lcmdlQ29uZmlncyhwYXJlbnRDb25maWcsIGNvbmZpZykpO1xuXG4gICAgICAgICAgICBpZiAobG9jYWxlRmFtaWxpZXNbbmFtZV0pIHtcbiAgICAgICAgICAgICAgICBsb2NhbGVGYW1pbGllc1tuYW1lXS5mb3JFYWNoKGZ1bmN0aW9uICh4KSB7XG4gICAgICAgICAgICAgICAgICAgIGRlZmluZUxvY2FsZSh4Lm5hbWUsIHguY29uZmlnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gYmFja3dhcmRzIGNvbXBhdCBmb3Igbm93OiBhbHNvIHNldCB0aGUgbG9jYWxlXG4gICAgICAgICAgICAvLyBtYWtlIHN1cmUgd2Ugc2V0IHRoZSBsb2NhbGUgQUZURVIgYWxsIGNoaWxkIGxvY2FsZXMgaGF2ZSBiZWVuXG4gICAgICAgICAgICAvLyBjcmVhdGVkLCBzbyB3ZSB3b24ndCBlbmQgdXAgd2l0aCB0aGUgY2hpbGQgbG9jYWxlIHNldC5cbiAgICAgICAgICAgIGdldFNldEdsb2JhbExvY2FsZShuYW1lKTtcblxuICAgICAgICAgICAgcmV0dXJuIGxvY2FsZXNbbmFtZV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyB1c2VmdWwgZm9yIHRlc3RpbmdcbiAgICAgICAgICAgIGRlbGV0ZSBsb2NhbGVzW25hbWVdO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVMb2NhbGUobmFtZSwgY29uZmlnKSB7XG4gICAgICAgIGlmIChjb25maWcgIT0gbnVsbCkge1xuICAgICAgICAgICAgdmFyIGxvY2FsZSxcbiAgICAgICAgICAgICAgICB0bXBMb2NhbGUsXG4gICAgICAgICAgICAgICAgcGFyZW50Q29uZmlnID0gYmFzZUNvbmZpZztcblxuICAgICAgICAgICAgaWYgKGxvY2FsZXNbbmFtZV0gIT0gbnVsbCAmJiBsb2NhbGVzW25hbWVdLnBhcmVudExvY2FsZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgLy8gVXBkYXRlIGV4aXN0aW5nIGNoaWxkIGxvY2FsZSBpbi1wbGFjZSB0byBhdm9pZCBtZW1vcnktbGVha3NcbiAgICAgICAgICAgICAgICBsb2NhbGVzW25hbWVdLnNldChtZXJnZUNvbmZpZ3MobG9jYWxlc1tuYW1lXS5fY29uZmlnLCBjb25maWcpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gTUVSR0VcbiAgICAgICAgICAgICAgICB0bXBMb2NhbGUgPSBsb2FkTG9jYWxlKG5hbWUpO1xuICAgICAgICAgICAgICAgIGlmICh0bXBMb2NhbGUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBwYXJlbnRDb25maWcgPSB0bXBMb2NhbGUuX2NvbmZpZztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uZmlnID0gbWVyZ2VDb25maWdzKHBhcmVudENvbmZpZywgY29uZmlnKTtcbiAgICAgICAgICAgICAgICBpZiAodG1wTG9jYWxlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdXBkYXRlTG9jYWxlIGlzIGNhbGxlZCBmb3IgY3JlYXRpbmcgYSBuZXcgbG9jYWxlXG4gICAgICAgICAgICAgICAgICAgIC8vIFNldCBhYmJyIHNvIGl0IHdpbGwgaGF2ZSBhIG5hbWUgKGdldHRlcnMgcmV0dXJuXG4gICAgICAgICAgICAgICAgICAgIC8vIHVuZGVmaW5lZCBvdGhlcndpc2UpLlxuICAgICAgICAgICAgICAgICAgICBjb25maWcuYWJiciA9IG5hbWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxvY2FsZSA9IG5ldyBMb2NhbGUoY29uZmlnKTtcbiAgICAgICAgICAgICAgICBsb2NhbGUucGFyZW50TG9jYWxlID0gbG9jYWxlc1tuYW1lXTtcbiAgICAgICAgICAgICAgICBsb2NhbGVzW25hbWVdID0gbG9jYWxlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBiYWNrd2FyZHMgY29tcGF0IGZvciBub3c6IGFsc28gc2V0IHRoZSBsb2NhbGVcbiAgICAgICAgICAgIGdldFNldEdsb2JhbExvY2FsZShuYW1lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHBhc3MgbnVsbCBmb3IgY29uZmlnIHRvIHVudXBkYXRlLCB1c2VmdWwgZm9yIHRlc3RzXG4gICAgICAgICAgICBpZiAobG9jYWxlc1tuYW1lXSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxvY2FsZXNbbmFtZV0ucGFyZW50TG9jYWxlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxlc1tuYW1lXSA9IGxvY2FsZXNbbmFtZV0ucGFyZW50TG9jYWxlO1xuICAgICAgICAgICAgICAgICAgICBpZiAobmFtZSA9PT0gZ2V0U2V0R2xvYmFsTG9jYWxlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldFNldEdsb2JhbExvY2FsZShuYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobG9jYWxlc1tuYW1lXSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBsb2NhbGVzW25hbWVdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbG9jYWxlc1tuYW1lXTtcbiAgICB9XG5cbiAgICAvLyByZXR1cm5zIGxvY2FsZSBkYXRhXG4gICAgZnVuY3Rpb24gZ2V0TG9jYWxlKGtleSkge1xuICAgICAgICB2YXIgbG9jYWxlO1xuXG4gICAgICAgIGlmIChrZXkgJiYga2V5Ll9sb2NhbGUgJiYga2V5Ll9sb2NhbGUuX2FiYnIpIHtcbiAgICAgICAgICAgIGtleSA9IGtleS5fbG9jYWxlLl9hYmJyO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFrZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBnbG9iYWxMb2NhbGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlzQXJyYXkoa2V5KSkge1xuICAgICAgICAgICAgLy9zaG9ydC1jaXJjdWl0IGV2ZXJ5dGhpbmcgZWxzZVxuICAgICAgICAgICAgbG9jYWxlID0gbG9hZExvY2FsZShrZXkpO1xuICAgICAgICAgICAgaWYgKGxvY2FsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsb2NhbGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBrZXkgPSBba2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjaG9vc2VMb2NhbGUoa2V5KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaXN0TG9jYWxlcygpIHtcbiAgICAgICAgcmV0dXJuIGtleXMobG9jYWxlcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2hlY2tPdmVyZmxvdyhtKSB7XG4gICAgICAgIHZhciBvdmVyZmxvdyxcbiAgICAgICAgICAgIGEgPSBtLl9hO1xuXG4gICAgICAgIGlmIChhICYmIGdldFBhcnNpbmdGbGFncyhtKS5vdmVyZmxvdyA9PT0gLTIpIHtcbiAgICAgICAgICAgIG92ZXJmbG93ID1cbiAgICAgICAgICAgICAgICBhW01PTlRIXSA8IDAgfHwgYVtNT05USF0gPiAxMVxuICAgICAgICAgICAgICAgICAgICA/IE1PTlRIXG4gICAgICAgICAgICAgICAgICAgIDogYVtEQVRFXSA8IDEgfHwgYVtEQVRFXSA+IGRheXNJbk1vbnRoKGFbWUVBUl0sIGFbTU9OVEhdKVxuICAgICAgICAgICAgICAgICAgICA/IERBVEVcbiAgICAgICAgICAgICAgICAgICAgOiBhW0hPVVJdIDwgMCB8fFxuICAgICAgICAgICAgICAgICAgICAgIGFbSE9VUl0gPiAyNCB8fFxuICAgICAgICAgICAgICAgICAgICAgIChhW0hPVVJdID09PSAyNCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAoYVtNSU5VVEVdICE9PSAwIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhW1NFQ09ORF0gIT09IDAgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFbTUlMTElTRUNPTkRdICE9PSAwKSlcbiAgICAgICAgICAgICAgICAgICAgPyBIT1VSXG4gICAgICAgICAgICAgICAgICAgIDogYVtNSU5VVEVdIDwgMCB8fCBhW01JTlVURV0gPiA1OVxuICAgICAgICAgICAgICAgICAgICA/IE1JTlVURVxuICAgICAgICAgICAgICAgICAgICA6IGFbU0VDT05EXSA8IDAgfHwgYVtTRUNPTkRdID4gNTlcbiAgICAgICAgICAgICAgICAgICAgPyBTRUNPTkRcbiAgICAgICAgICAgICAgICAgICAgOiBhW01JTExJU0VDT05EXSA8IDAgfHwgYVtNSUxMSVNFQ09ORF0gPiA5OTlcbiAgICAgICAgICAgICAgICAgICAgPyBNSUxMSVNFQ09ORFxuICAgICAgICAgICAgICAgICAgICA6IC0xO1xuXG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKG0pLl9vdmVyZmxvd0RheU9mWWVhciAmJlxuICAgICAgICAgICAgICAgIChvdmVyZmxvdyA8IFlFQVIgfHwgb3ZlcmZsb3cgPiBEQVRFKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgb3ZlcmZsb3cgPSBEQVRFO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGdldFBhcnNpbmdGbGFncyhtKS5fb3ZlcmZsb3dXZWVrcyAmJiBvdmVyZmxvdyA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICBvdmVyZmxvdyA9IFdFRUs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZ2V0UGFyc2luZ0ZsYWdzKG0pLl9vdmVyZmxvd1dlZWtkYXkgJiYgb3ZlcmZsb3cgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgb3ZlcmZsb3cgPSBXRUVLREFZO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MobSkub3ZlcmZsb3cgPSBvdmVyZmxvdztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtO1xuICAgIH1cblxuICAgIC8vIGlzbyA4NjAxIHJlZ2V4XG4gICAgLy8gMDAwMC0wMC0wMCAwMDAwLVcwMCBvciAwMDAwLVcwMC0wICsgVCArIDAwIG9yIDAwOjAwIG9yIDAwOjAwOjAwIG9yIDAwOjAwOjAwLjAwMCArICswMDowMCBvciArMDAwMCBvciArMDApXG4gICAgdmFyIGV4dGVuZGVkSXNvUmVnZXggPSAvXlxccyooKD86WystXVxcZHs2fXxcXGR7NH0pLSg/OlxcZFxcZC1cXGRcXGR8V1xcZFxcZC1cXGR8V1xcZFxcZHxcXGRcXGRcXGR8XFxkXFxkKSkoPzooVHwgKShcXGRcXGQoPzo6XFxkXFxkKD86OlxcZFxcZCg/OlsuLF1cXGQrKT8pPyk/KShbKy1dXFxkXFxkKD86Oj9cXGRcXGQpP3xcXHMqWik/KT8kLyxcbiAgICAgICAgYmFzaWNJc29SZWdleCA9IC9eXFxzKigoPzpbKy1dXFxkezZ9fFxcZHs0fSkoPzpcXGRcXGRcXGRcXGR8V1xcZFxcZFxcZHxXXFxkXFxkfFxcZFxcZFxcZHxcXGRcXGR8KSkoPzooVHwgKShcXGRcXGQoPzpcXGRcXGQoPzpcXGRcXGQoPzpbLixdXFxkKyk/KT8pPykoWystXVxcZFxcZCg/Ojo/XFxkXFxkKT98XFxzKlopPyk/JC8sXG4gICAgICAgIHR6UmVnZXggPSAvWnxbKy1dXFxkXFxkKD86Oj9cXGRcXGQpPy8sXG4gICAgICAgIGlzb0RhdGVzID0gW1xuICAgICAgICAgICAgWydZWVlZWVktTU0tREQnLCAvWystXVxcZHs2fS1cXGRcXGQtXFxkXFxkL10sXG4gICAgICAgICAgICBbJ1lZWVktTU0tREQnLCAvXFxkezR9LVxcZFxcZC1cXGRcXGQvXSxcbiAgICAgICAgICAgIFsnR0dHRy1bV11XVy1FJywgL1xcZHs0fS1XXFxkXFxkLVxcZC9dLFxuICAgICAgICAgICAgWydHR0dHLVtXXVdXJywgL1xcZHs0fS1XXFxkXFxkLywgZmFsc2VdLFxuICAgICAgICAgICAgWydZWVlZLURERCcsIC9cXGR7NH0tXFxkezN9L10sXG4gICAgICAgICAgICBbJ1lZWVktTU0nLCAvXFxkezR9LVxcZFxcZC8sIGZhbHNlXSxcbiAgICAgICAgICAgIFsnWVlZWVlZTU1ERCcsIC9bKy1dXFxkezEwfS9dLFxuICAgICAgICAgICAgWydZWVlZTU1ERCcsIC9cXGR7OH0vXSxcbiAgICAgICAgICAgIFsnR0dHR1tXXVdXRScsIC9cXGR7NH1XXFxkezN9L10sXG4gICAgICAgICAgICBbJ0dHR0dbV11XVycsIC9cXGR7NH1XXFxkezJ9LywgZmFsc2VdLFxuICAgICAgICAgICAgWydZWVlZREREJywgL1xcZHs3fS9dLFxuICAgICAgICAgICAgWydZWVlZTU0nLCAvXFxkezZ9LywgZmFsc2VdLFxuICAgICAgICAgICAgWydZWVlZJywgL1xcZHs0fS8sIGZhbHNlXSxcbiAgICAgICAgXSxcbiAgICAgICAgLy8gaXNvIHRpbWUgZm9ybWF0cyBhbmQgcmVnZXhlc1xuICAgICAgICBpc29UaW1lcyA9IFtcbiAgICAgICAgICAgIFsnSEg6bW06c3MuU1NTUycsIC9cXGRcXGQ6XFxkXFxkOlxcZFxcZFxcLlxcZCsvXSxcbiAgICAgICAgICAgIFsnSEg6bW06c3MsU1NTUycsIC9cXGRcXGQ6XFxkXFxkOlxcZFxcZCxcXGQrL10sXG4gICAgICAgICAgICBbJ0hIOm1tOnNzJywgL1xcZFxcZDpcXGRcXGQ6XFxkXFxkL10sXG4gICAgICAgICAgICBbJ0hIOm1tJywgL1xcZFxcZDpcXGRcXGQvXSxcbiAgICAgICAgICAgIFsnSEhtbXNzLlNTU1MnLCAvXFxkXFxkXFxkXFxkXFxkXFxkXFwuXFxkKy9dLFxuICAgICAgICAgICAgWydISG1tc3MsU1NTUycsIC9cXGRcXGRcXGRcXGRcXGRcXGQsXFxkKy9dLFxuICAgICAgICAgICAgWydISG1tc3MnLCAvXFxkXFxkXFxkXFxkXFxkXFxkL10sXG4gICAgICAgICAgICBbJ0hIbW0nLCAvXFxkXFxkXFxkXFxkL10sXG4gICAgICAgICAgICBbJ0hIJywgL1xcZFxcZC9dLFxuICAgICAgICBdLFxuICAgICAgICBhc3BOZXRKc29uUmVnZXggPSAvXlxcLz9EYXRlXFwoKC0/XFxkKykvaSxcbiAgICAgICAgLy8gUkZDIDI4MjIgcmVnZXg6IEZvciBkZXRhaWxzIHNlZSBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMjgyMiNzZWN0aW9uLTMuM1xuICAgICAgICByZmMyODIyID0gL14oPzooTW9ufFR1ZXxXZWR8VGh1fEZyaXxTYXR8U3VuKSw/XFxzKT8oXFxkezEsMn0pXFxzKEphbnxGZWJ8TWFyfEFwcnxNYXl8SnVufEp1bHxBdWd8U2VwfE9jdHxOb3Z8RGVjKVxccyhcXGR7Miw0fSlcXHMoXFxkXFxkKTooXFxkXFxkKSg/OjooXFxkXFxkKSk/XFxzKD86KFVUfEdNVHxbRUNNUF1bU0RdVCl8KFtael0pfChbKy1dXFxkezR9KSkkLyxcbiAgICAgICAgb2JzT2Zmc2V0cyA9IHtcbiAgICAgICAgICAgIFVUOiAwLFxuICAgICAgICAgICAgR01UOiAwLFxuICAgICAgICAgICAgRURUOiAtNCAqIDYwLFxuICAgICAgICAgICAgRVNUOiAtNSAqIDYwLFxuICAgICAgICAgICAgQ0RUOiAtNSAqIDYwLFxuICAgICAgICAgICAgQ1NUOiAtNiAqIDYwLFxuICAgICAgICAgICAgTURUOiAtNiAqIDYwLFxuICAgICAgICAgICAgTVNUOiAtNyAqIDYwLFxuICAgICAgICAgICAgUERUOiAtNyAqIDYwLFxuICAgICAgICAgICAgUFNUOiAtOCAqIDYwLFxuICAgICAgICB9O1xuXG4gICAgLy8gZGF0ZSBmcm9tIGlzbyBmb3JtYXRcbiAgICBmdW5jdGlvbiBjb25maWdGcm9tSVNPKGNvbmZpZykge1xuICAgICAgICB2YXIgaSxcbiAgICAgICAgICAgIGwsXG4gICAgICAgICAgICBzdHJpbmcgPSBjb25maWcuX2ksXG4gICAgICAgICAgICBtYXRjaCA9IGV4dGVuZGVkSXNvUmVnZXguZXhlYyhzdHJpbmcpIHx8IGJhc2ljSXNvUmVnZXguZXhlYyhzdHJpbmcpLFxuICAgICAgICAgICAgYWxsb3dUaW1lLFxuICAgICAgICAgICAgZGF0ZUZvcm1hdCxcbiAgICAgICAgICAgIHRpbWVGb3JtYXQsXG4gICAgICAgICAgICB0ekZvcm1hdDtcblxuICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmlzbyA9IHRydWU7XG5cbiAgICAgICAgICAgIGZvciAoaSA9IDAsIGwgPSBpc29EYXRlcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNvRGF0ZXNbaV1bMV0uZXhlYyhtYXRjaFsxXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0ZUZvcm1hdCA9IGlzb0RhdGVzW2ldWzBdO1xuICAgICAgICAgICAgICAgICAgICBhbGxvd1RpbWUgPSBpc29EYXRlc1tpXVsyXSAhPT0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkYXRlRm9ybWF0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb25maWcuX2lzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobWF0Y2hbM10pIHtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwLCBsID0gaXNvVGltZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc29UaW1lc1tpXVsxXS5leGVjKG1hdGNoWzNdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWF0Y2hbMl0gc2hvdWxkIGJlICdUJyBvciBzcGFjZVxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZUZvcm1hdCA9IChtYXRjaFsyXSB8fCAnICcpICsgaXNvVGltZXNbaV1bMF07XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGltZUZvcm1hdCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZy5faXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFhbGxvd1RpbWUgJiYgdGltZUZvcm1hdCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnLl9pc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1hdGNoWzRdKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR6UmVnZXguZXhlYyhtYXRjaFs0XSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdHpGb3JtYXQgPSAnWic7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLl9pc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25maWcuX2YgPSBkYXRlRm9ybWF0ICsgKHRpbWVGb3JtYXQgfHwgJycpICsgKHR6Rm9ybWF0IHx8ICcnKTtcbiAgICAgICAgICAgIGNvbmZpZ0Zyb21TdHJpbmdBbmRGb3JtYXQoY29uZmlnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbmZpZy5faXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXh0cmFjdEZyb21SRkMyODIyU3RyaW5ncyhcbiAgICAgICAgeWVhclN0cixcbiAgICAgICAgbW9udGhTdHIsXG4gICAgICAgIGRheVN0cixcbiAgICAgICAgaG91clN0cixcbiAgICAgICAgbWludXRlU3RyLFxuICAgICAgICBzZWNvbmRTdHJcbiAgICApIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtcbiAgICAgICAgICAgIHVudHJ1bmNhdGVZZWFyKHllYXJTdHIpLFxuICAgICAgICAgICAgZGVmYXVsdExvY2FsZU1vbnRoc1Nob3J0LmluZGV4T2YobW9udGhTdHIpLFxuICAgICAgICAgICAgcGFyc2VJbnQoZGF5U3RyLCAxMCksXG4gICAgICAgICAgICBwYXJzZUludChob3VyU3RyLCAxMCksXG4gICAgICAgICAgICBwYXJzZUludChtaW51dGVTdHIsIDEwKSxcbiAgICAgICAgXTtcblxuICAgICAgICBpZiAoc2Vjb25kU3RyKSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaChwYXJzZUludChzZWNvbmRTdHIsIDEwKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVudHJ1bmNhdGVZZWFyKHllYXJTdHIpIHtcbiAgICAgICAgdmFyIHllYXIgPSBwYXJzZUludCh5ZWFyU3RyLCAxMCk7XG4gICAgICAgIGlmICh5ZWFyIDw9IDQ5KSB7XG4gICAgICAgICAgICByZXR1cm4gMjAwMCArIHllYXI7XG4gICAgICAgIH0gZWxzZSBpZiAoeWVhciA8PSA5OTkpIHtcbiAgICAgICAgICAgIHJldHVybiAxOTAwICsgeWVhcjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geWVhcjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcmVwcm9jZXNzUkZDMjgyMihzKSB7XG4gICAgICAgIC8vIFJlbW92ZSBjb21tZW50cyBhbmQgZm9sZGluZyB3aGl0ZXNwYWNlIGFuZCByZXBsYWNlIG11bHRpcGxlLXNwYWNlcyB3aXRoIGEgc2luZ2xlIHNwYWNlXG4gICAgICAgIHJldHVybiBzXG4gICAgICAgICAgICAucmVwbGFjZSgvXFwoW14pXSpcXCl8W1xcblxcdF0vZywgJyAnKVxuICAgICAgICAgICAgLnJlcGxhY2UoLyhcXHNcXHMrKS9nLCAnICcpXG4gICAgICAgICAgICAucmVwbGFjZSgvXlxcc1xccyovLCAnJylcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXHNcXHMqJC8sICcnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjaGVja1dlZWtkYXkod2Vla2RheVN0ciwgcGFyc2VkSW5wdXQsIGNvbmZpZykge1xuICAgICAgICBpZiAod2Vla2RheVN0cikge1xuICAgICAgICAgICAgLy8gVE9ETzogUmVwbGFjZSB0aGUgdmFuaWxsYSBKUyBEYXRlIG9iamVjdCB3aXRoIGFuIGluZGVwZW5kZW50IGRheS1vZi13ZWVrIGNoZWNrLlxuICAgICAgICAgICAgdmFyIHdlZWtkYXlQcm92aWRlZCA9IGRlZmF1bHRMb2NhbGVXZWVrZGF5c1Nob3J0LmluZGV4T2Yod2Vla2RheVN0ciksXG4gICAgICAgICAgICAgICAgd2Vla2RheUFjdHVhbCA9IG5ldyBEYXRlKFxuICAgICAgICAgICAgICAgICAgICBwYXJzZWRJbnB1dFswXSxcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VkSW5wdXRbMV0sXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlZElucHV0WzJdXG4gICAgICAgICAgICAgICAgKS5nZXREYXkoKTtcbiAgICAgICAgICAgIGlmICh3ZWVrZGF5UHJvdmlkZWQgIT09IHdlZWtkYXlBY3R1YWwpIHtcbiAgICAgICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS53ZWVrZGF5TWlzbWF0Y2ggPSB0cnVlO1xuICAgICAgICAgICAgICAgIGNvbmZpZy5faXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjYWxjdWxhdGVPZmZzZXQob2JzT2Zmc2V0LCBtaWxpdGFyeU9mZnNldCwgbnVtT2Zmc2V0KSB7XG4gICAgICAgIGlmIChvYnNPZmZzZXQpIHtcbiAgICAgICAgICAgIHJldHVybiBvYnNPZmZzZXRzW29ic09mZnNldF07XG4gICAgICAgIH0gZWxzZSBpZiAobWlsaXRhcnlPZmZzZXQpIHtcbiAgICAgICAgICAgIC8vIHRoZSBvbmx5IGFsbG93ZWQgbWlsaXRhcnkgdHogaXMgWlxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgaG0gPSBwYXJzZUludChudW1PZmZzZXQsIDEwKSxcbiAgICAgICAgICAgICAgICBtID0gaG0gJSAxMDAsXG4gICAgICAgICAgICAgICAgaCA9IChobSAtIG0pIC8gMTAwO1xuICAgICAgICAgICAgcmV0dXJuIGggKiA2MCArIG07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBkYXRlIGFuZCB0aW1lIGZyb20gcmVmIDI4MjIgZm9ybWF0XG4gICAgZnVuY3Rpb24gY29uZmlnRnJvbVJGQzI4MjIoY29uZmlnKSB7XG4gICAgICAgIHZhciBtYXRjaCA9IHJmYzI4MjIuZXhlYyhwcmVwcm9jZXNzUkZDMjgyMihjb25maWcuX2kpKSxcbiAgICAgICAgICAgIHBhcnNlZEFycmF5O1xuICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgIHBhcnNlZEFycmF5ID0gZXh0cmFjdEZyb21SRkMyODIyU3RyaW5ncyhcbiAgICAgICAgICAgICAgICBtYXRjaFs0XSxcbiAgICAgICAgICAgICAgICBtYXRjaFszXSxcbiAgICAgICAgICAgICAgICBtYXRjaFsyXSxcbiAgICAgICAgICAgICAgICBtYXRjaFs1XSxcbiAgICAgICAgICAgICAgICBtYXRjaFs2XSxcbiAgICAgICAgICAgICAgICBtYXRjaFs3XVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmICghY2hlY2tXZWVrZGF5KG1hdGNoWzFdLCBwYXJzZWRBcnJheSwgY29uZmlnKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uZmlnLl9hID0gcGFyc2VkQXJyYXk7XG4gICAgICAgICAgICBjb25maWcuX3R6bSA9IGNhbGN1bGF0ZU9mZnNldChtYXRjaFs4XSwgbWF0Y2hbOV0sIG1hdGNoWzEwXSk7XG5cbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IGNyZWF0ZVVUQ0RhdGUuYXBwbHkobnVsbCwgY29uZmlnLl9hKTtcbiAgICAgICAgICAgIGNvbmZpZy5fZC5zZXRVVENNaW51dGVzKGNvbmZpZy5fZC5nZXRVVENNaW51dGVzKCkgLSBjb25maWcuX3R6bSk7XG5cbiAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLnJmYzI4MjIgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uZmlnLl9pc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBkYXRlIGZyb20gMSkgQVNQLk5FVCwgMikgSVNPLCAzKSBSRkMgMjgyMiBmb3JtYXRzLCBvciA0KSBvcHRpb25hbCBmYWxsYmFjayBpZiBwYXJzaW5nIGlzbid0IHN0cmljdFxuICAgIGZ1bmN0aW9uIGNvbmZpZ0Zyb21TdHJpbmcoY29uZmlnKSB7XG4gICAgICAgIHZhciBtYXRjaGVkID0gYXNwTmV0SnNvblJlZ2V4LmV4ZWMoY29uZmlnLl9pKTtcbiAgICAgICAgaWYgKG1hdGNoZWQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKCttYXRjaGVkWzFdKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbmZpZ0Zyb21JU08oY29uZmlnKTtcbiAgICAgICAgaWYgKGNvbmZpZy5faXNWYWxpZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGRlbGV0ZSBjb25maWcuX2lzVmFsaWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25maWdGcm9tUkZDMjgyMihjb25maWcpO1xuICAgICAgICBpZiAoY29uZmlnLl9pc1ZhbGlkID09PSBmYWxzZSkge1xuICAgICAgICAgICAgZGVsZXRlIGNvbmZpZy5faXNWYWxpZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWcuX3N0cmljdCkge1xuICAgICAgICAgICAgY29uZmlnLl9pc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBGaW5hbCBhdHRlbXB0LCB1c2UgSW5wdXQgRmFsbGJhY2tcbiAgICAgICAgICAgIGhvb2tzLmNyZWF0ZUZyb21JbnB1dEZhbGxiYWNrKGNvbmZpZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBob29rcy5jcmVhdGVGcm9tSW5wdXRGYWxsYmFjayA9IGRlcHJlY2F0ZShcbiAgICAgICAgJ3ZhbHVlIHByb3ZpZGVkIGlzIG5vdCBpbiBhIHJlY29nbml6ZWQgUkZDMjgyMiBvciBJU08gZm9ybWF0LiBtb21lbnQgY29uc3RydWN0aW9uIGZhbGxzIGJhY2sgdG8ganMgRGF0ZSgpLCAnICtcbiAgICAgICAgICAgICd3aGljaCBpcyBub3QgcmVsaWFibGUgYWNyb3NzIGFsbCBicm93c2VycyBhbmQgdmVyc2lvbnMuIE5vbiBSRkMyODIyL0lTTyBkYXRlIGZvcm1hdHMgYXJlICcgK1xuICAgICAgICAgICAgJ2Rpc2NvdXJhZ2VkLiBQbGVhc2UgcmVmZXIgdG8gaHR0cDovL21vbWVudGpzLmNvbS9ndWlkZXMvIy93YXJuaW5ncy9qcy1kYXRlLyBmb3IgbW9yZSBpbmZvLicsXG4gICAgICAgIGZ1bmN0aW9uIChjb25maWcpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKGNvbmZpZy5faSArIChjb25maWcuX3VzZVVUQyA/ICcgVVRDJyA6ICcnKSk7XG4gICAgICAgIH1cbiAgICApO1xuXG4gICAgLy8gUGljayB0aGUgZmlyc3QgZGVmaW5lZCBvZiB0d28gb3IgdGhyZWUgYXJndW1lbnRzLlxuICAgIGZ1bmN0aW9uIGRlZmF1bHRzKGEsIGIsIGMpIHtcbiAgICAgICAgaWYgKGEgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIGE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGIgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIGI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3VycmVudERhdGVBcnJheShjb25maWcpIHtcbiAgICAgICAgLy8gaG9va3MgaXMgYWN0dWFsbHkgdGhlIGV4cG9ydGVkIG1vbWVudCBvYmplY3RcbiAgICAgICAgdmFyIG5vd1ZhbHVlID0gbmV3IERhdGUoaG9va3Mubm93KCkpO1xuICAgICAgICBpZiAoY29uZmlnLl91c2VVVEMpIHtcbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAgbm93VmFsdWUuZ2V0VVRDRnVsbFllYXIoKSxcbiAgICAgICAgICAgICAgICBub3dWYWx1ZS5nZXRVVENNb250aCgpLFxuICAgICAgICAgICAgICAgIG5vd1ZhbHVlLmdldFVUQ0RhdGUoKSxcbiAgICAgICAgICAgIF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtub3dWYWx1ZS5nZXRGdWxsWWVhcigpLCBub3dWYWx1ZS5nZXRNb250aCgpLCBub3dWYWx1ZS5nZXREYXRlKCldO1xuICAgIH1cblxuICAgIC8vIGNvbnZlcnQgYW4gYXJyYXkgdG8gYSBkYXRlLlxuICAgIC8vIHRoZSBhcnJheSBzaG91bGQgbWlycm9yIHRoZSBwYXJhbWV0ZXJzIGJlbG93XG4gICAgLy8gbm90ZTogYWxsIHZhbHVlcyBwYXN0IHRoZSB5ZWFyIGFyZSBvcHRpb25hbCBhbmQgd2lsbCBkZWZhdWx0IHRvIHRoZSBsb3dlc3QgcG9zc2libGUgdmFsdWUuXG4gICAgLy8gW3llYXIsIG1vbnRoLCBkYXkgLCBob3VyLCBtaW51dGUsIHNlY29uZCwgbWlsbGlzZWNvbmRdXG4gICAgZnVuY3Rpb24gY29uZmlnRnJvbUFycmF5KGNvbmZpZykge1xuICAgICAgICB2YXIgaSxcbiAgICAgICAgICAgIGRhdGUsXG4gICAgICAgICAgICBpbnB1dCA9IFtdLFxuICAgICAgICAgICAgY3VycmVudERhdGUsXG4gICAgICAgICAgICBleHBlY3RlZFdlZWtkYXksXG4gICAgICAgICAgICB5ZWFyVG9Vc2U7XG5cbiAgICAgICAgaWYgKGNvbmZpZy5fZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY3VycmVudERhdGUgPSBjdXJyZW50RGF0ZUFycmF5KGNvbmZpZyk7XG5cbiAgICAgICAgLy9jb21wdXRlIGRheSBvZiB0aGUgeWVhciBmcm9tIHdlZWtzIGFuZCB3ZWVrZGF5c1xuICAgICAgICBpZiAoY29uZmlnLl93ICYmIGNvbmZpZy5fYVtEQVRFXSA9PSBudWxsICYmIGNvbmZpZy5fYVtNT05USF0gPT0gbnVsbCkge1xuICAgICAgICAgICAgZGF5T2ZZZWFyRnJvbVdlZWtJbmZvKGNvbmZpZyk7XG4gICAgICAgIH1cblxuICAgICAgICAvL2lmIHRoZSBkYXkgb2YgdGhlIHllYXIgaXMgc2V0LCBmaWd1cmUgb3V0IHdoYXQgaXQgaXNcbiAgICAgICAgaWYgKGNvbmZpZy5fZGF5T2ZZZWFyICE9IG51bGwpIHtcbiAgICAgICAgICAgIHllYXJUb1VzZSA9IGRlZmF1bHRzKGNvbmZpZy5fYVtZRUFSXSwgY3VycmVudERhdGVbWUVBUl0pO1xuXG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgY29uZmlnLl9kYXlPZlllYXIgPiBkYXlzSW5ZZWFyKHllYXJUb1VzZSkgfHxcbiAgICAgICAgICAgICAgICBjb25maWcuX2RheU9mWWVhciA9PT0gMFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuX292ZXJmbG93RGF5T2ZZZWFyID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZGF0ZSA9IGNyZWF0ZVVUQ0RhdGUoeWVhclRvVXNlLCAwLCBjb25maWcuX2RheU9mWWVhcik7XG4gICAgICAgICAgICBjb25maWcuX2FbTU9OVEhdID0gZGF0ZS5nZXRVVENNb250aCgpO1xuICAgICAgICAgICAgY29uZmlnLl9hW0RBVEVdID0gZGF0ZS5nZXRVVENEYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEZWZhdWx0IHRvIGN1cnJlbnQgZGF0ZS5cbiAgICAgICAgLy8gKiBpZiBubyB5ZWFyLCBtb250aCwgZGF5IG9mIG1vbnRoIGFyZSBnaXZlbiwgZGVmYXVsdCB0byB0b2RheVxuICAgICAgICAvLyAqIGlmIGRheSBvZiBtb250aCBpcyBnaXZlbiwgZGVmYXVsdCBtb250aCBhbmQgeWVhclxuICAgICAgICAvLyAqIGlmIG1vbnRoIGlzIGdpdmVuLCBkZWZhdWx0IG9ubHkgeWVhclxuICAgICAgICAvLyAqIGlmIHllYXIgaXMgZ2l2ZW4sIGRvbid0IGRlZmF1bHQgYW55dGhpbmdcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDMgJiYgY29uZmlnLl9hW2ldID09IG51bGw7ICsraSkge1xuICAgICAgICAgICAgY29uZmlnLl9hW2ldID0gaW5wdXRbaV0gPSBjdXJyZW50RGF0ZVtpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFplcm8gb3V0IHdoYXRldmVyIHdhcyBub3QgZGVmYXVsdGVkLCBpbmNsdWRpbmcgdGltZVxuICAgICAgICBmb3IgKDsgaSA8IDc7IGkrKykge1xuICAgICAgICAgICAgY29uZmlnLl9hW2ldID0gaW5wdXRbaV0gPVxuICAgICAgICAgICAgICAgIGNvbmZpZy5fYVtpXSA9PSBudWxsID8gKGkgPT09IDIgPyAxIDogMCkgOiBjb25maWcuX2FbaV07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDaGVjayBmb3IgMjQ6MDA6MDAuMDAwXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIGNvbmZpZy5fYVtIT1VSXSA9PT0gMjQgJiZcbiAgICAgICAgICAgIGNvbmZpZy5fYVtNSU5VVEVdID09PSAwICYmXG4gICAgICAgICAgICBjb25maWcuX2FbU0VDT05EXSA9PT0gMCAmJlxuICAgICAgICAgICAgY29uZmlnLl9hW01JTExJU0VDT05EXSA9PT0gMFxuICAgICAgICApIHtcbiAgICAgICAgICAgIGNvbmZpZy5fbmV4dERheSA9IHRydWU7XG4gICAgICAgICAgICBjb25maWcuX2FbSE9VUl0gPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uZmlnLl9kID0gKGNvbmZpZy5fdXNlVVRDID8gY3JlYXRlVVRDRGF0ZSA6IGNyZWF0ZURhdGUpLmFwcGx5KFxuICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgIGlucHV0XG4gICAgICAgICk7XG4gICAgICAgIGV4cGVjdGVkV2Vla2RheSA9IGNvbmZpZy5fdXNlVVRDXG4gICAgICAgICAgICA/IGNvbmZpZy5fZC5nZXRVVENEYXkoKVxuICAgICAgICAgICAgOiBjb25maWcuX2QuZ2V0RGF5KCk7XG5cbiAgICAgICAgLy8gQXBwbHkgdGltZXpvbmUgb2Zmc2V0IGZyb20gaW5wdXQuIFRoZSBhY3R1YWwgdXRjT2Zmc2V0IGNhbiBiZSBjaGFuZ2VkXG4gICAgICAgIC8vIHdpdGggcGFyc2Vab25lLlxuICAgICAgICBpZiAoY29uZmlnLl90em0gIT0gbnVsbCkge1xuICAgICAgICAgICAgY29uZmlnLl9kLnNldFVUQ01pbnV0ZXMoY29uZmlnLl9kLmdldFVUQ01pbnV0ZXMoKSAtIGNvbmZpZy5fdHptKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWcuX25leHREYXkpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtIT1VSXSA9IDI0O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY2hlY2sgZm9yIG1pc21hdGNoaW5nIGRheSBvZiB3ZWVrXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIGNvbmZpZy5fdyAmJlxuICAgICAgICAgICAgdHlwZW9mIGNvbmZpZy5fdy5kICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICAgICAgY29uZmlnLl93LmQgIT09IGV4cGVjdGVkV2Vla2RheVxuICAgICAgICApIHtcbiAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLndlZWtkYXlNaXNtYXRjaCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkYXlPZlllYXJGcm9tV2Vla0luZm8oY29uZmlnKSB7XG4gICAgICAgIHZhciB3LCB3ZWVrWWVhciwgd2Vlaywgd2Vla2RheSwgZG93LCBkb3ksIHRlbXAsIHdlZWtkYXlPdmVyZmxvdywgY3VyV2VlaztcblxuICAgICAgICB3ID0gY29uZmlnLl93O1xuICAgICAgICBpZiAody5HRyAhPSBudWxsIHx8IHcuVyAhPSBudWxsIHx8IHcuRSAhPSBudWxsKSB7XG4gICAgICAgICAgICBkb3cgPSAxO1xuICAgICAgICAgICAgZG95ID0gNDtcblxuICAgICAgICAgICAgLy8gVE9ETzogV2UgbmVlZCB0byB0YWtlIHRoZSBjdXJyZW50IGlzb1dlZWtZZWFyLCBidXQgdGhhdCBkZXBlbmRzIG9uXG4gICAgICAgICAgICAvLyBob3cgd2UgaW50ZXJwcmV0IG5vdyAobG9jYWwsIHV0YywgZml4ZWQgb2Zmc2V0KS4gU28gY3JlYXRlXG4gICAgICAgICAgICAvLyBhIG5vdyB2ZXJzaW9uIG9mIGN1cnJlbnQgY29uZmlnICh0YWtlIGxvY2FsL3V0Yy9vZmZzZXQgZmxhZ3MsIGFuZFxuICAgICAgICAgICAgLy8gY3JlYXRlIG5vdykuXG4gICAgICAgICAgICB3ZWVrWWVhciA9IGRlZmF1bHRzKFxuICAgICAgICAgICAgICAgIHcuR0csXG4gICAgICAgICAgICAgICAgY29uZmlnLl9hW1lFQVJdLFxuICAgICAgICAgICAgICAgIHdlZWtPZlllYXIoY3JlYXRlTG9jYWwoKSwgMSwgNCkueWVhclxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHdlZWsgPSBkZWZhdWx0cyh3LlcsIDEpO1xuICAgICAgICAgICAgd2Vla2RheSA9IGRlZmF1bHRzKHcuRSwgMSk7XG4gICAgICAgICAgICBpZiAod2Vla2RheSA8IDEgfHwgd2Vla2RheSA+IDcpIHtcbiAgICAgICAgICAgICAgICB3ZWVrZGF5T3ZlcmZsb3cgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZG93ID0gY29uZmlnLl9sb2NhbGUuX3dlZWsuZG93O1xuICAgICAgICAgICAgZG95ID0gY29uZmlnLl9sb2NhbGUuX3dlZWsuZG95O1xuXG4gICAgICAgICAgICBjdXJXZWVrID0gd2Vla09mWWVhcihjcmVhdGVMb2NhbCgpLCBkb3csIGRveSk7XG5cbiAgICAgICAgICAgIHdlZWtZZWFyID0gZGVmYXVsdHMody5nZywgY29uZmlnLl9hW1lFQVJdLCBjdXJXZWVrLnllYXIpO1xuXG4gICAgICAgICAgICAvLyBEZWZhdWx0IHRvIGN1cnJlbnQgd2Vlay5cbiAgICAgICAgICAgIHdlZWsgPSBkZWZhdWx0cyh3LncsIGN1cldlZWsud2Vlayk7XG5cbiAgICAgICAgICAgIGlmICh3LmQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIC8vIHdlZWtkYXkgLS0gbG93IGRheSBudW1iZXJzIGFyZSBjb25zaWRlcmVkIG5leHQgd2Vla1xuICAgICAgICAgICAgICAgIHdlZWtkYXkgPSB3LmQ7XG4gICAgICAgICAgICAgICAgaWYgKHdlZWtkYXkgPCAwIHx8IHdlZWtkYXkgPiA2KSB7XG4gICAgICAgICAgICAgICAgICAgIHdlZWtkYXlPdmVyZmxvdyA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICh3LmUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIC8vIGxvY2FsIHdlZWtkYXkgLS0gY291bnRpbmcgc3RhcnRzIGZyb20gYmVnaW5uaW5nIG9mIHdlZWtcbiAgICAgICAgICAgICAgICB3ZWVrZGF5ID0gdy5lICsgZG93O1xuICAgICAgICAgICAgICAgIGlmICh3LmUgPCAwIHx8IHcuZSA+IDYpIHtcbiAgICAgICAgICAgICAgICAgICAgd2Vla2RheU92ZXJmbG93ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGRlZmF1bHQgdG8gYmVnaW5uaW5nIG9mIHdlZWtcbiAgICAgICAgICAgICAgICB3ZWVrZGF5ID0gZG93O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh3ZWVrIDwgMSB8fCB3ZWVrID4gd2Vla3NJblllYXIod2Vla1llYXIsIGRvdywgZG95KSkge1xuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuX292ZXJmbG93V2Vla3MgPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKHdlZWtkYXlPdmVyZmxvdyAhPSBudWxsKSB7XG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5fb3ZlcmZsb3dXZWVrZGF5ID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRlbXAgPSBkYXlPZlllYXJGcm9tV2Vla3Mod2Vla1llYXIsIHdlZWssIHdlZWtkYXksIGRvdywgZG95KTtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtZRUFSXSA9IHRlbXAueWVhcjtcbiAgICAgICAgICAgIGNvbmZpZy5fZGF5T2ZZZWFyID0gdGVtcC5kYXlPZlllYXI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBjb25zdGFudCB0aGF0IHJlZmVycyB0byB0aGUgSVNPIHN0YW5kYXJkXG4gICAgaG9va3MuSVNPXzg2MDEgPSBmdW5jdGlvbiAoKSB7fTtcblxuICAgIC8vIGNvbnN0YW50IHRoYXQgcmVmZXJzIHRvIHRoZSBSRkMgMjgyMiBmb3JtXG4gICAgaG9va3MuUkZDXzI4MjIgPSBmdW5jdGlvbiAoKSB7fTtcblxuICAgIC8vIGRhdGUgZnJvbSBzdHJpbmcgYW5kIGZvcm1hdCBzdHJpbmdcbiAgICBmdW5jdGlvbiBjb25maWdGcm9tU3RyaW5nQW5kRm9ybWF0KGNvbmZpZykge1xuICAgICAgICAvLyBUT0RPOiBNb3ZlIHRoaXMgdG8gYW5vdGhlciBwYXJ0IG9mIHRoZSBjcmVhdGlvbiBmbG93IHRvIHByZXZlbnQgY2lyY3VsYXIgZGVwc1xuICAgICAgICBpZiAoY29uZmlnLl9mID09PSBob29rcy5JU09fODYwMSkge1xuICAgICAgICAgICAgY29uZmlnRnJvbUlTTyhjb25maWcpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb25maWcuX2YgPT09IGhvb2tzLlJGQ18yODIyKSB7XG4gICAgICAgICAgICBjb25maWdGcm9tUkZDMjgyMihjb25maWcpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbmZpZy5fYSA9IFtdO1xuICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5lbXB0eSA9IHRydWU7XG5cbiAgICAgICAgLy8gVGhpcyBhcnJheSBpcyB1c2VkIHRvIG1ha2UgYSBEYXRlLCBlaXRoZXIgd2l0aCBgbmV3IERhdGVgIG9yIGBEYXRlLlVUQ2BcbiAgICAgICAgdmFyIHN0cmluZyA9ICcnICsgY29uZmlnLl9pLFxuICAgICAgICAgICAgaSxcbiAgICAgICAgICAgIHBhcnNlZElucHV0LFxuICAgICAgICAgICAgdG9rZW5zLFxuICAgICAgICAgICAgdG9rZW4sXG4gICAgICAgICAgICBza2lwcGVkLFxuICAgICAgICAgICAgc3RyaW5nTGVuZ3RoID0gc3RyaW5nLmxlbmd0aCxcbiAgICAgICAgICAgIHRvdGFsUGFyc2VkSW5wdXRMZW5ndGggPSAwLFxuICAgICAgICAgICAgZXJhO1xuXG4gICAgICAgIHRva2VucyA9XG4gICAgICAgICAgICBleHBhbmRGb3JtYXQoY29uZmlnLl9mLCBjb25maWcuX2xvY2FsZSkubWF0Y2goZm9ybWF0dGluZ1Rva2VucykgfHwgW107XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRva2Vucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdG9rZW4gPSB0b2tlbnNbaV07XG4gICAgICAgICAgICBwYXJzZWRJbnB1dCA9IChzdHJpbmcubWF0Y2goZ2V0UGFyc2VSZWdleEZvclRva2VuKHRva2VuLCBjb25maWcpKSB8fFxuICAgICAgICAgICAgICAgIFtdKVswXTtcbiAgICAgICAgICAgIGlmIChwYXJzZWRJbnB1dCkge1xuICAgICAgICAgICAgICAgIHNraXBwZWQgPSBzdHJpbmcuc3Vic3RyKDAsIHN0cmluZy5pbmRleE9mKHBhcnNlZElucHV0KSk7XG4gICAgICAgICAgICAgICAgaWYgKHNraXBwZWQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS51bnVzZWRJbnB1dC5wdXNoKHNraXBwZWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzdHJpbmcgPSBzdHJpbmcuc2xpY2UoXG4gICAgICAgICAgICAgICAgICAgIHN0cmluZy5pbmRleE9mKHBhcnNlZElucHV0KSArIHBhcnNlZElucHV0Lmxlbmd0aFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgdG90YWxQYXJzZWRJbnB1dExlbmd0aCArPSBwYXJzZWRJbnB1dC5sZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBkb24ndCBwYXJzZSBpZiBpdCdzIG5vdCBhIGtub3duIHRva2VuXG4gICAgICAgICAgICBpZiAoZm9ybWF0VG9rZW5GdW5jdGlvbnNbdG9rZW5dKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhcnNlZElucHV0KSB7XG4gICAgICAgICAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmVtcHR5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykudW51c2VkVG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhZGRUaW1lVG9BcnJheUZyb21Ub2tlbih0b2tlbiwgcGFyc2VkSW5wdXQsIGNvbmZpZyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbmZpZy5fc3RyaWN0ICYmICFwYXJzZWRJbnB1dCkge1xuICAgICAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLnVudXNlZFRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGFkZCByZW1haW5pbmcgdW5wYXJzZWQgaW5wdXQgbGVuZ3RoIHRvIHRoZSBzdHJpbmdcbiAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuY2hhcnNMZWZ0T3ZlciA9XG4gICAgICAgICAgICBzdHJpbmdMZW5ndGggLSB0b3RhbFBhcnNlZElucHV0TGVuZ3RoO1xuICAgICAgICBpZiAoc3RyaW5nLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLnVudXNlZElucHV0LnB1c2goc3RyaW5nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNsZWFyIF8xMmggZmxhZyBpZiBob3VyIGlzIDw9IDEyXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIGNvbmZpZy5fYVtIT1VSXSA8PSAxMiAmJlxuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuYmlnSG91ciA9PT0gdHJ1ZSAmJlxuICAgICAgICAgICAgY29uZmlnLl9hW0hPVVJdID4gMFxuICAgICAgICApIHtcbiAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmJpZ0hvdXIgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5wYXJzZWREYXRlUGFydHMgPSBjb25maWcuX2Euc2xpY2UoMCk7XG4gICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLm1lcmlkaWVtID0gY29uZmlnLl9tZXJpZGllbTtcbiAgICAgICAgLy8gaGFuZGxlIG1lcmlkaWVtXG4gICAgICAgIGNvbmZpZy5fYVtIT1VSXSA9IG1lcmlkaWVtRml4V3JhcChcbiAgICAgICAgICAgIGNvbmZpZy5fbG9jYWxlLFxuICAgICAgICAgICAgY29uZmlnLl9hW0hPVVJdLFxuICAgICAgICAgICAgY29uZmlnLl9tZXJpZGllbVxuICAgICAgICApO1xuXG4gICAgICAgIC8vIGhhbmRsZSBlcmFcbiAgICAgICAgZXJhID0gZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuZXJhO1xuICAgICAgICBpZiAoZXJhICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjb25maWcuX2FbWUVBUl0gPSBjb25maWcuX2xvY2FsZS5lcmFzQ29udmVydFllYXIoZXJhLCBjb25maWcuX2FbWUVBUl0pO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uZmlnRnJvbUFycmF5KGNvbmZpZyk7XG4gICAgICAgIGNoZWNrT3ZlcmZsb3coY29uZmlnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtZXJpZGllbUZpeFdyYXAobG9jYWxlLCBob3VyLCBtZXJpZGllbSkge1xuICAgICAgICB2YXIgaXNQbTtcblxuICAgICAgICBpZiAobWVyaWRpZW0gPT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gbm90aGluZyB0byBkb1xuICAgICAgICAgICAgcmV0dXJuIGhvdXI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxvY2FsZS5tZXJpZGllbUhvdXIgIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIGxvY2FsZS5tZXJpZGllbUhvdXIoaG91ciwgbWVyaWRpZW0pO1xuICAgICAgICB9IGVsc2UgaWYgKGxvY2FsZS5pc1BNICE9IG51bGwpIHtcbiAgICAgICAgICAgIC8vIEZhbGxiYWNrXG4gICAgICAgICAgICBpc1BtID0gbG9jYWxlLmlzUE0obWVyaWRpZW0pO1xuICAgICAgICAgICAgaWYgKGlzUG0gJiYgaG91ciA8IDEyKSB7XG4gICAgICAgICAgICAgICAgaG91ciArPSAxMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaXNQbSAmJiBob3VyID09PSAxMikge1xuICAgICAgICAgICAgICAgIGhvdXIgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGhvdXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyB0aGlzIGlzIG5vdCBzdXBwb3NlZCB0byBoYXBwZW5cbiAgICAgICAgICAgIHJldHVybiBob3VyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gZGF0ZSBmcm9tIHN0cmluZyBhbmQgYXJyYXkgb2YgZm9ybWF0IHN0cmluZ3NcbiAgICBmdW5jdGlvbiBjb25maWdGcm9tU3RyaW5nQW5kQXJyYXkoY29uZmlnKSB7XG4gICAgICAgIHZhciB0ZW1wQ29uZmlnLFxuICAgICAgICAgICAgYmVzdE1vbWVudCxcbiAgICAgICAgICAgIHNjb3JlVG9CZWF0LFxuICAgICAgICAgICAgaSxcbiAgICAgICAgICAgIGN1cnJlbnRTY29yZSxcbiAgICAgICAgICAgIHZhbGlkRm9ybWF0Rm91bmQsXG4gICAgICAgICAgICBiZXN0Rm9ybWF0SXNWYWxpZCA9IGZhbHNlO1xuXG4gICAgICAgIGlmIChjb25maWcuX2YubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5pbnZhbGlkRm9ybWF0ID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKE5hTik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY29uZmlnLl9mLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjdXJyZW50U2NvcmUgPSAwO1xuICAgICAgICAgICAgdmFsaWRGb3JtYXRGb3VuZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGVtcENvbmZpZyA9IGNvcHlDb25maWcoe30sIGNvbmZpZyk7XG4gICAgICAgICAgICBpZiAoY29uZmlnLl91c2VVVEMgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRlbXBDb25maWcuX3VzZVVUQyA9IGNvbmZpZy5fdXNlVVRDO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGVtcENvbmZpZy5fZiA9IGNvbmZpZy5fZltpXTtcbiAgICAgICAgICAgIGNvbmZpZ0Zyb21TdHJpbmdBbmRGb3JtYXQodGVtcENvbmZpZyk7XG5cbiAgICAgICAgICAgIGlmIChpc1ZhbGlkKHRlbXBDb25maWcpKSB7XG4gICAgICAgICAgICAgICAgdmFsaWRGb3JtYXRGb3VuZCA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGlmIHRoZXJlIGlzIGFueSBpbnB1dCB0aGF0IHdhcyBub3QgcGFyc2VkIGFkZCBhIHBlbmFsdHkgZm9yIHRoYXQgZm9ybWF0XG4gICAgICAgICAgICBjdXJyZW50U2NvcmUgKz0gZ2V0UGFyc2luZ0ZsYWdzKHRlbXBDb25maWcpLmNoYXJzTGVmdE92ZXI7XG5cbiAgICAgICAgICAgIC8vb3IgdG9rZW5zXG4gICAgICAgICAgICBjdXJyZW50U2NvcmUgKz0gZ2V0UGFyc2luZ0ZsYWdzKHRlbXBDb25maWcpLnVudXNlZFRva2Vucy5sZW5ndGggKiAxMDtcblxuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKHRlbXBDb25maWcpLnNjb3JlID0gY3VycmVudFNjb3JlO1xuXG4gICAgICAgICAgICBpZiAoIWJlc3RGb3JtYXRJc1ZhbGlkKSB7XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICBzY29yZVRvQmVhdCA9PSBudWxsIHx8XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTY29yZSA8IHNjb3JlVG9CZWF0IHx8XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkRm9ybWF0Rm91bmRcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcmVUb0JlYXQgPSBjdXJyZW50U2NvcmU7XG4gICAgICAgICAgICAgICAgICAgIGJlc3RNb21lbnQgPSB0ZW1wQ29uZmlnO1xuICAgICAgICAgICAgICAgICAgICBpZiAodmFsaWRGb3JtYXRGb3VuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmVzdEZvcm1hdElzVmFsaWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudFNjb3JlIDwgc2NvcmVUb0JlYXQpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcmVUb0JlYXQgPSBjdXJyZW50U2NvcmU7XG4gICAgICAgICAgICAgICAgICAgIGJlc3RNb21lbnQgPSB0ZW1wQ29uZmlnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGV4dGVuZChjb25maWcsIGJlc3RNb21lbnQgfHwgdGVtcENvbmZpZyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29uZmlnRnJvbU9iamVjdChjb25maWcpIHtcbiAgICAgICAgaWYgKGNvbmZpZy5fZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGkgPSBub3JtYWxpemVPYmplY3RVbml0cyhjb25maWcuX2kpLFxuICAgICAgICAgICAgZGF5T3JEYXRlID0gaS5kYXkgPT09IHVuZGVmaW5lZCA/IGkuZGF0ZSA6IGkuZGF5O1xuICAgICAgICBjb25maWcuX2EgPSBtYXAoXG4gICAgICAgICAgICBbaS55ZWFyLCBpLm1vbnRoLCBkYXlPckRhdGUsIGkuaG91ciwgaS5taW51dGUsIGkuc2Vjb25kLCBpLm1pbGxpc2Vjb25kXSxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqICYmIHBhcnNlSW50KG9iaiwgMTApO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIGNvbmZpZ0Zyb21BcnJheShjb25maWcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUZyb21Db25maWcoY29uZmlnKSB7XG4gICAgICAgIHZhciByZXMgPSBuZXcgTW9tZW50KGNoZWNrT3ZlcmZsb3cocHJlcGFyZUNvbmZpZyhjb25maWcpKSk7XG4gICAgICAgIGlmIChyZXMuX25leHREYXkpIHtcbiAgICAgICAgICAgIC8vIEFkZGluZyBpcyBzbWFydCBlbm91Z2ggYXJvdW5kIERTVFxuICAgICAgICAgICAgcmVzLmFkZCgxLCAnZCcpO1xuICAgICAgICAgICAgcmVzLl9uZXh0RGF5ID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcmVwYXJlQ29uZmlnKGNvbmZpZykge1xuICAgICAgICB2YXIgaW5wdXQgPSBjb25maWcuX2ksXG4gICAgICAgICAgICBmb3JtYXQgPSBjb25maWcuX2Y7XG5cbiAgICAgICAgY29uZmlnLl9sb2NhbGUgPSBjb25maWcuX2xvY2FsZSB8fCBnZXRMb2NhbGUoY29uZmlnLl9sKTtcblxuICAgICAgICBpZiAoaW5wdXQgPT09IG51bGwgfHwgKGZvcm1hdCA9PT0gdW5kZWZpbmVkICYmIGlucHV0ID09PSAnJykpIHtcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVJbnZhbGlkKHsgbnVsbElucHV0OiB0cnVlIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGNvbmZpZy5faSA9IGlucHV0ID0gY29uZmlnLl9sb2NhbGUucHJlcGFyc2UoaW5wdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzTW9tZW50KGlucHV0KSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBNb21lbnQoY2hlY2tPdmVyZmxvdyhpbnB1dCkpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzRGF0ZShpbnB1dCkpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IGlucHV0O1xuICAgICAgICB9IGVsc2UgaWYgKGlzQXJyYXkoZm9ybWF0KSkge1xuICAgICAgICAgICAgY29uZmlnRnJvbVN0cmluZ0FuZEFycmF5KGNvbmZpZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoZm9ybWF0KSB7XG4gICAgICAgICAgICBjb25maWdGcm9tU3RyaW5nQW5kRm9ybWF0KGNvbmZpZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25maWdGcm9tSW5wdXQoY29uZmlnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaXNWYWxpZChjb25maWcpKSB7XG4gICAgICAgICAgICBjb25maWcuX2QgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvbmZpZztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb25maWdGcm9tSW5wdXQoY29uZmlnKSB7XG4gICAgICAgIHZhciBpbnB1dCA9IGNvbmZpZy5faTtcbiAgICAgICAgaWYgKGlzVW5kZWZpbmVkKGlucHV0KSkge1xuICAgICAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUoaG9va3Mubm93KCkpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzRGF0ZShpbnB1dCkpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKGlucHV0LnZhbHVlT2YoKSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgY29uZmlnRnJvbVN0cmluZyhjb25maWcpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzQXJyYXkoaW5wdXQpKSB7XG4gICAgICAgICAgICBjb25maWcuX2EgPSBtYXAoaW5wdXQuc2xpY2UoMCksIGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQob2JqLCAxMCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbmZpZ0Zyb21BcnJheShjb25maWcpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KGlucHV0KSkge1xuICAgICAgICAgICAgY29uZmlnRnJvbU9iamVjdChjb25maWcpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzTnVtYmVyKGlucHV0KSkge1xuICAgICAgICAgICAgLy8gZnJvbSBtaWxsaXNlY29uZHNcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKGlucHV0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGhvb2tzLmNyZWF0ZUZyb21JbnB1dEZhbGxiYWNrKGNvbmZpZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVMb2NhbE9yVVRDKGlucHV0LCBmb3JtYXQsIGxvY2FsZSwgc3RyaWN0LCBpc1VUQykge1xuICAgICAgICB2YXIgYyA9IHt9O1xuXG4gICAgICAgIGlmIChmb3JtYXQgPT09IHRydWUgfHwgZm9ybWF0ID09PSBmYWxzZSkge1xuICAgICAgICAgICAgc3RyaWN0ID0gZm9ybWF0O1xuICAgICAgICAgICAgZm9ybWF0ID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxvY2FsZSA9PT0gdHJ1ZSB8fCBsb2NhbGUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBzdHJpY3QgPSBsb2NhbGU7XG4gICAgICAgICAgICBsb2NhbGUgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICAoaXNPYmplY3QoaW5wdXQpICYmIGlzT2JqZWN0RW1wdHkoaW5wdXQpKSB8fFxuICAgICAgICAgICAgKGlzQXJyYXkoaW5wdXQpICYmIGlucHV0Lmxlbmd0aCA9PT0gMClcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBpbnB1dCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICAvLyBvYmplY3QgY29uc3RydWN0aW9uIG11c3QgYmUgZG9uZSB0aGlzIHdheS5cbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL21vbWVudC9tb21lbnQvaXNzdWVzLzE0MjNcbiAgICAgICAgYy5faXNBTW9tZW50T2JqZWN0ID0gdHJ1ZTtcbiAgICAgICAgYy5fdXNlVVRDID0gYy5faXNVVEMgPSBpc1VUQztcbiAgICAgICAgYy5fbCA9IGxvY2FsZTtcbiAgICAgICAgYy5faSA9IGlucHV0O1xuICAgICAgICBjLl9mID0gZm9ybWF0O1xuICAgICAgICBjLl9zdHJpY3QgPSBzdHJpY3Q7XG5cbiAgICAgICAgcmV0dXJuIGNyZWF0ZUZyb21Db25maWcoYyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlTG9jYWwoaW5wdXQsIGZvcm1hdCwgbG9jYWxlLCBzdHJpY3QpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUxvY2FsT3JVVEMoaW5wdXQsIGZvcm1hdCwgbG9jYWxlLCBzdHJpY3QsIGZhbHNlKTtcbiAgICB9XG5cbiAgICB2YXIgcHJvdG90eXBlTWluID0gZGVwcmVjYXRlKFxuICAgICAgICAgICAgJ21vbWVudCgpLm1pbiBpcyBkZXByZWNhdGVkLCB1c2UgbW9tZW50Lm1heCBpbnN0ZWFkLiBodHRwOi8vbW9tZW50anMuY29tL2d1aWRlcy8jL3dhcm5pbmdzL21pbi1tYXgvJyxcbiAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgb3RoZXIgPSBjcmVhdGVMb2NhbC5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzVmFsaWQoKSAmJiBvdGhlci5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG90aGVyIDwgdGhpcyA/IHRoaXMgOiBvdGhlcjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlSW52YWxpZCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKSxcbiAgICAgICAgcHJvdG90eXBlTWF4ID0gZGVwcmVjYXRlKFxuICAgICAgICAgICAgJ21vbWVudCgpLm1heCBpcyBkZXByZWNhdGVkLCB1c2UgbW9tZW50Lm1pbiBpbnN0ZWFkLiBodHRwOi8vbW9tZW50anMuY29tL2d1aWRlcy8jL3dhcm5pbmdzL21pbi1tYXgvJyxcbiAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgb3RoZXIgPSBjcmVhdGVMb2NhbC5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzVmFsaWQoKSAmJiBvdGhlci5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG90aGVyID4gdGhpcyA/IHRoaXMgOiBvdGhlcjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlSW52YWxpZCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgIC8vIFBpY2sgYSBtb21lbnQgbSBmcm9tIG1vbWVudHMgc28gdGhhdCBtW2ZuXShvdGhlcikgaXMgdHJ1ZSBmb3IgYWxsXG4gICAgLy8gb3RoZXIuIFRoaXMgcmVsaWVzIG9uIHRoZSBmdW5jdGlvbiBmbiB0byBiZSB0cmFuc2l0aXZlLlxuICAgIC8vXG4gICAgLy8gbW9tZW50cyBzaG91bGQgZWl0aGVyIGJlIGFuIGFycmF5IG9mIG1vbWVudCBvYmplY3RzIG9yIGFuIGFycmF5LCB3aG9zZVxuICAgIC8vIGZpcnN0IGVsZW1lbnQgaXMgYW4gYXJyYXkgb2YgbW9tZW50IG9iamVjdHMuXG4gICAgZnVuY3Rpb24gcGlja0J5KGZuLCBtb21lbnRzKSB7XG4gICAgICAgIHZhciByZXMsIGk7XG4gICAgICAgIGlmIChtb21lbnRzLmxlbmd0aCA9PT0gMSAmJiBpc0FycmF5KG1vbWVudHNbMF0pKSB7XG4gICAgICAgICAgICBtb21lbnRzID0gbW9tZW50c1swXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIW1vbWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlTG9jYWwoKTtcbiAgICAgICAgfVxuICAgICAgICByZXMgPSBtb21lbnRzWzBdO1xuICAgICAgICBmb3IgKGkgPSAxOyBpIDwgbW9tZW50cy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgaWYgKCFtb21lbnRzW2ldLmlzVmFsaWQoKSB8fCBtb21lbnRzW2ldW2ZuXShyZXMpKSB7XG4gICAgICAgICAgICAgICAgcmVzID0gbW9tZW50c1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIC8vIFRPRE86IFVzZSBbXS5zb3J0IGluc3RlYWQ/XG4gICAgZnVuY3Rpb24gbWluKCkge1xuICAgICAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcblxuICAgICAgICByZXR1cm4gcGlja0J5KCdpc0JlZm9yZScsIGFyZ3MpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1heCgpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG5cbiAgICAgICAgcmV0dXJuIHBpY2tCeSgnaXNBZnRlcicsIGFyZ3MpO1xuICAgIH1cblxuICAgIHZhciBub3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBEYXRlLm5vdyA/IERhdGUubm93KCkgOiArbmV3IERhdGUoKTtcbiAgICB9O1xuXG4gICAgdmFyIG9yZGVyaW5nID0gW1xuICAgICAgICAneWVhcicsXG4gICAgICAgICdxdWFydGVyJyxcbiAgICAgICAgJ21vbnRoJyxcbiAgICAgICAgJ3dlZWsnLFxuICAgICAgICAnZGF5JyxcbiAgICAgICAgJ2hvdXInLFxuICAgICAgICAnbWludXRlJyxcbiAgICAgICAgJ3NlY29uZCcsXG4gICAgICAgICdtaWxsaXNlY29uZCcsXG4gICAgXTtcblxuICAgIGZ1bmN0aW9uIGlzRHVyYXRpb25WYWxpZChtKSB7XG4gICAgICAgIHZhciBrZXksXG4gICAgICAgICAgICB1bml0SGFzRGVjaW1hbCA9IGZhbHNlLFxuICAgICAgICAgICAgaTtcbiAgICAgICAgZm9yIChrZXkgaW4gbSkge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGhhc093blByb3AobSwga2V5KSAmJlxuICAgICAgICAgICAgICAgICEoXG4gICAgICAgICAgICAgICAgICAgIGluZGV4T2YuY2FsbChvcmRlcmluZywga2V5KSAhPT0gLTEgJiZcbiAgICAgICAgICAgICAgICAgICAgKG1ba2V5XSA9PSBudWxsIHx8ICFpc05hTihtW2tleV0pKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBvcmRlcmluZy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgaWYgKG1bb3JkZXJpbmdbaV1dKSB7XG4gICAgICAgICAgICAgICAgaWYgKHVuaXRIYXNEZWNpbWFsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8gb25seSBhbGxvdyBub24taW50ZWdlcnMgZm9yIHNtYWxsZXN0IHVuaXRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHBhcnNlRmxvYXQobVtvcmRlcmluZ1tpXV0pICE9PSB0b0ludChtW29yZGVyaW5nW2ldXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdW5pdEhhc0RlY2ltYWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzVmFsaWQkMSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzVmFsaWQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlSW52YWxpZCQxKCkge1xuICAgICAgICByZXR1cm4gY3JlYXRlRHVyYXRpb24oTmFOKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBEdXJhdGlvbihkdXJhdGlvbikge1xuICAgICAgICB2YXIgbm9ybWFsaXplZElucHV0ID0gbm9ybWFsaXplT2JqZWN0VW5pdHMoZHVyYXRpb24pLFxuICAgICAgICAgICAgeWVhcnMgPSBub3JtYWxpemVkSW5wdXQueWVhciB8fCAwLFxuICAgICAgICAgICAgcXVhcnRlcnMgPSBub3JtYWxpemVkSW5wdXQucXVhcnRlciB8fCAwLFxuICAgICAgICAgICAgbW9udGhzID0gbm9ybWFsaXplZElucHV0Lm1vbnRoIHx8IDAsXG4gICAgICAgICAgICB3ZWVrcyA9IG5vcm1hbGl6ZWRJbnB1dC53ZWVrIHx8IG5vcm1hbGl6ZWRJbnB1dC5pc29XZWVrIHx8IDAsXG4gICAgICAgICAgICBkYXlzID0gbm9ybWFsaXplZElucHV0LmRheSB8fCAwLFxuICAgICAgICAgICAgaG91cnMgPSBub3JtYWxpemVkSW5wdXQuaG91ciB8fCAwLFxuICAgICAgICAgICAgbWludXRlcyA9IG5vcm1hbGl6ZWRJbnB1dC5taW51dGUgfHwgMCxcbiAgICAgICAgICAgIHNlY29uZHMgPSBub3JtYWxpemVkSW5wdXQuc2Vjb25kIHx8IDAsXG4gICAgICAgICAgICBtaWxsaXNlY29uZHMgPSBub3JtYWxpemVkSW5wdXQubWlsbGlzZWNvbmQgfHwgMDtcblxuICAgICAgICB0aGlzLl9pc1ZhbGlkID0gaXNEdXJhdGlvblZhbGlkKG5vcm1hbGl6ZWRJbnB1dCk7XG5cbiAgICAgICAgLy8gcmVwcmVzZW50YXRpb24gZm9yIGRhdGVBZGRSZW1vdmVcbiAgICAgICAgdGhpcy5fbWlsbGlzZWNvbmRzID1cbiAgICAgICAgICAgICttaWxsaXNlY29uZHMgK1xuICAgICAgICAgICAgc2Vjb25kcyAqIDFlMyArIC8vIDEwMDBcbiAgICAgICAgICAgIG1pbnV0ZXMgKiA2ZTQgKyAvLyAxMDAwICogNjBcbiAgICAgICAgICAgIGhvdXJzICogMTAwMCAqIDYwICogNjA7IC8vdXNpbmcgMTAwMCAqIDYwICogNjAgaW5zdGVhZCBvZiAzNmU1IHRvIGF2b2lkIGZsb2F0aW5nIHBvaW50IHJvdW5kaW5nIGVycm9ycyBodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9pc3N1ZXMvMjk3OFxuICAgICAgICAvLyBCZWNhdXNlIG9mIGRhdGVBZGRSZW1vdmUgdHJlYXRzIDI0IGhvdXJzIGFzIGRpZmZlcmVudCBmcm9tIGFcbiAgICAgICAgLy8gZGF5IHdoZW4gd29ya2luZyBhcm91bmQgRFNULCB3ZSBuZWVkIHRvIHN0b3JlIHRoZW0gc2VwYXJhdGVseVxuICAgICAgICB0aGlzLl9kYXlzID0gK2RheXMgKyB3ZWVrcyAqIDc7XG4gICAgICAgIC8vIEl0IGlzIGltcG9zc2libGUgdG8gdHJhbnNsYXRlIG1vbnRocyBpbnRvIGRheXMgd2l0aG91dCBrbm93aW5nXG4gICAgICAgIC8vIHdoaWNoIG1vbnRocyB5b3UgYXJlIGFyZSB0YWxraW5nIGFib3V0LCBzbyB3ZSBoYXZlIHRvIHN0b3JlXG4gICAgICAgIC8vIGl0IHNlcGFyYXRlbHkuXG4gICAgICAgIHRoaXMuX21vbnRocyA9ICttb250aHMgKyBxdWFydGVycyAqIDMgKyB5ZWFycyAqIDEyO1xuXG4gICAgICAgIHRoaXMuX2RhdGEgPSB7fTtcblxuICAgICAgICB0aGlzLl9sb2NhbGUgPSBnZXRMb2NhbGUoKTtcblxuICAgICAgICB0aGlzLl9idWJibGUoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0R1cmF0aW9uKG9iaikge1xuICAgICAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgRHVyYXRpb247XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWJzUm91bmQobnVtYmVyKSB7XG4gICAgICAgIGlmIChudW1iZXIgPCAwKSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5yb3VuZCgtMSAqIG51bWJlcikgKiAtMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnJvdW5kKG51bWJlcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBjb21wYXJlIHR3byBhcnJheXMsIHJldHVybiB0aGUgbnVtYmVyIG9mIGRpZmZlcmVuY2VzXG4gICAgZnVuY3Rpb24gY29tcGFyZUFycmF5cyhhcnJheTEsIGFycmF5MiwgZG9udENvbnZlcnQpIHtcbiAgICAgICAgdmFyIGxlbiA9IE1hdGgubWluKGFycmF5MS5sZW5ndGgsIGFycmF5Mi5sZW5ndGgpLFxuICAgICAgICAgICAgbGVuZ3RoRGlmZiA9IE1hdGguYWJzKGFycmF5MS5sZW5ndGggLSBhcnJheTIubGVuZ3RoKSxcbiAgICAgICAgICAgIGRpZmZzID0gMCxcbiAgICAgICAgICAgIGk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIChkb250Q29udmVydCAmJiBhcnJheTFbaV0gIT09IGFycmF5MltpXSkgfHxcbiAgICAgICAgICAgICAgICAoIWRvbnRDb252ZXJ0ICYmIHRvSW50KGFycmF5MVtpXSkgIT09IHRvSW50KGFycmF5MltpXSkpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBkaWZmcysrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkaWZmcyArIGxlbmd0aERpZmY7XG4gICAgfVxuXG4gICAgLy8gRk9STUFUVElOR1xuXG4gICAgZnVuY3Rpb24gb2Zmc2V0KHRva2VuLCBzZXBhcmF0b3IpIHtcbiAgICAgICAgYWRkRm9ybWF0VG9rZW4odG9rZW4sIDAsIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSB0aGlzLnV0Y09mZnNldCgpLFxuICAgICAgICAgICAgICAgIHNpZ24gPSAnKyc7XG4gICAgICAgICAgICBpZiAob2Zmc2V0IDwgMCkge1xuICAgICAgICAgICAgICAgIG9mZnNldCA9IC1vZmZzZXQ7XG4gICAgICAgICAgICAgICAgc2lnbiA9ICctJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgc2lnbiArXG4gICAgICAgICAgICAgICAgemVyb0ZpbGwofn4ob2Zmc2V0IC8gNjApLCAyKSArXG4gICAgICAgICAgICAgICAgc2VwYXJhdG9yICtcbiAgICAgICAgICAgICAgICB6ZXJvRmlsbCh+fm9mZnNldCAlIDYwLCAyKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgb2Zmc2V0KCdaJywgJzonKTtcbiAgICBvZmZzZXQoJ1paJywgJycpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignWicsIG1hdGNoU2hvcnRPZmZzZXQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1paJywgbWF0Y2hTaG9ydE9mZnNldCk7XG4gICAgYWRkUGFyc2VUb2tlbihbJ1onLCAnWlonXSwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgICAgIGNvbmZpZy5fdXNlVVRDID0gdHJ1ZTtcbiAgICAgICAgY29uZmlnLl90em0gPSBvZmZzZXRGcm9tU3RyaW5nKG1hdGNoU2hvcnRPZmZzZXQsIGlucHV0KTtcbiAgICB9KTtcblxuICAgIC8vIEhFTFBFUlNcblxuICAgIC8vIHRpbWV6b25lIGNodW5rZXJcbiAgICAvLyAnKzEwOjAwJyA+IFsnMTAnLCAgJzAwJ11cbiAgICAvLyAnLTE1MzAnICA+IFsnLTE1JywgJzMwJ11cbiAgICB2YXIgY2h1bmtPZmZzZXQgPSAvKFtcXCtcXC1dfFxcZFxcZCkvZ2k7XG5cbiAgICBmdW5jdGlvbiBvZmZzZXRGcm9tU3RyaW5nKG1hdGNoZXIsIHN0cmluZykge1xuICAgICAgICB2YXIgbWF0Y2hlcyA9IChzdHJpbmcgfHwgJycpLm1hdGNoKG1hdGNoZXIpLFxuICAgICAgICAgICAgY2h1bmssXG4gICAgICAgICAgICBwYXJ0cyxcbiAgICAgICAgICAgIG1pbnV0ZXM7XG5cbiAgICAgICAgaWYgKG1hdGNoZXMgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgY2h1bmsgPSBtYXRjaGVzW21hdGNoZXMubGVuZ3RoIC0gMV0gfHwgW107XG4gICAgICAgIHBhcnRzID0gKGNodW5rICsgJycpLm1hdGNoKGNodW5rT2Zmc2V0KSB8fCBbJy0nLCAwLCAwXTtcbiAgICAgICAgbWludXRlcyA9ICsocGFydHNbMV0gKiA2MCkgKyB0b0ludChwYXJ0c1syXSk7XG5cbiAgICAgICAgcmV0dXJuIG1pbnV0ZXMgPT09IDAgPyAwIDogcGFydHNbMF0gPT09ICcrJyA/IG1pbnV0ZXMgOiAtbWludXRlcztcbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYSBtb21lbnQgZnJvbSBpbnB1dCwgdGhhdCBpcyBsb2NhbC91dGMvem9uZSBlcXVpdmFsZW50IHRvIG1vZGVsLlxuICAgIGZ1bmN0aW9uIGNsb25lV2l0aE9mZnNldChpbnB1dCwgbW9kZWwpIHtcbiAgICAgICAgdmFyIHJlcywgZGlmZjtcbiAgICAgICAgaWYgKG1vZGVsLl9pc1VUQykge1xuICAgICAgICAgICAgcmVzID0gbW9kZWwuY2xvbmUoKTtcbiAgICAgICAgICAgIGRpZmYgPVxuICAgICAgICAgICAgICAgIChpc01vbWVudChpbnB1dCkgfHwgaXNEYXRlKGlucHV0KVxuICAgICAgICAgICAgICAgICAgICA/IGlucHV0LnZhbHVlT2YoKVxuICAgICAgICAgICAgICAgICAgICA6IGNyZWF0ZUxvY2FsKGlucHV0KS52YWx1ZU9mKCkpIC0gcmVzLnZhbHVlT2YoKTtcbiAgICAgICAgICAgIC8vIFVzZSBsb3ctbGV2ZWwgYXBpLCBiZWNhdXNlIHRoaXMgZm4gaXMgbG93LWxldmVsIGFwaS5cbiAgICAgICAgICAgIHJlcy5fZC5zZXRUaW1lKHJlcy5fZC52YWx1ZU9mKCkgKyBkaWZmKTtcbiAgICAgICAgICAgIGhvb2tzLnVwZGF0ZU9mZnNldChyZXMsIGZhbHNlKTtcbiAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlTG9jYWwoaW5wdXQpLmxvY2FsKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXREYXRlT2Zmc2V0KG0pIHtcbiAgICAgICAgLy8gT24gRmlyZWZveC4yNCBEYXRlI2dldFRpbWV6b25lT2Zmc2V0IHJldHVybnMgYSBmbG9hdGluZyBwb2ludC5cbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL21vbWVudC9tb21lbnQvcHVsbC8xODcxXG4gICAgICAgIHJldHVybiAtTWF0aC5yb3VuZChtLl9kLmdldFRpbWV6b25lT2Zmc2V0KCkpO1xuICAgIH1cblxuICAgIC8vIEhPT0tTXG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHdoZW5ldmVyIGEgbW9tZW50IGlzIG11dGF0ZWQuXG4gICAgLy8gSXQgaXMgaW50ZW5kZWQgdG8ga2VlcCB0aGUgb2Zmc2V0IGluIHN5bmMgd2l0aCB0aGUgdGltZXpvbmUuXG4gICAgaG9va3MudXBkYXRlT2Zmc2V0ID0gZnVuY3Rpb24gKCkge307XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICAvLyBrZWVwTG9jYWxUaW1lID0gdHJ1ZSBtZWFucyBvbmx5IGNoYW5nZSB0aGUgdGltZXpvbmUsIHdpdGhvdXRcbiAgICAvLyBhZmZlY3RpbmcgdGhlIGxvY2FsIGhvdXIuIFNvIDU6MzE6MjYgKzAzMDAgLS1bdXRjT2Zmc2V0KDIsIHRydWUpXS0tPlxuICAgIC8vIDU6MzE6MjYgKzAyMDAgSXQgaXMgcG9zc2libGUgdGhhdCA1OjMxOjI2IGRvZXNuJ3QgZXhpc3Qgd2l0aCBvZmZzZXRcbiAgICAvLyArMDIwMCwgc28gd2UgYWRqdXN0IHRoZSB0aW1lIGFzIG5lZWRlZCwgdG8gYmUgdmFsaWQuXG4gICAgLy9cbiAgICAvLyBLZWVwaW5nIHRoZSB0aW1lIGFjdHVhbGx5IGFkZHMvc3VidHJhY3RzIChvbmUgaG91cilcbiAgICAvLyBmcm9tIHRoZSBhY3R1YWwgcmVwcmVzZW50ZWQgdGltZS4gVGhhdCBpcyB3aHkgd2UgY2FsbCB1cGRhdGVPZmZzZXRcbiAgICAvLyBhIHNlY29uZCB0aW1lLiBJbiBjYXNlIGl0IHdhbnRzIHVzIHRvIGNoYW5nZSB0aGUgb2Zmc2V0IGFnYWluXG4gICAgLy8gX2NoYW5nZUluUHJvZ3Jlc3MgPT0gdHJ1ZSBjYXNlLCB0aGVuIHdlIGhhdmUgdG8gYWRqdXN0LCBiZWNhdXNlXG4gICAgLy8gdGhlcmUgaXMgbm8gc3VjaCB0aW1lIGluIHRoZSBnaXZlbiB0aW1lem9uZS5cbiAgICBmdW5jdGlvbiBnZXRTZXRPZmZzZXQoaW5wdXQsIGtlZXBMb2NhbFRpbWUsIGtlZXBNaW51dGVzKSB7XG4gICAgICAgIHZhciBvZmZzZXQgPSB0aGlzLl9vZmZzZXQgfHwgMCxcbiAgICAgICAgICAgIGxvY2FsQWRqdXN0O1xuICAgICAgICBpZiAoIXRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQgIT0gbnVsbCA/IHRoaXMgOiBOYU47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlucHV0ICE9IG51bGwpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSBvZmZzZXRGcm9tU3RyaW5nKG1hdGNoU2hvcnRPZmZzZXQsIGlucHV0KTtcbiAgICAgICAgICAgICAgICBpZiAoaW5wdXQgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChNYXRoLmFicyhpbnB1dCkgPCAxNiAmJiAha2VlcE1pbnV0ZXMpIHtcbiAgICAgICAgICAgICAgICBpbnB1dCA9IGlucHV0ICogNjA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2lzVVRDICYmIGtlZXBMb2NhbFRpbWUpIHtcbiAgICAgICAgICAgICAgICBsb2NhbEFkanVzdCA9IGdldERhdGVPZmZzZXQodGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9vZmZzZXQgPSBpbnB1dDtcbiAgICAgICAgICAgIHRoaXMuX2lzVVRDID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmIChsb2NhbEFkanVzdCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGQobG9jYWxBZGp1c3QsICdtJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob2Zmc2V0ICE9PSBpbnB1dCkge1xuICAgICAgICAgICAgICAgIGlmICgha2VlcExvY2FsVGltZSB8fCB0aGlzLl9jaGFuZ2VJblByb2dyZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIGFkZFN1YnRyYWN0KFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZUR1cmF0aW9uKGlucHV0IC0gb2Zmc2V0LCAnbScpLFxuICAgICAgICAgICAgICAgICAgICAgICAgMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICghdGhpcy5fY2hhbmdlSW5Qcm9ncmVzcykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFuZ2VJblByb2dyZXNzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgaG9va3MudXBkYXRlT2Zmc2V0KHRoaXMsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFuZ2VJblByb2dyZXNzID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pc1VUQyA/IG9mZnNldCA6IGdldERhdGVPZmZzZXQodGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRTZXRab25lKGlucHV0LCBrZWVwTG9jYWxUaW1lKSB7XG4gICAgICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGlucHV0ICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIGlucHV0ID0gLWlucHV0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnV0Y09mZnNldChpbnB1dCwga2VlcExvY2FsVGltZSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIC10aGlzLnV0Y09mZnNldCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0T2Zmc2V0VG9VVEMoa2VlcExvY2FsVGltZSkge1xuICAgICAgICByZXR1cm4gdGhpcy51dGNPZmZzZXQoMCwga2VlcExvY2FsVGltZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0T2Zmc2V0VG9Mb2NhbChrZWVwTG9jYWxUaW1lKSB7XG4gICAgICAgIGlmICh0aGlzLl9pc1VUQykge1xuICAgICAgICAgICAgdGhpcy51dGNPZmZzZXQoMCwga2VlcExvY2FsVGltZSk7XG4gICAgICAgICAgICB0aGlzLl9pc1VUQyA9IGZhbHNlO1xuXG4gICAgICAgICAgICBpZiAoa2VlcExvY2FsVGltZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3VidHJhY3QoZ2V0RGF0ZU9mZnNldCh0aGlzKSwgJ20nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRPZmZzZXRUb1BhcnNlZE9mZnNldCgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3R6bSAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLnV0Y09mZnNldCh0aGlzLl90em0sIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5faSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHZhciB0Wm9uZSA9IG9mZnNldEZyb21TdHJpbmcobWF0Y2hPZmZzZXQsIHRoaXMuX2kpO1xuICAgICAgICAgICAgaWYgKHRab25lICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnV0Y09mZnNldCh0Wm9uZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudXRjT2Zmc2V0KDAsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhc0FsaWduZWRIb3VyT2Zmc2V0KGlucHV0KSB7XG4gICAgICAgIGlmICghdGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpbnB1dCA9IGlucHV0ID8gY3JlYXRlTG9jYWwoaW5wdXQpLnV0Y09mZnNldCgpIDogMDtcblxuICAgICAgICByZXR1cm4gKHRoaXMudXRjT2Zmc2V0KCkgLSBpbnB1dCkgJSA2MCA9PT0gMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0RheWxpZ2h0U2F2aW5nVGltZSgpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIHRoaXMudXRjT2Zmc2V0KCkgPiB0aGlzLmNsb25lKCkubW9udGgoMCkudXRjT2Zmc2V0KCkgfHxcbiAgICAgICAgICAgIHRoaXMudXRjT2Zmc2V0KCkgPiB0aGlzLmNsb25lKCkubW9udGgoNSkudXRjT2Zmc2V0KClcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0RheWxpZ2h0U2F2aW5nVGltZVNoaWZ0ZWQoKSB7XG4gICAgICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5faXNEU1RTaGlmdGVkKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2lzRFNUU2hpZnRlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjID0ge30sXG4gICAgICAgICAgICBvdGhlcjtcblxuICAgICAgICBjb3B5Q29uZmlnKGMsIHRoaXMpO1xuICAgICAgICBjID0gcHJlcGFyZUNvbmZpZyhjKTtcblxuICAgICAgICBpZiAoYy5fYSkge1xuICAgICAgICAgICAgb3RoZXIgPSBjLl9pc1VUQyA/IGNyZWF0ZVVUQyhjLl9hKSA6IGNyZWF0ZUxvY2FsKGMuX2EpO1xuICAgICAgICAgICAgdGhpcy5faXNEU1RTaGlmdGVkID1cbiAgICAgICAgICAgICAgICB0aGlzLmlzVmFsaWQoKSAmJiBjb21wYXJlQXJyYXlzKGMuX2EsIG90aGVyLnRvQXJyYXkoKSkgPiAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5faXNEU1RTaGlmdGVkID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5faXNEU1RTaGlmdGVkO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzTG9jYWwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzVmFsaWQoKSA/ICF0aGlzLl9pc1VUQyA6IGZhbHNlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzVXRjT2Zmc2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc1ZhbGlkKCkgPyB0aGlzLl9pc1VUQyA6IGZhbHNlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzVXRjKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc1ZhbGlkKCkgPyB0aGlzLl9pc1VUQyAmJiB0aGlzLl9vZmZzZXQgPT09IDAgOiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBBU1AuTkVUIGpzb24gZGF0ZSBmb3JtYXQgcmVnZXhcbiAgICB2YXIgYXNwTmV0UmVnZXggPSAvXigtfFxcKyk/KD86KFxcZCopWy4gXSk/KFxcZCspOihcXGQrKSg/OjooXFxkKykoXFwuXFxkKik/KT8kLyxcbiAgICAgICAgLy8gZnJvbSBodHRwOi8vZG9jcy5jbG9zdXJlLWxpYnJhcnkuZ29vZ2xlY29kZS5jb20vZ2l0L2Nsb3N1cmVfZ29vZ19kYXRlX2RhdGUuanMuc291cmNlLmh0bWxcbiAgICAgICAgLy8gc29tZXdoYXQgbW9yZSBpbiBsaW5lIHdpdGggNC40LjMuMiAyMDA0IHNwZWMsIGJ1dCBhbGxvd3MgZGVjaW1hbCBhbnl3aGVyZVxuICAgICAgICAvLyBhbmQgZnVydGhlciBtb2RpZmllZCB0byBhbGxvdyBmb3Igc3RyaW5ncyBjb250YWluaW5nIGJvdGggd2VlayBhbmQgZGF5XG4gICAgICAgIGlzb1JlZ2V4ID0gL14oLXxcXCspP1AoPzooWy0rXT9bMC05LC5dKilZKT8oPzooWy0rXT9bMC05LC5dKilNKT8oPzooWy0rXT9bMC05LC5dKilXKT8oPzooWy0rXT9bMC05LC5dKilEKT8oPzpUKD86KFstK10/WzAtOSwuXSopSCk/KD86KFstK10/WzAtOSwuXSopTSk/KD86KFstK10/WzAtOSwuXSopUyk/KT8kLztcblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUR1cmF0aW9uKGlucHV0LCBrZXkpIHtcbiAgICAgICAgdmFyIGR1cmF0aW9uID0gaW5wdXQsXG4gICAgICAgICAgICAvLyBtYXRjaGluZyBhZ2FpbnN0IHJlZ2V4cCBpcyBleHBlbnNpdmUsIGRvIGl0IG9uIGRlbWFuZFxuICAgICAgICAgICAgbWF0Y2ggPSBudWxsLFxuICAgICAgICAgICAgc2lnbixcbiAgICAgICAgICAgIHJldCxcbiAgICAgICAgICAgIGRpZmZSZXM7XG5cbiAgICAgICAgaWYgKGlzRHVyYXRpb24oaW5wdXQpKSB7XG4gICAgICAgICAgICBkdXJhdGlvbiA9IHtcbiAgICAgICAgICAgICAgICBtczogaW5wdXQuX21pbGxpc2Vjb25kcyxcbiAgICAgICAgICAgICAgICBkOiBpbnB1dC5fZGF5cyxcbiAgICAgICAgICAgICAgICBNOiBpbnB1dC5fbW9udGhzLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIGlmIChpc051bWJlcihpbnB1dCkgfHwgIWlzTmFOKCtpbnB1dCkpIHtcbiAgICAgICAgICAgIGR1cmF0aW9uID0ge307XG4gICAgICAgICAgICBpZiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb25ba2V5XSA9ICtpbnB1dDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb24ubWlsbGlzZWNvbmRzID0gK2lucHV0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKChtYXRjaCA9IGFzcE5ldFJlZ2V4LmV4ZWMoaW5wdXQpKSkge1xuICAgICAgICAgICAgc2lnbiA9IG1hdGNoWzFdID09PSAnLScgPyAtMSA6IDE7XG4gICAgICAgICAgICBkdXJhdGlvbiA9IHtcbiAgICAgICAgICAgICAgICB5OiAwLFxuICAgICAgICAgICAgICAgIGQ6IHRvSW50KG1hdGNoW0RBVEVdKSAqIHNpZ24sXG4gICAgICAgICAgICAgICAgaDogdG9JbnQobWF0Y2hbSE9VUl0pICogc2lnbixcbiAgICAgICAgICAgICAgICBtOiB0b0ludChtYXRjaFtNSU5VVEVdKSAqIHNpZ24sXG4gICAgICAgICAgICAgICAgczogdG9JbnQobWF0Y2hbU0VDT05EXSkgKiBzaWduLFxuICAgICAgICAgICAgICAgIG1zOiB0b0ludChhYnNSb3VuZChtYXRjaFtNSUxMSVNFQ09ORF0gKiAxMDAwKSkgKiBzaWduLCAvLyB0aGUgbWlsbGlzZWNvbmQgZGVjaW1hbCBwb2ludCBpcyBpbmNsdWRlZCBpbiB0aGUgbWF0Y2hcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSBpZiAoKG1hdGNoID0gaXNvUmVnZXguZXhlYyhpbnB1dCkpKSB7XG4gICAgICAgICAgICBzaWduID0gbWF0Y2hbMV0gPT09ICctJyA/IC0xIDogMTtcbiAgICAgICAgICAgIGR1cmF0aW9uID0ge1xuICAgICAgICAgICAgICAgIHk6IHBhcnNlSXNvKG1hdGNoWzJdLCBzaWduKSxcbiAgICAgICAgICAgICAgICBNOiBwYXJzZUlzbyhtYXRjaFszXSwgc2lnbiksXG4gICAgICAgICAgICAgICAgdzogcGFyc2VJc28obWF0Y2hbNF0sIHNpZ24pLFxuICAgICAgICAgICAgICAgIGQ6IHBhcnNlSXNvKG1hdGNoWzVdLCBzaWduKSxcbiAgICAgICAgICAgICAgICBoOiBwYXJzZUlzbyhtYXRjaFs2XSwgc2lnbiksXG4gICAgICAgICAgICAgICAgbTogcGFyc2VJc28obWF0Y2hbN10sIHNpZ24pLFxuICAgICAgICAgICAgICAgIHM6IHBhcnNlSXNvKG1hdGNoWzhdLCBzaWduKSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSBpZiAoZHVyYXRpb24gPT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gY2hlY2tzIGZvciBudWxsIG9yIHVuZGVmaW5lZFxuICAgICAgICAgICAgZHVyYXRpb24gPSB7fTtcbiAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgIHR5cGVvZiBkdXJhdGlvbiA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgICAgICgnZnJvbScgaW4gZHVyYXRpb24gfHwgJ3RvJyBpbiBkdXJhdGlvbilcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBkaWZmUmVzID0gbW9tZW50c0RpZmZlcmVuY2UoXG4gICAgICAgICAgICAgICAgY3JlYXRlTG9jYWwoZHVyYXRpb24uZnJvbSksXG4gICAgICAgICAgICAgICAgY3JlYXRlTG9jYWwoZHVyYXRpb24udG8pXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBkdXJhdGlvbiA9IHt9O1xuICAgICAgICAgICAgZHVyYXRpb24ubXMgPSBkaWZmUmVzLm1pbGxpc2Vjb25kcztcbiAgICAgICAgICAgIGR1cmF0aW9uLk0gPSBkaWZmUmVzLm1vbnRocztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldCA9IG5ldyBEdXJhdGlvbihkdXJhdGlvbik7XG5cbiAgICAgICAgaWYgKGlzRHVyYXRpb24oaW5wdXQpICYmIGhhc093blByb3AoaW5wdXQsICdfbG9jYWxlJykpIHtcbiAgICAgICAgICAgIHJldC5fbG9jYWxlID0gaW5wdXQuX2xvY2FsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0R1cmF0aW9uKGlucHV0KSAmJiBoYXNPd25Qcm9wKGlucHV0LCAnX2lzVmFsaWQnKSkge1xuICAgICAgICAgICAgcmV0Ll9pc1ZhbGlkID0gaW5wdXQuX2lzVmFsaWQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIGNyZWF0ZUR1cmF0aW9uLmZuID0gRHVyYXRpb24ucHJvdG90eXBlO1xuICAgIGNyZWF0ZUR1cmF0aW9uLmludmFsaWQgPSBjcmVhdGVJbnZhbGlkJDE7XG5cbiAgICBmdW5jdGlvbiBwYXJzZUlzbyhpbnAsIHNpZ24pIHtcbiAgICAgICAgLy8gV2UnZCBub3JtYWxseSB1c2Ugfn5pbnAgZm9yIHRoaXMsIGJ1dCB1bmZvcnR1bmF0ZWx5IGl0IGFsc29cbiAgICAgICAgLy8gY29udmVydHMgZmxvYXRzIHRvIGludHMuXG4gICAgICAgIC8vIGlucCBtYXkgYmUgdW5kZWZpbmVkLCBzbyBjYXJlZnVsIGNhbGxpbmcgcmVwbGFjZSBvbiBpdC5cbiAgICAgICAgdmFyIHJlcyA9IGlucCAmJiBwYXJzZUZsb2F0KGlucC5yZXBsYWNlKCcsJywgJy4nKSk7XG4gICAgICAgIC8vIGFwcGx5IHNpZ24gd2hpbGUgd2UncmUgYXQgaXRcbiAgICAgICAgcmV0dXJuIChpc05hTihyZXMpID8gMCA6IHJlcykgKiBzaWduO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBvc2l0aXZlTW9tZW50c0RpZmZlcmVuY2UoYmFzZSwgb3RoZXIpIHtcbiAgICAgICAgdmFyIHJlcyA9IHt9O1xuXG4gICAgICAgIHJlcy5tb250aHMgPVxuICAgICAgICAgICAgb3RoZXIubW9udGgoKSAtIGJhc2UubW9udGgoKSArIChvdGhlci55ZWFyKCkgLSBiYXNlLnllYXIoKSkgKiAxMjtcbiAgICAgICAgaWYgKGJhc2UuY2xvbmUoKS5hZGQocmVzLm1vbnRocywgJ00nKS5pc0FmdGVyKG90aGVyKSkge1xuICAgICAgICAgICAgLS1yZXMubW9udGhzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzLm1pbGxpc2Vjb25kcyA9ICtvdGhlciAtICtiYXNlLmNsb25lKCkuYWRkKHJlcy5tb250aHMsICdNJyk7XG5cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtb21lbnRzRGlmZmVyZW5jZShiYXNlLCBvdGhlcikge1xuICAgICAgICB2YXIgcmVzO1xuICAgICAgICBpZiAoIShiYXNlLmlzVmFsaWQoKSAmJiBvdGhlci5pc1ZhbGlkKCkpKSB7XG4gICAgICAgICAgICByZXR1cm4geyBtaWxsaXNlY29uZHM6IDAsIG1vbnRoczogMCB9O1xuICAgICAgICB9XG5cbiAgICAgICAgb3RoZXIgPSBjbG9uZVdpdGhPZmZzZXQob3RoZXIsIGJhc2UpO1xuICAgICAgICBpZiAoYmFzZS5pc0JlZm9yZShvdGhlcikpIHtcbiAgICAgICAgICAgIHJlcyA9IHBvc2l0aXZlTW9tZW50c0RpZmZlcmVuY2UoYmFzZSwgb3RoZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzID0gcG9zaXRpdmVNb21lbnRzRGlmZmVyZW5jZShvdGhlciwgYmFzZSk7XG4gICAgICAgICAgICByZXMubWlsbGlzZWNvbmRzID0gLXJlcy5taWxsaXNlY29uZHM7XG4gICAgICAgICAgICByZXMubW9udGhzID0gLXJlcy5tb250aHM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIC8vIFRPRE86IHJlbW92ZSAnbmFtZScgYXJnIGFmdGVyIGRlcHJlY2F0aW9uIGlzIHJlbW92ZWRcbiAgICBmdW5jdGlvbiBjcmVhdGVBZGRlcihkaXJlY3Rpb24sIG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh2YWwsIHBlcmlvZCkge1xuICAgICAgICAgICAgdmFyIGR1ciwgdG1wO1xuICAgICAgICAgICAgLy9pbnZlcnQgdGhlIGFyZ3VtZW50cywgYnV0IGNvbXBsYWluIGFib3V0IGl0XG4gICAgICAgICAgICBpZiAocGVyaW9kICE9PSBudWxsICYmICFpc05hTigrcGVyaW9kKSkge1xuICAgICAgICAgICAgICAgIGRlcHJlY2F0ZVNpbXBsZShcbiAgICAgICAgICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgJ21vbWVudCgpLicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSArXG4gICAgICAgICAgICAgICAgICAgICAgICAnKHBlcmlvZCwgbnVtYmVyKSBpcyBkZXByZWNhdGVkLiBQbGVhc2UgdXNlIG1vbWVudCgpLicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSArXG4gICAgICAgICAgICAgICAgICAgICAgICAnKG51bWJlciwgcGVyaW9kKS4gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnU2VlIGh0dHA6Ly9tb21lbnRqcy5jb20vZ3VpZGVzLyMvd2FybmluZ3MvYWRkLWludmVydGVkLXBhcmFtLyBmb3IgbW9yZSBpbmZvLidcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHRtcCA9IHZhbDtcbiAgICAgICAgICAgICAgICB2YWwgPSBwZXJpb2Q7XG4gICAgICAgICAgICAgICAgcGVyaW9kID0gdG1wO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkdXIgPSBjcmVhdGVEdXJhdGlvbih2YWwsIHBlcmlvZCk7XG4gICAgICAgICAgICBhZGRTdWJ0cmFjdCh0aGlzLCBkdXIsIGRpcmVjdGlvbik7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRTdWJ0cmFjdChtb20sIGR1cmF0aW9uLCBpc0FkZGluZywgdXBkYXRlT2Zmc2V0KSB7XG4gICAgICAgIHZhciBtaWxsaXNlY29uZHMgPSBkdXJhdGlvbi5fbWlsbGlzZWNvbmRzLFxuICAgICAgICAgICAgZGF5cyA9IGFic1JvdW5kKGR1cmF0aW9uLl9kYXlzKSxcbiAgICAgICAgICAgIG1vbnRocyA9IGFic1JvdW5kKGR1cmF0aW9uLl9tb250aHMpO1xuXG4gICAgICAgIGlmICghbW9tLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgLy8gTm8gb3BcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZU9mZnNldCA9IHVwZGF0ZU9mZnNldCA9PSBudWxsID8gdHJ1ZSA6IHVwZGF0ZU9mZnNldDtcblxuICAgICAgICBpZiAobW9udGhzKSB7XG4gICAgICAgICAgICBzZXRNb250aChtb20sIGdldChtb20sICdNb250aCcpICsgbW9udGhzICogaXNBZGRpbmcpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXlzKSB7XG4gICAgICAgICAgICBzZXQkMShtb20sICdEYXRlJywgZ2V0KG1vbSwgJ0RhdGUnKSArIGRheXMgKiBpc0FkZGluZyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1pbGxpc2Vjb25kcykge1xuICAgICAgICAgICAgbW9tLl9kLnNldFRpbWUobW9tLl9kLnZhbHVlT2YoKSArIG1pbGxpc2Vjb25kcyAqIGlzQWRkaW5nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodXBkYXRlT2Zmc2V0KSB7XG4gICAgICAgICAgICBob29rcy51cGRhdGVPZmZzZXQobW9tLCBkYXlzIHx8IG1vbnRocyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgYWRkID0gY3JlYXRlQWRkZXIoMSwgJ2FkZCcpLFxuICAgICAgICBzdWJ0cmFjdCA9IGNyZWF0ZUFkZGVyKC0xLCAnc3VidHJhY3QnKTtcblxuICAgIGZ1bmN0aW9uIGlzU3RyaW5nKGlucHV0KSB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnIHx8IGlucHV0IGluc3RhbmNlb2YgU3RyaW5nO1xuICAgIH1cblxuICAgIC8vIHR5cGUgTW9tZW50SW5wdXQgPSBNb21lbnQgfCBEYXRlIHwgc3RyaW5nIHwgbnVtYmVyIHwgKG51bWJlciB8IHN0cmluZylbXSB8IE1vbWVudElucHV0T2JqZWN0IHwgdm9pZDsgLy8gbnVsbCB8IHVuZGVmaW5lZFxuICAgIGZ1bmN0aW9uIGlzTW9tZW50SW5wdXQoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIGlzTW9tZW50KGlucHV0KSB8fFxuICAgICAgICAgICAgaXNEYXRlKGlucHV0KSB8fFxuICAgICAgICAgICAgaXNTdHJpbmcoaW5wdXQpIHx8XG4gICAgICAgICAgICBpc051bWJlcihpbnB1dCkgfHxcbiAgICAgICAgICAgIGlzTnVtYmVyT3JTdHJpbmdBcnJheShpbnB1dCkgfHxcbiAgICAgICAgICAgIGlzTW9tZW50SW5wdXRPYmplY3QoaW5wdXQpIHx8XG4gICAgICAgICAgICBpbnB1dCA9PT0gbnVsbCB8fFxuICAgICAgICAgICAgaW5wdXQgPT09IHVuZGVmaW5lZFxuICAgICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzTW9tZW50SW5wdXRPYmplY3QoaW5wdXQpIHtcbiAgICAgICAgdmFyIG9iamVjdFRlc3QgPSBpc09iamVjdChpbnB1dCkgJiYgIWlzT2JqZWN0RW1wdHkoaW5wdXQpLFxuICAgICAgICAgICAgcHJvcGVydHlUZXN0ID0gZmFsc2UsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzID0gW1xuICAgICAgICAgICAgICAgICd5ZWFycycsXG4gICAgICAgICAgICAgICAgJ3llYXInLFxuICAgICAgICAgICAgICAgICd5JyxcbiAgICAgICAgICAgICAgICAnbW9udGhzJyxcbiAgICAgICAgICAgICAgICAnbW9udGgnLFxuICAgICAgICAgICAgICAgICdNJyxcbiAgICAgICAgICAgICAgICAnZGF5cycsXG4gICAgICAgICAgICAgICAgJ2RheScsXG4gICAgICAgICAgICAgICAgJ2QnLFxuICAgICAgICAgICAgICAgICdkYXRlcycsXG4gICAgICAgICAgICAgICAgJ2RhdGUnLFxuICAgICAgICAgICAgICAgICdEJyxcbiAgICAgICAgICAgICAgICAnaG91cnMnLFxuICAgICAgICAgICAgICAgICdob3VyJyxcbiAgICAgICAgICAgICAgICAnaCcsXG4gICAgICAgICAgICAgICAgJ21pbnV0ZXMnLFxuICAgICAgICAgICAgICAgICdtaW51dGUnLFxuICAgICAgICAgICAgICAgICdtJyxcbiAgICAgICAgICAgICAgICAnc2Vjb25kcycsXG4gICAgICAgICAgICAgICAgJ3NlY29uZCcsXG4gICAgICAgICAgICAgICAgJ3MnLFxuICAgICAgICAgICAgICAgICdtaWxsaXNlY29uZHMnLFxuICAgICAgICAgICAgICAgICdtaWxsaXNlY29uZCcsXG4gICAgICAgICAgICAgICAgJ21zJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBpLFxuICAgICAgICAgICAgcHJvcGVydHk7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHByb3BlcnRpZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIHByb3BlcnR5ID0gcHJvcGVydGllc1tpXTtcbiAgICAgICAgICAgIHByb3BlcnR5VGVzdCA9IHByb3BlcnR5VGVzdCB8fCBoYXNPd25Qcm9wKGlucHV0LCBwcm9wZXJ0eSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb2JqZWN0VGVzdCAmJiBwcm9wZXJ0eVRlc3Q7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNOdW1iZXJPclN0cmluZ0FycmF5KGlucHV0KSB7XG4gICAgICAgIHZhciBhcnJheVRlc3QgPSBpc0FycmF5KGlucHV0KSxcbiAgICAgICAgICAgIGRhdGFUeXBlVGVzdCA9IGZhbHNlO1xuICAgICAgICBpZiAoYXJyYXlUZXN0KSB7XG4gICAgICAgICAgICBkYXRhVHlwZVRlc3QgPVxuICAgICAgICAgICAgICAgIGlucHV0LmZpbHRlcihmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gIWlzTnVtYmVyKGl0ZW0pICYmIGlzU3RyaW5nKGlucHV0KTtcbiAgICAgICAgICAgICAgICB9KS5sZW5ndGggPT09IDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFycmF5VGVzdCAmJiBkYXRhVHlwZVRlc3Q7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNDYWxlbmRhclNwZWMoaW5wdXQpIHtcbiAgICAgICAgdmFyIG9iamVjdFRlc3QgPSBpc09iamVjdChpbnB1dCkgJiYgIWlzT2JqZWN0RW1wdHkoaW5wdXQpLFxuICAgICAgICAgICAgcHJvcGVydHlUZXN0ID0gZmFsc2UsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzID0gW1xuICAgICAgICAgICAgICAgICdzYW1lRGF5JyxcbiAgICAgICAgICAgICAgICAnbmV4dERheScsXG4gICAgICAgICAgICAgICAgJ2xhc3REYXknLFxuICAgICAgICAgICAgICAgICduZXh0V2VlaycsXG4gICAgICAgICAgICAgICAgJ2xhc3RXZWVrJyxcbiAgICAgICAgICAgICAgICAnc2FtZUVsc2UnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGksXG4gICAgICAgICAgICBwcm9wZXJ0eTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgcHJvcGVydGllcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgcHJvcGVydHkgPSBwcm9wZXJ0aWVzW2ldO1xuICAgICAgICAgICAgcHJvcGVydHlUZXN0ID0gcHJvcGVydHlUZXN0IHx8IGhhc093blByb3AoaW5wdXQsIHByb3BlcnR5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvYmplY3RUZXN0ICYmIHByb3BlcnR5VGVzdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRDYWxlbmRhckZvcm1hdChteU1vbWVudCwgbm93KSB7XG4gICAgICAgIHZhciBkaWZmID0gbXlNb21lbnQuZGlmZihub3csICdkYXlzJywgdHJ1ZSk7XG4gICAgICAgIHJldHVybiBkaWZmIDwgLTZcbiAgICAgICAgICAgID8gJ3NhbWVFbHNlJ1xuICAgICAgICAgICAgOiBkaWZmIDwgLTFcbiAgICAgICAgICAgID8gJ2xhc3RXZWVrJ1xuICAgICAgICAgICAgOiBkaWZmIDwgMFxuICAgICAgICAgICAgPyAnbGFzdERheSdcbiAgICAgICAgICAgIDogZGlmZiA8IDFcbiAgICAgICAgICAgID8gJ3NhbWVEYXknXG4gICAgICAgICAgICA6IGRpZmYgPCAyXG4gICAgICAgICAgICA/ICduZXh0RGF5J1xuICAgICAgICAgICAgOiBkaWZmIDwgN1xuICAgICAgICAgICAgPyAnbmV4dFdlZWsnXG4gICAgICAgICAgICA6ICdzYW1lRWxzZSc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2FsZW5kYXIkMSh0aW1lLCBmb3JtYXRzKSB7XG4gICAgICAgIC8vIFN1cHBvcnQgZm9yIHNpbmdsZSBwYXJhbWV0ZXIsIGZvcm1hdHMgb25seSBvdmVybG9hZCB0byB0aGUgY2FsZW5kYXIgZnVuY3Rpb25cbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIGlmICghYXJndW1lbnRzWzBdKSB7XG4gICAgICAgICAgICAgICAgdGltZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICBmb3JtYXRzID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpc01vbWVudElucHV0KGFyZ3VtZW50c1swXSkpIHtcbiAgICAgICAgICAgICAgICB0aW1lID0gYXJndW1lbnRzWzBdO1xuICAgICAgICAgICAgICAgIGZvcm1hdHMgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlzQ2FsZW5kYXJTcGVjKGFyZ3VtZW50c1swXSkpIHtcbiAgICAgICAgICAgICAgICBmb3JtYXRzID0gYXJndW1lbnRzWzBdO1xuICAgICAgICAgICAgICAgIHRpbWUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gV2Ugd2FudCB0byBjb21wYXJlIHRoZSBzdGFydCBvZiB0b2RheSwgdnMgdGhpcy5cbiAgICAgICAgLy8gR2V0dGluZyBzdGFydC1vZi10b2RheSBkZXBlbmRzIG9uIHdoZXRoZXIgd2UncmUgbG9jYWwvdXRjL29mZnNldCBvciBub3QuXG4gICAgICAgIHZhciBub3cgPSB0aW1lIHx8IGNyZWF0ZUxvY2FsKCksXG4gICAgICAgICAgICBzb2QgPSBjbG9uZVdpdGhPZmZzZXQobm93LCB0aGlzKS5zdGFydE9mKCdkYXknKSxcbiAgICAgICAgICAgIGZvcm1hdCA9IGhvb2tzLmNhbGVuZGFyRm9ybWF0KHRoaXMsIHNvZCkgfHwgJ3NhbWVFbHNlJyxcbiAgICAgICAgICAgIG91dHB1dCA9XG4gICAgICAgICAgICAgICAgZm9ybWF0cyAmJlxuICAgICAgICAgICAgICAgIChpc0Z1bmN0aW9uKGZvcm1hdHNbZm9ybWF0XSlcbiAgICAgICAgICAgICAgICAgICAgPyBmb3JtYXRzW2Zvcm1hdF0uY2FsbCh0aGlzLCBub3cpXG4gICAgICAgICAgICAgICAgICAgIDogZm9ybWF0c1tmb3JtYXRdKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5mb3JtYXQoXG4gICAgICAgICAgICBvdXRwdXQgfHwgdGhpcy5sb2NhbGVEYXRhKCkuY2FsZW5kYXIoZm9ybWF0LCB0aGlzLCBjcmVhdGVMb2NhbChub3cpKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsb25lKCkge1xuICAgICAgICByZXR1cm4gbmV3IE1vbWVudCh0aGlzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0FmdGVyKGlucHV0LCB1bml0cykge1xuICAgICAgICB2YXIgbG9jYWxJbnB1dCA9IGlzTW9tZW50KGlucHV0KSA/IGlucHV0IDogY3JlYXRlTG9jYWwoaW5wdXQpO1xuICAgICAgICBpZiAoISh0aGlzLmlzVmFsaWQoKSAmJiBsb2NhbElucHV0LmlzVmFsaWQoKSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKSB8fCAnbWlsbGlzZWNvbmQnO1xuICAgICAgICBpZiAodW5pdHMgPT09ICdtaWxsaXNlY29uZCcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZhbHVlT2YoKSA+IGxvY2FsSW5wdXQudmFsdWVPZigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGxvY2FsSW5wdXQudmFsdWVPZigpIDwgdGhpcy5jbG9uZSgpLnN0YXJ0T2YodW5pdHMpLnZhbHVlT2YoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzQmVmb3JlKGlucHV0LCB1bml0cykge1xuICAgICAgICB2YXIgbG9jYWxJbnB1dCA9IGlzTW9tZW50KGlucHV0KSA/IGlucHV0IDogY3JlYXRlTG9jYWwoaW5wdXQpO1xuICAgICAgICBpZiAoISh0aGlzLmlzVmFsaWQoKSAmJiBsb2NhbElucHV0LmlzVmFsaWQoKSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKSB8fCAnbWlsbGlzZWNvbmQnO1xuICAgICAgICBpZiAodW5pdHMgPT09ICdtaWxsaXNlY29uZCcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZhbHVlT2YoKSA8IGxvY2FsSW5wdXQudmFsdWVPZigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5lbmRPZih1bml0cykudmFsdWVPZigpIDwgbG9jYWxJbnB1dC52YWx1ZU9mKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0JldHdlZW4oZnJvbSwgdG8sIHVuaXRzLCBpbmNsdXNpdml0eSkge1xuICAgICAgICB2YXIgbG9jYWxGcm9tID0gaXNNb21lbnQoZnJvbSkgPyBmcm9tIDogY3JlYXRlTG9jYWwoZnJvbSksXG4gICAgICAgICAgICBsb2NhbFRvID0gaXNNb21lbnQodG8pID8gdG8gOiBjcmVhdGVMb2NhbCh0byk7XG4gICAgICAgIGlmICghKHRoaXMuaXNWYWxpZCgpICYmIGxvY2FsRnJvbS5pc1ZhbGlkKCkgJiYgbG9jYWxUby5pc1ZhbGlkKCkpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaW5jbHVzaXZpdHkgPSBpbmNsdXNpdml0eSB8fCAnKCknO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgKGluY2x1c2l2aXR5WzBdID09PSAnKCdcbiAgICAgICAgICAgICAgICA/IHRoaXMuaXNBZnRlcihsb2NhbEZyb20sIHVuaXRzKVxuICAgICAgICAgICAgICAgIDogIXRoaXMuaXNCZWZvcmUobG9jYWxGcm9tLCB1bml0cykpICYmXG4gICAgICAgICAgICAoaW5jbHVzaXZpdHlbMV0gPT09ICcpJ1xuICAgICAgICAgICAgICAgID8gdGhpcy5pc0JlZm9yZShsb2NhbFRvLCB1bml0cylcbiAgICAgICAgICAgICAgICA6ICF0aGlzLmlzQWZ0ZXIobG9jYWxUbywgdW5pdHMpKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzU2FtZShpbnB1dCwgdW5pdHMpIHtcbiAgICAgICAgdmFyIGxvY2FsSW5wdXQgPSBpc01vbWVudChpbnB1dCkgPyBpbnB1dCA6IGNyZWF0ZUxvY2FsKGlucHV0KSxcbiAgICAgICAgICAgIGlucHV0TXM7XG4gICAgICAgIGlmICghKHRoaXMuaXNWYWxpZCgpICYmIGxvY2FsSW5wdXQuaXNWYWxpZCgpKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpIHx8ICdtaWxsaXNlY29uZCc7XG4gICAgICAgIGlmICh1bml0cyA9PT0gJ21pbGxpc2Vjb25kJykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVPZigpID09PSBsb2NhbElucHV0LnZhbHVlT2YoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlucHV0TXMgPSBsb2NhbElucHV0LnZhbHVlT2YoKTtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgdGhpcy5jbG9uZSgpLnN0YXJ0T2YodW5pdHMpLnZhbHVlT2YoKSA8PSBpbnB1dE1zICYmXG4gICAgICAgICAgICAgICAgaW5wdXRNcyA8PSB0aGlzLmNsb25lKCkuZW5kT2YodW5pdHMpLnZhbHVlT2YoKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzU2FtZU9yQWZ0ZXIoaW5wdXQsIHVuaXRzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzU2FtZShpbnB1dCwgdW5pdHMpIHx8IHRoaXMuaXNBZnRlcihpbnB1dCwgdW5pdHMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzU2FtZU9yQmVmb3JlKGlucHV0LCB1bml0cykge1xuICAgICAgICByZXR1cm4gdGhpcy5pc1NhbWUoaW5wdXQsIHVuaXRzKSB8fCB0aGlzLmlzQmVmb3JlKGlucHV0LCB1bml0cyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGlmZihpbnB1dCwgdW5pdHMsIGFzRmxvYXQpIHtcbiAgICAgICAgdmFyIHRoYXQsIHpvbmVEZWx0YSwgb3V0cHV0O1xuXG4gICAgICAgIGlmICghdGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBOYU47XG4gICAgICAgIH1cblxuICAgICAgICB0aGF0ID0gY2xvbmVXaXRoT2Zmc2V0KGlucHV0LCB0aGlzKTtcblxuICAgICAgICBpZiAoIXRoYXQuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gTmFOO1xuICAgICAgICB9XG5cbiAgICAgICAgem9uZURlbHRhID0gKHRoYXQudXRjT2Zmc2V0KCkgLSB0aGlzLnV0Y09mZnNldCgpKSAqIDZlNDtcblxuICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcblxuICAgICAgICBzd2l0Y2ggKHVuaXRzKSB7XG4gICAgICAgICAgICBjYXNlICd5ZWFyJzpcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSBtb250aERpZmYodGhpcywgdGhhdCkgLyAxMjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ21vbnRoJzpcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSBtb250aERpZmYodGhpcywgdGhhdCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdxdWFydGVyJzpcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSBtb250aERpZmYodGhpcywgdGhhdCkgLyAzO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnc2Vjb25kJzpcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSAodGhpcyAtIHRoYXQpIC8gMWUzO1xuICAgICAgICAgICAgICAgIGJyZWFrOyAvLyAxMDAwXG4gICAgICAgICAgICBjYXNlICdtaW51dGUnOlxuICAgICAgICAgICAgICAgIG91dHB1dCA9ICh0aGlzIC0gdGhhdCkgLyA2ZTQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7IC8vIDEwMDAgKiA2MFxuICAgICAgICAgICAgY2FzZSAnaG91cic6XG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gKHRoaXMgLSB0aGF0KSAvIDM2ZTU7XG4gICAgICAgICAgICAgICAgYnJlYWs7IC8vIDEwMDAgKiA2MCAqIDYwXG4gICAgICAgICAgICBjYXNlICdkYXknOlxuICAgICAgICAgICAgICAgIG91dHB1dCA9ICh0aGlzIC0gdGhhdCAtIHpvbmVEZWx0YSkgLyA4NjRlNTtcbiAgICAgICAgICAgICAgICBicmVhazsgLy8gMTAwMCAqIDYwICogNjAgKiAyNCwgbmVnYXRlIGRzdFxuICAgICAgICAgICAgY2FzZSAnd2Vlayc6XG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gKHRoaXMgLSB0aGF0IC0gem9uZURlbHRhKSAvIDYwNDhlNTtcbiAgICAgICAgICAgICAgICBicmVhazsgLy8gMTAwMCAqIDYwICogNjAgKiAyNCAqIDcsIG5lZ2F0ZSBkc3RcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gdGhpcyAtIHRoYXQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYXNGbG9hdCA/IG91dHB1dCA6IGFic0Zsb29yKG91dHB1dCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW9udGhEaWZmKGEsIGIpIHtcbiAgICAgICAgaWYgKGEuZGF0ZSgpIDwgYi5kYXRlKCkpIHtcbiAgICAgICAgICAgIC8vIGVuZC1vZi1tb250aCBjYWxjdWxhdGlvbnMgd29yayBjb3JyZWN0IHdoZW4gdGhlIHN0YXJ0IG1vbnRoIGhhcyBtb3JlXG4gICAgICAgICAgICAvLyBkYXlzIHRoYW4gdGhlIGVuZCBtb250aC5cbiAgICAgICAgICAgIHJldHVybiAtbW9udGhEaWZmKGIsIGEpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGRpZmZlcmVuY2UgaW4gbW9udGhzXG4gICAgICAgIHZhciB3aG9sZU1vbnRoRGlmZiA9IChiLnllYXIoKSAtIGEueWVhcigpKSAqIDEyICsgKGIubW9udGgoKSAtIGEubW9udGgoKSksXG4gICAgICAgICAgICAvLyBiIGlzIGluIChhbmNob3IgLSAxIG1vbnRoLCBhbmNob3IgKyAxIG1vbnRoKVxuICAgICAgICAgICAgYW5jaG9yID0gYS5jbG9uZSgpLmFkZCh3aG9sZU1vbnRoRGlmZiwgJ21vbnRocycpLFxuICAgICAgICAgICAgYW5jaG9yMixcbiAgICAgICAgICAgIGFkanVzdDtcblxuICAgICAgICBpZiAoYiAtIGFuY2hvciA8IDApIHtcbiAgICAgICAgICAgIGFuY2hvcjIgPSBhLmNsb25lKCkuYWRkKHdob2xlTW9udGhEaWZmIC0gMSwgJ21vbnRocycpO1xuICAgICAgICAgICAgLy8gbGluZWFyIGFjcm9zcyB0aGUgbW9udGhcbiAgICAgICAgICAgIGFkanVzdCA9IChiIC0gYW5jaG9yKSAvIChhbmNob3IgLSBhbmNob3IyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFuY2hvcjIgPSBhLmNsb25lKCkuYWRkKHdob2xlTW9udGhEaWZmICsgMSwgJ21vbnRocycpO1xuICAgICAgICAgICAgLy8gbGluZWFyIGFjcm9zcyB0aGUgbW9udGhcbiAgICAgICAgICAgIGFkanVzdCA9IChiIC0gYW5jaG9yKSAvIChhbmNob3IyIC0gYW5jaG9yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vY2hlY2sgZm9yIG5lZ2F0aXZlIHplcm8sIHJldHVybiB6ZXJvIGlmIG5lZ2F0aXZlIHplcm9cbiAgICAgICAgcmV0dXJuIC0od2hvbGVNb250aERpZmYgKyBhZGp1c3QpIHx8IDA7XG4gICAgfVxuXG4gICAgaG9va3MuZGVmYXVsdEZvcm1hdCA9ICdZWVlZLU1NLUREVEhIOm1tOnNzWic7XG4gICAgaG9va3MuZGVmYXVsdEZvcm1hdFV0YyA9ICdZWVlZLU1NLUREVEhIOm1tOnNzW1pdJztcblxuICAgIGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmxvY2FsZSgnZW4nKS5mb3JtYXQoJ2RkZCBNTU0gREQgWVlZWSBISDptbTpzcyBbR01UXVpaJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9JU09TdHJpbmcoa2VlcE9mZnNldCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdXRjID0ga2VlcE9mZnNldCAhPT0gdHJ1ZSxcbiAgICAgICAgICAgIG0gPSB1dGMgPyB0aGlzLmNsb25lKCkudXRjKCkgOiB0aGlzO1xuICAgICAgICBpZiAobS55ZWFyKCkgPCAwIHx8IG0ueWVhcigpID4gOTk5OSkge1xuICAgICAgICAgICAgcmV0dXJuIGZvcm1hdE1vbWVudChcbiAgICAgICAgICAgICAgICBtLFxuICAgICAgICAgICAgICAgIHV0Y1xuICAgICAgICAgICAgICAgICAgICA/ICdZWVlZWVktTU0tRERbVF1ISDptbTpzcy5TU1NbWl0nXG4gICAgICAgICAgICAgICAgICAgIDogJ1lZWVlZWS1NTS1ERFtUXUhIOm1tOnNzLlNTU1onXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc0Z1bmN0aW9uKERhdGUucHJvdG90eXBlLnRvSVNPU3RyaW5nKSkge1xuICAgICAgICAgICAgLy8gbmF0aXZlIGltcGxlbWVudGF0aW9uIGlzIH41MHggZmFzdGVyLCB1c2UgaXQgd2hlbiB3ZSBjYW5cbiAgICAgICAgICAgIGlmICh1dGMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50b0RhdGUoKS50b0lTT1N0cmluZygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IERhdGUodGhpcy52YWx1ZU9mKCkgKyB0aGlzLnV0Y09mZnNldCgpICogNjAgKiAxMDAwKVxuICAgICAgICAgICAgICAgICAgICAudG9JU09TdHJpbmcoKVxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgnWicsIGZvcm1hdE1vbWVudChtLCAnWicpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZm9ybWF0TW9tZW50KFxuICAgICAgICAgICAgbSxcbiAgICAgICAgICAgIHV0YyA/ICdZWVlZLU1NLUREW1RdSEg6bW06c3MuU1NTW1pdJyA6ICdZWVlZLU1NLUREW1RdSEg6bW06c3MuU1NTWidcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gYSBodW1hbiByZWFkYWJsZSByZXByZXNlbnRhdGlvbiBvZiBhIG1vbWVudCB0aGF0IGNhblxuICAgICAqIGFsc28gYmUgZXZhbHVhdGVkIHRvIGdldCBhIG5ldyBtb21lbnQgd2hpY2ggaXMgdGhlIHNhbWVcbiAgICAgKlxuICAgICAqIEBsaW5rIGh0dHBzOi8vbm9kZWpzLm9yZy9kaXN0L2xhdGVzdC9kb2NzL2FwaS91dGlsLmh0bWwjdXRpbF9jdXN0b21faW5zcGVjdF9mdW5jdGlvbl9vbl9vYmplY3RzXG4gICAgICovXG4gICAgZnVuY3Rpb24gaW5zcGVjdCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuICdtb21lbnQuaW52YWxpZCgvKiAnICsgdGhpcy5faSArICcgKi8pJztcbiAgICAgICAgfVxuICAgICAgICB2YXIgZnVuYyA9ICdtb21lbnQnLFxuICAgICAgICAgICAgem9uZSA9ICcnLFxuICAgICAgICAgICAgcHJlZml4LFxuICAgICAgICAgICAgeWVhcixcbiAgICAgICAgICAgIGRhdGV0aW1lLFxuICAgICAgICAgICAgc3VmZml4O1xuICAgICAgICBpZiAoIXRoaXMuaXNMb2NhbCgpKSB7XG4gICAgICAgICAgICBmdW5jID0gdGhpcy51dGNPZmZzZXQoKSA9PT0gMCA/ICdtb21lbnQudXRjJyA6ICdtb21lbnQucGFyc2Vab25lJztcbiAgICAgICAgICAgIHpvbmUgPSAnWic7XG4gICAgICAgIH1cbiAgICAgICAgcHJlZml4ID0gJ1snICsgZnVuYyArICcoXCJdJztcbiAgICAgICAgeWVhciA9IDAgPD0gdGhpcy55ZWFyKCkgJiYgdGhpcy55ZWFyKCkgPD0gOTk5OSA/ICdZWVlZJyA6ICdZWVlZWVknO1xuICAgICAgICBkYXRldGltZSA9ICctTU0tRERbVF1ISDptbTpzcy5TU1MnO1xuICAgICAgICBzdWZmaXggPSB6b25lICsgJ1tcIildJztcblxuICAgICAgICByZXR1cm4gdGhpcy5mb3JtYXQocHJlZml4ICsgeWVhciArIGRhdGV0aW1lICsgc3VmZml4KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmb3JtYXQoaW5wdXRTdHJpbmcpIHtcbiAgICAgICAgaWYgKCFpbnB1dFN0cmluZykge1xuICAgICAgICAgICAgaW5wdXRTdHJpbmcgPSB0aGlzLmlzVXRjKClcbiAgICAgICAgICAgICAgICA/IGhvb2tzLmRlZmF1bHRGb3JtYXRVdGNcbiAgICAgICAgICAgICAgICA6IGhvb2tzLmRlZmF1bHRGb3JtYXQ7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG91dHB1dCA9IGZvcm1hdE1vbWVudCh0aGlzLCBpbnB1dFN0cmluZyk7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5wb3N0Zm9ybWF0KG91dHB1dCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZnJvbSh0aW1lLCB3aXRob3V0U3VmZml4KSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMuaXNWYWxpZCgpICYmXG4gICAgICAgICAgICAoKGlzTW9tZW50KHRpbWUpICYmIHRpbWUuaXNWYWxpZCgpKSB8fCBjcmVhdGVMb2NhbCh0aW1lKS5pc1ZhbGlkKCkpXG4gICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZUR1cmF0aW9uKHsgdG86IHRoaXMsIGZyb206IHRpbWUgfSlcbiAgICAgICAgICAgICAgICAubG9jYWxlKHRoaXMubG9jYWxlKCkpXG4gICAgICAgICAgICAgICAgLmh1bWFuaXplKCF3aXRob3V0U3VmZml4KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5pbnZhbGlkRGF0ZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZnJvbU5vdyh3aXRob3V0U3VmZml4KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZyb20oY3JlYXRlTG9jYWwoKSwgd2l0aG91dFN1ZmZpeCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG8odGltZSwgd2l0aG91dFN1ZmZpeCkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLmlzVmFsaWQoKSAmJlxuICAgICAgICAgICAgKChpc01vbWVudCh0aW1lKSAmJiB0aW1lLmlzVmFsaWQoKSkgfHwgY3JlYXRlTG9jYWwodGltZSkuaXNWYWxpZCgpKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVEdXJhdGlvbih7IGZyb206IHRoaXMsIHRvOiB0aW1lIH0pXG4gICAgICAgICAgICAgICAgLmxvY2FsZSh0aGlzLmxvY2FsZSgpKVxuICAgICAgICAgICAgICAgIC5odW1hbml6ZSghd2l0aG91dFN1ZmZpeCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkuaW52YWxpZERhdGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvTm93KHdpdGhvdXRTdWZmaXgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG8oY3JlYXRlTG9jYWwoKSwgd2l0aG91dFN1ZmZpeCk7XG4gICAgfVxuXG4gICAgLy8gSWYgcGFzc2VkIGEgbG9jYWxlIGtleSwgaXQgd2lsbCBzZXQgdGhlIGxvY2FsZSBmb3IgdGhpc1xuICAgIC8vIGluc3RhbmNlLiAgT3RoZXJ3aXNlLCBpdCB3aWxsIHJldHVybiB0aGUgbG9jYWxlIGNvbmZpZ3VyYXRpb25cbiAgICAvLyB2YXJpYWJsZXMgZm9yIHRoaXMgaW5zdGFuY2UuXG4gICAgZnVuY3Rpb24gbG9jYWxlKGtleSkge1xuICAgICAgICB2YXIgbmV3TG9jYWxlRGF0YTtcblxuICAgICAgICBpZiAoa2V5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9sb2NhbGUuX2FiYnI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdMb2NhbGVEYXRhID0gZ2V0TG9jYWxlKGtleSk7XG4gICAgICAgICAgICBpZiAobmV3TG9jYWxlRGF0YSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9jYWxlID0gbmV3TG9jYWxlRGF0YTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGxhbmcgPSBkZXByZWNhdGUoXG4gICAgICAgICdtb21lbnQoKS5sYW5nKCkgaXMgZGVwcmVjYXRlZC4gSW5zdGVhZCwgdXNlIG1vbWVudCgpLmxvY2FsZURhdGEoKSB0byBnZXQgdGhlIGxhbmd1YWdlIGNvbmZpZ3VyYXRpb24uIFVzZSBtb21lbnQoKS5sb2NhbGUoKSB0byBjaGFuZ2UgbGFuZ3VhZ2VzLicsXG4gICAgICAgIGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlKGtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICApO1xuXG4gICAgZnVuY3Rpb24gbG9jYWxlRGF0YSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvY2FsZTtcbiAgICB9XG5cbiAgICB2YXIgTVNfUEVSX1NFQ09ORCA9IDEwMDAsXG4gICAgICAgIE1TX1BFUl9NSU5VVEUgPSA2MCAqIE1TX1BFUl9TRUNPTkQsXG4gICAgICAgIE1TX1BFUl9IT1VSID0gNjAgKiBNU19QRVJfTUlOVVRFLFxuICAgICAgICBNU19QRVJfNDAwX1lFQVJTID0gKDM2NSAqIDQwMCArIDk3KSAqIDI0ICogTVNfUEVSX0hPVVI7XG5cbiAgICAvLyBhY3R1YWwgbW9kdWxvIC0gaGFuZGxlcyBuZWdhdGl2ZSBudW1iZXJzIChmb3IgZGF0ZXMgYmVmb3JlIDE5NzApOlxuICAgIGZ1bmN0aW9uIG1vZCQxKGRpdmlkZW5kLCBkaXZpc29yKSB7XG4gICAgICAgIHJldHVybiAoKGRpdmlkZW5kICUgZGl2aXNvcikgKyBkaXZpc29yKSAlIGRpdmlzb3I7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9jYWxTdGFydE9mRGF0ZSh5LCBtLCBkKSB7XG4gICAgICAgIC8vIHRoZSBkYXRlIGNvbnN0cnVjdG9yIHJlbWFwcyB5ZWFycyAwLTk5IHRvIDE5MDAtMTk5OVxuICAgICAgICBpZiAoeSA8IDEwMCAmJiB5ID49IDApIHtcbiAgICAgICAgICAgIC8vIHByZXNlcnZlIGxlYXAgeWVhcnMgdXNpbmcgYSBmdWxsIDQwMCB5ZWFyIGN5Y2xlLCB0aGVuIHJlc2V0XG4gICAgICAgICAgICByZXR1cm4gbmV3IERhdGUoeSArIDQwMCwgbSwgZCkgLSBNU19QRVJfNDAwX1lFQVJTO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKHksIG0sIGQpLnZhbHVlT2YoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHV0Y1N0YXJ0T2ZEYXRlKHksIG0sIGQpIHtcbiAgICAgICAgLy8gRGF0ZS5VVEMgcmVtYXBzIHllYXJzIDAtOTkgdG8gMTkwMC0xOTk5XG4gICAgICAgIGlmICh5IDwgMTAwICYmIHkgPj0gMCkge1xuICAgICAgICAgICAgLy8gcHJlc2VydmUgbGVhcCB5ZWFycyB1c2luZyBhIGZ1bGwgNDAwIHllYXIgY3ljbGUsIHRoZW4gcmVzZXRcbiAgICAgICAgICAgIHJldHVybiBEYXRlLlVUQyh5ICsgNDAwLCBtLCBkKSAtIE1TX1BFUl80MDBfWUVBUlM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gRGF0ZS5VVEMoeSwgbSwgZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdGFydE9mKHVuaXRzKSB7XG4gICAgICAgIHZhciB0aW1lLCBzdGFydE9mRGF0ZTtcbiAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG4gICAgICAgIGlmICh1bml0cyA9PT0gdW5kZWZpbmVkIHx8IHVuaXRzID09PSAnbWlsbGlzZWNvbmQnIHx8ICF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBzdGFydE9mRGF0ZSA9IHRoaXMuX2lzVVRDID8gdXRjU3RhcnRPZkRhdGUgOiBsb2NhbFN0YXJ0T2ZEYXRlO1xuXG4gICAgICAgIHN3aXRjaCAodW5pdHMpIHtcbiAgICAgICAgICAgIGNhc2UgJ3llYXInOlxuICAgICAgICAgICAgICAgIHRpbWUgPSBzdGFydE9mRGF0ZSh0aGlzLnllYXIoKSwgMCwgMSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdxdWFydGVyJzpcbiAgICAgICAgICAgICAgICB0aW1lID0gc3RhcnRPZkRhdGUoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMueWVhcigpLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vbnRoKCkgLSAodGhpcy5tb250aCgpICUgMyksXG4gICAgICAgICAgICAgICAgICAgIDFcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnbW9udGgnOlxuICAgICAgICAgICAgICAgIHRpbWUgPSBzdGFydE9mRGF0ZSh0aGlzLnllYXIoKSwgdGhpcy5tb250aCgpLCAxKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3dlZWsnOlxuICAgICAgICAgICAgICAgIHRpbWUgPSBzdGFydE9mRGF0ZShcbiAgICAgICAgICAgICAgICAgICAgdGhpcy55ZWFyKCksXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW9udGgoKSxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRlKCkgLSB0aGlzLndlZWtkYXkoKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdpc29XZWVrJzpcbiAgICAgICAgICAgICAgICB0aW1lID0gc3RhcnRPZkRhdGUoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMueWVhcigpLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vbnRoKCksXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0ZSgpIC0gKHRoaXMuaXNvV2Vla2RheSgpIC0gMSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZGF5JzpcbiAgICAgICAgICAgIGNhc2UgJ2RhdGUnOlxuICAgICAgICAgICAgICAgIHRpbWUgPSBzdGFydE9mRGF0ZSh0aGlzLnllYXIoKSwgdGhpcy5tb250aCgpLCB0aGlzLmRhdGUoKSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdob3VyJzpcbiAgICAgICAgICAgICAgICB0aW1lID0gdGhpcy5fZC52YWx1ZU9mKCk7XG4gICAgICAgICAgICAgICAgdGltZSAtPSBtb2QkMShcbiAgICAgICAgICAgICAgICAgICAgdGltZSArICh0aGlzLl9pc1VUQyA/IDAgOiB0aGlzLnV0Y09mZnNldCgpICogTVNfUEVSX01JTlVURSksXG4gICAgICAgICAgICAgICAgICAgIE1TX1BFUl9IT1VSXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ21pbnV0ZSc6XG4gICAgICAgICAgICAgICAgdGltZSA9IHRoaXMuX2QudmFsdWVPZigpO1xuICAgICAgICAgICAgICAgIHRpbWUgLT0gbW9kJDEodGltZSwgTVNfUEVSX01JTlVURSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdzZWNvbmQnOlxuICAgICAgICAgICAgICAgIHRpbWUgPSB0aGlzLl9kLnZhbHVlT2YoKTtcbiAgICAgICAgICAgICAgICB0aW1lIC09IG1vZCQxKHRpbWUsIE1TX1BFUl9TRUNPTkQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fZC5zZXRUaW1lKHRpbWUpO1xuICAgICAgICBob29rcy51cGRhdGVPZmZzZXQodGhpcywgdHJ1ZSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVuZE9mKHVuaXRzKSB7XG4gICAgICAgIHZhciB0aW1lLCBzdGFydE9mRGF0ZTtcbiAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG4gICAgICAgIGlmICh1bml0cyA9PT0gdW5kZWZpbmVkIHx8IHVuaXRzID09PSAnbWlsbGlzZWNvbmQnIHx8ICF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBzdGFydE9mRGF0ZSA9IHRoaXMuX2lzVVRDID8gdXRjU3RhcnRPZkRhdGUgOiBsb2NhbFN0YXJ0T2ZEYXRlO1xuXG4gICAgICAgIHN3aXRjaCAodW5pdHMpIHtcbiAgICAgICAgICAgIGNhc2UgJ3llYXInOlxuICAgICAgICAgICAgICAgIHRpbWUgPSBzdGFydE9mRGF0ZSh0aGlzLnllYXIoKSArIDEsIDAsIDEpIC0gMTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3F1YXJ0ZXInOlxuICAgICAgICAgICAgICAgIHRpbWUgPVxuICAgICAgICAgICAgICAgICAgICBzdGFydE9mRGF0ZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMueWVhcigpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb250aCgpIC0gKHRoaXMubW9udGgoKSAlIDMpICsgMyxcbiAgICAgICAgICAgICAgICAgICAgICAgIDFcbiAgICAgICAgICAgICAgICAgICAgKSAtIDE7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdtb250aCc6XG4gICAgICAgICAgICAgICAgdGltZSA9IHN0YXJ0T2ZEYXRlKHRoaXMueWVhcigpLCB0aGlzLm1vbnRoKCkgKyAxLCAxKSAtIDE7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICd3ZWVrJzpcbiAgICAgICAgICAgICAgICB0aW1lID1cbiAgICAgICAgICAgICAgICAgICAgc3RhcnRPZkRhdGUoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnllYXIoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubW9udGgoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0ZSgpIC0gdGhpcy53ZWVrZGF5KCkgKyA3XG4gICAgICAgICAgICAgICAgICAgICkgLSAxO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnaXNvV2Vlayc6XG4gICAgICAgICAgICAgICAgdGltZSA9XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0T2ZEYXRlKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy55ZWFyKCksXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vbnRoKCksXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGUoKSAtICh0aGlzLmlzb1dlZWtkYXkoKSAtIDEpICsgN1xuICAgICAgICAgICAgICAgICAgICApIC0gMTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2RheSc6XG4gICAgICAgICAgICBjYXNlICdkYXRlJzpcbiAgICAgICAgICAgICAgICB0aW1lID0gc3RhcnRPZkRhdGUodGhpcy55ZWFyKCksIHRoaXMubW9udGgoKSwgdGhpcy5kYXRlKCkgKyAxKSAtIDE7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdob3VyJzpcbiAgICAgICAgICAgICAgICB0aW1lID0gdGhpcy5fZC52YWx1ZU9mKCk7XG4gICAgICAgICAgICAgICAgdGltZSArPVxuICAgICAgICAgICAgICAgICAgICBNU19QRVJfSE9VUiAtXG4gICAgICAgICAgICAgICAgICAgIG1vZCQxKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZSArICh0aGlzLl9pc1VUQyA/IDAgOiB0aGlzLnV0Y09mZnNldCgpICogTVNfUEVSX01JTlVURSksXG4gICAgICAgICAgICAgICAgICAgICAgICBNU19QRVJfSE9VUlxuICAgICAgICAgICAgICAgICAgICApIC1cbiAgICAgICAgICAgICAgICAgICAgMTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ21pbnV0ZSc6XG4gICAgICAgICAgICAgICAgdGltZSA9IHRoaXMuX2QudmFsdWVPZigpO1xuICAgICAgICAgICAgICAgIHRpbWUgKz0gTVNfUEVSX01JTlVURSAtIG1vZCQxKHRpbWUsIE1TX1BFUl9NSU5VVEUpIC0gMTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3NlY29uZCc6XG4gICAgICAgICAgICAgICAgdGltZSA9IHRoaXMuX2QudmFsdWVPZigpO1xuICAgICAgICAgICAgICAgIHRpbWUgKz0gTVNfUEVSX1NFQ09ORCAtIG1vZCQxKHRpbWUsIE1TX1BFUl9TRUNPTkQpIC0gMTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2Quc2V0VGltZSh0aW1lKTtcbiAgICAgICAgaG9va3MudXBkYXRlT2Zmc2V0KHRoaXMsIHRydWUpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB2YWx1ZU9mKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZC52YWx1ZU9mKCkgLSAodGhpcy5fb2Zmc2V0IHx8IDApICogNjAwMDA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdW5peCgpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IodGhpcy52YWx1ZU9mKCkgLyAxMDAwKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b0RhdGUoKSB7XG4gICAgICAgIHJldHVybiBuZXcgRGF0ZSh0aGlzLnZhbHVlT2YoKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9BcnJheSgpIHtcbiAgICAgICAgdmFyIG0gPSB0aGlzO1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgbS55ZWFyKCksXG4gICAgICAgICAgICBtLm1vbnRoKCksXG4gICAgICAgICAgICBtLmRhdGUoKSxcbiAgICAgICAgICAgIG0uaG91cigpLFxuICAgICAgICAgICAgbS5taW51dGUoKSxcbiAgICAgICAgICAgIG0uc2Vjb25kKCksXG4gICAgICAgICAgICBtLm1pbGxpc2Vjb25kKCksXG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9PYmplY3QoKSB7XG4gICAgICAgIHZhciBtID0gdGhpcztcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHllYXJzOiBtLnllYXIoKSxcbiAgICAgICAgICAgIG1vbnRoczogbS5tb250aCgpLFxuICAgICAgICAgICAgZGF0ZTogbS5kYXRlKCksXG4gICAgICAgICAgICBob3VyczogbS5ob3VycygpLFxuICAgICAgICAgICAgbWludXRlczogbS5taW51dGVzKCksXG4gICAgICAgICAgICBzZWNvbmRzOiBtLnNlY29uZHMoKSxcbiAgICAgICAgICAgIG1pbGxpc2Vjb25kczogbS5taWxsaXNlY29uZHMoKSxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b0pTT04oKSB7XG4gICAgICAgIC8vIG5ldyBEYXRlKE5hTikudG9KU09OKCkgPT09IG51bGxcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNWYWxpZCgpID8gdGhpcy50b0lTT1N0cmluZygpIDogbnVsbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc1ZhbGlkJDIoKSB7XG4gICAgICAgIHJldHVybiBpc1ZhbGlkKHRoaXMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNpbmdGbGFncygpIHtcbiAgICAgICAgcmV0dXJuIGV4dGVuZCh7fSwgZ2V0UGFyc2luZ0ZsYWdzKHRoaXMpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnZhbGlkQXQoKSB7XG4gICAgICAgIHJldHVybiBnZXRQYXJzaW5nRmxhZ3ModGhpcykub3ZlcmZsb3c7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRpb25EYXRhKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaW5wdXQ6IHRoaXMuX2ksXG4gICAgICAgICAgICBmb3JtYXQ6IHRoaXMuX2YsXG4gICAgICAgICAgICBsb2NhbGU6IHRoaXMuX2xvY2FsZSxcbiAgICAgICAgICAgIGlzVVRDOiB0aGlzLl9pc1VUQyxcbiAgICAgICAgICAgIHN0cmljdDogdGhpcy5fc3RyaWN0LFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGFkZEZvcm1hdFRva2VuKCdOJywgMCwgMCwgJ2VyYUFiYnInKTtcbiAgICBhZGRGb3JtYXRUb2tlbignTk4nLCAwLCAwLCAnZXJhQWJicicpO1xuICAgIGFkZEZvcm1hdFRva2VuKCdOTk4nLCAwLCAwLCAnZXJhQWJicicpO1xuICAgIGFkZEZvcm1hdFRva2VuKCdOTk5OJywgMCwgMCwgJ2VyYU5hbWUnKTtcbiAgICBhZGRGb3JtYXRUb2tlbignTk5OTk4nLCAwLCAwLCAnZXJhTmFycm93Jyk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbigneScsIFsneScsIDFdLCAneW8nLCAnZXJhWWVhcicpO1xuICAgIGFkZEZvcm1hdFRva2VuKCd5JywgWyd5eScsIDJdLCAwLCAnZXJhWWVhcicpO1xuICAgIGFkZEZvcm1hdFRva2VuKCd5JywgWyd5eXknLCAzXSwgMCwgJ2VyYVllYXInKTtcbiAgICBhZGRGb3JtYXRUb2tlbigneScsIFsneXl5eScsIDRdLCAwLCAnZXJhWWVhcicpO1xuXG4gICAgYWRkUmVnZXhUb2tlbignTicsIG1hdGNoRXJhQWJicik7XG4gICAgYWRkUmVnZXhUb2tlbignTk4nLCBtYXRjaEVyYUFiYnIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ05OTicsIG1hdGNoRXJhQWJicik7XG4gICAgYWRkUmVnZXhUb2tlbignTk5OTicsIG1hdGNoRXJhTmFtZSk7XG4gICAgYWRkUmVnZXhUb2tlbignTk5OTk4nLCBtYXRjaEVyYU5hcnJvdyk7XG5cbiAgICBhZGRQYXJzZVRva2VuKFsnTicsICdOTicsICdOTk4nLCAnTk5OTicsICdOTk5OTiddLCBmdW5jdGlvbiAoXG4gICAgICAgIGlucHV0LFxuICAgICAgICBhcnJheSxcbiAgICAgICAgY29uZmlnLFxuICAgICAgICB0b2tlblxuICAgICkge1xuICAgICAgICB2YXIgZXJhID0gY29uZmlnLl9sb2NhbGUuZXJhc1BhcnNlKGlucHV0LCB0b2tlbiwgY29uZmlnLl9zdHJpY3QpO1xuICAgICAgICBpZiAoZXJhKSB7XG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5lcmEgPSBlcmE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5pbnZhbGlkRXJhID0gaW5wdXQ7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ3knLCBtYXRjaFVuc2lnbmVkKTtcbiAgICBhZGRSZWdleFRva2VuKCd5eScsIG1hdGNoVW5zaWduZWQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ3l5eScsIG1hdGNoVW5zaWduZWQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ3l5eXknLCBtYXRjaFVuc2lnbmVkKTtcbiAgICBhZGRSZWdleFRva2VuKCd5bycsIG1hdGNoRXJhWWVhck9yZGluYWwpO1xuXG4gICAgYWRkUGFyc2VUb2tlbihbJ3knLCAneXknLCAneXl5JywgJ3l5eXknXSwgWUVBUik7XG4gICAgYWRkUGFyc2VUb2tlbihbJ3lvJ10sIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZywgdG9rZW4pIHtcbiAgICAgICAgdmFyIG1hdGNoO1xuICAgICAgICBpZiAoY29uZmlnLl9sb2NhbGUuX2VyYVllYXJPcmRpbmFsUmVnZXgpIHtcbiAgICAgICAgICAgIG1hdGNoID0gaW5wdXQubWF0Y2goY29uZmlnLl9sb2NhbGUuX2VyYVllYXJPcmRpbmFsUmVnZXgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZy5fbG9jYWxlLmVyYVllYXJPcmRpbmFsUGFyc2UpIHtcbiAgICAgICAgICAgIGFycmF5W1lFQVJdID0gY29uZmlnLl9sb2NhbGUuZXJhWWVhck9yZGluYWxQYXJzZShpbnB1dCwgbWF0Y2gpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXJyYXlbWUVBUl0gPSBwYXJzZUludChpbnB1dCwgMTApO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBsb2NhbGVFcmFzKG0sIGZvcm1hdCkge1xuICAgICAgICB2YXIgaSxcbiAgICAgICAgICAgIGwsXG4gICAgICAgICAgICBkYXRlLFxuICAgICAgICAgICAgZXJhcyA9IHRoaXMuX2VyYXMgfHwgZ2V0TG9jYWxlKCdlbicpLl9lcmFzO1xuICAgICAgICBmb3IgKGkgPSAwLCBsID0gZXJhcy5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICAgICAgICAgIHN3aXRjaCAodHlwZW9mIGVyYXNbaV0uc2luY2UpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICAgICAgICAgICAgICAvLyB0cnVuY2F0ZSB0aW1lXG4gICAgICAgICAgICAgICAgICAgIGRhdGUgPSBob29rcyhlcmFzW2ldLnNpbmNlKS5zdGFydE9mKCdkYXknKTtcbiAgICAgICAgICAgICAgICAgICAgZXJhc1tpXS5zaW5jZSA9IGRhdGUudmFsdWVPZigpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc3dpdGNoICh0eXBlb2YgZXJhc1tpXS51bnRpbCkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgICAgICAgICAgICAgICAgIGVyYXNbaV0udW50aWwgPSArSW5maW5pdHk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgICAgICAgICAgICAgIC8vIHRydW5jYXRlIHRpbWVcbiAgICAgICAgICAgICAgICAgICAgZGF0ZSA9IGhvb2tzKGVyYXNbaV0udW50aWwpLnN0YXJ0T2YoJ2RheScpLnZhbHVlT2YoKTtcbiAgICAgICAgICAgICAgICAgICAgZXJhc1tpXS51bnRpbCA9IGRhdGUudmFsdWVPZigpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZXJhcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2NhbGVFcmFzUGFyc2UoZXJhTmFtZSwgZm9ybWF0LCBzdHJpY3QpIHtcbiAgICAgICAgdmFyIGksXG4gICAgICAgICAgICBsLFxuICAgICAgICAgICAgZXJhcyA9IHRoaXMuZXJhcygpLFxuICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgIGFiYnIsXG4gICAgICAgICAgICBuYXJyb3c7XG4gICAgICAgIGVyYU5hbWUgPSBlcmFOYW1lLnRvVXBwZXJDYXNlKCk7XG5cbiAgICAgICAgZm9yIChpID0gMCwgbCA9IGVyYXMubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICAgICAgICBuYW1lID0gZXJhc1tpXS5uYW1lLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICBhYmJyID0gZXJhc1tpXS5hYmJyLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICBuYXJyb3cgPSBlcmFzW2ldLm5hcnJvdy50b1VwcGVyQ2FzZSgpO1xuXG4gICAgICAgICAgICBpZiAoc3RyaWN0KSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChmb3JtYXQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnTic6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ05OJzpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnTk5OJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhYmJyID09PSBlcmFOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVyYXNbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICBjYXNlICdOTk5OJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuYW1lID09PSBlcmFOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVyYXNbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICBjYXNlICdOTk5OTic6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmFycm93ID09PSBlcmFOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVyYXNbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFtuYW1lLCBhYmJyLCBuYXJyb3ddLmluZGV4T2YoZXJhTmFtZSkgPj0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBlcmFzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9jYWxlRXJhc0NvbnZlcnRZZWFyKGVyYSwgeWVhcikge1xuICAgICAgICB2YXIgZGlyID0gZXJhLnNpbmNlIDw9IGVyYS51bnRpbCA/ICsxIDogLTE7XG4gICAgICAgIGlmICh5ZWFyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBob29rcyhlcmEuc2luY2UpLnllYXIoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBob29rcyhlcmEuc2luY2UpLnllYXIoKSArICh5ZWFyIC0gZXJhLm9mZnNldCkgKiBkaXI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRFcmFOYW1lKCkge1xuICAgICAgICB2YXIgaSxcbiAgICAgICAgICAgIGwsXG4gICAgICAgICAgICB2YWwsXG4gICAgICAgICAgICBlcmFzID0gdGhpcy5sb2NhbGVEYXRhKCkuZXJhcygpO1xuICAgICAgICBmb3IgKGkgPSAwLCBsID0gZXJhcy5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICAgICAgICAgIC8vIHRydW5jYXRlIHRpbWVcbiAgICAgICAgICAgIHZhbCA9IHRoaXMuY2xvbmUoKS5zdGFydE9mKCdkYXknKS52YWx1ZU9mKCk7XG5cbiAgICAgICAgICAgIGlmIChlcmFzW2ldLnNpbmNlIDw9IHZhbCAmJiB2YWwgPD0gZXJhc1tpXS51bnRpbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBlcmFzW2ldLm5hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZXJhc1tpXS51bnRpbCA8PSB2YWwgJiYgdmFsIDw9IGVyYXNbaV0uc2luY2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZXJhc1tpXS5uYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEVyYU5hcnJvdygpIHtcbiAgICAgICAgdmFyIGksXG4gICAgICAgICAgICBsLFxuICAgICAgICAgICAgdmFsLFxuICAgICAgICAgICAgZXJhcyA9IHRoaXMubG9jYWxlRGF0YSgpLmVyYXMoKTtcbiAgICAgICAgZm9yIChpID0gMCwgbCA9IGVyYXMubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICAgICAgICAvLyB0cnVuY2F0ZSB0aW1lXG4gICAgICAgICAgICB2YWwgPSB0aGlzLmNsb25lKCkuc3RhcnRPZignZGF5JykudmFsdWVPZigpO1xuXG4gICAgICAgICAgICBpZiAoZXJhc1tpXS5zaW5jZSA8PSB2YWwgJiYgdmFsIDw9IGVyYXNbaV0udW50aWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZXJhc1tpXS5uYXJyb3c7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZXJhc1tpXS51bnRpbCA8PSB2YWwgJiYgdmFsIDw9IGVyYXNbaV0uc2luY2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZXJhc1tpXS5uYXJyb3c7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0RXJhQWJicigpIHtcbiAgICAgICAgdmFyIGksXG4gICAgICAgICAgICBsLFxuICAgICAgICAgICAgdmFsLFxuICAgICAgICAgICAgZXJhcyA9IHRoaXMubG9jYWxlRGF0YSgpLmVyYXMoKTtcbiAgICAgICAgZm9yIChpID0gMCwgbCA9IGVyYXMubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICAgICAgICAvLyB0cnVuY2F0ZSB0aW1lXG4gICAgICAgICAgICB2YWwgPSB0aGlzLmNsb25lKCkuc3RhcnRPZignZGF5JykudmFsdWVPZigpO1xuXG4gICAgICAgICAgICBpZiAoZXJhc1tpXS5zaW5jZSA8PSB2YWwgJiYgdmFsIDw9IGVyYXNbaV0udW50aWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZXJhc1tpXS5hYmJyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGVyYXNbaV0udW50aWwgPD0gdmFsICYmIHZhbCA8PSBlcmFzW2ldLnNpbmNlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVyYXNbaV0uYWJicjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRFcmFZZWFyKCkge1xuICAgICAgICB2YXIgaSxcbiAgICAgICAgICAgIGwsXG4gICAgICAgICAgICBkaXIsXG4gICAgICAgICAgICB2YWwsXG4gICAgICAgICAgICBlcmFzID0gdGhpcy5sb2NhbGVEYXRhKCkuZXJhcygpO1xuICAgICAgICBmb3IgKGkgPSAwLCBsID0gZXJhcy5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICAgICAgICAgIGRpciA9IGVyYXNbaV0uc2luY2UgPD0gZXJhc1tpXS51bnRpbCA/ICsxIDogLTE7XG5cbiAgICAgICAgICAgIC8vIHRydW5jYXRlIHRpbWVcbiAgICAgICAgICAgIHZhbCA9IHRoaXMuY2xvbmUoKS5zdGFydE9mKCdkYXknKS52YWx1ZU9mKCk7XG5cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAoZXJhc1tpXS5zaW5jZSA8PSB2YWwgJiYgdmFsIDw9IGVyYXNbaV0udW50aWwpIHx8XG4gICAgICAgICAgICAgICAgKGVyYXNbaV0udW50aWwgPD0gdmFsICYmIHZhbCA8PSBlcmFzW2ldLnNpbmNlKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMueWVhcigpIC0gaG9va3MoZXJhc1tpXS5zaW5jZSkueWVhcigpKSAqIGRpciArXG4gICAgICAgICAgICAgICAgICAgIGVyYXNbaV0ub2Zmc2V0XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnllYXIoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlcmFzTmFtZVJlZ2V4KGlzU3RyaWN0KSB7XG4gICAgICAgIGlmICghaGFzT3duUHJvcCh0aGlzLCAnX2VyYXNOYW1lUmVnZXgnKSkge1xuICAgICAgICAgICAgY29tcHV0ZUVyYXNQYXJzZS5jYWxsKHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpc1N0cmljdCA/IHRoaXMuX2VyYXNOYW1lUmVnZXggOiB0aGlzLl9lcmFzUmVnZXg7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXJhc0FiYnJSZWdleChpc1N0cmljdCkge1xuICAgICAgICBpZiAoIWhhc093blByb3AodGhpcywgJ19lcmFzQWJiclJlZ2V4JykpIHtcbiAgICAgICAgICAgIGNvbXB1dGVFcmFzUGFyc2UuY2FsbCh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXNTdHJpY3QgPyB0aGlzLl9lcmFzQWJiclJlZ2V4IDogdGhpcy5fZXJhc1JlZ2V4O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVyYXNOYXJyb3dSZWdleChpc1N0cmljdCkge1xuICAgICAgICBpZiAoIWhhc093blByb3AodGhpcywgJ19lcmFzTmFycm93UmVnZXgnKSkge1xuICAgICAgICAgICAgY29tcHV0ZUVyYXNQYXJzZS5jYWxsKHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpc1N0cmljdCA/IHRoaXMuX2VyYXNOYXJyb3dSZWdleCA6IHRoaXMuX2VyYXNSZWdleDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYXRjaEVyYUFiYnIoaXNTdHJpY3QsIGxvY2FsZSkge1xuICAgICAgICByZXR1cm4gbG9jYWxlLmVyYXNBYmJyUmVnZXgoaXNTdHJpY3QpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1hdGNoRXJhTmFtZShpc1N0cmljdCwgbG9jYWxlKSB7XG4gICAgICAgIHJldHVybiBsb2NhbGUuZXJhc05hbWVSZWdleChpc1N0cmljdCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWF0Y2hFcmFOYXJyb3coaXNTdHJpY3QsIGxvY2FsZSkge1xuICAgICAgICByZXR1cm4gbG9jYWxlLmVyYXNOYXJyb3dSZWdleChpc1N0cmljdCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWF0Y2hFcmFZZWFyT3JkaW5hbChpc1N0cmljdCwgbG9jYWxlKSB7XG4gICAgICAgIHJldHVybiBsb2NhbGUuX2VyYVllYXJPcmRpbmFsUmVnZXggfHwgbWF0Y2hVbnNpZ25lZDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb21wdXRlRXJhc1BhcnNlKCkge1xuICAgICAgICB2YXIgYWJiclBpZWNlcyA9IFtdLFxuICAgICAgICAgICAgbmFtZVBpZWNlcyA9IFtdLFxuICAgICAgICAgICAgbmFycm93UGllY2VzID0gW10sXG4gICAgICAgICAgICBtaXhlZFBpZWNlcyA9IFtdLFxuICAgICAgICAgICAgaSxcbiAgICAgICAgICAgIGwsXG4gICAgICAgICAgICBlcmFzID0gdGhpcy5lcmFzKCk7XG5cbiAgICAgICAgZm9yIChpID0gMCwgbCA9IGVyYXMubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICAgICAgICBuYW1lUGllY2VzLnB1c2gocmVnZXhFc2NhcGUoZXJhc1tpXS5uYW1lKSk7XG4gICAgICAgICAgICBhYmJyUGllY2VzLnB1c2gocmVnZXhFc2NhcGUoZXJhc1tpXS5hYmJyKSk7XG4gICAgICAgICAgICBuYXJyb3dQaWVjZXMucHVzaChyZWdleEVzY2FwZShlcmFzW2ldLm5hcnJvdykpO1xuXG4gICAgICAgICAgICBtaXhlZFBpZWNlcy5wdXNoKHJlZ2V4RXNjYXBlKGVyYXNbaV0ubmFtZSkpO1xuICAgICAgICAgICAgbWl4ZWRQaWVjZXMucHVzaChyZWdleEVzY2FwZShlcmFzW2ldLmFiYnIpKTtcbiAgICAgICAgICAgIG1peGVkUGllY2VzLnB1c2gocmVnZXhFc2NhcGUoZXJhc1tpXS5uYXJyb3cpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2VyYXNSZWdleCA9IG5ldyBSZWdFeHAoJ14oJyArIG1peGVkUGllY2VzLmpvaW4oJ3wnKSArICcpJywgJ2knKTtcbiAgICAgICAgdGhpcy5fZXJhc05hbWVSZWdleCA9IG5ldyBSZWdFeHAoJ14oJyArIG5hbWVQaWVjZXMuam9pbignfCcpICsgJyknLCAnaScpO1xuICAgICAgICB0aGlzLl9lcmFzQWJiclJlZ2V4ID0gbmV3IFJlZ0V4cCgnXignICsgYWJiclBpZWNlcy5qb2luKCd8JykgKyAnKScsICdpJyk7XG4gICAgICAgIHRoaXMuX2VyYXNOYXJyb3dSZWdleCA9IG5ldyBSZWdFeHAoXG4gICAgICAgICAgICAnXignICsgbmFycm93UGllY2VzLmpvaW4oJ3wnKSArICcpJyxcbiAgICAgICAgICAgICdpJ1xuICAgICAgICApO1xuICAgIH1cblxuICAgIC8vIEZPUk1BVFRJTkdcblxuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnZ2cnLCAyXSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy53ZWVrWWVhcigpICUgMTAwO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydHRycsIDJdLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzb1dlZWtZZWFyKCkgJSAxMDA7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBhZGRXZWVrWWVhckZvcm1hdFRva2VuKHRva2VuLCBnZXR0ZXIpIHtcbiAgICAgICAgYWRkRm9ybWF0VG9rZW4oMCwgW3Rva2VuLCB0b2tlbi5sZW5ndGhdLCAwLCBnZXR0ZXIpO1xuICAgIH1cblxuICAgIGFkZFdlZWtZZWFyRm9ybWF0VG9rZW4oJ2dnZ2cnLCAnd2Vla1llYXInKTtcbiAgICBhZGRXZWVrWWVhckZvcm1hdFRva2VuKCdnZ2dnZycsICd3ZWVrWWVhcicpO1xuICAgIGFkZFdlZWtZZWFyRm9ybWF0VG9rZW4oJ0dHR0cnLCAnaXNvV2Vla1llYXInKTtcbiAgICBhZGRXZWVrWWVhckZvcm1hdFRva2VuKCdHR0dHRycsICdpc29XZWVrWWVhcicpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCd3ZWVrWWVhcicsICdnZycpO1xuICAgIGFkZFVuaXRBbGlhcygnaXNvV2Vla1llYXInLCAnR0cnKTtcblxuICAgIC8vIFBSSU9SSVRZXG5cbiAgICBhZGRVbml0UHJpb3JpdHkoJ3dlZWtZZWFyJywgMSk7XG4gICAgYWRkVW5pdFByaW9yaXR5KCdpc29XZWVrWWVhcicsIDEpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignRycsIG1hdGNoU2lnbmVkKTtcbiAgICBhZGRSZWdleFRva2VuKCdnJywgbWF0Y2hTaWduZWQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0dHJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ2dnJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0dHR0cnLCBtYXRjaDF0bzQsIG1hdGNoNCk7XG4gICAgYWRkUmVnZXhUb2tlbignZ2dnZycsIG1hdGNoMXRvNCwgbWF0Y2g0KTtcbiAgICBhZGRSZWdleFRva2VuKCdHR0dHRycsIG1hdGNoMXRvNiwgbWF0Y2g2KTtcbiAgICBhZGRSZWdleFRva2VuKCdnZ2dnZycsIG1hdGNoMXRvNiwgbWF0Y2g2KTtcblxuICAgIGFkZFdlZWtQYXJzZVRva2VuKFsnZ2dnZycsICdnZ2dnZycsICdHR0dHJywgJ0dHR0dHJ10sIGZ1bmN0aW9uIChcbiAgICAgICAgaW5wdXQsXG4gICAgICAgIHdlZWssXG4gICAgICAgIGNvbmZpZyxcbiAgICAgICAgdG9rZW5cbiAgICApIHtcbiAgICAgICAgd2Vla1t0b2tlbi5zdWJzdHIoMCwgMildID0gdG9JbnQoaW5wdXQpO1xuICAgIH0pO1xuXG4gICAgYWRkV2Vla1BhcnNlVG9rZW4oWydnZycsICdHRyddLCBmdW5jdGlvbiAoaW5wdXQsIHdlZWssIGNvbmZpZywgdG9rZW4pIHtcbiAgICAgICAgd2Vla1t0b2tlbl0gPSBob29rcy5wYXJzZVR3b0RpZ2l0WWVhcihpbnB1dCk7XG4gICAgfSk7XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICBmdW5jdGlvbiBnZXRTZXRXZWVrWWVhcihpbnB1dCkge1xuICAgICAgICByZXR1cm4gZ2V0U2V0V2Vla1llYXJIZWxwZXIuY2FsbChcbiAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgICBpbnB1dCxcbiAgICAgICAgICAgIHRoaXMud2VlaygpLFxuICAgICAgICAgICAgdGhpcy53ZWVrZGF5KCksXG4gICAgICAgICAgICB0aGlzLmxvY2FsZURhdGEoKS5fd2Vlay5kb3csXG4gICAgICAgICAgICB0aGlzLmxvY2FsZURhdGEoKS5fd2Vlay5kb3lcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRTZXRJU09XZWVrWWVhcihpbnB1dCkge1xuICAgICAgICByZXR1cm4gZ2V0U2V0V2Vla1llYXJIZWxwZXIuY2FsbChcbiAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgICBpbnB1dCxcbiAgICAgICAgICAgIHRoaXMuaXNvV2VlaygpLFxuICAgICAgICAgICAgdGhpcy5pc29XZWVrZGF5KCksXG4gICAgICAgICAgICAxLFxuICAgICAgICAgICAgNFxuICAgICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldElTT1dlZWtzSW5ZZWFyKCkge1xuICAgICAgICByZXR1cm4gd2Vla3NJblllYXIodGhpcy55ZWFyKCksIDEsIDQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldElTT1dlZWtzSW5JU09XZWVrWWVhcigpIHtcbiAgICAgICAgcmV0dXJuIHdlZWtzSW5ZZWFyKHRoaXMuaXNvV2Vla1llYXIoKSwgMSwgNCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0V2Vla3NJblllYXIoKSB7XG4gICAgICAgIHZhciB3ZWVrSW5mbyA9IHRoaXMubG9jYWxlRGF0YSgpLl93ZWVrO1xuICAgICAgICByZXR1cm4gd2Vla3NJblllYXIodGhpcy55ZWFyKCksIHdlZWtJbmZvLmRvdywgd2Vla0luZm8uZG95KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRXZWVrc0luV2Vla1llYXIoKSB7XG4gICAgICAgIHZhciB3ZWVrSW5mbyA9IHRoaXMubG9jYWxlRGF0YSgpLl93ZWVrO1xuICAgICAgICByZXR1cm4gd2Vla3NJblllYXIodGhpcy53ZWVrWWVhcigpLCB3ZWVrSW5mby5kb3csIHdlZWtJbmZvLmRveSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U2V0V2Vla1llYXJIZWxwZXIoaW5wdXQsIHdlZWssIHdlZWtkYXksIGRvdywgZG95KSB7XG4gICAgICAgIHZhciB3ZWVrc1RhcmdldDtcbiAgICAgICAgaWYgKGlucHV0ID09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB3ZWVrT2ZZZWFyKHRoaXMsIGRvdywgZG95KS55ZWFyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgd2Vla3NUYXJnZXQgPSB3ZWVrc0luWWVhcihpbnB1dCwgZG93LCBkb3kpO1xuICAgICAgICAgICAgaWYgKHdlZWsgPiB3ZWVrc1RhcmdldCkge1xuICAgICAgICAgICAgICAgIHdlZWsgPSB3ZWVrc1RhcmdldDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzZXRXZWVrQWxsLmNhbGwodGhpcywgaW5wdXQsIHdlZWssIHdlZWtkYXksIGRvdywgZG95KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldFdlZWtBbGwod2Vla1llYXIsIHdlZWssIHdlZWtkYXksIGRvdywgZG95KSB7XG4gICAgICAgIHZhciBkYXlPZlllYXJEYXRhID0gZGF5T2ZZZWFyRnJvbVdlZWtzKHdlZWtZZWFyLCB3ZWVrLCB3ZWVrZGF5LCBkb3csIGRveSksXG4gICAgICAgICAgICBkYXRlID0gY3JlYXRlVVRDRGF0ZShkYXlPZlllYXJEYXRhLnllYXIsIDAsIGRheU9mWWVhckRhdGEuZGF5T2ZZZWFyKTtcblxuICAgICAgICB0aGlzLnllYXIoZGF0ZS5nZXRVVENGdWxsWWVhcigpKTtcbiAgICAgICAgdGhpcy5tb250aChkYXRlLmdldFVUQ01vbnRoKCkpO1xuICAgICAgICB0aGlzLmRhdGUoZGF0ZS5nZXRVVENEYXRlKCkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvLyBGT1JNQVRUSU5HXG5cbiAgICBhZGRGb3JtYXRUb2tlbignUScsIDAsICdRbycsICdxdWFydGVyJyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ3F1YXJ0ZXInLCAnUScpO1xuXG4gICAgLy8gUFJJT1JJVFlcblxuICAgIGFkZFVuaXRQcmlvcml0eSgncXVhcnRlcicsIDcpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignUScsIG1hdGNoMSk7XG4gICAgYWRkUGFyc2VUb2tlbignUScsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXkpIHtcbiAgICAgICAgYXJyYXlbTU9OVEhdID0gKHRvSW50KGlucHV0KSAtIDEpICogMztcbiAgICB9KTtcblxuICAgIC8vIE1PTUVOVFNcblxuICAgIGZ1bmN0aW9uIGdldFNldFF1YXJ0ZXIoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGxcbiAgICAgICAgICAgID8gTWF0aC5jZWlsKCh0aGlzLm1vbnRoKCkgKyAxKSAvIDMpXG4gICAgICAgICAgICA6IHRoaXMubW9udGgoKGlucHV0IC0gMSkgKiAzICsgKHRoaXMubW9udGgoKSAlIDMpKTtcbiAgICB9XG5cbiAgICAvLyBGT1JNQVRUSU5HXG5cbiAgICBhZGRGb3JtYXRUb2tlbignRCcsIFsnREQnLCAyXSwgJ0RvJywgJ2RhdGUnKTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygnZGF0ZScsICdEJyk7XG5cbiAgICAvLyBQUklPUklUWVxuICAgIGFkZFVuaXRQcmlvcml0eSgnZGF0ZScsIDkpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignRCcsIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignREQnLCBtYXRjaDF0bzIsIG1hdGNoMik7XG4gICAgYWRkUmVnZXhUb2tlbignRG8nLCBmdW5jdGlvbiAoaXNTdHJpY3QsIGxvY2FsZSkge1xuICAgICAgICAvLyBUT0RPOiBSZW1vdmUgXCJvcmRpbmFsUGFyc2VcIiBmYWxsYmFjayBpbiBuZXh0IG1ham9yIHJlbGVhc2UuXG4gICAgICAgIHJldHVybiBpc1N0cmljdFxuICAgICAgICAgICAgPyBsb2NhbGUuX2RheU9mTW9udGhPcmRpbmFsUGFyc2UgfHwgbG9jYWxlLl9vcmRpbmFsUGFyc2VcbiAgICAgICAgICAgIDogbG9jYWxlLl9kYXlPZk1vbnRoT3JkaW5hbFBhcnNlTGVuaWVudDtcbiAgICB9KTtcblxuICAgIGFkZFBhcnNlVG9rZW4oWydEJywgJ0REJ10sIERBVEUpO1xuICAgIGFkZFBhcnNlVG9rZW4oJ0RvJywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSkge1xuICAgICAgICBhcnJheVtEQVRFXSA9IHRvSW50KGlucHV0Lm1hdGNoKG1hdGNoMXRvMilbMF0pO1xuICAgIH0pO1xuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgdmFyIGdldFNldERheU9mTW9udGggPSBtYWtlR2V0U2V0KCdEYXRlJywgdHJ1ZSk7XG5cbiAgICAvLyBGT1JNQVRUSU5HXG5cbiAgICBhZGRGb3JtYXRUb2tlbignREREJywgWydEREREJywgM10sICdERERvJywgJ2RheU9mWWVhcicpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdkYXlPZlllYXInLCAnREREJyk7XG5cbiAgICAvLyBQUklPUklUWVxuICAgIGFkZFVuaXRQcmlvcml0eSgnZGF5T2ZZZWFyJywgNCk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdEREQnLCBtYXRjaDF0bzMpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0REREQnLCBtYXRjaDMpO1xuICAgIGFkZFBhcnNlVG9rZW4oWydEREQnLCAnRERERCddLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICAgICAgY29uZmlnLl9kYXlPZlllYXIgPSB0b0ludChpbnB1dCk7XG4gICAgfSk7XG5cbiAgICAvLyBIRUxQRVJTXG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICBmdW5jdGlvbiBnZXRTZXREYXlPZlllYXIoaW5wdXQpIHtcbiAgICAgICAgdmFyIGRheU9mWWVhciA9XG4gICAgICAgICAgICBNYXRoLnJvdW5kKFxuICAgICAgICAgICAgICAgICh0aGlzLmNsb25lKCkuc3RhcnRPZignZGF5JykgLSB0aGlzLmNsb25lKCkuc3RhcnRPZigneWVhcicpKSAvIDg2NGU1XG4gICAgICAgICAgICApICsgMTtcbiAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyBkYXlPZlllYXIgOiB0aGlzLmFkZChpbnB1dCAtIGRheU9mWWVhciwgJ2QnKTtcbiAgICB9XG5cbiAgICAvLyBGT1JNQVRUSU5HXG5cbiAgICBhZGRGb3JtYXRUb2tlbignbScsIFsnbW0nLCAyXSwgMCwgJ21pbnV0ZScpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdtaW51dGUnLCAnbScpO1xuXG4gICAgLy8gUFJJT1JJVFlcblxuICAgIGFkZFVuaXRQcmlvcml0eSgnbWludXRlJywgMTQpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignbScsIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignbW0nLCBtYXRjaDF0bzIsIG1hdGNoMik7XG4gICAgYWRkUGFyc2VUb2tlbihbJ20nLCAnbW0nXSwgTUlOVVRFKTtcblxuICAgIC8vIE1PTUVOVFNcblxuICAgIHZhciBnZXRTZXRNaW51dGUgPSBtYWtlR2V0U2V0KCdNaW51dGVzJywgZmFsc2UpO1xuXG4gICAgLy8gRk9STUFUVElOR1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ3MnLCBbJ3NzJywgMl0sIDAsICdzZWNvbmQnKTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygnc2Vjb25kJywgJ3MnKTtcblxuICAgIC8vIFBSSU9SSVRZXG5cbiAgICBhZGRVbml0UHJpb3JpdHkoJ3NlY29uZCcsIDE1KTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ3MnLCBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ3NzJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFBhcnNlVG9rZW4oWydzJywgJ3NzJ10sIFNFQ09ORCk7XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICB2YXIgZ2V0U2V0U2Vjb25kID0gbWFrZUdldFNldCgnU2Vjb25kcycsIGZhbHNlKTtcblxuICAgIC8vIEZPUk1BVFRJTkdcblxuICAgIGFkZEZvcm1hdFRva2VuKCdTJywgMCwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gfn4odGhpcy5taWxsaXNlY29uZCgpIC8gMTAwKTtcbiAgICB9KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnU1MnLCAyXSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gfn4odGhpcy5taWxsaXNlY29uZCgpIC8gMTApO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydTU1MnLCAzXSwgMCwgJ21pbGxpc2Vjb25kJyk7XG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydTU1NTJywgNF0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWlsbGlzZWNvbmQoKSAqIDEwO1xuICAgIH0pO1xuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnU1NTU1MnLCA1XSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5taWxsaXNlY29uZCgpICogMTAwO1xuICAgIH0pO1xuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnU1NTU1NTJywgNl0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWlsbGlzZWNvbmQoKSAqIDEwMDA7XG4gICAgfSk7XG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydTU1NTU1NTJywgN10sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWlsbGlzZWNvbmQoKSAqIDEwMDAwO1xuICAgIH0pO1xuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnU1NTU1NTU1MnLCA4XSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5taWxsaXNlY29uZCgpICogMTAwMDAwO1xuICAgIH0pO1xuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnU1NTU1NTU1NTJywgOV0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWlsbGlzZWNvbmQoKSAqIDEwMDAwMDA7XG4gICAgfSk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ21pbGxpc2Vjb25kJywgJ21zJyk7XG5cbiAgICAvLyBQUklPUklUWVxuXG4gICAgYWRkVW5pdFByaW9yaXR5KCdtaWxsaXNlY29uZCcsIDE2KTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ1MnLCBtYXRjaDF0bzMsIG1hdGNoMSk7XG4gICAgYWRkUmVnZXhUb2tlbignU1MnLCBtYXRjaDF0bzMsIG1hdGNoMik7XG4gICAgYWRkUmVnZXhUb2tlbignU1NTJywgbWF0Y2gxdG8zLCBtYXRjaDMpO1xuXG4gICAgdmFyIHRva2VuLCBnZXRTZXRNaWxsaXNlY29uZDtcbiAgICBmb3IgKHRva2VuID0gJ1NTU1MnOyB0b2tlbi5sZW5ndGggPD0gOTsgdG9rZW4gKz0gJ1MnKSB7XG4gICAgICAgIGFkZFJlZ2V4VG9rZW4odG9rZW4sIG1hdGNoVW5zaWduZWQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlTXMoaW5wdXQsIGFycmF5KSB7XG4gICAgICAgIGFycmF5W01JTExJU0VDT05EXSA9IHRvSW50KCgnMC4nICsgaW5wdXQpICogMTAwMCk7XG4gICAgfVxuXG4gICAgZm9yICh0b2tlbiA9ICdTJzsgdG9rZW4ubGVuZ3RoIDw9IDk7IHRva2VuICs9ICdTJykge1xuICAgICAgICBhZGRQYXJzZVRva2VuKHRva2VuLCBwYXJzZU1zKTtcbiAgICB9XG5cbiAgICBnZXRTZXRNaWxsaXNlY29uZCA9IG1ha2VHZXRTZXQoJ01pbGxpc2Vjb25kcycsIGZhbHNlKTtcblxuICAgIC8vIEZPUk1BVFRJTkdcblxuICAgIGFkZEZvcm1hdFRva2VuKCd6JywgMCwgMCwgJ3pvbmVBYmJyJyk7XG4gICAgYWRkRm9ybWF0VG9rZW4oJ3p6JywgMCwgMCwgJ3pvbmVOYW1lJyk7XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICBmdW5jdGlvbiBnZXRab25lQWJicigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzVVRDID8gJ1VUQycgOiAnJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRab25lTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzVVRDID8gJ0Nvb3JkaW5hdGVkIFVuaXZlcnNhbCBUaW1lJyA6ICcnO1xuICAgIH1cblxuICAgIHZhciBwcm90byA9IE1vbWVudC5wcm90b3R5cGU7XG5cbiAgICBwcm90by5hZGQgPSBhZGQ7XG4gICAgcHJvdG8uY2FsZW5kYXIgPSBjYWxlbmRhciQxO1xuICAgIHByb3RvLmNsb25lID0gY2xvbmU7XG4gICAgcHJvdG8uZGlmZiA9IGRpZmY7XG4gICAgcHJvdG8uZW5kT2YgPSBlbmRPZjtcbiAgICBwcm90by5mb3JtYXQgPSBmb3JtYXQ7XG4gICAgcHJvdG8uZnJvbSA9IGZyb207XG4gICAgcHJvdG8uZnJvbU5vdyA9IGZyb21Ob3c7XG4gICAgcHJvdG8udG8gPSB0bztcbiAgICBwcm90by50b05vdyA9IHRvTm93O1xuICAgIHByb3RvLmdldCA9IHN0cmluZ0dldDtcbiAgICBwcm90by5pbnZhbGlkQXQgPSBpbnZhbGlkQXQ7XG4gICAgcHJvdG8uaXNBZnRlciA9IGlzQWZ0ZXI7XG4gICAgcHJvdG8uaXNCZWZvcmUgPSBpc0JlZm9yZTtcbiAgICBwcm90by5pc0JldHdlZW4gPSBpc0JldHdlZW47XG4gICAgcHJvdG8uaXNTYW1lID0gaXNTYW1lO1xuICAgIHByb3RvLmlzU2FtZU9yQWZ0ZXIgPSBpc1NhbWVPckFmdGVyO1xuICAgIHByb3RvLmlzU2FtZU9yQmVmb3JlID0gaXNTYW1lT3JCZWZvcmU7XG4gICAgcHJvdG8uaXNWYWxpZCA9IGlzVmFsaWQkMjtcbiAgICBwcm90by5sYW5nID0gbGFuZztcbiAgICBwcm90by5sb2NhbGUgPSBsb2NhbGU7XG4gICAgcHJvdG8ubG9jYWxlRGF0YSA9IGxvY2FsZURhdGE7XG4gICAgcHJvdG8ubWF4ID0gcHJvdG90eXBlTWF4O1xuICAgIHByb3RvLm1pbiA9IHByb3RvdHlwZU1pbjtcbiAgICBwcm90by5wYXJzaW5nRmxhZ3MgPSBwYXJzaW5nRmxhZ3M7XG4gICAgcHJvdG8uc2V0ID0gc3RyaW5nU2V0O1xuICAgIHByb3RvLnN0YXJ0T2YgPSBzdGFydE9mO1xuICAgIHByb3RvLnN1YnRyYWN0ID0gc3VidHJhY3Q7XG4gICAgcHJvdG8udG9BcnJheSA9IHRvQXJyYXk7XG4gICAgcHJvdG8udG9PYmplY3QgPSB0b09iamVjdDtcbiAgICBwcm90by50b0RhdGUgPSB0b0RhdGU7XG4gICAgcHJvdG8udG9JU09TdHJpbmcgPSB0b0lTT1N0cmluZztcbiAgICBwcm90by5pbnNwZWN0ID0gaW5zcGVjdDtcbiAgICBpZiAodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLmZvciAhPSBudWxsKSB7XG4gICAgICAgIHByb3RvW1N5bWJvbC5mb3IoJ25vZGVqcy51dGlsLmluc3BlY3QuY3VzdG9tJyldID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICdNb21lbnQ8JyArIHRoaXMuZm9ybWF0KCkgKyAnPic7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHByb3RvLnRvSlNPTiA9IHRvSlNPTjtcbiAgICBwcm90by50b1N0cmluZyA9IHRvU3RyaW5nO1xuICAgIHByb3RvLnVuaXggPSB1bml4O1xuICAgIHByb3RvLnZhbHVlT2YgPSB2YWx1ZU9mO1xuICAgIHByb3RvLmNyZWF0aW9uRGF0YSA9IGNyZWF0aW9uRGF0YTtcbiAgICBwcm90by5lcmFOYW1lID0gZ2V0RXJhTmFtZTtcbiAgICBwcm90by5lcmFOYXJyb3cgPSBnZXRFcmFOYXJyb3c7XG4gICAgcHJvdG8uZXJhQWJiciA9IGdldEVyYUFiYnI7XG4gICAgcHJvdG8uZXJhWWVhciA9IGdldEVyYVllYXI7XG4gICAgcHJvdG8ueWVhciA9IGdldFNldFllYXI7XG4gICAgcHJvdG8uaXNMZWFwWWVhciA9IGdldElzTGVhcFllYXI7XG4gICAgcHJvdG8ud2Vla1llYXIgPSBnZXRTZXRXZWVrWWVhcjtcbiAgICBwcm90by5pc29XZWVrWWVhciA9IGdldFNldElTT1dlZWtZZWFyO1xuICAgIHByb3RvLnF1YXJ0ZXIgPSBwcm90by5xdWFydGVycyA9IGdldFNldFF1YXJ0ZXI7XG4gICAgcHJvdG8ubW9udGggPSBnZXRTZXRNb250aDtcbiAgICBwcm90by5kYXlzSW5Nb250aCA9IGdldERheXNJbk1vbnRoO1xuICAgIHByb3RvLndlZWsgPSBwcm90by53ZWVrcyA9IGdldFNldFdlZWs7XG4gICAgcHJvdG8uaXNvV2VlayA9IHByb3RvLmlzb1dlZWtzID0gZ2V0U2V0SVNPV2VlaztcbiAgICBwcm90by53ZWVrc0luWWVhciA9IGdldFdlZWtzSW5ZZWFyO1xuICAgIHByb3RvLndlZWtzSW5XZWVrWWVhciA9IGdldFdlZWtzSW5XZWVrWWVhcjtcbiAgICBwcm90by5pc29XZWVrc0luWWVhciA9IGdldElTT1dlZWtzSW5ZZWFyO1xuICAgIHByb3RvLmlzb1dlZWtzSW5JU09XZWVrWWVhciA9IGdldElTT1dlZWtzSW5JU09XZWVrWWVhcjtcbiAgICBwcm90by5kYXRlID0gZ2V0U2V0RGF5T2ZNb250aDtcbiAgICBwcm90by5kYXkgPSBwcm90by5kYXlzID0gZ2V0U2V0RGF5T2ZXZWVrO1xuICAgIHByb3RvLndlZWtkYXkgPSBnZXRTZXRMb2NhbGVEYXlPZldlZWs7XG4gICAgcHJvdG8uaXNvV2Vla2RheSA9IGdldFNldElTT0RheU9mV2VlaztcbiAgICBwcm90by5kYXlPZlllYXIgPSBnZXRTZXREYXlPZlllYXI7XG4gICAgcHJvdG8uaG91ciA9IHByb3RvLmhvdXJzID0gZ2V0U2V0SG91cjtcbiAgICBwcm90by5taW51dGUgPSBwcm90by5taW51dGVzID0gZ2V0U2V0TWludXRlO1xuICAgIHByb3RvLnNlY29uZCA9IHByb3RvLnNlY29uZHMgPSBnZXRTZXRTZWNvbmQ7XG4gICAgcHJvdG8ubWlsbGlzZWNvbmQgPSBwcm90by5taWxsaXNlY29uZHMgPSBnZXRTZXRNaWxsaXNlY29uZDtcbiAgICBwcm90by51dGNPZmZzZXQgPSBnZXRTZXRPZmZzZXQ7XG4gICAgcHJvdG8udXRjID0gc2V0T2Zmc2V0VG9VVEM7XG4gICAgcHJvdG8ubG9jYWwgPSBzZXRPZmZzZXRUb0xvY2FsO1xuICAgIHByb3RvLnBhcnNlWm9uZSA9IHNldE9mZnNldFRvUGFyc2VkT2Zmc2V0O1xuICAgIHByb3RvLmhhc0FsaWduZWRIb3VyT2Zmc2V0ID0gaGFzQWxpZ25lZEhvdXJPZmZzZXQ7XG4gICAgcHJvdG8uaXNEU1QgPSBpc0RheWxpZ2h0U2F2aW5nVGltZTtcbiAgICBwcm90by5pc0xvY2FsID0gaXNMb2NhbDtcbiAgICBwcm90by5pc1V0Y09mZnNldCA9IGlzVXRjT2Zmc2V0O1xuICAgIHByb3RvLmlzVXRjID0gaXNVdGM7XG4gICAgcHJvdG8uaXNVVEMgPSBpc1V0YztcbiAgICBwcm90by56b25lQWJiciA9IGdldFpvbmVBYmJyO1xuICAgIHByb3RvLnpvbmVOYW1lID0gZ2V0Wm9uZU5hbWU7XG4gICAgcHJvdG8uZGF0ZXMgPSBkZXByZWNhdGUoXG4gICAgICAgICdkYXRlcyBhY2Nlc3NvciBpcyBkZXByZWNhdGVkLiBVc2UgZGF0ZSBpbnN0ZWFkLicsXG4gICAgICAgIGdldFNldERheU9mTW9udGhcbiAgICApO1xuICAgIHByb3RvLm1vbnRocyA9IGRlcHJlY2F0ZShcbiAgICAgICAgJ21vbnRocyBhY2Nlc3NvciBpcyBkZXByZWNhdGVkLiBVc2UgbW9udGggaW5zdGVhZCcsXG4gICAgICAgIGdldFNldE1vbnRoXG4gICAgKTtcbiAgICBwcm90by55ZWFycyA9IGRlcHJlY2F0ZShcbiAgICAgICAgJ3llYXJzIGFjY2Vzc29yIGlzIGRlcHJlY2F0ZWQuIFVzZSB5ZWFyIGluc3RlYWQnLFxuICAgICAgICBnZXRTZXRZZWFyXG4gICAgKTtcbiAgICBwcm90by56b25lID0gZGVwcmVjYXRlKFxuICAgICAgICAnbW9tZW50KCkuem9uZSBpcyBkZXByZWNhdGVkLCB1c2UgbW9tZW50KCkudXRjT2Zmc2V0IGluc3RlYWQuIGh0dHA6Ly9tb21lbnRqcy5jb20vZ3VpZGVzLyMvd2FybmluZ3Mvem9uZS8nLFxuICAgICAgICBnZXRTZXRab25lXG4gICAgKTtcbiAgICBwcm90by5pc0RTVFNoaWZ0ZWQgPSBkZXByZWNhdGUoXG4gICAgICAgICdpc0RTVFNoaWZ0ZWQgaXMgZGVwcmVjYXRlZC4gU2VlIGh0dHA6Ly9tb21lbnRqcy5jb20vZ3VpZGVzLyMvd2FybmluZ3MvZHN0LXNoaWZ0ZWQvIGZvciBtb3JlIGluZm9ybWF0aW9uJyxcbiAgICAgICAgaXNEYXlsaWdodFNhdmluZ1RpbWVTaGlmdGVkXG4gICAgKTtcblxuICAgIGZ1bmN0aW9uIGNyZWF0ZVVuaXgoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUxvY2FsKGlucHV0ICogMTAwMCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlSW5ab25lKCkge1xuICAgICAgICByZXR1cm4gY3JlYXRlTG9jYWwuYXBwbHkobnVsbCwgYXJndW1lbnRzKS5wYXJzZVpvbmUoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcmVQYXJzZVBvc3RGb3JtYXQoc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBzdHJpbmc7XG4gICAgfVxuXG4gICAgdmFyIHByb3RvJDEgPSBMb2NhbGUucHJvdG90eXBlO1xuXG4gICAgcHJvdG8kMS5jYWxlbmRhciA9IGNhbGVuZGFyO1xuICAgIHByb3RvJDEubG9uZ0RhdGVGb3JtYXQgPSBsb25nRGF0ZUZvcm1hdDtcbiAgICBwcm90byQxLmludmFsaWREYXRlID0gaW52YWxpZERhdGU7XG4gICAgcHJvdG8kMS5vcmRpbmFsID0gb3JkaW5hbDtcbiAgICBwcm90byQxLnByZXBhcnNlID0gcHJlUGFyc2VQb3N0Rm9ybWF0O1xuICAgIHByb3RvJDEucG9zdGZvcm1hdCA9IHByZVBhcnNlUG9zdEZvcm1hdDtcbiAgICBwcm90byQxLnJlbGF0aXZlVGltZSA9IHJlbGF0aXZlVGltZTtcbiAgICBwcm90byQxLnBhc3RGdXR1cmUgPSBwYXN0RnV0dXJlO1xuICAgIHByb3RvJDEuc2V0ID0gc2V0O1xuICAgIHByb3RvJDEuZXJhcyA9IGxvY2FsZUVyYXM7XG4gICAgcHJvdG8kMS5lcmFzUGFyc2UgPSBsb2NhbGVFcmFzUGFyc2U7XG4gICAgcHJvdG8kMS5lcmFzQ29udmVydFllYXIgPSBsb2NhbGVFcmFzQ29udmVydFllYXI7XG4gICAgcHJvdG8kMS5lcmFzQWJiclJlZ2V4ID0gZXJhc0FiYnJSZWdleDtcbiAgICBwcm90byQxLmVyYXNOYW1lUmVnZXggPSBlcmFzTmFtZVJlZ2V4O1xuICAgIHByb3RvJDEuZXJhc05hcnJvd1JlZ2V4ID0gZXJhc05hcnJvd1JlZ2V4O1xuXG4gICAgcHJvdG8kMS5tb250aHMgPSBsb2NhbGVNb250aHM7XG4gICAgcHJvdG8kMS5tb250aHNTaG9ydCA9IGxvY2FsZU1vbnRoc1Nob3J0O1xuICAgIHByb3RvJDEubW9udGhzUGFyc2UgPSBsb2NhbGVNb250aHNQYXJzZTtcbiAgICBwcm90byQxLm1vbnRoc1JlZ2V4ID0gbW9udGhzUmVnZXg7XG4gICAgcHJvdG8kMS5tb250aHNTaG9ydFJlZ2V4ID0gbW9udGhzU2hvcnRSZWdleDtcbiAgICBwcm90byQxLndlZWsgPSBsb2NhbGVXZWVrO1xuICAgIHByb3RvJDEuZmlyc3REYXlPZlllYXIgPSBsb2NhbGVGaXJzdERheU9mWWVhcjtcbiAgICBwcm90byQxLmZpcnN0RGF5T2ZXZWVrID0gbG9jYWxlRmlyc3REYXlPZldlZWs7XG5cbiAgICBwcm90byQxLndlZWtkYXlzID0gbG9jYWxlV2Vla2RheXM7XG4gICAgcHJvdG8kMS53ZWVrZGF5c01pbiA9IGxvY2FsZVdlZWtkYXlzTWluO1xuICAgIHByb3RvJDEud2Vla2RheXNTaG9ydCA9IGxvY2FsZVdlZWtkYXlzU2hvcnQ7XG4gICAgcHJvdG8kMS53ZWVrZGF5c1BhcnNlID0gbG9jYWxlV2Vla2RheXNQYXJzZTtcblxuICAgIHByb3RvJDEud2Vla2RheXNSZWdleCA9IHdlZWtkYXlzUmVnZXg7XG4gICAgcHJvdG8kMS53ZWVrZGF5c1Nob3J0UmVnZXggPSB3ZWVrZGF5c1Nob3J0UmVnZXg7XG4gICAgcHJvdG8kMS53ZWVrZGF5c01pblJlZ2V4ID0gd2Vla2RheXNNaW5SZWdleDtcblxuICAgIHByb3RvJDEuaXNQTSA9IGxvY2FsZUlzUE07XG4gICAgcHJvdG8kMS5tZXJpZGllbSA9IGxvY2FsZU1lcmlkaWVtO1xuXG4gICAgZnVuY3Rpb24gZ2V0JDEoZm9ybWF0LCBpbmRleCwgZmllbGQsIHNldHRlcikge1xuICAgICAgICB2YXIgbG9jYWxlID0gZ2V0TG9jYWxlKCksXG4gICAgICAgICAgICB1dGMgPSBjcmVhdGVVVEMoKS5zZXQoc2V0dGVyLCBpbmRleCk7XG4gICAgICAgIHJldHVybiBsb2NhbGVbZmllbGRdKHV0YywgZm9ybWF0KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaXN0TW9udGhzSW1wbChmb3JtYXQsIGluZGV4LCBmaWVsZCkge1xuICAgICAgICBpZiAoaXNOdW1iZXIoZm9ybWF0KSkge1xuICAgICAgICAgICAgaW5kZXggPSBmb3JtYXQ7XG4gICAgICAgICAgICBmb3JtYXQgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBmb3JtYXQgPSBmb3JtYXQgfHwgJyc7XG5cbiAgICAgICAgaWYgKGluZGV4ICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBnZXQkMShmb3JtYXQsIGluZGV4LCBmaWVsZCwgJ21vbnRoJyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaSxcbiAgICAgICAgICAgIG91dCA9IFtdO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgMTI7IGkrKykge1xuICAgICAgICAgICAgb3V0W2ldID0gZ2V0JDEoZm9ybWF0LCBpLCBmaWVsZCwgJ21vbnRoJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvLyAoKVxuICAgIC8vICg1KVxuICAgIC8vIChmbXQsIDUpXG4gICAgLy8gKGZtdClcbiAgICAvLyAodHJ1ZSlcbiAgICAvLyAodHJ1ZSwgNSlcbiAgICAvLyAodHJ1ZSwgZm10LCA1KVxuICAgIC8vICh0cnVlLCBmbXQpXG4gICAgZnVuY3Rpb24gbGlzdFdlZWtkYXlzSW1wbChsb2NhbGVTb3J0ZWQsIGZvcm1hdCwgaW5kZXgsIGZpZWxkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbG9jYWxlU29ydGVkID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIGlmIChpc051bWJlcihmb3JtYXQpKSB7XG4gICAgICAgICAgICAgICAgaW5kZXggPSBmb3JtYXQ7XG4gICAgICAgICAgICAgICAgZm9ybWF0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQgfHwgJyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3JtYXQgPSBsb2NhbGVTb3J0ZWQ7XG4gICAgICAgICAgICBpbmRleCA9IGZvcm1hdDtcbiAgICAgICAgICAgIGxvY2FsZVNvcnRlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICBpZiAoaXNOdW1iZXIoZm9ybWF0KSkge1xuICAgICAgICAgICAgICAgIGluZGV4ID0gZm9ybWF0O1xuICAgICAgICAgICAgICAgIGZvcm1hdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0IHx8ICcnO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGxvY2FsZSA9IGdldExvY2FsZSgpLFxuICAgICAgICAgICAgc2hpZnQgPSBsb2NhbGVTb3J0ZWQgPyBsb2NhbGUuX3dlZWsuZG93IDogMCxcbiAgICAgICAgICAgIGksXG4gICAgICAgICAgICBvdXQgPSBbXTtcblxuICAgICAgICBpZiAoaW5kZXggIT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIGdldCQxKGZvcm1hdCwgKGluZGV4ICsgc2hpZnQpICUgNywgZmllbGQsICdkYXknKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCA3OyBpKyspIHtcbiAgICAgICAgICAgIG91dFtpXSA9IGdldCQxKGZvcm1hdCwgKGkgKyBzaGlmdCkgJSA3LCBmaWVsZCwgJ2RheScpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGlzdE1vbnRocyhmb3JtYXQsIGluZGV4KSB7XG4gICAgICAgIHJldHVybiBsaXN0TW9udGhzSW1wbChmb3JtYXQsIGluZGV4LCAnbW9udGhzJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGlzdE1vbnRoc1Nob3J0KGZvcm1hdCwgaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIGxpc3RNb250aHNJbXBsKGZvcm1hdCwgaW5kZXgsICdtb250aHNTaG9ydCcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpc3RXZWVrZGF5cyhsb2NhbGVTb3J0ZWQsIGZvcm1hdCwgaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIGxpc3RXZWVrZGF5c0ltcGwobG9jYWxlU29ydGVkLCBmb3JtYXQsIGluZGV4LCAnd2Vla2RheXMnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaXN0V2Vla2RheXNTaG9ydChsb2NhbGVTb3J0ZWQsIGZvcm1hdCwgaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIGxpc3RXZWVrZGF5c0ltcGwobG9jYWxlU29ydGVkLCBmb3JtYXQsIGluZGV4LCAnd2Vla2RheXNTaG9ydCcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpc3RXZWVrZGF5c01pbihsb2NhbGVTb3J0ZWQsIGZvcm1hdCwgaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIGxpc3RXZWVrZGF5c0ltcGwobG9jYWxlU29ydGVkLCBmb3JtYXQsIGluZGV4LCAnd2Vla2RheXNNaW4nKTtcbiAgICB9XG5cbiAgICBnZXRTZXRHbG9iYWxMb2NhbGUoJ2VuJywge1xuICAgICAgICBlcmFzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc2luY2U6ICcwMDAxLTAxLTAxJyxcbiAgICAgICAgICAgICAgICB1bnRpbDogK0luZmluaXR5LFxuICAgICAgICAgICAgICAgIG9mZnNldDogMSxcbiAgICAgICAgICAgICAgICBuYW1lOiAnQW5ubyBEb21pbmknLFxuICAgICAgICAgICAgICAgIG5hcnJvdzogJ0FEJyxcbiAgICAgICAgICAgICAgICBhYmJyOiAnQUQnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzaW5jZTogJzAwMDAtMTItMzEnLFxuICAgICAgICAgICAgICAgIHVudGlsOiAtSW5maW5pdHksXG4gICAgICAgICAgICAgICAgb2Zmc2V0OiAxLFxuICAgICAgICAgICAgICAgIG5hbWU6ICdCZWZvcmUgQ2hyaXN0JyxcbiAgICAgICAgICAgICAgICBuYXJyb3c6ICdCQycsXG4gICAgICAgICAgICAgICAgYWJicjogJ0JDJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGRheU9mTW9udGhPcmRpbmFsUGFyc2U6IC9cXGR7MSwyfSh0aHxzdHxuZHxyZCkvLFxuICAgICAgICBvcmRpbmFsOiBmdW5jdGlvbiAobnVtYmVyKSB7XG4gICAgICAgICAgICB2YXIgYiA9IG51bWJlciAlIDEwLFxuICAgICAgICAgICAgICAgIG91dHB1dCA9XG4gICAgICAgICAgICAgICAgICAgIHRvSW50KChudW1iZXIgJSAxMDApIC8gMTApID09PSAxXG4gICAgICAgICAgICAgICAgICAgICAgICA/ICd0aCdcbiAgICAgICAgICAgICAgICAgICAgICAgIDogYiA9PT0gMVxuICAgICAgICAgICAgICAgICAgICAgICAgPyAnc3QnXG4gICAgICAgICAgICAgICAgICAgICAgICA6IGIgPT09IDJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gJ25kJ1xuICAgICAgICAgICAgICAgICAgICAgICAgOiBiID09PSAzXG4gICAgICAgICAgICAgICAgICAgICAgICA/ICdyZCdcbiAgICAgICAgICAgICAgICAgICAgICAgIDogJ3RoJztcbiAgICAgICAgICAgIHJldHVybiBudW1iZXIgKyBvdXRwdXQ7XG4gICAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBTaWRlIGVmZmVjdCBpbXBvcnRzXG5cbiAgICBob29rcy5sYW5nID0gZGVwcmVjYXRlKFxuICAgICAgICAnbW9tZW50LmxhbmcgaXMgZGVwcmVjYXRlZC4gVXNlIG1vbWVudC5sb2NhbGUgaW5zdGVhZC4nLFxuICAgICAgICBnZXRTZXRHbG9iYWxMb2NhbGVcbiAgICApO1xuICAgIGhvb2tzLmxhbmdEYXRhID0gZGVwcmVjYXRlKFxuICAgICAgICAnbW9tZW50LmxhbmdEYXRhIGlzIGRlcHJlY2F0ZWQuIFVzZSBtb21lbnQubG9jYWxlRGF0YSBpbnN0ZWFkLicsXG4gICAgICAgIGdldExvY2FsZVxuICAgICk7XG5cbiAgICB2YXIgbWF0aEFicyA9IE1hdGguYWJzO1xuXG4gICAgZnVuY3Rpb24gYWJzKCkge1xuICAgICAgICB2YXIgZGF0YSA9IHRoaXMuX2RhdGE7XG5cbiAgICAgICAgdGhpcy5fbWlsbGlzZWNvbmRzID0gbWF0aEFicyh0aGlzLl9taWxsaXNlY29uZHMpO1xuICAgICAgICB0aGlzLl9kYXlzID0gbWF0aEFicyh0aGlzLl9kYXlzKTtcbiAgICAgICAgdGhpcy5fbW9udGhzID0gbWF0aEFicyh0aGlzLl9tb250aHMpO1xuXG4gICAgICAgIGRhdGEubWlsbGlzZWNvbmRzID0gbWF0aEFicyhkYXRhLm1pbGxpc2Vjb25kcyk7XG4gICAgICAgIGRhdGEuc2Vjb25kcyA9IG1hdGhBYnMoZGF0YS5zZWNvbmRzKTtcbiAgICAgICAgZGF0YS5taW51dGVzID0gbWF0aEFicyhkYXRhLm1pbnV0ZXMpO1xuICAgICAgICBkYXRhLmhvdXJzID0gbWF0aEFicyhkYXRhLmhvdXJzKTtcbiAgICAgICAgZGF0YS5tb250aHMgPSBtYXRoQWJzKGRhdGEubW9udGhzKTtcbiAgICAgICAgZGF0YS55ZWFycyA9IG1hdGhBYnMoZGF0YS55ZWFycyk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkU3VidHJhY3QkMShkdXJhdGlvbiwgaW5wdXQsIHZhbHVlLCBkaXJlY3Rpb24pIHtcbiAgICAgICAgdmFyIG90aGVyID0gY3JlYXRlRHVyYXRpb24oaW5wdXQsIHZhbHVlKTtcblxuICAgICAgICBkdXJhdGlvbi5fbWlsbGlzZWNvbmRzICs9IGRpcmVjdGlvbiAqIG90aGVyLl9taWxsaXNlY29uZHM7XG4gICAgICAgIGR1cmF0aW9uLl9kYXlzICs9IGRpcmVjdGlvbiAqIG90aGVyLl9kYXlzO1xuICAgICAgICBkdXJhdGlvbi5fbW9udGhzICs9IGRpcmVjdGlvbiAqIG90aGVyLl9tb250aHM7XG5cbiAgICAgICAgcmV0dXJuIGR1cmF0aW9uLl9idWJibGUoKTtcbiAgICB9XG5cbiAgICAvLyBzdXBwb3J0cyBvbmx5IDIuMC1zdHlsZSBhZGQoMSwgJ3MnKSBvciBhZGQoZHVyYXRpb24pXG4gICAgZnVuY3Rpb24gYWRkJDEoaW5wdXQsIHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBhZGRTdWJ0cmFjdCQxKHRoaXMsIGlucHV0LCB2YWx1ZSwgMSk7XG4gICAgfVxuXG4gICAgLy8gc3VwcG9ydHMgb25seSAyLjAtc3R5bGUgc3VidHJhY3QoMSwgJ3MnKSBvciBzdWJ0cmFjdChkdXJhdGlvbilcbiAgICBmdW5jdGlvbiBzdWJ0cmFjdCQxKGlucHV0LCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4gYWRkU3VidHJhY3QkMSh0aGlzLCBpbnB1dCwgdmFsdWUsIC0xKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhYnNDZWlsKG51bWJlcikge1xuICAgICAgICBpZiAobnVtYmVyIDwgMCkge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IobnVtYmVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmNlaWwobnVtYmVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGJ1YmJsZSgpIHtcbiAgICAgICAgdmFyIG1pbGxpc2Vjb25kcyA9IHRoaXMuX21pbGxpc2Vjb25kcyxcbiAgICAgICAgICAgIGRheXMgPSB0aGlzLl9kYXlzLFxuICAgICAgICAgICAgbW9udGhzID0gdGhpcy5fbW9udGhzLFxuICAgICAgICAgICAgZGF0YSA9IHRoaXMuX2RhdGEsXG4gICAgICAgICAgICBzZWNvbmRzLFxuICAgICAgICAgICAgbWludXRlcyxcbiAgICAgICAgICAgIGhvdXJzLFxuICAgICAgICAgICAgeWVhcnMsXG4gICAgICAgICAgICBtb250aHNGcm9tRGF5cztcblxuICAgICAgICAvLyBpZiB3ZSBoYXZlIGEgbWl4IG9mIHBvc2l0aXZlIGFuZCBuZWdhdGl2ZSB2YWx1ZXMsIGJ1YmJsZSBkb3duIGZpcnN0XG4gICAgICAgIC8vIGNoZWNrOiBodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9pc3N1ZXMvMjE2NlxuICAgICAgICBpZiAoXG4gICAgICAgICAgICAhKFxuICAgICAgICAgICAgICAgIChtaWxsaXNlY29uZHMgPj0gMCAmJiBkYXlzID49IDAgJiYgbW9udGhzID49IDApIHx8XG4gICAgICAgICAgICAgICAgKG1pbGxpc2Vjb25kcyA8PSAwICYmIGRheXMgPD0gMCAmJiBtb250aHMgPD0gMClcbiAgICAgICAgICAgIClcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBtaWxsaXNlY29uZHMgKz0gYWJzQ2VpbChtb250aHNUb0RheXMobW9udGhzKSArIGRheXMpICogODY0ZTU7XG4gICAgICAgICAgICBkYXlzID0gMDtcbiAgICAgICAgICAgIG1vbnRocyA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaGUgZm9sbG93aW5nIGNvZGUgYnViYmxlcyB1cCB2YWx1ZXMsIHNlZSB0aGUgdGVzdHMgZm9yXG4gICAgICAgIC8vIGV4YW1wbGVzIG9mIHdoYXQgdGhhdCBtZWFucy5cbiAgICAgICAgZGF0YS5taWxsaXNlY29uZHMgPSBtaWxsaXNlY29uZHMgJSAxMDAwO1xuXG4gICAgICAgIHNlY29uZHMgPSBhYnNGbG9vcihtaWxsaXNlY29uZHMgLyAxMDAwKTtcbiAgICAgICAgZGF0YS5zZWNvbmRzID0gc2Vjb25kcyAlIDYwO1xuXG4gICAgICAgIG1pbnV0ZXMgPSBhYnNGbG9vcihzZWNvbmRzIC8gNjApO1xuICAgICAgICBkYXRhLm1pbnV0ZXMgPSBtaW51dGVzICUgNjA7XG5cbiAgICAgICAgaG91cnMgPSBhYnNGbG9vcihtaW51dGVzIC8gNjApO1xuICAgICAgICBkYXRhLmhvdXJzID0gaG91cnMgJSAyNDtcblxuICAgICAgICBkYXlzICs9IGFic0Zsb29yKGhvdXJzIC8gMjQpO1xuXG4gICAgICAgIC8vIGNvbnZlcnQgZGF5cyB0byBtb250aHNcbiAgICAgICAgbW9udGhzRnJvbURheXMgPSBhYnNGbG9vcihkYXlzVG9Nb250aHMoZGF5cykpO1xuICAgICAgICBtb250aHMgKz0gbW9udGhzRnJvbURheXM7XG4gICAgICAgIGRheXMgLT0gYWJzQ2VpbChtb250aHNUb0RheXMobW9udGhzRnJvbURheXMpKTtcblxuICAgICAgICAvLyAxMiBtb250aHMgLT4gMSB5ZWFyXG4gICAgICAgIHllYXJzID0gYWJzRmxvb3IobW9udGhzIC8gMTIpO1xuICAgICAgICBtb250aHMgJT0gMTI7XG5cbiAgICAgICAgZGF0YS5kYXlzID0gZGF5cztcbiAgICAgICAgZGF0YS5tb250aHMgPSBtb250aHM7XG4gICAgICAgIGRhdGEueWVhcnMgPSB5ZWFycztcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkYXlzVG9Nb250aHMoZGF5cykge1xuICAgICAgICAvLyA0MDAgeWVhcnMgaGF2ZSAxNDYwOTcgZGF5cyAodGFraW5nIGludG8gYWNjb3VudCBsZWFwIHllYXIgcnVsZXMpXG4gICAgICAgIC8vIDQwMCB5ZWFycyBoYXZlIDEyIG1vbnRocyA9PT0gNDgwMFxuICAgICAgICByZXR1cm4gKGRheXMgKiA0ODAwKSAvIDE0NjA5NztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtb250aHNUb0RheXMobW9udGhzKSB7XG4gICAgICAgIC8vIHRoZSByZXZlcnNlIG9mIGRheXNUb01vbnRoc1xuICAgICAgICByZXR1cm4gKG1vbnRocyAqIDE0NjA5NykgLyA0ODAwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFzKHVuaXRzKSB7XG4gICAgICAgIGlmICghdGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBOYU47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRheXMsXG4gICAgICAgICAgICBtb250aHMsXG4gICAgICAgICAgICBtaWxsaXNlY29uZHMgPSB0aGlzLl9taWxsaXNlY29uZHM7XG5cbiAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG5cbiAgICAgICAgaWYgKHVuaXRzID09PSAnbW9udGgnIHx8IHVuaXRzID09PSAncXVhcnRlcicgfHwgdW5pdHMgPT09ICd5ZWFyJykge1xuICAgICAgICAgICAgZGF5cyA9IHRoaXMuX2RheXMgKyBtaWxsaXNlY29uZHMgLyA4NjRlNTtcbiAgICAgICAgICAgIG1vbnRocyA9IHRoaXMuX21vbnRocyArIGRheXNUb01vbnRocyhkYXlzKTtcbiAgICAgICAgICAgIHN3aXRjaCAodW5pdHMpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdtb250aCc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtb250aHM7XG4gICAgICAgICAgICAgICAgY2FzZSAncXVhcnRlcic6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtb250aHMgLyAzO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3llYXInOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbW9udGhzIC8gMTI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBoYW5kbGUgbWlsbGlzZWNvbmRzIHNlcGFyYXRlbHkgYmVjYXVzZSBvZiBmbG9hdGluZyBwb2ludCBtYXRoIGVycm9ycyAoaXNzdWUgIzE4NjcpXG4gICAgICAgICAgICBkYXlzID0gdGhpcy5fZGF5cyArIE1hdGgucm91bmQobW9udGhzVG9EYXlzKHRoaXMuX21vbnRocykpO1xuICAgICAgICAgICAgc3dpdGNoICh1bml0cykge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3dlZWsnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF5cyAvIDcgKyBtaWxsaXNlY29uZHMgLyA2MDQ4ZTU7XG4gICAgICAgICAgICAgICAgY2FzZSAnZGF5JzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRheXMgKyBtaWxsaXNlY29uZHMgLyA4NjRlNTtcbiAgICAgICAgICAgICAgICBjYXNlICdob3VyJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRheXMgKiAyNCArIG1pbGxpc2Vjb25kcyAvIDM2ZTU7XG4gICAgICAgICAgICAgICAgY2FzZSAnbWludXRlJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRheXMgKiAxNDQwICsgbWlsbGlzZWNvbmRzIC8gNmU0O1xuICAgICAgICAgICAgICAgIGNhc2UgJ3NlY29uZCc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXlzICogODY0MDAgKyBtaWxsaXNlY29uZHMgLyAxMDAwO1xuICAgICAgICAgICAgICAgIC8vIE1hdGguZmxvb3IgcHJldmVudHMgZmxvYXRpbmcgcG9pbnQgbWF0aCBlcnJvcnMgaGVyZVxuICAgICAgICAgICAgICAgIGNhc2UgJ21pbGxpc2Vjb25kJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoZGF5cyAqIDg2NGU1KSArIG1pbGxpc2Vjb25kcztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gdW5pdCAnICsgdW5pdHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gVE9ETzogVXNlIHRoaXMuYXMoJ21zJyk/XG4gICAgZnVuY3Rpb24gdmFsdWVPZiQxKCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gTmFOO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICB0aGlzLl9taWxsaXNlY29uZHMgK1xuICAgICAgICAgICAgdGhpcy5fZGF5cyAqIDg2NGU1ICtcbiAgICAgICAgICAgICh0aGlzLl9tb250aHMgJSAxMikgKiAyNTkyZTYgK1xuICAgICAgICAgICAgdG9JbnQodGhpcy5fbW9udGhzIC8gMTIpICogMzE1MzZlNlxuICAgICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VBcyhhbGlhcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXMoYWxpYXMpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHZhciBhc01pbGxpc2Vjb25kcyA9IG1ha2VBcygnbXMnKSxcbiAgICAgICAgYXNTZWNvbmRzID0gbWFrZUFzKCdzJyksXG4gICAgICAgIGFzTWludXRlcyA9IG1ha2VBcygnbScpLFxuICAgICAgICBhc0hvdXJzID0gbWFrZUFzKCdoJyksXG4gICAgICAgIGFzRGF5cyA9IG1ha2VBcygnZCcpLFxuICAgICAgICBhc1dlZWtzID0gbWFrZUFzKCd3JyksXG4gICAgICAgIGFzTW9udGhzID0gbWFrZUFzKCdNJyksXG4gICAgICAgIGFzUXVhcnRlcnMgPSBtYWtlQXMoJ1EnKSxcbiAgICAgICAgYXNZZWFycyA9IG1ha2VBcygneScpO1xuXG4gICAgZnVuY3Rpb24gY2xvbmUkMSgpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUR1cmF0aW9uKHRoaXMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldCQyKHVuaXRzKSB7XG4gICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuICAgICAgICByZXR1cm4gdGhpcy5pc1ZhbGlkKCkgPyB0aGlzW3VuaXRzICsgJ3MnXSgpIDogTmFOO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VHZXR0ZXIobmFtZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXNWYWxpZCgpID8gdGhpcy5fZGF0YVtuYW1lXSA6IE5hTjtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgbWlsbGlzZWNvbmRzID0gbWFrZUdldHRlcignbWlsbGlzZWNvbmRzJyksXG4gICAgICAgIHNlY29uZHMgPSBtYWtlR2V0dGVyKCdzZWNvbmRzJyksXG4gICAgICAgIG1pbnV0ZXMgPSBtYWtlR2V0dGVyKCdtaW51dGVzJyksXG4gICAgICAgIGhvdXJzID0gbWFrZUdldHRlcignaG91cnMnKSxcbiAgICAgICAgZGF5cyA9IG1ha2VHZXR0ZXIoJ2RheXMnKSxcbiAgICAgICAgbW9udGhzID0gbWFrZUdldHRlcignbW9udGhzJyksXG4gICAgICAgIHllYXJzID0gbWFrZUdldHRlcigneWVhcnMnKTtcblxuICAgIGZ1bmN0aW9uIHdlZWtzKCkge1xuICAgICAgICByZXR1cm4gYWJzRmxvb3IodGhpcy5kYXlzKCkgLyA3KTtcbiAgICB9XG5cbiAgICB2YXIgcm91bmQgPSBNYXRoLnJvdW5kLFxuICAgICAgICB0aHJlc2hvbGRzID0ge1xuICAgICAgICAgICAgc3M6IDQ0LCAvLyBhIGZldyBzZWNvbmRzIHRvIHNlY29uZHNcbiAgICAgICAgICAgIHM6IDQ1LCAvLyBzZWNvbmRzIHRvIG1pbnV0ZVxuICAgICAgICAgICAgbTogNDUsIC8vIG1pbnV0ZXMgdG8gaG91clxuICAgICAgICAgICAgaDogMjIsIC8vIGhvdXJzIHRvIGRheVxuICAgICAgICAgICAgZDogMjYsIC8vIGRheXMgdG8gbW9udGgvd2Vla1xuICAgICAgICAgICAgdzogbnVsbCwgLy8gd2Vla3MgdG8gbW9udGhcbiAgICAgICAgICAgIE06IDExLCAvLyBtb250aHMgdG8geWVhclxuICAgICAgICB9O1xuXG4gICAgLy8gaGVscGVyIGZ1bmN0aW9uIGZvciBtb21lbnQuZm4uZnJvbSwgbW9tZW50LmZuLmZyb21Ob3csIGFuZCBtb21lbnQuZHVyYXRpb24uZm4uaHVtYW5pemVcbiAgICBmdW5jdGlvbiBzdWJzdGl0dXRlVGltZUFnbyhzdHJpbmcsIG51bWJlciwgd2l0aG91dFN1ZmZpeCwgaXNGdXR1cmUsIGxvY2FsZSkge1xuICAgICAgICByZXR1cm4gbG9jYWxlLnJlbGF0aXZlVGltZShudW1iZXIgfHwgMSwgISF3aXRob3V0U3VmZml4LCBzdHJpbmcsIGlzRnV0dXJlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZWxhdGl2ZVRpbWUkMShwb3NOZWdEdXJhdGlvbiwgd2l0aG91dFN1ZmZpeCwgdGhyZXNob2xkcywgbG9jYWxlKSB7XG4gICAgICAgIHZhciBkdXJhdGlvbiA9IGNyZWF0ZUR1cmF0aW9uKHBvc05lZ0R1cmF0aW9uKS5hYnMoKSxcbiAgICAgICAgICAgIHNlY29uZHMgPSByb3VuZChkdXJhdGlvbi5hcygncycpKSxcbiAgICAgICAgICAgIG1pbnV0ZXMgPSByb3VuZChkdXJhdGlvbi5hcygnbScpKSxcbiAgICAgICAgICAgIGhvdXJzID0gcm91bmQoZHVyYXRpb24uYXMoJ2gnKSksXG4gICAgICAgICAgICBkYXlzID0gcm91bmQoZHVyYXRpb24uYXMoJ2QnKSksXG4gICAgICAgICAgICBtb250aHMgPSByb3VuZChkdXJhdGlvbi5hcygnTScpKSxcbiAgICAgICAgICAgIHdlZWtzID0gcm91bmQoZHVyYXRpb24uYXMoJ3cnKSksXG4gICAgICAgICAgICB5ZWFycyA9IHJvdW5kKGR1cmF0aW9uLmFzKCd5JykpLFxuICAgICAgICAgICAgYSA9XG4gICAgICAgICAgICAgICAgKHNlY29uZHMgPD0gdGhyZXNob2xkcy5zcyAmJiBbJ3MnLCBzZWNvbmRzXSkgfHxcbiAgICAgICAgICAgICAgICAoc2Vjb25kcyA8IHRocmVzaG9sZHMucyAmJiBbJ3NzJywgc2Vjb25kc10pIHx8XG4gICAgICAgICAgICAgICAgKG1pbnV0ZXMgPD0gMSAmJiBbJ20nXSkgfHxcbiAgICAgICAgICAgICAgICAobWludXRlcyA8IHRocmVzaG9sZHMubSAmJiBbJ21tJywgbWludXRlc10pIHx8XG4gICAgICAgICAgICAgICAgKGhvdXJzIDw9IDEgJiYgWydoJ10pIHx8XG4gICAgICAgICAgICAgICAgKGhvdXJzIDwgdGhyZXNob2xkcy5oICYmIFsnaGgnLCBob3Vyc10pIHx8XG4gICAgICAgICAgICAgICAgKGRheXMgPD0gMSAmJiBbJ2QnXSkgfHxcbiAgICAgICAgICAgICAgICAoZGF5cyA8IHRocmVzaG9sZHMuZCAmJiBbJ2RkJywgZGF5c10pO1xuXG4gICAgICAgIGlmICh0aHJlc2hvbGRzLncgIT0gbnVsbCkge1xuICAgICAgICAgICAgYSA9XG4gICAgICAgICAgICAgICAgYSB8fFxuICAgICAgICAgICAgICAgICh3ZWVrcyA8PSAxICYmIFsndyddKSB8fFxuICAgICAgICAgICAgICAgICh3ZWVrcyA8IHRocmVzaG9sZHMudyAmJiBbJ3d3Jywgd2Vla3NdKTtcbiAgICAgICAgfVxuICAgICAgICBhID0gYSB8fFxuICAgICAgICAgICAgKG1vbnRocyA8PSAxICYmIFsnTSddKSB8fFxuICAgICAgICAgICAgKG1vbnRocyA8IHRocmVzaG9sZHMuTSAmJiBbJ01NJywgbW9udGhzXSkgfHxcbiAgICAgICAgICAgICh5ZWFycyA8PSAxICYmIFsneSddKSB8fCBbJ3l5JywgeWVhcnNdO1xuXG4gICAgICAgIGFbMl0gPSB3aXRob3V0U3VmZml4O1xuICAgICAgICBhWzNdID0gK3Bvc05lZ0R1cmF0aW9uID4gMDtcbiAgICAgICAgYVs0XSA9IGxvY2FsZTtcbiAgICAgICAgcmV0dXJuIHN1YnN0aXR1dGVUaW1lQWdvLmFwcGx5KG51bGwsIGEpO1xuICAgIH1cblxuICAgIC8vIFRoaXMgZnVuY3Rpb24gYWxsb3dzIHlvdSB0byBzZXQgdGhlIHJvdW5kaW5nIGZ1bmN0aW9uIGZvciByZWxhdGl2ZSB0aW1lIHN0cmluZ3NcbiAgICBmdW5jdGlvbiBnZXRTZXRSZWxhdGl2ZVRpbWVSb3VuZGluZyhyb3VuZGluZ0Z1bmN0aW9uKSB7XG4gICAgICAgIGlmIChyb3VuZGluZ0Z1bmN0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiByb3VuZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIHJvdW5kaW5nRnVuY3Rpb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHJvdW5kID0gcm91bmRpbmdGdW5jdGlvbjtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIGFsbG93cyB5b3UgdG8gc2V0IGEgdGhyZXNob2xkIGZvciByZWxhdGl2ZSB0aW1lIHN0cmluZ3NcbiAgICBmdW5jdGlvbiBnZXRTZXRSZWxhdGl2ZVRpbWVUaHJlc2hvbGQodGhyZXNob2xkLCBsaW1pdCkge1xuICAgICAgICBpZiAodGhyZXNob2xkc1t0aHJlc2hvbGRdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobGltaXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRocmVzaG9sZHNbdGhyZXNob2xkXTtcbiAgICAgICAgfVxuICAgICAgICB0aHJlc2hvbGRzW3RocmVzaG9sZF0gPSBsaW1pdDtcbiAgICAgICAgaWYgKHRocmVzaG9sZCA9PT0gJ3MnKSB7XG4gICAgICAgICAgICB0aHJlc2hvbGRzLnNzID0gbGltaXQgLSAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGh1bWFuaXplKGFyZ1dpdGhTdWZmaXgsIGFyZ1RocmVzaG9sZHMpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLmludmFsaWREYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgd2l0aFN1ZmZpeCA9IGZhbHNlLFxuICAgICAgICAgICAgdGggPSB0aHJlc2hvbGRzLFxuICAgICAgICAgICAgbG9jYWxlLFxuICAgICAgICAgICAgb3V0cHV0O1xuXG4gICAgICAgIGlmICh0eXBlb2YgYXJnV2l0aFN1ZmZpeCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGFyZ1RocmVzaG9sZHMgPSBhcmdXaXRoU3VmZml4O1xuICAgICAgICAgICAgYXJnV2l0aFN1ZmZpeCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgYXJnV2l0aFN1ZmZpeCA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICB3aXRoU3VmZml4ID0gYXJnV2l0aFN1ZmZpeDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGFyZ1RocmVzaG9sZHMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICB0aCA9IE9iamVjdC5hc3NpZ24oe30sIHRocmVzaG9sZHMsIGFyZ1RocmVzaG9sZHMpO1xuICAgICAgICAgICAgaWYgKGFyZ1RocmVzaG9sZHMucyAhPSBudWxsICYmIGFyZ1RocmVzaG9sZHMuc3MgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoLnNzID0gYXJnVGhyZXNob2xkcy5zIC0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxvY2FsZSA9IHRoaXMubG9jYWxlRGF0YSgpO1xuICAgICAgICBvdXRwdXQgPSByZWxhdGl2ZVRpbWUkMSh0aGlzLCAhd2l0aFN1ZmZpeCwgdGgsIGxvY2FsZSk7XG5cbiAgICAgICAgaWYgKHdpdGhTdWZmaXgpIHtcbiAgICAgICAgICAgIG91dHB1dCA9IGxvY2FsZS5wYXN0RnV0dXJlKCt0aGlzLCBvdXRwdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxvY2FsZS5wb3N0Zm9ybWF0KG91dHB1dCk7XG4gICAgfVxuXG4gICAgdmFyIGFicyQxID0gTWF0aC5hYnM7XG5cbiAgICBmdW5jdGlvbiBzaWduKHgpIHtcbiAgICAgICAgcmV0dXJuICh4ID4gMCkgLSAoeCA8IDApIHx8ICt4O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvSVNPU3RyaW5nJDEoKSB7XG4gICAgICAgIC8vIGZvciBJU08gc3RyaW5ncyB3ZSBkbyBub3QgdXNlIHRoZSBub3JtYWwgYnViYmxpbmcgcnVsZXM6XG4gICAgICAgIC8vICAqIG1pbGxpc2Vjb25kcyBidWJibGUgdXAgdW50aWwgdGhleSBiZWNvbWUgaG91cnNcbiAgICAgICAgLy8gICogZGF5cyBkbyBub3QgYnViYmxlIGF0IGFsbFxuICAgICAgICAvLyAgKiBtb250aHMgYnViYmxlIHVwIHVudGlsIHRoZXkgYmVjb21lIHllYXJzXG4gICAgICAgIC8vIFRoaXMgaXMgYmVjYXVzZSB0aGVyZSBpcyBubyBjb250ZXh0LWZyZWUgY29udmVyc2lvbiBiZXR3ZWVuIGhvdXJzIGFuZCBkYXlzXG4gICAgICAgIC8vICh0aGluayBvZiBjbG9jayBjaGFuZ2VzKVxuICAgICAgICAvLyBhbmQgYWxzbyBub3QgYmV0d2VlbiBkYXlzIGFuZCBtb250aHMgKDI4LTMxIGRheXMgcGVyIG1vbnRoKVxuICAgICAgICBpZiAoIXRoaXMuaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkuaW52YWxpZERhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzZWNvbmRzID0gYWJzJDEodGhpcy5fbWlsbGlzZWNvbmRzKSAvIDEwMDAsXG4gICAgICAgICAgICBkYXlzID0gYWJzJDEodGhpcy5fZGF5cyksXG4gICAgICAgICAgICBtb250aHMgPSBhYnMkMSh0aGlzLl9tb250aHMpLFxuICAgICAgICAgICAgbWludXRlcyxcbiAgICAgICAgICAgIGhvdXJzLFxuICAgICAgICAgICAgeWVhcnMsXG4gICAgICAgICAgICBzLFxuICAgICAgICAgICAgdG90YWwgPSB0aGlzLmFzU2Vjb25kcygpLFxuICAgICAgICAgICAgdG90YWxTaWduLFxuICAgICAgICAgICAgeW1TaWduLFxuICAgICAgICAgICAgZGF5c1NpZ24sXG4gICAgICAgICAgICBobXNTaWduO1xuXG4gICAgICAgIGlmICghdG90YWwpIHtcbiAgICAgICAgICAgIC8vIHRoaXMgaXMgdGhlIHNhbWUgYXMgQyMncyAoTm9kYSkgYW5kIHB5dGhvbiAoaXNvZGF0ZSkuLi5cbiAgICAgICAgICAgIC8vIGJ1dCBub3Qgb3RoZXIgSlMgKGdvb2cuZGF0ZSlcbiAgICAgICAgICAgIHJldHVybiAnUDBEJztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDM2MDAgc2Vjb25kcyAtPiA2MCBtaW51dGVzIC0+IDEgaG91clxuICAgICAgICBtaW51dGVzID0gYWJzRmxvb3Ioc2Vjb25kcyAvIDYwKTtcbiAgICAgICAgaG91cnMgPSBhYnNGbG9vcihtaW51dGVzIC8gNjApO1xuICAgICAgICBzZWNvbmRzICU9IDYwO1xuICAgICAgICBtaW51dGVzICU9IDYwO1xuXG4gICAgICAgIC8vIDEyIG1vbnRocyAtPiAxIHllYXJcbiAgICAgICAgeWVhcnMgPSBhYnNGbG9vcihtb250aHMgLyAxMik7XG4gICAgICAgIG1vbnRocyAlPSAxMjtcblxuICAgICAgICAvLyBpbnNwaXJlZCBieSBodHRwczovL2dpdGh1Yi5jb20vZG9yZGlsbGUvbW9tZW50LWlzb2R1cmF0aW9uL2Jsb2IvbWFzdGVyL21vbWVudC5pc29kdXJhdGlvbi5qc1xuICAgICAgICBzID0gc2Vjb25kcyA/IHNlY29uZHMudG9GaXhlZCgzKS5yZXBsYWNlKC9cXC4/MCskLywgJycpIDogJyc7XG5cbiAgICAgICAgdG90YWxTaWduID0gdG90YWwgPCAwID8gJy0nIDogJyc7XG4gICAgICAgIHltU2lnbiA9IHNpZ24odGhpcy5fbW9udGhzKSAhPT0gc2lnbih0b3RhbCkgPyAnLScgOiAnJztcbiAgICAgICAgZGF5c1NpZ24gPSBzaWduKHRoaXMuX2RheXMpICE9PSBzaWduKHRvdGFsKSA/ICctJyA6ICcnO1xuICAgICAgICBobXNTaWduID0gc2lnbih0aGlzLl9taWxsaXNlY29uZHMpICE9PSBzaWduKHRvdGFsKSA/ICctJyA6ICcnO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICB0b3RhbFNpZ24gK1xuICAgICAgICAgICAgJ1AnICtcbiAgICAgICAgICAgICh5ZWFycyA/IHltU2lnbiArIHllYXJzICsgJ1knIDogJycpICtcbiAgICAgICAgICAgIChtb250aHMgPyB5bVNpZ24gKyBtb250aHMgKyAnTScgOiAnJykgK1xuICAgICAgICAgICAgKGRheXMgPyBkYXlzU2lnbiArIGRheXMgKyAnRCcgOiAnJykgK1xuICAgICAgICAgICAgKGhvdXJzIHx8IG1pbnV0ZXMgfHwgc2Vjb25kcyA/ICdUJyA6ICcnKSArXG4gICAgICAgICAgICAoaG91cnMgPyBobXNTaWduICsgaG91cnMgKyAnSCcgOiAnJykgK1xuICAgICAgICAgICAgKG1pbnV0ZXMgPyBobXNTaWduICsgbWludXRlcyArICdNJyA6ICcnKSArXG4gICAgICAgICAgICAoc2Vjb25kcyA/IGhtc1NpZ24gKyBzICsgJ1MnIDogJycpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgdmFyIHByb3RvJDIgPSBEdXJhdGlvbi5wcm90b3R5cGU7XG5cbiAgICBwcm90byQyLmlzVmFsaWQgPSBpc1ZhbGlkJDE7XG4gICAgcHJvdG8kMi5hYnMgPSBhYnM7XG4gICAgcHJvdG8kMi5hZGQgPSBhZGQkMTtcbiAgICBwcm90byQyLnN1YnRyYWN0ID0gc3VidHJhY3QkMTtcbiAgICBwcm90byQyLmFzID0gYXM7XG4gICAgcHJvdG8kMi5hc01pbGxpc2Vjb25kcyA9IGFzTWlsbGlzZWNvbmRzO1xuICAgIHByb3RvJDIuYXNTZWNvbmRzID0gYXNTZWNvbmRzO1xuICAgIHByb3RvJDIuYXNNaW51dGVzID0gYXNNaW51dGVzO1xuICAgIHByb3RvJDIuYXNIb3VycyA9IGFzSG91cnM7XG4gICAgcHJvdG8kMi5hc0RheXMgPSBhc0RheXM7XG4gICAgcHJvdG8kMi5hc1dlZWtzID0gYXNXZWVrcztcbiAgICBwcm90byQyLmFzTW9udGhzID0gYXNNb250aHM7XG4gICAgcHJvdG8kMi5hc1F1YXJ0ZXJzID0gYXNRdWFydGVycztcbiAgICBwcm90byQyLmFzWWVhcnMgPSBhc1llYXJzO1xuICAgIHByb3RvJDIudmFsdWVPZiA9IHZhbHVlT2YkMTtcbiAgICBwcm90byQyLl9idWJibGUgPSBidWJibGU7XG4gICAgcHJvdG8kMi5jbG9uZSA9IGNsb25lJDE7XG4gICAgcHJvdG8kMi5nZXQgPSBnZXQkMjtcbiAgICBwcm90byQyLm1pbGxpc2Vjb25kcyA9IG1pbGxpc2Vjb25kcztcbiAgICBwcm90byQyLnNlY29uZHMgPSBzZWNvbmRzO1xuICAgIHByb3RvJDIubWludXRlcyA9IG1pbnV0ZXM7XG4gICAgcHJvdG8kMi5ob3VycyA9IGhvdXJzO1xuICAgIHByb3RvJDIuZGF5cyA9IGRheXM7XG4gICAgcHJvdG8kMi53ZWVrcyA9IHdlZWtzO1xuICAgIHByb3RvJDIubW9udGhzID0gbW9udGhzO1xuICAgIHByb3RvJDIueWVhcnMgPSB5ZWFycztcbiAgICBwcm90byQyLmh1bWFuaXplID0gaHVtYW5pemU7XG4gICAgcHJvdG8kMi50b0lTT1N0cmluZyA9IHRvSVNPU3RyaW5nJDE7XG4gICAgcHJvdG8kMi50b1N0cmluZyA9IHRvSVNPU3RyaW5nJDE7XG4gICAgcHJvdG8kMi50b0pTT04gPSB0b0lTT1N0cmluZyQxO1xuICAgIHByb3RvJDIubG9jYWxlID0gbG9jYWxlO1xuICAgIHByb3RvJDIubG9jYWxlRGF0YSA9IGxvY2FsZURhdGE7XG5cbiAgICBwcm90byQyLnRvSXNvU3RyaW5nID0gZGVwcmVjYXRlKFxuICAgICAgICAndG9Jc29TdHJpbmcoKSBpcyBkZXByZWNhdGVkLiBQbGVhc2UgdXNlIHRvSVNPU3RyaW5nKCkgaW5zdGVhZCAobm90aWNlIHRoZSBjYXBpdGFscyknLFxuICAgICAgICB0b0lTT1N0cmluZyQxXG4gICAgKTtcbiAgICBwcm90byQyLmxhbmcgPSBsYW5nO1xuXG4gICAgLy8gRk9STUFUVElOR1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ1gnLCAwLCAwLCAndW5peCcpO1xuICAgIGFkZEZvcm1hdFRva2VuKCd4JywgMCwgMCwgJ3ZhbHVlT2YnKTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ3gnLCBtYXRjaFNpZ25lZCk7XG4gICAgYWRkUmVnZXhUb2tlbignWCcsIG1hdGNoVGltZXN0YW1wKTtcbiAgICBhZGRQYXJzZVRva2VuKCdYJywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKHBhcnNlRmxvYXQoaW5wdXQpICogMTAwMCk7XG4gICAgfSk7XG4gICAgYWRkUGFyc2VUb2tlbigneCcsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZSh0b0ludChpbnB1dCkpO1xuICAgIH0pO1xuXG4gICAgLy8hIG1vbWVudC5qc1xuXG4gICAgaG9va3MudmVyc2lvbiA9ICcyLjI5LjEnO1xuXG4gICAgc2V0SG9va0NhbGxiYWNrKGNyZWF0ZUxvY2FsKTtcblxuICAgIGhvb2tzLmZuID0gcHJvdG87XG4gICAgaG9va3MubWluID0gbWluO1xuICAgIGhvb2tzLm1heCA9IG1heDtcbiAgICBob29rcy5ub3cgPSBub3c7XG4gICAgaG9va3MudXRjID0gY3JlYXRlVVRDO1xuICAgIGhvb2tzLnVuaXggPSBjcmVhdGVVbml4O1xuICAgIGhvb2tzLm1vbnRocyA9IGxpc3RNb250aHM7XG4gICAgaG9va3MuaXNEYXRlID0gaXNEYXRlO1xuICAgIGhvb2tzLmxvY2FsZSA9IGdldFNldEdsb2JhbExvY2FsZTtcbiAgICBob29rcy5pbnZhbGlkID0gY3JlYXRlSW52YWxpZDtcbiAgICBob29rcy5kdXJhdGlvbiA9IGNyZWF0ZUR1cmF0aW9uO1xuICAgIGhvb2tzLmlzTW9tZW50ID0gaXNNb21lbnQ7XG4gICAgaG9va3Mud2Vla2RheXMgPSBsaXN0V2Vla2RheXM7XG4gICAgaG9va3MucGFyc2Vab25lID0gY3JlYXRlSW5ab25lO1xuICAgIGhvb2tzLmxvY2FsZURhdGEgPSBnZXRMb2NhbGU7XG4gICAgaG9va3MuaXNEdXJhdGlvbiA9IGlzRHVyYXRpb247XG4gICAgaG9va3MubW9udGhzU2hvcnQgPSBsaXN0TW9udGhzU2hvcnQ7XG4gICAgaG9va3Mud2Vla2RheXNNaW4gPSBsaXN0V2Vla2RheXNNaW47XG4gICAgaG9va3MuZGVmaW5lTG9jYWxlID0gZGVmaW5lTG9jYWxlO1xuICAgIGhvb2tzLnVwZGF0ZUxvY2FsZSA9IHVwZGF0ZUxvY2FsZTtcbiAgICBob29rcy5sb2NhbGVzID0gbGlzdExvY2FsZXM7XG4gICAgaG9va3Mud2Vla2RheXNTaG9ydCA9IGxpc3RXZWVrZGF5c1Nob3J0O1xuICAgIGhvb2tzLm5vcm1hbGl6ZVVuaXRzID0gbm9ybWFsaXplVW5pdHM7XG4gICAgaG9va3MucmVsYXRpdmVUaW1lUm91bmRpbmcgPSBnZXRTZXRSZWxhdGl2ZVRpbWVSb3VuZGluZztcbiAgICBob29rcy5yZWxhdGl2ZVRpbWVUaHJlc2hvbGQgPSBnZXRTZXRSZWxhdGl2ZVRpbWVUaHJlc2hvbGQ7XG4gICAgaG9va3MuY2FsZW5kYXJGb3JtYXQgPSBnZXRDYWxlbmRhckZvcm1hdDtcbiAgICBob29rcy5wcm90b3R5cGUgPSBwcm90bztcblxuICAgIC8vIGN1cnJlbnRseSBIVE1MNSBpbnB1dCB0eXBlIG9ubHkgc3VwcG9ydHMgMjQtaG91ciBmb3JtYXRzXG4gICAgaG9va3MuSFRNTDVfRk1UID0ge1xuICAgICAgICBEQVRFVElNRV9MT0NBTDogJ1lZWVktTU0tRERUSEg6bW0nLCAvLyA8aW5wdXQgdHlwZT1cImRhdGV0aW1lLWxvY2FsXCIgLz5cbiAgICAgICAgREFURVRJTUVfTE9DQUxfU0VDT05EUzogJ1lZWVktTU0tRERUSEg6bW06c3MnLCAvLyA8aW5wdXQgdHlwZT1cImRhdGV0aW1lLWxvY2FsXCIgc3RlcD1cIjFcIiAvPlxuICAgICAgICBEQVRFVElNRV9MT0NBTF9NUzogJ1lZWVktTU0tRERUSEg6bW06c3MuU1NTJywgLy8gPGlucHV0IHR5cGU9XCJkYXRldGltZS1sb2NhbFwiIHN0ZXA9XCIwLjAwMVwiIC8+XG4gICAgICAgIERBVEU6ICdZWVlZLU1NLUREJywgLy8gPGlucHV0IHR5cGU9XCJkYXRlXCIgLz5cbiAgICAgICAgVElNRTogJ0hIOm1tJywgLy8gPGlucHV0IHR5cGU9XCJ0aW1lXCIgLz5cbiAgICAgICAgVElNRV9TRUNPTkRTOiAnSEg6bW06c3MnLCAvLyA8aW5wdXQgdHlwZT1cInRpbWVcIiBzdGVwPVwiMVwiIC8+XG4gICAgICAgIFRJTUVfTVM6ICdISDptbTpzcy5TU1MnLCAvLyA8aW5wdXQgdHlwZT1cInRpbWVcIiBzdGVwPVwiMC4wMDFcIiAvPlxuICAgICAgICBXRUVLOiAnR0dHRy1bV11XVycsIC8vIDxpbnB1dCB0eXBlPVwid2Vla1wiIC8+XG4gICAgICAgIE1PTlRIOiAnWVlZWS1NTScsIC8vIDxpbnB1dCB0eXBlPVwibW9udGhcIiAvPlxuICAgIH07XG5cbiAgICByZXR1cm4gaG9va3M7XG5cbn0pKSk7XG4iLCJpbXBvcnQgeyBERUZBVUxUX0RBVEVfRk9STUFULCBEQVRFX1JFR0VYIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNb21lbnREYXRlUmVnZXgge1xuICAgIHJlcGxhY2UoaW5wdXQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIC8vQSByZWdleCB0byBjYXB0dXJlIG11bHRpcGxlIG1hdGNoZXMsIGVhY2ggd2l0aCBhIHRhcmdldCBncm91cCAoe2RhdGU6WVlNTUREfSkgYW5kIGRhdGUgZ3JvdXAgKFlZTU1ERClcbiAgICAgICAgY29uc3QgZGF0ZVJlZ2V4ID0gREFURV9SRUdFWDtcbiAgICAgICAgY29uc3QgY3VzdG9tRm9sZGVyU3RyaW5nID0gaW5wdXQ7XG4gICAgICAgIC8vSXRlcmF0ZSB0aHJvdWdoIHRoZSBtYXRjaGVzIHRvIGNvbGxlY3QgdGhlbSBpbiBhIHNpbmdsZSBhcnJheVxuICAgICAgICBjb25zdCBtYXRjaGVzID0gW107XG4gICAgICAgIGxldCBtYXRjaDtcbiAgICAgICAgd2hpbGUobWF0Y2ggPSBkYXRlUmVnZXguZXhlYyhjdXN0b21Gb2xkZXJTdHJpbmcpKXtcbiAgICAgICAgICBtYXRjaGVzLnB1c2gobWF0Y2gpXG4gICAgICAgIH1cbiAgICAgICAgLy9SZXR1cm4gdGhlIGN1c3RvbSBmb2xkZXIgc2V0dGluZyB2YWx1ZSBpZiBubyBkYXRlcyBhcmUgZm91bmRcbiAgICAgICAgaWYoIW1hdGNoZXMgfHwgbWF0Y2hlcy5sZW5ndGggPT09IDApe1xuICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAvL1RyYW5zZm9ybSBkYXRlIG1hdGNoZXMgaW50byBtb21lbnQgZm9ybWF0dGVkIGRhdGVzXG4gICAgICAgIGNvbnN0IGZvcm1hdHRlZERhdGVzID0gbWF0Y2hlcy5tYXAobSA9PiB7XG4gICAgICAgICAgLy9EZWZhdWx0IHRvIFlZWVlNTURESEhtbSBpZiB7e2RhdGV9fSBpcyB1c2VkXG4gICAgICAgICAgY29uc3QgZGF0ZUZvcm1hdCA9IG0uZ3JvdXBzLmRhdGUgPT09ICcnID8gREVGQVVMVF9EQVRFX0ZPUk1BVCA6IG0uZ3JvdXBzLmRhdGU7XG4gICAgICAgICAgcmV0dXJuIFttLmdyb3Vwcy50YXJnZXQsIFxuICAgICAgICAgICAgdGhpcy5nZXRNb21lbnQobm93LCBkYXRlRm9ybWF0KV07XG4gICAgICAgIH0pO1xuICAgIFxuICAgICAgICAvL0NoZWNrIHRvIHNlZSBpZiBhbnkgZGF0ZSBmb3JtYXR0aW5nIGlzIG5lZWRlZC4gSWYgbm90IHJldHVybiB0aGUgdW5mb3JtYXR0ZWQgc2V0dGluZyB0ZXh0LlxuICAgICAgICBsZXQgb3V0cHV0ID0gY3VzdG9tRm9sZGVyU3RyaW5nO1xuICAgICAgICBmb3JtYXR0ZWREYXRlcy5mb3JFYWNoKGZkID0+IHtcbiAgICAgICAgICBvdXRwdXQgPSBvdXRwdXQucmVwbGFjZShmZFswXSwgZmRbMV0pO1xuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgfVxuXG4gICAgICBnZXRNb21lbnQobm93OiBEYXRlLCBkYXRlRm9ybWF0OiBzdHJpbmcpIHtcbiAgICAgICAgaWYoKHdpbmRvdyBhcyBhbnkpLm1vbWVudCkge1xuICAgICAgICAgIHJldHVybiAod2luZG93IGFzIGFueSlcbiAgICAgICAgICAubW9tZW50KG5vdylcbiAgICAgICAgICAgIC5mb3JtYXQoZGF0ZUZvcm1hdClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gbW9tZW50KG5vdykuZm9ybWF0KGRhdGVGb3JtYXQpO1xuICAgICAgICB9XG4gICAgICB9XG59IiwiaW1wb3J0IHtcbiAgICBBcHAsXG4gICAgUGx1Z2luU2V0dGluZ1RhYixcbiAgICBTZXR0aW5nXG59IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCB7IERheVBsYW5uZXJNb2RlIH1mcm9tICcuL3NldHRpbmdzJztcbmltcG9ydCBNb21lbnREYXRlUmVnZXggZnJvbSAnLi9tb21lbnQtZGF0ZS1yZWdleCc7XG5pbXBvcnQgdHlwZSBEYXlQbGFubmVyIGZyb20gJy4vbWFpbic7XG4gIFxuICBleHBvcnQgY2xhc3MgRGF5UGxhbm5lclNldHRpbmdzVGFiIGV4dGVuZHMgUGx1Z2luU2V0dGluZ1RhYiB7XG4gICAgbW9tZW50RGF0ZVJlZ2V4ID0gbmV3IE1vbWVudERhdGVSZWdleCgpO1xuICAgIHBsdWdpbjogRGF5UGxhbm5lcjtcbiAgICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcGx1Z2luOiBEYXlQbGFubmVyKSB7XG4gICAgICBzdXBlcihhcHAsIHBsdWdpbik7XG4gICAgICB0aGlzLnBsdWdpbiA9IHBsdWdpbjtcbiAgfVxuICBcbiAgICBkaXNwbGF5KCk6IHZvaWQge1xuICAgICAgY29uc3QgeyBjb250YWluZXJFbCB9ID0gdGhpcztcbiAgXG4gICAgICBjb250YWluZXJFbC5lbXB0eSgpO1xuXG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgLnNldE5hbWUoJ0RheSBQbGFubmVyIE1vZGUnKVxuICAgICAgICAuc2V0RGVzYyh0aGlzLm1vZGVEZXNjcmlwdGlvbkNvbnRlbnQoKSlcbiAgICAgICAgLmFkZERyb3Bkb3duKGRyb3BEb3duID0+IFxuICAgICAgICAgIGRyb3BEb3duXG4gICAgICAgICAgICAuYWRkT3B0aW9uKERheVBsYW5uZXJNb2RlW0RheVBsYW5uZXJNb2RlLkZpbGVdLCBcIkZpbGUgbW9kZVwiKVxuICAgICAgICAgICAgLmFkZE9wdGlvbihEYXlQbGFubmVyTW9kZVtEYXlQbGFubmVyTW9kZS5Db21tYW5kXSwgXCJDb21tYW5kIG1vZGVcIilcbiAgICAgICAgICAgIC5zZXRWYWx1ZShEYXlQbGFubmVyTW9kZVt0aGlzLnBsdWdpbi5zZXR0aW5ncy5tb2RlXSB8fCBEYXlQbGFubmVyTW9kZS5GaWxlLnRvU3RyaW5nKCkpXG4gICAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlOnN0cmluZykgPT4ge1xuICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5tb2RlID0gRGF5UGxhbm5lck1vZGVbdmFsdWUgYXMga2V5b2YgdHlwZW9mIERheVBsYW5uZXJNb2RlXTtcbiAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZURhdGEodGhpcy5wbHVnaW4uc2V0dGluZ3MpO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgLnNldE5hbWUoJ0NvbXBsZXRlIHBhc3QgcGxhbm5lciBpdGVtcycpXG4gICAgICAgIC5zZXREZXNjKCdUaGUgcGx1Z2luIHdpbGwgYXV0b21hdGljYWxseSBtYXJrIGNoZWNrYm94ZXMgZm9yIHRhc2tzIGFuZCBicmVha3MgaW4gdGhlIHBhc3QgYXMgY29tcGxldGUnKVxuICAgICAgICAuYWRkVG9nZ2xlKHRvZ2dsZSA9PiBcbiAgICAgICAgICB0b2dnbGVcbiAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5jb21wbGV0ZVBhc3RJdGVtcylcbiAgICAgICAgICAgIC5vbkNoYW5nZSgodmFsdWU6Ym9vbGVhbikgPT4ge1xuICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5jb21wbGV0ZVBhc3RJdGVtcyA9IHZhbHVlO1xuICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlRGF0YSh0aGlzLnBsdWdpbi5zZXR0aW5ncyk7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAuc2V0TmFtZSgnTWVybWFpZCBHYW50dCcpXG4gICAgICAgIC5zZXREZXNjKCdJbmNsdWRlIGEgbWVybWFpZCBnYW50dCBjaGFydCBnZW5lcmF0ZWQgZm9yIHRoZSBkYXkgcGxhbm5lcicpXG4gICAgICAgIC5hZGRUb2dnbGUodG9nZ2xlID0+IFxuICAgICAgICAgIHRvZ2dsZVxuICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLm1lcm1haWQpXG4gICAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlOmJvb2xlYW4pID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MubWVybWFpZCA9IHZhbHVlO1xuICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlRGF0YSh0aGlzLnBsdWdpbi5zZXR0aW5ncyk7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAuc2V0TmFtZSgnU3RhdHVzIEJhciAtIENpcmN1bGFyIFByb2dyZXNzJylcbiAgICAgICAgLnNldERlc2MoJ0Rpc3BsYXkgYSBjaXJjdWxhciBwcm9ncmVzcyBiYXIgaW4gdGhlIHN0YXR1cyBiYXInKVxuICAgICAgICAuYWRkVG9nZ2xlKHRvZ2dsZSA9PiBcbiAgICAgICAgICB0b2dnbGVcbiAgICAgICAgICAgIC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5jaXJjdWxhclByb2dyZXNzKVxuICAgICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZTpib29sZWFuKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNldHRpbmdzLmNpcmN1bGFyUHJvZ3Jlc3MgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2F2ZURhdGEodGhpcy5wbHVnaW4uc2V0dGluZ3MpO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAuc2V0TmFtZSgnU3RhdHVzIEJhciAtIE5vdyBhbmQgTmV4dCcpXG4gICAgICAgICAgLnNldERlc2MoJ0Rpc3BsYXkgbm93IGFuZCBuZXh0IHRhc2tzIGluIHRoZSBzdGF0dXMgYmFyJylcbiAgICAgICAgICAuYWRkVG9nZ2xlKHRvZ2dsZSA9PiBcbiAgICAgICAgICAgIHRvZ2dsZVxuICAgICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3Mubm93QW5kTmV4dEluU3RhdHVzQmFyKVxuICAgICAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlOmJvb2xlYW4pID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5ub3dBbmROZXh0SW5TdGF0dXNCYXIgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zYXZlRGF0YSh0aGlzLnBsdWdpbi5zZXR0aW5ncyk7XG4gICAgICAgICAgICAgIH0pKTtcblxuICAgICAgbmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG4gICAgICAgICAgLnNldE5hbWUoJ1Rhc2sgTm90aWZpY2F0aW9uJylcbiAgICAgICAgICAuc2V0RGVzYygnRGlzcGxheSBhIG5vdGlmaWNhdGlvbiB3aGVuIGEgbmV3IHRhc2sgaXMgc3RhcnRlZCcpXG4gICAgICAgICAgLmFkZFRvZ2dsZSh0b2dnbGUgPT4gXG4gICAgICAgICAgICB0b2dnbGVcbiAgICAgICAgICAgICAgLnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnNob3dUYXNrTm90aWZpY2F0aW9uKVxuICAgICAgICAgICAgICAub25DaGFuZ2UoKHZhbHVlOmJvb2xlYW4pID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy5zaG93VGFza05vdGlmaWNhdGlvbiA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVEYXRhKHRoaXMucGx1Z2luLnNldHRpbmdzKTtcbiAgICAgICAgICAgICAgfSkpO1xuXG4gICAgICBuZXcgU2V0dGluZyhjb250YWluZXJFbClcbiAgICAgICAgICAuc2V0TmFtZSgnVGltZWxpbmUgWm9vbSBMZXZlbCcpXG4gICAgICAgICAgLnNldERlc2MoJ1RoZSB6b29tIGxldmVsIHRvIGRpc3BsYXkgdGhlIHRpbWVsaW5lLiBUaGUgbGFyZ2VyLCB0aGUgaGlnaGVyIHRoZSB6b29tIGxldmVsLicpXG4gICAgICAgICAgLmFkZFNsaWRlcihzbGlkZXIgPT4gXG4gICAgICAgICAgICBzbGlkZXJcbiAgICAgICAgICAgICAgLnNldExpbWl0cygxLCA1LCAxKVxuICAgICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MudGltZWxpbmVab29tTGV2ZWwgPz8gNClcbiAgICAgICAgICAgICAgLnNldER5bmFtaWNUb29sdGlwKClcbiAgICAgICAgICAgICAgLm9uQ2hhbmdlKCh2YWx1ZTpudW1iZXIpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5zZXR0aW5ncy50aW1lbGluZVpvb21MZXZlbCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnNhdmVEYXRhKHRoaXMucGx1Z2luLnNldHRpbmdzKTtcbiAgICAgICAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgbW9kZURlc2NyaXB0aW9uQ29udGVudCgpOiBEb2N1bWVudEZyYWdtZW50IHtcbiAgICAgIGNvbnN0IGRlc2NFbCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgIGRlc2NFbC5hcHBlbmRUZXh0KCdDaG9vc2UgYmV0d2VlbiAyIG1vZGVzIHRvIHVzZSB0aGUgRGF5IFBsYW5uZXIgcGx1Z2luOicpO1xuICAgICAgZGVzY0VsLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JyJykpO1xuICAgICAgZGVzY0VsLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0cm9uZycpKS5hcHBlbmRUZXh0KCdGaWxlIG1vZGUnKTtcbiAgICAgIGRlc2NFbC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKTtcbiAgICAgIGRlc2NFbC5hcHBlbmRUZXh0KCdQbHVnaW4gYXV0b21hdGljYWxseSBnZW5lcmF0ZXMgZGF5IHBsYW5uZXIgbm90ZXMgZm9yIGVhY2ggZGF5IHdpdGhpbiBhIERheSBQbGFubmVycyBmb2xkZXIuJyk7XG4gICAgICBkZXNjRWwuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnInKSk7XG4gICAgICBkZXNjRWwuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3Ryb25nJykpLmFwcGVuZFRleHQoJ0NvbW1hbmQgbW9kZScpO1xuICAgICAgZGVzY0VsLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JyJykpO1xuICAgICAgZGVzY0VsLmFwcGVuZFRleHQoJ0NvbW1hbmQgdXNlZCB0byBpbnNlcnQgYSBEYXkgUGxhbm5lciBmb3IgdG9kYXkgd2l0aGluIHRoZSBjdXJyZW50IG5vdGUuJyk7XG4gICAgICBkZXNjRWwuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnInKSk7XG4gICAgICB0aGlzLmFkZERvY3NMaW5rKGRlc2NFbCk7XG4gICAgICByZXR1cm4gZGVzY0VsO1xuICAgIH1cblxuICAgIHByaXZhdGUgYWRkRG9jc0xpbmsoZGVzY0VsOiBEb2N1bWVudEZyYWdtZW50KSB7XG4gICAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgYS5ocmVmID0gJ2h0dHBzOi8vZ2l0aHViLmNvbS9seW5jaGphbWVzL29ic2lkaWFuLWRheS1wbGFubmVyaHR0cHM6Ly9naXRodWIuY29tL2x5bmNoamFtZXMvb2JzaWRpYW4tZGF5LXBsYW5uZXIvYmxvYi9tYWluL1JFQURNRS5tZCc7XG4gICAgICBhLnRleHQgPSAncGx1Z2luIFJFQURNRSc7XG4gICAgICBhLnRhcmdldCA9ICdfYmxhbmsnO1xuICAgICAgZGVzY0VsLmFwcGVuZENoaWxkKGEpO1xuICAgICAgZGVzY0VsLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JyJykpO1xuICAgIH1cblxuICB9IiwiaW1wb3J0IHR5cGUgeyBXb3Jrc3BhY2UgfSBmcm9tICdvYnNpZGlhbic7XG5pbXBvcnQgdHlwZSBEYXlQbGFubmVyRmlsZSBmcm9tICcuL2ZpbGUnO1xuaW1wb3J0IHR5cGUgeyBQbGFuSXRlbSwgUGxhblN1bW1hcnlEYXRhIH0gZnJvbSAnLi9wbGFuLWRhdGEnO1xuaW1wb3J0IHR5cGUgUGxhbm5lck1hcmtkb3duIGZyb20gJy4vcGxhbm5lci1tZCc7XG5pbXBvcnQgdHlwZSBQcm9ncmVzcyBmcm9tICcuL3Byb2dyZXNzJztcbmltcG9ydCB0eXBlIHsgRGF5UGxhbm5lclNldHRpbmdzIH0gZnJvbSAnLi9zZXR0aW5ncyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0YXR1c0JhciB7XG4gICAgc2V0dGluZ3M6IERheVBsYW5uZXJTZXR0aW5ncztcbiAgICBmaWxlOiBEYXlQbGFubmVyRmlsZTtcbiAgICBzdGF0dXNCYXI6IEhUTUxFbGVtZW50XG4gICAgc3RhdHVzQmFyQWRkZWQ6IGJvb2xlYW47XG4gICAgc3RhdHVzQmFyVGV4dDogSFRNTFNwYW5FbGVtZW50O1xuICAgIG5leHRUZXh0OiBIVE1MU3BhbkVsZW1lbnQ7XG4gICAgc3RhdHVzQmFyUHJvZ3Jlc3M6IEhUTUxEaXZFbGVtZW50O1xuICAgIHN0YXR1c0JhckN1cnJlbnRQcm9ncmVzczogSFRNTERpdkVsZW1lbnQ7XG4gICAgY2lyY2xlOiBIVE1MRGl2RWxlbWVudDtcbiAgICB3b3Jrc3BhY2U6IFdvcmtzcGFjZTtcbiAgICBwcm9ncmVzczogUHJvZ3Jlc3M7XG4gICAgcGxhbm5lck1EOiBQbGFubmVyTWFya2Rvd247XG4gICAgY2FyZDogSFRNTERpdkVsZW1lbnQ7XG4gICAgY2FyZEN1cnJlbnQ6IGFueTtcbiAgICBjYXJkTmV4dDogYW55O1xuICAgIGN1cnJlbnRUaW1lOiBzdHJpbmc7XG4gICAgXG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3M6IERheVBsYW5uZXJTZXR0aW5ncywgc3RhdHVzQmFyOkhUTUxFbGVtZW50LCB3b3Jrc3BhY2U6V29ya3NwYWNlLCBwcm9ncmVzczpQcm9ncmVzcywgcGxhbm5lck1EOlBsYW5uZXJNYXJrZG93biwgZmlsZTpEYXlQbGFubmVyRmlsZSkge1xuICAgICAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3M7XG4gICAgICAgIHRoaXMuc3RhdHVzQmFyID0gc3RhdHVzQmFyO1xuICAgICAgICB0aGlzLndvcmtzcGFjZSA9IHdvcmtzcGFjZTtcbiAgICAgICAgdGhpcy5wcm9ncmVzcyA9IHByb2dyZXNzO1xuICAgICAgICB0aGlzLnBsYW5uZXJNRCA9IHBsYW5uZXJNRDtcbiAgICAgICAgdGhpcy5maWxlID0gZmlsZTtcbiAgICB9XG5cbiAgICBpbml0U3RhdHVzQmFyKCkge1xuICAgICAgaWYodGhpcy5zdGF0dXNCYXJBZGRlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBsZXQgc3RhdHVzID0gdGhpcy5zdGF0dXNCYXIuY3JlYXRlRWwoJ2RpdicsIHsgY2xzOiAnZGF5LXBsYW5uZXInLCB0aXRsZTogJ1ZpZXcgdGhlIERheSBQbGFubmVyJywgcHJlcGVuZDogdHJ1ZX0pO1xuICAgICAgXG4gICAgICB0aGlzLnNldHVwQ2FyZChzdGF0dXMpO1xuICAgICAgdGhpcy5zdGF0dXNCYXJUZXh0ID0gc3RhdHVzLmNyZWF0ZUVsKCdzcGFuJywgeyBjbHM6IFsnc3RhdHVzLWJhci1pdGVtLXNlZ21lbnQnLCAnZGF5LXBsYW5uZXItc3RhdHVzLWJhci10ZXh0J119KTtcbiAgICAgIFxuICAgICAgdGhpcy5zZXR1cENpcmN1bGFyUHJvZ3Jlc3NCYXIoc3RhdHVzKTtcbiAgICAgIHRoaXMuc2V0dXBIb3Jpem9udGFsUHJvZ3Jlc3NCYXIoc3RhdHVzKTtcbiAgICAgIFxuICAgICAgdGhpcy5uZXh0VGV4dCA9IHN0YXR1cy5jcmVhdGVFbCgnc3BhbicsIHsgY2xzOiBbJ3N0YXR1cy1iYXItaXRlbS1zZWdtZW50JywgJ2RheS1wbGFubmVyLXN0YXR1cy1iYXItdGV4dCddfSk7XG4gICAgICBcbiAgICAgIHRoaXMuc2V0dXBTdGF0dXNCYXJFdmVudHMoc3RhdHVzKTtcbiAgICAgIHRoaXMuc3RhdHVzQmFyQWRkZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0dXBTdGF0dXNCYXJFdmVudHMoc3RhdHVzOiBIVE1MRGl2RWxlbWVudCkge1xuICAgICAgc3RhdHVzLm9uQ2xpY2tFdmVudChhc3luYyAoZXY6IGFueSkgPT4ge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGNvbnN0IGZpbGVOYW1lID0gdGhpcy5maWxlLnRvZGF5UGxhbm5lckZpbGVQYXRoKCk7XG4gICAgICAgICAgICAgIHRoaXMud29ya3NwYWNlLm9wZW5MaW5rVGV4dChmaWxlTmFtZSwgJycsIGZhbHNlKTtcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcilcbiAgICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHN0YXR1cy5vbignbW91c2VlbnRlcicsICcuZGF5LXBsYW5uZXInLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuc2hvdyh0aGlzLmNhcmQpO1xuICAgICAgfSk7XG5cbiAgICAgIHN0YXR1cy5vbignbW91c2VsZWF2ZScsICcuZGF5LXBsYW5uZXInLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuaGlkZSh0aGlzLmNhcmQpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXN5bmMgcmVmcmVzaFN0YXR1c0JhcihwbGFuU3VtbWFyeTogUGxhblN1bW1hcnlEYXRhKSB7XG4gICAgICAgIGlmKCFwbGFuU3VtbWFyeS5lbXB0eSAmJiAhcGxhblN1bW1hcnkuaW52YWxpZCl7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVByb2dyZXNzKHBsYW5TdW1tYXJ5LmN1cnJlbnQsIHBsYW5TdW1tYXJ5Lm5leHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuaGlkZSh0aGlzLnN0YXR1c0Jhcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBsYW5TdW1tYXJ5O1xuICAgIH1cblxuICAgIGhpZGUoZWw6IEhUTUxFbGVtZW50KSB7XG4gICAgICBpZihlbCkge1xuICAgICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNob3coZWw6IEhUTUxFbGVtZW50KSB7XG4gICAgICBpZihlbCkge1xuICAgICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBoaWRlUHJvZ3Jlc3MgKCkge1xuICAgICAgdGhpcy5oaWRlKHRoaXMuc3RhdHVzQmFyUHJvZ3Jlc3MpO1xuICAgICAgdGhpcy5oaWRlKHRoaXMuY2lyY2xlKTtcbiAgICAgIHRoaXMuaGlkZSh0aGlzLm5leHRUZXh0KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZVByb2dyZXNzKGN1cnJlbnQ6IFBsYW5JdGVtLCBuZXh0OiBQbGFuSXRlbSkge1xuICAgICAgICBpZighY3VycmVudCB8fCAhbmV4dCB8fCBjdXJyZW50LmlzRW5kKXtcbiAgICAgICAgICAgIHRoaXMuaGlkZVByb2dyZXNzKCk7XG4gICAgICAgICAgICB0aGlzLnN0YXR1c0JhclRleHQuaW5uZXJUZXh0ID0gJ0FMTCBET05FISc7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgeyBwZXJjZW50YWdlQ29tcGxldGUsIG1pbnNVbnRpbE5leHQgfSA9IHRoaXMucHJvZ3Jlc3MuZ2V0UHJvZ3Jlc3MoY3VycmVudCwgbmV4dCk7XG4gICAgICAgIGlmKHRoaXMuc2V0dGluZ3MuY2lyY3VsYXJQcm9ncmVzcykge1xuICAgICAgICAgIHRoaXMuaGlkZSh0aGlzLnN0YXR1c0JhclByb2dyZXNzKTtcbiAgICAgICAgICB0aGlzLnByb2dyZXNzQ2lyY2xlKHBlcmNlbnRhZ2VDb21wbGV0ZSwgY3VycmVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5oaWRlKHRoaXMuY2lyY2xlKTtcbiAgICAgICAgICB0aGlzLnByb2dyZXNzQmFyKHBlcmNlbnRhZ2VDb21wbGV0ZSwgY3VycmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdGF0dXNUZXh0KG1pbnNVbnRpbE5leHQsIGN1cnJlbnQsIG5leHQsIHBlcmNlbnRhZ2VDb21wbGV0ZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwcm9ncmVzc0JhcihwZXJjZW50YWdlQ29tcGxldGU6IG51bWJlciwgY3VycmVudDogUGxhbkl0ZW0pIHtcbiAgICAgIGlmKGN1cnJlbnQuaXNCcmVhayl7XG4gICAgICAgIHRoaXMuc3RhdHVzQmFyQ3VycmVudFByb2dyZXNzLmFkZENsYXNzKCdncmVlbicpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zdGF0dXNCYXJDdXJyZW50UHJvZ3Jlc3MucmVtb3ZlQ2xhc3MoJ2dyZWVuJyk7XG4gICAgICB9XG4gICAgICB0aGlzLnN0YXR1c0JhckN1cnJlbnRQcm9ncmVzcy5zdHlsZS53aWR0aCA9IGAke3BlcmNlbnRhZ2VDb21wbGV0ZX0lYDtcbiAgICAgIHRoaXMuc2hvdyh0aGlzLnN0YXR1c0JhclByb2dyZXNzKTtcbiAgICB9XG4gICAgICBcbiAgICBwcml2YXRlIHByb2dyZXNzQ2lyY2xlKHBlcmNlbnRhZ2VDb21wbGV0ZTogbnVtYmVyLCBjdXJyZW50OiBQbGFuSXRlbSkge1xuICAgICAgaWYoY3VycmVudC5pc0JyZWFrKXtcbiAgICAgICAgdGhpcy5jaXJjbGUuYWRkQ2xhc3MoJ2dyZWVuJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNpcmNsZS5yZW1vdmVDbGFzcygnZ3JlZW4nKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuY2lyY2xlLnNldEF0dHIoJ2RhdGEtdmFsdWUnLCBwZXJjZW50YWdlQ29tcGxldGUudG9GaXhlZCgwKSk7XG4gICAgICB0aGlzLnNob3codGhpcy5jaXJjbGUpO1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIHN0YXR1c1RleHQobWluc1VudGlsTmV4dDogc3RyaW5nLCBjdXJyZW50OiBQbGFuSXRlbSwgbmV4dDogUGxhbkl0ZW0sIHBlcmNlbnRhZ2VDb21wbGV0ZTogbnVtYmVyKSB7XG4gICAgICBtaW5zVW50aWxOZXh0ID0gbWluc1VudGlsTmV4dCA9PT0gJzAnID8gJzEnIDogbWluc1VudGlsTmV4dDtcbiAgICAgIGNvbnN0IG1pbnNUZXh0ID0gYCR7bWluc1VudGlsTmV4dH0gbWluJHttaW5zVW50aWxOZXh0ID09PSAnMScgPyAnJyA6ICdzJ31gO1xuICAgICAgaWYodGhpcy5zZXR0aW5ncy5ub3dBbmROZXh0SW5TdGF0dXNCYXIpIHtcbiAgICAgICAgdGhpcy5zdGF0dXNCYXJUZXh0LmlubmVySFRNTCA9IGA8c3Ryb25nPk5vdzwvc3Ryb25nPiAke2N1cnJlbnQucmF3VGltZX0gJHt0aGlzLmVsbGlwc2lzKGN1cnJlbnQuZGlzcGxheVRleHQoKSwgMTApfWA7XG4gICAgICAgIHRoaXMubmV4dFRleHQuaW5uZXJIVE1MID0gYDxzdHJvbmc+TmV4dDwvc3Ryb25nPiAke25leHQucmF3VGltZX0gJHt0aGlzLmVsbGlwc2lzKG5leHQuZGlzcGxheVRleHQoKSwgMTApfWA7XG4gICAgICAgIHRoaXMuc2hvdyh0aGlzLm5leHRUZXh0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaGlkZSh0aGlzLm5leHRUZXh0KTtcbiAgICAgICAgY29uc3Qgc3RhdHVzVGV4dCA9IChjdXJyZW50LmlzQnJlYWsgPyBgQnJlYWsgZm9yICR7bWluc1RleHR9YCA6IGAke21pbnNUZXh0fSBsZWZ0YCk7XG4gICAgICAgIHRoaXMuc3RhdHVzQmFyVGV4dC5pbm5lclRleHQgPSBzdGF0dXNUZXh0O1xuICAgICAgfVxuICAgICAgY29uc3QgY3VycmVudFRhc2tTdGF0dXMgPSBgQ3VycmVudCBUYXNrICgke3BlcmNlbnRhZ2VDb21wbGV0ZS50b0ZpeGVkKDApfSUgY29tcGxldGUpYDtcbiAgICAgIGNvbnN0IGN1cnJlbnRUYXNrVGltZUFuZFRleHQgPSBgJHtjdXJyZW50LnJhd1RpbWV9ICR7Y3VycmVudC5kaXNwbGF5VGV4dCgpfWA7XG4gICAgICBjb25zdCBuZXh0VGFzayA9IGBOZXh0IFRhc2sgKGluICR7bWluc1RleHR9KWA7XG4gICAgICBjb25zdCBuZXh0VGFza1RpbWVBbmRUZXh0ID0gYCR7bmV4dC5yYXdUaW1lfSAke25leHQuZGlzcGxheVRleHQoKX1gO1xuICAgICAgdGhpcy5jYXJkQ3VycmVudC5pbm5lckhUTUwgPSBgPHN0cm9uZz4ke2N1cnJlbnRUYXNrU3RhdHVzfTwvc3Ryb25nPjxicj4gJHtjdXJyZW50VGFza1RpbWVBbmRUZXh0fWA7XG4gICAgICB0aGlzLmNhcmROZXh0LmlubmVySFRNTCA9IGA8c3Ryb25nPiR7bmV4dFRhc2t9PC9zdHJvbmc+PGJyPiAke25leHRUYXNrVGltZUFuZFRleHR9YDtcbiAgICAgIHRoaXMudGFza05vdGlmaWNhdGlvbihjdXJyZW50LCBjdXJyZW50VGFza1RpbWVBbmRUZXh0LCBuZXh0VGFzaywgbmV4dFRhc2tUaW1lQW5kVGV4dCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB0YXNrTm90aWZpY2F0aW9uKGN1cnJlbnQ6IFBsYW5JdGVtLCBjdXJyZW50VGFza1RpbWVBbmRUZXh0OiBzdHJpbmcsIG5leHRUYXNrOiBzdHJpbmcsIG5leHRUYXNrVGV4dDogc3RyaW5nKXtcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3Muc2hvd1Rhc2tOb3RpZmljYXRpb24gJiYgdGhpcy5jdXJyZW50VGltZSAhPT0gdW5kZWZpbmVkICYmIHRoaXMuY3VycmVudFRpbWUgIT09IGN1cnJlbnQudGltZS50b1VUQ1N0cmluZygpKXtcbiAgICAgICAgbmV3IE5vdGlmaWNhdGlvbihgVGFzayBzdGFydGVkLCAke2N1cnJlbnRUYXNrVGltZUFuZFRleHR9YCwge2JvZHk6IGAke25leHRUYXNrfTogJHtuZXh0VGFza1RleHR9YCwgcmVxdWlyZUludGVyYWN0aW9uOiB0cnVlfSk7XG4gICAgICB9XG4gICAgICB0aGlzLmN1cnJlbnRUaW1lID0gY3VycmVudC50aW1lLnRvVVRDU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBlbGxpcHNpcyhpbnB1dDogc3RyaW5nLCBsaW1pdDogbnVtYmVyKXtcbiAgICAgIGlmKGlucHV0Lmxlbmd0aCA8PSBsaW1pdCkge1xuICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gaW5wdXQuc3Vic3RyaW5nKDAsIGxpbWl0KSArICcuLi4nO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0dXBIb3Jpem9udGFsUHJvZ3Jlc3NCYXIoc3RhdHVzOiBIVE1MRGl2RWxlbWVudCApIHtcbiAgICAgIHRoaXMuc3RhdHVzQmFyUHJvZ3Jlc3MgPSBzdGF0dXMuY3JlYXRlRWwoJ2RpdicsIHsgY2xzOiBbJ3N0YXR1cy1iYXItaXRlbS1zZWdtZW50JywgJ2RheS1wbGFubmVyLXByb2dyZXNzLWJhciddfSk7XG4gICAgICB0aGlzLnN0YXR1c0JhclByb2dyZXNzLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICB0aGlzLnN0YXR1c0JhckN1cnJlbnRQcm9ncmVzcyA9IHRoaXMuc3RhdHVzQmFyUHJvZ3Jlc3MuY3JlYXRlRWwoJ2RpdicsIHsgY2xzOiAnZGF5LXBsYW5uZXItcHJvZ3Jlc3MtdmFsdWUnfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXR1cENpcmN1bGFyUHJvZ3Jlc3NCYXIoc3RhdHVzOiBIVE1MRGl2RWxlbWVudCl7XG4gICAgICB0aGlzLmNpcmNsZSA9IHN0YXR1cy5jcmVhdGVFbCgnZGl2Jywge2NsczogWydzdGF0dXMtYmFyLWl0ZW0tc2VnbWVudCcsICdwcm9ncmVzcy1waWUgZGF5LXBsYW5uZXInXX0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0dXBDYXJkKHN0YXR1czogSFRNTERpdkVsZW1lbnQpIHtcbiAgICAgIHRoaXMuY2FyZCA9IHN0YXR1cy5jcmVhdGVFbCgnZGl2Jywge2NsczogJ2RheS1wbGFubmVyLXN0YXR1cy1jYXJkJ30pO1xuICAgICAgdGhpcy5jYXJkQ3VycmVudCA9IHRoaXMuY2FyZC5jcmVhdGVFbCgnc3BhbicpO1xuICAgICAgdGhpcy5jYXJkLmNyZWF0ZUVsKCdicicpO1xuICAgICAgdGhpcy5jYXJkLmNyZWF0ZUVsKCdicicpO1xuICAgICAgdGhpcy5jYXJkTmV4dCA9IHRoaXMuY2FyZC5jcmVhdGVFbCgnc3BhbicpO1xuICAgICAgdGhpcy5jYXJkLmNyZWF0ZUVsKCdkaXYnLCB7Y2xzOiAnYXJyb3ctZG93bid9KTtcbiAgICB9XG5cbn0iLCJpbXBvcnQgdHlwZSB7IFBsYW5JdGVtIH0gZnJvbSAnLi9wbGFuLWRhdGEnO1xuY29uc3QgbW9tZW50ID0gKHdpbmRvdyBhcyBhbnkpLm1vbWVudDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJvZ3Jlc3Mge1xuICAgIGdldFByb2dyZXNzKGN1cnJlbnQ6IFBsYW5JdGVtLCBuZXh0OiBQbGFuSXRlbSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgICAgICAgIGNvbnN0IG5vd01vbWVudCA9IG1vbWVudChub3cpO1xuICAgICAgICAgICAgY29uc3QgY3VycmVudE1vbWVudCA9IG1vbWVudChjdXJyZW50LnRpbWUpO1xuICAgICAgICAgICAgY29uc3QgbmV4dE1vbWVudCA9IG1vbWVudChuZXh0LnRpbWUpO1xuICAgICAgICAgICAgY29uc3QgZGlmZiA9IG1vbWVudC5kdXJhdGlvbihuZXh0TW9tZW50LmRpZmYoY3VycmVudE1vbWVudCkpO1xuICAgICAgICAgICAgY29uc3QgZnJvbVN0YXJ0ID0gbW9tZW50LmR1cmF0aW9uKG5vd01vbWVudC5kaWZmKGN1cnJlbnRNb21lbnQpKTtcbiAgICAgICAgICAgIGNvbnN0IHVudGlsTmV4dCA9IG1vbWVudC5kdXJhdGlvbihuZXh0TW9tZW50LmRpZmYobm93TW9tZW50KSk7XG4gICAgICAgICAgICBsZXQgcGVyY2VudGFnZUNvbXBsZXRlID0gKGZyb21TdGFydC5hc01pbnV0ZXMoKSAvIGRpZmYuYXNNaW51dGVzKCkpICogMTAwO1xuICAgICAgICAgICAgY29uc3QgbWluc1VudGlsTmV4dCA9IHVudGlsTmV4dC5hc01pbnV0ZXMoKS50b0ZpeGVkKDApO1xuICAgICAgICAgICAgcmV0dXJuIHsgcGVyY2VudGFnZUNvbXBsZXRlLCBtaW5zVW50aWxOZXh0IH07XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcilcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgcHJvZ3Jlc3NNYXJrZG93bihjdXJyZW50OiBQbGFuSXRlbSwgbmV4dDogUGxhbkl0ZW0pIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgcGVyY2VudGFnZUNvbXBsZXRlIH0gPSB0aGlzLmdldFByb2dyZXNzKGN1cnJlbnQsIG5leHQpO1xuICAgICAgICAgICAgY29uc3QgY29tcGxldGVDb3VudCA9IE1hdGguZmxvb3IoMjAqKHBlcmNlbnRhZ2VDb21wbGV0ZS8xMDApKTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQXJyYXkoY29tcGxldGVDb3VudCkuam9pbignLT4nKSArIG5ldyBBcnJheSgyMC1jb21wbGV0ZUNvdW50KS5qb2luKCdfICcpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpXG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IHR5cGUgeyBQbGFuSXRlbSwgUGxhblN1bW1hcnlEYXRhIH0gZnJvbSAnLi9wbGFuLWRhdGEnO1xuaW1wb3J0IHR5cGUgUHJvZ3Jlc3MgZnJvbSAnLi9wcm9ncmVzcyc7XG5jb25zdCBtb21lbnQgPSAod2luZG93IGFzIGFueSkubW9tZW50O1xuXG5pbnRlcmZhY2UgUmVwbGFjZW1lbnQge1xuICAgIGtleTogc3RyaW5nO1xuICAgIHJlcGxhY2VtZW50OiBzdHJpbmc7XG59XG5jb25zdCBtZXJtbWFpZEVzY2FwZWRDaGFyYWN0ZXJzOiBSZXBsYWNlbWVudFtdID0gW1xuICAgIHsga2V5OiAnOycsIHJlcGxhY2VtZW50OicjNTk7JyB9LFxuICAgIHsga2V5OiAnOicsIHJlcGxhY2VtZW50OicjNTg7JyB9LFxuICAgIHsga2V5OiAnIycsIHJlcGxhY2VtZW50OicjMzU7JyB9LFxuICAgIC8vSEFDSyB0byByZS1pbnRyb2R1Y2UgcGFydGlhbGx5IHJlcGxhY2VkIHJlcGxhY2VtZW50cyFcbiAgICB7IGtleTogJyMzNTs1OTsnLCByZXBsYWNlbWVudDonIzU5OycgfSxcbl07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYW5uZXJNZXJtYWlkIHtcbiAgICBwcm9ncmVzczogUHJvZ3Jlc3M7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9ncmVzczogUHJvZ3Jlc3MpIHtcbiAgICAgICAgdGhpcy5wcm9ncmVzcyA9IHByb2dyZXNzO1xuICAgIH1cblxuICAgIGdlbmVyYXRlKHBsYW5TdW1tYXJ5OiBQbGFuU3VtbWFyeURhdGEpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCB7dGFza3MsIGJyZWFrc30gPSB0aGlzLmdlbmVyYXRlRW50cmllcyhwbGFuU3VtbWFyeS52YWxpZEl0ZW1zKCkpO1xuICAgICAgICByZXR1cm4gdGhpcy5tZXJtYWlkVGVtcGxhdGUodGFza3MsIGJyZWFrcyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZW5lcmF0ZUVudHJpZXMoaXRlbXM6IFBsYW5JdGVtW10pOiB7dGFza3M6IHN0cmluZ1tdLCBicmVha3M6IHN0cmluZ1tdfSB7XG4gICAgICAgIGNvbnN0IHRhc2tzOnN0cmluZ1tdID0gW107XG4gICAgICAgIGNvbnN0IGJyZWFrczpzdHJpbmdbXSA9IFtdO1xuICAgICAgICBpdGVtcy5mb3JFYWNoKChpdGVtLCBpKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBuZXh0ID0gaXRlbXNbaSsxXTtcbiAgICAgICAgICAgIGNvbnN0IG1pbnMgPSB0aGlzLm1pbnV0ZUludGVydmFsKGl0ZW0sIG5leHQpO1xuICAgICAgICAgICAgY29uc3QgdGV4dCA9IGAgICAgJHt0aGlzLmVzY2FwZShpdGVtLmRpc3BsYXlUZXh0KCkpfSAgICAgOiR7aXRlbS5yYXdUaW1lLnJlcGxhY2UoJzonLCAnLScpfSR7bWluc31gO1xuICAgICAgICAgICAgaWYoaXRlbS5pc0JyZWFrKSB7XG4gICAgICAgICAgICAgICAgYnJlYWtzLnB1c2godGV4dCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhc2tzLnB1c2godGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4ge3Rhc2tzLCBicmVha3N9O1xuICAgIH1cblxuICAgIHByaXZhdGUgbWludXRlSW50ZXJ2YWwoaXRlbTogUGxhbkl0ZW0sIG5leHQ6IFBsYW5JdGVtKTogc3RyaW5nIHtcbiAgICAgICAgaWYobmV4dCA9PT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgIHJldHVybiAnLCAwbW0nO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGN1cnJlbnRNb21lbnQgPSBtb21lbnQoaXRlbS50aW1lKTtcbiAgICAgICAgY29uc3QgbmV4dE1vbWVudCA9IG1vbWVudChuZXh0LnRpbWUpO1xuICAgICAgICBjb25zdCB1bnRpbE5leHQgPSBNYXRoLmZsb29yKG1vbWVudC5kdXJhdGlvbihuZXh0TW9tZW50LmRpZmYoY3VycmVudE1vbWVudCkpLmFzTWludXRlcygpKTtcbiAgICAgICAgcmV0dXJuICcsICcgKyB1bnRpbE5leHQgKyAnbW0nO1xuICAgIH1cblxuICAgIHByaXZhdGUgZXNjYXBlKGlucHV0OiBzdHJpbmcpe1xuICAgICAgICBtZXJtbWFpZEVzY2FwZWRDaGFyYWN0ZXJzLmZvckVhY2gobWVjID0+IHsgIFxuICAgICAgICAgICAgaW5wdXQgPSBpbnB1dC5yZXBsYWNlKG1lYy5rZXksIG1lYy5yZXBsYWNlbWVudClcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBpbnB1dDtcbiAgICB9XG5cbiAgICBwcml2YXRlIG1lcm1haWRUZW1wbGF0ZSh0YXNrczogc3RyaW5nW10sIGJyZWFrczogc3RyaW5nW10pOnN0cmluZyB7XG4gICAgICAgIHJldHVybiBgXG5cXGBcXGBcXGBtZXJtYWlkXG5nYW50dFxuICAgIGRhdGVGb3JtYXQgIEhILW1tXG4gICAgYXhpc0Zvcm1hdCAlSDolTVxuICAgIHNlY3Rpb24gVGFza3NcbiR7dGFza3Muam9pbignXFxuJyl9XG4gICAgc2VjdGlvbiBCcmVha3NcbiR7YnJlYWtzLmpvaW4oJ1xcbicpfVxuXFxgXFxgXFxgXG5gXG4gICAgfVxufSIsImltcG9ydCB0eXBlIHsgTWFya2Rvd25WaWV3LCBXb3Jrc3BhY2UgfSBmcm9tICdvYnNpZGlhbic7XG5pbXBvcnQgeyBEQVlfUExBTk5FUl9ERUZBVUxUX0NPTlRFTlQgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQgdHlwZSBEYXlQbGFubmVyRmlsZSBmcm9tICcuL2ZpbGUnO1xuaW1wb3J0IFBsYW5uZXJNZXJtYWlkIGZyb20gJy4vbWVybWFpZCc7XG5pbXBvcnQgdHlwZSBQYXJzZXIgZnJvbSAnLi9wYXJzZXInO1xuaW1wb3J0IHR5cGUgeyBQbGFuSXRlbSwgUGxhblN1bW1hcnlEYXRhIH0gZnJvbSAnLi9wbGFuLWRhdGEnO1xuaW1wb3J0IHR5cGUgUHJvZ3Jlc3MgZnJvbSAnLi9wcm9ncmVzcyc7XG5pbXBvcnQgeyBEYXlQbGFubmVyU2V0dGluZ3MsIE5vdGVGb3JEYXRlUXVlcnl9IGZyb20gJy4vc2V0dGluZ3MnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGFubmVyTWFya2Rvd24ge1xuICAgIHdvcmtzcGFjZTogV29ya3NwYWNlO1xuICAgIGRheVBsYW5uZXJMYXN0RWRpdDogbnVtYmVyO1xuICAgIHNldHRpbmdzOiBEYXlQbGFubmVyU2V0dGluZ3M7XG4gICAgZmlsZTogRGF5UGxhbm5lckZpbGU7XG4gICAgcGFyc2VyOiBQYXJzZXI7XG4gICAgcHJvZ3Jlc3M6IFByb2dyZXNzO1xuICAgIG1lcm1haWQ6IFBsYW5uZXJNZXJtYWlkO1xuICAgIG5vdGVGb3JEYXRlUXVlcnk6IE5vdGVGb3JEYXRlUXVlcnk7XG4gICAgXG4gICAgY29uc3RydWN0b3Iod29ya3NwYWNlOiBXb3Jrc3BhY2UsIHNldHRpbmdzOiBEYXlQbGFubmVyU2V0dGluZ3MsIGZpbGU6IERheVBsYW5uZXJGaWxlLCBwYXJzZXI6IFBhcnNlciwgcHJvZ3Jlc3M6IFByb2dyZXNzKXtcbiAgICAgICAgdGhpcy53b3Jrc3BhY2UgPSB3b3Jrc3BhY2U7XG4gICAgICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5ncztcbiAgICAgICAgdGhpcy5maWxlID0gZmlsZTtcbiAgICAgICAgdGhpcy5wYXJzZXIgPSBwYXJzZXI7XG4gICAgICAgIHRoaXMucHJvZ3Jlc3MgPSBwcm9ncmVzcztcbiAgICAgICAgdGhpcy5tZXJtYWlkID0gbmV3IFBsYW5uZXJNZXJtYWlkKHRoaXMucHJvZ3Jlc3MpO1xuICAgICAgICB0aGlzLm5vdGVGb3JEYXRlUXVlcnkgPSBuZXcgTm90ZUZvckRhdGVRdWVyeSgpO1xuICAgIH1cbiAgICBcbiAgICBhc3luYyBpbnNlcnRQbGFubmVyKCkge1xuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IHRoaXMuZmlsZS50b2RheVBsYW5uZXJGaWxlUGF0aCgpO1xuICAgICAgICBjb25zdCBmaWxlQ29udGVudHMgPSBhd2FpdCAoYXdhaXQgdGhpcy5maWxlLmdldEZpbGVDb250ZW50cyhmaWxlUGF0aCkpLnNwbGl0KCdcXG4nKTtcbiAgICAgICAgY29uc3QgdmlldyA9IHRoaXMud29ya3NwYWNlLmFjdGl2ZUxlYWYudmlldyBhcyBNYXJrZG93blZpZXc7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRMaW5lID0gdmlldy5zb3VyY2VNb2RlLmNtRWRpdG9yLmdldEN1cnNvcigpLmxpbmU7XG4gICAgICAgIGNvbnN0IGluc2VydFJlc3VsdCA9IFsuLi5maWxlQ29udGVudHMuc2xpY2UoMCwgY3VycmVudExpbmUpLCAuLi5EQVlfUExBTk5FUl9ERUZBVUxUX0NPTlRFTlQuc3BsaXQoJ1xcbicpLCAuLi5maWxlQ29udGVudHMuc2xpY2UoY3VycmVudExpbmUpXTtcbiAgICAgICAgdGhpcy5maWxlLnVwZGF0ZUZpbGUoZmlsZVBhdGgsIGluc2VydFJlc3VsdC5qb2luKCdcXG4nKSk7XG4gICAgfVxuXG4gICAgYXN5bmMgcGFyc2VEYXlQbGFubmVyKCk6UHJvbWlzZTxQbGFuU3VtbWFyeURhdGE+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGZpbGVQYXRoID0gdGhpcy5maWxlLnRvZGF5UGxhbm5lckZpbGVQYXRoKCk7XG4gICAgICAgICAgICBjb25zdCBmaWxlQ29udGVudCA9IGF3YWl0IChhd2FpdCB0aGlzLmZpbGUuZ2V0RmlsZUNvbnRlbnRzKGZpbGVQYXRoKSkuc3BsaXQoJ1xcbicpO1xuICAgICAgICAgICAgY29uc3Qge2RheVBsYW5uZXJDb250ZW50c30gPSB0aGlzLmdldFBsYW5uZXJTZWdtZW50KGZpbGVDb250ZW50KTtcblxuICAgICAgICAgICAgY29uc3QgcGxhbkRhdGEgPSBhd2FpdCB0aGlzLnBhcnNlci5wYXJzZU1hcmtkb3duKGRheVBsYW5uZXJDb250ZW50cyk7XG4gICAgICAgICAgICByZXR1cm4gcGxhbkRhdGE7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcilcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBhc3luYyB1cGRhdGVEYXlQbGFubmVyTWFya2Rvd24ocGxhblN1bW1hcnk6IFBsYW5TdW1tYXJ5RGF0YSkge1xuICAgICAgICBpZigodGhpcy5kYXlQbGFubmVyTGFzdEVkaXQgKyA2MDAwKSA+IG5ldyBEYXRlKCkuZ2V0VGltZSgpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGZpbGVQYXRoID0gdGhpcy5maWxlLnRvZGF5UGxhbm5lckZpbGVQYXRoKCk7XG4gICAgICAgICAgICBjb25zdCBmaWxlQ29udGVudHMgPSBhd2FpdCAoYXdhaXQgdGhpcy5maWxlLmdldEZpbGVDb250ZW50cyhmaWxlUGF0aCkpXG4gICAgICAgICAgICBjb25zdCBmaWxlQ29udGVudHNBcnIgPSBmaWxlQ29udGVudHMuc3BsaXQoJ1xcbicpO1xuICAgICAgICAgICAgY29uc3Qge3N0YXJ0TGluZSwgZW5kTGluZX0gPSB0aGlzLmdldFBsYW5uZXJTZWdtZW50KGZpbGVDb250ZW50c0Fycik7XG5cbiAgICAgICAgICAgIHBsYW5TdW1tYXJ5LmNhbGN1bGF0ZSgpO1xuICAgICAgICAgICAgaWYocGxhblN1bW1hcnkuZW1wdHkpe1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdHMgPSBwbGFuU3VtbWFyeS5pdGVtcy5tYXAoKGl0ZW0sIGkpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0gJyc7XG4gICAgICAgICAgICAgICAgaWYoaXRlbSA9PT0gcGxhblN1bW1hcnkuY3VycmVudCl7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IGl0ZW0uaXNFbmQgPyB0aGlzLnVwZGF0ZUl0ZW1Db21wbGV0aW9uKGl0ZW0sIHRydWUpIDogdGhpcy5jdXJyZW50SXRlbVRleHQocGxhblN1bW1hcnkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZihpdGVtLmlzVW5NYXRjaGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IGl0ZW0ucmF3OyAgXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy51cGRhdGVJdGVtQ29tcGxldGlvbihpdGVtLCBpdGVtLmlzUGFzdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3QgbWVybWFpZFJlc3VsdCA9IHRoaXMuc2V0dGluZ3MubWVybWFpZCA/IHRoaXMubWVybWFpZC5nZW5lcmF0ZShwbGFuU3VtbWFyeSkuc3BsaXQoJ1xcbicpIDogW107XG4gICAgICAgICAgICBjb25zdCBuZXdGaWxlQ29udGVudHNBcnIgPSBmaWxlQ29udGVudHNBcnIuc2xpY2UoMCwgc3RhcnRMaW5lKS5jb25jYXQobWVybWFpZFJlc3VsdCkuY29uY2F0KHJlc3VsdHMpLmNvbmNhdChmaWxlQ29udGVudHNBcnIuc2xpY2UoZW5kTGluZSkpO1xuICAgICAgICAgICAgY29uc3QgbmV3RmlsZUNvbnRlbnRzID0gbmV3RmlsZUNvbnRlbnRzQXJyLmpvaW4oJ1xcbicpXG4gICAgICAgICAgICBpZihmaWxlQ29udGVudHMgIT09IG5ld0ZpbGVDb250ZW50cyl7XG4gICAgICAgICAgICAgICAgdGhpcy5maWxlLnVwZGF0ZUZpbGUoZmlsZVBhdGgsIG5ld0ZpbGVDb250ZW50cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFBsYW5uZXJTZWdtZW50KGZpbGVDb250ZW50czogc3RyaW5nW10pOiB7c3RhcnRMaW5lOiBudW1iZXIsIGVuZExpbmU6IG51bWJlciwgZGF5UGxhbm5lckNvbnRlbnRzOiBzdHJpbmdbXX0ge1xuICAgICAgICBsZXQgc3RhcnRMaW5lID0gLTE7XG4gICAgICAgIGxldCBlbmRMaW5lID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWxlQ29udGVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGRwYyA9IGZpbGVDb250ZW50c1tpXTtcbiAgICAgICAgICAgIGlmKGRwYy5jb250YWlucygnIyBEYXkgUGxhbm5lcicpKSB7XG4gICAgICAgICAgICAgICAgc3RhcnRMaW5lID0gaSsxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoZHBjID09PSAnLS0tJyAmJiBzdGFydExpbmUgPj0gMCkge1xuICAgICAgICAgICAgICAgIGVuZExpbmUgPSBpLTE7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gICAgXG4gICAgICAgIGNvbnN0IGRheVBsYW5uZXJDb250ZW50cyA9IGZpbGVDb250ZW50cy5zbGljZShzdGFydExpbmUsIGVuZExpbmUpO1xuICAgICAgICByZXR1cm4ge3N0YXJ0TGluZSwgZW5kTGluZSwgZGF5UGxhbm5lckNvbnRlbnRzfVxuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlSXRlbUNvbXBsZXRpb24oaXRlbTogUGxhbkl0ZW0sIGNvbXBsZXRlOiBib29sZWFuKSB7XG4gICAgICAgIGxldCBjaGVjayA9IHRoaXMuY2hlY2soY29tcGxldGUpO1xuICAgICAgICAvL092ZXJyaWRlIHRvIHVzZSBjdXJyZW50ICh1c2VyIGlucHV0dGVkKSBzdGF0ZSBpZiBwbHVnaW4gc2V0dGluZyBpcyBlbmFibGVkXG4gICAgICAgIGlmKCF0aGlzLnNldHRpbmdzLmNvbXBsZXRlUGFzdEl0ZW1zKSB7XG4gICAgICAgICAgICBjaGVjayA9IHRoaXMuY2hlY2soaXRlbS5pc0NvbXBsZXRlZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGAtIFske2NoZWNrfV0gJHtpdGVtLnJhd1RpbWV9ICR7aXRlbS5kaXNwbGF5VGV4dCgpfWA7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjaGVjayhjaGVjazogYm9vbGVhbikge1xuICAgICAgICByZXR1cm4gY2hlY2sgPyAneCcgOiAnICc7XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgY3VycmVudEl0ZW1UZXh0KHBsYW5TdW1tYXJ5OlBsYW5TdW1tYXJ5RGF0YSk6IHN0cmluZ3tcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnQgPSBwbGFuU3VtbWFyeS5jdXJyZW50O1xuICAgICAgICAgICAgY29uc3QgbmV4dCA9IHBsYW5TdW1tYXJ5Lm5leHQ7XG4gICAgXG4gICAgICAgICAgICBjb25zdCBwcm9ncmVzc01hcmtkb3duID0gYD4gfHwke2N1cnJlbnQucmF3VGltZX18fCR7dGhpcy5wcm9ncmVzcy5wcm9ncmVzc01hcmtkb3duKGN1cnJlbnQsIG5leHQpfXx8JHtuZXh0LnJhd1RpbWV9fHxgO1xuICAgICAgICAgICAgbGV0IHJlcGxhY2VtZW50SXRlbSA9IGBcXG4qKkN1cnJlbnQgVGFzayoqXFxuXFxuJHtwcm9ncmVzc01hcmtkb3dufVxcblxcbiR7dGhpcy51cGRhdGVJdGVtQ29tcGxldGlvbihjdXJyZW50LCBmYWxzZSl9YDsgICAgICBcbiAgICAgICAgICAgIHJldHVybiByZXBsYWNlbWVudEl0ZW07XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcilcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNoZWNrSXNEYXlQbGFubmVyRWRpdGluZygpe1xuICAgICAgICBjb25zdCBhY3RpdmVMZWFmID0gdGhpcy53b3Jrc3BhY2UuYWN0aXZlTGVhZjtcbiAgICAgICAgaWYoIWFjdGl2ZUxlYWYpe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHZpZXdTdGF0ZSA9IGFjdGl2ZUxlYWYudmlldy5nZXRTdGF0ZSgpO1xuICAgICAgICBpZih2aWV3U3RhdGUuZmlsZSA9PT0gdGhpcy5maWxlLnRvZGF5UGxhbm5lckZpbGVQYXRoKCkpe1xuICAgICAgICAgICAgdGhpcy5kYXlQbGFubmVyTGFzdEVkaXQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgfTtcbiAgICB9XG59IiwiaW1wb3J0IHsgbm93IH0gZnJvbSAnbW9tZW50JztcbmltcG9ydCB0eXBlIHsgVmF1bHQgfSBmcm9tICdvYnNpZGlhbic7XG5pbXBvcnQgeyBEQVlfUExBTk5FUl9ERUZBVUxUX0NPTlRFTlQsIERBWV9QTEFOTkVSX0ZJTEVOQU1FIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuaW1wb3J0IE1vbWVudERhdGVSZWdleCBmcm9tICcuL21vbWVudC1kYXRlLXJlZ2V4JztcbmltcG9ydCB7IERheVBsYW5uZXJTZXR0aW5ncywgRGF5UGxhbm5lck1vZGUsIE5vdGVGb3JEYXRlUXVlcnkgfSBmcm9tICcuL3NldHRpbmdzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGF5UGxhbm5lckZpbGUge1xuICAgIHZhdWx0OiBWYXVsdDtcbiAgICBzZXR0aW5nczogRGF5UGxhbm5lclNldHRpbmdzO1xuICAgIG1vbWVudERhdGVSZWdleDogTW9tZW50RGF0ZVJlZ2V4O1xuICAgIG5vdGVGb3JEYXRlUXVlcnk6IE5vdGVGb3JEYXRlUXVlcnk7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YXVsdDogVmF1bHQsIHNldHRpbmdzOiBEYXlQbGFubmVyU2V0dGluZ3Mpe1xuICAgICAgICB0aGlzLnZhdWx0ID0gdmF1bHQ7XG4gICAgICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5ncztcbiAgICAgICAgdGhpcy5tb21lbnREYXRlUmVnZXggPSBuZXcgTW9tZW50RGF0ZVJlZ2V4KCk7XG4gICAgICAgIHRoaXMubm90ZUZvckRhdGVRdWVyeSA9IG5ldyBOb3RlRm9yRGF0ZVF1ZXJ5KCk7XG4gICAgfVxuXG5cbiAgICBoYXNUb2RheU5vdGUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldHRpbmdzLm1vZGUgPT09IERheVBsYW5uZXJNb2RlLkZpbGUgfHwgdGhpcy5ub3RlRm9yRGF0ZVF1ZXJ5LmV4aXN0cyh0aGlzLnNldHRpbmdzLm5vdGVzVG9EYXRlcyk7XG4gICAgfVxuXG4gICAgdG9kYXlQbGFubmVyRmlsZVBhdGgoKTogc3RyaW5nIHtcbiAgICAgICAgaWYodGhpcy5zZXR0aW5ncy5tb2RlID09PSBEYXlQbGFubmVyTW9kZS5Db21tYW5kKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm5vdGVGb3JEYXRlUXVlcnkuYWN0aXZlKHRoaXMuc2V0dGluZ3Mubm90ZXNUb0RhdGVzKS5ub3RlUGF0aDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBmaWxlTmFtZSA9IHRoaXMudG9kYXlQbGFubmVyRmlsZU5hbWUoKTtcbiAgICAgICAgcmV0dXJuIGAke3RoaXMuc2V0dGluZ3MuY3VzdG9tRm9sZGVyID8/ICdEYXkgUGxhbm5lcnMnfS8ke2ZpbGVOYW1lfWA7XG4gICAgfVxuXG4gICAgdG9kYXlQbGFubmVyRmlsZU5hbWUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubW9tZW50RGF0ZVJlZ2V4LnJlcGxhY2UoREFZX1BMQU5ORVJfRklMRU5BTUUpO1xuICAgIH1cblxuICAgIGFzeW5jIHByZXBhcmVGaWxlKCkge1xuICAgICAgICB0cnkgeyAgICAgIFxuICAgICAgICAgICAgaWYodGhpcy5zZXR0aW5ncy5tb2RlID09PSBEYXlQbGFubmVyTW9kZS5GaWxlKXsgICAgICBcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmNyZWF0ZUZvbGRlcklmTm90RXhpc3RzKHRoaXMuc2V0dGluZ3MuY3VzdG9tRm9sZGVyKTtcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmNyZWF0ZUZpbGVJZk5vdEV4aXN0cyh0aGlzLnRvZGF5UGxhbm5lckZpbGVQYXRoKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBjcmVhdGVGb2xkZXJJZk5vdEV4aXN0cyhwYXRoOiBzdHJpbmcpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3Qgbm9ybWFsaXplZFBhdGggPSB0aGlzLm5vcm1hbGl6ZVBhdGgocGF0aCk7XG4gICAgICAgICAgICBjb25zdCBmb2xkZXJFeGlzdHMgPSBhd2FpdCB0aGlzLnZhdWx0LmFkYXB0ZXIuZXhpc3RzKG5vcm1hbGl6ZWRQYXRoLCBmYWxzZSlcbiAgICAgICAgICAgIGlmKCFmb2xkZXJFeGlzdHMpIHtcbiAgICAgICAgICAgICAgYXdhaXQgdGhpcy52YXVsdC5jcmVhdGVGb2xkZXIobm9ybWFsaXplZFBhdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBjcmVhdGVGaWxlSWZOb3RFeGlzdHMoZmlsZU5hbWU6IHN0cmluZykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3Qgbm9ybWFsaXplZEZpbGVOYW1lID0gdGhpcy5ub3JtYWxpemVQYXRoKGZpbGVOYW1lKTtcbiAgICAgICAgICAgIGlmICghYXdhaXQgdGhpcy52YXVsdC5hZGFwdGVyLmV4aXN0cyhub3JtYWxpemVkRmlsZU5hbWUsIGZhbHNlKSkge1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMudmF1bHQuY3JlYXRlKG5vcm1hbGl6ZWRGaWxlTmFtZSwgREFZX1BMQU5ORVJfREVGQVVMVF9DT05URU5UKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0RmlsZUNvbnRlbnRzKGZpbGVOYW1lOiBzdHJpbmcpe1xuICAgICAgICB0aGlzLnByZXBhcmVGaWxlKCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy52YXVsdC5hZGFwdGVyLnJlYWQoZmlsZU5hbWUpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpXG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgYXN5bmMgdXBkYXRlRmlsZShmaWxlTmFtZTogc3RyaW5nLCBmaWxlQ29udGVudHM6IHN0cmluZyl7XG4gICAgICAgIHRoaXMucHJlcGFyZUZpbGUoKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnZhdWx0LmFkYXB0ZXIud3JpdGUodGhpcy5ub3JtYWxpemVQYXRoKGZpbGVOYW1lKSwgZmlsZUNvbnRlbnRzKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBub3JtYWxpemVQYXRoKHBhdGg6IHN0cmluZykgOiBzdHJpbmcge1xuICAgICAgICAvLyBBbHdheXMgdXNlIGZvcndhcmQgc2xhc2hcbiAgICAgICAgcGF0aCA9IHBhdGgucmVwbGFjZSgvXFxcXC9nLCAnLycpO1xuICBcbiAgICAgICAgLy8gU3RyaXAgc3RhcnQvZW5kIHNsYXNoXG4gICAgICAgIHdoaWxlIChwYXRoLnN0YXJ0c1dpdGgoJy8nKSAmJiBwYXRoICE9PSAnLycpIHtcbiAgICAgICAgICAgIHBhdGggPSBwYXRoLnN1YnN0cigxKTtcbiAgICAgICAgfVxuICAgICAgICB3aGlsZSAocGF0aC5lbmRzV2l0aCgnLycpICYmIHBhdGggIT09ICcvJykge1xuICAgICAgICAgICAgcGF0aCA9IHBhdGguc3Vic3RyKDAsIHBhdGgubGVuZ3RoIC0gMSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIFVzZSAvIGZvciByb290XG4gICAgICAgIGlmIChwYXRoID09PSAnJykge1xuICAgICAgICAgICAgcGF0aCA9ICcvJztcbiAgICAgICAgfVxuICAgIFxuICAgICAgICBwYXRoID0gcGF0aFxuICAgICAgICAgICAgLy8gUmVwbGFjZSBub24tYnJlYWtpbmcgc3BhY2VzIHdpdGggcmVndWxhciBzcGFjZXNcbiAgICAgICAgICAgIC5yZXBsYWNlKCdcXHUwMEEwJywgJyAnKVxuICAgICAgICAgICAgLy8gTm9ybWFsaXplIHVuaWNvZGUgdG8gTkZDIGZvcm1cbiAgICAgICAgICAgIC5ub3JtYWxpemUoJ05GQycpO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHBhdGg7XG4gICAgfVxufSIsImNvbnN0IG1vbWVudCA9ICh3aW5kb3cgYXMgYW55KS5tb21lbnQ7XG5cbmV4cG9ydCBjbGFzcyBQbGFuU3VtbWFyeURhdGEge1xuICAgIGVtcHR5OiBib29sZWFuO1xuICAgIGludmFsaWQ6IGJvb2xlYW47XG4gICAgaXRlbXM6IFBsYW5JdGVtW107XG4gICAgcGFzdDogUGxhbkl0ZW1bXTtcbiAgICBjdXJyZW50OiBQbGFuSXRlbTtcbiAgICBuZXh0OiBQbGFuSXRlbTtcbiAgICBcbiAgICBjb25zdHJ1Y3RvcihpdGVtczogUGxhbkl0ZW1bXSl7XG4gICAgICAgIHRoaXMuZW1wdHkgPSBpdGVtcy5sZW5ndGggPCAxO1xuICAgICAgICB0aGlzLmludmFsaWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5pdGVtcyA9IGl0ZW1zO1xuICAgICAgICB0aGlzLnBhc3QgPSBbXTtcbiAgICB9XG5cbiAgICBjYWxjdWxhdGUoKTogdm9pZCB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgY29uc3QgdmFsaWRJdGVtcyA9IHRoaXMudmFsaWRJdGVtcygpO1xuICAgICAgICAgICAgaWYodmFsaWRJdGVtcy5sZW5ndGggPT09IDApe1xuICAgICAgICAgICAgICAgIHRoaXMuZW1wdHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhbGlkSXRlbXMuZm9yRWFjaCgoaXRlbSwgaSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5leHQgPSB2YWxpZEl0ZW1zW2krMV07XG4gICAgICAgICAgICAgICAgaWYoaXRlbS50aW1lIDwgbm93ICYmIChpdGVtLmlzRW5kIHx8IChuZXh0ICYmIG5vdyA8IG5leHQudGltZSkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudCA9IGl0ZW07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCA9IGl0ZW0uaXNFbmQgPyBudWxsIDogbmV4dDtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYoaXRlbS50aW1lIDwgbm93KSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uaXNQYXN0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXN0LnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmKG5leHQpe1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB1bnRpbE5leHQgPSBtb21lbnQuZHVyYXRpb24obW9tZW50KG5leHQudGltZSkuZGlmZihtb21lbnQoaXRlbS50aW1lKSkpLmFzTWludXRlcygpO1xuICAgICAgICAgICAgICAgICAgICBpdGVtLmR1cmF0aW9uTWlucyA9IHVudGlsTmV4dDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFsaWRJdGVtcygpOiBQbGFuSXRlbVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXRlbXMuZmlsdGVyKGl0ZW0gPT4gIWl0ZW0uaXNVbk1hdGNoZWQpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFBsYW5JdGVtIHtcblxuICAgIG1hdGNoSW5kZXg6IG51bWJlcjtcbiAgICBjaGFySW5kZXg6IG51bWJlcjtcbiAgICBpc0NvbXBsZXRlZDogYm9vbGVhbjtcbiAgICBpc1Bhc3Q6IGJvb2xlYW47XG4gICAgaXNCcmVhazogYm9vbGVhbjtcbiAgICBpc0VuZDogYm9vbGVhbjtcbiAgICBpc1VuTWF0Y2hlZDogYm9vbGVhbjtcbiAgICB0aW1lOiBEYXRlO1xuICAgIGR1cmF0aW9uTWluczogbnVtYmVyO1xuICAgIHJhd1RpbWU6IHN0cmluZztcbiAgICB0ZXh0OiBzdHJpbmc7XG4gICAgcmF3OiBzdHJpbmc7XG4gICAgXG4gICAgY29uc3RydWN0b3IobWF0Y2hJbmRleDogbnVtYmVyLCBjaGFySW5kZXg6IG51bWJlciwgaXNDb21wbGV0ZWQ6IGJvb2xlYW4sIFxuICAgICAgICBpc0JyZWFrOiBib29sZWFuLCBpc0VuZDogYm9vbGVhbiwgaXNVbk1hdGNoZWQ6IGJvb2xlYW4sIHRpbWU6IERhdGUsIHJhd1RpbWU6c3RyaW5nLCB0ZXh0OiBzdHJpbmcsIHJhdzogc3RyaW5nKXtcbiAgICAgICAgdGhpcy5tYXRjaEluZGV4ID0gbWF0Y2hJbmRleDtcbiAgICAgICAgdGhpcy5jaGFySW5kZXggPSBjaGFySW5kZXg7XG4gICAgICAgIHRoaXMuaXNDb21wbGV0ZWQgPSBpc0NvbXBsZXRlZDtcbiAgICAgICAgdGhpcy5pc0JyZWFrID0gaXNCcmVhaztcbiAgICAgICAgdGhpcy5pc0VuZCA9IGlzRW5kO1xuICAgICAgICB0aGlzLmlzVW5NYXRjaGVkID0gaXNVbk1hdGNoZWQ7XG4gICAgICAgIHRoaXMudGltZSA9IHRpbWU7XG4gICAgICAgIHRoaXMucmF3VGltZSA9IHJhd1RpbWU7XG4gICAgICAgIHRoaXMudGV4dCA9IHRleHQ7XG4gICAgICAgIHRoaXMucmF3ID0gcmF3O1xuICAgIH1cblxuICAgIGRpc3BsYXlUZXh0KCkge1xuICAgICAgICBpZih0aGlzLmlzQnJlYWspIHtcbiAgICAgICAgICAgIHJldHVybiAnQlJFQUsnO1xuICAgICAgICB9XG4gICAgICAgIGlmKHRoaXMuaXNFbmQpIHtcbiAgICAgICAgICAgIHJldHVybiAnRU5EJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy50ZXh0O1xuICAgIH1cbn0iLCJpbXBvcnQgdHlwZSB7IFZhdWx0IH0gZnJvbSAnb2JzaWRpYW4nO1xuaW1wb3J0IHsgUExBTl9QQVJTRVJfUkVHRVggfSBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBQbGFuSXRlbSwgUGxhblN1bW1hcnlEYXRhIH0gZnJvbSAnLi9wbGFuLWRhdGEnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYXJzZXIge1xuICAgIHZhdWx0OiBWYXVsdDtcblxuICAgIGNvbnN0cnVjdG9yKHZhdWx0OiBWYXVsdCkge1xuICAgICAgICB0aGlzLnZhdWx0ID0gdmF1bHQ7XG4gICAgfVxuXG4gICAgYXN5bmMgcGFyc2VNYXJrZG93bihmaWxlQ29udGVudDogc3RyaW5nW10pOiBQcm9taXNlPFBsYW5TdW1tYXJ5RGF0YT4ge1xuICAgICAgICBjb25zdCBwYXJzZWQgPSB0aGlzLnBhcnNlKGZpbGVDb250ZW50LmpvaW4oJ1xcbicpKTtcbiAgICAgICAgY29uc3QgdHJhbnNmb3JtZWQgPSB0aGlzLnRyYW5zZm9ybShwYXJzZWQpO1xuICAgICAgICByZXR1cm4gbmV3IFBsYW5TdW1tYXJ5RGF0YSh0cmFuc2Zvcm1lZCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwYXJzZShpbnB1dDogc3RyaW5nKTogUmVnRXhwRXhlY0FycmF5W10ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgbWF0Y2hlcyA9IFtdO1xuICAgICAgICAgICAgbGV0IG1hdGNoO1xuICAgICAgICAgICAgd2hpbGUobWF0Y2ggPSBQTEFOX1BBUlNFUl9SRUdFWC5leGVjKGlucHV0KSl7XG4gICAgICAgICAgICAgIG1hdGNoZXMucHVzaChtYXRjaClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBtYXRjaGVzO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHRyYW5zZm9ybShyZWdleE1hdGNoZXM6IFJlZ0V4cEV4ZWNBcnJheVtdKTogUGxhbkl0ZW1bXXtcbiAgICAgICAgY29uc3QgcmVzdWx0cyA9IHJlZ2V4TWF0Y2hlcy5tYXAoKHZhbHVlOlJlZ0V4cEV4ZWNBcnJheSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaXNVbm1hdGNoZWQgPSB2YWx1ZS5ncm91cHMudW5tYXRjaGVkICE9PSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgaWYoaXNVbm1hdGNoZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdW5NYXRjaGVkVGV4dCA9IHZhbHVlWzBdO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFBsYW5JdGVtKGluZGV4LCB2YWx1ZS5pbmRleCwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgdHJ1ZSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuTWF0Y2hlZFRleHQsIHVuTWF0Y2hlZFRleHQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IGlzQ29tcGxldGVkID0gdGhpcy5tYXRjaFZhbHVlKHZhbHVlLmdyb3Vwcy5jb21wbGV0aW9uLCAneCcpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzQnJlYWsgPSB0aGlzLm1hdGNoVmFsdWUodmFsdWUuZ3JvdXBzLmJyZWFrLCAnYnJlYWsnKTtcbiAgICAgICAgICAgICAgICBjb25zdCBpc0VuZCA9IHRoaXMubWF0Y2hWYWx1ZSh2YWx1ZS5ncm91cHMuZW5kLCAnZW5kJyk7XG4gICAgICAgICAgICAgICAgY29uc3QgdGltZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICAgICAgdGltZS5zZXRIb3VycyhwYXJzZUludCh2YWx1ZS5ncm91cHMuaG91cnMpKVxuICAgICAgICAgICAgICAgIHRpbWUuc2V0TWludXRlcyhwYXJzZUludCh2YWx1ZS5ncm91cHMubWludXRlcykpXG4gICAgICAgICAgICAgICAgdGltZS5zZXRTZWNvbmRzKDApO1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUGxhbkl0ZW0oXG4gICAgICAgICAgICAgICAgICAgIGluZGV4LCBcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUuaW5kZXgsIFxuICAgICAgICAgICAgICAgICAgICBpc0NvbXBsZXRlZCwgXG4gICAgICAgICAgICAgICAgICAgIGlzQnJlYWssXG4gICAgICAgICAgICAgICAgICAgIGlzRW5kLFxuICAgICAgICAgICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgdGltZSwgXG4gICAgICAgICAgICAgICAgICAgIGAke3ZhbHVlLmdyb3Vwcy5ob3Vycy5wYWRTdGFydCgyLCAnMCcpfToke3ZhbHVlLmdyb3Vwcy5taW51dGVzfWAsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlLmdyb3Vwcy50ZXh0Py50cmltKCksXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlWzBdXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBtYXRjaFZhbHVlKGlucHV0OiBhbnksIG1hdGNoOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIGlucHV0Py50cmltKCkudG9Mb2NhbGVMb3dlckNhc2UoKSA9PT0gbWF0Y2g7XG4gICAgfVxuXG59XG4iLCJmdW5jdGlvbiBub29wKCkgeyB9XG5jb25zdCBpZGVudGl0eSA9IHggPT4geDtcbmZ1bmN0aW9uIGFzc2lnbih0YXIsIHNyYykge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBmb3IgKGNvbnN0IGsgaW4gc3JjKVxuICAgICAgICB0YXJba10gPSBzcmNba107XG4gICAgcmV0dXJuIHRhcjtcbn1cbmZ1bmN0aW9uIGlzX3Byb21pc2UodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgdmFsdWUudGhlbiA9PT0gJ2Z1bmN0aW9uJztcbn1cbmZ1bmN0aW9uIGFkZF9sb2NhdGlvbihlbGVtZW50LCBmaWxlLCBsaW5lLCBjb2x1bW4sIGNoYXIpIHtcbiAgICBlbGVtZW50Ll9fc3ZlbHRlX21ldGEgPSB7XG4gICAgICAgIGxvYzogeyBmaWxlLCBsaW5lLCBjb2x1bW4sIGNoYXIgfVxuICAgIH07XG59XG5mdW5jdGlvbiBydW4oZm4pIHtcbiAgICByZXR1cm4gZm4oKTtcbn1cbmZ1bmN0aW9uIGJsYW5rX29iamVjdCgpIHtcbiAgICByZXR1cm4gT2JqZWN0LmNyZWF0ZShudWxsKTtcbn1cbmZ1bmN0aW9uIHJ1bl9hbGwoZm5zKSB7XG4gICAgZm5zLmZvckVhY2gocnVuKTtcbn1cbmZ1bmN0aW9uIGlzX2Z1bmN0aW9uKHRoaW5nKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB0aGluZyA9PT0gJ2Z1bmN0aW9uJztcbn1cbmZ1bmN0aW9uIHNhZmVfbm90X2VxdWFsKGEsIGIpIHtcbiAgICByZXR1cm4gYSAhPSBhID8gYiA9PSBiIDogYSAhPT0gYiB8fCAoKGEgJiYgdHlwZW9mIGEgPT09ICdvYmplY3QnKSB8fCB0eXBlb2YgYSA9PT0gJ2Z1bmN0aW9uJyk7XG59XG5mdW5jdGlvbiBub3RfZXF1YWwoYSwgYikge1xuICAgIHJldHVybiBhICE9IGEgPyBiID09IGIgOiBhICE9PSBiO1xufVxuZnVuY3Rpb24gaXNfZW1wdHkob2JqKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaikubGVuZ3RoID09PSAwO1xufVxuZnVuY3Rpb24gdmFsaWRhdGVfc3RvcmUoc3RvcmUsIG5hbWUpIHtcbiAgICBpZiAoc3RvcmUgIT0gbnVsbCAmJiB0eXBlb2Ygc3RvcmUuc3Vic2NyaWJlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJyR7bmFtZX0nIGlzIG5vdCBhIHN0b3JlIHdpdGggYSAnc3Vic2NyaWJlJyBtZXRob2RgKTtcbiAgICB9XG59XG5mdW5jdGlvbiBzdWJzY3JpYmUoc3RvcmUsIC4uLmNhbGxiYWNrcykge1xuICAgIGlmIChzdG9yZSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBub29wO1xuICAgIH1cbiAgICBjb25zdCB1bnN1YiA9IHN0b3JlLnN1YnNjcmliZSguLi5jYWxsYmFja3MpO1xuICAgIHJldHVybiB1bnN1Yi51bnN1YnNjcmliZSA/ICgpID0+IHVuc3ViLnVuc3Vic2NyaWJlKCkgOiB1bnN1Yjtcbn1cbmZ1bmN0aW9uIGdldF9zdG9yZV92YWx1ZShzdG9yZSkge1xuICAgIGxldCB2YWx1ZTtcbiAgICBzdWJzY3JpYmUoc3RvcmUsIF8gPT4gdmFsdWUgPSBfKSgpO1xuICAgIHJldHVybiB2YWx1ZTtcbn1cbmZ1bmN0aW9uIGNvbXBvbmVudF9zdWJzY3JpYmUoY29tcG9uZW50LCBzdG9yZSwgY2FsbGJhY2spIHtcbiAgICBjb21wb25lbnQuJCQub25fZGVzdHJveS5wdXNoKHN1YnNjcmliZShzdG9yZSwgY2FsbGJhY2spKTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZV9zbG90KGRlZmluaXRpb24sIGN0eCwgJCRzY29wZSwgZm4pIHtcbiAgICBpZiAoZGVmaW5pdGlvbikge1xuICAgICAgICBjb25zdCBzbG90X2N0eCA9IGdldF9zbG90X2NvbnRleHQoZGVmaW5pdGlvbiwgY3R4LCAkJHNjb3BlLCBmbik7XG4gICAgICAgIHJldHVybiBkZWZpbml0aW9uWzBdKHNsb3RfY3R4KTtcbiAgICB9XG59XG5mdW5jdGlvbiBnZXRfc2xvdF9jb250ZXh0KGRlZmluaXRpb24sIGN0eCwgJCRzY29wZSwgZm4pIHtcbiAgICByZXR1cm4gZGVmaW5pdGlvblsxXSAmJiBmblxuICAgICAgICA/IGFzc2lnbigkJHNjb3BlLmN0eC5zbGljZSgpLCBkZWZpbml0aW9uWzFdKGZuKGN0eCkpKVxuICAgICAgICA6ICQkc2NvcGUuY3R4O1xufVxuZnVuY3Rpb24gZ2V0X3Nsb3RfY2hhbmdlcyhkZWZpbml0aW9uLCAkJHNjb3BlLCBkaXJ0eSwgZm4pIHtcbiAgICBpZiAoZGVmaW5pdGlvblsyXSAmJiBmbikge1xuICAgICAgICBjb25zdCBsZXRzID0gZGVmaW5pdGlvblsyXShmbihkaXJ0eSkpO1xuICAgICAgICBpZiAoJCRzY29wZS5kaXJ0eSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gbGV0cztcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGxldHMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBjb25zdCBtZXJnZWQgPSBbXTtcbiAgICAgICAgICAgIGNvbnN0IGxlbiA9IE1hdGgubWF4KCQkc2NvcGUuZGlydHkubGVuZ3RoLCBsZXRzLmxlbmd0aCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgbWVyZ2VkW2ldID0gJCRzY29wZS5kaXJ0eVtpXSB8IGxldHNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbWVyZ2VkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAkJHNjb3BlLmRpcnR5IHwgbGV0cztcbiAgICB9XG4gICAgcmV0dXJuICQkc2NvcGUuZGlydHk7XG59XG5mdW5jdGlvbiB1cGRhdGVfc2xvdChzbG90LCBzbG90X2RlZmluaXRpb24sIGN0eCwgJCRzY29wZSwgZGlydHksIGdldF9zbG90X2NoYW5nZXNfZm4sIGdldF9zbG90X2NvbnRleHRfZm4pIHtcbiAgICBjb25zdCBzbG90X2NoYW5nZXMgPSBnZXRfc2xvdF9jaGFuZ2VzKHNsb3RfZGVmaW5pdGlvbiwgJCRzY29wZSwgZGlydHksIGdldF9zbG90X2NoYW5nZXNfZm4pO1xuICAgIGlmIChzbG90X2NoYW5nZXMpIHtcbiAgICAgICAgY29uc3Qgc2xvdF9jb250ZXh0ID0gZ2V0X3Nsb3RfY29udGV4dChzbG90X2RlZmluaXRpb24sIGN0eCwgJCRzY29wZSwgZ2V0X3Nsb3RfY29udGV4dF9mbik7XG4gICAgICAgIHNsb3QucChzbG90X2NvbnRleHQsIHNsb3RfY2hhbmdlcyk7XG4gICAgfVxufVxuZnVuY3Rpb24gZXhjbHVkZV9pbnRlcm5hbF9wcm9wcyhwcm9wcykge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIGZvciAoY29uc3QgayBpbiBwcm9wcylcbiAgICAgICAgaWYgKGtbMF0gIT09ICckJylcbiAgICAgICAgICAgIHJlc3VsdFtrXSA9IHByb3BzW2tdO1xuICAgIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBjb21wdXRlX3Jlc3RfcHJvcHMocHJvcHMsIGtleXMpIHtcbiAgICBjb25zdCByZXN0ID0ge307XG4gICAga2V5cyA9IG5ldyBTZXQoa2V5cyk7XG4gICAgZm9yIChjb25zdCBrIGluIHByb3BzKVxuICAgICAgICBpZiAoIWtleXMuaGFzKGspICYmIGtbMF0gIT09ICckJylcbiAgICAgICAgICAgIHJlc3Rba10gPSBwcm9wc1trXTtcbiAgICByZXR1cm4gcmVzdDtcbn1cbmZ1bmN0aW9uIGNvbXB1dGVfc2xvdHMoc2xvdHMpIHtcbiAgICBjb25zdCByZXN1bHQgPSB7fTtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBzbG90cykge1xuICAgICAgICByZXN1bHRba2V5XSA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBvbmNlKGZuKSB7XG4gICAgbGV0IHJhbiA9IGZhbHNlO1xuICAgIHJldHVybiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICBpZiAocmFuKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICByYW4gPSB0cnVlO1xuICAgICAgICBmbi5jYWxsKHRoaXMsIC4uLmFyZ3MpO1xuICAgIH07XG59XG5mdW5jdGlvbiBudWxsX3RvX2VtcHR5KHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09IG51bGwgPyAnJyA6IHZhbHVlO1xufVxuZnVuY3Rpb24gc2V0X3N0b3JlX3ZhbHVlKHN0b3JlLCByZXQsIHZhbHVlID0gcmV0KSB7XG4gICAgc3RvcmUuc2V0KHZhbHVlKTtcbiAgICByZXR1cm4gcmV0O1xufVxuY29uc3QgaGFzX3Byb3AgPSAob2JqLCBwcm9wKSA9PiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbmZ1bmN0aW9uIGFjdGlvbl9kZXN0cm95ZXIoYWN0aW9uX3Jlc3VsdCkge1xuICAgIHJldHVybiBhY3Rpb25fcmVzdWx0ICYmIGlzX2Z1bmN0aW9uKGFjdGlvbl9yZXN1bHQuZGVzdHJveSkgPyBhY3Rpb25fcmVzdWx0LmRlc3Ryb3kgOiBub29wO1xufVxuXG5jb25zdCBpc19jbGllbnQgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJztcbmxldCBub3cgPSBpc19jbGllbnRcbiAgICA/ICgpID0+IHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKVxuICAgIDogKCkgPT4gRGF0ZS5ub3coKTtcbmxldCByYWYgPSBpc19jbGllbnQgPyBjYiA9PiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoY2IpIDogbm9vcDtcbi8vIHVzZWQgaW50ZXJuYWxseSBmb3IgdGVzdGluZ1xuZnVuY3Rpb24gc2V0X25vdyhmbikge1xuICAgIG5vdyA9IGZuO1xufVxuZnVuY3Rpb24gc2V0X3JhZihmbikge1xuICAgIHJhZiA9IGZuO1xufVxuXG5jb25zdCB0YXNrcyA9IG5ldyBTZXQoKTtcbmZ1bmN0aW9uIHJ1bl90YXNrcyhub3cpIHtcbiAgICB0YXNrcy5mb3JFYWNoKHRhc2sgPT4ge1xuICAgICAgICBpZiAoIXRhc2suYyhub3cpKSB7XG4gICAgICAgICAgICB0YXNrcy5kZWxldGUodGFzayk7XG4gICAgICAgICAgICB0YXNrLmYoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGlmICh0YXNrcy5zaXplICE9PSAwKVxuICAgICAgICByYWYocnVuX3Rhc2tzKTtcbn1cbi8qKlxuICogRm9yIHRlc3RpbmcgcHVycG9zZXMgb25seSFcbiAqL1xuZnVuY3Rpb24gY2xlYXJfbG9vcHMoKSB7XG4gICAgdGFza3MuY2xlYXIoKTtcbn1cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyB0YXNrIHRoYXQgcnVucyBvbiBlYWNoIHJhZiBmcmFtZVxuICogdW50aWwgaXQgcmV0dXJucyBhIGZhbHN5IHZhbHVlIG9yIGlzIGFib3J0ZWRcbiAqL1xuZnVuY3Rpb24gbG9vcChjYWxsYmFjaykge1xuICAgIGxldCB0YXNrO1xuICAgIGlmICh0YXNrcy5zaXplID09PSAwKVxuICAgICAgICByYWYocnVuX3Rhc2tzKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBwcm9taXNlOiBuZXcgUHJvbWlzZShmdWxmaWxsID0+IHtcbiAgICAgICAgICAgIHRhc2tzLmFkZCh0YXNrID0geyBjOiBjYWxsYmFjaywgZjogZnVsZmlsbCB9KTtcbiAgICAgICAgfSksXG4gICAgICAgIGFib3J0KCkge1xuICAgICAgICAgICAgdGFza3MuZGVsZXRlKHRhc2spO1xuICAgICAgICB9XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gYXBwZW5kKHRhcmdldCwgbm9kZSkge1xuICAgIHRhcmdldC5hcHBlbmRDaGlsZChub2RlKTtcbn1cbmZ1bmN0aW9uIGluc2VydCh0YXJnZXQsIG5vZGUsIGFuY2hvcikge1xuICAgIHRhcmdldC5pbnNlcnRCZWZvcmUobm9kZSwgYW5jaG9yIHx8IG51bGwpO1xufVxuZnVuY3Rpb24gZGV0YWNoKG5vZGUpIHtcbiAgICBub2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZSk7XG59XG5mdW5jdGlvbiBkZXN0cm95X2VhY2goaXRlcmF0aW9ucywgZGV0YWNoaW5nKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVyYXRpb25zLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGlmIChpdGVyYXRpb25zW2ldKVxuICAgICAgICAgICAgaXRlcmF0aW9uc1tpXS5kKGRldGFjaGluZyk7XG4gICAgfVxufVxuZnVuY3Rpb24gZWxlbWVudChuYW1lKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobmFtZSk7XG59XG5mdW5jdGlvbiBlbGVtZW50X2lzKG5hbWUsIGlzKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobmFtZSwgeyBpcyB9KTtcbn1cbmZ1bmN0aW9uIG9iamVjdF93aXRob3V0X3Byb3BlcnRpZXMob2JqLCBleGNsdWRlKSB7XG4gICAgY29uc3QgdGFyZ2V0ID0ge307XG4gICAgZm9yIChjb25zdCBrIGluIG9iaikge1xuICAgICAgICBpZiAoaGFzX3Byb3Aob2JqLCBrKVxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgJiYgZXhjbHVkZS5pbmRleE9mKGspID09PSAtMSkge1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgdGFyZ2V0W2tdID0gb2JqW2tdO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXQ7XG59XG5mdW5jdGlvbiBzdmdfZWxlbWVudChuYW1lKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCBuYW1lKTtcbn1cbmZ1bmN0aW9uIHRleHQoZGF0YSkge1xuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShkYXRhKTtcbn1cbmZ1bmN0aW9uIHNwYWNlKCkge1xuICAgIHJldHVybiB0ZXh0KCcgJyk7XG59XG5mdW5jdGlvbiBlbXB0eSgpIHtcbiAgICByZXR1cm4gdGV4dCgnJyk7XG59XG5mdW5jdGlvbiBsaXN0ZW4obm9kZSwgZXZlbnQsIGhhbmRsZXIsIG9wdGlvbnMpIHtcbiAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIsIG9wdGlvbnMpO1xuICAgIHJldHVybiAoKSA9PiBub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIsIG9wdGlvbnMpO1xufVxuZnVuY3Rpb24gcHJldmVudF9kZWZhdWx0KGZuKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHJldHVybiBmbi5jYWxsKHRoaXMsIGV2ZW50KTtcbiAgICB9O1xufVxuZnVuY3Rpb24gc3RvcF9wcm9wYWdhdGlvbihmbikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgcmV0dXJuIGZuLmNhbGwodGhpcywgZXZlbnQpO1xuICAgIH07XG59XG5mdW5jdGlvbiBzZWxmKGZuKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGlmIChldmVudC50YXJnZXQgPT09IHRoaXMpXG4gICAgICAgICAgICBmbi5jYWxsKHRoaXMsIGV2ZW50KTtcbiAgICB9O1xufVxuZnVuY3Rpb24gYXR0cihub2RlLCBhdHRyaWJ1dGUsIHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09IG51bGwpXG4gICAgICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZSk7XG4gICAgZWxzZSBpZiAobm9kZS5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlKSAhPT0gdmFsdWUpXG4gICAgICAgIG5vZGUuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZSwgdmFsdWUpO1xufVxuZnVuY3Rpb24gc2V0X2F0dHJpYnV0ZXMobm9kZSwgYXR0cmlidXRlcykge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjb25zdCBkZXNjcmlwdG9ycyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKG5vZGUuX19wcm90b19fKTtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIGlmIChhdHRyaWJ1dGVzW2tleV0gPT0gbnVsbCkge1xuICAgICAgICAgICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUoa2V5KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChrZXkgPT09ICdzdHlsZScpIHtcbiAgICAgICAgICAgIG5vZGUuc3R5bGUuY3NzVGV4dCA9IGF0dHJpYnV0ZXNba2V5XTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChrZXkgPT09ICdfX3ZhbHVlJykge1xuICAgICAgICAgICAgbm9kZS52YWx1ZSA9IG5vZGVba2V5XSA9IGF0dHJpYnV0ZXNba2V5XTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkZXNjcmlwdG9yc1trZXldICYmIGRlc2NyaXB0b3JzW2tleV0uc2V0KSB7XG4gICAgICAgICAgICBub2RlW2tleV0gPSBhdHRyaWJ1dGVzW2tleV07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhdHRyKG5vZGUsIGtleSwgYXR0cmlidXRlc1trZXldKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIHNldF9zdmdfYXR0cmlidXRlcyhub2RlLCBhdHRyaWJ1dGVzKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gYXR0cmlidXRlcykge1xuICAgICAgICBhdHRyKG5vZGUsIGtleSwgYXR0cmlidXRlc1trZXldKTtcbiAgICB9XG59XG5mdW5jdGlvbiBzZXRfY3VzdG9tX2VsZW1lbnRfZGF0YShub2RlLCBwcm9wLCB2YWx1ZSkge1xuICAgIGlmIChwcm9wIGluIG5vZGUpIHtcbiAgICAgICAgbm9kZVtwcm9wXSA9IHZhbHVlO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgYXR0cihub2RlLCBwcm9wLCB2YWx1ZSk7XG4gICAgfVxufVxuZnVuY3Rpb24geGxpbmtfYXR0cihub2RlLCBhdHRyaWJ1dGUsIHZhbHVlKSB7XG4gICAgbm9kZS5zZXRBdHRyaWJ1dGVOUygnaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaycsIGF0dHJpYnV0ZSwgdmFsdWUpO1xufVxuZnVuY3Rpb24gZ2V0X2JpbmRpbmdfZ3JvdXBfdmFsdWUoZ3JvdXAsIF9fdmFsdWUsIGNoZWNrZWQpIHtcbiAgICBjb25zdCB2YWx1ZSA9IG5ldyBTZXQoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdyb3VwLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGlmIChncm91cFtpXS5jaGVja2VkKVxuICAgICAgICAgICAgdmFsdWUuYWRkKGdyb3VwW2ldLl9fdmFsdWUpO1xuICAgIH1cbiAgICBpZiAoIWNoZWNrZWQpIHtcbiAgICAgICAgdmFsdWUuZGVsZXRlKF9fdmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gQXJyYXkuZnJvbSh2YWx1ZSk7XG59XG5mdW5jdGlvbiB0b19udW1iZXIodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09ICcnID8gbnVsbCA6ICt2YWx1ZTtcbn1cbmZ1bmN0aW9uIHRpbWVfcmFuZ2VzX3RvX2FycmF5KHJhbmdlcykge1xuICAgIGNvbnN0IGFycmF5ID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByYW5nZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgYXJyYXkucHVzaCh7IHN0YXJ0OiByYW5nZXMuc3RhcnQoaSksIGVuZDogcmFuZ2VzLmVuZChpKSB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5O1xufVxuZnVuY3Rpb24gY2hpbGRyZW4oZWxlbWVudCkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKGVsZW1lbnQuY2hpbGROb2Rlcyk7XG59XG5mdW5jdGlvbiBjbGFpbV9lbGVtZW50KG5vZGVzLCBuYW1lLCBhdHRyaWJ1dGVzLCBzdmcpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgaWYgKG5vZGUubm9kZU5hbWUgPT09IG5hbWUpIHtcbiAgICAgICAgICAgIGxldCBqID0gMDtcbiAgICAgICAgICAgIGNvbnN0IHJlbW92ZSA9IFtdO1xuICAgICAgICAgICAgd2hpbGUgKGogPCBub2RlLmF0dHJpYnV0ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYXR0cmlidXRlID0gbm9kZS5hdHRyaWJ1dGVzW2orK107XG4gICAgICAgICAgICAgICAgaWYgKCFhdHRyaWJ1dGVzW2F0dHJpYnV0ZS5uYW1lXSkge1xuICAgICAgICAgICAgICAgICAgICByZW1vdmUucHVzaChhdHRyaWJ1dGUubmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCByZW1vdmUubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZShyZW1vdmVba10pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5vZGVzLnNwbGljZShpLCAxKVswXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3ZnID8gc3ZnX2VsZW1lbnQobmFtZSkgOiBlbGVtZW50KG5hbWUpO1xufVxuZnVuY3Rpb24gY2xhaW1fdGV4dChub2RlcywgZGF0YSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY29uc3Qgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMykge1xuICAgICAgICAgICAgbm9kZS5kYXRhID0gJycgKyBkYXRhO1xuICAgICAgICAgICAgcmV0dXJuIG5vZGVzLnNwbGljZShpLCAxKVswXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGV4dChkYXRhKTtcbn1cbmZ1bmN0aW9uIGNsYWltX3NwYWNlKG5vZGVzKSB7XG4gICAgcmV0dXJuIGNsYWltX3RleHQobm9kZXMsICcgJyk7XG59XG5mdW5jdGlvbiBzZXRfZGF0YSh0ZXh0LCBkYXRhKSB7XG4gICAgZGF0YSA9ICcnICsgZGF0YTtcbiAgICBpZiAodGV4dC53aG9sZVRleHQgIT09IGRhdGEpXG4gICAgICAgIHRleHQuZGF0YSA9IGRhdGE7XG59XG5mdW5jdGlvbiBzZXRfaW5wdXRfdmFsdWUoaW5wdXQsIHZhbHVlKSB7XG4gICAgaW5wdXQudmFsdWUgPSB2YWx1ZSA9PSBudWxsID8gJycgOiB2YWx1ZTtcbn1cbmZ1bmN0aW9uIHNldF9pbnB1dF90eXBlKGlucHV0LCB0eXBlKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaW5wdXQudHlwZSA9IHR5cGU7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICB9XG59XG5mdW5jdGlvbiBzZXRfc3R5bGUobm9kZSwga2V5LCB2YWx1ZSwgaW1wb3J0YW50KSB7XG4gICAgbm9kZS5zdHlsZS5zZXRQcm9wZXJ0eShrZXksIHZhbHVlLCBpbXBvcnRhbnQgPyAnaW1wb3J0YW50JyA6ICcnKTtcbn1cbmZ1bmN0aW9uIHNlbGVjdF9vcHRpb24oc2VsZWN0LCB2YWx1ZSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VsZWN0Lm9wdGlvbnMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY29uc3Qgb3B0aW9uID0gc2VsZWN0Lm9wdGlvbnNbaV07XG4gICAgICAgIGlmIChvcHRpb24uX192YWx1ZSA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiBzZWxlY3Rfb3B0aW9ucyhzZWxlY3QsIHZhbHVlKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWxlY3Qub3B0aW9ucy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb25zdCBvcHRpb24gPSBzZWxlY3Qub3B0aW9uc1tpXTtcbiAgICAgICAgb3B0aW9uLnNlbGVjdGVkID0gfnZhbHVlLmluZGV4T2Yob3B0aW9uLl9fdmFsdWUpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHNlbGVjdF92YWx1ZShzZWxlY3QpIHtcbiAgICBjb25zdCBzZWxlY3RlZF9vcHRpb24gPSBzZWxlY3QucXVlcnlTZWxlY3RvcignOmNoZWNrZWQnKSB8fCBzZWxlY3Qub3B0aW9uc1swXTtcbiAgICByZXR1cm4gc2VsZWN0ZWRfb3B0aW9uICYmIHNlbGVjdGVkX29wdGlvbi5fX3ZhbHVlO1xufVxuZnVuY3Rpb24gc2VsZWN0X211bHRpcGxlX3ZhbHVlKHNlbGVjdCkge1xuICAgIHJldHVybiBbXS5tYXAuY2FsbChzZWxlY3QucXVlcnlTZWxlY3RvckFsbCgnOmNoZWNrZWQnKSwgb3B0aW9uID0+IG9wdGlvbi5fX3ZhbHVlKTtcbn1cbi8vIHVuZm9ydHVuYXRlbHkgdGhpcyBjYW4ndCBiZSBhIGNvbnN0YW50IGFzIHRoYXQgd291bGRuJ3QgYmUgdHJlZS1zaGFrZWFibGVcbi8vIHNvIHdlIGNhY2hlIHRoZSByZXN1bHQgaW5zdGVhZFxubGV0IGNyb3Nzb3JpZ2luO1xuZnVuY3Rpb24gaXNfY3Jvc3NvcmlnaW4oKSB7XG4gICAgaWYgKGNyb3Nzb3JpZ2luID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY3Jvc3NvcmlnaW4gPSBmYWxzZTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cucGFyZW50KSB7XG4gICAgICAgICAgICAgICAgdm9pZCB3aW5kb3cucGFyZW50LmRvY3VtZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY3Jvc3NvcmlnaW4gPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjcm9zc29yaWdpbjtcbn1cbmZ1bmN0aW9uIGFkZF9yZXNpemVfbGlzdGVuZXIobm9kZSwgZm4pIHtcbiAgICBjb25zdCBjb21wdXRlZF9zdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG4gICAgY29uc3Qgel9pbmRleCA9IChwYXJzZUludChjb21wdXRlZF9zdHlsZS56SW5kZXgpIHx8IDApIC0gMTtcbiAgICBpZiAoY29tcHV0ZWRfc3R5bGUucG9zaXRpb24gPT09ICdzdGF0aWMnKSB7XG4gICAgICAgIG5vZGUuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xuICAgIH1cbiAgICBjb25zdCBpZnJhbWUgPSBlbGVtZW50KCdpZnJhbWUnKTtcbiAgICBpZnJhbWUuc2V0QXR0cmlidXRlKCdzdHlsZScsICdkaXNwbGF5OiBibG9jazsgcG9zaXRpb246IGFic29sdXRlOyB0b3A6IDA7IGxlZnQ6IDA7IHdpZHRoOiAxMDAlOyBoZWlnaHQ6IDEwMCU7ICcgK1xuICAgICAgICBgb3ZlcmZsb3c6IGhpZGRlbjsgYm9yZGVyOiAwOyBvcGFjaXR5OiAwOyBwb2ludGVyLWV2ZW50czogbm9uZTsgei1pbmRleDogJHt6X2luZGV4fTtgKTtcbiAgICBpZnJhbWUuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgaWZyYW1lLnRhYkluZGV4ID0gLTE7XG4gICAgY29uc3QgY3Jvc3NvcmlnaW4gPSBpc19jcm9zc29yaWdpbigpO1xuICAgIGxldCB1bnN1YnNjcmliZTtcbiAgICBpZiAoY3Jvc3NvcmlnaW4pIHtcbiAgICAgICAgaWZyYW1lLnNyYyA9IFwiZGF0YTp0ZXh0L2h0bWwsPHNjcmlwdD5vbnJlc2l6ZT1mdW5jdGlvbigpe3BhcmVudC5wb3N0TWVzc2FnZSgwLCcqJyl9PC9zY3JpcHQ+XCI7XG4gICAgICAgIHVuc3Vic2NyaWJlID0gbGlzdGVuKHdpbmRvdywgJ21lc3NhZ2UnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmIChldmVudC5zb3VyY2UgPT09IGlmcmFtZS5jb250ZW50V2luZG93KVxuICAgICAgICAgICAgICAgIGZuKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWZyYW1lLnNyYyA9ICdhYm91dDpibGFuayc7XG4gICAgICAgIGlmcmFtZS5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgICB1bnN1YnNjcmliZSA9IGxpc3RlbihpZnJhbWUuY29udGVudFdpbmRvdywgJ3Jlc2l6ZScsIGZuKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgYXBwZW5kKG5vZGUsIGlmcmFtZSk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgaWYgKGNyb3Nzb3JpZ2luKSB7XG4gICAgICAgICAgICB1bnN1YnNjcmliZSgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHVuc3Vic2NyaWJlICYmIGlmcmFtZS5jb250ZW50V2luZG93KSB7XG4gICAgICAgICAgICB1bnN1YnNjcmliZSgpO1xuICAgICAgICB9XG4gICAgICAgIGRldGFjaChpZnJhbWUpO1xuICAgIH07XG59XG5mdW5jdGlvbiB0b2dnbGVfY2xhc3MoZWxlbWVudCwgbmFtZSwgdG9nZ2xlKSB7XG4gICAgZWxlbWVudC5jbGFzc0xpc3RbdG9nZ2xlID8gJ2FkZCcgOiAncmVtb3ZlJ10obmFtZSk7XG59XG5mdW5jdGlvbiBjdXN0b21fZXZlbnQodHlwZSwgZGV0YWlsKSB7XG4gICAgY29uc3QgZSA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdDdXN0b21FdmVudCcpO1xuICAgIGUuaW5pdEN1c3RvbUV2ZW50KHR5cGUsIGZhbHNlLCBmYWxzZSwgZGV0YWlsKTtcbiAgICByZXR1cm4gZTtcbn1cbmZ1bmN0aW9uIHF1ZXJ5X3NlbGVjdG9yX2FsbChzZWxlY3RvciwgcGFyZW50ID0gZG9jdW1lbnQuYm9keSkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHBhcmVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSk7XG59XG5jbGFzcyBIdG1sVGFnIHtcbiAgICBjb25zdHJ1Y3RvcihhbmNob3IgPSBudWxsKSB7XG4gICAgICAgIHRoaXMuYSA9IGFuY2hvcjtcbiAgICAgICAgdGhpcy5lID0gdGhpcy5uID0gbnVsbDtcbiAgICB9XG4gICAgbShodG1sLCB0YXJnZXQsIGFuY2hvciA9IG51bGwpIHtcbiAgICAgICAgaWYgKCF0aGlzLmUpIHtcbiAgICAgICAgICAgIHRoaXMuZSA9IGVsZW1lbnQodGFyZ2V0Lm5vZGVOYW1lKTtcbiAgICAgICAgICAgIHRoaXMudCA9IHRhcmdldDtcbiAgICAgICAgICAgIHRoaXMuaChodG1sKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmkoYW5jaG9yKTtcbiAgICB9XG4gICAgaChodG1sKSB7XG4gICAgICAgIHRoaXMuZS5pbm5lckhUTUwgPSBodG1sO1xuICAgICAgICB0aGlzLm4gPSBBcnJheS5mcm9tKHRoaXMuZS5jaGlsZE5vZGVzKTtcbiAgICB9XG4gICAgaShhbmNob3IpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm4ubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGluc2VydCh0aGlzLnQsIHRoaXMubltpXSwgYW5jaG9yKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwKGh0bWwpIHtcbiAgICAgICAgdGhpcy5kKCk7XG4gICAgICAgIHRoaXMuaChodG1sKTtcbiAgICAgICAgdGhpcy5pKHRoaXMuYSk7XG4gICAgfVxuICAgIGQoKSB7XG4gICAgICAgIHRoaXMubi5mb3JFYWNoKGRldGFjaCk7XG4gICAgfVxufVxuZnVuY3Rpb24gYXR0cmlidXRlX3RvX29iamVjdChhdHRyaWJ1dGVzKSB7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgZm9yIChjb25zdCBhdHRyaWJ1dGUgb2YgYXR0cmlidXRlcykge1xuICAgICAgICByZXN1bHRbYXR0cmlidXRlLm5hbWVdID0gYXR0cmlidXRlLnZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gZ2V0X2N1c3RvbV9lbGVtZW50c19zbG90cyhlbGVtZW50KSB7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgZWxlbWVudC5jaGlsZE5vZGVzLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgICAgcmVzdWx0W25vZGUuc2xvdCB8fCAnZGVmYXVsdCddID0gdHJ1ZTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG5jb25zdCBhY3RpdmVfZG9jcyA9IG5ldyBTZXQoKTtcbmxldCBhY3RpdmUgPSAwO1xuLy8gaHR0cHM6Ly9naXRodWIuY29tL2Rhcmtza3lhcHAvc3RyaW5nLWhhc2gvYmxvYi9tYXN0ZXIvaW5kZXguanNcbmZ1bmN0aW9uIGhhc2goc3RyKSB7XG4gICAgbGV0IGhhc2ggPSA1MzgxO1xuICAgIGxldCBpID0gc3RyLmxlbmd0aDtcbiAgICB3aGlsZSAoaS0tKVxuICAgICAgICBoYXNoID0gKChoYXNoIDw8IDUpIC0gaGFzaCkgXiBzdHIuY2hhckNvZGVBdChpKTtcbiAgICByZXR1cm4gaGFzaCA+Pj4gMDtcbn1cbmZ1bmN0aW9uIGNyZWF0ZV9ydWxlKG5vZGUsIGEsIGIsIGR1cmF0aW9uLCBkZWxheSwgZWFzZSwgZm4sIHVpZCA9IDApIHtcbiAgICBjb25zdCBzdGVwID0gMTYuNjY2IC8gZHVyYXRpb247XG4gICAgbGV0IGtleWZyYW1lcyA9ICd7XFxuJztcbiAgICBmb3IgKGxldCBwID0gMDsgcCA8PSAxOyBwICs9IHN0ZXApIHtcbiAgICAgICAgY29uc3QgdCA9IGEgKyAoYiAtIGEpICogZWFzZShwKTtcbiAgICAgICAga2V5ZnJhbWVzICs9IHAgKiAxMDAgKyBgJXske2ZuKHQsIDEgLSB0KX19XFxuYDtcbiAgICB9XG4gICAgY29uc3QgcnVsZSA9IGtleWZyYW1lcyArIGAxMDAlIHske2ZuKGIsIDEgLSBiKX19XFxufWA7XG4gICAgY29uc3QgbmFtZSA9IGBfX3N2ZWx0ZV8ke2hhc2gocnVsZSl9XyR7dWlkfWA7XG4gICAgY29uc3QgZG9jID0gbm9kZS5vd25lckRvY3VtZW50O1xuICAgIGFjdGl2ZV9kb2NzLmFkZChkb2MpO1xuICAgIGNvbnN0IHN0eWxlc2hlZXQgPSBkb2MuX19zdmVsdGVfc3R5bGVzaGVldCB8fCAoZG9jLl9fc3ZlbHRlX3N0eWxlc2hlZXQgPSBkb2MuaGVhZC5hcHBlbmRDaGlsZChlbGVtZW50KCdzdHlsZScpKS5zaGVldCk7XG4gICAgY29uc3QgY3VycmVudF9ydWxlcyA9IGRvYy5fX3N2ZWx0ZV9ydWxlcyB8fCAoZG9jLl9fc3ZlbHRlX3J1bGVzID0ge30pO1xuICAgIGlmICghY3VycmVudF9ydWxlc1tuYW1lXSkge1xuICAgICAgICBjdXJyZW50X3J1bGVzW25hbWVdID0gdHJ1ZTtcbiAgICAgICAgc3R5bGVzaGVldC5pbnNlcnRSdWxlKGBAa2V5ZnJhbWVzICR7bmFtZX0gJHtydWxlfWAsIHN0eWxlc2hlZXQuY3NzUnVsZXMubGVuZ3RoKTtcbiAgICB9XG4gICAgY29uc3QgYW5pbWF0aW9uID0gbm9kZS5zdHlsZS5hbmltYXRpb24gfHwgJyc7XG4gICAgbm9kZS5zdHlsZS5hbmltYXRpb24gPSBgJHthbmltYXRpb24gPyBgJHthbmltYXRpb259LCBgIDogJyd9JHtuYW1lfSAke2R1cmF0aW9ufW1zIGxpbmVhciAke2RlbGF5fW1zIDEgYm90aGA7XG4gICAgYWN0aXZlICs9IDE7XG4gICAgcmV0dXJuIG5hbWU7XG59XG5mdW5jdGlvbiBkZWxldGVfcnVsZShub2RlLCBuYW1lKSB7XG4gICAgY29uc3QgcHJldmlvdXMgPSAobm9kZS5zdHlsZS5hbmltYXRpb24gfHwgJycpLnNwbGl0KCcsICcpO1xuICAgIGNvbnN0IG5leHQgPSBwcmV2aW91cy5maWx0ZXIobmFtZVxuICAgICAgICA/IGFuaW0gPT4gYW5pbS5pbmRleE9mKG5hbWUpIDwgMCAvLyByZW1vdmUgc3BlY2lmaWMgYW5pbWF0aW9uXG4gICAgICAgIDogYW5pbSA9PiBhbmltLmluZGV4T2YoJ19fc3ZlbHRlJykgPT09IC0xIC8vIHJlbW92ZSBhbGwgU3ZlbHRlIGFuaW1hdGlvbnNcbiAgICApO1xuICAgIGNvbnN0IGRlbGV0ZWQgPSBwcmV2aW91cy5sZW5ndGggLSBuZXh0Lmxlbmd0aDtcbiAgICBpZiAoZGVsZXRlZCkge1xuICAgICAgICBub2RlLnN0eWxlLmFuaW1hdGlvbiA9IG5leHQuam9pbignLCAnKTtcbiAgICAgICAgYWN0aXZlIC09IGRlbGV0ZWQ7XG4gICAgICAgIGlmICghYWN0aXZlKVxuICAgICAgICAgICAgY2xlYXJfcnVsZXMoKTtcbiAgICB9XG59XG5mdW5jdGlvbiBjbGVhcl9ydWxlcygpIHtcbiAgICByYWYoKCkgPT4ge1xuICAgICAgICBpZiAoYWN0aXZlKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBhY3RpdmVfZG9jcy5mb3JFYWNoKGRvYyA9PiB7XG4gICAgICAgICAgICBjb25zdCBzdHlsZXNoZWV0ID0gZG9jLl9fc3ZlbHRlX3N0eWxlc2hlZXQ7XG4gICAgICAgICAgICBsZXQgaSA9IHN0eWxlc2hlZXQuY3NzUnVsZXMubGVuZ3RoO1xuICAgICAgICAgICAgd2hpbGUgKGktLSlcbiAgICAgICAgICAgICAgICBzdHlsZXNoZWV0LmRlbGV0ZVJ1bGUoaSk7XG4gICAgICAgICAgICBkb2MuX19zdmVsdGVfcnVsZXMgPSB7fTtcbiAgICAgICAgfSk7XG4gICAgICAgIGFjdGl2ZV9kb2NzLmNsZWFyKCk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZV9hbmltYXRpb24obm9kZSwgZnJvbSwgZm4sIHBhcmFtcykge1xuICAgIGlmICghZnJvbSlcbiAgICAgICAgcmV0dXJuIG5vb3A7XG4gICAgY29uc3QgdG8gPSBub2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGlmIChmcm9tLmxlZnQgPT09IHRvLmxlZnQgJiYgZnJvbS5yaWdodCA9PT0gdG8ucmlnaHQgJiYgZnJvbS50b3AgPT09IHRvLnRvcCAmJiBmcm9tLmJvdHRvbSA9PT0gdG8uYm90dG9tKVxuICAgICAgICByZXR1cm4gbm9vcDtcbiAgICBjb25zdCB7IGRlbGF5ID0gMCwgZHVyYXRpb24gPSAzMDAsIGVhc2luZyA9IGlkZW50aXR5LCBcbiAgICAvLyBAdHMtaWdub3JlIHRvZG86IHNob3VsZCB0aGlzIGJlIHNlcGFyYXRlZCBmcm9tIGRlc3RydWN0dXJpbmc/IE9yIHN0YXJ0L2VuZCBhZGRlZCB0byBwdWJsaWMgYXBpIGFuZCBkb2N1bWVudGF0aW9uP1xuICAgIHN0YXJ0OiBzdGFydF90aW1lID0gbm93KCkgKyBkZWxheSwgXG4gICAgLy8gQHRzLWlnbm9yZSB0b2RvOlxuICAgIGVuZCA9IHN0YXJ0X3RpbWUgKyBkdXJhdGlvbiwgdGljayA9IG5vb3AsIGNzcyB9ID0gZm4obm9kZSwgeyBmcm9tLCB0byB9LCBwYXJhbXMpO1xuICAgIGxldCBydW5uaW5nID0gdHJ1ZTtcbiAgICBsZXQgc3RhcnRlZCA9IGZhbHNlO1xuICAgIGxldCBuYW1lO1xuICAgIGZ1bmN0aW9uIHN0YXJ0KCkge1xuICAgICAgICBpZiAoY3NzKSB7XG4gICAgICAgICAgICBuYW1lID0gY3JlYXRlX3J1bGUobm9kZSwgMCwgMSwgZHVyYXRpb24sIGRlbGF5LCBlYXNpbmcsIGNzcyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFkZWxheSkge1xuICAgICAgICAgICAgc3RhcnRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gc3RvcCgpIHtcbiAgICAgICAgaWYgKGNzcylcbiAgICAgICAgICAgIGRlbGV0ZV9ydWxlKG5vZGUsIG5hbWUpO1xuICAgICAgICBydW5uaW5nID0gZmFsc2U7XG4gICAgfVxuICAgIGxvb3Aobm93ID0+IHtcbiAgICAgICAgaWYgKCFzdGFydGVkICYmIG5vdyA+PSBzdGFydF90aW1lKSB7XG4gICAgICAgICAgICBzdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3RhcnRlZCAmJiBub3cgPj0gZW5kKSB7XG4gICAgICAgICAgICB0aWNrKDEsIDApO1xuICAgICAgICAgICAgc3RvcCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghcnVubmluZykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzdGFydGVkKSB7XG4gICAgICAgICAgICBjb25zdCBwID0gbm93IC0gc3RhcnRfdGltZTtcbiAgICAgICAgICAgIGNvbnN0IHQgPSAwICsgMSAqIGVhc2luZyhwIC8gZHVyYXRpb24pO1xuICAgICAgICAgICAgdGljayh0LCAxIC0gdCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG4gICAgc3RhcnQoKTtcbiAgICB0aWNrKDAsIDEpO1xuICAgIHJldHVybiBzdG9wO1xufVxuZnVuY3Rpb24gZml4X3Bvc2l0aW9uKG5vZGUpIHtcbiAgICBjb25zdCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUobm9kZSk7XG4gICAgaWYgKHN0eWxlLnBvc2l0aW9uICE9PSAnYWJzb2x1dGUnICYmIHN0eWxlLnBvc2l0aW9uICE9PSAnZml4ZWQnKSB7XG4gICAgICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gc3R5bGU7XG4gICAgICAgIGNvbnN0IGEgPSBub2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBub2RlLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgbm9kZS5zdHlsZS53aWR0aCA9IHdpZHRoO1xuICAgICAgICBub2RlLnN0eWxlLmhlaWdodCA9IGhlaWdodDtcbiAgICAgICAgYWRkX3RyYW5zZm9ybShub2RlLCBhKTtcbiAgICB9XG59XG5mdW5jdGlvbiBhZGRfdHJhbnNmb3JtKG5vZGUsIGEpIHtcbiAgICBjb25zdCBiID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBpZiAoYS5sZWZ0ICE9PSBiLmxlZnQgfHwgYS50b3AgIT09IGIudG9wKSB7XG4gICAgICAgIGNvbnN0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShub2RlKTtcbiAgICAgICAgY29uc3QgdHJhbnNmb3JtID0gc3R5bGUudHJhbnNmb3JtID09PSAnbm9uZScgPyAnJyA6IHN0eWxlLnRyYW5zZm9ybTtcbiAgICAgICAgbm9kZS5zdHlsZS50cmFuc2Zvcm0gPSBgJHt0cmFuc2Zvcm19IHRyYW5zbGF0ZSgke2EubGVmdCAtIGIubGVmdH1weCwgJHthLnRvcCAtIGIudG9wfXB4KWA7XG4gICAgfVxufVxuXG5sZXQgY3VycmVudF9jb21wb25lbnQ7XG5mdW5jdGlvbiBzZXRfY3VycmVudF9jb21wb25lbnQoY29tcG9uZW50KSB7XG4gICAgY3VycmVudF9jb21wb25lbnQgPSBjb21wb25lbnQ7XG59XG5mdW5jdGlvbiBnZXRfY3VycmVudF9jb21wb25lbnQoKSB7XG4gICAgaWYgKCFjdXJyZW50X2NvbXBvbmVudClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGdW5jdGlvbiBjYWxsZWQgb3V0c2lkZSBjb21wb25lbnQgaW5pdGlhbGl6YXRpb24nKTtcbiAgICByZXR1cm4gY3VycmVudF9jb21wb25lbnQ7XG59XG5mdW5jdGlvbiBiZWZvcmVVcGRhdGUoZm4pIHtcbiAgICBnZXRfY3VycmVudF9jb21wb25lbnQoKS4kJC5iZWZvcmVfdXBkYXRlLnB1c2goZm4pO1xufVxuZnVuY3Rpb24gb25Nb3VudChmbikge1xuICAgIGdldF9jdXJyZW50X2NvbXBvbmVudCgpLiQkLm9uX21vdW50LnB1c2goZm4pO1xufVxuZnVuY3Rpb24gYWZ0ZXJVcGRhdGUoZm4pIHtcbiAgICBnZXRfY3VycmVudF9jb21wb25lbnQoKS4kJC5hZnRlcl91cGRhdGUucHVzaChmbik7XG59XG5mdW5jdGlvbiBvbkRlc3Ryb3koZm4pIHtcbiAgICBnZXRfY3VycmVudF9jb21wb25lbnQoKS4kJC5vbl9kZXN0cm95LnB1c2goZm4pO1xufVxuZnVuY3Rpb24gY3JlYXRlRXZlbnREaXNwYXRjaGVyKCkge1xuICAgIGNvbnN0IGNvbXBvbmVudCA9IGdldF9jdXJyZW50X2NvbXBvbmVudCgpO1xuICAgIHJldHVybiAodHlwZSwgZGV0YWlsKSA9PiB7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrcyA9IGNvbXBvbmVudC4kJC5jYWxsYmFja3NbdHlwZV07XG4gICAgICAgIGlmIChjYWxsYmFja3MpIHtcbiAgICAgICAgICAgIC8vIFRPRE8gYXJlIHRoZXJlIHNpdHVhdGlvbnMgd2hlcmUgZXZlbnRzIGNvdWxkIGJlIGRpc3BhdGNoZWRcbiAgICAgICAgICAgIC8vIGluIGEgc2VydmVyIChub24tRE9NKSBlbnZpcm9ubWVudD9cbiAgICAgICAgICAgIGNvbnN0IGV2ZW50ID0gY3VzdG9tX2V2ZW50KHR5cGUsIGRldGFpbCk7XG4gICAgICAgICAgICBjYWxsYmFja3Muc2xpY2UoKS5mb3JFYWNoKGZuID0+IHtcbiAgICAgICAgICAgICAgICBmbi5jYWxsKGNvbXBvbmVudCwgZXZlbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuZnVuY3Rpb24gc2V0Q29udGV4dChrZXksIGNvbnRleHQpIHtcbiAgICBnZXRfY3VycmVudF9jb21wb25lbnQoKS4kJC5jb250ZXh0LnNldChrZXksIGNvbnRleHQpO1xufVxuZnVuY3Rpb24gZ2V0Q29udGV4dChrZXkpIHtcbiAgICByZXR1cm4gZ2V0X2N1cnJlbnRfY29tcG9uZW50KCkuJCQuY29udGV4dC5nZXQoa2V5KTtcbn1cbi8vIFRPRE8gZmlndXJlIG91dCBpZiB3ZSBzdGlsbCB3YW50IHRvIHN1cHBvcnRcbi8vIHNob3J0aGFuZCBldmVudHMsIG9yIGlmIHdlIHdhbnQgdG8gaW1wbGVtZW50XG4vLyBhIHJlYWwgYnViYmxpbmcgbWVjaGFuaXNtXG5mdW5jdGlvbiBidWJibGUoY29tcG9uZW50LCBldmVudCkge1xuICAgIGNvbnN0IGNhbGxiYWNrcyA9IGNvbXBvbmVudC4kJC5jYWxsYmFja3NbZXZlbnQudHlwZV07XG4gICAgaWYgKGNhbGxiYWNrcykge1xuICAgICAgICBjYWxsYmFja3Muc2xpY2UoKS5mb3JFYWNoKGZuID0+IGZuKGV2ZW50KSk7XG4gICAgfVxufVxuXG5jb25zdCBkaXJ0eV9jb21wb25lbnRzID0gW107XG5jb25zdCBpbnRyb3MgPSB7IGVuYWJsZWQ6IGZhbHNlIH07XG5jb25zdCBiaW5kaW5nX2NhbGxiYWNrcyA9IFtdO1xuY29uc3QgcmVuZGVyX2NhbGxiYWNrcyA9IFtdO1xuY29uc3QgZmx1c2hfY2FsbGJhY2tzID0gW107XG5jb25zdCByZXNvbHZlZF9wcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG5sZXQgdXBkYXRlX3NjaGVkdWxlZCA9IGZhbHNlO1xuZnVuY3Rpb24gc2NoZWR1bGVfdXBkYXRlKCkge1xuICAgIGlmICghdXBkYXRlX3NjaGVkdWxlZCkge1xuICAgICAgICB1cGRhdGVfc2NoZWR1bGVkID0gdHJ1ZTtcbiAgICAgICAgcmVzb2x2ZWRfcHJvbWlzZS50aGVuKGZsdXNoKTtcbiAgICB9XG59XG5mdW5jdGlvbiB0aWNrKCkge1xuICAgIHNjaGVkdWxlX3VwZGF0ZSgpO1xuICAgIHJldHVybiByZXNvbHZlZF9wcm9taXNlO1xufVxuZnVuY3Rpb24gYWRkX3JlbmRlcl9jYWxsYmFjayhmbikge1xuICAgIHJlbmRlcl9jYWxsYmFja3MucHVzaChmbik7XG59XG5mdW5jdGlvbiBhZGRfZmx1c2hfY2FsbGJhY2soZm4pIHtcbiAgICBmbHVzaF9jYWxsYmFja3MucHVzaChmbik7XG59XG5sZXQgZmx1c2hpbmcgPSBmYWxzZTtcbmNvbnN0IHNlZW5fY2FsbGJhY2tzID0gbmV3IFNldCgpO1xuZnVuY3Rpb24gZmx1c2goKSB7XG4gICAgaWYgKGZsdXNoaW5nKVxuICAgICAgICByZXR1cm47XG4gICAgZmx1c2hpbmcgPSB0cnVlO1xuICAgIGRvIHtcbiAgICAgICAgLy8gZmlyc3QsIGNhbGwgYmVmb3JlVXBkYXRlIGZ1bmN0aW9uc1xuICAgICAgICAvLyBhbmQgdXBkYXRlIGNvbXBvbmVudHNcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaXJ0eV9jb21wb25lbnRzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBjb25zdCBjb21wb25lbnQgPSBkaXJ0eV9jb21wb25lbnRzW2ldO1xuICAgICAgICAgICAgc2V0X2N1cnJlbnRfY29tcG9uZW50KGNvbXBvbmVudCk7XG4gICAgICAgICAgICB1cGRhdGUoY29tcG9uZW50LiQkKTtcbiAgICAgICAgfVxuICAgICAgICBzZXRfY3VycmVudF9jb21wb25lbnQobnVsbCk7XG4gICAgICAgIGRpcnR5X2NvbXBvbmVudHMubGVuZ3RoID0gMDtcbiAgICAgICAgd2hpbGUgKGJpbmRpbmdfY2FsbGJhY2tzLmxlbmd0aClcbiAgICAgICAgICAgIGJpbmRpbmdfY2FsbGJhY2tzLnBvcCgpKCk7XG4gICAgICAgIC8vIHRoZW4sIG9uY2UgY29tcG9uZW50cyBhcmUgdXBkYXRlZCwgY2FsbFxuICAgICAgICAvLyBhZnRlclVwZGF0ZSBmdW5jdGlvbnMuIFRoaXMgbWF5IGNhdXNlXG4gICAgICAgIC8vIHN1YnNlcXVlbnQgdXBkYXRlcy4uLlxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlbmRlcl9jYWxsYmFja3MubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGNvbnN0IGNhbGxiYWNrID0gcmVuZGVyX2NhbGxiYWNrc1tpXTtcbiAgICAgICAgICAgIGlmICghc2Vlbl9jYWxsYmFja3MuaGFzKGNhbGxiYWNrKSkge1xuICAgICAgICAgICAgICAgIC8vIC4uLnNvIGd1YXJkIGFnYWluc3QgaW5maW5pdGUgbG9vcHNcbiAgICAgICAgICAgICAgICBzZWVuX2NhbGxiYWNrcy5hZGQoY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVuZGVyX2NhbGxiYWNrcy5sZW5ndGggPSAwO1xuICAgIH0gd2hpbGUgKGRpcnR5X2NvbXBvbmVudHMubGVuZ3RoKTtcbiAgICB3aGlsZSAoZmx1c2hfY2FsbGJhY2tzLmxlbmd0aCkge1xuICAgICAgICBmbHVzaF9jYWxsYmFja3MucG9wKCkoKTtcbiAgICB9XG4gICAgdXBkYXRlX3NjaGVkdWxlZCA9IGZhbHNlO1xuICAgIGZsdXNoaW5nID0gZmFsc2U7XG4gICAgc2Vlbl9jYWxsYmFja3MuY2xlYXIoKTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZSgkJCkge1xuICAgIGlmICgkJC5mcmFnbWVudCAhPT0gbnVsbCkge1xuICAgICAgICAkJC51cGRhdGUoKTtcbiAgICAgICAgcnVuX2FsbCgkJC5iZWZvcmVfdXBkYXRlKTtcbiAgICAgICAgY29uc3QgZGlydHkgPSAkJC5kaXJ0eTtcbiAgICAgICAgJCQuZGlydHkgPSBbLTFdO1xuICAgICAgICAkJC5mcmFnbWVudCAmJiAkJC5mcmFnbWVudC5wKCQkLmN0eCwgZGlydHkpO1xuICAgICAgICAkJC5hZnRlcl91cGRhdGUuZm9yRWFjaChhZGRfcmVuZGVyX2NhbGxiYWNrKTtcbiAgICB9XG59XG5cbmxldCBwcm9taXNlO1xuZnVuY3Rpb24gd2FpdCgpIHtcbiAgICBpZiAoIXByb21pc2UpIHtcbiAgICAgICAgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICBwcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgcHJvbWlzZSA9IG51bGw7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcHJvbWlzZTtcbn1cbmZ1bmN0aW9uIGRpc3BhdGNoKG5vZGUsIGRpcmVjdGlvbiwga2luZCkge1xuICAgIG5vZGUuZGlzcGF0Y2hFdmVudChjdXN0b21fZXZlbnQoYCR7ZGlyZWN0aW9uID8gJ2ludHJvJyA6ICdvdXRybyd9JHtraW5kfWApKTtcbn1cbmNvbnN0IG91dHJvaW5nID0gbmV3IFNldCgpO1xubGV0IG91dHJvcztcbmZ1bmN0aW9uIGdyb3VwX291dHJvcygpIHtcbiAgICBvdXRyb3MgPSB7XG4gICAgICAgIHI6IDAsXG4gICAgICAgIGM6IFtdLFxuICAgICAgICBwOiBvdXRyb3MgLy8gcGFyZW50IGdyb3VwXG4gICAgfTtcbn1cbmZ1bmN0aW9uIGNoZWNrX291dHJvcygpIHtcbiAgICBpZiAoIW91dHJvcy5yKSB7XG4gICAgICAgIHJ1bl9hbGwob3V0cm9zLmMpO1xuICAgIH1cbiAgICBvdXRyb3MgPSBvdXRyb3MucDtcbn1cbmZ1bmN0aW9uIHRyYW5zaXRpb25faW4oYmxvY2ssIGxvY2FsKSB7XG4gICAgaWYgKGJsb2NrICYmIGJsb2NrLmkpIHtcbiAgICAgICAgb3V0cm9pbmcuZGVsZXRlKGJsb2NrKTtcbiAgICAgICAgYmxvY2suaShsb2NhbCk7XG4gICAgfVxufVxuZnVuY3Rpb24gdHJhbnNpdGlvbl9vdXQoYmxvY2ssIGxvY2FsLCBkZXRhY2gsIGNhbGxiYWNrKSB7XG4gICAgaWYgKGJsb2NrICYmIGJsb2NrLm8pIHtcbiAgICAgICAgaWYgKG91dHJvaW5nLmhhcyhibG9jaykpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIG91dHJvaW5nLmFkZChibG9jayk7XG4gICAgICAgIG91dHJvcy5jLnB1c2goKCkgPT4ge1xuICAgICAgICAgICAgb3V0cm9pbmcuZGVsZXRlKGJsb2NrKTtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGlmIChkZXRhY2gpXG4gICAgICAgICAgICAgICAgICAgIGJsb2NrLmQoMSk7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGJsb2NrLm8obG9jYWwpO1xuICAgIH1cbn1cbmNvbnN0IG51bGxfdHJhbnNpdGlvbiA9IHsgZHVyYXRpb246IDAgfTtcbmZ1bmN0aW9uIGNyZWF0ZV9pbl90cmFuc2l0aW9uKG5vZGUsIGZuLCBwYXJhbXMpIHtcbiAgICBsZXQgY29uZmlnID0gZm4obm9kZSwgcGFyYW1zKTtcbiAgICBsZXQgcnVubmluZyA9IGZhbHNlO1xuICAgIGxldCBhbmltYXRpb25fbmFtZTtcbiAgICBsZXQgdGFzaztcbiAgICBsZXQgdWlkID0gMDtcbiAgICBmdW5jdGlvbiBjbGVhbnVwKCkge1xuICAgICAgICBpZiAoYW5pbWF0aW9uX25hbWUpXG4gICAgICAgICAgICBkZWxldGVfcnVsZShub2RlLCBhbmltYXRpb25fbmFtZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdvKCkge1xuICAgICAgICBjb25zdCB7IGRlbGF5ID0gMCwgZHVyYXRpb24gPSAzMDAsIGVhc2luZyA9IGlkZW50aXR5LCB0aWNrID0gbm9vcCwgY3NzIH0gPSBjb25maWcgfHwgbnVsbF90cmFuc2l0aW9uO1xuICAgICAgICBpZiAoY3NzKVxuICAgICAgICAgICAgYW5pbWF0aW9uX25hbWUgPSBjcmVhdGVfcnVsZShub2RlLCAwLCAxLCBkdXJhdGlvbiwgZGVsYXksIGVhc2luZywgY3NzLCB1aWQrKyk7XG4gICAgICAgIHRpY2soMCwgMSk7XG4gICAgICAgIGNvbnN0IHN0YXJ0X3RpbWUgPSBub3coKSArIGRlbGF5O1xuICAgICAgICBjb25zdCBlbmRfdGltZSA9IHN0YXJ0X3RpbWUgKyBkdXJhdGlvbjtcbiAgICAgICAgaWYgKHRhc2spXG4gICAgICAgICAgICB0YXNrLmFib3J0KCk7XG4gICAgICAgIHJ1bm5pbmcgPSB0cnVlO1xuICAgICAgICBhZGRfcmVuZGVyX2NhbGxiYWNrKCgpID0+IGRpc3BhdGNoKG5vZGUsIHRydWUsICdzdGFydCcpKTtcbiAgICAgICAgdGFzayA9IGxvb3Aobm93ID0+IHtcbiAgICAgICAgICAgIGlmIChydW5uaW5nKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5vdyA+PSBlbmRfdGltZSkge1xuICAgICAgICAgICAgICAgICAgICB0aWNrKDEsIDApO1xuICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaChub2RlLCB0cnVlLCAnZW5kJyk7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFudXAoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG5vdyA+PSBzdGFydF90aW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHQgPSBlYXNpbmcoKG5vdyAtIHN0YXJ0X3RpbWUpIC8gZHVyYXRpb24pO1xuICAgICAgICAgICAgICAgICAgICB0aWNrKHQsIDEgLSB0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcnVubmluZztcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGxldCBzdGFydGVkID0gZmFsc2U7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgc3RhcnQoKSB7XG4gICAgICAgICAgICBpZiAoc3RhcnRlZClcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBkZWxldGVfcnVsZShub2RlKTtcbiAgICAgICAgICAgIGlmIChpc19mdW5jdGlvbihjb25maWcpKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnID0gY29uZmlnKCk7XG4gICAgICAgICAgICAgICAgd2FpdCgpLnRoZW4oZ28pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZ28oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgaW52YWxpZGF0ZSgpIHtcbiAgICAgICAgICAgIHN0YXJ0ZWQgPSBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW5kKCkge1xuICAgICAgICAgICAgaWYgKHJ1bm5pbmcpIHtcbiAgICAgICAgICAgICAgICBjbGVhbnVwKCk7XG4gICAgICAgICAgICAgICAgcnVubmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZV9vdXRfdHJhbnNpdGlvbihub2RlLCBmbiwgcGFyYW1zKSB7XG4gICAgbGV0IGNvbmZpZyA9IGZuKG5vZGUsIHBhcmFtcyk7XG4gICAgbGV0IHJ1bm5pbmcgPSB0cnVlO1xuICAgIGxldCBhbmltYXRpb25fbmFtZTtcbiAgICBjb25zdCBncm91cCA9IG91dHJvcztcbiAgICBncm91cC5yICs9IDE7XG4gICAgZnVuY3Rpb24gZ28oKSB7XG4gICAgICAgIGNvbnN0IHsgZGVsYXkgPSAwLCBkdXJhdGlvbiA9IDMwMCwgZWFzaW5nID0gaWRlbnRpdHksIHRpY2sgPSBub29wLCBjc3MgfSA9IGNvbmZpZyB8fCBudWxsX3RyYW5zaXRpb247XG4gICAgICAgIGlmIChjc3MpXG4gICAgICAgICAgICBhbmltYXRpb25fbmFtZSA9IGNyZWF0ZV9ydWxlKG5vZGUsIDEsIDAsIGR1cmF0aW9uLCBkZWxheSwgZWFzaW5nLCBjc3MpO1xuICAgICAgICBjb25zdCBzdGFydF90aW1lID0gbm93KCkgKyBkZWxheTtcbiAgICAgICAgY29uc3QgZW5kX3RpbWUgPSBzdGFydF90aW1lICsgZHVyYXRpb247XG4gICAgICAgIGFkZF9yZW5kZXJfY2FsbGJhY2soKCkgPT4gZGlzcGF0Y2gobm9kZSwgZmFsc2UsICdzdGFydCcpKTtcbiAgICAgICAgbG9vcChub3cgPT4ge1xuICAgICAgICAgICAgaWYgKHJ1bm5pbmcpIHtcbiAgICAgICAgICAgICAgICBpZiAobm93ID49IGVuZF90aW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHRpY2soMCwgMSk7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKG5vZGUsIGZhbHNlLCAnZW5kJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghLS1ncm91cC5yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzIHdpbGwgcmVzdWx0IGluIGBlbmQoKWAgYmVpbmcgY2FsbGVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc28gd2UgZG9uJ3QgbmVlZCB0byBjbGVhbiB1cCBoZXJlXG4gICAgICAgICAgICAgICAgICAgICAgICBydW5fYWxsKGdyb3VwLmMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG5vdyA+PSBzdGFydF90aW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHQgPSBlYXNpbmcoKG5vdyAtIHN0YXJ0X3RpbWUpIC8gZHVyYXRpb24pO1xuICAgICAgICAgICAgICAgICAgICB0aWNrKDEgLSB0LCB0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcnVubmluZztcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChpc19mdW5jdGlvbihjb25maWcpKSB7XG4gICAgICAgIHdhaXQoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIGNvbmZpZyA9IGNvbmZpZygpO1xuICAgICAgICAgICAgZ28oKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBnbygpO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBlbmQocmVzZXQpIHtcbiAgICAgICAgICAgIGlmIChyZXNldCAmJiBjb25maWcudGljaykge1xuICAgICAgICAgICAgICAgIGNvbmZpZy50aWNrKDEsIDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJ1bm5pbmcpIHtcbiAgICAgICAgICAgICAgICBpZiAoYW5pbWF0aW9uX25hbWUpXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZV9ydWxlKG5vZGUsIGFuaW1hdGlvbl9uYW1lKTtcbiAgICAgICAgICAgICAgICBydW5uaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xufVxuZnVuY3Rpb24gY3JlYXRlX2JpZGlyZWN0aW9uYWxfdHJhbnNpdGlvbihub2RlLCBmbiwgcGFyYW1zLCBpbnRybykge1xuICAgIGxldCBjb25maWcgPSBmbihub2RlLCBwYXJhbXMpO1xuICAgIGxldCB0ID0gaW50cm8gPyAwIDogMTtcbiAgICBsZXQgcnVubmluZ19wcm9ncmFtID0gbnVsbDtcbiAgICBsZXQgcGVuZGluZ19wcm9ncmFtID0gbnVsbDtcbiAgICBsZXQgYW5pbWF0aW9uX25hbWUgPSBudWxsO1xuICAgIGZ1bmN0aW9uIGNsZWFyX2FuaW1hdGlvbigpIHtcbiAgICAgICAgaWYgKGFuaW1hdGlvbl9uYW1lKVxuICAgICAgICAgICAgZGVsZXRlX3J1bGUobm9kZSwgYW5pbWF0aW9uX25hbWUpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpbml0KHByb2dyYW0sIGR1cmF0aW9uKSB7XG4gICAgICAgIGNvbnN0IGQgPSBwcm9ncmFtLmIgLSB0O1xuICAgICAgICBkdXJhdGlvbiAqPSBNYXRoLmFicyhkKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGE6IHQsXG4gICAgICAgICAgICBiOiBwcm9ncmFtLmIsXG4gICAgICAgICAgICBkLFxuICAgICAgICAgICAgZHVyYXRpb24sXG4gICAgICAgICAgICBzdGFydDogcHJvZ3JhbS5zdGFydCxcbiAgICAgICAgICAgIGVuZDogcHJvZ3JhbS5zdGFydCArIGR1cmF0aW9uLFxuICAgICAgICAgICAgZ3JvdXA6IHByb2dyYW0uZ3JvdXBcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ28oYikge1xuICAgICAgICBjb25zdCB7IGRlbGF5ID0gMCwgZHVyYXRpb24gPSAzMDAsIGVhc2luZyA9IGlkZW50aXR5LCB0aWNrID0gbm9vcCwgY3NzIH0gPSBjb25maWcgfHwgbnVsbF90cmFuc2l0aW9uO1xuICAgICAgICBjb25zdCBwcm9ncmFtID0ge1xuICAgICAgICAgICAgc3RhcnQ6IG5vdygpICsgZGVsYXksXG4gICAgICAgICAgICBiXG4gICAgICAgIH07XG4gICAgICAgIGlmICghYikge1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZSB0b2RvOiBpbXByb3ZlIHR5cGluZ3NcbiAgICAgICAgICAgIHByb2dyYW0uZ3JvdXAgPSBvdXRyb3M7XG4gICAgICAgICAgICBvdXRyb3MuciArPSAxO1xuICAgICAgICB9XG4gICAgICAgIGlmIChydW5uaW5nX3Byb2dyYW0gfHwgcGVuZGluZ19wcm9ncmFtKSB7XG4gICAgICAgICAgICBwZW5kaW5nX3Byb2dyYW0gPSBwcm9ncmFtO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gaWYgdGhpcyBpcyBhbiBpbnRybywgYW5kIHRoZXJlJ3MgYSBkZWxheSwgd2UgbmVlZCB0byBkb1xuICAgICAgICAgICAgLy8gYW4gaW5pdGlhbCB0aWNrIGFuZC9vciBhcHBseSBDU1MgYW5pbWF0aW9uIGltbWVkaWF0ZWx5XG4gICAgICAgICAgICBpZiAoY3NzKSB7XG4gICAgICAgICAgICAgICAgY2xlYXJfYW5pbWF0aW9uKCk7XG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uX25hbWUgPSBjcmVhdGVfcnVsZShub2RlLCB0LCBiLCBkdXJhdGlvbiwgZGVsYXksIGVhc2luZywgY3NzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChiKVxuICAgICAgICAgICAgICAgIHRpY2soMCwgMSk7XG4gICAgICAgICAgICBydW5uaW5nX3Byb2dyYW0gPSBpbml0KHByb2dyYW0sIGR1cmF0aW9uKTtcbiAgICAgICAgICAgIGFkZF9yZW5kZXJfY2FsbGJhY2soKCkgPT4gZGlzcGF0Y2gobm9kZSwgYiwgJ3N0YXJ0JykpO1xuICAgICAgICAgICAgbG9vcChub3cgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChwZW5kaW5nX3Byb2dyYW0gJiYgbm93ID4gcGVuZGluZ19wcm9ncmFtLnN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJ1bm5pbmdfcHJvZ3JhbSA9IGluaXQocGVuZGluZ19wcm9ncmFtLCBkdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIHBlbmRpbmdfcHJvZ3JhbSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoKG5vZGUsIHJ1bm5pbmdfcHJvZ3JhbS5iLCAnc3RhcnQnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJfYW5pbWF0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRpb25fbmFtZSA9IGNyZWF0ZV9ydWxlKG5vZGUsIHQsIHJ1bm5pbmdfcHJvZ3JhbS5iLCBydW5uaW5nX3Byb2dyYW0uZHVyYXRpb24sIDAsIGVhc2luZywgY29uZmlnLmNzcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJ1bm5pbmdfcHJvZ3JhbSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobm93ID49IHJ1bm5pbmdfcHJvZ3JhbS5lbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpY2sodCA9IHJ1bm5pbmdfcHJvZ3JhbS5iLCAxIC0gdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaChub2RlLCBydW5uaW5nX3Byb2dyYW0uYiwgJ2VuZCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFwZW5kaW5nX3Byb2dyYW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB3ZSdyZSBkb25lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJ1bm5pbmdfcHJvZ3JhbS5iKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGludHJvIOKAlCB3ZSBjYW4gdGlkeSB1cCBpbW1lZGlhdGVseVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhcl9hbmltYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG91dHJvIOKAlCBuZWVkcyB0byBiZSBjb29yZGluYXRlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIS0tcnVubmluZ19wcm9ncmFtLmdyb3VwLnIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBydW5fYWxsKHJ1bm5pbmdfcHJvZ3JhbS5ncm91cC5jKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBydW5uaW5nX3Byb2dyYW0gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKG5vdyA+PSBydW5uaW5nX3Byb2dyYW0uc3RhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHAgPSBub3cgLSBydW5uaW5nX3Byb2dyYW0uc3RhcnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ID0gcnVubmluZ19wcm9ncmFtLmEgKyBydW5uaW5nX3Byb2dyYW0uZCAqIGVhc2luZyhwIC8gcnVubmluZ19wcm9ncmFtLmR1cmF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpY2sodCwgMSAtIHQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiAhIShydW5uaW5nX3Byb2dyYW0gfHwgcGVuZGluZ19wcm9ncmFtKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIHJ1bihiKSB7XG4gICAgICAgICAgICBpZiAoaXNfZnVuY3Rpb24oY29uZmlnKSkge1xuICAgICAgICAgICAgICAgIHdhaXQoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICAgICBjb25maWcgPSBjb25maWcoKTtcbiAgICAgICAgICAgICAgICAgICAgZ28oYik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBnbyhiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZW5kKCkge1xuICAgICAgICAgICAgY2xlYXJfYW5pbWF0aW9uKCk7XG4gICAgICAgICAgICBydW5uaW5nX3Byb2dyYW0gPSBwZW5kaW5nX3Byb2dyYW0gPSBudWxsO1xuICAgICAgICB9XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlX3Byb21pc2UocHJvbWlzZSwgaW5mbykge1xuICAgIGNvbnN0IHRva2VuID0gaW5mby50b2tlbiA9IHt9O1xuICAgIGZ1bmN0aW9uIHVwZGF0ZSh0eXBlLCBpbmRleCwga2V5LCB2YWx1ZSkge1xuICAgICAgICBpZiAoaW5mby50b2tlbiAhPT0gdG9rZW4pXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGluZm8ucmVzb2x2ZWQgPSB2YWx1ZTtcbiAgICAgICAgbGV0IGNoaWxkX2N0eCA9IGluZm8uY3R4O1xuICAgICAgICBpZiAoa2V5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNoaWxkX2N0eCA9IGNoaWxkX2N0eC5zbGljZSgpO1xuICAgICAgICAgICAgY2hpbGRfY3R4W2tleV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBibG9jayA9IHR5cGUgJiYgKGluZm8uY3VycmVudCA9IHR5cGUpKGNoaWxkX2N0eCk7XG4gICAgICAgIGxldCBuZWVkc19mbHVzaCA9IGZhbHNlO1xuICAgICAgICBpZiAoaW5mby5ibG9jaykge1xuICAgICAgICAgICAgaWYgKGluZm8uYmxvY2tzKSB7XG4gICAgICAgICAgICAgICAgaW5mby5ibG9ja3MuZm9yRWFjaCgoYmxvY2ssIGkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgIT09IGluZGV4ICYmIGJsb2NrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cF9vdXRyb3MoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb25fb3V0KGJsb2NrLCAxLCAxLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5mby5ibG9ja3NbaV0gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja19vdXRyb3MoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaW5mby5ibG9jay5kKDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYmxvY2suYygpO1xuICAgICAgICAgICAgdHJhbnNpdGlvbl9pbihibG9jaywgMSk7XG4gICAgICAgICAgICBibG9jay5tKGluZm8ubW91bnQoKSwgaW5mby5hbmNob3IpO1xuICAgICAgICAgICAgbmVlZHNfZmx1c2ggPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGluZm8uYmxvY2sgPSBibG9jaztcbiAgICAgICAgaWYgKGluZm8uYmxvY2tzKVxuICAgICAgICAgICAgaW5mby5ibG9ja3NbaW5kZXhdID0gYmxvY2s7XG4gICAgICAgIGlmIChuZWVkc19mbHVzaCkge1xuICAgICAgICAgICAgZmx1c2goKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoaXNfcHJvbWlzZShwcm9taXNlKSkge1xuICAgICAgICBjb25zdCBjdXJyZW50X2NvbXBvbmVudCA9IGdldF9jdXJyZW50X2NvbXBvbmVudCgpO1xuICAgICAgICBwcm9taXNlLnRoZW4odmFsdWUgPT4ge1xuICAgICAgICAgICAgc2V0X2N1cnJlbnRfY29tcG9uZW50KGN1cnJlbnRfY29tcG9uZW50KTtcbiAgICAgICAgICAgIHVwZGF0ZShpbmZvLnRoZW4sIDEsIGluZm8udmFsdWUsIHZhbHVlKTtcbiAgICAgICAgICAgIHNldF9jdXJyZW50X2NvbXBvbmVudChudWxsKTtcbiAgICAgICAgfSwgZXJyb3IgPT4ge1xuICAgICAgICAgICAgc2V0X2N1cnJlbnRfY29tcG9uZW50KGN1cnJlbnRfY29tcG9uZW50KTtcbiAgICAgICAgICAgIHVwZGF0ZShpbmZvLmNhdGNoLCAyLCBpbmZvLmVycm9yLCBlcnJvcik7XG4gICAgICAgICAgICBzZXRfY3VycmVudF9jb21wb25lbnQobnVsbCk7XG4gICAgICAgICAgICBpZiAoIWluZm8uaGFzQ2F0Y2gpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIC8vIGlmIHdlIHByZXZpb3VzbHkgaGFkIGEgdGhlbi9jYXRjaCBibG9jaywgZGVzdHJveSBpdFxuICAgICAgICBpZiAoaW5mby5jdXJyZW50ICE9PSBpbmZvLnBlbmRpbmcpIHtcbiAgICAgICAgICAgIHVwZGF0ZShpbmZvLnBlbmRpbmcsIDApO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmIChpbmZvLmN1cnJlbnQgIT09IGluZm8udGhlbikge1xuICAgICAgICAgICAgdXBkYXRlKGluZm8udGhlbiwgMSwgaW5mby52YWx1ZSwgcHJvbWlzZSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpbmZvLnJlc29sdmVkID0gcHJvbWlzZTtcbiAgICB9XG59XG5cbmNvbnN0IGdsb2JhbHMgPSAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICA/IHdpbmRvd1xuICAgIDogdHlwZW9mIGdsb2JhbFRoaXMgIT09ICd1bmRlZmluZWQnXG4gICAgICAgID8gZ2xvYmFsVGhpc1xuICAgICAgICA6IGdsb2JhbCk7XG5cbmZ1bmN0aW9uIGRlc3Ryb3lfYmxvY2soYmxvY2ssIGxvb2t1cCkge1xuICAgIGJsb2NrLmQoMSk7XG4gICAgbG9va3VwLmRlbGV0ZShibG9jay5rZXkpO1xufVxuZnVuY3Rpb24gb3V0cm9fYW5kX2Rlc3Ryb3lfYmxvY2soYmxvY2ssIGxvb2t1cCkge1xuICAgIHRyYW5zaXRpb25fb3V0KGJsb2NrLCAxLCAxLCAoKSA9PiB7XG4gICAgICAgIGxvb2t1cC5kZWxldGUoYmxvY2sua2V5KTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGZpeF9hbmRfZGVzdHJveV9ibG9jayhibG9jaywgbG9va3VwKSB7XG4gICAgYmxvY2suZigpO1xuICAgIGRlc3Ryb3lfYmxvY2soYmxvY2ssIGxvb2t1cCk7XG59XG5mdW5jdGlvbiBmaXhfYW5kX291dHJvX2FuZF9kZXN0cm95X2Jsb2NrKGJsb2NrLCBsb29rdXApIHtcbiAgICBibG9jay5mKCk7XG4gICAgb3V0cm9fYW5kX2Rlc3Ryb3lfYmxvY2soYmxvY2ssIGxvb2t1cCk7XG59XG5mdW5jdGlvbiB1cGRhdGVfa2V5ZWRfZWFjaChvbGRfYmxvY2tzLCBkaXJ0eSwgZ2V0X2tleSwgZHluYW1pYywgY3R4LCBsaXN0LCBsb29rdXAsIG5vZGUsIGRlc3Ryb3ksIGNyZWF0ZV9lYWNoX2Jsb2NrLCBuZXh0LCBnZXRfY29udGV4dCkge1xuICAgIGxldCBvID0gb2xkX2Jsb2Nrcy5sZW5ndGg7XG4gICAgbGV0IG4gPSBsaXN0Lmxlbmd0aDtcbiAgICBsZXQgaSA9IG87XG4gICAgY29uc3Qgb2xkX2luZGV4ZXMgPSB7fTtcbiAgICB3aGlsZSAoaS0tKVxuICAgICAgICBvbGRfaW5kZXhlc1tvbGRfYmxvY2tzW2ldLmtleV0gPSBpO1xuICAgIGNvbnN0IG5ld19ibG9ja3MgPSBbXTtcbiAgICBjb25zdCBuZXdfbG9va3VwID0gbmV3IE1hcCgpO1xuICAgIGNvbnN0IGRlbHRhcyA9IG5ldyBNYXAoKTtcbiAgICBpID0gbjtcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgIGNvbnN0IGNoaWxkX2N0eCA9IGdldF9jb250ZXh0KGN0eCwgbGlzdCwgaSk7XG4gICAgICAgIGNvbnN0IGtleSA9IGdldF9rZXkoY2hpbGRfY3R4KTtcbiAgICAgICAgbGV0IGJsb2NrID0gbG9va3VwLmdldChrZXkpO1xuICAgICAgICBpZiAoIWJsb2NrKSB7XG4gICAgICAgICAgICBibG9jayA9IGNyZWF0ZV9lYWNoX2Jsb2NrKGtleSwgY2hpbGRfY3R4KTtcbiAgICAgICAgICAgIGJsb2NrLmMoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkeW5hbWljKSB7XG4gICAgICAgICAgICBibG9jay5wKGNoaWxkX2N0eCwgZGlydHkpO1xuICAgICAgICB9XG4gICAgICAgIG5ld19sb29rdXAuc2V0KGtleSwgbmV3X2Jsb2Nrc1tpXSA9IGJsb2NrKTtcbiAgICAgICAgaWYgKGtleSBpbiBvbGRfaW5kZXhlcylcbiAgICAgICAgICAgIGRlbHRhcy5zZXQoa2V5LCBNYXRoLmFicyhpIC0gb2xkX2luZGV4ZXNba2V5XSkpO1xuICAgIH1cbiAgICBjb25zdCB3aWxsX21vdmUgPSBuZXcgU2V0KCk7XG4gICAgY29uc3QgZGlkX21vdmUgPSBuZXcgU2V0KCk7XG4gICAgZnVuY3Rpb24gaW5zZXJ0KGJsb2NrKSB7XG4gICAgICAgIHRyYW5zaXRpb25faW4oYmxvY2ssIDEpO1xuICAgICAgICBibG9jay5tKG5vZGUsIG5leHQpO1xuICAgICAgICBsb29rdXAuc2V0KGJsb2NrLmtleSwgYmxvY2spO1xuICAgICAgICBuZXh0ID0gYmxvY2suZmlyc3Q7XG4gICAgICAgIG4tLTtcbiAgICB9XG4gICAgd2hpbGUgKG8gJiYgbikge1xuICAgICAgICBjb25zdCBuZXdfYmxvY2sgPSBuZXdfYmxvY2tzW24gLSAxXTtcbiAgICAgICAgY29uc3Qgb2xkX2Jsb2NrID0gb2xkX2Jsb2Nrc1tvIC0gMV07XG4gICAgICAgIGNvbnN0IG5ld19rZXkgPSBuZXdfYmxvY2sua2V5O1xuICAgICAgICBjb25zdCBvbGRfa2V5ID0gb2xkX2Jsb2NrLmtleTtcbiAgICAgICAgaWYgKG5ld19ibG9jayA9PT0gb2xkX2Jsb2NrKSB7XG4gICAgICAgICAgICAvLyBkbyBub3RoaW5nXG4gICAgICAgICAgICBuZXh0ID0gbmV3X2Jsb2NrLmZpcnN0O1xuICAgICAgICAgICAgby0tO1xuICAgICAgICAgICAgbi0tO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCFuZXdfbG9va3VwLmhhcyhvbGRfa2V5KSkge1xuICAgICAgICAgICAgLy8gcmVtb3ZlIG9sZCBibG9ja1xuICAgICAgICAgICAgZGVzdHJveShvbGRfYmxvY2ssIGxvb2t1cCk7XG4gICAgICAgICAgICBvLS07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIWxvb2t1cC5oYXMobmV3X2tleSkgfHwgd2lsbF9tb3ZlLmhhcyhuZXdfa2V5KSkge1xuICAgICAgICAgICAgaW5zZXJ0KG5ld19ibG9jayk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZGlkX21vdmUuaGFzKG9sZF9rZXkpKSB7XG4gICAgICAgICAgICBvLS07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZGVsdGFzLmdldChuZXdfa2V5KSA+IGRlbHRhcy5nZXQob2xkX2tleSkpIHtcbiAgICAgICAgICAgIGRpZF9tb3ZlLmFkZChuZXdfa2V5KTtcbiAgICAgICAgICAgIGluc2VydChuZXdfYmxvY2spO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgd2lsbF9tb3ZlLmFkZChvbGRfa2V5KTtcbiAgICAgICAgICAgIG8tLTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB3aGlsZSAoby0tKSB7XG4gICAgICAgIGNvbnN0IG9sZF9ibG9jayA9IG9sZF9ibG9ja3Nbb107XG4gICAgICAgIGlmICghbmV3X2xvb2t1cC5oYXMob2xkX2Jsb2NrLmtleSkpXG4gICAgICAgICAgICBkZXN0cm95KG9sZF9ibG9jaywgbG9va3VwKTtcbiAgICB9XG4gICAgd2hpbGUgKG4pXG4gICAgICAgIGluc2VydChuZXdfYmxvY2tzW24gLSAxXSk7XG4gICAgcmV0dXJuIG5ld19ibG9ja3M7XG59XG5mdW5jdGlvbiB2YWxpZGF0ZV9lYWNoX2tleXMoY3R4LCBsaXN0LCBnZXRfY29udGV4dCwgZ2V0X2tleSkge1xuICAgIGNvbnN0IGtleXMgPSBuZXcgU2V0KCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IGdldF9rZXkoZ2V0X2NvbnRleHQoY3R4LCBsaXN0LCBpKSk7XG4gICAgICAgIGlmIChrZXlzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBoYXZlIGR1cGxpY2F0ZSBrZXlzIGluIGEga2V5ZWQgZWFjaCcpO1xuICAgICAgICB9XG4gICAgICAgIGtleXMuYWRkKGtleSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBnZXRfc3ByZWFkX3VwZGF0ZShsZXZlbHMsIHVwZGF0ZXMpIHtcbiAgICBjb25zdCB1cGRhdGUgPSB7fTtcbiAgICBjb25zdCB0b19udWxsX291dCA9IHt9O1xuICAgIGNvbnN0IGFjY291bnRlZF9mb3IgPSB7ICQkc2NvcGU6IDEgfTtcbiAgICBsZXQgaSA9IGxldmVscy5sZW5ndGg7XG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgICBjb25zdCBvID0gbGV2ZWxzW2ldO1xuICAgICAgICBjb25zdCBuID0gdXBkYXRlc1tpXTtcbiAgICAgICAgaWYgKG4pIHtcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIG8pIHtcbiAgICAgICAgICAgICAgICBpZiAoIShrZXkgaW4gbikpXG4gICAgICAgICAgICAgICAgICAgIHRvX251bGxfb3V0W2tleV0gPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gbikge1xuICAgICAgICAgICAgICAgIGlmICghYWNjb3VudGVkX2ZvcltrZXldKSB7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVtrZXldID0gbltrZXldO1xuICAgICAgICAgICAgICAgICAgICBhY2NvdW50ZWRfZm9yW2tleV0gPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldmVsc1tpXSA9IG47XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBvKSB7XG4gICAgICAgICAgICAgICAgYWNjb3VudGVkX2ZvcltrZXldID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGNvbnN0IGtleSBpbiB0b19udWxsX291dCkge1xuICAgICAgICBpZiAoIShrZXkgaW4gdXBkYXRlKSlcbiAgICAgICAgICAgIHVwZGF0ZVtrZXldID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gdXBkYXRlO1xufVxuZnVuY3Rpb24gZ2V0X3NwcmVhZF9vYmplY3Qoc3ByZWFkX3Byb3BzKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBzcHJlYWRfcHJvcHMgPT09ICdvYmplY3QnICYmIHNwcmVhZF9wcm9wcyAhPT0gbnVsbCA/IHNwcmVhZF9wcm9wcyA6IHt9O1xufVxuXG4vLyBzb3VyY2U6IGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2luZGljZXMuaHRtbFxuY29uc3QgYm9vbGVhbl9hdHRyaWJ1dGVzID0gbmV3IFNldChbXG4gICAgJ2FsbG93ZnVsbHNjcmVlbicsXG4gICAgJ2FsbG93cGF5bWVudHJlcXVlc3QnLFxuICAgICdhc3luYycsXG4gICAgJ2F1dG9mb2N1cycsXG4gICAgJ2F1dG9wbGF5JyxcbiAgICAnY2hlY2tlZCcsXG4gICAgJ2NvbnRyb2xzJyxcbiAgICAnZGVmYXVsdCcsXG4gICAgJ2RlZmVyJyxcbiAgICAnZGlzYWJsZWQnLFxuICAgICdmb3Jtbm92YWxpZGF0ZScsXG4gICAgJ2hpZGRlbicsXG4gICAgJ2lzbWFwJyxcbiAgICAnbG9vcCcsXG4gICAgJ211bHRpcGxlJyxcbiAgICAnbXV0ZWQnLFxuICAgICdub21vZHVsZScsXG4gICAgJ25vdmFsaWRhdGUnLFxuICAgICdvcGVuJyxcbiAgICAncGxheXNpbmxpbmUnLFxuICAgICdyZWFkb25seScsXG4gICAgJ3JlcXVpcmVkJyxcbiAgICAncmV2ZXJzZWQnLFxuICAgICdzZWxlY3RlZCdcbl0pO1xuXG5jb25zdCBpbnZhbGlkX2F0dHJpYnV0ZV9uYW1lX2NoYXJhY3RlciA9IC9bXFxzJ1wiPi89XFx1e0ZERDB9LVxcdXtGREVGfVxcdXtGRkZFfVxcdXtGRkZGfVxcdXsxRkZGRX1cXHV7MUZGRkZ9XFx1ezJGRkZFfVxcdXsyRkZGRn1cXHV7M0ZGRkV9XFx1ezNGRkZGfVxcdXs0RkZGRX1cXHV7NEZGRkZ9XFx1ezVGRkZFfVxcdXs1RkZGRn1cXHV7NkZGRkV9XFx1ezZGRkZGfVxcdXs3RkZGRX1cXHV7N0ZGRkZ9XFx1ezhGRkZFfVxcdXs4RkZGRn1cXHV7OUZGRkV9XFx1ezlGRkZGfVxcdXtBRkZGRX1cXHV7QUZGRkZ9XFx1e0JGRkZFfVxcdXtCRkZGRn1cXHV7Q0ZGRkV9XFx1e0NGRkZGfVxcdXtERkZGRX1cXHV7REZGRkZ9XFx1e0VGRkZFfVxcdXtFRkZGRn1cXHV7RkZGRkV9XFx1e0ZGRkZGfVxcdXsxMEZGRkV9XFx1ezEwRkZGRn1dL3U7XG4vLyBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9zeW50YXguaHRtbCNhdHRyaWJ1dGVzLTJcbi8vIGh0dHBzOi8vaW5mcmEuc3BlYy53aGF0d2cub3JnLyNub25jaGFyYWN0ZXJcbmZ1bmN0aW9uIHNwcmVhZChhcmdzLCBjbGFzc2VzX3RvX2FkZCkge1xuICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSBPYmplY3QuYXNzaWduKHt9LCAuLi5hcmdzKTtcbiAgICBpZiAoY2xhc3Nlc190b19hZGQpIHtcbiAgICAgICAgaWYgKGF0dHJpYnV0ZXMuY2xhc3MgPT0gbnVsbCkge1xuICAgICAgICAgICAgYXR0cmlidXRlcy5jbGFzcyA9IGNsYXNzZXNfdG9fYWRkO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYXR0cmlidXRlcy5jbGFzcyArPSAnICcgKyBjbGFzc2VzX3RvX2FkZDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBsZXQgc3RyID0gJyc7XG4gICAgT2JqZWN0LmtleXMoYXR0cmlidXRlcykuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgICAgaWYgKGludmFsaWRfYXR0cmlidXRlX25hbWVfY2hhcmFjdGVyLnRlc3QobmFtZSkpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGNvbnN0IHZhbHVlID0gYXR0cmlidXRlc1tuYW1lXTtcbiAgICAgICAgaWYgKHZhbHVlID09PSB0cnVlKVxuICAgICAgICAgICAgc3RyICs9ICcgJyArIG5hbWU7XG4gICAgICAgIGVsc2UgaWYgKGJvb2xlYW5fYXR0cmlidXRlcy5oYXMobmFtZS50b0xvd2VyQ2FzZSgpKSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlKVxuICAgICAgICAgICAgICAgIHN0ciArPSAnICcgKyBuYW1lO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICAgIHN0ciArPSBgICR7bmFtZX09XCIke1N0cmluZyh2YWx1ZSkucmVwbGFjZSgvXCIvZywgJyYjMzQ7JykucmVwbGFjZSgvJy9nLCAnJiMzOTsnKX1cImA7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gc3RyO1xufVxuY29uc3QgZXNjYXBlZCA9IHtcbiAgICAnXCInOiAnJnF1b3Q7JyxcbiAgICBcIidcIjogJyYjMzk7JyxcbiAgICAnJic6ICcmYW1wOycsXG4gICAgJzwnOiAnJmx0OycsXG4gICAgJz4nOiAnJmd0Oydcbn07XG5mdW5jdGlvbiBlc2NhcGUoaHRtbCkge1xuICAgIHJldHVybiBTdHJpbmcoaHRtbCkucmVwbGFjZSgvW1wiJyY8Pl0vZywgbWF0Y2ggPT4gZXNjYXBlZFttYXRjaF0pO1xufVxuZnVuY3Rpb24gZWFjaChpdGVtcywgZm4pIHtcbiAgICBsZXQgc3RyID0gJyc7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBzdHIgKz0gZm4oaXRlbXNbaV0sIGkpO1xuICAgIH1cbiAgICByZXR1cm4gc3RyO1xufVxuY29uc3QgbWlzc2luZ19jb21wb25lbnQgPSB7XG4gICAgJCRyZW5kZXI6ICgpID0+ICcnXG59O1xuZnVuY3Rpb24gdmFsaWRhdGVfY29tcG9uZW50KGNvbXBvbmVudCwgbmFtZSkge1xuICAgIGlmICghY29tcG9uZW50IHx8ICFjb21wb25lbnQuJCRyZW5kZXIpIHtcbiAgICAgICAgaWYgKG5hbWUgPT09ICdzdmVsdGU6Y29tcG9uZW50JylcbiAgICAgICAgICAgIG5hbWUgKz0gJyB0aGlzPXsuLi59JztcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGA8JHtuYW1lfT4gaXMgbm90IGEgdmFsaWQgU1NSIGNvbXBvbmVudC4gWW91IG1heSBuZWVkIHRvIHJldmlldyB5b3VyIGJ1aWxkIGNvbmZpZyB0byBlbnN1cmUgdGhhdCBkZXBlbmRlbmNpZXMgYXJlIGNvbXBpbGVkLCByYXRoZXIgdGhhbiBpbXBvcnRlZCBhcyBwcmUtY29tcGlsZWQgbW9kdWxlc2ApO1xuICAgIH1cbiAgICByZXR1cm4gY29tcG9uZW50O1xufVxuZnVuY3Rpb24gZGVidWcoZmlsZSwgbGluZSwgY29sdW1uLCB2YWx1ZXMpIHtcbiAgICBjb25zb2xlLmxvZyhge0BkZWJ1Z30gJHtmaWxlID8gZmlsZSArICcgJyA6ICcnfSgke2xpbmV9OiR7Y29sdW1ufSlgKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gICAgY29uc29sZS5sb2codmFsdWVzKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gICAgcmV0dXJuICcnO1xufVxubGV0IG9uX2Rlc3Ryb3k7XG5mdW5jdGlvbiBjcmVhdGVfc3NyX2NvbXBvbmVudChmbikge1xuICAgIGZ1bmN0aW9uICQkcmVuZGVyKHJlc3VsdCwgcHJvcHMsIGJpbmRpbmdzLCBzbG90cykge1xuICAgICAgICBjb25zdCBwYXJlbnRfY29tcG9uZW50ID0gY3VycmVudF9jb21wb25lbnQ7XG4gICAgICAgIGNvbnN0ICQkID0ge1xuICAgICAgICAgICAgb25fZGVzdHJveSxcbiAgICAgICAgICAgIGNvbnRleHQ6IG5ldyBNYXAocGFyZW50X2NvbXBvbmVudCA/IHBhcmVudF9jb21wb25lbnQuJCQuY29udGV4dCA6IFtdKSxcbiAgICAgICAgICAgIC8vIHRoZXNlIHdpbGwgYmUgaW1tZWRpYXRlbHkgZGlzY2FyZGVkXG4gICAgICAgICAgICBvbl9tb3VudDogW10sXG4gICAgICAgICAgICBiZWZvcmVfdXBkYXRlOiBbXSxcbiAgICAgICAgICAgIGFmdGVyX3VwZGF0ZTogW10sXG4gICAgICAgICAgICBjYWxsYmFja3M6IGJsYW5rX29iamVjdCgpXG4gICAgICAgIH07XG4gICAgICAgIHNldF9jdXJyZW50X2NvbXBvbmVudCh7ICQkIH0pO1xuICAgICAgICBjb25zdCBodG1sID0gZm4ocmVzdWx0LCBwcm9wcywgYmluZGluZ3MsIHNsb3RzKTtcbiAgICAgICAgc2V0X2N1cnJlbnRfY29tcG9uZW50KHBhcmVudF9jb21wb25lbnQpO1xuICAgICAgICByZXR1cm4gaHRtbDtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVuZGVyOiAocHJvcHMgPSB7fSwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gICAgICAgICAgICBvbl9kZXN0cm95ID0gW107XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSB7IHRpdGxlOiAnJywgaGVhZDogJycsIGNzczogbmV3IFNldCgpIH07XG4gICAgICAgICAgICBjb25zdCBodG1sID0gJCRyZW5kZXIocmVzdWx0LCBwcm9wcywge30sIG9wdGlvbnMpO1xuICAgICAgICAgICAgcnVuX2FsbChvbl9kZXN0cm95KTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgaHRtbCxcbiAgICAgICAgICAgICAgICBjc3M6IHtcbiAgICAgICAgICAgICAgICAgICAgY29kZTogQXJyYXkuZnJvbShyZXN1bHQuY3NzKS5tYXAoY3NzID0+IGNzcy5jb2RlKS5qb2luKCdcXG4nKSxcbiAgICAgICAgICAgICAgICAgICAgbWFwOiBudWxsIC8vIFRPRE9cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGhlYWQ6IHJlc3VsdC50aXRsZSArIHJlc3VsdC5oZWFkXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuICAgICAgICAkJHJlbmRlclxuICAgIH07XG59XG5mdW5jdGlvbiBhZGRfYXR0cmlidXRlKG5hbWUsIHZhbHVlLCBib29sZWFuKSB7XG4gICAgaWYgKHZhbHVlID09IG51bGwgfHwgKGJvb2xlYW4gJiYgIXZhbHVlKSlcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIHJldHVybiBgICR7bmFtZX0ke3ZhbHVlID09PSB0cnVlID8gJycgOiBgPSR7dHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyA/IEpTT04uc3RyaW5naWZ5KGVzY2FwZSh2YWx1ZSkpIDogYFwiJHt2YWx1ZX1cImB9YH1gO1xufVxuZnVuY3Rpb24gYWRkX2NsYXNzZXMoY2xhc3Nlcykge1xuICAgIHJldHVybiBjbGFzc2VzID8gYCBjbGFzcz1cIiR7Y2xhc3Nlc31cImAgOiAnJztcbn1cblxuZnVuY3Rpb24gYmluZChjb21wb25lbnQsIG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgaW5kZXggPSBjb21wb25lbnQuJCQucHJvcHNbbmFtZV07XG4gICAgaWYgKGluZGV4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29tcG9uZW50LiQkLmJvdW5kW2luZGV4XSA9IGNhbGxiYWNrO1xuICAgICAgICBjYWxsYmFjayhjb21wb25lbnQuJCQuY3R4W2luZGV4XSk7XG4gICAgfVxufVxuZnVuY3Rpb24gY3JlYXRlX2NvbXBvbmVudChibG9jaykge1xuICAgIGJsb2NrICYmIGJsb2NrLmMoKTtcbn1cbmZ1bmN0aW9uIGNsYWltX2NvbXBvbmVudChibG9jaywgcGFyZW50X25vZGVzKSB7XG4gICAgYmxvY2sgJiYgYmxvY2subChwYXJlbnRfbm9kZXMpO1xufVxuZnVuY3Rpb24gbW91bnRfY29tcG9uZW50KGNvbXBvbmVudCwgdGFyZ2V0LCBhbmNob3IpIHtcbiAgICBjb25zdCB7IGZyYWdtZW50LCBvbl9tb3VudCwgb25fZGVzdHJveSwgYWZ0ZXJfdXBkYXRlIH0gPSBjb21wb25lbnQuJCQ7XG4gICAgZnJhZ21lbnQgJiYgZnJhZ21lbnQubSh0YXJnZXQsIGFuY2hvcik7XG4gICAgLy8gb25Nb3VudCBoYXBwZW5zIGJlZm9yZSB0aGUgaW5pdGlhbCBhZnRlclVwZGF0ZVxuICAgIGFkZF9yZW5kZXJfY2FsbGJhY2soKCkgPT4ge1xuICAgICAgICBjb25zdCBuZXdfb25fZGVzdHJveSA9IG9uX21vdW50Lm1hcChydW4pLmZpbHRlcihpc19mdW5jdGlvbik7XG4gICAgICAgIGlmIChvbl9kZXN0cm95KSB7XG4gICAgICAgICAgICBvbl9kZXN0cm95LnB1c2goLi4ubmV3X29uX2Rlc3Ryb3kpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gRWRnZSBjYXNlIC0gY29tcG9uZW50IHdhcyBkZXN0cm95ZWQgaW1tZWRpYXRlbHksXG4gICAgICAgICAgICAvLyBtb3N0IGxpa2VseSBhcyBhIHJlc3VsdCBvZiBhIGJpbmRpbmcgaW5pdGlhbGlzaW5nXG4gICAgICAgICAgICBydW5fYWxsKG5ld19vbl9kZXN0cm95KTtcbiAgICAgICAgfVxuICAgICAgICBjb21wb25lbnQuJCQub25fbW91bnQgPSBbXTtcbiAgICB9KTtcbiAgICBhZnRlcl91cGRhdGUuZm9yRWFjaChhZGRfcmVuZGVyX2NhbGxiYWNrKTtcbn1cbmZ1bmN0aW9uIGRlc3Ryb3lfY29tcG9uZW50KGNvbXBvbmVudCwgZGV0YWNoaW5nKSB7XG4gICAgY29uc3QgJCQgPSBjb21wb25lbnQuJCQ7XG4gICAgaWYgKCQkLmZyYWdtZW50ICE9PSBudWxsKSB7XG4gICAgICAgIHJ1bl9hbGwoJCQub25fZGVzdHJveSk7XG4gICAgICAgICQkLmZyYWdtZW50ICYmICQkLmZyYWdtZW50LmQoZGV0YWNoaW5nKTtcbiAgICAgICAgLy8gVE9ETyBudWxsIG91dCBvdGhlciByZWZzLCBpbmNsdWRpbmcgY29tcG9uZW50LiQkIChidXQgbmVlZCB0b1xuICAgICAgICAvLyBwcmVzZXJ2ZSBmaW5hbCBzdGF0ZT8pXG4gICAgICAgICQkLm9uX2Rlc3Ryb3kgPSAkJC5mcmFnbWVudCA9IG51bGw7XG4gICAgICAgICQkLmN0eCA9IFtdO1xuICAgIH1cbn1cbmZ1bmN0aW9uIG1ha2VfZGlydHkoY29tcG9uZW50LCBpKSB7XG4gICAgaWYgKGNvbXBvbmVudC4kJC5kaXJ0eVswXSA9PT0gLTEpIHtcbiAgICAgICAgZGlydHlfY29tcG9uZW50cy5wdXNoKGNvbXBvbmVudCk7XG4gICAgICAgIHNjaGVkdWxlX3VwZGF0ZSgpO1xuICAgICAgICBjb21wb25lbnQuJCQuZGlydHkuZmlsbCgwKTtcbiAgICB9XG4gICAgY29tcG9uZW50LiQkLmRpcnR5WyhpIC8gMzEpIHwgMF0gfD0gKDEgPDwgKGkgJSAzMSkpO1xufVxuZnVuY3Rpb24gaW5pdChjb21wb25lbnQsIG9wdGlvbnMsIGluc3RhbmNlLCBjcmVhdGVfZnJhZ21lbnQsIG5vdF9lcXVhbCwgcHJvcHMsIGRpcnR5ID0gWy0xXSkge1xuICAgIGNvbnN0IHBhcmVudF9jb21wb25lbnQgPSBjdXJyZW50X2NvbXBvbmVudDtcbiAgICBzZXRfY3VycmVudF9jb21wb25lbnQoY29tcG9uZW50KTtcbiAgICBjb25zdCBwcm9wX3ZhbHVlcyA9IG9wdGlvbnMucHJvcHMgfHwge307XG4gICAgY29uc3QgJCQgPSBjb21wb25lbnQuJCQgPSB7XG4gICAgICAgIGZyYWdtZW50OiBudWxsLFxuICAgICAgICBjdHg6IG51bGwsXG4gICAgICAgIC8vIHN0YXRlXG4gICAgICAgIHByb3BzLFxuICAgICAgICB1cGRhdGU6IG5vb3AsXG4gICAgICAgIG5vdF9lcXVhbCxcbiAgICAgICAgYm91bmQ6IGJsYW5rX29iamVjdCgpLFxuICAgICAgICAvLyBsaWZlY3ljbGVcbiAgICAgICAgb25fbW91bnQ6IFtdLFxuICAgICAgICBvbl9kZXN0cm95OiBbXSxcbiAgICAgICAgYmVmb3JlX3VwZGF0ZTogW10sXG4gICAgICAgIGFmdGVyX3VwZGF0ZTogW10sXG4gICAgICAgIGNvbnRleHQ6IG5ldyBNYXAocGFyZW50X2NvbXBvbmVudCA/IHBhcmVudF9jb21wb25lbnQuJCQuY29udGV4dCA6IFtdKSxcbiAgICAgICAgLy8gZXZlcnl0aGluZyBlbHNlXG4gICAgICAgIGNhbGxiYWNrczogYmxhbmtfb2JqZWN0KCksXG4gICAgICAgIGRpcnR5LFxuICAgICAgICBza2lwX2JvdW5kOiBmYWxzZVxuICAgIH07XG4gICAgbGV0IHJlYWR5ID0gZmFsc2U7XG4gICAgJCQuY3R4ID0gaW5zdGFuY2VcbiAgICAgICAgPyBpbnN0YW5jZShjb21wb25lbnQsIHByb3BfdmFsdWVzLCAoaSwgcmV0LCAuLi5yZXN0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHJlc3QubGVuZ3RoID8gcmVzdFswXSA6IHJldDtcbiAgICAgICAgICAgIGlmICgkJC5jdHggJiYgbm90X2VxdWFsKCQkLmN0eFtpXSwgJCQuY3R4W2ldID0gdmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgaWYgKCEkJC5za2lwX2JvdW5kICYmICQkLmJvdW5kW2ldKVxuICAgICAgICAgICAgICAgICAgICAkJC5ib3VuZFtpXSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgaWYgKHJlYWR5KVxuICAgICAgICAgICAgICAgICAgICBtYWtlX2RpcnR5KGNvbXBvbmVudCwgaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9KVxuICAgICAgICA6IFtdO1xuICAgICQkLnVwZGF0ZSgpO1xuICAgIHJlYWR5ID0gdHJ1ZTtcbiAgICBydW5fYWxsKCQkLmJlZm9yZV91cGRhdGUpO1xuICAgIC8vIGBmYWxzZWAgYXMgYSBzcGVjaWFsIGNhc2Ugb2Ygbm8gRE9NIGNvbXBvbmVudFxuICAgICQkLmZyYWdtZW50ID0gY3JlYXRlX2ZyYWdtZW50ID8gY3JlYXRlX2ZyYWdtZW50KCQkLmN0eCkgOiBmYWxzZTtcbiAgICBpZiAob3B0aW9ucy50YXJnZXQpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuaHlkcmF0ZSkge1xuICAgICAgICAgICAgY29uc3Qgbm9kZXMgPSBjaGlsZHJlbihvcHRpb25zLnRhcmdldCk7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLW5vbi1udWxsLWFzc2VydGlvblxuICAgICAgICAgICAgJCQuZnJhZ21lbnQgJiYgJCQuZnJhZ21lbnQubChub2Rlcyk7XG4gICAgICAgICAgICBub2Rlcy5mb3JFYWNoKGRldGFjaCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLW5vbi1udWxsLWFzc2VydGlvblxuICAgICAgICAgICAgJCQuZnJhZ21lbnQgJiYgJCQuZnJhZ21lbnQuYygpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLmludHJvKVxuICAgICAgICAgICAgdHJhbnNpdGlvbl9pbihjb21wb25lbnQuJCQuZnJhZ21lbnQpO1xuICAgICAgICBtb3VudF9jb21wb25lbnQoY29tcG9uZW50LCBvcHRpb25zLnRhcmdldCwgb3B0aW9ucy5hbmNob3IpO1xuICAgICAgICBmbHVzaCgpO1xuICAgIH1cbiAgICBzZXRfY3VycmVudF9jb21wb25lbnQocGFyZW50X2NvbXBvbmVudCk7XG59XG5sZXQgU3ZlbHRlRWxlbWVudDtcbmlmICh0eXBlb2YgSFRNTEVsZW1lbnQgPT09ICdmdW5jdGlvbicpIHtcbiAgICBTdmVsdGVFbGVtZW50ID0gY2xhc3MgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgICAgIHRoaXMuYXR0YWNoU2hhZG93KHsgbW9kZTogJ29wZW4nIH0pO1xuICAgICAgICB9XG4gICAgICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZSB0b2RvOiBpbXByb3ZlIHR5cGluZ3NcbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIHRoaXMuJCQuc2xvdHRlZCkge1xuICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmUgdG9kbzogaW1wcm92ZSB0eXBpbmdzXG4gICAgICAgICAgICAgICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLiQkLnNsb3R0ZWRba2V5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKGF0dHIsIF9vbGRWYWx1ZSwgbmV3VmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXNbYXR0cl0gPSBuZXdWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICAkZGVzdHJveSgpIHtcbiAgICAgICAgICAgIGRlc3Ryb3lfY29tcG9uZW50KHRoaXMsIDEpO1xuICAgICAgICAgICAgdGhpcy4kZGVzdHJveSA9IG5vb3A7XG4gICAgICAgIH1cbiAgICAgICAgJG9uKHR5cGUsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAvLyBUT0RPIHNob3VsZCB0aGlzIGRlbGVnYXRlIHRvIGFkZEV2ZW50TGlzdGVuZXI/XG4gICAgICAgICAgICBjb25zdCBjYWxsYmFja3MgPSAodGhpcy4kJC5jYWxsYmFja3NbdHlwZV0gfHwgKHRoaXMuJCQuY2FsbGJhY2tzW3R5cGVdID0gW10pKTtcbiAgICAgICAgICAgIGNhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSBjYWxsYmFja3MuaW5kZXhPZihjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSlcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgICRzZXQoJCRwcm9wcykge1xuICAgICAgICAgICAgaWYgKHRoaXMuJCRzZXQgJiYgIWlzX2VtcHR5KCQkcHJvcHMpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kJC5za2lwX2JvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLiQkc2V0KCQkcHJvcHMpO1xuICAgICAgICAgICAgICAgIHRoaXMuJCQuc2tpcF9ib3VuZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbn1cbmNsYXNzIFN2ZWx0ZUNvbXBvbmVudCB7XG4gICAgJGRlc3Ryb3koKSB7XG4gICAgICAgIGRlc3Ryb3lfY29tcG9uZW50KHRoaXMsIDEpO1xuICAgICAgICB0aGlzLiRkZXN0cm95ID0gbm9vcDtcbiAgICB9XG4gICAgJG9uKHR5cGUsIGNhbGxiYWNrKSB7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrcyA9ICh0aGlzLiQkLmNhbGxiYWNrc1t0eXBlXSB8fCAodGhpcy4kJC5jYWxsYmFja3NbdHlwZV0gPSBbXSkpO1xuICAgICAgICBjYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IGNhbGxiYWNrcy5pbmRleE9mKGNhbGxiYWNrKTtcbiAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpXG4gICAgICAgICAgICAgICAgY2FsbGJhY2tzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH07XG4gICAgfVxuICAgICRzZXQoJCRwcm9wcykge1xuICAgICAgICBpZiAodGhpcy4kJHNldCAmJiAhaXNfZW1wdHkoJCRwcm9wcykpIHtcbiAgICAgICAgICAgIHRoaXMuJCQuc2tpcF9ib3VuZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLiQkc2V0KCQkcHJvcHMpO1xuICAgICAgICAgICAgdGhpcy4kJC5za2lwX2JvdW5kID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoX2Rldih0eXBlLCBkZXRhaWwpIHtcbiAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KGN1c3RvbV9ldmVudCh0eXBlLCBPYmplY3QuYXNzaWduKHsgdmVyc2lvbjogJzMuMjkuNycgfSwgZGV0YWlsKSkpO1xufVxuZnVuY3Rpb24gYXBwZW5kX2Rldih0YXJnZXQsIG5vZGUpIHtcbiAgICBkaXNwYXRjaF9kZXYoJ1N2ZWx0ZURPTUluc2VydCcsIHsgdGFyZ2V0LCBub2RlIH0pO1xuICAgIGFwcGVuZCh0YXJnZXQsIG5vZGUpO1xufVxuZnVuY3Rpb24gaW5zZXJ0X2Rldih0YXJnZXQsIG5vZGUsIGFuY2hvcikge1xuICAgIGRpc3BhdGNoX2RldignU3ZlbHRlRE9NSW5zZXJ0JywgeyB0YXJnZXQsIG5vZGUsIGFuY2hvciB9KTtcbiAgICBpbnNlcnQodGFyZ2V0LCBub2RlLCBhbmNob3IpO1xufVxuZnVuY3Rpb24gZGV0YWNoX2Rldihub2RlKSB7XG4gICAgZGlzcGF0Y2hfZGV2KCdTdmVsdGVET01SZW1vdmUnLCB7IG5vZGUgfSk7XG4gICAgZGV0YWNoKG5vZGUpO1xufVxuZnVuY3Rpb24gZGV0YWNoX2JldHdlZW5fZGV2KGJlZm9yZSwgYWZ0ZXIpIHtcbiAgICB3aGlsZSAoYmVmb3JlLm5leHRTaWJsaW5nICYmIGJlZm9yZS5uZXh0U2libGluZyAhPT0gYWZ0ZXIpIHtcbiAgICAgICAgZGV0YWNoX2RldihiZWZvcmUubmV4dFNpYmxpbmcpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGRldGFjaF9iZWZvcmVfZGV2KGFmdGVyKSB7XG4gICAgd2hpbGUgKGFmdGVyLnByZXZpb3VzU2libGluZykge1xuICAgICAgICBkZXRhY2hfZGV2KGFmdGVyLnByZXZpb3VzU2libGluZyk7XG4gICAgfVxufVxuZnVuY3Rpb24gZGV0YWNoX2FmdGVyX2RldihiZWZvcmUpIHtcbiAgICB3aGlsZSAoYmVmb3JlLm5leHRTaWJsaW5nKSB7XG4gICAgICAgIGRldGFjaF9kZXYoYmVmb3JlLm5leHRTaWJsaW5nKTtcbiAgICB9XG59XG5mdW5jdGlvbiBsaXN0ZW5fZGV2KG5vZGUsIGV2ZW50LCBoYW5kbGVyLCBvcHRpb25zLCBoYXNfcHJldmVudF9kZWZhdWx0LCBoYXNfc3RvcF9wcm9wYWdhdGlvbikge1xuICAgIGNvbnN0IG1vZGlmaWVycyA9IG9wdGlvbnMgPT09IHRydWUgPyBbJ2NhcHR1cmUnXSA6IG9wdGlvbnMgPyBBcnJheS5mcm9tKE9iamVjdC5rZXlzKG9wdGlvbnMpKSA6IFtdO1xuICAgIGlmIChoYXNfcHJldmVudF9kZWZhdWx0KVxuICAgICAgICBtb2RpZmllcnMucHVzaCgncHJldmVudERlZmF1bHQnKTtcbiAgICBpZiAoaGFzX3N0b3BfcHJvcGFnYXRpb24pXG4gICAgICAgIG1vZGlmaWVycy5wdXNoKCdzdG9wUHJvcGFnYXRpb24nKTtcbiAgICBkaXNwYXRjaF9kZXYoJ1N2ZWx0ZURPTUFkZEV2ZW50TGlzdGVuZXInLCB7IG5vZGUsIGV2ZW50LCBoYW5kbGVyLCBtb2RpZmllcnMgfSk7XG4gICAgY29uc3QgZGlzcG9zZSA9IGxpc3Rlbihub2RlLCBldmVudCwgaGFuZGxlciwgb3B0aW9ucyk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgZGlzcGF0Y2hfZGV2KCdTdmVsdGVET01SZW1vdmVFdmVudExpc3RlbmVyJywgeyBub2RlLCBldmVudCwgaGFuZGxlciwgbW9kaWZpZXJzIH0pO1xuICAgICAgICBkaXNwb3NlKCk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIGF0dHJfZGV2KG5vZGUsIGF0dHJpYnV0ZSwgdmFsdWUpIHtcbiAgICBhdHRyKG5vZGUsIGF0dHJpYnV0ZSwgdmFsdWUpO1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKVxuICAgICAgICBkaXNwYXRjaF9kZXYoJ1N2ZWx0ZURPTVJlbW92ZUF0dHJpYnV0ZScsIHsgbm9kZSwgYXR0cmlidXRlIH0pO1xuICAgIGVsc2VcbiAgICAgICAgZGlzcGF0Y2hfZGV2KCdTdmVsdGVET01TZXRBdHRyaWJ1dGUnLCB7IG5vZGUsIGF0dHJpYnV0ZSwgdmFsdWUgfSk7XG59XG5mdW5jdGlvbiBwcm9wX2Rldihub2RlLCBwcm9wZXJ0eSwgdmFsdWUpIHtcbiAgICBub2RlW3Byb3BlcnR5XSA9IHZhbHVlO1xuICAgIGRpc3BhdGNoX2RldignU3ZlbHRlRE9NU2V0UHJvcGVydHknLCB7IG5vZGUsIHByb3BlcnR5LCB2YWx1ZSB9KTtcbn1cbmZ1bmN0aW9uIGRhdGFzZXRfZGV2KG5vZGUsIHByb3BlcnR5LCB2YWx1ZSkge1xuICAgIG5vZGUuZGF0YXNldFtwcm9wZXJ0eV0gPSB2YWx1ZTtcbiAgICBkaXNwYXRjaF9kZXYoJ1N2ZWx0ZURPTVNldERhdGFzZXQnLCB7IG5vZGUsIHByb3BlcnR5LCB2YWx1ZSB9KTtcbn1cbmZ1bmN0aW9uIHNldF9kYXRhX2Rldih0ZXh0LCBkYXRhKSB7XG4gICAgZGF0YSA9ICcnICsgZGF0YTtcbiAgICBpZiAodGV4dC53aG9sZVRleHQgPT09IGRhdGEpXG4gICAgICAgIHJldHVybjtcbiAgICBkaXNwYXRjaF9kZXYoJ1N2ZWx0ZURPTVNldERhdGEnLCB7IG5vZGU6IHRleHQsIGRhdGEgfSk7XG4gICAgdGV4dC5kYXRhID0gZGF0YTtcbn1cbmZ1bmN0aW9uIHZhbGlkYXRlX2VhY2hfYXJndW1lbnQoYXJnKSB7XG4gICAgaWYgKHR5cGVvZiBhcmcgIT09ICdzdHJpbmcnICYmICEoYXJnICYmIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmICdsZW5ndGgnIGluIGFyZykpIHtcbiAgICAgICAgbGV0IG1zZyA9ICd7I2VhY2h9IG9ubHkgaXRlcmF0ZXMgb3ZlciBhcnJheS1saWtlIG9iamVjdHMuJztcbiAgICAgICAgaWYgKHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgYXJnICYmIFN5bWJvbC5pdGVyYXRvciBpbiBhcmcpIHtcbiAgICAgICAgICAgIG1zZyArPSAnIFlvdSBjYW4gdXNlIGEgc3ByZWFkIHRvIGNvbnZlcnQgdGhpcyBpdGVyYWJsZSBpbnRvIGFuIGFycmF5Lic7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgfVxufVxuZnVuY3Rpb24gdmFsaWRhdGVfc2xvdHMobmFtZSwgc2xvdCwga2V5cykge1xuICAgIGZvciAoY29uc3Qgc2xvdF9rZXkgb2YgT2JqZWN0LmtleXMoc2xvdCkpIHtcbiAgICAgICAgaWYgKCF+a2V5cy5pbmRleE9mKHNsb3Rfa2V5KSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGA8JHtuYW1lfT4gcmVjZWl2ZWQgYW4gdW5leHBlY3RlZCBzbG90IFwiJHtzbG90X2tleX1cIi5gKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmNsYXNzIFN2ZWx0ZUNvbXBvbmVudERldiBleHRlbmRzIFN2ZWx0ZUNvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgICBpZiAoIW9wdGlvbnMgfHwgKCFvcHRpb25zLnRhcmdldCAmJiAhb3B0aW9ucy4kJGlubGluZSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIid0YXJnZXQnIGlzIGEgcmVxdWlyZWQgb3B0aW9uXCIpO1xuICAgICAgICB9XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuICAgICRkZXN0cm95KCkge1xuICAgICAgICBzdXBlci4kZGVzdHJveSgpO1xuICAgICAgICB0aGlzLiRkZXN0cm95ID0gKCkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdDb21wb25lbnQgd2FzIGFscmVhZHkgZGVzdHJveWVkJyk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICAgICAgICB9O1xuICAgIH1cbiAgICAkY2FwdHVyZV9zdGF0ZSgpIHsgfVxuICAgICRpbmplY3Rfc3RhdGUoKSB7IH1cbn1cbmZ1bmN0aW9uIGxvb3BfZ3VhcmQodGltZW91dCkge1xuICAgIGNvbnN0IHN0YXJ0ID0gRGF0ZS5ub3coKTtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBpZiAoRGF0ZS5ub3coKSAtIHN0YXJ0ID4gdGltZW91dCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbmZpbml0ZSBsb29wIGRldGVjdGVkJyk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5leHBvcnQgeyBIdG1sVGFnLCBTdmVsdGVDb21wb25lbnQsIFN2ZWx0ZUNvbXBvbmVudERldiwgU3ZlbHRlRWxlbWVudCwgYWN0aW9uX2Rlc3Ryb3llciwgYWRkX2F0dHJpYnV0ZSwgYWRkX2NsYXNzZXMsIGFkZF9mbHVzaF9jYWxsYmFjaywgYWRkX2xvY2F0aW9uLCBhZGRfcmVuZGVyX2NhbGxiYWNrLCBhZGRfcmVzaXplX2xpc3RlbmVyLCBhZGRfdHJhbnNmb3JtLCBhZnRlclVwZGF0ZSwgYXBwZW5kLCBhcHBlbmRfZGV2LCBhc3NpZ24sIGF0dHIsIGF0dHJfZGV2LCBhdHRyaWJ1dGVfdG9fb2JqZWN0LCBiZWZvcmVVcGRhdGUsIGJpbmQsIGJpbmRpbmdfY2FsbGJhY2tzLCBibGFua19vYmplY3QsIGJ1YmJsZSwgY2hlY2tfb3V0cm9zLCBjaGlsZHJlbiwgY2xhaW1fY29tcG9uZW50LCBjbGFpbV9lbGVtZW50LCBjbGFpbV9zcGFjZSwgY2xhaW1fdGV4dCwgY2xlYXJfbG9vcHMsIGNvbXBvbmVudF9zdWJzY3JpYmUsIGNvbXB1dGVfcmVzdF9wcm9wcywgY29tcHV0ZV9zbG90cywgY3JlYXRlRXZlbnREaXNwYXRjaGVyLCBjcmVhdGVfYW5pbWF0aW9uLCBjcmVhdGVfYmlkaXJlY3Rpb25hbF90cmFuc2l0aW9uLCBjcmVhdGVfY29tcG9uZW50LCBjcmVhdGVfaW5fdHJhbnNpdGlvbiwgY3JlYXRlX291dF90cmFuc2l0aW9uLCBjcmVhdGVfc2xvdCwgY3JlYXRlX3Nzcl9jb21wb25lbnQsIGN1cnJlbnRfY29tcG9uZW50LCBjdXN0b21fZXZlbnQsIGRhdGFzZXRfZGV2LCBkZWJ1ZywgZGVzdHJveV9ibG9jaywgZGVzdHJveV9jb21wb25lbnQsIGRlc3Ryb3lfZWFjaCwgZGV0YWNoLCBkZXRhY2hfYWZ0ZXJfZGV2LCBkZXRhY2hfYmVmb3JlX2RldiwgZGV0YWNoX2JldHdlZW5fZGV2LCBkZXRhY2hfZGV2LCBkaXJ0eV9jb21wb25lbnRzLCBkaXNwYXRjaF9kZXYsIGVhY2gsIGVsZW1lbnQsIGVsZW1lbnRfaXMsIGVtcHR5LCBlc2NhcGUsIGVzY2FwZWQsIGV4Y2x1ZGVfaW50ZXJuYWxfcHJvcHMsIGZpeF9hbmRfZGVzdHJveV9ibG9jaywgZml4X2FuZF9vdXRyb19hbmRfZGVzdHJveV9ibG9jaywgZml4X3Bvc2l0aW9uLCBmbHVzaCwgZ2V0Q29udGV4dCwgZ2V0X2JpbmRpbmdfZ3JvdXBfdmFsdWUsIGdldF9jdXJyZW50X2NvbXBvbmVudCwgZ2V0X2N1c3RvbV9lbGVtZW50c19zbG90cywgZ2V0X3Nsb3RfY2hhbmdlcywgZ2V0X3Nsb3RfY29udGV4dCwgZ2V0X3NwcmVhZF9vYmplY3QsIGdldF9zcHJlYWRfdXBkYXRlLCBnZXRfc3RvcmVfdmFsdWUsIGdsb2JhbHMsIGdyb3VwX291dHJvcywgaGFuZGxlX3Byb21pc2UsIGhhc19wcm9wLCBpZGVudGl0eSwgaW5pdCwgaW5zZXJ0LCBpbnNlcnRfZGV2LCBpbnRyb3MsIGludmFsaWRfYXR0cmlidXRlX25hbWVfY2hhcmFjdGVyLCBpc19jbGllbnQsIGlzX2Nyb3Nzb3JpZ2luLCBpc19lbXB0eSwgaXNfZnVuY3Rpb24sIGlzX3Byb21pc2UsIGxpc3RlbiwgbGlzdGVuX2RldiwgbG9vcCwgbG9vcF9ndWFyZCwgbWlzc2luZ19jb21wb25lbnQsIG1vdW50X2NvbXBvbmVudCwgbm9vcCwgbm90X2VxdWFsLCBub3csIG51bGxfdG9fZW1wdHksIG9iamVjdF93aXRob3V0X3Byb3BlcnRpZXMsIG9uRGVzdHJveSwgb25Nb3VudCwgb25jZSwgb3V0cm9fYW5kX2Rlc3Ryb3lfYmxvY2ssIHByZXZlbnRfZGVmYXVsdCwgcHJvcF9kZXYsIHF1ZXJ5X3NlbGVjdG9yX2FsbCwgcmFmLCBydW4sIHJ1bl9hbGwsIHNhZmVfbm90X2VxdWFsLCBzY2hlZHVsZV91cGRhdGUsIHNlbGVjdF9tdWx0aXBsZV92YWx1ZSwgc2VsZWN0X29wdGlvbiwgc2VsZWN0X29wdGlvbnMsIHNlbGVjdF92YWx1ZSwgc2VsZiwgc2V0Q29udGV4dCwgc2V0X2F0dHJpYnV0ZXMsIHNldF9jdXJyZW50X2NvbXBvbmVudCwgc2V0X2N1c3RvbV9lbGVtZW50X2RhdGEsIHNldF9kYXRhLCBzZXRfZGF0YV9kZXYsIHNldF9pbnB1dF90eXBlLCBzZXRfaW5wdXRfdmFsdWUsIHNldF9ub3csIHNldF9yYWYsIHNldF9zdG9yZV92YWx1ZSwgc2V0X3N0eWxlLCBzZXRfc3ZnX2F0dHJpYnV0ZXMsIHNwYWNlLCBzcHJlYWQsIHN0b3BfcHJvcGFnYXRpb24sIHN1YnNjcmliZSwgc3ZnX2VsZW1lbnQsIHRleHQsIHRpY2ssIHRpbWVfcmFuZ2VzX3RvX2FycmF5LCB0b19udW1iZXIsIHRvZ2dsZV9jbGFzcywgdHJhbnNpdGlvbl9pbiwgdHJhbnNpdGlvbl9vdXQsIHVwZGF0ZV9rZXllZF9lYWNoLCB1cGRhdGVfc2xvdCwgdmFsaWRhdGVfY29tcG9uZW50LCB2YWxpZGF0ZV9lYWNoX2FyZ3VtZW50LCB2YWxpZGF0ZV9lYWNoX2tleXMsIHZhbGlkYXRlX3Nsb3RzLCB2YWxpZGF0ZV9zdG9yZSwgeGxpbmtfYXR0ciB9O1xuIiwiaW1wb3J0IHsgbm9vcCwgc2FmZV9ub3RfZXF1YWwsIHN1YnNjcmliZSwgcnVuX2FsbCwgaXNfZnVuY3Rpb24gfSBmcm9tICcuLi9pbnRlcm5hbC9pbmRleC5tanMnO1xuZXhwb3J0IHsgZ2V0X3N0b3JlX3ZhbHVlIGFzIGdldCB9IGZyb20gJy4uL2ludGVybmFsL2luZGV4Lm1qcyc7XG5cbmNvbnN0IHN1YnNjcmliZXJfcXVldWUgPSBbXTtcbi8qKlxuICogQ3JlYXRlcyBhIGBSZWFkYWJsZWAgc3RvcmUgdGhhdCBhbGxvd3MgcmVhZGluZyBieSBzdWJzY3JpcHRpb24uXG4gKiBAcGFyYW0gdmFsdWUgaW5pdGlhbCB2YWx1ZVxuICogQHBhcmFtIHtTdGFydFN0b3BOb3RpZmllcn1zdGFydCBzdGFydCBhbmQgc3RvcCBub3RpZmljYXRpb25zIGZvciBzdWJzY3JpcHRpb25zXG4gKi9cbmZ1bmN0aW9uIHJlYWRhYmxlKHZhbHVlLCBzdGFydCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHN1YnNjcmliZTogd3JpdGFibGUodmFsdWUsIHN0YXJ0KS5zdWJzY3JpYmVcbiAgICB9O1xufVxuLyoqXG4gKiBDcmVhdGUgYSBgV3JpdGFibGVgIHN0b3JlIHRoYXQgYWxsb3dzIGJvdGggdXBkYXRpbmcgYW5kIHJlYWRpbmcgYnkgc3Vic2NyaXB0aW9uLlxuICogQHBhcmFtIHsqPX12YWx1ZSBpbml0aWFsIHZhbHVlXG4gKiBAcGFyYW0ge1N0YXJ0U3RvcE5vdGlmaWVyPX1zdGFydCBzdGFydCBhbmQgc3RvcCBub3RpZmljYXRpb25zIGZvciBzdWJzY3JpcHRpb25zXG4gKi9cbmZ1bmN0aW9uIHdyaXRhYmxlKHZhbHVlLCBzdGFydCA9IG5vb3ApIHtcbiAgICBsZXQgc3RvcDtcbiAgICBjb25zdCBzdWJzY3JpYmVycyA9IFtdO1xuICAgIGZ1bmN0aW9uIHNldChuZXdfdmFsdWUpIHtcbiAgICAgICAgaWYgKHNhZmVfbm90X2VxdWFsKHZhbHVlLCBuZXdfdmFsdWUpKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IG5ld192YWx1ZTtcbiAgICAgICAgICAgIGlmIChzdG9wKSB7IC8vIHN0b3JlIGlzIHJlYWR5XG4gICAgICAgICAgICAgICAgY29uc3QgcnVuX3F1ZXVlID0gIXN1YnNjcmliZXJfcXVldWUubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3Vic2NyaWJlcnMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcyA9IHN1YnNjcmliZXJzW2ldO1xuICAgICAgICAgICAgICAgICAgICBzWzFdKCk7XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXJfcXVldWUucHVzaChzLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChydW5fcXVldWUpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdWJzY3JpYmVyX3F1ZXVlLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVyX3F1ZXVlW2ldWzBdKHN1YnNjcmliZXJfcXVldWVbaSArIDFdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVyX3F1ZXVlLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHVwZGF0ZShmbikge1xuICAgICAgICBzZXQoZm4odmFsdWUpKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gc3Vic2NyaWJlKHJ1biwgaW52YWxpZGF0ZSA9IG5vb3ApIHtcbiAgICAgICAgY29uc3Qgc3Vic2NyaWJlciA9IFtydW4sIGludmFsaWRhdGVdO1xuICAgICAgICBzdWJzY3JpYmVycy5wdXNoKHN1YnNjcmliZXIpO1xuICAgICAgICBpZiAoc3Vic2NyaWJlcnMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICBzdG9wID0gc3RhcnQoc2V0KSB8fCBub29wO1xuICAgICAgICB9XG4gICAgICAgIHJ1bih2YWx1ZSk7XG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IHN1YnNjcmliZXJzLmluZGV4T2Yoc3Vic2NyaWJlcik7XG4gICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgc3Vic2NyaWJlcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzdWJzY3JpYmVycy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICBzdG9wKCk7XG4gICAgICAgICAgICAgICAgc3RvcCA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiB7IHNldCwgdXBkYXRlLCBzdWJzY3JpYmUgfTtcbn1cbmZ1bmN0aW9uIGRlcml2ZWQoc3RvcmVzLCBmbiwgaW5pdGlhbF92YWx1ZSkge1xuICAgIGNvbnN0IHNpbmdsZSA9ICFBcnJheS5pc0FycmF5KHN0b3Jlcyk7XG4gICAgY29uc3Qgc3RvcmVzX2FycmF5ID0gc2luZ2xlXG4gICAgICAgID8gW3N0b3Jlc11cbiAgICAgICAgOiBzdG9yZXM7XG4gICAgY29uc3QgYXV0byA9IGZuLmxlbmd0aCA8IDI7XG4gICAgcmV0dXJuIHJlYWRhYmxlKGluaXRpYWxfdmFsdWUsIChzZXQpID0+IHtcbiAgICAgICAgbGV0IGluaXRlZCA9IGZhbHNlO1xuICAgICAgICBjb25zdCB2YWx1ZXMgPSBbXTtcbiAgICAgICAgbGV0IHBlbmRpbmcgPSAwO1xuICAgICAgICBsZXQgY2xlYW51cCA9IG5vb3A7XG4gICAgICAgIGNvbnN0IHN5bmMgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAocGVuZGluZykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNsZWFudXAoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGZuKHNpbmdsZSA/IHZhbHVlc1swXSA6IHZhbHVlcywgc2V0KTtcbiAgICAgICAgICAgIGlmIChhdXRvKSB7XG4gICAgICAgICAgICAgICAgc2V0KHJlc3VsdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjbGVhbnVwID0gaXNfZnVuY3Rpb24ocmVzdWx0KSA/IHJlc3VsdCA6IG5vb3A7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHVuc3Vic2NyaWJlcnMgPSBzdG9yZXNfYXJyYXkubWFwKChzdG9yZSwgaSkgPT4gc3Vic2NyaWJlKHN0b3JlLCAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHZhbHVlc1tpXSA9IHZhbHVlO1xuICAgICAgICAgICAgcGVuZGluZyAmPSB+KDEgPDwgaSk7XG4gICAgICAgICAgICBpZiAoaW5pdGVkKSB7XG4gICAgICAgICAgICAgICAgc3luYygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICBwZW5kaW5nIHw9ICgxIDw8IGkpO1xuICAgICAgICB9KSk7XG4gICAgICAgIGluaXRlZCA9IHRydWU7XG4gICAgICAgIHN5bmMoKTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIHN0b3AoKSB7XG4gICAgICAgICAgICBydW5fYWxsKHVuc3Vic2NyaWJlcnMpO1xuICAgICAgICAgICAgY2xlYW51cCgpO1xuICAgICAgICB9O1xuICAgIH0pO1xufVxuXG5leHBvcnQgeyBkZXJpdmVkLCByZWFkYWJsZSwgd3JpdGFibGUgfTtcbiIsImltcG9ydCB7IHdyaXRhYmxlIH0gZnJvbSAnc3ZlbHRlL3N0b3JlJztcbmltcG9ydCB7IFBsYW5TdW1tYXJ5RGF0YSB9IGZyb20gJy4vcGxhbi1kYXRhJztcblxuZXhwb3J0IGNvbnN0IHBsYW5TdW1tYXJ5ID0gd3JpdGFibGUobmV3IFBsYW5TdW1tYXJ5RGF0YShbXSkpO1xuXG5leHBvcnQgY29uc3Qgbm93UG9zaXRpb24gPSB3cml0YWJsZSgwKTtcblxuZXhwb3J0IGNvbnN0IG5vdyA9IHdyaXRhYmxlKG5ldyBEYXRlKCkpO1xuXG5leHBvcnQgY29uc3Qgem9vbUxldmVsID0gd3JpdGFibGUoNCk7IiwiPHNjcmlwdCBsYW5nPVwidHNcIj5cbiAgICBpbXBvcnQgeyBvbk1vdW50IH0gZnJvbSAnc3ZlbHRlJztcbiAgICBpbXBvcnQgeyBvbkRlc3Ryb3kgfSBmcm9tIFwic3ZlbHRlXCI7XG4gICAgaW1wb3J0IHsgcGxhblN1bW1hcnksIG5vdywgbm93UG9zaXRpb24sIHpvb21MZXZlbCB9IGZyb20gJy4vdGltZWxpbmUtc3RvcmUnO1xuICAgIGltcG9ydCB0eXBlIHsgUGxhbkl0ZW0sIFBsYW5TdW1tYXJ5RGF0YSB9IGZyb20gJy4vcGxhbi1kYXRhJztcbiAgICBjb25zdCBtb21lbnQgPSAod2luZG93IGFzIGFueSkubW9tZW50O1xuXG4gICAgZXhwb3J0IGxldCBzdW1tYXJ5OiBQbGFuU3VtbWFyeURhdGE7XG4gICAgZXhwb3J0IGxldCByb290RWw6IEhUTUxFbGVtZW50O1xuICAgIGxldCB0aW1lbGluZVpvb21MZXZlbDogbnVtYmVyO1xuICAgIGxldCBwb3NpdGlvbjogbnVtYmVyO1xuICAgIGxldCBjdXJyZW50VGltZTogRGF0ZTtcbiAgICBsZXQgYXV0b1Njcm9sbDogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBjb25zdCB1bnN1YlN1bW1hcnkgPSBwbGFuU3VtbWFyeS5zdWJzY3JpYmUodmFsID0+IHtcbiAgICAgICAgc3VtbWFyeSA9IHZhbDtcbiAgICB9KTtcblxuICAgIGNvbnN0IHVuc3ViUG9zaXRpb24gPSBub3dQb3NpdGlvbi5zdWJzY3JpYmUodmFsID0+IHtcbiAgICAgICAgcG9zaXRpb24gPSB2YWw7XG4gICAgfSk7XG5cbiAgICBjb25zdCB1bnN1YkN1cnJlbnRUaW1lID0gbm93LnN1YnNjcmliZSh2YWwgPT4ge1xuICAgICAgICBjdXJyZW50VGltZSA9IHZhbDtcbiAgICAgICAgc2Nyb2xsVG9Qb3NpdGlvbihwb3NpdGlvbiAtIDE1MCk7XG4gICAgICAgIGlmKCF0aW1lbGluZVpvb21MZXZlbCkge1xuICAgICAgICAgIHRpbWVsaW5lWm9vbUxldmVsID0gNDtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgdW5zdWJTZXR0aW5ncyA9IHpvb21MZXZlbC5zdWJzY3JpYmUodmFsID0+IHtcbiAgICAgIHRpbWVsaW5lWm9vbUxldmVsID0gdmFsO1xuICAgIH0pO1xuXG4gICAgb25EZXN0cm95KHVuc3ViU3VtbWFyeSk7XG4gICAgb25EZXN0cm95KHVuc3ViUG9zaXRpb24pO1xuICAgIG9uRGVzdHJveSh1bnN1YkN1cnJlbnRUaW1lKTtcbiAgICBvbkRlc3Ryb3kodW5zdWJTZXR0aW5ncyk7XG5cbiAgICBmdW5jdGlvbiBzY3JvbGxUb1Bvc2l0aW9uKHBvc2l0aW9uOiBudW1iZXIpIHtcbiAgICAgIGlmKGF1dG9TY3JvbGwpIHtcbiAgICAgICAgcm9vdEVsLnNjcm9sbFRvKHsgbGVmdDogMCwgdG9wOiBwb3NpdGlvbiwgYmVoYXZpb3I6ICdzbW9vdGgnIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluTWlucyh0aW1lOiBEYXRlKXtcbiAgICAgICAgcmV0dXJuIG1vbWVudC5kdXJhdGlvbihtb21lbnQodGltZSkuZm9ybWF0KCdISDptbScpKS5hc01pbnV0ZXMoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvZmZzZXQoaXRlbTogUGxhbkl0ZW0pIHtcbiAgICAgICAgY29uc3QgbWludXRlT2Zmc2V0ID0gaW5NaW5zKGl0ZW0udGltZSkqdGltZWxpbmVab29tTGV2ZWw7XG4gICAgICAgIHJldHVybiBtaW51dGVPZmZzZXQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2hvcnRDbGFzcyhpdGVtOiBQbGFuSXRlbSkge1xuICAgICAgcmV0dXJuIGl0ZW0uZHVyYXRpb25NaW5zIDwgKDc1L3RpbWVsaW5lWm9vbUxldmVsKSA/ICdzaG9ydCcgOiAnJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXN0Q2xhc3MoaXRlbTogUGxhbkl0ZW0pIHtcbiAgICAgIHJldHVybiBpdGVtLmlzUGFzdCA/ICdwYXN0JyA6ICcnO1xuICAgIH1cblxuPC9zY3JpcHQ+XG5cbjxzdHlsZT5cblxuI2RheS1wbGFubmVyLXRpbWVsaW5lLWNvbnRhaW5lciB7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIGhlaWdodDogMTQ0MHB4O1xuXG4gICAgLS1za29iZWxvZmY6ICMwMDY0NjZmZjtcbiAgICAtLW1pZG5pZ2h0LWdyZWVuLWVhZ2xlLWdyZWVuOiAjMDY1YTYwZmY7XG4gICAgLS1taWRuaWdodC1ncmVlbi1lYWdsZS1ncmVlbi0yOiAjMGI1MjViZmY7XG4gICAgLS1taWRuaWdodC1ncmVlbi1lYWdsZS1ncmVlbi0zOiAjMTQ0NTUyZmY7XG4gICAgLS1jaGFyY29hbDogIzFiM2E0YmZmO1xuICAgIC0tcHJ1c3NpYW4tYmx1ZTogIzIxMmY0NWZmO1xuICAgIC0tc3BhY2UtY2FkZXQ6ICMyNzI2NDBmZjtcbiAgICAtLWRhcmstcHVycGxlOiAjMzEyMjQ0ZmY7XG4gICAgLS1ydXNzaWFuLXZpb2xldDogIzNlMWY0N2ZmO1xuICAgIC0tcnVzc2lhbi12aW9sZXQtMjogIzRkMTk0ZGZmO1xufVxuXG4uYXNpZGUge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogLTFweDtcbiAgbGVmdDogMDtcbiAgd2lkdGg6IDY1cHg7XG4gIGhlaWdodDogMTAwJTtcblxuICBiYWNrZ3JvdW5kLXJlcGVhdDogcmVwZWF0LXk7XG4gIG9wYWNpdHk6IDgwJTtcbn1cblxuLmFzaWRlLXg1IHtcbiAgYmFja2dyb3VuZC1pbWFnZTogdXJsKGRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQllBQUFFc0NBWUFBQURISWtORUFBQUFBWE5TUjBJQXJzNGM2UUFBQUZCbFdFbG1UVTBBS2dBQUFBZ0FBZ0VTQUFNQUFBQUJBQUVBQUlkcEFBUUFBQUFCQUFBQUpnQUFBQUFBQTZBQkFBTUFBQUFCQUFFQUFLQUNBQVFBQUFBQkFBQUFGcUFEQUFRQUFBQUJBQUFCTEFBQUFBQXVNVzdHQUFBQldXbFVXSFJZVFV3NlkyOXRMbUZrYjJKbExuaHRjQUFBQUFBQVBIZzZlRzF3YldWMFlTQjRiV3h1Y3pwNFBTSmhaRzlpWlRwdWN6cHRaWFJoTHlJZ2VEcDRiWEIwYXowaVdFMVFJRU52Y21VZ05TNDBMakFpUGdvZ0lDQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQZ29nSUNBZ0lDQThjbVJtT2tSbGMyTnlhWEIwYVc5dUlISmtaanBoWW05MWREMGlJZ29nSUNBZ0lDQWdJQ0FnSUNCNGJXeHVjenAwYVdabVBTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM1JwWm1Zdk1TNHdMeUkrQ2lBZ0lDQWdJQ0FnSUR4MGFXWm1Pazl5YVdWdWRHRjBhVzl1UGpFOEwzUnBabVk2VDNKcFpXNTBZWFJwYjI0K0NpQWdJQ0FnSUR3dmNtUm1Pa1JsYzJOeWFYQjBhVzl1UGdvZ0lDQThMM0prWmpwU1JFWStDand2ZURwNGJYQnRaWFJoUGdwTXdpZFpBQUFBc0VsRVFWUjRBZTNaTVFvQUlBZ0ZVTDMvb2NzTzBHQkxGRTl3RVNKOGpqOGpZbFFyQWdRSUVDQkFnQUFCQWdRSUVDQkFnQUFCQWdRSUVDQkFnQUNCYndXeU51dEdRdXVOSWtDQUFBRUNCQWdRSUVDQUFBRUNCQWdRSUVDQUFBRUNCQWdRZUViZ0pCTGFMU2NxMnNtWUV5QkFnQUFCQWdRSUVDQkFnQUFCQWdRSUVDQkFnQUFCQWdTdUNweEVRcUtmcXlmek9RRUNCQWdRSUVDQUFBRUNCQWdRSUVDQUFBRUNCQWdRSUVDZ0t6QUJ3V1VFQkhCQ3lxWUFBQUFBU1VWT1JLNUNZSUk9KTtcbn1cblxuLmFzaWRlLXg0IHtcbiAgYmFja2dyb3VuZC1pbWFnZTogdXJsKGRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQllBQUFEd0NBWUFBQUFFcVpTa0FBQUFCR2RCVFVFQUFMR1BDL3hoQlFBQUFDQmpTRkpOQUFCNkpnQUFnSVFBQVBvQUFBQ0E2QUFBZFRBQUFPcGdBQUE2bUFBQUYzQ2N1bEU4QUFBQWVHVllTV1pOVFFBcUFBQUFDQUFFQVJJQUF3QUFBQUVBQVFBQUFSb0FCUUFBQUFFQUFBQStBUnNBQlFBQUFBRUFBQUJHaDJrQUJBQUFBQUVBQUFCT0FBQUFBQUFBQUVnQUFBQUJBQUFBU0FBQUFBRUFBNkFCQUFNQUFBQUJBQUVBQUtBQ0FBUUFBQUFCQUFBQUZxQURBQVFBQUFBQkFBQUE4QUFBQUFCVUs2K1NBQUFBQ1hCSVdYTUFBQXNUQUFBTEV3RUFtcHdZQUFBQ01XbFVXSFJZVFV3NlkyOXRMbUZrYjJKbExuaHRjQUFBQUFBQVBIZzZlRzF3YldWMFlTQjRiV3h1Y3pwNFBTSmhaRzlpWlRwdWN6cHRaWFJoTHlJZ2VEcDRiWEIwYXowaVdFMVFJRU52Y21VZ05TNDBMakFpUGdvZ0lDQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQZ29nSUNBZ0lDQThjbVJtT2tSbGMyTnlhWEIwYVc5dUlISmtaanBoWW05MWREMGlJZ29nSUNBZ0lDQWdJQ0FnSUNCNGJXeHVjenAwYVdabVBTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM1JwWm1Zdk1TNHdMeUlLSUNBZ0lDQWdJQ0FnSUNBZ2VHMXNibk02WlhocFpqMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzlsZUdsbUx6RXVNQzhpUGdvZ0lDQWdJQ0FnSUNBOGRHbG1aanBQY21sbGJuUmhkR2x2Ymo0eFBDOTBhV1ptT2s5eWFXVnVkR0YwYVc5dVBnb2dJQ0FnSUNBZ0lDQThaWGhwWmpwRGIyeHZjbE53WVdObFBqRThMMlY0YVdZNlEyOXNiM0pUY0dGalpUNEtJQ0FnSUNBZ0lDQWdQR1Y0YVdZNlVHbDRaV3hZUkdsdFpXNXphVzl1UGpJeVBDOWxlR2xtT2xCcGVHVnNXRVJwYldWdWMybHZiajRLSUNBZ0lDQWdJQ0FnUEdWNGFXWTZVR2w0Wld4WlJHbHRaVzV6YVc5dVBqTXdNRHd2WlhocFpqcFFhWGhsYkZsRWFXMWxibk5wYjI0K0NpQWdJQ0FnSUR3dmNtUm1Pa1JsYzJOeWFYQjBhVzl1UGdvZ0lDQThMM0prWmpwU1JFWStDand2ZURwNGJYQnRaWFJoUGdyTDIveHFBQUFBMmtsRVFWUjRBZTNiTVFxRU1CQkEwUVQyQmg3Rys1ZDJlNUc5d1JacnVsaU02Q0NCc0U4UVFnaHhlT1VIYXlubHZiL3pQSFVmOVRYUHVDWWxRSUFBQVFJRUNCQWdRSUFBQVFJRUNCQWc4TjhDTGVndE53aytWODYzaTdjckI3c3phN2Nldjh5MHplLzRNWDJSQUFFQ0JBZ1FJRUNBQUFFQ0JBZ1FJRUNBQUlFbWtHbWJrZHloZVdiYVpuVHhtT2FaYVp2UnhKcG5KR09mQUFFQ0JBZ1FJRUNBQUFFQ0JBZ1FJRUNBd0VNQ21iWjVhSmpSSEptMk9hWmhuazE4OTU5MERUUFN0RStBQUFFQ0JBZ1FJRUNBQUFFQ0JBZ1FJRUJnVm9FZmdMY0o0SldLd01BQUFBQUFTVVZPUks1Q1lJST0pO1xufVxuXG4uYXNpZGUteDMge1xuICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCWUFBQUMwQ0FZQUFBQ1FZTnplQUFBQUJHZEJUVUVBQUxHUEMveGhCUUFBQUNCalNGSk5BQUI2SmdBQWdJUUFBUG9BQUFDQTZBQUFkVEFBQU9wZ0FBQTZtQUFBRjNDY3VsRThBQUFBZUdWWVNXWk5UUUFxQUFBQUNBQUVBUklBQXdBQUFBRUFBUUFBQVJvQUJRQUFBQUVBQUFBK0FSc0FCUUFBQUFFQUFBQkdoMmtBQkFBQUFBRUFBQUJPQUFBQUFBQUFBRWdBQUFBQkFBQUFTQUFBQUFFQUE2QUJBQU1BQUFBQkFBRUFBS0FDQUFRQUFBQUJBQUFBRnFBREFBUUFBQUFCQUFBQXRBQUFBQUQ1V0ZFYkFBQUFDWEJJV1hNQUFBc1RBQUFMRXdFQW1wd1lBQUFDTVdsVVdIUllUVXc2WTI5dExtRmtiMkpsTG5odGNBQUFBQUFBUEhnNmVHMXdiV1YwWVNCNGJXeHVjenA0UFNKaFpHOWlaVHB1Y3pwdFpYUmhMeUlnZURwNGJYQjBhejBpV0UxUUlFTnZjbVVnTlM0MExqQWlQZ29nSUNBOGNtUm1PbEpFUmlCNGJXeHVjenB5WkdZOUltaDBkSEE2THk5M2QzY3Vkek11YjNKbkx6RTVPVGt2TURJdk1qSXRjbVJtTFhONWJuUmhlQzF1Y3lNaVBnb2dJQ0FnSUNBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlnb2dJQ0FnSUNBZ0lDQWdJQ0I0Yld4dWN6cDBhV1ptUFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzUnBabVl2TVM0d0x5SUtJQ0FnSUNBZ0lDQWdJQ0FnZUcxc2JuTTZaWGhwWmowaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOWxlR2xtTHpFdU1DOGlQZ29nSUNBZ0lDQWdJQ0E4ZEdsbVpqcFBjbWxsYm5SaGRHbHZiajR4UEM5MGFXWm1Pazl5YVdWdWRHRjBhVzl1UGdvZ0lDQWdJQ0FnSUNBOFpYaHBaanBEYjJ4dmNsTndZV05sUGpFOEwyVjRhV1k2UTI5c2IzSlRjR0ZqWlQ0S0lDQWdJQ0FnSUNBZ1BHVjRhV1k2VUdsNFpXeFlSR2x0Wlc1emFXOXVQakl5UEM5bGVHbG1PbEJwZUdWc1dFUnBiV1Z1YzJsdmJqNEtJQ0FnSUNBZ0lDQWdQR1Y0YVdZNlVHbDRaV3haUkdsdFpXNXphVzl1UGpNd01Ed3ZaWGhwWmpwUWFYaGxiRmxFYVcxbGJuTnBiMjQrQ2lBZ0lDQWdJRHd2Y21SbU9rUmxjMk55YVhCMGFXOXVQZ29nSUNBOEwzSmtaanBTUkVZK0Nqd3ZlRHA0YlhCdFpYUmhQZ3JMMi94cUFBQUE2VWxFUVZSb0JlM1hRUXJDUUF3RjBCYjBIcjJoZUI0djE0TUlPdG1saThHbWxGSGhCUWJpbUE3aDdmNDhUZE9qbmYrcHVhMTYvWjkxYlVxQUFBRUNCQWdRSUVDQUFBRUNId1FpNThXcDFLc3lmUHBzYkxzVVgxMzN6Ri9hMEczUFlKcTVwMzU4R3hTeGRhV2VsV0d6QkFnUUlFQ0FBQUVDQkFnUUlEQlVJSEplbkROcVRIaVBiWmN6MW0xdnJQbWRJeUU5ZjUvN01lRTlLS29oUFcrWmUrRTlhK2dKRUNCQWdBQUJBZ1FJRUNEd0hZSEllWEVxTlNhTTl6YUtiWmZlbjUzN3RYTy91VDRTMHNlRThjMmE2VWRRVkVPNk1KNEF0UVFJRUNCQWdBQUJBZ1FJRUNEd3F3SnY5bE1NV0Rjb05NQUFBQUFBU1VWT1JLNUNZSUk9KTtcbn1cblxuLmFzaWRlLXgyIHtcbiAgYmFja2dyb3VuZC1pbWFnZTogdXJsKGRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQllBQUFCNENBWUFBQUQyU2dJUkFBQUFCR2RCVFVFQUFMR1BDL3hoQlFBQUFDQmpTRkpOQUFCNkpnQUFnSVFBQVBvQUFBQ0E2QUFBZFRBQUFPcGdBQUE2bUFBQUYzQ2N1bEU4QUFBQWVHVllTV1pOVFFBcUFBQUFDQUFFQVJJQUF3QUFBQUVBQVFBQUFSb0FCUUFBQUFFQUFBQStBUnNBQlFBQUFBRUFBQUJHaDJrQUJBQUFBQUVBQUFCT0FBQUFBQUFBQUVnQUFBQUJBQUFBU0FBQUFBRUFBNkFCQUFNQUFBQUJBQUVBQUtBQ0FBUUFBQUFCQUFBQUZxQURBQVFBQUFBQkFBQUFlQUFBQUFEVnZWVEJBQUFBQ1hCSVdYTUFBQXNUQUFBTEV3RUFtcHdZQUFBQ01XbFVXSFJZVFV3NlkyOXRMbUZrYjJKbExuaHRjQUFBQUFBQVBIZzZlRzF3YldWMFlTQjRiV3h1Y3pwNFBTSmhaRzlpWlRwdWN6cHRaWFJoTHlJZ2VEcDRiWEIwYXowaVdFMVFJRU52Y21VZ05TNDBMakFpUGdvZ0lDQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQZ29nSUNBZ0lDQThjbVJtT2tSbGMyTnlhWEIwYVc5dUlISmtaanBoWW05MWREMGlJZ29nSUNBZ0lDQWdJQ0FnSUNCNGJXeHVjenAwYVdabVBTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM1JwWm1Zdk1TNHdMeUlLSUNBZ0lDQWdJQ0FnSUNBZ2VHMXNibk02WlhocFpqMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzlsZUdsbUx6RXVNQzhpUGdvZ0lDQWdJQ0FnSUNBOGRHbG1aanBQY21sbGJuUmhkR2x2Ymo0eFBDOTBhV1ptT2s5eWFXVnVkR0YwYVc5dVBnb2dJQ0FnSUNBZ0lDQThaWGhwWmpwRGIyeHZjbE53WVdObFBqRThMMlY0YVdZNlEyOXNiM0pUY0dGalpUNEtJQ0FnSUNBZ0lDQWdQR1Y0YVdZNlVHbDRaV3hZUkdsdFpXNXphVzl1UGpJeVBDOWxlR2xtT2xCcGVHVnNXRVJwYldWdWMybHZiajRLSUNBZ0lDQWdJQ0FnUEdWNGFXWTZVR2w0Wld4WlJHbHRaVzV6YVc5dVBqTXdNRHd2WlhocFpqcFFhWGhsYkZsRWFXMWxibk5wYjI0K0NpQWdJQ0FnSUR3dmNtUm1Pa1JsYzJOeWFYQjBhVzl1UGdvZ0lDQThMM0prWmpwU1JFWStDand2ZURwNGJYQnRaWFJoUGdyTDIveHFBQUFBdDBsRVFWUm9CZTNZTVFxQU1BeUY0VllVRCtJaTdwN0pLN3Q0RWtWc25Pb1NFdHFsK0F1QzJHZElQeHhDWXdoaFMzYzdWMHl0anUyMFM2Y0lJSUFBQWdnZzhFY0JHVmg2NThZdlo3NXVYRHFlblNWM1MxNFlGa3N3eTVnS1oza2VFVUFBQVFRUVFBQ0Jud25JN05aVjJ2TmRxWTVlUmpxZTlJaDU5Y2lUTW0ydStZdUM1MC9oZ2pyNnAwSXg2Qkh6Nm1sT0VrUUFBUVFRUUFBQkJCd0NNckJ3dHZtQ2NiYnArRytJSW9BQUFnZ2dnQUFDQ0RnRkhxbi9DcHF5M1ZNMUFBQUFBRWxGVGtTdVFtQ0MpO1xufVxuXG4uYXNpZGUteDEge1xuICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCWUFBQUE4Q0FZQUFBQmlnMHByQUFBQUJHZEJUVUVBQUxHUEMveGhCUUFBQUNCalNGSk5BQUI2SmdBQWdJUUFBUG9BQUFDQTZBQUFkVEFBQU9wZ0FBQTZtQUFBRjNDY3VsRThBQUFBZUdWWVNXWk5UUUFxQUFBQUNBQUVBUklBQXdBQUFBRUFBUUFBQVJvQUJRQUFBQUVBQUFBK0FSc0FCUUFBQUFFQUFBQkdoMmtBQkFBQUFBRUFBQUJPQUFBQUFBQUFBRWdBQUFBQkFBQUFTQUFBQUFFQUE2QUJBQU1BQUFBQkFBRUFBS0FDQUFRQUFBQUJBQUFBRnFBREFBUUFBQUFCQUFBQVBBQUFBQUI0enFwSUFBQUFDWEJJV1hNQUFBc1RBQUFMRXdFQW1wd1lBQUFDTVdsVVdIUllUVXc2WTI5dExtRmtiMkpsTG5odGNBQUFBQUFBUEhnNmVHMXdiV1YwWVNCNGJXeHVjenA0UFNKaFpHOWlaVHB1Y3pwdFpYUmhMeUlnZURwNGJYQjBhejBpV0UxUUlFTnZjbVVnTlM0MExqQWlQZ29nSUNBOGNtUm1PbEpFUmlCNGJXeHVjenB5WkdZOUltaDBkSEE2THk5M2QzY3Vkek11YjNKbkx6RTVPVGt2TURJdk1qSXRjbVJtTFhONWJuUmhlQzF1Y3lNaVBnb2dJQ0FnSUNBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlnb2dJQ0FnSUNBZ0lDQWdJQ0I0Yld4dWN6cDBhV1ptUFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzUnBabVl2TVM0d0x5SUtJQ0FnSUNBZ0lDQWdJQ0FnZUcxc2JuTTZaWGhwWmowaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOWxlR2xtTHpFdU1DOGlQZ29nSUNBZ0lDQWdJQ0E4ZEdsbVpqcFBjbWxsYm5SaGRHbHZiajR4UEM5MGFXWm1Pazl5YVdWdWRHRjBhVzl1UGdvZ0lDQWdJQ0FnSUNBOFpYaHBaanBEYjJ4dmNsTndZV05sUGpFOEwyVjRhV1k2UTI5c2IzSlRjR0ZqWlQ0S0lDQWdJQ0FnSUNBZ1BHVjRhV1k2VUdsNFpXeFlSR2x0Wlc1emFXOXVQakl5UEM5bGVHbG1PbEJwZUdWc1dFUnBiV1Z1YzJsdmJqNEtJQ0FnSUNBZ0lDQWdQR1Y0YVdZNlVHbDRaV3haUkdsdFpXNXphVzl1UGpNd01Ed3ZaWGhwWmpwUWFYaGxiRmxFYVcxbGJuTnBiMjQrQ2lBZ0lDQWdJRHd2Y21SbU9rUmxjMk55YVhCMGFXOXVQZ29nSUNBOEwzSmtaanBTUkVZK0Nqd3ZlRHA0YlhCdFpYUmhQZ3JMMi94cUFBQUFyRWxFUVZSWUNlMlZTd3FBTUF4RVczV2pLM2VDSHNUN0gwYkJRL2pwN0xxb2tJUWlyVXloVU1Ja0pBOHk5YzY1TmR4NmpnK3RkdlcweTA1SjRDY0VzSG10Y3BaVHFjOHJSOGVMc3VRbTBjT0Flb213R0ExUTRHck9yUkZUU3dJa2tDQ0FyV3NTY1V2b3NpU3BjOUR4ck01S0oreHhHTFk1eElIaTN4YmJmQnVLZHZwR2huRVNxSjhBdkdKU2puRkk5TEROVVNLTU5LTENrVDd2MC9MbmZmTzM1WjJUMVVpQUJBb2w4QUNaNlFsZUVDbThCUUFBQUFCSlJVNUVya0pnZ2c9PSk7XG59XG5cbi5hc2lkZV9fbGluZSB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgbGVmdDogNjVweDtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC01MCUpO1xuICB3aWR0aDogNHB4O1xuICBoZWlnaHQ6IDEwMCU7XG4gIGJhY2tncm91bmQ6IHZhcigtLXRleHQtYWNjZW50KTtcbn1cblxuLmZpbGxlZCB7XG4gIHRyYW5zZm9ybS1vcmlnaW46IHRvcCBjZW50ZXI7XG4gIHotaW5kZXg6IDE7XG4gIGFuaW1hdGlvbjogc2NhbGVEb3duIDFzIGVhc2UtaW4tb3V0O1xuICBhbmltYXRpb24tZmlsbC1tb2RlOiBmb3J3YXJkcztcbn1cblxuLmZpbGxlZF9fbGluZV9fY29tcGxldGVkIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDA7XG4gIGxlZnQ6IDA7XG4gIHdpZHRoOiAxMDAlO1xufVxuXG4uZXZlbnRzIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xufVxuXG4uZXZlbnRfaXRlbXtcbiAgICBib3JkZXItYm90dG9tOiAycHggc29saWQgdmFyKC0tYmFja2dyb3VuZC1wcmltYXJ5KTtcbiAgICBtYXJnaW46IDA7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIHBhZGRpbmc6IDVweCAxMHB4IDEwcHggMDtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xufVxuXG4uZXZlbnRfaXRlbS5zaG9ydCB7XG4gIHBhZGRpbmc6IDA7XG59XG5cbi5ldmVudF9pdGVtLnBhc3Qge1xufVxuXG4uZXZlbnRfaXRlbTpob3ZlcntcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1pbnRlcmFjdGl2ZS1hY2NlbnQtaG92ZXIpO1xuICAgIGJveC1zaGFkb3c6IDBweCAwcHggNTJweCAtMThweCByZ2JhKDAsIDAsIDAsIDAuNzUpO1xufVxuXG4uZXZlbnRfaXRlbV9jb2xvcjEge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1za29iZWxvZmYpO1xufVxuXG4uZXZlbnRfaXRlbV9jb2xvcjIge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1taWRuaWdodC1ncmVlbi1lYWdsZS1ncmVlbik7XG59XG5cbi5ldmVudF9pdGVtX2NvbG9yMyB7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLW1pZG5pZ2h0LWdyZWVuLWVhZ2xlLWdyZWVuLTIpO1xufVxuXG4uZXZlbnRfaXRlbV9jb2xvcjQge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1taWRuaWdodC1ncmVlbi1lYWdsZS1ncmVlbi0zKTtcbn1cblxuLmV2ZW50X2l0ZW1fY29sb3I1IHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY2hhcmNvYWwpO1xufVxuXG4uZXZlbnRfaXRlbV9jb2xvcjYge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1wcnVzc2lhbi1ibHVlKTtcbn1cblxuLmV2ZW50X2l0ZW1fY29sb3I3IHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc3BhY2UtY2FkZXQpO1xufVxuXG4uZXZlbnRfaXRlbV9jb2xvcjgge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1kYXJrLXB1cnBsZSk7XG59XG5cbi5ldmVudF9pdGVtX2NvbG9yOSB7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXJ1c3NpYW4tdmlvbGV0KTtcbn1cblxuLmV2ZW50X2l0ZW1fY29sb3IxMCB7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXJ1c3NpYW4tdmlvbGV0LTIpO1xufVxuXG4uZXZlbnRfaXRlbV9jb250ZW50cyB7XG4gIHBhZGRpbmctbGVmdDogNThweDtcbn1cblxuLmVpX0NvcHksLmVpX1RpdGxle1xuICAgIGNvbG9yOnZhcigtLXRleHQtb24tYWNjZW50KTtcbn1cblxuLmVpX0RvdCwuZWlfVGl0bGV7XG4gIGRpc3BsYXk6aW5saW5lLWJsb2NrO1xufVxuXG4uZWlfRG90e1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGJvcmRlci1yYWRpdXM6NTAlO1xuICB3aWR0aDoxNHB4O1xuICBoZWlnaHQ6IDE0cHg7XG4gIG1hcmdpbi10b3A6IDVweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tdGV4dC1hY2NlbnQpO1xuICBib3gtc2hhZG93OiAwcHggMHB4IDUycHggLTE4cHggcmdiYSgwLCAwLCAwLCAwLjc1KTtcbiAgei1pbmRleDogMjtcbn1cblxuLmRvdF9hY3RpdmV7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXRleHQtZXJyb3ItaG92ZXIpO1xufVxuXG4uZWlfVGl0bGV7XG4gIG1hcmdpbi1sZWZ0OiAyNnB4O1xufVxuXG4uZWlfQ29weXtcbiAgZm9udC1zaXplOiAxNXB4O1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIG1hcmdpbi1sZWZ0OiAyOHB4O1xufVxuXG4uaGVhZGVyX3RpdGxlLC5laV9UaXRsZSwuY2VfdGl0bGV7XG5jb2xvcjojZmZmO1xufVxuXG4jbm93LWxpbmUge1xuICAgIGhlaWdodDogNHB4O1xuICAgIGJhY2tncm91bmQtY29sb3I6IGRhcmtyZWQ7XG4gICAgb3BhY2l0eTogODAlO1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB6LWluZGV4OiAzO1xuICAgIHdpZHRoOiAxMDAlO1xufVxuXG4jbm93LWxpbmUgLnRpbWVsaW5lLXRpbWUge1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICBsZWZ0OiA1cHg7XG4gICAgdG9wOiAwO1xuICAgIGJhY2tncm91bmQtY29sb3I6IGRhcmtyZWQ7XG4gICAgY29sb3I6ICNmZmY7XG4gICAgcGFkZGluZzogMCA0cHggMnB4IDRweDtcbiAgICBib3JkZXItcmFkaXVzOiAwIDAgNHB4IDRweDtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG59XG5cbiNzY3JvbGwtY29udHJvbHMge1xuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJhY2tncm91bmQtc2Vjb25kYXJ5KTtcbiAgICBwb3NpdGlvbjogZml4ZWQ7XG4gICAgYm90dG9tOiAwO1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIHotaW5kZXg6IDQ7XG4gICAgcGFkZGluZzogOHB4IDE1cHg7XG4gICAgbGVmdDogMDtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG59XG5cbiNzY3JvbGwtY29udHJvbHMgbGFiZWwge1xuICBkaXNwbGF5OiBibG9jaztcbiAgZmxvYXQ6IGxlZnQ7XG4gIG1hcmdpbjogMnB4IDEwcHg7XG59XG5cbiNzY3JvbGwtY29udHJvbHMgLnRvZ2dsZSB7XG4gIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcbiAgLW1vei1hcHBlYXJhbmNlOiBub25lO1xuICBhcHBlYXJhbmNlOiBub25lO1xuICB3aWR0aDogNTBweDtcbiAgaGVpZ2h0OiAyMHB4O1xuICBkaXNwbGF5OiBibG9jaztcbiAgZmxvYXQ6IGxlZnQ7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgbWFyZ2luLXRvcDogNXB4O1xuICBib3JkZXItcmFkaXVzOiA1MHB4O1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICBvdXRsaW5lOiBub25lO1xuICBib3JkZXI6IG5vbmU7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYmFja2dyb3VuZC1zZWNvbmRhcnktYWx0KTtcbiAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciBlYXNlIDAuM3M7XG59XG5cbiNzY3JvbGwtY29udHJvbHMgLnRvZ2dsZTpiZWZvcmUge1xuICBjb250ZW50OiBcIm9uIG9mZlwiO1xuICBkaXNwbGF5OiBibG9jaztcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB6LWluZGV4OiAyO1xuICB3aWR0aDogMTdweDtcbiAgaGVpZ2h0OiAxN3B4O1xuICBiYWNrZ3JvdW5kOiAjZmZmO1xuICBsZWZ0OiAycHg7XG4gIHRvcDogMXB4O1xuICBib3JkZXItcmFkaXVzOiA1MCU7XG4gIGZvbnQ6IDlweC8xOHB4IEhlbHZldGljYTtcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIHRleHQtaW5kZW50OiAtMjBweDtcbiAgd29yZC1zcGFjaW5nOiAzMHB4O1xuICBjb2xvcjogI2ZmZjtcbiAgdGV4dC1zaGFkb3c6IC0xcHggLTFweCByZ2JhKDAsMCwwLDAuMTUpO1xuICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICBib3gtc2hhZG93OiAwIDFweCAycHggcmdiYSgwLDAsMCwwLjIpO1xuICB0cmFuc2l0aW9uOiBhbGwgY3ViaWMtYmV6aWVyKDAuMywgMS41LCAwLjcsIDEpIDAuM3M7XG59XG5cbiNzY3JvbGwtY29udHJvbHMgLnRvZ2dsZTpjaGVja2VkIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0taW50ZXJhY3RpdmUtYWNjZW50KTtcbn1cblxuI3Njcm9sbC1jb250cm9scyAudG9nZ2xlOmNoZWNrZWQ6YmVmb3JlIHtcbiAgbGVmdDogMzFweDtcbn1cblxuLmVtcHR5LXRpbWVsaW5lIHtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuICBtYXJnaW4tdG9wOiA1MCU7XG59XG5cbjwvc3R5bGU+XG5cbnsjaWYgc3VtbWFyeS52YWxpZEl0ZW1zKCkubGVuZ3RoID4gMH1cbiAgPGRpdiBpZD1cImRheS1wbGFubmVyLXRpbWVsaW5lLWNvbnRhaW5lclwiIHN0eWxlPVwiaGVpZ2h0OnsxNDQwKnRpbWVsaW5lWm9vbUxldmVsfXB4O1wiPlxuICAgICAgPGRpdiBjbGFzcz1cImFzaWRlIGFzaWRlLXh7dGltZWxpbmVab29tTGV2ZWx9IGZpbGxlZFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJhc2lkZV9fbGluZSBmaWxsZWRfX2xpbmVcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZpbGxlZF9fbGluZV9fY29tcGxldGVkXCIgc3R5bGU9XCJoZWlnaHQ6IHtub3dQb3NpdGlvbn1weDtcIj48L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgICBcbiAgICAgIDxkaXYgY2xhc3M9XCJldmVudHNcIiBzdHlsZT0ndG9wOiB7b2Zmc2V0KHN1bW1hcnkudmFsaWRJdGVtcygpLmZpcnN0KCkpfXB4Jz5cbiAgICAgICAgeyNlYWNoIHN1bW1hcnkudmFsaWRJdGVtcygpIGFzIGl0ZW0sIGl9XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZXZlbnRfaXRlbSBldmVudF9pdGVtX2NvbG9ye2klMTArMX0ge3Nob3J0Q2xhc3MoaXRlbSl9IHtwYXN0Q2xhc3MoaXRlbSl9XCIgc3R5bGU9XCJoZWlnaHQ6IHtpdGVtLmR1cmF0aW9uTWlucyp0aW1lbGluZVpvb21MZXZlbH1weDtcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImV2ZW50X2l0ZW1fY29udGVudHNcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZWlfRG90IHtpdGVtID09PSBzdW1tYXJ5LmN1cnJlbnQgPyAnZG90X2FjdGl2ZScgOiAnJ31cIj48L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZWlfVGl0bGVcIj57aXRlbS5yYXdUaW1lfTwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJlaV9Db3B5XCI+e2l0ZW0uZGlzcGxheVRleHQoKSA/PyAnJ308L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgey9lYWNofVxuICAgICAgPC9kaXY+XG5cbiAgICAgIDxkaXYgaWQ9XCJub3ctbGluZVwiIHN0eWxlPVwidG9wOntwb3NpdGlvbn1weFwiPlxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGltZWxpbmUtdGltZVwiPnttb21lbnQoY3VycmVudFRpbWUpLmZvcm1hdCgnSEg6bW0nKX08L3NwYW4+XG4gICAgICA8L2Rpdj5cbiAgICAgIFxuICAgICAgPGRpdiBpZD1cInNjcm9sbC1jb250cm9sc1wiPlxuICAgICAgICA8bGFiZWwgZm9yPVwiYXV0by1zY3JvbGxcIj5UcmFjayBjdXJyZW50IHRpbWU8L2xhYmVsPlxuICAgICAgICA8aW5wdXQgaWQ9XCJhdXRvLXNjcm9sbFwiIHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwidG9nZ2xlXCIgYmluZDpjaGVja2VkPXthdXRvU2Nyb2xsfT5cbiAgICAgIDwvZGl2PlxuICA8L2Rpdj5cbiAgezplbHNlfVxuICAgIDxkaXYgY2xhc3M9XCJlbXB0eS10aW1lbGluZVwiPlxuICAgICAgTm8gUGxhbm5lciBEYXRhXG4gICAgPC9kaXY+XG57L2lmfSIsImltcG9ydCB7IEl0ZW1WaWV3LCBXb3Jrc3BhY2VMZWFmIH0gZnJvbSAnb2JzaWRpYW4nO1xuaW1wb3J0IFRpbWVsaW5lIGZyb20gJy4vdGltZWxpbmUuc3ZlbHRlJztcbmltcG9ydCB7IHBsYW5TdW1tYXJ5LCBub3csIG5vd1Bvc2l0aW9uLCB6b29tTGV2ZWwgfSBmcm9tICcuL3RpbWVsaW5lLXN0b3JlJztcbmltcG9ydCB7IFZJRVdfVFlQRV9USU1FTElORSB9IGZyb20gJy4vY29uc3RhbnRzJztcbmltcG9ydCB0eXBlIHsgUGxhblN1bW1hcnlEYXRhIH0gZnJvbSAnLi9wbGFuLWRhdGEnO1xuaW1wb3J0IHR5cGUgeyBEYXlQbGFubmVyU2V0dGluZ3MgfSBmcm9tICcuL3NldHRpbmdzJztcbmNvbnN0IG1vbWVudCA9ICh3aW5kb3cgYXMgYW55KS5tb21lbnQ7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbWVsaW5lVmlldyBleHRlbmRzIEl0ZW1WaWV3IHtcbiAgICBwcml2YXRlIHRpbWVsaW5lOlRpbWVsaW5lO1xuICAgIHByaXZhdGUgc2V0dGluZ3M6IERheVBsYW5uZXJTZXR0aW5ncztcblxuICAgIGNvbnN0cnVjdG9yKGxlYWY6IFdvcmtzcGFjZUxlYWYsIHNldHRpbmdzOiBEYXlQbGFubmVyU2V0dGluZ3Mpe1xuICAgICAgICBzdXBlcihsZWFmKTtcbiAgICAgICAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzO1xuICAgIH1cblxuICAgIGdldFZpZXdUeXBlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBWSUVXX1RZUEVfVElNRUxJTkU7XG4gICAgfVxuXG4gICAgZ2V0RGlzcGxheVRleHQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICdEYXkgUGxhbm5lciBUaW1lbGluZSc7XG4gICAgfVxuXG4gICAgZ2V0SWNvbigpIHtcbiAgICAgICAgcmV0dXJuIFwiY2FsZW5kYXItd2l0aC1jaGVja21hcmtcIjtcbiAgICB9XG5cbiAgICB1cGRhdGUoc3VtbWFyeURhdGE6IFBsYW5TdW1tYXJ5RGF0YSkge1xuICAgICAgICBwbGFuU3VtbWFyeS51cGRhdGUobiA9PiBuID0gc3VtbWFyeURhdGEpO1xuICAgICAgICBjb25zdCBjdXJyZW50VGltZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgIG5vdy51cGRhdGUobiA9PiBuID0gY3VycmVudFRpbWUpO1xuICAgICAgICBjb25zdCBjdXJyZW50UG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uRnJvbVRpbWUoY3VycmVudFRpbWUpO1xuICAgICAgICBub3dQb3NpdGlvbi51cGRhdGUobiA9PiBuID0gY3VycmVudFBvc2l0aW9uKTtcbiAgICAgICAgem9vbUxldmVsLnVwZGF0ZShuID0+IG4gPSB0aGlzLnNldHRpbmdzLnRpbWVsaW5lWm9vbUxldmVsKTtcbiAgICB9XG5cbiAgICBwb3NpdGlvbkZyb21UaW1lKHRpbWU6IERhdGUpIHtcbiAgICAgICAgcmV0dXJuIG1vbWVudC5kdXJhdGlvbihtb21lbnQodGltZSkuZm9ybWF0KCdISDptbScpKS5hc01pbnV0ZXMoKSp0aGlzLnNldHRpbmdzLnRpbWVsaW5lWm9vbUxldmVsO1xuICAgIH1cblxuICAgIGFzeW5jIG9uT3BlbigpIHtcbiAgICAgICAgY29uc3Qge1xuICAgICAgICAgIHdvcmtzcGFjZTogeyBhY3RpdmVMZWFmIH0sXG4gICAgICAgIH0gPSB0aGlzLmFwcDtcblxuICAgICAgICB0aGlzLnRpbWVsaW5lID0gbmV3IFRpbWVsaW5lKHtcbiAgICAgICAgICB0YXJnZXQ6ICh0aGlzIGFzIGFueSkuY29udGVudEVsLFxuICAgICAgICAgIHByb3BzOiB7XG4gICAgICAgICAgICBwbGFuU3VtbWFyeTogcGxhblN1bW1hcnksXG4gICAgICAgICAgICByb290RWw6IHRoaXMuY29udGFpbmVyRWwuY2hpbGRyZW5bMV1cbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH1cblxufVxuIiwiaW1wb3J0IHtcclxuICBQbHVnaW4sXHJcbiAgVmF1bHQsXHJcbiAgV29ya3NwYWNlTGVhZiwgXHJcbn0gZnJvbSAnb2JzaWRpYW4nO1xyXG5pbXBvcnQgdHlwZSB7IEVkaXRvciB9IGZyb20gJ2NvZGVtaXJyb3InO1xyXG5pbXBvcnQgeyBEYXlQbGFubmVyU2V0dGluZ3NUYWIgfSBmcm9tICcuL3NldHRpbmdzLXRhYic7XHJcbmltcG9ydCB7IERheVBsYW5uZXJTZXR0aW5ncywgRGF5UGxhbm5lck1vZGUsIE5vdGVGb3JEYXRlLCBOb3RlRm9yRGF0ZVF1ZXJ5IH0gZnJvbSAnLi9zZXR0aW5ncyc7XHJcbmltcG9ydCBTdGF0dXNCYXIgZnJvbSAnLi9zdGF0dXMtYmFyJztcclxuaW1wb3J0IFByb2dyZXNzIGZyb20gJy4vcHJvZ3Jlc3MnO1xyXG5pbXBvcnQgUGxhbm5lck1hcmtkb3duIGZyb20gJy4vcGxhbm5lci1tZCc7XHJcbmltcG9ydCBEYXlQbGFubmVyRmlsZSBmcm9tICcuL2ZpbGUnO1xyXG5pbXBvcnQgUGFyc2VyIGZyb20gJy4vcGFyc2VyJztcclxuaW1wb3J0IHsgVklFV19UWVBFX1RJTUVMSU5FIH0gZnJvbSAnLi9jb25zdGFudHMnO1xyXG5pbXBvcnQgVGltZWxpbmVWaWV3IGZyb20gJy4vdGltZWxpbmUtdmlldyc7XHJcbmltcG9ydCB7IFBsYW5TdW1tYXJ5RGF0YSB9IGZyb20gJy4vcGxhbi1kYXRhJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERheVBsYW5uZXIgZXh0ZW5kcyBQbHVnaW4ge1xyXG4gIHNldHRpbmdzOiBEYXlQbGFubmVyU2V0dGluZ3M7XHJcbiAgdmF1bHQ6IFZhdWx0O1xyXG4gIGZpbGU6IERheVBsYW5uZXJGaWxlO1xyXG4gIHBsYW5uZXJNRDogUGxhbm5lck1hcmtkb3duO1xyXG4gIHN0YXR1c0JhcjogU3RhdHVzQmFyOyBcclxuICBub3Rlc0ZvckRhdGVzUXVlcnk6IE5vdGVGb3JEYXRlUXVlcnk7XHJcbiAgdGltZWxpbmVWaWV3OiBUaW1lbGluZVZpZXc7XHJcbiAgXHJcbiAgYXN5bmMgb25sb2FkKCkge1xyXG4gICAgY29uc29sZS5sb2coXCJMb2FkaW5nIERheSBQbGFubmVyIHBsdWdpblwiKTtcclxuICAgIHRoaXMudmF1bHQgPSB0aGlzLmFwcC52YXVsdDtcclxuICAgIHRoaXMuc2V0dGluZ3MgPSAoYXdhaXQgdGhpcy5sb2FkRGF0YSgpKSB8fCBuZXcgRGF5UGxhbm5lclNldHRpbmdzKCk7XHJcbiAgICB0aGlzLm5vdGVzRm9yRGF0ZXNRdWVyeSA9IG5ldyBOb3RlRm9yRGF0ZVF1ZXJ5KCk7XHJcbiAgICB0aGlzLmZpbGUgPSBuZXcgRGF5UGxhbm5lckZpbGUodGhpcy52YXVsdCwgdGhpcy5zZXR0aW5ncyk7XHJcbiAgICBjb25zdCBwcm9ncmVzcyA9IG5ldyBQcm9ncmVzcygpO1xyXG4gICAgY29uc3QgcGFyc2VyID0gbmV3IFBhcnNlcih0aGlzLnZhdWx0KTtcclxuICAgIHRoaXMucGxhbm5lck1EID0gbmV3IFBsYW5uZXJNYXJrZG93bih0aGlzLmFwcC53b3Jrc3BhY2UsIHRoaXMuc2V0dGluZ3MsIHRoaXMuZmlsZSwgcGFyc2VyLCBwcm9ncmVzcylcclxuICAgIHRoaXMuc3RhdHVzQmFyID0gbmV3IFN0YXR1c0JhcihcclxuICAgICAgdGhpcy5zZXR0aW5ncyxcclxuICAgICAgdGhpcy5hZGRTdGF0dXNCYXJJdGVtKCksIFxyXG4gICAgICB0aGlzLmFwcC53b3Jrc3BhY2UsIFxyXG4gICAgICBwcm9ncmVzcyxcclxuICAgICAgbmV3IFBsYW5uZXJNYXJrZG93bih0aGlzLmFwcC53b3Jrc3BhY2UsIHRoaXMuc2V0dGluZ3MsIHRoaXMuZmlsZSwgcGFyc2VyLCBwcm9ncmVzcyksXHJcbiAgICAgIHRoaXMuZmlsZVxyXG4gICAgKTtcclxuXHJcbiAgICB0aGlzLnN0YXR1c0Jhci5pbml0U3RhdHVzQmFyKCk7XHJcbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAub24oXCJjb2RlbWlycm9yXCIsIHRoaXMuY29kZU1pcnJvcikpO1xyXG4gICAgXHJcbiAgICB0aGlzLmFkZENvbW1hbmQoe1xyXG4gICAgICBpZDogJ2FwcDphZGQtZGF5LXBsYW5uZXItdG8tbm90ZScsXHJcbiAgICAgIG5hbWU6ICdBZGQgYSBEYXkgUGxhbm5lciB0ZW1wbGF0ZSBmb3IgdG9kYXkgdG8gdGhlIGN1cnJlbnQgbm90ZScsXHJcbiAgICAgIGNhbGxiYWNrOiAoKSA9PiB0aGlzLm1vZGVHdWFyZChhc3luYyAoKSA9PiBhd2FpdCB0aGlzLmluc2VydERheVBsYW5uZXJJbnRvQ3VycmVudE5vdGUodHJ1ZSkpLFxyXG4gICAgICBob3RrZXlzOiBbXVxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5hZGRDb21tYW5kKHtcclxuICAgICAgaWQ6ICdhcHA6bGluay1kYXktcGxhbm5lci10by1ub3RlJyxcclxuICAgICAgbmFtZTogJ0xpbmsgdG9kYXlcXCdzIERheSBQbGFubmVyIHRvIHRoZSBjdXJyZW50IG5vdGUnLFxyXG4gICAgICBjYWxsYmFjazogKCkgPT4gdGhpcy5tb2RlR3VhcmQoYXN5bmMgKCkgPT4gYXdhaXQgdGhpcy5pbnNlcnREYXlQbGFubmVySW50b0N1cnJlbnROb3RlKGZhbHNlKSksXHJcbiAgICAgIGhvdGtleXM6IFtdXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmFkZENvbW1hbmQoe1xyXG4gICAgICBpZDogJ2FwcDp1bmxpbmstZGF5LXBsYW5uZXItZnJvbS1ub3RlJyxcclxuICAgICAgbmFtZTogJ1VubGluayB0b2RheVxcJ3MgRGF5IFBsYW5uZXIgZnJvbSBpdHMgbm90ZScsXHJcbiAgICAgIGNhbGxiYWNrOiAoKSA9PiB0aGlzLm1vZGVHdWFyZChhc3luYyAoKSA9PiBhd2FpdCB0aGlzLnVubGlua0RheVBsYW5uZXIoKSksXHJcbiAgICAgIGhvdGtleXM6IFtdXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmFkZENvbW1hbmQoe1xyXG4gICAgICBpZDogJ2FwcDpzaG93LWRheS1wbGFubmVyLXRpbWVsaW5lJyxcclxuICAgICAgbmFtZTogJ1Nob3cgdGhlIERheSBQbGFubmVyIFRpbWVsaW5lJyxcclxuICAgICAgY2FsbGJhY2s6ICgpID0+IHRoaXMuaW5pdExlYWYoKSxcclxuICAgICAgaG90a2V5czogW11cclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMucmVnaXN0ZXJWaWV3KFxyXG4gICAgICBWSUVXX1RZUEVfVElNRUxJTkUsXHJcbiAgICAgIChsZWFmOiBXb3Jrc3BhY2VMZWFmKSA9PlxyXG4gICAgICAgICh0aGlzLnRpbWVsaW5lVmlldyA9IG5ldyBUaW1lbGluZVZpZXcobGVhZiwgdGhpcy5zZXR0aW5ncykpXHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMuYWRkU2V0dGluZ1RhYihuZXcgRGF5UGxhbm5lclNldHRpbmdzVGFiKHRoaXMuYXBwLCB0aGlzKSk7XHJcbiAgICB0aGlzLnJlZ2lzdGVySW50ZXJ2YWwoXHJcbiAgICAgIHdpbmRvdy5zZXRJbnRlcnZhbChhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgdHJ5IHsgICAgICAgICAgICBcclxuICAgICAgICAgIGlmKHRoaXMuZmlsZS5oYXNUb2RheU5vdGUoKSl7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdBY3RpdmUgbm90ZSBmb3VuZCwgc3RhcnRpbmcgZmlsZSBwcm9jZXNzaW5nJylcclxuICAgICAgICAgICAgY29uc3QgcGxhblN1bW1hcnkgPSBhd2FpdCB0aGlzLnBsYW5uZXJNRC5wYXJzZURheVBsYW5uZXIoKTtcclxuICAgICAgICAgICAgcGxhblN1bW1hcnkuY2FsY3VsYXRlKCk7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuc3RhdHVzQmFyLnJlZnJlc2hTdGF0dXNCYXIocGxhblN1bW1hcnkpXHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGxhbm5lck1ELnVwZGF0ZURheVBsYW5uZXJNYXJrZG93bihwbGFuU3VtbWFyeSlcclxuICAgICAgICAgICAgdGhpcy50aW1lbGluZVZpZXcgJiYgdGhpcy50aW1lbGluZVZpZXcudXBkYXRlKHBsYW5TdW1tYXJ5KTtcclxuICAgICAgICAgIH0gZWxzZXtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ05vIGFjdGl2ZSBub3RlLCBza2lwcGluZyBmaWxlIHByb2Nlc3NpbmcnKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKVxyXG4gICAgICAgIH1cclxuICAgICAgfSwgMjAwMCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRMZWFmKCkge1xyXG4gICAgICBpZiAodGhpcy5hcHAud29ya3NwYWNlLmdldExlYXZlc09mVHlwZShWSUVXX1RZUEVfVElNRUxJTkUpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5hcHAud29ya3NwYWNlLmdldFJpZ2h0TGVhZih0cnVlKS5zZXRWaWV3U3RhdGUoe1xyXG4gICAgICAgIHR5cGU6IFZJRVdfVFlQRV9USU1FTElORSxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbW9kZUd1YXJkKGNvbW1hbmQ6ICgpID0+IGFueSk6IHZvaWQge1xyXG4gICAgICBpZih0aGlzLnNldHRpbmdzLm1vZGUgIT09IERheVBsYW5uZXJNb2RlLkNvbW1hbmQpIHtcclxuICAgICAgICBuZXcgTm90aWZpY2F0aW9uKCdEYXkgUGxhbm5lciBwbHVnaW4gaW4gRmlsZSBtb2RlJywge3NpbGVudDogdHJ1ZSwgYm9keTogJ1N3aXRjaCB0byBDb21tYW5kIG1vZGUgaW4gc2V0dGluZ3MgdG8gdXNlIHRoaXMgY29tbWFuZCd9KTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29tbWFuZCgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgaW5zZXJ0RGF5UGxhbm5lckludG9DdXJyZW50Tm90ZShpbnNlcnRUZW1wbGF0ZTogYm9vbGVhbil7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgaWYoIXRoaXMuc2V0dGluZ3Mubm90ZXNUb0RhdGVzKXtcclxuICAgICAgICAgIHRoaXMuc2V0dGluZ3Mubm90ZXNUb0RhdGVzID0gW107XHJcbiAgICAgICAgICB0aGlzLnNhdmVEYXRhKHRoaXMuc2V0dGluZ3MpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IHZpZXcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuYWN0aXZlTGVhZi52aWV3O1xyXG4gICAgICAgIGNvbnN0IGZpbGVQYXRoID0gdmlldy5nZXRTdGF0ZSgpLmZpbGU7XHJcbiAgICAgICAgY29uc3QgZGF5UGxhbm5lckV4aXN0cyA9IHRoaXMubm90ZXNGb3JEYXRlc1F1ZXJ5LmV4aXN0cyh0aGlzLnNldHRpbmdzLm5vdGVzVG9EYXRlcyk7XHJcbiAgICAgICAgY29uc3QgYWN0aXZlRGF5UGxhbm5lclBhdGggPSB0aGlzLm5vdGVzRm9yRGF0ZXNRdWVyeS5hY3RpdmUodGhpcy5zZXR0aW5ncy5ub3Rlc1RvRGF0ZXMpPy5ub3RlUGF0aDtcclxuICAgICAgICBcclxuICAgICAgICBpZihkYXlQbGFubmVyRXhpc3RzICYmIGFjdGl2ZURheVBsYW5uZXJQYXRoICE9PSBmaWxlUGF0aCl7XHJcbiAgICAgICAgICBuZXcgTm90aWZpY2F0aW9uKCdEYXkgUGxhbm5lciBleGlzdHMnLCB7c2lsZW50OiB0cnVlLCBib2R5OiBgQSBEYXkgUGxhbm5lciBmb3IgdG9kYXkgYWxyZWFkeSBleGlzdHMgaW4gJHthY3RpdmVEYXlQbGFubmVyUGF0aH1gfSk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCFkYXlQbGFubmVyRXhpc3RzKXtcclxuICAgICAgICAgIHRoaXMuc2V0dGluZ3Mubm90ZXNUb0RhdGVzLnB1c2gobmV3IE5vdGVGb3JEYXRlKGZpbGVQYXRoLCBuZXcgRGF0ZSgpLnRvRGF0ZVN0cmluZygpKSk7XHJcbiAgICAgICAgICBhd2FpdCB0aGlzLnNhdmVEYXRhKHRoaXMuc2V0dGluZ3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihpbnNlcnRUZW1wbGF0ZSkge1xyXG4gICAgICAgICAgdGhpcy5wbGFubmVyTUQuaW5zZXJ0UGxhbm5lcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIHVubGlua0RheVBsYW5uZXIoKSB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgYWN0aXZlUGxhbm5lciA9IHRoaXMubm90ZXNGb3JEYXRlc1F1ZXJ5LmFjdGl2ZSh0aGlzLnNldHRpbmdzLm5vdGVzVG9EYXRlcyk7XHJcbiAgICAgICAgdGhpcy5zZXR0aW5ncy5ub3Rlc1RvRGF0ZXMucmVtb3ZlKGFjdGl2ZVBsYW5uZXIpO1xyXG4gICAgICAgIGF3YWl0IHRoaXMuc2F2ZURhdGEodGhpcy5zZXR0aW5ncyk7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5sb2FkRGF0YSgpO1xyXG4gICAgICAgIHRoaXMuc3RhdHVzQmFyLmhpZGUodGhpcy5zdGF0dXNCYXIuc3RhdHVzQmFyKTtcclxuICAgICAgICB0aGlzLnRpbWVsaW5lVmlldyAmJiB0aGlzLnRpbWVsaW5lVmlldy51cGRhdGUobmV3IFBsYW5TdW1tYXJ5RGF0YShbXSkpO1xyXG4gICAgICAgIG5ldyBOb3RpZmljYXRpb24oJ0RheSBQbGFubmVyIHJlc2V0JywgXHJcbiAgICAgICAgICB7c2lsZW50OiB0cnVlLCBib2R5OiBgVGhlIERheSBQbGFubmVyIGZvciB0b2RheSBoYXMgYmVlbiBkaXNzb2NpYXRlZCBmcm9tICR7YWN0aXZlUGxhbm5lci5ub3RlUGF0aH0gYW5kIGNhbiBiZSBhZGRlZCB0byBhbm90aGVyIG5vdGVgfSk7XHJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgY29kZU1pcnJvciA9IChjbTogRWRpdG9yKSA9PiB7XHJcbiAgICAgIGNtLm9uKCdjaGFuZ2UnLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgaWYodGhpcy5maWxlLmhhc1RvZGF5Tm90ZSgpKSB7XHJcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZygnQWN0aXZlIG5vdGUgZm91bmQsIHN0YXJ0aW5nIENvZGVNaXJyb3IgbW9uaXRvcmluZycpXHJcbiAgICAgICAgICB0aGlzLnBsYW5uZXJNRC5jaGVja0lzRGF5UGxhbm5lckVkaXRpbmcoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgLy8gY29uc29sZS5sb2coJ05vIGFjdGl2ZSBub3RlLCBza2lwcGluZyBDb2RlTWlycm9yIG1vbml0b3JpbmcnKVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIG9udW5sb2FkKCkge1xyXG4gICAgICBjb25zb2xlLmxvZyhcIlVubG9hZGluZyBEYXkgUGxhbm5lciBwbHVnaW5cIik7XHJcbiAgICAgIHRoaXMuYXBwLndvcmtzcGFjZVxyXG4gICAgICAuZ2V0TGVhdmVzT2ZUeXBlKFZJRVdfVFlQRV9USU1FTElORSlcclxuICAgICAgLmZvckVhY2goKGxlYWYpID0+IGxlYWYuZGV0YWNoKCkpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgfSJdLCJuYW1lcyI6WyJ0aGlzIiwicmVxdWlyZSIsIlBsdWdpblNldHRpbmdUYWIiLCJTZXR0aW5nIiwibW9tZW50IiwiSXRlbVZpZXciLCJQbHVnaW4iXSwibWFwcGluZ3MiOiI7Ozs7TUFBYSxrQkFBa0I7SUFBL0I7UUFDRSxpQkFBWSxHQUFXLGNBQWMsQ0FBQztRQUN0QyxTQUFJLEdBQW1CLGNBQWMsQ0FBQyxJQUFJLENBQUM7UUFDM0MsWUFBTyxHQUFZLEtBQUssQ0FBQztRQUN6QixpQkFBWSxHQUFrQixFQUFFLENBQUM7UUFDakMsc0JBQWlCLEdBQVksSUFBSSxDQUFDO1FBQ2xDLHFCQUFnQixHQUFZLEtBQUssQ0FBQztRQUNsQywwQkFBcUIsR0FBWSxLQUFLLENBQUM7UUFDdkMseUJBQW9CLEdBQVksS0FBSyxDQUFBO1FBQ3JDLHNCQUFpQixHQUFXLENBQUMsQ0FBQztLQUMvQjtDQUFBO01BRVksV0FBVztJQUl0QixZQUFZLFFBQWdCLEVBQUUsSUFBVztRQUN2QyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztLQUNs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QUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFlBQVk7QUFDbEQsUUFBUSxPQUFPLElBQUksQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDdkMsS0FBSyxDQUFDLENBQUM7QUFDUCxJQUFJLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFlBQVk7QUFDbkQsUUFBUSxPQUFPLElBQUksQ0FBQyxXQUFXLEVBQUUsR0FBRyxHQUFHLENBQUM7QUFDeEMsS0FBSyxDQUFDLENBQUM7QUFDUCxJQUFJLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFlBQVk7QUFDcEQsUUFBUSxPQUFPLElBQUksQ0FBQyxXQUFXLEVBQUUsR0FBRyxJQUFJLENBQUM7QUFDekMsS0FBSyxDQUFDLENBQUM7QUFDUCxJQUFJLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFlBQVk7QUFDckQsUUFBUSxPQUFPLElBQUksQ0FBQyxXQUFXLEVBQUUsR0FBRyxLQUFLLENBQUM7QUFDMUMsS0FBSyxDQUFDLENBQUM7QUFDUCxJQUFJLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFlBQVk7QUFDdEQsUUFBUSxPQUFPLElBQUksQ0FBQyxXQUFXLEVBQUUsR0FBRyxNQUFNLENBQUM7QUFDM0MsS0FBSyxDQUFDLENBQUM7QUFDUCxJQUFJLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFlBQVk7QUFDdkQsUUFBUSxPQUFPLElBQUksQ0FBQyxXQUFXLEVBQUUsR0FBRyxPQUFPLENBQUM7QUFDNUMsS0FBSyxDQUFDLENBQUM7QUFDUDtBQUNBO0FBQ0E7QUFDQSxJQUFJLFlBQVksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUM7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
