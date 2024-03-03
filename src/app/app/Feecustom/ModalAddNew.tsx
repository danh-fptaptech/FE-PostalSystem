'use client'
import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { FormControlLabel, InputLabel, MenuItem, FormControl, FormGroup, Switch, Grid, Alert, Autocomplete, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Chip, IconButton, TablePagination } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { DataFeeCustomType, DataLocationType, DataServiceType } from '@/helper/interface';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SearchIcon from '@mui/icons-material/Search';
import { FormEventHandler, useEffect, useState } from 'react';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    bgcolor: 'background.paper',
    border: '1px solid lightblue',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

export default function ModalAddNew({
    open, setOpen, editItemId, setEditItemId, searchParams
}: {
    open: boolean,
    setOpen: any,
    editItemId: Number | null,
    setEditItemId: any,
    data: DataFeeCustomType[],
    setData: any
    searchParams?: {
        page?: string;
    };
}) {
    const handleOpen = () => {
        setOpen(true)
        setEditItemId(null);
    };
    const handleClose = () => setOpen(false);
    const [isLoading, SetIsLoading] = useState(true)

    const [listProvinces, setListProvinces] = useState<DataLocationType[]>([]);
    const [listDistricts, setListDistricts] = useState<DataLocationType[]>([]);

    const [listDistrictsSender, setListDistrictsSender] = useState<DataLocationType[]>([]);
    const [listDistrictsReceiver, setListDistrictsReceiver] = useState<DataLocationType[]>([]);
    const [senderProvince, setSenderProvince] = useState<number>(0);
    const [senderDistrict, setSenderDistrict] = useState<number>(0);
    const [receiverProvince, setReceiverProvince] = useState<number>(0);
    const [receiverDistrict, setReceiverDistrict] = useState<number>(0);
    const [data, setData] = useState({ postalCodeFrom: '', postalCodeTo: '' });
    const [listFee, setListFee] = useState<DataFeeCustomType[]>([]);
    const [listService, setListService] = useState<DataServiceType[]>([]);

    //paginate
    const [currentPage, setCurrentPage] = useState(Number(searchParams?.page) || 0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const handleChangePage = (event: unknown, newPage: number) => {
        setCurrentPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(0);
    };

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
    const handleSearchServices = () => {

        fetch(`http://localhost:5255/api/FeeCustom/GetFeeByPostalCode/${data.postalCodeFrom}/${data.postalCodeTo}`)
            .then(res => res.json())
            .then(data => {
                setListFee(data);
            })
            .catch(err => console.log(err));
        console.log(listFee);
    };
    useEffect(() => {
        if (isLoading) {
            const fetchProvince = async () => {
                const res = await fetch("http://localhost:5255/api/Location/GetListLocationByLevel/province")
                const data = await res.json();
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
                const res = await fetch(`http://localhost:5255/api/Location/GetChildLocation/${senderProvince.toString()}`)
                const data = await res.json();
                setListDistrictsSender(data.districs);
            }
        }
        fetchDistrict();
        console.log("listDistricts:", listDistricts);
    }, [senderProvince]);
    useEffect(() => {
        const fetchDistrict = async () => {
            if (receiverProvince !== 0) {
                const res = await fetch(`http://localhost:5255/api/Location/GetChildLocation/${receiverProvince.toString()}`)
                const data = await res.json();
                setListDistrictsReceiver(data.districs);
            }
        }
        fetchDistrict();
        console.log("setListDistrictsReceiver:", listDistricts);
    }, [receiverProvince]);
    useEffect(() => {
        const fetchService = async () => {
            const res = await fetch("http://localhost:5255/api/Service")
            const data = await res.json();
            setListService(data);
        }
        fetchService();
    }, [])

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
    return (
        <div>
            <Button
                className="mt-2 mb-2 bg-blue-200 text-black hover:bg-blue-500 hover:text-black"
                variant="contained"
                onClick={handleOpen}
            > Manager FeeCustom</Button>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <Typography className="mt-5 mb-5" variant="h4">Ước tính cước phí</Typography>
                        <div className="border-2 border-slate-200 rounded-lg">
                            <Grid item container rowSpacing={2} columnSpacing={{ xs: 1, sm: 20, md: 3 }}>
                                <Grid item xs={12}>
                                    <InputLabel className='mt-4 mb-4'>
                                        <span><ViewInArIcon /></span>THÔNG TIN BƯU PHẨM
                                    </InputLabel>
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
                                <Button style={{ marginLeft: '24px', marginTop: '12px' }} variant="outlined" startIcon={<SearchIcon />} onClick={handleSearchServices}>
                                    Tra Cứu
                                </Button>

                            </Grid>
                        </div>
                        <div className="m-5 border-2 rounded-lg" style={{ height: '300px', overflowY: 'auto' }}>
                            <Grid item >
                                <TableContainer>
                                    <Table>
                                        <TableHead style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
                                            <TableRow>
                                                <TableCell style={{ width: '50px' }}>ID</TableCell>
                                                <TableCell>Service Name</TableCell>
                                                <TableCell>Service Description</TableCell>
                                                <TableCell>Type Service</TableCell>
                                                <TableCell>CreatedAt</TableCell>
                                                <TableCell>UpdatedAt</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell>Acction</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {listService && listService.length > 0 && listService.map((service, index) => {
                                                return (
                                                    <TableRow key={service.id} >
                                                        <TableCell>{service.id}</TableCell>
                                                        <TableCell>{service.serviceName}</TableCell>
                                                        <TableCell>{service.serviceDescription}</TableCell>
                                                        <TableCell>{service.weighFrom}g - {service.weighTo}g</TableCell>
                                                        <TableCell>{service.createdAt}</TableCell>
                                                        <TableCell>{service.updatedAt}</TableCell>
                                                        <TableCell>
                                                            <span>
                                                                <Chip label={service.status === 1 ? 'Active' : 'Inactive'} color={service.status === 1 ? 'success' : 'error'} />
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <IconButton>
                                                                Edit
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                        <TablePagination
                                            rowsPerPageOptions={[5, 10, 25]}
                                            component="div"
                                            count={listService.length}
                                            rowsPerPage={rowsPerPage}
                                            page={currentPage}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                        />
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </div>
                    </Box>
                </Fade>
            </Modal>
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