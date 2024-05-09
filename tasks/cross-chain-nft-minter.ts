import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { getPayFeesIn, getRouterConfig } from "../utils/configs";
import { Spinner } from "../utils/spinner";

task(`cross-chain-mint-v2`, `Mints the new NFT by sending the Cross-Chain Message`)
    .addParam(`sourceMinter`, `The address of the SourceMinter.sol smart contract`)
    .addParam(`destinationBlockchain`, `The name of the destination blockchain (for example polygonMumbai)`)
    .addParam(`destinationMinter`, `The address of the DestinationMinter.sol smart contract on the destination blockchain`)
    .addParam(`payFeesIn`, `Choose between 'Native' and 'LINK'`)
    .setAction(async (taskArguments: TaskArguments, hre: HardhatRuntimeEnvironment) => {
        
        const { sourceMinter, destinationBlockchain, destinationMinter, payFeesIn } = taskArguments;
        const [signer] = await hre.ethers.getSigners();

        const sourceMinterInstance = await hre.ethers.getContractAt("SourceMinter", sourceMinter, signer);
        const destinationChainSelector = getRouterConfig(destinationBlockchain).chainSelector;
        const fees = getPayFeesIn(payFeesIn);
        const spinner: Spinner = new Spinner();

        console.log(`ℹ️  Attempting to call the mint function of the SourceMinter.sol smart contract on the ${hre.network.name} from ${signer.address} account`);
        spinner.start();

        const tx = await sourceMinterInstance.mint(
            destinationChainSelector,
            destinationMinter,
            fees
        );

        await tx.wait();

        spinner.stop();
        console.log(`✅ Mint request sent, transaction hash: ${tx.hash}`);
        console.log(`✅ Task cross-chain-mint finished with the execution`);
    })

    task('cross-chain-mint-balance-of-v2', 'Gets the balance of MyNFTs for provided address')
    .addParam(`nftAddress`, `The address of the MyNFT.sol smart contract`)
    .addParam(`owner`, `The address to check the balance of MyNFTs`)
    .setAction(async (taskArguments: TaskArguments, hre: HardhatRuntimeEnvironment) => {
        
        const { nftAddress, owner } = taskArguments;
        const myNFTInstance = await hre.ethers.getContractAt("MyNFT", nftAddress);
        const spinner: Spinner = new Spinner();

        console.log(`ℹ️  Attempting to check the balance of MyNFTs (${nftAddress}) for the ${owner} account`);
        spinner.start();

        const balanceOf = await myNFTInstance.balanceOf(owner);

        spinner.stop();
        console.log(`ℹ️  The balance of MyNFTs of the ${owner} account is ${balanceOf.toString()}`);
    })