import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { FormControlLabel, InputLabel, MenuItem, FormControl, FormGroup, Switch, Grid, Alert } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { DataServiceType } from '@/helper/interface';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '1px solid lightblue',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};
export default function ModalAddNew({
    open, setOpen, editItemId, setEditItemId
}: {
    open: boolean,
    setOpen: any,
    editItemId: Number | null,
    setEditItemId: any,
    data: DataServiceType[],
    setData: any
}) {
    const handleOpen = () => {
        setOpen(true)
        setEditItemId(null); 
    };
    const handleClose = () => setOpen(false);

    const [editService, SetEditService] = React.useState<DataServiceType | null>(null);

    const [serviceName, setServiceName] = React.useState('');
    const [serviceDescription, setServiceDescription] = React.useState('');
    const [weighFrom, setWeighFrom] = React.useState(0);
    const [weighTo, setWeighTo] = React.useState(0);
    const [status, setStatus] = React.useState(1);

    const [errors, setErrors] = React.useState<string[]>([]);

    const handleSelectChange = (event: SelectChangeEvent) => {
        const { name, value } = event.target;
    };

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const newValue = status === 1 ? 0 : 1;
        if (name == 'status') {
            setStatus(newValue);
        }
    }

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'serviceName') {
            setServiceName(value);
        }
        if (name === 'serviceDescription') {
            setServiceDescription(value);
        }
        if (name === 'weighFrom') {
            setWeighFrom(Number(value));
        }
        if (name === 'weighTo') {
            setWeighTo(Number(value));
        }
    }

    const handelSubmit = async () => {

        if (editItemId != null) {
            console.log('id:', editItemId, 'serviceName:', serviceName, 'serviceDescription:', serviceDescription, 'weighFrom:', weighFrom, 'weighTo:', weighTo, 'status:', status);
            try {
                const requestBody = {
                    id: editItemId,
                    serviceName: serviceName,
                    serviceDescription: serviceDescription,
                    weighFrom: weighFrom,
                    weighTo: weighTo,
                    status: status
                };
                let checkValidate = validateService(serviceName, serviceDescription, weighFrom, weighTo, status);
                if (checkValidate.length > 0) {
                    setErrors(checkValidate);
                    return;
                }
                const response = await fetch(`/api/services`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                });
                console.log('updated service:', response);
                if (response.ok) {
                    setOpen(false);
                    SetEditService(null);
                    setErrors([]);
                    setEditItemId(null);
                    console.log('Update Service successfully!');
                } else {
                    if (response.status === 400) {
                        const error = await response.text();
                        if (error == 'Postal code already exists') {
                            setErrors([...errors, 'Postal code already exists']);
                        }
                        console.error('Bad Request Error:', error);
                    } else {
                        console.error('Create Service Error', response.status);
                    }
                }
            } catch (error) {
                console.error('Error', error);
            }
        } else {
            console.log('serviceName:', serviceName, 'serviceDescription:', serviceDescription, 'weighFrom:', weighFrom, 'weighTo:', weighTo, 'status:', status);
            try {
                const requestBody = {
                    serviceName: serviceName,
                    serviceDescription: serviceDescription,
                    weighFrom: weighFrom,
                    weighTo: weighTo,
                    status: status
                };
                let checkValidate = validateService(serviceName, serviceDescription, weighFrom, weighTo, status);
                if (checkValidate.length > 0) {
                    setErrors(checkValidate);
                    return;
                }
                const response = await fetch(`/api/services`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                });

                if (response.ok) {
                    setOpen(false);
                    SetEditService(null);
                    setErrors([]);
                    setEditItemId(null);
                    console.log('Create a new Service successfully!');
                } else {
                    if (response.status === 400) {
                        const error = await response.text();
                        if (error == 'Postal code already exists') {
                            setErrors([...errors, 'Postal code already exists']);
                        }
                        console.error('Bad Request Error:', error);
                    } else {
                        console.error('Create Service Error', response.status);
                    }
                }
            } catch (error) {
                console.error('Error', error);
            }
        }
    }

    const getService = async () => {
        const res = await fetch(`/api/services/getService/${editItemId}`);
        const resJson = await res.json();
        const data = resJson.data;
        SetEditService(data.data);
        setServiceName(data.serviceName);
        setServiceDescription(data.serviceDescription);
        setWeighFrom(data.weighFrom);
        setWeighTo(data.weighTo);
        setStatus(data.status);
    }
    React.useEffect(() => {
        if (editItemId !== null) {
            getService();
        } else {
            setServiceName('');
            setServiceDescription('');
            setWeighFrom(0);
            setWeighTo(0);
            setStatus(1);
        }
    }, [editItemId])
    React.useEffect(() => {
        if (editItemId !== null) {
            getService();
        } else {
            setServiceName('');
            setServiceDescription('');
            setWeighFrom(0);
            setWeighTo(0);
            setStatus(1);
        }
    },[])

    return (
        <div>
            <Button
                variant="contained"
                onClick={handleOpen}
            > Add Service</Button>
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
                        <Typography id="transition-modal-title" variant="h6" component="h2" style={{textAlign:'center'}}>
                            Add Service
                        </Typography>
                        <hr style={{margin:'20px 50px'}} />
                        <Box>
                            {errors && errors.length > 0 && (
                                <Grid item xs={12}>
                                <div className="error-message">
                                    {errors.map((msg, i) => (
                                        <Alert severity="success" color="warning" key={i}>
                                            {msg}
                                        </Alert>
                                    ))}
                                </div>
                            </Grid>
                            )}
                        </Box>
                        <TextField
                            fullWidth
                            label="serviceName"
                            variant="standard"
                            name='serviceName'
                            value={serviceName.length > 0 ? serviceName : ''}
                            onChange={handleChangeInput}
                        />
                        <TextField
                            fullWidth
                            label="serviceDescription"
                            variant="standard"
                            name='serviceDescription'
                            value={serviceDescription ? serviceDescription : ''}
                            onChange={handleChangeInput}
                        />
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="weighFrom"
                                    variant="standard"
                                    name='weighFrom'
                                    value={weighFrom ? weighFrom : ''}
                                    onChange={handleChangeInput}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="weighTo"
                                    variant="standard"
                                    name='weighTo'
                                    value={weighTo ? weighTo : ''}
                                    onChange={handleChangeInput}
                                />
                            </Grid>
                        </Grid>
                        <FormGroup style={{ marginTop: '20px' }}>
                            <FormControlLabel
                                required
                                control={
                                    <Switch
                                        name='status'
                                        value={status}
                                        checked={status === 1}
                                        onChange={handleOnChange}
                                    />
                                }
                                label={status === 1 ? 'Active' : 'Inactive'}
                            />
                        </FormGroup>
                        <Button variant="contained" onClick={handelSubmit}>Submit</Button>
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