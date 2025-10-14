// Faisal Ahmed (C) - 13 August 2025

import { useEffect, useState } from "react";
import moment from "moment";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import TuneIcon from '@mui/icons-material/Tune';
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import FormControl from "@mui/material/FormControl";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const convertToISODate = (date, splitAt = "/") => {
    try {
        const parsedDate = new Date(date + ' GMT+6');
        return parsedDate.toISOString();
    } catch (e) {
        console.log("Error:", e.message);
        return "";
    }
};

export const FilterButton = ({ setOpenFilter }) => {
    return (
        <Button
            size="small"
            variant="outlined"
            startIcon={<TuneIcon />}
            sx={{ height: 25 }}
            onClick={() => setOpenFilter(prev => !prev)}>
            Filter
        </Button>
    )
}

const FormTitleLocal = ({ text, isCompulsory, length }) => {
    return (
        <Typography
            sx={{
                width: `${length}px`,
                fontSize: '14px',
                fontWeight: 400

            }}
        >
            {text}{isCompulsory && <span className='text-[red]'>*</span>}
        </Typography>
    )
}

export const FilterComponent = ({
    openFilter,
    setOpenFilter,
    handleClear,
    handleSubmit,
    formData,
    setFormData,
}) => {
    const [isExpand, setIsExpand] = useState({
        reference: true,
        dates: false
    });
    const currentYear = new Date().getFullYear();

    const handleExpand = (value) => {
        setIsExpand(prev => { return { ...prev, [value]: !prev[value] } })
    }

    const handleClearForm = () => {
        handleClear();
    }

    useEffect(() => {
        if (openFilter == false) {
            setIsExpand({
                reference: false,
                dates: false
            });
        }
    }, [openFilter]);

    const handleChange = (event) => {
        setFormData(pre => ({ ...pre, selectedYear: event.target.value }))
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full h-full border flex flex-col bg-white rounded-s overflow-hidden sticky top-0"
        >
            <div className="flex justify-between items-center px-2 py-1 border-b">
                <h1 className="text-xl font-semibold font-roboto">All filters</h1>
                <IconButton size="small" onClick={() => setOpenFilter(false)}>
                    <CloseIcon sx={{ fontSize: 18 }} />
                </IconButton>
            </div>
            <div className="w-full p-1 flex flex-col gap-y-1 bg-inherit overflow-hidden">
                <div
                    onClick={() => handleExpand('reference')}
                    className="flex justify-between items-center cursor-pointer"
                >
                    <h2 className="px-1 w-full font-semibold">Reference</h2>
                    <KeyboardArrowDownIcon sx={{ rotate: isExpand.reference ? '180deg' : '0deg' }} />
                </div>
                <div className={`px-1 space-y-1 ${isExpand.reference ? 'visible' : 'hidden'}`}>
                    {/* TODO: make it visible if needed */}
                    {/* <div className="flex flex-col items-start ">
                        <FormTitleLocal
                            text={'EXP No'}
                            length={120}
                        />
                        <TextField
                            fullWidth
                            sx={{
                                "& .MuiInputBase-root": {
                                    height: 25,
                                    paddingY: "1px",
                                    paddingX: "4px",
                                    fontSize: "14px"
                                },
                            }}
                            value={formData?.["ExpNo"] || ''}
                            onChange={(e) => setFormData(pre => ({ ...pre, "ExpNo": e.target.value.replace(/\s/g, ',') }))}
                            // placeholder="Ex:- 123,456,..."
                            type="text"
                            size="small"
                            name="ExpNo"
                            className="editableInput"
                        />
                    </div> */}
                    {/* <div className="flex flex-col items-start ">
                        <FormTitleLocal
                            text={'SoO'}
                            length={120}
                        />
                        <TextField
                            fullWidth
                            sx={{
                                "& .MuiInputBase-root": {
                                    height: 25,
                                    paddingY: "1px",
                                    paddingX: "4px",
                                    fontSize: "14px"
                                },
                            }}
                            value={formData?.["SoO"] || ''}
                            onChange={(e) => setFormData(pre => ({ ...pre, "SoO": e.target.value.replace(/\s/g, ',') }))}
                            // placeholder="Ex:- 123,456,..."
                            type="text"
                            size="small"
                            name="SoO"
                            className="editableInput"
                        />
                    </div> */}
                    <div className="flex flex-col items-start ">
                        <FormTitleLocal
                            text={'Type'}
                            length={120}
                        />
                        <FormControl fullWidth size="small">
                            <Select
                                value={formData?.["type"] || 'all'}
                                onChange={(e) => setFormData(pre => ({ ...pre, "type": e.target.value }))}
                                sx={{
                                    height: 25,
                                    fontSize: 14,
                                }}
                                name="type"
                                className="editableInput"
                            >
                                <MenuItem sx={{ fontSize: 14, height: 20 }} value="all">All</MenuItem>
                                <MenuItem sx={{ fontSize: 14, height: 20 }} value="verified">Verified</MenuItem>
                                <MenuItem sx={{ fontSize: 14, height: 20 }} value="issued">Issued</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                </div>
                {/* <div onClick={() => handleExpand('dates')}
                    className="flex justify-between items-center cursor-pointer"
                >
                    <h2 className="px-1 w-full font-semibold">Dates</h2>
                    <KeyboardArrowDownIcon sx={{ rotate: isExpand.dates ? '180deg' : '0deg' }} />
                </div>
                <div className={`px-1 space-y-1 ${isExpand.dates ? 'visible' : 'hidden'}`}>
                    <div className="flex flex-col items-start">
                        <FormTitleLocal
                            text={'From'}
                            length={120}
                        />
                        <div className="flex flex-grow gap-1 w-full">
                            <TextField
                                size="small"
                                placeholder="DD-MMM-YYYY"
                                value={formData?.from ? moment(formData?.from).format("DD MMM YYYY") : ''}
                                className="editableInput"
                                InputProps={{ readOnly: true }}
                                sx={{
                                    width: "150px",
                                    "& .MuiInputBase-root": {
                                        // maxHeight: 25,
                                        height: 25,
                                        overflow: "hidden",
                                        flexGrow: 1,
                                        fontSize: 14,
                                    },
                                }}
                            />
                            <input
                                name="from"
                                type="date"
                                // disabled={isExtractedPN}
                                value={formData?.from || ''}
                                onChange={(e) => setFormData(pre => ({ ...pre, from: convertToISODate(e.target.value) }))}
                                className="w-[20px] border h-[25px] rounded"
                            // max={`${AuthContextInfo?.currentDate?.maxDate}`}
                            // max={both ? undefined : futureDate ? undefined : restrictDate}
                            // min={both ? undefined : futureDate ? restrictDate : undefined}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col items-start">
                        <FormTitleLocal
                            text={'To'}
                            length={120}
                        />
                        <div className="flex flex-grow gap-1 w-full">
                            <TextField
                                size="small"
                                placeholder="DD-MMM-YYYY"
                                value={formData?.to ? moment(formData?.to).format("DD MMM YYYY") : ''}
                                className="editableInput"
                                InputProps={{ readOnly: true }}
                                sx={{
                                    width: "150px",
                                    "& .MuiInputBase-root": {
                                        // maxHeight: 25,
                                        height: 25,
                                        overflow: "hidden",
                                        flexGrow: 1,
                                        fontSize: 14,
                                    },
                                }}
                            />
                            <input
                                name="to"
                                type="date"
                                value={formData?.to}
                                onChange={(e) => setFormData(pre => ({ ...pre, to: e.target.value }))}
                                className="w-[20px] border h-[25px] rounded"
                                min={formData?.ccdFrom}
                                max={formData?.ccdFrom ? new Date(new Date(formData?.ccdFrom).setMonth(new Date(formData?.ccdFrom).getMonth() + 3)).toISOString().split('T')[0] : undefined}
                            // max={`${AuthContextInfo?.currentDate?.maxDate}`}
                            // max={both ? undefined : futureDate ? undefined : restrictDate}
                            // min={both ? undefined : futureDate ? restrictDate : undefined}
                            />
                        </div>
                    </div>
                </div> */}
            </div>
            <div className="flex justify-center items-end gap-3 py-2 border-t">
                <Button
                    type="submit"
                    variant="outlined"
                    color="success"
                    size="small"
                    sx={{
                        fontSize: "12px",
                        padding: "2px 5px",
                        height: 25,
                    }}
                >
                    Apply
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    sx={{
                        fontSize: "12px",
                        padding: "2px 5px",
                        height: 25,
                    }}
                    onClick={handleClearForm}
                >
                    Cancel
                </Button>
            </div>
        </form>
    )
}
