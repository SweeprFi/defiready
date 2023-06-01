// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.19;

// ====================================================================
// ======================= Transfer Approver ======================
// ====================================================================

import "@openzeppelin/contracts/access/Ownable.sol";
import "./IWhitelist.sol";

/**
 * @title Transfer Approver
 * @dev Allows accounts to be blacklisted by admin role
 */
contract TransferApprover is Ownable {
    IWhitelist private whitelist;

    enum Validation {
        ONLY_VALID,
        VALID_OR_NEW
    }

    Validation public validation_method;
    uint256 public time_delay;

    event SetValidationType(Validation _validation_method);
    event SetTimeDelay(uint256 _new_time_delay);
    event UnBlacklisted(address indexed _account);

    /* ========== CONSTRUCTOR ========== */

    constructor(address _whitelist) {
        whitelist = IWhitelist(_whitelist);
        validation_method = Validation.ONLY_VALID;
    }

    /**
     * @notice Returns token transferability
     * @param _from sender address
     * @param _to beneficiary address
     * @return (bool) true - allowance, false - denial
     */
    function checkTransfer(
        address _from,
        address _to
    ) external view returns (bool) {
        if (_from == address(0) || _to == address(0)) return true;

        return (isValid(_from) && isValid(_to)) ? true : false;
    }

    /**
     * @dev Checks if account is valid
     * @param _account The address to check
     */
    function isValid(address _account) public view returns (bool) {
        (IWhitelist.Status status, uint256 created_at) = whitelist.getUser(
            _account
        );

        if (status == IWhitelist.Status.VALID) {
            return true;
        } else if (
            status == IWhitelist.Status.NEW &&
            validation_method == Validation.VALID_OR_NEW &&
            time_delay > 0
        ) {
            return (block.timestamp - created_at > time_delay) ? true : false;
        } else {
            return false;
        }
    }

    /**
     * @dev Set time delay
     * @param _new_delay new time delay
     */
    function setTimeDelay(uint256 _new_delay) external onlyOwner {
        time_delay = _new_delay;

        emit SetTimeDelay(_new_delay);
    }

    /**
     * @dev Set validation method
     * @param _new_method new validation method
     */
    function setValidationType(Validation _new_method) external onlyOwner {
        validation_method = _new_method;

        emit SetValidationType(_new_method);
    }
}
