
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  styled,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Container,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
} from '@mui/material';
import { ChevronLeft as ChevronLeftIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';

const drawerWidth: number = 0;

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

interface Task {
  name: string;
  location: string;
  month: number;
  date: number;
  hour: number;
  minute: number;
  amPm: string;
}

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const defaultTheme = createTheme();

const Dashboard: React.FC = () => {
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskLocation, setTaskLocation] = useState('');
  const [taskMonth, setTaskMonth] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [taskHour, setTaskHour] = useState('');
  const [taskMinute, setTaskMinute] = useState('');
  const [taskAmPm, setTaskAmPm] = useState('');
  const [tasks, setTasks] = useState<string[]>([]);
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

  const handleAddTask = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleFinishTask = () => {
    if (!taskName || !taskLocation || !taskMonth || !taskDate || !taskHour || !taskMinute || !taskAmPm) {
      alert('Please fill in all fields before adding the task.');
      return;
    }

    const newTask: Task = {
      name: taskName,
      location: taskLocation,
      month: parseInt(taskMonth),
      date: parseInt(taskDate),
      hour: parseInt(taskHour),
      minute: parseInt(taskMinute),
      amPm: taskAmPm,
    };

    const formattedTask = formatTask(newTask);

    const updatedTasks = [...tasks, formattedTask];

    setTasks(updatedTasks);
    setDialogOpen(false);
    resetTaskInputs();
    setCurrentTask(newTask);
    setDescriptionDialogOpen(true);
  };

  const getDateFromTask = (task: string) => {
    const datePart = task.match(/Date: (\d+)\/(\d+)/);
    if (!datePart) return new Date(0); // Return epoch date for invalid format
    const [, monthStr, dayStr] = datePart;
    const year = new Date().getFullYear(); // Assuming current year for simplicity
    const month = parseInt(monthStr);
    const day = parseInt(dayStr);
    return new Date(year, month - 1, day); // Date without time (time will be compared separately)
  };

  const getTimeFromTask = (task: string) => {
    const timePart = task.match(/Time: (\d+):(\d+) (\w{2})/);
    if (!timePart) return 0; // Return 0 for invalid format
    const [, hourStr, minuteStr, amPm] = timePart;
    let hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);
    if (amPm.toLowerCase() === 'pm' && hour !== 12) {
      hour += 12; // Convert PM hour to 24-hour format
    }
    return hour * 60 + minute; // Time in minutes (for easy comparison)
  };

  const formatTask = (task: Task) => {
    const { name, location, month, date, hour, minute, amPm } = task;
    const formattedMinute = minute < 10 ? `0${minute}` : `${minute}`;
    return `⭐ ${name} - Location: ${location} - Date: ${month}/${date} - Time: ${hour}:${formattedMinute} ${amPm}`;
  };

  const resetTaskInputs = () => {
    setTaskName('');
    setTaskLocation('');
    setTaskMonth('');
    setTaskDate('');
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
      setCurrentTask(parseTaskDetails(tasks[0])); // Set the first task as the current task
      setDescriptionDialogOpen(true);
    }
  };

  const handleCloseDescription = () => {
    setDescriptionDialogOpen(false);
  };

  const parseTaskDetails = (task: string): Task | null => {
    const regexResult = task.match(/⭐ (.+) - Location: (.+) - Date: (\d+)\/(\d+) - Time: (\d+):(\d+) (\w{2})/);
    if (regexResult) {
      const [, name, location, month, date, hour, minute, amPm] = regexResult;
      return {
        name,
        location,
        month: parseInt(month),
        date: parseInt(date),
        hour: parseInt(hour),
        minute: parseInt(minute),
        amPm,
      };
    }
    return null;
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar sx={{ pr: '24px' }}>
            <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
              Task List
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <Avatar>{username?.slice(0, 2)}</Avatar>
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
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
                  {username ? `Welcome, ${username}!` : 'Welcome!'}
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
                      <IconButton
                        color="error"
                        size="small"
                        aria-label="delete"
                        onClick={() => handleDeleteTask(index)}
                        sx={{
                          position: 'absolute',
                          top: '4px',
                          right: '4px',
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
            onClick={handleAddTask}
            sx={{
              position: 'fixed',
              right: open ? drawerWidth + 20 : 20,
              left: 100,
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
              right: open ? drawerWidth + 20 : 20,
              bottom: 20,
            }}
          >
            <Typography variant="body2">Upcoming Tasks</Typography>
          </IconButton>
          <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth maxWidth="md">
            <DialogTitle>Add Task</DialogTitle>
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
                      <MenuItem key={month} value={month}>
                        {month}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mr: 2 }}>
                  <InputLabel htmlFor="task-date">Day</InputLabel>
                  <Select
                    value={taskDate}
                    onChange={(e) => setTaskDate(e.target.value)}
                    inputProps={{
                      name: 'task-date',
                      id: 'task-date',
                    }}
                  >
                    {Array.from({ length: 31 }, (_, index) => index + 1).map((day) => (
                      <MenuItem key={day} value={day}>
                        {day}
                      </MenuItem>
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
                      <MenuItem key={hour} value={hour}>
                        {hour}
                      </MenuItem>
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
                      <MenuItem key={minute} value={minute}>
                        {minute}
                      </MenuItem>
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
              {currentTask && (
                <>
                  <Typography variant="body1" gutterBottom>
                    Task Name: {currentTask.name}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Location: {currentTask.location}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Date: {currentTask.month}/{currentTask.date}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Time: {currentTask.hour}:{currentTask.minute} {currentTask.amPm}
                  </Typography>
                </>
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
};

export default Dashboard;
