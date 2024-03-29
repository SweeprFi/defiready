const { expect } = require("chai");
const { expectRevert } = require('@openzeppelin/test-helpers');
const { ethers } = require("hardhat");
const { Const } = require("../utils/helper_functions");

contract("Whitelist", async function () {
	before(async () => {
		[owner, user1, user2, lzEndpoint] = await ethers.getSigners();
		// ------------- Deployment of contracts -------------
		DefireadyCoin = await ethers.getContractFactory("DefireadyCoin");
		defireadyCoin = await DefireadyCoin.deploy();

		Whitelist = await ethers.getContractFactory("Whitelist");
		whitelist = await Whitelist.deploy();
	});

	it('add user1 correctly', async () => {
		await whitelist.addUser(user1.address);

		user = await whitelist.getUser(user1.address);

		expect(user.status).to.equal(Const.USER_NEW);
		expect(user.createdDt).to.above(0);
	});

	it('revert calling addUser() when user1 is already added', async () => {
		await expectRevert(
			whitelist.addUser(user1.address),
			"already added"
		);
	});

	it('revert calling setUserStatus() when caller is not owner', async () => {
		await expectRevert(
			whitelist.connect(user1).setUserStatus(user1.address, Const.USER_VALID),
			"Ownable: caller is not the owner"
		);
	});

	it('revert calling setUserStatus() when user is not existed', async () => {
		await expectRevert(
			whitelist.setUserStatus(user2.address, Const.USER_VALID),
			"not exist"
		);
	});

	it('set user status correctly', async () => {
		await whitelist.setUserStatus(user1.address, Const.USER_VALID);

		user = await whitelist.getUser(user1.address);
		expect(user.status).to.equal(Const.USER_VALID);
	});
});
