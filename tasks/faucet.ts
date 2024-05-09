import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { getFaucetTokensAddresses } from "../utils/configs";
import { BurnMintERC677Helper__factory } from "../typechain-types";
import { Spinner } from "../utils/spinner";

enum FaucetTokens {
    CCIP_BNM = 'CCIP-BnM',
    CCIP_LNM = 'CCIP-LnM'
}

task(`faucet`, `Mints 10**18 units of CCIP-BnM and CCIP-LnM tokens to receiver address`)
    .addParam(`receiver`, `The address to receive tokens`)
    .addOptionalParam(`tokenName`, `You can choose if you need CCIP-BnM or CCIP-LnM {ethereumSepolia Only}`)
    .setAction(async (taskArguments: TaskArguments, hre: HardhatRuntimeEnvironment) => {
        const { receiver, tokenName } = taskArguments;

        if (tokenName !== FaucetTokens.CCIP_BNM && tokenName !== FaucetTokens.CCIP_LNM) {
            throw new Error(`Invalid token name, please choose from 'CCIP-BnM' or 'CCIP-LnM'`);
        }

        if (tokenName === FaucetTokens.CCIP_LNM && hre.network.name !== `ethereumSepolia`) {
            throw new Error(`CCIP-LnM tokens can be minted only on Ethereum Sepolia testnet`);
        }

        const tokenAddress = tokenName === FaucetTokens.CCIP_BNM ? getFaucetTokensAddresses(hre.network.name).ccipBnM : getFaucetTokensAddresses(hre.network.name).ccipLnM;
        const [signer] = await hre.ethers.getSigners();

        const spinner = new Spinner();

        console.log(`ℹ️  Attempting to mint 10**18 units of token (${tokenAddress}) on ${hre.network.name} blockchain`);
        spinner.start();

        const tokenInstance = BurnMintERC677Helper__factory.connect(tokenAddress, signer);
        const tx = await tokenInstance.drip(receiver);
        await tx.wait();

        spinner.stop();
        console.log(`✅ Tokens minted, transaction hash: ${tx.hash}`);
        console.log(`✅ Task faucet finished with the execution`);
    })