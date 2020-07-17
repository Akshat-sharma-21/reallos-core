import React, { Component } from "react";
import NavBar from "../shared/navbar/navbar";
// import Modal from "../shared/modal/Modal";
import NavRail from "../shared/navigation_rail/TransactionNavRail";
import { useLocation, useHistory } from "react-router-dom";
import {
  Container,
  Box,
  Grid,
  // Button,
  // ExpansionPanel,
  // ExpansionPanelSummary,
  // ExpansionPanelDetails,
  // Divider,
  // Typography,
} from "@material-ui/core";
import {
  PackageIcon,
  FileIcon,
  PersonIcon,
  CommentDiscussionIcon,
  ChecklistIcon,
  // TriangleDownIcon,
  // CheckIcon,
  // SearchIcon,
  // DotFillIcon,
  // EyeIcon,
  // ShieldIcon,
  // HomeIcon,
  // IssueClosedIcon,
  // SmileyIcon,
} from "@primer/octicons-react";
import "./transactionassist.css";

export default function TransactionAssist() {
  const routerLocation = useLocation();
  const transId = routerLocation.pathname.split("/")[2];
  const History = useHistory();

  return (
    <Box component="div">
      <Container>
        <NavBar />
        <NavRail />
        {/* {this.firstTimeModal()} */}
        <Box component="div" paddingTop={5} paddingBottom={1} paddingLeft={5}>
          <Grid container direction="row" justify="center" alignItems="center">
            <Grid item>
              <PackageIcon size={35} />
            </Grid>
            <Grid item xs={2}>
              <h2 className="transaction-heading">Transaction 1</h2>
            </Grid>
            <Grid item xs={9}></Grid>

            <Grid item xs={12}>
              <div className={"img-div"}>
                <img
                  src={require("../../assets/transaction-assist-coming-soon.png")}
                  alt={"Coming Soon"}
                  className={"coming-soon-img"}
                ></img>
              </div>
              <div className={"div-heading"}>Coming Soon</div>
              <div className={"div-text"}>This page is under construction</div>
            </Grid>
          </Grid>
        </Box>
        {/* {this.RenderExpansionPanel()} */}
      </Container>
    </Box>
  );
}

// class TransactionAssist extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       firstTime: true, //To check if the user is visting for the first time
//     };

//     this.firstTimeModal = this.firstTimeModal.bind(this);
//     this.closeFirstTime = this.closeFirstTime.bind(this);
//     this.RenderExpansionPanel = this.RenderExpansionPanel.bind(this);
//   }

//   closeFirstTime() {
//     // Make sure that the database is updated with this information
//     this.setState({
//       firstTime: false,
//     });
//   }

//   firstTimeModal() {
//     // To display the first time modal to people
//     return (
//       <Modal
//         visible={this.state.firstTime}
//         modalWidth={750}
//         modalHeight={500}
//         dismissCallback={this.closeFirstTime}
//       >
//         <Grid container direction="column" alignItems="center" justify="center">
//           <Grid item>
//             <img
//               src={require("../../assets/transaction-assist-first-time.png")}
//               alt={"First Time"}
//               className="first-time-image"
//             />
//           </Grid>
//           <Grid item>
//             <Box component="h1">Transaction assist</Box>
//           </Grid>
//           <Grid item>
//             <Box component="p" m={-2}>
//               Exactly know the progress of your transaction
//             </Box>
//           </Grid>
//           <Grid item>
//             <Button
//               variant="contained"
//               className="continue-button"
//               onClick={this.closeFirstTime}
//             >
//               continue
//             </Button>
//           </Grid>
//         </Grid>
//       </Modal>
//     );
//   }

