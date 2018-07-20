import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import NavItem from "../../common/navigation/NavItem";

import Page from "./page";
import * as MDIcons from "react-icons/lib/md/index";
import { getTags } from "./store/selectors";

const TagList = ({ tags }) => {
  return (
    <li className="nav-item">
      <ul className="nav">
        {tags.map(t => {
          //@TODO Review implementation here for optimization.
          let emojis = t.name.match(/([\uD800-\uDBFF][\uDC00-\uDFFF])/);
          let tagDisplay =
            emojis instanceof Array ? (
              <span>
                <span className="emoji">{emojis[0]}</span>{" "}
                {_.replace(t.name, emojis[0], "")}
              </span>
            ) : t.color ? (
              <span>
                <span
                  className="dot mr-2"
                  style={{ backgroundColor: t.color }}
                />{" "}
                {t.name}
              </span>
            ) : (
              <span>
                <span className="dot mr-2" />
                {t.name}
              </span>
            );

          return (
            <NavItem
              key={`tag-nav-item-${t.id}`}
              path={`/tags/${t.id}`}
              className="pl-3 ml-1 small"
            >
              {tagDisplay}
            </NavItem>
          );
        })}
      </ul>
    </li>
  );
};

TagList.propTypes = {
  tags: PropTypes.array.isRequired
};

// using withRouter here to force updates to child menu
const TagMenu = withRouter(
  connect(state => ({
    tags: getTags(state)
  }))(TagList)
);

export default [
  {
    path: "/tags",
    exact: true,
    auth: true,
    config: true,
    component: Page,
    menu: {
      icon: MDIcons.MdLocalOffer,
      location: "main",
      linkText: "messages.tag_plural",
      subLinks: TagMenu,
      roles: false
    }
  },
  {
    path: "/tags/:id",
    exact: true,
    auth: true,
    config: true,
    component: Page
  }
];
