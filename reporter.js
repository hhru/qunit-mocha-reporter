/**
 * Mocha (JSON) reporter for QUnit
 *
 * https://github.com/xnimorz/qunit-mocha-reporter
 *
 */
/* global QUnit, define, module, exports */
(function() {
    'use strict';

    var tests;
    var currentTest;
    var callback;

    QUnit.begin(function() {
        tests = {
            stats: {
                suites: 0,
                tests: 0,
                passes: 0,
                pending: 0,
                failures: 0,
                duration: 0,
                start: new Date(),
                end: 0
            },
            failures: [],
            passes: [],
            skipped: []
        };
    });

    QUnit.testStart(function(data) {
        currentTest = {
            title: data.name,
            fullTitle: (data.module ? '[' + data.module + ']: ' : '')+ data.name,
            duration: 0,
            startTime: new Date()
        };
    });

    QUnit.log(function(data) {
        if (data.result) {
            tests.passes.push(currentTest);
        } else {
            currentTest.error = data.source;
            tests.failures.push(currentTest);
        }
    });

    QUnit.testDone(function() {
        currentTest.duration = (new Date()).getTime() - currentTest.startTime.getTime();

        currentTest = null;
    });

    QUnit.done(function(data) {
        tests.stats.end = new Date();
        tests.stats.duration = data.runtime || (tests.stats.end.getTime() - tests.stats.start.getTime());
        tests.stats.suites = data.total;
        tests.stats.tests = data.total;
        tests.stats.passes = data.passed;
        tests.stats.failures = data.failed;

        callback(tests);
    });

    function defineCallback(testsDoneCallback) {
        callback = testsDoneCallback;
    }

    (function(defineCallback) {
        if (typeof exports === 'object') {
            // CommonJS
            // CommonJS должен стоять первым, чтобы инициализация по возможности - была синхронной
            module.exports = defineCallback;
        } else if (typeof define === 'function' && define.amd) {
            // AMD.
            define(defineCallback);
        } else {
            // Global scope
            window.qUnitDefineCallback = defineCallback;
        }
    })(defineCallback);

})();
