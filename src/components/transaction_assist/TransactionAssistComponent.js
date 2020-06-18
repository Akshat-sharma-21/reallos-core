import React, {Component} from 'react';
import NavBar from '../shared/navbar/navbar';
import Modal from '../shared/modal/Modal';
import {
    Container,
    Box, 
    Grid,
    Button,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails, 
    Divider,
    Typography
} from '@material-ui/core';
import {
    TriangleDownIcon,
    CheckIcon,
    SearchIcon,
    DotFillIcon,
    ArchiveIcon,
    EyeIcon,
    ShieldIcon,
    HomeIcon,
    IssueClosedIcon,
    SmileyIcon
} from '@primer/octicons-react';
import './transactionassist.css';
class TransactionAssist extends Component{
    constructor(props){
        super(props);

        this.state = {
            firstTime: true //To check if the user is visting for the first time 
        }

        this.firstTimeModal = this.firstTimeModal.bind(this);
        this.closeFirstTime = this.closeFirstTime.bind(this);
        this.RenderExpansionPanel = this.RenderExpansionPanel.bind(this);
    }

    closeFirstTime(){
        // Make sure that the database is updated with this information
        this.setState({
            firstTime: false
        });
    }

    firstTimeModal(){ // To display the first time modal to people
        return(
            <Modal visible={this.state.firstTime} modalWidth={750} modalHeight={500} dismissCallback={this.closeFirstTime}>
                <Grid container direction="column" alignItems="center" justify="center">
                    <Grid item>
                        <img src={require('../../assets/transaction-assist-first-time.png')} className="first-time-image"/>
                    </Grid>
                    <Grid item>
                        <Box component="h1">Trasaction assist</Box>
                    </Grid>
                    <Grid item>
                        <Box  component="p" m={-2}>Exactly know the progress of your transaction</Box>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" className="continue-button" onClick={this.closeFirstTime}>continue</Button>
                    </Grid>
                </Grid>
            </Modal>
        );
    }

