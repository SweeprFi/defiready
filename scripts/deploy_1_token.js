const { ethers } = require('hardhat');
const { addresses, network } = require("../utils/data");

async function main() {
	let deployer = '';

	if (network.type === "0") { // local
		[deployer] = await ethers.getSigners();
		deployer = deployer.address;

	} else {
		deployer = addresses.owner;
	}

	console.log(`Deploying contracts on ${network.name} with the account: ${deployer}`);

	const DefireadyCoinInstance = await ethers.getContractFactory("DefireadyCoin");
	const defireadyCoin = await DefireadyCoinInstance.deploy();

	console.log("DefireadyCoin deployed to:", defireadyCoin.address);
	console.log(`\nnpx hardhat verify --network ${network.name} ${defireadyCoin.address}`);
}

main();
