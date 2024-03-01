'use client'
import {Box, Button, Card, Grid, InputAdornment, TextField, Tooltip, Typography} from '@mui/material'
import {useContext} from 'react'
import Divider from '@mui/material/Divider'
import {PackageCreateContext} from "@/context/PackageCreateContext";
import {Item} from "@/models/Item";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearAllIcon from '@mui/icons-material/ClearAll';

function FormGoodsInfo() {

    const typePackage = [
        {
            title: 'Document',
            value: 'document',
            content: 'Sent mail, documents with 1-3 days delivery.'
        },
        {
            title: 'Packet',
            value: 'packet',
            content: 'Sent items, gifts with 2-7 days delivery.'
        }
    ]

    const {
        // @ts-ignore
        handleFormChange,
        // @ts-ignore
        formData,
        // @ts-ignore
        createItem,
        // @ts-ignore
        removeItem,
        // @ts-ignore
        updateItem,
        // @ts-ignore
        register,
        // @ts-ignore
        errors
    } = useContext(PackageCreateContext)


    return (
        <Card sx={{my: 3}}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                borderBottom: 1,
                backgroundColor: 'primary.light',
                borderColor: '#C7C8CC',
                borderTopLeftRadius: 2,
                borderTopRightRadius: 2
            }}>
                <Typography variant="h6" sx={{
                    p: 1,
                    display: 'fit-content',
                    color: "#fff"
                }}>
                    Item Information
                </Typography>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                <Box>
                    <Typography variant='h6'
                                sx={{
                                    fontSize: '14px',
                                    fontWeight: 550,
                                    display: 'fit-content',
                                    mx: 2,
                                    pt: 1
                                }}
                    >
                        Type of Package
                    </Typography>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        my: 2,
                        mx: 2,
                    }}>
                        {typePackage.map((type, index) => (
                            <Tooltip key={index} title={type.content} placement="bottom">
                                <Box onClick={() => handleFormChange({
                                    target: {
                                        name: 'type_package',
                                        value: type.value
                                    }
                                })}
                                     sx={{
                                         border: 1,
                                         borderRadius: 2,
                                         py: 1,
                                         mx: 2,
                                         textAlign: 'center',
                                         width: '100%',
                                         cursor: 'pointer',
                                         color: formData.type_package === type.value ? 'primary.light' : 'rgba(0,0,0,0.87)',
                                     }}>
                                    <Typography variant='h6'
                                                sx={{fontSize: '15px', fontWeight: 700}}>{type.title}</Typography>
                                </Box>
                            </Tooltip>
                        ))}
                    </Box>
                </Box>
                <Divider sx={{my: 2, borderColor: '#C7C8CC'}} variant="middle"/>
                <Box component={"li"} sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    listStyleType: 'none',
                    px: 3
                }}>
                    {formData.list_items.map((item: Item, index: any) => (
                        <Box key={index}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                                <Typography variant="h6" sx={{
                                    p: 1,
                                    display: 'fit-content',
                                    fontSize: '15px',
                                    fontWeight: 550,
                                }}>
                                    Item {index + 1} :
                                </Typography>
                                {index !== 0 && (
                                    <IconButton aria-label="delete" size="small" onClick={() => removeItem(index)}>
                                        <DeleteIcon fontSize="small" color={"primary"}/>
                                    </IconButton>
                                )}
                            </Box>
                            <TextField
                                margin="dense"
                                label="Name item"
                                type="text"
                                required={true}
                                {...register(`itemName_${index}`, {
                                    required: "Name item is required",
                                    pattern: {
                                        value: /^[a-zA-Z\s]+$/gu,
                                        message: "Name item must be alphabet"
                                    },
                                })}
                                onChange={(e) => {
                                    updateItem(index, e)
                                }}

                                error={!!(errors[`itemName_${index}`])}
                                helperText={errors[`itemName_${index}`]?.message}
                                size={"small"}
                                fullWidth={true}
                            />
                            <Grid container spacing={2} columns={12}>
                                <Grid item xs={4}>
                                    <Tooltip title="Item Quantity">
                                        <TextField
                                            margin="dense"
                                            label="Quantity"
                                            defaultValue={1}
                                            type="number"
                                            required={true}
                                            {...register(`itemQuantity_${index}`, {
                                                required: "Quantity item is required",
                                                max: {
                                                    value: 200,
                                                    message: "Quantity item must be less than 100"
                                                },
                                                min: {
                                                    value: 1,
                                                    message: "Quantity item must be more than 1"
                                                }
                                            })}

                                            InputProps={{
                                                startAdornment: <ClearAllIcon></ClearAllIcon>,
                                                disableIncrement: true,
                                                disableDecrement: true,
                                            }}
                                            onChange={(e) => updateItem(index, e)}
                                            error={!!(errors[`itemQuantity_${index}`])}
                                            helperText={errors[`itemQuantity_${index}`]?.message}
                                            size={"small"}
                                            fullWidth={true}
                                        />
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={4}>
                                    <Tooltip title="Item Weight(gram)">
                                        <TextField
                                            margin="dense"
                                            label="Weight"
                                            type="number"
                                            required={true}
                                            {...register(`itemWeight_${index}`, {
                                                required: "Weight item is required",
                                                max: {
                                                    value: 1000000,
                                                    message: "Weight item must be less than 1000000 gram"
                                                },
                                                min: {
                                                    value: 1,
                                                    message: "Weight item must be more than 1 gram"
                                                }
                                            })}
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">g</InputAdornment>,
                                                disableIncrement: true,
                                                disableDecrement: true,
                                            }}
                                            onChange={(e) => updateItem(index, e)}
                                            error={!!(errors[`itemWeight_${index}`])}
                                            helperText={errors[`itemWeight_${index}`]?.message}
                                            size={"small"}
                                            fullWidth={true}
                                        />
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={4}>
                                    <Tooltip title="Item value">
                                        <TextField
                                            margin="dense"
                                            label="Value"
                                            type="number"
                                            {...register(`itemValue_${index}`, {
                                                max: {
                                                    value: 100000,
                                                    message: "Value item must be less than 100000 $"
                                                },
                                                min: {
                                                    value: 1,
                                                    message: "Value item must be more than 1 $"
                                                }
                                            })}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                                disableIncrement: true,
                                                disableDecrement: true,
                                            }}
                                            onChange={(e) => updateItem(index, e)}
                                            error={!!(errors[`itemValue_${index}`])}
                                            helperText={errors[`itemValue_${index}`]?.message}
                                            size={"small"}
                                            fullWidth={true}
                                        />
                                    </Tooltip>
                                </Grid>
                            </Grid>
                            <Divider sx={{mx: 2, my: 1, borderColor: '#C7C8CC'}} variant="middle"/>
                        </Box>
                    ))}
                </Box>

                {/* Add form button */}
                <Box sx={{mx: 2, my: 2, display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                    <Typography onClick={createItem}>
                        <Button sx={{
                            border: 1,
                            py: 1,
                            textAlign: 'center',
                            fontSize: '13px',
                            width: '100%',
                            fontWeight: 550,
                            color: 'red'
                        }}>Add new Item</Button>
                    </Typography>
                </Box>
                <Divider sx={{mx: 2, my: 1, borderColor: '#C7C8CC'}} variant="middle"/>

                <Box sx={{mx: 2, my: 1, display: 'flex', flexDirection: 'row'}}>
                    <Grid container>
                        <Grid item xs={6}>
                            <Typography variant='body1'
                                        sx={{
                                            py: 1,
                                            textAlign: 'left',
                                            fontSize: '16px'
                                        }}
                            >
                                Total Weight:
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant='h6' sx={{
                                py: 1,
                                textAlign: 'right',
                                fontSize: '16px',
                                width: '100%',
                                fontWeight: 550,
                                color: 'red'
                            }}>{formData.total_weight.toLocaleString()||0} gram</Typography>
                        </Grid>
                    </Grid>
                </Box>
                <Box sx={{mx: 2, my: 1, display: 'flex', flexDirection: 'row'}}>
                    <Grid container>
                        <Grid item xs={3}>
                            <Typography variant='body1'
                                        sx={{
                                            py: 1,
                                            textAlign: 'left',
                                            fontSize: '16px'
                                        }}
                            >
                                Total value:
                            </Typography>
                        </Grid>
                        <Grid item xs={9}>
                            <Typography variant='h6' sx={{
                                py: 1,
                                textAlign: 'right',
                                fontSize: '16px',
                                width: '100%',
                                fontWeight: 550,
                                color: 'red'
                            }}>${formData.total_value.toLocaleString()||0}</Typography>
                        </Grid>
                    </Grid>
                </Box>
                <Divider sx={{mx: 2, my: 2, borderColor: '#C7C8CC'}} variant="middle"/>
                <Box sx={{mx: 2, my: 1, display: 'flex', flexDirection: 'row'}}>

                    {/*<Grid container spacing={2} columns={12}>
                        <Grid item xs={4}>
                            <Tooltip title="Item Quantity">
                                <TextField
                                    margin="dense"
                                    label="Quantity"
                                    defaultValue={1}
                                    type="text"
                                    required={true}
                                    InputProps={{
                                        startAdornment: <ClearAllIcon></ClearAllIcon>,
                                    }}
                                    onChange={(e) => updateItem(index, e)}
                                    error={!!(errors[`itemQuantity_${index}`])}
                                    helperText={errors[`itemQuantity_${index}`]?.message}
                                    size={"small"}
                                    fullWidth={true}
                                />
                            </Tooltip>
                        </Grid>
                        <Grid item xs={4}>
                            <Tooltip title="Item Weight(gram)">
                                <TextField
                                    margin="dense"
                                    label="Weight"
                                    type="text"
                                    required={true}
                                    {...register(`itemWeight_${index}`, {
                                        required: "Weight item is required",
                                        max: {
                                            value: 1000000,
                                            message: "Weight item must be less than 1000000 gram"
                                        },
                                        min: {
                                            value: 1,
                                            message: "Weight item must be more than 1 gram"
                                        }
                                    })}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">g</InputAdornment>,
                                    }}
                                    onChange={(e) => updateItem(index, e)}
                                    error={!!(errors[`itemWeight_${index}`])}
                                    helperText={errors[`itemWeight_${index}`]?.message}
                                    size={"small"}
                                    fullWidth={true}
                                />
                            </Tooltip>
                        </Grid>
                        <Grid item xs={4}>
                            <Tooltip title="Item value">
                                <TextField
                                    margin="dense"
                                    label="Value"
                                    type="text"
                                    {...register(`itemValue_${index}`, {
                                        max: {
                                            value: 100000,
                                            message: "Value item must be less than 100000 $"
                                        },
                                        min: {
                                            value: 1,
                                            message: "Value item must be more than 1 $"
                                        }
                                    })}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                    }}
                                    onChange={(e) => updateItem(index, e)}
                                    error={!!(errors[`itemValue_${index}`])}
                                    helperText={errors[`itemValue_${index}`]?.message}
                                    size={"small"}
                                    fullWidth={true}
                                />
                            </Tooltip>
                        </Grid>
                    </Grid>*/}
                </Box>
            </Box>
        </Card>
    )
}

export default FormGoodsInfo
