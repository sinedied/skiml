var extenders = require(__dirname + '/../js/lib/extenders');
var AiBrain = require(__dirname + '/../js/lib/aiBrain');
var should = require('should');
var sugar = require('sugar');

describe('aiBrain', function() {
	describe('#calcSituation()', function() {
		it('should return proper situation', function() {
			var aiBrain = new AiBrain();

			let staticObjects = [{canvasX: 80, canvasY: 90}];
			let movingObjects = [{canvasX: 60, canvasY: 70}];
			let player = {
				mapPosition: [0,0], 
				getMyDiscreteDirection: function() {return 'south'} 
			}
			let situation = aiBrain.calcSituation(staticObjects, movingObjects, player);

			console.log('situation: ', situation);
			situation.envInputs.should.deepEqual([ { x: 60, y: 70, type: 1, dist: 8500 },
				{ x: 80, y: 90, type: 0, dist: 14500 },
				{ x: 0, y: 0, type: 0, dist: 0 },
				{ x: 0, y: 0, type: 0, dist: 0 },
				{ x: 0, y: 0, type: 0, dist: 0 } ]);
				situation.playerInputs.should.deepEqual({ dir: 'south' });
		});
	});

	describe('#getAngle()', function() {
		it('should return proper angle', function() {
			var aiBrain = new AiBrain();

			let angle1 = aiBrain.getAngle([100,0],[100, 200]);
			console.log('angle1: ', angle1);
			angle1.should.equal(0);

			let angle2 = aiBrain.getAngle([100,0],[200, 100]);
			console.log('angle2: ', angle2);
			angle2.should.equal(0.5);

			let angle3 = aiBrain.getAngle([100,0],[0, 100]);
			console.log('angle2: ', angle3);
			angle3.should.equal(-0.5);
		});
	});
});