import React, { useEffect, useState } from "react";
import "./App.css";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MailIcon from "@material-ui/icons/Mail";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AccountCircleTwoToneIcon from "@material-ui/icons/AccountCircleTwoTone";
import { Button } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Chip from "@material-ui/core/Chip";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
  useHistory,
} from "react-router-dom";

firebase.initializeApp({
  apiKey: "AIzaSyC7whNorGCxX12SYfJgo1zaa7wT1seqW1U",
  authDomain: "moje-to-do.firebaseapp.com",
  databaseURL: "https://moje-to-do.firebaseio.com",
  projectId: "moje-to-do",
  storageBucket: "moje-to-do.appspot.com",
  messagingSenderId: "554111085531",
  appId: "1:554111085531:web:d9d18446ffe4fc137fd5fe",
  measurementId: "G-F9KC0XB4RN",
});
const auth = firebase.auth();
const firestore = firebase.firestore();

const drawerWidth = 180;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  todoinputdiv: {
    position: "fixed",
    bottom: "0",
    right: "0",
    left: "0",
    display: "block",
    fontSize: "1.5rem",
    margin: "8px",
    [theme.breakpoints.up("sm")]: {
      left: drawerWidth,
    },
  },
  todoinputform: {
    padding: "0 10px 10px 10px",
    width: "100%",
    justifyContent: "space-between",
    display: "flex",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function App() {
  const [user] = useAuthState(auth);

  const singInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    <Router>
      <div className="app">
        {user ? <TodoContainer user={user} /> : <Login>login</Login>}
      </div>
    </Router>
  );
}

function Login() {
  const singInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };
  return (
    <div>
      <h1>login</h1>
      <button onClick={singInWithGoogle}>login</button>
    </div>
  );
}

