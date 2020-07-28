import React from "react";
import { createUseStyles } from "react-jss";
import { Button } from "@material-ui/core";
import PhotoIcon from "../../assets/photo-icon.svg";
import PauseIcon from "../../assets/pause-icon.svg";
import { CheckIcon, UploadIcon } from "@primer/octicons-react";
import { myFirestore } from "../../Config/MyFirebase";
import "./UploadStatus.css";

/**
 * Renders upload status progress interface inside
 * upload modal.
 *
 * @param {object} props
 * Props passed to this component
 *
 * @param {{filename: string, progress: number, isPaused: boolean, uploadTask: firebase.storage.UploadTask}} props.uploadStatus
 * Firebase upload task status.
 *
 * @param {Function} props.resetUploadStateCallback
 * Callback to reset upload state.
 *
 * _You should reset the upload status to prevent any
 * unwanted behavior once the upload task is cancelled
 * or completed._
 *
 * **NOTE:** if you are not using hooks, it is recommended
 * to leave this parameter empty and have upload status reset
 * within `dismissCallback` to prevent multiple calls to
 * `setState`.
 *
 * @param {(message: string) => void} props.showSnackbarCallback
 * Callback to show snackbar.
 *
 * @param {boolean} props.isSavingPhoto
 * Specify if the existing file is being saved.
 * (_Default: false_)
 *
 * @param {Function} props.onSuccessCallback
 * Callback called after an upload is successful.
 *
 * @param {Function} props.dismissCallback
 * Callback to dismiss upload modal.
 *
 * @returns {JSX.Element}
 * `DocUploadStatus` JSX Element
 */
function UploadStatus({
  uploadStatus,
  resetUploadStateCallback = () => {},
  showSnackbarCallback = () => {},
  dismissCallback,
  isSavingPhoto = false,
}) {
  /**
   * Pause upload task.
   */
  const pauseUpload = () => {
    uploadStatus.uploadTask.pause();
  };

  const resumeUpload = () => {
    uploadStatus.uploadTask.resume();
  };

  const _getUploadStatusColor = (uploadStatus, opacity = 1) => {
    return uploadStatus.progress >= 100
      ? `rgba(1, 174, 75, ${opacity})`
      : uploadStatus.isPaused
      ? `rgba(246, 172, 0, ${opacity})`
      : `rgba(21, 5, 120, ${opacity})`;
  };

  const _getUploadStatusIcon = () => {
    return uploadStatus.progress >= 100 ? (
      <CheckIcon />
    ) : uploadStatus.isPaused ? (
      <img src={PauseIcon} alt="paused" />
    ) : (
      <UploadIcon />
    );
  };

  let uploadStatusStyles = createUseStyles({
    progressBackground: (uploadStatus) => ({
      width: `${uploadStatus.progress}%`,
      background: _getUploadStatusColor(uploadStatus, 0.07),
      "&::after": {
        background: _getUploadStatusColor(uploadStatus),
      },
    }),
    uploadStatusIndicator: (uploadStatus) => ({
      background: _getUploadStatusColor(uploadStatus),
    }),
  });

  let classes = uploadStatusStyles(uploadStatus);

  // Upload photo metadata to firebase database.
  // Then, reset upload form and dismiss upload modal once
  // upload is completed.
  if (uploadStatus.progress === 100) {
    (async () => {
      let userId = localStorage.getItem("userID");

      if (!isSavingPhoto) {
        await myFirestore
          .collection("users")
          .doc(userId)
          .update({
            photoURL: `Profile-Pictures/${userId}/${uploadStatus.filename}`,
          });
      }

      setTimeout(
        () => {
          dismissCallback();
          resetUploadStateCallback();
          showSnackbarCallback(
            isSavingPhoto
              ? "Photo Saved Successfully"
              : "Photo Uploaded Successfully"
          );
        },
        isSavingPhoto ? 1000 : 500
      );
    })();
  }

  return (
    <>
      <div className="upload-status-box-root">
        <div className="upload-info-root">
          <img src={PhotoIcon} alt="" />

          <div className="upload-info">
            <h1 className="photo-name">{uploadStatus.filename}</h1>
            <div className="upload-progress-info">
              {uploadStatus.progress < 100
                ? `${isSavingPhoto ? "Saving" : "Uploaded"} ${Math.floor(
                    uploadStatus.progress
                  )}%`
                : `${isSavingPhoto ? "Photo saved" : "Upload Completed"}`}
            </div>
          </div>
        </div>
        <div id="upload-progress-bg" className={classes.progressBackground} />
        <div
          id="upload-status-indicator"
          className={classes.uploadStatusIndicator}
        >
          {_getUploadStatusIcon()}
        </div>
      </div>

      <div id="upload-doc-action-footer">
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            let uploadCancelled = uploadStatus.uploadTask.cancel();
            if (uploadCancelled || uploadStatus.isPaused)
              showSnackbarCallback(
                isSavingPhoto
                  ? "Photo was not saved. Action Cancelled"
                  : "Photo Upload Cancelled"
              );

            dismissCallback();
            resetUploadStateCallback();
          }}
        >
          Cancel
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            if (!uploadStatus.isPaused) pauseUpload();
            else resumeUpload();
          }}
        >
          {!uploadStatus.isPaused ? "Pause" : "Resume"}
        </Button>
      </div>
    </>
  );
}

export default UploadStatus;
