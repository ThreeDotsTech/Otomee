import OrbitDB from "orbit-db";
import DocumentStore from "orbit-db-docstore";
import KeyValueStore from "orbit-db-kvstore";
import Store from "orbit-db-store";
import { useEffect, useState, useContext } from "react";
import { OrderInterface } from "orders/types";

import OrbitContext from "./orbitContext";

const publicRead = (orbitdb: any) => ({
  accessController: {
    write: [orbitdb.identity.id],
  },
});

const publicWrite = () => ({
  accessController: {
    write: ["*"],
    admin: ["*"],
  },
});

function useCreateOrbitDb(address: string, options: IOpenOptions = {}): {
  orbit: OrbitDB | null
  db: DocumentStore<any> | KeyValueStore<any> | null,
  records: any[],
  addRecord: (record: OrderInterface) => void
  //getRecordBy_id: (tokenID: number) => Order
  //Lo que regresa cada función
} {
  const { orbit, ipfs } = useContext(OrbitContext);
  const [records, setRecords] = useState<any[]>([]);
  const [db, setDb] = useState<DocumentStore<any> | KeyValueStore<any>>();

  function addRecord(record: any) {
    console.log('Adding a record to:')
    console.log(db)
    if (db instanceof KeyValueStore) {
      db.put(record.key, record.value)
    } else if (db instanceof DocumentStore) {
      db.put(record)
    }
  }


  function getRecordByIndex(index: string) {
    let result
    if (db instanceof KeyValueStore) {
      result = db.get(index)
    }
    else if (db instanceof DocumentStore) {
      result = db.get(index)
    }
    return result
  }


  useEffect(() => {
    if (!orbit) {
      console.log('No orbit instance')
      return
    }
    if (!ipfs) {
      return
    }
    if (db) return;
    if (!address) return;


    const allOptions = {
      overwrite: true,

      ...options,
      // options.public controls write access
      ...(options.create
        ? publicWrite()
        : publicRead(orbit)),
    };

    console.log("Creating database: " + address);

    orbit.create('orderbook', 'docstore', {
      accessController: {
        write: ["*"],
      }
    }).then((newDb: Store) => {
      function refreshDb() {
        console.log('Refreshing:')
        newDb && newDb.load().then(() => {
          if (newDb instanceof KeyValueStore) {
            setRecords({ ...(newDb.all || {}) });
          } else if (newDb instanceof DocumentStore) {
            setRecords(newDb.query(() => true));
          }
        });
      }

      function isDocstore(db: Store | KeyValueStore<any> | DocumentStore<any>): db is DocumentStore<any> {
        return (db as DocumentStore<any>).query !== undefined;
      }

      function isKeyValue(db: Store | KeyValueStore<any> | DocumentStore<any>): db is KeyValueStore<any> {
        return (db as KeyValueStore<any>).all !== undefined;
      }

      if (isDocstore(newDb)) {
        //Saving db as DocumentStore
        setDb(newDb as DocumentStore<any>)
      } else if (isKeyValue(newDb)) {
        //Saving db as KeyValueStore
        setDb(newDb as KeyValueStore<any>)
      } else {
        throw Error('DB type not supported')
      }

      setInterval(() => {
        ipfs.swarm.peers().then((networkPeers: any) => {
          ipfs.pubsub.peers(newDb.address.toString()).then((dbPeers: any) => {
            console.log("Peers: ", dbPeers.length, '/', networkPeers.length)
          })
        })
      }, 5000)

      console.log("orbitdb.opened: " + newDb.address.toString());


      newDb.events.on("replicate", (address: string) => {
        console.log("db.events.replicate: " + address.toString());
        //refreshDb();
      });

      newDb.events.on("replicated", (address: string) => {
        console.log("db.events.replicated: " + address.toString());
        refreshDb();
      });

      newDb.events.on("write", (address: string) => {
        console.log("db.events.write: " + address.toString());
        refreshDb();
      });

    });

    return () => {
      if (db) {
        console.log("db.close()");
        //db.close(); TODO : Checar
      }
    };
  }, [orbit, address, options]);



  return {
    orbit: orbit,
    db: db ?? null,
    records: records,
    addRecord: addRecord,
    //getRecordBy_id: records
  };
}

export default useCreateOrbitDb;