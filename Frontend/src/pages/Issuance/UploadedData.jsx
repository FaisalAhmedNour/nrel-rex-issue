// Faisal Ahmed (C)
// Faisal Ahmed (M) - 13 Oct 2025

import { useEffect, useState } from 'react';
import CustomTable from '../../Components/CustomTable/CustomTable';
import { fullHeaders, headerKeys, headers } from './lib';
import Pagination from '../../Components/CustomTable/Pagination/Pagination';
import Body from '../../Components/CustomTable/Body/Body';
import Button from '@mui/material/Button';
import { heightLightButton } from '../../lib';
import Swal from 'sweetalert2';
import moment from 'moment';
import ExportExcelButton from '../../Components/ExportExcelButton';
import { FilterButton, FilterComponent } from './FillterComponent';
import ReplayIcon from '@mui/icons-material/Replay';

const UploadedData = ({
    isLoading,
    setIsLoading,
    isProcessing,
    pageOfUploaded,
    setPageOfUploaded,
    rowsPerPageOfUploaded,
    setRowsPerPageOfUploaded,
    totalRowsOfUploaded,
    setTotalRowsOfUploaded,
    tableBodyDataOfUploaded,
    setTableBodyDataOfUploaded,
    queryOfUploadedData,
    setQueryOfUploadedData,
    handleOpen,
    handleStop,
    filterOpenOfUploadedData,
    setFilterOpenOfUploadedData,
    formDataOfUploadedData,
    setFormDataOfUploadedData,
}) => {
    const onChangePage = (newPage) => {
        setQueryOfUploadedData({ ...queryOfUploadedData, page: newPage });
    };

    const onChangeRowsPerPage = (row) => {
        setQueryOfUploadedData({ ...queryOfUploadedData, page: 0, perPage: row });
    };

    const formatData = (allData) => {
        return allData?.map((data, index) => {
            const row = {};
            headerKeys.forEach((key) => {
                if (key === "validated") {
                    row[headers[key]] = data[key] ? 'Yes' : 'No';
                } else if (key === "SL") {
                    row[headers[key]] = index + 1;
                } else if (key === "BLdate" || key === "LCdate" || key === "UDdate" || key === "billOfExpDate" || key === "invDate" || key === "EXPd") {
                    row[headers[key]] = moment(data[key]).format("DD-MMM-YYYY");
                } else {
                    row[headers[key]] = data[key];
                }
            });
            return row;
        });
    }

    const getResisterData = async (qr = queryOfUploadedData) => {
        setIsLoading(true);
        const query = { ...qr };
        const queryUrl = new URLSearchParams(query).toString();;
        try {
            const result = await window?.engine?.Proxy("/process/REX/data?" + queryUrl, 'get');
            console.log("payload", query, "/process/REX/data?" + queryUrl, "get result", result);
            if (result?.status >= 200 && result?.status < 300) {
                const formattedData = formatData(result?.data?.items);
                setTableBodyDataOfUploaded(formattedData);
                setTotalRowsOfUploaded(result?.data?.total);
                setIsLoading(false);
            } else {
                console.log(result);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: result?.data?.message || "Failed to get uploaded Rex Data!",
                });
            }
            // console.log(result);
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error?.message || "Failed to get uploaded Rex Data!",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const fetch = () => {
        getResisterData(queryOfUploadedData);
    }

    useEffect(() => {
        fetch();
    }, [JSON.stringify(queryOfUploadedData)]);

    const handleCancel = () => {
        setFormDataOfUploadedData({ type: 'all' });
        setQueryOfUploadedData({ page: 0, perPage: queryOfUploadedData.perPage, getTotal: "1" });
        setFilterOpenOfUploadedData(false);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const query = {};
        query.page = queryOfUploadedData.page;
        query.perPage = queryOfUploadedData.perPage;
        if (formDataOfUploadedData.ExpNo) {
            query.ExpNo = formDataOfUploadedData.ExpNo
        }
        if (formDataOfUploadedData.SoO) {
            query.SoO = formDataOfUploadedData.SoO
        }
        if (formDataOfUploadedData.type === 'verified') {
            query.validated = "1";
            query.finalized = "0";
        }
        else if (formDataOfUploadedData.type === 'issued') {
            query.validated = "1";
            query.finalized = "1";
        }
        // console.log("query", query);
        setQueryOfUploadedData(query);
    }

    const getEngineOffSignal = () => {
        window.engine.onProcessStop(function (message) {
            fetch();
        });
    };

    useEffect(() => {
        getEngineOffSignal();
        // return false;
    }, []);

    return (
        <CustomTable
            className={'px-2 mt-1'}
            headerTitle={"Uploaded Rex Data"}
            headerButtons={[
                <>
                    {isProcessing ?
                        <Button
                            size='small'
                            variant='contained'
                            onClick={handleStop}
                            color='error'
                            sx={{ height: 25 }}
                        >Stop</Button> :
                        <div className='flex justify-center items-center gap-1'>
                            <Button
                                size='small'
                                variant='contained'
                                color='success'
                                sx={heightLightButton}
                                onClick={() => handleOpen("verify")}
                            >
                                Start Verify
                            </Button>
                            <Button
                                size='small'
                                variant='contained'
                                color='success'
                                sx={heightLightButton}
                                onClick={() => handleOpen("payslip")}
                            >
                                Start Issue
                            </Button>
                        </div>
                    }
                </>
            ]}
            pagination={<Pagination
                page={queryOfUploadedData?.page}
                rowsPerPage={queryOfUploadedData?.perPage}
                totalRows={tableBodyDataOfUploaded?.length || 0}
                onChangePage={onChangePage}
                onChangeRowsPerPage={onChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                leftButtons={[
                    <FilterButton setOpenFilter={setFilterOpenOfUploadedData} />,
                    <>{
                        tableBodyDataOfUploaded?.length > 0 &&
                        <ExportExcelButton
                            data={tableBodyDataOfUploaded}
                            headers={fullHeaders}
                            filename={'REX Data'}
                            includeTable={true}
                        />
                    }</>,
                    <>{
                        <Button
                            size='small'
                            variant='outlined'
                            // color='error'
                            sx={{ height: 25 }}
                            onClick={fetch}
                            startIcon={<ReplayIcon />}
                        >
                            Reload
                        </Button>
                    }</>
                ]}
            />}
            body={<Body
                headers={fullHeaders}
                bodyData={tableBodyDataOfUploaded?.slice(queryOfUploadedData?.page * queryOfUploadedData?.perPage, (queryOfUploadedData?.page * queryOfUploadedData?.perPage) + queryOfUploadedData?.perPage)}
            />}
            openLeft={filterOpenOfUploadedData}
            leftDrawer={<FilterComponent
                openFilter={filterOpenOfUploadedData}
                setOpenFilter={setFilterOpenOfUploadedData}
                handleClear={handleCancel}
                handleSubmit={handleSubmit}
                formData={formDataOfUploadedData}
                setFormData={setFormDataOfUploadedData}
            />}
        />
    );
};

export default UploadedData;