// Faisal (C) 9 April 2025

import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import MessageTableHead from "./MessageTableHead";
import MessageTableBody from "./MessageTableBody";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Button, IconButton } from "@mui/material";

const getStartingMessage = () => {
    const defaultMessage = {};
    defaultMessage.time = (new Date()).toLocaleTimeString();
    defaultMessage.message = 'Select the dates and click on "START PULLING" button to start the process.';
    defaultMessage.title = `Instructions`;

    return [defaultMessage];
}

const getEngineStartMessage = () => {
    const defaultMessage = {};
    defaultMessage.time = (new Date()).toLocaleTimeString();
    defaultMessage.message = 'The Engine is started and extracting the files';
    defaultMessage.title = 'Process started';

    return defaultMessage;
}

const MessageTable = ({ isExpandMessage, setIsExpandMessage }) => {
    const [messages, setMessages] = useState(getStartingMessage);
    const titles = ["Time Stamp", "Title", "Message"];

    const fetchMessage = () => {
        window.engine.onMessage(function (msg) {
            // console.log("msg", msg);
            const messageData = {};
            messageData.time = (new Date()).toLocaleTimeString();
            messageData.message = msg.message
            messageData.title = msg.title
            // [n => 'normal', w => 'warning', e => 'error']
            setMessages(prev => [messageData, ...prev]);
        })
    }

    const getEngineOnSignal = () => {
        window.engine.onProcessStart(function (message) {
            console.log("message start", message);
            // setMessages(prev => [getEngineStartMessage(), ...prev]);
        });
    }

    useEffect(() => {
        getEngineOnSignal();
        fetchMessage();
        return undefined;
    }, []);

    const handleClear = () => {
        setMessages([]);
    }

    return (
        <Paper sx={{ flexGrow: 1, height: isExpandMessage ? 180 : 0, transition: "width 1s, height 1s" }}>
            <TableContainer
                component={Paper}
                variant="outlined"
                sx={{
                    height: isExpandMessage ? 180 : 0,
                    border: 0,
                    position: 'relative',
                    transition: "width 1s, height 1s",
                }}
            >
                <Table
                    stickyHeader
                    sx={{ overflow: scroll }}
                    size="small"
                >
                    <MessageTableHead titles={titles} />
                    <MessageTableBody messages={messages}></MessageTableBody>
                </Table>
                <Button
                    size="small"
                    variant="contained"
                    // className="text-[#ffffff00]"
                    onClick={handleClear}
                    sx={{
                        position: 'absolute',
                        top: 1,
                        right: 1,
                        zIndex: 10,
                        height: 23.5,
                        color: 'red',
                        border: 1,
                        borderColor: 'red',
                        bgcolor: '#ffffff00',
                        ":hover": {
                            bgcolor: 'white'
                        }
                    }}
                >Clear</Button>
            </TableContainer>
            {/* <IconButton
                size="small"
                variant='outlined'
                onClick={() => setIsExpandMessage(prev => !prev)}
                sx={{ height: 16, width: '100%', borderRadius: 0, bgcolor: "#f5f5f5" }}>
                <KeyboardArrowDownIcon sx={{
                    rotate: isExpandMessage ? '180deg' : '0deg'
                }} />
            </IconButton> */}
        </Paper>
    )
}

export default MessageTable;
