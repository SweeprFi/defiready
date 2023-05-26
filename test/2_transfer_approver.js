const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require('@openzeppelin/test-helpers');
const { toBN, Const } = require("../utils/helper_functions");

contract("TransferApprover", async function () {
	before(async () => {
		[owner, user1, user2, user3, user4, lzEndpoint] = await ethers.getSigners();

		TRANSFER_AMOUNT = toBN("1000", 18);
		TIME_DELAY = 600;

		// ------------- Deployment of contracts -------------
		DefireadyCoin = await ethers.getContractFactory("DefireadyCoin");
		defireadyCoin = await DefireadyCoin.deploy();

		await defireadyCoin.mint(user1.address, TRANSFER_AMOUNT.mul(3))

		Whitelist = await ethers.getContractFactory("Whitelist");
		whitelist = await Whitelist.deploy();

		await whitelist.addUser(user1.address);

		TransferApprover = await ethers.getContractFactory("TransferApprover");
		transferApprover = await TransferApprover.deploy(whitelist.address);

		await defireadyCoin.setTransferApprover(transferApprover.address);
	});

	it('reverts all transfers between non-valid users when validation method is ONLY_VALID', async () => {
		// check validation method is ONLY_VALID
		expect(await transferApprover.validation_method()).to.equal(Const.ONLY_VALID);

		/*--- check if tranfer between new-user and invalid-user is reverted ---*/
		expect((await whitelist.getUser(user1.address)).status).to.equal(Const.USER_NEW);
		expect((await whitelist.getUser(user2.address)).status).to.equal(Const.USER_INVALID);

		await expect(defireadyCoin.connect(user1).transfer(user2.address, TRANSFER_AMOUNT))
				.to.be.revertedWithCustomError(DefireadyCoin, 'TransferNotAllowed');

		/*--- check if tranfer between valid-user and invalid-user is reverted ---*/
		await whitelist.setUserStatus(user1.address, Const.USER_VALID);

		expect((await whitelist.getUser(user1.address)).status).to.equal(Const.USER_VALID);
		expect((await whitelist.getUser(user2.address)).status).to.equal(Const.USER_INVALID);

		await expect(defireadyCoin.connect(user1).transfer(user2.address, TRANSFER_AMOUNT))
				.to.be.revertedWithCustomError(DefireadyCoin, 'TransferNotAllowed');

		/*--- check if tranfer between valid-user and new-user is reverted ---*/
		await whitelist.setUserStatus(user1.address, Const.USER_VALID);
		await whitelist.addUser(user2.address);

		expect((await whitelist.getUser(user1.address)).status).to.equal(Const.USER_VALID);
		expect((await whitelist.getUser(user2.address)).status).to.equal(Const.USER_NEW);

		await expect(defireadyCoin.connect(user1).transfer(user2.address, TRANSFER_AMOUNT))
				.to.be.revertedWithCustomError(DefireadyCoin, 'TransferNotAllowed');
	});

	it('Transfer DFRTEST correctly between valid users when validation method is ONLY_VALID', async () => {
		// check validation method is ONLY_VALID
		expect(await transferApprover.validation_method()).to.equal(Const.ONLY_VALID);

		/*--- check if tranfer between valid-user users is ok ---*/
		await whitelist.setUserStatus(user2.address, Const.USER_VALID);

		expect((await whitelist.getUser(user1.address)).status).to.equal(Const.USER_VALID);
		expect((await whitelist.getUser(user2.address)).status).to.equal(Const.USER_VALID);

		expect(await transferApprover.isValid(user1.address)).to.equal(Const.TRUE);
		expect(await transferApprover.isValid(user2.address)).to.equal(Const.TRUE);

		expect(await defireadyCoin.balanceOf(user2.address)).to.equal(Const.ZERO);

		await defireadyCoin.connect(user1).transfer(user2.address, TRANSFER_AMOUNT)

		expect(await defireadyCoin.balanceOf(user2.address)).to.equal(TRANSFER_AMOUNT);
	});

	it('reverts transfers when validation method is VALID_OR_NEW', async () => {
		// Set validation method to VALID_OR_NEW
		await transferApprover.setValidationType(Const.VALID_OR_NEW)

		// check validation method is VALID_OR_NEW
		expect(await transferApprover.validation_method()).to.equal(Const.VALID_OR_NEW);

		/*--- check if tranfer between valid-user and invalid-user is reverted ---*/
		expect((await whitelist.getUser(user2.address)).status).to.equal(Const.USER_VALID);
		expect((await whitelist.getUser(user3.address)).status).to.equal(Const.USER_INVALID);

		await expect(defireadyCoin.connect(user2).transfer(user3.address, TRANSFER_AMOUNT))
			.to.be.revertedWithCustomError(DefireadyCoin, 'TransferNotAllowed');

		/*--- revert tranfer between valid-user and new-user when time_delay is 0 ---*/
		expect(await transferApprover.time_delay()).to.equal(Const.ZERO);

		await whitelist.addUser(user3.address);

		expect((await whitelist.getUser(user2.address)).status).to.equal(Const.USER_VALID);
		expect((await whitelist.getUser(user3.address)).status).to.equal(Const.USER_NEW);

		await expect(defireadyCoin.connect(user2).transfer(user3.address, TRANSFER_AMOUNT))
			.to.be.revertedWithCustomError(DefireadyCoin, 'TransferNotAllowed');

		
		/*--- revert tranfer between valid-user and new-user when block.timestamp - created_at < time_delay ---*/
		// set time delay to 600 (10 minutes)
		await transferApprover.setTimeDelay(TIME_DELAY);
		expect(await transferApprover.time_delay()).to.equal(TIME_DELAY);

		await time.increase(parseInt(300));
		await time.advanceBlock();

		expect((await whitelist.getUser(user2.address)).status).to.equal(Const.USER_VALID);
		expect((await whitelist.getUser(user3.address)).status).to.equal(Const.USER_NEW);

		// reverted transfer, because current_time - create_at < time_delay
		await expect(defireadyCoin.connect(user2).transfer(user3.address, TRANSFER_AMOUNT))
			.to.be.revertedWithCustomError(DefireadyCoin, 'TransferNotAllowed');

		/*--- revert tranfer between new-user and invalid-user ---*/
		await time.increase(parseInt(400));
		await time.advanceBlock();
	
		expect(await transferApprover.isValid(user3.address)).to.equal(Const.TRUE);

		expect((await whitelist.getUser(user3.address)).status).to.equal(Const.USER_NEW);
		expect((await whitelist.getUser(user4.address)).status).to.equal(Const.USER_INVALID);

		await expect(defireadyCoin.connect(user3).transfer(user4.address, TRANSFER_AMOUNT))
			.to.be.revertedWithCustomError(DefireadyCoin, 'TransferNotAllowed');

	});

	it('Transfer DFRTEST correctly when validation method is ONLY_VALID', async () => {
		// check validation method is ONLY_VALID
		expect(await transferApprover.validation_method()).to.equal(Const.VALID_OR_NEW);

		/*--- tranfer correctly between valid-user and new-user when current_time - create_at > time_delay ---*/
		expect((await whitelist.getUser(user2.address)).status).to.equal(Const.USER_VALID);
		expect((await whitelist.getUser(user3.address)).status).to.equal(Const.USER_NEW);

		expect(await transferApprover.isValid(user2.address)).to.equal(Const.TRUE);
		expect(await transferApprover.isValid(user3.address)).to.equal(Const.TRUE);

		expect(await defireadyCoin.balanceOf(user3.address)).to.equal(Const.ZERO);

		await defireadyCoin.connect(user2).transfer(user3.address, TRANSFER_AMOUNT)

		expect(await defireadyCoin.balanceOf(user3.address)).to.equal(TRANSFER_AMOUNT);

		/*--- revert tranfer between new-user and new-user when current_time - create_at < time_delay ---*/
		await whitelist.addUser(user4.address);

		expect(await transferApprover.isValid(user3.address)).to.equal(Const.TRUE);
		expect(await transferApprover.isValid(user4.address)).to.equal(Const.FALSE);

		await expect(defireadyCoin.connect(user3).transfer(user4.address, TRANSFER_AMOUNT))
			.to.be.revertedWithCustomError(DefireadyCoin, 'TransferNotAllowed');
		
		/*--- tranfer correctly between new-user and new-user when current_time - create_at > time_delay ---*/
		await time.increase(parseInt(700));
		await time.advanceBlock();

		expect((await whitelist.getUser(user3.address)).status).to.equal(Const.USER_NEW);
		expect((await whitelist.getUser(user4.address)).status).to.equal(Const.USER_NEW);

		expect(await transferApprover.isValid(user3.address)).to.equal(Const.TRUE);
		expect(await transferApprover.isValid(user4.address)).to.equal(Const.TRUE);

		expect(await defireadyCoin.balanceOf(user4.address)).to.equal(Const.ZERO);

		await defireadyCoin.connect(user3).transfer(user4.address, TRANSFER_AMOUNT)

		expect(await defireadyCoin.balanceOf(user4.address)).to.equal(TRANSFER_AMOUNT);
	});

	it('revert transfers when owner sets user to INVALID', async () => {
		expect((await whitelist.getUser(user1.address)).status).to.equal(Const.USER_VALID);

		await whitelist.setUserStatus(user1.address, Const.USER_INVALID);

		expect((await whitelist.getUser(user1.address)).status).to.equal(Const.USER_INVALID);

		expect(await transferApprover.isValid(user1.address)).to.equal(Const.FALSE);
		expect(await transferApprover.isValid(user4.address)).to.equal(Const.TRUE);

		await expect(defireadyCoin.connect(user4).transfer(user1.address, TRANSFER_AMOUNT))
			.to.be.revertedWithCustomError(DefireadyCoin, 'TransferNotAllowed');
	});
});
