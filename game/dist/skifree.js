(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// should be put in a dedicated package
// using npm link to use it from skifree.js?


(function (global) {
	function AiBrain () {
        this.aiBrainJs = undefined;
        this.step = 0;

        this.trainingVectors = []; // TODO we should use stream input for brainjs

        this.LEARNING_STEP_COUNT = 200;
        this.REPLAY_STEP_COUNT = 400;

        this.reset = function() {
            this.aiBrainJs = undefined;
            this.step = 0;
            console.log('aiBrain: reset');
        }

        this.cycle = function(staticObjects, movingObjects, player) {
            let currentSituation;

            if (this.step < this.LEARNING_STEP_COUNT) {
                console.log('aiBrain: record');
                // we learn (sampled learning, only when there is change in the inputs)
                // TODO
            } else if (this.step < this.REPLAY_STEP_COUNT) {
                if (!this.aiBrainJs) {
                    alert('NOW IT\'s UP TO YOUR IA!');
                    console.log('aiBrain: train AI');
                    // we create and train the IA
                    // TODO

                    // alert the user about the switch to the replay mode
                    // TODO
                }
                console.log('aiBrain: replay');
                // we replay
                // TODO
            } else {
                // go to the score part
                processScore(player);
            }
            this.step++;
            
            return currentSituation;
        }

        this.getAICommand = function(currentSituation) {
            console.log('aiBrain: getAICommand');
            if (currentSituation && this.aiBrainJs) {
                // we return the command calculated by the IA
                // TODO
            }
            return undefined;
        }
        
        this.endcycle = function(player) {
            // TODO where to call it from game.js ??
            console.log('aiBrain: endcycle');
            // depending on the step
            if (this.step < this.LEARNING_STEP_COUNT) {
                // the skier should not be able to die in the learning phase
                // TODO
            } else if (this.step < this.REPLAY_STEP_COUNT) {
                // warn the user the IA just died
                processScore(player);
            }
        }

        function processScore(player) {
            console.log('aiBrain: process score');
            alert('YOUR SCORE IS: ');
            // TODO
        }
    }

    global.AiBrain = AiBrain;
})(this);

if (typeof module !== 'undefined') {
	module.exports = this.AiBrain;
}
},{}],2:[function(require,module,exports){
CanvasRenderingContext2D.prototype.storeLoadedImage = function (key, image) {
	if (!this.images) {
		this.images = {};
	}

	this.images[key] = image;
};

CanvasRenderingContext2D.prototype.getLoadedImage = function (key) {
	if (this.images[key]) {
		return this.images[key];
	}
};

CanvasRenderingContext2D.prototype.followSprite = function (sprite) {
	this.centralSprite = sprite;
};

CanvasRenderingContext2D.prototype.getCentralPosition = function () {
	return {
		map: this.centralSprite.mapPosition,
		canvas: [ Math.round(this.canvas.width * 0.5), Math.round(this.canvas.height * 0.5), 0]
	};
};

CanvasRenderingContext2D.prototype.mapPositionToCanvasPosition = function (position) {
	var central = this.getCentralPosition();
	var centralMapPosition = central.map;
	var centralCanvasPosition = central.canvas;
	var mapDifferenceX = centralMapPosition[0] - position[0];
	var mapDifferenceY = centralMapPosition[1] - position[1];
	return [ centralCanvasPosition[0] - mapDifferenceX, centralCanvasPosition[1] - mapDifferenceY ];
};

CanvasRenderingContext2D.prototype.canvasPositionToMapPosition = function (position) {
	var central = this.getCentralPosition();
	var centralMapPosition = central.map;
	var centralCanvasPosition = central.canvas;
	var mapDifferenceX = centralCanvasPosition[0] - position[0];
	var mapDifferenceY = centralCanvasPosition[1] - position[1];
	return [ centralMapPosition[0] - mapDifferenceX, centralMapPosition[1] - mapDifferenceY ];
};

CanvasRenderingContext2D.prototype.getCentreOfViewport = function () {
	return (this.canvas.width / 2).floor();
};

// Y-pos canvas functions
CanvasRenderingContext2D.prototype.getMiddleOfViewport = function () {
	return (this.canvas.height / 2).floor();
};

CanvasRenderingContext2D.prototype.getBelowViewport = function () {
	return this.canvas.height.floor();
};

CanvasRenderingContext2D.prototype.getMapBelowViewport = function () {
	var below = this.getBelowViewport();
	return this.canvasPositionToMapPosition([ 0, below ])[1];
};

CanvasRenderingContext2D.prototype.getRandomlyInTheCentreOfCanvas = function (buffer) {
	var min = 0;
	var max = this.canvas.width;

	if (buffer) {
		min -= buffer;
		max += buffer;
	}

	return Number.random(min, max);
};

CanvasRenderingContext2D.prototype.getRandomlyInTheCentreOfMap = function (buffer) {
	var random = this.getRandomlyInTheCentreOfCanvas(buffer);
	return this.canvasPositionToMapPosition([ random, 0 ])[0];
};

CanvasRenderingContext2D.prototype.getRandomMapPositionBelowViewport = function () {
	var xCanvas = this.getRandomlyInTheCentreOfCanvas();
	var yCanvas = this.getBelowViewport();
	return this.canvasPositionToMapPosition([ xCanvas, yCanvas ]);
};

CanvasRenderingContext2D.prototype.getRandomMapPositionAboveViewport = function () {
	var xCanvas = this.getRandomlyInTheCentreOfCanvas();
	var yCanvas = this.getAboveViewport();
	return this.canvasPositionToMapPosition([ xCanvas, yCanvas ]);
};

CanvasRenderingContext2D.prototype.getTopOfViewport = function () {
	return this.canvasPositionToMapPosition([ 0, 0 ])[1];
};

CanvasRenderingContext2D.prototype.getAboveViewport = function () {
	return 0 - (this.canvas.height / 4).floor();
};
},{}],3:[function(require,module,exports){
// Extends function so that new-able objects can be given new methods easily
Function.prototype.method = function (name, func) {
    this.prototype[name] = func;
    return this;
};

// Will return the original method of an object when inheriting from another
Object.method('superior', function (name) {
    var that = this;
    var method = that[name];
    return function() {
        return method.apply(that, arguments);
    };
});
},{}],4:[function(require,module,exports){
var SpriteArray = require('./spriteArray');
var EventedLoop = require('eventedloop');
var AiBrain = require('./aiBrain');

(function (global) {
	function Game (mainCanvas, player) {
		var staticObjects = new SpriteArray();
		var movingObjects = new SpriteArray();
		var uiElements = new SpriteArray();
		var dContext = mainCanvas.getContext('2d');
		var mouseX = dContext.getCentreOfViewport();
		var mouseY = 0;
		var paused = false;
		var that = this;
		var beforeCycleCallbacks = [];
		var afterCycleCallbacks = [];
		var gameLoop = new EventedLoop();
		var aiBrain = new AiBrain();
		aiBrain.reset();

		this.addStaticObject = function (sprite) {
			staticObjects.push(sprite);
		};

		this.addStaticObjects = function (sprites) {
			sprites.forEach(this.addStaticObject.bind(this));
		};

		this.addMovingObject = function (movingObject, movingObjectType) {
			if (movingObjectType) {
				staticObjects.onPush(function (obj) {
					if (obj.data && obj.data.hitBehaviour[movingObjectType]) {
						obj.onHitting(movingObject, obj.data.hitBehaviour[movingObjectType]);
					}
				}, true);
			}

			movingObjects.push(movingObject);
		};

		this.addUIElement = function (element) {
			uiElements.push(element);
		};

		this.beforeCycle = function (callback) {
			beforeCycleCallbacks.push(callback);
		};

		this.afterCycle = function (callback) {
			afterCycleCallbacks.push(callback);
		};

		this.setMouseX = function (x) {
			mouseX = x;
		};

		this.setMouseY = function (y) {
			mouseY = y;
		};

		player.setMapPosition(0, 0);
		player.setMapPositionTarget(0, -10);
		dContext.followSprite(player);

		var intervalNum = 0;

		this.cycle = function () {
			beforeCycleCallbacks.each(function(c) {
				c();
			});

			// Clear canvas
			var mouseMapPosition = dContext.canvasPositionToMapPosition([mouseX, mouseY]);

			let currentSituation = aiBrain.cycle(staticObjects, movingObjects, player);

			if (!player.isJumping) {
				let aiCommand = aiBrain.getAICommand(currentSituation);
				if (aiCommand) {
					mouseMapPosition = aiCommand.mouseMapPosition;
				}
				player.setMapPositionTarget(mouseMapPosition[0], mouseMapPosition[1]);
			}

			intervalNum++;

			player.cycle();

			movingObjects.each(function (movingObject, i) {
				movingObject.cycle(dContext);
			});
			
			staticObjects.cull();
			staticObjects.each(function (staticObject, i) {
				if (staticObject.cycle) {
					staticObject.cycle();
				}
			});

			uiElements.each(function (uiElement, i) {
				if (uiElement.cycle) {
					uiElement.cycle();
				}
			});

			afterCycleCallbacks.each(function(c) {
				c();
			});
		};

		that.draw = function () {
			// Clear canvas
			mainCanvas.width = mainCanvas.width;

			player.draw(dContext);

			player.cycle();

			movingObjects.each(function (movingObject, i) {
				movingObject.draw(dContext);
			});
			
			staticObjects.each(function (staticObject, i) {
				if (staticObject.draw) {
					staticObject.draw(dContext, 'main');
				}
			});

			uiElements.each(function (uiElement, i) {
				if (uiElement.draw) {
					uiElement.draw(dContext, 'main');
				}
			});
		};

		this.start = function () {
			gameLoop.start();
		};

		this.pause = function () {
			paused = true;
			gameLoop.stop();
		};

		this.isPaused = function () {
			return paused;
		};

		this.reset = function () {
			paused = false;
			staticObjects = new SpriteArray();
			movingObjects = new SpriteArray();
			mouseX = dContext.getCentreOfViewport();
			mouseY = 0;
			player.reset();
			player.setMapPosition(0, 0, 0);
			aiBrain.reset();
			this.start();
		}.bind(this);

		gameLoop.on('20', this.cycle);
		gameLoop.on('20', this.draw);
	}

	global.game = Game;
})( this );


if (typeof module !== 'undefined') {
	module.exports = this.game;
}
},{"./aiBrain":1,"./spriteArray":13,"eventedloop":17}],5:[function(require,module,exports){
// Creates a random ID string
(function(global) {
    function guid ()
    {
        var S4 = function ()
        {
            return Math.floor(
                    Math.random() * 0x10000 /* 65536 */
                ).toString(16);
        };

        return (
                S4() + S4() + "-" +
                S4() + "-" +
                S4() + "-" +
                S4() + "-" +
                S4() + S4() + S4()
            );
    }
    global.guid = guid;
})(this);

if (typeof module !== 'undefined') {
    module.exports = this.guid;
}
},{}],6:[function(require,module,exports){
function InfoBox(data) {
	var that = this;

	that.lines = data.initialLines;

	that.top = data.position.top;
	that.right = data.position.right;
	that.bottom = data.position.bottom;
	that.left = data.position.left;

	that.width = data.width;
	that.height = data.height;

	that.setLines = function (lines) {
		that.lines = lines;
	};

	that.draw = function (dContext) {
		dContext.font = '11px monospace';
		var yOffset = 0;
		that.lines.each(function (line) {
			var fontSize = +dContext.font.slice(0,2);
			var textWidth = dContext.measureText(line).width;
			var textHeight = fontSize * 1.5;
			var xPos, yPos;
			if (that.top) {
				yPos = that.top + yOffset;
			} else if (that.bottom) {
				yPos = dContext.canvas.height - that.top - textHeight + yOffset;
			}

			if (that.right) {
				xPos = dContext.canvas.width - that.right - textWidth;
			} else if (that.left) {
				xPos = that.left;
			}

			yOffset += textHeight;


			dContext.fillText(line, xPos, yPos);
		});
	};

	return that;
}

if (typeof module !== 'undefined') {
	module.exports = InfoBox;
}

},{}],7:[function(require,module,exports){
function isMobileDevice() {
	if(navigator.userAgent.match(/Android/i) ||
		navigator.userAgent.match(/webOS/i) ||
		navigator.userAgent.match(/iPhone/i) ||
		navigator.userAgent.match(/iPad/i) ||
		navigator.userAgent.match(/iPod/i) ||
		navigator.userAgent.match(/BlackBerry/i) ||
		navigator.userAgent.match(/Windows Phone/i)
	) {
		return true;
	}
	else {
		return false;
	}
}

module.exports = isMobileDevice;
},{}],8:[function(require,module,exports){
var Sprite = require('./sprite');

(function(global) {
	function Monster(data) {
		var that = new Sprite(data);
		var super_draw = that.superior('draw');
		var spriteVersion = 1;
		var eatingStage = 0;
		var standardSpeed = 6;

		that.isEating = false;
		that.isFull = false;
		that.setSpeed(standardSpeed);

		that.draw = function(dContext) {
			var spritePartToUse = function () {
				var xDiff = that.movingToward[0] - that.canvasX;

				if (that.isEating) {
					return 'eating' + eatingStage;
				}

				if (spriteVersion + 0.1 > 2) {
					spriteVersion = 0.1;
				} else {
					spriteVersion += 0.1;
				}
				if (xDiff >= 0) {
					return 'sEast' + Math.ceil(spriteVersion);
				} else if (xDiff < 0) {
					return 'sWest' + Math.ceil(spriteVersion);
				}
			};

			return super_draw(dContext, spritePartToUse());
		};

		function startEating (whenDone) {
			eatingStage += 1;
			that.isEating = true;
			that.isMoving = false;
			if (eatingStage < 6) {
				setTimeout(function () {
					startEating(whenDone);
				}, 300);
			} else {
				eatingStage = 0;
				that.isEating = false;
				that.isMoving = true;
				whenDone();
			}
		}

		that.startEating = startEating;

		return that;
	}

	global.monster = Monster;
})( this );


if (typeof module !== 'undefined') {
	module.exports = this.monster;
}
},{"./sprite":12}],9:[function(require,module,exports){
// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function noop() {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());
},{}],10:[function(require,module,exports){
var Sprite = require('./sprite');
if (typeof navigator !== 'undefined') {
	navigator.vibrate = navigator.vibrate ||
		navigator.webkitVibrate ||
		navigator.mozVibrate ||
		navigator.msVibrate;
} else {
	navigator = {
		vibrate: false
	};
}

(function(global) {
	function Skier(data) {
		var discreteDirections = {
			'west': 270,
			'wsWest': 240,
			'sWest': 195,
			'south': 180,
			'sEast': 165,
			'esEast': 120,
			'east': 90
		};
		var that = new Sprite(data);
		var sup = {
			draw: that.superior('draw'),
			cycle: that.superior('cycle'),
			getSpeedX: that.superior('getSpeedX'),
			getSpeedY: that.superior('getSpeedY'),
			hits: that.superior('hits')
		};
		var directions = {
			esEast: function(xDiff) { return xDiff > 300; },
			sEast: function(xDiff) { return xDiff > 75; },
			wsWest: function(xDiff) { return xDiff < -300; },
			sWest: function(xDiff) { return xDiff < -75; }
		};

		var cancelableStateTimeout;
		var cancelableStateInterval;

		var canSpeedBoost = true;

		var obstaclesHit = [];
		var pixelsTravelled = 0;
		var standardSpeed = 5;
		var boostMultiplier = 2;
		var turnEaseCycles = 70;
		var speedX = 0;
		var speedXFactor = 0;
		var speedY = 0;
		var speedYFactor = 1;
		var trickStep = 0; // There are three of these

		that.isMoving = true;
		that.hasBeenHit = false;
		that.isJumping = false;
		that.isPerformingTrick = false;
		that.onHitObstacleCb = function() {};
		that.setSpeed(standardSpeed);

		that.reset = function () {
			obstaclesHit = [];
			pixelsTravelled = 0;
			that.isMoving = true;
			that.hasBeenHit = false;
			canSpeedBoost = true;
			setNormal();
		};

		function setNormal() {
			that.setSpeed(standardSpeed);
			that.isMoving = true;
			that.hasBeenHit = false;
			that.isJumping = false;
			that.isPerformingTrick = false;
			if (cancelableStateInterval) {
				clearInterval(cancelableStateInterval);
			}
			that.setMapPosition(undefined, undefined, 0);
		}

		function setCrashed() {
			that.isMoving = false;
			that.hasBeenHit = true;
			that.isJumping = false;
			that.isPerformingTrick = false;
			if (cancelableStateInterval) {
				clearInterval(cancelableStateInterval);
			}
			that.setMapPosition(undefined, undefined, 0);
		}

		function setJumping() {
			var currentSpeed = that.getSpeed();
			that.setSpeed(currentSpeed + 2);
			that.setSpeedY(currentSpeed + 2);
			that.isMoving = true;
			that.hasBeenHit = false;
			that.isJumping = true;
			that.setMapPosition(undefined, undefined, 1);
		}

		function getDiscreteDirection() {
			if (that.direction) {
				if (that.direction <= 90) {
					return 'east';
				} else if (that.direction > 90 && that.direction < 150) {
					return 'esEast';
				} else if (that.direction >= 150 && that.direction < 180) {
					return 'sEast';
				} else if (that.direction === 180) {
					return 'south';
				} else if (that.direction > 180 && that.direction <= 210) {
					return 'sWest';
				} else if (that.direction > 210 && that.direction < 270) {
					return 'wsWest';
				} else if (that.direction >= 270) {
					return 'west';
				} else {
					return 'south';
				}
			} else {
				var xDiff = that.movingToward[0] - that.mapPosition[0];
				var yDiff = that.movingToward[1] - that.mapPosition[1];
				if (yDiff <= 0) {
					if (xDiff > 0) {
						return 'east';
					} else {
						return 'west';
					}
				}

				if (directions.esEast(xDiff)) {
					return 'esEast';
				} else if (directions.sEast(xDiff)) {
					return 'sEast';
				} else if (directions.wsWest(xDiff)) {
					return 'wsWest';
				} else if (directions.sWest(xDiff)) {
					return 'sWest';
				}
			}
			return 'south';
		}

		function setDiscreteDirection(d) {
			if (discreteDirections[d]) {
				that.setDirection(discreteDirections[d]);
			}

			if (d === 'west' || d === 'east') {
				that.isMoving = false;
			} else {
				that.isMoving = true;
			}
		}

		function getBeingEatenSprite() {
			return 'blank';
		}

		function getJumpingSprite() {
			return 'jumping';
		}

		function getTrickSprite() {
			console.log('Trick step is', trickStep);
			if (trickStep === 0) {
				return 'jumping';
			} else if (trickStep === 1) {
				return 'somersault1';
			} else {
				return 'somersault2';
			}
		}

		that.stop = function () {
			if (that.direction > 180) {
				setDiscreteDirection('west');
			} else {
				setDiscreteDirection('east');
			}
		};

		that.turnEast = function () {
			var discreteDirection = getDiscreteDirection();

			switch (discreteDirection) {
				case 'west':
					setDiscreteDirection('wsWest');
					break;
				case 'wsWest':
					setDiscreteDirection('sWest');
					break;
				case 'sWest':
					setDiscreteDirection('south');
					break;
				case 'south':
					setDiscreteDirection('sEast');
					break;
				case 'sEast':
					setDiscreteDirection('esEast');
					break;
				case 'esEast':
					setDiscreteDirection('east');
					break;
				default:
					setDiscreteDirection('south');
					break;
			}
		};

		that.turnWest = function () {
			var discreteDirection = getDiscreteDirection();

			switch (discreteDirection) {
				case 'east':
					setDiscreteDirection('esEast');
					break;
				case 'esEast':
					setDiscreteDirection('sEast');
					break;
				case 'sEast':
					setDiscreteDirection('south');
					break;
				case 'south':
					setDiscreteDirection('sWest');
					break;
				case 'sWest':
					setDiscreteDirection('wsWest');
					break;
				case 'wsWest':
					setDiscreteDirection('west');
					break;
				default:
					setDiscreteDirection('south');
					break;
			}
		};

		that.stepWest = function () {
			that.mapPosition[0] -= that.speed * 2;
		};

		that.stepEast = function () {
			that.mapPosition[0] += that.speed * 2;
		};

		that.setMapPositionTarget = function (x, y) {
			if (that.hasBeenHit) return;

			if (Math.abs(that.mapPosition[0] - x) <= 75) {
				x = that.mapPosition[0];
			}

			that.movingToward = [ x, y ];

			// that.resetDirection();
		};

		that.startMovingIfPossible = function () {
			if (!that.hasBeenHit && !that.isBeingEaten) {
				that.isMoving = true;
			}
		};

		that.setTurnEaseCycles = function (c) {
			turnEaseCycles = c;
		};

		that.getPixelsTravelledDownMountain = function () {
			return pixelsTravelled;
		};

		that.resetSpeed = function () {
			that.setSpeed(standardSpeed);
		};

		that.cycle = function () {
			if ( that.getSpeedX() <= 0 && that.getSpeedY() <= 0 ) {
						that.isMoving = false;
			}
			if (that.isMoving) {
				pixelsTravelled += that.speed;
			}

			if (that.isJumping) {
				that.setMapPositionTarget(undefined, that.mapPosition[1] + that.getSpeed());
			}

			sup.cycle();
			
			that.checkHittableObjects();
		};

		that.draw = function(dContext) {
			var spritePartToUse = function () {
				if (that.isBeingEaten) {
					return getBeingEatenSprite();
				}

				if (that.isJumping) {
					if (that.isPerformingTrick) {
						return getTrickSprite();
					}
					return getJumpingSprite();
				}

				if (that.hasBeenHit) {
					return 'hit';
				}

				return getDiscreteDirection();
			};

			return sup.draw(dContext, spritePartToUse());
		};

		that.hits = function (obs) {
			if (obstaclesHit.indexOf(obs.id) !== -1) {
				return false;
			}

			if (!obs.occupiesZIndex(that.mapPosition[2])) {
				return false;
			}

			if (sup.hits(obs)) {
				return true;
			}

			return false;
		};

		that.speedBoost = function () {
			var originalSpeed = that.speed;
			if (canSpeedBoost) {
				canSpeedBoost = false;
				that.setSpeed(that.speed * boostMultiplier);
				setTimeout(function () {
					that.setSpeed(originalSpeed);
					setTimeout(function () {
						canSpeedBoost = true;
					}, 10000);
				}, 2000);
			}
		};

		that.attemptTrick = function () {
			if (that.isJumping) {
				that.isPerformingTrick = true;
				cancelableStateInterval = setInterval(function () {
					if (trickStep >= 2) {
						trickStep = 0;
					} else {
						trickStep += 1;
					}
				}, 300);
			}
		};

		that.getStandardSpeed = function () {
			return standardSpeed;
		};

		function easeSpeedToTargetUsingFactor(sp, targetSpeed, f) {
			if (f === 0 || f === 1) {
				return targetSpeed;
			}

			if (sp < targetSpeed) {
				sp += that.getSpeed() * (f / turnEaseCycles);
			}

			if (sp > targetSpeed) {
				sp -= that.getSpeed() * (f / turnEaseCycles);
			}

			return sp;
		}

		that.getSpeedX = function () {
			if (getDiscreteDirection() === 'esEast' || getDiscreteDirection() === 'wsWest') {
				speedXFactor = 0.5;
				speedX = easeSpeedToTargetUsingFactor(speedX, that.getSpeed() * speedXFactor, speedXFactor);

				return speedX;
			}

			if (getDiscreteDirection() === 'sEast' || getDiscreteDirection() === 'sWest') {
				speedXFactor = 0.33;
				speedX = easeSpeedToTargetUsingFactor(speedX, that.getSpeed() * speedXFactor, speedXFactor);

				return speedX;
			}

			// So it must be south

			speedX = easeSpeedToTargetUsingFactor(speedX, 0, speedXFactor);

			return speedX;
		};

		that.setSpeedY = function(sy) {
			speedY = sy;
		};

		that.getSpeedY = function () {
			var targetSpeed;

			if (that.isJumping) {
				return speedY;
			}

			if (getDiscreteDirection() === 'esEast' || getDiscreteDirection() === 'wsWest') {
				speedYFactor = 0.6;
				speedY = easeSpeedToTargetUsingFactor(speedY, that.getSpeed() * 0.6, 0.6);

				return speedY;
			}

			if (getDiscreteDirection() === 'sEast' || getDiscreteDirection() === 'sWest') {
				speedYFactor = 0.85;
				speedY = easeSpeedToTargetUsingFactor(speedY, that.getSpeed() * 0.85, 0.85);

				return speedY;
			}

			if (getDiscreteDirection() === 'east' || getDiscreteDirection() === 'west') {
				speedYFactor = 1;
				speedY = 0;

				return speedY;
			}

			// So it must be south

			speedY = easeSpeedToTargetUsingFactor(speedY, that.getSpeed(), speedYFactor);

			return speedY;
		};

		that.hasHitObstacle = function (obs) {
			setCrashed();

			if (navigator.vibrate) {
				navigator.vibrate(500);
			}

			obstaclesHit.push(obs.id);

			that.resetSpeed();
			that.onHitObstacleCb(obs);

			if (cancelableStateTimeout) {
				clearTimeout(cancelableStateTimeout);
			}
			cancelableStateTimeout = setTimeout(function() {
				setNormal();
			}, 1500);
		};

		that.hasHitJump = function () {
			setJumping();

			if (cancelableStateTimeout) {
				clearTimeout(cancelableStateTimeout);
			}
			cancelableStateTimeout = setTimeout(function() {
				setNormal();
			}, 1000);
		};

		that.isEatenBy = function (monster, whenEaten) {
			that.hasHitObstacle(monster);
			monster.startEating(whenEaten);
			obstaclesHit.push(monster.id);
			that.isMoving = false;
			that.isBeingEaten = true;
		};

		that.reset = function () {
			obstaclesHit = [];
			pixelsTravelled = 0;
			that.isMoving = true;
			that.isJumping = false;
			that.hasBeenHit = false;
			canSpeedBoost = true;
		};

		that.setHitObstacleCb = function (fn) {
			that.onHitObstacleCb = fn || function() {};
		};
		return that;
	}

	global.skier = Skier;
})(this);

if (typeof module !== 'undefined') {
	module.exports = this.skier;
}

},{"./sprite":12}],11:[function(require,module,exports){
var Sprite = require('./sprite');

(function(global) {
	function Snowboarder(data) {
		var that = new Sprite(data);
		var sup = {
			draw: that.superior('draw'),
			cycle: that.superior('cycle')
		};
		var directions = {
			sEast: function(xDiff) { return xDiff > 0; },
			sWest: function(xDiff) { return xDiff <= 0; }
		};
		var standardSpeed = 3;

		that.setSpeed(standardSpeed);

		function getDirection() {
			var xDiff = that.movingToward[0] - that.mapPosition[0];
			var yDiff = that.movingToward[1] - that.mapPosition[1];

			if (directions.sEast(xDiff)) {
				return 'sEast';
			} else {
				return 'sWest';
			}
		}

		that.cycle = function (dContext) {
			if (Number.random(10) === 1) {
				that.setMapPositionTarget(dContext.getRandomlyInTheCentreOfMap());
				that.setSpeed(standardSpeed + Number.random(-1, 1));
			}

			that.setMapPositionTarget(undefined, dContext.getMapBelowViewport() + 600);

			sup.cycle();
		};

		that.draw = function(dContext) {
			var spritePartToUse = function () {
				return getDirection();
			};

			return sup.draw(dContext, spritePartToUse());
		};

		return that;
	}

	global.snowboarder = Snowboarder;
})( this );


if (typeof module !== 'undefined') {
	module.exports = this.snowboarder;
}
},{"./sprite":12}],12:[function(require,module,exports){
(function (global) {
	var GUID = require('./guid');
	function Sprite (data) {
		var hittableObjects = {};
		var zIndexesOccupied = [ 0 ];
		var that = this;
		var trackedSpriteToMoveToward;
		that.direction = undefined;
		that.mapPosition = [0, 0, 0];
		that.id = GUID();
		that.canvasX = 0;
		that.canvasY = 0;
		that.canvasZ = 0;
		that.height = 0;
		that.speed = 0;
		that.data = data || { parts : {} };
		that.movingToward = [ 0, 0 ];
		that.metresDownTheMountain = 0;
		that.movingWithConviction = false;
		that.deleted = false;
		that.maxHeight = (function () {
			return Object.values(that.data.parts).map(function (p) { return p[3]; }).max();
		}());
		that.isMoving = true;

		if (!that.data.parts) {
			that.data.parts = {};
		}

		if (data && data.id){
			that.id = data.id;
		}

		if (data && data.zIndexesOccupied) {
			zIndexesOccupied = data.zIndexesOccupied;
		}

		function incrementX(amount) {
			that.canvasX += amount.toNumber();
		}

		function incrementY(amount) {
			that.canvasY += amount.toNumber();
		}

		function getHitBox(forZIndex) {
			if (that.data.hitBoxes) {
				if (data.hitBoxes[forZIndex]) {
					return data.hitBoxes[forZIndex];
				}
			}
		}

		function roundHalf(num) {
			num = Math.round(num*2)/2;
			return num;
		}

		function move() {
			if (!that.isMoving) {
				return;
			}

			var currentX = that.mapPosition[0];
			var currentY = that.mapPosition[1];

			if (typeof that.direction !== 'undefined') {
				// For this we need to modify the that.direction so it relates to the horizontal
				var d = that.direction - 90;
				if (d < 0) d = 360 + d;
				currentX += roundHalf(that.speed * Math.cos(d * (Math.PI / 180)));
				currentY += roundHalf(that.speed * Math.sin(d * (Math.PI / 180)));
			} else {
				if (typeof that.movingToward[0] !== 'undefined') {
					if (currentX > that.movingToward[0]) {
						currentX -= Math.min(that.getSpeedX(), Math.abs(currentX - that.movingToward[0]));
					} else if (currentX < that.movingToward[0]) {
						currentX += Math.min(that.getSpeedX(), Math.abs(currentX - that.movingToward[0]));
					}
				}
				
				if (typeof that.movingToward[1] !== 'undefined') {
					if (currentY > that.movingToward[1]) {
						currentY -= Math.min(that.getSpeedY(), Math.abs(currentY - that.movingToward[1]));
					} else if (currentY < that.movingToward[1]) {
						currentY += Math.min(that.getSpeedY(), Math.abs(currentY - that.movingToward[1]));
					}
				}
			}

			that.setMapPosition(currentX, currentY);
		}

		this.draw = function (dCtx, spriteFrame) {
			var fr = that.data.parts[spriteFrame];
			that.height = fr[3];
			that.width = fr[2];

			var newCanvasPosition = dCtx.mapPositionToCanvasPosition(that.mapPosition);
			that.setCanvasPosition(newCanvasPosition[0], newCanvasPosition[1]);

			dCtx.drawImage(dCtx.getLoadedImage(that.data.$imageFile), fr[0], fr[1], fr[2], fr[3], that.canvasX, that.canvasY, fr[2], fr[3]);
		};

		this.setMapPosition = function (x, y, z) {
			if (typeof x === 'undefined') {
				x = that.mapPosition[0];
			}
			if (typeof y === 'undefined') {
				y = that.mapPosition[1];
			}
			if (typeof z === 'undefined') {
				z = that.mapPosition[2];
			} else {
				that.zIndexesOccupied = [ z ];
			}
			that.mapPosition = [x, y, z];
		};

		this.setCanvasPosition = function (cx, cy) {
			if (cx) {
				if (Object.isString(cx) && (cx.first() === '+' || cx.first() === '-')) incrementX(cx);
				else that.canvasX = cx;
			}
			
			if (cy) {
				if (Object.isString(cy) && (cy.first() === '+' || cy.first() === '-')) incrementY(cy);
				else that.canvasY = cy;
			}
		};

		this.getCanvasPositionX = function () {
			return that.canvasX;
		};

		this.getCanvasPositionY = function  () {
			return that.canvasY;
		};

		this.getLeftHitBoxEdge = function (zIndex) {
			zIndex = zIndex || 0;
			var lhbe = this.getCanvasPositionX();
			if (getHitBox(zIndex)) {
				lhbe += getHitBox(zIndex)[0];
			}
			return lhbe;
		};

		this.getTopHitBoxEdge = function (zIndex) {
			zIndex = zIndex || 0;
			var thbe = this.getCanvasPositionY();
			if (getHitBox(zIndex)) {
				thbe += getHitBox(zIndex)[1];
			}
			return thbe;
		};

		this.getRightHitBoxEdge = function (zIndex) {
			zIndex = zIndex || 0;

			if (getHitBox(zIndex)) {
				return that.canvasX + getHitBox(zIndex)[2];
			}

			return that.canvasX + that.width;
		};

		this.getBottomHitBoxEdge = function (zIndex) {
			zIndex = zIndex || 0;

			if (getHitBox(zIndex)) {
				return that.canvasY + getHitBox(zIndex)[3];
			}

			return that.canvasY + that.height;
		};

		this.getPositionInFrontOf = function  () {
			return [that.canvasX, that.canvasY + that.height];
		};

		this.setSpeed = function (s) {
			that.speed = s;
			that.speedX = s;
			that.speedY = s;
		};

		this.incrementSpeedBy = function (s) {
			that.speed += s;
		};

		that.getSpeed = function getSpeed () {
			return that.speed;
		};

		that.getSpeedX = function () {
			return that.speed;
		};

		that.getSpeedY = function () {
			return that.speed;
		};

		this.setHeight = function (h) {
			that.height = h;
		};

		this.setWidth = function (w) {
			that.width = w;
		};

		this.getMaxHeight = function () {
			return that.maxHeight;
		};

		that.getMovingTowardOpposite = function () {
			if (!that.isMoving) {
				return [0, 0];
			}

			var dx = (that.movingToward[0] - that.mapPosition[0]);
			var dy = (that.movingToward[1] - that.mapPosition[1]);

			var oppositeX = (Math.abs(dx) > 75 ? 0 - dx : 0);
			var oppositeY = -dy;

			return [ oppositeX, oppositeY ];
		};

		this.checkHittableObjects = function () {
			Object.keys(hittableObjects, function (k, objectData) {
				if (objectData.object.deleted) {
					delete hittableObjects[k];
				} else {
					if (objectData.object.hits(that)) {
						objectData.callbacks.each(function (callback) {
							callback(that, objectData.object);
						});
					}
				}
			});
		};

		this.cycle = function () {
			that.checkHittableObjects();

			if (trackedSpriteToMoveToward) {
				that.setMapPositionTarget(trackedSpriteToMoveToward.mapPosition[0], trackedSpriteToMoveToward.mapPosition[1], true);
			}

			move();
		};

		this.setMapPositionTarget = function (x, y, override) {
			if (override) {
				that.movingWithConviction = false;
			}

			if (!that.movingWithConviction) {
				if (typeof x === 'undefined') {
					x = that.movingToward[0];
				}

				if (typeof y === 'undefined') {
					y = that.movingToward[1];
				}

				that.movingToward = [ x, y ];

				that.movingWithConviction = false;
			}

			// that.resetDirection();
		};

		this.setDirection = function (angle) {
			if (angle >= 360) {
				angle = 360 - angle;
			}
			that.direction = angle;
			that.movingToward = undefined;
		};

		this.resetDirection = function () {
			that.direction = undefined;
		};

		this.setMapPositionTargetWithConviction = function (cx, cy) {
			that.setMapPositionTarget(cx, cy);
			that.movingWithConviction = true;
			// that.resetDirection();
		};

		this.follow = function (sprite) {
			trackedSpriteToMoveToward = sprite;
			// that.resetDirection();
		};

		this.stopFollowing = function () {
			trackedSpriteToMoveToward = false;
		};

		this.onHitting = function (objectToHit, callback) {
			if (hittableObjects[objectToHit.id]) {
				return hittableObjects[objectToHit.id].callbacks.push(callback);
			}

			hittableObjects[objectToHit.id] = {
				object: objectToHit,
				callbacks: [ callback ]
			};
		};

		this.deleteOnNextCycle = function () {
			that.deleted = true;
		};

		this.occupiesZIndex = function (z) {
			return zIndexesOccupied.indexOf(z) >= 0;
		};

		this.hits = function (other) {
			var verticalIntersect = false;
			var horizontalIntersect = false;

			// Test that THIS has a bottom edge inside of the other object
			if (other.getTopHitBoxEdge(that.mapPosition[2]) <= that.getBottomHitBoxEdge(that.mapPosition[2]) && other.getBottomHitBoxEdge(that.mapPosition[2]) >= that.getBottomHitBoxEdge(that.mapPosition[2])) {
				verticalIntersect = true;
			}

			// Test that THIS has a top edge inside of the other object
			if (other.getTopHitBoxEdge(that.mapPosition[2]) <= that.getTopHitBoxEdge(that.mapPosition[2]) && other.getBottomHitBoxEdge(that.mapPosition[2]) >= that.getTopHitBoxEdge(that.mapPosition[2])) {
				verticalIntersect = true;
			}

			// Test that THIS has a right edge inside of the other object
			if (other.getLeftHitBoxEdge(that.mapPosition[2]) <= that.getRightHitBoxEdge(that.mapPosition[2]) && other.getRightHitBoxEdge(that.mapPosition[2]) >= that.getRightHitBoxEdge(that.mapPosition[2])) {
				horizontalIntersect = true;
			}

			// Test that THIS has a left edge inside of the other object
			if (other.getLeftHitBoxEdge(that.mapPosition[2]) <= that.getLeftHitBoxEdge(that.mapPosition[2]) && other.getRightHitBoxEdge(that.mapPosition[2]) >= that.getLeftHitBoxEdge(that.mapPosition[2])) {
				horizontalIntersect = true;
			}

			return verticalIntersect && horizontalIntersect;
		};

		this.isAboveOnCanvas = function (cy) {
			return (that.canvasY + that.height) < cy;
		};

		this.isBelowOnCanvas = function (cy) {
			return (that.canvasY) > cy;
		};

		return that;
	}

	Sprite.createObjects = function createObjects(spriteInfoArray, opts) {
		if (!Array.isArray(spriteInfoArray)) spriteInfoArray = [ spriteInfoArray ];
		opts = Object.merge(opts, {
			rateModifier: 0,
			dropRate: 1,
			position: [0, 0]
		}, false, false);

		function createOne (spriteInfo) {
			var position = opts.position;
			if (Number.random(100 + opts.rateModifier) <= spriteInfo.dropRate) {
				var sprite = new Sprite(spriteInfo.sprite);
				sprite.setSpeed(0);

				if (Object.isFunction(position)) {
					position = position();
				}

				sprite.setMapPosition(position[0], position[1]);

				if (spriteInfo.sprite.hitBehaviour && spriteInfo.sprite.hitBehaviour.skier && opts.player) {
					sprite.onHitting(opts.player, spriteInfo.sprite.hitBehaviour.skier);
				}

				return sprite;
			}
		}

		var objects = spriteInfoArray.map(createOne).remove(undefined);

		return objects;
	};

	global.sprite = Sprite;
})( this );


if (typeof module !== 'undefined') {
	module.exports = this.sprite;
}
},{"./guid":5}],13:[function(require,module,exports){
(function (global) {
	function SpriteArray() {
		this.pushHandlers = [];

		return this;
	}

	SpriteArray.prototype = Object.create(Array.prototype);

	SpriteArray.prototype.onPush = function(f, retroactive) {
		this.pushHandlers.push(f);

		if (retroactive) {
			this.each(f);
		}
	};

	SpriteArray.prototype.push = function(obj) {
		Array.prototype.push.call(this, obj);
		this.pushHandlers.each(function(handler) {
			handler(obj);
		});
	};

	SpriteArray.prototype.cull = function() {
		this.each(function (obj, i) {
			if (obj.deleted) {
				return (delete this[i]);
			}
		});
	};

	global.spriteArray = SpriteArray;
})(this);


if (typeof module !== 'undefined') {
	module.exports = this.spriteArray;
}
},{}],14:[function(require,module,exports){
// Global dependencies which return no modules
require('./lib/canvasRenderingContext2DExtensions');
require('./lib/extenders');
require('./lib/plugins');

// External dependencies
var Hammer = require('hammerjs');
var Mousetrap = require('br-mousetrap');

// Method modules
var isMobileDevice = require('./lib/isMobileDevice');

// Game Objects
var SpriteArray = require('./lib/spriteArray');
var Monster = require('./lib/monster');
var Sprite = require('./lib/sprite');
var Snowboarder = require('./lib/snowboarder');
var Skier = require('./lib/skier');
var InfoBox = require('./lib/infoBox');
var Game = require('./lib/game');

// Local variables for starting the game
var mainCanvas = document.getElementById('skifree-canvas');
var dContext = mainCanvas.getContext('2d');
var imageSources = [ 'sprite-characters.png', 'skifree-objects.png' ];
var global = this;
var infoBoxControls = 'Use the mouse or WASD to control the player';
if (isMobileDevice()) infoBoxControls = 'Tap or drag on the piste to control the player';
var sprites = require('./spriteInfo');

var pixelsPerMetre = 18;
var distanceTravelledInMetres = 0;
var monsterDistanceThreshold = 2000;
var livesLeft = 5;
var highScore = 0;
var loseLifeOnObstacleHit = false;
var dropRates = {smallTree: 4, tallTree: 2, jump: 1, thickSnow: 1, rock: 1};
if (localStorage.getItem('highScore')) highScore = localStorage.getItem('highScore');

function loadImages (sources, next) {
	var loaded = 0;
	var images = {};

	function finish () {
		loaded += 1;
		if (loaded === sources.length) {
			next(images);
		}
	}

	sources.each(function (src) {
		var im = new Image();
		im.onload = finish;
		im.src = src;
		dContext.storeLoadedImage(src, im);
	});
}

function monsterHitsSkierBehaviour(monster, skier) {
	skier.isEatenBy(monster, function () {
		livesLeft -= 1;
		monster.isFull = true;
		monster.isEating = false;
		skier.isBeingEaten = false;
		monster.setSpeed(skier.getSpeed());
		monster.stopFollowing();
		var randomPositionAbove = dContext.getRandomMapPositionAboveViewport();
		monster.setMapPositionTarget(randomPositionAbove[0], randomPositionAbove[1]);
	});
}

function startNeverEndingGame (images) {
	var player;
	var startSign;
	var infoBox;
	var game;

	function resetGame () {
		distanceTravelledInMetres = 0;
		livesLeft = 5;
		highScore = localStorage.getItem('highScore');
		game.reset();
		game.addStaticObject(startSign);
	}

	function detectEnd () {
		if (!game.isPaused()) {
			highScore = localStorage.setItem('highScore', distanceTravelledInMetres);
			infoBox.setLines([
				'Game over!',
				'Hit space to restart'
			]);
			game.pause();
			game.cycle();
		}
	}

	function randomlySpawnNPC(spawnFunction, dropRate) {
		var rateModifier = Math.max(800 - mainCanvas.width, 0);
		if (Number.random(1000 + rateModifier) <= dropRate) {
			spawnFunction();
		}
	}

	function spawnMonster () {
		var newMonster = new Monster(sprites.monster);
		var randomPosition = dContext.getRandomMapPositionAboveViewport();
		newMonster.setMapPosition(randomPosition[0], randomPosition[1]);
		newMonster.follow(player);
		newMonster.setSpeed(player.getStandardSpeed());
		newMonster.onHitting(player, monsterHitsSkierBehaviour);

		game.addMovingObject(newMonster, 'monster');
	}

	function spawnBoarder () {
		var newBoarder = new Snowboarder(sprites.snowboarder);
		var randomPositionAbove = dContext.getRandomMapPositionAboveViewport();
		var randomPositionBelow = dContext.getRandomMapPositionBelowViewport();
		newBoarder.setMapPosition(randomPositionAbove[0], randomPositionAbove[1]);
		newBoarder.setMapPositionTarget(randomPositionBelow[0], randomPositionBelow[1]);
		newBoarder.onHitting(player, sprites.snowboarder.hitBehaviour.skier);

		game.addMovingObject(newBoarder);
	}

	player = new Skier(sprites.skier);
	player.setMapPosition(0, 0);
	player.setMapPositionTarget(0, -10);
	if ( loseLifeOnObstacleHit ) {
		player.setHitObstacleCb(function() {
			livesLeft -= 1;
		});
	}

	game = new Game(mainCanvas, player);

	startSign = new Sprite(sprites.signStart);
	game.addStaticObject(startSign);
	startSign.setMapPosition(-50, 0);
	dContext.followSprite(player);

	infoBox = new InfoBox({
		initialLines : [
			'SkiFree.js',
			infoBoxControls,
			'Travelled 0m',
			'High Score: ' + highScore,
			'Skiers left: ' + livesLeft,
			'Created by Dan Hough (@basicallydan)'
		],
		position: {
			top: 15,
			right: 10
		}
	});

	game.beforeCycle(function () {
		var newObjects = [];
		if (player.isMoving) {
			newObjects = Sprite.createObjects([
				{ sprite: sprites.smallTree, dropRate: dropRates.smallTree },
				{ sprite: sprites.tallTree, dropRate: dropRates.tallTree },
				{ sprite: sprites.jump, dropRate: dropRates.jump },
				{ sprite: sprites.thickSnow, dropRate: dropRates.thickSnow },
				{ sprite: sprites.rock, dropRate: dropRates.rock },
			], {
				rateModifier: Math.max(800 - mainCanvas.width, 0),
				position: function () {
					return dContext.getRandomMapPositionBelowViewport();
				},
				player: player
			});
		}
		if (!game.isPaused()) {
			game.addStaticObjects(newObjects);

			randomlySpawnNPC(spawnBoarder, 0.1);
			distanceTravelledInMetres = parseFloat(player.getPixelsTravelledDownMountain() / pixelsPerMetre).toFixed(1);

			if (distanceTravelledInMetres > monsterDistanceThreshold) {
				randomlySpawnNPC(spawnMonster, 0.001);
			}

			infoBox.setLines([
				'SkiFree.js',
				infoBoxControls,
				'Travelled ' + distanceTravelledInMetres + 'm',
				'Skiers left: ' + livesLeft,
				'High Score: ' + highScore,
				'Created by Dan Hough (@basicallydan)',
				'Current Speed: ' + player.getSpeed()/*,
				'Skier Map Position: ' + player.mapPosition[0].toFixed(1) + ', ' + player.mapPosition[1].toFixed(1),
				'Mouse Map Position: ' + mouseMapPosition[0].toFixed(1) + ', ' + mouseMapPosition[1].toFixed(1)*/
			]);
		}
	});

	game.afterCycle(function() {
		if (livesLeft === 0) {
			detectEnd();
		}
	});

	game.addUIElement(infoBox);
	
	$(mainCanvas)
	.mousemove(function (e) {
		game.setMouseX(e.pageX);
		game.setMouseY(e.pageY);
		player.resetDirection();
		player.startMovingIfPossible();
	})
	.bind('click', function (e) {
		game.setMouseX(e.pageX);
		game.setMouseY(e.pageY);
		player.resetDirection();
		player.startMovingIfPossible();
	})
	.focus(); // So we can listen to events immediately

	Mousetrap.bind('f', player.speedBoost);
	Mousetrap.bind('t', player.attemptTrick);
	Mousetrap.bind(['w', 'up'], function () {
		player.stop();
	});
	Mousetrap.bind(['a', 'left'], function () {
		if (player.direction === 270) {
			player.stepWest();
		} else {
			player.turnWest();
		}
	});
	Mousetrap.bind(['s', 'down'], function () {
		player.setDirection(180);
		player.startMovingIfPossible();
	});
	Mousetrap.bind(['d', 'right'], function () {
		if (player.direction === 90) {
			player.stepEast();
		} else {
			player.turnEast();
		}
	});
	Mousetrap.bind('m', spawnMonster);
	Mousetrap.bind('b', spawnBoarder);
	Mousetrap.bind('space', resetGame);

	var hammertime = Hammer(mainCanvas).on('press', function (e) {
		e.preventDefault();
		game.setMouseX(e.gesture.center.x);
		game.setMouseY(e.gesture.center.y);
	}).on('tap', function (e) {
		game.setMouseX(e.gesture.center.x);
		game.setMouseY(e.gesture.center.y);
	}).on('pan', function (e) {
		game.setMouseX(e.gesture.center.x);
		game.setMouseY(e.gesture.center.y);
		player.resetDirection();
		player.startMovingIfPossible();
	}).on('doubletap', function (e) {
		player.speedBoost();
	});

	player.isMoving = false;
	player.setDirection(270);

	game.start();
}

function resizeCanvas() {
	mainCanvas.width = window.innerWidth;
	mainCanvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas, false);

resizeCanvas();

loadImages(imageSources, startNeverEndingGame);

this.exports = window;

},{"./lib/canvasRenderingContext2DExtensions":2,"./lib/extenders":3,"./lib/game":4,"./lib/infoBox":6,"./lib/isMobileDevice":7,"./lib/monster":8,"./lib/plugins":9,"./lib/skier":10,"./lib/snowboarder":11,"./lib/sprite":12,"./lib/spriteArray":13,"./spriteInfo":15,"br-mousetrap":16,"hammerjs":20}],15:[function(require,module,exports){
(function (global) {
	var sprites = {
		'skier' : {
			$imageFile : 'sprite-characters.png',
			parts : {
				blank : [ 0, 0, 0, 0 ],
				east : [ 0, 0, 24, 34 ],
				esEast : [ 24, 0, 24, 34 ],
				sEast : [ 49, 0, 17, 34 ],
				south : [ 65, 0, 17, 34 ],
				sWest : [ 49, 37, 17, 34 ],
				wsWest : [ 24, 37, 24, 34 ],
				west : [ 0, 37, 24, 34 ],
				hit : [ 0, 78, 31, 31 ],
				jumping : [ 84, 0, 32, 34 ],
				somersault1 : [ 116, 0, 32, 34 ],
				somersault2 : [ 148, 0, 32, 34 ]
			},
			hitBoxes: {
				0: [ 7, 20, 27, 34 ]
			},
			id : 'player',
			hitBehaviour: {}
		},
		'smallTree' : {
			$imageFile : 'skifree-objects.png',
			parts : {
				main : [ 0, 28, 30, 34 ]
			},
			hitBoxes: {
				0: [ 0, 18, 30, 34 ]
			},
			hitBehaviour: {}
		},
		'tallTree' : {
			$imageFile : 'skifree-objects.png',
			parts : {
				main : [ 95, 66, 32, 64 ]
			},
			zIndexesOccupied : [0, 1],
			hitBoxes: {
				0: [0, 54, 32, 64],
				1: [0, 10, 32, 54]
			},
			hitBehaviour: {}
		},
		'thickSnow' : {
			$imageFile : 'skifree-objects.png',
			parts : {
				main : [ 143, 53, 43, 10 ]
			},
			hitBehaviour: {}
		},
		'rock' : {
			$imageFile : 'skifree-objects.png',
			parts : {
				main : [ 30, 52, 23, 11 ]
			},
			hitBehaviour: {}
		},
		'monster' : {
			$imageFile : 'sprite-characters.png',
			parts : {
				sEast1 : [ 64, 112, 26, 43 ],
				sEast2 : [ 90, 112, 32, 43 ],
				sWest1 : [ 64, 158, 26, 43 ],
				sWest2 : [ 90, 158, 32, 43 ],
				eating1 : [ 122, 112, 34, 43 ],
				eating2 : [ 156, 112, 31, 43 ],
				eating3 : [ 187, 112, 31, 43 ],
				eating4 : [ 219, 112, 25, 43 ],
				eating5 : [ 243, 112, 26, 43 ]
			},
			hitBehaviour: {}
		},
		'jump' : {
			$imageFile : 'skifree-objects.png',
			parts : {
				main : [ 109, 55, 32, 8 ]
			},
			hitBehaviour: {}
		},
		'signStart' : {
			$imageFile : 'skifree-objects.png',
			parts : {
				main : [ 260, 103, 42, 27 ]
			},
			hitBehaviour: {}
		},
		'snowboarder' : {
			$imageFile : 'sprite-characters.png',
			parts : {
				sEast : [ 73, 229, 20, 29 ],
				sWest : [ 95, 228, 26, 30 ]
			},
			hitBehaviour: {}
		},
		'emptyChairLift': {
			$imageFile : 'skifree-objects.png',
			parts: {
				main : [ 92, 136, 26, 30 ]
			},
			zIndexesOccupied : [1],
		}
	};

	function monsterHitsTreeBehaviour(monster) {
		monster.deleteOnNextCycle();
	}

	sprites.monster.hitBehaviour.tree = monsterHitsTreeBehaviour;

	function treeHitsMonsterBehaviour(tree, monster) {
		monster.deleteOnNextCycle();
	}

	sprites.smallTree.hitBehaviour.monster = treeHitsMonsterBehaviour;
	sprites.tallTree.hitBehaviour.monster = treeHitsMonsterBehaviour;

	function skierHitsTreeBehaviour(skier, tree) {
		skier.hasHitObstacle(tree);
	}

	function treeHitsSkierBehaviour(tree, skier) {
		skier.hasHitObstacle(tree);
	}

	sprites.smallTree.hitBehaviour.skier = treeHitsSkierBehaviour;
	sprites.tallTree.hitBehaviour.skier = treeHitsSkierBehaviour;

	function rockHitsSkierBehaviour(rock, skier) {
		skier.hasHitObstacle(rock);
	}

	sprites.rock.hitBehaviour.skier = rockHitsSkierBehaviour;

	function skierHitsJumpBehaviour(skier, jump) {
		skier.hasHitJump(jump);
	}

	function jumpHitsSkierBehaviour(jump, skier) {
		skier.hasHitJump(jump);
	}

	sprites.jump.hitBehaviour.skier = jumpHitsSkierBehaviour;

// Really not a fan of this behaviour.
/*	function skierHitsThickSnowBehaviour(skier, thickSnow) {
		// Need to implement this properly
		skier.setSpeed(2);
		setTimeout(function() {
			skier.resetSpeed();
		}, 700);
	}

	function thickSnowHitsSkierBehaviour(thickSnow, skier) {
		// Need to implement this properly
		skier.setSpeed(2);
		setTimeout(function() {
			skier.resetSpeed();
		}, 300);
	}*/

	// sprites.thickSnow.hitBehaviour.skier = thickSnowHitsSkierBehaviour;

	function snowboarderHitsSkierBehaviour(snowboarder, skier) {
		skier.hasHitObstacle(snowboarder);
	}

	sprites.snowboarder.hitBehaviour.skier = snowboarderHitsSkierBehaviour;

	global.spriteInfo = sprites;
})( this );


if (typeof module !== 'undefined') {
	module.exports = this.spriteInfo;
}
},{}],16:[function(require,module,exports){
/**
 * Copyright 2012 Craig Campbell
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Mousetrap is a simple keyboard shortcut library for Javascript with
 * no external dependencies
 *
 * @version 1.1.3
 * @url craig.is/killing/mice
 */
(function() {

    /**
     * mapping of special keycodes to their corresponding keys
     *
     * everything in this dictionary cannot use keypress events
     * so it has to be here to map to the correct keycodes for
     * keyup/keydown events
     *
     * @type {Object}
     */
    var _MAP = {
            8: 'backspace',
            9: 'tab',
            13: 'enter',
            16: 'shift',
            17: 'ctrl',
            18: 'alt',
            20: 'capslock',
            27: 'esc',
            32: 'space',
            33: 'pageup',
            34: 'pagedown',
            35: 'end',
            36: 'home',
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down',
            45: 'ins',
            46: 'del',
            91: 'meta',
            93: 'meta',
            224: 'meta'
        },

        /**
         * mapping for special characters so they can support
         *
         * this dictionary is only used incase you want to bind a
         * keyup or keydown event to one of these keys
         *
         * @type {Object}
         */
        _KEYCODE_MAP = {
            106: '*',
            107: '+',
            109: '-',
            110: '.',
            111 : '/',
            186: ';',
            187: '=',
            188: ',',
            189: '-',
            190: '.',
            191: '/',
            192: '`',
            219: '[',
            220: '\\',
            221: ']',
            222: '\''
        },

        /**
         * this is a mapping of keys that require shift on a US keypad
         * back to the non shift equivelents
         *
         * this is so you can use keyup events with these keys
         *
         * note that this will only work reliably on US keyboards
         *
         * @type {Object}
         */
        _SHIFT_MAP = {
            '~': '`',
            '!': '1',
            '@': '2',
            '#': '3',
            '$': '4',
            '%': '5',
            '^': '6',
            '&': '7',
            '*': '8',
            '(': '9',
            ')': '0',
            '_': '-',
            '+': '=',
            ':': ';',
            '\"': '\'',
            '<': ',',
            '>': '.',
            '?': '/',
            '|': '\\'
        },

        /**
         * this is a list of special strings you can use to map
         * to modifier keys when you specify your keyboard shortcuts
         *
         * @type {Object}
         */
        _SPECIAL_ALIASES = {
            'option': 'alt',
            'command': 'meta',
            'return': 'enter',
            'escape': 'esc'
        },

        /**
         * variable to store the flipped version of _MAP from above
         * needed to check if we should use keypress or not when no action
         * is specified
         *
         * @type {Object|undefined}
         */
        _REVERSE_MAP,

        /**
         * a list of all the callbacks setup via Mousetrap.bind()
         *
         * @type {Object}
         */
        _callbacks = {},

        /**
         * direct map of string combinations to callbacks used for trigger()
         *
         * @type {Object}
         */
        _direct_map = {},

        /**
         * keeps track of what level each sequence is at since multiple
         * sequences can start out with the same sequence
         *
         * @type {Object}
         */
        _sequence_levels = {},

        /**
         * variable to store the setTimeout call
         *
         * @type {null|number}
         */
        _reset_timer,

        /**
         * temporary state where we will ignore the next keyup
         *
         * @type {boolean|string}
         */
        _ignore_next_keyup = false,

        /**
         * are we currently inside of a sequence?
         * type of action ("keyup" or "keydown" or "keypress") or false
         *
         * @type {boolean|string}
         */
        _inside_sequence = false;

    /**
     * loop through the f keys, f1 to f19 and add them to the map
     * programatically
     */
    for (var i = 1; i < 20; ++i) {
        _MAP[111 + i] = 'f' + i;
    }

    /**
     * loop through to map numbers on the numeric keypad
     */
    for (i = 0; i <= 9; ++i) {
        _MAP[i + 96] = i;
    }

    /**
     * cross browser add event method
     *
     * @param {Element|HTMLDocument} object
     * @param {string} type
     * @param {Function} callback
     * @returns void
     */
    function _addEvent(object, type, callback) {
        if (object.addEventListener) {
            object.addEventListener(type, callback, false);
            return;
        }

        object.attachEvent('on' + type, callback);
    }

    /**
     * takes the event and returns the key character
     *
     * @param {Event} e
     * @return {string}
     */
    function _characterFromEvent(e) {

        // for keypress events we should return the character as is
        if (e.type == 'keypress') {
            return String.fromCharCode(e.which);
        }

        // for non keypress events the special maps are needed
        if (_MAP[e.which]) {
            return _MAP[e.which];
        }

        if (_KEYCODE_MAP[e.which]) {
            return _KEYCODE_MAP[e.which];
        }

        // if it is not in the special map
        return String.fromCharCode(e.which).toLowerCase();
    }

    /**
     * checks if two arrays are equal
     *
     * @param {Array} modifiers1
     * @param {Array} modifiers2
     * @returns {boolean}
     */
    function _modifiersMatch(modifiers1, modifiers2) {
        return modifiers1.sort().join(',') === modifiers2.sort().join(',');
    }

    /**
     * resets all sequence counters except for the ones passed in
     *
     * @param {Object} do_not_reset
     * @returns void
     */
    function _resetSequences(do_not_reset) {
        do_not_reset = do_not_reset || {};

        var active_sequences = false,
            key;

        for (key in _sequence_levels) {
            if (do_not_reset[key]) {
                active_sequences = true;
                continue;
            }
            _sequence_levels[key] = 0;
        }

        if (!active_sequences) {
            _inside_sequence = false;
        }
    }

    /**
     * finds all callbacks that match based on the keycode, modifiers,
     * and action
     *
     * @param {string} character
     * @param {Array} modifiers
     * @param {Event|Object} e
     * @param {boolean=} remove - should we remove any matches
     * @param {string=} combination
     * @returns {Array}
     */
    function _getMatches(character, modifiers, e, remove, combination) {
        var i,
            callback,
            matches = [],
            action = e.type;

        // if there are no events related to this keycode
        if (!_callbacks[character]) {
            return [];
        }

        // if a modifier key is coming up on its own we should allow it
        if (action == 'keyup' && _isModifier(character)) {
            modifiers = [character];
        }

        // loop through all callbacks for the key that was pressed
        // and see if any of them match
        for (i = 0; i < _callbacks[character].length; ++i) {
            callback = _callbacks[character][i];

            // if this is a sequence but it is not at the right level
            // then move onto the next match
            if (callback.seq && _sequence_levels[callback.seq] != callback.level) {
                continue;
            }

            // if the action we are looking for doesn't match the action we got
            // then we should keep going
            if (action != callback.action) {
                continue;
            }

            // if this is a keypress event and the meta key and control key
            // are not pressed that means that we need to only look at the
            // character, otherwise check the modifiers as well
            //
            // chrome will not fire a keypress if meta or control is down
            // safari will fire a keypress if meta or meta+shift is down
            // firefox will fire a keypress if meta or control is down
            if ((action == 'keypress' && !e.metaKey && !e.ctrlKey) || _modifiersMatch(modifiers, callback.modifiers)) {

                // remove is used so if you change your mind and call bind a
                // second time with a new function the first one is overwritten
                if (remove && callback.combo == combination) {
                    _callbacks[character].splice(i, 1);
                }

                matches.push(callback);
            }
        }

        return matches;
    }

    /**
     * takes a key event and figures out what the modifiers are
     *
     * @param {Event} e
     * @returns {Array}
     */
    function _eventModifiers(e) {
        var modifiers = [];

        if (e.shiftKey) {
            modifiers.push('shift');
        }

        if (e.altKey) {
            modifiers.push('alt');
        }

        if (e.ctrlKey) {
            modifiers.push('ctrl');
        }

        if (e.metaKey) {
            modifiers.push('meta');
        }

        return modifiers;
    }

    /**
     * actually calls the callback function
     *
     * if your callback function returns false this will use the jquery
     * convention - prevent default and stop propogation on the event
     *
     * @param {Function} callback
     * @param {Event} e
     * @returns void
     */
    function _fireCallback(callback, e) {
        if (callback(e) === false) {
            if (e.preventDefault) {
                e.preventDefault();
            }

            if (e.stopPropagation) {
                e.stopPropagation();
            }

            e.returnValue = false;
            e.cancelBubble = true;
        }
    }

    /**
     * handles a character key event
     *
     * @param {string} character
     * @param {Event} e
     * @returns void
     */
    function _handleCharacter(character, e) {

        // if this event should not happen stop here
        if (Mousetrap.stopCallback(e, e.target || e.srcElement)) {
            return;
        }

        var callbacks = _getMatches(character, _eventModifiers(e), e),
            i,
            do_not_reset = {},
            processed_sequence_callback = false;

        // loop through matching callbacks for this key event
        for (i = 0; i < callbacks.length; ++i) {

            // fire for all sequence callbacks
            // this is because if for example you have multiple sequences
            // bound such as "g i" and "g t" they both need to fire the
            // callback for matching g cause otherwise you can only ever
            // match the first one
            if (callbacks[i].seq) {
                processed_sequence_callback = true;

                // keep a list of which sequences were matches for later
                do_not_reset[callbacks[i].seq] = 1;
                _fireCallback(callbacks[i].callback, e);
                continue;
            }

            // if there were no sequence matches but we are still here
            // that means this is a regular match so we should fire that
            if (!processed_sequence_callback && !_inside_sequence) {
                _fireCallback(callbacks[i].callback, e);
            }
        }

        // if you are inside of a sequence and the key you are pressing
        // is not a modifier key then we should reset all sequences
        // that were not matched by this key event
        if (e.type == _inside_sequence && !_isModifier(character)) {
            _resetSequences(do_not_reset);
        }
    }

    /**
     * handles a keydown event
     *
     * @param {Event} e
     * @returns void
     */
    function _handleKey(e) {

        // normalize e.which for key events
        // @see http://stackoverflow.com/questions/4285627/javascript-keycode-vs-charcode-utter-confusion
        e.which = typeof e.which == "number" ? e.which : e.keyCode;

        var character = _characterFromEvent(e);

        // no character found then stop
        if (!character) {
            return;
        }

        if (e.type == 'keyup' && _ignore_next_keyup == character) {
            _ignore_next_keyup = false;
            return;
        }

        _handleCharacter(character, e);
    }

    /**
     * determines if the keycode specified is a modifier key or not
     *
     * @param {string} key
     * @returns {boolean}
     */
    function _isModifier(key) {
        return key == 'shift' || key == 'ctrl' || key == 'alt' || key == 'meta';
    }

    /**
     * called to set a 1 second timeout on the specified sequence
     *
     * this is so after each key press in the sequence you have 1 second
     * to press the next key before you have to start over
     *
     * @returns void
     */
    function _resetSequenceTimer() {
        clearTimeout(_reset_timer);
        _reset_timer = setTimeout(_resetSequences, 1000);
    }

    /**
     * reverses the map lookup so that we can look for specific keys
     * to see what can and can't use keypress
     *
     * @return {Object}
     */
    function _getReverseMap() {
        if (!_REVERSE_MAP) {
            _REVERSE_MAP = {};
            for (var key in _MAP) {

                // pull out the numeric keypad from here cause keypress should
                // be able to detect the keys from the character
                if (key > 95 && key < 112) {
                    continue;
                }

                if (_MAP.hasOwnProperty(key)) {
                    _REVERSE_MAP[_MAP[key]] = key;
                }
            }
        }
        return _REVERSE_MAP;
    }

    /**
     * picks the best action based on the key combination
     *
     * @param {string} key - character for key
     * @param {Array} modifiers
     * @param {string=} action passed in
     */
    function _pickBestAction(key, modifiers, action) {

        // if no action was picked in we should try to pick the one
        // that we think would work best for this key
        if (!action) {
            action = _getReverseMap()[key] ? 'keydown' : 'keypress';
        }

        // modifier keys don't work as expected with keypress,
        // switch to keydown
        if (action == 'keypress' && modifiers.length) {
            action = 'keydown';
        }

        return action;
    }

    /**
     * binds a key sequence to an event
     *
     * @param {string} combo - combo specified in bind call
     * @param {Array} keys
     * @param {Function} callback
     * @param {string=} action
     * @returns void
     */
    function _bindSequence(combo, keys, callback, action) {

        // start off by adding a sequence level record for this combination
        // and setting the level to 0
        _sequence_levels[combo] = 0;

        // if there is no action pick the best one for the first key
        // in the sequence
        if (!action) {
            action = _pickBestAction(keys[0], []);
        }

        /**
         * callback to increase the sequence level for this sequence and reset
         * all other sequences that were active
         *
         * @param {Event} e
         * @returns void
         */
        var _increaseSequence = function(e) {
                _inside_sequence = action;
                ++_sequence_levels[combo];
                _resetSequenceTimer();
            },

            /**
             * wraps the specified callback inside of another function in order
             * to reset all sequence counters as soon as this sequence is done
             *
             * @param {Event} e
             * @returns void
             */
            _callbackAndReset = function(e) {
                _fireCallback(callback, e);

                // we should ignore the next key up if the action is key down
                // or keypress.  this is so if you finish a sequence and
                // release the key the final key will not trigger a keyup
                if (action !== 'keyup') {
                    _ignore_next_keyup = _characterFromEvent(e);
                }

                // weird race condition if a sequence ends with the key
                // another sequence begins with
                setTimeout(_resetSequences, 10);
            },
            i;

        // loop through keys one at a time and bind the appropriate callback
        // function.  for any key leading up to the final one it should
        // increase the sequence. after the final, it should reset all sequences
        for (i = 0; i < keys.length; ++i) {
            _bindSingle(keys[i], i < keys.length - 1 ? _increaseSequence : _callbackAndReset, action, combo, i);
        }
    }

    /**
     * binds a single keyboard combination
     *
     * @param {string} combination
     * @param {Function} callback
     * @param {string=} action
     * @param {string=} sequence_name - name of sequence if part of sequence
     * @param {number=} level - what part of the sequence the command is
     * @returns void
     */
    function _bindSingle(combination, callback, action, sequence_name, level) {

        // make sure multiple spaces in a row become a single space
        combination = combination.replace(/\s+/g, ' ');

        var sequence = combination.split(' '),
            i,
            key,
            keys,
            modifiers = [];

        // if this pattern is a sequence of keys then run through this method
        // to reprocess each pattern one key at a time
        if (sequence.length > 1) {
            _bindSequence(combination, sequence, callback, action);
            return;
        }

        // take the keys from this pattern and figure out what the actual
        // pattern is all about
        keys = combination === '+' ? ['+'] : combination.split('+');

        for (i = 0; i < keys.length; ++i) {
            key = keys[i];

            // normalize key names
            if (_SPECIAL_ALIASES[key]) {
                key = _SPECIAL_ALIASES[key];
            }

            // if this is not a keypress event then we should
            // be smart about using shift keys
            // this will only work for US keyboards however
            if (action && action != 'keypress' && _SHIFT_MAP[key]) {
                key = _SHIFT_MAP[key];
                modifiers.push('shift');
            }

            // if this key is a modifier then add it to the list of modifiers
            if (_isModifier(key)) {
                modifiers.push(key);
            }
        }

        // depending on what the key combination is
        // we will try to pick the best event for it
        action = _pickBestAction(key, modifiers, action);

        // make sure to initialize array if this is the first time
        // a callback is added for this key
        if (!_callbacks[key]) {
            _callbacks[key] = [];
        }

        // remove an existing match if there is one
        _getMatches(key, modifiers, {type: action}, !sequence_name, combination);

        // add this call back to the array
        // if it is a sequence put it at the beginning
        // if not put it at the end
        //
        // this is important because the way these are processed expects
        // the sequence ones to come first
        _callbacks[key][sequence_name ? 'unshift' : 'push']({
            callback: callback,
            modifiers: modifiers,
            action: action,
            seq: sequence_name,
            level: level,
            combo: combination
        });
    }

    /**
     * binds multiple combinations to the same callback
     *
     * @param {Array} combinations
     * @param {Function} callback
     * @param {string|undefined} action
     * @returns void
     */
    function _bindMultiple(combinations, callback, action) {
        for (var i = 0; i < combinations.length; ++i) {
            _bindSingle(combinations[i], callback, action);
        }
    }

    // start!
    _addEvent(document, 'keypress', _handleKey);
    _addEvent(document, 'keydown', _handleKey);
    _addEvent(document, 'keyup', _handleKey);

    var Mousetrap = {

        /**
         * binds an event to mousetrap
         *
         * can be a single key, a combination of keys separated with +,
         * an array of keys, or a sequence of keys separated by spaces
         *
         * be sure to list the modifier keys first to make sure that the
         * correct key ends up getting bound (the last key in the pattern)
         *
         * @param {string|Array} keys
         * @param {Function} callback
         * @param {string=} action - 'keypress', 'keydown', or 'keyup'
         * @returns void
         */
        bind: function(keys, callback, action) {
            _bindMultiple(keys instanceof Array ? keys : [keys], callback, action);
            _direct_map[keys + ':' + action] = callback;
            return this;
        },

        /**
         * unbinds an event to mousetrap
         *
         * the unbinding sets the callback function of the specified key combo
         * to an empty function and deletes the corresponding key in the
         * _direct_map dict.
         *
         * the keycombo+action has to be exactly the same as
         * it was defined in the bind method
         *
         * TODO: actually remove this from the _callbacks dictionary instead
         * of binding an empty function
         *
         * @param {string|Array} keys
         * @param {string} action
         * @returns void
         */
        unbind: function(keys, action) {
            if (_direct_map[keys + ':' + action]) {
                delete _direct_map[keys + ':' + action];
                this.bind(keys, function() {}, action);
            }
            return this;
        },

        /**
         * triggers an event that has already been bound
         *
         * @param {string} keys
         * @param {string=} action
         * @returns void
         */
        trigger: function(keys, action) {
            _direct_map[keys + ':' + action]();
            return this;
        },

        /**
         * resets the library back to its initial state.  this is useful
         * if you want to clear out the current keyboard shortcuts and bind
         * new ones - for example if you switch to another page
         *
         * @returns void
         */
        reset: function() {
            _callbacks = {};
            _direct_map = {};
            return this;
        },

       /**
        * should we stop this event before firing off callbacks
        *
        * @param {Event} e
        * @param {Element} element
        * @return {boolean}
        */
        stopCallback: function(e, element) {

            // if the element has the class "mousetrap" then no need to stop
            if ((' ' + element.className + ' ').indexOf(' mousetrap ') > -1) {
                return false;
            }

            // stop for input, select, and textarea
            return element.tagName == 'INPUT' || element.tagName == 'SELECT' || element.tagName == 'TEXTAREA' || (element.contentEditable && element.contentEditable == 'true');
        }
    };

    // expose mousetrap to the global object
    window.Mousetrap = Mousetrap;

    // expose mousetrap as an AMD module
    if (typeof define == 'function' && define.amd) {
        define('mousetrap', function() { return Mousetrap; });
    }
    // browserify support
    if(typeof module === 'object' && module.exports) {
        module.exports = Mousetrap;
    }
}) ();

},{}],17:[function(require,module,exports){
(function (global){
(function() {
    var root = this;
    var EventEmitter = require('events').EventEmitter;
	var _ = require('underscore');
	var intervalParser = /([0-9\.]+)(ms|s|m|h)?/;
	var root = global || window;

	// Lil bit of useful polyfill...
	if (typeof(Function.prototype.inherits) === 'undefined') {
		Function.prototype.inherits = function(parent) {
			this.prototype = Object.create(parent.prototype);
		};
	}

	if (typeof(Array.prototype.removeOne) === 'undefined') {
		Array.prototype.removeOne = function() {
			var what, a = arguments, L = a.length, ax;
			while (L && this.length) {
				what = a[--L];
				while ((ax = this.indexOf(what)) !== -1) {
					return this.splice(ax, 1);
				}
			}
		};
	}

	function greatestCommonFactor(intervals) {
		var sumOfModuli = 1;
		var interval = _.min(intervals);
		while (sumOfModuli !== 0) {
			sumOfModuli = _.reduce(intervals, function(memo, i){ return memo + (i % interval); }, 0);
			if (sumOfModuli !== 0) {
				interval -= 10;
			}
		}
		return interval;
	}

	function parseEvent(e) {
		var intervalGroups = intervalParser.exec(e);
		if (!intervalGroups) {
			throw new Error('I don\'t understand that particular interval');
		}
		var intervalAmount = +intervalGroups[1];
		var intervalType = intervalGroups[2] || 'ms';
		if (intervalType === 's') {
			intervalAmount = intervalAmount * 1000;
		} else if (intervalType === 'm') {
			intervalAmount = intervalAmount * 1000 * 60;
		} else if (intervalType === 'h') {
			intervalAmount = intervalAmount * 1000 * 60 * 60;
		} else if (!!intervalType && intervalType !== 'ms') {
			throw new Error('You can only specify intervals of ms, s, m, or h');
		}
		if (intervalAmount < 10 || intervalAmount % 10 !== 0) {
			// We only deal in 10's of milliseconds for simplicity
			throw new Error('You can only specify 10s of milliseconds, trust me on this one');
		}
		return {
			amount:intervalAmount,
			type:intervalType
		};
	}

	function EventedLoop() {
		this.intervalId = undefined;
		this.intervalLength = undefined;
		this.intervalsToEmit = {};
		this.currentTick = 1;
		this.maxTicks = 0;
		this.listeningForFocus = false;

		// Private method
		var determineIntervalLength = function () {
			var potentialIntervalLength = greatestCommonFactor(_.keys(this.intervalsToEmit));
			var changed = false;

			if (this.intervalLength) {
				if (potentialIntervalLength !== this.intervalLength) {
					// Looks like we need a new interval
					this.intervalLength = potentialIntervalLength;
					changed = true;
				}
			} else {
				this.intervalLength = potentialIntervalLength;
			}

			this.maxTicks = _.max(_.map(_.keys(this.intervalsToEmit), function(a) { return +a; })) / this.intervalLength;
			return changed;
		}.bind(this);

		this.on('newListener', function (e) {
			if (e === 'removeListener' || e === 'newListener') return; // We don't care about that one
			var intervalInfo = parseEvent(e);
			var intervalAmount = intervalInfo.amount;

			this.intervalsToEmit[+intervalAmount] = _.union(this.intervalsToEmit[+intervalAmount] || [], [e]);
			
			if (determineIntervalLength() && this.isStarted()) {
				this.stop().start();
			}
		});

		this.on('removeListener', function (e) {
			if (EventEmitter.listenerCount(this, e) > 0) return;
			var intervalInfo = parseEvent(e);
			var intervalAmount = intervalInfo.amount;

			var removedEvent = this.intervalsToEmit[+intervalAmount].removeOne(e);
			if (this.intervalsToEmit[+intervalAmount].length === 0) {
				delete this.intervalsToEmit[+intervalAmount];
			}
			console.log('Determining interval length after removal of', removedEvent);
			determineIntervalLength();

			if (determineIntervalLength() && this.isStarted()) {
				this.stop().start();
			}
		});
	}

	EventedLoop.inherits(EventEmitter);

	// Public methods
	EventedLoop.prototype.tick = function () {
		var milliseconds = this.currentTick * this.intervalLength;
		_.each(this.intervalsToEmit, function (events, key) {
			if (milliseconds % key === 0) {
				_.each(events, function(e) { this.emit(e, e, key); }.bind(this));
			}
		}.bind(this));
		this.currentTick += 1;
		if (this.currentTick > this.maxTicks) {
			this.currentTick = 1;
		}
		return this;
	};

	EventedLoop.prototype.start = function () {
		if (!this.intervalLength) {
			throw new Error('You haven\'t specified any interval callbacks. Use EventedLoop.on(\'500ms\', function () { ... }) to do so, and then you can start');
		}
		if (this.intervalId) {
			return console.log('No need to start the loop again, it\'s already started.');
		}

		this.intervalId = setInterval(this.tick.bind(this), this.intervalLength);

		if (root && !this.listeningForFocus && root.addEventListener) {
			root.addEventListener('focus', function() {
				this.start();
			}.bind(this));

			root.addEventListener('blur', function() {
				this.stop();
			}.bind(this));

			this.listeningForFocus = true;
		}
		return this;
	};

	EventedLoop.prototype.stop = function () {
		clearInterval(this.intervalId);
		this.intervalId = undefined;
		return this;
	};

	EventedLoop.prototype.isStarted = function () {
		return !!this.intervalId;
	};

	EventedLoop.prototype.every = EventedLoop.prototype.on;

    // Export the EventedLoop object for **Node.js** or other
    // commonjs systems. Otherwise, add it as a global object to the root
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = EventedLoop;
        }
        exports.EventedLoop = EventedLoop;
    }
    if (typeof window !== 'undefined') {
        window.EventedLoop = EventedLoop;
    }
}).call(this);
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"events":19,"underscore":18}],18:[function(require,module,exports){
//     Underscore.js 1.6.0
//     http://underscorejs.org
//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.6.0';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return obj;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
      }
    }
    return obj;
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var result;
    any(obj, function(value, index, list) {
      if (predicate.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(predicate, context);
    each(obj, function(value, index, list) {
      if (predicate.call(context, value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, function(value, index, list) {
      return !predicate.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate || (predicate = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(predicate, context);
    each(obj, function(value, index, list) {
      if (!(result = result && predicate.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, predicate, context) {
    predicate || (predicate = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(predicate, context);
    each(obj, function(value, index, list) {
      if (result || (result = predicate.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matches(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matches(attrs));
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    var result = -Infinity, lastComputed = -Infinity;
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      if (computed > lastComputed) {
        result = value;
        lastComputed = computed;
      }
    });
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    var result = Infinity, lastComputed = Infinity;
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      if (computed < lastComputed) {
        result = value;
        lastComputed = computed;
      }
    });
    return result;
  };

  // Shuffle an array, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (obj.length !== +obj.length) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return value;
    return _.property(value);
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, iterator, context) {
    iterator = lookupIterator(iterator);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iterator, context) {
      var result = {};
      iterator = lookupIterator(iterator);
      each(obj, function(value, index) {
        var key = iterator.call(context, value, index, obj);
        behavior(result, key, value);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, key, value) {
    _.has(result, key) ? result[key].push(value) : result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, key, value) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, key) {
    _.has(result, key) ? result[key]++ : result[key] = 1;
  });

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) return array[0];
    if (n < 0) return [];
    return slice.call(array, 0, n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) return array[array.length - 1];
    return slice.call(array, Math.max(array.length - n, 0));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    each(input, function(value) {
      if (_.isArray(value) || _.isArguments(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Split an array into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(array, predicate) {
    var pass = [], fail = [];
    each(array, function(elem) {
      (predicate(elem) ? pass : fail).push(elem);
    });
    return [pass, fail];
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.contains(other, item);
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var length = _.max(_.pluck(arguments, 'length').concat(0));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, '' + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, length = list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, length = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(length);

    while(idx < length) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    return function() {
      var position = 0;
      var args = boundArgs.slice();
      for (var i = 0, length = args.length; i < length; i++) {
        if (args[i] === _) args[i] = arguments[position++];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return func.apply(this, args);
    };
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) throw new Error('bindAll must be passed function names');
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
        context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;
      if (last < wait) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = new Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = new Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                             _.isFunction(bCtor) && (bCtor instanceof bCtor))
                        && ('constructor' in a && 'constructor' in b)) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  _.constant = function(value) {
    return function () {
      return value;
    };
  };

  _.property = function(key) {
    return function(obj) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of `key:value` pairs.
  _.matches = function(attrs) {
    return function(obj) {
      if (obj === attrs) return true; //avoid comparing an object to itself.
      for (var key in attrs) {
        if (attrs[key] !== obj[key])
          return false;
      }
      return true;
    }
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(Math.max(0, n));
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() { return new Date().getTime(); };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}).call(this);

},{}],19:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var objectCreate = Object.create || objectCreatePolyfill
var objectKeys = Object.keys || objectKeysPolyfill
var bind = Function.prototype.bind || functionBindPolyfill

function EventEmitter() {
  if (!this._events || !Object.prototype.hasOwnProperty.call(this, '_events')) {
    this._events = objectCreate(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

var hasDefineProperty;
try {
  var o = {};
  if (Object.defineProperty) Object.defineProperty(o, 'x', { value: 0 });
  hasDefineProperty = o.x === 0;
} catch (err) { hasDefineProperty = false }
if (hasDefineProperty) {
  Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
    enumerable: true,
    get: function() {
      return defaultMaxListeners;
    },
    set: function(arg) {
      // check whether the input is a positive number (whose value is zero or
      // greater and not a NaN).
      if (typeof arg !== 'number' || arg < 0 || arg !== arg)
        throw new TypeError('"defaultMaxListeners" must be a positive number');
      defaultMaxListeners = arg;
    }
  });
} else {
  EventEmitter.defaultMaxListeners = defaultMaxListeners;
}

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || isNaN(n))
    throw new TypeError('"n" argument must be a positive number');
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

// These standalone emit* functions are used to optimize calling of event
// handlers for fast cases because emit() itself often has a variable number of
// arguments and can be deoptimized because of that. These functions always have
// the same number of arguments and thus do not get deoptimized, so the code
// inside them can execute faster.
function emitNone(handler, isFn, self) {
  if (isFn)
    handler.call(self);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self);
  }
}
function emitOne(handler, isFn, self, arg1) {
  if (isFn)
    handler.call(self, arg1);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1);
  }
}
function emitTwo(handler, isFn, self, arg1, arg2) {
  if (isFn)
    handler.call(self, arg1, arg2);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2);
  }
}
function emitThree(handler, isFn, self, arg1, arg2, arg3) {
  if (isFn)
    handler.call(self, arg1, arg2, arg3);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2, arg3);
  }
}

function emitMany(handler, isFn, self, args) {
  if (isFn)
    handler.apply(self, args);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].apply(self, args);
  }
}

EventEmitter.prototype.emit = function emit(type) {
  var er, handler, len, args, i, events;
  var doError = (type === 'error');

  events = this._events;
  if (events)
    doError = (doError && events.error == null);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    if (arguments.length > 1)
      er = arguments[1];
    if (er instanceof Error) {
      throw er; // Unhandled 'error' event
    } else {
      // At least give some kind of context to the user
      var err = new Error('Unhandled "error" event. (' + er + ')');
      err.context = er;
      throw err;
    }
    return false;
  }

  handler = events[type];

  if (!handler)
    return false;

  var isFn = typeof handler === 'function';
  len = arguments.length;
  switch (len) {
      // fast cases
    case 1:
      emitNone(handler, isFn, this);
      break;
    case 2:
      emitOne(handler, isFn, this, arguments[1]);
      break;
    case 3:
      emitTwo(handler, isFn, this, arguments[1], arguments[2]);
      break;
    case 4:
      emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
      break;
      // slower
    default:
      args = new Array(len - 1);
      for (i = 1; i < len; i++)
        args[i - 1] = arguments[i];
      emitMany(handler, isFn, this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');

  events = target._events;
  if (!events) {
    events = target._events = objectCreate(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener) {
      target.emit('newListener', type,
          listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (!existing) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
          prepend ? [listener, existing] : [existing, listener];
    } else {
      // If we've already got an array, just append.
      if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
    }

    // Check for listener leak
    if (!existing.warned) {
      m = $getMaxListeners(target);
      if (m && m > 0 && existing.length > m) {
        existing.warned = true;
        var w = new Error('Possible EventEmitter memory leak detected. ' +
            existing.length + ' "' + String(type) + '" listeners ' +
            'added. Use emitter.setMaxListeners() to ' +
            'increase limit.');
        w.name = 'MaxListenersExceededWarning';
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        if (typeof console === 'object' && console.warn) {
          console.warn('%s: %s', w.name, w.message);
        }
      }
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    switch (arguments.length) {
      case 0:
        return this.listener.call(this.target);
      case 1:
        return this.listener.call(this.target, arguments[0]);
      case 2:
        return this.listener.call(this.target, arguments[0], arguments[1]);
      case 3:
        return this.listener.call(this.target, arguments[0], arguments[1],
            arguments[2]);
      default:
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; ++i)
          args[i] = arguments[i];
        this.listener.apply(this.target, args);
    }
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = bind.call(onceWrapper, state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');

      events = this._events;
      if (!events)
        return this;

      list = events[type];
      if (!list)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = objectCreate(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else
          spliceOne(list, position);

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (!events)
        return this;

      // not listening for removeListener, no need to emit
      if (!events.removeListener) {
        if (arguments.length === 0) {
          this._events = objectCreate(null);
          this._eventsCount = 0;
        } else if (events[type]) {
          if (--this._eventsCount === 0)
            this._events = objectCreate(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = objectKeys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = objectCreate(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (!events)
    return [];

  var evlistener = events[type];
  if (!evlistener)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
};

// About 1.5x faster than the two-arg version of Array#splice().
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
    list[i] = list[k];
  list.pop();
}

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function objectCreatePolyfill(proto) {
  var F = function() {};
  F.prototype = proto;
  return new F;
}
function objectKeysPolyfill(obj) {
  var keys = [];
  for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k)) {
    keys.push(k);
  }
  return k;
}
function functionBindPolyfill(context) {
  var fn = this;
  return function () {
    return fn.apply(context, arguments);
  };
}

},{}],20:[function(require,module,exports){
/*! Hammer.JS - v1.0.7dev - 2014-02-18
 * http://eightmedia.github.com/hammer.js
 *
 * Copyright (c) 2014 Jorik Tangelder <j.tangelder@gmail.com>;
 * Licensed under the MIT license */

(function(window, undefined) {
  'use strict';

/**
 * Hammer
 * use this to create instances
 * @param   {HTMLElement}   element
 * @param   {Object}        options
 * @returns {Hammer.Instance}
 * @constructor
 */
var Hammer = function(element, options) {
  return new Hammer.Instance(element, options || {});
};

// default settings
Hammer.defaults = {
  // add styles and attributes to the element to prevent the browser from doing
  // its native behavior. this doesnt prevent the scrolling, but cancels
  // the contextmenu, tap highlighting etc
  // set to false to disable this
  stop_browser_behavior: {
    // this also triggers onselectstart=false for IE
    userSelect       : 'none',
    // this makes the element blocking in IE10 >, you could experiment with the value
    // see for more options this issue; https://github.com/EightMedia/hammer.js/issues/241
    touchAction      : 'none',
    touchCallout     : 'none',
    contentZooming   : 'none',
    userDrag         : 'none',
    tapHighlightColor: 'rgba(0,0,0,0)'
  }

  //
  // more settings are defined per gesture at gestures.js
  //
};

// detect touchevents
Hammer.HAS_POINTEREVENTS = window.navigator.pointerEnabled || window.navigator.msPointerEnabled;
Hammer.HAS_TOUCHEVENTS = ('ontouchstart' in window);

// dont use mouseevents on mobile devices
Hammer.MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android|silk/i;
Hammer.NO_MOUSEEVENTS = Hammer.HAS_TOUCHEVENTS && window.navigator.userAgent.match(Hammer.MOBILE_REGEX);

// eventtypes per touchevent (start, move, end)
// are filled by Hammer.event.determineEventTypes on setup
Hammer.EVENT_TYPES = {};

// direction defines
Hammer.DIRECTION_DOWN = 'down';
Hammer.DIRECTION_LEFT = 'left';
Hammer.DIRECTION_UP = 'up';
Hammer.DIRECTION_RIGHT = 'right';

// pointer type
Hammer.POINTER_MOUSE = 'mouse';
Hammer.POINTER_TOUCH = 'touch';
Hammer.POINTER_PEN = 'pen';

// interval in which Hammer recalculates current velocity in ms
Hammer.UPDATE_VELOCITY_INTERVAL = 20;

// touch event defines
Hammer.EVENT_START = 'start';
Hammer.EVENT_MOVE = 'move';
Hammer.EVENT_END = 'end';

// hammer document where the base events are added at
Hammer.DOCUMENT = window.document;

// plugins and gestures namespaces
Hammer.plugins = Hammer.plugins || {};
Hammer.gestures = Hammer.gestures || {};


// if the window events are set...
Hammer.READY = false;

/**
 * setup events to detect gestures on the document
 */
function setup() {
  if(Hammer.READY) {
    return;
  }

  // find what eventtypes we add listeners to
  Hammer.event.determineEventTypes();

  // Register all gestures inside Hammer.gestures
  Hammer.utils.each(Hammer.gestures, function(gesture){
    Hammer.detection.register(gesture);
  });

  // Add touch events on the document
  Hammer.event.onTouch(Hammer.DOCUMENT, Hammer.EVENT_MOVE, Hammer.detection.detect);
  Hammer.event.onTouch(Hammer.DOCUMENT, Hammer.EVENT_END, Hammer.detection.detect);

  // Hammer is ready...!
  Hammer.READY = true;
}

Hammer.utils = {
  /**
   * extend method,
   * also used for cloning when dest is an empty object
   * @param   {Object}    dest
   * @param   {Object}    src
   * @parm  {Boolean}  merge    do a merge
   * @returns {Object}    dest
   */
  extend: function extend(dest, src, merge) {
    for(var key in src) {
      if(dest[key] !== undefined && merge) {
        continue;
      }
      dest[key] = src[key];
    }
    return dest;
  },


  /**
   * for each
   * @param obj
   * @param iterator
   */
  each: function(obj, iterator, context) {
    var i, length;
    // native forEach on arrays
    if ('forEach' in obj) {
      obj.forEach(iterator, context);
    }
    // arrays
    else if(obj.length !== undefined) {
      for (i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === false) {
          return;
        }
      }
    }
    // objects
    else {
      for (i in obj) {
        if (obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj) === false) {
          return;
        }
      }
    }
  },

  /**
   * find if a node is in the given parent
   * used for event delegation tricks
   * @param   {HTMLElement}   node
   * @param   {HTMLElement}   parent
   * @returns {boolean}       has_parent
   */
  hasParent: function(node, parent) {
    while(node) {
      if(node == parent) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  },


  /**
   * get the center of all the touches
   * @param   {Array}     touches
   * @returns {Object}    center
   */
  getCenter: function getCenter(touches) {
    var valuesX = [], valuesY = [];

    Hammer.utils.each(touches, function(touch) {
      // I prefer clientX because it ignore the scrolling position
      valuesX.push(typeof touch.clientX !== 'undefined' ? touch.clientX : touch.pageX );
      valuesY.push(typeof touch.clientY !== 'undefined' ? touch.clientY : touch.pageY );
    });

    return {
      pageX: ((Math.min.apply(Math, valuesX) + Math.max.apply(Math, valuesX)) / 2),
      pageY: ((Math.min.apply(Math, valuesY) + Math.max.apply(Math, valuesY)) / 2)
    };
  },


  /**
   * calculate the velocity between two points
   * @param   {Number}    delta_time
   * @param   {Number}    delta_x
   * @param   {Number}    delta_y
   * @returns {Object}    velocity
   */
  getVelocity: function getVelocity(delta_time, delta_x, delta_y) {
    return {
      x: Math.abs(delta_x / delta_time) || 0,
      y: Math.abs(delta_y / delta_time) || 0
    };
  },


  /**
   * calculate the angle between two coordinates
   * @param   {Touch}     touch1
   * @param   {Touch}     touch2
   * @returns {Number}    angle
   */
  getAngle: function getAngle(touch1, touch2) {
    var y = touch2.pageY - touch1.pageY,
      x = touch2.pageX - touch1.pageX;
    return Math.atan2(y, x) * 180 / Math.PI;
  },


  /**
   * angle to direction define
   * @param   {Touch}     touch1
   * @param   {Touch}     touch2
   * @returns {String}    direction constant, like Hammer.DIRECTION_LEFT
   */
  getDirection: function getDirection(touch1, touch2) {
    var x = Math.abs(touch1.pageX - touch2.pageX),
      y = Math.abs(touch1.pageY - touch2.pageY);

    if(x >= y) {
      return touch1.pageX - touch2.pageX > 0 ? Hammer.DIRECTION_LEFT : Hammer.DIRECTION_RIGHT;
    }
    else {
      return touch1.pageY - touch2.pageY > 0 ? Hammer.DIRECTION_UP : Hammer.DIRECTION_DOWN;
    }
  },


  /**
   * calculate the distance between two touches
   * @param   {Touch}     touch1
   * @param   {Touch}     touch2
   * @returns {Number}    distance
   */
  getDistance: function getDistance(touch1, touch2) {
    var x = touch2.pageX - touch1.pageX,
      y = touch2.pageY - touch1.pageY;
    return Math.sqrt((x * x) + (y * y));
  },


  /**
   * calculate the scale factor between two touchLists (fingers)
   * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
   * @param   {Array}     start
   * @param   {Array}     end
   * @returns {Number}    scale
   */
  getScale: function getScale(start, end) {
    // need two fingers...
    if(start.length >= 2 && end.length >= 2) {
      return this.getDistance(end[0], end[1]) /
        this.getDistance(start[0], start[1]);
    }
    return 1;
  },


  /**
   * calculate the rotation degrees between two touchLists (fingers)
   * @param   {Array}     start
   * @param   {Array}     end
   * @returns {Number}    rotation
   */
  getRotation: function getRotation(start, end) {
    // need two fingers
    if(start.length >= 2 && end.length >= 2) {
      return this.getAngle(end[1], end[0]) -
        this.getAngle(start[1], start[0]);
    }
    return 0;
  },


  /**
   * boolean if the direction is vertical
   * @param    {String}    direction
   * @returns  {Boolean}   is_vertical
   */
  isVertical: function isVertical(direction) {
    return (direction == Hammer.DIRECTION_UP || direction == Hammer.DIRECTION_DOWN);
  },


  /**
   * stop browser default behavior with css props
   * @param   {HtmlElement}   element
   * @param   {Object}        css_props
   */
  stopDefaultBrowserBehavior: function stopDefaultBrowserBehavior(element, css_props) {
    if(!css_props || !element || !element.style) {
      return;
    }

    // with css properties for modern browsers
    Hammer.utils.each(['webkit', 'khtml', 'moz', 'Moz', 'ms', 'o', ''], function(vendor) {
      Hammer.utils.each(css_props, function(value, prop) {
          // vender prefix at the property
          if(vendor) {
            prop = vendor + prop.substring(0, 1).toUpperCase() + prop.substring(1);
          }
          // set the style
          if(prop in element.style) {
            element.style[prop] = value;
          }
      });
    });

    // also the disable onselectstart
    if(css_props.userSelect == 'none') {
      element.onselectstart = function() {
        return false;
      };
    }

    // and disable ondragstart
    if(css_props.userDrag == 'none') {
      element.ondragstart = function() {
        return false;
      };
    }
  },


  /**
   * reverts all changes made by 'stopDefaultBrowserBehavior'
   * @param   {HtmlElement}   element
   * @param   {Object}        css_props
   */
  startDefaultBrowserBehavior: function startDefaultBrowserBehavior(element, css_props) {
    if(!css_props || !element || !element.style) {
      return;
    }

    // with css properties for modern browsers
    Hammer.utils.each(['webkit', 'khtml', 'moz', 'Moz', 'ms', 'o', ''], function(vendor) {
      Hammer.utils.each(css_props, function(value, prop) {
          // vender prefix at the property
          if(vendor) {
            prop = vendor + prop.substring(0, 1).toUpperCase() + prop.substring(1);
          }
          // reset the style
          if(prop in element.style) {
            element.style[prop] = '';
          }
      });
    });

    // also the enable onselectstart
    if(css_props.userSelect == 'none') {
      element.onselectstart = null;
    }

    // and enable ondragstart
    if(css_props.userDrag == 'none') {
      element.ondragstart = null;
    }
  }
};


/**
 * create new hammer instance
 * all methods should return the instance itself, so it is chainable.
 * @param   {HTMLElement}       element
 * @param   {Object}            [options={}]
 * @returns {Hammer.Instance}
 * @constructor
 */
Hammer.Instance = function(element, options) {
  var self = this;

  // setup HammerJS window events and register all gestures
  // this also sets up the default options
  setup();

  this.element = element;

  // start/stop detection option
  this.enabled = true;

  // merge options
  this.options = Hammer.utils.extend(
    Hammer.utils.extend({}, Hammer.defaults),
    options || {});

  // add some css to the element to prevent the browser from doing its native behavoir
  if(this.options.stop_browser_behavior) {
    Hammer.utils.stopDefaultBrowserBehavior(this.element, this.options.stop_browser_behavior);
  }

  // start detection on touchstart
  this._eventStartHandler = Hammer.event.onTouch(element, Hammer.EVENT_START, function(ev) {
    if(self.enabled) {
      Hammer.detection.startDetect(self, ev);
    }
  });

  // keep a list of user event handlers which needs to be removed when calling 'dispose'
  this._eventHandler = [];

  // return instance
  return this;
};


Hammer.Instance.prototype = {
  /**
   * bind events to the instance
   * @param   {String}      gesture
   * @param   {Function}    handler
   * @returns {Hammer.Instance}
   */
  on: function onEvent(gesture, handler) {
    var gestures = gesture.split(' ');
    Hammer.utils.each(gestures, function(gesture) {
      this.element.addEventListener(gesture, handler, false);
      this._eventHandler.push({ gesture: gesture, handler: handler });
    }, this);
    return this;
  },


  /**
   * unbind events to the instance
   * @param   {String}      gesture
   * @param   {Function}    handler
   * @returns {Hammer.Instance}
   */
  off: function offEvent(gesture, handler) {
    var gestures = gesture.split(' ');
    Hammer.utils.each(gestures, function(gesture) {
      this.element.removeEventListener(gesture, handler, false);

      // remove the event handler from the internal list
      var index = -1;
      Hammer.utils.each(this._eventHandler, function(eventHandler, i) {
        if (index === -1 && eventHandler.gesture === gesture && eventHandler.handler === handler) {
          index = i;
        }
      }, this);

      if (index > -1) {
        this._eventHandler.splice(index, 1);
      }
    }, this);
    return this;
  },


  /**
   * trigger gesture event
   * @param   {String}      gesture
   * @param   {Object}      [eventData]
   * @returns {Hammer.Instance}
   */
  trigger: function triggerEvent(gesture, eventData) {
    // optional
    if(!eventData) {
      eventData = {};
    }

    // create DOM event
    var event = Hammer.DOCUMENT.createEvent('Event');
    event.initEvent(gesture, true, true);
    event.gesture = eventData;

    // trigger on the target if it is in the instance element,
    // this is for event delegation tricks
    var element = this.element;
    if(Hammer.utils.hasParent(eventData.target, element)) {
      element = eventData.target;
    }

    element.dispatchEvent(event);
    return this;
  },


  /**
   * enable of disable hammer.js detection
   * @param   {Boolean}   state
   * @returns {Hammer.Instance}
   */
  enable: function enable(state) {
    this.enabled = state;
    return this;
  },


  /**
   * dispose this hammer instance
   * @returns {Hammer.Instance}
   */
  dispose: function dispose() {

    // undo all changes made by stop_browser_behavior
    if(this.options.stop_browser_behavior) {
      Hammer.utils.startDefaultBrowserBehavior(this.element, this.options.stop_browser_behavior);
    }

    // unbind all custom event handlers
    Hammer.utils.each(this._eventHandler, function(eventHandler) {
      this.element.removeEventListener(eventHandler.gesture, eventHandler.handler, false);
    }, this);
    this._eventHandler.length = 0;

    // unbind the start event listener
    Hammer.event.unbindDom(this.element, Hammer.EVENT_TYPES[Hammer.EVENT_START], this._eventStartHandler);
    return this;
  }
};


/**
 * this holds the last move event,
 * used to fix empty touchend issue
 * see the onTouch event for an explanation
 * @type {Object}
 */
var last_move_event = null;


/**
 * when the mouse is hold down, this is true
 * @type {Boolean}
 */
var enable_detect = false;


/**
 * when touch events have been fired, this is true
 * @type {Boolean}
 */
var touch_triggered = false;


Hammer.event = {
  /**
   * simple addEventListener
   * @param   {HTMLElement}   element
   * @param   {String}        type
   * @param   {Function}      handler
   */
  bindDom: function(element, type, handler) {
    var types = type.split(' ');
    Hammer.utils.each(types, function(type){
      element.addEventListener(type, handler, false);
    });
  },


  /**
   * simple removeEventListener
   * @param   {HTMLElement}   element
   * @param   {String}        type
   * @param   {Function}      handler
   */
  unbindDom: function(element, type, handler) {
    var types = type.split(' ');
    Hammer.utils.each(types, function(type){
      element.removeEventListener(type, handler, false);
    });
  },


  /**
   * touch events with mouse fallback
   * @param   {HTMLElement}   element
   * @param   {String}        eventType        like Hammer.EVENT_MOVE
   * @param   {Function}      handler
   */
  onTouch: function onTouch(element, eventType, handler) {
    var self = this;

    var fn = function bindDomOnTouch(ev) {
      var sourceEventType = ev.type.toLowerCase();

      // onmouseup, but when touchend has been fired we do nothing.
      // this is for touchdevices which also fire a mouseup on touchend
      if(sourceEventType.match(/mouse/) && touch_triggered) {
        return;
      }

      // mousebutton must be down or a touch event
      else if(sourceEventType.match(/touch/) ||   // touch events are always on screen
        sourceEventType.match(/pointerdown/) || // pointerevents touch
        (sourceEventType.match(/mouse/) && ev.which === 1)   // mouse is pressed
        ) {
        enable_detect = true;
      }

      // mouse isn't pressed
      else if(sourceEventType.match(/mouse/) && !ev.which) {
        enable_detect = false;
      }


      // we are in a touch event, set the touch triggered bool to true,
      // this for the conflicts that may occur on ios and android
      if(sourceEventType.match(/touch|pointer/)) {
        touch_triggered = true;
      }

      // count the total touches on the screen
      var count_touches = 0;

      // when touch has been triggered in this detection session
      // and we are now handling a mouse event, we stop that to prevent conflicts
      if(enable_detect) {
        // update pointerevent
        if(Hammer.HAS_POINTEREVENTS && eventType != Hammer.EVENT_END) {
          count_touches = Hammer.PointerEvent.updatePointer(eventType, ev);
        }
        // touch
        else if(sourceEventType.match(/touch/)) {
          count_touches = ev.touches.length;
        }
        // mouse
        else if(!touch_triggered) {
          count_touches = sourceEventType.match(/up/) ? 0 : 1;
        }

        // if we are in a end event, but when we remove one touch and
        // we still have enough, set eventType to move
        if(count_touches > 0 && eventType == Hammer.EVENT_END) {
          eventType = Hammer.EVENT_MOVE;
        }
        // no touches, force the end event
        else if(!count_touches) {
          eventType = Hammer.EVENT_END;
        }

        // store the last move event
        if(count_touches || last_move_event === null) {
          last_move_event = ev;
        }

        // trigger the handler
        handler.call(Hammer.detection, self.collectEventData(element, eventType, self.getTouchList(last_move_event, eventType), ev));

        // remove pointerevent from list
        if(Hammer.HAS_POINTEREVENTS && eventType == Hammer.EVENT_END) {
          count_touches = Hammer.PointerEvent.updatePointer(eventType, ev);
        }
      }

      // on the end we reset everything
      if(!count_touches) {
        last_move_event = null;
        enable_detect = false;
        touch_triggered = false;
        Hammer.PointerEvent.reset();
      }
    };

    this.bindDom(element, Hammer.EVENT_TYPES[eventType], fn);

    // return the bound function to be able to unbind it later
    return fn;
    },


  /**
   * we have different events for each device/browser
   * determine what we need and set them in the Hammer.EVENT_TYPES constant
   */
  determineEventTypes: function determineEventTypes() {
    // determine the eventtype we want to set
    var types;

    // pointerEvents magic
    if(Hammer.HAS_POINTEREVENTS) {
      types = Hammer.PointerEvent.getEvents();
    }
    // on Android, iOS, blackberry, windows mobile we dont want any mouseevents
    else if(Hammer.NO_MOUSEEVENTS) {
      types = [
        'touchstart',
        'touchmove',
        'touchend touchcancel'];
    }
    // for non pointer events browsers and mixed browsers,
    // like chrome on windows8 touch laptop
    else {
      types = [
        'touchstart mousedown',
        'touchmove mousemove',
        'touchend touchcancel mouseup'];
    }

    Hammer.EVENT_TYPES[Hammer.EVENT_START] = types[0];
    Hammer.EVENT_TYPES[Hammer.EVENT_MOVE] = types[1];
    Hammer.EVENT_TYPES[Hammer.EVENT_END] = types[2];
  },


  /**
   * create touchlist depending on the event
   * @param   {Object}    ev
   * @param   {String}    eventType   used by the fakemultitouch plugin
   */
  getTouchList: function getTouchList(ev/*, eventType*/) {
    // get the fake pointerEvent touchlist
    if(Hammer.HAS_POINTEREVENTS) {
      return Hammer.PointerEvent.getTouchList();
    }
    // get the touchlist
    else if(ev.touches) {
      return ev.touches;
    }
    // make fake touchlist from mouse position
    else {
      ev.identifier = 1;
      return [ev];
    }
  },


  /**
   * collect event data for Hammer js
   * @param   {HTMLElement}   element
   * @param   {String}        eventType        like Hammer.EVENT_MOVE
   * @param   {Object}        eventData
   */
  collectEventData: function collectEventData(element, eventType, touches, ev) {
    // find out pointerType
    var pointerType = Hammer.POINTER_TOUCH;
    if(ev.type.match(/mouse/) || Hammer.PointerEvent.matchType(Hammer.POINTER_MOUSE, ev)) {
      pointerType = Hammer.POINTER_MOUSE;
    }

    return {
      center     : Hammer.utils.getCenter(touches),
      timeStamp  : new Date().getTime(),
      target     : ev.target,
      touches    : touches,
      eventType  : eventType,
      pointerType: pointerType,
      srcEvent   : ev,

      /**
       * prevent the browser default actions
       * mostly used to disable scrolling of the browser
       */
      preventDefault: function() {
        if(this.srcEvent.preventManipulation) {
          this.srcEvent.preventManipulation();
        }

        if(this.srcEvent.preventDefault) {
          this.srcEvent.preventDefault();
        }
      },

      /**
       * stop bubbling the event up to its parents
       */
      stopPropagation: function() {
        this.srcEvent.stopPropagation();
      },

      /**
       * immediately stop gesture detection
       * might be useful after a swipe was detected
       * @return {*}
       */
      stopDetect: function() {
        return Hammer.detection.stopDetect();
      }
    };
  }
};

Hammer.PointerEvent = {
  /**
   * holds all pointers
   * @type {Object}
   */
  pointers: {},

  /**
   * get a list of pointers
   * @returns {Array}     touchlist
   */
  getTouchList: function() {
    var self = this;
    var touchlist = [];

    // we can use forEach since pointerEvents only is in IE10
    Hammer.utils.each(self.pointers, function(pointer){
      touchlist.push(pointer);
    });

    return touchlist;
  },

  /**
   * update the position of a pointer
   * @param   {String}   type             Hammer.EVENT_END
   * @param   {Object}   pointerEvent
   */
  updatePointer: function(type, pointerEvent) {
    if(type == Hammer.EVENT_END) {
      delete this.pointers[pointerEvent.pointerId];
    }
    else {
      pointerEvent.identifier = pointerEvent.pointerId;
      this.pointers[pointerEvent.pointerId] = pointerEvent;
    }

    return Object.keys(this.pointers).length;
  },

  /**
   * check if ev matches pointertype
   * @param   {String}        pointerType     Hammer.POINTER_MOUSE
   * @param   {PointerEvent}  ev
   */
  matchType: function(pointerType, ev) {
    if(!ev.pointerType) {
      return false;
    }

    var pt = ev.pointerType,
      types = {};
    types[Hammer.POINTER_MOUSE] = (pt === ev.MSPOINTER_TYPE_MOUSE || pt === Hammer.POINTER_MOUSE);
    types[Hammer.POINTER_TOUCH] = (pt === ev.MSPOINTER_TYPE_TOUCH || pt === Hammer.POINTER_TOUCH);
    types[Hammer.POINTER_PEN] = (pt === ev.MSPOINTER_TYPE_PEN || pt === Hammer.POINTER_PEN);
    return types[pointerType];
  },


  /**
   * get events
   */
  getEvents: function() {
    return [
      'pointerdown MSPointerDown',
      'pointermove MSPointerMove',
      'pointerup pointercancel MSPointerUp MSPointerCancel'
    ];
  },

  /**
   * reset the list
   */
  reset: function() {
    this.pointers = {};
  }
};


Hammer.detection = {
  // contains all registred Hammer.gestures in the correct order
  gestures: [],

  // data of the current Hammer.gesture detection session
  current : null,

  // the previous Hammer.gesture session data
  // is a full clone of the previous gesture.current object
  previous: null,

  // when this becomes true, no gestures are fired
  stopped : false,


  /**
   * start Hammer.gesture detection
   * @param   {Hammer.Instance}   inst
   * @param   {Object}            eventData
   */
  startDetect: function startDetect(inst, eventData) {
    // already busy with a Hammer.gesture detection on an element
    if(this.current) {
      return;
    }

    this.stopped = false;

    this.current = {
      inst      : inst, // reference to HammerInstance we're working for
      startEvent: Hammer.utils.extend({}, eventData), // start eventData for distances, timing etc
      lastEvent : false, // last eventData
      lastVEvent: false, // last eventData for velocity.
      velocity  : false, // current velocity
      name      : '' // current gesture we're in/detected, can be 'tap', 'hold' etc
    };

    this.detect(eventData);
  },


  /**
   * Hammer.gesture detection
   * @param   {Object}    eventData
   */
  detect: function detect(eventData) {
    if(!this.current || this.stopped) {
      return;
    }

    // extend event data with calculations about scale, distance etc
    eventData = this.extendEventData(eventData);

    // instance options
    var inst_options = this.current.inst.options;

    // call Hammer.gesture handlers
    Hammer.utils.each(this.gestures, function(gesture) {
      // only when the instance options have enabled this gesture
      if(!this.stopped && inst_options[gesture.name] !== false) {
        // if a handler returns false, we stop with the detection
        if(gesture.handler.call(gesture, eventData, this.current.inst) === false) {
          this.stopDetect();
          return false;
        }
      }
    }, this);

    // store as previous event event
    if(this.current) {
      this.current.lastEvent = eventData;
    }

    // endevent, but not the last touch, so dont stop
    if(eventData.eventType == Hammer.EVENT_END && !eventData.touches.length - 1) {
      this.stopDetect();
    }

    return eventData;
  },


  /**
   * clear the Hammer.gesture vars
   * this is called on endDetect, but can also be used when a final Hammer.gesture has been detected
   * to stop other Hammer.gestures from being fired
   */
  stopDetect: function stopDetect() {
    // clone current data to the store as the previous gesture
    // used for the double tap gesture, since this is an other gesture detect session
    this.previous = Hammer.utils.extend({}, this.current);

    // reset the current
    this.current = null;

    // stopped!
    this.stopped = true;
  },


  /**
   * extend eventData for Hammer.gestures
   * @param   {Object}   ev
   * @returns {Object}   ev
   */
  extendEventData: function extendEventData(ev) {
    var startEv = this.current.startEvent,
        lastVEv = this.current.lastVEvent;

    // if the touches change, set the new touches over the startEvent touches
    // this because touchevents don't have all the touches on touchstart, or the
    // user must place his fingers at the EXACT same time on the screen, which is not realistic
    // but, sometimes it happens that both fingers are touching at the EXACT same time
    if(startEv && (ev.touches.length != startEv.touches.length || ev.touches === startEv.touches)) {
      // extend 1 level deep to get the touchlist with the touch objects
      startEv.touches = [];
      Hammer.utils.each(ev.touches, function(touch) {
        startEv.touches.push(Hammer.utils.extend({}, touch));
      });
    }

    var delta_time = ev.timeStamp - startEv.timeStamp
      , delta_x = ev.center.pageX - startEv.center.pageX
      , delta_y = ev.center.pageY - startEv.center.pageY
      , interimAngle
      , interimDirection
      , velocity = this.current.velocity;
  
    if (lastVEv !== false && ev.timeStamp - lastVEv.timeStamp > Hammer.UPDATE_VELOCITY_INTERVAL) {
  
        velocity =  Hammer.utils.getVelocity(ev.timeStamp - lastVEv.timeStamp, ev.center.pageX - lastVEv.center.pageX, ev.center.pageY - lastVEv.center.pageY);
        this.current.lastVEvent = ev;
  
        if (velocity.x > 0 && velocity.y > 0) {
            this.current.velocity = velocity;
        }
  
    } else if(this.current.velocity === false) {
        velocity = Hammer.utils.getVelocity(delta_time, delta_x, delta_y);
        this.current.velocity = velocity;
        this.current.lastVEvent = ev;
    }

    // end events (e.g. dragend) don't have useful values for interimDirection & interimAngle
    // because the previous event has exactly the same coordinates
    // so for end events, take the previous values of interimDirection & interimAngle
    // instead of recalculating them and getting a spurious '0'
    if(ev.eventType === 'end') {
      interimAngle = this.current.lastEvent && this.current.lastEvent.interimAngle;
      interimDirection = this.current.lastEvent && this.current.lastEvent.interimDirection;
    }
    else {
      interimAngle = this.current.lastEvent && Hammer.utils.getAngle(this.current.lastEvent.center, ev.center);
      interimDirection = this.current.lastEvent && Hammer.utils.getDirection(this.current.lastEvent.center, ev.center);
    }

    Hammer.utils.extend(ev, {
      deltaTime: delta_time,

      deltaX: delta_x,
      deltaY: delta_y,

      velocityX: velocity.x,
      velocityY: velocity.y,

      distance: Hammer.utils.getDistance(startEv.center, ev.center),

      angle: Hammer.utils.getAngle(startEv.center, ev.center),
      interimAngle: interimAngle,

      direction: Hammer.utils.getDirection(startEv.center, ev.center),
      interimDirection: interimDirection,

      scale: Hammer.utils.getScale(startEv.touches, ev.touches),
      rotation: Hammer.utils.getRotation(startEv.touches, ev.touches),

      startEvent: startEv
    });

    return ev;
  },


  /**
   * register new gesture
   * @param   {Object}    gesture object, see gestures.js for documentation
   * @returns {Array}     gestures
   */
  register: function register(gesture) {
    // add an enable gesture options if there is no given
    var options = gesture.defaults || {};
    if(options[gesture.name] === undefined) {
      options[gesture.name] = true;
    }

    // extend Hammer default options with the Hammer.gesture options
    Hammer.utils.extend(Hammer.defaults, options, true);

    // set its index
    gesture.index = gesture.index || 1000;

    // add Hammer.gesture to the list
    this.gestures.push(gesture);

    // sort the list by index
    this.gestures.sort(function(a, b) {
      if(a.index < b.index) { return -1; }
      if(a.index > b.index) { return 1; }
      return 0;
    });

    return this.gestures;
  }
};


/**
 * Drag
 * Move with x fingers (default 1) around on the page. Blocking the scrolling when
 * moving left and right is a good practice. When all the drag events are blocking
 * you disable scrolling on that area.
 * @events  drag, drapleft, dragright, dragup, dragdown
 */
Hammer.gestures.Drag = {
  name     : 'drag',
  index    : 50,
  defaults : {
    drag_min_distance            : 10,

    // Set correct_for_drag_min_distance to true to make the starting point of the drag
    // be calculated from where the drag was triggered, not from where the touch started.
    // Useful to avoid a jerk-starting drag, which can make fine-adjustments
    // through dragging difficult, and be visually unappealing.
    correct_for_drag_min_distance: true,

    // set 0 for unlimited, but this can conflict with transform
    drag_max_touches             : 1,

    // prevent default browser behavior when dragging occurs
    // be careful with it, it makes the element a blocking element
    // when you are using the drag gesture, it is a good practice to set this true
    drag_block_horizontal        : false,
    drag_block_vertical          : false,

    // drag_lock_to_axis keeps the drag gesture on the axis that it started on,
    // It disallows vertical directions if the initial direction was horizontal, and vice versa.
    drag_lock_to_axis            : false,

    // drag lock only kicks in when distance > drag_lock_min_distance
    // This way, locking occurs only when the distance has become large enough to reliably determine the direction
    drag_lock_min_distance       : 25
  },

  triggered: false,
  handler  : function dragGesture(ev, inst) {
    // current gesture isnt drag, but dragged is true
    // this means an other gesture is busy. now call dragend
    if(Hammer.detection.current.name != this.name && this.triggered) {
      inst.trigger(this.name + 'end', ev);
      this.triggered = false;
      return;
    }

    // max touches
    if(inst.options.drag_max_touches > 0 &&
      ev.touches.length > inst.options.drag_max_touches) {
      return;
    }

    switch(ev.eventType) {
      case Hammer.EVENT_START:
        this.triggered = false;
        break;

      case Hammer.EVENT_MOVE:
        // when the distance we moved is too small we skip this gesture
        // or we can be already in dragging
        if(ev.distance < inst.options.drag_min_distance &&
          Hammer.detection.current.name != this.name) {
          return;
        }

        // we are dragging!
        if(Hammer.detection.current.name != this.name) {
          Hammer.detection.current.name = this.name;
          if(inst.options.correct_for_drag_min_distance && ev.distance > 0) {
            // When a drag is triggered, set the event center to drag_min_distance pixels from the original event center.
            // Without this correction, the dragged distance would jumpstart at drag_min_distance pixels instead of at 0.
            // It might be useful to save the original start point somewhere
            var factor = Math.abs(inst.options.drag_min_distance / ev.distance);
            Hammer.detection.current.startEvent.center.pageX += ev.deltaX * factor;
            Hammer.detection.current.startEvent.center.pageY += ev.deltaY * factor;

            // recalculate event data using new start point
            ev = Hammer.detection.extendEventData(ev);
          }
        }

        // lock drag to axis?
        if(Hammer.detection.current.lastEvent.drag_locked_to_axis || (inst.options.drag_lock_to_axis && inst.options.drag_lock_min_distance <= ev.distance)) {
          ev.drag_locked_to_axis = true;
        }
        var last_direction = Hammer.detection.current.lastEvent.direction;
        if(ev.drag_locked_to_axis && last_direction !== ev.direction) {
          // keep direction on the axis that the drag gesture started on
          if(Hammer.utils.isVertical(last_direction)) {
            ev.direction = (ev.deltaY < 0) ? Hammer.DIRECTION_UP : Hammer.DIRECTION_DOWN;
          }
          else {
            ev.direction = (ev.deltaX < 0) ? Hammer.DIRECTION_LEFT : Hammer.DIRECTION_RIGHT;
          }
        }

        // first time, trigger dragstart event
        if(!this.triggered) {
          inst.trigger(this.name + 'start', ev);
          this.triggered = true;
        }

        // trigger normal event
        inst.trigger(this.name, ev);

        // direction event, like dragdown
        inst.trigger(this.name + ev.direction, ev);

        // block the browser events
        if((inst.options.drag_block_vertical && Hammer.utils.isVertical(ev.direction)) ||
          (inst.options.drag_block_horizontal && !Hammer.utils.isVertical(ev.direction))) {
          ev.preventDefault();
        }
        break;

      case Hammer.EVENT_END:
        // trigger dragend
        if(this.triggered) {
          inst.trigger(this.name + 'end', ev);
        }

        this.triggered = false;
        break;
    }
  }
};

/**
 * Hold
 * Touch stays at the same place for x time
 * @events  hold
 */
Hammer.gestures.Hold = {
  name    : 'hold',
  index   : 10,
  defaults: {
    hold_timeout  : 500,
    hold_threshold: 1
  },
  timer   : null,
  handler : function holdGesture(ev, inst) {
    switch(ev.eventType) {
      case Hammer.EVENT_START:
        // clear any running timers
        clearTimeout(this.timer);

        // set the gesture so we can check in the timeout if it still is
        Hammer.detection.current.name = this.name;

        // set timer and if after the timeout it still is hold,
        // we trigger the hold event
        this.timer = setTimeout(function() {
          if(Hammer.detection.current.name == 'hold') {
            inst.trigger('hold', ev);
          }
        }, inst.options.hold_timeout);
        break;

      // when you move or end we clear the timer
      case Hammer.EVENT_MOVE:
        if(ev.distance > inst.options.hold_threshold) {
          clearTimeout(this.timer);
        }
        break;

      case Hammer.EVENT_END:
        clearTimeout(this.timer);
        break;
    }
  }
};

/**
 * Release
 * Called as last, tells the user has released the screen
 * @events  release
 */
Hammer.gestures.Release = {
  name   : 'release',
  index  : Infinity,
  handler: function releaseGesture(ev, inst) {
    if(ev.eventType == Hammer.EVENT_END) {
      inst.trigger(this.name, ev);
    }
  }
};

/**
 * Swipe
 * triggers swipe events when the end velocity is above the threshold
 * @events  swipe, swipeleft, swiperight, swipeup, swipedown
 */
Hammer.gestures.Swipe = {
  name    : 'swipe',
  index   : 40,
  defaults: {
    // set 0 for unlimited, but this can conflict with transform
    swipe_min_touches: 1,
    swipe_max_touches: 1,
    swipe_velocity   : 0.7
  },
  handler : function swipeGesture(ev, inst) {
    if(ev.eventType == Hammer.EVENT_END) {
      // max touches
      if(inst.options.swipe_max_touches > 0 &&
        ev.touches.length < inst.options.swipe_min_touches &&
        ev.touches.length > inst.options.swipe_max_touches) {
        return;
      }

      // when the distance we moved is too small we skip this gesture
      // or we can be already in dragging
      if(ev.velocityX > inst.options.swipe_velocity ||
        ev.velocityY > inst.options.swipe_velocity) {
        // trigger swipe events
        inst.trigger(this.name, ev);
        inst.trigger(this.name + ev.direction, ev);
      }
    }
  }
};

/**
 * Tap/DoubleTap
 * Quick touch at a place or double at the same place
 * @events  tap, doubletap
 */
Hammer.gestures.Tap = {
  name    : 'tap',
  index   : 100,
  defaults: {
    tap_max_touchtime : 250,
    tap_max_distance  : 10,
    tap_always        : true,
    doubletap_distance: 20,
    doubletap_interval: 300
  },
  handler : function tapGesture(ev, inst) {
    if(ev.eventType == Hammer.EVENT_MOVE && !Hammer.detection.current.reachedTapMaxDistance) {
      //Track the distance we've moved. If it's above the max ONCE, remember that (fixes #406).
      Hammer.detection.current.reachedTapMaxDistance = (ev.distance > inst.options.tap_max_distance);
    } else if(ev.eventType == Hammer.EVENT_END && ev.srcEvent.type != 'touchcancel') {
      // previous gesture, for the double tap since these are two different gesture detections
      var prev = Hammer.detection.previous,
        did_doubletap = false;

      // when the touchtime is higher then the max touch time
      // or when the moving distance is too much
      if(Hammer.detection.current.reachedTapMaxDistance || ev.deltaTime > inst.options.tap_max_touchtime) {
        return;
      }

      // check if double tap
      if(prev && prev.name == 'tap' &&
        (ev.timeStamp - prev.lastEvent.timeStamp) < inst.options.doubletap_interval &&
        ev.distance < inst.options.doubletap_distance) {
        inst.trigger('doubletap', ev);
        did_doubletap = true;
      }

      // do a single tap
      if(!did_doubletap || inst.options.tap_always) {
        Hammer.detection.current.name = 'tap';
        inst.trigger(Hammer.detection.current.name, ev);
      }
    }
  }
};

/**
 * Touch
 * Called as first, tells the user has touched the screen
 * @events  touch
 */
Hammer.gestures.Touch = {
  name    : 'touch',
  index   : -Infinity,
  defaults: {
    // call preventDefault at touchstart, and makes the element blocking by
    // disabling the scrolling of the page, but it improves gestures like
    // transforming and dragging.
    // be careful with using this, it can be very annoying for users to be stuck
    // on the page
    prevent_default    : false,

    // disable mouse events, so only touch (or pen!) input triggers events
    prevent_mouseevents: false
  },
  handler : function touchGesture(ev, inst) {
    if(inst.options.prevent_mouseevents && ev.pointerType == Hammer.POINTER_MOUSE) {
      ev.stopDetect();
      return;
    }

    if(inst.options.prevent_default) {
      ev.preventDefault();
    }

    if(ev.eventType == Hammer.EVENT_START) {
      inst.trigger(this.name, ev);
    }
  }
};


/**
 * Transform
 * User want to scale or rotate with 2 fingers
 * @events  transform, pinch, pinchin, pinchout, rotate
 */
Hammer.gestures.Transform = {
  name     : 'transform',
  index    : 45,
  defaults : {
    // factor, no scale is 1, zoomin is to 0 and zoomout until higher then 1
    transform_min_scale   : 0.01,
    // rotation in degrees
    transform_min_rotation: 1,
    // prevent default browser behavior when two touches are on the screen
    // but it makes the element a blocking element
    // when you are using the transform gesture, it is a good practice to set this true
    transform_always_block: false
  },
  triggered: false,
  handler  : function transformGesture(ev, inst) {
    // current gesture isnt drag, but dragged is true
    // this means an other gesture is busy. now call dragend
    if(Hammer.detection.current.name != this.name && this.triggered) {
      inst.trigger(this.name + 'end', ev);
      this.triggered = false;
      return;
    }

    // atleast multitouch
    if(ev.touches.length < 2) {
      return;
    }

    // prevent default when two fingers are on the screen
    if(inst.options.transform_always_block) {
      ev.preventDefault();
    }

    switch(ev.eventType) {
      case Hammer.EVENT_START:
        this.triggered = false;
        break;

      case Hammer.EVENT_MOVE:
        var scale_threshold = Math.abs(1 - ev.scale);
        var rotation_threshold = Math.abs(ev.rotation);

        // when the distance we moved is too small we skip this gesture
        // or we can be already in dragging
        if(scale_threshold < inst.options.transform_min_scale &&
          rotation_threshold < inst.options.transform_min_rotation) {
          return;
        }

        // we are transforming!
        Hammer.detection.current.name = this.name;

        // first time, trigger dragstart event
        if(!this.triggered) {
          inst.trigger(this.name + 'start', ev);
          this.triggered = true;
        }

        inst.trigger(this.name, ev); // basic transform event

        // trigger rotate event
        if(rotation_threshold > inst.options.transform_min_rotation) {
          inst.trigger('rotate', ev);
        }

        // trigger pinch event
        if(scale_threshold > inst.options.transform_min_scale) {
          inst.trigger('pinch', ev);
          inst.trigger('pinch' + ((ev.scale < 1) ? 'in' : 'out'), ev);
        }
        break;

      case Hammer.EVENT_END:
        // trigger dragend
        if(this.triggered) {
          inst.trigger(this.name + 'end', ev);
        }

        this.triggered = false;
        break;
    }
  }
};

  // Based off Lo-Dash's excellent UMD wrapper (slightly modified) - https://github.com/bestiejs/lodash/blob/master/lodash.js#L5515-L5543
  // some AMD build optimizers, like r.js, check for specific condition patterns like the following:
  if(typeof define == 'function' && define.amd) {
    // define as an anonymous module
    define(function() { return Hammer; });
  }

  // check for `exports` after `define` in case a build optimizer adds an `exports` object
  else if(typeof module === 'object' && module.exports) {
    module.exports = Hammer;
  }

  else {
    window.Hammer = Hammer;
  }

})(window);

},{}]},{},[14])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9saWIvYWlCcmFpbi5qcyIsImpzL2xpYi9jYW52YXNSZW5kZXJpbmdDb250ZXh0MkRFeHRlbnNpb25zLmpzIiwianMvbGliL2V4dGVuZGVycy5qcyIsImpzL2xpYi9nYW1lLmpzIiwianMvbGliL2d1aWQuanMiLCJqcy9saWIvaW5mb0JveC5qcyIsImpzL2xpYi9pc01vYmlsZURldmljZS5qcyIsImpzL2xpYi9tb25zdGVyLmpzIiwianMvbGliL3BsdWdpbnMuanMiLCJqcy9saWIvc2tpZXIuanMiLCJqcy9saWIvc25vd2JvYXJkZXIuanMiLCJqcy9saWIvc3ByaXRlLmpzIiwianMvbGliL3Nwcml0ZUFycmF5LmpzIiwianMvbWFpbi5qcyIsImpzL3Nwcml0ZUluZm8uanMiLCJub2RlX21vZHVsZXMvYnItbW91c2V0cmFwL21vdXNldHJhcC5qcyIsIm5vZGVfbW9kdWxlcy9ldmVudGVkbG9vcC9saWIvbWFpbi5qcyIsIm5vZGVfbW9kdWxlcy9ldmVudGVkbG9vcC9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS91bmRlcnNjb3JlLmpzIiwibm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiLCJub2RlX21vZHVsZXMvaGFtbWVyanMvaGFtbWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdmZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUMveUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3pMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNnQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8vIHNob3VsZCBiZSBwdXQgaW4gYSBkZWRpY2F0ZWQgcGFja2FnZVxyXG4vLyB1c2luZyBucG0gbGluayB0byB1c2UgaXQgZnJvbSBza2lmcmVlLmpzP1xyXG5cclxuXHJcbihmdW5jdGlvbiAoZ2xvYmFsKSB7XHJcblx0ZnVuY3Rpb24gQWlCcmFpbiAoKSB7XHJcbiAgICAgICAgdGhpcy5haUJyYWluSnMgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy5zdGVwID0gMDtcclxuXHJcbiAgICAgICAgdGhpcy50cmFpbmluZ1ZlY3RvcnMgPSBbXTsgLy8gVE9ETyB3ZSBzaG91bGQgdXNlIHN0cmVhbSBpbnB1dCBmb3IgYnJhaW5qc1xyXG5cclxuICAgICAgICB0aGlzLkxFQVJOSU5HX1NURVBfQ09VTlQgPSAyMDA7XHJcbiAgICAgICAgdGhpcy5SRVBMQVlfU1RFUF9DT1VOVCA9IDQwMDtcclxuXHJcbiAgICAgICAgdGhpcy5yZXNldCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB0aGlzLmFpQnJhaW5KcyA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgdGhpcy5zdGVwID0gMDtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2FpQnJhaW46IHJlc2V0Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmN5Y2xlID0gZnVuY3Rpb24oc3RhdGljT2JqZWN0cywgbW92aW5nT2JqZWN0cywgcGxheWVyKSB7XHJcbiAgICAgICAgICAgIGxldCBjdXJyZW50U2l0dWF0aW9uO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuc3RlcCA8IHRoaXMuTEVBUk5JTkdfU1RFUF9DT1VOVCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2FpQnJhaW46IHJlY29yZCcpO1xyXG4gICAgICAgICAgICAgICAgLy8gd2UgbGVhcm4gKHNhbXBsZWQgbGVhcm5pbmcsIG9ubHkgd2hlbiB0aGVyZSBpcyBjaGFuZ2UgaW4gdGhlIGlucHV0cylcclxuICAgICAgICAgICAgICAgIC8vIFRPRE9cclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnN0ZXAgPCB0aGlzLlJFUExBWV9TVEVQX0NPVU5UKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYWlCcmFpbkpzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ05PVyBJVFxcJ3MgVVAgVE8gWU9VUiBJQSEnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnYWlCcmFpbjogdHJhaW4gQUknKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyB3ZSBjcmVhdGUgYW5kIHRyYWluIHRoZSBJQVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFRPRE9cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYWxlcnQgdGhlIHVzZXIgYWJvdXQgdGhlIHN3aXRjaCB0byB0aGUgcmVwbGF5IG1vZGVcclxuICAgICAgICAgICAgICAgICAgICAvLyBUT0RPXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnYWlCcmFpbjogcmVwbGF5Jyk7XHJcbiAgICAgICAgICAgICAgICAvLyB3ZSByZXBsYXlcclxuICAgICAgICAgICAgICAgIC8vIFRPRE9cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIGdvIHRvIHRoZSBzY29yZSBwYXJ0XHJcbiAgICAgICAgICAgICAgICBwcm9jZXNzU2NvcmUocGxheWVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnN0ZXArKztcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50U2l0dWF0aW9uO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5nZXRBSUNvbW1hbmQgPSBmdW5jdGlvbihjdXJyZW50U2l0dWF0aW9uKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdhaUJyYWluOiBnZXRBSUNvbW1hbmQnKTtcclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRTaXR1YXRpb24gJiYgdGhpcy5haUJyYWluSnMpIHtcclxuICAgICAgICAgICAgICAgIC8vIHdlIHJldHVybiB0aGUgY29tbWFuZCBjYWxjdWxhdGVkIGJ5IHRoZSBJQVxyXG4gICAgICAgICAgICAgICAgLy8gVE9ET1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuZW5kY3ljbGUgPSBmdW5jdGlvbihwbGF5ZXIpIHtcclxuICAgICAgICAgICAgLy8gVE9ETyB3aGVyZSB0byBjYWxsIGl0IGZyb20gZ2FtZS5qcyA/P1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnYWlCcmFpbjogZW5kY3ljbGUnKTtcclxuICAgICAgICAgICAgLy8gZGVwZW5kaW5nIG9uIHRoZSBzdGVwXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN0ZXAgPCB0aGlzLkxFQVJOSU5HX1NURVBfQ09VTlQpIHtcclxuICAgICAgICAgICAgICAgIC8vIHRoZSBza2llciBzaG91bGQgbm90IGJlIGFibGUgdG8gZGllIGluIHRoZSBsZWFybmluZyBwaGFzZVxyXG4gICAgICAgICAgICAgICAgLy8gVE9ET1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuc3RlcCA8IHRoaXMuUkVQTEFZX1NURVBfQ09VTlQpIHtcclxuICAgICAgICAgICAgICAgIC8vIHdhcm4gdGhlIHVzZXIgdGhlIElBIGp1c3QgZGllZFxyXG4gICAgICAgICAgICAgICAgcHJvY2Vzc1Njb3JlKHBsYXllcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHByb2Nlc3NTY29yZShwbGF5ZXIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2FpQnJhaW46IHByb2Nlc3Mgc2NvcmUnKTtcclxuICAgICAgICAgICAgYWxlcnQoJ1lPVVIgU0NPUkUgSVM6ICcpO1xyXG4gICAgICAgICAgICAvLyBUT0RPXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdsb2JhbC5BaUJyYWluID0gQWlCcmFpbjtcclxufSkodGhpcyk7XHJcblxyXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRtb2R1bGUuZXhwb3J0cyA9IHRoaXMuQWlCcmFpbjtcclxufSIsIkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRC5wcm90b3R5cGUuc3RvcmVMb2FkZWRJbWFnZSA9IGZ1bmN0aW9uIChrZXksIGltYWdlKSB7XHJcblx0aWYgKCF0aGlzLmltYWdlcykge1xyXG5cdFx0dGhpcy5pbWFnZXMgPSB7fTtcclxuXHR9XHJcblxyXG5cdHRoaXMuaW1hZ2VzW2tleV0gPSBpbWFnZTtcclxufTtcclxuXHJcbkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRC5wcm90b3R5cGUuZ2V0TG9hZGVkSW1hZ2UgPSBmdW5jdGlvbiAoa2V5KSB7XHJcblx0aWYgKHRoaXMuaW1hZ2VzW2tleV0pIHtcclxuXHRcdHJldHVybiB0aGlzLmltYWdlc1trZXldO1xyXG5cdH1cclxufTtcclxuXHJcbkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRC5wcm90b3R5cGUuZm9sbG93U3ByaXRlID0gZnVuY3Rpb24gKHNwcml0ZSkge1xyXG5cdHRoaXMuY2VudHJhbFNwcml0ZSA9IHNwcml0ZTtcclxufTtcclxuXHJcbkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRC5wcm90b3R5cGUuZ2V0Q2VudHJhbFBvc2l0aW9uID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiB7XHJcblx0XHRtYXA6IHRoaXMuY2VudHJhbFNwcml0ZS5tYXBQb3NpdGlvbixcclxuXHRcdGNhbnZhczogWyBNYXRoLnJvdW5kKHRoaXMuY2FudmFzLndpZHRoICogMC41KSwgTWF0aC5yb3VuZCh0aGlzLmNhbnZhcy5oZWlnaHQgKiAwLjUpLCAwXVxyXG5cdH07XHJcbn07XHJcblxyXG5DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQucHJvdG90eXBlLm1hcFBvc2l0aW9uVG9DYW52YXNQb3NpdGlvbiA9IGZ1bmN0aW9uIChwb3NpdGlvbikge1xyXG5cdHZhciBjZW50cmFsID0gdGhpcy5nZXRDZW50cmFsUG9zaXRpb24oKTtcclxuXHR2YXIgY2VudHJhbE1hcFBvc2l0aW9uID0gY2VudHJhbC5tYXA7XHJcblx0dmFyIGNlbnRyYWxDYW52YXNQb3NpdGlvbiA9IGNlbnRyYWwuY2FudmFzO1xyXG5cdHZhciBtYXBEaWZmZXJlbmNlWCA9IGNlbnRyYWxNYXBQb3NpdGlvblswXSAtIHBvc2l0aW9uWzBdO1xyXG5cdHZhciBtYXBEaWZmZXJlbmNlWSA9IGNlbnRyYWxNYXBQb3NpdGlvblsxXSAtIHBvc2l0aW9uWzFdO1xyXG5cdHJldHVybiBbIGNlbnRyYWxDYW52YXNQb3NpdGlvblswXSAtIG1hcERpZmZlcmVuY2VYLCBjZW50cmFsQ2FudmFzUG9zaXRpb25bMV0gLSBtYXBEaWZmZXJlbmNlWSBdO1xyXG59O1xyXG5cclxuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELnByb3RvdHlwZS5jYW52YXNQb3NpdGlvblRvTWFwUG9zaXRpb24gPSBmdW5jdGlvbiAocG9zaXRpb24pIHtcclxuXHR2YXIgY2VudHJhbCA9IHRoaXMuZ2V0Q2VudHJhbFBvc2l0aW9uKCk7XHJcblx0dmFyIGNlbnRyYWxNYXBQb3NpdGlvbiA9IGNlbnRyYWwubWFwO1xyXG5cdHZhciBjZW50cmFsQ2FudmFzUG9zaXRpb24gPSBjZW50cmFsLmNhbnZhcztcclxuXHR2YXIgbWFwRGlmZmVyZW5jZVggPSBjZW50cmFsQ2FudmFzUG9zaXRpb25bMF0gLSBwb3NpdGlvblswXTtcclxuXHR2YXIgbWFwRGlmZmVyZW5jZVkgPSBjZW50cmFsQ2FudmFzUG9zaXRpb25bMV0gLSBwb3NpdGlvblsxXTtcclxuXHRyZXR1cm4gWyBjZW50cmFsTWFwUG9zaXRpb25bMF0gLSBtYXBEaWZmZXJlbmNlWCwgY2VudHJhbE1hcFBvc2l0aW9uWzFdIC0gbWFwRGlmZmVyZW5jZVkgXTtcclxufTtcclxuXHJcbkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRC5wcm90b3R5cGUuZ2V0Q2VudHJlT2ZWaWV3cG9ydCA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4gKHRoaXMuY2FudmFzLndpZHRoIC8gMikuZmxvb3IoKTtcclxufTtcclxuXHJcbi8vIFktcG9zIGNhbnZhcyBmdW5jdGlvbnNcclxuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELnByb3RvdHlwZS5nZXRNaWRkbGVPZlZpZXdwb3J0ID0gZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiAodGhpcy5jYW52YXMuaGVpZ2h0IC8gMikuZmxvb3IoKTtcclxufTtcclxuXHJcbkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRC5wcm90b3R5cGUuZ2V0QmVsb3dWaWV3cG9ydCA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4gdGhpcy5jYW52YXMuaGVpZ2h0LmZsb29yKCk7XHJcbn07XHJcblxyXG5DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQucHJvdG90eXBlLmdldE1hcEJlbG93Vmlld3BvcnQgPSBmdW5jdGlvbiAoKSB7XHJcblx0dmFyIGJlbG93ID0gdGhpcy5nZXRCZWxvd1ZpZXdwb3J0KCk7XHJcblx0cmV0dXJuIHRoaXMuY2FudmFzUG9zaXRpb25Ub01hcFBvc2l0aW9uKFsgMCwgYmVsb3cgXSlbMV07XHJcbn07XHJcblxyXG5DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQucHJvdG90eXBlLmdldFJhbmRvbWx5SW5UaGVDZW50cmVPZkNhbnZhcyA9IGZ1bmN0aW9uIChidWZmZXIpIHtcclxuXHR2YXIgbWluID0gMDtcclxuXHR2YXIgbWF4ID0gdGhpcy5jYW52YXMud2lkdGg7XHJcblxyXG5cdGlmIChidWZmZXIpIHtcclxuXHRcdG1pbiAtPSBidWZmZXI7XHJcblx0XHRtYXggKz0gYnVmZmVyO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIE51bWJlci5yYW5kb20obWluLCBtYXgpO1xyXG59O1xyXG5cclxuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELnByb3RvdHlwZS5nZXRSYW5kb21seUluVGhlQ2VudHJlT2ZNYXAgPSBmdW5jdGlvbiAoYnVmZmVyKSB7XHJcblx0dmFyIHJhbmRvbSA9IHRoaXMuZ2V0UmFuZG9tbHlJblRoZUNlbnRyZU9mQ2FudmFzKGJ1ZmZlcik7XHJcblx0cmV0dXJuIHRoaXMuY2FudmFzUG9zaXRpb25Ub01hcFBvc2l0aW9uKFsgcmFuZG9tLCAwIF0pWzBdO1xyXG59O1xyXG5cclxuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELnByb3RvdHlwZS5nZXRSYW5kb21NYXBQb3NpdGlvbkJlbG93Vmlld3BvcnQgPSBmdW5jdGlvbiAoKSB7XHJcblx0dmFyIHhDYW52YXMgPSB0aGlzLmdldFJhbmRvbWx5SW5UaGVDZW50cmVPZkNhbnZhcygpO1xyXG5cdHZhciB5Q2FudmFzID0gdGhpcy5nZXRCZWxvd1ZpZXdwb3J0KCk7XHJcblx0cmV0dXJuIHRoaXMuY2FudmFzUG9zaXRpb25Ub01hcFBvc2l0aW9uKFsgeENhbnZhcywgeUNhbnZhcyBdKTtcclxufTtcclxuXHJcbkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRC5wcm90b3R5cGUuZ2V0UmFuZG9tTWFwUG9zaXRpb25BYm92ZVZpZXdwb3J0ID0gZnVuY3Rpb24gKCkge1xyXG5cdHZhciB4Q2FudmFzID0gdGhpcy5nZXRSYW5kb21seUluVGhlQ2VudHJlT2ZDYW52YXMoKTtcclxuXHR2YXIgeUNhbnZhcyA9IHRoaXMuZ2V0QWJvdmVWaWV3cG9ydCgpO1xyXG5cdHJldHVybiB0aGlzLmNhbnZhc1Bvc2l0aW9uVG9NYXBQb3NpdGlvbihbIHhDYW52YXMsIHlDYW52YXMgXSk7XHJcbn07XHJcblxyXG5DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQucHJvdG90eXBlLmdldFRvcE9mVmlld3BvcnQgPSBmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIHRoaXMuY2FudmFzUG9zaXRpb25Ub01hcFBvc2l0aW9uKFsgMCwgMCBdKVsxXTtcclxufTtcclxuXHJcbkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRC5wcm90b3R5cGUuZ2V0QWJvdmVWaWV3cG9ydCA9IGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4gMCAtICh0aGlzLmNhbnZhcy5oZWlnaHQgLyA0KS5mbG9vcigpO1xyXG59OyIsIi8vIEV4dGVuZHMgZnVuY3Rpb24gc28gdGhhdCBuZXctYWJsZSBvYmplY3RzIGNhbiBiZSBnaXZlbiBuZXcgbWV0aG9kcyBlYXNpbHlcclxuRnVuY3Rpb24ucHJvdG90eXBlLm1ldGhvZCA9IGZ1bmN0aW9uIChuYW1lLCBmdW5jKSB7XHJcbiAgICB0aGlzLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmM7XHJcbiAgICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8vIFdpbGwgcmV0dXJuIHRoZSBvcmlnaW5hbCBtZXRob2Qgb2YgYW4gb2JqZWN0IHdoZW4gaW5oZXJpdGluZyBmcm9tIGFub3RoZXJcclxuT2JqZWN0Lm1ldGhvZCgnc3VwZXJpb3InLCBmdW5jdGlvbiAobmFtZSkge1xyXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgdmFyIG1ldGhvZCA9IHRoYXRbbmFtZV07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG1ldGhvZC5hcHBseSh0aGF0LCBhcmd1bWVudHMpO1xyXG4gICAgfTtcclxufSk7IiwidmFyIFNwcml0ZUFycmF5ID0gcmVxdWlyZSgnLi9zcHJpdGVBcnJheScpO1xyXG52YXIgRXZlbnRlZExvb3AgPSByZXF1aXJlKCdldmVudGVkbG9vcCcpO1xyXG52YXIgQWlCcmFpbiA9IHJlcXVpcmUoJy4vYWlCcmFpbicpO1xyXG5cclxuKGZ1bmN0aW9uIChnbG9iYWwpIHtcclxuXHRmdW5jdGlvbiBHYW1lIChtYWluQ2FudmFzLCBwbGF5ZXIpIHtcclxuXHRcdHZhciBzdGF0aWNPYmplY3RzID0gbmV3IFNwcml0ZUFycmF5KCk7XHJcblx0XHR2YXIgbW92aW5nT2JqZWN0cyA9IG5ldyBTcHJpdGVBcnJheSgpO1xyXG5cdFx0dmFyIHVpRWxlbWVudHMgPSBuZXcgU3ByaXRlQXJyYXkoKTtcclxuXHRcdHZhciBkQ29udGV4dCA9IG1haW5DYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuXHRcdHZhciBtb3VzZVggPSBkQ29udGV4dC5nZXRDZW50cmVPZlZpZXdwb3J0KCk7XHJcblx0XHR2YXIgbW91c2VZID0gMDtcclxuXHRcdHZhciBwYXVzZWQgPSBmYWxzZTtcclxuXHRcdHZhciB0aGF0ID0gdGhpcztcclxuXHRcdHZhciBiZWZvcmVDeWNsZUNhbGxiYWNrcyA9IFtdO1xyXG5cdFx0dmFyIGFmdGVyQ3ljbGVDYWxsYmFja3MgPSBbXTtcclxuXHRcdHZhciBnYW1lTG9vcCA9IG5ldyBFdmVudGVkTG9vcCgpO1xyXG5cdFx0dmFyIGFpQnJhaW4gPSBuZXcgQWlCcmFpbigpO1xyXG5cdFx0YWlCcmFpbi5yZXNldCgpO1xyXG5cclxuXHRcdHRoaXMuYWRkU3RhdGljT2JqZWN0ID0gZnVuY3Rpb24gKHNwcml0ZSkge1xyXG5cdFx0XHRzdGF0aWNPYmplY3RzLnB1c2goc3ByaXRlKTtcclxuXHRcdH07XHJcblxyXG5cdFx0dGhpcy5hZGRTdGF0aWNPYmplY3RzID0gZnVuY3Rpb24gKHNwcml0ZXMpIHtcclxuXHRcdFx0c3ByaXRlcy5mb3JFYWNoKHRoaXMuYWRkU3RhdGljT2JqZWN0LmJpbmQodGhpcykpO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLmFkZE1vdmluZ09iamVjdCA9IGZ1bmN0aW9uIChtb3ZpbmdPYmplY3QsIG1vdmluZ09iamVjdFR5cGUpIHtcclxuXHRcdFx0aWYgKG1vdmluZ09iamVjdFR5cGUpIHtcclxuXHRcdFx0XHRzdGF0aWNPYmplY3RzLm9uUHVzaChmdW5jdGlvbiAob2JqKSB7XHJcblx0XHRcdFx0XHRpZiAob2JqLmRhdGEgJiYgb2JqLmRhdGEuaGl0QmVoYXZpb3VyW21vdmluZ09iamVjdFR5cGVdKSB7XHJcblx0XHRcdFx0XHRcdG9iai5vbkhpdHRpbmcobW92aW5nT2JqZWN0LCBvYmouZGF0YS5oaXRCZWhhdmlvdXJbbW92aW5nT2JqZWN0VHlwZV0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sIHRydWUpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRtb3ZpbmdPYmplY3RzLnB1c2gobW92aW5nT2JqZWN0KTtcclxuXHRcdH07XHJcblxyXG5cdFx0dGhpcy5hZGRVSUVsZW1lbnQgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG5cdFx0XHR1aUVsZW1lbnRzLnB1c2goZWxlbWVudCk7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuYmVmb3JlQ3ljbGUgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuXHRcdFx0YmVmb3JlQ3ljbGVDYWxsYmFja3MucHVzaChjYWxsYmFjayk7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuYWZ0ZXJDeWNsZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG5cdFx0XHRhZnRlckN5Y2xlQ2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLnNldE1vdXNlWCA9IGZ1bmN0aW9uICh4KSB7XHJcblx0XHRcdG1vdXNlWCA9IHg7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuc2V0TW91c2VZID0gZnVuY3Rpb24gKHkpIHtcclxuXHRcdFx0bW91c2VZID0geTtcclxuXHRcdH07XHJcblxyXG5cdFx0cGxheWVyLnNldE1hcFBvc2l0aW9uKDAsIDApO1xyXG5cdFx0cGxheWVyLnNldE1hcFBvc2l0aW9uVGFyZ2V0KDAsIC0xMCk7XHJcblx0XHRkQ29udGV4dC5mb2xsb3dTcHJpdGUocGxheWVyKTtcclxuXHJcblx0XHR2YXIgaW50ZXJ2YWxOdW0gPSAwO1xyXG5cclxuXHRcdHRoaXMuY3ljbGUgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGJlZm9yZUN5Y2xlQ2FsbGJhY2tzLmVhY2goZnVuY3Rpb24oYykge1xyXG5cdFx0XHRcdGMoKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQvLyBDbGVhciBjYW52YXNcclxuXHRcdFx0dmFyIG1vdXNlTWFwUG9zaXRpb24gPSBkQ29udGV4dC5jYW52YXNQb3NpdGlvblRvTWFwUG9zaXRpb24oW21vdXNlWCwgbW91c2VZXSk7XHJcblxyXG5cdFx0XHRsZXQgY3VycmVudFNpdHVhdGlvbiA9IGFpQnJhaW4uY3ljbGUoc3RhdGljT2JqZWN0cywgbW92aW5nT2JqZWN0cywgcGxheWVyKTtcclxuXHJcblx0XHRcdGlmICghcGxheWVyLmlzSnVtcGluZykge1xyXG5cdFx0XHRcdGxldCBhaUNvbW1hbmQgPSBhaUJyYWluLmdldEFJQ29tbWFuZChjdXJyZW50U2l0dWF0aW9uKTtcclxuXHRcdFx0XHRpZiAoYWlDb21tYW5kKSB7XHJcblx0XHRcdFx0XHRtb3VzZU1hcFBvc2l0aW9uID0gYWlDb21tYW5kLm1vdXNlTWFwUG9zaXRpb247XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHBsYXllci5zZXRNYXBQb3NpdGlvblRhcmdldChtb3VzZU1hcFBvc2l0aW9uWzBdLCBtb3VzZU1hcFBvc2l0aW9uWzFdKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aW50ZXJ2YWxOdW0rKztcclxuXHJcblx0XHRcdHBsYXllci5jeWNsZSgpO1xyXG5cclxuXHRcdFx0bW92aW5nT2JqZWN0cy5lYWNoKGZ1bmN0aW9uIChtb3ZpbmdPYmplY3QsIGkpIHtcclxuXHRcdFx0XHRtb3ZpbmdPYmplY3QuY3ljbGUoZENvbnRleHQpO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0XHJcblx0XHRcdHN0YXRpY09iamVjdHMuY3VsbCgpO1xyXG5cdFx0XHRzdGF0aWNPYmplY3RzLmVhY2goZnVuY3Rpb24gKHN0YXRpY09iamVjdCwgaSkge1xyXG5cdFx0XHRcdGlmIChzdGF0aWNPYmplY3QuY3ljbGUpIHtcclxuXHRcdFx0XHRcdHN0YXRpY09iamVjdC5jeWNsZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHR1aUVsZW1lbnRzLmVhY2goZnVuY3Rpb24gKHVpRWxlbWVudCwgaSkge1xyXG5cdFx0XHRcdGlmICh1aUVsZW1lbnQuY3ljbGUpIHtcclxuXHRcdFx0XHRcdHVpRWxlbWVudC5jeWNsZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRhZnRlckN5Y2xlQ2FsbGJhY2tzLmVhY2goZnVuY3Rpb24oYykge1xyXG5cdFx0XHRcdGMoKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoYXQuZHJhdyA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0Ly8gQ2xlYXIgY2FudmFzXHJcblx0XHRcdG1haW5DYW52YXMud2lkdGggPSBtYWluQ2FudmFzLndpZHRoO1xyXG5cclxuXHRcdFx0cGxheWVyLmRyYXcoZENvbnRleHQpO1xyXG5cclxuXHRcdFx0cGxheWVyLmN5Y2xlKCk7XHJcblxyXG5cdFx0XHRtb3ZpbmdPYmplY3RzLmVhY2goZnVuY3Rpb24gKG1vdmluZ09iamVjdCwgaSkge1xyXG5cdFx0XHRcdG1vdmluZ09iamVjdC5kcmF3KGRDb250ZXh0KTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdFxyXG5cdFx0XHRzdGF0aWNPYmplY3RzLmVhY2goZnVuY3Rpb24gKHN0YXRpY09iamVjdCwgaSkge1xyXG5cdFx0XHRcdGlmIChzdGF0aWNPYmplY3QuZHJhdykge1xyXG5cdFx0XHRcdFx0c3RhdGljT2JqZWN0LmRyYXcoZENvbnRleHQsICdtYWluJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHVpRWxlbWVudHMuZWFjaChmdW5jdGlvbiAodWlFbGVtZW50LCBpKSB7XHJcblx0XHRcdFx0aWYgKHVpRWxlbWVudC5kcmF3KSB7XHJcblx0XHRcdFx0XHR1aUVsZW1lbnQuZHJhdyhkQ29udGV4dCwgJ21haW4nKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLnN0YXJ0ID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRnYW1lTG9vcC5zdGFydCgpO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLnBhdXNlID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRwYXVzZWQgPSB0cnVlO1xyXG5cdFx0XHRnYW1lTG9vcC5zdG9wKCk7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuaXNQYXVzZWQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHJldHVybiBwYXVzZWQ7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMucmVzZXQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHBhdXNlZCA9IGZhbHNlO1xyXG5cdFx0XHRzdGF0aWNPYmplY3RzID0gbmV3IFNwcml0ZUFycmF5KCk7XHJcblx0XHRcdG1vdmluZ09iamVjdHMgPSBuZXcgU3ByaXRlQXJyYXkoKTtcclxuXHRcdFx0bW91c2VYID0gZENvbnRleHQuZ2V0Q2VudHJlT2ZWaWV3cG9ydCgpO1xyXG5cdFx0XHRtb3VzZVkgPSAwO1xyXG5cdFx0XHRwbGF5ZXIucmVzZXQoKTtcclxuXHRcdFx0cGxheWVyLnNldE1hcFBvc2l0aW9uKDAsIDAsIDApO1xyXG5cdFx0XHRhaUJyYWluLnJlc2V0KCk7XHJcblx0XHRcdHRoaXMuc3RhcnQoKTtcclxuXHRcdH0uYmluZCh0aGlzKTtcclxuXHJcblx0XHRnYW1lTG9vcC5vbignMjAnLCB0aGlzLmN5Y2xlKTtcclxuXHRcdGdhbWVMb29wLm9uKCcyMCcsIHRoaXMuZHJhdyk7XHJcblx0fVxyXG5cclxuXHRnbG9iYWwuZ2FtZSA9IEdhbWU7XHJcbn0pKCB0aGlzICk7XHJcblxyXG5cclxuaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSB7XHJcblx0bW9kdWxlLmV4cG9ydHMgPSB0aGlzLmdhbWU7XHJcbn0iLCIvLyBDcmVhdGVzIGEgcmFuZG9tIElEIHN0cmluZ1xyXG4oZnVuY3Rpb24oZ2xvYmFsKSB7XHJcbiAgICBmdW5jdGlvbiBndWlkICgpXHJcbiAgICB7XHJcbiAgICAgICAgdmFyIFM0ID0gZnVuY3Rpb24gKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGgucmFuZG9tKCkgKiAweDEwMDAwIC8qIDY1NTM2ICovXHJcbiAgICAgICAgICAgICAgICApLnRvU3RyaW5nKDE2KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgUzQoKSArIFM0KCkgKyBcIi1cIiArXHJcbiAgICAgICAgICAgICAgICBTNCgpICsgXCItXCIgK1xyXG4gICAgICAgICAgICAgICAgUzQoKSArIFwiLVwiICtcclxuICAgICAgICAgICAgICAgIFM0KCkgKyBcIi1cIiArXHJcbiAgICAgICAgICAgICAgICBTNCgpICsgUzQoKSArIFM0KClcclxuICAgICAgICAgICAgKTtcclxuICAgIH1cclxuICAgIGdsb2JhbC5ndWlkID0gZ3VpZDtcclxufSkodGhpcyk7XHJcblxyXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIG1vZHVsZS5leHBvcnRzID0gdGhpcy5ndWlkO1xyXG59IiwiZnVuY3Rpb24gSW5mb0JveChkYXRhKSB7XHJcblx0dmFyIHRoYXQgPSB0aGlzO1xyXG5cclxuXHR0aGF0LmxpbmVzID0gZGF0YS5pbml0aWFsTGluZXM7XHJcblxyXG5cdHRoYXQudG9wID0gZGF0YS5wb3NpdGlvbi50b3A7XHJcblx0dGhhdC5yaWdodCA9IGRhdGEucG9zaXRpb24ucmlnaHQ7XHJcblx0dGhhdC5ib3R0b20gPSBkYXRhLnBvc2l0aW9uLmJvdHRvbTtcclxuXHR0aGF0LmxlZnQgPSBkYXRhLnBvc2l0aW9uLmxlZnQ7XHJcblxyXG5cdHRoYXQud2lkdGggPSBkYXRhLndpZHRoO1xyXG5cdHRoYXQuaGVpZ2h0ID0gZGF0YS5oZWlnaHQ7XHJcblxyXG5cdHRoYXQuc2V0TGluZXMgPSBmdW5jdGlvbiAobGluZXMpIHtcclxuXHRcdHRoYXQubGluZXMgPSBsaW5lcztcclxuXHR9O1xyXG5cclxuXHR0aGF0LmRyYXcgPSBmdW5jdGlvbiAoZENvbnRleHQpIHtcclxuXHRcdGRDb250ZXh0LmZvbnQgPSAnMTFweCBtb25vc3BhY2UnO1xyXG5cdFx0dmFyIHlPZmZzZXQgPSAwO1xyXG5cdFx0dGhhdC5saW5lcy5lYWNoKGZ1bmN0aW9uIChsaW5lKSB7XHJcblx0XHRcdHZhciBmb250U2l6ZSA9ICtkQ29udGV4dC5mb250LnNsaWNlKDAsMik7XHJcblx0XHRcdHZhciB0ZXh0V2lkdGggPSBkQ29udGV4dC5tZWFzdXJlVGV4dChsaW5lKS53aWR0aDtcclxuXHRcdFx0dmFyIHRleHRIZWlnaHQgPSBmb250U2l6ZSAqIDEuNTtcclxuXHRcdFx0dmFyIHhQb3MsIHlQb3M7XHJcblx0XHRcdGlmICh0aGF0LnRvcCkge1xyXG5cdFx0XHRcdHlQb3MgPSB0aGF0LnRvcCArIHlPZmZzZXQ7XHJcblx0XHRcdH0gZWxzZSBpZiAodGhhdC5ib3R0b20pIHtcclxuXHRcdFx0XHR5UG9zID0gZENvbnRleHQuY2FudmFzLmhlaWdodCAtIHRoYXQudG9wIC0gdGV4dEhlaWdodCArIHlPZmZzZXQ7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICh0aGF0LnJpZ2h0KSB7XHJcblx0XHRcdFx0eFBvcyA9IGRDb250ZXh0LmNhbnZhcy53aWR0aCAtIHRoYXQucmlnaHQgLSB0ZXh0V2lkdGg7XHJcblx0XHRcdH0gZWxzZSBpZiAodGhhdC5sZWZ0KSB7XHJcblx0XHRcdFx0eFBvcyA9IHRoYXQubGVmdDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0eU9mZnNldCArPSB0ZXh0SGVpZ2h0O1xyXG5cclxuXHJcblx0XHRcdGRDb250ZXh0LmZpbGxUZXh0KGxpbmUsIHhQb3MsIHlQb3MpO1xyXG5cdFx0fSk7XHJcblx0fTtcclxuXHJcblx0cmV0dXJuIHRoYXQ7XHJcbn1cclxuXHJcbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykge1xyXG5cdG1vZHVsZS5leHBvcnRzID0gSW5mb0JveDtcclxufVxyXG4iLCJmdW5jdGlvbiBpc01vYmlsZURldmljZSgpIHtcclxuXHRpZihuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9BbmRyb2lkL2kpIHx8XHJcblx0XHRuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC93ZWJPUy9pKSB8fFxyXG5cdFx0bmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvaVBob25lL2kpIHx8XHJcblx0XHRuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9pUGFkL2kpIHx8XHJcblx0XHRuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9pUG9kL2kpIHx8XHJcblx0XHRuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9CbGFja0JlcnJ5L2kpIHx8XHJcblx0XHRuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9XaW5kb3dzIFBob25lL2kpXHJcblx0KSB7XHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcblx0ZWxzZSB7XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGlzTW9iaWxlRGV2aWNlOyIsInZhciBTcHJpdGUgPSByZXF1aXJlKCcuL3Nwcml0ZScpO1xyXG5cclxuKGZ1bmN0aW9uKGdsb2JhbCkge1xyXG5cdGZ1bmN0aW9uIE1vbnN0ZXIoZGF0YSkge1xyXG5cdFx0dmFyIHRoYXQgPSBuZXcgU3ByaXRlKGRhdGEpO1xyXG5cdFx0dmFyIHN1cGVyX2RyYXcgPSB0aGF0LnN1cGVyaW9yKCdkcmF3Jyk7XHJcblx0XHR2YXIgc3ByaXRlVmVyc2lvbiA9IDE7XHJcblx0XHR2YXIgZWF0aW5nU3RhZ2UgPSAwO1xyXG5cdFx0dmFyIHN0YW5kYXJkU3BlZWQgPSA2O1xyXG5cclxuXHRcdHRoYXQuaXNFYXRpbmcgPSBmYWxzZTtcclxuXHRcdHRoYXQuaXNGdWxsID0gZmFsc2U7XHJcblx0XHR0aGF0LnNldFNwZWVkKHN0YW5kYXJkU3BlZWQpO1xyXG5cclxuXHRcdHRoYXQuZHJhdyA9IGZ1bmN0aW9uKGRDb250ZXh0KSB7XHJcblx0XHRcdHZhciBzcHJpdGVQYXJ0VG9Vc2UgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0dmFyIHhEaWZmID0gdGhhdC5tb3ZpbmdUb3dhcmRbMF0gLSB0aGF0LmNhbnZhc1g7XHJcblxyXG5cdFx0XHRcdGlmICh0aGF0LmlzRWF0aW5nKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gJ2VhdGluZycgKyBlYXRpbmdTdGFnZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmIChzcHJpdGVWZXJzaW9uICsgMC4xID4gMikge1xyXG5cdFx0XHRcdFx0c3ByaXRlVmVyc2lvbiA9IDAuMTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0c3ByaXRlVmVyc2lvbiArPSAwLjE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmICh4RGlmZiA+PSAwKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gJ3NFYXN0JyArIE1hdGguY2VpbChzcHJpdGVWZXJzaW9uKTtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKHhEaWZmIDwgMCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuICdzV2VzdCcgKyBNYXRoLmNlaWwoc3ByaXRlVmVyc2lvbik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0cmV0dXJuIHN1cGVyX2RyYXcoZENvbnRleHQsIHNwcml0ZVBhcnRUb1VzZSgpKTtcclxuXHRcdH07XHJcblxyXG5cdFx0ZnVuY3Rpb24gc3RhcnRFYXRpbmcgKHdoZW5Eb25lKSB7XHJcblx0XHRcdGVhdGluZ1N0YWdlICs9IDE7XHJcblx0XHRcdHRoYXQuaXNFYXRpbmcgPSB0cnVlO1xyXG5cdFx0XHR0aGF0LmlzTW92aW5nID0gZmFsc2U7XHJcblx0XHRcdGlmIChlYXRpbmdTdGFnZSA8IDYpIHtcclxuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdHN0YXJ0RWF0aW5nKHdoZW5Eb25lKTtcclxuXHRcdFx0XHR9LCAzMDApO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGVhdGluZ1N0YWdlID0gMDtcclxuXHRcdFx0XHR0aGF0LmlzRWF0aW5nID0gZmFsc2U7XHJcblx0XHRcdFx0dGhhdC5pc01vdmluZyA9IHRydWU7XHJcblx0XHRcdFx0d2hlbkRvbmUoKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHRoYXQuc3RhcnRFYXRpbmcgPSBzdGFydEVhdGluZztcclxuXHJcblx0XHRyZXR1cm4gdGhhdDtcclxuXHR9XHJcblxyXG5cdGdsb2JhbC5tb25zdGVyID0gTW9uc3RlcjtcclxufSkoIHRoaXMgKTtcclxuXHJcblxyXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRtb2R1bGUuZXhwb3J0cyA9IHRoaXMubW9uc3RlcjtcclxufSIsIi8vIEF2b2lkIGBjb25zb2xlYCBlcnJvcnMgaW4gYnJvd3NlcnMgdGhhdCBsYWNrIGEgY29uc29sZS5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIG1ldGhvZDtcclxuICAgIHZhciBub29wID0gZnVuY3Rpb24gbm9vcCgpIHt9O1xyXG4gICAgdmFyIG1ldGhvZHMgPSBbXHJcbiAgICAgICAgJ2Fzc2VydCcsICdjbGVhcicsICdjb3VudCcsICdkZWJ1ZycsICdkaXInLCAnZGlyeG1sJywgJ2Vycm9yJyxcclxuICAgICAgICAnZXhjZXB0aW9uJywgJ2dyb3VwJywgJ2dyb3VwQ29sbGFwc2VkJywgJ2dyb3VwRW5kJywgJ2luZm8nLCAnbG9nJyxcclxuICAgICAgICAnbWFya1RpbWVsaW5lJywgJ3Byb2ZpbGUnLCAncHJvZmlsZUVuZCcsICd0YWJsZScsICd0aW1lJywgJ3RpbWVFbmQnLFxyXG4gICAgICAgICd0aW1lU3RhbXAnLCAndHJhY2UnLCAnd2FybidcclxuICAgIF07XHJcbiAgICB2YXIgbGVuZ3RoID0gbWV0aG9kcy5sZW5ndGg7XHJcbiAgICB2YXIgY29uc29sZSA9ICh3aW5kb3cuY29uc29sZSA9IHdpbmRvdy5jb25zb2xlIHx8IHt9KTtcclxuXHJcbiAgICB3aGlsZSAobGVuZ3RoLS0pIHtcclxuICAgICAgICBtZXRob2QgPSBtZXRob2RzW2xlbmd0aF07XHJcblxyXG4gICAgICAgIC8vIE9ubHkgc3R1YiB1bmRlZmluZWQgbWV0aG9kcy5cclxuICAgICAgICBpZiAoIWNvbnNvbGVbbWV0aG9kXSkge1xyXG4gICAgICAgICAgICBjb25zb2xlW21ldGhvZF0gPSBub29wO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSgpKTsiLCJ2YXIgU3ByaXRlID0gcmVxdWlyZSgnLi9zcHJpdGUnKTtcclxuaWYgKHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnKSB7XHJcblx0bmF2aWdhdG9yLnZpYnJhdGUgPSBuYXZpZ2F0b3IudmlicmF0ZSB8fFxyXG5cdFx0bmF2aWdhdG9yLndlYmtpdFZpYnJhdGUgfHxcclxuXHRcdG5hdmlnYXRvci5tb3pWaWJyYXRlIHx8XHJcblx0XHRuYXZpZ2F0b3IubXNWaWJyYXRlO1xyXG59IGVsc2Uge1xyXG5cdG5hdmlnYXRvciA9IHtcclxuXHRcdHZpYnJhdGU6IGZhbHNlXHJcblx0fTtcclxufVxyXG5cclxuKGZ1bmN0aW9uKGdsb2JhbCkge1xyXG5cdGZ1bmN0aW9uIFNraWVyKGRhdGEpIHtcclxuXHRcdHZhciBkaXNjcmV0ZURpcmVjdGlvbnMgPSB7XHJcblx0XHRcdCd3ZXN0JzogMjcwLFxyXG5cdFx0XHQnd3NXZXN0JzogMjQwLFxyXG5cdFx0XHQnc1dlc3QnOiAxOTUsXHJcblx0XHRcdCdzb3V0aCc6IDE4MCxcclxuXHRcdFx0J3NFYXN0JzogMTY1LFxyXG5cdFx0XHQnZXNFYXN0JzogMTIwLFxyXG5cdFx0XHQnZWFzdCc6IDkwXHJcblx0XHR9O1xyXG5cdFx0dmFyIHRoYXQgPSBuZXcgU3ByaXRlKGRhdGEpO1xyXG5cdFx0dmFyIHN1cCA9IHtcclxuXHRcdFx0ZHJhdzogdGhhdC5zdXBlcmlvcignZHJhdycpLFxyXG5cdFx0XHRjeWNsZTogdGhhdC5zdXBlcmlvcignY3ljbGUnKSxcclxuXHRcdFx0Z2V0U3BlZWRYOiB0aGF0LnN1cGVyaW9yKCdnZXRTcGVlZFgnKSxcclxuXHRcdFx0Z2V0U3BlZWRZOiB0aGF0LnN1cGVyaW9yKCdnZXRTcGVlZFknKSxcclxuXHRcdFx0aGl0czogdGhhdC5zdXBlcmlvcignaGl0cycpXHJcblx0XHR9O1xyXG5cdFx0dmFyIGRpcmVjdGlvbnMgPSB7XHJcblx0XHRcdGVzRWFzdDogZnVuY3Rpb24oeERpZmYpIHsgcmV0dXJuIHhEaWZmID4gMzAwOyB9LFxyXG5cdFx0XHRzRWFzdDogZnVuY3Rpb24oeERpZmYpIHsgcmV0dXJuIHhEaWZmID4gNzU7IH0sXHJcblx0XHRcdHdzV2VzdDogZnVuY3Rpb24oeERpZmYpIHsgcmV0dXJuIHhEaWZmIDwgLTMwMDsgfSxcclxuXHRcdFx0c1dlc3Q6IGZ1bmN0aW9uKHhEaWZmKSB7IHJldHVybiB4RGlmZiA8IC03NTsgfVxyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgY2FuY2VsYWJsZVN0YXRlVGltZW91dDtcclxuXHRcdHZhciBjYW5jZWxhYmxlU3RhdGVJbnRlcnZhbDtcclxuXHJcblx0XHR2YXIgY2FuU3BlZWRCb29zdCA9IHRydWU7XHJcblxyXG5cdFx0dmFyIG9ic3RhY2xlc0hpdCA9IFtdO1xyXG5cdFx0dmFyIHBpeGVsc1RyYXZlbGxlZCA9IDA7XHJcblx0XHR2YXIgc3RhbmRhcmRTcGVlZCA9IDU7XHJcblx0XHR2YXIgYm9vc3RNdWx0aXBsaWVyID0gMjtcclxuXHRcdHZhciB0dXJuRWFzZUN5Y2xlcyA9IDcwO1xyXG5cdFx0dmFyIHNwZWVkWCA9IDA7XHJcblx0XHR2YXIgc3BlZWRYRmFjdG9yID0gMDtcclxuXHRcdHZhciBzcGVlZFkgPSAwO1xyXG5cdFx0dmFyIHNwZWVkWUZhY3RvciA9IDE7XHJcblx0XHR2YXIgdHJpY2tTdGVwID0gMDsgLy8gVGhlcmUgYXJlIHRocmVlIG9mIHRoZXNlXHJcblxyXG5cdFx0dGhhdC5pc01vdmluZyA9IHRydWU7XHJcblx0XHR0aGF0Lmhhc0JlZW5IaXQgPSBmYWxzZTtcclxuXHRcdHRoYXQuaXNKdW1waW5nID0gZmFsc2U7XHJcblx0XHR0aGF0LmlzUGVyZm9ybWluZ1RyaWNrID0gZmFsc2U7XHJcblx0XHR0aGF0Lm9uSGl0T2JzdGFjbGVDYiA9IGZ1bmN0aW9uKCkge307XHJcblx0XHR0aGF0LnNldFNwZWVkKHN0YW5kYXJkU3BlZWQpO1xyXG5cclxuXHRcdHRoYXQucmVzZXQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdG9ic3RhY2xlc0hpdCA9IFtdO1xyXG5cdFx0XHRwaXhlbHNUcmF2ZWxsZWQgPSAwO1xyXG5cdFx0XHR0aGF0LmlzTW92aW5nID0gdHJ1ZTtcclxuXHRcdFx0dGhhdC5oYXNCZWVuSGl0ID0gZmFsc2U7XHJcblx0XHRcdGNhblNwZWVkQm9vc3QgPSB0cnVlO1xyXG5cdFx0XHRzZXROb3JtYWwoKTtcclxuXHRcdH07XHJcblxyXG5cdFx0ZnVuY3Rpb24gc2V0Tm9ybWFsKCkge1xyXG5cdFx0XHR0aGF0LnNldFNwZWVkKHN0YW5kYXJkU3BlZWQpO1xyXG5cdFx0XHR0aGF0LmlzTW92aW5nID0gdHJ1ZTtcclxuXHRcdFx0dGhhdC5oYXNCZWVuSGl0ID0gZmFsc2U7XHJcblx0XHRcdHRoYXQuaXNKdW1waW5nID0gZmFsc2U7XHJcblx0XHRcdHRoYXQuaXNQZXJmb3JtaW5nVHJpY2sgPSBmYWxzZTtcclxuXHRcdFx0aWYgKGNhbmNlbGFibGVTdGF0ZUludGVydmFsKSB7XHJcblx0XHRcdFx0Y2xlYXJJbnRlcnZhbChjYW5jZWxhYmxlU3RhdGVJbnRlcnZhbCk7XHJcblx0XHRcdH1cclxuXHRcdFx0dGhhdC5zZXRNYXBQb3NpdGlvbih1bmRlZmluZWQsIHVuZGVmaW5lZCwgMCk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gc2V0Q3Jhc2hlZCgpIHtcclxuXHRcdFx0dGhhdC5pc01vdmluZyA9IGZhbHNlO1xyXG5cdFx0XHR0aGF0Lmhhc0JlZW5IaXQgPSB0cnVlO1xyXG5cdFx0XHR0aGF0LmlzSnVtcGluZyA9IGZhbHNlO1xyXG5cdFx0XHR0aGF0LmlzUGVyZm9ybWluZ1RyaWNrID0gZmFsc2U7XHJcblx0XHRcdGlmIChjYW5jZWxhYmxlU3RhdGVJbnRlcnZhbCkge1xyXG5cdFx0XHRcdGNsZWFySW50ZXJ2YWwoY2FuY2VsYWJsZVN0YXRlSW50ZXJ2YWwpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoYXQuc2V0TWFwUG9zaXRpb24odW5kZWZpbmVkLCB1bmRlZmluZWQsIDApO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIHNldEp1bXBpbmcoKSB7XHJcblx0XHRcdHZhciBjdXJyZW50U3BlZWQgPSB0aGF0LmdldFNwZWVkKCk7XHJcblx0XHRcdHRoYXQuc2V0U3BlZWQoY3VycmVudFNwZWVkICsgMik7XHJcblx0XHRcdHRoYXQuc2V0U3BlZWRZKGN1cnJlbnRTcGVlZCArIDIpO1xyXG5cdFx0XHR0aGF0LmlzTW92aW5nID0gdHJ1ZTtcclxuXHRcdFx0dGhhdC5oYXNCZWVuSGl0ID0gZmFsc2U7XHJcblx0XHRcdHRoYXQuaXNKdW1waW5nID0gdHJ1ZTtcclxuXHRcdFx0dGhhdC5zZXRNYXBQb3NpdGlvbih1bmRlZmluZWQsIHVuZGVmaW5lZCwgMSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gZ2V0RGlzY3JldGVEaXJlY3Rpb24oKSB7XHJcblx0XHRcdGlmICh0aGF0LmRpcmVjdGlvbikge1xyXG5cdFx0XHRcdGlmICh0aGF0LmRpcmVjdGlvbiA8PSA5MCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuICdlYXN0JztcclxuXHRcdFx0XHR9IGVsc2UgaWYgKHRoYXQuZGlyZWN0aW9uID4gOTAgJiYgdGhhdC5kaXJlY3Rpb24gPCAxNTApIHtcclxuXHRcdFx0XHRcdHJldHVybiAnZXNFYXN0JztcclxuXHRcdFx0XHR9IGVsc2UgaWYgKHRoYXQuZGlyZWN0aW9uID49IDE1MCAmJiB0aGF0LmRpcmVjdGlvbiA8IDE4MCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuICdzRWFzdCc7XHJcblx0XHRcdFx0fSBlbHNlIGlmICh0aGF0LmRpcmVjdGlvbiA9PT0gMTgwKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gJ3NvdXRoJztcclxuXHRcdFx0XHR9IGVsc2UgaWYgKHRoYXQuZGlyZWN0aW9uID4gMTgwICYmIHRoYXQuZGlyZWN0aW9uIDw9IDIxMCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuICdzV2VzdCc7XHJcblx0XHRcdFx0fSBlbHNlIGlmICh0aGF0LmRpcmVjdGlvbiA+IDIxMCAmJiB0aGF0LmRpcmVjdGlvbiA8IDI3MCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuICd3c1dlc3QnO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAodGhhdC5kaXJlY3Rpb24gPj0gMjcwKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gJ3dlc3QnO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gJ3NvdXRoJztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dmFyIHhEaWZmID0gdGhhdC5tb3ZpbmdUb3dhcmRbMF0gLSB0aGF0Lm1hcFBvc2l0aW9uWzBdO1xyXG5cdFx0XHRcdHZhciB5RGlmZiA9IHRoYXQubW92aW5nVG93YXJkWzFdIC0gdGhhdC5tYXBQb3NpdGlvblsxXTtcclxuXHRcdFx0XHRpZiAoeURpZmYgPD0gMCkge1xyXG5cdFx0XHRcdFx0aWYgKHhEaWZmID4gMCkge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gJ2Vhc3QnO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuICd3ZXN0JztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmIChkaXJlY3Rpb25zLmVzRWFzdCh4RGlmZikpIHtcclxuXHRcdFx0XHRcdHJldHVybiAnZXNFYXN0JztcclxuXHRcdFx0XHR9IGVsc2UgaWYgKGRpcmVjdGlvbnMuc0Vhc3QoeERpZmYpKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gJ3NFYXN0JztcclxuXHRcdFx0XHR9IGVsc2UgaWYgKGRpcmVjdGlvbnMud3NXZXN0KHhEaWZmKSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuICd3c1dlc3QnO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAoZGlyZWN0aW9ucy5zV2VzdCh4RGlmZikpIHtcclxuXHRcdFx0XHRcdHJldHVybiAnc1dlc3QnO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gJ3NvdXRoJztcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBzZXREaXNjcmV0ZURpcmVjdGlvbihkKSB7XHJcblx0XHRcdGlmIChkaXNjcmV0ZURpcmVjdGlvbnNbZF0pIHtcclxuXHRcdFx0XHR0aGF0LnNldERpcmVjdGlvbihkaXNjcmV0ZURpcmVjdGlvbnNbZF0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoZCA9PT0gJ3dlc3QnIHx8IGQgPT09ICdlYXN0Jykge1xyXG5cdFx0XHRcdHRoYXQuaXNNb3ZpbmcgPSBmYWxzZTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGF0LmlzTW92aW5nID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIGdldEJlaW5nRWF0ZW5TcHJpdGUoKSB7XHJcblx0XHRcdHJldHVybiAnYmxhbmsnO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIGdldEp1bXBpbmdTcHJpdGUoKSB7XHJcblx0XHRcdHJldHVybiAnanVtcGluZyc7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gZ2V0VHJpY2tTcHJpdGUoKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKCdUcmljayBzdGVwIGlzJywgdHJpY2tTdGVwKTtcclxuXHRcdFx0aWYgKHRyaWNrU3RlcCA9PT0gMCkge1xyXG5cdFx0XHRcdHJldHVybiAnanVtcGluZyc7XHJcblx0XHRcdH0gZWxzZSBpZiAodHJpY2tTdGVwID09PSAxKSB7XHJcblx0XHRcdFx0cmV0dXJuICdzb21lcnNhdWx0MSc7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuICdzb21lcnNhdWx0Mic7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR0aGF0LnN0b3AgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGlmICh0aGF0LmRpcmVjdGlvbiA+IDE4MCkge1xyXG5cdFx0XHRcdHNldERpc2NyZXRlRGlyZWN0aW9uKCd3ZXN0Jyk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0c2V0RGlzY3JldGVEaXJlY3Rpb24oJ2Vhc3QnKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHR0aGF0LnR1cm5FYXN0ID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHR2YXIgZGlzY3JldGVEaXJlY3Rpb24gPSBnZXREaXNjcmV0ZURpcmVjdGlvbigpO1xyXG5cclxuXHRcdFx0c3dpdGNoIChkaXNjcmV0ZURpcmVjdGlvbikge1xyXG5cdFx0XHRcdGNhc2UgJ3dlc3QnOlxyXG5cdFx0XHRcdFx0c2V0RGlzY3JldGVEaXJlY3Rpb24oJ3dzV2VzdCcpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAnd3NXZXN0JzpcclxuXHRcdFx0XHRcdHNldERpc2NyZXRlRGlyZWN0aW9uKCdzV2VzdCcpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAnc1dlc3QnOlxyXG5cdFx0XHRcdFx0c2V0RGlzY3JldGVEaXJlY3Rpb24oJ3NvdXRoJyk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdzb3V0aCc6XHJcblx0XHRcdFx0XHRzZXREaXNjcmV0ZURpcmVjdGlvbignc0Vhc3QnKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ3NFYXN0JzpcclxuXHRcdFx0XHRcdHNldERpc2NyZXRlRGlyZWN0aW9uKCdlc0Vhc3QnKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ2VzRWFzdCc6XHJcblx0XHRcdFx0XHRzZXREaXNjcmV0ZURpcmVjdGlvbignZWFzdCcpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRcdHNldERpc2NyZXRlRGlyZWN0aW9uKCdzb3V0aCcpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0dGhhdC50dXJuV2VzdCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0dmFyIGRpc2NyZXRlRGlyZWN0aW9uID0gZ2V0RGlzY3JldGVEaXJlY3Rpb24oKTtcclxuXHJcblx0XHRcdHN3aXRjaCAoZGlzY3JldGVEaXJlY3Rpb24pIHtcclxuXHRcdFx0XHRjYXNlICdlYXN0JzpcclxuXHRcdFx0XHRcdHNldERpc2NyZXRlRGlyZWN0aW9uKCdlc0Vhc3QnKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ2VzRWFzdCc6XHJcblx0XHRcdFx0XHRzZXREaXNjcmV0ZURpcmVjdGlvbignc0Vhc3QnKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ3NFYXN0JzpcclxuXHRcdFx0XHRcdHNldERpc2NyZXRlRGlyZWN0aW9uKCdzb3V0aCcpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAnc291dGgnOlxyXG5cdFx0XHRcdFx0c2V0RGlzY3JldGVEaXJlY3Rpb24oJ3NXZXN0Jyk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdzV2VzdCc6XHJcblx0XHRcdFx0XHRzZXREaXNjcmV0ZURpcmVjdGlvbignd3NXZXN0Jyk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICd3c1dlc3QnOlxyXG5cdFx0XHRcdFx0c2V0RGlzY3JldGVEaXJlY3Rpb24oJ3dlc3QnKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0XHRzZXREaXNjcmV0ZURpcmVjdGlvbignc291dGgnKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoYXQuc3RlcFdlc3QgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHRoYXQubWFwUG9zaXRpb25bMF0gLT0gdGhhdC5zcGVlZCAqIDI7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoYXQuc3RlcEVhc3QgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHRoYXQubWFwUG9zaXRpb25bMF0gKz0gdGhhdC5zcGVlZCAqIDI7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoYXQuc2V0TWFwUG9zaXRpb25UYXJnZXQgPSBmdW5jdGlvbiAoeCwgeSkge1xyXG5cdFx0XHRpZiAodGhhdC5oYXNCZWVuSGl0KSByZXR1cm47XHJcblxyXG5cdFx0XHRpZiAoTWF0aC5hYnModGhhdC5tYXBQb3NpdGlvblswXSAtIHgpIDw9IDc1KSB7XHJcblx0XHRcdFx0eCA9IHRoYXQubWFwUG9zaXRpb25bMF07XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoYXQubW92aW5nVG93YXJkID0gWyB4LCB5IF07XHJcblxyXG5cdFx0XHQvLyB0aGF0LnJlc2V0RGlyZWN0aW9uKCk7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoYXQuc3RhcnRNb3ZpbmdJZlBvc3NpYmxlID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZiAoIXRoYXQuaGFzQmVlbkhpdCAmJiAhdGhhdC5pc0JlaW5nRWF0ZW4pIHtcclxuXHRcdFx0XHR0aGF0LmlzTW92aW5nID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHR0aGF0LnNldFR1cm5FYXNlQ3ljbGVzID0gZnVuY3Rpb24gKGMpIHtcclxuXHRcdFx0dHVybkVhc2VDeWNsZXMgPSBjO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGF0LmdldFBpeGVsc1RyYXZlbGxlZERvd25Nb3VudGFpbiA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0cmV0dXJuIHBpeGVsc1RyYXZlbGxlZDtcclxuXHRcdH07XHJcblxyXG5cdFx0dGhhdC5yZXNldFNwZWVkID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHR0aGF0LnNldFNwZWVkKHN0YW5kYXJkU3BlZWQpO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGF0LmN5Y2xlID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZiAoIHRoYXQuZ2V0U3BlZWRYKCkgPD0gMCAmJiB0aGF0LmdldFNwZWVkWSgpIDw9IDAgKSB7XHJcblx0XHRcdFx0XHRcdHRoYXQuaXNNb3ZpbmcgPSBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAodGhhdC5pc01vdmluZykge1xyXG5cdFx0XHRcdHBpeGVsc1RyYXZlbGxlZCArPSB0aGF0LnNwZWVkO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAodGhhdC5pc0p1bXBpbmcpIHtcclxuXHRcdFx0XHR0aGF0LnNldE1hcFBvc2l0aW9uVGFyZ2V0KHVuZGVmaW5lZCwgdGhhdC5tYXBQb3NpdGlvblsxXSArIHRoYXQuZ2V0U3BlZWQoKSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHN1cC5jeWNsZSgpO1xyXG5cdFx0XHRcclxuXHRcdFx0dGhhdC5jaGVja0hpdHRhYmxlT2JqZWN0cygpO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGF0LmRyYXcgPSBmdW5jdGlvbihkQ29udGV4dCkge1xyXG5cdFx0XHR2YXIgc3ByaXRlUGFydFRvVXNlID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdGlmICh0aGF0LmlzQmVpbmdFYXRlbikge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGdldEJlaW5nRWF0ZW5TcHJpdGUoKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmICh0aGF0LmlzSnVtcGluZykge1xyXG5cdFx0XHRcdFx0aWYgKHRoYXQuaXNQZXJmb3JtaW5nVHJpY2spIHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGdldFRyaWNrU3ByaXRlKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRyZXR1cm4gZ2V0SnVtcGluZ1Nwcml0ZSgpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKHRoYXQuaGFzQmVlbkhpdCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuICdoaXQnO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0cmV0dXJuIGdldERpc2NyZXRlRGlyZWN0aW9uKCk7XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRyZXR1cm4gc3VwLmRyYXcoZENvbnRleHQsIHNwcml0ZVBhcnRUb1VzZSgpKTtcclxuXHRcdH07XHJcblxyXG5cdFx0dGhhdC5oaXRzID0gZnVuY3Rpb24gKG9icykge1xyXG5cdFx0XHRpZiAob2JzdGFjbGVzSGl0LmluZGV4T2Yob2JzLmlkKSAhPT0gLTEpIHtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICghb2JzLm9jY3VwaWVzWkluZGV4KHRoYXQubWFwUG9zaXRpb25bMl0pKSB7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoc3VwLmhpdHMob2JzKSkge1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoYXQuc3BlZWRCb29zdCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0dmFyIG9yaWdpbmFsU3BlZWQgPSB0aGF0LnNwZWVkO1xyXG5cdFx0XHRpZiAoY2FuU3BlZWRCb29zdCkge1xyXG5cdFx0XHRcdGNhblNwZWVkQm9vc3QgPSBmYWxzZTtcclxuXHRcdFx0XHR0aGF0LnNldFNwZWVkKHRoYXQuc3BlZWQgKiBib29zdE11bHRpcGxpZXIpO1xyXG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0dGhhdC5zZXRTcGVlZChvcmlnaW5hbFNwZWVkKTtcclxuXHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0XHRjYW5TcGVlZEJvb3N0ID0gdHJ1ZTtcclxuXHRcdFx0XHRcdH0sIDEwMDAwKTtcclxuXHRcdFx0XHR9LCAyMDAwKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHR0aGF0LmF0dGVtcHRUcmljayA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aWYgKHRoYXQuaXNKdW1waW5nKSB7XHJcblx0XHRcdFx0dGhhdC5pc1BlcmZvcm1pbmdUcmljayA9IHRydWU7XHJcblx0XHRcdFx0Y2FuY2VsYWJsZVN0YXRlSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHRpZiAodHJpY2tTdGVwID49IDIpIHtcclxuXHRcdFx0XHRcdFx0dHJpY2tTdGVwID0gMDtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHRyaWNrU3RlcCArPSAxO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sIDMwMCk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0dGhhdC5nZXRTdGFuZGFyZFNwZWVkID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRyZXR1cm4gc3RhbmRhcmRTcGVlZDtcclxuXHRcdH07XHJcblxyXG5cdFx0ZnVuY3Rpb24gZWFzZVNwZWVkVG9UYXJnZXRVc2luZ0ZhY3RvcihzcCwgdGFyZ2V0U3BlZWQsIGYpIHtcclxuXHRcdFx0aWYgKGYgPT09IDAgfHwgZiA9PT0gMSkge1xyXG5cdFx0XHRcdHJldHVybiB0YXJnZXRTcGVlZDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHNwIDwgdGFyZ2V0U3BlZWQpIHtcclxuXHRcdFx0XHRzcCArPSB0aGF0LmdldFNwZWVkKCkgKiAoZiAvIHR1cm5FYXNlQ3ljbGVzKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHNwID4gdGFyZ2V0U3BlZWQpIHtcclxuXHRcdFx0XHRzcCAtPSB0aGF0LmdldFNwZWVkKCkgKiAoZiAvIHR1cm5FYXNlQ3ljbGVzKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHNwO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoYXQuZ2V0U3BlZWRYID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZiAoZ2V0RGlzY3JldGVEaXJlY3Rpb24oKSA9PT0gJ2VzRWFzdCcgfHwgZ2V0RGlzY3JldGVEaXJlY3Rpb24oKSA9PT0gJ3dzV2VzdCcpIHtcclxuXHRcdFx0XHRzcGVlZFhGYWN0b3IgPSAwLjU7XHJcblx0XHRcdFx0c3BlZWRYID0gZWFzZVNwZWVkVG9UYXJnZXRVc2luZ0ZhY3RvcihzcGVlZFgsIHRoYXQuZ2V0U3BlZWQoKSAqIHNwZWVkWEZhY3Rvciwgc3BlZWRYRmFjdG9yKTtcclxuXHJcblx0XHRcdFx0cmV0dXJuIHNwZWVkWDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKGdldERpc2NyZXRlRGlyZWN0aW9uKCkgPT09ICdzRWFzdCcgfHwgZ2V0RGlzY3JldGVEaXJlY3Rpb24oKSA9PT0gJ3NXZXN0Jykge1xyXG5cdFx0XHRcdHNwZWVkWEZhY3RvciA9IDAuMzM7XHJcblx0XHRcdFx0c3BlZWRYID0gZWFzZVNwZWVkVG9UYXJnZXRVc2luZ0ZhY3RvcihzcGVlZFgsIHRoYXQuZ2V0U3BlZWQoKSAqIHNwZWVkWEZhY3Rvciwgc3BlZWRYRmFjdG9yKTtcclxuXHJcblx0XHRcdFx0cmV0dXJuIHNwZWVkWDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gU28gaXQgbXVzdCBiZSBzb3V0aFxyXG5cclxuXHRcdFx0c3BlZWRYID0gZWFzZVNwZWVkVG9UYXJnZXRVc2luZ0ZhY3RvcihzcGVlZFgsIDAsIHNwZWVkWEZhY3Rvcik7XHJcblxyXG5cdFx0XHRyZXR1cm4gc3BlZWRYO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGF0LnNldFNwZWVkWSA9IGZ1bmN0aW9uKHN5KSB7XHJcblx0XHRcdHNwZWVkWSA9IHN5O1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGF0LmdldFNwZWVkWSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0dmFyIHRhcmdldFNwZWVkO1xyXG5cclxuXHRcdFx0aWYgKHRoYXQuaXNKdW1waW5nKSB7XHJcblx0XHRcdFx0cmV0dXJuIHNwZWVkWTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKGdldERpc2NyZXRlRGlyZWN0aW9uKCkgPT09ICdlc0Vhc3QnIHx8IGdldERpc2NyZXRlRGlyZWN0aW9uKCkgPT09ICd3c1dlc3QnKSB7XHJcblx0XHRcdFx0c3BlZWRZRmFjdG9yID0gMC42O1xyXG5cdFx0XHRcdHNwZWVkWSA9IGVhc2VTcGVlZFRvVGFyZ2V0VXNpbmdGYWN0b3Ioc3BlZWRZLCB0aGF0LmdldFNwZWVkKCkgKiAwLjYsIDAuNik7XHJcblxyXG5cdFx0XHRcdHJldHVybiBzcGVlZFk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChnZXREaXNjcmV0ZURpcmVjdGlvbigpID09PSAnc0Vhc3QnIHx8IGdldERpc2NyZXRlRGlyZWN0aW9uKCkgPT09ICdzV2VzdCcpIHtcclxuXHRcdFx0XHRzcGVlZFlGYWN0b3IgPSAwLjg1O1xyXG5cdFx0XHRcdHNwZWVkWSA9IGVhc2VTcGVlZFRvVGFyZ2V0VXNpbmdGYWN0b3Ioc3BlZWRZLCB0aGF0LmdldFNwZWVkKCkgKiAwLjg1LCAwLjg1KTtcclxuXHJcblx0XHRcdFx0cmV0dXJuIHNwZWVkWTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKGdldERpc2NyZXRlRGlyZWN0aW9uKCkgPT09ICdlYXN0JyB8fCBnZXREaXNjcmV0ZURpcmVjdGlvbigpID09PSAnd2VzdCcpIHtcclxuXHRcdFx0XHRzcGVlZFlGYWN0b3IgPSAxO1xyXG5cdFx0XHRcdHNwZWVkWSA9IDA7XHJcblxyXG5cdFx0XHRcdHJldHVybiBzcGVlZFk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIFNvIGl0IG11c3QgYmUgc291dGhcclxuXHJcblx0XHRcdHNwZWVkWSA9IGVhc2VTcGVlZFRvVGFyZ2V0VXNpbmdGYWN0b3Ioc3BlZWRZLCB0aGF0LmdldFNwZWVkKCksIHNwZWVkWUZhY3Rvcik7XHJcblxyXG5cdFx0XHRyZXR1cm4gc3BlZWRZO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGF0Lmhhc0hpdE9ic3RhY2xlID0gZnVuY3Rpb24gKG9icykge1xyXG5cdFx0XHRzZXRDcmFzaGVkKCk7XHJcblxyXG5cdFx0XHRpZiAobmF2aWdhdG9yLnZpYnJhdGUpIHtcclxuXHRcdFx0XHRuYXZpZ2F0b3IudmlicmF0ZSg1MDApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRvYnN0YWNsZXNIaXQucHVzaChvYnMuaWQpO1xyXG5cclxuXHRcdFx0dGhhdC5yZXNldFNwZWVkKCk7XHJcblx0XHRcdHRoYXQub25IaXRPYnN0YWNsZUNiKG9icyk7XHJcblxyXG5cdFx0XHRpZiAoY2FuY2VsYWJsZVN0YXRlVGltZW91dCkge1xyXG5cdFx0XHRcdGNsZWFyVGltZW91dChjYW5jZWxhYmxlU3RhdGVUaW1lb3V0KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRjYW5jZWxhYmxlU3RhdGVUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRzZXROb3JtYWwoKTtcclxuXHRcdFx0fSwgMTUwMCk7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoYXQuaGFzSGl0SnVtcCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0c2V0SnVtcGluZygpO1xyXG5cclxuXHRcdFx0aWYgKGNhbmNlbGFibGVTdGF0ZVRpbWVvdXQpIHtcclxuXHRcdFx0XHRjbGVhclRpbWVvdXQoY2FuY2VsYWJsZVN0YXRlVGltZW91dCk7XHJcblx0XHRcdH1cclxuXHRcdFx0Y2FuY2VsYWJsZVN0YXRlVGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0c2V0Tm9ybWFsKCk7XHJcblx0XHRcdH0sIDEwMDApO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGF0LmlzRWF0ZW5CeSA9IGZ1bmN0aW9uIChtb25zdGVyLCB3aGVuRWF0ZW4pIHtcclxuXHRcdFx0dGhhdC5oYXNIaXRPYnN0YWNsZShtb25zdGVyKTtcclxuXHRcdFx0bW9uc3Rlci5zdGFydEVhdGluZyh3aGVuRWF0ZW4pO1xyXG5cdFx0XHRvYnN0YWNsZXNIaXQucHVzaChtb25zdGVyLmlkKTtcclxuXHRcdFx0dGhhdC5pc01vdmluZyA9IGZhbHNlO1xyXG5cdFx0XHR0aGF0LmlzQmVpbmdFYXRlbiA9IHRydWU7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoYXQucmVzZXQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdG9ic3RhY2xlc0hpdCA9IFtdO1xyXG5cdFx0XHRwaXhlbHNUcmF2ZWxsZWQgPSAwO1xyXG5cdFx0XHR0aGF0LmlzTW92aW5nID0gdHJ1ZTtcclxuXHRcdFx0dGhhdC5pc0p1bXBpbmcgPSBmYWxzZTtcclxuXHRcdFx0dGhhdC5oYXNCZWVuSGl0ID0gZmFsc2U7XHJcblx0XHRcdGNhblNwZWVkQm9vc3QgPSB0cnVlO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGF0LnNldEhpdE9ic3RhY2xlQ2IgPSBmdW5jdGlvbiAoZm4pIHtcclxuXHRcdFx0dGhhdC5vbkhpdE9ic3RhY2xlQ2IgPSBmbiB8fCBmdW5jdGlvbigpIHt9O1xyXG5cdFx0fTtcclxuXHRcdHJldHVybiB0aGF0O1xyXG5cdH1cclxuXHJcblx0Z2xvYmFsLnNraWVyID0gU2tpZXI7XHJcbn0pKHRoaXMpO1xyXG5cclxuaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSB7XHJcblx0bW9kdWxlLmV4cG9ydHMgPSB0aGlzLnNraWVyO1xyXG59XHJcbiIsInZhciBTcHJpdGUgPSByZXF1aXJlKCcuL3Nwcml0ZScpO1xyXG5cclxuKGZ1bmN0aW9uKGdsb2JhbCkge1xyXG5cdGZ1bmN0aW9uIFNub3dib2FyZGVyKGRhdGEpIHtcclxuXHRcdHZhciB0aGF0ID0gbmV3IFNwcml0ZShkYXRhKTtcclxuXHRcdHZhciBzdXAgPSB7XHJcblx0XHRcdGRyYXc6IHRoYXQuc3VwZXJpb3IoJ2RyYXcnKSxcclxuXHRcdFx0Y3ljbGU6IHRoYXQuc3VwZXJpb3IoJ2N5Y2xlJylcclxuXHRcdH07XHJcblx0XHR2YXIgZGlyZWN0aW9ucyA9IHtcclxuXHRcdFx0c0Vhc3Q6IGZ1bmN0aW9uKHhEaWZmKSB7IHJldHVybiB4RGlmZiA+IDA7IH0sXHJcblx0XHRcdHNXZXN0OiBmdW5jdGlvbih4RGlmZikgeyByZXR1cm4geERpZmYgPD0gMDsgfVxyXG5cdFx0fTtcclxuXHRcdHZhciBzdGFuZGFyZFNwZWVkID0gMztcclxuXHJcblx0XHR0aGF0LnNldFNwZWVkKHN0YW5kYXJkU3BlZWQpO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGdldERpcmVjdGlvbigpIHtcclxuXHRcdFx0dmFyIHhEaWZmID0gdGhhdC5tb3ZpbmdUb3dhcmRbMF0gLSB0aGF0Lm1hcFBvc2l0aW9uWzBdO1xyXG5cdFx0XHR2YXIgeURpZmYgPSB0aGF0Lm1vdmluZ1Rvd2FyZFsxXSAtIHRoYXQubWFwUG9zaXRpb25bMV07XHJcblxyXG5cdFx0XHRpZiAoZGlyZWN0aW9ucy5zRWFzdCh4RGlmZikpIHtcclxuXHRcdFx0XHRyZXR1cm4gJ3NFYXN0JztcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXR1cm4gJ3NXZXN0JztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHRoYXQuY3ljbGUgPSBmdW5jdGlvbiAoZENvbnRleHQpIHtcclxuXHRcdFx0aWYgKE51bWJlci5yYW5kb20oMTApID09PSAxKSB7XHJcblx0XHRcdFx0dGhhdC5zZXRNYXBQb3NpdGlvblRhcmdldChkQ29udGV4dC5nZXRSYW5kb21seUluVGhlQ2VudHJlT2ZNYXAoKSk7XHJcblx0XHRcdFx0dGhhdC5zZXRTcGVlZChzdGFuZGFyZFNwZWVkICsgTnVtYmVyLnJhbmRvbSgtMSwgMSkpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGF0LnNldE1hcFBvc2l0aW9uVGFyZ2V0KHVuZGVmaW5lZCwgZENvbnRleHQuZ2V0TWFwQmVsb3dWaWV3cG9ydCgpICsgNjAwKTtcclxuXHJcblx0XHRcdHN1cC5jeWNsZSgpO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGF0LmRyYXcgPSBmdW5jdGlvbihkQ29udGV4dCkge1xyXG5cdFx0XHR2YXIgc3ByaXRlUGFydFRvVXNlID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHJldHVybiBnZXREaXJlY3Rpb24oKTtcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdHJldHVybiBzdXAuZHJhdyhkQ29udGV4dCwgc3ByaXRlUGFydFRvVXNlKCkpO1xyXG5cdFx0fTtcclxuXHJcblx0XHRyZXR1cm4gdGhhdDtcclxuXHR9XHJcblxyXG5cdGdsb2JhbC5zbm93Ym9hcmRlciA9IFNub3dib2FyZGVyO1xyXG59KSggdGhpcyApO1xyXG5cclxuXHJcbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykge1xyXG5cdG1vZHVsZS5leHBvcnRzID0gdGhpcy5zbm93Ym9hcmRlcjtcclxufSIsIihmdW5jdGlvbiAoZ2xvYmFsKSB7XHJcblx0dmFyIEdVSUQgPSByZXF1aXJlKCcuL2d1aWQnKTtcclxuXHRmdW5jdGlvbiBTcHJpdGUgKGRhdGEpIHtcclxuXHRcdHZhciBoaXR0YWJsZU9iamVjdHMgPSB7fTtcclxuXHRcdHZhciB6SW5kZXhlc09jY3VwaWVkID0gWyAwIF07XHJcblx0XHR2YXIgdGhhdCA9IHRoaXM7XHJcblx0XHR2YXIgdHJhY2tlZFNwcml0ZVRvTW92ZVRvd2FyZDtcclxuXHRcdHRoYXQuZGlyZWN0aW9uID0gdW5kZWZpbmVkO1xyXG5cdFx0dGhhdC5tYXBQb3NpdGlvbiA9IFswLCAwLCAwXTtcclxuXHRcdHRoYXQuaWQgPSBHVUlEKCk7XHJcblx0XHR0aGF0LmNhbnZhc1ggPSAwO1xyXG5cdFx0dGhhdC5jYW52YXNZID0gMDtcclxuXHRcdHRoYXQuY2FudmFzWiA9IDA7XHJcblx0XHR0aGF0LmhlaWdodCA9IDA7XHJcblx0XHR0aGF0LnNwZWVkID0gMDtcclxuXHRcdHRoYXQuZGF0YSA9IGRhdGEgfHwgeyBwYXJ0cyA6IHt9IH07XHJcblx0XHR0aGF0Lm1vdmluZ1Rvd2FyZCA9IFsgMCwgMCBdO1xyXG5cdFx0dGhhdC5tZXRyZXNEb3duVGhlTW91bnRhaW4gPSAwO1xyXG5cdFx0dGhhdC5tb3ZpbmdXaXRoQ29udmljdGlvbiA9IGZhbHNlO1xyXG5cdFx0dGhhdC5kZWxldGVkID0gZmFsc2U7XHJcblx0XHR0aGF0Lm1heEhlaWdodCA9IChmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHJldHVybiBPYmplY3QudmFsdWVzKHRoYXQuZGF0YS5wYXJ0cykubWFwKGZ1bmN0aW9uIChwKSB7IHJldHVybiBwWzNdOyB9KS5tYXgoKTtcclxuXHRcdH0oKSk7XHJcblx0XHR0aGF0LmlzTW92aW5nID0gdHJ1ZTtcclxuXHJcblx0XHRpZiAoIXRoYXQuZGF0YS5wYXJ0cykge1xyXG5cdFx0XHR0aGF0LmRhdGEucGFydHMgPSB7fTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoZGF0YSAmJiBkYXRhLmlkKXtcclxuXHRcdFx0dGhhdC5pZCA9IGRhdGEuaWQ7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGRhdGEgJiYgZGF0YS56SW5kZXhlc09jY3VwaWVkKSB7XHJcblx0XHRcdHpJbmRleGVzT2NjdXBpZWQgPSBkYXRhLnpJbmRleGVzT2NjdXBpZWQ7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gaW5jcmVtZW50WChhbW91bnQpIHtcclxuXHRcdFx0dGhhdC5jYW52YXNYICs9IGFtb3VudC50b051bWJlcigpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIGluY3JlbWVudFkoYW1vdW50KSB7XHJcblx0XHRcdHRoYXQuY2FudmFzWSArPSBhbW91bnQudG9OdW1iZXIoKTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBnZXRIaXRCb3goZm9yWkluZGV4KSB7XHJcblx0XHRcdGlmICh0aGF0LmRhdGEuaGl0Qm94ZXMpIHtcclxuXHRcdFx0XHRpZiAoZGF0YS5oaXRCb3hlc1tmb3JaSW5kZXhdKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZGF0YS5oaXRCb3hlc1tmb3JaSW5kZXhdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIHJvdW5kSGFsZihudW0pIHtcclxuXHRcdFx0bnVtID0gTWF0aC5yb3VuZChudW0qMikvMjtcclxuXHRcdFx0cmV0dXJuIG51bTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBtb3ZlKCkge1xyXG5cdFx0XHRpZiAoIXRoYXQuaXNNb3ZpbmcpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBjdXJyZW50WCA9IHRoYXQubWFwUG9zaXRpb25bMF07XHJcblx0XHRcdHZhciBjdXJyZW50WSA9IHRoYXQubWFwUG9zaXRpb25bMV07XHJcblxyXG5cdFx0XHRpZiAodHlwZW9mIHRoYXQuZGlyZWN0aW9uICE9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHRcdC8vIEZvciB0aGlzIHdlIG5lZWQgdG8gbW9kaWZ5IHRoZSB0aGF0LmRpcmVjdGlvbiBzbyBpdCByZWxhdGVzIHRvIHRoZSBob3Jpem9udGFsXHJcblx0XHRcdFx0dmFyIGQgPSB0aGF0LmRpcmVjdGlvbiAtIDkwO1xyXG5cdFx0XHRcdGlmIChkIDwgMCkgZCA9IDM2MCArIGQ7XHJcblx0XHRcdFx0Y3VycmVudFggKz0gcm91bmRIYWxmKHRoYXQuc3BlZWQgKiBNYXRoLmNvcyhkICogKE1hdGguUEkgLyAxODApKSk7XHJcblx0XHRcdFx0Y3VycmVudFkgKz0gcm91bmRIYWxmKHRoYXQuc3BlZWQgKiBNYXRoLnNpbihkICogKE1hdGguUEkgLyAxODApKSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0aWYgKHR5cGVvZiB0aGF0Lm1vdmluZ1Rvd2FyZFswXSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0XHRcdGlmIChjdXJyZW50WCA+IHRoYXQubW92aW5nVG93YXJkWzBdKSB7XHJcblx0XHRcdFx0XHRcdGN1cnJlbnRYIC09IE1hdGgubWluKHRoYXQuZ2V0U3BlZWRYKCksIE1hdGguYWJzKGN1cnJlbnRYIC0gdGhhdC5tb3ZpbmdUb3dhcmRbMF0pKTtcclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoY3VycmVudFggPCB0aGF0Lm1vdmluZ1Rvd2FyZFswXSkge1xyXG5cdFx0XHRcdFx0XHRjdXJyZW50WCArPSBNYXRoLm1pbih0aGF0LmdldFNwZWVkWCgpLCBNYXRoLmFicyhjdXJyZW50WCAtIHRoYXQubW92aW5nVG93YXJkWzBdKSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGlmICh0eXBlb2YgdGhhdC5tb3ZpbmdUb3dhcmRbMV0gIT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdFx0XHRpZiAoY3VycmVudFkgPiB0aGF0Lm1vdmluZ1Rvd2FyZFsxXSkge1xyXG5cdFx0XHRcdFx0XHRjdXJyZW50WSAtPSBNYXRoLm1pbih0aGF0LmdldFNwZWVkWSgpLCBNYXRoLmFicyhjdXJyZW50WSAtIHRoYXQubW92aW5nVG93YXJkWzFdKSk7XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGN1cnJlbnRZIDwgdGhhdC5tb3ZpbmdUb3dhcmRbMV0pIHtcclxuXHRcdFx0XHRcdFx0Y3VycmVudFkgKz0gTWF0aC5taW4odGhhdC5nZXRTcGVlZFkoKSwgTWF0aC5hYnMoY3VycmVudFkgLSB0aGF0Lm1vdmluZ1Rvd2FyZFsxXSkpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhhdC5zZXRNYXBQb3NpdGlvbihjdXJyZW50WCwgY3VycmVudFkpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuZHJhdyA9IGZ1bmN0aW9uIChkQ3R4LCBzcHJpdGVGcmFtZSkge1xyXG5cdFx0XHR2YXIgZnIgPSB0aGF0LmRhdGEucGFydHNbc3ByaXRlRnJhbWVdO1xyXG5cdFx0XHR0aGF0LmhlaWdodCA9IGZyWzNdO1xyXG5cdFx0XHR0aGF0LndpZHRoID0gZnJbMl07XHJcblxyXG5cdFx0XHR2YXIgbmV3Q2FudmFzUG9zaXRpb24gPSBkQ3R4Lm1hcFBvc2l0aW9uVG9DYW52YXNQb3NpdGlvbih0aGF0Lm1hcFBvc2l0aW9uKTtcclxuXHRcdFx0dGhhdC5zZXRDYW52YXNQb3NpdGlvbihuZXdDYW52YXNQb3NpdGlvblswXSwgbmV3Q2FudmFzUG9zaXRpb25bMV0pO1xyXG5cclxuXHRcdFx0ZEN0eC5kcmF3SW1hZ2UoZEN0eC5nZXRMb2FkZWRJbWFnZSh0aGF0LmRhdGEuJGltYWdlRmlsZSksIGZyWzBdLCBmclsxXSwgZnJbMl0sIGZyWzNdLCB0aGF0LmNhbnZhc1gsIHRoYXQuY2FudmFzWSwgZnJbMl0sIGZyWzNdKTtcclxuXHRcdH07XHJcblxyXG5cdFx0dGhpcy5zZXRNYXBQb3NpdGlvbiA9IGZ1bmN0aW9uICh4LCB5LCB6KSB7XHJcblx0XHRcdGlmICh0eXBlb2YgeCA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0XHR4ID0gdGhhdC5tYXBQb3NpdGlvblswXTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAodHlwZW9mIHkgPT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdFx0eSA9IHRoYXQubWFwUG9zaXRpb25bMV07XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHR5cGVvZiB6ID09PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHRcdHogPSB0aGF0Lm1hcFBvc2l0aW9uWzJdO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoYXQuekluZGV4ZXNPY2N1cGllZCA9IFsgeiBdO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoYXQubWFwUG9zaXRpb24gPSBbeCwgeSwgel07XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuc2V0Q2FudmFzUG9zaXRpb24gPSBmdW5jdGlvbiAoY3gsIGN5KSB7XHJcblx0XHRcdGlmIChjeCkge1xyXG5cdFx0XHRcdGlmIChPYmplY3QuaXNTdHJpbmcoY3gpICYmIChjeC5maXJzdCgpID09PSAnKycgfHwgY3guZmlyc3QoKSA9PT0gJy0nKSkgaW5jcmVtZW50WChjeCk7XHJcblx0XHRcdFx0ZWxzZSB0aGF0LmNhbnZhc1ggPSBjeDtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0aWYgKGN5KSB7XHJcblx0XHRcdFx0aWYgKE9iamVjdC5pc1N0cmluZyhjeSkgJiYgKGN5LmZpcnN0KCkgPT09ICcrJyB8fCBjeS5maXJzdCgpID09PSAnLScpKSBpbmNyZW1lbnRZKGN5KTtcclxuXHRcdFx0XHRlbHNlIHRoYXQuY2FudmFzWSA9IGN5O1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuZ2V0Q2FudmFzUG9zaXRpb25YID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRyZXR1cm4gdGhhdC5jYW52YXNYO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLmdldENhbnZhc1Bvc2l0aW9uWSA9IGZ1bmN0aW9uICAoKSB7XHJcblx0XHRcdHJldHVybiB0aGF0LmNhbnZhc1k7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuZ2V0TGVmdEhpdEJveEVkZ2UgPSBmdW5jdGlvbiAoekluZGV4KSB7XHJcblx0XHRcdHpJbmRleCA9IHpJbmRleCB8fCAwO1xyXG5cdFx0XHR2YXIgbGhiZSA9IHRoaXMuZ2V0Q2FudmFzUG9zaXRpb25YKCk7XHJcblx0XHRcdGlmIChnZXRIaXRCb3goekluZGV4KSkge1xyXG5cdFx0XHRcdGxoYmUgKz0gZ2V0SGl0Qm94KHpJbmRleClbMF07XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGxoYmU7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuZ2V0VG9wSGl0Qm94RWRnZSA9IGZ1bmN0aW9uICh6SW5kZXgpIHtcclxuXHRcdFx0ekluZGV4ID0gekluZGV4IHx8IDA7XHJcblx0XHRcdHZhciB0aGJlID0gdGhpcy5nZXRDYW52YXNQb3NpdGlvblkoKTtcclxuXHRcdFx0aWYgKGdldEhpdEJveCh6SW5kZXgpKSB7XHJcblx0XHRcdFx0dGhiZSArPSBnZXRIaXRCb3goekluZGV4KVsxXTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gdGhiZTtcclxuXHRcdH07XHJcblxyXG5cdFx0dGhpcy5nZXRSaWdodEhpdEJveEVkZ2UgPSBmdW5jdGlvbiAoekluZGV4KSB7XHJcblx0XHRcdHpJbmRleCA9IHpJbmRleCB8fCAwO1xyXG5cclxuXHRcdFx0aWYgKGdldEhpdEJveCh6SW5kZXgpKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoYXQuY2FudmFzWCArIGdldEhpdEJveCh6SW5kZXgpWzJdO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhhdC5jYW52YXNYICsgdGhhdC53aWR0aDtcclxuXHRcdH07XHJcblxyXG5cdFx0dGhpcy5nZXRCb3R0b21IaXRCb3hFZGdlID0gZnVuY3Rpb24gKHpJbmRleCkge1xyXG5cdFx0XHR6SW5kZXggPSB6SW5kZXggfHwgMDtcclxuXHJcblx0XHRcdGlmIChnZXRIaXRCb3goekluZGV4KSkge1xyXG5cdFx0XHRcdHJldHVybiB0aGF0LmNhbnZhc1kgKyBnZXRIaXRCb3goekluZGV4KVszXTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHRoYXQuY2FudmFzWSArIHRoYXQuaGVpZ2h0O1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLmdldFBvc2l0aW9uSW5Gcm9udE9mID0gZnVuY3Rpb24gICgpIHtcclxuXHRcdFx0cmV0dXJuIFt0aGF0LmNhbnZhc1gsIHRoYXQuY2FudmFzWSArIHRoYXQuaGVpZ2h0XTtcclxuXHRcdH07XHJcblxyXG5cdFx0dGhpcy5zZXRTcGVlZCA9IGZ1bmN0aW9uIChzKSB7XHJcblx0XHRcdHRoYXQuc3BlZWQgPSBzO1xyXG5cdFx0XHR0aGF0LnNwZWVkWCA9IHM7XHJcblx0XHRcdHRoYXQuc3BlZWRZID0gcztcclxuXHRcdH07XHJcblxyXG5cdFx0dGhpcy5pbmNyZW1lbnRTcGVlZEJ5ID0gZnVuY3Rpb24gKHMpIHtcclxuXHRcdFx0dGhhdC5zcGVlZCArPSBzO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGF0LmdldFNwZWVkID0gZnVuY3Rpb24gZ2V0U3BlZWQgKCkge1xyXG5cdFx0XHRyZXR1cm4gdGhhdC5zcGVlZDtcclxuXHRcdH07XHJcblxyXG5cdFx0dGhhdC5nZXRTcGVlZFggPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHJldHVybiB0aGF0LnNwZWVkO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGF0LmdldFNwZWVkWSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0cmV0dXJuIHRoYXQuc3BlZWQ7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuc2V0SGVpZ2h0ID0gZnVuY3Rpb24gKGgpIHtcclxuXHRcdFx0dGhhdC5oZWlnaHQgPSBoO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLnNldFdpZHRoID0gZnVuY3Rpb24gKHcpIHtcclxuXHRcdFx0dGhhdC53aWR0aCA9IHc7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuZ2V0TWF4SGVpZ2h0ID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRyZXR1cm4gdGhhdC5tYXhIZWlnaHQ7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoYXQuZ2V0TW92aW5nVG93YXJkT3Bwb3NpdGUgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGlmICghdGhhdC5pc01vdmluZykge1xyXG5cdFx0XHRcdHJldHVybiBbMCwgMF07XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBkeCA9ICh0aGF0Lm1vdmluZ1Rvd2FyZFswXSAtIHRoYXQubWFwUG9zaXRpb25bMF0pO1xyXG5cdFx0XHR2YXIgZHkgPSAodGhhdC5tb3ZpbmdUb3dhcmRbMV0gLSB0aGF0Lm1hcFBvc2l0aW9uWzFdKTtcclxuXHJcblx0XHRcdHZhciBvcHBvc2l0ZVggPSAoTWF0aC5hYnMoZHgpID4gNzUgPyAwIC0gZHggOiAwKTtcclxuXHRcdFx0dmFyIG9wcG9zaXRlWSA9IC1keTtcclxuXHJcblx0XHRcdHJldHVybiBbIG9wcG9zaXRlWCwgb3Bwb3NpdGVZIF07XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuY2hlY2tIaXR0YWJsZU9iamVjdHMgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdE9iamVjdC5rZXlzKGhpdHRhYmxlT2JqZWN0cywgZnVuY3Rpb24gKGssIG9iamVjdERhdGEpIHtcclxuXHRcdFx0XHRpZiAob2JqZWN0RGF0YS5vYmplY3QuZGVsZXRlZCkge1xyXG5cdFx0XHRcdFx0ZGVsZXRlIGhpdHRhYmxlT2JqZWN0c1trXTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0aWYgKG9iamVjdERhdGEub2JqZWN0LmhpdHModGhhdCkpIHtcclxuXHRcdFx0XHRcdFx0b2JqZWN0RGF0YS5jYWxsYmFja3MuZWFjaChmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuXHRcdFx0XHRcdFx0XHRjYWxsYmFjayh0aGF0LCBvYmplY3REYXRhLm9iamVjdCk7XHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuY3ljbGUgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHRoYXQuY2hlY2tIaXR0YWJsZU9iamVjdHMoKTtcclxuXHJcblx0XHRcdGlmICh0cmFja2VkU3ByaXRlVG9Nb3ZlVG93YXJkKSB7XHJcblx0XHRcdFx0dGhhdC5zZXRNYXBQb3NpdGlvblRhcmdldCh0cmFja2VkU3ByaXRlVG9Nb3ZlVG93YXJkLm1hcFBvc2l0aW9uWzBdLCB0cmFja2VkU3ByaXRlVG9Nb3ZlVG93YXJkLm1hcFBvc2l0aW9uWzFdLCB0cnVlKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bW92ZSgpO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLnNldE1hcFBvc2l0aW9uVGFyZ2V0ID0gZnVuY3Rpb24gKHgsIHksIG92ZXJyaWRlKSB7XHJcblx0XHRcdGlmIChvdmVycmlkZSkge1xyXG5cdFx0XHRcdHRoYXQubW92aW5nV2l0aENvbnZpY3Rpb24gPSBmYWxzZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKCF0aGF0Lm1vdmluZ1dpdGhDb252aWN0aW9uKSB7XHJcblx0XHRcdFx0aWYgKHR5cGVvZiB4ID09PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHRcdFx0eCA9IHRoYXQubW92aW5nVG93YXJkWzBdO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKHR5cGVvZiB5ID09PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHRcdFx0eSA9IHRoYXQubW92aW5nVG93YXJkWzFdO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dGhhdC5tb3ZpbmdUb3dhcmQgPSBbIHgsIHkgXTtcclxuXHJcblx0XHRcdFx0dGhhdC5tb3ZpbmdXaXRoQ29udmljdGlvbiA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyB0aGF0LnJlc2V0RGlyZWN0aW9uKCk7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuc2V0RGlyZWN0aW9uID0gZnVuY3Rpb24gKGFuZ2xlKSB7XHJcblx0XHRcdGlmIChhbmdsZSA+PSAzNjApIHtcclxuXHRcdFx0XHRhbmdsZSA9IDM2MCAtIGFuZ2xlO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoYXQuZGlyZWN0aW9uID0gYW5nbGU7XHJcblx0XHRcdHRoYXQubW92aW5nVG93YXJkID0gdW5kZWZpbmVkO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLnJlc2V0RGlyZWN0aW9uID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHR0aGF0LmRpcmVjdGlvbiA9IHVuZGVmaW5lZDtcclxuXHRcdH07XHJcblxyXG5cdFx0dGhpcy5zZXRNYXBQb3NpdGlvblRhcmdldFdpdGhDb252aWN0aW9uID0gZnVuY3Rpb24gKGN4LCBjeSkge1xyXG5cdFx0XHR0aGF0LnNldE1hcFBvc2l0aW9uVGFyZ2V0KGN4LCBjeSk7XHJcblx0XHRcdHRoYXQubW92aW5nV2l0aENvbnZpY3Rpb24gPSB0cnVlO1xyXG5cdFx0XHQvLyB0aGF0LnJlc2V0RGlyZWN0aW9uKCk7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuZm9sbG93ID0gZnVuY3Rpb24gKHNwcml0ZSkge1xyXG5cdFx0XHR0cmFja2VkU3ByaXRlVG9Nb3ZlVG93YXJkID0gc3ByaXRlO1xyXG5cdFx0XHQvLyB0aGF0LnJlc2V0RGlyZWN0aW9uKCk7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuc3RvcEZvbGxvd2luZyA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0dHJhY2tlZFNwcml0ZVRvTW92ZVRvd2FyZCA9IGZhbHNlO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLm9uSGl0dGluZyA9IGZ1bmN0aW9uIChvYmplY3RUb0hpdCwgY2FsbGJhY2spIHtcclxuXHRcdFx0aWYgKGhpdHRhYmxlT2JqZWN0c1tvYmplY3RUb0hpdC5pZF0pIHtcclxuXHRcdFx0XHRyZXR1cm4gaGl0dGFibGVPYmplY3RzW29iamVjdFRvSGl0LmlkXS5jYWxsYmFja3MucHVzaChjYWxsYmFjayk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGhpdHRhYmxlT2JqZWN0c1tvYmplY3RUb0hpdC5pZF0gPSB7XHJcblx0XHRcdFx0b2JqZWN0OiBvYmplY3RUb0hpdCxcclxuXHRcdFx0XHRjYWxsYmFja3M6IFsgY2FsbGJhY2sgXVxyXG5cdFx0XHR9O1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLmRlbGV0ZU9uTmV4dEN5Y2xlID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHR0aGF0LmRlbGV0ZWQgPSB0cnVlO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLm9jY3VwaWVzWkluZGV4ID0gZnVuY3Rpb24gKHopIHtcclxuXHRcdFx0cmV0dXJuIHpJbmRleGVzT2NjdXBpZWQuaW5kZXhPZih6KSA+PSAwO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLmhpdHMgPSBmdW5jdGlvbiAob3RoZXIpIHtcclxuXHRcdFx0dmFyIHZlcnRpY2FsSW50ZXJzZWN0ID0gZmFsc2U7XHJcblx0XHRcdHZhciBob3Jpem9udGFsSW50ZXJzZWN0ID0gZmFsc2U7XHJcblxyXG5cdFx0XHQvLyBUZXN0IHRoYXQgVEhJUyBoYXMgYSBib3R0b20gZWRnZSBpbnNpZGUgb2YgdGhlIG90aGVyIG9iamVjdFxyXG5cdFx0XHRpZiAob3RoZXIuZ2V0VG9wSGl0Qm94RWRnZSh0aGF0Lm1hcFBvc2l0aW9uWzJdKSA8PSB0aGF0LmdldEJvdHRvbUhpdEJveEVkZ2UodGhhdC5tYXBQb3NpdGlvblsyXSkgJiYgb3RoZXIuZ2V0Qm90dG9tSGl0Qm94RWRnZSh0aGF0Lm1hcFBvc2l0aW9uWzJdKSA+PSB0aGF0LmdldEJvdHRvbUhpdEJveEVkZ2UodGhhdC5tYXBQb3NpdGlvblsyXSkpIHtcclxuXHRcdFx0XHR2ZXJ0aWNhbEludGVyc2VjdCA9IHRydWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIFRlc3QgdGhhdCBUSElTIGhhcyBhIHRvcCBlZGdlIGluc2lkZSBvZiB0aGUgb3RoZXIgb2JqZWN0XHJcblx0XHRcdGlmIChvdGhlci5nZXRUb3BIaXRCb3hFZGdlKHRoYXQubWFwUG9zaXRpb25bMl0pIDw9IHRoYXQuZ2V0VG9wSGl0Qm94RWRnZSh0aGF0Lm1hcFBvc2l0aW9uWzJdKSAmJiBvdGhlci5nZXRCb3R0b21IaXRCb3hFZGdlKHRoYXQubWFwUG9zaXRpb25bMl0pID49IHRoYXQuZ2V0VG9wSGl0Qm94RWRnZSh0aGF0Lm1hcFBvc2l0aW9uWzJdKSkge1xyXG5cdFx0XHRcdHZlcnRpY2FsSW50ZXJzZWN0ID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gVGVzdCB0aGF0IFRISVMgaGFzIGEgcmlnaHQgZWRnZSBpbnNpZGUgb2YgdGhlIG90aGVyIG9iamVjdFxyXG5cdFx0XHRpZiAob3RoZXIuZ2V0TGVmdEhpdEJveEVkZ2UodGhhdC5tYXBQb3NpdGlvblsyXSkgPD0gdGhhdC5nZXRSaWdodEhpdEJveEVkZ2UodGhhdC5tYXBQb3NpdGlvblsyXSkgJiYgb3RoZXIuZ2V0UmlnaHRIaXRCb3hFZGdlKHRoYXQubWFwUG9zaXRpb25bMl0pID49IHRoYXQuZ2V0UmlnaHRIaXRCb3hFZGdlKHRoYXQubWFwUG9zaXRpb25bMl0pKSB7XHJcblx0XHRcdFx0aG9yaXpvbnRhbEludGVyc2VjdCA9IHRydWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIFRlc3QgdGhhdCBUSElTIGhhcyBhIGxlZnQgZWRnZSBpbnNpZGUgb2YgdGhlIG90aGVyIG9iamVjdFxyXG5cdFx0XHRpZiAob3RoZXIuZ2V0TGVmdEhpdEJveEVkZ2UodGhhdC5tYXBQb3NpdGlvblsyXSkgPD0gdGhhdC5nZXRMZWZ0SGl0Qm94RWRnZSh0aGF0Lm1hcFBvc2l0aW9uWzJdKSAmJiBvdGhlci5nZXRSaWdodEhpdEJveEVkZ2UodGhhdC5tYXBQb3NpdGlvblsyXSkgPj0gdGhhdC5nZXRMZWZ0SGl0Qm94RWRnZSh0aGF0Lm1hcFBvc2l0aW9uWzJdKSkge1xyXG5cdFx0XHRcdGhvcml6b250YWxJbnRlcnNlY3QgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdmVydGljYWxJbnRlcnNlY3QgJiYgaG9yaXpvbnRhbEludGVyc2VjdDtcclxuXHRcdH07XHJcblxyXG5cdFx0dGhpcy5pc0Fib3ZlT25DYW52YXMgPSBmdW5jdGlvbiAoY3kpIHtcclxuXHRcdFx0cmV0dXJuICh0aGF0LmNhbnZhc1kgKyB0aGF0LmhlaWdodCkgPCBjeTtcclxuXHRcdH07XHJcblxyXG5cdFx0dGhpcy5pc0JlbG93T25DYW52YXMgPSBmdW5jdGlvbiAoY3kpIHtcclxuXHRcdFx0cmV0dXJuICh0aGF0LmNhbnZhc1kpID4gY3k7XHJcblx0XHR9O1xyXG5cclxuXHRcdHJldHVybiB0aGF0O1xyXG5cdH1cclxuXHJcblx0U3ByaXRlLmNyZWF0ZU9iamVjdHMgPSBmdW5jdGlvbiBjcmVhdGVPYmplY3RzKHNwcml0ZUluZm9BcnJheSwgb3B0cykge1xyXG5cdFx0aWYgKCFBcnJheS5pc0FycmF5KHNwcml0ZUluZm9BcnJheSkpIHNwcml0ZUluZm9BcnJheSA9IFsgc3ByaXRlSW5mb0FycmF5IF07XHJcblx0XHRvcHRzID0gT2JqZWN0Lm1lcmdlKG9wdHMsIHtcclxuXHRcdFx0cmF0ZU1vZGlmaWVyOiAwLFxyXG5cdFx0XHRkcm9wUmF0ZTogMSxcclxuXHRcdFx0cG9zaXRpb246IFswLCAwXVxyXG5cdFx0fSwgZmFsc2UsIGZhbHNlKTtcclxuXHJcblx0XHRmdW5jdGlvbiBjcmVhdGVPbmUgKHNwcml0ZUluZm8pIHtcclxuXHRcdFx0dmFyIHBvc2l0aW9uID0gb3B0cy5wb3NpdGlvbjtcclxuXHRcdFx0aWYgKE51bWJlci5yYW5kb20oMTAwICsgb3B0cy5yYXRlTW9kaWZpZXIpIDw9IHNwcml0ZUluZm8uZHJvcFJhdGUpIHtcclxuXHRcdFx0XHR2YXIgc3ByaXRlID0gbmV3IFNwcml0ZShzcHJpdGVJbmZvLnNwcml0ZSk7XHJcblx0XHRcdFx0c3ByaXRlLnNldFNwZWVkKDApO1xyXG5cclxuXHRcdFx0XHRpZiAoT2JqZWN0LmlzRnVuY3Rpb24ocG9zaXRpb24pKSB7XHJcblx0XHRcdFx0XHRwb3NpdGlvbiA9IHBvc2l0aW9uKCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRzcHJpdGUuc2V0TWFwUG9zaXRpb24ocG9zaXRpb25bMF0sIHBvc2l0aW9uWzFdKTtcclxuXHJcblx0XHRcdFx0aWYgKHNwcml0ZUluZm8uc3ByaXRlLmhpdEJlaGF2aW91ciAmJiBzcHJpdGVJbmZvLnNwcml0ZS5oaXRCZWhhdmlvdXIuc2tpZXIgJiYgb3B0cy5wbGF5ZXIpIHtcclxuXHRcdFx0XHRcdHNwcml0ZS5vbkhpdHRpbmcob3B0cy5wbGF5ZXIsIHNwcml0ZUluZm8uc3ByaXRlLmhpdEJlaGF2aW91ci5za2llcik7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRyZXR1cm4gc3ByaXRlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIG9iamVjdHMgPSBzcHJpdGVJbmZvQXJyYXkubWFwKGNyZWF0ZU9uZSkucmVtb3ZlKHVuZGVmaW5lZCk7XHJcblxyXG5cdFx0cmV0dXJuIG9iamVjdHM7XHJcblx0fTtcclxuXHJcblx0Z2xvYmFsLnNwcml0ZSA9IFNwcml0ZTtcclxufSkoIHRoaXMgKTtcclxuXHJcblxyXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRtb2R1bGUuZXhwb3J0cyA9IHRoaXMuc3ByaXRlO1xyXG59IiwiKGZ1bmN0aW9uIChnbG9iYWwpIHtcclxuXHRmdW5jdGlvbiBTcHJpdGVBcnJheSgpIHtcclxuXHRcdHRoaXMucHVzaEhhbmRsZXJzID0gW107XHJcblxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRTcHJpdGVBcnJheS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEFycmF5LnByb3RvdHlwZSk7XHJcblxyXG5cdFNwcml0ZUFycmF5LnByb3RvdHlwZS5vblB1c2ggPSBmdW5jdGlvbihmLCByZXRyb2FjdGl2ZSkge1xyXG5cdFx0dGhpcy5wdXNoSGFuZGxlcnMucHVzaChmKTtcclxuXHJcblx0XHRpZiAocmV0cm9hY3RpdmUpIHtcclxuXHRcdFx0dGhpcy5lYWNoKGYpO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdFNwcml0ZUFycmF5LnByb3RvdHlwZS5wdXNoID0gZnVuY3Rpb24ob2JqKSB7XHJcblx0XHRBcnJheS5wcm90b3R5cGUucHVzaC5jYWxsKHRoaXMsIG9iaik7XHJcblx0XHR0aGlzLnB1c2hIYW5kbGVycy5lYWNoKGZ1bmN0aW9uKGhhbmRsZXIpIHtcclxuXHRcdFx0aGFuZGxlcihvYmopO1xyXG5cdFx0fSk7XHJcblx0fTtcclxuXHJcblx0U3ByaXRlQXJyYXkucHJvdG90eXBlLmN1bGwgPSBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuZWFjaChmdW5jdGlvbiAob2JqLCBpKSB7XHJcblx0XHRcdGlmIChvYmouZGVsZXRlZCkge1xyXG5cdFx0XHRcdHJldHVybiAoZGVsZXRlIHRoaXNbaV0pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9O1xyXG5cclxuXHRnbG9iYWwuc3ByaXRlQXJyYXkgPSBTcHJpdGVBcnJheTtcclxufSkodGhpcyk7XHJcblxyXG5cclxuaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSB7XHJcblx0bW9kdWxlLmV4cG9ydHMgPSB0aGlzLnNwcml0ZUFycmF5O1xyXG59IiwiLy8gR2xvYmFsIGRlcGVuZGVuY2llcyB3aGljaCByZXR1cm4gbm8gbW9kdWxlc1xyXG5yZXF1aXJlKCcuL2xpYi9jYW52YXNSZW5kZXJpbmdDb250ZXh0MkRFeHRlbnNpb25zJyk7XHJcbnJlcXVpcmUoJy4vbGliL2V4dGVuZGVycycpO1xyXG5yZXF1aXJlKCcuL2xpYi9wbHVnaW5zJyk7XHJcblxyXG4vLyBFeHRlcm5hbCBkZXBlbmRlbmNpZXNcclxudmFyIEhhbW1lciA9IHJlcXVpcmUoJ2hhbW1lcmpzJyk7XHJcbnZhciBNb3VzZXRyYXAgPSByZXF1aXJlKCdici1tb3VzZXRyYXAnKTtcclxuXHJcbi8vIE1ldGhvZCBtb2R1bGVzXHJcbnZhciBpc01vYmlsZURldmljZSA9IHJlcXVpcmUoJy4vbGliL2lzTW9iaWxlRGV2aWNlJyk7XHJcblxyXG4vLyBHYW1lIE9iamVjdHNcclxudmFyIFNwcml0ZUFycmF5ID0gcmVxdWlyZSgnLi9saWIvc3ByaXRlQXJyYXknKTtcclxudmFyIE1vbnN0ZXIgPSByZXF1aXJlKCcuL2xpYi9tb25zdGVyJyk7XHJcbnZhciBTcHJpdGUgPSByZXF1aXJlKCcuL2xpYi9zcHJpdGUnKTtcclxudmFyIFNub3dib2FyZGVyID0gcmVxdWlyZSgnLi9saWIvc25vd2JvYXJkZXInKTtcclxudmFyIFNraWVyID0gcmVxdWlyZSgnLi9saWIvc2tpZXInKTtcclxudmFyIEluZm9Cb3ggPSByZXF1aXJlKCcuL2xpYi9pbmZvQm94Jyk7XHJcbnZhciBHYW1lID0gcmVxdWlyZSgnLi9saWIvZ2FtZScpO1xyXG5cclxuLy8gTG9jYWwgdmFyaWFibGVzIGZvciBzdGFydGluZyB0aGUgZ2FtZVxyXG52YXIgbWFpbkNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdza2lmcmVlLWNhbnZhcycpO1xyXG52YXIgZENvbnRleHQgPSBtYWluQ2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcbnZhciBpbWFnZVNvdXJjZXMgPSBbICdzcHJpdGUtY2hhcmFjdGVycy5wbmcnLCAnc2tpZnJlZS1vYmplY3RzLnBuZycgXTtcclxudmFyIGdsb2JhbCA9IHRoaXM7XHJcbnZhciBpbmZvQm94Q29udHJvbHMgPSAnVXNlIHRoZSBtb3VzZSBvciBXQVNEIHRvIGNvbnRyb2wgdGhlIHBsYXllcic7XHJcbmlmIChpc01vYmlsZURldmljZSgpKSBpbmZvQm94Q29udHJvbHMgPSAnVGFwIG9yIGRyYWcgb24gdGhlIHBpc3RlIHRvIGNvbnRyb2wgdGhlIHBsYXllcic7XHJcbnZhciBzcHJpdGVzID0gcmVxdWlyZSgnLi9zcHJpdGVJbmZvJyk7XHJcblxyXG52YXIgcGl4ZWxzUGVyTWV0cmUgPSAxODtcclxudmFyIGRpc3RhbmNlVHJhdmVsbGVkSW5NZXRyZXMgPSAwO1xyXG52YXIgbW9uc3RlckRpc3RhbmNlVGhyZXNob2xkID0gMjAwMDtcclxudmFyIGxpdmVzTGVmdCA9IDU7XHJcbnZhciBoaWdoU2NvcmUgPSAwO1xyXG52YXIgbG9zZUxpZmVPbk9ic3RhY2xlSGl0ID0gZmFsc2U7XHJcbnZhciBkcm9wUmF0ZXMgPSB7c21hbGxUcmVlOiA0LCB0YWxsVHJlZTogMiwganVtcDogMSwgdGhpY2tTbm93OiAxLCByb2NrOiAxfTtcclxuaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdoaWdoU2NvcmUnKSkgaGlnaFNjb3JlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2hpZ2hTY29yZScpO1xyXG5cclxuZnVuY3Rpb24gbG9hZEltYWdlcyAoc291cmNlcywgbmV4dCkge1xyXG5cdHZhciBsb2FkZWQgPSAwO1xyXG5cdHZhciBpbWFnZXMgPSB7fTtcclxuXHJcblx0ZnVuY3Rpb24gZmluaXNoICgpIHtcclxuXHRcdGxvYWRlZCArPSAxO1xyXG5cdFx0aWYgKGxvYWRlZCA9PT0gc291cmNlcy5sZW5ndGgpIHtcclxuXHRcdFx0bmV4dChpbWFnZXMpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c291cmNlcy5lYWNoKGZ1bmN0aW9uIChzcmMpIHtcclxuXHRcdHZhciBpbSA9IG5ldyBJbWFnZSgpO1xyXG5cdFx0aW0ub25sb2FkID0gZmluaXNoO1xyXG5cdFx0aW0uc3JjID0gc3JjO1xyXG5cdFx0ZENvbnRleHQuc3RvcmVMb2FkZWRJbWFnZShzcmMsIGltKTtcclxuXHR9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gbW9uc3RlckhpdHNTa2llckJlaGF2aW91cihtb25zdGVyLCBza2llcikge1xyXG5cdHNraWVyLmlzRWF0ZW5CeShtb25zdGVyLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRsaXZlc0xlZnQgLT0gMTtcclxuXHRcdG1vbnN0ZXIuaXNGdWxsID0gdHJ1ZTtcclxuXHRcdG1vbnN0ZXIuaXNFYXRpbmcgPSBmYWxzZTtcclxuXHRcdHNraWVyLmlzQmVpbmdFYXRlbiA9IGZhbHNlO1xyXG5cdFx0bW9uc3Rlci5zZXRTcGVlZChza2llci5nZXRTcGVlZCgpKTtcclxuXHRcdG1vbnN0ZXIuc3RvcEZvbGxvd2luZygpO1xyXG5cdFx0dmFyIHJhbmRvbVBvc2l0aW9uQWJvdmUgPSBkQ29udGV4dC5nZXRSYW5kb21NYXBQb3NpdGlvbkFib3ZlVmlld3BvcnQoKTtcclxuXHRcdG1vbnN0ZXIuc2V0TWFwUG9zaXRpb25UYXJnZXQocmFuZG9tUG9zaXRpb25BYm92ZVswXSwgcmFuZG9tUG9zaXRpb25BYm92ZVsxXSk7XHJcblx0fSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHN0YXJ0TmV2ZXJFbmRpbmdHYW1lIChpbWFnZXMpIHtcclxuXHR2YXIgcGxheWVyO1xyXG5cdHZhciBzdGFydFNpZ247XHJcblx0dmFyIGluZm9Cb3g7XHJcblx0dmFyIGdhbWU7XHJcblxyXG5cdGZ1bmN0aW9uIHJlc2V0R2FtZSAoKSB7XHJcblx0XHRkaXN0YW5jZVRyYXZlbGxlZEluTWV0cmVzID0gMDtcclxuXHRcdGxpdmVzTGVmdCA9IDU7XHJcblx0XHRoaWdoU2NvcmUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnaGlnaFNjb3JlJyk7XHJcblx0XHRnYW1lLnJlc2V0KCk7XHJcblx0XHRnYW1lLmFkZFN0YXRpY09iamVjdChzdGFydFNpZ24pO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZGV0ZWN0RW5kICgpIHtcclxuXHRcdGlmICghZ2FtZS5pc1BhdXNlZCgpKSB7XHJcblx0XHRcdGhpZ2hTY29yZSA9IGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdoaWdoU2NvcmUnLCBkaXN0YW5jZVRyYXZlbGxlZEluTWV0cmVzKTtcclxuXHRcdFx0aW5mb0JveC5zZXRMaW5lcyhbXHJcblx0XHRcdFx0J0dhbWUgb3ZlciEnLFxyXG5cdFx0XHRcdCdIaXQgc3BhY2UgdG8gcmVzdGFydCdcclxuXHRcdFx0XSk7XHJcblx0XHRcdGdhbWUucGF1c2UoKTtcclxuXHRcdFx0Z2FtZS5jeWNsZSgpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gcmFuZG9tbHlTcGF3bk5QQyhzcGF3bkZ1bmN0aW9uLCBkcm9wUmF0ZSkge1xyXG5cdFx0dmFyIHJhdGVNb2RpZmllciA9IE1hdGgubWF4KDgwMCAtIG1haW5DYW52YXMud2lkdGgsIDApO1xyXG5cdFx0aWYgKE51bWJlci5yYW5kb20oMTAwMCArIHJhdGVNb2RpZmllcikgPD0gZHJvcFJhdGUpIHtcclxuXHRcdFx0c3Bhd25GdW5jdGlvbigpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc3Bhd25Nb25zdGVyICgpIHtcclxuXHRcdHZhciBuZXdNb25zdGVyID0gbmV3IE1vbnN0ZXIoc3ByaXRlcy5tb25zdGVyKTtcclxuXHRcdHZhciByYW5kb21Qb3NpdGlvbiA9IGRDb250ZXh0LmdldFJhbmRvbU1hcFBvc2l0aW9uQWJvdmVWaWV3cG9ydCgpO1xyXG5cdFx0bmV3TW9uc3Rlci5zZXRNYXBQb3NpdGlvbihyYW5kb21Qb3NpdGlvblswXSwgcmFuZG9tUG9zaXRpb25bMV0pO1xyXG5cdFx0bmV3TW9uc3Rlci5mb2xsb3cocGxheWVyKTtcclxuXHRcdG5ld01vbnN0ZXIuc2V0U3BlZWQocGxheWVyLmdldFN0YW5kYXJkU3BlZWQoKSk7XHJcblx0XHRuZXdNb25zdGVyLm9uSGl0dGluZyhwbGF5ZXIsIG1vbnN0ZXJIaXRzU2tpZXJCZWhhdmlvdXIpO1xyXG5cclxuXHRcdGdhbWUuYWRkTW92aW5nT2JqZWN0KG5ld01vbnN0ZXIsICdtb25zdGVyJyk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzcGF3bkJvYXJkZXIgKCkge1xyXG5cdFx0dmFyIG5ld0JvYXJkZXIgPSBuZXcgU25vd2JvYXJkZXIoc3ByaXRlcy5zbm93Ym9hcmRlcik7XHJcblx0XHR2YXIgcmFuZG9tUG9zaXRpb25BYm92ZSA9IGRDb250ZXh0LmdldFJhbmRvbU1hcFBvc2l0aW9uQWJvdmVWaWV3cG9ydCgpO1xyXG5cdFx0dmFyIHJhbmRvbVBvc2l0aW9uQmVsb3cgPSBkQ29udGV4dC5nZXRSYW5kb21NYXBQb3NpdGlvbkJlbG93Vmlld3BvcnQoKTtcclxuXHRcdG5ld0JvYXJkZXIuc2V0TWFwUG9zaXRpb24ocmFuZG9tUG9zaXRpb25BYm92ZVswXSwgcmFuZG9tUG9zaXRpb25BYm92ZVsxXSk7XHJcblx0XHRuZXdCb2FyZGVyLnNldE1hcFBvc2l0aW9uVGFyZ2V0KHJhbmRvbVBvc2l0aW9uQmVsb3dbMF0sIHJhbmRvbVBvc2l0aW9uQmVsb3dbMV0pO1xyXG5cdFx0bmV3Qm9hcmRlci5vbkhpdHRpbmcocGxheWVyLCBzcHJpdGVzLnNub3dib2FyZGVyLmhpdEJlaGF2aW91ci5za2llcik7XHJcblxyXG5cdFx0Z2FtZS5hZGRNb3ZpbmdPYmplY3QobmV3Qm9hcmRlcik7XHJcblx0fVxyXG5cclxuXHRwbGF5ZXIgPSBuZXcgU2tpZXIoc3ByaXRlcy5za2llcik7XHJcblx0cGxheWVyLnNldE1hcFBvc2l0aW9uKDAsIDApO1xyXG5cdHBsYXllci5zZXRNYXBQb3NpdGlvblRhcmdldCgwLCAtMTApO1xyXG5cdGlmICggbG9zZUxpZmVPbk9ic3RhY2xlSGl0ICkge1xyXG5cdFx0cGxheWVyLnNldEhpdE9ic3RhY2xlQ2IoZnVuY3Rpb24oKSB7XHJcblx0XHRcdGxpdmVzTGVmdCAtPSAxO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRnYW1lID0gbmV3IEdhbWUobWFpbkNhbnZhcywgcGxheWVyKTtcclxuXHJcblx0c3RhcnRTaWduID0gbmV3IFNwcml0ZShzcHJpdGVzLnNpZ25TdGFydCk7XHJcblx0Z2FtZS5hZGRTdGF0aWNPYmplY3Qoc3RhcnRTaWduKTtcclxuXHRzdGFydFNpZ24uc2V0TWFwUG9zaXRpb24oLTUwLCAwKTtcclxuXHRkQ29udGV4dC5mb2xsb3dTcHJpdGUocGxheWVyKTtcclxuXHJcblx0aW5mb0JveCA9IG5ldyBJbmZvQm94KHtcclxuXHRcdGluaXRpYWxMaW5lcyA6IFtcclxuXHRcdFx0J1NraUZyZWUuanMnLFxyXG5cdFx0XHRpbmZvQm94Q29udHJvbHMsXHJcblx0XHRcdCdUcmF2ZWxsZWQgMG0nLFxyXG5cdFx0XHQnSGlnaCBTY29yZTogJyArIGhpZ2hTY29yZSxcclxuXHRcdFx0J1NraWVycyBsZWZ0OiAnICsgbGl2ZXNMZWZ0LFxyXG5cdFx0XHQnQ3JlYXRlZCBieSBEYW4gSG91Z2ggKEBiYXNpY2FsbHlkYW4pJ1xyXG5cdFx0XSxcclxuXHRcdHBvc2l0aW9uOiB7XHJcblx0XHRcdHRvcDogMTUsXHJcblx0XHRcdHJpZ2h0OiAxMFxyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHRnYW1lLmJlZm9yZUN5Y2xlKGZ1bmN0aW9uICgpIHtcclxuXHRcdHZhciBuZXdPYmplY3RzID0gW107XHJcblx0XHRpZiAocGxheWVyLmlzTW92aW5nKSB7XHJcblx0XHRcdG5ld09iamVjdHMgPSBTcHJpdGUuY3JlYXRlT2JqZWN0cyhbXHJcblx0XHRcdFx0eyBzcHJpdGU6IHNwcml0ZXMuc21hbGxUcmVlLCBkcm9wUmF0ZTogZHJvcFJhdGVzLnNtYWxsVHJlZSB9LFxyXG5cdFx0XHRcdHsgc3ByaXRlOiBzcHJpdGVzLnRhbGxUcmVlLCBkcm9wUmF0ZTogZHJvcFJhdGVzLnRhbGxUcmVlIH0sXHJcblx0XHRcdFx0eyBzcHJpdGU6IHNwcml0ZXMuanVtcCwgZHJvcFJhdGU6IGRyb3BSYXRlcy5qdW1wIH0sXHJcblx0XHRcdFx0eyBzcHJpdGU6IHNwcml0ZXMudGhpY2tTbm93LCBkcm9wUmF0ZTogZHJvcFJhdGVzLnRoaWNrU25vdyB9LFxyXG5cdFx0XHRcdHsgc3ByaXRlOiBzcHJpdGVzLnJvY2ssIGRyb3BSYXRlOiBkcm9wUmF0ZXMucm9jayB9LFxyXG5cdFx0XHRdLCB7XHJcblx0XHRcdFx0cmF0ZU1vZGlmaWVyOiBNYXRoLm1heCg4MDAgLSBtYWluQ2FudmFzLndpZHRoLCAwKSxcclxuXHRcdFx0XHRwb3NpdGlvbjogZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGRDb250ZXh0LmdldFJhbmRvbU1hcFBvc2l0aW9uQmVsb3dWaWV3cG9ydCgpO1xyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0cGxheWVyOiBwbGF5ZXJcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRpZiAoIWdhbWUuaXNQYXVzZWQoKSkge1xyXG5cdFx0XHRnYW1lLmFkZFN0YXRpY09iamVjdHMobmV3T2JqZWN0cyk7XHJcblxyXG5cdFx0XHRyYW5kb21seVNwYXduTlBDKHNwYXduQm9hcmRlciwgMC4xKTtcclxuXHRcdFx0ZGlzdGFuY2VUcmF2ZWxsZWRJbk1ldHJlcyA9IHBhcnNlRmxvYXQocGxheWVyLmdldFBpeGVsc1RyYXZlbGxlZERvd25Nb3VudGFpbigpIC8gcGl4ZWxzUGVyTWV0cmUpLnRvRml4ZWQoMSk7XHJcblxyXG5cdFx0XHRpZiAoZGlzdGFuY2VUcmF2ZWxsZWRJbk1ldHJlcyA+IG1vbnN0ZXJEaXN0YW5jZVRocmVzaG9sZCkge1xyXG5cdFx0XHRcdHJhbmRvbWx5U3Bhd25OUEMoc3Bhd25Nb25zdGVyLCAwLjAwMSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGluZm9Cb3guc2V0TGluZXMoW1xyXG5cdFx0XHRcdCdTa2lGcmVlLmpzJyxcclxuXHRcdFx0XHRpbmZvQm94Q29udHJvbHMsXHJcblx0XHRcdFx0J1RyYXZlbGxlZCAnICsgZGlzdGFuY2VUcmF2ZWxsZWRJbk1ldHJlcyArICdtJyxcclxuXHRcdFx0XHQnU2tpZXJzIGxlZnQ6ICcgKyBsaXZlc0xlZnQsXHJcblx0XHRcdFx0J0hpZ2ggU2NvcmU6ICcgKyBoaWdoU2NvcmUsXHJcblx0XHRcdFx0J0NyZWF0ZWQgYnkgRGFuIEhvdWdoIChAYmFzaWNhbGx5ZGFuKScsXHJcblx0XHRcdFx0J0N1cnJlbnQgU3BlZWQ6ICcgKyBwbGF5ZXIuZ2V0U3BlZWQoKS8qLFxyXG5cdFx0XHRcdCdTa2llciBNYXAgUG9zaXRpb246ICcgKyBwbGF5ZXIubWFwUG9zaXRpb25bMF0udG9GaXhlZCgxKSArICcsICcgKyBwbGF5ZXIubWFwUG9zaXRpb25bMV0udG9GaXhlZCgxKSxcclxuXHRcdFx0XHQnTW91c2UgTWFwIFBvc2l0aW9uOiAnICsgbW91c2VNYXBQb3NpdGlvblswXS50b0ZpeGVkKDEpICsgJywgJyArIG1vdXNlTWFwUG9zaXRpb25bMV0udG9GaXhlZCgxKSovXHJcblx0XHRcdF0pO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHRnYW1lLmFmdGVyQ3ljbGUoZnVuY3Rpb24oKSB7XHJcblx0XHRpZiAobGl2ZXNMZWZ0ID09PSAwKSB7XHJcblx0XHRcdGRldGVjdEVuZCgpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHRnYW1lLmFkZFVJRWxlbWVudChpbmZvQm94KTtcclxuXHRcclxuXHQkKG1haW5DYW52YXMpXHJcblx0Lm1vdXNlbW92ZShmdW5jdGlvbiAoZSkge1xyXG5cdFx0Z2FtZS5zZXRNb3VzZVgoZS5wYWdlWCk7XHJcblx0XHRnYW1lLnNldE1vdXNlWShlLnBhZ2VZKTtcclxuXHRcdHBsYXllci5yZXNldERpcmVjdGlvbigpO1xyXG5cdFx0cGxheWVyLnN0YXJ0TW92aW5nSWZQb3NzaWJsZSgpO1xyXG5cdH0pXHJcblx0LmJpbmQoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuXHRcdGdhbWUuc2V0TW91c2VYKGUucGFnZVgpO1xyXG5cdFx0Z2FtZS5zZXRNb3VzZVkoZS5wYWdlWSk7XHJcblx0XHRwbGF5ZXIucmVzZXREaXJlY3Rpb24oKTtcclxuXHRcdHBsYXllci5zdGFydE1vdmluZ0lmUG9zc2libGUoKTtcclxuXHR9KVxyXG5cdC5mb2N1cygpOyAvLyBTbyB3ZSBjYW4gbGlzdGVuIHRvIGV2ZW50cyBpbW1lZGlhdGVseVxyXG5cclxuXHRNb3VzZXRyYXAuYmluZCgnZicsIHBsYXllci5zcGVlZEJvb3N0KTtcclxuXHRNb3VzZXRyYXAuYmluZCgndCcsIHBsYXllci5hdHRlbXB0VHJpY2spO1xyXG5cdE1vdXNldHJhcC5iaW5kKFsndycsICd1cCddLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRwbGF5ZXIuc3RvcCgpO1xyXG5cdH0pO1xyXG5cdE1vdXNldHJhcC5iaW5kKFsnYScsICdsZWZ0J10sIGZ1bmN0aW9uICgpIHtcclxuXHRcdGlmIChwbGF5ZXIuZGlyZWN0aW9uID09PSAyNzApIHtcclxuXHRcdFx0cGxheWVyLnN0ZXBXZXN0KCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRwbGF5ZXIudHVybldlc3QoKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHRNb3VzZXRyYXAuYmluZChbJ3MnLCAnZG93biddLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRwbGF5ZXIuc2V0RGlyZWN0aW9uKDE4MCk7XHJcblx0XHRwbGF5ZXIuc3RhcnRNb3ZpbmdJZlBvc3NpYmxlKCk7XHJcblx0fSk7XHJcblx0TW91c2V0cmFwLmJpbmQoWydkJywgJ3JpZ2h0J10sIGZ1bmN0aW9uICgpIHtcclxuXHRcdGlmIChwbGF5ZXIuZGlyZWN0aW9uID09PSA5MCkge1xyXG5cdFx0XHRwbGF5ZXIuc3RlcEVhc3QoKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHBsYXllci50dXJuRWFzdCgpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdE1vdXNldHJhcC5iaW5kKCdtJywgc3Bhd25Nb25zdGVyKTtcclxuXHRNb3VzZXRyYXAuYmluZCgnYicsIHNwYXduQm9hcmRlcik7XHJcblx0TW91c2V0cmFwLmJpbmQoJ3NwYWNlJywgcmVzZXRHYW1lKTtcclxuXHJcblx0dmFyIGhhbW1lcnRpbWUgPSBIYW1tZXIobWFpbkNhbnZhcykub24oJ3ByZXNzJywgZnVuY3Rpb24gKGUpIHtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdGdhbWUuc2V0TW91c2VYKGUuZ2VzdHVyZS5jZW50ZXIueCk7XHJcblx0XHRnYW1lLnNldE1vdXNlWShlLmdlc3R1cmUuY2VudGVyLnkpO1xyXG5cdH0pLm9uKCd0YXAnLCBmdW5jdGlvbiAoZSkge1xyXG5cdFx0Z2FtZS5zZXRNb3VzZVgoZS5nZXN0dXJlLmNlbnRlci54KTtcclxuXHRcdGdhbWUuc2V0TW91c2VZKGUuZ2VzdHVyZS5jZW50ZXIueSk7XHJcblx0fSkub24oJ3BhbicsIGZ1bmN0aW9uIChlKSB7XHJcblx0XHRnYW1lLnNldE1vdXNlWChlLmdlc3R1cmUuY2VudGVyLngpO1xyXG5cdFx0Z2FtZS5zZXRNb3VzZVkoZS5nZXN0dXJlLmNlbnRlci55KTtcclxuXHRcdHBsYXllci5yZXNldERpcmVjdGlvbigpO1xyXG5cdFx0cGxheWVyLnN0YXJ0TW92aW5nSWZQb3NzaWJsZSgpO1xyXG5cdH0pLm9uKCdkb3VibGV0YXAnLCBmdW5jdGlvbiAoZSkge1xyXG5cdFx0cGxheWVyLnNwZWVkQm9vc3QoKTtcclxuXHR9KTtcclxuXHJcblx0cGxheWVyLmlzTW92aW5nID0gZmFsc2U7XHJcblx0cGxheWVyLnNldERpcmVjdGlvbigyNzApO1xyXG5cclxuXHRnYW1lLnN0YXJ0KCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlc2l6ZUNhbnZhcygpIHtcclxuXHRtYWluQ2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XHJcblx0bWFpbkNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNpemVDYW52YXMsIGZhbHNlKTtcclxuXHJcbnJlc2l6ZUNhbnZhcygpO1xyXG5cclxubG9hZEltYWdlcyhpbWFnZVNvdXJjZXMsIHN0YXJ0TmV2ZXJFbmRpbmdHYW1lKTtcclxuXHJcbnRoaXMuZXhwb3J0cyA9IHdpbmRvdztcclxuIiwiKGZ1bmN0aW9uIChnbG9iYWwpIHtcclxuXHR2YXIgc3ByaXRlcyA9IHtcclxuXHRcdCdza2llcicgOiB7XHJcblx0XHRcdCRpbWFnZUZpbGUgOiAnc3ByaXRlLWNoYXJhY3RlcnMucG5nJyxcclxuXHRcdFx0cGFydHMgOiB7XHJcblx0XHRcdFx0YmxhbmsgOiBbIDAsIDAsIDAsIDAgXSxcclxuXHRcdFx0XHRlYXN0IDogWyAwLCAwLCAyNCwgMzQgXSxcclxuXHRcdFx0XHRlc0Vhc3QgOiBbIDI0LCAwLCAyNCwgMzQgXSxcclxuXHRcdFx0XHRzRWFzdCA6IFsgNDksIDAsIDE3LCAzNCBdLFxyXG5cdFx0XHRcdHNvdXRoIDogWyA2NSwgMCwgMTcsIDM0IF0sXHJcblx0XHRcdFx0c1dlc3QgOiBbIDQ5LCAzNywgMTcsIDM0IF0sXHJcblx0XHRcdFx0d3NXZXN0IDogWyAyNCwgMzcsIDI0LCAzNCBdLFxyXG5cdFx0XHRcdHdlc3QgOiBbIDAsIDM3LCAyNCwgMzQgXSxcclxuXHRcdFx0XHRoaXQgOiBbIDAsIDc4LCAzMSwgMzEgXSxcclxuXHRcdFx0XHRqdW1waW5nIDogWyA4NCwgMCwgMzIsIDM0IF0sXHJcblx0XHRcdFx0c29tZXJzYXVsdDEgOiBbIDExNiwgMCwgMzIsIDM0IF0sXHJcblx0XHRcdFx0c29tZXJzYXVsdDIgOiBbIDE0OCwgMCwgMzIsIDM0IF1cclxuXHRcdFx0fSxcclxuXHRcdFx0aGl0Qm94ZXM6IHtcclxuXHRcdFx0XHQwOiBbIDcsIDIwLCAyNywgMzQgXVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRpZCA6ICdwbGF5ZXInLFxyXG5cdFx0XHRoaXRCZWhhdmlvdXI6IHt9XHJcblx0XHR9LFxyXG5cdFx0J3NtYWxsVHJlZScgOiB7XHJcblx0XHRcdCRpbWFnZUZpbGUgOiAnc2tpZnJlZS1vYmplY3RzLnBuZycsXHJcblx0XHRcdHBhcnRzIDoge1xyXG5cdFx0XHRcdG1haW4gOiBbIDAsIDI4LCAzMCwgMzQgXVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRoaXRCb3hlczoge1xyXG5cdFx0XHRcdDA6IFsgMCwgMTgsIDMwLCAzNCBdXHJcblx0XHRcdH0sXHJcblx0XHRcdGhpdEJlaGF2aW91cjoge31cclxuXHRcdH0sXHJcblx0XHQndGFsbFRyZWUnIDoge1xyXG5cdFx0XHQkaW1hZ2VGaWxlIDogJ3NraWZyZWUtb2JqZWN0cy5wbmcnLFxyXG5cdFx0XHRwYXJ0cyA6IHtcclxuXHRcdFx0XHRtYWluIDogWyA5NSwgNjYsIDMyLCA2NCBdXHJcblx0XHRcdH0sXHJcblx0XHRcdHpJbmRleGVzT2NjdXBpZWQgOiBbMCwgMV0sXHJcblx0XHRcdGhpdEJveGVzOiB7XHJcblx0XHRcdFx0MDogWzAsIDU0LCAzMiwgNjRdLFxyXG5cdFx0XHRcdDE6IFswLCAxMCwgMzIsIDU0XVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRoaXRCZWhhdmlvdXI6IHt9XHJcblx0XHR9LFxyXG5cdFx0J3RoaWNrU25vdycgOiB7XHJcblx0XHRcdCRpbWFnZUZpbGUgOiAnc2tpZnJlZS1vYmplY3RzLnBuZycsXHJcblx0XHRcdHBhcnRzIDoge1xyXG5cdFx0XHRcdG1haW4gOiBbIDE0MywgNTMsIDQzLCAxMCBdXHJcblx0XHRcdH0sXHJcblx0XHRcdGhpdEJlaGF2aW91cjoge31cclxuXHRcdH0sXHJcblx0XHQncm9jaycgOiB7XHJcblx0XHRcdCRpbWFnZUZpbGUgOiAnc2tpZnJlZS1vYmplY3RzLnBuZycsXHJcblx0XHRcdHBhcnRzIDoge1xyXG5cdFx0XHRcdG1haW4gOiBbIDMwLCA1MiwgMjMsIDExIF1cclxuXHRcdFx0fSxcclxuXHRcdFx0aGl0QmVoYXZpb3VyOiB7fVxyXG5cdFx0fSxcclxuXHRcdCdtb25zdGVyJyA6IHtcclxuXHRcdFx0JGltYWdlRmlsZSA6ICdzcHJpdGUtY2hhcmFjdGVycy5wbmcnLFxyXG5cdFx0XHRwYXJ0cyA6IHtcclxuXHRcdFx0XHRzRWFzdDEgOiBbIDY0LCAxMTIsIDI2LCA0MyBdLFxyXG5cdFx0XHRcdHNFYXN0MiA6IFsgOTAsIDExMiwgMzIsIDQzIF0sXHJcblx0XHRcdFx0c1dlc3QxIDogWyA2NCwgMTU4LCAyNiwgNDMgXSxcclxuXHRcdFx0XHRzV2VzdDIgOiBbIDkwLCAxNTgsIDMyLCA0MyBdLFxyXG5cdFx0XHRcdGVhdGluZzEgOiBbIDEyMiwgMTEyLCAzNCwgNDMgXSxcclxuXHRcdFx0XHRlYXRpbmcyIDogWyAxNTYsIDExMiwgMzEsIDQzIF0sXHJcblx0XHRcdFx0ZWF0aW5nMyA6IFsgMTg3LCAxMTIsIDMxLCA0MyBdLFxyXG5cdFx0XHRcdGVhdGluZzQgOiBbIDIxOSwgMTEyLCAyNSwgNDMgXSxcclxuXHRcdFx0XHRlYXRpbmc1IDogWyAyNDMsIDExMiwgMjYsIDQzIF1cclxuXHRcdFx0fSxcclxuXHRcdFx0aGl0QmVoYXZpb3VyOiB7fVxyXG5cdFx0fSxcclxuXHRcdCdqdW1wJyA6IHtcclxuXHRcdFx0JGltYWdlRmlsZSA6ICdza2lmcmVlLW9iamVjdHMucG5nJyxcclxuXHRcdFx0cGFydHMgOiB7XHJcblx0XHRcdFx0bWFpbiA6IFsgMTA5LCA1NSwgMzIsIDggXVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRoaXRCZWhhdmlvdXI6IHt9XHJcblx0XHR9LFxyXG5cdFx0J3NpZ25TdGFydCcgOiB7XHJcblx0XHRcdCRpbWFnZUZpbGUgOiAnc2tpZnJlZS1vYmplY3RzLnBuZycsXHJcblx0XHRcdHBhcnRzIDoge1xyXG5cdFx0XHRcdG1haW4gOiBbIDI2MCwgMTAzLCA0MiwgMjcgXVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRoaXRCZWhhdmlvdXI6IHt9XHJcblx0XHR9LFxyXG5cdFx0J3Nub3dib2FyZGVyJyA6IHtcclxuXHRcdFx0JGltYWdlRmlsZSA6ICdzcHJpdGUtY2hhcmFjdGVycy5wbmcnLFxyXG5cdFx0XHRwYXJ0cyA6IHtcclxuXHRcdFx0XHRzRWFzdCA6IFsgNzMsIDIyOSwgMjAsIDI5IF0sXHJcblx0XHRcdFx0c1dlc3QgOiBbIDk1LCAyMjgsIDI2LCAzMCBdXHJcblx0XHRcdH0sXHJcblx0XHRcdGhpdEJlaGF2aW91cjoge31cclxuXHRcdH0sXHJcblx0XHQnZW1wdHlDaGFpckxpZnQnOiB7XHJcblx0XHRcdCRpbWFnZUZpbGUgOiAnc2tpZnJlZS1vYmplY3RzLnBuZycsXHJcblx0XHRcdHBhcnRzOiB7XHJcblx0XHRcdFx0bWFpbiA6IFsgOTIsIDEzNiwgMjYsIDMwIF1cclxuXHRcdFx0fSxcclxuXHRcdFx0ekluZGV4ZXNPY2N1cGllZCA6IFsxXSxcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHRmdW5jdGlvbiBtb25zdGVySGl0c1RyZWVCZWhhdmlvdXIobW9uc3Rlcikge1xyXG5cdFx0bW9uc3Rlci5kZWxldGVPbk5leHRDeWNsZSgpO1xyXG5cdH1cclxuXHJcblx0c3ByaXRlcy5tb25zdGVyLmhpdEJlaGF2aW91ci50cmVlID0gbW9uc3RlckhpdHNUcmVlQmVoYXZpb3VyO1xyXG5cclxuXHRmdW5jdGlvbiB0cmVlSGl0c01vbnN0ZXJCZWhhdmlvdXIodHJlZSwgbW9uc3Rlcikge1xyXG5cdFx0bW9uc3Rlci5kZWxldGVPbk5leHRDeWNsZSgpO1xyXG5cdH1cclxuXHJcblx0c3ByaXRlcy5zbWFsbFRyZWUuaGl0QmVoYXZpb3VyLm1vbnN0ZXIgPSB0cmVlSGl0c01vbnN0ZXJCZWhhdmlvdXI7XHJcblx0c3ByaXRlcy50YWxsVHJlZS5oaXRCZWhhdmlvdXIubW9uc3RlciA9IHRyZWVIaXRzTW9uc3RlckJlaGF2aW91cjtcclxuXHJcblx0ZnVuY3Rpb24gc2tpZXJIaXRzVHJlZUJlaGF2aW91cihza2llciwgdHJlZSkge1xyXG5cdFx0c2tpZXIuaGFzSGl0T2JzdGFjbGUodHJlZSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiB0cmVlSGl0c1NraWVyQmVoYXZpb3VyKHRyZWUsIHNraWVyKSB7XHJcblx0XHRza2llci5oYXNIaXRPYnN0YWNsZSh0cmVlKTtcclxuXHR9XHJcblxyXG5cdHNwcml0ZXMuc21hbGxUcmVlLmhpdEJlaGF2aW91ci5za2llciA9IHRyZWVIaXRzU2tpZXJCZWhhdmlvdXI7XHJcblx0c3ByaXRlcy50YWxsVHJlZS5oaXRCZWhhdmlvdXIuc2tpZXIgPSB0cmVlSGl0c1NraWVyQmVoYXZpb3VyO1xyXG5cclxuXHRmdW5jdGlvbiByb2NrSGl0c1NraWVyQmVoYXZpb3VyKHJvY2ssIHNraWVyKSB7XHJcblx0XHRza2llci5oYXNIaXRPYnN0YWNsZShyb2NrKTtcclxuXHR9XHJcblxyXG5cdHNwcml0ZXMucm9jay5oaXRCZWhhdmlvdXIuc2tpZXIgPSByb2NrSGl0c1NraWVyQmVoYXZpb3VyO1xyXG5cclxuXHRmdW5jdGlvbiBza2llckhpdHNKdW1wQmVoYXZpb3VyKHNraWVyLCBqdW1wKSB7XHJcblx0XHRza2llci5oYXNIaXRKdW1wKGp1bXApO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24ganVtcEhpdHNTa2llckJlaGF2aW91cihqdW1wLCBza2llcikge1xyXG5cdFx0c2tpZXIuaGFzSGl0SnVtcChqdW1wKTtcclxuXHR9XHJcblxyXG5cdHNwcml0ZXMuanVtcC5oaXRCZWhhdmlvdXIuc2tpZXIgPSBqdW1wSGl0c1NraWVyQmVoYXZpb3VyO1xyXG5cclxuLy8gUmVhbGx5IG5vdCBhIGZhbiBvZiB0aGlzIGJlaGF2aW91ci5cclxuLypcdGZ1bmN0aW9uIHNraWVySGl0c1RoaWNrU25vd0JlaGF2aW91cihza2llciwgdGhpY2tTbm93KSB7XHJcblx0XHQvLyBOZWVkIHRvIGltcGxlbWVudCB0aGlzIHByb3Blcmx5XHJcblx0XHRza2llci5zZXRTcGVlZCgyKTtcclxuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdHNraWVyLnJlc2V0U3BlZWQoKTtcclxuXHRcdH0sIDcwMCk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiB0aGlja1Nub3dIaXRzU2tpZXJCZWhhdmlvdXIodGhpY2tTbm93LCBza2llcikge1xyXG5cdFx0Ly8gTmVlZCB0byBpbXBsZW1lbnQgdGhpcyBwcm9wZXJseVxyXG5cdFx0c2tpZXIuc2V0U3BlZWQoMik7XHJcblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRza2llci5yZXNldFNwZWVkKCk7XHJcblx0XHR9LCAzMDApO1xyXG5cdH0qL1xyXG5cclxuXHQvLyBzcHJpdGVzLnRoaWNrU25vdy5oaXRCZWhhdmlvdXIuc2tpZXIgPSB0aGlja1Nub3dIaXRzU2tpZXJCZWhhdmlvdXI7XHJcblxyXG5cdGZ1bmN0aW9uIHNub3dib2FyZGVySGl0c1NraWVyQmVoYXZpb3VyKHNub3dib2FyZGVyLCBza2llcikge1xyXG5cdFx0c2tpZXIuaGFzSGl0T2JzdGFjbGUoc25vd2JvYXJkZXIpO1xyXG5cdH1cclxuXHJcblx0c3ByaXRlcy5zbm93Ym9hcmRlci5oaXRCZWhhdmlvdXIuc2tpZXIgPSBzbm93Ym9hcmRlckhpdHNTa2llckJlaGF2aW91cjtcclxuXHJcblx0Z2xvYmFsLnNwcml0ZUluZm8gPSBzcHJpdGVzO1xyXG59KSggdGhpcyApO1xyXG5cclxuXHJcbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykge1xyXG5cdG1vZHVsZS5leHBvcnRzID0gdGhpcy5zcHJpdGVJbmZvO1xyXG59IiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMiBDcmFpZyBDYW1wYmVsbFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqIE1vdXNldHJhcCBpcyBhIHNpbXBsZSBrZXlib2FyZCBzaG9ydGN1dCBsaWJyYXJ5IGZvciBKYXZhc2NyaXB0IHdpdGhcbiAqIG5vIGV4dGVybmFsIGRlcGVuZGVuY2llc1xuICpcbiAqIEB2ZXJzaW9uIDEuMS4zXG4gKiBAdXJsIGNyYWlnLmlzL2tpbGxpbmcvbWljZVxuICovXG4oZnVuY3Rpb24oKSB7XG5cbiAgICAvKipcbiAgICAgKiBtYXBwaW5nIG9mIHNwZWNpYWwga2V5Y29kZXMgdG8gdGhlaXIgY29ycmVzcG9uZGluZyBrZXlzXG4gICAgICpcbiAgICAgKiBldmVyeXRoaW5nIGluIHRoaXMgZGljdGlvbmFyeSBjYW5ub3QgdXNlIGtleXByZXNzIGV2ZW50c1xuICAgICAqIHNvIGl0IGhhcyB0byBiZSBoZXJlIHRvIG1hcCB0byB0aGUgY29ycmVjdCBrZXljb2RlcyBmb3JcbiAgICAgKiBrZXl1cC9rZXlkb3duIGV2ZW50c1xuICAgICAqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB2YXIgX01BUCA9IHtcbiAgICAgICAgICAgIDg6ICdiYWNrc3BhY2UnLFxuICAgICAgICAgICAgOTogJ3RhYicsXG4gICAgICAgICAgICAxMzogJ2VudGVyJyxcbiAgICAgICAgICAgIDE2OiAnc2hpZnQnLFxuICAgICAgICAgICAgMTc6ICdjdHJsJyxcbiAgICAgICAgICAgIDE4OiAnYWx0JyxcbiAgICAgICAgICAgIDIwOiAnY2Fwc2xvY2snLFxuICAgICAgICAgICAgMjc6ICdlc2MnLFxuICAgICAgICAgICAgMzI6ICdzcGFjZScsXG4gICAgICAgICAgICAzMzogJ3BhZ2V1cCcsXG4gICAgICAgICAgICAzNDogJ3BhZ2Vkb3duJyxcbiAgICAgICAgICAgIDM1OiAnZW5kJyxcbiAgICAgICAgICAgIDM2OiAnaG9tZScsXG4gICAgICAgICAgICAzNzogJ2xlZnQnLFxuICAgICAgICAgICAgMzg6ICd1cCcsXG4gICAgICAgICAgICAzOTogJ3JpZ2h0JyxcbiAgICAgICAgICAgIDQwOiAnZG93bicsXG4gICAgICAgICAgICA0NTogJ2lucycsXG4gICAgICAgICAgICA0NjogJ2RlbCcsXG4gICAgICAgICAgICA5MTogJ21ldGEnLFxuICAgICAgICAgICAgOTM6ICdtZXRhJyxcbiAgICAgICAgICAgIDIyNDogJ21ldGEnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIG1hcHBpbmcgZm9yIHNwZWNpYWwgY2hhcmFjdGVycyBzbyB0aGV5IGNhbiBzdXBwb3J0XG4gICAgICAgICAqXG4gICAgICAgICAqIHRoaXMgZGljdGlvbmFyeSBpcyBvbmx5IHVzZWQgaW5jYXNlIHlvdSB3YW50IHRvIGJpbmQgYVxuICAgICAgICAgKiBrZXl1cCBvciBrZXlkb3duIGV2ZW50IHRvIG9uZSBvZiB0aGVzZSBrZXlzXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBfS0VZQ09ERV9NQVAgPSB7XG4gICAgICAgICAgICAxMDY6ICcqJyxcbiAgICAgICAgICAgIDEwNzogJysnLFxuICAgICAgICAgICAgMTA5OiAnLScsXG4gICAgICAgICAgICAxMTA6ICcuJyxcbiAgICAgICAgICAgIDExMSA6ICcvJyxcbiAgICAgICAgICAgIDE4NjogJzsnLFxuICAgICAgICAgICAgMTg3OiAnPScsXG4gICAgICAgICAgICAxODg6ICcsJyxcbiAgICAgICAgICAgIDE4OTogJy0nLFxuICAgICAgICAgICAgMTkwOiAnLicsXG4gICAgICAgICAgICAxOTE6ICcvJyxcbiAgICAgICAgICAgIDE5MjogJ2AnLFxuICAgICAgICAgICAgMjE5OiAnWycsXG4gICAgICAgICAgICAyMjA6ICdcXFxcJyxcbiAgICAgICAgICAgIDIyMTogJ10nLFxuICAgICAgICAgICAgMjIyOiAnXFwnJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiB0aGlzIGlzIGEgbWFwcGluZyBvZiBrZXlzIHRoYXQgcmVxdWlyZSBzaGlmdCBvbiBhIFVTIGtleXBhZFxuICAgICAgICAgKiBiYWNrIHRvIHRoZSBub24gc2hpZnQgZXF1aXZlbGVudHNcbiAgICAgICAgICpcbiAgICAgICAgICogdGhpcyBpcyBzbyB5b3UgY2FuIHVzZSBrZXl1cCBldmVudHMgd2l0aCB0aGVzZSBrZXlzXG4gICAgICAgICAqXG4gICAgICAgICAqIG5vdGUgdGhhdCB0aGlzIHdpbGwgb25seSB3b3JrIHJlbGlhYmx5IG9uIFVTIGtleWJvYXJkc1xuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgX1NISUZUX01BUCA9IHtcbiAgICAgICAgICAgICd+JzogJ2AnLFxuICAgICAgICAgICAgJyEnOiAnMScsXG4gICAgICAgICAgICAnQCc6ICcyJyxcbiAgICAgICAgICAgICcjJzogJzMnLFxuICAgICAgICAgICAgJyQnOiAnNCcsXG4gICAgICAgICAgICAnJSc6ICc1JyxcbiAgICAgICAgICAgICdeJzogJzYnLFxuICAgICAgICAgICAgJyYnOiAnNycsXG4gICAgICAgICAgICAnKic6ICc4JyxcbiAgICAgICAgICAgICcoJzogJzknLFxuICAgICAgICAgICAgJyknOiAnMCcsXG4gICAgICAgICAgICAnXyc6ICctJyxcbiAgICAgICAgICAgICcrJzogJz0nLFxuICAgICAgICAgICAgJzonOiAnOycsXG4gICAgICAgICAgICAnXFxcIic6ICdcXCcnLFxuICAgICAgICAgICAgJzwnOiAnLCcsXG4gICAgICAgICAgICAnPic6ICcuJyxcbiAgICAgICAgICAgICc/JzogJy8nLFxuICAgICAgICAgICAgJ3wnOiAnXFxcXCdcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogdGhpcyBpcyBhIGxpc3Qgb2Ygc3BlY2lhbCBzdHJpbmdzIHlvdSBjYW4gdXNlIHRvIG1hcFxuICAgICAgICAgKiB0byBtb2RpZmllciBrZXlzIHdoZW4geW91IHNwZWNpZnkgeW91ciBrZXlib2FyZCBzaG9ydGN1dHNcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIF9TUEVDSUFMX0FMSUFTRVMgPSB7XG4gICAgICAgICAgICAnb3B0aW9uJzogJ2FsdCcsXG4gICAgICAgICAgICAnY29tbWFuZCc6ICdtZXRhJyxcbiAgICAgICAgICAgICdyZXR1cm4nOiAnZW50ZXInLFxuICAgICAgICAgICAgJ2VzY2FwZSc6ICdlc2MnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIHZhcmlhYmxlIHRvIHN0b3JlIHRoZSBmbGlwcGVkIHZlcnNpb24gb2YgX01BUCBmcm9tIGFib3ZlXG4gICAgICAgICAqIG5lZWRlZCB0byBjaGVjayBpZiB3ZSBzaG91bGQgdXNlIGtleXByZXNzIG9yIG5vdCB3aGVuIG5vIGFjdGlvblxuICAgICAgICAgKiBpcyBzcGVjaWZpZWRcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge09iamVjdHx1bmRlZmluZWR9XG4gICAgICAgICAqL1xuICAgICAgICBfUkVWRVJTRV9NQVAsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIGEgbGlzdCBvZiBhbGwgdGhlIGNhbGxiYWNrcyBzZXR1cCB2aWEgTW91c2V0cmFwLmJpbmQoKVxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgX2NhbGxiYWNrcyA9IHt9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBkaXJlY3QgbWFwIG9mIHN0cmluZyBjb21iaW5hdGlvbnMgdG8gY2FsbGJhY2tzIHVzZWQgZm9yIHRyaWdnZXIoKVxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgX2RpcmVjdF9tYXAgPSB7fSxcblxuICAgICAgICAvKipcbiAgICAgICAgICoga2VlcHMgdHJhY2sgb2Ygd2hhdCBsZXZlbCBlYWNoIHNlcXVlbmNlIGlzIGF0IHNpbmNlIG11bHRpcGxlXG4gICAgICAgICAqIHNlcXVlbmNlcyBjYW4gc3RhcnQgb3V0IHdpdGggdGhlIHNhbWUgc2VxdWVuY2VcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIF9zZXF1ZW5jZV9sZXZlbHMgPSB7fSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogdmFyaWFibGUgdG8gc3RvcmUgdGhlIHNldFRpbWVvdXQgY2FsbFxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7bnVsbHxudW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICBfcmVzZXRfdGltZXIsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIHRlbXBvcmFyeSBzdGF0ZSB3aGVyZSB3ZSB3aWxsIGlnbm9yZSB0aGUgbmV4dCBrZXl1cFxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7Ym9vbGVhbnxzdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICBfaWdub3JlX25leHRfa2V5dXAgPSBmYWxzZSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogYXJlIHdlIGN1cnJlbnRseSBpbnNpZGUgb2YgYSBzZXF1ZW5jZT9cbiAgICAgICAgICogdHlwZSBvZiBhY3Rpb24gKFwia2V5dXBcIiBvciBcImtleWRvd25cIiBvciBcImtleXByZXNzXCIpIG9yIGZhbHNlXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtib29sZWFufHN0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIF9pbnNpZGVfc2VxdWVuY2UgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIGxvb3AgdGhyb3VnaCB0aGUgZiBrZXlzLCBmMSB0byBmMTkgYW5kIGFkZCB0aGVtIHRvIHRoZSBtYXBcbiAgICAgKiBwcm9ncmFtYXRpY2FsbHlcbiAgICAgKi9cbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IDIwOyArK2kpIHtcbiAgICAgICAgX01BUFsxMTEgKyBpXSA9ICdmJyArIGk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogbG9vcCB0aHJvdWdoIHRvIG1hcCBudW1iZXJzIG9uIHRoZSBudW1lcmljIGtleXBhZFxuICAgICAqL1xuICAgIGZvciAoaSA9IDA7IGkgPD0gOTsgKytpKSB7XG4gICAgICAgIF9NQVBbaSArIDk2XSA9IGk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY3Jvc3MgYnJvd3NlciBhZGQgZXZlbnQgbWV0aG9kXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR8SFRNTERvY3VtZW50fSBvYmplY3RcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAgICogQHJldHVybnMgdm9pZFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9hZGRFdmVudChvYmplY3QsIHR5cGUsIGNhbGxiYWNrKSB7XG4gICAgICAgIGlmIChvYmplY3QuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAgICAgb2JqZWN0LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgY2FsbGJhY2ssIGZhbHNlKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIG9iamVjdC5hdHRhY2hFdmVudCgnb24nICsgdHlwZSwgY2FsbGJhY2spO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHRha2VzIHRoZSBldmVudCBhbmQgcmV0dXJucyB0aGUga2V5IGNoYXJhY3RlclxuICAgICAqXG4gICAgICogQHBhcmFtIHtFdmVudH0gZVxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfY2hhcmFjdGVyRnJvbUV2ZW50KGUpIHtcblxuICAgICAgICAvLyBmb3Iga2V5cHJlc3MgZXZlbnRzIHdlIHNob3VsZCByZXR1cm4gdGhlIGNoYXJhY3RlciBhcyBpc1xuICAgICAgICBpZiAoZS50eXBlID09ICdrZXlwcmVzcycpIHtcbiAgICAgICAgICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKGUud2hpY2gpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZm9yIG5vbiBrZXlwcmVzcyBldmVudHMgdGhlIHNwZWNpYWwgbWFwcyBhcmUgbmVlZGVkXG4gICAgICAgIGlmIChfTUFQW2Uud2hpY2hdKSB7XG4gICAgICAgICAgICByZXR1cm4gX01BUFtlLndoaWNoXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfS0VZQ09ERV9NQVBbZS53aGljaF0pIHtcbiAgICAgICAgICAgIHJldHVybiBfS0VZQ09ERV9NQVBbZS53aGljaF07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiBpdCBpcyBub3QgaW4gdGhlIHNwZWNpYWwgbWFwXG4gICAgICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKGUud2hpY2gpLnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY2hlY2tzIGlmIHR3byBhcnJheXMgYXJlIGVxdWFsXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBtb2RpZmllcnMxXG4gICAgICogQHBhcmFtIHtBcnJheX0gbW9kaWZpZXJzMlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9tb2RpZmllcnNNYXRjaChtb2RpZmllcnMxLCBtb2RpZmllcnMyKSB7XG4gICAgICAgIHJldHVybiBtb2RpZmllcnMxLnNvcnQoKS5qb2luKCcsJykgPT09IG1vZGlmaWVyczIuc29ydCgpLmpvaW4oJywnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXNldHMgYWxsIHNlcXVlbmNlIGNvdW50ZXJzIGV4Y2VwdCBmb3IgdGhlIG9uZXMgcGFzc2VkIGluXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZG9fbm90X3Jlc2V0XG4gICAgICogQHJldHVybnMgdm9pZFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9yZXNldFNlcXVlbmNlcyhkb19ub3RfcmVzZXQpIHtcbiAgICAgICAgZG9fbm90X3Jlc2V0ID0gZG9fbm90X3Jlc2V0IHx8IHt9O1xuXG4gICAgICAgIHZhciBhY3RpdmVfc2VxdWVuY2VzID0gZmFsc2UsXG4gICAgICAgICAgICBrZXk7XG5cbiAgICAgICAgZm9yIChrZXkgaW4gX3NlcXVlbmNlX2xldmVscykge1xuICAgICAgICAgICAgaWYgKGRvX25vdF9yZXNldFtrZXldKSB7XG4gICAgICAgICAgICAgICAgYWN0aXZlX3NlcXVlbmNlcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfc2VxdWVuY2VfbGV2ZWxzW2tleV0gPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFhY3RpdmVfc2VxdWVuY2VzKSB7XG4gICAgICAgICAgICBfaW5zaWRlX3NlcXVlbmNlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBmaW5kcyBhbGwgY2FsbGJhY2tzIHRoYXQgbWF0Y2ggYmFzZWQgb24gdGhlIGtleWNvZGUsIG1vZGlmaWVycyxcbiAgICAgKiBhbmQgYWN0aW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2hhcmFjdGVyXG4gICAgICogQHBhcmFtIHtBcnJheX0gbW9kaWZpZXJzXG4gICAgICogQHBhcmFtIHtFdmVudHxPYmplY3R9IGVcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW49fSByZW1vdmUgLSBzaG91bGQgd2UgcmVtb3ZlIGFueSBtYXRjaGVzXG4gICAgICogQHBhcmFtIHtzdHJpbmc9fSBjb21iaW5hdGlvblxuICAgICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfZ2V0TWF0Y2hlcyhjaGFyYWN0ZXIsIG1vZGlmaWVycywgZSwgcmVtb3ZlLCBjb21iaW5hdGlvbikge1xuICAgICAgICB2YXIgaSxcbiAgICAgICAgICAgIGNhbGxiYWNrLFxuICAgICAgICAgICAgbWF0Y2hlcyA9IFtdLFxuICAgICAgICAgICAgYWN0aW9uID0gZS50eXBlO1xuXG4gICAgICAgIC8vIGlmIHRoZXJlIGFyZSBubyBldmVudHMgcmVsYXRlZCB0byB0aGlzIGtleWNvZGVcbiAgICAgICAgaWYgKCFfY2FsbGJhY2tzW2NoYXJhY3Rlcl0pIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIGEgbW9kaWZpZXIga2V5IGlzIGNvbWluZyB1cCBvbiBpdHMgb3duIHdlIHNob3VsZCBhbGxvdyBpdFxuICAgICAgICBpZiAoYWN0aW9uID09ICdrZXl1cCcgJiYgX2lzTW9kaWZpZXIoY2hhcmFjdGVyKSkge1xuICAgICAgICAgICAgbW9kaWZpZXJzID0gW2NoYXJhY3Rlcl07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBsb29wIHRocm91Z2ggYWxsIGNhbGxiYWNrcyBmb3IgdGhlIGtleSB0aGF0IHdhcyBwcmVzc2VkXG4gICAgICAgIC8vIGFuZCBzZWUgaWYgYW55IG9mIHRoZW0gbWF0Y2hcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IF9jYWxsYmFja3NbY2hhcmFjdGVyXS5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgY2FsbGJhY2sgPSBfY2FsbGJhY2tzW2NoYXJhY3Rlcl1baV07XG5cbiAgICAgICAgICAgIC8vIGlmIHRoaXMgaXMgYSBzZXF1ZW5jZSBidXQgaXQgaXMgbm90IGF0IHRoZSByaWdodCBsZXZlbFxuICAgICAgICAgICAgLy8gdGhlbiBtb3ZlIG9udG8gdGhlIG5leHQgbWF0Y2hcbiAgICAgICAgICAgIGlmIChjYWxsYmFjay5zZXEgJiYgX3NlcXVlbmNlX2xldmVsc1tjYWxsYmFjay5zZXFdICE9IGNhbGxiYWNrLmxldmVsKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGlmIHRoZSBhY3Rpb24gd2UgYXJlIGxvb2tpbmcgZm9yIGRvZXNuJ3QgbWF0Y2ggdGhlIGFjdGlvbiB3ZSBnb3RcbiAgICAgICAgICAgIC8vIHRoZW4gd2Ugc2hvdWxkIGtlZXAgZ29pbmdcbiAgICAgICAgICAgIGlmIChhY3Rpb24gIT0gY2FsbGJhY2suYWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGlmIHRoaXMgaXMgYSBrZXlwcmVzcyBldmVudCBhbmQgdGhlIG1ldGEga2V5IGFuZCBjb250cm9sIGtleVxuICAgICAgICAgICAgLy8gYXJlIG5vdCBwcmVzc2VkIHRoYXQgbWVhbnMgdGhhdCB3ZSBuZWVkIHRvIG9ubHkgbG9vayBhdCB0aGVcbiAgICAgICAgICAgIC8vIGNoYXJhY3Rlciwgb3RoZXJ3aXNlIGNoZWNrIHRoZSBtb2RpZmllcnMgYXMgd2VsbFxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIGNocm9tZSB3aWxsIG5vdCBmaXJlIGEga2V5cHJlc3MgaWYgbWV0YSBvciBjb250cm9sIGlzIGRvd25cbiAgICAgICAgICAgIC8vIHNhZmFyaSB3aWxsIGZpcmUgYSBrZXlwcmVzcyBpZiBtZXRhIG9yIG1ldGErc2hpZnQgaXMgZG93blxuICAgICAgICAgICAgLy8gZmlyZWZveCB3aWxsIGZpcmUgYSBrZXlwcmVzcyBpZiBtZXRhIG9yIGNvbnRyb2wgaXMgZG93blxuICAgICAgICAgICAgaWYgKChhY3Rpb24gPT0gJ2tleXByZXNzJyAmJiAhZS5tZXRhS2V5ICYmICFlLmN0cmxLZXkpIHx8IF9tb2RpZmllcnNNYXRjaChtb2RpZmllcnMsIGNhbGxiYWNrLm1vZGlmaWVycykpIHtcblxuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBpcyB1c2VkIHNvIGlmIHlvdSBjaGFuZ2UgeW91ciBtaW5kIGFuZCBjYWxsIGJpbmQgYVxuICAgICAgICAgICAgICAgIC8vIHNlY29uZCB0aW1lIHdpdGggYSBuZXcgZnVuY3Rpb24gdGhlIGZpcnN0IG9uZSBpcyBvdmVyd3JpdHRlblxuICAgICAgICAgICAgICAgIGlmIChyZW1vdmUgJiYgY2FsbGJhY2suY29tYm8gPT0gY29tYmluYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgX2NhbGxiYWNrc1tjaGFyYWN0ZXJdLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBtYXRjaGVzLnB1c2goY2FsbGJhY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1hdGNoZXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdGFrZXMgYSBrZXkgZXZlbnQgYW5kIGZpZ3VyZXMgb3V0IHdoYXQgdGhlIG1vZGlmaWVycyBhcmVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGVcbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9XG4gICAgICovXG4gICAgZnVuY3Rpb24gX2V2ZW50TW9kaWZpZXJzKGUpIHtcbiAgICAgICAgdmFyIG1vZGlmaWVycyA9IFtdO1xuXG4gICAgICAgIGlmIChlLnNoaWZ0S2V5KSB7XG4gICAgICAgICAgICBtb2RpZmllcnMucHVzaCgnc2hpZnQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlLmFsdEtleSkge1xuICAgICAgICAgICAgbW9kaWZpZXJzLnB1c2goJ2FsdCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGUuY3RybEtleSkge1xuICAgICAgICAgICAgbW9kaWZpZXJzLnB1c2goJ2N0cmwnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlLm1ldGFLZXkpIHtcbiAgICAgICAgICAgIG1vZGlmaWVycy5wdXNoKCdtZXRhJyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbW9kaWZpZXJzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGFjdHVhbGx5IGNhbGxzIHRoZSBjYWxsYmFjayBmdW5jdGlvblxuICAgICAqXG4gICAgICogaWYgeW91ciBjYWxsYmFjayBmdW5jdGlvbiByZXR1cm5zIGZhbHNlIHRoaXMgd2lsbCB1c2UgdGhlIGpxdWVyeVxuICAgICAqIGNvbnZlbnRpb24gLSBwcmV2ZW50IGRlZmF1bHQgYW5kIHN0b3AgcHJvcG9nYXRpb24gb24gdGhlIGV2ZW50XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgICAqIEBwYXJhbSB7RXZlbnR9IGVcbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgZnVuY3Rpb24gX2ZpcmVDYWxsYmFjayhjYWxsYmFjaywgZSkge1xuICAgICAgICBpZiAoY2FsbGJhY2soZSkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBpZiAoZS5wcmV2ZW50RGVmYXVsdCkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGUuc3RvcFByb3BhZ2F0aW9uKSB7XG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZS5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xuICAgICAgICAgICAgZS5jYW5jZWxCdWJibGUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogaGFuZGxlcyBhIGNoYXJhY3RlciBrZXkgZXZlbnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjaGFyYWN0ZXJcbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBlXG4gICAgICogQHJldHVybnMgdm9pZFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9oYW5kbGVDaGFyYWN0ZXIoY2hhcmFjdGVyLCBlKSB7XG5cbiAgICAgICAgLy8gaWYgdGhpcyBldmVudCBzaG91bGQgbm90IGhhcHBlbiBzdG9wIGhlcmVcbiAgICAgICAgaWYgKE1vdXNldHJhcC5zdG9wQ2FsbGJhY2soZSwgZS50YXJnZXQgfHwgZS5zcmNFbGVtZW50KSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNhbGxiYWNrcyA9IF9nZXRNYXRjaGVzKGNoYXJhY3RlciwgX2V2ZW50TW9kaWZpZXJzKGUpLCBlKSxcbiAgICAgICAgICAgIGksXG4gICAgICAgICAgICBkb19ub3RfcmVzZXQgPSB7fSxcbiAgICAgICAgICAgIHByb2Nlc3NlZF9zZXF1ZW5jZV9jYWxsYmFjayA9IGZhbHNlO1xuXG4gICAgICAgIC8vIGxvb3AgdGhyb3VnaCBtYXRjaGluZyBjYWxsYmFja3MgZm9yIHRoaXMga2V5IGV2ZW50XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyArK2kpIHtcblxuICAgICAgICAgICAgLy8gZmlyZSBmb3IgYWxsIHNlcXVlbmNlIGNhbGxiYWNrc1xuICAgICAgICAgICAgLy8gdGhpcyBpcyBiZWNhdXNlIGlmIGZvciBleGFtcGxlIHlvdSBoYXZlIG11bHRpcGxlIHNlcXVlbmNlc1xuICAgICAgICAgICAgLy8gYm91bmQgc3VjaCBhcyBcImcgaVwiIGFuZCBcImcgdFwiIHRoZXkgYm90aCBuZWVkIHRvIGZpcmUgdGhlXG4gICAgICAgICAgICAvLyBjYWxsYmFjayBmb3IgbWF0Y2hpbmcgZyBjYXVzZSBvdGhlcndpc2UgeW91IGNhbiBvbmx5IGV2ZXJcbiAgICAgICAgICAgIC8vIG1hdGNoIHRoZSBmaXJzdCBvbmVcbiAgICAgICAgICAgIGlmIChjYWxsYmFja3NbaV0uc2VxKSB7XG4gICAgICAgICAgICAgICAgcHJvY2Vzc2VkX3NlcXVlbmNlX2NhbGxiYWNrID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIC8vIGtlZXAgYSBsaXN0IG9mIHdoaWNoIHNlcXVlbmNlcyB3ZXJlIG1hdGNoZXMgZm9yIGxhdGVyXG4gICAgICAgICAgICAgICAgZG9fbm90X3Jlc2V0W2NhbGxiYWNrc1tpXS5zZXFdID0gMTtcbiAgICAgICAgICAgICAgICBfZmlyZUNhbGxiYWNrKGNhbGxiYWNrc1tpXS5jYWxsYmFjaywgZSk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGlmIHRoZXJlIHdlcmUgbm8gc2VxdWVuY2UgbWF0Y2hlcyBidXQgd2UgYXJlIHN0aWxsIGhlcmVcbiAgICAgICAgICAgIC8vIHRoYXQgbWVhbnMgdGhpcyBpcyBhIHJlZ3VsYXIgbWF0Y2ggc28gd2Ugc2hvdWxkIGZpcmUgdGhhdFxuICAgICAgICAgICAgaWYgKCFwcm9jZXNzZWRfc2VxdWVuY2VfY2FsbGJhY2sgJiYgIV9pbnNpZGVfc2VxdWVuY2UpIHtcbiAgICAgICAgICAgICAgICBfZmlyZUNhbGxiYWNrKGNhbGxiYWNrc1tpXS5jYWxsYmFjaywgZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiB5b3UgYXJlIGluc2lkZSBvZiBhIHNlcXVlbmNlIGFuZCB0aGUga2V5IHlvdSBhcmUgcHJlc3NpbmdcbiAgICAgICAgLy8gaXMgbm90IGEgbW9kaWZpZXIga2V5IHRoZW4gd2Ugc2hvdWxkIHJlc2V0IGFsbCBzZXF1ZW5jZXNcbiAgICAgICAgLy8gdGhhdCB3ZXJlIG5vdCBtYXRjaGVkIGJ5IHRoaXMga2V5IGV2ZW50XG4gICAgICAgIGlmIChlLnR5cGUgPT0gX2luc2lkZV9zZXF1ZW5jZSAmJiAhX2lzTW9kaWZpZXIoY2hhcmFjdGVyKSkge1xuICAgICAgICAgICAgX3Jlc2V0U2VxdWVuY2VzKGRvX25vdF9yZXNldCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBoYW5kbGVzIGEga2V5ZG93biBldmVudFxuICAgICAqXG4gICAgICogQHBhcmFtIHtFdmVudH0gZVxuICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfaGFuZGxlS2V5KGUpIHtcblxuICAgICAgICAvLyBub3JtYWxpemUgZS53aGljaCBmb3Iga2V5IGV2ZW50c1xuICAgICAgICAvLyBAc2VlIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNDI4NTYyNy9qYXZhc2NyaXB0LWtleWNvZGUtdnMtY2hhcmNvZGUtdXR0ZXItY29uZnVzaW9uXG4gICAgICAgIGUud2hpY2ggPSB0eXBlb2YgZS53aGljaCA9PSBcIm51bWJlclwiID8gZS53aGljaCA6IGUua2V5Q29kZTtcblxuICAgICAgICB2YXIgY2hhcmFjdGVyID0gX2NoYXJhY3RlckZyb21FdmVudChlKTtcblxuICAgICAgICAvLyBubyBjaGFyYWN0ZXIgZm91bmQgdGhlbiBzdG9wXG4gICAgICAgIGlmICghY2hhcmFjdGVyKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZS50eXBlID09ICdrZXl1cCcgJiYgX2lnbm9yZV9uZXh0X2tleXVwID09IGNoYXJhY3Rlcikge1xuICAgICAgICAgICAgX2lnbm9yZV9uZXh0X2tleXVwID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBfaGFuZGxlQ2hhcmFjdGVyKGNoYXJhY3RlciwgZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogZGV0ZXJtaW5lcyBpZiB0aGUga2V5Y29kZSBzcGVjaWZpZWQgaXMgYSBtb2RpZmllciBrZXkgb3Igbm90XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5XG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgZnVuY3Rpb24gX2lzTW9kaWZpZXIoa2V5KSB7XG4gICAgICAgIHJldHVybiBrZXkgPT0gJ3NoaWZ0JyB8fCBrZXkgPT0gJ2N0cmwnIHx8IGtleSA9PSAnYWx0JyB8fCBrZXkgPT0gJ21ldGEnO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNhbGxlZCB0byBzZXQgYSAxIHNlY29uZCB0aW1lb3V0IG9uIHRoZSBzcGVjaWZpZWQgc2VxdWVuY2VcbiAgICAgKlxuICAgICAqIHRoaXMgaXMgc28gYWZ0ZXIgZWFjaCBrZXkgcHJlc3MgaW4gdGhlIHNlcXVlbmNlIHlvdSBoYXZlIDEgc2Vjb25kXG4gICAgICogdG8gcHJlc3MgdGhlIG5leHQga2V5IGJlZm9yZSB5b3UgaGF2ZSB0byBzdGFydCBvdmVyXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgZnVuY3Rpb24gX3Jlc2V0U2VxdWVuY2VUaW1lcigpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KF9yZXNldF90aW1lcik7XG4gICAgICAgIF9yZXNldF90aW1lciA9IHNldFRpbWVvdXQoX3Jlc2V0U2VxdWVuY2VzLCAxMDAwKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXZlcnNlcyB0aGUgbWFwIGxvb2t1cCBzbyB0aGF0IHdlIGNhbiBsb29rIGZvciBzcGVjaWZpYyBrZXlzXG4gICAgICogdG8gc2VlIHdoYXQgY2FuIGFuZCBjYW4ndCB1c2Uga2V5cHJlc3NcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfZ2V0UmV2ZXJzZU1hcCgpIHtcbiAgICAgICAgaWYgKCFfUkVWRVJTRV9NQVApIHtcbiAgICAgICAgICAgIF9SRVZFUlNFX01BUCA9IHt9O1xuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIF9NQVApIHtcblxuICAgICAgICAgICAgICAgIC8vIHB1bGwgb3V0IHRoZSBudW1lcmljIGtleXBhZCBmcm9tIGhlcmUgY2F1c2Uga2V5cHJlc3Mgc2hvdWxkXG4gICAgICAgICAgICAgICAgLy8gYmUgYWJsZSB0byBkZXRlY3QgdGhlIGtleXMgZnJvbSB0aGUgY2hhcmFjdGVyXG4gICAgICAgICAgICAgICAgaWYgKGtleSA+IDk1ICYmIGtleSA8IDExMikge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoX01BUC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIF9SRVZFUlNFX01BUFtfTUFQW2tleV1dID0ga2V5O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gX1JFVkVSU0VfTUFQO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHBpY2tzIHRoZSBiZXN0IGFjdGlvbiBiYXNlZCBvbiB0aGUga2V5IGNvbWJpbmF0aW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IC0gY2hhcmFjdGVyIGZvciBrZXlcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBtb2RpZmllcnNcbiAgICAgKiBAcGFyYW0ge3N0cmluZz19IGFjdGlvbiBwYXNzZWQgaW5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfcGlja0Jlc3RBY3Rpb24oa2V5LCBtb2RpZmllcnMsIGFjdGlvbikge1xuXG4gICAgICAgIC8vIGlmIG5vIGFjdGlvbiB3YXMgcGlja2VkIGluIHdlIHNob3VsZCB0cnkgdG8gcGljayB0aGUgb25lXG4gICAgICAgIC8vIHRoYXQgd2UgdGhpbmsgd291bGQgd29yayBiZXN0IGZvciB0aGlzIGtleVxuICAgICAgICBpZiAoIWFjdGlvbikge1xuICAgICAgICAgICAgYWN0aW9uID0gX2dldFJldmVyc2VNYXAoKVtrZXldID8gJ2tleWRvd24nIDogJ2tleXByZXNzJztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG1vZGlmaWVyIGtleXMgZG9uJ3Qgd29yayBhcyBleHBlY3RlZCB3aXRoIGtleXByZXNzLFxuICAgICAgICAvLyBzd2l0Y2ggdG8ga2V5ZG93blxuICAgICAgICBpZiAoYWN0aW9uID09ICdrZXlwcmVzcycgJiYgbW9kaWZpZXJzLmxlbmd0aCkge1xuICAgICAgICAgICAgYWN0aW9uID0gJ2tleWRvd24nO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFjdGlvbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBiaW5kcyBhIGtleSBzZXF1ZW5jZSB0byBhbiBldmVudFxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNvbWJvIC0gY29tYm8gc3BlY2lmaWVkIGluIGJpbmQgY2FsbFxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGtleXNcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgICAqIEBwYXJhbSB7c3RyaW5nPX0gYWN0aW9uXG4gICAgICogQHJldHVybnMgdm9pZFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9iaW5kU2VxdWVuY2UoY29tYm8sIGtleXMsIGNhbGxiYWNrLCBhY3Rpb24pIHtcblxuICAgICAgICAvLyBzdGFydCBvZmYgYnkgYWRkaW5nIGEgc2VxdWVuY2UgbGV2ZWwgcmVjb3JkIGZvciB0aGlzIGNvbWJpbmF0aW9uXG4gICAgICAgIC8vIGFuZCBzZXR0aW5nIHRoZSBsZXZlbCB0byAwXG4gICAgICAgIF9zZXF1ZW5jZV9sZXZlbHNbY29tYm9dID0gMDtcblxuICAgICAgICAvLyBpZiB0aGVyZSBpcyBubyBhY3Rpb24gcGljayB0aGUgYmVzdCBvbmUgZm9yIHRoZSBmaXJzdCBrZXlcbiAgICAgICAgLy8gaW4gdGhlIHNlcXVlbmNlXG4gICAgICAgIGlmICghYWN0aW9uKSB7XG4gICAgICAgICAgICBhY3Rpb24gPSBfcGlja0Jlc3RBY3Rpb24oa2V5c1swXSwgW10pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIGNhbGxiYWNrIHRvIGluY3JlYXNlIHRoZSBzZXF1ZW5jZSBsZXZlbCBmb3IgdGhpcyBzZXF1ZW5jZSBhbmQgcmVzZXRcbiAgICAgICAgICogYWxsIG90aGVyIHNlcXVlbmNlcyB0aGF0IHdlcmUgYWN0aXZlXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7RXZlbnR9IGVcbiAgICAgICAgICogQHJldHVybnMgdm9pZFxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIF9pbmNyZWFzZVNlcXVlbmNlID0gZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIF9pbnNpZGVfc2VxdWVuY2UgPSBhY3Rpb247XG4gICAgICAgICAgICAgICAgKytfc2VxdWVuY2VfbGV2ZWxzW2NvbWJvXTtcbiAgICAgICAgICAgICAgICBfcmVzZXRTZXF1ZW5jZVRpbWVyKCk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIHdyYXBzIHRoZSBzcGVjaWZpZWQgY2FsbGJhY2sgaW5zaWRlIG9mIGFub3RoZXIgZnVuY3Rpb24gaW4gb3JkZXJcbiAgICAgICAgICAgICAqIHRvIHJlc2V0IGFsbCBzZXF1ZW5jZSBjb3VudGVycyBhcyBzb29uIGFzIHRoaXMgc2VxdWVuY2UgaXMgZG9uZVxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIEBwYXJhbSB7RXZlbnR9IGVcbiAgICAgICAgICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgX2NhbGxiYWNrQW5kUmVzZXQgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgX2ZpcmVDYWxsYmFjayhjYWxsYmFjaywgZSk7XG5cbiAgICAgICAgICAgICAgICAvLyB3ZSBzaG91bGQgaWdub3JlIHRoZSBuZXh0IGtleSB1cCBpZiB0aGUgYWN0aW9uIGlzIGtleSBkb3duXG4gICAgICAgICAgICAgICAgLy8gb3Iga2V5cHJlc3MuICB0aGlzIGlzIHNvIGlmIHlvdSBmaW5pc2ggYSBzZXF1ZW5jZSBhbmRcbiAgICAgICAgICAgICAgICAvLyByZWxlYXNlIHRoZSBrZXkgdGhlIGZpbmFsIGtleSB3aWxsIG5vdCB0cmlnZ2VyIGEga2V5dXBcbiAgICAgICAgICAgICAgICBpZiAoYWN0aW9uICE9PSAna2V5dXAnKSB7XG4gICAgICAgICAgICAgICAgICAgIF9pZ25vcmVfbmV4dF9rZXl1cCA9IF9jaGFyYWN0ZXJGcm9tRXZlbnQoZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gd2VpcmQgcmFjZSBjb25kaXRpb24gaWYgYSBzZXF1ZW5jZSBlbmRzIHdpdGggdGhlIGtleVxuICAgICAgICAgICAgICAgIC8vIGFub3RoZXIgc2VxdWVuY2UgYmVnaW5zIHdpdGhcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KF9yZXNldFNlcXVlbmNlcywgMTApO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGk7XG5cbiAgICAgICAgLy8gbG9vcCB0aHJvdWdoIGtleXMgb25lIGF0IGEgdGltZSBhbmQgYmluZCB0aGUgYXBwcm9wcmlhdGUgY2FsbGJhY2tcbiAgICAgICAgLy8gZnVuY3Rpb24uICBmb3IgYW55IGtleSBsZWFkaW5nIHVwIHRvIHRoZSBmaW5hbCBvbmUgaXQgc2hvdWxkXG4gICAgICAgIC8vIGluY3JlYXNlIHRoZSBzZXF1ZW5jZS4gYWZ0ZXIgdGhlIGZpbmFsLCBpdCBzaG91bGQgcmVzZXQgYWxsIHNlcXVlbmNlc1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgX2JpbmRTaW5nbGUoa2V5c1tpXSwgaSA8IGtleXMubGVuZ3RoIC0gMSA/IF9pbmNyZWFzZVNlcXVlbmNlIDogX2NhbGxiYWNrQW5kUmVzZXQsIGFjdGlvbiwgY29tYm8sIGkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYmluZHMgYSBzaW5nbGUga2V5Ym9hcmQgY29tYmluYXRpb25cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjb21iaW5hdGlvblxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAgICogQHBhcmFtIHtzdHJpbmc9fSBhY3Rpb25cbiAgICAgKiBAcGFyYW0ge3N0cmluZz19IHNlcXVlbmNlX25hbWUgLSBuYW1lIG9mIHNlcXVlbmNlIGlmIHBhcnQgb2Ygc2VxdWVuY2VcbiAgICAgKiBAcGFyYW0ge251bWJlcj19IGxldmVsIC0gd2hhdCBwYXJ0IG9mIHRoZSBzZXF1ZW5jZSB0aGUgY29tbWFuZCBpc1xuICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfYmluZFNpbmdsZShjb21iaW5hdGlvbiwgY2FsbGJhY2ssIGFjdGlvbiwgc2VxdWVuY2VfbmFtZSwgbGV2ZWwpIHtcblxuICAgICAgICAvLyBtYWtlIHN1cmUgbXVsdGlwbGUgc3BhY2VzIGluIGEgcm93IGJlY29tZSBhIHNpbmdsZSBzcGFjZVxuICAgICAgICBjb21iaW5hdGlvbiA9IGNvbWJpbmF0aW9uLnJlcGxhY2UoL1xccysvZywgJyAnKTtcblxuICAgICAgICB2YXIgc2VxdWVuY2UgPSBjb21iaW5hdGlvbi5zcGxpdCgnICcpLFxuICAgICAgICAgICAgaSxcbiAgICAgICAgICAgIGtleSxcbiAgICAgICAgICAgIGtleXMsXG4gICAgICAgICAgICBtb2RpZmllcnMgPSBbXTtcblxuICAgICAgICAvLyBpZiB0aGlzIHBhdHRlcm4gaXMgYSBzZXF1ZW5jZSBvZiBrZXlzIHRoZW4gcnVuIHRocm91Z2ggdGhpcyBtZXRob2RcbiAgICAgICAgLy8gdG8gcmVwcm9jZXNzIGVhY2ggcGF0dGVybiBvbmUga2V5IGF0IGEgdGltZVxuICAgICAgICBpZiAoc2VxdWVuY2UubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgX2JpbmRTZXF1ZW5jZShjb21iaW5hdGlvbiwgc2VxdWVuY2UsIGNhbGxiYWNrLCBhY3Rpb24pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdGFrZSB0aGUga2V5cyBmcm9tIHRoaXMgcGF0dGVybiBhbmQgZmlndXJlIG91dCB3aGF0IHRoZSBhY3R1YWxcbiAgICAgICAgLy8gcGF0dGVybiBpcyBhbGwgYWJvdXRcbiAgICAgICAga2V5cyA9IGNvbWJpbmF0aW9uID09PSAnKycgPyBbJysnXSA6IGNvbWJpbmF0aW9uLnNwbGl0KCcrJyk7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGtleXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGtleSA9IGtleXNbaV07XG5cbiAgICAgICAgICAgIC8vIG5vcm1hbGl6ZSBrZXkgbmFtZXNcbiAgICAgICAgICAgIGlmIChfU1BFQ0lBTF9BTElBU0VTW2tleV0pIHtcbiAgICAgICAgICAgICAgICBrZXkgPSBfU1BFQ0lBTF9BTElBU0VTW2tleV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGlmIHRoaXMgaXMgbm90IGEga2V5cHJlc3MgZXZlbnQgdGhlbiB3ZSBzaG91bGRcbiAgICAgICAgICAgIC8vIGJlIHNtYXJ0IGFib3V0IHVzaW5nIHNoaWZ0IGtleXNcbiAgICAgICAgICAgIC8vIHRoaXMgd2lsbCBvbmx5IHdvcmsgZm9yIFVTIGtleWJvYXJkcyBob3dldmVyXG4gICAgICAgICAgICBpZiAoYWN0aW9uICYmIGFjdGlvbiAhPSAna2V5cHJlc3MnICYmIF9TSElGVF9NQVBba2V5XSkge1xuICAgICAgICAgICAgICAgIGtleSA9IF9TSElGVF9NQVBba2V5XTtcbiAgICAgICAgICAgICAgICBtb2RpZmllcnMucHVzaCgnc2hpZnQnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gaWYgdGhpcyBrZXkgaXMgYSBtb2RpZmllciB0aGVuIGFkZCBpdCB0byB0aGUgbGlzdCBvZiBtb2RpZmllcnNcbiAgICAgICAgICAgIGlmIChfaXNNb2RpZmllcihrZXkpKSB7XG4gICAgICAgICAgICAgICAgbW9kaWZpZXJzLnB1c2goa2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGRlcGVuZGluZyBvbiB3aGF0IHRoZSBrZXkgY29tYmluYXRpb24gaXNcbiAgICAgICAgLy8gd2Ugd2lsbCB0cnkgdG8gcGljayB0aGUgYmVzdCBldmVudCBmb3IgaXRcbiAgICAgICAgYWN0aW9uID0gX3BpY2tCZXN0QWN0aW9uKGtleSwgbW9kaWZpZXJzLCBhY3Rpb24pO1xuXG4gICAgICAgIC8vIG1ha2Ugc3VyZSB0byBpbml0aWFsaXplIGFycmF5IGlmIHRoaXMgaXMgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gYSBjYWxsYmFjayBpcyBhZGRlZCBmb3IgdGhpcyBrZXlcbiAgICAgICAgaWYgKCFfY2FsbGJhY2tzW2tleV0pIHtcbiAgICAgICAgICAgIF9jYWxsYmFja3Nba2V5XSA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmVtb3ZlIGFuIGV4aXN0aW5nIG1hdGNoIGlmIHRoZXJlIGlzIG9uZVxuICAgICAgICBfZ2V0TWF0Y2hlcyhrZXksIG1vZGlmaWVycywge3R5cGU6IGFjdGlvbn0sICFzZXF1ZW5jZV9uYW1lLCBjb21iaW5hdGlvbik7XG5cbiAgICAgICAgLy8gYWRkIHRoaXMgY2FsbCBiYWNrIHRvIHRoZSBhcnJheVxuICAgICAgICAvLyBpZiBpdCBpcyBhIHNlcXVlbmNlIHB1dCBpdCBhdCB0aGUgYmVnaW5uaW5nXG4gICAgICAgIC8vIGlmIG5vdCBwdXQgaXQgYXQgdGhlIGVuZFxuICAgICAgICAvL1xuICAgICAgICAvLyB0aGlzIGlzIGltcG9ydGFudCBiZWNhdXNlIHRoZSB3YXkgdGhlc2UgYXJlIHByb2Nlc3NlZCBleHBlY3RzXG4gICAgICAgIC8vIHRoZSBzZXF1ZW5jZSBvbmVzIHRvIGNvbWUgZmlyc3RcbiAgICAgICAgX2NhbGxiYWNrc1trZXldW3NlcXVlbmNlX25hbWUgPyAndW5zaGlmdCcgOiAncHVzaCddKHtcbiAgICAgICAgICAgIGNhbGxiYWNrOiBjYWxsYmFjayxcbiAgICAgICAgICAgIG1vZGlmaWVyczogbW9kaWZpZXJzLFxuICAgICAgICAgICAgYWN0aW9uOiBhY3Rpb24sXG4gICAgICAgICAgICBzZXE6IHNlcXVlbmNlX25hbWUsXG4gICAgICAgICAgICBsZXZlbDogbGV2ZWwsXG4gICAgICAgICAgICBjb21ibzogY29tYmluYXRpb25cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYmluZHMgbXVsdGlwbGUgY29tYmluYXRpb25zIHRvIHRoZSBzYW1lIGNhbGxiYWNrXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBjb21iaW5hdGlvbnNcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfHVuZGVmaW5lZH0gYWN0aW9uXG4gICAgICogQHJldHVybnMgdm9pZFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9iaW5kTXVsdGlwbGUoY29tYmluYXRpb25zLCBjYWxsYmFjaywgYWN0aW9uKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29tYmluYXRpb25zLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBfYmluZFNpbmdsZShjb21iaW5hdGlvbnNbaV0sIGNhbGxiYWNrLCBhY3Rpb24pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gc3RhcnQhXG4gICAgX2FkZEV2ZW50KGRvY3VtZW50LCAna2V5cHJlc3MnLCBfaGFuZGxlS2V5KTtcbiAgICBfYWRkRXZlbnQoZG9jdW1lbnQsICdrZXlkb3duJywgX2hhbmRsZUtleSk7XG4gICAgX2FkZEV2ZW50KGRvY3VtZW50LCAna2V5dXAnLCBfaGFuZGxlS2V5KTtcblxuICAgIHZhciBNb3VzZXRyYXAgPSB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIGJpbmRzIGFuIGV2ZW50IHRvIG1vdXNldHJhcFxuICAgICAgICAgKlxuICAgICAgICAgKiBjYW4gYmUgYSBzaW5nbGUga2V5LCBhIGNvbWJpbmF0aW9uIG9mIGtleXMgc2VwYXJhdGVkIHdpdGggKyxcbiAgICAgICAgICogYW4gYXJyYXkgb2Yga2V5cywgb3IgYSBzZXF1ZW5jZSBvZiBrZXlzIHNlcGFyYXRlZCBieSBzcGFjZXNcbiAgICAgICAgICpcbiAgICAgICAgICogYmUgc3VyZSB0byBsaXN0IHRoZSBtb2RpZmllciBrZXlzIGZpcnN0IHRvIG1ha2Ugc3VyZSB0aGF0IHRoZVxuICAgICAgICAgKiBjb3JyZWN0IGtleSBlbmRzIHVwIGdldHRpbmcgYm91bmQgKHRoZSBsYXN0IGtleSBpbiB0aGUgcGF0dGVybilcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd8QXJyYXl9IGtleXNcbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmc9fSBhY3Rpb24gLSAna2V5cHJlc3MnLCAna2V5ZG93bicsIG9yICdrZXl1cCdcbiAgICAgICAgICogQHJldHVybnMgdm9pZFxuICAgICAgICAgKi9cbiAgICAgICAgYmluZDogZnVuY3Rpb24oa2V5cywgY2FsbGJhY2ssIGFjdGlvbikge1xuICAgICAgICAgICAgX2JpbmRNdWx0aXBsZShrZXlzIGluc3RhbmNlb2YgQXJyYXkgPyBrZXlzIDogW2tleXNdLCBjYWxsYmFjaywgYWN0aW9uKTtcbiAgICAgICAgICAgIF9kaXJlY3RfbWFwW2tleXMgKyAnOicgKyBhY3Rpb25dID0gY2FsbGJhY2s7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogdW5iaW5kcyBhbiBldmVudCB0byBtb3VzZXRyYXBcbiAgICAgICAgICpcbiAgICAgICAgICogdGhlIHVuYmluZGluZyBzZXRzIHRoZSBjYWxsYmFjayBmdW5jdGlvbiBvZiB0aGUgc3BlY2lmaWVkIGtleSBjb21ib1xuICAgICAgICAgKiB0byBhbiBlbXB0eSBmdW5jdGlvbiBhbmQgZGVsZXRlcyB0aGUgY29ycmVzcG9uZGluZyBrZXkgaW4gdGhlXG4gICAgICAgICAqIF9kaXJlY3RfbWFwIGRpY3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIHRoZSBrZXljb21ibythY3Rpb24gaGFzIHRvIGJlIGV4YWN0bHkgdGhlIHNhbWUgYXNcbiAgICAgICAgICogaXQgd2FzIGRlZmluZWQgaW4gdGhlIGJpbmQgbWV0aG9kXG4gICAgICAgICAqXG4gICAgICAgICAqIFRPRE86IGFjdHVhbGx5IHJlbW92ZSB0aGlzIGZyb20gdGhlIF9jYWxsYmFja3MgZGljdGlvbmFyeSBpbnN0ZWFkXG4gICAgICAgICAqIG9mIGJpbmRpbmcgYW4gZW1wdHkgZnVuY3Rpb25cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd8QXJyYXl9IGtleXNcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGFjdGlvblxuICAgICAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICAgICAqL1xuICAgICAgICB1bmJpbmQ6IGZ1bmN0aW9uKGtleXMsIGFjdGlvbikge1xuICAgICAgICAgICAgaWYgKF9kaXJlY3RfbWFwW2tleXMgKyAnOicgKyBhY3Rpb25dKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIF9kaXJlY3RfbWFwW2tleXMgKyAnOicgKyBhY3Rpb25dO1xuICAgICAgICAgICAgICAgIHRoaXMuYmluZChrZXlzLCBmdW5jdGlvbigpIHt9LCBhY3Rpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIHRyaWdnZXJzIGFuIGV2ZW50IHRoYXQgaGFzIGFscmVhZHkgYmVlbiBib3VuZFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5c1xuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZz19IGFjdGlvblxuICAgICAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICAgICAqL1xuICAgICAgICB0cmlnZ2VyOiBmdW5jdGlvbihrZXlzLCBhY3Rpb24pIHtcbiAgICAgICAgICAgIF9kaXJlY3RfbWFwW2tleXMgKyAnOicgKyBhY3Rpb25dKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogcmVzZXRzIHRoZSBsaWJyYXJ5IGJhY2sgdG8gaXRzIGluaXRpYWwgc3RhdGUuICB0aGlzIGlzIHVzZWZ1bFxuICAgICAgICAgKiBpZiB5b3Ugd2FudCB0byBjbGVhciBvdXQgdGhlIGN1cnJlbnQga2V5Ym9hcmQgc2hvcnRjdXRzIGFuZCBiaW5kXG4gICAgICAgICAqIG5ldyBvbmVzIC0gZm9yIGV4YW1wbGUgaWYgeW91IHN3aXRjaCB0byBhbm90aGVyIHBhZ2VcbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMgdm9pZFxuICAgICAgICAgKi9cbiAgICAgICAgcmVzZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgX2NhbGxiYWNrcyA9IHt9O1xuICAgICAgICAgICAgX2RpcmVjdF9tYXAgPSB7fTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgLyoqXG4gICAgICAgICogc2hvdWxkIHdlIHN0b3AgdGhpcyBldmVudCBiZWZvcmUgZmlyaW5nIG9mZiBjYWxsYmFja3NcbiAgICAgICAgKlxuICAgICAgICAqIEBwYXJhbSB7RXZlbnR9IGVcbiAgICAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnRcbiAgICAgICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgICAgICAqL1xuICAgICAgICBzdG9wQ2FsbGJhY2s6IGZ1bmN0aW9uKGUsIGVsZW1lbnQpIHtcblxuICAgICAgICAgICAgLy8gaWYgdGhlIGVsZW1lbnQgaGFzIHRoZSBjbGFzcyBcIm1vdXNldHJhcFwiIHRoZW4gbm8gbmVlZCB0byBzdG9wXG4gICAgICAgICAgICBpZiAoKCcgJyArIGVsZW1lbnQuY2xhc3NOYW1lICsgJyAnKS5pbmRleE9mKCcgbW91c2V0cmFwICcpID4gLTEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHN0b3AgZm9yIGlucHV0LCBzZWxlY3QsIGFuZCB0ZXh0YXJlYVxuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQudGFnTmFtZSA9PSAnSU5QVVQnIHx8IGVsZW1lbnQudGFnTmFtZSA9PSAnU0VMRUNUJyB8fCBlbGVtZW50LnRhZ05hbWUgPT0gJ1RFWFRBUkVBJyB8fCAoZWxlbWVudC5jb250ZW50RWRpdGFibGUgJiYgZWxlbWVudC5jb250ZW50RWRpdGFibGUgPT0gJ3RydWUnKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBleHBvc2UgbW91c2V0cmFwIHRvIHRoZSBnbG9iYWwgb2JqZWN0XG4gICAgd2luZG93Lk1vdXNldHJhcCA9IE1vdXNldHJhcDtcblxuICAgIC8vIGV4cG9zZSBtb3VzZXRyYXAgYXMgYW4gQU1EIG1vZHVsZVxuICAgIGlmICh0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoJ21vdXNldHJhcCcsIGZ1bmN0aW9uKCkgeyByZXR1cm4gTW91c2V0cmFwOyB9KTtcbiAgICB9XG4gICAgLy8gYnJvd3NlcmlmeSBzdXBwb3J0XG4gICAgaWYodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBNb3VzZXRyYXA7XG4gICAgfVxufSkgKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJvb3QgPSB0aGlzO1xuICAgIHZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG5cdHZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xuXHR2YXIgaW50ZXJ2YWxQYXJzZXIgPSAvKFswLTlcXC5dKykobXN8c3xtfGgpPy87XG5cdHZhciByb290ID0gZ2xvYmFsIHx8IHdpbmRvdztcblxuXHQvLyBMaWwgYml0IG9mIHVzZWZ1bCBwb2x5ZmlsbC4uLlxuXHRpZiAodHlwZW9mKEZ1bmN0aW9uLnByb3RvdHlwZS5pbmhlcml0cykgPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0RnVuY3Rpb24ucHJvdG90eXBlLmluaGVyaXRzID0gZnVuY3Rpb24ocGFyZW50KSB7XG5cdFx0XHR0aGlzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUocGFyZW50LnByb3RvdHlwZSk7XG5cdFx0fTtcblx0fVxuXG5cdGlmICh0eXBlb2YoQXJyYXkucHJvdG90eXBlLnJlbW92ZU9uZSkgPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0QXJyYXkucHJvdG90eXBlLnJlbW92ZU9uZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHdoYXQsIGEgPSBhcmd1bWVudHMsIEwgPSBhLmxlbmd0aCwgYXg7XG5cdFx0XHR3aGlsZSAoTCAmJiB0aGlzLmxlbmd0aCkge1xuXHRcdFx0XHR3aGF0ID0gYVstLUxdO1xuXHRcdFx0XHR3aGlsZSAoKGF4ID0gdGhpcy5pbmRleE9mKHdoYXQpKSAhPT0gLTEpIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5zcGxpY2UoYXgsIDEpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblx0fVxuXG5cdGZ1bmN0aW9uIGdyZWF0ZXN0Q29tbW9uRmFjdG9yKGludGVydmFscykge1xuXHRcdHZhciBzdW1PZk1vZHVsaSA9IDE7XG5cdFx0dmFyIGludGVydmFsID0gXy5taW4oaW50ZXJ2YWxzKTtcblx0XHR3aGlsZSAoc3VtT2ZNb2R1bGkgIT09IDApIHtcblx0XHRcdHN1bU9mTW9kdWxpID0gXy5yZWR1Y2UoaW50ZXJ2YWxzLCBmdW5jdGlvbihtZW1vLCBpKXsgcmV0dXJuIG1lbW8gKyAoaSAlIGludGVydmFsKTsgfSwgMCk7XG5cdFx0XHRpZiAoc3VtT2ZNb2R1bGkgIT09IDApIHtcblx0XHRcdFx0aW50ZXJ2YWwgLT0gMTA7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBpbnRlcnZhbDtcblx0fVxuXG5cdGZ1bmN0aW9uIHBhcnNlRXZlbnQoZSkge1xuXHRcdHZhciBpbnRlcnZhbEdyb3VwcyA9IGludGVydmFsUGFyc2VyLmV4ZWMoZSk7XG5cdFx0aWYgKCFpbnRlcnZhbEdyb3Vwcykge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdJIGRvblxcJ3QgdW5kZXJzdGFuZCB0aGF0IHBhcnRpY3VsYXIgaW50ZXJ2YWwnKTtcblx0XHR9XG5cdFx0dmFyIGludGVydmFsQW1vdW50ID0gK2ludGVydmFsR3JvdXBzWzFdO1xuXHRcdHZhciBpbnRlcnZhbFR5cGUgPSBpbnRlcnZhbEdyb3Vwc1syXSB8fCAnbXMnO1xuXHRcdGlmIChpbnRlcnZhbFR5cGUgPT09ICdzJykge1xuXHRcdFx0aW50ZXJ2YWxBbW91bnQgPSBpbnRlcnZhbEFtb3VudCAqIDEwMDA7XG5cdFx0fSBlbHNlIGlmIChpbnRlcnZhbFR5cGUgPT09ICdtJykge1xuXHRcdFx0aW50ZXJ2YWxBbW91bnQgPSBpbnRlcnZhbEFtb3VudCAqIDEwMDAgKiA2MDtcblx0XHR9IGVsc2UgaWYgKGludGVydmFsVHlwZSA9PT0gJ2gnKSB7XG5cdFx0XHRpbnRlcnZhbEFtb3VudCA9IGludGVydmFsQW1vdW50ICogMTAwMCAqIDYwICogNjA7XG5cdFx0fSBlbHNlIGlmICghIWludGVydmFsVHlwZSAmJiBpbnRlcnZhbFR5cGUgIT09ICdtcycpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignWW91IGNhbiBvbmx5IHNwZWNpZnkgaW50ZXJ2YWxzIG9mIG1zLCBzLCBtLCBvciBoJyk7XG5cdFx0fVxuXHRcdGlmIChpbnRlcnZhbEFtb3VudCA8IDEwIHx8IGludGVydmFsQW1vdW50ICUgMTAgIT09IDApIHtcblx0XHRcdC8vIFdlIG9ubHkgZGVhbCBpbiAxMCdzIG9mIG1pbGxpc2Vjb25kcyBmb3Igc2ltcGxpY2l0eVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdZb3UgY2FuIG9ubHkgc3BlY2lmeSAxMHMgb2YgbWlsbGlzZWNvbmRzLCB0cnVzdCBtZSBvbiB0aGlzIG9uZScpO1xuXHRcdH1cblx0XHRyZXR1cm4ge1xuXHRcdFx0YW1vdW50OmludGVydmFsQW1vdW50LFxuXHRcdFx0dHlwZTppbnRlcnZhbFR5cGVcblx0XHR9O1xuXHR9XG5cblx0ZnVuY3Rpb24gRXZlbnRlZExvb3AoKSB7XG5cdFx0dGhpcy5pbnRlcnZhbElkID0gdW5kZWZpbmVkO1xuXHRcdHRoaXMuaW50ZXJ2YWxMZW5ndGggPSB1bmRlZmluZWQ7XG5cdFx0dGhpcy5pbnRlcnZhbHNUb0VtaXQgPSB7fTtcblx0XHR0aGlzLmN1cnJlbnRUaWNrID0gMTtcblx0XHR0aGlzLm1heFRpY2tzID0gMDtcblx0XHR0aGlzLmxpc3RlbmluZ0ZvckZvY3VzID0gZmFsc2U7XG5cblx0XHQvLyBQcml2YXRlIG1ldGhvZFxuXHRcdHZhciBkZXRlcm1pbmVJbnRlcnZhbExlbmd0aCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciBwb3RlbnRpYWxJbnRlcnZhbExlbmd0aCA9IGdyZWF0ZXN0Q29tbW9uRmFjdG9yKF8ua2V5cyh0aGlzLmludGVydmFsc1RvRW1pdCkpO1xuXHRcdFx0dmFyIGNoYW5nZWQgPSBmYWxzZTtcblxuXHRcdFx0aWYgKHRoaXMuaW50ZXJ2YWxMZW5ndGgpIHtcblx0XHRcdFx0aWYgKHBvdGVudGlhbEludGVydmFsTGVuZ3RoICE9PSB0aGlzLmludGVydmFsTGVuZ3RoKSB7XG5cdFx0XHRcdFx0Ly8gTG9va3MgbGlrZSB3ZSBuZWVkIGEgbmV3IGludGVydmFsXG5cdFx0XHRcdFx0dGhpcy5pbnRlcnZhbExlbmd0aCA9IHBvdGVudGlhbEludGVydmFsTGVuZ3RoO1xuXHRcdFx0XHRcdGNoYW5nZWQgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLmludGVydmFsTGVuZ3RoID0gcG90ZW50aWFsSW50ZXJ2YWxMZW5ndGg7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMubWF4VGlja3MgPSBfLm1heChfLm1hcChfLmtleXModGhpcy5pbnRlcnZhbHNUb0VtaXQpLCBmdW5jdGlvbihhKSB7IHJldHVybiArYTsgfSkpIC8gdGhpcy5pbnRlcnZhbExlbmd0aDtcblx0XHRcdHJldHVybiBjaGFuZ2VkO1xuXHRcdH0uYmluZCh0aGlzKTtcblxuXHRcdHRoaXMub24oJ25ld0xpc3RlbmVyJywgZnVuY3Rpb24gKGUpIHtcblx0XHRcdGlmIChlID09PSAncmVtb3ZlTGlzdGVuZXInIHx8IGUgPT09ICduZXdMaXN0ZW5lcicpIHJldHVybjsgLy8gV2UgZG9uJ3QgY2FyZSBhYm91dCB0aGF0IG9uZVxuXHRcdFx0dmFyIGludGVydmFsSW5mbyA9IHBhcnNlRXZlbnQoZSk7XG5cdFx0XHR2YXIgaW50ZXJ2YWxBbW91bnQgPSBpbnRlcnZhbEluZm8uYW1vdW50O1xuXG5cdFx0XHR0aGlzLmludGVydmFsc1RvRW1pdFsraW50ZXJ2YWxBbW91bnRdID0gXy51bmlvbih0aGlzLmludGVydmFsc1RvRW1pdFsraW50ZXJ2YWxBbW91bnRdIHx8IFtdLCBbZV0pO1xuXHRcdFx0XG5cdFx0XHRpZiAoZGV0ZXJtaW5lSW50ZXJ2YWxMZW5ndGgoKSAmJiB0aGlzLmlzU3RhcnRlZCgpKSB7XG5cdFx0XHRcdHRoaXMuc3RvcCgpLnN0YXJ0KCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHR0aGlzLm9uKCdyZW1vdmVMaXN0ZW5lcicsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRpZiAoRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQodGhpcywgZSkgPiAwKSByZXR1cm47XG5cdFx0XHR2YXIgaW50ZXJ2YWxJbmZvID0gcGFyc2VFdmVudChlKTtcblx0XHRcdHZhciBpbnRlcnZhbEFtb3VudCA9IGludGVydmFsSW5mby5hbW91bnQ7XG5cblx0XHRcdHZhciByZW1vdmVkRXZlbnQgPSB0aGlzLmludGVydmFsc1RvRW1pdFsraW50ZXJ2YWxBbW91bnRdLnJlbW92ZU9uZShlKTtcblx0XHRcdGlmICh0aGlzLmludGVydmFsc1RvRW1pdFsraW50ZXJ2YWxBbW91bnRdLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRkZWxldGUgdGhpcy5pbnRlcnZhbHNUb0VtaXRbK2ludGVydmFsQW1vdW50XTtcblx0XHRcdH1cblx0XHRcdGNvbnNvbGUubG9nKCdEZXRlcm1pbmluZyBpbnRlcnZhbCBsZW5ndGggYWZ0ZXIgcmVtb3ZhbCBvZicsIHJlbW92ZWRFdmVudCk7XG5cdFx0XHRkZXRlcm1pbmVJbnRlcnZhbExlbmd0aCgpO1xuXG5cdFx0XHRpZiAoZGV0ZXJtaW5lSW50ZXJ2YWxMZW5ndGgoKSAmJiB0aGlzLmlzU3RhcnRlZCgpKSB7XG5cdFx0XHRcdHRoaXMuc3RvcCgpLnN0YXJ0KCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHRFdmVudGVkTG9vcC5pbmhlcml0cyhFdmVudEVtaXR0ZXIpO1xuXG5cdC8vIFB1YmxpYyBtZXRob2RzXG5cdEV2ZW50ZWRMb29wLnByb3RvdHlwZS50aWNrID0gZnVuY3Rpb24gKCkge1xuXHRcdHZhciBtaWxsaXNlY29uZHMgPSB0aGlzLmN1cnJlbnRUaWNrICogdGhpcy5pbnRlcnZhbExlbmd0aDtcblx0XHRfLmVhY2godGhpcy5pbnRlcnZhbHNUb0VtaXQsIGZ1bmN0aW9uIChldmVudHMsIGtleSkge1xuXHRcdFx0aWYgKG1pbGxpc2Vjb25kcyAlIGtleSA9PT0gMCkge1xuXHRcdFx0XHRfLmVhY2goZXZlbnRzLCBmdW5jdGlvbihlKSB7IHRoaXMuZW1pdChlLCBlLCBrZXkpOyB9LmJpbmQodGhpcykpO1xuXHRcdFx0fVxuXHRcdH0uYmluZCh0aGlzKSk7XG5cdFx0dGhpcy5jdXJyZW50VGljayArPSAxO1xuXHRcdGlmICh0aGlzLmN1cnJlbnRUaWNrID4gdGhpcy5tYXhUaWNrcykge1xuXHRcdFx0dGhpcy5jdXJyZW50VGljayA9IDE7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzO1xuXHR9O1xuXG5cdEV2ZW50ZWRMb29wLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uICgpIHtcblx0XHRpZiAoIXRoaXMuaW50ZXJ2YWxMZW5ndGgpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignWW91IGhhdmVuXFwndCBzcGVjaWZpZWQgYW55IGludGVydmFsIGNhbGxiYWNrcy4gVXNlIEV2ZW50ZWRMb29wLm9uKFxcJzUwMG1zXFwnLCBmdW5jdGlvbiAoKSB7IC4uLiB9KSB0byBkbyBzbywgYW5kIHRoZW4geW91IGNhbiBzdGFydCcpO1xuXHRcdH1cblx0XHRpZiAodGhpcy5pbnRlcnZhbElkKSB7XG5cdFx0XHRyZXR1cm4gY29uc29sZS5sb2coJ05vIG5lZWQgdG8gc3RhcnQgdGhlIGxvb3AgYWdhaW4sIGl0XFwncyBhbHJlYWR5IHN0YXJ0ZWQuJyk7XG5cdFx0fVxuXG5cdFx0dGhpcy5pbnRlcnZhbElkID0gc2V0SW50ZXJ2YWwodGhpcy50aWNrLmJpbmQodGhpcyksIHRoaXMuaW50ZXJ2YWxMZW5ndGgpO1xuXG5cdFx0aWYgKHJvb3QgJiYgIXRoaXMubGlzdGVuaW5nRm9yRm9jdXMgJiYgcm9vdC5hZGRFdmVudExpc3RlbmVyKSB7XG5cdFx0XHRyb290LmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHRoaXMuc3RhcnQoKTtcblx0XHRcdH0uYmluZCh0aGlzKSk7XG5cblx0XHRcdHJvb3QuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR0aGlzLnN0b3AoKTtcblx0XHRcdH0uYmluZCh0aGlzKSk7XG5cblx0XHRcdHRoaXMubGlzdGVuaW5nRm9yRm9jdXMgPSB0cnVlO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcztcblx0fTtcblxuXHRFdmVudGVkTG9vcC5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uICgpIHtcblx0XHRjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWxJZCk7XG5cdFx0dGhpcy5pbnRlcnZhbElkID0gdW5kZWZpbmVkO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9O1xuXG5cdEV2ZW50ZWRMb29wLnByb3RvdHlwZS5pc1N0YXJ0ZWQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuICEhdGhpcy5pbnRlcnZhbElkO1xuXHR9O1xuXG5cdEV2ZW50ZWRMb29wLnByb3RvdHlwZS5ldmVyeSA9IEV2ZW50ZWRMb29wLnByb3RvdHlwZS5vbjtcblxuICAgIC8vIEV4cG9ydCB0aGUgRXZlbnRlZExvb3Agb2JqZWN0IGZvciAqKk5vZGUuanMqKiBvciBvdGhlclxuICAgIC8vIGNvbW1vbmpzIHN5c3RlbXMuIE90aGVyd2lzZSwgYWRkIGl0IGFzIGEgZ2xvYmFsIG9iamVjdCB0byB0aGUgcm9vdFxuICAgIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICAgICAgICBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBFdmVudGVkTG9vcDtcbiAgICAgICAgfVxuICAgICAgICBleHBvcnRzLkV2ZW50ZWRMb29wID0gRXZlbnRlZExvb3A7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICB3aW5kb3cuRXZlbnRlZExvb3AgPSBFdmVudGVkTG9vcDtcbiAgICB9XG59KS5jYWxsKHRoaXMpOyIsIi8vICAgICBVbmRlcnNjb3JlLmpzIDEuNi4wXG4vLyAgICAgaHR0cDovL3VuZGVyc2NvcmVqcy5vcmdcbi8vICAgICAoYykgMjAwOS0yMDE0IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4vLyAgICAgVW5kZXJzY29yZSBtYXkgYmUgZnJlZWx5IGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cblxuKGZ1bmN0aW9uKCkge1xuXG4gIC8vIEJhc2VsaW5lIHNldHVwXG4gIC8vIC0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gRXN0YWJsaXNoIHRoZSByb290IG9iamVjdCwgYHdpbmRvd2AgaW4gdGhlIGJyb3dzZXIsIG9yIGBleHBvcnRzYCBvbiB0aGUgc2VydmVyLlxuICB2YXIgcm9vdCA9IHRoaXM7XG5cbiAgLy8gU2F2ZSB0aGUgcHJldmlvdXMgdmFsdWUgb2YgdGhlIGBfYCB2YXJpYWJsZS5cbiAgdmFyIHByZXZpb3VzVW5kZXJzY29yZSA9IHJvb3QuXztcblxuICAvLyBFc3RhYmxpc2ggdGhlIG9iamVjdCB0aGF0IGdldHMgcmV0dXJuZWQgdG8gYnJlYWsgb3V0IG9mIGEgbG9vcCBpdGVyYXRpb24uXG4gIHZhciBicmVha2VyID0ge307XG5cbiAgLy8gU2F2ZSBieXRlcyBpbiB0aGUgbWluaWZpZWQgKGJ1dCBub3QgZ3ppcHBlZCkgdmVyc2lvbjpcbiAgdmFyIEFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGUsIE9ialByb3RvID0gT2JqZWN0LnByb3RvdHlwZSwgRnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuXG4gIC8vIENyZWF0ZSBxdWljayByZWZlcmVuY2UgdmFyaWFibGVzIGZvciBzcGVlZCBhY2Nlc3MgdG8gY29yZSBwcm90b3R5cGVzLlxuICB2YXJcbiAgICBwdXNoICAgICAgICAgICAgID0gQXJyYXlQcm90by5wdXNoLFxuICAgIHNsaWNlICAgICAgICAgICAgPSBBcnJheVByb3RvLnNsaWNlLFxuICAgIGNvbmNhdCAgICAgICAgICAgPSBBcnJheVByb3RvLmNvbmNhdCxcbiAgICB0b1N0cmluZyAgICAgICAgID0gT2JqUHJvdG8udG9TdHJpbmcsXG4gICAgaGFzT3duUHJvcGVydHkgICA9IE9ialByb3RvLmhhc093blByb3BlcnR5O1xuXG4gIC8vIEFsbCAqKkVDTUFTY3JpcHQgNSoqIG5hdGl2ZSBmdW5jdGlvbiBpbXBsZW1lbnRhdGlvbnMgdGhhdCB3ZSBob3BlIHRvIHVzZVxuICAvLyBhcmUgZGVjbGFyZWQgaGVyZS5cbiAgdmFyXG4gICAgbmF0aXZlRm9yRWFjaCAgICAgID0gQXJyYXlQcm90by5mb3JFYWNoLFxuICAgIG5hdGl2ZU1hcCAgICAgICAgICA9IEFycmF5UHJvdG8ubWFwLFxuICAgIG5hdGl2ZVJlZHVjZSAgICAgICA9IEFycmF5UHJvdG8ucmVkdWNlLFxuICAgIG5hdGl2ZVJlZHVjZVJpZ2h0ICA9IEFycmF5UHJvdG8ucmVkdWNlUmlnaHQsXG4gICAgbmF0aXZlRmlsdGVyICAgICAgID0gQXJyYXlQcm90by5maWx0ZXIsXG4gICAgbmF0aXZlRXZlcnkgICAgICAgID0gQXJyYXlQcm90by5ldmVyeSxcbiAgICBuYXRpdmVTb21lICAgICAgICAgPSBBcnJheVByb3RvLnNvbWUsXG4gICAgbmF0aXZlSW5kZXhPZiAgICAgID0gQXJyYXlQcm90by5pbmRleE9mLFxuICAgIG5hdGl2ZUxhc3RJbmRleE9mICA9IEFycmF5UHJvdG8ubGFzdEluZGV4T2YsXG4gICAgbmF0aXZlSXNBcnJheSAgICAgID0gQXJyYXkuaXNBcnJheSxcbiAgICBuYXRpdmVLZXlzICAgICAgICAgPSBPYmplY3Qua2V5cyxcbiAgICBuYXRpdmVCaW5kICAgICAgICAgPSBGdW5jUHJvdG8uYmluZDtcblxuICAvLyBDcmVhdGUgYSBzYWZlIHJlZmVyZW5jZSB0byB0aGUgVW5kZXJzY29yZSBvYmplY3QgZm9yIHVzZSBiZWxvdy5cbiAgdmFyIF8gPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAob2JqIGluc3RhbmNlb2YgXykgcmV0dXJuIG9iajtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgXykpIHJldHVybiBuZXcgXyhvYmopO1xuICAgIHRoaXMuX3dyYXBwZWQgPSBvYmo7XG4gIH07XG5cbiAgLy8gRXhwb3J0IHRoZSBVbmRlcnNjb3JlIG9iamVjdCBmb3IgKipOb2RlLmpzKiosIHdpdGhcbiAgLy8gYmFja3dhcmRzLWNvbXBhdGliaWxpdHkgZm9yIHRoZSBvbGQgYHJlcXVpcmUoKWAgQVBJLiBJZiB3ZSdyZSBpblxuICAvLyB0aGUgYnJvd3NlciwgYWRkIGBfYCBhcyBhIGdsb2JhbCBvYmplY3QgdmlhIGEgc3RyaW5nIGlkZW50aWZpZXIsXG4gIC8vIGZvciBDbG9zdXJlIENvbXBpbGVyIFwiYWR2YW5jZWRcIiBtb2RlLlxuICBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBfO1xuICAgIH1cbiAgICBleHBvcnRzLl8gPSBfO1xuICB9IGVsc2Uge1xuICAgIHJvb3QuXyA9IF87XG4gIH1cblxuICAvLyBDdXJyZW50IHZlcnNpb24uXG4gIF8uVkVSU0lPTiA9ICcxLjYuMCc7XG5cbiAgLy8gQ29sbGVjdGlvbiBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBUaGUgY29ybmVyc3RvbmUsIGFuIGBlYWNoYCBpbXBsZW1lbnRhdGlvbiwgYWthIGBmb3JFYWNoYC5cbiAgLy8gSGFuZGxlcyBvYmplY3RzIHdpdGggdGhlIGJ1aWx0LWluIGBmb3JFYWNoYCwgYXJyYXlzLCBhbmQgcmF3IG9iamVjdHMuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBmb3JFYWNoYCBpZiBhdmFpbGFibGUuXG4gIHZhciBlYWNoID0gXy5lYWNoID0gXy5mb3JFYWNoID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIG9iajtcbiAgICBpZiAobmF0aXZlRm9yRWFjaCAmJiBvYmouZm9yRWFjaCA9PT0gbmF0aXZlRm9yRWFjaCkge1xuICAgICAgb2JqLmZvckVhY2goaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgIH0gZWxzZSBpZiAob2JqLmxlbmd0aCA9PT0gK29iai5sZW5ndGgpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBvYmoubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqW2ldLCBpLCBvYmopID09PSBicmVha2VyKSByZXR1cm47XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoaXRlcmF0b3IuY2FsbChjb250ZXh0LCBvYmpba2V5c1tpXV0sIGtleXNbaV0sIG9iaikgPT09IGJyZWFrZXIpIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIHJlc3VsdHMgb2YgYXBwbHlpbmcgdGhlIGl0ZXJhdG9yIHRvIGVhY2ggZWxlbWVudC5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYG1hcGAgaWYgYXZhaWxhYmxlLlxuICBfLm1hcCA9IF8uY29sbGVjdCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHJlc3VsdHM7XG4gICAgaWYgKG5hdGl2ZU1hcCAmJiBvYmoubWFwID09PSBuYXRpdmVNYXApIHJldHVybiBvYmoubWFwKGl0ZXJhdG9yLCBjb250ZXh0KTtcbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICByZXN1bHRzLnB1c2goaXRlcmF0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICB2YXIgcmVkdWNlRXJyb3IgPSAnUmVkdWNlIG9mIGVtcHR5IGFycmF5IHdpdGggbm8gaW5pdGlhbCB2YWx1ZSc7XG5cbiAgLy8gKipSZWR1Y2UqKiBidWlsZHMgdXAgYSBzaW5nbGUgcmVzdWx0IGZyb20gYSBsaXN0IG9mIHZhbHVlcywgYWthIGBpbmplY3RgLFxuICAvLyBvciBgZm9sZGxgLiBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgcmVkdWNlYCBpZiBhdmFpbGFibGUuXG4gIF8ucmVkdWNlID0gXy5mb2xkbCA9IF8uaW5qZWN0ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgbWVtbywgY29udGV4dCkge1xuICAgIHZhciBpbml0aWFsID0gYXJndW1lbnRzLmxlbmd0aCA+IDI7XG4gICAgaWYgKG9iaiA9PSBudWxsKSBvYmogPSBbXTtcbiAgICBpZiAobmF0aXZlUmVkdWNlICYmIG9iai5yZWR1Y2UgPT09IG5hdGl2ZVJlZHVjZSkge1xuICAgICAgaWYgKGNvbnRleHQpIGl0ZXJhdG9yID0gXy5iaW5kKGl0ZXJhdG9yLCBjb250ZXh0KTtcbiAgICAgIHJldHVybiBpbml0aWFsID8gb2JqLnJlZHVjZShpdGVyYXRvciwgbWVtbykgOiBvYmoucmVkdWNlKGl0ZXJhdG9yKTtcbiAgICB9XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgaWYgKCFpbml0aWFsKSB7XG4gICAgICAgIG1lbW8gPSB2YWx1ZTtcbiAgICAgICAgaW5pdGlhbCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtZW1vID0gaXRlcmF0b3IuY2FsbChjb250ZXh0LCBtZW1vLCB2YWx1ZSwgaW5kZXgsIGxpc3QpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICghaW5pdGlhbCkgdGhyb3cgbmV3IFR5cGVFcnJvcihyZWR1Y2VFcnJvcik7XG4gICAgcmV0dXJuIG1lbW87XG4gIH07XG5cbiAgLy8gVGhlIHJpZ2h0LWFzc29jaWF0aXZlIHZlcnNpb24gb2YgcmVkdWNlLCBhbHNvIGtub3duIGFzIGBmb2xkcmAuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGByZWR1Y2VSaWdodGAgaWYgYXZhaWxhYmxlLlxuICBfLnJlZHVjZVJpZ2h0ID0gXy5mb2xkciA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIG1lbW8sIGNvbnRleHQpIHtcbiAgICB2YXIgaW5pdGlhbCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyO1xuICAgIGlmIChvYmogPT0gbnVsbCkgb2JqID0gW107XG4gICAgaWYgKG5hdGl2ZVJlZHVjZVJpZ2h0ICYmIG9iai5yZWR1Y2VSaWdodCA9PT0gbmF0aXZlUmVkdWNlUmlnaHQpIHtcbiAgICAgIGlmIChjb250ZXh0KSBpdGVyYXRvciA9IF8uYmluZChpdGVyYXRvciwgY29udGV4dCk7XG4gICAgICByZXR1cm4gaW5pdGlhbCA/IG9iai5yZWR1Y2VSaWdodChpdGVyYXRvciwgbWVtbykgOiBvYmoucmVkdWNlUmlnaHQoaXRlcmF0b3IpO1xuICAgIH1cbiAgICB2YXIgbGVuZ3RoID0gb2JqLmxlbmd0aDtcbiAgICBpZiAobGVuZ3RoICE9PSArbGVuZ3RoKSB7XG4gICAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopO1xuICAgICAgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgfVxuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGluZGV4ID0ga2V5cyA/IGtleXNbLS1sZW5ndGhdIDogLS1sZW5ndGg7XG4gICAgICBpZiAoIWluaXRpYWwpIHtcbiAgICAgICAgbWVtbyA9IG9ialtpbmRleF07XG4gICAgICAgIGluaXRpYWwgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbWVtbyA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgbWVtbywgb2JqW2luZGV4XSwgaW5kZXgsIGxpc3QpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICghaW5pdGlhbCkgdGhyb3cgbmV3IFR5cGVFcnJvcihyZWR1Y2VFcnJvcik7XG4gICAgcmV0dXJuIG1lbW87XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBmaXJzdCB2YWx1ZSB3aGljaCBwYXNzZXMgYSB0cnV0aCB0ZXN0LiBBbGlhc2VkIGFzIGBkZXRlY3RgLlxuICBfLmZpbmQgPSBfLmRldGVjdCA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdDtcbiAgICBhbnkob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmIChwcmVkaWNhdGUuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpKSB7XG4gICAgICAgIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFJldHVybiBhbGwgdGhlIGVsZW1lbnRzIHRoYXQgcGFzcyBhIHRydXRoIHRlc3QuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBmaWx0ZXJgIGlmIGF2YWlsYWJsZS5cbiAgLy8gQWxpYXNlZCBhcyBgc2VsZWN0YC5cbiAgXy5maWx0ZXIgPSBfLnNlbGVjdCA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiByZXN1bHRzO1xuICAgIGlmIChuYXRpdmVGaWx0ZXIgJiYgb2JqLmZpbHRlciA9PT0gbmF0aXZlRmlsdGVyKSByZXR1cm4gb2JqLmZpbHRlcihwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmIChwcmVkaWNhdGUuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpKSByZXN1bHRzLnB1c2godmFsdWUpO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIC8vIFJldHVybiBhbGwgdGhlIGVsZW1lbnRzIGZvciB3aGljaCBhIHRydXRoIHRlc3QgZmFpbHMuXG4gIF8ucmVqZWN0ID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gXy5maWx0ZXIob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIHJldHVybiAhcHJlZGljYXRlLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KTtcbiAgICB9LCBjb250ZXh0KTtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmUgd2hldGhlciBhbGwgb2YgdGhlIGVsZW1lbnRzIG1hdGNoIGEgdHJ1dGggdGVzdC5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYGV2ZXJ5YCBpZiBhdmFpbGFibGUuXG4gIC8vIEFsaWFzZWQgYXMgYGFsbGAuXG4gIF8uZXZlcnkgPSBfLmFsbCA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcHJlZGljYXRlIHx8IChwcmVkaWNhdGUgPSBfLmlkZW50aXR5KTtcbiAgICB2YXIgcmVzdWx0ID0gdHJ1ZTtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiByZXN1bHQ7XG4gICAgaWYgKG5hdGl2ZUV2ZXJ5ICYmIG9iai5ldmVyeSA9PT0gbmF0aXZlRXZlcnkpIHJldHVybiBvYmouZXZlcnkocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICBpZiAoIShyZXN1bHQgPSByZXN1bHQgJiYgcHJlZGljYXRlLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KSkpIHJldHVybiBicmVha2VyO1xuICAgIH0pO1xuICAgIHJldHVybiAhIXJlc3VsdDtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmUgaWYgYXQgbGVhc3Qgb25lIGVsZW1lbnQgaW4gdGhlIG9iamVjdCBtYXRjaGVzIGEgdHJ1dGggdGVzdC5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYHNvbWVgIGlmIGF2YWlsYWJsZS5cbiAgLy8gQWxpYXNlZCBhcyBgYW55YC5cbiAgdmFyIGFueSA9IF8uc29tZSA9IF8uYW55ID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICBwcmVkaWNhdGUgfHwgKHByZWRpY2F0ZSA9IF8uaWRlbnRpdHkpO1xuICAgIHZhciByZXN1bHQgPSBmYWxzZTtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiByZXN1bHQ7XG4gICAgaWYgKG5hdGl2ZVNvbWUgJiYgb2JqLnNvbWUgPT09IG5hdGl2ZVNvbWUpIHJldHVybiBvYmouc29tZShwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmIChyZXN1bHQgfHwgKHJlc3VsdCA9IHByZWRpY2F0ZS5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkpKSByZXR1cm4gYnJlYWtlcjtcbiAgICB9KTtcbiAgICByZXR1cm4gISFyZXN1bHQ7XG4gIH07XG5cbiAgLy8gRGV0ZXJtaW5lIGlmIHRoZSBhcnJheSBvciBvYmplY3QgY29udGFpbnMgYSBnaXZlbiB2YWx1ZSAodXNpbmcgYD09PWApLlxuICAvLyBBbGlhc2VkIGFzIGBpbmNsdWRlYC5cbiAgXy5jb250YWlucyA9IF8uaW5jbHVkZSA9IGZ1bmN0aW9uKG9iaiwgdGFyZ2V0KSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKG5hdGl2ZUluZGV4T2YgJiYgb2JqLmluZGV4T2YgPT09IG5hdGl2ZUluZGV4T2YpIHJldHVybiBvYmouaW5kZXhPZih0YXJnZXQpICE9IC0xO1xuICAgIHJldHVybiBhbnkob2JqLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHZhbHVlID09PSB0YXJnZXQ7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gSW52b2tlIGEgbWV0aG9kICh3aXRoIGFyZ3VtZW50cykgb24gZXZlcnkgaXRlbSBpbiBhIGNvbGxlY3Rpb24uXG4gIF8uaW52b2tlID0gZnVuY3Rpb24ob2JqLCBtZXRob2QpIHtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICB2YXIgaXNGdW5jID0gXy5pc0Z1bmN0aW9uKG1ldGhvZCk7XG4gICAgcmV0dXJuIF8ubWFwKG9iaiwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiAoaXNGdW5jID8gbWV0aG9kIDogdmFsdWVbbWV0aG9kXSkuYXBwbHkodmFsdWUsIGFyZ3MpO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIENvbnZlbmllbmNlIHZlcnNpb24gb2YgYSBjb21tb24gdXNlIGNhc2Ugb2YgYG1hcGA6IGZldGNoaW5nIGEgcHJvcGVydHkuXG4gIF8ucGx1Y2sgPSBmdW5jdGlvbihvYmosIGtleSkge1xuICAgIHJldHVybiBfLm1hcChvYmosIF8ucHJvcGVydHkoa2V5KSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgZmlsdGVyYDogc2VsZWN0aW5nIG9ubHkgb2JqZWN0c1xuICAvLyBjb250YWluaW5nIHNwZWNpZmljIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLndoZXJlID0gZnVuY3Rpb24ob2JqLCBhdHRycykge1xuICAgIHJldHVybiBfLmZpbHRlcihvYmosIF8ubWF0Y2hlcyhhdHRycykpO1xuICB9O1xuXG4gIC8vIENvbnZlbmllbmNlIHZlcnNpb24gb2YgYSBjb21tb24gdXNlIGNhc2Ugb2YgYGZpbmRgOiBnZXR0aW5nIHRoZSBmaXJzdCBvYmplY3RcbiAgLy8gY29udGFpbmluZyBzcGVjaWZpYyBga2V5OnZhbHVlYCBwYWlycy5cbiAgXy5maW5kV2hlcmUgPSBmdW5jdGlvbihvYmosIGF0dHJzKSB7XG4gICAgcmV0dXJuIF8uZmluZChvYmosIF8ubWF0Y2hlcyhhdHRycykpO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgbWF4aW11bSBlbGVtZW50IG9yIChlbGVtZW50LWJhc2VkIGNvbXB1dGF0aW9uKS5cbiAgLy8gQ2FuJ3Qgb3B0aW1pemUgYXJyYXlzIG9mIGludGVnZXJzIGxvbmdlciB0aGFuIDY1LDUzNSBlbGVtZW50cy5cbiAgLy8gU2VlIFtXZWJLaXQgQnVnIDgwNzk3XShodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9ODA3OTcpXG4gIF8ubWF4ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGlmICghaXRlcmF0b3IgJiYgXy5pc0FycmF5KG9iaikgJiYgb2JqWzBdID09PSArb2JqWzBdICYmIG9iai5sZW5ndGggPCA2NTUzNSkge1xuICAgICAgcmV0dXJuIE1hdGgubWF4LmFwcGx5KE1hdGgsIG9iaik7XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSAtSW5maW5pdHksIGxhc3RDb21wdXRlZCA9IC1JbmZpbml0eTtcbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICB2YXIgY29tcHV0ZWQgPSBpdGVyYXRvciA/IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KSA6IHZhbHVlO1xuICAgICAgaWYgKGNvbXB1dGVkID4gbGFzdENvbXB1dGVkKSB7XG4gICAgICAgIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICBsYXN0Q29tcHV0ZWQgPSBjb21wdXRlZDtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgbWluaW11bSBlbGVtZW50IChvciBlbGVtZW50LWJhc2VkIGNvbXB1dGF0aW9uKS5cbiAgXy5taW4gPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgaWYgKCFpdGVyYXRvciAmJiBfLmlzQXJyYXkob2JqKSAmJiBvYmpbMF0gPT09ICtvYmpbMF0gJiYgb2JqLmxlbmd0aCA8IDY1NTM1KSB7XG4gICAgICByZXR1cm4gTWF0aC5taW4uYXBwbHkoTWF0aCwgb2JqKTtcbiAgICB9XG4gICAgdmFyIHJlc3VsdCA9IEluZmluaXR5LCBsYXN0Q29tcHV0ZWQgPSBJbmZpbml0eTtcbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICB2YXIgY29tcHV0ZWQgPSBpdGVyYXRvciA/IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KSA6IHZhbHVlO1xuICAgICAgaWYgKGNvbXB1dGVkIDwgbGFzdENvbXB1dGVkKSB7XG4gICAgICAgIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICBsYXN0Q29tcHV0ZWQgPSBjb21wdXRlZDtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFNodWZmbGUgYW4gYXJyYXksIHVzaW5nIHRoZSBtb2Rlcm4gdmVyc2lvbiBvZiB0aGVcbiAgLy8gW0Zpc2hlci1ZYXRlcyBzaHVmZmxlXShodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0Zpc2hlcuKAk1lhdGVzX3NodWZmbGUpLlxuICBfLnNodWZmbGUgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgcmFuZDtcbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciBzaHVmZmxlZCA9IFtdO1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmFuZCA9IF8ucmFuZG9tKGluZGV4KyspO1xuICAgICAgc2h1ZmZsZWRbaW5kZXggLSAxXSA9IHNodWZmbGVkW3JhbmRdO1xuICAgICAgc2h1ZmZsZWRbcmFuZF0gPSB2YWx1ZTtcbiAgICB9KTtcbiAgICByZXR1cm4gc2h1ZmZsZWQ7XG4gIH07XG5cbiAgLy8gU2FtcGxlICoqbioqIHJhbmRvbSB2YWx1ZXMgZnJvbSBhIGNvbGxlY3Rpb24uXG4gIC8vIElmICoqbioqIGlzIG5vdCBzcGVjaWZpZWQsIHJldHVybnMgYSBzaW5nbGUgcmFuZG9tIGVsZW1lbnQuXG4gIC8vIFRoZSBpbnRlcm5hbCBgZ3VhcmRgIGFyZ3VtZW50IGFsbG93cyBpdCB0byB3b3JrIHdpdGggYG1hcGAuXG4gIF8uc2FtcGxlID0gZnVuY3Rpb24ob2JqLCBuLCBndWFyZCkge1xuICAgIGlmIChuID09IG51bGwgfHwgZ3VhcmQpIHtcbiAgICAgIGlmIChvYmoubGVuZ3RoICE9PSArb2JqLmxlbmd0aCkgb2JqID0gXy52YWx1ZXMob2JqKTtcbiAgICAgIHJldHVybiBvYmpbXy5yYW5kb20ob2JqLmxlbmd0aCAtIDEpXTtcbiAgICB9XG4gICAgcmV0dXJuIF8uc2h1ZmZsZShvYmopLnNsaWNlKDAsIE1hdGgubWF4KDAsIG4pKTtcbiAgfTtcblxuICAvLyBBbiBpbnRlcm5hbCBmdW5jdGlvbiB0byBnZW5lcmF0ZSBsb29rdXAgaXRlcmF0b3JzLlxuICB2YXIgbG9va3VwSXRlcmF0b3IgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKSByZXR1cm4gXy5pZGVudGl0eTtcbiAgICBpZiAoXy5pc0Z1bmN0aW9uKHZhbHVlKSkgcmV0dXJuIHZhbHVlO1xuICAgIHJldHVybiBfLnByb3BlcnR5KHZhbHVlKTtcbiAgfTtcblxuICAvLyBTb3J0IHRoZSBvYmplY3QncyB2YWx1ZXMgYnkgYSBjcml0ZXJpb24gcHJvZHVjZWQgYnkgYW4gaXRlcmF0b3IuXG4gIF8uc29ydEJ5ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGl0ZXJhdG9yID0gbG9va3VwSXRlcmF0b3IoaXRlcmF0b3IpO1xuICAgIHJldHVybiBfLnBsdWNrKF8ubWFwKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIGluZGV4OiBpbmRleCxcbiAgICAgICAgY3JpdGVyaWE6IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KVxuICAgICAgfTtcbiAgICB9KS5zb3J0KGZ1bmN0aW9uKGxlZnQsIHJpZ2h0KSB7XG4gICAgICB2YXIgYSA9IGxlZnQuY3JpdGVyaWE7XG4gICAgICB2YXIgYiA9IHJpZ2h0LmNyaXRlcmlhO1xuICAgICAgaWYgKGEgIT09IGIpIHtcbiAgICAgICAgaWYgKGEgPiBiIHx8IGEgPT09IHZvaWQgMCkgcmV0dXJuIDE7XG4gICAgICAgIGlmIChhIDwgYiB8fCBiID09PSB2b2lkIDApIHJldHVybiAtMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBsZWZ0LmluZGV4IC0gcmlnaHQuaW5kZXg7XG4gICAgfSksICd2YWx1ZScpO1xuICB9O1xuXG4gIC8vIEFuIGludGVybmFsIGZ1bmN0aW9uIHVzZWQgZm9yIGFnZ3JlZ2F0ZSBcImdyb3VwIGJ5XCIgb3BlcmF0aW9ucy5cbiAgdmFyIGdyb3VwID0gZnVuY3Rpb24oYmVoYXZpb3IpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgICAgaXRlcmF0b3IgPSBsb29rdXBJdGVyYXRvcihpdGVyYXRvcik7XG4gICAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XG4gICAgICAgIHZhciBrZXkgPSBpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgb2JqKTtcbiAgICAgICAgYmVoYXZpb3IocmVzdWx0LCBrZXksIHZhbHVlKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9O1xuXG4gIC8vIEdyb3VwcyB0aGUgb2JqZWN0J3MgdmFsdWVzIGJ5IGEgY3JpdGVyaW9uLiBQYXNzIGVpdGhlciBhIHN0cmluZyBhdHRyaWJ1dGVcbiAgLy8gdG8gZ3JvdXAgYnksIG9yIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBjcml0ZXJpb24uXG4gIF8uZ3JvdXBCeSA9IGdyb3VwKGZ1bmN0aW9uKHJlc3VsdCwga2V5LCB2YWx1ZSkge1xuICAgIF8uaGFzKHJlc3VsdCwga2V5KSA/IHJlc3VsdFtrZXldLnB1c2godmFsdWUpIDogcmVzdWx0W2tleV0gPSBbdmFsdWVdO1xuICB9KTtcblxuICAvLyBJbmRleGVzIHRoZSBvYmplY3QncyB2YWx1ZXMgYnkgYSBjcml0ZXJpb24sIHNpbWlsYXIgdG8gYGdyb3VwQnlgLCBidXQgZm9yXG4gIC8vIHdoZW4geW91IGtub3cgdGhhdCB5b3VyIGluZGV4IHZhbHVlcyB3aWxsIGJlIHVuaXF1ZS5cbiAgXy5pbmRleEJ5ID0gZ3JvdXAoZnVuY3Rpb24ocmVzdWx0LCBrZXksIHZhbHVlKSB7XG4gICAgcmVzdWx0W2tleV0gPSB2YWx1ZTtcbiAgfSk7XG5cbiAgLy8gQ291bnRzIGluc3RhbmNlcyBvZiBhbiBvYmplY3QgdGhhdCBncm91cCBieSBhIGNlcnRhaW4gY3JpdGVyaW9uLiBQYXNzXG4gIC8vIGVpdGhlciBhIHN0cmluZyBhdHRyaWJ1dGUgdG8gY291bnQgYnksIG9yIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZVxuICAvLyBjcml0ZXJpb24uXG4gIF8uY291bnRCeSA9IGdyb3VwKGZ1bmN0aW9uKHJlc3VsdCwga2V5KSB7XG4gICAgXy5oYXMocmVzdWx0LCBrZXkpID8gcmVzdWx0W2tleV0rKyA6IHJlc3VsdFtrZXldID0gMTtcbiAgfSk7XG5cbiAgLy8gVXNlIGEgY29tcGFyYXRvciBmdW5jdGlvbiB0byBmaWd1cmUgb3V0IHRoZSBzbWFsbGVzdCBpbmRleCBhdCB3aGljaFxuICAvLyBhbiBvYmplY3Qgc2hvdWxkIGJlIGluc2VydGVkIHNvIGFzIHRvIG1haW50YWluIG9yZGVyLiBVc2VzIGJpbmFyeSBzZWFyY2guXG4gIF8uc29ydGVkSW5kZXggPSBmdW5jdGlvbihhcnJheSwgb2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGl0ZXJhdG9yID0gbG9va3VwSXRlcmF0b3IoaXRlcmF0b3IpO1xuICAgIHZhciB2YWx1ZSA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqKTtcbiAgICB2YXIgbG93ID0gMCwgaGlnaCA9IGFycmF5Lmxlbmd0aDtcbiAgICB3aGlsZSAobG93IDwgaGlnaCkge1xuICAgICAgdmFyIG1pZCA9IChsb3cgKyBoaWdoKSA+Pj4gMTtcbiAgICAgIGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgYXJyYXlbbWlkXSkgPCB2YWx1ZSA/IGxvdyA9IG1pZCArIDEgOiBoaWdoID0gbWlkO1xuICAgIH1cbiAgICByZXR1cm4gbG93O1xuICB9O1xuXG4gIC8vIFNhZmVseSBjcmVhdGUgYSByZWFsLCBsaXZlIGFycmF5IGZyb20gYW55dGhpbmcgaXRlcmFibGUuXG4gIF8udG9BcnJheSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICghb2JqKSByZXR1cm4gW107XG4gICAgaWYgKF8uaXNBcnJheShvYmopKSByZXR1cm4gc2xpY2UuY2FsbChvYmopO1xuICAgIGlmIChvYmoubGVuZ3RoID09PSArb2JqLmxlbmd0aCkgcmV0dXJuIF8ubWFwKG9iaiwgXy5pZGVudGl0eSk7XG4gICAgcmV0dXJuIF8udmFsdWVzKG9iaik7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gYW4gb2JqZWN0LlxuICBfLnNpemUgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiAwO1xuICAgIHJldHVybiAob2JqLmxlbmd0aCA9PT0gK29iai5sZW5ndGgpID8gb2JqLmxlbmd0aCA6IF8ua2V5cyhvYmopLmxlbmd0aDtcbiAgfTtcblxuICAvLyBBcnJheSBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gR2V0IHRoZSBmaXJzdCBlbGVtZW50IG9mIGFuIGFycmF5LiBQYXNzaW5nICoqbioqIHdpbGwgcmV0dXJuIHRoZSBmaXJzdCBOXG4gIC8vIHZhbHVlcyBpbiB0aGUgYXJyYXkuIEFsaWFzZWQgYXMgYGhlYWRgIGFuZCBgdGFrZWAuIFRoZSAqKmd1YXJkKiogY2hlY2tcbiAgLy8gYWxsb3dzIGl0IHRvIHdvcmsgd2l0aCBgXy5tYXBgLlxuICBfLmZpcnN0ID0gXy5oZWFkID0gXy50YWtlID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgaWYgKGFycmF5ID09IG51bGwpIHJldHVybiB2b2lkIDA7XG4gICAgaWYgKChuID09IG51bGwpIHx8IGd1YXJkKSByZXR1cm4gYXJyYXlbMF07XG4gICAgaWYgKG4gPCAwKSByZXR1cm4gW107XG4gICAgcmV0dXJuIHNsaWNlLmNhbGwoYXJyYXksIDAsIG4pO1xuICB9O1xuXG4gIC8vIFJldHVybnMgZXZlcnl0aGluZyBidXQgdGhlIGxhc3QgZW50cnkgb2YgdGhlIGFycmF5LiBFc3BlY2lhbGx5IHVzZWZ1bCBvblxuICAvLyB0aGUgYXJndW1lbnRzIG9iamVjdC4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiBhbGwgdGhlIHZhbHVlcyBpblxuICAvLyB0aGUgYXJyYXksIGV4Y2x1ZGluZyB0aGUgbGFzdCBOLiBUaGUgKipndWFyZCoqIGNoZWNrIGFsbG93cyBpdCB0byB3b3JrIHdpdGhcbiAgLy8gYF8ubWFwYC5cbiAgXy5pbml0aWFsID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgcmV0dXJuIHNsaWNlLmNhbGwoYXJyYXksIDAsIGFycmF5Lmxlbmd0aCAtICgobiA9PSBudWxsKSB8fCBndWFyZCA/IDEgOiBuKSk7XG4gIH07XG5cbiAgLy8gR2V0IHRoZSBsYXN0IGVsZW1lbnQgb2YgYW4gYXJyYXkuIFBhc3NpbmcgKipuKiogd2lsbCByZXR1cm4gdGhlIGxhc3QgTlxuICAvLyB2YWx1ZXMgaW4gdGhlIGFycmF5LiBUaGUgKipndWFyZCoqIGNoZWNrIGFsbG93cyBpdCB0byB3b3JrIHdpdGggYF8ubWFwYC5cbiAgXy5sYXN0ID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgaWYgKGFycmF5ID09IG51bGwpIHJldHVybiB2b2lkIDA7XG4gICAgaWYgKChuID09IG51bGwpIHx8IGd1YXJkKSByZXR1cm4gYXJyYXlbYXJyYXkubGVuZ3RoIC0gMV07XG4gICAgcmV0dXJuIHNsaWNlLmNhbGwoYXJyYXksIE1hdGgubWF4KGFycmF5Lmxlbmd0aCAtIG4sIDApKTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGV2ZXJ5dGhpbmcgYnV0IHRoZSBmaXJzdCBlbnRyeSBvZiB0aGUgYXJyYXkuIEFsaWFzZWQgYXMgYHRhaWxgIGFuZCBgZHJvcGAuXG4gIC8vIEVzcGVjaWFsbHkgdXNlZnVsIG9uIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBQYXNzaW5nIGFuICoqbioqIHdpbGwgcmV0dXJuXG4gIC8vIHRoZSByZXN0IE4gdmFsdWVzIGluIHRoZSBhcnJheS4gVGhlICoqZ3VhcmQqKlxuICAvLyBjaGVjayBhbGxvd3MgaXQgdG8gd29yayB3aXRoIGBfLm1hcGAuXG4gIF8ucmVzdCA9IF8udGFpbCA9IF8uZHJvcCA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIHJldHVybiBzbGljZS5jYWxsKGFycmF5LCAobiA9PSBudWxsKSB8fCBndWFyZCA/IDEgOiBuKTtcbiAgfTtcblxuICAvLyBUcmltIG91dCBhbGwgZmFsc3kgdmFsdWVzIGZyb20gYW4gYXJyYXkuXG4gIF8uY29tcGFjdCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgcmV0dXJuIF8uZmlsdGVyKGFycmF5LCBfLmlkZW50aXR5KTtcbiAgfTtcblxuICAvLyBJbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBvZiBhIHJlY3Vyc2l2ZSBgZmxhdHRlbmAgZnVuY3Rpb24uXG4gIHZhciBmbGF0dGVuID0gZnVuY3Rpb24oaW5wdXQsIHNoYWxsb3csIG91dHB1dCkge1xuICAgIGlmIChzaGFsbG93ICYmIF8uZXZlcnkoaW5wdXQsIF8uaXNBcnJheSkpIHtcbiAgICAgIHJldHVybiBjb25jYXQuYXBwbHkob3V0cHV0LCBpbnB1dCk7XG4gICAgfVxuICAgIGVhY2goaW5wdXQsIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBpZiAoXy5pc0FycmF5KHZhbHVlKSB8fCBfLmlzQXJndW1lbnRzKHZhbHVlKSkge1xuICAgICAgICBzaGFsbG93ID8gcHVzaC5hcHBseShvdXRwdXQsIHZhbHVlKSA6IGZsYXR0ZW4odmFsdWUsIHNoYWxsb3csIG91dHB1dCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXRwdXQucHVzaCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfTtcblxuICAvLyBGbGF0dGVuIG91dCBhbiBhcnJheSwgZWl0aGVyIHJlY3Vyc2l2ZWx5IChieSBkZWZhdWx0KSwgb3IganVzdCBvbmUgbGV2ZWwuXG4gIF8uZmxhdHRlbiA9IGZ1bmN0aW9uKGFycmF5LCBzaGFsbG93KSB7XG4gICAgcmV0dXJuIGZsYXR0ZW4oYXJyYXksIHNoYWxsb3csIFtdKTtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSB2ZXJzaW9uIG9mIHRoZSBhcnJheSB0aGF0IGRvZXMgbm90IGNvbnRhaW4gdGhlIHNwZWNpZmllZCB2YWx1ZShzKS5cbiAgXy53aXRob3V0ID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICByZXR1cm4gXy5kaWZmZXJlbmNlKGFycmF5LCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICB9O1xuXG4gIC8vIFNwbGl0IGFuIGFycmF5IGludG8gdHdvIGFycmF5czogb25lIHdob3NlIGVsZW1lbnRzIGFsbCBzYXRpc2Z5IHRoZSBnaXZlblxuICAvLyBwcmVkaWNhdGUsIGFuZCBvbmUgd2hvc2UgZWxlbWVudHMgYWxsIGRvIG5vdCBzYXRpc2Z5IHRoZSBwcmVkaWNhdGUuXG4gIF8ucGFydGl0aW9uID0gZnVuY3Rpb24oYXJyYXksIHByZWRpY2F0ZSkge1xuICAgIHZhciBwYXNzID0gW10sIGZhaWwgPSBbXTtcbiAgICBlYWNoKGFycmF5LCBmdW5jdGlvbihlbGVtKSB7XG4gICAgICAocHJlZGljYXRlKGVsZW0pID8gcGFzcyA6IGZhaWwpLnB1c2goZWxlbSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIFtwYXNzLCBmYWlsXTtcbiAgfTtcblxuICAvLyBQcm9kdWNlIGEgZHVwbGljYXRlLWZyZWUgdmVyc2lvbiBvZiB0aGUgYXJyYXkuIElmIHRoZSBhcnJheSBoYXMgYWxyZWFkeVxuICAvLyBiZWVuIHNvcnRlZCwgeW91IGhhdmUgdGhlIG9wdGlvbiBvZiB1c2luZyBhIGZhc3RlciBhbGdvcml0aG0uXG4gIC8vIEFsaWFzZWQgYXMgYHVuaXF1ZWAuXG4gIF8udW5pcSA9IF8udW5pcXVlID0gZnVuY3Rpb24oYXJyYXksIGlzU29ydGVkLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIGlmIChfLmlzRnVuY3Rpb24oaXNTb3J0ZWQpKSB7XG4gICAgICBjb250ZXh0ID0gaXRlcmF0b3I7XG4gICAgICBpdGVyYXRvciA9IGlzU29ydGVkO1xuICAgICAgaXNTb3J0ZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgdmFyIGluaXRpYWwgPSBpdGVyYXRvciA/IF8ubWFwKGFycmF5LCBpdGVyYXRvciwgY29udGV4dCkgOiBhcnJheTtcbiAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgIHZhciBzZWVuID0gW107XG4gICAgZWFjaChpbml0aWFsLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcbiAgICAgIGlmIChpc1NvcnRlZCA/ICghaW5kZXggfHwgc2VlbltzZWVuLmxlbmd0aCAtIDFdICE9PSB2YWx1ZSkgOiAhXy5jb250YWlucyhzZWVuLCB2YWx1ZSkpIHtcbiAgICAgICAgc2Vlbi5wdXNoKHZhbHVlKTtcbiAgICAgICAgcmVzdWx0cy5wdXNoKGFycmF5W2luZGV4XSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gUHJvZHVjZSBhbiBhcnJheSB0aGF0IGNvbnRhaW5zIHRoZSB1bmlvbjogZWFjaCBkaXN0aW5jdCBlbGVtZW50IGZyb20gYWxsIG9mXG4gIC8vIHRoZSBwYXNzZWQtaW4gYXJyYXlzLlxuICBfLnVuaW9uID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIF8udW5pcShfLmZsYXR0ZW4oYXJndW1lbnRzLCB0cnVlKSk7XG4gIH07XG5cbiAgLy8gUHJvZHVjZSBhbiBhcnJheSB0aGF0IGNvbnRhaW5zIGV2ZXJ5IGl0ZW0gc2hhcmVkIGJldHdlZW4gYWxsIHRoZVxuICAvLyBwYXNzZWQtaW4gYXJyYXlzLlxuICBfLmludGVyc2VjdGlvbiA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgdmFyIHJlc3QgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgcmV0dXJuIF8uZmlsdGVyKF8udW5pcShhcnJheSksIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgIHJldHVybiBfLmV2ZXJ5KHJlc3QsIGZ1bmN0aW9uKG90aGVyKSB7XG4gICAgICAgIHJldHVybiBfLmNvbnRhaW5zKG90aGVyLCBpdGVtKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIFRha2UgdGhlIGRpZmZlcmVuY2UgYmV0d2VlbiBvbmUgYXJyYXkgYW5kIGEgbnVtYmVyIG9mIG90aGVyIGFycmF5cy5cbiAgLy8gT25seSB0aGUgZWxlbWVudHMgcHJlc2VudCBpbiBqdXN0IHRoZSBmaXJzdCBhcnJheSB3aWxsIHJlbWFpbi5cbiAgXy5kaWZmZXJlbmNlID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICB2YXIgcmVzdCA9IGNvbmNhdC5hcHBseShBcnJheVByb3RvLCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgIHJldHVybiBfLmZpbHRlcihhcnJheSwgZnVuY3Rpb24odmFsdWUpeyByZXR1cm4gIV8uY29udGFpbnMocmVzdCwgdmFsdWUpOyB9KTtcbiAgfTtcblxuICAvLyBaaXAgdG9nZXRoZXIgbXVsdGlwbGUgbGlzdHMgaW50byBhIHNpbmdsZSBhcnJheSAtLSBlbGVtZW50cyB0aGF0IHNoYXJlXG4gIC8vIGFuIGluZGV4IGdvIHRvZ2V0aGVyLlxuICBfLnppcCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBsZW5ndGggPSBfLm1heChfLnBsdWNrKGFyZ3VtZW50cywgJ2xlbmd0aCcpLmNvbmNhdCgwKSk7XG4gICAgdmFyIHJlc3VsdHMgPSBuZXcgQXJyYXkobGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICByZXN1bHRzW2ldID0gXy5wbHVjayhhcmd1bWVudHMsICcnICsgaSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIC8vIENvbnZlcnRzIGxpc3RzIGludG8gb2JqZWN0cy4gUGFzcyBlaXRoZXIgYSBzaW5nbGUgYXJyYXkgb2YgYFtrZXksIHZhbHVlXWBcbiAgLy8gcGFpcnMsIG9yIHR3byBwYXJhbGxlbCBhcnJheXMgb2YgdGhlIHNhbWUgbGVuZ3RoIC0tIG9uZSBvZiBrZXlzLCBhbmQgb25lIG9mXG4gIC8vIHRoZSBjb3JyZXNwb25kaW5nIHZhbHVlcy5cbiAgXy5vYmplY3QgPSBmdW5jdGlvbihsaXN0LCB2YWx1ZXMpIHtcbiAgICBpZiAobGlzdCA9PSBudWxsKSByZXR1cm4ge307XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBsaXN0Lmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodmFsdWVzKSB7XG4gICAgICAgIHJlc3VsdFtsaXN0W2ldXSA9IHZhbHVlc1tpXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdFtsaXN0W2ldWzBdXSA9IGxpc3RbaV1bMV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gSWYgdGhlIGJyb3dzZXIgZG9lc24ndCBzdXBwbHkgdXMgd2l0aCBpbmRleE9mIChJJ20gbG9va2luZyBhdCB5b3UsICoqTVNJRSoqKSxcbiAgLy8gd2UgbmVlZCB0aGlzIGZ1bmN0aW9uLiBSZXR1cm4gdGhlIHBvc2l0aW9uIG9mIHRoZSBmaXJzdCBvY2N1cnJlbmNlIG9mIGFuXG4gIC8vIGl0ZW0gaW4gYW4gYXJyYXksIG9yIC0xIGlmIHRoZSBpdGVtIGlzIG5vdCBpbmNsdWRlZCBpbiB0aGUgYXJyYXkuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBpbmRleE9mYCBpZiBhdmFpbGFibGUuXG4gIC8vIElmIHRoZSBhcnJheSBpcyBsYXJnZSBhbmQgYWxyZWFkeSBpbiBzb3J0IG9yZGVyLCBwYXNzIGB0cnVlYFxuICAvLyBmb3IgKippc1NvcnRlZCoqIHRvIHVzZSBiaW5hcnkgc2VhcmNoLlxuICBfLmluZGV4T2YgPSBmdW5jdGlvbihhcnJheSwgaXRlbSwgaXNTb3J0ZWQpIHtcbiAgICBpZiAoYXJyYXkgPT0gbnVsbCkgcmV0dXJuIC0xO1xuICAgIHZhciBpID0gMCwgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuICAgIGlmIChpc1NvcnRlZCkge1xuICAgICAgaWYgKHR5cGVvZiBpc1NvcnRlZCA9PSAnbnVtYmVyJykge1xuICAgICAgICBpID0gKGlzU29ydGVkIDwgMCA/IE1hdGgubWF4KDAsIGxlbmd0aCArIGlzU29ydGVkKSA6IGlzU29ydGVkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGkgPSBfLnNvcnRlZEluZGV4KGFycmF5LCBpdGVtKTtcbiAgICAgICAgcmV0dXJuIGFycmF5W2ldID09PSBpdGVtID8gaSA6IC0xO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAobmF0aXZlSW5kZXhPZiAmJiBhcnJheS5pbmRleE9mID09PSBuYXRpdmVJbmRleE9mKSByZXR1cm4gYXJyYXkuaW5kZXhPZihpdGVtLCBpc1NvcnRlZCk7XG4gICAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykgaWYgKGFycmF5W2ldID09PSBpdGVtKSByZXR1cm4gaTtcbiAgICByZXR1cm4gLTE7XG4gIH07XG5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYGxhc3RJbmRleE9mYCBpZiBhdmFpbGFibGUuXG4gIF8ubGFzdEluZGV4T2YgPSBmdW5jdGlvbihhcnJheSwgaXRlbSwgZnJvbSkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gLTE7XG4gICAgdmFyIGhhc0luZGV4ID0gZnJvbSAhPSBudWxsO1xuICAgIGlmIChuYXRpdmVMYXN0SW5kZXhPZiAmJiBhcnJheS5sYXN0SW5kZXhPZiA9PT0gbmF0aXZlTGFzdEluZGV4T2YpIHtcbiAgICAgIHJldHVybiBoYXNJbmRleCA/IGFycmF5Lmxhc3RJbmRleE9mKGl0ZW0sIGZyb20pIDogYXJyYXkubGFzdEluZGV4T2YoaXRlbSk7XG4gICAgfVxuICAgIHZhciBpID0gKGhhc0luZGV4ID8gZnJvbSA6IGFycmF5Lmxlbmd0aCk7XG4gICAgd2hpbGUgKGktLSkgaWYgKGFycmF5W2ldID09PSBpdGVtKSByZXR1cm4gaTtcbiAgICByZXR1cm4gLTE7XG4gIH07XG5cbiAgLy8gR2VuZXJhdGUgYW4gaW50ZWdlciBBcnJheSBjb250YWluaW5nIGFuIGFyaXRobWV0aWMgcHJvZ3Jlc3Npb24uIEEgcG9ydCBvZlxuICAvLyB0aGUgbmF0aXZlIFB5dGhvbiBgcmFuZ2UoKWAgZnVuY3Rpb24uIFNlZVxuICAvLyBbdGhlIFB5dGhvbiBkb2N1bWVudGF0aW9uXShodHRwOi8vZG9jcy5weXRob24ub3JnL2xpYnJhcnkvZnVuY3Rpb25zLmh0bWwjcmFuZ2UpLlxuICBfLnJhbmdlID0gZnVuY3Rpb24oc3RhcnQsIHN0b3AsIHN0ZXApIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8PSAxKSB7XG4gICAgICBzdG9wID0gc3RhcnQgfHwgMDtcbiAgICAgIHN0YXJ0ID0gMDtcbiAgICB9XG4gICAgc3RlcCA9IGFyZ3VtZW50c1syXSB8fCAxO1xuXG4gICAgdmFyIGxlbmd0aCA9IE1hdGgubWF4KE1hdGguY2VpbCgoc3RvcCAtIHN0YXJ0KSAvIHN0ZXApLCAwKTtcbiAgICB2YXIgaWR4ID0gMDtcbiAgICB2YXIgcmFuZ2UgPSBuZXcgQXJyYXkobGVuZ3RoKTtcblxuICAgIHdoaWxlKGlkeCA8IGxlbmd0aCkge1xuICAgICAgcmFuZ2VbaWR4KytdID0gc3RhcnQ7XG4gICAgICBzdGFydCArPSBzdGVwO1xuICAgIH1cblxuICAgIHJldHVybiByYW5nZTtcbiAgfTtcblxuICAvLyBGdW5jdGlvbiAoYWhlbSkgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIFJldXNhYmxlIGNvbnN0cnVjdG9yIGZ1bmN0aW9uIGZvciBwcm90b3R5cGUgc2V0dGluZy5cbiAgdmFyIGN0b3IgPSBmdW5jdGlvbigpe307XG5cbiAgLy8gQ3JlYXRlIGEgZnVuY3Rpb24gYm91bmQgdG8gYSBnaXZlbiBvYmplY3QgKGFzc2lnbmluZyBgdGhpc2AsIGFuZCBhcmd1bWVudHMsXG4gIC8vIG9wdGlvbmFsbHkpLiBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgRnVuY3Rpb24uYmluZGAgaWZcbiAgLy8gYXZhaWxhYmxlLlxuICBfLmJpbmQgPSBmdW5jdGlvbihmdW5jLCBjb250ZXh0KSB7XG4gICAgdmFyIGFyZ3MsIGJvdW5kO1xuICAgIGlmIChuYXRpdmVCaW5kICYmIGZ1bmMuYmluZCA9PT0gbmF0aXZlQmluZCkgcmV0dXJuIG5hdGl2ZUJpbmQuYXBwbHkoZnVuYywgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICBpZiAoIV8uaXNGdW5jdGlvbihmdW5jKSkgdGhyb3cgbmV3IFR5cGVFcnJvcjtcbiAgICBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIHJldHVybiBib3VuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIGJvdW5kKSkgcmV0dXJuIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncy5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG4gICAgICBjdG9yLnByb3RvdHlwZSA9IGZ1bmMucHJvdG90eXBlO1xuICAgICAgdmFyIHNlbGYgPSBuZXcgY3RvcjtcbiAgICAgIGN0b3IucHJvdG90eXBlID0gbnVsbDtcbiAgICAgIHZhciByZXN1bHQgPSBmdW5jLmFwcGx5KHNlbGYsIGFyZ3MuY29uY2F0KHNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO1xuICAgICAgaWYgKE9iamVjdChyZXN1bHQpID09PSByZXN1bHQpIHJldHVybiByZXN1bHQ7XG4gICAgICByZXR1cm4gc2VsZjtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFBhcnRpYWxseSBhcHBseSBhIGZ1bmN0aW9uIGJ5IGNyZWF0aW5nIGEgdmVyc2lvbiB0aGF0IGhhcyBoYWQgc29tZSBvZiBpdHNcbiAgLy8gYXJndW1lbnRzIHByZS1maWxsZWQsIHdpdGhvdXQgY2hhbmdpbmcgaXRzIGR5bmFtaWMgYHRoaXNgIGNvbnRleHQuIF8gYWN0c1xuICAvLyBhcyBhIHBsYWNlaG9sZGVyLCBhbGxvd2luZyBhbnkgY29tYmluYXRpb24gb2YgYXJndW1lbnRzIHRvIGJlIHByZS1maWxsZWQuXG4gIF8ucGFydGlhbCA9IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICB2YXIgYm91bmRBcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBwb3NpdGlvbiA9IDA7XG4gICAgICB2YXIgYXJncyA9IGJvdW5kQXJncy5zbGljZSgpO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGFyZ3MubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGFyZ3NbaV0gPT09IF8pIGFyZ3NbaV0gPSBhcmd1bWVudHNbcG9zaXRpb24rK107XG4gICAgICB9XG4gICAgICB3aGlsZSAocG9zaXRpb24gPCBhcmd1bWVudHMubGVuZ3RoKSBhcmdzLnB1c2goYXJndW1lbnRzW3Bvc2l0aW9uKytdKTtcbiAgICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH07XG4gIH07XG5cbiAgLy8gQmluZCBhIG51bWJlciBvZiBhbiBvYmplY3QncyBtZXRob2RzIHRvIHRoYXQgb2JqZWN0LiBSZW1haW5pbmcgYXJndW1lbnRzXG4gIC8vIGFyZSB0aGUgbWV0aG9kIG5hbWVzIHRvIGJlIGJvdW5kLiBVc2VmdWwgZm9yIGVuc3VyaW5nIHRoYXQgYWxsIGNhbGxiYWNrc1xuICAvLyBkZWZpbmVkIG9uIGFuIG9iamVjdCBiZWxvbmcgdG8gaXQuXG4gIF8uYmluZEFsbCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBmdW5jcyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICBpZiAoZnVuY3MubGVuZ3RoID09PSAwKSB0aHJvdyBuZXcgRXJyb3IoJ2JpbmRBbGwgbXVzdCBiZSBwYXNzZWQgZnVuY3Rpb24gbmFtZXMnKTtcbiAgICBlYWNoKGZ1bmNzLCBmdW5jdGlvbihmKSB7IG9ialtmXSA9IF8uYmluZChvYmpbZl0sIG9iaik7IH0pO1xuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gTWVtb2l6ZSBhbiBleHBlbnNpdmUgZnVuY3Rpb24gYnkgc3RvcmluZyBpdHMgcmVzdWx0cy5cbiAgXy5tZW1vaXplID0gZnVuY3Rpb24oZnVuYywgaGFzaGVyKSB7XG4gICAgdmFyIG1lbW8gPSB7fTtcbiAgICBoYXNoZXIgfHwgKGhhc2hlciA9IF8uaWRlbnRpdHkpO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBrZXkgPSBoYXNoZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIHJldHVybiBfLmhhcyhtZW1vLCBrZXkpID8gbWVtb1trZXldIDogKG1lbW9ba2V5XSA9IGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gICAgfTtcbiAgfTtcblxuICAvLyBEZWxheXMgYSBmdW5jdGlvbiBmb3IgdGhlIGdpdmVuIG51bWJlciBvZiBtaWxsaXNlY29uZHMsIGFuZCB0aGVuIGNhbGxzXG4gIC8vIGl0IHdpdGggdGhlIGFyZ3VtZW50cyBzdXBwbGllZC5cbiAgXy5kZWxheSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQpIHtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpeyByZXR1cm4gZnVuYy5hcHBseShudWxsLCBhcmdzKTsgfSwgd2FpdCk7XG4gIH07XG5cbiAgLy8gRGVmZXJzIGEgZnVuY3Rpb24sIHNjaGVkdWxpbmcgaXQgdG8gcnVuIGFmdGVyIHRoZSBjdXJyZW50IGNhbGwgc3RhY2sgaGFzXG4gIC8vIGNsZWFyZWQuXG4gIF8uZGVmZXIgPSBmdW5jdGlvbihmdW5jKSB7XG4gICAgcmV0dXJuIF8uZGVsYXkuYXBwbHkoXywgW2Z1bmMsIDFdLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpKTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIHdoZW4gaW52b2tlZCwgd2lsbCBvbmx5IGJlIHRyaWdnZXJlZCBhdCBtb3N0IG9uY2VcbiAgLy8gZHVyaW5nIGEgZ2l2ZW4gd2luZG93IG9mIHRpbWUuIE5vcm1hbGx5LCB0aGUgdGhyb3R0bGVkIGZ1bmN0aW9uIHdpbGwgcnVuXG4gIC8vIGFzIG11Y2ggYXMgaXQgY2FuLCB3aXRob3V0IGV2ZXIgZ29pbmcgbW9yZSB0aGFuIG9uY2UgcGVyIGB3YWl0YCBkdXJhdGlvbjtcbiAgLy8gYnV0IGlmIHlvdSdkIGxpa2UgdG8gZGlzYWJsZSB0aGUgZXhlY3V0aW9uIG9uIHRoZSBsZWFkaW5nIGVkZ2UsIHBhc3NcbiAgLy8gYHtsZWFkaW5nOiBmYWxzZX1gLiBUbyBkaXNhYmxlIGV4ZWN1dGlvbiBvbiB0aGUgdHJhaWxpbmcgZWRnZSwgZGl0dG8uXG4gIF8udGhyb3R0bGUgPSBmdW5jdGlvbihmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gICAgdmFyIGNvbnRleHQsIGFyZ3MsIHJlc3VsdDtcbiAgICB2YXIgdGltZW91dCA9IG51bGw7XG4gICAgdmFyIHByZXZpb3VzID0gMDtcbiAgICBvcHRpb25zIHx8IChvcHRpb25zID0ge30pO1xuICAgIHZhciBsYXRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcHJldmlvdXMgPSBvcHRpb25zLmxlYWRpbmcgPT09IGZhbHNlID8gMCA6IF8ubm93KCk7XG4gICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgbm93ID0gXy5ub3coKTtcbiAgICAgIGlmICghcHJldmlvdXMgJiYgb3B0aW9ucy5sZWFkaW5nID09PSBmYWxzZSkgcHJldmlvdXMgPSBub3c7XG4gICAgICB2YXIgcmVtYWluaW5nID0gd2FpdCAtIChub3cgLSBwcmV2aW91cyk7XG4gICAgICBjb250ZXh0ID0gdGhpcztcbiAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICBpZiAocmVtYWluaW5nIDw9IDApIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgcHJldmlvdXMgPSBub3c7XG4gICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgIH0gZWxzZSBpZiAoIXRpbWVvdXQgJiYgb3B0aW9ucy50cmFpbGluZyAhPT0gZmFsc2UpIHtcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHJlbWFpbmluZyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0LCBhcyBsb25nIGFzIGl0IGNvbnRpbnVlcyB0byBiZSBpbnZva2VkLCB3aWxsIG5vdFxuICAvLyBiZSB0cmlnZ2VyZWQuIFRoZSBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCBhZnRlciBpdCBzdG9wcyBiZWluZyBjYWxsZWQgZm9yXG4gIC8vIE4gbWlsbGlzZWNvbmRzLiBJZiBgaW1tZWRpYXRlYCBpcyBwYXNzZWQsIHRyaWdnZXIgdGhlIGZ1bmN0aW9uIG9uIHRoZVxuICAvLyBsZWFkaW5nIGVkZ2UsIGluc3RlYWQgb2YgdGhlIHRyYWlsaW5nLlxuICBfLmRlYm91bmNlID0gZnVuY3Rpb24oZnVuYywgd2FpdCwgaW1tZWRpYXRlKSB7XG4gICAgdmFyIHRpbWVvdXQsIGFyZ3MsIGNvbnRleHQsIHRpbWVzdGFtcCwgcmVzdWx0O1xuXG4gICAgdmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgbGFzdCA9IF8ubm93KCkgLSB0aW1lc3RhbXA7XG4gICAgICBpZiAobGFzdCA8IHdhaXQpIHtcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQgLSBsYXN0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICBpZiAoIWltbWVkaWF0ZSkge1xuICAgICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgICAgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnRleHQgPSB0aGlzO1xuICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIHRpbWVzdGFtcCA9IF8ubm93KCk7XG4gICAgICB2YXIgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dDtcbiAgICAgIGlmICghdGltZW91dCkge1xuICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XG4gICAgICB9XG4gICAgICBpZiAoY2FsbE5vdykge1xuICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGV4ZWN1dGVkIGF0IG1vc3Qgb25lIHRpbWUsIG5vIG1hdHRlciBob3dcbiAgLy8gb2Z0ZW4geW91IGNhbGwgaXQuIFVzZWZ1bCBmb3IgbGF6eSBpbml0aWFsaXphdGlvbi5cbiAgXy5vbmNlID0gZnVuY3Rpb24oZnVuYykge1xuICAgIHZhciByYW4gPSBmYWxzZSwgbWVtbztcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAocmFuKSByZXR1cm4gbWVtbztcbiAgICAgIHJhbiA9IHRydWU7XG4gICAgICBtZW1vID0gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgZnVuYyA9IG51bGw7XG4gICAgICByZXR1cm4gbWVtbztcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgdGhlIGZpcnN0IGZ1bmN0aW9uIHBhc3NlZCBhcyBhbiBhcmd1bWVudCB0byB0aGUgc2Vjb25kLFxuICAvLyBhbGxvd2luZyB5b3UgdG8gYWRqdXN0IGFyZ3VtZW50cywgcnVuIGNvZGUgYmVmb3JlIGFuZCBhZnRlciwgYW5kXG4gIC8vIGNvbmRpdGlvbmFsbHkgZXhlY3V0ZSB0aGUgb3JpZ2luYWwgZnVuY3Rpb24uXG4gIF8ud3JhcCA9IGZ1bmN0aW9uKGZ1bmMsIHdyYXBwZXIpIHtcbiAgICByZXR1cm4gXy5wYXJ0aWFsKHdyYXBwZXIsIGZ1bmMpO1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGlzIHRoZSBjb21wb3NpdGlvbiBvZiBhIGxpc3Qgb2YgZnVuY3Rpb25zLCBlYWNoXG4gIC8vIGNvbnN1bWluZyB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZSBmdW5jdGlvbiB0aGF0IGZvbGxvd3MuXG4gIF8uY29tcG9zZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBmdW5jcyA9IGFyZ3VtZW50cztcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIGZvciAodmFyIGkgPSBmdW5jcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBhcmdzID0gW2Z1bmNzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBhcmdzWzBdO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBvbmx5IGJlIGV4ZWN1dGVkIGFmdGVyIGJlaW5nIGNhbGxlZCBOIHRpbWVzLlxuICBfLmFmdGVyID0gZnVuY3Rpb24odGltZXMsIGZ1bmMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoLS10aW1lcyA8IDEpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xuXG4gIC8vIE9iamVjdCBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIFJldHJpZXZlIHRoZSBuYW1lcyBvZiBhbiBvYmplY3QncyBwcm9wZXJ0aWVzLlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgT2JqZWN0LmtleXNgXG4gIF8ua2V5cyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICghXy5pc09iamVjdChvYmopKSByZXR1cm4gW107XG4gICAgaWYgKG5hdGl2ZUtleXMpIHJldHVybiBuYXRpdmVLZXlzKG9iaik7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSBpZiAoXy5oYXMob2JqLCBrZXkpKSBrZXlzLnB1c2goa2V5KTtcbiAgICByZXR1cm4ga2V5cztcbiAgfTtcblxuICAvLyBSZXRyaWV2ZSB0aGUgdmFsdWVzIG9mIGFuIG9iamVjdCdzIHByb3BlcnRpZXMuXG4gIF8udmFsdWVzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgdmFyIHZhbHVlcyA9IG5ldyBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhbHVlc1tpXSA9IG9ialtrZXlzW2ldXTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfTtcblxuICAvLyBDb252ZXJ0IGFuIG9iamVjdCBpbnRvIGEgbGlzdCBvZiBgW2tleSwgdmFsdWVdYCBwYWlycy5cbiAgXy5wYWlycyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gICAgdmFyIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgIHZhciBwYWlycyA9IG5ldyBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHBhaXJzW2ldID0gW2tleXNbaV0sIG9ialtrZXlzW2ldXV07XG4gICAgfVxuICAgIHJldHVybiBwYWlycztcbiAgfTtcblxuICAvLyBJbnZlcnQgdGhlIGtleXMgYW5kIHZhbHVlcyBvZiBhbiBvYmplY3QuIFRoZSB2YWx1ZXMgbXVzdCBiZSBzZXJpYWxpemFibGUuXG4gIF8uaW52ZXJ0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGtleXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHJlc3VsdFtvYmpba2V5c1tpXV1dID0ga2V5c1tpXTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSBzb3J0ZWQgbGlzdCBvZiB0aGUgZnVuY3Rpb24gbmFtZXMgYXZhaWxhYmxlIG9uIHRoZSBvYmplY3QuXG4gIC8vIEFsaWFzZWQgYXMgYG1ldGhvZHNgXG4gIF8uZnVuY3Rpb25zID0gXy5tZXRob2RzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIG5hbWVzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKF8uaXNGdW5jdGlvbihvYmpba2V5XSkpIG5hbWVzLnB1c2goa2V5KTtcbiAgICB9XG4gICAgcmV0dXJuIG5hbWVzLnNvcnQoKTtcbiAgfTtcblxuICAvLyBFeHRlbmQgYSBnaXZlbiBvYmplY3Qgd2l0aCBhbGwgdGhlIHByb3BlcnRpZXMgaW4gcGFzc2VkLWluIG9iamVjdChzKS5cbiAgXy5leHRlbmQgPSBmdW5jdGlvbihvYmopIHtcbiAgICBlYWNoKHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSwgZnVuY3Rpb24oc291cmNlKSB7XG4gICAgICBpZiAoc291cmNlKSB7XG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gc291cmNlKSB7XG4gICAgICAgICAgb2JqW3Byb3BdID0gc291cmNlW3Byb3BdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSBjb3B5IG9mIHRoZSBvYmplY3Qgb25seSBjb250YWluaW5nIHRoZSB3aGl0ZWxpc3RlZCBwcm9wZXJ0aWVzLlxuICBfLnBpY2sgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgY29weSA9IHt9O1xuICAgIHZhciBrZXlzID0gY29uY2F0LmFwcGx5KEFycmF5UHJvdG8sIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgZWFjaChrZXlzLCBmdW5jdGlvbihrZXkpIHtcbiAgICAgIGlmIChrZXkgaW4gb2JqKSBjb3B5W2tleV0gPSBvYmpba2V5XTtcbiAgICB9KTtcbiAgICByZXR1cm4gY29weTtcbiAgfTtcblxuICAgLy8gUmV0dXJuIGEgY29weSBvZiB0aGUgb2JqZWN0IHdpdGhvdXQgdGhlIGJsYWNrbGlzdGVkIHByb3BlcnRpZXMuXG4gIF8ub21pdCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBjb3B5ID0ge307XG4gICAgdmFyIGtleXMgPSBjb25jYXQuYXBwbHkoQXJyYXlQcm90bywgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICBpZiAoIV8uY29udGFpbnMoa2V5cywga2V5KSkgY29weVtrZXldID0gb2JqW2tleV07XG4gICAgfVxuICAgIHJldHVybiBjb3B5O1xuICB9O1xuXG4gIC8vIEZpbGwgaW4gYSBnaXZlbiBvYmplY3Qgd2l0aCBkZWZhdWx0IHByb3BlcnRpZXMuXG4gIF8uZGVmYXVsdHMgPSBmdW5jdGlvbihvYmopIHtcbiAgICBlYWNoKHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSwgZnVuY3Rpb24oc291cmNlKSB7XG4gICAgICBpZiAoc291cmNlKSB7XG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gc291cmNlKSB7XG4gICAgICAgICAgaWYgKG9ialtwcm9wXSA9PT0gdm9pZCAwKSBvYmpbcHJvcF0gPSBzb3VyY2VbcHJvcF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIENyZWF0ZSBhIChzaGFsbG93LWNsb25lZCkgZHVwbGljYXRlIG9mIGFuIG9iamVjdC5cbiAgXy5jbG9uZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICghXy5pc09iamVjdChvYmopKSByZXR1cm4gb2JqO1xuICAgIHJldHVybiBfLmlzQXJyYXkob2JqKSA/IG9iai5zbGljZSgpIDogXy5leHRlbmQoe30sIG9iaik7XG4gIH07XG5cbiAgLy8gSW52b2tlcyBpbnRlcmNlcHRvciB3aXRoIHRoZSBvYmosIGFuZCB0aGVuIHJldHVybnMgb2JqLlxuICAvLyBUaGUgcHJpbWFyeSBwdXJwb3NlIG9mIHRoaXMgbWV0aG9kIGlzIHRvIFwidGFwIGludG9cIiBhIG1ldGhvZCBjaGFpbiwgaW5cbiAgLy8gb3JkZXIgdG8gcGVyZm9ybSBvcGVyYXRpb25zIG9uIGludGVybWVkaWF0ZSByZXN1bHRzIHdpdGhpbiB0aGUgY2hhaW4uXG4gIF8udGFwID0gZnVuY3Rpb24ob2JqLCBpbnRlcmNlcHRvcikge1xuICAgIGludGVyY2VwdG9yKG9iaik7XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBJbnRlcm5hbCByZWN1cnNpdmUgY29tcGFyaXNvbiBmdW5jdGlvbiBmb3IgYGlzRXF1YWxgLlxuICB2YXIgZXEgPSBmdW5jdGlvbihhLCBiLCBhU3RhY2ssIGJTdGFjaykge1xuICAgIC8vIElkZW50aWNhbCBvYmplY3RzIGFyZSBlcXVhbC4gYDAgPT09IC0wYCwgYnV0IHRoZXkgYXJlbid0IGlkZW50aWNhbC5cbiAgICAvLyBTZWUgdGhlIFtIYXJtb255IGBlZ2FsYCBwcm9wb3NhbF0oaHR0cDovL3dpa2kuZWNtYXNjcmlwdC5vcmcvZG9rdS5waHA/aWQ9aGFybW9ueTplZ2FsKS5cbiAgICBpZiAoYSA9PT0gYikgcmV0dXJuIGEgIT09IDAgfHwgMSAvIGEgPT0gMSAvIGI7XG4gICAgLy8gQSBzdHJpY3QgY29tcGFyaXNvbiBpcyBuZWNlc3NhcnkgYmVjYXVzZSBgbnVsbCA9PSB1bmRlZmluZWRgLlxuICAgIGlmIChhID09IG51bGwgfHwgYiA9PSBudWxsKSByZXR1cm4gYSA9PT0gYjtcbiAgICAvLyBVbndyYXAgYW55IHdyYXBwZWQgb2JqZWN0cy5cbiAgICBpZiAoYSBpbnN0YW5jZW9mIF8pIGEgPSBhLl93cmFwcGVkO1xuICAgIGlmIChiIGluc3RhbmNlb2YgXykgYiA9IGIuX3dyYXBwZWQ7XG4gICAgLy8gQ29tcGFyZSBgW1tDbGFzc11dYCBuYW1lcy5cbiAgICB2YXIgY2xhc3NOYW1lID0gdG9TdHJpbmcuY2FsbChhKTtcbiAgICBpZiAoY2xhc3NOYW1lICE9IHRvU3RyaW5nLmNhbGwoYikpIHJldHVybiBmYWxzZTtcbiAgICBzd2l0Y2ggKGNsYXNzTmFtZSkge1xuICAgICAgLy8gU3RyaW5ncywgbnVtYmVycywgZGF0ZXMsIGFuZCBib29sZWFucyBhcmUgY29tcGFyZWQgYnkgdmFsdWUuXG4gICAgICBjYXNlICdbb2JqZWN0IFN0cmluZ10nOlxuICAgICAgICAvLyBQcmltaXRpdmVzIGFuZCB0aGVpciBjb3JyZXNwb25kaW5nIG9iamVjdCB3cmFwcGVycyBhcmUgZXF1aXZhbGVudDsgdGh1cywgYFwiNVwiYCBpc1xuICAgICAgICAvLyBlcXVpdmFsZW50IHRvIGBuZXcgU3RyaW5nKFwiNVwiKWAuXG4gICAgICAgIHJldHVybiBhID09IFN0cmluZyhiKTtcbiAgICAgIGNhc2UgJ1tvYmplY3QgTnVtYmVyXSc6XG4gICAgICAgIC8vIGBOYU5gcyBhcmUgZXF1aXZhbGVudCwgYnV0IG5vbi1yZWZsZXhpdmUuIEFuIGBlZ2FsYCBjb21wYXJpc29uIGlzIHBlcmZvcm1lZCBmb3JcbiAgICAgICAgLy8gb3RoZXIgbnVtZXJpYyB2YWx1ZXMuXG4gICAgICAgIHJldHVybiBhICE9ICthID8gYiAhPSArYiA6IChhID09IDAgPyAxIC8gYSA9PSAxIC8gYiA6IGEgPT0gK2IpO1xuICAgICAgY2FzZSAnW29iamVjdCBEYXRlXSc6XG4gICAgICBjYXNlICdbb2JqZWN0IEJvb2xlYW5dJzpcbiAgICAgICAgLy8gQ29lcmNlIGRhdGVzIGFuZCBib29sZWFucyB0byBudW1lcmljIHByaW1pdGl2ZSB2YWx1ZXMuIERhdGVzIGFyZSBjb21wYXJlZCBieSB0aGVpclxuICAgICAgICAvLyBtaWxsaXNlY29uZCByZXByZXNlbnRhdGlvbnMuIE5vdGUgdGhhdCBpbnZhbGlkIGRhdGVzIHdpdGggbWlsbGlzZWNvbmQgcmVwcmVzZW50YXRpb25zXG4gICAgICAgIC8vIG9mIGBOYU5gIGFyZSBub3QgZXF1aXZhbGVudC5cbiAgICAgICAgcmV0dXJuICthID09ICtiO1xuICAgICAgLy8gUmVnRXhwcyBhcmUgY29tcGFyZWQgYnkgdGhlaXIgc291cmNlIHBhdHRlcm5zIGFuZCBmbGFncy5cbiAgICAgIGNhc2UgJ1tvYmplY3QgUmVnRXhwXSc6XG4gICAgICAgIHJldHVybiBhLnNvdXJjZSA9PSBiLnNvdXJjZSAmJlxuICAgICAgICAgICAgICAgYS5nbG9iYWwgPT0gYi5nbG9iYWwgJiZcbiAgICAgICAgICAgICAgIGEubXVsdGlsaW5lID09IGIubXVsdGlsaW5lICYmXG4gICAgICAgICAgICAgICBhLmlnbm9yZUNhc2UgPT0gYi5pZ25vcmVDYXNlO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGEgIT0gJ29iamVjdCcgfHwgdHlwZW9mIGIgIT0gJ29iamVjdCcpIHJldHVybiBmYWxzZTtcbiAgICAvLyBBc3N1bWUgZXF1YWxpdHkgZm9yIGN5Y2xpYyBzdHJ1Y3R1cmVzLiBUaGUgYWxnb3JpdGhtIGZvciBkZXRlY3RpbmcgY3ljbGljXG4gICAgLy8gc3RydWN0dXJlcyBpcyBhZGFwdGVkIGZyb20gRVMgNS4xIHNlY3Rpb24gMTUuMTIuMywgYWJzdHJhY3Qgb3BlcmF0aW9uIGBKT2AuXG4gICAgdmFyIGxlbmd0aCA9IGFTdGFjay5sZW5ndGg7XG4gICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICAvLyBMaW5lYXIgc2VhcmNoLiBQZXJmb3JtYW5jZSBpcyBpbnZlcnNlbHkgcHJvcG9ydGlvbmFsIHRvIHRoZSBudW1iZXIgb2ZcbiAgICAgIC8vIHVuaXF1ZSBuZXN0ZWQgc3RydWN0dXJlcy5cbiAgICAgIGlmIChhU3RhY2tbbGVuZ3RoXSA9PSBhKSByZXR1cm4gYlN0YWNrW2xlbmd0aF0gPT0gYjtcbiAgICB9XG4gICAgLy8gT2JqZWN0cyB3aXRoIGRpZmZlcmVudCBjb25zdHJ1Y3RvcnMgYXJlIG5vdCBlcXVpdmFsZW50LCBidXQgYE9iamVjdGBzXG4gICAgLy8gZnJvbSBkaWZmZXJlbnQgZnJhbWVzIGFyZS5cbiAgICB2YXIgYUN0b3IgPSBhLmNvbnN0cnVjdG9yLCBiQ3RvciA9IGIuY29uc3RydWN0b3I7XG4gICAgaWYgKGFDdG9yICE9PSBiQ3RvciAmJiAhKF8uaXNGdW5jdGlvbihhQ3RvcikgJiYgKGFDdG9yIGluc3RhbmNlb2YgYUN0b3IpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uaXNGdW5jdGlvbihiQ3RvcikgJiYgKGJDdG9yIGluc3RhbmNlb2YgYkN0b3IpKVxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgKCdjb25zdHJ1Y3RvcicgaW4gYSAmJiAnY29uc3RydWN0b3InIGluIGIpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIEFkZCB0aGUgZmlyc3Qgb2JqZWN0IHRvIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAgICBhU3RhY2sucHVzaChhKTtcbiAgICBiU3RhY2sucHVzaChiKTtcbiAgICB2YXIgc2l6ZSA9IDAsIHJlc3VsdCA9IHRydWU7XG4gICAgLy8gUmVjdXJzaXZlbHkgY29tcGFyZSBvYmplY3RzIGFuZCBhcnJheXMuXG4gICAgaWYgKGNsYXNzTmFtZSA9PSAnW29iamVjdCBBcnJheV0nKSB7XG4gICAgICAvLyBDb21wYXJlIGFycmF5IGxlbmd0aHMgdG8gZGV0ZXJtaW5lIGlmIGEgZGVlcCBjb21wYXJpc29uIGlzIG5lY2Vzc2FyeS5cbiAgICAgIHNpemUgPSBhLmxlbmd0aDtcbiAgICAgIHJlc3VsdCA9IHNpemUgPT0gYi5sZW5ndGg7XG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIC8vIERlZXAgY29tcGFyZSB0aGUgY29udGVudHMsIGlnbm9yaW5nIG5vbi1udW1lcmljIHByb3BlcnRpZXMuXG4gICAgICAgIHdoaWxlIChzaXplLS0pIHtcbiAgICAgICAgICBpZiAoIShyZXN1bHQgPSBlcShhW3NpemVdLCBiW3NpemVdLCBhU3RhY2ssIGJTdGFjaykpKSBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBEZWVwIGNvbXBhcmUgb2JqZWN0cy5cbiAgICAgIGZvciAodmFyIGtleSBpbiBhKSB7XG4gICAgICAgIGlmIChfLmhhcyhhLCBrZXkpKSB7XG4gICAgICAgICAgLy8gQ291bnQgdGhlIGV4cGVjdGVkIG51bWJlciBvZiBwcm9wZXJ0aWVzLlxuICAgICAgICAgIHNpemUrKztcbiAgICAgICAgICAvLyBEZWVwIGNvbXBhcmUgZWFjaCBtZW1iZXIuXG4gICAgICAgICAgaWYgKCEocmVzdWx0ID0gXy5oYXMoYiwga2V5KSAmJiBlcShhW2tleV0sIGJba2V5XSwgYVN0YWNrLCBiU3RhY2spKSkgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIEVuc3VyZSB0aGF0IGJvdGggb2JqZWN0cyBjb250YWluIHRoZSBzYW1lIG51bWJlciBvZiBwcm9wZXJ0aWVzLlxuICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICBmb3IgKGtleSBpbiBiKSB7XG4gICAgICAgICAgaWYgKF8uaGFzKGIsIGtleSkgJiYgIShzaXplLS0pKSBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQgPSAhc2l6ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gUmVtb3ZlIHRoZSBmaXJzdCBvYmplY3QgZnJvbSB0aGUgc3RhY2sgb2YgdHJhdmVyc2VkIG9iamVjdHMuXG4gICAgYVN0YWNrLnBvcCgpO1xuICAgIGJTdGFjay5wb3AoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFBlcmZvcm0gYSBkZWVwIGNvbXBhcmlzb24gdG8gY2hlY2sgaWYgdHdvIG9iamVjdHMgYXJlIGVxdWFsLlxuICBfLmlzRXF1YWwgPSBmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIGVxKGEsIGIsIFtdLCBbXSk7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiBhcnJheSwgc3RyaW5nLCBvciBvYmplY3QgZW1wdHk/XG4gIC8vIEFuIFwiZW1wdHlcIiBvYmplY3QgaGFzIG5vIGVudW1lcmFibGUgb3duLXByb3BlcnRpZXMuXG4gIF8uaXNFbXB0eSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHRydWU7XG4gICAgaWYgKF8uaXNBcnJheShvYmopIHx8IF8uaXNTdHJpbmcob2JqKSkgcmV0dXJuIG9iai5sZW5ndGggPT09IDA7XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikgaWYgKF8uaGFzKG9iaiwga2V5KSkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgYSBET00gZWxlbWVudD9cbiAgXy5pc0VsZW1lbnQgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gISEob2JqICYmIG9iai5ub2RlVHlwZSA9PT0gMSk7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBhbiBhcnJheT9cbiAgLy8gRGVsZWdhdGVzIHRvIEVDTUE1J3MgbmF0aXZlIEFycmF5LmlzQXJyYXlcbiAgXy5pc0FycmF5ID0gbmF0aXZlSXNBcnJheSB8fCBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09ICdbb2JqZWN0IEFycmF5XSc7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YXJpYWJsZSBhbiBvYmplY3Q/XG4gIF8uaXNPYmplY3QgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSBPYmplY3Qob2JqKTtcbiAgfTtcblxuICAvLyBBZGQgc29tZSBpc1R5cGUgbWV0aG9kczogaXNBcmd1bWVudHMsIGlzRnVuY3Rpb24sIGlzU3RyaW5nLCBpc051bWJlciwgaXNEYXRlLCBpc1JlZ0V4cC5cbiAgZWFjaChbJ0FyZ3VtZW50cycsICdGdW5jdGlvbicsICdTdHJpbmcnLCAnTnVtYmVyJywgJ0RhdGUnLCAnUmVnRXhwJ10sIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBfWydpcycgKyBuYW1lXSA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PSAnW29iamVjdCAnICsgbmFtZSArICddJztcbiAgICB9O1xuICB9KTtcblxuICAvLyBEZWZpbmUgYSBmYWxsYmFjayB2ZXJzaW9uIG9mIHRoZSBtZXRob2QgaW4gYnJvd3NlcnMgKGFoZW0sIElFKSwgd2hlcmVcbiAgLy8gdGhlcmUgaXNuJ3QgYW55IGluc3BlY3RhYmxlIFwiQXJndW1lbnRzXCIgdHlwZS5cbiAgaWYgKCFfLmlzQXJndW1lbnRzKGFyZ3VtZW50cykpIHtcbiAgICBfLmlzQXJndW1lbnRzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gISEob2JqICYmIF8uaGFzKG9iaiwgJ2NhbGxlZScpKTtcbiAgICB9O1xuICB9XG5cbiAgLy8gT3B0aW1pemUgYGlzRnVuY3Rpb25gIGlmIGFwcHJvcHJpYXRlLlxuICBpZiAodHlwZW9mICgvLi8pICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgXy5pc0Z1bmN0aW9uID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ2Z1bmN0aW9uJztcbiAgICB9O1xuICB9XG5cbiAgLy8gSXMgYSBnaXZlbiBvYmplY3QgYSBmaW5pdGUgbnVtYmVyP1xuICBfLmlzRmluaXRlID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIGlzRmluaXRlKG9iaikgJiYgIWlzTmFOKHBhcnNlRmxvYXQob2JqKSk7XG4gIH07XG5cbiAgLy8gSXMgdGhlIGdpdmVuIHZhbHVlIGBOYU5gPyAoTmFOIGlzIHRoZSBvbmx5IG51bWJlciB3aGljaCBkb2VzIG5vdCBlcXVhbCBpdHNlbGYpLlxuICBfLmlzTmFOID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIF8uaXNOdW1iZXIob2JqKSAmJiBvYmogIT0gK29iajtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGEgYm9vbGVhbj9cbiAgXy5pc0Jvb2xlYW4gPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSB0cnVlIHx8IG9iaiA9PT0gZmFsc2UgfHwgdG9TdHJpbmcuY2FsbChvYmopID09ICdbb2JqZWN0IEJvb2xlYW5dJztcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGVxdWFsIHRvIG51bGw/XG4gIF8uaXNOdWxsID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gbnVsbDtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhcmlhYmxlIHVuZGVmaW5lZD9cbiAgXy5pc1VuZGVmaW5lZCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IHZvaWQgMDtcbiAgfTtcblxuICAvLyBTaG9ydGN1dCBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYW4gb2JqZWN0IGhhcyBhIGdpdmVuIHByb3BlcnR5IGRpcmVjdGx5XG4gIC8vIG9uIGl0c2VsZiAoaW4gb3RoZXIgd29yZHMsIG5vdCBvbiBhIHByb3RvdHlwZSkuXG4gIF8uaGFzID0gZnVuY3Rpb24ob2JqLCBrZXkpIHtcbiAgICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSk7XG4gIH07XG5cbiAgLy8gVXRpbGl0eSBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBSdW4gVW5kZXJzY29yZS5qcyBpbiAqbm9Db25mbGljdCogbW9kZSwgcmV0dXJuaW5nIHRoZSBgX2AgdmFyaWFibGUgdG8gaXRzXG4gIC8vIHByZXZpb3VzIG93bmVyLiBSZXR1cm5zIGEgcmVmZXJlbmNlIHRvIHRoZSBVbmRlcnNjb3JlIG9iamVjdC5cbiAgXy5ub0NvbmZsaWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgcm9vdC5fID0gcHJldmlvdXNVbmRlcnNjb3JlO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8vIEtlZXAgdGhlIGlkZW50aXR5IGZ1bmN0aW9uIGFyb3VuZCBmb3IgZGVmYXVsdCBpdGVyYXRvcnMuXG4gIF8uaWRlbnRpdHkgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcblxuICBfLmNvbnN0YW50ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH07XG4gIH07XG5cbiAgXy5wcm9wZXJ0eSA9IGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmpba2V5XTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBwcmVkaWNhdGUgZm9yIGNoZWNraW5nIHdoZXRoZXIgYW4gb2JqZWN0IGhhcyBhIGdpdmVuIHNldCBvZiBga2V5OnZhbHVlYCBwYWlycy5cbiAgXy5tYXRjaGVzID0gZnVuY3Rpb24oYXR0cnMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqKSB7XG4gICAgICBpZiAob2JqID09PSBhdHRycykgcmV0dXJuIHRydWU7IC8vYXZvaWQgY29tcGFyaW5nIGFuIG9iamVjdCB0byBpdHNlbGYuXG4gICAgICBmb3IgKHZhciBrZXkgaW4gYXR0cnMpIHtcbiAgICAgICAgaWYgKGF0dHJzW2tleV0gIT09IG9ialtrZXldKVxuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfTtcblxuICAvLyBSdW4gYSBmdW5jdGlvbiAqKm4qKiB0aW1lcy5cbiAgXy50aW1lcyA9IGZ1bmN0aW9uKG4sIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgdmFyIGFjY3VtID0gQXJyYXkoTWF0aC5tYXgoMCwgbikpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgaSsrKSBhY2N1bVtpXSA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgaSk7XG4gICAgcmV0dXJuIGFjY3VtO1xuICB9O1xuXG4gIC8vIFJldHVybiBhIHJhbmRvbSBpbnRlZ2VyIGJldHdlZW4gbWluIGFuZCBtYXggKGluY2x1c2l2ZSkuXG4gIF8ucmFuZG9tID0gZnVuY3Rpb24obWluLCBtYXgpIHtcbiAgICBpZiAobWF4ID09IG51bGwpIHtcbiAgICAgIG1heCA9IG1pbjtcbiAgICAgIG1pbiA9IDA7XG4gICAgfVxuICAgIHJldHVybiBtaW4gKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpO1xuICB9O1xuXG4gIC8vIEEgKHBvc3NpYmx5IGZhc3Rlcikgd2F5IHRvIGdldCB0aGUgY3VycmVudCB0aW1lc3RhbXAgYXMgYW4gaW50ZWdlci5cbiAgXy5ub3cgPSBEYXRlLm5vdyB8fCBmdW5jdGlvbigpIHsgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpOyB9O1xuXG4gIC8vIExpc3Qgb2YgSFRNTCBlbnRpdGllcyBmb3IgZXNjYXBpbmcuXG4gIHZhciBlbnRpdHlNYXAgPSB7XG4gICAgZXNjYXBlOiB7XG4gICAgICAnJic6ICcmYW1wOycsXG4gICAgICAnPCc6ICcmbHQ7JyxcbiAgICAgICc+JzogJyZndDsnLFxuICAgICAgJ1wiJzogJyZxdW90OycsXG4gICAgICBcIidcIjogJyYjeDI3OydcbiAgICB9XG4gIH07XG4gIGVudGl0eU1hcC51bmVzY2FwZSA9IF8uaW52ZXJ0KGVudGl0eU1hcC5lc2NhcGUpO1xuXG4gIC8vIFJlZ2V4ZXMgY29udGFpbmluZyB0aGUga2V5cyBhbmQgdmFsdWVzIGxpc3RlZCBpbW1lZGlhdGVseSBhYm92ZS5cbiAgdmFyIGVudGl0eVJlZ2V4ZXMgPSB7XG4gICAgZXNjYXBlOiAgIG5ldyBSZWdFeHAoJ1snICsgXy5rZXlzKGVudGl0eU1hcC5lc2NhcGUpLmpvaW4oJycpICsgJ10nLCAnZycpLFxuICAgIHVuZXNjYXBlOiBuZXcgUmVnRXhwKCcoJyArIF8ua2V5cyhlbnRpdHlNYXAudW5lc2NhcGUpLmpvaW4oJ3wnKSArICcpJywgJ2cnKVxuICB9O1xuXG4gIC8vIEZ1bmN0aW9ucyBmb3IgZXNjYXBpbmcgYW5kIHVuZXNjYXBpbmcgc3RyaW5ncyB0by9mcm9tIEhUTUwgaW50ZXJwb2xhdGlvbi5cbiAgXy5lYWNoKFsnZXNjYXBlJywgJ3VuZXNjYXBlJ10sIGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgIF9bbWV0aG9kXSA9IGZ1bmN0aW9uKHN0cmluZykge1xuICAgICAgaWYgKHN0cmluZyA9PSBudWxsKSByZXR1cm4gJyc7XG4gICAgICByZXR1cm4gKCcnICsgc3RyaW5nKS5yZXBsYWNlKGVudGl0eVJlZ2V4ZXNbbWV0aG9kXSwgZnVuY3Rpb24obWF0Y2gpIHtcbiAgICAgICAgcmV0dXJuIGVudGl0eU1hcFttZXRob2RdW21hdGNoXTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIElmIHRoZSB2YWx1ZSBvZiB0aGUgbmFtZWQgYHByb3BlcnR5YCBpcyBhIGZ1bmN0aW9uIHRoZW4gaW52b2tlIGl0IHdpdGggdGhlXG4gIC8vIGBvYmplY3RgIGFzIGNvbnRleHQ7IG90aGVyd2lzZSwgcmV0dXJuIGl0LlxuICBfLnJlc3VsdCA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHtcbiAgICBpZiAob2JqZWN0ID09IG51bGwpIHJldHVybiB2b2lkIDA7XG4gICAgdmFyIHZhbHVlID0gb2JqZWN0W3Byb3BlcnR5XTtcbiAgICByZXR1cm4gXy5pc0Z1bmN0aW9uKHZhbHVlKSA/IHZhbHVlLmNhbGwob2JqZWN0KSA6IHZhbHVlO1xuICB9O1xuXG4gIC8vIEFkZCB5b3VyIG93biBjdXN0b20gZnVuY3Rpb25zIHRvIHRoZSBVbmRlcnNjb3JlIG9iamVjdC5cbiAgXy5taXhpbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGVhY2goXy5mdW5jdGlvbnMob2JqKSwgZnVuY3Rpb24obmFtZSkge1xuICAgICAgdmFyIGZ1bmMgPSBfW25hbWVdID0gb2JqW25hbWVdO1xuICAgICAgXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBbdGhpcy5fd3JhcHBlZF07XG4gICAgICAgIHB1c2guYXBwbHkoYXJncywgYXJndW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5jYWxsKHRoaXMsIGZ1bmMuYXBwbHkoXywgYXJncykpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBHZW5lcmF0ZSBhIHVuaXF1ZSBpbnRlZ2VyIGlkICh1bmlxdWUgd2l0aGluIHRoZSBlbnRpcmUgY2xpZW50IHNlc3Npb24pLlxuICAvLyBVc2VmdWwgZm9yIHRlbXBvcmFyeSBET00gaWRzLlxuICB2YXIgaWRDb3VudGVyID0gMDtcbiAgXy51bmlxdWVJZCA9IGZ1bmN0aW9uKHByZWZpeCkge1xuICAgIHZhciBpZCA9ICsraWRDb3VudGVyICsgJyc7XG4gICAgcmV0dXJuIHByZWZpeCA/IHByZWZpeCArIGlkIDogaWQ7XG4gIH07XG5cbiAgLy8gQnkgZGVmYXVsdCwgVW5kZXJzY29yZSB1c2VzIEVSQi1zdHlsZSB0ZW1wbGF0ZSBkZWxpbWl0ZXJzLCBjaGFuZ2UgdGhlXG4gIC8vIGZvbGxvd2luZyB0ZW1wbGF0ZSBzZXR0aW5ncyB0byB1c2UgYWx0ZXJuYXRpdmUgZGVsaW1pdGVycy5cbiAgXy50ZW1wbGF0ZVNldHRpbmdzID0ge1xuICAgIGV2YWx1YXRlICAgIDogLzwlKFtcXHNcXFNdKz8pJT4vZyxcbiAgICBpbnRlcnBvbGF0ZSA6IC88JT0oW1xcc1xcU10rPyklPi9nLFxuICAgIGVzY2FwZSAgICAgIDogLzwlLShbXFxzXFxTXSs/KSU+L2dcbiAgfTtcblxuICAvLyBXaGVuIGN1c3RvbWl6aW5nIGB0ZW1wbGF0ZVNldHRpbmdzYCwgaWYgeW91IGRvbid0IHdhbnQgdG8gZGVmaW5lIGFuXG4gIC8vIGludGVycG9sYXRpb24sIGV2YWx1YXRpb24gb3IgZXNjYXBpbmcgcmVnZXgsIHdlIG5lZWQgb25lIHRoYXQgaXNcbiAgLy8gZ3VhcmFudGVlZCBub3QgdG8gbWF0Y2guXG4gIHZhciBub01hdGNoID0gLyguKV4vO1xuXG4gIC8vIENlcnRhaW4gY2hhcmFjdGVycyBuZWVkIHRvIGJlIGVzY2FwZWQgc28gdGhhdCB0aGV5IGNhbiBiZSBwdXQgaW50byBhXG4gIC8vIHN0cmluZyBsaXRlcmFsLlxuICB2YXIgZXNjYXBlcyA9IHtcbiAgICBcIidcIjogICAgICBcIidcIixcbiAgICAnXFxcXCc6ICAgICAnXFxcXCcsXG4gICAgJ1xccic6ICAgICAncicsXG4gICAgJ1xcbic6ICAgICAnbicsXG4gICAgJ1xcdCc6ICAgICAndCcsXG4gICAgJ1xcdTIwMjgnOiAndTIwMjgnLFxuICAgICdcXHUyMDI5JzogJ3UyMDI5J1xuICB9O1xuXG4gIHZhciBlc2NhcGVyID0gL1xcXFx8J3xcXHJ8XFxufFxcdHxcXHUyMDI4fFxcdTIwMjkvZztcblxuICAvLyBKYXZhU2NyaXB0IG1pY3JvLXRlbXBsYXRpbmcsIHNpbWlsYXIgdG8gSm9obiBSZXNpZydzIGltcGxlbWVudGF0aW9uLlxuICAvLyBVbmRlcnNjb3JlIHRlbXBsYXRpbmcgaGFuZGxlcyBhcmJpdHJhcnkgZGVsaW1pdGVycywgcHJlc2VydmVzIHdoaXRlc3BhY2UsXG4gIC8vIGFuZCBjb3JyZWN0bHkgZXNjYXBlcyBxdW90ZXMgd2l0aGluIGludGVycG9sYXRlZCBjb2RlLlxuICBfLnRlbXBsYXRlID0gZnVuY3Rpb24odGV4dCwgZGF0YSwgc2V0dGluZ3MpIHtcbiAgICB2YXIgcmVuZGVyO1xuICAgIHNldHRpbmdzID0gXy5kZWZhdWx0cyh7fSwgc2V0dGluZ3MsIF8udGVtcGxhdGVTZXR0aW5ncyk7XG5cbiAgICAvLyBDb21iaW5lIGRlbGltaXRlcnMgaW50byBvbmUgcmVndWxhciBleHByZXNzaW9uIHZpYSBhbHRlcm5hdGlvbi5cbiAgICB2YXIgbWF0Y2hlciA9IG5ldyBSZWdFeHAoW1xuICAgICAgKHNldHRpbmdzLmVzY2FwZSB8fCBub01hdGNoKS5zb3VyY2UsXG4gICAgICAoc2V0dGluZ3MuaW50ZXJwb2xhdGUgfHwgbm9NYXRjaCkuc291cmNlLFxuICAgICAgKHNldHRpbmdzLmV2YWx1YXRlIHx8IG5vTWF0Y2gpLnNvdXJjZVxuICAgIF0uam9pbignfCcpICsgJ3wkJywgJ2cnKTtcblxuICAgIC8vIENvbXBpbGUgdGhlIHRlbXBsYXRlIHNvdXJjZSwgZXNjYXBpbmcgc3RyaW5nIGxpdGVyYWxzIGFwcHJvcHJpYXRlbHkuXG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgc291cmNlID0gXCJfX3ArPSdcIjtcbiAgICB0ZXh0LnJlcGxhY2UobWF0Y2hlciwgZnVuY3Rpb24obWF0Y2gsIGVzY2FwZSwgaW50ZXJwb2xhdGUsIGV2YWx1YXRlLCBvZmZzZXQpIHtcbiAgICAgIHNvdXJjZSArPSB0ZXh0LnNsaWNlKGluZGV4LCBvZmZzZXQpXG4gICAgICAgIC5yZXBsYWNlKGVzY2FwZXIsIGZ1bmN0aW9uKG1hdGNoKSB7IHJldHVybiAnXFxcXCcgKyBlc2NhcGVzW21hdGNoXTsgfSk7XG5cbiAgICAgIGlmIChlc2NhcGUpIHtcbiAgICAgICAgc291cmNlICs9IFwiJytcXG4oKF9fdD0oXCIgKyBlc2NhcGUgKyBcIikpPT1udWxsPycnOl8uZXNjYXBlKF9fdCkpK1xcbidcIjtcbiAgICAgIH1cbiAgICAgIGlmIChpbnRlcnBvbGF0ZSkge1xuICAgICAgICBzb3VyY2UgKz0gXCInK1xcbigoX190PShcIiArIGludGVycG9sYXRlICsgXCIpKT09bnVsbD8nJzpfX3QpK1xcbidcIjtcbiAgICAgIH1cbiAgICAgIGlmIChldmFsdWF0ZSkge1xuICAgICAgICBzb3VyY2UgKz0gXCInO1xcblwiICsgZXZhbHVhdGUgKyBcIlxcbl9fcCs9J1wiO1xuICAgICAgfVxuICAgICAgaW5kZXggPSBvZmZzZXQgKyBtYXRjaC5sZW5ndGg7XG4gICAgICByZXR1cm4gbWF0Y2g7XG4gICAgfSk7XG4gICAgc291cmNlICs9IFwiJztcXG5cIjtcblxuICAgIC8vIElmIGEgdmFyaWFibGUgaXMgbm90IHNwZWNpZmllZCwgcGxhY2UgZGF0YSB2YWx1ZXMgaW4gbG9jYWwgc2NvcGUuXG4gICAgaWYgKCFzZXR0aW5ncy52YXJpYWJsZSkgc291cmNlID0gJ3dpdGgob2JqfHx7fSl7XFxuJyArIHNvdXJjZSArICd9XFxuJztcblxuICAgIHNvdXJjZSA9IFwidmFyIF9fdCxfX3A9JycsX19qPUFycmF5LnByb3RvdHlwZS5qb2luLFwiICtcbiAgICAgIFwicHJpbnQ9ZnVuY3Rpb24oKXtfX3ArPV9fai5jYWxsKGFyZ3VtZW50cywnJyk7fTtcXG5cIiArXG4gICAgICBzb3VyY2UgKyBcInJldHVybiBfX3A7XFxuXCI7XG5cbiAgICB0cnkge1xuICAgICAgcmVuZGVyID0gbmV3IEZ1bmN0aW9uKHNldHRpbmdzLnZhcmlhYmxlIHx8ICdvYmonLCAnXycsIHNvdXJjZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZS5zb3VyY2UgPSBzb3VyY2U7XG4gICAgICB0aHJvdyBlO1xuICAgIH1cblxuICAgIGlmIChkYXRhKSByZXR1cm4gcmVuZGVyKGRhdGEsIF8pO1xuICAgIHZhciB0ZW1wbGF0ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHJldHVybiByZW5kZXIuY2FsbCh0aGlzLCBkYXRhLCBfKTtcbiAgICB9O1xuXG4gICAgLy8gUHJvdmlkZSB0aGUgY29tcGlsZWQgZnVuY3Rpb24gc291cmNlIGFzIGEgY29udmVuaWVuY2UgZm9yIHByZWNvbXBpbGF0aW9uLlxuICAgIHRlbXBsYXRlLnNvdXJjZSA9ICdmdW5jdGlvbignICsgKHNldHRpbmdzLnZhcmlhYmxlIHx8ICdvYmonKSArICcpe1xcbicgKyBzb3VyY2UgKyAnfSc7XG5cbiAgICByZXR1cm4gdGVtcGxhdGU7XG4gIH07XG5cbiAgLy8gQWRkIGEgXCJjaGFpblwiIGZ1bmN0aW9uLCB3aGljaCB3aWxsIGRlbGVnYXRlIHRvIHRoZSB3cmFwcGVyLlxuICBfLmNoYWluID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIF8ob2JqKS5jaGFpbigpO1xuICB9O1xuXG4gIC8vIE9PUFxuICAvLyAtLS0tLS0tLS0tLS0tLS1cbiAgLy8gSWYgVW5kZXJzY29yZSBpcyBjYWxsZWQgYXMgYSBmdW5jdGlvbiwgaXQgcmV0dXJucyBhIHdyYXBwZWQgb2JqZWN0IHRoYXRcbiAgLy8gY2FuIGJlIHVzZWQgT08tc3R5bGUuIFRoaXMgd3JhcHBlciBob2xkcyBhbHRlcmVkIHZlcnNpb25zIG9mIGFsbCB0aGVcbiAgLy8gdW5kZXJzY29yZSBmdW5jdGlvbnMuIFdyYXBwZWQgb2JqZWN0cyBtYXkgYmUgY2hhaW5lZC5cblxuICAvLyBIZWxwZXIgZnVuY3Rpb24gdG8gY29udGludWUgY2hhaW5pbmcgaW50ZXJtZWRpYXRlIHJlc3VsdHMuXG4gIHZhciByZXN1bHQgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gdGhpcy5fY2hhaW4gPyBfKG9iaikuY2hhaW4oKSA6IG9iajtcbiAgfTtcblxuICAvLyBBZGQgYWxsIG9mIHRoZSBVbmRlcnNjb3JlIGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlciBvYmplY3QuXG4gIF8ubWl4aW4oXyk7XG5cbiAgLy8gQWRkIGFsbCBtdXRhdG9yIEFycmF5IGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlci5cbiAgZWFjaChbJ3BvcCcsICdwdXNoJywgJ3JldmVyc2UnLCAnc2hpZnQnLCAnc29ydCcsICdzcGxpY2UnLCAndW5zaGlmdCddLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIG1ldGhvZCA9IEFycmF5UHJvdG9bbmFtZV07XG4gICAgXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvYmogPSB0aGlzLl93cmFwcGVkO1xuICAgICAgbWV0aG9kLmFwcGx5KG9iaiwgYXJndW1lbnRzKTtcbiAgICAgIGlmICgobmFtZSA9PSAnc2hpZnQnIHx8IG5hbWUgPT0gJ3NwbGljZScpICYmIG9iai5sZW5ndGggPT09IDApIGRlbGV0ZSBvYmpbMF07XG4gICAgICByZXR1cm4gcmVzdWx0LmNhbGwodGhpcywgb2JqKTtcbiAgICB9O1xuICB9KTtcblxuICAvLyBBZGQgYWxsIGFjY2Vzc29yIEFycmF5IGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlci5cbiAgZWFjaChbJ2NvbmNhdCcsICdqb2luJywgJ3NsaWNlJ10sIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgbWV0aG9kID0gQXJyYXlQcm90b1tuYW1lXTtcbiAgICBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHJlc3VsdC5jYWxsKHRoaXMsIG1ldGhvZC5hcHBseSh0aGlzLl93cmFwcGVkLCBhcmd1bWVudHMpKTtcbiAgICB9O1xuICB9KTtcblxuICBfLmV4dGVuZChfLnByb3RvdHlwZSwge1xuXG4gICAgLy8gU3RhcnQgY2hhaW5pbmcgYSB3cmFwcGVkIFVuZGVyc2NvcmUgb2JqZWN0LlxuICAgIGNoYWluOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuX2NoYWluID0gdHJ1ZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvLyBFeHRyYWN0cyB0aGUgcmVzdWx0IGZyb20gYSB3cmFwcGVkIGFuZCBjaGFpbmVkIG9iamVjdC5cbiAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fd3JhcHBlZDtcbiAgICB9XG5cbiAgfSk7XG5cbiAgLy8gQU1EIHJlZ2lzdHJhdGlvbiBoYXBwZW5zIGF0IHRoZSBlbmQgZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBBTUQgbG9hZGVyc1xuICAvLyB0aGF0IG1heSBub3QgZW5mb3JjZSBuZXh0LXR1cm4gc2VtYW50aWNzIG9uIG1vZHVsZXMuIEV2ZW4gdGhvdWdoIGdlbmVyYWxcbiAgLy8gcHJhY3RpY2UgZm9yIEFNRCByZWdpc3RyYXRpb24gaXMgdG8gYmUgYW5vbnltb3VzLCB1bmRlcnNjb3JlIHJlZ2lzdGVyc1xuICAvLyBhcyBhIG5hbWVkIG1vZHVsZSBiZWNhdXNlLCBsaWtlIGpRdWVyeSwgaXQgaXMgYSBiYXNlIGxpYnJhcnkgdGhhdCBpc1xuICAvLyBwb3B1bGFyIGVub3VnaCB0byBiZSBidW5kbGVkIGluIGEgdGhpcmQgcGFydHkgbGliLCBidXQgbm90IGJlIHBhcnQgb2ZcbiAgLy8gYW4gQU1EIGxvYWQgcmVxdWVzdC4gVGhvc2UgY2FzZXMgY291bGQgZ2VuZXJhdGUgYW4gZXJyb3Igd2hlbiBhblxuICAvLyBhbm9ueW1vdXMgZGVmaW5lKCkgaXMgY2FsbGVkIG91dHNpZGUgb2YgYSBsb2FkZXIgcmVxdWVzdC5cbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZSgndW5kZXJzY29yZScsIFtdLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBfO1xuICAgIH0pO1xuICB9XG59KS5jYWxsKHRoaXMpO1xuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbnZhciBvYmplY3RDcmVhdGUgPSBPYmplY3QuY3JlYXRlIHx8IG9iamVjdENyZWF0ZVBvbHlmaWxsXG52YXIgb2JqZWN0S2V5cyA9IE9iamVjdC5rZXlzIHx8IG9iamVjdEtleXNQb2x5ZmlsbFxudmFyIGJpbmQgPSBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCB8fCBmdW5jdGlvbkJpbmRQb2x5ZmlsbFxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodGhpcywgJ19ldmVudHMnKSkge1xuICAgIHRoaXMuX2V2ZW50cyA9IG9iamVjdENyZWF0ZShudWxsKTtcbiAgICB0aGlzLl9ldmVudHNDb3VudCA9IDA7XG4gIH1cblxuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG52YXIgZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG52YXIgaGFzRGVmaW5lUHJvcGVydHk7XG50cnkge1xuICB2YXIgbyA9IHt9O1xuICBpZiAoT2JqZWN0LmRlZmluZVByb3BlcnR5KSBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgJ3gnLCB7IHZhbHVlOiAwIH0pO1xuICBoYXNEZWZpbmVQcm9wZXJ0eSA9IG8ueCA9PT0gMDtcbn0gY2F0Y2ggKGVycikgeyBoYXNEZWZpbmVQcm9wZXJ0eSA9IGZhbHNlIH1cbmlmIChoYXNEZWZpbmVQcm9wZXJ0eSkge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRXZlbnRFbWl0dGVyLCAnZGVmYXVsdE1heExpc3RlbmVycycsIHtcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZGVmYXVsdE1heExpc3RlbmVycztcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24oYXJnKSB7XG4gICAgICAvLyBjaGVjayB3aGV0aGVyIHRoZSBpbnB1dCBpcyBhIHBvc2l0aXZlIG51bWJlciAod2hvc2UgdmFsdWUgaXMgemVybyBvclxuICAgICAgLy8gZ3JlYXRlciBhbmQgbm90IGEgTmFOKS5cbiAgICAgIGlmICh0eXBlb2YgYXJnICE9PSAnbnVtYmVyJyB8fCBhcmcgPCAwIHx8IGFyZyAhPT0gYXJnKVxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImRlZmF1bHRNYXhMaXN0ZW5lcnNcIiBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyJyk7XG4gICAgICBkZWZhdWx0TWF4TGlzdGVuZXJzID0gYXJnO1xuICAgIH1cbiAgfSk7XG59IGVsc2Uge1xuICBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IGRlZmF1bHRNYXhMaXN0ZW5lcnM7XG59XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uIHNldE1heExpc3RlbmVycyhuKSB7XG4gIGlmICh0eXBlb2YgbiAhPT0gJ251bWJlcicgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJuXCIgYXJndW1lbnQgbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbmZ1bmN0aW9uICRnZXRNYXhMaXN0ZW5lcnModGhhdCkge1xuICBpZiAodGhhdC5fbWF4TGlzdGVuZXJzID09PSB1bmRlZmluZWQpXG4gICAgcmV0dXJuIEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICByZXR1cm4gdGhhdC5fbWF4TGlzdGVuZXJzO1xufVxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmdldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uIGdldE1heExpc3RlbmVycygpIHtcbiAgcmV0dXJuICRnZXRNYXhMaXN0ZW5lcnModGhpcyk7XG59O1xuXG4vLyBUaGVzZSBzdGFuZGFsb25lIGVtaXQqIGZ1bmN0aW9ucyBhcmUgdXNlZCB0byBvcHRpbWl6ZSBjYWxsaW5nIG9mIGV2ZW50XG4vLyBoYW5kbGVycyBmb3IgZmFzdCBjYXNlcyBiZWNhdXNlIGVtaXQoKSBpdHNlbGYgb2Z0ZW4gaGFzIGEgdmFyaWFibGUgbnVtYmVyIG9mXG4vLyBhcmd1bWVudHMgYW5kIGNhbiBiZSBkZW9wdGltaXplZCBiZWNhdXNlIG9mIHRoYXQuIFRoZXNlIGZ1bmN0aW9ucyBhbHdheXMgaGF2ZVxuLy8gdGhlIHNhbWUgbnVtYmVyIG9mIGFyZ3VtZW50cyBhbmQgdGh1cyBkbyBub3QgZ2V0IGRlb3B0aW1pemVkLCBzbyB0aGUgY29kZVxuLy8gaW5zaWRlIHRoZW0gY2FuIGV4ZWN1dGUgZmFzdGVyLlxuZnVuY3Rpb24gZW1pdE5vbmUoaGFuZGxlciwgaXNGbiwgc2VsZikge1xuICBpZiAoaXNGbilcbiAgICBoYW5kbGVyLmNhbGwoc2VsZik7XG4gIGVsc2Uge1xuICAgIHZhciBsZW4gPSBoYW5kbGVyLmxlbmd0aDtcbiAgICB2YXIgbGlzdGVuZXJzID0gYXJyYXlDbG9uZShoYW5kbGVyLCBsZW4pO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpXG4gICAgICBsaXN0ZW5lcnNbaV0uY2FsbChzZWxmKTtcbiAgfVxufVxuZnVuY3Rpb24gZW1pdE9uZShoYW5kbGVyLCBpc0ZuLCBzZWxmLCBhcmcxKSB7XG4gIGlmIChpc0ZuKVxuICAgIGhhbmRsZXIuY2FsbChzZWxmLCBhcmcxKTtcbiAgZWxzZSB7XG4gICAgdmFyIGxlbiA9IGhhbmRsZXIubGVuZ3RoO1xuICAgIHZhciBsaXN0ZW5lcnMgPSBhcnJheUNsb25lKGhhbmRsZXIsIGxlbik7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSlcbiAgICAgIGxpc3RlbmVyc1tpXS5jYWxsKHNlbGYsIGFyZzEpO1xuICB9XG59XG5mdW5jdGlvbiBlbWl0VHdvKGhhbmRsZXIsIGlzRm4sIHNlbGYsIGFyZzEsIGFyZzIpIHtcbiAgaWYgKGlzRm4pXG4gICAgaGFuZGxlci5jYWxsKHNlbGYsIGFyZzEsIGFyZzIpO1xuICBlbHNlIHtcbiAgICB2YXIgbGVuID0gaGFuZGxlci5sZW5ndGg7XG4gICAgdmFyIGxpc3RlbmVycyA9IGFycmF5Q2xvbmUoaGFuZGxlciwgbGVuKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKVxuICAgICAgbGlzdGVuZXJzW2ldLmNhbGwoc2VsZiwgYXJnMSwgYXJnMik7XG4gIH1cbn1cbmZ1bmN0aW9uIGVtaXRUaHJlZShoYW5kbGVyLCBpc0ZuLCBzZWxmLCBhcmcxLCBhcmcyLCBhcmczKSB7XG4gIGlmIChpc0ZuKVxuICAgIGhhbmRsZXIuY2FsbChzZWxmLCBhcmcxLCBhcmcyLCBhcmczKTtcbiAgZWxzZSB7XG4gICAgdmFyIGxlbiA9IGhhbmRsZXIubGVuZ3RoO1xuICAgIHZhciBsaXN0ZW5lcnMgPSBhcnJheUNsb25lKGhhbmRsZXIsIGxlbik7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSlcbiAgICAgIGxpc3RlbmVyc1tpXS5jYWxsKHNlbGYsIGFyZzEsIGFyZzIsIGFyZzMpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGVtaXRNYW55KGhhbmRsZXIsIGlzRm4sIHNlbGYsIGFyZ3MpIHtcbiAgaWYgKGlzRm4pXG4gICAgaGFuZGxlci5hcHBseShzZWxmLCBhcmdzKTtcbiAgZWxzZSB7XG4gICAgdmFyIGxlbiA9IGhhbmRsZXIubGVuZ3RoO1xuICAgIHZhciBsaXN0ZW5lcnMgPSBhcnJheUNsb25lKGhhbmRsZXIsIGxlbik7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSlcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseShzZWxmLCBhcmdzKTtcbiAgfVxufVxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbiBlbWl0KHR5cGUpIHtcbiAgdmFyIGVyLCBoYW5kbGVyLCBsZW4sIGFyZ3MsIGksIGV2ZW50cztcbiAgdmFyIGRvRXJyb3IgPSAodHlwZSA9PT0gJ2Vycm9yJyk7XG5cbiAgZXZlbnRzID0gdGhpcy5fZXZlbnRzO1xuICBpZiAoZXZlbnRzKVxuICAgIGRvRXJyb3IgPSAoZG9FcnJvciAmJiBldmVudHMuZXJyb3IgPT0gbnVsbCk7XG4gIGVsc2UgaWYgKCFkb0Vycm9yKVxuICAgIHJldHVybiBmYWxzZTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmIChkb0Vycm9yKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKVxuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBBdCBsZWFzdCBnaXZlIHNvbWUga2luZCBvZiBjb250ZXh0IHRvIHRoZSB1c2VyXG4gICAgICB2YXIgZXJyID0gbmV3IEVycm9yKCdVbmhhbmRsZWQgXCJlcnJvclwiIGV2ZW50LiAoJyArIGVyICsgJyknKTtcbiAgICAgIGVyci5jb250ZXh0ID0gZXI7XG4gICAgICB0aHJvdyBlcnI7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGhhbmRsZXIgPSBldmVudHNbdHlwZV07XG5cbiAgaWYgKCFoYW5kbGVyKVxuICAgIHJldHVybiBmYWxzZTtcblxuICB2YXIgaXNGbiA9IHR5cGVvZiBoYW5kbGVyID09PSAnZnVuY3Rpb24nO1xuICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICBzd2l0Y2ggKGxlbikge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgIGNhc2UgMTpcbiAgICAgIGVtaXROb25lKGhhbmRsZXIsIGlzRm4sIHRoaXMpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAyOlxuICAgICAgZW1pdE9uZShoYW5kbGVyLCBpc0ZuLCB0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAzOlxuICAgICAgZW1pdFR3byhoYW5kbGVyLCBpc0ZuLCB0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDQ6XG4gICAgICBlbWl0VGhyZWUoaGFuZGxlciwgaXNGbiwgdGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0sIGFyZ3VtZW50c1szXSk7XG4gICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgIGRlZmF1bHQ6XG4gICAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgIGVtaXRNYW55KGhhbmRsZXIsIGlzRm4sIHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5mdW5jdGlvbiBfYWRkTGlzdGVuZXIodGFyZ2V0LCB0eXBlLCBsaXN0ZW5lciwgcHJlcGVuZCkge1xuICB2YXIgbTtcbiAgdmFyIGV2ZW50cztcbiAgdmFyIGV4aXN0aW5nO1xuXG4gIGlmICh0eXBlb2YgbGlzdGVuZXIgIT09ICdmdW5jdGlvbicpXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJsaXN0ZW5lclwiIGFyZ3VtZW50IG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGV2ZW50cyA9IHRhcmdldC5fZXZlbnRzO1xuICBpZiAoIWV2ZW50cykge1xuICAgIGV2ZW50cyA9IHRhcmdldC5fZXZlbnRzID0gb2JqZWN0Q3JlYXRlKG51bGwpO1xuICAgIHRhcmdldC5fZXZlbnRzQ291bnQgPSAwO1xuICB9IGVsc2Uge1xuICAgIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gICAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICAgIGlmIChldmVudHMubmV3TGlzdGVuZXIpIHtcbiAgICAgIHRhcmdldC5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgPyBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICAgICAgLy8gUmUtYXNzaWduIGBldmVudHNgIGJlY2F1c2UgYSBuZXdMaXN0ZW5lciBoYW5kbGVyIGNvdWxkIGhhdmUgY2F1c2VkIHRoZVxuICAgICAgLy8gdGhpcy5fZXZlbnRzIHRvIGJlIGFzc2lnbmVkIHRvIGEgbmV3IG9iamVjdFxuICAgICAgZXZlbnRzID0gdGFyZ2V0Ll9ldmVudHM7XG4gICAgfVxuICAgIGV4aXN0aW5nID0gZXZlbnRzW3R5cGVdO1xuICB9XG5cbiAgaWYgKCFleGlzdGluZykge1xuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIGV4aXN0aW5nID0gZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gICAgKyt0YXJnZXQuX2V2ZW50c0NvdW50O1xuICB9IGVsc2Uge1xuICAgIGlmICh0eXBlb2YgZXhpc3RpbmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgICAgZXhpc3RpbmcgPSBldmVudHNbdHlwZV0gPVxuICAgICAgICAgIHByZXBlbmQgPyBbbGlzdGVuZXIsIGV4aXN0aW5nXSA6IFtleGlzdGluZywgbGlzdGVuZXJdO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgICBpZiAocHJlcGVuZCkge1xuICAgICAgICBleGlzdGluZy51bnNoaWZ0KGxpc3RlbmVyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGV4aXN0aW5nLnB1c2gobGlzdGVuZXIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gICAgaWYgKCFleGlzdGluZy53YXJuZWQpIHtcbiAgICAgIG0gPSAkZ2V0TWF4TGlzdGVuZXJzKHRhcmdldCk7XG4gICAgICBpZiAobSAmJiBtID4gMCAmJiBleGlzdGluZy5sZW5ndGggPiBtKSB7XG4gICAgICAgIGV4aXN0aW5nLndhcm5lZCA9IHRydWU7XG4gICAgICAgIHZhciB3ID0gbmV3IEVycm9yKCdQb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5IGxlYWsgZGV0ZWN0ZWQuICcgK1xuICAgICAgICAgICAgZXhpc3RpbmcubGVuZ3RoICsgJyBcIicgKyBTdHJpbmcodHlwZSkgKyAnXCIgbGlzdGVuZXJzICcgK1xuICAgICAgICAgICAgJ2FkZGVkLiBVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byAnICtcbiAgICAgICAgICAgICdpbmNyZWFzZSBsaW1pdC4nKTtcbiAgICAgICAgdy5uYW1lID0gJ01heExpc3RlbmVyc0V4Y2VlZGVkV2FybmluZyc7XG4gICAgICAgIHcuZW1pdHRlciA9IHRhcmdldDtcbiAgICAgICAgdy50eXBlID0gdHlwZTtcbiAgICAgICAgdy5jb3VudCA9IGV4aXN0aW5nLmxlbmd0aDtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlID09PSAnb2JqZWN0JyAmJiBjb25zb2xlLndhcm4pIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oJyVzOiAlcycsIHcubmFtZSwgdy5tZXNzYWdlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbiBhZGRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcikge1xuICByZXR1cm4gX2FkZExpc3RlbmVyKHRoaXMsIHR5cGUsIGxpc3RlbmVyLCBmYWxzZSk7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5wcmVwZW5kTGlzdGVuZXIgPVxuICAgIGZ1bmN0aW9uIHByZXBlbmRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcikge1xuICAgICAgcmV0dXJuIF9hZGRMaXN0ZW5lcih0aGlzLCB0eXBlLCBsaXN0ZW5lciwgdHJ1ZSk7XG4gICAgfTtcblxuZnVuY3Rpb24gb25jZVdyYXBwZXIoKSB7XG4gIGlmICghdGhpcy5maXJlZCkge1xuICAgIHRoaXMudGFyZ2V0LnJlbW92ZUxpc3RlbmVyKHRoaXMudHlwZSwgdGhpcy53cmFwRm4pO1xuICAgIHRoaXMuZmlyZWQgPSB0cnVlO1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICByZXR1cm4gdGhpcy5saXN0ZW5lci5jYWxsKHRoaXMudGFyZ2V0KTtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgcmV0dXJuIHRoaXMubGlzdGVuZXIuY2FsbCh0aGlzLnRhcmdldCwgYXJndW1lbnRzWzBdKTtcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgcmV0dXJuIHRoaXMubGlzdGVuZXIuY2FsbCh0aGlzLnRhcmdldCwgYXJndW1lbnRzWzBdLCBhcmd1bWVudHNbMV0pO1xuICAgICAgY2FzZSAzOlxuICAgICAgICByZXR1cm4gdGhpcy5saXN0ZW5lci5jYWxsKHRoaXMudGFyZ2V0LCBhcmd1bWVudHNbMF0sIGFyZ3VtZW50c1sxXSxcbiAgICAgICAgICAgIGFyZ3VtZW50c1syXSk7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgKytpKVxuICAgICAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIHRoaXMubGlzdGVuZXIuYXBwbHkodGhpcy50YXJnZXQsIGFyZ3MpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBfb25jZVdyYXAodGFyZ2V0LCB0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgc3RhdGUgPSB7IGZpcmVkOiBmYWxzZSwgd3JhcEZuOiB1bmRlZmluZWQsIHRhcmdldDogdGFyZ2V0LCB0eXBlOiB0eXBlLCBsaXN0ZW5lcjogbGlzdGVuZXIgfTtcbiAgdmFyIHdyYXBwZWQgPSBiaW5kLmNhbGwob25jZVdyYXBwZXIsIHN0YXRlKTtcbiAgd3JhcHBlZC5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICBzdGF0ZS53cmFwRm4gPSB3cmFwcGVkO1xuICByZXR1cm4gd3JhcHBlZDtcbn1cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24gb25jZSh0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAodHlwZW9mIGxpc3RlbmVyICE9PSAnZnVuY3Rpb24nKVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wibGlzdGVuZXJcIiBhcmd1bWVudCBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcbiAgdGhpcy5vbih0eXBlLCBfb25jZVdyYXAodGhpcywgdHlwZSwgbGlzdGVuZXIpKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnByZXBlbmRPbmNlTGlzdGVuZXIgPVxuICAgIGZ1bmN0aW9uIHByZXBlbmRPbmNlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgIGlmICh0eXBlb2YgbGlzdGVuZXIgIT09ICdmdW5jdGlvbicpXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wibGlzdGVuZXJcIiBhcmd1bWVudCBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcbiAgICAgIHRoaXMucHJlcGVuZExpc3RlbmVyKHR5cGUsIF9vbmNlV3JhcCh0aGlzLCB0eXBlLCBsaXN0ZW5lcikpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuLy8gRW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmIGFuZCBvbmx5IGlmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPVxuICAgIGZ1bmN0aW9uIHJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgICB2YXIgbGlzdCwgZXZlbnRzLCBwb3NpdGlvbiwgaSwgb3JpZ2luYWxMaXN0ZW5lcjtcblxuICAgICAgaWYgKHR5cGVvZiBsaXN0ZW5lciAhPT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJsaXN0ZW5lclwiIGFyZ3VtZW50IG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gICAgICBldmVudHMgPSB0aGlzLl9ldmVudHM7XG4gICAgICBpZiAoIWV2ZW50cylcbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAgIGxpc3QgPSBldmVudHNbdHlwZV07XG4gICAgICBpZiAoIWxpc3QpXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHwgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpIHtcbiAgICAgICAgaWYgKC0tdGhpcy5fZXZlbnRzQ291bnQgPT09IDApXG4gICAgICAgICAgdGhpcy5fZXZlbnRzID0gb2JqZWN0Q3JlYXRlKG51bGwpO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBkZWxldGUgZXZlbnRzW3R5cGVdO1xuICAgICAgICAgIGlmIChldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICAgICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdC5saXN0ZW5lciB8fCBsaXN0ZW5lcik7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGxpc3QgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcG9zaXRpb24gPSAtMTtcblxuICAgICAgICBmb3IgKGkgPSBsaXN0Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8IGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSB7XG4gICAgICAgICAgICBvcmlnaW5hbExpc3RlbmVyID0gbGlzdFtpXS5saXN0ZW5lcjtcbiAgICAgICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAgICAgaWYgKHBvc2l0aW9uID09PSAwKVxuICAgICAgICAgIGxpc3Quc2hpZnQoKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHNwbGljZU9uZShsaXN0LCBwb3NpdGlvbik7XG5cbiAgICAgICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKVxuICAgICAgICAgIGV2ZW50c1t0eXBlXSA9IGxpc3RbMF07XG5cbiAgICAgICAgaWYgKGV2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgb3JpZ2luYWxMaXN0ZW5lciB8fCBsaXN0ZW5lcik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID1cbiAgICBmdW5jdGlvbiByZW1vdmVBbGxMaXN0ZW5lcnModHlwZSkge1xuICAgICAgdmFyIGxpc3RlbmVycywgZXZlbnRzLCBpO1xuXG4gICAgICBldmVudHMgPSB0aGlzLl9ldmVudHM7XG4gICAgICBpZiAoIWV2ZW50cylcbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAgIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgICAgIGlmICghZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgdGhpcy5fZXZlbnRzID0gb2JqZWN0Q3JlYXRlKG51bGwpO1xuICAgICAgICAgIHRoaXMuX2V2ZW50c0NvdW50ID0gMDtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudHNbdHlwZV0pIHtcbiAgICAgICAgICBpZiAoLS10aGlzLl9ldmVudHNDb3VudCA9PT0gMClcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50cyA9IG9iamVjdENyZWF0ZShudWxsKTtcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBkZWxldGUgZXZlbnRzW3R5cGVdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHZhciBrZXlzID0gb2JqZWN0S2V5cyhldmVudHMpO1xuICAgICAgICB2YXIga2V5O1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgIGtleSA9IGtleXNbaV07XG4gICAgICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICAgICAgdGhpcy5fZXZlbnRzID0gb2JqZWN0Q3JlYXRlKG51bGwpO1xuICAgICAgICB0aGlzLl9ldmVudHNDb3VudCA9IDA7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICBsaXN0ZW5lcnMgPSBldmVudHNbdHlwZV07XG5cbiAgICAgIGlmICh0eXBlb2YgbGlzdGVuZXJzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgICAgIH0gZWxzZSBpZiAobGlzdGVuZXJzKSB7XG4gICAgICAgIC8vIExJRk8gb3JkZXJcbiAgICAgICAgZm9yIChpID0gbGlzdGVuZXJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbaV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbmZ1bmN0aW9uIF9saXN0ZW5lcnModGFyZ2V0LCB0eXBlLCB1bndyYXApIHtcbiAgdmFyIGV2ZW50cyA9IHRhcmdldC5fZXZlbnRzO1xuXG4gIGlmICghZXZlbnRzKVxuICAgIHJldHVybiBbXTtcblxuICB2YXIgZXZsaXN0ZW5lciA9IGV2ZW50c1t0eXBlXTtcbiAgaWYgKCFldmxpc3RlbmVyKVxuICAgIHJldHVybiBbXTtcblxuICBpZiAodHlwZW9mIGV2bGlzdGVuZXIgPT09ICdmdW5jdGlvbicpXG4gICAgcmV0dXJuIHVud3JhcCA/IFtldmxpc3RlbmVyLmxpc3RlbmVyIHx8IGV2bGlzdGVuZXJdIDogW2V2bGlzdGVuZXJdO1xuXG4gIHJldHVybiB1bndyYXAgPyB1bndyYXBMaXN0ZW5lcnMoZXZsaXN0ZW5lcikgOiBhcnJheUNsb25lKGV2bGlzdGVuZXIsIGV2bGlzdGVuZXIubGVuZ3RoKTtcbn1cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbiBsaXN0ZW5lcnModHlwZSkge1xuICByZXR1cm4gX2xpc3RlbmVycyh0aGlzLCB0eXBlLCB0cnVlKTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmF3TGlzdGVuZXJzID0gZnVuY3Rpb24gcmF3TGlzdGVuZXJzKHR5cGUpIHtcbiAgcmV0dXJuIF9saXN0ZW5lcnModGhpcywgdHlwZSwgZmFsc2UpO1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIGlmICh0eXBlb2YgZW1pdHRlci5saXN0ZW5lckNvdW50ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGVtaXR0ZXIubGlzdGVuZXJDb3VudCh0eXBlKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbGlzdGVuZXJDb3VudC5jYWxsKGVtaXR0ZXIsIHR5cGUpO1xuICB9XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVyQ291bnQgPSBsaXN0ZW5lckNvdW50O1xuZnVuY3Rpb24gbGlzdGVuZXJDb3VudCh0eXBlKSB7XG4gIHZhciBldmVudHMgPSB0aGlzLl9ldmVudHM7XG5cbiAgaWYgKGV2ZW50cykge1xuICAgIHZhciBldmxpc3RlbmVyID0gZXZlbnRzW3R5cGVdO1xuXG4gICAgaWYgKHR5cGVvZiBldmxpc3RlbmVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gMTtcbiAgICB9IGVsc2UgaWYgKGV2bGlzdGVuZXIpIHtcbiAgICAgIHJldHVybiBldmxpc3RlbmVyLmxlbmd0aDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gMDtcbn1cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5ldmVudE5hbWVzID0gZnVuY3Rpb24gZXZlbnROYW1lcygpIHtcbiAgcmV0dXJuIHRoaXMuX2V2ZW50c0NvdW50ID4gMCA/IFJlZmxlY3Qub3duS2V5cyh0aGlzLl9ldmVudHMpIDogW107XG59O1xuXG4vLyBBYm91dCAxLjV4IGZhc3RlciB0aGFuIHRoZSB0d28tYXJnIHZlcnNpb24gb2YgQXJyYXkjc3BsaWNlKCkuXG5mdW5jdGlvbiBzcGxpY2VPbmUobGlzdCwgaW5kZXgpIHtcbiAgZm9yICh2YXIgaSA9IGluZGV4LCBrID0gaSArIDEsIG4gPSBsaXN0Lmxlbmd0aDsgayA8IG47IGkgKz0gMSwgayArPSAxKVxuICAgIGxpc3RbaV0gPSBsaXN0W2tdO1xuICBsaXN0LnBvcCgpO1xufVxuXG5mdW5jdGlvbiBhcnJheUNsb25lKGFyciwgbikge1xuICB2YXIgY29weSA9IG5ldyBBcnJheShuKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBuOyArK2kpXG4gICAgY29weVtpXSA9IGFycltpXTtcbiAgcmV0dXJuIGNvcHk7XG59XG5cbmZ1bmN0aW9uIHVud3JhcExpc3RlbmVycyhhcnIpIHtcbiAgdmFyIHJldCA9IG5ldyBBcnJheShhcnIubGVuZ3RoKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXQubGVuZ3RoOyArK2kpIHtcbiAgICByZXRbaV0gPSBhcnJbaV0ubGlzdGVuZXIgfHwgYXJyW2ldO1xuICB9XG4gIHJldHVybiByZXQ7XG59XG5cbmZ1bmN0aW9uIG9iamVjdENyZWF0ZVBvbHlmaWxsKHByb3RvKSB7XG4gIHZhciBGID0gZnVuY3Rpb24oKSB7fTtcbiAgRi5wcm90b3R5cGUgPSBwcm90bztcbiAgcmV0dXJuIG5ldyBGO1xufVxuZnVuY3Rpb24gb2JqZWN0S2V5c1BvbHlmaWxsKG9iaikge1xuICB2YXIga2V5cyA9IFtdO1xuICBmb3IgKHZhciBrIGluIG9iaikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGspKSB7XG4gICAga2V5cy5wdXNoKGspO1xuICB9XG4gIHJldHVybiBrO1xufVxuZnVuY3Rpb24gZnVuY3Rpb25CaW5kUG9seWZpbGwoY29udGV4dCkge1xuICB2YXIgZm4gPSB0aGlzO1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBmbi5hcHBseShjb250ZXh0LCBhcmd1bWVudHMpO1xuICB9O1xufVxuIiwiLyohIEhhbW1lci5KUyAtIHYxLjAuN2RldiAtIDIwMTQtMDItMThcclxuICogaHR0cDovL2VpZ2h0bWVkaWEuZ2l0aHViLmNvbS9oYW1tZXIuanNcclxuICpcclxuICogQ29weXJpZ2h0IChjKSAyMDE0IEpvcmlrIFRhbmdlbGRlciA8ai50YW5nZWxkZXJAZ21haWwuY29tPjtcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlICovXHJcblxyXG4oZnVuY3Rpb24od2luZG93LCB1bmRlZmluZWQpIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4vKipcclxuICogSGFtbWVyXHJcbiAqIHVzZSB0aGlzIHRvIGNyZWF0ZSBpbnN0YW5jZXNcclxuICogQHBhcmFtICAge0hUTUxFbGVtZW50fSAgIGVsZW1lbnRcclxuICogQHBhcmFtICAge09iamVjdH0gICAgICAgIG9wdGlvbnNcclxuICogQHJldHVybnMge0hhbW1lci5JbnN0YW5jZX1cclxuICogQGNvbnN0cnVjdG9yXHJcbiAqL1xyXG52YXIgSGFtbWVyID0gZnVuY3Rpb24oZWxlbWVudCwgb3B0aW9ucykge1xyXG4gIHJldHVybiBuZXcgSGFtbWVyLkluc3RhbmNlKGVsZW1lbnQsIG9wdGlvbnMgfHwge30pO1xyXG59O1xyXG5cclxuLy8gZGVmYXVsdCBzZXR0aW5nc1xyXG5IYW1tZXIuZGVmYXVsdHMgPSB7XHJcbiAgLy8gYWRkIHN0eWxlcyBhbmQgYXR0cmlidXRlcyB0byB0aGUgZWxlbWVudCB0byBwcmV2ZW50IHRoZSBicm93c2VyIGZyb20gZG9pbmdcclxuICAvLyBpdHMgbmF0aXZlIGJlaGF2aW9yLiB0aGlzIGRvZXNudCBwcmV2ZW50IHRoZSBzY3JvbGxpbmcsIGJ1dCBjYW5jZWxzXHJcbiAgLy8gdGhlIGNvbnRleHRtZW51LCB0YXAgaGlnaGxpZ2h0aW5nIGV0Y1xyXG4gIC8vIHNldCB0byBmYWxzZSB0byBkaXNhYmxlIHRoaXNcclxuICBzdG9wX2Jyb3dzZXJfYmVoYXZpb3I6IHtcclxuICAgIC8vIHRoaXMgYWxzbyB0cmlnZ2VycyBvbnNlbGVjdHN0YXJ0PWZhbHNlIGZvciBJRVxyXG4gICAgdXNlclNlbGVjdCAgICAgICA6ICdub25lJyxcclxuICAgIC8vIHRoaXMgbWFrZXMgdGhlIGVsZW1lbnQgYmxvY2tpbmcgaW4gSUUxMCA+LCB5b3UgY291bGQgZXhwZXJpbWVudCB3aXRoIHRoZSB2YWx1ZVxyXG4gICAgLy8gc2VlIGZvciBtb3JlIG9wdGlvbnMgdGhpcyBpc3N1ZTsgaHR0cHM6Ly9naXRodWIuY29tL0VpZ2h0TWVkaWEvaGFtbWVyLmpzL2lzc3Vlcy8yNDFcclxuICAgIHRvdWNoQWN0aW9uICAgICAgOiAnbm9uZScsXHJcbiAgICB0b3VjaENhbGxvdXQgICAgIDogJ25vbmUnLFxyXG4gICAgY29udGVudFpvb21pbmcgICA6ICdub25lJyxcclxuICAgIHVzZXJEcmFnICAgICAgICAgOiAnbm9uZScsXHJcbiAgICB0YXBIaWdobGlnaHRDb2xvcjogJ3JnYmEoMCwwLDAsMCknXHJcbiAgfVxyXG5cclxuICAvL1xyXG4gIC8vIG1vcmUgc2V0dGluZ3MgYXJlIGRlZmluZWQgcGVyIGdlc3R1cmUgYXQgZ2VzdHVyZXMuanNcclxuICAvL1xyXG59O1xyXG5cclxuLy8gZGV0ZWN0IHRvdWNoZXZlbnRzXHJcbkhhbW1lci5IQVNfUE9JTlRFUkVWRU5UUyA9IHdpbmRvdy5uYXZpZ2F0b3IucG9pbnRlckVuYWJsZWQgfHwgd2luZG93Lm5hdmlnYXRvci5tc1BvaW50ZXJFbmFibGVkO1xyXG5IYW1tZXIuSEFTX1RPVUNIRVZFTlRTID0gKCdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyk7XHJcblxyXG4vLyBkb250IHVzZSBtb3VzZWV2ZW50cyBvbiBtb2JpbGUgZGV2aWNlc1xyXG5IYW1tZXIuTU9CSUxFX1JFR0VYID0gL21vYmlsZXx0YWJsZXR8aXAoYWR8aG9uZXxvZCl8YW5kcm9pZHxzaWxrL2k7XHJcbkhhbW1lci5OT19NT1VTRUVWRU5UUyA9IEhhbW1lci5IQVNfVE9VQ0hFVkVOVFMgJiYgd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goSGFtbWVyLk1PQklMRV9SRUdFWCk7XHJcblxyXG4vLyBldmVudHR5cGVzIHBlciB0b3VjaGV2ZW50IChzdGFydCwgbW92ZSwgZW5kKVxyXG4vLyBhcmUgZmlsbGVkIGJ5IEhhbW1lci5ldmVudC5kZXRlcm1pbmVFdmVudFR5cGVzIG9uIHNldHVwXHJcbkhhbW1lci5FVkVOVF9UWVBFUyA9IHt9O1xyXG5cclxuLy8gZGlyZWN0aW9uIGRlZmluZXNcclxuSGFtbWVyLkRJUkVDVElPTl9ET1dOID0gJ2Rvd24nO1xyXG5IYW1tZXIuRElSRUNUSU9OX0xFRlQgPSAnbGVmdCc7XHJcbkhhbW1lci5ESVJFQ1RJT05fVVAgPSAndXAnO1xyXG5IYW1tZXIuRElSRUNUSU9OX1JJR0hUID0gJ3JpZ2h0JztcclxuXHJcbi8vIHBvaW50ZXIgdHlwZVxyXG5IYW1tZXIuUE9JTlRFUl9NT1VTRSA9ICdtb3VzZSc7XHJcbkhhbW1lci5QT0lOVEVSX1RPVUNIID0gJ3RvdWNoJztcclxuSGFtbWVyLlBPSU5URVJfUEVOID0gJ3Blbic7XHJcblxyXG4vLyBpbnRlcnZhbCBpbiB3aGljaCBIYW1tZXIgcmVjYWxjdWxhdGVzIGN1cnJlbnQgdmVsb2NpdHkgaW4gbXNcclxuSGFtbWVyLlVQREFURV9WRUxPQ0lUWV9JTlRFUlZBTCA9IDIwO1xyXG5cclxuLy8gdG91Y2ggZXZlbnQgZGVmaW5lc1xyXG5IYW1tZXIuRVZFTlRfU1RBUlQgPSAnc3RhcnQnO1xyXG5IYW1tZXIuRVZFTlRfTU9WRSA9ICdtb3ZlJztcclxuSGFtbWVyLkVWRU5UX0VORCA9ICdlbmQnO1xyXG5cclxuLy8gaGFtbWVyIGRvY3VtZW50IHdoZXJlIHRoZSBiYXNlIGV2ZW50cyBhcmUgYWRkZWQgYXRcclxuSGFtbWVyLkRPQ1VNRU5UID0gd2luZG93LmRvY3VtZW50O1xyXG5cclxuLy8gcGx1Z2lucyBhbmQgZ2VzdHVyZXMgbmFtZXNwYWNlc1xyXG5IYW1tZXIucGx1Z2lucyA9IEhhbW1lci5wbHVnaW5zIHx8IHt9O1xyXG5IYW1tZXIuZ2VzdHVyZXMgPSBIYW1tZXIuZ2VzdHVyZXMgfHwge307XHJcblxyXG5cclxuLy8gaWYgdGhlIHdpbmRvdyBldmVudHMgYXJlIHNldC4uLlxyXG5IYW1tZXIuUkVBRFkgPSBmYWxzZTtcclxuXHJcbi8qKlxyXG4gKiBzZXR1cCBldmVudHMgdG8gZGV0ZWN0IGdlc3R1cmVzIG9uIHRoZSBkb2N1bWVudFxyXG4gKi9cclxuZnVuY3Rpb24gc2V0dXAoKSB7XHJcbiAgaWYoSGFtbWVyLlJFQURZKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICAvLyBmaW5kIHdoYXQgZXZlbnR0eXBlcyB3ZSBhZGQgbGlzdGVuZXJzIHRvXHJcbiAgSGFtbWVyLmV2ZW50LmRldGVybWluZUV2ZW50VHlwZXMoKTtcclxuXHJcbiAgLy8gUmVnaXN0ZXIgYWxsIGdlc3R1cmVzIGluc2lkZSBIYW1tZXIuZ2VzdHVyZXNcclxuICBIYW1tZXIudXRpbHMuZWFjaChIYW1tZXIuZ2VzdHVyZXMsIGZ1bmN0aW9uKGdlc3R1cmUpe1xyXG4gICAgSGFtbWVyLmRldGVjdGlvbi5yZWdpc3RlcihnZXN0dXJlKTtcclxuICB9KTtcclxuXHJcbiAgLy8gQWRkIHRvdWNoIGV2ZW50cyBvbiB0aGUgZG9jdW1lbnRcclxuICBIYW1tZXIuZXZlbnQub25Ub3VjaChIYW1tZXIuRE9DVU1FTlQsIEhhbW1lci5FVkVOVF9NT1ZFLCBIYW1tZXIuZGV0ZWN0aW9uLmRldGVjdCk7XHJcbiAgSGFtbWVyLmV2ZW50Lm9uVG91Y2goSGFtbWVyLkRPQ1VNRU5ULCBIYW1tZXIuRVZFTlRfRU5ELCBIYW1tZXIuZGV0ZWN0aW9uLmRldGVjdCk7XHJcblxyXG4gIC8vIEhhbW1lciBpcyByZWFkeS4uLiFcclxuICBIYW1tZXIuUkVBRFkgPSB0cnVlO1xyXG59XHJcblxyXG5IYW1tZXIudXRpbHMgPSB7XHJcbiAgLyoqXHJcbiAgICogZXh0ZW5kIG1ldGhvZCxcclxuICAgKiBhbHNvIHVzZWQgZm9yIGNsb25pbmcgd2hlbiBkZXN0IGlzIGFuIGVtcHR5IG9iamVjdFxyXG4gICAqIEBwYXJhbSAgIHtPYmplY3R9ICAgIGRlc3RcclxuICAgKiBAcGFyYW0gICB7T2JqZWN0fSAgICBzcmNcclxuICAgKiBAcGFybSAge0Jvb2xlYW59ICBtZXJnZSAgICBkbyBhIG1lcmdlXHJcbiAgICogQHJldHVybnMge09iamVjdH0gICAgZGVzdFxyXG4gICAqL1xyXG4gIGV4dGVuZDogZnVuY3Rpb24gZXh0ZW5kKGRlc3QsIHNyYywgbWVyZ2UpIHtcclxuICAgIGZvcih2YXIga2V5IGluIHNyYykge1xyXG4gICAgICBpZihkZXN0W2tleV0gIT09IHVuZGVmaW5lZCAmJiBtZXJnZSkge1xyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICB9XHJcbiAgICAgIGRlc3Rba2V5XSA9IHNyY1trZXldO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRlc3Q7XHJcbiAgfSxcclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIGZvciBlYWNoXHJcbiAgICogQHBhcmFtIG9ialxyXG4gICAqIEBwYXJhbSBpdGVyYXRvclxyXG4gICAqL1xyXG4gIGVhY2g6IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcclxuICAgIHZhciBpLCBsZW5ndGg7XHJcbiAgICAvLyBuYXRpdmUgZm9yRWFjaCBvbiBhcnJheXNcclxuICAgIGlmICgnZm9yRWFjaCcgaW4gb2JqKSB7XHJcbiAgICAgIG9iai5mb3JFYWNoKGl0ZXJhdG9yLCBjb250ZXh0KTtcclxuICAgIH1cclxuICAgIC8vIGFycmF5c1xyXG4gICAgZWxzZSBpZihvYmoubGVuZ3RoICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgZm9yIChpID0gMCwgbGVuZ3RoID0gb2JqLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqW2ldLCBpLCBvYmopID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gb2JqZWN0c1xyXG4gICAgZWxzZSB7XHJcbiAgICAgIGZvciAoaSBpbiBvYmopIHtcclxuICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGkpICYmIGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqW2ldLCBpLCBvYmopID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIGZpbmQgaWYgYSBub2RlIGlzIGluIHRoZSBnaXZlbiBwYXJlbnRcclxuICAgKiB1c2VkIGZvciBldmVudCBkZWxlZ2F0aW9uIHRyaWNrc1xyXG4gICAqIEBwYXJhbSAgIHtIVE1MRWxlbWVudH0gICBub2RlXHJcbiAgICogQHBhcmFtICAge0hUTUxFbGVtZW50fSAgIHBhcmVudFxyXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAgICAgICBoYXNfcGFyZW50XHJcbiAgICovXHJcbiAgaGFzUGFyZW50OiBmdW5jdGlvbihub2RlLCBwYXJlbnQpIHtcclxuICAgIHdoaWxlKG5vZGUpIHtcclxuICAgICAgaWYobm9kZSA9PSBwYXJlbnQpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICBub2RlID0gbm9kZS5wYXJlbnROb2RlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH0sXHJcblxyXG5cclxuICAvKipcclxuICAgKiBnZXQgdGhlIGNlbnRlciBvZiBhbGwgdGhlIHRvdWNoZXNcclxuICAgKiBAcGFyYW0gICB7QXJyYXl9ICAgICB0b3VjaGVzXHJcbiAgICogQHJldHVybnMge09iamVjdH0gICAgY2VudGVyXHJcbiAgICovXHJcbiAgZ2V0Q2VudGVyOiBmdW5jdGlvbiBnZXRDZW50ZXIodG91Y2hlcykge1xyXG4gICAgdmFyIHZhbHVlc1ggPSBbXSwgdmFsdWVzWSA9IFtdO1xyXG5cclxuICAgIEhhbW1lci51dGlscy5lYWNoKHRvdWNoZXMsIGZ1bmN0aW9uKHRvdWNoKSB7XHJcbiAgICAgIC8vIEkgcHJlZmVyIGNsaWVudFggYmVjYXVzZSBpdCBpZ25vcmUgdGhlIHNjcm9sbGluZyBwb3NpdGlvblxyXG4gICAgICB2YWx1ZXNYLnB1c2godHlwZW9mIHRvdWNoLmNsaWVudFggIT09ICd1bmRlZmluZWQnID8gdG91Y2guY2xpZW50WCA6IHRvdWNoLnBhZ2VYICk7XHJcbiAgICAgIHZhbHVlc1kucHVzaCh0eXBlb2YgdG91Y2guY2xpZW50WSAhPT0gJ3VuZGVmaW5lZCcgPyB0b3VjaC5jbGllbnRZIDogdG91Y2gucGFnZVkgKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHBhZ2VYOiAoKE1hdGgubWluLmFwcGx5KE1hdGgsIHZhbHVlc1gpICsgTWF0aC5tYXguYXBwbHkoTWF0aCwgdmFsdWVzWCkpIC8gMiksXHJcbiAgICAgIHBhZ2VZOiAoKE1hdGgubWluLmFwcGx5KE1hdGgsIHZhbHVlc1kpICsgTWF0aC5tYXguYXBwbHkoTWF0aCwgdmFsdWVzWSkpIC8gMilcclxuICAgIH07XHJcbiAgfSxcclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIGNhbGN1bGF0ZSB0aGUgdmVsb2NpdHkgYmV0d2VlbiB0d28gcG9pbnRzXHJcbiAgICogQHBhcmFtICAge051bWJlcn0gICAgZGVsdGFfdGltZVxyXG4gICAqIEBwYXJhbSAgIHtOdW1iZXJ9ICAgIGRlbHRhX3hcclxuICAgKiBAcGFyYW0gICB7TnVtYmVyfSAgICBkZWx0YV95XHJcbiAgICogQHJldHVybnMge09iamVjdH0gICAgdmVsb2NpdHlcclxuICAgKi9cclxuICBnZXRWZWxvY2l0eTogZnVuY3Rpb24gZ2V0VmVsb2NpdHkoZGVsdGFfdGltZSwgZGVsdGFfeCwgZGVsdGFfeSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgeDogTWF0aC5hYnMoZGVsdGFfeCAvIGRlbHRhX3RpbWUpIHx8IDAsXHJcbiAgICAgIHk6IE1hdGguYWJzKGRlbHRhX3kgLyBkZWx0YV90aW1lKSB8fCAwXHJcbiAgICB9O1xyXG4gIH0sXHJcblxyXG5cclxuICAvKipcclxuICAgKiBjYWxjdWxhdGUgdGhlIGFuZ2xlIGJldHdlZW4gdHdvIGNvb3JkaW5hdGVzXHJcbiAgICogQHBhcmFtICAge1RvdWNofSAgICAgdG91Y2gxXHJcbiAgICogQHBhcmFtICAge1RvdWNofSAgICAgdG91Y2gyXHJcbiAgICogQHJldHVybnMge051bWJlcn0gICAgYW5nbGVcclxuICAgKi9cclxuICBnZXRBbmdsZTogZnVuY3Rpb24gZ2V0QW5nbGUodG91Y2gxLCB0b3VjaDIpIHtcclxuICAgIHZhciB5ID0gdG91Y2gyLnBhZ2VZIC0gdG91Y2gxLnBhZ2VZLFxyXG4gICAgICB4ID0gdG91Y2gyLnBhZ2VYIC0gdG91Y2gxLnBhZ2VYO1xyXG4gICAgcmV0dXJuIE1hdGguYXRhbjIoeSwgeCkgKiAxODAgLyBNYXRoLlBJO1xyXG4gIH0sXHJcblxyXG5cclxuICAvKipcclxuICAgKiBhbmdsZSB0byBkaXJlY3Rpb24gZGVmaW5lXHJcbiAgICogQHBhcmFtICAge1RvdWNofSAgICAgdG91Y2gxXHJcbiAgICogQHBhcmFtICAge1RvdWNofSAgICAgdG91Y2gyXHJcbiAgICogQHJldHVybnMge1N0cmluZ30gICAgZGlyZWN0aW9uIGNvbnN0YW50LCBsaWtlIEhhbW1lci5ESVJFQ1RJT05fTEVGVFxyXG4gICAqL1xyXG4gIGdldERpcmVjdGlvbjogZnVuY3Rpb24gZ2V0RGlyZWN0aW9uKHRvdWNoMSwgdG91Y2gyKSB7XHJcbiAgICB2YXIgeCA9IE1hdGguYWJzKHRvdWNoMS5wYWdlWCAtIHRvdWNoMi5wYWdlWCksXHJcbiAgICAgIHkgPSBNYXRoLmFicyh0b3VjaDEucGFnZVkgLSB0b3VjaDIucGFnZVkpO1xyXG5cclxuICAgIGlmKHggPj0geSkge1xyXG4gICAgICByZXR1cm4gdG91Y2gxLnBhZ2VYIC0gdG91Y2gyLnBhZ2VYID4gMCA/IEhhbW1lci5ESVJFQ1RJT05fTEVGVCA6IEhhbW1lci5ESVJFQ1RJT05fUklHSFQ7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgcmV0dXJuIHRvdWNoMS5wYWdlWSAtIHRvdWNoMi5wYWdlWSA+IDAgPyBIYW1tZXIuRElSRUNUSU9OX1VQIDogSGFtbWVyLkRJUkVDVElPTl9ET1dOO1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG5cclxuICAvKipcclxuICAgKiBjYWxjdWxhdGUgdGhlIGRpc3RhbmNlIGJldHdlZW4gdHdvIHRvdWNoZXNcclxuICAgKiBAcGFyYW0gICB7VG91Y2h9ICAgICB0b3VjaDFcclxuICAgKiBAcGFyYW0gICB7VG91Y2h9ICAgICB0b3VjaDJcclxuICAgKiBAcmV0dXJucyB7TnVtYmVyfSAgICBkaXN0YW5jZVxyXG4gICAqL1xyXG4gIGdldERpc3RhbmNlOiBmdW5jdGlvbiBnZXREaXN0YW5jZSh0b3VjaDEsIHRvdWNoMikge1xyXG4gICAgdmFyIHggPSB0b3VjaDIucGFnZVggLSB0b3VjaDEucGFnZVgsXHJcbiAgICAgIHkgPSB0b3VjaDIucGFnZVkgLSB0b3VjaDEucGFnZVk7XHJcbiAgICByZXR1cm4gTWF0aC5zcXJ0KCh4ICogeCkgKyAoeSAqIHkpKTtcclxuICB9LFxyXG5cclxuXHJcbiAgLyoqXHJcbiAgICogY2FsY3VsYXRlIHRoZSBzY2FsZSBmYWN0b3IgYmV0d2VlbiB0d28gdG91Y2hMaXN0cyAoZmluZ2VycylcclxuICAgKiBubyBzY2FsZSBpcyAxLCBhbmQgZ29lcyBkb3duIHRvIDAgd2hlbiBwaW5jaGVkIHRvZ2V0aGVyLCBhbmQgYmlnZ2VyIHdoZW4gcGluY2hlZCBvdXRcclxuICAgKiBAcGFyYW0gICB7QXJyYXl9ICAgICBzdGFydFxyXG4gICAqIEBwYXJhbSAgIHtBcnJheX0gICAgIGVuZFxyXG4gICAqIEByZXR1cm5zIHtOdW1iZXJ9ICAgIHNjYWxlXHJcbiAgICovXHJcbiAgZ2V0U2NhbGU6IGZ1bmN0aW9uIGdldFNjYWxlKHN0YXJ0LCBlbmQpIHtcclxuICAgIC8vIG5lZWQgdHdvIGZpbmdlcnMuLi5cclxuICAgIGlmKHN0YXJ0Lmxlbmd0aCA+PSAyICYmIGVuZC5sZW5ndGggPj0gMikge1xyXG4gICAgICByZXR1cm4gdGhpcy5nZXREaXN0YW5jZShlbmRbMF0sIGVuZFsxXSkgL1xyXG4gICAgICAgIHRoaXMuZ2V0RGlzdGFuY2Uoc3RhcnRbMF0sIHN0YXJ0WzFdKTtcclxuICAgIH1cclxuICAgIHJldHVybiAxO1xyXG4gIH0sXHJcblxyXG5cclxuICAvKipcclxuICAgKiBjYWxjdWxhdGUgdGhlIHJvdGF0aW9uIGRlZ3JlZXMgYmV0d2VlbiB0d28gdG91Y2hMaXN0cyAoZmluZ2VycylcclxuICAgKiBAcGFyYW0gICB7QXJyYXl9ICAgICBzdGFydFxyXG4gICAqIEBwYXJhbSAgIHtBcnJheX0gICAgIGVuZFxyXG4gICAqIEByZXR1cm5zIHtOdW1iZXJ9ICAgIHJvdGF0aW9uXHJcbiAgICovXHJcbiAgZ2V0Um90YXRpb246IGZ1bmN0aW9uIGdldFJvdGF0aW9uKHN0YXJ0LCBlbmQpIHtcclxuICAgIC8vIG5lZWQgdHdvIGZpbmdlcnNcclxuICAgIGlmKHN0YXJ0Lmxlbmd0aCA+PSAyICYmIGVuZC5sZW5ndGggPj0gMikge1xyXG4gICAgICByZXR1cm4gdGhpcy5nZXRBbmdsZShlbmRbMV0sIGVuZFswXSkgLVxyXG4gICAgICAgIHRoaXMuZ2V0QW5nbGUoc3RhcnRbMV0sIHN0YXJ0WzBdKTtcclxuICAgIH1cclxuICAgIHJldHVybiAwO1xyXG4gIH0sXHJcblxyXG5cclxuICAvKipcclxuICAgKiBib29sZWFuIGlmIHRoZSBkaXJlY3Rpb24gaXMgdmVydGljYWxcclxuICAgKiBAcGFyYW0gICAge1N0cmluZ30gICAgZGlyZWN0aW9uXHJcbiAgICogQHJldHVybnMgIHtCb29sZWFufSAgIGlzX3ZlcnRpY2FsXHJcbiAgICovXHJcbiAgaXNWZXJ0aWNhbDogZnVuY3Rpb24gaXNWZXJ0aWNhbChkaXJlY3Rpb24pIHtcclxuICAgIHJldHVybiAoZGlyZWN0aW9uID09IEhhbW1lci5ESVJFQ1RJT05fVVAgfHwgZGlyZWN0aW9uID09IEhhbW1lci5ESVJFQ1RJT05fRE9XTik7XHJcbiAgfSxcclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIHN0b3AgYnJvd3NlciBkZWZhdWx0IGJlaGF2aW9yIHdpdGggY3NzIHByb3BzXHJcbiAgICogQHBhcmFtICAge0h0bWxFbGVtZW50fSAgIGVsZW1lbnRcclxuICAgKiBAcGFyYW0gICB7T2JqZWN0fSAgICAgICAgY3NzX3Byb3BzXHJcbiAgICovXHJcbiAgc3RvcERlZmF1bHRCcm93c2VyQmVoYXZpb3I6IGZ1bmN0aW9uIHN0b3BEZWZhdWx0QnJvd3NlckJlaGF2aW9yKGVsZW1lbnQsIGNzc19wcm9wcykge1xyXG4gICAgaWYoIWNzc19wcm9wcyB8fCAhZWxlbWVudCB8fCAhZWxlbWVudC5zdHlsZSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gd2l0aCBjc3MgcHJvcGVydGllcyBmb3IgbW9kZXJuIGJyb3dzZXJzXHJcbiAgICBIYW1tZXIudXRpbHMuZWFjaChbJ3dlYmtpdCcsICdraHRtbCcsICdtb3onLCAnTW96JywgJ21zJywgJ28nLCAnJ10sIGZ1bmN0aW9uKHZlbmRvcikge1xyXG4gICAgICBIYW1tZXIudXRpbHMuZWFjaChjc3NfcHJvcHMsIGZ1bmN0aW9uKHZhbHVlLCBwcm9wKSB7XHJcbiAgICAgICAgICAvLyB2ZW5kZXIgcHJlZml4IGF0IHRoZSBwcm9wZXJ0eVxyXG4gICAgICAgICAgaWYodmVuZG9yKSB7XHJcbiAgICAgICAgICAgIHByb3AgPSB2ZW5kb3IgKyBwcm9wLnN1YnN0cmluZygwLCAxKS50b1VwcGVyQ2FzZSgpICsgcHJvcC5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAvLyBzZXQgdGhlIHN0eWxlXHJcbiAgICAgICAgICBpZihwcm9wIGluIGVsZW1lbnQuc3R5bGUpIHtcclxuICAgICAgICAgICAgZWxlbWVudC5zdHlsZVtwcm9wXSA9IHZhbHVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIGFsc28gdGhlIGRpc2FibGUgb25zZWxlY3RzdGFydFxyXG4gICAgaWYoY3NzX3Byb3BzLnVzZXJTZWxlY3QgPT0gJ25vbmUnKSB7XHJcbiAgICAgIGVsZW1lbnQub25zZWxlY3RzdGFydCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBhbmQgZGlzYWJsZSBvbmRyYWdzdGFydFxyXG4gICAgaWYoY3NzX3Byb3BzLnVzZXJEcmFnID09ICdub25lJykge1xyXG4gICAgICBlbGVtZW50Lm9uZHJhZ3N0YXJ0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG5cclxuICAvKipcclxuICAgKiByZXZlcnRzIGFsbCBjaGFuZ2VzIG1hZGUgYnkgJ3N0b3BEZWZhdWx0QnJvd3NlckJlaGF2aW9yJ1xyXG4gICAqIEBwYXJhbSAgIHtIdG1sRWxlbWVudH0gICBlbGVtZW50XHJcbiAgICogQHBhcmFtICAge09iamVjdH0gICAgICAgIGNzc19wcm9wc1xyXG4gICAqL1xyXG4gIHN0YXJ0RGVmYXVsdEJyb3dzZXJCZWhhdmlvcjogZnVuY3Rpb24gc3RhcnREZWZhdWx0QnJvd3NlckJlaGF2aW9yKGVsZW1lbnQsIGNzc19wcm9wcykge1xyXG4gICAgaWYoIWNzc19wcm9wcyB8fCAhZWxlbWVudCB8fCAhZWxlbWVudC5zdHlsZSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gd2l0aCBjc3MgcHJvcGVydGllcyBmb3IgbW9kZXJuIGJyb3dzZXJzXHJcbiAgICBIYW1tZXIudXRpbHMuZWFjaChbJ3dlYmtpdCcsICdraHRtbCcsICdtb3onLCAnTW96JywgJ21zJywgJ28nLCAnJ10sIGZ1bmN0aW9uKHZlbmRvcikge1xyXG4gICAgICBIYW1tZXIudXRpbHMuZWFjaChjc3NfcHJvcHMsIGZ1bmN0aW9uKHZhbHVlLCBwcm9wKSB7XHJcbiAgICAgICAgICAvLyB2ZW5kZXIgcHJlZml4IGF0IHRoZSBwcm9wZXJ0eVxyXG4gICAgICAgICAgaWYodmVuZG9yKSB7XHJcbiAgICAgICAgICAgIHByb3AgPSB2ZW5kb3IgKyBwcm9wLnN1YnN0cmluZygwLCAxKS50b1VwcGVyQ2FzZSgpICsgcHJvcC5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAvLyByZXNldCB0aGUgc3R5bGVcclxuICAgICAgICAgIGlmKHByb3AgaW4gZWxlbWVudC5zdHlsZSkge1xyXG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlW3Byb3BdID0gJyc7XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gYWxzbyB0aGUgZW5hYmxlIG9uc2VsZWN0c3RhcnRcclxuICAgIGlmKGNzc19wcm9wcy51c2VyU2VsZWN0ID09ICdub25lJykge1xyXG4gICAgICBlbGVtZW50Lm9uc2VsZWN0c3RhcnQgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGFuZCBlbmFibGUgb25kcmFnc3RhcnRcclxuICAgIGlmKGNzc19wcm9wcy51c2VyRHJhZyA9PSAnbm9uZScpIHtcclxuICAgICAgZWxlbWVudC5vbmRyYWdzdGFydCA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuXHJcbi8qKlxyXG4gKiBjcmVhdGUgbmV3IGhhbW1lciBpbnN0YW5jZVxyXG4gKiBhbGwgbWV0aG9kcyBzaG91bGQgcmV0dXJuIHRoZSBpbnN0YW5jZSBpdHNlbGYsIHNvIGl0IGlzIGNoYWluYWJsZS5cclxuICogQHBhcmFtICAge0hUTUxFbGVtZW50fSAgICAgICBlbGVtZW50XHJcbiAqIEBwYXJhbSAgIHtPYmplY3R9ICAgICAgICAgICAgW29wdGlvbnM9e31dXHJcbiAqIEByZXR1cm5zIHtIYW1tZXIuSW5zdGFuY2V9XHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxuSGFtbWVyLkluc3RhbmNlID0gZnVuY3Rpb24oZWxlbWVudCwgb3B0aW9ucykge1xyXG4gIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgLy8gc2V0dXAgSGFtbWVySlMgd2luZG93IGV2ZW50cyBhbmQgcmVnaXN0ZXIgYWxsIGdlc3R1cmVzXHJcbiAgLy8gdGhpcyBhbHNvIHNldHMgdXAgdGhlIGRlZmF1bHQgb3B0aW9uc1xyXG4gIHNldHVwKCk7XHJcblxyXG4gIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XHJcblxyXG4gIC8vIHN0YXJ0L3N0b3AgZGV0ZWN0aW9uIG9wdGlvblxyXG4gIHRoaXMuZW5hYmxlZCA9IHRydWU7XHJcblxyXG4gIC8vIG1lcmdlIG9wdGlvbnNcclxuICB0aGlzLm9wdGlvbnMgPSBIYW1tZXIudXRpbHMuZXh0ZW5kKFxyXG4gICAgSGFtbWVyLnV0aWxzLmV4dGVuZCh7fSwgSGFtbWVyLmRlZmF1bHRzKSxcclxuICAgIG9wdGlvbnMgfHwge30pO1xyXG5cclxuICAvLyBhZGQgc29tZSBjc3MgdG8gdGhlIGVsZW1lbnQgdG8gcHJldmVudCB0aGUgYnJvd3NlciBmcm9tIGRvaW5nIGl0cyBuYXRpdmUgYmVoYXZvaXJcclxuICBpZih0aGlzLm9wdGlvbnMuc3RvcF9icm93c2VyX2JlaGF2aW9yKSB7XHJcbiAgICBIYW1tZXIudXRpbHMuc3RvcERlZmF1bHRCcm93c2VyQmVoYXZpb3IodGhpcy5lbGVtZW50LCB0aGlzLm9wdGlvbnMuc3RvcF9icm93c2VyX2JlaGF2aW9yKTtcclxuICB9XHJcblxyXG4gIC8vIHN0YXJ0IGRldGVjdGlvbiBvbiB0b3VjaHN0YXJ0XHJcbiAgdGhpcy5fZXZlbnRTdGFydEhhbmRsZXIgPSBIYW1tZXIuZXZlbnQub25Ub3VjaChlbGVtZW50LCBIYW1tZXIuRVZFTlRfU1RBUlQsIGZ1bmN0aW9uKGV2KSB7XHJcbiAgICBpZihzZWxmLmVuYWJsZWQpIHtcclxuICAgICAgSGFtbWVyLmRldGVjdGlvbi5zdGFydERldGVjdChzZWxmLCBldik7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIC8vIGtlZXAgYSBsaXN0IG9mIHVzZXIgZXZlbnQgaGFuZGxlcnMgd2hpY2ggbmVlZHMgdG8gYmUgcmVtb3ZlZCB3aGVuIGNhbGxpbmcgJ2Rpc3Bvc2UnXHJcbiAgdGhpcy5fZXZlbnRIYW5kbGVyID0gW107XHJcblxyXG4gIC8vIHJldHVybiBpbnN0YW5jZVxyXG4gIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuXHJcbkhhbW1lci5JbnN0YW5jZS5wcm90b3R5cGUgPSB7XHJcbiAgLyoqXHJcbiAgICogYmluZCBldmVudHMgdG8gdGhlIGluc3RhbmNlXHJcbiAgICogQHBhcmFtICAge1N0cmluZ30gICAgICBnZXN0dXJlXHJcbiAgICogQHBhcmFtICAge0Z1bmN0aW9ufSAgICBoYW5kbGVyXHJcbiAgICogQHJldHVybnMge0hhbW1lci5JbnN0YW5jZX1cclxuICAgKi9cclxuICBvbjogZnVuY3Rpb24gb25FdmVudChnZXN0dXJlLCBoYW5kbGVyKSB7XHJcbiAgICB2YXIgZ2VzdHVyZXMgPSBnZXN0dXJlLnNwbGl0KCcgJyk7XHJcbiAgICBIYW1tZXIudXRpbHMuZWFjaChnZXN0dXJlcywgZnVuY3Rpb24oZ2VzdHVyZSkge1xyXG4gICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihnZXN0dXJlLCBoYW5kbGVyLCBmYWxzZSk7XHJcbiAgICAgIHRoaXMuX2V2ZW50SGFuZGxlci5wdXNoKHsgZ2VzdHVyZTogZ2VzdHVyZSwgaGFuZGxlcjogaGFuZGxlciB9KTtcclxuICAgIH0sIHRoaXMpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfSxcclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIHVuYmluZCBldmVudHMgdG8gdGhlIGluc3RhbmNlXHJcbiAgICogQHBhcmFtICAge1N0cmluZ30gICAgICBnZXN0dXJlXHJcbiAgICogQHBhcmFtICAge0Z1bmN0aW9ufSAgICBoYW5kbGVyXHJcbiAgICogQHJldHVybnMge0hhbW1lci5JbnN0YW5jZX1cclxuICAgKi9cclxuICBvZmY6IGZ1bmN0aW9uIG9mZkV2ZW50KGdlc3R1cmUsIGhhbmRsZXIpIHtcclxuICAgIHZhciBnZXN0dXJlcyA9IGdlc3R1cmUuc3BsaXQoJyAnKTtcclxuICAgIEhhbW1lci51dGlscy5lYWNoKGdlc3R1cmVzLCBmdW5jdGlvbihnZXN0dXJlKSB7XHJcbiAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGdlc3R1cmUsIGhhbmRsZXIsIGZhbHNlKTtcclxuXHJcbiAgICAgIC8vIHJlbW92ZSB0aGUgZXZlbnQgaGFuZGxlciBmcm9tIHRoZSBpbnRlcm5hbCBsaXN0XHJcbiAgICAgIHZhciBpbmRleCA9IC0xO1xyXG4gICAgICBIYW1tZXIudXRpbHMuZWFjaCh0aGlzLl9ldmVudEhhbmRsZXIsIGZ1bmN0aW9uKGV2ZW50SGFuZGxlciwgaSkge1xyXG4gICAgICAgIGlmIChpbmRleCA9PT0gLTEgJiYgZXZlbnRIYW5kbGVyLmdlc3R1cmUgPT09IGdlc3R1cmUgJiYgZXZlbnRIYW5kbGVyLmhhbmRsZXIgPT09IGhhbmRsZXIpIHtcclxuICAgICAgICAgIGluZGV4ID0gaTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sIHRoaXMpO1xyXG5cclxuICAgICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgICB0aGlzLl9ldmVudEhhbmRsZXIuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgfVxyXG4gICAgfSwgdGhpcyk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9LFxyXG5cclxuXHJcbiAgLyoqXHJcbiAgICogdHJpZ2dlciBnZXN0dXJlIGV2ZW50XHJcbiAgICogQHBhcmFtICAge1N0cmluZ30gICAgICBnZXN0dXJlXHJcbiAgICogQHBhcmFtICAge09iamVjdH0gICAgICBbZXZlbnREYXRhXVxyXG4gICAqIEByZXR1cm5zIHtIYW1tZXIuSW5zdGFuY2V9XHJcbiAgICovXHJcbiAgdHJpZ2dlcjogZnVuY3Rpb24gdHJpZ2dlckV2ZW50KGdlc3R1cmUsIGV2ZW50RGF0YSkge1xyXG4gICAgLy8gb3B0aW9uYWxcclxuICAgIGlmKCFldmVudERhdGEpIHtcclxuICAgICAgZXZlbnREYXRhID0ge307XHJcbiAgICB9XHJcblxyXG4gICAgLy8gY3JlYXRlIERPTSBldmVudFxyXG4gICAgdmFyIGV2ZW50ID0gSGFtbWVyLkRPQ1VNRU5ULmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xyXG4gICAgZXZlbnQuaW5pdEV2ZW50KGdlc3R1cmUsIHRydWUsIHRydWUpO1xyXG4gICAgZXZlbnQuZ2VzdHVyZSA9IGV2ZW50RGF0YTtcclxuXHJcbiAgICAvLyB0cmlnZ2VyIG9uIHRoZSB0YXJnZXQgaWYgaXQgaXMgaW4gdGhlIGluc3RhbmNlIGVsZW1lbnQsXHJcbiAgICAvLyB0aGlzIGlzIGZvciBldmVudCBkZWxlZ2F0aW9uIHRyaWNrc1xyXG4gICAgdmFyIGVsZW1lbnQgPSB0aGlzLmVsZW1lbnQ7XHJcbiAgICBpZihIYW1tZXIudXRpbHMuaGFzUGFyZW50KGV2ZW50RGF0YS50YXJnZXQsIGVsZW1lbnQpKSB7XHJcbiAgICAgIGVsZW1lbnQgPSBldmVudERhdGEudGFyZ2V0O1xyXG4gICAgfVxyXG5cclxuICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9LFxyXG5cclxuXHJcbiAgLyoqXHJcbiAgICogZW5hYmxlIG9mIGRpc2FibGUgaGFtbWVyLmpzIGRldGVjdGlvblxyXG4gICAqIEBwYXJhbSAgIHtCb29sZWFufSAgIHN0YXRlXHJcbiAgICogQHJldHVybnMge0hhbW1lci5JbnN0YW5jZX1cclxuICAgKi9cclxuICBlbmFibGU6IGZ1bmN0aW9uIGVuYWJsZShzdGF0ZSkge1xyXG4gICAgdGhpcy5lbmFibGVkID0gc3RhdGU7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9LFxyXG5cclxuXHJcbiAgLyoqXHJcbiAgICogZGlzcG9zZSB0aGlzIGhhbW1lciBpbnN0YW5jZVxyXG4gICAqIEByZXR1cm5zIHtIYW1tZXIuSW5zdGFuY2V9XHJcbiAgICovXHJcbiAgZGlzcG9zZTogZnVuY3Rpb24gZGlzcG9zZSgpIHtcclxuXHJcbiAgICAvLyB1bmRvIGFsbCBjaGFuZ2VzIG1hZGUgYnkgc3RvcF9icm93c2VyX2JlaGF2aW9yXHJcbiAgICBpZih0aGlzLm9wdGlvbnMuc3RvcF9icm93c2VyX2JlaGF2aW9yKSB7XHJcbiAgICAgIEhhbW1lci51dGlscy5zdGFydERlZmF1bHRCcm93c2VyQmVoYXZpb3IodGhpcy5lbGVtZW50LCB0aGlzLm9wdGlvbnMuc3RvcF9icm93c2VyX2JlaGF2aW9yKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB1bmJpbmQgYWxsIGN1c3RvbSBldmVudCBoYW5kbGVyc1xyXG4gICAgSGFtbWVyLnV0aWxzLmVhY2godGhpcy5fZXZlbnRIYW5kbGVyLCBmdW5jdGlvbihldmVudEhhbmRsZXIpIHtcclxuICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRIYW5kbGVyLmdlc3R1cmUsIGV2ZW50SGFuZGxlci5oYW5kbGVyLCBmYWxzZSk7XHJcbiAgICB9LCB0aGlzKTtcclxuICAgIHRoaXMuX2V2ZW50SGFuZGxlci5sZW5ndGggPSAwO1xyXG5cclxuICAgIC8vIHVuYmluZCB0aGUgc3RhcnQgZXZlbnQgbGlzdGVuZXJcclxuICAgIEhhbW1lci5ldmVudC51bmJpbmREb20odGhpcy5lbGVtZW50LCBIYW1tZXIuRVZFTlRfVFlQRVNbSGFtbWVyLkVWRU5UX1NUQVJUXSwgdGhpcy5fZXZlbnRTdGFydEhhbmRsZXIpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG59O1xyXG5cclxuXHJcbi8qKlxyXG4gKiB0aGlzIGhvbGRzIHRoZSBsYXN0IG1vdmUgZXZlbnQsXHJcbiAqIHVzZWQgdG8gZml4IGVtcHR5IHRvdWNoZW5kIGlzc3VlXHJcbiAqIHNlZSB0aGUgb25Ub3VjaCBldmVudCBmb3IgYW4gZXhwbGFuYXRpb25cclxuICogQHR5cGUge09iamVjdH1cclxuICovXHJcbnZhciBsYXN0X21vdmVfZXZlbnQgPSBudWxsO1xyXG5cclxuXHJcbi8qKlxyXG4gKiB3aGVuIHRoZSBtb3VzZSBpcyBob2xkIGRvd24sIHRoaXMgaXMgdHJ1ZVxyXG4gKiBAdHlwZSB7Qm9vbGVhbn1cclxuICovXHJcbnZhciBlbmFibGVfZGV0ZWN0ID0gZmFsc2U7XHJcblxyXG5cclxuLyoqXHJcbiAqIHdoZW4gdG91Y2ggZXZlbnRzIGhhdmUgYmVlbiBmaXJlZCwgdGhpcyBpcyB0cnVlXHJcbiAqIEB0eXBlIHtCb29sZWFufVxyXG4gKi9cclxudmFyIHRvdWNoX3RyaWdnZXJlZCA9IGZhbHNlO1xyXG5cclxuXHJcbkhhbW1lci5ldmVudCA9IHtcclxuICAvKipcclxuICAgKiBzaW1wbGUgYWRkRXZlbnRMaXN0ZW5lclxyXG4gICAqIEBwYXJhbSAgIHtIVE1MRWxlbWVudH0gICBlbGVtZW50XHJcbiAgICogQHBhcmFtICAge1N0cmluZ30gICAgICAgIHR5cGVcclxuICAgKiBAcGFyYW0gICB7RnVuY3Rpb259ICAgICAgaGFuZGxlclxyXG4gICAqL1xyXG4gIGJpbmREb206IGZ1bmN0aW9uKGVsZW1lbnQsIHR5cGUsIGhhbmRsZXIpIHtcclxuICAgIHZhciB0eXBlcyA9IHR5cGUuc3BsaXQoJyAnKTtcclxuICAgIEhhbW1lci51dGlscy5lYWNoKHR5cGVzLCBmdW5jdGlvbih0eXBlKXtcclxuICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGhhbmRsZXIsIGZhbHNlKTtcclxuICAgIH0pO1xyXG4gIH0sXHJcblxyXG5cclxuICAvKipcclxuICAgKiBzaW1wbGUgcmVtb3ZlRXZlbnRMaXN0ZW5lclxyXG4gICAqIEBwYXJhbSAgIHtIVE1MRWxlbWVudH0gICBlbGVtZW50XHJcbiAgICogQHBhcmFtICAge1N0cmluZ30gICAgICAgIHR5cGVcclxuICAgKiBAcGFyYW0gICB7RnVuY3Rpb259ICAgICAgaGFuZGxlclxyXG4gICAqL1xyXG4gIHVuYmluZERvbTogZnVuY3Rpb24oZWxlbWVudCwgdHlwZSwgaGFuZGxlcikge1xyXG4gICAgdmFyIHR5cGVzID0gdHlwZS5zcGxpdCgnICcpO1xyXG4gICAgSGFtbWVyLnV0aWxzLmVhY2godHlwZXMsIGZ1bmN0aW9uKHR5cGUpe1xyXG4gICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgaGFuZGxlciwgZmFsc2UpO1xyXG4gICAgfSk7XHJcbiAgfSxcclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIHRvdWNoIGV2ZW50cyB3aXRoIG1vdXNlIGZhbGxiYWNrXHJcbiAgICogQHBhcmFtICAge0hUTUxFbGVtZW50fSAgIGVsZW1lbnRcclxuICAgKiBAcGFyYW0gICB7U3RyaW5nfSAgICAgICAgZXZlbnRUeXBlICAgICAgICBsaWtlIEhhbW1lci5FVkVOVF9NT1ZFXHJcbiAgICogQHBhcmFtICAge0Z1bmN0aW9ufSAgICAgIGhhbmRsZXJcclxuICAgKi9cclxuICBvblRvdWNoOiBmdW5jdGlvbiBvblRvdWNoKGVsZW1lbnQsIGV2ZW50VHlwZSwgaGFuZGxlcikge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIHZhciBmbiA9IGZ1bmN0aW9uIGJpbmREb21PblRvdWNoKGV2KSB7XHJcbiAgICAgIHZhciBzb3VyY2VFdmVudFR5cGUgPSBldi50eXBlLnRvTG93ZXJDYXNlKCk7XHJcblxyXG4gICAgICAvLyBvbm1vdXNldXAsIGJ1dCB3aGVuIHRvdWNoZW5kIGhhcyBiZWVuIGZpcmVkIHdlIGRvIG5vdGhpbmcuXHJcbiAgICAgIC8vIHRoaXMgaXMgZm9yIHRvdWNoZGV2aWNlcyB3aGljaCBhbHNvIGZpcmUgYSBtb3VzZXVwIG9uIHRvdWNoZW5kXHJcbiAgICAgIGlmKHNvdXJjZUV2ZW50VHlwZS5tYXRjaCgvbW91c2UvKSAmJiB0b3VjaF90cmlnZ2VyZWQpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIG1vdXNlYnV0dG9uIG11c3QgYmUgZG93biBvciBhIHRvdWNoIGV2ZW50XHJcbiAgICAgIGVsc2UgaWYoc291cmNlRXZlbnRUeXBlLm1hdGNoKC90b3VjaC8pIHx8ICAgLy8gdG91Y2ggZXZlbnRzIGFyZSBhbHdheXMgb24gc2NyZWVuXHJcbiAgICAgICAgc291cmNlRXZlbnRUeXBlLm1hdGNoKC9wb2ludGVyZG93bi8pIHx8IC8vIHBvaW50ZXJldmVudHMgdG91Y2hcclxuICAgICAgICAoc291cmNlRXZlbnRUeXBlLm1hdGNoKC9tb3VzZS8pICYmIGV2LndoaWNoID09PSAxKSAgIC8vIG1vdXNlIGlzIHByZXNzZWRcclxuICAgICAgICApIHtcclxuICAgICAgICBlbmFibGVfZGV0ZWN0ID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gbW91c2UgaXNuJ3QgcHJlc3NlZFxyXG4gICAgICBlbHNlIGlmKHNvdXJjZUV2ZW50VHlwZS5tYXRjaCgvbW91c2UvKSAmJiAhZXYud2hpY2gpIHtcclxuICAgICAgICBlbmFibGVfZGV0ZWN0ID0gZmFsc2U7XHJcbiAgICAgIH1cclxuXHJcblxyXG4gICAgICAvLyB3ZSBhcmUgaW4gYSB0b3VjaCBldmVudCwgc2V0IHRoZSB0b3VjaCB0cmlnZ2VyZWQgYm9vbCB0byB0cnVlLFxyXG4gICAgICAvLyB0aGlzIGZvciB0aGUgY29uZmxpY3RzIHRoYXQgbWF5IG9jY3VyIG9uIGlvcyBhbmQgYW5kcm9pZFxyXG4gICAgICBpZihzb3VyY2VFdmVudFR5cGUubWF0Y2goL3RvdWNofHBvaW50ZXIvKSkge1xyXG4gICAgICAgIHRvdWNoX3RyaWdnZXJlZCA9IHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGNvdW50IHRoZSB0b3RhbCB0b3VjaGVzIG9uIHRoZSBzY3JlZW5cclxuICAgICAgdmFyIGNvdW50X3RvdWNoZXMgPSAwO1xyXG5cclxuICAgICAgLy8gd2hlbiB0b3VjaCBoYXMgYmVlbiB0cmlnZ2VyZWQgaW4gdGhpcyBkZXRlY3Rpb24gc2Vzc2lvblxyXG4gICAgICAvLyBhbmQgd2UgYXJlIG5vdyBoYW5kbGluZyBhIG1vdXNlIGV2ZW50LCB3ZSBzdG9wIHRoYXQgdG8gcHJldmVudCBjb25mbGljdHNcclxuICAgICAgaWYoZW5hYmxlX2RldGVjdCkge1xyXG4gICAgICAgIC8vIHVwZGF0ZSBwb2ludGVyZXZlbnRcclxuICAgICAgICBpZihIYW1tZXIuSEFTX1BPSU5URVJFVkVOVFMgJiYgZXZlbnRUeXBlICE9IEhhbW1lci5FVkVOVF9FTkQpIHtcclxuICAgICAgICAgIGNvdW50X3RvdWNoZXMgPSBIYW1tZXIuUG9pbnRlckV2ZW50LnVwZGF0ZVBvaW50ZXIoZXZlbnRUeXBlLCBldik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHRvdWNoXHJcbiAgICAgICAgZWxzZSBpZihzb3VyY2VFdmVudFR5cGUubWF0Y2goL3RvdWNoLykpIHtcclxuICAgICAgICAgIGNvdW50X3RvdWNoZXMgPSBldi50b3VjaGVzLmxlbmd0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gbW91c2VcclxuICAgICAgICBlbHNlIGlmKCF0b3VjaF90cmlnZ2VyZWQpIHtcclxuICAgICAgICAgIGNvdW50X3RvdWNoZXMgPSBzb3VyY2VFdmVudFR5cGUubWF0Y2goL3VwLykgPyAwIDogMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGlmIHdlIGFyZSBpbiBhIGVuZCBldmVudCwgYnV0IHdoZW4gd2UgcmVtb3ZlIG9uZSB0b3VjaCBhbmRcclxuICAgICAgICAvLyB3ZSBzdGlsbCBoYXZlIGVub3VnaCwgc2V0IGV2ZW50VHlwZSB0byBtb3ZlXHJcbiAgICAgICAgaWYoY291bnRfdG91Y2hlcyA+IDAgJiYgZXZlbnRUeXBlID09IEhhbW1lci5FVkVOVF9FTkQpIHtcclxuICAgICAgICAgIGV2ZW50VHlwZSA9IEhhbW1lci5FVkVOVF9NT1ZFO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBubyB0b3VjaGVzLCBmb3JjZSB0aGUgZW5kIGV2ZW50XHJcbiAgICAgICAgZWxzZSBpZighY291bnRfdG91Y2hlcykge1xyXG4gICAgICAgICAgZXZlbnRUeXBlID0gSGFtbWVyLkVWRU5UX0VORDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHN0b3JlIHRoZSBsYXN0IG1vdmUgZXZlbnRcclxuICAgICAgICBpZihjb3VudF90b3VjaGVzIHx8IGxhc3RfbW92ZV9ldmVudCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgbGFzdF9tb3ZlX2V2ZW50ID0gZXY7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyB0cmlnZ2VyIHRoZSBoYW5kbGVyXHJcbiAgICAgICAgaGFuZGxlci5jYWxsKEhhbW1lci5kZXRlY3Rpb24sIHNlbGYuY29sbGVjdEV2ZW50RGF0YShlbGVtZW50LCBldmVudFR5cGUsIHNlbGYuZ2V0VG91Y2hMaXN0KGxhc3RfbW92ZV9ldmVudCwgZXZlbnRUeXBlKSwgZXYpKTtcclxuXHJcbiAgICAgICAgLy8gcmVtb3ZlIHBvaW50ZXJldmVudCBmcm9tIGxpc3RcclxuICAgICAgICBpZihIYW1tZXIuSEFTX1BPSU5URVJFVkVOVFMgJiYgZXZlbnRUeXBlID09IEhhbW1lci5FVkVOVF9FTkQpIHtcclxuICAgICAgICAgIGNvdW50X3RvdWNoZXMgPSBIYW1tZXIuUG9pbnRlckV2ZW50LnVwZGF0ZVBvaW50ZXIoZXZlbnRUeXBlLCBldik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBvbiB0aGUgZW5kIHdlIHJlc2V0IGV2ZXJ5dGhpbmdcclxuICAgICAgaWYoIWNvdW50X3RvdWNoZXMpIHtcclxuICAgICAgICBsYXN0X21vdmVfZXZlbnQgPSBudWxsO1xyXG4gICAgICAgIGVuYWJsZV9kZXRlY3QgPSBmYWxzZTtcclxuICAgICAgICB0b3VjaF90cmlnZ2VyZWQgPSBmYWxzZTtcclxuICAgICAgICBIYW1tZXIuUG9pbnRlckV2ZW50LnJlc2V0KCk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5iaW5kRG9tKGVsZW1lbnQsIEhhbW1lci5FVkVOVF9UWVBFU1tldmVudFR5cGVdLCBmbik7XHJcblxyXG4gICAgLy8gcmV0dXJuIHRoZSBib3VuZCBmdW5jdGlvbiB0byBiZSBhYmxlIHRvIHVuYmluZCBpdCBsYXRlclxyXG4gICAgcmV0dXJuIGZuO1xyXG4gICAgfSxcclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIHdlIGhhdmUgZGlmZmVyZW50IGV2ZW50cyBmb3IgZWFjaCBkZXZpY2UvYnJvd3NlclxyXG4gICAqIGRldGVybWluZSB3aGF0IHdlIG5lZWQgYW5kIHNldCB0aGVtIGluIHRoZSBIYW1tZXIuRVZFTlRfVFlQRVMgY29uc3RhbnRcclxuICAgKi9cclxuICBkZXRlcm1pbmVFdmVudFR5cGVzOiBmdW5jdGlvbiBkZXRlcm1pbmVFdmVudFR5cGVzKCkge1xyXG4gICAgLy8gZGV0ZXJtaW5lIHRoZSBldmVudHR5cGUgd2Ugd2FudCB0byBzZXRcclxuICAgIHZhciB0eXBlcztcclxuXHJcbiAgICAvLyBwb2ludGVyRXZlbnRzIG1hZ2ljXHJcbiAgICBpZihIYW1tZXIuSEFTX1BPSU5URVJFVkVOVFMpIHtcclxuICAgICAgdHlwZXMgPSBIYW1tZXIuUG9pbnRlckV2ZW50LmdldEV2ZW50cygpO1xyXG4gICAgfVxyXG4gICAgLy8gb24gQW5kcm9pZCwgaU9TLCBibGFja2JlcnJ5LCB3aW5kb3dzIG1vYmlsZSB3ZSBkb250IHdhbnQgYW55IG1vdXNlZXZlbnRzXHJcbiAgICBlbHNlIGlmKEhhbW1lci5OT19NT1VTRUVWRU5UUykge1xyXG4gICAgICB0eXBlcyA9IFtcclxuICAgICAgICAndG91Y2hzdGFydCcsXHJcbiAgICAgICAgJ3RvdWNobW92ZScsXHJcbiAgICAgICAgJ3RvdWNoZW5kIHRvdWNoY2FuY2VsJ107XHJcbiAgICB9XHJcbiAgICAvLyBmb3Igbm9uIHBvaW50ZXIgZXZlbnRzIGJyb3dzZXJzIGFuZCBtaXhlZCBicm93c2VycyxcclxuICAgIC8vIGxpa2UgY2hyb21lIG9uIHdpbmRvd3M4IHRvdWNoIGxhcHRvcFxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHR5cGVzID0gW1xyXG4gICAgICAgICd0b3VjaHN0YXJ0IG1vdXNlZG93bicsXHJcbiAgICAgICAgJ3RvdWNobW92ZSBtb3VzZW1vdmUnLFxyXG4gICAgICAgICd0b3VjaGVuZCB0b3VjaGNhbmNlbCBtb3VzZXVwJ107XHJcbiAgICB9XHJcblxyXG4gICAgSGFtbWVyLkVWRU5UX1RZUEVTW0hhbW1lci5FVkVOVF9TVEFSVF0gPSB0eXBlc1swXTtcclxuICAgIEhhbW1lci5FVkVOVF9UWVBFU1tIYW1tZXIuRVZFTlRfTU9WRV0gPSB0eXBlc1sxXTtcclxuICAgIEhhbW1lci5FVkVOVF9UWVBFU1tIYW1tZXIuRVZFTlRfRU5EXSA9IHR5cGVzWzJdO1xyXG4gIH0sXHJcblxyXG5cclxuICAvKipcclxuICAgKiBjcmVhdGUgdG91Y2hsaXN0IGRlcGVuZGluZyBvbiB0aGUgZXZlbnRcclxuICAgKiBAcGFyYW0gICB7T2JqZWN0fSAgICBldlxyXG4gICAqIEBwYXJhbSAgIHtTdHJpbmd9ICAgIGV2ZW50VHlwZSAgIHVzZWQgYnkgdGhlIGZha2VtdWx0aXRvdWNoIHBsdWdpblxyXG4gICAqL1xyXG4gIGdldFRvdWNoTGlzdDogZnVuY3Rpb24gZ2V0VG91Y2hMaXN0KGV2LyosIGV2ZW50VHlwZSovKSB7XHJcbiAgICAvLyBnZXQgdGhlIGZha2UgcG9pbnRlckV2ZW50IHRvdWNobGlzdFxyXG4gICAgaWYoSGFtbWVyLkhBU19QT0lOVEVSRVZFTlRTKSB7XHJcbiAgICAgIHJldHVybiBIYW1tZXIuUG9pbnRlckV2ZW50LmdldFRvdWNoTGlzdCgpO1xyXG4gICAgfVxyXG4gICAgLy8gZ2V0IHRoZSB0b3VjaGxpc3RcclxuICAgIGVsc2UgaWYoZXYudG91Y2hlcykge1xyXG4gICAgICByZXR1cm4gZXYudG91Y2hlcztcclxuICAgIH1cclxuICAgIC8vIG1ha2UgZmFrZSB0b3VjaGxpc3QgZnJvbSBtb3VzZSBwb3NpdGlvblxyXG4gICAgZWxzZSB7XHJcbiAgICAgIGV2LmlkZW50aWZpZXIgPSAxO1xyXG4gICAgICByZXR1cm4gW2V2XTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuXHJcbiAgLyoqXHJcbiAgICogY29sbGVjdCBldmVudCBkYXRhIGZvciBIYW1tZXIganNcclxuICAgKiBAcGFyYW0gICB7SFRNTEVsZW1lbnR9ICAgZWxlbWVudFxyXG4gICAqIEBwYXJhbSAgIHtTdHJpbmd9ICAgICAgICBldmVudFR5cGUgICAgICAgIGxpa2UgSGFtbWVyLkVWRU5UX01PVkVcclxuICAgKiBAcGFyYW0gICB7T2JqZWN0fSAgICAgICAgZXZlbnREYXRhXHJcbiAgICovXHJcbiAgY29sbGVjdEV2ZW50RGF0YTogZnVuY3Rpb24gY29sbGVjdEV2ZW50RGF0YShlbGVtZW50LCBldmVudFR5cGUsIHRvdWNoZXMsIGV2KSB7XHJcbiAgICAvLyBmaW5kIG91dCBwb2ludGVyVHlwZVxyXG4gICAgdmFyIHBvaW50ZXJUeXBlID0gSGFtbWVyLlBPSU5URVJfVE9VQ0g7XHJcbiAgICBpZihldi50eXBlLm1hdGNoKC9tb3VzZS8pIHx8IEhhbW1lci5Qb2ludGVyRXZlbnQubWF0Y2hUeXBlKEhhbW1lci5QT0lOVEVSX01PVVNFLCBldikpIHtcclxuICAgICAgcG9pbnRlclR5cGUgPSBIYW1tZXIuUE9JTlRFUl9NT1VTRTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBjZW50ZXIgICAgIDogSGFtbWVyLnV0aWxzLmdldENlbnRlcih0b3VjaGVzKSxcclxuICAgICAgdGltZVN0YW1wICA6IG5ldyBEYXRlKCkuZ2V0VGltZSgpLFxyXG4gICAgICB0YXJnZXQgICAgIDogZXYudGFyZ2V0LFxyXG4gICAgICB0b3VjaGVzICAgIDogdG91Y2hlcyxcclxuICAgICAgZXZlbnRUeXBlICA6IGV2ZW50VHlwZSxcclxuICAgICAgcG9pbnRlclR5cGU6IHBvaW50ZXJUeXBlLFxyXG4gICAgICBzcmNFdmVudCAgIDogZXYsXHJcblxyXG4gICAgICAvKipcclxuICAgICAgICogcHJldmVudCB0aGUgYnJvd3NlciBkZWZhdWx0IGFjdGlvbnNcclxuICAgICAgICogbW9zdGx5IHVzZWQgdG8gZGlzYWJsZSBzY3JvbGxpbmcgb2YgdGhlIGJyb3dzZXJcclxuICAgICAgICovXHJcbiAgICAgIHByZXZlbnREZWZhdWx0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZih0aGlzLnNyY0V2ZW50LnByZXZlbnRNYW5pcHVsYXRpb24pIHtcclxuICAgICAgICAgIHRoaXMuc3JjRXZlbnQucHJldmVudE1hbmlwdWxhdGlvbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodGhpcy5zcmNFdmVudC5wcmV2ZW50RGVmYXVsdCkge1xyXG4gICAgICAgICAgdGhpcy5zcmNFdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBzdG9wIGJ1YmJsaW5nIHRoZSBldmVudCB1cCB0byBpdHMgcGFyZW50c1xyXG4gICAgICAgKi9cclxuICAgICAgc3RvcFByb3BhZ2F0aW9uOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLnNyY0V2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgLyoqXHJcbiAgICAgICAqIGltbWVkaWF0ZWx5IHN0b3AgZ2VzdHVyZSBkZXRlY3Rpb25cclxuICAgICAgICogbWlnaHQgYmUgdXNlZnVsIGFmdGVyIGEgc3dpcGUgd2FzIGRldGVjdGVkXHJcbiAgICAgICAqIEByZXR1cm4geyp9XHJcbiAgICAgICAqL1xyXG4gICAgICBzdG9wRGV0ZWN0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gSGFtbWVyLmRldGVjdGlvbi5zdG9wRGV0ZWN0KCk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfVxyXG59O1xyXG5cclxuSGFtbWVyLlBvaW50ZXJFdmVudCA9IHtcclxuICAvKipcclxuICAgKiBob2xkcyBhbGwgcG9pbnRlcnNcclxuICAgKiBAdHlwZSB7T2JqZWN0fVxyXG4gICAqL1xyXG4gIHBvaW50ZXJzOiB7fSxcclxuXHJcbiAgLyoqXHJcbiAgICogZ2V0IGEgbGlzdCBvZiBwb2ludGVyc1xyXG4gICAqIEByZXR1cm5zIHtBcnJheX0gICAgIHRvdWNobGlzdFxyXG4gICAqL1xyXG4gIGdldFRvdWNoTGlzdDogZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICB2YXIgdG91Y2hsaXN0ID0gW107XHJcblxyXG4gICAgLy8gd2UgY2FuIHVzZSBmb3JFYWNoIHNpbmNlIHBvaW50ZXJFdmVudHMgb25seSBpcyBpbiBJRTEwXHJcbiAgICBIYW1tZXIudXRpbHMuZWFjaChzZWxmLnBvaW50ZXJzLCBmdW5jdGlvbihwb2ludGVyKXtcclxuICAgICAgdG91Y2hsaXN0LnB1c2gocG9pbnRlcik7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gdG91Y2hsaXN0O1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIHVwZGF0ZSB0aGUgcG9zaXRpb24gb2YgYSBwb2ludGVyXHJcbiAgICogQHBhcmFtICAge1N0cmluZ30gICB0eXBlICAgICAgICAgICAgIEhhbW1lci5FVkVOVF9FTkRcclxuICAgKiBAcGFyYW0gICB7T2JqZWN0fSAgIHBvaW50ZXJFdmVudFxyXG4gICAqL1xyXG4gIHVwZGF0ZVBvaW50ZXI6IGZ1bmN0aW9uKHR5cGUsIHBvaW50ZXJFdmVudCkge1xyXG4gICAgaWYodHlwZSA9PSBIYW1tZXIuRVZFTlRfRU5EKSB7XHJcbiAgICAgIGRlbGV0ZSB0aGlzLnBvaW50ZXJzW3BvaW50ZXJFdmVudC5wb2ludGVySWRdO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHBvaW50ZXJFdmVudC5pZGVudGlmaWVyID0gcG9pbnRlckV2ZW50LnBvaW50ZXJJZDtcclxuICAgICAgdGhpcy5wb2ludGVyc1twb2ludGVyRXZlbnQucG9pbnRlcklkXSA9IHBvaW50ZXJFdmVudDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5wb2ludGVycykubGVuZ3RoO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIGNoZWNrIGlmIGV2IG1hdGNoZXMgcG9pbnRlcnR5cGVcclxuICAgKiBAcGFyYW0gICB7U3RyaW5nfSAgICAgICAgcG9pbnRlclR5cGUgICAgIEhhbW1lci5QT0lOVEVSX01PVVNFXHJcbiAgICogQHBhcmFtICAge1BvaW50ZXJFdmVudH0gIGV2XHJcbiAgICovXHJcbiAgbWF0Y2hUeXBlOiBmdW5jdGlvbihwb2ludGVyVHlwZSwgZXYpIHtcclxuICAgIGlmKCFldi5wb2ludGVyVHlwZSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHB0ID0gZXYucG9pbnRlclR5cGUsXHJcbiAgICAgIHR5cGVzID0ge307XHJcbiAgICB0eXBlc1tIYW1tZXIuUE9JTlRFUl9NT1VTRV0gPSAocHQgPT09IGV2Lk1TUE9JTlRFUl9UWVBFX01PVVNFIHx8IHB0ID09PSBIYW1tZXIuUE9JTlRFUl9NT1VTRSk7XHJcbiAgICB0eXBlc1tIYW1tZXIuUE9JTlRFUl9UT1VDSF0gPSAocHQgPT09IGV2Lk1TUE9JTlRFUl9UWVBFX1RPVUNIIHx8IHB0ID09PSBIYW1tZXIuUE9JTlRFUl9UT1VDSCk7XHJcbiAgICB0eXBlc1tIYW1tZXIuUE9JTlRFUl9QRU5dID0gKHB0ID09PSBldi5NU1BPSU5URVJfVFlQRV9QRU4gfHwgcHQgPT09IEhhbW1lci5QT0lOVEVSX1BFTik7XHJcbiAgICByZXR1cm4gdHlwZXNbcG9pbnRlclR5cGVdO1xyXG4gIH0sXHJcblxyXG5cclxuICAvKipcclxuICAgKiBnZXQgZXZlbnRzXHJcbiAgICovXHJcbiAgZ2V0RXZlbnRzOiBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBbXHJcbiAgICAgICdwb2ludGVyZG93biBNU1BvaW50ZXJEb3duJyxcclxuICAgICAgJ3BvaW50ZXJtb3ZlIE1TUG9pbnRlck1vdmUnLFxyXG4gICAgICAncG9pbnRlcnVwIHBvaW50ZXJjYW5jZWwgTVNQb2ludGVyVXAgTVNQb2ludGVyQ2FuY2VsJ1xyXG4gICAgXTtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiByZXNldCB0aGUgbGlzdFxyXG4gICAqL1xyXG4gIHJlc2V0OiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMucG9pbnRlcnMgPSB7fTtcclxuICB9XHJcbn07XHJcblxyXG5cclxuSGFtbWVyLmRldGVjdGlvbiA9IHtcclxuICAvLyBjb250YWlucyBhbGwgcmVnaXN0cmVkIEhhbW1lci5nZXN0dXJlcyBpbiB0aGUgY29ycmVjdCBvcmRlclxyXG4gIGdlc3R1cmVzOiBbXSxcclxuXHJcbiAgLy8gZGF0YSBvZiB0aGUgY3VycmVudCBIYW1tZXIuZ2VzdHVyZSBkZXRlY3Rpb24gc2Vzc2lvblxyXG4gIGN1cnJlbnQgOiBudWxsLFxyXG5cclxuICAvLyB0aGUgcHJldmlvdXMgSGFtbWVyLmdlc3R1cmUgc2Vzc2lvbiBkYXRhXHJcbiAgLy8gaXMgYSBmdWxsIGNsb25lIG9mIHRoZSBwcmV2aW91cyBnZXN0dXJlLmN1cnJlbnQgb2JqZWN0XHJcbiAgcHJldmlvdXM6IG51bGwsXHJcblxyXG4gIC8vIHdoZW4gdGhpcyBiZWNvbWVzIHRydWUsIG5vIGdlc3R1cmVzIGFyZSBmaXJlZFxyXG4gIHN0b3BwZWQgOiBmYWxzZSxcclxuXHJcblxyXG4gIC8qKlxyXG4gICAqIHN0YXJ0IEhhbW1lci5nZXN0dXJlIGRldGVjdGlvblxyXG4gICAqIEBwYXJhbSAgIHtIYW1tZXIuSW5zdGFuY2V9ICAgaW5zdFxyXG4gICAqIEBwYXJhbSAgIHtPYmplY3R9ICAgICAgICAgICAgZXZlbnREYXRhXHJcbiAgICovXHJcbiAgc3RhcnREZXRlY3Q6IGZ1bmN0aW9uIHN0YXJ0RGV0ZWN0KGluc3QsIGV2ZW50RGF0YSkge1xyXG4gICAgLy8gYWxyZWFkeSBidXN5IHdpdGggYSBIYW1tZXIuZ2VzdHVyZSBkZXRlY3Rpb24gb24gYW4gZWxlbWVudFxyXG4gICAgaWYodGhpcy5jdXJyZW50KSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnN0b3BwZWQgPSBmYWxzZTtcclxuXHJcbiAgICB0aGlzLmN1cnJlbnQgPSB7XHJcbiAgICAgIGluc3QgICAgICA6IGluc3QsIC8vIHJlZmVyZW5jZSB0byBIYW1tZXJJbnN0YW5jZSB3ZSdyZSB3b3JraW5nIGZvclxyXG4gICAgICBzdGFydEV2ZW50OiBIYW1tZXIudXRpbHMuZXh0ZW5kKHt9LCBldmVudERhdGEpLCAvLyBzdGFydCBldmVudERhdGEgZm9yIGRpc3RhbmNlcywgdGltaW5nIGV0Y1xyXG4gICAgICBsYXN0RXZlbnQgOiBmYWxzZSwgLy8gbGFzdCBldmVudERhdGFcclxuICAgICAgbGFzdFZFdmVudDogZmFsc2UsIC8vIGxhc3QgZXZlbnREYXRhIGZvciB2ZWxvY2l0eS5cclxuICAgICAgdmVsb2NpdHkgIDogZmFsc2UsIC8vIGN1cnJlbnQgdmVsb2NpdHlcclxuICAgICAgbmFtZSAgICAgIDogJycgLy8gY3VycmVudCBnZXN0dXJlIHdlJ3JlIGluL2RldGVjdGVkLCBjYW4gYmUgJ3RhcCcsICdob2xkJyBldGNcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5kZXRlY3QoZXZlbnREYXRhKTtcclxuICB9LFxyXG5cclxuXHJcbiAgLyoqXHJcbiAgICogSGFtbWVyLmdlc3R1cmUgZGV0ZWN0aW9uXHJcbiAgICogQHBhcmFtICAge09iamVjdH0gICAgZXZlbnREYXRhXHJcbiAgICovXHJcbiAgZGV0ZWN0OiBmdW5jdGlvbiBkZXRlY3QoZXZlbnREYXRhKSB7XHJcbiAgICBpZighdGhpcy5jdXJyZW50IHx8IHRoaXMuc3RvcHBlZCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZXh0ZW5kIGV2ZW50IGRhdGEgd2l0aCBjYWxjdWxhdGlvbnMgYWJvdXQgc2NhbGUsIGRpc3RhbmNlIGV0Y1xyXG4gICAgZXZlbnREYXRhID0gdGhpcy5leHRlbmRFdmVudERhdGEoZXZlbnREYXRhKTtcclxuXHJcbiAgICAvLyBpbnN0YW5jZSBvcHRpb25zXHJcbiAgICB2YXIgaW5zdF9vcHRpb25zID0gdGhpcy5jdXJyZW50Lmluc3Qub3B0aW9ucztcclxuXHJcbiAgICAvLyBjYWxsIEhhbW1lci5nZXN0dXJlIGhhbmRsZXJzXHJcbiAgICBIYW1tZXIudXRpbHMuZWFjaCh0aGlzLmdlc3R1cmVzLCBmdW5jdGlvbihnZXN0dXJlKSB7XHJcbiAgICAgIC8vIG9ubHkgd2hlbiB0aGUgaW5zdGFuY2Ugb3B0aW9ucyBoYXZlIGVuYWJsZWQgdGhpcyBnZXN0dXJlXHJcbiAgICAgIGlmKCF0aGlzLnN0b3BwZWQgJiYgaW5zdF9vcHRpb25zW2dlc3R1cmUubmFtZV0gIT09IGZhbHNlKSB7XHJcbiAgICAgICAgLy8gaWYgYSBoYW5kbGVyIHJldHVybnMgZmFsc2UsIHdlIHN0b3Agd2l0aCB0aGUgZGV0ZWN0aW9uXHJcbiAgICAgICAgaWYoZ2VzdHVyZS5oYW5kbGVyLmNhbGwoZ2VzdHVyZSwgZXZlbnREYXRhLCB0aGlzLmN1cnJlbnQuaW5zdCkgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICB0aGlzLnN0b3BEZXRlY3QoKTtcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sIHRoaXMpO1xyXG5cclxuICAgIC8vIHN0b3JlIGFzIHByZXZpb3VzIGV2ZW50IGV2ZW50XHJcbiAgICBpZih0aGlzLmN1cnJlbnQpIHtcclxuICAgICAgdGhpcy5jdXJyZW50Lmxhc3RFdmVudCA9IGV2ZW50RGF0YTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBlbmRldmVudCwgYnV0IG5vdCB0aGUgbGFzdCB0b3VjaCwgc28gZG9udCBzdG9wXHJcbiAgICBpZihldmVudERhdGEuZXZlbnRUeXBlID09IEhhbW1lci5FVkVOVF9FTkQgJiYgIWV2ZW50RGF0YS50b3VjaGVzLmxlbmd0aCAtIDEpIHtcclxuICAgICAgdGhpcy5zdG9wRGV0ZWN0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGV2ZW50RGF0YTtcclxuICB9LFxyXG5cclxuXHJcbiAgLyoqXHJcbiAgICogY2xlYXIgdGhlIEhhbW1lci5nZXN0dXJlIHZhcnNcclxuICAgKiB0aGlzIGlzIGNhbGxlZCBvbiBlbmREZXRlY3QsIGJ1dCBjYW4gYWxzbyBiZSB1c2VkIHdoZW4gYSBmaW5hbCBIYW1tZXIuZ2VzdHVyZSBoYXMgYmVlbiBkZXRlY3RlZFxyXG4gICAqIHRvIHN0b3Agb3RoZXIgSGFtbWVyLmdlc3R1cmVzIGZyb20gYmVpbmcgZmlyZWRcclxuICAgKi9cclxuICBzdG9wRGV0ZWN0OiBmdW5jdGlvbiBzdG9wRGV0ZWN0KCkge1xyXG4gICAgLy8gY2xvbmUgY3VycmVudCBkYXRhIHRvIHRoZSBzdG9yZSBhcyB0aGUgcHJldmlvdXMgZ2VzdHVyZVxyXG4gICAgLy8gdXNlZCBmb3IgdGhlIGRvdWJsZSB0YXAgZ2VzdHVyZSwgc2luY2UgdGhpcyBpcyBhbiBvdGhlciBnZXN0dXJlIGRldGVjdCBzZXNzaW9uXHJcbiAgICB0aGlzLnByZXZpb3VzID0gSGFtbWVyLnV0aWxzLmV4dGVuZCh7fSwgdGhpcy5jdXJyZW50KTtcclxuXHJcbiAgICAvLyByZXNldCB0aGUgY3VycmVudFxyXG4gICAgdGhpcy5jdXJyZW50ID0gbnVsbDtcclxuXHJcbiAgICAvLyBzdG9wcGVkIVxyXG4gICAgdGhpcy5zdG9wcGVkID0gdHJ1ZTtcclxuICB9LFxyXG5cclxuXHJcbiAgLyoqXHJcbiAgICogZXh0ZW5kIGV2ZW50RGF0YSBmb3IgSGFtbWVyLmdlc3R1cmVzXHJcbiAgICogQHBhcmFtICAge09iamVjdH0gICBldlxyXG4gICAqIEByZXR1cm5zIHtPYmplY3R9ICAgZXZcclxuICAgKi9cclxuICBleHRlbmRFdmVudERhdGE6IGZ1bmN0aW9uIGV4dGVuZEV2ZW50RGF0YShldikge1xyXG4gICAgdmFyIHN0YXJ0RXYgPSB0aGlzLmN1cnJlbnQuc3RhcnRFdmVudCxcclxuICAgICAgICBsYXN0VkV2ID0gdGhpcy5jdXJyZW50Lmxhc3RWRXZlbnQ7XHJcblxyXG4gICAgLy8gaWYgdGhlIHRvdWNoZXMgY2hhbmdlLCBzZXQgdGhlIG5ldyB0b3VjaGVzIG92ZXIgdGhlIHN0YXJ0RXZlbnQgdG91Y2hlc1xyXG4gICAgLy8gdGhpcyBiZWNhdXNlIHRvdWNoZXZlbnRzIGRvbid0IGhhdmUgYWxsIHRoZSB0b3VjaGVzIG9uIHRvdWNoc3RhcnQsIG9yIHRoZVxyXG4gICAgLy8gdXNlciBtdXN0IHBsYWNlIGhpcyBmaW5nZXJzIGF0IHRoZSBFWEFDVCBzYW1lIHRpbWUgb24gdGhlIHNjcmVlbiwgd2hpY2ggaXMgbm90IHJlYWxpc3RpY1xyXG4gICAgLy8gYnV0LCBzb21ldGltZXMgaXQgaGFwcGVucyB0aGF0IGJvdGggZmluZ2VycyBhcmUgdG91Y2hpbmcgYXQgdGhlIEVYQUNUIHNhbWUgdGltZVxyXG4gICAgaWYoc3RhcnRFdiAmJiAoZXYudG91Y2hlcy5sZW5ndGggIT0gc3RhcnRFdi50b3VjaGVzLmxlbmd0aCB8fCBldi50b3VjaGVzID09PSBzdGFydEV2LnRvdWNoZXMpKSB7XHJcbiAgICAgIC8vIGV4dGVuZCAxIGxldmVsIGRlZXAgdG8gZ2V0IHRoZSB0b3VjaGxpc3Qgd2l0aCB0aGUgdG91Y2ggb2JqZWN0c1xyXG4gICAgICBzdGFydEV2LnRvdWNoZXMgPSBbXTtcclxuICAgICAgSGFtbWVyLnV0aWxzLmVhY2goZXYudG91Y2hlcywgZnVuY3Rpb24odG91Y2gpIHtcclxuICAgICAgICBzdGFydEV2LnRvdWNoZXMucHVzaChIYW1tZXIudXRpbHMuZXh0ZW5kKHt9LCB0b3VjaCkpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgZGVsdGFfdGltZSA9IGV2LnRpbWVTdGFtcCAtIHN0YXJ0RXYudGltZVN0YW1wXHJcbiAgICAgICwgZGVsdGFfeCA9IGV2LmNlbnRlci5wYWdlWCAtIHN0YXJ0RXYuY2VudGVyLnBhZ2VYXHJcbiAgICAgICwgZGVsdGFfeSA9IGV2LmNlbnRlci5wYWdlWSAtIHN0YXJ0RXYuY2VudGVyLnBhZ2VZXHJcbiAgICAgICwgaW50ZXJpbUFuZ2xlXHJcbiAgICAgICwgaW50ZXJpbURpcmVjdGlvblxyXG4gICAgICAsIHZlbG9jaXR5ID0gdGhpcy5jdXJyZW50LnZlbG9jaXR5O1xyXG4gIFxyXG4gICAgaWYgKGxhc3RWRXYgIT09IGZhbHNlICYmIGV2LnRpbWVTdGFtcCAtIGxhc3RWRXYudGltZVN0YW1wID4gSGFtbWVyLlVQREFURV9WRUxPQ0lUWV9JTlRFUlZBTCkge1xyXG4gIFxyXG4gICAgICAgIHZlbG9jaXR5ID0gIEhhbW1lci51dGlscy5nZXRWZWxvY2l0eShldi50aW1lU3RhbXAgLSBsYXN0VkV2LnRpbWVTdGFtcCwgZXYuY2VudGVyLnBhZ2VYIC0gbGFzdFZFdi5jZW50ZXIucGFnZVgsIGV2LmNlbnRlci5wYWdlWSAtIGxhc3RWRXYuY2VudGVyLnBhZ2VZKTtcclxuICAgICAgICB0aGlzLmN1cnJlbnQubGFzdFZFdmVudCA9IGV2O1xyXG4gIFxyXG4gICAgICAgIGlmICh2ZWxvY2l0eS54ID4gMCAmJiB2ZWxvY2l0eS55ID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnQudmVsb2NpdHkgPSB2ZWxvY2l0eTtcclxuICAgICAgICB9XHJcbiAgXHJcbiAgICB9IGVsc2UgaWYodGhpcy5jdXJyZW50LnZlbG9jaXR5ID09PSBmYWxzZSkge1xyXG4gICAgICAgIHZlbG9jaXR5ID0gSGFtbWVyLnV0aWxzLmdldFZlbG9jaXR5KGRlbHRhX3RpbWUsIGRlbHRhX3gsIGRlbHRhX3kpO1xyXG4gICAgICAgIHRoaXMuY3VycmVudC52ZWxvY2l0eSA9IHZlbG9jaXR5O1xyXG4gICAgICAgIHRoaXMuY3VycmVudC5sYXN0VkV2ZW50ID0gZXY7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZW5kIGV2ZW50cyAoZS5nLiBkcmFnZW5kKSBkb24ndCBoYXZlIHVzZWZ1bCB2YWx1ZXMgZm9yIGludGVyaW1EaXJlY3Rpb24gJiBpbnRlcmltQW5nbGVcclxuICAgIC8vIGJlY2F1c2UgdGhlIHByZXZpb3VzIGV2ZW50IGhhcyBleGFjdGx5IHRoZSBzYW1lIGNvb3JkaW5hdGVzXHJcbiAgICAvLyBzbyBmb3IgZW5kIGV2ZW50cywgdGFrZSB0aGUgcHJldmlvdXMgdmFsdWVzIG9mIGludGVyaW1EaXJlY3Rpb24gJiBpbnRlcmltQW5nbGVcclxuICAgIC8vIGluc3RlYWQgb2YgcmVjYWxjdWxhdGluZyB0aGVtIGFuZCBnZXR0aW5nIGEgc3B1cmlvdXMgJzAnXHJcbiAgICBpZihldi5ldmVudFR5cGUgPT09ICdlbmQnKSB7XHJcbiAgICAgIGludGVyaW1BbmdsZSA9IHRoaXMuY3VycmVudC5sYXN0RXZlbnQgJiYgdGhpcy5jdXJyZW50Lmxhc3RFdmVudC5pbnRlcmltQW5nbGU7XHJcbiAgICAgIGludGVyaW1EaXJlY3Rpb24gPSB0aGlzLmN1cnJlbnQubGFzdEV2ZW50ICYmIHRoaXMuY3VycmVudC5sYXN0RXZlbnQuaW50ZXJpbURpcmVjdGlvbjtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBpbnRlcmltQW5nbGUgPSB0aGlzLmN1cnJlbnQubGFzdEV2ZW50ICYmIEhhbW1lci51dGlscy5nZXRBbmdsZSh0aGlzLmN1cnJlbnQubGFzdEV2ZW50LmNlbnRlciwgZXYuY2VudGVyKTtcclxuICAgICAgaW50ZXJpbURpcmVjdGlvbiA9IHRoaXMuY3VycmVudC5sYXN0RXZlbnQgJiYgSGFtbWVyLnV0aWxzLmdldERpcmVjdGlvbih0aGlzLmN1cnJlbnQubGFzdEV2ZW50LmNlbnRlciwgZXYuY2VudGVyKTtcclxuICAgIH1cclxuXHJcbiAgICBIYW1tZXIudXRpbHMuZXh0ZW5kKGV2LCB7XHJcbiAgICAgIGRlbHRhVGltZTogZGVsdGFfdGltZSxcclxuXHJcbiAgICAgIGRlbHRhWDogZGVsdGFfeCxcclxuICAgICAgZGVsdGFZOiBkZWx0YV95LFxyXG5cclxuICAgICAgdmVsb2NpdHlYOiB2ZWxvY2l0eS54LFxyXG4gICAgICB2ZWxvY2l0eVk6IHZlbG9jaXR5LnksXHJcblxyXG4gICAgICBkaXN0YW5jZTogSGFtbWVyLnV0aWxzLmdldERpc3RhbmNlKHN0YXJ0RXYuY2VudGVyLCBldi5jZW50ZXIpLFxyXG5cclxuICAgICAgYW5nbGU6IEhhbW1lci51dGlscy5nZXRBbmdsZShzdGFydEV2LmNlbnRlciwgZXYuY2VudGVyKSxcclxuICAgICAgaW50ZXJpbUFuZ2xlOiBpbnRlcmltQW5nbGUsXHJcblxyXG4gICAgICBkaXJlY3Rpb246IEhhbW1lci51dGlscy5nZXREaXJlY3Rpb24oc3RhcnRFdi5jZW50ZXIsIGV2LmNlbnRlciksXHJcbiAgICAgIGludGVyaW1EaXJlY3Rpb246IGludGVyaW1EaXJlY3Rpb24sXHJcblxyXG4gICAgICBzY2FsZTogSGFtbWVyLnV0aWxzLmdldFNjYWxlKHN0YXJ0RXYudG91Y2hlcywgZXYudG91Y2hlcyksXHJcbiAgICAgIHJvdGF0aW9uOiBIYW1tZXIudXRpbHMuZ2V0Um90YXRpb24oc3RhcnRFdi50b3VjaGVzLCBldi50b3VjaGVzKSxcclxuXHJcbiAgICAgIHN0YXJ0RXZlbnQ6IHN0YXJ0RXZcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBldjtcclxuICB9LFxyXG5cclxuXHJcbiAgLyoqXHJcbiAgICogcmVnaXN0ZXIgbmV3IGdlc3R1cmVcclxuICAgKiBAcGFyYW0gICB7T2JqZWN0fSAgICBnZXN0dXJlIG9iamVjdCwgc2VlIGdlc3R1cmVzLmpzIGZvciBkb2N1bWVudGF0aW9uXHJcbiAgICogQHJldHVybnMge0FycmF5fSAgICAgZ2VzdHVyZXNcclxuICAgKi9cclxuICByZWdpc3RlcjogZnVuY3Rpb24gcmVnaXN0ZXIoZ2VzdHVyZSkge1xyXG4gICAgLy8gYWRkIGFuIGVuYWJsZSBnZXN0dXJlIG9wdGlvbnMgaWYgdGhlcmUgaXMgbm8gZ2l2ZW5cclxuICAgIHZhciBvcHRpb25zID0gZ2VzdHVyZS5kZWZhdWx0cyB8fCB7fTtcclxuICAgIGlmKG9wdGlvbnNbZ2VzdHVyZS5uYW1lXSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIG9wdGlvbnNbZ2VzdHVyZS5uYW1lXSA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZXh0ZW5kIEhhbW1lciBkZWZhdWx0IG9wdGlvbnMgd2l0aCB0aGUgSGFtbWVyLmdlc3R1cmUgb3B0aW9uc1xyXG4gICAgSGFtbWVyLnV0aWxzLmV4dGVuZChIYW1tZXIuZGVmYXVsdHMsIG9wdGlvbnMsIHRydWUpO1xyXG5cclxuICAgIC8vIHNldCBpdHMgaW5kZXhcclxuICAgIGdlc3R1cmUuaW5kZXggPSBnZXN0dXJlLmluZGV4IHx8IDEwMDA7XHJcblxyXG4gICAgLy8gYWRkIEhhbW1lci5nZXN0dXJlIHRvIHRoZSBsaXN0XHJcbiAgICB0aGlzLmdlc3R1cmVzLnB1c2goZ2VzdHVyZSk7XHJcblxyXG4gICAgLy8gc29ydCB0aGUgbGlzdCBieSBpbmRleFxyXG4gICAgdGhpcy5nZXN0dXJlcy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcclxuICAgICAgaWYoYS5pbmRleCA8IGIuaW5kZXgpIHsgcmV0dXJuIC0xOyB9XHJcbiAgICAgIGlmKGEuaW5kZXggPiBiLmluZGV4KSB7IHJldHVybiAxOyB9XHJcbiAgICAgIHJldHVybiAwO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuZ2VzdHVyZXM7XHJcbiAgfVxyXG59O1xyXG5cclxuXHJcbi8qKlxyXG4gKiBEcmFnXHJcbiAqIE1vdmUgd2l0aCB4IGZpbmdlcnMgKGRlZmF1bHQgMSkgYXJvdW5kIG9uIHRoZSBwYWdlLiBCbG9ja2luZyB0aGUgc2Nyb2xsaW5nIHdoZW5cclxuICogbW92aW5nIGxlZnQgYW5kIHJpZ2h0IGlzIGEgZ29vZCBwcmFjdGljZS4gV2hlbiBhbGwgdGhlIGRyYWcgZXZlbnRzIGFyZSBibG9ja2luZ1xyXG4gKiB5b3UgZGlzYWJsZSBzY3JvbGxpbmcgb24gdGhhdCBhcmVhLlxyXG4gKiBAZXZlbnRzICBkcmFnLCBkcmFwbGVmdCwgZHJhZ3JpZ2h0LCBkcmFndXAsIGRyYWdkb3duXHJcbiAqL1xyXG5IYW1tZXIuZ2VzdHVyZXMuRHJhZyA9IHtcclxuICBuYW1lICAgICA6ICdkcmFnJyxcclxuICBpbmRleCAgICA6IDUwLFxyXG4gIGRlZmF1bHRzIDoge1xyXG4gICAgZHJhZ19taW5fZGlzdGFuY2UgICAgICAgICAgICA6IDEwLFxyXG5cclxuICAgIC8vIFNldCBjb3JyZWN0X2Zvcl9kcmFnX21pbl9kaXN0YW5jZSB0byB0cnVlIHRvIG1ha2UgdGhlIHN0YXJ0aW5nIHBvaW50IG9mIHRoZSBkcmFnXHJcbiAgICAvLyBiZSBjYWxjdWxhdGVkIGZyb20gd2hlcmUgdGhlIGRyYWcgd2FzIHRyaWdnZXJlZCwgbm90IGZyb20gd2hlcmUgdGhlIHRvdWNoIHN0YXJ0ZWQuXHJcbiAgICAvLyBVc2VmdWwgdG8gYXZvaWQgYSBqZXJrLXN0YXJ0aW5nIGRyYWcsIHdoaWNoIGNhbiBtYWtlIGZpbmUtYWRqdXN0bWVudHNcclxuICAgIC8vIHRocm91Z2ggZHJhZ2dpbmcgZGlmZmljdWx0LCBhbmQgYmUgdmlzdWFsbHkgdW5hcHBlYWxpbmcuXHJcbiAgICBjb3JyZWN0X2Zvcl9kcmFnX21pbl9kaXN0YW5jZTogdHJ1ZSxcclxuXHJcbiAgICAvLyBzZXQgMCBmb3IgdW5saW1pdGVkLCBidXQgdGhpcyBjYW4gY29uZmxpY3Qgd2l0aCB0cmFuc2Zvcm1cclxuICAgIGRyYWdfbWF4X3RvdWNoZXMgICAgICAgICAgICAgOiAxLFxyXG5cclxuICAgIC8vIHByZXZlbnQgZGVmYXVsdCBicm93c2VyIGJlaGF2aW9yIHdoZW4gZHJhZ2dpbmcgb2NjdXJzXHJcbiAgICAvLyBiZSBjYXJlZnVsIHdpdGggaXQsIGl0IG1ha2VzIHRoZSBlbGVtZW50IGEgYmxvY2tpbmcgZWxlbWVudFxyXG4gICAgLy8gd2hlbiB5b3UgYXJlIHVzaW5nIHRoZSBkcmFnIGdlc3R1cmUsIGl0IGlzIGEgZ29vZCBwcmFjdGljZSB0byBzZXQgdGhpcyB0cnVlXHJcbiAgICBkcmFnX2Jsb2NrX2hvcml6b250YWwgICAgICAgIDogZmFsc2UsXHJcbiAgICBkcmFnX2Jsb2NrX3ZlcnRpY2FsICAgICAgICAgIDogZmFsc2UsXHJcblxyXG4gICAgLy8gZHJhZ19sb2NrX3RvX2F4aXMga2VlcHMgdGhlIGRyYWcgZ2VzdHVyZSBvbiB0aGUgYXhpcyB0aGF0IGl0IHN0YXJ0ZWQgb24sXHJcbiAgICAvLyBJdCBkaXNhbGxvd3MgdmVydGljYWwgZGlyZWN0aW9ucyBpZiB0aGUgaW5pdGlhbCBkaXJlY3Rpb24gd2FzIGhvcml6b250YWwsIGFuZCB2aWNlIHZlcnNhLlxyXG4gICAgZHJhZ19sb2NrX3RvX2F4aXMgICAgICAgICAgICA6IGZhbHNlLFxyXG5cclxuICAgIC8vIGRyYWcgbG9jayBvbmx5IGtpY2tzIGluIHdoZW4gZGlzdGFuY2UgPiBkcmFnX2xvY2tfbWluX2Rpc3RhbmNlXHJcbiAgICAvLyBUaGlzIHdheSwgbG9ja2luZyBvY2N1cnMgb25seSB3aGVuIHRoZSBkaXN0YW5jZSBoYXMgYmVjb21lIGxhcmdlIGVub3VnaCB0byByZWxpYWJseSBkZXRlcm1pbmUgdGhlIGRpcmVjdGlvblxyXG4gICAgZHJhZ19sb2NrX21pbl9kaXN0YW5jZSAgICAgICA6IDI1XHJcbiAgfSxcclxuXHJcbiAgdHJpZ2dlcmVkOiBmYWxzZSxcclxuICBoYW5kbGVyICA6IGZ1bmN0aW9uIGRyYWdHZXN0dXJlKGV2LCBpbnN0KSB7XHJcbiAgICAvLyBjdXJyZW50IGdlc3R1cmUgaXNudCBkcmFnLCBidXQgZHJhZ2dlZCBpcyB0cnVlXHJcbiAgICAvLyB0aGlzIG1lYW5zIGFuIG90aGVyIGdlc3R1cmUgaXMgYnVzeS4gbm93IGNhbGwgZHJhZ2VuZFxyXG4gICAgaWYoSGFtbWVyLmRldGVjdGlvbi5jdXJyZW50Lm5hbWUgIT0gdGhpcy5uYW1lICYmIHRoaXMudHJpZ2dlcmVkKSB7XHJcbiAgICAgIGluc3QudHJpZ2dlcih0aGlzLm5hbWUgKyAnZW5kJywgZXYpO1xyXG4gICAgICB0aGlzLnRyaWdnZXJlZCA9IGZhbHNlO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gbWF4IHRvdWNoZXNcclxuICAgIGlmKGluc3Qub3B0aW9ucy5kcmFnX21heF90b3VjaGVzID4gMCAmJlxyXG4gICAgICBldi50b3VjaGVzLmxlbmd0aCA+IGluc3Qub3B0aW9ucy5kcmFnX21heF90b3VjaGVzKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBzd2l0Y2goZXYuZXZlbnRUeXBlKSB7XHJcbiAgICAgIGNhc2UgSGFtbWVyLkVWRU5UX1NUQVJUOlxyXG4gICAgICAgIHRoaXMudHJpZ2dlcmVkID0gZmFsc2U7XHJcbiAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICBjYXNlIEhhbW1lci5FVkVOVF9NT1ZFOlxyXG4gICAgICAgIC8vIHdoZW4gdGhlIGRpc3RhbmNlIHdlIG1vdmVkIGlzIHRvbyBzbWFsbCB3ZSBza2lwIHRoaXMgZ2VzdHVyZVxyXG4gICAgICAgIC8vIG9yIHdlIGNhbiBiZSBhbHJlYWR5IGluIGRyYWdnaW5nXHJcbiAgICAgICAgaWYoZXYuZGlzdGFuY2UgPCBpbnN0Lm9wdGlvbnMuZHJhZ19taW5fZGlzdGFuY2UgJiZcclxuICAgICAgICAgIEhhbW1lci5kZXRlY3Rpb24uY3VycmVudC5uYW1lICE9IHRoaXMubmFtZSkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gd2UgYXJlIGRyYWdnaW5nIVxyXG4gICAgICAgIGlmKEhhbW1lci5kZXRlY3Rpb24uY3VycmVudC5uYW1lICE9IHRoaXMubmFtZSkge1xyXG4gICAgICAgICAgSGFtbWVyLmRldGVjdGlvbi5jdXJyZW50Lm5hbWUgPSB0aGlzLm5hbWU7XHJcbiAgICAgICAgICBpZihpbnN0Lm9wdGlvbnMuY29ycmVjdF9mb3JfZHJhZ19taW5fZGlzdGFuY2UgJiYgZXYuZGlzdGFuY2UgPiAwKSB7XHJcbiAgICAgICAgICAgIC8vIFdoZW4gYSBkcmFnIGlzIHRyaWdnZXJlZCwgc2V0IHRoZSBldmVudCBjZW50ZXIgdG8gZHJhZ19taW5fZGlzdGFuY2UgcGl4ZWxzIGZyb20gdGhlIG9yaWdpbmFsIGV2ZW50IGNlbnRlci5cclxuICAgICAgICAgICAgLy8gV2l0aG91dCB0aGlzIGNvcnJlY3Rpb24sIHRoZSBkcmFnZ2VkIGRpc3RhbmNlIHdvdWxkIGp1bXBzdGFydCBhdCBkcmFnX21pbl9kaXN0YW5jZSBwaXhlbHMgaW5zdGVhZCBvZiBhdCAwLlxyXG4gICAgICAgICAgICAvLyBJdCBtaWdodCBiZSB1c2VmdWwgdG8gc2F2ZSB0aGUgb3JpZ2luYWwgc3RhcnQgcG9pbnQgc29tZXdoZXJlXHJcbiAgICAgICAgICAgIHZhciBmYWN0b3IgPSBNYXRoLmFicyhpbnN0Lm9wdGlvbnMuZHJhZ19taW5fZGlzdGFuY2UgLyBldi5kaXN0YW5jZSk7XHJcbiAgICAgICAgICAgIEhhbW1lci5kZXRlY3Rpb24uY3VycmVudC5zdGFydEV2ZW50LmNlbnRlci5wYWdlWCArPSBldi5kZWx0YVggKiBmYWN0b3I7XHJcbiAgICAgICAgICAgIEhhbW1lci5kZXRlY3Rpb24uY3VycmVudC5zdGFydEV2ZW50LmNlbnRlci5wYWdlWSArPSBldi5kZWx0YVkgKiBmYWN0b3I7XHJcblxyXG4gICAgICAgICAgICAvLyByZWNhbGN1bGF0ZSBldmVudCBkYXRhIHVzaW5nIG5ldyBzdGFydCBwb2ludFxyXG4gICAgICAgICAgICBldiA9IEhhbW1lci5kZXRlY3Rpb24uZXh0ZW5kRXZlbnREYXRhKGV2KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGxvY2sgZHJhZyB0byBheGlzP1xyXG4gICAgICAgIGlmKEhhbW1lci5kZXRlY3Rpb24uY3VycmVudC5sYXN0RXZlbnQuZHJhZ19sb2NrZWRfdG9fYXhpcyB8fCAoaW5zdC5vcHRpb25zLmRyYWdfbG9ja190b19heGlzICYmIGluc3Qub3B0aW9ucy5kcmFnX2xvY2tfbWluX2Rpc3RhbmNlIDw9IGV2LmRpc3RhbmNlKSkge1xyXG4gICAgICAgICAgZXYuZHJhZ19sb2NrZWRfdG9fYXhpcyA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBsYXN0X2RpcmVjdGlvbiA9IEhhbW1lci5kZXRlY3Rpb24uY3VycmVudC5sYXN0RXZlbnQuZGlyZWN0aW9uO1xyXG4gICAgICAgIGlmKGV2LmRyYWdfbG9ja2VkX3RvX2F4aXMgJiYgbGFzdF9kaXJlY3Rpb24gIT09IGV2LmRpcmVjdGlvbikge1xyXG4gICAgICAgICAgLy8ga2VlcCBkaXJlY3Rpb24gb24gdGhlIGF4aXMgdGhhdCB0aGUgZHJhZyBnZXN0dXJlIHN0YXJ0ZWQgb25cclxuICAgICAgICAgIGlmKEhhbW1lci51dGlscy5pc1ZlcnRpY2FsKGxhc3RfZGlyZWN0aW9uKSkge1xyXG4gICAgICAgICAgICBldi5kaXJlY3Rpb24gPSAoZXYuZGVsdGFZIDwgMCkgPyBIYW1tZXIuRElSRUNUSU9OX1VQIDogSGFtbWVyLkRJUkVDVElPTl9ET1dOO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGV2LmRpcmVjdGlvbiA9IChldi5kZWx0YVggPCAwKSA/IEhhbW1lci5ESVJFQ1RJT05fTEVGVCA6IEhhbW1lci5ESVJFQ1RJT05fUklHSFQ7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBmaXJzdCB0aW1lLCB0cmlnZ2VyIGRyYWdzdGFydCBldmVudFxyXG4gICAgICAgIGlmKCF0aGlzLnRyaWdnZXJlZCkge1xyXG4gICAgICAgICAgaW5zdC50cmlnZ2VyKHRoaXMubmFtZSArICdzdGFydCcsIGV2KTtcclxuICAgICAgICAgIHRoaXMudHJpZ2dlcmVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHRyaWdnZXIgbm9ybWFsIGV2ZW50XHJcbiAgICAgICAgaW5zdC50cmlnZ2VyKHRoaXMubmFtZSwgZXYpO1xyXG5cclxuICAgICAgICAvLyBkaXJlY3Rpb24gZXZlbnQsIGxpa2UgZHJhZ2Rvd25cclxuICAgICAgICBpbnN0LnRyaWdnZXIodGhpcy5uYW1lICsgZXYuZGlyZWN0aW9uLCBldik7XHJcblxyXG4gICAgICAgIC8vIGJsb2NrIHRoZSBicm93c2VyIGV2ZW50c1xyXG4gICAgICAgIGlmKChpbnN0Lm9wdGlvbnMuZHJhZ19ibG9ja192ZXJ0aWNhbCAmJiBIYW1tZXIudXRpbHMuaXNWZXJ0aWNhbChldi5kaXJlY3Rpb24pKSB8fFxyXG4gICAgICAgICAgKGluc3Qub3B0aW9ucy5kcmFnX2Jsb2NrX2hvcml6b250YWwgJiYgIUhhbW1lci51dGlscy5pc1ZlcnRpY2FsKGV2LmRpcmVjdGlvbikpKSB7XHJcbiAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIGNhc2UgSGFtbWVyLkVWRU5UX0VORDpcclxuICAgICAgICAvLyB0cmlnZ2VyIGRyYWdlbmRcclxuICAgICAgICBpZih0aGlzLnRyaWdnZXJlZCkge1xyXG4gICAgICAgICAgaW5zdC50cmlnZ2VyKHRoaXMubmFtZSArICdlbmQnLCBldik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnRyaWdnZXJlZCA9IGZhbHNlO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBIb2xkXHJcbiAqIFRvdWNoIHN0YXlzIGF0IHRoZSBzYW1lIHBsYWNlIGZvciB4IHRpbWVcclxuICogQGV2ZW50cyAgaG9sZFxyXG4gKi9cclxuSGFtbWVyLmdlc3R1cmVzLkhvbGQgPSB7XHJcbiAgbmFtZSAgICA6ICdob2xkJyxcclxuICBpbmRleCAgIDogMTAsXHJcbiAgZGVmYXVsdHM6IHtcclxuICAgIGhvbGRfdGltZW91dCAgOiA1MDAsXHJcbiAgICBob2xkX3RocmVzaG9sZDogMVxyXG4gIH0sXHJcbiAgdGltZXIgICA6IG51bGwsXHJcbiAgaGFuZGxlciA6IGZ1bmN0aW9uIGhvbGRHZXN0dXJlKGV2LCBpbnN0KSB7XHJcbiAgICBzd2l0Y2goZXYuZXZlbnRUeXBlKSB7XHJcbiAgICAgIGNhc2UgSGFtbWVyLkVWRU5UX1NUQVJUOlxyXG4gICAgICAgIC8vIGNsZWFyIGFueSBydW5uaW5nIHRpbWVyc1xyXG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVyKTtcclxuXHJcbiAgICAgICAgLy8gc2V0IHRoZSBnZXN0dXJlIHNvIHdlIGNhbiBjaGVjayBpbiB0aGUgdGltZW91dCBpZiBpdCBzdGlsbCBpc1xyXG4gICAgICAgIEhhbW1lci5kZXRlY3Rpb24uY3VycmVudC5uYW1lID0gdGhpcy5uYW1lO1xyXG5cclxuICAgICAgICAvLyBzZXQgdGltZXIgYW5kIGlmIGFmdGVyIHRoZSB0aW1lb3V0IGl0IHN0aWxsIGlzIGhvbGQsXHJcbiAgICAgICAgLy8gd2UgdHJpZ2dlciB0aGUgaG9sZCBldmVudFxyXG4gICAgICAgIHRoaXMudGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgaWYoSGFtbWVyLmRldGVjdGlvbi5jdXJyZW50Lm5hbWUgPT0gJ2hvbGQnKSB7XHJcbiAgICAgICAgICAgIGluc3QudHJpZ2dlcignaG9sZCcsIGV2KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LCBpbnN0Lm9wdGlvbnMuaG9sZF90aW1lb3V0KTtcclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIC8vIHdoZW4geW91IG1vdmUgb3IgZW5kIHdlIGNsZWFyIHRoZSB0aW1lclxyXG4gICAgICBjYXNlIEhhbW1lci5FVkVOVF9NT1ZFOlxyXG4gICAgICAgIGlmKGV2LmRpc3RhbmNlID4gaW5zdC5vcHRpb25zLmhvbGRfdGhyZXNob2xkKSB7XHJcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgY2FzZSBIYW1tZXIuRVZFTlRfRU5EOlxyXG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVyKTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogUmVsZWFzZVxyXG4gKiBDYWxsZWQgYXMgbGFzdCwgdGVsbHMgdGhlIHVzZXIgaGFzIHJlbGVhc2VkIHRoZSBzY3JlZW5cclxuICogQGV2ZW50cyAgcmVsZWFzZVxyXG4gKi9cclxuSGFtbWVyLmdlc3R1cmVzLlJlbGVhc2UgPSB7XHJcbiAgbmFtZSAgIDogJ3JlbGVhc2UnLFxyXG4gIGluZGV4ICA6IEluZmluaXR5LFxyXG4gIGhhbmRsZXI6IGZ1bmN0aW9uIHJlbGVhc2VHZXN0dXJlKGV2LCBpbnN0KSB7XHJcbiAgICBpZihldi5ldmVudFR5cGUgPT0gSGFtbWVyLkVWRU5UX0VORCkge1xyXG4gICAgICBpbnN0LnRyaWdnZXIodGhpcy5uYW1lLCBldik7XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIFN3aXBlXHJcbiAqIHRyaWdnZXJzIHN3aXBlIGV2ZW50cyB3aGVuIHRoZSBlbmQgdmVsb2NpdHkgaXMgYWJvdmUgdGhlIHRocmVzaG9sZFxyXG4gKiBAZXZlbnRzICBzd2lwZSwgc3dpcGVsZWZ0LCBzd2lwZXJpZ2h0LCBzd2lwZXVwLCBzd2lwZWRvd25cclxuICovXHJcbkhhbW1lci5nZXN0dXJlcy5Td2lwZSA9IHtcclxuICBuYW1lICAgIDogJ3N3aXBlJyxcclxuICBpbmRleCAgIDogNDAsXHJcbiAgZGVmYXVsdHM6IHtcclxuICAgIC8vIHNldCAwIGZvciB1bmxpbWl0ZWQsIGJ1dCB0aGlzIGNhbiBjb25mbGljdCB3aXRoIHRyYW5zZm9ybVxyXG4gICAgc3dpcGVfbWluX3RvdWNoZXM6IDEsXHJcbiAgICBzd2lwZV9tYXhfdG91Y2hlczogMSxcclxuICAgIHN3aXBlX3ZlbG9jaXR5ICAgOiAwLjdcclxuICB9LFxyXG4gIGhhbmRsZXIgOiBmdW5jdGlvbiBzd2lwZUdlc3R1cmUoZXYsIGluc3QpIHtcclxuICAgIGlmKGV2LmV2ZW50VHlwZSA9PSBIYW1tZXIuRVZFTlRfRU5EKSB7XHJcbiAgICAgIC8vIG1heCB0b3VjaGVzXHJcbiAgICAgIGlmKGluc3Qub3B0aW9ucy5zd2lwZV9tYXhfdG91Y2hlcyA+IDAgJiZcclxuICAgICAgICBldi50b3VjaGVzLmxlbmd0aCA8IGluc3Qub3B0aW9ucy5zd2lwZV9taW5fdG91Y2hlcyAmJlxyXG4gICAgICAgIGV2LnRvdWNoZXMubGVuZ3RoID4gaW5zdC5vcHRpb25zLnN3aXBlX21heF90b3VjaGVzKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyB3aGVuIHRoZSBkaXN0YW5jZSB3ZSBtb3ZlZCBpcyB0b28gc21hbGwgd2Ugc2tpcCB0aGlzIGdlc3R1cmVcclxuICAgICAgLy8gb3Igd2UgY2FuIGJlIGFscmVhZHkgaW4gZHJhZ2dpbmdcclxuICAgICAgaWYoZXYudmVsb2NpdHlYID4gaW5zdC5vcHRpb25zLnN3aXBlX3ZlbG9jaXR5IHx8XHJcbiAgICAgICAgZXYudmVsb2NpdHlZID4gaW5zdC5vcHRpb25zLnN3aXBlX3ZlbG9jaXR5KSB7XHJcbiAgICAgICAgLy8gdHJpZ2dlciBzd2lwZSBldmVudHNcclxuICAgICAgICBpbnN0LnRyaWdnZXIodGhpcy5uYW1lLCBldik7XHJcbiAgICAgICAgaW5zdC50cmlnZ2VyKHRoaXMubmFtZSArIGV2LmRpcmVjdGlvbiwgZXYpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRhcC9Eb3VibGVUYXBcclxuICogUXVpY2sgdG91Y2ggYXQgYSBwbGFjZSBvciBkb3VibGUgYXQgdGhlIHNhbWUgcGxhY2VcclxuICogQGV2ZW50cyAgdGFwLCBkb3VibGV0YXBcclxuICovXHJcbkhhbW1lci5nZXN0dXJlcy5UYXAgPSB7XHJcbiAgbmFtZSAgICA6ICd0YXAnLFxyXG4gIGluZGV4ICAgOiAxMDAsXHJcbiAgZGVmYXVsdHM6IHtcclxuICAgIHRhcF9tYXhfdG91Y2h0aW1lIDogMjUwLFxyXG4gICAgdGFwX21heF9kaXN0YW5jZSAgOiAxMCxcclxuICAgIHRhcF9hbHdheXMgICAgICAgIDogdHJ1ZSxcclxuICAgIGRvdWJsZXRhcF9kaXN0YW5jZTogMjAsXHJcbiAgICBkb3VibGV0YXBfaW50ZXJ2YWw6IDMwMFxyXG4gIH0sXHJcbiAgaGFuZGxlciA6IGZ1bmN0aW9uIHRhcEdlc3R1cmUoZXYsIGluc3QpIHtcclxuICAgIGlmKGV2LmV2ZW50VHlwZSA9PSBIYW1tZXIuRVZFTlRfTU9WRSAmJiAhSGFtbWVyLmRldGVjdGlvbi5jdXJyZW50LnJlYWNoZWRUYXBNYXhEaXN0YW5jZSkge1xyXG4gICAgICAvL1RyYWNrIHRoZSBkaXN0YW5jZSB3ZSd2ZSBtb3ZlZC4gSWYgaXQncyBhYm92ZSB0aGUgbWF4IE9OQ0UsIHJlbWVtYmVyIHRoYXQgKGZpeGVzICM0MDYpLlxyXG4gICAgICBIYW1tZXIuZGV0ZWN0aW9uLmN1cnJlbnQucmVhY2hlZFRhcE1heERpc3RhbmNlID0gKGV2LmRpc3RhbmNlID4gaW5zdC5vcHRpb25zLnRhcF9tYXhfZGlzdGFuY2UpO1xyXG4gICAgfSBlbHNlIGlmKGV2LmV2ZW50VHlwZSA9PSBIYW1tZXIuRVZFTlRfRU5EICYmIGV2LnNyY0V2ZW50LnR5cGUgIT0gJ3RvdWNoY2FuY2VsJykge1xyXG4gICAgICAvLyBwcmV2aW91cyBnZXN0dXJlLCBmb3IgdGhlIGRvdWJsZSB0YXAgc2luY2UgdGhlc2UgYXJlIHR3byBkaWZmZXJlbnQgZ2VzdHVyZSBkZXRlY3Rpb25zXHJcbiAgICAgIHZhciBwcmV2ID0gSGFtbWVyLmRldGVjdGlvbi5wcmV2aW91cyxcclxuICAgICAgICBkaWRfZG91YmxldGFwID0gZmFsc2U7XHJcblxyXG4gICAgICAvLyB3aGVuIHRoZSB0b3VjaHRpbWUgaXMgaGlnaGVyIHRoZW4gdGhlIG1heCB0b3VjaCB0aW1lXHJcbiAgICAgIC8vIG9yIHdoZW4gdGhlIG1vdmluZyBkaXN0YW5jZSBpcyB0b28gbXVjaFxyXG4gICAgICBpZihIYW1tZXIuZGV0ZWN0aW9uLmN1cnJlbnQucmVhY2hlZFRhcE1heERpc3RhbmNlIHx8IGV2LmRlbHRhVGltZSA+IGluc3Qub3B0aW9ucy50YXBfbWF4X3RvdWNodGltZSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gY2hlY2sgaWYgZG91YmxlIHRhcFxyXG4gICAgICBpZihwcmV2ICYmIHByZXYubmFtZSA9PSAndGFwJyAmJlxyXG4gICAgICAgIChldi50aW1lU3RhbXAgLSBwcmV2Lmxhc3RFdmVudC50aW1lU3RhbXApIDwgaW5zdC5vcHRpb25zLmRvdWJsZXRhcF9pbnRlcnZhbCAmJlxyXG4gICAgICAgIGV2LmRpc3RhbmNlIDwgaW5zdC5vcHRpb25zLmRvdWJsZXRhcF9kaXN0YW5jZSkge1xyXG4gICAgICAgIGluc3QudHJpZ2dlcignZG91YmxldGFwJywgZXYpO1xyXG4gICAgICAgIGRpZF9kb3VibGV0YXAgPSB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBkbyBhIHNpbmdsZSB0YXBcclxuICAgICAgaWYoIWRpZF9kb3VibGV0YXAgfHwgaW5zdC5vcHRpb25zLnRhcF9hbHdheXMpIHtcclxuICAgICAgICBIYW1tZXIuZGV0ZWN0aW9uLmN1cnJlbnQubmFtZSA9ICd0YXAnO1xyXG4gICAgICAgIGluc3QudHJpZ2dlcihIYW1tZXIuZGV0ZWN0aW9uLmN1cnJlbnQubmFtZSwgZXYpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRvdWNoXHJcbiAqIENhbGxlZCBhcyBmaXJzdCwgdGVsbHMgdGhlIHVzZXIgaGFzIHRvdWNoZWQgdGhlIHNjcmVlblxyXG4gKiBAZXZlbnRzICB0b3VjaFxyXG4gKi9cclxuSGFtbWVyLmdlc3R1cmVzLlRvdWNoID0ge1xyXG4gIG5hbWUgICAgOiAndG91Y2gnLFxyXG4gIGluZGV4ICAgOiAtSW5maW5pdHksXHJcbiAgZGVmYXVsdHM6IHtcclxuICAgIC8vIGNhbGwgcHJldmVudERlZmF1bHQgYXQgdG91Y2hzdGFydCwgYW5kIG1ha2VzIHRoZSBlbGVtZW50IGJsb2NraW5nIGJ5XHJcbiAgICAvLyBkaXNhYmxpbmcgdGhlIHNjcm9sbGluZyBvZiB0aGUgcGFnZSwgYnV0IGl0IGltcHJvdmVzIGdlc3R1cmVzIGxpa2VcclxuICAgIC8vIHRyYW5zZm9ybWluZyBhbmQgZHJhZ2dpbmcuXHJcbiAgICAvLyBiZSBjYXJlZnVsIHdpdGggdXNpbmcgdGhpcywgaXQgY2FuIGJlIHZlcnkgYW5ub3lpbmcgZm9yIHVzZXJzIHRvIGJlIHN0dWNrXHJcbiAgICAvLyBvbiB0aGUgcGFnZVxyXG4gICAgcHJldmVudF9kZWZhdWx0ICAgIDogZmFsc2UsXHJcblxyXG4gICAgLy8gZGlzYWJsZSBtb3VzZSBldmVudHMsIHNvIG9ubHkgdG91Y2ggKG9yIHBlbiEpIGlucHV0IHRyaWdnZXJzIGV2ZW50c1xyXG4gICAgcHJldmVudF9tb3VzZWV2ZW50czogZmFsc2VcclxuICB9LFxyXG4gIGhhbmRsZXIgOiBmdW5jdGlvbiB0b3VjaEdlc3R1cmUoZXYsIGluc3QpIHtcclxuICAgIGlmKGluc3Qub3B0aW9ucy5wcmV2ZW50X21vdXNlZXZlbnRzICYmIGV2LnBvaW50ZXJUeXBlID09IEhhbW1lci5QT0lOVEVSX01PVVNFKSB7XHJcbiAgICAgIGV2LnN0b3BEZXRlY3QoKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKGluc3Qub3B0aW9ucy5wcmV2ZW50X2RlZmF1bHQpIHtcclxuICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcclxuICAgIH1cclxuXHJcbiAgICBpZihldi5ldmVudFR5cGUgPT0gSGFtbWVyLkVWRU5UX1NUQVJUKSB7XHJcbiAgICAgIGluc3QudHJpZ2dlcih0aGlzLm5hbWUsIGV2KTtcclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG5cclxuLyoqXHJcbiAqIFRyYW5zZm9ybVxyXG4gKiBVc2VyIHdhbnQgdG8gc2NhbGUgb3Igcm90YXRlIHdpdGggMiBmaW5nZXJzXHJcbiAqIEBldmVudHMgIHRyYW5zZm9ybSwgcGluY2gsIHBpbmNoaW4sIHBpbmNob3V0LCByb3RhdGVcclxuICovXHJcbkhhbW1lci5nZXN0dXJlcy5UcmFuc2Zvcm0gPSB7XHJcbiAgbmFtZSAgICAgOiAndHJhbnNmb3JtJyxcclxuICBpbmRleCAgICA6IDQ1LFxyXG4gIGRlZmF1bHRzIDoge1xyXG4gICAgLy8gZmFjdG9yLCBubyBzY2FsZSBpcyAxLCB6b29taW4gaXMgdG8gMCBhbmQgem9vbW91dCB1bnRpbCBoaWdoZXIgdGhlbiAxXHJcbiAgICB0cmFuc2Zvcm1fbWluX3NjYWxlICAgOiAwLjAxLFxyXG4gICAgLy8gcm90YXRpb24gaW4gZGVncmVlc1xyXG4gICAgdHJhbnNmb3JtX21pbl9yb3RhdGlvbjogMSxcclxuICAgIC8vIHByZXZlbnQgZGVmYXVsdCBicm93c2VyIGJlaGF2aW9yIHdoZW4gdHdvIHRvdWNoZXMgYXJlIG9uIHRoZSBzY3JlZW5cclxuICAgIC8vIGJ1dCBpdCBtYWtlcyB0aGUgZWxlbWVudCBhIGJsb2NraW5nIGVsZW1lbnRcclxuICAgIC8vIHdoZW4geW91IGFyZSB1c2luZyB0aGUgdHJhbnNmb3JtIGdlc3R1cmUsIGl0IGlzIGEgZ29vZCBwcmFjdGljZSB0byBzZXQgdGhpcyB0cnVlXHJcbiAgICB0cmFuc2Zvcm1fYWx3YXlzX2Jsb2NrOiBmYWxzZVxyXG4gIH0sXHJcbiAgdHJpZ2dlcmVkOiBmYWxzZSxcclxuICBoYW5kbGVyICA6IGZ1bmN0aW9uIHRyYW5zZm9ybUdlc3R1cmUoZXYsIGluc3QpIHtcclxuICAgIC8vIGN1cnJlbnQgZ2VzdHVyZSBpc250IGRyYWcsIGJ1dCBkcmFnZ2VkIGlzIHRydWVcclxuICAgIC8vIHRoaXMgbWVhbnMgYW4gb3RoZXIgZ2VzdHVyZSBpcyBidXN5LiBub3cgY2FsbCBkcmFnZW5kXHJcbiAgICBpZihIYW1tZXIuZGV0ZWN0aW9uLmN1cnJlbnQubmFtZSAhPSB0aGlzLm5hbWUgJiYgdGhpcy50cmlnZ2VyZWQpIHtcclxuICAgICAgaW5zdC50cmlnZ2VyKHRoaXMubmFtZSArICdlbmQnLCBldik7XHJcbiAgICAgIHRoaXMudHJpZ2dlcmVkID0gZmFsc2U7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBhdGxlYXN0IG11bHRpdG91Y2hcclxuICAgIGlmKGV2LnRvdWNoZXMubGVuZ3RoIDwgMikge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHJldmVudCBkZWZhdWx0IHdoZW4gdHdvIGZpbmdlcnMgYXJlIG9uIHRoZSBzY3JlZW5cclxuICAgIGlmKGluc3Qub3B0aW9ucy50cmFuc2Zvcm1fYWx3YXlzX2Jsb2NrKSB7XHJcbiAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3dpdGNoKGV2LmV2ZW50VHlwZSkge1xyXG4gICAgICBjYXNlIEhhbW1lci5FVkVOVF9TVEFSVDpcclxuICAgICAgICB0aGlzLnRyaWdnZXJlZCA9IGZhbHNlO1xyXG4gICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgY2FzZSBIYW1tZXIuRVZFTlRfTU9WRTpcclxuICAgICAgICB2YXIgc2NhbGVfdGhyZXNob2xkID0gTWF0aC5hYnMoMSAtIGV2LnNjYWxlKTtcclxuICAgICAgICB2YXIgcm90YXRpb25fdGhyZXNob2xkID0gTWF0aC5hYnMoZXYucm90YXRpb24pO1xyXG5cclxuICAgICAgICAvLyB3aGVuIHRoZSBkaXN0YW5jZSB3ZSBtb3ZlZCBpcyB0b28gc21hbGwgd2Ugc2tpcCB0aGlzIGdlc3R1cmVcclxuICAgICAgICAvLyBvciB3ZSBjYW4gYmUgYWxyZWFkeSBpbiBkcmFnZ2luZ1xyXG4gICAgICAgIGlmKHNjYWxlX3RocmVzaG9sZCA8IGluc3Qub3B0aW9ucy50cmFuc2Zvcm1fbWluX3NjYWxlICYmXHJcbiAgICAgICAgICByb3RhdGlvbl90aHJlc2hvbGQgPCBpbnN0Lm9wdGlvbnMudHJhbnNmb3JtX21pbl9yb3RhdGlvbikge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gd2UgYXJlIHRyYW5zZm9ybWluZyFcclxuICAgICAgICBIYW1tZXIuZGV0ZWN0aW9uLmN1cnJlbnQubmFtZSA9IHRoaXMubmFtZTtcclxuXHJcbiAgICAgICAgLy8gZmlyc3QgdGltZSwgdHJpZ2dlciBkcmFnc3RhcnQgZXZlbnRcclxuICAgICAgICBpZighdGhpcy50cmlnZ2VyZWQpIHtcclxuICAgICAgICAgIGluc3QudHJpZ2dlcih0aGlzLm5hbWUgKyAnc3RhcnQnLCBldik7XHJcbiAgICAgICAgICB0aGlzLnRyaWdnZXJlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpbnN0LnRyaWdnZXIodGhpcy5uYW1lLCBldik7IC8vIGJhc2ljIHRyYW5zZm9ybSBldmVudFxyXG5cclxuICAgICAgICAvLyB0cmlnZ2VyIHJvdGF0ZSBldmVudFxyXG4gICAgICAgIGlmKHJvdGF0aW9uX3RocmVzaG9sZCA+IGluc3Qub3B0aW9ucy50cmFuc2Zvcm1fbWluX3JvdGF0aW9uKSB7XHJcbiAgICAgICAgICBpbnN0LnRyaWdnZXIoJ3JvdGF0ZScsIGV2KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHRyaWdnZXIgcGluY2ggZXZlbnRcclxuICAgICAgICBpZihzY2FsZV90aHJlc2hvbGQgPiBpbnN0Lm9wdGlvbnMudHJhbnNmb3JtX21pbl9zY2FsZSkge1xyXG4gICAgICAgICAgaW5zdC50cmlnZ2VyKCdwaW5jaCcsIGV2KTtcclxuICAgICAgICAgIGluc3QudHJpZ2dlcigncGluY2gnICsgKChldi5zY2FsZSA8IDEpID8gJ2luJyA6ICdvdXQnKSwgZXYpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIGNhc2UgSGFtbWVyLkVWRU5UX0VORDpcclxuICAgICAgICAvLyB0cmlnZ2VyIGRyYWdlbmRcclxuICAgICAgICBpZih0aGlzLnRyaWdnZXJlZCkge1xyXG4gICAgICAgICAgaW5zdC50cmlnZ2VyKHRoaXMubmFtZSArICdlbmQnLCBldik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnRyaWdnZXJlZCA9IGZhbHNlO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbiAgLy8gQmFzZWQgb2ZmIExvLURhc2gncyBleGNlbGxlbnQgVU1EIHdyYXBwZXIgKHNsaWdodGx5IG1vZGlmaWVkKSAtIGh0dHBzOi8vZ2l0aHViLmNvbS9iZXN0aWVqcy9sb2Rhc2gvYmxvYi9tYXN0ZXIvbG9kYXNoLmpzI0w1NTE1LUw1NTQzXHJcbiAgLy8gc29tZSBBTUQgYnVpbGQgb3B0aW1pemVycywgbGlrZSByLmpzLCBjaGVjayBmb3Igc3BlY2lmaWMgY29uZGl0aW9uIHBhdHRlcm5zIGxpa2UgdGhlIGZvbGxvd2luZzpcclxuICBpZih0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xyXG4gICAgLy8gZGVmaW5lIGFzIGFuIGFub255bW91cyBtb2R1bGVcclxuICAgIGRlZmluZShmdW5jdGlvbigpIHsgcmV0dXJuIEhhbW1lcjsgfSk7XHJcbiAgfVxyXG5cclxuICAvLyBjaGVjayBmb3IgYGV4cG9ydHNgIGFmdGVyIGBkZWZpbmVgIGluIGNhc2UgYSBidWlsZCBvcHRpbWl6ZXIgYWRkcyBhbiBgZXhwb3J0c2Agb2JqZWN0XHJcbiAgZWxzZSBpZih0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cykge1xyXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBIYW1tZXI7XHJcbiAgfVxyXG5cclxuICBlbHNlIHtcclxuICAgIHdpbmRvdy5IYW1tZXIgPSBIYW1tZXI7XHJcbiAgfVxyXG5cclxufSkod2luZG93KTtcclxuIl19
