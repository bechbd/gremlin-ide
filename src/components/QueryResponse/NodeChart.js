import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Graph from 'react-graph-vis';

const styles = theme => ({
    root: {
        height: "calc(100vh - 390px)",
        overflow: "auto",
        backgroundColor: theme.palette.background.paper,
        border: "solid 1px #cccccc"
    },
});

class NodeChart extends React.Component {

    constructor(props) {
        super(props);
    }

    parseResults(props) {
        let data = props.results;
        let nodes = [];
        let edges = [];
        data = data.reduce((a, b) => a.concat(b), []);
        data.forEach(element => {
            if (element.id != undefined && element.label != undefined) {
                let sigma = {};
                sigma.id = element.id;
                sigma.label = element.label;
                if (element.inVLabel == undefined) {
                    if (nodes.find((n) => { return n.id == sigma.id; }) == null) {
                        nodes.push(sigma);
                    }
                }
                else {
                    sigma.to = element.inV;
                    sigma.from = element.outV;

                    if (edges.find((n) => { return n.id == sigma.id; }) == null) {
                        edges.push(sigma);
                    }

                    //check to make sure the nodes exist for the in and out vertex
                    this.addEdgeNode(nodes, element.inV, element.inVLabel);
                    this.addEdgeNode(nodes, element.outV, element.outVLabel);
                }
            }
        });
        return {
            nodes: nodes,
            edges: edges
        };
    }

    addEdgeNode(nodes, id, label) {
        if (nodes.find((n) => { return n.id == id; }) == null) {
            let node = {};
            node.id = id;
            node.label = label;
            nodes.push(node);
        }
    }

    render() {
        const { classes } = this.props;
        var graph = this.parseResults(this.props);
        var options = {
            layout: {
                hierarchical: true
            },
            edges: {
                color: "#000000"
            }
        };

        var events = {
            select: function (event) {
                var { nodes, edges } = event;
            }
        }
        return (
            <div className={classes.root}>
                <Graph graph={graph} options={options} events={events} />
            </div>
        );
    }
}

NodeChart.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NodeChart);