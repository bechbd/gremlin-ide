import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ReactTable from "react-table"
import _ from "lodash";


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
    }

    render() {
        const { classes } = this.props;
        var data = { rows: [], columns: [] }
        parseResults(this.props.results, data.rows, data.columns);
        return (
            <div className={classes.root}>
                <ReactTable
                    className="-striped -highlight"
                    data={data.rows}
                    columns={data.columns}
                    showPagination={false} showPageSizeOptions={false} minRows={1}
                    noDataText=""
                />
            </div>
        );
    }
}

ResponseGrid.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ResponseGrid);

function findColumnIndexById(cols, label) {
    return _.findIndex(cols, (e) => { return e.id == label });
}

function parseResults(d, rows, columns) {
    var rows = rows || [];
    var cols = columns || [];

    if (d !== null && d !== undefined) {
        if (d instanceof Array) {
            d.forEach((r) => {
                parseResults(r, rows, cols);
            });
        } else {
            //Get unique columns
            Object.keys(d).forEach(function (k) {
                if (findColumnIndexById(cols, k) == -1) {
                    if (k != "properties") {
                        var col = {
                            accessor: k,
                            id: k,
                            Header: k
                        };
                        cols.push(col);
                    }
                    else {
                        Object.keys(d.properties).forEach((f) => {
                            if (findColumnIndexById(cols, f) == -1) {
                                var col = {
                                    accessor: f,
                                    id: f,
                                    Header: f
                                };
                                cols.push(col);
                            }
                        });
                    }
                }
            });

            var row = {};
            //get row data
            Object.keys(d).forEach(function (k) {
                if (k != "properties") {
                    row[k] = d[k];
                }
                else {
                    Object.keys(d.properties).forEach((f) => {
                        if (d.properties[f].value != undefined) {
                            row[f] = d.properties[f].value;
                        }
                        else {
                            row[f] = d.properties[f][0].value;
                        }
                    });
                }
            });
            rows.push(row);
        }
    }
}
