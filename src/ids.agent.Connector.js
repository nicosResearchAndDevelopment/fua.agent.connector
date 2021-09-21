const
    path         = require('path'),
    crypto       = require("crypto"),
    EventEmitter = require("events"),
    //
    util         = require('@nrd/fua.core.util'),
    {ClientDaps} = require(path.join(util.FUA_JS_LIB, 'ids/ids.client.daps/src/ids.client.DAPS.beta.js'))
;

class Connector extends EventEmitter {

    #id         = undefined;
    #privateKey = undefined;
    #daps       = new Map();

    constructor({
                    'id':         id,
                    'privateKey': privateKey,
                    'DAPS':       DAPS = {'default': undefined}
                }) {

        super();  // REM : EventEmitter

        if (!id)
            throw({'message': `ids.agent.Connector : id is missing.`});
        this.#id = id;

        if (!privateKey)
            throw({'message': `ids.agent.Connector : privateKey is missing.`});
        this.#privateKey = privateKey;

        if (!DAPS.default)
            throw({'message': `ids.agent.Connector : missing default DAPS.`});
        this.#daps.set('default', DAPS.default);

        Object.defineProperties(this, {
            'id': {value: this.#id, enumerable: true}
        }); // Object.defineProperties(this)

        if (this['__proto__']['constructor']['name'] === "Connector") {
            throw(new Error(`ids.agent.Connector : Connector can NOT be instantiated directly.`))
        } // if ()

        //let
        //    semaphore = setTimeout(doit, 1000),
        //    that = this
        //
        //;
        //
        //function doit() {
        //    let timestamp = (new Date).toISOString();
        //    that['emit']('idle', {'timestamp': timestamp});
        //    semaphore = setTimeout(doit, 1000);
        //} // doit()

        return this;

    } // constructor()

    async selfDescription() {
        try {
            let selfDescription_ = {
                '@type': "ids:SelfDescription"
            };
            return selfDescription_;
        } catch (jex) {
            throw(jex);
        } // try
    } // selfDescription

    async produceDatRequestToken({'daps': daps = undefined}) {
        try {
            let requestToken;
            if (!daps)
                daps = this.#daps.get('default');
            return requestToken;
        } catch (jex) {
            throw(jex);
        } // try
    } // produceDatRequestToken()

    async getDAT({'daps': daps = undefined}) {
        try {
            let DAT;
            if (!daps)
                daps = this.#daps.get('default');
            let requestToken = this.produceDatRequestToken({'daps': daps});
            // TODO : fetch
            return DAT;
        } catch (jex) {
            throw(jex);
        } // try
    } // getDAT()

} // Connector

exports.Connector = Connector;