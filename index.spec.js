import { describe, it, beforeEach } from 'highground'; // dev build
import { TestManager } from './src/TestManager'
import { expect } from 'chai';

it("Orphan Test [Not run]");

describe("Highground",()=>{
    let manager;
    beforeEach(()=>{
        manager = new TestManager(false);
        manager.reporters = [];
    });



    describe("Creating Test Suites",()=>{

        describe("An empty suite [Disappear after solving the task at hand]");
        it("An empty test [You bet!]");


        it("One test suite [Heisenberg's Uncertainty Test]",()=>{
            let name = `Heisenberg's Uncertainty Test`;
            manager.describe(name);
            expect(manager.tree.suites[0].name).to.equal(name);
        });

        it("Nested test suites [Simulated Universe]",async ()=>{
            let name = `Simulated Universe Test`;
            let name2 = `Dark Matter Test`
            manager.describe(name,()=>{
                manager.describe(name2);
            });
            await manager.take();
            expect(manager.tree.suites[0].name).to.equal(name);
            expect(manager.tree.suites[0].children.suites[0].name).to.equal(name2);
        });
    });

    describe("Creating Tests",()=>{
        it("Top level test [DNA Test]",()=>{
            let name = `DNA Test`;
            manager.it(name);
            expect(manager.tests[manager.tree.tests[0]].name).to.equal(name);
        })
    })
});

import './examples/node-es6';
import './examples/node-es5';
import './examples/many';