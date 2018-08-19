import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider';


const styles = theme => ({
    root: {
        backgroundColor: "#d32f2f"
    },
    queryBox: {
        flex: "0 1 184px"
    },
});

class QueryBox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            loading: false
        }
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    componentWillReceiveProps(props) {
        if (props !== this.props) {
            this.setState({ open: props.open });
        }
    }

    handleKeyPress(e) {
        if (e.key == "Enter" && e.shiftKey) {
            this.props.handleSubmit(e);
        }
    }

    render() {
        const { classes } = this.props;
        return (
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
                    onChange={this.props.handleChanges}
                    onKeyPress={this.handleKeyPress}
                />
                <Button variant="contained" color="primary" className={classes.button} onClick={this.props.handleSubmit}>
                    Submit
                </Button>
                <br />
                <br />
                <Divider />
            </div>
        );
    }
}

QueryBox.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(QueryBox);
