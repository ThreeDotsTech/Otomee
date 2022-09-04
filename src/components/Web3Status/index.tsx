// eslint-disable-next-line no-restricted-imports
import { AbstractConnector } from '@web3-react/abstract-connector'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { darken } from 'polished'
import { useMemo } from 'react'
import { Activity } from 'react-feather'
import styled, { css } from 'styled-components/macro'

import { NetworkContextName } from '../../constants/misc'
import useENSName from '../../hooks/useENSName'
import { useWalletModalToggle } from '../../state/application/hooks'
import { isTransactionRecent, useAllTransactions } from '../../state/transactions/hooks'
import { TransactionDetails } from '../../state/transactions/reducer'
import { shortenAddress } from '../../utils'
import { ButtonSecondary } from '../Button'
import StatusIcon from '../Identicon/StatusIcon'
import Loader from '../Loader'
import { RowBetween } from '../Row'
import WalletModal from '../WalletModal'

const IconWrapper = styled.div<{ size?: number }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  & > * {
    height: ${({ size }) => (size ? size + 'px' : '32px')};
    width: ${({ size }) => (size ? size + 'px' : '32px')};
  }
`

const Web3StatusGeneric = styled(ButtonSecondary)`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  align-items: center;
  padding: 0.5rem;
  border-radius: 12px;
  cursor: pointer;
  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  user-select: none;
  :focus {
    outline: none;
  }
`
const Web3StatusError = styled(Web3StatusGeneric)`
  background-color: ${({ theme }) => theme.red1};
  border: 1px solid ${({ theme }) => theme.red1};
  color: ${({ theme }) => theme.white};
  font-weight: 500;
  :hover,
  :focus {
    background-color: ${({ theme }) => darken(0.1, theme.red1)};
  }
`

const Web3StatusConnect = styled(Web3StatusGeneric) <{ faded?: boolean }>`
  font-weight: 500;
  ${({ faded }) =>
    faded &&
    css`
      background-color: transparent;
      border: 1px solid ${({ theme }) => theme.primary5};
      color: ${({ theme }) => theme.primaryText1};
    `}
`

const Web3StatusConnected = styled(Web3StatusGeneric) <{ pending?: boolean }>`
  background-color: transparent;
  border: 1px solid ${({ pending, theme }) => (pending ? theme.primary1 : theme.bg1)};
  color: ${({ pending, theme }) => (pending ? theme.white : theme.primaryText1)};
  font-weight: 500;
  :hover,
  :focus {
    border: 1px solid ${({ theme }) => darken(0.05, theme.bg3)};

    :focus {
      border: 1px solid ${({ pending, theme }) => (pending ? darken(0.1, theme.primary1) : darken(0.1, theme.bg2))};
    }
  }
`

const Text = styled.p`
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 0.5rem 0 0.25rem;
  font-size: 1rem;
  width: fit-content;
  font-weight: 500;
`

const NetworkIcon = styled(Activity)`
  margin-left: 0.25rem;
  margin-right: 0.5rem;
  width: 16px;
  height: 16px;
`

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}


function WrappedStatusIcon({ connector }: { connector: AbstractConnector }) {
  return (
    <IconWrapper size={30}>
      <StatusIcon connector={connector} />
    </IconWrapper>
  )
}

function Web3StatusInner() {
  const { account, connector, error } = useWeb3React()

  const { ENSName } = useENSName(account ?? undefined)

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter((tx) => !tx.receipt).map((tx) => tx.hash)

  const hasPendingTransactions = !!pending.length
  const toggleWalletModal = useWalletModalToggle()

  if (account) {
    return (
      <Web3StatusConnected id="web3-status-connected" onClick={toggleWalletModal} pending={hasPendingTransactions}>
        {hasPendingTransactions ? (
          <RowBetween>
            <Text>
              {pending?.length} Pending
            </Text>{' '}
            <Loader stroke="white" />
          </RowBetween>
        ) : (
          <>
            <Text>{ENSName || shortenAddress(account)}</Text>
          </>
        )}
        {!hasPendingTransactions && connector && <WrappedStatusIcon connector={connector} />}
      </Web3StatusConnected>
    )
  } else if (error) {
    return (
      <Web3StatusError onClick={toggleWalletModal}>
        <NetworkIcon />
        <Text>{error instanceof UnsupportedChainIdError ? <Text>Wrong Network</Text> : <Text>Error</Text>}</Text>
      </Web3StatusError>
    )
  } else {
    return (
      <Web3StatusConnect id="connect-wallet" onClick={toggleWalletModal} faded={!account}>
        <Text>
          Connect Wallet
        </Text>
      </Web3StatusConnect>
    )
  }
}

export default function Web3Status() {
  const { active, account } = useWeb3React()
  const contextNetwork = useWeb3React(NetworkContextName)

  const { ENSName } = useENSName(account ?? undefined)

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter((tx) => !tx.receipt).map((tx) => tx.hash)
  const confirmed = sortedRecentTransactions.filter((tx) => tx.receipt).map((tx) => tx.hash)

  return (
    <>
      <Web3StatusInner />
      {(contextNetwork.active || active) && (
        <WalletModal ENSName={ENSName ?? undefined} pendingTransactions={pending} confirmedTransactions={confirmed} />
      )}
    </>
  )
}