//   RenderExpansionPanel() {
//     return (
//       <Grid container direction="column" spacing={2}>
//         <Grid item>
//           <ExpansionPanel>
//             <ExpansionPanelSummary expandIcon={<TriangleDownIcon />}>
//               <Grid container direction="row" alignItems="center" spacing={4}>
//                 <Grid item>
//                   <CheckIcon size={25} />
//                 </Grid>
//                 <Divider orientation="vertical" className="expansion-divider" />
//                 <Grid item>
//                   <Grid
//                     container
//                     direction="row"
//                     alignItems="center"
//                     spacing={3}
//                   >
//                     <Grid item>
//                       <SearchIcon size={25} />
//                     </Grid>
//                     <Grid item>
//                       <Typography className="expansion-panel-heading">
//                         Title Search and Insurance
//                       </Typography>
//                     </Grid>
//                   </Grid>
//                 </Grid>
//               </Grid>
//             </ExpansionPanelSummary>
//             <ExpansionPanelDetails>
//               <Grid container direction="column" justify="center">
//                 <Grid item>
//                   <h2>Title goes here</h2>
//                 </Grid>
//                 <Grid item>
//                   <Typography className="expansion-panel-text">
//                     Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
//                     varius auctor tincidunt. Vivamus vulputate ex libero, non
//                     pretium tortor eleifend non. Donec sagittis, neque eu
//                     malesuada euismod, elit nulla aliquet nibh, in laoreet eros
//                     diam quis lacus.
//                   </Typography>
//                   <Typography className="expansion-panel-text">
//                     Vivamus vulputate ex libero, non pretium tortor eleifend
//                     non. Donec sagittis, neque eu malesuada euismod, elit nulla
//                     aliquet nibh, in laoreet eros diam quis lacus.
//                   </Typography>
//                 </Grid>
//                 <Grid item>
//                   <Button variant="contained" className="action-button">
//                     Action
//                   </Button>
//                 </Grid>
//               </Grid>
//             </ExpansionPanelDetails>
//           </ExpansionPanel>
//         </Grid>

//         <Grid item>
//           <ExpansionPanel>
//             <ExpansionPanelSummary expandIcon={<TriangleDownIcon />}>
//               <Grid container direction="row" alignItems="center" spacing={4}>
//                 <Grid item>
//                   <DotFillIcon size={25} />
//                 </Grid>
//                 <Divider orientation="vertical" className="expansion-divider" />
//                 <Grid item>
//                   <Grid
//                     container
//                     direction="row"
//                     alignItems="center"
//                     spacing={3}
//                   >
//                     <Grid item>
//                       <HomeIcon size={25} />
//                     </Grid>
//                     <Grid item>
//                       <Typography className="expansion-panel-heading">
//                         Home Appraisal
//                       </Typography>
//                     </Grid>
//                   </Grid>
//                 </Grid>
//               </Grid>
//             </ExpansionPanelSummary>
//             <ExpansionPanelDetails>
//               <Grid container direction="column" justify="center">
//                 <Grid item>
//                   <h2>Title goes here</h2>
//                 </Grid>
//                 <Grid item>
//                   <Typography className="expansion-panel-text">
//                     Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
//                     varius auctor tincidunt. Vivamus vulputate ex libero, non
//                     pretium tortor eleifend non. Donec sagittis, neque eu
//                     malesuada euismod, elit nulla aliquet nibh, in laoreet eros
//                     diam quis lacus.
//                   </Typography>
//                   <Typography className="expansion-panel-text">
//                     Vivamus vulputate ex libero, non pretium tortor eleifend
//                     non. Donec sagittis, neque eu malesuada euismod, elit nulla
//                     aliquet nibh, in laoreet eros diam quis lacus.
//                   </Typography>
//                 </Grid>
//                 <Grid item>
//                   <Button variant="contained" className="action-button">
//                     Action
//                   </Button>
//                 </Grid>
//               </Grid>
//             </ExpansionPanelDetails>
//           </ExpansionPanel>
//         </Grid>

//         <Grid item>
//           <ExpansionPanel>
//             <ExpansionPanelSummary expandIcon={<TriangleDownIcon />}>
//               <Grid container direction="row" alignItems="center" spacing={4}>
//                 <Grid item>
//                   <DotFillIcon size={25} />
//                 </Grid>
//                 <Divider orientation="vertical" className="expansion-divider" />
//                 <Grid item>
//                   <Grid
//                     container
//                     direction="row"
//                     alignItems="center"
//                     spacing={3}
//                   >
//                     <Grid item>
//                       <EyeIcon size={25} />
//                     </Grid>
//                     <Grid item>
//                       <Typography className="expansion-panel-heading">
//                         Home Inspection
//                       </Typography>
//                     </Grid>
//                   </Grid>
//                 </Grid>
//               </Grid>
//             </ExpansionPanelSummary>
//             <ExpansionPanelDetails>
//               <Grid container direction="column" justify="center">
//                 <Grid item>
//                   <h2>Title goes here</h2>
//                 </Grid>
//                 <Grid item>
//                   <Typography className="expansion-panel-text">
//                     Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
//                     varius auctor tincidunt. Vivamus vulputate ex libero, non
//                     pretium tortor eleifend non. Donec sagittis, neque eu
//                     malesuada euismod, elit nulla aliquet nibh, in laoreet eros
//                     diam quis lacus.
//                   </Typography>
//                   <Typography className="expansion-panel-text">
//                     Vivamus vulputate ex libero, non pretium tortor eleifend
//                     non. Donec sagittis, neque eu malesuada euismod, elit nulla
//                     aliquet nibh, in laoreet eros diam quis lacus.
//                   </Typography>
//                 </Grid>
//                 <Grid item>
//                   <Button variant="contained" className="action-button">
//                     Action
//                   </Button>
//                 </Grid>
//               </Grid>
//             </ExpansionPanelDetails>
//           </ExpansionPanel>
//         </Grid>

