// Faisal Ahmed (C)
// Faisal Ahmed (M) - 13 Oct 2025

import { useState } from 'react';
import CustomTable from '../../Components/CustomTable/CustomTable';
import { fullHeaders } from './lib';
import Pagination from '../../Components/CustomTable/Pagination/Pagination';
import Body from '../../Components/CustomTable/Body/Body';
import exportToExcel from '../../Functions/exportToExcel';
import Button from '@mui/material/Button';
import DownloadOutlined from '@mui/icons-material/DownloadOutlined';

const PulledDataFromEngine = ({
    isLoading,
    setIsLoading,
    isProcessing,
    pageOfPulledFromEngine,
    setPageOfPulledFromEngine,
    rowsPerPageOfPulledFromEngine,
    setRowsPerPageOfPulledFromEngine,
    tableBodyDataOfPulledFromEngine,
    setTableBodyDataOfPulledFromEngine,
    handleOpen,
    handleStop,
}) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const onChangePage = (newPage) => {
        setPageOfPulledFromEngine(newPage);
    };

    const onChangeRowsPerPage = (row) => {
        setRowsPerPageOfPulledFromEngine(row);
        setPageOfPulledFromEngine(0);
    };

    const handleDownload = () => {
        exportToExcel(
            tableBodyDataOfPulledFromEngine,
            fullHeaders,
            'Response Data',
            setIsDownloading,
            true
        )
    }

    return (
        <CustomTable
            className={'px-2 mt-1'}
            headerTitle={"Response Data"}
            headerButtons={[
                <>
                    {isProcessing &&
                        <Button
                            size='small'
                            variant='contained'
                            onClick={handleStop}
                            color='error'
                            sx={{ height: 25 }}
                        >Stop</Button> 
                        // :
                        // <div className='flex justify-center items-center gap-1'>
                        //     <Button
                        //         size='small'
                        //         variant='contained'
                        //         color='success'
                        //         sx={heightLightButton}
                        //         onClick={() => handleOpen("verify")}
                        //     >
                        //         Start Verify
                        //     </Button>
                        //     <Button
                        //         size='small'
                        //         variant='contained'
                        //         color='success'
                        //         sx={heightLightButton}
                        //         onClick={() => handleOpen("payslip")}
                        //     >
                        //         Start Issue
                        //     </Button>
                        // </div>
                    }
                </>
            ]}
            pagination={<Pagination
                page={pageOfPulledFromEngine}
                rowsPerPage={rowsPerPageOfPulledFromEngine}
                totalRows={tableBodyDataOfPulledFromEngine?.length || 0}
                onChangePage={onChangePage}
                onChangeRowsPerPage={onChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                leftButtons={[
                    <>{
                        // tableBodyDataOfPulledFromEngine?.length > 0 &&
                        <Button
                            size='small'
                            variant='outlined'
                            sx={{
                                height: 25,
                                // textTransform: 'capitalize',
                            }}
                            disabled={tableBodyDataOfPulledFromEngine?.length === 0}
                            onClick={handleDownload}
                            startIcon={<DownloadOutlined />}
                        >
                            Download as Excel
                        </Button>
                    }</>,
                    <>{
                        // tableBodyDataOfPulledFromEngine?.length > 0 &&
                        <Button
                            size='small'
                            variant='outlined'
                            color='error'
                            sx={{
                                height: 25,
                                // textTransform: 'capitalize',
                            }}
                            disabled={tableBodyDataOfPulledFromEngine?.length === 0}
                            onClick={() => setTableBodyDataOfPulledFromEngine([])}
                        >
                            Clear
                        </Button>
                    }</>
                ]}
            />}
            body={<Body
                headers={fullHeaders}
                bodyData={tableBodyDataOfPulledFromEngine?.slice(pageOfPulledFromEngine * rowsPerPageOfPulledFromEngine, (pageOfPulledFromEngine * rowsPerPageOfPulledFromEngine) + rowsPerPageOfPulledFromEngine)}
            />}
        />
    );
};

export default PulledDataFromEngine;