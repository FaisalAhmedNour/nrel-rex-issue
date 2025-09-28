import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import SimCardDownloadOutlinedIcon from '@mui/icons-material/SimCardDownloadOutlined';
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';

const FormatDownload = () => {

    const handleDownload = () => {
        const link = document.createElement('a');
        const randomFourDigit = Math.floor(1000 + Math.random() * 9000);
        link.href = `./Download Container Inf v1.xlsx`; 
        link.download = `Download Container Inf v1_${randomFourDigit}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <div>
            {/* Icon */}
            <Tooltip title={"Format"} arrow placement="right">
                <Paper
                    sx={{
                        overflow: "hidden",
                        py: 1,
                        px: 1,
                        width: 40,
                        height: 40,
                        // maxHeight: 40,
                        // minHeight: 40,
                        // transition: "width 1s,max-height 1s, min-height 1s",
                    }}
                    className="space-y-1"
                    onClick={handleDownload}
                >
                    <SimCardDownloadIcon
                        sx={{
                            color: "gray",
                            // rotate: "180deg",
                            cursor: "pointer",
                        }}
                    />
                </Paper>
            </Tooltip>
        </div>
    );
};

export default FormatDownload;