import Model from "../../utils/Model";
import Team from "../teams/Team";
import Role from "../roles/Role";
import _ from "lodash";
import store from "../../store";
import { getFieldsForUsers } from "./store/selectors";
import { getCustomFieldValue } from "../../utils/helpers/customFieldsHelper";

const jwt_decode = require("jwt-decode");

class User extends Model {
  constructor(props) {
    super(props);

    this.initialize(props);
  }

  initialize(props) {
    props.custom_fields = props.custom_fields ? props.custom_fields : [];

    super.initialize(Object.assign({}, props));

    const fields = getFieldsForUsers(store.getState());

    fields.map(field => {
      if (field.is_custom) {
        const value = getCustomFieldValue(
          field.alias,
          props.custom_fields,
          field.default
        );

        this[field.alias] = field.type === "date" ? moment(value) : value;
      } else {
        if (!props.hasOwnProperty(field.alias)) {
          props[field.alias] = null;
        }

        this[field.alias] = props[field.alias];
      }
    });

    this.name = props.name || "";
    this.email = props.email || "";
    this.phone = props.phone || "";
    this.roles = (props.roles && props.roles.map(r => new Role(r))) || [];
    this.custom_fields = props.custom_fields || [];
    this.settings = props.settings || {};
    this.team = (props.team && new Team(props.team)) || new Team({});
    this.total_contacts = props.total_contacts || 0;
    this.total_contacts_last_week = props.total_contacts_last_week || 0;

    this.views = _.get(props.settings, "views");

    props.roles = props.roles || [];
  }

  authorized(role) {
    // If the role is false (such as with an unguarded menu), then just return true
    if (role === false) {
      return true;
    }

    const { scopes } = jwt_decode(localStorage.getItem("access_token"));

    if (!Array.isArray(scopes)) {
      return false;
    }

    if (Array.isArray(role)) {
      return role.map(r => scopes && scopes.includes(r)).includes(true);
    }

    return scopes && scopes.includes(role);
  }
}

export default User;
