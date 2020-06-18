import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import { XIcon } from '@primer/octicons-react';
import './Modal.css';

/**
 * Display a modal
 * @augments {React.Component<Props>}
 */
class ReallosModal extends React.Component {
    static propTypes = {
        /**
         * Title to be displayed for the Modal
         */
        title: PropTypes.string.isRequired,

        /**
         * Specify whether the modal is visible
         */
        visible: PropTypes.bool.isRequired,

        /**
         * Callback function which is called when close button
         * is pressed.
         *
         * This function typically should contain code to set
         * visiblity to false. If left unspecified, the close
         * button won't show up.
         */
        dismissCallback: PropTypes.func,

        /**
         * Set width of the modal. (_Default: 450px_)
         */
        modalWidth: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]),

        /**
         * Set height of the modal. By default the height
         * will automatically be determined by the content
         * inside the modal.
         *
         * (_Usage not recommended_)
         */
        modalHeight: PropTypes.string
    }

    render() {
        let {
            title,
            visible,
            dismissCallback,
            modalWidth,
            modalHeight,
            children
        } = this.props;

        return (
            <>
                <div className="modal-bg" visible={visible.toString()} aria-modal="true">
                    <div className="modal" style={{'width': modalWidth, 'height': modalHeight}}>
                        <div className="modal-container">
                            {
                                (dismissCallback) ?
                                    <div className="modal-close-btn">
                                        <IconButton onClick={dismissCallback}>
                                            <XIcon size="small" />
                                        </IconButton>
                                    </div>
                                    : <></>
                            }

                            <h1 className="modal-heading">
                                {title}
                            </h1>

                            {children}
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default ReallosModal;
