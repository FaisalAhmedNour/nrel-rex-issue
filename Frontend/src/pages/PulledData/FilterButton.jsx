import { useEffect, useState } from "react";
import { Button, Checkbox, IconButton, Tooltip } from "@mui/material";
import TuneIcon from '@mui/icons-material/Tune';
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import moment from "moment";

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
                fontWeight: 400,
                // display: 'flex',
                // justifyContent: "space-between",
                // alignItems: 'center',

            }}
        >
            {text}{isCompulsory && <span className='text-[red]'>*</span>}
        </Typography>
    )
}

export const FilterComponent = ({
    // formRef,
    isExtractedPO,
    setIsExtractedPO,
    isExtractedPN,
    setIsExtractedPN,
    openFilter,
    setOpenFilter,
    orderNo,
    setOrderNo,
    brandName,
    handleSetBrandName,
    setCcdFrom,
    ccdFrom,
    ccdTo,
    setCcdTo,
    handleClear,
    handleSubmit,
}) => {
    const [isExpand, setIsExpand] = useState({
        reference: false,
        brandName: false,
        dates: false,
        status: false
    });

    const handleExpand = (value) => {
        setIsExpand(prev => { return { ...prev, [value]: !prev[value] } })
    }

    const handleSetIsPOExtracted = (value) => {
        if (isExtractedPO === value) {
            setIsExtractedPO(null);
        }
        else {
            setIsExtractedPO(value);
        }
    }

    const handleSetIsPLExtracted = (value) => {
        console.log(value);
        if (isExtractedPN === value) {
            setIsExtractedPN(null);
        }
        else {
            setIsExtractedPN(value);
        }
    }

    return (
        <form
            // ref={formRef}
            className="w-full h-full border flex flex-col bg-white rounded-s overflow-hidden sticky top-0"
        >
            <div className="flex justify-between items-center px-2 py-1 border-b">
                <h1 className="text-xl font-semibold font-roboto">All filters</h1>
                <IconButton size="small" onClick={() => setOpenFilter(false)}>
                    <CloseIcon sx={{ fontSize: 18 }} />
                </IconButton>
            </div>
            <div className="w-full flex- p-1 flex flex-col gap-y-1 bg-inherit overflow-auto">
                <div
                    style={{
                        color: isExtractedPN ? 'gray' : 'black'
                    }}
                    onClick={() => handleExpand('reference')}
                    className="flex justify-between items-center cursor-pointer"
                >
                    <h2 className="px-1 w-full font-semibold">Reference</h2>
                    <KeyboardArrowDownIcon sx={{ rotate: isExpand.reference ? '180deg' : '0deg' }} />
                </div>
                <div className={`px-1 space-y-1 ${isExpand.reference ? 'visible' : 'hidden'}`}>
                    <div
                        style={{
                            color: isExtractedPN ? 'gray' : 'black'
                        }}
                        className="flex flex-col items-start ">
                        <FormTitleLocal
                            text={'Order No'}
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
                            disabled={isExtractedPN}
                            value={orderNo || ''}
                            onChange={(e) => setOrderNo(e.target.value)}
                            type="text"
                            size="small"
                            name="order_no"
                            className="editableInput"
                            placeholder="Ex:- ABC123,DEF456,..."
                        />
                    </div>
                    {/* <div className="flex flex-col items-start ">
                        <FormTitleLocal
                            text={'Is PO Extracted'}
                        />
                        <div className="grid grid-cols-2">
                            <p><Checkbox
                                size="small"
                                checked={isExtractedPO === '1'}
                                onClick={() => handleSetIsPOExtracted('1')}
                                sx={{ p: 0 }}
                            /> <span className="text-sm">Extracted</span></p>
                            <p><Checkbox
                                size="small"
                                checked={isExtractedPO === '0'}
                                onClick={() => handleSetIsPOExtracted('0')}
                                sx={{ p: 0 }}
                            /> <span className="text-sm">Not Extracted</span></p>
                        </div>
                    </div>
                    <div className="flex flex-col items-start ">
                        <FormTitleLocal
                            text={'Is PL Extracted'}
                        />
                        <div className="grid grid-cols-2">
                            <p><Checkbox
                                size="small"
                                checked={isExtractedPN === '1'}
                                onClick={() => handleSetIsPLExtracted('1')}
                                sx={{ p: 0 }}
                            /> <span className="text-sm">Extracted</span></p>
                            <p><Checkbox
                                size="small"
                                checked={isExtractedPN === '0'}
                                onClick={() => handleSetIsPLExtracted('0')}
                                sx={{ p: 0 }}
                            /> <span className="text-sm">Not Extracted</span></p>
                        </div>
                    </div> */}
                </div>
                <div
                    onClick={() => handleExpand('status')}
                    className="flex justify-between items-center cursor-pointer"
                >
                    <h2 className="px-1 w-full font-semibold">Status</h2>
                    <KeyboardArrowDownIcon sx={{ rotate: isExpand.status ? '180deg' : '0deg' }} />
                </div>
                <div className={`px-1 space-y-1 ${isExpand.status ? 'visible' : 'hidden'}`}>
                    <div
                        style={{
                            color: isExtractedPN ? 'gray' : 'black'
                        }}
                        className="flex flex-col items-start w-full"
                    >
                        <FormTitleLocal
                            text={'Is PO Downloaded'}
                        />
                        <div className="grid grid-cols-2 w-full">
                            <p><Checkbox
                                size="small"
                                disabled={isExtractedPN}
                                checked={isExtractedPO === '1'}
                                onClick={() => handleSetIsPOExtracted('1')}
                                sx={{ py: 0, px: .5 }}
                            /> <span className="text-sm">Yes</span></p>
                            <p><Checkbox
                                size="small"
                                disabled={isExtractedPN}
                                checked={isExtractedPO === '0'}
                                onClick={() => handleSetIsPOExtracted('0')}
                                sx={{ py: 0, px: .5 }}
                            /> <span className="text-sm">No</span></p>
                        </div>
                    </div>
                    <div className="flex flex-col items-start ">
                        <div className="flex justify-between w-full">
                            <FormTitleLocal
                                text={'Is PL Downloaded'}
                            />
                            <Tooltip title={'Searching by this, disables other filters'}>
                            <IconButton
                                size="small"
                                color="error"
                                sx={{
                                    p: 0,
                                }}
                            >
                                <HelpOutlineIcon sx={{fontSize: 14}} />
                            </IconButton>
                            </Tooltip>
                        </div>
                        <div className="grid grid-cols-2 w-full">
                            <p><Checkbox
                                size="small"
                                checked={isExtractedPN === '1'}
                                onClick={() => handleSetIsPLExtracted('1')}
                                sx={{ py: 0, px: .5 }}
                            /> <span className="text-sm">Yes</span></p>
                            <p><Checkbox
                                size="small"
                                checked={isExtractedPN === '0'}
                                onClick={() => handleSetIsPLExtracted('0')}
                                sx={{ py: 0, px: .5 }}
                            /> <span className="text-sm">No</span></p>
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        color: isExtractedPN ? 'gray' : 'black'
                    }}
                    onClick={() => handleExpand('brandName')}
                    className="flex justify-between items-center cursor-pointer"
                >
                    <h2 className="px-1 w-full font-semibold">Brand Name</h2>
                    <KeyboardArrowDownIcon sx={{ rotate: isExpand.brandName ? '180deg' : '0deg' }} />
                </div>
                <div
                    style={{
                        color: isExtractedPN ? 'gray' : 'black'
                    }}
                    className={`px-1 ${isExpand.brandName ? 'visible' : 'hidden'}`}
                >
                    <p className="text-sm"><Checkbox
                        onClick={() => handleSetBrandName('Jack & Jones')}
                        checked={brandName === 'Jack & Jones'}
                        sx={{ p: 0 }}
                        size="small"
                        disabled={isExtractedPN}
                    /> Jack & Jones</p>
                    <p className="text-sm"><Checkbox
                        onClick={() => handleSetBrandName('ONLY & SONS')}
                        checked={brandName === 'ONLY & SONS'}
                        sx={{ p: 0 }}
                        size="small"
                        disabled={isExtractedPN}
                    /> ONLY & SONS</p>
                    <p className="text-sm"><Checkbox
                        onClick={() => handleSetBrandName('ONLY')}
                        checked={brandName === 'ONLY'}
                        sx={{ p: 0 }}
                        size="small"
                        disabled={isExtractedPN}
                    /> ONLY</p>
                    <p className="text-sm"><Checkbox
                        onClick={() => handleSetBrandName('Jdy')}
                        checked={brandName === 'Jdy'}
                        sx={{ p: 0 }}
                        size="small"
                        disabled={isExtractedPN}
                    /> Jdy</p>
                </div>
                <div
                    style={{
                        color: isExtractedPN ? 'gray' : 'black'
                    }}
                    onClick={() => handleExpand('dates')}
                    className="flex justify-between items-center cursor-pointer"
                >
                    <h2 className="px-1 w-full font-semibold">Dates</h2>
                    <KeyboardArrowDownIcon sx={{ rotate: isExpand.dates ? '180deg' : '0deg' }} />
                </div>
                <div
                    style={{
                        color: isExtractedPN ? 'gray' : 'black'
                    }}
                    className={`px-1 space-y-1 ${isExpand.dates ? 'visible' : 'hidden'}`}
                >
                    <div className="flex flex-col items-start">
                        <FormTitleLocal
                            text={'CCD From'}
                            length={120}
                        />
                        <div className="flex flex-grow gap-1 w-full">
                            <TextField
                                size="small"
                                placeholder="DD-MMM-YYYY"
                                value={ccdFrom ? moment(ccdFrom).format("DD MMM YYYY") : ''}
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
                                name="ccdFrom"
                                type="date"
                                disabled={isExtractedPN}
                                value={ccdFrom}
                                onChange={(e) => setCcdFrom(e.target.value)}
                                className="w-[20px] border h-[25px] rounded"
                            // max={`${AuthContextInfo?.currentDate?.maxDate}`}
                            // max={both ? undefined : futureDate ? undefined : restrictDate}
                            // min={both ? undefined : futureDate ? restrictDate : undefined}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col items-start">
                        <FormTitleLocal
                            text={'CCD To'}
                            length={120}
                        />
                        <div className="flex flex-grow gap-1 w-full">
                            <TextField
                                size="small"
                                placeholder="DD-MMM-YYYY"
                                value={ccdTo ? moment(ccdTo).format("DD MMM YYYY") : ''}
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
                                name="ccdTo"
                                type="date"
                                disabled={isExtractedPN}
                                value={ccdTo}
                                onChange={(e) => setCcdTo(e.target.value)}
                                className="w-[20px] border h-[25px] rounded"
                                min={ccdFrom}
                                max={ccdFrom ? new Date(new Date(ccdFrom).setMonth(new Date(ccdFrom).getMonth() + 3)).toISOString().split('T')[0] : undefined}
                            // max={`${AuthContextInfo?.currentDate?.maxDate}`}
                            // max={both ? undefined : futureDate ? undefined : restrictDate}
                            // min={both ? undefined : futureDate ? restrictDate : undefined}
                            />
                        </div>
                    </div>
                    <p className="text-[red] text-xs">Filter within 3 months</p>
                </div>
            </div>
            <div className="flex justify-center items-end gap-3 py-2 border-t">
                <Button
                    // type="submit"
                    onClick={handleSubmit}
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
                    // startIcon={<CloseIcon />}
                    variant="outlined"
                    color="error"
                    size="small"
                    sx={{
                        fontSize: "12px",
                        padding: "2px 5px",
                        height: 25,
                    }}
                    onClick={handleClear}
                >
                    Cancel
                </Button>
            </div>
        </form>
    )
}

// export default leftButtons = { FilterButton, FilterComponent };