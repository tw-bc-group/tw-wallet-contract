#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const program = require('commander');
const transferUtil = require('./transfer');

program.version('quorum cli 0.0.1');
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

program.parse(process.argv);

function readConfig(configName = "config.js") {
    let config = {};
// 配置文件如果存在则读取
    const filePath = path.resolve(__dirname, './') + '/' + configName;
    console.log(`config path: ${filePath}`);
    if (fs.existsSync(filePath)) {
        config = require(filePath);
    }
    return config;
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

    console.log("\n--------------web3 Quorum : TWPointERC20 Transfer--------------\n");
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

    console.log("\n--------------web3 Quorum : TWPointERC20 Transfer By Personal Account--------------\n");
    console.log(`transfer command called - contractAddress: ${contractAddress}, fromAddress: ${fromAddress}, toAddress: ${toAddress}, money: ${money}`);

    await transferUtil.transferByPersonalAccount(web3, contractAddress, fromAddress, toAddress, abi, money, password);
}
