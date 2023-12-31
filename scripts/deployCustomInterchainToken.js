// Axelar chains config
// https://github.com/axelarnetwork/axelar-contract-deployments/blob/main/axelar-chains-config/info/testnet.json
// Deploy Custom Token
// Use this command to run this file: npx hardhat run scripts/deployCustomInterchainToken.js --network fantom

const hre = require("hardhat");
const crypto = require("crypto");

const interchainTokenServiceContractABI = require("../utils/its/interchainTokenServiceABI");
const interchainTokenFactoryContractABI = require("../utils/its/interchainTokenFactoryABI");
const tokenManagerContractABI = require("../utils/its/tokenManagerABI");
const TestMintableBurnableERC20ContractABI = require("../utils/token/TestMintableBurnableERC20ABI");

const MESSAGE_TYPE_INTERCHAIN_TRANSFER = 0;
const MESSAGE_TYPE_DEPLOY_INTERCHAIN_TOKEN = 1;
const MESSAGE_TYPE_DEPLOY_TOKEN_MANAGER = 2;

const MINT_BURN = 0;
const LOCK_UNLOCK = 2;

// Addresses on mainnet/testnet
const interchainTokenServiceContractAddress =
  "0xB5FB4BE02232B1bBA4dC8f81dc24C26980dE9e3C";
const interchainTokenFactoryContractAddress =
  "0x83a93500d23Fbc3e82B410aD07A6a9F7A0670D66";
const tokenManagerAddress = "0xC1B09c9c16117417A1B414A52Dd92CF1f634e786";
const fantomCustomTokenAddress = "0x4B641fEa8Ab2Df6fe004BbA56Ba7bd93a9Fd9a31";
const polygonCustomTokenAddress = "0x5745049a77105dDFA6862c91259c5978075FF743";

// Initialize salt
const salt = "0x" + crypto.randomBytes(32).toString("hex");

// deploy TM on local chain : Fantom
async function deployLocalTokenManager() {
  const [owner] = await ethers.getSigners();

  const interchainTokenServiceContract = new ethers.Contract(
    interchainTokenServiceContractAddress,
    interchainTokenServiceContractABI,
    owner
  );

  const tokenManagerContract = new ethers.Contract(
    tokenManagerAddress,
    tokenManagerContractABI,
    owner
  );

  console.log("owner.address: ", owner.address);
  console.log("salt: ", salt);

  const params = await tokenManagerContract.params(
    owner.address,
    fantomCustomTokenAddress
  );

  console.log("params: ", params);

  const txn = await interchainTokenServiceContract.deployTokenManager(
    salt,
    "",
    MINT_BURN,
    params,
    ethers.utils.parseEther("0.01")
  );

  console.log("txn: ", txn);

  const tokenId = await interchainTokenServiceContract.interchainTokenId(
    owner.address,
    salt
  );

  console.log("tokenId: ", tokenId);

  const expectedTokenManagerAddress =
    await interchainTokenServiceContract.tokenManagerAddress(tokenId);

  console.log("expectedTokenManagerAddress: ", expectedTokenManagerAddress);

  //   owner.address:  0x510e5EA32386B7C48C4DEEAC80e86859b5e2416C
  // salt:  0x0e96f59b94934221b83ed8e8e1d186deadbcf3045f1f5626cb848a52bd467ead
  // params:  0x00000000000000000000000000000000000000000000000000000000000000400000000000000000000000004b641fea8ab2df6fe004bba56ba7bd93a9fd9a310000000000000000000000000000000000000000000000000000000000000014510e5ea32386b7c48c4deeac80e86859b5e2416c000000000000000000000000
  // txn_hash: '0xe43b8b41bd426200e12cc515c5af1cfe74b32c05865ed2001f6e613da6f546d1',
  // tokenId:  0x580a9fca93f542fc1d5682923b2d0dab5742c6ce2b628978e06df21fa7810384
  // expectedTokenManagerAddress:  0x0C6ae38B51F6b972D904e5c2633B9aA2ce23b88E
}

