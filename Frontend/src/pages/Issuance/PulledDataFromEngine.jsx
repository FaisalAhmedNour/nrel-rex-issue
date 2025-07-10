import React, { useEffect, useState } from 'react';
import CustomTable from '../../Components/CustomTable/CustomTable';
import { fullHeaders } from './lib';
import Swal from 'sweetalert2';
import Pagination from '../../Components/CustomTable/Pagination/Pagination';
import Body from '../../Components/CustomTable/Body/Body';
// import DownloadButton from './DownloadButton';
import exportToExcel from '../../Functions/exportToExcel';
import { Button } from '@mui/material';

const PulledDataFromEngine = ({
    isLoading,
    setIsLoading,
    isProcessing,
    pageOfPulledFromEngine,
    setPageOfPulledFromEngine,
    rowsPerPageOfPulledFromEngine,
    setRowsPerPageOfPulledFromEngine,
    tableBodyDataOfPulledFromEngine,
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

    // const handleUploadPart = async (data) => {
    //     const uploadedFileData = {
    //         data: data,
    //     };

    //     try {
    //         const result = await window.engine.Proxy("/process/PO/data", 'post', uploadedFileData);
    //         // console.log('Upload result', result);

    //         if (result?.data?.success === true) {
    //             setIsUploadButtonVisible(false);
    //             setReloadPulledData(prev => !prev);
    //             // setFinalData([]); // Reset the final data after successful upload
    //         } else {
    //             throw new Error(result.data.message || "Failed to upload. Please try again.");
    //         }
    //     } catch (error) {
    //         console.error("Upload failed: ", error);
    //         // setError(error.message || "Failed to upload. Please try again.");
    //         Swal.fire({
    //             title: "Failed!",
    //             text: "Failed to upload. Please try again.",
    //             icon: "error",
    //         });
    //     }
    // };

    // const handleUpload = async () => {
    //     // setUploadError("");
    //     setIsLoading(true);

    //     try {
    //         // Upload in chunks of 100 items
    //         for (let i = 0; i < finalDataToUpload?.length; i += 100) {
    //             const batch = finalDataToUpload.slice(i, i + 100); // Get a batch of 100 or less
    //             await handleUploadPart(batch); // Wait for each batch to complete before starting the next
    //         }
    //         Swal.fire({
    //             title: "Updated!",
    //             text: "Your file has been updated.",
    //             icon: "success",
    //         });
    //         setTableBodyDataOfPulledFromEngine([]);
    //         setFinalDataToUpload([]);
    //         setOriginalTableBodyDataOfPulledFromEngine([]);
    //     } catch (error) {
    //         console.error("Batch upload error: ", error);
    //         // setUploadError("Failed to upload. Please try again.");
    //         Swal.fire({
    //             title: "Failed!",
    //             text: error?.message || "Failed to upload. Please try again.",
    //             icon: "error",
    //         });
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }

    const handleDownload = () => {
        exportToExcel(
            tableBodyDataOfPulledFromEngine,
            fullHeaders,
            'Response Data',
            setIsDownloading,
            true
        )
    }

    // const handleClearTable = () => {
    //     setTableBodyDataOfPulledFromEngine([]);
    //     setFinalDataToUpload([]);
    //     setOriginalTableBodyDataOfPulledFromEngine([]);
    // }

    return (
        <>
            <CustomTable
                className={'px-2'}
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
                        <Button
                            size='small'
                            variant='outlined'
                            sx={{
                                height: 25
                            }}
                            onClick={handleDownload}
                        >
                            Download as Excel
                        </Button>
                    ]}
                />}
                body={<Body
                    headers={fullHeaders}
                    bodyData={tableBodyDataOfPulledFromEngine?.slice(pageOfPulledFromEngine * rowsPerPageOfPulledFromEngine, (pageOfPulledFromEngine * rowsPerPageOfPulledFromEngine) + rowsPerPageOfPulledFromEngine)}
                />}
            />
        </>
    );
};

export default PulledDataFromEngine;