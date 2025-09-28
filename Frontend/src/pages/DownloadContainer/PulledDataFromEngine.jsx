import React, { useEffect, useState } from 'react';
import CustomTable from '../../Components/CustomTable/CustomTable';
import { fullHeadersForPulling } from './lib';
import Footer from '../../Components/CustomTable/Footer/Footer';
import UploadButtonForPulledEngineData from './UploadButtonForPulledEngineData';
import Swal from 'sweetalert2';
import Pagination from '../../Components/CustomTable/Pagination/Pagination';
import Body from '../../Components/CustomTable/Body/Body';
import DownloadButton from './DownloadButton';
import exportToExcel from '../../Functions/exportToExcel';
import { Button } from '@mui/material';

const PulledDataFromEngine = ({
    // isLoading,
    // setIsLoading,
    pageOfPulledFromEngine,
    setPageOfPulledFromEngine,
    rowsPerPageOfPulledFromEngine,
    setRowsPerPageOfPulledFromEngine,
    // totalRowsOfPulledFromEngine,
    tableBodyDataOfPulledFromEngine,
    setTableBodyDataOfPulledFromEngine,
    originalTableBodyDataOfPulledFromEngine,
    setOriginalTableBodyDataOfPulledFromEngine,
    // isUploadButtonVisible,
    // setIsUploadButtonVisible,
    // setReloadPulledData,
}) => {
    const [finalDataToUpload, setFinalDataToUpload] = useState([]);
    const [isDownloading, setIsDownloading] = useState(false);
    console.log("tableBodyDataOfPulledFromEngine", tableBodyDataOfPulledFromEngine);

    // useEffect(() => {
    //     const sortedData = [...originalTableBodyDataOfPulledFromEngine].sort((a, b) => new Date(a.CCD) - new Date(b.CCD));
    //     setFinalDataToUpload(sortedData);
    // }, [originalTableBodyDataOfPulledFromEngine]);

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
            fullHeadersForPulling,
            'Download Status Data Of Container Info',
            setIsDownloading,
            true
        )
    }

    const handleClearTable = () => {
        setTableBodyDataOfPulledFromEngine([]);
        // setFinalDataToUpload([]);
        // setOriginalTableBodyDataOfPulledFromEngine([]);
    }

    return (
        <>
            <CustomTable
                headerTitle={"Pulled Data From BestSeller Portal"}
                headerButtons={[
                    <DownloadButton
                        onClick={handleDownload}
                        isDisabled={tableBodyDataOfPulledFromEngine?.length === 0}
                        isLoading={isDownloading}
                    />
                ]}
                pagination={<Pagination
                    page={pageOfPulledFromEngine}
                    rowsPerPage={rowsPerPageOfPulledFromEngine}
                    totalRows={tableBodyDataOfPulledFromEngine?.length || 0}
                    onChangePage={onChangePage}
                    onChangeRowsPerPage={onChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                />}
                body={<Body
                    headers={fullHeadersForPulling}
                    bodyData={tableBodyDataOfPulledFromEngine?.slice(pageOfPulledFromEngine * rowsPerPageOfPulledFromEngine, (pageOfPulledFromEngine * rowsPerPageOfPulledFromEngine) + rowsPerPageOfPulledFromEngine)}
                />}
                footer={<Footer
                    footerButtons={[
                        <Button
                            size='small'
                            variant='outlined'
                            color='error'
                            sx={{ height: 25 }}
                            onClick={handleClearTable}
                            disabled={tableBodyDataOfPulledFromEngine?.length === 0}
                        >
                            Clear
                        </Button>
                    ]}
                />}
            />
        </>
    );
};

export default PulledDataFromEngine;