const
    path         = require('path'),
    crypto       = require("crypto"),
    EventEmitter = require("events"),
    //
    util         = require('@nrd/fua.core.util'),
    DAPSClient   = require('@nrd/fua.ids.client.daps')
;

class Connector extends EventEmitter {

    #id          = '';
    #SKIAKI      = '';
    #privateKey  = null;
    #daps        = new Map();
    #dapsClients = new Map();

    constructor({
                    'id':         id,
                    'SKIAKI':     SKIAKI,
                    'privateKey': privateKey,
                    'DAPS':       DAPS = {'default': undefined}
                }) {

        super();  // REM : EventEmitter

        if (!id)
            throw({'message': `ids.agent.Connector : id is missing.`});
        this.#id = id;

        if (!SKIAKI)
            throw({'message': `ids.agent.Connector : SKIAKI is missing.`});
        this.#SKIAKI = SKIAKI;

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

    get SKIAKI() {
        return this.#SKIAKI;
    };

    getClient({'daps': daps = 'default'}) {
        try {
            if (!this.#daps.has(daps))
                throw new Error(`ids.agent.Connector : daps (${daps}) not found`);
            if (!this.#dapsClients.has(daps))
                this.#dapsClients.set(daps, new DAPSClient({
                    dapsUrl:    this.#daps.get(daps),
                    SKIAKI:     this.#SKIAKI,
                    privateKey: this.#privateKey
                }));
            return this.#dapsClients.get(daps);
        } catch (jex) {
            throw jex;
        } // try
    } // getClient

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
