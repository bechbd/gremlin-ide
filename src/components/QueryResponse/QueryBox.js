import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider';
import MonacoEditor from 'react-monaco-editor';


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
            loading: false,
            code: ""
        }
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    onChange(newValue, e) {
        console.log('onChange', newValue, e); // eslint-disable-line no-console
    }

    editorDidMount(editor) {
        // eslint-disable-next-line no-console
        console.log('editorDidMount', editor, editor.getValue(), editor.getModel());
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
        const code = this.state.code;
        const options = {
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly: false,
            cursorStyle: 'line',
            automaticLayout: false,
        };
        return (
            <MonacoEditor
                width="100%"
                height="10%"
                language="groovy"
                value={code}
                options={options}
                onChange={this.onChange}
                editorDidMount={this.editorDidMount}
            />
        );
    }
}

QueryBox.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(QueryBox);
