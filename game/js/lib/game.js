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

			let currentSituation = aiBrain.cycle(mouseMapPosition, staticObjects, movingObjects, player);

			if (!player.isJumping) {
				if (player.useMouse) {
					let aiCommand = aiBrain.getAICommand(player, currentSituation);
					if (aiCommand) {
						mouseMapPosition = aiCommand.mouseMapPosition;
					}
					player.setMapPositionTarget(mouseMapPosition[0], mouseMapPosition[1]);
				} else {
					let aiCommand = aiBrain.getAICommand(player, currentSituation);
					if (aiCommand) {
						let maxVal = -1;
						let maxIndex = -1;
						aiCommand.forEach((x, i) => { if (i > 0 && (x > maxVal || maxVal === -1)) {maxIndex = i; maxVal = x} });
						const directionLabelToNum = {
                                        0:"east",
                                        1:"esEast",
                                        2:"sEast",
                                        3:"south",
                                        4:"sWest",
                                        5:"wsWest",
                                        6:"west",
                                        7:"south"
                                    };
                        player.forceSetDiscreteDirection(directionLabelToNum[maxIndex])
					}

					// use player.mapPosition[0] inhibit mouse handling while preserving move
					player.setMapPositionTarget(player.mapPosition[0], mouseMapPosition[1]);
				}
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
			player.lastCmd = player.CMD_STRAIGHT;
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