    RenderExpansionPanel(){
        return(
            <Grid container direction="column" spacing={2}>
                <Grid item>
                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<TriangleDownIcon />} > 
                            <Grid container direction="row" alignItems="center" spacing={4}>
                                <Grid item>
                                    <CheckIcon size={25}/> 
                                </Grid>
                                <Divider orientation="vertical" className="expansion-divider"/>
                                <Grid item>
                                    <Grid container direction="row" alignItems="center" spacing={3}>
                                        <Grid item>
                                            <SearchIcon size={25}/>
                                        </Grid>
                                        <Grid item>
                                            <Typography className="expansion-panel-heading">Title Search and Insurance</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Grid container direction="column" justify="center">
                                <Grid item>
                                    <h2>
                                        Title goes here
                                    </h2>
                                </Grid>
                                <Grid item>
                                    <Typography className="expansion-panel-text">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut varius auctor tincidunt. 
                                    Vivamus vulputate ex libero, non pretium tortor eleifend non. Donec sagittis, neque eu malesuada euismod, elit nulla aliquet nibh, in laoreet eros diam quis lacus.
                                    </Typography>
                                    <Typography className="expansion-panel-text">
                                    Vivamus vulputate ex libero, non pretium tortor eleifend non. Donec sagittis, neque eu malesuada euismod, elit nulla aliquet nibh, in laoreet eros diam quis lacus.
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Button variant="contained" className="action-button">Action</Button>
                                </Grid>
                            </Grid>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                </Grid>
    
                <Grid item>
                    <ExpansionPanel>
                            <ExpansionPanelSummary expandIcon={<TriangleDownIcon />} > 
                                <Grid container direction="row" alignItems="center" spacing={4}>
                                    <Grid item>
                                        <DotFillIcon size={25} /> 
                                    </Grid>
                                    <Divider orientation="vertical" className="expansion-divider"/>
                                    <Grid item>
                                        <Grid container direction="row" alignItems="center" spacing={3}>
                                            <Grid item>
                                                <HomeIcon size={25} />
                                            </Grid>
                                            <Grid item>
                                                <Typography className="expansion-panel-heading">Home Appraisal</Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <Grid container direction="column" justify="center">
                                    <Grid item>
                                        <h2>
                                            Title goes here
                                        </h2>
                                    </Grid>
                                    <Grid item>
                                        <Typography className="expansion-panel-text">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut varius auctor tincidunt. 
                                        Vivamus vulputate ex libero, non pretium tortor eleifend non. Donec sagittis, neque eu malesuada euismod, elit nulla aliquet nibh, in laoreet eros diam quis lacus.
                                        </Typography>
                                        <Typography className="expansion-panel-text">
                                        Vivamus vulputate ex libero, non pretium tortor eleifend non. Donec sagittis, neque eu malesuada euismod, elit nulla aliquet nibh, in laoreet eros diam quis lacus.
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Button variant="contained" className="action-button">Action</Button>
                                    </Grid>
                                </Grid>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                </Grid>

                <Grid item>
                    <ExpansionPanel>
                            <ExpansionPanelSummary expandIcon={<TriangleDownIcon />} > 
                                <Grid container direction="row" alignItems="center" spacing={4}>
                                    <Grid item>
                                        <DotFillIcon size={25}/> 
                                    </Grid>
                                    <Divider orientation="vertical" className="expansion-divider"/>
                                    <Grid item>
                                        <Grid container direction="row" alignItems="center" spacing={3}>
                                            <Grid item>
                                                <EyeIcon size={25}/>
                                            </Grid>
                                            <Grid item>
                                                <Typography className="expansion-panel-heading">Home Inspection</Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <Grid container direction="column" justify="center">
                                    <Grid item>
                                        <h2>
                                            Title goes here
                                        </h2>
                                    </Grid>
                                    <Grid item>
                                        <Typography className="expansion-panel-text">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut varius auctor tincidunt. 
                                        Vivamus vulputate ex libero, non pretium tortor eleifend non. Donec sagittis, neque eu malesuada euismod, elit nulla aliquet nibh, in laoreet eros diam quis lacus.
                                        </Typography>
                                        <Typography className="expansion-panel-text">
                                        Vivamus vulputate ex libero, non pretium tortor eleifend non. Donec sagittis, neque eu malesuada euismod, elit nulla aliquet nibh, in laoreet eros diam quis lacus.
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Button variant="contained" className="action-button">Action</Button>
                                    </Grid>
                                </Grid>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                </Grid>

                <Grid item>
                    <ExpansionPanel>
                            <ExpansionPanelSummary expandIcon={<TriangleDownIcon />} > 
                                <Grid container direction="row" alignItems="center" spacing={4}>
                                    <Grid item>
                                        <DotFillIcon size={25}/> 
                                    </Grid>
                                    <Divider orientation="vertical" className="expansion-divider"/>
                                    <Grid item>
                                        <Grid container direction="row" alignItems="center" spacing={3}>
                                            <Grid item>
                                                <ShieldIcon size={25}/>
                                            </Grid>
                                            <Grid item>
                                                <Typography className="expansion-panel-heading">Home Appraisal</Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <Grid container direction="column" justify="center">
                                    <Grid item>
                                        <h2>
                                            Title goes here
                                        </h2>
                                    </Grid>
                                    <Grid item>
                                        <Typography className="expansion-panel-text">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut varius auctor tincidunt. 
                                        Vivamus vulputate ex libero, non pretium tortor eleifend non. Donec sagittis, neque eu malesuada euismod, elit nulla aliquet nibh, in laoreet eros diam quis lacus.
                                        </Typography>
                                        <Typography className="expansion-panel-text">
                                        Vivamus vulputate ex libero, non pretium tortor eleifend non. Donec sagittis, neque eu malesuada euismod, elit nulla aliquet nibh, in laoreet eros diam quis lacus.
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Button variant="contained" className="action-button">Action</Button>
                                    </Grid>
                                </Grid>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                </Grid>

                <Grid item>
                    <ExpansionPanel>
                            <ExpansionPanelSummary expandIcon={<TriangleDownIcon />} > 
                                <Grid container direction="row" alignItems="center" spacing={4}>
                                    <Grid item>
                                        <DotFillIcon size={25}/> 
                                    </Grid>
                                    <Divider orientation="vertical" className="expansion-divider"/>
                                    <Grid item>
                                        <Grid container direction="row" alignItems="center" spacing={3}>
                                            <Grid item>
                                                <IssueClosedIcon size={25}/>
                                            </Grid>
                                            <Grid item>
                                                <Typography className="expansion-panel-heading">Pre-Closing</Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <Grid container direction="column" justify="center">
                                    <Grid item>
                                        <h2>
                                            Title goes here
                                        </h2>
                                    </Grid>
                                    <Grid item>
                                        <Typography className="expansion-panel-text">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut varius auctor tincidunt. 
                                        Vivamus vulputate ex libero, non pretium tortor eleifend non. Donec sagittis, neque eu malesuada euismod, elit nulla aliquet nibh, in laoreet eros diam quis lacus.
                                        </Typography>
                                        <Typography className="expansion-panel-text">
                                        Vivamus vulputate ex libero, non pretium tortor eleifend non. Donec sagittis, neque eu malesuada euismod, elit nulla aliquet nibh, in laoreet eros diam quis lacus.
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Button variant="contained" className="action-button">Action</Button>
                                    </Grid>
                                </Grid>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                </Grid>

                <Grid item>
                    <ExpansionPanel>
                            <ExpansionPanelSummary expandIcon={<TriangleDownIcon />} > 
                                <Grid container direction="row" alignItems="center" spacing={4}>
                                    <Grid item>
                                        <DotFillIcon size={25}/> 
                                    </Grid>
                                    <Divider orientation="vertical" className="expansion-divider"/>
                                    <Grid item>
                                        <Grid container direction="row" alignItems="center" spacing={3}>
                                            <Grid item>
                                                <SmileyIcon size={25}/>
                                            </Grid>
                                            <Grid item>
                                                <Typography className="expansion-panel-heading">Closing</Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <Grid container direction="column" justify="center">
                                    <Grid item>
                                        <h2>
                                            Title goes here
                                        </h2>
                                    </Grid>
                                    <Grid item>
                                        <Typography className="expansion-panel-text">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut varius auctor tincidunt. 
                                        Vivamus vulputate ex libero, non pretium tortor eleifend non. Donec sagittis, neque eu malesuada euismod, elit nulla aliquet nibh, in laoreet eros diam quis lacus.
                                        </Typography>
                                        <Typography className="expansion-panel-text">
                                        Vivamus vulputate ex libero, non pretium tortor eleifend non. Donec sagittis, neque eu malesuada euismod, elit nulla aliquet nibh, in laoreet eros diam quis lacus.
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Button variant="contained" className="action-button">Action</Button>
                                    </Grid>
                                </Grid>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                </Grid>
                
            </Grid> 
        );
    }

    render(){
        return(
            <Box component="div">
                <Container>
                    <NavBar />
                    <this.firstTimeModal />
                    <Box component="div" paddingTop={5} paddingBottom={5}>
                        <Grid container direction="row" alignItems="center" spacing={2}>
                            <Grid item>
                                <ArchiveIcon size={35} />
                            </Grid>
                            <Grid item>
                                <h2 className="transaction-heading" >Transaction 1</h2>
                            </Grid>
                        </Grid>
                    </Box>
                    <this.RenderExpansionPanel />
                </Container>
            </Box>
        );
    }
}

export default TransactionAssist;