import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = theme => ({
    root: {
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
});

class ConnectionSetup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            serverName: "",
            serverPort: 8182,
            userName: "",
            password: ""
        }
        this.handleClose = this.handleClose.bind(this);
        this.handleServerNameChanges = this.handleServerNameChanges.bind(this);
        this.handleServerPortChanges = this.handleServerPortChanges.bind(this);
        this.handleUserNameChanges = this.handleUserNameChanges.bind(this);
        this.handlePasswordChanges = this.handlePasswordChanges.bind(this);
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

    handleServerNameChanges(event) {
        this.setState({ serverName: event.currentTarget.value })
    }

    handleServerPortChanges(event) {
        this.setState({ serverPort: event.currentTarget.value })
    }

    handleUserNameChanges(event) {
        this.setState({ userName: event.currentTarget.value })
    }

    handlePasswordChanges(event) {
        this.setState({ password: event.currentTarget.value })
    }

    render() {
        const { classes } = this.props;
        var messageTag = this.props.message;
        return (
            <div className={classes.root}>
                {this.state.open && <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Setup Database Connection</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please enter the fields below to setup your database connection
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="normal"
                            id="address"
                            label="Server Name"
                            type="text"
                            fullWidth
                            value={this.state.serverName}
                            onChange={this.handleServerNameChanges}
                        />
                        <TextField
                            margin="normal"
                            id="address"
                            label="Server Port"
                            type="number"
                            fullWidth
                            value={this.state.serverPort}
                            onChange={this.handleServerPortChanges}
                        />
                        <TextField
                            margin="normal"
                            id="userName"
                            label="User Name"
                            type="text"
                            fullWidth
                            value={this.state.userName}
                            onChange={this.handleUserNameChanges}
                        />
                        <TextField
                            margin="normal"
                            id="password"
                            label="Password"
                            type="password"
                            fullWidth
                            value={this.state.password}
                            onChange={this.handlePasswordChanges}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Test Connection
                        </Button>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleClose} color="primary">
                            Connect
                        </Button>
                    </DialogActions>
                </Dialog>}
            </div>
        );
    }
}

ConnectionSetup.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ConnectionSetup);

