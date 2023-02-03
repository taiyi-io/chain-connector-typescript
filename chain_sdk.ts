
import { hexToBin, isHex } from '@bitauth/libauth';
import CryptoJS from 'crypto-js';
import Strings from '@supercharge/strings/dist';
import * as ed25519 from '@noble/ed25519';

const SDKVersion = '0.4.0';
const APIVersion = '1';
// const projectName = 'Taiyi';
const projectName = 'Paimon';
const headerNameSession = projectName + '-Session';
const headerNameTimestamp = projectName + '-Timestamp';
const headerNameSignature = projectName + '-Signature';
const headerNameSignatureAlgorithm = projectName + '-SignatureAlgorithm';
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

export enum PropertyType {
    String = "string",
    Boolean = "bool",
    Integer = "int",
    Float = "float",
    Currency = "currency",
    Collection = "collection",
    Document = "document",
}

enum RequestMethod {
    GET = 'GET',
    PUT = 'PUT',
    POST = 'POST',
    DELETE = 'DELETE',
    HEAD = 'HEAD',
    PATCH = 'PATCH',
}

export interface AccessKey {
    private_data: {
        version: number,
        id: string,
        encode_method: string,
        private_key: string,
    }
}

export interface ChainStatus {
    world_version: string,
    block_height: number,
    previous_block: string,
    genesis_block: string,
    allocated_transaction_id: string,
}

export interface SchemaRecords {
    schemas: string[],
    limit: number,
    offset: number,
    total: number,
}

export interface DocumentProperty {
    name: string,
    type: PropertyType,
    indexed?: boolean,
    omissible?: boolean,
}

export interface DocumentSchema {
    name: string,
    properties?: DocumentProperty[],
}

export interface Document {
    id: string,
    content: string
}

export enum FilterOperator {
    Equal = 0,
    NotEqual,
    GreaterThan,
    LesserThan,
    GreaterOrEqual,
    LesserOrEqual
}

export interface ConditionFilter {
    property: string,
    operator: FilterOperator,
    value: string
}

export interface QueryCondition {
    filters?: ConditionFilter[],
    since?: string,
    offset: number,
    limit?: number,
    order?: string,
    descend: boolean,
}

export class QueryBuilder {
    #_filters: ConditionFilter[];
    #_since: string;
    #_offset: number;
    #_limit: number;
    #_order: string;
    #_descend: boolean;
    constructor() {
        this.#_filters = [];
        this.#_since = '';
        this.#_offset = 0;
        this.#_limit = 0;
        this.#_order = '';
        this.#_descend = false;
    }
    PropertyEqual(propertyName: string, value: string): QueryBuilder {
        this.#_filters.push({
            property: propertyName,
            operator: FilterOperator.Equal,
            value: value
        });
        return this;
    }
    PropertyNotEqual(propertyName: string, value: string): QueryBuilder {
        this.#_filters.push({
            property: propertyName,
            operator: FilterOperator.NotEqual,
            value: value
        });
        return this;
    }
    PropertyGreaterThan(propertyName: string, value: string): QueryBuilder {
        this.#_filters.push({
            property: propertyName,
            operator: FilterOperator.GreaterThan,
            value: value
        });
        return this;
    }
    PropertyLessThan(propertyName: string, value: string): QueryBuilder {
        this.#_filters.push({
            property: propertyName,
            operator: FilterOperator.LesserThan,
            value: value
        });
        return this;
    }
    PropertyGreaterOrEqual(propertyName: string, value: string): QueryBuilder {
        this.#_filters.push({
            property: propertyName,
            operator: FilterOperator.GreaterOrEqual,
            value: value
        });
        return this;
    }

    PropertyLessOrEqual(propertyName: string, value: string): QueryBuilder {
        this.#_filters.push({
            property: propertyName,
            operator: FilterOperator.LesserOrEqual,
            value: value
        });
        return this;
    }
    StartFrom(value: string): QueryBuilder {
        this.#_since = value;
        return this;
    }
    SetOffset(offset: number): QueryBuilder {
        this.#_offset = offset;
        return this;
    }
    MaxRecord(limit: number): QueryBuilder {
        this.#_limit = limit;
        return this;
    }
    AscendBy(propertyName: string): QueryBuilder {
        this.#_order = propertyName;
        return this;
    }
    DescendBy(propertyName: string): QueryBuilder {
        this.#_order = propertyName;
        this.#_descend = true;
        return this;
    }
    Build(): QueryCondition {
        return {
            filters: this.#_filters,
            since: this.#_since,
            offset: this.#_offset,
            limit: this.#_limit,
            order: this.#_order,
            descend: this.#_descend,
        }
    }
}

