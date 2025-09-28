import {
    useRef,
    useState,
} from 'react';
import {
    Button,
    Select,
    MenuItem,
    TextField,
    Typography,
    FormControl,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import FormTitle from '../../../../Components/FormTitle';

const ExpRegisterSearchForm = ({
    stats,
    searchParams,
    getResisterData
}) => {

    const formRef = useRef(null);
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);

    const resetForm = () => {
        if (formRef.current) {
            formRef.current.reset();
        }
    };

    const handleSearch = (event) => {
        event.preventDefault()
        const form = event.target;

        // console.log(form?.to?.value, form?.from?.value);
        searchParams.expSerial = (form?.exp_serial?.value === undefined || form?.exp_serial?.value === '') ? undefined : form?.exp_serial?.value.split(',').map(data => data?.trim())
        searchParams.invoiceNo = (form?.invoice_no?.value === undefined || form?.invoice_no?.value === '') ? undefined : form?.invoice_no?.value.split(',').map(data => data?.trim())
        // searchParams.dup = (form?.dup?.value === undefined || form?.dup?.value === '') ? undefined : form?.dup?.value.split(',').map(data => data?.trim())
        searchParams.from = (form?.from?.value === '' || form?.from?.value === undefined) ? undefined : form?.from?.value;
        searchParams.to = (form?.to?.value === '' || form?.to?.value === undefined) ? undefined : form?.to?.value;
        searchParams.year = selectedYear;
        searchParams.subFunction = undefined;

        getResisterData(0)
    }

    const handleCancel = () => {
        searchParams.expSerial = undefined;
        searchParams.invoiceNo = undefined;
        // searchParams.dup = undefined;
        searchParams.from = undefined;
        searchParams.to = undefined;
        searchParams.subFunction = undefined;
        resetForm();
        getResisterData(0)
    }

    const handleSearchSubFunction = (type) => {
        searchParams.subFunction = type;
        getResisterData(0)
    }

    const handleChange = (event) => {
        setSelectedYear(event.target.value);
    };

    return (
        <div className='mb-2'>
            <form
                ref={formRef}
                onSubmit={handleSearch}
                className='w-full border-2 p-3 grid grid-cols-3 gap-x-4 gap-y-1 relative bg-white rounded-t-md'
            >
                <Typography
                    sx={{
                        position: 'absolute',
                        top: -12,
                        left: 5,
                        fontSize: '12px',
                        backgroundColor: 'white',
                        color: '#f35958',
                        paddingX: '5px',
                        fontWeight: 500,
                        borderRadius: '10px'
                    }}
                >Search Parameters</Typography>
                <div className="flex gap-1 items-center">
                    <FormTitle
                        text={'Invoice No'}
                        isCompulsory={false}
                        length={80}
                    />
                    <div className='flex-grow'>
                        <TextField
                            fullWidth
                            sx={{
                                '& .MuiInputBase-root': {
                                    paddingY: '1px',
                                    paddingX: '4px',
                                    fontSize: '14px',
                                    height: 25
                                },
                            }}
                            placeholder="Ex:- 123,456,..."
                            size="small"
                            name="invoice_no"
                            type="text"
                            className='editableInput'
                        />
                    </div>
                </div>
                <div className="flex gap-1 items-center">
                    <FormTitle
                        text={'EXP Serial'}
                        isCompulsory={false}
                        length={80}
                    />
                    <div className='flex-grow'>
                        <TextField
                            fullWidth
                            sx={{
                                '& .MuiInputBase-root': {
                                    paddingY: '1px',
                                    paddingX: '4px',
                                    fontSize: '14px',
                                    height: 25
                                },
                            }}
                            placeholder="Ex:- 123,456,..."
                            size="small"
                            name="exp_serial"
                            type="text"
                            className='editableInput'
                        />
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <FormTitle
                            text={'EXP Year'}
                            isCompulsory={false}
                            length={80}
                        />
                        <FormControl
                            sx={{
                                width: '40%',
                                minWidth: '100px'
                            }}
                        >
                            <Select
                                // MenuProps={{
                                //     anchorOrigin: {
                                //         // vertical: 'bottom',
                                //         // horizontal: 'left',
                                //     },
                                // }}
                                labelId="EXP Year"
                                value={selectedYear}
                                onChange={handleChange}
                                sx={{
                                    height: 25,
                                    fontSize: 14
                                }}
                                className='editableInput'
                            >
                                {
                                    Array.from({ length: currentYear - 2000 + 1 }, (_, index) => {
                                        const year = 2000 + index;
                                        return (
                                            <MenuItem
                                                key={year}
                                                value={year}
                                                sx={{
                                                    height: 25,
                                                    fontSize: 14
                                                }}
                                            >
                                                {year}
                                            </MenuItem>
                                        );
                                    })
                                }
                            </Select>
                        </FormControl>
                    </div>
                    <Button
                        size="small"
                        type='submit'
                        color='success'
                        variant="contained"
                        sx={{
                            height: 25
                        }}
                        startIcon={<SearchIcon />}
                    >
                        Search
                    </Button>
                </div>
                <div className="flex items-start gap-1">
                    <FormTitle
                        text={'From'}
                        isCompulsory={false}
                        length={80}
                    />
                    <TextField
                        sx={{
                            '& .MuiInputBase-root': {
                                fontSize: '14px',
                                height: 25,
                            },
                        }}
                        size="small"
                        name="from"
                        type="date"
                        className='editableInput'
                    />
                </div>
                <div className="flex items-start gap-1">
                    <FormTitle
                        text={'To'}
                        isCompulsory={false}
                        length={80}
                    />
                    <TextField
                        sx={{
                            '& .MuiInputBase-root': {
                                fontSize: '14px',
                                height: 25,
                            },
                        }}
                        size="small"
                        name="to"
                        type="date"
                        className='editableInput'
                    />
                </div>
                <div className='flex justify-end '>
                    <Button
                        startIcon={<CloseIcon />}
                        size="small"
                        color='error'
                        variant="contained"
                        sx={{
                            height: 25
                        }}
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
            <div className='border-2 border-t-0 rounded-b-md'>
                <div className='grid grid-cols-2 bg-white'>
                    <div className="grid grid-cols-5 gap-2 items-center p-3">
                        <div className='col-span-2'>
                            <Typography
                                sx={{
                                    fontSize: 14,
                                    fontWeight: 600,
                                }}
                            >
                                Yet To Duplicating :
                            </Typography>
                        </div>
                        <div className='col-span-2'>
                            <Typography
                                sx={{
                                    width: '100%',
                                    border: 1,
                                    paddingX: 5,
                                    paddingY: '1px',
                                    borderRadius: 2,
                                    borderColor: '#a5a6a7',
                                    fontWeight: 500,
                                    fontSize: 14,
                                    color: 'text.secondary',
                                    height: 25,
                                }}
                            >
                                {stats?.['Yet To Duplicating'] || 0}
                            </Typography>
                        </div>
                        <div className='flex'>
                            <Button
                                size='small'
                                variant='contained'
                                sx={{ paddingY: 0, height: 25 }}
                                onClick={() => handleSearchSubFunction('YetToDup')}
                            >Show</Button>
                        </div>
                    </div>
                    <div className='row-span-2 p-3 bg-white'>
                        <div>
                            <Typography
                                sx={{
                                    fontSize: '14px',
                                    fontWeight: 600
                                }}
                            >
                                Yet To Triplicating :
                            </Typography>
                            <div className='flex flex-col gap-2 pl-5'>
                                <div className='grid grid-cols-5 items-center gap-2'>
                                    <div className='col-span-2'>
                                        <Typography
                                            sx={{
                                                fontWeight: 400,
                                                fontSize: '14px',
                                            }}
                                        >
                                            Bill Number Confirmed :
                                        </Typography>
                                    </div>
                                    <div className='col-span-2'>
                                        <Typography
                                            sx={{
                                                width: '100%',
                                                border: 1,
                                                paddingX: 5,
                                                paddingY: '1px',
                                                borderRadius: 2,
                                                borderColor: '#a5a6a7',
                                                fontWeight: 500,
                                                fontSize: 14,
                                                color: 'text.secondary',
                                                height: 25,
                                                marginRight: 1
                                            }}
                                        >
                                            {stats?.['Bill Number Confirmed'] || 0}
                                        </Typography>
                                    </div>
                                    <div className='flex'>
                                        <Button
                                            size='small'
                                            variant='contained'
                                            sx={{ paddingY: 0, height: 25 }}
                                            onClick={() => handleSearchSubFunction('BilNumCon')}
                                        >Show</Button>
                                    </div>
                                </div>
                                <div className='grid grid-cols-5 items-center gap-2'>
                                    <div className='col-span-2'>
                                        <Typography
                                            sx={{
                                                fontSize: '14px',
                                                fontWeight: 400,
                                            }}
                                        >
                                            Bill Number Not Confirmed :
                                        </Typography>
                                    </div>
                                    <div className='col-span-2'>
                                        <Typography
                                            sx={{
                                                width: '100%',
                                                border: 1,
                                                paddingX: 5,
                                                paddingY: '1px',
                                                borderRadius: 2,
                                                borderColor: '#a5a6a7',
                                                fontWeight: 500,
                                                fontSize: 14,
                                                color: 'text.secondary'
                                            }}
                                        >
                                            {stats?.['Bill Number Not Confirmed'] || 0}
                                        </Typography>
                                    </div>
                                    <div>
                                        <Button
                                            size='small'
                                            variant='contained'
                                            sx={{ paddingY: 0, height: 25 }}
                                            onClick={() => handleSearchSubFunction('BiNumNotCon')}
                                        >Show</Button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-5 gap-2 items-start p-3">
                        <div className='col-span-2'>
                            <Typography
                                sx={{
                                    fontSize: '14px',
                                    fontWeight: 600
                                }}
                            >
                                Yet To Confirm Export Bill No :
                            </Typography>
                        </div>
                        <div className='col-span-2'>
                            <Typography
                                sx={{
                                    width: '100%',
                                    border: 1,
                                    paddingX: 5,
                                    paddingY: '1px',
                                    borderRadius: 2,
                                    borderColor: '#a5a6a7',
                                    fontWeight: 500,
                                    fontSize: 14,
                                    color: 'text.secondary'
                                }}
                            >
                                {stats?.['Yet To Confirm Export Bill No'] || 0}
                            </Typography>
                        </div>
                        <div className='flex'>
                            <Button
                                size='small'
                                variant='contained'
                                sx={{ paddingY: 0, height: 25 }}
                                onClick={() => handleSearchSubFunction('YetToConExpBilNo')}
                            >Show</Button>
                        </div>
                    </div>
                </div>

            </div>
        </div >
    );
};

export default ExpRegisterSearchForm;