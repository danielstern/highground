import { describe, xdescribe , it } from 'highground';

describe("Many tests",()=>{
    for (let i = 0x00; i < 0x7F; i++){
        describe(`Test #${i}`,()=>{
            it("Should run");
        })
    }
});