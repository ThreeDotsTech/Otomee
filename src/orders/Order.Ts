import { OrderInterface } from "./types"

export class Order implements OrderInterface {

    expirationTime: number
    listingTime: number
    maker: string
    maximumFill: number
    registry: string
    salt: string
    staticExtradata: string
    staticSelector: string
    staticTarget: string

    constructor() { }

    setExpirationTime(expirationTime: number) {
        this.expirationTime = expirationTime;
        return this;
    }

    setListingTime(listingTime: number) {
        this.listingTime = listingTime;
        return this;
    }

    setMaker(maker: string) {
        this.maker = maker;
        return this;
    }

    setMaximumFill(maximumFill: number) {
        this.maximumFill = maximumFill;
        return this;
    }

    setRegistry(registry: string) {
        this.registry = registry;
        return this;
    }

    setSalt(salt: string) {
        this.salt = salt;
        return this;
    }

    setStaticExtradata(staticExtradata: string) {
        this.staticExtradata = staticExtradata;
        return this;
    }

    setStaticSelector(staticSelector: string) {
        this.staticSelector = staticSelector;
        return this;
    }

    setStaticTarget(staticTarget: string) {
        this.staticTarget = staticTarget;
        return this;
    }
}