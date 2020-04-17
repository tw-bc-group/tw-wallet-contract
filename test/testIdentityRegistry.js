const Web3 = require("web3");
const web3 = new Web3();
// web3.setProvider(new Web3.providers.HttpProvider("http://quorum.tw-wallet.in2e.com:22001"));
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
const contractAddress = '0x11aC39ac7D780a6b9DdfC8687831e25B655884c7';
const identityRegistryContract = new web3.eth.Contract(abi, contractAddress);

const userAddress = "0xcA843569e3427144cEad5e4d5999a3D0cCF92B8e";
const userAddressPK = "4762e04d10832808a0aebdaa79c12de54afbe006bfffd228b3abcc494fe986f9";

const IdentityRegistry = new web3.eth.Contract(abi, contractAddress);

function getBalance() {
    web3.eth.getBalance(userAddress)
        .then(data => {
            console.log(data);
        });
}

async function verifySignatureForMessage(oriMessage, address, pass) {
    const sha3Data = web3.utils.sha3(oriMessage);
    const sig = await web3.eth.personal.sign(sha3Data, address, pass);
    const recAddress = await web3.eth.personal.ecRecover(sha3Data, sig);
    console.log(`recAddress: ${recAddress}`);
    console.log(`oriAddress: ${address}`);
    console.log(recAddress.toLowerCase() === address.toLowerCase());
    console.log(sig);
}

function messageHash(msg) {
    return web3.utils.sha3('\x19Ethereum Signed Message:\n' + msg.length + msg);
}

async function createIdentity() {
    // necessary parameters for createIdentity method：`address`、`did`、`public key`、`name`
    const createIdentityMethod = identityRegistryContract.methods.createIdentity(userAddress, `DID:TW:${userAddress}`, userAddress, 'node2');
    const data = createIdentityMethod.encodeABI();
    const nonce = await web3.eth.getTransactionCount(userAddress);

    const tx = await web3.eth.accounts.signTransaction({
        nonce: web3.utils.toHex(nonce),
        to: contractAddress, // note: this is contractAddress, not toAddress
        gasPrice: 0,
        gas: 3000000,
        data: data
    }, userAddressPK);
    const rawSignedTransaction = tx.rawTransaction;
    console.log(rawSignedTransaction); // note: for logging signed transaction raw data

    // verify transaction signature
    const recoverAddress = web3.eth.accounts.recoverTransaction(rawSignedTransaction);
    console.log(`\nRecoverAddress: ${recoverAddress}\n`);
    console.log(`Match? : ${recoverAddress.toLowerCase() === userAddress.toLowerCase()}`);

    // send raw signed transaction
    const receipt = await web3.eth.sendSignedTransaction(rawSignedTransaction);
    console.log(`receipt: ${JSON.stringify(receipt.blockHash, null, 4)}`);
}


async function getIdentity() {
    // Another way to get identity
    const getIdentity = IdentityRegistry.methods.getIdentity(userAddress);
    const data = getIdentity.encodeABI();
    const nonce = await web3.eth.getTransactionCount(userAddress);
    const tx = await web3.eth.accounts.signTransaction({
        nonce: web3.utils.toHex(nonce),
        to: contractAddress, // note: this is contractAddress, not toAddress
        gasPrice: 0,
        gas: 3000000,
        data: data
    }, userAddressPK);
    const receipt = await web3.eth.sendSignedTransaction(tx.rawTransaction);

    console.log(`receipt: ${JSON.stringify(receipt.blockHash, null, 4)}`);
    console.log(`receipt: ${JSON.stringify(receipt, null, 4)}`);

    IdentityRegistry.methods.getIdentity(userAddress)
        .call(null, (error, result) => {
            console.log('the data : ' + JSON.stringify(result));
        });
}

// getBalance();
// verifySignatureForMessage('hello world', userAddress, '');
// createIdentity();
getIdentity();