const { ethers } = require("hardhat");
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

	const WhiteInstance = await ethers.getContractFactory("Whitelist");
	const whitelistContract = await WhiteInstance.deploy();

	console.log("Whitelist deployed to:", whitelistContract.address);
	console.log(`\nnpx hardhat verify --network ${network.name} ${whitelistContract.address}`);
}

main();