import tasks from './lib/tasks.js';
import { read, write, loadTemplate } from './lib/utils.js';
import { join, basename } from 'path';
import { valid as validSemver } from 'semver';
import template from 'lodash/template';
import uuid from 'uuid/v4';

const currentDirectory = process.cwd();
const optionsURL = 'https://github.com/vandeurenglenn/simple-inno-script/README.md#options';
const getPackageOptions = async () => {
  let pkg = await read(join(currentDirectory, 'package.json'));
  pkg = JSON.parse(pkg.toString());
  if (pkg.simpleInno && !pkg.simpleInno.url) pkg.simpleInno.url = pkg.homepage;
  if (pkg.simpleInno && !pkg.simpleInno.name) pkg.simpleInno.name = pkg.name;
  if (pkg.simpleInno && !pkg.simpleInno.version) pkg.simpleInno.version = pkg.version;
  if (pkg.simpleInno && !pkg.simpleInno.author) pkg.simpleInno.author = pkg.author;
  return pkg.simpleInno;
}

const throwExpected = (expected, name = currentDirectory) => `Expected ${expected} to be defined, but nothing found for ${name}\ncheckout ${optionsURL} for more information.`;

const defaultOptions = {
  signTool: 'SignTool=signtool',
  desktopIcon: true,
  quickLaunchIcon: true,
  runAfterInstall: true,
  hideTerminal: true,
  compressLevel: 'ultra64'
}

const templify = async (target, options) => {
  let templateResult = await loadTemplate(target);
  templateResult = template(templateResult);
  const script = templateResult(options);
  if (options.write) await write(options.write);
  return script;
}

const transformAndValidateOptions = async options => {
  options = { ...defaultOptions, ...options };

  if (!options) throw throwExpected('options', options.name);

  if (!options.name) throw throwExpected('options.name');

  if (!options.version) throw throwExpected('options.version');

  if (!validSemver(options.version)) throw 'Expected version to be a valid Semver';

  if (!options.sourceDir && !options.sourceDirX86) throw throwExpected('sourceDir or sourceDirX86', options.name);

  if (options.sourceDir) {
    if (!Array.isArray(options.sourceDir)) options.sourceDir = [options.sourceDir];
    let i = 0;
    const sources = options.sourceDir;
    for (const path of sources) {
      if (i === 0) options.sourceDir = path;
      else options.sourceDirX86 = path;
      ++i;
    }
    options.sourceDir = tasks.sourceDir(options.sourceDir, options.name)
  } else options.sourceDir = '';

  if (options.sourceDirX86) options.sourceDirX86 = tasks.sourceDirX86(options.sourceDirX86, options.name);
  else options.sourceDirX86 = '';

  if (!options.outputDir && options.output) {
    const original = options.output;
    options.output = basename(options.output);
    options.outputDir = original.replace(basename, '');
  } else if (!options.outputDir && !options.output) {
    options.outputDir = currentDirectory;
  }
  if (!options.output) options.output = `${options.name}-setup`;

  if (options.include) {
    let string = '';
    if (!Array.isArray(options.include)) options.include = [options.include];
    for (const included of options.include) {
      string += included;
    }
    options.include = string;
  } else {
    options.include = '';
  }

  if (options.hideTerminal && !options.vbsPath) {
    options.vbsPath = join(__dirname, 'templates', 'vbs.vbs');
  }

  if (options.vbsPath) options.vbs = `Source: "${options.vbsPath}"; DestDir: "{pf}/${options.name}"; DestName: "${options.name}.vbs"; Flags: solidbreak`;
  else options.vbs = '';

  if (!options.signTool) options.signTool = '';

  if (options.desktopIcon) options.desktopIcon = tasks.desktopIcon(options.name);
  else options.desktopIcon = '';

  if (options.quickLaunchIcon) options.quickLaunchIcon = tasks.quickLaunchIcon(options.name);
  else options.quickLaunchIcon = '';

  if (options.runAfterInstall) options.runAfterInstall = tasks.runAfterInstall(options.name);
  else options.runAfterInstall = '';

  if (typeof options.url === 'string') {
    options.publisherURL = options.url;
    options.supportURL = options.url;
    options.updatesURL = options.url;
  } else {
    options.publisherURL = options.url.publisherURL;
    options.supportURL = options.url.supportURL;
    options.updatesURL = options.url.updatesURL;
  }

  if (!options.id) options.id = uuid();

  delete options.url;

  options.icons = tasks.icons();
  return options;
}

export default async options => {
  let script;
  try {
    if (!options) options = await getPackageOptions();
    options = await transformAndValidateOptions(options);
    script = await templify('x86-x64', options);
  } catch (e) {
    throw e;
  }
  return { script, write };
}
