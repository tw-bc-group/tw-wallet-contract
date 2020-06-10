#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const program = require('commander');
const transferUtil = require('./transfer');
const decodeUtil = require('./decodeTxRaw');
const txUtil = require('./getTransaction');
const inspect = require('./inspects');
const keystoreRead = require('./importKeystore');


program.version('eth cli 0.0.1');

program
    .command('transfer')
    .option('-c, --contract <type>', 'contract address')
    .option('-f, --from <type>', 'from address')
    .option('-p, --pk <type>', 'from address private key')
    .option('-t, --to <type>', 'to address')
    .option('-a, --abi <type>', 'abi')
    .option('-m, --money <type>', 'money')
    .option('--config <type>', 'config')
    .description('transfer token with PK')
    .action(transfer);

program
    .command('transferWithPassword')
    .option('-c, --contract <type>', 'contract address')
    .option('-f, --from <type>', 'from address')
    .option('-t, --to <type>', 'to address')
    .option('-a, --abi <type>', 'abi')
    .option('-m, --money <type>', 'money')
    .option('-p, --password <type>', 'password')
    .option('--config <type>', 'config')
    .description('transfer token by personal account')
    .action(transferWithPassword);

program
    .command('decode')
    .option('-r, --raw <type>', 'raw transaction')
    .option('-a, --abi <type>', 'abi')
    .option('--config <type>', 'config')
    .description('decode raw transaction')
    .action(decode);

program
    .command('getTx')
    .option('-h, --hash <type>', 'transaction hash')
    .option('-a, --abi <type>', 'abi')
    .option('--config <type>', 'config')
    .description('get transaction, decode data with abi')
    .action(getTx);

program
    .command('getBlockTxs')
    .option('-s, --start <type>', 'start block number')
    .option('-e, --end <type>', 'end block number')
    .option('-f, --filter-address <type>', 'filter address')
    .option('-a, --abi <type>', 'abi')
    .option('--config <type>', 'config')
    .description('get block transactions, decode data with abi')
    .action(getBlockTxs);

program
    .command('pool')
    .option('-c, --cmd <type>', 'content | inspect | status')
    .option('-u, --url <type>', 'url use by web3')
    .option('--config <type>', 'config url')
    .description('get transaction pool')
    .action(txPool);

program
    .command('recoverTx')
    .option('-r, --raw <type>', 'raw transaction')
    .option('--config <type>', 'config url')
    .description('recover transaction, return address')
    .action(recoverTx);

program
    .command('balanceOf')
    .option('-f, --from-address <type>', 'from address')
    .option('-c, --contract-address <type>', 'contract address')
    .option('-a, --abi <type>', 'abi')
    .option('--config <type>', 'config url')
    .description('balance of address')
    .action(balanceOf);

program
    .command('inspect')
    .option('-k, --privateKey <key>', 'private key')
    .description('derive private key to public key with address')
    .action(privateKeyToPublicKey);

program
    .command('keystore')
    .option('-f, --file <file>', 'file')
    .description('read keystore')
    .action(importKeyStore);

program.parse(process.argv);

function readConfig(configName = "config.js") {
    let config = {};
    const filePath = path.normalize(path.resolve(__dirname, './') + '/' + configName);
    console.log(`config path: ${filePath}`);
    if (fs.existsSync(filePath)) {
        config = require(filePath);
    }
    return config;
}

async function importKeyStore(cmdObj) {
    let {file,config: configName} = cmdObj;
    const config = readConfig(configName);
    const filePath = path.normalize(file);
    const Web3 = require("web3");
    const web3 = new Web3(config.url);
    keystoreRead(web3,filePath);
}

async function balanceOf(cmdObj) {
    let {fromAddress, contractAddress, abi, config: configName} = cmdObj;
    const config = readConfig(configName);
    if (!fromAddress) {
        fromAddress = config.fromAddress;
    }
    if (!contractAddress) {
        contractAddress = config.contractAddress;
    }
    if (!abi) {
        abi = config.abi;
    }

    console.log("\n--------------balanceOf--------------\n");
    console.log(`balanceOf command called - fromAddress: ${fromAddress}, contractAddress: ${contractAddress}\n`);
    const Web3 = require("web3");
    const web3 = new Web3(config.url);
    await transferUtil.balanceOf(web3, fromAddress, contractAddress, abi)
}

async function recoverTx(cmdObj) {
    let {raw, url, config: configName} = cmdObj;
    const config = readConfig(configName);
    if (!raw) {
        raw = config.raw;
    }
    if (!url) {
        url = config.url;
    }

    console.log("\n--------------recoverTx--------------\n");
    console.log(`recoverTx command called - raw: ${raw}\n`);
    const Web3 = require("web3");
    const web3 = new Web3(url);

    const ethers = require('ethers');
    const tx = ethers.utils.parseTransaction(raw);
    console.log(`decoded Tx: ${JSON.stringify(tx, null, 4)}`);

    const addr = web3.eth.accounts.recoverTransaction(raw);
    console.log(`address : ${addr}`);
}

