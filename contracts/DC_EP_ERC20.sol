pragma solidity 0.5.2;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";


contract DC_EP_ERC20 is ERC20, ERC20Detailed {
    // modify token name
    string public constant NAME = "DC/EP";
    // modify token symbol
    string public constant SYMBOL = "￥";
    // modify token decimals
    uint8 public constant DECIMALS = 2;
    // modify initial token supply
    uint256 public constant INITIAL_SUPPLY = 10000 * (10**uint256(DECIMALS)); // 10000 tokens

    /**
     * @dev Constructor that gives msg.sender all of existing tokens.
     */
    constructor() public ERC20Detailed(NAME, SYMBOL, DECIMALS) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
}
