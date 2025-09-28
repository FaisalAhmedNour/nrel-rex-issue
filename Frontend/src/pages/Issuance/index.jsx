// Faisal (C)

import React, { useEffect, useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import ClearIcon from '@mui/icons-material/Clear';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import SimCardDownloadOutlinedIcon from '@mui/icons-material/SimCardDownloadOutlined';
import LoaderPage from '../../Components/Loader/LoaderPage';
import StickyInstructions from '../../Components/StickyInstructions/StickyInstructions';
import ProcessController from './ProcessController';
import TimerSection from '../../Components/TimerSection';
import MessageTable from '../../Components/MessageTable';
import PulledDataFromEngine from './PulledDataFromEngine';
import { headerKeys, headers } from './lib';
import SettingsIcon from '@mui/icons-material/Settings';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Parties from './Country-Buyer';
import FormatDownload from '../../Components/FormatDownload';

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
}) => {

    const [isStartVisible, setIsStartVisible] = useState(false);
    const [engineError, setEngineError] = useState(false);
    const [excelPath, setExcelPath] = useState('');
    const [folderPath, setFolderPath] = useState('');
    // modal
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const handleOpen = () => setOpen(true);
    
    // formData
    const [formState, setFormState] = useState({
        createNewSoO: false,
        filePath: '',
        DOCpath: '',
        INpath: '',
        BEpath: '',
        BLpath: '',
        EXpath: '',
        withPrefix: 'validation',
        username: '',
        password: ''
    });
    // Library list
    const [anchorEl, setAnchorEl] = useState(null);
    const open2 = Boolean(anchorEl);
    const handleClickOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClickClose = () => {
        setAnchorEl(null);
    };
    const [pageToShow, setPageToShow] = useState('main');


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

    // TODO: FIXME
    const handleDownloadFormat = () => {
        const randomFourDigitNumber = Math.floor(1000 + Math.random() * 9000);
        const link = document.createElement('a');
        link.href = "REX ISSUANCE FORMAT V.0.1.3 DT 09.05.2025.xlsx";
        link.download = `REX ISSUANCE FORMAT V.0.1.3 DT 09.05.2025 ${randomFourDigitNumber}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // trigger engine start
    const startEngine = async (data) => {
        // console.log("data", data);
        try {
            const p = await window?.engine?.startProcess(data);
            if (p.success === true) {
                // setEngineStatus("Started");
                setIsProcessing(true);
                // setTableBodyDataOfPulledFromEngine([]);
                // window.__slno_counter = 1;
            } else {
                // setEngineStatus("Start Failed");
            }
        } catch (e) {
            console.log(e);
        }
    };

    const handleStart = async (e) => {
        e.preventDefault();
        handleClose();
        const data = {
            action: formState.withPrefix === "validation" ? "verify" : undefined,
            withPrefix:
                formState.withPrefix === "prefix"
                    ? true
                    : formState.withPrefix === "noPrefix"
                        ? false
                        : undefined,
            applyForApplication:
                formState.withPrefix === "validation"
                    ? undefined
                    : formState.withPrefix === "finalize"
                        ? true
                        : false,
            Sleep: formState.withPrefix === "validation" ? undefined : 0,
            userName: formState.withPrefix === "validation" ? undefined : formState.username,
            password: formState.withPrefix === "validation" ? undefined : formState.password,
            src: formState.filePath || undefined,
            DOCpath: formState.DOCpath || undefined,
            createNewSoO: formState.createNewSoO,
            INpath: formState.INpath || undefined,
            BLpath: formState.BLpath || undefined,
        };
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

    useEffect(() => {
        getEngineOnSignal();
        getEngineOffSignal();

        let isMounted = true;

        const handleTableData = (dt) => {
            console.log('row', dt);
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
        <div className="overflow-hidden">
            <div className="absolute flex justify-between w-full px-2">
                <div className="flex items-center gap-2 mt-1">
                    <StickyInstructions
                        title={"Rex Issuance"}
                    />
                    <Tooltip title={"Library"} arrow placement="right" disableInteractive>
                        <Paper
                            sx={{
                                overflow: "hidden",
                                py: 1,
                                px: 1,
                                width: 40,
                                height: 40
                            }}
                            className="space-y-1"
                            onClick={handleClickOpen}
                        >
                            <SettingsIcon
                                sx={{
                                    color: "gray",
                                    cursor: "pointer",
                                }}
                            />
                        </Paper>
                    </Tooltip>
                    <Menu
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        anchorEl={anchorEl}
                        open={open2}
                        onClose={handleClickClose}
                    >
                        <MenuList dense sx={{ outline: 'none' }}>
                            <MenuItem
                                sx={{ display: 'flex', gap: 1, height: 25, fontSize: 14, borderColor: '#f5f5f5', borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5' }}
                                onClick={() => {
                                    setPageToShow('county-buyer');
                                    handleClickClose();
                                }}
                            >
                                CountryName-Buyer(REX)
                            </MenuItem>
                        </MenuList>
                    </Menu>
                    <Tooltip title={"Timer Details"} arrow placement="right" disableInteractive>
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
                                        <p className="font-bold tracking-wide font-roboto text-sm">Pulled: {succeedForExternal}</p>
                                    </div>}
                                </div>}
                        </Paper>
                    </Tooltip>
                </div>
                <div className="flex items-center gap-2">
                    <Tooltip title={"Message Table"} arrow placement="left" disableInteractive>
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
                                        color: "gray",
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
                className={`flex ${ isExpandTimerForExternal && isExpandMessageForExternal ? "gap-2" : "gap-0"} w-full overflow-hidden pt-12 px-2`}
                style={{
                    height: (isExpandTimerForExternal || isExpandMessageForExternal) ? 230 : 0,
                    transition: "height 1s",
                }}
            >
                <TimerSection
                    isDataToRun={true}
                    dataToRunText={'Rex to Issue'}
                    isSuccess={true}
                    successText={"Issued"}
                    isFaild={true}
                    isExpand={isExpandTimerForExternal}
                    setIsExpand={setIsExpandTimerForExternal}
                    setSucceed={setSucceedForExternal}
                    seconds={secondsForExternal}
                    setSeconds={setSecondsForExternal}
                />
                <MessageTable
                    isExpandMessage={isExpandMessageForExternal}
                    setIsExpandMessage={setIsExpandMessageForExternal}
                    isExpandStatus={isExpandStatusForExternal}
                    setIsExpandStatus={setIsExpandStatusForExternal}
                />
            </div>
            {pageToShow === 'main' ?
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
                /> :
                <Parties
                    setPageToShow={setPageToShow}
                />}
        </div>
    );
};

export default Issuance;