import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ReactQuill from "react-quill";
import Select from "react-select";
import DatePicker from "../../../../common/ui/datepicker/index";
import { getActiveUser } from "../../../users/store/selectors";
import { saveActivity } from "../../service";
import Contact from "../../../contacts/Contact";
import Opportunity from "../../../opportunities/Opportunity";
import Company from "../../../companies/Company";
import Activity from "../../Activity";

class TaskAction extends Component {
  constructor(props) {
    super(props);

    if (props.activity) {
      this.state = {
        formState: props.activity.originalProps
      };
    } else {
      this.state = {
        formState: {
          user_id: props.user.id,
          contact_id: props.model instanceof Contact ? props.model.id : null,
          opportunity_id:
            props.model instanceof Opportunity ? props.model.id : null,
          company_id: props.model instanceof Company ? props.model.id : null
        }
      };
    }
  }

  _handleInputChange = event => {
    const { target } = event;
    const { name, value } = target;
    const { formState } = this.state;

    formState[name] = value;

    this.setState({
      formState
    });
  };

  _handleContentChange = value => {
    const { formState } = this.state;

    formState.description = value;

    this.setState({
      formState
    });
  };

  _submit = () => {
    const { formState } = this.state;

    if (typeof formState.details_type === "undefined") {
      alert("Please select a task type");
    } else {
      this.props.dispatch(saveActivity(formState)).then(() => {
        this._cancel();
      });
    }
  };

  _cancel = () => {
    this.setState({
      formState: {
        user_id: this.props.user.id,
        contact_id:
          this.props.model instanceof Contact ? this.props.model.id : null,
        opportunity_id:
          this.props.model instanceof Opportunity ? this.props.model.id : null,
        company_id:
          this.props.model instanceof Company ? this.props.model.id : null
      }
    });

    this.props.toggle();
  };

  render() {
    const { model, user } = this.props;
    const { formState } = this.state;

    let opportunityOptions = null;
    let companyOptions = null;
    let contactOptions = null;
    let assigneeOptions = null;

    if (model instanceof Opportunity) {
      companyOptions = model.companies.map(c => ({
        value: c.id,
        label: c.name
      }));
      contactOptions = model.contacts.map(c => ({
        value: c.id,
        label: c.name
      }));
    }

    if (model instanceof Company) {
      opportunityOptions = model.opportunities.map(o => ({
        value: o.id,
        label: o.name
      }));
      contactOptions = model.contacts.map(c => ({
        value: c.id,
        label: c.name
      }));
    }

    if (model instanceof Contact) {
      opportunityOptions = model.opportunities.map(o => ({
        value: o.id,
        label: o.name
      }));
      companyOptions = model.companies.map(c => ({
        value: c.id,
        label: c.name
      }));
    }

    assigneeOptions = user.team.users.map(u => ({
      value: u.id,
      label: u.name
    }));

    return (
      <React.Fragment>
        <div className="card-body taskActionView">
          <div className="form-row">
            <div className="form-group col-md-4">
              <label htmlFor="assignee_name">Assignee</label>
              {user.authorized(["admin", "manager"]) ? (
                <Select
                  value={formState.user_id}
                  onChange={value => {
                    const event = {
                      target: {
                        name: "user_id",
                        value: value ? value.value : null
                      }
                    };

                    this._handleInputChange(event);
                  }}
                  options={assigneeOptions}
                />
              ) : (
                <input
                  type="text"
                  readOnly={true}
                  className="form-control"
                  value={formState.user ? formState.user.name : user.name}
                />
              )}
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="due_date">Type</label>
              <Select
                value={formState.details_type}
                onChange={value => {
                  const event = {
                    target: {
                      name: "details_type",
                      value: value ? value.value : null
                    }
                  };

                  this._handleInputChange(event);
                }}
                options={[
                  { value: "App\\CallActivity", label: "Call" },
                  { value: "App\\EmailActivity", label: "Email" },
                  { value: "App\\SmsActivity", label: "SMS" }
                ]}
              />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="due_date">Due Date</label>
              <DatePicker
                className="form-control"
                name="due_date"
                placeholder="Enter due date"
                onChange={this._handleInputChange}
                value={formState.due_date}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-12">
              <label htmlFor="task_name">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                placeholder="Enter task name"
                onChange={this._handleInputChange}
                value={formState.name}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col">
              <ReactQuill
                onChange={this._handleContentChange}
                defaultValue={formState.description}
              />
            </div>
          </div>
          <div className="form-row">
            {opportunityOptions ? (
              <div className="col">
                <label htmlFor="emailOpportunity">Opportunity</label>
                <Select
                  multi={false}
                  value={formState.opportunity_id}
                  onChange={value => {
                    const event = {
                      target: {
                        name: "opportunity_id",
                        value: value ? value.value : null
                      }
                    };

                    this._handleInputChange(event);
                  }}
                  options={opportunityOptions}
                />
              </div>
            ) : (
              ""
            )}

            {contactOptions ? (
              <div className="col">
                <label htmlFor="emailOpportunity">Contact</label>
                <Select
                  multi={false}
                  value={formState.contact_id}
                  onChange={value => {
                    const event = {
                      target: {
                        name: "contact_id",
                        value: value ? value.value : null
                      }
                    };

                    this._handleInputChange(event);
                  }}
                  options={contactOptions}
                />
              </div>
            ) : (
              ""
            )}

            {companyOptions ? (
              <div className="col">
                <label htmlFor="emailCompany">Company</label>
                <Select
                  multi={false}
                  value={formState.company_id}
                  onChange={value => {
                    const event = {
                      target: {
                        name: "company_id",
                        value: value ? value.value : null
                      }
                    };

                    this._handleInputChange(event);
                  }}
                  options={companyOptions}
                />
              </div>
            ) : (
              ""
            )}
          </div>
          {this.props.activity instanceof Activity ? null : (
            <div className="mt-2">
              <button className="btn btn-primary mr-2" onClick={this._submit}>
                Save
              </button>
              <button
                className="btn btn-link text-muted"
                onClick={this._cancel}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

TaskAction.propTypes = {
  user: PropTypes.object.isRequired,
  activity: PropTypes.instanceOf(Activity)
};

export default connect()(TaskAction);
