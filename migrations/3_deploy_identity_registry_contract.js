const IdentityRegistry = artifacts.require("./IdentityRegistry.sol");

module.exports = function (deployer) {
    deployer.deploy(IdentityRegistry)
};