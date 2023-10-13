import { useEffect, useState } from "react";
import { multiaddr } from '@multiformats/multiaddr'
import * as IPFS from 'ipfs-core'
import * as IPFSTypes from 'ipfs-core-types'


function useIpfs(config: any): { ipfs: IPFSTypes.IPFS | null } {
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
        IPFS.create(config).then((newIPFS) => {
          if (typeof window !== "undefined") window.ipfsLoaded = newIPFS;
          console.log("IPFS initialized.");
          newIPFS.swarm.connect(multiaddr('/dns4/ipfs.otomee.com/tcp/4003/wss/p2p/QmWDLjWxkGP3y9eb9hTc2maFmBBAGnrtxZhoLhPP5gaNGD'))
            .then(() => {
              console.log('Connected with Otomee ipfs bootstrap node')
              setIpfs(newIPFS)
            }
            )
            .catch((reason: any) => console.error('Failed to connect with Otomee ipfs bootstrap node', reason))
          newIPFS.id().then((id: any) => {
            console.log("IPFS: Connected as ", id['id']);

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
