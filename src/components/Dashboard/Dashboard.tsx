import {useAppKitAccount, useAppKitNetworkCore, useAppKitProvider, type Provider} from "@reown/appkit/react";
import {useCallback, useEffect, useMemo, useState} from "react";
import {BrowserProvider, formatEther} from "ethers";
import {useBalance, useDisconnect, useReadContract, useSwitchChain} from "wagmi";
import styles from "./styles.module.css";
import type {Address} from "viem";
import {WalletConnection} from "../WalletConnection";
import {networks} from "../../config";
import {BallanceDisplay} from "../BallanceDisplay/BallanceDisplay.tsx";
import {CONTRACT_ADDRESSES, CONTRACTS, getContractInfo} from "../../contracts";
import {CreateProposalForm} from "../Forms/createProposalForm.tsx";

export const Dashboard = () => {
    const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
    const [availableAccounts, setAvailableAccounts] = useState<string[]>([]);
    const [userNetwork, setUserNetwork] = useState<number | null>(null);
    const [ethBalance, setEthBalance] = useState<string | null>(null);

    const { walletProvider } = useAppKitProvider<Provider>("eip155");
    const { address, isConnected } = useAppKitAccount();
    const { chainId } = useAppKitNetworkCore();
    const { switchChain } = useSwitchChain();
    const { disconnect } = useDisconnect();




    const [showCreateForm, setShowCreateForm] = useState(false);
    const [canCreateProposal, setCanCreateProposal] = useState(false);

    const constractInfo = getContractInfo(CONTRACTS.DAO_CONTRACT);

    const { data: minTokenToCreateProposal } = useReadContract({
        address: constractInfo.address as `0x${string}`,
        abi: constractInfo.abi,
        functionName: 'minTokenToCreateProposal',
    }) as { data?: bigint }

    const { data: tokenBalance} = useBalance({
        address: address as Address,
        token: CONTRACT_ADDRESSES[CONTRACTS.TOKEN_CONTRACT]
    });


    const hoodiChainId = 560048;





    const handleDisconnect = useCallback(() => {
        disconnect();
        setSelectedAccount(null);
        setAvailableAccounts([]);
        setUserNetwork(null);
        setEthBalance(null);
    }, [disconnect]);

    const getBalance = useCallback(async (accountAddress: string) => {
        if (!walletProvider || !accountAddress) {
            setEthBalance(null);
            return;
        };
        try {
            const provider = new BrowserProvider(walletProvider, chainId);
            const balance = await provider.getBalance(accountAddress);
            setEthBalance(formatEther(balance));
        } catch (e) {
            console.error("Error fetching balance:", e);
            setEthBalance(null);
        }
    }, [walletProvider, chainId]);

    const connectAndFetchData = useCallback(async () => {
        if (!walletProvider) return;
        try {
            const provider = new BrowserProvider(walletProvider, chainId);
            const accounts = await provider.send("eth_requestAccounts", []);
            const network = await provider.getNetwork();


            if (accounts.length > 0) {
                setAvailableAccounts(accounts);
                const currentAccount = accounts[0];
                setSelectedAccount(currentAccount);
                await getBalance(currentAccount);
            }
            setUserNetwork(Number(network.chainId));
        } catch(e) {
            console.error("Error connecting to MetaMask:", e);
        }
    }, [walletProvider, chainId, getBalance]);

    useEffect(() => {
        if (tokenBalance && minTokenToCreateProposal) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCanCreateProposal(tokenBalance?.value  >= minTokenToCreateProposal);
        }
    }, [tokenBalance?.value, minTokenToCreateProposal]);

    useEffect(() => {
        if (isConnected) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            connectAndFetchData();
        }
    }, [isConnected, connectAndFetchData]);

    useEffect(() => {
        const handleBeforeUnload = () => {
            handleDisconnect();
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [handleDisconnect]);

    const handleAccountChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newAccount = event.target.value;
        setSelectedAccount(newAccount);
        getBalance(newAccount);
    };

    const isChainError = useMemo(() => {
        if (!chainId) return false;
        return chainId !== hoodiChainId;
    }, [chainId]);

    const networkName = useMemo(() => {
        const network = networks.find(net => net.id === userNetwork);
        return network ? network.name : null;
    }, [userNetwork]);

    const switchToHoodi = () => {
        if (switchChain) {
            switchChain({ chainId: hoodiChainId });
        } else {
            console.error("Функция для переключения сети недоступна.");
        }
    };

    return(
        <div className={styles.wrapper}>
            {isChainError && (
                <div className={styles.block}>
                    <p style={{color: 'red'}}>Неверная сеть, пожалуйста, подключитесь к сети Hoodi!</p>
                </div>
            )}

            <div className={styles.block}>
                <p>Current Network from AppKit: {chainId}</p>
            </div>

            <div className={styles.block}>
                <p>Connected Address: {selectedAccount || address}</p>
            </div>

            {availableAccounts.length > 1 && (
                <div className={styles.block}>
                    <label htmlFor="account-select">Choose an account: </label>
                    <select id="account-select" value={selectedAccount || ''} onChange={handleAccountChange}>
                        {availableAccounts.map(acc => (
                            <option key={acc} value={acc}>
                                {acc}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className={styles.block}>
                <p>Connected ChainID: {userNetwork ?? "-"}</p>
            </div>

            <div className={styles.block}>
                <p>Connected Network Name: {networkName ?? "-"}</p>
            </div>

            {ethBalance && (
                <div className={styles.block}>
                    <p>Balance: {ethBalance} ETH</p>
                </div>
            )}


            <BallanceDisplay />


            <div className={styles.btnWrapper}>
                <WalletConnection />
                {address &&  <button onClick={handleDisconnect}>Disconnect</button>}
                {isChainError && <button onClick={switchToHoodi}>Switch to Hoodi</button>}
            </div>

            <section>
                <button onClick={() => setShowCreateForm(true)} disabled={!canCreateProposal}>Create Proposal</button>
                {!canCreateProposal && <pre>(You need more governance tokens to create a proposal)</pre>}
                {showCreateForm && (
                    <CreateProposalForm open={showCreateForm} onClose={() => setShowCreateForm(false)} />
                )}
            </section>

        </div>
    );
}
