const NeDB = require('nedb');
const path = require('path');

/*
 Schema:
 {
   "playerId": "number",  // mapped to _id via hooks (NeDB limitation)
   "score": "number"
 }
*/

module.exports = function (app) {
  const dbPath = app.get('nedb');
  const Model = new NeDB({
    filename: path.join(dbPath, 'scores.db'),
    autoload: true
  });

  return Model;
};
