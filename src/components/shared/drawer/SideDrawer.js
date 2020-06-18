import React from 'react';
import PropTypes from 'prop-types';
import './SideDrawer.css';

/**
 * Displays a Side Drawer on a given side
 * @augments {React.Component<Props>}
 */
class SideDrawer extends React.Component {
    static propTypes = {
        /**
         * The title to be displayed on the Side Drawer
         */
        title: PropTypes.string.isRequired,

        /**
         * Specify whether the Side Drawer is visible
         */
        visible: PropTypes.bool.isRequired,

        /**
         * Specify the side where the drawer should
         * be displayed. (_Default: "right"_)
         */
        side: PropTypes.oneOf([
            "right",
            "left"
        ]),

        /**
         * Callback function which is called when user clicks
         * outside the side drawer.
         * 
         * This function typically should contain code to set
         * visiblity to false. If left unspecified, the
         * side drawer will not close when user clicks outside
         * the side drawer.
         */
        dismissCallback: PropTypes.func
    }

    render() {
        let {
            title,
            visible,
            side,
            dismissCallback,
            children
        } = this.props;

        return (
            <div className="side-drawer-root" visible={visible.toString()} side={side.toString()}>
                <div onClick={dismissCallback} className="side-drawer-backdrop" />
                <div className="side-drawer-container">
                    <div className="side-drawer">
                        <div className="side-drawer-content">
                            <h1 className="side-drawer-heading">
                                {title}
                            </h1>

                            {children}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SideDrawer;
