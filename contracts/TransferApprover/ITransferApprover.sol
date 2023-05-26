// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.19;

interface ITransferApprover {
    function checkTransfer(address _from, address _to)
        external
        view
        returns (bool);
}