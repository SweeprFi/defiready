// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.19;

// ====================================================================
// ======================= Whitelist ======================
// ====================================================================

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Whitelist
 * @dev Hold a list of addresses that can be used in more than one transferApprover
 */
contract Whitelist is Ownable {
    enum Status {
        INVALID,
        NEW,
        VALID
    }

    struct User {
        Status status;
        uint256 createdDt;
    }

    mapping(address => User) public users;

    event AddedUser(address indexed _account);
    event UpdatedStatus(address indexed _account, Status _status);

    /* ========== CONSTRUCTOR ========== */

    constructor() {}

    /**
     * @dev Get User info
     * @param _account The address to check
     */
    function getUser(
        address _account
    ) external view returns (Status status, uint256 createdDt) {
        status = users[_account].status;
        createdDt = users[_account].createdDt;
    }

    /**
     * @dev Adds account
     * @param _account The address to add
     */
    function addUser(address _account) external {
        require(users[_account].createdDt == 0, "already added");
        User memory user = User(Status.NEW, block.timestamp);
        users[_account] = user;

        emit AddedUser(_account);
    }

    /**
     * @dev Set user's status
     * @param _account The address to set status
     * @param _status User state to set
     */
    function setUserStatus(
        address _account,
        Status _status
    ) external onlyOwner {
        require(users[_account].createdDt > 0, "not exist");
        users[_account].status = _status;

        emit UpdatedStatus(_account, _status);
    }
}
