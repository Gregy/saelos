import React from "react";
import PropTypes from "prop-types";
import { getStage } from "../../../store/selectors";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { fetchStage, saveStage, deleteStage } from "../../../service";
import { CirclePicker } from "react-color";
import { handleInputChange } from "../../../../../utils/helpers/fields";

class Record extends React.Component {
  constructor(props) {
    super(props);

    this._submit = this._submit.bind(this);
    this._handleInputChange = this._handleInputChange.bind(this);
    this._delete = this._delete.bind(this);

    this.state = {
      formState: props.stage.originalProps
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({ formState: nextProps.stage.originalProps });
  }

  _submit() {
    this.props.dispatch(saveStage(this.state.formState));
  }

  _handleInputChange = event => {
    this.setState({
      formState: handleInputChange(event, this.state.formState, {})
    });
  };

  _delete() {
    const { dispatch, stage } = this.props;

    dispatch(deleteStage(stage.id));
    this.context.router.history.push("/config/stages");
  }

  render() {
    const { stage, user } = this.props;
    const { formState } = this.state;

    //@TODO Simplify this check somehow/somewhere
    formState.color = formState.color === null ? "" : formState.color;

    if (stage.id === null && this.props.match.params.id !== "new") {
      return (
        <main className="col main-panel px-3 align-self-center">
          <h2 className="text-muted text-center">
            Select a stage{" "}
            <span className="d-none d-lg-inline">on the left </span>to edit.
          </h2>
        </main>
      );
    }

    return (
      <main className="col main-panel px-3">
        <div className="list-inline pt-3 float-right">
          <button
            className="btn btn-link mr-2 btn-sm list-inline-item"
            onClick={this._delete}
          >
            Delete
          </button>
          <button
            className="btn btn-primary list-inline-item"
            onClick={this._submit}
          >
            Save
          </button>
        </div>
        <h4 className="border-bottom py-3">
          {formState.name ? formState.name : "New Stage"}
        </h4>

        <div className="h-scroll">
          <div className="card mb-1">
            <ul className={`list-group list-group-flush`}>
              <li className="list-group-item">
                <div className={`form-group mb-2`}>
                  <label htmlFor="stageName" className="">
                    Name
                  </label>
                  <div className="">
                    <input
                      type="text"
                      id="stageName"
                      name="name"
                      onChange={this._handleInputChange}
                      className="form-control"
                      value={formState.name}
                    />
                  </div>
                </div>
                <div className={`form-group mb-2`}>
                  <label htmlFor="stageProbability" className="">
                    Probability
                  </label>
                  <div className="">
                    <input
                      type="text"
                      id="stageProbability"
                      name="probability"
                      onChange={this._handleInputChange}
                      className="form-control"
                      value={formState.probability}
                    />
                  </div>
                </div>
                <div className={`form-group mb-2`}>
                  <label htmlFor="stageColor" className="">
                    Color
                  </label>
                  <div className="form-group">
                    <CirclePicker
                      color={formState.color}
                      name="color"
                      width="100%"
                      circleSize={20}
                      circleSpacing={10}
                      onChangeComplete={color => {
                        const event = {
                          target: {
                            name: "color",
                            value: color.hex
                          }
                        };

                        this._handleInputChange(event);
                      }}
                      placeholder={stage.color}
                    />
                  </div>
                </div>
              </li>
              <li className="list-group-item">
                <div className="row">
                  <div className={`my-2 col`}>
                    <label className="switch float-left mr-2">
                      <input
                        type="checkbox"
                        name="active"
                        checked={formState.active}
                        onChange={this._handleInputChange}
                      />
                      <span className="toggle-slider round" />
                    </label>
                    <div className="pt-1">Active</div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </main>
    );
  }
}

Record.propTypes = {
  stage: PropTypes.object.isRequired
};

Record.contextTypes = {
  router: PropTypes.object.isRequired
};

export default withRouter(
  connect((state, ownProps) => ({
    stage: getStage(state, ownProps.match.params.id)
  }))(Record)
);
