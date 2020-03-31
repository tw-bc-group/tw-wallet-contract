const TWPointERC20 = artifacts.require("./TWPointERC20.sol");

module.exports = function (deployer) {
    deployer.deploy(TWPointERC20)
};