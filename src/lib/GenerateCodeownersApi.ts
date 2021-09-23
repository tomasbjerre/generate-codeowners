import { writeFileSync } from 'fs';
const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function doExec(cmd: string, workingDir: string) {
  const { error, stdout, stderr } = await exec(cmd, {
    cwd: workingDir,
  });

  if (error) {
    throw Error(error);
  }

  if (stderr) {
    throw Error(stderr);
  }

  return stdout.trim();
}

export interface GenerateCodeownersApiOptions {
  workingDir: string;
  since: string;
  identifier: 'committerEmail' | 'committerEmailUser' | 'committerName';
  ignoreIdentifiers: string;
  codeownersFile: string;
  minimumCommitCount: number;
  maximumNumberOfCommitters: number;
}

export class GenerateCodeownersApi {
  constructor(private opts: GenerateCodeownersApiOptions) {}

  save(content: string) {
    writeFileSync(this.opts.codeownersFile, content + '\n', 'utf8');
  }

  async getCodeowners(): Promise<string> {
    return '* ' + (await this.getCommitters()).join(' ');
  }

  async getCommitters(): Promise<string[]> {
    const rows = await doExec(
      `git log --oneline --format="%ce|%cn" --since=${this.opts.since}`,
      this.opts.workingDir
    );

    const identifiers: string[] = rows
      .split(/\r?\n/)
      .map((row: string) => {
        const parts = row.split('|');
        if (this.opts.identifier == 'committerEmailUser') {
          return parts[0].substr(0, parts[0].indexOf('@'));
        }
        if (this.opts.identifier == 'committerEmail') {
          return parts[0];
        }
        if (this.opts.identifier == 'committerName') {
          return parts[1];
        }
      })
      .filter(
        (identifier: string) =>
          !new RegExp(this.opts.ignoreIdentifiers).test(identifier)
      );

    const commitsPerIdentifier = {} as Record<string, number>;
    identifiers.forEach((identifier: string) => {
      commitsPerIdentifier[identifier] =
        (commitsPerIdentifier[identifier] || 0) + 1;
    });

    const sorted = Object.keys(commitsPerIdentifier).sort(function (a, b) {
      return commitsPerIdentifier[b] - commitsPerIdentifier[a];
    });

    return sorted
      .filter(
        (identifier) =>
          commitsPerIdentifier[identifier] >= this.opts.minimumCommitCount
      )
      .slice(0, this.opts.maximumNumberOfCommitters);
  }
}
