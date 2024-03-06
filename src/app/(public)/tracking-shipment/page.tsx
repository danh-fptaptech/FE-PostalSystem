'use client'
// 1. Import statements
import React, { useEffect, useState } from 'react'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { Box, Button, Grid, TextField, Typography } from '@mui/material'
import Image from 'next/image'
import trackingSvg from '../../../../public/tracking-img.svg'
import { toast } from 'sonner'

// 2. Type definitions
import { Data, TrackingData } from '@/components/interfaces'
import HistoryLogs from '@/components/HistoryLogs'

function Page() {

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/">
      Trang chủ
    </Link>,
    <Typography key="2" color="text.primary">
      Tra cứu đơn hàng
    </Typography>
  ]
  const [data, setData] = useState<Data |null>(null)
  const stepMapping: { [key: number]: string } = {
    0: 'Processing',
    1: 'Done',
    2: 'Hold'
  }

  const statusMapping: { [key: number]: string } = {
    0: 'Waiting for pickup',
    1: 'Created',
    2: 'Warehouse from',
    3: 'In transit',
    4: 'Warehouse to',
    5: 'Shipping',
    6: 'Delivered',
    7: 'Cancelled',
    8: 'Returned',
    9: 'Lost'
  }
  const [trackingCode, setTrackingCode] = useState(data?.trackingCode || '')

  let formattedCreatedDate = ''
  if (data?.createdAt) {
    const date = new Date(data.createdAt)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    formattedCreatedDate = `${day}/${month}/${year}`
  }

  let estimateDeleiveryDate = ''
  if (data?.createdAt) {
    const date = new Date(data.createdAt)
    date.setDate(date.getDate() + 2)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    estimateDeleiveryDate = `${day}/${month}/${year}`
  }

  const handleTrackingCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTrackingCode(event.target.value)
  }

  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:5255/api/Package/getbytracking/${trackingCode}`)
      if (response.status === 200) {
        const data = await response.json()
        // Update the state with the fetched data
        setData(data)
        // Store the data in the local storage
        const now = new Date()
        const item = {
          value: data,
          expiry: now.getTime() + 24 * 60 * 60 * 1000 // 24 hours from now
        }
        localStorage.setItem('trackingData', JSON.stringify(item))
        if (data.status) {
          // Handle success case
          toast.success('Data fetched successfully')
        }
      } else if (response.status === 404) {
        // Handle not found case
        toast.error('Package not found')
      } else {
        // Handle other errors
        toast.error('An error occurred')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const handleButtonClick = () => {
    fetchData()
  }
  // 3. Use the useEffect hook to retrieve the data from the local storage
  useEffect(() => {
    const storedData = localStorage.getItem('trackingData')
    if (storedData) {
      const item = JSON.parse(storedData)
      // Check if the data is still valid
      if (item.expiry > new Date().getTime()) {
        setData(item.value)
      }
    }
  }, [])

  // 4. Use the useEffect hook to update the tracking code state
  useEffect(() => {
    setTrackingCode(data?.trackingCode || '')
  }, [data?.trackingCode])

  // TrackingBoard code section
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null)

  useEffect(() => {
    const data = localStorage.getItem('trackingData')
    if (data) {
      setTrackingData(JSON.parse(data))
    }
  }, [data])


  if (!data) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Box sx={{ py:1, px:2 }}>
        <Stack>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
          >
            {breadcrumbs}
          </Breadcrumbs>
        </Stack>
      </Box>
      <Box>
        <Grid container sx={{ p:4 }}>
          <Grid item xs={12} sm={6}>
            <Box>
              <Typography sx={{ fontWeight:550, py:1 }}>
                Tracking code
              </Typography>
              {/* <Typography sx={{ fontWeight:550, fontSize:'16px', py:1 }}>
                (Tra nhiều bill bằng cách thêm dấu phẩy giữa các bill)
              </Typography> */}
              <TextField sx={{ '& .MuiInputBase-input':{ py:1 }, width:'100%' }} type="text" placeholder='Example: 123456' value={trackingCode} onChange={handleTrackingCodeChange}/>
              {/* <TextField sx={{ '& .MuiInputBase-input':{ py:1 }, width:'100%', mt:1 }} type="text" placeholder='Enter phone number'/> */}
              <Button sx={{
                my:2,
                color:'white',
                backgroundColor:'red',
                borderRadius:1,
                '&:hover':{
                  backgroundColor:'red',
                  color:'white'
                }
              }}
              onClick={handleButtonClick}>
                SEARCH
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box>
              <Image priority src={trackingSvg} alt="tracking" style={{ display:'block', marginLeft:'auto', marginRight:'auto' }}/>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ backgroundColor:'#ced4da', borderRadius:1, mx:1 }}>
          <Box sx={{ py:2, px:3 }}>
            <Typography sx={{ fontWeight:550 }} variant="h5">
              Tracking Information
            </Typography>
          </Box>
          <Box sx={{ py:2, px:3 }}>
            <Grid container>
              <Grid item xs={12} sm={4} sx={{ display:'flex', flexDirection:'row', borderRight:{ xs:0, sm:1 } }}>
                <Grid item xs={6}>
                  <Typography sx={{ py:2, textAlign:'left' }}>
                    Tracking code:
                  </Typography>
                  <Typography sx={{ py:2 }}>
                    Order Detail:
                  </Typography>
                  <Typography sx={{ py:2 }}>
                    Sender name:
                  </Typography>
                  <Typography sx={{ py:2 }}>
                    Reciever name:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ textAlign:'right', pr:2, fontWeight:'550', py:2 }}>
                    {data?.trackingCode}
                  </Typography>
                  <Typography sx={{ textAlign:'right', pr:2, fontWeight:'550', py:2 }}>
                    Xem them
                  </Typography>
                  <Typography sx={{ textAlign:'right', pr:2, fontWeight:'550', py:2 }}>
                    {data?.nameFrom}
                  </Typography>
                  <Typography sx={{ textAlign:'right', pr:2, fontWeight:'550', py:2 }}>
                    {data?.nameTo}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={4} sx={{ display:'flex', flexDirection:'row', borderRight:{ xs:0, sm:1 } }}>
                <Grid item xs={6}>
                  <Typography sx={{ py:2, pl:{ xs:0, sm:2 } }}>
                    Weight (gram):
                  </Typography>
                  <Typography sx={{ py:2, pl:{ xs:0, sm:2 } }}>
                    Service:
                  </Typography>
                  <Typography sx={{ py:2, pl:{ xs:0, sm:2 } }}>
                    Status:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ textAlign:'right', pr:2, fontWeight:'550', py:2 }}>
                    {data.packageSize? data.packageSize : '1'}
                  </Typography>
                  <Typography sx={{ textAlign:'right', pr:2, fontWeight:'550', py:2 }}>
                    {data?.service?.serviceName}
                  </Typography>
                  <Typography sx={{ textAlign:'right', pr:2, fontWeight:'550', py:2 }}>
                    {stepMapping[data?.step] || 'Lỗi rôi  !!'}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={4} sx={{ display:'flex', flexDirection:'row' }}>
                <Grid item xs={6}>
                  <Typography sx={{ py:2, pl:{ xs:0, sm:2 } }}>
                    Created date:
                  </Typography>
                  <Typography sx={{ py:2, pl:{ xs:0, sm:2 } }}>
                    Recieve date:
                  </Typography>
                  <Typography sx={{ py:2, pl:{ xs:0, sm:2 } }}>
                    Estimate deliver date:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ textAlign:'right', fontWeight:'550', py:2, pr:3 }}>
                    {formattedCreatedDate}
                  </Typography>
                  <Typography sx={{ textAlign:'right', fontWeight:'550', py:2, pr:3 }}>
                    {formattedCreatedDate}
                  </Typography>
                  <Typography sx={{ textAlign:'right', fontWeight:'550', py:2, pr:3 }}>
                    {estimateDeleiveryDate}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <HistoryLogs trackingData={trackingData} statusMapping={statusMapping} />
      </Box>
    </>
  )
}


export default Page
