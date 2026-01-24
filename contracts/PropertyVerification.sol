// contracts/PropertyVerification.sol
pragma solidity ^0.8.0;

contract PropertyVerification {
    struct Property {
        string propertyId;
        address owner;
        string titleHash;
        string[] documentHashes;
        uint256 verificationTimestamp;
        address[] verifiers;
        bool isVerified;
    }
    
    mapping(string => Property) public properties;
    mapping(address => bool) public authorizedVerifiers;
    
    address public admin;
    
    event PropertyRegistered(string propertyId, address owner);
    event PropertyVerified(string propertyId, address verifier);
    event DocumentAdded(string propertyId, string documentHash);
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized");
        _;
    }
    
    modifier onlyVerifier() {
        require(authorizedVerifiers[msg.sender], "Not a verifier");
        _;
    }
    
    function registerProperty(
        string memory _propertyId,
        string memory _titleHash
    ) public {
        require(properties[_propertyId].owner == address(0), "Property already registered");
        
        properties[_propertyId] = Property({
            propertyId: _propertyId,
            owner: msg.sender,
            titleHash: _titleHash,
            documentHashes: new string[](0),
            verificationTimestamp: 0,
            verifiers: new address[](0),
            isVerified: false
        });
        
        emit PropertyRegistered(_propertyId, msg.sender);
    }
    
    function verifyProperty(string memory _propertyId) public onlyVerifier {
        Property storage property = properties[_propertyId];
        require(!property.isVerified, "Already verified");
        
        property.verifiers.push(msg.sender);
        
        if (property.verifiers.length >= 3) {
            property.isVerified = true;
            property.verificationTimestamp = block.timestamp;
        }
        
        emit PropertyVerified(_propertyId, msg.sender);
    }
    
    function addDocument(string memory _propertyId, string memory _documentHash) public {
        Property storage property = properties[_propertyId];
        require(property.owner == msg.sender, "Not property owner");
        
        property.documentHashes.push(_documentHash);
        emit DocumentAdded(_propertyId, _documentHash);
    }
    
    function getPropertyVerificationStatus(string memory _propertyId) 
        public 
        view 
        returns (
            bool isVerified,
            uint256 verificationTimestamp,
            address[] memory verifiers,
            string[] memory documents
        ) 
    {
        Property storage property = properties[_propertyId];
        return (
            property.isVerified,
            property.verificationTimestamp,
            property.verifiers,
            property.documentHashes
        );
    }
}