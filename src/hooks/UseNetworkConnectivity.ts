import { NetworkChainId, PolyscanLink } from "../constants/networks";
import { UseToasts } from "./UseToasts";

function UseNetworkConnectivity() {
  const { toastError } = UseToasts();

  const switchNetwork = async () => {
    if (window.ethereum) {
      try {
        // Try to switch to the Mumbai testnet
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: NetworkChainId.PolygonMainnet }], // Check networks.js for hexadecimal network ids
        });
      } catch (error: any) {
        // This error code means that the chain we want has not been added to MetaMask
        // In this case we ask the user to add it to their MetaMask
        if (error.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: NetworkChainId.PolygonMainnet,
                  chainName: "Polygon Mainnet",
                  rpcUrls: ["https://polygon-rpc.com/"],
                  nativeCurrency: {
                    name: "Matic",
                    symbol: "MATIC",
                    decimals: 18,
                  },
                  blockExplorerUrls: [PolyscanLink.PolygonMainnet],
                },
              ],
            });
          } catch (error) {
            console.log(error);
          }
        }
        console.log(error);
      }
    } else {
      // If window.ethereum is not found then MetaMask is not installed
      toastError("MetaMask is not installed. Please install it to use this app.");
    }
  };
  return switchNetwork;
}

export default UseNetworkConnectivity;
