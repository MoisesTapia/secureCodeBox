<!--
SPDX-FileCopyrightText: 2020 iteratec GmbH

SPDX-License-Identifier: Apache-2.0
-->
<!--
.: IMPORTANT! :.
--------------------------
This file is generated automaticaly with `helm-docs` based on the following template files:
- ./.helm-docs/templates.gotmpl (general template data for all charts)
- ./chart-folder/.helm-docs.gotmpl (chart specific template data)

Please be aware of that and apply your changes only within those template files instead of this file.
Otherwise your changes will be reverted/overriden automaticaly due to the build process `./.github/workflows/helm-docs.yaml`
--------------------------
-->

<p align="center">
  <a href="https://opensource.org/licenses/Apache-2.0"><img alt="License Apache-2.0" src="https://img.shields.io/badge/License-Apache%202.0-blue.svg"></a>
  <a href="https://github.com/secureCodeBox/secureCodeBox/releases/latest"><img alt="GitHub release (latest SemVer)" src="https://img.shields.io/github/v/release/secureCodeBox/secureCodeBox?sort=semver"></a>
  <a href="https://owasp.org/www-project-securecodebox/"><img alt="OWASP Incubator Project" src="https://img.shields.io/badge/OWASP-Incubator%20Project-365EAA"></a>
  <a href="https://artifacthub.io/packages/search?repo=seccurecodebox"><img alt="Artifact HUB" src="https://img.shields.io/endpoint?url=https://artifacthub.io/badge/repository/seccurecodebox"></a>
  <a href="https://github.com/secureCodeBox/secureCodeBox/"><img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/secureCodeBox/secureCodeBox?logo=GitHub"></a>
  <a href="https://twitter.com/securecodebox"><img alt="Twitter Follower" src="https://img.shields.io/twitter/follow/securecodebox?style=flat&color=blue&logo=twitter"></a>
</p>

## What is OWASP secureCodeBox?

<p align="center">
  <img alt="secureCodeBox Logo" src="https://docs.securecodebox.io/img/Logo_Color.svg" width="250px">
</p>

_[OWASP secureCodeBox][scb-github]_ is an automated and scalable open source solution that can be used to integrate various *security vulnerability scanners* with a simple and lightweight interface. The _secureCodeBox_ mission is to support *DevSecOps* Teams to make it easy to automate security vulnerability testing in different scenarios.

With the _secureCodeBox_ we provide a toolchain for continuous scanning of applications to find the low-hanging fruit issues early in the development process and free the resources of the penetration tester to concentrate on the major security issues.

