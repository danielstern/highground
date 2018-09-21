export const delay = (duration)=>{
    return new Promise(resolve=>setTimeout(resolve,duration));
};

export function* iterateTree(treeLevel) {
    yield treeLevel;
    for (let suite of treeLevel.suites) {
        yield* iterateTree(suite.children);
    }
}

export function extractSuites(...suites){
    for (let suite of suites) {
        suites = [...suites, ...extractSuites(...suite.children.suites)];
    }
    return suites;
}
export function* iterateSuites(suites) {
    for (let suite of suites) {
        yield suite;
        yield* iterateSuites(suite.children.suites);
    }
}

export function getAllChildTests(suite){
    let tests = [];
    for (let treeLevel of iterateTree(suite.children)) {
        tests = [...tests,...treeLevel.tests];
    }
    return tests;
}