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

module.exports = {
  wallets,
  tokens,
  networks,
  chainIDs,
  libraries
}