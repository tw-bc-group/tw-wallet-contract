/**
 * 使用 MetaMask 不能成功在 Quorum 转账 ETH 和 TWPoint
 * 本脚本可以当做测试，也可以当做方便转账的工具，另一个选择是登录到 geth 或者使用其他命令行工具，比如 eth-cli
 * @type {{Modules: Modules; readonly default: Web3} | Web3}
 */
const Web3 = require('web3');

let accounts = [
    {
        // Ganache Default Accounts, do not use it for your production
        address: '0xA97613C3359Cf3E46c93Fd2fCFd1526F2Ab7513B',
        toAddress: '0x5Ead65B2f8E8C9d46E2e8202179f8098305E7379',
        key: '74b6d2c24584f77c63dda82fb8d5643cd49cd8c562d3940424fca07032440b27',
        url: 'http://127.0.0.1:7545',
        contractAddress: "0xC48eCD20A2882926CFcc09e03a8f828D0a6EBCDC",
        gasPrice: 4500000
    },
    {
        // Quorum 2
        address: '0xA97613C3359Cf3E46c93Fd2fCFd1526F2Ab7513B',
        toAddress: '0x5Ead65B2f8E8C9d46E2e8202179f8098305E7379',
        key: '74b6d2c24584f77c63dda82fb8d5643cd49cd8c562d3940424fca07032440b27',
        url: 'http://127.0.0.1:22003',
        contractAddress: "0xC48eCD20A2882926CFcc09e03a8f828D0a6EBCDC",
        gasPrice: 0
    }
];

const selectedAccountIndex = 1;
web3 = new Web3(new Web3.providers.HttpProvider(accounts[selectedAccountIndex].url));


async function transfer(contract) {
    console.log("\n--------------web3 Quorum : TWPointERC20 Transfer--------------\n");
    const abi = require("../build/contracts/TWPointERC20.json").abi;
    const {contractAddress, toAddress, address: fromAddress} = accounts[selectedAccountIndex];
    const erc20Contract = new web3.eth.Contract(abi, contractAddress, {from: fromAddress});
    const decimal = await erc20Contract.methods.decimals().call();
    const name = await erc20Contract.methods.name().call();
    const symbol = await erc20Contract.methods.symbol().call();

    {
        const balance = await erc20Contract.methods.balanceOf(fromAddress).call();
        const adjustedBalance = balance / Math.pow(10, decimal);
        console.log(`TWPointERC20: name:${name}, symbol:${symbol}, balance:${adjustedBalance}`);
    }
    // send &  transfer must use personal account
    // await erc20Contract.methods.transfer(toAddress, web3.utils.toWei('1.99', 'ether')).send({from: fromAddress});
    // const receipt = await erc20Contract.methods.transfer(toAddress, web3.utils.toWei('1.99', 'ether'));

    const data = erc20Contract.methods.transfer(toAddress, web3.utils.toWei('40.1', 'ether')).encodeABI();
    const gasPrice = accounts[selectedAccountIndex].gasPrice;
    const gasPriceHex = web3.utils.toHex(gasPrice);
    const nonce = await web3.eth.getTransactionCount(fromAddress);
    const tx = await web3.eth.accounts.signTransaction({
        nonce: web3.utils.toHex(nonce),
        to: contractAddress, // note: this is contractAddress, not toAddress
        value: 0,
        gasPrice: gasPriceHex,
        gasLimit: web3.utils.toHex(210000),
        data: data
    }, accounts[selectedAccountIndex].key);
    const receipt = await web3.eth.sendSignedTransaction(tx.rawTransaction);
    console.log(`receipt: ${JSON.stringify(receipt.blockHash, null, 4)}`);

    const balance = await erc20Contract.methods.balanceOf(fromAddress).call();
    const adjustedBalance = balance / Math.pow(10, decimal);
    console.log(`TWPointERC20: name:${name}, symbol:${symbol}, balance:${adjustedBalance} \n`);
}


(async function () {
    try {
        const contract = "../contracts/TWPointERC20.sol";
        await transfer(contract);
    } catch (error) {
        console.log(error.message);
    }
}());
