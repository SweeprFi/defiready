const { ethers } = require("hardhat");
const { network } = require("../utils/address");

async function main() {
	[deployer] = await ethers.getSigners();
	deployer = deployer.address;

	console.log(`Deploying contracts on ${network.name} with the account: ${deployer}`);

	const WhiteInstance = await ethers.getContractFactory("Whitelist");
	const whitelistContract = await WhiteInstance.deploy();

	console.log("Whitelist deployed to:", whitelistContract.address);
	console.log(`\nnpx hardhat verify --network ${network.name} ${whitelistContract.address}`);
}

main();