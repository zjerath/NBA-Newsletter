import './globals.css'
import SideBar from '../components/sidebar'
import { SessionProvider } from '../components/sessionprovider'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]'
import Login from '../components/login'
import ClientProvider from '../components/clientprovider'

export const metadata = {
  title: 'NBA Newsletter',
  description: 'Your personal NBA Analyst',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions)
  console.log(session)
  return (
    <html lang="en">
      <body className="layout-body">
        <SessionProvider session={session}>
          {!session ? (
            <Login />
          ): (
            <div className="layout-h-full">
              <div className="layout-inner-div">
                <div className="layout-sidebar"><SideBar/></div>
                <ClientProvider />
                <div className="layout-main">{children}</div>
              </div>
            </div>
          )}
        </SessionProvider>
      </body>
    </html>
  )
}