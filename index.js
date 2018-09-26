export { delay } from './src/utility';
import { TestManager } from './src/TestManager'

/*
    The test manager is a class which orchestrates a suite of describe and it statements.
    Highground is designed to allow you to have many test managers which do not interfere with eachother.

    For convenience, Highground exports the methods of one, global TestManager, to give it a parallel API to Mocha.

 */
let manager = new TestManager();

export async function describe(...args){
    return await manager.describe(...args);
}

export async function fdescribe(...args){
    return await manager.fdescribe(...args);
}

export async function xdescribe(...args){
    return await manager.xdescribe(...args);
}

export async function it(...args){
    return await manager.it(...args);
}

export async function fit(...args){
    return await manager.fit(...args);
}

export async function xit(...args){
    return await manager.xit(...args);
}

export async function beforeEach(...args){
    return await manager.beforeEach(...args);
}

export async function beforeAll(...args){
    return await manager.beforeAll(...args);
}

export async function afterEach(...args){
    return await manager.afterEach(...args);
}

export async function afterAll(...args){
    return await manager.afterAll(...args);
}