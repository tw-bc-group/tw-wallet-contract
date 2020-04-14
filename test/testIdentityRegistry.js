const Web3 = require("web3");
const web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider("http://127.0.0.1:22001"));

const abi = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "initiator",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "ownerAddress",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "did",
                "type": "string"
            },
            {
                "indexed": false,
                "name": "publicKey",
                "type": "string"
            },
            {
                "indexed": false,
                "name": "name",
                "type": "string"
            }
        ],
        "name": "IdentityCreated",
        "type": "event"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "ownerAddress",
                "type": "address"
            }
        ],
        "name": "identityExists",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "ownerAddress",
                "type": "address"
            }
        ],
        "name": "getIdentity",
        "outputs": [
            {
                "name": "_ownerAddress",
                "type": "address"
            },
            {
                "name": "_did",
                "type": "string"
            },
            {
                "name": "_publicKey",
                "type": "string"
            },
            {
                "name": "_name",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "ownerAddress",
                "type": "address"
            },
            {
                "name": "did",
                "type": "string"
            },
            {
                "name": "publicKey",
                "type": "string"
            },
            {
                "name": "name",
                "type": "string"
            }
        ],
        "name": "createIdentity",
        "outputs": [
            {
                "name": "_ownerAddress",
                "type": "address"
            },
            {
                "name": "_did",
                "type": "string"
            },
            {
                "name": "_publicKey",
                "type": "string"
            },
            {
                "name": "_name",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
const address = '0x8a5E2a6343108bABEd07899510fb42297938D41F';

const IdentityRegistry = new web3.eth.Contract(abi, address);

const userAddress = "0xcA843569e3427144cEad5e4d5999a3D0cCF92B8e";
web3.eth.getBalance(userAddress)
    .then(data => {
        console.log(data);
    });

IdentityRegistry.methods.createIdentity(userAddress, `DID:TW:${userAddress}`, userAddress, 'node2')
    .send({
        from: userAddress,
        gas: 3000000
    })
    .on('transactionHash', function (hash) {
        console.log("hash:", hash);
        IdentityRegistry.methods.getIdentity(userAddress)
            .call(null, (error, result) => {
                console.log('the data : ' + result);
                console.log('the data : ' + JSON.stringify(result));
            });
    });

