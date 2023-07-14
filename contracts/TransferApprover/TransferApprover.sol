// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.19;

// ====================================================================
// ======================= Transfer Approver ======================
// ====================================================================

import "./ITransferApprover.sol";
import "./IWhitelist.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Transfer Approver
 * @dev Allows accounts to be blacklisted by admin role
 */
contract TransferApprover is Ownable, ITransferApprover {
    IWhitelist private whitelist;

    enum Validation {
        ONLY_VALID,
        VALID_OR_NEW
    }

    Validation public validationType;
    uint256 public timeDelay;

    event SetValidationType(Validation _type);
    event SetTimeDelay(uint256 indexed _delay);
    event UnBlacklisted(address indexed _account);

    /* ========== CONSTRUCTOR ========== */

    constructor(address _whitelist) {
        whitelist = IWhitelist(_whitelist);
        validationType = Validation.ONLY_VALID;
    }

    /**
     * @notice Returns token transferability
     * @param _from sender address
     * @param _to beneficiary address
     * @return (bool) true - allowance, false - denial
     */
    function checkTransfer(
        address _from,
        address _to,
        uint256
    ) external view override returns (bool) {
        if (_from == address(0) || _to == address(0)) return true;

        return (isValid(_from) && isValid(_to)) ? true : false;
    }

    /**
     * @dev Checks if account is valid
     * @param _account The address to check
     */
    function isValid(address _account) public view returns (bool) {
        (IWhitelist.Status status, uint256 createdDt) = whitelist.getUser(
            _account
        );

        if (createdDt == 0) return false; // Non-WhiteList User

        if (status == IWhitelist.Status.VALID) {
            return true;
        } else if (
            status == IWhitelist.Status.NEW &&
            validationType == Validation.VALID_OR_NEW
        ) {
            return
                timeDelay == 0 || (block.timestamp - createdDt > timeDelay)
                    ? true
                    : false;
        } else {
            return false;
        }
    }

    /**
     * @dev Set time delay
     * @param _delay new time delay
     */
    function setTimeDelay(uint256 _delay) external onlyOwner {
        timeDelay = _delay;

        emit SetTimeDelay(_delay);
    }

    /**
     * @dev Set validation method
     * @param _method new validation method
     */
    function setValidationType(Validation _method) external onlyOwner {
        validationType = _method;

        emit SetValidationType(_method);
    }
}
