const { ethers } = require('hardhat');
const { addresses } = require("../utils/address");

async function main() {
	let txn;
	const universalRouter = addresses.uniswap_universal_router;
	const router = addresses.uniswap_router;
	const quoter = addresses.uniswap_quoter;
	const pool = addresses.uniswap_pool;

	approver = await ethers.getContractAt("TransferApprover", addresses.approver);

	txn = await (await approver.whitelist(universalRouter)).wait();
	console.log(`Uniswap Universal Router whitelisted: ${txn.transactionHash}`);

	txn = await (await approver.whitelist(router)).wait();
	console.log(`Uniswap Router whitelisted: ${txn.transactionHash}`);

	txn = await (await approver.whitelist(quoter)).wait();
	console.log(`Uniswap Quoter whitelisted: ${txn.transactionHash}`);

	txn = await (await approver.whitelist(pool)).wait();
	console.log(`Uniswap Pool whitelisted: ${txn.transactionHash}`);
}

main();
