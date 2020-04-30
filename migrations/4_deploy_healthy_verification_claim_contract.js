const HealthVerificationClaim = artifacts.require("./HealthVerificationClaim.sol");

module.exports = function (deployer) {
    deployer.deploy(HealthVerificationClaim)
};