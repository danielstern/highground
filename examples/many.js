import { describe, it, delay, fdescribe } from 'highground';

/* This test is used to verify your reporter can handle a large volume of tests */
let count = 0x0f;
describe("Many tests",()=>{
    for (let i = 0x00; i < count; i++){
        describe(`Test #${i}`,()=>{
            it("Should run",async ()=>{
                await delay(0x0F);
            });
        })
    }
});