const CAUSE_ERROR = new Error("request params error");

export const validateEmail = (email) => {
  const EMAIL_REGEX =
    /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

  if (EMAIL_REGEX.test(email)) {
    return;
  }

  throw new Error("Invalid Email : Must provide a valid email address.", {
    cause: CAUSE_ERROR,
  });
};

export const validateUsername = (username) => {
  const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;

  if (USER_REGEX.test(username)) {
    return;
  }

  throw new Error(
    "Invalid Username : Must have length of 4 to 24 characters, must begin with a letter. Only letters, numbers, underscores, hypens are allowed.",
    {
      cause: CAUSE_ERROR,
    }
  );
};

export const validatePassword = (password) => {
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,23}$/;

  if (PWD_REGEX.test(password)) {
    return;
  }

  throw new Error(
    "Invalid Password : Must have length of 8 to 24 characters, must include uppercase and lowercase letters, a number and a special character. Allowed special characters (!@#$%)",
    { cause: CAUSE_ERROR }
  );
};

export const validateParameters = (
  obj,
  mandatoryParams,
  optionalParams = []
) => {
  const keys = Object.keys(obj);

  const missingParams = mandatoryParams.reduce(
    (acc, curr) => (!keys.includes(curr) ? [...acc, curr] : acc),
    []
  );

  const invalidParams = keys.reduce(
    (acc, curr) =>
      ![...mandatoryParams, ...optionalParams].includes(curr)
        ? [...acc, curr]
        : acc,
    []
  );

  if (missingParams.length) {
    throw new Error(
      `Missing request parameter${
        missingParams.length === 1 ? "" : "s"
      } ${missingParams.join(", ")}.`,
      {
        cause: CAUSE_ERROR,
      }
    );
  }

  if (invalidParams.length) {
    throw new Error(
      `Invalid request parameter${
        invalidParams.length === 1 ? "" : "s"
      } ${invalidParams.join(", ")}.`,
      {
        cause: CAUSE_ERROR,
      }
    );
  }
};

export const validateString = (obj) => {
  const key = Object.keys(obj)[0];
  const value = Object.values(obj)[0].trim();

  if (value !== "") {
    return;
  }

  throw new Error(`Blank value at request parameter ${key}`, {
    cause: CAUSE_ERROR,
  });
};

export const validateOneOfParameters = (obj, validateParameters) => {
  const keys = Object.keys(obj);
  const value = Object.values(obj);

  if (keys.length !== 1) {
    throw new Error(`Multiple or no query parameters provided`, {
      cause: CAUSE_ERROR,
    });
  }

  if (!validateParameters.includes(keys[0])) {
    throw new Error(`Invalid query parameter provided ${keys[0]}`, {
      cause: CAUSE_ERROR,
    });
  }

  return { [keys[0]]: value[0] };
};
