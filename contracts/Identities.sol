pragma solidity >=0.5.0 <0.7.0;

contract Identities {
    struct Identity {
        string name;
        string did;
        string dappId;
        uint256 index;
        string extraInfo;
    }

    mapping(address => Identity[]) identities;

    event IdentityRegistered(
        string name,
        string did,
        string dappId,
        uint256 index,
        string extraInfo,
        address operator
    );

    function registerIdentity(
        string memory name,
        string memory did,
        string memory dappId,
        uint256 index,
        string memory extraInfo
    )
    public
    {
        identities[msg.sender].push(Identity(name, did, dappId, index, extraInfo));

        emit IdentityRegistered(name, did, dappId, index, extraInfo, msg.sender);
    }
}
