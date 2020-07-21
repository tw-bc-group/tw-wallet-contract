const Identity = artifacts.require("Identities");
const { expectEvent, BN } = require('@openzeppelin/test-helpers');

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

      const result = await contract.registerIdentity(name, did, dappId, index, extraInfo, { from: aliceAddress });

      expectEvent.inLogs(result.logs, 'IdentityRegistered', {
        name: name,
        did: did,
        dappId: dappId,
        index: new BN(index),
        extraInfo: extraInfo,
        operator: aliceAddress
      });
    });
  });
});
