import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import { NetworkContextName } from './constants/misc'
import './index.css';
import App from './pages/App';
import reportWebVitals from './reportWebVitals';
import getLibrary from './utils/getLibrary'
import store from './state'
import ThemeProvider, { ThemedGlobalStyle } from 'theme'
import RadialGradientByChainUpdater from 'theme/RadialGradientByChainUpdater'
import ApplicationUpdater from 'state/application/updater'
import MulticallUpdater from 'state/multicall/updater'
import { Provider as UrqlProvider } from 'urql'
import { client as UrqlClient } from 'hooks/useUrql'
import { OrbitProvider } from 'state/orbitdb'
import DEFAULT_IPFS_CONFIG from "state/orbitdb/ipfs-config";

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

function Updaters() {
  return (
    <>
      <RadialGradientByChainUpdater />
      <ApplicationUpdater />
      <RadialGradientByChainUpdater />
      <MulticallUpdater />
    </>
  )
}



ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
      <HashRouter>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Web3ProviderNetwork getLibrary={getLibrary}>
            <OrbitProvider config={DEFAULT_IPFS_CONFIG}>
              <>
                <Updaters />
                <ThemeProvider>
                  <ThemedGlobalStyle />
                  <UrqlProvider value={UrqlClient}>
                    <App />
                  </UrqlProvider>
                </ThemeProvider>
              </>
            </OrbitProvider>
          </Web3ProviderNetwork>
        </Web3ReactProvider>
      </HashRouter>
    </Provider>
  </StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
