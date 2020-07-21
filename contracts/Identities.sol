pragma solidity >=0.5.0 <0.7.0;
pragma experimental ABIEncoderV2;

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


    function identityOf()
    public
    view
    returns (string[] memory, string[] memory, string[] memory, uint256[] memory, string[] memory)
    {
        Identity[] memory targetIdentities = identities[msg.sender];
        uint256 length = targetIdentities.length;
        string[] memory names = new string[](length);
        string[] memory dids = new string[](length);
        string[] memory dappIds = new string[](length);
        uint256[] memory indexes = new uint256[](length);
        string[] memory extraInfos = new string[](length);

        for (uint8 i = 0; i < length; i++) {
            Identity memory identity = targetIdentities[i];
            names[i] = identity.name;
            dids[i] = identity.did;
            dappIds[i] = identity.dappId;
            indexes[i] = identity.index;
            extraInfos[i] = identity.extraInfo;
        }

        return (names, dids, dappIds, indexes, extraInfos);
    }
}
