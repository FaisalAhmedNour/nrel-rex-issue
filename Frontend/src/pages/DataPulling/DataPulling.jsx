// Faisal (C) 7 April 2025

import ProcessController from "./ProcessController";
import TimerSection from "../../Components/TimerSection";
import MessageTable from "../../Components/MessageTable";
// import PulledDataFromEngine from "./PulledDataFromEngine";
import LoaderPage from "../../Components/Loader/LoaderPage";
import StickyInstructions from "../../Components/StickyInstructions/StickyInstructions";
import Report from "./Report";
import Paper from "@mui/material/Paper";
import LaunchIcon from '@mui/icons-material/Launch';
import { useEffect, useState } from "react";
import ClearIcon from '@mui/icons-material/Clear';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import Tooltip from "@mui/material/Tooltip";
import SimCardDownloadOutlinedIcon from '@mui/icons-material/SimCardDownloadOutlined';

const DataPulling = ({
    from,
    setFrom,
    to,
    setTo,
    open,
    handleClose,
    isExpandStatus,
    setIsExpandStatus,
    engineStatus,
    engineError,
    handleStop,
    handleStart,
    isLoading,
    isProcessing,
    isStartVisible,
    setExcelPath,
    excelPath,
    setFolderPath,
    folderPath
}) => {
    const [isExpandTimer, setIsExpandTimer] = useState(false);
    const [isExpandMiniTimer, setIsExpandMiniTimer] = useState(false);
    const [isExpandMessage, setIsExpandMessage] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [succeed, setSucceed] = useState(0);

    const getEngineOnSignal = () => {
        window.engine.onProcessStart(function (message) {
            setIsExpandMiniTimer(true);
            // setIsExpandMessage(true);
        });
    };

    const getEngineOffSignal = () => {
        window.engine.onProcessStop(function (message) {
            setIsExpandMiniTimer(false);
        });
    };

    useEffect(() => {
        getEngineOnSignal();
        getEngineOffSignal();
    })

    const handleDownloadFormat = () => {
        const randomFourDigitNumber = Math.floor(1000 + Math.random() * 9000);
        const link = document.createElement('a');
        link.href = "FORMAT FOR SHIPPING DOC AND E-INVOICE OF BS V.0.1.1 DT 01.07.2025 F.xlsx";
        link.download = `FORMAT FOR SHIPPING DOC AND E-INVOICE OF BS V.0.1.1 DT 01.07.2025 ${randomFourDigitNumber}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <div className="overflow-hidden">
            <LoaderPage open={isLoading} />
            <div className="absolute flex justify-between w-full px-2">
                <div className="flex items-center gap-2 mt-1">
                    <StickyInstructions
                        title={"Data Pulling"}
                    />
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
                            {isExpandTimer ?
                                <ClearIcon
                                    sx={{
                                        color: "red",
                                        cursor: "pointer",
                                        fontSize: 20
                                    }}
                                    onClick={() => setIsExpandTimer(false)}
                                /> :
                                <div className="flex items-center justify-between gap-1" onClick={() => setIsExpandTimer(true)}>
                                    <TimerOutlinedIcon
                                        sx={{
                                            color: "#212121",
                                            cursor: "pointer"
                                        }}
                                    // onClick={() => setIsExpandTimer(true)}
                                    />
                                    {isExpandMiniTimer && <div className="flex flex-col items-center cursor-pointer">
                                        <p className="font-bold tracking-wide font-roboto text-sm text-[#1976d2]"><span className="flex">
                                            {String(Math.floor(seconds / 3600)).padStart(2, "0")} :{" "}
                                            {String(Math.floor((seconds % 3600) / 60)).padStart(2, "0")} :{" "}
                                            {String(seconds % 60).padStart(2, "0")}
                                        </span></p>
                                        <p className="font-bold tracking-wide font-roboto text-sm">Pulled: {succeed}</p>
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
                            {isExpandMessage ?
                                <ClearIcon
                                    sx={{
                                        color: "gray",
                                        cursor: "pointer",
                                        fontSize: 20
                                    }}
                                    onClick={() => setIsExpandMessage(false)}
                                /> :
                                <EmailOutlinedIcon
                                    sx={{
                                        color: "gray",
                                        cursor: "pointer"
                                    }}
                                    onClick={() => setIsExpandMessage(true)}
                                />}
                        </Paper>
                    </Tooltip>
                    <Tooltip title={"Download Format"} arrow placement="left" disableInteractive>
                        <Paper
                            sx={{
                                width: 40,
                                height: 40,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <SimCardDownloadOutlinedIcon
                                sx={{
                                    color: "gray",
                                    cursor: "pointer",
                                    fontSize: 25
                                }}
                                onClick={handleDownloadFormat}
                            />
                        </Paper>
                    </Tooltip>
                    {/* <Report /> */}
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
                setExcelPath={setExcelPath}
                excelPath={excelPath}
                setFolderPath={setFolderPath}
                folderPath={folderPath}
            />
            <div
                className="flex gap-2 w-full overflow-hidden pt-12 px-2"
                style={{
                    height: (isExpandTimer || isExpandMessage) ? 230 : 0,
                    transition: "height 1s",
                }}
            >
                <TimerSection
                    isDataToRun={false}
                    dataToRunText={'Data To Pull'}
                    isSuccess={true}
                    successText={"Pulled"}
                    isFaild={true}
                    engineStatus={engineStatus}
                    isExpand={isExpandTimer}
                    setIsExpand={setIsExpandTimer}
                    setSucceed={setSucceed}
                    seconds={seconds}
                    setSeconds={setSeconds}
                />
                <MessageTable
                    isExpandMessage={isExpandMessage}
                    setIsExpandMessage={setIsExpandMessage}
                    // chanel={'cpo'}
                    isExpandStatus={isExpandStatus}
                    setIsExpandStatus={setIsExpandStatus}
                />
            </div>
        </div>
    )
}

export default DataPulling;