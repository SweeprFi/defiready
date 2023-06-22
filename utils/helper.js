const { ethers } = require('hardhat');

const toBN = (numb, exp) => {
    return ethers.utils.parseUnits(numb, exp);
}

const Const = {
    ZERO: 0,
    TRUE: true,
    FALSE: false,
    USER_INVALID: 0,
    USER_NEW: 1,
    USER_VALID: 2,
    ONLY_VALID: 0,
    VALID_OR_NEW: 1,
}

module.exports = {
    toBN,
    Const
}

