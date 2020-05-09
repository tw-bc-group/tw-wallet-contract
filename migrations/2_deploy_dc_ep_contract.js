const DC_EP_ERC20 = artifacts.require("./DC_EP_ERC20.sol");

module.exports = function (deployer) {
    deployer.deploy(DC_EP_ERC20)
};