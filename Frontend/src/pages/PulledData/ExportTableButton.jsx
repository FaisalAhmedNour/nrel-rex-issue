import { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DownloadIcon from '@mui/icons-material/Download';

const ExportTableButton = ({ handleExport, isDownloading }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleTriggerExport = (type) => {
        handleExport(type);
        handleClose();
    }

    return (
        <>
            <Button
                size="small"
                variant="outlined"
                startIcon={<DownloadIcon />}
                sx={{ height: 25 }}
                onClick={handleClick}
                disabled={isDownloading}
            >
                Export
            </Button>
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
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={() => handleTriggerExport('selected')}>Selected Data</MenuItem>
                <MenuItem onClick={() => handleTriggerExport('thisPage')}>This Page</MenuItem>
                <MenuItem onClick={() => handleTriggerExport('all')}>All Data</MenuItem>
            </Menu>
        </>
    )
}

export default ExportTableButton;