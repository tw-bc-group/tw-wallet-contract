/**
 * web3.js vs ethjs vs ethers.
 * 由于网上说 ethjs 比 web3 好用，所以比较了一下，发现新版 web3 已经挺好用的，没有必要用 ethjs，ethjs 返回的结果都是 {0:object}, 不好用
 * ethers 支持 web3.js 目前还不支持的钱包功能，比如：HDWallet
 * 一些更复杂的功能，应该使用更底层的库实现，比如 MyEtherWallet 中支持用 13/25 个助记词生成钱包，最后一个当密码使用，
 * web3.js 不支持导入助记词，也可以自己实现。
 * 结论：可以使用 ethers... 为了保持官方API的及时更新，也可以配合使用 web3.js
 */

// https://github.com/ethjs/examples
// https://github.com/indutny/bn.js
// https://docs.ethers.io/ethers.js/html/api-wallet.html#wallet
// https://web3js.readthedocs.io/en

let contractAddress;
let net;
env = "local-quorum";
if (env === "dev") {
    contractAddress = "0xd9d64b7DC034fAfDbA5DC2902875A67b5d586420";
    net = "http://quorum.tw-wallet.in2e.com:22000";
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

async function ethjs() {

    const Eth = require('ethjs');
    const eth = new Eth(new Eth.HttpProvider(net));
    const EthContract = require('ethjs-contract');
    const contract = new EthContract(eth);
    const BN = require("bn.js");
    const multiple = new BN("1000000000000000000", 10);

    console.log("\n--------------\n");

    let block = await eth.getBlockByNumber(1, true);
    console.log(JSON.stringify(block));

    console.log("\n--------------\n");

    let accounts = await eth.accounts();
    console.log(JSON.stringify(accounts));

    console.log("\n--------------\n");


    const token = eth.contract(tokenABI).at(contractAddress);
    let totalSupply = await token.totalSupply();
    console.log(totalSupply[0].toString(10));

    console.log("\n--------------\n");

    const TwContract = contract(tokenABI, bytecode, {
        from: accounts[0],
        gas: 300000,
    });
    // setup an instance of that contract
    const twContract = TwContract.at(contractAddress);
    let total = await twContract.totalSupply();
    console.log(total[0].toString(10));

    console.log("\n--------------\n");

    const name = await twContract.name();
    console.log(name[0]);

    const address = accounts[0];
    console.log("\n--------------transfer\n");
    {
        // transfer 500
        const tw = multiple.mul(new BN(500));
        await twContract.transfer("0xcA843569e3427144cEad5e4d5999a3D0cCF92B8e", tw);
        // .then(txHash => eth.getTransactionSuccess(txHash))
        //         .then(receipt => console.log(receipt));

        const decimal = await twContract.decimals();
        const balance = await twContract.balanceOf(address);
        const adjustedBalance = balance[0] / Math.pow(10, decimal[0]);
        const tokenName = await twContract.name();
        const tokenSymbol = await twContract.symbol();
        console.log(`twContract: adjustedBalance:${adjustedBalance},tokenName:${tokenName[0]},tokenSymbol:${tokenSymbol[0]}`);
    }
}

async function balance() {
    console.log("\n--------------web3 : erc20 Contract ABI, balance--------------\n");
    // use the given Provider, e.g in Mist, or instantiate a new websocket provider
    const erc20Contract = new web3.eth.Contract(balanceABI, contractAddress);
    const name = await erc20Contract.methods.name().call();
    const symbol = await erc20Contract.methods.symbol().call();
    const decimal = await erc20Contract.methods.decimals().call();
    const balance = await erc20Contract.methods.balanceOf(toAddress).call();
    const adjustedBalance = balance / Math.pow(10, decimal);
    console.log(`erc20Contract: \n\t name:${name}, \n\t symbol:${symbol}, \n\t balance:${adjustedBalance} \n`);
}

async function transfer() {


    console.log("\n--------------web3 : TWPointERC20 Account & Transfer--------------\n");
    const erc20Contract = new web3.eth.Contract(tokenABI, contractAddress);
    const accounts = await web3.eth.getAccounts();
    console.log(`TWPointERC20: \n\t accounts:${accounts}`);
    const bigNum = multiple.mul(new web3.utils.BN(1));
    await erc20Contract.methods.transfer(toAddress, bigNum).send({from: accounts[0]});
    const name = await erc20Contract.methods.name().call();
    const symbol = await erc20Contract.methods.symbol().call();
    const decimal = await erc20Contract.methods.decimals().call();
    const balance = await erc20Contract.methods.balanceOf(toAddress).call();
    const adjustedBalance = balance / Math.pow(10, decimal);
    console.log(`TWPointERC20: \n\t name:${name}, \n\t symbol:${symbol}, \n\t balance:${adjustedBalance} \n`);
}

/**
 * geth里面有私钥，且没有密码，transfer直接就可以转账，估计是交易发送到geth签名了。
 * 这里把私钥导入，本地签名
 * note：nonce 不对会导致交易被放在队列不发送
 * txpool.status 在geth上返回缓存状态，如果此函数一直wait可能是进入缓存了
 * txpool.content
 * @returns {Promise<void>}
 */
async function sendSignedTransaction() {
    console.log("\n--------------web3 : TWPointERC20 sendSignedTransaction--------------\n");
    const erc20Contract = new web3.eth.Contract(tokenABI, contractAddress);
    // 有币的地址
    const fromAddress = "0x9186eb3d20Cbd1F5f992a950d808C4495153ABd5";
    const privateKey = "794392BA288A24092030BADAADFEE71E3FA55CCEF1D70C708BAF55C07ED538A8";
    let data = erc20Contract.methods.transfer(toAddress, web3.utils.toWei('1', 'ether')).encodeABI();
    console.log(`encodeABI: ${data}`);
    let nonce = await web3.eth.getTransactionCount(fromAddress);
    console.log(`nonce: ${nonce}`);
    let txObject = {
        "nonce": web3.utils.toHex(nonce),
        "gasPrice": web3.utils.toHex(0),
        "gasLimit": web3.utils.toHex(210000),
        "to": contractAddress,
        "value": "0x00",
        "data": data,
    };
    console.log(`txObject: ${JSON.stringify(txObject)}`);
    const Transaction = require('ethereumjs-tx').Transaction;
    // Sign the transaction
    const tx = new Transaction(txObject);
    const pk = Buffer.from(privateKey, 'hex');
    tx.sign(pk);
    const serializedTx = tx.serialize();
    const raw = '0x' + serializedTx.toString('hex');
    const receipt = await web3.eth.sendSignedTransaction(raw);
    console.log(`receipt: ${JSON.stringify(receipt)}`);
    await balance();
}
// eth_sign calculated the signature over keccak256("\x19Ethereum Signed Message:\n" + len(givenMessage) + givenMessage)))
// this gives context to a signature and prevents signing of transactions.
function messageHash(msg) {
    return web3.utils.sha3('\x19Ethereum Signed Message:\n' + msg.length + msg);
}
async function newAccountByPersonalAPI() {
    // What's the difference between web3.eth.personal and web3.eth.accounts?
    // https://stackoverflow.com/questions/50083957/what-is-the-difference-between-web3-eth-accounts-create-and-web3-eth-personal-ne
    // https://ethereum.stackexchange.com/questions/70512/whats-the-difference-between-web3-eth-personal-and-web3-eth-accounts

    const password = '!@superpassword';
    const account = await web3.eth.personal.newAccount(password);
    console.log(`account: ${account}`);
    let signature = await web3.eth.personal.sign("Hello world", account, password);
    console.log(`signature: ${signature}`);
    let ecRecoverAccount = await web3.eth.personal.ecRecover("Hello world", signature);
    console.log(`ecRecoverAccount: ${ecRecoverAccount}`);

    // Signs data using a specific account
    // Sending your account password over an unsecured HTTP RPC connection is highly unsecure.
    let unlock = await web3.eth.personal.unlockAccount(account, password, 600);
    console.log(`unlock: ${unlock}`);

    // web3.eth.personal.signTransaction if do not call unlockAccount
    let tx = {
        nonce: '0x0',
        from: account,
        gasPrice: "0",
        gas: "0",
        to: toAddress,
        value: "1000000000000000000",
        data: ""
    };
    let signTransaction = await web3.eth.signTransaction(tx, password);
    console.log(`signTransaction use in web3.eth.sendTransaction(): ${JSON.stringify(signTransaction)}`);
    let recoverTransaction = web3.eth.accounts.recoverTransaction(signTransaction.raw);
    console.log(`recoverTransaction: ${recoverTransaction}`);


    // let accountImport = await web3.eth.personal.importRawKey("cd3376bb711cb332ee3fb2ca04c6a8b9f70c316fcdf7a1f44ef4c7999483295e", "password1234")
    // console.log(`accounts: ${JSON.stringify(accountImport)}`);

    // already exist
    // let accountImport7Node1 = await web3.eth.personal.geth("4e77046ba3f699e744acb4a89c36a3ea1158a1bd90a076d36675f4c883864377", null);
    // console.log(`accounts: ${JSON.stringify(accountImport7Node1)}`);
    //
    // let accounts = await web3.eth.personal.getAccounts();
    // console.log(`accounts: ${JSON.stringify(accounts)}`);

    // accounts: "0x86e961c7b74f760fe5df0623f1bbd048c643f653"
    // accounts: ["0xe513915e94a94b075E7A6eeA4C3B400bDbDA64DA","0x0eA054CE3793966d374E5645641F46F3499a54b5","0x84Ff045dd73Ee3694Cdd782dCAa85e10F10F0575","0x7AB1E764aad60e8729f851310527fa84C89b8BcD","0x2c484A4F39D998045747eE3914D6AB78DeA6F687","0xd369d62947DC512cBebdA34a287fa8A9f34Ee6d2","0xb3785E04D392E94854ed3176c06aCc8ACaFc0A8B","0x82b23Ed03762b6481172ba321B8761B641811a63","0xA46097484A912A75d729e3ddAB9918951D17a346","0xC790394aD1F0Ba7ABBFF6Fa08b0EB39489A70507","0x5C6520ae97f10742BC75FB9C37ea962adC89EfaC","0x8f337bF484B2FC75e4B0436645dcC226Ee2AC531","0xc8D0Cb7b1daE5aA3d475ef85DC8Fe6c2705F928c","0x10F8e811da3EFf71c32E2DB93cd6141C2DF04bDc","0x78309641b13bF3c6bCF06F64E13fa149A4a07003","0xbE6c679B12EeDdC25B84570de937ce69e3329c30","0x86e961c7b74f760fe5DF0623f1bBD048c643F653","0x9186eb3d20Cbd1F5f992a950d808C4495153ABd5"]

}

async function importKeyStore() {
    const keystoreJsonV3 = require("./key.json");
    let decryptedAccount = web3.eth.accounts.decrypt(keystoreJsonV3, "");
    console.log(`decryptedAccount: ${JSON.stringify(decryptedAccount)}`);
    let encryptKeyStore = await web3.eth.accounts.encrypt(decryptedAccount.privateKey, "123");
    console.log(`encryptKeyStore: ${JSON.stringify(encryptKeyStore)}`);

    console.log("\n--------------web3 : web3.eth.accounts.wallet --------------\n");
    console.log(`web3.eth.accounts.wallet: ${JSON.stringify(decycle(web3.eth.accounts.wallet))}`);
}

async function createKeyStore() {
    // account: {"address":"0xeAdB017F94be58c64A067af4eb0D22FB9De4Aa50","privateKey":"0x229009bfbc445d4716846c08f22be0aa69ed92a4306460ef6aeb6a84ec7d3732"}
    // encryptKeyStore: {"version":3,"id":"38e9555c-34ef-4600-aeea-acb22334c76c","address":"eadb017f94be58c64a067af4eb0d22fb9de4aa50","crypto":{"ciphertext":"87970c9b4639b233018b069e67e584f0afc9b9bb84d923171ed4bcde9c9cdea7","cipherparams":{"iv":"a7257f7e1bc22812424715641dfb60a9"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"b321d7db716364905cba91e95fae351cdecffb2faac0d2ac9a8756b40ec2a12a","n":8192,"r":8,"p":1},"mac":"292063693d8959fbd3916f6770b025e24af7173d037ef058c297eb30ca9fb93b"}}

    let account = web3.eth.accounts.create(web3.utils.randomHex(32));
    console.log(`account: ${JSON.stringify(account)}`);
    let encryptKeyStore = await web3.eth.accounts.encrypt(account.privateKey, "123456789");
    console.log(`encryptKeyStore: ${JSON.stringify(encryptKeyStore)}`);
}

async function newAccountByAccountsAPI() {
    let account = web3.eth.accounts.create(web3.utils.randomHex(32));
    console.log(`account: ${JSON.stringify(account)}`);

}

async function checkConfirmationsByHash(txHash) {
    // Get transaction details
    const trx = await web3.eth.getTransaction(txHash);

    // Get current block number
    const currentBlock = await web3.eth.getBlockNumber();

    // When transaction is unconfirmed, its block number is null.
    // In this case we return 0 as number of confirmations
    return trx.blockNumber === null ? 0 : currentBlock - trx.blockNumber
}

async function getTransactionsByAddr(web3, myAccount, startBlockNumber, endBlockNumber) {
    if (endBlockNumber == null) {
        endBlockNumber = await web3.eth.blockNumber;
        console.log("Using endBlockNumber: " + endBlockNumber);
    }
    if (startBlockNumber == null) {
        startBlockNumber = endBlockNumber - 1000;
        console.log("Using startBlockNumber: " + startBlockNumber);
    }
    console.log("Searching for transactions to/from account \"" + myAccount + "\" within blocks " + startBlockNumber + " and " + endBlockNumber);
    for (let i = startBlockNumber; i <= endBlockNumber; i++) {
        if (i % 1000 == 0) {
            console.log("Searching block " + i);
        }
        const block = await web3.eth.getBlock(i, true);
        if (block != null && block.transactions != null) {
            block.transactions.forEach(function (e) {
                if (myAccount == "*" || myAccount == e.from || myAccount == e.to) {
                    console.log(`transaction : ${JSON.stringify(e, null, 4)}\n`)
                    // TODO: parse input
                }
            })
        }
    }
}

async function mnenomicByEthers() {
    // https://docs.ethers.io/ethers.js/html/api-wallet.html#wallet

    console.log("\n--------------Ethers : entropyToMnemonic --------------\n");

    const ethers = require('ethers');
    const mnemonic = await ethers.utils.HDNode.entropyToMnemonic(ethers.utils.randomBytes(16));
    console.log(`mnemonic：${mnemonic}`);
    const wallet = ethers.Wallet.fromMnemonic(mnemonic);
    console.log(`wallet：${JSON.stringify(wallet)}`);

    console.log("\n--------------Ethers : dotenv load mnemonicEnv--------------\n");

    require('dotenv').config({path: "../.env"});
    const mnemonicEnv = process.env.MNENOMIC;
    console.log(`mnemonic：${mnemonicEnv}`);
    const wallet1 = ethers.Wallet.fromMnemonic(mnemonicEnv);
    console.log(`wallet1：${JSON.stringify(wallet1)}`);
    // mnemonic：face strategy pottery bottom february draw truck about enrich chunk deposit alley
    // wallet1：{"signingKey":{"mnemonic":"face strategy pottery bottom february draw truck about enrich chunk deposit alley","path":"m/44'/60'/0'/0/0","privateKey":"0x74b6d2c24584f77c63dda82fb8d5643cd49cd8c562d3940424fca07032440b27","keyPai":{"privateKey":"0x74b6d2c24584f77c63dda82fb8d5643cd49cd8c562d3940424fca07032440b27","publicKey":"0x04198659b6068ab2bb5acca885811ad4d9eb35fea5cef8f04725e2bc90f1b6936827edb900a67260463fb0fc9b04b3c3c22eaa8677fdb032554b014af2f532006f","compressedPublicKey":"0x03198659b6068ab2bb5acca885811ad4d9eb35fea5cef8f04725e2bc90f1b69368","publicKeyBytes":[3,25,134,89,182,6,138,178,187,90,204,168,133,129,26,212,217,235,53,254,165,206,248,240,71,37,226,188,144,241,182,147,104]},"publicKey":"0x04198659b6068ab2bb5acca885811ad4d9eb35fea5cef8f04725e2bc90f1b6936827edb900a67260463fb0fc9b04b3c3c22eaa8677fdb032554b014af2f532006f","address":"0xA97613C3359Cf3E46c93Fd2fCFd1526F2Ab7513B"}}

    console.log("\n--------------Ethers : Load the second account from a mnemonic--------------\n");

    // Load the second account from a mnemonic
    let path = "m/44'/60'/1'/0/0";
    let secondMnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic, path);
    console.log(`secondMnemonicWallet：${JSON.stringify(secondMnemonicWallet)}`);

    console.log("\n--------------Ethers : Load the second account from cn mnemonic--------------\n");

    const mnemonicCn = await ethers.utils.HDNode.entropyToMnemonic(ethers.utils.randomBytes(16), ethers.wordlists.zh_cn);
    console.log(`mnemonicCn：${JSON.stringify(mnemonicCn)}`);

    // Load using a non-english locale wordlist (the path "null" will use the default)
    let secondMnemonicWalletNoEn = ethers.Wallet.fromMnemonic(
        mnemonicCn,
        path,
        ethers.wordlists.zh_cn
    );
    console.log(`secondMnemonicWalletNoEn：${JSON.stringify(secondMnemonicWalletNoEn)}`);

}

