import { Box, Tab, Tabs, Typography } from '@mui/material'
import React from 'react'


  interface TabPanelProps {
    children?: React.ReactNode
    index: number
    value: number
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}
function NewsHomepage() {
  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }
  return (
    <Box sx={{ my:4 }}>
      <Box>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', display:'flex', flexDirection:'row' }}>
          <Typography sx={{ fontWeight: '550', fontSize: '25px', flexGrow: 0.9 }}>TARS News</Typography>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" variant="fullWidth">
            <Tab sx={{ fontWeight: '550', fontSize: '20px' }} label="Promotion" {...a11yProps(0)} />
            <Tab sx={{ fontWeight: '550', fontSize: '20px' }} label="Guide" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Box></Box>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
            hello
        </CustomTabPanel>
      </Box>
      <Box></Box>
    </Box>
  )
}

export default NewsHomepage