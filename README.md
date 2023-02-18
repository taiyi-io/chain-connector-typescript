# SDK of Chain Connector in Typescript

用于访问和操作链平台的Typescript SDK。

The Typescript SDK for accessing and operating on blockchain platform.

## 项目 Project

项目基于yarn管理

The project is managed based on yarn.

### 构建JS文件 Build a JavaScript file

```
$yarn build
```

编译成功后，输出dist/chain_connector.js

The file "dist/chain_connector.js" was generated when compiling success.

### 运行测试用例 Run testing

运行测试前，先将平台分配的私钥数据保存在"access_key.json"中，然后配置"package.json"的参数chain.host和chain.port设定好到网关的连接信息。

Before running the test, save the private key data allocated by the platform in "access_key.json", and then configure the parameters chain.host and chain.port of "package.json" to the service address of the gateway.

```
$yarn test
```



## 使用范例 Usage

### 连接链平台 Connect the chain

首先使用平台分配的私钥数据构建Connector，然后连接链平台的gateway模块。

Initial the connector using the private key data allocated by the chain platform, then connect to the gateway module.

```java
const filePath = path.join(process.cwd(), 'access_key.json');
const content = await fs.readFile(filePath, 'utf8');
let conn = NewConnectorFromAccess(JSON.parse(content));
await conn.connect(gatewayHost, gatewayPort);
```



## 构建与管理数字资产 Build and manage digital assets

首先为数字资产定义数据范式（Schema），然后就能够基于该Schema添加、修改、删除和查询数字资产(Document)。所有变更痕迹自动使用区块链技术持久化存储，并且能够通过getSchemaLog和getDocumentLog接口查询。

Define a data schema for digital assets, and then you can add, update, delete, and query documents (digital assets) under the schema. All changes are automatically persistently stored using blockchain and could be queried using getSchemaLog and getDocumentLog.

```java
//create new schema
const schemaName = 'sample';
let properties: DocumentProperty[] = [
    {
        name: 'name',
        type: PropertyType.String
    },
    {
        name: 'age',
        type: PropertyType.Integer
    },
    {
        name: 'available',
        type: PropertyType.Boolean
    }
];
await conn.createSchema(schemaName, properties);

//get schema define    
let current = await conn.getSchema(schemaName);
console.log('test schema created ok:\n' + JSON.stringify(current))
            

//add a document
let content = {
    name: 'hello',
    age: 20,
    available: true,
};
let docID = await conn.addDocument(schemaName, '', JSON.stringify(content));
//check a document
if (await conn.hasDocument(schemaName, docID)){
    //update a existed document
    let updatedContent = "{\"name\": \"alice\", \"age\": 18, \"available\": false}";
    await conn.updateDocument(schemaName, docID, content);
}

//get change trace of a document
let logs = await conn.getDocumentLogs(schemaName, docID);

//query documents
let condition = new QueryBuilder()
    .AscendBy("name")
    .MaxRecord(20)
    .SetOffset(0)
    .Build();
let records = await conn.queryDocuments(schemaName, condition);

//remove document
await conn.removeDocument(schemaName, docID);

```



### 部署和调用智能合约 Deploy and invoke the Smart Contract

部署智能合约时，需要设定合约名称和执行步骤。调用时，指定合约名称和调用参数就可以启动执行。系统允许打开追踪开关，查看合约执行计划和实际运行情况。

It is necessary to assign a name and execute steps to deploy a Smart Contract. Then initiate execution using the contract name and call parameters. The system can enable the trace option for a contract, which allows the user to review the contract's execution plan and steps.



```java
const contractName = "contract_create";
let contractDefine: ContractDefine = {
    steps: [
        {
            action: "create_doc",
            params: ["$s", "@1", "@2"],
        },
        {
            action: "set_property",
            params: ["$s", "catalog", "@3"],
        },
        {
            action: "set_property",
            params: ["$s", "balance", "@4"],
        },
        {
            action: "set_property",
            params: ["$s", "number", "@5"],
        },
        {
            action: "set_property",
            params: ["$s", "available", "@6"],
        },
        {
            action: "set_property",
            params: ["$s", "weight", "@7"],
        },
        {
            action: "update_doc",
            params: ["@1", "$s"],
        },
        {
            action: "submit",
        },
    ],
};

//check existed contract
if (await conn.hasContract(contractName)) {
    //withdraw existed contract
    await conn.withdrawContract(contractName);
    console.log('previous contract %s removed', createContractName)
}

//deploy contact
await conn.deployContract(contractName, contractDefine);

//enable trace option
let info = await conn.getContractInfo(contractName);
if (!info.isEnabled()) {
    await conn.enableContractTrace(contractName);
}

const docID = "contract-doc";
let parameters: string[] = {
    schemaName,
    docID,
    schemaName,
    Math.random().toString(10),
    Math.floor(Math.random() * 1000).toString(),
    Math.random() > 0.5 ? 'true' : 'false',
    (Math.random() * 200).toFixed(2),
};

//call contract with parameters
await conn.callContract(createContractName, parameters);

```



### 检查区块链与交易 Audit the block chain and transaction

通过SDK能够获取并检查链、区块、交易的全部详细信息，用于审计数据安全性和检查后台运行情况。

Through the SDK, you can obtain and check all the details of chains, blocks, and transactions, which can be used to audit data security and monitor the background operation.

```java
//check chain status
let status = await conn.getStatus();

//query blocks from height 1 to 10
let blockRecords = await conn.queryBlocks(1, 10);
for (let blockID of blockRecords.blocks) {
    //get block data
    let blockData = await conn.getBlock(blockID);
    //query transactions in a block
    let transactionRecords = await conn.queryTransactions(blockID, 0, 20);
    for (let transID of transactionRecords.transactions) {
        //get transaction data
        let transactionData = await conn.getTransaction(blockID, transID);
    }
}
```

