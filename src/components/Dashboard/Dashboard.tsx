import React from 'react';
import { useLocation } from 'react-router-dom';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
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
import DeleteIcon from '@mui/icons-material/Delete';
import Avatar from '@mui/material/Avatar'; 


import { mainListItems, secondaryListItems } from './modules/ListItems';

const drawerWidth: number = 240;

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

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const defaultTheme = createTheme();

export default function Dashboard() {
  const location = useLocation();
  const [open, setOpen] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [taskName, setTaskName] = React.useState('');
  const [taskLocation, setTaskLocation] = React.useState('');
  const [taskMonth, setTaskMonth] = React.useState('');
  const [taskDate, setTaskDate] = React.useState('');
  const [taskHour, setTaskHour] = React.useState('');
  const [taskMinute, setTaskMinute] = React.useState('');
  const [taskAmPm, setTaskAmPm] = React.useState('');
  const [tasks, setTasks] = React.useState<string[]>([]);
  const { state } = location || {};
  const username = state && state.username;

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleAddTask = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };


  const handleFinishTask = () => {
    if (!taskName || !taskLocation || !taskMonth || !taskDate || !taskHour || !taskMinute || !taskAmPm) {
      alert('One or more of the boxes above is missing an input! Please fill in the missing boxes.');
      return;
    }

    const newTask = `⭐ ${taskName} - Location: ${taskLocation} - Date: ${taskMonth}/${taskDate} at ${taskHour}:${taskMinute} ${taskAmPm}`;
    setTasks([...tasks, newTask]);

    setDialogOpen(false);
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

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Task List
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">

                <Avatar>{username.slice(0,2)}</Avatar>
              </Badge>
            </IconButton>

          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems}
            <Divider sx={{ my: 1 }} />
            {secondaryListItems}
          </List>
        </Drawer>
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
                  {username ? `Welcome, ${username}!` : 'Welcome!'}
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
                        mb: 2, // Add margin bottom to create space between tasks
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
                      {/*Delete Button*/}
                      <IconButton
                      color = "error"
                      size = "small"
                      aria-label = "delete"
                      onClick = {() => handleDeleteTask(index)}
                      sx = {{
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
              {/* Task Date Select */}
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
{/* Task Time Select */}
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
        <MenuItem key={minute} value={minute}>{minute}</MenuItem>
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