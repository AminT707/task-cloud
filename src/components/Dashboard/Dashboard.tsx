import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Task } from '../../constants/dtoTypes';

const lightTheme = createTheme();
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const Dashboard: React.FC = () => {
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskLocation, setTaskLocation] = useState('');
  const [taskMonth, setTaskMonth] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [taskYear, setTaskYear] = useState('');
  const [taskHour, setTaskHour] = useState('');
  const [taskMinute, setTaskMinute] = useState('');
  const [taskAmPm, setTaskAmPm] = useState('');
  const [tasks, setTasks] = useState<string[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [descriptionDialogOpen, setDescriptionDialogOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const { state } = location || {};
  const username = state && state.username;

  useEffect(() => {
    // Sort tasks whenever tasks array changes
    sortTasks();
  }, [tasks]);

  const sortTasks = () => {
    const sortedTasks = [...tasks].sort((taskA, taskB) => {
      const dateA = getDateFromTask(taskA);
      const dateB = getDateFromTask(taskB);

      if (dateA < dateB) {
        return -1; // dateA comes before dateB
      } else if (dateA > dateB) {
        return 1; // dateA comes after dateB
      } else {
        // Dates are the same, compare time and AM/PM
        const timeA = getTimeFromTask(taskA);
        const timeB = getTimeFromTask(taskB);

        if (timeA < timeB) {
          return -1; // timeA comes before timeB
        } else if (timeA > timeB) {
          return 1; // timeA comes after timeB
        } else {
          return 0; // tasks are identical in date and time
        }
      }
    });

    setTasks(sortedTasks);
  };

  const getDateFromTask = (task: string) => {
    const datePart = task.match(/Date: (\d+)\/(\d+)\/(\d+)/);
    if (!datePart) return new Date(0); //return epoch date for invalid format
    const [, monthStr, dayStr, yearStr] = datePart;
    const year = parseInt(yearStr); //use the selected year
    const month = parseInt(monthStr);
    const day = parseInt(dayStr);
    return new Date(year, month - 1, day); //date without time (time will be compared separately)
  };

  const getTimeFromTask = (task: string) => {
    const timePart = task.match(/Time: (\d+):(\d+) (\w{2})/);
    if (!timePart) return 0; //return 0 for invalid format
    const [, hourStr, minuteStr, amPm] = timePart;
    let hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);
    if (amPm.toLowerCase() === 'pm' && hour !== 12) {
      hour += 12; //convert PM hour to 24-hour format
    }
    return hour * 60 + minute; //time in minutes (for easy comparison)
  };

  const formatTask = (task: Task) => {
    const { name, location, month, date, year, hour, minute, amPm } = task;
    const formattedMinute = minute < 10 ? `0${minute}` : `${minute}`;
    return `⭐ ${name} - Location: ${location} - Date: ${month}/${date}/${year} - Time: ${hour}:${formattedMinute} ${amPm}`;
  };

  const resetTaskInputs = () => {
    setTaskName('');
    setTaskLocation('');
    setTaskMonth('');
    setTaskDate('');
    setTaskYear('');
    setTaskHour('');
    setTaskMinute('');
    setTaskAmPm('');
  };

  const handleDeleteTask = (indexToRemove: number) => {
    const updatedTasks = tasks.filter((_, index) => index !== indexToRemove);
    setTasks(updatedTasks);
  };

  const handleOpenDescription = () => {
    if (tasks.length > 0) {
      setCurrentTask(parseTaskDetails(tasks[0])); //set the first task as the current task
      setDescriptionDialogOpen(true);
    }
  };

  const handleCloseDescription = () => {
    setDescriptionDialogOpen(false);
  };

  const parseTaskDetails = (task: string): Task | null => {
  const regexResult = task.match(/⭐ (.+) - Location: (.+) - Date: (\d+)\/(\d+)\/(\d+) at (\d+):(\d+) (\w{2})/);
  if (regexResult) {
    const [, name, location, month, date, year, hour, minute, amPm] = regexResult;
    return {
      name,
      location,
      month: parseInt(month),
      date: parseInt(date),
      year: parseInt(year),
      hour: parseInt(hour),
      minute: parseInt(minute),
      amPm,
    };
  }
  return null;
};

  const handleAddTask = (taskIndex?: number) => {
    if (taskIndex !== undefined) {
      //extract the task details from the existing task string
      const calcTask = parseTaskDetails(tasks[taskIndex])
      
      //set the state variables for task inputs
      setTaskName(calcTask?.name ?? ""); //remove the star and space from the name
      console.log(calcTask)
      setTaskLocation(calcTask?.location ?? ""); 
      setTaskDate(calcTask?.date?.toString() ?? '');
      setTaskMonth(calcTask?.month?.toString() ?? '');
      setTaskYear(calcTask?.year?.toString() ?? '');
      setTaskHour(calcTask?.hour?.toString() ?? '');
      setTaskMinute(calcTask?.minute?.toString() ?? '');
      setTaskAmPm(calcTask?.amPm ?? "");
      setEditIndex(taskIndex);
    } else {
      // Clear the task inputs if adding a new task
      setTaskName('');
      setTaskLocation('');
      setTaskMonth('');
      setTaskDate('');
      setTaskYear('');
      setTaskHour('');
      setTaskMinute('');
      setTaskAmPm('');
      setEditIndex(null);
    }
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditIndex(null); //reset the edit index when the dialog is closed
  };

  const handleFinishTask = () => {
    if (!taskName || !taskLocation || !taskMonth || !taskDate || !taskYear || !taskHour || !taskMinute || !taskAmPm) {
      alert('One or more of the boxes above is missing an input! Please fill in the missing boxes.');
      return;
    }

    //check if the selected date is valid
    const selectedDate = new Date(parseInt(taskYear), parseInt(taskMonth) - 1, parseInt(taskDate));
    if (isNaN(selectedDate.getTime())) {
      alert('The selected date is not valid!');
      return;
    }

    //check if the selected date exists (e.g., February 30)
    if (selectedDate.getMonth() + 1 !== parseInt(taskMonth) || selectedDate.getDate() !== parseInt(taskDate)) {
      alert('The selected date does not exist!');
      return;
    }

    const newTask = `⭐ ${taskName} - Location: ${taskLocation} - Date: ${taskMonth}/${taskDate}/${taskYear} at ${taskHour}:${taskMinute} ${taskAmPm}`;
    if (editIndex !== null) {
      //update existing task if in edit mode
      const updatedTasks = tasks.map((task, index) => (index === editIndex ? newTask : task));
      setTasks(updatedTasks);
    } else {
      //add new task if not in edit mode
      setTasks([...tasks, newTask]);
    }

    setDialogOpen(false);
    //clear task inputs after adding/editing task
    setTaskName('');
    setTaskLocation('');
    setTaskMonth('');
    setTaskDate('');
    setTaskYear('');
    setTaskHour('');
    setTaskMinute('');
    setTaskAmPm('');
    setEditIndex(null);
  };

  return (
  <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <MuiAppBar position="absolute">
        <Toolbar
          sx={{
            pr: '24px',
            bgcolor: '#1976d2',
          }}
        >
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            Task Cloud Dashboard
          </Typography>
          {/* Dark Mode Toggle Button */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
            <Typography variant="body1" sx={{ mr: 1 }}>
              {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </Typography>
            <IconButton
              color="inherit"
              onClick={() => setDarkMode(!darkMode)}
              sx={{ mr: 1 }}
            >
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
        </Toolbar>
      </MuiAppBar>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h5" align="center" gutterBottom>
                {location.state && location.state.username ? `Welcome, ${location.state.username}!` : 'Welcome!'}
              </Typography>
              {tasks.length === 0 ? (
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="body1">
                    No current tasks. Click the 'Add Task' button to begin creating a task.
                  </Typography>
                </Paper>
              ) : (
                tasks.map((task, index) => (
                  <Paper
                    sx={{
                      p: 2,
                      mb: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative', //make the position relative
                    }}
                    key={index}
                  >
                    <Typography variant="body1">
                      {task.split(' - ').map((line, i) => (
                        <React.Fragment key={i}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))}
                    </Typography>
                    {/* Edit Button */}
                    <IconButton
                      color="primary"
                      aria-label="edit"
                      sx={{
                        position: 'absolute',
                        top: '4px',
                        right: '28px', 
                      }}
                      onClick={() => handleAddTask(index)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    {/* Delete Button */}
                    <IconButton
                      color="error"
                      aria-label="delete"
                      onClick={() => handleDeleteTask(index)}
                      sx={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px'
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Paper>
                ))
              )}
            </Grid>
          </Grid>
        </Container>
        <IconButton
          color="primary"
          aria-label="add task"
          onClick={() => handleAddTask()}
          sx={{
            position: 'fixed',
            left: 140,
          }}
        >
          <AddIcon />
          <Typography>Add Task</Typography>
        </IconButton>
        <IconButton
          color="primary"
          aria-label="open upcoming tasks"
          onClick={handleOpenDescription}
          sx={{
            position: 'fixed',
            right: 20,
            bottom: 20,
          }}
        >
          <Typography variant="body2">Upcoming Tasks</Typography>
        </IconButton>
        <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth maxWidth="md">
          <DialogTitle>{editIndex !== null ? 'Edit Task' : 'Add Task'}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="taskName"
              label="Task Name"
              type="text"
              fullWidth
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
            <TextField
              margin="dense"
              id="taskLocation"
              label="Task Location"
              type="text"
              fullWidth
              value={taskLocation}
              onChange={(e) => setTaskLocation(e.target.value)}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <FormControl fullWidth sx={{ mr: 2 }}>
                <InputLabel htmlFor="task-month">Month</InputLabel>
                <Select
                  value={taskMonth}
                  onChange={(e) => setTaskMonth(e.target.value)}
                  inputProps={{
                    name: 'task-month',
                    id: 'task-month',
                  }}
                >
                  {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
                    <MenuItem key={month} value={month}>{month}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mr: 2 }}>
                <InputLabel htmlFor="task-date">Date</InputLabel>
                <Select
                  value={taskDate}
                  onChange={(e) => setTaskDate(e.target.value)}
                  inputProps={{
                    name: 'task-date',
                    id: 'task-date',
                  }}
                >
                  {Array.from({ length: 31 }, (_, index) => index + 1).map((day) => (
                    <MenuItem key={day} value={day}>{day}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mr: 2 }}>
                <InputLabel htmlFor="task-year">Year</InputLabel>
                <Select
                value={taskYear}
                onChange={(e) => setTaskYear(e.target.value)}
                inputProps={{
                  name: 'task-year',
                  id: 'task-year',
                }}
              >
                {/* start from 2024 and include the next 20 years */}
                {Array.from({ length: 21 }, (_, index) => 2024 + index).map((year) => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
              </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <FormControl fullWidth sx={{ mr: 2 }}>
                <InputLabel htmlFor="task-hour">Hour</InputLabel>
                <Select
                  value={taskHour}
                  onChange={(e) => setTaskHour(e.target.value)}
                  inputProps={{
                    name: 'task-hour',
                    id: 'task-hour',
                  }}
                >
                  {Array.from({ length: 12 }, (_, index) => index + 1).map((hour) => (
                    <MenuItem key={hour} value={hour}>{hour}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mr: 2 }}>
                <InputLabel htmlFor="task-minute">Minute</InputLabel>
                <Select
                  value={taskMinute}
                  onChange={(e) => setTaskMinute(e.target.value)}
                  inputProps={{
                    name: 'task-minute',
                    id: 'task-minute',
                  }}
                >
                  {Array.from({ length: 60 }, (_, index) => index).map((minute) => (
                    <MenuItem key={minute} value={minute < 10 ? `0${minute}` : `${minute}`}>{minute < 10 ? `0${minute}` : `${minute}`}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel htmlFor="task-am-pm">AM/PM</InputLabel>
                <Select
                  value={taskAmPm}
                  onChange={(e) => setTaskAmPm(e.target.value)}
                  inputProps={{
                    name: 'task-am-pm',
                    id: 'task-am-pm',
                  }}
                >
                  <MenuItem value="am">AM</MenuItem>
                  <MenuItem value="pm">PM</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button onClick={handleFinishTask}>Finish</Button>
          </DialogActions>
        </Dialog>
        
        
        <Dialog open={descriptionDialogOpen} onClose={handleCloseDescription} fullWidth maxWidth="sm">
          <DialogTitle>Upcoming Task</DialogTitle>
          <DialogContent>
          {(tasks.map((task, index) => (
                  <Paper
                    sx={{
                      p: 2,
                      mb: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative', 
                    }}
                    key={index}
                  >
                    <Typography variant="body1">
                      {task.split(' - ').map((line, i) => (
                        <React.Fragment key={i}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))}
                    </Typography>
                    {/* Edit Button */}
                    <IconButton
                      color="primary"
                      aria-label="edit"
                      sx={{
                        position: 'absolute',
                        top: '4px',
                        right: '28px', 
                      }}
                      onClick={() => handleAddTask(index)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    {/* Delete Button */}
                    <IconButton
                      color="error"
                      aria-label="delete"
                      onClick={() => handleDeleteTask(index)}
                      sx={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px'
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Paper>
                ))
              )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDescription}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  </ThemeProvider>
);
}
export default Dashboard;