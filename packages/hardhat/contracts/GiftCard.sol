// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GiftCard is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    struct GiftCardStruct {
        uint256 tokenId;
        uint256 amount;
        string message;
        string signedBy;
        address mintedBy;
        bool isUnwrapped;
        bool isBurnt;
        uint256 timestamp;
        bool isInitialized;
    }

    mapping(uint256 => GiftCardStruct) private _giftMap;
    mapping(address => uint256[]) private _sentGifts;
    uint256 private _totalFees;
    uint256 private _totalFeesWithdrawn;

    constructor(
        address initialOwner
    ) ERC721("Gift NFT Card", "GNFTCARD") Ownable(initialOwner) {}

    function safeMint(
        address to,
        string memory message,
        string memory signedBy,
        string memory tokenURI
    ) public payable {
        uint256 minGiftValue = 100_000_000_000_000_000;
        uint256 minMintFee = _calculateMintFees(minGiftValue);
        uint256 minValue = minGiftValue + minMintFee;

        require(
            msg.value >= minValue,
            "Gift card value must be greater than or equal to 0.1 CELO"
        );

        uint256 mintFees = _calculateMintFees(msg.value);
        _totalFees += mintFees;
        uint256 giftValue = msg.value - mintFees;

        uint256 tokenId = _tokenIdCounter++;

        _safeMint(to, tokenId);

        _setTokenURI(tokenId, tokenURI);

        _giftMap[tokenId] = GiftCardStruct({
            tokenId: tokenId,
            amount: giftValue,
            message: message,
            signedBy: signedBy,
            mintedBy: msg.sender,
            isUnwrapped: false,
            isBurnt: false,
            timestamp: block.timestamp,
            isInitialized: true
        });
        _sentGifts[msg.sender].push(tokenId);
    }

    function _calculateMintFees(uint256 value) private pure returns (uint256) {
        uint256 fee = (value * 5) / 105;
        uint256 oneCelo = 1_000_000_000_000_000_000;
        if (fee > oneCelo) {
            fee = oneCelo;
        }
        return fee;
    }

    function _getGiftCard(
        uint256 tokenId
    ) private view returns (GiftCardStruct memory) {
        GiftCardStruct memory card = _giftMap[tokenId];
        require(card.isInitialized == true, "Gift card not found");
        return card;
    }

    function unwrapGiftCard(uint256 tokenId) public {
        require(
            ownerOf(tokenId) == msg.sender,
            "Caller is not owner"
        );
        GiftCardStruct memory gift = _getGiftCard(tokenId);
        _unwrapGiftCardAndDisburse(gift, msg.sender);
    }

    function _unwrapGiftCardAndDisburse(
        GiftCardStruct memory gift,
        address owner
    ) private {
        uint256 giftAmount = gift.amount;
        require(
            gift.isUnwrapped == false,
            "Cannot unwrap already unwrapped gift card"
        );
        _giftMap[gift.tokenId].isUnwrapped = true;
        _giftMap[gift.tokenId].amount = 0;
        address payable sender = payable(owner);
        (bool sent, ) = sender.call{value: giftAmount}("");
        require(sent, "Failed to unwrap gift card");
    }

    function getTotalFees() public view onlyOwner returns (uint256) {
        return _totalFees;
    }

    function getTotalFeesWithdrawn() public view onlyOwner returns (uint256) {
        return _totalFeesWithdrawn;
    }

    function withdrawFees() public onlyOwner {
        uint256 unwithdrawnFees = _totalFees - _totalFeesWithdrawn;
        require(unwithdrawnFees > 0, "No fees to withdraw yet");
        _totalFeesWithdrawn = _totalFees;
        (bool sent, ) = payable(msg.sender).call{value: unwithdrawnFees}("");
        require(sent, "Failed to withdraw fees");
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
