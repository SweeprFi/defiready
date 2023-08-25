const { ethers } = require("hardhat");
const { addresses, network } = require("../utils/address");

async function main() {
	[deployer] = await ethers.getSigners();
	deployer = deployer.address;
	whitelist = addresses.whitelist;

	console.log(`Deploying contracts on ${network.name} with the account: ${deployer}`);

	const approverInstance = await ethers.getContractFactory("TransferApprover");
	const approverContract = await approverInstance.deploy(whitelist);

	console.log("Transfer approver deployed to:", approverContract.address);
	console.log(`\nnpx hardhat verify --network ${network.name} ${approverContract.address} ${whitelist}`);
}

main();