export const NAVIGATIONS: ROUTER_NAV[] = [
  {
    id: 'Trade',
    title: 'Swap',
    href: '/swap/NATIVE/0xabe4ef22dfe18d325d28c400757cb9f713fe5152b6ce5cff71870c1b885c8738',
    start_child_link: '/swap'
  },
  {
    id: 'liquidity',
    title: 'Liquidity',
    href: '/pools',
    type: 'DROPDOWN',
    similar_links: ['/farms', '/liquidity/add', '/liquidity/create'],
    start_child_link: "/pool",
    childrens: [
      {
        id: 'pools',
        title: 'Pools',
        href: '/pools',
        descriptions: ''
      },
      {
        id: 'farms',
        title: 'Farms',
        href: '/farms',
        descriptions: ''
      },
    ]
  },
  {
    id: 'stats',
    title: 'Stats',
    href: '/overview',
    type: 'DROPDOWN',
    similar_links: ['/tokens', '/leaderboard', '/overview'],
    childrens: [
      {
        id: 'overview',
        title: 'Overview',
        href: '/overview',
        descriptions: ''
      },
      {
        id: 'tokens',
        title: 'Tokens',
        href: '/tokens',
        descriptions: ''
      },
      {
        id: 'leaderboard',
        title: 'Leaderboard',
        href: '/leaderboard',
        descriptions: ''
      },
    ]
  },
]