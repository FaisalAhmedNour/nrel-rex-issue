// Faisal Ahmed (C) - 28 Sep 2025

import { useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

const Field = ({
    header,
    rowNo,
    tableData,
    value: currentValue,
    sourceLibraryData,
    handleFieldChange,
    errorMessages,
    setErrors,
    toEdit
}) => {
    const [value, setValue] = useState('');
    const [suggestionsList, setSuggestionsList] = useState([]);

    //--------------
    const getSuggestions = (value) => {
        const inputValue = value.toString().trim().toLowerCase();
        const inputLength = inputValue.length;
        return inputLength === 0 ? [] : sourceLibraryData?.[header?.sourceLibrary]?.filter(item =>
            item?.[header?.hName]?.toLowerCase().includes(inputValue.toLowerCase())
        );
    };

    const onSuggestionsFetchRequested = ({ value }) => {
        const test = getSuggestions(value);
        setSuggestionsList(test);
    };

    const onSuggestionsClearRequested = () => {
        setSuggestionsList([]);
    };

    const onChange = (_, { newValue }) => {
        setValue(newValue);
    };

    const onSuggestionSelected = (e, { suggestionValue }) => {
        const receivedData = sourceLibraryData?.[header?.sourceLibrary]?.find((libraryData) => libraryData?.[header?.hName] === suggestionValue?.trim());
        handleFieldChange(false, true, rowNo, receivedData);
    }

    const getSuggestionValue = (suggestion) => suggestion?.[header?.hName];

    const renderSuggestion = (suggestion) => <div>{suggestion?.[header?.hName]}</div>;
    //--------------

    function isValueUnique(arr, key, val) {
        const matches = arr.filter(item => item[key] === val);
        return matches.length === 1;
    }

    const handleSetErrorMessages = (messages) => {
        setErrors((prev) => {
            const existingError = prev.find(
                e => e.index === rowNo && e.header === header?.hName
            );

            if (existingError) {
                return prev.map(e =>
                    e.index === rowNo && e.header === header?.hName
                        ? { ...e, messages }
                        : e
                );
            }

            return [...prev, { index: rowNo, header: header?.hName, messages }];
        });
    };

    const handleRemoveErrorMessage = (message) => {
        setErrors((prev) => {
            const existingError = prev.find(
                e => e.index === rowNo && e.header === header?.hName
            );

            if (existingError) {
                const updatedMessages = existingError.messages.filter(msg => msg !== message);

                if (updatedMessages.length > 0) {
                    return prev.map(e =>
                        e.index === rowNo && e.header === header?.hName
                            ? { ...e, messages: updatedMessages }
                            : e
                    );
                }

                return prev.filter(
                    e => !(e.index === rowNo && e.header === header?.hName)
                );
            }

            return prev;
        });
    };

    const handleCheckError = () => {
        // console.log("Check Error", currentValue, header);
        if (header?.primary == true && !isValueUnique(tableData, header?.hName, currentValue)) {
            handleSetErrorMessages(['unique']);
        }
        else {
            handleRemoveErrorMessage('unique');
        }
        if (header?.required == true && (currentValue == null || currentValue == "")) {
            handleSetErrorMessages(['required']);
        }
        else {
            handleRemoveErrorMessage('required');
        }
        if ((header?.['length'] != null && header?.["length"] != 0) && currentValue?.length > header?.["length"]) {
            // console.log("Length Less", currentValue?.length, header?.["length"]);
            handleSetErrorMessages([`LengthLess`]);
        }
        else {
            handleRemoveErrorMessage(`LengthLess`);
        }
        if ((header?.min != null && header?.min != 0) && currentValue < header?.min) {
            handleSetErrorMessages([`greater`]);
        }
        else {
            handleRemoveErrorMessage(`greater`);
        }
        if ((header?.max != null && header?.max != 0) && currentValue > header?.max) {
            handleSetErrorMessages([`less`]);
        }
        else {
            handleRemoveErrorMessage(`less`);
        }
    };

    useEffect(() => {
        handleCheckError();
        setValue(currentValue || '');
    }, [currentValue, JSON.stringify(header), sourceLibraryData]);

    const errorMessagesList = {
        'unique': "Value must be unique",
        'required': "Value is required",
        'LengthLess': "Value length must be less than " + header?.["length"],
        'greater': "Value must be greater than " + header?.min,
        'less': "Value must be less than " + header?.max,
    };

    const handleSetLinkedValues = (value) => {
        const receivedData = sourceLibraryData?.[header?.sourceLibrary]?.find((libraryData) => libraryData?.[header?.hName] === value?.trim());
        handleFieldChange(false, true, rowNo, receivedData || { [header.hName]: '' });
    }

    return (
        <Tooltip
            title={`${(errorMessages && errorMessages.length > 0) ?
                errorMessages.map((message) => errorMessagesList?.[message]) :
                ""}`}
            arrow
            placement="top"
            disableInteractive
        >
            <div className="flex justify-center items-center">
                <div className="relative">
                    {toEdit ?
                        // console.log("sourceLibraryData", sourceLibraryData) || 
                        sourceLibraryData?.[header?.sourceLibrary] != null ?
                            <FormControl sx={{ width: 200 }}>
                                <Select
                                    size='small'
                                    sx={{
                                        height: "20px",
                                        fontSize: 14
                                    }}
                                    className='editableInput'
                                    value={currentValue || ''}
                                    // onChange={(e) => handleFieldChange(false, false, rowNo, header?.hName, header?.min || header?.max ? Number(e.target.value) : e.target.value)}
                                    onChange={(e) => handleSetLinkedValues(e.target.value)}
                                >
                                    <MenuItem
                                        value={''}
                                        sx={{ height: 20, fontSize: 14 }}
                                    >Please Select</MenuItem>
                                    {
                                        // console.log("sourceLibraryData", sourceLibraryData?.[header?.sourceLibrary], header) ||
                                        sourceLibraryData?.[header?.sourceLibrary] &&
                                        sourceLibraryData?.[header?.sourceLibrary]?.length > 0 &&
                                        sourceLibraryData?.[header?.sourceLibrary].map((row, index) => <MenuItem
                                            value={row?.[header?.hName]}
                                            key={index}
                                            sx={{ height: 20, fontSize: 14 }}
                                        >{row?.[header?.hName]}</MenuItem>)}
                                </Select>
                            </FormControl>
                            :
                            <TextField
                                fullWidth
                                size="small"
                                variant="outlined"
                                name={header?.hName}
                                className="editableInput"
                                type={header?.min || header?.max ? "number" : "text"}
                                sx={{
                                    width: 200,
                                    backgroundColor: (errorMessages && errorMessages.length > 0) ? 'red' : "",
                                    '& .MuiInputBase-root': {
                                        height: '20px',
                                        fontSize: 14,
                                    }
                                }}
                                value={currentValue || ''}
                                disabled={header?.hName === 'Country Code'}
                                onChange={(e) => handleFieldChange(false, false, rowNo, header?.hName, header?.min || header?.max ? Number(e.target.value) : e.target.value)}
                            />
                        :
                        currentValue}
                </div>
            </div>
        </Tooltip>
    );
};

export default Field;