import { LoadingButton } from "@mui/lab";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';
import DateInputField from "../../Components/DateInputField/DateInputField";
import FormTitle from "../../Components/FormTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useState } from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 650,
    bgcolor: 'background.paper',
    border: '2px solid #1976d2',
    boxShadow: 24,
    p: 3,
    borderRadius: 2
};
const inputLength = 180;

const ProcessController = ({
    isProcessing,
    isStartVisible,
    open,
    handleClose,
    engineError,
    handleStart,
    formState,
    setFormState
}) => {
    const handleSetExcelFilePath = async () => {
        const filePath = await window.engine.openFile({
            title: "Select Excel File",
            accept: ["openFile"],
        });
        if (filePath?.success === true) {
            setFormState({ ...formState, filePath: filePath?.path?.[0] });
        }
    };

    const handleSetFolderPath = async (pathName) => {
        const filePath = await window.engine.openFile({
            title: "Select Folder",
            accept: ["openDirectory"],
        });
        if (filePath?.success === true) {
            setFormState({ ...formState, [pathName]: filePath?.path?.[0] });
        }
    };
    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <div className="relative z-20 px-1">
                    {/* <h3 className="font-semibold text-lg">Response Data</h3> */}
                    <span className="absolute -top-4 -right-4">
                        <IconButton size="small" color="error">
                            <CloseIcon onClick={handleClose} />
                        </IconButton>
                    </span>
                    <form
                        onSubmit={handleStart}
                        className="flex flex-col items-center gap-2 justify-center bg-white p-4 pb-0"
                    >
                        <div className="flex justify-start items-center gap-1">
                            <FormTitle
                                text={"Working Step"}
                                isCompulsory={true}
                                length={inputLength}
                            />
                            <div className="w-[400px] mx-auto">
                                <FormControl fullWidth size="small">
                                    <Select
                                        className="editableSelect"
                                        value={formState.withPrefix}
                                        onChange={(e) => setFormState({ ...formState, withPrefix: e.target.value })}
                                        displayEmpty
                                        size="small"
                                        sx={{
                                            height: 25,
                                            fontSize: 14,
                                            overflow: "hidden",
                                            bgcolor: "#e8f0fe",
                                        }}
                                        inputProps={{ 'aria-label': 'Select Mode' }}
                                    >
                                        <MenuItem sx={{ fontSize: 14, height: 25 }} value="validation">
                                            <Typography sx={{ fontSize: 14 }}>Validation</Typography>
                                        </MenuItem>
                                        <MenuItem sx={{ fontSize: 14, height: 25 }} value="prefix">
                                            <Typography sx={{ fontSize: 14 }}>With Prefix</Typography>
                                        </MenuItem>
                                        <MenuItem sx={{ fontSize: 14, height: 25 }} value="noPrefix">
                                            <Typography sx={{ fontSize: 14 }}>Without Prefix</Typography>
                                        </MenuItem>
                                        <MenuItem sx={{ fontSize: 14, height: 25 }} value="finalize">
                                            <Typography sx={{ fontSize: 14 }}>FINALIZE (REX)</Typography>
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        <div className="flex justify-start items-center gap-1">
                            <FormTitle
                                text={
                                    formState.withPrefix === "validation"
                                        ? "Excel source file location"
                                        : "Excel Input File"
                                }
                                isCompulsory={true}
                                length={inputLength}
                            />
                            <div className="w-[400px] mx-auto relative">
                                <TextField
                                    inputProps={{ readOnly: true }}
                                    placeholder="Select folder"
                                    size="small"
                                    name="file_path"
                                    variant="outlined"
                                    value={formState.filePath}
                                    sx={{
                                        width: "100%",
                                        bgcolor: "#e8f0fe",
                                        "& .MuiInputBase-root": {
                                            height: 25,
                                            fontSize: 14,
                                        },
                                        overflow: "hidden",
                                    }}
                                />
                                <Button
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
                        {(formState.withPrefix === "prefix" || formState.withPrefix === "finalize") && (
                            <div className="flex justify-start items-center gap-1">
                                <FormTitle
                                    text={"PDF Document Source"}
                                    isCompulsory={true}
                                    length={inputLength}
                                />
                                <div className="w-[400px] mx-auto relative">
                                    <TextField
                                        inputProps={{ readOnly: true }}
                                        placeholder="Select folder"
                                        size="small"
                                        name="DOCpath"
                                        variant="outlined"
                                        value={formState.DOCpath}
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
                                    />
                                    <Button
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
                                        onClick={() => handleSetFolderPath('DOCpath')}
                                    >
                                        <DriveFolderUploadIcon />
                                    </Button>
                                </div>
                            </div>
                        )}
                        {/* {console.log(createNewSoO, createNewSoO === true)} */}
                        {(formState.withPrefix === "prefix" || formState.withPrefix === "noPrefix") && (
                            <div className="flex justify-start items-center gap-5">
                                <FormTitle
                                    text={"Create New SoO"}
                                    length={inputLength}
                                />
                                <div className="w-[385px] mx-auto relative">
                                    <FormControl
                                        onChange={(e) => setFormState({ ...formState, createNewSoO: e.target.value === true || e.target.value === 'true' })}>
                                        <RadioGroup
                                            row
                                        >
                                            <FormControlLabel
                                                value={true}
                                                control={<Radio size="small" sx={{ height: 25, px: .5 }}
                                                    checked={formState.createNewSoO === true} />}
                                                label={<Typography sx={{ fontSize: 14 }}>True</Typography>}
                                            />
                                            <FormControlLabel
                                                value={false}
                                                control={<Radio size="small" sx={{ height: 25, px: .5 }}
                                                    checked={formState.createNewSoO === false} />}
                                                label={<Typography sx={{ fontSize: 14 }}>False</Typography>}
                                            />
                                        </RadioGroup>
                                    </FormControl>
                                </div>
                            </div>
                        )}
                        {formState?.withPrefix === "noPrefix" && (
                            <div className="flex justify-start items-center gap-1">
                                <FormTitle
                                    text={"Commercial Invoice"}
                                    isCompulsory={true}
                                    length={inputLength}
                                />
                                <div className="w-[400px] mx-auto relative">
                                    <TextField
                                        inputProps={{ readOnly: true }}
                                        placeholder="Select folder"
                                        size="small"
                                        name="INpath"
                                        variant="outlined"
                                        value={formState.INpath}
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
                                    />
                                    <Button
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
                                        onClick={() => handleSetFolderPath('INpath')}
                                    >
                                        <DriveFolderUploadIcon />
                                    </Button>
                                </div>
                            </div>
                        )}
                        {formState?.withPrefix === "noPrefix hidden" && (
                            <div className="flex justify-start items-center gap-1">
                                <FormTitle
                                    text={"Customs Bill of Export"}
                                    // isCompulsory={true}
                                    length={inputLength}
                                />
                                <div className="w-[400px] mx-auto relative">
                                    <TextField
                                        inputProps={{ readOnly: true }}
                                        placeholder="Select folder"
                                        size="small"
                                        name="BEpath"
                                        variant="outlined"
                                        value={formState.BEpath}
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
                                    // onChange={(e) => handleFormData('BEpath', e.target.value)}
                                    />
                                    <Button
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
                                        onClick={() => handleSetFolderPath('BEpath')}
                                    >
                                        <DriveFolderUploadIcon />
                                    </Button>
                                </div>
                            </div>
                        )}
                        {formState?.withPrefix === "noPrefix" && (
                            <div className="flex justify-start items-center gap-1">
                                <FormTitle
                                    text={"Bill of Lading"}
                                    isCompulsory={true}
                                    length={inputLength}
                                />
                                <div className="w-[400px] mx-auto relative">
                                    <TextField
                                        inputProps={{ readOnly: true }}
                                        placeholder="Select folder"
                                        size="small"
                                        name="BLpath"
                                        variant="outlined"
                                        value={formState.BLpath}
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
                                    // onChange={(e) => handleFormData('BLpath', e.target.value)}
                                    />
                                    <Button
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
                                        onClick={() => handleSetFolderPath('BLpath')}
                                    >
                                        <DriveFolderUploadIcon />
                                    </Button>
                                </div>
                            </div>
                        )}
                        {formState?.withPrefix === "noPrefix hidden" && (
                            <div className="flex justify-start items-center gap-1">
                                {/* <p className="w-inputLength">: </p> */}
                                <FormTitle
                                    text={"Bangladesh Bank EXP"}
                                    // isCompulsory={true}
                                    length={inputLength}
                                />
                                <div className="w-[400px] mx-auto relative">
                                    <TextField
                                        inputProps={{ readOnly: true }}
                                        placeholder="Select folder"
                                        size="small"
                                        name="EXpath"
                                        variant="outlined"
                                        value={formState.EXpath}
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
                                    // onChange={(e) => handleFormData('EXpath', e.target.value)}
                                    />
                                    <Button
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
                                        onClick={() => handleSetFolderPath('EXpath')}
                                    >
                                        <DriveFolderUploadIcon />
                                    </Button>
                                </div>
                            </div>
                        )}
                        {formState?.withPrefix === "validation" || (
                            <div className="flex justify-between gap-2">
                                {/* <p className="w-28 text-[14px]">Username: </p> */}
                                <FormTitle text={"Username"} isCompulsory={true} length={inputLength} />
                                <div className="w-[400px] mx-auto relative">
                                    <TextField
                                        fullWidth
                                        sx={{
                                            flexGrow: 1,
                                            "& .MuiInputBase-root": {
                                                height: 25,
                                                fontSize: 14,
                                            },
                                        }}
                                        size="small"
                                        name="user_name"
                                        variant="outlined"
                                        id="outlined-basic"
                                        className="editableInput"
                                        value={formState.username}
                                        onChange={(e) => setFormState({ ...formState, username: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}
                        {formState?.withPrefix === "validation" || (
                            <div className="flex justify-between gap-2">
                                {/* <p className="w-28 text-[14px]">Password: </p> */}
                                <FormTitle text={"Password"} isCompulsory={true} length={inputLength} />
                                <div className="w-[400px] mx-auto relative">
                                    <TextField
                                        fullWidth
                                        sx={{
                                            flexGrow: 1,
                                            "& .MuiInputBase-root": {
                                                height: 25,
                                                fontSize: 14,
                                            },
                                        }}
                                        value={formState.password}
                                        onChange={(e) => setFormState({ ...formState, password: e.target.value })}
                                        type="password"
                                        size="small"
                                        name="password"
                                        variant="outlined"
                                        id="outlined-basic"
                                        className="editableInput"
                                    />
                                </div>
                            </div>
                        )}
                        {/* {typeof engineError === 'string' &&
                            <p className="text-[red] text-xs text-center mt-1 col-span-2 order-11">{engineError}</p>} */}
                        <div className="flex items-center gap-2 mt-1">
                            <Button
                                size="small"
                                sx={{
                                    height: 25,
                                }}
                                color="success"
                                type="submit"
                                variant="outlined"
                            >Start</Button>
                        </div>
                    </form>
                </div>
            </Box>
        </Modal>
    )
}

export default ProcessController;