import { GenerateCodeownersApi } from '../lib/GenerateCodeownersApi';
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
    'Directory with Git repository.',
    commaSeparatedList,
    ['noreply']
  )
  .option('-s, --since <time>', 'Same as Git:s <since> format.', '365.day.ago')
  .option(
    '-id, --identifier <committerEmailmail|committerEmailUser|committerName>',
    'Same as Git:s <since> format.',
    'committerEmailmail'
  )
  .option('-cf, --codeownersfile <name>', 'The CODEOWNERS-file', 'CODEOWNERS')
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
const api = new GenerateCodeownersApi({
  workingDir: options.gitdir,
  since: options.since,
  identifier: options.identifier,
  ignoreIdentifiers: options.ignoreidentifiers,
  codeownersFile: options.codeownersfile,
});
api.getCodeowners().then((out) => {
  if (options.dryrun) {
    console.log(`CODEOWNERS would contain:\n\n`);
    console.log(out);
    console.log(`\n\n`);
  } else {
    console.log(`Writing ${program.codeownersfile}`);
    api.save(out);
  }
});