import { delay } from './utility'
import uuid from 'uuid';
import { iterateTree, iterateSuites, extractSuites } from './utility'
import { HTMLReporter } from './../reporters/HTMLReporter'
import { ConsoleReporter } from './../reporters/ConsoleReporter'
import { Status } from './constants'

export class TestManager {
    reporters = [ (typeof(window) === 'undefined') ? new ConsoleReporter() : new HTMLReporter() ];
    describeQueue = [];
    calledHookRecord = {};
    tree = {suites:[],tests:[]};
    describing = {children:this.tree,priority:0,before:[], after:[],depth: 0};
    tests = {};
    maxPriority = 0;

    constructor(init = true){
        if (init) this.take();
    }

    async take () {
        await delay();
        await this.exhaustDescribeQueue();
        for (let treeLevel of iterateTree(this.tree)) {
            for (let id of treeLevel.tests) {
                await this.runTest(id);
            }
        }
    }

    async describe (name,unfold,priority = 0){
        let describing = this.describing;
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
        this.describeQueue.push(suite);
    }

    async it (name,fn,localPriority = 0){
        let describing = this.describing;
        let priority = localPriority + describing.priority;
        this.maxPriority = Math.max(priority,this.maxPriority);
        const test = {
            name,
            fn,
            id:uuid(),
            before:[...describing.before],
            priority,
            error:null,
            after:[...describing.after],
            status: (priority >= this.maxPriority) && fn ? Status.PENDING : Status.SKIPPED
        };

        describing.children.tests.push(test.id);
        this.tests[test.id] = test;
    }


    async exhaustDescribeQueue(){
        while (this.describeQueue.length > 0) {
            let suite = this.describeQueue.shift();
            this.describing = suite;
            if (suite.unfold) {
                await suite.unfold();
            }
            this.describing = null;
        }
    }

    async updateReporters(){
        // TODO - iterateSuites puts the suites in the right order, but extractSuites has simpler structure
        let suites = Array.from(iterateSuites(this.tree.suites));
        // let suites = extractSuites(...this.tree.suites);
        this.reporters.forEach(reporter=>reporter.update(suites,this.tests ));
    }



    async runTest(id) {
        const test = this.tests[id];
        if (test.status === Status.PENDING) {
            test.status = Status.RUNNING;
            await this.updateReporters();
            await this.callHooks(test.before);
            try {
                await test.fn();
                test.status = Status.PASSED;
            } catch (e) {
                test.error = e;
                test.status = Status.FAILED;
            }
            await this.callHooks(test.after);
        } else {
            test.status = Status.SKIPPED;
        }

        await this.updateReporters();
        return test;
    }

    async callHooks(hooks){
        for (let hook of hooks) {
            if (!hook.once || !this.calledHookRecord[hook.id]) {
                this.calledHookRecord[hook.id] = true;
                await hook.fn();
            }
        }
    }

    async fdescribe(name,unfold){
        await this.describe(name,unfold,2);
    }

    async xdescribe(name,unfold){
        await this.describe(name,unfold,-2);
    }

    async fit (name,test){
        await this.it(name,test,2);
    }

    async xit (name,test){
        await this.it(name,test,-2);
    }


    beforeAll (fn, once = true){
        this.describing.before.push({fn,once,id:uuid()});
    }

    beforeEach (fn){
        this.beforeAll(fn, false);
    }

    afterAll(fn, once=true) {
        this.describing.after.push({fn,once,id:uuid()});
    }

    afterEach (fn) {
        this.afterAll(fn,false);
    }
}

