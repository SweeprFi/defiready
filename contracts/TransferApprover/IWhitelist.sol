// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.19;

interface IWhitelist {
    enum Status {
        INVALID,
        NEW,
        VALID
    }

    function getUser(address _account) external view returns (Status, uint256);
}