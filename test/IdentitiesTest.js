const Identity = artifacts.require("Identities");
const {expectEvent, BN} = require('@openzeppelin/test-helpers');
const chai = require('chai');
chai.use(require('chai-as-promised'));
chai.should();

contract('Identities', async accounts => {
    let contract;
    const aliceAddress = accounts[0];

    beforeEach(async function () {
        contract = await Identity.new();
    });

    describe('#registerIdentity', () => {
        it('should initially register an identity without revert', async () => {
            const name = "name";
            const did = "did";
            const dappId = "dappId";
            const index = 0;
            const extraInfo = "extraInfo";
            const pubKey = "public key";

            const result = await contract.registerIdentity(name, did, dappId, index, extraInfo, pubKey, {from: aliceAddress});

            expectEvent.inLogs(result.logs, 'IdentityRegistered', {
                name: name,
                did: did,
                dappId: dappId,
                index: new BN(index),
                extraInfo: extraInfo,
                operator: aliceAddress,
                publicKey: pubKey
            });
        });
    });

    describe('#queryIdentities', () => {
        it('should return empty lists when no identity found', async () => {
            const result = await contract.identityOf({from: aliceAddress});

            (0).should.be.equal(result[0].length);
            (0).should.be.equal(result[1].length);
            (0).should.be.equal(result[2].length);
            (0).should.be.equal(result[3].length);
            (0).should.be.equal(result[4].length);
            (0).should.be.equal(result[5].length);

        });

        it('should return expected identities when count of identities is not zero', async () => {
            //given
            const name = "name";
            const did = "did";
            const dappId = "dappId";
            const index = 0;
            const extraInfo = "extraInfo";
            const pubKey = "public key";

            const name2 = "name2";
            const did2 = "did2";
            const dappId2 = "dappId2";
            const index2 = 1;
            const extraInfo2 = "extraInfo2";
            const pubKey2 = "public key";


            await contract.registerIdentity(name, did, dappId, index, extraInfo, pubKey,{from: aliceAddress});
            await contract.registerIdentity(name2, did2, dappId2, index2, extraInfo2,pubKey2, {from: aliceAddress});

            //when
            const result = await contract.identityOf({from: aliceAddress});

            //then
            (2).should.be.equal(result[0].length);
            (2).should.be.equal(result[1].length);
            (2).should.be.equal(result[2].length);
            (2).should.be.equal(result[3].length);
            (2).should.be.equal(result[4].length);
            (2).should.be.equal(result[5].length);


            (name).should.be.equal(result[0][0]);
            (did).should.be.equal(result[1][0]);
            (dappId).should.be.equal(result[2][0]);
            (index).should.be.equal(result[3][0].toNumber());
            (extraInfo).should.be.equal(result[4][0]);
            (pubKey).should.be.equal(result[5][0]);

            (name2).should.be.equal(result[0][1]);
            (did2).should.be.equal(result[1][1]);
            (dappId2).should.be.equal(result[2][1]);
            (index2).should.be.equal(result[3][1].toNumber());
            (extraInfo2).should.be.equal(result[4][1]);
            (pubKey2).should.be.equal(result[5][1]);
        });
    });
});
