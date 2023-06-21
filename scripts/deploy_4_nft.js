const { ethers } = require("hardhat");
const { network, addresses } = require("../utils/data");

async function main() {
	[deployer] = await ethers.getSigners()
	console.log(`Deploying contracts on ${network.name} with the account: ${deployer.address}`);

	const nftInstance = await ethers.getContractFactory("DefireadyNFT");
	const nftContract = await nftInstance.deploy(addresses.layerZeroEndpoint);

	console.log("DefireadyNFT deployed to:", nftContract.address);
	console.log(`\nnpx hardhat verify --network ${network.name} ${nftContract.address} ${addresses.layerZeroEndpoint}`);
}

main();