export interface DocumentRecords {
    documents?: Document[],
    limit: number,
    offset: number,
    total: number,
}

export interface TraceLog {
    version: number,
    timestamp: string,
    operate: string,
    invoker: string,
    block?: string,
    transaction?: string,
    confirmed: boolean
}

export interface ContractStep {
    action: string,
    params?: string[],
}

export interface BlockData {
    id: string,
    timestamp: string,
    previous_block: string,
    height: number,
    transactions: number,
    content: string,
}

export interface BlockRecords {
    blocks: string[],
    from: number,
    to: number,
    height: number,
}

export interface TransactionData {
    block: string,
    transaction: string,
    timestamp: string,
    validated: boolean,
    content: string,
}

export interface TransactionRecords {
    transactions?: string[],
    offset: number,
    limit: number,
    total: number,
    has_more: boolean,
}

export interface ContractInfo {
    name: string,
    parameters?: number,
    steps?: number,
    version: number,
    modified_time: string,
    enabled: boolean,
    trace?: boolean,
}
export interface ContractParameter {
    name: string,
    description?: string,
}

export interface ContractDefine {
    steps: ContractStep[],
    parameters?: ContractParameter[],
}

export interface ContractRecords {
    contracts: ContractInfo[],
    limit: number,
    offset: number,
    total: number,
}

export interface LogRecords {
    latest_version: number,
    logs?: TraceLog[],
}


export interface ActorPrivileges {
    group: string,
    owner: boolean,
    executor: boolean,
    updater: boolean,
    viewer: boolean
}

interface requestOptions {
    method: RequestMethod,
    body?: string,
    headers?: object,
    cache?: string,
    next?: object,
}

interface sessionResponse {
    session: string,
    timeout: number,
    address: string,
}

export function NewConnectorFromAccess(key: AccessKey) {
    const { id, encode_method, private_key } = key.private_data;
    if (defaultKeyEncodeMethod === encode_method) {
        if (!isHex(private_key)) {
            throw new Error('invalid key format');
        }
        let decoded = hexToBin(private_key).slice(0, 32);
        return NewConnector(id, decoded);
    } else {
        throw new Error('unsupport encode method: ' + encode_method);
    }
}

export function NewConnector(accessID: string, privateKey: Uint8Array) {
    return new ChainConnector(accessID, privateKey);
}

export class ChainConnector {
    #_accessID: string = '';
    #_privateKey: Uint8Array;
    #_apiBase: string = '';
    #_domain: string = '';
    #_nonce: string = '';
    #_sessionID: string = '';
    #_timeout: number = 0;
    #_localIP: string = '';
    #_trace: boolean = false;
    #_request_timeout: number = defaultTimeoutInSeconds * 1000;
    constructor(accessID: string, privateKey: Uint8Array) {
        this.#_accessID = accessID;
        this.#_privateKey = privateKey;
        this.#_apiBase = '';
        this.#_domain = '';
        this.#_nonce = '';
        this.#_sessionID = '';
        this.#_timeout = 0;
        this.#_localIP = '';
        this.#_request_timeout = defaultTimeoutInSeconds * 1000;
    }

    get Version() {
        return SDKVersion;
    }

    get SessionID() {
        return this.#_sessionID;
    }

    get AccessID() {
        return this.#_accessID;
    }

    get LocalIP() {
        return this.#_localIP;
    }

    set Trace(flag: boolean) {
        this.#_trace = flag;
    }

    set Timeout(timeoutInSeconds: number) {
        this.#_request_timeout = timeoutInSeconds * 1000;
    }

