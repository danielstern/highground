import { iterateTree, iterateSuites } from '../src/utility'
import { Status } from '../src/constants';

import uuid from 'uuid';
import './main.css';

export class HTMLReporter {

    StatusToIcon(status){
        switch (status){
            case Status.PASSED:
                return `✓`;
            case Status.PENDING:
                return `…`;
            case Status.SKIPPED:
                return `(SKIPPED)`;
            case Status.FAILED:
                return `✘`;
            case Status.RUNNING:
                return `→`;
        }
        return status;
    }

    Indent(suite,isTest){
        return `style="margin-left:${suite.depth + (isTest ? 1 : 0)}em"`;
    }

    GetTestBullet(test){
        return (test.status == Status.SKIPPED ? `▹` : `▸`);
    }
    GetSummaryClass(passedTests,failedTests,allTests){
        if (failedTests.length > 0) return 'red';
        if (passedTests.length == allTests.length) return 'green';
        return 'yellow';
    }

    GetSuiteSummary(suite,tests){
        if (suite.children.tests.find(id=>tests[id].status === Status.FAILED)) return Status.FAILED;
        if (suite.children.tests.find(id=>tests[id].status === Status.PENDING)) return Status.PENDING;
        return Status.PASSED;
    }

    GetAllChildTests(suite){
        // let tests = [...suite.tests];
        let tests = [];
        for (let treeLevel of iterateTree(suite.children)) {
            // console.log("Iterating...",treeLevel);
            tests = [...tests,...treeLevel.tests];
        }
        return tests;
    }

    GatherUnskippedSuites(tree, tests) {
        let suites = [];
        let skipped = [];
        let testsInTree = [];

        for (let suite of iterateSuites(tree.suites)) {
            let childTests = this.GetAllChildTests(suite);
            let suiteTestsStatuses = childTests.map(testID=>tests[testID].status);
            (suiteTestsStatuses.find(status=>status !== Status.SKIPPED) ? suites : skipped).push(suite);
        }
        return [suites,skipped];
    }

    update(tree,tests) {
        if (!this.target) {
            document.body.innerHTML += `<div id="HighgroundHTMLReporterTarget"/>`;
            this.target = document.getElementById("HighgroundHTMLReporterTarget");
        }
        const passedTests = Object.values(tests).filter(t => t.status == Status.PASSED || t.status == Status.SKIPPED);
        const failedTests = Object.values(tests).filter(t => t.status == Status.FAILED);
        const allTests = Object.values(tests);

        let [suites, skipped] = this.GatherUnskippedSuites(tree, tests);
        this.target.innerHTML = '';
        this.target.innerHTML += `<div class='${this.GetSummaryClass(passedTests, failedTests, allTests)}'>${passedTests.length}/${allTests.length}</div>`;
        if (skipped.length > 0) {
            this.target.innerHTML += `<p>${skipped.length} Skipped Suites Hidden</p>`
        };
        // for (let suite of (skipped.length <= 5) ? [...skipped,...suites] : suites) {
        for (let suite of suites) {
            this.target.innerHTML += `<div ${this.Indent(suite)}>• ${suite.name} ${this.StatusToIcon(this.GetSuiteSummary(suite, tests))}</div>`;
            for (let id of suite.children.tests) {

                const test = tests[id];
                this.target.innerHTML += `
                <div
                    ${this.Indent(suite, 1)}>
                    ${this.GetTestBullet(test)}
                    ${test.name}
                    ${this.StatusToIcon(test.status)}
                </div>`;
                if (test.error) {
                    this.target.innerHTML += `<p class="red" ${this.Indent(suite, 1)}>${test.error} <code>${test.error.stack}</code>$</p>`
                }
            }
        }
    }
}