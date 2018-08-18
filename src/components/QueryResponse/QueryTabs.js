import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import ResponseJson from './ResponseJson'
import ResponseGrid from './ResponseGrid';
import NodeChart from './NodeChart';

function TabContainer(props) {
    return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
            {props.children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
};

const styles = theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        height: "calc(100vh - 300px)"
    },
    container: {
        overflow: "scroll"
    }
});

class QueryTabs extends React.Component {

    constructor() {
        super();
        this.state = {
            value: 0,
            results: null
        };

        this.handleChange = this.handleChange.bind(this);
    }

    componentWillReceiveProps(prevProps) {
        if (prevProps !== this.props) {
            this.setState({ results: prevProps.results });
        }
    }

    handleChange(event, value) {
        this.setState({ value });
    };

    render() {
        const { classes } = this.props;
        const { value } = this.state;

        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Tabs value={value} onChange={this.handleChange}>
                        <Tab label="Table" />
                        <Tab label="JSON" />
                        <Tab label="Node Chart" href="#basic-tabs" />
                    </Tabs>
                </AppBar>
                {value === 0 && <TabContainer className={classes.container}><ResponseGrid results={this.state.results} /></TabContainer>}
                {value === 1 && <TabContainer className={classes.container}><ResponseJson results={this.state.results} /></TabContainer>}
                {value === 2 && <TabContainer className={classes.container}><NodeChart results={this.state.results} /></TabContainer>}
            </div>
        );
    }
}

QueryTabs.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(QueryTabs);