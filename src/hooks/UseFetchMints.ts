import { ethers } from "ethers";
import { useCallback, useState } from "react";
import { UseToasts } from "./UseToasts";
import contractAbi from "../utils/contractABI.json";

export interface MintRecord {
  id: number;
  name: string;
  record: string;
  owner: string;
}

const UseFetchMints = (contractAddress: string) => {
  const { toastError } = UseToasts();
  const [mints, setMints] = useState(Array<MintRecord>);

  // Fetch all the mints from the contract
  const fetchMints = useCallback(async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress ?? "", contractAbi.abi, signer);

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
  }, [contractAddress, toastError]);

  return { mints, fetchMints };
};

export default UseFetchMints;
