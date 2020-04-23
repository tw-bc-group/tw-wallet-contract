pragma solidity 0.5.2;

contract IdentityRegistry {
    struct Identity {
        address ownerAddress;
        string did;
        string publicKey;
        string name;
    }

    mapping(address => Identity) private identityDirectory;
    mapping(address => bool) private allAddresses;

    modifier _identityNotExists(address ownerAddress) {
        require(!identityExists(ownerAddress), "The identity already exist.");
        _;
    }

    modifier _identityExists(address ownerAddress) {
        require(identityExists(ownerAddress), "The identity does not exist.");
        _;
    }

    function identityExists(address ownerAddress) public view returns (bool) {
        return allAddresses[ownerAddress];
    }

    function getIdentity(address ownerAddress) public view _identityExists(ownerAddress)
    returns (address _ownerAddress, string memory _did, string memory _publicKey, string memory _name) {
        Identity storage _identity = identityDirectory[ownerAddress];

        return (
        _identity.ownerAddress,
        _identity.did,
        _identity.publicKey,
        _identity.name
        );
    }

    function createIdentity(address ownerAddress, string memory did, string memory publicKey, string memory name) public _identityNotExists(ownerAddress)
    returns (address _ownerAddress, string memory _did, string memory _publicKey, string memory _name) {
        Identity storage _identity = identityDirectory[ownerAddress];

        _identity.ownerAddress = ownerAddress;
        _identity.did = did;
        _identity.publicKey = publicKey;
        _identity.name = name;

        allAddresses[ownerAddress] = true;

        emit IdentityCreated(msg.sender, ownerAddress, did, publicKey, name);

        return (
        _identity.ownerAddress,
        _identity.did,
        _identity.publicKey,
        _identity.name
        );
    }

    event IdentityCreated(
        address indexed initiator,
        address ownerAddress,
        string did,
        string publicKey,
        string name
    );
}
