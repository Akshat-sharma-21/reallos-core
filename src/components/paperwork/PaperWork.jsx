import React from 'react';
import NavBar from '../shared/navbar/navbar';
import NavRail from '../shared/navigation_rail/TransactionNavRail';
import DocUploadModal from './uploader/DocUploadModal';
import ReallosLoader from '../shared/preloader/ReallosLoader';
import Modal, { ModalActionFooter } from '../shared/modal/Modal';
import AccessRightsModal from './AccessRightsModal';
import UserAvatar from '../../assets/user.png';
import PdfLogo from '../../assets/pdf_icon_duotone.svg';
import { NavLink } from 'react-router-dom';
import { myStorage, myFirestore } from '../../Config/MyFirebase';
import { withStyles } from '@material-ui/core/styles';
import { getTransactionID, getEffectiveDocumentName, getCurrentUser, getPeopleInvolved } from '../../global_func_lib';

import {
    Container,
    Grid,
    Box,
    Typography,
    Fab,
    Avatar,
    Card,
    CardMedia,
    CardContent,
    IconButton,
    Button,
    Snackbar,
    Menu,
    MenuItem
} from '@material-ui/core';

import {
    ArchiveIcon,
    ArrowUpIcon,
    KebabHorizontalIcon,
    XIcon,
    ShieldIcon
} from '@primer/octicons-react';

import './PaperWork.css';

const styles = theme => ({
    docCardUserAvatar: {
        width: 30,
        height: 30
    }
});

