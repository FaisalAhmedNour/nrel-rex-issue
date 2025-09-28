// Faisal (C) 7 April 2025

import ProcessController from "./ProcessController";
import TimerSection from "../../Components/TimerSection";
import MessageTable from "../../Components/MessageTable";
import PulledDataFromEngine from "./PulledDataFromEngine";
import LoaderPage from "../../Components/Loader/LoaderPage";
import { useEffect, useState } from "react";
import { headerKeysForPulling, headersForPulling } from "./lib";

const DownloadContainer = () => {
    // engine
    const [engineStatus, setEngineStatus] = useState(null);
    const [isGettingData, setIsGettingData] = useState(false);
    // flag
    const [isProcessing, setIsProcessing] = useState(false);
    const [isStartVisible, setIsStartVisible] = useState(true);
    const [isExpandStatus, setIsExpandStatus] = useState(false);
    // form data
    const [filePath, setFilePath] = useState(null);
    const [folderDestination, setFolderDestination] = useState(null);
    const [saveTemplate, setSaveTemplate] = useState('@[INVOICE NO]');
    // loading
    const [isLoading, setIsLoading] = useState(false);
    // error
    const [engineError, setEngineError] = useState(null);
    // reload
    const [reloadPulledData, setReloadPulledData] = useState(false);
    const [reloadUploadedData, setReloadUploadedData] = useState(false);
    // pulled Data table from engine
    const [pageOfPulledFromEngine, setPageOfPulledFromEngine] = useState(0);
    const [rowsPerPageOfPulledFromEngine, setRowsPerPageOfPulledFromEngine] = useState(5);
    const [tableBodyDataOfPulledFromEngine, setTableBodyDataOfPulledFromEngine] = useState([]);
    const [originalTableBodyDataOfPulledFromEngine, setOriginalTableBodyDataOfPulledFromEngine] = useState([]);

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
        });
    };

    // const handleUploadPart = async (data) => {
    //     const uploadedFileData = {
    //         scope: 'SS',
    //         data: data,
    //     };
    //     console.log("uploadedFileData", uploadedFileData);
    //     try {
    //         const result = await window.engine.Proxy("/process/PO/data", 'post', uploadedFileData);
    //         console.log('Upload result', result);

    //         if (result?.data?.success === true) {
    //             // setIsUploadButtonVisible(false);
    //             setReloadPulledData(prev => !prev);
    //             // setFinalData([]); // Reset the final data after successful upload
    //         }
    //         else {
    //             throw new Error(result.data.message || "Failed to upload. Please try again.");
    //         }
    //     } catch (error) {
    //         console.error("Upload failed: ", error);
    //         Swal.fire({
    //             title: "Failed!",
    //             text: error?.message || error?.data?.message || "Failed to upload. Please try again.",
    //             icon: "error",
    //         });
    //     }
    // };

    // const bufferRef = useRef([]);
    // const timerRef = useRef(null);

    useEffect(() => {
        getEngineOnSignal();
        getEngineOffSignal();

        let isMounted = true;

        const handleTableData = (dt) => {
            // console.log('row', dt);
            if (isMounted) {
                const tableRow = {};
                const originalTableRow = dt;
                headerKeysForPulling?.forEach((key) => {
                    // console.log('in', headerKeys, key, headers, headers[key]);
                    // console.log(typeof dt[key], typeof dt[key] === "boolean")
                    if (typeof dt[key] === "boolean") {
                        tableRow[headersForPulling[key]] = dt[key] === true ? 'Yes' : 'No';
                        // console.log('now', tableRow, dt[key], dt[key] === true)
                    } else
                        tableRow[headersForPulling[key]] = dt ? dt[key] : "";
                    // console.log('end', tableRow);
                });
                tableRow['isError'] = !dt?.success;
                // console.log('lkjo', originalTableRow, tableRow)
                setOriginalTableBodyDataOfPulledFromEngine((prev) => [...prev, originalTableRow]);
                setTableBodyDataOfPulledFromEngine((prev) => [...prev, { 'Sl No': prev?.length + 1, ...tableRow }]);
            }
        };

        window.engine.onTableData(handleTableData);

        // Cleanup function to prevent state update after unmount
        return () => {
            isMounted = false;
            // if (timerRef.current) clearTimeout(timerRef.current);
            // bufferRef.current = [];
        };
    }, []);

    // trigger engine start
    const startEngine = async (data) => {
        try {
            // console.log("data", data);
            setOriginalTableBodyDataOfPulledFromEngine([]);
            setTableBodyDataOfPulledFromEngine([]);
            const p = await window.engine.startProcess(data);
            console.log('data', data, p)
            if (p.success === true) {
                setEngineStatus("Started");
                setIsProcessing(true);
            } else {
                setEngineStatus("Start Failed");
            }
        } catch (e) {
            console.log(e);
        }
    };

    const handleStart = async (e) => {
        e.preventDefault();
        const data = {
            excelPath: filePath,
            documentSavePath: folderDestination,
            // saveTemplate: saveTemplate
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

    return (
        <div className="">
            <LoaderPage open={isLoading} />
            <ProcessController
                isProcessing={isProcessing}
                isStartVisible={isStartVisible}
                engineError={engineError}
                handleStop={handleStop}
                handleStart={handleStart}
                filePath={filePath}
                setFilePath={setFilePath}
                folderDestination={folderDestination}
                setFolderDestination={setFolderDestination}
                saveTemplate={saveTemplate}
                setSaveTemplate={setSaveTemplate}
                isGettingData={isGettingData}
                setIsGettingData={setIsGettingData}
            />
            <div
                className="flex gap-2 w-full overflow-hidden"
                style={{
                    height: isExpandStatus ? 221 : 94,
                }}
            >
                <TimerSection
                    isDataToRun={true}
                    dataToRunText={'Data To Download'}
                    isSuccess={true}
                    successText={"Downloaded"}
                    isFaild={true}
                    engineStatus={engineStatus}
                    isExpandStatus={isExpandStatus}
                    setIsExpandStatus={setIsExpandStatus}
                />
                <MessageTable
                    isExpandStatus={isExpandStatus}
                    setIsExpandStatus={setIsExpandStatus}
                />
            </div>
            <PulledDataFromEngine
                pageOfPulledFromEngine={pageOfPulledFromEngine}
                setPageOfPulledFromEngine={setPageOfPulledFromEngine}
                rowsPerPageOfPulledFromEngine={rowsPerPageOfPulledFromEngine}
                setRowsPerPageOfPulledFromEngine={setRowsPerPageOfPulledFromEngine}
                tableBodyDataOfPulledFromEngine={tableBodyDataOfPulledFromEngine}
                setTableBodyDataOfPulledFromEngine={setTableBodyDataOfPulledFromEngine}
                originalTableBodyDataOfPulledFromEngine={originalTableBodyDataOfPulledFromEngine}
                setOriginalTableBodyDataOfPulledFromEngine={setOriginalTableBodyDataOfPulledFromEngine}
            />
        </div>
    )
}

export default DownloadContainer;