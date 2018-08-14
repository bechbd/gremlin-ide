import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ReactJson from 'react-json-view';

const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
});

class ResponseJson extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <ReactJson src={this.props.results} />
            </div>
        );
    }
}

ResponseJson.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ResponseJson);