// components/Layout.js
'use client'
import { AppBar, Box, Button, Container, Divider, Grid, Toolbar, Typography } from '@mui/material'
import Image from 'next/image'
import * as React from 'react'
import banner from '../../../public/1920px-Hong_Kong_Skyline_Panorama_-_Dec_200811.jpg'
import Link from 'next/link'
import AppAppBar from '@/components/AppAppBar'

const Layout = ({ children }: any) => {
  return (
    <>
      <header>
        <AppAppBar mode={'dark'} toggleColorMode={function (): void {
          throw new Error('Function not implemented.')
        } } />
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
        <Box sx={{ backgroundColor:'#212d33', p:2, color:'white', borderTop:5, borderColor:'#ee0033' }}>
          <Container>
            <Box >
              <Grid container>
                <Grid item xs={12} md={3}>
                  <Box>
                    <Typography sx={{ fontWeight:'550', fontSize:28 }}>TARS Portal</Typography>
                    <Divider sx={{ mb:2, mr:4, backgroundColor:'white' }}/>
                    <Box sx={{ pr:2 }}>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        Lorem Ipsum has been the industrys standard dummy text ever since the 1500s
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box>
                    <Typography sx={{ fontWeight:'550', fontSize:28 }}>Quick Links</Typography>
                    <Divider sx={{ mb:2, mr:4, backgroundColor:'white' }}/>

                    <Box><Link href="">Home</Link></Box>
                    <Box><Link href="">About Us</Link></Box>
                    <Box><Link href="">Contact Us</Link></Box>
                    <Box><Link href="">Blogs</Link></Box>
                    <Box><Link href="">Sitemaps</Link></Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box>
                    <Typography sx={{ fontWeight:'550', fontSize:28 }}>Shop Now</Typography>
                    <Divider sx={{ mb:2, mr:4, backgroundColor:'white' }}/>

                    <Box><Link href="">Collections</Link></Box>
                    <Box><Link href="">Trending Products</Link></Box>
                    <Box><Link href="">New Arrivals</Link></Box>
                    <Box><Link href="">Featured Products</Link></Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box>
                    <Typography sx={{ fontWeight:'550', fontSize:28 }}>Reach Us</Typography>
                    <Divider sx={{ mb:2, mr:4, backgroundColor:'white' }}/>

                    <Box>
                      <p>
                        <i></i> #444, some main road, some area, some street, Ho Chi Minh City, Vietnam
                      </p>
                    </Box>
                    <Box>
                      <Link href="">
                        <i></i> +84 888-XXX-XXXX
                      </Link>
                    </Box>
                    <Box>
                      <Link href="">
                        <i></i> @gmail.com
                      </Link>
                    </Box>
                  </Box>
                </Grid>

              </Grid>
            </Box>
            <p>&copy; {new Date().getFullYear()} Tars Postal</p>
          </Container>
        </Box>
      </footer>
    </>
  )
}

export default Layout
