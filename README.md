## CCIP Starter Kit

> **Note**
>
> _This repository represents an example of using a Chainlink product or service. It is provided to help you understand how to interact with Chainlink’s systems so that you can integrate them into your own. This template is provided "AS IS" without warranties of any kind, has not been audited, and may be missing key checks or error handling to make the usage of the product more clear. Take everything in this repository as an example and not something to be copy pasted into a production ready service._

This project demonstrates a couple of basic Chainlink CCIP use cases.

## Prerequisites

- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Current LTS Node.js version](https://nodejs.org/en/about/releases/)

Verify installation by typing:

```shell
node -v
```

and

```shell
npm -v
```

## Getting Started

1. Install packages

```
npm install
```

2. Compile contracts

```
npx hardhat compile
```

3. Run tests

```
TS_TRANSPILE_NODE=1 npx hardhat test
```

## What is Chainlink CCIP?

**Chainlink Cross-Chain Interoperability Protocol (CCIP)** provides a single, simple, and elegant interface through which dApps and web3 entrepreneurs can securely meet all their cross-chain needs, including token transfers and arbitrary messaging.

![basic-architecture](./img/basic-architecture.png)

With Chainlink CCIP, one can:

- Transfer supported tokens
- Send messages (any data)
- Send messages and tokens

CCIP receiver can be:

- Smart contract that implements `CCIPReceiver.sol`
- EOA

**Note**: If you send a message and token(s) to EOA, only tokens will arrive

To use this project, you can consider CCIP as a "black-box" component and be aware of the Router contract only. If you want to dive deep into it, check the [Official Chainlink Documentation](https://docs.chain.link/ccip).

## Usage

In the next section you can see a couple of basic Chainlink CCIP use case examples. But before that, you need to set up some environment variables.

We are going to use the [`@chainlink/env-enc`](https://www.npmjs.com/package/@chainlink/env-enc) package for extra security. It encrypts sensitive data instead of storing them as plain text in the `.env` file, by creating a new, `.env.enc` file. Although it's not recommended to push this file online, if that accidentally happens your secrets will still be encrypted.

1. Set a password for encrypting and decrypting the environment variable file. You can change it later by typing the same command.

```shell
npx env-enc set-pw
```

2. Now set the following environment variables: `PRIVATE_KEY`, Source Blockchain RPC URL, Destination Blockchain RPC URL. You can see available options in the `.env.example` file or check out the [latest supported networks in the docs](https://docs.chain.link/ccip/supported-networks):

```shell
ETHEREUM_SEPOLIA_RPC_URL=""
OPTIMISM_GOERLI_RPC_URL=""
ARBITRUM_SEPOLIA_RPC_URL=""
AVALANCHE_FUJI_RPC_URL=""
POLYGON_MUMBAI_RPC_URL=""
BNB_CHAIN_TESTNET_RPC_URL=""
BASE_GOERLI_RPC_URL=""
```

To set these variables, type the following command and follow the instructions in the terminal:

```shell
npx env-enc set
```

After you are done, the `.env.enc` file will be automatically generated.

If you want to validate your inputs you can always run the next command:

```shell
npx env-enc view
```

### Faucet

You will need test tokens for some of the examples in this Starter Kit. Public faucets sometimes limit how many tokens a user can create and token pools might not have enough liquidity. To resolve these issues, CCIP supports two ERC20 tokens (`CCIP-BnM` and `CCIP-LnM`) that you can mint permissionlessly on each supported testnet so you don't run out of tokens while testing different scenarios. You can get the addresses for the test tokens, for each supported network, [here](https://docs.chain.link/ccip/supported-networks). You can understand the architecture principles behind these two test tokens [here](https://docs.chain.link/ccip/architecture#token-pools).

To get 10\*\*18 units of each of these tokens, use the `faucet` task. Keep in mind that the `CCIP-BnM` test token you can mint on all testnets, while `CCIP-LnM` you can mint only on Ethereum Sepolia. On other testnets, the `CCIP-LnM` token representation is a wrapped/synthetic asset called `clCCIP-LnM`.

```shell
npx hardhat faucet
--receiver <RECEIVER_ADDRESS>
--token-name <CCIP-BnM or CCIP-LnM>
```

For example, to mint tokens on ethereumSepolia run:

```shell
npx hardhat faucet --receiver <RECEIVER_ADDRESS> --token-name CCIP-BnM --network ethereumSepolia
```

### Example 1 - Transfer CCIP Test Tokens from EOA to EOA

To transfer tokens from one EOA on one blockchain to another EOA on another blockchain you can use the `ccip-token-transfer-v2` command:

```shell
npx ccip-token-transfer-v2
--destination-blockchain <destinationBlockchain>
--receiver <receiverAddressOnDestinationBlockchain>
--token-address <tokenToSendAddressOnSourceBlockchain>
--amount <amountToSend>     # in units (eg wei)
--fee-token-address  <feeTokenAddress> # Optional
```

Where the list of supported chains consists of (case sensitive):

- ethereumSepolia
- optimismGoerli
- arbitrumSepolia
- avalancheFuji
- polygonMumbai
- bnbChainTestnet
- baseGoerli

For example, if you want to send 100 units of CCIP-BnM token from Avalanche Fuji to Ethereum Sepolia, and you want to pay for CCIP fees in native coin (Avalanche Fuji AVAX in this case), run:

```shell
npx hardhat ccip-token-transfer-v2 --destination-blockchain ethereumSepolia --receiver <RECEIVER_ADDRESS> --token-address 0xD21341536c5cF5EB1bcb58f6723cE26e8D8E90e4 --amount 100 --network avalancheFuji
```

If you want to pay for CCIP fees in Avalanche Fuji test LINK, expand the previous command with the additional `--fee-token-address` flag:

```shell
npx hardhat ccip-token-transfer-v2 --destination-blockchain ethereumSepolia --receiver <RECEIVER_ADDRESS> --token-address 0xD21341536c5cF5EB1bcb58f6723cE26e8D8E90e4 --amount 100 --fee-token-address 0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846 --network avalancheFuji
```

### Example 2 - Transfer Tokens from EOA to Smart Contract

To transfer tokens from EOA from the source blockchain to the smart contract on the destination blockchain, follow the next steps:

1. Deploy [`BasicMessageReceiver.sol`](./contracts/BasicMessageReceiver.sol) to the **destination blockchain**, using the `BasicTokenSenderModule.ts` ignition:

```shell
npx hardhat ignition deploy ./ignition/modules/BasicMessageReceiverModule.ts --network <destination blockchain>
```

For example, if you want to send tokens from avalancheFuji to ethereumSepolia, you need to deploy this contract on ethereumSepolia, by running:

```shell
npx hardhat ignition deploy ./ignition/modules/BasicMessageReceiverModule.ts --network ethereumSepolia
```

2. Transfer tokens to the deployed smart contract using the `ccip-token-transfer-v2` task, by putting its address as a receiver flag. For example, if you want to send 100 units of CCIP-BnM from avalancheFuji run:

```shell
npx hardhat ccip-token-transfer-v2 --destination-blockchain ethereumSepolia --receiver <BASIC_MESSAGE_RECEIVER_ADDRESS> --token-address 0xD21341536c5cF5EB1bcb58f6723cE26e8D8E90e4 --amount 100 --fee-token-address 0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846 --network avalancheFuji
```

3. Once the CCIP message is finalized on the destination blockchain, you can always withdraw received tokens from the [`BasicMessageReceiver.sol`](./contracts/BasicMessageReceiver.sol) smart contract using the `withdraw-v2` task. Note that the `--token-address` flag is optional. If not provided, native coins will be withdrawn.

```shell
npx hardhat withdraw-v2
--from <basicMessageReceiverAddress>
--beneficiary <withdrawTo>
--token-address <tokenToWithdraw> # Optional, if left empty native coins will be withdrawn
```

For example, to withdraw 100 units of CCIP-BnM previously sent, run:

```shell
npx hardhat withdraw-v2 --beneficiary <BENEFICIARY_ADDRESS> --from <BASIC_MESSAGE_RECEIVER_ADDRESS> --token-address 0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05 --network ethereumSepolia
```

### Example 3 - Transfer Token(s) from Smart Contract to any destination

To transfer a token or batch of tokens from a single, universal, smart contract to any address on the destination blockchain follow the next steps:

1. Deploy [`BasicTokenSender.sol`](./contracts/BasicTokenSender.sol) to the **source blockchain**, using the `BasicTokenSenderModule.ts` ignition:

```shell
npx hardhat ignition deploy ./ignition/modules/BasicTokenSenderModule.ts --network <source blockchain>
```

For example, if you want to send tokens from avalancheFuji to ethereumSepolia, run:

```shell
npx hardhat ignition deploy ./ignition/modules/BasicTokenSenderModule.ts --network avalancheFuji
```

2. [OPTIONAL] If you want to send tokens to the smart contract, instead of EOA, you will need to deploy [`BasicMessageReceiver.sol`](./contracts/BasicMessageReceiver.sol) to the **destination blockchain**, using the `BasicMessageReceiverModule.ts` ignition, and then put the address of that smart contract as a receiver.

For example, if you want to send tokens from the [`BasicTokenSender.sol`](./contracts/BasicTokenSender.sol) smart contract on the Avalanche Fuji blockchain to the [`BasicMessageReceiver.sol`](./contracts/BasicMessageReceiver.sol) smart contract on the Ethereum Sepolia blockchain, run:

```shell
npx hardhat ignition deploy ./ignition/modules/BasicMessageReceiverModule.ts --network ethereumSepolia
```

3. Fill the [`BasicTokenSender.sol`](./contracts/BasicTokenSender.sol) with tokens/coins for fees (you can always withdraw it later). You can do it manually from your wallet or by running the following task:

```shell
npx hardhat fill-sender-v2
--sender-address <addressOfBasicTokenSenderContractWeDeployed>
--amount <amountToSend>
--pay-fees-in <Native | LINK>
```

For example, if you want to send tokens from avalancheFuji and fund it with 3 Avalanche Fuji LINK for Chainlink CCIP fees, run:

```shell
npx hardhat fill-sender-v2 --sender-address <BASIC_TOKEN_SENDER_ADDRESS> --amount 3000000000000000000 --pay-fees-in LINK --network avalancheFuji
```

4. Finally, send tokens by providing the `{token, amount}` object, using the `ccip-token-transfer-v2` task:

```shell
npx hardhat ccip-token-transfer-batch-v2
--basic-token-sender-address <addressOfBasicTokenSenderContractWeDeployed>
--destination-blockchain <destinationBlockchain>
--receiver <receiverAddressOnDestinationBlockchain>
--token-amounts <tokenAmounts>
--pay-fees-in <Native | LINK>
```

The `payFeesIn` flag determines whether you are paying for CCIP fees with LINK tokens or native coins on the source blockchain (Pass "Native" or "LINK").

For example, to send 100 units of CCIP-BnM tokens from avalancheFuji to ethereumSepolia and pay fees in Avalanche Fuji LINK, run:

```shell
npx hardhat ccip-token-transfer-batch-v2 --basic-token-sender-address <BASIC_TOKEN_SENDER_ADDRESS> --destination-blockchain ethereumSepolia --receiver <RECEIVER_ADDRESS> --token-amounts '[{"token":"0xD21341536c5cF5EB1bcb58f6723cE26e8D8E90e4","amount":"100"}]' --pay-fees-in LINK --network avalancheFuji
```

5. You can always withdraw tokens for Chainlink CCIP fees from the [`BasicTokenSender.sol`](./contracts/BasicTokenSender.sol) smart contract using the `withdraw-v2` task. Note that the `--token-address` flag is optional. If not provided, native coins will be withdrawn.

```shell
npx hardhat withdraw-v2
--from <basicMessageReceiverAddress>
--beneficiary <withdrawTo>
--token-address <tokenToWithdraw> # Optional, if left empty native coins will be withdrawn
```

For example, to withdraw 100 units of CCIP-BnM previously sent, run:

```shell
npx hardhat withdraw-v2 --beneficiary <BENEFICIARY_ADDRESS> --from <BASIC_MESSAGE_RECEIVER_ADDRESS> --token-address 0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05 --network ethereumSepolia
```

### Example 4 - Send & Receive Tokens and Data

To transfer tokens and data across multiple chains, follow the next steps:

1. Deploy the [`ProgrammableTokenTransfers.sol`](./contracts/ProgrammableTokenTransfers.sol) smart contract to the **source blockchain**, using the `ProgrammableTokenTransfersModule.ts` ignition:

```shell
npx hardhat ignition deploy ./ignition/modules/ProgrammableTokenTransfersModule.ts --network <source blockchain>
```

For example, if you want to send a message from Avalanche fuji to Sepolia type:

```shell
npx hardhat ignition deploy ./ignition/modules/ProgrammableTokenTransfersModule.ts --network avalancheFuji
```

2. Fill the [`ProgrammableTokenTransfers.sol`](./contracts/ProgrammableTokenTransfers.sol) with tokens/coins for fees (you can always withdraw it later). You can do it manually from your wallet or by running the following task:

```shell
npx hardhat fill-sender-v2
--sender-address <addressOfProgrammableTokenTransfersContractWeDeployed>
--amount <amountToSend>
--pay-fees-in <Native | LINK>
```

For example, if you want to send tokens from avalancheFuji and fund it with 3 Avalanche Fuji LINK for Chainlink CCIP fees, run:

```shell
npx hardhat fill-sender-v2 --sender-address <PROGRAMMABLE_TOKEN_TRANSFERS_ADDRESS> --amount 3000000000000000000 --pay-fees-in LINK --network avalancheFuji
```

3. Open Metamask and fund your contract with CCIP-BnM/CCIP-LnM tokens. For example, if you want to send a message from Avalanche Fuji to Sepolia, you can send 0.0000000000000001 Sepolia CCIP-BnM to your contract. (you can use faucet task to get more tokens if you need.)

4. Deploy the [`ProgrammableTokenTransfers.sol`](./contracts/ProgrammableTokenTransfers.sol) smart contract to the **destination blockchain**:

For example, if you want to receive a message from Avalanche Fuji on Sepolia Ethereum type:

```shell
npx hardhat ignition deploy ./ignition/modules/ProgrammableTokenTransfersModule.ts --network ethereumSepolia
```

At this point, you have one **sender** contract on the source blockchain, and one **receiver** contract on the destination blockchain. Please note that [`ProgrammableTokenTransfers.sol`](./contracts/ProgrammableTokenTransfers.sol) can both send & receive tokens and data, hence we have two identical instances on both source and destination blockchains.

5. Send a message, by running:

```shell
npx send-token-and-data-v2
--destination-blockchain <destinationBlockchain>
--sender <addressOfProgrammableTokenTransfersOnSourceBlockchain>
--receiver <ddressOfProgrammableTokenTransfersOnDestinationBlockchain>
--message <messageToSend>
--token-address <tokenToSendAddressOnSourceBlockchain>
--amount <amountToSend>
--pay-fees-in <Choose between 'Native' and 'LINK'>
```

For example, if you want to send a "Hello World" message alongside 100 Sepolia LINK from Ethereum Sepolia to Polygon Mumbai type:

```shell
npx hardhat send-token-and-data-v2 --sender <CONTRACT_ADDRESS_ON_SOURCE_BLOCKCHAIN> --destination-blockchain ethereumSepolia --receiver <CONTRACT_ADDRESS_ON_DESTINATION_BLOCKCHAIN> --message "Hello World" --token-address 0xD21341536c5cF5EB1bcb58f6723cE26e8D8E90e4 --amount 100 --pay-fees-in LINK --network avalancheFuji
```

6. Once the CCIP message is finalized on the destination blockchain, you can see the details of the latest CCIP message received, by running the `get-received-message-details-v2` task:

```shell
npx hardhat get-received-message-details-v2
--contract-address <programmableTokenTransfersAddressOnDestinationBlockchain>
```

For example,

```shell
npx hardhat get-received-message-details-v2 --contract-address <PROGRAMMABLE_TOKEN_TRANSFERS_ADDRESS_ON_DESTINATION_BLOCKCHAIN> --network ethereumSepolia
```

### Example 5 - Send & Receive Cross-Chain Messages and Pay with LINK Tokens

To send simple Text Cross-Chain Messages and pay for CCIP fees in Native Tokens, follow the next steps:

1. Deploy the [`BasicMessageSender.sol`](./contracts/BasicMessageSender.sol) smart contract on the **source blockchain**, using the `BasicMessageSenderModule.ts` ignition:

```shell
npx hardhat ignition deploy ./ignition/modules/BasicMessageSenderModule.ts --network <source blockchain>
```

For example, if you want to send a simple cross-chain message from avalancheFuji, run

```shell
npx hardhat ignition deploy ./ignition/modules/BasicMessageSenderModule.ts --network avalancheFuji
```

2. Fund the [`BasicMessageSender.sol`](./contracts/BasicMessageSender.sol) smart contract with Native Coins, either manually using your wallet or by using the `fill-sender-v2` task.

For example, if you want to send 3 LINKS to your contract, run:

```shell
npx hardhat fill-sender-v2 --sender-address <BASIC_MESSAGE_SENDER_ADDRESS>  --amount 3000000000000000000 --pay-fees-in LINK --network avalancheFuji
```

3. Deploy the [`BasicMessageReceiver.sol`](./contracts/BasicMessageReceiver.sol) smart contract to the **destination blockchain**, using the `BasicMessageReceiverModule.ts` task.

For example, if you want to receive a simple cross-chain message on the ethereumSepolia blockchain, run:

```shell
npx hardhat ignition deploy ./ignition/modules/BasicMessageReceiverModule.ts --network ethereumSepolia
```

4. Finally, send a cross-chain message using the `send-message-v2` task:

```shell
npx hardhat send-message-v2
--sender <addressOfBasicMessageSenderOnSourceBlockchain>
--destination-blockchain <destinationBlockchain>
--receiver <ddressOfBasicMessageReceiverOnDestinationBlockchain>
--message <messageToSend>
--pay-fees-in <Native/LINK>
```

For example, if you want to send a "Hello, World!" message type:

```shell
npx hardhat send-message-v2 --sender <BASIC_MESSAGE_SENDER_ADDRESS> --destination-blockchain ethereumSepolia --receiver <BASIC_MESSAGE_RECEIVER_ADDRESS> --message "Hello, World!" --pay-fees-in LINK --network avalancheFuji
```

5. Once the CCIP message is finalized on the destination blockchain, you can query the latest received message details, using the `get-message-v2` task:

![ccip-explorer](./img/ccip-explorer.png)

```shell
npx hardhat get-message-v2
--receiver-address <basicMessageReceiverAddress>
```

For example, to get the message details sent in the previous step, type:

```shell
npx hardhat get-message-v2 --receiver-address <BASIC_MESSAGE_RECEIVER_ADDRESS> --network ethereumSepolia
```

6. You can always withdraw tokens for Chainlink CCIP fees from the [`BasicMessageSender.sol`](./contracts/BasicMessageSender.sol) smart contract using the `withdraw-v2` task. Note that the `--token-address` flag is optional. If not provided, native coins will be withdrawn.

```shell
npx hardhat withdraw-v2
--from <basicMessageSenderAddress>
--beneficiary <withdrawTo>
--token-address <tokensToWithdraw> # Optional, if left empty native coins will be withdrawn
```

For example, to withdraw LINK previously sent for Chainlink CCIP fees, run:

```shell
npx hardhat withdraw-v2  --from <BASIC_MESSAGE_SENDER_ADDRESS> --beneficiary <BENEFICIARY_ADDRESS> --token-address <LINK ADDRESS> --network avalancheFuji
```


### Example 6 - Send & Receive Cross-Chain Messages and Pay with Native Coins

To send simple Text Cross-Chain Messages and pay for CCIP fees in Native Tokens, follow the next steps:

1. Deploy the [`BasicMessageSender.sol`](./contracts/BasicMessageSender.sol) smart contract on the **source blockchain**, using the `BasicMessageSenderModule.ts` ignition:

```shell
npx hardhat ignition deploy ./ignition/modules/BasicMessageSenderModule.ts --network <source blockchain>
```

For example, if you want to send a simple cross-chain message from ethereumSepolia, run

```shell
npx hardhat ignition deploy ./ignition/modules/BasicMessageSenderModule.ts --network ethereumSepolia
```

2. Fund the [`BasicMessageSender.sol`](./contracts/BasicMessageSender.sol) smart contract with Native Coins, either manually using your wallet or by using the `fill-sender-v2` task.

For example, if you want to send 0.01 Sepolia ether, run:

```shell
npx hardhat fill-sender-v2 --sender-address <BASIC_MESSAGE_SENDER_ADDRESS>  --amount 10000000000000000 --pay-fees-in Native --network ethereumSepolia
```

3. Deploy the [`BasicMessageReceiver.sol`](./contracts/BasicMessageReceiver.sol) smart contract to the **destination blockchain**, using the `BasicMessageReceiverModule.ts` task.

For example, if you want to receive a simple cross-chain message on the avalancheFuji blockchain, run:

```shell
npx hardhat ignition deploy ./ignition/modules/BasicMessageReceiverModule.ts --network avalancheFuji
```

4. Finally, send a cross-chain message using the `send-message-v2` task:

```shell
npx hardhat send-message-v2
--sender <addressOfBasicMessageSenderOnSourceBlockchain>
--destination-blockchain <destinationBlockchain>
--receiver <ddressOfBasicMessageReceiverOnDestinationBlockchain>
--message <messageToSend>
--pay-fees-in <Native/LINK>
```

For example, if you want to send a "Hello, World!" message type:

```shell
npx hardhat send-message-v2 --sender <BASIC_MESSAGE_SENDER_ADDRESS> --destination-blockchain avalancheFuji --receiver <BASIC_MESSAGE_RECEIVER_ADDRESS> --message "Hello, World!" --pay-fees-in Native --network ethereumSepolia
```

5. Once the CCIP message is finalized on the destination blockchain, you can query the latest received message details, using the `get-message-v2` task:

![ccip-explorer](./img/ccip-explorer.png)

```shell
npx hardhat get-message-v2
--receiver-address <basicMessageReceiverAddress>
```

For example, to get the message details sent in the previous step, type:

```shell
npx hardhat get-message-v2 --receiver-address <BASIC_MESSAGE_RECEIVER_ADDRESS> --network avalancheFuji
```

6. You can always withdraw tokens for Chainlink CCIP fees from the [`BasicMessageSender.sol`](./contracts/BasicMessageSender.sol) smart contract using the `withdraw-v2` task. Note that the `--token-address` flag is optional. If not provided, native coins will be withdrawn.

```shell
npx hardhat withdraw-v2
--from <basicMessageSenderAddress>
--beneficiary <withdrawTo>
--token-address <tokensToWithdraw> # Optional, if left empty native coins will be withdrawn
```

For example, to withdraw LINK previously sent for Chainlink CCIP fees, run:

```shell
npx hardhat withdraw-v2  --from <BASIC_MESSAGE_SENDER_ADDRESS> --beneficiary <BENEFICIARY_ADDRESS> --network ethereumSepolia
```


### Example 7 - Execute Received Message as a Function Call

Our goal for this example is to mint an NFT on the destination blockchain by sending the `to` address from the source blockchain. It is extremely simple so we can understand the basic concepts, but you can expand it to accept payment for minting on the source blockchain, grant minter role to CCIP receiver contract on the destination blockchain, etc.

The basic architecture diagram of what we want to accomplish looks like this:

```mermaid
flowchart LR
subgraph "Source Blockchain"
a("SourceMinter.sol") -- "`send abi.encodeWithSignature('mint(address)', msg.sender);`" --> b("Source Router")
end

b("Source Router") --> c("CCIP")

c("CCIP") --> d("Destination Router")

subgraph "Destination Blockchain"
d("Destination Router") -- "`receive abi.encodeWithSignature('mint(address)', msg.sender);`" --> e("DestinationMinter.sol")
e("DestinationMinter.sol") -- "`call mint(to)`" --> f("MyNFT.sol")
end
```

1. Deploy the [`MyNFT.sol`](./contracts/cross-chain-nft-minter/MyNFT.sol) and [`DestinationMinter.sol`](./contracts/cross-chain-nft-minter/DestinationMinter.sol) smart contracts from the `./contracts/cross-chain-nft-minter` folder on the **destination blockchain**, by running the `DestinationMinterModule.ts` ignition, this scripts will deploy both contracts:

```shell
npx hardhat ignition deploy ./ignition/modules/cross-chain-nft-minter/DestinationMinterModule.ts --network <destination blockchain>
```

For example, if you want to mint NFTs on Ethereum Sepolia, run:

```shell
npx hardhat ignition deploy ./ignition/modules/cross-chain-nft-minter/DestinationMinterModule.ts --network ethereumSepolia
```

2. Deploy the [`SourceMinter.sol`](./contracts/cross-chain-nft-minter/SourceMinter.sol) smart contract on the **source blockchain**, by running the `SourceMinterModule.ts` ignition:

```shell
npx hardhat ignition deploy ./ignition/modules/cross-chain-nft-minter/SourceMinterModule.ts --network <source blockchain>
```

For example, if you want to mint NFTs on avalancheFuji by sending requests from Avalanche Fuji, run:

```shell
npx hardhat ignition deploy ./ignition/modules/cross-chain-nft-minter/SourceMinterModule.ts --network avalancheFuji
```

3. Fund the [`SourceMinter.sol`](./contracts/cross-chain-nft-minter/SourceMinter.sol) smart contract with tokens for CCIP fees.

- If you want to pay for CCIP fees in Native tokens:

  Open Metamask and fund your contract with Native tokens. For example, if you want to mint from Avalanche Fuji to Ethereum Sepolia, you can send 0.1 AVAX to the [`SourceMinter.sol`](./contracts/cross-chain-nft-minter/SourceMinter.sol) smart contract.

  Or, you can execute the `fill-sender-v2` task, by running:

```shell
npx hardhat fill-sender-v2
--sender-address <addressOfSourceMinterContractWeDeployed>
--amount <amountToSend>
--pay-fees-in <Native | LINK>
```

For example, if you want to fund it with 0.1 AVAX Tokens, run:

```shell
npx hardhat fill-sender-v2 --sender-address <SOURCE_MINTER_ADDRESS> --amount 100000000000000000 --pay-fees-in Native --network avalancheFuji
```

- If you want to pay for CCIP fees in LINK tokens:

  Open Metamask and fund your contract with LINK tokens. For example, if you want to mint from Avalanche Fuji to Ethereum Sepolia, you can send 1 Avalanche Fuji LINK to the [`SourceMinter.sol`](./contracts/cross-chain-nft-minter/SourceMinter.sol) smart contract.

  Or, you can execute the `fill-sender` task, by running:

```shell
npx hardhat fill-sender-v2
--sender-address <addressOfSourceMinterContractWeDeployed>
--amount <amountToSend>
--pay-fees-in <Native | LINK>
```

For example, if you want to fund it with 3 Avalanche Fuji LINK, run:

```shell
npx hardhat fill-sender-v2 --sender-address <SOURCE_MINTER_ADDRESS> --amount 3000000000000000000 --pay-fees-in LINK --network avalancheFuji
```

4. Mint NFTs by calling the `mint()` function of the [`SourceMinter.sol`](./contracts/cross-chain-nft-minter/SourceMinter.sol) smart contract on the **source blockchain**. It will send the CCIP Cross-Chain Message with the ABI-encoded mint function signature from the [`MyNFT.sol`](./contracts/cross-chain-nft-minter/MyNFT.sol) smart contract. The [`DestinationMinter.sol`](./contracts/cross-chain-nft-minter/DestinationMinter.sol) smart contracts will receive the CCIP Cross-Chain Message with the ABI-encoded mint function signature as a payload and call the [`MyNFT.sol`](./contracts/cross-chain-nft-minter/MyNFT.sol) smart contract using it. The [`MyNFT.sol`](./contracts/cross-chain-nft-minter/MyNFT.sol) smart contract will then mint the new NFT to the `msg.sender` account from the `mint()` function of the [`SourceMinter.sol`](./contracts/cross-chain-nft-minter/SourceMinter.sol) smart contract, a.k.a to the account from which you will call the following command:

```shell
npx cross-chain-mint-v2
--source-minter <sourceMinterAddress>
--destination-blockchain <destinationBlockchain>
--destination-minter <destinationMinterAddress>
--pay-fees-in <Native | LINK>
```

For example, if you want to mint NFTs on Ethereum Sepolia by sending requests from Avalanche Fuji, run:

```shell
npx hardhat cross-chain-mint-v2 --source-minter <SOURCE_MINTER_ADDRESS> --destination-blockchain ethereumSepolia --destination-minter <DESTNATION_MINTER_ADDRESS> --pay-fees-in LINK --network avalancheFuji
```

5. Once the CCIP message is finalized on the destination blockchain, you can query the MyNFTs balance of your account, using the `cross-chain-mint-balance-of-v2` task:

![ccip-explorer](./img/ccip-explorer.png)

```shell
npx hardhat cross-chain-mint-balance-of-v2
--nft-address <myNftContractAddress>
--owner <theAccountToCheckBalanceOf>
```

For example, to verify that the new MyNFT was minted, type:

```shell
npx hardhat cross-chain-mint-balance-of-v2 --nft-address <MY_NFT_CONTRACT_ADDRESS> --owner <PUT_YOUR_EOA_ADDRESS_HERE> --network ethereumSepolia
```

Of course, you can see your newly minted NFT on popular NFT Marketplaces, like OpenSea for instance:

![opensea](./img/opensea.png)

6. You can always withdraw tokens for Chainlink CCIP fees from the [`SourceMinter.sol`](./contracts/cross-chain-nft-minter/SourceMinter.sol) smart contract using the `withdraw-v2` task. Note that the `--token-address` flag is optional. If not provided, native coins will be withdrawn.

```shell
npx hardhat withdraw-v2
--beneficiary <withdrawTo>
--from <sourceMinterAddress>
--token-address <tokensToWithdraw> # Optional, if left empty native coins will be withdrawn
```

For example, to withdraw tokens previously sent for Chainlink CCIP fees, run:

```shell
npx hardhat withdraw-v2 --beneficiary <BENEFICIARY_ADDRESS> --from <SOURCE_MINTER_ADDRESS> --network avalancheFuji
```

or

```shell
npx hardhat withdraw-v2 --beneficiary <BENEFICIARY_ADDRESS> --from <SOURCE_MINTER_ADDRESS> --token-address 0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846  --network avalancheFuji
```

depending on whether you filled the [`SourceMinter.sol`](./contracts/cross-chain-nft-minter/SourceMinter.sol) contract with `Native` or `LINK` in step number 3.
