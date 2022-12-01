import { Signature } from "ethers";
import { CallInterface, OrderInterface, OrderType, OrderWrapperInterface } from "./types";

export class OrderWrapper implements OrderWrapperInterface {

    call: CallInterface | undefined
    collection: string
    hash: string | undefined
    maker: string
    order: OrderInterface
    price: string
    signature: Signature | undefined
    target: string
    type: OrderType

    constructor(order: OrderInterface) {
        this.collection = ""
        this.maker = order.maker
        this.order = order
        this.price = ""
        this.target = ""
        this.type = OrderType.UNDEFINED_TYPE
    }

    setCall(call: CallInterface) {
        this.call = call;
        return this;
    }

    setCollection(collection: string) {
        this.collection = collection.toLowerCase();
        return this;
    }

    setHash(hash: string) {
        this.hash = hash.toLowerCase();
        return this;
    }

    setPrice(price: string) {
        this.price = price.toLowerCase();
        return price;
    }

    setSignature(signature: Signature) {
        this.signature = signature;
        return this
    }

    setTarget(target: string) {
        this.target = target.toLowerCase();
        return this;
    }

    setType(type: OrderType) {
        this.type = type;
        return this;
    }

    getOrbitDBSafeOrderWrapper() {
        /*When trying to upload to orbitdb
        a class object, it raises an error.
        */

        const order: OrderInterface = {
            expirationTime: this.order.expirationTime,
            listingTime: this.order.listingTime,
            maker: this.order.maker,
            maximumFill: this.order.maximumFill,
            registry: this.order.registry,
            salt: this.order.salt,
            staticExtradata: this.order.staticExtradata,
            staticSelector: this.order.staticSelector,
            staticTarget: this.order.staticTarget
        }

        const orderWrapper: OrderWrapperInterface = {
            call: this.call,
            collection: this.collection,
            hash: this.hash,
            maker: this.maker,
            order: order,
            price: this.price,
            signature: this.signature,
            target: this.target,
            type: this.type,
        }

        return orderWrapper;

    }

}