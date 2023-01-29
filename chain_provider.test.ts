import ChainProvider from "./chain_provider";
import { DocumentProperty, PropertyType, ContractDefine, QueryCondition, QueryBuilder } from './chain_sdk';

test('Test Schemas', async () => {
    let conn = await ChainProvider.connect();
    conn.Trace = true;
    const schemaName = 'js-test-case1-schema';
    console.log('schema test begin...');
    {
        let result = await conn.hasSchema(schemaName);
        if (result) {
            console.log('schema ' + schemaName + ' already exsits');
            await conn.deleteSchema(schemaName);
            console.log('previous schema ' + schemaName + ' deleted');
        } else {
            console.log('schema ' + schemaName + ' not exists')
        }
        console.log('test: check schema ok')
    }
    {
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
        let current = await conn.getSchema(schemaName);
        console.log('test schema created ok:\n' + JSON.stringify(current))
    }
    {
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
                name: 'amount',
                type: PropertyType.Currency
            },
            {
                name: 'country',
                type: PropertyType.String
            }
        ];
        await conn.updateSchema(schemaName, properties);
        let current = await conn.getSchema(schemaName);
        console.log('test schema updated ok:\n' + JSON.stringify(current))
    }
    {
        await conn.deleteSchema(schemaName);
        console.log('test schema deleted ok: ' + schemaName);
    }
    console.log('schema interfaces tested');
});

test('Test Documents', async () => {
    const docCount = 10;
    const propertyNameAge = 'age';
    const propertyNameEnabled = 'enabled';
    const schemaName = 'js-test-case2-document';
    const docPrefix = 'js-test-case2-';
    let conn = await ChainProvider.connect();
    conn.Trace = true;
    console.log('document test begin...');
    {
        let result = await conn.hasSchema(schemaName);
        if (result) {
            console.log('schema ' + schemaName + ' already exsits');
            await conn.deleteSchema(schemaName);
            console.log('previous schema ' + schemaName + ' deleted');
        }
    }

    let properties: DocumentProperty[] = [];
    await conn.createSchema(schemaName, properties);

    let docList: string[] = [];
    let content = '{}';
    for (let i = 0; i < docCount; i++) {
        let docID = docPrefix + (i + 1);
        let respID = await conn.addDocument(schemaName, docID, content);
        console.log('doc ' + respID + ' added');
        docList.push(respID);
    }

    properties = [
        {
            name: propertyNameAge,
            type: PropertyType.Integer,
        },
        {
            name: propertyNameEnabled,
            type: PropertyType.Boolean,
        },
    ]
    await conn.updateSchema(schemaName, properties);
    console.log('schema updated');
    for (let i = 0; i < docCount; i++) {
        let docID = docPrefix + (i + 1);
        if (0 === i % 2) {
            content = JSON.stringify({
                age: 0,
                enabled: false
            });
        } else {
            content = JSON.stringify({
                age: 0,
                enabled: true
            });
        }
        await conn.updateDocument(schemaName, docID, content);
        console.log('doc ' + docID + ' updated');
    }
    for (let i = 0; i < docCount; i++) {
        let docID = docPrefix + (i + 1);
        await conn.updateDocumentProperty(schemaName, docID, propertyNameAge, PropertyType.Integer, i);
        console.log('property age of doc ' + docID + ' updated');
    }

    //test query builder
    let verifyQuery = async (caseName: string, condition: QueryCondition, totalCount: number,
        expectResult: number[]) => {
        let records = await conn.queryDocuments(schemaName, condition);
        if (totalCount !== records.total) {
            throw new Error('unexpect count ' + records.total + ' => ' + totalCount + ' in case ' + caseName);
        }
        let recordCount = records.documents.length;
        if (expectResult.length !== recordCount) {
            throw new Error('unexpect result count ' + recordCount + ' => ' + expectResult.length + ' in case ' + caseName);
        }

        console.log(recordCount + ' / ' + totalCount + ' documents returned');
        for (let i = 0; i < recordCount; i++) {
            let expectValue = expectResult[i];
            let doc = records.documents[i];
            let contentPayload = JSON.parse(doc.content);
            if (expectValue !== contentPayload[propertyNameAge]) {
                throw new Error('unexpect value ' + contentPayload[propertyNameAge] + ' => ' + expectValue + ' at doc ' + doc.id);
            }
            console.log(caseName + ': content of doc ' + doc.id + ' verified');
        }
        console.log(caseName + ' test ok');
    }

    {
        //ascend query
        const l = 5;
        const o = 3;
        let condition = new QueryBuilder().AscendBy(propertyNameAge).MaxRecord(l).SetOffset(o).Build();
        let expected = [3, 4, 5, 6, 7];
        await verifyQuery("ascend query", condition, docCount, expected);
    }
    {
        //descend query with filter
        const l = 3;
        const total = 4;
        let condition = new QueryBuilder().
            DescendBy(propertyNameAge).
            MaxRecord(l).
            PropertyEqual("enabled", "true").
            PropertyLessThan(propertyNameAge, "8").Build();

        let expected = [7, 5, 3];
        await verifyQuery("descend filter", condition, total, expected);

    }
    for (let docID of docList) {
        await conn.removeDocument(schemaName, docID);
        console.log('doc ' + docID + ' removed');
    }

    await conn.deleteSchema(schemaName)
    console.log('test schema ' + schemaName + ' deleted')
    console.log('document interfaces tested');
})

