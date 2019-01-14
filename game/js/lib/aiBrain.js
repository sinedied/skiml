var Brain = require('brain.js');

(function (global) {
	function AiBrain () {
        this.aiBrainJs = undefined;
        this.step = 0;

        this.trainingVectors = []; // TODO we should use stream input for brainjs

        this.LEARNING_STEP_COUNT = 100;
        this.REPLAY_STEP_COUNT = 300;

        this.reset = function() {
            this.aiBrainJs = undefined;
            this.step = 0;
            console.log('aiBrain: reset');
        }

        this.cycle = function(mouseMapPosition, staticObjects, movingObjects, player) {
            let currentSituation = this.calcSituation(staticObjects, movingObjects, player);

            if (this.REPLAY_STEP_COUNT < this.step) {
                // permet d'arreter les logs
                this.aiBrainJs = undefined;
                return currentSituation;
            }

            if (this.step < this.LEARNING_STEP_COUNT) {
                console.log('aiBrain: record');
                // we learn (sampled learning, only when there is change in the inputs)
                // TODO
                
                console.log("situation: ", currentSituation);

                this.trainingVectors.push({
                    inputs: currentSituation,
                    outputs: { angle: this.getAngle(mouseMapPosition, player.mapPosition) }
                });
            } else if (this.step < this.REPLAY_STEP_COUNT) {
                if (!this.aiBrainJs) {
                    console.log('aiBrain: train AI');
                    // we create and train the IA
                    // TODO

                    					// on calcule la fonction
					const config = {
						binaryThresh: 0.5,
						hiddenLayers: [3],     // array of ints for the sizes of the hidden layers in the network
						activation: 'sigmoid',  // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
						leakyReluAlpha: 0.01   // supported for activation type 'leaky-relu'
					};

					// create a simple feed forward neural network with backpropagation
                    this.aiBrainJs = new Brain.NeuralNetwork(config);

					if (this.aiBrainJs) {
						// train the IA
						let dataForTraining = this.trainingVectors.map(x => {
							return {input: x.inputs.convert(), output: [x.outputs.angle]};
						})
                        // utiliser l'API de streaming

                        // echantillonnage?

                        // faire un pre apprentissage base sur du preprocessing (transfert de learning)
							

						console.log("inputs: ", dataForTraining);

                        this.aiBrainJs.train(dataForTraining);
                          
                        // pour le test
                        // this.aiBrainJs.train([{ input: [0, 0], output: [0] },
                        // { input: [0, 1], output: [1] },
                        // { input: [1, 0], output: [1] },
                        // { input: [1, 1], output: [0] }]);
					}
					
                    // alert the user about the switch to the replay mode
                    // TODO
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
           
            if (currentSituation && this.aiBrainJs) {
                // we return the command calculated by the IA
                // TODO
                console.log('aiBrain: getAICommand');

                const output = this.aiBrainJs.run(currentSituation.convert());
                console.log("output", output);
                const angle = output * Math.PI / 2;
                console.log("angle", angle);
                let mouseMapPosition = [0,0];
                let delta = {x: 100 * Math.sin(angle), y: 100 * Math.cos(angle)};
                console.log("delta", delta);
                mouseMapPosition[0] = player.canvasX + delta.x;
                mouseMapPosition[1] = player.canvasX + delta.y;
                console.log("mouseMapPosition", mouseMapPosition);
                return {mouseMapPosition: mouseMapPosition};
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
					let result = this.envInputs.flatMap(x => [x.x / 2000, x.y / 2000, x.type]); // 2000 pour normaliser a la hache
					// FPETODO normaliser entre 0 et 1
					result.push(this.playerInputs.dir);
					return result;
				}
			}
            // TODO ajouter la vitesse du skier comme entree??

            // FPETODO player.direction est parfois undefined ...
			iaInputs.playerInputs = { dir: 0 }; // pour test train player.direction };

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
            iaInputs.envInputs.slice(0, 5);
            
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