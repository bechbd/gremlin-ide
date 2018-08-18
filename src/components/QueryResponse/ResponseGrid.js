import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ReactTable from "react-table"


const styles = theme => ({
    root: {
        height: "calc(100vh - 390px)",
        overflow: "auto",
        backgroundColor: theme.palette.background.paper
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
        if (props !== this.props) {
            var rows = [];
            var _this = this;
            if (props.results != null) {
                parseResults(props.results, _this, rows);
            }
            _this.setState({ results: rows });
        }
    }

    render() {
        const { classes } = this.props;
        var rows = [];
        var data = parseResults(this.props, this, rows);
        return (
            <div className={classes.root}>
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

function parseResults(d, _this, rows) {
    var rows = [];
    var cols = []
    var arr = [];

    if (d instanceof Array) {
        d.forEach((r) => {
            var results = parseResults(r, _this, rows);
            rows.push(results.rows);
            cols.push(results.columns);
        });
    } else {
        var arr = [];
        var cols = [];
        var row = {};
        Object.keys(d).forEach(function (k) {
            if (_this.state.keys.indexOf(k) < 0) {
                if (k != "properties") {
                    var col = {
                        accessor: k,
                        id: k,
                        Header: k
                    };
                    cols.push(col);
                    arr.push(k);
                    row[k] = d[k];
                }
                else {
                    Object.keys(d.properties).forEach((f) => {
                        if (_this.state.keys.indexOf(f) < 0) {
                            var col = {
                                accessor: f,
                                id: f,
                                Header: f
                            };
                            cols.push(col);
                            arr.push(f);
                            if (d.properties[f].value != undefined) {
                                row[f] = d.properties[f].value;
                            }
                            else {
                                row[f] = d.properties[f][0].value;
                            }
                        }
                    });
                }
            }
        });
        rows.push(row);
        //_this.setState({ columns: cols });
        return { rows: rows, columns: cols };
    }
}
