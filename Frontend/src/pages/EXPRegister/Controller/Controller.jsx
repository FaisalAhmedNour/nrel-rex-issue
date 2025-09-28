// Faisal Ahmed (C) - 30 Aug 2025
// Faisal Ahmed (M) - 02 Sep 2025

import { useState } from 'react';
import Swal from 'sweetalert2';
import Papa from "papaparse";
import { styled } from "@mui/material/styles";
import { LoadingButton } from '@mui/lab';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import FormTitle from '../../../Components/FormTitle';
// import FormTitle from '../../../../Components/FormTitle';

const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    maxHeight: '95vh',
    bgcolor: 'background.paper',
    p: 2,
    border: 0,
    borderRadius: 2,
    overflowY: 'auto'
};

const Controller = ({
    open,
    handleClose,
    setReloadTable
}) => {
    const [jsonData, setJsonData] = useState([]);
    const [fileName, setFileName] = useState("");
    const [loadingUpload, setLoadingUpload] = useState(false);

    const handleFileUpload = async () => {
        try {
            setLoadingUpload(true);
            const chunks = [];
            for (let i = 0; i < jsonData?.length; i += 100) {
                chunks.push(jsonData.slice(i, i + 100));
            }
            let flag = true;
            let uploadError;
            let uploadErrorText;
            for (const chunk of chunks) {
                const data = { payload: chunk };
                const result = await window?.engine?.Proxy(`/exp/upload`, 'post', data);
                if (result?.status !== 200) {
                    flag = false;
                    if (result?.data?.error === "Validation Error") {
                        uploadError = result?.data?.validationErrors?.[0]?.name;
                        uploadErrorText = result?.data?.validationErrors?.[0]?.message;
                    }
                }
                // console.log(result, flag);
            }
            if (flag) {
                Swal.fire({
                    title: "Successfully Uploaded",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1000,
                });
                setReloadTable(!reloadTable);
            } else {
                console.log(uploadError, uploadErrorText);
                Swal.fire({
                    title: uploadError || "Something went wrong!",
                    text:
                        uploadErrorText ||
                        "Please check your internet connection and try again later.",
                    icon: "error",
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Something went wrong! 22",
                text: "Please check your internet connection and try again later.",
                icon: "error",
            });
            console.error(error);
        } finally {
            setLoadingUpload(false);
        }
    };

    const handleFileChange = (e) => {
        setLoadingUpload(true);
        const file = e.target.files[0];
        setFileName(file?.name);
        // console.log(file.name);

        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const csvData = event.target.result;
                // console.log(csvData);
                displayCSVData(csvData);
            };
            reader.readAsText(file);
        } else {
            alert("No file selected");
        }

        e.target.value = null;
    };

    const displayCSVData = (csvData) => {
        // console.log(csvData);
        Papa.parse(csvData, {
            header: true,
            complete: (results) => {
                const json = results.data
                    .map((obj) => {
                        Object.entries(obj).forEach(([key, value]) => {
                            if (key === "Amount Inv" || key === "Inv Confirmed") {
                                obj[key] = parseFloat(value.replace(/,/g, "")) || "";
                            } else if (
                                key === "Freight" ||
                                key === "Insurance" ||
                                key === "Amount Customs" ||
                                key === "Amount Realized" ||
                                key === "Quantity"
                            ) {
                                obj[key] = parseInt(value.replace(/,/g, "")) || "";
                            }
                        });
                        return obj;
                    })
                    .filter((obj) => Object.values(obj).some((val) => val !== ""));
                setJsonData(json);
                setLoadingUpload(false);
            },
            error: (error) => {
                console.error("Error parsing CSV:", error);
                setLoadingUpload(false);
                alert("Error reading CSV file. Please try again.");
            },
        });
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <div className="flex justify-center items-center gap-2 mx-auto bg-white p-3 rounded-md relative">
                    <IconButton
                        sx={{
                            position: "absolute",
                            top: -14,
                            right: -14,
                            p: 0
                        }}
                        size="small"
                        color="error"
                        onClick={handleClose}
                    >
                        <CloseIcon />
                    </IconButton>
                    <FormTitle
                        text={"Select CSV File"}
                        isCompulsory={true}
                        length={130}
                    />
                    <div className="w-[400px] relative ">
                        <TextField
                            size="small"
                            name="file_name"
                            variant="outlined"
                            value={fileName}
                            placeholder="Select file"
                            sx={{
                                width: "100%",
                                // bgcolor: '#e8f0fe',
                                overflow: "hidden",
                                "& .MuiInputBase-root": {
                                    height: 25,
                                },
                            }}
                            inputProps={{ readOnly: true }}
                            className="editableInput"
                        />
                        {loadingUpload ? (
                            <LoadingButton
                                loading
                                variant="contained"
                                sx={{
                                    width: "6px",
                                    right: "1px",
                                    height: "92%",
                                    marginTop: "1px",
                                    position: "absolute",
                                }}
                            ></LoadingButton>
                        ) : (
                            <Button
                                sx={{
                                    right: "1px",
                                    height: "92%",
                                    marginTop: "1px",
                                    position: "absolute",
                                    bgcolor: "white",
                                    color: "#283e8a",
                                    ":hover": {
                                        color: "white",
                                    },
                                }}
                                component="label"
                                variant="contained"
                            >
                                <UploadFileOutlinedIcon />
                                <VisuallyHiddenInput
                                    disabled={loadingUpload}
                                    type="file"
                                    accept=".xlsx, .csv"
                                    onChange={handleFileChange}
                                />
                            </Button>
                        )}
                    </div>
                    <Button
                        size="small"
                        sx={{
                            height: 25,
                        }}
                        variant="contained"
                        onClick={handleFileUpload}
                        disabled={jsonData?.length == 0 || loadingUpload}
                    >
                        upload
                    </Button>
                </div>
            </Box>
        </Modal>
    );
};

export default Controller;