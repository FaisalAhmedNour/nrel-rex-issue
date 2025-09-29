// Faisal Ahmed (C)
// Faisal Ahmed (M) - 28 Sep 2025

import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import LoaderPage from '../../Components/Loader/LoaderPage';
import CustomTable from '../../Components/CustomTable/CustomTable';
import exportToExcel from '../../Functions/exportToExcel';
import Field from './Field';
import Swal from 'sweetalert2';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Pagination from '../../Components/CustomTable/Pagination/Pagination';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { TableHeadStyle3 } from '../../lib';

const LibraryForUser = ({ library, setPageToShow }) => {
    useEffect(() => {
        console.log('library', library);
    }, [library]);
    // form data
    const [formData, setFormData] = useState({});
    // const [action, setAction] = useState('add');
    const [dataToUpdate, setDataToUpdate] = useState(undefined);
    // togol
    const [isDownloading, setIsDownloading] = useState(false);
    const [toEdit, setToEdit] = useState(null);
    const [isSaveActive, setIsSaveActive] = useState(false);
    const [reload, setReload] = useState(false);
    // loader
    const [isLoading, setIsLoading] = useState(false);
    const [gettingData, setGettingData] = useState(false);
    // table headers
    const [headers, setHeaders] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [originalTableData, setOriginalTableData] = useState([]);
    const [sourceLibraryData, setSourceLibraryData] = useState({})
    // errors
    const [APIError, setAPIError] = useState(null);
    const [errors, setErrors] = useState([]);
    // menu for settings
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    // const handleClick = (event) => {
    //     setAnchorEl(event.currentTarget);
    // };
    const handleClose = () => {
        setAnchorEl(null);
    };
    // Pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const handleChangePage = (p) => { setPage(p) };
    const handleChangeRowsPerPage = (r) => { setRowsPerPage(r) };

    // modal for adding new item
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        if (dataToUpdate !== undefined) {
            setFormData(dataToUpdate);
        }
    }, [dataToUpdate])

    const handleCloseModal = () => {
        setOpenModal(false);
        setFormData({});
        setDataToUpdate([]);
        // setIsSaveActive(true);
    };

    const handleFieldChange = (fieldName, value) => {
        setFormData({
            ...formData,
            [fieldName]: value,
        });
    };

    const handleSaveOrUpdateRecord = async () => {
        try {
            const newRecords = [];
            tableData.forEach(record => {
                if (record?.action === 'add') {
                    newRecords.push({
                        action: 'add',
                        value: { ...record, action: undefined }
                    });
                }
                else if (record?.action === 'upd') {
                    newRecords.push({
                        action: 'upd',
                        id: record?.id,
                        value: { ...record, action: undefined }
                    });
                }
                else if (record?.action === 'del') {
                    newRecords.push({
                        action: 'del',
                        id: record?.id,
                    });
                }
            })
            // console.log('New Records to save', newRecords);
            setIsLoading(true)
            const data = {
                Name: 'CountryName-Buyer(REX)',
                Records: newRecords
            }
            // console.log(data);
            // return;
            const result = await window.engine.Proxy(`/lib/modifyRecords`, 'post', data);
            // console.log('Save result', result);
            if (result?.data?.success === true) {
                setReload(e => !e);
                setIsSaveActive(false);
                handleCloseModal();
                Swal.fire({
                    timer: 1000,
                    title: 'Added',
                    icon: "success",
                    showConfirmButton: false,
                    text: 'New record created successfully!',
                });
            }
            else {
                if (result?.data?.error === "Validation Error") {
                    Swal.fire({
                        icon: "error",
                        title: 'Error',
                        text: result?.data?.validationErrors?.[0]?.message,
                    });
                }
                else {
                    Swal.fire({
                        icon: "error",
                        title: 'Error',
                        text: result?.data?.message,
                    });
                }
                console.log(result);
            }
        }
        catch (error) {
            Swal.fire({
                icon: "error",
                title: 'Error',
                text: "Something went wrong! Please try again later.",
            });
            console.error(error);
        }
        finally {
            handleCloseModal();
            setIsLoading(false);
        }
    }

    const getInfo = async (flag = '0') => {
        try {
            flag === "1" ? setGettingData(true) : setIsLoading(true);
            const result = await window.engine.Proxy(`/lib/getRecords?Name=${library?.Name}`, 'get');
            console.log('get data', result);
            if (result?.status === 200 && result?.data?.success === true) {
                setAPIError(null);
                return result?.data;
            }
            else {
                setAPIError(result?.data?.message || "Something went wrong! Try again later.")
                return null;
            }
        } catch (error) {
            console.log(error);
            setAPIError(error?.message || "Something went wrong! Try again later.")
            return null;
        } finally {
            flag === "1" ? setGettingData(false) : setIsLoading(false);
        }
    }

    const getSingleSourceLibraryData = async (name, header) => {
        try {
            const result = await window.engine.Proxy(`/lib/getRecords?Name=${header?.sourceLibrary}`, 'get');
            if (result?.data?.success === true) {
                setSourceLibraryData(prevState => ({
                    ...prevState,
                    [name]: result.data?.records
                }))
            }
        }
        catch (error) {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'failed to fetch source library data for ' + name,
            })
        }
    }

    const getSourceLibraryData = async (headers) => {
        headers.map(header => {
            header?.sourceLibrary &&
                getSingleSourceLibraryData(header?.sourceLibrary, header)
        })
    }

    const getUpdatedBankDetailsInfo = async (flag) => {
        const data = await getInfo(flag);
        if (data) {
            setTableData([...data.records]);
            setOriginalTableData(pre => [...data.records]);
            const filteredHeaders = (data?.Headers || [])
                .filter(header => !header?.hidden)
                .sort((a, b) => a?.ID - b?.ID);
            setHeaders(filteredHeaders);
            getSourceLibraryData(data?.Headers)
        }
    }

    useEffect(() => {
        getUpdatedBankDetailsInfo('0');
    }, []);

    useEffect(() => {
        getUpdatedBankDetailsInfo('1');
    }, [reload, library]);

    const handleExport = () => {
        const headersToExport = headers.map(header => header?.displayName ? header?.displayName : header?.hName);
        const tableDataToExport = tableData.map(row => {
            const rowData = {};
            headers.forEach(header => {
                const key = header?.displayName ? header?.displayName : header?.hName;
                rowData[key] = row[header?.hName] !== undefined ? row[header?.hName] : '';
            })
            return rowData;
        })
        console.log('Exporting', tableDataToExport, headersToExport);
        exportToExcel(tableDataToExport, headersToExport, 'Country Buyer Details For Rex', setIsDownloading, true);
    }

    const handleAddItem = () => {
        setToEdit(tableData?.length);
        const tempData = [...tableData, { action: 'add' }];
        setTableData(tempData);
    }

    const handleDelete = (index) => {
        setTableData(prev => {
            const newData = [...prev];
            if (newData[index]['action'] === "add") {
                newData.splice(index, 1);
            }
            else {
                newData[index]['action'] = 'del';
            }
            return newData;
        });
        if (toEdit === index) setToEdit(null);
        setIsSaveActive(true);
    }

    const handleEdit = (
        isHeader,
        isSource,
        index,
        head,
        value
    ) => {
        // console.log("Edit", isHeader, isSource, index, head, value);
        if (isHeader) {
            const newHeaders = [...headers];
            newHeaders[index][head] = value;
            if (head === 'sourceLibrary' && value) {
                // console.log('yes')
                getSingleSourceLibraryData(newHeaders[index]);
                (newHeaders[index])["hName"] = '';
            }
            setHeaders(newHeaders);
            // console.log(newHeaders[index]);
            setIsSaveActive(true);
        }
        else {
            const newData = [...tableData];
            if (isSource) {
                // console.log('here', head);
                Object.keys(head).forEach(key => {
                    if (key !== 'id') {
                        newData[index][key] = head[key];
                        if (newData[index]['action'] !== "add") newData[index]['action'] = 'upd';
                    }
                });
                setTableData(newData);
                setIsSaveActive(true);
            }
            else {
                newData[index][head] = typeof value == "string" ? value.trim() : value;
                if (newData[index]['action'] !== "add") newData[index]['action'] = 'upd';
                setTableData(newData);
                setIsSaveActive(true);
            }
        }
    };

    const handleSave = async () => {
        handleSaveOrUpdateRecord();
    }

    return (
        <>
            <LoaderPage open={isLoading} />
            {APIError ?
                <p className='text-center text-red-600 bg-red-300 py-3'>{APIError}</p> :
                <CustomTable
                    className={"mt-0"}
                    headerTitle={library?.Value?.displayName || library?.Name}
                    headerButtons={[
                        <Button
                            variant="outlined"
                            sx={{
                                height: '25px'
                            }}
                            color='error'
                            startIcon={<KeyboardBackspaceIcon />}
                            onClick={() => setPageToShow('main')}
                        >
                            Back
                        </Button>,
                        <>{
                            isSaveActive &&
                            <Button
                                variant="outlined"
                                color='success'
                                sx={{
                                    height: '25px'
                                }}
                                onClick={handleSave}
                            >
                                Save
                            </Button>
                        }</>
                    ]}
                    pagination={
                        <Pagination
                            page={page}
                            rowsPerPage={rowsPerPage}
                            totalRows={tableData?.length || 0}
                            rowsPerPageOptions={[5, 10, 25, 50, 100]}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                            leftButtons={[
                                <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<DownloadIcon />}
                                    sx={{ height: 25 }}
                                    onClick={handleExport}
                                    disabled={isDownloading}
                                >
                                    Export
                                </Button>,
                                <>{
                                    isSaveActive &&
                                    <Button
                                        size='small'
                                        variant="outlined"
                                        sx={{
                                            height: '25px'
                                        }}
                                        startIcon={<ReplayOutlinedIcon />}
                                        onClick={() => setReload(prev => !prev)}
                                    >
                                        Reload
                                    </Button>
                                }</>
                            ]}
                        />
                    }
                    body={
                        <TableContainer
                            component={Paper}
                            sx={{ overflowY: 'hidden', scrollbarWidth: 'thin' }}
                        >
                            <Table
                                stickyHeader
                                size="small"
                                sx={{
                                    // mb: 20,
                                    border: 1,
                                    borderBottom: 0,
                                }}
                            >
                                <TableHead sx={{ overflowY: 'hidden' }}>
                                    {/* Source library */}
                                    <TableRow sx={{ position: 'relative' }}>
                                        {headers && headers?.length > 0 &&
                                            <TableCell
                                                align="center"
                                                sx={{
                                                    ...TableHeadStyle3,
                                                    borderLeft: 0,
                                                    position: 'sticky',
                                                    left: 0,
                                                    zIndex: 100,
                                                }}
                                            >
                                                <span className="w-[200px]">sourceLibrary</span>
                                            </TableCell>}
                                        {headers && headers?.length > 0 && headers.map((header, index) => (
                                            <TableCell
                                                align="center"
                                                key={index}
                                                sx={{
                                                    ...TableHeadStyle3,
                                                    borderLeft: 1,
                                                    px: '2px',
                                                }}
                                            >
                                                {/* <FormControl sx={{ width: 200 }}>
                                                    <Select
                                                        size='small'
                                                        sx={{
                                                            height: "20px",
                                                            fontSize: 14
                                                        }}
                                                        className='editableInput'
                                                        value={header?.sourceLibrary || ''}
                                                        onChange={(e) => handleEdit && handleEdit(true, false, index, 'sourceLibrary', e.target.value)}
                                                    >
                                                        <MenuItem
                                                            value={''}
                                                            sx={{ height: 20, fontSize: 14 }}
                                                        >Please Select</MenuItem>
                                                        {suggestionsSetLibraryName && suggestionsSetLibraryName?.length > 0 &&
                                                            suggestionsSetLibraryName.map((name) => <MenuItem
                                                                value={name}
                                                                key={name}
                                                                sx={{ height: 20, fontSize: 14 }}
                                                            >{name}</MenuItem>)}
                                                    </Select>
                                                </FormControl> */}
                                                {header?.sourceLibrary}
                                            </TableCell>
                                        ))}
                                        {headers && headers?.length > 0 && <TableCell
                                            rowSpan={4}
                                            align="center"
                                            sx={{
                                                ...TableHeadStyle3,
                                                borderLeft: 1,
                                                px: '2px',
                                                position: 'sticky',
                                                right: 0,
                                                zIndex: 100,
                                            }}
                                        >
                                            Action
                                        </TableCell>}
                                    </TableRow>
                                    {/* Name */}
                                    {/* <TableRow sx={{ position: 'relative' }}>
                                        {headers && headers?.length > 0 &&
                                            <TableCell
                                                align="center"
                                                sx={{
                                                    ...TableHeadStyle3,
                                                    borderLeft: 0,
                                                    position: 'sticky',
                                                    left: 0,
                                                    zIndex: 100,
                                                }}
                                            >
                                                <span className="w-[200px]">hName: string;</span>
                                            </TableCell>}
                                        {headers && headers?.length > 0 && headers.map((header, index) => (
                                            <TableCell
                                                align="center"
                                                key={index}
                                                sx={{
                                                    ...TableHeadStyle3,
                                                    borderLeft: 1,
                                                    px: '2px',
                                                }}
                                            >
                                                {header?.sourceLibrary === '' ?
                                                    <TextField
                                                        className={isAdvancedSettings ? "editableInput" : "fixedInput"}
                                                        size="small"
                                                        fullWidth
                                                        type="text"
                                                        value={header?.hName || ''}
                                                        InputProps={{ readOnly: isAdvancedSettings ? false : true }}
                                                        onChange={(e) => handleEdit && handleEdit(true, false, index, 'hName', e.target.value)}
                                                        sx={{
                                                            width: 200,
                                                            borderRadius: 1,
                                                            "& .MuiInputBase-root": {
                                                                height: 20,
                                                                overflow: "hidden",
                                                                fontSize: 14,
                                                            },
                                                        }}
                                                        variant="outlined"
                                                    /> :
                                                    <FormControl sx={{ width: 200 }}>
                                                        <Select
                                                            size='small'
                                                            sx={{
                                                                height: "20px",
                                                                fontSize: 14
                                                            }}
                                                            className='editableInput'
                                                            value={header?.hName || ''}
                                                            onChange={(e) => handleEdit && handleEdit(true, false, index, 'hName', e.target.value)}
                                                        >
                                                            <MenuItem
                                                                value={''}
                                                                sx={{ height: 20, fontSize: 14 }}
                                                            >Please Select</MenuItem>
                                                            {
                                                                // console.log("sourceLibraryData", sourceLibraryData?.[header?.hName], header?.hName) &&
                                                                sourceLibraryHeaders?.[header?.sourceLibrary] &&
                                                                sourceLibraryHeaders?.[header?.sourceLibrary]?.length > 0 &&
                                                                sourceLibraryHeaders?.[header?.sourceLibrary].map((name: ILibraryHeaderProps) => <MenuItem
                                                                    value={name?.hName}
                                                                    key={name?.ID}
                                                                    sx={{ height: 20, fontSize: 14 }}
                                                                >{name?.hName}</MenuItem>)}
                                                        </Select>
                                                    </FormControl>}
                                            </TableCell>
                                        ))}

                                    </TableRow> */}
                                    {/* Display Name */}
                                    <TableRow sx={{ position: 'relative' }}>
                                        {headers && headers?.length > 0 &&
                                            <TableCell
                                                align="center"
                                                sx={{
                                                    ...TableHeadStyle3,
                                                    borderLeft: 0,
                                                    position: 'sticky',
                                                    left: 0,
                                                    zIndex: 100,
                                                }}
                                            >
                                                Name
                                            </TableCell>}
                                        {headers && headers?.length > 0 && headers.map((header, index) => (
                                            <TableCell
                                                align="center"
                                                key={index}
                                                sx={{
                                                    ...TableHeadStyle3,
                                                    borderLeft: 1,
                                                    px: '2px',
                                                }}
                                            >
                                                {header?.displayName}
                                            </TableCell>
                                        ))}
                                        {/* {headers && headers?.length > 0 && <TableCell
                                            // rowSpan={9}
                                            align="center"
                                            sx={{
                                                ...TableHeadStyle3,
                                                borderLeft: 1,
                                                px: '2px',
                                            }}
                                        >
                                            Action
                                        </TableCell>} */}
                                    </TableRow>
                                    {/* Primary */}
                                    <TableRow sx={{ position: 'relative' }}>
                                        {headers && headers?.length > 0 &&
                                            <TableCell
                                                align="center"
                                                sx={{
                                                    ...TableHeadStyle3,
                                                    borderLeft: 0,
                                                    position: 'sticky',
                                                    left: 0,
                                                    zIndex: 100,
                                                }}
                                            >
                                                <span className="w-[200px]">Unique</span>
                                            </TableCell>}
                                        {headers && headers?.length > 0 && headers.map((header, index) => (
                                            <TableCell
                                                align="center"
                                                key={index}
                                                sx={{
                                                    ...TableHeadStyle3,
                                                    borderLeft: 1,
                                                    px: '2px',
                                                }}
                                            >
                                                {/* <FormControl sx={{ width: 200 }}>
                                                    <Select
                                                        size='small'
                                                        value={header?.primary ? "true" : "false"}
                                                        sx={{
                                                            height: "20px",
                                                            fontSize: 14
                                                        }}
                                                        className='editableInput'
                                                        onChange={(e) => handleEdit && handleEdit(true, false, index, 'primary', e.target.value === "true")}
                                                    >
                                                        <MenuItem sx={{ height: 20, fontSize: 14 }} value="true">Yes</MenuItem>
                                                        <MenuItem sx={{ height: 20, fontSize: 14 }} value="false">No</MenuItem>
                                                    </Select>
                                                </FormControl> */}
                                                {header?.primary ? "Yes" : "No"}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                    {/* Required */}
                                    <TableRow sx={{ position: 'relative' }}>
                                        {headers && headers?.length > 0 &&
                                            <TableCell
                                                align="center"
                                                sx={{
                                                    ...TableHeadStyle3,
                                                    borderLeft: 0,
                                                    position: 'sticky',
                                                    left: 0,
                                                    zIndex: 100,
                                                }}
                                            >
                                                <span className="w-[200px]">required</span>
                                            </TableCell>}
                                        {headers && headers?.length > 0 && headers.map((header, index) => (
                                            <TableCell
                                                align="center"
                                                key={index}
                                                sx={{
                                                    ...TableHeadStyle3,
                                                    borderLeft: 1,
                                                    px: '2px',
                                                }}
                                            >
                                                {/* <FormControl sx={{ width: 200 }}>
                                                    <Select
                                                        size='small'
                                                        value={header?.required ? "true" : "false"}
                                                        sx={{
                                                            height: "20px",
                                                            fontSize: 14
                                                        }}
                                                        className='editableInput'
                                                        onChange={(e) => handleEdit && handleEdit(true, false, index, 'required', e.target.value === "true")}
                                                    >
                                                        <MenuItem sx={{ height: 20, fontSize: 14 }} value="true">Yes</MenuItem>
                                                        <MenuItem sx={{ height: 20, fontSize: 14 }} value="false">No</MenuItem>
                                                    </Select>
                                                </FormControl> */}
                                                {header?.required ? "Yes" : "No"}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                    {/* Length */}
                                    {/* <TableRow sx={{ position: 'relative' }}>
                                        {headers && headers?.length > 0 &&
                                            <TableCell
                                                align="center"
                                                sx={{
                                                    ...TableHeadStyle3,
                                                    borderLeft: 0,
                                                    position: 'sticky',
                                                    left: 0,
                                                    zIndex: 100,
                                                }}
                                            >
                                                <span className="w-[200px]">length?: number;</span>
                                            </TableCell>}
                                        {headers && headers?.length > 0 && headers.map((header, index) => (
                                            <TableCell
                                                align="center"
                                                key={index}
                                                sx={{
                                                    ...TableHeadStyle3,
                                                    borderLeft: 1,
                                                    px: '2px',
                                                }}
                                            >
                                                <TextField
                                                    value={header?.length || ''}
                                                    size="small"
                                                    type='number'
                                                    name='length'
                                                    variant="outlined"
                                                    className='editableInput'
                                                    sx={{
                                                        width: 200,
                                                        borderRadius: 1,
                                                        '& .MuiInputBase-root': {
                                                            height: '20px',
                                                            fontSize: 14
                                                        }
                                                    }}
                                                    onChange={(e) => handleEdit && handleEdit(true, false, index, 'length', Number(e.target.value))}
                                                />
                                            </TableCell>
                                        ))}
                                    </TableRow> */}
                                    {/* Min */}
                                    {/* <TableRow sx={{ position: 'relative' }}>
                                        {headers && headers?.length > 0 &&
                                            <TableCell
                                                align="center"
                                                sx={{
                                                    ...TableHeadStyle3,
                                                    borderLeft: 0,
                                                    position: 'sticky',
                                                    left: 0,
                                                    zIndex: 100,
                                                }}
                                            >
                                                <span className="w-[200px]">min?: number;</span>
                                            </TableCell>}
                                        {headers && headers?.length > 0 && headers.map((header, index) => (
                                            <TableCell
                                                align="center"
                                                key={index}
                                                sx={{
                                                    ...TableHeadStyle3,
                                                    borderLeft: 1,
                                                    px: '2px',
                                                }}
                                            >
                                                <TextField
                                                    value={header?.min || ''}
                                                    size="small"
                                                    type='number'
                                                    name='min'
                                                    variant="outlined"
                                                    className='editableInput'
                                                    sx={{
                                                        width: 200,
                                                        borderRadius: 1,
                                                        '& .MuiInputBase-root': {
                                                            height: '20px',
                                                            fontSize: 14
                                                        }
                                                    }}
                                                    onChange={(e) => handleEdit && handleEdit(true, false, index, 'min', Number(e.target.value))}
                                                />
                                            </TableCell>
                                        ))}
                                    </TableRow> */}
                                    {/* Max */}
                                    {/* <TableRow sx={{ position: 'relative' }}>
                                        {headers && headers?.length > 0 &&
                                            <TableCell
                                                align="center"
                                                sx={{
                                                    ...TableHeadStyle3,
                                                    borderLeft: 0,
                                                    position: 'sticky',
                                                    left: 0,
                                                    zIndex: 100,
                                                }}
                                            >
                                                <span className="w-[200px]">max?: number;</span>
                                            </TableCell>}
                                        {headers && headers?.length > 0 && headers.map((header, index) => (
                                            <TableCell
                                                align="center"
                                                key={index}
                                                sx={{
                                                    ...TableHeadStyle3,
                                                    borderLeft: 1,
                                                    px: '2px',
                                                }}
                                            >
                                                <TextField
                                                    value={header?.max || ''}
                                                    size="small"
                                                    type='number'
                                                    name='max'
                                                    variant="outlined"
                                                    className='editableInput'
                                                    sx={{
                                                        width: 200,
                                                        borderRadius: 1,
                                                        '& .MuiInputBase-root': {
                                                            height: '20px',
                                                            fontSize: 14
                                                        }
                                                    }}
                                                    onChange={(e) => handleEdit && handleEdit(true, false, index, 'max', Number(e.target.value))}
                                                />
                                            </TableCell>
                                        ))}
                                    </TableRow> */}
                                    {/* Hidden */}
                                    {/* <TableRow sx={{ position: 'relative' }}>
                                        {headers && headers?.length > 0 &&
                                            <TableCell
                                                align="center"
                                                sx={{
                                                    ...TableHeadStyle3,
                                                    borderLeft: 0,
                                                    position: 'sticky',
                                                    left: 0,
                                                    zIndex: 100,
                                                }}
                                            >
                                                <span className="w-[200px]">hidden: boolean;</span>
                                            </TableCell>}
                                        {headers && headers?.length > 0 && headers.map((header, index) => (
                                            <TableCell
                                                align="center"
                                                key={index}
                                                sx={{
                                                    ...TableHeadStyle3,
                                                    borderLeft: 1,
                                                    px: '2px',
                                                }}
                                            >
                                                <FormControl sx={{ width: 200 }}>
                                                    <Select
                                                        size='small'
                                                        value={header?.hidden ? "true" : "false"}
                                                        className='editableInput'
                                                        sx={{
                                                            height: "20px",
                                                            fontSize: 14
                                                        }}
                                                        onChange={(e) => handleEdit && handleEdit(true, false, index, 'hidden', e.target.value === "true")}
                                                    >
                                                        <MenuItem sx={{ height: 20, fontSize: 14 }} value="true">Yes</MenuItem>
                                                        <MenuItem sx={{ height: 20, fontSize: 14 }} value="false">No</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </TableCell>
                                        ))}
                                    </TableRow> */}
                                </TableHead>
                                <TableBody>
                                    {tableData &&
                                        Array.isArray(tableData) &&
                                        tableData
                                            .filter(row => row.action !== 'del')
                                            .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                                            ?.map((row, index) => (
                                                <TableRow key={row?.id ?? index}>
                                                    <TableCell
                                                        align="center"
                                                        sx={{
                                                            px: 1,
                                                            py: '1px',
                                                            fontSize: 14,
                                                            borderLeft: 0,
                                                            whiteSpace: "nowrap",
                                                            borderBottom: '1px solid black',
                                                            position: 'sticky',
                                                            left: 0,
                                                            bgcolor: 'white',
                                                            zIndex: 50,
                                                        }}
                                                    >
                                                        {index + (page * rowsPerPage) + 1}
                                                    </TableCell>
                                                    {headers &&
                                                        headers.map((head, indx) => (
                                                            <TableCell
                                                                align="center"
                                                                key={head?.hName}
                                                                sx={{
                                                                    whiteSpace: "nowrap",
                                                                    py: '1px',
                                                                    fontSize: 14,
                                                                    px: '2px',
                                                                    borderLeft: 1,
                                                                    borderBottom: '1px solid black'
                                                                }}
                                                            >
                                                                <Field
                                                                    key={head?.ID}
                                                                    rowNo={(page * rowsPerPage) + index}
                                                                    header={headers[indx]}
                                                                    value={row?.[head?.hName]}
                                                                    tableData={tableData || []}
                                                                    handleFieldChange={handleEdit}
                                                                    sourceLibraryData={sourceLibraryData}
                                                                    errorMessages={errors.find(e => e.index === index && e.header === head.hName)?.messages || []}
                                                                    setErrors={setErrors}
                                                                    toEdit={toEdit === (page * rowsPerPage) + index}
                                                                />
                                                            </TableCell>
                                                        ))}
                                                    <TableCell
                                                        align="center"
                                                        sx={{
                                                            position: 'sticky',
                                                            right: 0,
                                                            whiteSpace: "nowrap",
                                                            py: '1px',
                                                            fontSize: 14,
                                                            borderLeft: 1,
                                                            bgcolor: 'white',
                                                            borderBottom: '1px solid black'
                                                        }}
                                                    >
                                                        {(row?.id || row.action == 'add') ?
                                                            <div className="flex items-center justify-center gap-1">
                                                                <Tooltip title={'Edit'} placement="left" arrow disableInteractive>
                                                                    <IconButton
                                                                        aria-label="Edit"
                                                                        color='primary'
                                                                        sx={{
                                                                            p: 0,
                                                                            height: 20,
                                                                        }}
                                                                        onClick={() => setToEdit((page * rowsPerPage) + index)}
                                                                    >
                                                                        <EditOutlinedIcon sx={{ fontSize: 20 }} />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title={'Delete'} placement="left" arrow disableInteractive>
                                                                    <IconButton
                                                                        aria-label="Delete"
                                                                        color='error'
                                                                        sx={{
                                                                            p: 0,
                                                                            height: 20,
                                                                        }}
                                                                        onClick={() => handleDelete(index)}
                                                                    >
                                                                        <DeleteOutlineIcon sx={{ fontSize: 20 }} />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </div> :
                                                            <></>}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                    }
                                    <TableRow>
                                        <TableCell
                                            align="center"
                                            sx={{
                                                p: 0,
                                                border: 0,
                                                fontSize: 14,
                                                borderBottom: 1,
                                                background: 'transparent',
                                            }}
                                            colSpan={headers.length + 2}
                                        >
                                            <div className="flex justify-end px-1 h-[35px]">{
                                                <Button
                                                    variant="outlined"
                                                    sx={{
                                                        my: .5,
                                                        height: 25,
                                                        position: 'sticky',
                                                        right: 8,
                                                    }}
                                                    endIcon={<AddIcon />}
                                                    onClick={handleAddItem}
                                                >
                                                    Add Item
                                                </Button>
                                            }</div>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    }
                />
            }
            <Menu
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuList dense>
                    {
                        headers &&
                        headers?.slice(1)?.map((header, index) => (
                            <MenuItem
                                key={header?.id || index}
                                sx={{ display: 'flex', gap: 1 }}
                            >
                                <Checkbox
                                    sx={{
                                        p: 0,
                                    }}
                                    // onClick={() => {
                                    //     setAllHeaders(prev => {
                                    //         const newHeaders = [...prev];
                                    //         if (header.id !== 2 || header.id !== 3)
                                    //             newHeaders[index + 1].isShow = !newHeaders[index + 1].isShow;
                                    //         return newHeaders;
                                    //     });
                                    // }}
                                    disabled={header.id === 2 || header.id === 3}
                                    checked={headers[index + 1]?.isShow}
                                /> {header?.name}
                            </MenuItem>
                        ))
                    }
                </MenuList>
            </Menu>
            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>Add Bank Details</DialogTitle>
                <DialogContent>
                    <div>
                        {headers &&
                            headers?.length !== 0 &&
                            headers?.map(header => <Field
                                key={header?.ID}
                                header={header}
                                formData={formData}
                                setFormData={setFormData}
                                handleFieldChange={handleFieldChange}
                                sourceLibraryData={sourceLibraryData}
                            />
                            )}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button size='small' sx={{ height: 25 }} color='success' onClick={handleCloseModal} variant="outlined">Cancel</Button>
                    <Button size='small' sx={{ height: 25 }} color='error' onClick={handleSaveOrUpdateRecord} variant="outlined">Add</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default LibraryForUser;   