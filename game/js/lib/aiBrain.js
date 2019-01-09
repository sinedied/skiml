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