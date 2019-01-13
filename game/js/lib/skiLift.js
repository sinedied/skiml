var Sprite = require('./sprite');

function SkiLift(data) {
	var that = new Sprite(data);
	var super_draw = that.draw.bind(that);
	var super_cycle = that.cycle.bind(that);
	var standardSpeed = 6;
	that.setSpeed(standardSpeed);

	that.draw = function(dContext) {
		return super_draw(dContext, 'main');
	};

	that.cycle = function() {
		return super_cycle.apply(arguments);
	};

	return that;
}


if (typeof module !== 'undefined') {
	module.exports = SkiLift;
}