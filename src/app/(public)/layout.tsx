// components/Layout.js

import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material'
import Image from 'next/image'
import * as React from 'react'
import banner from '../../../public/1920px-Hong_Kong_Skyline_Panorama_-_Dec_200811.jpg'
import Link from 'next/link'
import Home from './page'
const Layout = ({ children }: any) => {
  return (
    <>
      <header>
        <AppBar position='fixed'>
          <Toolbar>
            <Container
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Link href='/' style={{ textDecoration:'none' }}>
                <Typography sx={{ fontWeight:550, fontSize:30, color:'white'}}>Tars Postal</Typography>
              </Link>
              <Button variant='contained' href='/app' color='secondary'>
                To App
              </Button>
            </Container>
          </Toolbar>
        </AppBar>
      </header>
      <Box sx={{ mt:{ xs:'56px', md:0 } }}>
        <Image src={banner} alt='Hong Kong Skyline' layout='responsive'/>
        <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center', textAlign:'center', position:'absolute', width:'100%', height:'317px', top:'0' }}>
          <Box>
            <Typography sx={{ fontWeight:550, fontSize:{ xs:18, md:25 }, color:'white', letterSpacing:5 }}>TARS PORTAL</Typography>
            <Typography sx={{ fontWeight:550, fontSize:{ xs:18, md:25 }, color:'white', letterSpacing:5 }}>FAST - FLEXIBLE - FRIENDLY</Typography>

          </Box>
        </Box>
      </Box>
      {/* <Toolbar /> */}
      {/* banner */}
      <main>
        <Container>
          {children}
        </Container>
      </main>
      <footer>
        <Container>
          <p>&copy; {new Date().getFullYear()} Tars Postal</p>
        </Container>
      </footer>
    </>
  )
}

export default Layout
