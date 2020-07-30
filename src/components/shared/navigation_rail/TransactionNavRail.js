import React from "react";
import { useLocation } from "react-router-dom";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import "./TransactionNavRail.css";
import { useHistory } from "react-router-dom";

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
  HomeIcon,
} from "@primer/octicons-react";

const navRailWidth = 300;

const listItemTextProperties = {
  color: "#150578",
  marginLeft: 12,
  fontSize: 16,
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: navRailWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: navRailWidth,
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
    width: theme.spacing(9) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbarToggleOption: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1.5),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  listItemText: {
    ...listItemTextProperties,
  },
  listItemTextActive: {
    fontWeight: "bold",
    ...listItemTextProperties,
  },
}));

export default function NavRail() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const routerLocation = useLocation();
  const transId = routerLocation.pathname.split("/")[2]; // getting the id from the pathname
  let listItems = [
    {
      icon: <HomeIcon size={24} />,
      label: "Transaction Dashboard",
      isActiveRoute: null,
      linkTo: "/transaction",
    },
    {
      icon: <PackageIcon size={24} />,
      label: "Transaction Assist",
      isActiveRoute: routerLocation.pathname.includes("assist"),
      linkTo: "/transaction/" + transId + "/assist",
    },
    {
      icon: <FileIcon size={24} />,
      label: "Paperwork",
      isActiveRoute: routerLocation.pathname.includes("/paperwork"),
      linkTo: "/transaction/" + transId + "/paperwork",
    },
    {
      icon: <PersonIcon size={24} />,
      label: "People",
      isActiveRoute: routerLocation.pathname.includes("/people"),
      linkTo: "/transaction/" + transId + "/people",
    },
    {
      icon: <ChecklistIcon size={24} />,
      label: "Todo",
      isActiveRoute: routerLocation.pathname.includes("/todo"),
      linkTo: "/transaction/" + transId + "/todo",
    },
    {
      icon: <CommentDiscussionIcon size={24} />,
      label: "Discussions",
      isActiveRoute: routerLocation.pathname.includes("/discussions"),
      linkTo: "/transaction/" + transId + "/discussions",
    },
  ];

  /**
   * Builds a list item for navigation rail.
   *
   * @param {object} navRailItem
   * Object containing properties for building a
   * navigation rail list item.
   *
   * @param {JSX.Element} navRailItem.icon
   * A JSX element which has to be displayed as
   * an icon on the navigation rail
   *
   * @param {string} navRailItem.label
   * Label for the list item.
   *
   * @param {boolean} navRailItem.isActiveRoute
   * Applies a styling to the list item show
   * if a route is active.
   *
   * @param {string} navRailItem.linkTo
   * The URL to direct the user when the list item
   * is clicked.
   */

  const History = useHistory();
  const renderNavRailListItem = (navRailItem) => {
    const { icon, label, isActiveRoute, linkTo } = navRailItem;
    return (
      <ListItem
        button
        style={{ marginTop: 15, paddingLeft: 6 }}
        component="a"
        key={label}
        onClick={() => History.push(linkTo)}
      >
        <ListItemIcon className={isActiveRoute ? "nav-rail-icon-active" : ""}>
          <div className="nav-rail-indicator-container">
            <div
              className={
                isActiveRoute
                  ? "nav-rail-indicator-active"
                  : "nav-rail-indicator-inactive"
              }
            />
          </div>
          {icon}
        </ListItemIcon>
        <ListItemText
          primary={label}
          classes={{
            primary: isActiveRoute
              ? classes.listItemTextActive
              : classes.listItemText,
          }}
        />
      </ListItem>
    );
  };

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
        <div className={classes.toolbarToggleOption}>
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
          {listItems.map((listItemData) => renderNavRailListItem(listItemData))}
        </List>
      </Drawer>
    </div>
  );
}
