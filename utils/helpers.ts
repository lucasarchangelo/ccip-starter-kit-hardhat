import { TransactionRequest, ContractTransactionResponse, ContractTransactionReceipt } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

export const getCcipMessageId = async (tx: ContractTransactionResponse, receipt: ContractTransactionReceipt | null, hre: HardhatRuntimeEnvironment) => {
    // Simulate a call to the router to fetch the messageID
    const blockNumber = receipt?.blockNumber? - 1 : 'latest';
    const call: TransactionRequest = {
        from: tx.from,
        to: tx.to,
        data: tx.data,
        gasLimit: tx.gasLimit,
        gasPrice: tx.gasPrice,
        value: tx.value,
        blockTag: blockNumber,
    };

    // Simulate a contract call with the transaction data at the block before the transaction
    const messageId = await hre.ethers.provider.call(call);

    console.log(`✅ You can now monitor the token transfer status via CCIP Explorer (https://ccip.chain.link) by searching for CCIP Message ID: ${messageId}`);
}