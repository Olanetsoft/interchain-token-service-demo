require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

const PRIVATE_KEY = process.env.PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    mumbai: {
      url: "https://rpc.ankr.com/polygon_mumbai",
      chainId: 80001,
      accounts: [PRIVATE_KEY],
    },
    avalanche: {
      url: "https://avalanche-fuji-c-chain.publicnode.com",
      chainId: 43113,
      accounts: [PRIVATE_KEY],
    },
    bsc: {
      url: "https://bnbsmartchain-testnet.infura.io/v3/70349dbebf0848d0a38b46a00e6269ac",
      chainId: 97,
      accounts: [PRIVATE_KEY],
    },
    goerli: {
      url: "https://rpc.ankr.com/eth_goerli",
      chainId: 5,
      accounts: [PRIVATE_KEY],
    },
    base: {
      url: "https://base-goerli.publicnode.com",
      chainId: 84531,
      accounts: [PRIVATE_KEY],
    },
    fantom: {
      url: "https://fantom.api.onfinality.io/public",
      chainId: 250,
      accounts: [PRIVATE_KEY],
    },
    linea_goerli: {
      url: "https://linea-goerli.infura.io/v3/70349dbebf0848d0a38b46a00e6269ac",
      chainId: 59140,
      accounts: [PRIVATE_KEY],
    },
  },
};
