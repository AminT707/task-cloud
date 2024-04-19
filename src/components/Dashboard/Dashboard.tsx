import React, { useState } from 'react';
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
//import MenuIcon from '@mui/icons-material/Menu';
//import NotificationsIcon from '@mui/icons-material/Notifications';
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

const lightTheme = createTheme();
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function Dashboard() {
  const location = useLocation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskLocation, setTaskLocation] = useState('');
  const [taskMonth, setTaskMonth] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [taskHour, setTaskHour] = useState('');
  const [taskMinute, setTaskMinute] = useState('');
  const [taskAmPm, setTaskAmPm] = useState('');
  const [tasks, setTasks] = useState<string[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  const handleDeleteTask = (indexToRemove: number) => {
    const updatedTasks = tasks.filter((_, index) => index !== indexToRemove);
    setTasks(updatedTasks);
  };

  const handleAddTask = (taskIndex?: number) => {
    if (taskIndex !== undefined) {
      // Extract the task details from the existing task string
      const [name, location, month, date, hour, minute, amPm] = tasks[taskIndex].split(/ - |:|\/|\s/);
      // Set the state variables for task inputs
      setTaskName(name.slice(2)); // Remove the star and space from the name
      setTaskLocation(location.split(': ')[1]); // Extract the location from the string
      setTaskMonth(month);
      setTaskDate(date);
      setTaskHour(hour);
      setTaskMinute(minute);
      setTaskAmPm(amPm);
      setEditIndex(taskIndex);
    } else {
      // Clear the task inputs if adding a new task
      setTaskName('');
      setTaskLocation('');
      setTaskMonth('');
      setTaskDate('');
      setTaskHour('');
      setTaskMinute('');
      setTaskAmPm('');
      setEditIndex(null);
    }
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditIndex(null); // Reset the edit index when the dialog is closed
  };

  const handleFinishTask = () => {
    if (!taskName || !taskLocation || !taskMonth || !taskDate || !taskHour || !taskMinute || !taskAmPm) {
      alert('One or more of the boxes above is missing an input! Please fill in the missing boxes.');
      return;
    }

    const newTask = `⭐ ${taskName} - Location: ${taskLocation} - Date: ${taskMonth}/${taskDate} at ${taskHour}:${taskMinute} ${taskAmPm}`;
    if (editIndex !== null) {
      // Update existing task if in edit mode
      const updatedTasks = tasks.map((task, index) => (index === editIndex ? newTask : task));
      setTasks(updatedTasks);
    } else {
      // Add new task if not in edit mode
      setTasks([...tasks, newTask]);
    }

    

    setDialogOpen(false);
    // Clear task inputs after adding/editing task
    setTaskName('');
    setTaskLocation('');
    setTaskMonth('');
    setTaskDate('');
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
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
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
                  <Paper
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
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
                        position: 'relative', // Add this line to make the position relative
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
                          right: '28px', // Adjust the position to make it appear next to the delete button
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
        </Box>
      </Box>
    </ThemeProvider>
  );
}