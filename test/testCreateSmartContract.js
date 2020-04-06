// The require packages
const Web3 = require('web3');

let accounts = [
    {
        // Ganache Default Accounts, do not use it for your production
        address: '0xA97613C3359Cf3E46c93Fd2fCFd1526F2Ab7513B',
        key: '74b6d2c24584f77c63dda82fb8d5643cd49cd8c562d3940424fca07032440b27',
        url: 'http://127.0.0.1:7545',
        gasPrice: 4500000
    },
    {
        // Quorum 2
        address: '0xA97613C3359Cf3E46c93Fd2fCFd1526F2Ab7513B',
        key: '74b6d2c24584f77c63dda82fb8d5643cd49cd8c562d3940424fca07032440b27',
        url: 'http://127.0.0.1:22003',
        gasPrice: 0

    }
];

const selectedAccountIndex = 0;
web3 = new Web3(new Web3.providers.HttpProvider(accounts[selectedAccountIndex].url));


async function deployContract(contract) {
    const gasPrice = accounts[selectedAccountIndex].gasPrice;
    const gasPriceHex = web3.utils.toHex(gasPrice);
    const gasLimitHex = web3.utils.toHex(6000000);
    const nonce = await web3.eth.getTransactionCount(accounts[selectedAccountIndex].address, "pending");
    const nonceHex = web3.utils.toHex(nonce);

    // It will read the ABI & byte code contents from the JSON file in ./build/contracts/ folder
    const abi = require("../build/contracts/TWPointERC20.json").abi;
    const bytecode = require("../build/contracts/TWPointERC20.json").bytecode;

    const tokenContract = new web3.eth.Contract(abi);

    // Prepare the smart contract deployment payload
    // If the smart contract constructor has mandatory parameters, you supply the input parameters like below

    // Prepare the raw transaction information
    let rawTx = {
        nonce: nonceHex,
        gasPrice: gasPriceHex,
        gasLimit: gasLimitHex,
        data: bytecode,
        from: accounts[selectedAccountIndex].address
    };

    // Get the account private key, need to use it to sign the transaction later.
    let privateKey = Buffer.from(accounts[selectedAccountIndex].key, 'hex');

    const Tx = require('ethereumjs-tx').Transaction;
    let tx = new Tx(rawTx);

    // Sign the transaction
    tx.sign(privateKey);
    const serializedTx = tx.serialize();
    const raw = '0x' + serializedTx.toString('hex');
    // Submit the smart contract deployment transaction
    const receipt = await web3.eth.sendSignedTransaction(raw);

    console.log(`receipt: ${JSON.stringify(receipt, null, 4)}`);
    return true;
}


(async function () {
    try {
        const contract = "../contracts/TWPointERC20.sol";
        await deployContract(contract);
    } catch (error) {
        console.log(error.message);
    }
}());