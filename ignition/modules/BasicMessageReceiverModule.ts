import { network } from "hardhat";
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { getRouterConfig } from "../../utils/configs";

export default buildModule("BasicMessageReceiverModule", (m) => {
    const router = getRouterConfig(network.name).address;
    const basicMessageReceiver = m.contract("BasicMessageReceiver", [router]);

    return { basicMessageReceiver };
});