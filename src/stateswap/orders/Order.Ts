import { randomBytes } from "ethers/lib/utils"
import { ArrayToNumber } from "utils"
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

    constructor() {
        this.expirationTime = -1;
        this.listingTime = -1;
        this.maker = "";
        this.maximumFill = -1;
        this.registry = '';
        this.salt = ArrayToNumber(randomBytes(31))._hex;
        this.staticExtradata = "";
        this.staticSelector = "";
        this.staticTarget = "";
    }

    setExpirationTime(expirationTime: number) {
        this.expirationTime = expirationTime;
        return this;
    }

    setListingTime(listingTime: number) {
        this.listingTime = listingTime;
        return this;
    }

    setMaker(maker: string) {
        this.maker = maker.toLowerCase();
        return this;
    }

    setMaximumFill(maximumFill: number) {
        this.maximumFill = maximumFill;
        return this;
    }

    setRegistry(registry: string) {
        this.registry = registry.toLowerCase();
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
        this.staticTarget = staticTarget.toLowerCase();
        return this;
    }
}