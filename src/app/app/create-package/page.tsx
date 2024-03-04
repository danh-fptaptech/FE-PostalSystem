'use client'
import {Box, Button, Card, CardContent, Grid, TextField, Tooltip, Typography} from '@mui/material'
import React, {useEffect, useState} from 'react'
import BoxInputInfo from "@/components/BoxInputInfo";
import {useForm} from "react-hook-form";
import {PackageCreateContext} from "@/context/PackageCreateContext";
import {DataCreatePackage} from "@/models/DataCreatePackage";
import FormGoodsInfo from "@/components/FormGoodsInfo";
import {Item} from "@/models/Item";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import {toast} from "sonner";

// @ts-ignore
const CreatePackage = () => {
    // Hook Form
    const {
        register,
        handleSubmit,
        formState: {errors},
        control,
        resetField,
        trigger,
        reset
    } = useForm({mode: "onBlur",});
    // State
    const [formData, setFormData] = useState<DataCreatePackage>({
        address_receiver: "",
        address_sender: "",
        district_receiver: "",
        district_sender: "",
        fullName_receiver: "",
        fullName_sender: "",
        phoneNumber_receiver: "",
        phoneNumber_sender: "",
        postalCode_receiver: "",
        postalCode_sender: "",
        province_receiver: "",
        province_sender: "",
        select_receiver: {},
        select_sender: {},
        type_package: "document",
        ward_receiver: "",
        ward_sender: "",
        type_sender: "new",
        type_receiver: "new",
        // @ts-ignore
        list_items: [{
            itemName: "",
            itemWeight: "",
            itemQuantity: "1",
            itemValue: ""
        }],
        total_weight: "",
        total_value: "",
        package_size: {
            width: "",
            height: "",
            length: ""
        },
        size_convert: "",
        package_note: ""
    });
    const [rateConvert, setRateConvert] = useState(5);
    const [limitSize, setLimitSize] = useState(50);
    const [limitWeight, setLimitWeight] = useState(6);
    const [listService, setListService] = useState([]);
    const [selectedService, setSelectedService] = useState({});
    const [finalWeight, setFinalWeight] = useState(0);
    const [cod, setCod] = useState(0);
    const [fee, setFee] = useState(0);
    const [packageNote, setPackageNote] = useState("");
    const [timeProcess, setTimeProcess] = useState(0);

    // Function
    const createItem = () => {
        const newItem = {
            itemName: "",
            itemWeight: "",
            itemQuantity: "1",
            itemValue: ""
        }
        // @ts-ignore
        setFormData({...formData, list_items: [...formData.list_items, newItem]});
    }
    const removeItem = (index: number) => {
        // @ts-ignore
        setFormData({...formData, list_items: formData.list_items.filter((_, i) => i !== index)});
    }
    const updateItem = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        // @ts-ignore
        const newFormData = {...formData};
        let key = (event.target?.name).split("_")[0];
        // @ts-ignore
        newFormData.list_items[index][key] = event.target?.value;
        // @ts-ignore
        setFormData(newFormData);
    }
    const handleChangeSize = (event: React.ChangeEvent<HTMLInputElement>) => {
        // @ts-ignore
        const newFormData = {...formData};
        // @ts-ignore
        newFormData.package_size[event.target?.name] = event.target?.value;
        // @ts-ignore
        setFormData(newFormData);
    }
    const handleFormChange = (e: any) => {
        // @ts-ignore
        setFormData({...formData, [e.target.name]: e.target.value});
    }
    const handleMultipleFormChange = (changes: any) => {
        const newFormData = {...formData};
        for (const change of changes) {
            //@ts-ignore
            newFormData[change.name] = change.value;
        }
        // @ts-ignore
        setFormData(newFormData);
    }
    // Call API to get list service
    const onSubmit = () => {
        fetchListService().then(r => {
            setListService(r);
            if (r.length === 0) {
                toast.error("No service available");
                return
            }
            setSelectedService(r[0]);
        });
    };
    const fetchListService = async () => {
        // @ts-ignore
        let postalCodeSender = formData?.type_sender === "new" ? (formData?.postalCode_sender || "") : (formData?.select_sender?.postalCode || "");
        // @ts-ignore
        let postalCodeReceiver = formData?.type_receiver === "new" ? (formData?.postalCode_receiver || "") : (formData?.select_receiver?.postalCode || "");
        // @ts-ignore
        let checkSize = Object.values(formData.package_size).some(value => parseFloat(value) > limitSize) || formData.size_convert / 1000 > limitWeight;
        // @ts-ignore
        let totalWeight = !checkSize ? formData.total_weight : (formData.size_convert > formData.total_weight ? formData.size_convert : formData.total_weight);
        // @ts-ignore
        setFinalWeight(totalWeight);
        const response = await fetch("/api/fee-service", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                postalCodeFrom: postalCodeSender,
                postalCodeTo: postalCodeReceiver,
                weight: totalWeight,
            })
        });
        const data = await response.json();
        console.log("Data service:", data.data);
        return data.data;
    }

    const handleReload = () => {
        window.location.reload(); // This will reload the page
    }


    // useEffect
    useEffect(() => {
        console.log("Run effect calculate total weight and value")
        let totalWeight = 0;
        let totalValue = 0;
        // @ts-ignore
        formData.list_items.forEach((item: Item) => {
            totalWeight += Number(item.itemWeight);
            totalValue += Number(item.itemValue);
        });
        // @ts-ignore
        setFormData({...formData, total_weight: totalWeight, total_value: totalValue});
    }, [JSON.stringify(formData?.list_items)]);

    useEffect(() => {
        console.log("Run effect size convert")
        // @ts-ignore
        const size = formData?.package_size;
        // @ts-ignore
        const totalSize = size?.width * size?.height * size?.length;
        // @ts-ignore
        const sizeConvert = totalSize / rateConvert;
        // @ts-ignore
        setFormData({...formData, size_convert: sizeConvert});
    }, [JSON.stringify(formData?.package_size)]);

    useEffect(() => {
        console.log("Run effect province sender")
        // @ts-ignore
        setFormData({...formData, ward_sender: "", district_sender: ""});
    }, [formData?.province_sender]);

    useEffect(() => {
        console.log("Run effect district sender")
        // @ts-ignore
        setFormData({...formData, ward_sender: ""});
    }, [formData?.district_sender]);

    useEffect(() => {
        // @ts-ignore
        if (selectedService?.weighTo == 999999999) {
            // @ts-ignore
            let feeCalculate = selectedService?.feeCharge + (finalWeight - selectedService?.weighFrom) / 1000 * selectedService?.overWeightCharge;
            setFee(feeCalculate.toFixed(2));
            // @ts-ignore
            setTimeProcess(selectedService?.timeProcess);
            return
        }
        // @ts-ignore
        setFee(selectedService?.feeCharge);
    }, [selectedService])


    return (
        <PackageCreateContext.Provider
            value={{
                register,
                errors,
                handleFormChange,
                handleMultipleFormChange,
                control,
                formData,
                resetField,
                createItem,
                removeItem,
                updateItem,
                trigger,
                handleChangeSize
            }}>
            {/*Information Package*/}
            <Grid container spacing={3} columns={12}>
                <Grid item lg={6} xs={12}>
                    <BoxInputInfo typeBox={"sender"} xs={{
                        my: 3,
                        borderRadius: "10px",
                        boxShadow: 'rgba(76, 78, 100, 0.2) 0px 3px 13px 3px',
                    }}/>
                    <BoxInputInfo typeBox={"receiver"} xs={{
                        my: 3,
                        borderRadius: "10px",
                        boxShadow: 'rgba(76, 78, 100, 0.2) 0px 3px 13px 3px',
                    }}/>
                </Grid>
                <Grid item lg={6} xs={12}>
                    <FormGoodsInfo/>
                </Grid>
            </Grid>
            {/*Package Service*/}
            <Grid container spacing={3} columns={12}>
                <Grid item lg={6} xs={12}>
                    <Card sx={{
                        my: 3,
                        borderRadius: "10px",
                        boxShadow: 'rgba(76, 78, 100, 0.2) 0px 3px 13px 3px',
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
                                Package Service
                            </Typography>
                        </Box>
                        <CardContent>
                            {listService.length > 0 ? (
                                listService.map((service, index) => {
                                    return (
                                        // @ts-ignore
                                        <Tooltip title={service.serviceDescription} arrow key={index}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    my: 1,
                                                    p: 1,
                                                    borderRadius: 2,
                                                    backgroundColor: '#F0F0F0',
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => {
                                                    setSelectedService(service);
                                                }}
                                            >
                                                <Typography variant="h6" sx={{fontWeight: 550}}>
                                                    {
                                                        // @ts-ignore
                                                        service.serviceName
                                                    }
                                                </Typography>
                                                <Typography variant="h6" sx={{fontWeight: 550}}>
                                                    ${
                                                    // @ts-ignore
                                                    service.feeCharge
                                                }
                                                </Typography>
                                            </Box>
                                        </Tooltip>
                                    )
                                })
                            ) : (
                                <Typography
                                    sx={{textAlign: 'center', justifyContent: 'center', my: 1, fontSize: '15px'}}>
                                    No service available
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item lg={6} xs={12}>
                    <Card sx={{
                        my: 3,
                        borderRadius: "10px",
                        boxShadow: 'rgba(76, 78, 100, 0.2) 0px 3px 13px 3px',
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
                                Package Options
                            </Typography>
                        </Box>
                        <CardContent>
                            <Tooltip title="Cash on Delivery">
                                <TextField
                                    margin="dense"
                                    label="COD"
                                    type="text"
                                    InputProps={{
                                        startAdornment: <LocalAtmIcon fontSize={"small"}></LocalAtmIcon>,
                                    }}
                                    onChange={(e) => {
                                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                        // @ts-ignore
                                        setCod(e.target.value);
                                    }}
                                    size={"small"}
                                    fullWidth={true}
                                    autoComplete={"off"}
                                    sx={{my: 2}}
                                />
                            </Tooltip>

                            <TextField
                                label="Package Note"
                                multiline
                                rows={4}
                                onChange={(e) => {
                                    e.target.value = e.target.value.replace(/[^0-9a-zA-Z//,+-]/g, '');
                                    // @ts-ignore
                                    setPackageNote(e.target.value);
                                }}
                                fullWidth={true}
                                autoComplete={"off"}
                                sx={{my: 2}}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/*Action Confirm*/}
            <Grid container columns={12} spacing={2}
                  sx={{position: 'sticky', bottom: 10, zIndex: 100, backgroundColor: {xs: '#fff', lg: 'transparent'},}}>
                <Grid item xs={6} lg={2}>
                    <Box
                        sx={{
                            backgroundColor: 'white',
                            borderRadius: '5px',
                            boxShadow: {lg: 'rgba(76, 78, 100, 0.2) 0px 3px 13px 3px', xs: 'none'},
                            p: 1,
                        }}>
                        <Typography
                            sx={{my: 1, fontSize: '16px', fontWeight: 550}}>
                            Weight
                        </Typography>
                        <Typography sx={{
                            textAlign: 'center',
                            justifyContent: 'center',
                            my: 1,
                            fontSize: '15px'
                        }}>{finalWeight ? finalWeight.toLocaleString() + " gram" : "... gram"}
                        </Typography>
                    </Box>
                </Grid>

                <Grid item xs={6} lg={2}>
                    <Box
                        sx={{
                            backgroundColor: 'white',
                            borderRadius: '5px',
                            boxShadow: {lg: 'rgba(76, 78, 100, 0.2) 0px 3px 13px 3px', xs: 'none'},
                            p: 1,
                        }}>
                        <Typography
                            sx={{my: 1, fontSize: '16px', fontWeight: 550}}>
                            COD
                        </Typography>
                        <Typography sx={{
                            textAlign: 'center',
                            justifyContent: 'center',
                            my: 1,
                            fontSize: '15px'
                        }}>{cod ? "$" + Number(cod).toLocaleString() : "$..."}
                        </Typography>
                    </Box>
                </Grid>

                <Grid item xs={6} lg={2}>
                    <Box
                        sx={{
                            backgroundColor: 'white',
                            borderRadius: '5px',
                            boxShadow: {lg: 'rgba(76, 78, 100, 0.2) 0px 3px 13px 3px', xs: 'none'},
                            p: 1,
                        }}>
                        <Typography
                            sx={{my: 1, fontSize: '16px', fontWeight: 550}}>
                            Fee
                        </Typography>
                        <Typography sx={{
                            textAlign: 'center',
                            justifyContent: 'center',
                            my: 1,
                            fontSize: '15px'
                        }}>{fee ? "$" + Number(fee).toLocaleString() : "$..."}
                        </Typography>
                    </Box>
                </Grid>

                <Grid item xs={6} lg={2}>
                    <Box
                        sx={{
                            backgroundColor: 'white',
                            borderRadius: '5px',
                            boxShadow: {lg: 'rgba(76, 78, 100, 0.2) 0px 3px 13px 3px', xs: 'none'},
                            p: 1,
                        }}>
                        <Typography
                            sx={{my: 1, fontSize: '16px', fontWeight: 550}}>
                            Time Process
                        </Typography>
                        <Typography sx={{
                            textAlign: 'center',
                            justifyContent: 'center',
                            my: 1,
                            fontSize: '15px'
                        }}>{
                            timeProcess ? (
                                timeProcess > 24 ? (timeProcess / 24).toFixed(1) + " days" : timeProcess + " hours"
                            ) : "... hours"
                        }
                        </Typography>
                    </Box>
                </Grid>

                <Grid item lg={4} xs={12}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                        height: '100%',
                        backgroundColor: 'white',
                        borderRadius: '5px',
                        boxShadow: {lg: 'rgba(76, 78, 100, 0.2) 0px 3px 13px 3px', xs: 'none'},
                        p: 1,
                    }}>
                        <Button
                            startIcon={<TextSnippetIcon/>}
                            variant="outlined"
                            onClick={handleSubmit(onSubmit)}
                        >
                            Get Service
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={handleReload}
                        >
                            Reload
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </PackageCreateContext.Provider>
    )
}

export default CreatePackage