const { ethers } = require('hardhat');

const sendEth = async (account) => {
    await hre.network.provider.request({
        method: "hardhat_setBalance",
        params: [account, ethers.utils.parseEther('15').toHexString()]
    });
}

const impersonate = async (account) => {
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [account]
    });
    return await ethers.getSigner(account);
}

const increaseTime = async (seconds) => {
    await network.provider.send("evm_increaseTime", [seconds]);
    await network.provider.send("evm_mine");
}

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
    sendEth,
    impersonate,
    increaseTime,
    toBN,
    Const
}

