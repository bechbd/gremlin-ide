import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider';
import MonacoEditor from 'react-monaco-editor';


const styles = theme => ({
    root: {
        backgroundColor: "#eeeeee",
        height: "210px"
    },
    queryBox: {
        height: "165px",
    },
    button: {
        margin: "5px"
    }
});

class QueryBox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            loading: false,
            code: ""
        }
        this.onChange = this.onChange.bind(this);
        this.editorDidMount = this.editorDidMount.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    onChange(newValue, e) {
        this.setState({ code: newValue });
    }

    editorDidMount(editor) {
        // eslint-disable-next-line no-console
        var _this = this;
        editor.addCommand(monaco.KeyMod.Shift | monaco.KeyCode.Enter, function () {
            _this.props.handleSubmit(_this.state.code);
        });
    }

    handleSubmit(e) {
        this.props.handleSubmit(this.state.code);
    }

    componentWillReceiveProps(props) {
        if (props !== this.props) {
            this.setState({ open: props.open });
        }
    }

    render() {
        const { classes } = this.props;
        const code = this.state.code;
        const options = {
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly: false,
            cursorStyle: 'line',
            automaticLayout: false,
        };
        return (
            <div className={classes.root}>
                <div className={classes.queryBox}>
                    <MonacoEditor
                        width="100%"
                        height="100%"
                        language="groovy"
                        value={code}
                        options={options}
                        onKeyUp={this.handleKeyPress}
                        onChange={this.onChange}
                        editorDidMount={this.editorDidMount}
                    />
                </div>
                <Button variant="contained" color="primary" className={classes.button} onClick={this.handleSubmit}>
                    Submit
                </Button>
            </div>
        );
    }
}

QueryBox.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(QueryBox);
