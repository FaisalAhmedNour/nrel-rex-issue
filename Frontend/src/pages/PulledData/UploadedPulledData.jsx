import React, { useEffect, useState } from 'react';
import CustomTable from '../../Components/CustomTable/CustomTable';
import Pagination from '../../Components/CustomTable/Pagination/Pagination';
// import { fullHeaders, headerKeys, headers } from './lib';
import Body from '../../Components/CustomTable/Body/Body';
import ExportTableButton from './ExportTableButton';
import { FilterButton, FilterComponent } from './FilterButton';
import exportToExcel from '../../Functions/exportToExcel';
import moment from 'moment';
import { Button, Typography } from '@mui/material';
import Swal from 'sweetalert2';
import { LoadingButton } from '@mui/lab';
import { fullHeaders, headerKeys, headers } from '../DataPulling/lib';
import LoaderPage from '../../Components/Loader/LoaderPage';
import ProcessController from '../DataPulling/ProcessController';
import DownloadIcon from '@mui/icons-material/Download';

const UploadedPulledData = ({
    isProcessing,
    handleStop,
    handleOpen,
    isLoading,
    setIsLoading,
    reloadPulledData,
    errorForUploadedPulledData,
    setErrorForUploadedPulledData,
    queryOfUploadedPulledData,
    setQueryOfUploadedPulledData,
    pageOfUploaded,
    setPageOfUploaded,
    rowsPerPageOfUploaded,
    setRowsPerPageOfUploaded,
    totalRowsOfUploaded,
    setTotalRowsOfUploaded,
    tableBodyDataOfUploaded,
    setTableBodyDataOfUploaded,
    tableBodyDataOfPulledFromEngine,
    pageOfPulledFromEngine,
    setPageOfPulledFromEngine,
    rowsPerPageOfPulledFromEngine,
    setRowsPerPageOfPulledFromEngine

}) => {
    const [isDownloadingPulledUploadedData, setIsDownloadingPulledUploadedData] = useState(false);
    const [whichDataToDownload, setWhichDataToDownload] = useState('thisPage');
    const [orderNoToDownload, setOrderNoToDownload] = useState([]);
    const [orderNo, setOrderNo] = useState('');
    const [brandName, setBrandName] = useState('');
    const [ccdFrom, setCcdFrom] = useState(undefined);
    const [ccdTo, setCcdTo] = useState(undefined);
    const [openFilter, setOpenFilter] = useState(false);
    const [isSelectedAll, setIsSelectedAll] = useState(false);
    const [missingON, setMissingON] = useState([]);
    const [isExtractedPO, setIsExtractedPO] = useState(null);
    const [isExtractedPN, setIsExtractedPN] = useState(null);
    const [isSelecting, setIsSelecting] = useState(false);
    const [query, setQuery] = useState({});

    const convertData = (dataToConvert) => {
        // console.log("dataToConvert", dataToConvert);
        const convertedData = dataToConvert?.map((dt) => {
            let row = dt;
            if (typeof dt?.ON != 'string') {
                row = {
                    ...dt,
                    ...dt?.ON,
                    ON: dt?.ON?.ON
                }
            }
            const data = {};
            headerKeys.forEach(header => {
                data[headers[header]] = (header === 'QTY') ?
                    Number(row?.[header]) || row?.[header] :
                    (header === 'CCD' || header === 'CD') ?
                        moment(row?.[header]).format('DD-MMM-YYYY') || row?.[header] :
                        (header) === 'PN' ?
                            (Array.isArray(row?.[header]) ?
                                (row?.[header].length === 0 || row?.[header] === null ?
                                    '' :
                                    row?.[header]?.map(e => e?.PNN)?.join(', ')) :
                                JSON.stringify(row?.[header])) :
                            (typeof row?.[header] === 'boolean') ?
                                (row?.[header] === true ? 'Yes' : 'No') :
                                row?.[header]
            });
            data["Sl No"] = Number(row?.SL);
            data['Update Date'] = moment(row?.u_d).format('DD-MMM-YYYY');
            data['Is PO Downloaded'] = row?.PPI ? 'Y' : 'N';
            data['Is PNPL Downloaded'] = row?.PN && Array.isArray(row?.PN) && row?.PN?.length > 0 && (row?.PN?.[0]?.NW && row?.PN?.[0]?.GW) ? 'Y' : 'N';
            // data['Is PNPL Extracted'] = row?.NW && row?.GW ? 'Y' : 'N';
            return data;
        });
        // console.log(dataToConvert, convertedData);
        // console.log('convert end');
        return convertedData;
    }

    // const onChangePage = async (newPage) => {
    //     setPageOfUploaded(newPage);
    //     const qr = {
    //         ...queryOfUploadedPulledData,
    //         page: newPage,
    //         perPage: rowsPerPageOfUploaded,
    //     }
    //     // console.log(newPage, data)
    //     const data = await fetchUploadedData(qr);
    //     const convertedData = convertData(data?.items);
    //     setTotalRowsOfUploaded(data?.query?.total);
    //     setTableBodyDataOfUploaded(convertedData);
    //     // setDataToDownload(convertedData);
    // };
    const onChangePage = async (newPage) => {
        setPageOfPulledFromEngine(newPage);
        // const qr = {
        //     ...queryOfUploadedPulledData,
        //     page: newPage,
        //     perPage: rowsPerPageOfUploaded,
        // }
        // // console.log(newPage, data)
        // const data = await fetchUploadedData(qr);
        // const convertedData = convertData(data?.items);
        // setTotalRowsOfUploaded(data?.query?.total);
        // setTableBodyDataOfUploaded(convertedData);
        // setDataToDownload(convertedData);
    };

    // const onChangeRowsPerPage = async (value) => {
    //     setRowsPerPageOfUploaded(value);
    //     setPageOfUploaded(0);
    //     const data = await fetchUploadedData({
    //         ...queryOfUploadedPulledData,
    //         page: 0,
    //         perPage: value,
    //     });
    //     const convertedData = convertData(data?.items);
    //     setTotalRowsOfUploaded(data?.query?.total);
    //     setTableBodyDataOfUploaded(convertedData);
    //     // whichDataToDownload === "thisPage" && setDataToDownload(convertedData);
    // };
    const onChangeRowsPerPage = async (value) => {
        setRowsPerPageOfPulledFromEngine(value);
        setPageOfPulledFromEngine(0);
        // const data = await fetchUploadedData({
        //     ...queryOfUploadedPulledData,
        //     page: 0,
        //     perPage: value,
        // });
        // const convertedData = convertData(data?.items);
        // setTotalRowsOfUploaded(data?.query?.total);
        // setTableBodyDataOfUploaded(convertedData);
        // whichDataToDownload === "thisPage" && setDataToDownload(convertedData);
    };

    const handleError = (message) => {
        // console.error(message);
        setErrorForUploadedPulledData(message);
    };

    // const fetchUploadedData = async (query) => {
    //     try {
    //         // console.log('fetch start');
    //         setIsLoading(true);
    //         // setQueryOfUploadedPulledData(query);
    //         let urlQueries = new URLSearchParams(query).toString();
    //         // const result = await getUploadedFileDataOfProcess(urlQueries);
    //         const result = await window.engine.Proxy("/process/PO/combine?" + urlQueries, 'get');
    //         console.log(urlQueries, result);
    //         if (result?.status < 400) {
    //             return result.data;
    //         } else {
    //             handleError(result?.statusText);
    //             console.log("error", result?.statusText);
    //         }
    //     } catch (error) {
    //         handleError(error?.response?.data?.message);
    //         console.log('error', error?.response?.data?.message);
    //     } finally {
    //         setIsLoading(false);
    //         // console.log('fetch end');
    //     }
    // }



    // const setFetchedDataToDownload = async (qr) => {
    //     const data = await fetchUploadedData({
    //         ...qr
    //     });
    //     // console.log("qr", qr);
    //     const convertedData = convertData(data?.items);
    //     // setDataToDownload(convertedData);
    //     handleDownload(convertedData);
    // }

    // useEffect(() => {
    //     const initialFetchRequest = async () => {
    //         const data = await fetchUploadedData({
    //             page: 0,
    //             perPage: rowsPerPageOfUploaded
    //         });
    //         const convertedData = convertData(data?.items);
    //         // console.log("convertedData", convertedData);
    //         setTotalRowsOfUploaded(data?.query?.total);
    //         setTableBodyDataOfUploaded(convertedData);
    //         // setDataToDownload(convertedData);
    //         handleError("");
    //     }
    //     initialFetchRequest();
    // }, [reloadPulledData]);

    const handleSetOrderNo = (value) => {
        const arrayOfValues = value.split(' ').join(',');
        // console.log(value, arrayOfValues);
        setOrderNo(arrayOfValues);
    }

    const handleSetBrandName = (value) => {
        setBrandName(value);
    }

    const handleSelectTheseData = async (e, qr = query, totalRow = totalRowsOfUploaded) => {
        try {
            // console.log("select start");
            setMissingON([]);
            setIsSelecting(true);
            const data = await fetchUploadedData({
                ...qr,
                page: 0,
                perPage: totalRow
            });
            // console.log("data", data)
            const missingElements = qr.ON && qr.ON.split(',').filter(item => !data?.items?.some(obj => obj.ON === item));
            // handleSelectTheseData(qr, data?.query?.total);
            if (missingElements?.length > 0) {
                setMissingON(missingElements);
                Swal.fire({
                    icon: "info",
                    title: "Missing",
                    text: `${missingElements.map((ele) => `"${ele}"`)} are missing.`,
                });
            }
            const POPNObj = data?.items && data?.items.map(item => (item?.ON));
            const filteredPOPNObj = POPNObj.filter(item => item !== undefined);
            // console.log("filteredPOPNObj", filteredPOPNObj);
            setOrderNoToDownload(filteredPOPNObj);
            setIsSelecting(false);
        }
        catch (error) {
            console.log(error);
            setIsLoading(false);
            // console.log("select end");
        }
    }

    const handleSubmit = async () => {
        setIsLoading(true);
        const qr = {}
        if (orderNo !== '') {
            qr.ON = orderNo
        }
        if (ccdFrom !== undefined) {
            qr.ccdFrom = moment(ccdFrom).startOf('day').toISOString()
        }
        if (ccdTo !== undefined) {
            qr.ccdTo = moment(ccdTo).endOf('day').toISOString()
        }
        if (brandName !== '') {
            qr.BN = brandName
        }
        if (isExtractedPO !== null) {
            qr.isPOEx = isExtractedPO;
        }
        if (isExtractedPN !== null) {
            qr.isPNEx = isExtractedPN;
        }
        // console.log('qr', qr);
        const data = await fetchUploadedData({
            ...qr,
            page: 0,
            perPage: rowsPerPageOfUploaded
        });
        // console.log("data", data)
        if (data?.query?.total > 0) {
            setQuery(qr);
            setQueryOfUploadedPulledData(qr);
            // handleSelectTheseData(qr, data?.query?.total);
        }
        setPageOfUploaded(0);
        const convertedData = data?.items.length > 0 ? convertData(data?.items) : [];
        setTotalRowsOfUploaded(data?.query?.total);
        // console.log('convertedData', convertedData)
        setTableBodyDataOfUploaded(convertedData);
        setIsLoading(false);
    }

    const handleClear = async () => {
        setOrderNo('');
        setCcdFrom(undefined);
        setCcdTo(undefined);
        setBrandName(undefined);
        setOrderNoToDownload([]);
        setPageOfUploaded(0);
        setIsExtractedPN(null);
        setIsExtractedPO(null);
        setQuery({});

        const data = await fetchUploadedData({
            page: 0,
            perPage: rowsPerPageOfUploaded
        });
        const convertedData = convertData(data?.items);
        setTotalRowsOfUploaded(data?.query?.total);
        setTableBodyDataOfUploaded(convertedData);
        // setWhichDataToDownload('thisPage');
        // setDataToDownload(convertedData);
    }

    const handleSelectRow = (index) => {
        const value = tableBodyDataOfUploaded?.[index]?.['Order No'];
        if (orderNoToDownload.includes(value)) {
            setOrderNoToDownload(orderNoToDownload.filter(orderNo => orderNo !== value));
        }
        else {
            setOrderNoToDownload([...orderNoToDownload, value]);
        }
    }

    const handleSelectAllRow = () => {
        const orderNos = tableBodyDataOfUploaded.map(data => data['Order No']);
        if (orderNos?.every(item => orderNoToDownload.includes(item))) {
            setOrderNoToDownload([]);
        }
        else {
            const data = [];
            orderNos.forEach(no => orderNoToDownload.includes(no) === false && data.push(no))
            setOrderNoToDownload(prev => [...prev, ...data]);
        }
    }

    if (errorForUploadedPulledData) {
        return (
            <Typography
                fontSize={14}
                sx={{
                    textAlign: "center",
                }}
            >
                Error: {errorForUploadedPulledData}
            </Typography>
        );
    }

    const handleExport = (t) => {

        // switch (t) {
        //     case 'thisPage':
        //         // setDataToDownload(tableBodyDataOfUploaded);
        //         return handleDownload(tableBodyDataOfUploaded);
        //     case 'selected':
        //         setFetchedDataToDownload({
        //             page: 0,
        //             perPage: orderNoToDownload?.length,
        //             ON: orderNoToDownload
        //         })
        //         return;
        //     case 'all':
        //         // console.log(';ajhio')
        //         const qr = queryOfUploadedPulledData
        //         setFetchedDataToDownload({
        //             ...queryOfUploadedPulledData,
        //             page: 0,
        //             perPage: totalRowsOfUploaded,
        //         })
        //         return;
        //     default: return handleDownload(tableBodyDataOfUploaded)
        // }
    }

    // useEffect(() => {
    //     // console.log("orderNoToDownload", orderNoToDownload);
    //     // console.log("ll", tableBodyDataOfUploaded?.every(item => orderNoToDownload.includes(item['Order No'])))
    //     if (tableBodyDataOfUploaded?.every(item => orderNoToDownload.includes(item['Order No']))) {
    //         setIsSelectedAll(true);
    //     }
    //     else {
    //         setIsSelectedAll(false);
    //     }
    // }, [orderNoToDownload, tableBodyDataOfUploaded]);

    const isChecked = (row) => {
        // console.log('check', row, orderNoToDownload, orderNoToDownload.includes(row?.['Order No']));
        return orderNoToDownload.includes(row?.['Order No']);
    }

    const handleDownload = () => {
        exportToExcel(
            tableBodyDataOfPulledFromEngine,
            fullHeaders,
            'Response Data',
            setIsDownloadingPulledUploadedData,
            true
        )
    }

    return (
        <>
            <LoaderPage open={isLoading} />
            <CustomTable
                headerTitle={"Response Data"}
                headerButtons={[
                    <>
                        {isProcessing ?
                            <Button
                                size='small'
                                variant='contained'
                                onClick={handleStop}
                                color='error'
                                sx={{
                                    height: 25,
                                    textTransform: 'capitalize',
                                    gap: .5,
                                    // bgcolor: 'error.main',
                                    color: 'white',
                                    // ":hover": {
                                    //     // bgcolor: 'error.main',
                                    // }
                                }}
                            >Stop</Button> :
                            <Button
                                size='small'
                                variant='contained'
                                onClick={handleOpen}
                                color='success'
                                sx={{
                                    height: 25,
                                    textTransform: 'capitalize',
                                    gap: .5,
                                    // bgcolor: 'primary.main',
                                    // color: 'white',
                                    // ":hover": {
                                    //     // bgcolor: 'primary.main',
                                    // }
                                }}
                            >Start</Button>
                        }
                    </>,
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        sx={{ height: 25 }}
                        onClick={handleDownload}
                    // disabled={isDownloading}
                    >
                        Export
                    </Button>
                    // <ExportTableButton
                    //     isDownloading={isDownloadingPulledUploadedData}
                    //     handleExport={handleDownload}
                    // />
                ]}
                pagination={<Pagination
                    page={pageOfPulledFromEngine}
                    rowsPerPage={rowsPerPageOfPulledFromEngine}
                    totalRows={tableBodyDataOfPulledFromEngine?.length || 0}
                    onChangePage={onChangePage}
                    onChangeRowsPerPage={onChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25, 50, 100, 500]}
                // leftButtons={[]}
                />}

                body={<Body
                    // isSelectOption={true}
                    headers={fullHeaders}
                    bodyData={console.log("tableBodyDataOfPulledFromEngine", tableBodyDataOfPulledFromEngine) || tableBodyDataOfPulledFromEngine?.slice((pageOfPulledFromEngine * rowsPerPageOfPulledFromEngine), (pageOfPulledFromEngine * rowsPerPageOfPulledFromEngine) + rowsPerPageOfPulledFromEngine)}
                // isChecked={isChecked}
                // handleSelectRow={handleSelectRow}
                // handleSelectAllRow={handleSelectAllRow}
                // isSelectedAll={isSelectedAll}
                />}
            />
        </>
    );
};

export default UploadedPulledData;