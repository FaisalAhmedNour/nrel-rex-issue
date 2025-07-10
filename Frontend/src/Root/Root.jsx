// Faisal (C) 7 April 2025

import React, { useEffect, useRef, useState } from 'react';
import DataPulling from '../pages/DataPulling/DataPulling';
import UploadedPulledData from '../pages/PulledData/UploadedPulledData';
// import { convertToISODate } from '../Functions/DateConvertion';
// import { headerKeysForPulling, headersForPulling } from '../pages/DataPulling/lib';
import Swal from 'sweetalert2';
import { headerKeys, headers } from '../pages/DataPulling/lib';
import moment from 'moment';
// import PulledDataFromEngine from '../pages/DataPulling/PulledDataFromEngine';

const Root = () => {
    // tab
    const [value, setValue] = useState(0);
    // engine
    const [engineStatus, setEngineStatus] = useState(null);
    // flag
    const [isProcessing, setIsProcessing] = useState(false);
    const [isStartVisible, setIsStartVisible] = useState(true);
    const [isUploadButtonVisible, setIsUploadButtonVisible] = useState(false);
    const [isExpandStatus, setIsExpandStatus] = useState(false);
    // form data
    const [excelPath, setExcelPath] = useState(null);
    const [folderPath, setFolderPath] = useState(null);
    // loading
    const [isLoading, setIsLoading] = useState(false);
    // error
    const [uploadError, setUploadError] = useState(null);
    const [engineError, setEngineError] = useState(null);
    // reload
    const [reloadPulledData, setReloadPulledData] = useState(false);
    const [reloadUploadedData, setReloadUploadedData] = useState(false);
    // pulled Data table from engine
    const [pageOfPulledFromEngine, setPageOfPulledFromEngine] = useState(0);
    const [rowsPerPageOfPulledFromEngine, setRowsPerPageOfPulledFromEngine] = useState(5);
    const [tableBodyDataOfPulledFromEngine, setTableBodyDataOfPulledFromEngine] = useState([]);
    const [originalTableBodyDataOfPulledFromEngine, setOriginalTableBodyDataOfPulledFromEngine] = useState([]);
    // pulled data table
    const [pageOfUploaded, setPageOfUploaded] = useState(0);
    const [rowsPerPageOfUploaded, setRowsPerPageOfUploaded] = useState(10);
    const [totalRowsOfUploaded, setTotalRowsOfUploaded] = useState(0);
    const [tableBodyDataOfUploaded, setTableBodyDataOfUploaded] = useState([]);
    const [tableHeadersOfUploaded, setTableHeadersOfUploaded] = useState([]);
    const [errorForUploadedPulledData, setErrorForUploadedPulledData] = useState(null);
    const [queryOfUploadedPulledData, setQueryOfUploadedPulledData] = useState({ page: 0, setPage: 5 });
    // Modal
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Engine start signal
    const getEngineOnSignal = () => {
        window.engine.onProcessStart(function (message) {
            setIsProcessing(true);
        });
    };
    // engine stop signal
    const getEngineOffSignal = () => {
        window.engine.onProcessStop(function (message) {
            setIsProcessing(false);
            // setReloadPulledData(prev => !prev);
        });
    };

    const handleUploadPart = async (data) => {
        const uploadedFileData = {
            scope: 'SS',
            data: data,
        };
        console.log("uploadedFileData", uploadedFileData);
        try {
            const result = await window.engine.Proxy("/process/PO/data", 'post', uploadedFileData);
            console.log('Upload result', result);

            if (result?.data?.success === true) {
                // setIsUploadButtonVisible(false);
                setReloadPulledData(prev => !prev);
                // setFinalData([]); // Reset the final data after successful upload
            }
            else {
                throw new Error(result.data.message || "Failed to upload. Please try again.");
            }
        } catch (error) {
            console.error("Upload failed: ", error);
            Swal.fire({
                title: "Failed!",
                text: error?.message || error?.data?.message || "Failed to upload. Please try again.",
                icon: "error",
            });
        }
    };

    const bufferRef = useRef([]);
    const timerRef = useRef(null);

    useEffect(() => {
        getEngineOnSignal();
        getEngineOffSignal();

        let isMounted = true;

        const flushBuffer = () => {
            if (bufferRef.current.length > 0 && isMounted) {
                handleUploadPart(bufferRef.current);
                bufferRef.current = [];
            }
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        };
        const handleTableData = (dt) => {
            console.log('row', dt);
            if (!isMounted) return;

            // Ensure SL NO is correct even with fast data: use a static counter, reset on process start
            if (typeof window.__slno_counter === "undefined" || window.__slno_counter === null) {
                window.__slno_counter = 1;
            }
            const data = headerKeys.reduce((acc, header) => {
                if (header === 'Success') {
                    acc[headers[header]] = dt[header] === 'true' ? 'Succeed' : 'Failed';
                }
                else if (header === 'SL NO') {
                    acc[headers[header]] = window.__slno_counter;
                }
                else if (header === 'Gross Weight') {
                    acc[headers[header]] = Number(dt[header]).toFixed(2);
                } else if (header === "Shipment Date↵(mm/dd/yyyy)") {
                    if (dt[`Shipment Date
(mm/dd/yyyy)`]) {
                        acc[headers[header]] = moment(dt[`Shipment Date
(mm/dd/yyyy)`], moment.ISO_8601, true).isValid() ? moment(dt[`Shipment Date
(mm/dd/yyyy)`]).format('DD-MMM-YYYY') : dt[`Shipment Date
(mm/dd/yyyy)`];
                    } else {
                        acc[headers[header]] = dt[`Shipment Date
(mm/dd/yyyy)`];
                    }
                }
                else {
                    acc[headers[header]] = dt[header];
                }
                return acc;
            }, {});
            window.__slno_counter += 1;
            setTableBodyDataOfPulledFromEngine(prev => [...prev, data]);
        };

        window.engine.onTableData(handleTableData);

        return () => {
            isMounted = false;
        };
    }, []);

    // trigger engine start
    const startEngine = async (data) => {
        // console.log("data", data);
        try {
            // console.log("data", data);
            // setOriginalTableBodyDataOfPulledFromEngine([]);
            // setTableBodyDataOfPulledFromEngine([]);
            const p = await window.engine.startProcess(data);
            // console.log(p)
            if (p.success === true) {
                setEngineStatus("Started");
                setIsProcessing(true);
                setTableBodyDataOfPulledFromEngine([]);
                window.__slno_counter = 1;
            } else {
                setEngineStatus("Start Failed");
            }
        } catch (e) {
            console.log(e);
        }
    };

    const handleStart = async (e) => {
        e.preventDefault();
        handleClose();
        const data = {
            excelPath: excelPath,
            documentPath: folderPath,
            documentSavePath: folderPath,
        };
        startEngine(data);
    }
    // trigger engine stop
    const handleStop = async () => {
        const p = await window.engine.stopProcess();
        if (p.success === true) {
            setEngineStatus("Stopped");
            setIsProcessing(false);
        }
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className='overflow-hidden'>
            <DataPulling
                // from={from}
                // setFrom={setFrom}
                // to={to}
                // setTo={setTo}
                open={open}
                handleClose={handleClose}
                isExpandStatus={isExpandStatus}
                setIsExpandStatus={setIsExpandStatus}
                engineStatus={engineStatus}
                engineError={engineError}
                handleStop={handleStop}
                handleStart={handleStart}
                isLoading={isLoading}
                isProcessing={isProcessing}
                isStartVisible={isStartVisible}
                setExcelPath={setExcelPath}
                excelPath={excelPath}
                setFolderPath={setFolderPath}
                folderPath={folderPath}
            // setIsLoading={setIsLoading}
            // uploadError={uploadError}
            // setUploadError={setUploadError}
            // setReloadPulledData={setReloadPulledData}
            // isUploadButtonVisible={isUploadButtonVisible}
            // setIsUploadButtonVisible={setIsUploadButtonVisible}
            // pageOfPulledFromEngine={pageOfPulledFromEngine}
            // setPageOfPulledFromEngine={setPageOfPulledFromEngine}
            // rowsPerPageOfPulledFromEngine={rowsPerPageOfPulledFromEngine}
            // setRowsPerPageOfPulledFromEngine={setRowsPerPageOfPulledFromEngine}
            // tableBodyDataOfPulledFromEngine={tableBodyDataOfPulledFromEngine}
            // setTableBodyDataOfPulledFromEngine={setTableBodyDataOfPulledFromEngine}
            // originalTableBodyDataOfPulledFromEngine={originalTableBodyDataOfPulledFromEngine}
            // setOriginalTableBodyDataOfPulledFromEngine={setOriginalTableBodyDataOfPulledFromEngine}
            />
            {/* <PulledDataFromEngine
                isProcessing={isProcessing}
                handleStop={handleStop}
                handleOpen={handleOpen}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                errorForUploadedPulledData={errorForUploadedPulledData}
            /> */}
            <UploadedPulledData
                isProcessing={isProcessing}
                handleStop={handleStop}
                handleOpen={handleOpen}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                errorForUploadedPulledData={errorForUploadedPulledData}
                setErrorForUploadedPulledData={setErrorForUploadedPulledData}
                queryOfUploadedPulledData={queryOfUploadedPulledData}
                setQueryOfUploadedPulledData={setQueryOfUploadedPulledData}
                reloadPulledData={reloadPulledData}
                pageOfUploaded={pageOfUploaded}
                setPageOfUploaded={setPageOfUploaded}
                rowsPerPageOfUploaded={rowsPerPageOfUploaded}
                setRowsPerPageOfUploaded={setRowsPerPageOfUploaded}
                totalRowsOfUploaded={totalRowsOfUploaded}
                setTotalRowsOfUploaded={setTotalRowsOfUploaded}
                tableBodyDataOfUploaded={tableBodyDataOfUploaded}
                setTableBodyDataOfUploaded={setTableBodyDataOfUploaded}
                tableHeadersOfUploaded={tableHeadersOfUploaded}
                setTableHeadersOfUploaded={setTableHeadersOfUploaded}
                tableBodyDataOfPulledFromEngine={tableBodyDataOfPulledFromEngine}
                pageOfPulledFromEngine={pageOfPulledFromEngine}
                setPageOfPulledFromEngine={setPageOfPulledFromEngine}
                rowsPerPageOfPulledFromEngine={rowsPerPageOfPulledFromEngine}
                setRowsPerPageOfPulledFromEngine={setRowsPerPageOfPulledFromEngine}
            />

        </div>
    );
};

export default Root;
