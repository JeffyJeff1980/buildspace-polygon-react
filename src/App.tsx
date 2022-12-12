
import React, { useCallback, useEffect, useState } from 'react';
import { ethers } from "ethers";
import './App.css';
import 'react-toastify/dist/ReactToastify.css';

import { NetworkName, networks, OpenSeaLink, PolyscanLink } from './constants/networks';

import twitterLogo from './assets/twitter-logo.svg';
import polygonLogo from './assets/polygonlogo.png';
import ethLogo from './assets/ethlogo.png';
import gmLogo from './assets/gm.jpg';
import buildspaceLogo from './assets/buildspace.png';

import contractAbi from './utils/contractABI.json';
import UseNetworkConnectivity from './hooks/UseNetworkConnectivity';
import { UseToasts } from './hooks/UseToasts';
import { DotLoader } from 'react-spinners';
import { ToastContainer } from 'react-toastify';


export interface MintRecord {
  id: number;
  name: string;
  record: string;
  owner: string;
}

// Constants
const TWITTER_HANDLE = 'JeffyJeffNFT';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const CONTRACT_ADDRESS = '0xE510E8512ca67ff99916153DFd41aBe3056BfCf6';
const TLD = '.gm';

const  App =  () =>  {
	const [currentAccount, setCurrentAccount] = useState('');
	const [domain, setDomain] = useState('');
	const [mints, setMints] = useState(Array<MintRecord>);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState('');
	const [network, setNetwork] = useState('');
	const [targetNetwork] = useState(NetworkName.PolygonMainnet);

	const switchNetwork = UseNetworkConnectivity();
	const { toastSuccess, toastError, toastInfo } = UseToasts();

	const onHandleSetDomain = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		setDomain(e.target.value);
	}

	const onHandleSetRecord = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		setRecord(e.target.value);
	}

	const onHandleCancelClick = () => {
		setEditing(false);
		setRecord('');
		setDomain('');
	}

	// This will take us into edit mode and show us the edit buttons!
	const onHandleEditRecord = (name: string) => {
		setEditing(true);
		setDomain(name);
	}

	const onHandleMintClick = () => {
		setLoading(true);
		mintDomain();
	};

	const onHandleUpdateDomainClick = () => {
		debugger;
		setLoading(true);
		updateDomain();
	}

	// Mint domain
	const mintDomain = async () => {

		// Don't run if the domain is empty
		if (!domain) { return }
		// Alert the user if the domain is too short
		if (domain.length < 3) {
      toastError("Domain must be at least 3 characters long");
      return;
    }
    // Calculate price based on length of domain (change this to match your contract)
    // 3 chars = 0.5 MATIC, 4 chars = 0.3 MATIC, 5 or more = 0.1 MATIC
    const price = domain.length === 3 ? "0.5" : domain.length === 4 ? "0.3" : "0.1";
    toastInfo(`Minting domain ${domain} with price ${price}`);
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS ?? "", contractAbi.abi, signer);

        let tx = await contract.register(domain, { value: ethers.utils.parseEther(price) });
        // Wait for the transaction to be mined
        const receipt = await tx.wait();

        // Check if the transaction was successfully completed
        if (receipt.status === 1) {
          console.log(`Domain minted! ${PolyscanLink.PolygonMainnet}/tx/${tx.hash}`);
          toastSuccess("Domain minted successfully!");

          // Set the record for the domain
          tx = await contract.setRecord(domain, record);
          await tx.wait();

          console.log(`Record set! ${PolyscanLink.PolygonMainnet}/tx/${tx.hash}`);
          toastSuccess("Record set successfully!");

          // Call fetchMints after 2 seconds
          setTimeout(() => {
            fetchMints();
          }, 2000);

          setRecord("");
          setDomain("");
          setLoading(false);
        } else {
          toastError("Transaction failed! Please try again");
        }
      }
    } catch (error: any) {
      toastError(error.msg);
    }
	}

	// Update the domain record
	const updateDomain = async () => {
		if (!record || !domain) { return }
		setLoading(true);
		toastInfo(`Updating domain ${domain} with record ${record}`);
			try {
				const { ethereum } = window;
				if (ethereum) {
					const provider = new ethers.providers.Web3Provider(ethereum);
					const signer = provider.getSigner();
					const contract = new ethers.Contract(CONTRACT_ADDRESS ?? '', contractAbi.abi, signer);

					let tx = await contract.setRecord(domain, record);
					await tx.wait();
					console.log(`Record set! ${PolyscanLink.PolygonMainnet}/tx/${tx.hash}`)
					toastSuccess("Record set successfully!");

					fetchMints();
					setRecord('');
					setDomain('');
					setLoading(false);
				}
			} catch(error: any) {
				toastError(error.msg);
			}
		setLoading(false);
	}

	// Implement your connectWallet method here
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        toastError("Get MetaMask -> https://metamask.io/");
        return;
      }

      // Fancy method to request access to account.
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      // Boom! This should print out public address once we authorize Metamask.
      toastSuccess(`Connected ${accounts[0]}`);
      setCurrentAccount(accounts[0]);

    } catch (error: any) {
      toastError(error.msg)
    }
  }

	// Gotta make sure this is async.
	const checkIfWalletIsConnected = useCallback(async () => {
    // First make sure we have access to window.ethereum
    const { ethereum } = window;

    // Check if we're authorized to access the user's wallet
    const accounts = await ethereum.request({ method: "eth_accounts" });

    // Users can have multiple authorized accounts, we grab the first one if its there!
    if (accounts.length !== 0) {
      const account = accounts[0];
      toastSuccess(`Found an authorized account: ${account.slice(0, 6)}...${account.slice(-4)}`);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }

    // This is the new part, we check the user's network chain ID
    const chainId = await ethereum.request({ method: "eth_chainId" });

    if (networks[chainId] !== undefined) {
      setNetwork(networks[chainId]);
    }

    // Reload the page when they change networks
    const handleChainChanged = (chainId: string) => {
      window.location.reload();
    };

    ethereum.on("chainChanged", handleChainChanged);
  }, [toastSuccess]);

  // Add this function anywhere in your component (maybe after the mint function)
  const fetchMints = useCallback(async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS ?? "", contractAbi.abi, signer);

        // Get all the domain names from our contract
        const names = await contract.getAllNames();

        // For each name, get the record and the address
        const mintRecords = await Promise.all(
          names.map(async (name: any) => {
            const mintRecord = await contract.records(name);
            const owner = await contract.domains(name);
            return {
              id: names.indexOf(name),
              name: name,
              record: mintRecord,
              owner: owner,
            };
          })
        );

        setMints(mintRecords);
      }
    } catch (error: any) {
      toastError(error.msg);
    }
  }, [toastError]);

  // Create a function to render if wallet is not connected yet
  const renderNotConnectedContainer = () => (
    <div className="connect-wallet-container">
      <img alt="GM" className="gm-logo" src={gmLogo} />
      <button className="cta-button connect-wallet-button" onClick={connectWallet}>
        Connect Wallet
      </button>
    </div>
  );

  // Form to enter domain name and data
  const renderInputForm = () => {
    network !== targetNetwork ? (
      <div className="connect-wallet-container">
        <h2>Please switch to {targetNetwork}</h2>
        <button className="cta-button mint-button" onClick={switchNetwork}>
          Click here to switch
        </button>
      </div>
    ) : (
      <div className="form-container">
        <div className="first-row">
          <input disabled={loading} type="text" value={domain} placeholder="domain name" onChange={onHandleSetDomain} />
          <p className="tld"> {TLD} </p>
        </div>

        <input disabled={loading} type="text" value={record} placeholder="address record" onChange={onHandleSetRecord} />

        {/* If the editing variable is true, return the "Set record" and "Cancel" button */}
        {editing ? (
          <div className="button-container">
            {/* This will call the updateDomain function we just made */}
            <button className="cta-button mint-button" disabled={loading} onClick={onHandleUpdateDomainClick}>
              {!loading ? (
                <p>Set record</p>
              ) : (
                <DotLoader color={"#FFFFFF"} loading={loading} size={15} aria-label="Loading Spinner" data-testid="loader" />
              )}
            </button>
            {/* This will let us get out of editing mode by setting editing to false */}
            <button className="cta-button mint-button" onClick={onHandleCancelClick} disabled={loading}>
              Cancel
            </button>
          </div>
        ) : (
          // If editing is not true, the mint button will be returned instead
          <button className="cta-button mint-button" disabled={loading} onClick={onHandleMintClick}>
            {!loading ? (
              <p>🦄&nbsp;Mint</p>
            ) : (
              <DotLoader color={"#FFFFFF"} loading={loading} size={15} aria-label="Loading Spinner" data-testid="loader" />
            )}
          </button>
        )}
      </div>
    );
  };

  // Add this render function next to your other render functions
  const renderMints = () => {
    if (currentAccount && mints.length > 0) {
      return (
        <div className="mint-container">
          <p className="subtitle">Recently minted domains:</p>
          <div className="mint-list">
            {mints.map((mint, index) => {
              if (mint.id === 0) {
                return null;
              }
              return (
                <div className="mint-item element" key={index}>
                  <div className="mint-row">
                    <a
                      className="link"
                      href={`${OpenSeaLink.PolygonMainnet}${CONTRACT_ADDRESS}/${mint.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <p className="underlined">
                        {" "}
                        {mint.name}
                        {TLD}{" "}
                      </p>
                    </a>
                    {/* If mint.owner is currentAccount, add an "edit" button*/}
                    {mint.owner.toLowerCase() === currentAccount.toLowerCase() ? (
                      <button className="edit-button" onClick={() => onHandleEditRecord(mint.name)}>
                        <img className="edit-icon" src="https://img.icons8.com/metro/26/000000/pencil.png" alt="Edit button" />
                      </button>
                    ) : null}
                  </div>
                  <a
                    className="link"
                    href={`https://polygonscan.com/address/${mint.record}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <p className="mint-record underlined">
                      {mint.record.slice(0, 6)}...{mint.record.slice(-4)}
                    </p>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
  };

  // This will run any time currentAccount or network are changed
  useEffect(() => {
    if (network === targetNetwork) {
      fetchMints();
    }
  }, [currentAccount, network, targetNetwork, fetchMints]);

  // This runs our function when the page loads.
  useEffect(() => {
    if (!currentAccount) {
      checkIfWalletIsConnected();
    }
  }, [checkIfWalletIsConnected, currentAccount]);

  return (
    <div className="App">
      <div className="container">
        <>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />

          <div className="header-container">
            <header>
              <div className="title">
                <p className="title">☕☀️ GM Name Service!</p>
              </div>
              {/* Display a logo and wallet connection status*/}
              <div className="right">
                <img alt="Network logo" className="logo" src={network.includes("Polygon") ? polygonLogo : ethLogo} />
                {currentAccount ? (
                  <p>
                    {" "}
                    Wallet: {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}{" "}
                  </p>
                ) : (
                  <p> Not connected </p>
                )}
              </div>
            </header>
          </div>

          {/* Hide the connect button if currentAccount isn't empty*/}
          {!currentAccount && renderNotConnectedContainer()}

          {/* Render the input form if an account is connected */}
          {currentAccount && renderInputForm()}

          {mints && renderMints()}

          <div className="footer-container">
            <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
            built by&nbsp;
            <a className="footer-text" href={TWITTER_LINK} target="_blank" rel="noreferrer">{`@${TWITTER_HANDLE}`}</a>
            &nbsp;and&nbsp;
            <a className="footer-text" href={"https://twitter.com/_buildspace"} target="_blank" rel="noreferrer">
              @_buildspace
            </a>
          </div>
          <div className="footer-contract-container">
            <a href={`https://polygonscan.com/address/${CONTRACT_ADDRESS}`} target="_blank" rel="noreferrer">
              <p className="underlined">View smart contract on Polyscan</p>
            </a>
          </div>
          <div className="footer-logo-container">
            <img src={buildspaceLogo} alt="Buildspace Logo" className="buildspace-logo" />
          </div>
        </>
      </div>
    </div>
  );
}

export default App;