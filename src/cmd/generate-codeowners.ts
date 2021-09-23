#!/usr/bin/env node

import {
  GenerateCodeownersApi,
  GenerateCodeownersApiOptions,
} from '../lib/GenerateCodeownersApi';
import { Command } from 'commander';

function commaSeparatedList(value: string) {
  return value.split(',');
}

const program = new Command()
  .option(
    '-gd, --gitdir <dir>',
    'Directory with Git repository.',
    process.cwd()
  )
  .option(
    '-ii, --ignoreidentifiers <regexp>',
    'Regexp to test against identifer.',
    commaSeparatedList,
    ['noreply']
  )
  .option('-s, --since <time>', 'Same as Git:s <since> format.', '365.day.ago')
  .option(
    '-id, --identifier <committerEmailmail|committerEmailUser|committerName>',
    'What to add as identifer.',
    'committerEmailmail'
  )
  .option('-cf, --codeownersfile <name>', 'The CODEOWNERS-file', 'CODEOWNERS')
  .option(
    '-micc, --minimumcommitcount <number>',
    'Ignore committers with less commits',
    '0'
  )
  .option(
    '-manc, --maximumnumberofcommitters <number>',
    'Include most active committers',
    '100'
  )
  .option(
    '-d, --dryrun',
    'Do not change anything, just print what would be changed.',
    false
  )
  .option('-v, --version', 'Display version', false)
  .parse(process.argv);

const options = program.opts();

if (options.version) {
  const pkg = require('../../package.json');
  console.log(`${pkg.name}@${pkg.version}`);
  process.exit(0);
}

const opts = {
  workingDir: options.gitdir,
  since: options.since,
  identifier: options.identifier,
  ignoreIdentifiers: options.ignoreidentifiers,
  codeownersFile: options.codeownersfile,
  minimumCommitCount: parseInt(options.minimumcommitcount),
  maximumNumberOfCommitters: parseInt(options.maximumnumberofcommitters),
} as GenerateCodeownersApiOptions;

console.log(`Creating ${program.codeownersfile} with:\n\n`, opts, '\n');

const api = new GenerateCodeownersApi(opts);

api.getCodeowners().then((out) => {
  if (options.dryrun) {
    console.log(`${program.codeownersfile} would contain:\n\n`);
    console.log(out);
    console.log(`\n\n`);
  } else {
    console.log(`Writing ${program.codeownersfile}`);
    api.save(out);
  }
});
