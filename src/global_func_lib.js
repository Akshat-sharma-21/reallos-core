import axios from "axios";
import { myFirebase } from "./Config/MyFirebase";

/**
 * List of maps containing user roles in the form:
 *
 * ```
 * {value: '...', label: '...'}
 * ```
 */
export const USER_ROLES = [
  { value: "buyer", label: "Buyer" },
  { value: "seller", label: "Seller" },
  { value: "buyer-agent", label: "Buyer Agent" },
  { value: "seller-agent", label: "Seller Agent" },
  { value: "title-agent", label: "Title Agent" },
  { value: "escrow-agent", label: "Escrow Agent" },
  { value: "home-inspector", label: "Home Inspector" },
];

/**
 * Returns role label of a user based on `roleValue`
 *
 * @param {"buyer" | "seller" | "buyer-agent" | "seller-agent" | "title-agent" | "escrow-agent" | "home-inspector"} roleValue
 * Role Value
 *
 * @returns {string}
 * Role label
 */
export const getRoleLabel = (roleValue) => {
  let roleLabel = null;

  USER_ROLES.map((role) => {
    if (role.value === roleValue) {
      roleLabel = role.label;
    }
  });

  return roleLabel;
}

/**
 * Regex to validate email.
 */
// eslint-disable-next-line
export const emailValidationRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

/**
 * Regex to validate phone number.
 */
export const phoneNumberValidationRegex = /^[0-9]{10}$/;

/**
 * Validates a form field value based on the type
 * of field.
 *
 * @param {string} textValue
 * The value to validate.
 *
 * @param {"firstname" | "lastname" | "email" | "phone" | "role" | "state" | "address" | "password"} fieldType
 * Type of form field that needs to be validated.
 *
 * @returns {{hasError: boolean, errorText: string}}
 * Map containing `hasError` and `errorText`. If the field
 * is valid or `fieldType` is invalid, `errorText` will be `null`.
 */
export const validateFormField = (textValue, fieldType) => {
  let formFieldError = {
    hasError: false,
    errorText: null,
  };

  switch (fieldType) {
    case "name":
      if (textValue.trim() === "") {
        formFieldError = {
          hasError: true,
          errorText: "Name cannot be empty",
        };
      }

      break;

    case "title":
      if (textValue.trim() === "") {
        formFieldError = {
          hasError: true,
          errorText: "Title cannot be empty",
        };
      }

      break;

    case "firstName":
      if (textValue.trim() === "") {
        formFieldError = {
          hasError: true,
          errorText: "This field cannot be empty",
        };
      }

      break;

    case "lastName":
      if (textValue.trim() === "") {
        formFieldError = {
          hasError: true,
          errorText: "This field cannot be empty",
        };
      }

      break;

    case "email":
      if (textValue === "") {
        formFieldError = {
          hasError: true,
          errorText: "Email cannot be empty",
        };
      } else if (!emailValidationRegex.test(textValue)) {
        formFieldError = {
          hasError: true,
          errorText: "Email is invalid",
        };
      }

      break;

    case "phone":
      if (textValue === "") {
        formFieldError = {
          hasError: true,
          errorText: "Phone number cannot be empty",
        };
      } else if (!phoneNumberValidationRegex.test(textValue)) {
        formFieldError = {
          hasError: true,
          errorText: "Phone number is invalid",
        };
      }

      break;

    case "address":
      if (textValue.trim() === "") {
        formFieldError = {
          hasError: true,
          errorText: "Address cannot be empty",
        };
      }

      break;

    case "description":
      if (textValue.trim() === "") {
        formFieldError = {
          hasError: true,
          errorText: "Description cannot be empty",
        };
      }

      break;

    case "role":
      if (textValue === "") {
        formFieldError = {
          hasError: true,
          errorText: "Role cannot be left unselected",
        };
      } else if (getRoleLabel(textValue) === "null") {
        formFieldError = {
          hasError: true,
          errorText: "Role is invalid",
        };
      }

      break;

    case "state":
      if (textValue === "") {
        formFieldError = {
          hasError: true,
          errorText: "State cannot be left unselected",
        };
      }

      break;

    case "password":
      if (textValue === "") {
        formFieldError = {
          hasError: true,
          errorText: "Password cannot be empty",
        };
      } else if (textValue.length < 8) {
        formFieldError = {
          hasError: true,
          errorText: "Password must be atleast 8 characters long!",
        };
      }

      break;

    default:
  }

  return formFieldError;
}

