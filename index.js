export { delay } from './src/utility';
import { TestManager } from './src/TestManager'

let Manager = new TestManager();
export const describe = Manager.describe.bind(Manager);
export const fdescribe = Manager.fdescribe.bind(Manager);
export const beforeEach = Manager.beforeEach.bind(Manager);
export const beforeAll = Manager.beforeAll.bind(Manager);
export const fit = Manager.fit.bind(Manager);
export const it = Manager.it.bind(Manager);
// export default Manager;
export const test = 42;

console.log(`0.0.1`);

// return Manager;