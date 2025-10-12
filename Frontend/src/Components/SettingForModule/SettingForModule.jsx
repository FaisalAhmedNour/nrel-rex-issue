// Faisal Ahmed(C) 12 Oct 2025

import { useEffect, useState, useRef, useCallback } from "react";
import Swal from "sweetalert2";
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import MenuList from '@mui/material/MenuList';
import SettingsIcon from '@mui/icons-material/Settings';

const SettingForModule = ({ setPageToShow, setLibrary, setIsLoading }) => {
    const [libraries, setLibraries] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null);
    const [submenuOpen, setSubmenuOpen] = useState(false);

    const menuItemRef = useRef(null);
    const submenuTimeoutRef = useRef(null);

    // Track whether user is over the parent or submenu
    const isHoveringParentOrSubmenu = useRef(false);

    const handleClickOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        handleCloseSubmenuImmediately();
    };

    // Called on parent menu item mouse enter
    const handleSubmenuOpen = () => {
        isHoveringParentOrSubmenu.current = true;
        clearTimeout(submenuTimeoutRef.current);
        setSubmenuAnchorEl(menuItemRef.current);
        setSubmenuOpen(true);
    };

    // Called on parent menu item mouse leave
    const handleParentMouseLeave = () => {
        // Don't immediately set to false, give time for submenu enter
        // Start a delay: if mouse doesn't enter submenu in 300ms, close it
        submenuTimeoutRef.current = setTimeout(() => {
            if (!isHoveringParentOrSubmenu.current) {
                setSubmenuOpen(false);
                setSubmenuAnchorEl(null);
            }
        }, 300);
    };

    // Called when mouse enters submenu
    const handleSubmenuMouseEnter = () => {
        isHoveringParentOrSubmenu.current = true;
        clearTimeout(submenuTimeoutRef.current);
    };

    // Called when mouse leaves submenu
    const handleSubmenuMouseLeave = () => {
        isHoveringParentOrSubmenu.current = false;
        // Start a delay: if mouse doesn't return to parent item, close it after 200ms
        submenuTimeoutRef.current = setTimeout(() => {
            if (!isHoveringParentOrSubmenu.current) {
                setSubmenuOpen(false);
                setSubmenuAnchorEl(null);
            }
        }, 200);
    };

    // Immediate close (on full menu/dialog close)
    const handleCloseSubmenuImmediately = useCallback(() => {
        clearTimeout(submenuTimeoutRef.current);
        isHoveringParentOrSubmenu.current = false;
        setSubmenuOpen(false);
        setSubmenuAnchorEl(null);
    }, []);

    useEffect(() => {
        return () => {
            clearTimeout(submenuTimeoutRef.current);
        };
    }, []);

    const getInfo = async () => {
        try {
            setIsLoading(true);
            const result = await window.engine.Proxy(`/lib/getList`, 'get');
            if (result?.status === 200 && result?.data?.success === true) {
                setLibraries(result?.data?.list || []);
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: result?.data?.message || "Failed to fetch library data!"
                });
            }
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error?.message || "Failed to fetch library data!"
            })
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getInfo();
    }, []);

    return (
        <>
            <Tooltip title={"Setting"} arrow placement="right" disableInteractive>
                <Paper
                    sx={{
                        overflow: "hidden",
                        py: 1,
                        px: 1,
                        width: 40,
                        height: 40
                    }}
                    className="space-y-1"
                    onClick={handleClickOpen}
                >
                    <SettingsIcon
                        sx={{
                            color: "gray",
                            cursor: "pointer",
                        }}
                    />
                </Paper>
            </Tooltip>
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
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuList dense sx={{ outline: 'none' }}>
                    <MenuItem
                        ref={menuItemRef}
                        sx={{
                            display: 'flex',
                            gap: 1,
                            maxHeight: 20,
                            height: 25,
                            fontSize: 14,
                            borderTop: '1px solid #e5e5e5',
                            borderBottom: '1px solid #e5e5e5',
                            justifyContent: 'space-between',
                            position: 'relative',
                        }}
                        onMouseEnter={handleSubmenuOpen}
                        onMouseLeave={handleParentMouseLeave}
                        aria-haspopup="true"
                        aria-owns={submenuOpen ? 'library-submenu' : undefined}
                    >
                        Library Setting
                        <span style={{ fontSize: 16, marginLeft: 6, color: '#888' }}>&#9654;</span>
                    </MenuItem>
                    <MenuItem
                        sx={{
                            display: 'flex',
                            gap: 1,
                            maxHeight: 20,
                            height: 25,
                            fontSize: 14,
                            borderTop: '1px solid #e5e5e5',
                            borderBottom: '1px solid #e5e5e5'
                        }}
                        onClick={() => {
                            setPageToShow('general');
                            handleClose();
                        }}
                    >
                        General Setting
                    </MenuItem>
                </MenuList>
            </Menu>
            {/* Submenu for Library Setting */}
            <Menu
                id="library-submenu"
                anchorEl={submenuAnchorEl}
                open={submenuOpen}
                onClose={(event, reason) => {
                    // Close on backdrop click, escape, or tab
                    if (reason === 'escapeKeyDown' || reason === 'tabKeyDown' || reason === 'backdropClick') {
                        handleCloseSubmenuImmediately();
                    }
                }}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                disableAutoFocusItem
                disableEnforceFocus
                disableRestoreFocus
                disableScrollLock
                MenuListProps={{
                    onMouseEnter: handleSubmenuMouseEnter,
                    onMouseLeave: handleSubmenuMouseLeave,
                    dense: true,
                    sx: { outline: 'none' },
                    'aria-labelledby': 'library-setting-button',
                }}
                sx={{
                    minWidth: 210,
                    pointerEvents: 'auto'
                }}
                slotProps={{
                    paper: {
                        onMouseEnter: handleSubmenuMouseEnter,
                        onMouseLeave: handleSubmenuMouseLeave,
                        sx: {
                            marginLeft: '-2px', // Reduce gap between parent and submenu
                        }
                    }
                }}
                BackdropProps={{
                    invisible: true,
                    onClick: handleCloseSubmenuImmediately
                }}
            >
                <MenuList>
                    {libraries && libraries.length > 0
                        ? libraries.map((libraryData, index) => (
                            <MenuItem
                                key={libraryData?._id || index}
                                sx={{
                                    display: 'flex',
                                    gap: 1,
                                    maxHeight: 20,
                                    height: 25,
                                    fontSize: 14,
                                    borderTop: '1px solid #e5e5e5',
                                    borderBottom: '1px solid #e5e5e5'
                                }}
                                onClick={() => {
                                    setPageToShow('library');
                                    setLibrary(libraryData);
                                    handleClose();
                                }}
                            >
                                {libraryData?.Value?.displayName ? libraryData?.Value?.displayName : libraryData?.Name}
                            </MenuItem>
                        ))
                        : (
                            <MenuItem disabled>No Libraries Found</MenuItem>
                        )
                    }
                </MenuList>
            </Menu>
        </>
    );
};

export default SettingForModule;
