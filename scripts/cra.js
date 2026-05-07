const { spawn } = require("child_process");

const subcommand = process.argv[2];
const forwardedArgs = process.argv.slice(3);

if (!subcommand) {
  process.stderr.write(
    "Usage: node scripts/cra.js <start|build|test> [...args]\n"
  );
  process.exit(1);
}

const allowed = new Set(["start", "build", "test"]);
if (!allowed.has(subcommand)) {
  process.stderr.write(
    `Unsupported command "${subcommand}". Use start, build, or test.\n`
  );
  process.exit(1);
}

let reactScriptsEntry;
try {
  reactScriptsEntry = require.resolve(`react-scripts/scripts/${subcommand}`);
} catch (error) {
  process.stderr.write(
    `Could not resolve react-scripts entry for "${subcommand}".\n`
  );
  process.stderr.write(
    "Try running `npm install` and ensure react-scripts is installed.\n"
  );
  process.exit(1);
}

function getOpenSslMajor() {
  const version = process.versions && process.versions.openssl;
  if (!version) return null;
  const major = Number.parseInt(String(version).split(".")[0], 10);
  return Number.isFinite(major) ? major : null;
}

const opensslMajor = getOpenSslMajor();
const preferLegacyProvider = opensslMajor !== null && opensslMajor >= 3;

let currentChild = null;

function wireSignals(child) {
  const forward = (signal) => {
    if (child && !child.killed) child.kill(signal);
  };
  process.on("SIGINT", () => forward("SIGINT"));
  process.on("SIGTERM", () => forward("SIGTERM"));
}

function run(withLegacyProvider) {
  const nodeArgs = [];
  if (withLegacyProvider) nodeArgs.push("--openssl-legacy-provider");
  nodeArgs.push(reactScriptsEntry, ...forwardedArgs);

  const child = spawn(process.execPath, nodeArgs, {
    stdio: ["inherit", "inherit", "pipe"],
  });
  currentChild = child;
  wireSignals(child);

  let stderrBuffer = "";
  child.stderr.on("data", (chunk) => {
    process.stderr.write(chunk);
    if (stderrBuffer.length < 8192) stderrBuffer += chunk.toString();
  });

  child.on("error", (error) => {
    if (withLegacyProvider) {
      run(false);
      return;
    }
    process.stderr.write(String(error));
    process.stderr.write("\n");
    process.exit(1);
  });

  child.on("close", (code, signal) => {
    const stderr = stderrBuffer.toLowerCase();
    const legacyFlagRejected =
      stderr.includes("bad option: --openssl-legacy-provider") ||
      stderr.includes("unknown option") ||
      stderr.includes("--openssl-legacy-provider is not allowed");

    if (withLegacyProvider && legacyFlagRejected) {
      run(false);
      return;
    }

    if (signal) {
      process.kill(process.pid, signal);
      return;
    }
    process.exit(code ?? 0);
  });
}

run(preferLegacyProvider);

