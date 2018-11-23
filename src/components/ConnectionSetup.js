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
import { Checkbox } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { ipcRenderer } from 'electron';
const settings = require('electron').remote.require('electron-settings');

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
            password: "",
            opProcessor: "",
            useSSL: false
        }
        this.handleClose = this.handleClose.bind(this);
        this.saveThenClose = this.saveThenClose.bind(this);
        this.handleServerNameChanges = this.handleServerNameChanges.bind(this);
        this.handleServerPortChanges = this.handleServerPortChanges.bind(this);
        this.handleUserNameChanges = this.handleUserNameChanges.bind(this);
        this.handlePasswordChanges = this.handlePasswordChanges.bind(this);
        this.handleSSLChanges = this.handleSSLChanges.bind(this);
        this.testConnection = this.testConnection.bind(this);
        this.handleOpProcessorChanges = this.handleOpProcessorChanges.bind(this);
    }

    componentWillMount() {
        this.setState({
            serverName: settings.get("loginInfo.serverName"),
            serverPort: settings.get("loginInfo.serverPort"),
            userName: settings.get("loginInfo.userName"),
            password: settings.get("loginInfo.password"),
            opProcessor: settings.get("loginInfo.opProcessor"),
            useSSL: Boolean(settings.get("loginInfo.useSSL"))
        })
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

    saveThenClose(event, reason) {
        if (reason === 'clickaway') {
            return;
        }
        settings.set("loginInfo", {
            serverName: this.state.serverName,
            serverPort: this.state.serverPort,
            userName: this.state.userName,
            password: this.state.password,
            opProcessor: this.state.opProcessor,
            useSSL: Boolean(this.state.useSSL)
        })
        ipcRenderer.send("connection:newConnection");
        this.handleClose();
    };

    testConnection() {
        alert("Currently this is not hooked up");
    }

    handleSSLChanges(event) {
        this.setState({ useSSL: event.currentTarget.checked })
    }

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

    handleOpProcessorChanges(event) {
        this.setState({ opProcessor: event.currentTarget.value })
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
                        <TextField
                            margin="normal"
                            id="opProcessor"
                            label="Op Processor"
                            type="text"
                            fullWidth
                            value={this.state.opProcessor}
                            onChange={this.handleOpProcessorChanges}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox checked={this.state.useSSL} onChange={this.handleSSLChanges} />}
                            label="Use SSL" />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.testConnection} color="default" disabled={true}>
                            Test Connection
                        </Button>
                        <Button onClick={this.handleClose} color="default">
                            Cancel
                        </Button>
                        <Button onClick={this.saveThenClose} color="primary">
                            Save
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