// Deploy TM to remote chain: Avalanche
async function deployRemoteTokenManager() {
  const [owner] = await ethers.getSigners();

  const interchainTokenServiceContract = new ethers.Contract(
    interchainTokenServiceContractAddress,
    interchainTokenServiceContractABI,
    owner
  );

  const tokenManagerContract = new ethers.Contract(
    tokenManagerAddress,
    tokenManagerContractABI,
    owner
  );

  console.log("owner.address: ", owner.address);

  const params = await tokenManagerContract.params(
    owner.address,
    polygonCustomTokenAddress
  );

  console.log("params: ", params);

  const txn = await interchainTokenServiceContract.deployTokenManager(
    "0x0e96f59b94934221b83ed8e8e1d186deadbcf3045f1f5626cb848a52bd467ead", // salt
    "Polygon",
    MINT_BURN,
    params,
    ethers.utils.parseEther("0.01"),
    { value: ethers.utils.parseEther("0.02"), gasLimit: 3000000 }
  );

  console.log("txn: ", txn);

  const tokenId = await interchainTokenServiceContract.interchainTokenId(
    owner.address,
    "0x0e96f59b94934221b83ed8e8e1d186deadbcf3045f1f5626cb848a52bd467ead" // salt
  );

  console.log("tokenId: ", tokenId);

  const expectedTokenManagerAddress =
    await interchainTokenServiceContract.tokenManagerAddress(tokenId);

  console.log("expectedTokenManagerAddress: ", expectedTokenManagerAddress);

  //   owner.address:  0x510e5EA32386B7C48C4DEEAC80e86859b5e2416C
  // params:  0x00000000000000000000000000000000000000000000000000000000000000400000000000000000000000005745049a77105ddfa6862c91259c5978075ff7430000000000000000000000000000000000000000000000000000000000000014510e5ea32386b7c48c4deeac80e86859b5e2416c000000000000000000000000
  // txn_hash: '0x18cc0a9f4f4694831f265fca2cb98f07fe4577174d389d3fc3888c09c0e25a37',
  // tokenId:  0x580a9fca93f542fc1d5682923b2d0dab5742c6ce2b628978e06df21fa7810384
  // expectedTokenManagerAddress:  0x0C6ae38B51F6b972D904e5c2633B9aA2ce23b88E
}

// Transfer Mintership on all chains to ITS : Fantom
async function transferMintershipToITSOnFantom() {
  const [owner] = await ethers.getSigners();

  const TestMintableBurnableERC20Contract = new ethers.Contract(
    fantomCustomTokenAddress,
    TestMintableBurnableERC20ContractABI,
    owner
  );

  // Transfer mintership to ITS
  const txn = await TestMintableBurnableERC20Contract.transferMintership(
    interchainTokenServiceContractAddress
  );

  console.log("Txn:  ", txn);
  // 0xf72346a560d5ebaf3d66190852d13d35f5d09bf990018746b96d936f76336830
}

// Transfer Mintership on all chains to ITS : Polygon
async function transferMintershipToITSOnPolygon() {
  const [owner] = await ethers.getSigners();

  const TestMintableBurnableERC20Contract = new ethers.Contract(
    polygonCustomTokenAddress,
    TestMintableBurnableERC20ContractABI,
    owner
  );

  // Transfer mintership to ITS
  const txn = await TestMintableBurnableERC20Contract.transferMintership(
    interchainTokenServiceContractAddress
  );

  console.log("Txn:  ", txn);
  // 0x3646c73db38dcf28e3337ebf3da7624994f4bf4ff4df3f02883fd52083318a65
}

// Transfer tokens : Fantom -> Polygon
async function transferTokens() {
  const [owner] = await ethers.getSigners();

  const interchainTokenServiceContract = new ethers.Contract(
    interchainTokenServiceContractAddress,
    interchainTokenServiceContractABI,
    owner
  );

  const transfer = await interchainTokenServiceContract.interchainTransfer(
    "0x580a9fca93f542fc1d5682923b2d0dab5742c6ce2b628978e06df21fa7810384", // tokenId
    "Polygon", // destination chain
    "0x510e5EA32386B7C48C4DEEAC80e86859b5e2416C", // recipient
    ethers.utils.parseEther("8"), // amount
    "0x00", //metadata
    ethers.utils.parseEther("0.03"), // gasValue
    {
      // Transaction options should be passed here as an object
      value: ethers.utils.parseEther("0.1"), // Sending ether as the transaction value
      // gasLimit: 30000, // Specifying the gas limit
    }
  );

  console.log("transfer: ", transfer);

  // Interchain transfer transaction hash
  // txn_hash: 0xab0195715ad79ee624224a2653cd6eedd2fb19d24a706146e25bb42e16366153
}

// Uncomment the function you want to run below before deploying
async function run() {
  try {
    // await deployLocalTokenManager();
    // await deployRemoteTokenManager();
    // await transferMintershipToITSOnFantom();
    // await transferMintershipToITSOnPolygon()

    await transferTokens();
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}

run();
