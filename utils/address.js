const {
  wallets,
  tokens,
  networks,
  libraries
} = require("./constants");
require('dotenv').config();

const chainId = process.env.CHAIN_ID;
const networkType = process.env.NETWORK_TYPE;

const addresses = {
  // Wallets
  owner: wallets.owner[chainId],

  // Tokens
  sweep: tokens.sweep[chainId],

  // Libraries
  whitelist: libraries.whitelist[chainId],
  approver: libraries.approver[chainId],
}

const network = {
  name: networks[chainId],
  type: networkType
}


module.exports = {
  addresses,
  network
}