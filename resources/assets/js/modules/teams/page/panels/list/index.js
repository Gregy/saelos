import React, { Component } from "react";
import PropTypes from "prop-types";
import { fetchTeams, fetchTeam } from "../../../service";

class List extends Component {
  componentWillMount() {
    const { teams, dispatch, searchString } = this.props;

    if (teams.length === 0) {
      dispatch(fetchTeams({ page: 1, searchString }));
    }
  }

  _onKeyPress = event => {
    const { target, charCode } = event;

    if (charCode !== 13) {
      return;
    }

    event.preventDefault();

    this._submit(target);
  };

  _submit = input => {
    const { value } = input;
    const { dispatch } = this.props;

    if (value.length >= 3) {
      dispatch(fetchTeams({ page: 1, searchString: value }));
    } else if (value.length === 0) {
      dispatch(fetchTeams({ page: 1, searchString: "" }));
    }
  };

  _onScroll = event => {
    const { target } = event;
    const { dispatch, pagination, searchString } = this.props;
    const currentPosition = target.scrollTop + target.offsetHeight;

    if (currentPosition + 300 >= target.scrollHeight) {
      dispatch(fetchTeams({ page: pagination.current_page + 1, searchString }));
    }
  };

  render() {
    const { teams, dispatch, searchString, firstTeamId } = this.props;
    const activeIndex =
      parseInt(this.context.router.route.match.params.id) || firstTeamId;

    return (
      <div className="col list-panel border-right">
        <div className="px-4 pt-4 bg-white border-bottom">
          <form>
            <input
              type="search"
              className="form-control ds-input"
              id="search-input"
              placeholder={this.context.i18n.t("messages.search")}
              role="combobox"
              aria-autocomplete="list"
              aria-expanded="false"
              aria-owns="algolia-autocomplete-listbox-0"
              dir="auto"
              style={{ position: "relative", verticalAlign: "top" }}
              onKeyPress={this._onKeyPress}
              defaultValue={searchString}
            />
          </form>
          <div className="micro-text row text-center pt-3 pb-2">
            <div className="text-dark col">
              <b>{this.context.i18n.t("messages.active")}</b>
            </div>
            <div className="text-muted col">
              <b>{this.context.i18n.t("messages.all")}</b>
            </div>
          </div>
        </div>
        <div className="list-group h-scroll" onScroll={this._onScroll}>
          {teams.map(team => (
            <Team
              key={team.id}
              team={team}
              dispatch={dispatch}
              router={this.context.router}
              activeID={activeIndex}
            />
          ))}
        </div>
      </div>
    );
  }
}

List.propTypes = {
  teams: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
  isPosting: PropTypes.bool,
  pagination: PropTypes.object.isRequired,
  searchString: PropTypes.string
};

List.contextTypes = {
  router: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired
};

const Team = ({ team, dispatch, router, activeID }) => {
  const openTeamRecord = id => {
    dispatch(fetchTeam(team.id));
    router.history.push(`/config/teams/${id}`);
  };

  return (
    <div
      onClick={() => openTeamRecord(team.id)}
      className={`list-group-item list-group-item-action align-items-start ${
        team.id === parseInt(activeID) ? " active" : ""
      }`}
    >
      <h6>{team.name}</h6>
      <p>{team.leader.name}</p>
    </div>
  );
};

Team.propTypes = {
  team: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  router: PropTypes.object.isRequired
};

export default List;
