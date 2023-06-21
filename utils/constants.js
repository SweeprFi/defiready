require('dotenv').config();

const networks = {
  1: 'mainnet',
  5: 'goerli',
  42161: 'arbitrum',
  421613: 'arbitrum_goerli',
}

const chainIDs = {
  'mainnet': 1,
  'goerli': 5,
  'arbitrum': 42161,
  'arbitrum_goerli': 421613,
}

const rpcLinks = {
  1: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`,
  5: `https://eth-goerli.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`,
  42161: `https://arb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`,
  421613: `https://arb-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`,
}

const apiKeys = {
  1: process.env.ETHERSCAN_API_KEY,
  5: process.env.ETHERSCAN_API_KEY,
  42161: process.env.ARBISCAN_API_KEY,
  421613: process.env.ARBISCAN_API_KEY
}

const wallets = {
  owner: {
    1: '',
    5: '',
    421613: '',
    42161: ''
  }
}

const tokens = {
  defireadyCoin: {
    1: '',
    5: '',
    42161: ''
  },
  defireadyNFT: {
    1: '',
    5: '0x071E49d9d286Ef5af6b7aD6e34BA0a0820B41003',
    42161: '',
    421613: '0xad62eBE71B1ac804Bf149561A14A5a7F4CbF52e3'
  }
}

const libraries = {
  whitelist: {
    1: '',
    5: '',
    42161: ''
  },
  approver: {
    1: '',
    5: '',
    42161: ''
  },
  layerZeroEndpoint: {
    1: '0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675',
    5: '0xbfD2135BFfbb0B5378b56643c2Df8a87552Bfa23',
    42161: '0x3c2269811836af69497E5F486A85D7316753cf62',
    421613: '0x6aB5Ae6822647046626e83ee6dB8187151E1d5ab'
  }
}

module.exports = {
  wallets,
  tokens,
  networks,
  chainIDs,
  rpcLinks,
  apiKeys,
  libraries
}