'use client'
import {Box, Button, Grid, Typography} from '@mui/material'
import React, {useEffect, useState} from 'react'
import BoxInputInfo from "@/components/BoxInputInfo";
import {useForm} from "react-hook-form";
import {PackageCreateContext} from "@/context/PackageCreateContext";
import {DataCreatePackage} from "@/models/DataCreatePackage";
import FormGoodsInfo from "@/components/FormGoodsInfo";
import {Item} from "@/models/Item";

const CreatePackage = () => {
    // Hook Form
    const {
        register,
        handleSubmit,
        formState: {errors},
        control,
        resetField,
        trigger
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
    const [listService, setListService] = useState([])

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
    const onSubmit = (data: any, check?: any) => {
        if (check) {
            fetchListService();
        }
        if (Object.keys(errors).length === 0) {
            console.log("Data:", data);
        }
    };
    const fetchListService = async () => {
        // @ts-ignore
        let postalCodeSender = formData?.type_sender === "new" ? (formData?.postalCode_sender || "") : (formData?.select_sender?.postalCode || "");
        // @ts-ignore
        let postalCodeReceiver = formData?.type_receiver === "new" ? (formData?.postalCode_receiver || "") : (formData?.select_receiver?.postalCode || "");
        // @ts-ignore
        let checkSize = Object.values(formData.package_size).some(value => parseFloat(value) > limitSize) || formData.size_convert / 1000 > limitWeight;
        // @ts-ignore
        let totalWeight = !checkSize ? formData.total_weight : (formData.size_convert > formData.total_weight ? formData.size_convert : formData.total_weight) ;

        console.log("Total Weight:", totalWeight);
        console.log("Postal Code Sender:", postalCodeSender);
        console.log("Postal Code Receiver:", postalCodeReceiver);

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
        return await response.json();
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
        console.log("Log Value:", formData);
    }, [formData])

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
            <Grid container
                  columns={12}
                  sx={{
                      position: 'sticky',
                      bottom: 10,
                      backgroundColor: 'white',
                      borderRadius: '10px',
                      boxShadow: 'rgba(76, 78, 100, 0.2) 0px 3px 13px 3px',
                      zIndex: 100
                  }}>
                <Grid item xs={6} lg={2}
                      sx={{
                          borderColor: '#C7C8CC',
                          lg:{borderRight: 1},
                          xs:{borderBottom: 1,borderRight: 1}
                      }}
                >
                    <Typography
                        sx={{textAlign: 'center', justifyContent: 'center', my: 1, fontSize: '15px'}}>
                        Total Fee
                    </Typography>
                    <Typography sx={{
                        textAlign: 'center',
                        justifyContent: 'center',
                        my: 1,
                        fontSize: '15px'
                    }}> đ</Typography>
                </Grid>

                <Grid item xs={2} sx={{borderRight: 1, borderColor: '#C7C8CC'}}>
                    <Typography
                        sx={{textAlign: 'center', justifyContent: 'center', my: 1, fontSize: '15px'}}>Tiền
                        thu hộ</Typography>
                </Grid>

                <Grid item xs={2} sx={{borderRight: 1, borderColor: '#C7C8CC'}}>
                </Grid>

                <Grid item xs={2} sx={{borderRight: 1, borderColor: '#C7C8CC'}}>
                    <Typography
                        sx={{textAlign: 'center', justifyContent: 'center', my: 1, fontSize: '15px'}}>Thời
                        gian dự kiến</Typography>
                </Grid>

                <Grid item xs={4}>
                    <Box sx={{
                        mx: 2,
                        mt: 1,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-evenly'
                    }}>
                        <Typography>
                            <Button onClick={handleSubmit((data) => {
                                onSubmit(data, true);
                            })}>Submit</Button>
                        </Typography>
                        <Typography>
                            <Button sx={{
                                py: 1,
                                textAlign: 'center',
                                fontSize: '13px',
                                width: '100%',
                                fontWeight: 550,
                                color: 'black',
                                backgroundColor: '#C7C8CC'
                            }}>Làm mới</Button>
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </PackageCreateContext.Provider>
    )
}

export default CreatePackage