import { Status } from '../../src/constants';
import React from 'react';
import ReactDOM from 'react-dom';
import './main.css';
import { GetSuiteSummary, Indent, GetTestBullet, GetSuiteTestDetails, StatusToIcon, CountTests } from './utility'

export class ReactReporter {
    constructor(){
        // todo... gotta be a better way
        let target = document.getElementById("HighgroundReactReporterTarget");
        if (target) {
            this.target = target;
        } else {
            document.body.innerHTML += `<div id="HighgroundReactReporterTarget"/>`;
            this.target = document.getElementById("HighgroundReactReporterTarget");
        }
    }
    update(suites,tests) {
        const {passedTests, failedTests, allTests} = CountTests(tests);
        ReactDOM.render(
            <div>
                <div>
                    <div className={failedTests > 0 ? `red` : `white`}>
                    { passedTests } / { allTests }
                    </div>
                    {suites.map(suite => (
                        <div key={suite.id} style={Indent(suite)}>
                            {suite.name} {StatusToIcon(GetSuiteSummary(suite, tests))}
                            {GetSuiteTestDetails(suite, tests).map(test => (
                                <div key={test.id} style={Indent(suite)} className={test.error ? `red` : `white`}>
                                    {GetTestBullet(test)} {test.name} {StatusToIcon(test.status)}
                                    {test.error ? <pre className="red">{test.error.stack}</pre> : null}
                                </div>
                            ))}
                        </div>))}
                </div>
            </div>,
            this.target
        );
    }
}