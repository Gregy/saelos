import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Chartist from "chartist";
import ChartistGraph from "react-chartist";
import _ from "lodash";
import Select from "react-select";
import { getStages } from "../../../../../stages/store/selectors";
import { getUsers } from "../../../../../users/store/selectors";
import { fetchPipelineGraph } from "../../../../service";

class PipelineGraph extends Component {
  state = {
    graphData: [],
    fetching: true,
    pipelineUser: null
  };

  componentDidMount() {
    this._updatePipelineGraph();
  }

  _updatePipelineGraph = user_id => {
    const { dispatch } = this.props;

    dispatch(fetchPipelineGraph({ user_id })).then(res => {
      this.setState({
        graphData: res.data,
        fetching: false
      });
    });
  };

  _buildPipelineData = graphData => {
    const data = [
      {
        name: "All",
        data: []
      },
      {
        name: "Team",
        data: []
      },
      {
        name: "Rep",
        data: []
      }
    ];

    graphData.map(d => {
      data[0].data.push(d.count);
      data[1].data.push(d.count_for_team);
      data[2].data.push(d.count_for_user);
    });

    return data;
  };

  render() {
    const { users, stages } = this.props;
    const { graphData, fetching, pipelineUser } = this.state;

    if (fetching) {
      return (
        <div className="col main-panel px-3 align-self-center full-panel">
          <h3 className="text-center text-muted">
            {this.context.i18n.t("messages.loading")}
          </h3>
        </div>
      );
    }

    const data = {
      labels: graphData.map(s => s.name),
      series: this._buildPipelineData(graphData)
    };

    const options = {
      low: 0,
      height: "400px",
      stackBars: false,
      fullWidth: true,
      showArea: true,
      axisX: {
        showGrid: true,
        showLabel: true
      },
      axisY: {
        showGrid: true,
        showLabel: true
      },
      plugins: [Chartist.plugins.legend()]
    };

    return (
      <div className="pt-3">
        <h5 className="py-4">
          <span className="float-right">
            <a
              href="javascript:void(0);"
              className="btn btn-link btn-sm text-primary"
            >
              {this.context.i18n.t("messages.take.snapshot")}
            </a>
          </span>
          {this.context.i18n.t("messages.pipeline")}
        </h5>
        <div className="card mb-1">
          <div className="card-body">
            <div className="float-right" style={{ width: "100px", zIndex: 99 }}>
              <Select
                value={pipelineUser}
                clearable={false}
                options={_.orderBy(users, "name").map(u => ({
                  value: u.id,
                  label: u.name
                }))}
                onChange={selection => {
                  this.setState({
                    pipelineUser: selection.value
                  });

                  this._updatePipelineGraph(selection.value);
                }}
              />
            </div>
            <div className="analyticsGraph">
              <ChartistGraph
                data={data}
                options={options}
                type="Bar"
                className="analytics-graph"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PipelineGraph.propTypes = {
  dispatch: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired
};

PipelineGraph.contextTypes = {
  i18n: PropTypes.object.isRequired
};

export default connect(state => ({
  users: getUsers(state),
  stages: getStages(state)
}))(PipelineGraph);
