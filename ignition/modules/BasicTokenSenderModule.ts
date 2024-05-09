import { network } from "hardhat";
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { getRouterConfig } from "../../utils/configs";

export default buildModule("BasicTokenSenderModule", (m) => {
    const router: any = getRouterConfig(network.name).address;
    const token: any = getRouterConfig(network.name).feeTokens[0];

    const tokenSender = m.contract("BasicTokenSender", [router, token]);

    return { tokenSender };
});