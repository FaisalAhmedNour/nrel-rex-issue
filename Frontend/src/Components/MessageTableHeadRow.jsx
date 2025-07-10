import { TableCell } from '@mui/material';
import React from 'react';
import { TableHeadStyle3 } from '../lib';

const MessageTableHeadRow = ({title,style,ind}) => {

    if (ind === 1){
        style = {...style, width:300}
    }
    return (
        <TableCell
            sx={{...TableHeadStyle3, ...style}}
            // align={ind === 0 ?'left':'center'}
            align='left'

            >
            {title}
        </TableCell>
    );
};

export default MessageTableHeadRow;