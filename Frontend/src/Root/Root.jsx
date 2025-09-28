// Faisal (C) 7 April 2025

import { useEffect, useState } from 'react';
import LoaderPage from '../Components/Loader/LoaderPage';
import { Box, Tab, Tabs } from '@mui/material';
import Issuance from '../pages/Issuance';
import EXPRegister from '../pages/EXPRegister/EXPRegister';

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const Root = () => {
    // tab
    const [value, setValue] = useState(0);
    // engine
    const [engineStatus, setEngineStatus] = useState(null);
    // flag
    const [isStartVisible, setIsStartVisible] = useState(true);
    const [isUploadButtonVisible, setIsUploadButtonVisible] = useState(false);
    const [isExpandStatus, setIsExpandStatus] = useState(false);
    // form data
    const [from, setFrom] = useState(null);
    const [to, setTo] = useState(null);
    // loading
    // loader
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    // error
    const [uploadError, setUploadError] = useState(null);
    const [engineError, setEngineError] = useState(null);
    // reload
    const [reloadPulledData, setReloadPulledData] = useState(false);
    const [reloadUploadedData, setReloadUploadedData] = useState(false);
    // pulled Data table from engine
    const [pageOfPulledFromEngine, setPageOfPulledFromEngine] = useState(0);
    const [rowsPerPageOfPulledFromEngine, setRowsPerPageOfPulledFromEngine] = useState(10);
    const [tableBodyDataOfPulledFromEngine, setTableBodyDataOfPulledFromEngine] = useState([]);
    const [originalTableBodyDataOfPulledFromEngine, setOriginalTableBodyDataOfPulledFromEngine] = useState([]);
    // timer
    const [isExpandStatusForExternal, setIsExpandStatusForExternal] = useState(false);
    const [isExpandTimerForExternal, setIsExpandTimerForExternal] = useState(false);
    const [isExpandMiniTimerForExternal, setIsExpandMiniTimerForExternal] = useState(false);
    const [isExpandMessageForExternal, setIsExpandMessageForExternal] = useState(false);
    const [secondsForExternal, setSecondsForExternal] = useState(0);
    const [succeedForExternal, setSucceedForExternal] = useState(0);

    // pulled data table
    const [pageOfUploaded, setPageOfUploaded] = useState(0);
    const [rowsPerPageOfUploaded, setRowsPerPageOfUploaded] = useState(10);
    const [totalRowsOfUploaded, setTotalRowsOfUploaded] = useState(0);
    const [tableBodyDataOfUploaded, setTableBodyDataOfUploaded] = useState([]);
    const [tableHeadersOfUploaded, setTableHeadersOfUploaded] = useState([]);
    const [errorForUploadedPulledData, setErrorForUploadedPulledData] = useState(null);
    const [queryOfUploadedPulledData, setQueryOfUploadedPulledData] = useState({ page: 0, setPage: 5 });

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

    useEffect(() => {
        getEngineOnSignal();
        getEngineOffSignal();

        let isMounted = true;

        const handleTableData = (dt) => {
            console.log('row', dt);
            if (!isMounted) return;
        };

        window.engine.onTableData(handleTableData);

        return () => {
            isMounted = false;
        };
    }, []);

    // trigger engine start
    const startEngine = async (data) => {
        try {
            // console.log("data", data);
            setOriginalTableBodyDataOfPulledFromEngine([]);
            setTableBodyDataOfPulledFromEngine([]);
            const p = await window.engine.startProcess(data);
            // console.log(p)
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
            to: convertToISODate(to),
            form: convertToISODate(from),
            action: "coll_po"
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
        <div>
            <LoaderPage open={isLoading} />
            <Box sx={{ width: '100%', pt: "2px" }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label="basic tabs example"
                        sx={{ py: 0, minHeight: 30, borderTop: 0 }}
                    >
                        <Tab
                            sx={{
                                py: 0,
                                minHeight: 30,
                                border: 1,
                                borderTopLeftRadius: 5,
                                borderTopRightRadius: 5,
                                ":hover": { bgcolor: value === 0 ? '' : '#dfdfdf' },
                                bgcolor: value === 0 ? '#efefef' : 'white'
                            }}
                            label="External Source"
                            {...a11yProps(0)}
                        />
                        <Tab
                            sx={{
                                py: 0,
                                minHeight: 30,
                                border: 1,
                                borderTopLeftRadius: 5,
                                borderTopRightRadius: 5,
                                ":hover": { bgcolor: value === 1 ? '' : '#dfdfdf' },
                                bgcolor: value === 1 ? '#efefef' : 'white'
                            }}
                            label="Internal Source"
                            {...a11yProps(1)}
                        />
                    </Tabs>
                </Box>
                <div className={`${value !== 0 ? 'hidden' : ''}`}>
                    <Issuance
                        isExpandStatusForExternal={isExpandStatusForExternal}
                        setIsExpandStatusForExternal={setIsExpandStatusForExternal}
                        isExpandTimerForExternal={isExpandTimerForExternal}
                        setIsExpandTimerForExternal={setIsExpandTimerForExternal}
                        isExpandMiniTimerForExternal={isExpandMiniTimerForExternal}
                        setIsExpandMiniTimerForExternal={setIsExpandMiniTimerForExternal}
                        isExpandMessageForExternal={isExpandMessageForExternal}
                        setIsExpandMessageForExternal={setIsExpandMessageForExternal}
                        secondsForExternal={secondsForExternal}
                        setSecondsForExternal={setSecondsForExternal}
                        succeedForExternal={succeedForExternal}
                        setSucceedForExternal={setSucceedForExternal}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                        isProcessing={isProcessing}
                        setIsProcessing={setIsProcessing}
                        pageOfPulledFromEngine={pageOfPulledFromEngine}
                        setPageOfPulledFromEngine={setPageOfPulledFromEngine}
                        rowsPerPageOfPulledFromEngine={rowsPerPageOfPulledFromEngine}
                        setRowsPerPageOfPulledFromEngine={setRowsPerPageOfPulledFromEngine}
                        tableBodyDataOfPulledFromEngine={tableBodyDataOfPulledFromEngine}
                        setTableBodyDataOfPulledFromEngine={setTableBodyDataOfPulledFromEngine}
                    />
                </div>
                <div className={`${value !== 1 ? 'hidden' : ''}`}>
                    <EXPRegister 
                    />
                </div>
            </Box>
        </div>
    );
};

export default Root;
