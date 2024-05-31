// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers, upgrades } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const owner = (await ethers.getSigner(0)).address;
  console.log("Deploying MGC with the account:", owner);

  const MGC = await ethers.getContractFactory("MGC");

  const mgc = await MGC.deploy(owner);
  await mgc.deployed();

  console.log("GiftCard deployed to:", mgc.address);

  // Write the contract address to .env in react-app and if it doesn't exist, create it
  const envPath = path.resolve(__dirname, "../../react-app/.env");
  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, `NEXT_PUBLIC_GIFT_CARD_ADDRESS=${mgc.address}`);
  } else {
    fs.appendFileSync(
      envPath,
      `\nNEXT_PUBLIC_GIFT_CARD_ADDRESS=${mgc.address}`
    );
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
