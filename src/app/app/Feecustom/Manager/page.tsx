'use client'
import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { InputLabel, MenuItem, Grid, Autocomplete, Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { DataFeeCustomType, DataLocationType, DataServiceType } from '@/helper/interface';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation'

interface listServiceCustomType {
    id: number;
    serviceName: string;
    serviceDescription: string;
    weighFrom: number;
    weighTo: number;
    createdAt: string;
    updatedAt: string;
    status: number;
    distance: number;
    feeCharge: number;
    timeProcess: number;

}

export default function ManagerFeeCustom() {
    const router = useRouter();
    const [isLoading, SetIsLoading] = useState(true);
    const [isLoadService, SetIsLoadService] = useState(false);

    const [listProvinces, setListProvinces] = useState<DataLocationType[]>([]);
    const [listDistricts, setListDistricts] = useState<DataLocationType[]>([]);

    const [listDistrictsSender, setListDistrictsSender] = useState<DataLocationType[]>([]);
    const [listDistrictsReceiver, setListDistrictsReceiver] = useState<DataLocationType[]>([]);
    const [senderProvince, setSenderProvince] = useState<number>(0);
    const [senderDistrict, setSenderDistrict] = useState<number>(0);
    const [receiverProvince, setReceiverProvince] = useState<number>(0);
    const [receiverDistrict, setReceiverDistrict] = useState<number>(0);
    const [data, setData] = useState({ postalCodeFrom: '', postalCodeTo: '' });
    const [dataId, setDataId] = useState({ postalCodeFromId: '', postalCodeToId: '' });
    const [listFee, setListFee] = useState<DataFeeCustomType[]>([]);
    const [listService, setListService] = useState<DataServiceType[]>([]);
    const [listServiceCustom, setListServiceCustom] = useState<listServiceCustomType[]>([]);
    const [distance, setDistance] = useState<number>(0);
    const [selectedSenderDistrict, setSelectedSenderDistrict] = useState<DataLocationType | null>(null);
    const [selectedReceiverDistrict, setSelectedReceiverDistrict] = useState<DataLocationType | null>(null);

    const [editingItem, setEditingItem] = useState<listServiceCustomType>();

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

    const handleSearchServices = async () => {
        const res = await fetch('/api/FeeCustom/getfeebypostalcode/' + data.postalCodeFrom + '/' + data.postalCodeTo);
        const resData = await res.json();
        const fetchData = resData.data;
        setListFee(fetchData);
        SetIsLoadService(true);
    };

    useEffect(() => {
        if (isLoading) {
            const fetchProvince = async () => {
                const level = 'province';
                const res = await fetch(`/api/Location/GetListLocationByLevel/${level}`);
                const resData = await res.json();
                const data = resData.data;
                setListProvinces(data);
                SetIsLoading(false);
            }
            fetchProvince();
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
        setSelectedSenderDistrict(null);
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
        setSelectedReceiverDistrict(null);
    }, [receiverProvince]);

    useEffect(() => {

        const fetchService = async () => {
            const res = await fetch(`/api/services`)
            const resData = await res.json();
            const data = resData.data;
            setListService(data);
        }
        if (isLoadService) {
            fetchService();
        }
    }, [isLoadService])

    const renderDistrictSenders = (rows: DataLocationType[]) => {
        return (
            rows.map((row: DataLocationType) => (
                <MenuItem key={row.id} value={row.id}>{row.locationName}</MenuItem>
            ))
        );
    }
    const handleAutocompleteOnchange = (e: any, value: DataLocationType | null, id: string) => {
        e.preventDefault();
        if (id === "listDistrictsSender" && value != null) {
            setSenderDistrict(value.id);
            setData({ ...data, postalCodeFrom: value.postalCode });
            setDataId({ ...dataId, postalCodeFromId: value.id.toString() });
        }
        if (id === "listDistrictsReceiver" && value != null) {
            setReceiverDistrict(value.id);
            setData({ ...data, postalCodeTo: value.postalCode });
            setDataId({ ...dataId, postalCodeToId: value.id.toString() });
        }
    }
    useEffect(() => {
        mapToServiceCustom();
    }, [listService])

    const mapToServiceCustom = () => {
        let listServiceCustom: listServiceCustomType[] = [];
        listService && listService.length > 0 && listService.map((service, index) => {
            listServiceCustom.push({
                id: service.id,
                serviceName: service.serviceName,
                serviceDescription: service.serviceDescription,
                weighFrom: service.weighFrom,
                weighTo: service.weighTo,
                createdAt: service.createdAt,
                updatedAt: service.updatedAt,
                status: service.status,
                distance: distance,
                feeCharge: getValueFeeCharge(service.id),
                timeProcess: getValueTimeProcess(service.id)
            });
        });
        setListServiceCustom(listServiceCustom);
    }

    const getValueTimeProcess = (serviceId: number) => {
        let timeProcess = 0;
        listFee && listFee.length > 0 && listFee.map((fee, index) => {
            if (fee.serviceId === serviceId) {
                timeProcess = fee.timeProcess;
            }
        });
        return timeProcess;
    }
    const getValueFeeCharge = (serviceId: number) => {
        let feeCharge = 0;
        listFee && listFee.length > 0 && listFee.map((fee, index) => {
            if (fee.serviceId === serviceId) {
                feeCharge = fee.feeCharge;
            }
        });
        return feeCharge;
    }
    const handleSave = async (item: listServiceCustomType) => {
        const saveItem = {
            serviceId: item.id,
            locationIdFrom: parseInt(dataId.postalCodeFromId),
            locationIdTo: parseInt(dataId.postalCodeToId),
            distance: distance,
            feeCharge: item.feeCharge,
            timeProcess: item.timeProcess,
            status: 1
        };
        console.log("saveItem:", saveItem);
        const res = await fetch(`/api/FeeCustom/CreateUpdateFee/${data.postalCodeFrom}/${data.postalCodeTo}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(saveItem)
        })
        console.log("res:", res);
    }
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, item: listServiceCustomType) => {
        const { name, value } = e.target;
        const updatedItem = { ...item };
        if (name === 'feeCharge') {
            updatedItem.feeCharge = +value;
        }
        if (name === 'timeProcess') {
            updatedItem.timeProcess = +value;
        }
        const index = listServiceCustom.findIndex((item) => item.id === updatedItem.id);
        const newListServiceCustom = [...listServiceCustom];
        newListServiceCustom.splice(index, 1, updatedItem);
        setListServiceCustom(newListServiceCustom);
    }
    useEffect(() => {
        setListService([]);
        setListServiceCustom([]);
        SetIsLoadService(false);
        setData({...data, postalCodeFrom:''});
        setDataId({ ...dataId, postalCodeFromId: ''});
    },[senderProvince])

    useEffect(() => {
        setListService([]);
        setListServiceCustom([]);
        SetIsLoadService(false);
        setData({...data, postalCodeTo:''});
        setDataId({ ...dataId, postalCodeToId: ''});
    },[receiverProvince])

    useEffect(() => {
        setListService([]);
        setListServiceCustom([]);
        SetIsLoadService(false);
    },[senderDistrict,receiverDistrict])

    return (
        <div>
            <Typography className="mt-5 mb-5" variant="h4" sx={{ mb: 2 }}>FeeCustom Management</Typography>
            <div className="border-2 border-slate-200 rounded-lg">
                <Grid item container rowSpacing={2} columnSpacing={{ xs: 1, sm: 20, md: 3 }}>
                    <Grid item xs={12}>
                        <InputLabel className='mt-4 mb-4'>
                            <span><ViewInArIcon /></span>LOCATION INFOMATION
                        </InputLabel>
                    </Grid>
                    <Grid item className="pr-2" xs={6}>
                        <InputLabel className='mt-4 mb-4'>
                            <span><PersonOutlineIcon /></span>SENDER
                        </InputLabel>
                        <Select
                            label="Province/City (Sender)"
                            value={senderProvince !== 0 ? senderProvince.toString() : "99"}
                            onChange={handleOnchange}
                            name="senderProvince"
                            fullWidth
                        >
                            <MenuItem value="99">Choice Province</MenuItem>
                            {listProvinces.length > 0 && listProvinces.map((province, index) => {
                                return (
                                    <MenuItem key={index} value={province.id}>{province.locationName}</MenuItem>
                                )
                            })}
                        </Select>
                    </Grid>
                    <Grid item className="pl-2" xs={6}>
                        <InputLabel className='mt-4 mb-4'>
                            <span><PersonOutlineIcon /></span>RECEIVER
                        </InputLabel>
                        <Select
                            label="Province/City (reveiver)"
                            value={receiverProvince !== 0 ? receiverProvince.toString() : "99"}
                            onChange={handleOnchange}
                            name="receiverProvince"
                            fullWidth
                        >
                            <MenuItem value="99">Choice Province</MenuItem>
                            {listProvinces.length > 0 && listProvinces.map((province, index) => {
                                return (
                                    <MenuItem key={index} value={province.id}>{province.locationName}</MenuItem>
                                )
                            })}
                        </Select>
                    </Grid>
                    <Grid item className="pr-2" xs={6}>
                        <InputLabel className='mt-4 mb-4'>
                            District
                        </InputLabel>
                        <Autocomplete
                            style={{ width: '100%', marginTop: '10px' }}
                            disablePortal
                            id="listDistrictsSender"
                            options={listDistrictsSender}
                            getOptionLabel={(listDistrictsSender) => listDistrictsSender.locationName}
                            getOptionKey={(listDistrictsSender) => listDistrictsSender.id}
                            value={selectedSenderDistrict}
                            sx={{ width: 300 }}
                            onChange={(event, value) => {
                                setSelectedSenderDistrict(value);
                                handleAutocompleteOnchange(event, value, "listDistrictsSender")
                            }}
                            renderInput={(params) => <TextField {...params} label="Districts" />}
                        />
                    </Grid>
                    <Grid item className="pl-2" xs={6}>
                        <InputLabel className='mt-4 mb-4'>
                            District
                        </InputLabel>
                        <Autocomplete
                            style={{ width: '100%', marginTop: '10px' }}
                            disablePortal
                            id="listDistrictsReceiver"
                            options={listDistrictsReceiver}
                            getOptionLabel={(listDistrictsReceiver) => listDistrictsReceiver.locationName}
                            getOptionKey={(listDistrictsReceiver) => listDistrictsReceiver.id}
                            value={selectedReceiverDistrict}
                            sx={{ width: 300 }}
                            onChange={(event, value) => {
                                setSelectedReceiverDistrict(value);
                                handleAutocompleteOnchange(event, value, "listDistrictsReceiver")
                            }}
                            renderInput={(params) => <TextField {...params} label="Districts" />}
                        />
                    </Grid>
                    <Grid container spacing={2} justifyContent="space-between">

                        <Grid item xs>
                            <Button
                                style={{ marginLeft: '24px', marginTop: '12px', width: '150px' }}
                                variant="outlined"
                                startIcon={<SearchIcon />}
                                onClick={handleSearchServices}
                            >
                                Get Services
                            </Button>
                        </Grid>

                        <Grid item>
                            <Button
                                style={{ marginTop: '12px', width: '150px' }}
                                variant="outlined"
                                startIcon={<ArrowBackIcon />}
                                onClick={() => router.push('/app/Feecustom')}
                            >
                                Back
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
            <div className="m-5 border-2 rounded-lg">
                <Grid item >
                    <TableContainer>
                        <Table>
                            <TableHead style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
                                <TableRow>
                                    <TableCell style={{ width: '50px' }}>ID</TableCell>
                                    <TableCell>Service Name</TableCell>
                                    <TableCell>Service Description</TableCell>
                                    <TableCell>Type Service</TableCell>
                                    <TableCell style={{ width: '100px' }}>
                                        <TextField
                                            label="Distance"
                                            variant="standard"
                                            name='distance'
                                            value={distance}
                                            onChange={(e) => setDistance(+e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell>Fee Charge</TableCell>
                                    <TableCell>Time Process</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {listServiceCustom && listServiceCustom.length > 0 && listServiceCustom.map((item, index) => {
                                    return (
                                        <TableRow key={item.id} >
                                            <TableCell>{item.id}</TableCell>
                                            <TableCell>{item.serviceName}</TableCell>
                                            <TableCell>{item.serviceDescription}</TableCell>
                                            <TableCell>{item.weighFrom}g - {item.weighTo}g</TableCell>
                                            <TableCell>{distance}</TableCell>
                                            <TableCell>
                                                <TextField
                                                    error={item.feeCharge === 0}
                                                    label="FeeCharge"
                                                    variant="standard"
                                                    name='feeCharge'
                                                    value={item.feeCharge}
                                                    onChange={(e) => handleOnChange(e, item)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    error={item.timeProcess === 0}
                                                    label="Time Process"
                                                    variant="standard"
                                                    name='timeProcess'
                                                    value={item.timeProcess}
                                                    onChange={(e) => handleOnChange(e, item)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="outlined" startIcon={<SaveIcon />} onClick={() => { handleSave(item) }}>
                                                    Save
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </div>
        </div >
    );
}

function validateService(serviceName: string, serviceDescription: string, weighFrom: number, weighTo: number, status: number) {
    let errorList = [];
    if (serviceName === "") {
        errorList.push("Please enter Service Name");
    }
    if (serviceDescription === "") {
        errorList.push("Please enter Service Description");
    }
    if (weighFrom <= 0) {
        errorList.push("Please Enter one weigh From");
    }
    if (weighTo <= weighFrom) {
        errorList.push("Weigh To must be greater than weigh From");
    }
    return errorList;
}