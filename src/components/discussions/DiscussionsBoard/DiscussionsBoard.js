import moment from "moment";
import React, { Component } from "react";
import ReactLoading from "react-loading";
import { myFirestore, myStorage } from "../../../Config/MyFirebase";
import images from "../Themes/Images";
import UserAvatar from "../../../assets/user.png";
import "./DiscussionsBoard.css";
import { AppString } from "../Const";
import { Typography, Box, Avatar } from "@material-ui/core";

export default class ChatBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isShowSticker: false,
      inputValue: "",
    };
    this.currentUserId = AppString.ID;
    this.currentUserName = AppString.NAME;
    this.transId = this.props.transId;
    this.listMessage = [];
    this.currentPeerUser = this.props.currentPeerUser.uid;
    this.groupChatId = null;
    this.removeListener = null;
    this.currentPhotoFile = null;
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  componentDidMount() {
    // For first render, it's not go through componentWillReceiveProps
    this.getListHistory();
  }

  componentWillUnmount() {
    if (this.removeListener) {
      this.removeListener();
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.currentPeerUser) {
      this.currentPeerUser = newProps.currentPeerUser.uid;
      this.getListHistory();
    }
  }

  getListHistory = () => {
    if (this.removeListener) {
      this.removeListener();
    }
    this.listMessage.length = 0;
    this.setState({ isLoading: true });
    console.log(this.currentUserId);
    console.log(this.props.currentPeerUser);
    if (
      this.hashString(this.currentUserId) <=
      this.hashString(this.currentPeerUser)
    ) {
      this.groupChatId = `${this.currentUserId}-${this.currentPeerUser}`;
    } else {
      this.groupChatId = `${this.currentPeerUser}-${this.currentUserId}`;
    }

    // Get history and listen new data added
    this.removeListener = myFirestore
      .collection("transactions")
      .doc(this.transId)
      .collection(AppString.NODE_MESSAGES)
      .doc(this.groupChatId)
      .collection(this.groupChatId)
      .onSnapshot(
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === AppString.DOC_ADDED) {
              this.listMessage.push(change.doc.data());
            }
          });
          this.setState({ isLoading: false });
        },
        (err) => {
          alert(err.toString());
        }
      );
  };

  openListSticker = () => {
    this.setState({ isShowSticker: !this.state.isShowSticker });
  };

  onSendMessage = (content, type) => {
    if (this.state.isShowSticker && type === 2) {
      this.setState({ isShowSticker: false });
    }

    if (content.trim() === "") {
      return;
    }

    const timestamp = moment().valueOf().toString();

    const itemMessage = {
      idFrom: this.currentUserId,
      idTo: this.currentPeerUser,
      timestamp: timestamp,
      content: content.trim(),
      type: type,
    };

    myFirestore
      .collection("transactions")
      .doc(this.transId)
      .collection(AppString.NODE_MESSAGES)
      .doc(this.groupChatId)
      .collection(this.groupChatId)
      .doc(timestamp)
      .set(itemMessage)
      .then(() => {
        this.setState({ inputValue: "" });
      })
      .catch((err) => {
        alert(err.toString());
      });
  };

  onChoosePhoto = (event) => {
    if (event.target.files && event.target.files[0]) {
      this.setState({ isLoading: true });
      this.currentPhotoFile = event.target.files[0];
      // Check this file is an image?
      const prefixFiletype = event.target.files[0].type.toString();
      if (prefixFiletype.indexOf(AppString.PREFIX_IMAGE) === 0) {
        this.uploadPhoto();
      } else {
        this.setState({ isLoading: false });
        alert("This file is not an image");
      }
    } else {
      this.setState({ isLoading: false });
    }
  };

  uploadPhoto = () => {
    if (this.currentPhotoFile) {
      const timestamp = moment().valueOf().toString();

      const uploadTask = myStorage
        .ref()
        .child(timestamp)
        .put(this.currentPhotoFile);

      uploadTask.on(
        AppString.UPLOAD_CHANGED,
        null,
        (err) => {
          this.setState({ isLoading: false });
          alert(err.message);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            this.setState({ isLoading: false });
            this.onSendMessage(downloadURL, 1);
          });
        }
      );
    } else {
      this.setState({ isLoading: false });
      alert("File is null");
    }
  };

  onKeyboardPress = (event) => {
    if (event.key === "Enter") {
      this.onSendMessage(this.state.inputValue, 0);
    }
  };

  scrollToBottom = () => {
    if (this.messagesEnd) {
      this.messagesEnd.scrollIntoView({});
    }
  };

  render() {
    return (
      <Box className="viewChatBoard">
        <Box className="headerChatBoard">
          <Avatar
            className="avatar"
            src={
              this.props.currentPeerUser.photoUrl
                ? this.props.currentPeerUser.photoUrl
                : UserAvatar
            }
            alt="icon avatar"
          ></Avatar>
          <Typography className="textHeaderChatBoard">
            {this.props.currentPeerUser.name}
          </Typography>
        </Box>

        {/* List message */}
        <Box className="viewListContentChat">
          {this.renderListMessage()}
          <Box
            style={{ float: "left", clear: "both" }}
            ref={(el) => {
              this.messagesEnd = el;
            }}
          />
        </Box>

        {/* View bottom */}
        <Box className="viewBottom">
          <img
            className="icOpenGallery"
            src={images.ic_photo}
            alt="icon open gallery"
            onClick={() => this.refInput.click()}
          />
          <input
            ref={(el) => {
              this.refInput = el;
            }}
            accept="image/*"
            className="viewInputGallery"
            type="file"
            onChange={this.onChoosePhoto}
          />

          <input
            className="viewInput"
            placeholder="Type your message..."
            value={this.state.inputValue}
            onChange={(event) => {
              this.setState({ inputValue: event.target.value });
            }}
            onKeyPress={this.onKeyboardPress}
          />
          <img
            className="icSend"
            src={images.ic_send}
            alt="icon send"
            onClick={() => this.onSendMessage(this.state.inputValue, 0)}
          />
        </Box>

        {/* Loading */}
        {this.state.isLoading ? (
          <Box className="viewLoading">
            <ReactLoading
              type={"spin"}
              color={"#203152"}
              height={"3%"}
              width={"3%"}
            />
          </Box>
        ) : null}
      </Box>
    );
  }

  renderListMessage = () => {
    if (this.listMessage.length > 0) {
      let viewListMessage = [];
      this.listMessage.forEach((item, index) => {
        if (item.idFrom === this.currentUserId) {
          // Item right (my message)
          if (item.type === 0) {
            viewListMessage.push(
              <div className="viewItemRight" key={item.timestamp}>
                <span className="textContentItem">{item.content}</span>
              </div>
            );
          } else if (item.type === 1) {
            viewListMessage.push(
              <div className="viewItemRight2" key={item.timestamp}>
                <Avatar
                  className="imgItemRight"
                  src={item.content}
                  alt="content message"
                ></Avatar>
              </div>
            );
          } else {
            viewListMessage.push(
              <div className="viewItemRight3" key={item.timestamp}>
                <Avatar
                  className="imgItemRight"
                  src={this.getGifImage(item.content)}
                  alt="content message"
                ></Avatar>
              </div>
            );
          }
        } else {
          // Item left (peer message)
          if (item.type === 0) {
            viewListMessage.push(
              <div className="viewWrapItemLeft" key={item.timestamp}>
                <div className="viewWrapItemLeft3">
                  <div className="viewItemLeft">
                    <span className="textContentItem">{item.content}</span>
                  </div>
                </div>
                {this.isLastMessageLeft(index) ? (
                  <span className="textTimeLeft">
                    {moment(Number(item.timestamp)).format("LT")}
                  </span>
                ) : null}
              </div>
            );
          } else if (item.type === 1) {
            viewListMessage.push(
              <div className="viewWrapItemLeft2" key={item.timestamp}>
                <div className="viewWrapItemLeft3">
                  <div className="viewItemLeft2">
                    <Avatar
                      className="imgItemLeft"
                      src={item.content}
                      alt="content message"
                    ></Avatar>
                  </div>
                </div>
                {this.isLastMessageLeft(index) ? (
                  <span className="textTimeLeft">
                    {moment(Number(item.timestamp)).format("ll")}
                  </span>
                ) : null}
              </div>
            );
          } else {
            viewListMessage.push(
              <div className="viewWrapItemLeft2" key={item.timestamp}>
                <div className="viewWrapItemLeft3">
                  <div className="viewItemLeft3" key={item.timestamp}>
                    <Avatar
                      className="imgItemLeft"
                      src={this.getGifImage(item.content)}
                      alt="content message"
                    ></Avatar>
                  </div>
                </div>
                {this.isLastMessageLeft(index) ? (
                  <span className="textTimeLeft">
                    {moment(Number(item.timestamp)).format("ll")}
                  </span>
                ) : null}
              </div>
            );
          }
        }
      });
      return viewListMessage;
    } else {
      return <div></div>;
    }
  };

  hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash += Math.pow(str.charCodeAt(i) * 31, str.length - i);
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  };

  isLastMessageLeft(index) {
    if (
      (index + 1 < this.listMessage.length &&
        this.listMessage[index + 1].idFrom === this.currentUserId) ||
      index === this.listMessage.length - 1
    ) {
      return true;
    } else {
      return false;
    }
  }

  isLastMessageRight(index) {
    if (
      (index + 1 < this.listMessage.length &&
        this.listMessage[index + 1].idFrom !== this.currentUserId) ||
      index === this.listMessage.length - 1
    ) {
      return true;
    } else {
      return false;
    }
  }
}
