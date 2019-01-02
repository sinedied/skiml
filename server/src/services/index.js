const scores = require('./scores/scores.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(scores);
};
