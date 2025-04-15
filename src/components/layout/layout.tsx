import Header from './nav/nav'
import Footer from './footer/footer'
import React, { ReactNode } from 'react'

interface LayoutProps {
    children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <>
            <Header />
            <main style={{}}>{children}</main>
            <Footer />
        </>
    )
}

export default Layout