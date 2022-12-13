export enum NetworkChainId {
  Mainnet = "0x1",
  Ropsten = "0x3",
  Kovan = "0x2a",
  Rinkeby = "0x4",
  Goerli = "0x5",
  PolygonMainnet = "0x137",
  PolygonMumbaiTestnet = "0x13881",
}

export enum NetworkName {
  Mainnet = "Mainnet",
  Ropsten = "Ropsten",
  Kovan = "Kovan",
  Rinkeby = "Rinkeby",
  Goerli = "Goerli",
  PolygonMainnet = "Polygon Mainnet",
  PolygonMumbaiTestnet = "Polygon Mumbai Testnet",
}

export const networks: NetworkOptions = {
  [NetworkChainId.Mainnet]: NetworkName.Mainnet,
  [NetworkChainId.Ropsten]: NetworkName.Ropsten,
  [NetworkChainId.Kovan]: NetworkName.Kovan,
  [NetworkChainId.Rinkeby]: NetworkName.Rinkeby,
  [NetworkChainId.Goerli]: NetworkName.Goerli,
  [NetworkChainId.PolygonMainnet]: NetworkName.PolygonMainnet,
  [NetworkChainId.PolygonMumbaiTestnet]: NetworkName.PolygonMumbaiTestnet,
};

export enum OpenSeaLink {
  Mainnet = "https://opensea.io/assets/",
  Ropsten = "https://testnets.opensea.io/assets/",
  Kovan = "https://testnets.opensea.io/assets/",
  Rinkeby = "https://testnets.opensea.io/assets/",
  Goerli = "https://testnets.opensea.io/assets/",
  PolygonMainnet = "https://opensea.io/assets/matic/",
  PolygonMumbaiTestnet = "https://testnets.opensea.io/assets/mumbai/",
}

export enum PolyscanLink {
  PolygonMainnet = "https://polygonscan.com/",
  PolygonMumbaiTestnet = "https://mumbai.polygonscan.com/",
}

type NetworkOptions = {
  [key: string]: string;
};
