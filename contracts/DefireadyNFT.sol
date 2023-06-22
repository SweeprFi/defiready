// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.19;

import "@layerzerolabs/solidity-examples/contracts/lzApp/NonblockingLzApp.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract DefireadyNFT is NonblockingLzApp, ERC721URIStorage, ERC721Enumerable {
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

    struct StoredCredit {
        uint16 srcChainId;
        address toAddress;
        bool creditsRemain;
    }

    uint16 public constant FUNCTION_TYPE_SEND = 1;

    mapping(address => bool) private minters;
    mapping(uint256 => Credential) public credentials;
    mapping(uint16 => uint256) public dstChainIdToTransferGas; // per transfer amount of gas required to mint/transfer on the dst

    /* ========== Events ========== */

    event Mint(uint256 indexed tokenId, Credential credential);
    event Update(uint256 indexed tokenId, bool isValid, BuyerType _buyerType);
    event Burn(uint256 indexed tokenId);
    event SendToChain(
        uint16 indexed _dstChainId,
        address indexed _toAddress,
        uint256 _tokenId
    );
    event ReceiveFromChain(
        uint16 indexed _srcChainId,
        bytes indexed _srcAddress,
        address indexed _toAddress
    );
    event SetDstChainIdToTransferGas(
        uint16 _dstChainId,
        uint256 _dstChainIdToTransferGas
    );

    /* ========== Modifiers ========== */

    modifier onlyMinter() {
        require(
            isMinter(msg.sender) || msg.sender == owner(),
            "Invalid Minter"
        );
        _;
    }

    /* ========== Constructor ========== */

    constructor(
        address _lzEndpoint
    ) ERC721("Defiready", "DFR") NonblockingLzApp(_lzEndpoint) {}

    /* ========== Views ========== */

    /**
     * @notice Check interface
     */
    function supportsInterface(
        bytes4 _interfaceId
    ) public view override(ERC721URIStorage, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(_interfaceId);
    }

    /**
     * @notice To check minter is valid or not.
     * @return bool Minter Status.
     */
    function isMinter(address _minter) public view returns (bool) {
        return minters[_minter];
    }

    /**
     * @notice Get fee to send token to the destination chain.
     * @return nativeFee Fee with native token.
     * @return zroFee Fee with zro token.
     */
    function estimateSendFee(
        uint16 _dstChainId,
        bytes memory _toAddress,
        uint256 _tokenId,
        bool _useZro,
        bytes memory _adapterParams
    ) public view returns (uint256 nativeFee, uint256 zroFee) {
        bytes memory payload = abi.encode(_toAddress, _tokenId);
        return
            lzEndpoint.estimateFees(
                _dstChainId,
                address(this),
                payload,
                _useZro,
                _adapterParams
            );
    }

    /* ========== Settings ========== */

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
     * @notice Set gas amount per destination chain ID.
     * @param _dstChainId chain ID.
     * @param _dstChainIdToTransferGas Gas amount.
     * @dev Ensures enough gas in adapter params to handle batch transfer gas amounts on the dst.
     */
    function setDstChainIdToTransferGas(
        uint16 _dstChainId,
        uint256 _dstChainIdToTransferGas
    ) external onlyOwner {
        require(_dstChainIdToTransferGas > 0, "Should be over 0");
        dstChainIdToTransferGas[_dstChainId] = _dstChainIdToTransferGas;

        emit SetDstChainIdToTransferGas(_dstChainId, _dstChainIdToTransferGas);
    }

    /* ========== Actions ========== */

    /**
     * @notice Mint new token
     * @param _to Address to be received.
     * @param _tokenURI Token URL to use to display token metadata.
     * @dev Mint new token and set default attributes and uri.
     */
    function mint(address _to, string memory _tokenURI) external onlyMinter {
        require(ERC721.balanceOf(_to) == 0, "Already minted");
        Credential memory credential = Credential({
            qualifier: msg.sender,
            isValid: true,
            time: block.timestamp,
            buyerType: BuyerType.BUYER
        });

        _creditTo(_to, credential, _tokenURI);
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
        Credential storage credential = credentials[_tokenId];
        credential.isValid = _isValid;
        credential.buyerType = _buyerType;
        credential.time = block.timestamp;

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
     * @notice Send token to the destination chain. 
     * @param _dstChainId Chain ID.
     * @param _tokenId Token ID.
     * @param _adapterParams Parameters for custom functionality. e.g. receive airdropped native gas from the relayer on destination
     * @dev Copy or Update source chain's token to the other chain.
     */
    function sendFrom(
        uint16 _dstChainId,
        uint256 _tokenId,
        bytes memory _adapterParams
    ) external payable onlyMinter {
        require(_exists(_tokenId), "Non-exist");
        address _toAddress = ERC721.ownerOf(_tokenId);

        _send(_dstChainId, _toAddress, _tokenId, _adapterParams);
    }

    /**
     * @notice Send token to the destination contract.
     */
    function _send(
        uint16 _dstChainId,
        address _toAddress,
        uint256 _tokenId,
        bytes memory _adapterParams
    ) internal {
        Credential memory _credential = credentials[_tokenId];
        string memory _tokenURI = tokenURI(_tokenId);
        bytes memory payload = abi.encode(_toAddress, _credential, _tokenURI);

        _checkGasLimit(
            _dstChainId,
            FUNCTION_TYPE_SEND,
            _adapterParams,
            dstChainIdToTransferGas[_dstChainId]
        );
        _lzSend(
            _dstChainId,
            payload,
            payable(msg.sender),
            address(0x0),
            _adapterParams,
            msg.value
        );

        emit SendToChain(_dstChainId, _toAddress, _tokenId);
    }

    /**
     * @notice Receive token from the source contract.
     */
    function _nonblockingLzReceive(
        uint16 _srcChainId,
        bytes memory _srcAddress,
        uint64 /*_nonce*/,
        bytes memory _payload
    ) internal virtual override {
        // decode and load the toAddress
        (
            address _toAddress,
            Credential memory _credential,
            string memory _tokenURI
        ) = abi.decode(_payload, (address, Credential, string));

        if (ERC721.balanceOf(_toAddress) == 0) {
            _creditTo(_toAddress, _credential, _tokenURI);
        } else {
            _updateOf(_toAddress, _credential, _tokenURI);
        }

        emit ReceiveFromChain(_srcChainId, _srcAddress, _toAddress);
    }

    /**
     * @notice Mint token
     */
    function _creditTo(
        address _toAddress,
        Credential memory _credential,
        string memory _tokenURI
    ) internal {
        uint256 _tokenId = _tokenIds.current();
        _tokenIds.increment();

        _safeMint(_toAddress, _tokenId);
        _setTokenURI(_tokenId, _tokenURI);
        credentials[_tokenId] = _credential;

        emit Mint(_tokenId, _credential);
    }

    /**
     * @notice Update token status
     */
    function _updateOf(
        address _tokenOwner,
        Credential memory _credential,
        string memory _tokenURI
    ) internal {
        uint256 _tokenId = tokenOfOwnerByIndex(_tokenOwner, 0);
        Credential storage credential = credentials[_tokenId];
        credential.isValid = _credential.isValid;
        credential.buyerType = _credential.buyerType;
        credential.time = _credential.time;

        _setTokenURI(_tokenId, _tokenURI);

        emit Update(_tokenId, _credential.isValid, _credential.buyerType);
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
