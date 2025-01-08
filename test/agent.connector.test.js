const
  { describe, test } = require('mocha'),
  expect = require('expect'),
  ConnectorAgent = require('../src/agent.connector.js');

describe('agent.connector', function () {

  test('develop', function() {
    console.log(ConnectorAgent);
  })

});
