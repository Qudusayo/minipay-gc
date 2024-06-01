// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MGC is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    IERC20 public token;
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
        address initialOwner,
        address _tokenAddress
    ) ERC721("Minipay Gift Card", "MGC") Ownable(initialOwner) {
        token = IERC20(_tokenAddress);
    }

    function safeMint(
        address to,
        uint256 _amount,
        string memory message,
        string memory signedBy,
        string memory uri
    ) public payable {
        uint256 minGiftValue = 100_000_000_000_000_000;
        uint256 minMintFee = _calculateMintFees(minGiftValue);
        uint256 minValue = minGiftValue + minMintFee;

        require(
            _amount >= minValue,
            "Gift card value must be greater than or equal to 0.1 CELO"
        );

        // Transfer the amount from the user to the contract
        require(
            token.transferFrom(msg.sender, address(this), _amount),
            "Failed to transfer tokens"
        );

        uint256 mintFees = _calculateMintFees(_amount);
        _totalFees += mintFees;
        uint256 giftValue = _amount - mintFees;

        uint256 tokenId = _tokenIdCounter++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

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

    function lengthOfSentGiftCards() public view returns (uint256) {
        return _sentGifts[msg.sender].length;
    }

    function _getGiftCard(
        uint256 tokenId
    ) private view returns (GiftCardStruct memory) {
        GiftCardStruct memory card = _giftMap[tokenId];
        require(card.isInitialized == true, "Gift card not found");
        return card;
    }

    function getGiftCardByIndex(
        uint256 index
    ) public view returns (GiftCardStruct memory) {
        uint256 tokenId = tokenOfOwnerByIndex(msg.sender, index);
        return _getGiftCard(tokenId);
    }

    function getSentGiftCardByIndex(
        uint256 index
    ) public view returns (GiftCardStruct memory) {
        uint256[] memory tokenIds = _sentGifts[msg.sender];
        require(tokenIds.length > index, "GiftNFTCard: gift card not found");
        uint256 tokenId = tokenIds[index];
        return _getGiftCard(tokenId);
    }

    function unwrapGiftCard(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Caller is not owner");
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
        require(
            token.transfer(sender, giftAmount),
            "Failed to unwrap gift card"
        );
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
        require(
            token.transfer(msg.sender, unwithdrawnFees),
            "Failed to withdraw fees"
        );
    }

    // The following functions are overrides required by Solidity.

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC721, ERC721URIStorage, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }
}
