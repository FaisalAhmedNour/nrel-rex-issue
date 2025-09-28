import { LoadingButton } from "@mui/lab";
import DateInputField from "../../Components/DateInputField/DateInputField";
import StickyInstructions from "../../Components/StickyInstructions/StickyInstructions";
import { Button } from "@mui/material";
import FormTitle from "../../Components/FormTitle";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import FormatDownload from "./FormatDownload";

const inputLength = 150;

const ProcessController = ({
    isProcessing,
    isStartVisible,
    engineError,
    handleStop,
    handleStart,
    filePath,
    setFilePath,
    folderDestination,
    setFolderDestination,
    saveTemplate,
    setSaveTemplate,
    isGettingData,
    setIsGettingData
}) => {
    const getExcelFilePath = async () => {
        setIsGettingData(true);
        const filePath = await window.engine.openFile({
            title: "Select Folder",
            accept: ["openFile"],
        });
        if (filePath?.success === true) {
            setFilePath(filePath?.path?.[0]);
            setIsGettingData(false);
        }
    }

    const getFolderPath = async () => {
        setIsGettingData(true);
        const filePath = await window.engine.openFile({
            title: "Select File",
            accept: ["openDirectory"],
        });
        if (filePath?.success === true) {
            setFolderDestination(filePath?.path?.[0]);
            setIsGettingData(false);
        }
    }

    return (
        <div className="relative z-20 px-1">
            <div className="absolute flex justify-between w-full px-5">
                <StickyInstructions
                    title={"Download Container Inf (SCM)"}
                />
                <FormatDownload />
            </div>
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
                    <div className="flex-grow mx-auto relative">
                        <TextField
                            inputProps={{ readOnly: true }}
                            placeholder="Select file"
                            size="small"
                            name="file_path"
                            variant="outlined"
                            value={filePath}
                            sx={{
                                width: "250px",
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
                            disabled={isGettingData}
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
                            onClick={getExcelFilePath}
                        >
                            <UploadFileOutlinedIcon />
                        </Button>
                    </div>
                </div>
                <div className="flex justify-start items-center gap-1">
                    <FormTitle
                        text={"PDF save Location"}
                        isCompulsory={true}
                        length={inputLength}
                    />
                    <div className="flex-grow mx-auto relative">
                        <TextField
                            inputProps={{ readOnly: true }}
                            placeholder="Select folder"
                            size="small"
                            name="folder_path"
                            variant="outlined"
                            value={folderDestination}
                            sx={{
                                width: "250px",
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
                            disabled={isGettingData}
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
                            onClick={getFolderPath}
                        >
                            <UploadFileOutlinedIcon />
                        </Button>
                    </div>
                </div>
                {/*
                <div className="flex justify-start items-center gap-1">
                    <FormTitle
                        text={"Invoice Save Format"}
                        isCompulsory={false}
                        length={inputLength}
                    />
                    <div className="flex-grow mx-auto w-[250px]">
                        <FormControl fullWidth size="small">
                            <Select
                                value={saveTemplate}
                                sx={{
                                    height: 25,
                                    fontSize: 14,
                                    overflow: "hidden",
                                }}
                                onChange={(e) => setSaveTemplate(e.target.value)}
                                className="editableInput"
                            >
                                <MenuItem
                                    sx={{ fontSize: 14, height: 25 }}
                                    value="SL NO"
                                >
                                    SL NO
                                </MenuItem>
                                <MenuItem
                                    sx={{ fontSize: 14, height: 25 }}
                                    value="CONTAINER"
                                >
                                    CONTAINER
                                </MenuItem>
                                <MenuItem
                                    sx={{ fontSize: 14, height: 25 }}
                                    value="#INVOICE NO"
                                >
                                   #INVOICE NO
                                </MenuItem>
                                <MenuItem
                                    sx={{ fontSize: 14, height: 25 }}
                                    value="#FCR NO"
                                >
                                    #FCR NO
                                </MenuItem>
                                <MenuItem
                                    sx={{ fontSize: 14, height: 25 }}
                                    value="#EXP NO"
                                >
                                    #EXP NO
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>
                */}
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
                        <span>Start Downloading</span>
                    </LoadingButton>
                    <Button
                        onClick={handleStop}
                        variant="outlined"
                        size="small"
                        sx={{
                            height: 25,
                        }}
                        color="error"
                    >
                        Stop
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default ProcessController;