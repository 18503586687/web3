const { d } = require("./tasks");

require("@nomicfoundation/hardhat-toolbox");
require("@chainlink/env-enc").config();
require("./tasks");
require("hardhat-deploy");
require("hardhat-deploy-ethers");

const SEPOLIA_URL = process.env.SEPOLIA_URL;
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY;
const SEPOLIA_PRIVATE_KEY_1 = process.env.SEPOLIA_PRIVATE_KEY_1;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  defaultNetwork: "hardhat",
  mocha: {
    timeout: 300000,
  },
  networks: {
    sepolia: {
      url: SEPOLIA_URL,
      accounts: [SEPOLIA_PRIVATE_KEY, SEPOLIA_PRIVATE_KEY_1],
      chainId: 11155111,
    },
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY,
    },
  },
  sourcify: {
    enabled: true,
  },
  namedAccounts: {
    firstAccount: {
      default: 0, // here 0 means the first account in the list of accounts
    },
    secondAccount: {
      default: 1, // here 1 means the second account in the list of accounts
    },
  },
  gasReporter: {
    enabled: false,
  },
};
