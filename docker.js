const core = require("@actions/core");
const exec = require("@actions/exec");

const dockerLogin = async function (username, password, registryUri) {
  core.info(`Login to registry ${registryUri}`);

  let doLoginStdout = "";
  let doLoginStderr = "";
  const options = {
    silent: true,
    ignoreReturnCode: true,
    listeners: {
      stdout: (data) => {
        doLoginStdout += data.toString();
      },
      stderr: (data) => {
        doLoginStderr += data.toString();
      },
    },
  };
  const exitCode = await exec.exec(
    "docker",
    ["login", "-u", username, "-p", password, registryUri],
    options
  );

  if (exitCode != 0) {
    core.debug(doLoginStdout);
    throw new Error("Could not login: " + doLoginStderr);
  }
  core.info(doLoginStdout);
  return registryUri;
};

const dockerTag = async function (
  imageFullName,
  originalImage
) {

  let out = "";
  let error = "";

  const options = {};
  options.silent = true;
  options.listeners = {
    stdout: (data) => {
      out += data.toString();
    },
    stderr: (data) => {
      error += data.toString();
    },
  };

  await exec.exec("docker", [
    "tag",
    originalImage,
    imageFullName,
    contextPath,
  ]);
  core.info(out);
  if (error) throw error;
};

const dockerPush = async function (imageFullName) {
  await exec.exec("docker", ["push", imageFullName]);
};

exports.dockerLogin = dockerLogin;
exports.dockerTag = dockerTag;
exports.dockerPush = dockerPush;
