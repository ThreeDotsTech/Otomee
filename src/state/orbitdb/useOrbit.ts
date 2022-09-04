import { useEffect, useState } from "react";
import OrbitDB from "orbit-db";
import { useActiveWeb3React } from "hooks/web3";
import Identities, { Identity } from "orbit-db-identity-provider";
//TODO: Rework Orbit's Ethereum Identity to implement EIP-4361 (Sign in with Ethereum)
import { useWeb3React } from "@web3-react/core";

function useOrbit(ipfs: any): { orbit: OrbitDB | undefined } {
  const [orbit, setOrbit] = useState<OrbitDB>();
  const { library } = useActiveWeb3React()
  const wallet = library?.getSigner() 
  const { active, account } = useWeb3React()

  useEffect(() => {

    if (!ipfs) return

    //Stop any running orbit instances
    if (orbit && orbit.stop) {
      console.log("orbit.stop()");
      orbit.stop();
    }

    //Try to create orbit instance with ethereum identity.
    //If no wallet exists, a random private key will be
    //generated. (This private key won't be used anywhere)
    Identities.createIdentity({
      type: "ethereum",
      wallet: active ? wallet : undefined,
    }).then((identity: Identity) =>{

      if(!active) console.log('Creating Orbitdb instance with throwaway private key')

      OrbitDB.createInstance(ipfs, {identity}).then((newOrbit: OrbitDB) => {
        console.log('Orbitdb instance created.')
        setOrbit(newOrbit)
      });

    }).catch((reason:any)=>{
      if (reason.code == 4001) { //User denied message signature.
        Identities.createIdentity({
          type: "ethereum",
          wallet: undefined,
        }).then((identity: Identity) =>{

          console.log('Creating Orbitdb instance with throwaway private key')

          OrbitDB.createInstance(ipfs, {identity}).then((newOrbit: OrbitDB) => {
            console.log('Orbitdb instance created. ')
            setOrbit(newOrbit)
          });
        })
      }
    })
    
    
    return () => {
      if (orbit && orbit.stop) {
        console.log("orbit.stop()");
        orbit.stop();
      }
    };
  }, [ipfs, active, account]);
  return { orbit: orbit };
}

export default useOrbit;
