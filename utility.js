import { max } from 'lodash';

export const delay = (duration)=>{
    return new Promise(resolve=>setTimeout(resolve,duration));
};

// No longer needed?
export function* iterateTree(treeLevel) {
    yield treeLevel;
    for (let suite of treeLevel.suites) {
        yield* iterateTree(suite.children);
    }
}

export function* iterateSuites(suites) {
    for (let suite of suites) {
        yield suite;
        yield* iterateSuites(suite.children.suites);
    }
}