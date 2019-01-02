// Initializes the `scores` service on path `/scores`
const createService = require('feathers-nedb');
const createModel = require('../../models/scores.model');
const hooks = require('./scores.hooks');

module.exports = function (app) {
  const Model = createModel(app);

  const options = {
    Model,
    multi: false
  };

  // Initialize our service with any options it requires
  app.use('/scores', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('scores');

  service.hooks(hooks);
};