test('Test Contracts', async () => {
    const propertyCatalog = "catalog";
    const propertyBalance = "balance";
    const propertyNumber = "number";
    const propertyAvailable = "available";
    const propertyWeight = "weight";
    const schemaName = 'js-test-case3-contract';
    let properties: DocumentProperty[] = [
        {
            name: propertyCatalog,
            type: PropertyType.String,
            indexed: true,
        },
        {
            name: propertyBalance,
            type: PropertyType.Currency,
            indexed: true,
        },
        {
            name: propertyNumber,
            type: PropertyType.Integer,
            indexed: true,
        },
        {
            name: propertyAvailable,
            type: PropertyType.Boolean,
        },
        {
            name: propertyWeight,
            type: PropertyType.Float,
            indexed: true,
        },
    ];
    let conn = await ChainProvider.connect();
    conn.Trace = true;
    console.log('contract test begin...');
    {
        let result = await conn.hasSchema(schemaName);
        if (result) {
            console.log('schema ' + schemaName + ' already exsits');
            await conn.deleteSchema(schemaName);
            console.log('previous schema ' + schemaName + ' deleted');
        }
    }
    await conn.createSchema(schemaName, properties);
    let varName = "$s"
    let createContract: ContractDefine = {
        steps: [
            {
                action: "create_doc",
                params: [varName, "@1", "@2"],
            },
            {
                action: "set_property",
                params: [varName, propertyCatalog, "@3"],
            },
            {
                action: "set_property",
                params: [varName, propertyBalance, "@4"],
            },
            {
                action: "set_property",
                params: [varName, propertyNumber, "@5"],
            },
            {
                action: "set_property",
                params: [varName, propertyAvailable, "@6"],
            },
            {
                action: "set_property",
                params: [varName, propertyWeight, "@7"],
            },
            {
                action: "update_doc",
                params: ["@1", varName],
            },
            {
                action: "submit",
            },
        ],
    };

    let deleteContract: ContractDefine = {
        steps: [
            {
                action: "delete_doc",
                params: ["@1", "@2"],
            },
            {
                action: "submit",
            },
        ],
    };

    const createContractName = 'contract_create';
    await conn.deployContract(createContractName, createContract);
    const deleteContractName = 'contract_delete';
    await conn.deployContract(deleteContractName, deleteContract);
    const docID = 'contract-doc';
    let parameters: string[] = [
        schemaName,
        docID,
        schemaName,
        Math.random().toString(10),
        Math.floor(Math.random() * 1000).toString(),
        Math.random() > 0.5 ? 'true' : 'false',
        (Math.random() * 200).toFixed(2),
    ];
    await conn.enableContractTrace(createContractName);
    await conn.callContract(createContractName, parameters);
    await conn.callContract(deleteContractName, [schemaName, docID]);
    let { total } = await conn.queryContracts(0, 10);
    console.log(total + ' contracts returned before withdraw');
    await conn.disableContractTrace(createContractName);
    await conn.withdrawContract(createContractName);
    await conn.withdrawContract(deleteContractName);
    total = (await conn.queryContracts(0, 10)).total;
    console.log(total + ' contracts returned after withdraw');

    //clean environment
    await conn.deleteSchema(schemaName)
    console.log('test schema ' + schemaName + ' deleted')
    console.log('contract interfaces tested');
})

test('Test Chain', async () => {
    let conn = await ChainProvider.connect();
    conn.Trace = true;
    console.log('chain test begin...');
    let status = await conn.getStatus();
    console.log('world version ' + status.world_version + ', block height ' + status.block_height);
    console.log('genesis block: ' + status.genesis_block + ', previous block: ' + status.previous_block);
    const maxRecord = 5;
    const lowestHeight = 1;
    let endHeight = status.block_height;
    let beginHeight;
    if (endHeight <= maxRecord) {
        beginHeight = lowestHeight;
    } else {
        beginHeight = endHeight - maxRecord;
    }
    let blockRecords = await conn.queryBlocks(beginHeight, endHeight);
    console.log('block range from ' + blockRecords.from + ' to ' + blockRecords.to + ' at height ' + blockRecords.height + ' returned');
    for (let blockID of blockRecords.blocks) {
        let blockData = await conn.getBlock(blockID);
        console.log('block ' + blockID + ' created at ' + blockData.timestamp + ' on height ' + blockData.height);
        console.log('previous block: => ' + blockData.previous_block);
        console.log('included transactions: ' + blockData.transactions);
        let transactionRecords = await conn.queryTransactions(blockID, 0, maxRecord);
        console.log(transactionRecords.transactions.length + ' / ' + transactionRecords.total + ' transactions returned');
        for (let transID of transactionRecords.transactions) {
            let transactionData = await conn.getTransaction(blockID, transID);
            if (transactionData.validated) {
                console.log('transaction ' + transactionData.transaction + ' created at ' + transactionData.timestamp + ' committed');
            } else {
                console.log('transaction ' + transactionData.transaction + ' created at ' + transactionData.timestamp + ' not commit');
            }
        }
    }

    console.log('chain interfaces tested');
})