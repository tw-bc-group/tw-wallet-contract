module.exports = {
    // another account has twp
    fromAddress: "0xcA843569e3427144cEad5e4d5999a3D0cCF92B8e",
    fromAddressPK:"4762E04D10832808A0AEBDAA79C12DE54AFBE006BFFFD228B3ABCC494FE986F9",
    toAddress: "0x9186eb3d20cbd1f5f992a950d808c4495153abd5",

    // weili node

    // fromAddress: "0xed9d02e382b34818e88B88a309c7fe71E65f419d",
    // fromAddressPK:"E6181CAAFFFF94A09D7E332FC8DA9884D99902C7874EB74354BDCADF411929F1",
    // toAddress: "0xcA843569e3427144cEad5e4d5999a3D0cCF92B8e",
    contractAddress: "0x624d400315312c6280F6dB7683ACf2128EbB9d46",
    url: 'http://quorum.tw-wallet.in2e.com:22001',

    // my local node
    // fromAddress: "0x9186eb3d20cbd1f5f992a950d808c4495153abd5",
    // fromAddressPK:"794392BA288A24092030BADAADFEE71E3FA55CCEF1D70C708BAF55C07ED538A8",
    // toAddress: "0xcA843569e3427144cEad5e4d5999a3D0cCF92B8e",
    // contractAddress: "0xc8F717BA9593dc9d45c4518cf444d2cBd08AF24D",
    // url: 'http://127.0.0.1:22003',

    raw:"0xf8a52180832dc6c0949d13c6d3afe1721beef56b55d303b09e021e27ab80b844a9059cbb000000000000000000000000ca843569e3427144cead5e4d5999a3d0ccf92b8e000000000000000000000000000000000000000000000003ee23bde0e7d1fc1825a0922aa16dedd99f2c678e87e164f4692638b32f2dd783831de0142dbcecc5312ea031d59be170f7f71dcc8002abb1099d4cb20a6bc747e5f9e9efcbe5e954ccc59e",
    hash:"0x621a60b4f39dbaf205719e6944f7faa3cf16d25620aa9206d8c827123f35f8bd",

    password: "",
    money: "8.8",
    "abi": [
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
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "spender",
                    "type": "address"
                },
                {
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "totalSupply",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
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
                    "name": "sender",
                    "type": "address"
                },
                {
                    "name": "recipient",
                    "type": "address"
                },
                {
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "transferFrom",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "DECIMALS",
            "outputs": [
                {
                    "name": "",
                    "type": "uint8"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "INITIAL_SUPPLY",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
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
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "spender",
                    "type": "address"
                },
                {
                    "name": "addedValue",
                    "type": "uint256"
                }
            ],
            "name": "increaseAllowance",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "account",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
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
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "NAME",
            "outputs": [
                {
                    "name": "",
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
                    "name": "spender",
                    "type": "address"
                },
                {
                    "name": "subtractedValue",
                    "type": "uint256"
                }
            ],
            "name": "decreaseAllowance",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "recipient",
                    "type": "address"
                },
                {
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "transfer",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "owner",
                    "type": "address"
                },
                {
                    "name": "spender",
                    "type": "address"
                }
            ],
            "name": "allowance",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "SYMBOL",
            "outputs": [
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "name": "spender",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "Approval",
            "type": "event"
        }
    ],
};


// local quorum key4, account[0] in my mac
// if node has your account, you do not need a local pk to sign
// but for exception, we sign transaction by local pk, you can import key files in MetaMask and then export PK
// 0x9186eb3d20cbd1f5f992a950d808c4495153abd5
// Ox794392BA288A24092030BADAADFEE71E3FA55CCEF1D70C708BAF55C07ED538A8

// local quorum key2
// 0xcA843569e3427144cEad5e4d5999a3D0cCF92B8e
// Ox4762E04D10832808A0AEBDAA79C12DE54AFBE006BFFFD228B3ABCC494FE986F9