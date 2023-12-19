// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
// const { ethers } = require("hardhat");
const crypto = require("crypto");
const contractABI = require("../utils/abi");
const tokenManagerABI = require("../utils/tokenManagerABI");

address1 = "0x1B38BCdD5fE232F7C9d04682b83F66C95f76424f";
address2 = "0x4dd520FF6d07512ad516bcAc755F8D4ac63Af5E5";

// Deploy the contract to the network - Polygon and Avalanche
async function main() {
  const NotTheCommonToken = await hre.ethers.getContractFactory(
    "NotTheCommonToken"
  );
  const notTheCommonToken = await NotTheCommonToken.deploy();

  await notTheCommonToken.deployed();

  console.log(
    `NotTheCommonToken contract deployed to ${notTheCommonToken.address}`
  );

  //Use this approach if you using the latest version of hardhat
  // const NotTheCommonToken = await hre.ethers.deployContract(
  //   "NotTheCommonToken"
  // );

  // await NotTheCommonToken.waitForDeployment();

  // console.log(
  //   `NotTheCommonToken contract deployed to ${await NotTheCommonToken.getAddress()}`
  // );
}

// Deploy Token Manager to the network
async function main() {
  const salt = "0x" + crypto.randomBytes(32).toString("hex");
  const tmType = 1;

  const [owner] = await ethers.getSigners();

  const params1 = ethers.utils.defaultAbiCoder.encode(
    ["bytes", "address"],
    [owner.address, address1]
  );

  const ITSContractAddress =
    "0xF786e21509A9D50a9aFD033B5940A2b7D872C208";

  const ITSContract = new ethers.Contract(
    ITSContractAddress,
    contractABI,
    owner
  );

  const tx = await ITSContract.deployCustomTokenManager(
    salt,
    tmType,
    params1
  );

  console.log("tx: ", tx.hash);
  const receipt = await tx.wait();

  const event = receipt.events.find((e) => e.event === "CustomTokenIdClaimed");

  const tokenId = event.args[0];
  console.log("tokenId: ", tokenId);

  const tokenManagerAddress = await ITSContract.getTokenManagerAddress(
    tokenId
  );
  console.log("tokenManagerAddress: ", tokenManagerAddress);

  //Now deploy the remote token manager on chain2
  const params2 = ethers.utils.defaultAbiCoder.encode(
    ["bytes", "address"],
    [owner.address, address2]
  );

  const tx2 = await ITSContract.deployRemoteCustomTokenManager(
    salt,
    "Polygon",
    tmType,
    params2,
    ethers.utils.parseEther("0.5")
  );

  console.log("tx2: ", tx2.hash);
}

// Give permissions on your tokens to the token manager
async function main() {
  const contractAddress = "0x4dd520FF6d07512ad516bcAc755F8D4ac63Af5E5";
  const Contract = await hre.ethers.getContractAt(
    "NotTheCommonToken",
    contractAddress
  );
  //Call Minter Role
  const tx = await Contract.MINTER_ROLE();
  console.log(tx);
  // Grant token manager the role of minter on your token
  const grantTokenManager = await Contract.grantRole(
   tx,
    "0xCB8ffE8B62A17CE2d9397c25Bf97e95bE8245059"
  );
  console.log(grantTokenManager);
  // Approve the token manager to spend your tokens
  const approveTokenManager = await Contract.approve(
    "0xCB8ffE8B62A17CE2d9397c25Bf97e95bE8245059",
    ethers.utils.parseEther("110")
  );
  console.log(approveTokenManager);
}

// Send token from Polygon to Avalanche using the token manager
async function main() {
  const [owner] = await ethers.getSigners();
  const ITSContractAddress =
    "0xCB8ffE8B62A17CE2d9397c25Bf97e95bE8245059";

  const ITSContract = new ethers.Contract(
    ITSContractAddress,
    tokenManagerABI,
    owner
  );

  const tx = await ITSContract.sendToken(
    "Polygon",
    "0x510e5EA32386B7C48C4DEEAC80e86859b5e2416C",
    ethers.utils.parseEther("1"),
    "0x000000",
    { value: ethers.utils.parseEther("0.2"), gasLimit: 3000000 }
  );

  console.log("tx: ", tx.hash);
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// New one
// tx:  0x805c01157027a6f4dfd7464afa1ad142a009c06b412fefad4a03ce7baa241f90
// tokenId:  0xeeaa6eed29a38354d8a899857770948a5639aad8e7875d8e520055b4974a4a7c
// tokenManagerAddress:  0xCB8ffE8B62A17CE2d9397c25Bf97e95bE8245059
// tx2:  0x15d8d1339053688e3f3de3039dfa0051445ba455a5103344ea30566b30e733d9
// interchain 0x54e40607a12daf71d6eef8c37741be3bf750bf4990c980ba93f2d6933dab5240
// interchain 0x236c7b544ea99c422c5c586b80bb15ac62f44b3a4612dc2cb8d171e68e0522b3

// First try but ran into an error on destination chain
// tx:  0x07d0d05ec339393f1a23f0120f49dd20e5d4070f7907a388408e5d4594b5c3c1
// tokenId:  0xb23a009e1d5a9451c206f28b4fa69ed8d14b9041f2655a53875ef92c5a7d23b3
// tokenManagerAddress:  0x2c5147757C5ba52BF965EF8f93134E98Cc452c35
// tx2:  0x33f1517dbf2f2d56ea50126dd0a9d7f413d41d555806abc64b2de572ec2c9641
// Deployed to:
// Polygon 0x7eBF876f04064A88ba67F4ba60E6eCE0BCCBc88E
// Avalanche 0x193905A70481165CF1A832f56912f21e0b708455

// Grant Minter Role to Token Manager
//Polygon 0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6
//Avalanche 0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6

// Interchain txn 0xf708b6be9f0b47a447bda2afb6430ffe323ef54805952b22518c8e2f5f716d5b
// https://testnet.axelarscan.io/gmp/0xf708b6be9f0b47a447bda2afb6430ffe323ef54805952b22518c8e2f5f716d5b
