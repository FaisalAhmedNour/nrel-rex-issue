// Faisal Ahmed (C)
// Faisal Ahmed (M) - 13 Oct 2025

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';
import FormTitle from "../../Components/FormTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
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
    p: 2.5,
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
            setFormState({ ...formState, src: filePath?.path?.[0] });
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
                    <IconButton
                        size="small"
                        color="error"
                        sx={{
                            position: 'absolute',
                            top: -16,
                            right: -16,
                            p: 0
                        }}
                    >
                        <CloseIcon onClick={handleClose} />
                    </IconButton>
                    <form
                        onSubmit={handleStart}
                        className="flex flex-col items-center gap-1 justify-center bg-white p-2 pb-0"
                    >
                        {/* <div className="flex justify-start items-center gap-1">
                            <FormTitle
                                text={"Action"}
                                isCompulsory={true}
                                length={inputLength}
                            />
                            <div className="w-[400px] mx-auto">
                                <FormControl fullWidth size="small">
                                    <Select
                                        className="editableSelect"
                                        value={formState.action}
                                        onChange={(e) => setFormState({ ...formState, action: e.target.value })}
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
                                        <MenuItem sx={{ fontSize: 14, height: 25 }} value="verify">
                                            <Typography sx={{ fontSize: 14 }}>Verify</Typography>
                                        </MenuItem>
                                        <MenuItem sx={{ fontSize: 14, height: 25 }} value="payslip">
                                            <Typography sx={{ fontSize: 14 }}>Finalize</Typography>
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        </div> */}
                        {(formState.action === "payslip") &&
                            <div className="flex justify-start items-center gap-1">
                                <FormTitle
                                    text={"Files are Save with prefix"}
                                    isCompulsory={true}
                                    length={inputLength}
                                />
                                <div className="w-[400px] mx-auto">
                                    <FormControl fullWidth size="small">
                                        <Select
                                            className="editableSelect"
                                            value={formState.withPrefix === true ? 'true' : 'false'}
                                            onChange={(e) => setFormState({ ...formState, withPrefix: e.target.value === 'true' })}
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
                                            <MenuItem sx={{ fontSize: 14, height: 25 }} value="true">
                                                <Typography sx={{ fontSize: 14 }}>Yes</Typography>
                                            </MenuItem>
                                            <MenuItem sx={{ fontSize: 14, height: 25 }} value="false">
                                                <Typography sx={{ fontSize: 14 }}>No</Typography>
                                            </MenuItem>
                                            {/* <MenuItem sx={{ fontSize: 14, height: 25 }} value="noPrefix">
                                            <Typography sx={{ fontSize: 14 }}>Without Prefix</Typography>
                                        </MenuItem>
                                        <MenuItem sx={{ fontSize: 14, height: 25 }} value="finalize">
                                            <Typography sx={{ fontSize: 14 }}>FINALIZE (REX)</Typography>
                                        </MenuItem> */}
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>}
                        {(formState.action === "verify") &&
                            <div className="flex justify-start items-center gap-1">
                                <FormTitle
                                    text={"Input File"}
                                    isCompulsory={true}
                                    length={inputLength}
                                />
                                <div className="w-[400px] mx-auto relative">
                                    <TextField
                                        inputProps={{ readOnly: true }}
                                        placeholder="Select folder"
                                        size="small"
                                        name="src"
                                        variant="outlined"
                                        value={formState.src}
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
                                        onClick={() => handleSetFolderPath('src')}
                                    >
                                        <DriveFolderUploadIcon />
                                    </Button>
                                </div>
                            </div>}
                        {(formState.action === "payslip") && (
                            <div className="flex justify-between gap-1">
                                <FormTitle text={"User Name"} isCompulsory={true} length={inputLength} />
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
                                        name="userName"
                                        variant="outlined"
                                        id="outlined-basic"
                                        className="editableInput"
                                        value={formState.userName}
                                        onChange={(e) => setFormState({ ...formState, userName: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}
                        {(formState.action === "payslip") && (
                            <div className="flex justify-between gap-1">
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
                        {(formState.action === "payslip") && (
                            <div className="flex justify-start items-center gap-1">
                                <FormTitle
                                    text={"Save PDF To"}
                                    isCompulsory={true}
                                    length={inputLength}
                                />
                                <div className="w-[400px] mx-auto relative">
                                    <TextField
                                        inputProps={{ readOnly: true }}
                                        placeholder="Select folder"
                                        size="small"
                                        name="SoOSavePath"
                                        variant="outlined"
                                        value={formState.SoOSavePath}
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
                                        onClick={() => handleSetFolderPath('SoOSavePath')}
                                    >
                                        <DriveFolderUploadIcon />
                                    </Button>
                                </div>
                            </div>
                        )}
                        {(formState.action === "payslip") && (
                            <div className="flex justify-start items-center gap-1">
                                <FormTitle
                                    text={"Uploading File Location"}
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
                        {/* {(formState.withPrefix === "prefix" || formState.withPrefix === "noPrefix") && (
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
                        )} */}

                        {typeof engineError === 'string' &&
                            <p className="text-[red] text-xs text-center mt-1 col-span-2 order-11">{engineError}</p>}
                        <div className="flex items-center gap-2 mt-1">
                            <Button
                                size="small"
                                sx={{
                                    height: 25,
                                    textTransform: 'capitalize',
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