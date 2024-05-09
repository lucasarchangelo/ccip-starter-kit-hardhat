/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../../../../../../../../common";
import type {
  ConfirmedOwnerWithProposal,
  ConfirmedOwnerWithProposalInterface,
} from "../../../../../../../../artifacts/@chainlink/contracts-ccip/src/v0.8/shared/access/ConfirmedOwnerWithProposal";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
      {
        internalType: "address",
        name: "pendingOwner",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "OwnershipTransferRequested",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "acceptOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b50604051610a50380380610a50833981810160405281019061003291906102bb565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036100a1576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161009890610358565b60405180910390fd5b816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614610125576101248161012c60201b60201c565b5b50506103e4565b3373ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff160361019a576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610191906103c4565b60405180910390fd5b80600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508073ffffffffffffffffffffffffffffffffffffffff1660008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167fed8889f560326eb138920d842192f0eb3dd22b4f139c87a2c57538e05bae127860405160405180910390a350565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006102888261025d565b9050919050565b6102988161027d565b81146102a357600080fd5b50565b6000815190506102b58161028f565b92915050565b600080604083850312156102d2576102d1610258565b5b60006102e0858286016102a6565b92505060206102f1858286016102a6565b9150509250929050565b600082825260208201905092915050565b7f43616e6e6f7420736574206f776e657220746f207a65726f0000000000000000600082015250565b60006103426018836102fb565b915061034d8261030c565b602082019050919050565b6000602082019050818103600083015261037181610335565b9050919050565b7f43616e6e6f74207472616e7366657220746f2073656c66000000000000000000600082015250565b60006103ae6017836102fb565b91506103b982610378565b602082019050919050565b600060208201905081810360008301526103dd816103a1565b9050919050565b61065d806103f36000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c806379ba5097146100465780638da5cb5b14610050578063f2fde38b1461006e575b600080fd5b61004e61008a565b005b61005861021f565b6040516100659190610459565b60405180910390f35b610088600480360381019061008391906104a5565b610248565b005b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461011a576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101119061052f565b60405180910390fd5b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506000600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055503373ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a350565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b61025061025c565b610259816102ec565b50565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146102ea576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102e19061059b565b60405180910390fd5b565b3373ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff160361035a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161035190610607565b60405180910390fd5b80600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508073ffffffffffffffffffffffffffffffffffffffff1660008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167fed8889f560326eb138920d842192f0eb3dd22b4f139c87a2c57538e05bae127860405160405180910390a350565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061044382610418565b9050919050565b61045381610438565b82525050565b600060208201905061046e600083018461044a565b92915050565b600080fd5b61048281610438565b811461048d57600080fd5b50565b60008135905061049f81610479565b92915050565b6000602082840312156104bb576104ba610474565b5b60006104c984828501610490565b91505092915050565b600082825260208201905092915050565b7f4d7573742062652070726f706f736564206f776e657200000000000000000000600082015250565b60006105196016836104d2565b9150610524826104e3565b602082019050919050565b600060208201905081810360008301526105488161050c565b9050919050565b7f4f6e6c792063616c6c61626c65206279206f776e657200000000000000000000600082015250565b60006105856016836104d2565b91506105908261054f565b602082019050919050565b600060208201905081810360008301526105b481610578565b9050919050565b7f43616e6e6f74207472616e7366657220746f2073656c66000000000000000000600082015250565b60006105f16017836104d2565b91506105fc826105bb565b602082019050919050565b60006020820190508181036000830152610620816105e4565b905091905056fea26469706673582212201133b4d8ab9c1339e535c1a5f475b67dff6ef6d88507771416be4faa7526c24864736f6c63430008180033";

type ConfirmedOwnerWithProposalConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ConfirmedOwnerWithProposalConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ConfirmedOwnerWithProposal__factory extends ContractFactory {
  constructor(...args: ConfirmedOwnerWithProposalConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    newOwner: AddressLike,
    pendingOwner: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(newOwner, pendingOwner, overrides || {});
  }
  override deploy(
    newOwner: AddressLike,
    pendingOwner: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(newOwner, pendingOwner, overrides || {}) as Promise<
      ConfirmedOwnerWithProposal & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(
    runner: ContractRunner | null
  ): ConfirmedOwnerWithProposal__factory {
    return super.connect(runner) as ConfirmedOwnerWithProposal__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ConfirmedOwnerWithProposalInterface {
    return new Interface(_abi) as ConfirmedOwnerWithProposalInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): ConfirmedOwnerWithProposal {
    return new Contract(
      address,
      _abi,
      runner
    ) as unknown as ConfirmedOwnerWithProposal;
  }
}
