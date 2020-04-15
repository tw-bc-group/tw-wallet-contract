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

const userAddress = "0xBCF5f18a2A48f21090dB98161C86530C9C3Be656";
const userAddressPK = "b531596f28eeae3b49834d71b22abeddebc7b8845c8538ad3f75f1b38930cc8c";

const IdentityRegistry = new web3.eth.Contract(abi, contractAddress);

function getBalance() {
    web3.eth.getBalance(userAddress)
        .then(data => {
            console.log(data);
        });
}

// async function unlockAccount() {
// // Signs data using a specific account
// // Sending your account password over an unsecured HTTP RPC connection is highly unsecure.
//     let unlock = await web3.eth.personal.unlockAccount('0xed9d02e382b34818e88B88a309c7fe71E65f419d', '', 600);
//     console.log(`unlock ${userAddress} : ${unlock}`);
// }
// unlockAccount();

// 不在同一个节点上的账户，需要 signTransaction
// IdentityRegistry.methods.createIdentity(userAddress, `DID:TW:${userAddress}`, userAddress, 'node2')
//     .send({
//         from: userAddress,
//         gas: 3000000
//     })
//     .on('transactionHash', function (hash) {
//         console.log("hash:", hash);
//     });
//

async function createIdentity() {
    // const gas = await createIdentityMethod.estimateGas({from: userAddress});
    // console.log(gas);

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

    // const receipt = await web3.eth.sendSignedTransaction(rawSignedTransaction);
    // console.log(`receipt: ${JSON.stringify(receipt.blockHash, null, 4)}`);
}

async function getIdentity() {
    // const getIdentity = IdentityRegistry.methods.getIdentity(userAddress);
    // const data = getIdentity.encodeABI();
    // const nonce = await web3.eth.getTransactionCount(userAddress);
    // const tx = await web3.eth.accounts.signTransaction({
    //     nonce: web3.utils.toHex(nonce),
    //     to: contractAddress, // note: this is contractAddress, not toAddress
    //     gasPrice: 0,
    //     gas: 3000000,
    //     data: data
    // }, userAddressPK);
    // const receipt = await web3.eth.sendSignedTransaction(tx.rawTransaction);
    //
    // console.log(`receipt: ${JSON.stringify(receipt.blockHash, null, 4)}`);
    // console.log(`receipt: ${JSON.stringify(receipt, null, 4)}`);

    IdentityRegistry.methods.getIdentity(userAddress)
        .call(null, (error, result) => {
            console.log('the data : ' + result);
            console.log('the data : ' + JSON.stringify(result));
        });
}

getBalance();
createIdentity();
getIdentity();