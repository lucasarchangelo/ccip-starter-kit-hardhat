import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("MyNFTModule", (m) => {
    const ownerAddress = m.getAccount(0);
    const myNft = m.contract("MyNFT", [ownerAddress]);

    return { myNft };
});