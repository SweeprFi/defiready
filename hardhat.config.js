require("@nomiclabs/hardhat-etherscan");
require('@openzeppelin/hardhat-upgrades');
require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-truffle5");
require('@nomicfoundation/hardhat-chai-matchers');
require('hardhat-contract-sizer');
require('solidity-coverage');
require('./tasks');
require('dotenv').config();
const { rpcLink, apiKey } = require("./utils/data");
const { rpcLinks } = require("./utils/constants");

module.exports = {
	solidity: {
		compilers: [
			{
				version: "0.8.19",
				settings: {
					optimizer: {
						enabled: true,
						runs: 200
					}
				}
			},
		],
	},
	networks: {
		hardhat: {
			forking: {
				url: rpcLink,
				// blockNumber: 20005467
			}
		},
		localhost: {
			allowUnlimitedContractSize: true,
			blockGasLimit: 87500000000,
			url: 'http://127.0.0.1:8545/',
		},
		chain2: {
			allowUnlimitedContractSize: true,
			blockGasLimit: 87500000000,
		  	url: "http://127.0.0.1:8546",
		},
		mainnet: {
			url: rpcLinks[1],
			gas: 10000000,
			chainId: 1,
			accounts: [process.env.OWNER_PKEY],
		},
		goerli: {
			url: rpcLinks[5],
			gas: 10000000,
			chainId: 5,
			accounts: [process.env.OWNER_PKEY, process.env.BORROWER_PKEY]
		},
		arbitrum: {
			url: rpcLinks[42161],
			gas: 10000000,
			chainId: 42161,
			accounts: [process.env.OWNER_PKEY, process.env.BORROWER_PKEY]
		},
		arbitrum_goerli: {
			url: rpcLinks[421613],
			gas: 10000000,
			chainId: 421613,
			accounts: [process.env.OWNER_PKEY, process.env.BORROWER_PKEY]
		}
	},
	etherscan: {
		apiKey: apiKey
	},
	gasReporter: {
		enabled: (process.env.REPORT_GAS) ? true : false,
		currency: 'USD'
	},
	mocha: {
    timeout: 100000000
  }
};
