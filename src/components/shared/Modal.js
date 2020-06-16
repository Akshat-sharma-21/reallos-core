import React from 'react';
import './Modal.css';

/**
 * Display Modal
 * 
 * @param {string} title
 * Title for the modal
 * 
 * @param {string} visible
 * Make modal visible or not
 * (_boolean_)
 * 
 * @param {string} modalWidth
 * Specify the width of modal
 * (_length_)
 */
function Modal({
    title,
    visible,
    modalWidth,
    children
}) {
    return (
        <>
            <div className="modal-bg" visible={visible.toString()}>
                <div className="modal" style={{'width': modalWidth}}>
                    <div className="modal-container">
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

export default Modal;