The secureCodeBox project is running on [Kubernetes](https://kubernetes.io/). To install it you need [Helm](https://helm.sh), a package manager for Kubernetes. It is also possible to start the different integrated security vulnerability scanners based on a docker infrastructure.

### Quickstart with secureCodeBox on kubernetes

You can find resources to help you get started on our [documentation website](https://docs.securecodebox.io) including instruction on how to [install the secureCodeBox project](https://docs.securecodebox.io/docs/getting-started/installation) and guides to help you [run your first scans](https://docs.securecodebox.io/docs/getting-started/first-scans) with it.

## What is Gitleaks?
Gitleaks is a free and open source tool for finding secrets in git repositories.
These secrets could be passwords, API keys, tokens, private keys or suspicious file names or
file extensions like *id_rsa*, *.pem*, *htpasswd*. Furthermore, gitleaks can scan your whole repository's history
with all commits up to the initial one.

To learn more about gitleaks visit <https://github.com/zricethezav/gitleaks>.

## Deployment
# Install HelmChart (use -n to configure another namespace)
The gitleaks `scanType` can be deployed via helm:

```bash
helm upgrade --install gitleaks secureCodeBox/gitleaks
```

## Scanner Configuration

For a complete overview of the configuration options checkout the
[Gitleaks documentation](https://github.com/zricethezav/gitleaks/wiki/Options).

The only mandatory parameters are:
- `-r`: The link to the repository you want to scan.
- `--access-token`: Only for non-public repositories.
- `--username` and `--password`: Only for non-public repositories.
- `--config-path`: The ruleset you want to use.

#### Ruleset

At this point we provide three rulesets which you can pass to the `--config-path` oprtion:

- `/home/config_all.toml`: Includes every rule.
- `/home/config_filenames_only.toml`: Gitleaks scans only file names and extensions.
- `/home/config_no_generics.toml`: No generic rules like searching for the word *password*. With this option you won't
find something like **password = Ej2ifDk2jfeo2**, but it will reduce resulting false positives.

If you like to provide your custom ruleset, you can create a configMap and mount it into
the scan. Checkout the examples for more information about providing your own gitleaks rules config.

## Contributing

Contributions are welcome and extremely helpful 🙌
Please have a look at [Contributing](./CONTRIBUTING.md)

## Community

You are welcome, please join us on... 👋

- [GitHub][scb-github]
- [Slack][scb-slack]
- [Twitter][scb-twitter]

secureCodeBox is an official [OWASP][scb-owasp] project.

## Requirements

Kubernetes: `>=v1.11.0-0`

**Do not** override the option `--report-format` or `--report`. It is already configured for automatic findings parsing.

## Additional Chart Configurations
### secureCodeBox extended GitLeaks Features

:::info
If you run gitleaks based on a scheduledScan (e.g. one scan per day) it would be enough to scan all git-commits since the last executed schedule.
Instead of scanning all commits in the complete git history every day it would save a lot of resources to scan only all commits of the last day.

_Problem is: This is a feature and configuration option gitleaks is currently not supporting._

That's why we created an [issue](https://github.com/zricethezav/gitleaks/issues/497) and a [pull request](https://github.com/zricethezav/gitleaks/pull/498) for that.
If you like the idea, please vote for our issue and PR.

If you already want to use our implementation (fork) of this feature you can use our [gitleaks forked docker image](https://hub.docker.com/r/securecodebox/gitleaks) instead of the gitleaks original image.
:::

```yaml
# Corresponding HelmChart Configuration
image:
  # image.repository -- Container Image to run the scan
  repository: docker.io/securecodebox/scanner-gitleaks
  # image.tag -- defaults to the charts version
  tag: v7.3.0
```

#### Deployment with extended GitLeaks
```bash
# Install HelmChart (use -n to configure another namespace)
helm upgrade --install gitleaks secureCodeBox/gitleaks \
  --set="image.repository=docker.io/securecodebox/scanner-gitleaks" \
  --set="image.tag=v7.3.0"
```

#### Additional (Fork) Scanner configuration options
```bash
--commit-since-duration= Scan commits more recent than a specific date expresed by an duration (now + duration). A duration string is a possibly signed sequence of decimal numbers, each
                               with optional fraction and a unit suffix, such as '300ms', '-1.5h' or '2h45m'. Valid time units are 'ns', 'us' (or 'µs'), 'ms', 's', 'm', 'h'.
--commit-until-duration= Scan commits older than a specific date expresed by an duration (now + duration). A duration string is a possibly signed sequence of decimal numbers, each with
                               optional fraction and a unit suffix, such as '300ms', '-1.5h' or '2h45m'. Valid time units are 'ns', 'us' (or 'µs'), 'ms', 's', 'm', 'h'.
```

#### Other useful options are:

- `--commit-since`: Scan commits more recent than a specific date. Ex: '2006-01-02' or '2006-01-02T15:04:05-0700' format.
- `--commit-until`: Scan commits older than a specific date. Ex: '2006-01-02' or '2006-01-02T15:04:05-0700' format.
- `--repo-config`: Load config from target repo. Config file must be ".gitleaks.toml" or "gitleaks.toml".

#### Finding format

It is not an easy task to classify the severity of the scans because we can't tell for sure if the finding is e.g. a real
or a testing password. Another issue is that the rate of false positives for generic rules can be very high. Therefore,
we tried to classify the severity of the finding by looking at the accuracy of the rule which detected it. Rules for AWS
secrets or Artifactory tokens are very precise, so they get a high severity. Generic rules on the other hand get a low
severity because the often produce false positives.

**Please keep in mind that findings with a low severity can be actually
very critical.**

#### Cascading Rules

If you want to scan multiple repositories from GitHub or gitlab automatically at once, you should
take a look at the cascading rules which get triggered by the **git-repo-scanner**.
For more information on how to use **git-repo-scanner** checkout the
[Readme](https://github.com/secureCodeBox/secureCodeBox/tree/main/scanners/git-repo-scanner).

For cascading scans on public GitHub repositories you don't need any credentials. For the gitlab
and private GitHub rules you need to provide an access token via environment. You could do that with
the following commands:

```bash
kubectl create secret generic github-access-token --from-literal="token=<YOUR-GITHUB-TOKEN>"
kubectl create secret generic gitlab-access-token --from-literal="token=<YOUR-GITLAB-TOKEN>"
```

For more information on how to use cascades take a look at
[Scanning Networks Example](https://docs.securecodebox.io/docs/how-tos/scanning-networks/)

## Values

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| cascadingRules.enabled | bool | `true` | Enables or disables the installation of the default cascading rules for this scanner |
| image.repository | string | `"docker.io/securecodebox/scanner-gitleaks"` | Container Image to run the scan |
| image.tag | string | `nil` | defaults to the app version |
| parseJob.ttlSecondsAfterFinished | string | `nil` | seconds after which the kubernetes job for the parser will be deleted. Requires the Kubernetes TTLAfterFinished controller: https://kubernetes.io/docs/concepts/workloads/controllers/ttlafterfinished/ |
| parserImage.repository | string | `"docker.io/securecodebox/parser-gitleaks"` | Parser image repository |
| parserImage.tag | string | defaults to the charts version | Parser image tag |
| scannerJob.backoffLimit | int | 3 | There are situations where you want to fail a scan Job after some amount of retries due to a logical error in configuration etc. To do so, set backoffLimit to specify the number of retries before considering a scan Job as failed. (see: https://kubernetes.io/docs/concepts/workloads/controllers/job/#pod-backoff-failure-policy) |
| scannerJob.env | list | `[]` | Optional environment variables mapped into each scanJob (see: https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/) |
| scannerJob.extraContainers | list | `[]` | Optional additional Containers started with each scanJob (see: https://kubernetes.io/docs/concepts/workloads/pods/init-containers/) |
| scannerJob.extraVolumeMounts | list | `[{"mountPath":"/home/","name":"gitleaks-config"}]` | Optional VolumeMounts mapped into each scanJob (see: https://kubernetes.io/docs/concepts/storage/volumes/) |
| scannerJob.extraVolumes | list | `[{"configMap":{"name":"gitleaks-config"},"name":"gitleaks-config"}]` | Optional Volumes mapped into each scanJob (see: https://kubernetes.io/docs/concepts/storage/volumes/) |
| scannerJob.resources | object | `{}` | CPU/memory resource requests/limits (see: https://kubernetes.io/docs/tasks/configure-pod-container/assign-memory-resource/, https://kubernetes.io/docs/tasks/configure-pod-container/assign-cpu-resource/) |
| scannerJob.securityContext | object | `{}` | Optional securityContext set on scanner container (see: https://kubernetes.io/docs/tasks/configure-pod-container/security-context/) |
| scannerJob.ttlSecondsAfterFinished | string | `nil` | seconds after which the kubernetes job for the scanner will be deleted. Requires the Kubernetes TTLAfterFinished controller: https://kubernetes.io/docs/concepts/workloads/controllers/ttlafterfinished/ |

## License

Code of secureCodeBox is licensed under the [Apache License 2.0][scb-license].

[scb-owasp]: https://www.owasp.org/index.php/OWASP_secureCodeBox
[scb-docs]: https://docs.securecodebox.io/
[scb-site]: https://www.securecodebox.io/
[scb-github]: https://github.com/secureCodeBox/
[scb-twitter]: https://twitter.com/secureCodeBox
[scb-slack]: https://join.slack.com/t/securecodebox/shared_invite/enQtNDU3MTUyOTM0NTMwLTBjOWRjNjVkNGEyMjQ0ZGMyNDdlYTQxYWQ4MzNiNGY3MDMxNThkZjJmMzY2NDRhMTk3ZWM3OWFkYmY1YzUxNTU
[scb-license]: https://github.com/secureCodeBox/secureCodeBox/blob/master/LICENSE
