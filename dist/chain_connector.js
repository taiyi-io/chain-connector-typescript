"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _QueryBuilder__filters, _QueryBuilder__since, _QueryBuilder__offset, _QueryBuilder__limit, _QueryBuilder__order, _QueryBuilder__descend, _ChainConnector_instances, _ChainConnector__accessID, _ChainConnector__privateKey, _ChainConnector__apiBase, _ChainConnector__domain, _ChainConnector__nonce, _ChainConnector__sessionID, _ChainConnector__timeout, _ChainConnector__localIP, _ChainConnector__trace, _ChainConnector__request_timeout, _ChainConnector__projectName, _ChainConnector__headerNameSession, _ChainConnector__headerNameTimestamp, _ChainConnector__headerNameSignature, _ChainConnector__headerNameSignatureAlgorithm, _ChainConnector_newNonce, _ChainConnector_base64Signature, _ChainConnector_rawRequest, _ChainConnector_fetchWithTimeout, _ChainConnector_peekRequest, _ChainConnector_validateResult, _ChainConnector_parseResponse, _ChainConnector_getResult, _ChainConnector_doRequest, _ChainConnector_doRequestWithPayload, _ChainConnector_fetchResponse, _ChainConnector_fetchResponseWithPayload, _ChainConnector_prepareOptions, _ChainConnector_mapToAPI, _ChainConnector_mapToDomain;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainConnector = exports.NewConnector = exports.NewConnectorFromAccess = exports.QueryBuilder = exports.FilterOperator = exports.PropertyType = void 0;
const libauth_1 = require("@bitauth/libauth");
const crypto_js_1 = __importDefault(require("crypto-js"));
const dist_1 = __importDefault(require("@supercharge/strings/dist"));
const ed25519 = __importStar(require("@noble/ed25519"));
const SDKVersion = '0.5.0';
const APIVersion = '1';
const defaultProjectName = 'Taiyi';
const defaultDomainName = 'system';
const defaultDomainHost = "localhost";
const signatureEncode = 'base64';
const signatureMethodEd25519 = "ed25519";
const headerContentType = "Content-Type";
const contentTypeJSON = "application/json";
const payloadPathErrorCode = "error_code";
const payloadPathErrorMessage = "message";
const payloadPathData = "data";
const keyEncodeMethodEd25519Hex = 'ed25519-hex';
const defaultKeyEncodeMethod = keyEncodeMethodEd25519Hex;
const defaultTimeoutInSeconds = 3;
var PropertyType;
(function (PropertyType) {
    PropertyType["String"] = "string";
    PropertyType["Boolean"] = "bool";
    PropertyType["Integer"] = "int";
    PropertyType["Float"] = "float";
    PropertyType["Currency"] = "currency";
    PropertyType["Collection"] = "collection";
    PropertyType["Document"] = "document";
})(PropertyType = exports.PropertyType || (exports.PropertyType = {}));
var RequestMethod;
(function (RequestMethod) {
    RequestMethod["GET"] = "GET";
    RequestMethod["PUT"] = "PUT";
    RequestMethod["POST"] = "POST";
    RequestMethod["DELETE"] = "DELETE";
    RequestMethod["HEAD"] = "HEAD";
    RequestMethod["PATCH"] = "PATCH";
})(RequestMethod || (RequestMethod = {}));
var FilterOperator;
(function (FilterOperator) {
    FilterOperator[FilterOperator["Equal"] = 0] = "Equal";
    FilterOperator[FilterOperator["NotEqual"] = 1] = "NotEqual";
    FilterOperator[FilterOperator["GreaterThan"] = 2] = "GreaterThan";
    FilterOperator[FilterOperator["LesserThan"] = 3] = "LesserThan";
    FilterOperator[FilterOperator["GreaterOrEqual"] = 4] = "GreaterOrEqual";
    FilterOperator[FilterOperator["LesserOrEqual"] = 5] = "LesserOrEqual";
})(FilterOperator = exports.FilterOperator || (exports.FilterOperator = {}));
class QueryBuilder {
    constructor() {
        _QueryBuilder__filters.set(this, void 0);
        _QueryBuilder__since.set(this, void 0);
        _QueryBuilder__offset.set(this, void 0);
        _QueryBuilder__limit.set(this, void 0);
        _QueryBuilder__order.set(this, void 0);
        _QueryBuilder__descend.set(this, void 0);
        __classPrivateFieldSet(this, _QueryBuilder__filters, [], "f");
        __classPrivateFieldSet(this, _QueryBuilder__since, '', "f");
        __classPrivateFieldSet(this, _QueryBuilder__offset, 0, "f");
        __classPrivateFieldSet(this, _QueryBuilder__limit, 0, "f");
        __classPrivateFieldSet(this, _QueryBuilder__order, '', "f");
        __classPrivateFieldSet(this, _QueryBuilder__descend, false, "f");
    }
    PropertyEqual(propertyName, value) {
        __classPrivateFieldGet(this, _QueryBuilder__filters, "f").push({
            property: propertyName,
            operator: FilterOperator.Equal,
            value: value
        });
        return this;
    }
    PropertyNotEqual(propertyName, value) {
        __classPrivateFieldGet(this, _QueryBuilder__filters, "f").push({
            property: propertyName,
            operator: FilterOperator.NotEqual,
            value: value
        });
        return this;
    }
    PropertyGreaterThan(propertyName, value) {
        __classPrivateFieldGet(this, _QueryBuilder__filters, "f").push({
            property: propertyName,
            operator: FilterOperator.GreaterThan,
            value: value
        });
        return this;
    }
    PropertyLessThan(propertyName, value) {
        __classPrivateFieldGet(this, _QueryBuilder__filters, "f").push({
            property: propertyName,
            operator: FilterOperator.LesserThan,
            value: value
        });
        return this;
    }
    PropertyGreaterOrEqual(propertyName, value) {
        __classPrivateFieldGet(this, _QueryBuilder__filters, "f").push({
            property: propertyName,
            operator: FilterOperator.GreaterOrEqual,
            value: value
        });
        return this;
    }
    PropertyLessOrEqual(propertyName, value) {
        __classPrivateFieldGet(this, _QueryBuilder__filters, "f").push({
            property: propertyName,
            operator: FilterOperator.LesserOrEqual,
            value: value
        });
        return this;
    }
    StartFrom(value) {
        __classPrivateFieldSet(this, _QueryBuilder__since, value, "f");
        return this;
    }
    SetOffset(offset) {
        __classPrivateFieldSet(this, _QueryBuilder__offset, offset, "f");
        return this;
    }
    MaxRecord(limit) {
        __classPrivateFieldSet(this, _QueryBuilder__limit, limit, "f");
        return this;
    }
    AscendBy(propertyName) {
        __classPrivateFieldSet(this, _QueryBuilder__order, propertyName, "f");
        return this;
    }
    DescendBy(propertyName) {
        __classPrivateFieldSet(this, _QueryBuilder__order, propertyName, "f");
        __classPrivateFieldSet(this, _QueryBuilder__descend, true, "f");
        return this;
    }
    Build() {
        return {
            filters: __classPrivateFieldGet(this, _QueryBuilder__filters, "f"),
            since: __classPrivateFieldGet(this, _QueryBuilder__since, "f"),
            offset: __classPrivateFieldGet(this, _QueryBuilder__offset, "f"),
            limit: __classPrivateFieldGet(this, _QueryBuilder__limit, "f"),
            order: __classPrivateFieldGet(this, _QueryBuilder__order, "f"),
            descend: __classPrivateFieldGet(this, _QueryBuilder__descend, "f"),
        };
    }
}
exports.QueryBuilder = QueryBuilder;
_QueryBuilder__filters = new WeakMap(), _QueryBuilder__since = new WeakMap(), _QueryBuilder__offset = new WeakMap(), _QueryBuilder__limit = new WeakMap(), _QueryBuilder__order = new WeakMap(), _QueryBuilder__descend = new WeakMap();
function NewConnectorFromAccess(key) {
    const { id, encode_method, private_key } = key.private_data;
    if (defaultKeyEncodeMethod === encode_method) {
        if (!(0, libauth_1.isHex)(private_key)) {
            throw new Error('invalid key format');
        }
        let decoded = (0, libauth_1.hexToBin)(private_key).slice(0, 32);
        return NewConnector(id, decoded);
    }
    else {
        throw new Error('unsupport encode method: ' + encode_method);
    }
}
exports.NewConnectorFromAccess = NewConnectorFromAccess;
function NewConnector(accessID, privateKey) {
    return new ChainConnector(accessID, privateKey);
}
exports.NewConnector = NewConnector;
class ChainConnector {
    constructor(accessID, privateKey) {
        _ChainConnector_instances.add(this);
        _ChainConnector__accessID.set(this, '');
        _ChainConnector__privateKey.set(this, void 0);
        _ChainConnector__apiBase.set(this, '');
        _ChainConnector__domain.set(this, '');
        _ChainConnector__nonce.set(this, '');
        _ChainConnector__sessionID.set(this, '');
        _ChainConnector__timeout.set(this, 0);
        _ChainConnector__localIP.set(this, '');
        _ChainConnector__trace.set(this, false);
        _ChainConnector__request_timeout.set(this, defaultTimeoutInSeconds * 1000);
        _ChainConnector__projectName.set(this, void 0);
        _ChainConnector__headerNameSession.set(this, void 0);
        _ChainConnector__headerNameTimestamp.set(this, void 0);
        _ChainConnector__headerNameSignature.set(this, void 0);
        _ChainConnector__headerNameSignatureAlgorithm.set(this, void 0);
        __classPrivateFieldSet(this, _ChainConnector__accessID, accessID, "f");
        __classPrivateFieldSet(this, _ChainConnector__privateKey, privateKey, "f");
        __classPrivateFieldSet(this, _ChainConnector__apiBase, '', "f");
        __classPrivateFieldSet(this, _ChainConnector__domain, '', "f");
        __classPrivateFieldSet(this, _ChainConnector__nonce, '', "f");
        __classPrivateFieldSet(this, _ChainConnector__sessionID, '', "f");
        __classPrivateFieldSet(this, _ChainConnector__timeout, 0, "f");
        __classPrivateFieldSet(this, _ChainConnector__localIP, '', "f");
        __classPrivateFieldSet(this, _ChainConnector__request_timeout, defaultTimeoutInSeconds * 1000, "f");
        this.setProjectName(defaultProjectName);
    }
    get Version() {
        return SDKVersion;
    }
    get SessionID() {
        return __classPrivateFieldGet(this, _ChainConnector__sessionID, "f");
    }
    get AccessID() {
        return __classPrivateFieldGet(this, _ChainConnector__accessID, "f");
    }
    get LocalIP() {
        return __classPrivateFieldGet(this, _ChainConnector__localIP, "f");
    }
    get ProjectName() {
        return __classPrivateFieldGet(this, _ChainConnector__projectName, "f");
    }
    set Trace(flag) {
        __classPrivateFieldSet(this, _ChainConnector__trace, flag, "f");
    }
    set Timeout(timeoutInSeconds) {
        __classPrivateFieldSet(this, _ChainConnector__request_timeout, timeoutInSeconds * 1000, "f");
    }
    /**
     * connect to gateway for default domain
     * @param {string} host gateway host, IPv4 format
     * @param {number} port gateway port for API
     * @returns response payload
     */
    connect(host, port) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.connectToDomain(host, port, defaultDomainName);
        });
    }
    /**
     * connect to a specified domain
     * @param {string} host gateway host, IPv4 format
     * @param {number} port gateway port for API
     * @param {string} domainName domain name for connecting
     * @returns response payload
     */
    connectToDomain(host, port, domainName) {
        return __awaiter(this, void 0, void 0, function* () {
            if ('' === host) {
                host = defaultDomainHost;
            }
            if ('' === domainName) {
                throw new Error('domain name omit');
            }
            if (port <= 0 || port > 0xFFFF) {
                throw new Error('invalid port ' + port);
            }
            __classPrivateFieldSet(this, _ChainConnector__apiBase, 'http://' + host + ':' + port + '/api/v' + APIVersion, "f");
            __classPrivateFieldSet(this, _ChainConnector__domain, domainName, "f");
            __classPrivateFieldSet(this, _ChainConnector__nonce, __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_newNonce).call(this), "f");
            const now = new Date();
            const timestamp = now.toISOString();
            const signagureAlgorithm = signatureMethodEd25519;
            const signatureContent = {
                access: __classPrivateFieldGet(this, _ChainConnector__accessID, "f"),
                timestamp: timestamp,
                nonce: __classPrivateFieldGet(this, _ChainConnector__nonce, "f"),
                signature_algorithm: signagureAlgorithm,
            };
            const signature = yield __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_base64Signature).call(this, signatureContent);
            const requestData = {
                id: __classPrivateFieldGet(this, _ChainConnector__accessID, "f"),
                nonce: __classPrivateFieldGet(this, _ChainConnector__nonce, "f"),
            };
            let headers = {};
            headers[__classPrivateFieldGet(this, _ChainConnector__headerNameTimestamp, "f")] = timestamp;
            headers[__classPrivateFieldGet(this, _ChainConnector__headerNameSignatureAlgorithm, "f")] = signagureAlgorithm;
            headers[__classPrivateFieldGet(this, _ChainConnector__headerNameSignature, "f")] = signature;
            let resp = yield __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_rawRequest).call(this, RequestMethod.POST, '/sessions/', headers, requestData);
            const { session, timeout, address } = resp;
            __classPrivateFieldSet(this, _ChainConnector__sessionID, session, "f");
            __classPrivateFieldSet(this, _ChainConnector__timeout, timeout, "f");
            __classPrivateFieldSet(this, _ChainConnector__localIP, address, "f");
            if (__classPrivateFieldGet(this, _ChainConnector__trace, "f")) {
                console.log('<Chain-DEBUG> [%s]: new session allocated', __classPrivateFieldGet(this, _ChainConnector__sessionID, "f"));
                console.log('<Chain-DEBUG> [%s]: session timeout in %d second(s)', __classPrivateFieldGet(this, _ChainConnector__sessionID, "f"), timeout);
                console.log('<Chain-DEBUG> [%s]: local address %s', __classPrivateFieldGet(this, _ChainConnector__sessionID, "f"), address);
            }
            return;
        });
    }
    setProjectName(name) {
        __classPrivateFieldSet(this, _ChainConnector__projectName, name, "f");
        __classPrivateFieldSet(this, _ChainConnector__headerNameSession, name + '-Session', "f");
        __classPrivateFieldSet(this, _ChainConnector__headerNameTimestamp, name + '-Timestamp', "f");
        __classPrivateFieldSet(this, _ChainConnector__headerNameSignature, name + '-Signature', "f");
        __classPrivateFieldSet(this, _ChainConnector__headerNameSignatureAlgorithm, name + '-SignatureAlgorithm', "f");
    }
    /**
     * Keep established session alive
     */
    activate() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_mapToAPI).call(this, '/sessions/');
            yield __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_doRequest).call(this, RequestMethod.PUT, url);
            if (__classPrivateFieldGet(this, _ChainConnector__trace, "f")) {
                console.log('<Chain-DEBUG> [%s]: keep alive', __classPrivateFieldGet(this, _ChainConnector__sessionID, "f"));
            }
        });
    }
    //Chain and block operations begin
    /**
     * Get Current Chain Status
     *
     * @returns {Promise<ChainStatus>} return status object
     *
     */
    getStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_mapToDomain).call(this, '/status');
            return __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_fetchResponse).call(this, RequestMethod.GET, url);
        });
    }
    /**
     * Query blocks with pagination
     * @param {number} beginHeight begin block height, start from 1
     * @param {number} endHeight end block height, start from 1
     * @returns {BlockRecords} list of block records
     */
    queryBlocks(beginHeight, endHeight) {
        return __awaiter(this, void 0, void 0, function* () {
            if (endHeight < beginHeight) {
                throw new Error("end height " + endHeight + " must greater than begin height " + beginHeight);
            }
            const url = __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_mapToDomain).call(this, "/blocks/");
            const condition = {
                from: beginHeight,
                to: endHeight,
            };
            return __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_fetchResponseWithPayload).call(this, RequestMethod.POST, url, condition);
        });
    }
    /**
     * Get block data by ID
     * @param {string} blockID block ID
     * @returns {BlockData} block data
     */
    getBlock(blockID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!blockID) {
                throw new Error('block ID required');
            }
            const url = __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_mapToDomain).call(this, "/blocks/" + blockID);
            return __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_fetchResponse).call(this, RequestMethod.GET, url);
        });
    }
    /**
     * Query transactions using pagination
     * @param {string} blockID block ID
     * @param {number} start start offset for querying, start from 0
     * @param {number} maxRecord max records returned
     * @returns {TransactionRecords} transaction records
     */
    queryTransactions(blockID, start, maxRecord) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!blockID) {
                throw new Error('block ID required');
            }
            const url = __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_mapToDomain).call(this, "/blocks/" + blockID + "/transactions/");
            const condition = {
                offset: start,
                limit: maxRecord,
            };
            return __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_fetchResponseWithPayload).call(this, RequestMethod.POST, url, condition);
        });
    }
    /**
     * Get data of a transaction
     * @param {string} blockID block ID
     * @param {string} transID transaction ID
     * @returns {TransactionData} transaction data
     */
    getTransaction(blockID, transID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!blockID) {
                throw new Error('block ID required');
            }
            if (!transID) {
                throw new Error('transaction ID required');
            }
            const url = __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_mapToDomain).call(this, "/blocks/" + blockID + "/transactions/" + transID);
            return __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_fetchResponse).call(this, RequestMethod.GET, url);
        });
    }
    //Schema operations
    /**
     * Return list of current schemas
     *
     * @param {int} queryStart start offset when querying
     * @param {int} maxRecord max records could returne
     * @returns {Promise<SchemaRecords>} return records
     */
    querySchemas(queryStart, maxRecord) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_mapToDomain).call(this, '/schemas/');
            const condition = {
                offset: queryStart,
                limit: maxRecord,
            };
            return __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_fetchResponseWithPayload).call(this, RequestMethod.POST, url, condition);
        });
    }
    /**
     * Rebuild index of a schema
     * @param {string} schemaName schema for rebuilding
     */
    rebuildIndex(schemaName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!schemaName) {
                throw new Error('schema name required');
            }
            const url = __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_mapToDomain).call(this, '/schemas/' + schemaName + '/index/');
            yield __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_doRequest).call(this, RequestMethod.POST, url);
        });
    }
    /**
     * Create a new schema
     * @param {string} schemaName Name of new schema
     * @param {DocumentProperty[]} properties Properties of new schema
     */
    createSchema(schemaName, properties) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!schemaName) {
                throw new Error('schema name required');
            }
            const url = __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_mapToDomain).call(this, "/schemas/" + schemaName);
            yield __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_doRequestWithPayload).call(this, RequestMethod.POST, url, properties);
        });
    }
    /**
     * Update exist schema
     * @param  {string} schemaName Name of schema
     * @param  {DocumentProperty[]} properties Properties of schema for updating
     */
    updateSchema(schemaName, properties) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!schemaName) {
                throw new Error('schema name required');
            }
            const url = __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_mapToDomain).call(this, "/schemas/" + schemaName);
            yield __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_doRequestWithPayload).call(this, RequestMethod.PUT, url, properties);
        });
    }
    /**
     * Delete a schema
     * @param schemaName name of target schema
     */
    deleteSchema(schemaName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!schemaName) {
                throw new Error('schema name required');
            }
            const url = __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_mapToDomain).call(this, "/schemas/" + schemaName);
            yield __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_doRequest).call(this, RequestMethod.DELETE, url);
        });
    }
    /**
     * Check if a schema exstis
     * @param {string} schemaName target schema name
     * @returns  {boolean} true: exists/false: not exists
     */
    hasSchema(schemaName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!schemaName) {
                throw new Error('schema name required');
            }
            const url = __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_mapToDomain).call(this, "/schemas/" + schemaName);
            return __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_peekRequest).call(this, RequestMethod.HEAD, url);
        });
    }
    /**
     * Get a schema
     * @param {string} schemaName target schema name
     * @returns {DocumentSchema} schema define
     */
    getSchema(schemaName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!schemaName) {
                throw new Error('schema name required');
            }
            const url = __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_mapToDomain).call(this, "/schemas/" + schemaName);
            return __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_fetchResponse).call(this, RequestMethod.GET, url);
        });
    }
    /**
     * Get trace log of a schema
     * @param {string} schemaName schema name
     * @returns {LogRecords} list of log records
     */
    getSchemaLog(schemaName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!schemaName) {
                throw new Error('schema name required');
            }
            const url = __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_mapToDomain).call(this, "/schemas/" + schemaName + "/logs/");
            return __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_fetchResponse).call(this, RequestMethod.GET, url);
        });
    }
    /**
     * Get meta actors of a schema
     * @param {string} schemaName schema name
     * @returns {ActorPrivileges[]} list of actor privileges
     */
    getSchemaActors(schemaName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!schemaName) {
                throw new Error('schema name required');
            }
            const url = __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_mapToDomain).call(this, "/schemas/" + schemaName + "/actors/");
            return __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_fetchResponse).call(this, RequestMethod.GET, url);
        });
    }
    /**
     * Update meta actors of a schema
     * @param {string} schemaName schema name
     * @param {ActorPrivileges[]} actors list of actor privileges
     */
    updateSchemaActors(schemaName, actors) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!schemaName) {
                throw new Error('schema name required');
            }
            if (!actors || 0 == actors.length) {
                throw new Error('actors required');
            }
            const url = __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_mapToDomain).call(this, "/schemas/" + schemaName + "/actors/");
            const payload = {
                actors: actors
            };
            yield __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_doRequestWithPayload).call(this, RequestMethod.PUT, url, payload);
        });
    }
    //Document Operations
    /**
     * Add a new document to schema
     * @param {string} schemaName schema name
     * @param {string} docID optional document ID, generate when omit
     * @param {string} docContent document content in JSON format
     * @returns {string} document ID
     */
    addDocument(schemaName, docID, docContent) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!schemaName) {
                throw new Error('schema name required');
            }
            const url = __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_mapToDomain).call(this, "/schemas/" + schemaName + "/docs/");
            const payload = {
                id: docID,
                content: docContent,
            };
            let resp = yield __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_fetchResponseWithPayload).call(this, RequestMethod.POST, url, payload);
            return resp.id;
        });
    }
    /**
     * Update content of a document
     * @param {string} schemaName schema name
     * @param {string} docID document ID
     * @param {string} docContent document content in JSON format
     */
    updateDocument(schemaName, docID, docContent) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!schemaName) {
                throw new Error('schema name required');
            }
            if (!docID) {
                throw new Error('document ID required');
            }
            const url = __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_mapToDomain).call(this, "/schemas/" + schemaName + "/docs/" + docID);
            const payload = {
                content: docContent,
            };
            yield __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_doRequestWithPayload).call(this, RequestMethod.PUT, url, payload);
        });
    }
    /**
     * Update property value of a document
     * @param {string} schemaName schema name
     * @param {string} docID document ID
     * @param {string} propertyName property for updating
     * @param {PropertyType} valueType value type of property
     * @param {any} value value for property
     */
    updateDocumentProperty(schemaName, docID, propertyName, valueType, value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!schemaName) {
                throw new Error('schema name required');
            }
            if (!docID) {
                throw new Error('document ID required');
            }
            if (!propertyName) {
                throw new Error('property name required');
            }
            const url = __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_mapToDomain).call(this, "/schemas/" + schemaName + "/docs/" + docID + '/properties/' + propertyName);
            const payload = {
                type: valueType,
                value: value
            };
            yield __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_doRequestWithPayload).call(this, RequestMethod.PUT, url, payload);
        });
    }
    /**
     * Remove a document
     * @param {string} schemaName schema name
     * @param {string} docID document ID
     */
    removeDocument(schemaName, docID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!schemaName) {
                throw new Error('schema name required');
            }
            if (!docID) {
                throw new Error('document ID required');
            }
            const url = __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_mapToDomain).call(this, "/schemas/" + schemaName + "/docs/" + docID);
            yield __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_doRequest).call(this, RequestMethod.DELETE, url);
        });
    }
    /**
     * Check if document exists
     * @param {string} schemaName schema name
     * @param {string} docID document ID
     * @returns {boolean} true: exists / false: not exists
     */
    hasDocument(schemaName, docID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!schemaName) {
                throw new Error('schema name required');
            }
            if (!docID) {
                throw new Error('document ID required');
            }
            const url = __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_mapToDomain).call(this, "/schemas/" + schemaName + "/docs/" + docID);
            return __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_peekRequest).call(this, RequestMethod.HEAD, url);
        });
    }
    /**
     * Get document content
     * @param {string} schemaName schema name
     * @param {string} docID document ID
     * @returns {string} content in JSON format
     */
    getDocument(schemaName, docID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!schemaName) {
                throw new Error('schema name required');
            }
            if (!docID) {
                throw new Error('document ID required');
            }
            const url = __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_mapToDomain).call(this, "/schemas/" + schemaName + "/docs/" + docID);
            let doc = yield __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_fetchResponse).call(this, RequestMethod.GET, url);
            return doc.content;
        });
    }
    /**
     * Query trace log of a document
     * @param {string} schemaName schema name
     * @param {string} docID document ID
     * @returns {LogRecords} trace log
     */
    getDocumentLogs(schemaName, docID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!schemaName) {
                throw new Error('schema name required');
            }
            if (!docID) {
                throw new Error('document ID required');
            }
            const url = __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_mapToDomain).call(this, "/schemas/" + schemaName + "/docs/" + docID + "/logs/");
            return __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_fetchResponse).call(this, RequestMethod.GET, url);
        });
    }
    /**
     * Query documents by condition
     * @param {string} schemaName schema name
     * @param {QueryCondition} condition query condition
     * @returns {DocumentRecords} matched documents
     */
    queryDocuments(schemaName, condition) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!schemaName) {
                throw new Error('schema name required');
            }
            const url = __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_mapToDomain).call(this, "/queries/schemas/" + schemaName + "/docs/");
            return __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_fetchResponseWithPayload).call(this, RequestMethod.POST, url, condition);
        });
    }
    /**
     * Get meta actors of a document
     * @param {string} schemaName schema name
     * @param {string} docID document ID
     * @returns {ActorPrivileges[]} list of actor privileges
     */
    getDocumentActors(schemaName, docID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!schemaName) {
                throw new Error('schema name required');
            }
            const url = __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_mapToDomain).call(this, "/schemas/" + schemaName + "/docs/" + docID + "/actors/");
            return __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_fetchResponse).call(this, RequestMethod.GET, url);
        });
    }
    /**
     * Update meta actors of a document
     * @param {string} schemaName schema name
     * @param {string} docID document ID
     * @param {ActorPrivileges[]} actors list of actor privileges
     */
    updateDocumentActors(schemaName, docID, actors) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!schemaName) {
                throw new Error('schema name required');
            }
            if (!actors || 0 == actors.length) {
                throw new Error('actors required');
            }
            const url = __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_mapToDomain).call(this, "/schemas/" + schemaName + "/docs/" + docID + "/actors/");
            const payload = {
                actors: actors
            };
            yield __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_doRequestWithPayload).call(this, RequestMethod.PUT, url, payload);
        });
    }
    //Smart contract operations
    /**
     * Query contracts with pagination
     * @param {number} queryStart start offset for querying, begin from 0
     * @param {number} maxRecord max record count returned
     * @returns ContractRecords
     */
    queryContracts(queryStart, maxRecord) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_mapToDomain).call(this, "/contracts/");
            const condtion = {
                offset: queryStart,
                limit: maxRecord,
            };
            return __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_fetchResponseWithPayload).call(this, RequestMethod.POST, url, condtion);
        });
    }
    /**
     * Check if a contract exstis
     * @param {string} contractName target contract name
     * @returns  {boolean} true: exists/false: not exists
     */
    hasContract(contractName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!contractName) {
                throw new Error('contract name required');
            }
            const url = __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_mapToDomain).call(this, "/contracts/" + contractName);
            return __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_peekRequest).call(this, RequestMethod.HEAD, url);
        });
    }
    /**
     * Get define of a contract
     * @param {string} contractName target contract name
     * @returns  {ContractDefine} contract define
     */
    getContract(contractName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!contractName) {
                throw new Error('contract name required');
            }
            const url = __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_mapToDomain).call(this, "/contracts/" + contractName);
            let resp = yield __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_fetchResponse).call(this, RequestMethod.GET, url);
            let content = resp.content;
            let define = JSON.parse(content);
            return define;
        });
    }
    /**
     * Get detail info of a contract
     * @param {string} contractName target contract name
     * @returns  {ContractInfo} contract info
     */
    getContractInfo(contractName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!contractName) {
                throw new Error('contract name required');
            }
            const url = __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_mapToDomain).call(this, "/contracts/" + contractName + '/info/');
            return __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_fetchResponse).call(this, RequestMethod.GET, url);
        });
    }
    /**
     * Deploy a contract define
     * @param {string} contractName contract name
     * @param {ContractDefine} define contract define
     */
    deployContract(contractName, define) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!contractName) {
                throw new Error('contract name required');
            }
            const url = __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_mapToDomain).call(this, "/contracts/" + contractName);
            const payload = {
                content: JSON.stringify(define),
            };
            yield __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_doRequestWithPayload).call(this, RequestMethod.PUT, url, payload);
        });
    }
    /**
     * Invoke a contract with parameters
     * @param {string} contractName contract name
     * @param {string[]} parameters parameters for invoking contract
     */
    callContract(contractName, parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!contractName) {
                throw new Error('contract name required');
            }
            const url = __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_mapToDomain).call(this, "/contracts/" + contractName + '/sessions/');
            const payload = {
                parameters: parameters,
            };
            yield __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_doRequestWithPayload).call(this, RequestMethod.POST, url, payload);
        });
    }
    /**
     * Withdraw a contract define
     * @param {string} contractName contract name
     */
    withdrawContract(contractName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!contractName) {
                throw new Error('contract name required');
            }
            const url = __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_mapToDomain).call(this, "/contracts/" + contractName);
            yield __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_doRequest).call(this, RequestMethod.DELETE, url);
        });
    }
    /**
     * Enable contract tracing
     * @param {string} contractName contract name
     */
    enableContractTrace(contractName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!contractName) {
                throw new Error('contract name required');
            }
            const url = __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_mapToDomain).call(this, "/contracts/" + contractName + '/trace/');
            const payload = {
                enable: true,
            };
            yield __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_doRequestWithPayload).call(this, RequestMethod.PUT, url, payload);
        });
    }
    /**
     * Enable contract tracing
     * @param {string} contractName contract name
     */
    disableContractTrace(contractName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!contractName) {
                throw new Error('contract name required');
            }
            const url = __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_mapToDomain).call(this, "/contracts/" + contractName + '/trace/');
            const payload = {
                enable: false,
            };
            yield __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_doRequestWithPayload).call(this, RequestMethod.PUT, url, payload);
        });
    }
    /**
     * Get meta actors of a contract
     * @param {string} contractName contract name
     * @returns {ActorPrivileges[]} list of actor privileges
     */
    getContractActors(contractName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!contractName) {
                throw new Error('contract name required');
            }
            const url = __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_mapToDomain).call(this, "/contracts/" + contractName + '/actors/');
            return __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_fetchResponse).call(this, RequestMethod.GET, url);
        });
    }
    /**
     * Update meta actors of a contract
     * @param {string} contractName contract name
     * @param {ActorPrivileges[]} actors list of actor privileges
     */
    updateContractActors(contractName, actors) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!contractName) {
                throw new Error('contract name required');
            }
            if (!actors || 0 == actors.length) {
                throw new Error('actors required');
            }
            const url = __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_mapToDomain).call(this, "/contracts/" + contractName + '/actors/');
            const payload = {
                actors: actors
            };
            yield __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_doRequestWithPayload).call(this, RequestMethod.PUT, url, payload);
        });
    }
}
exports.ChainConnector = ChainConnector;
_ChainConnector__accessID = new WeakMap(), _ChainConnector__privateKey = new WeakMap(), _ChainConnector__apiBase = new WeakMap(), _ChainConnector__domain = new WeakMap(), _ChainConnector__nonce = new WeakMap(), _ChainConnector__sessionID = new WeakMap(), _ChainConnector__timeout = new WeakMap(), _ChainConnector__localIP = new WeakMap(), _ChainConnector__trace = new WeakMap(), _ChainConnector__request_timeout = new WeakMap(), _ChainConnector__projectName = new WeakMap(), _ChainConnector__headerNameSession = new WeakMap(), _ChainConnector__headerNameTimestamp = new WeakMap(), _ChainConnector__headerNameSignature = new WeakMap(), _ChainConnector__headerNameSignatureAlgorithm = new WeakMap(), _ChainConnector_instances = new WeakSet(), _ChainConnector_newNonce = function _ChainConnector_newNonce() {
    const nonceLength = 16;
    return dist_1.default.random(nonceLength);
}, _ChainConnector_base64Signature = function _ChainConnector_base64Signature(obj) {
    return __awaiter(this, void 0, void 0, function* () {
        const content = Buffer.from(JSON.stringify(obj), 'utf-8');
        const signed = yield ed25519.sign(content, __classPrivateFieldGet(this, _ChainConnector__privateKey, "f"));
        return Buffer.from(signed).toString(signatureEncode);
    });
}, _ChainConnector_rawRequest = function _ChainConnector_rawRequest(method, path, headers, payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_mapToAPI).call(this, path);
        headers[headerContentType] = contentTypeJSON;
        let options = {
            method: method,
            headers: headers,
            cache: 'no-store',
            next: {
                revalidate: 0
            }
        };
        if (payload) {
            options.body = JSON.stringify(payload);
        }
        return __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_getResult).call(this, url, options);
    });
}, _ChainConnector_fetchWithTimeout = function _ChainConnector_fetchWithTimeout(url, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            controller.abort();
        }, __classPrivateFieldGet(this, _ChainConnector__request_timeout, "f"));
        let optionsWithSignal = Object.assign(Object.assign({}, options), { signal: controller.signal });
        let resp;
        try {
            resp = yield fetch(url, optionsWithSignal);
        }
        catch (e) {
            if (e.name === 'AbortError') {
                throw new Error(`request ${options.method}: ${url} timeout`);
            }
            else {
                throw new Error(`fetch ${options.method}: ${url} failed\n${e.message}`);
            }
        }
        finally {
            clearTimeout(timeoutId);
        }
        return resp;
    });
}, _ChainConnector_peekRequest = function _ChainConnector_peekRequest(method, url) {
    return __awaiter(this, void 0, void 0, function* () {
        let options = yield __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_prepareOptions).call(this, method, url, null);
        let resp = yield __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_fetchWithTimeout).call(this, url, options);
        return resp.ok;
    });
}, _ChainConnector_validateResult = function _ChainConnector_validateResult(url, options) {
    return __awaiter(this, void 0, void 0, function* () {
        yield __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_parseResponse).call(this, url, options);
    });
}, _ChainConnector_parseResponse = function _ChainConnector_parseResponse(url, options) {
    return __awaiter(this, void 0, void 0, function* () {
        let resp = yield __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_fetchWithTimeout).call(this, url, options);
        if (!resp.ok) {
            throw new Error('fetch result failed with status ' + resp.status + ': ' + resp.statusText);
        }
        let payload = yield resp.json();
        if (0 != payload[payloadPathErrorCode]) {
            throw new Error('fetch failed: ' + payload[payloadPathErrorMessage]);
        }
        return payload;
    });
}, _ChainConnector_getResult = function _ChainConnector_getResult(url, options) {
    return __awaiter(this, void 0, void 0, function* () {
        let payload = yield __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_parseResponse).call(this, url, options);
        return payload[payloadPathData];
    });
}, _ChainConnector_doRequest = function _ChainConnector_doRequest(method, url) {
    return __awaiter(this, void 0, void 0, function* () {
        let options = yield __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_prepareOptions).call(this, method, url, null);
        yield __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_validateResult).call(this, url, options);
    });
}, _ChainConnector_doRequestWithPayload = function _ChainConnector_doRequestWithPayload(method, url, payload) {
    return __awaiter(this, void 0, void 0, function* () {
        let options = yield __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_prepareOptions).call(this, method, url, payload);
        yield __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_validateResult).call(this, url, options);
    });
}, _ChainConnector_fetchResponse = function _ChainConnector_fetchResponse(method, url) {
    return __awaiter(this, void 0, void 0, function* () {
        let options = yield __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_prepareOptions).call(this, method, url, null);
        return __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_getResult).call(this, url, options);
    });
}, _ChainConnector_fetchResponseWithPayload = function _ChainConnector_fetchResponseWithPayload(method, url, payload) {
    return __awaiter(this, void 0, void 0, function* () {
        let options = yield __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_prepareOptions).call(this, method, url, payload);
        return __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_getResult).call(this, url, options);
    });
}, _ChainConnector_prepareOptions = function _ChainConnector_prepareOptions(method, url, payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const urlObject = new URL(url);
        const now = new Date();
        const timestamp = now.toISOString();
        let signatureContent = {
            id: __classPrivateFieldGet(this, _ChainConnector__sessionID, "f"),
            method: method.toUpperCase(),
            url: urlObject.pathname,
            body: '',
            access: __classPrivateFieldGet(this, _ChainConnector__accessID, "f"),
            timestamp: timestamp,
            nonce: __classPrivateFieldGet(this, _ChainConnector__nonce, "f"),
            signature_algorithm: signatureMethodEd25519,
        };
        let options = {
            method: method,
            cache: 'no-store',
            next: {
                revalidate: 0
            }
        };
        let headers = {};
        let bodyContent = '';
        if (payload) {
            headers[headerContentType] = contentTypeJSON;
            bodyContent = JSON.stringify(payload);
            options.body = bodyContent;
        }
        if (RequestMethod.POST === method || RequestMethod.PUT === method || RequestMethod.DELETE === method
            || RequestMethod.PATCH === method) {
            let hash = crypto_js_1.default.SHA256(bodyContent);
            signatureContent.body = crypto_js_1.default.enc.Base64.stringify(hash);
        }
        const signature = yield __classPrivateFieldGet(this, _ChainConnector_instances, "m", _ChainConnector_base64Signature).call(this, signatureContent);
        headers[__classPrivateFieldGet(this, _ChainConnector__headerNameSession, "f")] = __classPrivateFieldGet(this, _ChainConnector__sessionID, "f");
        headers[__classPrivateFieldGet(this, _ChainConnector__headerNameTimestamp, "f")] = timestamp;
        headers[__classPrivateFieldGet(this, _ChainConnector__headerNameSignatureAlgorithm, "f")] = signatureMethodEd25519;
        headers[__classPrivateFieldGet(this, _ChainConnector__headerNameSignature, "f")] = signature;
        options.headers = headers;
        if (__classPrivateFieldGet(this, _ChainConnector__trace, "f")) {
            console.log('<Chain-DEBUG> [%s]: signature payload\n%s', __classPrivateFieldGet(this, _ChainConnector__sessionID, "f"), JSON.stringify(signatureContent));
            console.log('<Chain-DEBUG> [%s]: signature: %s', __classPrivateFieldGet(this, _ChainConnector__sessionID, "f"), signature);
        }
        return options;
    });
}, _ChainConnector_mapToAPI = function _ChainConnector_mapToAPI(path) {
    return __classPrivateFieldGet(this, _ChainConnector__apiBase, "f") + path;
}, _ChainConnector_mapToDomain = function _ChainConnector_mapToDomain(path) {
    return __classPrivateFieldGet(this, _ChainConnector__apiBase, "f") + '/domains/' + __classPrivateFieldGet(this, _ChainConnector__domain, "f") + path;
};
//# sourceMappingURL=chain_connector.js.map