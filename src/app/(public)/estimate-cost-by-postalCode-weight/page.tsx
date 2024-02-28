'use client'
import React, { useEffect, useState } from 'react'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { Box, Typography } from '@mui/material'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { TrackingDataItem } from '@/components/interfaces'

function Page() {
  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/">
      Trang chủ
    </Link>,
    <Typography key="2" color="text.primary">
      Ước tính cước phí
    </Typography>
  ]

  const [trackingData, setTrackingData] = useState<TrackingDataItem[] | null>(null)

  useEffect(() => {
    const itemStr = localStorage.getItem('dataEstimate')

    if (!itemStr) {
      console.log('No data in localStorage')
      setTrackingData(null)
      return
    }

    const item = JSON.parse(itemStr)
    const now = new Date()

    if (now.getTime() > item.expiry) {
      console.log('Data in localStorage expired')
      localStorage.removeItem('dataEstimate')
      setTrackingData(null)
    } else {
      const item = JSON.parse(itemStr)
      console.log('Data from localStorage:', item.value)
      setTrackingData(item.value)
    }
  }, [])
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
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 380 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Tên dịch vụ</TableCell>
                <TableCell align="left">Giá cước</TableCell>
                <TableCell align="left">Thời gian</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trackingData ? trackingData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.service.serviceName}</TableCell>
                  <TableCell>{row.feeCharge} đ</TableCell>
                  <TableCell>{row.timeProcess} ngày</TableCell>
                </TableRow>
              )) : <TableRow><TableCell colSpan={3}>No data</TableCell></TableRow>}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  )
}

export default Page