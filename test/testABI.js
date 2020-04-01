// https://github.com/ethjs/examples
// https://github.com/indutny/bn.js

let contractAddress;
let net;
env = "dev";
if (env === "dev") {
    contractAddress = "0x9d13C6D3aFE1721BEef56B55D303B09E021E27ab";
    net = "http://quorum.tw-wallet.in2e.com:22000";
} else {
    contractAddress = "0xc8F717BA9593dc9d45c4518cf444d2cBd08AF24D";
    net = "http://127.0.0.1:22003";
}


const tokenABI = require("../build/contracts/TWPointERC20.json").abi;
const bytecode = require("../build/contracts/TWPointERC20.json").bytecode;
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider(net));
const EthContract = require('ethjs-contract');
const contract = new EthContract(eth);
const BN = require("bn.js");
const multiple = new BN("1000000000000000000", 10);

(async function () {
    try {
        console.log("\n--------------\n")
        let block = await eth.getBlockByNumber(1, true);
        console.log(JSON.stringify(block));

        console.log("\n--------------\n")

        let accounts = await eth.accounts();
        console.log(JSON.stringify(accounts));

        console.log("\n--------------\n")


        const token = eth.contract(tokenABI).at(contractAddress);
        let totalSupply = await token.totalSupply();
        console.log(totalSupply[0].toString(10));

        console.log("\n--------------\n")

        const TwContract = contract(tokenABI, bytecode, {
            from: accounts[0],
            gas: 300000,
        });
        // setup an instance of that contract
        const twContract = TwContract.at(contractAddress);
        let total = await twContract.totalSupply();
        console.log(total[0].toString(10));

        console.log("\n--------------\n")

        const name = await twContract.name();
        console.log(name[0]);

        console.log("\n--------------\n")
        // transfer 500
        const tw = multiple.mul(new BN(500));
        twContract.transfer("0xcA843569e3427144cEad5e4d5999a3D0cCF92B8e", tw)
            .then(txHash => eth.getTransactionSuccess(txHash))
            .then(receipt => console.log(receipt));

    } catch (error) {
        console.log(error.message);
    }
}())
