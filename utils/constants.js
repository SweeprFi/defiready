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
    5: '0x3C3c5E4E2d1B1B1CBcA85C09602589BC658a69c4',
    42161: ''
  },
  approver: {
    1: '',
    5: '0x31842cF3Ec518Dee578d5b3EbC4D97216344B0e9',
    42161: ''
  },
  layerZeroEndpoint: {
    1: '0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675',
    5: '0xbfD2135BFfbb0B5378b56643c2Df8a87552Bfa23',
    42161: '0x3c2269811836af69497E5F486A85D7316753cf62',
    421613: '0x6aB5Ae6822647046626e83ee6dB8187151E1d5ab'
  }
}

const uniswap = {
  factory: {
    1: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    5: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    42161: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  },
  router: {
    1: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
    5: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
    42161: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
  },
  universal_router: {
    1: '0xEf1c6E67703c7BD7107eed8303Fbe6EC2554BF6B',
    5: '0x4648a43B2C14Da09FdF82B161150d3F634f40491',
    42161: '0x4C60051384bd2d3C01bfc845Cf5F4b44bcbE9de5',
    421613: '0x4648a43B2C14Da09FdF82B161150d3F634f40491',
  },
  positions_manager: {
    1: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
    5: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
    42161: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
  },
  pool: {
    1: '',
    5: '0xde5789B9690298C8D7418CC6eCE24f6EBce55aC2',
    42161: '',
  },
  quoter: {
    1: '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
    5: '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
    42161: '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
  }
}

module.exports = {
  wallets,
  tokens,
  networks,
  chainIDs,
  rpcLinks,
  apiKeys,
  libraries,
  uniswap
}