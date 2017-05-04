// ReactJS
const React = require("react");
// Utils
const {
  isGrip,
  safeObjectLink,
  wrapRender,
} = require("./rep-utils");
const { MODE } = require("./constants");

/**
 * Renders Error objects.
 */
ErrorRep.propTypes = {
  key: React.PropTypes.any,
  object: React.PropTypes.object.isRequired,
  // @TODO Change this to Object.values once it's supported in Node's version of V8
  mode: React.PropTypes.oneOf(Object.keys(MODE).map(key => MODE[key])),
  objectLink: React.PropTypes.func,
};

function ErrorRep(props) {
  let object = props.object;
  let preview = object.preview;
  let name = preview && preview.name
    ? preview.name
    : "Error";

  let content = props.mode === MODE.TINY
    ? name
    : `${name}: ${preview.message}`;

  if (preview.stack && props.mode !== MODE.TINY) {
    /*
      * Since Reps are used in the JSON Viewer, we can't localize
      * the "Stack trace" label (defined in debugger.properties as
      * "variablesViewErrorStacktrace" property), until Bug 1317038 lands.
      */
    content = `${content}\nStack trace:\n${preview.stack}`;
  }

  return safeObjectLink(props, {
    key: props.key,
    className: "objectBox-stackTrace"
  }, content);
}

// Registration
function supportsObject(object, type) {
  if (!isGrip(object)) {
    return false;
  }
  return (object.preview && type === "Error");
}

// Exports from this module
module.exports = {
  rep: wrapRender(ErrorRep),
  supportsObject,
};
