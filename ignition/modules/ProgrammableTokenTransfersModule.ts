import { network } from "hardhat";
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { getRouterConfig } from "../../utils/configs";

export default buildModule("ProgrammableTokenTransfersModule", (m) => {
    const router: any = getRouterConfig(network.name).address;
    const token: any = getRouterConfig(network.name).feeTokens[0];

    const programmableTokenTransfers = m.contract("ProgrammableTokenTransfers", [router, token]);

    return { programmableTokenTransfers };
});