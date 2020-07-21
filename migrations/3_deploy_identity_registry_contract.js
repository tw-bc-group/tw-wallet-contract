const IdentityRegistry = artifacts.require("./IdentityRegistry.sol");
const Identities = artifacts.require("Identities.sol");

module.exports = function (deployer) {
    deployer.deploy(IdentityRegistry);
    deployer.deploy(Identities);
};
