import { describe, it } from 'highground';
describe(`Example: ES6`,()=>{
    describe("A simulation inside a simulation",()=>{
        let world = {
            world: {
                world:true
            }
        };

        it("Should be inside another simulation [Passing Test]",()=>{
            if (!world.world.world) throw new Error();
        });

        it("But inside that simulation should be another simulation [Failing Test]",()=>{
            if (!world.world.world.world) throw new Error(`It only goes so deep.`);
        })
    });
});
