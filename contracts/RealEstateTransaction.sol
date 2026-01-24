// contracts/RealEstateTransaction.sol
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RealEstateTransaction is ERC721, Ownable {
    struct Property {
        uint256 id;
        address currentOwner;
        address[] previousOwners;
        uint256 purchasePrice;
        uint256 lastSoldDate;
        string propertyDataHash;
        bool isListedForSale;
        uint256 askingPrice;
        address[] approvedBuyers;
        uint256 escrowAmount;
        bool escrowReleased;
    }
    
    struct Offer {
        uint256 propertyId;
        address buyer;
        uint256 offerAmount;
        uint256 offerDate;
        bool accepted;
        bool withdrawn;
        uint256 expirationDate;
    }
    
    mapping(uint256 => Property) public properties;
    mapping(uint256 => Offer[]) public propertyOffers;
    mapping(address => uint256[]) public userProperties;
    
    event PropertyListed(uint256 propertyId, uint256 askingPrice);
    event OfferMade(uint256 propertyId, address buyer, uint256 amount);
    event OfferAccepted(uint256 propertyId, address buyer, uint256 amount);
    event PropertyTransferred(uint256 propertyId, address from, address to, uint256 price);
    event EscrowDeposited(uint256 propertyId, address buyer, uint256 amount);
    event EscrowReleased(uint256 propertyId, address seller, uint256 amount);
    
    constructor() ERC721("RealEstateProperty", "REP") {}
    
    function listPropertyForSale(
        uint256 _propertyId,
        uint256 _askingPrice,
        string memory _propertyDataHash
    ) public {
        require(ownerOf(_propertyId) == msg.sender, "Not property owner");
        
        Property storage property = properties[_propertyId];
        property.isListedForSale = true;
        property.askingPrice = _askingPrice;
        property.propertyDataHash = _propertyDataHash;
        
        emit PropertyListed(_propertyId, _askingPrice);
    }
    
    function makeOffer(uint256 _propertyId, uint256 _offerAmount) public payable {
        Property storage property = properties[_propertyId];
        require(property.isListedForSale, "Property not for sale");
        require(_offerAmount >= property.askingPrice * 90 / 100, "Offer too low");
        
        // Store offer with escrow (5% of offer)
        uint256 escrow = _offerAmount * 5 / 100;
        require(msg.value >= escrow, "Insufficient escrow");
        
        Offer memory newOffer = Offer({
            propertyId: _propertyId,
            buyer: msg.sender,
            offerAmount: _offerAmount,
            offerDate: block.timestamp,
            accepted: false,
            withdrawn: false,
            expirationDate: block.timestamp + 7 days
        });
        
        propertyOffers[_propertyId].push(newOffer);
        property.escrowAmount = escrow;
        
        emit OfferMade(_propertyId, msg.sender, _offerAmount);
        emit EscrowDeposited(_propertyId, msg.sender, escrow);
    }
    
    function acceptOffer(uint256 _propertyId, uint256 _offerIndex) public {
        Property storage property = properties[_propertyId];
        require(ownerOf(_propertyId) == msg.sender, "Not property owner");
        
        Offer storage offer = propertyOffers[_propertyId][_offerIndex];
        require(!offer.accepted, "Offer already accepted");
        require(!offer.withdrawn, "Offer withdrawn");
        require(offer.expirationDate > block.timestamp, "Offer expired");
        
        offer.accepted = true;
        
        // Transfer property ownership
        _transfer(msg.sender, offer.buyer, _propertyId);
        
        // Update property record
        property.previousOwners.push(msg.sender);
        property.currentOwner = offer.buyer;
        property.purchasePrice = offer.offerAmount;
        property.lastSoldDate = block.timestamp;
        property.isListedForSale = false;
        
        // Add to buyer's properties
        userProperties[offer.buyer].push(_propertyId);
        
        emit OfferAccepted(_propertyId, offer.buyer, offer.offerAmount);
        emit PropertyTransferred(_propertyId, msg.sender, offer.buyer, offer.offerAmount);
    }
    
    function releaseEscrow(uint256 _propertyId, uint256 _offerIndex) public {
        Property storage property = properties[_propertyId];
        Offer storage offer = propertyOffers[_propertyId][_offerIndex];
        
        require(offer.accepted, "Offer not accepted");
        require(!property.escrowReleased, "Escrow already released");
        require(msg.sender == property.currentOwner, "Not current owner");
        
        // Release escrow to seller
        payable(property.previousOwners[property.previousOwners.length - 1])
            .transfer(property.escrowAmount);
        
        property.escrowReleased = true;
        
        emit EscrowReleased(_propertyId, property.previousOwners[property.previousOwners.length - 1], property.escrowAmount);
    }
    
    function getPropertyHistory(uint256 _propertyId) 
        public 
        view 
        returns (
            address[] memory owners,
            uint256[] memory salePrices,
            uint256[] memory saleDates
        ) 
    {
        Property storage property = properties[_propertyId];
        
        owners = new address[](property.previousOwners.length + 1);
        salePrices = new uint256[](property.previousOwners.length);
        saleDates = new uint256[](property.previousOwners.length);
        
        // Include current owner
        owners[0] = property.currentOwner;
        
        // Include previous owners and sales
        for (uint i = 0; i < property.previousOwners.length; i++) {
            owners[i + 1] = property.previousOwners[i];
            // Note: Would need additional mapping to store all sale prices
        }
        
        return (owners, salePrices, saleDates);
    }
    
    function verifyPropertyOwnership(uint256 _propertyId, address _claimedOwner) 
        public 
        view 
        returns (bool) 
    {
        return ownerOf(_propertyId) == _claimedOwner;
    }
    
    function getActiveOffers(uint256 _propertyId) 
        public 
        view 
        returns (Offer[] memory) 
    {
        Offer[] storage offers = propertyOffers[_propertyId];
        uint256 activeCount = 0;
        
        // Count active offers
        for (uint i = 0; i < offers.length; i++) {
            if (!offers[i].accepted && !offers[i].withdrawn && 
                offers[i].expirationDate > block.timestamp) {
                activeCount++;
            }
        }
        
        // Return active offers
        Offer[] memory activeOffers = new Offer[](activeCount);
        uint256 index = 0;
        
        for (uint i = 0; i < offers.length; i++) {
            if (!offers[i].accepted && !offers[i].withdrawn && 
                offers[i].expirationDate > block.timestamp) {
                activeOffers[index] = offers[i];
                index++;
            }
        }
        
        return activeOffers;
    }
}