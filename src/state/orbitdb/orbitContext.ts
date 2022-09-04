import OrbitDB from "orbit-db";
import { createContext } from "react";
import { IPFS } from "ipfs"
import DocumentStore from "orbit-db-docstore";
import { OrderWrapper } from "types/orders";

const OrbitContext = createContext<{
    orbit: OrbitDB | null,
    ipfs: IPFS | null,
    orbitdb: {
        db: DocumentStore<OrderWrapper> | null;
        records: OrderWrapper[];
        addRecord: (record: OrderWrapper) => void;
        queryRecord: (mapper: (doc: OrderWrapper) => void) => OrderWrapper[]

    } | null
}>({ orbit: null, ipfs: null, orbitdb: null });

export default OrbitContext;
