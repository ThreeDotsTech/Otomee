const DEFAULT_IPFS_CONFIG = {
  preload: {
    enabled: false
  },
  start: true,
  relay: { enable: true, hop: { enable: true, active: true } },
  EXPERIMENTAL: {
    pubsub: true,
  },
  config: {
    Addresses: {
      Bootstrap: ['/dns4/ipfs.otomee.com/tcp/4002/wss/p2p/12D3KooWLqkemDeZKr2AcCQZAQRS2L5tgWRbp2cJUzHPdTSuyVSH'],
      Swarm: [
        '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
        '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
        '/dns4/webrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star/',
      ]
    },
  }
};

export default DEFAULT_IPFS_CONFIG;
