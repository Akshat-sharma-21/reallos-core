import React from "react";
import { NavLink } from "react-router-dom";
import NavBar from "../shared/navbar/navbar";
import NavRail from "../shared/navigation_rail/TransactionNavRail";
import Modal, { ModalActionFooter } from "../shared/modal/Modal";
import { ArchiveIcon, EyeIcon } from "@primer/octicons-react";
import StampIcon from "../../assets/stamp_icon.svg";
import DocUploadStatus from "./uploader/DocUploadStatus";
import { myStorage } from "../../Config/MyFirebase.js";
import { ReallosLoaderWithOverlay } from "../shared/preloader/ReallosLoader";
import { accessRights, getCurrentUser, getTransactionID } from "../../global_func_lib";
import WebViewer from '@pdftron/webviewer';

import {
  Container,
  Grid,
  Box,
  Fab,
  Button,
  Divider,
  Snackbar,
} from "@material-ui/core";

import "./PaperworkViewer.css";

/**
 * Component for viewing, editing & saving
 * paperworks
 *
 * @augments React.Component<Props>
 */
class PaperworkViewer extends React.Component {
  constructor() {
    super();

    this.state = {
      hasChanges: false,
      isLoadingDocument: true,
      isUploadModalVisible: false,
      isResetModalVisible: false,
      isSnackbarVisible: false,
      snackbarMessage: null,
      uploadTaskStatus: {
        filename: "",
        progress: 0,
        isPaused: false,
        uploadTask: null,
      },
    };

    this.documentLink = null;
    this.viewerRoot = React.createRef();
  }

  componentDidMount() {
    this.transactionID = getTransactionID(this.props.location);

    WebViewer(
      { path: '/webviewer/lib', isReadOnly: !this.canEdit, fullAPI: true },
      this.viewerRoot.current
    )
      .then(viewerInstance => {
        const { docViewer, annotManager, FitMode } = viewerInstance;
        this.viewer = viewerInstance;
        this.setDocument(this.getState.path);

        docViewer.on('documentLoaded', () => {
          this.setDocumentLoaded();
          viewerInstance.setFitMode(FitMode.FitWidth);
          annotManager.setCurrentUser(getCurrentUser().email);
        });

        annotManager.on('annotationChanged', () => {
          this.setDocumentChanged();
        });
      });
  }

  /**
   * Show signature panel provided by **PDFTron**
   *
   * @returns {void}
   * Void
   */
  async showSignaturePanel() {
    if (this.viewerRoot.current.querySelector('iframe').contentDocument)
      this.viewerRoot.current.querySelector('iframe').contentDocument.querySelector(
        'div[data-element="signatureToolButton"]'
      ).firstChild.click();
  }

  /**
   * Set document within the viewer using relative document path.
   *
   * @param {string} docPath
   * Relative path to the document in Firebase Storage.
   *
   * @returns {Promise<void>}
   * Void
   */
  async setDocument(docPath) {
    let downloadLink = await myStorage.ref(docPath).getDownloadURL();
    this.viewer.loadDocument(downloadLink);
    this.documentLink = downloadLink;
  }

  /**
   * Resets the document in the viewer.
   *
   * Call to this function will not do anything
   * if `setDocument` was not called initially.
   */
  resetDocument() {
    if (this.documentLink) {
      this.viewer.loadDocument(this.documentLink);

      this.setState({
        hasChanges: false,
      });
    }
  }

  /**
   * Saves the changes made in the PDF viewer to
   * the cloud **(Firebase)**.
   *
   * @param {string} docPath
   * Relative path to the document in Firebase Storage.
   *
   * @returns {Promise<void>}
   * Void
   */
  async saveChangesToCloud(docPath) {
    if (this.canEdit) {
      const doc = this.viewer.docViewer.getDocument();
      const xfdfString = await this.viewer.annotManager.exportAnnotations();
      const options = { xfdfString, flatten: true };
      const data = await doc.getFileData(options);
      const arr = new Uint8Array(data);
      const docBlob = new Blob([arr], { type: 'application/pdf' });

      let fileRef = myStorage.ref().child(docPath);
      let uploadTask = fileRef.put(docBlob);

      uploadTask.on("state_changed", (snapshot) => {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        let isPaused = snapshot.state === "paused";

        let newUploadTaskDetails = {
          filename: this.getState.name,
          progress,
          isPaused,
          uploadTask,
        };

        this.setState({
          isUploadModalVisible: true,
          uploadTaskStatus: newUploadTaskDetails,
        });
      });
    }
  }

  /**
   * Resets upload status.
   */
  dismissUploadModalCallback() {
    this.setState({
      isUploadModalVisible: false,
      uploadTaskStatus: {
        progress: 0,
        isPaused: false,
        uploadTask: null,
      },
    });
  }

  /**
   * Set `isLoadingDocument` state to false when
   * document is loaded in the viewer.
   */
  setDocumentLoaded() {
    this.setState({
      isLoadingDocument: false,
    });
  }

