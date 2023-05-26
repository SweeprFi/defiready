// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.19;

// ====================================================================
// ======================= DeFi-ready wholesale market token ==================
// ====================================================================

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./TransferApprover/ITransferApprover.sol";

contract DefireadyCoin is ERC20, Ownable {
    ITransferApprover private transferApprover;

    event ApproverSet(address indexed approver);

    error ZeroAddressDetected();
    error TransferNotAllowed();

    constructor() ERC20("DefireadyCoin", "DFRTEST") {}

    /**
     * @notice Mint tokens
     * @param _to beneficiary address
     * @param _amount token amount
     */
    function mint(address _to, uint256 _amount) public onlyOwner {
        _mint(_to, _amount);
    }

    /**
     * @notice Set Transfer Approver
     * @param _approver Address of a Approver.
     */
    function setTransferApprover(address _approver) external onlyOwner {
        if (_approver == address(0)) revert ZeroAddressDetected();
        transferApprover = ITransferApprover(_approver);

        emit ApproverSet(_approver);
    }

    /**
     * @notice Hook that is called before any transfer of Tokens
     * @param _from sender address
     * @param _to beneficiary address
     * @param _amount token amount
     */
    function _beforeTokenTransfer(
        address _from,
        address _to,
        uint256 _amount
    ) internal override {
        if (
            address(transferApprover) != address(0) &&
            !transferApprover.checkTransfer(_from, _to)
        ) revert TransferNotAllowed();

        super._beforeTokenTransfer(_from, _to, _amount);
    }
}