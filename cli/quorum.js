#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const program = require('commander');
const transferUtil = require('./transfer').transfer;

let config = {};
// 配置文件如果存在则读取
if (fs.existsSync(path.resolve('config.js'))) {
    config = require(path.resolve('config.js'));
}

program.version('quorum cli 0.0.1');
program
    .command('transfer')
    .option('-c, --contract <type>', 'contract address')
    .option('-f, --from <type>', 'from address')
    .option('-p, --pk <type>', 'from address private key')
    .option('-t, --to <type>', 'to address')
    .option('-a, --abi <type>', 'abi')
    .option('-m, --money <type>', 'money')
    .description('transfer token')
    .action(transfer);

program.parse(process.argv);

async function transfer(cmdObj) {
    let {contract: contractAddress, from: fromAddress, pk: fromAddressPK, to: toAddress, abi, money, password} = cmdObj;
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

    console.log("\n--------------web3 Quorum : TWPointERC20 Transfer--------------\n");
    console.log(`transfer command called - contractAddress: ${contractAddress}, fromAddress: ${fromAddress}, toAddress: ${toAddress}, money: ${money}`);

    await transferUtil(web3, contractAddress, fromAddress, fromAddressPK, toAddress, abi, money);
}