function timeConverter(UNIX_timestamp) {

    const a = new Date(UNIX_timestamp * 1000);
    const year = a.getFullYear();
    const month = a.getMonth() + 1;
    const date = a.getDate();
    const hour = a.getHours();
    const min = a.getMinutes();
    const sec = a.getSeconds();
    const time = year + '/' + month + '/' + date + ' ' + hour + ':' + min + ':' + sec;
    return time;

}

/**
 * web3.eth.accounts[0] refers to very first address created on an Ethereum node.
 * web3.eth.coinbase returns you the coinbase. Coinbase or the Etherbase is the account in which your mining Ether i.e Block Reward will be credited.
 * When there is one account, it is same as accounts[0] but you can also set it for other available address of same node.
 * @returns {Promise<void>}
 */
async function coinbase() {
    console.log(`coinbase: ${web3.eth.coinbase},  web3.eth.accounts[0]: ${web3.eth.accounts[0]}`);
}

(async function () {
    try {
        // await coinbase();
        // await getTransactionsByAddr(web3, "0xA97613C3359Cf3E46c93Fd2fCFd1526F2Ab7513B", 0, 100);
        // await checkConfirmationsByHash("0x9eff6287e55ea56b2abcf8d84a1a151e8a00e0f482ea0ee0448fef9f5d3ebad4");
        // await importKeyStore();
        // await createKeyStore();
        // await mnenomicByEthers();
        // await newAccountByAccountsAPI();
        await newAccountByPersonalAPI();
        // await balance();
        // await transfer();
        // await sendSignedTransaction();
    } catch (error) {
        console.log(error.message);
    }
}());

function decycle(obj, stack = []) {
    if (!obj || typeof obj !== 'object')
        return obj;

    if (stack.includes(obj))
        return null;

    let s = stack.concat([obj]);

    return Array.isArray(obj)
        ? obj.map(x => decycle(x, s))
        : Object.fromEntries(
            Object.entries(obj)
                .map(([k, v]) => [k, decycle(v, s)]));
}