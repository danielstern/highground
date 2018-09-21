// import { describe, it, beforeEach } from './dist/bundle';
// import { describe, it, beforeEach } from './index.js';
import * as bluh from './';
// import * as bluh from './dist/bundle';
// console.log("What?",bluh);
// import * as blurg from './';
// import * as churg from './index.spec'
// let flurg = require('./');
// let nurg = require('./dist/bundle');
import { TestManager } from './src/TestManager'
import { expect } from 'chai';

console.log("Describe?",describe);
// console.log("Imported???",blurg,flurg,nurg,churg);;

describe("Describing things",()=>{
    let manager;
    beforeEach(()=>{
        manager = new TestManager(false);
        manager.reporters = [];
    });

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