// components/Layout.js
'use client'
import { signIn, signOut, useSession } from 'next-auth/react'
import { PersonAddAlt, Login } from '@mui/icons-material'
import { AppBar, Box, Button, Container, Link, Toolbar, Typography } from '@mui/material'
import * as React from 'react'
import AppAppBar from '@/components/AppAppBar'
import Image from 'next/image'
import banner from '../../../public/1920px-Hong_Kong_Skyline_Panorama_-_Dec_200811.jpg'

const Layout = ({ children }: any) => {
  const { data: session, status } = useSession()
  return (
    <>
      <header>
        <AppAppBar mode={'dark'} toggleColorMode={function (): void {
          throw new Error('Function not implemented.')
        } } />
      </header>
      <Box sx={{ mt:{ xs:'0', md:'0' } }}>
        <Image src={banner} alt='Hong Kong Skyline' layout='responsive'/>
        <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center', textAlign:'center', position:'absolute', width:'100%', height:{ xs:'200px', md:'290px' }, top:'0' }}>
          <Box>
            <Typography sx={{ fontWeight:550, fontSize:{ xs:18, md:25 }, color:'white', letterSpacing:5 }}>TARS PORTAL</Typography>
            <Typography sx={{ fontWeight:550, fontSize:{ xs:18, md:25 }, color:'white', letterSpacing:5 }}>FAST - FLEXIBLE - FRIENDLY</Typography>
          </Box>
        </Box>
      </Box>
		  <Toolbar />
	  <main>
        <Container maxWidth='xl'>
          {children}
			  </Container>
	  </main>
      <footer>
		  <Container>
			  <p>&copy {new Date().getFullYear()} Tars Postal</p>
		  </Container>
			</footer>
</>
)
}

export default Layout
