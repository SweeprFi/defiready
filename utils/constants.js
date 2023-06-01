const networks = {
  1: 'mainnet',
  5: 'goerli',
  421613: 'arbitrum_goerli',
  42161: 'arbitrum',
}

const chainIDs = {
  'mainnet': 1,
  'goerli': 5,
  'arbitrum_goerli': 421613,
  'arbitrum': 42161,
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
    42161: '0xF75F92BF819FcBA96209990aE040DABd9Fd1c067',
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
  libraries,
  uniswap
}