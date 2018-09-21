const { describe, it } = require('highground');

describe(`Example: ES5`,()=>{
    describe("Infinite Dimensions",()=>{
        let dimensions = [`C-136`,`C-137`,`C-139`];

        it("Known dimensions should include our dimension",()=>{
            if (!dimensions.includes(`C-137`)) throw new Error();
        });

        it("Known dimensions should include an unknown dimension [Failing Test]",()=>{
            if (!dimensions.includes(`C-138`)) throw new Error(`No matter how many we know of, there are yet more.`);
        })
    });
});