

---
title: "Amass"
category: "scanner"
type: "Network"
state: "released"
appVersion: 'v3.13'
usecase: "Subdomain Enumeration Scanner"
---

![owasp logo](https://owasp.org/assets/images/logo.png)

The OWASP Amass Project has developed a tool to help information security professionals perform network mapping of attack surfaces and perform external asset discovery using open source information gathering and active reconnaissance techniques. To learn more about the Amass scanner itself visit [OWASP_Amass_Project] or [Amass GitHub].

<!-- end -->

<p align=„center“>
  <img alt=„secureCodeBox Logo“ src=„./docs/resources/securecodebox-logo.svg“ width=„500px“>
  <img alt=„secureCodeBox Logo“ src=„https://owasp.org/assets/images/logo.png“ width=„200px“>
</p>

<p align=„center“>
  <a href=„https://opensource.org/licenses/Apache-2.0“><img alt=„License Apache-2.0“ src=„https://img.shields.io/badge/License-Apache%202.0-blue.svg“></a>
  <a href=„https://github.com/secureCodeBox/secureCodeBox/releases/latest“><img alt=„GitHub release (latest SemVer)“ src=„https://img.shields.io/github/v/release/secureCodeBox/secureCodeBox?sort=semver“></a>
  <a href=„https://owasp.org/www-project-securecodebox/„><img alt=„OWASP Incubator Project“ src=„https://img.shields.io/badge/OWASP-Incubator%20Project-365EAA“></a>
  <a href=„https://artifacthub.io/packages/search?repo=seccurecodebox“><img alt=„Artifact HUB“ src=„https://img.shields.io/endpoint?url=https://artifacthub.io/badge/repository/seccurecodebox“></a>
  <a href=„https://twitter.com/securecodebox“><img alt=„Twitter Follower“ src=„https://img.shields.io/twitter/follow/securecodebox?style=flat&color=blue&logo=twitter“></a>
</p>
<p align=„center“>
  <a href=„https://github.com/secureCodeBox/secureCodeBox/actions?query=workflow%3ACI“><img alt=„Build“ src=„https://github.com/secureCodeBox/secureCodeBox/workflows/CI/badge.svg“></a>
  <a href=„https://codeclimate.com/github/secureCodeBox/secureCodeBox/maintainability“><img alt=„Maintainability“  src=„https://api.codeclimate.com/v1/badges/0c41659fde992429bfed/maintainability“ /></a>
  <a href=„https://codeclimate.com/github/secureCodeBox/secureCodeBox/test_coverage“><img alt=„Test Coverage“ src=„https://api.codeclimate.com/v1/badges/0c41659fde992429bfed/test_coverage“ /></a>
  <a href=„https://snyk.io/test/github/secureCodeBox/secureCodeBox/„><img alt=„Known Vulnerabilities“ src=„https://snyk.io/test/github/secureCodeBox/secureCodeBox/badge.svg“></a>
  <a href=„https://app.fossa.com/projects/git%2Bgithub.com%2FsecureCodeBox%2FsecureCodeBox?ref=badge_shield“ alt=„FOSSA Status“><img src=„https://app.fossa.com/api/projects/git%2Bgithub.com%2FsecureCodeBox%2FsecureCodeBox.svg?type=shield“/></a>
</p>

## Deployment

The AMASS scanType can be deployed via helm:

```bash
helm upgrade --install amass secureCodeBox/amass
```

## Scanner Configuration

The following security scan configuration example are based on the [Amass User Guide], please take a look at the original documentation for more configuration examples.

- The most basic use of the tool for subdomain enumeration: `amass enum -d example.com`
- Typical parameters for DNS enumeration: `amass enum -v -src -ip -brute -min-for-recursive 2 -d example.com`

Special command line options:

- Disable generation of altered names `amass enum -noalts -d example.com`
- Turn off recursive brute forcing `amass enum -brute -norecursive -d example.com`
- Disable saving data into a local database `amass enum -nolocaldb -d example.com`
- Domain names separated by commas (can be used multiple times) `amass enum -d example.com`

## Chart Configuration

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| image.repository | string | `"caffix/amass"` | Container Image to run the scan |
| image.tag | string | `nil` | defaults to the charts appVersion |
| parseJob.ttlSecondsAfterFinished | string | `nil` | seconds after which the kubernetes job for the parser will be deleted. Requires the Kubernetes TTLAfterFinished controller: https://kubernetes.io/docs/concepts/workloads/controllers/ttlafterfinished/ |
| parserImage.repository | string | `"docker.io/securecodebox/parser-amass"` | Parser image repository |
| parserImage.tag | string | defaults to the charts version | Parser image tag |
| scannerJob.backoffLimit | int | 3 | There are situations where you want to fail a scan Job after some amount of retries due to a logical error in configuration etc. To do so, set backoffLimit to specify the number of retries before considering a scan Job as failed. (see: https://kubernetes.io/docs/concepts/workloads/controllers/job/#pod-backoff-failure-policy) |
| scannerJob.env | list | `[]` | Optional environment variables mapped into each scanJob (see: https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/) |
| scannerJob.extraContainers | list | `[]` | Optional additional Containers started with each scanJob (see: https://kubernetes.io/docs/concepts/workloads/pods/init-containers/) |
| scannerJob.extraVolumeMounts | list | `[{"mountPath":"/amass/output/config.ini","name":"amass-config","subPath":"config.ini"}]` | Optional VolumeMounts mapped into each scanJob (see: https://kubernetes.io/docs/concepts/storage/volumes/) |
| scannerJob.extraVolumes | list | `[{"configMap":{"name":"amass-config"},"name":"amass-config"}]` | Optional Volumes mapped into each scanJob (see: https://kubernetes.io/docs/concepts/storage/volumes/) |
| scannerJob.resources | object | `{}` | CPU/memory resource requests/limits (see: https://kubernetes.io/docs/tasks/configure-pod-container/assign-memory-resource/, https://kubernetes.io/docs/tasks/configure-pod-container/assign-cpu-resource/) |
| scannerJob.securityContext | object | `{}` | Optional securityContext set on scanner container (see: https://kubernetes.io/docs/tasks/configure-pod-container/security-context/) |
| scannerJob.ttlSecondsAfterFinished | string | `nil` | seconds after which the kubernetes job for the scanner will be deleted. Requires the Kubernetes TTLAfterFinished controller: https://kubernetes.io/docs/concepts/workloads/controllers/ttlafterfinished/ |

## License

Code of secureCodeBox is licensed under the [Apache License 2.0][scb-license].

## Contributing

Contributions are welcome and extremely helpful 🙌
Please have a look at [Contributing](./CONTRIBUTING.md)

## Community

You are welcome, please join us on... 👋

- [GitHub][scb-github]
- [Slack][scb-slack]
- [Twitter][scb-twitter]

secureCodeBox is an official [OWASP][owasp] project.

[owasp_amass_project]: https://owasp.org/www-project-amass/
[amass github]: https://github.com/OWASP/Amass
[amass user guide]: https://github.com/OWASP/Amass/blob/master/doc/user_guide.md
