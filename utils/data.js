const {
  wallets,
  tokens,
  networks,
  rpcLinks,
  apiKeys,
  libraries
} = require("./constants");
require('dotenv').config();

const chainId = process.env.CHAIN_ID;
const networkType = process.env.NETWORK_TYPE;

const rpcLink = rpcLinks[chainId];
const apiKey = apiKeys[chainId];

const addresses = {
  // Wallets
  owner: wallets.owner[chainId],

  // Tokens
  defireadyCoin: tokens.defireadyCoin[chainId],
  defireadyNFT: tokens.defireadyNFT[chainId],

  // Libraries
  whitelist: libraries.whitelist[chainId],
  approver: libraries.approver[chainId],
  layerZeroEndpoint: libraries.layerZeroEndpoint[chainId],
}

const network = {
  name: networks[chainId],
  type: networkType
}


module.exports = {
  addresses,
  network,
  rpcLink,
  apiKey
}