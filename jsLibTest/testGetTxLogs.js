/**
 * 获取erc20合约转账的信息，从最近的100block同步，所以可以先转账，然后再获取信息
 */


let contractAddress;
let net;
env = "dev";
if (env === "dev") {
    contractAddress = "0xd9d64b7DC034fAfDbA5DC2902875A67b5d586420";
    net = "http://quorum.tw-wallet.in2e.com:22003";
} else if (env === "local-quorum") {
    contractAddress = "0xc8F717BA9593dc9d45c4518cf444d2cBd08AF24D";
    net = "http://127.0.0.1:22003";
} else {
    contractAddress = "0xC48eCD20A2882926CFcc09e03a8f828D0a6EBCDC";
    net = "http://127.0.0.1:7545";
}

// 当不知道ABI或者在浏览器简单查看余额的时候,可以用这个
const balanceABI = [
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": false,
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "balance",
                "type": "uint256"
            }
        ],
        "payable": false,
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "type": "function"
    }
];
const tokenABI = require("../build/contracts/TWPointERC20.json").abi;
const bytecode = require("../build/contracts/TWPointERC20.json").bytecode;
const toAddress = "0xcA843569e3427144cEad5e4d5999a3D0cCF92B8e";
const Web3 = require("web3");
const web3 = new Web3(net);
const multiple = new Web3.utils.BN("1000000000000000000", 10);// use web3.utils.toWei('1', 'ether') instead
const abiDecoder = require('abi-decoder');
abiDecoder.addABI(tokenABI);

async function getTransactionsByAddr(web3, myAccount, startBlockNumber, endBlockNumber) {
    if (endBlockNumber == null) {
        endBlockNumber = await web3.eth.getBlockNumber();
        console.log("Using endBlockNumber: " + endBlockNumber);
    }
    if (startBlockNumber == null) {
        startBlockNumber = endBlockNumber - 100;
        console.log("Using startBlockNumber: " + startBlockNumber);
    }
    console.log("Searching for transactions to/from account \"" + myAccount + "\" within blocks " + startBlockNumber + " and " + endBlockNumber);
    for (let i = endBlockNumber; i >= startBlockNumber; i--) {
        if (i % 1000 == 0) {
            console.log("Searching block " + i);
        }
        const block = await web3.eth.getBlock(i, true);
        if (block != null && block.transactions != null) {
            for (const e of block.transactions) {
                if (myAccount === "*" || myAccount === e.from || myAccount === e.to) {
                    await getTxHash(e.hash);
                }
            }
        }
    }
}

async function getTxHash(hash) {
    const receipt = await web3.eth.getTransactionReceipt(hash);
    if (receipt && receipt.logs) {
        const decodedLogs = abiDecoder.decodeLogs(receipt.logs);
        if (decodedLogs && decodedLogs.length > 0) {
            console.log(`receipt : ${JSON.stringify(receipt, null, 4)}`);
            console.log(`decodedLogs : ${JSON.stringify(decodedLogs, null, 4)}\n`);
        }
    }
}

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


(async function () {
    try {
        // web3.eth.txpool.content().then((d)=>{console.log()}).catch(console.error);
        // await getTxHash("0x9f98cd6d322e153b211eb5a0683a5540cf22e0c0ec247c9a3140c1150b46e858");
        // const end = await web3.eth.getBlockNumber();
        await getTransactionsByAddr(web3, "0xed9d02e382b34818e88B88a309c7fe71E65f419d");
    } catch (error) {
        console.log(error.message);
    }
}());


//
// Using endBlockNumber: 100166
// Using startBlockNumber: 100066
// Searching for transactions to/from account "0xed9d02e382b34818e88B88a309c7fe71E65f419d" within blocks 100066 and 100166
// receipt : {
//     "blockHash": "0x99dee0f0bf6167ee98de115b8751d0932c43c639062b68579046c36299f10268",
//         "blockNumber": 100150,
//         "contractAddress": null,
//         "cumulativeGasUsed": 51623,
//         "from": "0xed9d02e382b34818e88b88a309c7fe71e65f419d",
//         "gasUsed": 51623,
//         "logs": [
//         {
//             "address": "0x9d13C6D3aFE1721BEef56B55D303B09E021E27ab",
//             "topics": [
//                 "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
//                 "0x000000000000000000000000ed9d02e382b34818e88b88a309c7fe71e65f419d",
//                 "0x0000000000000000000000000e2d9bc5de5f01d580ebeb749b657401bba8029d"
//             ],
//             "data": "0x00000000000000000000000000000000000000000000000c08de6fcb28b80000",
//             "blockNumber": 100150,
//             "transactionHash": "0x621a60b4f39dbaf205719e6944f7faa3cf16d25620aa9206d8c827123f35f8bd",
//             "transactionIndex": 0,
//             "blockHash": "0x99dee0f0bf6167ee98de115b8751d0932c43c639062b68579046c36299f10268",
//             "logIndex": 0,
//             "removed": false,
//             "id": "log_d42d85c6"
//         }
//     ],
//         "logsBloom": "0x00000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000008000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000010000000080000200000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000008000000000000020000000000",
//         "status": true,
//         "to": "0x9d13c6d3afe1721beef56b55d303b09e021e27ab",
//         "transactionHash": "0x621a60b4f39dbaf205719e6944f7faa3cf16d25620aa9206d8c827123f35f8bd",
//         "transactionIndex": 0
// }
// decodedLogs : [
//     {
//         "name": "Transfer",
//         "events": [
//             {
//                 "name": "from",
//                 "type": "address",
//                 "value": "0xed9d02e382b34818e88b88a309c7fe71e65f419d"
//             },
//             {
//                 "name": "to",
//                 "type": "address",
//                 "value": "0x0e2d9bc5de5f01d580ebeb749b657401bba8029d"
//             },
//             {
//                 "name": "value",
//                 "type": "uint256",
//                 "value": "222000000000000000000"
//             }
//         ],
//         "address": "0x9d13C6D3aFE1721BEef56B55D303B09E021E27ab"
//     }
// ]
//
