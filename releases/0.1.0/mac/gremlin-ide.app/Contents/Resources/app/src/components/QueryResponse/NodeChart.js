import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Graph from 'react-graph-vis';
import _ from "lodash";
import ReactJson from 'react-json-view';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    root: {
        height: "calc(100vh - 390px)",
        overflow: "auto",
        backgroundColor: theme.palette.background.paper,
        border: "solid 1px #cccccc",
        display: "flex"
    },
    chart: {
        flex: "1 1 auto"
    },
    panel: {
        width: "25%",
        overflow: "auto",
        borderLeft: "solid 1px #cccccc",
        float: "right",
        paddingLeft: "10px"
    }
});

const colors = ["#e6194b", "#3cb44b", "#ffe119", "#0082c8", "#f58231",
    "#911eb4", "#46f0f0", "#f032e6", "#d2f53c", "#fabebe",
    "#008080", "#e6beff", "#aa6e28", "#fffac8", "#800000",
    "#aaffc3", "#808000", "#ffd8b1", "#000080", "#808080"
];

class NodeChart extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            currentSelection: null
        }
        this.handleSelection = this.handleSelection.bind(this);
    }

    parseResults(props) {
        let data = props.results;
        let nodes = [];
        let edges = [];
        if (data !== null && data !== undefined) {
            data = data.reduce((a, b) => a.concat(b), []);
            data.forEach(element => {
                if (element.id != undefined && element.label != undefined) {
                    let sigma = {};
                    sigma.id = element.id;
                    sigma.label = element.label;
                    sigma.rawData = element;
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
        }
        var distinctLabels = this.unique(nodes, "label").map(a => a.label);

        nodes.forEach((n) => {
            var index = distinctLabels.indexOf(n.label);
            if (index >= 20) {
                index = index - 20;
            }
            n.color = colors[index];
        })

        return {
            nodes: nodes,
            edges: edges
        };
    }

    unique(array, propertyName) {
        return array.filter((e, i) => array.findIndex(a => a[propertyName] === e[propertyName]) === i);
    }

    addEdgeNode(nodes, id, label) {
        if (nodes.find((n) => { return n.id == id; }) == null) {
            let node = {};
            node.id = id;
            node.label = label;
            nodes.push(node);
        }
    }

    handleSelection(event) {
        let graph = this.parseResults(this.props);
        var results = [];
        event.nodes.forEach((n) => {
            graph.nodes.forEach((o) => {
                if (o.id === n) {
                    results.push(o.rawData);
                }
            });
        });
        event.edges.forEach((n) => {
            graph.edges.forEach((o) => {
                if (o.id === n) {
                    results.push(o.rawData);
                }
            });
        });
        this.setState({ currentSelection: results })
    }

    stablize(e) {
        console.log(e);
    }

    render() {
        const { classes } = this.props;
        var graph = this.parseResults(this.props);
        var options = {
            layout: {
                hierarchical: true
            },
            improvedLayout: false,
            physics: {
                enabled: true,
                forceAtlas2Based: {
                    gravitationalConstant: -26,
                    centralGravity: 0.005,
                    springLength: 230,
                    springConstant: 0.18,
                    avoidOverlap: 1.5
                },
                maxVelocity: 50,
                solver: 'forceAtlas2Based',
                timestep: 0.05,
                layout: {
                    improvedLayout: false
                },
                stabilization: {
                    enabled: false,
                    iterations: 1000,
                    updateInterval: 25
                }
            },
            edges: {
                enabled: true
            }
        };

        var events = {
            select: this.handleSelection,
            stablized: this.stablize
        }
        return (
            <div className={classes.root}>
                <div className={classes.chart}>
                    <Graph graph={graph} options={options} events={events} />
                </div>
                <div className={classes.panel}>
                    <Typography variant="subheading" color="inherit" noWrap style={{ flex: 1 }}>
                        Selection Details
                        </Typography>
                    {this.state.currentSelection !== null && this.state.currentSelection !== undefined &&
                        <ReactJson src={this.state.currentSelection} name={null} displayDataTypes={false} />
                    }
                </div>
            </div>
        );
    }
}

NodeChart.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NodeChart);