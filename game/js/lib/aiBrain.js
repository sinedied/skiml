var tf = require('@tensorflow/tfjs');

(function (global) {
	function AiBrain () {;
	    this.model = undefined
        this.step = 0;
        this.useMouse = undefined;

        this.trainingVectors = []; // TODO we should use stream input for brainjs

        this.LEARNING_STEP_COUNT = 1000;
        this.REPLAY_STEP_COUNT = 10000;
        this.MODEL_INPUT_SIZE = 16
        if (this.useMouse) {
            this.MODEL_OUTPUT_SIZE = 1
        } else {
            this.MODEL_OUTPUT_SIZE = 4
        }

        this.reset = function() {
            this.model = undefined;
            this.step = 0;

            ('aiBrain: reset');
        }

        this.buildModel = function() {
            this.model = tf.sequential();
            this.model.add(tf.layers.dense({units: 10, inputShape: [this.MODEL_INPUT_SIZE], activation:'tanh'}));

            if (this.useMouse) {
                last_activation = 'sigmoid'
                loss = 'meanSquaredError'
            } else {
                last_activation = 'softmax'
                loss = 'categoricalCrossentropy'
            }

           this.model.add(tf.layers.dense({units: this.MODEL_OUTPUT_SIZE, activation: last_activation}));
           this.model.compile({loss: loss, optimizer: 'adam'});
        }

        this.trainModel = function(inputs, outputs, nb_examples) {
            const inputTensors = tf.tensor2d(inputs, [nb_examples, this.MODEL_INPUT_SIZE])
            const outputTensors = tf.tensor2d(outputs, [nb_examples, this.MODEL_OUTPUT_SIZE])
            this.model.fit(inputTensors, outputTensors, {epochs: 10})
        }

        this.predictModel = function(inputs) {
            const inputTensors = tf.tensor2d(inputs, [1, this.MODEL_INPUT_SIZE]);
            modelPrediction = this.model.predict(inputTensors);
            modelPrediction.print();
            if (this.useMouse) {
                return modelPrediction.get(0, 0);
            } else {
                return [modelPrediction.get(0, 0), // match skier.CMD_... enum
                    modelPrediction.get(0, 1),
                    modelPrediction.get(0, 2),
                    modelPrediction.get(0, 3)];
            }
        }

        this.cycle = function(mouseMapPosition, staticObjects, movingObjects, player) {
            let currentSituation = this.calcSituation(staticObjects, movingObjects, player);

            if (this.REPLAY_STEP_COUNT < this.step) {
                // permet d'arreter les logs
                this.model = undefined;
                return currentSituation;
            }

            if (this.step < this.LEARNING_STEP_COUNT) {
                console.log('aiBrain: record');
                // we learn (sampled learning, only when there is change in the inputs)
                // TODO
                 
                console.log("situation: ", currentSituation);

                if (this.useMouse) {
                    this.trainingVectors.push({
                        inputs: currentSituation,
                        outputs: this.getAngle(mouseMapPosition, player.mapPosition)
                    });
                } else {
                    let outputs = [0.0, 0.0, 0.0, 0.0];
                    outputs[player.lastCmd] = 1.0;
                    console.log('player.lastCmd: ', player.lastCmd);
                    if (currentSituation.playerInputs.dir !== 0 // east
                        && currentSituation.playerInputs.dir !== 6) { // west
                        this.trainingVectors.push({
                            inputs: currentSituation,
                            outputs: outputs
                        });
                    }
                }
            } else if (this.step < this.REPLAY_STEP_COUNT) {
                if (!this.model) {
                    console.log('aiBrain: train AI');
                    alert('It\'s up to your AI...');
                    // we create and train the IA
                    // TODO

                    this.buildModel();

					if (this.model) {
						// train the IA
						let dataForTraining = this.trainingVectors.map(x => {
							return {input: x.inputs.convert(), output: [x.outputs]};
						})
                        // utiliser l'API de streaming

                        // echantillonnage?

                        // faire un pre apprentissage base sur du preprocessing (transfert de learning)

                        this.trainModel(dataForTraining.flatMap(e => e.input),
                        dataForTraining.flatMap(e => e.output),
                        dataForTraining.length);
					}
                }
                console.log('aiBrain: replay');
                // we replay via getAICommand
            } else {
                // go to the score part
                this.processScore(player);
            }
            this.step++;
            
            return currentSituation;
        }

        this.getAICommand = function(player, currentSituation) {
           
            if (currentSituation && this.model) {

                if (this.useMouse) {
                    // we return the command calculated by the IA
                    // TODO
                    console.log('aiBrain: getAICommand');

                    const output = this.predictModel(currentSituation.convert())
                    console.log("output", output);
                    const angle = output * Math.PI / 2;
                    console.log("angle", angle);
                    let mouseMapPosition = [0, 0];
                    let delta = { x: 100 * Math.sin(angle), y: 100 * Math.cos(angle) };
                    console.log("delta", delta);
                    mouseMapPosition[0] = player.canvasX + delta.x;
                    mouseMapPosition[1] = player.canvasX + delta.y;
                    console.log("mouseMapPosition", mouseMapPosition);
                    return { mouseMapPosition: mouseMapPosition };
                } else {
                    return this.predictModel(currentSituation.convert());
                }
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
                this.processScore(player);
            }
        }

        this.processScore = function(player) {
            console.log('aiBrain: process score');
            alert('YOUR SCORE IS: ');
            // TODO

            // FPETODO en mode dev, on veut pas que ca recommence... this.reset();
            
            // TODO game must be also reset
        }

        this.calcSituation = function(staticObjects, movingObjects, player)
        {
			let iaInputs = {
				envInputs: [],
				playerInputs: {},
				dummyInput: {x: 0, y: 0, type: 0, dist: 0},
				convert: function() {
					let result = this.envInputs.flatMap(x => [x.x, x.y, x.type]); // normaliser a la hache??
					result.push(this.playerInputs.dir);
					return result;
				}
			}
            // TODO ajouter la vitesse du skier comme entree??

            const directionLabelToNum = {
                east: 0,
                esEast: 1,
                sEast: 2,
                south: 3,
                sWest: 4,
                wsWest: 5,
                west: 6,
                south: 7 
            };
			iaInputs.playerInputs = { dir: directionLabelToNum[player.getMyDiscreteDirection()] };

			staticObjects.each(obj => {
				if (!obj.deleted) {
                    let delta = {x: obj.canvasX - player.mapPosition[0],
                                 y: obj.canvasY - player.mapPosition[1]};
					iaInputs.envInputs.push({ x: delta.x, 
						y: delta.y,
                        type: 0,  // comment typer les objets?
                        dist: Math.abs(delta.x * delta.x + delta.y * delta.y)
                    });
				}
			})
			movingObjects.each(obj => {
				if (!obj.deleted) {
                    let delta = {x: obj.canvasX - player.mapPosition[0],
                                 y: obj.canvasY - player.mapPosition[1]};
					iaInputs.envInputs.push({ x: delta.x, 
						y: delta.y,
						type: 1,  // comment typer les objets?
                        dist: Math.abs(delta.x * delta.x + delta.y * delta.y)
                    });
				}
			})
            
            // we take 5 nearest objects
            iaInputs.envInputs.sort((a, b) => a.dist - b.dist);
            iaInputs.envInputs = iaInputs.envInputs.slice(0, 5);
            
			// we complete up to 5
			for (let i = 0; i < 5; ++i) {
				if (!iaInputs.envInputs[i]) {
					iaInputs.envInputs[i] = iaInputs.dummyInput;
				}
            }
            
            return iaInputs;
        } 

        this.getAngle = function(mouseMapPosition, playerMapPosition) {
            let relativeMousePos = [mouseMapPosition[0] - playerMapPosition[0],
                                    mouseMapPosition[1] - playerMapPosition[1]];
            return relativeMousePos[1] !== 0 
                ? Math.atan(relativeMousePos[0] / relativeMousePos[1]) / (Math.PI / 2) : 0;
        }
    }

    global.AiBrain = AiBrain;
})(this);

if (typeof module !== 'undefined') {
	module.exports = this.AiBrain;
}