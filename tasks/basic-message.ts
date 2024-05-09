import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { getPayFeesIn, getRouterConfig } from "../utils/configs";
import { Spinner } from "../utils/spinner";

task(`send-message-v2`, `Sends basic text messages`)
    .addParam(`sender`, `The address of the BasicMessageSender.sol on the source blockchain`)
    .addParam(`destinationBlockchain`, `The name of the destination blockchain (for example polygonMumbai)`)
    .addParam(`receiver`, `The address of the receiver BasicMessageReceiver.sol on the destination blockchain`)
    .addParam(`message`, `The string message to be sent (for example "Hello, World")`)
    .addParam(`payFeesIn`, `Choose between 'Native' and 'LINK'`)
    .setAction(async (taskArguments: TaskArguments, hre: HardhatRuntimeEnvironment) => {
        const { sender, destinationBlockchain, receiver, message, payFeesIn } = taskArguments;
        const [signer] = await hre.ethers.getSigners();

        const basicMessageSenderInstance = await hre.ethers.getContractAt("BasicMessageSender", sender, signer);
        const spinner: Spinner = new Spinner();

        const destinationChainSelector = getRouterConfig(destinationBlockchain).chainSelector;
        const fees = getPayFeesIn(payFeesIn);

        console.log(`ℹ️  Attempting to send the "${message}" message from the BasicMessageSender smart contract (${sender}) on the ${hre.network.name} blockchain to the BasiceMessageReceiver smart contract (${receiver} on the ${destinationBlockchain} blockchain)`);
        spinner.start();

        const tx = await basicMessageSenderInstance.send(
            destinationChainSelector,
            receiver,
            message,
            fees
        )

        await tx.wait();

        spinner.stop();
        console.log(`✅ Message sent, transaction hash: ${tx.hash}`);
    })

task(`get-message-v2`, `Gets BasicMessageSender latest received message details`)
    .addParam(`receiverAddress`, `The BasicMessageReceiver address`)
    .setAction(async (taskArguments: TaskArguments, hre: HardhatRuntimeEnvironment) => {
        const { receiverAddress } = taskArguments;
        const [signer] = await hre.ethers.getSigners();
        const basicMessageReceiverInstance = await hre.ethers.getContractAt("BasicMessageReceiver", receiverAddress, signer);
        const spinner: Spinner = new Spinner();

        console.log(`ℹ️  Attempting to get the latest received message details from the BasicMessageReceiver smart contract (${receiverAddress}) on the ${hre.network.name} blockchain`);
        spinner.start();

        const latestMessageDetails = await basicMessageReceiverInstance.getLatestMessageDetails();
        spinner.stop();

        console.log(`ℹ️ Latest Message Details:`);
        console.log(`- Message Id: ${latestMessageDetails[0]}`);
        console.log(`- Source Chain Selector: ${latestMessageDetails[1]}`);
        console.log(`- Sender: ${latestMessageDetails[2]}`);
        console.log(`- Message Text: ${latestMessageDetails[3]}`);
    });