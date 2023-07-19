// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.19;

interface ITransferApprover {
    function checkTransfer(
        address _from,
        address _to,
        uint256 _amount
    ) external view returns (bool);
}
