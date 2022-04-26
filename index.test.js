const aws = require("./aws");
const docker = require("./docker");
const exec = require("@actions/exec");

test("ecr getToken fake region throw err", async () => {
  await expect(aws.getAuthToken("fake-region")).rejects.toThrow(
    "Inaccessible host: `api.ecr.fake-region.amazonaws.com' at port `undefined'. This service may not be available in the `fake-region' region."
  );
});

test("ecr getToken ok", async () => {
  await aws.getAuthToken("eu-west-1");
});

test("docker login", async () => {
  const { username, password, registryUri } = await aws.getAuthToken(
    "eu-west-1"
  );
  await docker.dockerLogin(username, password, registryUri);
});

jest.setTimeout(30000);
test("docker tag", async () => {
  await exec.exec("docker", [
    "build",
    "-f",
    "./.tests/Dockerfile",
    "-t",
    "test:latest",
    "."
  ]);
  await docker.dockerTag("test2:latest", "test:latest");
});

