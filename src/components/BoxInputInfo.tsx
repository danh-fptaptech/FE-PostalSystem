'use client'
import * as React from 'react';
import {useContext} from 'react';
import {
    Autocomplete,
    Card,
    CardContent,
    FormControlLabel,
    Radio,
    RadioGroup,
    TextField,
    Typography
} from "@mui/material";
import Box from "@mui/material/Box";
import FormInfo from "@/components/FormInfo";
import {PackageCreateContext} from "@/context/PackageCreateContext";
import MenuItem from "@mui/material/MenuItem";

const BoxInputInfo = (props: any) => {
    const {typeBox, xs} = props;
    // @ts-ignore
    const {register, errors, handleFormChange} = useContext(PackageCreateContext);
    const [listAddress, setListAddress] = React.useState([]);
    const [chooseAddress, setChooseAddress] = React.useState('true');
    const fetchAddress = async () => {
        const res = await fetch(`/api/user/address/getlist${typeBox}`);
        const data = await res.json();
        return data.data;
    }


    React.useEffect(() => {
        fetchAddress().then(r => setListAddress(r));
        handleFormChange({target: {name: `type_${typeBox}`, value: "select"}});
    }, []);

    // @ts-ignore
    return (
        <Card sx={{
            ...xs
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                borderBottom: 1,
                backgroundColor: "primary.light",
                borderColor: '#C7C8CC',
                borderTopLeftRadius: 2,
                borderTopRightRadius: 2
            }}
            >
                <Typography variant="h6" sx={{p: 1, display: 'fit-content', color: "#fff"}}>
                    {typeBox === "sender" ? "Sender Information" : "Receiver Information"}
                </Typography>
            </Box>
            <CardContent>
                {listAddress.length !== 0 ?
                    <>
                        <RadioGroup
                            sx={{m: 2}}
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={chooseAddress}
                            onChange={(e) => { // @ts-ignore
                                setChooseAddress(e.target.value)
                                if (e.target.value === 'true') {
                                    handleFormChange({target: {name: `type_${typeBox}`, value: "select"}});
                                    return;
                                }
                                handleFormChange({target: {name: `type_${typeBox}`, value: "new"}});
                            }}
                        >
                            <FormControlLabel value='true' control={<Radio/>} label="List Sender Address"/>
                            <FormControlLabel value='false' control={<Radio/>} label="New Sender"/>
                        </RadioGroup>
                        {chooseAddress === 'true' ?
                            /*<TextField
                                id="outlined-select"
                                select
                                label="Choose sender address"
                                fullWidth={true}required={true}
                                {...register(`select_${typeBox}`, {
                                    required: "Please select an address",
                                })}
                                onChange={handleFormChange}
                                error={!!(errors[`select_${typeBox}`])}
                                helperText={errors[`select_${typeBox}`]?.message}
                            >
                                {listAddress.map((option:{value:any, label:any},index) => (
                                    // @ts-ignore
                                    <MenuItem
                                        key={index}
                                        value={option}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>*/
                            <Autocomplete
                                id="autocomplete-select"
                                options={listAddress}
                                getOptionLabel={(option: { value: any, label: any }) => option.label}
                                onChange={(event, value) => {
                                    handleFormChange({target: {name: `select_${typeBox}`, value: value}});
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Choose sender address"
                                        required={true}
                                        {...register(`select_${typeBox}`, {
                                            required: "Please select an address",
                                        })}
                                        error={!!(errors[`select_${typeBox}`])}
                                        helperText={errors[`select_${typeBox}`]?.message}
                                        fullWidth={true}
                                    />
                                )}
                            />
                            :
                            <FormInfo type={typeBox}/>
                        }
                    </>
                    :
                    <FormInfo type={typeBox}/>}
            </CardContent>
        </Card>
    );
}
export default BoxInputInfo;