    /**
     * connect to gateway for default domain
     * @param {string} host gateway host, IPv4 format
     * @param {number} port gateway port for API
     * @returns response payload
     */
    async connect(host: string, port: number): Promise<object> {
        return this.connectToDomain(host, port, defaultDomainName);
    }

    /**
     * connect to a specified domain
     * @param {string} host gateway host, IPv4 format
     * @param {number} port gateway port for API
     * @param {string} domainName domain name for connecting
     * @returns response payload
     */
    async connectToDomain(host: string, port: number, domainName: string): Promise<object> {
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
        const signature = await this.#base64Signature(signatureContent);
        const requestData = {
            id: this.#_accessID,
            nonce: this.#_nonce,
        };
        let headers = {};
        headers[headerNameTimestamp] = timestamp;
        headers[headerNameSignatureAlgorithm] = signagureAlgorithm;
        headers[headerNameSignature] = signature;
        let resp = await this.#rawRequest(RequestMethod.POST, '/sessions/', headers, requestData);
        const { session, timeout, address } = (resp as sessionResponse);
        this.#_sessionID = session;
        this.#_timeout = timeout;
        this.#_localIP = address;
        if (this.#_trace) {
            console.log('<Chain-DEBUG> [%s]: new session allocated', this.#_sessionID);
            console.log('<Chain-DEBUG> [%s]: session timeout in %d second(s)', this.#_sessionID, timeout);
            console.log('<Chain-DEBUG> [%s]: local address %s', this.#_sessionID, address);
        }
        return;
    }

    /**
     * Keep established session alive
     */
    async activate() {
        const url = this.#mapToAPI('/sessions/');
        await this.#doRequest(RequestMethod.PUT, url);
        if (this.#_trace) {
            console.log('<Chain-DEBUG> [%s]: keep alive', this.#_sessionID);
        }
    }


    //Chain and block operations begin

    /**
     * Get Current Chain Status
     * 
     * @returns {Promise<ChainStatus>} return status object
     * 
     */
    async getStatus(): Promise<ChainStatus> {
        const url = this.#mapToDomain('/status');
        return this.#fetchResponse(RequestMethod.GET, url) as Promise<ChainStatus>;
    }

    /**
     * Query blocks with pagination
     * @param {number} beginHeight begin block height, start from 1
     * @param {number} endHeight end block height, start from 1
     * @returns {BlockRecords} list of block records
     */
    async queryBlocks(beginHeight: number, endHeight: number): Promise<BlockRecords> {
        if (endHeight < beginHeight) {
            throw new Error("end height " + endHeight + " must greater than begin height " + beginHeight);
        }
        const url = this.#mapToDomain("/blocks/");
        const condition = {
            from: beginHeight,
            to: endHeight,
        };
        return (this.#fetchResponseWithPayload(RequestMethod.POST, url, condition) as Promise<BlockRecords>);
    }

    /**
     * Get block data by ID
     * @param {string} blockID block ID
     * @returns {BlockData} block data
     */
    async getBlock(blockID: string): Promise<BlockData> {
        if (!blockID) {
            throw new Error('block ID required');
        }
        const url = this.#mapToDomain("/blocks/" + blockID);
        return (this.#fetchResponse(RequestMethod.GET, url) as Promise<BlockData>);
    }

    /**
     * Query transactions using pagination
     * @param {string} blockID block ID
     * @param {number} start start offset for querying, start from 0
     * @param {number} maxRecord max records returned
     * @returns {TransactionRecords} transaction records
     */
    async queryTransactions(blockID: string, start: number, maxRecord: number): Promise<TransactionRecords> {
        if (!blockID) {
            throw new Error('block ID required');
        }
        const url = this.#mapToDomain("/blocks/" + blockID + "/transactions/");
        const condition = {
            offset: start,
            limit: maxRecord,
        };
        return (this.#fetchResponseWithPayload(RequestMethod.POST, url, condition) as Promise<TransactionRecords>);
    }

    /**
     * Get data of a transaction
     * @param {string} blockID block ID
     * @param {string} transID transaction ID
     * @returns {TransactionData} transaction data
     */
    async getTransaction(blockID: string, transID: string): Promise<TransactionData> {
        if (!blockID) {
            throw new Error('block ID required');
        }
        if (!transID) {
            throw new Error('transaction ID required');
        }
        const url = this.#mapToDomain("/blocks/" + blockID + "/transactions/" + transID);
        return (this.#fetchResponse(RequestMethod.GET, url) as Promise<TransactionData>);
    }

    //Schema operations

    /**
     * Return list of current schemas
     * 
     * @param {int} queryStart start offset when querying
     * @param {int} maxRecord max records could returne
     * @returns {Promise<SchemaRecords>} return records
     */
    async querySchemas(queryStart: number, maxRecord: number): Promise<SchemaRecords> {
        const url = this.#mapToDomain('/schemas/');
        const condition = {
            offset: queryStart,
            limit: maxRecord,
        }
        return (this.#fetchResponseWithPayload(RequestMethod.POST, url, condition) as Promise<SchemaRecords>);
    }

    /**
     * Rebuild index of a schema
     * @param {string} schemaName schema for rebuilding
     */
    async rebuildIndex(schemaName: string) {
        if (!schemaName) {
            throw new Error('schema name required');
        }
        const url = this.#mapToDomain('/schemas/' + schemaName + '/index/');
        await this.#doRequest(RequestMethod.POST, url);
    }

    /**
     * Create a new schema
     * @param {string} schemaName Name of new schema
     * @param {DocumentProperty[]} properties Properties of new schema
     */
    async createSchema(schemaName: string, properties: DocumentProperty[]) {
        if (!schemaName) {
            throw new Error('schema name required');
        }
        const url = this.#mapToDomain("/schemas/" + schemaName);
        await this.#doRequestWithPayload(RequestMethod.POST, url, properties);
    }

    /**
     * Update exist schema 
     * @param  {string} schemaName Name of schema
     * @param  {DocumentProperty[]} properties Properties of schema for updating
     */
    async updateSchema(schemaName: string, properties: DocumentProperty[]) {
        if (!schemaName) {
            throw new Error('schema name required');
        }
        const url = this.#mapToDomain("/schemas/" + schemaName);
        await this.#doRequestWithPayload(RequestMethod.PUT, url, properties);
    }

    /**
     * Delete a schema
     * @param schemaName name of target schema
     */
    async deleteSchema(schemaName: string) {
        if (!schemaName) {
            throw new Error('schema name required');
        }
        const url = this.#mapToDomain("/schemas/" + schemaName);
        await this.#doRequest(RequestMethod.DELETE, url);
    }

    /**
     * Check if a schema exstis
     * @param {string} schemaName target schema name
     * @returns  {boolean} true: exists/false: not exists
     */
    async hasSchema(schemaName: string): Promise<boolean> {
        if (!schemaName) {
            throw new Error('schema name required');
        }
        const url = this.#mapToDomain("/schemas/" + schemaName);
        return this.#peekRequest(RequestMethod.HEAD, url);
    }

    /**
     * Get a schema 
     * @param {string} schemaName target schema name
     * @returns {DocumentSchema} schema define
     */
    async getSchema(schemaName: string): Promise<DocumentSchema> {
        if (!schemaName) {
            throw new Error('schema name required');
        }
        const url = this.#mapToDomain("/schemas/" + schemaName);
        return (this.#fetchResponse(RequestMethod.GET, url) as Promise<DocumentSchema>);
    }

    /**
     * Get trace log of a schema 
     * @param {string} schemaName schema name
     * @returns {LogRecords} list of log records
     */
    async getSchemaLog(schemaName: string): Promise<LogRecords> {
        if (!schemaName) {
            throw new Error('schema name required');
        }
        const url = this.#mapToDomain("/schemas/" + schemaName + "/logs/");
        return (this.#fetchResponse(RequestMethod.GET, url) as Promise<LogRecords>);
    }

    /**
     * Get meta actors of a schema 
     * @param {string} schemaName schema name
     * @returns {ActorPrivileges[]} list of actor privileges
     */
    async getSchemaActors(schemaName: string): Promise<ActorPrivileges[]> {
        if (!schemaName) {
            throw new Error('schema name required');
        }
        const url = this.#mapToDomain("/schemas/" + schemaName + "/actors/");
        return (this.#fetchResponse(RequestMethod.GET, url) as Promise<ActorPrivileges[]>);
    }

    /**
     * Update meta actors of a schema 
     * @param {string} schemaName schema name
     * @param {ActorPrivileges[]} actors list of actor privileges
     */
    async updateSchemaActors(schemaName: string, actors: ActorPrivileges[]) {
        if (!schemaName) {
            throw new Error('schema name required');
        }
        if (!actors || 0 == actors.length) {
            throw new Error('actors required');
        }
        const url = this.#mapToDomain("/schemas/" + schemaName + "/actors/");
        const payload = {
            actors: actors
        };
        await this.#doRequestWithPayload(RequestMethod.PUT, url, payload);
    }

    //Document Operations

    /**
     * Add a new document to schema
     * @param {string} schemaName schema name
     * @param {string} docID optional document ID, generate when omit
     * @param {string} docContent document content in JSON format
     * @returns {string} document ID
     */
    async addDocument(schemaName: string, docID: string, docContent: string): Promise<string> {
        if (!schemaName) {
            throw new Error('schema name required');
        }
        const url = this.#mapToDomain("/schemas/" + schemaName + "/docs/");
        const payload = {
            id: docID,
            content: docContent,
        }
        interface schemaResponse {
            id: string,
        }
        let resp = await (this.#fetchResponseWithPayload(RequestMethod.POST, url, payload) as Promise<schemaResponse>);
        return resp.id;
    }

    /**
     * Update content of a document
     * @param {string} schemaName schema name
     * @param {string} docID document ID
     * @param {string} docContent document content in JSON format
     */
    async updateDocument(schemaName: string, docID: string, docContent: string) {
        if (!schemaName) {
            throw new Error('schema name required');
        }
        if (!docID) {
            throw new Error('document ID required');
        }
        const url = this.#mapToDomain("/schemas/" + schemaName + "/docs/" + docID);
        const payload = {
            content: docContent,
        }
        await this.#doRequestWithPayload(RequestMethod.PUT, url, payload);
    }

    /**
     * Update property value of a document
     * @param {string} schemaName schema name
     * @param {string} docID document ID
     * @param {string} propertyName property for updating
     * @param {PropertyType} valueType value type of property
     * @param {any} value value for property
     */
    async updateDocumentProperty(schemaName: string, docID: string, propertyName: string, valueType: PropertyType,
        value: any) {
        if (!schemaName) {
            throw new Error('schema name required');
        }
        if (!docID) {
            throw new Error('document ID required');
        }
        if (!propertyName) {
            throw new Error('property name required');
        }
        const url = this.#mapToDomain("/schemas/" + schemaName + "/docs/" + docID + '/properties/' + propertyName);
        const payload = {
            type: valueType,
            value: value
        };
        await this.#doRequestWithPayload(RequestMethod.PUT, url, payload);
    }

    /**
     * Remove a document
     * @param {string} schemaName schema name
     * @param {string} docID document ID
     */
    async removeDocument(schemaName: string, docID: string) {
        if (!schemaName) {
            throw new Error('schema name required');
        }
        if (!docID) {
            throw new Error('document ID required');
        }
        const url = this.#mapToDomain("/schemas/" + schemaName + "/docs/" + docID);
        await this.#doRequest(RequestMethod.DELETE, url);
    }

    /**
     * Check if document exists
     * @param {string} schemaName schema name
     * @param {string} docID document ID
     * @returns {boolean} true: exists / false: not exists
     */
    async hasDocument(schemaName: string, docID: string): Promise<boolean> {
        if (!schemaName) {
            throw new Error('schema name required');
        }
        if (!docID) {
            throw new Error('document ID required');
        }
        const url = this.#mapToDomain("/schemas/" + schemaName + "/docs/" + docID);
        return this.#peekRequest(RequestMethod.HEAD, url);
    }

    /**
     * Get document content
     * @param {string} schemaName schema name
     * @param {string} docID document ID
     * @returns {string} content in JSON format
     */
    async getDocument(schemaName: string, docID: string): Promise<string> {
        if (!schemaName) {
            throw new Error('schema name required');
        }
        if (!docID) {
            throw new Error('document ID required');
        }
        const url = this.#mapToDomain("/schemas/" + schemaName + "/docs/" + docID);
        let doc = await (this.#fetchResponse(RequestMethod.GET, url) as Promise<Document>);
        return doc.content;
    }

    /**
     * Query trace log of a document
     * @param {string} schemaName schema name
     * @param {string} docID document ID
     * @returns {LogRecords} trace log
     */
    async getDocumentLogs(schemaName: string, docID: string): Promise<LogRecords> {
        if (!schemaName) {
            throw new Error('schema name required');
        }
        if (!docID) {
            throw new Error('document ID required');
        }
        const url = this.#mapToDomain("/schemas/" + schemaName + "/docs/" + docID + "/logs/");
        return (this.#fetchResponse(RequestMethod.GET, url) as Promise<LogRecords>);
    }

    /**
     * Query documents by condition
     * @param {string} schemaName schema name 
     * @param {QueryCondition} condition query condition
     * @returns {DocumentRecords} matched documents
     */
    async queryDocuments(schemaName: string, condition: QueryCondition): Promise<DocumentRecords> {
        if (!schemaName) {
            throw new Error('schema name required');
        }
        const url = this.#mapToDomain("/queries/schemas/" + schemaName + "/docs/");
        return (this.#fetchResponseWithPayload(RequestMethod.POST, url, condition) as Promise<DocumentRecords>)
    }

    /**
     * Get meta actors of a document
     * @param {string} schemaName schema name
     * @param {string} docID document ID
     * @returns {ActorPrivileges[]} list of actor privileges
     */
    async getDocumentActors(schemaName: string, docID: string): Promise<ActorPrivileges[]> {
        if (!schemaName) {
            throw new Error('schema name required');
        }
        const url = this.#mapToDomain("/schemas/" + schemaName + "/docs/" + docID + "/actors/");
        return (this.#fetchResponse(RequestMethod.GET, url) as Promise<ActorPrivileges[]>);
    }

    /**
     * Update meta actors of a document 
     * @param {string} schemaName schema name
     * @param {string} docID document ID
     * @param {ActorPrivileges[]} actors list of actor privileges
     */
    async updateDocumentActors(schemaName: string, docID: string, actors: ActorPrivileges[]) {
        if (!schemaName) {
            throw new Error('schema name required');
        }
        if (!actors || 0 == actors.length) {
            throw new Error('actors required');
        }
        const url = this.#mapToDomain("/schemas/" + schemaName + "/docs/" + docID + "/actors/");
        const payload = {
            actors: actors
        };
        await this.#doRequestWithPayload(RequestMethod.PUT, url, payload);
    }

    //Smart contract operations

    /**
     * Query contracts with pagination
     * @param {number} queryStart start offset for querying, begin from 0
     * @param {number} maxRecord max record count returned
     * @returns ContractRecords
     */
    async queryContracts(queryStart: number, maxRecord: number): Promise<ContractRecords> {
        const url = this.#mapToDomain("/contracts/");
        const condtion = {
            offset: queryStart,
            limit: maxRecord,
        }
        return (this.#fetchResponseWithPayload(RequestMethod.POST, url, condtion) as Promise<ContractRecords>);
    }

    /**
     * Check if a contract exstis
     * @param {string} contractName target contract name
     * @returns  {boolean} true: exists/false: not exists
     */
    async hasContract(contractName: string): Promise<boolean> {
        if (!contractName) {
            throw new Error('contract name required');
        }
        const url = this.#mapToDomain("/contracts/" + contractName);
        return this.#peekRequest(RequestMethod.HEAD, url);
    }

    /**
     * Get define of a contract
     * @param {string} contractName target contract name
     * @returns  {ContractInfo} contract info
     */
    async getContract(contractName: string): Promise<ContractInfo> {
        if (!contractName) {
            throw new Error('contract name required');
        }
        const url = this.#mapToDomain("/contracts/" + contractName);
        interface responsePayload {
            name: string,
            content: string,
        }
        let resp = await (this.#fetchResponse(RequestMethod.GET, url) as Promise<responsePayload>);
        let content = resp.content;
        let define: ContractInfo = JSON.parse(content);
        return define;
    }

    /**
     * Get detail info of a contract
     * @param {string} contractName target contract name
     * @returns  {ContractInfo} contract info
     */
    async getContractInfo(contractName: string): Promise<ContractInfo> {
        if (!contractName) {
            throw new Error('contract name required');
        }
        const url = this.#mapToDomain("/contracts/" + contractName + '/info/');
        return this.#fetchResponse(RequestMethod.GET, url) as Promise<ContractInfo>;
    }

    /**
     * Deploy a contract define
     * @param {string} contractName contract name
     * @param {ContractDefine} define contract define
     */
    async deployContract(contractName: string, define: ContractDefine) {
        if (!contractName) {
            throw new Error('contract name required');
        }
        const url = this.#mapToDomain("/contracts/" + contractName);
        const payload = {
            content: JSON.stringify(define),
        }
        await this.#doRequestWithPayload(RequestMethod.PUT, url, payload);
    }

    /**
     * Invoke a contract with parameters
     * @param {string} contractName contract name
     * @param {string[]} parameters parameters for invoking contract
     */
    async callContract(contractName: string, parameters: string[]) {
        if (!contractName) {
            throw new Error('contract name required');
        }
        const url = this.#mapToDomain("/contracts/" + contractName + '/sessions/');
        const payload = {
            parameters: parameters,
        }
        await this.#doRequestWithPayload(RequestMethod.POST, url, payload);
    }

    /**
     * Withdraw a contract define
     * @param {string} contractName contract name
     */
    async withdrawContract(contractName: string) {
        if (!contractName) {
            throw new Error('contract name required');
        }
        const url = this.#mapToDomain("/contracts/" + contractName);
        await this.#doRequest(RequestMethod.DELETE, url);
    }

    /**
     * Enable contract tracing
     * @param {string} contractName contract name
     */
    async enableContractTrace(contractName: string) {
        if (!contractName) {
            throw new Error('contract name required');
        }
        const url = this.#mapToDomain("/contracts/" + contractName + '/trace/');
        const payload = {
            enable: true,
        }
        await this.#doRequestWithPayload(RequestMethod.PUT, url, payload);
    }

    /**
     * Enable contract tracing
     * @param {string} contractName contract name
     */
    async disableContractTrace(contractName: string) {
        if (!contractName) {
            throw new Error('contract name required');
        }
        const url = this.#mapToDomain("/contracts/" + contractName + '/trace/');
        const payload = {
            enable: false,
        }
        await this.#doRequestWithPayload(RequestMethod.PUT, url, payload);
    }

    /**
     * Get meta actors of a contract 
     * @param {string} contractName contract name
     * @returns {ActorPrivileges[]} list of actor privileges
     */
    async getContractActors(contractName: string): Promise<ActorPrivileges[]> {
        if (!contractName) {
            throw new Error('contract name required');
        }
        const url = this.#mapToDomain("/contracts/" + contractName + '/actors/');
        return (this.#fetchResponse(RequestMethod.GET, url) as Promise<ActorPrivileges[]>);
    }

    /**
     * Update meta actors of a contract 
     * @param {string} contractName contract name
     * @param {ActorPrivileges[]} actors list of actor privileges
     */
    async updateContractActors(contractName: string, actors: ActorPrivileges[]) {
        if (!contractName) {
            throw new Error('contract name required');
        }
        if (!actors || 0 == actors.length) {
            throw new Error('actors required');
        }
        const url = this.#mapToDomain("/contracts/" + contractName + '/actors/');
        const payload = {
            actors: actors
        };
        await this.#doRequestWithPayload(RequestMethod.PUT, url, payload);
    }

    //private functions

    #newNonce(): string {
        const nonceLength = 16;
        return Strings.random(nonceLength);
    }

    async #base64Signature(obj: object): Promise<string> {
        const content = Buffer.from(JSON.stringify(obj), 'utf-8');
        const signed = await ed25519.sign(content, this.#_privateKey);
        return Buffer.from(signed).toString(signatureEncode);
    }

    async #rawRequest(method: RequestMethod, path: string, headers: object, payload: object): Promise<object> {
        const url = this.#mapToAPI(path);
        headers[headerContentType] = contentTypeJSON;
        let options: requestOptions = {
            method: method,
            headers: headers,
            cache: 'no-store',
            next: {
                revalidate: 0
            }
        }
        if (payload) {
            options.body = JSON.stringify(payload);
        }
        return this.#getResult(url, options);
    }

    async #fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            controller.abort();
        }, this.#_request_timeout);
        let optionsWithSignal = {
            ...options,
            signal: controller.signal
        };
        let resp: Response;
        try {
            resp = await fetch(url, optionsWithSignal);
        } catch (e) {
            if (e.name === 'AbortError'){
                throw new Error(`request ${options.method}: ${url} timeout`)
            }else{
                throw new Error(`fetch ${options.method}: ${url} failed\n${e.message}`)
            }
            
        } finally {
            clearTimeout(timeoutId);
        }
        return resp;
    }

    async #peekRequest(method: RequestMethod, url: string): Promise<boolean> {
        let options = await this.#prepareOptions(method, url, null);
        let resp = await this.#fetchWithTimeout(url, options);
        return resp.ok;
    }

    async #validateResult(url: string, options: object) {
        await this.#parseResponse(url, options);
    }

    async #parseResponse(url: string, options: object): Promise<object> {
        let resp = await this.#fetchWithTimeout(url, options);
        if (!resp.ok) {
            throw new Error('fetch result failed with status ' + resp.status + ': ' + resp.statusText);
        }
        let payload = await resp.json();
        if (0 != payload[payloadPathErrorCode]) {
            throw new Error('fetch failed: ' + payload[payloadPathErrorMessage]);
        }
        return payload;
    }

    async #getResult(url: string, options: object): Promise<object> {
        let payload = await this.#parseResponse(url, options);
        return payload[payloadPathData];
    }

    async #doRequest(method: RequestMethod, url: string) {
        let options = await this.#prepareOptions(method, url, null);
        await this.#validateResult(url, options)
    }

    async #doRequestWithPayload(method: RequestMethod, url: string, payload: object) {
        let options = await this.#prepareOptions(method, url, payload);
        await this.#validateResult(url, options);
    }

    async #fetchResponse(method: RequestMethod, url: string): Promise<object> {
        let options = await this.#prepareOptions(method, url, null);
        return this.#getResult(url, options)
    }

    async #fetchResponseWithPayload(method: RequestMethod, url: string, payload: object): Promise<object> {
        let options = await this.#prepareOptions(method, url, payload);
        return this.#getResult(url, options)
    }

    async #prepareOptions(method: RequestMethod, url: string, payload: object): Promise<object> {
        const urlObject = new URL(url);
        const now = new Date();
        const timestamp = now.toISOString();
        let signatureContent = {
            id: this.#_sessionID,
            method: method.toUpperCase(),
            url: urlObject.pathname,
            body: '',
            access: this.#_accessID,
            timestamp: timestamp,
            nonce: this.#_nonce,
            signature_algorithm: signatureMethodEd25519,
        }
        let options: requestOptions = {
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
            let hash = CryptoJS.SHA256(bodyContent);
            signatureContent.body = CryptoJS.enc.Base64.stringify(hash);
        }
        const signature = await this.#base64Signature(signatureContent);
        headers[headerNameSession] = this.#_sessionID;
        headers[headerNameTimestamp] = timestamp;
        headers[headerNameSignatureAlgorithm] = signatureMethodEd25519;
        headers[headerNameSignature] = signature;
        options.headers = headers;
        if (this.#_trace) {
            console.log('<Chain-DEBUG> [%s]: signature payload\n%s', this.#_sessionID, JSON.stringify(signatureContent));
            console.log('<Chain-DEBUG> [%s]: signature: %s', this.#_sessionID, signature);
        }
        return options;
    }

    #mapToAPI(path: string): string {
        return this.#_apiBase + path;
    }

    #mapToDomain(path: string): string {
        return this.#_apiBase + '/domains/' + this.#_domain + path;
    }
}