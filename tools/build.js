const shell = require('shelljs');
const semver = require('semver');
const readline = require('readline-sync');

function fail(message) {
    if (shell.error()) {
        shell.rm('-rf', 'dist');
        shell.echo(`Error: ${message}. Exiting.`);
        shell.exit(1);
    }
}

const versions = [
    'major',
    'premajor',
    'minor',
    'preminor',
    'patch',
    'prepatch',
    'prerelease',
];
const publish = true;

/**
 * Compile typescript
 */
shell.rm('-rf', 'dist');
shell.exec('tsc');
fail('TypeScript transilation failed');

shell.exec('npm run test:only');
fail('Tests failed');

/**
 * Copy files
 */
['package.json', '.npmignore', 'README.md', 'LICENSE.md'].forEach(file =>
    shell.cp(file, 'dist/'),
);

if (publish) {
    /**
     * Determine new version
     */
    const lastVersion = shell
        .exec('git tag -l v*.*.*', { silent: true })
        .stdout.trim()
        .split('\n')[0]
        .trim()
        .slice(1);

    shell.echo(`Current version: v${lastVersion}`);
    const releaseIndex = readline.keyInSelect(
        versions.map(
            version => `${version} (v${semver.inc(lastVersion, version)})`,
        ),
        'Select which version to bump to',
    );

    if (releaseIndex == -1) {
        shell.exit(0);
    }

    let version = semver.inc(lastVersion, versions[releaseIndex]);

    const bumpAndPublish = readline.keyInYNStrict(
        `Bump package from v${lastVersion} to v${version} and publish?`,
    );
    if (bumpAndPublish) {
        shell.sed('-i', /0\.0\.0/, version, 'dist/package.json');

        let npmTag = 'latest';
        if (versions[releaseIndex].startsWith('pre')) {
            npmTag = 'beta';
        }

        shell.cd('dist');
        shell.exec(`npm publish --tag ${npmTag}`);
        fail('Failed to publish to npm');
        shell.cd('..');

        const tag = `v${version}`;
        shell.exec(`git tag ${tag}`);
        shell.exec(`git push origin ${tag}`);
        fail('Failed to push tag to git');
    }
}