  /**
   * Set `hasChanges` state when document changed.
   */
  setDocumentChanged() {
    this.setState({
      hasChanges: true,
    });
  }

  /**
   * Getter which returns the state information (document metadata)
   * from props.
   *
   * @returns {object | null}
   * Document Metadata passed by `Paperwork` component
   */
  get getState() {
    return this.props.location ? this.props.location.state : null;
  }

  /**
   * Returns a boolean value stating if the user can edit
   * the document.
   */
  get canEdit() {
    const docData = this.getState;
    return docData.accessRight === accessRights.READ_EDIT_ACCESS
  }

  render() {
    if (this.getState) {
      // Proceed if document metadata is available in props
      const docData = this.getState;

      return (
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

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <NavLink to={`/transaction/${this.transactionID}/paperwork`} className="link">
                  Paperwork
                </NavLink>
                <span style={{ margin: "0 10px" }}>/</span>
                {docData.name}

                {(!this.canEdit)
                  ? <span style={{
                    marginLeft: 15,
                    background: '#ffca1c',
                    color: '#000000',
                    fontFamily: 'Gilroy',
                    fontWeight: 'bold',
                    padding: '2px 5px',
                    borderRadius: 5
                  }}>
                    <span style={{marginRight: 5}}>
                      <EyeIcon />
                    </span>

                    Read Only
                  </span>

                  : <></>
                }
              </div>

              <div style={{display: this.canEdit ? 'block' : 'none'}}>
                <Button
                  variant="outlined"
                  color="primary"
                  disabled={!this.canEdit || !this.state.hasChanges}
                  onClick={() => {
                    this.setState({
                      isResetModalVisible: true,
                    });
                  }}
                >
                  Revert Changes
                </Button>
                <span style={{ marginRight: 10 }} />
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!this.canEdit || !this.state.hasChanges}
                  onClick={() => this.saveChangesToCloud(docData.path)}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </Box>

          {/* Holds the PDF Viewer */}
          <div className="pdf-viewer-root" ref={this.viewerRoot} />

          <Modal
            title="Saving Changes"
            visible={this.state.isUploadModalVisible}
            dismissCallback={() => this.dismissUploadModalCallback()}
            modalWidth={700}
          >
            <DocUploadStatus
              showSnackbarCallback={(message) => {
                this.setState({
                  isSnackbarVisible: true,
                  snackbarMessage: message,
                });
              }}
              dismissCallback={() => this.dismissUploadModalCallback()}
              uploadStatus={this.state.uploadTaskStatus}
              isSavingDocument={true}
            />
          </Modal>
          <Modal
            title="Revert Changes"
            visible={this.state.isResetModalVisible}
            dismissCallback={() =>
              this.setState({ isResetModalVisible: false })
            }
            modalWidth={700}
          >
            This will reset all the changes you have made to this document after
            the last save.
            <br />
            This action cannot be undone. Are you sure to continue?
            <ModalActionFooter>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => this.setState({ isResetModalVisible: false })}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  this.setState({ isResetModalVisible: false });
                  this.resetDocument();
                }}
              >
                Revert Changes
              </Button>
            </ModalActionFooter>
          </Modal>
          <Snackbar
            open={this.state.isSnackbarVisible}
            onClose={() => this.setState({ isSnackbarVisible: false })}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            message={this.state.snackbarMessage}
          />
          <ReallosLoaderWithOverlay
            visible={this.state.isLoadingDocument}
            strokeWidth={4}
          />
          <div style={{display: this.canEdit ? 'block' : 'none'}}>
            <Fab
              variant="extended"
              className="reallos-fab"
              size="large"
              onClick={() => this.showSignaturePanel()}
              disabled={!this.canEdit}
            >
              <img
                src={StampIcon}
                alt=""
                height={20}
                style={{ marginRight: 12 }}
              />
              E-Sign Document
            </Fab>
          </div>
        </Container>
      );
    } else {
      // Show error when no document metadata is available in props

      return (
        <Container>
          <NavBar />
          <NavRail />
          <Grid
            container
            direction="column"
            justify="center"
            alignContent="center"
            style={{ height: "85vh", textAlign: "center" }}
          >
            <div style={{ fontSize: 150, opacity: 0.5 }}>{"( >_< )"}</div>

            <div style={{ marginTop: 50, marginBottom: 20 }}>
              <h1>Oops!</h1>

              <p style={{ fontSize: 20 }}>
                Can't fetch the paperwork.
                <br />
                <div
                  style={{
                    fontStyle: "italic",
                    opacity: 0.5,
                  }}
                >
                  Did you enter the URL manually?
                </div>
              </p>
            </div>

            <Divider />

            <p>
              Go back to&nbsp;
              <NavLink to={`/transaction/${this.transactionID}/paperwork`} className="link">
                Paperwork
              </NavLink>
            </p>
          </Grid>
        </Container>
      );
    }
  }
}

export default PaperworkViewer;
