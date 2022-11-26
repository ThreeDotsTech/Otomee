import { Signature } from "ethers";
import { CallInterface, OrderInterface, OrderType, OrderWrapperInterface } from "./orders";

export class OrderWrapper implements OrderWrapperInterface {

    call: CallInterface | undefined
    collection: string | undefined
    hash: string | undefined
    maker: string | undefined
    order: OrderInterface | undefined
    price: string | undefined
    signature: Signature | undefined
    target: string | undefined
    type: OrderType | undefined

    constructor() { }

    setCall(call: CallInterface) {
        this.call = call;
        return this;
    }

    setCollection(collection: string) {
        this.collection = collection;
        return this;
    }

    setHash(hash: string) {
        this.hash = hash;
        return this;
    }

    setMaker(maker: string) {
        this.maker = maker;
        return this;
    }

    setOrder(order: OrderInterface) {
        this.order = order;
        return this;
    }

    setPrice(price: string) {
        this.price = price;
        return price;
    }

    setSignature(signature: Signature) {
        this.signature = signature;
        return this
    }

    setTarget(target: string) {
        this.target = target;
        return this;
    }

    setType(type: OrderType) {
        this.type = type;
        return this;
    }

}