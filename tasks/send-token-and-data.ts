import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { getPayFeesIn, getRouterConfig } from "../utils/configs";
import { IRouterClient, IRouterClient__factory } from "../typechain-types";
import { Spinner } from "../utils/spinner";

task(`send-token-and-data-v2`, `Sends token and data using ProgrammableTokenTransfers.sol`)
    .addParam(`destinationBlockchain`, `The name of the destination blockchain (for example polygonMumbai)`)
    .addParam(`sender`, `The address of the sender ProgrammableTokenTransfers.sol on the source blockchain`)
    .addParam(`receiver`, `The address of the receiver ProgrammableTokenTransfers.sol on the destination blockchain`)
    .addParam(`message`, `The string message to be sent (for example "Hello, World")`)
    .addParam(`tokenAddress`, `The address of a token to be sent on the source blockchain`)
    .addParam(`amount`, `The amount of token to be sent`)
    .addParam(`payFeesIn`, `Choose between 'Native' and 'LINK'`)
    .setAction(async (taskArguments: TaskArguments, hre: HardhatRuntimeEnvironment) => {
        const { sender, destinationBlockchain, receiver, message, tokenAddress, amount, payFeesIn } = taskArguments;
        const [signer] = await hre.ethers.getSigners();
        const spinner: Spinner = new Spinner();

        const senderContract = await hre.ethers.getContractAt("ProgrammableTokenTransfers", sender, signer);

        const routerAddress = getRouterConfig(hre.network.name).address;
        const destinationChainSelector = getRouterConfig(destinationBlockchain).chainSelector;

        const router = IRouterClient__factory.connect(routerAddress, hre.ethers.provider);
        const supportedTokens = await router.getSupportedTokens(destinationChainSelector);
        const fees = getPayFeesIn(payFeesIn);


        console.log(`ℹ️  Checking whether the ${tokenAddress} token is supported by Chainlink CCIP on the ${hre.network.name} blockchain`);
        spinner.start();

        if (!supportedTokens.includes(tokenAddress)) {
            throw Error(`Token address ${tokenAddress} not in the list of supportedTokens ${supportedTokens}`);
        }

        console.log(`ℹ️  Attempting to call the sendMessage function of ProgrammableTokenTransfers ${sender} on the ${hre.network.name} 
                        blockchain to the destination ${destinationBlockchain} blockchain.`);
        spinner.start();

        const tx = await senderContract.sendMessage(
            destinationChainSelector,
            receiver,
            message,
            tokenAddress,
            amount,
            fees
        );

        await tx.wait();

        spinner.start();
        console.log(`✅ Message sent, transaction hash: ${tx.hash}`);
    })


task(`get-received-message-details-v2`, `Gets details of any CCIP message received by the ProgrammableTokenTransfers.sol smart contract`)
    .addParam(`contractAddress`, `The address of the ProgrammableTokenTransfers.sol smart contract`)
    .setAction(async (taskArguments: TaskArguments, hre: HardhatRuntimeEnvironment) => {
        const { contractAddress } = taskArguments;

        const receiverContract = await hre.ethers.getContractAt("ProgrammableTokenTransfers", contractAddress);
        console.log(await receiverContract.getLastReceivedMessageDetails());
    })