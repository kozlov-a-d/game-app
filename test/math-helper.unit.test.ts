import assert from 'assert';
import * as MathHelper from "../src/utils/math-helper";

describe('Math Helper', function() {

    describe('function calcAngleFromAxisY(vectorA: {x: number, y: number})', function() {
        it('top Vector2({x: 0, y: 1}) should return 0 || 360', function() {
            assert.equal(MathHelper.calcAngleFromAxisY({x: 0, y: 1}) / (Math.PI / 180), 0 || 360);
        });
        it('left Vector2({x: -1, y: 0}) should return 90', function() {
            assert.equal(MathHelper.calcAngleFromAxisY({x: -1, y: 0}) / (Math.PI / 180), 90);
        });
        it('bottom Vector2({x: 0, y: -1}) should return 180', function() {
            assert.equal(MathHelper.calcAngleFromAxisY({x: 0, y: -1}) / (Math.PI / 180), 180);
        });
        it('right Vector2({x: 1, y: 0}) should return 270', function() {
            assert.equal(MathHelper.calcAngleFromAxisY({x: 1, y: 0}) / (Math.PI / 180), 270);
        });
    });
});
