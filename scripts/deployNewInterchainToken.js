// Axelar chains config
// https://github.com/axelarnetwork/axelar-contract-deployments/blob/main/axelar-chains-config/info/testnet.json
// Deploy a New Interchain Token
// Use this command to run this file: npx hardhat run scripts/deployNewInterchainToken.js --network linea_goerli

const hre = require("hardhat");
const crypto = require("crypto");

const interchainTokenServiceContractABI = require("../utils/its/interchainTokenServiceABI");
const interchainTokenFactoryContractABI = require("../utils/its/interchainTokenFactoryABI");
const interchainTokenContractABI = require("../utils/its/interchainTokenABI");

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

// Initialize salt
const salt = "0x" + crypto.randomBytes(32).toString("hex");

// Register and Deploy : Linea
async function registerAndDeploy() {
  const [owner] = await ethers.getSigners();

  const interchainTokenFactoryContract = new ethers.Contract(
    interchainTokenFactoryContractAddress,
    interchainTokenFactoryContractABI,
    owner
  );

  const interchainTokenServiceContract = new ethers.Contract(
    interchainTokenServiceContractAddress,
    interchainTokenServiceContractABI,
    owner
  );

  console.log("salt: ", salt);
  console.log("owner.address: ", owner.address);

  const tokenId = await interchainTokenFactoryContract.interchainTokenId(
    owner.address,
    salt
  );

  console.log("tokenId: ", tokenId);

  const tokenAddress =
    await interchainTokenServiceContract.interchainTokenAddress(tokenId);

  console.log("tokenAddress: ", tokenAddress);

  const txn = await interchainTokenFactoryContract.deployInterchainToken(
    salt,
    "TTToken10",
    "TTT10",
    18,
    ethers.utils.parseEther("1000"),
    owner.address
  );

  console.log("txn: ", txn);

  // Uncomment to listen to different event during deployment
  // const params = ethers.utils.defaultAbiCoder.encode(
  //   ["bytes", "address"],
  //   [interchainTokenFactoryContractAddress, tokenAddress]
  // );

  // const payload = ethers.utils.defaultAbiCoder.encode(
  //   ["uint256", "bytes32", "string", "string", "uint8", "bytes"],
  //   [
  //     MESSAGE_TYPE_DEPLOY_INTERCHAIN_TOKEN,
  //     tokenId,
  //     "TTToken",
  //     "TTT",
  //     18,
  //     owner.address,
  //   ]
  // );
  const expectedTokenManagerAddress =
    await interchainTokenServiceContract.tokenManagerAddress(tokenId);
  const expectedTokenAddress =
    await interchainTokenServiceContract.interchainTokenAddress(tokenId);

  console.log("expectedTokenManagerAddress: ", expectedTokenManagerAddress);
  console.log("expectedTokenAddress: ", expectedTokenAddress);

  // salt:  0x51d4c05a8fc0c14f63b784f3fc5b1e6b5dcb1287b224956b84ac7aa75ee547e7
  // owner.address:  0x510e5EA32386B7C48C4DEEAC80e86859b5e2416C
  // tokenId:  0xa8aad73c2db5632d6292d6ea712e961a82b02d9fe2ddd032b972353741c060b5
  // tokenAddress:  0x2874FfE68D1d230e5a44ca21D30DE28b9b5b648E
  // txn_hash: '0x531fa49d101f90c1a4883d0d781aa18ffd68933fe3076d26c1c627084102b80b',
  // expectedTokenManagerAddress:  0x7415247598589D7CdE8F6F57cb71055bc2aeA771
  // expectedTokenAddress:  0x2874FfE68D1d230e5a44ca21D30DE28b9b5b648E
}

// Deploy to remote chain: Polygon
async function deployToRemoteChain() {
  const [owner] = await ethers.getSigners();

  const interchainTokenFactoryContract = new ethers.Contract(
    interchainTokenFactoryContractAddress,
    interchainTokenFactoryContractABI,
    owner
  );

  const txn = await interchainTokenFactoryContract.deployRemoteInterchainToken(
    "linea",
    "0x51d4c05a8fc0c14f63b784f3fc5b1e6b5dcb1287b224956b84ac7aa75ee547e7", // salt
    owner.address,
    "Polygon",
    ethers.utils.parseEther("0.2"),

    { value: ethers.utils.parseEther("0.2"), gasLimit: 3000000 }
  );

  console.log("txn: ", txn);

  // txn: 0x13d2667cb5391ac13ed96aa530675ac33ae595189c9e4ba75d82486e83b3857b
}

// Transfer tokens: Linea -> Polygon
async function transferTokens() {
  const [owner] = await ethers.getSigners();

  const interchainToken = new ethers.Contract(
    "0x2874FfE68D1d230e5a44ca21D30DE28b9b5b648E",
    interchainTokenContractABI,
    owner
  );

  const transfer = await interchainToken.interchainTransfer(
    "Polygon",
    "0x510e5EA32386B7C48C4DEEAC80e86859b5e2416C",
    ethers.utils.parseEther("5"),
    "0x",
    { value: ethers.utils.parseEther("0.2"), gasLimit: 3000000 }
  );

  console.log("transfer: ", transfer);

  //txn: 0xc34b402d84bdc32dd3884aca1868f53bd5fc87d98a9931ea682a8b54d693d980
}

// Uncomment the function you want to run below before deploying

async function run() {
  try {
    // await registerAndDeploy();
    // await deployToRemoteChain();
    // await transferTokens();
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}

run();