/**
 * Converts bytes to other measurments of size.
 * _('KB', 'MB', 'GB', 'TB')_
 *
 * @param {number} bytes
 * Size in bytes
 *
 * @returns {string}
 * Converted size measurment
 */
export const bytesToSize = (bytes) => {
  // @SRC: https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript

  let sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  if (bytes === 0) return "0 Byte";

  let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${Math.round(bytes / Math.pow(1024, i), 2)} ${sizes[i]}`;
}

/**
 * Returns hash present in the URL of current page
 * by decoding its URI encodings.
 *
 * @param {object} locationObject
 * Object containing location data. You must pass either
 * `this.props.location` or a `useLocation` object.
 */
export const getDecodedHash = (locationObject) => {
  const hash = locationObject.hash;
  const decodedHash = decodeURIComponent(hash);

  return decodedHash;
}

/**
 * Returns `TransactionID` from **location** prop.
 * Will return `null` if the location does not have a TransactionID.
 *
 * @param {object} locationObject
 * Object containing location data. You must pass either
 * `this.props.location` or a `useLocation` object.
 *
 * @returns {string}
 * TransactionID as a string.
 */
export const getTransactionID = (locationObject) => {
  let transactionID =
    locationObject.pathname.indexOf("transaction") !== -1
      ? locationObject.pathname.split("/")[2]
      : null;

  return transactionID;
}

/**
 * Returns the list of people involved in a transaction.
 *
 * @param {string} transactionID
 * Transaction ID for which the people list has
 * to be fetched.
 *
 * @returns {Promise<object[]>}
 */
export const getPeopleInvolved = async (transactionID) => {
  // @TODO: Add error handling

  const endpoint = `https://us-central1-reallos-382c7.cloudfunctions.net/api/get-all-people/${transactionID}`;

  let response = await axios.get(endpoint, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("FBIdToken")}`,
    },
  });

  return response.data.peopleList;
}

/**
 * Returns the username of a user using their email.
 *
 * @param {string} email
 * Email of the user. If this parameter is left out or is not valid,
 * `null` is returned by the function.
 *
 * @param {string?} transactionID
 * ID of the transaction. Used to fetch `peopleInvolvedObject`.
 * Use only if `peopleInvolvedObject` is not available.
 *
 * @param {object[]?} peopleInvolvedObject
 * List of People Involved in a transaction.
 * `transactionID` is not considered when this parameter is passed.
 *
 * @returns {Promise<string>}
 * Name of the user corresponding to the email.
 */
export const getUserName = async (email, transactionID, peopleInvolvedObject) => {
  console.log(validateFormField(email, 'email'))

  if (validateFormField(email, 'email'))
    return;

  if (peopleInvolvedObject == null) {
    if (transactionID)
      peopleInvolvedObject = await getPeopleInvolved(transactionID);

    else
      return;
  }

  const filtered = peopleInvolvedObject.filter(person => person.email == email);

  if (filtered.length != 0) {
    return filtered[0].name;
  }
}

/**
 * Returns `currentUser` from `firebase.auth` namespace.
 *
 * @returns {firebase.User}
 * Object containing details of the user currently
 * signed in. If no user is signed in, `null` is returned.
 */
export const getCurrentUser = () => {
  return myFirebase.auth().currentUser;
}

/**
 * Returns document name with the extension stripped off.
 *
 * @param {string} docName
 * Document name
 */
export const getEffectiveDocumentName = (docName) => {
  docName = String(docName);
  return docName.replace(/\.pdf$/, "");
}

/**
 * Enum for access rights
 */
export const accessRights = {
  NO_ACCESS: 0,
  READ_ACCESS: 1,
  READ_EDIT_ACCESS: 2,
}
