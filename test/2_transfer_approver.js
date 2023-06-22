const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require('@openzeppelin/test-helpers');
const { toBN, Const } = require("../utils/helper");

contract("TransferApprover", async function () {
	before(async () => {
		[owner, user1, user2, user3, user4, lzEndpoint] = await ethers.getSigners();

		TRANSFER_AMOUNT = toBN("1000", 18);
		TIME_DELAY = 600;

		// ------------- Deployment of contracts -------------
		DefireadyCoin = await ethers.getContractFactory("DefireadyCoin");
		defireadyCoin = await DefireadyCoin.deploy();

		Whitelist = await ethers.getContractFactory("Whitelist");
		whitelist = await Whitelist.connect(owner).deploy();

		TransferApprover = await ethers.getContractFactory("TransferApprover");
		transferApprover = await TransferApprover.deploy(whitelist.address);

		await defireadyCoin.setTransferApprover(transferApprover.address);

		// Initial setting.
		await defireadyCoin.mint(user1.address, TRANSFER_AMOUNT.mul(3))
		await defireadyCoin.mint(user2.address, TRANSFER_AMOUNT.mul(3))
		await defireadyCoin.mint(user3.address, TRANSFER_AMOUNT.mul(3))
	});

	it('Add users into the whilteList', async () => {
		// Anyone can add user into the whitelist.
		await whitelist.addUser(user1.address);
		await whitelist.connect(user1).addUser(user2.address);
		await whitelist.connect(user2).addUser(user3.address);

		expect((await whitelist.getUser(user1.address)).status).to.equal(Const.USER_NEW);
		expect((await whitelist.getUser(user2.address)).status).to.equal(Const.USER_NEW);
		expect((await whitelist.getUser(user3.address)).status).to.equal(Const.USER_NEW);
	});

	it('Set Valid users by admin', async () => {
		// Only owner change user status.
		await expect(whitelist.connect(user2).setUserStatus(user1.address, Const.USER_VALID))
			.to.be.revertedWith('Ownable: caller is not the owner');

		// Check user validation
		await expect(whitelist.connect(owner).setUserStatus(user4.address, Const.USER_VALID))
			.to.be.revertedWith('not exist');

		// Set valid users
		await whitelist.connect(owner).setUserStatus(user1.address, Const.USER_VALID);
		expect((await whitelist.getUser(user1.address)).status).to.equal(Const.USER_VALID);
		
		await whitelist.connect(owner).setUserStatus(user2.address, Const.USER_VALID);
		expect((await whitelist.getUser(user2.address)).status).to.equal(Const.USER_VALID);
	});

	it('Transfer allowed only for VALID users.', async () => {
		// Check validation status.
		expect(await transferApprover.validation_method()).to.equal(Const.ONLY_VALID);

		// Transfer from VALID User to New User.
		await expect(defireadyCoin.connect(user1).transfer(user3.address, TRANSFER_AMOUNT))
				.to.be.revertedWithCustomError(DefireadyCoin, 'TransferNotAllowed');
				
		// Transfer from VALID User to Non-WhiteList User.
		await expect(defireadyCoin.connect(user1).transfer(user4.address, TRANSFER_AMOUNT))
			.to.be.revertedWithCustomError(DefireadyCoin, 'TransferNotAllowed');
			
		// Transfer from VALID User to VALID User.
		user1_balance = await defireadyCoin.balanceOf(user1.address);
		user2_balance = await defireadyCoin.balanceOf(user2.address);
		await defireadyCoin.connect(user1).transfer(user2.address, TRANSFER_AMOUNT);
		expect(await defireadyCoin.balanceOf(user1.address)).to.equal(user1_balance.sub(TRANSFER_AMOUNT));
		expect(await defireadyCoin.balanceOf(user2.address)).to.equal(user2_balance.add(TRANSFER_AMOUNT));
	});
	
	it('Transfer allowed for NEW users with no TimeDelay.', async () => {
		// Check validation status.
		await transferApprover.setValidationType(Const.VALID_OR_NEW);
		expect(await transferApprover.validation_method()).to.equal(Const.VALID_OR_NEW);
				
		// Transfer from New User to Non-WhiteList User.
		await expect(defireadyCoin.connect(user3).transfer(user4.address, TRANSFER_AMOUNT))
			.to.be.revertedWithCustomError(DefireadyCoin, 'TransferNotAllowed');
		
		// Transfer from VALID User to New User.
		user1_balance = await defireadyCoin.balanceOf(user1.address);
		user3_balance = await defireadyCoin.balanceOf(user3.address);
		await defireadyCoin.connect(user1).transfer(user3.address, TRANSFER_AMOUNT);
		expect(await defireadyCoin.balanceOf(user1.address)).to.equal(user1_balance.sub(TRANSFER_AMOUNT));
		expect(await defireadyCoin.balanceOf(user3.address)).to.equal(user3_balance.add(TRANSFER_AMOUNT));
	});

	it('Transfer allowed for NEW users with TimeDelay.', async () => {
		// Check TimeDelay.
		expect(await transferApprover.time_delay()).to.equal(Const.ZERO);
		await transferApprover.setTimeDelay(TIME_DELAY);
		expect(await transferApprover.time_delay()).to.equal(TIME_DELAY);

		// Transfer from VALID User to New User.
		await expect(defireadyCoin.connect(user1).transfer(user3.address, TRANSFER_AMOUNT))
			.to.be.revertedWithCustomError(DefireadyCoin, 'TransferNotAllowed');
		
		// Delay 70 mins
		await time.increase(parseInt(700));
		await time.advanceBlock();

		// Transfer from VALID User to New User.
		user1_balance = await defireadyCoin.balanceOf(user1.address);
		user3_balance = await defireadyCoin.balanceOf(user3.address);
		await defireadyCoin.connect(user1).transfer(user3.address, TRANSFER_AMOUNT);
		expect(await defireadyCoin.balanceOf(user1.address)).to.equal(user1_balance.sub(TRANSFER_AMOUNT));
		expect(await defireadyCoin.balanceOf(user3.address)).to.equal(user3_balance.add(TRANSFER_AMOUNT));
	});

	it('Check transferable with Invalid User.', async () => {
		// Set user2 as Invalid
		await whitelist.connect(owner).setUserStatus(user2.address, Const.USER_INVALID);
		expect((await whitelist.getUser(user2.address)).status).to.equal(Const.USER_INVALID);
		
		// Transfer from VALID User to Invalid User.
		await expect(defireadyCoin.connect(user1).transfer(user2.address, TRANSFER_AMOUNT))
			.to.be.revertedWithCustomError(DefireadyCoin, 'TransferNotAllowed');
				
		// Transfer from New User to Invalid User.
		await expect(defireadyCoin.connect(user3).transfer(user2.address, TRANSFER_AMOUNT))
			.to.be.revertedWithCustomError(DefireadyCoin, 'TransferNotAllowed');
	});
});
