
export { fdescribe, xdescribe, fit, xit } from './helpers'
export { expect } from 'chai';
export { delay } from './utility';

import uuid from 'uuid';
import { delay } from './utility';
import { iterateTree } from './utility'
import { HTMLReporter } from './reporters/HTMLReporter'
import { Status } from './constants'



//todo... classify
let describeQueue = [];
let tree = {suites:[],tests:[]};
let describing = {children:tree,priority:0,before:[], after:[],depth: 0};
let calledHookRecord = {};
let maxPriority = 0;
let totalTestCount = 0;
let tests = {};

let reporters = [
    new HTMLReporter(),
];

export async function describe (name,unfold,priority = 0){
    let suite = {
        name,
        id:uuid(),
        unfold,
        priority: priority + describing.priority,
        children:{suites:[],tests:[]},
        before:[...describing.before],
        after:[...describing.after],
        depth: describing.depth + 1
    };

    describing.children.suites.push(suite);
    describeQueue.push(suite);
}

function updateReporters(){
    reporters.forEach(reporter=>reporter.update(tree,tests));
}

export async function it (name,fn,localPriority = 0){
    let priority = localPriority + describing.priority;
    maxPriority = Math.max(priority,maxPriority);
    const test = {
        name,
        fn,
        id:uuid(),
        before:[...describing.before],
        priority,
        error:null,
        after:[...describing.after],
        status: (priority >= maxPriority) && fn ? Status.PENDING : Status.SKIPPED
    };

    describing.children.tests.push(test.id);
    tests[test.id] = test;
}

export function beforeAll (fn, once = true){
    describing.before.push({fn,once,id:uuid()});
}

export function beforeEach (fn){
    beforeAll(fn, false);
}

export function afterAll(fn, once=true) {
    describing.after.push({fn,once,id:uuid()});
}
export function afterEach (fn) {
    afterAll(fn,false);
}

async function exhaustDescribeQueue(){
    while (describeQueue.length > 0) {
        let suite = describeQueue.shift();
        describing = suite;
        if (suite.unfold) {
            await suite.unfold();
        }
        describing = null;
    }
}

async function callHooks(hooks){
    for (let hook of hooks) {
        if (!hook.once || !calledHookRecord[hook.id]) {
            calledHookRecord[hook.id] = true;
            await hook.fn();
        }
    }
}

async function runTest(id) {
    const test = tests[id]; // easy

    // console.log("Pre test",id,test,maxPriority,test.priority);

    if (test.status === Status.PENDING && test.priority >= maxPriority) {
        test.status = Status.RUNNING;
        updateReporters();
    // if ((test.priority >= maxPriority) && test.fn) {
    //     console.log("Running test...",test);
        await callHooks(test.before);
        try {
            await test.fn();
            test.status = Status.PASSED;
        } catch (e) {
            test.error = e;
            test.status = Status.FAILED;
        }
        await callHooks(test.after);
    } else {
        test.status = Status.SKIPPED;

    }

    updateReporters();
    return test;
}

export async function take (){
    await delay();
    await exhaustDescribeQueue();
    for (let treeLevel of iterateTree(tree)) {
        for (let id of treeLevel.tests) {
            await runTest(id);
        }
    }
}

take();