const
    path         = require('path'),
    crypto       = require("crypto"),
    EventEmitter = require("events"),
    //
    util         = require('@nrd/fua.core.util'),
    uuid         = require('@nrd/fua.core.uuid'),
    DAPSClient   = require('@nrd/fua.ids.client.daps')
    //region ERROR CODES

    //endregion ERROR CODES
;

//region ERROR
const
    ERROR_CODE_ErrorConnectorDapsNotFound = "ids.agent.Connector.ERROR.1"
; // const
class ErrorConnectorDapsNotFound extends Error {
    constructor({id: id, prov: prov, daps: daps}) {
        super(`ids.agent.Connector : <${id}> : daps <${daps}> not found.`);
        this.id   = `${id}error/${uuid.v4()}`;
        this.code = ERROR_CODE_ErrorConnectorDapsNotFound;
        this.prov = prov;
        Object.freeze(this);
    }
}

//endregion ERROR

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
            throw({'message': `ids.agent.Connector : <${this.#id}> : privateKey is missing.`});
        this.#privateKey = privateKey;

        if (!DAPS.default)
            throw({'message': `ids.agent.Connector : <${this.#id}> : missing default DAPS.`});
        this.#daps.set('default', DAPS.default);

        Object.defineProperties(this, {
            'id': {value: this.#id, enumerable: true}
        }); // Object.defineProperties(this)

        if (this['__proto__']['constructor']['name'] === "Connector") {
            throw(new Error(`ids.agent.Connector : <${this.#id}> : Connector can NOT be instantiated directly.`))
        } // if ()

        //region TEST
        //region TEST : ERROR
        //let error;
        //error = new ErrorConnectorDapsNotFound({
        //    id:   this.#id,
        //    prov: 'ids.agent.Connector.constructor',
        //    daps: this.#daps.get('default')
        //});
        //debugger;
        //endregion TEST : ERROR
        //endregion TEST
        return this;

    } // constructor()

    get SKIAKI() {
        return this.#SKIAKI;
    };

    getClient({'daps': daps = 'default'}) {
        try {
            if (!this.#daps.has(daps))
                throw (new ErrorConnectorDapsNotFound({
                    id:   this.#id,
                    prov: 'ids.agent.Connector.getClient',
                    daps: daps
                }));
            if (!this.#dapsClients.has(daps))
                this.#dapsClients.set(daps, new DAPSClient({
                    dapsUrl:    this.#daps.get(daps),
                    SKIAKI:     this.#SKIAKI,
                    privateKey: this.#privateKey
                }));
            return this.#dapsClients.get(daps);
        } catch (jex) {
            throw(jex);
        } // try
    } // getClient

    async selfDescription() {
        try {
            let selfDescription_ = {
                '@id':   this.#id,
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
