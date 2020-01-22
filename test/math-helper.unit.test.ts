import assert from 'assert';
import Utils from '../src/utils/';

describe('Math Helper', function() {

    describe('function calcAngleFromAxisY(vectorA: {x: number, y: number})', function() {
        it('top Vector2({x: 0, y: 1}) should return 0 || 360', function() {
            assert.equal(Utils.math.calcAngleFromAxisY({x: 0, y: 1}) / (Math.PI / 180), 0 || 360);
        });
        it('left Vector2({x: -1, y: 0}) should return 90', function() {
            assert.equal(Utils.math.calcAngleFromAxisY({x: -1, y: 0}) / (Math.PI / 180), 90);
        });
        it('bottom Vector2({x: 0, y: -1}) should return 180', function() {
            assert.equal(Utils.math.calcAngleFromAxisY({x: 0, y: -1}) / (Math.PI / 180), 180);
        });
        it('right Vector2({x: 1, y: 0}) should return 270', function() {
            assert.equal(Utils.math.calcAngleFromAxisY({x: 1, y: 0}) / (Math.PI / 180), 270);
        });
    });

    describe('function calcRelativeDirection(deltaDirection: number) delta = Math.abs(player - move)', function() {
        it('(player 0, move 0) => delta 0 = forwards', function() {
            assert.equal(Utils.math.calcRelativeDirection(0), 'forwards');
        });
        it('(player 0, move 75) => delta 75 = right', function() {
            assert.equal(Utils.math.calcRelativeDirection(75), 'right');
        });
        it('(player 0, move 240) => delta 240 = backwards-left', function() {
            assert.equal(Utils.math.calcRelativeDirection(240), 'backwards-left');
        });

        it('(player 180, move 0) => delta 180 = backwards', function() {
            assert.equal(Utils.math.calcRelativeDirection(180), 'backwards');
        });
        it('(player 180, move 75) => delta 105 = right', function() {
            assert.equal(Utils.math.calcRelativeDirection(105), 'right');
        });
        it('(player 180, move 240) => delta 60 = forwards-right', function() {
            assert.equal(Utils.math.calcRelativeDirection(60), 'forwards-right');
        });
    });
});
