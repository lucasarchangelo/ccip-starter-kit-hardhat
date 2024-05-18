import { HardhatUserConfig, vars } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import './tasks';

const PRIVATE_KEY = vars.get("PRIVATE_KEY", "")
const ETHEREUM_SEPOLIA_RPC_URL = vars.get("ETHEREUM_SEPOLIA_RPC_URL", "")
const POLYGON_MUMBAI_RPC_URL = vars.get("POLYGON_MUMBAI_RPC_URL", "")
const OPTIMISM_GOERLI_RPC_URL = vars.get("OPTIMISM_GOERLI_RPC_URL", "")
const ARBITRUM_SEPOLIA_RPC_URL = vars.get("ARBITRUM_SEPOLIA_RPC_URL", "")
const AVALANCHE_FUJI_RPC_URL = vars.get("AVALANCHE_FUJI_RPC_URL", "")
const BNB_CHAIN_TESTNET_RPC_URL = vars.get("BNB_CHAIN_TESTNET_RPC_URL", "")
const BASE_GOERLI_RPC_URL = vars.get("BASE_GOERLI_RPC_URL", "")

const config: HardhatUserConfig = {
  solidity: '0.8.19',
  networks: {
    hardhat: {
      chainId: 31337
    },
    ethereumSepolia: {
      url: ETHEREUM_SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111
    },
    polygonMumbai: {
      url: POLYGON_MUMBAI_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 80001
    },
    optimismGoerli: {
      url: OPTIMISM_GOERLI_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 420,
    },
    arbitrumSepolia: {
      url: ARBITRUM_SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 421614
    },
    avalancheFuji: {
      url: AVALANCHE_FUJI_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 43113
    },
    bnbChainTestnet: {
      url: BNB_CHAIN_TESTNET_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 97
    },
    baseGoerli: {
      url: BASE_GOERLI_RPC_URL !== undefined ? BASE_GOERLI_RPC_URL : '',
      accounts: [PRIVATE_KEY],
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
};

export default config;
