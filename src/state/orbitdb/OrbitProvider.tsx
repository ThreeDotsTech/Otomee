import React, { useEffect, useState } from "react";

import DEFAULT_IPFS_CONFIG from "./ipfs-config";
import useIpfs from "./useIpfs";
import useOrbit from "./useOrbit";
import OrbitContext from "./orbitContext";
import OrbitDB from "orbit-db";
import { IPFS } from "ipfs"
import { OrderWrapper } from "types/orders";
import { useOrbitDb } from ".";
import DocumentStore from "orbit-db-docstore";
import { MAIN_ORBITDB_ADDRESSS } from "constants/orbitAddresses";

const OrbitProvider = ({ children, config = DEFAULT_IPFS_CONFIG, ...props }: { config?: any, children: React.ReactNode }) => {
  const { ipfs } = useIpfs(config);
  const { orbit } = useOrbit(ipfs);
  const orbitdb = useOrbitDb<OrderWrapper>(MAIN_ORBITDB_ADDRESSS, { indexBy: "hash" } as IStoreOptions, orbit, ipfs);
  const [value, setValue] = useState<{
    orbit: OrbitDB | null,
    ipfs: IPFS | null,
    orbitdb: {
      db: DocumentStore<OrderWrapper> | null;
      records: OrderWrapper[];
      addRecord: (record: OrderWrapper) => void;
      queryRecord: (mapper: (doc: OrderWrapper) => void) => OrderWrapper[]
    } | null
  }>({ orbit: null, ipfs: null, orbitdb: null });

  const { Provider } = OrbitContext;

  useEffect(() => {
    if (ipfs && orbit) {
      //This wil run once, once IPFS and orbit have been initialized.
      setValue({ orbit, ipfs, orbitdb });
    }
  }, [ipfs, orbit, orbitdb.db?.address, orbitdb.records]);

  return <Provider value={value} {...props} >{children}</Provider>;
};


export default OrbitProvider;
