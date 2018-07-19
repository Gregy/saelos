import React from "react";
import PropTypes from "prop-types";

const Form = (
  { email, password, remember, errors, handleChange, handleSubmit },
  { i18n }
) => (
  <form className="form" role="form" onSubmit={handleSubmit} noValidate>
    <div className="form-group">
      <label htmlFor="email" className="sr-only">
        {i18n.t("messages.email")}
      </label>
      <input
        type="text"
        className={`form-control form-control-lg rounded-0 ${errors.has(
          "email"
        ) && "is-invalid"}`}
        name="email"
        id="email"
        placeholder={i18n.t("messages.email")}
        value={email || ""}
        onChange={e => handleChange(e.target.name, e.target.value)}
        required
        autoFocus
      />
      {errors.has("email") && (
        <div className="invalid-feedback">{errors.first("email")}</div>
      )}
    </div>
    <div className="form-group">
      <label htmlFor="password" className="sr-only">
        {i18n.t("messages.password")}
      </label>
      <input
        type="password"
        className={`form-control form-control-lg rounded-0 ${errors.has(
          "password"
        ) && "is-invalid"}`}
        id="password"
        name="password"
        placeholder={i18n.t("messages.password")}
        value={password || ""}
        onChange={e => handleChange(e.target.name, e.target.value)}
        required
      />
      {errors.has("password") && (
        <div className="invalid-feedback">{errors.first("password")}</div>
      )}
    </div>
    <div>
      <label className="custom-control custom-checkbox">
        <input
          type="checkbox"
          name="remember"
          className="form-check-input"
          onChange={e => handleChange(e.target.name, !remember)}
        />
        <span className="custom-control-indicator" />
        <span className="custom-control-description small">
          {i18n.t("messages.remember.me")}
        </span>
      </label>
    </div>
    <button
      className="btn btn-lg btn-primary btn-block"
      type="submit"
      disabled={errors.any()}
    >
      {i18n.t("messages.sign.in")}
    </button>
  </form>
);

Form.propTypes = {
  email: PropTypes.string,
  password: PropTypes.string,
  remember: PropTypes.bool,
  errors: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired
};

Form.contextTypes = {
  i18n: PropTypes.object.isRequired
};

export default Form;
