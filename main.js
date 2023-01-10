import { hexToBin, isHex } from '@bitauth/libauth';
import CryptoJS from 'crypto-js';
import Strings from '@supercharge/strings/dist';
import ed25519 from '@noble/ed25519';

let npmPackage = require('./package.json');

const SDKVersion = npmPackage.version;
const APIVersion = '1';
const projectName = 'Taiyi';
const headerNameSession = projectName + '-Session';
const headerNameTimestamp = projectName + '-Timestamp';
const headerNameSignature = projectName + '-Signature';
const headerNameSignatureAlgorithm = projectName + '-SignatureAlgorithm';
const defaultDomainName = 'system';
const defaultDomainHost = "localhost";


const signatureMethodEd25519 = "ed25519";
const headerContentType = "Content-Type";
const contentTypeJSON = "application/json";
const payloadPathErrorCode = "error_code";
const payloadPathErrorMessage = "message";
const payloadPathData = "data";
const keyEncodeMethodEd25519Hex = "ed25519-hex";
const defaultKeyEncodeMethod = keyEncodeMethodEd25519Hex;


export function NewClientFromAccess(data) {
    const { id, encode_method, private_key } = data;
    if (defaultKeyEncodeMethod === encode_method) {
        if (!isHex(private_key)) {
            throw new Error('invalid key format');
        }
        var decoded = hexToBin(private_key);
        return NewClient(id, decoded);
    } else {
        throw new Error('unsupport encode method: ' + encode_method);
    }
}

export function NewClient(accessID, privateKey) {
    return new TaiyiClient(accessID, privateKey);
}

class TaiyiClient {
    #_accessID = '';
    #_privateKey = [];
    #_apiBase = '';
    #_domain = '';
    #_nonce = '';
    #_sessionID = '';
    #_timeout = 0;
    #_localIP = '';
    constructor(accessID, privateKey) {
        this.#_accessID = accessID;
        this.#_privateKey = privateKey;
        this.#_apiBase = '';
        this.#_domain = '';
        this.#_nonce = '';
        this.#_sessionID = '';
        this.#_timeout = 0;
        this.#_localIP = '';
    }

    getVersion() {
        return SDKVersion;
    }

    async connect(host, port) {
        return this.connectToDomain(host, port, defaultDomainName);
    }

    async connectToDomain(host, port, domainName) {
        if ('' === host) {
            host = defaultDomainHost;
        }
        if ('' === domainName) {
            throw new Error('domain name omit');
        }
        if (port <= 0 || port > 0xFFFF) {
            throw new Error('invalid port ' + port);
        }
        this.#_apiBase = 'http://' + host + ':' + port + '/api/v' + APIVersion;
        this.#_domain = domainName;
        this.#_nonce = this.#newNonce();
        const now = new Date();
        const timestamp = now.toISOString();
        const signagureAlgorithm = signatureMethodEd25519;
        const signatureContent = {
            access: this.#_accessID,
            timestamp: timestamp,
            nonce: this.#_nonce,
            signature_algorithm: signagureAlgorithm,
        };
        const signature = this.#base64Signature(signatureContent);
        const requestData = {
            id: this.#_accessID,
            nonce: this.#_nonce,
        };
        var headers = new Headers();
        headers.append(headerNameTimestamp, timestamp);
        headers.append(headerNameSignatureAlgorithm, signagureAlgorithm);
        headers.append(headerNameSignature, signature);
        const { session, timeout, address } = await this.#rawRequest('post', '/sessions/', requestData);
        this.#_sessionID = session;
        this.#_timeout = timeout;
        this.#_localIP = address;
        return;
    }

    async activate(){
        const url = this.#mapToAPI('/sessions/');
        return this.#doRequest(('put', url));
    }

