// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract DefireadyNFT is ERC721URIStorage, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    enum BuyerType {
        BUYER,
        QIB,
        SELLERONLY,
        VIEWER
    }

    struct Credential {
        address qualifier;
        bool isValid;
        uint256 time;
        BuyerType buyerType;
    }

    mapping(address => bool) private minters;
    mapping(uint256 => Credential) public credentials;

    /* ========== Events ========== */

    event Mint(uint256 indexed tokenId, Credential info);
    event Update(uint256 indexed tokenId, bool isValid, BuyerType _buyerType);
    event Burn(uint256 indexed tokenId);

    /* ========== Modifiers ========== */

    modifier onlyMinter() {
        require(
            isMinter(msg.sender) || msg.sender == owner(),
            "Invalid Minter"
        );
        _;
    }

    /* ========== Constructor ========== */

    constructor() ERC721("Defiready", "DFR") {}

    /* ========== Views ========== */

    /**
     * @notice To check minter is valid or not.
     * @return bool Minter Status.
     */
    function isMinter(address _minter) public view returns (bool) {
        return minters[_minter];
    }

    /* ========== Actions ========== */
    
    /**
     * @notice Add new minter
     * @param _minter Minter address to be added.
     * @dev Add minter into the minter list.
     */
    function addMinter(address _minter) external onlyOwner {
        minters[_minter] = true;
    }

    /**
     * @notice Delete a minter
     * @param _minter Minter address to be removed.
     * @dev Remove minter from the minter list.
     */
    function removeMinter(address _minter) external onlyOwner {
        delete minters[_minter];
    }

    /**
     * @notice Mint new token
     * @param _to Address to be received.
     * @param _tokenURI Token URL to use to display token metadata.
     * @dev Mint new token and set default attributes and uri.
     */
    function mint(address _to, string memory _tokenURI) external onlyMinter {
        uint256 tokenId = _tokenIds.current();
        _tokenIds.increment();
        _safeMint(_to, tokenId);
        _setTokenURI(tokenId, _tokenURI);

        Credential memory info = Credential({
            qualifier: msg.sender,
            isValid: true,
            time: block.timestamp,
            buyerType: BuyerType.BUYER
        });

        credentials[tokenId] = info;

        emit Mint(tokenId, info);
    }

    /**
     * @notice Update token
     * @param _tokenId Token ID to be updated.
     * @param _isValid To be set as attribute.
     * @param _buyerType To be set as attribute.
     * @dev Update existing token with attributes.
     */
    function update(
        uint256 _tokenId,
        bool _isValid,
        BuyerType _buyerType
    ) external onlyMinter {
        require(_exists(_tokenId), "Non-exist");
        Credential storage info = credentials[_tokenId];
        info.isValid = _isValid;
        info.buyerType = _buyerType;
        info.time = block.timestamp;

        emit Update(_tokenId, _isValid, _buyerType);
    }

    /**
     * @notice Burn token
     * @param _tokenId Token ID to be burned.
     * @dev Burn existing token.
     */
    function burn(uint256 _tokenId) external onlyMinter {
        require(_exists(_tokenId), "Non-exist");
        _burn(_tokenId);
        delete credentials[_tokenId];

        emit Burn(_tokenId);
    }

    /**
     * @notice Get TokenURI
     * @param _tokenId Token ID.
     * @dev Get token metadata url.
     */
    function tokenURI(
        uint256 _tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(_tokenId);
    }

    /**
     * @notice Check interface
     */
    function supportsInterface(
        bytes4 _interfaceId
    ) public view override(ERC721URIStorage, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(_interfaceId);
    }

    /**
     * @notice Burn NFT
     */
    function _burn(
        uint256 _tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(_tokenId);
    }

    /**
     * @notice Non-transferable without minting and burning
     */
    function _beforeTokenTransfer(
        address _from,
        address _to,
        uint256 _tokenId,
        uint256 _batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        require(
            _from == address(0) || _to == address(0),
            "Token not transferable"
        );
        super._beforeTokenTransfer(_from, _to, _tokenId, _batchSize);
    }
}