async function txPool(cmdObj) {
    let {cmd, url, config: configName} = cmdObj
    const config = readConfig(configName);
    if (!cmd) {
        cmd = config.cmd;
    }
    if (!url) {
        url = config.url;
    }
    console.log("\n--------------txPool--------------\n");
    console.log(`txPool command called - cmd: ${cmd}, url: ${url}\n`);
    const Web3 = require("web3");
    const web3 = new Web3(url);
    web3.eth.extend({
        property: 'txpool',
        methods: [{
            name: 'content',
            call: 'txpool_content'
        }, {
            name: 'inspect',
            call: 'txpool_inspect'
        }, {
            name: 'status',
            call: 'txpool_status'
        }]
    });

    let ret;
    switch (cmd) {
        case "content":
            ret = await web3.eth.txpool.content();
            break;
        case "inspect":
            ret = await web3.eth.txpool.inspect();
            break;
        case "status":
            ret = await web3.eth.txpool.status();
            break;
        default:
            ret = await web3.eth.txpool.content();
    }
    console.log(JSON.stringify(ret, null, 4));
}

async function getBlockTxs(cmdObj) {
    let {start, end, filterAddress, abi, config: configName} = cmdObj
    const config = readConfig(configName);
    if (!start) {
        start = config.start;
    }
    if (!end) {
        end = config.end;
    }
    if (!filterAddress) {
        filterAddress = config.filterAddress;
    }
    if (!abi) {
        abi = config.abi;
    }
    console.log("\n--------------get block transactions--------------\n");
    console.log(`getBlockTxs command called - start: ${start}, end: ${end}, filterAddress: ${filterAddress}, abi length: ${JSON.stringify(abi.length)}\n`);
    const Web3 = require("web3");
    const web3 = new Web3(config.url);
    await txUtil.getBlockTxs(web3, start, end, filterAddress, abi);
}

async function getTx(cmdObj) {
    let {hash, abi, config: configName} = cmdObj;
    const config = readConfig(configName);
    if (!hash) {
        hash = config.hash;
    }
    if (!abi) {
        abi = config.abi;
    }
    console.log("\n--------------get transaction by hash--------------\n");
    console.log(`getTx command called - raw: ${hash}, abi length: ${JSON.stringify(abi.length)}\n`);
    const Web3 = require("web3");
    const web3 = new Web3(config.url);
    await txUtil.getTxHash(web3, hash, abi);
}

function decode(cmdObj) {
    let {raw, abi, config: configName} = cmdObj;
    const config = readConfig(configName);
    if (!raw) {
        raw = config.raw;
    }
    if (!abi) {
        abi = config.abi;
    }

    console.log("\n--------------decode--------------\n");
    console.log(`decode command called - raw: ${raw}, abi length: ${JSON.stringify(abi.length)}\n`);

    decodeUtil(raw, abi);
}

async function transfer(cmdObj) {
    let {contract: contractAddress, from: fromAddress, pk: fromAddressPK, to: toAddress, abi, money, password, config: configName} = cmdObj;
    const config = readConfig(configName);
    if (!contractAddress) {
        contractAddress = config.contractAddress;
    }
    if (!fromAddress) {
        fromAddress = config.fromAddress;
    }
    if (!toAddress) {
        toAddress = config.toAddress;
    }
    if (!abi) {
        abi = config.abi;
    }
    if (!password) {
        password = config.password;
    }
    if (!money) {
        money = config.money;
    }
    if (!fromAddressPK) {
        fromAddressPK = config.fromAddressPK;
    }

    const Web3 = require("web3");
    const web3 = new Web3(config.url);

    console.log("\n--------------Transfer--------------\n");
    console.log(`transfer command called - contractAddress: ${contractAddress}, fromAddress: ${fromAddress}, toAddress: ${toAddress}, money: ${money}`);

    await transferUtil.transfer(web3, contractAddress, fromAddress, fromAddressPK, toAddress, abi, money);
}

async function transferWithPassword(cmdObj) {
    let {contract: contractAddress, from: fromAddress, pk: fromAddressPK, to: toAddress, abi, money, password, config: configName} = cmdObj;
    const config = readConfig(configName);

    if (!contractAddress) {
        contractAddress = config.contractAddress;
    }
    if (!fromAddress) {
        fromAddress = config.fromAddress;
    }
    if (!toAddress) {
        toAddress = config.toAddress;
    }
    if (!abi) {
        abi = config.abi;
    }
    if (!password) {
        password = config.password;
    }
    if (!money) {
        money = config.money;
    }
    if (!fromAddressPK) {
        fromAddressPK = config.fromAddressPK;
    }

    const Web3 = require("web3");
    const web3 = new Web3(config.url);

    console.log("\n--------------Transfer By Personal Account--------------\n");
    console.log(`transfer command called - contractAddress: ${contractAddress}, fromAddress: ${fromAddress}, toAddress: ${toAddress}, money: ${money}`);

    await transferUtil.transferByPersonalAccount(web3, contractAddress, fromAddress, toAddress, abi, money, password);
}

function privateKeyToPublicKey(cmdObj) {
    let {privateKey: privateKey} = cmdObj;

    console.log(JSON.stringify(inspect.privateKeyToPublicKey(privateKey), null, 4));
}
