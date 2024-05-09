import { network } from "hardhat";
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import MyNFTModule from "./MyNFTModule";
import { getRouterConfig } from "../../../utils/configs";

export default buildModule("DestinationMinterModule", (m) => {
    const router = getRouterConfig(network.name).address;
    const { myNft } = m.useModule(MyNFTModule);
    const destinationMinter = m.contract("DestinationMinter", [router, myNft]);

    m.call(myNft, "transferOwnership", [destinationMinter]);

    return { destinationMinter };
});