class PaperWork extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isUploadModalVisible: false,
            isSnackbarVisible: false,
            isPaperworkExistsModalVisible: false,
            uploadFileName: null,
            snackbarMessage: null,
            documents: null,
            menuAnchorElement: null,
            isDeleteModalVisible: false,
            isAccessRightsModalVisible: false,
            menuTagetDocumentData: {
                name: '',
                creator: '',
                path: ''
            }
        };

        this.RenderPaperworkCards = this.RenderPaperworkCards.bind(this);
        this.showUploadModalVisibility = this.showUploadModalVisibility.bind(this);
        this.dismissUploadModal = this.dismissUploadModal.bind(this);
        this.showSnackbar = this.showSnackbar.bind(this);
        this.dismissSnackbar = this.dismissSnackbar.bind(this);
        this.setDocumentList = this.setDocumentList.bind(this);
        this.transactionID = getTransactionID(this.props.location);
    }

    componentDidMount() {
        this.setDocumentList();
    }

    /**
     * Show paperwork upload modal.
     */
    showUploadModalVisibility() {
        this.setState({
            isUploadModalVisible: true
        });
    }

    /**
     * Dismiss paperwork upload modal.
     */
    dismissUploadModal() {
        this.setState({
            isUploadModalVisible: false
        });
    }

    /**
     * Display a snackbar.
     *
     * @param {string} message
     * Message to be displayed inside the snackbar.
     */
    showSnackbar(message) {
        this.setState({
            isSnackbarVisible: true,
            snackbarMessage: message
        });
    }

    /**
     * Dismiss a snackbar.
     */
    dismissSnackbar() {
        this.setState({
            isSnackbarVisible: false
        });
    }

    /**
     * Sets the anchor element for paperwork menu.
     *
     * @param {HTMLButtonElement} menuAnchorElement
     * The element to be used as menu anchor.
     * Pass `event.targetElement` as the argument.
     *
     * @param {object} menuTagetDocumentData
     * The `docData` of the target document.
     */
    openMenu(menuAnchorElement, menuTagetDocumentData) {
        this.setState({
            menuAnchorElement,
            menuTagetDocumentData
        })
    }
    /**
     * Sets the anchor element to null in order to
     * dismiss the menu.
     */
    dismissMenu() {
        this.setState({
            menuAnchorElement: null
        })
    }

    /**
     * Sets visibility for delete modal to `true`
     */
    showDeleteModal() {
        this.setState({
            isDeleteModalVisible: true
        })
    }

    /**
     * Returns URL of thumbnail for a PDF.
     */
    async getThumbnail(docName) {
        try {
            const thumbnailRef = myStorage.ref().child(
                `${this.transactionID}/paperworks/thumbnails/${getEffectiveDocumentName(docName)}.png`
            );

            const thumbnailUrl = await thumbnailRef.getDownloadURL();
            return thumbnailUrl;
        }
        catch(e) {
            // Fallback thumbnail (Transaparent Grid Background)
            return 'https://thumbs.dreamstime.com/b/vector-empty-transparent-background-transparency-grid-seamless-pattern-171149540.jpg';
        }
    }

    /**
     * Sets `document` state to documents in cloud.
     */
    async setDocumentList() {
        let paperworkDataSnapshot =
            await myFirestore
                .collection('transactions')
                .doc(this.transactionID)
                .collection('paperwork')
                .get()

        let paperworks = [];
        let peopleList = await getPeopleInvolved(this.transactionID);

        Promise.all(
            paperworkDataSnapshot.docs.map(async (doc) => {
                let paperworkMeta = doc.data();

                if (paperworkMeta.creator === getCurrentUser().email ||
                    paperworkMeta.accessData[getCurrentUser().email] > 0
                ) {
                    let documentRef = myStorage.ref().child(
                        `${this.transactionID}/paperworks/${paperworkMeta.path}`
                    );

                    let creator =
                        (paperworkMeta.creator === getCurrentUser().email)
                            ? "You"
                            : peopleList.filter(person => person.email == paperworkMeta.creator)[0]
                                ? peopleList.filter(person => person.email == paperworkMeta.creator)[0].name
                                : "Unknown"

                    let currentUserAcessRight =
                        (paperworkMeta.creator === getCurrentUser().email)
                            ? 2
                            : paperworkMeta.accessData[getCurrentUser().email] ?? 0;

                    paperworks.push({
                        name: documentRef.name,
                        creator: creator,
                        path: paperworkMeta.path,
                        accessRight: currentUserAcessRight,
                        thumbnail: await this.getThumbnail(documentRef.name)
                    });
                }
            })
        ).then(() => {
            this.setState({
                documents: paperworks
            })
        });
    }

    /**
     * Deletes the specified document from the cloud.
     *
     * @param {{ name: string, creator: string, path: string, thumbnail: string }} docData
     * The document data of the particular document.
     */
    async deletePaperwork(docData) {
        let docPath = docData.path
        let docRef = myStorage.ref().child(docPath);

        try {
            await docRef.delete();

            this.setState({
                isSnackbarVisible: true,
                snackbarMessage: 'The document was deleted successfully.',
                documents: this.state.documents.filter(doc => doc.name != docData.name)
            });
        }
        catch (err) {
            this.showSnackbar("Failed to delete the document")
        }
    }

    /**
     * Renders paperwork cards on the paperwork dashboard
     */
    RenderPaperworkCards() {
        const { classes } = this.props;

        if (this.state.documents === null) {
            // If paperworks are not fetched

            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    textAlign: 'center',
                    marginTop: 30
                }}>
                    <ReallosLoader />

                    <h1>
                        Just a moment...
                    </h1>
                    <p style={{fontSize: 20, marginTop: 0}}>
                        We are fetching your paperworks.
                    </p>
                </div>
            )
        }

        else if (this.state.documents.length === 0) {
            // If no paperwork documents are present.

            return (
                <Grid
                    container
                    direction="column"
                    alignItems="center"
                    justify="center"
                    spacing={2}
                    className="zoom-in-animation"
                >
                    <Grid item>
                        <img src={require('../../assets/no-paperwork-image.png')} className="no-paperwork-image"/>
                    </Grid>
                    <Grid item>
                        <Box marginTop={-3} marginLeft={4}>
                            <Typography className="paperwork-heading reallos-text">Paperworks</Typography>
                        </Box>
                    </Grid>
                    <Grid item>
                        <Box marginTop={-1} marginLeft={4}>
                            <Typography className="paperwork-subheading reallos-text">
                                Store and E-sign all your documents hassle free here!
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            );
        }

        else {
            // If paperwork documents are present.

            return (
                <div className="doc-card-group">
                    {this.state.documents.map((docData, itemIndex) => (
                        <div
                            className="doc-card-root"
                            key={docData.name}
                            style={{
                                opacity: 0,
                                animation: `slide-up-anim 150ms ease-out ${itemIndex * 25}ms forwards`
                            }}
                        >
                            <IconButton
                                className="doc-card-top-action-btn"
                                onClick={(event) => this.openMenu(event.currentTarget, docData)}
                            >
                                <KebabHorizontalIcon />
                            </IconButton>

                            <NavLink to={{
                                pathname: `/transaction/${this.transactionID}/paperwork/${docData.name}`,
                                state: docData
                            }}>
                                <Card className="doc-card" title={docData.name}>
                                    <CardMedia
                                        image={docData.thumbnail}
                                        style={{height: 200, backgroundPositionY: 'top'}}
                                    />

                                    <CardContent>
                                        <h2 style={{
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                            {getEffectiveDocumentName(docData.name)}
                                        </h2>

                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }}>
                                            <Avatar
                                                className={classes.docCardUserAvatar}
                                                src={UserAvatar}
                                            />

                                            <span style={{marginLeft: 10}}>
                                                Uploaded by <strong>{docData.creator}</strong>
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </NavLink>
                        </div>
                    ))}

                    <Menu
                        open={!!this.state.menuAnchorElement}
                        anchorEl={this.state.menuAnchorElement}
                        onClose={() => this.dismissMenu()}
                        anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                        transformOrigin={{horizontal: 'right', vertical: 'top'}}
                    >
                        <MenuItem onClick={() => {
                            this.dismissMenu();
                            this.setState({
                                isAccessRightsModalVisible: true
                            })
                        }}>
                            <div style={{margin: 'auto 20px auto 0'}}>
                                <ShieldIcon size={20} />
                            </div>

                            Configure access rights
                        </MenuItem>
                        <MenuItem onClick={() => {
                            this.dismissMenu();
                            this.showDeleteModal();
                        }}>
                            <div style={{margin: 'auto 20px auto 0'}}>
                                <XIcon size={20} />
                            </div>

                            Delete
                        </MenuItem>
                    </Menu>

                    <Modal
                        title="Delete Paperwork"
                        visible={this.state.isDeleteModalVisible}
                        dismissCallback={() => this.setState({isDeleteModalVisible: false})}
                        modalWidth={700}
                    >
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 30
                        }}>
                            <img
                                src={PdfLogo}
                                alt=""
                                style={{marginRight: 30, width: 80}}
                            />

                            <div style={{fontSize: 18}}>
                                Are you sure you want to delete the following paperwork:
                                <br />

                                <strong>
                                    {getEffectiveDocumentName(
                                        this.state.menuTagetDocumentData.name
                                    )}
                                </strong>

                                <p>
                                    This action is not undoable. Think again...
                                </p>
                            </div>
                        </div>

                        <ModalActionFooter>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => this.setState({isDeleteModalVisible: false})}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    this.setState({isDeleteModalVisible: false});
                                    this.deletePaperwork(this.state.menuTagetDocumentData)
                                }}
                            >
                                Delete
                            </Button>
                        </ModalActionFooter>
                    </Modal>

                    <Modal
                        title="Can't Upload"
                        visible={this.state.isPaperworkExistsModalVisible}
                        dismissCallback={() => this.setState({isPaperworkExistsModalVisible: false})}
                        modalWidth={700}
                    >
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 30
                        }}>
                            <img
                                src={PdfLogo}
                                alt=""
                                style={{marginRight: 30, width: 80}}
                            />

                            <div style={{fontSize: 18}}>
                                You cannot upload "
                                <strong>
                                    {getEffectiveDocumentName(
                                        this.state.uploadFileName
                                    )}
                                </strong>
                                " as it already exists in this transaction. If you want to upload this paperwork, delete the existing paperwork first.
                            </div>
                        </div>

                        <ModalActionFooter>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => this.setState({isPaperworkExistsModalVisible: false})}
                            >
                                Close
                            </Button>
                        </ModalActionFooter>
                    </Modal>

                    <AccessRightsModal
                        visible={this.state.isAccessRightsModalVisible}
                        dismissCallback={() => this.setState({isAccessRightsModalVisible: false})}
                        filename={this.state.menuTagetDocumentData.name}
                        transactionID={this.transactionID}
                        showSnackbarCallback={this.showSnackbar}
                    />
                </div>
            )
        }
    }

    render() {
        return (
            <div>
                <Container>
                    <NavBar />
                    <NavRail />
                    <Box component="div" paddingTop={5} paddingBottom={5}>
                        <Grid container direction="row" alignItems="center" spacing={2}>
                            <Grid item>
                                <ArchiveIcon size={35} />
                            </Grid>
                            <Grid item>
                                <h2>Transaction 1</h2>
                            </Grid>
                        </Grid>
                    </Box>
                    <this.RenderPaperworkCards />
                    <Grid container direction="row" justify="flex-end" alignItems="flex-end">
                        <Fab
                            variant="extended"
                            className="reallos-fab"
                            size="large"
                            onClick={this.showUploadModalVisibility}
                        >
                            <ArrowUpIcon className="fab-icon" size={20} /> &nbsp;
                            Upload Document
                        </Fab>
                    </Grid>
                </Container>
                <DocUploadModal
                    dismissCallback={this.dismissUploadModal}
                    visible={this.state.isUploadModalVisible}
                    showSnackbarCallback={this.showSnackbar}
                    onSuccessCallback={() => {
                        // Reset the list of paperworks
                        this.setState({
                            documents: null
                        });

                        this.setDocumentList();
                    }}
                    onFileExistsCallback={filename => {
                        this.setState({
                            isPaperworkExistsModalVisible: true,
                            uploadFileName: filename
                        })
                    }}
                />
                <Snackbar
                    open={this.state.isSnackbarVisible}
                    onClose={this.dismissSnackbar}
                    anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
                    message={this.state.snackbarMessage}
                />
            </div>
        );
    }
}

export default withStyles(styles)(PaperWork);