    /**
     * Get Current Chain Status
     * 
     * @returns {
     *  world_version,
     *  block_height,
     *  previous_block,
     *  genesis_block,
     *  allocated_transaction_id,
     * } return status object
    async getStatus(){
        const url = this.#mapToDomain('/status');
        return this.#fetchResponse('get', url);
    }

    /**
     * Return list of current schemas
     * 
     * @param {int} queryStart start offset when querying
     * @param {int} maxRecord max records could returne
     * @returns {
     *  schemas,
     *  limit,
     *  offset,
     *  total
     * }
     */
    async querySchemas(queryStart, maxRecord){
        const url = this.#mapToDomain('schemas/');
        const condition = {
            offset: queryStart,
            limit: maxRecord,
        }
        return this.#fetchResponseWithPayload('post', url, condition);
    }

    #newNonce() {
        const nonceLength = 16;
        return Strings.random(nonceLength);
    }

    #base64Signature(obj) {
        const content = JSON.stringify(obj);
        const signed = ed25519.sign(content, this.#_privateKey);
        return btoa(signed);
    }

    async #rawRequest(method, path, headers, payload) {
        const url = this.#mapToAPI(path);
        headers.append(headerContentType, contentTypeJSON);
        var options = {
            method: method,
            headers: headers,
        }
        if (nil !== payload) {
            options.body = JSON.stringify(payload);
        }
        const req = new Request(url, options);
        return this.#getResult(req);
    }

    async #peekRequest(method, url){
        var request = this.#signatureRequest(method, url, null);        
        var resp = await fetch(request);
        return resp.ok;
    }

    async #validateResult(request){
       this.#parseResponse(request);
    }

    async #parseResponse(request) {
        var resp = await fetch(request);
        if (!resp.ok()) {
            throw new Error('fetch result failed with status ' + resp.status + ': ' + resp.statusText);
        }
        var payload = await resp.json();
        if (0 != payload[payloadPathErrorCode]) {
            throw new Error('fetch faile: ' + payload[payloadPathErrorMessage]);
        }
        return payload;
    }

    async #getResult(request) {
        var payload = await this.#parseResponse(request);
        return JSON.parse(payload[payloadPathData]);
    }

    async #doRequest(method, url){
        var request = this.#signatureRequest(method, url, null);
        return this.#validateResult(request);
    }

    async #doRequestWithPayload(method, url, payload){
        var request = this.#signatureRequest(method, url, payload);
        return this.#validateResult(request);
    }

    async #fetchResponse(method, url){
        var request = this.#signatureRequest(method, url, null);
        return this.#getResult(request)
    }

    async #fetchResponseWithPayload(method, url, payload){
        var request = this.#signatureRequest(method, url, payload);
        return this.#getResult(request)
    }

    #signatureRequest(method, url, payload){
        const urlObject = new URL(url);
        const now = new Date();
        const timestamp = now.toISOString();
        var signatureContent = {
            id: this.#_sessionID,
            method: method,
            url: urlObject.pathname,
            body: '',
            access: this.#_accessID,
            timestamp: timestamp,
            nonce: this.#_nonce,
            signature_algorithm: signatureMethodEd25519,
        }
        var options = {
            method: method
        };
        let bodyContent = '';
        if (payload){
            const headerInit = {
                headerContentType: contentTypeJSON,
            };
            var headers = new Headers(headerInit);
            bodyContent = JSON.stringify(payload);
            options.body = bodyContent;
            options.headers = headers;
        }
        var request = new Request(url, options);
        if ('post' === method || 'put' === method || 'delete' === method || 'patch' === method){
            var hash = CryptoJS.SHA256(bodyContent);
            signatureContent.body = CryptoJS.enc.Base64.stringify(hash);
        }
        const signature = this.#base64Signature(signatureContent);
        request.headers.append(headerNameSession, this.#_sessionID);
        request.headers.append(headerNameTimestamp, timestamp);
        request.headers.append(headerNameSignatureAlgorithm, signatureMethodEd25519);
        request.headers.append(headerNameSignature, signature);
        return request;
    }

    #mapToAPI(path) {
        return this.#_apiBase + path;
    }

    #mapToDomain(path) {
        return this.#_apiBase + '/domains/' + this.#_domain + path;
    }
}