function TodoContainer(props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [todos, setTodos] = useState([]);
  const [preTodoFolders, setPreTodoFolders] = useState([]);
  const [todoFolders, setTodoFolders] = useState([]);
  const [input, setInput] = useState("");
  const [folder, setFolder] = useState("Tasks");
  const [newFolderDialog, setNewFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const history = useHistory();

  const handleClickOpen = () => {
    setNewFolderDialog(true);
  };

  const handleClose = () => {
    setNewFolderDialog(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const createNewFolder = (event) => {
    firestore
      .collection("users")
      .doc(auth.currentUser.uid)
      .collection("Todo")
      .doc()
      .set({
        text: "That's '" + newFolderName + "' folder you've created!",
        completed: false,
        folder: newFolderName,
        date: firebase.firestore.FieldValue.serverTimestamp(),
      });
    handleClose();
    history.push(`/${newFolderName}`);
    event.preventDefault();
  };

  const singInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  useEffect(() => {
    firestore
      .collection("users")
      .doc(auth.currentUser.uid)
      .collection("Todo")
      .orderBy("date", "desc")
      .onSnapshot((snapshot) => {
        console.log("cyk");
        setTodos(
          snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          })
        );
      });
  }, []);

  useEffect(() => {
    console.log(todos);
    setPreTodoFolders(
      todos.map((item) => {
        const folder = item.folder;
        return folder;
      })
    );
  }, [todos]);

  useEffect(() => {
    setTodoFolders([...new Set(preTodoFolders)]);
  }, [preTodoFolders]);

  useEffect(() => {
    console.log(todoFolders);
  }, [todoFolders]);

  const Save = (event) => {
    firestore
      .collection("users")
      .doc(auth.currentUser.uid)
      .collection("Todo")
      .doc()
      .set({
        text: input,
        completed: false,
        folder: folder,
        date: firebase.firestore.FieldValue.serverTimestamp(),
      });
    setInput("");
    event.preventDefault();
  };

  const Complete = (id) => {
    console.log("completed");
    firestore
      .collection("users")
      .doc(auth.currentUser.uid)
      .collection("Todo")
      .doc(id)
      .update({
        completed: true,
        completeDate: firebase.firestore.FieldValue.serverTimestamp(),
      });
  };
  const UnComplete = (id) => {
    console.log("uncompleted");
    firestore
      .collection("users")
      .doc(auth.currentUser.uid)
      .collection("Todo")
      .doc(id)
      .update({
        completed: false,
        completeDate: null,
      });
  };

  const Delete = (id) => {
    firestore
      .collection("users")
      .doc(auth.currentUser.uid)
      .collection("Todo")
      .doc(id)
      .delete();
  };

  const drawer = (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <div className={classes.toolbar} />
        <Divider />
        <ListItem component={Link} to={"/"} button>
          <ListItemIcon></ListItemIcon>
          <ListItemText primary="All" />
        </ListItem>

        <Divider />
        {todoFolders.map((item) => (
          // <Link to={`/${item}`}>
          <ListItem component={Link} to={`/${item}`} button key={item}>
            <ListItemIcon></ListItemIcon>
            <ListItemText primary={item} />
          </ListItem>
          // </Link>
        ))}
      </div>
      <Button
        variant="outlined"
        style={{ margin: "16px" }}
        onClick={() => handleClickOpen()}
      >
        +
      </Button>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar
          style={{
            justifyContent: "space-between",
            padding: "0 8px",
            margin: "0",
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            // edge="start"
            style={{ margin: "0" }}
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            to-do
          </Typography>
          <IconButton
            onClick={() => {
              if (props.user) {
                auth.signOut();
              } else {
                singInWithGoogle();
              }
            }}
            color="inherit"
          >
            {props.user ? (
              <Avatar
                style={{ width: "24px", height: "24px" }}
                src={auth.currentUser && auth.currentUser.photoURL}
              />
            ) : (
              <AccountCircleTwoToneIcon />
            )}
          </IconButton>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main style={{ width: "100%" }}>
        <div className={classes.toolbar} />

        <Todo
          setFolder={setFolder}
          todos={todos}
          handleDelete={Delete}
          handleComplete={Complete}
          handleUnComplete={UnComplete}
        ></Todo>
      </main>
      <Paper variant="outlined" className={classes.todoinputdiv}>
        <div
          style={{
            display: "flex",
          }}
        >
          <Chip
            style={{ margin: "8px" }}
            variant="outlined"
            label="All"
            color="secondary"
            disabled
          />
          <Chip
            style={{ margin: "8px" }}
            variant="outlined"
            label="+"
            onClick={() => handleClickOpen()}
          />
          <Divider
            orientation="vertical"
            flexItem
            style={{ margin: "6px 0" }}
          ></Divider>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              // padding: "8px 8px 0 8px",
              overflowX: "auto",
            }}
          >
            {todoFolders.map((item) => (
              <Chip
                style={{ margin: "8px" }}
                color={folder === item ? "secondary" : "default"}
                variant="outlined"
                key={item}
                label={item}
                onClick={() => setFolder(item)}
              ></Chip>
            ))}
          </div>
        </div>
        <form className={classes.todoinputform} onSubmit={Save}>
          <Checkbox disabled></Checkbox>
          <TextField
            fullWidth
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          ></TextField>
          <Button
            style={{ margin: "0 9px" }}
            variant="outlined"
            color="primary"
            type="submit"
            disabled={!input}
          >
            Add
          </Button>
        </form>
      </Paper>
      <Dialog
        open={newFolderDialog}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <form onSubmit={createNewFolder}>
          <DialogTitle id="form-dialog-title">A new Folder</DialogTitle>
          <DialogContent>
            <DialogContentText>
              You are about to create a new Folder. If you delete all items from
              any folder it will be auto-removed. Type Folder's name and click
              "Create".
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Name of the Folder"
              type="text"
              fullWidth
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button variant="text" onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button
              variant="outlined"
              disabled={!newFolderName}
              type="submit"
              color="primary"
            >
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

function Todo(props) {
  const curPath = useLocation().pathname.slice(1);

  useEffect(() => {
    console.log(curPath ? true : false);
    curPath ? props.setFolder(curPath) : props.setFolder("Tasks");
  }, [curPath]);

  const allNotCompleted = props.todos
    .filter((item) => item.completed === false)
    .map((filteredItem) => (
      <ListToDo
        key={filteredItem.id}
        text={filteredItem.text}
        completed={filteredItem.completed}
        handleDelete={() => props.handleDelete(filteredItem.id)}
        handleComplete={() => {
          filteredItem.completed
            ? props.handleUnComplete(filteredItem.id)
            : props.handleComplete(filteredItem.id);
        }}
      />
    ));

  const notCompleted = props.todos
    .filter((item) => item.completed === false && item.folder === curPath)
    .map((filteredItem) => (
      <ListToDo
        key={filteredItem.id}
        text={filteredItem.text}
        completed={filteredItem.completed}
        handleDelete={() => props.handleDelete(filteredItem.id)}
        handleComplete={() => {
          filteredItem.completed
            ? props.handleUnComplete(filteredItem.id)
            : props.handleComplete(filteredItem.id);
        }}
      />
    ));

  const allCompleted = props.todos
    .filter((item) => item.completed === true)
    .sort((a, b) => (a.completeDate < b.completeDate ? 1 : -1))
    .map((filteredItem) => (
      <ListToDo
        key={filteredItem.id}
        text={filteredItem.text}
        completed={filteredItem.completed}
        handleDelete={() => props.handleDelete(filteredItem.id)}
        handleComplete={() => {
          filteredItem.completed
            ? props.handleUnComplete(filteredItem.id)
            : props.handleComplete(filteredItem.id);
        }}
      />
    ));

  const completed = props.todos
    .filter((item) => item.completed === true && item.folder === curPath)
    .sort((a, b) => (a.completeDate < b.completeDate ? 1 : -1))
    .map((filteredItem) => (
      <ListToDo
        key={filteredItem.id}
        text={filteredItem.text}
        completed={filteredItem.completed}
        handleDelete={() => props.handleDelete(filteredItem.id)}
        handleComplete={() => {
          filteredItem.completed
            ? props.handleUnComplete(filteredItem.id)
            : props.handleComplete(filteredItem.id);
        }}
      />
    ));

  return (
    <div>
      {curPath ? notCompleted : allNotCompleted}

      <Divider style={{ margin: "0 0 0 16px" }} />

      <Typography
        style={{ margin: "0 24px" }}
        color="textSecondary"
        display="block"
        variant="caption"
      >
        completed
      </Typography>
      {curPath ? completed : allCompleted}
      <div style={{ height: "128px" }}></div>
    </div>
  );
}

function ListToDo(props) {
  return (
    <Paper className="ListItem-card" variant="outlined">
      <Checkbox
        onClick={props.handleComplete}
        checked={props.completed}
      ></Checkbox>
      <p>{props.text}</p>
      <Button variant="outlined" color="primary" onClick={props.handleDelete}>
        delete
      </Button>
    </Paper>
  );
}

export default App;
