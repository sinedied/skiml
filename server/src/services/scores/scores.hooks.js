function mapIdOnWrite(context) {
  const id = context.data.playerId;
  if (id == null) {
    throw new Error('playerId must be set');
  }
  context.id = id;
  context.data._id = id;
  delete context.data.playerId;
  return context;
}

function mapIdOnRead(context) {
  if (Array.isArray(context.result)) {
    context.result.forEach(score => {
      score.playerId = score._id;
      delete score._id;
      return score;
    });
  } else if (context.result) {
    context.result.playerId = context.result._id;
    delete context.result._id;
  }
}

function sortByScore(context) {
  if (Array.isArray(context.result)) {
    context.result.sort((a, b) => b.score - a.score);
  }
}

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [mapIdOnWrite],
    update: [mapIdOnWrite],
    patch: [mapIdOnWrite],
    remove: []
  },

  after: {
    all: [],
    find: [mapIdOnRead, sortByScore],
    get: [mapIdOnRead],
    create: [mapIdOnRead],
    update: [mapIdOnRead],
    patch: [mapIdOnRead],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
