
module.exports = function decode(raw, abi) {
    const ethers = require('ethers');
    const decodedTx = ethers.utils.parseTransaction(raw);
    console.log(`decoded Tx: ${JSON.stringify(decodedTx, null, 4)}`);

    if (abi) {
        const abiDecoder = require('abi-decoder');
        abiDecoder.addABI(abi);
        const decodedLogs = abiDecoder.decodeMethod(decodedTx.data);
        console.log(`decoded data : ${JSON.stringify(decodedLogs, null, 4)}\n`);
    }
}