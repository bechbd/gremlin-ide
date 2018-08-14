import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ReactTable from "react-table"


const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
});

class ResponseGrid extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            columns: [],
            keys: [],
            results: []
        }
    }

    componentWillReceiveProps(props) {
        console.log("componentWillReceiveProps");

        if (props !== this.props) {
            var _this = this;
            const data = props.results ? props.results.edges.concat(props.results.nodes) : [];
            this.setState({ results: data });
            if (data instanceof Array) {
                data.forEach(function (d) {
                    var arr = _this.state.keys;
                    var cols = _this.state.columns;
                    Object.keys(d).forEach(function (k) {
                        if (_this.state.keys.indexOf(k) < 0) {
                            var col = {
                                accessor: k,
                                id: k,
                                Header: k
                            };
                            cols.push(col);
                            arr.push(k);
                        }
                    });
                    _this.setState({ columns: cols });
                });
            }
        }
    }

    render() {
        return (
            <div>
                <ReactTable
                    data={this.state.results}
                    columns={this.state.columns}
                    showPagination={false} showPageSizeOptions={false} minRows={1}
                />
            </div>
        );
    }
}

ResponseGrid.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ResponseGrid);