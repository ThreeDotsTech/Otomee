import { id } from "ethers/lib/utils";
export function encodeFunctionSignature(functionSignature:string) {
    return id(functionSignature).substring(0,10)
}