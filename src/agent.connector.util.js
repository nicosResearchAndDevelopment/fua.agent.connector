const
    _util  = require('@nrd/fua.core.util'),
    util   = exports = module.exports = {
        ..._util,
        assert: _util.Assert('ids.agent.connector'),
        fetch:  require('node-fetch')
    },
    crypto = require('crypto'),
    events = require('events'),
    http   = require('http'),
    https  = require('https');

util.isKeyId        = util.StringValidator(/^(?:[0-9A-F]{2}:){20}keyid(?::[0-9A-F]{2}){20}$/);
util.isKeyObject    = (value) => value instanceof crypto.KeyObject;
util.isPrivateKey   = (value) => util.isKeyObject(value) && value.type === 'private';
util.isPublicKey    = (value) => util.isKeyObject(value) && value.type === 'public';
util.isHttpAgent    = (value) => value instanceof http.Agent;
util.isHttpOptions  = (value) => util.isObject(value);
util.isHttpsAgent   = (value) => value instanceof https.Agent;
util.isHttpsOptions = (value) => util.isObject(value) && ('key' in value);

util.createPrivateKey   = crypto.createPrivateKey;
util.createPublicKey    = crypto.createPublicKey;
util.createEventEmitter = () => new events.EventEmitter();
util.createHttpAgent    = (options) => new http.Agent(options);
util.createHttpsAgent   = (options) => new https.Agent(options);

module.exports = Object.freeze(util);
