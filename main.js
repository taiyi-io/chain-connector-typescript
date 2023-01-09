import { hexToBin, isHex } from '@bitauth/libauth';
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
    accessID = '';
    privateKey = [];
    apiBase = '';
    domain = '';
    nonce = '';
    sessionID = '';
    timeout = 0;
    localIP = '';
    constructor(accessID, privateKey) {
        this.accessID = accessID;
        this.privateKey = privateKey;
        this.apiBase = '';
        this.domain = '';
        this.nonce = '';
        this.sessionID = '';
        this.timeout = 0;
        this.localIP = '';
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
        this.apiBase = 'http://' + host + ':' + port + '/api/v' + APIVersion;
        this.domain = domainName;
        this.nonce = this.newNonce();
        const now = new Date();
        const timestamp = now.toISOString();
        const signagureAlgorithm = signatureMethodEd25519;
        const signatureContent = {
            access: this.accessID,
            timestamp: timestamp,
            nonce: this.nonce,
            signature_algorithm: signagureAlgorithm,
        };
        const signature = this.base64Signature(signatureContent);
        const requestData = {
            id: this.accessID,
            nonce: this.nonce,
        };
        var headers = new Headers();
        headers.append(headerNameTimestamp, timestamp);
        headers.append(headerNameSignatureAlgorithm, signagureAlgorithm);
        headers.append(headerNameSignature, signature);
        const { session, timeout, address } = await this.rawRequest('post', '/sessions/', requestData);
        this.sessionID = session;
        this.timeout = timeout;
        this.localIP = address;
        return;
    }

    async activate(){
        const url = this.mapToAPI('/sessions/');
        return this.doRequest(('put', url));
    }

    newNonce() {
        const nonceLength = 16;
        return Strings.random(nonceLength);
    }

    base64Signature(obj) {
        const content = JSON.stringify(obj);
        const signed = ed25519.sign(content, this.privateKey);
        return btoa(signed);
    }

    async rawRequest(method, path, headers, payload) {
        const url = this.mapToAPI(path);
        headers.append(headerContentType, contentTypeJSON);
        var options = {
            method: method,
            headers: headers,
        }
        if (nil !== payload) {
            options.body = JSON.stringify(payload);
        }
        const req = new Request(url, options);
        return this.getResult(req);
    }

    async parseResponse(request) {
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

    async getResult(request) {
        var payload = await this.parseResponse(request);
        return payload[payloadPathData];
    }

    async doRequest(method, url){

    }

    async doRequestWithPayload(method, url, payload){
        
    }

    async fetchResponse(method, url){

    }

    async fetchResponseWithPayload(method, url, payload){
        
    }

    mapToAPI(path) {
        return this.apiBase + path;
    }

    mapToDomain(path) {
        return this.apiBase + '/domains/' + this.domain + path;
    }
}