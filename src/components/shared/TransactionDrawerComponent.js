import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import {
  Drawer,
  List,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";

import {
  ThreeBarsIcon,
  ChevronLeftIcon,
  PackageIcon,
  FileIcon,
  PersonIcon,
  ChecklistIcon,
  CommentDiscussionIcon,
} from "@primer/octicons-react";

const drawerWidth = 260;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(7) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 0.5),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
}));

export default function MiniDrawer() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <Drawer
        onMouseEnter={handleDrawerOpen}
        onMouseLeave={handleDrawerClose}
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton
            onClick={handleDrawerOpen}
            className={clsx({
              [classes.hide]: open,
            })}
          >
            <ThreeBarsIcon size={24} />
          </IconButton>
          <IconButton
            onClick={handleDrawerClose}
            className={clsx({
              [classes.hide]: !open,
            })}
          >
            <ChevronLeftIcon size={24} />
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button key={"text"}>
            <ListItemIcon>
              <PackageIcon size={24} />
            </ListItemIcon>
            <ListItemText primary={"Transaction Assistant"} />
          </ListItem>
        </List>
        <List>
          <ListItem button key={"text"}>
            <ListItemIcon>
              <FileIcon size={24} />
            </ListItemIcon>
            <ListItemText primary={"Paperworks"} />
          </ListItem>
        </List>
        <List>
          <ListItem button key={"text"}>
            <ListItemIcon>
              <PersonIcon size={24} />
            </ListItemIcon>
            <ListItemText primary={"Paperworks"} />
          </ListItem>
        </List>
        <List>
          <ListItem button key={"text"}>
            <ListItemIcon>
              <ChecklistIcon size={24} />
            </ListItemIcon>
            <ListItemText primary={"Todo"} />
          </ListItem>
        </List>
        <List>
          <ListItem button key={"text"}>
            <ListItemIcon>
              <CommentDiscussionIcon size={24} />
            </ListItemIcon>
            <ListItemText primary={"Chat"} />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
}
