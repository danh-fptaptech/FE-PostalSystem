'use client'
import React, { FormEventHandler, useEffect, useState } from 'react';
// import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Autocomplete, Grid, InputLabel, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SearchIcon from '@mui/icons-material/Search';
import { DataFeeCustomType, DataLocationType } from '@/helper/interface';



const EstimatePage: React.FC = () => {
    const [listProvinces, setListProvinces] = useState<DataLocationType[]>([]);
    const [listDistricts, setListDistricts] = useState<DataLocationType[]>([]);

    const [listDistrictsSender, setListDistrictsSender] = useState<DataLocationType[]>([]);
    const [listDistrictsReceiver, setListDistrictsReceiver] = useState<DataLocationType[]>([]);

    const [isLoading, SetIsLoading] = useState(true)

    const [senderProvince, setSenderProvince] = useState<number>(0);
    const [senderDistrict, setSenderDistrict] = useState<number>(0);
    const [receiverProvince, setReceiverProvince] = useState<number>(0);
    const [receiverDistrict, setReceiverDistrict] = useState<number>(0);
    const [weight, setWeight] = useState('');
    const [data, setData] = useState({ postalCodeFrom: '', postalCodeTo: '', weight: 0 });
    const [listFee, setListFee] = useState<DataFeeCustomType[]>([]);

    const handleOnchange = (e: SelectChangeEvent<string>) => {
        e.preventDefault();
        const { name, value } = e.target;
        if (+value != 0) {
            if (name == "senderProvince") {
                setSenderProvince(+value);
            }
            if (name == "receiverProvince") {
                setReceiverProvince(+value);
            }
        }
    }
    const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        setData({ ...data, weight: +weight });
        getFeeByPostalCodeWeight();
    }
    const getFeeByPostalCodeWeight = async () => {
        const url = `/api/FeeCustom/GetFeeByPostalCodeWeight/${data.postalCodeFrom}/${data.postalCodeTo}/${data.weight}`;
        const res = await fetch(url);
        const payload = await res.json();
        const fetchData: DataFeeCustomType[] = payload.data;
        if (res.ok) {
            setListFee(fetchData);
        } else {
            console.log("api backend error");
        }
        console.log("fetchData",fetchData);
    }

    useEffect(() => {
        if (isLoading) {
            const fetchProvince = async () => {
                const level = 'province';
                const res = await fetch(`/api/Location/GetListLocationByLevel/${level}`);
                const resData = await res.json();
                const data:DataLocationType[] = resData.data;
                setListProvinces(data);
                SetIsLoading(false);
            }
            fetchProvince();
            console.log("listDistricts:", listDistricts);
        }
    }, [isLoading]);


    useEffect(() => {
        const fetchDistrict = async () => {
            if (senderProvince !== 0) {
                const res = await fetch('/api/Location/GetChildLocation/' + senderProvince.toString());
                const resData = await res.json();
                const data = resData.data;
                setListDistrictsSender(data.districs);
            }
        }
        fetchDistrict();
        console.log("listDistricts:", listDistricts);
    }, [senderProvince]);
    useEffect(() => {
        const fetchDistrict = async () => {
            if (receiverProvince !== 0) {
                const res = await fetch('/api/Location/GetChildLocation/' + receiverProvince.toString());
                const resData = await res.json();
                const data = resData.data;
                setListDistrictsReceiver(data.districs);
            }
        }
        fetchDistrict();
        console.log("setListDistrictsReceiver:", listDistricts);
    }, [receiverProvince]);

    const renderDistrictSenders = (rows: DataLocationType[]) => {
        return (
            rows.map((row: DataLocationType) => (
                <MenuItem key={row.id} value={row.id}>{row.locationName}</MenuItem>
            ))
        );
    }
    const handleAutocompleteOnchange = (e: any, value: DataLocationType | null, id: string) => {
        e.preventDefault();
        console.log(id, value);
        if (id === "listDistrictsSender" && value != null) {
            setSenderDistrict(value.id);
            setData({ ...data, postalCodeFrom: value.postalCode });
        }
        if (id === "listDistrictsReceiver" && value != null) {
            setReceiverDistrict(value.id);
            setData({ ...data, postalCodeTo: value.postalCode });
        }
    }
    const renderListFee = (data: DataFeeCustomType[]) => {
        return (
            <Table>
                <TableHead>
                    <TableRow >
                        <TableCell className='font-bold bg-gray-100'>Service Name</TableCell>
                        <TableCell className='font-bold bg-gray-100'>Fee Charge</TableCell>
                        <TableCell className='font-bold bg-gray-100'>Time Process</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, index) => {
                        return (
                            <TableRow key={index}>
                                <TableCell>{row.service.serviceName}</TableCell>
                                <TableCell>{row.feeCharge}</TableCell>
                                <TableCell>{row.timeProcess}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        );
    }
    return (
        <div style={{ marginLeft: '50px', marginRight: '50px' }}>
            <Typography className="mt-5 mb-5" variant="h4">Ước tính cước phí</Typography>
            <div className="border-2 border-slate-200 rounded-lg">
                <form className=" p-5 pr-0" onSubmit={handleSubmit}>
                    <Grid item container rowSpacing={2} columnSpacing={{ xs: 1, sm: 20, md: 3 }}>
                        <Grid item xs={12}>
                            <InputLabel className='mt-4 mb-4'>
                                <span><ViewInArIcon /></span>THÔNG TIN BƯU PHẨM
                            </InputLabel>
                            <InputLabel className='mt-4 mb-4'>
                                Khối lượng bưu phẩm
                            </InputLabel>
                            <TextField
                                label="Trọng lượng (kg)"
                                type="number"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item className="pr-2" xs={6}>
                            <InputLabel className='mt-4 mb-4'>
                                <span><PersonOutlineIcon /></span>NGƯỜI GỬI
                            </InputLabel>
                            <Select
                                label="Tỉnh/Thành phố (người gửi)"
                                value={senderProvince !== 0 ? senderProvince.toString() : "99"}
                                onChange={handleOnchange}
                                name="senderProvince"
                                fullWidth
                            >
                                <MenuItem value="99">Chọn Tỉnh/TP</MenuItem>
                                {listProvinces.length > 0 && listProvinces.map((province, index) => {
                                    return (
                                        <MenuItem key={index} value={province.id}>{province.locationName}</MenuItem>
                                    )
                                })}
                            </Select>
                        </Grid>
                        <Grid item className="pl-2" xs={6}>
                            <InputLabel className='mt-4 mb-4'>
                                <span><PersonOutlineIcon /></span>NGƯỜI NHẬN
                            </InputLabel>
                            <Select
                                label="Tỉnh/Thành phố (người nhận)"
                                value={receiverProvince !== 0 ? receiverProvince.toString() : "99"}
                                onChange={handleOnchange}
                                name="receiverProvince"
                                fullWidth
                            >
                                <MenuItem value="99">Chọn Tỉnh/TP</MenuItem>
                                {listProvinces.length > 0 && listProvinces.map((province, index) => {
                                    return (
                                        <MenuItem key={index} value={province.id}>{province.locationName}</MenuItem>
                                    )
                                })}
                            </Select>
                        </Grid>
                        <Grid item className="pr-2" xs={6}>
                            <InputLabel className='mt-4 mb-4'>
                                Quận/Huyện
                            </InputLabel>
                            <Autocomplete
                                style={{ width: '100%', marginTop: '10px' }}
                                disablePortal
                                id="listDistrictsSender"
                                options={listDistrictsSender}
                                getOptionLabel={(listDistrictsSender) => listDistrictsSender.locationName}
                                getOptionKey={(listDistrictsSender) => listDistrictsSender.id}
                                sx={{ width: 300 }}
                                onChange={(event, value) => handleAutocompleteOnchange(event, value, "listDistrictsSender")}
                                renderInput={(params) => <TextField {...params} label="Quận/Huyện" />}
                            />
                        </Grid>
                        <Grid item className="pl-2" xs={6}>
                            <InputLabel className='mt-4 mb-4'>
                                Quận/Huyện
                            </InputLabel>
                            <Autocomplete
                                style={{ width: '100%', marginTop: '10px' }}
                                disablePortal
                                id="listDistrictsReceiver"
                                options={listDistrictsReceiver}
                                getOptionLabel={(listDistrictsReceiver) => listDistrictsReceiver.locationName}
                                getOptionKey={(listDistrictsReceiver) => listDistrictsReceiver.id}
                                sx={{ width: 300 }}
                                onChange={(event, value) => handleAutocompleteOnchange(event, value, "listDistrictsReceiver")}
                                renderInput={(params) => <TextField {...params} label="Quận/Huyện" />}
                            />
                        </Grid>
                        <Button type="submit" style={{ marginLeft: '24px', marginTop: '12px' }} variant="outlined" startIcon={<SearchIcon />}>
                            Tra Cứu
                        </Button>

                    </Grid>
                </form>
            </div>
            <div className="m-5 border-2 rounded-lg">
                <Grid className='bg-zinc-200 pt-4 pb-4 p-5'>
                    Dịch vụ của chúng tôi
                </Grid>
                <Grid className="mt-5 mb-5 p-5">
                    {listFee.length === 0 && <p>Không có dữ liệu</p>}
                    {listFee.length > 0 && renderListFee(listFee)}
                </Grid>
            </div>
        </div>
    );
};

export default EstimatePage;