//         <Grid item>
//           <ExpansionPanel>
//             <ExpansionPanelSummary expandIcon={<TriangleDownIcon />}>
//               <Grid container direction="row" alignItems="center" spacing={4}>
//                 <Grid item>
//                   <DotFillIcon size={25} />
//                 </Grid>
//                 <Divider orientation="vertical" className="expansion-divider" />
//                 <Grid item>
//                   <Grid
//                     container
//                     direction="row"
//                     alignItems="center"
//                     spacing={3}
//                   >
//                     <Grid item>
//                       <ShieldIcon size={25} />
//                     </Grid>
//                     <Grid item>
//                       <Typography className="expansion-panel-heading">
//                         Home Appraisal
//                       </Typography>
//                     </Grid>
//                   </Grid>
//                 </Grid>
//               </Grid>
//             </ExpansionPanelSummary>
//             <ExpansionPanelDetails>
//               <Grid container direction="column" justify="center">
//                 <Grid item>
//                   <h2>Title goes here</h2>
//                 </Grid>
//                 <Grid item>
//                   <Typography className="expansion-panel-text">
//                     Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
//                     varius auctor tincidunt. Vivamus vulputate ex libero, non
//                     pretium tortor eleifend non. Donec sagittis, neque eu
//                     malesuada euismod, elit nulla aliquet nibh, in laoreet eros
//                     diam quis lacus.
//                   </Typography>
//                   <Typography className="expansion-panel-text">
//                     Vivamus vulputate ex libero, non pretium tortor eleifend
//                     non. Donec sagittis, neque eu malesuada euismod, elit nulla
//                     aliquet nibh, in laoreet eros diam quis lacus.
//                   </Typography>
//                 </Grid>
//                 <Grid item>
//                   <Button variant="contained" className="action-button">
//                     Action
//                   </Button>
//                 </Grid>
//               </Grid>
//             </ExpansionPanelDetails>
//           </ExpansionPanel>
//         </Grid>

//         <Grid item>
//           <ExpansionPanel>
//             <ExpansionPanelSummary expandIcon={<TriangleDownIcon />}>
//               <Grid container direction="row" alignItems="center" spacing={4}>
//                 <Grid item>
//                   <DotFillIcon size={25} />
//                 </Grid>
//                 <Divider orientation="vertical" className="expansion-divider" />
//                 <Grid item>
//                   <Grid
//                     container
//                     direction="row"
//                     alignItems="center"
//                     spacing={3}
//                   >
//                     <Grid item>
//                       <IssueClosedIcon size={25} />
//                     </Grid>
//                     <Grid item>
//                       <Typography className="expansion-panel-heading">
//                         Pre-Closing
//                       </Typography>
//                     </Grid>
//                   </Grid>
//                 </Grid>
//               </Grid>
//             </ExpansionPanelSummary>
//             <ExpansionPanelDetails>
//               <Grid container direction="column" justify="center">
//                 <Grid item>
//                   <h2>Title goes here</h2>
//                 </Grid>
//                 <Grid item>
//                   <Typography className="expansion-panel-text">
//                     Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
//                     varius auctor tincidunt. Vivamus vulputate ex libero, non
//                     pretium tortor eleifend non. Donec sagittis, neque eu
//                     malesuada euismod, elit nulla aliquet nibh, in laoreet eros
//                     diam quis lacus.
//                   </Typography>
//                   <Typography className="expansion-panel-text">
//                     Vivamus vulputate ex libero, non pretium tortor eleifend
//                     non. Donec sagittis, neque eu malesuada euismod, elit nulla
//                     aliquet nibh, in laoreet eros diam quis lacus.
//                   </Typography>
//                 </Grid>
//                 <Grid item>
//                   <Button variant="contained" className="action-button">
//                     Action
//                   </Button>
//                 </Grid>
//               </Grid>
//             </ExpansionPanelDetails>
//           </ExpansionPanel>
//         </Grid>

