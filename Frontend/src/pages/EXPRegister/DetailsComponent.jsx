// Faisal Ahmed (C) - 13 August 2025

import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";

const convertToISODate = (date, splitAt = "/") => {
    try {
        const parsedDate = new Date(date + ' GMT+6');
        return parsedDate.toISOString();
    } catch (e) {
        console.log("Error:", e.message);
        return "";
    }
};

export const DetailsButton = ({ setOpenFilter }) => {
    return (
        <Button
            size="small"
            variant="outlined"
            sx={{ height: 25 }}
            onClick={() => setOpenFilter(prev => !prev)}>
            Details
        </Button>
    )
}

const FormTitleLocal = ({ text, isCompulsory, length, style }) => {
    return (
        <Typography
            sx={{
                width: `${length}px`,
                fontSize: '14px',
                fontWeight: 400,
                ...style
            }}
        >
            {text}{isCompulsory && <span className='text-[red]'>*</span>}
        </Typography>
    )
}

export const DetailsComponent = ({
    openFilter,
    setOpenFilter,
    stats,
    handleSearchSubFunction
}) => {
    const [isExpand, setIsExpand] = useState({
        reference: true,
        dates: false
    });

    const handleExpand = (value) => {
        setIsExpand(prev => { return { ...prev, [value]: !prev[value] } })
    }

    const handleClearForm = () => {
        setFormData({});
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

    return (
        <form className="w-full h-full border flex flex-col bg-white rounded-s overflow-hidden sticky top-0" >
            <div className="flex justify-between items-center px-2 py-1 border-b">
                <h1 className="text-xl font-semibold font-roboto">Pending Details</h1>
                <IconButton size="small" onClick={() => setOpenFilter(false)}>
                    <CloseIcon sx={{ fontSize: 18 }} />
                </IconButton>
            </div>
            <div
                className="w-full flex- p-1 flex flex-col gap-y-1 bg-inherit overflow-auto"
                style={{ scrollbarWidth: "thin" }}
            >
                <div className={`px-1 space-y-1`}>
                    <div className="flex flex-col items-start">
                        <FormTitleLocal
                            text={'Yet To Duplicating :'}
                            style={{
                                fontWeight: '600'
                            }}
                        />
                        <div className="flex gap-2">
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
                                value={stats?.['Yet To Duplicating'] || 0}
                                type="text"
                                size="small"
                                name="total_inv_no"
                                className="editableInput"
                            />
                            <Button
                                size="small"
                                variant="outlined"
                                sx={{
                                    height: 25
                                }}
                                onClick={() => handleSearchSubFunction('YetToDup')}
                            >
                                Show
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-col items-start ">
                        <FormTitleLocal
                            text={'Yet To Confirm Export Bill No :'}
                            // length={120}
                            style={{
                                fontWeight: '600'
                            }}
                        />
                        <div className="flex gap-2">
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
                                value={stats?.['Yet To Confirm Export Bill No'] || 0}
                                // onChange={(e) => setFormData(pre => ({ ...pre, EN: e.target.value.replace(/\s/g, ',') }))}
                                type="text"
                                size="small"
                                name="total_Exp"
                                className="editableInput"
                            // placeholder="Ex:- 123,456,..."
                            />
                            <Button
                                size="small"
                                variant="outlined"
                                sx={{
                                    height: 25
                                }}
                                onClick={() => handleSearchSubFunction('YetToConExpBilNo')}
                            >
                                Show
                            </Button>
                        </div>
                    </div>
                    <div>
                        <FormTitleLocal
                            text={'Yet To Triplicating :'}
                            style={{
                                fontWeight: '600',
                            }}
                        />
                        <div className="flex flex-col items-start ms-1">
                            <FormTitleLocal
                                text={'Bill Number Confirmed'}
                            />
                            <div className="flex gap-2">
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
                                    value={stats?.['Bill Number Confirmed'] || 0}
                                    // onChange={(e) => setFormData(pre => ({ ...pre, EN: e.target.value.replace(/\s/g, ',') }))}
                                    type="text"
                                    size="small"
                                    name="total_gsm"
                                    className="editableInput"
                                // placeholder="Ex:- 123,456,..."
                                />
                                <Button
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                        height: 25
                                    }}
                                    onClick={() => handleSearchSubFunction('BilNumCon')}
                                >
                                    Show
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-start ms-1">
                        <FormTitleLocal
                            text={'Bill Number Not Confirmed'}
                        />
                        <div className="flex gap-2">
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
                                value={stats?.['Bill Number Not Confirmed'] || 0}
                                // onChange={(e) => setFormData(pre => ({ ...pre, EN: e.target.value.replace(/\s/g, ',') }))}
                                type="text"
                                size="small"
                                name="total_gsm"
                                className="editableInput"
                            />
                            <Button
                                size="small"
                                variant="outlined"
                                sx={{
                                    height: 25
                                }}
                                onClick={() => handleSearchSubFunction('BiNumNotCon')}
                            >
                                Show
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}
