// import { describe, it, beforeEach } from './dist/bundle'; // prod build <-- the one that is actually used
import { describe, it, beforeEach } from './index.js'; // dev build
import { TestManager } from './src/TestManager'
import { expect } from 'chai';

describe("Highground",()=>{
    let manager;
    beforeEach(()=>{
        manager = new TestManager(false);
        manager.reporters = [];
    });

    describe("Creating Test Suites",()=>{

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

// describe("Reporters");

import './examples/node-es6';