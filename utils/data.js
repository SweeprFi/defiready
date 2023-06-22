const {
  wallets,
  tokens,
  networks,
  rpcLinks,
  apiKeys,
  libraries,
  uniswap
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

  // uniswap
  uniswap_factory: uniswap.factory[chainId],
  uniswap_router: uniswap.router[chainId],
  uniswap_universal_router: uniswap.universal_router[chainId],
  uniswap_position_manager: uniswap.positions_manager[chainId],
  uniswap_pool: uniswap.pool[chainId],
  uniswap_quoter: uniswap.quoter[chainId],
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