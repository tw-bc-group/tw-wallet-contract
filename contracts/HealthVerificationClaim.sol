pragma solidity 0.5.2;

contract HealthVerificationClaim {

    struct HealthVerification {
        address issuer;
        string issuerId;
        string ownerId;
        string claimId;
        bool isRevoke;
    }

    mapping(string => HealthVerification) private healthVerificationDirectory;
    mapping(string => bool) private allHealthVerifications;

    modifier _onlyIssuer(address issuer) {
        require(msg.sender == issuer, "Only issuer have right to issue healthy claim.");
        _;
    }

    modifier _healthVerificationExist(string memory claimId){
        require(allHealthVerifications[claimId], "The health verification of this claimId does not exist.");
        _;
    }

    modifier _healthVerificationAlreadyExist(string memory claimId){
        require(!allHealthVerifications[claimId], "The health verification of this claimId already exist.");
        _;
    }

    function createHealthVerification(address issuer, string memory claimId, string memory ownerId, string memory issuerId) public _onlyIssuer(issuer) _healthVerificationAlreadyExist(claimId) returns (string memory _claimId){
        HealthVerification storage _healthVerification = healthVerificationDirectory[claimId];

        _healthVerification.claimId = claimId;
        _healthVerification.ownerId = ownerId;
        _healthVerification.issuerId = issuerId;
        _healthVerification.isRevoke = false;

        allHealthVerifications[claimId] = true;

        emit HealthVerificationCreated(_healthVerification.claimId, _healthVerification.ownerId, _healthVerification.issuerId, _healthVerification.isRevoke);

        return (_healthVerification.claimId);
    }

    event HealthVerificationCreated(
        string indexed claimId,
        string ownerId,
        string issuerId,
        bool isRevoke
    );

    function getHealthVerification(string memory claimId) public view _healthVerificationExist(claimId) returns (string memory _claimId, string memory _ownerId, string memory _issuerId, bool _isRevoke) {
        HealthVerification storage _healthVerification = healthVerificationDirectory[claimId];

        return (
        _healthVerification.claimId,
        _healthVerification.ownerId,
        _healthVerification.issuerId,
        _healthVerification.isRevoke
        );
    }
}
