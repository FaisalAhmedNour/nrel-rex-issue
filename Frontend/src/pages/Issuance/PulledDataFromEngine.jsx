import { useState } from 'react';
import CustomTable from '../../Components/CustomTable/CustomTable';
import { fullHeaders } from './lib';
import Pagination from '../../Components/CustomTable/Pagination/Pagination';
import Body from '../../Components/CustomTable/Body/Body';
import exportToExcel from '../../Functions/exportToExcel';
import Button from '@mui/material/Button';

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
        // console.log("newPage", newPage);
        setPageOfPulledFromEngine(newPage);
    };

    const onChangeRowsPerPage = (row) => {
        // console.log("row", row)
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
            className={'px-2 mt-0'}
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
                            color='success'
                            sx={{
                                height: 25,
                                textTransform: 'capitalize'
                            }}
                            onClick={handleOpen}
                        >
                            Start Issue
                        </Button>
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
                        tableBodyDataOfPulledFromEngine?.length > 0 &&
                        <Button
                            size='small'
                            variant='outlined'
                            sx={{
                                height: 22,
                                textTransform: 'capitalize',
                            }}
                            onClick={handleDownload}
                        >
                            Download as Excel
                        </Button>
                    }</>,
                    <>{
                        tableBodyDataOfPulledFromEngine?.length > 0 &&
                        <Button
                            size='small'
                            variant='outlined'
                            color='error'
                            sx={{
                                height: 22,
                                textTransform: 'capitalize',
                            }}
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