const { ethers } = require("hardhat");
const { network } = require("../utils/address");

async function main() {
	[deployer] = await ethers.getSigners()
	console.log(`Deploying contracts on ${network.name} with the account: ${deployer.address}`);

	const nftInstance = await ethers.getContractFactory("DefireadyNFT");
	const nftContract = await nftInstance.deploy();

	console.log("DefireadyNFT deployed to:", nftContract.address);
	console.log(`\nnpx hardhat verify --network ${network.name} ${nftContract.address}`);
}

main();