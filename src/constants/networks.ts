export enum NetworkChainId {
  Mainnet = "0x1",
  Ropsten = "0x3",
  Kovan = "0x2a",
  Rinkeby = "0x4",
  Goerli = "0x5",
  BSCTestnet = "0x61",
  BSCMainnet = "0x38",
  PolygonMainnet = "0x89",
  PolygonMumbaiTestnet = "0x13881",
  AVAXMainnet = "0xa86a",
}

export enum NetworkName {
  Mainnet = "Mainnet",
  Ropsten = "Ropsten",
  Kovan = "Kovan",
  Rinkeby = "Rinkeby",
  Goerli = "Goerli",
  BSCTestnet = "BSC Testnet",
  BSCMainnet = "BSC Mainnet",
  PolygonMainnet = "Polygon Mainnet",
  PolygonMumbaiTestnet = "Polygon Mumbai Testnet",
  AVAXMainnet = "AVAX Mainnet",
}

export const networks: NetworkOptions = {
  [NetworkChainId.Mainnet]: NetworkName.Mainnet,
  [NetworkChainId.Ropsten]: NetworkName.Ropsten,
  [NetworkChainId.Kovan]: NetworkName.Kovan,
  [NetworkChainId.Rinkeby]: NetworkName.Rinkeby,
  [NetworkChainId.Goerli]: NetworkName.Goerli,
  [NetworkChainId.BSCTestnet]: NetworkName.BSCTestnet,
  [NetworkChainId.BSCMainnet]: NetworkName.BSCMainnet,
  [NetworkChainId.PolygonMainnet]: NetworkName.PolygonMainnet,
  [NetworkChainId.PolygonMumbaiTestnet]: NetworkName.PolygonMumbaiTestnet,
  [NetworkChainId.AVAXMainnet]: NetworkName.AVAXMainnet,
};

export enum OpenSeaLink {
  Mainnet = "https://opensea.io/assets/",
  Ropsten = "https://testnets.opensea.io/assets/",
  Kovan = "https://testnets.opensea.io/assets/",
  Rinkeby = "https://testnets.opensea.io/assets/",
  Goerli = "https://testnets.opensea.io/assets/",
  BSCTestnet = "https://testnets.opensea.io/",
  BSCMainnet = "https://opensea.io/assets/",
  PolygonMainnet = "https://opensea.io/assets/",
  PolygonMumbaiTestnet = "https://testnets.opensea.io/assets/mumbai/",
  AVAXMainnet = "https://opensea.io/assets/",
}

type NetworkOptions = {
  [key: string]: string;
};