//         <Grid item>
//           <ExpansionPanel>
//             <ExpansionPanelSummary expandIcon={<TriangleDownIcon />}>
//               <Grid container direction="row" alignItems="center" spacing={4}>
//                 <Grid item>
//                   <DotFillIcon size={25} />
//                 </Grid>
//                 <Divider orientation="vertical" className="expansion-divider" />
//                 <Grid item>
//                   <Grid
//                     container
//                     direction="row"
//                     alignItems="center"
//                     spacing={3}
//                   >
//                     <Grid item>
//                       <SmileyIcon size={25} />
//                     </Grid>
//                     <Grid item>
//                       <Typography className="expansion-panel-heading">
//                         Closing
//                       </Typography>
//                     </Grid>
//                   </Grid>
//                 </Grid>
//               </Grid>
//             </ExpansionPanelSummary>
//             <ExpansionPanelDetails>
//               <Grid container direction="column" justify="center">
//                 <Grid item>
//                   <h2>Title goes here</h2>
//                 </Grid>
//                 <Grid item>
//                   <Typography className="expansion-panel-text">
//                     Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
//                     varius auctor tincidunt. Vivamus vulputate ex libero, non
//                     pretium tortor eleifend non. Donec sagittis, neque eu
//                     malesuada euismod, elit nulla aliquet nibh, in laoreet eros
//                     diam quis lacus.
//                   </Typography>
//                   <Typography className="expansion-panel-text">
//                     Vivamus vulputate ex libero, non pretium tortor eleifend
//                     non. Donec sagittis, neque eu malesuada euismod, elit nulla
//                     aliquet nibh, in laoreet eros diam quis lacus.
//                   </Typography>
//                 </Grid>
//                 <Grid item>
//                   <Button variant="contained" className="action-button">
//                     Action
//                   </Button>
//                 </Grid>
//               </Grid>
//             </ExpansionPanelDetails>
//           </ExpansionPanel>
//         </Grid>
//       </Grid>
//     );
//   }

//   render() {
//     const History = useHistory();

//     return (
//       <Box component="div">
//         <Container>
//           <NavBar />
//           <NavRail />
//           {/* {this.firstTimeModal()} */}
//           <Box component="div" paddingTop={5} paddingBottom={1} paddingLeft={5}>
//             <Grid
//               container
//               direction="row"
//               justify="center"
//               alignItems="center"
//             >
//               <Grid item>
//                 <PackageIcon size={35} />
//               </Grid>
//               <Grid item xs={2}>
//                 <h2 className="transaction-heading">Transaction 1</h2>
//               </Grid>
//               <Grid item xs={9}></Grid>

//               <Grid item xs={12}>
//                 <div className={"img-div"}>
//                   <img
//                     src={require("../../assets/transaction-assist-coming-soon.png")}
//                     alt={"Coming Soon"}
//                     className={"coming-soon-img"}
//                   ></img>
//                 </div>
//                 <div className={"div-heading"}>Coming Soon</div>
//                 <div className={"div-text"}>
//                   This page is under construction
//                 </div>
//               </Grid>

//               <Grid item xs={3}>
//                 <Box className={"cards"} onClick={History.push("/paperwork")}>
//                   <div className={"card-content"}>
//                     <FileIcon size={50} />
//                     <div className={"card-text"}>Paperworks</div>
//                   </div>
//                 </Box>
//               </Grid>
//               <Grid item xs={3}>
//                 <Box className={"cards"}>
//                   <div className={"card-content"}>
//                     <PersonIcon size={50} />
//                     <div className={"card-text"}>People</div>
//                   </div>
//                 </Box>
//               </Grid>
//               <Grid item xs={3}>
//                 <Box className={"cards"}>
//                   <div className={"card-content"}>
//                     <ChecklistIcon size={50} />
//                     <div className={"card-text"}>Todo</div>
//                   </div>
//                 </Box>
//               </Grid>
//               <Grid item xs={3}>
//                 <Box className={"cards"}>
//                   <div className={"card-content"}>
//                     <CommentDiscussionIcon size={50} />
//                     <div className={"card-text"}>Discussion</div>
//                   </div>
//                 </Box>
//               </Grid>
//             </Grid>
//           </Box>
//           {/* {this.RenderExpansionPanel()} */}
//         </Container>
//       </Box>
//     );
//   }
// }

// export default TransactionAssist;
