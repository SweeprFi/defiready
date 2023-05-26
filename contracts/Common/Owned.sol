// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity 0.8.19;

// ==========================================================
// ====================== Owned ========================
// ==========================================================

import "../ISweep.sol";

contract Owned {
    address public immutable sweep_address;
    ISweep public immutable SWEEP;

    // Errors
    error NotGovernance();
    error NotMultisig();
    error ZeroAddressDetected();

    constructor(address _sweep_address) {
        if(_sweep_address == address(0)) revert ZeroAddressDetected();

        sweep_address = _sweep_address;
        SWEEP = ISweep(_sweep_address);
    }

    modifier onlyGov() {
        if (msg.sender != SWEEP.owner()) revert NotGovernance();
        _;
    }

    modifier onlyMultisig() {
        if (msg.sender != SWEEP.owner())
            revert NotMultisig();
        _;
    }
}
