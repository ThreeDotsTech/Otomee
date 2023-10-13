import { IPFS } from "ipfs";
import OrbitDB from "orbit-db";
import DocumentStore from "orbit-db-docstore";
import Store from "orbit-db-store";
import { useEffect, useMemo, useState } from "react";

function useOrbitDb<T>(address: string, options: IStoreOptions = {}, orbit: OrbitDB | undefined, ipfs: IPFS | null): {
  db: DocumentStore<T> | null,
  records: T[],
  addRecord: (record: T) => void
  queryRecord: (mapper: (doc: T) => void) => T[]
} {
  const [records, setRecords] = useState<T[]>([]);
  const [db, setDb] = useState<DocumentStore<T> | null>(null);
  const [tries, setTries] = useState<number>(0)
  const [initializeTimestamp, setinitializeTimestamp] = useState<number>(Number.MAX_SAFE_INTEGER)


  function addRecord(record: T, key?: string) {
    if (!db) throw new Error("Database not defined.");
    db.put(record)
  }

  function queryRecord(mapper: (doc: T) => void): T[] {
    if (!db) throw new Error("Database not defined.");
    const result = (db as DocumentStore<T>).query(mapper)
    return result
  }



  useEffect(() => {
    if (!orbit || !ipfs) return;
    if (db) return;

    console.log("Opening database: " + address);

    orbit.open(address, options).then((newDb: Store) => {
      setinitializeTimestamp(Date.now())

      function refreshDb() {
        newDb && newDb.load().then(() => {
          setRecords((newDb as DocumentStore<T>).query(() => true));
        });
      }

      // function isDocstore(db: Store): db is DocumentStore<T> {
      //   return (db as DocumentStore<T>).query !== undefined;
      // }
      setDb(newDb as DocumentStore<T>)

      console.log("orderbook database opened");

      setInterval(() => {
        ipfs.swarm.peers().then((networkPeers: any) => {
          ipfs.pubsub.peers(newDb.address.toString()).then((dbPeers: any) => {
            console.log("Peers: ", dbPeers.length, '/', networkPeers.length, dbPeers)
            console.log(networkPeers)
            if (dbPeers.length == 0) {
              //console.log('No swarm peers for more than ', tries * 10, ' seconds')
              setTries(prevState => prevState + 1)
            } else {
              setTries(0)
            }
          })
        })
      }, 10000)

      newDb.events.on("replicate", (address: string) => {
        //refreshDb();
      });

      newDb.events.on("replicated", (address: string) => {
        refreshDb()
      });

      newDb.events.on("write", (address: string) => {
        refreshDb()
      });

      refreshDb()

    });

    return () => {
      if (db) {
        console.log("db.close()");
        //db.close(); TODO : Checar
      }
    };
  }, [orbit, db, ipfs, address, options, tries]);



  return useMemo(() => {
    return ({
      db: db,
      records: records,
      addRecord,
      queryRecord
    })
  }, [addRecord, db, records]);
}

export default useOrbitDb;
