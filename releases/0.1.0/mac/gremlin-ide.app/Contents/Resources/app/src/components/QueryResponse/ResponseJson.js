import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ReactJson from 'react-json-view';

const styles = theme => ({
    root: {
        height: "calc(100vh - 390px)",
        overflow: "auto",
        backgroundColor: theme.palette.background.paper,
    },
});

class ResponseJson extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <ReactJson src={this.props.results} />
            </div>
        );
    }
}

ResponseJson.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ResponseJson);