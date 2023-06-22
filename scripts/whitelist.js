const { ethers } = require('hardhat');
const { addresses } = require("../utils/address");
const { Const } = require('../utils/helper_functions');

async function main() {
	let txn;
	const universalRouter = addresses.uniswap_universal_router;
	const router = addresses.uniswap_router;
	const quoter = addresses.uniswap_quoter;
	const pool = addresses.uniswap_pool;

	// const borrower = "0x93aE1efd2E78028351C080FA0fbBBeF97Ec42EAD";
	// const asset_aave = "0x924CCB6C4890b88F241cE3825c6C731967156897";
	// const asset_uniswap = "0x26CC4A46484da4686c4D6E77767A6d7740F63f63";
	// const asset_backed = "0x834557f46E2F3833e4f926Df1c4858F26A18E318";

	whitelist = await ethers.getContractAt("Whitelist", addresses.whitelist);

	console.log("Adding address to the whitelist ...");
	txn = await (await whitelist.addUser(universalRouter)).wait();
	console.log(`Uniswap Universal Router whitelisted: ${txn.transactionHash}`);
	txn = await (await whitelist.addUser(router)).wait();
	console.log(`Uniswap Router whitelisted: ${txn.transactionHash}`);
	txn = await (await whitelist.addUser(quoter)).wait();
	console.log(`Uniswap Quoter whitelisted: ${txn.transactionHash}`);
	txn = await (await whitelist.addUser(pool)).wait();
	console.log(`Uniswap Pool whitelisted: ${txn.transactionHash}`);
	// Optional
	// txn = await (await whitelist.addUser(borrower)).wait();
	// console.log(`Borrower whitelisted: ${txn.transactionHash}`);
	// txn = await (await whitelist.addUser(asset_aave)).wait();
	// console.log(`Aave asset: ${txn.transactionHash}`);
	// txn = await (await whitelist.addUser(asset_uniswap)).wait();
	// console.log(`Uniswap asset whitelisted: ${txn.transactionHash}`);
	// txn = await (await whitelist.addUser(asset_backed)).wait();
	// console.log(`Backed asset whitelisted: ${txn.transactionHash}`);

	console.log("\nSetting addresses with USER_VALID ...");
	txn = await (await whitelist.setUserStatus(universalRouter, Const.USER_VALID)).wait();
	console.log(`Uniswap Universal Router configured with USER_VALID: ${txn.transactionHash}`);
	txn = await (await whitelist.setUserStatus(router, Const.USER_VALID)).wait();
	console.log(`Uniswap Router configured with USER_VALID: ${txn.transactionHash}`);
	txn = await (await whitelist.setUserStatus(quoter, Const.USER_VALID)).wait();
	console.log(`Uniswap Quoter configured with USER_VALID: ${txn.transactionHash}`);
	txn = await (await whitelist.setUserStatus(pool, Const.USER_VALID)).wait();
	console.log(`Uniswap Pool configured with USER_VALID: ${txn.transactionHash}`);
	// Optional
	// txn = await (await whitelist.setUserStatus(borrower, Const.USER_VALID)).wait();
	// console.log(`Borrower configured with USER_VALID: ${txn.transactionHash}`);
	// txn = await (await whitelist.setUserStatus(asset_aave, Const.USER_VALID)).wait();
	// console.log(`Aave asset configured with USER_VALID: ${txn.transactionHash}`);
	// txn = await (await whitelist.setUserStatus(asset_uniswap, Const.USER_VALID)).wait();
	// console.log(`Uniswap asset configured with USER_VALID: ${txn.transactionHash}`);
	// txn = await (await whitelist.setUserStatus(asset_backed, Const.USER_VALID)).wait();
	// console.log(`Backed asset configured with USER_VALID: ${txn.transactionHash}`);
}

main();
