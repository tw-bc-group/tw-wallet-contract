/**
 * transfer By Personal Account, you should confirm account in your geth
 * @param web3
 * @param contractAddress
 * @param fromAddress
 * @param toAddress
 * @param abi
 * @param money
 * @param password
 * @returns {Promise<void>}
 */
exports.transferByPersonalAccount = async function transfer(web3, contractAddress, fromAddress, toAddress, abi, money = "1.1", password = "") {
    const erc20Contract = new web3.eth.Contract(abi, contractAddress, {from: fromAddress});

    await balance(erc20Contract, fromAddress);

    // Signs data using a specific account
    // Sending your account password over an unsecured HTTP RPC connection is highly unsecure.
    let unlock = await web3.eth.personal.unlockAccount(fromAddress, password, 600);
    console.log(`unlock ${fromAddress} : ${unlock}`);

    // web3.eth.personal.signTransaction if do not call unlockAccount
    let receipt = await erc20Contract.methods.transfer(toAddress, web3.utils.toWei(money, 'ether')).send({from: fromAddress});
    console.log(`Receipt: ${JSON.stringify(receipt.blockHash, null, 4)}`);
    await balance(erc20Contract, fromAddress);
};

/**
 * transfer with private key of  fromAddress
 * @param web3
 * @param contractAddress
 * @param fromAddress
 * @param fromAddressPK
 * @param toAddress
 * @param abi
 * @param money
 * @param gasPrice
 * @param gasLimit
 * @returns {Promise<void>}
 */
exports.transfer = async function transfer(web3, contractAddress, fromAddress, fromAddressPK, toAddress, abi, money = "1.1", gasPrice = 0, gasLimit = 210000) {
    const erc20Contract = new web3.eth.Contract(abi, contractAddress);

    await balance(erc20Contract, fromAddress);

    const data = erc20Contract.methods.transfer(toAddress, web3.utils.toWei(money, 'ether')).encodeABI();
    const nonce = await web3.eth.getTransactionCount(fromAddress);
    const tx = await web3.eth.accounts.signTransaction({
        nonce: web3.utils.toHex(nonce),
        to: contractAddress, // note: this is contractAddress, not toAddress
        value: 0,
        gasPrice: web3.utils.toHex(gasPrice),
        gasLimit: web3.utils.toHex(gasLimit),
        data: data
    }, fromAddressPK);
    const recoverTransaction = web3.eth.accounts.recover(tx.messageHash, tx.v, tx.r, tx.s, true);
    console.log(`recoverTransaction: ${recoverTransaction}`);

    const receipt = await web3.eth.sendSignedTransaction(tx.rawTransaction);
    console.log(`receipt: ${JSON.stringify(receipt, null, 4)}`);
    await balance(erc20Contract, fromAddress);
};

exports.balanceOf = async function balanceOf(web3, address, contractAddress, abi) {
    const eth = await web3.eth.getBalance(address);
    console.log(`eth.getBalance : ${web3.utils.fromWei(eth, "ether")}`);
    if (contractAddress && abi) {
        const erc20Contract = new web3.eth.Contract(abi, contractAddress);
        await balance(erc20Contract, address)
    }
}

async function balance(erc20Contract, fromAddress) {
    const decimal = await erc20Contract.methods.decimals().call();
    const name = await erc20Contract.methods.name().call();
    const symbol = await erc20Contract.methods.symbol().call();

    const balance = await erc20Contract.methods.balanceOf(fromAddress).call();
    const adjustedBalance = balance / Math.pow(10, decimal);
    console.log(`TWPointERC20: name:${name}, symbol:${symbol}, balance:${adjustedBalance}`);
}