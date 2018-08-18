import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import QueryTabs from './QueryResponse/QueryTabs'
const { ipcRenderer } = require('electron')

const drawerWidth = 240;

const styles = theme => ({
    root: {
        flexGrow: 1,
        height: "99vh",
        zIndex: 1,
        // overflow: 'hidden',
        position: 'relative',
        display: 'flex'
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    drawerPaper: {
        position: 'relative',
        width: drawerWidth,
    },
    queryBox: {
        flex: "0 1 184px"
    },
    queryTabs: {
    },
    content: {
        flex: "1 1 auto",
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
        minWidth: 0, // So the Typography noWrap works
    },
    toolbar: theme.mixins.toolbar,
});

class Layout extends Component {

    constructor() {
        super();
        this.state = {
            query: "g.V()",
            results: null
        }
        this.handleChanges = this.handleChanges.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleChanges(event) {
        this.setState({ query: event.currentTarget.value })
    }

    handleKeyPress(e) {
        if (e.key == "Enter" && e.shiftKey) {
            this.handleSubmit(e);
        }
    }

    handleSubmit(event) {
        var result = ipcRenderer.sendSync("query:execute", this.state.query);
        this.setState({ results: result })
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <AppBar position="absolute" className={classes.appBar}>
                    <Toolbar>
                        <Typography variant="title" color="inherit" noWrap>
                            Gremlin IDE
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer
                    variant="permanent"
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <div className={classes.toolbar} />
                    <List>Query</List>
                    <List>Connections</List>
                </Drawer>
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    <div className={classes.queryBox}>
                        <TextField
                            id="multiline-static"
                            label="Query"
                            multiline
                            rows="4"
                            defaultValue="g.V()"
                            className={classes.textField}
                            margin="normal"
                            fullWidth
                            onChange={this.handleChanges}
                            onKeyPress={this.handleKeyPress}
                        />
                        <Button variant="contained" color="primary" className={classes.button} onClick={this.handleSubmit}>
                            Submit
                    </Button>
                        <br />
                        <br />
                        <Divider />
                    </div>
                    <QueryTabs className={classes.queryTabs} results={this.state.results} />
                </main>
            </div>
        );
    }
}

Layout.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Layout);