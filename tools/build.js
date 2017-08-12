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
        .exec('git describe --tags', { silent: true })
        .stdout.trim()
        .slice(1);

    console.log(`Current version: v${lastVersion}`);
    const releaseIndex = readline.keyInSelect(
        versions.map(
            version => `${version} (v${semver.inc(lastVersion, version)})`,
        ),
        'Select which version to bump to',
    );

    let version = lastVersion;
    if (releaseIndex > -1) {
        version = semver.inc(lastVersion, versions[releaseIndex]);
    }

    const bumpAndPublish = readline.keyInYNStrict(
        `Bump package from v${lastVersion} to v${version} and publish?`,
    );
    if (bumpAndPublish) {
        shell.sed('-i', /0\.0\.0/, version, 'dist/package.json');

        shell.cd('dist');
        shell.exec('npm publish');
        fail('Failed to publish to npm');
        shell.cd('..');

        const tag = `v${version}`;
        shell.exec(`git tag ${tag}`);
        shell.exec(`git push origin ${tag}`);
        fail('Failed to push tag to git');
    }
}
