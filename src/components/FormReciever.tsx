'use client'
import React, { useContext, useEffect, useState } from 'react'
import { Grid } from '@mui/material'
import { Box, TextField, Typography } from '@mui/material'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import Autocomplete from '@mui/material/Autocomplete'
import { PostalCodeContext } from '@/context/PostalCodeContext'

function FormReciever() {

  enum ELocationLevel {
    province = 0,
    district = 1,
    ward = 2
  }

  interface Location {
    id: number;
    locationName: string;
    postalCode: string | null;
    locationLevel: ELocationLevel;
    locationOf: number | null;
    createdAt: string | null;
    updatedAt: string | null;
    status: ELocationLevel;
    parentLocation?: Location;
    childLocations?: Location[];
  }

  const [locations, setLocations] = useState<Location[]>([])
  const [wards, setWards] = useState<Location[]>([])
  const [selectedCity, setSelectedCity] = useState<Location | null>(null)
  const [childLocations, setChildLocations] = useState<Location[]>([])
  const [selectedDistrict, setSelectedDistrict] = useState<Location | null>(null)
  const [newCitySelected, setNewCitySelected] = useState(false)
  const [newDistrictSelected, setNewDistrictSelected] = useState(false)

  const context = useContext(PostalCodeContext)
  if (!context) {
    throw new Error('PostalCodeContext is undefined, make sure it is provided in a parent component')
  }

  const { postalCodeTo, setPostalCodeTo } = context
  // Fetch all tỉnh/thành phố
  useEffect(() => {
    fetch('http://localhost:5255/api/Location/GetListLocationByLevel/Province')
      .then(response => response.json())
      .then(data => setLocations(data))
      .catch(error => console.log(error))
  }, [])

  useEffect(() => {
    if (selectedCity) {
      fetch(`http://localhost:5255/api/Location/GetChildLocation/${selectedCity.id}`)
        .then(response => response.json())
        .then(data => {
          // Put the response object in an array
          setChildLocations(data.districs || [])
        })
        .catch(error => console.error('Error:', error))
    }
  }, [selectedCity])

  useEffect(() => {
    if (selectedDistrict) {
      fetch(`http://localhost:5255/api/Location/GetChildLocation/${selectedDistrict.id}`)
        .then(response => response.json())
        .then(data => {
          setWards(data.wards || [])
        })
        .catch(error => console.error('Error:', error))
    }
  }, [selectedDistrict])


  const handleCitySelect = (value: Location | null) => {
    setSelectedCity(value)
    setNewCitySelected(true) // Set newCitySelected to true when a new city is selected
  }

  const handleDistrictSelect = (value: Location | null) => {
    setSelectedDistrict(value)
    setPostalCodeTo(value?.postalCode || '')
    setNewCitySelected(false) // Set newCitySelected to false when a district is selected
    setNewDistrictSelected(true) // Set newDistrictSelected to true when a new district is selected
  }

  const handleWardSelect = (value: Location | null) => {
    setPostalCodeTo(value?.postalCode || '')
    setNewDistrictSelected(false) // Set newDistrictSelected to false when a ward is selected
  }


  return (
    <>
      <Box sx={{
        m: 2,
        p:'0 0 8px 0',
        border: 1,
        borderColor: '#C7C8CC',
        borderRadius: 1
      }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          borderBottom: 1,
          backgroundColor: '#C7C8CC',
          borderColor: '#C7C8CC',
          borderTopLeftRadius: 2,
          borderTopRightRadius: 2
        }}>
          <Typography variant='h6' sx={{ p: 1, fontSize:'14px', fontWeight: 550, display:'fit-content' }}><LocalShippingIcon sx={{ color: 'red', p:'0 6px', fontSize:'small' }} />NGƯỜI NHẬN</Typography>
        </Box>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Box sx={{ mx:2, '& .MuiTextField-root': { my: 1, width: '100%' } }}>
            <TextField sx={{ '& .MuiInputBase-input':{ py:1.5 } }} label="Sđt" type="number" placeholder='Nhập số điện thoại'/>
            <TextField sx={{ '& .MuiInputBase-input':{ py:1.5 } }} label="Người nhận" type="text" placeholder='Nhập tên người nhận'/>
            <TextField sx={{ '& .MuiInputBase-input':{ py:1.5 } }} label="Địa chỉ nhận" type="text" placeholder='Nhập địa chỉ người nhận'/>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Autocomplete
                  id="city-select-demo"
                  options={locations}
                  autoHighlight
                  getOptionLabel={(option) => option.locationName}
                  onChange={(event, value) => handleCitySelect(value)}
                  renderOption={(props, option) => {
                    return (
                      <Box component="li" {...props}>
                        {option.locationName}
                      </Box>
                    )
                  }}
                  renderInput={(params) => (
                    <TextField
                      sx={{ flexGrow: 1 }}
                      {...params}
                      label="Chọn tỉnh/thành phố"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: 'new-password' // disable autocomplete and autofill
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Autocomplete
                  id="district-select-demo"
                  options={childLocations}
                  autoHighlight
                  getOptionLabel={(option) => newCitySelected ? '' : option.locationName}
                  value={selectedDistrict}
                  onChange={(event, newValue) => {
                    handleDistrictSelect(newValue)
                  }}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      {option.locationName}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      sx={{ flexGrow: 1 }}
                      {...params}
                      label="Chọn quận/huyện"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: 'new-password' // disable autocomplete and autofill
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Autocomplete
              id="xaPhuong-select-demo"
              // value={selectedWard}
              onChange={(event, newValue) => {
                handleWardSelect(newValue)
              }}
              options={wards}

              getOptionLabel={(option) => newDistrictSelected ? '' : option.locationName}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  {option.locationName}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  sx={{ flexGrow: 1 }}
                  {...params}
                  label="Chọn xã/phường"
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password'// disable autocomplete and autofill
                  }}
                />
              )}
            />
          </Box>

        </Box>
      </Box>
    </>
  )
}

export default FormReciever