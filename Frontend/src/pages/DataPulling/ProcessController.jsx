import { LoadingButton } from "@mui/lab";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import DateInputField from "../../Components/DateInputField/DateInputField";
import FormTitle from "../../Components/FormTitle";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 3,
    borderRadius: 2,
    borderColor: '#1976d2',
};
const inputLength = 150;

const ProcessController = ({
    isProcessing,
    isStartVisible,
    open,
    handleClose,
    engineError,
    handleStart,
    setExcelPath,
    excelPath,
    setFolderPath,
    folderPath
}) => {
    // const [isStartVisible, setIsStartVisible] = useState(false);
    const handleSetExcelFilePath = async () => {
        const filePath = await window.engine.openFile({
            title: "Select Excel File",
            accept: ["openFile"],
        });
        if (filePath?.success === true) {
            setExcelPath(filePath?.path?.[0]);
            // setIsStartVisible(true);
        }
    };

    const handleSetFolderPath = async () => {
        const filePath = await window.engine.openFile({
            title: "Select Folder",
            accept: ["openDirectory"],
        });
        if (filePath?.success === true) {
            setFolderPath(filePath?.path?.[0]);
            // setIsStartVisible(true);
        }
    };
    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <div className="relative z-20 px-1">
                    <h3 className="font-semibold text-lg">Response Data</h3>
                    <span className="absolute -top-4 -right-4">
                        <IconButton size="small" color="error">
                            <CloseIcon onClick={handleClose} />
                        </IconButton>
                    </span>
                    <form
                        onSubmit={handleStart}
                        className="flex flex-col items-center gap-2 justify-center bg-white p-4"
                    >
                        <div className="flex justify-start items-center gap-1">
                            <FormTitle
                                text={"Excel File"}
                                isCompulsory={true}
                                length={inputLength}
                            />
                            <div className="flex-grow mx-auto relative w-[350px]">
                                <TextField
                                    inputProps={{ readOnly: true }}
                                    placeholder="Select folder"
                                    size="small"
                                    name="file_path"
                                    variant="outlined"
                                    value={excelPath}
                                    sx={{
                                        width: "100%",
                                        bgcolor: "#e8f0fe",
                                        "& .MuiInputBase-root": {
                                            height: 25,
                                            fontSize: 14,
                                        },
                                        overflow: "hidden",
                                    }}
                                    className="fixedInput"
                                // onChange={(e) => handleFormData('filePath', e.target.value)}
                                />
                                <Button
                                    // disabled={isGettingData}
                                    sx={{
                                        position: "absolute",
                                        right: "1px",
                                        height: "92%",
                                        width: "6px",
                                        marginTop: "1px",
                                        bgcolor: "white",
                                        color: "#283e8a",
                                        ":hover": {
                                            color: "white",
                                        },
                                    }}
                                    component="label"
                                    variant="contained"
                                    onClick={handleSetExcelFilePath}
                                >
                                    <UploadFileOutlinedIcon />
                                </Button>
                            </div>
                        </div>
                        <div className="flex justify-start items-center gap-1">
                            <FormTitle
                                text={"Document Location"}
                                isCompulsory={true}
                                length={inputLength}
                            />
                            <div className="flex-grow mx-auto relative w-[350px]">
                                <TextField
                                    inputProps={{ readOnly: true }}
                                    placeholder="Select folder"
                                    size="small"
                                    name="file_path"
                                    variant="outlined"
                                    value={folderPath}
                                    sx={{
                                        width: "100%",
                                        bgcolor: "#e8f0fe",
                                        "& .MuiInputBase-root": {
                                            height: 25,
                                            fontSize: 14,
                                        },
                                        overflow: "hidden",
                                    }}
                                    className="fixedInput"
                                // onChange={(e) => handleFormData('filePath', e.target.value)}
                                />
                                <Button
                                    // disabled={isGettingData}
                                    sx={{
                                        position: "absolute",
                                        right: "1px",
                                        height: "92%",
                                        width: "6px",
                                        marginTop: "1px",
                                        bgcolor: "white",
                                        color: "#283e8a",
                                        ":hover": {
                                            color: "white",
                                        },
                                    }}
                                    component="label"
                                    variant="contained"
                                    onClick={handleSetFolderPath}
                                >
                                    <UploadFileOutlinedIcon />
                                </Button>
                            </div>
                        </div>
                        {typeof engineError === 'string' &&
                            <p className="text-[red] text-xs text-center mt-1 col-span-2 order-11">{engineError}</p>}
                        <div className="flex items-center gap-2 mt-1">
                            <LoadingButton
                                size="small"
                                sx={{
                                    height: 25,
                                }}
                                color="success"
                                type="submit"
                                disabled={!isStartVisible}
                                loading={isProcessing}
                                variant="outlined"
                                loadingIndicator="Processing…"
                            >
                                <span>Start</span>
                            </LoadingButton>
                        </div>
                    </form>
                </div>
            </Box>
        </Modal>
    )
}

export default ProcessController;