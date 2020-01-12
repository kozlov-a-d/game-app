import assert from 'assert';
// import Player from "../src/characters/player.js";
import Inputs from "../src/characters/inputs";


// calcDirectionByAngleDifference
describe('Player', function() {
    // describe('calcDirectionByAngleDifference', function() {
    //     it('mesh 0', function() {
    //         // let player = new Player();
    //         assert.equal(true, true);
    //     });
    //     it('mesh 25', function() {
    //         // let player = new Player();
    //         assert.equal(true, false);
    //     });
    // });

    describe('Player inputs', function() {
        describe('Calc mouse rotation', function() {
            it('mesh 0', function() {
                let inputs = new Inputs();
                

                assert.equal(true, true);
            });
            it('mesh 25', function() {
                // let player = new Player();
                assert.equal(true, false);
            });
        });
    });
});
