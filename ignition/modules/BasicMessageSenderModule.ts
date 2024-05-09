import { network } from "hardhat";
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { getRouterConfig } from "../../utils/configs";

export default buildModule("BasicMessageSenderModule", (m) => {
    const router: any = getRouterConfig(network.name).address;
    const token: any = getRouterConfig(network.name).feeTokens[0];

    const sourceMinter = m.contract("BasicMessageSender", [router, token]);

    return { sourceMinter };
});