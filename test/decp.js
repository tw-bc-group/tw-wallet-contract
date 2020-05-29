const dceperc20 = artifacts.require("DC_EP_ERC20");

contract("DC_EP_ERC20", async accounts => {
    it("should put 10000 DC_EP_ERC20 in the first account", async () => {
        let instance = await dceperc20.deployed();
        let balance = await instance.balanceOf.call(accounts[0]);
        assert.equal(balance.toNumber(), 1000000);
    });

});