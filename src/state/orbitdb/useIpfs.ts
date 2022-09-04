import { useEffect, useState } from "react";
import Multiaddr from 'multiaddr'

import * as IPFS from "ipfs";


function useIpfs(config: any): { ipfs: IPFS.IPFS | null } {
  const [ipfs, setIpfs] = useState<IPFS.IPFS>();

  useEffect(() => {
    if (!ipfs) {
      console.log('Initializing IPFS...')
      // window.ipfsLoaded hack to keep a global ipfs instance
      if (window?.ipfsLoaded) {
        console.log('Saved IPFS instance found; loaded.')
        setIpfs(window.ipfsLoaded);
        return;
      } else {
        IPFS.create(config).then((newIPFS: IPFS.IPFS) => {
          if (typeof window !== "undefined") window.ipfsLoaded = newIPFS;
          console.log("IPFS initialized.");
          newIPFS.swarm.connect(Multiaddr('/dns4/ipfs.otomee.com/tcp/4002/wss/p2p/12D3KooWLqkemDeZKr2AcCQZAQRS2L5tgWRbp2cJUzHPdTSuyVSH'))
            .then(() => console.log('Connected with Otomee ipfs bootstrap node'))
            .catch((reason: any) => console.error('Failed to connect with Otomee ipfs bootstrap node', reason))
          newIPFS.id().then((id: any) => {
            console.log("IPFS: Connected as ", id);
            setIpfs(newIPFS)
          })
        });
      }

    }
    return () => {
      if (ipfs) {
        console.log("ipfs.stop()");
        ipfs.stop();
      }
    };
  }, [ipfs, config]);

  return { ipfs: ipfs ?? null };
}

export default useIpfs;
