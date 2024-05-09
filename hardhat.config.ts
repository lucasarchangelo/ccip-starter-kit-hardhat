import * as dotenvenc from '@chainlink/env-enc'
dotenvenc.config();

import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import "@nomicfoundation/hardhat-ignition-ethers";
import './tasks';

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHEREUM_SEPOLIA_RPC_URL = process.env.ETHEREUM_SEPOLIA_RPC_URL;
const POLYGON_MUMBAI_RPC_URL = process.env.POLYGON_MUMBAI_RPC_URL;
const OPTIMISM_GOERLI_RPC_URL = process.env.OPTIMISM_GOERLI_RPC_URL;
const ARBITRUM_SEPOLIA_RPC_URL = process.env.ARBITRUM_SEPOLIA_RPC_URL;
const AVALANCHE_FUJI_RPC_URL = process.env.AVALANCHE_FUJI_RPC_URL;
const BNB_CHAIN_TESTNET_RPC_URL = process.env.BNB_CHAIN_TESTNET_RPC_URL;
const BASE_GOERLI_RPC_URL = process.env.BASE_GOERLI_RPC_URL;

const ETHEREUM_ETHERSCAN_API_KEY = process.env.ETHEREUM_ETHERSCAN_API_KEY;
const POLYGON_ETHERSCAN_API_KEY = process.env.POLYGON_ETHERSCAN_API_KEY;
const OPTIMISM_ETHERSCAN_API_KEY = process.env.OPTIMISM_ETHERSCAN_API_KEY;
const ARBITRUM_ETHERSCAN_API_KEY = process.env.ARBITRUM_ETHERSCAN_API_KEY;
const AVALANCHE_ETHERSCAN_API_KEY = process.env.AVALANCHE_ETHERSCAN_API_KEY;
const BNB_CHAIN_ETHERSCAN_API_KEY = process.env.BNB_CHAIN_ETHERSCAN_API_KEY;
const BASE_ETHERSCAN_API_KEY = process.env.BASE_ETHERSCAN_API_KEY;

const config: HardhatUserConfig = {
  solidity: '0.8.24',
  networks: {
    hardhat: {
      chainId: 31337
    },
    ethereumSepolia: {
      url: ETHEREUM_SEPOLIA_RPC_URL !== undefined ? ETHEREUM_SEPOLIA_RPC_URL : '',
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      chainId: 11155111
    },
    polygonMumbai: {
      url: POLYGON_MUMBAI_RPC_URL !== undefined ? POLYGON_MUMBAI_RPC_URL : '',
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      chainId: 80001
    },
    optimismGoerli: {
      url: OPTIMISM_GOERLI_RPC_URL !== undefined ? OPTIMISM_GOERLI_RPC_URL : '',
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      chainId: 420,
    },
    arbitrumSepolia: {
      url: ARBITRUM_SEPOLIA_RPC_URL !== undefined ? ARBITRUM_SEPOLIA_RPC_URL : '',
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      chainId: 421614
    },
    avalancheFuji: {
      url: AVALANCHE_FUJI_RPC_URL !== undefined ? AVALANCHE_FUJI_RPC_URL : '',
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      chainId: 43113
    },
    bnbChainTestnet: {
      url: BNB_CHAIN_TESTNET_RPC_URL !== undefined ? BNB_CHAIN_TESTNET_RPC_URL : '',
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      chainId: 97
    },
    baseGoerli: {
      url: BASE_GOERLI_RPC_URL !== undefined ? BASE_GOERLI_RPC_URL : '',
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      chainId: 84531
    }
  },
  typechain: {
    externalArtifacts: ['./abi/*.json']
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts'
  },
  etherscan: {
    apiKey: {
      sepolia: ETHEREUM_ETHERSCAN_API_KEY !== undefined ? ETHEREUM_ETHERSCAN_API_KEY : '',
      polygonMumbai: POLYGON_ETHERSCAN_API_KEY !== undefined ? POLYGON_ETHERSCAN_API_KEY : '',
      optimismGoerli: OPTIMISM_ETHERSCAN_API_KEY !== undefined ? OPTIMISM_ETHERSCAN_API_KEY : '',
      arbitrumSepolia: ARBITRUM_ETHERSCAN_API_KEY !== undefined ? ARBITRUM_ETHERSCAN_API_KEY : '',
      avalancheFujiTestnet: AVALANCHE_ETHERSCAN_API_KEY !== undefined ? AVALANCHE_ETHERSCAN_API_KEY : '',
      bnbChainTestnet: BNB_CHAIN_ETHERSCAN_API_KEY !== undefined ? BNB_CHAIN_ETHERSCAN_API_KEY : '',
      baseGoerli: BASE_ETHERSCAN_API_KEY !== undefined ? BASE_ETHERSCAN_API_KEY : ''
    },
  },
};

export default config;