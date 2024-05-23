// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers, upgrades } = require("hardhat");

async function main() {
  const owner = (await ethers.getSigner(0)).address;
  console.log("Deploying GiftCard with the account:", owner);

  const GiftCard = await ethers.getContractFactory("GiftCard");

  const gnftCard = await GiftCard.deploy(owner);
  await gnftCard.deployed();

  console.log("GiftCard deployed to:", gnftCard.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
