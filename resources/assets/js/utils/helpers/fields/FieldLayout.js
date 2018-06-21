import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import Select from "react-select";
import * as MDIcons from "react-icons/lib/md";
import DatePicker from "../../../common/ui/datepicker";

import "react-day-picker/lib/style.css";

class FieldLayout extends React.Component {
  _buildHtml = () => {
    const { model, field, inEdit, onChange } = this.props;
    let fieldValue;

    if (model.hasOwnProperty(field.alias)) {
      fieldValue = _.get(model, field.alias);

      if (typeof fieldValue === "object") {
        fieldValue = _.get(fieldValue, "name");
      }
    } else {
      // check custom fields
      // @TODO: Temp code until we figure out custom fields on User object
      if (model.hasOwnProperty("custom_fields")) {
        let cField = _.find(
          model.custom_fields,
          f => f.custom_field_alias === field.alias
        );

        if (cField) {
          fieldValue = cField.value;
        }
      }
    }

    const readOnly = !inEdit
      ? {
          readOnly: true,
          className: "form-control-plaintext",
          required: field.required ? "required" : false
        }
      : {
          readOnly: false,
          className: "form-control",
          required: field.required ? "required" : false
        };

    if (inEdit) {
      switch (field.type) {
        case "textarea":
          return (
            <textarea
              {...readOnly}
              id={field.alias}
              name={field.alias}
              onChange={onChange}
              {...readOnly}
              defaultValue={fieldValue}
            />
          );
        case "checkbox":
          return (
            <label className="switch float-left mr-2">
              <input
                type="checkbox"
                name={field.alias}
                id={field.alias}
                onChange={onChange}
                {...readOnly}
                defaultChecked={fieldValue}
              />
              <span className="toggle-slider round" />
            </label>
          );
        case "number":
          return (
            <input
              type="number"
              {...readOnly}
              id={field.alias}
              name={field.alias}
              onChange={onChange}
              {...readOnly}
              defaultValue={fieldValue}
            />
          );
        case "email":
          return (
            <input
              type="email"
              {...readOnly}
              id={field.alias}
              name={field.alias}
              {...readOnly}
              onChange={onChange}
              defaultValue={fieldValue}
            />
          );
        case "multiselect":
          return (
            <Select
              options={Object.keys(field.values).map(v => ({
                value: v,
                label: v
              }))}
              valueKey="value"
              labelKey="label"
              multi={true}
              value={fieldValue}
              {...readOnly}
              className="form-control"
              onChange={value => {
                const e = {
                  target: {
                    name: field.alias,
                    value: value.value
                  }
                };

                onChange(e);
              }}
            />
          );
        case "select":
          return (
            <Select
              options={Object.keys(field.values).map(v => ({
                value: v,
                label: v
              }))}
              valueKey="value"
              labelKey="label"
              value={fieldValue}
              {...readOnly}
              className="form-control"
              onChange={value => {
                const e = {
                  target: {
                    name: field.alias,
                    value: value.value
                  }
                };

                onChange(e);
              }}
            />
          );
        case "date":
          return (
            <DatePicker
              className="form-control"
              name={field.alias}
              value={fieldValue}
              onChange={onChange}
            />
          );
        case "lookup":
        default:
          return (
            <input
              type="text"
              {...readOnly}
              id={field.alias}
              name={field.alias}
              onChange={onChange}
              {...readOnly}
              defaultValue={fieldValue}
            />
          );
      }
    } else {
      switch (field.type) {
        case "url":
          return (
            <a
              className="hidden-link form-control-plaintext"
              href={fieldValue}
              target="_blank"
            >
              {fieldValue}{" "}
              <span className="text-muted">
                <MDIcons.MdExitToApp />
              </span>
            </a>
          );
        case "checkbox":
          return fieldValue ? "Yes" : "No";
        default:
          return (
            <div
              className="form-control-plaintext"
              dangerouslySetInnerHTML={{ __html: fieldValue }}
            />
          );
      }
    }
  };

  render() {
    const { model, field, inEdit, isAdmin, error } = this.props;

    let fieldValue = _.get(model, field.alias);

    if (typeof fieldValue === "object") {
      fieldValue = _.get(fieldValue, "name");
    }

    const hidden = inEdit
      ? ""
      : typeof fieldValue === "undefined" ||
        field.hidden ||
        fieldValue === null ||
        fieldValue.length === 0
        ? "d-none"
        : "";

    if (isAdmin) {
      return (
        <div className={`form-group mb-2 ${error.length ? "hasError" : ""}`}>
          <label htmlFor={field.alias} className="col-form-label">
            {field.label}
          </label>
          <div>
            {this._buildHtml()}
            {error.length ? <div className="warning small">{error}</div> : null}
          </div>
        </div>
      );
    } else {
      return (
        <div
          className={`form-group mb-2 row ${hidden} ${
            error.length ? "hasError" : ""
          }`}
        >
          <label htmlFor={field.alias} className="col-sm-3 col-form-label">
            {field.label}
          </label>
          <div className="col-sm-9">
            {this._buildHtml()}
            {error.length ? <div className="warning small">{error}</div> : null}
          </div>
        </div>
      );
    }
  }
}

FieldLayout.propTypes = {
  model: PropTypes.object.isRequired,
  field: PropTypes.object.isRequired,
  inEdit: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool,
  error: PropTypes.array
};

export default FieldLayout;
