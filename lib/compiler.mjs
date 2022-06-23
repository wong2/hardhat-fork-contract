import solc from "solc";

async function downloadCompiler(version) {
  return new Promise((resolve, reject) => {
    solc.loadRemoteVersion(version, (err, c) => {
      err ? reject(err) : resolve(c);
    });
  });
}

export { downloadCompiler };
