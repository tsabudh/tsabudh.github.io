import { useEffect, useRef, useState } from "react";

import styles from "./ContactForm.module.scss";
import Button from "./Button";
import classNames from "classnames/bind";
import IconCheckMark from "./Icons/IconCheckmark";

const cx = classNames.bind(styles);

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [twiceSubmitted, setTwiceSubmitted] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [reason, setReason] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [reasonError, setReasonError] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

  const handleFormSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (twiceSubmitted) {
      return;
    }
    let areErrorsPresent = false;

    const fullNameRegexp = new RegExp(/^[\p{L}]{2,}([\p{L} '-][\p{L}]+)*$/u);

    if (!fullNameRegexp.test(fullName)) {
      console.log("Please enter a valid name with at least 2 characters long.");
      setNameError(
        "Please enter a valid name with at least 2 characters long."
      );
      areErrorsPresent = true;
    } else {
      setNameError(null);
    }
    const emailRegexp = new RegExp(
      /^[\p{L}\p{N}._%+-]+@[\p{L}\p{N}-]+\.[\p{L}\p{N}.-]{2,}$/u
    );
    if (!emailRegexp.test(email)) {
      console.log("Please enter a valid email address.");
      setEmailError("Please enter a valid email address.");
      areErrorsPresent = true;
    } else {
      setEmailError(null);
    }
    if (!reason) {
      console.log("Please select a reason.");
      setReasonError("Please select a reason.");
      areErrorsPresent = true;
      return;
    }

    if (areErrorsPresent) {
      return;
    }

    if (formRef.current) {
      formRef.current.submit();
      setMessage("");
    }
    if (submitted) {
      setTwiceSubmitted(true);
      setMessage("");
      setEmail("");
      setFullName("");
      setReason("");
    } else {
      setSubmitted(true);
    }
  };

  useEffect(() => {
    // setEmail('');
    // setFullName('');
    setMessage("");
  }, [submitted]);

  return (
    <div className={cx("form-container", "effect2")}>
      <form
        method="POST"
        action="https://docs.google.com/forms/u/0/d/e/1FAIpQLSdczVnaH2c9qTD1Wbtyk-Eo5eoYpLRNZQzSOsZ_5Qd87yWFYg/formResponse"
        id="contactForm"
        target="_blank"
        aria-describedby="Form to contact for Sabudh Thapa"
        aria-description="Form to contact for Sabudh Thapa"
        ref={formRef}
      >
        <div className={cx("titles")}>
          <h3>Contact me {submitted ? " again " : ""}</h3>
          <p>Fill this form to let me know.</p>
        </div>
        <div className={cx("fields")}>
          <div className={cx("input-group")}>
            <label htmlFor="inputName" className={cx("label")}>
              Your full name
            </label>
            <input
              type="text"
              className={cx("input")}
              placeholder="eg: John Doe"
              required={true}
              id="inputName"
              name="entry.618262390"
              aria-autocomplete="inline"
              aria-required={true}
              aria-label="Full Name"
              value={fullName}
              onChange={(e) => {
                setNameError(null);
                setFullName(e.target.value);
              }}
            />
            <div className={cx("error-message")}>
              {nameError && <span>{nameError}</span>}
            </div>
          </div>
          <div className={cx("input-group")}>
            <label htmlFor="inputEmail" className={cx("label")}>
              Your email address
            </label>
            <input
              type="email"
              className={cx("input")}
              placeholder="eg: you@example.com"
              required={true}
              id="inputEmail"
              name="entry.475799668"
              aria-label="Email address"
              aria-autocomplete="none"
              value={email}
              onChange={(e) => {
                setEmailError(null);
                setEmail(e.target.value);
              }}
            />
            <div className={cx("error-message")}>
              {emailError && <span>{emailError}</span>}
            </div>
          </div>
          <div className={cx("input-group")}>
            <fieldset>
              <legend className={cx("label")}>
                What do you want to contact for?
              </legend>
              <div className={cx("flex-row")}>
                <div className={cx("wrapper")}>
                  <input
                    id="radioProduct"
                    name="entry.1581056432"
                    type="radio"
                    value={"Product"}
                    data-value="Product"
                    aria-label="Product"
                    tabIndex={0}
                    onChange={(e) => {
                      setReasonError(null);
                      setReason(e.target.value);
                    }}
                  />
                  <label
                    htmlFor="radioProduct"
                    className={cx("custom-radio")}
                    tabIndex={0}
                  >
                    <span>Product</span>
                    <span className={cx("checkmark")}>
                      <IconCheckMark />
                    </span>
                  </label>
                </div>
                <div className={cx("wrapper")}>
                  <input
                    id="radioPartnership"
                    name="entry.1581056432"
                    type="radio"
                    value={"Partnership"}
                    data-value="Product"
                    aria-label="Partnership"
                    aria-checked={true}
                    onChange={(e) => {
                      setReasonError(null);
                      setReason(e.target.value);
                    }}
                  />

                  <label
                    htmlFor="radioPartnership"
                    className={cx("custom-radio")}
                    tabIndex={0}
                  >
                    <span>Partnership</span>
                    <span className={cx("checkmark")}>
                      <IconCheckMark />
                    </span>
                  </label>
                </div>
                <div className={cx("wrapper")}>
                  <input
                    id="radioOthers"
                    name="entry.1581056432"
                    aria-checked="true"
                    type="radio"
                    value={"Other"}
                    data-value="Other"
                    aria-label="Other"
                    onChange={(e) => {
                      setReasonError(null);
                      setReason(e.target.value);
                    }}
                  />
                  <label
                    htmlFor="radioOthers"
                    className={cx("custom-radio")}
                    tabIndex={0}
                  >
                    <span>Others</span>
                    <span className={cx("checkmark")}>
                      <IconCheckMark />
                    </span>
                  </label>
                </div>
              </div>
              <div className={cx("error-message")}>
                {reasonError && <span>{reasonError}</span>}
              </div>
            </fieldset>
          </div>

          <div className={cx("input-group")}>
            <label htmlFor="inputMessage" className={cx("label")}>
              Your message
            </label>
            <input
              type="text"
              className={cx("input")}
              placeholder="eg: I want to..."
              id="inputMessage"
              name="entry.487388506"
              aria-label="Your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>
        <Button className={"submit"} type="button" onClick={handleFormSubmit}>
          Send {submitted ? " another " : ""} message
        </Button>
      </form>
    </div>
  );
}
