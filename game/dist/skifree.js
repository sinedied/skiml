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

            this.reset();
            // TODO game must be also reset
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
},{"./aiBrain":1,"./spriteArray":12,"eventedloop":16}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
var Sprite = require('./sprite');

(function(global) {
	function Monster(data) {
		var that = new Sprite(data);
		var super_draw = that.draw.bind(that);
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
},{"./sprite":11}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
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
			draw: that.draw.bind(that),
			cycle: that.cycle.bind(that),
			getSpeedX: that.getSpeedX.bind(that),
			getSpeedY: that.getSpeedY.bind(that),
			hits: that.hits.bind(that)
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

},{"./sprite":11}],10:[function(require,module,exports){
var Sprite = require('./sprite');

(function(global) {
	function Snowboarder(data) {
		var that = new Sprite(data);
		var sup = {
			draw: that.draw.bind(that),
			cycle: that.cycle.bind(that)
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
},{"./sprite":11}],11:[function(require,module,exports){
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
},{"./guid":4}],12:[function(require,module,exports){
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
},{}],13:[function(require,module,exports){
// Global dependencies which return no modules
require('./lib/canvasRenderingContext2DExtensions');
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

},{"./lib/canvasRenderingContext2DExtensions":2,"./lib/game":3,"./lib/infoBox":5,"./lib/isMobileDevice":6,"./lib/monster":7,"./lib/plugins":8,"./lib/skier":9,"./lib/snowboarder":10,"./lib/sprite":11,"./lib/spriteArray":12,"./spriteInfo":14,"br-mousetrap":15,"hammerjs":18}],14:[function(require,module,exports){
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
},{}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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

},{"events":19,"underscore":17}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
/*! Hammer.JS - v2.0.8 - 2016-09-30
 * http://hammerjs.github.io/
 *
 * Copyright (c)  Jorik Tangelder;
 * Licensed under the MIT license */
(function(window, document, exportName, undefined) { 
'use strict';
/**
 * @private
 * use the val2 when val1 is undefined
 * @param {*} val1
 * @param {*} val2
 * @returns {*}
 */
function ifUndefined(val1, val2) {
  return val1 === undefined ? val2 : val1;
}

var VENDOR_PREFIXES = ['', 'webkit', 'Moz', 'MS', 'ms', 'o'];
var TEST_ELEMENT = document.createElement('div');

var TYPE_FUNCTION = 'function';

var round = Math.round;
var abs = Math.abs;
var now = Date.now;

/**
 * @private
 * get the prefixed property
 * @param {Object} obj
 * @param {String} property
 * @returns {String|Undefined} prefixed
 */
function prefixed(obj, property) {
  var prefix = void 0;
  var prop = void 0;
  var camelProp = property[0].toUpperCase() + property.slice(1);

  var i = 0;
  while (i < VENDOR_PREFIXES.length) {
    prefix = VENDOR_PREFIXES[i];
    prop = prefix ? prefix + camelProp : property;

    if (prop in obj) {
      return prop;
    }
    i++;
  }
  return undefined;
}

function getTouchActionProps() {
  if (!NATIVE_TOUCH_ACTION) {
    return false;
  }
  var touchMap = {};
  var cssSupports = window.CSS && window.CSS.supports;
  ['auto', 'manipulation', 'pan-y', 'pan-x', 'pan-x pan-y', 'none'].forEach(function (val) {

    // If css.supports is not supported but there is native touch-action assume it supports
    // all values. This is the case for IE 10 and 11.
    return touchMap[val] = cssSupports ? window.CSS.supports('touch-action', val) : true;
  });
  return touchMap;
}

var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, 'touchAction');
var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined;

// magical touchAction value
var TOUCH_ACTION_COMPUTE = 'compute';
var TOUCH_ACTION_AUTO = 'auto';
var TOUCH_ACTION_MANIPULATION = 'manipulation'; // not implemented
var TOUCH_ACTION_NONE = 'none';
var TOUCH_ACTION_PAN_X = 'pan-x';
var TOUCH_ACTION_PAN_Y = 'pan-y';
var TOUCH_ACTION_MAP = getTouchActionProps();

var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;

var SUPPORT_TOUCH = 'ontouchstart' in window;
var SUPPORT_POINTER_EVENTS = prefixed(window, 'PointerEvent') !== undefined;
var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);

var INPUT_TYPE_TOUCH = 'touch';
var INPUT_TYPE_PEN = 'pen';
var INPUT_TYPE_MOUSE = 'mouse';
var INPUT_TYPE_KINECT = 'kinect';

var COMPUTE_INTERVAL = 25;

var INPUT_START = 1;
var INPUT_MOVE = 2;
var INPUT_END = 4;
var INPUT_CANCEL = 8;

var DIRECTION_NONE = 1;
var DIRECTION_LEFT = 2;
var DIRECTION_RIGHT = 4;
var DIRECTION_UP = 8;
var DIRECTION_DOWN = 16;

var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;

var PROPS_XY = ['x', 'y'];
var PROPS_CLIENT_XY = ['clientX', 'clientY'];

var STATE_POSSIBLE = 1;
var STATE_BEGAN = 2;
var STATE_CHANGED = 4;
var STATE_ENDED = 8;
var STATE_RECOGNIZED = STATE_ENDED;
var STATE_CANCELLED = 16;
var STATE_FAILED = 32;

/**
 * @private
 * extend object.
 * means that properties in dest will be overwritten by the ones in src.
 * @param {Object} target
 * @param {...Object} objects_to_assign
 * @returns {Object} target
 */
var assign = void 0;
if (typeof Object.assign !== 'function') {
  assign = function assign(target) {
    if (target === undefined || target === null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }

    var output = Object(target);
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[index];
      if (source !== undefined && source !== null) {
        for (var nextKey in source) {
          if (source.hasOwnProperty(nextKey)) {
            output[nextKey] = source[nextKey];
          }
        }
      }
    }
    return output;
  };
} else {
  assign = Object.assign;
}

var assign$1 = assign;

/**
 * @private
 * get a unique id
 * @returns {number} uniqueId
 */
var _uniqueId = 1;
function uniqueId() {
  return _uniqueId++;
}

/**
 * @private
 * walk objects and arrays
 * @param {Object} obj
 * @param {Function} iterator
 * @param {Object} context
 */
function each(obj, iterator, context) {
  var i = void 0;

  if (!obj) {
    return;
  }

  if (obj.forEach) {
    obj.forEach(iterator, context);
  } else if (obj.length !== undefined) {
    i = 0;
    while (i < obj.length) {
      iterator.call(context, obj[i], i, obj);
      i++;
    }
  } else {
    for (i in obj) {
      obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
    }
  }
}

/**
 * @private
 * if the argument is an array, we want to execute the fn on each entry
 * if it aint an array we don't want to do a thing.
 * this is used by all the methods that accept a single and array argument.
 * @param {*|Array} arg
 * @param {String} fn
 * @param {Object} [context]
 * @returns {Boolean}
 */
function invokeArrayArg(arg, fn, context) {
  if (Array.isArray(arg)) {
    each(arg, context[fn], context);
    return true;
  }
  return false;
}

/**
 * @private
 * find if a array contains the object using indexOf or a simple polyFill
 * @param {Array} src
 * @param {String} find
 * @param {String} [findByKey]
 * @return {Boolean|Number} false when not found, or the index
 */
function inArray(src, find, findByKey) {
  if (src.indexOf && !findByKey) {
    return src.indexOf(find);
  } else {
    var i = 0;
    while (i < src.length) {
      if (findByKey && src[i][findByKey] == find || !findByKey && src[i] === find) {
        // do not use === here, test fails
        return i;
      }
      i++;
    }
    return -1;
  }
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

/**
 * @private
 * let a boolean value also be a function that must return a boolean
 * this first item in args will be used as the context
 * @param {Boolean|Function} val
 * @param {Array} [args]
 * @returns {Boolean}
 */
function boolOrFn(val, args) {
  if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) === TYPE_FUNCTION) {
    return val.apply(args ? args[0] || undefined : undefined, args);
  }
  return val;
}

/**
 * @private
 * get a recognizer by name if it is bound to a manager
 * @param {Recognizer|String} otherRecognizer
 * @param {Recognizer} recognizer
 * @returns {Recognizer}
 */
function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
  var manager = recognizer.manager;

  if (manager) {
    return manager.get(otherRecognizer);
  }
  return otherRecognizer;
}

/**
 * @private
 * get a usable string, used as event postfix
 * @param {constant} state
 * @returns {String} state
 */
function stateStr(state) {
  if (state & STATE_CANCELLED) {
    return 'cancel';
  } else if (state & STATE_ENDED) {
    return 'end';
  } else if (state & STATE_CHANGED) {
    return 'move';
  } else if (state & STATE_BEGAN) {
    return 'start';
  }
  return '';
}

/**
 * @private
 * Recognizer flow explained; *
 * All recognizers have the initial state of POSSIBLE when a input session starts.
 * The definition of a input session is from the first input until the last input, with all it's movement in it. *
 * Example session for mouse-input: mousedown -> mousemove -> mouseup
 *
 * On each recognizing cycle (see Manager.recognize) the .recognize() method is executed
 * which determines with state it should be.
 *
 * If the recognizer has the state FAILED, CANCELLED or RECOGNIZED (equals ENDED), it is reset to
 * POSSIBLE to give it another change on the next cycle.
 *
 *               Possible
 *                  |
 *            +-----+---------------+
 *            |                     |
 *      +-----+-----+               |
 *      |           |               |
 *   Failed      Cancelled          |
 *                          +-------+------+
 *                          |              |
 *                      Recognized       Began
 *                                         |
 *                                      Changed
 *                                         |
 *                                  Ended/Recognized
 */

/**
 * @private
 * Recognizer
 * Every recognizer needs to extend from this class.
 * @constructor
 * @param {Object} options
 */

var Recognizer = function () {
  function Recognizer(options) {
    classCallCheck(this, Recognizer);

    this.options = assign$1({}, this.defaults, options || {});

    this.id = uniqueId();

    this.manager = null;

    // default is enable true
    this.options.enable = ifUndefined(this.options.enable, true);

    this.state = STATE_POSSIBLE;
    this.simultaneous = {};
    this.requireFail = [];
  }

  /**
   * @private
   * set options
   * @param {Object} options
   * @return {Recognizer}
   */


  createClass(Recognizer, [{
    key: 'set',
    value: function set(options) {
      assign$1(this.options, options);

      // also update the touchAction, in case something changed about the directions/enabled state
      this.manager && this.manager.touchAction.update();
      return this;
    }

    /**
     * @private
     * recognize simultaneous with an other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */

  }, {
    key: 'recognizeWith',
    value: function recognizeWith(otherRecognizer) {
      if (invokeArrayArg(otherRecognizer, 'recognizeWith', this)) {
        return this;
      }

      var simultaneous = this.simultaneous;

      otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
      if (!simultaneous[otherRecognizer.id]) {
        simultaneous[otherRecognizer.id] = otherRecognizer;
        otherRecognizer.recognizeWith(this);
      }
      return this;
    }

    /**
     * @private
     * drop the simultaneous link. it doesnt remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */

  }, {
    key: 'dropRecognizeWith',
    value: function dropRecognizeWith(otherRecognizer) {
      if (invokeArrayArg(otherRecognizer, 'dropRecognizeWith', this)) {
        return this;
      }

      otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
      delete this.simultaneous[otherRecognizer.id];
      return this;
    }

    /**
     * @private
     * recognizer can only run when an other is failing
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */

  }, {
    key: 'requireFailure',
    value: function requireFailure(otherRecognizer) {
      if (invokeArrayArg(otherRecognizer, 'requireFailure', this)) {
        return this;
      }

      var requireFail = this.requireFail;

      otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
      if (inArray(requireFail, otherRecognizer) === -1) {
        requireFail.push(otherRecognizer);
        otherRecognizer.requireFailure(this);
      }
      return this;
    }

    /**
     * @private
     * drop the requireFailure link. it does not remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */

  }, {
    key: 'dropRequireFailure',
    value: function dropRequireFailure(otherRecognizer) {
      if (invokeArrayArg(otherRecognizer, 'dropRequireFailure', this)) {
        return this;
      }

      otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
      var index = inArray(this.requireFail, otherRecognizer);
      if (index > -1) {
        this.requireFail.splice(index, 1);
      }
      return this;
    }

    /**
     * @private
     * has require failures boolean
     * @returns {boolean}
     */

  }, {
    key: 'hasRequireFailures',
    value: function hasRequireFailures() {
      return this.requireFail.length > 0;
    }

    /**
     * @private
     * if the recognizer can recognize simultaneous with an other recognizer
     * @param {Recognizer} otherRecognizer
     * @returns {Boolean}
     */

  }, {
    key: 'canRecognizeWith',
    value: function canRecognizeWith(otherRecognizer) {
      return !!this.simultaneous[otherRecognizer.id];
    }

    /**
     * @private
     * You should use `tryEmit` instead of `emit` directly to check
     * that all the needed recognizers has failed before emitting.
     * @param {Object} input
     */

  }, {
    key: 'emit',
    value: function emit(input) {
      var self = this;
      var state = this.state;


      function emit(event) {
        self.manager.emit(event, input);
      }

      // 'panstart' and 'panmove'
      if (state < STATE_ENDED) {
        emit(self.options.event + stateStr(state));
      }

      emit(self.options.event); // simple 'eventName' events

      if (input.additionalEvent) {
        // additional event(panleft, panright, pinchin, pinchout...)
        emit(input.additionalEvent);
      }

      // panend and pancancel
      if (state >= STATE_ENDED) {
        emit(self.options.event + stateStr(state));
      }
    }

    /**
     * @private
     * Check that all the require failure recognizers has failed,
     * if true, it emits a gesture event,
     * otherwise, setup the state to FAILED.
     * @param {Object} input
     */

  }, {
    key: 'tryEmit',
    value: function tryEmit(input) {
      if (this.canEmit()) {
        return this.emit(input);
      }
      // it's failing anyway
      this.state = STATE_FAILED;
    }

    /**
     * @private
     * can we emit?
     * @returns {boolean}
     */

  }, {
    key: 'canEmit',
    value: function canEmit() {
      var i = 0;
      while (i < this.requireFail.length) {
        if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
          return false;
        }
        i++;
      }
      return true;
    }

    /**
     * @private
     * update the recognizer
     * @param {Object} inputData
     */

  }, {
    key: 'recognize',
    value: function recognize(inputData) {
      // make a new copy of the inputData
      // so we can change the inputData without messing up the other recognizers
      var inputDataClone = assign$1({}, inputData);

      // is is enabled and allow recognizing?
      if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
        this.reset();
        this.state = STATE_FAILED;
        return;
      }

      // reset when we've reached the end
      if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
        this.state = STATE_POSSIBLE;
      }

      this.state = this.process(inputDataClone);

      // the recognizer has recognized a gesture
      // so trigger an event
      if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
        this.tryEmit(inputDataClone);
      }
    }

    /**
     * @private
     * return the state of the recognizer
     * the actual recognizing happens in this method
     * @virtual
     * @param {Object} inputData
     * @returns {constant} STATE
     */

    /* jshint ignore:start */

  }, {
    key: 'process',
    value: function process(inputData) {}
    /* jshint ignore:end */

    /**
     * @private
     * return the preferred touch-action
     * @virtual
     * @returns {Array}
     */

  }, {
    key: 'getTouchAction',
    value: function getTouchAction() {}

    /**
     * @private
     * called when the gesture isn't allowed to recognize
     * like when another is being recognized or it is disabled
     * @virtual
     */

  }, {
    key: 'reset',
    value: function reset() {}
  }]);
  return Recognizer;
}();

Recognizer.prototype.defaults = {};

/**
 * @private
 * This recognizer is just used as a base for the simple attribute recognizers.
 * @constructor
 * @extends Recognizer
 */

var AttrRecognizer = function (_Recognizer) {
  inherits(AttrRecognizer, _Recognizer);

  function AttrRecognizer() {
    classCallCheck(this, AttrRecognizer);
    return possibleConstructorReturn(this, (AttrRecognizer.__proto__ || Object.getPrototypeOf(AttrRecognizer)).apply(this, arguments));
  }

  /**
   * @private
   * Used to check if it the recognizer receives valid input, like input.distance > 10.
   * @memberof AttrRecognizer
   * @param {Object} input
   * @returns {Boolean} recognized
   */


  createClass(AttrRecognizer, [{
    key: 'attrTest',
    value: function attrTest(input) {
      var optionPointers = this.options.pointers;
      return optionPointers === 0 || input.pointers.length === optionPointers;
    }

    /**
     * @private
     * Process the input and return the state for the recognizer
     * @memberof AttrRecognizer
     * @param {Object} input
     * @returns {*} State
     */

  }, {
    key: 'process',
    value: function process(input) {
      var state = this.state;
      var eventType = input.eventType;


      var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
      var isValid = this.attrTest(input);

      // on cancel input and we've recognized before, return STATE_CANCELLED
      if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
        return state | STATE_CANCELLED;
      } else if (isRecognized || isValid) {
        if (eventType & INPUT_END) {
          return state | STATE_ENDED;
        } else if (!(state & STATE_BEGAN)) {
          return STATE_BEGAN;
        }
        return state | STATE_CHANGED;
      }
      return STATE_FAILED;
    }
  }]);
  return AttrRecognizer;
}(Recognizer);

AttrRecognizer.prototype.defaults = {
  /**
   * @private
   * @type {Number}
   * @default 1
   */
  pointers: 1
};

/**
 * @private
 * Rotate
 * Recognized when two or more pointer are moving in a circular motion.
 * @constructor
 * @extends AttrRecognizer
 */

var RotateRecognizer = function (_AttrRecognizer) {
  inherits(RotateRecognizer, _AttrRecognizer);

  function RotateRecognizer() {
    classCallCheck(this, RotateRecognizer);
    return possibleConstructorReturn(this, (RotateRecognizer.__proto__ || Object.getPrototypeOf(RotateRecognizer)).apply(this, arguments));
  }

  createClass(RotateRecognizer, [{
    key: 'getTouchAction',
    value: function getTouchAction() {
      return [TOUCH_ACTION_NONE];
    }
  }, {
    key: 'attrTest',
    value: function attrTest(input) {
      return get(RotateRecognizer.prototype.__proto__ || Object.getPrototypeOf(RotateRecognizer.prototype), 'attrTest', this).call(this, input) && (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
    }
  }]);
  return RotateRecognizer;
}(AttrRecognizer);

RotateRecognizer.prototype.defaults = {
  event: 'rotate',
  threshold: 0,
  pointers: 2
};

/**
 * @private
 * Pinch
 * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
 * @constructor
 * @extends AttrRecognizer
 */

var PinchRecognizer = function (_AttrRecognizer) {
  inherits(PinchRecognizer, _AttrRecognizer);

  function PinchRecognizer() {
    classCallCheck(this, PinchRecognizer);
    return possibleConstructorReturn(this, (PinchRecognizer.__proto__ || Object.getPrototypeOf(PinchRecognizer)).apply(this, arguments));
  }

  createClass(PinchRecognizer, [{
    key: 'getTouchAction',
    value: function getTouchAction() {
      return [TOUCH_ACTION_NONE];
    }
  }, {
    key: 'attrTest',
    value: function attrTest(input) {
      return get(PinchRecognizer.prototype.__proto__ || Object.getPrototypeOf(PinchRecognizer.prototype), 'attrTest', this).call(this, input) && (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
    }
  }, {
    key: 'emit',
    value: function emit(input) {
      if (input.scale !== 1) {
        var inOut = input.scale < 1 ? 'in' : 'out';
        input.additionalEvent = this.options.event + inOut;
      }
      get(PinchRecognizer.prototype.__proto__ || Object.getPrototypeOf(PinchRecognizer.prototype), 'emit', this).call(this, input);
    }
  }]);
  return PinchRecognizer;
}(AttrRecognizer);

PinchRecognizer.prototype.defaults = {
  event: 'pinch',
  threshold: 0,
  pointers: 2
};

/**
 * @private
 * direction cons to string
 * @param {constant} direction
 * @returns {String}
 */
function directionStr(direction) {
  if (direction === DIRECTION_DOWN) {
    return 'down';
  } else if (direction === DIRECTION_UP) {
    return 'up';
  } else if (direction === DIRECTION_LEFT) {
    return 'left';
  } else if (direction === DIRECTION_RIGHT) {
    return 'right';
  }
  return '';
}

/**
 * @private
 * Pan
 * Recognized when the pointer is down and moved in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */

var PanRecognizer = function (_AttrRecognizer) {
  inherits(PanRecognizer, _AttrRecognizer);

  function PanRecognizer() {
    classCallCheck(this, PanRecognizer);

    var _this = possibleConstructorReturn(this, (PanRecognizer.__proto__ || Object.getPrototypeOf(PanRecognizer)).apply(this, arguments));

    _this.pX = null;
    _this.pY = null;
    return _this;
  }

  createClass(PanRecognizer, [{
    key: 'getTouchAction',
    value: function getTouchAction() {
      var direction = this.options.direction;

      var actions = [];
      if (direction & DIRECTION_HORIZONTAL) {
        actions.push(TOUCH_ACTION_PAN_Y);
      }
      if (direction & DIRECTION_VERTICAL) {
        actions.push(TOUCH_ACTION_PAN_X);
      }
      return actions;
    }
  }, {
    key: 'directionTest',
    value: function directionTest(input) {
      var options = this.options;

      var hasMoved = true;
      var distance = input.distance;
      var direction = input.direction;

      var x = input.deltaX;
      var y = input.deltaY;

      // lock to axis?
      if (!(direction & options.direction)) {
        if (options.direction & DIRECTION_HORIZONTAL) {
          direction = x === 0 ? DIRECTION_NONE : x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
          hasMoved = x !== this.pX;
          distance = Math.abs(input.deltaX);
        } else {
          direction = y === 0 ? DIRECTION_NONE : y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
          hasMoved = y !== this.pY;
          distance = Math.abs(input.deltaY);
        }
      }
      input.direction = direction;
      return hasMoved && distance > options.threshold && direction & options.direction;
    }
  }, {
    key: 'attrTest',
    value: function attrTest(input) {
      return AttrRecognizer.prototype.attrTest.call(this, input) && ( // replace with a super call
      this.state & STATE_BEGAN || !(this.state & STATE_BEGAN) && this.directionTest(input));
    }
  }, {
    key: 'emit',
    value: function emit(input) {

      this.pX = input.deltaX;
      this.pY = input.deltaY;

      var direction = directionStr(input.direction);

      if (direction) {
        input.additionalEvent = this.options.event + direction;
      }
      get(PanRecognizer.prototype.__proto__ || Object.getPrototypeOf(PanRecognizer.prototype), 'emit', this).call(this, input);
    }
  }]);
  return PanRecognizer;
}(AttrRecognizer);

PanRecognizer.prototype.defaults = {
  event: 'pan',
  threshold: 10,
  pointers: 1,
  direction: DIRECTION_ALL
};

/**
 * @private
 * Swipe
 * Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */

var SwipeRecognizer = function (_AttrRecognizer) {
  inherits(SwipeRecognizer, _AttrRecognizer);

  function SwipeRecognizer() {
    classCallCheck(this, SwipeRecognizer);
    return possibleConstructorReturn(this, (SwipeRecognizer.__proto__ || Object.getPrototypeOf(SwipeRecognizer)).apply(this, arguments));
  }

  createClass(SwipeRecognizer, [{
    key: 'getTouchAction',
    value: function getTouchAction() {
      return PanRecognizer.prototype.getTouchAction.call(this);
    }
  }, {
    key: 'attrTest',
    value: function attrTest(input) {
      var direction = this.options.direction;

      var velocity = void 0;

      if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
        velocity = input.overallVelocity;
      } else if (direction & DIRECTION_HORIZONTAL) {
        velocity = input.overallVelocityX;
      } else if (direction & DIRECTION_VERTICAL) {
        velocity = input.overallVelocityY;
      }

      return get(SwipeRecognizer.prototype.__proto__ || Object.getPrototypeOf(SwipeRecognizer.prototype), 'attrTest', this).call(this, input) && direction & input.offsetDirection && input.distance > this.options.threshold && input.maxPointers === this.options.pointers && abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
    }
  }, {
    key: 'emit',
    value: function emit(input) {
      var direction = directionStr(input.offsetDirection);
      if (direction) {
        this.manager.emit(this.options.event + direction, input);
      }

      this.manager.emit(this.options.event, input);
    }
  }]);
  return SwipeRecognizer;
}(AttrRecognizer);

SwipeRecognizer.prototype.defaults = {
  event: 'swipe',
  threshold: 10,
  velocity: 0.3,
  direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
  pointers: 1
};

/**
 * @private
 * simple function bind
 * @param {Function} fn
 * @param {Object} context
 * @returns {Function}
 */
function bindFn(fn, context) {
  return function boundFn() {
    return fn.apply(context, arguments);
  };
}

/**
 * @private
 * set a timeout with a given scope
 * @param {Function} fn
 * @param {Number} timeout
 * @param {Object} context
 * @returns {number}
 */
function setTimeoutContext(fn, timeout, context) {
  return setTimeout(bindFn(fn, context), timeout);
}

/**
 * @private
 * calculate the absolute distance between two points
 * @param {Object} p1 {x, y}
 * @param {Object} p2 {x, y}
 * @param {Array} [props] containing x and y keys
 * @return {Number} distance
 */
function getDistance(p1, p2, props) {
  if (!props) {
    props = PROPS_XY;
  }
  var x = p2[props[0]] - p1[props[0]];
  var y = p2[props[1]] - p1[props[1]];

  return Math.sqrt(x * x + y * y);
}

/**
 * @private
 * A tap is recognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur
 * between the given interval and position. The delay option can be used to recognize multi-taps without firing
 * a single tap.
 *
 * The eventData from the emitted event contains the property `tapCount`, which contains the amount of
 * multi-taps being recognized.
 * @constructor
 * @extends Recognizer
 */

var TapRecognizer = function (_Recognizer) {
  inherits(TapRecognizer, _Recognizer);

  function TapRecognizer() {
    classCallCheck(this, TapRecognizer);

    // previous time and center,
    // used for tap counting
    var _this = possibleConstructorReturn(this, (TapRecognizer.__proto__ || Object.getPrototypeOf(TapRecognizer)).apply(this, arguments));

    _this.pTime = false;
    _this.pCenter = false;

    _this._timer = null;
    _this._input = null;
    _this.count = 0;
    return _this;
  }

  createClass(TapRecognizer, [{
    key: 'getTouchAction',
    value: function getTouchAction() {
      return [TOUCH_ACTION_MANIPULATION];
    }
  }, {
    key: 'process',
    value: function process(input) {
      var _this2 = this;

      var options = this.options;


      var validPointers = input.pointers.length === options.pointers;
      var validMovement = input.distance < options.threshold;
      var validTouchTime = input.deltaTime < options.time;

      this.reset();

      if (input.eventType & INPUT_START && this.count === 0) {
        return this.failTimeout();
      }

      // we only allow little movement
      // and we've reached an end event, so a tap is possible
      if (validMovement && validTouchTime && validPointers) {
        if (input.eventType !== INPUT_END) {
          return this.failTimeout();
        }

        var validInterval = this.pTime ? input.timeStamp - this.pTime < options.interval : true;
        var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;

        this.pTime = input.timeStamp;
        this.pCenter = input.center;

        if (!validMultiTap || !validInterval) {
          this.count = 1;
        } else {
          this.count += 1;
        }

        this._input = input;

        // if tap count matches we have recognized it,
        // else it has began recognizing...
        var tapCount = this.count % options.taps;
        if (tapCount === 0) {
          // no failing requirements, immediately trigger the tap event
          // or wait as long as the multitap interval to trigger
          if (!this.hasRequireFailures()) {
            return STATE_RECOGNIZED;
          } else {
            this._timer = setTimeoutContext(function () {
              _this2.state = STATE_RECOGNIZED;
              _this2.tryEmit();
            }, options.interval, this);
            return STATE_BEGAN;
          }
        }
      }
      return STATE_FAILED;
    }
  }, {
    key: 'failTimeout',
    value: function failTimeout() {
      var _this3 = this;

      this._timer = setTimeoutContext(function () {
        _this3.state = STATE_FAILED;
      }, this.options.interval, this);
      return STATE_FAILED;
    }
  }, {
    key: 'reset',
    value: function reset() {
      clearTimeout(this._timer);
    }
  }, {
    key: 'emit',
    value: function emit() {
      if (this.state === STATE_RECOGNIZED) {
        this._input.tapCount = this.count;
        this.manager.emit(this.options.event, this._input);
      }
    }
  }]);
  return TapRecognizer;
}(Recognizer);

TapRecognizer.prototype.defaults = {
  event: 'tap',
  pointers: 1,
  taps: 1,
  interval: 300, // max time between the multi-tap taps
  time: 250, // max time of the pointer to be down (like finger on the screen)
  threshold: 9, // a minimal movement is ok, but keep it low
  posThreshold: 10 // a multi-tap can be a bit off the initial position
};

/**
 * @private
 * Press
 * Recognized when the pointer is down for x ms without any movement.
 * @constructor
 * @extends Recognizer
 */

var PressRecognizer = function (_Recognizer) {
  inherits(PressRecognizer, _Recognizer);

  function PressRecognizer() {
    classCallCheck(this, PressRecognizer);

    var _this = possibleConstructorReturn(this, (PressRecognizer.__proto__ || Object.getPrototypeOf(PressRecognizer)).apply(this, arguments));

    _this._timer = null;
    _this._input = null;
    return _this;
  }

  createClass(PressRecognizer, [{
    key: 'getTouchAction',
    value: function getTouchAction() {
      return [TOUCH_ACTION_AUTO];
    }
  }, {
    key: 'process',
    value: function process(input) {
      var _this2 = this;

      var options = this.options;

      var validPointers = input.pointers.length === options.pointers;
      var validMovement = input.distance < options.threshold;
      var validTime = input.deltaTime > options.time;

      this._input = input;

      // we only allow little movement
      // and we've reached an end event, so a tap is possible
      if (!validMovement || !validPointers || input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime) {
        this.reset();
      } else if (input.eventType & INPUT_START) {
        this.reset();
        this._timer = setTimeoutContext(function () {
          _this2.state = STATE_RECOGNIZED;
          _this2.tryEmit();
        }, options.time, this);
      } else if (input.eventType & INPUT_END) {
        return STATE_RECOGNIZED;
      }
      return STATE_FAILED;
    }
  }, {
    key: 'reset',
    value: function reset() {
      clearTimeout(this._timer);
    }
  }, {
    key: 'emit',
    value: function emit(input) {
      if (this.state !== STATE_RECOGNIZED) {
        return;
      }

      if (input && input.eventType & INPUT_END) {
        this.manager.emit(this.options.event + 'up', input);
      } else {
        this._input.timeStamp = now();
        this.manager.emit(this.options.event, this._input);
      }
    }
  }]);
  return PressRecognizer;
}(Recognizer);

PressRecognizer.prototype.defaults = {
  event: 'press',
  pointers: 1,
  time: 251, // minimal time of the pointer to be pressed
  threshold: 9 // a minimal movement is ok, but keep it low
};

/**
 * @private
 * small indexOf wrapper
 * @param {String} str
 * @param {String} find
 * @returns {Boolean} found
 */
function inStr(str, find) {
  return str.indexOf(find) > -1;
}

/**
 * @private
 * when the touchActions are collected they are not a valid value, so we need to clean things up. *
 * @param {String} actions
 * @returns {*}
 */
function cleanTouchActions(actions) {
  // none
  if (inStr(actions, TOUCH_ACTION_NONE)) {
    return TOUCH_ACTION_NONE;
  }

  var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
  var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);

  // if both pan-x and pan-y are set (different recognizers
  // for different directions, e.g. horizontal pan but vertical swipe?)
  // we need none (as otherwise with pan-x pan-y combined none of these
  // recognizers will work, since the browser would handle all panning
  if (hasPanX && hasPanY) {
    return TOUCH_ACTION_NONE;
  }

  // pan-x OR pan-y
  if (hasPanX || hasPanY) {
    return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
  }

  // manipulation
  if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
    return TOUCH_ACTION_MANIPULATION;
  }

  return TOUCH_ACTION_AUTO;
}

/**
 * @private
 * Touch Action
 * sets the touchAction property or uses the js alternative
 * @param {Manager} manager
 * @param {String} value
 * @constructor
 */

var TouchAction = function () {
  function TouchAction(manager, value) {
    classCallCheck(this, TouchAction);

    this.manager = manager;
    this.set(value);
  }

  /**
   * @private
   * set the touchAction value on the element or enable the polyfill
   * @param {String} value
   */


  createClass(TouchAction, [{
    key: 'set',
    value: function set(value) {
      // find out the touch-action by the event handlers
      if (value === TOUCH_ACTION_COMPUTE) {
        value = this.compute();
      }

      if (NATIVE_TOUCH_ACTION && this.manager.element.style && TOUCH_ACTION_MAP[value]) {
        this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
      }
      this.actions = value.toLowerCase().trim();
    }

    /**
     * @private
     * just re-set the touchAction value
     */

  }, {
    key: 'update',
    value: function update() {
      this.set(this.manager.options.touchAction);
    }

    /**
     * @private
     * compute the value for the touchAction property based on the recognizer's settings
     * @returns {String} value
     */

  }, {
    key: 'compute',
    value: function compute() {
      var actions = [];
      each(this.manager.recognizers, function (recognizer) {
        if (boolOrFn(recognizer.options.enable, [recognizer])) {
          actions = actions.concat(recognizer.getTouchAction());
        }
      });
      return cleanTouchActions(actions.join(' '));
    }

    /**
     * @private
     * this method is called on each input cycle and provides the preventing of the browser behavior
     * @param {Object} input
     */

  }, {
    key: 'preventDefaults',
    value: function preventDefaults(input) {
      var srcEvent = input.srcEvent;

      var direction = input.offsetDirection;

      // if the touch action did prevented once this session
      if (this.manager.session.prevented) {
        srcEvent.preventDefault();
        return;
      }

      var actions = this.actions;

      var hasNone = inStr(actions, TOUCH_ACTION_NONE) && !TOUCH_ACTION_MAP[TOUCH_ACTION_NONE];
      var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_Y];
      var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_X];

      if (hasNone) {
        // do not prevent defaults if this is a tap gesture
        var isTapPointer = input.pointers.length === 1;
        var isTapMovement = input.distance < 2;
        var isTapTouchTime = input.deltaTime < 250;

        if (isTapPointer && isTapMovement && isTapTouchTime) {
          return;
        }
      }

      if (hasPanX && hasPanY) {
        // `pan-x pan-y` means browser handles all scrolling/panning, do not prevent
        return;
      }

      if (hasNone || hasPanY && direction & DIRECTION_HORIZONTAL || hasPanX && direction & DIRECTION_VERTICAL) {
        return this.preventSrc(srcEvent);
      }
    }

    /**
     * @private
     * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
     * @param {Object} srcEvent
     */

  }, {
    key: 'preventSrc',
    value: function preventSrc(srcEvent) {
      this.manager.session.prevented = true;
      srcEvent.preventDefault();
    }
  }]);
  return TouchAction;
}();

/**
 * @private
 * find if a node is in the given parent
 * @method hasParent
 * @param {HTMLElement} node
 * @param {HTMLElement} parent
 * @return {Boolean} found
 */
function hasParent(node, parent) {
  while (node) {
    if (node === parent) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}

/**
 * @private
 * get the center of all the pointers
 * @param {Array} pointers
 * @return {Object} center contains `x` and `y` properties
 */
function getCenter(pointers) {
  var pointersLength = pointers.length;

  // no need to loop when only one touch
  if (pointersLength === 1) {
    return {
      x: round(pointers[0].clientX),
      y: round(pointers[0].clientY)
    };
  }

  var x = 0;
  var y = 0;
  var i = 0;
  while (i < pointersLength) {
    x += pointers[i].clientX;
    y += pointers[i].clientY;
    i++;
  }

  return {
    x: round(x / pointersLength),
    y: round(y / pointersLength)
  };
}

/**
 * @private
 * create a simple clone from the input used for storage of firstInput and firstMultiple
 * @param {Object} input
 * @returns {Object} clonedInputData
 */
function simpleCloneInputData(input) {
  // make a simple copy of the pointers because we will get a reference if we don't
  // we only need clientXY for the calculations
  var pointers = [];
  var i = 0;
  while (i < input.pointers.length) {
    pointers[i] = {
      clientX: round(input.pointers[i].clientX),
      clientY: round(input.pointers[i].clientY)
    };
    i++;
  }

  return {
    timeStamp: now(),
    pointers: pointers,
    center: getCenter(pointers),
    deltaX: input.deltaX,
    deltaY: input.deltaY
  };
}

/**
 * @private
 * calculate the angle between two coordinates
 * @param {Object} p1
 * @param {Object} p2
 * @param {Array} [props] containing x and y keys
 * @return {Number} angle
 */
function getAngle(p1, p2, props) {
  if (!props) {
    props = PROPS_XY;
  }
  var x = p2[props[0]] - p1[props[0]];
  var y = p2[props[1]] - p1[props[1]];
  return Math.atan2(y, x) * 180 / Math.PI;
}

/**
 * @private
 * get the direction between two points
 * @param {Number} x
 * @param {Number} y
 * @return {Number} direction
 */
function getDirection(x, y) {
  if (x === y) {
    return DIRECTION_NONE;
  }

  if (abs(x) >= abs(y)) {
    return x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
  }
  return y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
}

function computeDeltaXY(session, input) {
  var center = input.center;
  // let { offsetDelta:offset = {}, prevDelta = {}, prevInput = {} } = session;
  // jscs throwing error on defalut destructured values and without defaults tests fail

  var offset = session.offsetDelta || {};
  var prevDelta = session.prevDelta || {};
  var prevInput = session.prevInput || {};

  if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
    prevDelta = session.prevDelta = {
      x: prevInput.deltaX || 0,
      y: prevInput.deltaY || 0
    };

    offset = session.offsetDelta = {
      x: center.x,
      y: center.y
    };
  }

  input.deltaX = prevDelta.x + (center.x - offset.x);
  input.deltaY = prevDelta.y + (center.y - offset.y);
}

/**
 * @private
 * calculate the velocity between two points. unit is in px per ms.
 * @param {Number} deltaTime
 * @param {Number} x
 * @param {Number} y
 * @return {Object} velocity `x` and `y`
 */
function getVelocity(deltaTime, x, y) {
  return {
    x: x / deltaTime || 0,
    y: y / deltaTime || 0
  };
}

/**
 * @private
 * calculate the scale factor between two pointersets
 * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} scale
 */
function getScale(start, end) {
  return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
}

/**
 * @private
 * calculate the rotation degrees between two pointersets
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} rotation
 */
function getRotation(start, end) {
  return getAngle(end[1], end[0], PROPS_CLIENT_XY) + getAngle(start[1], start[0], PROPS_CLIENT_XY);
}

/**
 * @private
 * velocity is calculated every x ms
 * @param {Object} session
 * @param {Object} input
 */
function computeIntervalInputData(session, input) {
  var last = session.lastInterval || input;
  var deltaTime = input.timeStamp - last.timeStamp;
  var velocity = void 0;
  var velocityX = void 0;
  var velocityY = void 0;
  var direction = void 0;

  if (input.eventType !== INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined)) {
    var deltaX = input.deltaX - last.deltaX;
    var deltaY = input.deltaY - last.deltaY;

    var v = getVelocity(deltaTime, deltaX, deltaY);
    velocityX = v.x;
    velocityY = v.y;
    velocity = abs(v.x) > abs(v.y) ? v.x : v.y;
    direction = getDirection(deltaX, deltaY);

    session.lastInterval = input;
  } else {
    // use latest velocity info if it doesn't overtake a minimum period
    velocity = last.velocity;
    velocityX = last.velocityX;
    velocityY = last.velocityY;
    direction = last.direction;
  }

  input.velocity = velocity;
  input.velocityX = velocityX;
  input.velocityY = velocityY;
  input.direction = direction;
}

/**
* @private
 * extend the data with some usable properties like scale, rotate, velocity etc
 * @param {Object} manager
 * @param {Object} input
 */
function computeInputData(manager, input) {
  var session = manager.session;
  var pointers = input.pointers;
  var pointersLength = pointers.length;

  // store the first input to calculate the distance and direction

  if (!session.firstInput) {
    session.firstInput = simpleCloneInputData(input);
  }

  // to compute scale and rotation we need to store the multiple touches
  if (pointersLength > 1 && !session.firstMultiple) {
    session.firstMultiple = simpleCloneInputData(input);
  } else if (pointersLength === 1) {
    session.firstMultiple = false;
  }

  var firstInput = session.firstInput;
  var firstMultiple = session.firstMultiple;

  var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;

  var center = input.center = getCenter(pointers);
  input.timeStamp = now();
  input.deltaTime = input.timeStamp - firstInput.timeStamp;

  input.angle = getAngle(offsetCenter, center);
  input.distance = getDistance(offsetCenter, center);

  computeDeltaXY(session, input);
  input.offsetDirection = getDirection(input.deltaX, input.deltaY);

  var overallVelocity = getVelocity(input.deltaTime, input.deltaX, input.deltaY);
  input.overallVelocityX = overallVelocity.x;
  input.overallVelocityY = overallVelocity.y;
  input.overallVelocity = abs(overallVelocity.x) > abs(overallVelocity.y) ? overallVelocity.x : overallVelocity.y;

  input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
  input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;

  input.maxPointers = !session.prevInput ? input.pointers.length : input.pointers.length > session.prevInput.maxPointers ? input.pointers.length : session.prevInput.maxPointers;

  computeIntervalInputData(session, input);

  // find the correct target
  var target = manager.element;
  if (hasParent(input.srcEvent.target, target)) {
    target = input.srcEvent.target;
  }
  input.target = target;
}

/**
 * @private
 * handle input events
 * @param {Manager} manager
 * @param {String} eventType
 * @param {Object} input
 */
function inputHandler(manager, eventType, input) {
  var pointersLen = input.pointers.length;
  var changedPointersLen = input.changedPointers.length;
  var isFirst = eventType & INPUT_START && pointersLen - changedPointersLen === 0;
  var isFinal = eventType & (INPUT_END | INPUT_CANCEL) && pointersLen - changedPointersLen === 0;

  input.isFirst = !!isFirst;
  input.isFinal = !!isFinal;

  if (isFirst) {
    manager.session = {};
  }

  // source event is the normalized value of the domEvents
  // like 'touchstart, mouseup, pointerdown'
  input.eventType = eventType;

  // compute scale, rotation etc
  computeInputData(manager, input);

  // emit secret event
  manager.emit('hammer.input', input);

  manager.recognize(input);
  manager.session.prevInput = input;
}

/**
 * @private
 * split string on whitespace
 * @param {String} str
 * @returns {Array} words
 */

function splitStr(str) {
  return str.trim().split(/\s+/g);
}

/**
 * @private
 * addEventListener with multiple events at once
 * @param {EventTarget} target
 * @param {String} types
 * @param {Function} handler
 */
function addEventListeners(target, types, handler) {
  each(splitStr(types), function (type) {
    target.addEventListener(type, handler, false);
  });
}

/**
 * @private
 * removeEventListener with multiple events at once
 * @param {EventTarget} target
 * @param {String} types
 * @param {Function} handler
 */
function removeEventListeners(target, types, handler) {
  each(splitStr(types), function (type) {
    target.removeEventListener(type, handler, false);
  });
}

/**
 * @private
 * get the window object of an element
 * @param {HTMLElement} element
 * @returns {DocumentView|Window}
 */
function getWindowForElement(element) {
  var doc = element.ownerDocument || element;
  return doc.defaultView || doc.parentWindow || window;
}

/**
 * @private
 * create new input type manager
 * @param {Manager} manager
 * @param {Function} callback
 * @returns {Input}
 * @constructor
 */

var Input = function () {
  function Input(manager, callback) {
    classCallCheck(this, Input);

    var self = this;
    this.manager = manager;
    this.callback = callback;
    this.element = manager.element;
    this.target = manager.options.inputTarget;

    // smaller wrapper around the handler, for the scope and the enabled state of the manager,
    // so when disabled the input events are completely bypassed.
    this.domHandler = function (ev) {
      if (boolOrFn(manager.options.enable, [manager])) {
        self.handler(ev);
      }
    };

    this.init();
  }
  /**
   * @private
   * should handle the inputEvent data and trigger the callback
   * @virtual
   */


  createClass(Input, [{
    key: 'handler',
    value: function handler() {}

    /**
     * @private
     * bind the events
     */

  }, {
    key: 'init',
    value: function init() {
      this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
      this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
      this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    }

    /**
     * @private
     * unbind the events
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
      this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
      this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    }
  }]);
  return Input;
}();

var POINTER_INPUT_MAP = {
  pointerdown: INPUT_START,
  pointermove: INPUT_MOVE,
  pointerup: INPUT_END,
  pointercancel: INPUT_CANCEL,
  pointerout: INPUT_CANCEL
};

// in IE10 the pointer types is defined as an enum
var IE10_POINTER_TYPE_ENUM = {
  2: INPUT_TYPE_TOUCH,
  3: INPUT_TYPE_PEN,
  4: INPUT_TYPE_MOUSE,
  5: INPUT_TYPE_KINECT // see https://twitter.com/jacobrossi/status/480596438489890816
};

var POINTER_ELEMENT_EVENTS = 'pointerdown';
var POINTER_WINDOW_EVENTS = 'pointermove pointerup pointercancel';

// IE10 has prefixed support, and case-sensitive
if (window.MSPointerEvent && !window.PointerEvent) {
  POINTER_ELEMENT_EVENTS = 'MSPointerDown';
  POINTER_WINDOW_EVENTS = 'MSPointerMove MSPointerUp MSPointerCancel';
}

/**
 * @private
 * Pointer events input
 * @constructor
 * @extends Input
 */

var PointerEventInput = function (_Input) {
  inherits(PointerEventInput, _Input);

  function PointerEventInput() {
    classCallCheck(this, PointerEventInput);

    var _this = possibleConstructorReturn(this, (PointerEventInput.__proto__ || Object.getPrototypeOf(PointerEventInput)).apply(this, arguments));

    _this.evEl = POINTER_ELEMENT_EVENTS;
    _this.evWin = POINTER_WINDOW_EVENTS;

    _this.store = _this.manager.session.pointerEvents = [];
    return _this;
  }

  /**
   * @private
   * handle mouse events
   * @param {Object} ev
   */


  createClass(PointerEventInput, [{
    key: 'handler',
    value: function handler(ev) {
      var store = this.store;

      var removePointer = false;

      var eventTypeNormalized = ev.type.toLowerCase().replace('ms', '');
      var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
      var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;

      var isTouch = pointerType === INPUT_TYPE_TOUCH;

      // get index of the event in the store
      var storeIndex = inArray(store, ev.pointerId, 'pointerId');

      // start and mouse must be down
      if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
        if (storeIndex < 0) {
          store.push(ev);
          storeIndex = store.length - 1;
        }
      } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
        removePointer = true;
      }

      // it not found, so the pointer hasn't been down (so it's probably a hover)
      if (storeIndex < 0) {
        return;
      }

      // update the event in the store
      store[storeIndex] = ev;

      this.callback(this.manager, eventType, {
        pointers: store,
        changedPointers: [ev],
        pointerType: pointerType,
        srcEvent: ev
      });

      if (removePointer) {
        // remove from the store
        store.splice(storeIndex, 1);
      }
    }
  }]);
  return PointerEventInput;
}(Input);

/**
 * @private
 * convert array-like objects to real arrays
 * @param {Object} obj
 * @returns {Array}
 */
function toArray$1(obj) {
  return Array.prototype.slice.call(obj, 0);
}

/**
 * @private
 * unique array with objects based on a key (like 'id') or just by the array's value
 * @param {Array} src [{id:1},{id:2},{id:1}]
 * @param {String} [key]
 * @param {Boolean} [sort=False]
 * @returns {Array} [{id:1},{id:2}]
 */
function uniqueArray(src, key, sort) {
  var results = [];
  var values = [];
  var i = 0;

  while (i < src.length) {
    var val = key ? src[i][key] : src[i];
    if (inArray(values, val) < 0) {
      results.push(src[i]);
    }
    values[i] = val;
    i++;
  }

  if (sort) {
    if (!key) {
      results = results.sort();
    } else {
      results = results.sort(function (a, b) {
        return a[key] > b[key];
      });
    }
  }

  return results;
}

var TOUCH_INPUT_MAP = {
  touchstart: INPUT_START,
  touchmove: INPUT_MOVE,
  touchend: INPUT_END,
  touchcancel: INPUT_CANCEL
};

var TOUCH_TARGET_EVENTS = 'touchstart touchmove touchend touchcancel';

/**
 * @private
 * Multi-user touch events input
 * @constructor
 * @extends Input
 */

var TouchInput = function (_Input) {
  inherits(TouchInput, _Input);

  function TouchInput() {
    classCallCheck(this, TouchInput);

    TouchInput.prototype.evTarget = TOUCH_TARGET_EVENTS;
    TouchInput.prototype.targetIds = {};

    var _this = possibleConstructorReturn(this, (TouchInput.__proto__ || Object.getPrototypeOf(TouchInput)).apply(this, arguments));

    _this.evTarget = TOUCH_TARGET_EVENTS;
    _this.targetIds = {};
    return _this;
  }

  createClass(TouchInput, [{
    key: 'handler',
    value: function handler(ev) {
      var type = TOUCH_INPUT_MAP[ev.type];
      var touches = getTouches.call(this, ev, type);
      if (!touches) {
        return;
      }

      this.callback(this.manager, type, {
        pointers: touches[0],
        changedPointers: touches[1],
        pointerType: INPUT_TYPE_TOUCH,
        srcEvent: ev
      });
    }
  }]);
  return TouchInput;
}(Input);

function getTouches(ev, type) {
  var allTouches = toArray$1(ev.touches);
  var targetIds = this.targetIds;

  // when there is only one touch, the process can be simplified

  if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
    targetIds[allTouches[0].identifier] = true;
    return [allTouches, allTouches];
  }

  var i = void 0;
  var targetTouches = void 0;
  var changedTouches = toArray$1(ev.changedTouches);
  var changedTargetTouches = [];
  var target = this.target;

  // get target touches from touches

  targetTouches = allTouches.filter(function (touch) {
    return hasParent(touch.target, target);
  });

  // collect touches
  if (type === INPUT_START) {
    i = 0;
    while (i < targetTouches.length) {
      targetIds[targetTouches[i].identifier] = true;
      i++;
    }
  }

  // filter changed touches to only contain touches that exist in the collected target ids
  i = 0;
  while (i < changedTouches.length) {
    if (targetIds[changedTouches[i].identifier]) {
      changedTargetTouches.push(changedTouches[i]);
    }

    // cleanup removed touches
    if (type & (INPUT_END | INPUT_CANCEL)) {
      delete targetIds[changedTouches[i].identifier];
    }
    i++;
  }

  if (!changedTargetTouches.length) {
    return;
  }

  return [
  // merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
  uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true), changedTargetTouches];
}

var MOUSE_INPUT_MAP = {
  mousedown: INPUT_START,
  mousemove: INPUT_MOVE,
  mouseup: INPUT_END
};

var MOUSE_ELEMENT_EVENTS = 'mousedown';
var MOUSE_WINDOW_EVENTS = 'mousemove mouseup';

/**
 * @private
 * Mouse events input
 * @constructor
 * @extends Input
 */

var MouseInput = function (_Input) {
  inherits(MouseInput, _Input);

  function MouseInput() {
    classCallCheck(this, MouseInput);

    var _this = possibleConstructorReturn(this, (MouseInput.__proto__ || Object.getPrototypeOf(MouseInput)).apply(this, arguments));

    _this.evEl = MOUSE_ELEMENT_EVENTS;
    _this.evWin = MOUSE_WINDOW_EVENTS;

    _this.pressed = false; // mousedown state
    return _this;
  }

  /**
   * @private
   * handle mouse events
   * @param {Object} ev
   */


  createClass(MouseInput, [{
    key: 'handler',
    value: function handler(ev) {
      var eventType = MOUSE_INPUT_MAP[ev.type];

      // on start we want to have the left mouse button down
      if (eventType & INPUT_START && ev.button === 0) {
        this.pressed = true;
      }

      if (eventType & INPUT_MOVE && ev.which !== 1) {
        eventType = INPUT_END;
      }

      // mouse must be down
      if (!this.pressed) {
        return;
      }

      if (eventType & INPUT_END) {
        this.pressed = false;
      }

      this.callback(this.manager, eventType, {
        pointers: [ev],
        changedPointers: [ev],
        pointerType: INPUT_TYPE_MOUSE,
        srcEvent: ev
      });
    }
  }]);
  return MouseInput;
}(Input);

/**
 * @private
 * Combined touch and mouse input
 *
 * Touch has a higher priority then mouse, and while touching no mouse events are allowed.
 * This because touch devices also emit mouse events while doing a touch.
 *
 * @constructor
 * @extends Input
 */

var DEDUP_TIMEOUT = 2500;
var DEDUP_DISTANCE = 25;

var TouchMouseInput = function (_Input) {
  inherits(TouchMouseInput, _Input);

  function TouchMouseInput() {
    classCallCheck(this, TouchMouseInput);

    var _this = possibleConstructorReturn(this, (TouchMouseInput.__proto__ || Object.getPrototypeOf(TouchMouseInput)).apply(this, arguments));

    var handler = bindFn(_this.handler, _this);
    _this.touch = new TouchInput(_this.manager, handler);
    _this.mouse = new MouseInput(_this.manager, handler);

    _this.primaryTouch = null;
    _this.lastTouches = [];
    return _this;
  }

  /**
   * @private
   * handle mouse and touch events
   * @param {Hammer} manager
   * @param {String} inputEvent
   * @param {Object} inputData
   */


  createClass(TouchMouseInput, [{
    key: 'handler',
    value: function handler(manager, inputEvent, inputData) {
      var isTouch = inputData.pointerType === INPUT_TYPE_TOUCH;
      var isMouse = inputData.pointerType === INPUT_TYPE_MOUSE;

      if (isMouse && inputData.sourceCapabilities && inputData.sourceCapabilities.firesTouchEvents) {
        return;
      }

      // when we're in a touch event, record touches to  de-dupe synthetic mouse event
      if (isTouch) {
        recordTouches.call(this, inputEvent, inputData);
      } else if (isMouse && isSyntheticEvent.call(this, inputData)) {
        return;
      }

      this.callback(manager, inputEvent, inputData);
    }

    /**
     * @private
     * remove the event listeners
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      this.touch.destroy();
      this.mouse.destroy();
    }
  }]);
  return TouchMouseInput;
}(Input);

function recordTouches(eventType, eventData) {
  if (eventType & INPUT_START) {
    this.primaryTouch = eventData.changedPointers[0].identifier;
    setLastTouch.call(this, eventData);
  } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
    setLastTouch.call(this, eventData);
  }
}

function setLastTouch(eventData) {
  var _this2 = this;

  var _eventData$changedPoi = slicedToArray(eventData.changedPointers, 1);

  var touch = _eventData$changedPoi[0];

  if (touch.identifier === this.primaryTouch) {
    (function () {
      var lastTouch = { x: touch.clientX, y: touch.clientY };
      _this2.lastTouches.push(lastTouch);
      var lts = _this2.lastTouches;
      var removeLastTouch = function removeLastTouch() {
        var i = lts.indexOf(lastTouch);
        if (i > -1) {
          lts.splice(i, 1);
        }
      };
      setTimeout(removeLastTouch, DEDUP_TIMEOUT);
    })();
  }
}

function isSyntheticEvent(eventData) {
  var x = eventData.srcEvent.clientX;
  var y = eventData.srcEvent.clientY;
  for (var i = 0; i < this.lastTouches.length; i++) {
    var t = this.lastTouches[i];
    var dx = Math.abs(x - t.x);
    var dy = Math.abs(y - t.y);
    if (dx <= DEDUP_DISTANCE && dy <= DEDUP_DISTANCE) {
      return true;
    }
  }
  return false;
}

/**
 * @private
 * create new input type manager
 * called by the Manager constructor
 * @param {Hammer} manager
 * @returns {Input}
 */
function createInputInstance(manager) {
  var Type = void 0;
  // let inputClass = manager.options.inputClass;
  var inputClass = manager.options.inputClass;

  if (inputClass) {
    Type = inputClass;
  } else if (SUPPORT_POINTER_EVENTS) {
    Type = PointerEventInput;
  } else if (SUPPORT_ONLY_TOUCH) {
    Type = TouchInput;
  } else if (!SUPPORT_TOUCH) {
    Type = MouseInput;
  } else {
    Type = TouchMouseInput;
  }
  return new Type(manager, inputHandler);
}

var STOP = 1;
var FORCED_STOP = 2;

/**
* @private
 * Manager
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */

var Manager = function () {
  function Manager(element, options) {
    var _this = this;

    classCallCheck(this, Manager);

    this.options = assign$1({}, Hammer.defaults, options || {});

    this.options.inputTarget = this.options.inputTarget || element;

    this.handlers = {};
    this.session = {};
    this.recognizers = [];
    this.oldCssProps = {};

    this.element = element;
    this.input = createInputInstance(this);
    this.touchAction = new TouchAction(this, this.options.touchAction);

    toggleCssProps(this, true);

    each(this.options.recognizers, function (item) {
      var recognizer = _this.add(new item[0](item[1]));
      item[2] && recognizer.recognizeWith(item[2]);
      item[3] && recognizer.requireFailure(item[3]);
    }, this);
  }

  /**
   * @private
   * set options
   * @param {Object} options
   * @returns {Manager}
   */


  createClass(Manager, [{
    key: 'set',
    value: function set(options) {
      assign$1(this.options, options);

      // Options that need a little more setup
      if (options.touchAction) {
        this.touchAction.update();
      }
      if (options.inputTarget) {
        // Clean up existing event listeners and reinitialize
        this.input.destroy();
        this.input.target = options.inputTarget;
        this.input.init();
      }
      return this;
    }

    /**
     * @private
     * stop recognizing for this session.
     * This session will be discarded, when a new [input]start event is fired.
     * When forced, the recognizer cycle is stopped immediately.
     * @param {Boolean} [force]
     */

  }, {
    key: 'stop',
    value: function stop(force) {
      this.session.stopped = force ? FORCED_STOP : STOP;
    }

    /**
     * @private
     * run the recognizers!
     * called by the inputHandler function on every movement of the pointers (touches)
     * it walks through all the recognizers and tries to detect the gesture that is being made
     * @param {Object} inputData
     */

  }, {
    key: 'recognize',
    value: function recognize(inputData) {
      var session = this.session;

      if (session.stopped) {
        return;
      }

      // run the touch-action polyfill
      this.touchAction.preventDefaults(inputData);

      var recognizer = void 0;
      var recognizers = this.recognizers;

      // this holds the recognizer that is being recognized.
      // so the recognizer's state needs to be BEGAN, CHANGED, ENDED or RECOGNIZED
      // if no recognizer is detecting a thing, it is set to `null`

      var curRecognizer = session.curRecognizer;

      // reset when the last recognizer is recognized
      // or when we're in a new session

      if (!curRecognizer || curRecognizer && curRecognizer.state & STATE_RECOGNIZED) {
        curRecognizer = session.curRecognizer = null;
      }

      var i = 0;
      while (i < recognizers.length) {
        recognizer = recognizers[i];

        // find out if we are allowed try to recognize the input for this one.
        // 1.   allow if the session is NOT forced stopped (see the .stop() method)
        // 2.   allow if we still haven't recognized a gesture in this session, or the this recognizer is the one
        //      that is being recognized.
        // 3.   allow if the recognizer is allowed to run simultaneous with the current recognized recognizer.
        //      this can be setup with the `recognizeWith()` method on the recognizer.
        if (session.stopped !== FORCED_STOP && ( // 1
        !curRecognizer || recognizer === curRecognizer || // 2
        recognizer.canRecognizeWith(curRecognizer))) {
          // 3
          recognizer.recognize(inputData);
        } else {
          recognizer.reset();
        }

        // if the recognizer has been recognizing the input as a valid gesture, we want to store this one as the
        // current active recognizer. but only if we don't already have an active recognizer
        if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
          curRecognizer = session.curRecognizer = recognizer;
        }
        i++;
      }
    }

    /**
     * @private
     * get a recognizer by its event name.
     * @param {Recognizer|String} recognizer
     * @returns {Recognizer|Null}
     */

  }, {
    key: 'get',
    value: function get(recognizer) {
      if (recognizer instanceof Recognizer) {
        return recognizer;
      }

      var recognizers = this.recognizers;

      for (var i = 0; i < recognizers.length; i++) {
        if (recognizers[i].options.event === recognizer) {
          return recognizers[i];
        }
      }
      return null;
    }

    /**
     * @private add a recognizer to the manager
     * existing recognizers with the same event name will be removed
     * @param {Recognizer} recognizer
     * @returns {Recognizer|Manager}
     */

  }, {
    key: 'add',
    value: function add(recognizer) {
      if (invokeArrayArg(recognizer, 'add', this)) {
        return this;
      }

      // remove existing
      var existing = this.get(recognizer.options.event);
      if (existing) {
        this.remove(existing);
      }

      this.recognizers.push(recognizer);
      recognizer.manager = this;

      this.touchAction.update();
      return recognizer;
    }

    /**
     * @private
     * remove a recognizer by name or instance
     * @param {Recognizer|String} recognizer
     * @returns {Manager}
     */

  }, {
    key: 'remove',
    value: function remove(recognizer) {
      if (invokeArrayArg(recognizer, 'remove', this)) {
        return this;
      }

      recognizer = this.get(recognizer);

      // let's make sure this recognizer exists
      if (recognizer) {
        var recognizers = this.recognizers;

        var index = inArray(recognizers, recognizer);

        if (index !== -1) {
          recognizers.splice(index, 1);
          this.touchAction.update();
        }
      }

      return this;
    }

    /**
     * @private
     * bind event
     * @param {String} events
     * @param {Function} handler
     * @returns {EventEmitter} this
     */

  }, {
    key: 'on',
    value: function on(events, handler) {
      if (events === undefined) {
        return;
      }
      if (handler === undefined) {
        return;
      }

      var handlers = this.handlers;

      each(splitStr(events), function (event) {
        handlers[event] = handlers[event] || [];
        handlers[event].push(handler);
      });
      return this;
    }

    /**
     * @private unbind event, leave emit blank to remove all handlers
     * @param {String} events
     * @param {Function} [handler]
     * @returns {EventEmitter} this
     */

  }, {
    key: 'off',
    value: function off(events, handler) {
      if (events === undefined) {
        return;
      }

      var handlers = this.handlers;

      each(splitStr(events), function (event) {
        if (!handler) {
          delete handlers[event];
        } else {
          handlers[event] && handlers[event].splice(inArray(handlers[event], handler), 1);
        }
      });
      return this;
    }

    /**
     * @private emit event to the listeners
     * @param {String} event
     * @param {Object} data
     */

  }, {
    key: 'emit',
    value: function emit(event, data) {
      // we also want to trigger dom events
      if (this.options.domEvents) {
        triggerDomEvent(event, data);
      }

      // no handlers, so skip it all
      var handlers = this.handlers[event] && this.handlers[event].slice();
      if (!handlers || !handlers.length) {
        return;
      }

      data.type = event;
      data.preventDefault = function () {
        data.srcEvent.preventDefault();
      };

      var i = 0;
      while (i < handlers.length) {
        handlers[i](data);
        i++;
      }
    }

    /**
     * @private
     * destroy the manager and unbinds all events
     * it doesn't unbind dom events, that is the user own responsibility
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      this.element && toggleCssProps(this, false);

      this.handlers = {};
      this.session = {};
      this.input.destroy();
      this.element = null;
    }
  }]);
  return Manager;
}();

function toggleCssProps(manager, add) {
  var element = manager.element;

  if (!element.style) {
    return;
  }
  var prop = void 0;
  each(manager.options.cssProps, function (value, name) {
    prop = prefixed(element.style, name);
    if (add) {
      manager.oldCssProps[prop] = element.style[prop];
      element.style[prop] = value;
    } else {
      element.style[prop] = manager.oldCssProps[prop] || '';
    }
  });
  if (!add) {
    manager.oldCssProps = {};
  }
}

/**
 * @private
 * trigger dom event
 * @param {String} event
 * @param {Object} data
 */
function triggerDomEvent(event, data) {
  var gestureEvent = document.createEvent('Event');
  gestureEvent.initEvent(event, true, true);
  gestureEvent.gesture = data;
  data.target.dispatchEvent(gestureEvent);
}

/**
 * @private
 * Simple way to create a manager with a default set of recognizers.
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */

var Hammer = function Hammer(element, options) {
  classCallCheck(this, Hammer);

  options = options || {};
  options.recognizers = ifUndefined(options.recognizers, Hammer.defaults.preset);
  return new Manager(element, options);
};

Hammer.VERSION = '2.0.8';

/**
 * @private
 * default settings
 * @namespace
 */
Hammer.defaults = {
  /**
   * @private
   * set if DOM events are being triggered.
   * But this is slower and unused by simple implementations, so disabled by default.
   * @type {Boolean}
   * @default false
   */
  domEvents: false,

  /**
   * @private
   * The value for the touchAction property/fallback.
   * When set to `compute` it will magically set the correct value based on the added recognizers.
   * @type {String}
   * @default compute
   */
  touchAction: TOUCH_ACTION_COMPUTE,

  /**
   * @private
   * @type {Boolean}
   * @default true
   */
  enable: true,

  /**
   * @private
   * EXPERIMENTAL FEATURE -- can be removed/changed
   * Change the parent input target element.
   * If Null, then it is being set the to main element.
   * @type {Null|EventTarget}
   * @default null
   */
  inputTarget: null,

  /**
   * @private
   * force an input class
   * @type {Null|Function}
   * @default null
   */
  inputClass: null,

  /**
   * @private
   * Default recognizer setup when calling `Hammer()`
   * When creating a new Manager these will be skipped.
   * @type {Array}
   */
  preset: [
  // RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
  [RotateRecognizer, { enable: false }], [PinchRecognizer, { enable: false }, ['rotate']], [SwipeRecognizer, { direction: DIRECTION_HORIZONTAL }], [PanRecognizer, { direction: DIRECTION_HORIZONTAL }, ['swipe']], [TapRecognizer], [TapRecognizer, { event: 'doubletap', taps: 2 }, ['tap']], [PressRecognizer]],

  /**
   * @private
   * Some CSS properties can be used to improve the working of Hammer.
   * Add them to this method and they will be set when creating a new Manager.
   * @namespace
   */
  cssProps: {
    /**
     * @private
     * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
     * @type {String}
     * @default 'none'
     */
    userSelect: 'none',

    /**
     * @private
     * Disable the Windows Phone grippers when pressing an element.
     * @type {String}
     * @default 'none'
     */
    touchSelect: 'none',

    /**
     * @private
     * Disables the default callout shown when you touch and hold a touch target.
     * On iOS, when you touch and hold a touch target such as a link, Safari displays
     * a callout containing information about the link. This property allows you to disable that callout.
     * @type {String}
     * @default 'none'
     */
    touchCallout: 'none',

    /**
     * @private
     * Specifies whether zooming is enabled. Used by IE10>
     * @type {String}
     * @default 'none'
     */
    contentZooming: 'none',

    /**
     * @private
     * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
     * @type {String}
     * @default 'none'
     */
    userDrag: 'none',

    /**
     * @private
     * Overrides the highlight color shown when the user taps a link or a JavaScript
     * clickable element in iOS. This property obeys the alpha value, if specified.
     * @type {String}
     * @default 'rgba(0,0,0,0)'
     */
    tapHighlightColor: 'rgba(0,0,0,0)'
  }
};

var SINGLE_TOUCH_INPUT_MAP = {
  touchstart: INPUT_START,
  touchmove: INPUT_MOVE,
  touchend: INPUT_END,
  touchcancel: INPUT_CANCEL
};

var SINGLE_TOUCH_TARGET_EVENTS = 'touchstart';
var SINGLE_TOUCH_WINDOW_EVENTS = 'touchstart touchmove touchend touchcancel';

/**
 * @private
 * Touch events input
 * @constructor
 * @extends Input
 */

var SingleTouchInput = function (_Input) {
  inherits(SingleTouchInput, _Input);

  function SingleTouchInput() {
    classCallCheck(this, SingleTouchInput);

    var _this = possibleConstructorReturn(this, (SingleTouchInput.__proto__ || Object.getPrototypeOf(SingleTouchInput)).apply(this, arguments));

    _this.evTarget = SINGLE_TOUCH_TARGET_EVENTS;
    _this.evWin = SINGLE_TOUCH_WINDOW_EVENTS;
    _this.started = false;

    Input.apply(_this, arguments);
    return _this;
  }

  createClass(SingleTouchInput, [{
    key: 'handler',
    value: function handler(ev) {
      var type = SINGLE_TOUCH_INPUT_MAP[ev.type];

      // should we handle the touch events?
      if (type === INPUT_START) {
        this.started = true;
      }

      if (!this.started) {
        return;
      }

      var touches = normalizeSingleTouches.call(this, ev, type);

      // when done, reset the started state
      if (type & (INPUT_END | INPUT_CANCEL) && touches[0].length - touches[1].length === 0) {
        this.started = false;
      }

      this.callback(this.manager, type, {
        pointers: touches[0],
        changedPointers: touches[1],
        pointerType: INPUT_TYPE_TOUCH,
        srcEvent: ev
      });
    }
  }]);
  return SingleTouchInput;
}(Input);

function normalizeSingleTouches(ev, type) {
  var all = toArray$1(ev.touches);
  var changed = toArray$1(ev.changedTouches);

  if (type & (INPUT_END | INPUT_CANCEL)) {
    all = uniqueArray(all.concat(changed), 'identifier', true);
  }

  return [all, changed];
}

/**
 * @private
 * wrap a method with a deprecation warning and stack trace
 * @param {Function} method
 * @param {String} name
 * @param {String} message
 * @returns {Function} A new function wrapping the supplied method.
 */
function deprecate(method, name, message) {
  var deprecationMessage = 'DEPRECATED METHOD: ' + name + '\n' + message + ' AT \n';
  return function () {
    var e = new Error('get-stack-trace');
    var stack = e && e.stack ? e.stack.replace(/^[^\(]+?[\n$]/gm, '').replace(/^\s+at\s+/gm, '').replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@') : 'Unknown Stack Trace';

    var log = window.console && (window.console.warn || window.console.log);
    if (log) {
      log.call(window.console, deprecationMessage, stack);
    }
    return method.apply(this, arguments);
  };
}

/**
 * @private
 * extend object.
 * means that properties in dest will be overwritten by the ones in src.
 * @param {Object} dest
 * @param {Object} src
 * @param {Boolean} [merge=false]
 * @returns {Object} dest
 */
var extend = deprecate(function (dest, src, merge) {
  var keys = Object.keys(src);
  var i = 0;
  while (i < keys.length) {
    if (!merge || merge && dest[keys[i]] === undefined) {
      dest[keys[i]] = src[keys[i]];
    }
    i++;
  }
  return dest;
}, 'extend', 'Use `assign`.');

/**
 * @private
 * merge the values from src in the dest.
 * means that properties that exist in dest will not be overwritten by src
 * @param {Object} dest
 * @param {Object} src
 * @returns {Object} dest
 */
var merge = deprecate(function (dest, src) {
  return extend(dest, src, true);
}, 'merge', 'Use `assign`.');

/**
 * @private
 * simple class inheritance
 * @param {Function} child
 * @param {Function} base
 * @param {Object} [properties]
 */
function inherit(child, base, properties) {
  var baseP = base.prototype;
  var childP = void 0;

  childP = child.prototype = Object.create(baseP);
  childP.constructor = child;
  childP._super = baseP;

  if (properties) {
    assign$1(childP, properties);
  }
}

// this prevents errors when Hammer is loaded in the presence of an AMD
//  style loader but by script tag, not by the loader.

assign$1(Hammer, {
  INPUT_START: INPUT_START,
  INPUT_MOVE: INPUT_MOVE,
  INPUT_END: INPUT_END,
  INPUT_CANCEL: INPUT_CANCEL,

  STATE_POSSIBLE: STATE_POSSIBLE,
  STATE_BEGAN: STATE_BEGAN,
  STATE_CHANGED: STATE_CHANGED,
  STATE_ENDED: STATE_ENDED,
  STATE_RECOGNIZED: STATE_RECOGNIZED,
  STATE_CANCELLED: STATE_CANCELLED,
  STATE_FAILED: STATE_FAILED,

  DIRECTION_NONE: DIRECTION_NONE,
  DIRECTION_LEFT: DIRECTION_LEFT,
  DIRECTION_RIGHT: DIRECTION_RIGHT,
  DIRECTION_UP: DIRECTION_UP,
  DIRECTION_DOWN: DIRECTION_DOWN,
  DIRECTION_HORIZONTAL: DIRECTION_HORIZONTAL,
  DIRECTION_VERTICAL: DIRECTION_VERTICAL,
  DIRECTION_ALL: DIRECTION_ALL,

  Manager: Manager,
  Input: Input,
  TouchAction: TouchAction,

  TouchInput: TouchInput,
  MouseInput: MouseInput,
  PointerEventInput: PointerEventInput,
  TouchMouseInput: TouchMouseInput,
  SingleTouchInput: SingleTouchInput,

  Recognizer: Recognizer,
  AttrRecognizer: AttrRecognizer,
  Tap: TapRecognizer,
  Pan: PanRecognizer,
  Swipe: SwipeRecognizer,
  Pinch: PinchRecognizer,
  Rotate: RotateRecognizer,
  Press: PressRecognizer,

  on: addEventListeners,
  off: removeEventListeners,
  each: each,
  merge: merge,
  extend: extend,
  assign: assign$1,
  inherit: inherit,
  bindFn: bindFn,
  prefixed: prefixed,
  toArray: toArray$1,
  inArray: inArray,
  uniqueArray: uniqueArray,
  splitStr: splitStr,
  boolOrFn: boolOrFn,
  hasParent: hasParent,
  addEventListeners: addEventListeners,
  removeEventListeners: removeEventListeners
});

/* jshint ignore:start */
if (typeof define === 'function' && define.amd) {
  define(function () {
    return Hammer;
  });
} else if (typeof module !== 'undefined' && module.exports) {
  module.exports = Hammer;
} else {
  window[exportName] = Hammer;
}
/* jshint ignore:end */
})(window, document, 'Hammer');
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

},{}]},{},[13])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImpzL2xpYi9haUJyYWluLmpzIiwianMvbGliL2NhbnZhc1JlbmRlcmluZ0NvbnRleHQyREV4dGVuc2lvbnMuanMiLCJqcy9saWIvZ2FtZS5qcyIsImpzL2xpYi9ndWlkLmpzIiwianMvbGliL2luZm9Cb3guanMiLCJqcy9saWIvaXNNb2JpbGVEZXZpY2UuanMiLCJqcy9saWIvbW9uc3Rlci5qcyIsImpzL2xpYi9wbHVnaW5zLmpzIiwianMvbGliL3NraWVyLmpzIiwianMvbGliL3Nub3dib2FyZGVyLmpzIiwianMvbGliL3Nwcml0ZS5qcyIsImpzL2xpYi9zcHJpdGVBcnJheS5qcyIsImpzL21haW4uanMiLCJqcy9zcHJpdGVJbmZvLmpzIiwibm9kZV9tb2R1bGVzL2JyLW1vdXNldHJhcC9tb3VzZXRyYXAuanMiLCJub2RlX21vZHVsZXMvZXZlbnRlZGxvb3AvbGliL21haW4uanMiLCJub2RlX21vZHVsZXMvZXZlbnRlZGxvb3Avbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvdW5kZXJzY29yZS5qcyIsIm5vZGVfbW9kdWxlcy9oYW1tZXJqcy9oYW1tZXIuanMiLCIuLi8uLi8uLi8uLi8uLi8uLi91c3IvbG9jYWwvbGliL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9ldmVudHMvZXZlbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2ZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOVlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUMveUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3pMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdnFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLy8gc2hvdWxkIGJlIHB1dCBpbiBhIGRlZGljYXRlZCBwYWNrYWdlXG4vLyB1c2luZyBucG0gbGluayB0byB1c2UgaXQgZnJvbSBza2lmcmVlLmpzP1xuXG5cbihmdW5jdGlvbiAoZ2xvYmFsKSB7XG5cdGZ1bmN0aW9uIEFpQnJhaW4gKCkge1xuICAgICAgICB0aGlzLmFpQnJhaW5KcyA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5zdGVwID0gMDtcblxuICAgICAgICB0aGlzLnRyYWluaW5nVmVjdG9ycyA9IFtdOyAvLyBUT0RPIHdlIHNob3VsZCB1c2Ugc3RyZWFtIGlucHV0IGZvciBicmFpbmpzXG5cbiAgICAgICAgdGhpcy5MRUFSTklOR19TVEVQX0NPVU5UID0gMjAwO1xuICAgICAgICB0aGlzLlJFUExBWV9TVEVQX0NPVU5UID0gNDAwO1xuXG4gICAgICAgIHRoaXMucmVzZXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuYWlCcmFpbkpzID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgdGhpcy5zdGVwID0gMDtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdhaUJyYWluOiByZXNldCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jeWNsZSA9IGZ1bmN0aW9uKHN0YXRpY09iamVjdHMsIG1vdmluZ09iamVjdHMsIHBsYXllcikge1xuICAgICAgICAgICAgbGV0IGN1cnJlbnRTaXR1YXRpb247XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnN0ZXAgPCB0aGlzLkxFQVJOSU5HX1NURVBfQ09VTlQpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnYWlCcmFpbjogcmVjb3JkJyk7XG4gICAgICAgICAgICAgICAgLy8gd2UgbGVhcm4gKHNhbXBsZWQgbGVhcm5pbmcsIG9ubHkgd2hlbiB0aGVyZSBpcyBjaGFuZ2UgaW4gdGhlIGlucHV0cylcbiAgICAgICAgICAgICAgICAvLyBUT0RPXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuc3RlcCA8IHRoaXMuUkVQTEFZX1NURVBfQ09VTlQpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYWlCcmFpbkpzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdhaUJyYWluOiB0cmFpbiBBSScpO1xuICAgICAgICAgICAgICAgICAgICAvLyB3ZSBjcmVhdGUgYW5kIHRyYWluIHRoZSBJQVxuICAgICAgICAgICAgICAgICAgICAvLyBUT0RPXG5cbiAgICAgICAgICAgICAgICAgICAgLy8gYWxlcnQgdGhlIHVzZXIgYWJvdXQgdGhlIHN3aXRjaCB0byB0aGUgcmVwbGF5IG1vZGVcbiAgICAgICAgICAgICAgICAgICAgLy8gVE9ET1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnYWlCcmFpbjogcmVwbGF5Jyk7XG4gICAgICAgICAgICAgICAgLy8gd2UgcmVwbGF5XG4gICAgICAgICAgICAgICAgLy8gVE9ET1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBnbyB0byB0aGUgc2NvcmUgcGFydFxuICAgICAgICAgICAgICAgIHByb2Nlc3NTY29yZShwbGF5ZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zdGVwKys7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50U2l0dWF0aW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5nZXRBSUNvbW1hbmQgPSBmdW5jdGlvbihjdXJyZW50U2l0dWF0aW9uKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnYWlCcmFpbjogZ2V0QUlDb21tYW5kJyk7XG4gICAgICAgICAgICBpZiAoY3VycmVudFNpdHVhdGlvbiAmJiB0aGlzLmFpQnJhaW5Kcykge1xuICAgICAgICAgICAgICAgIC8vIHdlIHJldHVybiB0aGUgY29tbWFuZCBjYWxjdWxhdGVkIGJ5IHRoZSBJQVxuICAgICAgICAgICAgICAgIC8vIFRPRE9cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRoaXMuZW5kY3ljbGUgPSBmdW5jdGlvbihwbGF5ZXIpIHtcbiAgICAgICAgICAgIC8vIFRPRE8gd2hlcmUgdG8gY2FsbCBpdCBmcm9tIGdhbWUuanMgPz9cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdhaUJyYWluOiBlbmRjeWNsZScpO1xuICAgICAgICAgICAgLy8gZGVwZW5kaW5nIG9uIHRoZSBzdGVwXG4gICAgICAgICAgICBpZiAodGhpcy5zdGVwIDwgdGhpcy5MRUFSTklOR19TVEVQX0NPVU5UKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhlIHNraWVyIHNob3VsZCBub3QgYmUgYWJsZSB0byBkaWUgaW4gdGhlIGxlYXJuaW5nIHBoYXNlXG4gICAgICAgICAgICAgICAgLy8gVE9ET1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnN0ZXAgPCB0aGlzLlJFUExBWV9TVEVQX0NPVU5UKSB7XG4gICAgICAgICAgICAgICAgLy8gd2FybiB0aGUgdXNlciB0aGUgSUEganVzdCBkaWVkXG4gICAgICAgICAgICAgICAgcHJvY2Vzc1Njb3JlKHBsYXllcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBwcm9jZXNzU2NvcmUocGxheWVyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnYWlCcmFpbjogcHJvY2VzcyBzY29yZScpO1xuICAgICAgICAgICAgYWxlcnQoJ1lPVVIgU0NPUkUgSVM6ICcpO1xuICAgICAgICAgICAgLy8gVE9ET1xuXG4gICAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgICAgICAvLyBUT0RPIGdhbWUgbXVzdCBiZSBhbHNvIHJlc2V0XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnbG9iYWwuQWlCcmFpbiA9IEFpQnJhaW47XG59KSh0aGlzKTtcblxuaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSB7XG5cdG1vZHVsZS5leHBvcnRzID0gdGhpcy5BaUJyYWluO1xufSIsIkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRC5wcm90b3R5cGUuc3RvcmVMb2FkZWRJbWFnZSA9IGZ1bmN0aW9uIChrZXksIGltYWdlKSB7XG5cdGlmICghdGhpcy5pbWFnZXMpIHtcblx0XHR0aGlzLmltYWdlcyA9IHt9O1xuXHR9XG5cblx0dGhpcy5pbWFnZXNba2V5XSA9IGltYWdlO1xufTtcblxuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELnByb3RvdHlwZS5nZXRMb2FkZWRJbWFnZSA9IGZ1bmN0aW9uIChrZXkpIHtcblx0aWYgKHRoaXMuaW1hZ2VzW2tleV0pIHtcblx0XHRyZXR1cm4gdGhpcy5pbWFnZXNba2V5XTtcblx0fVxufTtcblxuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELnByb3RvdHlwZS5mb2xsb3dTcHJpdGUgPSBmdW5jdGlvbiAoc3ByaXRlKSB7XG5cdHRoaXMuY2VudHJhbFNwcml0ZSA9IHNwcml0ZTtcbn07XG5cbkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRC5wcm90b3R5cGUuZ2V0Q2VudHJhbFBvc2l0aW9uID0gZnVuY3Rpb24gKCkge1xuXHRyZXR1cm4ge1xuXHRcdG1hcDogdGhpcy5jZW50cmFsU3ByaXRlLm1hcFBvc2l0aW9uLFxuXHRcdGNhbnZhczogWyBNYXRoLnJvdW5kKHRoaXMuY2FudmFzLndpZHRoICogMC41KSwgTWF0aC5yb3VuZCh0aGlzLmNhbnZhcy5oZWlnaHQgKiAwLjUpLCAwXVxuXHR9O1xufTtcblxuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELnByb3RvdHlwZS5tYXBQb3NpdGlvblRvQ2FudmFzUG9zaXRpb24gPSBmdW5jdGlvbiAocG9zaXRpb24pIHtcblx0dmFyIGNlbnRyYWwgPSB0aGlzLmdldENlbnRyYWxQb3NpdGlvbigpO1xuXHR2YXIgY2VudHJhbE1hcFBvc2l0aW9uID0gY2VudHJhbC5tYXA7XG5cdHZhciBjZW50cmFsQ2FudmFzUG9zaXRpb24gPSBjZW50cmFsLmNhbnZhcztcblx0dmFyIG1hcERpZmZlcmVuY2VYID0gY2VudHJhbE1hcFBvc2l0aW9uWzBdIC0gcG9zaXRpb25bMF07XG5cdHZhciBtYXBEaWZmZXJlbmNlWSA9IGNlbnRyYWxNYXBQb3NpdGlvblsxXSAtIHBvc2l0aW9uWzFdO1xuXHRyZXR1cm4gWyBjZW50cmFsQ2FudmFzUG9zaXRpb25bMF0gLSBtYXBEaWZmZXJlbmNlWCwgY2VudHJhbENhbnZhc1Bvc2l0aW9uWzFdIC0gbWFwRGlmZmVyZW5jZVkgXTtcbn07XG5cbkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRC5wcm90b3R5cGUuY2FudmFzUG9zaXRpb25Ub01hcFBvc2l0aW9uID0gZnVuY3Rpb24gKHBvc2l0aW9uKSB7XG5cdHZhciBjZW50cmFsID0gdGhpcy5nZXRDZW50cmFsUG9zaXRpb24oKTtcblx0dmFyIGNlbnRyYWxNYXBQb3NpdGlvbiA9IGNlbnRyYWwubWFwO1xuXHR2YXIgY2VudHJhbENhbnZhc1Bvc2l0aW9uID0gY2VudHJhbC5jYW52YXM7XG5cdHZhciBtYXBEaWZmZXJlbmNlWCA9IGNlbnRyYWxDYW52YXNQb3NpdGlvblswXSAtIHBvc2l0aW9uWzBdO1xuXHR2YXIgbWFwRGlmZmVyZW5jZVkgPSBjZW50cmFsQ2FudmFzUG9zaXRpb25bMV0gLSBwb3NpdGlvblsxXTtcblx0cmV0dXJuIFsgY2VudHJhbE1hcFBvc2l0aW9uWzBdIC0gbWFwRGlmZmVyZW5jZVgsIGNlbnRyYWxNYXBQb3NpdGlvblsxXSAtIG1hcERpZmZlcmVuY2VZIF07XG59O1xuXG5DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQucHJvdG90eXBlLmdldENlbnRyZU9mVmlld3BvcnQgPSBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiAodGhpcy5jYW52YXMud2lkdGggLyAyKS5mbG9vcigpO1xufTtcblxuLy8gWS1wb3MgY2FudmFzIGZ1bmN0aW9uc1xuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELnByb3RvdHlwZS5nZXRNaWRkbGVPZlZpZXdwb3J0ID0gZnVuY3Rpb24gKCkge1xuXHRyZXR1cm4gKHRoaXMuY2FudmFzLmhlaWdodCAvIDIpLmZsb29yKCk7XG59O1xuXG5DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQucHJvdG90eXBlLmdldEJlbG93Vmlld3BvcnQgPSBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiB0aGlzLmNhbnZhcy5oZWlnaHQuZmxvb3IoKTtcbn07XG5cbkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRC5wcm90b3R5cGUuZ2V0TWFwQmVsb3dWaWV3cG9ydCA9IGZ1bmN0aW9uICgpIHtcblx0dmFyIGJlbG93ID0gdGhpcy5nZXRCZWxvd1ZpZXdwb3J0KCk7XG5cdHJldHVybiB0aGlzLmNhbnZhc1Bvc2l0aW9uVG9NYXBQb3NpdGlvbihbIDAsIGJlbG93IF0pWzFdO1xufTtcblxuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELnByb3RvdHlwZS5nZXRSYW5kb21seUluVGhlQ2VudHJlT2ZDYW52YXMgPSBmdW5jdGlvbiAoYnVmZmVyKSB7XG5cdHZhciBtaW4gPSAwO1xuXHR2YXIgbWF4ID0gdGhpcy5jYW52YXMud2lkdGg7XG5cblx0aWYgKGJ1ZmZlcikge1xuXHRcdG1pbiAtPSBidWZmZXI7XG5cdFx0bWF4ICs9IGJ1ZmZlcjtcblx0fVxuXG5cdHJldHVybiBOdW1iZXIucmFuZG9tKG1pbiwgbWF4KTtcbn07XG5cbkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRC5wcm90b3R5cGUuZ2V0UmFuZG9tbHlJblRoZUNlbnRyZU9mTWFwID0gZnVuY3Rpb24gKGJ1ZmZlcikge1xuXHR2YXIgcmFuZG9tID0gdGhpcy5nZXRSYW5kb21seUluVGhlQ2VudHJlT2ZDYW52YXMoYnVmZmVyKTtcblx0cmV0dXJuIHRoaXMuY2FudmFzUG9zaXRpb25Ub01hcFBvc2l0aW9uKFsgcmFuZG9tLCAwIF0pWzBdO1xufTtcblxuQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELnByb3RvdHlwZS5nZXRSYW5kb21NYXBQb3NpdGlvbkJlbG93Vmlld3BvcnQgPSBmdW5jdGlvbiAoKSB7XG5cdHZhciB4Q2FudmFzID0gdGhpcy5nZXRSYW5kb21seUluVGhlQ2VudHJlT2ZDYW52YXMoKTtcblx0dmFyIHlDYW52YXMgPSB0aGlzLmdldEJlbG93Vmlld3BvcnQoKTtcblx0cmV0dXJuIHRoaXMuY2FudmFzUG9zaXRpb25Ub01hcFBvc2l0aW9uKFsgeENhbnZhcywgeUNhbnZhcyBdKTtcbn07XG5cbkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRC5wcm90b3R5cGUuZ2V0UmFuZG9tTWFwUG9zaXRpb25BYm92ZVZpZXdwb3J0ID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgeENhbnZhcyA9IHRoaXMuZ2V0UmFuZG9tbHlJblRoZUNlbnRyZU9mQ2FudmFzKCk7XG5cdHZhciB5Q2FudmFzID0gdGhpcy5nZXRBYm92ZVZpZXdwb3J0KCk7XG5cdHJldHVybiB0aGlzLmNhbnZhc1Bvc2l0aW9uVG9NYXBQb3NpdGlvbihbIHhDYW52YXMsIHlDYW52YXMgXSk7XG59O1xuXG5DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQucHJvdG90eXBlLmdldFRvcE9mVmlld3BvcnQgPSBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiB0aGlzLmNhbnZhc1Bvc2l0aW9uVG9NYXBQb3NpdGlvbihbIDAsIDAgXSlbMV07XG59O1xuXG5DYW52YXNSZW5kZXJpbmdDb250ZXh0MkQucHJvdG90eXBlLmdldEFib3ZlVmlld3BvcnQgPSBmdW5jdGlvbiAoKSB7XG5cdHJldHVybiAwIC0gKHRoaXMuY2FudmFzLmhlaWdodCAvIDQpLmZsb29yKCk7XG59OyIsInZhciBTcHJpdGVBcnJheSA9IHJlcXVpcmUoJy4vc3ByaXRlQXJyYXknKTtcbnZhciBFdmVudGVkTG9vcCA9IHJlcXVpcmUoJ2V2ZW50ZWRsb29wJyk7XG52YXIgQWlCcmFpbiA9IHJlcXVpcmUoJy4vYWlCcmFpbicpO1xuXG4oZnVuY3Rpb24gKGdsb2JhbCkge1xuXHRmdW5jdGlvbiBHYW1lIChtYWluQ2FudmFzLCBwbGF5ZXIpIHtcblx0XHR2YXIgc3RhdGljT2JqZWN0cyA9IG5ldyBTcHJpdGVBcnJheSgpO1xuXHRcdHZhciBtb3ZpbmdPYmplY3RzID0gbmV3IFNwcml0ZUFycmF5KCk7XG5cdFx0dmFyIHVpRWxlbWVudHMgPSBuZXcgU3ByaXRlQXJyYXkoKTtcblx0XHR2YXIgZENvbnRleHQgPSBtYWluQ2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cdFx0dmFyIG1vdXNlWCA9IGRDb250ZXh0LmdldENlbnRyZU9mVmlld3BvcnQoKTtcblx0XHR2YXIgbW91c2VZID0gMDtcblx0XHR2YXIgcGF1c2VkID0gZmFsc2U7XG5cdFx0dmFyIHRoYXQgPSB0aGlzO1xuXHRcdHZhciBiZWZvcmVDeWNsZUNhbGxiYWNrcyA9IFtdO1xuXHRcdHZhciBhZnRlckN5Y2xlQ2FsbGJhY2tzID0gW107XG5cdFx0dmFyIGdhbWVMb29wID0gbmV3IEV2ZW50ZWRMb29wKCk7XG5cdFx0dmFyIGFpQnJhaW4gPSBuZXcgQWlCcmFpbigpO1xuXHRcdGFpQnJhaW4ucmVzZXQoKTtcblxuXHRcdHRoaXMuYWRkU3RhdGljT2JqZWN0ID0gZnVuY3Rpb24gKHNwcml0ZSkge1xuXHRcdFx0c3RhdGljT2JqZWN0cy5wdXNoKHNwcml0ZSk7XG5cdFx0fTtcblxuXHRcdHRoaXMuYWRkU3RhdGljT2JqZWN0cyA9IGZ1bmN0aW9uIChzcHJpdGVzKSB7XG5cdFx0XHRzcHJpdGVzLmZvckVhY2godGhpcy5hZGRTdGF0aWNPYmplY3QuYmluZCh0aGlzKSk7XG5cdFx0fTtcblxuXHRcdHRoaXMuYWRkTW92aW5nT2JqZWN0ID0gZnVuY3Rpb24gKG1vdmluZ09iamVjdCwgbW92aW5nT2JqZWN0VHlwZSkge1xuXHRcdFx0aWYgKG1vdmluZ09iamVjdFR5cGUpIHtcblx0XHRcdFx0c3RhdGljT2JqZWN0cy5vblB1c2goZnVuY3Rpb24gKG9iaikge1xuXHRcdFx0XHRcdGlmIChvYmouZGF0YSAmJiBvYmouZGF0YS5oaXRCZWhhdmlvdXJbbW92aW5nT2JqZWN0VHlwZV0pIHtcblx0XHRcdFx0XHRcdG9iai5vbkhpdHRpbmcobW92aW5nT2JqZWN0LCBvYmouZGF0YS5oaXRCZWhhdmlvdXJbbW92aW5nT2JqZWN0VHlwZV0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSwgdHJ1ZSk7XG5cdFx0XHR9XG5cblx0XHRcdG1vdmluZ09iamVjdHMucHVzaChtb3ZpbmdPYmplY3QpO1xuXHRcdH07XG5cblx0XHR0aGlzLmFkZFVJRWxlbWVudCA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG5cdFx0XHR1aUVsZW1lbnRzLnB1c2goZWxlbWVudCk7XG5cdFx0fTtcblxuXHRcdHRoaXMuYmVmb3JlQ3ljbGUgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcblx0XHRcdGJlZm9yZUN5Y2xlQ2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuXHRcdH07XG5cblx0XHR0aGlzLmFmdGVyQ3ljbGUgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcblx0XHRcdGFmdGVyQ3ljbGVDYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG5cdFx0fTtcblxuXHRcdHRoaXMuc2V0TW91c2VYID0gZnVuY3Rpb24gKHgpIHtcblx0XHRcdG1vdXNlWCA9IHg7XG5cdFx0fTtcblxuXHRcdHRoaXMuc2V0TW91c2VZID0gZnVuY3Rpb24gKHkpIHtcblx0XHRcdG1vdXNlWSA9IHk7XG5cdFx0fTtcblxuXHRcdHBsYXllci5zZXRNYXBQb3NpdGlvbigwLCAwKTtcblx0XHRwbGF5ZXIuc2V0TWFwUG9zaXRpb25UYXJnZXQoMCwgLTEwKTtcblx0XHRkQ29udGV4dC5mb2xsb3dTcHJpdGUocGxheWVyKTtcblxuXHRcdHZhciBpbnRlcnZhbE51bSA9IDA7XG5cblx0XHR0aGlzLmN5Y2xlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0YmVmb3JlQ3ljbGVDYWxsYmFja3MuZWFjaChmdW5jdGlvbihjKSB7XG5cdFx0XHRcdGMoKTtcblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBDbGVhciBjYW52YXNcblx0XHRcdHZhciBtb3VzZU1hcFBvc2l0aW9uID0gZENvbnRleHQuY2FudmFzUG9zaXRpb25Ub01hcFBvc2l0aW9uKFttb3VzZVgsIG1vdXNlWV0pO1xuXG5cdFx0XHRsZXQgY3VycmVudFNpdHVhdGlvbiA9IGFpQnJhaW4uY3ljbGUoc3RhdGljT2JqZWN0cywgbW92aW5nT2JqZWN0cywgcGxheWVyKTtcblxuXHRcdFx0aWYgKCFwbGF5ZXIuaXNKdW1waW5nKSB7XG5cdFx0XHRcdGxldCBhaUNvbW1hbmQgPSBhaUJyYWluLmdldEFJQ29tbWFuZChjdXJyZW50U2l0dWF0aW9uKTtcblx0XHRcdFx0aWYgKGFpQ29tbWFuZCkge1xuXHRcdFx0XHRcdG1vdXNlTWFwUG9zaXRpb24gPSBhaUNvbW1hbmQubW91c2VNYXBQb3NpdGlvbjtcblx0XHRcdFx0fVxuXHRcdFx0XHRwbGF5ZXIuc2V0TWFwUG9zaXRpb25UYXJnZXQobW91c2VNYXBQb3NpdGlvblswXSwgbW91c2VNYXBQb3NpdGlvblsxXSk7XG5cdFx0XHR9XG5cblx0XHRcdGludGVydmFsTnVtKys7XG5cblx0XHRcdHBsYXllci5jeWNsZSgpO1xuXG5cdFx0XHRtb3ZpbmdPYmplY3RzLmVhY2goZnVuY3Rpb24gKG1vdmluZ09iamVjdCwgaSkge1xuXHRcdFx0XHRtb3ZpbmdPYmplY3QuY3ljbGUoZENvbnRleHQpO1xuXHRcdFx0fSk7XG5cdFx0XHRcblx0XHRcdHN0YXRpY09iamVjdHMuY3VsbCgpO1xuXHRcdFx0c3RhdGljT2JqZWN0cy5lYWNoKGZ1bmN0aW9uIChzdGF0aWNPYmplY3QsIGkpIHtcblx0XHRcdFx0aWYgKHN0YXRpY09iamVjdC5jeWNsZSkge1xuXHRcdFx0XHRcdHN0YXRpY09iamVjdC5jeWNsZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0dWlFbGVtZW50cy5lYWNoKGZ1bmN0aW9uICh1aUVsZW1lbnQsIGkpIHtcblx0XHRcdFx0aWYgKHVpRWxlbWVudC5jeWNsZSkge1xuXHRcdFx0XHRcdHVpRWxlbWVudC5jeWNsZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0YWZ0ZXJDeWNsZUNhbGxiYWNrcy5lYWNoKGZ1bmN0aW9uKGMpIHtcblx0XHRcdFx0YygpO1xuXHRcdFx0fSk7XG5cdFx0fTtcblxuXHRcdHRoYXQuZHJhdyA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdC8vIENsZWFyIGNhbnZhc1xuXHRcdFx0bWFpbkNhbnZhcy53aWR0aCA9IG1haW5DYW52YXMud2lkdGg7XG5cblx0XHRcdHBsYXllci5kcmF3KGRDb250ZXh0KTtcblxuXHRcdFx0cGxheWVyLmN5Y2xlKCk7XG5cblx0XHRcdG1vdmluZ09iamVjdHMuZWFjaChmdW5jdGlvbiAobW92aW5nT2JqZWN0LCBpKSB7XG5cdFx0XHRcdG1vdmluZ09iamVjdC5kcmF3KGRDb250ZXh0KTtcblx0XHRcdH0pO1xuXHRcdFx0XG5cdFx0XHRzdGF0aWNPYmplY3RzLmVhY2goZnVuY3Rpb24gKHN0YXRpY09iamVjdCwgaSkge1xuXHRcdFx0XHRpZiAoc3RhdGljT2JqZWN0LmRyYXcpIHtcblx0XHRcdFx0XHRzdGF0aWNPYmplY3QuZHJhdyhkQ29udGV4dCwgJ21haW4nKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdHVpRWxlbWVudHMuZWFjaChmdW5jdGlvbiAodWlFbGVtZW50LCBpKSB7XG5cdFx0XHRcdGlmICh1aUVsZW1lbnQuZHJhdykge1xuXHRcdFx0XHRcdHVpRWxlbWVudC5kcmF3KGRDb250ZXh0LCAnbWFpbicpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9O1xuXG5cdFx0dGhpcy5zdGFydCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdGdhbWVMb29wLnN0YXJ0KCk7XG5cdFx0fTtcblxuXHRcdHRoaXMucGF1c2UgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRwYXVzZWQgPSB0cnVlO1xuXHRcdFx0Z2FtZUxvb3Auc3RvcCgpO1xuXHRcdH07XG5cblx0XHR0aGlzLmlzUGF1c2VkID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHBhdXNlZDtcblx0XHR9O1xuXG5cdFx0dGhpcy5yZXNldCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHBhdXNlZCA9IGZhbHNlO1xuXHRcdFx0c3RhdGljT2JqZWN0cyA9IG5ldyBTcHJpdGVBcnJheSgpO1xuXHRcdFx0bW92aW5nT2JqZWN0cyA9IG5ldyBTcHJpdGVBcnJheSgpO1xuXHRcdFx0bW91c2VYID0gZENvbnRleHQuZ2V0Q2VudHJlT2ZWaWV3cG9ydCgpO1xuXHRcdFx0bW91c2VZID0gMDtcblx0XHRcdHBsYXllci5yZXNldCgpO1xuXHRcdFx0cGxheWVyLnNldE1hcFBvc2l0aW9uKDAsIDAsIDApO1xuXHRcdFx0YWlCcmFpbi5yZXNldCgpO1xuXHRcdFx0dGhpcy5zdGFydCgpO1xuXHRcdH0uYmluZCh0aGlzKTtcblxuXHRcdGdhbWVMb29wLm9uKCcyMCcsIHRoaXMuY3ljbGUpO1xuXHRcdGdhbWVMb29wLm9uKCcyMCcsIHRoaXMuZHJhdyk7XG5cdH1cblxuXHRnbG9iYWwuZ2FtZSA9IEdhbWU7XG59KSggdGhpcyApO1xuXG5cbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykge1xuXHRtb2R1bGUuZXhwb3J0cyA9IHRoaXMuZ2FtZTtcbn0iLCIvLyBDcmVhdGVzIGEgcmFuZG9tIElEIHN0cmluZ1xuKGZ1bmN0aW9uKGdsb2JhbCkge1xuICAgIGZ1bmN0aW9uIGd1aWQgKClcbiAgICB7XG4gICAgICAgIHZhciBTNCA9IGZ1bmN0aW9uICgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKFxuICAgICAgICAgICAgICAgICAgICBNYXRoLnJhbmRvbSgpICogMHgxMDAwMCAvKiA2NTUzNiAqL1xuICAgICAgICAgICAgICAgICkudG9TdHJpbmcoMTYpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgUzQoKSArIFM0KCkgKyBcIi1cIiArXG4gICAgICAgICAgICAgICAgUzQoKSArIFwiLVwiICtcbiAgICAgICAgICAgICAgICBTNCgpICsgXCItXCIgK1xuICAgICAgICAgICAgICAgIFM0KCkgKyBcIi1cIiArXG4gICAgICAgICAgICAgICAgUzQoKSArIFM0KCkgKyBTNCgpXG4gICAgICAgICAgICApO1xuICAgIH1cbiAgICBnbG9iYWwuZ3VpZCA9IGd1aWQ7XG59KSh0aGlzKTtcblxuaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSB0aGlzLmd1aWQ7XG59IiwiZnVuY3Rpb24gSW5mb0JveChkYXRhKSB7XG5cdHZhciB0aGF0ID0gdGhpcztcblxuXHR0aGF0LmxpbmVzID0gZGF0YS5pbml0aWFsTGluZXM7XG5cblx0dGhhdC50b3AgPSBkYXRhLnBvc2l0aW9uLnRvcDtcblx0dGhhdC5yaWdodCA9IGRhdGEucG9zaXRpb24ucmlnaHQ7XG5cdHRoYXQuYm90dG9tID0gZGF0YS5wb3NpdGlvbi5ib3R0b207XG5cdHRoYXQubGVmdCA9IGRhdGEucG9zaXRpb24ubGVmdDtcblxuXHR0aGF0LndpZHRoID0gZGF0YS53aWR0aDtcblx0dGhhdC5oZWlnaHQgPSBkYXRhLmhlaWdodDtcblxuXHR0aGF0LnNldExpbmVzID0gZnVuY3Rpb24gKGxpbmVzKSB7XG5cdFx0dGhhdC5saW5lcyA9IGxpbmVzO1xuXHR9O1xuXG5cdHRoYXQuZHJhdyA9IGZ1bmN0aW9uIChkQ29udGV4dCkge1xuXHRcdGRDb250ZXh0LmZvbnQgPSAnMTFweCBtb25vc3BhY2UnO1xuXHRcdHZhciB5T2Zmc2V0ID0gMDtcblx0XHR0aGF0LmxpbmVzLmVhY2goZnVuY3Rpb24gKGxpbmUpIHtcblx0XHRcdHZhciBmb250U2l6ZSA9ICtkQ29udGV4dC5mb250LnNsaWNlKDAsMik7XG5cdFx0XHR2YXIgdGV4dFdpZHRoID0gZENvbnRleHQubWVhc3VyZVRleHQobGluZSkud2lkdGg7XG5cdFx0XHR2YXIgdGV4dEhlaWdodCA9IGZvbnRTaXplICogMS41O1xuXHRcdFx0dmFyIHhQb3MsIHlQb3M7XG5cdFx0XHRpZiAodGhhdC50b3ApIHtcblx0XHRcdFx0eVBvcyA9IHRoYXQudG9wICsgeU9mZnNldDtcblx0XHRcdH0gZWxzZSBpZiAodGhhdC5ib3R0b20pIHtcblx0XHRcdFx0eVBvcyA9IGRDb250ZXh0LmNhbnZhcy5oZWlnaHQgLSB0aGF0LnRvcCAtIHRleHRIZWlnaHQgKyB5T2Zmc2V0O1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodGhhdC5yaWdodCkge1xuXHRcdFx0XHR4UG9zID0gZENvbnRleHQuY2FudmFzLndpZHRoIC0gdGhhdC5yaWdodCAtIHRleHRXaWR0aDtcblx0XHRcdH0gZWxzZSBpZiAodGhhdC5sZWZ0KSB7XG5cdFx0XHRcdHhQb3MgPSB0aGF0LmxlZnQ7XG5cdFx0XHR9XG5cblx0XHRcdHlPZmZzZXQgKz0gdGV4dEhlaWdodDtcblxuXG5cdFx0XHRkQ29udGV4dC5maWxsVGV4dChsaW5lLCB4UG9zLCB5UG9zKTtcblx0XHR9KTtcblx0fTtcblxuXHRyZXR1cm4gdGhhdDtcbn1cblxuaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSB7XG5cdG1vZHVsZS5leHBvcnRzID0gSW5mb0JveDtcbn1cbiIsImZ1bmN0aW9uIGlzTW9iaWxlRGV2aWNlKCkge1xuXHRpZihuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9BbmRyb2lkL2kpIHx8XG5cdFx0bmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvd2ViT1MvaSkgfHxcblx0XHRuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9pUGhvbmUvaSkgfHxcblx0XHRuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9pUGFkL2kpIHx8XG5cdFx0bmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvaVBvZC9pKSB8fFxuXHRcdG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0JsYWNrQmVycnkvaSkgfHxcblx0XHRuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9XaW5kb3dzIFBob25lL2kpXG5cdCkge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdGVsc2Uge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzTW9iaWxlRGV2aWNlOyIsInZhciBTcHJpdGUgPSByZXF1aXJlKCcuL3Nwcml0ZScpO1xuXG4oZnVuY3Rpb24oZ2xvYmFsKSB7XG5cdGZ1bmN0aW9uIE1vbnN0ZXIoZGF0YSkge1xuXHRcdHZhciB0aGF0ID0gbmV3IFNwcml0ZShkYXRhKTtcblx0XHR2YXIgc3VwZXJfZHJhdyA9IHRoYXQuZHJhdy5iaW5kKHRoYXQpO1xuXHRcdHZhciBzcHJpdGVWZXJzaW9uID0gMTtcblx0XHR2YXIgZWF0aW5nU3RhZ2UgPSAwO1xuXHRcdHZhciBzdGFuZGFyZFNwZWVkID0gNjtcblxuXHRcdHRoYXQuaXNFYXRpbmcgPSBmYWxzZTtcblx0XHR0aGF0LmlzRnVsbCA9IGZhbHNlO1xuXHRcdHRoYXQuc2V0U3BlZWQoc3RhbmRhcmRTcGVlZCk7XG5cblx0XHR0aGF0LmRyYXcgPSBmdW5jdGlvbihkQ29udGV4dCkge1xuXHRcdFx0dmFyIHNwcml0ZVBhcnRUb1VzZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0dmFyIHhEaWZmID0gdGhhdC5tb3ZpbmdUb3dhcmRbMF0gLSB0aGF0LmNhbnZhc1g7XG5cblx0XHRcdFx0aWYgKHRoYXQuaXNFYXRpbmcpIHtcblx0XHRcdFx0XHRyZXR1cm4gJ2VhdGluZycgKyBlYXRpbmdTdGFnZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChzcHJpdGVWZXJzaW9uICsgMC4xID4gMikge1xuXHRcdFx0XHRcdHNwcml0ZVZlcnNpb24gPSAwLjE7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c3ByaXRlVmVyc2lvbiArPSAwLjE7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHhEaWZmID49IDApIHtcblx0XHRcdFx0XHRyZXR1cm4gJ3NFYXN0JyArIE1hdGguY2VpbChzcHJpdGVWZXJzaW9uKTtcblx0XHRcdFx0fSBlbHNlIGlmICh4RGlmZiA8IDApIHtcblx0XHRcdFx0XHRyZXR1cm4gJ3NXZXN0JyArIE1hdGguY2VpbChzcHJpdGVWZXJzaW9uKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0cmV0dXJuIHN1cGVyX2RyYXcoZENvbnRleHQsIHNwcml0ZVBhcnRUb1VzZSgpKTtcblx0XHR9O1xuXG5cdFx0ZnVuY3Rpb24gc3RhcnRFYXRpbmcgKHdoZW5Eb25lKSB7XG5cdFx0XHRlYXRpbmdTdGFnZSArPSAxO1xuXHRcdFx0dGhhdC5pc0VhdGluZyA9IHRydWU7XG5cdFx0XHR0aGF0LmlzTW92aW5nID0gZmFsc2U7XG5cdFx0XHRpZiAoZWF0aW5nU3RhZ2UgPCA2KSB7XG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHN0YXJ0RWF0aW5nKHdoZW5Eb25lKTtcblx0XHRcdFx0fSwgMzAwKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGVhdGluZ1N0YWdlID0gMDtcblx0XHRcdFx0dGhhdC5pc0VhdGluZyA9IGZhbHNlO1xuXHRcdFx0XHR0aGF0LmlzTW92aW5nID0gdHJ1ZTtcblx0XHRcdFx0d2hlbkRvbmUoKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGF0LnN0YXJ0RWF0aW5nID0gc3RhcnRFYXRpbmc7XG5cblx0XHRyZXR1cm4gdGhhdDtcblx0fVxuXG5cdGdsb2JhbC5tb25zdGVyID0gTW9uc3Rlcjtcbn0pKCB0aGlzICk7XG5cblxuaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSB7XG5cdG1vZHVsZS5leHBvcnRzID0gdGhpcy5tb25zdGVyO1xufSIsIi8vIEF2b2lkIGBjb25zb2xlYCBlcnJvcnMgaW4gYnJvd3NlcnMgdGhhdCBsYWNrIGEgY29uc29sZS5cbihmdW5jdGlvbigpIHtcbiAgICB2YXIgbWV0aG9kO1xuICAgIHZhciBub29wID0gZnVuY3Rpb24gbm9vcCgpIHt9O1xuICAgIHZhciBtZXRob2RzID0gW1xuICAgICAgICAnYXNzZXJ0JywgJ2NsZWFyJywgJ2NvdW50JywgJ2RlYnVnJywgJ2RpcicsICdkaXJ4bWwnLCAnZXJyb3InLFxuICAgICAgICAnZXhjZXB0aW9uJywgJ2dyb3VwJywgJ2dyb3VwQ29sbGFwc2VkJywgJ2dyb3VwRW5kJywgJ2luZm8nLCAnbG9nJyxcbiAgICAgICAgJ21hcmtUaW1lbGluZScsICdwcm9maWxlJywgJ3Byb2ZpbGVFbmQnLCAndGFibGUnLCAndGltZScsICd0aW1lRW5kJyxcbiAgICAgICAgJ3RpbWVTdGFtcCcsICd0cmFjZScsICd3YXJuJ1xuICAgIF07XG4gICAgdmFyIGxlbmd0aCA9IG1ldGhvZHMubGVuZ3RoO1xuICAgIHZhciBjb25zb2xlID0gKHdpbmRvdy5jb25zb2xlID0gd2luZG93LmNvbnNvbGUgfHwge30pO1xuXG4gICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICAgIG1ldGhvZCA9IG1ldGhvZHNbbGVuZ3RoXTtcblxuICAgICAgICAvLyBPbmx5IHN0dWIgdW5kZWZpbmVkIG1ldGhvZHMuXG4gICAgICAgIGlmICghY29uc29sZVttZXRob2RdKSB7XG4gICAgICAgICAgICBjb25zb2xlW21ldGhvZF0gPSBub29wO1xuICAgICAgICB9XG4gICAgfVxufSgpKTsiLCJ2YXIgU3ByaXRlID0gcmVxdWlyZSgnLi9zcHJpdGUnKTtcbmlmICh0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJykge1xuXHRuYXZpZ2F0b3IudmlicmF0ZSA9IG5hdmlnYXRvci52aWJyYXRlIHx8XG5cdFx0bmF2aWdhdG9yLndlYmtpdFZpYnJhdGUgfHxcblx0XHRuYXZpZ2F0b3IubW96VmlicmF0ZSB8fFxuXHRcdG5hdmlnYXRvci5tc1ZpYnJhdGU7XG59IGVsc2Uge1xuXHRuYXZpZ2F0b3IgPSB7XG5cdFx0dmlicmF0ZTogZmFsc2Vcblx0fTtcbn1cblxuKGZ1bmN0aW9uKGdsb2JhbCkge1xuXHRmdW5jdGlvbiBTa2llcihkYXRhKSB7XG5cdFx0dmFyIGRpc2NyZXRlRGlyZWN0aW9ucyA9IHtcblx0XHRcdCd3ZXN0JzogMjcwLFxuXHRcdFx0J3dzV2VzdCc6IDI0MCxcblx0XHRcdCdzV2VzdCc6IDE5NSxcblx0XHRcdCdzb3V0aCc6IDE4MCxcblx0XHRcdCdzRWFzdCc6IDE2NSxcblx0XHRcdCdlc0Vhc3QnOiAxMjAsXG5cdFx0XHQnZWFzdCc6IDkwXG5cdFx0fTtcblx0XHR2YXIgdGhhdCA9IG5ldyBTcHJpdGUoZGF0YSk7XG5cdFx0dmFyIHN1cCA9IHtcblx0XHRcdGRyYXc6IHRoYXQuZHJhdy5iaW5kKHRoYXQpLFxuXHRcdFx0Y3ljbGU6IHRoYXQuY3ljbGUuYmluZCh0aGF0KSxcblx0XHRcdGdldFNwZWVkWDogdGhhdC5nZXRTcGVlZFguYmluZCh0aGF0KSxcblx0XHRcdGdldFNwZWVkWTogdGhhdC5nZXRTcGVlZFkuYmluZCh0aGF0KSxcblx0XHRcdGhpdHM6IHRoYXQuaGl0cy5iaW5kKHRoYXQpXG5cdFx0fTtcblx0XHR2YXIgZGlyZWN0aW9ucyA9IHtcblx0XHRcdGVzRWFzdDogZnVuY3Rpb24oeERpZmYpIHsgcmV0dXJuIHhEaWZmID4gMzAwOyB9LFxuXHRcdFx0c0Vhc3Q6IGZ1bmN0aW9uKHhEaWZmKSB7IHJldHVybiB4RGlmZiA+IDc1OyB9LFxuXHRcdFx0d3NXZXN0OiBmdW5jdGlvbih4RGlmZikgeyByZXR1cm4geERpZmYgPCAtMzAwOyB9LFxuXHRcdFx0c1dlc3Q6IGZ1bmN0aW9uKHhEaWZmKSB7IHJldHVybiB4RGlmZiA8IC03NTsgfVxuXHRcdH07XG5cblx0XHR2YXIgY2FuY2VsYWJsZVN0YXRlVGltZW91dDtcblx0XHR2YXIgY2FuY2VsYWJsZVN0YXRlSW50ZXJ2YWw7XG5cblx0XHR2YXIgY2FuU3BlZWRCb29zdCA9IHRydWU7XG5cblx0XHR2YXIgb2JzdGFjbGVzSGl0ID0gW107XG5cdFx0dmFyIHBpeGVsc1RyYXZlbGxlZCA9IDA7XG5cdFx0dmFyIHN0YW5kYXJkU3BlZWQgPSA1O1xuXHRcdHZhciBib29zdE11bHRpcGxpZXIgPSAyO1xuXHRcdHZhciB0dXJuRWFzZUN5Y2xlcyA9IDcwO1xuXHRcdHZhciBzcGVlZFggPSAwO1xuXHRcdHZhciBzcGVlZFhGYWN0b3IgPSAwO1xuXHRcdHZhciBzcGVlZFkgPSAwO1xuXHRcdHZhciBzcGVlZFlGYWN0b3IgPSAxO1xuXHRcdHZhciB0cmlja1N0ZXAgPSAwOyAvLyBUaGVyZSBhcmUgdGhyZWUgb2YgdGhlc2VcblxuXHRcdHRoYXQuaXNNb3ZpbmcgPSB0cnVlO1xuXHRcdHRoYXQuaGFzQmVlbkhpdCA9IGZhbHNlO1xuXHRcdHRoYXQuaXNKdW1waW5nID0gZmFsc2U7XG5cdFx0dGhhdC5pc1BlcmZvcm1pbmdUcmljayA9IGZhbHNlO1xuXHRcdHRoYXQub25IaXRPYnN0YWNsZUNiID0gZnVuY3Rpb24oKSB7fTtcblx0XHR0aGF0LnNldFNwZWVkKHN0YW5kYXJkU3BlZWQpO1xuXG5cdFx0dGhhdC5yZXNldCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdG9ic3RhY2xlc0hpdCA9IFtdO1xuXHRcdFx0cGl4ZWxzVHJhdmVsbGVkID0gMDtcblx0XHRcdHRoYXQuaXNNb3ZpbmcgPSB0cnVlO1xuXHRcdFx0dGhhdC5oYXNCZWVuSGl0ID0gZmFsc2U7XG5cdFx0XHRjYW5TcGVlZEJvb3N0ID0gdHJ1ZTtcblx0XHRcdHNldE5vcm1hbCgpO1xuXHRcdH07XG5cblx0XHRmdW5jdGlvbiBzZXROb3JtYWwoKSB7XG5cdFx0XHR0aGF0LnNldFNwZWVkKHN0YW5kYXJkU3BlZWQpO1xuXHRcdFx0dGhhdC5pc01vdmluZyA9IHRydWU7XG5cdFx0XHR0aGF0Lmhhc0JlZW5IaXQgPSBmYWxzZTtcblx0XHRcdHRoYXQuaXNKdW1waW5nID0gZmFsc2U7XG5cdFx0XHR0aGF0LmlzUGVyZm9ybWluZ1RyaWNrID0gZmFsc2U7XG5cdFx0XHRpZiAoY2FuY2VsYWJsZVN0YXRlSW50ZXJ2YWwpIHtcblx0XHRcdFx0Y2xlYXJJbnRlcnZhbChjYW5jZWxhYmxlU3RhdGVJbnRlcnZhbCk7XG5cdFx0XHR9XG5cdFx0XHR0aGF0LnNldE1hcFBvc2l0aW9uKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCAwKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzZXRDcmFzaGVkKCkge1xuXHRcdFx0dGhhdC5pc01vdmluZyA9IGZhbHNlO1xuXHRcdFx0dGhhdC5oYXNCZWVuSGl0ID0gdHJ1ZTtcblx0XHRcdHRoYXQuaXNKdW1waW5nID0gZmFsc2U7XG5cdFx0XHR0aGF0LmlzUGVyZm9ybWluZ1RyaWNrID0gZmFsc2U7XG5cdFx0XHRpZiAoY2FuY2VsYWJsZVN0YXRlSW50ZXJ2YWwpIHtcblx0XHRcdFx0Y2xlYXJJbnRlcnZhbChjYW5jZWxhYmxlU3RhdGVJbnRlcnZhbCk7XG5cdFx0XHR9XG5cdFx0XHR0aGF0LnNldE1hcFBvc2l0aW9uKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCAwKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzZXRKdW1waW5nKCkge1xuXHRcdFx0dmFyIGN1cnJlbnRTcGVlZCA9IHRoYXQuZ2V0U3BlZWQoKTtcblx0XHRcdHRoYXQuc2V0U3BlZWQoY3VycmVudFNwZWVkICsgMik7XG5cdFx0XHR0aGF0LnNldFNwZWVkWShjdXJyZW50U3BlZWQgKyAyKTtcblx0XHRcdHRoYXQuaXNNb3ZpbmcgPSB0cnVlO1xuXHRcdFx0dGhhdC5oYXNCZWVuSGl0ID0gZmFsc2U7XG5cdFx0XHR0aGF0LmlzSnVtcGluZyA9IHRydWU7XG5cdFx0XHR0aGF0LnNldE1hcFBvc2l0aW9uKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCAxKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBnZXREaXNjcmV0ZURpcmVjdGlvbigpIHtcblx0XHRcdGlmICh0aGF0LmRpcmVjdGlvbikge1xuXHRcdFx0XHRpZiAodGhhdC5kaXJlY3Rpb24gPD0gOTApIHtcblx0XHRcdFx0XHRyZXR1cm4gJ2Vhc3QnO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHRoYXQuZGlyZWN0aW9uID4gOTAgJiYgdGhhdC5kaXJlY3Rpb24gPCAxNTApIHtcblx0XHRcdFx0XHRyZXR1cm4gJ2VzRWFzdCc7XG5cdFx0XHRcdH0gZWxzZSBpZiAodGhhdC5kaXJlY3Rpb24gPj0gMTUwICYmIHRoYXQuZGlyZWN0aW9uIDwgMTgwKSB7XG5cdFx0XHRcdFx0cmV0dXJuICdzRWFzdCc7XG5cdFx0XHRcdH0gZWxzZSBpZiAodGhhdC5kaXJlY3Rpb24gPT09IDE4MCkge1xuXHRcdFx0XHRcdHJldHVybiAnc291dGgnO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHRoYXQuZGlyZWN0aW9uID4gMTgwICYmIHRoYXQuZGlyZWN0aW9uIDw9IDIxMCkge1xuXHRcdFx0XHRcdHJldHVybiAnc1dlc3QnO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHRoYXQuZGlyZWN0aW9uID4gMjEwICYmIHRoYXQuZGlyZWN0aW9uIDwgMjcwKSB7XG5cdFx0XHRcdFx0cmV0dXJuICd3c1dlc3QnO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHRoYXQuZGlyZWN0aW9uID49IDI3MCkge1xuXHRcdFx0XHRcdHJldHVybiAnd2VzdCc7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuICdzb3V0aCc7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZhciB4RGlmZiA9IHRoYXQubW92aW5nVG93YXJkWzBdIC0gdGhhdC5tYXBQb3NpdGlvblswXTtcblx0XHRcdFx0dmFyIHlEaWZmID0gdGhhdC5tb3ZpbmdUb3dhcmRbMV0gLSB0aGF0Lm1hcFBvc2l0aW9uWzFdO1xuXHRcdFx0XHRpZiAoeURpZmYgPD0gMCkge1xuXHRcdFx0XHRcdGlmICh4RGlmZiA+IDApIHtcblx0XHRcdFx0XHRcdHJldHVybiAnZWFzdCc7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHJldHVybiAnd2VzdCc7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGRpcmVjdGlvbnMuZXNFYXN0KHhEaWZmKSkge1xuXHRcdFx0XHRcdHJldHVybiAnZXNFYXN0Jztcblx0XHRcdFx0fSBlbHNlIGlmIChkaXJlY3Rpb25zLnNFYXN0KHhEaWZmKSkge1xuXHRcdFx0XHRcdHJldHVybiAnc0Vhc3QnO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGRpcmVjdGlvbnMud3NXZXN0KHhEaWZmKSkge1xuXHRcdFx0XHRcdHJldHVybiAnd3NXZXN0Jztcblx0XHRcdFx0fSBlbHNlIGlmIChkaXJlY3Rpb25zLnNXZXN0KHhEaWZmKSkge1xuXHRcdFx0XHRcdHJldHVybiAnc1dlc3QnO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gJ3NvdXRoJztcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzZXREaXNjcmV0ZURpcmVjdGlvbihkKSB7XG5cdFx0XHRpZiAoZGlzY3JldGVEaXJlY3Rpb25zW2RdKSB7XG5cdFx0XHRcdHRoYXQuc2V0RGlyZWN0aW9uKGRpc2NyZXRlRGlyZWN0aW9uc1tkXSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChkID09PSAnd2VzdCcgfHwgZCA9PT0gJ2Vhc3QnKSB7XG5cdFx0XHRcdHRoYXQuaXNNb3ZpbmcgPSBmYWxzZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoYXQuaXNNb3ZpbmcgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGdldEJlaW5nRWF0ZW5TcHJpdGUoKSB7XG5cdFx0XHRyZXR1cm4gJ2JsYW5rJztcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBnZXRKdW1waW5nU3ByaXRlKCkge1xuXHRcdFx0cmV0dXJuICdqdW1waW5nJztcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBnZXRUcmlja1Nwcml0ZSgpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdUcmljayBzdGVwIGlzJywgdHJpY2tTdGVwKTtcblx0XHRcdGlmICh0cmlja1N0ZXAgPT09IDApIHtcblx0XHRcdFx0cmV0dXJuICdqdW1waW5nJztcblx0XHRcdH0gZWxzZSBpZiAodHJpY2tTdGVwID09PSAxKSB7XG5cdFx0XHRcdHJldHVybiAnc29tZXJzYXVsdDEnO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuICdzb21lcnNhdWx0Mic7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhhdC5zdG9wID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0aWYgKHRoYXQuZGlyZWN0aW9uID4gMTgwKSB7XG5cdFx0XHRcdHNldERpc2NyZXRlRGlyZWN0aW9uKCd3ZXN0Jyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzZXREaXNjcmV0ZURpcmVjdGlvbignZWFzdCcpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHR0aGF0LnR1cm5FYXN0ID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIGRpc2NyZXRlRGlyZWN0aW9uID0gZ2V0RGlzY3JldGVEaXJlY3Rpb24oKTtcblxuXHRcdFx0c3dpdGNoIChkaXNjcmV0ZURpcmVjdGlvbikge1xuXHRcdFx0XHRjYXNlICd3ZXN0Jzpcblx0XHRcdFx0XHRzZXREaXNjcmV0ZURpcmVjdGlvbignd3NXZXN0Jyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ3dzV2VzdCc6XG5cdFx0XHRcdFx0c2V0RGlzY3JldGVEaXJlY3Rpb24oJ3NXZXN0Jyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ3NXZXN0Jzpcblx0XHRcdFx0XHRzZXREaXNjcmV0ZURpcmVjdGlvbignc291dGgnKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAnc291dGgnOlxuXHRcdFx0XHRcdHNldERpc2NyZXRlRGlyZWN0aW9uKCdzRWFzdCcpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdzRWFzdCc6XG5cdFx0XHRcdFx0c2V0RGlzY3JldGVEaXJlY3Rpb24oJ2VzRWFzdCcpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdlc0Vhc3QnOlxuXHRcdFx0XHRcdHNldERpc2NyZXRlRGlyZWN0aW9uKCdlYXN0Jyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0c2V0RGlzY3JldGVEaXJlY3Rpb24oJ3NvdXRoJyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHRoYXQudHVybldlc3QgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgZGlzY3JldGVEaXJlY3Rpb24gPSBnZXREaXNjcmV0ZURpcmVjdGlvbigpO1xuXG5cdFx0XHRzd2l0Y2ggKGRpc2NyZXRlRGlyZWN0aW9uKSB7XG5cdFx0XHRcdGNhc2UgJ2Vhc3QnOlxuXHRcdFx0XHRcdHNldERpc2NyZXRlRGlyZWN0aW9uKCdlc0Vhc3QnKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAnZXNFYXN0Jzpcblx0XHRcdFx0XHRzZXREaXNjcmV0ZURpcmVjdGlvbignc0Vhc3QnKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAnc0Vhc3QnOlxuXHRcdFx0XHRcdHNldERpc2NyZXRlRGlyZWN0aW9uKCdzb3V0aCcpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdzb3V0aCc6XG5cdFx0XHRcdFx0c2V0RGlzY3JldGVEaXJlY3Rpb24oJ3NXZXN0Jyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ3NXZXN0Jzpcblx0XHRcdFx0XHRzZXREaXNjcmV0ZURpcmVjdGlvbignd3NXZXN0Jyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ3dzV2VzdCc6XG5cdFx0XHRcdFx0c2V0RGlzY3JldGVEaXJlY3Rpb24oJ3dlc3QnKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRzZXREaXNjcmV0ZURpcmVjdGlvbignc291dGgnKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0dGhhdC5zdGVwV2VzdCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHRoYXQubWFwUG9zaXRpb25bMF0gLT0gdGhhdC5zcGVlZCAqIDI7XG5cdFx0fTtcblxuXHRcdHRoYXQuc3RlcEVhc3QgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHR0aGF0Lm1hcFBvc2l0aW9uWzBdICs9IHRoYXQuc3BlZWQgKiAyO1xuXHRcdH07XG5cblx0XHR0aGF0LnNldE1hcFBvc2l0aW9uVGFyZ2V0ID0gZnVuY3Rpb24gKHgsIHkpIHtcblx0XHRcdGlmICh0aGF0Lmhhc0JlZW5IaXQpIHJldHVybjtcblxuXHRcdFx0aWYgKE1hdGguYWJzKHRoYXQubWFwUG9zaXRpb25bMF0gLSB4KSA8PSA3NSkge1xuXHRcdFx0XHR4ID0gdGhhdC5tYXBQb3NpdGlvblswXTtcblx0XHRcdH1cblxuXHRcdFx0dGhhdC5tb3ZpbmdUb3dhcmQgPSBbIHgsIHkgXTtcblxuXHRcdFx0Ly8gdGhhdC5yZXNldERpcmVjdGlvbigpO1xuXHRcdH07XG5cblx0XHR0aGF0LnN0YXJ0TW92aW5nSWZQb3NzaWJsZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmICghdGhhdC5oYXNCZWVuSGl0ICYmICF0aGF0LmlzQmVpbmdFYXRlbikge1xuXHRcdFx0XHR0aGF0LmlzTW92aW5nID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0dGhhdC5zZXRUdXJuRWFzZUN5Y2xlcyA9IGZ1bmN0aW9uIChjKSB7XG5cdFx0XHR0dXJuRWFzZUN5Y2xlcyA9IGM7XG5cdFx0fTtcblxuXHRcdHRoYXQuZ2V0UGl4ZWxzVHJhdmVsbGVkRG93bk1vdW50YWluID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHBpeGVsc1RyYXZlbGxlZDtcblx0XHR9O1xuXG5cdFx0dGhhdC5yZXNldFNwZWVkID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0dGhhdC5zZXRTcGVlZChzdGFuZGFyZFNwZWVkKTtcblx0XHR9O1xuXG5cdFx0dGhhdC5jeWNsZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmICggdGhhdC5nZXRTcGVlZFgoKSA8PSAwICYmIHRoYXQuZ2V0U3BlZWRZKCkgPD0gMCApIHtcblx0XHRcdFx0XHRcdHRoYXQuaXNNb3ZpbmcgPSBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGlmICh0aGF0LmlzTW92aW5nKSB7XG5cdFx0XHRcdHBpeGVsc1RyYXZlbGxlZCArPSB0aGF0LnNwZWVkO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodGhhdC5pc0p1bXBpbmcpIHtcblx0XHRcdFx0dGhhdC5zZXRNYXBQb3NpdGlvblRhcmdldCh1bmRlZmluZWQsIHRoYXQubWFwUG9zaXRpb25bMV0gKyB0aGF0LmdldFNwZWVkKCkpO1xuXHRcdFx0fVxuXG5cdFx0XHRzdXAuY3ljbGUoKTtcblx0XHRcdFxuXHRcdFx0dGhhdC5jaGVja0hpdHRhYmxlT2JqZWN0cygpO1xuXHRcdH07XG5cblx0XHR0aGF0LmRyYXcgPSBmdW5jdGlvbihkQ29udGV4dCkge1xuXHRcdFx0dmFyIHNwcml0ZVBhcnRUb1VzZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0aWYgKHRoYXQuaXNCZWluZ0VhdGVuKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGdldEJlaW5nRWF0ZW5TcHJpdGUoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICh0aGF0LmlzSnVtcGluZykge1xuXHRcdFx0XHRcdGlmICh0aGF0LmlzUGVyZm9ybWluZ1RyaWNrKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZ2V0VHJpY2tTcHJpdGUoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIGdldEp1bXBpbmdTcHJpdGUoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICh0aGF0Lmhhc0JlZW5IaXQpIHtcblx0XHRcdFx0XHRyZXR1cm4gJ2hpdCc7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gZ2V0RGlzY3JldGVEaXJlY3Rpb24oKTtcblx0XHRcdH07XG5cblx0XHRcdHJldHVybiBzdXAuZHJhdyhkQ29udGV4dCwgc3ByaXRlUGFydFRvVXNlKCkpO1xuXHRcdH07XG5cblx0XHR0aGF0LmhpdHMgPSBmdW5jdGlvbiAob2JzKSB7XG5cdFx0XHRpZiAob2JzdGFjbGVzSGl0LmluZGV4T2Yob2JzLmlkKSAhPT0gLTEpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIW9icy5vY2N1cGllc1pJbmRleCh0aGF0Lm1hcFBvc2l0aW9uWzJdKSkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChzdXAuaGl0cyhvYnMpKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fTtcblxuXHRcdHRoYXQuc3BlZWRCb29zdCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciBvcmlnaW5hbFNwZWVkID0gdGhhdC5zcGVlZDtcblx0XHRcdGlmIChjYW5TcGVlZEJvb3N0KSB7XG5cdFx0XHRcdGNhblNwZWVkQm9vc3QgPSBmYWxzZTtcblx0XHRcdFx0dGhhdC5zZXRTcGVlZCh0aGF0LnNwZWVkICogYm9vc3RNdWx0aXBsaWVyKTtcblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0dGhhdC5zZXRTcGVlZChvcmlnaW5hbFNwZWVkKTtcblx0XHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdGNhblNwZWVkQm9vc3QgPSB0cnVlO1xuXHRcdFx0XHRcdH0sIDEwMDAwKTtcblx0XHRcdFx0fSwgMjAwMCk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHRoYXQuYXR0ZW1wdFRyaWNrID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0aWYgKHRoYXQuaXNKdW1waW5nKSB7XG5cdFx0XHRcdHRoYXQuaXNQZXJmb3JtaW5nVHJpY2sgPSB0cnVlO1xuXHRcdFx0XHRjYW5jZWxhYmxlU3RhdGVJbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRpZiAodHJpY2tTdGVwID49IDIpIHtcblx0XHRcdFx0XHRcdHRyaWNrU3RlcCA9IDA7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRyaWNrU3RlcCArPSAxO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSwgMzAwKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0dGhhdC5nZXRTdGFuZGFyZFNwZWVkID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHN0YW5kYXJkU3BlZWQ7XG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIGVhc2VTcGVlZFRvVGFyZ2V0VXNpbmdGYWN0b3Ioc3AsIHRhcmdldFNwZWVkLCBmKSB7XG5cdFx0XHRpZiAoZiA9PT0gMCB8fCBmID09PSAxKSB7XG5cdFx0XHRcdHJldHVybiB0YXJnZXRTcGVlZDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHNwIDwgdGFyZ2V0U3BlZWQpIHtcblx0XHRcdFx0c3AgKz0gdGhhdC5nZXRTcGVlZCgpICogKGYgLyB0dXJuRWFzZUN5Y2xlcyk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChzcCA+IHRhcmdldFNwZWVkKSB7XG5cdFx0XHRcdHNwIC09IHRoYXQuZ2V0U3BlZWQoKSAqIChmIC8gdHVybkVhc2VDeWNsZXMpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gc3A7XG5cdFx0fVxuXG5cdFx0dGhhdC5nZXRTcGVlZFggPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAoZ2V0RGlzY3JldGVEaXJlY3Rpb24oKSA9PT0gJ2VzRWFzdCcgfHwgZ2V0RGlzY3JldGVEaXJlY3Rpb24oKSA9PT0gJ3dzV2VzdCcpIHtcblx0XHRcdFx0c3BlZWRYRmFjdG9yID0gMC41O1xuXHRcdFx0XHRzcGVlZFggPSBlYXNlU3BlZWRUb1RhcmdldFVzaW5nRmFjdG9yKHNwZWVkWCwgdGhhdC5nZXRTcGVlZCgpICogc3BlZWRYRmFjdG9yLCBzcGVlZFhGYWN0b3IpO1xuXG5cdFx0XHRcdHJldHVybiBzcGVlZFg7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChnZXREaXNjcmV0ZURpcmVjdGlvbigpID09PSAnc0Vhc3QnIHx8IGdldERpc2NyZXRlRGlyZWN0aW9uKCkgPT09ICdzV2VzdCcpIHtcblx0XHRcdFx0c3BlZWRYRmFjdG9yID0gMC4zMztcblx0XHRcdFx0c3BlZWRYID0gZWFzZVNwZWVkVG9UYXJnZXRVc2luZ0ZhY3RvcihzcGVlZFgsIHRoYXQuZ2V0U3BlZWQoKSAqIHNwZWVkWEZhY3Rvciwgc3BlZWRYRmFjdG9yKTtcblxuXHRcdFx0XHRyZXR1cm4gc3BlZWRYO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBTbyBpdCBtdXN0IGJlIHNvdXRoXG5cblx0XHRcdHNwZWVkWCA9IGVhc2VTcGVlZFRvVGFyZ2V0VXNpbmdGYWN0b3Ioc3BlZWRYLCAwLCBzcGVlZFhGYWN0b3IpO1xuXG5cdFx0XHRyZXR1cm4gc3BlZWRYO1xuXHRcdH07XG5cblx0XHR0aGF0LnNldFNwZWVkWSA9IGZ1bmN0aW9uKHN5KSB7XG5cdFx0XHRzcGVlZFkgPSBzeTtcblx0XHR9O1xuXG5cdFx0dGhhdC5nZXRTcGVlZFkgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgdGFyZ2V0U3BlZWQ7XG5cblx0XHRcdGlmICh0aGF0LmlzSnVtcGluZykge1xuXHRcdFx0XHRyZXR1cm4gc3BlZWRZO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoZ2V0RGlzY3JldGVEaXJlY3Rpb24oKSA9PT0gJ2VzRWFzdCcgfHwgZ2V0RGlzY3JldGVEaXJlY3Rpb24oKSA9PT0gJ3dzV2VzdCcpIHtcblx0XHRcdFx0c3BlZWRZRmFjdG9yID0gMC42O1xuXHRcdFx0XHRzcGVlZFkgPSBlYXNlU3BlZWRUb1RhcmdldFVzaW5nRmFjdG9yKHNwZWVkWSwgdGhhdC5nZXRTcGVlZCgpICogMC42LCAwLjYpO1xuXG5cdFx0XHRcdHJldHVybiBzcGVlZFk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChnZXREaXNjcmV0ZURpcmVjdGlvbigpID09PSAnc0Vhc3QnIHx8IGdldERpc2NyZXRlRGlyZWN0aW9uKCkgPT09ICdzV2VzdCcpIHtcblx0XHRcdFx0c3BlZWRZRmFjdG9yID0gMC44NTtcblx0XHRcdFx0c3BlZWRZID0gZWFzZVNwZWVkVG9UYXJnZXRVc2luZ0ZhY3RvcihzcGVlZFksIHRoYXQuZ2V0U3BlZWQoKSAqIDAuODUsIDAuODUpO1xuXG5cdFx0XHRcdHJldHVybiBzcGVlZFk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChnZXREaXNjcmV0ZURpcmVjdGlvbigpID09PSAnZWFzdCcgfHwgZ2V0RGlzY3JldGVEaXJlY3Rpb24oKSA9PT0gJ3dlc3QnKSB7XG5cdFx0XHRcdHNwZWVkWUZhY3RvciA9IDE7XG5cdFx0XHRcdHNwZWVkWSA9IDA7XG5cblx0XHRcdFx0cmV0dXJuIHNwZWVkWTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gU28gaXQgbXVzdCBiZSBzb3V0aFxuXG5cdFx0XHRzcGVlZFkgPSBlYXNlU3BlZWRUb1RhcmdldFVzaW5nRmFjdG9yKHNwZWVkWSwgdGhhdC5nZXRTcGVlZCgpLCBzcGVlZFlGYWN0b3IpO1xuXG5cdFx0XHRyZXR1cm4gc3BlZWRZO1xuXHRcdH07XG5cblx0XHR0aGF0Lmhhc0hpdE9ic3RhY2xlID0gZnVuY3Rpb24gKG9icykge1xuXHRcdFx0c2V0Q3Jhc2hlZCgpO1xuXG5cdFx0XHRpZiAobmF2aWdhdG9yLnZpYnJhdGUpIHtcblx0XHRcdFx0bmF2aWdhdG9yLnZpYnJhdGUoNTAwKTtcblx0XHRcdH1cblxuXHRcdFx0b2JzdGFjbGVzSGl0LnB1c2gob2JzLmlkKTtcblxuXHRcdFx0dGhhdC5yZXNldFNwZWVkKCk7XG5cdFx0XHR0aGF0Lm9uSGl0T2JzdGFjbGVDYihvYnMpO1xuXG5cdFx0XHRpZiAoY2FuY2VsYWJsZVN0YXRlVGltZW91dCkge1xuXHRcdFx0XHRjbGVhclRpbWVvdXQoY2FuY2VsYWJsZVN0YXRlVGltZW91dCk7XG5cdFx0XHR9XG5cdFx0XHRjYW5jZWxhYmxlU3RhdGVUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0c2V0Tm9ybWFsKCk7XG5cdFx0XHR9LCAxNTAwKTtcblx0XHR9O1xuXG5cdFx0dGhhdC5oYXNIaXRKdW1wID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0c2V0SnVtcGluZygpO1xuXG5cdFx0XHRpZiAoY2FuY2VsYWJsZVN0YXRlVGltZW91dCkge1xuXHRcdFx0XHRjbGVhclRpbWVvdXQoY2FuY2VsYWJsZVN0YXRlVGltZW91dCk7XG5cdFx0XHR9XG5cdFx0XHRjYW5jZWxhYmxlU3RhdGVUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0c2V0Tm9ybWFsKCk7XG5cdFx0XHR9LCAxMDAwKTtcblx0XHR9O1xuXG5cdFx0dGhhdC5pc0VhdGVuQnkgPSBmdW5jdGlvbiAobW9uc3Rlciwgd2hlbkVhdGVuKSB7XG5cdFx0XHR0aGF0Lmhhc0hpdE9ic3RhY2xlKG1vbnN0ZXIpO1xuXHRcdFx0bW9uc3Rlci5zdGFydEVhdGluZyh3aGVuRWF0ZW4pO1xuXHRcdFx0b2JzdGFjbGVzSGl0LnB1c2gobW9uc3Rlci5pZCk7XG5cdFx0XHR0aGF0LmlzTW92aW5nID0gZmFsc2U7XG5cdFx0XHR0aGF0LmlzQmVpbmdFYXRlbiA9IHRydWU7XG5cdFx0fTtcblxuXHRcdHRoYXQucmVzZXQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRvYnN0YWNsZXNIaXQgPSBbXTtcblx0XHRcdHBpeGVsc1RyYXZlbGxlZCA9IDA7XG5cdFx0XHR0aGF0LmlzTW92aW5nID0gdHJ1ZTtcblx0XHRcdHRoYXQuaXNKdW1waW5nID0gZmFsc2U7XG5cdFx0XHR0aGF0Lmhhc0JlZW5IaXQgPSBmYWxzZTtcblx0XHRcdGNhblNwZWVkQm9vc3QgPSB0cnVlO1xuXHRcdH07XG5cblx0XHR0aGF0LnNldEhpdE9ic3RhY2xlQ2IgPSBmdW5jdGlvbiAoZm4pIHtcblx0XHRcdHRoYXQub25IaXRPYnN0YWNsZUNiID0gZm4gfHwgZnVuY3Rpb24oKSB7fTtcblx0XHR9O1xuXHRcdHJldHVybiB0aGF0O1xuXHR9XG5cblx0Z2xvYmFsLnNraWVyID0gU2tpZXI7XG59KSh0aGlzKTtcblxuaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSB7XG5cdG1vZHVsZS5leHBvcnRzID0gdGhpcy5za2llcjtcbn1cbiIsInZhciBTcHJpdGUgPSByZXF1aXJlKCcuL3Nwcml0ZScpO1xuXG4oZnVuY3Rpb24oZ2xvYmFsKSB7XG5cdGZ1bmN0aW9uIFNub3dib2FyZGVyKGRhdGEpIHtcblx0XHR2YXIgdGhhdCA9IG5ldyBTcHJpdGUoZGF0YSk7XG5cdFx0dmFyIHN1cCA9IHtcblx0XHRcdGRyYXc6IHRoYXQuZHJhdy5iaW5kKHRoYXQpLFxuXHRcdFx0Y3ljbGU6IHRoYXQuY3ljbGUuYmluZCh0aGF0KVxuXHRcdH07XG5cdFx0dmFyIGRpcmVjdGlvbnMgPSB7XG5cdFx0XHRzRWFzdDogZnVuY3Rpb24oeERpZmYpIHsgcmV0dXJuIHhEaWZmID4gMDsgfSxcblx0XHRcdHNXZXN0OiBmdW5jdGlvbih4RGlmZikgeyByZXR1cm4geERpZmYgPD0gMDsgfVxuXHRcdH07XG5cdFx0dmFyIHN0YW5kYXJkU3BlZWQgPSAzO1xuXG5cdFx0dGhhdC5zZXRTcGVlZChzdGFuZGFyZFNwZWVkKTtcblxuXHRcdGZ1bmN0aW9uIGdldERpcmVjdGlvbigpIHtcblx0XHRcdHZhciB4RGlmZiA9IHRoYXQubW92aW5nVG93YXJkWzBdIC0gdGhhdC5tYXBQb3NpdGlvblswXTtcblx0XHRcdHZhciB5RGlmZiA9IHRoYXQubW92aW5nVG93YXJkWzFdIC0gdGhhdC5tYXBQb3NpdGlvblsxXTtcblxuXHRcdFx0aWYgKGRpcmVjdGlvbnMuc0Vhc3QoeERpZmYpKSB7XG5cdFx0XHRcdHJldHVybiAnc0Vhc3QnO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuICdzV2VzdCc7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhhdC5jeWNsZSA9IGZ1bmN0aW9uIChkQ29udGV4dCkge1xuXHRcdFx0aWYgKE51bWJlci5yYW5kb20oMTApID09PSAxKSB7XG5cdFx0XHRcdHRoYXQuc2V0TWFwUG9zaXRpb25UYXJnZXQoZENvbnRleHQuZ2V0UmFuZG9tbHlJblRoZUNlbnRyZU9mTWFwKCkpO1xuXHRcdFx0XHR0aGF0LnNldFNwZWVkKHN0YW5kYXJkU3BlZWQgKyBOdW1iZXIucmFuZG9tKC0xLCAxKSk7XG5cdFx0XHR9XG5cblx0XHRcdHRoYXQuc2V0TWFwUG9zaXRpb25UYXJnZXQodW5kZWZpbmVkLCBkQ29udGV4dC5nZXRNYXBCZWxvd1ZpZXdwb3J0KCkgKyA2MDApO1xuXG5cdFx0XHRzdXAuY3ljbGUoKTtcblx0XHR9O1xuXG5cdFx0dGhhdC5kcmF3ID0gZnVuY3Rpb24oZENvbnRleHQpIHtcblx0XHRcdHZhciBzcHJpdGVQYXJ0VG9Vc2UgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHJldHVybiBnZXREaXJlY3Rpb24oKTtcblx0XHRcdH07XG5cblx0XHRcdHJldHVybiBzdXAuZHJhdyhkQ29udGV4dCwgc3ByaXRlUGFydFRvVXNlKCkpO1xuXHRcdH07XG5cblx0XHRyZXR1cm4gdGhhdDtcblx0fVxuXG5cdGdsb2JhbC5zbm93Ym9hcmRlciA9IFNub3dib2FyZGVyO1xufSkoIHRoaXMgKTtcblxuXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0bW9kdWxlLmV4cG9ydHMgPSB0aGlzLnNub3dib2FyZGVyO1xufSIsIihmdW5jdGlvbiAoZ2xvYmFsKSB7XG5cdHZhciBHVUlEID0gcmVxdWlyZSgnLi9ndWlkJyk7XG5cdGZ1bmN0aW9uIFNwcml0ZSAoZGF0YSkge1xuXHRcdHZhciBoaXR0YWJsZU9iamVjdHMgPSB7fTtcblx0XHR2YXIgekluZGV4ZXNPY2N1cGllZCA9IFsgMCBdO1xuXHRcdHZhciB0aGF0ID0gdGhpcztcblx0XHR2YXIgdHJhY2tlZFNwcml0ZVRvTW92ZVRvd2FyZDtcblx0XHR0aGF0LmRpcmVjdGlvbiA9IHVuZGVmaW5lZDtcblx0XHR0aGF0Lm1hcFBvc2l0aW9uID0gWzAsIDAsIDBdO1xuXHRcdHRoYXQuaWQgPSBHVUlEKCk7XG5cdFx0dGhhdC5jYW52YXNYID0gMDtcblx0XHR0aGF0LmNhbnZhc1kgPSAwO1xuXHRcdHRoYXQuY2FudmFzWiA9IDA7XG5cdFx0dGhhdC5oZWlnaHQgPSAwO1xuXHRcdHRoYXQuc3BlZWQgPSAwO1xuXHRcdHRoYXQuZGF0YSA9IGRhdGEgfHwgeyBwYXJ0cyA6IHt9IH07XG5cdFx0dGhhdC5tb3ZpbmdUb3dhcmQgPSBbIDAsIDAgXTtcblx0XHR0aGF0Lm1ldHJlc0Rvd25UaGVNb3VudGFpbiA9IDA7XG5cdFx0dGhhdC5tb3ZpbmdXaXRoQ29udmljdGlvbiA9IGZhbHNlO1xuXHRcdHRoYXQuZGVsZXRlZCA9IGZhbHNlO1xuXHRcdHRoYXQubWF4SGVpZ2h0ID0gKGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBPYmplY3QudmFsdWVzKHRoYXQuZGF0YS5wYXJ0cykubWFwKGZ1bmN0aW9uIChwKSB7IHJldHVybiBwWzNdOyB9KS5tYXgoKTtcblx0XHR9KCkpO1xuXHRcdHRoYXQuaXNNb3ZpbmcgPSB0cnVlO1xuXG5cdFx0aWYgKCF0aGF0LmRhdGEucGFydHMpIHtcblx0XHRcdHRoYXQuZGF0YS5wYXJ0cyA9IHt9O1xuXHRcdH1cblxuXHRcdGlmIChkYXRhICYmIGRhdGEuaWQpe1xuXHRcdFx0dGhhdC5pZCA9IGRhdGEuaWQ7XG5cdFx0fVxuXG5cdFx0aWYgKGRhdGEgJiYgZGF0YS56SW5kZXhlc09jY3VwaWVkKSB7XG5cdFx0XHR6SW5kZXhlc09jY3VwaWVkID0gZGF0YS56SW5kZXhlc09jY3VwaWVkO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGluY3JlbWVudFgoYW1vdW50KSB7XG5cdFx0XHR0aGF0LmNhbnZhc1ggKz0gYW1vdW50LnRvTnVtYmVyKCk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gaW5jcmVtZW50WShhbW91bnQpIHtcblx0XHRcdHRoYXQuY2FudmFzWSArPSBhbW91bnQudG9OdW1iZXIoKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBnZXRIaXRCb3goZm9yWkluZGV4KSB7XG5cdFx0XHRpZiAodGhhdC5kYXRhLmhpdEJveGVzKSB7XG5cdFx0XHRcdGlmIChkYXRhLmhpdEJveGVzW2ZvclpJbmRleF0pIHtcblx0XHRcdFx0XHRyZXR1cm4gZGF0YS5oaXRCb3hlc1tmb3JaSW5kZXhdO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gcm91bmRIYWxmKG51bSkge1xuXHRcdFx0bnVtID0gTWF0aC5yb3VuZChudW0qMikvMjtcblx0XHRcdHJldHVybiBudW07XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gbW92ZSgpIHtcblx0XHRcdGlmICghdGhhdC5pc01vdmluZykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHZhciBjdXJyZW50WCA9IHRoYXQubWFwUG9zaXRpb25bMF07XG5cdFx0XHR2YXIgY3VycmVudFkgPSB0aGF0Lm1hcFBvc2l0aW9uWzFdO1xuXG5cdFx0XHRpZiAodHlwZW9mIHRoYXQuZGlyZWN0aW9uICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHQvLyBGb3IgdGhpcyB3ZSBuZWVkIHRvIG1vZGlmeSB0aGUgdGhhdC5kaXJlY3Rpb24gc28gaXQgcmVsYXRlcyB0byB0aGUgaG9yaXpvbnRhbFxuXHRcdFx0XHR2YXIgZCA9IHRoYXQuZGlyZWN0aW9uIC0gOTA7XG5cdFx0XHRcdGlmIChkIDwgMCkgZCA9IDM2MCArIGQ7XG5cdFx0XHRcdGN1cnJlbnRYICs9IHJvdW5kSGFsZih0aGF0LnNwZWVkICogTWF0aC5jb3MoZCAqIChNYXRoLlBJIC8gMTgwKSkpO1xuXHRcdFx0XHRjdXJyZW50WSArPSByb3VuZEhhbGYodGhhdC5zcGVlZCAqIE1hdGguc2luKGQgKiAoTWF0aC5QSSAvIDE4MCkpKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmICh0eXBlb2YgdGhhdC5tb3ZpbmdUb3dhcmRbMF0gIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdFx0aWYgKGN1cnJlbnRYID4gdGhhdC5tb3ZpbmdUb3dhcmRbMF0pIHtcblx0XHRcdFx0XHRcdGN1cnJlbnRYIC09IE1hdGgubWluKHRoYXQuZ2V0U3BlZWRYKCksIE1hdGguYWJzKGN1cnJlbnRYIC0gdGhhdC5tb3ZpbmdUb3dhcmRbMF0pKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGN1cnJlbnRYIDwgdGhhdC5tb3ZpbmdUb3dhcmRbMF0pIHtcblx0XHRcdFx0XHRcdGN1cnJlbnRYICs9IE1hdGgubWluKHRoYXQuZ2V0U3BlZWRYKCksIE1hdGguYWJzKGN1cnJlbnRYIC0gdGhhdC5tb3ZpbmdUb3dhcmRbMF0pKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHRcdGlmICh0eXBlb2YgdGhhdC5tb3ZpbmdUb3dhcmRbMV0gIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdFx0aWYgKGN1cnJlbnRZID4gdGhhdC5tb3ZpbmdUb3dhcmRbMV0pIHtcblx0XHRcdFx0XHRcdGN1cnJlbnRZIC09IE1hdGgubWluKHRoYXQuZ2V0U3BlZWRZKCksIE1hdGguYWJzKGN1cnJlbnRZIC0gdGhhdC5tb3ZpbmdUb3dhcmRbMV0pKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGN1cnJlbnRZIDwgdGhhdC5tb3ZpbmdUb3dhcmRbMV0pIHtcblx0XHRcdFx0XHRcdGN1cnJlbnRZICs9IE1hdGgubWluKHRoYXQuZ2V0U3BlZWRZKCksIE1hdGguYWJzKGN1cnJlbnRZIC0gdGhhdC5tb3ZpbmdUb3dhcmRbMV0pKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0dGhhdC5zZXRNYXBQb3NpdGlvbihjdXJyZW50WCwgY3VycmVudFkpO1xuXHRcdH1cblxuXHRcdHRoaXMuZHJhdyA9IGZ1bmN0aW9uIChkQ3R4LCBzcHJpdGVGcmFtZSkge1xuXHRcdFx0dmFyIGZyID0gdGhhdC5kYXRhLnBhcnRzW3Nwcml0ZUZyYW1lXTtcblx0XHRcdHRoYXQuaGVpZ2h0ID0gZnJbM107XG5cdFx0XHR0aGF0LndpZHRoID0gZnJbMl07XG5cblx0XHRcdHZhciBuZXdDYW52YXNQb3NpdGlvbiA9IGRDdHgubWFwUG9zaXRpb25Ub0NhbnZhc1Bvc2l0aW9uKHRoYXQubWFwUG9zaXRpb24pO1xuXHRcdFx0dGhhdC5zZXRDYW52YXNQb3NpdGlvbihuZXdDYW52YXNQb3NpdGlvblswXSwgbmV3Q2FudmFzUG9zaXRpb25bMV0pO1xuXG5cdFx0XHRkQ3R4LmRyYXdJbWFnZShkQ3R4LmdldExvYWRlZEltYWdlKHRoYXQuZGF0YS4kaW1hZ2VGaWxlKSwgZnJbMF0sIGZyWzFdLCBmclsyXSwgZnJbM10sIHRoYXQuY2FudmFzWCwgdGhhdC5jYW52YXNZLCBmclsyXSwgZnJbM10pO1xuXHRcdH07XG5cblx0XHR0aGlzLnNldE1hcFBvc2l0aW9uID0gZnVuY3Rpb24gKHgsIHksIHopIHtcblx0XHRcdGlmICh0eXBlb2YgeCA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0eCA9IHRoYXQubWFwUG9zaXRpb25bMF07XG5cdFx0XHR9XG5cdFx0XHRpZiAodHlwZW9mIHkgPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdHkgPSB0aGF0Lm1hcFBvc2l0aW9uWzFdO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHR5cGVvZiB6ID09PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHR6ID0gdGhhdC5tYXBQb3NpdGlvblsyXTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoYXQuekluZGV4ZXNPY2N1cGllZCA9IFsgeiBdO1xuXHRcdFx0fVxuXHRcdFx0dGhhdC5tYXBQb3NpdGlvbiA9IFt4LCB5LCB6XTtcblx0XHR9O1xuXG5cdFx0dGhpcy5zZXRDYW52YXNQb3NpdGlvbiA9IGZ1bmN0aW9uIChjeCwgY3kpIHtcblx0XHRcdGlmIChjeCkge1xuXHRcdFx0XHRpZiAoT2JqZWN0LmlzU3RyaW5nKGN4KSAmJiAoY3guZmlyc3QoKSA9PT0gJysnIHx8IGN4LmZpcnN0KCkgPT09ICctJykpIGluY3JlbWVudFgoY3gpO1xuXHRcdFx0XHRlbHNlIHRoYXQuY2FudmFzWCA9IGN4O1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRpZiAoY3kpIHtcblx0XHRcdFx0aWYgKE9iamVjdC5pc1N0cmluZyhjeSkgJiYgKGN5LmZpcnN0KCkgPT09ICcrJyB8fCBjeS5maXJzdCgpID09PSAnLScpKSBpbmNyZW1lbnRZKGN5KTtcblx0XHRcdFx0ZWxzZSB0aGF0LmNhbnZhc1kgPSBjeTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0dGhpcy5nZXRDYW52YXNQb3NpdGlvblggPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gdGhhdC5jYW52YXNYO1xuXHRcdH07XG5cblx0XHR0aGlzLmdldENhbnZhc1Bvc2l0aW9uWSA9IGZ1bmN0aW9uICAoKSB7XG5cdFx0XHRyZXR1cm4gdGhhdC5jYW52YXNZO1xuXHRcdH07XG5cblx0XHR0aGlzLmdldExlZnRIaXRCb3hFZGdlID0gZnVuY3Rpb24gKHpJbmRleCkge1xuXHRcdFx0ekluZGV4ID0gekluZGV4IHx8IDA7XG5cdFx0XHR2YXIgbGhiZSA9IHRoaXMuZ2V0Q2FudmFzUG9zaXRpb25YKCk7XG5cdFx0XHRpZiAoZ2V0SGl0Qm94KHpJbmRleCkpIHtcblx0XHRcdFx0bGhiZSArPSBnZXRIaXRCb3goekluZGV4KVswXTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBsaGJlO1xuXHRcdH07XG5cblx0XHR0aGlzLmdldFRvcEhpdEJveEVkZ2UgPSBmdW5jdGlvbiAoekluZGV4KSB7XG5cdFx0XHR6SW5kZXggPSB6SW5kZXggfHwgMDtcblx0XHRcdHZhciB0aGJlID0gdGhpcy5nZXRDYW52YXNQb3NpdGlvblkoKTtcblx0XHRcdGlmIChnZXRIaXRCb3goekluZGV4KSkge1xuXHRcdFx0XHR0aGJlICs9IGdldEhpdEJveCh6SW5kZXgpWzFdO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoYmU7XG5cdFx0fTtcblxuXHRcdHRoaXMuZ2V0UmlnaHRIaXRCb3hFZGdlID0gZnVuY3Rpb24gKHpJbmRleCkge1xuXHRcdFx0ekluZGV4ID0gekluZGV4IHx8IDA7XG5cblx0XHRcdGlmIChnZXRIaXRCb3goekluZGV4KSkge1xuXHRcdFx0XHRyZXR1cm4gdGhhdC5jYW52YXNYICsgZ2V0SGl0Qm94KHpJbmRleClbMl07XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB0aGF0LmNhbnZhc1ggKyB0aGF0LndpZHRoO1xuXHRcdH07XG5cblx0XHR0aGlzLmdldEJvdHRvbUhpdEJveEVkZ2UgPSBmdW5jdGlvbiAoekluZGV4KSB7XG5cdFx0XHR6SW5kZXggPSB6SW5kZXggfHwgMDtcblxuXHRcdFx0aWYgKGdldEhpdEJveCh6SW5kZXgpKSB7XG5cdFx0XHRcdHJldHVybiB0aGF0LmNhbnZhc1kgKyBnZXRIaXRCb3goekluZGV4KVszXTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHRoYXQuY2FudmFzWSArIHRoYXQuaGVpZ2h0O1xuXHRcdH07XG5cblx0XHR0aGlzLmdldFBvc2l0aW9uSW5Gcm9udE9mID0gZnVuY3Rpb24gICgpIHtcblx0XHRcdHJldHVybiBbdGhhdC5jYW52YXNYLCB0aGF0LmNhbnZhc1kgKyB0aGF0LmhlaWdodF07XG5cdFx0fTtcblxuXHRcdHRoaXMuc2V0U3BlZWQgPSBmdW5jdGlvbiAocykge1xuXHRcdFx0dGhhdC5zcGVlZCA9IHM7XG5cdFx0XHR0aGF0LnNwZWVkWCA9IHM7XG5cdFx0XHR0aGF0LnNwZWVkWSA9IHM7XG5cdFx0fTtcblxuXHRcdHRoaXMuaW5jcmVtZW50U3BlZWRCeSA9IGZ1bmN0aW9uIChzKSB7XG5cdFx0XHR0aGF0LnNwZWVkICs9IHM7XG5cdFx0fTtcblxuXHRcdHRoYXQuZ2V0U3BlZWQgPSBmdW5jdGlvbiBnZXRTcGVlZCAoKSB7XG5cdFx0XHRyZXR1cm4gdGhhdC5zcGVlZDtcblx0XHR9O1xuXG5cdFx0dGhhdC5nZXRTcGVlZFggPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gdGhhdC5zcGVlZDtcblx0XHR9O1xuXG5cdFx0dGhhdC5nZXRTcGVlZFkgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gdGhhdC5zcGVlZDtcblx0XHR9O1xuXG5cdFx0dGhpcy5zZXRIZWlnaHQgPSBmdW5jdGlvbiAoaCkge1xuXHRcdFx0dGhhdC5oZWlnaHQgPSBoO1xuXHRcdH07XG5cblx0XHR0aGlzLnNldFdpZHRoID0gZnVuY3Rpb24gKHcpIHtcblx0XHRcdHRoYXQud2lkdGggPSB3O1xuXHRcdH07XG5cblx0XHR0aGlzLmdldE1heEhlaWdodCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiB0aGF0Lm1heEhlaWdodDtcblx0XHR9O1xuXG5cdFx0dGhhdC5nZXRNb3ZpbmdUb3dhcmRPcHBvc2l0ZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmICghdGhhdC5pc01vdmluZykge1xuXHRcdFx0XHRyZXR1cm4gWzAsIDBdO1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgZHggPSAodGhhdC5tb3ZpbmdUb3dhcmRbMF0gLSB0aGF0Lm1hcFBvc2l0aW9uWzBdKTtcblx0XHRcdHZhciBkeSA9ICh0aGF0Lm1vdmluZ1Rvd2FyZFsxXSAtIHRoYXQubWFwUG9zaXRpb25bMV0pO1xuXG5cdFx0XHR2YXIgb3Bwb3NpdGVYID0gKE1hdGguYWJzKGR4KSA+IDc1ID8gMCAtIGR4IDogMCk7XG5cdFx0XHR2YXIgb3Bwb3NpdGVZID0gLWR5O1xuXG5cdFx0XHRyZXR1cm4gWyBvcHBvc2l0ZVgsIG9wcG9zaXRlWSBdO1xuXHRcdH07XG5cblx0XHR0aGlzLmNoZWNrSGl0dGFibGVPYmplY3RzID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0T2JqZWN0LmtleXMoaGl0dGFibGVPYmplY3RzLCBmdW5jdGlvbiAoaywgb2JqZWN0RGF0YSkge1xuXHRcdFx0XHRpZiAob2JqZWN0RGF0YS5vYmplY3QuZGVsZXRlZCkge1xuXHRcdFx0XHRcdGRlbGV0ZSBoaXR0YWJsZU9iamVjdHNba107XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aWYgKG9iamVjdERhdGEub2JqZWN0LmhpdHModGhhdCkpIHtcblx0XHRcdFx0XHRcdG9iamVjdERhdGEuY2FsbGJhY2tzLmVhY2goZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG5cdFx0XHRcdFx0XHRcdGNhbGxiYWNrKHRoYXQsIG9iamVjdERhdGEub2JqZWN0KTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fTtcblxuXHRcdHRoaXMuY3ljbGUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHR0aGF0LmNoZWNrSGl0dGFibGVPYmplY3RzKCk7XG5cblx0XHRcdGlmICh0cmFja2VkU3ByaXRlVG9Nb3ZlVG93YXJkKSB7XG5cdFx0XHRcdHRoYXQuc2V0TWFwUG9zaXRpb25UYXJnZXQodHJhY2tlZFNwcml0ZVRvTW92ZVRvd2FyZC5tYXBQb3NpdGlvblswXSwgdHJhY2tlZFNwcml0ZVRvTW92ZVRvd2FyZC5tYXBQb3NpdGlvblsxXSwgdHJ1ZSk7XG5cdFx0XHR9XG5cblx0XHRcdG1vdmUoKTtcblx0XHR9O1xuXG5cdFx0dGhpcy5zZXRNYXBQb3NpdGlvblRhcmdldCA9IGZ1bmN0aW9uICh4LCB5LCBvdmVycmlkZSkge1xuXHRcdFx0aWYgKG92ZXJyaWRlKSB7XG5cdFx0XHRcdHRoYXQubW92aW5nV2l0aENvbnZpY3Rpb24gPSBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCF0aGF0Lm1vdmluZ1dpdGhDb252aWN0aW9uKSB7XG5cdFx0XHRcdGlmICh0eXBlb2YgeCA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0XHR4ID0gdGhhdC5tb3ZpbmdUb3dhcmRbMF07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAodHlwZW9mIHkgPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdFx0eSA9IHRoYXQubW92aW5nVG93YXJkWzFdO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGhhdC5tb3ZpbmdUb3dhcmQgPSBbIHgsIHkgXTtcblxuXHRcdFx0XHR0aGF0Lm1vdmluZ1dpdGhDb252aWN0aW9uID0gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdC8vIHRoYXQucmVzZXREaXJlY3Rpb24oKTtcblx0XHR9O1xuXG5cdFx0dGhpcy5zZXREaXJlY3Rpb24gPSBmdW5jdGlvbiAoYW5nbGUpIHtcblx0XHRcdGlmIChhbmdsZSA+PSAzNjApIHtcblx0XHRcdFx0YW5nbGUgPSAzNjAgLSBhbmdsZTtcblx0XHRcdH1cblx0XHRcdHRoYXQuZGlyZWN0aW9uID0gYW5nbGU7XG5cdFx0XHR0aGF0Lm1vdmluZ1Rvd2FyZCA9IHVuZGVmaW5lZDtcblx0XHR9O1xuXG5cdFx0dGhpcy5yZXNldERpcmVjdGlvbiA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHRoYXQuZGlyZWN0aW9uID0gdW5kZWZpbmVkO1xuXHRcdH07XG5cblx0XHR0aGlzLnNldE1hcFBvc2l0aW9uVGFyZ2V0V2l0aENvbnZpY3Rpb24gPSBmdW5jdGlvbiAoY3gsIGN5KSB7XG5cdFx0XHR0aGF0LnNldE1hcFBvc2l0aW9uVGFyZ2V0KGN4LCBjeSk7XG5cdFx0XHR0aGF0Lm1vdmluZ1dpdGhDb252aWN0aW9uID0gdHJ1ZTtcblx0XHRcdC8vIHRoYXQucmVzZXREaXJlY3Rpb24oKTtcblx0XHR9O1xuXG5cdFx0dGhpcy5mb2xsb3cgPSBmdW5jdGlvbiAoc3ByaXRlKSB7XG5cdFx0XHR0cmFja2VkU3ByaXRlVG9Nb3ZlVG93YXJkID0gc3ByaXRlO1xuXHRcdFx0Ly8gdGhhdC5yZXNldERpcmVjdGlvbigpO1xuXHRcdH07XG5cblx0XHR0aGlzLnN0b3BGb2xsb3dpbmcgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHR0cmFja2VkU3ByaXRlVG9Nb3ZlVG93YXJkID0gZmFsc2U7XG5cdFx0fTtcblxuXHRcdHRoaXMub25IaXR0aW5nID0gZnVuY3Rpb24gKG9iamVjdFRvSGl0LCBjYWxsYmFjaykge1xuXHRcdFx0aWYgKGhpdHRhYmxlT2JqZWN0c1tvYmplY3RUb0hpdC5pZF0pIHtcblx0XHRcdFx0cmV0dXJuIGhpdHRhYmxlT2JqZWN0c1tvYmplY3RUb0hpdC5pZF0uY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuXHRcdFx0fVxuXG5cdFx0XHRoaXR0YWJsZU9iamVjdHNbb2JqZWN0VG9IaXQuaWRdID0ge1xuXHRcdFx0XHRvYmplY3Q6IG9iamVjdFRvSGl0LFxuXHRcdFx0XHRjYWxsYmFja3M6IFsgY2FsbGJhY2sgXVxuXHRcdFx0fTtcblx0XHR9O1xuXG5cdFx0dGhpcy5kZWxldGVPbk5leHRDeWNsZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHRoYXQuZGVsZXRlZCA9IHRydWU7XG5cdFx0fTtcblxuXHRcdHRoaXMub2NjdXBpZXNaSW5kZXggPSBmdW5jdGlvbiAoeikge1xuXHRcdFx0cmV0dXJuIHpJbmRleGVzT2NjdXBpZWQuaW5kZXhPZih6KSA+PSAwO1xuXHRcdH07XG5cblx0XHR0aGlzLmhpdHMgPSBmdW5jdGlvbiAob3RoZXIpIHtcblx0XHRcdHZhciB2ZXJ0aWNhbEludGVyc2VjdCA9IGZhbHNlO1xuXHRcdFx0dmFyIGhvcml6b250YWxJbnRlcnNlY3QgPSBmYWxzZTtcblxuXHRcdFx0Ly8gVGVzdCB0aGF0IFRISVMgaGFzIGEgYm90dG9tIGVkZ2UgaW5zaWRlIG9mIHRoZSBvdGhlciBvYmplY3Rcblx0XHRcdGlmIChvdGhlci5nZXRUb3BIaXRCb3hFZGdlKHRoYXQubWFwUG9zaXRpb25bMl0pIDw9IHRoYXQuZ2V0Qm90dG9tSGl0Qm94RWRnZSh0aGF0Lm1hcFBvc2l0aW9uWzJdKSAmJiBvdGhlci5nZXRCb3R0b21IaXRCb3hFZGdlKHRoYXQubWFwUG9zaXRpb25bMl0pID49IHRoYXQuZ2V0Qm90dG9tSGl0Qm94RWRnZSh0aGF0Lm1hcFBvc2l0aW9uWzJdKSkge1xuXHRcdFx0XHR2ZXJ0aWNhbEludGVyc2VjdCA9IHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFRlc3QgdGhhdCBUSElTIGhhcyBhIHRvcCBlZGdlIGluc2lkZSBvZiB0aGUgb3RoZXIgb2JqZWN0XG5cdFx0XHRpZiAob3RoZXIuZ2V0VG9wSGl0Qm94RWRnZSh0aGF0Lm1hcFBvc2l0aW9uWzJdKSA8PSB0aGF0LmdldFRvcEhpdEJveEVkZ2UodGhhdC5tYXBQb3NpdGlvblsyXSkgJiYgb3RoZXIuZ2V0Qm90dG9tSGl0Qm94RWRnZSh0aGF0Lm1hcFBvc2l0aW9uWzJdKSA+PSB0aGF0LmdldFRvcEhpdEJveEVkZ2UodGhhdC5tYXBQb3NpdGlvblsyXSkpIHtcblx0XHRcdFx0dmVydGljYWxJbnRlcnNlY3QgPSB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBUZXN0IHRoYXQgVEhJUyBoYXMgYSByaWdodCBlZGdlIGluc2lkZSBvZiB0aGUgb3RoZXIgb2JqZWN0XG5cdFx0XHRpZiAob3RoZXIuZ2V0TGVmdEhpdEJveEVkZ2UodGhhdC5tYXBQb3NpdGlvblsyXSkgPD0gdGhhdC5nZXRSaWdodEhpdEJveEVkZ2UodGhhdC5tYXBQb3NpdGlvblsyXSkgJiYgb3RoZXIuZ2V0UmlnaHRIaXRCb3hFZGdlKHRoYXQubWFwUG9zaXRpb25bMl0pID49IHRoYXQuZ2V0UmlnaHRIaXRCb3hFZGdlKHRoYXQubWFwUG9zaXRpb25bMl0pKSB7XG5cdFx0XHRcdGhvcml6b250YWxJbnRlcnNlY3QgPSB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBUZXN0IHRoYXQgVEhJUyBoYXMgYSBsZWZ0IGVkZ2UgaW5zaWRlIG9mIHRoZSBvdGhlciBvYmplY3Rcblx0XHRcdGlmIChvdGhlci5nZXRMZWZ0SGl0Qm94RWRnZSh0aGF0Lm1hcFBvc2l0aW9uWzJdKSA8PSB0aGF0LmdldExlZnRIaXRCb3hFZGdlKHRoYXQubWFwUG9zaXRpb25bMl0pICYmIG90aGVyLmdldFJpZ2h0SGl0Qm94RWRnZSh0aGF0Lm1hcFBvc2l0aW9uWzJdKSA+PSB0aGF0LmdldExlZnRIaXRCb3hFZGdlKHRoYXQubWFwUG9zaXRpb25bMl0pKSB7XG5cdFx0XHRcdGhvcml6b250YWxJbnRlcnNlY3QgPSB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdmVydGljYWxJbnRlcnNlY3QgJiYgaG9yaXpvbnRhbEludGVyc2VjdDtcblx0XHR9O1xuXG5cdFx0dGhpcy5pc0Fib3ZlT25DYW52YXMgPSBmdW5jdGlvbiAoY3kpIHtcblx0XHRcdHJldHVybiAodGhhdC5jYW52YXNZICsgdGhhdC5oZWlnaHQpIDwgY3k7XG5cdFx0fTtcblxuXHRcdHRoaXMuaXNCZWxvd09uQ2FudmFzID0gZnVuY3Rpb24gKGN5KSB7XG5cdFx0XHRyZXR1cm4gKHRoYXQuY2FudmFzWSkgPiBjeTtcblx0XHR9O1xuXG5cdFx0cmV0dXJuIHRoYXQ7XG5cdH1cblxuXHRTcHJpdGUuY3JlYXRlT2JqZWN0cyA9IGZ1bmN0aW9uIGNyZWF0ZU9iamVjdHMoc3ByaXRlSW5mb0FycmF5LCBvcHRzKSB7XG5cdFx0aWYgKCFBcnJheS5pc0FycmF5KHNwcml0ZUluZm9BcnJheSkpIHNwcml0ZUluZm9BcnJheSA9IFsgc3ByaXRlSW5mb0FycmF5IF07XG5cdFx0b3B0cyA9IE9iamVjdC5tZXJnZShvcHRzLCB7XG5cdFx0XHRyYXRlTW9kaWZpZXI6IDAsXG5cdFx0XHRkcm9wUmF0ZTogMSxcblx0XHRcdHBvc2l0aW9uOiBbMCwgMF1cblx0XHR9LCBmYWxzZSwgZmFsc2UpO1xuXG5cdFx0ZnVuY3Rpb24gY3JlYXRlT25lIChzcHJpdGVJbmZvKSB7XG5cdFx0XHR2YXIgcG9zaXRpb24gPSBvcHRzLnBvc2l0aW9uO1xuXHRcdFx0aWYgKE51bWJlci5yYW5kb20oMTAwICsgb3B0cy5yYXRlTW9kaWZpZXIpIDw9IHNwcml0ZUluZm8uZHJvcFJhdGUpIHtcblx0XHRcdFx0dmFyIHNwcml0ZSA9IG5ldyBTcHJpdGUoc3ByaXRlSW5mby5zcHJpdGUpO1xuXHRcdFx0XHRzcHJpdGUuc2V0U3BlZWQoMCk7XG5cblx0XHRcdFx0aWYgKE9iamVjdC5pc0Z1bmN0aW9uKHBvc2l0aW9uKSkge1xuXHRcdFx0XHRcdHBvc2l0aW9uID0gcG9zaXRpb24oKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHNwcml0ZS5zZXRNYXBQb3NpdGlvbihwb3NpdGlvblswXSwgcG9zaXRpb25bMV0pO1xuXG5cdFx0XHRcdGlmIChzcHJpdGVJbmZvLnNwcml0ZS5oaXRCZWhhdmlvdXIgJiYgc3ByaXRlSW5mby5zcHJpdGUuaGl0QmVoYXZpb3VyLnNraWVyICYmIG9wdHMucGxheWVyKSB7XG5cdFx0XHRcdFx0c3ByaXRlLm9uSGl0dGluZyhvcHRzLnBsYXllciwgc3ByaXRlSW5mby5zcHJpdGUuaGl0QmVoYXZpb3VyLnNraWVyKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBzcHJpdGU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dmFyIG9iamVjdHMgPSBzcHJpdGVJbmZvQXJyYXkubWFwKGNyZWF0ZU9uZSkucmVtb3ZlKHVuZGVmaW5lZCk7XG5cblx0XHRyZXR1cm4gb2JqZWN0cztcblx0fTtcblxuXHRnbG9iYWwuc3ByaXRlID0gU3ByaXRlO1xufSkoIHRoaXMgKTtcblxuXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0bW9kdWxlLmV4cG9ydHMgPSB0aGlzLnNwcml0ZTtcbn0iLCIoZnVuY3Rpb24gKGdsb2JhbCkge1xuXHRmdW5jdGlvbiBTcHJpdGVBcnJheSgpIHtcblx0XHR0aGlzLnB1c2hIYW5kbGVycyA9IFtdO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHRTcHJpdGVBcnJheS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEFycmF5LnByb3RvdHlwZSk7XG5cblx0U3ByaXRlQXJyYXkucHJvdG90eXBlLm9uUHVzaCA9IGZ1bmN0aW9uKGYsIHJldHJvYWN0aXZlKSB7XG5cdFx0dGhpcy5wdXNoSGFuZGxlcnMucHVzaChmKTtcblxuXHRcdGlmIChyZXRyb2FjdGl2ZSkge1xuXHRcdFx0dGhpcy5lYWNoKGYpO1xuXHRcdH1cblx0fTtcblxuXHRTcHJpdGVBcnJheS5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uKG9iaikge1xuXHRcdEFycmF5LnByb3RvdHlwZS5wdXNoLmNhbGwodGhpcywgb2JqKTtcblx0XHR0aGlzLnB1c2hIYW5kbGVycy5lYWNoKGZ1bmN0aW9uKGhhbmRsZXIpIHtcblx0XHRcdGhhbmRsZXIob2JqKTtcblx0XHR9KTtcblx0fTtcblxuXHRTcHJpdGVBcnJheS5wcm90b3R5cGUuY3VsbCA9IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuZWFjaChmdW5jdGlvbiAob2JqLCBpKSB7XG5cdFx0XHRpZiAob2JqLmRlbGV0ZWQpIHtcblx0XHRcdFx0cmV0dXJuIChkZWxldGUgdGhpc1tpXSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH07XG5cblx0Z2xvYmFsLnNwcml0ZUFycmF5ID0gU3ByaXRlQXJyYXk7XG59KSh0aGlzKTtcblxuXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0bW9kdWxlLmV4cG9ydHMgPSB0aGlzLnNwcml0ZUFycmF5O1xufSIsIi8vIEdsb2JhbCBkZXBlbmRlbmNpZXMgd2hpY2ggcmV0dXJuIG5vIG1vZHVsZXNcbnJlcXVpcmUoJy4vbGliL2NhbnZhc1JlbmRlcmluZ0NvbnRleHQyREV4dGVuc2lvbnMnKTtcbnJlcXVpcmUoJy4vbGliL3BsdWdpbnMnKTtcblxuLy8gRXh0ZXJuYWwgZGVwZW5kZW5jaWVzXG52YXIgSGFtbWVyID0gcmVxdWlyZSgnaGFtbWVyanMnKTtcbnZhciBNb3VzZXRyYXAgPSByZXF1aXJlKCdici1tb3VzZXRyYXAnKTtcblxuLy8gTWV0aG9kIG1vZHVsZXNcbnZhciBpc01vYmlsZURldmljZSA9IHJlcXVpcmUoJy4vbGliL2lzTW9iaWxlRGV2aWNlJyk7XG5cbi8vIEdhbWUgT2JqZWN0c1xudmFyIFNwcml0ZUFycmF5ID0gcmVxdWlyZSgnLi9saWIvc3ByaXRlQXJyYXknKTtcbnZhciBNb25zdGVyID0gcmVxdWlyZSgnLi9saWIvbW9uc3RlcicpO1xudmFyIFNwcml0ZSA9IHJlcXVpcmUoJy4vbGliL3Nwcml0ZScpO1xudmFyIFNub3dib2FyZGVyID0gcmVxdWlyZSgnLi9saWIvc25vd2JvYXJkZXInKTtcbnZhciBTa2llciA9IHJlcXVpcmUoJy4vbGliL3NraWVyJyk7XG52YXIgSW5mb0JveCA9IHJlcXVpcmUoJy4vbGliL2luZm9Cb3gnKTtcbnZhciBHYW1lID0gcmVxdWlyZSgnLi9saWIvZ2FtZScpO1xuXG4vLyBMb2NhbCB2YXJpYWJsZXMgZm9yIHN0YXJ0aW5nIHRoZSBnYW1lXG52YXIgbWFpbkNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdza2lmcmVlLWNhbnZhcycpO1xudmFyIGRDb250ZXh0ID0gbWFpbkNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xudmFyIGltYWdlU291cmNlcyA9IFsgJ3Nwcml0ZS1jaGFyYWN0ZXJzLnBuZycsICdza2lmcmVlLW9iamVjdHMucG5nJyBdO1xudmFyIGdsb2JhbCA9IHRoaXM7XG52YXIgaW5mb0JveENvbnRyb2xzID0gJ1VzZSB0aGUgbW91c2Ugb3IgV0FTRCB0byBjb250cm9sIHRoZSBwbGF5ZXInO1xuaWYgKGlzTW9iaWxlRGV2aWNlKCkpIGluZm9Cb3hDb250cm9scyA9ICdUYXAgb3IgZHJhZyBvbiB0aGUgcGlzdGUgdG8gY29udHJvbCB0aGUgcGxheWVyJztcbnZhciBzcHJpdGVzID0gcmVxdWlyZSgnLi9zcHJpdGVJbmZvJyk7XG5cbnZhciBwaXhlbHNQZXJNZXRyZSA9IDE4O1xudmFyIGRpc3RhbmNlVHJhdmVsbGVkSW5NZXRyZXMgPSAwO1xudmFyIG1vbnN0ZXJEaXN0YW5jZVRocmVzaG9sZCA9IDIwMDA7XG52YXIgbGl2ZXNMZWZ0ID0gNTtcbnZhciBoaWdoU2NvcmUgPSAwO1xudmFyIGxvc2VMaWZlT25PYnN0YWNsZUhpdCA9IGZhbHNlO1xudmFyIGRyb3BSYXRlcyA9IHtzbWFsbFRyZWU6IDQsIHRhbGxUcmVlOiAyLCBqdW1wOiAxLCB0aGlja1Nub3c6IDEsIHJvY2s6IDF9O1xuaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdoaWdoU2NvcmUnKSkgaGlnaFNjb3JlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2hpZ2hTY29yZScpO1xuXG5mdW5jdGlvbiBsb2FkSW1hZ2VzIChzb3VyY2VzLCBuZXh0KSB7XG5cdHZhciBsb2FkZWQgPSAwO1xuXHR2YXIgaW1hZ2VzID0ge307XG5cblx0ZnVuY3Rpb24gZmluaXNoICgpIHtcblx0XHRsb2FkZWQgKz0gMTtcblx0XHRpZiAobG9hZGVkID09PSBzb3VyY2VzLmxlbmd0aCkge1xuXHRcdFx0bmV4dChpbWFnZXMpO1xuXHRcdH1cblx0fVxuXG5cdHNvdXJjZXMuZWFjaChmdW5jdGlvbiAoc3JjKSB7XG5cdFx0dmFyIGltID0gbmV3IEltYWdlKCk7XG5cdFx0aW0ub25sb2FkID0gZmluaXNoO1xuXHRcdGltLnNyYyA9IHNyYztcblx0XHRkQ29udGV4dC5zdG9yZUxvYWRlZEltYWdlKHNyYywgaW0pO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gbW9uc3RlckhpdHNTa2llckJlaGF2aW91cihtb25zdGVyLCBza2llcikge1xuXHRza2llci5pc0VhdGVuQnkobW9uc3RlciwgZnVuY3Rpb24gKCkge1xuXHRcdGxpdmVzTGVmdCAtPSAxO1xuXHRcdG1vbnN0ZXIuaXNGdWxsID0gdHJ1ZTtcblx0XHRtb25zdGVyLmlzRWF0aW5nID0gZmFsc2U7XG5cdFx0c2tpZXIuaXNCZWluZ0VhdGVuID0gZmFsc2U7XG5cdFx0bW9uc3Rlci5zZXRTcGVlZChza2llci5nZXRTcGVlZCgpKTtcblx0XHRtb25zdGVyLnN0b3BGb2xsb3dpbmcoKTtcblx0XHR2YXIgcmFuZG9tUG9zaXRpb25BYm92ZSA9IGRDb250ZXh0LmdldFJhbmRvbU1hcFBvc2l0aW9uQWJvdmVWaWV3cG9ydCgpO1xuXHRcdG1vbnN0ZXIuc2V0TWFwUG9zaXRpb25UYXJnZXQocmFuZG9tUG9zaXRpb25BYm92ZVswXSwgcmFuZG9tUG9zaXRpb25BYm92ZVsxXSk7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBzdGFydE5ldmVyRW5kaW5nR2FtZSAoaW1hZ2VzKSB7XG5cdHZhciBwbGF5ZXI7XG5cdHZhciBzdGFydFNpZ247XG5cdHZhciBpbmZvQm94O1xuXHR2YXIgZ2FtZTtcblxuXHRmdW5jdGlvbiByZXNldEdhbWUgKCkge1xuXHRcdGRpc3RhbmNlVHJhdmVsbGVkSW5NZXRyZXMgPSAwO1xuXHRcdGxpdmVzTGVmdCA9IDU7XG5cdFx0aGlnaFNjb3JlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2hpZ2hTY29yZScpO1xuXHRcdGdhbWUucmVzZXQoKTtcblx0XHRnYW1lLmFkZFN0YXRpY09iamVjdChzdGFydFNpZ24pO1xuXHR9XG5cblx0ZnVuY3Rpb24gZGV0ZWN0RW5kICgpIHtcblx0XHRpZiAoIWdhbWUuaXNQYXVzZWQoKSkge1xuXHRcdFx0aGlnaFNjb3JlID0gbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2hpZ2hTY29yZScsIGRpc3RhbmNlVHJhdmVsbGVkSW5NZXRyZXMpO1xuXHRcdFx0aW5mb0JveC5zZXRMaW5lcyhbXG5cdFx0XHRcdCdHYW1lIG92ZXIhJyxcblx0XHRcdFx0J0hpdCBzcGFjZSB0byByZXN0YXJ0J1xuXHRcdFx0XSk7XG5cdFx0XHRnYW1lLnBhdXNlKCk7XG5cdFx0XHRnYW1lLmN5Y2xlKCk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gcmFuZG9tbHlTcGF3bk5QQyhzcGF3bkZ1bmN0aW9uLCBkcm9wUmF0ZSkge1xuXHRcdHZhciByYXRlTW9kaWZpZXIgPSBNYXRoLm1heCg4MDAgLSBtYWluQ2FudmFzLndpZHRoLCAwKTtcblx0XHRpZiAoTnVtYmVyLnJhbmRvbSgxMDAwICsgcmF0ZU1vZGlmaWVyKSA8PSBkcm9wUmF0ZSkge1xuXHRcdFx0c3Bhd25GdW5jdGlvbigpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHNwYXduTW9uc3RlciAoKSB7XG5cdFx0dmFyIG5ld01vbnN0ZXIgPSBuZXcgTW9uc3RlcihzcHJpdGVzLm1vbnN0ZXIpO1xuXHRcdHZhciByYW5kb21Qb3NpdGlvbiA9IGRDb250ZXh0LmdldFJhbmRvbU1hcFBvc2l0aW9uQWJvdmVWaWV3cG9ydCgpO1xuXHRcdG5ld01vbnN0ZXIuc2V0TWFwUG9zaXRpb24ocmFuZG9tUG9zaXRpb25bMF0sIHJhbmRvbVBvc2l0aW9uWzFdKTtcblx0XHRuZXdNb25zdGVyLmZvbGxvdyhwbGF5ZXIpO1xuXHRcdG5ld01vbnN0ZXIuc2V0U3BlZWQocGxheWVyLmdldFN0YW5kYXJkU3BlZWQoKSk7XG5cdFx0bmV3TW9uc3Rlci5vbkhpdHRpbmcocGxheWVyLCBtb25zdGVySGl0c1NraWVyQmVoYXZpb3VyKTtcblxuXHRcdGdhbWUuYWRkTW92aW5nT2JqZWN0KG5ld01vbnN0ZXIsICdtb25zdGVyJyk7XG5cdH1cblxuXHRmdW5jdGlvbiBzcGF3bkJvYXJkZXIgKCkge1xuXHRcdHZhciBuZXdCb2FyZGVyID0gbmV3IFNub3dib2FyZGVyKHNwcml0ZXMuc25vd2JvYXJkZXIpO1xuXHRcdHZhciByYW5kb21Qb3NpdGlvbkFib3ZlID0gZENvbnRleHQuZ2V0UmFuZG9tTWFwUG9zaXRpb25BYm92ZVZpZXdwb3J0KCk7XG5cdFx0dmFyIHJhbmRvbVBvc2l0aW9uQmVsb3cgPSBkQ29udGV4dC5nZXRSYW5kb21NYXBQb3NpdGlvbkJlbG93Vmlld3BvcnQoKTtcblx0XHRuZXdCb2FyZGVyLnNldE1hcFBvc2l0aW9uKHJhbmRvbVBvc2l0aW9uQWJvdmVbMF0sIHJhbmRvbVBvc2l0aW9uQWJvdmVbMV0pO1xuXHRcdG5ld0JvYXJkZXIuc2V0TWFwUG9zaXRpb25UYXJnZXQocmFuZG9tUG9zaXRpb25CZWxvd1swXSwgcmFuZG9tUG9zaXRpb25CZWxvd1sxXSk7XG5cdFx0bmV3Qm9hcmRlci5vbkhpdHRpbmcocGxheWVyLCBzcHJpdGVzLnNub3dib2FyZGVyLmhpdEJlaGF2aW91ci5za2llcik7XG5cblx0XHRnYW1lLmFkZE1vdmluZ09iamVjdChuZXdCb2FyZGVyKTtcblx0fVxuXG5cdHBsYXllciA9IG5ldyBTa2llcihzcHJpdGVzLnNraWVyKTtcblx0cGxheWVyLnNldE1hcFBvc2l0aW9uKDAsIDApO1xuXHRwbGF5ZXIuc2V0TWFwUG9zaXRpb25UYXJnZXQoMCwgLTEwKTtcblx0aWYgKCBsb3NlTGlmZU9uT2JzdGFjbGVIaXQgKSB7XG5cdFx0cGxheWVyLnNldEhpdE9ic3RhY2xlQ2IoZnVuY3Rpb24oKSB7XG5cdFx0XHRsaXZlc0xlZnQgLT0gMTtcblx0XHR9KTtcblx0fVxuXG5cdGdhbWUgPSBuZXcgR2FtZShtYWluQ2FudmFzLCBwbGF5ZXIpO1xuXG5cdHN0YXJ0U2lnbiA9IG5ldyBTcHJpdGUoc3ByaXRlcy5zaWduU3RhcnQpO1xuXHRnYW1lLmFkZFN0YXRpY09iamVjdChzdGFydFNpZ24pO1xuXHRzdGFydFNpZ24uc2V0TWFwUG9zaXRpb24oLTUwLCAwKTtcblx0ZENvbnRleHQuZm9sbG93U3ByaXRlKHBsYXllcik7XG5cblx0aW5mb0JveCA9IG5ldyBJbmZvQm94KHtcblx0XHRpbml0aWFsTGluZXMgOiBbXG5cdFx0XHQnU2tpRnJlZS5qcycsXG5cdFx0XHRpbmZvQm94Q29udHJvbHMsXG5cdFx0XHQnVHJhdmVsbGVkIDBtJyxcblx0XHRcdCdIaWdoIFNjb3JlOiAnICsgaGlnaFNjb3JlLFxuXHRcdFx0J1NraWVycyBsZWZ0OiAnICsgbGl2ZXNMZWZ0LFxuXHRcdFx0J0NyZWF0ZWQgYnkgRGFuIEhvdWdoIChAYmFzaWNhbGx5ZGFuKSdcblx0XHRdLFxuXHRcdHBvc2l0aW9uOiB7XG5cdFx0XHR0b3A6IDE1LFxuXHRcdFx0cmlnaHQ6IDEwXG5cdFx0fVxuXHR9KTtcblxuXHRnYW1lLmJlZm9yZUN5Y2xlKGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgbmV3T2JqZWN0cyA9IFtdO1xuXHRcdGlmIChwbGF5ZXIuaXNNb3ZpbmcpIHtcblx0XHRcdG5ld09iamVjdHMgPSBTcHJpdGUuY3JlYXRlT2JqZWN0cyhbXG5cdFx0XHRcdHsgc3ByaXRlOiBzcHJpdGVzLnNtYWxsVHJlZSwgZHJvcFJhdGU6IGRyb3BSYXRlcy5zbWFsbFRyZWUgfSxcblx0XHRcdFx0eyBzcHJpdGU6IHNwcml0ZXMudGFsbFRyZWUsIGRyb3BSYXRlOiBkcm9wUmF0ZXMudGFsbFRyZWUgfSxcblx0XHRcdFx0eyBzcHJpdGU6IHNwcml0ZXMuanVtcCwgZHJvcFJhdGU6IGRyb3BSYXRlcy5qdW1wIH0sXG5cdFx0XHRcdHsgc3ByaXRlOiBzcHJpdGVzLnRoaWNrU25vdywgZHJvcFJhdGU6IGRyb3BSYXRlcy50aGlja1Nub3cgfSxcblx0XHRcdFx0eyBzcHJpdGU6IHNwcml0ZXMucm9jaywgZHJvcFJhdGU6IGRyb3BSYXRlcy5yb2NrIH0sXG5cdFx0XHRdLCB7XG5cdFx0XHRcdHJhdGVNb2RpZmllcjogTWF0aC5tYXgoODAwIC0gbWFpbkNhbnZhcy53aWR0aCwgMCksXG5cdFx0XHRcdHBvc2l0aW9uOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGRDb250ZXh0LmdldFJhbmRvbU1hcFBvc2l0aW9uQmVsb3dWaWV3cG9ydCgpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRwbGF5ZXI6IHBsYXllclxuXHRcdFx0fSk7XG5cdFx0fVxuXHRcdGlmICghZ2FtZS5pc1BhdXNlZCgpKSB7XG5cdFx0XHRnYW1lLmFkZFN0YXRpY09iamVjdHMobmV3T2JqZWN0cyk7XG5cblx0XHRcdHJhbmRvbWx5U3Bhd25OUEMoc3Bhd25Cb2FyZGVyLCAwLjEpO1xuXHRcdFx0ZGlzdGFuY2VUcmF2ZWxsZWRJbk1ldHJlcyA9IHBhcnNlRmxvYXQocGxheWVyLmdldFBpeGVsc1RyYXZlbGxlZERvd25Nb3VudGFpbigpIC8gcGl4ZWxzUGVyTWV0cmUpLnRvRml4ZWQoMSk7XG5cblx0XHRcdGlmIChkaXN0YW5jZVRyYXZlbGxlZEluTWV0cmVzID4gbW9uc3RlckRpc3RhbmNlVGhyZXNob2xkKSB7XG5cdFx0XHRcdHJhbmRvbWx5U3Bhd25OUEMoc3Bhd25Nb25zdGVyLCAwLjAwMSk7XG5cdFx0XHR9XG5cblx0XHRcdGluZm9Cb3guc2V0TGluZXMoW1xuXHRcdFx0XHQnU2tpRnJlZS5qcycsXG5cdFx0XHRcdGluZm9Cb3hDb250cm9scyxcblx0XHRcdFx0J1RyYXZlbGxlZCAnICsgZGlzdGFuY2VUcmF2ZWxsZWRJbk1ldHJlcyArICdtJyxcblx0XHRcdFx0J1NraWVycyBsZWZ0OiAnICsgbGl2ZXNMZWZ0LFxuXHRcdFx0XHQnSGlnaCBTY29yZTogJyArIGhpZ2hTY29yZSxcblx0XHRcdFx0J0NyZWF0ZWQgYnkgRGFuIEhvdWdoIChAYmFzaWNhbGx5ZGFuKScsXG5cdFx0XHRcdCdDdXJyZW50IFNwZWVkOiAnICsgcGxheWVyLmdldFNwZWVkKCkvKixcblx0XHRcdFx0J1NraWVyIE1hcCBQb3NpdGlvbjogJyArIHBsYXllci5tYXBQb3NpdGlvblswXS50b0ZpeGVkKDEpICsgJywgJyArIHBsYXllci5tYXBQb3NpdGlvblsxXS50b0ZpeGVkKDEpLFxuXHRcdFx0XHQnTW91c2UgTWFwIFBvc2l0aW9uOiAnICsgbW91c2VNYXBQb3NpdGlvblswXS50b0ZpeGVkKDEpICsgJywgJyArIG1vdXNlTWFwUG9zaXRpb25bMV0udG9GaXhlZCgxKSovXG5cdFx0XHRdKTtcblx0XHR9XG5cdH0pO1xuXG5cdGdhbWUuYWZ0ZXJDeWNsZShmdW5jdGlvbigpIHtcblx0XHRpZiAobGl2ZXNMZWZ0ID09PSAwKSB7XG5cdFx0XHRkZXRlY3RFbmQoKTtcblx0XHR9XG5cdH0pO1xuXG5cdGdhbWUuYWRkVUlFbGVtZW50KGluZm9Cb3gpO1xuXHRcblx0JChtYWluQ2FudmFzKVxuXHQubW91c2Vtb3ZlKGZ1bmN0aW9uIChlKSB7XG5cdFx0Z2FtZS5zZXRNb3VzZVgoZS5wYWdlWCk7XG5cdFx0Z2FtZS5zZXRNb3VzZVkoZS5wYWdlWSk7XG5cdFx0cGxheWVyLnJlc2V0RGlyZWN0aW9uKCk7XG5cdFx0cGxheWVyLnN0YXJ0TW92aW5nSWZQb3NzaWJsZSgpO1xuXHR9KVxuXHQuYmluZCgnY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuXHRcdGdhbWUuc2V0TW91c2VYKGUucGFnZVgpO1xuXHRcdGdhbWUuc2V0TW91c2VZKGUucGFnZVkpO1xuXHRcdHBsYXllci5yZXNldERpcmVjdGlvbigpO1xuXHRcdHBsYXllci5zdGFydE1vdmluZ0lmUG9zc2libGUoKTtcblx0fSlcblx0LmZvY3VzKCk7IC8vIFNvIHdlIGNhbiBsaXN0ZW4gdG8gZXZlbnRzIGltbWVkaWF0ZWx5XG5cblx0TW91c2V0cmFwLmJpbmQoJ2YnLCBwbGF5ZXIuc3BlZWRCb29zdCk7XG5cdE1vdXNldHJhcC5iaW5kKCd0JywgcGxheWVyLmF0dGVtcHRUcmljayk7XG5cdE1vdXNldHJhcC5iaW5kKFsndycsICd1cCddLCBmdW5jdGlvbiAoKSB7XG5cdFx0cGxheWVyLnN0b3AoKTtcblx0fSk7XG5cdE1vdXNldHJhcC5iaW5kKFsnYScsICdsZWZ0J10sIGZ1bmN0aW9uICgpIHtcblx0XHRpZiAocGxheWVyLmRpcmVjdGlvbiA9PT0gMjcwKSB7XG5cdFx0XHRwbGF5ZXIuc3RlcFdlc3QoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cGxheWVyLnR1cm5XZXN0KCk7XG5cdFx0fVxuXHR9KTtcblx0TW91c2V0cmFwLmJpbmQoWydzJywgJ2Rvd24nXSwgZnVuY3Rpb24gKCkge1xuXHRcdHBsYXllci5zZXREaXJlY3Rpb24oMTgwKTtcblx0XHRwbGF5ZXIuc3RhcnRNb3ZpbmdJZlBvc3NpYmxlKCk7XG5cdH0pO1xuXHRNb3VzZXRyYXAuYmluZChbJ2QnLCAncmlnaHQnXSwgZnVuY3Rpb24gKCkge1xuXHRcdGlmIChwbGF5ZXIuZGlyZWN0aW9uID09PSA5MCkge1xuXHRcdFx0cGxheWVyLnN0ZXBFYXN0KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHBsYXllci50dXJuRWFzdCgpO1xuXHRcdH1cblx0fSk7XG5cdE1vdXNldHJhcC5iaW5kKCdtJywgc3Bhd25Nb25zdGVyKTtcblx0TW91c2V0cmFwLmJpbmQoJ2InLCBzcGF3bkJvYXJkZXIpO1xuXHRNb3VzZXRyYXAuYmluZCgnc3BhY2UnLCByZXNldEdhbWUpO1xuXG5cdHZhciBoYW1tZXJ0aW1lID0gSGFtbWVyKG1haW5DYW52YXMpLm9uKCdwcmVzcycsIGZ1bmN0aW9uIChlKSB7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGdhbWUuc2V0TW91c2VYKGUuZ2VzdHVyZS5jZW50ZXIueCk7XG5cdFx0Z2FtZS5zZXRNb3VzZVkoZS5nZXN0dXJlLmNlbnRlci55KTtcblx0fSkub24oJ3RhcCcsIGZ1bmN0aW9uIChlKSB7XG5cdFx0Z2FtZS5zZXRNb3VzZVgoZS5nZXN0dXJlLmNlbnRlci54KTtcblx0XHRnYW1lLnNldE1vdXNlWShlLmdlc3R1cmUuY2VudGVyLnkpO1xuXHR9KS5vbigncGFuJywgZnVuY3Rpb24gKGUpIHtcblx0XHRnYW1lLnNldE1vdXNlWChlLmdlc3R1cmUuY2VudGVyLngpO1xuXHRcdGdhbWUuc2V0TW91c2VZKGUuZ2VzdHVyZS5jZW50ZXIueSk7XG5cdFx0cGxheWVyLnJlc2V0RGlyZWN0aW9uKCk7XG5cdFx0cGxheWVyLnN0YXJ0TW92aW5nSWZQb3NzaWJsZSgpO1xuXHR9KS5vbignZG91YmxldGFwJywgZnVuY3Rpb24gKGUpIHtcblx0XHRwbGF5ZXIuc3BlZWRCb29zdCgpO1xuXHR9KTtcblxuXHRwbGF5ZXIuaXNNb3ZpbmcgPSBmYWxzZTtcblx0cGxheWVyLnNldERpcmVjdGlvbigyNzApO1xuXG5cdGdhbWUuc3RhcnQoKTtcbn1cblxuZnVuY3Rpb24gcmVzaXplQ2FudmFzKCkge1xuXHRtYWluQ2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG5cdG1haW5DYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xufVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgcmVzaXplQ2FudmFzLCBmYWxzZSk7XG5cbnJlc2l6ZUNhbnZhcygpO1xuXG5sb2FkSW1hZ2VzKGltYWdlU291cmNlcywgc3RhcnROZXZlckVuZGluZ0dhbWUpO1xuXG50aGlzLmV4cG9ydHMgPSB3aW5kb3c7XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCkge1xuXHR2YXIgc3ByaXRlcyA9IHtcblx0XHQnc2tpZXInIDoge1xuXHRcdFx0JGltYWdlRmlsZSA6ICdzcHJpdGUtY2hhcmFjdGVycy5wbmcnLFxuXHRcdFx0cGFydHMgOiB7XG5cdFx0XHRcdGJsYW5rIDogWyAwLCAwLCAwLCAwIF0sXG5cdFx0XHRcdGVhc3QgOiBbIDAsIDAsIDI0LCAzNCBdLFxuXHRcdFx0XHRlc0Vhc3QgOiBbIDI0LCAwLCAyNCwgMzQgXSxcblx0XHRcdFx0c0Vhc3QgOiBbIDQ5LCAwLCAxNywgMzQgXSxcblx0XHRcdFx0c291dGggOiBbIDY1LCAwLCAxNywgMzQgXSxcblx0XHRcdFx0c1dlc3QgOiBbIDQ5LCAzNywgMTcsIDM0IF0sXG5cdFx0XHRcdHdzV2VzdCA6IFsgMjQsIDM3LCAyNCwgMzQgXSxcblx0XHRcdFx0d2VzdCA6IFsgMCwgMzcsIDI0LCAzNCBdLFxuXHRcdFx0XHRoaXQgOiBbIDAsIDc4LCAzMSwgMzEgXSxcblx0XHRcdFx0anVtcGluZyA6IFsgODQsIDAsIDMyLCAzNCBdLFxuXHRcdFx0XHRzb21lcnNhdWx0MSA6IFsgMTE2LCAwLCAzMiwgMzQgXSxcblx0XHRcdFx0c29tZXJzYXVsdDIgOiBbIDE0OCwgMCwgMzIsIDM0IF1cblx0XHRcdH0sXG5cdFx0XHRoaXRCb3hlczoge1xuXHRcdFx0XHQwOiBbIDcsIDIwLCAyNywgMzQgXVxuXHRcdFx0fSxcblx0XHRcdGlkIDogJ3BsYXllcicsXG5cdFx0XHRoaXRCZWhhdmlvdXI6IHt9XG5cdFx0fSxcblx0XHQnc21hbGxUcmVlJyA6IHtcblx0XHRcdCRpbWFnZUZpbGUgOiAnc2tpZnJlZS1vYmplY3RzLnBuZycsXG5cdFx0XHRwYXJ0cyA6IHtcblx0XHRcdFx0bWFpbiA6IFsgMCwgMjgsIDMwLCAzNCBdXG5cdFx0XHR9LFxuXHRcdFx0aGl0Qm94ZXM6IHtcblx0XHRcdFx0MDogWyAwLCAxOCwgMzAsIDM0IF1cblx0XHRcdH0sXG5cdFx0XHRoaXRCZWhhdmlvdXI6IHt9XG5cdFx0fSxcblx0XHQndGFsbFRyZWUnIDoge1xuXHRcdFx0JGltYWdlRmlsZSA6ICdza2lmcmVlLW9iamVjdHMucG5nJyxcblx0XHRcdHBhcnRzIDoge1xuXHRcdFx0XHRtYWluIDogWyA5NSwgNjYsIDMyLCA2NCBdXG5cdFx0XHR9LFxuXHRcdFx0ekluZGV4ZXNPY2N1cGllZCA6IFswLCAxXSxcblx0XHRcdGhpdEJveGVzOiB7XG5cdFx0XHRcdDA6IFswLCA1NCwgMzIsIDY0XSxcblx0XHRcdFx0MTogWzAsIDEwLCAzMiwgNTRdXG5cdFx0XHR9LFxuXHRcdFx0aGl0QmVoYXZpb3VyOiB7fVxuXHRcdH0sXG5cdFx0J3RoaWNrU25vdycgOiB7XG5cdFx0XHQkaW1hZ2VGaWxlIDogJ3NraWZyZWUtb2JqZWN0cy5wbmcnLFxuXHRcdFx0cGFydHMgOiB7XG5cdFx0XHRcdG1haW4gOiBbIDE0MywgNTMsIDQzLCAxMCBdXG5cdFx0XHR9LFxuXHRcdFx0aGl0QmVoYXZpb3VyOiB7fVxuXHRcdH0sXG5cdFx0J3JvY2snIDoge1xuXHRcdFx0JGltYWdlRmlsZSA6ICdza2lmcmVlLW9iamVjdHMucG5nJyxcblx0XHRcdHBhcnRzIDoge1xuXHRcdFx0XHRtYWluIDogWyAzMCwgNTIsIDIzLCAxMSBdXG5cdFx0XHR9LFxuXHRcdFx0aGl0QmVoYXZpb3VyOiB7fVxuXHRcdH0sXG5cdFx0J21vbnN0ZXInIDoge1xuXHRcdFx0JGltYWdlRmlsZSA6ICdzcHJpdGUtY2hhcmFjdGVycy5wbmcnLFxuXHRcdFx0cGFydHMgOiB7XG5cdFx0XHRcdHNFYXN0MSA6IFsgNjQsIDExMiwgMjYsIDQzIF0sXG5cdFx0XHRcdHNFYXN0MiA6IFsgOTAsIDExMiwgMzIsIDQzIF0sXG5cdFx0XHRcdHNXZXN0MSA6IFsgNjQsIDE1OCwgMjYsIDQzIF0sXG5cdFx0XHRcdHNXZXN0MiA6IFsgOTAsIDE1OCwgMzIsIDQzIF0sXG5cdFx0XHRcdGVhdGluZzEgOiBbIDEyMiwgMTEyLCAzNCwgNDMgXSxcblx0XHRcdFx0ZWF0aW5nMiA6IFsgMTU2LCAxMTIsIDMxLCA0MyBdLFxuXHRcdFx0XHRlYXRpbmczIDogWyAxODcsIDExMiwgMzEsIDQzIF0sXG5cdFx0XHRcdGVhdGluZzQgOiBbIDIxOSwgMTEyLCAyNSwgNDMgXSxcblx0XHRcdFx0ZWF0aW5nNSA6IFsgMjQzLCAxMTIsIDI2LCA0MyBdXG5cdFx0XHR9LFxuXHRcdFx0aGl0QmVoYXZpb3VyOiB7fVxuXHRcdH0sXG5cdFx0J2p1bXAnIDoge1xuXHRcdFx0JGltYWdlRmlsZSA6ICdza2lmcmVlLW9iamVjdHMucG5nJyxcblx0XHRcdHBhcnRzIDoge1xuXHRcdFx0XHRtYWluIDogWyAxMDksIDU1LCAzMiwgOCBdXG5cdFx0XHR9LFxuXHRcdFx0aGl0QmVoYXZpb3VyOiB7fVxuXHRcdH0sXG5cdFx0J3NpZ25TdGFydCcgOiB7XG5cdFx0XHQkaW1hZ2VGaWxlIDogJ3NraWZyZWUtb2JqZWN0cy5wbmcnLFxuXHRcdFx0cGFydHMgOiB7XG5cdFx0XHRcdG1haW4gOiBbIDI2MCwgMTAzLCA0MiwgMjcgXVxuXHRcdFx0fSxcblx0XHRcdGhpdEJlaGF2aW91cjoge31cblx0XHR9LFxuXHRcdCdzbm93Ym9hcmRlcicgOiB7XG5cdFx0XHQkaW1hZ2VGaWxlIDogJ3Nwcml0ZS1jaGFyYWN0ZXJzLnBuZycsXG5cdFx0XHRwYXJ0cyA6IHtcblx0XHRcdFx0c0Vhc3QgOiBbIDczLCAyMjksIDIwLCAyOSBdLFxuXHRcdFx0XHRzV2VzdCA6IFsgOTUsIDIyOCwgMjYsIDMwIF1cblx0XHRcdH0sXG5cdFx0XHRoaXRCZWhhdmlvdXI6IHt9XG5cdFx0fSxcblx0XHQnZW1wdHlDaGFpckxpZnQnOiB7XG5cdFx0XHQkaW1hZ2VGaWxlIDogJ3NraWZyZWUtb2JqZWN0cy5wbmcnLFxuXHRcdFx0cGFydHM6IHtcblx0XHRcdFx0bWFpbiA6IFsgOTIsIDEzNiwgMjYsIDMwIF1cblx0XHRcdH0sXG5cdFx0XHR6SW5kZXhlc09jY3VwaWVkIDogWzFdLFxuXHRcdH1cblx0fTtcblxuXHRmdW5jdGlvbiBtb25zdGVySGl0c1RyZWVCZWhhdmlvdXIobW9uc3Rlcikge1xuXHRcdG1vbnN0ZXIuZGVsZXRlT25OZXh0Q3ljbGUoKTtcblx0fVxuXG5cdHNwcml0ZXMubW9uc3Rlci5oaXRCZWhhdmlvdXIudHJlZSA9IG1vbnN0ZXJIaXRzVHJlZUJlaGF2aW91cjtcblxuXHRmdW5jdGlvbiB0cmVlSGl0c01vbnN0ZXJCZWhhdmlvdXIodHJlZSwgbW9uc3Rlcikge1xuXHRcdG1vbnN0ZXIuZGVsZXRlT25OZXh0Q3ljbGUoKTtcblx0fVxuXG5cdHNwcml0ZXMuc21hbGxUcmVlLmhpdEJlaGF2aW91ci5tb25zdGVyID0gdHJlZUhpdHNNb25zdGVyQmVoYXZpb3VyO1xuXHRzcHJpdGVzLnRhbGxUcmVlLmhpdEJlaGF2aW91ci5tb25zdGVyID0gdHJlZUhpdHNNb25zdGVyQmVoYXZpb3VyO1xuXG5cdGZ1bmN0aW9uIHNraWVySGl0c1RyZWVCZWhhdmlvdXIoc2tpZXIsIHRyZWUpIHtcblx0XHRza2llci5oYXNIaXRPYnN0YWNsZSh0cmVlKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHRyZWVIaXRzU2tpZXJCZWhhdmlvdXIodHJlZSwgc2tpZXIpIHtcblx0XHRza2llci5oYXNIaXRPYnN0YWNsZSh0cmVlKTtcblx0fVxuXG5cdHNwcml0ZXMuc21hbGxUcmVlLmhpdEJlaGF2aW91ci5za2llciA9IHRyZWVIaXRzU2tpZXJCZWhhdmlvdXI7XG5cdHNwcml0ZXMudGFsbFRyZWUuaGl0QmVoYXZpb3VyLnNraWVyID0gdHJlZUhpdHNTa2llckJlaGF2aW91cjtcblxuXHRmdW5jdGlvbiByb2NrSGl0c1NraWVyQmVoYXZpb3VyKHJvY2ssIHNraWVyKSB7XG5cdFx0c2tpZXIuaGFzSGl0T2JzdGFjbGUocm9jayk7XG5cdH1cblxuXHRzcHJpdGVzLnJvY2suaGl0QmVoYXZpb3VyLnNraWVyID0gcm9ja0hpdHNTa2llckJlaGF2aW91cjtcblxuXHRmdW5jdGlvbiBza2llckhpdHNKdW1wQmVoYXZpb3VyKHNraWVyLCBqdW1wKSB7XG5cdFx0c2tpZXIuaGFzSGl0SnVtcChqdW1wKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGp1bXBIaXRzU2tpZXJCZWhhdmlvdXIoanVtcCwgc2tpZXIpIHtcblx0XHRza2llci5oYXNIaXRKdW1wKGp1bXApO1xuXHR9XG5cblx0c3ByaXRlcy5qdW1wLmhpdEJlaGF2aW91ci5za2llciA9IGp1bXBIaXRzU2tpZXJCZWhhdmlvdXI7XG5cbi8vIFJlYWxseSBub3QgYSBmYW4gb2YgdGhpcyBiZWhhdmlvdXIuXG4vKlx0ZnVuY3Rpb24gc2tpZXJIaXRzVGhpY2tTbm93QmVoYXZpb3VyKHNraWVyLCB0aGlja1Nub3cpIHtcblx0XHQvLyBOZWVkIHRvIGltcGxlbWVudCB0aGlzIHByb3Blcmx5XG5cdFx0c2tpZXIuc2V0U3BlZWQoMik7XG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdHNraWVyLnJlc2V0U3BlZWQoKTtcblx0XHR9LCA3MDApO1xuXHR9XG5cblx0ZnVuY3Rpb24gdGhpY2tTbm93SGl0c1NraWVyQmVoYXZpb3VyKHRoaWNrU25vdywgc2tpZXIpIHtcblx0XHQvLyBOZWVkIHRvIGltcGxlbWVudCB0aGlzIHByb3Blcmx5XG5cdFx0c2tpZXIuc2V0U3BlZWQoMik7XG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdHNraWVyLnJlc2V0U3BlZWQoKTtcblx0XHR9LCAzMDApO1xuXHR9Ki9cblxuXHQvLyBzcHJpdGVzLnRoaWNrU25vdy5oaXRCZWhhdmlvdXIuc2tpZXIgPSB0aGlja1Nub3dIaXRzU2tpZXJCZWhhdmlvdXI7XG5cblx0ZnVuY3Rpb24gc25vd2JvYXJkZXJIaXRzU2tpZXJCZWhhdmlvdXIoc25vd2JvYXJkZXIsIHNraWVyKSB7XG5cdFx0c2tpZXIuaGFzSGl0T2JzdGFjbGUoc25vd2JvYXJkZXIpO1xuXHR9XG5cblx0c3ByaXRlcy5zbm93Ym9hcmRlci5oaXRCZWhhdmlvdXIuc2tpZXIgPSBzbm93Ym9hcmRlckhpdHNTa2llckJlaGF2aW91cjtcblxuXHRnbG9iYWwuc3ByaXRlSW5mbyA9IHNwcml0ZXM7XG59KSggdGhpcyApO1xuXG5cbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykge1xuXHRtb2R1bGUuZXhwb3J0cyA9IHRoaXMuc3ByaXRlSW5mbztcbn0iLCIvKipcbiAqIENvcHlyaWdodCAyMDEyIENyYWlnIENhbXBiZWxsXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICogTW91c2V0cmFwIGlzIGEgc2ltcGxlIGtleWJvYXJkIHNob3J0Y3V0IGxpYnJhcnkgZm9yIEphdmFzY3JpcHQgd2l0aFxuICogbm8gZXh0ZXJuYWwgZGVwZW5kZW5jaWVzXG4gKlxuICogQHZlcnNpb24gMS4xLjNcbiAqIEB1cmwgY3JhaWcuaXMva2lsbGluZy9taWNlXG4gKi9cbihmdW5jdGlvbigpIHtcblxuICAgIC8qKlxuICAgICAqIG1hcHBpbmcgb2Ygc3BlY2lhbCBrZXljb2RlcyB0byB0aGVpciBjb3JyZXNwb25kaW5nIGtleXNcbiAgICAgKlxuICAgICAqIGV2ZXJ5dGhpbmcgaW4gdGhpcyBkaWN0aW9uYXJ5IGNhbm5vdCB1c2Uga2V5cHJlc3MgZXZlbnRzXG4gICAgICogc28gaXQgaGFzIHRvIGJlIGhlcmUgdG8gbWFwIHRvIHRoZSBjb3JyZWN0IGtleWNvZGVzIGZvclxuICAgICAqIGtleXVwL2tleWRvd24gZXZlbnRzXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHZhciBfTUFQID0ge1xuICAgICAgICAgICAgODogJ2JhY2tzcGFjZScsXG4gICAgICAgICAgICA5OiAndGFiJyxcbiAgICAgICAgICAgIDEzOiAnZW50ZXInLFxuICAgICAgICAgICAgMTY6ICdzaGlmdCcsXG4gICAgICAgICAgICAxNzogJ2N0cmwnLFxuICAgICAgICAgICAgMTg6ICdhbHQnLFxuICAgICAgICAgICAgMjA6ICdjYXBzbG9jaycsXG4gICAgICAgICAgICAyNzogJ2VzYycsXG4gICAgICAgICAgICAzMjogJ3NwYWNlJyxcbiAgICAgICAgICAgIDMzOiAncGFnZXVwJyxcbiAgICAgICAgICAgIDM0OiAncGFnZWRvd24nLFxuICAgICAgICAgICAgMzU6ICdlbmQnLFxuICAgICAgICAgICAgMzY6ICdob21lJyxcbiAgICAgICAgICAgIDM3OiAnbGVmdCcsXG4gICAgICAgICAgICAzODogJ3VwJyxcbiAgICAgICAgICAgIDM5OiAncmlnaHQnLFxuICAgICAgICAgICAgNDA6ICdkb3duJyxcbiAgICAgICAgICAgIDQ1OiAnaW5zJyxcbiAgICAgICAgICAgIDQ2OiAnZGVsJyxcbiAgICAgICAgICAgIDkxOiAnbWV0YScsXG4gICAgICAgICAgICA5MzogJ21ldGEnLFxuICAgICAgICAgICAgMjI0OiAnbWV0YSdcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogbWFwcGluZyBmb3Igc3BlY2lhbCBjaGFyYWN0ZXJzIHNvIHRoZXkgY2FuIHN1cHBvcnRcbiAgICAgICAgICpcbiAgICAgICAgICogdGhpcyBkaWN0aW9uYXJ5IGlzIG9ubHkgdXNlZCBpbmNhc2UgeW91IHdhbnQgdG8gYmluZCBhXG4gICAgICAgICAqIGtleXVwIG9yIGtleWRvd24gZXZlbnQgdG8gb25lIG9mIHRoZXNlIGtleXNcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIF9LRVlDT0RFX01BUCA9IHtcbiAgICAgICAgICAgIDEwNjogJyonLFxuICAgICAgICAgICAgMTA3OiAnKycsXG4gICAgICAgICAgICAxMDk6ICctJyxcbiAgICAgICAgICAgIDExMDogJy4nLFxuICAgICAgICAgICAgMTExIDogJy8nLFxuICAgICAgICAgICAgMTg2OiAnOycsXG4gICAgICAgICAgICAxODc6ICc9JyxcbiAgICAgICAgICAgIDE4ODogJywnLFxuICAgICAgICAgICAgMTg5OiAnLScsXG4gICAgICAgICAgICAxOTA6ICcuJyxcbiAgICAgICAgICAgIDE5MTogJy8nLFxuICAgICAgICAgICAgMTkyOiAnYCcsXG4gICAgICAgICAgICAyMTk6ICdbJyxcbiAgICAgICAgICAgIDIyMDogJ1xcXFwnLFxuICAgICAgICAgICAgMjIxOiAnXScsXG4gICAgICAgICAgICAyMjI6ICdcXCcnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIHRoaXMgaXMgYSBtYXBwaW5nIG9mIGtleXMgdGhhdCByZXF1aXJlIHNoaWZ0IG9uIGEgVVMga2V5cGFkXG4gICAgICAgICAqIGJhY2sgdG8gdGhlIG5vbiBzaGlmdCBlcXVpdmVsZW50c1xuICAgICAgICAgKlxuICAgICAgICAgKiB0aGlzIGlzIHNvIHlvdSBjYW4gdXNlIGtleXVwIGV2ZW50cyB3aXRoIHRoZXNlIGtleXNcbiAgICAgICAgICpcbiAgICAgICAgICogbm90ZSB0aGF0IHRoaXMgd2lsbCBvbmx5IHdvcmsgcmVsaWFibHkgb24gVVMga2V5Ym9hcmRzXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBfU0hJRlRfTUFQID0ge1xuICAgICAgICAgICAgJ34nOiAnYCcsXG4gICAgICAgICAgICAnISc6ICcxJyxcbiAgICAgICAgICAgICdAJzogJzInLFxuICAgICAgICAgICAgJyMnOiAnMycsXG4gICAgICAgICAgICAnJCc6ICc0JyxcbiAgICAgICAgICAgICclJzogJzUnLFxuICAgICAgICAgICAgJ14nOiAnNicsXG4gICAgICAgICAgICAnJic6ICc3JyxcbiAgICAgICAgICAgICcqJzogJzgnLFxuICAgICAgICAgICAgJygnOiAnOScsXG4gICAgICAgICAgICAnKSc6ICcwJyxcbiAgICAgICAgICAgICdfJzogJy0nLFxuICAgICAgICAgICAgJysnOiAnPScsXG4gICAgICAgICAgICAnOic6ICc7JyxcbiAgICAgICAgICAgICdcXFwiJzogJ1xcJycsXG4gICAgICAgICAgICAnPCc6ICcsJyxcbiAgICAgICAgICAgICc+JzogJy4nLFxuICAgICAgICAgICAgJz8nOiAnLycsXG4gICAgICAgICAgICAnfCc6ICdcXFxcJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiB0aGlzIGlzIGEgbGlzdCBvZiBzcGVjaWFsIHN0cmluZ3MgeW91IGNhbiB1c2UgdG8gbWFwXG4gICAgICAgICAqIHRvIG1vZGlmaWVyIGtleXMgd2hlbiB5b3Ugc3BlY2lmeSB5b3VyIGtleWJvYXJkIHNob3J0Y3V0c1xuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgX1NQRUNJQUxfQUxJQVNFUyA9IHtcbiAgICAgICAgICAgICdvcHRpb24nOiAnYWx0JyxcbiAgICAgICAgICAgICdjb21tYW5kJzogJ21ldGEnLFxuICAgICAgICAgICAgJ3JldHVybic6ICdlbnRlcicsXG4gICAgICAgICAgICAnZXNjYXBlJzogJ2VzYydcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogdmFyaWFibGUgdG8gc3RvcmUgdGhlIGZsaXBwZWQgdmVyc2lvbiBvZiBfTUFQIGZyb20gYWJvdmVcbiAgICAgICAgICogbmVlZGVkIHRvIGNoZWNrIGlmIHdlIHNob3VsZCB1c2Uga2V5cHJlc3Mgb3Igbm90IHdoZW4gbm8gYWN0aW9uXG4gICAgICAgICAqIGlzIHNwZWNpZmllZFxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fHVuZGVmaW5lZH1cbiAgICAgICAgICovXG4gICAgICAgIF9SRVZFUlNFX01BUCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogYSBsaXN0IG9mIGFsbCB0aGUgY2FsbGJhY2tzIHNldHVwIHZpYSBNb3VzZXRyYXAuYmluZCgpXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBfY2FsbGJhY2tzID0ge30sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIGRpcmVjdCBtYXAgb2Ygc3RyaW5nIGNvbWJpbmF0aW9ucyB0byBjYWxsYmFja3MgdXNlZCBmb3IgdHJpZ2dlcigpXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICBfZGlyZWN0X21hcCA9IHt9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBrZWVwcyB0cmFjayBvZiB3aGF0IGxldmVsIGVhY2ggc2VxdWVuY2UgaXMgYXQgc2luY2UgbXVsdGlwbGVcbiAgICAgICAgICogc2VxdWVuY2VzIGNhbiBzdGFydCBvdXQgd2l0aCB0aGUgc2FtZSBzZXF1ZW5jZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgX3NlcXVlbmNlX2xldmVscyA9IHt9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiB2YXJpYWJsZSB0byBzdG9yZSB0aGUgc2V0VGltZW91dCBjYWxsXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtudWxsfG51bWJlcn1cbiAgICAgICAgICovXG4gICAgICAgIF9yZXNldF90aW1lcixcblxuICAgICAgICAvKipcbiAgICAgICAgICogdGVtcG9yYXJ5IHN0YXRlIHdoZXJlIHdlIHdpbGwgaWdub3JlIHRoZSBuZXh0IGtleXVwXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtib29sZWFufHN0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIF9pZ25vcmVfbmV4dF9rZXl1cCA9IGZhbHNlLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBhcmUgd2UgY3VycmVudGx5IGluc2lkZSBvZiBhIHNlcXVlbmNlP1xuICAgICAgICAgKiB0eXBlIG9mIGFjdGlvbiAoXCJrZXl1cFwiIG9yIFwia2V5ZG93blwiIG9yIFwia2V5cHJlc3NcIikgb3IgZmFsc2VcbiAgICAgICAgICpcbiAgICAgICAgICogQHR5cGUge2Jvb2xlYW58c3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgX2luc2lkZV9zZXF1ZW5jZSA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogbG9vcCB0aHJvdWdoIHRoZSBmIGtleXMsIGYxIHRvIGYxOSBhbmQgYWRkIHRoZW0gdG8gdGhlIG1hcFxuICAgICAqIHByb2dyYW1hdGljYWxseVxuICAgICAqL1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgMjA7ICsraSkge1xuICAgICAgICBfTUFQWzExMSArIGldID0gJ2YnICsgaTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBsb29wIHRocm91Z2ggdG8gbWFwIG51bWJlcnMgb24gdGhlIG51bWVyaWMga2V5cGFkXG4gICAgICovXG4gICAgZm9yIChpID0gMDsgaSA8PSA5OyArK2kpIHtcbiAgICAgICAgX01BUFtpICsgOTZdID0gaTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjcm9zcyBicm93c2VyIGFkZCBldmVudCBtZXRob2RcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RWxlbWVudHxIVE1MRG9jdW1lbnR9IG9iamVjdFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgZnVuY3Rpb24gX2FkZEV2ZW50KG9iamVjdCwgdHlwZSwgY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKG9iamVjdC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgICAgICBvYmplY3QuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBjYWxsYmFjaywgZmFsc2UpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgb2JqZWN0LmF0dGFjaEV2ZW50KCdvbicgKyB0eXBlLCBjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdGFrZXMgdGhlIGV2ZW50IGFuZCByZXR1cm5zIHRoZSBrZXkgY2hhcmFjdGVyXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBlXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9jaGFyYWN0ZXJGcm9tRXZlbnQoZSkge1xuXG4gICAgICAgIC8vIGZvciBrZXlwcmVzcyBldmVudHMgd2Ugc2hvdWxkIHJldHVybiB0aGUgY2hhcmFjdGVyIGFzIGlzXG4gICAgICAgIGlmIChlLnR5cGUgPT0gJ2tleXByZXNzJykge1xuICAgICAgICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoZS53aGljaCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBmb3Igbm9uIGtleXByZXNzIGV2ZW50cyB0aGUgc3BlY2lhbCBtYXBzIGFyZSBuZWVkZWRcbiAgICAgICAgaWYgKF9NQVBbZS53aGljaF0pIHtcbiAgICAgICAgICAgIHJldHVybiBfTUFQW2Uud2hpY2hdO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF9LRVlDT0RFX01BUFtlLndoaWNoXSkge1xuICAgICAgICAgICAgcmV0dXJuIF9LRVlDT0RFX01BUFtlLndoaWNoXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIGl0IGlzIG5vdCBpbiB0aGUgc3BlY2lhbCBtYXBcbiAgICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoZS53aGljaCkudG9Mb3dlckNhc2UoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjaGVja3MgaWYgdHdvIGFycmF5cyBhcmUgZXF1YWxcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IG1vZGlmaWVyczFcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBtb2RpZmllcnMyXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgZnVuY3Rpb24gX21vZGlmaWVyc01hdGNoKG1vZGlmaWVyczEsIG1vZGlmaWVyczIpIHtcbiAgICAgICAgcmV0dXJuIG1vZGlmaWVyczEuc29ydCgpLmpvaW4oJywnKSA9PT0gbW9kaWZpZXJzMi5zb3J0KCkuam9pbignLCcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJlc2V0cyBhbGwgc2VxdWVuY2UgY291bnRlcnMgZXhjZXB0IGZvciB0aGUgb25lcyBwYXNzZWQgaW5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkb19ub3RfcmVzZXRcbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgZnVuY3Rpb24gX3Jlc2V0U2VxdWVuY2VzKGRvX25vdF9yZXNldCkge1xuICAgICAgICBkb19ub3RfcmVzZXQgPSBkb19ub3RfcmVzZXQgfHwge307XG5cbiAgICAgICAgdmFyIGFjdGl2ZV9zZXF1ZW5jZXMgPSBmYWxzZSxcbiAgICAgICAgICAgIGtleTtcblxuICAgICAgICBmb3IgKGtleSBpbiBfc2VxdWVuY2VfbGV2ZWxzKSB7XG4gICAgICAgICAgICBpZiAoZG9fbm90X3Jlc2V0W2tleV0pIHtcbiAgICAgICAgICAgICAgICBhY3RpdmVfc2VxdWVuY2VzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF9zZXF1ZW5jZV9sZXZlbHNba2V5XSA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWFjdGl2ZV9zZXF1ZW5jZXMpIHtcbiAgICAgICAgICAgIF9pbnNpZGVfc2VxdWVuY2UgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGZpbmRzIGFsbCBjYWxsYmFja3MgdGhhdCBtYXRjaCBiYXNlZCBvbiB0aGUga2V5Y29kZSwgbW9kaWZpZXJzLFxuICAgICAqIGFuZCBhY3Rpb25cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjaGFyYWN0ZXJcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBtb2RpZmllcnNcbiAgICAgKiBAcGFyYW0ge0V2ZW50fE9iamVjdH0gZVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbj19IHJlbW92ZSAtIHNob3VsZCB3ZSByZW1vdmUgYW55IG1hdGNoZXNcbiAgICAgKiBAcGFyYW0ge3N0cmluZz19IGNvbWJpbmF0aW9uXG4gICAgICogQHJldHVybnMge0FycmF5fVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9nZXRNYXRjaGVzKGNoYXJhY3RlciwgbW9kaWZpZXJzLCBlLCByZW1vdmUsIGNvbWJpbmF0aW9uKSB7XG4gICAgICAgIHZhciBpLFxuICAgICAgICAgICAgY2FsbGJhY2ssXG4gICAgICAgICAgICBtYXRjaGVzID0gW10sXG4gICAgICAgICAgICBhY3Rpb24gPSBlLnR5cGU7XG5cbiAgICAgICAgLy8gaWYgdGhlcmUgYXJlIG5vIGV2ZW50cyByZWxhdGVkIHRvIHRoaXMga2V5Y29kZVxuICAgICAgICBpZiAoIV9jYWxsYmFja3NbY2hhcmFjdGVyXSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgYSBtb2RpZmllciBrZXkgaXMgY29taW5nIHVwIG9uIGl0cyBvd24gd2Ugc2hvdWxkIGFsbG93IGl0XG4gICAgICAgIGlmIChhY3Rpb24gPT0gJ2tleXVwJyAmJiBfaXNNb2RpZmllcihjaGFyYWN0ZXIpKSB7XG4gICAgICAgICAgICBtb2RpZmllcnMgPSBbY2hhcmFjdGVyXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGxvb3AgdGhyb3VnaCBhbGwgY2FsbGJhY2tzIGZvciB0aGUga2V5IHRoYXQgd2FzIHByZXNzZWRcbiAgICAgICAgLy8gYW5kIHNlZSBpZiBhbnkgb2YgdGhlbSBtYXRjaFxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgX2NhbGxiYWNrc1tjaGFyYWN0ZXJdLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBjYWxsYmFjayA9IF9jYWxsYmFja3NbY2hhcmFjdGVyXVtpXTtcblxuICAgICAgICAgICAgLy8gaWYgdGhpcyBpcyBhIHNlcXVlbmNlIGJ1dCBpdCBpcyBub3QgYXQgdGhlIHJpZ2h0IGxldmVsXG4gICAgICAgICAgICAvLyB0aGVuIG1vdmUgb250byB0aGUgbmV4dCBtYXRjaFxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrLnNlcSAmJiBfc2VxdWVuY2VfbGV2ZWxzW2NhbGxiYWNrLnNlcV0gIT0gY2FsbGJhY2subGV2ZWwpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gaWYgdGhlIGFjdGlvbiB3ZSBhcmUgbG9va2luZyBmb3IgZG9lc24ndCBtYXRjaCB0aGUgYWN0aW9uIHdlIGdvdFxuICAgICAgICAgICAgLy8gdGhlbiB3ZSBzaG91bGQga2VlcCBnb2luZ1xuICAgICAgICAgICAgaWYgKGFjdGlvbiAhPSBjYWxsYmFjay5hY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gaWYgdGhpcyBpcyBhIGtleXByZXNzIGV2ZW50IGFuZCB0aGUgbWV0YSBrZXkgYW5kIGNvbnRyb2wga2V5XG4gICAgICAgICAgICAvLyBhcmUgbm90IHByZXNzZWQgdGhhdCBtZWFucyB0aGF0IHdlIG5lZWQgdG8gb25seSBsb29rIGF0IHRoZVxuICAgICAgICAgICAgLy8gY2hhcmFjdGVyLCBvdGhlcndpc2UgY2hlY2sgdGhlIG1vZGlmaWVycyBhcyB3ZWxsXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gY2hyb21lIHdpbGwgbm90IGZpcmUgYSBrZXlwcmVzcyBpZiBtZXRhIG9yIGNvbnRyb2wgaXMgZG93blxuICAgICAgICAgICAgLy8gc2FmYXJpIHdpbGwgZmlyZSBhIGtleXByZXNzIGlmIG1ldGEgb3IgbWV0YStzaGlmdCBpcyBkb3duXG4gICAgICAgICAgICAvLyBmaXJlZm94IHdpbGwgZmlyZSBhIGtleXByZXNzIGlmIG1ldGEgb3IgY29udHJvbCBpcyBkb3duXG4gICAgICAgICAgICBpZiAoKGFjdGlvbiA9PSAna2V5cHJlc3MnICYmICFlLm1ldGFLZXkgJiYgIWUuY3RybEtleSkgfHwgX21vZGlmaWVyc01hdGNoKG1vZGlmaWVycywgY2FsbGJhY2subW9kaWZpZXJzKSkge1xuXG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGlzIHVzZWQgc28gaWYgeW91IGNoYW5nZSB5b3VyIG1pbmQgYW5kIGNhbGwgYmluZCBhXG4gICAgICAgICAgICAgICAgLy8gc2Vjb25kIHRpbWUgd2l0aCBhIG5ldyBmdW5jdGlvbiB0aGUgZmlyc3Qgb25lIGlzIG92ZXJ3cml0dGVuXG4gICAgICAgICAgICAgICAgaWYgKHJlbW92ZSAmJiBjYWxsYmFjay5jb21ibyA9PSBjb21iaW5hdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBfY2FsbGJhY2tzW2NoYXJhY3Rlcl0uc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIG1hdGNoZXMucHVzaChjYWxsYmFjayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbWF0Y2hlcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB0YWtlcyBhIGtleSBldmVudCBhbmQgZmlndXJlcyBvdXQgd2hhdCB0aGUgbW9kaWZpZXJzIGFyZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtFdmVudH0gZVxuICAgICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfZXZlbnRNb2RpZmllcnMoZSkge1xuICAgICAgICB2YXIgbW9kaWZpZXJzID0gW107XG5cbiAgICAgICAgaWYgKGUuc2hpZnRLZXkpIHtcbiAgICAgICAgICAgIG1vZGlmaWVycy5wdXNoKCdzaGlmdCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGUuYWx0S2V5KSB7XG4gICAgICAgICAgICBtb2RpZmllcnMucHVzaCgnYWx0Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZS5jdHJsS2V5KSB7XG4gICAgICAgICAgICBtb2RpZmllcnMucHVzaCgnY3RybCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGUubWV0YUtleSkge1xuICAgICAgICAgICAgbW9kaWZpZXJzLnB1c2goJ21ldGEnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtb2RpZmllcnM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYWN0dWFsbHkgY2FsbHMgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgICpcbiAgICAgKiBpZiB5b3VyIGNhbGxiYWNrIGZ1bmN0aW9uIHJldHVybnMgZmFsc2UgdGhpcyB3aWxsIHVzZSB0aGUganF1ZXJ5XG4gICAgICogY29udmVudGlvbiAtIHByZXZlbnQgZGVmYXVsdCBhbmQgc3RvcCBwcm9wb2dhdGlvbiBvbiB0aGUgZXZlbnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAgICogQHBhcmFtIHtFdmVudH0gZVxuICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfZmlyZUNhbGxiYWNrKGNhbGxiYWNrLCBlKSB7XG4gICAgICAgIGlmIChjYWxsYmFjayhlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGlmIChlLnByZXZlbnREZWZhdWx0KSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZS5zdG9wUHJvcGFnYXRpb24pIHtcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBlLnJldHVyblZhbHVlID0gZmFsc2U7XG4gICAgICAgICAgICBlLmNhbmNlbEJ1YmJsZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBoYW5kbGVzIGEgY2hhcmFjdGVyIGtleSBldmVudFxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNoYXJhY3RlclxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGVcbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgZnVuY3Rpb24gX2hhbmRsZUNoYXJhY3RlcihjaGFyYWN0ZXIsIGUpIHtcblxuICAgICAgICAvLyBpZiB0aGlzIGV2ZW50IHNob3VsZCBub3QgaGFwcGVuIHN0b3AgaGVyZVxuICAgICAgICBpZiAoTW91c2V0cmFwLnN0b3BDYWxsYmFjayhlLCBlLnRhcmdldCB8fCBlLnNyY0VsZW1lbnQpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY2FsbGJhY2tzID0gX2dldE1hdGNoZXMoY2hhcmFjdGVyLCBfZXZlbnRNb2RpZmllcnMoZSksIGUpLFxuICAgICAgICAgICAgaSxcbiAgICAgICAgICAgIGRvX25vdF9yZXNldCA9IHt9LFxuICAgICAgICAgICAgcHJvY2Vzc2VkX3NlcXVlbmNlX2NhbGxiYWNrID0gZmFsc2U7XG5cbiAgICAgICAgLy8gbG9vcCB0aHJvdWdoIG1hdGNoaW5nIGNhbGxiYWNrcyBmb3IgdGhpcyBrZXkgZXZlbnRcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7ICsraSkge1xuXG4gICAgICAgICAgICAvLyBmaXJlIGZvciBhbGwgc2VxdWVuY2UgY2FsbGJhY2tzXG4gICAgICAgICAgICAvLyB0aGlzIGlzIGJlY2F1c2UgaWYgZm9yIGV4YW1wbGUgeW91IGhhdmUgbXVsdGlwbGUgc2VxdWVuY2VzXG4gICAgICAgICAgICAvLyBib3VuZCBzdWNoIGFzIFwiZyBpXCIgYW5kIFwiZyB0XCIgdGhleSBib3RoIG5lZWQgdG8gZmlyZSB0aGVcbiAgICAgICAgICAgIC8vIGNhbGxiYWNrIGZvciBtYXRjaGluZyBnIGNhdXNlIG90aGVyd2lzZSB5b3UgY2FuIG9ubHkgZXZlclxuICAgICAgICAgICAgLy8gbWF0Y2ggdGhlIGZpcnN0IG9uZVxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrc1tpXS5zZXEpIHtcbiAgICAgICAgICAgICAgICBwcm9jZXNzZWRfc2VxdWVuY2VfY2FsbGJhY2sgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgLy8ga2VlcCBhIGxpc3Qgb2Ygd2hpY2ggc2VxdWVuY2VzIHdlcmUgbWF0Y2hlcyBmb3IgbGF0ZXJcbiAgICAgICAgICAgICAgICBkb19ub3RfcmVzZXRbY2FsbGJhY2tzW2ldLnNlcV0gPSAxO1xuICAgICAgICAgICAgICAgIF9maXJlQ2FsbGJhY2soY2FsbGJhY2tzW2ldLmNhbGxiYWNrLCBlKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gaWYgdGhlcmUgd2VyZSBubyBzZXF1ZW5jZSBtYXRjaGVzIGJ1dCB3ZSBhcmUgc3RpbGwgaGVyZVxuICAgICAgICAgICAgLy8gdGhhdCBtZWFucyB0aGlzIGlzIGEgcmVndWxhciBtYXRjaCBzbyB3ZSBzaG91bGQgZmlyZSB0aGF0XG4gICAgICAgICAgICBpZiAoIXByb2Nlc3NlZF9zZXF1ZW5jZV9jYWxsYmFjayAmJiAhX2luc2lkZV9zZXF1ZW5jZSkge1xuICAgICAgICAgICAgICAgIF9maXJlQ2FsbGJhY2soY2FsbGJhY2tzW2ldLmNhbGxiYWNrLCBlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIHlvdSBhcmUgaW5zaWRlIG9mIGEgc2VxdWVuY2UgYW5kIHRoZSBrZXkgeW91IGFyZSBwcmVzc2luZ1xuICAgICAgICAvLyBpcyBub3QgYSBtb2RpZmllciBrZXkgdGhlbiB3ZSBzaG91bGQgcmVzZXQgYWxsIHNlcXVlbmNlc1xuICAgICAgICAvLyB0aGF0IHdlcmUgbm90IG1hdGNoZWQgYnkgdGhpcyBrZXkgZXZlbnRcbiAgICAgICAgaWYgKGUudHlwZSA9PSBfaW5zaWRlX3NlcXVlbmNlICYmICFfaXNNb2RpZmllcihjaGFyYWN0ZXIpKSB7XG4gICAgICAgICAgICBfcmVzZXRTZXF1ZW5jZXMoZG9fbm90X3Jlc2V0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGhhbmRsZXMgYSBrZXlkb3duIGV2ZW50XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBlXG4gICAgICogQHJldHVybnMgdm9pZFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9oYW5kbGVLZXkoZSkge1xuXG4gICAgICAgIC8vIG5vcm1hbGl6ZSBlLndoaWNoIGZvciBrZXkgZXZlbnRzXG4gICAgICAgIC8vIEBzZWUgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80Mjg1NjI3L2phdmFzY3JpcHQta2V5Y29kZS12cy1jaGFyY29kZS11dHRlci1jb25mdXNpb25cbiAgICAgICAgZS53aGljaCA9IHR5cGVvZiBlLndoaWNoID09IFwibnVtYmVyXCIgPyBlLndoaWNoIDogZS5rZXlDb2RlO1xuXG4gICAgICAgIHZhciBjaGFyYWN0ZXIgPSBfY2hhcmFjdGVyRnJvbUV2ZW50KGUpO1xuXG4gICAgICAgIC8vIG5vIGNoYXJhY3RlciBmb3VuZCB0aGVuIHN0b3BcbiAgICAgICAgaWYgKCFjaGFyYWN0ZXIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlLnR5cGUgPT0gJ2tleXVwJyAmJiBfaWdub3JlX25leHRfa2V5dXAgPT0gY2hhcmFjdGVyKSB7XG4gICAgICAgICAgICBfaWdub3JlX25leHRfa2V5dXAgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIF9oYW5kbGVDaGFyYWN0ZXIoY2hhcmFjdGVyLCBlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBkZXRlcm1pbmVzIGlmIHRoZSBrZXljb2RlIHNwZWNpZmllZCBpcyBhIG1vZGlmaWVyIGtleSBvciBub3RcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfaXNNb2RpZmllcihrZXkpIHtcbiAgICAgICAgcmV0dXJuIGtleSA9PSAnc2hpZnQnIHx8IGtleSA9PSAnY3RybCcgfHwga2V5ID09ICdhbHQnIHx8IGtleSA9PSAnbWV0YSc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY2FsbGVkIHRvIHNldCBhIDEgc2Vjb25kIHRpbWVvdXQgb24gdGhlIHNwZWNpZmllZCBzZXF1ZW5jZVxuICAgICAqXG4gICAgICogdGhpcyBpcyBzbyBhZnRlciBlYWNoIGtleSBwcmVzcyBpbiB0aGUgc2VxdWVuY2UgeW91IGhhdmUgMSBzZWNvbmRcbiAgICAgKiB0byBwcmVzcyB0aGUgbmV4dCBrZXkgYmVmb3JlIHlvdSBoYXZlIHRvIHN0YXJ0IG92ZXJcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfcmVzZXRTZXF1ZW5jZVRpbWVyKCkge1xuICAgICAgICBjbGVhclRpbWVvdXQoX3Jlc2V0X3RpbWVyKTtcbiAgICAgICAgX3Jlc2V0X3RpbWVyID0gc2V0VGltZW91dChfcmVzZXRTZXF1ZW5jZXMsIDEwMDApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldmVyc2VzIHRoZSBtYXAgbG9va3VwIHNvIHRoYXQgd2UgY2FuIGxvb2sgZm9yIHNwZWNpZmljIGtleXNcbiAgICAgKiB0byBzZWUgd2hhdCBjYW4gYW5kIGNhbid0IHVzZSBrZXlwcmVzc1xuICAgICAqXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9nZXRSZXZlcnNlTWFwKCkge1xuICAgICAgICBpZiAoIV9SRVZFUlNFX01BUCkge1xuICAgICAgICAgICAgX1JFVkVSU0VfTUFQID0ge307XG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gX01BUCkge1xuXG4gICAgICAgICAgICAgICAgLy8gcHVsbCBvdXQgdGhlIG51bWVyaWMga2V5cGFkIGZyb20gaGVyZSBjYXVzZSBrZXlwcmVzcyBzaG91bGRcbiAgICAgICAgICAgICAgICAvLyBiZSBhYmxlIHRvIGRldGVjdCB0aGUga2V5cyBmcm9tIHRoZSBjaGFyYWN0ZXJcbiAgICAgICAgICAgICAgICBpZiAoa2V5ID4gOTUgJiYga2V5IDwgMTEyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChfTUFQLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgX1JFVkVSU0VfTUFQW19NQVBba2V5XV0gPSBrZXk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfUkVWRVJTRV9NQVA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcGlja3MgdGhlIGJlc3QgYWN0aW9uIGJhc2VkIG9uIHRoZSBrZXkgY29tYmluYXRpb25cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgLSBjaGFyYWN0ZXIgZm9yIGtleVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IG1vZGlmaWVyc1xuICAgICAqIEBwYXJhbSB7c3RyaW5nPX0gYWN0aW9uIHBhc3NlZCBpblxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9waWNrQmVzdEFjdGlvbihrZXksIG1vZGlmaWVycywgYWN0aW9uKSB7XG5cbiAgICAgICAgLy8gaWYgbm8gYWN0aW9uIHdhcyBwaWNrZWQgaW4gd2Ugc2hvdWxkIHRyeSB0byBwaWNrIHRoZSBvbmVcbiAgICAgICAgLy8gdGhhdCB3ZSB0aGluayB3b3VsZCB3b3JrIGJlc3QgZm9yIHRoaXMga2V5XG4gICAgICAgIGlmICghYWN0aW9uKSB7XG4gICAgICAgICAgICBhY3Rpb24gPSBfZ2V0UmV2ZXJzZU1hcCgpW2tleV0gPyAna2V5ZG93bicgOiAna2V5cHJlc3MnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbW9kaWZpZXIga2V5cyBkb24ndCB3b3JrIGFzIGV4cGVjdGVkIHdpdGgga2V5cHJlc3MsXG4gICAgICAgIC8vIHN3aXRjaCB0byBrZXlkb3duXG4gICAgICAgIGlmIChhY3Rpb24gPT0gJ2tleXByZXNzJyAmJiBtb2RpZmllcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICBhY3Rpb24gPSAna2V5ZG93bic7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGJpbmRzIGEga2V5IHNlcXVlbmNlIHRvIGFuIGV2ZW50XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY29tYm8gLSBjb21ibyBzcGVjaWZpZWQgaW4gYmluZCBjYWxsXG4gICAgICogQHBhcmFtIHtBcnJheX0ga2V5c1xuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAgICogQHBhcmFtIHtzdHJpbmc9fSBhY3Rpb25cbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgZnVuY3Rpb24gX2JpbmRTZXF1ZW5jZShjb21ibywga2V5cywgY2FsbGJhY2ssIGFjdGlvbikge1xuXG4gICAgICAgIC8vIHN0YXJ0IG9mZiBieSBhZGRpbmcgYSBzZXF1ZW5jZSBsZXZlbCByZWNvcmQgZm9yIHRoaXMgY29tYmluYXRpb25cbiAgICAgICAgLy8gYW5kIHNldHRpbmcgdGhlIGxldmVsIHRvIDBcbiAgICAgICAgX3NlcXVlbmNlX2xldmVsc1tjb21ib10gPSAwO1xuXG4gICAgICAgIC8vIGlmIHRoZXJlIGlzIG5vIGFjdGlvbiBwaWNrIHRoZSBiZXN0IG9uZSBmb3IgdGhlIGZpcnN0IGtleVxuICAgICAgICAvLyBpbiB0aGUgc2VxdWVuY2VcbiAgICAgICAgaWYgKCFhY3Rpb24pIHtcbiAgICAgICAgICAgIGFjdGlvbiA9IF9waWNrQmVzdEFjdGlvbihrZXlzWzBdLCBbXSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogY2FsbGJhY2sgdG8gaW5jcmVhc2UgdGhlIHNlcXVlbmNlIGxldmVsIGZvciB0aGlzIHNlcXVlbmNlIGFuZCByZXNldFxuICAgICAgICAgKiBhbGwgb3RoZXIgc2VxdWVuY2VzIHRoYXQgd2VyZSBhY3RpdmVcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtFdmVudH0gZVxuICAgICAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgX2luY3JlYXNlU2VxdWVuY2UgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgX2luc2lkZV9zZXF1ZW5jZSA9IGFjdGlvbjtcbiAgICAgICAgICAgICAgICArK19zZXF1ZW5jZV9sZXZlbHNbY29tYm9dO1xuICAgICAgICAgICAgICAgIF9yZXNldFNlcXVlbmNlVGltZXIoKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogd3JhcHMgdGhlIHNwZWNpZmllZCBjYWxsYmFjayBpbnNpZGUgb2YgYW5vdGhlciBmdW5jdGlvbiBpbiBvcmRlclxuICAgICAgICAgICAgICogdG8gcmVzZXQgYWxsIHNlcXVlbmNlIGNvdW50ZXJzIGFzIHNvb24gYXMgdGhpcyBzZXF1ZW5jZSBpcyBkb25lXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogQHBhcmFtIHtFdmVudH0gZVxuICAgICAgICAgICAgICogQHJldHVybnMgdm9pZFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBfY2FsbGJhY2tBbmRSZXNldCA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBfZmlyZUNhbGxiYWNrKGNhbGxiYWNrLCBlKTtcblxuICAgICAgICAgICAgICAgIC8vIHdlIHNob3VsZCBpZ25vcmUgdGhlIG5leHQga2V5IHVwIGlmIHRoZSBhY3Rpb24gaXMga2V5IGRvd25cbiAgICAgICAgICAgICAgICAvLyBvciBrZXlwcmVzcy4gIHRoaXMgaXMgc28gaWYgeW91IGZpbmlzaCBhIHNlcXVlbmNlIGFuZFxuICAgICAgICAgICAgICAgIC8vIHJlbGVhc2UgdGhlIGtleSB0aGUgZmluYWwga2V5IHdpbGwgbm90IHRyaWdnZXIgYSBrZXl1cFxuICAgICAgICAgICAgICAgIGlmIChhY3Rpb24gIT09ICdrZXl1cCcpIHtcbiAgICAgICAgICAgICAgICAgICAgX2lnbm9yZV9uZXh0X2tleXVwID0gX2NoYXJhY3RlckZyb21FdmVudChlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyB3ZWlyZCByYWNlIGNvbmRpdGlvbiBpZiBhIHNlcXVlbmNlIGVuZHMgd2l0aCB0aGUga2V5XG4gICAgICAgICAgICAgICAgLy8gYW5vdGhlciBzZXF1ZW5jZSBiZWdpbnMgd2l0aFxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoX3Jlc2V0U2VxdWVuY2VzLCAxMCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaTtcblxuICAgICAgICAvLyBsb29wIHRocm91Z2gga2V5cyBvbmUgYXQgYSB0aW1lIGFuZCBiaW5kIHRoZSBhcHByb3ByaWF0ZSBjYWxsYmFja1xuICAgICAgICAvLyBmdW5jdGlvbi4gIGZvciBhbnkga2V5IGxlYWRpbmcgdXAgdG8gdGhlIGZpbmFsIG9uZSBpdCBzaG91bGRcbiAgICAgICAgLy8gaW5jcmVhc2UgdGhlIHNlcXVlbmNlLiBhZnRlciB0aGUgZmluYWwsIGl0IHNob3VsZCByZXNldCBhbGwgc2VxdWVuY2VzXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBfYmluZFNpbmdsZShrZXlzW2ldLCBpIDwga2V5cy5sZW5ndGggLSAxID8gX2luY3JlYXNlU2VxdWVuY2UgOiBfY2FsbGJhY2tBbmRSZXNldCwgYWN0aW9uLCBjb21ibywgaSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBiaW5kcyBhIHNpbmdsZSBrZXlib2FyZCBjb21iaW5hdGlvblxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNvbWJpbmF0aW9uXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICAgKiBAcGFyYW0ge3N0cmluZz19IGFjdGlvblxuICAgICAqIEBwYXJhbSB7c3RyaW5nPX0gc2VxdWVuY2VfbmFtZSAtIG5hbWUgb2Ygc2VxdWVuY2UgaWYgcGFydCBvZiBzZXF1ZW5jZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyPX0gbGV2ZWwgLSB3aGF0IHBhcnQgb2YgdGhlIHNlcXVlbmNlIHRoZSBjb21tYW5kIGlzXG4gICAgICogQHJldHVybnMgdm9pZFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9iaW5kU2luZ2xlKGNvbWJpbmF0aW9uLCBjYWxsYmFjaywgYWN0aW9uLCBzZXF1ZW5jZV9uYW1lLCBsZXZlbCkge1xuXG4gICAgICAgIC8vIG1ha2Ugc3VyZSBtdWx0aXBsZSBzcGFjZXMgaW4gYSByb3cgYmVjb21lIGEgc2luZ2xlIHNwYWNlXG4gICAgICAgIGNvbWJpbmF0aW9uID0gY29tYmluYXRpb24ucmVwbGFjZSgvXFxzKy9nLCAnICcpO1xuXG4gICAgICAgIHZhciBzZXF1ZW5jZSA9IGNvbWJpbmF0aW9uLnNwbGl0KCcgJyksXG4gICAgICAgICAgICBpLFxuICAgICAgICAgICAga2V5LFxuICAgICAgICAgICAga2V5cyxcbiAgICAgICAgICAgIG1vZGlmaWVycyA9IFtdO1xuXG4gICAgICAgIC8vIGlmIHRoaXMgcGF0dGVybiBpcyBhIHNlcXVlbmNlIG9mIGtleXMgdGhlbiBydW4gdGhyb3VnaCB0aGlzIG1ldGhvZFxuICAgICAgICAvLyB0byByZXByb2Nlc3MgZWFjaCBwYXR0ZXJuIG9uZSBrZXkgYXQgYSB0aW1lXG4gICAgICAgIGlmIChzZXF1ZW5jZS5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICBfYmluZFNlcXVlbmNlKGNvbWJpbmF0aW9uLCBzZXF1ZW5jZSwgY2FsbGJhY2ssIGFjdGlvbik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyB0YWtlIHRoZSBrZXlzIGZyb20gdGhpcyBwYXR0ZXJuIGFuZCBmaWd1cmUgb3V0IHdoYXQgdGhlIGFjdHVhbFxuICAgICAgICAvLyBwYXR0ZXJuIGlzIGFsbCBhYm91dFxuICAgICAgICBrZXlzID0gY29tYmluYXRpb24gPT09ICcrJyA/IFsnKyddIDogY29tYmluYXRpb24uc3BsaXQoJysnKTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAga2V5ID0ga2V5c1tpXTtcblxuICAgICAgICAgICAgLy8gbm9ybWFsaXplIGtleSBuYW1lc1xuICAgICAgICAgICAgaWYgKF9TUEVDSUFMX0FMSUFTRVNba2V5XSkge1xuICAgICAgICAgICAgICAgIGtleSA9IF9TUEVDSUFMX0FMSUFTRVNba2V5XTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gaWYgdGhpcyBpcyBub3QgYSBrZXlwcmVzcyBldmVudCB0aGVuIHdlIHNob3VsZFxuICAgICAgICAgICAgLy8gYmUgc21hcnQgYWJvdXQgdXNpbmcgc2hpZnQga2V5c1xuICAgICAgICAgICAgLy8gdGhpcyB3aWxsIG9ubHkgd29yayBmb3IgVVMga2V5Ym9hcmRzIGhvd2V2ZXJcbiAgICAgICAgICAgIGlmIChhY3Rpb24gJiYgYWN0aW9uICE9ICdrZXlwcmVzcycgJiYgX1NISUZUX01BUFtrZXldKSB7XG4gICAgICAgICAgICAgICAga2V5ID0gX1NISUZUX01BUFtrZXldO1xuICAgICAgICAgICAgICAgIG1vZGlmaWVycy5wdXNoKCdzaGlmdCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBpZiB0aGlzIGtleSBpcyBhIG1vZGlmaWVyIHRoZW4gYWRkIGl0IHRvIHRoZSBsaXN0IG9mIG1vZGlmaWVyc1xuICAgICAgICAgICAgaWYgKF9pc01vZGlmaWVyKGtleSkpIHtcbiAgICAgICAgICAgICAgICBtb2RpZmllcnMucHVzaChrZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gZGVwZW5kaW5nIG9uIHdoYXQgdGhlIGtleSBjb21iaW5hdGlvbiBpc1xuICAgICAgICAvLyB3ZSB3aWxsIHRyeSB0byBwaWNrIHRoZSBiZXN0IGV2ZW50IGZvciBpdFxuICAgICAgICBhY3Rpb24gPSBfcGlja0Jlc3RBY3Rpb24oa2V5LCBtb2RpZmllcnMsIGFjdGlvbik7XG5cbiAgICAgICAgLy8gbWFrZSBzdXJlIHRvIGluaXRpYWxpemUgYXJyYXkgaWYgdGhpcyBpcyB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyBhIGNhbGxiYWNrIGlzIGFkZGVkIGZvciB0aGlzIGtleVxuICAgICAgICBpZiAoIV9jYWxsYmFja3Nba2V5XSkge1xuICAgICAgICAgICAgX2NhbGxiYWNrc1trZXldID0gW107XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZW1vdmUgYW4gZXhpc3RpbmcgbWF0Y2ggaWYgdGhlcmUgaXMgb25lXG4gICAgICAgIF9nZXRNYXRjaGVzKGtleSwgbW9kaWZpZXJzLCB7dHlwZTogYWN0aW9ufSwgIXNlcXVlbmNlX25hbWUsIGNvbWJpbmF0aW9uKTtcblxuICAgICAgICAvLyBhZGQgdGhpcyBjYWxsIGJhY2sgdG8gdGhlIGFycmF5XG4gICAgICAgIC8vIGlmIGl0IGlzIGEgc2VxdWVuY2UgcHV0IGl0IGF0IHRoZSBiZWdpbm5pbmdcbiAgICAgICAgLy8gaWYgbm90IHB1dCBpdCBhdCB0aGUgZW5kXG4gICAgICAgIC8vXG4gICAgICAgIC8vIHRoaXMgaXMgaW1wb3J0YW50IGJlY2F1c2UgdGhlIHdheSB0aGVzZSBhcmUgcHJvY2Vzc2VkIGV4cGVjdHNcbiAgICAgICAgLy8gdGhlIHNlcXVlbmNlIG9uZXMgdG8gY29tZSBmaXJzdFxuICAgICAgICBfY2FsbGJhY2tzW2tleV1bc2VxdWVuY2VfbmFtZSA/ICd1bnNoaWZ0JyA6ICdwdXNoJ10oe1xuICAgICAgICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrLFxuICAgICAgICAgICAgbW9kaWZpZXJzOiBtb2RpZmllcnMsXG4gICAgICAgICAgICBhY3Rpb246IGFjdGlvbixcbiAgICAgICAgICAgIHNlcTogc2VxdWVuY2VfbmFtZSxcbiAgICAgICAgICAgIGxldmVsOiBsZXZlbCxcbiAgICAgICAgICAgIGNvbWJvOiBjb21iaW5hdGlvblxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBiaW5kcyBtdWx0aXBsZSBjb21iaW5hdGlvbnMgdG8gdGhlIHNhbWUgY2FsbGJhY2tcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGNvbWJpbmF0aW9uc1xuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAgICogQHBhcmFtIHtzdHJpbmd8dW5kZWZpbmVkfSBhY3Rpb25cbiAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICovXG4gICAgZnVuY3Rpb24gX2JpbmRNdWx0aXBsZShjb21iaW5hdGlvbnMsIGNhbGxiYWNrLCBhY3Rpb24pIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb21iaW5hdGlvbnMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIF9iaW5kU2luZ2xlKGNvbWJpbmF0aW9uc1tpXSwgY2FsbGJhY2ssIGFjdGlvbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBzdGFydCFcbiAgICBfYWRkRXZlbnQoZG9jdW1lbnQsICdrZXlwcmVzcycsIF9oYW5kbGVLZXkpO1xuICAgIF9hZGRFdmVudChkb2N1bWVudCwgJ2tleWRvd24nLCBfaGFuZGxlS2V5KTtcbiAgICBfYWRkRXZlbnQoZG9jdW1lbnQsICdrZXl1cCcsIF9oYW5kbGVLZXkpO1xuXG4gICAgdmFyIE1vdXNldHJhcCA9IHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogYmluZHMgYW4gZXZlbnQgdG8gbW91c2V0cmFwXG4gICAgICAgICAqXG4gICAgICAgICAqIGNhbiBiZSBhIHNpbmdsZSBrZXksIGEgY29tYmluYXRpb24gb2Yga2V5cyBzZXBhcmF0ZWQgd2l0aCArLFxuICAgICAgICAgKiBhbiBhcnJheSBvZiBrZXlzLCBvciBhIHNlcXVlbmNlIG9mIGtleXMgc2VwYXJhdGVkIGJ5IHNwYWNlc1xuICAgICAgICAgKlxuICAgICAgICAgKiBiZSBzdXJlIHRvIGxpc3QgdGhlIG1vZGlmaWVyIGtleXMgZmlyc3QgdG8gbWFrZSBzdXJlIHRoYXQgdGhlXG4gICAgICAgICAqIGNvcnJlY3Qga2V5IGVuZHMgdXAgZ2V0dGluZyBib3VuZCAodGhlIGxhc3Qga2V5IGluIHRoZSBwYXR0ZXJuKVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ3xBcnJheX0ga2V5c1xuICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZz19IGFjdGlvbiAtICdrZXlwcmVzcycsICdrZXlkb3duJywgb3IgJ2tleXVwJ1xuICAgICAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICAgICAqL1xuICAgICAgICBiaW5kOiBmdW5jdGlvbihrZXlzLCBjYWxsYmFjaywgYWN0aW9uKSB7XG4gICAgICAgICAgICBfYmluZE11bHRpcGxlKGtleXMgaW5zdGFuY2VvZiBBcnJheSA/IGtleXMgOiBba2V5c10sIGNhbGxiYWNrLCBhY3Rpb24pO1xuICAgICAgICAgICAgX2RpcmVjdF9tYXBba2V5cyArICc6JyArIGFjdGlvbl0gPSBjYWxsYmFjaztcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiB1bmJpbmRzIGFuIGV2ZW50IHRvIG1vdXNldHJhcFxuICAgICAgICAgKlxuICAgICAgICAgKiB0aGUgdW5iaW5kaW5nIHNldHMgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uIG9mIHRoZSBzcGVjaWZpZWQga2V5IGNvbWJvXG4gICAgICAgICAqIHRvIGFuIGVtcHR5IGZ1bmN0aW9uIGFuZCBkZWxldGVzIHRoZSBjb3JyZXNwb25kaW5nIGtleSBpbiB0aGVcbiAgICAgICAgICogX2RpcmVjdF9tYXAgZGljdC5cbiAgICAgICAgICpcbiAgICAgICAgICogdGhlIGtleWNvbWJvK2FjdGlvbiBoYXMgdG8gYmUgZXhhY3RseSB0aGUgc2FtZSBhc1xuICAgICAgICAgKiBpdCB3YXMgZGVmaW5lZCBpbiB0aGUgYmluZCBtZXRob2RcbiAgICAgICAgICpcbiAgICAgICAgICogVE9ETzogYWN0dWFsbHkgcmVtb3ZlIHRoaXMgZnJvbSB0aGUgX2NhbGxiYWNrcyBkaWN0aW9uYXJ5IGluc3RlYWRcbiAgICAgICAgICogb2YgYmluZGluZyBhbiBlbXB0eSBmdW5jdGlvblxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ3xBcnJheX0ga2V5c1xuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gYWN0aW9uXG4gICAgICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgICAgICovXG4gICAgICAgIHVuYmluZDogZnVuY3Rpb24oa2V5cywgYWN0aW9uKSB7XG4gICAgICAgICAgICBpZiAoX2RpcmVjdF9tYXBba2V5cyArICc6JyArIGFjdGlvbl0pIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgX2RpcmVjdF9tYXBba2V5cyArICc6JyArIGFjdGlvbl07XG4gICAgICAgICAgICAgICAgdGhpcy5iaW5kKGtleXMsIGZ1bmN0aW9uKCkge30sIGFjdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogdHJpZ2dlcnMgYW4gZXZlbnQgdGhhdCBoYXMgYWxyZWFkeSBiZWVuIGJvdW5kXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXlzXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nPX0gYWN0aW9uXG4gICAgICAgICAqIEByZXR1cm5zIHZvaWRcbiAgICAgICAgICovXG4gICAgICAgIHRyaWdnZXI6IGZ1bmN0aW9uKGtleXMsIGFjdGlvbikge1xuICAgICAgICAgICAgX2RpcmVjdF9tYXBba2V5cyArICc6JyArIGFjdGlvbl0oKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiByZXNldHMgdGhlIGxpYnJhcnkgYmFjayB0byBpdHMgaW5pdGlhbCBzdGF0ZS4gIHRoaXMgaXMgdXNlZnVsXG4gICAgICAgICAqIGlmIHlvdSB3YW50IHRvIGNsZWFyIG91dCB0aGUgY3VycmVudCBrZXlib2FyZCBzaG9ydGN1dHMgYW5kIGJpbmRcbiAgICAgICAgICogbmV3IG9uZXMgLSBmb3IgZXhhbXBsZSBpZiB5b3Ugc3dpdGNoIHRvIGFub3RoZXIgcGFnZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB2b2lkXG4gICAgICAgICAqL1xuICAgICAgICByZXNldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBfY2FsbGJhY2tzID0ge307XG4gICAgICAgICAgICBfZGlyZWN0X21hcCA9IHt9O1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAvKipcbiAgICAgICAgKiBzaG91bGQgd2Ugc3RvcCB0aGlzIGV2ZW50IGJlZm9yZSBmaXJpbmcgb2ZmIGNhbGxiYWNrc1xuICAgICAgICAqXG4gICAgICAgICogQHBhcmFtIHtFdmVudH0gZVxuICAgICAgICAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudFxuICAgICAgICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAgICAgICovXG4gICAgICAgIHN0b3BDYWxsYmFjazogZnVuY3Rpb24oZSwgZWxlbWVudCkge1xuXG4gICAgICAgICAgICAvLyBpZiB0aGUgZWxlbWVudCBoYXMgdGhlIGNsYXNzIFwibW91c2V0cmFwXCIgdGhlbiBubyBuZWVkIHRvIHN0b3BcbiAgICAgICAgICAgIGlmICgoJyAnICsgZWxlbWVudC5jbGFzc05hbWUgKyAnICcpLmluZGV4T2YoJyBtb3VzZXRyYXAgJykgPiAtMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gc3RvcCBmb3IgaW5wdXQsIHNlbGVjdCwgYW5kIHRleHRhcmVhXG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudC50YWdOYW1lID09ICdJTlBVVCcgfHwgZWxlbWVudC50YWdOYW1lID09ICdTRUxFQ1QnIHx8IGVsZW1lbnQudGFnTmFtZSA9PSAnVEVYVEFSRUEnIHx8IChlbGVtZW50LmNvbnRlbnRFZGl0YWJsZSAmJiBlbGVtZW50LmNvbnRlbnRFZGl0YWJsZSA9PSAndHJ1ZScpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIGV4cG9zZSBtb3VzZXRyYXAgdG8gdGhlIGdsb2JhbCBvYmplY3RcbiAgICB3aW5kb3cuTW91c2V0cmFwID0gTW91c2V0cmFwO1xuXG4gICAgLy8gZXhwb3NlIG1vdXNldHJhcCBhcyBhbiBBTUQgbW9kdWxlXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZSgnbW91c2V0cmFwJywgZnVuY3Rpb24oKSB7IHJldHVybiBNb3VzZXRyYXA7IH0pO1xuICAgIH1cbiAgICAvLyBicm93c2VyaWZ5IHN1cHBvcnRcbiAgICBpZih0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IE1vdXNldHJhcDtcbiAgICB9XG59KSAoKTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICB2YXIgcm9vdCA9IHRoaXM7XG4gICAgdmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcblx0dmFyIF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyk7XG5cdHZhciBpbnRlcnZhbFBhcnNlciA9IC8oWzAtOVxcLl0rKShtc3xzfG18aCk/Lztcblx0dmFyIHJvb3QgPSBnbG9iYWwgfHwgd2luZG93O1xuXG5cdC8vIExpbCBiaXQgb2YgdXNlZnVsIHBvbHlmaWxsLi4uXG5cdGlmICh0eXBlb2YoRnVuY3Rpb24ucHJvdG90eXBlLmluaGVyaXRzKSA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRGdW5jdGlvbi5wcm90b3R5cGUuaW5oZXJpdHMgPSBmdW5jdGlvbihwYXJlbnQpIHtcblx0XHRcdHRoaXMucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShwYXJlbnQucHJvdG90eXBlKTtcblx0XHR9O1xuXHR9XG5cblx0aWYgKHR5cGVvZihBcnJheS5wcm90b3R5cGUucmVtb3ZlT25lKSA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRBcnJheS5wcm90b3R5cGUucmVtb3ZlT25lID0gZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgd2hhdCwgYSA9IGFyZ3VtZW50cywgTCA9IGEubGVuZ3RoLCBheDtcblx0XHRcdHdoaWxlIChMICYmIHRoaXMubGVuZ3RoKSB7XG5cdFx0XHRcdHdoYXQgPSBhWy0tTF07XG5cdFx0XHRcdHdoaWxlICgoYXggPSB0aGlzLmluZGV4T2Yod2hhdCkpICE9PSAtMSkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLnNwbGljZShheCwgMSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXHR9XG5cblx0ZnVuY3Rpb24gZ3JlYXRlc3RDb21tb25GYWN0b3IoaW50ZXJ2YWxzKSB7XG5cdFx0dmFyIHN1bU9mTW9kdWxpID0gMTtcblx0XHR2YXIgaW50ZXJ2YWwgPSBfLm1pbihpbnRlcnZhbHMpO1xuXHRcdHdoaWxlIChzdW1PZk1vZHVsaSAhPT0gMCkge1xuXHRcdFx0c3VtT2ZNb2R1bGkgPSBfLnJlZHVjZShpbnRlcnZhbHMsIGZ1bmN0aW9uKG1lbW8sIGkpeyByZXR1cm4gbWVtbyArIChpICUgaW50ZXJ2YWwpOyB9LCAwKTtcblx0XHRcdGlmIChzdW1PZk1vZHVsaSAhPT0gMCkge1xuXHRcdFx0XHRpbnRlcnZhbCAtPSAxMDtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGludGVydmFsO1xuXHR9XG5cblx0ZnVuY3Rpb24gcGFyc2VFdmVudChlKSB7XG5cdFx0dmFyIGludGVydmFsR3JvdXBzID0gaW50ZXJ2YWxQYXJzZXIuZXhlYyhlKTtcblx0XHRpZiAoIWludGVydmFsR3JvdXBzKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0kgZG9uXFwndCB1bmRlcnN0YW5kIHRoYXQgcGFydGljdWxhciBpbnRlcnZhbCcpO1xuXHRcdH1cblx0XHR2YXIgaW50ZXJ2YWxBbW91bnQgPSAraW50ZXJ2YWxHcm91cHNbMV07XG5cdFx0dmFyIGludGVydmFsVHlwZSA9IGludGVydmFsR3JvdXBzWzJdIHx8ICdtcyc7XG5cdFx0aWYgKGludGVydmFsVHlwZSA9PT0gJ3MnKSB7XG5cdFx0XHRpbnRlcnZhbEFtb3VudCA9IGludGVydmFsQW1vdW50ICogMTAwMDtcblx0XHR9IGVsc2UgaWYgKGludGVydmFsVHlwZSA9PT0gJ20nKSB7XG5cdFx0XHRpbnRlcnZhbEFtb3VudCA9IGludGVydmFsQW1vdW50ICogMTAwMCAqIDYwO1xuXHRcdH0gZWxzZSBpZiAoaW50ZXJ2YWxUeXBlID09PSAnaCcpIHtcblx0XHRcdGludGVydmFsQW1vdW50ID0gaW50ZXJ2YWxBbW91bnQgKiAxMDAwICogNjAgKiA2MDtcblx0XHR9IGVsc2UgaWYgKCEhaW50ZXJ2YWxUeXBlICYmIGludGVydmFsVHlwZSAhPT0gJ21zJykge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdZb3UgY2FuIG9ubHkgc3BlY2lmeSBpbnRlcnZhbHMgb2YgbXMsIHMsIG0sIG9yIGgnKTtcblx0XHR9XG5cdFx0aWYgKGludGVydmFsQW1vdW50IDwgMTAgfHwgaW50ZXJ2YWxBbW91bnQgJSAxMCAhPT0gMCkge1xuXHRcdFx0Ly8gV2Ugb25seSBkZWFsIGluIDEwJ3Mgb2YgbWlsbGlzZWNvbmRzIGZvciBzaW1wbGljaXR5XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ1lvdSBjYW4gb25seSBzcGVjaWZ5IDEwcyBvZiBtaWxsaXNlY29uZHMsIHRydXN0IG1lIG9uIHRoaXMgb25lJyk7XG5cdFx0fVxuXHRcdHJldHVybiB7XG5cdFx0XHRhbW91bnQ6aW50ZXJ2YWxBbW91bnQsXG5cdFx0XHR0eXBlOmludGVydmFsVHlwZVxuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiBFdmVudGVkTG9vcCgpIHtcblx0XHR0aGlzLmludGVydmFsSWQgPSB1bmRlZmluZWQ7XG5cdFx0dGhpcy5pbnRlcnZhbExlbmd0aCA9IHVuZGVmaW5lZDtcblx0XHR0aGlzLmludGVydmFsc1RvRW1pdCA9IHt9O1xuXHRcdHRoaXMuY3VycmVudFRpY2sgPSAxO1xuXHRcdHRoaXMubWF4VGlja3MgPSAwO1xuXHRcdHRoaXMubGlzdGVuaW5nRm9yRm9jdXMgPSBmYWxzZTtcblxuXHRcdC8vIFByaXZhdGUgbWV0aG9kXG5cdFx0dmFyIGRldGVybWluZUludGVydmFsTGVuZ3RoID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIHBvdGVudGlhbEludGVydmFsTGVuZ3RoID0gZ3JlYXRlc3RDb21tb25GYWN0b3IoXy5rZXlzKHRoaXMuaW50ZXJ2YWxzVG9FbWl0KSk7XG5cdFx0XHR2YXIgY2hhbmdlZCA9IGZhbHNlO1xuXG5cdFx0XHRpZiAodGhpcy5pbnRlcnZhbExlbmd0aCkge1xuXHRcdFx0XHRpZiAocG90ZW50aWFsSW50ZXJ2YWxMZW5ndGggIT09IHRoaXMuaW50ZXJ2YWxMZW5ndGgpIHtcblx0XHRcdFx0XHQvLyBMb29rcyBsaWtlIHdlIG5lZWQgYSBuZXcgaW50ZXJ2YWxcblx0XHRcdFx0XHR0aGlzLmludGVydmFsTGVuZ3RoID0gcG90ZW50aWFsSW50ZXJ2YWxMZW5ndGg7XG5cdFx0XHRcdFx0Y2hhbmdlZCA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMuaW50ZXJ2YWxMZW5ndGggPSBwb3RlbnRpYWxJbnRlcnZhbExlbmd0aDtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5tYXhUaWNrcyA9IF8ubWF4KF8ubWFwKF8ua2V5cyh0aGlzLmludGVydmFsc1RvRW1pdCksIGZ1bmN0aW9uKGEpIHsgcmV0dXJuICthOyB9KSkgLyB0aGlzLmludGVydmFsTGVuZ3RoO1xuXHRcdFx0cmV0dXJuIGNoYW5nZWQ7XG5cdFx0fS5iaW5kKHRoaXMpO1xuXG5cdFx0dGhpcy5vbignbmV3TGlzdGVuZXInLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0aWYgKGUgPT09ICdyZW1vdmVMaXN0ZW5lcicgfHwgZSA9PT0gJ25ld0xpc3RlbmVyJykgcmV0dXJuOyAvLyBXZSBkb24ndCBjYXJlIGFib3V0IHRoYXQgb25lXG5cdFx0XHR2YXIgaW50ZXJ2YWxJbmZvID0gcGFyc2VFdmVudChlKTtcblx0XHRcdHZhciBpbnRlcnZhbEFtb3VudCA9IGludGVydmFsSW5mby5hbW91bnQ7XG5cblx0XHRcdHRoaXMuaW50ZXJ2YWxzVG9FbWl0WytpbnRlcnZhbEFtb3VudF0gPSBfLnVuaW9uKHRoaXMuaW50ZXJ2YWxzVG9FbWl0WytpbnRlcnZhbEFtb3VudF0gfHwgW10sIFtlXSk7XG5cdFx0XHRcblx0XHRcdGlmIChkZXRlcm1pbmVJbnRlcnZhbExlbmd0aCgpICYmIHRoaXMuaXNTdGFydGVkKCkpIHtcblx0XHRcdFx0dGhpcy5zdG9wKCkuc3RhcnQoKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHRoaXMub24oJ3JlbW92ZUxpc3RlbmVyJywgZnVuY3Rpb24gKGUpIHtcblx0XHRcdGlmIChFdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCh0aGlzLCBlKSA+IDApIHJldHVybjtcblx0XHRcdHZhciBpbnRlcnZhbEluZm8gPSBwYXJzZUV2ZW50KGUpO1xuXHRcdFx0dmFyIGludGVydmFsQW1vdW50ID0gaW50ZXJ2YWxJbmZvLmFtb3VudDtcblxuXHRcdFx0dmFyIHJlbW92ZWRFdmVudCA9IHRoaXMuaW50ZXJ2YWxzVG9FbWl0WytpbnRlcnZhbEFtb3VudF0ucmVtb3ZlT25lKGUpO1xuXHRcdFx0aWYgKHRoaXMuaW50ZXJ2YWxzVG9FbWl0WytpbnRlcnZhbEFtb3VudF0ubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdGRlbGV0ZSB0aGlzLmludGVydmFsc1RvRW1pdFsraW50ZXJ2YWxBbW91bnRdO1xuXHRcdFx0fVxuXHRcdFx0Y29uc29sZS5sb2coJ0RldGVybWluaW5nIGludGVydmFsIGxlbmd0aCBhZnRlciByZW1vdmFsIG9mJywgcmVtb3ZlZEV2ZW50KTtcblx0XHRcdGRldGVybWluZUludGVydmFsTGVuZ3RoKCk7XG5cblx0XHRcdGlmIChkZXRlcm1pbmVJbnRlcnZhbExlbmd0aCgpICYmIHRoaXMuaXNTdGFydGVkKCkpIHtcblx0XHRcdFx0dGhpcy5zdG9wKCkuc3RhcnQoKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdEV2ZW50ZWRMb29wLmluaGVyaXRzKEV2ZW50RW1pdHRlcik7XG5cblx0Ly8gUHVibGljIG1ldGhvZHNcblx0RXZlbnRlZExvb3AucHJvdG90eXBlLnRpY2sgPSBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIG1pbGxpc2Vjb25kcyA9IHRoaXMuY3VycmVudFRpY2sgKiB0aGlzLmludGVydmFsTGVuZ3RoO1xuXHRcdF8uZWFjaCh0aGlzLmludGVydmFsc1RvRW1pdCwgZnVuY3Rpb24gKGV2ZW50cywga2V5KSB7XG5cdFx0XHRpZiAobWlsbGlzZWNvbmRzICUga2V5ID09PSAwKSB7XG5cdFx0XHRcdF8uZWFjaChldmVudHMsIGZ1bmN0aW9uKGUpIHsgdGhpcy5lbWl0KGUsIGUsIGtleSk7IH0uYmluZCh0aGlzKSk7XG5cdFx0XHR9XG5cdFx0fS5iaW5kKHRoaXMpKTtcblx0XHR0aGlzLmN1cnJlbnRUaWNrICs9IDE7XG5cdFx0aWYgKHRoaXMuY3VycmVudFRpY2sgPiB0aGlzLm1heFRpY2tzKSB7XG5cdFx0XHR0aGlzLmN1cnJlbnRUaWNrID0gMTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0RXZlbnRlZExvb3AucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuXHRcdGlmICghdGhpcy5pbnRlcnZhbExlbmd0aCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdZb3UgaGF2ZW5cXCd0IHNwZWNpZmllZCBhbnkgaW50ZXJ2YWwgY2FsbGJhY2tzLiBVc2UgRXZlbnRlZExvb3Aub24oXFwnNTAwbXNcXCcsIGZ1bmN0aW9uICgpIHsgLi4uIH0pIHRvIGRvIHNvLCBhbmQgdGhlbiB5b3UgY2FuIHN0YXJ0Jyk7XG5cdFx0fVxuXHRcdGlmICh0aGlzLmludGVydmFsSWQpIHtcblx0XHRcdHJldHVybiBjb25zb2xlLmxvZygnTm8gbmVlZCB0byBzdGFydCB0aGUgbG9vcCBhZ2FpbiwgaXRcXCdzIGFscmVhZHkgc3RhcnRlZC4nKTtcblx0XHR9XG5cblx0XHR0aGlzLmludGVydmFsSWQgPSBzZXRJbnRlcnZhbCh0aGlzLnRpY2suYmluZCh0aGlzKSwgdGhpcy5pbnRlcnZhbExlbmd0aCk7XG5cblx0XHRpZiAocm9vdCAmJiAhdGhpcy5saXN0ZW5pbmdGb3JGb2N1cyAmJiByb290LmFkZEV2ZW50TGlzdGVuZXIpIHtcblx0XHRcdHJvb3QuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0dGhpcy5zdGFydCgpO1xuXHRcdFx0fS5iaW5kKHRoaXMpKTtcblxuXHRcdFx0cm9vdC5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHRoaXMuc3RvcCgpO1xuXHRcdFx0fS5iaW5kKHRoaXMpKTtcblxuXHRcdFx0dGhpcy5saXN0ZW5pbmdGb3JGb2N1cyA9IHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzO1xuXHR9O1xuXG5cdEV2ZW50ZWRMb29wLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gKCkge1xuXHRcdGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbElkKTtcblx0XHR0aGlzLmludGVydmFsSWQgPSB1bmRlZmluZWQ7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0RXZlbnRlZExvb3AucHJvdG90eXBlLmlzU3RhcnRlZCA9IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gISF0aGlzLmludGVydmFsSWQ7XG5cdH07XG5cblx0RXZlbnRlZExvb3AucHJvdG90eXBlLmV2ZXJ5ID0gRXZlbnRlZExvb3AucHJvdG90eXBlLm9uO1xuXG4gICAgLy8gRXhwb3J0IHRoZSBFdmVudGVkTG9vcCBvYmplY3QgZm9yICoqTm9kZS5qcyoqIG9yIG90aGVyXG4gICAgLy8gY29tbW9uanMgc3lzdGVtcy4gT3RoZXJ3aXNlLCBhZGQgaXQgYXMgYSBnbG9iYWwgb2JqZWN0IHRvIHRoZSByb290XG4gICAgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IEV2ZW50ZWRMb29wO1xuICAgICAgICB9XG4gICAgICAgIGV4cG9ydHMuRXZlbnRlZExvb3AgPSBFdmVudGVkTG9vcDtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHdpbmRvdy5FdmVudGVkTG9vcCA9IEV2ZW50ZWRMb29wO1xuICAgIH1cbn0pLmNhbGwodGhpcyk7IiwiLy8gICAgIFVuZGVyc2NvcmUuanMgMS42LjBcbi8vICAgICBodHRwOi8vdW5kZXJzY29yZWpzLm9yZ1xuLy8gICAgIChjKSAyMDA5LTIwMTQgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbi8vICAgICBVbmRlcnNjb3JlIG1heSBiZSBmcmVlbHkgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuXG4oZnVuY3Rpb24oKSB7XG5cbiAgLy8gQmFzZWxpbmUgc2V0dXBcbiAgLy8gLS0tLS0tLS0tLS0tLS1cblxuICAvLyBFc3RhYmxpc2ggdGhlIHJvb3Qgb2JqZWN0LCBgd2luZG93YCBpbiB0aGUgYnJvd3Nlciwgb3IgYGV4cG9ydHNgIG9uIHRoZSBzZXJ2ZXIuXG4gIHZhciByb290ID0gdGhpcztcblxuICAvLyBTYXZlIHRoZSBwcmV2aW91cyB2YWx1ZSBvZiB0aGUgYF9gIHZhcmlhYmxlLlxuICB2YXIgcHJldmlvdXNVbmRlcnNjb3JlID0gcm9vdC5fO1xuXG4gIC8vIEVzdGFibGlzaCB0aGUgb2JqZWN0IHRoYXQgZ2V0cyByZXR1cm5lZCB0byBicmVhayBvdXQgb2YgYSBsb29wIGl0ZXJhdGlvbi5cbiAgdmFyIGJyZWFrZXIgPSB7fTtcblxuICAvLyBTYXZlIGJ5dGVzIGluIHRoZSBtaW5pZmllZCAoYnV0IG5vdCBnemlwcGVkKSB2ZXJzaW9uOlxuICB2YXIgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZSwgT2JqUHJvdG8gPSBPYmplY3QucHJvdG90eXBlLCBGdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGU7XG5cbiAgLy8gQ3JlYXRlIHF1aWNrIHJlZmVyZW5jZSB2YXJpYWJsZXMgZm9yIHNwZWVkIGFjY2VzcyB0byBjb3JlIHByb3RvdHlwZXMuXG4gIHZhclxuICAgIHB1c2ggICAgICAgICAgICAgPSBBcnJheVByb3RvLnB1c2gsXG4gICAgc2xpY2UgICAgICAgICAgICA9IEFycmF5UHJvdG8uc2xpY2UsXG4gICAgY29uY2F0ICAgICAgICAgICA9IEFycmF5UHJvdG8uY29uY2F0LFxuICAgIHRvU3RyaW5nICAgICAgICAgPSBPYmpQcm90by50b1N0cmluZyxcbiAgICBoYXNPd25Qcm9wZXJ0eSAgID0gT2JqUHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbiAgLy8gQWxsICoqRUNNQVNjcmlwdCA1KiogbmF0aXZlIGZ1bmN0aW9uIGltcGxlbWVudGF0aW9ucyB0aGF0IHdlIGhvcGUgdG8gdXNlXG4gIC8vIGFyZSBkZWNsYXJlZCBoZXJlLlxuICB2YXJcbiAgICBuYXRpdmVGb3JFYWNoICAgICAgPSBBcnJheVByb3RvLmZvckVhY2gsXG4gICAgbmF0aXZlTWFwICAgICAgICAgID0gQXJyYXlQcm90by5tYXAsXG4gICAgbmF0aXZlUmVkdWNlICAgICAgID0gQXJyYXlQcm90by5yZWR1Y2UsXG4gICAgbmF0aXZlUmVkdWNlUmlnaHQgID0gQXJyYXlQcm90by5yZWR1Y2VSaWdodCxcbiAgICBuYXRpdmVGaWx0ZXIgICAgICAgPSBBcnJheVByb3RvLmZpbHRlcixcbiAgICBuYXRpdmVFdmVyeSAgICAgICAgPSBBcnJheVByb3RvLmV2ZXJ5LFxuICAgIG5hdGl2ZVNvbWUgICAgICAgICA9IEFycmF5UHJvdG8uc29tZSxcbiAgICBuYXRpdmVJbmRleE9mICAgICAgPSBBcnJheVByb3RvLmluZGV4T2YsXG4gICAgbmF0aXZlTGFzdEluZGV4T2YgID0gQXJyYXlQcm90by5sYXN0SW5kZXhPZixcbiAgICBuYXRpdmVJc0FycmF5ICAgICAgPSBBcnJheS5pc0FycmF5LFxuICAgIG5hdGl2ZUtleXMgICAgICAgICA9IE9iamVjdC5rZXlzLFxuICAgIG5hdGl2ZUJpbmQgICAgICAgICA9IEZ1bmNQcm90by5iaW5kO1xuXG4gIC8vIENyZWF0ZSBhIHNhZmUgcmVmZXJlbmNlIHRvIHRoZSBVbmRlcnNjb3JlIG9iamVjdCBmb3IgdXNlIGJlbG93LlxuICB2YXIgXyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogaW5zdGFuY2VvZiBfKSByZXR1cm4gb2JqO1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBfKSkgcmV0dXJuIG5ldyBfKG9iaik7XG4gICAgdGhpcy5fd3JhcHBlZCA9IG9iajtcbiAgfTtcblxuICAvLyBFeHBvcnQgdGhlIFVuZGVyc2NvcmUgb2JqZWN0IGZvciAqKk5vZGUuanMqKiwgd2l0aFxuICAvLyBiYWNrd2FyZHMtY29tcGF0aWJpbGl0eSBmb3IgdGhlIG9sZCBgcmVxdWlyZSgpYCBBUEkuIElmIHdlJ3JlIGluXG4gIC8vIHRoZSBicm93c2VyLCBhZGQgYF9gIGFzIGEgZ2xvYmFsIG9iamVjdCB2aWEgYSBzdHJpbmcgaWRlbnRpZmllcixcbiAgLy8gZm9yIENsb3N1cmUgQ29tcGlsZXIgXCJhZHZhbmNlZFwiIG1vZGUuXG4gIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IF87XG4gICAgfVxuICAgIGV4cG9ydHMuXyA9IF87XG4gIH0gZWxzZSB7XG4gICAgcm9vdC5fID0gXztcbiAgfVxuXG4gIC8vIEN1cnJlbnQgdmVyc2lvbi5cbiAgXy5WRVJTSU9OID0gJzEuNi4wJztcblxuICAvLyBDb2xsZWN0aW9uIEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIFRoZSBjb3JuZXJzdG9uZSwgYW4gYGVhY2hgIGltcGxlbWVudGF0aW9uLCBha2EgYGZvckVhY2hgLlxuICAvLyBIYW5kbGVzIG9iamVjdHMgd2l0aCB0aGUgYnVpbHQtaW4gYGZvckVhY2hgLCBhcnJheXMsIGFuZCByYXcgb2JqZWN0cy5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYGZvckVhY2hgIGlmIGF2YWlsYWJsZS5cbiAgdmFyIGVhY2ggPSBfLmVhY2ggPSBfLmZvckVhY2ggPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gb2JqO1xuICAgIGlmIChuYXRpdmVGb3JFYWNoICYmIG9iai5mb3JFYWNoID09PSBuYXRpdmVGb3JFYWNoKSB7XG4gICAgICBvYmouZm9yRWFjaChpdGVyYXRvciwgY29udGV4dCk7XG4gICAgfSBlbHNlIGlmIChvYmoubGVuZ3RoID09PSArb2JqLmxlbmd0aCkge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IG9iai5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoaXRlcmF0b3IuY2FsbChjb250ZXh0LCBvYmpbaV0sIGksIG9iaikgPT09IGJyZWFrZXIpIHJldHVybjtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9ialtrZXlzW2ldXSwga2V5c1tpXSwgb2JqKSA9PT0gYnJlYWtlcikgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgcmVzdWx0cyBvZiBhcHBseWluZyB0aGUgaXRlcmF0b3IgdG8gZWFjaCBlbGVtZW50LlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgbWFwYCBpZiBhdmFpbGFibGUuXG4gIF8ubWFwID0gXy5jb2xsZWN0ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHRzID0gW107XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gcmVzdWx0cztcbiAgICBpZiAobmF0aXZlTWFwICYmIG9iai5tYXAgPT09IG5hdGl2ZU1hcCkgcmV0dXJuIG9iai5tYXAoaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIHJlc3VsdHMucHVzaChpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkpO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIHZhciByZWR1Y2VFcnJvciA9ICdSZWR1Y2Ugb2YgZW1wdHkgYXJyYXkgd2l0aCBubyBpbml0aWFsIHZhbHVlJztcblxuICAvLyAqKlJlZHVjZSoqIGJ1aWxkcyB1cCBhIHNpbmdsZSByZXN1bHQgZnJvbSBhIGxpc3Qgb2YgdmFsdWVzLCBha2EgYGluamVjdGAsXG4gIC8vIG9yIGBmb2xkbGAuIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGByZWR1Y2VgIGlmIGF2YWlsYWJsZS5cbiAgXy5yZWR1Y2UgPSBfLmZvbGRsID0gXy5pbmplY3QgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBtZW1vLCBjb250ZXh0KSB7XG4gICAgdmFyIGluaXRpYWwgPSBhcmd1bWVudHMubGVuZ3RoID4gMjtcbiAgICBpZiAob2JqID09IG51bGwpIG9iaiA9IFtdO1xuICAgIGlmIChuYXRpdmVSZWR1Y2UgJiYgb2JqLnJlZHVjZSA9PT0gbmF0aXZlUmVkdWNlKSB7XG4gICAgICBpZiAoY29udGV4dCkgaXRlcmF0b3IgPSBfLmJpbmQoaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgICAgcmV0dXJuIGluaXRpYWwgPyBvYmoucmVkdWNlKGl0ZXJhdG9yLCBtZW1vKSA6IG9iai5yZWR1Y2UoaXRlcmF0b3IpO1xuICAgIH1cbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICBpZiAoIWluaXRpYWwpIHtcbiAgICAgICAgbWVtbyA9IHZhbHVlO1xuICAgICAgICBpbml0aWFsID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1lbW8gPSBpdGVyYXRvci5jYWxsKGNvbnRleHQsIG1lbW8sIHZhbHVlLCBpbmRleCwgbGlzdCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCFpbml0aWFsKSB0aHJvdyBuZXcgVHlwZUVycm9yKHJlZHVjZUVycm9yKTtcbiAgICByZXR1cm4gbWVtbztcbiAgfTtcblxuICAvLyBUaGUgcmlnaHQtYXNzb2NpYXRpdmUgdmVyc2lvbiBvZiByZWR1Y2UsIGFsc28ga25vd24gYXMgYGZvbGRyYC5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYHJlZHVjZVJpZ2h0YCBpZiBhdmFpbGFibGUuXG4gIF8ucmVkdWNlUmlnaHQgPSBfLmZvbGRyID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgbWVtbywgY29udGV4dCkge1xuICAgIHZhciBpbml0aWFsID0gYXJndW1lbnRzLmxlbmd0aCA+IDI7XG4gICAgaWYgKG9iaiA9PSBudWxsKSBvYmogPSBbXTtcbiAgICBpZiAobmF0aXZlUmVkdWNlUmlnaHQgJiYgb2JqLnJlZHVjZVJpZ2h0ID09PSBuYXRpdmVSZWR1Y2VSaWdodCkge1xuICAgICAgaWYgKGNvbnRleHQpIGl0ZXJhdG9yID0gXy5iaW5kKGl0ZXJhdG9yLCBjb250ZXh0KTtcbiAgICAgIHJldHVybiBpbml0aWFsID8gb2JqLnJlZHVjZVJpZ2h0KGl0ZXJhdG9yLCBtZW1vKSA6IG9iai5yZWR1Y2VSaWdodChpdGVyYXRvcik7XG4gICAgfVxuICAgIHZhciBsZW5ndGggPSBvYmoubGVuZ3RoO1xuICAgIGlmIChsZW5ndGggIT09ICtsZW5ndGgpIHtcbiAgICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gICAgICBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICB9XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgaW5kZXggPSBrZXlzID8ga2V5c1stLWxlbmd0aF0gOiAtLWxlbmd0aDtcbiAgICAgIGlmICghaW5pdGlhbCkge1xuICAgICAgICBtZW1vID0gb2JqW2luZGV4XTtcbiAgICAgICAgaW5pdGlhbCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtZW1vID0gaXRlcmF0b3IuY2FsbChjb250ZXh0LCBtZW1vLCBvYmpbaW5kZXhdLCBpbmRleCwgbGlzdCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCFpbml0aWFsKSB0aHJvdyBuZXcgVHlwZUVycm9yKHJlZHVjZUVycm9yKTtcbiAgICByZXR1cm4gbWVtbztcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIGZpcnN0IHZhbHVlIHdoaWNoIHBhc3NlcyBhIHRydXRoIHRlc3QuIEFsaWFzZWQgYXMgYGRldGVjdGAuXG4gIF8uZmluZCA9IF8uZGV0ZWN0ID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0O1xuICAgIGFueShvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgaWYgKHByZWRpY2F0ZS5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkpIHtcbiAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGFsbCB0aGUgZWxlbWVudHMgdGhhdCBwYXNzIGEgdHJ1dGggdGVzdC5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYGZpbHRlcmAgaWYgYXZhaWxhYmxlLlxuICAvLyBBbGlhc2VkIGFzIGBzZWxlY3RgLlxuICBfLmZpbHRlciA9IF8uc2VsZWN0ID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHJlc3VsdHM7XG4gICAgaWYgKG5hdGl2ZUZpbHRlciAmJiBvYmouZmlsdGVyID09PSBuYXRpdmVGaWx0ZXIpIHJldHVybiBvYmouZmlsdGVyKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgaWYgKHByZWRpY2F0ZS5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkpIHJlc3VsdHMucHVzaCh2YWx1ZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGFsbCB0aGUgZWxlbWVudHMgZm9yIHdoaWNoIGEgdHJ1dGggdGVzdCBmYWlscy5cbiAgXy5yZWplY3QgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHJldHVybiBfLmZpbHRlcihvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgcmV0dXJuICFwcmVkaWNhdGUuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpO1xuICAgIH0sIGNvbnRleHQpO1xuICB9O1xuXG4gIC8vIERldGVybWluZSB3aGV0aGVyIGFsbCBvZiB0aGUgZWxlbWVudHMgbWF0Y2ggYSB0cnV0aCB0ZXN0LlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgZXZlcnlgIGlmIGF2YWlsYWJsZS5cbiAgLy8gQWxpYXNlZCBhcyBgYWxsYC5cbiAgXy5ldmVyeSA9IF8uYWxsID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICBwcmVkaWNhdGUgfHwgKHByZWRpY2F0ZSA9IF8uaWRlbnRpdHkpO1xuICAgIHZhciByZXN1bHQgPSB0cnVlO1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHJlc3VsdDtcbiAgICBpZiAobmF0aXZlRXZlcnkgJiYgb2JqLmV2ZXJ5ID09PSBuYXRpdmVFdmVyeSkgcmV0dXJuIG9iai5ldmVyeShwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmICghKHJlc3VsdCA9IHJlc3VsdCAmJiBwcmVkaWNhdGUuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpKSkgcmV0dXJuIGJyZWFrZXI7XG4gICAgfSk7XG4gICAgcmV0dXJuICEhcmVzdWx0O1xuICB9O1xuXG4gIC8vIERldGVybWluZSBpZiBhdCBsZWFzdCBvbmUgZWxlbWVudCBpbiB0aGUgb2JqZWN0IG1hdGNoZXMgYSB0cnV0aCB0ZXN0LlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgc29tZWAgaWYgYXZhaWxhYmxlLlxuICAvLyBBbGlhc2VkIGFzIGBhbnlgLlxuICB2YXIgYW55ID0gXy5zb21lID0gXy5hbnkgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHByZWRpY2F0ZSB8fCAocHJlZGljYXRlID0gXy5pZGVudGl0eSk7XG4gICAgdmFyIHJlc3VsdCA9IGZhbHNlO1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHJlc3VsdDtcbiAgICBpZiAobmF0aXZlU29tZSAmJiBvYmouc29tZSA9PT0gbmF0aXZlU29tZSkgcmV0dXJuIG9iai5zb21lKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgaWYgKHJlc3VsdCB8fCAocmVzdWx0ID0gcHJlZGljYXRlLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KSkpIHJldHVybiBicmVha2VyO1xuICAgIH0pO1xuICAgIHJldHVybiAhIXJlc3VsdDtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmUgaWYgdGhlIGFycmF5IG9yIG9iamVjdCBjb250YWlucyBhIGdpdmVuIHZhbHVlICh1c2luZyBgPT09YCkuXG4gIC8vIEFsaWFzZWQgYXMgYGluY2x1ZGVgLlxuICBfLmNvbnRhaW5zID0gXy5pbmNsdWRlID0gZnVuY3Rpb24ob2JqLCB0YXJnZXQpIHtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiBmYWxzZTtcbiAgICBpZiAobmF0aXZlSW5kZXhPZiAmJiBvYmouaW5kZXhPZiA9PT0gbmF0aXZlSW5kZXhPZikgcmV0dXJuIG9iai5pbmRleE9mKHRhcmdldCkgIT0gLTE7XG4gICAgcmV0dXJuIGFueShvYmosIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWUgPT09IHRhcmdldDtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBJbnZva2UgYSBtZXRob2QgKHdpdGggYXJndW1lbnRzKSBvbiBldmVyeSBpdGVtIGluIGEgY29sbGVjdGlvbi5cbiAgXy5pbnZva2UgPSBmdW5jdGlvbihvYmosIG1ldGhvZCkge1xuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIHZhciBpc0Z1bmMgPSBfLmlzRnVuY3Rpb24obWV0aG9kKTtcbiAgICByZXR1cm4gXy5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIChpc0Z1bmMgPyBtZXRob2QgOiB2YWx1ZVttZXRob2RdKS5hcHBseSh2YWx1ZSwgYXJncyk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgbWFwYDogZmV0Y2hpbmcgYSBwcm9wZXJ0eS5cbiAgXy5wbHVjayA9IGZ1bmN0aW9uKG9iaiwga2V5KSB7XG4gICAgcmV0dXJuIF8ubWFwKG9iaiwgXy5wcm9wZXJ0eShrZXkpKTtcbiAgfTtcblxuICAvLyBDb252ZW5pZW5jZSB2ZXJzaW9uIG9mIGEgY29tbW9uIHVzZSBjYXNlIG9mIGBmaWx0ZXJgOiBzZWxlY3Rpbmcgb25seSBvYmplY3RzXG4gIC8vIGNvbnRhaW5pbmcgc3BlY2lmaWMgYGtleTp2YWx1ZWAgcGFpcnMuXG4gIF8ud2hlcmUgPSBmdW5jdGlvbihvYmosIGF0dHJzKSB7XG4gICAgcmV0dXJuIF8uZmlsdGVyKG9iaiwgXy5tYXRjaGVzKGF0dHJzKSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgZmluZGA6IGdldHRpbmcgdGhlIGZpcnN0IG9iamVjdFxuICAvLyBjb250YWluaW5nIHNwZWNpZmljIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLmZpbmRXaGVyZSA9IGZ1bmN0aW9uKG9iaiwgYXR0cnMpIHtcbiAgICByZXR1cm4gXy5maW5kKG9iaiwgXy5tYXRjaGVzKGF0dHJzKSk7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBtYXhpbXVtIGVsZW1lbnQgb3IgKGVsZW1lbnQtYmFzZWQgY29tcHV0YXRpb24pLlxuICAvLyBDYW4ndCBvcHRpbWl6ZSBhcnJheXMgb2YgaW50ZWdlcnMgbG9uZ2VyIHRoYW4gNjUsNTM1IGVsZW1lbnRzLlxuICAvLyBTZWUgW1dlYktpdCBCdWcgODA3OTddKGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD04MDc5NylcbiAgXy5tYXggPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgaWYgKCFpdGVyYXRvciAmJiBfLmlzQXJyYXkob2JqKSAmJiBvYmpbMF0gPT09ICtvYmpbMF0gJiYgb2JqLmxlbmd0aCA8IDY1NTM1KSB7XG4gICAgICByZXR1cm4gTWF0aC5tYXguYXBwbHkoTWF0aCwgb2JqKTtcbiAgICB9XG4gICAgdmFyIHJlc3VsdCA9IC1JbmZpbml0eSwgbGFzdENvbXB1dGVkID0gLUluZmluaXR5O1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIHZhciBjb21wdXRlZCA9IGl0ZXJhdG9yID8gaXRlcmF0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpIDogdmFsdWU7XG4gICAgICBpZiAoY29tcHV0ZWQgPiBsYXN0Q29tcHV0ZWQpIHtcbiAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgIGxhc3RDb21wdXRlZCA9IGNvbXB1dGVkO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBtaW5pbXVtIGVsZW1lbnQgKG9yIGVsZW1lbnQtYmFzZWQgY29tcHV0YXRpb24pLlxuICBfLm1pbiA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBpZiAoIWl0ZXJhdG9yICYmIF8uaXNBcnJheShvYmopICYmIG9ialswXSA9PT0gK29ialswXSAmJiBvYmoubGVuZ3RoIDwgNjU1MzUpIHtcbiAgICAgIHJldHVybiBNYXRoLm1pbi5hcHBseShNYXRoLCBvYmopO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gSW5maW5pdHksIGxhc3RDb21wdXRlZCA9IEluZmluaXR5O1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIHZhciBjb21wdXRlZCA9IGl0ZXJhdG9yID8gaXRlcmF0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpIDogdmFsdWU7XG4gICAgICBpZiAoY29tcHV0ZWQgPCBsYXN0Q29tcHV0ZWQpIHtcbiAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgIGxhc3RDb21wdXRlZCA9IGNvbXB1dGVkO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gU2h1ZmZsZSBhbiBhcnJheSwgdXNpbmcgdGhlIG1vZGVybiB2ZXJzaW9uIG9mIHRoZVxuICAvLyBbRmlzaGVyLVlhdGVzIHNodWZmbGVdKGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvRmlzaGVy4oCTWWF0ZXNfc2h1ZmZsZSkuXG4gIF8uc2h1ZmZsZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciByYW5kO1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIHNodWZmbGVkID0gW107XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByYW5kID0gXy5yYW5kb20oaW5kZXgrKyk7XG4gICAgICBzaHVmZmxlZFtpbmRleCAtIDFdID0gc2h1ZmZsZWRbcmFuZF07XG4gICAgICBzaHVmZmxlZFtyYW5kXSA9IHZhbHVlO1xuICAgIH0pO1xuICAgIHJldHVybiBzaHVmZmxlZDtcbiAgfTtcblxuICAvLyBTYW1wbGUgKipuKiogcmFuZG9tIHZhbHVlcyBmcm9tIGEgY29sbGVjdGlvbi5cbiAgLy8gSWYgKipuKiogaXMgbm90IHNwZWNpZmllZCwgcmV0dXJucyBhIHNpbmdsZSByYW5kb20gZWxlbWVudC5cbiAgLy8gVGhlIGludGVybmFsIGBndWFyZGAgYXJndW1lbnQgYWxsb3dzIGl0IHRvIHdvcmsgd2l0aCBgbWFwYC5cbiAgXy5zYW1wbGUgPSBmdW5jdGlvbihvYmosIG4sIGd1YXJkKSB7XG4gICAgaWYgKG4gPT0gbnVsbCB8fCBndWFyZCkge1xuICAgICAgaWYgKG9iai5sZW5ndGggIT09ICtvYmoubGVuZ3RoKSBvYmogPSBfLnZhbHVlcyhvYmopO1xuICAgICAgcmV0dXJuIG9ialtfLnJhbmRvbShvYmoubGVuZ3RoIC0gMSldO1xuICAgIH1cbiAgICByZXR1cm4gXy5zaHVmZmxlKG9iaikuc2xpY2UoMCwgTWF0aC5tYXgoMCwgbikpO1xuICB9O1xuXG4gIC8vIEFuIGludGVybmFsIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIGxvb2t1cCBpdGVyYXRvcnMuXG4gIHZhciBsb29rdXBJdGVyYXRvciA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09IG51bGwpIHJldHVybiBfLmlkZW50aXR5O1xuICAgIGlmIChfLmlzRnVuY3Rpb24odmFsdWUpKSByZXR1cm4gdmFsdWU7XG4gICAgcmV0dXJuIF8ucHJvcGVydHkodmFsdWUpO1xuICB9O1xuXG4gIC8vIFNvcnQgdGhlIG9iamVjdCdzIHZhbHVlcyBieSBhIGNyaXRlcmlvbiBwcm9kdWNlZCBieSBhbiBpdGVyYXRvci5cbiAgXy5zb3J0QnkgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0b3IgPSBsb29rdXBJdGVyYXRvcihpdGVyYXRvcik7XG4gICAgcmV0dXJuIF8ucGx1Y2soXy5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgaW5kZXg6IGluZGV4LFxuICAgICAgICBjcml0ZXJpYTogaXRlcmF0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpXG4gICAgICB9O1xuICAgIH0pLnNvcnQoZnVuY3Rpb24obGVmdCwgcmlnaHQpIHtcbiAgICAgIHZhciBhID0gbGVmdC5jcml0ZXJpYTtcbiAgICAgIHZhciBiID0gcmlnaHQuY3JpdGVyaWE7XG4gICAgICBpZiAoYSAhPT0gYikge1xuICAgICAgICBpZiAoYSA+IGIgfHwgYSA9PT0gdm9pZCAwKSByZXR1cm4gMTtcbiAgICAgICAgaWYgKGEgPCBiIHx8IGIgPT09IHZvaWQgMCkgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGxlZnQuaW5kZXggLSByaWdodC5pbmRleDtcbiAgICB9KSwgJ3ZhbHVlJyk7XG4gIH07XG5cbiAgLy8gQW4gaW50ZXJuYWwgZnVuY3Rpb24gdXNlZCBmb3IgYWdncmVnYXRlIFwiZ3JvdXAgYnlcIiBvcGVyYXRpb25zLlxuICB2YXIgZ3JvdXAgPSBmdW5jdGlvbihiZWhhdmlvcikge1xuICAgIHJldHVybiBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgICBpdGVyYXRvciA9IGxvb2t1cEl0ZXJhdG9yKGl0ZXJhdG9yKTtcbiAgICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcbiAgICAgICAgdmFyIGtleSA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBvYmopO1xuICAgICAgICBiZWhhdmlvcihyZXN1bHQsIGtleSwgdmFsdWUpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH07XG5cbiAgLy8gR3JvdXBzIHRoZSBvYmplY3QncyB2YWx1ZXMgYnkgYSBjcml0ZXJpb24uIFBhc3MgZWl0aGVyIGEgc3RyaW5nIGF0dHJpYnV0ZVxuICAvLyB0byBncm91cCBieSwgb3IgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIGNyaXRlcmlvbi5cbiAgXy5ncm91cEJ5ID0gZ3JvdXAoZnVuY3Rpb24ocmVzdWx0LCBrZXksIHZhbHVlKSB7XG4gICAgXy5oYXMocmVzdWx0LCBrZXkpID8gcmVzdWx0W2tleV0ucHVzaCh2YWx1ZSkgOiByZXN1bHRba2V5XSA9IFt2YWx1ZV07XG4gIH0pO1xuXG4gIC8vIEluZGV4ZXMgdGhlIG9iamVjdCdzIHZhbHVlcyBieSBhIGNyaXRlcmlvbiwgc2ltaWxhciB0byBgZ3JvdXBCeWAsIGJ1dCBmb3JcbiAgLy8gd2hlbiB5b3Uga25vdyB0aGF0IHlvdXIgaW5kZXggdmFsdWVzIHdpbGwgYmUgdW5pcXVlLlxuICBfLmluZGV4QnkgPSBncm91cChmdW5jdGlvbihyZXN1bHQsIGtleSwgdmFsdWUpIHtcbiAgICByZXN1bHRba2V5XSA9IHZhbHVlO1xuICB9KTtcblxuICAvLyBDb3VudHMgaW5zdGFuY2VzIG9mIGFuIG9iamVjdCB0aGF0IGdyb3VwIGJ5IGEgY2VydGFpbiBjcml0ZXJpb24uIFBhc3NcbiAgLy8gZWl0aGVyIGEgc3RyaW5nIGF0dHJpYnV0ZSB0byBjb3VudCBieSwgb3IgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlXG4gIC8vIGNyaXRlcmlvbi5cbiAgXy5jb3VudEJ5ID0gZ3JvdXAoZnVuY3Rpb24ocmVzdWx0LCBrZXkpIHtcbiAgICBfLmhhcyhyZXN1bHQsIGtleSkgPyByZXN1bHRba2V5XSsrIDogcmVzdWx0W2tleV0gPSAxO1xuICB9KTtcblxuICAvLyBVc2UgYSBjb21wYXJhdG9yIGZ1bmN0aW9uIHRvIGZpZ3VyZSBvdXQgdGhlIHNtYWxsZXN0IGluZGV4IGF0IHdoaWNoXG4gIC8vIGFuIG9iamVjdCBzaG91bGQgYmUgaW5zZXJ0ZWQgc28gYXMgdG8gbWFpbnRhaW4gb3JkZXIuIFVzZXMgYmluYXJ5IHNlYXJjaC5cbiAgXy5zb3J0ZWRJbmRleCA9IGZ1bmN0aW9uKGFycmF5LCBvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0b3IgPSBsb29rdXBJdGVyYXRvcihpdGVyYXRvcik7XG4gICAgdmFyIHZhbHVlID0gaXRlcmF0b3IuY2FsbChjb250ZXh0LCBvYmopO1xuICAgIHZhciBsb3cgPSAwLCBoaWdoID0gYXJyYXkubGVuZ3RoO1xuICAgIHdoaWxlIChsb3cgPCBoaWdoKSB7XG4gICAgICB2YXIgbWlkID0gKGxvdyArIGhpZ2gpID4+PiAxO1xuICAgICAgaXRlcmF0b3IuY2FsbChjb250ZXh0LCBhcnJheVttaWRdKSA8IHZhbHVlID8gbG93ID0gbWlkICsgMSA6IGhpZ2ggPSBtaWQ7XG4gICAgfVxuICAgIHJldHVybiBsb3c7XG4gIH07XG5cbiAgLy8gU2FmZWx5IGNyZWF0ZSBhIHJlYWwsIGxpdmUgYXJyYXkgZnJvbSBhbnl0aGluZyBpdGVyYWJsZS5cbiAgXy50b0FycmF5ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFvYmopIHJldHVybiBbXTtcbiAgICBpZiAoXy5pc0FycmF5KG9iaikpIHJldHVybiBzbGljZS5jYWxsKG9iaik7XG4gICAgaWYgKG9iai5sZW5ndGggPT09ICtvYmoubGVuZ3RoKSByZXR1cm4gXy5tYXAob2JqLCBfLmlkZW50aXR5KTtcbiAgICByZXR1cm4gXy52YWx1ZXMob2JqKTtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiBhbiBvYmplY3QuXG4gIF8uc2l6ZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIDA7XG4gICAgcmV0dXJuIChvYmoubGVuZ3RoID09PSArb2JqLmxlbmd0aCkgPyBvYmoubGVuZ3RoIDogXy5rZXlzKG9iaikubGVuZ3RoO1xuICB9O1xuXG4gIC8vIEFycmF5IEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS1cblxuICAvLyBHZXQgdGhlIGZpcnN0IGVsZW1lbnQgb2YgYW4gYXJyYXkuIFBhc3NpbmcgKipuKiogd2lsbCByZXR1cm4gdGhlIGZpcnN0IE5cbiAgLy8gdmFsdWVzIGluIHRoZSBhcnJheS4gQWxpYXNlZCBhcyBgaGVhZGAgYW5kIGB0YWtlYC4gVGhlICoqZ3VhcmQqKiBjaGVja1xuICAvLyBhbGxvd3MgaXQgdG8gd29yayB3aXRoIGBfLm1hcGAuXG4gIF8uZmlyc3QgPSBfLmhlYWQgPSBfLnRha2UgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICBpZiAoYXJyYXkgPT0gbnVsbCkgcmV0dXJuIHZvaWQgMDtcbiAgICBpZiAoKG4gPT0gbnVsbCkgfHwgZ3VhcmQpIHJldHVybiBhcnJheVswXTtcbiAgICBpZiAobiA8IDApIHJldHVybiBbXTtcbiAgICByZXR1cm4gc2xpY2UuY2FsbChhcnJheSwgMCwgbik7XG4gIH07XG5cbiAgLy8gUmV0dXJucyBldmVyeXRoaW5nIGJ1dCB0aGUgbGFzdCBlbnRyeSBvZiB0aGUgYXJyYXkuIEVzcGVjaWFsbHkgdXNlZnVsIG9uXG4gIC8vIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBQYXNzaW5nICoqbioqIHdpbGwgcmV0dXJuIGFsbCB0aGUgdmFsdWVzIGluXG4gIC8vIHRoZSBhcnJheSwgZXhjbHVkaW5nIHRoZSBsYXN0IE4uIFRoZSAqKmd1YXJkKiogY2hlY2sgYWxsb3dzIGl0IHRvIHdvcmsgd2l0aFxuICAvLyBgXy5tYXBgLlxuICBfLmluaXRpYWwgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICByZXR1cm4gc2xpY2UuY2FsbChhcnJheSwgMCwgYXJyYXkubGVuZ3RoIC0gKChuID09IG51bGwpIHx8IGd1YXJkID8gMSA6IG4pKTtcbiAgfTtcblxuICAvLyBHZXQgdGhlIGxhc3QgZWxlbWVudCBvZiBhbiBhcnJheS4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiB0aGUgbGFzdCBOXG4gIC8vIHZhbHVlcyBpbiB0aGUgYXJyYXkuIFRoZSAqKmd1YXJkKiogY2hlY2sgYWxsb3dzIGl0IHRvIHdvcmsgd2l0aCBgXy5tYXBgLlxuICBfLmxhc3QgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICBpZiAoYXJyYXkgPT0gbnVsbCkgcmV0dXJuIHZvaWQgMDtcbiAgICBpZiAoKG4gPT0gbnVsbCkgfHwgZ3VhcmQpIHJldHVybiBhcnJheVthcnJheS5sZW5ndGggLSAxXTtcbiAgICByZXR1cm4gc2xpY2UuY2FsbChhcnJheSwgTWF0aC5tYXgoYXJyYXkubGVuZ3RoIC0gbiwgMCkpO1xuICB9O1xuXG4gIC8vIFJldHVybnMgZXZlcnl0aGluZyBidXQgdGhlIGZpcnN0IGVudHJ5IG9mIHRoZSBhcnJheS4gQWxpYXNlZCBhcyBgdGFpbGAgYW5kIGBkcm9wYC5cbiAgLy8gRXNwZWNpYWxseSB1c2VmdWwgb24gdGhlIGFyZ3VtZW50cyBvYmplY3QuIFBhc3NpbmcgYW4gKipuKiogd2lsbCByZXR1cm5cbiAgLy8gdGhlIHJlc3QgTiB2YWx1ZXMgaW4gdGhlIGFycmF5LiBUaGUgKipndWFyZCoqXG4gIC8vIGNoZWNrIGFsbG93cyBpdCB0byB3b3JrIHdpdGggYF8ubWFwYC5cbiAgXy5yZXN0ID0gXy50YWlsID0gXy5kcm9wID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgcmV0dXJuIHNsaWNlLmNhbGwoYXJyYXksIChuID09IG51bGwpIHx8IGd1YXJkID8gMSA6IG4pO1xuICB9O1xuXG4gIC8vIFRyaW0gb3V0IGFsbCBmYWxzeSB2YWx1ZXMgZnJvbSBhbiBhcnJheS5cbiAgXy5jb21wYWN0ID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICByZXR1cm4gXy5maWx0ZXIoYXJyYXksIF8uaWRlbnRpdHkpO1xuICB9O1xuXG4gIC8vIEludGVybmFsIGltcGxlbWVudGF0aW9uIG9mIGEgcmVjdXJzaXZlIGBmbGF0dGVuYCBmdW5jdGlvbi5cbiAgdmFyIGZsYXR0ZW4gPSBmdW5jdGlvbihpbnB1dCwgc2hhbGxvdywgb3V0cHV0KSB7XG4gICAgaWYgKHNoYWxsb3cgJiYgXy5ldmVyeShpbnB1dCwgXy5pc0FycmF5KSkge1xuICAgICAgcmV0dXJuIGNvbmNhdC5hcHBseShvdXRwdXQsIGlucHV0KTtcbiAgICB9XG4gICAgZWFjaChpbnB1dCwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIGlmIChfLmlzQXJyYXkodmFsdWUpIHx8IF8uaXNBcmd1bWVudHModmFsdWUpKSB7XG4gICAgICAgIHNoYWxsb3cgPyBwdXNoLmFwcGx5KG91dHB1dCwgdmFsdWUpIDogZmxhdHRlbih2YWx1ZSwgc2hhbGxvdywgb3V0cHV0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dHB1dC5wdXNoKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gb3V0cHV0O1xuICB9O1xuXG4gIC8vIEZsYXR0ZW4gb3V0IGFuIGFycmF5LCBlaXRoZXIgcmVjdXJzaXZlbHkgKGJ5IGRlZmF1bHQpLCBvciBqdXN0IG9uZSBsZXZlbC5cbiAgXy5mbGF0dGVuID0gZnVuY3Rpb24oYXJyYXksIHNoYWxsb3cpIHtcbiAgICByZXR1cm4gZmxhdHRlbihhcnJheSwgc2hhbGxvdywgW10pO1xuICB9O1xuXG4gIC8vIFJldHVybiBhIHZlcnNpb24gb2YgdGhlIGFycmF5IHRoYXQgZG9lcyBub3QgY29udGFpbiB0aGUgc3BlY2lmaWVkIHZhbHVlKHMpLlxuICBfLndpdGhvdXQgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHJldHVybiBfLmRpZmZlcmVuY2UoYXJyYXksIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gIH07XG5cbiAgLy8gU3BsaXQgYW4gYXJyYXkgaW50byB0d28gYXJyYXlzOiBvbmUgd2hvc2UgZWxlbWVudHMgYWxsIHNhdGlzZnkgdGhlIGdpdmVuXG4gIC8vIHByZWRpY2F0ZSwgYW5kIG9uZSB3aG9zZSBlbGVtZW50cyBhbGwgZG8gbm90IHNhdGlzZnkgdGhlIHByZWRpY2F0ZS5cbiAgXy5wYXJ0aXRpb24gPSBmdW5jdGlvbihhcnJheSwgcHJlZGljYXRlKSB7XG4gICAgdmFyIHBhc3MgPSBbXSwgZmFpbCA9IFtdO1xuICAgIGVhY2goYXJyYXksIGZ1bmN0aW9uKGVsZW0pIHtcbiAgICAgIChwcmVkaWNhdGUoZWxlbSkgPyBwYXNzIDogZmFpbCkucHVzaChlbGVtKTtcbiAgICB9KTtcbiAgICByZXR1cm4gW3Bhc3MsIGZhaWxdO1xuICB9O1xuXG4gIC8vIFByb2R1Y2UgYSBkdXBsaWNhdGUtZnJlZSB2ZXJzaW9uIG9mIHRoZSBhcnJheS4gSWYgdGhlIGFycmF5IGhhcyBhbHJlYWR5XG4gIC8vIGJlZW4gc29ydGVkLCB5b3UgaGF2ZSB0aGUgb3B0aW9uIG9mIHVzaW5nIGEgZmFzdGVyIGFsZ29yaXRobS5cbiAgLy8gQWxpYXNlZCBhcyBgdW5pcXVlYC5cbiAgXy51bmlxID0gXy51bmlxdWUgPSBmdW5jdGlvbihhcnJheSwgaXNTb3J0ZWQsIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgaWYgKF8uaXNGdW5jdGlvbihpc1NvcnRlZCkpIHtcbiAgICAgIGNvbnRleHQgPSBpdGVyYXRvcjtcbiAgICAgIGl0ZXJhdG9yID0gaXNTb3J0ZWQ7XG4gICAgICBpc1NvcnRlZCA9IGZhbHNlO1xuICAgIH1cbiAgICB2YXIgaW5pdGlhbCA9IGl0ZXJhdG9yID8gXy5tYXAoYXJyYXksIGl0ZXJhdG9yLCBjb250ZXh0KSA6IGFycmF5O1xuICAgIHZhciByZXN1bHRzID0gW107XG4gICAgdmFyIHNlZW4gPSBbXTtcbiAgICBlYWNoKGluaXRpYWwsIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xuICAgICAgaWYgKGlzU29ydGVkID8gKCFpbmRleCB8fCBzZWVuW3NlZW4ubGVuZ3RoIC0gMV0gIT09IHZhbHVlKSA6ICFfLmNvbnRhaW5zKHNlZW4sIHZhbHVlKSkge1xuICAgICAgICBzZWVuLnB1c2godmFsdWUpO1xuICAgICAgICByZXN1bHRzLnB1c2goYXJyYXlbaW5kZXhdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICAvLyBQcm9kdWNlIGFuIGFycmF5IHRoYXQgY29udGFpbnMgdGhlIHVuaW9uOiBlYWNoIGRpc3RpbmN0IGVsZW1lbnQgZnJvbSBhbGwgb2ZcbiAgLy8gdGhlIHBhc3NlZC1pbiBhcnJheXMuXG4gIF8udW5pb24gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXy51bmlxKF8uZmxhdHRlbihhcmd1bWVudHMsIHRydWUpKTtcbiAgfTtcblxuICAvLyBQcm9kdWNlIGFuIGFycmF5IHRoYXQgY29udGFpbnMgZXZlcnkgaXRlbSBzaGFyZWQgYmV0d2VlbiBhbGwgdGhlXG4gIC8vIHBhc3NlZC1pbiBhcnJheXMuXG4gIF8uaW50ZXJzZWN0aW9uID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICB2YXIgcmVzdCA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICByZXR1cm4gXy5maWx0ZXIoXy51bmlxKGFycmF5KSwgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgcmV0dXJuIF8uZXZlcnkocmVzdCwgZnVuY3Rpb24ob3RoZXIpIHtcbiAgICAgICAgcmV0dXJuIF8uY29udGFpbnMob3RoZXIsIGl0ZW0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gVGFrZSB0aGUgZGlmZmVyZW5jZSBiZXR3ZWVuIG9uZSBhcnJheSBhbmQgYSBudW1iZXIgb2Ygb3RoZXIgYXJyYXlzLlxuICAvLyBPbmx5IHRoZSBlbGVtZW50cyBwcmVzZW50IGluIGp1c3QgdGhlIGZpcnN0IGFycmF5IHdpbGwgcmVtYWluLlxuICBfLmRpZmZlcmVuY2UgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHZhciByZXN0ID0gY29uY2F0LmFwcGx5KEFycmF5UHJvdG8sIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgcmV0dXJuIF8uZmlsdGVyKGFycmF5LCBmdW5jdGlvbih2YWx1ZSl7IHJldHVybiAhXy5jb250YWlucyhyZXN0LCB2YWx1ZSk7IH0pO1xuICB9O1xuXG4gIC8vIFppcCB0b2dldGhlciBtdWx0aXBsZSBsaXN0cyBpbnRvIGEgc2luZ2xlIGFycmF5IC0tIGVsZW1lbnRzIHRoYXQgc2hhcmVcbiAgLy8gYW4gaW5kZXggZ28gdG9nZXRoZXIuXG4gIF8uemlwID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGxlbmd0aCA9IF8ubWF4KF8ucGx1Y2soYXJndW1lbnRzLCAnbGVuZ3RoJykuY29uY2F0KDApKTtcbiAgICB2YXIgcmVzdWx0cyA9IG5ldyBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHJlc3VsdHNbaV0gPSBfLnBsdWNrKGFyZ3VtZW50cywgJycgKyBpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gQ29udmVydHMgbGlzdHMgaW50byBvYmplY3RzLiBQYXNzIGVpdGhlciBhIHNpbmdsZSBhcnJheSBvZiBgW2tleSwgdmFsdWVdYFxuICAvLyBwYWlycywgb3IgdHdvIHBhcmFsbGVsIGFycmF5cyBvZiB0aGUgc2FtZSBsZW5ndGggLS0gb25lIG9mIGtleXMsIGFuZCBvbmUgb2ZcbiAgLy8gdGhlIGNvcnJlc3BvbmRpbmcgdmFsdWVzLlxuICBfLm9iamVjdCA9IGZ1bmN0aW9uKGxpc3QsIHZhbHVlcykge1xuICAgIGlmIChsaXN0ID09IG51bGwpIHJldHVybiB7fTtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGxpc3QubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh2YWx1ZXMpIHtcbiAgICAgICAgcmVzdWx0W2xpc3RbaV1dID0gdmFsdWVzW2ldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0W2xpc3RbaV1bMF1dID0gbGlzdFtpXVsxXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBJZiB0aGUgYnJvd3NlciBkb2Vzbid0IHN1cHBseSB1cyB3aXRoIGluZGV4T2YgKEknbSBsb29raW5nIGF0IHlvdSwgKipNU0lFKiopLFxuICAvLyB3ZSBuZWVkIHRoaXMgZnVuY3Rpb24uIFJldHVybiB0aGUgcG9zaXRpb24gb2YgdGhlIGZpcnN0IG9jY3VycmVuY2Ugb2YgYW5cbiAgLy8gaXRlbSBpbiBhbiBhcnJheSwgb3IgLTEgaWYgdGhlIGl0ZW0gaXMgbm90IGluY2x1ZGVkIGluIHRoZSBhcnJheS5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYGluZGV4T2ZgIGlmIGF2YWlsYWJsZS5cbiAgLy8gSWYgdGhlIGFycmF5IGlzIGxhcmdlIGFuZCBhbHJlYWR5IGluIHNvcnQgb3JkZXIsIHBhc3MgYHRydWVgXG4gIC8vIGZvciAqKmlzU29ydGVkKiogdG8gdXNlIGJpbmFyeSBzZWFyY2guXG4gIF8uaW5kZXhPZiA9IGZ1bmN0aW9uKGFycmF5LCBpdGVtLCBpc1NvcnRlZCkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gLTE7XG4gICAgdmFyIGkgPSAwLCBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG4gICAgaWYgKGlzU29ydGVkKSB7XG4gICAgICBpZiAodHlwZW9mIGlzU29ydGVkID09ICdudW1iZXInKSB7XG4gICAgICAgIGkgPSAoaXNTb3J0ZWQgPCAwID8gTWF0aC5tYXgoMCwgbGVuZ3RoICsgaXNTb3J0ZWQpIDogaXNTb3J0ZWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaSA9IF8uc29ydGVkSW5kZXgoYXJyYXksIGl0ZW0pO1xuICAgICAgICByZXR1cm4gYXJyYXlbaV0gPT09IGl0ZW0gPyBpIDogLTE7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChuYXRpdmVJbmRleE9mICYmIGFycmF5LmluZGV4T2YgPT09IG5hdGl2ZUluZGV4T2YpIHJldHVybiBhcnJheS5pbmRleE9mKGl0ZW0sIGlzU29ydGVkKTtcbiAgICBmb3IgKDsgaSA8IGxlbmd0aDsgaSsrKSBpZiAoYXJyYXlbaV0gPT09IGl0ZW0pIHJldHVybiBpO1xuICAgIHJldHVybiAtMTtcbiAgfTtcblxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgbGFzdEluZGV4T2ZgIGlmIGF2YWlsYWJsZS5cbiAgXy5sYXN0SW5kZXhPZiA9IGZ1bmN0aW9uKGFycmF5LCBpdGVtLCBmcm9tKSB7XG4gICAgaWYgKGFycmF5ID09IG51bGwpIHJldHVybiAtMTtcbiAgICB2YXIgaGFzSW5kZXggPSBmcm9tICE9IG51bGw7XG4gICAgaWYgKG5hdGl2ZUxhc3RJbmRleE9mICYmIGFycmF5Lmxhc3RJbmRleE9mID09PSBuYXRpdmVMYXN0SW5kZXhPZikge1xuICAgICAgcmV0dXJuIGhhc0luZGV4ID8gYXJyYXkubGFzdEluZGV4T2YoaXRlbSwgZnJvbSkgOiBhcnJheS5sYXN0SW5kZXhPZihpdGVtKTtcbiAgICB9XG4gICAgdmFyIGkgPSAoaGFzSW5kZXggPyBmcm9tIDogYXJyYXkubGVuZ3RoKTtcbiAgICB3aGlsZSAoaS0tKSBpZiAoYXJyYXlbaV0gPT09IGl0ZW0pIHJldHVybiBpO1xuICAgIHJldHVybiAtMTtcbiAgfTtcblxuICAvLyBHZW5lcmF0ZSBhbiBpbnRlZ2VyIEFycmF5IGNvbnRhaW5pbmcgYW4gYXJpdGhtZXRpYyBwcm9ncmVzc2lvbi4gQSBwb3J0IG9mXG4gIC8vIHRoZSBuYXRpdmUgUHl0aG9uIGByYW5nZSgpYCBmdW5jdGlvbi4gU2VlXG4gIC8vIFt0aGUgUHl0aG9uIGRvY3VtZW50YXRpb25dKGh0dHA6Ly9kb2NzLnB5dGhvbi5vcmcvbGlicmFyeS9mdW5jdGlvbnMuaHRtbCNyYW5nZSkuXG4gIF8ucmFuZ2UgPSBmdW5jdGlvbihzdGFydCwgc3RvcCwgc3RlcCkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDw9IDEpIHtcbiAgICAgIHN0b3AgPSBzdGFydCB8fCAwO1xuICAgICAgc3RhcnQgPSAwO1xuICAgIH1cbiAgICBzdGVwID0gYXJndW1lbnRzWzJdIHx8IDE7XG5cbiAgICB2YXIgbGVuZ3RoID0gTWF0aC5tYXgoTWF0aC5jZWlsKChzdG9wIC0gc3RhcnQpIC8gc3RlcCksIDApO1xuICAgIHZhciBpZHggPSAwO1xuICAgIHZhciByYW5nZSA9IG5ldyBBcnJheShsZW5ndGgpO1xuXG4gICAgd2hpbGUoaWR4IDwgbGVuZ3RoKSB7XG4gICAgICByYW5nZVtpZHgrK10gPSBzdGFydDtcbiAgICAgIHN0YXJ0ICs9IHN0ZXA7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJhbmdlO1xuICB9O1xuXG4gIC8vIEZ1bmN0aW9uIChhaGVtKSBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gUmV1c2FibGUgY29uc3RydWN0b3IgZnVuY3Rpb24gZm9yIHByb3RvdHlwZSBzZXR0aW5nLlxuICB2YXIgY3RvciA9IGZ1bmN0aW9uKCl7fTtcblxuICAvLyBDcmVhdGUgYSBmdW5jdGlvbiBib3VuZCB0byBhIGdpdmVuIG9iamVjdCAoYXNzaWduaW5nIGB0aGlzYCwgYW5kIGFyZ3VtZW50cyxcbiAgLy8gb3B0aW9uYWxseSkuIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBGdW5jdGlvbi5iaW5kYCBpZlxuICAvLyBhdmFpbGFibGUuXG4gIF8uYmluZCA9IGZ1bmN0aW9uKGZ1bmMsIGNvbnRleHQpIHtcbiAgICB2YXIgYXJncywgYm91bmQ7XG4gICAgaWYgKG5hdGl2ZUJpbmQgJiYgZnVuYy5iaW5kID09PSBuYXRpdmVCaW5kKSByZXR1cm4gbmF0aXZlQmluZC5hcHBseShmdW5jLCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgIGlmICghXy5pc0Z1bmN0aW9uKGZ1bmMpKSB0aHJvdyBuZXcgVHlwZUVycm9yO1xuICAgIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgcmV0dXJuIGJvdW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgYm91bmQpKSByZXR1cm4gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbiAgICAgIGN0b3IucHJvdG90eXBlID0gZnVuYy5wcm90b3R5cGU7XG4gICAgICB2YXIgc2VsZiA9IG5ldyBjdG9yO1xuICAgICAgY3Rvci5wcm90b3R5cGUgPSBudWxsO1xuICAgICAgdmFyIHJlc3VsdCA9IGZ1bmMuYXBwbHkoc2VsZiwgYXJncy5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG4gICAgICBpZiAoT2JqZWN0KHJlc3VsdCkgPT09IHJlc3VsdCkgcmV0dXJuIHJlc3VsdDtcbiAgICAgIHJldHVybiBzZWxmO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUGFydGlhbGx5IGFwcGx5IGEgZnVuY3Rpb24gYnkgY3JlYXRpbmcgYSB2ZXJzaW9uIHRoYXQgaGFzIGhhZCBzb21lIG9mIGl0c1xuICAvLyBhcmd1bWVudHMgcHJlLWZpbGxlZCwgd2l0aG91dCBjaGFuZ2luZyBpdHMgZHluYW1pYyBgdGhpc2AgY29udGV4dC4gXyBhY3RzXG4gIC8vIGFzIGEgcGxhY2Vob2xkZXIsIGFsbG93aW5nIGFueSBjb21iaW5hdGlvbiBvZiBhcmd1bWVudHMgdG8gYmUgcHJlLWZpbGxlZC5cbiAgXy5wYXJ0aWFsID0gZnVuY3Rpb24oZnVuYykge1xuICAgIHZhciBib3VuZEFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHBvc2l0aW9uID0gMDtcbiAgICAgIHZhciBhcmdzID0gYm91bmRBcmdzLnNsaWNlKCk7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gYXJncy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoYXJnc1tpXSA9PT0gXykgYXJnc1tpXSA9IGFyZ3VtZW50c1twb3NpdGlvbisrXTtcbiAgICAgIH1cbiAgICAgIHdoaWxlIChwb3NpdGlvbiA8IGFyZ3VtZW50cy5sZW5ndGgpIGFyZ3MucHVzaChhcmd1bWVudHNbcG9zaXRpb24rK10pO1xuICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfTtcbiAgfTtcblxuICAvLyBCaW5kIGEgbnVtYmVyIG9mIGFuIG9iamVjdCdzIG1ldGhvZHMgdG8gdGhhdCBvYmplY3QuIFJlbWFpbmluZyBhcmd1bWVudHNcbiAgLy8gYXJlIHRoZSBtZXRob2QgbmFtZXMgdG8gYmUgYm91bmQuIFVzZWZ1bCBmb3IgZW5zdXJpbmcgdGhhdCBhbGwgY2FsbGJhY2tzXG4gIC8vIGRlZmluZWQgb24gYW4gb2JqZWN0IGJlbG9uZyB0byBpdC5cbiAgXy5iaW5kQWxsID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGZ1bmNzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIGlmIChmdW5jcy5sZW5ndGggPT09IDApIHRocm93IG5ldyBFcnJvcignYmluZEFsbCBtdXN0IGJlIHBhc3NlZCBmdW5jdGlvbiBuYW1lcycpO1xuICAgIGVhY2goZnVuY3MsIGZ1bmN0aW9uKGYpIHsgb2JqW2ZdID0gXy5iaW5kKG9ialtmXSwgb2JqKTsgfSk7XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBNZW1vaXplIGFuIGV4cGVuc2l2ZSBmdW5jdGlvbiBieSBzdG9yaW5nIGl0cyByZXN1bHRzLlxuICBfLm1lbW9pemUgPSBmdW5jdGlvbihmdW5jLCBoYXNoZXIpIHtcbiAgICB2YXIgbWVtbyA9IHt9O1xuICAgIGhhc2hlciB8fCAoaGFzaGVyID0gXy5pZGVudGl0eSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGtleSA9IGhhc2hlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgcmV0dXJuIF8uaGFzKG1lbW8sIGtleSkgPyBtZW1vW2tleV0gOiAobWVtb1trZXldID0gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIERlbGF5cyBhIGZ1bmN0aW9uIGZvciB0aGUgZ2l2ZW4gbnVtYmVyIG9mIG1pbGxpc2Vjb25kcywgYW5kIHRoZW4gY2FsbHNcbiAgLy8gaXQgd2l0aCB0aGUgYXJndW1lbnRzIHN1cHBsaWVkLlxuICBfLmRlbGF5ID0gZnVuY3Rpb24oZnVuYywgd2FpdCkge1xuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7IHJldHVybiBmdW5jLmFwcGx5KG51bGwsIGFyZ3MpOyB9LCB3YWl0KTtcbiAgfTtcblxuICAvLyBEZWZlcnMgYSBmdW5jdGlvbiwgc2NoZWR1bGluZyBpdCB0byBydW4gYWZ0ZXIgdGhlIGN1cnJlbnQgY2FsbCBzdGFjayBoYXNcbiAgLy8gY2xlYXJlZC5cbiAgXy5kZWZlciA9IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICByZXR1cm4gXy5kZWxheS5hcHBseShfLCBbZnVuYywgMV0uY29uY2F0KHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSkpO1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiwgdGhhdCwgd2hlbiBpbnZva2VkLCB3aWxsIG9ubHkgYmUgdHJpZ2dlcmVkIGF0IG1vc3Qgb25jZVxuICAvLyBkdXJpbmcgYSBnaXZlbiB3aW5kb3cgb2YgdGltZS4gTm9ybWFsbHksIHRoZSB0aHJvdHRsZWQgZnVuY3Rpb24gd2lsbCBydW5cbiAgLy8gYXMgbXVjaCBhcyBpdCBjYW4sIHdpdGhvdXQgZXZlciBnb2luZyBtb3JlIHRoYW4gb25jZSBwZXIgYHdhaXRgIGR1cmF0aW9uO1xuICAvLyBidXQgaWYgeW91J2QgbGlrZSB0byBkaXNhYmxlIHRoZSBleGVjdXRpb24gb24gdGhlIGxlYWRpbmcgZWRnZSwgcGFzc1xuICAvLyBge2xlYWRpbmc6IGZhbHNlfWAuIFRvIGRpc2FibGUgZXhlY3V0aW9uIG9uIHRoZSB0cmFpbGluZyBlZGdlLCBkaXR0by5cbiAgXy50aHJvdHRsZSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQsIG9wdGlvbnMpIHtcbiAgICB2YXIgY29udGV4dCwgYXJncywgcmVzdWx0O1xuICAgIHZhciB0aW1lb3V0ID0gbnVsbDtcbiAgICB2YXIgcHJldmlvdXMgPSAwO1xuICAgIG9wdGlvbnMgfHwgKG9wdGlvbnMgPSB7fSk7XG4gICAgdmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICBwcmV2aW91cyA9IG9wdGlvbnMubGVhZGluZyA9PT0gZmFsc2UgPyAwIDogXy5ub3coKTtcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBub3cgPSBfLm5vdygpO1xuICAgICAgaWYgKCFwcmV2aW91cyAmJiBvcHRpb25zLmxlYWRpbmcgPT09IGZhbHNlKSBwcmV2aW91cyA9IG5vdztcbiAgICAgIHZhciByZW1haW5pbmcgPSB3YWl0IC0gKG5vdyAtIHByZXZpb3VzKTtcbiAgICAgIGNvbnRleHQgPSB0aGlzO1xuICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIGlmIChyZW1haW5pbmcgPD0gMCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICBwcmV2aW91cyA9IG5vdztcbiAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgfSBlbHNlIGlmICghdGltZW91dCAmJiBvcHRpb25zLnRyYWlsaW5nICE9PSBmYWxzZSkge1xuICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgcmVtYWluaW5nKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIGFzIGxvbmcgYXMgaXQgY29udGludWVzIHRvIGJlIGludm9rZWQsIHdpbGwgbm90XG4gIC8vIGJlIHRyaWdnZXJlZC4gVGhlIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIGFmdGVyIGl0IHN0b3BzIGJlaW5nIGNhbGxlZCBmb3JcbiAgLy8gTiBtaWxsaXNlY29uZHMuIElmIGBpbW1lZGlhdGVgIGlzIHBhc3NlZCwgdHJpZ2dlciB0aGUgZnVuY3Rpb24gb24gdGhlXG4gIC8vIGxlYWRpbmcgZWRnZSwgaW5zdGVhZCBvZiB0aGUgdHJhaWxpbmcuXG4gIF8uZGVib3VuY2UgPSBmdW5jdGlvbihmdW5jLCB3YWl0LCBpbW1lZGlhdGUpIHtcbiAgICB2YXIgdGltZW91dCwgYXJncywgY29udGV4dCwgdGltZXN0YW1wLCByZXN1bHQ7XG5cbiAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBsYXN0ID0gXy5ub3coKSAtIHRpbWVzdGFtcDtcbiAgICAgIGlmIChsYXN0IDwgd2FpdCkge1xuICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCAtIGxhc3QpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgIGlmICghaW1tZWRpYXRlKSB7XG4gICAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgICBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgY29udGV4dCA9IHRoaXM7XG4gICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgdGltZXN0YW1wID0gXy5ub3coKTtcbiAgICAgIHZhciBjYWxsTm93ID0gaW1tZWRpYXRlICYmICF0aW1lb3V0O1xuICAgICAgaWYgKCF0aW1lb3V0KSB7XG4gICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcbiAgICAgIH1cbiAgICAgIGlmIChjYWxsTm93KSB7XG4gICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgZXhlY3V0ZWQgYXQgbW9zdCBvbmUgdGltZSwgbm8gbWF0dGVyIGhvd1xuICAvLyBvZnRlbiB5b3UgY2FsbCBpdC4gVXNlZnVsIGZvciBsYXp5IGluaXRpYWxpemF0aW9uLlxuICBfLm9uY2UgPSBmdW5jdGlvbihmdW5jKSB7XG4gICAgdmFyIHJhbiA9IGZhbHNlLCBtZW1vO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChyYW4pIHJldHVybiBtZW1vO1xuICAgICAgcmFuID0gdHJ1ZTtcbiAgICAgIG1lbW8gPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICBmdW5jID0gbnVsbDtcbiAgICAgIHJldHVybiBtZW1vO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyB0aGUgZmlyc3QgZnVuY3Rpb24gcGFzc2VkIGFzIGFuIGFyZ3VtZW50IHRvIHRoZSBzZWNvbmQsXG4gIC8vIGFsbG93aW5nIHlvdSB0byBhZGp1c3QgYXJndW1lbnRzLCBydW4gY29kZSBiZWZvcmUgYW5kIGFmdGVyLCBhbmRcbiAgLy8gY29uZGl0aW9uYWxseSBleGVjdXRlIHRoZSBvcmlnaW5hbCBmdW5jdGlvbi5cbiAgXy53cmFwID0gZnVuY3Rpb24oZnVuYywgd3JhcHBlcikge1xuICAgIHJldHVybiBfLnBhcnRpYWwod3JhcHBlciwgZnVuYyk7XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgaXMgdGhlIGNvbXBvc2l0aW9uIG9mIGEgbGlzdCBvZiBmdW5jdGlvbnMsIGVhY2hcbiAgLy8gY29uc3VtaW5nIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIGZ1bmN0aW9uIHRoYXQgZm9sbG93cy5cbiAgXy5jb21wb3NlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGZ1bmNzID0gYXJndW1lbnRzO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgZm9yICh2YXIgaSA9IGZ1bmNzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGFyZ3MgPSBbZnVuY3NbaV0uYXBwbHkodGhpcywgYXJncyldO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGFyZ3NbMF07XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIG9ubHkgYmUgZXhlY3V0ZWQgYWZ0ZXIgYmVpbmcgY2FsbGVkIE4gdGltZXMuXG4gIF8uYWZ0ZXIgPSBmdW5jdGlvbih0aW1lcywgZnVuYykge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICgtLXRpbWVzIDwgMSkge1xuICAgICAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfVxuICAgIH07XG4gIH07XG5cbiAgLy8gT2JqZWN0IEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gUmV0cmlldmUgdGhlIG5hbWVzIG9mIGFuIG9iamVjdCdzIHByb3BlcnRpZXMuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBPYmplY3Qua2V5c2BcbiAgXy5rZXlzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFfLmlzT2JqZWN0KG9iaikpIHJldHVybiBbXTtcbiAgICBpZiAobmF0aXZlS2V5cykgcmV0dXJuIG5hdGl2ZUtleXMob2JqKTtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGlmIChfLmhhcyhvYmosIGtleSkpIGtleXMucHVzaChrZXkpO1xuICAgIHJldHVybiBrZXlzO1xuICB9O1xuXG4gIC8vIFJldHJpZXZlIHRoZSB2YWx1ZXMgb2YgYW4gb2JqZWN0J3MgcHJvcGVydGllcy5cbiAgXy52YWx1ZXMgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopO1xuICAgIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICB2YXIgdmFsdWVzID0gbmV3IEFycmF5KGxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFsdWVzW2ldID0gb2JqW2tleXNbaV1dO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWVzO1xuICB9O1xuXG4gIC8vIENvbnZlcnQgYW4gb2JqZWN0IGludG8gYSBsaXN0IG9mIGBba2V5LCB2YWx1ZV1gIHBhaXJzLlxuICBfLnBhaXJzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgdmFyIHBhaXJzID0gbmV3IEFycmF5KGxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgcGFpcnNbaV0gPSBba2V5c1tpXSwgb2JqW2tleXNbaV1dXTtcbiAgICB9XG4gICAgcmV0dXJuIHBhaXJzO1xuICB9O1xuXG4gIC8vIEludmVydCB0aGUga2V5cyBhbmQgdmFsdWVzIG9mIGFuIG9iamVjdC4gVGhlIHZhbHVlcyBtdXN0IGJlIHNlcmlhbGl6YWJsZS5cbiAgXy5pbnZlcnQgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgcmVzdWx0W29ialtrZXlzW2ldXV0gPSBrZXlzW2ldO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFJldHVybiBhIHNvcnRlZCBsaXN0IG9mIHRoZSBmdW5jdGlvbiBuYW1lcyBhdmFpbGFibGUgb24gdGhlIG9iamVjdC5cbiAgLy8gQWxpYXNlZCBhcyBgbWV0aG9kc2BcbiAgXy5mdW5jdGlvbnMgPSBfLm1ldGhvZHMgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgbmFtZXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICBpZiAoXy5pc0Z1bmN0aW9uKG9ialtrZXldKSkgbmFtZXMucHVzaChrZXkpO1xuICAgIH1cbiAgICByZXR1cm4gbmFtZXMuc29ydCgpO1xuICB9O1xuXG4gIC8vIEV4dGVuZCBhIGdpdmVuIG9iamVjdCB3aXRoIGFsbCB0aGUgcHJvcGVydGllcyBpbiBwYXNzZWQtaW4gb2JqZWN0KHMpLlxuICBfLmV4dGVuZCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGVhY2goc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLCBmdW5jdGlvbihzb3VyY2UpIHtcbiAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBzb3VyY2UpIHtcbiAgICAgICAgICBvYmpbcHJvcF0gPSBzb3VyY2VbcHJvcF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIFJldHVybiBhIGNvcHkgb2YgdGhlIG9iamVjdCBvbmx5IGNvbnRhaW5pbmcgdGhlIHdoaXRlbGlzdGVkIHByb3BlcnRpZXMuXG4gIF8ucGljayA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBjb3B5ID0ge307XG4gICAgdmFyIGtleXMgPSBjb25jYXQuYXBwbHkoQXJyYXlQcm90bywgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICBlYWNoKGtleXMsIGZ1bmN0aW9uKGtleSkge1xuICAgICAgaWYgKGtleSBpbiBvYmopIGNvcHlba2V5XSA9IG9ialtrZXldO1xuICAgIH0pO1xuICAgIHJldHVybiBjb3B5O1xuICB9O1xuXG4gICAvLyBSZXR1cm4gYSBjb3B5IG9mIHRoZSBvYmplY3Qgd2l0aG91dCB0aGUgYmxhY2tsaXN0ZWQgcHJvcGVydGllcy5cbiAgXy5vbWl0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGNvcHkgPSB7fTtcbiAgICB2YXIga2V5cyA9IGNvbmNhdC5hcHBseShBcnJheVByb3RvLCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgIGlmICghXy5jb250YWlucyhrZXlzLCBrZXkpKSBjb3B5W2tleV0gPSBvYmpba2V5XTtcbiAgICB9XG4gICAgcmV0dXJuIGNvcHk7XG4gIH07XG5cbiAgLy8gRmlsbCBpbiBhIGdpdmVuIG9iamVjdCB3aXRoIGRlZmF1bHQgcHJvcGVydGllcy5cbiAgXy5kZWZhdWx0cyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGVhY2goc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLCBmdW5jdGlvbihzb3VyY2UpIHtcbiAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBzb3VyY2UpIHtcbiAgICAgICAgICBpZiAob2JqW3Byb3BdID09PSB2b2lkIDApIG9ialtwcm9wXSA9IHNvdXJjZVtwcm9wXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gQ3JlYXRlIGEgKHNoYWxsb3ctY2xvbmVkKSBkdXBsaWNhdGUgb2YgYW4gb2JqZWN0LlxuICBfLmNsb25lID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFfLmlzT2JqZWN0KG9iaikpIHJldHVybiBvYmo7XG4gICAgcmV0dXJuIF8uaXNBcnJheShvYmopID8gb2JqLnNsaWNlKCkgOiBfLmV4dGVuZCh7fSwgb2JqKTtcbiAgfTtcblxuICAvLyBJbnZva2VzIGludGVyY2VwdG9yIHdpdGggdGhlIG9iaiwgYW5kIHRoZW4gcmV0dXJucyBvYmouXG4gIC8vIFRoZSBwcmltYXJ5IHB1cnBvc2Ugb2YgdGhpcyBtZXRob2QgaXMgdG8gXCJ0YXAgaW50b1wiIGEgbWV0aG9kIGNoYWluLCBpblxuICAvLyBvcmRlciB0byBwZXJmb3JtIG9wZXJhdGlvbnMgb24gaW50ZXJtZWRpYXRlIHJlc3VsdHMgd2l0aGluIHRoZSBjaGFpbi5cbiAgXy50YXAgPSBmdW5jdGlvbihvYmosIGludGVyY2VwdG9yKSB7XG4gICAgaW50ZXJjZXB0b3Iob2JqKTtcbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIEludGVybmFsIHJlY3Vyc2l2ZSBjb21wYXJpc29uIGZ1bmN0aW9uIGZvciBgaXNFcXVhbGAuXG4gIHZhciBlcSA9IGZ1bmN0aW9uKGEsIGIsIGFTdGFjaywgYlN0YWNrKSB7XG4gICAgLy8gSWRlbnRpY2FsIG9iamVjdHMgYXJlIGVxdWFsLiBgMCA9PT0gLTBgLCBidXQgdGhleSBhcmVuJ3QgaWRlbnRpY2FsLlxuICAgIC8vIFNlZSB0aGUgW0hhcm1vbnkgYGVnYWxgIHByb3Bvc2FsXShodHRwOi8vd2lraS5lY21hc2NyaXB0Lm9yZy9kb2t1LnBocD9pZD1oYXJtb255OmVnYWwpLlxuICAgIGlmIChhID09PSBiKSByZXR1cm4gYSAhPT0gMCB8fCAxIC8gYSA9PSAxIC8gYjtcbiAgICAvLyBBIHN0cmljdCBjb21wYXJpc29uIGlzIG5lY2Vzc2FyeSBiZWNhdXNlIGBudWxsID09IHVuZGVmaW5lZGAuXG4gICAgaWYgKGEgPT0gbnVsbCB8fCBiID09IG51bGwpIHJldHVybiBhID09PSBiO1xuICAgIC8vIFVud3JhcCBhbnkgd3JhcHBlZCBvYmplY3RzLlxuICAgIGlmIChhIGluc3RhbmNlb2YgXykgYSA9IGEuX3dyYXBwZWQ7XG4gICAgaWYgKGIgaW5zdGFuY2VvZiBfKSBiID0gYi5fd3JhcHBlZDtcbiAgICAvLyBDb21wYXJlIGBbW0NsYXNzXV1gIG5hbWVzLlxuICAgIHZhciBjbGFzc05hbWUgPSB0b1N0cmluZy5jYWxsKGEpO1xuICAgIGlmIChjbGFzc05hbWUgIT0gdG9TdHJpbmcuY2FsbChiKSkgcmV0dXJuIGZhbHNlO1xuICAgIHN3aXRjaCAoY2xhc3NOYW1lKSB7XG4gICAgICAvLyBTdHJpbmdzLCBudW1iZXJzLCBkYXRlcywgYW5kIGJvb2xlYW5zIGFyZSBjb21wYXJlZCBieSB2YWx1ZS5cbiAgICAgIGNhc2UgJ1tvYmplY3QgU3RyaW5nXSc6XG4gICAgICAgIC8vIFByaW1pdGl2ZXMgYW5kIHRoZWlyIGNvcnJlc3BvbmRpbmcgb2JqZWN0IHdyYXBwZXJzIGFyZSBlcXVpdmFsZW50OyB0aHVzLCBgXCI1XCJgIGlzXG4gICAgICAgIC8vIGVxdWl2YWxlbnQgdG8gYG5ldyBTdHJpbmcoXCI1XCIpYC5cbiAgICAgICAgcmV0dXJuIGEgPT0gU3RyaW5nKGIpO1xuICAgICAgY2FzZSAnW29iamVjdCBOdW1iZXJdJzpcbiAgICAgICAgLy8gYE5hTmBzIGFyZSBlcXVpdmFsZW50LCBidXQgbm9uLXJlZmxleGl2ZS4gQW4gYGVnYWxgIGNvbXBhcmlzb24gaXMgcGVyZm9ybWVkIGZvclxuICAgICAgICAvLyBvdGhlciBudW1lcmljIHZhbHVlcy5cbiAgICAgICAgcmV0dXJuIGEgIT0gK2EgPyBiICE9ICtiIDogKGEgPT0gMCA/IDEgLyBhID09IDEgLyBiIDogYSA9PSArYik7XG4gICAgICBjYXNlICdbb2JqZWN0IERhdGVdJzpcbiAgICAgIGNhc2UgJ1tvYmplY3QgQm9vbGVhbl0nOlxuICAgICAgICAvLyBDb2VyY2UgZGF0ZXMgYW5kIGJvb2xlYW5zIHRvIG51bWVyaWMgcHJpbWl0aXZlIHZhbHVlcy4gRGF0ZXMgYXJlIGNvbXBhcmVkIGJ5IHRoZWlyXG4gICAgICAgIC8vIG1pbGxpc2Vjb25kIHJlcHJlc2VudGF0aW9ucy4gTm90ZSB0aGF0IGludmFsaWQgZGF0ZXMgd2l0aCBtaWxsaXNlY29uZCByZXByZXNlbnRhdGlvbnNcbiAgICAgICAgLy8gb2YgYE5hTmAgYXJlIG5vdCBlcXVpdmFsZW50LlxuICAgICAgICByZXR1cm4gK2EgPT0gK2I7XG4gICAgICAvLyBSZWdFeHBzIGFyZSBjb21wYXJlZCBieSB0aGVpciBzb3VyY2UgcGF0dGVybnMgYW5kIGZsYWdzLlxuICAgICAgY2FzZSAnW29iamVjdCBSZWdFeHBdJzpcbiAgICAgICAgcmV0dXJuIGEuc291cmNlID09IGIuc291cmNlICYmXG4gICAgICAgICAgICAgICBhLmdsb2JhbCA9PSBiLmdsb2JhbCAmJlxuICAgICAgICAgICAgICAgYS5tdWx0aWxpbmUgPT0gYi5tdWx0aWxpbmUgJiZcbiAgICAgICAgICAgICAgIGEuaWdub3JlQ2FzZSA9PSBiLmlnbm9yZUNhc2U7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgYSAhPSAnb2JqZWN0JyB8fCB0eXBlb2YgYiAhPSAnb2JqZWN0JykgcmV0dXJuIGZhbHNlO1xuICAgIC8vIEFzc3VtZSBlcXVhbGl0eSBmb3IgY3ljbGljIHN0cnVjdHVyZXMuIFRoZSBhbGdvcml0aG0gZm9yIGRldGVjdGluZyBjeWNsaWNcbiAgICAvLyBzdHJ1Y3R1cmVzIGlzIGFkYXB0ZWQgZnJvbSBFUyA1LjEgc2VjdGlvbiAxNS4xMi4zLCBhYnN0cmFjdCBvcGVyYXRpb24gYEpPYC5cbiAgICB2YXIgbGVuZ3RoID0gYVN0YWNrLmxlbmd0aDtcbiAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgIC8vIExpbmVhciBzZWFyY2guIFBlcmZvcm1hbmNlIGlzIGludmVyc2VseSBwcm9wb3J0aW9uYWwgdG8gdGhlIG51bWJlciBvZlxuICAgICAgLy8gdW5pcXVlIG5lc3RlZCBzdHJ1Y3R1cmVzLlxuICAgICAgaWYgKGFTdGFja1tsZW5ndGhdID09IGEpIHJldHVybiBiU3RhY2tbbGVuZ3RoXSA9PSBiO1xuICAgIH1cbiAgICAvLyBPYmplY3RzIHdpdGggZGlmZmVyZW50IGNvbnN0cnVjdG9ycyBhcmUgbm90IGVxdWl2YWxlbnQsIGJ1dCBgT2JqZWN0YHNcbiAgICAvLyBmcm9tIGRpZmZlcmVudCBmcmFtZXMgYXJlLlxuICAgIHZhciBhQ3RvciA9IGEuY29uc3RydWN0b3IsIGJDdG9yID0gYi5jb25zdHJ1Y3RvcjtcbiAgICBpZiAoYUN0b3IgIT09IGJDdG9yICYmICEoXy5pc0Z1bmN0aW9uKGFDdG9yKSAmJiAoYUN0b3IgaW5zdGFuY2VvZiBhQ3RvcikgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5pc0Z1bmN0aW9uKGJDdG9yKSAmJiAoYkN0b3IgaW5zdGFuY2VvZiBiQ3RvcikpXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiAoJ2NvbnN0cnVjdG9yJyBpbiBhICYmICdjb25zdHJ1Y3RvcicgaW4gYikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8gQWRkIHRoZSBmaXJzdCBvYmplY3QgdG8gdGhlIHN0YWNrIG9mIHRyYXZlcnNlZCBvYmplY3RzLlxuICAgIGFTdGFjay5wdXNoKGEpO1xuICAgIGJTdGFjay5wdXNoKGIpO1xuICAgIHZhciBzaXplID0gMCwgcmVzdWx0ID0gdHJ1ZTtcbiAgICAvLyBSZWN1cnNpdmVseSBjb21wYXJlIG9iamVjdHMgYW5kIGFycmF5cy5cbiAgICBpZiAoY2xhc3NOYW1lID09ICdbb2JqZWN0IEFycmF5XScpIHtcbiAgICAgIC8vIENvbXBhcmUgYXJyYXkgbGVuZ3RocyB0byBkZXRlcm1pbmUgaWYgYSBkZWVwIGNvbXBhcmlzb24gaXMgbmVjZXNzYXJ5LlxuICAgICAgc2l6ZSA9IGEubGVuZ3RoO1xuICAgICAgcmVzdWx0ID0gc2l6ZSA9PSBiLmxlbmd0aDtcbiAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgLy8gRGVlcCBjb21wYXJlIHRoZSBjb250ZW50cywgaWdub3Jpbmcgbm9uLW51bWVyaWMgcHJvcGVydGllcy5cbiAgICAgICAgd2hpbGUgKHNpemUtLSkge1xuICAgICAgICAgIGlmICghKHJlc3VsdCA9IGVxKGFbc2l6ZV0sIGJbc2l6ZV0sIGFTdGFjaywgYlN0YWNrKSkpIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIERlZXAgY29tcGFyZSBvYmplY3RzLlxuICAgICAgZm9yICh2YXIga2V5IGluIGEpIHtcbiAgICAgICAgaWYgKF8uaGFzKGEsIGtleSkpIHtcbiAgICAgICAgICAvLyBDb3VudCB0aGUgZXhwZWN0ZWQgbnVtYmVyIG9mIHByb3BlcnRpZXMuXG4gICAgICAgICAgc2l6ZSsrO1xuICAgICAgICAgIC8vIERlZXAgY29tcGFyZSBlYWNoIG1lbWJlci5cbiAgICAgICAgICBpZiAoIShyZXN1bHQgPSBfLmhhcyhiLCBrZXkpICYmIGVxKGFba2V5XSwgYltrZXldLCBhU3RhY2ssIGJTdGFjaykpKSBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gRW5zdXJlIHRoYXQgYm90aCBvYmplY3RzIGNvbnRhaW4gdGhlIHNhbWUgbnVtYmVyIG9mIHByb3BlcnRpZXMuXG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIGZvciAoa2V5IGluIGIpIHtcbiAgICAgICAgICBpZiAoXy5oYXMoYiwga2V5KSAmJiAhKHNpemUtLSkpIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdCA9ICFzaXplO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBSZW1vdmUgdGhlIGZpcnN0IG9iamVjdCBmcm9tIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAgICBhU3RhY2sucG9wKCk7XG4gICAgYlN0YWNrLnBvcCgpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUGVyZm9ybSBhIGRlZXAgY29tcGFyaXNvbiB0byBjaGVjayBpZiB0d28gb2JqZWN0cyBhcmUgZXF1YWwuXG4gIF8uaXNFcXVhbCA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gZXEoYSwgYiwgW10sIFtdKTtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIGFycmF5LCBzdHJpbmcsIG9yIG9iamVjdCBlbXB0eT9cbiAgLy8gQW4gXCJlbXB0eVwiIG9iamVjdCBoYXMgbm8gZW51bWVyYWJsZSBvd24tcHJvcGVydGllcy5cbiAgXy5pc0VtcHR5ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAoXy5pc0FycmF5KG9iaikgfHwgXy5pc1N0cmluZyhvYmopKSByZXR1cm4gb2JqLmxlbmd0aCA9PT0gMDtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSBpZiAoXy5oYXMob2JqLCBrZXkpKSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBhIERPTSBlbGVtZW50P1xuICBfLmlzRWxlbWVudCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiAhIShvYmogJiYgb2JqLm5vZGVUeXBlID09PSAxKTtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGFuIGFycmF5P1xuICAvLyBEZWxlZ2F0ZXMgdG8gRUNNQTUncyBuYXRpdmUgQXJyYXkuaXNBcnJheVxuICBfLmlzQXJyYXkgPSBuYXRpdmVJc0FycmF5IHx8IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT0gJ1tvYmplY3QgQXJyYXldJztcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhcmlhYmxlIGFuIG9iamVjdD9cbiAgXy5pc09iamVjdCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IE9iamVjdChvYmopO1xuICB9O1xuXG4gIC8vIEFkZCBzb21lIGlzVHlwZSBtZXRob2RzOiBpc0FyZ3VtZW50cywgaXNGdW5jdGlvbiwgaXNTdHJpbmcsIGlzTnVtYmVyLCBpc0RhdGUsIGlzUmVnRXhwLlxuICBlYWNoKFsnQXJndW1lbnRzJywgJ0Z1bmN0aW9uJywgJ1N0cmluZycsICdOdW1iZXInLCAnRGF0ZScsICdSZWdFeHAnXSwgZnVuY3Rpb24obmFtZSkge1xuICAgIF9bJ2lzJyArIG5hbWVdID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09ICdbb2JqZWN0ICcgKyBuYW1lICsgJ10nO1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIERlZmluZSBhIGZhbGxiYWNrIHZlcnNpb24gb2YgdGhlIG1ldGhvZCBpbiBicm93c2VycyAoYWhlbSwgSUUpLCB3aGVyZVxuICAvLyB0aGVyZSBpc24ndCBhbnkgaW5zcGVjdGFibGUgXCJBcmd1bWVudHNcIiB0eXBlLlxuICBpZiAoIV8uaXNBcmd1bWVudHMoYXJndW1lbnRzKSkge1xuICAgIF8uaXNBcmd1bWVudHMgPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiAhIShvYmogJiYgXy5oYXMob2JqLCAnY2FsbGVlJykpO1xuICAgIH07XG4gIH1cblxuICAvLyBPcHRpbWl6ZSBgaXNGdW5jdGlvbmAgaWYgYXBwcm9wcmlhdGUuXG4gIGlmICh0eXBlb2YgKC8uLykgIT09ICdmdW5jdGlvbicpIHtcbiAgICBfLmlzRnVuY3Rpb24gPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSAnZnVuY3Rpb24nO1xuICAgIH07XG4gIH1cblxuICAvLyBJcyBhIGdpdmVuIG9iamVjdCBhIGZpbml0ZSBudW1iZXI/XG4gIF8uaXNGaW5pdGUgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gaXNGaW5pdGUob2JqKSAmJiAhaXNOYU4ocGFyc2VGbG9hdChvYmopKTtcbiAgfTtcblxuICAvLyBJcyB0aGUgZ2l2ZW4gdmFsdWUgYE5hTmA/IChOYU4gaXMgdGhlIG9ubHkgbnVtYmVyIHdoaWNoIGRvZXMgbm90IGVxdWFsIGl0c2VsZikuXG4gIF8uaXNOYU4gPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gXy5pc051bWJlcihvYmopICYmIG9iaiAhPSArb2JqO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgYSBib29sZWFuP1xuICBfLmlzQm9vbGVhbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IHRydWUgfHwgb2JqID09PSBmYWxzZSB8fCB0b1N0cmluZy5jYWxsKG9iaikgPT0gJ1tvYmplY3QgQm9vbGVhbl0nO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgZXF1YWwgdG8gbnVsbD9cbiAgXy5pc051bGwgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSBudWxsO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFyaWFibGUgdW5kZWZpbmVkP1xuICBfLmlzVW5kZWZpbmVkID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gdm9pZCAwO1xuICB9O1xuXG4gIC8vIFNob3J0Y3V0IGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhbiBvYmplY3QgaGFzIGEgZ2l2ZW4gcHJvcGVydHkgZGlyZWN0bHlcbiAgLy8gb24gaXRzZWxmIChpbiBvdGhlciB3b3Jkcywgbm90IG9uIGEgcHJvdG90eXBlKS5cbiAgXy5oYXMgPSBmdW5jdGlvbihvYmosIGtleSkge1xuICAgIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KTtcbiAgfTtcblxuICAvLyBVdGlsaXR5IEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIFJ1biBVbmRlcnNjb3JlLmpzIGluICpub0NvbmZsaWN0KiBtb2RlLCByZXR1cm5pbmcgdGhlIGBfYCB2YXJpYWJsZSB0byBpdHNcbiAgLy8gcHJldmlvdXMgb3duZXIuIFJldHVybnMgYSByZWZlcmVuY2UgdG8gdGhlIFVuZGVyc2NvcmUgb2JqZWN0LlxuICBfLm5vQ29uZmxpY3QgPSBmdW5jdGlvbigpIHtcbiAgICByb290Ll8gPSBwcmV2aW91c1VuZGVyc2NvcmU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLy8gS2VlcCB0aGUgaWRlbnRpdHkgZnVuY3Rpb24gYXJvdW5kIGZvciBkZWZhdWx0IGl0ZXJhdG9ycy5cbiAgXy5pZGVudGl0eSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xuXG4gIF8uY29uc3RhbnQgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcbiAgfTtcblxuICBfLnByb3BlcnR5ID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9ialtrZXldO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIHByZWRpY2F0ZSBmb3IgY2hlY2tpbmcgd2hldGhlciBhbiBvYmplY3QgaGFzIGEgZ2l2ZW4gc2V0IG9mIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLm1hdGNoZXMgPSBmdW5jdGlvbihhdHRycykge1xuICAgIHJldHVybiBmdW5jdGlvbihvYmopIHtcbiAgICAgIGlmIChvYmogPT09IGF0dHJzKSByZXR1cm4gdHJ1ZTsgLy9hdm9pZCBjb21wYXJpbmcgYW4gb2JqZWN0IHRvIGl0c2VsZi5cbiAgICAgIGZvciAodmFyIGtleSBpbiBhdHRycykge1xuICAgICAgICBpZiAoYXR0cnNba2V5XSAhPT0gb2JqW2tleV0pXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9O1xuXG4gIC8vIFJ1biBhIGZ1bmN0aW9uICoqbioqIHRpbWVzLlxuICBfLnRpbWVzID0gZnVuY3Rpb24obiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICB2YXIgYWNjdW0gPSBBcnJheShNYXRoLm1heCgwLCBuKSk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuOyBpKyspIGFjY3VtW2ldID0gaXRlcmF0b3IuY2FsbChjb250ZXh0LCBpKTtcbiAgICByZXR1cm4gYWNjdW07XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgcmFuZG9tIGludGVnZXIgYmV0d2VlbiBtaW4gYW5kIG1heCAoaW5jbHVzaXZlKS5cbiAgXy5yYW5kb20gPSBmdW5jdGlvbihtaW4sIG1heCkge1xuICAgIGlmIChtYXggPT0gbnVsbCkge1xuICAgICAgbWF4ID0gbWluO1xuICAgICAgbWluID0gMDtcbiAgICB9XG4gICAgcmV0dXJuIG1pbiArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSk7XG4gIH07XG5cbiAgLy8gQSAocG9zc2libHkgZmFzdGVyKSB3YXkgdG8gZ2V0IHRoZSBjdXJyZW50IHRpbWVzdGFtcCBhcyBhbiBpbnRlZ2VyLlxuICBfLm5vdyA9IERhdGUubm93IHx8IGZ1bmN0aW9uKCkgeyByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7IH07XG5cbiAgLy8gTGlzdCBvZiBIVE1MIGVudGl0aWVzIGZvciBlc2NhcGluZy5cbiAgdmFyIGVudGl0eU1hcCA9IHtcbiAgICBlc2NhcGU6IHtcbiAgICAgICcmJzogJyZhbXA7JyxcbiAgICAgICc8JzogJyZsdDsnLFxuICAgICAgJz4nOiAnJmd0OycsXG4gICAgICAnXCInOiAnJnF1b3Q7JyxcbiAgICAgIFwiJ1wiOiAnJiN4Mjc7J1xuICAgIH1cbiAgfTtcbiAgZW50aXR5TWFwLnVuZXNjYXBlID0gXy5pbnZlcnQoZW50aXR5TWFwLmVzY2FwZSk7XG5cbiAgLy8gUmVnZXhlcyBjb250YWluaW5nIHRoZSBrZXlzIGFuZCB2YWx1ZXMgbGlzdGVkIGltbWVkaWF0ZWx5IGFib3ZlLlxuICB2YXIgZW50aXR5UmVnZXhlcyA9IHtcbiAgICBlc2NhcGU6ICAgbmV3IFJlZ0V4cCgnWycgKyBfLmtleXMoZW50aXR5TWFwLmVzY2FwZSkuam9pbignJykgKyAnXScsICdnJyksXG4gICAgdW5lc2NhcGU6IG5ldyBSZWdFeHAoJygnICsgXy5rZXlzKGVudGl0eU1hcC51bmVzY2FwZSkuam9pbignfCcpICsgJyknLCAnZycpXG4gIH07XG5cbiAgLy8gRnVuY3Rpb25zIGZvciBlc2NhcGluZyBhbmQgdW5lc2NhcGluZyBzdHJpbmdzIHRvL2Zyb20gSFRNTCBpbnRlcnBvbGF0aW9uLlxuICBfLmVhY2goWydlc2NhcGUnLCAndW5lc2NhcGUnXSwgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgX1ttZXRob2RdID0gZnVuY3Rpb24oc3RyaW5nKSB7XG4gICAgICBpZiAoc3RyaW5nID09IG51bGwpIHJldHVybiAnJztcbiAgICAgIHJldHVybiAoJycgKyBzdHJpbmcpLnJlcGxhY2UoZW50aXR5UmVnZXhlc1ttZXRob2RdLCBmdW5jdGlvbihtYXRjaCkge1xuICAgICAgICByZXR1cm4gZW50aXR5TWFwW21ldGhvZF1bbWF0Y2hdO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gSWYgdGhlIHZhbHVlIG9mIHRoZSBuYW1lZCBgcHJvcGVydHlgIGlzIGEgZnVuY3Rpb24gdGhlbiBpbnZva2UgaXQgd2l0aCB0aGVcbiAgLy8gYG9iamVjdGAgYXMgY29udGV4dDsgb3RoZXJ3aXNlLCByZXR1cm4gaXQuXG4gIF8ucmVzdWx0ID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkge1xuICAgIGlmIChvYmplY3QgPT0gbnVsbCkgcmV0dXJuIHZvaWQgMDtcbiAgICB2YXIgdmFsdWUgPSBvYmplY3RbcHJvcGVydHldO1xuICAgIHJldHVybiBfLmlzRnVuY3Rpb24odmFsdWUpID8gdmFsdWUuY2FsbChvYmplY3QpIDogdmFsdWU7XG4gIH07XG5cbiAgLy8gQWRkIHlvdXIgb3duIGN1c3RvbSBmdW5jdGlvbnMgdG8gdGhlIFVuZGVyc2NvcmUgb2JqZWN0LlxuICBfLm1peGluID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgZWFjaChfLmZ1bmN0aW9ucyhvYmopLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgICB2YXIgZnVuYyA9IF9bbmFtZV0gPSBvYmpbbmFtZV07XG4gICAgICBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJncyA9IFt0aGlzLl93cmFwcGVkXTtcbiAgICAgICAgcHVzaC5hcHBseShhcmdzLCBhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gcmVzdWx0LmNhbGwodGhpcywgZnVuYy5hcHBseShfLCBhcmdzKSk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIEdlbmVyYXRlIGEgdW5pcXVlIGludGVnZXIgaWQgKHVuaXF1ZSB3aXRoaW4gdGhlIGVudGlyZSBjbGllbnQgc2Vzc2lvbikuXG4gIC8vIFVzZWZ1bCBmb3IgdGVtcG9yYXJ5IERPTSBpZHMuXG4gIHZhciBpZENvdW50ZXIgPSAwO1xuICBfLnVuaXF1ZUlkID0gZnVuY3Rpb24ocHJlZml4KSB7XG4gICAgdmFyIGlkID0gKytpZENvdW50ZXIgKyAnJztcbiAgICByZXR1cm4gcHJlZml4ID8gcHJlZml4ICsgaWQgOiBpZDtcbiAgfTtcblxuICAvLyBCeSBkZWZhdWx0LCBVbmRlcnNjb3JlIHVzZXMgRVJCLXN0eWxlIHRlbXBsYXRlIGRlbGltaXRlcnMsIGNoYW5nZSB0aGVcbiAgLy8gZm9sbG93aW5nIHRlbXBsYXRlIHNldHRpbmdzIHRvIHVzZSBhbHRlcm5hdGl2ZSBkZWxpbWl0ZXJzLlxuICBfLnRlbXBsYXRlU2V0dGluZ3MgPSB7XG4gICAgZXZhbHVhdGUgICAgOiAvPCUoW1xcc1xcU10rPyklPi9nLFxuICAgIGludGVycG9sYXRlIDogLzwlPShbXFxzXFxTXSs/KSU+L2csXG4gICAgZXNjYXBlICAgICAgOiAvPCUtKFtcXHNcXFNdKz8pJT4vZ1xuICB9O1xuXG4gIC8vIFdoZW4gY3VzdG9taXppbmcgYHRlbXBsYXRlU2V0dGluZ3NgLCBpZiB5b3UgZG9uJ3Qgd2FudCB0byBkZWZpbmUgYW5cbiAgLy8gaW50ZXJwb2xhdGlvbiwgZXZhbHVhdGlvbiBvciBlc2NhcGluZyByZWdleCwgd2UgbmVlZCBvbmUgdGhhdCBpc1xuICAvLyBndWFyYW50ZWVkIG5vdCB0byBtYXRjaC5cbiAgdmFyIG5vTWF0Y2ggPSAvKC4pXi87XG5cbiAgLy8gQ2VydGFpbiBjaGFyYWN0ZXJzIG5lZWQgdG8gYmUgZXNjYXBlZCBzbyB0aGF0IHRoZXkgY2FuIGJlIHB1dCBpbnRvIGFcbiAgLy8gc3RyaW5nIGxpdGVyYWwuXG4gIHZhciBlc2NhcGVzID0ge1xuICAgIFwiJ1wiOiAgICAgIFwiJ1wiLFxuICAgICdcXFxcJzogICAgICdcXFxcJyxcbiAgICAnXFxyJzogICAgICdyJyxcbiAgICAnXFxuJzogICAgICduJyxcbiAgICAnXFx0JzogICAgICd0JyxcbiAgICAnXFx1MjAyOCc6ICd1MjAyOCcsXG4gICAgJ1xcdTIwMjknOiAndTIwMjknXG4gIH07XG5cbiAgdmFyIGVzY2FwZXIgPSAvXFxcXHwnfFxccnxcXG58XFx0fFxcdTIwMjh8XFx1MjAyOS9nO1xuXG4gIC8vIEphdmFTY3JpcHQgbWljcm8tdGVtcGxhdGluZywgc2ltaWxhciB0byBKb2huIFJlc2lnJ3MgaW1wbGVtZW50YXRpb24uXG4gIC8vIFVuZGVyc2NvcmUgdGVtcGxhdGluZyBoYW5kbGVzIGFyYml0cmFyeSBkZWxpbWl0ZXJzLCBwcmVzZXJ2ZXMgd2hpdGVzcGFjZSxcbiAgLy8gYW5kIGNvcnJlY3RseSBlc2NhcGVzIHF1b3RlcyB3aXRoaW4gaW50ZXJwb2xhdGVkIGNvZGUuXG4gIF8udGVtcGxhdGUgPSBmdW5jdGlvbih0ZXh0LCBkYXRhLCBzZXR0aW5ncykge1xuICAgIHZhciByZW5kZXI7XG4gICAgc2V0dGluZ3MgPSBfLmRlZmF1bHRzKHt9LCBzZXR0aW5ncywgXy50ZW1wbGF0ZVNldHRpbmdzKTtcblxuICAgIC8vIENvbWJpbmUgZGVsaW1pdGVycyBpbnRvIG9uZSByZWd1bGFyIGV4cHJlc3Npb24gdmlhIGFsdGVybmF0aW9uLlxuICAgIHZhciBtYXRjaGVyID0gbmV3IFJlZ0V4cChbXG4gICAgICAoc2V0dGluZ3MuZXNjYXBlIHx8IG5vTWF0Y2gpLnNvdXJjZSxcbiAgICAgIChzZXR0aW5ncy5pbnRlcnBvbGF0ZSB8fCBub01hdGNoKS5zb3VyY2UsXG4gICAgICAoc2V0dGluZ3MuZXZhbHVhdGUgfHwgbm9NYXRjaCkuc291cmNlXG4gICAgXS5qb2luKCd8JykgKyAnfCQnLCAnZycpO1xuXG4gICAgLy8gQ29tcGlsZSB0aGUgdGVtcGxhdGUgc291cmNlLCBlc2NhcGluZyBzdHJpbmcgbGl0ZXJhbHMgYXBwcm9wcmlhdGVseS5cbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciBzb3VyY2UgPSBcIl9fcCs9J1wiO1xuICAgIHRleHQucmVwbGFjZShtYXRjaGVyLCBmdW5jdGlvbihtYXRjaCwgZXNjYXBlLCBpbnRlcnBvbGF0ZSwgZXZhbHVhdGUsIG9mZnNldCkge1xuICAgICAgc291cmNlICs9IHRleHQuc2xpY2UoaW5kZXgsIG9mZnNldClcbiAgICAgICAgLnJlcGxhY2UoZXNjYXBlciwgZnVuY3Rpb24obWF0Y2gpIHsgcmV0dXJuICdcXFxcJyArIGVzY2FwZXNbbWF0Y2hdOyB9KTtcblxuICAgICAgaWYgKGVzY2FwZSkge1xuICAgICAgICBzb3VyY2UgKz0gXCInK1xcbigoX190PShcIiArIGVzY2FwZSArIFwiKSk9PW51bGw/Jyc6Xy5lc2NhcGUoX190KSkrXFxuJ1wiO1xuICAgICAgfVxuICAgICAgaWYgKGludGVycG9sYXRlKSB7XG4gICAgICAgIHNvdXJjZSArPSBcIicrXFxuKChfX3Q9KFwiICsgaW50ZXJwb2xhdGUgKyBcIikpPT1udWxsPycnOl9fdCkrXFxuJ1wiO1xuICAgICAgfVxuICAgICAgaWYgKGV2YWx1YXRlKSB7XG4gICAgICAgIHNvdXJjZSArPSBcIic7XFxuXCIgKyBldmFsdWF0ZSArIFwiXFxuX19wKz0nXCI7XG4gICAgICB9XG4gICAgICBpbmRleCA9IG9mZnNldCArIG1hdGNoLmxlbmd0aDtcbiAgICAgIHJldHVybiBtYXRjaDtcbiAgICB9KTtcbiAgICBzb3VyY2UgKz0gXCInO1xcblwiO1xuXG4gICAgLy8gSWYgYSB2YXJpYWJsZSBpcyBub3Qgc3BlY2lmaWVkLCBwbGFjZSBkYXRhIHZhbHVlcyBpbiBsb2NhbCBzY29wZS5cbiAgICBpZiAoIXNldHRpbmdzLnZhcmlhYmxlKSBzb3VyY2UgPSAnd2l0aChvYmp8fHt9KXtcXG4nICsgc291cmNlICsgJ31cXG4nO1xuXG4gICAgc291cmNlID0gXCJ2YXIgX190LF9fcD0nJyxfX2o9QXJyYXkucHJvdG90eXBlLmpvaW4sXCIgK1xuICAgICAgXCJwcmludD1mdW5jdGlvbigpe19fcCs9X19qLmNhbGwoYXJndW1lbnRzLCcnKTt9O1xcblwiICtcbiAgICAgIHNvdXJjZSArIFwicmV0dXJuIF9fcDtcXG5cIjtcblxuICAgIHRyeSB7XG4gICAgICByZW5kZXIgPSBuZXcgRnVuY3Rpb24oc2V0dGluZ3MudmFyaWFibGUgfHwgJ29iaicsICdfJywgc291cmNlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBlLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEpIHJldHVybiByZW5kZXIoZGF0YSwgXyk7XG4gICAgdmFyIHRlbXBsYXRlID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgcmV0dXJuIHJlbmRlci5jYWxsKHRoaXMsIGRhdGEsIF8pO1xuICAgIH07XG5cbiAgICAvLyBQcm92aWRlIHRoZSBjb21waWxlZCBmdW5jdGlvbiBzb3VyY2UgYXMgYSBjb252ZW5pZW5jZSBmb3IgcHJlY29tcGlsYXRpb24uXG4gICAgdGVtcGxhdGUuc291cmNlID0gJ2Z1bmN0aW9uKCcgKyAoc2V0dGluZ3MudmFyaWFibGUgfHwgJ29iaicpICsgJyl7XFxuJyArIHNvdXJjZSArICd9JztcblxuICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgfTtcblxuICAvLyBBZGQgYSBcImNoYWluXCIgZnVuY3Rpb24sIHdoaWNoIHdpbGwgZGVsZWdhdGUgdG8gdGhlIHdyYXBwZXIuXG4gIF8uY2hhaW4gPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gXyhvYmopLmNoYWluKCk7XG4gIH07XG5cbiAgLy8gT09QXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxuICAvLyBJZiBVbmRlcnNjb3JlIGlzIGNhbGxlZCBhcyBhIGZ1bmN0aW9uLCBpdCByZXR1cm5zIGEgd3JhcHBlZCBvYmplY3QgdGhhdFxuICAvLyBjYW4gYmUgdXNlZCBPTy1zdHlsZS4gVGhpcyB3cmFwcGVyIGhvbGRzIGFsdGVyZWQgdmVyc2lvbnMgb2YgYWxsIHRoZVxuICAvLyB1bmRlcnNjb3JlIGZ1bmN0aW9ucy4gV3JhcHBlZCBvYmplY3RzIG1heSBiZSBjaGFpbmVkLlxuXG4gIC8vIEhlbHBlciBmdW5jdGlvbiB0byBjb250aW51ZSBjaGFpbmluZyBpbnRlcm1lZGlhdGUgcmVzdWx0cy5cbiAgdmFyIHJlc3VsdCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiB0aGlzLl9jaGFpbiA/IF8ob2JqKS5jaGFpbigpIDogb2JqO1xuICB9O1xuXG4gIC8vIEFkZCBhbGwgb2YgdGhlIFVuZGVyc2NvcmUgZnVuY3Rpb25zIHRvIHRoZSB3cmFwcGVyIG9iamVjdC5cbiAgXy5taXhpbihfKTtcblxuICAvLyBBZGQgYWxsIG11dGF0b3IgQXJyYXkgZnVuY3Rpb25zIHRvIHRoZSB3cmFwcGVyLlxuICBlYWNoKFsncG9wJywgJ3B1c2gnLCAncmV2ZXJzZScsICdzaGlmdCcsICdzb3J0JywgJ3NwbGljZScsICd1bnNoaWZ0J10sIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgbWV0aG9kID0gQXJyYXlQcm90b1tuYW1lXTtcbiAgICBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG9iaiA9IHRoaXMuX3dyYXBwZWQ7XG4gICAgICBtZXRob2QuYXBwbHkob2JqLCBhcmd1bWVudHMpO1xuICAgICAgaWYgKChuYW1lID09ICdzaGlmdCcgfHwgbmFtZSA9PSAnc3BsaWNlJykgJiYgb2JqLmxlbmd0aCA9PT0gMCkgZGVsZXRlIG9ialswXTtcbiAgICAgIHJldHVybiByZXN1bHQuY2FsbCh0aGlzLCBvYmopO1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIEFkZCBhbGwgYWNjZXNzb3IgQXJyYXkgZnVuY3Rpb25zIHRvIHRoZSB3cmFwcGVyLlxuICBlYWNoKFsnY29uY2F0JywgJ2pvaW4nLCAnc2xpY2UnXSwgZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBtZXRob2QgPSBBcnJheVByb3RvW25hbWVdO1xuICAgIF8ucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gcmVzdWx0LmNhbGwodGhpcywgbWV0aG9kLmFwcGx5KHRoaXMuX3dyYXBwZWQsIGFyZ3VtZW50cykpO1xuICAgIH07XG4gIH0pO1xuXG4gIF8uZXh0ZW5kKF8ucHJvdG90eXBlLCB7XG5cbiAgICAvLyBTdGFydCBjaGFpbmluZyBhIHdyYXBwZWQgVW5kZXJzY29yZSBvYmplY3QuXG4gICAgY2hhaW46IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5fY2hhaW4gPSB0cnVlO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8vIEV4dHJhY3RzIHRoZSByZXN1bHQgZnJvbSBhIHdyYXBwZWQgYW5kIGNoYWluZWQgb2JqZWN0LlxuICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl93cmFwcGVkO1xuICAgIH1cblxuICB9KTtcblxuICAvLyBBTUQgcmVnaXN0cmF0aW9uIGhhcHBlbnMgYXQgdGhlIGVuZCBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIEFNRCBsb2FkZXJzXG4gIC8vIHRoYXQgbWF5IG5vdCBlbmZvcmNlIG5leHQtdHVybiBzZW1hbnRpY3Mgb24gbW9kdWxlcy4gRXZlbiB0aG91Z2ggZ2VuZXJhbFxuICAvLyBwcmFjdGljZSBmb3IgQU1EIHJlZ2lzdHJhdGlvbiBpcyB0byBiZSBhbm9ueW1vdXMsIHVuZGVyc2NvcmUgcmVnaXN0ZXJzXG4gIC8vIGFzIGEgbmFtZWQgbW9kdWxlIGJlY2F1c2UsIGxpa2UgalF1ZXJ5LCBpdCBpcyBhIGJhc2UgbGlicmFyeSB0aGF0IGlzXG4gIC8vIHBvcHVsYXIgZW5vdWdoIHRvIGJlIGJ1bmRsZWQgaW4gYSB0aGlyZCBwYXJ0eSBsaWIsIGJ1dCBub3QgYmUgcGFydCBvZlxuICAvLyBhbiBBTUQgbG9hZCByZXF1ZXN0LiBUaG9zZSBjYXNlcyBjb3VsZCBnZW5lcmF0ZSBhbiBlcnJvciB3aGVuIGFuXG4gIC8vIGFub255bW91cyBkZWZpbmUoKSBpcyBjYWxsZWQgb3V0c2lkZSBvZiBhIGxvYWRlciByZXF1ZXN0LlxuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKCd1bmRlcnNjb3JlJywgW10sIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIF87XG4gICAgfSk7XG4gIH1cbn0pLmNhbGwodGhpcyk7XG4iLCIvKiEgSGFtbWVyLkpTIC0gdjIuMC44IC0gMjAxNi0wOS0zMFxuICogaHR0cDovL2hhbW1lcmpzLmdpdGh1Yi5pby9cbiAqXG4gKiBDb3B5cmlnaHQgKGMpICBKb3JpayBUYW5nZWxkZXI7XG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgKi9cbihmdW5jdGlvbih3aW5kb3csIGRvY3VtZW50LCBleHBvcnROYW1lLCB1bmRlZmluZWQpIHsgXG4ndXNlIHN0cmljdCc7XG4vKipcbiAqIEBwcml2YXRlXG4gKiB1c2UgdGhlIHZhbDIgd2hlbiB2YWwxIGlzIHVuZGVmaW5lZFxuICogQHBhcmFtIHsqfSB2YWwxXG4gKiBAcGFyYW0geyp9IHZhbDJcbiAqIEByZXR1cm5zIHsqfVxuICovXG5mdW5jdGlvbiBpZlVuZGVmaW5lZCh2YWwxLCB2YWwyKSB7XG4gIHJldHVybiB2YWwxID09PSB1bmRlZmluZWQgPyB2YWwyIDogdmFsMTtcbn1cblxudmFyIFZFTkRPUl9QUkVGSVhFUyA9IFsnJywgJ3dlYmtpdCcsICdNb3onLCAnTVMnLCAnbXMnLCAnbyddO1xudmFyIFRFU1RfRUxFTUVOVCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG52YXIgVFlQRV9GVU5DVElPTiA9ICdmdW5jdGlvbic7XG5cbnZhciByb3VuZCA9IE1hdGgucm91bmQ7XG52YXIgYWJzID0gTWF0aC5hYnM7XG52YXIgbm93ID0gRGF0ZS5ub3c7XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIGdldCB0aGUgcHJlZml4ZWQgcHJvcGVydHlcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wZXJ0eVxuICogQHJldHVybnMge1N0cmluZ3xVbmRlZmluZWR9IHByZWZpeGVkXG4gKi9cbmZ1bmN0aW9uIHByZWZpeGVkKG9iaiwgcHJvcGVydHkpIHtcbiAgdmFyIHByZWZpeCA9IHZvaWQgMDtcbiAgdmFyIHByb3AgPSB2b2lkIDA7XG4gIHZhciBjYW1lbFByb3AgPSBwcm9wZXJ0eVswXS50b1VwcGVyQ2FzZSgpICsgcHJvcGVydHkuc2xpY2UoMSk7XG5cbiAgdmFyIGkgPSAwO1xuICB3aGlsZSAoaSA8IFZFTkRPUl9QUkVGSVhFUy5sZW5ndGgpIHtcbiAgICBwcmVmaXggPSBWRU5ET1JfUFJFRklYRVNbaV07XG4gICAgcHJvcCA9IHByZWZpeCA/IHByZWZpeCArIGNhbWVsUHJvcCA6IHByb3BlcnR5O1xuXG4gICAgaWYgKHByb3AgaW4gb2JqKSB7XG4gICAgICByZXR1cm4gcHJvcDtcbiAgICB9XG4gICAgaSsrO1xuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIGdldFRvdWNoQWN0aW9uUHJvcHMoKSB7XG4gIGlmICghTkFUSVZFX1RPVUNIX0FDVElPTikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgdG91Y2hNYXAgPSB7fTtcbiAgdmFyIGNzc1N1cHBvcnRzID0gd2luZG93LkNTUyAmJiB3aW5kb3cuQ1NTLnN1cHBvcnRzO1xuICBbJ2F1dG8nLCAnbWFuaXB1bGF0aW9uJywgJ3Bhbi15JywgJ3Bhbi14JywgJ3Bhbi14IHBhbi15JywgJ25vbmUnXS5mb3JFYWNoKGZ1bmN0aW9uICh2YWwpIHtcblxuICAgIC8vIElmIGNzcy5zdXBwb3J0cyBpcyBub3Qgc3VwcG9ydGVkIGJ1dCB0aGVyZSBpcyBuYXRpdmUgdG91Y2gtYWN0aW9uIGFzc3VtZSBpdCBzdXBwb3J0c1xuICAgIC8vIGFsbCB2YWx1ZXMuIFRoaXMgaXMgdGhlIGNhc2UgZm9yIElFIDEwIGFuZCAxMS5cbiAgICByZXR1cm4gdG91Y2hNYXBbdmFsXSA9IGNzc1N1cHBvcnRzID8gd2luZG93LkNTUy5zdXBwb3J0cygndG91Y2gtYWN0aW9uJywgdmFsKSA6IHRydWU7XG4gIH0pO1xuICByZXR1cm4gdG91Y2hNYXA7XG59XG5cbnZhciBQUkVGSVhFRF9UT1VDSF9BQ1RJT04gPSBwcmVmaXhlZChURVNUX0VMRU1FTlQuc3R5bGUsICd0b3VjaEFjdGlvbicpO1xudmFyIE5BVElWRV9UT1VDSF9BQ1RJT04gPSBQUkVGSVhFRF9UT1VDSF9BQ1RJT04gIT09IHVuZGVmaW5lZDtcblxuLy8gbWFnaWNhbCB0b3VjaEFjdGlvbiB2YWx1ZVxudmFyIFRPVUNIX0FDVElPTl9DT01QVVRFID0gJ2NvbXB1dGUnO1xudmFyIFRPVUNIX0FDVElPTl9BVVRPID0gJ2F1dG8nO1xudmFyIFRPVUNIX0FDVElPTl9NQU5JUFVMQVRJT04gPSAnbWFuaXB1bGF0aW9uJzsgLy8gbm90IGltcGxlbWVudGVkXG52YXIgVE9VQ0hfQUNUSU9OX05PTkUgPSAnbm9uZSc7XG52YXIgVE9VQ0hfQUNUSU9OX1BBTl9YID0gJ3Bhbi14JztcbnZhciBUT1VDSF9BQ1RJT05fUEFOX1kgPSAncGFuLXknO1xudmFyIFRPVUNIX0FDVElPTl9NQVAgPSBnZXRUb3VjaEFjdGlvblByb3BzKCk7XG5cbnZhciBNT0JJTEVfUkVHRVggPSAvbW9iaWxlfHRhYmxldHxpcChhZHxob25lfG9kKXxhbmRyb2lkL2k7XG5cbnZhciBTVVBQT1JUX1RPVUNIID0gJ29udG91Y2hzdGFydCcgaW4gd2luZG93O1xudmFyIFNVUFBPUlRfUE9JTlRFUl9FVkVOVFMgPSBwcmVmaXhlZCh3aW5kb3csICdQb2ludGVyRXZlbnQnKSAhPT0gdW5kZWZpbmVkO1xudmFyIFNVUFBPUlRfT05MWV9UT1VDSCA9IFNVUFBPUlRfVE9VQ0ggJiYgTU9CSUxFX1JFR0VYLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG5cbnZhciBJTlBVVF9UWVBFX1RPVUNIID0gJ3RvdWNoJztcbnZhciBJTlBVVF9UWVBFX1BFTiA9ICdwZW4nO1xudmFyIElOUFVUX1RZUEVfTU9VU0UgPSAnbW91c2UnO1xudmFyIElOUFVUX1RZUEVfS0lORUNUID0gJ2tpbmVjdCc7XG5cbnZhciBDT01QVVRFX0lOVEVSVkFMID0gMjU7XG5cbnZhciBJTlBVVF9TVEFSVCA9IDE7XG52YXIgSU5QVVRfTU9WRSA9IDI7XG52YXIgSU5QVVRfRU5EID0gNDtcbnZhciBJTlBVVF9DQU5DRUwgPSA4O1xuXG52YXIgRElSRUNUSU9OX05PTkUgPSAxO1xudmFyIERJUkVDVElPTl9MRUZUID0gMjtcbnZhciBESVJFQ1RJT05fUklHSFQgPSA0O1xudmFyIERJUkVDVElPTl9VUCA9IDg7XG52YXIgRElSRUNUSU9OX0RPV04gPSAxNjtcblxudmFyIERJUkVDVElPTl9IT1JJWk9OVEFMID0gRElSRUNUSU9OX0xFRlQgfCBESVJFQ1RJT05fUklHSFQ7XG52YXIgRElSRUNUSU9OX1ZFUlRJQ0FMID0gRElSRUNUSU9OX1VQIHwgRElSRUNUSU9OX0RPV047XG52YXIgRElSRUNUSU9OX0FMTCA9IERJUkVDVElPTl9IT1JJWk9OVEFMIHwgRElSRUNUSU9OX1ZFUlRJQ0FMO1xuXG52YXIgUFJPUFNfWFkgPSBbJ3gnLCAneSddO1xudmFyIFBST1BTX0NMSUVOVF9YWSA9IFsnY2xpZW50WCcsICdjbGllbnRZJ107XG5cbnZhciBTVEFURV9QT1NTSUJMRSA9IDE7XG52YXIgU1RBVEVfQkVHQU4gPSAyO1xudmFyIFNUQVRFX0NIQU5HRUQgPSA0O1xudmFyIFNUQVRFX0VOREVEID0gODtcbnZhciBTVEFURV9SRUNPR05JWkVEID0gU1RBVEVfRU5ERUQ7XG52YXIgU1RBVEVfQ0FOQ0VMTEVEID0gMTY7XG52YXIgU1RBVEVfRkFJTEVEID0gMzI7XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIGV4dGVuZCBvYmplY3QuXG4gKiBtZWFucyB0aGF0IHByb3BlcnRpZXMgaW4gZGVzdCB3aWxsIGJlIG92ZXJ3cml0dGVuIGJ5IHRoZSBvbmVzIGluIHNyYy5cbiAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXRcbiAqIEBwYXJhbSB7Li4uT2JqZWN0fSBvYmplY3RzX3RvX2Fzc2lnblxuICogQHJldHVybnMge09iamVjdH0gdGFyZ2V0XG4gKi9cbnZhciBhc3NpZ24gPSB2b2lkIDA7XG5pZiAodHlwZW9mIE9iamVjdC5hc3NpZ24gIT09ICdmdW5jdGlvbicpIHtcbiAgYXNzaWduID0gZnVuY3Rpb24gYXNzaWduKHRhcmdldCkge1xuICAgIGlmICh0YXJnZXQgPT09IHVuZGVmaW5lZCB8fCB0YXJnZXQgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjb252ZXJ0IHVuZGVmaW5lZCBvciBudWxsIHRvIG9iamVjdCcpO1xuICAgIH1cblxuICAgIHZhciBvdXRwdXQgPSBPYmplY3QodGFyZ2V0KTtcbiAgICBmb3IgKHZhciBpbmRleCA9IDE7IGluZGV4IDwgYXJndW1lbnRzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpbmRleF07XG4gICAgICBpZiAoc291cmNlICE9PSB1bmRlZmluZWQgJiYgc291cmNlICE9PSBudWxsKSB7XG4gICAgICAgIGZvciAodmFyIG5leHRLZXkgaW4gc291cmNlKSB7XG4gICAgICAgICAgaWYgKHNvdXJjZS5oYXNPd25Qcm9wZXJ0eShuZXh0S2V5KSkge1xuICAgICAgICAgICAgb3V0cHV0W25leHRLZXldID0gc291cmNlW25leHRLZXldO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9O1xufSBlbHNlIHtcbiAgYXNzaWduID0gT2JqZWN0LmFzc2lnbjtcbn1cblxudmFyIGFzc2lnbiQxID0gYXNzaWduO1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBnZXQgYSB1bmlxdWUgaWRcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHVuaXF1ZUlkXG4gKi9cbnZhciBfdW5pcXVlSWQgPSAxO1xuZnVuY3Rpb24gdW5pcXVlSWQoKSB7XG4gIHJldHVybiBfdW5pcXVlSWQrKztcbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogd2FsayBvYmplY3RzIGFuZCBhcnJheXNcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdG9yXG4gKiBAcGFyYW0ge09iamVjdH0gY29udGV4dFxuICovXG5mdW5jdGlvbiBlYWNoKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgdmFyIGkgPSB2b2lkIDA7XG5cbiAgaWYgKCFvYmopIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAob2JqLmZvckVhY2gpIHtcbiAgICBvYmouZm9yRWFjaChpdGVyYXRvciwgY29udGV4dCk7XG4gIH0gZWxzZSBpZiAob2JqLmxlbmd0aCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCBvYmoubGVuZ3RoKSB7XG4gICAgICBpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9ialtpXSwgaSwgb2JqKTtcbiAgICAgIGkrKztcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZm9yIChpIGluIG9iaikge1xuICAgICAgb2JqLmhhc093blByb3BlcnR5KGkpICYmIGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqW2ldLCBpLCBvYmopO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBpZiB0aGUgYXJndW1lbnQgaXMgYW4gYXJyYXksIHdlIHdhbnQgdG8gZXhlY3V0ZSB0aGUgZm4gb24gZWFjaCBlbnRyeVxuICogaWYgaXQgYWludCBhbiBhcnJheSB3ZSBkb24ndCB3YW50IHRvIGRvIGEgdGhpbmcuXG4gKiB0aGlzIGlzIHVzZWQgYnkgYWxsIHRoZSBtZXRob2RzIHRoYXQgYWNjZXB0IGEgc2luZ2xlIGFuZCBhcnJheSBhcmd1bWVudC5cbiAqIEBwYXJhbSB7KnxBcnJheX0gYXJnXG4gKiBAcGFyYW0ge1N0cmluZ30gZm5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbY29udGV4dF1cbiAqIEByZXR1cm5zIHtCb29sZWFufVxuICovXG5mdW5jdGlvbiBpbnZva2VBcnJheUFyZyhhcmcsIGZuLCBjb250ZXh0KSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGFyZykpIHtcbiAgICBlYWNoKGFyZywgY29udGV4dFtmbl0sIGNvbnRleHQpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogZmluZCBpZiBhIGFycmF5IGNvbnRhaW5zIHRoZSBvYmplY3QgdXNpbmcgaW5kZXhPZiBvciBhIHNpbXBsZSBwb2x5RmlsbFxuICogQHBhcmFtIHtBcnJheX0gc3JjXG4gKiBAcGFyYW0ge1N0cmluZ30gZmluZFxuICogQHBhcmFtIHtTdHJpbmd9IFtmaW5kQnlLZXldXG4gKiBAcmV0dXJuIHtCb29sZWFufE51bWJlcn0gZmFsc2Ugd2hlbiBub3QgZm91bmQsIG9yIHRoZSBpbmRleFxuICovXG5mdW5jdGlvbiBpbkFycmF5KHNyYywgZmluZCwgZmluZEJ5S2V5KSB7XG4gIGlmIChzcmMuaW5kZXhPZiAmJiAhZmluZEJ5S2V5KSB7XG4gICAgcmV0dXJuIHNyYy5pbmRleE9mKGZpbmQpO1xuICB9IGVsc2Uge1xuICAgIHZhciBpID0gMDtcbiAgICB3aGlsZSAoaSA8IHNyYy5sZW5ndGgpIHtcbiAgICAgIGlmIChmaW5kQnlLZXkgJiYgc3JjW2ldW2ZpbmRCeUtleV0gPT0gZmluZCB8fCAhZmluZEJ5S2V5ICYmIHNyY1tpXSA9PT0gZmluZCkge1xuICAgICAgICAvLyBkbyBub3QgdXNlID09PSBoZXJlLCB0ZXN0IGZhaWxzXG4gICAgICAgIHJldHVybiBpO1xuICAgICAgfVxuICAgICAgaSsrO1xuICAgIH1cbiAgICByZXR1cm4gLTE7XG4gIH1cbn1cblxudmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmo7XG59IDogZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajtcbn07XG5cbnZhciBhc3luY0dlbmVyYXRvciA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gQXdhaXRWYWx1ZSh2YWx1ZSkge1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIEFzeW5jR2VuZXJhdG9yKGdlbikge1xuICAgIHZhciBmcm9udCwgYmFjaztcblxuICAgIGZ1bmN0aW9uIHNlbmQoa2V5LCBhcmcpIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHZhciByZXF1ZXN0ID0ge1xuICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgIGFyZzogYXJnLFxuICAgICAgICAgIHJlc29sdmU6IHJlc29sdmUsXG4gICAgICAgICAgcmVqZWN0OiByZWplY3QsXG4gICAgICAgICAgbmV4dDogbnVsbFxuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChiYWNrKSB7XG4gICAgICAgICAgYmFjayA9IGJhY2submV4dCA9IHJlcXVlc3Q7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZnJvbnQgPSBiYWNrID0gcmVxdWVzdDtcbiAgICAgICAgICByZXN1bWUoa2V5LCBhcmcpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXN1bWUoa2V5LCBhcmcpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBnZW5ba2V5XShhcmcpO1xuICAgICAgICB2YXIgdmFsdWUgPSByZXN1bHQudmFsdWU7XG5cbiAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXdhaXRWYWx1ZSkge1xuICAgICAgICAgIFByb21pc2UucmVzb2x2ZSh2YWx1ZS52YWx1ZSkudGhlbihmdW5jdGlvbiAoYXJnKSB7XG4gICAgICAgICAgICByZXN1bWUoXCJuZXh0XCIsIGFyZyk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24gKGFyZykge1xuICAgICAgICAgICAgcmVzdW1lKFwidGhyb3dcIiwgYXJnKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZXR0bGUocmVzdWx0LmRvbmUgPyBcInJldHVyblwiIDogXCJub3JtYWxcIiwgcmVzdWx0LnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHNldHRsZShcInRocm93XCIsIGVycik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0dGxlKHR5cGUsIHZhbHVlKSB7XG4gICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgY2FzZSBcInJldHVyblwiOlxuICAgICAgICAgIGZyb250LnJlc29sdmUoe1xuICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgZG9uZTogdHJ1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJ0aHJvd1wiOlxuICAgICAgICAgIGZyb250LnJlamVjdCh2YWx1ZSk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBmcm9udC5yZXNvbHZlKHtcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgIGRvbmU6IGZhbHNlXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGZyb250ID0gZnJvbnQubmV4dDtcblxuICAgICAgaWYgKGZyb250KSB7XG4gICAgICAgIHJlc3VtZShmcm9udC5rZXksIGZyb250LmFyZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBiYWNrID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLl9pbnZva2UgPSBzZW5kO1xuXG4gICAgaWYgKHR5cGVvZiBnZW4ucmV0dXJuICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHRoaXMucmV0dXJuID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHtcbiAgICBBc3luY0dlbmVyYXRvci5wcm90b3R5cGVbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgfVxuXG4gIEFzeW5jR2VuZXJhdG9yLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKGFyZykge1xuICAgIHJldHVybiB0aGlzLl9pbnZva2UoXCJuZXh0XCIsIGFyZyk7XG4gIH07XG5cbiAgQXN5bmNHZW5lcmF0b3IucHJvdG90eXBlLnRocm93ID0gZnVuY3Rpb24gKGFyZykge1xuICAgIHJldHVybiB0aGlzLl9pbnZva2UoXCJ0aHJvd1wiLCBhcmcpO1xuICB9O1xuXG4gIEFzeW5jR2VuZXJhdG9yLnByb3RvdHlwZS5yZXR1cm4gPSBmdW5jdGlvbiAoYXJnKSB7XG4gICAgcmV0dXJuIHRoaXMuX2ludm9rZShcInJldHVyblwiLCBhcmcpO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgd3JhcDogZnVuY3Rpb24gKGZuKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IEFzeW5jR2VuZXJhdG9yKGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICAgICAgfTtcbiAgICB9LFxuICAgIGF3YWl0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIHJldHVybiBuZXcgQXdhaXRWYWx1ZSh2YWx1ZSk7XG4gICAgfVxuICB9O1xufSgpO1xuXG52YXIgY2xhc3NDYWxsQ2hlY2sgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgfVxufTtcblxudmFyIGNyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldO1xuICAgICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO1xuICAgICAgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICAgIGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG4gICAgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gICAgcmV0dXJuIENvbnN0cnVjdG9yO1xuICB9O1xufSgpO1xuXG52YXIgZ2V0ID0gZnVuY3Rpb24gZ2V0KG9iamVjdCwgcHJvcGVydHksIHJlY2VpdmVyKSB7XG4gIGlmIChvYmplY3QgPT09IG51bGwpIG9iamVjdCA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcbiAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgcHJvcGVydHkpO1xuXG4gIGlmIChkZXNjID09PSB1bmRlZmluZWQpIHtcbiAgICB2YXIgcGFyZW50ID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iamVjdCk7XG5cbiAgICBpZiAocGFyZW50ID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZ2V0KHBhcmVudCwgcHJvcGVydHksIHJlY2VpdmVyKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoXCJ2YWx1ZVwiIGluIGRlc2MpIHtcbiAgICByZXR1cm4gZGVzYy52YWx1ZTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgZ2V0dGVyID0gZGVzYy5nZXQ7XG5cbiAgICBpZiAoZ2V0dGVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGdldHRlci5jYWxsKHJlY2VpdmVyKTtcbiAgfVxufTtcblxudmFyIGluaGVyaXRzID0gZnVuY3Rpb24gKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7XG4gIGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCBcIiArIHR5cGVvZiBzdXBlckNsYXNzKTtcbiAgfVxuXG4gIHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwge1xuICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICB2YWx1ZTogc3ViQ2xhc3MsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfVxuICB9KTtcbiAgaWYgKHN1cGVyQ2xhc3MpIE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcykgOiBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzO1xufTtcblxudmFyIHBvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4gPSBmdW5jdGlvbiAoc2VsZiwgY2FsbCkge1xuICBpZiAoIXNlbGYpIHtcbiAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7XG4gIH1cblxuICByZXR1cm4gY2FsbCAmJiAodHlwZW9mIGNhbGwgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikgPyBjYWxsIDogc2VsZjtcbn07XG5cbnZhciBzbGljZWRUb0FycmF5ID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBzbGljZUl0ZXJhdG9yKGFyciwgaSkge1xuICAgIHZhciBfYXJyID0gW107XG4gICAgdmFyIF9uID0gdHJ1ZTtcbiAgICB2YXIgX2QgPSBmYWxzZTtcbiAgICB2YXIgX2UgPSB1bmRlZmluZWQ7XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgX2kgPSBhcnJbU3ltYm9sLml0ZXJhdG9yXSgpLCBfczsgIShfbiA9IChfcyA9IF9pLm5leHQoKSkuZG9uZSk7IF9uID0gdHJ1ZSkge1xuICAgICAgICBfYXJyLnB1c2goX3MudmFsdWUpO1xuXG4gICAgICAgIGlmIChpICYmIF9hcnIubGVuZ3RoID09PSBpKSBicmVhaztcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIF9kID0gdHJ1ZTtcbiAgICAgIF9lID0gZXJyO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoIV9uICYmIF9pW1wicmV0dXJuXCJdKSBfaVtcInJldHVyblwiXSgpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKF9kKSB0aHJvdyBfZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gX2FycjtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoYXJyLCBpKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkge1xuICAgICAgcmV0dXJuIGFycjtcbiAgICB9IGVsc2UgaWYgKFN5bWJvbC5pdGVyYXRvciBpbiBPYmplY3QoYXJyKSkge1xuICAgICAgcmV0dXJuIHNsaWNlSXRlcmF0b3IoYXJyLCBpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBkZXN0cnVjdHVyZSBub24taXRlcmFibGUgaW5zdGFuY2VcIik7XG4gICAgfVxuICB9O1xufSgpO1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBsZXQgYSBib29sZWFuIHZhbHVlIGFsc28gYmUgYSBmdW5jdGlvbiB0aGF0IG11c3QgcmV0dXJuIGEgYm9vbGVhblxuICogdGhpcyBmaXJzdCBpdGVtIGluIGFyZ3Mgd2lsbCBiZSB1c2VkIGFzIHRoZSBjb250ZXh0XG4gKiBAcGFyYW0ge0Jvb2xlYW58RnVuY3Rpb259IHZhbFxuICogQHBhcmFtIHtBcnJheX0gW2FyZ3NdXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gYm9vbE9yRm4odmFsLCBhcmdzKSB7XG4gIGlmICgodHlwZW9mIHZhbCA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YodmFsKSkgPT09IFRZUEVfRlVOQ1RJT04pIHtcbiAgICByZXR1cm4gdmFsLmFwcGx5KGFyZ3MgPyBhcmdzWzBdIHx8IHVuZGVmaW5lZCA6IHVuZGVmaW5lZCwgYXJncyk7XG4gIH1cbiAgcmV0dXJuIHZhbDtcbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogZ2V0IGEgcmVjb2duaXplciBieSBuYW1lIGlmIGl0IGlzIGJvdW5kIHRvIGEgbWFuYWdlclxuICogQHBhcmFtIHtSZWNvZ25pemVyfFN0cmluZ30gb3RoZXJSZWNvZ25pemVyXG4gKiBAcGFyYW0ge1JlY29nbml6ZXJ9IHJlY29nbml6ZXJcbiAqIEByZXR1cm5zIHtSZWNvZ25pemVyfVxuICovXG5mdW5jdGlvbiBnZXRSZWNvZ25pemVyQnlOYW1lSWZNYW5hZ2VyKG90aGVyUmVjb2duaXplciwgcmVjb2duaXplcikge1xuICB2YXIgbWFuYWdlciA9IHJlY29nbml6ZXIubWFuYWdlcjtcblxuICBpZiAobWFuYWdlcikge1xuICAgIHJldHVybiBtYW5hZ2VyLmdldChvdGhlclJlY29nbml6ZXIpO1xuICB9XG4gIHJldHVybiBvdGhlclJlY29nbml6ZXI7XG59XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIGdldCBhIHVzYWJsZSBzdHJpbmcsIHVzZWQgYXMgZXZlbnQgcG9zdGZpeFxuICogQHBhcmFtIHtjb25zdGFudH0gc3RhdGVcbiAqIEByZXR1cm5zIHtTdHJpbmd9IHN0YXRlXG4gKi9cbmZ1bmN0aW9uIHN0YXRlU3RyKHN0YXRlKSB7XG4gIGlmIChzdGF0ZSAmIFNUQVRFX0NBTkNFTExFRCkge1xuICAgIHJldHVybiAnY2FuY2VsJztcbiAgfSBlbHNlIGlmIChzdGF0ZSAmIFNUQVRFX0VOREVEKSB7XG4gICAgcmV0dXJuICdlbmQnO1xuICB9IGVsc2UgaWYgKHN0YXRlICYgU1RBVEVfQ0hBTkdFRCkge1xuICAgIHJldHVybiAnbW92ZSc7XG4gIH0gZWxzZSBpZiAoc3RhdGUgJiBTVEFURV9CRUdBTikge1xuICAgIHJldHVybiAnc3RhcnQnO1xuICB9XG4gIHJldHVybiAnJztcbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogUmVjb2duaXplciBmbG93IGV4cGxhaW5lZDsgKlxuICogQWxsIHJlY29nbml6ZXJzIGhhdmUgdGhlIGluaXRpYWwgc3RhdGUgb2YgUE9TU0lCTEUgd2hlbiBhIGlucHV0IHNlc3Npb24gc3RhcnRzLlxuICogVGhlIGRlZmluaXRpb24gb2YgYSBpbnB1dCBzZXNzaW9uIGlzIGZyb20gdGhlIGZpcnN0IGlucHV0IHVudGlsIHRoZSBsYXN0IGlucHV0LCB3aXRoIGFsbCBpdCdzIG1vdmVtZW50IGluIGl0LiAqXG4gKiBFeGFtcGxlIHNlc3Npb24gZm9yIG1vdXNlLWlucHV0OiBtb3VzZWRvd24gLT4gbW91c2Vtb3ZlIC0+IG1vdXNldXBcbiAqXG4gKiBPbiBlYWNoIHJlY29nbml6aW5nIGN5Y2xlIChzZWUgTWFuYWdlci5yZWNvZ25pemUpIHRoZSAucmVjb2duaXplKCkgbWV0aG9kIGlzIGV4ZWN1dGVkXG4gKiB3aGljaCBkZXRlcm1pbmVzIHdpdGggc3RhdGUgaXQgc2hvdWxkIGJlLlxuICpcbiAqIElmIHRoZSByZWNvZ25pemVyIGhhcyB0aGUgc3RhdGUgRkFJTEVELCBDQU5DRUxMRUQgb3IgUkVDT0dOSVpFRCAoZXF1YWxzIEVOREVEKSwgaXQgaXMgcmVzZXQgdG9cbiAqIFBPU1NJQkxFIHRvIGdpdmUgaXQgYW5vdGhlciBjaGFuZ2Ugb24gdGhlIG5leHQgY3ljbGUuXG4gKlxuICogICAgICAgICAgICAgICBQb3NzaWJsZVxuICogICAgICAgICAgICAgICAgICB8XG4gKiAgICAgICAgICAgICstLS0tLSstLS0tLS0tLS0tLS0tLS0rXG4gKiAgICAgICAgICAgIHwgICAgICAgICAgICAgICAgICAgICB8XG4gKiAgICAgICstLS0tLSstLS0tLSsgICAgICAgICAgICAgICB8XG4gKiAgICAgIHwgICAgICAgICAgIHwgICAgICAgICAgICAgICB8XG4gKiAgIEZhaWxlZCAgICAgIENhbmNlbGxlZCAgICAgICAgICB8XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgKy0tLS0tLS0rLS0tLS0tK1xuICogICAgICAgICAgICAgICAgICAgICAgICAgIHwgICAgICAgICAgICAgIHxcbiAqICAgICAgICAgICAgICAgICAgICAgIFJlY29nbml6ZWQgICAgICAgQmVnYW5cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2hhbmdlZFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEVuZGVkL1JlY29nbml6ZWRcbiAqL1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBSZWNvZ25pemVyXG4gKiBFdmVyeSByZWNvZ25pemVyIG5lZWRzIHRvIGV4dGVuZCBmcm9tIHRoaXMgY2xhc3MuXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKi9cblxudmFyIFJlY29nbml6ZXIgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFJlY29nbml6ZXIob3B0aW9ucykge1xuICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIFJlY29nbml6ZXIpO1xuXG4gICAgdGhpcy5vcHRpb25zID0gYXNzaWduJDEoe30sIHRoaXMuZGVmYXVsdHMsIG9wdGlvbnMgfHwge30pO1xuXG4gICAgdGhpcy5pZCA9IHVuaXF1ZUlkKCk7XG5cbiAgICB0aGlzLm1hbmFnZXIgPSBudWxsO1xuXG4gICAgLy8gZGVmYXVsdCBpcyBlbmFibGUgdHJ1ZVxuICAgIHRoaXMub3B0aW9ucy5lbmFibGUgPSBpZlVuZGVmaW5lZCh0aGlzLm9wdGlvbnMuZW5hYmxlLCB0cnVlKTtcblxuICAgIHRoaXMuc3RhdGUgPSBTVEFURV9QT1NTSUJMRTtcbiAgICB0aGlzLnNpbXVsdGFuZW91cyA9IHt9O1xuICAgIHRoaXMucmVxdWlyZUZhaWwgPSBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBzZXQgb3B0aW9uc1xuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKiBAcmV0dXJuIHtSZWNvZ25pemVyfVxuICAgKi9cblxuXG4gIGNyZWF0ZUNsYXNzKFJlY29nbml6ZXIsIFt7XG4gICAga2V5OiAnc2V0JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2V0KG9wdGlvbnMpIHtcbiAgICAgIGFzc2lnbiQxKHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICAgIC8vIGFsc28gdXBkYXRlIHRoZSB0b3VjaEFjdGlvbiwgaW4gY2FzZSBzb21ldGhpbmcgY2hhbmdlZCBhYm91dCB0aGUgZGlyZWN0aW9ucy9lbmFibGVkIHN0YXRlXG4gICAgICB0aGlzLm1hbmFnZXIgJiYgdGhpcy5tYW5hZ2VyLnRvdWNoQWN0aW9uLnVwZGF0ZSgpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiByZWNvZ25pemUgc2ltdWx0YW5lb3VzIHdpdGggYW4gb3RoZXIgcmVjb2duaXplci5cbiAgICAgKiBAcGFyYW0ge1JlY29nbml6ZXJ9IG90aGVyUmVjb2duaXplclxuICAgICAqIEByZXR1cm5zIHtSZWNvZ25pemVyfSB0aGlzXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ3JlY29nbml6ZVdpdGgnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZWNvZ25pemVXaXRoKG90aGVyUmVjb2duaXplcikge1xuICAgICAgaWYgKGludm9rZUFycmF5QXJnKG90aGVyUmVjb2duaXplciwgJ3JlY29nbml6ZVdpdGgnLCB0aGlzKSkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgdmFyIHNpbXVsdGFuZW91cyA9IHRoaXMuc2ltdWx0YW5lb3VzO1xuXG4gICAgICBvdGhlclJlY29nbml6ZXIgPSBnZXRSZWNvZ25pemVyQnlOYW1lSWZNYW5hZ2VyKG90aGVyUmVjb2duaXplciwgdGhpcyk7XG4gICAgICBpZiAoIXNpbXVsdGFuZW91c1tvdGhlclJlY29nbml6ZXIuaWRdKSB7XG4gICAgICAgIHNpbXVsdGFuZW91c1tvdGhlclJlY29nbml6ZXIuaWRdID0gb3RoZXJSZWNvZ25pemVyO1xuICAgICAgICBvdGhlclJlY29nbml6ZXIucmVjb2duaXplV2l0aCh0aGlzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogZHJvcCB0aGUgc2ltdWx0YW5lb3VzIGxpbmsuIGl0IGRvZXNudCByZW1vdmUgdGhlIGxpbmsgb24gdGhlIG90aGVyIHJlY29nbml6ZXIuXG4gICAgICogQHBhcmFtIHtSZWNvZ25pemVyfSBvdGhlclJlY29nbml6ZXJcbiAgICAgKiBAcmV0dXJucyB7UmVjb2duaXplcn0gdGhpc1xuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdkcm9wUmVjb2duaXplV2l0aCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGRyb3BSZWNvZ25pemVXaXRoKG90aGVyUmVjb2duaXplcikge1xuICAgICAgaWYgKGludm9rZUFycmF5QXJnKG90aGVyUmVjb2duaXplciwgJ2Ryb3BSZWNvZ25pemVXaXRoJywgdGhpcykpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIG90aGVyUmVjb2duaXplciA9IGdldFJlY29nbml6ZXJCeU5hbWVJZk1hbmFnZXIob3RoZXJSZWNvZ25pemVyLCB0aGlzKTtcbiAgICAgIGRlbGV0ZSB0aGlzLnNpbXVsdGFuZW91c1tvdGhlclJlY29nbml6ZXIuaWRdO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiByZWNvZ25pemVyIGNhbiBvbmx5IHJ1biB3aGVuIGFuIG90aGVyIGlzIGZhaWxpbmdcbiAgICAgKiBAcGFyYW0ge1JlY29nbml6ZXJ9IG90aGVyUmVjb2duaXplclxuICAgICAqIEByZXR1cm5zIHtSZWNvZ25pemVyfSB0aGlzXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ3JlcXVpcmVGYWlsdXJlJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVxdWlyZUZhaWx1cmUob3RoZXJSZWNvZ25pemVyKSB7XG4gICAgICBpZiAoaW52b2tlQXJyYXlBcmcob3RoZXJSZWNvZ25pemVyLCAncmVxdWlyZUZhaWx1cmUnLCB0aGlzKSkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgdmFyIHJlcXVpcmVGYWlsID0gdGhpcy5yZXF1aXJlRmFpbDtcblxuICAgICAgb3RoZXJSZWNvZ25pemVyID0gZ2V0UmVjb2duaXplckJ5TmFtZUlmTWFuYWdlcihvdGhlclJlY29nbml6ZXIsIHRoaXMpO1xuICAgICAgaWYgKGluQXJyYXkocmVxdWlyZUZhaWwsIG90aGVyUmVjb2duaXplcikgPT09IC0xKSB7XG4gICAgICAgIHJlcXVpcmVGYWlsLnB1c2gob3RoZXJSZWNvZ25pemVyKTtcbiAgICAgICAgb3RoZXJSZWNvZ25pemVyLnJlcXVpcmVGYWlsdXJlKHRoaXMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBkcm9wIHRoZSByZXF1aXJlRmFpbHVyZSBsaW5rLiBpdCBkb2VzIG5vdCByZW1vdmUgdGhlIGxpbmsgb24gdGhlIG90aGVyIHJlY29nbml6ZXIuXG4gICAgICogQHBhcmFtIHtSZWNvZ25pemVyfSBvdGhlclJlY29nbml6ZXJcbiAgICAgKiBAcmV0dXJucyB7UmVjb2duaXplcn0gdGhpc1xuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdkcm9wUmVxdWlyZUZhaWx1cmUnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkcm9wUmVxdWlyZUZhaWx1cmUob3RoZXJSZWNvZ25pemVyKSB7XG4gICAgICBpZiAoaW52b2tlQXJyYXlBcmcob3RoZXJSZWNvZ25pemVyLCAnZHJvcFJlcXVpcmVGYWlsdXJlJywgdGhpcykpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIG90aGVyUmVjb2duaXplciA9IGdldFJlY29nbml6ZXJCeU5hbWVJZk1hbmFnZXIob3RoZXJSZWNvZ25pemVyLCB0aGlzKTtcbiAgICAgIHZhciBpbmRleCA9IGluQXJyYXkodGhpcy5yZXF1aXJlRmFpbCwgb3RoZXJSZWNvZ25pemVyKTtcbiAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgIHRoaXMucmVxdWlyZUZhaWwuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogaGFzIHJlcXVpcmUgZmFpbHVyZXMgYm9vbGVhblxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdoYXNSZXF1aXJlRmFpbHVyZXMnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBoYXNSZXF1aXJlRmFpbHVyZXMoKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZXF1aXJlRmFpbC5sZW5ndGggPiAwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogaWYgdGhlIHJlY29nbml6ZXIgY2FuIHJlY29nbml6ZSBzaW11bHRhbmVvdXMgd2l0aCBhbiBvdGhlciByZWNvZ25pemVyXG4gICAgICogQHBhcmFtIHtSZWNvZ25pemVyfSBvdGhlclJlY29nbml6ZXJcbiAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnY2FuUmVjb2duaXplV2l0aCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNhblJlY29nbml6ZVdpdGgob3RoZXJSZWNvZ25pemVyKSB7XG4gICAgICByZXR1cm4gISF0aGlzLnNpbXVsdGFuZW91c1tvdGhlclJlY29nbml6ZXIuaWRdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogWW91IHNob3VsZCB1c2UgYHRyeUVtaXRgIGluc3RlYWQgb2YgYGVtaXRgIGRpcmVjdGx5IHRvIGNoZWNrXG4gICAgICogdGhhdCBhbGwgdGhlIG5lZWRlZCByZWNvZ25pemVycyBoYXMgZmFpbGVkIGJlZm9yZSBlbWl0dGluZy5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaW5wdXRcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnZW1pdCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGVtaXQoaW5wdXQpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHZhciBzdGF0ZSA9IHRoaXMuc3RhdGU7XG5cblxuICAgICAgZnVuY3Rpb24gZW1pdChldmVudCkge1xuICAgICAgICBzZWxmLm1hbmFnZXIuZW1pdChldmVudCwgaW5wdXQpO1xuICAgICAgfVxuXG4gICAgICAvLyAncGFuc3RhcnQnIGFuZCAncGFubW92ZSdcbiAgICAgIGlmIChzdGF0ZSA8IFNUQVRFX0VOREVEKSB7XG4gICAgICAgIGVtaXQoc2VsZi5vcHRpb25zLmV2ZW50ICsgc3RhdGVTdHIoc3RhdGUpKTtcbiAgICAgIH1cblxuICAgICAgZW1pdChzZWxmLm9wdGlvbnMuZXZlbnQpOyAvLyBzaW1wbGUgJ2V2ZW50TmFtZScgZXZlbnRzXG5cbiAgICAgIGlmIChpbnB1dC5hZGRpdGlvbmFsRXZlbnQpIHtcbiAgICAgICAgLy8gYWRkaXRpb25hbCBldmVudChwYW5sZWZ0LCBwYW5yaWdodCwgcGluY2hpbiwgcGluY2hvdXQuLi4pXG4gICAgICAgIGVtaXQoaW5wdXQuYWRkaXRpb25hbEV2ZW50KTtcbiAgICAgIH1cblxuICAgICAgLy8gcGFuZW5kIGFuZCBwYW5jYW5jZWxcbiAgICAgIGlmIChzdGF0ZSA+PSBTVEFURV9FTkRFRCkge1xuICAgICAgICBlbWl0KHNlbGYub3B0aW9ucy5ldmVudCArIHN0YXRlU3RyKHN0YXRlKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBDaGVjayB0aGF0IGFsbCB0aGUgcmVxdWlyZSBmYWlsdXJlIHJlY29nbml6ZXJzIGhhcyBmYWlsZWQsXG4gICAgICogaWYgdHJ1ZSwgaXQgZW1pdHMgYSBnZXN0dXJlIGV2ZW50LFxuICAgICAqIG90aGVyd2lzZSwgc2V0dXAgdGhlIHN0YXRlIHRvIEZBSUxFRC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gaW5wdXRcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAndHJ5RW1pdCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRyeUVtaXQoaW5wdXQpIHtcbiAgICAgIGlmICh0aGlzLmNhbkVtaXQoKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbWl0KGlucHV0KTtcbiAgICAgIH1cbiAgICAgIC8vIGl0J3MgZmFpbGluZyBhbnl3YXlcbiAgICAgIHRoaXMuc3RhdGUgPSBTVEFURV9GQUlMRUQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBjYW4gd2UgZW1pdD9cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnY2FuRW1pdCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNhbkVtaXQoKSB7XG4gICAgICB2YXIgaSA9IDA7XG4gICAgICB3aGlsZSAoaSA8IHRoaXMucmVxdWlyZUZhaWwubGVuZ3RoKSB7XG4gICAgICAgIGlmICghKHRoaXMucmVxdWlyZUZhaWxbaV0uc3RhdGUgJiAoU1RBVEVfRkFJTEVEIHwgU1RBVEVfUE9TU0lCTEUpKSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpKys7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIHVwZGF0ZSB0aGUgcmVjb2duaXplclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dERhdGFcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAncmVjb2duaXplJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVjb2duaXplKGlucHV0RGF0YSkge1xuICAgICAgLy8gbWFrZSBhIG5ldyBjb3B5IG9mIHRoZSBpbnB1dERhdGFcbiAgICAgIC8vIHNvIHdlIGNhbiBjaGFuZ2UgdGhlIGlucHV0RGF0YSB3aXRob3V0IG1lc3NpbmcgdXAgdGhlIG90aGVyIHJlY29nbml6ZXJzXG4gICAgICB2YXIgaW5wdXREYXRhQ2xvbmUgPSBhc3NpZ24kMSh7fSwgaW5wdXREYXRhKTtcblxuICAgICAgLy8gaXMgaXMgZW5hYmxlZCBhbmQgYWxsb3cgcmVjb2duaXppbmc/XG4gICAgICBpZiAoIWJvb2xPckZuKHRoaXMub3B0aW9ucy5lbmFibGUsIFt0aGlzLCBpbnB1dERhdGFDbG9uZV0pKSB7XG4gICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IFNUQVRFX0ZBSUxFRDtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyByZXNldCB3aGVuIHdlJ3ZlIHJlYWNoZWQgdGhlIGVuZFxuICAgICAgaWYgKHRoaXMuc3RhdGUgJiAoU1RBVEVfUkVDT0dOSVpFRCB8IFNUQVRFX0NBTkNFTExFRCB8IFNUQVRFX0ZBSUxFRCkpIHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IFNUQVRFX1BPU1NJQkxFO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnN0YXRlID0gdGhpcy5wcm9jZXNzKGlucHV0RGF0YUNsb25lKTtcblxuICAgICAgLy8gdGhlIHJlY29nbml6ZXIgaGFzIHJlY29nbml6ZWQgYSBnZXN0dXJlXG4gICAgICAvLyBzbyB0cmlnZ2VyIGFuIGV2ZW50XG4gICAgICBpZiAodGhpcy5zdGF0ZSAmIChTVEFURV9CRUdBTiB8IFNUQVRFX0NIQU5HRUQgfCBTVEFURV9FTkRFRCB8IFNUQVRFX0NBTkNFTExFRCkpIHtcbiAgICAgICAgdGhpcy50cnlFbWl0KGlucHV0RGF0YUNsb25lKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIHJldHVybiB0aGUgc3RhdGUgb2YgdGhlIHJlY29nbml6ZXJcbiAgICAgKiB0aGUgYWN0dWFsIHJlY29nbml6aW5nIGhhcHBlbnMgaW4gdGhpcyBtZXRob2RcbiAgICAgKiBAdmlydHVhbFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dERhdGFcbiAgICAgKiBAcmV0dXJucyB7Y29uc3RhbnR9IFNUQVRFXG4gICAgICovXG5cbiAgICAvKiBqc2hpbnQgaWdub3JlOnN0YXJ0ICovXG5cbiAgfSwge1xuICAgIGtleTogJ3Byb2Nlc3MnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwcm9jZXNzKGlucHV0RGF0YSkge31cbiAgICAvKiBqc2hpbnQgaWdub3JlOmVuZCAqL1xuXG4gICAgLyoqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiByZXR1cm4gdGhlIHByZWZlcnJlZCB0b3VjaC1hY3Rpb25cbiAgICAgKiBAdmlydHVhbFxuICAgICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnZ2V0VG91Y2hBY3Rpb24nLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRUb3VjaEFjdGlvbigpIHt9XG5cbiAgICAvKipcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIGNhbGxlZCB3aGVuIHRoZSBnZXN0dXJlIGlzbid0IGFsbG93ZWQgdG8gcmVjb2duaXplXG4gICAgICogbGlrZSB3aGVuIGFub3RoZXIgaXMgYmVpbmcgcmVjb2duaXplZCBvciBpdCBpcyBkaXNhYmxlZFxuICAgICAqIEB2aXJ0dWFsXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ3Jlc2V0JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVzZXQoKSB7fVxuICB9XSk7XG4gIHJldHVybiBSZWNvZ25pemVyO1xufSgpO1xuXG5SZWNvZ25pemVyLnByb3RvdHlwZS5kZWZhdWx0cyA9IHt9O1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBUaGlzIHJlY29nbml6ZXIgaXMganVzdCB1c2VkIGFzIGEgYmFzZSBmb3IgdGhlIHNpbXBsZSBhdHRyaWJ1dGUgcmVjb2duaXplcnMuXG4gKiBAY29uc3RydWN0b3JcbiAqIEBleHRlbmRzIFJlY29nbml6ZXJcbiAqL1xuXG52YXIgQXR0clJlY29nbml6ZXIgPSBmdW5jdGlvbiAoX1JlY29nbml6ZXIpIHtcbiAgaW5oZXJpdHMoQXR0clJlY29nbml6ZXIsIF9SZWNvZ25pemVyKTtcblxuICBmdW5jdGlvbiBBdHRyUmVjb2duaXplcigpIHtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBBdHRyUmVjb2duaXplcik7XG4gICAgcmV0dXJuIHBvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgKEF0dHJSZWNvZ25pemVyLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoQXR0clJlY29nbml6ZXIpKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBVc2VkIHRvIGNoZWNrIGlmIGl0IHRoZSByZWNvZ25pemVyIHJlY2VpdmVzIHZhbGlkIGlucHV0LCBsaWtlIGlucHV0LmRpc3RhbmNlID4gMTAuXG4gICAqIEBtZW1iZXJvZiBBdHRyUmVjb2duaXplclxuICAgKiBAcGFyYW0ge09iamVjdH0gaW5wdXRcbiAgICogQHJldHVybnMge0Jvb2xlYW59IHJlY29nbml6ZWRcbiAgICovXG5cblxuICBjcmVhdGVDbGFzcyhBdHRyUmVjb2duaXplciwgW3tcbiAgICBrZXk6ICdhdHRyVGVzdCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGF0dHJUZXN0KGlucHV0KSB7XG4gICAgICB2YXIgb3B0aW9uUG9pbnRlcnMgPSB0aGlzLm9wdGlvbnMucG9pbnRlcnM7XG4gICAgICByZXR1cm4gb3B0aW9uUG9pbnRlcnMgPT09IDAgfHwgaW5wdXQucG9pbnRlcnMubGVuZ3RoID09PSBvcHRpb25Qb2ludGVycztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIFByb2Nlc3MgdGhlIGlucHV0IGFuZCByZXR1cm4gdGhlIHN0YXRlIGZvciB0aGUgcmVjb2duaXplclxuICAgICAqIEBtZW1iZXJvZiBBdHRyUmVjb2duaXplclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dFxuICAgICAqIEByZXR1cm5zIHsqfSBTdGF0ZVxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdwcm9jZXNzJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gcHJvY2VzcyhpbnB1dCkge1xuICAgICAgdmFyIHN0YXRlID0gdGhpcy5zdGF0ZTtcbiAgICAgIHZhciBldmVudFR5cGUgPSBpbnB1dC5ldmVudFR5cGU7XG5cblxuICAgICAgdmFyIGlzUmVjb2duaXplZCA9IHN0YXRlICYgKFNUQVRFX0JFR0FOIHwgU1RBVEVfQ0hBTkdFRCk7XG4gICAgICB2YXIgaXNWYWxpZCA9IHRoaXMuYXR0clRlc3QoaW5wdXQpO1xuXG4gICAgICAvLyBvbiBjYW5jZWwgaW5wdXQgYW5kIHdlJ3ZlIHJlY29nbml6ZWQgYmVmb3JlLCByZXR1cm4gU1RBVEVfQ0FOQ0VMTEVEXG4gICAgICBpZiAoaXNSZWNvZ25pemVkICYmIChldmVudFR5cGUgJiBJTlBVVF9DQU5DRUwgfHwgIWlzVmFsaWQpKSB7XG4gICAgICAgIHJldHVybiBzdGF0ZSB8IFNUQVRFX0NBTkNFTExFRDtcbiAgICAgIH0gZWxzZSBpZiAoaXNSZWNvZ25pemVkIHx8IGlzVmFsaWQpIHtcbiAgICAgICAgaWYgKGV2ZW50VHlwZSAmIElOUFVUX0VORCkge1xuICAgICAgICAgIHJldHVybiBzdGF0ZSB8IFNUQVRFX0VOREVEO1xuICAgICAgICB9IGVsc2UgaWYgKCEoc3RhdGUgJiBTVEFURV9CRUdBTikpIHtcbiAgICAgICAgICByZXR1cm4gU1RBVEVfQkVHQU47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN0YXRlIHwgU1RBVEVfQ0hBTkdFRDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBTVEFURV9GQUlMRUQ7XG4gICAgfVxuICB9XSk7XG4gIHJldHVybiBBdHRyUmVjb2duaXplcjtcbn0oUmVjb2duaXplcik7XG5cbkF0dHJSZWNvZ25pemVyLnByb3RvdHlwZS5kZWZhdWx0cyA9IHtcbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqIEBkZWZhdWx0IDFcbiAgICovXG4gIHBvaW50ZXJzOiAxXG59O1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBSb3RhdGVcbiAqIFJlY29nbml6ZWQgd2hlbiB0d28gb3IgbW9yZSBwb2ludGVyIGFyZSBtb3ZpbmcgaW4gYSBjaXJjdWxhciBtb3Rpb24uXG4gKiBAY29uc3RydWN0b3JcbiAqIEBleHRlbmRzIEF0dHJSZWNvZ25pemVyXG4gKi9cblxudmFyIFJvdGF0ZVJlY29nbml6ZXIgPSBmdW5jdGlvbiAoX0F0dHJSZWNvZ25pemVyKSB7XG4gIGluaGVyaXRzKFJvdGF0ZVJlY29nbml6ZXIsIF9BdHRyUmVjb2duaXplcik7XG5cbiAgZnVuY3Rpb24gUm90YXRlUmVjb2duaXplcigpIHtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBSb3RhdGVSZWNvZ25pemVyKTtcbiAgICByZXR1cm4gcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCAoUm90YXRlUmVjb2duaXplci5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKFJvdGF0ZVJlY29nbml6ZXIpKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgfVxuXG4gIGNyZWF0ZUNsYXNzKFJvdGF0ZVJlY29nbml6ZXIsIFt7XG4gICAga2V5OiAnZ2V0VG91Y2hBY3Rpb24nLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRUb3VjaEFjdGlvbigpIHtcbiAgICAgIHJldHVybiBbVE9VQ0hfQUNUSU9OX05PTkVdO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2F0dHJUZXN0JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gYXR0clRlc3QoaW5wdXQpIHtcbiAgICAgIHJldHVybiBnZXQoUm90YXRlUmVjb2duaXplci5wcm90b3R5cGUuX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihSb3RhdGVSZWNvZ25pemVyLnByb3RvdHlwZSksICdhdHRyVGVzdCcsIHRoaXMpLmNhbGwodGhpcywgaW5wdXQpICYmIChNYXRoLmFicyhpbnB1dC5yb3RhdGlvbikgPiB0aGlzLm9wdGlvbnMudGhyZXNob2xkIHx8IHRoaXMuc3RhdGUgJiBTVEFURV9CRUdBTik7XG4gICAgfVxuICB9XSk7XG4gIHJldHVybiBSb3RhdGVSZWNvZ25pemVyO1xufShBdHRyUmVjb2duaXplcik7XG5cblJvdGF0ZVJlY29nbml6ZXIucHJvdG90eXBlLmRlZmF1bHRzID0ge1xuICBldmVudDogJ3JvdGF0ZScsXG4gIHRocmVzaG9sZDogMCxcbiAgcG9pbnRlcnM6IDJcbn07XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIFBpbmNoXG4gKiBSZWNvZ25pemVkIHdoZW4gdHdvIG9yIG1vcmUgcG9pbnRlcnMgYXJlIG1vdmluZyB0b3dhcmQgKHpvb20taW4pIG9yIGF3YXkgZnJvbSBlYWNoIG90aGVyICh6b29tLW91dCkuXG4gKiBAY29uc3RydWN0b3JcbiAqIEBleHRlbmRzIEF0dHJSZWNvZ25pemVyXG4gKi9cblxudmFyIFBpbmNoUmVjb2duaXplciA9IGZ1bmN0aW9uIChfQXR0clJlY29nbml6ZXIpIHtcbiAgaW5oZXJpdHMoUGluY2hSZWNvZ25pemVyLCBfQXR0clJlY29nbml6ZXIpO1xuXG4gIGZ1bmN0aW9uIFBpbmNoUmVjb2duaXplcigpIHtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBQaW5jaFJlY29nbml6ZXIpO1xuICAgIHJldHVybiBwb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIChQaW5jaFJlY29nbml6ZXIuX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihQaW5jaFJlY29nbml6ZXIpKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgfVxuXG4gIGNyZWF0ZUNsYXNzKFBpbmNoUmVjb2duaXplciwgW3tcbiAgICBrZXk6ICdnZXRUb3VjaEFjdGlvbicsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldFRvdWNoQWN0aW9uKCkge1xuICAgICAgcmV0dXJuIFtUT1VDSF9BQ1RJT05fTk9ORV07XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnYXR0clRlc3QnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhdHRyVGVzdChpbnB1dCkge1xuICAgICAgcmV0dXJuIGdldChQaW5jaFJlY29nbml6ZXIucHJvdG90eXBlLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoUGluY2hSZWNvZ25pemVyLnByb3RvdHlwZSksICdhdHRyVGVzdCcsIHRoaXMpLmNhbGwodGhpcywgaW5wdXQpICYmIChNYXRoLmFicyhpbnB1dC5zY2FsZSAtIDEpID4gdGhpcy5vcHRpb25zLnRocmVzaG9sZCB8fCB0aGlzLnN0YXRlICYgU1RBVEVfQkVHQU4pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2VtaXQnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBlbWl0KGlucHV0KSB7XG4gICAgICBpZiAoaW5wdXQuc2NhbGUgIT09IDEpIHtcbiAgICAgICAgdmFyIGluT3V0ID0gaW5wdXQuc2NhbGUgPCAxID8gJ2luJyA6ICdvdXQnO1xuICAgICAgICBpbnB1dC5hZGRpdGlvbmFsRXZlbnQgPSB0aGlzLm9wdGlvbnMuZXZlbnQgKyBpbk91dDtcbiAgICAgIH1cbiAgICAgIGdldChQaW5jaFJlY29nbml6ZXIucHJvdG90eXBlLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoUGluY2hSZWNvZ25pemVyLnByb3RvdHlwZSksICdlbWl0JywgdGhpcykuY2FsbCh0aGlzLCBpbnB1dCk7XG4gICAgfVxuICB9XSk7XG4gIHJldHVybiBQaW5jaFJlY29nbml6ZXI7XG59KEF0dHJSZWNvZ25pemVyKTtcblxuUGluY2hSZWNvZ25pemVyLnByb3RvdHlwZS5kZWZhdWx0cyA9IHtcbiAgZXZlbnQ6ICdwaW5jaCcsXG4gIHRocmVzaG9sZDogMCxcbiAgcG9pbnRlcnM6IDJcbn07XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIGRpcmVjdGlvbiBjb25zIHRvIHN0cmluZ1xuICogQHBhcmFtIHtjb25zdGFudH0gZGlyZWN0aW9uXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICovXG5mdW5jdGlvbiBkaXJlY3Rpb25TdHIoZGlyZWN0aW9uKSB7XG4gIGlmIChkaXJlY3Rpb24gPT09IERJUkVDVElPTl9ET1dOKSB7XG4gICAgcmV0dXJuICdkb3duJztcbiAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09IERJUkVDVElPTl9VUCkge1xuICAgIHJldHVybiAndXAnO1xuICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gRElSRUNUSU9OX0xFRlQpIHtcbiAgICByZXR1cm4gJ2xlZnQnO1xuICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gRElSRUNUSU9OX1JJR0hUKSB7XG4gICAgcmV0dXJuICdyaWdodCc7XG4gIH1cbiAgcmV0dXJuICcnO1xufVxuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBQYW5cbiAqIFJlY29nbml6ZWQgd2hlbiB0aGUgcG9pbnRlciBpcyBkb3duIGFuZCBtb3ZlZCBpbiB0aGUgYWxsb3dlZCBkaXJlY3Rpb24uXG4gKiBAY29uc3RydWN0b3JcbiAqIEBleHRlbmRzIEF0dHJSZWNvZ25pemVyXG4gKi9cblxudmFyIFBhblJlY29nbml6ZXIgPSBmdW5jdGlvbiAoX0F0dHJSZWNvZ25pemVyKSB7XG4gIGluaGVyaXRzKFBhblJlY29nbml6ZXIsIF9BdHRyUmVjb2duaXplcik7XG5cbiAgZnVuY3Rpb24gUGFuUmVjb2duaXplcigpIHtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBQYW5SZWNvZ25pemVyKTtcblxuICAgIHZhciBfdGhpcyA9IHBvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgKFBhblJlY29nbml6ZXIuX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihQYW5SZWNvZ25pemVyKSkuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG5cbiAgICBfdGhpcy5wWCA9IG51bGw7XG4gICAgX3RoaXMucFkgPSBudWxsO1xuICAgIHJldHVybiBfdGhpcztcbiAgfVxuXG4gIGNyZWF0ZUNsYXNzKFBhblJlY29nbml6ZXIsIFt7XG4gICAga2V5OiAnZ2V0VG91Y2hBY3Rpb24nLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRUb3VjaEFjdGlvbigpIHtcbiAgICAgIHZhciBkaXJlY3Rpb24gPSB0aGlzLm9wdGlvbnMuZGlyZWN0aW9uO1xuXG4gICAgICB2YXIgYWN0aW9ucyA9IFtdO1xuICAgICAgaWYgKGRpcmVjdGlvbiAmIERJUkVDVElPTl9IT1JJWk9OVEFMKSB7XG4gICAgICAgIGFjdGlvbnMucHVzaChUT1VDSF9BQ1RJT05fUEFOX1kpO1xuICAgICAgfVxuICAgICAgaWYgKGRpcmVjdGlvbiAmIERJUkVDVElPTl9WRVJUSUNBTCkge1xuICAgICAgICBhY3Rpb25zLnB1c2goVE9VQ0hfQUNUSU9OX1BBTl9YKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBhY3Rpb25zO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2RpcmVjdGlvblRlc3QnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkaXJlY3Rpb25UZXN0KGlucHV0KSB7XG4gICAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblxuICAgICAgdmFyIGhhc01vdmVkID0gdHJ1ZTtcbiAgICAgIHZhciBkaXN0YW5jZSA9IGlucHV0LmRpc3RhbmNlO1xuICAgICAgdmFyIGRpcmVjdGlvbiA9IGlucHV0LmRpcmVjdGlvbjtcblxuICAgICAgdmFyIHggPSBpbnB1dC5kZWx0YVg7XG4gICAgICB2YXIgeSA9IGlucHV0LmRlbHRhWTtcblxuICAgICAgLy8gbG9jayB0byBheGlzP1xuICAgICAgaWYgKCEoZGlyZWN0aW9uICYgb3B0aW9ucy5kaXJlY3Rpb24pKSB7XG4gICAgICAgIGlmIChvcHRpb25zLmRpcmVjdGlvbiAmIERJUkVDVElPTl9IT1JJWk9OVEFMKSB7XG4gICAgICAgICAgZGlyZWN0aW9uID0geCA9PT0gMCA/IERJUkVDVElPTl9OT05FIDogeCA8IDAgPyBESVJFQ1RJT05fTEVGVCA6IERJUkVDVElPTl9SSUdIVDtcbiAgICAgICAgICBoYXNNb3ZlZCA9IHggIT09IHRoaXMucFg7XG4gICAgICAgICAgZGlzdGFuY2UgPSBNYXRoLmFicyhpbnB1dC5kZWx0YVgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRpcmVjdGlvbiA9IHkgPT09IDAgPyBESVJFQ1RJT05fTk9ORSA6IHkgPCAwID8gRElSRUNUSU9OX1VQIDogRElSRUNUSU9OX0RPV047XG4gICAgICAgICAgaGFzTW92ZWQgPSB5ICE9PSB0aGlzLnBZO1xuICAgICAgICAgIGRpc3RhbmNlID0gTWF0aC5hYnMoaW5wdXQuZGVsdGFZKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaW5wdXQuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICAgICAgcmV0dXJuIGhhc01vdmVkICYmIGRpc3RhbmNlID4gb3B0aW9ucy50aHJlc2hvbGQgJiYgZGlyZWN0aW9uICYgb3B0aW9ucy5kaXJlY3Rpb247XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnYXR0clRlc3QnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhdHRyVGVzdChpbnB1dCkge1xuICAgICAgcmV0dXJuIEF0dHJSZWNvZ25pemVyLnByb3RvdHlwZS5hdHRyVGVzdC5jYWxsKHRoaXMsIGlucHV0KSAmJiAoIC8vIHJlcGxhY2Ugd2l0aCBhIHN1cGVyIGNhbGxcbiAgICAgIHRoaXMuc3RhdGUgJiBTVEFURV9CRUdBTiB8fCAhKHRoaXMuc3RhdGUgJiBTVEFURV9CRUdBTikgJiYgdGhpcy5kaXJlY3Rpb25UZXN0KGlucHV0KSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnZW1pdCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGVtaXQoaW5wdXQpIHtcblxuICAgICAgdGhpcy5wWCA9IGlucHV0LmRlbHRhWDtcbiAgICAgIHRoaXMucFkgPSBpbnB1dC5kZWx0YVk7XG5cbiAgICAgIHZhciBkaXJlY3Rpb24gPSBkaXJlY3Rpb25TdHIoaW5wdXQuZGlyZWN0aW9uKTtcblxuICAgICAgaWYgKGRpcmVjdGlvbikge1xuICAgICAgICBpbnB1dC5hZGRpdGlvbmFsRXZlbnQgPSB0aGlzLm9wdGlvbnMuZXZlbnQgKyBkaXJlY3Rpb247XG4gICAgICB9XG4gICAgICBnZXQoUGFuUmVjb2duaXplci5wcm90b3R5cGUuX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihQYW5SZWNvZ25pemVyLnByb3RvdHlwZSksICdlbWl0JywgdGhpcykuY2FsbCh0aGlzLCBpbnB1dCk7XG4gICAgfVxuICB9XSk7XG4gIHJldHVybiBQYW5SZWNvZ25pemVyO1xufShBdHRyUmVjb2duaXplcik7XG5cblBhblJlY29nbml6ZXIucHJvdG90eXBlLmRlZmF1bHRzID0ge1xuICBldmVudDogJ3BhbicsXG4gIHRocmVzaG9sZDogMTAsXG4gIHBvaW50ZXJzOiAxLFxuICBkaXJlY3Rpb246IERJUkVDVElPTl9BTExcbn07XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIFN3aXBlXG4gKiBSZWNvZ25pemVkIHdoZW4gdGhlIHBvaW50ZXIgaXMgbW92aW5nIGZhc3QgKHZlbG9jaXR5KSwgd2l0aCBlbm91Z2ggZGlzdGFuY2UgaW4gdGhlIGFsbG93ZWQgZGlyZWN0aW9uLlxuICogQGNvbnN0cnVjdG9yXG4gKiBAZXh0ZW5kcyBBdHRyUmVjb2duaXplclxuICovXG5cbnZhciBTd2lwZVJlY29nbml6ZXIgPSBmdW5jdGlvbiAoX0F0dHJSZWNvZ25pemVyKSB7XG4gIGluaGVyaXRzKFN3aXBlUmVjb2duaXplciwgX0F0dHJSZWNvZ25pemVyKTtcblxuICBmdW5jdGlvbiBTd2lwZVJlY29nbml6ZXIoKSB7XG4gICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgU3dpcGVSZWNvZ25pemVyKTtcbiAgICByZXR1cm4gcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCAoU3dpcGVSZWNvZ25pemVyLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoU3dpcGVSZWNvZ25pemVyKSkuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gIH1cblxuICBjcmVhdGVDbGFzcyhTd2lwZVJlY29nbml6ZXIsIFt7XG4gICAga2V5OiAnZ2V0VG91Y2hBY3Rpb24nLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRUb3VjaEFjdGlvbigpIHtcbiAgICAgIHJldHVybiBQYW5SZWNvZ25pemVyLnByb3RvdHlwZS5nZXRUb3VjaEFjdGlvbi5jYWxsKHRoaXMpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2F0dHJUZXN0JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gYXR0clRlc3QoaW5wdXQpIHtcbiAgICAgIHZhciBkaXJlY3Rpb24gPSB0aGlzLm9wdGlvbnMuZGlyZWN0aW9uO1xuXG4gICAgICB2YXIgdmVsb2NpdHkgPSB2b2lkIDA7XG5cbiAgICAgIGlmIChkaXJlY3Rpb24gJiAoRElSRUNUSU9OX0hPUklaT05UQUwgfCBESVJFQ1RJT05fVkVSVElDQUwpKSB7XG4gICAgICAgIHZlbG9jaXR5ID0gaW5wdXQub3ZlcmFsbFZlbG9jaXR5O1xuICAgICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gJiBESVJFQ1RJT05fSE9SSVpPTlRBTCkge1xuICAgICAgICB2ZWxvY2l0eSA9IGlucHV0Lm92ZXJhbGxWZWxvY2l0eVg7XG4gICAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiAmIERJUkVDVElPTl9WRVJUSUNBTCkge1xuICAgICAgICB2ZWxvY2l0eSA9IGlucHV0Lm92ZXJhbGxWZWxvY2l0eVk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBnZXQoU3dpcGVSZWNvZ25pemVyLnByb3RvdHlwZS5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKFN3aXBlUmVjb2duaXplci5wcm90b3R5cGUpLCAnYXR0clRlc3QnLCB0aGlzKS5jYWxsKHRoaXMsIGlucHV0KSAmJiBkaXJlY3Rpb24gJiBpbnB1dC5vZmZzZXREaXJlY3Rpb24gJiYgaW5wdXQuZGlzdGFuY2UgPiB0aGlzLm9wdGlvbnMudGhyZXNob2xkICYmIGlucHV0Lm1heFBvaW50ZXJzID09PSB0aGlzLm9wdGlvbnMucG9pbnRlcnMgJiYgYWJzKHZlbG9jaXR5KSA+IHRoaXMub3B0aW9ucy52ZWxvY2l0eSAmJiBpbnB1dC5ldmVudFR5cGUgJiBJTlBVVF9FTkQ7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnZW1pdCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGVtaXQoaW5wdXQpIHtcbiAgICAgIHZhciBkaXJlY3Rpb24gPSBkaXJlY3Rpb25TdHIoaW5wdXQub2Zmc2V0RGlyZWN0aW9uKTtcbiAgICAgIGlmIChkaXJlY3Rpb24pIHtcbiAgICAgICAgdGhpcy5tYW5hZ2VyLmVtaXQodGhpcy5vcHRpb25zLmV2ZW50ICsgZGlyZWN0aW9uLCBpbnB1dCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubWFuYWdlci5lbWl0KHRoaXMub3B0aW9ucy5ldmVudCwgaW5wdXQpO1xuICAgIH1cbiAgfV0pO1xuICByZXR1cm4gU3dpcGVSZWNvZ25pemVyO1xufShBdHRyUmVjb2duaXplcik7XG5cblN3aXBlUmVjb2duaXplci5wcm90b3R5cGUuZGVmYXVsdHMgPSB7XG4gIGV2ZW50OiAnc3dpcGUnLFxuICB0aHJlc2hvbGQ6IDEwLFxuICB2ZWxvY2l0eTogMC4zLFxuICBkaXJlY3Rpb246IERJUkVDVElPTl9IT1JJWk9OVEFMIHwgRElSRUNUSU9OX1ZFUlRJQ0FMLFxuICBwb2ludGVyczogMVxufTtcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogc2ltcGxlIGZ1bmN0aW9uIGJpbmRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcGFyYW0ge09iamVjdH0gY29udGV4dFxuICogQHJldHVybnMge0Z1bmN0aW9ufVxuICovXG5mdW5jdGlvbiBiaW5kRm4oZm4sIGNvbnRleHQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGJvdW5kRm4oKSB7XG4gICAgcmV0dXJuIGZuLmFwcGx5KGNvbnRleHQsIGFyZ3VtZW50cyk7XG4gIH07XG59XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIHNldCBhIHRpbWVvdXQgd2l0aCBhIGdpdmVuIHNjb3BlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHBhcmFtIHtOdW1iZXJ9IHRpbWVvdXRcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0XG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICovXG5mdW5jdGlvbiBzZXRUaW1lb3V0Q29udGV4dChmbiwgdGltZW91dCwgY29udGV4dCkge1xuICByZXR1cm4gc2V0VGltZW91dChiaW5kRm4oZm4sIGNvbnRleHQpLCB0aW1lb3V0KTtcbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogY2FsY3VsYXRlIHRoZSBhYnNvbHV0ZSBkaXN0YW5jZSBiZXR3ZWVuIHR3byBwb2ludHNcbiAqIEBwYXJhbSB7T2JqZWN0fSBwMSB7eCwgeX1cbiAqIEBwYXJhbSB7T2JqZWN0fSBwMiB7eCwgeX1cbiAqIEBwYXJhbSB7QXJyYXl9IFtwcm9wc10gY29udGFpbmluZyB4IGFuZCB5IGtleXNcbiAqIEByZXR1cm4ge051bWJlcn0gZGlzdGFuY2VcbiAqL1xuZnVuY3Rpb24gZ2V0RGlzdGFuY2UocDEsIHAyLCBwcm9wcykge1xuICBpZiAoIXByb3BzKSB7XG4gICAgcHJvcHMgPSBQUk9QU19YWTtcbiAgfVxuICB2YXIgeCA9IHAyW3Byb3BzWzBdXSAtIHAxW3Byb3BzWzBdXTtcbiAgdmFyIHkgPSBwMltwcm9wc1sxXV0gLSBwMVtwcm9wc1sxXV07XG5cbiAgcmV0dXJuIE1hdGguc3FydCh4ICogeCArIHkgKiB5KTtcbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQSB0YXAgaXMgcmVjb2duaXplZCB3aGVuIHRoZSBwb2ludGVyIGlzIGRvaW5nIGEgc21hbGwgdGFwL2NsaWNrLiBNdWx0aXBsZSB0YXBzIGFyZSByZWNvZ25pemVkIGlmIHRoZXkgb2NjdXJcbiAqIGJldHdlZW4gdGhlIGdpdmVuIGludGVydmFsIGFuZCBwb3NpdGlvbi4gVGhlIGRlbGF5IG9wdGlvbiBjYW4gYmUgdXNlZCB0byByZWNvZ25pemUgbXVsdGktdGFwcyB3aXRob3V0IGZpcmluZ1xuICogYSBzaW5nbGUgdGFwLlxuICpcbiAqIFRoZSBldmVudERhdGEgZnJvbSB0aGUgZW1pdHRlZCBldmVudCBjb250YWlucyB0aGUgcHJvcGVydHkgYHRhcENvdW50YCwgd2hpY2ggY29udGFpbnMgdGhlIGFtb3VudCBvZlxuICogbXVsdGktdGFwcyBiZWluZyByZWNvZ25pemVkLlxuICogQGNvbnN0cnVjdG9yXG4gKiBAZXh0ZW5kcyBSZWNvZ25pemVyXG4gKi9cblxudmFyIFRhcFJlY29nbml6ZXIgPSBmdW5jdGlvbiAoX1JlY29nbml6ZXIpIHtcbiAgaW5oZXJpdHMoVGFwUmVjb2duaXplciwgX1JlY29nbml6ZXIpO1xuXG4gIGZ1bmN0aW9uIFRhcFJlY29nbml6ZXIoKSB7XG4gICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgVGFwUmVjb2duaXplcik7XG5cbiAgICAvLyBwcmV2aW91cyB0aW1lIGFuZCBjZW50ZXIsXG4gICAgLy8gdXNlZCBmb3IgdGFwIGNvdW50aW5nXG4gICAgdmFyIF90aGlzID0gcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCAoVGFwUmVjb2duaXplci5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKFRhcFJlY29nbml6ZXIpKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcblxuICAgIF90aGlzLnBUaW1lID0gZmFsc2U7XG4gICAgX3RoaXMucENlbnRlciA9IGZhbHNlO1xuXG4gICAgX3RoaXMuX3RpbWVyID0gbnVsbDtcbiAgICBfdGhpcy5faW5wdXQgPSBudWxsO1xuICAgIF90aGlzLmNvdW50ID0gMDtcbiAgICByZXR1cm4gX3RoaXM7XG4gIH1cblxuICBjcmVhdGVDbGFzcyhUYXBSZWNvZ25pemVyLCBbe1xuICAgIGtleTogJ2dldFRvdWNoQWN0aW9uJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0VG91Y2hBY3Rpb24oKSB7XG4gICAgICByZXR1cm4gW1RPVUNIX0FDVElPTl9NQU5JUFVMQVRJT05dO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3Byb2Nlc3MnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwcm9jZXNzKGlucHV0KSB7XG4gICAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG5cblxuICAgICAgdmFyIHZhbGlkUG9pbnRlcnMgPSBpbnB1dC5wb2ludGVycy5sZW5ndGggPT09IG9wdGlvbnMucG9pbnRlcnM7XG4gICAgICB2YXIgdmFsaWRNb3ZlbWVudCA9IGlucHV0LmRpc3RhbmNlIDwgb3B0aW9ucy50aHJlc2hvbGQ7XG4gICAgICB2YXIgdmFsaWRUb3VjaFRpbWUgPSBpbnB1dC5kZWx0YVRpbWUgPCBvcHRpb25zLnRpbWU7XG5cbiAgICAgIHRoaXMucmVzZXQoKTtcblxuICAgICAgaWYgKGlucHV0LmV2ZW50VHlwZSAmIElOUFVUX1NUQVJUICYmIHRoaXMuY291bnQgPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmFpbFRpbWVvdXQoKTtcbiAgICAgIH1cblxuICAgICAgLy8gd2Ugb25seSBhbGxvdyBsaXR0bGUgbW92ZW1lbnRcbiAgICAgIC8vIGFuZCB3ZSd2ZSByZWFjaGVkIGFuIGVuZCBldmVudCwgc28gYSB0YXAgaXMgcG9zc2libGVcbiAgICAgIGlmICh2YWxpZE1vdmVtZW50ICYmIHZhbGlkVG91Y2hUaW1lICYmIHZhbGlkUG9pbnRlcnMpIHtcbiAgICAgICAgaWYgKGlucHV0LmV2ZW50VHlwZSAhPT0gSU5QVVRfRU5EKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZmFpbFRpbWVvdXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB2YWxpZEludGVydmFsID0gdGhpcy5wVGltZSA/IGlucHV0LnRpbWVTdGFtcCAtIHRoaXMucFRpbWUgPCBvcHRpb25zLmludGVydmFsIDogdHJ1ZTtcbiAgICAgICAgdmFyIHZhbGlkTXVsdGlUYXAgPSAhdGhpcy5wQ2VudGVyIHx8IGdldERpc3RhbmNlKHRoaXMucENlbnRlciwgaW5wdXQuY2VudGVyKSA8IG9wdGlvbnMucG9zVGhyZXNob2xkO1xuXG4gICAgICAgIHRoaXMucFRpbWUgPSBpbnB1dC50aW1lU3RhbXA7XG4gICAgICAgIHRoaXMucENlbnRlciA9IGlucHV0LmNlbnRlcjtcblxuICAgICAgICBpZiAoIXZhbGlkTXVsdGlUYXAgfHwgIXZhbGlkSW50ZXJ2YWwpIHtcbiAgICAgICAgICB0aGlzLmNvdW50ID0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmNvdW50ICs9IDE7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9pbnB1dCA9IGlucHV0O1xuXG4gICAgICAgIC8vIGlmIHRhcCBjb3VudCBtYXRjaGVzIHdlIGhhdmUgcmVjb2duaXplZCBpdCxcbiAgICAgICAgLy8gZWxzZSBpdCBoYXMgYmVnYW4gcmVjb2duaXppbmcuLi5cbiAgICAgICAgdmFyIHRhcENvdW50ID0gdGhpcy5jb3VudCAlIG9wdGlvbnMudGFwcztcbiAgICAgICAgaWYgKHRhcENvdW50ID09PSAwKSB7XG4gICAgICAgICAgLy8gbm8gZmFpbGluZyByZXF1aXJlbWVudHMsIGltbWVkaWF0ZWx5IHRyaWdnZXIgdGhlIHRhcCBldmVudFxuICAgICAgICAgIC8vIG9yIHdhaXQgYXMgbG9uZyBhcyB0aGUgbXVsdGl0YXAgaW50ZXJ2YWwgdG8gdHJpZ2dlclxuICAgICAgICAgIGlmICghdGhpcy5oYXNSZXF1aXJlRmFpbHVyZXMoKSkge1xuICAgICAgICAgICAgcmV0dXJuIFNUQVRFX1JFQ09HTklaRUQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3RpbWVyID0gc2V0VGltZW91dENvbnRleHQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICBfdGhpczIuc3RhdGUgPSBTVEFURV9SRUNPR05JWkVEO1xuICAgICAgICAgICAgICBfdGhpczIudHJ5RW1pdCgpO1xuICAgICAgICAgICAgfSwgb3B0aW9ucy5pbnRlcnZhbCwgdGhpcyk7XG4gICAgICAgICAgICByZXR1cm4gU1RBVEVfQkVHQU47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gU1RBVEVfRkFJTEVEO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2ZhaWxUaW1lb3V0JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZmFpbFRpbWVvdXQoKSB7XG4gICAgICB2YXIgX3RoaXMzID0gdGhpcztcblxuICAgICAgdGhpcy5fdGltZXIgPSBzZXRUaW1lb3V0Q29udGV4dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIF90aGlzMy5zdGF0ZSA9IFNUQVRFX0ZBSUxFRDtcbiAgICAgIH0sIHRoaXMub3B0aW9ucy5pbnRlcnZhbCwgdGhpcyk7XG4gICAgICByZXR1cm4gU1RBVEVfRkFJTEVEO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3Jlc2V0JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVzZXQoKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5fdGltZXIpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2VtaXQnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBlbWl0KCkge1xuICAgICAgaWYgKHRoaXMuc3RhdGUgPT09IFNUQVRFX1JFQ09HTklaRUQpIHtcbiAgICAgICAgdGhpcy5faW5wdXQudGFwQ291bnQgPSB0aGlzLmNvdW50O1xuICAgICAgICB0aGlzLm1hbmFnZXIuZW1pdCh0aGlzLm9wdGlvbnMuZXZlbnQsIHRoaXMuX2lucHV0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1dKTtcbiAgcmV0dXJuIFRhcFJlY29nbml6ZXI7XG59KFJlY29nbml6ZXIpO1xuXG5UYXBSZWNvZ25pemVyLnByb3RvdHlwZS5kZWZhdWx0cyA9IHtcbiAgZXZlbnQ6ICd0YXAnLFxuICBwb2ludGVyczogMSxcbiAgdGFwczogMSxcbiAgaW50ZXJ2YWw6IDMwMCwgLy8gbWF4IHRpbWUgYmV0d2VlbiB0aGUgbXVsdGktdGFwIHRhcHNcbiAgdGltZTogMjUwLCAvLyBtYXggdGltZSBvZiB0aGUgcG9pbnRlciB0byBiZSBkb3duIChsaWtlIGZpbmdlciBvbiB0aGUgc2NyZWVuKVxuICB0aHJlc2hvbGQ6IDksIC8vIGEgbWluaW1hbCBtb3ZlbWVudCBpcyBvaywgYnV0IGtlZXAgaXQgbG93XG4gIHBvc1RocmVzaG9sZDogMTAgLy8gYSBtdWx0aS10YXAgY2FuIGJlIGEgYml0IG9mZiB0aGUgaW5pdGlhbCBwb3NpdGlvblxufTtcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogUHJlc3NcbiAqIFJlY29nbml6ZWQgd2hlbiB0aGUgcG9pbnRlciBpcyBkb3duIGZvciB4IG1zIHdpdGhvdXQgYW55IG1vdmVtZW50LlxuICogQGNvbnN0cnVjdG9yXG4gKiBAZXh0ZW5kcyBSZWNvZ25pemVyXG4gKi9cblxudmFyIFByZXNzUmVjb2duaXplciA9IGZ1bmN0aW9uIChfUmVjb2duaXplcikge1xuICBpbmhlcml0cyhQcmVzc1JlY29nbml6ZXIsIF9SZWNvZ25pemVyKTtcblxuICBmdW5jdGlvbiBQcmVzc1JlY29nbml6ZXIoKSB7XG4gICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgUHJlc3NSZWNvZ25pemVyKTtcblxuICAgIHZhciBfdGhpcyA9IHBvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgKFByZXNzUmVjb2duaXplci5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKFByZXNzUmVjb2duaXplcikpLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuXG4gICAgX3RoaXMuX3RpbWVyID0gbnVsbDtcbiAgICBfdGhpcy5faW5wdXQgPSBudWxsO1xuICAgIHJldHVybiBfdGhpcztcbiAgfVxuXG4gIGNyZWF0ZUNsYXNzKFByZXNzUmVjb2duaXplciwgW3tcbiAgICBrZXk6ICdnZXRUb3VjaEFjdGlvbicsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldFRvdWNoQWN0aW9uKCkge1xuICAgICAgcmV0dXJuIFtUT1VDSF9BQ1RJT05fQVVUT107XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAncHJvY2VzcycsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHByb2Nlc3MoaW5wdXQpIHtcbiAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblxuICAgICAgdmFyIHZhbGlkUG9pbnRlcnMgPSBpbnB1dC5wb2ludGVycy5sZW5ndGggPT09IG9wdGlvbnMucG9pbnRlcnM7XG4gICAgICB2YXIgdmFsaWRNb3ZlbWVudCA9IGlucHV0LmRpc3RhbmNlIDwgb3B0aW9ucy50aHJlc2hvbGQ7XG4gICAgICB2YXIgdmFsaWRUaW1lID0gaW5wdXQuZGVsdGFUaW1lID4gb3B0aW9ucy50aW1lO1xuXG4gICAgICB0aGlzLl9pbnB1dCA9IGlucHV0O1xuXG4gICAgICAvLyB3ZSBvbmx5IGFsbG93IGxpdHRsZSBtb3ZlbWVudFxuICAgICAgLy8gYW5kIHdlJ3ZlIHJlYWNoZWQgYW4gZW5kIGV2ZW50LCBzbyBhIHRhcCBpcyBwb3NzaWJsZVxuICAgICAgaWYgKCF2YWxpZE1vdmVtZW50IHx8ICF2YWxpZFBvaW50ZXJzIHx8IGlucHV0LmV2ZW50VHlwZSAmIChJTlBVVF9FTkQgfCBJTlBVVF9DQU5DRUwpICYmICF2YWxpZFRpbWUpIHtcbiAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgfSBlbHNlIGlmIChpbnB1dC5ldmVudFR5cGUgJiBJTlBVVF9TVEFSVCkge1xuICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgIHRoaXMuX3RpbWVyID0gc2V0VGltZW91dENvbnRleHQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIF90aGlzMi5zdGF0ZSA9IFNUQVRFX1JFQ09HTklaRUQ7XG4gICAgICAgICAgX3RoaXMyLnRyeUVtaXQoKTtcbiAgICAgICAgfSwgb3B0aW9ucy50aW1lLCB0aGlzKTtcbiAgICAgIH0gZWxzZSBpZiAoaW5wdXQuZXZlbnRUeXBlICYgSU5QVVRfRU5EKSB7XG4gICAgICAgIHJldHVybiBTVEFURV9SRUNPR05JWkVEO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFNUQVRFX0ZBSUxFRDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdyZXNldCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlc2V0KCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVyKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdlbWl0JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZW1pdChpbnB1dCkge1xuICAgICAgaWYgKHRoaXMuc3RhdGUgIT09IFNUQVRFX1JFQ09HTklaRUQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoaW5wdXQgJiYgaW5wdXQuZXZlbnRUeXBlICYgSU5QVVRfRU5EKSB7XG4gICAgICAgIHRoaXMubWFuYWdlci5lbWl0KHRoaXMub3B0aW9ucy5ldmVudCArICd1cCcsIGlucHV0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2lucHV0LnRpbWVTdGFtcCA9IG5vdygpO1xuICAgICAgICB0aGlzLm1hbmFnZXIuZW1pdCh0aGlzLm9wdGlvbnMuZXZlbnQsIHRoaXMuX2lucHV0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1dKTtcbiAgcmV0dXJuIFByZXNzUmVjb2duaXplcjtcbn0oUmVjb2duaXplcik7XG5cblByZXNzUmVjb2duaXplci5wcm90b3R5cGUuZGVmYXVsdHMgPSB7XG4gIGV2ZW50OiAncHJlc3MnLFxuICBwb2ludGVyczogMSxcbiAgdGltZTogMjUxLCAvLyBtaW5pbWFsIHRpbWUgb2YgdGhlIHBvaW50ZXIgdG8gYmUgcHJlc3NlZFxuICB0aHJlc2hvbGQ6IDkgLy8gYSBtaW5pbWFsIG1vdmVtZW50IGlzIG9rLCBidXQga2VlcCBpdCBsb3dcbn07XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIHNtYWxsIGluZGV4T2Ygd3JhcHBlclxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHBhcmFtIHtTdHJpbmd9IGZpbmRcbiAqIEByZXR1cm5zIHtCb29sZWFufSBmb3VuZFxuICovXG5mdW5jdGlvbiBpblN0cihzdHIsIGZpbmQpIHtcbiAgcmV0dXJuIHN0ci5pbmRleE9mKGZpbmQpID4gLTE7XG59XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIHdoZW4gdGhlIHRvdWNoQWN0aW9ucyBhcmUgY29sbGVjdGVkIHRoZXkgYXJlIG5vdCBhIHZhbGlkIHZhbHVlLCBzbyB3ZSBuZWVkIHRvIGNsZWFuIHRoaW5ncyB1cC4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGFjdGlvbnNcbiAqIEByZXR1cm5zIHsqfVxuICovXG5mdW5jdGlvbiBjbGVhblRvdWNoQWN0aW9ucyhhY3Rpb25zKSB7XG4gIC8vIG5vbmVcbiAgaWYgKGluU3RyKGFjdGlvbnMsIFRPVUNIX0FDVElPTl9OT05FKSkge1xuICAgIHJldHVybiBUT1VDSF9BQ1RJT05fTk9ORTtcbiAgfVxuXG4gIHZhciBoYXNQYW5YID0gaW5TdHIoYWN0aW9ucywgVE9VQ0hfQUNUSU9OX1BBTl9YKTtcbiAgdmFyIGhhc1BhblkgPSBpblN0cihhY3Rpb25zLCBUT1VDSF9BQ1RJT05fUEFOX1kpO1xuXG4gIC8vIGlmIGJvdGggcGFuLXggYW5kIHBhbi15IGFyZSBzZXQgKGRpZmZlcmVudCByZWNvZ25pemVyc1xuICAvLyBmb3IgZGlmZmVyZW50IGRpcmVjdGlvbnMsIGUuZy4gaG9yaXpvbnRhbCBwYW4gYnV0IHZlcnRpY2FsIHN3aXBlPylcbiAgLy8gd2UgbmVlZCBub25lIChhcyBvdGhlcndpc2Ugd2l0aCBwYW4teCBwYW4teSBjb21iaW5lZCBub25lIG9mIHRoZXNlXG4gIC8vIHJlY29nbml6ZXJzIHdpbGwgd29yaywgc2luY2UgdGhlIGJyb3dzZXIgd291bGQgaGFuZGxlIGFsbCBwYW5uaW5nXG4gIGlmIChoYXNQYW5YICYmIGhhc1BhblkpIHtcbiAgICByZXR1cm4gVE9VQ0hfQUNUSU9OX05PTkU7XG4gIH1cblxuICAvLyBwYW4teCBPUiBwYW4teVxuICBpZiAoaGFzUGFuWCB8fCBoYXNQYW5ZKSB7XG4gICAgcmV0dXJuIGhhc1BhblggPyBUT1VDSF9BQ1RJT05fUEFOX1ggOiBUT1VDSF9BQ1RJT05fUEFOX1k7XG4gIH1cblxuICAvLyBtYW5pcHVsYXRpb25cbiAgaWYgKGluU3RyKGFjdGlvbnMsIFRPVUNIX0FDVElPTl9NQU5JUFVMQVRJT04pKSB7XG4gICAgcmV0dXJuIFRPVUNIX0FDVElPTl9NQU5JUFVMQVRJT047XG4gIH1cblxuICByZXR1cm4gVE9VQ0hfQUNUSU9OX0FVVE87XG59XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIFRvdWNoIEFjdGlvblxuICogc2V0cyB0aGUgdG91Y2hBY3Rpb24gcHJvcGVydHkgb3IgdXNlcyB0aGUganMgYWx0ZXJuYXRpdmVcbiAqIEBwYXJhbSB7TWFuYWdlcn0gbWFuYWdlclxuICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuXG52YXIgVG91Y2hBY3Rpb24gPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFRvdWNoQWN0aW9uKG1hbmFnZXIsIHZhbHVlKSB7XG4gICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgVG91Y2hBY3Rpb24pO1xuXG4gICAgdGhpcy5tYW5hZ2VyID0gbWFuYWdlcjtcbiAgICB0aGlzLnNldCh2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICogc2V0IHRoZSB0b3VjaEFjdGlvbiB2YWx1ZSBvbiB0aGUgZWxlbWVudCBvciBlbmFibGUgdGhlIHBvbHlmaWxsXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZVxuICAgKi9cblxuXG4gIGNyZWF0ZUNsYXNzKFRvdWNoQWN0aW9uLCBbe1xuICAgIGtleTogJ3NldCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNldCh2YWx1ZSkge1xuICAgICAgLy8gZmluZCBvdXQgdGhlIHRvdWNoLWFjdGlvbiBieSB0aGUgZXZlbnQgaGFuZGxlcnNcbiAgICAgIGlmICh2YWx1ZSA9PT0gVE9VQ0hfQUNUSU9OX0NPTVBVVEUpIHtcbiAgICAgICAgdmFsdWUgPSB0aGlzLmNvbXB1dGUoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKE5BVElWRV9UT1VDSF9BQ1RJT04gJiYgdGhpcy5tYW5hZ2VyLmVsZW1lbnQuc3R5bGUgJiYgVE9VQ0hfQUNUSU9OX01BUFt2YWx1ZV0pIHtcbiAgICAgICAgdGhpcy5tYW5hZ2VyLmVsZW1lbnQuc3R5bGVbUFJFRklYRURfVE9VQ0hfQUNUSU9OXSA9IHZhbHVlO1xuICAgICAgfVxuICAgICAgdGhpcy5hY3Rpb25zID0gdmFsdWUudG9Mb3dlckNhc2UoKS50cmltKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBqdXN0IHJlLXNldCB0aGUgdG91Y2hBY3Rpb24gdmFsdWVcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAndXBkYXRlJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gdXBkYXRlKCkge1xuICAgICAgdGhpcy5zZXQodGhpcy5tYW5hZ2VyLm9wdGlvbnMudG91Y2hBY3Rpb24pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogY29tcHV0ZSB0aGUgdmFsdWUgZm9yIHRoZSB0b3VjaEFjdGlvbiBwcm9wZXJ0eSBiYXNlZCBvbiB0aGUgcmVjb2duaXplcidzIHNldHRpbmdzXG4gICAgICogQHJldHVybnMge1N0cmluZ30gdmFsdWVcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnY29tcHV0ZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXB1dGUoKSB7XG4gICAgICB2YXIgYWN0aW9ucyA9IFtdO1xuICAgICAgZWFjaCh0aGlzLm1hbmFnZXIucmVjb2duaXplcnMsIGZ1bmN0aW9uIChyZWNvZ25pemVyKSB7XG4gICAgICAgIGlmIChib29sT3JGbihyZWNvZ25pemVyLm9wdGlvbnMuZW5hYmxlLCBbcmVjb2duaXplcl0pKSB7XG4gICAgICAgICAgYWN0aW9ucyA9IGFjdGlvbnMuY29uY2F0KHJlY29nbml6ZXIuZ2V0VG91Y2hBY3Rpb24oKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGNsZWFuVG91Y2hBY3Rpb25zKGFjdGlvbnMuam9pbignICcpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIHRoaXMgbWV0aG9kIGlzIGNhbGxlZCBvbiBlYWNoIGlucHV0IGN5Y2xlIGFuZCBwcm92aWRlcyB0aGUgcHJldmVudGluZyBvZiB0aGUgYnJvd3NlciBiZWhhdmlvclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dFxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdwcmV2ZW50RGVmYXVsdHMnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwcmV2ZW50RGVmYXVsdHMoaW5wdXQpIHtcbiAgICAgIHZhciBzcmNFdmVudCA9IGlucHV0LnNyY0V2ZW50O1xuXG4gICAgICB2YXIgZGlyZWN0aW9uID0gaW5wdXQub2Zmc2V0RGlyZWN0aW9uO1xuXG4gICAgICAvLyBpZiB0aGUgdG91Y2ggYWN0aW9uIGRpZCBwcmV2ZW50ZWQgb25jZSB0aGlzIHNlc3Npb25cbiAgICAgIGlmICh0aGlzLm1hbmFnZXIuc2Vzc2lvbi5wcmV2ZW50ZWQpIHtcbiAgICAgICAgc3JjRXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgYWN0aW9ucyA9IHRoaXMuYWN0aW9ucztcblxuICAgICAgdmFyIGhhc05vbmUgPSBpblN0cihhY3Rpb25zLCBUT1VDSF9BQ1RJT05fTk9ORSkgJiYgIVRPVUNIX0FDVElPTl9NQVBbVE9VQ0hfQUNUSU9OX05PTkVdO1xuICAgICAgdmFyIGhhc1BhblkgPSBpblN0cihhY3Rpb25zLCBUT1VDSF9BQ1RJT05fUEFOX1kpICYmICFUT1VDSF9BQ1RJT05fTUFQW1RPVUNIX0FDVElPTl9QQU5fWV07XG4gICAgICB2YXIgaGFzUGFuWCA9IGluU3RyKGFjdGlvbnMsIFRPVUNIX0FDVElPTl9QQU5fWCkgJiYgIVRPVUNIX0FDVElPTl9NQVBbVE9VQ0hfQUNUSU9OX1BBTl9YXTtcblxuICAgICAgaWYgKGhhc05vbmUpIHtcbiAgICAgICAgLy8gZG8gbm90IHByZXZlbnQgZGVmYXVsdHMgaWYgdGhpcyBpcyBhIHRhcCBnZXN0dXJlXG4gICAgICAgIHZhciBpc1RhcFBvaW50ZXIgPSBpbnB1dC5wb2ludGVycy5sZW5ndGggPT09IDE7XG4gICAgICAgIHZhciBpc1RhcE1vdmVtZW50ID0gaW5wdXQuZGlzdGFuY2UgPCAyO1xuICAgICAgICB2YXIgaXNUYXBUb3VjaFRpbWUgPSBpbnB1dC5kZWx0YVRpbWUgPCAyNTA7XG5cbiAgICAgICAgaWYgKGlzVGFwUG9pbnRlciAmJiBpc1RhcE1vdmVtZW50ICYmIGlzVGFwVG91Y2hUaW1lKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChoYXNQYW5YICYmIGhhc1BhblkpIHtcbiAgICAgICAgLy8gYHBhbi14IHBhbi15YCBtZWFucyBicm93c2VyIGhhbmRsZXMgYWxsIHNjcm9sbGluZy9wYW5uaW5nLCBkbyBub3QgcHJldmVudFxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChoYXNOb25lIHx8IGhhc1BhblkgJiYgZGlyZWN0aW9uICYgRElSRUNUSU9OX0hPUklaT05UQUwgfHwgaGFzUGFuWCAmJiBkaXJlY3Rpb24gJiBESVJFQ1RJT05fVkVSVElDQUwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJldmVudFNyYyhzcmNFdmVudCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBjYWxsIHByZXZlbnREZWZhdWx0IHRvIHByZXZlbnQgdGhlIGJyb3dzZXIncyBkZWZhdWx0IGJlaGF2aW9yIChzY3JvbGxpbmcgaW4gbW9zdCBjYXNlcylcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc3JjRXZlbnRcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAncHJldmVudFNyYycsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHByZXZlbnRTcmMoc3JjRXZlbnQpIHtcbiAgICAgIHRoaXMubWFuYWdlci5zZXNzaW9uLnByZXZlbnRlZCA9IHRydWU7XG4gICAgICBzcmNFdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgfV0pO1xuICByZXR1cm4gVG91Y2hBY3Rpb247XG59KCk7XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIGZpbmQgaWYgYSBub2RlIGlzIGluIHRoZSBnaXZlbiBwYXJlbnRcbiAqIEBtZXRob2QgaGFzUGFyZW50XG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBub2RlXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBwYXJlbnRcbiAqIEByZXR1cm4ge0Jvb2xlYW59IGZvdW5kXG4gKi9cbmZ1bmN0aW9uIGhhc1BhcmVudChub2RlLCBwYXJlbnQpIHtcbiAgd2hpbGUgKG5vZGUpIHtcbiAgICBpZiAobm9kZSA9PT0gcGFyZW50KSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgbm9kZSA9IG5vZGUucGFyZW50Tm9kZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIGdldCB0aGUgY2VudGVyIG9mIGFsbCB0aGUgcG9pbnRlcnNcbiAqIEBwYXJhbSB7QXJyYXl9IHBvaW50ZXJzXG4gKiBAcmV0dXJuIHtPYmplY3R9IGNlbnRlciBjb250YWlucyBgeGAgYW5kIGB5YCBwcm9wZXJ0aWVzXG4gKi9cbmZ1bmN0aW9uIGdldENlbnRlcihwb2ludGVycykge1xuICB2YXIgcG9pbnRlcnNMZW5ndGggPSBwb2ludGVycy5sZW5ndGg7XG5cbiAgLy8gbm8gbmVlZCB0byBsb29wIHdoZW4gb25seSBvbmUgdG91Y2hcbiAgaWYgKHBvaW50ZXJzTGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IHJvdW5kKHBvaW50ZXJzWzBdLmNsaWVudFgpLFxuICAgICAgeTogcm91bmQocG9pbnRlcnNbMF0uY2xpZW50WSlcbiAgICB9O1xuICB9XG5cbiAgdmFyIHggPSAwO1xuICB2YXIgeSA9IDA7XG4gIHZhciBpID0gMDtcbiAgd2hpbGUgKGkgPCBwb2ludGVyc0xlbmd0aCkge1xuICAgIHggKz0gcG9pbnRlcnNbaV0uY2xpZW50WDtcbiAgICB5ICs9IHBvaW50ZXJzW2ldLmNsaWVudFk7XG4gICAgaSsrO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB4OiByb3VuZCh4IC8gcG9pbnRlcnNMZW5ndGgpLFxuICAgIHk6IHJvdW5kKHkgLyBwb2ludGVyc0xlbmd0aClcbiAgfTtcbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogY3JlYXRlIGEgc2ltcGxlIGNsb25lIGZyb20gdGhlIGlucHV0IHVzZWQgZm9yIHN0b3JhZ2Ugb2YgZmlyc3RJbnB1dCBhbmQgZmlyc3RNdWx0aXBsZVxuICogQHBhcmFtIHtPYmplY3R9IGlucHV0XG4gKiBAcmV0dXJucyB7T2JqZWN0fSBjbG9uZWRJbnB1dERhdGFcbiAqL1xuZnVuY3Rpb24gc2ltcGxlQ2xvbmVJbnB1dERhdGEoaW5wdXQpIHtcbiAgLy8gbWFrZSBhIHNpbXBsZSBjb3B5IG9mIHRoZSBwb2ludGVycyBiZWNhdXNlIHdlIHdpbGwgZ2V0IGEgcmVmZXJlbmNlIGlmIHdlIGRvbid0XG4gIC8vIHdlIG9ubHkgbmVlZCBjbGllbnRYWSBmb3IgdGhlIGNhbGN1bGF0aW9uc1xuICB2YXIgcG9pbnRlcnMgPSBbXTtcbiAgdmFyIGkgPSAwO1xuICB3aGlsZSAoaSA8IGlucHV0LnBvaW50ZXJzLmxlbmd0aCkge1xuICAgIHBvaW50ZXJzW2ldID0ge1xuICAgICAgY2xpZW50WDogcm91bmQoaW5wdXQucG9pbnRlcnNbaV0uY2xpZW50WCksXG4gICAgICBjbGllbnRZOiByb3VuZChpbnB1dC5wb2ludGVyc1tpXS5jbGllbnRZKVxuICAgIH07XG4gICAgaSsrO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB0aW1lU3RhbXA6IG5vdygpLFxuICAgIHBvaW50ZXJzOiBwb2ludGVycyxcbiAgICBjZW50ZXI6IGdldENlbnRlcihwb2ludGVycyksXG4gICAgZGVsdGFYOiBpbnB1dC5kZWx0YVgsXG4gICAgZGVsdGFZOiBpbnB1dC5kZWx0YVlcbiAgfTtcbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogY2FsY3VsYXRlIHRoZSBhbmdsZSBiZXR3ZWVuIHR3byBjb29yZGluYXRlc1xuICogQHBhcmFtIHtPYmplY3R9IHAxXG4gKiBAcGFyYW0ge09iamVjdH0gcDJcbiAqIEBwYXJhbSB7QXJyYXl9IFtwcm9wc10gY29udGFpbmluZyB4IGFuZCB5IGtleXNcbiAqIEByZXR1cm4ge051bWJlcn0gYW5nbGVcbiAqL1xuZnVuY3Rpb24gZ2V0QW5nbGUocDEsIHAyLCBwcm9wcykge1xuICBpZiAoIXByb3BzKSB7XG4gICAgcHJvcHMgPSBQUk9QU19YWTtcbiAgfVxuICB2YXIgeCA9IHAyW3Byb3BzWzBdXSAtIHAxW3Byb3BzWzBdXTtcbiAgdmFyIHkgPSBwMltwcm9wc1sxXV0gLSBwMVtwcm9wc1sxXV07XG4gIHJldHVybiBNYXRoLmF0YW4yKHksIHgpICogMTgwIC8gTWF0aC5QSTtcbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogZ2V0IHRoZSBkaXJlY3Rpb24gYmV0d2VlbiB0d28gcG9pbnRzXG4gKiBAcGFyYW0ge051bWJlcn0geFxuICogQHBhcmFtIHtOdW1iZXJ9IHlcbiAqIEByZXR1cm4ge051bWJlcn0gZGlyZWN0aW9uXG4gKi9cbmZ1bmN0aW9uIGdldERpcmVjdGlvbih4LCB5KSB7XG4gIGlmICh4ID09PSB5KSB7XG4gICAgcmV0dXJuIERJUkVDVElPTl9OT05FO1xuICB9XG5cbiAgaWYgKGFicyh4KSA+PSBhYnMoeSkpIHtcbiAgICByZXR1cm4geCA8IDAgPyBESVJFQ1RJT05fTEVGVCA6IERJUkVDVElPTl9SSUdIVDtcbiAgfVxuICByZXR1cm4geSA8IDAgPyBESVJFQ1RJT05fVVAgOiBESVJFQ1RJT05fRE9XTjtcbn1cblxuZnVuY3Rpb24gY29tcHV0ZURlbHRhWFkoc2Vzc2lvbiwgaW5wdXQpIHtcbiAgdmFyIGNlbnRlciA9IGlucHV0LmNlbnRlcjtcbiAgLy8gbGV0IHsgb2Zmc2V0RGVsdGE6b2Zmc2V0ID0ge30sIHByZXZEZWx0YSA9IHt9LCBwcmV2SW5wdXQgPSB7fSB9ID0gc2Vzc2lvbjtcbiAgLy8ganNjcyB0aHJvd2luZyBlcnJvciBvbiBkZWZhbHV0IGRlc3RydWN0dXJlZCB2YWx1ZXMgYW5kIHdpdGhvdXQgZGVmYXVsdHMgdGVzdHMgZmFpbFxuXG4gIHZhciBvZmZzZXQgPSBzZXNzaW9uLm9mZnNldERlbHRhIHx8IHt9O1xuICB2YXIgcHJldkRlbHRhID0gc2Vzc2lvbi5wcmV2RGVsdGEgfHwge307XG4gIHZhciBwcmV2SW5wdXQgPSBzZXNzaW9uLnByZXZJbnB1dCB8fCB7fTtcblxuICBpZiAoaW5wdXQuZXZlbnRUeXBlID09PSBJTlBVVF9TVEFSVCB8fCBwcmV2SW5wdXQuZXZlbnRUeXBlID09PSBJTlBVVF9FTkQpIHtcbiAgICBwcmV2RGVsdGEgPSBzZXNzaW9uLnByZXZEZWx0YSA9IHtcbiAgICAgIHg6IHByZXZJbnB1dC5kZWx0YVggfHwgMCxcbiAgICAgIHk6IHByZXZJbnB1dC5kZWx0YVkgfHwgMFxuICAgIH07XG5cbiAgICBvZmZzZXQgPSBzZXNzaW9uLm9mZnNldERlbHRhID0ge1xuICAgICAgeDogY2VudGVyLngsXG4gICAgICB5OiBjZW50ZXIueVxuICAgIH07XG4gIH1cblxuICBpbnB1dC5kZWx0YVggPSBwcmV2RGVsdGEueCArIChjZW50ZXIueCAtIG9mZnNldC54KTtcbiAgaW5wdXQuZGVsdGFZID0gcHJldkRlbHRhLnkgKyAoY2VudGVyLnkgLSBvZmZzZXQueSk7XG59XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIGNhbGN1bGF0ZSB0aGUgdmVsb2NpdHkgYmV0d2VlbiB0d28gcG9pbnRzLiB1bml0IGlzIGluIHB4IHBlciBtcy5cbiAqIEBwYXJhbSB7TnVtYmVyfSBkZWx0YVRpbWVcbiAqIEBwYXJhbSB7TnVtYmVyfSB4XG4gKiBAcGFyYW0ge051bWJlcn0geVxuICogQHJldHVybiB7T2JqZWN0fSB2ZWxvY2l0eSBgeGAgYW5kIGB5YFxuICovXG5mdW5jdGlvbiBnZXRWZWxvY2l0eShkZWx0YVRpbWUsIHgsIHkpIHtcbiAgcmV0dXJuIHtcbiAgICB4OiB4IC8gZGVsdGFUaW1lIHx8IDAsXG4gICAgeTogeSAvIGRlbHRhVGltZSB8fCAwXG4gIH07XG59XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIGNhbGN1bGF0ZSB0aGUgc2NhbGUgZmFjdG9yIGJldHdlZW4gdHdvIHBvaW50ZXJzZXRzXG4gKiBubyBzY2FsZSBpcyAxLCBhbmQgZ29lcyBkb3duIHRvIDAgd2hlbiBwaW5jaGVkIHRvZ2V0aGVyLCBhbmQgYmlnZ2VyIHdoZW4gcGluY2hlZCBvdXRcbiAqIEBwYXJhbSB7QXJyYXl9IHN0YXJ0IGFycmF5IG9mIHBvaW50ZXJzXG4gKiBAcGFyYW0ge0FycmF5fSBlbmQgYXJyYXkgb2YgcG9pbnRlcnNcbiAqIEByZXR1cm4ge051bWJlcn0gc2NhbGVcbiAqL1xuZnVuY3Rpb24gZ2V0U2NhbGUoc3RhcnQsIGVuZCkge1xuICByZXR1cm4gZ2V0RGlzdGFuY2UoZW5kWzBdLCBlbmRbMV0sIFBST1BTX0NMSUVOVF9YWSkgLyBnZXREaXN0YW5jZShzdGFydFswXSwgc3RhcnRbMV0sIFBST1BTX0NMSUVOVF9YWSk7XG59XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIGNhbGN1bGF0ZSB0aGUgcm90YXRpb24gZGVncmVlcyBiZXR3ZWVuIHR3byBwb2ludGVyc2V0c1xuICogQHBhcmFtIHtBcnJheX0gc3RhcnQgYXJyYXkgb2YgcG9pbnRlcnNcbiAqIEBwYXJhbSB7QXJyYXl9IGVuZCBhcnJheSBvZiBwb2ludGVyc1xuICogQHJldHVybiB7TnVtYmVyfSByb3RhdGlvblxuICovXG5mdW5jdGlvbiBnZXRSb3RhdGlvbihzdGFydCwgZW5kKSB7XG4gIHJldHVybiBnZXRBbmdsZShlbmRbMV0sIGVuZFswXSwgUFJPUFNfQ0xJRU5UX1hZKSArIGdldEFuZ2xlKHN0YXJ0WzFdLCBzdGFydFswXSwgUFJPUFNfQ0xJRU5UX1hZKTtcbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogdmVsb2NpdHkgaXMgY2FsY3VsYXRlZCBldmVyeSB4IG1zXG4gKiBAcGFyYW0ge09iamVjdH0gc2Vzc2lvblxuICogQHBhcmFtIHtPYmplY3R9IGlucHV0XG4gKi9cbmZ1bmN0aW9uIGNvbXB1dGVJbnRlcnZhbElucHV0RGF0YShzZXNzaW9uLCBpbnB1dCkge1xuICB2YXIgbGFzdCA9IHNlc3Npb24ubGFzdEludGVydmFsIHx8IGlucHV0O1xuICB2YXIgZGVsdGFUaW1lID0gaW5wdXQudGltZVN0YW1wIC0gbGFzdC50aW1lU3RhbXA7XG4gIHZhciB2ZWxvY2l0eSA9IHZvaWQgMDtcbiAgdmFyIHZlbG9jaXR5WCA9IHZvaWQgMDtcbiAgdmFyIHZlbG9jaXR5WSA9IHZvaWQgMDtcbiAgdmFyIGRpcmVjdGlvbiA9IHZvaWQgMDtcblxuICBpZiAoaW5wdXQuZXZlbnRUeXBlICE9PSBJTlBVVF9DQU5DRUwgJiYgKGRlbHRhVGltZSA+IENPTVBVVEVfSU5URVJWQUwgfHwgbGFzdC52ZWxvY2l0eSA9PT0gdW5kZWZpbmVkKSkge1xuICAgIHZhciBkZWx0YVggPSBpbnB1dC5kZWx0YVggLSBsYXN0LmRlbHRhWDtcbiAgICB2YXIgZGVsdGFZID0gaW5wdXQuZGVsdGFZIC0gbGFzdC5kZWx0YVk7XG5cbiAgICB2YXIgdiA9IGdldFZlbG9jaXR5KGRlbHRhVGltZSwgZGVsdGFYLCBkZWx0YVkpO1xuICAgIHZlbG9jaXR5WCA9IHYueDtcbiAgICB2ZWxvY2l0eVkgPSB2Lnk7XG4gICAgdmVsb2NpdHkgPSBhYnModi54KSA+IGFicyh2LnkpID8gdi54IDogdi55O1xuICAgIGRpcmVjdGlvbiA9IGdldERpcmVjdGlvbihkZWx0YVgsIGRlbHRhWSk7XG5cbiAgICBzZXNzaW9uLmxhc3RJbnRlcnZhbCA9IGlucHV0O1xuICB9IGVsc2Uge1xuICAgIC8vIHVzZSBsYXRlc3QgdmVsb2NpdHkgaW5mbyBpZiBpdCBkb2Vzbid0IG92ZXJ0YWtlIGEgbWluaW11bSBwZXJpb2RcbiAgICB2ZWxvY2l0eSA9IGxhc3QudmVsb2NpdHk7XG4gICAgdmVsb2NpdHlYID0gbGFzdC52ZWxvY2l0eVg7XG4gICAgdmVsb2NpdHlZID0gbGFzdC52ZWxvY2l0eVk7XG4gICAgZGlyZWN0aW9uID0gbGFzdC5kaXJlY3Rpb247XG4gIH1cblxuICBpbnB1dC52ZWxvY2l0eSA9IHZlbG9jaXR5O1xuICBpbnB1dC52ZWxvY2l0eVggPSB2ZWxvY2l0eVg7XG4gIGlucHV0LnZlbG9jaXR5WSA9IHZlbG9jaXR5WTtcbiAgaW5wdXQuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xufVxuXG4vKipcbiogQHByaXZhdGVcbiAqIGV4dGVuZCB0aGUgZGF0YSB3aXRoIHNvbWUgdXNhYmxlIHByb3BlcnRpZXMgbGlrZSBzY2FsZSwgcm90YXRlLCB2ZWxvY2l0eSBldGNcbiAqIEBwYXJhbSB7T2JqZWN0fSBtYW5hZ2VyXG4gKiBAcGFyYW0ge09iamVjdH0gaW5wdXRcbiAqL1xuZnVuY3Rpb24gY29tcHV0ZUlucHV0RGF0YShtYW5hZ2VyLCBpbnB1dCkge1xuICB2YXIgc2Vzc2lvbiA9IG1hbmFnZXIuc2Vzc2lvbjtcbiAgdmFyIHBvaW50ZXJzID0gaW5wdXQucG9pbnRlcnM7XG4gIHZhciBwb2ludGVyc0xlbmd0aCA9IHBvaW50ZXJzLmxlbmd0aDtcblxuICAvLyBzdG9yZSB0aGUgZmlyc3QgaW5wdXQgdG8gY2FsY3VsYXRlIHRoZSBkaXN0YW5jZSBhbmQgZGlyZWN0aW9uXG5cbiAgaWYgKCFzZXNzaW9uLmZpcnN0SW5wdXQpIHtcbiAgICBzZXNzaW9uLmZpcnN0SW5wdXQgPSBzaW1wbGVDbG9uZUlucHV0RGF0YShpbnB1dCk7XG4gIH1cblxuICAvLyB0byBjb21wdXRlIHNjYWxlIGFuZCByb3RhdGlvbiB3ZSBuZWVkIHRvIHN0b3JlIHRoZSBtdWx0aXBsZSB0b3VjaGVzXG4gIGlmIChwb2ludGVyc0xlbmd0aCA+IDEgJiYgIXNlc3Npb24uZmlyc3RNdWx0aXBsZSkge1xuICAgIHNlc3Npb24uZmlyc3RNdWx0aXBsZSA9IHNpbXBsZUNsb25lSW5wdXREYXRhKGlucHV0KTtcbiAgfSBlbHNlIGlmIChwb2ludGVyc0xlbmd0aCA9PT0gMSkge1xuICAgIHNlc3Npb24uZmlyc3RNdWx0aXBsZSA9IGZhbHNlO1xuICB9XG5cbiAgdmFyIGZpcnN0SW5wdXQgPSBzZXNzaW9uLmZpcnN0SW5wdXQ7XG4gIHZhciBmaXJzdE11bHRpcGxlID0gc2Vzc2lvbi5maXJzdE11bHRpcGxlO1xuXG4gIHZhciBvZmZzZXRDZW50ZXIgPSBmaXJzdE11bHRpcGxlID8gZmlyc3RNdWx0aXBsZS5jZW50ZXIgOiBmaXJzdElucHV0LmNlbnRlcjtcblxuICB2YXIgY2VudGVyID0gaW5wdXQuY2VudGVyID0gZ2V0Q2VudGVyKHBvaW50ZXJzKTtcbiAgaW5wdXQudGltZVN0YW1wID0gbm93KCk7XG4gIGlucHV0LmRlbHRhVGltZSA9IGlucHV0LnRpbWVTdGFtcCAtIGZpcnN0SW5wdXQudGltZVN0YW1wO1xuXG4gIGlucHV0LmFuZ2xlID0gZ2V0QW5nbGUob2Zmc2V0Q2VudGVyLCBjZW50ZXIpO1xuICBpbnB1dC5kaXN0YW5jZSA9IGdldERpc3RhbmNlKG9mZnNldENlbnRlciwgY2VudGVyKTtcblxuICBjb21wdXRlRGVsdGFYWShzZXNzaW9uLCBpbnB1dCk7XG4gIGlucHV0Lm9mZnNldERpcmVjdGlvbiA9IGdldERpcmVjdGlvbihpbnB1dC5kZWx0YVgsIGlucHV0LmRlbHRhWSk7XG5cbiAgdmFyIG92ZXJhbGxWZWxvY2l0eSA9IGdldFZlbG9jaXR5KGlucHV0LmRlbHRhVGltZSwgaW5wdXQuZGVsdGFYLCBpbnB1dC5kZWx0YVkpO1xuICBpbnB1dC5vdmVyYWxsVmVsb2NpdHlYID0gb3ZlcmFsbFZlbG9jaXR5Lng7XG4gIGlucHV0Lm92ZXJhbGxWZWxvY2l0eVkgPSBvdmVyYWxsVmVsb2NpdHkueTtcbiAgaW5wdXQub3ZlcmFsbFZlbG9jaXR5ID0gYWJzKG92ZXJhbGxWZWxvY2l0eS54KSA+IGFicyhvdmVyYWxsVmVsb2NpdHkueSkgPyBvdmVyYWxsVmVsb2NpdHkueCA6IG92ZXJhbGxWZWxvY2l0eS55O1xuXG4gIGlucHV0LnNjYWxlID0gZmlyc3RNdWx0aXBsZSA/IGdldFNjYWxlKGZpcnN0TXVsdGlwbGUucG9pbnRlcnMsIHBvaW50ZXJzKSA6IDE7XG4gIGlucHV0LnJvdGF0aW9uID0gZmlyc3RNdWx0aXBsZSA/IGdldFJvdGF0aW9uKGZpcnN0TXVsdGlwbGUucG9pbnRlcnMsIHBvaW50ZXJzKSA6IDA7XG5cbiAgaW5wdXQubWF4UG9pbnRlcnMgPSAhc2Vzc2lvbi5wcmV2SW5wdXQgPyBpbnB1dC5wb2ludGVycy5sZW5ndGggOiBpbnB1dC5wb2ludGVycy5sZW5ndGggPiBzZXNzaW9uLnByZXZJbnB1dC5tYXhQb2ludGVycyA/IGlucHV0LnBvaW50ZXJzLmxlbmd0aCA6IHNlc3Npb24ucHJldklucHV0Lm1heFBvaW50ZXJzO1xuXG4gIGNvbXB1dGVJbnRlcnZhbElucHV0RGF0YShzZXNzaW9uLCBpbnB1dCk7XG5cbiAgLy8gZmluZCB0aGUgY29ycmVjdCB0YXJnZXRcbiAgdmFyIHRhcmdldCA9IG1hbmFnZXIuZWxlbWVudDtcbiAgaWYgKGhhc1BhcmVudChpbnB1dC5zcmNFdmVudC50YXJnZXQsIHRhcmdldCkpIHtcbiAgICB0YXJnZXQgPSBpbnB1dC5zcmNFdmVudC50YXJnZXQ7XG4gIH1cbiAgaW5wdXQudGFyZ2V0ID0gdGFyZ2V0O1xufVxuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBoYW5kbGUgaW5wdXQgZXZlbnRzXG4gKiBAcGFyYW0ge01hbmFnZXJ9IG1hbmFnZXJcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFR5cGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dFxuICovXG5mdW5jdGlvbiBpbnB1dEhhbmRsZXIobWFuYWdlciwgZXZlbnRUeXBlLCBpbnB1dCkge1xuICB2YXIgcG9pbnRlcnNMZW4gPSBpbnB1dC5wb2ludGVycy5sZW5ndGg7XG4gIHZhciBjaGFuZ2VkUG9pbnRlcnNMZW4gPSBpbnB1dC5jaGFuZ2VkUG9pbnRlcnMubGVuZ3RoO1xuICB2YXIgaXNGaXJzdCA9IGV2ZW50VHlwZSAmIElOUFVUX1NUQVJUICYmIHBvaW50ZXJzTGVuIC0gY2hhbmdlZFBvaW50ZXJzTGVuID09PSAwO1xuICB2YXIgaXNGaW5hbCA9IGV2ZW50VHlwZSAmIChJTlBVVF9FTkQgfCBJTlBVVF9DQU5DRUwpICYmIHBvaW50ZXJzTGVuIC0gY2hhbmdlZFBvaW50ZXJzTGVuID09PSAwO1xuXG4gIGlucHV0LmlzRmlyc3QgPSAhIWlzRmlyc3Q7XG4gIGlucHV0LmlzRmluYWwgPSAhIWlzRmluYWw7XG5cbiAgaWYgKGlzRmlyc3QpIHtcbiAgICBtYW5hZ2VyLnNlc3Npb24gPSB7fTtcbiAgfVxuXG4gIC8vIHNvdXJjZSBldmVudCBpcyB0aGUgbm9ybWFsaXplZCB2YWx1ZSBvZiB0aGUgZG9tRXZlbnRzXG4gIC8vIGxpa2UgJ3RvdWNoc3RhcnQsIG1vdXNldXAsIHBvaW50ZXJkb3duJ1xuICBpbnB1dC5ldmVudFR5cGUgPSBldmVudFR5cGU7XG5cbiAgLy8gY29tcHV0ZSBzY2FsZSwgcm90YXRpb24gZXRjXG4gIGNvbXB1dGVJbnB1dERhdGEobWFuYWdlciwgaW5wdXQpO1xuXG4gIC8vIGVtaXQgc2VjcmV0IGV2ZW50XG4gIG1hbmFnZXIuZW1pdCgnaGFtbWVyLmlucHV0JywgaW5wdXQpO1xuXG4gIG1hbmFnZXIucmVjb2duaXplKGlucHV0KTtcbiAgbWFuYWdlci5zZXNzaW9uLnByZXZJbnB1dCA9IGlucHV0O1xufVxuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBzcGxpdCBzdHJpbmcgb24gd2hpdGVzcGFjZVxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybnMge0FycmF5fSB3b3Jkc1xuICovXG5cbmZ1bmN0aW9uIHNwbGl0U3RyKHN0cikge1xuICByZXR1cm4gc3RyLnRyaW0oKS5zcGxpdCgvXFxzKy9nKTtcbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogYWRkRXZlbnRMaXN0ZW5lciB3aXRoIG11bHRpcGxlIGV2ZW50cyBhdCBvbmNlXG4gKiBAcGFyYW0ge0V2ZW50VGFyZ2V0fSB0YXJnZXRcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gaGFuZGxlclxuICovXG5mdW5jdGlvbiBhZGRFdmVudExpc3RlbmVycyh0YXJnZXQsIHR5cGVzLCBoYW5kbGVyKSB7XG4gIGVhY2goc3BsaXRTdHIodHlwZXMpLCBmdW5jdGlvbiAodHlwZSkge1xuICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGhhbmRsZXIsIGZhbHNlKTtcbiAgfSk7XG59XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIHJlbW92ZUV2ZW50TGlzdGVuZXIgd2l0aCBtdWx0aXBsZSBldmVudHMgYXQgb25jZVxuICogQHBhcmFtIHtFdmVudFRhcmdldH0gdGFyZ2V0XG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZXNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGhhbmRsZXJcbiAqL1xuZnVuY3Rpb24gcmVtb3ZlRXZlbnRMaXN0ZW5lcnModGFyZ2V0LCB0eXBlcywgaGFuZGxlcikge1xuICBlYWNoKHNwbGl0U3RyKHR5cGVzKSwgZnVuY3Rpb24gKHR5cGUpIHtcbiAgICB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBoYW5kbGVyLCBmYWxzZSk7XG4gIH0pO1xufVxuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBnZXQgdGhlIHdpbmRvdyBvYmplY3Qgb2YgYW4gZWxlbWVudFxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICogQHJldHVybnMge0RvY3VtZW50Vmlld3xXaW5kb3d9XG4gKi9cbmZ1bmN0aW9uIGdldFdpbmRvd0ZvckVsZW1lbnQoZWxlbWVudCkge1xuICB2YXIgZG9jID0gZWxlbWVudC5vd25lckRvY3VtZW50IHx8IGVsZW1lbnQ7XG4gIHJldHVybiBkb2MuZGVmYXVsdFZpZXcgfHwgZG9jLnBhcmVudFdpbmRvdyB8fCB3aW5kb3c7XG59XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIGNyZWF0ZSBuZXcgaW5wdXQgdHlwZSBtYW5hZ2VyXG4gKiBAcGFyYW0ge01hbmFnZXJ9IG1hbmFnZXJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcmV0dXJucyB7SW5wdXR9XG4gKiBAY29uc3RydWN0b3JcbiAqL1xuXG52YXIgSW5wdXQgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIElucHV0KG1hbmFnZXIsIGNhbGxiYWNrKSB7XG4gICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgSW5wdXQpO1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHRoaXMubWFuYWdlciA9IG1hbmFnZXI7XG4gICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIHRoaXMuZWxlbWVudCA9IG1hbmFnZXIuZWxlbWVudDtcbiAgICB0aGlzLnRhcmdldCA9IG1hbmFnZXIub3B0aW9ucy5pbnB1dFRhcmdldDtcblxuICAgIC8vIHNtYWxsZXIgd3JhcHBlciBhcm91bmQgdGhlIGhhbmRsZXIsIGZvciB0aGUgc2NvcGUgYW5kIHRoZSBlbmFibGVkIHN0YXRlIG9mIHRoZSBtYW5hZ2VyLFxuICAgIC8vIHNvIHdoZW4gZGlzYWJsZWQgdGhlIGlucHV0IGV2ZW50cyBhcmUgY29tcGxldGVseSBieXBhc3NlZC5cbiAgICB0aGlzLmRvbUhhbmRsZXIgPSBmdW5jdGlvbiAoZXYpIHtcbiAgICAgIGlmIChib29sT3JGbihtYW5hZ2VyLm9wdGlvbnMuZW5hYmxlLCBbbWFuYWdlcl0pKSB7XG4gICAgICAgIHNlbGYuaGFuZGxlcihldik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMuaW5pdCgpO1xuICB9XG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBzaG91bGQgaGFuZGxlIHRoZSBpbnB1dEV2ZW50IGRhdGEgYW5kIHRyaWdnZXIgdGhlIGNhbGxiYWNrXG4gICAqIEB2aXJ0dWFsXG4gICAqL1xuXG5cbiAgY3JlYXRlQ2xhc3MoSW5wdXQsIFt7XG4gICAga2V5OiAnaGFuZGxlcicsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGhhbmRsZXIoKSB7fVxuXG4gICAgLyoqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBiaW5kIHRoZSBldmVudHNcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnaW5pdCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICB0aGlzLmV2RWwgJiYgYWRkRXZlbnRMaXN0ZW5lcnModGhpcy5lbGVtZW50LCB0aGlzLmV2RWwsIHRoaXMuZG9tSGFuZGxlcik7XG4gICAgICB0aGlzLmV2VGFyZ2V0ICYmIGFkZEV2ZW50TGlzdGVuZXJzKHRoaXMudGFyZ2V0LCB0aGlzLmV2VGFyZ2V0LCB0aGlzLmRvbUhhbmRsZXIpO1xuICAgICAgdGhpcy5ldldpbiAmJiBhZGRFdmVudExpc3RlbmVycyhnZXRXaW5kb3dGb3JFbGVtZW50KHRoaXMuZWxlbWVudCksIHRoaXMuZXZXaW4sIHRoaXMuZG9tSGFuZGxlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiB1bmJpbmQgdGhlIGV2ZW50c1xuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdkZXN0cm95JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICAgIHRoaXMuZXZFbCAmJiByZW1vdmVFdmVudExpc3RlbmVycyh0aGlzLmVsZW1lbnQsIHRoaXMuZXZFbCwgdGhpcy5kb21IYW5kbGVyKTtcbiAgICAgIHRoaXMuZXZUYXJnZXQgJiYgcmVtb3ZlRXZlbnRMaXN0ZW5lcnModGhpcy50YXJnZXQsIHRoaXMuZXZUYXJnZXQsIHRoaXMuZG9tSGFuZGxlcik7XG4gICAgICB0aGlzLmV2V2luICYmIHJlbW92ZUV2ZW50TGlzdGVuZXJzKGdldFdpbmRvd0ZvckVsZW1lbnQodGhpcy5lbGVtZW50KSwgdGhpcy5ldldpbiwgdGhpcy5kb21IYW5kbGVyKTtcbiAgICB9XG4gIH1dKTtcbiAgcmV0dXJuIElucHV0O1xufSgpO1xuXG52YXIgUE9JTlRFUl9JTlBVVF9NQVAgPSB7XG4gIHBvaW50ZXJkb3duOiBJTlBVVF9TVEFSVCxcbiAgcG9pbnRlcm1vdmU6IElOUFVUX01PVkUsXG4gIHBvaW50ZXJ1cDogSU5QVVRfRU5ELFxuICBwb2ludGVyY2FuY2VsOiBJTlBVVF9DQU5DRUwsXG4gIHBvaW50ZXJvdXQ6IElOUFVUX0NBTkNFTFxufTtcblxuLy8gaW4gSUUxMCB0aGUgcG9pbnRlciB0eXBlcyBpcyBkZWZpbmVkIGFzIGFuIGVudW1cbnZhciBJRTEwX1BPSU5URVJfVFlQRV9FTlVNID0ge1xuICAyOiBJTlBVVF9UWVBFX1RPVUNILFxuICAzOiBJTlBVVF9UWVBFX1BFTixcbiAgNDogSU5QVVRfVFlQRV9NT1VTRSxcbiAgNTogSU5QVVRfVFlQRV9LSU5FQ1QgLy8gc2VlIGh0dHBzOi8vdHdpdHRlci5jb20vamFjb2Jyb3NzaS9zdGF0dXMvNDgwNTk2NDM4NDg5ODkwODE2XG59O1xuXG52YXIgUE9JTlRFUl9FTEVNRU5UX0VWRU5UUyA9ICdwb2ludGVyZG93bic7XG52YXIgUE9JTlRFUl9XSU5ET1dfRVZFTlRTID0gJ3BvaW50ZXJtb3ZlIHBvaW50ZXJ1cCBwb2ludGVyY2FuY2VsJztcblxuLy8gSUUxMCBoYXMgcHJlZml4ZWQgc3VwcG9ydCwgYW5kIGNhc2Utc2Vuc2l0aXZlXG5pZiAod2luZG93Lk1TUG9pbnRlckV2ZW50ICYmICF3aW5kb3cuUG9pbnRlckV2ZW50KSB7XG4gIFBPSU5URVJfRUxFTUVOVF9FVkVOVFMgPSAnTVNQb2ludGVyRG93bic7XG4gIFBPSU5URVJfV0lORE9XX0VWRU5UUyA9ICdNU1BvaW50ZXJNb3ZlIE1TUG9pbnRlclVwIE1TUG9pbnRlckNhbmNlbCc7XG59XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIFBvaW50ZXIgZXZlbnRzIGlucHV0XG4gKiBAY29uc3RydWN0b3JcbiAqIEBleHRlbmRzIElucHV0XG4gKi9cblxudmFyIFBvaW50ZXJFdmVudElucHV0ID0gZnVuY3Rpb24gKF9JbnB1dCkge1xuICBpbmhlcml0cyhQb2ludGVyRXZlbnRJbnB1dCwgX0lucHV0KTtcblxuICBmdW5jdGlvbiBQb2ludGVyRXZlbnRJbnB1dCgpIHtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBQb2ludGVyRXZlbnRJbnB1dCk7XG5cbiAgICB2YXIgX3RoaXMgPSBwb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIChQb2ludGVyRXZlbnRJbnB1dC5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKFBvaW50ZXJFdmVudElucHV0KSkuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG5cbiAgICBfdGhpcy5ldkVsID0gUE9JTlRFUl9FTEVNRU5UX0VWRU5UUztcbiAgICBfdGhpcy5ldldpbiA9IFBPSU5URVJfV0lORE9XX0VWRU5UUztcblxuICAgIF90aGlzLnN0b3JlID0gX3RoaXMubWFuYWdlci5zZXNzaW9uLnBvaW50ZXJFdmVudHMgPSBbXTtcbiAgICByZXR1cm4gX3RoaXM7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICogaGFuZGxlIG1vdXNlIGV2ZW50c1xuICAgKiBAcGFyYW0ge09iamVjdH0gZXZcbiAgICovXG5cblxuICBjcmVhdGVDbGFzcyhQb2ludGVyRXZlbnRJbnB1dCwgW3tcbiAgICBrZXk6ICdoYW5kbGVyJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gaGFuZGxlcihldikge1xuICAgICAgdmFyIHN0b3JlID0gdGhpcy5zdG9yZTtcblxuICAgICAgdmFyIHJlbW92ZVBvaW50ZXIgPSBmYWxzZTtcblxuICAgICAgdmFyIGV2ZW50VHlwZU5vcm1hbGl6ZWQgPSBldi50eXBlLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgnbXMnLCAnJyk7XG4gICAgICB2YXIgZXZlbnRUeXBlID0gUE9JTlRFUl9JTlBVVF9NQVBbZXZlbnRUeXBlTm9ybWFsaXplZF07XG4gICAgICB2YXIgcG9pbnRlclR5cGUgPSBJRTEwX1BPSU5URVJfVFlQRV9FTlVNW2V2LnBvaW50ZXJUeXBlXSB8fCBldi5wb2ludGVyVHlwZTtcblxuICAgICAgdmFyIGlzVG91Y2ggPSBwb2ludGVyVHlwZSA9PT0gSU5QVVRfVFlQRV9UT1VDSDtcblxuICAgICAgLy8gZ2V0IGluZGV4IG9mIHRoZSBldmVudCBpbiB0aGUgc3RvcmVcbiAgICAgIHZhciBzdG9yZUluZGV4ID0gaW5BcnJheShzdG9yZSwgZXYucG9pbnRlcklkLCAncG9pbnRlcklkJyk7XG5cbiAgICAgIC8vIHN0YXJ0IGFuZCBtb3VzZSBtdXN0IGJlIGRvd25cbiAgICAgIGlmIChldmVudFR5cGUgJiBJTlBVVF9TVEFSVCAmJiAoZXYuYnV0dG9uID09PSAwIHx8IGlzVG91Y2gpKSB7XG4gICAgICAgIGlmIChzdG9yZUluZGV4IDwgMCkge1xuICAgICAgICAgIHN0b3JlLnB1c2goZXYpO1xuICAgICAgICAgIHN0b3JlSW5kZXggPSBzdG9yZS5sZW5ndGggLSAxO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGV2ZW50VHlwZSAmIChJTlBVVF9FTkQgfCBJTlBVVF9DQU5DRUwpKSB7XG4gICAgICAgIHJlbW92ZVBvaW50ZXIgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBpdCBub3QgZm91bmQsIHNvIHRoZSBwb2ludGVyIGhhc24ndCBiZWVuIGRvd24gKHNvIGl0J3MgcHJvYmFibHkgYSBob3ZlcilcbiAgICAgIGlmIChzdG9yZUluZGV4IDwgMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIHVwZGF0ZSB0aGUgZXZlbnQgaW4gdGhlIHN0b3JlXG4gICAgICBzdG9yZVtzdG9yZUluZGV4XSA9IGV2O1xuXG4gICAgICB0aGlzLmNhbGxiYWNrKHRoaXMubWFuYWdlciwgZXZlbnRUeXBlLCB7XG4gICAgICAgIHBvaW50ZXJzOiBzdG9yZSxcbiAgICAgICAgY2hhbmdlZFBvaW50ZXJzOiBbZXZdLFxuICAgICAgICBwb2ludGVyVHlwZTogcG9pbnRlclR5cGUsXG4gICAgICAgIHNyY0V2ZW50OiBldlxuICAgICAgfSk7XG5cbiAgICAgIGlmIChyZW1vdmVQb2ludGVyKSB7XG4gICAgICAgIC8vIHJlbW92ZSBmcm9tIHRoZSBzdG9yZVxuICAgICAgICBzdG9yZS5zcGxpY2Uoc3RvcmVJbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICB9XSk7XG4gIHJldHVybiBQb2ludGVyRXZlbnRJbnB1dDtcbn0oSW5wdXQpO1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBjb252ZXJ0IGFycmF5LWxpa2Ugb2JqZWN0cyB0byByZWFsIGFycmF5c1xuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybnMge0FycmF5fVxuICovXG5mdW5jdGlvbiB0b0FycmF5JDEob2JqKSB7XG4gIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChvYmosIDApO1xufVxuXG4vKipcbiAqIEBwcml2YXRlXG4gKiB1bmlxdWUgYXJyYXkgd2l0aCBvYmplY3RzIGJhc2VkIG9uIGEga2V5IChsaWtlICdpZCcpIG9yIGp1c3QgYnkgdGhlIGFycmF5J3MgdmFsdWVcbiAqIEBwYXJhbSB7QXJyYXl9IHNyYyBbe2lkOjF9LHtpZDoyfSx7aWQ6MX1dXG4gKiBAcGFyYW0ge1N0cmluZ30gW2tleV1cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW3NvcnQ9RmFsc2VdXG4gKiBAcmV0dXJucyB7QXJyYXl9IFt7aWQ6MX0se2lkOjJ9XVxuICovXG5mdW5jdGlvbiB1bmlxdWVBcnJheShzcmMsIGtleSwgc29ydCkge1xuICB2YXIgcmVzdWx0cyA9IFtdO1xuICB2YXIgdmFsdWVzID0gW107XG4gIHZhciBpID0gMDtcblxuICB3aGlsZSAoaSA8IHNyYy5sZW5ndGgpIHtcbiAgICB2YXIgdmFsID0ga2V5ID8gc3JjW2ldW2tleV0gOiBzcmNbaV07XG4gICAgaWYgKGluQXJyYXkodmFsdWVzLCB2YWwpIDwgMCkge1xuICAgICAgcmVzdWx0cy5wdXNoKHNyY1tpXSk7XG4gICAgfVxuICAgIHZhbHVlc1tpXSA9IHZhbDtcbiAgICBpKys7XG4gIH1cblxuICBpZiAoc29ydCkge1xuICAgIGlmICgha2V5KSB7XG4gICAgICByZXN1bHRzID0gcmVzdWx0cy5zb3J0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdHMgPSByZXN1bHRzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGFba2V5XSA+IGJba2V5XTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHRzO1xufVxuXG52YXIgVE9VQ0hfSU5QVVRfTUFQID0ge1xuICB0b3VjaHN0YXJ0OiBJTlBVVF9TVEFSVCxcbiAgdG91Y2htb3ZlOiBJTlBVVF9NT1ZFLFxuICB0b3VjaGVuZDogSU5QVVRfRU5ELFxuICB0b3VjaGNhbmNlbDogSU5QVVRfQ0FOQ0VMXG59O1xuXG52YXIgVE9VQ0hfVEFSR0VUX0VWRU5UUyA9ICd0b3VjaHN0YXJ0IHRvdWNobW92ZSB0b3VjaGVuZCB0b3VjaGNhbmNlbCc7XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIE11bHRpLXVzZXIgdG91Y2ggZXZlbnRzIGlucHV0XG4gKiBAY29uc3RydWN0b3JcbiAqIEBleHRlbmRzIElucHV0XG4gKi9cblxudmFyIFRvdWNoSW5wdXQgPSBmdW5jdGlvbiAoX0lucHV0KSB7XG4gIGluaGVyaXRzKFRvdWNoSW5wdXQsIF9JbnB1dCk7XG5cbiAgZnVuY3Rpb24gVG91Y2hJbnB1dCgpIHtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBUb3VjaElucHV0KTtcblxuICAgIFRvdWNoSW5wdXQucHJvdG90eXBlLmV2VGFyZ2V0ID0gVE9VQ0hfVEFSR0VUX0VWRU5UUztcbiAgICBUb3VjaElucHV0LnByb3RvdHlwZS50YXJnZXRJZHMgPSB7fTtcblxuICAgIHZhciBfdGhpcyA9IHBvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgKFRvdWNoSW5wdXQuX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihUb3VjaElucHV0KSkuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG5cbiAgICBfdGhpcy5ldlRhcmdldCA9IFRPVUNIX1RBUkdFVF9FVkVOVFM7XG4gICAgX3RoaXMudGFyZ2V0SWRzID0ge307XG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG5cbiAgY3JlYXRlQ2xhc3MoVG91Y2hJbnB1dCwgW3tcbiAgICBrZXk6ICdoYW5kbGVyJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gaGFuZGxlcihldikge1xuICAgICAgdmFyIHR5cGUgPSBUT1VDSF9JTlBVVF9NQVBbZXYudHlwZV07XG4gICAgICB2YXIgdG91Y2hlcyA9IGdldFRvdWNoZXMuY2FsbCh0aGlzLCBldiwgdHlwZSk7XG4gICAgICBpZiAoIXRvdWNoZXMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNhbGxiYWNrKHRoaXMubWFuYWdlciwgdHlwZSwge1xuICAgICAgICBwb2ludGVyczogdG91Y2hlc1swXSxcbiAgICAgICAgY2hhbmdlZFBvaW50ZXJzOiB0b3VjaGVzWzFdLFxuICAgICAgICBwb2ludGVyVHlwZTogSU5QVVRfVFlQRV9UT1VDSCxcbiAgICAgICAgc3JjRXZlbnQ6IGV2XG4gICAgICB9KTtcbiAgICB9XG4gIH1dKTtcbiAgcmV0dXJuIFRvdWNoSW5wdXQ7XG59KElucHV0KTtcblxuZnVuY3Rpb24gZ2V0VG91Y2hlcyhldiwgdHlwZSkge1xuICB2YXIgYWxsVG91Y2hlcyA9IHRvQXJyYXkkMShldi50b3VjaGVzKTtcbiAgdmFyIHRhcmdldElkcyA9IHRoaXMudGFyZ2V0SWRzO1xuXG4gIC8vIHdoZW4gdGhlcmUgaXMgb25seSBvbmUgdG91Y2gsIHRoZSBwcm9jZXNzIGNhbiBiZSBzaW1wbGlmaWVkXG5cbiAgaWYgKHR5cGUgJiAoSU5QVVRfU1RBUlQgfCBJTlBVVF9NT1ZFKSAmJiBhbGxUb3VjaGVzLmxlbmd0aCA9PT0gMSkge1xuICAgIHRhcmdldElkc1thbGxUb3VjaGVzWzBdLmlkZW50aWZpZXJdID0gdHJ1ZTtcbiAgICByZXR1cm4gW2FsbFRvdWNoZXMsIGFsbFRvdWNoZXNdO1xuICB9XG5cbiAgdmFyIGkgPSB2b2lkIDA7XG4gIHZhciB0YXJnZXRUb3VjaGVzID0gdm9pZCAwO1xuICB2YXIgY2hhbmdlZFRvdWNoZXMgPSB0b0FycmF5JDEoZXYuY2hhbmdlZFRvdWNoZXMpO1xuICB2YXIgY2hhbmdlZFRhcmdldFRvdWNoZXMgPSBbXTtcbiAgdmFyIHRhcmdldCA9IHRoaXMudGFyZ2V0O1xuXG4gIC8vIGdldCB0YXJnZXQgdG91Y2hlcyBmcm9tIHRvdWNoZXNcblxuICB0YXJnZXRUb3VjaGVzID0gYWxsVG91Y2hlcy5maWx0ZXIoZnVuY3Rpb24gKHRvdWNoKSB7XG4gICAgcmV0dXJuIGhhc1BhcmVudCh0b3VjaC50YXJnZXQsIHRhcmdldCk7XG4gIH0pO1xuXG4gIC8vIGNvbGxlY3QgdG91Y2hlc1xuICBpZiAodHlwZSA9PT0gSU5QVVRfU1RBUlQpIHtcbiAgICBpID0gMDtcbiAgICB3aGlsZSAoaSA8IHRhcmdldFRvdWNoZXMubGVuZ3RoKSB7XG4gICAgICB0YXJnZXRJZHNbdGFyZ2V0VG91Y2hlc1tpXS5pZGVudGlmaWVyXSA9IHRydWU7XG4gICAgICBpKys7XG4gICAgfVxuICB9XG5cbiAgLy8gZmlsdGVyIGNoYW5nZWQgdG91Y2hlcyB0byBvbmx5IGNvbnRhaW4gdG91Y2hlcyB0aGF0IGV4aXN0IGluIHRoZSBjb2xsZWN0ZWQgdGFyZ2V0IGlkc1xuICBpID0gMDtcbiAgd2hpbGUgKGkgPCBjaGFuZ2VkVG91Y2hlcy5sZW5ndGgpIHtcbiAgICBpZiAodGFyZ2V0SWRzW2NoYW5nZWRUb3VjaGVzW2ldLmlkZW50aWZpZXJdKSB7XG4gICAgICBjaGFuZ2VkVGFyZ2V0VG91Y2hlcy5wdXNoKGNoYW5nZWRUb3VjaGVzW2ldKTtcbiAgICB9XG5cbiAgICAvLyBjbGVhbnVwIHJlbW92ZWQgdG91Y2hlc1xuICAgIGlmICh0eXBlICYgKElOUFVUX0VORCB8IElOUFVUX0NBTkNFTCkpIHtcbiAgICAgIGRlbGV0ZSB0YXJnZXRJZHNbY2hhbmdlZFRvdWNoZXNbaV0uaWRlbnRpZmllcl07XG4gICAgfVxuICAgIGkrKztcbiAgfVxuXG4gIGlmICghY2hhbmdlZFRhcmdldFRvdWNoZXMubGVuZ3RoKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcmV0dXJuIFtcbiAgLy8gbWVyZ2UgdGFyZ2V0VG91Y2hlcyB3aXRoIGNoYW5nZWRUYXJnZXRUb3VjaGVzIHNvIGl0IGNvbnRhaW5zIEFMTCB0b3VjaGVzLCBpbmNsdWRpbmcgJ2VuZCcgYW5kICdjYW5jZWwnXG4gIHVuaXF1ZUFycmF5KHRhcmdldFRvdWNoZXMuY29uY2F0KGNoYW5nZWRUYXJnZXRUb3VjaGVzKSwgJ2lkZW50aWZpZXInLCB0cnVlKSwgY2hhbmdlZFRhcmdldFRvdWNoZXNdO1xufVxuXG52YXIgTU9VU0VfSU5QVVRfTUFQID0ge1xuICBtb3VzZWRvd246IElOUFVUX1NUQVJULFxuICBtb3VzZW1vdmU6IElOUFVUX01PVkUsXG4gIG1vdXNldXA6IElOUFVUX0VORFxufTtcblxudmFyIE1PVVNFX0VMRU1FTlRfRVZFTlRTID0gJ21vdXNlZG93bic7XG52YXIgTU9VU0VfV0lORE9XX0VWRU5UUyA9ICdtb3VzZW1vdmUgbW91c2V1cCc7XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIE1vdXNlIGV2ZW50cyBpbnB1dFxuICogQGNvbnN0cnVjdG9yXG4gKiBAZXh0ZW5kcyBJbnB1dFxuICovXG5cbnZhciBNb3VzZUlucHV0ID0gZnVuY3Rpb24gKF9JbnB1dCkge1xuICBpbmhlcml0cyhNb3VzZUlucHV0LCBfSW5wdXQpO1xuXG4gIGZ1bmN0aW9uIE1vdXNlSW5wdXQoKSB7XG4gICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgTW91c2VJbnB1dCk7XG5cbiAgICB2YXIgX3RoaXMgPSBwb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIChNb3VzZUlucHV0Ll9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoTW91c2VJbnB1dCkpLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuXG4gICAgX3RoaXMuZXZFbCA9IE1PVVNFX0VMRU1FTlRfRVZFTlRTO1xuICAgIF90aGlzLmV2V2luID0gTU9VU0VfV0lORE9XX0VWRU5UUztcblxuICAgIF90aGlzLnByZXNzZWQgPSBmYWxzZTsgLy8gbW91c2Vkb3duIHN0YXRlXG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqIGhhbmRsZSBtb3VzZSBldmVudHNcbiAgICogQHBhcmFtIHtPYmplY3R9IGV2XG4gICAqL1xuXG5cbiAgY3JlYXRlQ2xhc3MoTW91c2VJbnB1dCwgW3tcbiAgICBrZXk6ICdoYW5kbGVyJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gaGFuZGxlcihldikge1xuICAgICAgdmFyIGV2ZW50VHlwZSA9IE1PVVNFX0lOUFVUX01BUFtldi50eXBlXTtcblxuICAgICAgLy8gb24gc3RhcnQgd2Ugd2FudCB0byBoYXZlIHRoZSBsZWZ0IG1vdXNlIGJ1dHRvbiBkb3duXG4gICAgICBpZiAoZXZlbnRUeXBlICYgSU5QVVRfU1RBUlQgJiYgZXYuYnV0dG9uID09PSAwKSB7XG4gICAgICAgIHRoaXMucHJlc3NlZCA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChldmVudFR5cGUgJiBJTlBVVF9NT1ZFICYmIGV2LndoaWNoICE9PSAxKSB7XG4gICAgICAgIGV2ZW50VHlwZSA9IElOUFVUX0VORDtcbiAgICAgIH1cblxuICAgICAgLy8gbW91c2UgbXVzdCBiZSBkb3duXG4gICAgICBpZiAoIXRoaXMucHJlc3NlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChldmVudFR5cGUgJiBJTlBVVF9FTkQpIHtcbiAgICAgICAgdGhpcy5wcmVzc2VkID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY2FsbGJhY2sodGhpcy5tYW5hZ2VyLCBldmVudFR5cGUsIHtcbiAgICAgICAgcG9pbnRlcnM6IFtldl0sXG4gICAgICAgIGNoYW5nZWRQb2ludGVyczogW2V2XSxcbiAgICAgICAgcG9pbnRlclR5cGU6IElOUFVUX1RZUEVfTU9VU0UsXG4gICAgICAgIHNyY0V2ZW50OiBldlxuICAgICAgfSk7XG4gICAgfVxuICB9XSk7XG4gIHJldHVybiBNb3VzZUlucHV0O1xufShJbnB1dCk7XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIENvbWJpbmVkIHRvdWNoIGFuZCBtb3VzZSBpbnB1dFxuICpcbiAqIFRvdWNoIGhhcyBhIGhpZ2hlciBwcmlvcml0eSB0aGVuIG1vdXNlLCBhbmQgd2hpbGUgdG91Y2hpbmcgbm8gbW91c2UgZXZlbnRzIGFyZSBhbGxvd2VkLlxuICogVGhpcyBiZWNhdXNlIHRvdWNoIGRldmljZXMgYWxzbyBlbWl0IG1vdXNlIGV2ZW50cyB3aGlsZSBkb2luZyBhIHRvdWNoLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQGV4dGVuZHMgSW5wdXRcbiAqL1xuXG52YXIgREVEVVBfVElNRU9VVCA9IDI1MDA7XG52YXIgREVEVVBfRElTVEFOQ0UgPSAyNTtcblxudmFyIFRvdWNoTW91c2VJbnB1dCA9IGZ1bmN0aW9uIChfSW5wdXQpIHtcbiAgaW5oZXJpdHMoVG91Y2hNb3VzZUlucHV0LCBfSW5wdXQpO1xuXG4gIGZ1bmN0aW9uIFRvdWNoTW91c2VJbnB1dCgpIHtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBUb3VjaE1vdXNlSW5wdXQpO1xuXG4gICAgdmFyIF90aGlzID0gcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCAoVG91Y2hNb3VzZUlucHV0Ll9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoVG91Y2hNb3VzZUlucHV0KSkuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG5cbiAgICB2YXIgaGFuZGxlciA9IGJpbmRGbihfdGhpcy5oYW5kbGVyLCBfdGhpcyk7XG4gICAgX3RoaXMudG91Y2ggPSBuZXcgVG91Y2hJbnB1dChfdGhpcy5tYW5hZ2VyLCBoYW5kbGVyKTtcbiAgICBfdGhpcy5tb3VzZSA9IG5ldyBNb3VzZUlucHV0KF90aGlzLm1hbmFnZXIsIGhhbmRsZXIpO1xuXG4gICAgX3RoaXMucHJpbWFyeVRvdWNoID0gbnVsbDtcbiAgICBfdGhpcy5sYXN0VG91Y2hlcyA9IFtdO1xuICAgIHJldHVybiBfdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBoYW5kbGUgbW91c2UgYW5kIHRvdWNoIGV2ZW50c1xuICAgKiBAcGFyYW0ge0hhbW1lcn0gbWFuYWdlclxuICAgKiBAcGFyYW0ge1N0cmluZ30gaW5wdXRFdmVudFxuICAgKiBAcGFyYW0ge09iamVjdH0gaW5wdXREYXRhXG4gICAqL1xuXG5cbiAgY3JlYXRlQ2xhc3MoVG91Y2hNb3VzZUlucHV0LCBbe1xuICAgIGtleTogJ2hhbmRsZXInLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBoYW5kbGVyKG1hbmFnZXIsIGlucHV0RXZlbnQsIGlucHV0RGF0YSkge1xuICAgICAgdmFyIGlzVG91Y2ggPSBpbnB1dERhdGEucG9pbnRlclR5cGUgPT09IElOUFVUX1RZUEVfVE9VQ0g7XG4gICAgICB2YXIgaXNNb3VzZSA9IGlucHV0RGF0YS5wb2ludGVyVHlwZSA9PT0gSU5QVVRfVFlQRV9NT1VTRTtcblxuICAgICAgaWYgKGlzTW91c2UgJiYgaW5wdXREYXRhLnNvdXJjZUNhcGFiaWxpdGllcyAmJiBpbnB1dERhdGEuc291cmNlQ2FwYWJpbGl0aWVzLmZpcmVzVG91Y2hFdmVudHMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyB3aGVuIHdlJ3JlIGluIGEgdG91Y2ggZXZlbnQsIHJlY29yZCB0b3VjaGVzIHRvICBkZS1kdXBlIHN5bnRoZXRpYyBtb3VzZSBldmVudFxuICAgICAgaWYgKGlzVG91Y2gpIHtcbiAgICAgICAgcmVjb3JkVG91Y2hlcy5jYWxsKHRoaXMsIGlucHV0RXZlbnQsIGlucHV0RGF0YSk7XG4gICAgICB9IGVsc2UgaWYgKGlzTW91c2UgJiYgaXNTeW50aGV0aWNFdmVudC5jYWxsKHRoaXMsIGlucHV0RGF0YSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNhbGxiYWNrKG1hbmFnZXIsIGlucHV0RXZlbnQsIGlucHV0RGF0YSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiByZW1vdmUgdGhlIGV2ZW50IGxpc3RlbmVyc1xuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdkZXN0cm95JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICAgIHRoaXMudG91Y2guZGVzdHJveSgpO1xuICAgICAgdGhpcy5tb3VzZS5kZXN0cm95KCk7XG4gICAgfVxuICB9XSk7XG4gIHJldHVybiBUb3VjaE1vdXNlSW5wdXQ7XG59KElucHV0KTtcblxuZnVuY3Rpb24gcmVjb3JkVG91Y2hlcyhldmVudFR5cGUsIGV2ZW50RGF0YSkge1xuICBpZiAoZXZlbnRUeXBlICYgSU5QVVRfU1RBUlQpIHtcbiAgICB0aGlzLnByaW1hcnlUb3VjaCA9IGV2ZW50RGF0YS5jaGFuZ2VkUG9pbnRlcnNbMF0uaWRlbnRpZmllcjtcbiAgICBzZXRMYXN0VG91Y2guY2FsbCh0aGlzLCBldmVudERhdGEpO1xuICB9IGVsc2UgaWYgKGV2ZW50VHlwZSAmIChJTlBVVF9FTkQgfCBJTlBVVF9DQU5DRUwpKSB7XG4gICAgc2V0TGFzdFRvdWNoLmNhbGwodGhpcywgZXZlbnREYXRhKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRMYXN0VG91Y2goZXZlbnREYXRhKSB7XG4gIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gIHZhciBfZXZlbnREYXRhJGNoYW5nZWRQb2kgPSBzbGljZWRUb0FycmF5KGV2ZW50RGF0YS5jaGFuZ2VkUG9pbnRlcnMsIDEpO1xuXG4gIHZhciB0b3VjaCA9IF9ldmVudERhdGEkY2hhbmdlZFBvaVswXTtcblxuICBpZiAodG91Y2guaWRlbnRpZmllciA9PT0gdGhpcy5wcmltYXJ5VG91Y2gpIHtcbiAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGxhc3RUb3VjaCA9IHsgeDogdG91Y2guY2xpZW50WCwgeTogdG91Y2guY2xpZW50WSB9O1xuICAgICAgX3RoaXMyLmxhc3RUb3VjaGVzLnB1c2gobGFzdFRvdWNoKTtcbiAgICAgIHZhciBsdHMgPSBfdGhpczIubGFzdFRvdWNoZXM7XG4gICAgICB2YXIgcmVtb3ZlTGFzdFRvdWNoID0gZnVuY3Rpb24gcmVtb3ZlTGFzdFRvdWNoKCkge1xuICAgICAgICB2YXIgaSA9IGx0cy5pbmRleE9mKGxhc3RUb3VjaCk7XG4gICAgICAgIGlmIChpID4gLTEpIHtcbiAgICAgICAgICBsdHMuc3BsaWNlKGksIDEpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgc2V0VGltZW91dChyZW1vdmVMYXN0VG91Y2gsIERFRFVQX1RJTUVPVVQpO1xuICAgIH0pKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNTeW50aGV0aWNFdmVudChldmVudERhdGEpIHtcbiAgdmFyIHggPSBldmVudERhdGEuc3JjRXZlbnQuY2xpZW50WDtcbiAgdmFyIHkgPSBldmVudERhdGEuc3JjRXZlbnQuY2xpZW50WTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxhc3RUb3VjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHQgPSB0aGlzLmxhc3RUb3VjaGVzW2ldO1xuICAgIHZhciBkeCA9IE1hdGguYWJzKHggLSB0LngpO1xuICAgIHZhciBkeSA9IE1hdGguYWJzKHkgLSB0LnkpO1xuICAgIGlmIChkeCA8PSBERURVUF9ESVNUQU5DRSAmJiBkeSA8PSBERURVUF9ESVNUQU5DRSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogY3JlYXRlIG5ldyBpbnB1dCB0eXBlIG1hbmFnZXJcbiAqIGNhbGxlZCBieSB0aGUgTWFuYWdlciBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtIYW1tZXJ9IG1hbmFnZXJcbiAqIEByZXR1cm5zIHtJbnB1dH1cbiAqL1xuZnVuY3Rpb24gY3JlYXRlSW5wdXRJbnN0YW5jZShtYW5hZ2VyKSB7XG4gIHZhciBUeXBlID0gdm9pZCAwO1xuICAvLyBsZXQgaW5wdXRDbGFzcyA9IG1hbmFnZXIub3B0aW9ucy5pbnB1dENsYXNzO1xuICB2YXIgaW5wdXRDbGFzcyA9IG1hbmFnZXIub3B0aW9ucy5pbnB1dENsYXNzO1xuXG4gIGlmIChpbnB1dENsYXNzKSB7XG4gICAgVHlwZSA9IGlucHV0Q2xhc3M7XG4gIH0gZWxzZSBpZiAoU1VQUE9SVF9QT0lOVEVSX0VWRU5UUykge1xuICAgIFR5cGUgPSBQb2ludGVyRXZlbnRJbnB1dDtcbiAgfSBlbHNlIGlmIChTVVBQT1JUX09OTFlfVE9VQ0gpIHtcbiAgICBUeXBlID0gVG91Y2hJbnB1dDtcbiAgfSBlbHNlIGlmICghU1VQUE9SVF9UT1VDSCkge1xuICAgIFR5cGUgPSBNb3VzZUlucHV0O1xuICB9IGVsc2Uge1xuICAgIFR5cGUgPSBUb3VjaE1vdXNlSW5wdXQ7XG4gIH1cbiAgcmV0dXJuIG5ldyBUeXBlKG1hbmFnZXIsIGlucHV0SGFuZGxlcik7XG59XG5cbnZhciBTVE9QID0gMTtcbnZhciBGT1JDRURfU1RPUCA9IDI7XG5cbi8qKlxuKiBAcHJpdmF0ZVxuICogTWFuYWdlclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICogQGNvbnN0cnVjdG9yXG4gKi9cblxudmFyIE1hbmFnZXIgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIE1hbmFnZXIoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBNYW5hZ2VyKTtcblxuICAgIHRoaXMub3B0aW9ucyA9IGFzc2lnbiQxKHt9LCBIYW1tZXIuZGVmYXVsdHMsIG9wdGlvbnMgfHwge30pO1xuXG4gICAgdGhpcy5vcHRpb25zLmlucHV0VGFyZ2V0ID0gdGhpcy5vcHRpb25zLmlucHV0VGFyZ2V0IHx8IGVsZW1lbnQ7XG5cbiAgICB0aGlzLmhhbmRsZXJzID0ge307XG4gICAgdGhpcy5zZXNzaW9uID0ge307XG4gICAgdGhpcy5yZWNvZ25pemVycyA9IFtdO1xuICAgIHRoaXMub2xkQ3NzUHJvcHMgPSB7fTtcblxuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgdGhpcy5pbnB1dCA9IGNyZWF0ZUlucHV0SW5zdGFuY2UodGhpcyk7XG4gICAgdGhpcy50b3VjaEFjdGlvbiA9IG5ldyBUb3VjaEFjdGlvbih0aGlzLCB0aGlzLm9wdGlvbnMudG91Y2hBY3Rpb24pO1xuXG4gICAgdG9nZ2xlQ3NzUHJvcHModGhpcywgdHJ1ZSk7XG5cbiAgICBlYWNoKHRoaXMub3B0aW9ucy5yZWNvZ25pemVycywgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciByZWNvZ25pemVyID0gX3RoaXMuYWRkKG5ldyBpdGVtWzBdKGl0ZW1bMV0pKTtcbiAgICAgIGl0ZW1bMl0gJiYgcmVjb2duaXplci5yZWNvZ25pemVXaXRoKGl0ZW1bMl0pO1xuICAgICAgaXRlbVszXSAmJiByZWNvZ25pemVyLnJlcXVpcmVGYWlsdXJlKGl0ZW1bM10pO1xuICAgIH0sIHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqIHNldCBvcHRpb25zXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqIEByZXR1cm5zIHtNYW5hZ2VyfVxuICAgKi9cblxuXG4gIGNyZWF0ZUNsYXNzKE1hbmFnZXIsIFt7XG4gICAga2V5OiAnc2V0JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2V0KG9wdGlvbnMpIHtcbiAgICAgIGFzc2lnbiQxKHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICAgIC8vIE9wdGlvbnMgdGhhdCBuZWVkIGEgbGl0dGxlIG1vcmUgc2V0dXBcbiAgICAgIGlmIChvcHRpb25zLnRvdWNoQWN0aW9uKSB7XG4gICAgICAgIHRoaXMudG91Y2hBY3Rpb24udXBkYXRlKCk7XG4gICAgICB9XG4gICAgICBpZiAob3B0aW9ucy5pbnB1dFRhcmdldCkge1xuICAgICAgICAvLyBDbGVhbiB1cCBleGlzdGluZyBldmVudCBsaXN0ZW5lcnMgYW5kIHJlaW5pdGlhbGl6ZVxuICAgICAgICB0aGlzLmlucHV0LmRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy5pbnB1dC50YXJnZXQgPSBvcHRpb25zLmlucHV0VGFyZ2V0O1xuICAgICAgICB0aGlzLmlucHV0LmluaXQoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogc3RvcCByZWNvZ25pemluZyBmb3IgdGhpcyBzZXNzaW9uLlxuICAgICAqIFRoaXMgc2Vzc2lvbiB3aWxsIGJlIGRpc2NhcmRlZCwgd2hlbiBhIG5ldyBbaW5wdXRdc3RhcnQgZXZlbnQgaXMgZmlyZWQuXG4gICAgICogV2hlbiBmb3JjZWQsIHRoZSByZWNvZ25pemVyIGN5Y2xlIGlzIHN0b3BwZWQgaW1tZWRpYXRlbHkuXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbZm9yY2VdXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ3N0b3AnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzdG9wKGZvcmNlKSB7XG4gICAgICB0aGlzLnNlc3Npb24uc3RvcHBlZCA9IGZvcmNlID8gRk9SQ0VEX1NUT1AgOiBTVE9QO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogcnVuIHRoZSByZWNvZ25pemVycyFcbiAgICAgKiBjYWxsZWQgYnkgdGhlIGlucHV0SGFuZGxlciBmdW5jdGlvbiBvbiBldmVyeSBtb3ZlbWVudCBvZiB0aGUgcG9pbnRlcnMgKHRvdWNoZXMpXG4gICAgICogaXQgd2Fsa3MgdGhyb3VnaCBhbGwgdGhlIHJlY29nbml6ZXJzIGFuZCB0cmllcyB0byBkZXRlY3QgdGhlIGdlc3R1cmUgdGhhdCBpcyBiZWluZyBtYWRlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGlucHV0RGF0YVxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdyZWNvZ25pemUnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZWNvZ25pemUoaW5wdXREYXRhKSB7XG4gICAgICB2YXIgc2Vzc2lvbiA9IHRoaXMuc2Vzc2lvbjtcblxuICAgICAgaWYgKHNlc3Npb24uc3RvcHBlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIHJ1biB0aGUgdG91Y2gtYWN0aW9uIHBvbHlmaWxsXG4gICAgICB0aGlzLnRvdWNoQWN0aW9uLnByZXZlbnREZWZhdWx0cyhpbnB1dERhdGEpO1xuXG4gICAgICB2YXIgcmVjb2duaXplciA9IHZvaWQgMDtcbiAgICAgIHZhciByZWNvZ25pemVycyA9IHRoaXMucmVjb2duaXplcnM7XG5cbiAgICAgIC8vIHRoaXMgaG9sZHMgdGhlIHJlY29nbml6ZXIgdGhhdCBpcyBiZWluZyByZWNvZ25pemVkLlxuICAgICAgLy8gc28gdGhlIHJlY29nbml6ZXIncyBzdGF0ZSBuZWVkcyB0byBiZSBCRUdBTiwgQ0hBTkdFRCwgRU5ERUQgb3IgUkVDT0dOSVpFRFxuICAgICAgLy8gaWYgbm8gcmVjb2duaXplciBpcyBkZXRlY3RpbmcgYSB0aGluZywgaXQgaXMgc2V0IHRvIGBudWxsYFxuXG4gICAgICB2YXIgY3VyUmVjb2duaXplciA9IHNlc3Npb24uY3VyUmVjb2duaXplcjtcblxuICAgICAgLy8gcmVzZXQgd2hlbiB0aGUgbGFzdCByZWNvZ25pemVyIGlzIHJlY29nbml6ZWRcbiAgICAgIC8vIG9yIHdoZW4gd2UncmUgaW4gYSBuZXcgc2Vzc2lvblxuXG4gICAgICBpZiAoIWN1clJlY29nbml6ZXIgfHwgY3VyUmVjb2duaXplciAmJiBjdXJSZWNvZ25pemVyLnN0YXRlICYgU1RBVEVfUkVDT0dOSVpFRCkge1xuICAgICAgICBjdXJSZWNvZ25pemVyID0gc2Vzc2lvbi5jdXJSZWNvZ25pemVyID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdmFyIGkgPSAwO1xuICAgICAgd2hpbGUgKGkgPCByZWNvZ25pemVycy5sZW5ndGgpIHtcbiAgICAgICAgcmVjb2duaXplciA9IHJlY29nbml6ZXJzW2ldO1xuXG4gICAgICAgIC8vIGZpbmQgb3V0IGlmIHdlIGFyZSBhbGxvd2VkIHRyeSB0byByZWNvZ25pemUgdGhlIGlucHV0IGZvciB0aGlzIG9uZS5cbiAgICAgICAgLy8gMS4gICBhbGxvdyBpZiB0aGUgc2Vzc2lvbiBpcyBOT1QgZm9yY2VkIHN0b3BwZWQgKHNlZSB0aGUgLnN0b3AoKSBtZXRob2QpXG4gICAgICAgIC8vIDIuICAgYWxsb3cgaWYgd2Ugc3RpbGwgaGF2ZW4ndCByZWNvZ25pemVkIGEgZ2VzdHVyZSBpbiB0aGlzIHNlc3Npb24sIG9yIHRoZSB0aGlzIHJlY29nbml6ZXIgaXMgdGhlIG9uZVxuICAgICAgICAvLyAgICAgIHRoYXQgaXMgYmVpbmcgcmVjb2duaXplZC5cbiAgICAgICAgLy8gMy4gICBhbGxvdyBpZiB0aGUgcmVjb2duaXplciBpcyBhbGxvd2VkIHRvIHJ1biBzaW11bHRhbmVvdXMgd2l0aCB0aGUgY3VycmVudCByZWNvZ25pemVkIHJlY29nbml6ZXIuXG4gICAgICAgIC8vICAgICAgdGhpcyBjYW4gYmUgc2V0dXAgd2l0aCB0aGUgYHJlY29nbml6ZVdpdGgoKWAgbWV0aG9kIG9uIHRoZSByZWNvZ25pemVyLlxuICAgICAgICBpZiAoc2Vzc2lvbi5zdG9wcGVkICE9PSBGT1JDRURfU1RPUCAmJiAoIC8vIDFcbiAgICAgICAgIWN1clJlY29nbml6ZXIgfHwgcmVjb2duaXplciA9PT0gY3VyUmVjb2duaXplciB8fCAvLyAyXG4gICAgICAgIHJlY29nbml6ZXIuY2FuUmVjb2duaXplV2l0aChjdXJSZWNvZ25pemVyKSkpIHtcbiAgICAgICAgICAvLyAzXG4gICAgICAgICAgcmVjb2duaXplci5yZWNvZ25pemUoaW5wdXREYXRhKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWNvZ25pemVyLnJlc2V0KCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiB0aGUgcmVjb2duaXplciBoYXMgYmVlbiByZWNvZ25pemluZyB0aGUgaW5wdXQgYXMgYSB2YWxpZCBnZXN0dXJlLCB3ZSB3YW50IHRvIHN0b3JlIHRoaXMgb25lIGFzIHRoZVxuICAgICAgICAvLyBjdXJyZW50IGFjdGl2ZSByZWNvZ25pemVyLiBidXQgb25seSBpZiB3ZSBkb24ndCBhbHJlYWR5IGhhdmUgYW4gYWN0aXZlIHJlY29nbml6ZXJcbiAgICAgICAgaWYgKCFjdXJSZWNvZ25pemVyICYmIHJlY29nbml6ZXIuc3RhdGUgJiAoU1RBVEVfQkVHQU4gfCBTVEFURV9DSEFOR0VEIHwgU1RBVEVfRU5ERUQpKSB7XG4gICAgICAgICAgY3VyUmVjb2duaXplciA9IHNlc3Npb24uY3VyUmVjb2duaXplciA9IHJlY29nbml6ZXI7XG4gICAgICAgIH1cbiAgICAgICAgaSsrO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogZ2V0IGEgcmVjb2duaXplciBieSBpdHMgZXZlbnQgbmFtZS5cbiAgICAgKiBAcGFyYW0ge1JlY29nbml6ZXJ8U3RyaW5nfSByZWNvZ25pemVyXG4gICAgICogQHJldHVybnMge1JlY29nbml6ZXJ8TnVsbH1cbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnZ2V0JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0KHJlY29nbml6ZXIpIHtcbiAgICAgIGlmIChyZWNvZ25pemVyIGluc3RhbmNlb2YgUmVjb2duaXplcikge1xuICAgICAgICByZXR1cm4gcmVjb2duaXplcjtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlY29nbml6ZXJzID0gdGhpcy5yZWNvZ25pemVycztcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZWNvZ25pemVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAocmVjb2duaXplcnNbaV0ub3B0aW9ucy5ldmVudCA9PT0gcmVjb2duaXplcikge1xuICAgICAgICAgIHJldHVybiByZWNvZ25pemVyc1tpXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHByaXZhdGUgYWRkIGEgcmVjb2duaXplciB0byB0aGUgbWFuYWdlclxuICAgICAqIGV4aXN0aW5nIHJlY29nbml6ZXJzIHdpdGggdGhlIHNhbWUgZXZlbnQgbmFtZSB3aWxsIGJlIHJlbW92ZWRcbiAgICAgKiBAcGFyYW0ge1JlY29nbml6ZXJ9IHJlY29nbml6ZXJcbiAgICAgKiBAcmV0dXJucyB7UmVjb2duaXplcnxNYW5hZ2VyfVxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdhZGQnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhZGQocmVjb2duaXplcikge1xuICAgICAgaWYgKGludm9rZUFycmF5QXJnKHJlY29nbml6ZXIsICdhZGQnLCB0aGlzKSkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgLy8gcmVtb3ZlIGV4aXN0aW5nXG4gICAgICB2YXIgZXhpc3RpbmcgPSB0aGlzLmdldChyZWNvZ25pemVyLm9wdGlvbnMuZXZlbnQpO1xuICAgICAgaWYgKGV4aXN0aW5nKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlKGV4aXN0aW5nKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5yZWNvZ25pemVycy5wdXNoKHJlY29nbml6ZXIpO1xuICAgICAgcmVjb2duaXplci5tYW5hZ2VyID0gdGhpcztcblxuICAgICAgdGhpcy50b3VjaEFjdGlvbi51cGRhdGUoKTtcbiAgICAgIHJldHVybiByZWNvZ25pemVyO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogcmVtb3ZlIGEgcmVjb2duaXplciBieSBuYW1lIG9yIGluc3RhbmNlXG4gICAgICogQHBhcmFtIHtSZWNvZ25pemVyfFN0cmluZ30gcmVjb2duaXplclxuICAgICAqIEByZXR1cm5zIHtNYW5hZ2VyfVxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdyZW1vdmUnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZW1vdmUocmVjb2duaXplcikge1xuICAgICAgaWYgKGludm9rZUFycmF5QXJnKHJlY29nbml6ZXIsICdyZW1vdmUnLCB0aGlzKSkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgcmVjb2duaXplciA9IHRoaXMuZ2V0KHJlY29nbml6ZXIpO1xuXG4gICAgICAvLyBsZXQncyBtYWtlIHN1cmUgdGhpcyByZWNvZ25pemVyIGV4aXN0c1xuICAgICAgaWYgKHJlY29nbml6ZXIpIHtcbiAgICAgICAgdmFyIHJlY29nbml6ZXJzID0gdGhpcy5yZWNvZ25pemVycztcblxuICAgICAgICB2YXIgaW5kZXggPSBpbkFycmF5KHJlY29nbml6ZXJzLCByZWNvZ25pemVyKTtcblxuICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgcmVjb2duaXplcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICB0aGlzLnRvdWNoQWN0aW9uLnVwZGF0ZSgpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogYmluZCBldmVudFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudHNcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBoYW5kbGVyXG4gICAgICogQHJldHVybnMge0V2ZW50RW1pdHRlcn0gdGhpc1xuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdvbicsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG9uKGV2ZW50cywgaGFuZGxlcikge1xuICAgICAgaWYgKGV2ZW50cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChoYW5kbGVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgaGFuZGxlcnMgPSB0aGlzLmhhbmRsZXJzO1xuXG4gICAgICBlYWNoKHNwbGl0U3RyKGV2ZW50cyksIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBoYW5kbGVyc1tldmVudF0gPSBoYW5kbGVyc1tldmVudF0gfHwgW107XG4gICAgICAgIGhhbmRsZXJzW2V2ZW50XS5wdXNoKGhhbmRsZXIpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcHJpdmF0ZSB1bmJpbmQgZXZlbnQsIGxlYXZlIGVtaXQgYmxhbmsgdG8gcmVtb3ZlIGFsbCBoYW5kbGVyc1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudHNcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbaGFuZGxlcl1cbiAgICAgKiBAcmV0dXJucyB7RXZlbnRFbWl0dGVyfSB0aGlzXG4gICAgICovXG5cbiAgfSwge1xuICAgIGtleTogJ29mZicsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG9mZihldmVudHMsIGhhbmRsZXIpIHtcbiAgICAgIGlmIChldmVudHMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBoYW5kbGVycyA9IHRoaXMuaGFuZGxlcnM7XG5cbiAgICAgIGVhY2goc3BsaXRTdHIoZXZlbnRzKSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGlmICghaGFuZGxlcikge1xuICAgICAgICAgIGRlbGV0ZSBoYW5kbGVyc1tldmVudF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaGFuZGxlcnNbZXZlbnRdICYmIGhhbmRsZXJzW2V2ZW50XS5zcGxpY2UoaW5BcnJheShoYW5kbGVyc1tldmVudF0sIGhhbmRsZXIpLCAxKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcHJpdmF0ZSBlbWl0IGV2ZW50IHRvIHRoZSBsaXN0ZW5lcnNcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6ICdlbWl0JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZW1pdChldmVudCwgZGF0YSkge1xuICAgICAgLy8gd2UgYWxzbyB3YW50IHRvIHRyaWdnZXIgZG9tIGV2ZW50c1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5kb21FdmVudHMpIHtcbiAgICAgICAgdHJpZ2dlckRvbUV2ZW50KGV2ZW50LCBkYXRhKTtcbiAgICAgIH1cblxuICAgICAgLy8gbm8gaGFuZGxlcnMsIHNvIHNraXAgaXQgYWxsXG4gICAgICB2YXIgaGFuZGxlcnMgPSB0aGlzLmhhbmRsZXJzW2V2ZW50XSAmJiB0aGlzLmhhbmRsZXJzW2V2ZW50XS5zbGljZSgpO1xuICAgICAgaWYgKCFoYW5kbGVycyB8fCAhaGFuZGxlcnMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZGF0YS50eXBlID0gZXZlbnQ7XG4gICAgICBkYXRhLnByZXZlbnREZWZhdWx0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBkYXRhLnNyY0V2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9O1xuXG4gICAgICB2YXIgaSA9IDA7XG4gICAgICB3aGlsZSAoaSA8IGhhbmRsZXJzLmxlbmd0aCkge1xuICAgICAgICBoYW5kbGVyc1tpXShkYXRhKTtcbiAgICAgICAgaSsrO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogZGVzdHJveSB0aGUgbWFuYWdlciBhbmQgdW5iaW5kcyBhbGwgZXZlbnRzXG4gICAgICogaXQgZG9lc24ndCB1bmJpbmQgZG9tIGV2ZW50cywgdGhhdCBpcyB0aGUgdXNlciBvd24gcmVzcG9uc2liaWxpdHlcbiAgICAgKi9cblxuICB9LCB7XG4gICAga2V5OiAnZGVzdHJveScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgICB0aGlzLmVsZW1lbnQgJiYgdG9nZ2xlQ3NzUHJvcHModGhpcywgZmFsc2UpO1xuXG4gICAgICB0aGlzLmhhbmRsZXJzID0ge307XG4gICAgICB0aGlzLnNlc3Npb24gPSB7fTtcbiAgICAgIHRoaXMuaW5wdXQuZGVzdHJveSgpO1xuICAgICAgdGhpcy5lbGVtZW50ID0gbnVsbDtcbiAgICB9XG4gIH1dKTtcbiAgcmV0dXJuIE1hbmFnZXI7XG59KCk7XG5cbmZ1bmN0aW9uIHRvZ2dsZUNzc1Byb3BzKG1hbmFnZXIsIGFkZCkge1xuICB2YXIgZWxlbWVudCA9IG1hbmFnZXIuZWxlbWVudDtcblxuICBpZiAoIWVsZW1lbnQuc3R5bGUpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIHByb3AgPSB2b2lkIDA7XG4gIGVhY2gobWFuYWdlci5vcHRpb25zLmNzc1Byb3BzLCBmdW5jdGlvbiAodmFsdWUsIG5hbWUpIHtcbiAgICBwcm9wID0gcHJlZml4ZWQoZWxlbWVudC5zdHlsZSwgbmFtZSk7XG4gICAgaWYgKGFkZCkge1xuICAgICAgbWFuYWdlci5vbGRDc3NQcm9wc1twcm9wXSA9IGVsZW1lbnQuc3R5bGVbcHJvcF07XG4gICAgICBlbGVtZW50LnN0eWxlW3Byb3BdID0gdmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQuc3R5bGVbcHJvcF0gPSBtYW5hZ2VyLm9sZENzc1Byb3BzW3Byb3BdIHx8ICcnO1xuICAgIH1cbiAgfSk7XG4gIGlmICghYWRkKSB7XG4gICAgbWFuYWdlci5vbGRDc3NQcm9wcyA9IHt9O1xuICB9XG59XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIHRyaWdnZXIgZG9tIGV2ZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gKi9cbmZ1bmN0aW9uIHRyaWdnZXJEb21FdmVudChldmVudCwgZGF0YSkge1xuICB2YXIgZ2VzdHVyZUV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gIGdlc3R1cmVFdmVudC5pbml0RXZlbnQoZXZlbnQsIHRydWUsIHRydWUpO1xuICBnZXN0dXJlRXZlbnQuZ2VzdHVyZSA9IGRhdGE7XG4gIGRhdGEudGFyZ2V0LmRpc3BhdGNoRXZlbnQoZ2VzdHVyZUV2ZW50KTtcbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogU2ltcGxlIHdheSB0byBjcmVhdGUgYSBtYW5hZ2VyIHdpdGggYSBkZWZhdWx0IHNldCBvZiByZWNvZ25pemVycy5cbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAqIEBjb25zdHJ1Y3RvclxuICovXG5cbnZhciBIYW1tZXIgPSBmdW5jdGlvbiBIYW1tZXIoZWxlbWVudCwgb3B0aW9ucykge1xuICBjbGFzc0NhbGxDaGVjayh0aGlzLCBIYW1tZXIpO1xuXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBvcHRpb25zLnJlY29nbml6ZXJzID0gaWZVbmRlZmluZWQob3B0aW9ucy5yZWNvZ25pemVycywgSGFtbWVyLmRlZmF1bHRzLnByZXNldCk7XG4gIHJldHVybiBuZXcgTWFuYWdlcihlbGVtZW50LCBvcHRpb25zKTtcbn07XG5cbkhhbW1lci5WRVJTSU9OID0gJzIuMC44JztcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogZGVmYXVsdCBzZXR0aW5nc1xuICogQG5hbWVzcGFjZVxuICovXG5IYW1tZXIuZGVmYXVsdHMgPSB7XG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBzZXQgaWYgRE9NIGV2ZW50cyBhcmUgYmVpbmcgdHJpZ2dlcmVkLlxuICAgKiBCdXQgdGhpcyBpcyBzbG93ZXIgYW5kIHVudXNlZCBieSBzaW1wbGUgaW1wbGVtZW50YXRpb25zLCBzbyBkaXNhYmxlZCBieSBkZWZhdWx0LlxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIGRvbUV2ZW50czogZmFsc2UsXG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqIFRoZSB2YWx1ZSBmb3IgdGhlIHRvdWNoQWN0aW9uIHByb3BlcnR5L2ZhbGxiYWNrLlxuICAgKiBXaGVuIHNldCB0byBgY29tcHV0ZWAgaXQgd2lsbCBtYWdpY2FsbHkgc2V0IHRoZSBjb3JyZWN0IHZhbHVlIGJhc2VkIG9uIHRoZSBhZGRlZCByZWNvZ25pemVycy5cbiAgICogQHR5cGUge1N0cmluZ31cbiAgICogQGRlZmF1bHQgY29tcHV0ZVxuICAgKi9cbiAgdG91Y2hBY3Rpb246IFRPVUNIX0FDVElPTl9DT01QVVRFLFxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgZW5hYmxlOiB0cnVlLFxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBFWFBFUklNRU5UQUwgRkVBVFVSRSAtLSBjYW4gYmUgcmVtb3ZlZC9jaGFuZ2VkXG4gICAqIENoYW5nZSB0aGUgcGFyZW50IGlucHV0IHRhcmdldCBlbGVtZW50LlxuICAgKiBJZiBOdWxsLCB0aGVuIGl0IGlzIGJlaW5nIHNldCB0aGUgdG8gbWFpbiBlbGVtZW50LlxuICAgKiBAdHlwZSB7TnVsbHxFdmVudFRhcmdldH1cbiAgICogQGRlZmF1bHQgbnVsbFxuICAgKi9cbiAgaW5wdXRUYXJnZXQ6IG51bGwsXG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqIGZvcmNlIGFuIGlucHV0IGNsYXNzXG4gICAqIEB0eXBlIHtOdWxsfEZ1bmN0aW9ufVxuICAgKiBAZGVmYXVsdCBudWxsXG4gICAqL1xuICBpbnB1dENsYXNzOiBudWxsLFxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBEZWZhdWx0IHJlY29nbml6ZXIgc2V0dXAgd2hlbiBjYWxsaW5nIGBIYW1tZXIoKWBcbiAgICogV2hlbiBjcmVhdGluZyBhIG5ldyBNYW5hZ2VyIHRoZXNlIHdpbGwgYmUgc2tpcHBlZC5cbiAgICogQHR5cGUge0FycmF5fVxuICAgKi9cbiAgcHJlc2V0OiBbXG4gIC8vIFJlY29nbml6ZXJDbGFzcywgb3B0aW9ucywgW3JlY29nbml6ZVdpdGgsIC4uLl0sIFtyZXF1aXJlRmFpbHVyZSwgLi4uXVxuICBbUm90YXRlUmVjb2duaXplciwgeyBlbmFibGU6IGZhbHNlIH1dLCBbUGluY2hSZWNvZ25pemVyLCB7IGVuYWJsZTogZmFsc2UgfSwgWydyb3RhdGUnXV0sIFtTd2lwZVJlY29nbml6ZXIsIHsgZGlyZWN0aW9uOiBESVJFQ1RJT05fSE9SSVpPTlRBTCB9XSwgW1BhblJlY29nbml6ZXIsIHsgZGlyZWN0aW9uOiBESVJFQ1RJT05fSE9SSVpPTlRBTCB9LCBbJ3N3aXBlJ11dLCBbVGFwUmVjb2duaXplcl0sIFtUYXBSZWNvZ25pemVyLCB7IGV2ZW50OiAnZG91YmxldGFwJywgdGFwczogMiB9LCBbJ3RhcCddXSwgW1ByZXNzUmVjb2duaXplcl1dLFxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBTb21lIENTUyBwcm9wZXJ0aWVzIGNhbiBiZSB1c2VkIHRvIGltcHJvdmUgdGhlIHdvcmtpbmcgb2YgSGFtbWVyLlxuICAgKiBBZGQgdGhlbSB0byB0aGlzIG1ldGhvZCBhbmQgdGhleSB3aWxsIGJlIHNldCB3aGVuIGNyZWF0aW5nIGEgbmV3IE1hbmFnZXIuXG4gICAqIEBuYW1lc3BhY2VcbiAgICovXG4gIGNzc1Byb3BzOiB7XG4gICAgLyoqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBEaXNhYmxlcyB0ZXh0IHNlbGVjdGlvbiB0byBpbXByb3ZlIHRoZSBkcmFnZ2luZyBnZXN0dXJlLiBNYWlubHkgZm9yIGRlc2t0b3AgYnJvd3NlcnMuXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKiBAZGVmYXVsdCAnbm9uZSdcbiAgICAgKi9cbiAgICB1c2VyU2VsZWN0OiAnbm9uZScsXG5cbiAgICAvKipcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIERpc2FibGUgdGhlIFdpbmRvd3MgUGhvbmUgZ3JpcHBlcnMgd2hlbiBwcmVzc2luZyBhbiBlbGVtZW50LlxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICogQGRlZmF1bHQgJ25vbmUnXG4gICAgICovXG4gICAgdG91Y2hTZWxlY3Q6ICdub25lJyxcblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogRGlzYWJsZXMgdGhlIGRlZmF1bHQgY2FsbG91dCBzaG93biB3aGVuIHlvdSB0b3VjaCBhbmQgaG9sZCBhIHRvdWNoIHRhcmdldC5cbiAgICAgKiBPbiBpT1MsIHdoZW4geW91IHRvdWNoIGFuZCBob2xkIGEgdG91Y2ggdGFyZ2V0IHN1Y2ggYXMgYSBsaW5rLCBTYWZhcmkgZGlzcGxheXNcbiAgICAgKiBhIGNhbGxvdXQgY29udGFpbmluZyBpbmZvcm1hdGlvbiBhYm91dCB0aGUgbGluay4gVGhpcyBwcm9wZXJ0eSBhbGxvd3MgeW91IHRvIGRpc2FibGUgdGhhdCBjYWxsb3V0LlxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICogQGRlZmF1bHQgJ25vbmUnXG4gICAgICovXG4gICAgdG91Y2hDYWxsb3V0OiAnbm9uZScsXG5cbiAgICAvKipcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIFNwZWNpZmllcyB3aGV0aGVyIHpvb21pbmcgaXMgZW5hYmxlZC4gVXNlZCBieSBJRTEwPlxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICogQGRlZmF1bHQgJ25vbmUnXG4gICAgICovXG4gICAgY29udGVudFpvb21pbmc6ICdub25lJyxcblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogU3BlY2lmaWVzIHRoYXQgYW4gZW50aXJlIGVsZW1lbnQgc2hvdWxkIGJlIGRyYWdnYWJsZSBpbnN0ZWFkIG9mIGl0cyBjb250ZW50cy4gTWFpbmx5IGZvciBkZXNrdG9wIGJyb3dzZXJzLlxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICogQGRlZmF1bHQgJ25vbmUnXG4gICAgICovXG4gICAgdXNlckRyYWc6ICdub25lJyxcblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogT3ZlcnJpZGVzIHRoZSBoaWdobGlnaHQgY29sb3Igc2hvd24gd2hlbiB0aGUgdXNlciB0YXBzIGEgbGluayBvciBhIEphdmFTY3JpcHRcbiAgICAgKiBjbGlja2FibGUgZWxlbWVudCBpbiBpT1MuIFRoaXMgcHJvcGVydHkgb2JleXMgdGhlIGFscGhhIHZhbHVlLCBpZiBzcGVjaWZpZWQuXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKiBAZGVmYXVsdCAncmdiYSgwLDAsMCwwKSdcbiAgICAgKi9cbiAgICB0YXBIaWdobGlnaHRDb2xvcjogJ3JnYmEoMCwwLDAsMCknXG4gIH1cbn07XG5cbnZhciBTSU5HTEVfVE9VQ0hfSU5QVVRfTUFQID0ge1xuICB0b3VjaHN0YXJ0OiBJTlBVVF9TVEFSVCxcbiAgdG91Y2htb3ZlOiBJTlBVVF9NT1ZFLFxuICB0b3VjaGVuZDogSU5QVVRfRU5ELFxuICB0b3VjaGNhbmNlbDogSU5QVVRfQ0FOQ0VMXG59O1xuXG52YXIgU0lOR0xFX1RPVUNIX1RBUkdFVF9FVkVOVFMgPSAndG91Y2hzdGFydCc7XG52YXIgU0lOR0xFX1RPVUNIX1dJTkRPV19FVkVOVFMgPSAndG91Y2hzdGFydCB0b3VjaG1vdmUgdG91Y2hlbmQgdG91Y2hjYW5jZWwnO1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBUb3VjaCBldmVudHMgaW5wdXRcbiAqIEBjb25zdHJ1Y3RvclxuICogQGV4dGVuZHMgSW5wdXRcbiAqL1xuXG52YXIgU2luZ2xlVG91Y2hJbnB1dCA9IGZ1bmN0aW9uIChfSW5wdXQpIHtcbiAgaW5oZXJpdHMoU2luZ2xlVG91Y2hJbnB1dCwgX0lucHV0KTtcblxuICBmdW5jdGlvbiBTaW5nbGVUb3VjaElucHV0KCkge1xuICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIFNpbmdsZVRvdWNoSW5wdXQpO1xuXG4gICAgdmFyIF90aGlzID0gcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCAoU2luZ2xlVG91Y2hJbnB1dC5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKFNpbmdsZVRvdWNoSW5wdXQpKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcblxuICAgIF90aGlzLmV2VGFyZ2V0ID0gU0lOR0xFX1RPVUNIX1RBUkdFVF9FVkVOVFM7XG4gICAgX3RoaXMuZXZXaW4gPSBTSU5HTEVfVE9VQ0hfV0lORE9XX0VWRU5UUztcbiAgICBfdGhpcy5zdGFydGVkID0gZmFsc2U7XG5cbiAgICBJbnB1dC5hcHBseShfdGhpcywgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gX3RoaXM7XG4gIH1cblxuICBjcmVhdGVDbGFzcyhTaW5nbGVUb3VjaElucHV0LCBbe1xuICAgIGtleTogJ2hhbmRsZXInLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBoYW5kbGVyKGV2KSB7XG4gICAgICB2YXIgdHlwZSA9IFNJTkdMRV9UT1VDSF9JTlBVVF9NQVBbZXYudHlwZV07XG5cbiAgICAgIC8vIHNob3VsZCB3ZSBoYW5kbGUgdGhlIHRvdWNoIGV2ZW50cz9cbiAgICAgIGlmICh0eXBlID09PSBJTlBVVF9TVEFSVCkge1xuICAgICAgICB0aGlzLnN0YXJ0ZWQgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMuc3RhcnRlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciB0b3VjaGVzID0gbm9ybWFsaXplU2luZ2xlVG91Y2hlcy5jYWxsKHRoaXMsIGV2LCB0eXBlKTtcblxuICAgICAgLy8gd2hlbiBkb25lLCByZXNldCB0aGUgc3RhcnRlZCBzdGF0ZVxuICAgICAgaWYgKHR5cGUgJiAoSU5QVVRfRU5EIHwgSU5QVVRfQ0FOQ0VMKSAmJiB0b3VjaGVzWzBdLmxlbmd0aCAtIHRvdWNoZXNbMV0ubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRoaXMuc3RhcnRlZCA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNhbGxiYWNrKHRoaXMubWFuYWdlciwgdHlwZSwge1xuICAgICAgICBwb2ludGVyczogdG91Y2hlc1swXSxcbiAgICAgICAgY2hhbmdlZFBvaW50ZXJzOiB0b3VjaGVzWzFdLFxuICAgICAgICBwb2ludGVyVHlwZTogSU5QVVRfVFlQRV9UT1VDSCxcbiAgICAgICAgc3JjRXZlbnQ6IGV2XG4gICAgICB9KTtcbiAgICB9XG4gIH1dKTtcbiAgcmV0dXJuIFNpbmdsZVRvdWNoSW5wdXQ7XG59KElucHV0KTtcblxuZnVuY3Rpb24gbm9ybWFsaXplU2luZ2xlVG91Y2hlcyhldiwgdHlwZSkge1xuICB2YXIgYWxsID0gdG9BcnJheSQxKGV2LnRvdWNoZXMpO1xuICB2YXIgY2hhbmdlZCA9IHRvQXJyYXkkMShldi5jaGFuZ2VkVG91Y2hlcyk7XG5cbiAgaWYgKHR5cGUgJiAoSU5QVVRfRU5EIHwgSU5QVVRfQ0FOQ0VMKSkge1xuICAgIGFsbCA9IHVuaXF1ZUFycmF5KGFsbC5jb25jYXQoY2hhbmdlZCksICdpZGVudGlmaWVyJywgdHJ1ZSk7XG4gIH1cblxuICByZXR1cm4gW2FsbCwgY2hhbmdlZF07XG59XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIHdyYXAgYSBtZXRob2Qgd2l0aCBhIGRlcHJlY2F0aW9uIHdhcm5pbmcgYW5kIHN0YWNrIHRyYWNlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBtZXRob2RcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZVxuICogQHJldHVybnMge0Z1bmN0aW9ufSBBIG5ldyBmdW5jdGlvbiB3cmFwcGluZyB0aGUgc3VwcGxpZWQgbWV0aG9kLlxuICovXG5mdW5jdGlvbiBkZXByZWNhdGUobWV0aG9kLCBuYW1lLCBtZXNzYWdlKSB7XG4gIHZhciBkZXByZWNhdGlvbk1lc3NhZ2UgPSAnREVQUkVDQVRFRCBNRVRIT0Q6ICcgKyBuYW1lICsgJ1xcbicgKyBtZXNzYWdlICsgJyBBVCBcXG4nO1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHZhciBlID0gbmV3IEVycm9yKCdnZXQtc3RhY2stdHJhY2UnKTtcbiAgICB2YXIgc3RhY2sgPSBlICYmIGUuc3RhY2sgPyBlLnN0YWNrLnJlcGxhY2UoL15bXlxcKF0rP1tcXG4kXS9nbSwgJycpLnJlcGxhY2UoL15cXHMrYXRcXHMrL2dtLCAnJykucmVwbGFjZSgvXk9iamVjdC48YW5vbnltb3VzPlxccypcXCgvZ20sICd7YW5vbnltb3VzfSgpQCcpIDogJ1Vua25vd24gU3RhY2sgVHJhY2UnO1xuXG4gICAgdmFyIGxvZyA9IHdpbmRvdy5jb25zb2xlICYmICh3aW5kb3cuY29uc29sZS53YXJuIHx8IHdpbmRvdy5jb25zb2xlLmxvZyk7XG4gICAgaWYgKGxvZykge1xuICAgICAgbG9nLmNhbGwod2luZG93LmNvbnNvbGUsIGRlcHJlY2F0aW9uTWVzc2FnZSwgc3RhY2spO1xuICAgIH1cbiAgICByZXR1cm4gbWV0aG9kLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH07XG59XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIGV4dGVuZCBvYmplY3QuXG4gKiBtZWFucyB0aGF0IHByb3BlcnRpZXMgaW4gZGVzdCB3aWxsIGJlIG92ZXJ3cml0dGVuIGJ5IHRoZSBvbmVzIGluIHNyYy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBkZXN0XG4gKiBAcGFyYW0ge09iamVjdH0gc3JjXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFttZXJnZT1mYWxzZV1cbiAqIEByZXR1cm5zIHtPYmplY3R9IGRlc3RcbiAqL1xudmFyIGV4dGVuZCA9IGRlcHJlY2F0ZShmdW5jdGlvbiAoZGVzdCwgc3JjLCBtZXJnZSkge1xuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHNyYyk7XG4gIHZhciBpID0gMDtcbiAgd2hpbGUgKGkgPCBrZXlzLmxlbmd0aCkge1xuICAgIGlmICghbWVyZ2UgfHwgbWVyZ2UgJiYgZGVzdFtrZXlzW2ldXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBkZXN0W2tleXNbaV1dID0gc3JjW2tleXNbaV1dO1xuICAgIH1cbiAgICBpKys7XG4gIH1cbiAgcmV0dXJuIGRlc3Q7XG59LCAnZXh0ZW5kJywgJ1VzZSBgYXNzaWduYC4nKTtcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogbWVyZ2UgdGhlIHZhbHVlcyBmcm9tIHNyYyBpbiB0aGUgZGVzdC5cbiAqIG1lYW5zIHRoYXQgcHJvcGVydGllcyB0aGF0IGV4aXN0IGluIGRlc3Qgd2lsbCBub3QgYmUgb3ZlcndyaXR0ZW4gYnkgc3JjXG4gKiBAcGFyYW0ge09iamVjdH0gZGVzdFxuICogQHBhcmFtIHtPYmplY3R9IHNyY1xuICogQHJldHVybnMge09iamVjdH0gZGVzdFxuICovXG52YXIgbWVyZ2UgPSBkZXByZWNhdGUoZnVuY3Rpb24gKGRlc3QsIHNyYykge1xuICByZXR1cm4gZXh0ZW5kKGRlc3QsIHNyYywgdHJ1ZSk7XG59LCAnbWVyZ2UnLCAnVXNlIGBhc3NpZ25gLicpO1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBzaW1wbGUgY2xhc3MgaW5oZXJpdGFuY2VcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNoaWxkXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBiYXNlXG4gKiBAcGFyYW0ge09iamVjdH0gW3Byb3BlcnRpZXNdXG4gKi9cbmZ1bmN0aW9uIGluaGVyaXQoY2hpbGQsIGJhc2UsIHByb3BlcnRpZXMpIHtcbiAgdmFyIGJhc2VQID0gYmFzZS5wcm90b3R5cGU7XG4gIHZhciBjaGlsZFAgPSB2b2lkIDA7XG5cbiAgY2hpbGRQID0gY2hpbGQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShiYXNlUCk7XG4gIGNoaWxkUC5jb25zdHJ1Y3RvciA9IGNoaWxkO1xuICBjaGlsZFAuX3N1cGVyID0gYmFzZVA7XG5cbiAgaWYgKHByb3BlcnRpZXMpIHtcbiAgICBhc3NpZ24kMShjaGlsZFAsIHByb3BlcnRpZXMpO1xuICB9XG59XG5cbi8vIHRoaXMgcHJldmVudHMgZXJyb3JzIHdoZW4gSGFtbWVyIGlzIGxvYWRlZCBpbiB0aGUgcHJlc2VuY2Ugb2YgYW4gQU1EXG4vLyAgc3R5bGUgbG9hZGVyIGJ1dCBieSBzY3JpcHQgdGFnLCBub3QgYnkgdGhlIGxvYWRlci5cblxuYXNzaWduJDEoSGFtbWVyLCB7XG4gIElOUFVUX1NUQVJUOiBJTlBVVF9TVEFSVCxcbiAgSU5QVVRfTU9WRTogSU5QVVRfTU9WRSxcbiAgSU5QVVRfRU5EOiBJTlBVVF9FTkQsXG4gIElOUFVUX0NBTkNFTDogSU5QVVRfQ0FOQ0VMLFxuXG4gIFNUQVRFX1BPU1NJQkxFOiBTVEFURV9QT1NTSUJMRSxcbiAgU1RBVEVfQkVHQU46IFNUQVRFX0JFR0FOLFxuICBTVEFURV9DSEFOR0VEOiBTVEFURV9DSEFOR0VELFxuICBTVEFURV9FTkRFRDogU1RBVEVfRU5ERUQsXG4gIFNUQVRFX1JFQ09HTklaRUQ6IFNUQVRFX1JFQ09HTklaRUQsXG4gIFNUQVRFX0NBTkNFTExFRDogU1RBVEVfQ0FOQ0VMTEVELFxuICBTVEFURV9GQUlMRUQ6IFNUQVRFX0ZBSUxFRCxcblxuICBESVJFQ1RJT05fTk9ORTogRElSRUNUSU9OX05PTkUsXG4gIERJUkVDVElPTl9MRUZUOiBESVJFQ1RJT05fTEVGVCxcbiAgRElSRUNUSU9OX1JJR0hUOiBESVJFQ1RJT05fUklHSFQsXG4gIERJUkVDVElPTl9VUDogRElSRUNUSU9OX1VQLFxuICBESVJFQ1RJT05fRE9XTjogRElSRUNUSU9OX0RPV04sXG4gIERJUkVDVElPTl9IT1JJWk9OVEFMOiBESVJFQ1RJT05fSE9SSVpPTlRBTCxcbiAgRElSRUNUSU9OX1ZFUlRJQ0FMOiBESVJFQ1RJT05fVkVSVElDQUwsXG4gIERJUkVDVElPTl9BTEw6IERJUkVDVElPTl9BTEwsXG5cbiAgTWFuYWdlcjogTWFuYWdlcixcbiAgSW5wdXQ6IElucHV0LFxuICBUb3VjaEFjdGlvbjogVG91Y2hBY3Rpb24sXG5cbiAgVG91Y2hJbnB1dDogVG91Y2hJbnB1dCxcbiAgTW91c2VJbnB1dDogTW91c2VJbnB1dCxcbiAgUG9pbnRlckV2ZW50SW5wdXQ6IFBvaW50ZXJFdmVudElucHV0LFxuICBUb3VjaE1vdXNlSW5wdXQ6IFRvdWNoTW91c2VJbnB1dCxcbiAgU2luZ2xlVG91Y2hJbnB1dDogU2luZ2xlVG91Y2hJbnB1dCxcblxuICBSZWNvZ25pemVyOiBSZWNvZ25pemVyLFxuICBBdHRyUmVjb2duaXplcjogQXR0clJlY29nbml6ZXIsXG4gIFRhcDogVGFwUmVjb2duaXplcixcbiAgUGFuOiBQYW5SZWNvZ25pemVyLFxuICBTd2lwZTogU3dpcGVSZWNvZ25pemVyLFxuICBQaW5jaDogUGluY2hSZWNvZ25pemVyLFxuICBSb3RhdGU6IFJvdGF0ZVJlY29nbml6ZXIsXG4gIFByZXNzOiBQcmVzc1JlY29nbml6ZXIsXG5cbiAgb246IGFkZEV2ZW50TGlzdGVuZXJzLFxuICBvZmY6IHJlbW92ZUV2ZW50TGlzdGVuZXJzLFxuICBlYWNoOiBlYWNoLFxuICBtZXJnZTogbWVyZ2UsXG4gIGV4dGVuZDogZXh0ZW5kLFxuICBhc3NpZ246IGFzc2lnbiQxLFxuICBpbmhlcml0OiBpbmhlcml0LFxuICBiaW5kRm46IGJpbmRGbixcbiAgcHJlZml4ZWQ6IHByZWZpeGVkLFxuICB0b0FycmF5OiB0b0FycmF5JDEsXG4gIGluQXJyYXk6IGluQXJyYXksXG4gIHVuaXF1ZUFycmF5OiB1bmlxdWVBcnJheSxcbiAgc3BsaXRTdHI6IHNwbGl0U3RyLFxuICBib29sT3JGbjogYm9vbE9yRm4sXG4gIGhhc1BhcmVudDogaGFzUGFyZW50LFxuICBhZGRFdmVudExpc3RlbmVyczogYWRkRXZlbnRMaXN0ZW5lcnMsXG4gIHJlbW92ZUV2ZW50TGlzdGVuZXJzOiByZW1vdmVFdmVudExpc3RlbmVyc1xufSk7XG5cbi8qIGpzaGludCBpZ25vcmU6c3RhcnQgKi9cbmlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgZGVmaW5lKGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gSGFtbWVyO1xuICB9KTtcbn0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBIYW1tZXI7XG59IGVsc2Uge1xuICB3aW5kb3dbZXhwb3J0TmFtZV0gPSBIYW1tZXI7XG59XG4vKiBqc2hpbnQgaWdub3JlOmVuZCAqL1xufSkod2luZG93LCBkb2N1bWVudCwgJ0hhbW1lcicpOyIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG52YXIgb2JqZWN0Q3JlYXRlID0gT2JqZWN0LmNyZWF0ZSB8fCBvYmplY3RDcmVhdGVQb2x5ZmlsbFxudmFyIG9iamVjdEtleXMgPSBPYmplY3Qua2V5cyB8fCBvYmplY3RLZXlzUG9seWZpbGxcbnZhciBiaW5kID0gRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQgfHwgZnVuY3Rpb25CaW5kUG9seWZpbGxcblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHRoaXMsICdfZXZlbnRzJykpIHtcbiAgICB0aGlzLl9ldmVudHMgPSBvYmplY3RDcmVhdGUobnVsbCk7XG4gICAgdGhpcy5fZXZlbnRzQ291bnQgPSAwO1xuICB9XG5cbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gdGhpcy5fbWF4TGlzdGVuZXJzIHx8IHVuZGVmaW5lZDtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxudmFyIGRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxudmFyIGhhc0RlZmluZVByb3BlcnR5O1xudHJ5IHtcbiAgdmFyIG8gPSB7fTtcbiAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sICd4JywgeyB2YWx1ZTogMCB9KTtcbiAgaGFzRGVmaW5lUHJvcGVydHkgPSBvLnggPT09IDA7XG59IGNhdGNoIChlcnIpIHsgaGFzRGVmaW5lUHJvcGVydHkgPSBmYWxzZSB9XG5pZiAoaGFzRGVmaW5lUHJvcGVydHkpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEV2ZW50RW1pdHRlciwgJ2RlZmF1bHRNYXhMaXN0ZW5lcnMnLCB7XG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uKGFyZykge1xuICAgICAgLy8gY2hlY2sgd2hldGhlciB0aGUgaW5wdXQgaXMgYSBwb3NpdGl2ZSBudW1iZXIgKHdob3NlIHZhbHVlIGlzIHplcm8gb3JcbiAgICAgIC8vIGdyZWF0ZXIgYW5kIG5vdCBhIE5hTikuXG4gICAgICBpZiAodHlwZW9mIGFyZyAhPT0gJ251bWJlcicgfHwgYXJnIDwgMCB8fCBhcmcgIT09IGFyZylcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJkZWZhdWx0TWF4TGlzdGVuZXJzXCIgbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICAgICAgZGVmYXVsdE1heExpc3RlbmVycyA9IGFyZztcbiAgICB9XG4gIH0pO1xufSBlbHNlIHtcbiAgRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnMgPSBkZWZhdWx0TWF4TGlzdGVuZXJzO1xufVxuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbiBzZXRNYXhMaXN0ZW5lcnMobikge1xuICBpZiAodHlwZW9mIG4gIT09ICdudW1iZXInIHx8IG4gPCAwIHx8IGlzTmFOKG4pKVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiblwiIGFyZ3VtZW50IG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5mdW5jdGlvbiAkZ2V0TWF4TGlzdGVuZXJzKHRoYXQpIHtcbiAgaWYgKHRoYXQuX21heExpc3RlbmVycyA9PT0gdW5kZWZpbmVkKVxuICAgIHJldHVybiBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgcmV0dXJuIHRoYXQuX21heExpc3RlbmVycztcbn1cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5nZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbiBnZXRNYXhMaXN0ZW5lcnMoKSB7XG4gIHJldHVybiAkZ2V0TWF4TGlzdGVuZXJzKHRoaXMpO1xufTtcblxuLy8gVGhlc2Ugc3RhbmRhbG9uZSBlbWl0KiBmdW5jdGlvbnMgYXJlIHVzZWQgdG8gb3B0aW1pemUgY2FsbGluZyBvZiBldmVudFxuLy8gaGFuZGxlcnMgZm9yIGZhc3QgY2FzZXMgYmVjYXVzZSBlbWl0KCkgaXRzZWxmIG9mdGVuIGhhcyBhIHZhcmlhYmxlIG51bWJlciBvZlxuLy8gYXJndW1lbnRzIGFuZCBjYW4gYmUgZGVvcHRpbWl6ZWQgYmVjYXVzZSBvZiB0aGF0LiBUaGVzZSBmdW5jdGlvbnMgYWx3YXlzIGhhdmVcbi8vIHRoZSBzYW1lIG51bWJlciBvZiBhcmd1bWVudHMgYW5kIHRodXMgZG8gbm90IGdldCBkZW9wdGltaXplZCwgc28gdGhlIGNvZGVcbi8vIGluc2lkZSB0aGVtIGNhbiBleGVjdXRlIGZhc3Rlci5cbmZ1bmN0aW9uIGVtaXROb25lKGhhbmRsZXIsIGlzRm4sIHNlbGYpIHtcbiAgaWYgKGlzRm4pXG4gICAgaGFuZGxlci5jYWxsKHNlbGYpO1xuICBlbHNlIHtcbiAgICB2YXIgbGVuID0gaGFuZGxlci5sZW5ndGg7XG4gICAgdmFyIGxpc3RlbmVycyA9IGFycmF5Q2xvbmUoaGFuZGxlciwgbGVuKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKVxuICAgICAgbGlzdGVuZXJzW2ldLmNhbGwoc2VsZik7XG4gIH1cbn1cbmZ1bmN0aW9uIGVtaXRPbmUoaGFuZGxlciwgaXNGbiwgc2VsZiwgYXJnMSkge1xuICBpZiAoaXNGbilcbiAgICBoYW5kbGVyLmNhbGwoc2VsZiwgYXJnMSk7XG4gIGVsc2Uge1xuICAgIHZhciBsZW4gPSBoYW5kbGVyLmxlbmd0aDtcbiAgICB2YXIgbGlzdGVuZXJzID0gYXJyYXlDbG9uZShoYW5kbGVyLCBsZW4pO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpXG4gICAgICBsaXN0ZW5lcnNbaV0uY2FsbChzZWxmLCBhcmcxKTtcbiAgfVxufVxuZnVuY3Rpb24gZW1pdFR3byhoYW5kbGVyLCBpc0ZuLCBzZWxmLCBhcmcxLCBhcmcyKSB7XG4gIGlmIChpc0ZuKVxuICAgIGhhbmRsZXIuY2FsbChzZWxmLCBhcmcxLCBhcmcyKTtcbiAgZWxzZSB7XG4gICAgdmFyIGxlbiA9IGhhbmRsZXIubGVuZ3RoO1xuICAgIHZhciBsaXN0ZW5lcnMgPSBhcnJheUNsb25lKGhhbmRsZXIsIGxlbik7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSlcbiAgICAgIGxpc3RlbmVyc1tpXS5jYWxsKHNlbGYsIGFyZzEsIGFyZzIpO1xuICB9XG59XG5mdW5jdGlvbiBlbWl0VGhyZWUoaGFuZGxlciwgaXNGbiwgc2VsZiwgYXJnMSwgYXJnMiwgYXJnMykge1xuICBpZiAoaXNGbilcbiAgICBoYW5kbGVyLmNhbGwoc2VsZiwgYXJnMSwgYXJnMiwgYXJnMyk7XG4gIGVsc2Uge1xuICAgIHZhciBsZW4gPSBoYW5kbGVyLmxlbmd0aDtcbiAgICB2YXIgbGlzdGVuZXJzID0gYXJyYXlDbG9uZShoYW5kbGVyLCBsZW4pO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpXG4gICAgICBsaXN0ZW5lcnNbaV0uY2FsbChzZWxmLCBhcmcxLCBhcmcyLCBhcmczKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBlbWl0TWFueShoYW5kbGVyLCBpc0ZuLCBzZWxmLCBhcmdzKSB7XG4gIGlmIChpc0ZuKVxuICAgIGhhbmRsZXIuYXBwbHkoc2VsZiwgYXJncyk7XG4gIGVsc2Uge1xuICAgIHZhciBsZW4gPSBoYW5kbGVyLmxlbmd0aDtcbiAgICB2YXIgbGlzdGVuZXJzID0gYXJyYXlDbG9uZShoYW5kbGVyLCBsZW4pO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpXG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkoc2VsZiwgYXJncyk7XG4gIH1cbn1cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24gZW1pdCh0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBldmVudHM7XG4gIHZhciBkb0Vycm9yID0gKHR5cGUgPT09ICdlcnJvcicpO1xuXG4gIGV2ZW50cyA9IHRoaXMuX2V2ZW50cztcbiAgaWYgKGV2ZW50cylcbiAgICBkb0Vycm9yID0gKGRvRXJyb3IgJiYgZXZlbnRzLmVycm9yID09IG51bGwpO1xuICBlbHNlIGlmICghZG9FcnJvcilcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAoZG9FcnJvcikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSlcbiAgICAgIGVyID0gYXJndW1lbnRzWzFdO1xuICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQXQgbGVhc3QgZ2l2ZSBzb21lIGtpbmQgb2YgY29udGV4dCB0byB0aGUgdXNlclxuICAgICAgdmFyIGVyciA9IG5ldyBFcnJvcignVW5oYW5kbGVkIFwiZXJyb3JcIiBldmVudC4gKCcgKyBlciArICcpJyk7XG4gICAgICBlcnIuY29udGV4dCA9IGVyO1xuICAgICAgdGhyb3cgZXJyO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBoYW5kbGVyID0gZXZlbnRzW3R5cGVdO1xuXG4gIGlmICghaGFuZGxlcilcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgdmFyIGlzRm4gPSB0eXBlb2YgaGFuZGxlciA9PT0gJ2Z1bmN0aW9uJztcbiAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgc3dpdGNoIChsZW4pIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICBjYXNlIDE6XG4gICAgICBlbWl0Tm9uZShoYW5kbGVyLCBpc0ZuLCB0aGlzKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMjpcbiAgICAgIGVtaXRPbmUoaGFuZGxlciwgaXNGbiwgdGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMzpcbiAgICAgIGVtaXRUd28oaGFuZGxlciwgaXNGbiwgdGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSA0OlxuICAgICAgZW1pdFRocmVlKGhhbmRsZXIsIGlzRm4sIHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdLCBhcmd1bWVudHNbM10pO1xuICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICBkZWZhdWx0OlxuICAgICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICBlbWl0TWFueShoYW5kbGVyLCBpc0ZuLCB0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuZnVuY3Rpb24gX2FkZExpc3RlbmVyKHRhcmdldCwgdHlwZSwgbGlzdGVuZXIsIHByZXBlbmQpIHtcbiAgdmFyIG07XG4gIHZhciBldmVudHM7XG4gIHZhciBleGlzdGluZztcblxuICBpZiAodHlwZW9mIGxpc3RlbmVyICE9PSAnZnVuY3Rpb24nKVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wibGlzdGVuZXJcIiBhcmd1bWVudCBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBldmVudHMgPSB0YXJnZXQuX2V2ZW50cztcbiAgaWYgKCFldmVudHMpIHtcbiAgICBldmVudHMgPSB0YXJnZXQuX2V2ZW50cyA9IG9iamVjdENyZWF0ZShudWxsKTtcbiAgICB0YXJnZXQuX2V2ZW50c0NvdW50ID0gMDtcbiAgfSBlbHNlIHtcbiAgICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAgIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgICBpZiAoZXZlbnRzLm5ld0xpc3RlbmVyKSB7XG4gICAgICB0YXJnZXQuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLFxuICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyID8gbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgICAgIC8vIFJlLWFzc2lnbiBgZXZlbnRzYCBiZWNhdXNlIGEgbmV3TGlzdGVuZXIgaGFuZGxlciBjb3VsZCBoYXZlIGNhdXNlZCB0aGVcbiAgICAgIC8vIHRoaXMuX2V2ZW50cyB0byBiZSBhc3NpZ25lZCB0byBhIG5ldyBvYmplY3RcbiAgICAgIGV2ZW50cyA9IHRhcmdldC5fZXZlbnRzO1xuICAgIH1cbiAgICBleGlzdGluZyA9IGV2ZW50c1t0eXBlXTtcbiAgfVxuXG4gIGlmICghZXhpc3RpbmcpIHtcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICBleGlzdGluZyA9IGV2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICAgICsrdGFyZ2V0Ll9ldmVudHNDb3VudDtcbiAgfSBlbHNlIHtcbiAgICBpZiAodHlwZW9mIGV4aXN0aW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICAgIGV4aXN0aW5nID0gZXZlbnRzW3R5cGVdID1cbiAgICAgICAgICBwcmVwZW5kID8gW2xpc3RlbmVyLCBleGlzdGluZ10gOiBbZXhpc3RpbmcsIGxpc3RlbmVyXTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgICAgaWYgKHByZXBlbmQpIHtcbiAgICAgICAgZXhpc3RpbmcudW5zaGlmdChsaXN0ZW5lcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBleGlzdGluZy5wdXNoKGxpc3RlbmVyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICAgIGlmICghZXhpc3Rpbmcud2FybmVkKSB7XG4gICAgICBtID0gJGdldE1heExpc3RlbmVycyh0YXJnZXQpO1xuICAgICAgaWYgKG0gJiYgbSA+IDAgJiYgZXhpc3RpbmcubGVuZ3RoID4gbSkge1xuICAgICAgICBleGlzdGluZy53YXJuZWQgPSB0cnVlO1xuICAgICAgICB2YXIgdyA9IG5ldyBFcnJvcignUG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSBsZWFrIGRldGVjdGVkLiAnICtcbiAgICAgICAgICAgIGV4aXN0aW5nLmxlbmd0aCArICcgXCInICsgU3RyaW5nKHR5cGUpICsgJ1wiIGxpc3RlbmVycyAnICtcbiAgICAgICAgICAgICdhZGRlZC4gVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gJyArXG4gICAgICAgICAgICAnaW5jcmVhc2UgbGltaXQuJyk7XG4gICAgICAgIHcubmFtZSA9ICdNYXhMaXN0ZW5lcnNFeGNlZWRlZFdhcm5pbmcnO1xuICAgICAgICB3LmVtaXR0ZXIgPSB0YXJnZXQ7XG4gICAgICAgIHcudHlwZSA9IHR5cGU7XG4gICAgICAgIHcuY291bnQgPSBleGlzdGluZy5sZW5ndGg7XG4gICAgICAgIGlmICh0eXBlb2YgY29uc29sZSA9PT0gJ29iamVjdCcgJiYgY29uc29sZS53YXJuKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKCclczogJXMnLCB3Lm5hbWUsIHcubWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGFyZ2V0O1xufVxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24gYWRkTGlzdGVuZXIodHlwZSwgbGlzdGVuZXIpIHtcbiAgcmV0dXJuIF9hZGRMaXN0ZW5lcih0aGlzLCB0eXBlLCBsaXN0ZW5lciwgZmFsc2UpO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucHJlcGVuZExpc3RlbmVyID1cbiAgICBmdW5jdGlvbiBwcmVwZW5kTGlzdGVuZXIodHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgIHJldHVybiBfYWRkTGlzdGVuZXIodGhpcywgdHlwZSwgbGlzdGVuZXIsIHRydWUpO1xuICAgIH07XG5cbmZ1bmN0aW9uIG9uY2VXcmFwcGVyKCkge1xuICBpZiAoIXRoaXMuZmlyZWQpIHtcbiAgICB0aGlzLnRhcmdldC5yZW1vdmVMaXN0ZW5lcih0aGlzLnR5cGUsIHRoaXMud3JhcEZuKTtcbiAgICB0aGlzLmZpcmVkID0gdHJ1ZTtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgcmV0dXJuIHRoaXMubGlzdGVuZXIuY2FsbCh0aGlzLnRhcmdldCk7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIHJldHVybiB0aGlzLmxpc3RlbmVyLmNhbGwodGhpcy50YXJnZXQsIGFyZ3VtZW50c1swXSk7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIHJldHVybiB0aGlzLmxpc3RlbmVyLmNhbGwodGhpcy50YXJnZXQsIGFyZ3VtZW50c1swXSwgYXJndW1lbnRzWzFdKTtcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgcmV0dXJuIHRoaXMubGlzdGVuZXIuY2FsbCh0aGlzLnRhcmdldCwgYXJndW1lbnRzWzBdLCBhcmd1bWVudHNbMV0sXG4gICAgICAgICAgICBhcmd1bWVudHNbMl0pO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7ICsraSlcbiAgICAgICAgICBhcmdzW2ldID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB0aGlzLmxpc3RlbmVyLmFwcGx5KHRoaXMudGFyZ2V0LCBhcmdzKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gX29uY2VXcmFwKHRhcmdldCwgdHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIHN0YXRlID0geyBmaXJlZDogZmFsc2UsIHdyYXBGbjogdW5kZWZpbmVkLCB0YXJnZXQ6IHRhcmdldCwgdHlwZTogdHlwZSwgbGlzdGVuZXI6IGxpc3RlbmVyIH07XG4gIHZhciB3cmFwcGVkID0gYmluZC5jYWxsKG9uY2VXcmFwcGVyLCBzdGF0ZSk7XG4gIHdyYXBwZWQubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgc3RhdGUud3JhcEZuID0gd3JhcHBlZDtcbiAgcmV0dXJuIHdyYXBwZWQ7XG59XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uIG9uY2UodHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKHR5cGVvZiBsaXN0ZW5lciAhPT0gJ2Z1bmN0aW9uJylcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImxpc3RlbmVyXCIgYXJndW1lbnQgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG4gIHRoaXMub24odHlwZSwgX29uY2VXcmFwKHRoaXMsIHR5cGUsIGxpc3RlbmVyKSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5wcmVwZW5kT25jZUxpc3RlbmVyID1cbiAgICBmdW5jdGlvbiBwcmVwZW5kT25jZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgICBpZiAodHlwZW9mIGxpc3RlbmVyICE9PSAnZnVuY3Rpb24nKVxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImxpc3RlbmVyXCIgYXJndW1lbnQgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG4gICAgICB0aGlzLnByZXBlbmRMaXN0ZW5lcih0eXBlLCBfb25jZVdyYXAodGhpcywgdHlwZSwgbGlzdGVuZXIpKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbi8vIEVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZiBhbmQgb25seSBpZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID1cbiAgICBmdW5jdGlvbiByZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcikge1xuICAgICAgdmFyIGxpc3QsIGV2ZW50cywgcG9zaXRpb24sIGksIG9yaWdpbmFsTGlzdGVuZXI7XG5cbiAgICAgIGlmICh0eXBlb2YgbGlzdGVuZXIgIT09ICdmdW5jdGlvbicpXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wibGlzdGVuZXJcIiBhcmd1bWVudCBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICAgICAgZXZlbnRzID0gdGhpcy5fZXZlbnRzO1xuICAgICAgaWYgKCFldmVudHMpXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICBsaXN0ID0gZXZlbnRzW3R5cGVdO1xuICAgICAgaWYgKCFsaXN0KVxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgICAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8IGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSB7XG4gICAgICAgIGlmICgtLXRoaXMuX2V2ZW50c0NvdW50ID09PSAwKVxuICAgICAgICAgIHRoaXMuX2V2ZW50cyA9IG9iamVjdENyZWF0ZShudWxsKTtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgZGVsZXRlIGV2ZW50c1t0eXBlXTtcbiAgICAgICAgICBpZiAoZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3QubGlzdGVuZXIgfHwgbGlzdGVuZXIpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBsaXN0ICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHBvc2l0aW9uID0gLTE7XG5cbiAgICAgICAgZm9yIChpID0gbGlzdC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fCBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikge1xuICAgICAgICAgICAgb3JpZ2luYWxMaXN0ZW5lciA9IGxpc3RbaV0ubGlzdGVuZXI7XG4gICAgICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICAgIGlmIChwb3NpdGlvbiA9PT0gMClcbiAgICAgICAgICBsaXN0LnNoaWZ0KCk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBzcGxpY2VPbmUobGlzdCwgcG9zaXRpb24pO1xuXG4gICAgICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSlcbiAgICAgICAgICBldmVudHNbdHlwZV0gPSBsaXN0WzBdO1xuXG4gICAgICAgIGlmIChldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIG9yaWdpbmFsTGlzdGVuZXIgfHwgbGlzdGVuZXIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9XG4gICAgZnVuY3Rpb24gcmVtb3ZlQWxsTGlzdGVuZXJzKHR5cGUpIHtcbiAgICAgIHZhciBsaXN0ZW5lcnMsIGV2ZW50cywgaTtcblxuICAgICAgZXZlbnRzID0gdGhpcy5fZXZlbnRzO1xuICAgICAgaWYgKCFldmVudHMpXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gICAgICBpZiAoIWV2ZW50cy5yZW1vdmVMaXN0ZW5lcikge1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHRoaXMuX2V2ZW50cyA9IG9iamVjdENyZWF0ZShudWxsKTtcbiAgICAgICAgICB0aGlzLl9ldmVudHNDb3VudCA9IDA7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnRzW3R5cGVdKSB7XG4gICAgICAgICAgaWYgKC0tdGhpcy5fZXZlbnRzQ291bnQgPT09IDApXG4gICAgICAgICAgICB0aGlzLl9ldmVudHMgPSBvYmplY3RDcmVhdGUobnVsbCk7XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgZGVsZXRlIGV2ZW50c1t0eXBlXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB2YXIga2V5cyA9IG9iamVjdEtleXMoZXZlbnRzKTtcbiAgICAgICAgdmFyIGtleTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGtleXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICBrZXkgPSBrZXlzW2ldO1xuICAgICAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgICAgIHRoaXMuX2V2ZW50cyA9IG9iamVjdENyZWF0ZShudWxsKTtcbiAgICAgICAgdGhpcy5fZXZlbnRzQ291bnQgPSAwO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgbGlzdGVuZXJzID0gZXZlbnRzW3R5cGVdO1xuXG4gICAgICBpZiAodHlwZW9mIGxpc3RlbmVycyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gICAgICB9IGVsc2UgaWYgKGxpc3RlbmVycykge1xuICAgICAgICAvLyBMSUZPIG9yZGVyXG4gICAgICAgIGZvciAoaSA9IGxpc3RlbmVycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG5mdW5jdGlvbiBfbGlzdGVuZXJzKHRhcmdldCwgdHlwZSwgdW53cmFwKSB7XG4gIHZhciBldmVudHMgPSB0YXJnZXQuX2V2ZW50cztcblxuICBpZiAoIWV2ZW50cylcbiAgICByZXR1cm4gW107XG5cbiAgdmFyIGV2bGlzdGVuZXIgPSBldmVudHNbdHlwZV07XG4gIGlmICghZXZsaXN0ZW5lcilcbiAgICByZXR1cm4gW107XG5cbiAgaWYgKHR5cGVvZiBldmxpc3RlbmVyID09PSAnZnVuY3Rpb24nKVxuICAgIHJldHVybiB1bndyYXAgPyBbZXZsaXN0ZW5lci5saXN0ZW5lciB8fCBldmxpc3RlbmVyXSA6IFtldmxpc3RlbmVyXTtcblxuICByZXR1cm4gdW53cmFwID8gdW53cmFwTGlzdGVuZXJzKGV2bGlzdGVuZXIpIDogYXJyYXlDbG9uZShldmxpc3RlbmVyLCBldmxpc3RlbmVyLmxlbmd0aCk7XG59XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24gbGlzdGVuZXJzKHR5cGUpIHtcbiAgcmV0dXJuIF9saXN0ZW5lcnModGhpcywgdHlwZSwgdHJ1ZSk7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJhd0xpc3RlbmVycyA9IGZ1bmN0aW9uIHJhd0xpc3RlbmVycyh0eXBlKSB7XG4gIHJldHVybiBfbGlzdGVuZXJzKHRoaXMsIHR5cGUsIGZhbHNlKTtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICBpZiAodHlwZW9mIGVtaXR0ZXIubGlzdGVuZXJDb3VudCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBlbWl0dGVyLmxpc3RlbmVyQ291bnQodHlwZSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGxpc3RlbmVyQ291bnQuY2FsbChlbWl0dGVyLCB0eXBlKTtcbiAgfVxufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lckNvdW50ID0gbGlzdGVuZXJDb3VudDtcbmZ1bmN0aW9uIGxpc3RlbmVyQ291bnQodHlwZSkge1xuICB2YXIgZXZlbnRzID0gdGhpcy5fZXZlbnRzO1xuXG4gIGlmIChldmVudHMpIHtcbiAgICB2YXIgZXZsaXN0ZW5lciA9IGV2ZW50c1t0eXBlXTtcblxuICAgIGlmICh0eXBlb2YgZXZsaXN0ZW5lciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIDE7XG4gICAgfSBlbHNlIGlmIChldmxpc3RlbmVyKSB7XG4gICAgICByZXR1cm4gZXZsaXN0ZW5lci5sZW5ndGg7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIDA7XG59XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZXZlbnROYW1lcyA9IGZ1bmN0aW9uIGV2ZW50TmFtZXMoKSB7XG4gIHJldHVybiB0aGlzLl9ldmVudHNDb3VudCA+IDAgPyBSZWZsZWN0Lm93bktleXModGhpcy5fZXZlbnRzKSA6IFtdO1xufTtcblxuLy8gQWJvdXQgMS41eCBmYXN0ZXIgdGhhbiB0aGUgdHdvLWFyZyB2ZXJzaW9uIG9mIEFycmF5I3NwbGljZSgpLlxuZnVuY3Rpb24gc3BsaWNlT25lKGxpc3QsIGluZGV4KSB7XG4gIGZvciAodmFyIGkgPSBpbmRleCwgayA9IGkgKyAxLCBuID0gbGlzdC5sZW5ndGg7IGsgPCBuOyBpICs9IDEsIGsgKz0gMSlcbiAgICBsaXN0W2ldID0gbGlzdFtrXTtcbiAgbGlzdC5wb3AoKTtcbn1cblxuZnVuY3Rpb24gYXJyYXlDbG9uZShhcnIsIG4pIHtcbiAgdmFyIGNvcHkgPSBuZXcgQXJyYXkobik7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgKytpKVxuICAgIGNvcHlbaV0gPSBhcnJbaV07XG4gIHJldHVybiBjb3B5O1xufVxuXG5mdW5jdGlvbiB1bndyYXBMaXN0ZW5lcnMoYXJyKSB7XG4gIHZhciByZXQgPSBuZXcgQXJyYXkoYXJyLmxlbmd0aCk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcmV0Lmxlbmd0aDsgKytpKSB7XG4gICAgcmV0W2ldID0gYXJyW2ldLmxpc3RlbmVyIHx8IGFycltpXTtcbiAgfVxuICByZXR1cm4gcmV0O1xufVxuXG5mdW5jdGlvbiBvYmplY3RDcmVhdGVQb2x5ZmlsbChwcm90bykge1xuICB2YXIgRiA9IGZ1bmN0aW9uKCkge307XG4gIEYucHJvdG90eXBlID0gcHJvdG87XG4gIHJldHVybiBuZXcgRjtcbn1cbmZ1bmN0aW9uIG9iamVjdEtleXNQb2x5ZmlsbChvYmopIHtcbiAgdmFyIGtleXMgPSBbXTtcbiAgZm9yICh2YXIgayBpbiBvYmopIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrKSkge1xuICAgIGtleXMucHVzaChrKTtcbiAgfVxuICByZXR1cm4gaztcbn1cbmZ1bmN0aW9uIGZ1bmN0aW9uQmluZFBvbHlmaWxsKGNvbnRleHQpIHtcbiAgdmFyIGZuID0gdGhpcztcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZm4uYXBwbHkoY29udGV4dCwgYXJndW1lbnRzKTtcbiAgfTtcbn1cbiJdfQ==
