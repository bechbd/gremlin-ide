import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';


const styles = theme => ({
    root: {
        backgroundColor: "#d32f2f"
    }
});

class ErrorBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            open: false
        }
        this.handleClose = this.handleClose.bind(this);
    }

    componentWillReceiveProps(props) {
        if (props !== this.props) {
            this.setState({ open: props.open });
        }
    }

    handleClose(event, reason) {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ open: false });
    };

    render() {
        const { classes } = this.props;
        var messageTag = this.props.message;
        return (
            <div className={classes.root}>
                {this.state.open && <Snackbar
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    open={this.props.open}
                    onClose={this.handleClose}
                    message={messageTag}
                    action={[
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            className={classes.close}
                            onClick={this.handleClose}
                        >
                            <CloseIcon />
                        </IconButton>,
                    ]}
                />}
            </div>
        );
    }
}

ErrorBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ErrorBar);
