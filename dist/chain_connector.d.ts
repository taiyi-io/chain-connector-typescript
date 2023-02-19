export declare enum PropertyType {
    String = "string",
    Boolean = "bool",
    Integer = "int",
    Float = "float",
    Currency = "currency",
    Collection = "collection",
    Document = "document"
}
export interface AccessKey {
    private_data: {
        version: number;
        id: string;
        encode_method: string;
        private_key: string;
    };
}
export interface ChainStatus {
    world_version: string;
    block_height: number;
    previous_block: string;
    genesis_block: string;
    allocated_transaction_id: string;
}
export interface SchemaRecords {
    schemas: string[];
    limit: number;
    offset: number;
    total: number;
}
export interface DocumentProperty {
    name: string;
    type: PropertyType;
    indexed?: boolean;
    omissible?: boolean;
}
export interface DocumentSchema {
    name: string;
    properties?: DocumentProperty[];
}
export interface Document {
    id: string;
    content: string;
}
export declare enum FilterOperator {
    Equal = 0,
    NotEqual = 1,
    GreaterThan = 2,
    LesserThan = 3,
    GreaterOrEqual = 4,
    LesserOrEqual = 5
}
export interface ConditionFilter {
    property: string;
    operator: FilterOperator;
    value: string;
}
export interface QueryCondition {
    filters?: ConditionFilter[];
    since?: string;
    offset: number;
    limit?: number;
    order?: string;
    descend: boolean;
}
export declare class QueryBuilder {
    #private;
    constructor();
    PropertyEqual(propertyName: string, value: string): QueryBuilder;
    PropertyNotEqual(propertyName: string, value: string): QueryBuilder;
    PropertyGreaterThan(propertyName: string, value: string): QueryBuilder;
    PropertyLessThan(propertyName: string, value: string): QueryBuilder;
    PropertyGreaterOrEqual(propertyName: string, value: string): QueryBuilder;
    PropertyLessOrEqual(propertyName: string, value: string): QueryBuilder;
    StartFrom(value: string): QueryBuilder;
    SetOffset(offset: number): QueryBuilder;
    MaxRecord(limit: number): QueryBuilder;
    AscendBy(propertyName: string): QueryBuilder;
    DescendBy(propertyName: string): QueryBuilder;
    Build(): QueryCondition;
}
export interface DocumentRecords {
    documents?: Document[];
    limit: number;
    offset: number;
    total: number;
}
export interface TraceLog {
    version: number;
    timestamp: string;
    operate: string;
    invoker: string;
    block?: string;
    transaction?: string;
    confirmed: boolean;
}
export interface ContractStep {
    action: string;
    params?: string[];
}
export interface BlockData {
    id: string;
    timestamp: string;
    previous_block: string;
    height: number;
    transactions: number;
    content: string;
}
export interface BlockRecords {
    blocks: string[];
    from: number;
    to: number;
    height: number;
}
export interface TransactionData {
    block: string;
    transaction: string;
    timestamp: string;
    validated: boolean;
    content: string;
}
export interface TransactionRecords {
    transactions?: string[];
    offset: number;
    limit: number;
    total: number;
    has_more: boolean;
}
export interface ContractInfo {
    name: string;
    parameters?: number;
    steps?: number;
    version: number;
    modified_time: string;
    enabled: boolean;
    trace?: boolean;
}
export interface ContractParameter {
    name: string;
    description?: string;
}
export interface ContractDefine {
    steps: ContractStep[];
    parameters?: ContractParameter[];
}
export interface ContractRecords {
    contracts: ContractInfo[];
    limit: number;
    offset: number;
    total: number;
}
export interface LogRecords {
    latest_version: number;
    logs?: TraceLog[];
}
export interface ActorPrivileges {
    group: string;
    owner: boolean;
    executor: boolean;
    updater: boolean;
    viewer: boolean;
}
export declare function NewConnectorFromAccess(key: AccessKey): ChainConnector;
export declare function NewConnector(accessID: string, privateKey: Uint8Array): ChainConnector;
export declare class ChainConnector {
    #private;
    constructor(accessID: string, privateKey: Uint8Array);
    get Version(): string;
    get SessionID(): string;
    get AccessID(): string;
    get LocalIP(): string;
    get ProjectName(): string;
    set Trace(flag: boolean);
    set Timeout(timeoutInSeconds: number);
    /**
     * connect to gateway for default domain
     * @param {string} host gateway host, IPv4 format
     * @param {number} port gateway port for API
     * @returns response payload
     */
    connect(host: string, port: number): Promise<object>;
    /**
     * connect to a specified domain
     * @param {string} host gateway host, IPv4 format
     * @param {number} port gateway port for API
     * @param {string} domainName domain name for connecting
     * @returns response payload
     */
    connectToDomain(host: string, port: number, domainName: string): Promise<object>;
    setProjectName(name: string): void;
    /**
     * Keep established session alive
     */
    activate(): Promise<void>;
    /**
     * Get Current Chain Status
     *
     * @returns {Promise<ChainStatus>} return status object
     *
     */
    getStatus(): Promise<ChainStatus>;
    /**
     * Query blocks with pagination
     * @param {number} beginHeight begin block height, start from 1
     * @param {number} endHeight end block height, start from 1
     * @returns {BlockRecords} list of block records
     */
    queryBlocks(beginHeight: number, endHeight: number): Promise<BlockRecords>;
    /**
     * Get block data by ID
     * @param {string} blockID block ID
     * @returns {BlockData} block data
     */
    getBlock(blockID: string): Promise<BlockData>;
    /**
     * Query transactions using pagination
     * @param {string} blockID block ID
     * @param {number} start start offset for querying, start from 0
     * @param {number} maxRecord max records returned
     * @returns {TransactionRecords} transaction records
     */
    queryTransactions(blockID: string, start: number, maxRecord: number): Promise<TransactionRecords>;
    /**
     * Get data of a transaction
     * @param {string} blockID block ID
     * @param {string} transID transaction ID
     * @returns {TransactionData} transaction data
     */
    getTransaction(blockID: string, transID: string): Promise<TransactionData>;
    /**
     * Return list of current schemas
     *
     * @param {int} queryStart start offset when querying
     * @param {int} maxRecord max records could returne
     * @returns {Promise<SchemaRecords>} return records
     */
    querySchemas(queryStart: number, maxRecord: number): Promise<SchemaRecords>;
    /**
     * Rebuild index of a schema
     * @param {string} schemaName schema for rebuilding
     */
    rebuildIndex(schemaName: string): Promise<void>;
    /**
     * Create a new schema
     * @param {string} schemaName Name of new schema
     * @param {DocumentProperty[]} properties Properties of new schema
     */
    createSchema(schemaName: string, properties: DocumentProperty[]): Promise<void>;
    /**
     * Update exist schema
     * @param  {string} schemaName Name of schema
     * @param  {DocumentProperty[]} properties Properties of schema for updating
     */
    updateSchema(schemaName: string, properties: DocumentProperty[]): Promise<void>;
    /**
     * Delete a schema
     * @param schemaName name of target schema
     */
    deleteSchema(schemaName: string): Promise<void>;
    /**
     * Check if a schema exstis
     * @param {string} schemaName target schema name
     * @returns  {boolean} true: exists/false: not exists
     */
    hasSchema(schemaName: string): Promise<boolean>;
    /**
     * Get a schema
     * @param {string} schemaName target schema name
     * @returns {DocumentSchema} schema define
     */
    getSchema(schemaName: string): Promise<DocumentSchema>;
    /**
     * Get trace log of a schema
     * @param {string} schemaName schema name
     * @returns {LogRecords} list of log records
     */
    getSchemaLog(schemaName: string): Promise<LogRecords>;
    /**
     * Get meta actors of a schema
     * @param {string} schemaName schema name
     * @returns {ActorPrivileges[]} list of actor privileges
     */
    getSchemaActors(schemaName: string): Promise<ActorPrivileges[]>;
    /**
     * Update meta actors of a schema
     * @param {string} schemaName schema name
     * @param {ActorPrivileges[]} actors list of actor privileges
     */
    updateSchemaActors(schemaName: string, actors: ActorPrivileges[]): Promise<void>;
    /**
     * Add a new document to schema
     * @param {string} schemaName schema name
     * @param {string} docID optional document ID, generate when omit
     * @param {string} docContent document content in JSON format
     * @returns {string} document ID
     */
    addDocument(schemaName: string, docID: string, docContent: string): Promise<string>;
    /**
     * Update content of a document
     * @param {string} schemaName schema name
     * @param {string} docID document ID
     * @param {string} docContent document content in JSON format
     */
    updateDocument(schemaName: string, docID: string, docContent: string): Promise<void>;
    /**
     * Update property value of a document
     * @param {string} schemaName schema name
     * @param {string} docID document ID
     * @param {string} propertyName property for updating
     * @param {PropertyType} valueType value type of property
     * @param {any} value value for property
     */
    updateDocumentProperty(schemaName: string, docID: string, propertyName: string, valueType: PropertyType, value: any): Promise<void>;
    /**
     * Remove a document
     * @param {string} schemaName schema name
     * @param {string} docID document ID
     */
    removeDocument(schemaName: string, docID: string): Promise<void>;
    /**
     * Check if document exists
     * @param {string} schemaName schema name
     * @param {string} docID document ID
     * @returns {boolean} true: exists / false: not exists
     */
    hasDocument(schemaName: string, docID: string): Promise<boolean>;
    /**
     * Get document content
     * @param {string} schemaName schema name
     * @param {string} docID document ID
     * @returns {string} content in JSON format
     */
    getDocument(schemaName: string, docID: string): Promise<string>;
    /**
     * Query trace log of a document
     * @param {string} schemaName schema name
     * @param {string} docID document ID
     * @returns {LogRecords} trace log
     */
    getDocumentLogs(schemaName: string, docID: string): Promise<LogRecords>;
    /**
     * Query documents by condition
     * @param {string} schemaName schema name
     * @param {QueryCondition} condition query condition
     * @returns {DocumentRecords} matched documents
     */
    queryDocuments(schemaName: string, condition: QueryCondition): Promise<DocumentRecords>;
    /**
     * Get meta actors of a document
     * @param {string} schemaName schema name
     * @param {string} docID document ID
     * @returns {ActorPrivileges[]} list of actor privileges
     */
    getDocumentActors(schemaName: string, docID: string): Promise<ActorPrivileges[]>;
    /**
     * Update meta actors of a document
     * @param {string} schemaName schema name
     * @param {string} docID document ID
     * @param {ActorPrivileges[]} actors list of actor privileges
     */
    updateDocumentActors(schemaName: string, docID: string, actors: ActorPrivileges[]): Promise<void>;
    /**
     * Query contracts with pagination
     * @param {number} queryStart start offset for querying, begin from 0
     * @param {number} maxRecord max record count returned
     * @returns ContractRecords
     */
    queryContracts(queryStart: number, maxRecord: number): Promise<ContractRecords>;
    /**
     * Check if a contract exstis
     * @param {string} contractName target contract name
     * @returns  {boolean} true: exists/false: not exists
     */
    hasContract(contractName: string): Promise<boolean>;
    /**
     * Get define of a contract
     * @param {string} contractName target contract name
     * @returns  {ContractDefine} contract define
     */
    getContract(contractName: string): Promise<ContractDefine>;
    /**
     * Get detail info of a contract
     * @param {string} contractName target contract name
     * @returns  {ContractInfo} contract info
     */
    getContractInfo(contractName: string): Promise<ContractInfo>;
    /**
     * Deploy a contract define
     * @param {string} contractName contract name
     * @param {ContractDefine} define contract define
     */
    deployContract(contractName: string, define: ContractDefine): Promise<void>;
    /**
     * Invoke a contract with parameters
     * @param {string} contractName contract name
     * @param {string[]} parameters parameters for invoking contract
     */
    callContract(contractName: string, parameters: string[]): Promise<void>;
    /**
     * Withdraw a contract define
     * @param {string} contractName contract name
     */
    withdrawContract(contractName: string): Promise<void>;
    /**
     * Enable contract tracing
     * @param {string} contractName contract name
     */
    enableContractTrace(contractName: string): Promise<void>;
    /**
     * Enable contract tracing
     * @param {string} contractName contract name
     */
    disableContractTrace(contractName: string): Promise<void>;
    /**
     * Get meta actors of a contract
     * @param {string} contractName contract name
     * @returns {ActorPrivileges[]} list of actor privileges
     */
    getContractActors(contractName: string): Promise<ActorPrivileges[]>;
    /**
     * Update meta actors of a contract
     * @param {string} contractName contract name
     * @param {ActorPrivileges[]} actors list of actor privileges
     */
    updateContractActors(contractName: string, actors: ActorPrivileges[]): Promise<void>;
}
//# sourceMappingURL=chain_connector.d.ts.map