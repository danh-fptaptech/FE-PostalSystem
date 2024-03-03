/*
'use client'
import { DataFeeCustomType } from "@/helper/interface";
import { useEffect, useState } from "react"
import * as React from 'react';
import { Button} from "@mui/material";
import { useRouter } from 'next/navigation'



export default function FeeCustomPage() {
    const router = useRouter();
    const [data, setData] = useState<DataFeeCustomType[]>([]);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/FeeCustom');
            const resData = await res.json();
            const data = resData.data;
            setData(data);
        } catch (error) {
            return { error: "api backend error" };
        }
    }
    useEffect(() => {
        fetchData();
    }, []);

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            width: 70,
            type: 'number',
        },
        {
            field: 'serviceId',
            headerName: 'Service',
            width: 200,
            type: 'number',
            valueGetter: (params) => params.row.service.serviceName || '',
        },
        {
            field: 'locationIdFrom',
            headerName: 'From',
            width: 150,
            valueGetter: (params) => params.row.locationFrom.locationName || '',
        },
        {
            field: 'locationIdTo',
            headerName: 'To',
            width: 150,
            valueGetter: (params) => params.row.locationTo.locationName || '',
        },
        {
            field: 'distance',
            headerName: 'Distance',
            width: 70,
            type: 'number',
        },
        {
            field: 'feeCharge',
            headerName: 'Fee Charge',
            width: 100,
            type: 'number',
        },
        {
            field: 'timeProcess',
            headerName: 'Time Process (Hours)',
            width: 150,
            type: 'number',
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 100,
            valueGetter: (params) => {
                const status = params.row.status === 1 ? 'Active' : 'Inactive';
                return status;
            },
        },
    ];
    return (
        <div>
            <h1 className="text-4xl text-center antialiased font-semibold mt-5 mb-5"> Services Managerment</h1>
            <hr/>
            <Button
                variant="contained"
                onClick={() => router.push('/app/Feecustom/Manager')}
            > Create/Update</Button>
            <div style={{ height: '100%', width: '100%', marginTop: '10px' }}>
                <DataGrid
                    rows={data}
                    columns={columns}
                    loading={data.length === 0}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                    autoHeight
                    sx={{
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: 'primary.main',
                            color: '#ffffff',
                        },
                    }}
                />
            </div>
        </div>

    );
}*/
