const { expect } = require("chai");
const { ethers } = require("hardhat");
const { expectRevert } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = require("@openzeppelin/test-helpers/src/constants");

contract("DefireadyNFT", async function () {
	before(async () => {
		[owner, minter, user, guest] = await ethers.getSigners();
		tokenURI = 'https://opensea.io/';
		
		// ------------- Deployment of contracts -------------
		DefireadyNFT = await ethers.getContractFactory("DefireadyNFT");
		defireadyNFT = await DefireadyNFT.connect(owner).deploy();
	});

	it('Add a minter', async () => {
		// Check owner
		await expectRevert(
			defireadyNFT.connect(guest).addMinter(minter.address),
			"Ownable: caller is not the owner"
		);

		// Add minter into the minter list
		expect(await defireadyNFT.isMinter(minter.address)).to.equal(false);
		await defireadyNFT.connect(owner).addMinter(minter.address);
		expect(await defireadyNFT.isMinter(minter.address)).to.equal(true);
	});

	it('Mint NFT', async () => {
		// Check minter
		await expectRevert(
			defireadyNFT.connect(guest).mint(user.address, tokenURI),
			"Invalid Minter"
		);

		// Mint NFT
		await defireadyNFT.connect(minter).mint(user.address, tokenURI);
		expect(await defireadyNFT.ownerOf(0)).to.equal(user.address);
		tokenInfo__0 = await defireadyNFT.credentials(0);
		expect(tokenInfo__0.qualifier).to.equal(minter.address);
		expect(tokenInfo__0.isValid).to.equal(true);
		expect(tokenInfo__0.time).to.be.above(0);
		expect(tokenInfo__0.buyerType).to.equal(0);
		expect(await defireadyNFT.tokenURI(0)).to.equal(tokenURI);
	});

	it('Check transferable', async () => {
		await defireadyNFT.connect(user).approve(guest.address, 0);
		await expectRevert(
			defireadyNFT.connect(user).transferFrom(user.address, guest.address, 0),
			"Token not transferable"
		);
	});

	it('Update NFT', async () => {
		// Check token exist
		await expectRevert(
			defireadyNFT.connect(owner).update(1, false, 1),
			"Non-exist"
		);

		// Update NFT
		tokenInfo__0 = await defireadyNFT.credentials(0);
		expect(tokenInfo__0.isValid).to.equal(true);
		expect(tokenInfo__0.buyerType).to.equal(0);

		await defireadyNFT.connect(minter).update(0, false, 1);

		tokenInfo__0 = await defireadyNFT.credentials(0);
		expect(tokenInfo__0.isValid).to.equal(false);
		expect(tokenInfo__0.buyerType).to.equal(1);
	});

	it('Burn NFT', async () => {
		// Check token exist
		await expectRevert(
			defireadyNFT.connect(owner).burn(1),
			"Non-exist"
		);

		// Burn NFT
		await defireadyNFT.connect(minter).burn(0);
		tokenInfo__0 = await defireadyNFT.credentials(0);
		expect(tokenInfo__0.qualifier).to.equal(ZERO_ADDRESS);
		expect(await defireadyNFT.balanceOf(minter.address)).to.equal(0);
	});

	it('Remove a minter', async () => {
		// Check owner
		await expectRevert(
			defireadyNFT.connect(guest).removeMinter(minter.address),
			"Ownable: caller is not the owner"
		);

		// Remove non-exist user from the minter list.
		expect(await defireadyNFT.isMinter(guest.address)).to.equal(false);
		await defireadyNFT.connect(owner).removeMinter(guest.address);
		expect(await defireadyNFT.isMinter(guest.address)).to.equal(false);

		// Remove existing user from the minter list.
		expect(await defireadyNFT.isMinter(minter.address)).to.equal(true);
		await defireadyNFT.connect(owner).removeMinter(minter.address);
		expect(await defireadyNFT.isMinter(minter.address)).to.equal(false);
	});

});
