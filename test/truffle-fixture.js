const { artifacts } = require('hardhat');
const { addresses } = require("../utils/address");
const { sendEth } = require("../utils/helper_functions");

const SWEEP = artifacts.require("contracts/Sweep.sol:SWEEP");

module.exports = async () => {
  // Get the necessary instances
  // ======================================================
  sweep_instance = await SWEEP.at(addresses.sweep);
  // ----------------------------------------------
  SWEEP.setAsDeployed(sweep_instance);
  // ----------------------------------------------
  sweep_owner = await sweep_instance.owner();
  await sendEth(sweep_owner);
}
