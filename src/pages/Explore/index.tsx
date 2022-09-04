
import Store from 'orbit-db-store';
import AppBody from 'pages/AppBody';
import React, { useContext, useEffect } from 'react'
import OrbitContext from 'state/orbitdb/orbitContext';



const Explore = () => {
    const orbit = useContext(OrbitContext)
    useEffect(() => {
        if (!orbit.orbit) return
        orbit.orbit.docstore('otomee-orderbook-alpha.v0', { indexBy: 'hash', accessController: { write: ['*'] } } as IStoreOptions).then((store: Store) => console.log('db created:', store.address.toString()))

    }, [orbit.orbit])
    return (
        <AppBody>
            <div>

            </div>
        </AppBody>
    );
};

export default Explore
