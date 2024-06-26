

import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { getRouterConfig, getPayFeesIn } from "./utils";
import { IRouterClient__factory, IERC20, IERC20__factory } from "../typechain-types";
import { TokenAmounts } from "./constants";
import { BasicTokenSender } from "../typechain-types/artifacts/contracts/BasicTokenSender";
import { BasicTokenSender__factory } from "../typechain-types/factories/artifacts/contracts/BasicTokenSender__factory";
import { Spinner } from "../utils/spinner";
import { getCcipMessageId } from "./helpers";

task(`ccip-token-transfer-batch`, `Transfers tokens from one blockchain to another using Chainlink CCIP via BasicTokenSender.sol`)
    .addParam(`basicTokenSenderAddress`, `The address of a BasicTokenSender.sol on the source blockchain`)
    .addParam(`destinationBlockchain`, `The name of the destination blockchain (for example polygonMumbai)`)
    .addParam(`receiver`, `The address of the receiver account on the destination blockchain`)
    .addParam(`tokenAmounts`, `The array of {token,amount} objects of tokens to send`)
    .addParam(`payFeesIn`, `Choose between 'Native' and 'LINK'`)
    .addOptionalParam(`router`, `The address of the Router contract on the source blockchain`)
    .setAction(async (taskArguments: TaskArguments, hre: HardhatRuntimeEnvironment) => {
        const { basicTokenSenderAddress, destinationBlockchain, receiver, tokenAmounts, payFeesIn } = taskArguments;
        const tokensToSendDetails: TokenAmounts[] = JSON.parse(tokenAmounts);
        
        const [signer] = await hre.ethers.getSigners();

        const routerAddress = taskArguments.router ? taskArguments.router : getRouterConfig(hre.network.name).address;
        const targetChainSelector = getRouterConfig(destinationBlockchain).chainSelector;

        const router = IRouterClient__factory.connect(routerAddress, hre.ethers.provider);
        const supportedTokens = await router.getSupportedTokens(targetChainSelector);

        const spinner: Spinner = new Spinner();

        for (let i = 0; i < tokensToSendDetails.length; i++) {
            const { token, amount } = tokensToSendDetails[i];

            console.log(`ℹ️  Checking whether the ${token} token is supported by Chainlink CCIP on the ${hre.network.name} blockchain`);
            spinner.start();

            if (!supportedTokens.includes(token)) {
                spinner.stop();
                console.error(`❌ Token address ${token} not in the list of supportedTokens ${supportedTokens}`);
                return 1;
            }

            spinner.stop();
            console.log(`✅ Token ${token} is supported by Chainlink CCIP on the ${hre.network.name} blockchain`);

            const tokenToSend: IERC20 = IERC20__factory.connect(token, signer);

            console.log(`ℹ️  Attempting to approve the BasicTokenSender smart contract (${basicTokenSenderAddress}) to spend ${amount} of ${token} tokens on behalf of ${signer.address}`);
            spinner.start();

            const approvalTx = await tokenToSend.approve(basicTokenSenderAddress, amount);
            await approvalTx.wait();

            spinner.stop();
            console.log(`✅ Approved successfully, transaction hash: ${approvalTx.hash}`);
        }

        const basicTokenSender: BasicTokenSender = BasicTokenSender__factory.connect(basicTokenSenderAddress, signer)

        const fees = getPayFeesIn(payFeesIn);

        console.log(`ℹ️  Attempting to send tokens [${tokensToSendDetails.map(t => t.token)}] from the BasicTokenSender smart contract (${basicTokenSenderAddress}) from ${hre.network.name} to ${receiver} on the ${destinationBlockchain}`);
        spinner.start();

        const sendTx = await basicTokenSender.send(targetChainSelector, receiver, tokensToSendDetails, fees)
        const receipt = await sendTx.wait();

        spinner.stop();
        console.log(`✅ Tokens sent, transaction hash: ${sendTx.hash}`);

        await getCcipMessageId(sendTx, receipt, hre.ethers.provider);
    })