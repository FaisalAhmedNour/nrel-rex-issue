// Faisal Ahmed (C)
// Faisal Ahmed (M) - 13 Oct 2025

import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import ClearIcon from '@mui/icons-material/Clear';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { headerKeys, headers } from './lib';
import ProcessController from './ProcessController';
import TimerSection from '../../Components/TimerSection';
import MessageTable from '../../Components/MessageTable';
import PulledDataFromEngine from './PulledDataFromEngine';
import FormatDownload from '../../Components/FormatDownload';
import SettingForModule from '../../Components/SettingForModule/SettingForModule';
import StickyInstructions from '../../Components/StickyInstructions/StickyInstructions';
import UploadedData from './UploadedData';

const Issuance = ({
    isExpandStatusForExternal,
    setIsExpandStatusForExternal,
    isExpandTimerForExternal,
    setIsExpandTimerForExternal,
    isExpandMiniTimerForExternal,
    setIsExpandMiniTimerForExternal,
    isExpandMessageForExternal,
    setIsExpandMessageForExternal,
    secondsForExternal,
    setSecondsForExternal,
    succeedForExternal,
    setSucceedForExternal,
    isLoading,
    setIsLoading,
    isProcessing,
    setIsProcessing,
    pageOfPulledFromEngine,
    setPageOfPulledFromEngine,
    rowsPerPageOfPulledFromEngine,
    setRowsPerPageOfPulledFromEngine,
    tableBodyDataOfPulledFromEngine,
    setTableBodyDataOfPulledFromEngine,
    setPageToShow,
    setLibrary,
    chanel,
    setChanel,
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
    filterOpenOfUploadedData,
    setFilterOpenOfUploadedData,
    formDataOfUploadedData,
    setFormDataOfUploadedData,
}) => {
    const [isStartVisible, setIsStartVisible] = useState(false);
    const [engineError, setEngineError] = useState(false);
    // formData
    const [formState, setFormState] = useState({
        action: 'verify',
        withPrefix: true,
        src: '',
        userName: '',
        password: '',
        SoOSavePath: "",
        DOCpath: ""
    });
    // modal
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const handleOpen = (val = 'verify') => {
        setFormState({ ...formState, action: val });
        setOpen(true);
    };

    const getEngineOnSignal = () => {
        window?.engine?.onProcessStart(function (message) {
            setIsExpandMiniTimerForExternal(true);
        });
    };

    const getEngineOffSignal = () => {
        window?.engine?.onProcessStop(function (message) {
            setIsExpandMiniTimerForExternal(false);
        });
    };

    // trigger engine start
    const startEngine = async (data) => {
        console.log("data", data);
        try {
            const p = await window?.engine?.startProcess(data);
            console.log(p);
            if (p.success === true) {
                setIsProcessing(true);
                handleClose();
                if (data.action === "verify") {
                    setChanel("ver");
                } else {
                    setChanel("fin");
                }
            }
        } catch (e) {
            console.log(e);
        }
    };

    const handleStart = async (e) => {
        e.preventDefault();
        if (
            formState.action === "verify" &&
            (!formState.src ||
                !formState.userName ||
                !formState.password
            )) {
            setEngineError("Please select the input file");
            return;
        }
        if (
            formState.action !== "verify" &&
            (!formState.SoOSavePath ||
                !formState.userName ||
                !formState.password ||
                !formState.SoOSavePath ||
                !formState.DOCpath
            )) {
            setEngineError("Please fill all the fields");
            return;
        }
        setEngineError("");
        const data = {
            action: formState.action,
            src: formState.action === "verify" ? formState.src : undefined,
            dir: formState.action === "verify" ? formState.src : undefined,
            withPrefix: formState.action === "verify" ? undefined : formState.withPrefix,
            userName: formState.userName,
            password: formState.password,
            SoOSavePath: formState.action === "verify" ? undefined : formState.SoOSavePath,
            DOCpath: formState.action === "verify" ? undefined : formState.DOCpath,
        };
        // return console.log('data', data)
        startEngine(data);
    }

    // trigger engine stop
    const handleStop = async () => {
        const p = await window?.engine?.stopProcess();
        if (p.success === true) {
            // setEngineStatus("Stopped");
            setIsProcessing(false);
        }
    };

    // const getInfo = async () => {
    //     try {
    //         // flag === "1" ? setGettingData(true) : setIsLoading(true);
    //         setIsLoading(true);
    //         const result = await window.engine.Proxy(`/lib/getList`, 'get');
    //         // console.log('get data', result);
    //         if (result?.status === 200 && result?.data?.success === true) {
    //             // setAPIError(null);
    //             // return result?.data;
    //             // console.log('result?.data', result?.data);
    //             setLibraries(result?.data?.list || []);
    //         }
    //         else {
    //             Swal.fire({
    //                 icon: 'error',
    //                 title: 'Error!',
    //                 text: result?.data?.message || "Failed to fetch library data!"
    //             });
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'Error!',
    //             text: error?.message || "Failed to fetch library data!"
    //         })
    //     } finally {
    //         // flag === "1" ? setGettingData(false) : setIsLoading(false);
    //         setIsLoading(false);
    //     }
    // }

    useEffect(() => {
        // getInfo();
        getEngineOnSignal();
        getEngineOffSignal();

        let isMounted = true;

        const handleTableData = (dt) => {
            // console.log('row', dt);
            if (!isMounted) return;

            if (typeof window.__slno_counter === "undefined" || window.__slno_counter === null) {
                window.__slno_counter = 1;
            }
            const data = headerKeys.reduce((acc, header) => {
                if (header === 'Success') {
                    acc[headers[header]] = (dt[header] === 'true' || dt[header] === true) ? 'Yes' : 'No';
                }
                else if (header === 'SL_NO') {
                    acc[headers[header]] = window.__slno_counter;
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

    return (
        <div className="overflow-hidden mt-1">
            <div className="flex justify-between w-full px-1">
                <div className="flex items-center gap-2">
                    <StickyInstructions
                        title={"Rex Issuance"}
                    />
                    <SettingForModule
                        setIsLoading={setIsLoading}
                        setLibrary={setLibrary}
                        setPageToShow={setPageToShow}
                    />
                    <Tooltip title={isExpandTimerForExternal ? "Close Timer" : "Open Timer"} arrow placement="right" disableInteractive>
                        <Paper
                            sx={{
                                // width: isExpandMiniTimer ? 120 : 40,
                                // width: 120,
                                height: 40,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                px: 1
                            }}
                        >
                            {isExpandTimerForExternal ?
                                <ClearIcon
                                    sx={{
                                        color: "red",
                                        cursor: "pointer",
                                        fontSize: 20
                                    }}
                                    onClick={() => setIsExpandTimerForExternal(false)}
                                /> :
                                <div className="flex items-center justify-between gap-1" onClick={() => setIsExpandTimerForExternal(true)}>
                                    <TimerOutlinedIcon
                                        sx={{
                                            color: "#707070",
                                            // color: "#212121",
                                            cursor: "pointer"
                                        }}
                                    // onClick={() => setIsExpandTimer(true)}
                                    />
                                    {isExpandMiniTimerForExternal && <div className="flex flex-col items-center cursor-pointer">
                                        <p className="font-bold tracking-wide font-roboto text-sm text-[#1976d2]"><span className="flex">
                                            {String(Math.floor(secondsForExternal / 3600)).padStart(2, "0")} :{" "}
                                            {String(Math.floor((secondsForExternal % 3600) / 60)).padStart(2, "0")} :{" "}
                                            {String(secondsForExternal % 60).padStart(2, "0")}
                                        </span></p>
                                        <p className="font-bold tracking-wide font-roboto text-sm">{formState.action === "verify" ? "Verified" : "Issued"}: {succeedForExternal}</p>
                                    </div>}
                                </div>}
                        </Paper>
                    </Tooltip>
                </div>
                <div className="flex items-center gap-2">
                    <Tooltip title={isExpandMessageForExternal ? "Close Message" : "Open Message"} arrow placement="left" disableInteractive>
                        <Paper
                            sx={{
                                width: 40,
                                height: 40,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {isExpandMessageForExternal ?
                                <ClearIcon
                                    sx={{
                                        color: "red",
                                        cursor: "pointer",
                                        fontSize: 20
                                    }}
                                    onClick={() => setIsExpandMessageForExternal(false)}
                                /> :
                                <EmailOutlinedIcon
                                    sx={{
                                        color: "gray",
                                        cursor: "pointer"
                                    }}
                                    onClick={() => setIsExpandMessageForExternal(true)}
                                />}
                        </Paper>
                    </Tooltip>
                    <FormatDownload />
                </div>
            </div>
            <ProcessController
                isProcessing={isProcessing}
                isStartVisible={isStartVisible}
                engineError={engineError}
                handleStop={handleStop}
                handleStart={handleStart}
                open={open}
                handleClose={handleClose}
                formState={formState}
                setFormState={setFormState}
            />
            <div
                className={`flex ${isExpandTimerForExternal && isExpandMessageForExternal ? "gap-2" : "gap-0"} w-full overflow-hidden pt-2 px-1`}
                style={{
                    height: (isExpandTimerForExternal || isExpandMessageForExternal) ? 190 : 0,
                    transition: "height 1s",
                }}
            >
                <TimerSection
                    isDataToRun={true}
                    dataToRunText={formState.action === "verify" ? "Rex to Verify" : "Rex to Issue"}
                    isSuccess={true}
                    successText={formState.action === "verify" ? "Verified" : "Issued"}
                    isFaild={true}
                    chnl={chanel}
                    isExpand={isExpandTimerForExternal}
                    setIsExpand={setIsExpandTimerForExternal}
                    setSucceed={setSucceedForExternal}
                    seconds={secondsForExternal}
                    setSeconds={setSecondsForExternal}
                />
                <MessageTable
                    chnl={chanel}
                    isExpandMessage={isExpandMessageForExternal}
                />
            </div>
            {
                tableBodyDataOfPulledFromEngine &&
                tableBodyDataOfPulledFromEngine?.length > 0 &&
                formState.action === "payslip" &&
                <PulledDataFromEngine
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    isProcessing={isProcessing}
                    pageOfPulledFromEngine={pageOfPulledFromEngine}
                    setPageOfPulledFromEngine={setPageOfPulledFromEngine}
                    rowsPerPageOfPulledFromEngine={rowsPerPageOfPulledFromEngine}
                    setRowsPerPageOfPulledFromEngine={setRowsPerPageOfPulledFromEngine}
                    tableBodyDataOfPulledFromEngine={tableBodyDataOfPulledFromEngine}
                    setTableBodyDataOfPulledFromEngine={setTableBodyDataOfPulledFromEngine}
                    handleOpen={handleOpen}
                    handleStop={handleStop}
                />}
            <UploadedData
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                isProcessing={isProcessing}
                pageOfUploaded={pageOfUploaded}
                setPageOfUploaded={setPageOfUploaded}
                rowsPerPageOfUploaded={rowsPerPageOfUploaded}
                setRowsPerPageOfUploaded={setRowsPerPageOfUploaded}
                totalRowsOfUploaded={totalRowsOfUploaded}
                setTotalRowsOfUploaded={setTotalRowsOfUploaded}
                tableBodyDataOfUploaded={tableBodyDataOfUploaded}
                setTableBodyDataOfUploaded={setTableBodyDataOfUploaded}
                queryOfUploadedData={queryOfUploadedData}
                setQueryOfUploadedData={setQueryOfUploadedData}
                handleOpen={handleOpen}
                handleStop={handleStop}
                filterOpenOfUploadedData={filterOpenOfUploadedData}
                setFilterOpenOfUploadedData={setFilterOpenOfUploadedData}
                formDataOfUploadedData={formDataOfUploadedData}
                setFormDataOfUploadedData={setFormDataOfUploadedData}
            />
        </div>
    );
};

export default Issuance;
