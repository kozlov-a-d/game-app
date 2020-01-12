import assert from 'assert';
import 'jsdom-global/register';
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
            it('Vector2(0,1) should return 0', function() {
                let inputs = new Inputs();
                let result = inputs.calcMouseRotation(0,1) / (Math.PI / 180);
                assert.equal(result, 0);
            });
        });
    });
});
