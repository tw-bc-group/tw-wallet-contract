const Wallet = require('ethereumjs-wallet');
const EthUtil = require('ethereumjs-util');

const privateKey = "0x4e77046ba3f699e744acb4a89c36a3ea1158a1bd90a076d36675f4c883864377"
const publicKey1 = "0x048773a46bc5a2bb1c5687de4788a7d58df3f27483687c8df81d07350753161e05741eafdcfa7f0e1728afc8d4c383aff5b69f886921d13e2c1be77c694fc3362f";
const publicKey2 = "0x8773a46bc5a2bb1c5687de4788a7d58df3f27483687c8df81d07350753161e05741eafdcfa7f0e1728afc8d4c383aff5b69f886921d13e2c1be77c694fc3362f";
const compressedPublicKey = "0x038773a46bc5a2bb1c5687de4788a7d58df3f27483687c8df81d07350753161e05";
// Get a wallet instance from a private key
const privateKeyBuffer = EthUtil.toBuffer(privateKey);
const wallet = Wallet.fromPrivateKey(privateKeyBuffer);
// Get a public key
const publicKey = wallet.getPublicKeyString();
console.log(publicKey);


async function getPublicKey() {

    const ethers = require('ethers');
    const wallet = new ethers.Wallet(privateKey);
    console.log(`wallet：${JSON.stringify(wallet)}`);

}

getPublicKey();