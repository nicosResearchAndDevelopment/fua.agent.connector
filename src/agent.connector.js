const
    util        = require('./agent.connector.util.js'),
    ServerAgent = require('@nrd/fua.agent.server'),
    DAPSClient  = require('@nrd/fua.ids.client.daps');

class ConnectorAgent extends ServerAgent {

    #httpAgent = null;

    #keyId      = '';
    #privateKey = null;
    #publicKey  = null;

    #dapsClients = new Map();

    async initialize(options = {}) {
        await super.initialize(options);

        if (util.isHttpOptions(options.server)) {
            this.#httpAgent = util.isHttpsOptions(options.server)
                ? util.createHttpsAgent(options.server)
                : util.createHttpAgent(options.server);
        } else if (util.isHttpOptions(options.client)) {
            this.#httpAgent = util.isHttpsOptions(options.client)
                ? util.createHttpsAgent(options.client)
                : util.createHttpAgent(options.client);
        }

        if (options.connector) {
            const
                keyId      = options.connector.keyId,
                privateKey = options.connector.privateKey || util.createPrivateKey(options.connector.key),
                publicKey  = options.connector.publicKey || util.createPublicKey(options.connector.pub);

            util.assert(util.isKeyId(keyId), 'expected keyId to be be a SKI:AKI key identifier');
            util.assert(util.isPrivateKey(privateKey), 'expected privateKey to be a private KeyObject');
            util.assert(util.isPublicKey(publicKey), 'expected publicKey to be a public KeyObject');

            this.#keyId      = keyId;
            this.#privateKey = privateKey;
            this.#publicKey  = publicKey;
        }

        if (options.daps) {
            util.assert(this.#keyId, 'expected a connector key to be defined');
            const fixedOptions = {SKIAKI: this.#keyId, privateKey: this.#privateKey};
            if (this.#httpAgent) fixedOptions.requestAgent = this.#httpAgent;
            for (let [clientId, clientOptions] of Object.entries(options.daps)) {
                if (util.isString(clientOptions)) clientOptions = {dapsUrl: clientOptions};
                util.assert(util.isString(clientOptions.dapsUrl), 'expected dapsUrl to be a string');
                const dapsClient = this.#dapsClients.get(clientId)
                    || this.#dapsClients.get(clientOptions.dapsUrl)
                    || new DAPSClient({...clientOptions, ...fixedOptions});
                this.#dapsClients.set(clientId, dapsClient);
                this.#dapsClients.set(clientOptions.dapsUrl, dapsClient);
            }
            util.assert(this.#dapsClients.has('default'), 'expected DAPS default to be configured');
        }

        return this;
    }

    get keyId() {
        return this.#keyId;
    }

    get publicKey() {
        return this.#publicKey;
    }

    createJWK() {
        return Object.assign(
            this.#publicKey.export({format: 'jwk'}),
            {kid: this.#keyId}
        );
    }

    createSelfDescription() {
        return {
            issuer: this.uri
            // TODO
        };
    }

    getDAPSClient(clientId = 'default') {
        util.assert(this.#dapsClients.has(clientId), 'expected DAPS ' + clientId + ' to be preconfigured');
        return this.#dapsClients.get(clientId);
    }

    async getDAT({daps = 'default', tweak_dat = false, refresh = false}) {
        const
            client  = this.getDAPSClient(daps),
            options = {tweak_dat},
            dat     = refresh
                ? await client.fetchDAT(options)
                : await client.getDat(options)
        return dat;
    }

    async fetch(url, {...options} = {}) {
        const access_token = await this.getDAT(options);
        options.headers    = {
            ...options.headers,
            'Authorization': 'Bearer ' + access_token
        }
        if (this.#httpAgent) options.agent = this.#httpAgent;
        const response = await util.fetch(url, options);
        if (!response.ok) throw new util.HTTPResponseError(response);
        return response;
    }

}

module.exports = ConnectorAgent;
