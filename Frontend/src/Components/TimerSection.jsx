// Faisal Ahmed (C) 3 April 2025
// Faisal Ahmed (M) - 13 Oct 2025

import { useEffect, useRef, useState } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ClearIcon from '@mui/icons-material/Clear';

const TimerSection = ({
  isDataToRun,
  dataToRunText,
  isSuccess,
  successText,
  isFaild,
  chnl,
  isExpand,
  setIsExpand,
  setSucceed,
  seconds,
  setSeconds
}) => {
  // const [isExpand, setIsExpand] = useState(true);
  const [successCount, setSuccessCount] = useState(0);
  const [dataToExtract, setDataToExtract] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [remainingTime, setRemainingTime] = useState('00:00');
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');

  const timeout = useRef(null);
  const startTimer = () => {
    timeout.id = setTimeout(() => {
      // setTimer((prevSeconds) => prevSeconds + 1);
      setSeconds((prevSeconds) => prevSeconds + 1);
      startTimer();
    }, 1000);
  };

  const stopTimer = () => {
    clearTimeout(timeout.id);
  };

  const handleStartTime = () => {
    // setTimer(0);
    setSeconds(0);
    startTimer();
  };

  const handleStopTime = () => {
    // console.log('sopt ')
    stopTimer();
  };

  function calculateRemainingTime(total, complete, failed, speed) {
    const toDo = total - (complete + failed)
    return new Date(toDo * speed * 1000).toISOString().substring(14, 19)
  }

  const fetchStatus = () => {
    window.engine.onStatus(function (status) {
      console.log("status", status);
      let { channel, total, complete, failed, speed, title, details } = status;
      if (channel === chnl) {
        setSucceed(complete);
        if (typeof title === 'string') setTitle(title)
        if (typeof total === 'number') setDataToExtract(total)
        if (typeof complete === 'number') setSuccessCount(complete);
        if (typeof failed === 'number') setFailedCount(failed)
        if (typeof details === 'string') setDetails(details)
        if (typeof total === 'number' && typeof complete === 'number' && typeof failed === 'number') {
          setRemainingTime(calculateRemainingTime(total, complete, failed, speed))
        }
      }
    })
  }

  const getEngineOnSignal = () => {
    window.engine.onProcessStart(function (message) {
      // console.log("message stop", message);
      handleStartTime();
    });
  }

  const getEngineOffSignal = () => {
    window.engine.onProcessStop(function (message) {
      setTitle("Stopped");
      setDetails("The process is stopped.")
      setRemainingTime('00:00');
      handleStopTime();
    });
  }

  const fetchLog = () => {
    window.engine.onLog(function (logData) {
      console.log("logData", logData);
    })
  }

  useEffect(() => {
    fetchStatus();
    return undefined;
  }, [chnl]);

  useEffect(() => {
    fetchLog();
    getEngineOffSignal();
    getEngineOnSignal();
    return undefined;
  }, []);

  return (
    <Paper
      sx={{
        overflow: "hidden",
        width: isExpand ? 250 : 0,
        height: isExpand ? 180 : 0,
        minWidth: isExpand ? 250 : 0,
        pt: isExpand ? 1.5 : 0,
        pb: 0,
        transition: "width 1s,height 1s, min-width 1s",
      }}
      className="space-y-1 flex flex-col relative"
    >
      <Typography
        sx={{
          width: '100%',
          // height: isExpandStatus ? 220 : 93,
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '5px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#a8a8a8',
            borderRadius: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#eeeeee',
          },
        }}
        className="flex-grow px-2 py-1"
      >
        {isExpand && (
          <ClearIcon
            sx={{
              position: "absolute",
              right: 2,
              top: 2,
              color: "gray",
              cursor: "pointer",
              fontSize: 18,
            }}
            onClick={() => setIsExpand(false)}
          />
        )}
        {/* {isExpand || (
          <LaunchIcon
            sx={{
              color: "gray",
              rotate: "180deg",
              cursor: "pointer",
            }}
            onClick={() => setIsExpand(true)}
          />
        )} */}
        {isExpand && isDataToRun && (
          <Typography
            sx={{
              display: "flex",
              color: "#9b51e0",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "14px",
              fontWeight: 400,
              whiteSpace: "nowrap",
              mt: 1
            }}
          >
            <span>{dataToRunText}</span>
            <span>{dataToExtract}</span>
          </Typography>
        )}
        {isExpand && isSuccess && (
          <Typography
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "14px",
              fontWeight: 400,
              color: "green",
            }}
          >
            <span className="flex text-[green]">
              <img src="./Success.svg" alt="Success" className="w-4 mr-[1px]" />
              {successText}
            </span>
            <span>{successCount}</span>
          </Typography>
        )}
        {isExpand && isFaild && (
          <Typography
            sx={{
              // color: "#4f4a4a",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "14px",
              fontWeight: 400,
              color: "red",
            }}
          >
            <span className="flex text-[red]">
              <img src="./Failed.svg" alt="Success" className="w-3 mx-[2px]" />
              Failed
            </span>
            <span>{failedCount}</span>
          </Typography>
        )}
        {/* {isExpand && remainingTime != 0 && (
          <Typography
            sx={{
              paddingY: 0,
              color: "#9b51e0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            <span className="flex text-[red]">
              Time Left
            </span>
            <span>{remainingTime}</span>
          </Typography>
        )} */}
        {isExpand && seconds != 0 && (
          <Typography
            sx={{
              paddingY: 0,
              color: "#9b51e0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            <span className="flex text-[red]">
              {/* <img src="./Failed.svg" alt="Success" className="w-3 mx-[2px]" /> */}
              Time Spent
            </span>
            <span className="flex">
              {String(Math.floor(seconds / 3600)).padStart(2, "0")} :{" "}
              {String(Math.floor((seconds % 3600) / 60)).padStart(2, "0")} :{" "}
              {String(seconds % 60).padStart(2, "0")}
            </span>
          </Typography>
        )}
        {isExpand && (
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 500,
              textTransform: "capitalize",
              textAlign: "center",
            }}
          >
            {title}
          </Typography>
        )}
        {isExpand && (
          <Typography
            sx={{
              fontSize: 12,
              textTransform: "capitalize",
              textAlign: "center",
              pb: 0.5,
              overflow: 'auto'
            }}
          >
            <span>
              {details}
            </span>
          </Typography>
        )}
      </Typography>
      {/* <IconButton
        size="small"
        variant='outlined'
        onClick={() => setIsExpandStatus(prev => !prev)}
        sx={{ height: 16, width: '100%', borderRadius: 0, bgcolor: "#f5f5f5" }}>
        <KeyboardArrowDownIcon sx={{
          rotate: isExpandStatus ? '180deg' : '0deg'
        }} />
      </IconButton> */}
    </Paper>
  );
};

export default TimerSection;
