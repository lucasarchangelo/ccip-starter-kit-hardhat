import { network } from "hardhat";
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { getRouterConfig } from "../../../utils/configs";

export default buildModule("SourceMinterModule", (m) => {
    const router: any = getRouterConfig(network.name).address;
    const token: any = getRouterConfig(network.name).feeTokens[0];

    const sourceMinter = m.contract("SourceMinter", [router, token]);

    return { sourceMinter };
});