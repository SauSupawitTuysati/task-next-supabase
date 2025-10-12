import type { NextConfig } from 'next'
 
const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fxtwobglzhfjadmqbdiy.supabase.co',
        port: '',
        pathname: '/task_bk/**',
        search: '',
      },
    ],
  },
}
 
export default config