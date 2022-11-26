import OrbitDB from "orbit-db";
import { createContext } from "react";
import { IPFS } from "ipfs"
import DocumentStore from "orbit-db-docstore";
import { OrderWrapperInterface } from "orders/orders";

const OrbitContext = createContext<{
    orbit: OrbitDB | null,
    ipfs: IPFS | null,
    orbitdb: {
        db: DocumentStore<OrderWrapperInterface> | null;
        records: OrderWrapperInterface[];
        addRecord: (record: OrderWrapperInterface) => void;
        queryRecord: (mapper: (doc: OrderWrapperInterface) => void) => OrderWrapperInterface[]

    } | null
}>({ orbit: null, ipfs: null, orbitdb: null });

export default OrbitContext;
