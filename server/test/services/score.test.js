const app = require('../../src/app');

describe('\'score\' service', () => {
  it('registered the service', () => {
    const service = app.service('scores');
    expect(service).toBeTruthy();
  });
});
