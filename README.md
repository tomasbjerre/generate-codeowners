# Generate Codeowners

[![NPM](https://img.shields.io/npm/v/generate-codeowners.svg?style=flat-square)](https://www.npmjs.com/package/generate-codeowners)

Original use case was to introduce `CODEOWNERS`-files within an organization with a large amount of repositories. The idea was to generate a file based on the Git-history.

```sh
Usage: generate-codeowners [options]

Options:
  -gd, --gitdir <dir>                    Directory with Git repository. (default: "generate-codeowners")
  -ii, --ignoreidentifiers <regexp>      Directory with Git repository. (default: ["noreply"])
  -s, --since <time>                     Same as Git:s <since> format. (default: "365.day.ago")
  -id, --identifier <committerEmailmail| Same as Git:s <since> format. (default: "committerEmailmail")
                    committerEmailUser|
                    committerName>
  -cf, --codeownersfile <name>           The CODEOWNERS-file (default: "CODEOWNERS")
  -d, --dryrun                           Do not change anything, just print what would be changed. (default: false)
  -v, --version                          Display version (default: false)
  -h, --help                             display help for command
```