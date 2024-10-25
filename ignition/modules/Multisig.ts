import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MultisigModule = buildModule("MultisigModule", (m) => {
  const multisig = m.contract("MultiSig");
 
  return { multisig };
  
});

export default MultisigModule;

