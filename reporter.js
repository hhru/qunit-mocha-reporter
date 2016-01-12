/**
 * Mocha (JSON) reporter for QUnit
 *
 * https://github.com/xnimorz/qunit-mocha-reporter
 *
 */
/* global QUnit */
(function() {
    'use strict';

    var tests, currentTest;

    QUnit.jsonReporter = function(){};

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
            fullTitle: '[' + data.module + ']: ' + data.name,
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

        QUnit.jsonReporter(tests);
    });

})();
