const Web3 = require("web3");
const web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider("http://quorum.tw-wallet.in2e.com:22001"));

const abi = require("../build/contracts/IdentityRegistry.json").abi;
const fromAddress = "0xcA843569e3427144cEad5e4d5999a3D0cCF92B8e";
const ownerId = "DID:TW:1d65605830b92bB4d3E6B4EA19b05461F1E2CBA1"; //no use
const contractAddress = "0x11aC39ac7D780a6b9DdfC8687831e25B655884c7";
const fromAddressPK = "4762E04D10832808A0AEBDAA79C12DE54AFBE006BFFFD228B3ABCC494FE986F9";
const gasPrice = 0;
const gasLimit = 210000;

// identityExists
async function identityExists() {
    const identityRegistryContract = new web3.eth.Contract(abi, contractAddress);
    let data =  identityRegistryContract.methods.identityExists(fromAddress).encodeABI();
    const nonce = await web3.eth.getTransactionCount(fromAddress);
    const tx = await web3.eth.accounts.signTransaction({
        nonce: web3.utils.toHex(nonce),
        to: contractAddress, // note: this is contractAddress, not toAddress
        value: 0,
        gasPrice: web3.utils.toHex(gasPrice),
        gasLimit: web3.utils.toHex(gasLimit),
        data: data
    }, fromAddressPK);

    const receipt = await web3.eth.sendSignedTransaction(tx.rawTransaction);
    console.log(`receipt: ${JSON.stringify(receipt, null, 4)}`);

}

identityExists();