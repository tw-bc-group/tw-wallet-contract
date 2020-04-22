async function getTxHash(web3, hash, abi) {
    const receipt = await web3.eth.getTransactionReceipt(hash);
    console.log(`receipt : ${JSON.stringify(receipt, null, 4)}`);
    if (receipt && receipt.logs) {
        const abiDecoder = require('abi-decoder');
        abiDecoder.addABI(abi);
        const decodedLogs = abiDecoder.decodeLogs(receipt.logs);
        if (decodedLogs && decodedLogs.length > 0) {
            console.log(`receipt.logs : ${JSON.stringify(decodedLogs, null, 4)}\n`);
        }
    }
}

exports.getTxHash = getTxHash;

exports.getBlockTxs = async function getBlockTxs(web3, startBlockNumber, endBlockNumber, filterAddress, abi) {
    if (endBlockNumber == null) {
        endBlockNumber = await web3.eth.getBlockNumber();
        console.log("Using endBlockNumber: " + endBlockNumber);
    }
    if (startBlockNumber == null) {
        startBlockNumber = endBlockNumber - 100;
        console.log("Using startBlockNumber: " + startBlockNumber);
    }
    for (let i = endBlockNumber; i >= startBlockNumber; i--) {
        if (i % 1000 === 0) {
            console.log("Searching block " + i);
        }
        const block = await web3.eth.getBlock(i, true);
        if (block != null && block.transactions != null) {
            for (const e of block.transactions) {
                if (!filterAddress || filterAddress === "*" || filterAddress === e.from || filterAddress === e.to) {
                    await getTxHash(web3, e.hash, abi);
                }
            }
        }
    }
}