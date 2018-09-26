import { Status } from '../../src/constants'
export function StatusToIcon(status){
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

export function Indent(suite,isTest){
    return {marginLeft:`${suite.depth + (isTest ? 1 : 0)}em`};
}

export function GetTestBullet(test){
    return (test.status == Status.SKIPPED ? `▹` : `▸`);
}

export function GetSuiteTestDetails(suite,tests){
    return suite.children.tests.map(id=>tests[id]);
}
export function GetSummaryClass(passedTests,failedTests,allTests){
    if (failedTests.length > 0) return 'red';
    if (passedTests.length == allTests.length) return 'green';
    return 'yellow';
}

export function GetSuiteSummary(suite,tests){
    if (suite.children.tests.find(id=>tests[id].status === Status.FAILED)) return Status.FAILED;
    if (suite.children.tests.find(id=>tests[id].status === Status.PENDING)) return Status.PENDING;
    return Status.PASSED;
}

export function CountTests(tests){
    const passedTests = Object.values(tests).filter(t => t.status == Status.PASSED || t.status == Status.SKIPPED).length;
    const failedTests = Object.values(tests).filter(t => t.status == Status.FAILED).length;
    const allTests = Object.values(tests).length;
    return {passedTests,failedTests, allTests}

}