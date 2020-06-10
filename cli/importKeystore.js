module.exports = async function importKeyStore(web3, path) {
    const keystoreJsonV3 = require(path);
    let decryptedAccount = web3.eth.accounts.decrypt(keystoreJsonV3, "");
    console.log(`decryptedAccount: ${JSON.stringify(decryptedAccount)}`);
}