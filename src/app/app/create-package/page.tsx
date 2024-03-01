'use client'
import {BottomNavigation, Box, Button, Grid, Paper, Typography} from '@mui/material'
import React, {useEffect, useMemo, useState} from 'react'
import BoxInputInfo from "@/components/BoxInputInfo";
import {useForm} from "react-hook-form";
import {PackageCreateContext} from "@/context/PackageCreateContext";
import {DataCreatePackage} from "@/models/DataCreatePackage";
import FormGoodsInfo from "@/components/FormGoodsInfo";
import {Item} from "@/models/Item";
import Toolbar from "@mui/material/Toolbar";

const CreatePackage = () => {
    const {
        register,
        handleSubmit,
        formState: {errors},
        control,
        watch,
        resetField
    } = useForm(
        {
            mode: "onBlur",
        }
    );

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
        type_sender: "select",
        type_receiver: "select",
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
        size_convert: ""
    });

    const createItem = () => {
        const newItem = {
            itemName: "",
            itemWeight: "",
            itemQuantity: 1,
            itemValue: ""
        }
        // @ts-ignore
        setFormData({...formData, list_items: [...formData.list_items, newItem]});
    }

    const removeItem = (index: number) => {
        // @ts-ignore
        setFormData({...formData, list_items: formData.list_items.filter((_, i) => i !== index)});
    }

    const updateItem = (index: number, event : React.ChangeEvent<HTMLInputElement>) => {
        // @ts-ignore
        const newFormData = {...formData};
        let key =  (event.target?.name).split("_")[0];
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

    useEffect(() => {
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

    const dataCreate = useMemo(() => {
        return {
            province_sender: formData?.province_sender,
            district_sender: formData?.district_sender,
            ward_sender: formData?.ward_sender,
            province_receiver: formData?.province_receiver,
            district_receiver: formData?.district_receiver,
            ward_receiver: formData?.ward_receiver,
        }
    }, [formData]);


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

    const onSubmit = (data: any) => {
        if (Object.keys(errors).length === 0) {
            console.log("Data:", data);
        }
    };

    useEffect(() => {
        // @ts-ignore
        setFormData({...formData, ward_sender: "", district_sender: ""});
    }, [formData?.province_sender]);

    useEffect(() => {
        // @ts-ignore
        setFormData({...formData, ward_sender: ""});
    }, [formData?.district_sender]);

    useEffect(() => {
        console.log("Value:", formData);
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
                updateItem
            }}>
            <Grid container spacing={3} columns={12}>
                <Grid item lg={6} sm={12}>
                    <BoxInputInfo typeBox={"sender"} xs={{
                        my: 3
                    }}/>
                    <BoxInputInfo typeBox={"receiver"} xs={{
                        my: 3
                    }}/>
                </Grid>
                <Grid item lg={6} sm={12}>
                    <FormGoodsInfo/>
                </Grid>
            </Grid>
            <Toolbar/>
            <Paper sx={{position: 'fixed', bottom: 0, left: 0, right: 0, pb: 1}} elevation={3}>
                <BottomNavigation>
                    <Grid container>
                        <Grid item xs={2} sx={{borderRight: 1, borderColor: '#C7C8CC'}}>
                            <Typography sx={{textAlign: 'center', justifyContent: 'center', my: 1, fontSize: '15px'}}>Tổng
                                cước</Typography>
                            <Typography sx={{
                                textAlign: 'center',
                                justifyContent: 'center',
                                my: 1,
                                fontSize: '15px'
                            }}> đ</Typography>
                        </Grid>

                        <Grid item xs={2} sx={{borderRight: 1, borderColor: '#C7C8CC'}}>
                            <Typography sx={{textAlign: 'center', justifyContent: 'center', my: 1, fontSize: '15px'}}>Tiền
                                thu hộ</Typography>
                        </Grid>

                        <Grid item xs={2} sx={{borderRight: 1, borderColor: '#C7C8CC'}}>
                        </Grid>

                        <Grid item xs={2} sx={{borderRight: 1, borderColor: '#C7C8CC'}}>
                            <Typography sx={{textAlign: 'center', justifyContent: 'center', my: 1, fontSize: '15px'}}>Thời
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
                                    <Button onClick={handleSubmit(onSubmit)}>Submit</Button>
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
                </BottomNavigation>
            </Paper>
        </PackageCreateContext.Provider>
    )
}

export default CreatePackage