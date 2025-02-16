---
title: "Cascading Scans"
category: "hook"
type: "processing"
state: "released"
usecase: "Cascading Scans based declarative Rules."
---

<!-- end -->

## Deployment

Installing the Cascading Scans hook will add a ReadOnly Hook to your namespace which looks for matching _CascadingRules_ in the namespace and start the according scans.

```bash
helm upgrade --install dssh secureCodeBox/declarative-subsequent-scans
```

### Verification
```bash
kubectl get ScanCompletionHooks
NAME   TYPE       IMAGE
dssh   ReadOnly   docker.io/securecodebox/hook-declarative-subsequent-scans:latest
```

## CascadingScan Rules
The CascadingRules are included directly in each helm chart of the individual scanners.
There is a configuration option `cascadingRules.enabled` for each scanner to prevent this inclusion.

```bash
# Check your CascadingRules
kubectl get CascadingRules
NAME             STARTS              INVASIVENESS   INTENSIVENESS
https-tls-scan   sslyze              non-invasive   light
imaps-tls-scan   sslyze              non-invasive   light
nikto-http       nikto               non-invasive   medium
nmap-smb         nmap                non-invasive   light
pop3s-tls-scan   sslyze              non-invasive   light
smtps-tls-scan   sslyze              non-invasive   light
ssh-scan         ssh-scan            non-invasive   light
zap-http         zap-baseline-scan   non-invasive   medium
```

## Starting a cascading Scan
When you start a normal Scan, no CascadingRule will be applied. To use a _CascadingRule_ the scan must be marked to allow cascading rules.
This is implemented using kubernetes label selectors, meaning that scans mark the classes of scans which are allowed to be cascaded by the current one.

### Example
```yaml
cat <<EOF | kubectl apply -f -
apiVersion: "execution.securecodebox.io/v1"
kind: Scan
metadata:
  name: "example.com"
spec:
  scanType: nmap
  parameters:
    - -p22,80,443
    - example.com
  cascades:
    matchLabels:
      securecodebox.io/intensive: light
EOF
```

This Scan will use all CascadingRules which are labeled with a "light" intensity.
You can lookup which CascadingRules this selects by running:

```bash
kubectl get CascadingRules -l "securecodebox.io/intensive=light"
NAME             STARTS     INVASIVENESS   INTENSIVENESS
https-tls-scan   sslyze     non-invasive   light
imaps-tls-scan   sslyze     non-invasive   light
nmap-smb         nmap       non-invasive   light
pop3s-tls-scan   sslyze     non-invasive   light
smtps-tls-scan   sslyze     non-invasive   light
ssh-scan         ssh-scan   non-invasive   light
```

The label selectors also allow the more powerful matchExpressions selectors:

```yaml
cat <<EOF | kubectl apply -f -
apiVersion: "execution.securecodebox.io/v1"
kind: Scan
metadata:
  name: "example.com"
spec:
  scanType: nmap
  parameters:
    - -p22,80,443
    - example.com
  cascades:
    # Using matchExpressions instead of matchLabels
    matchExpressions:
    - key: "securecodebox.io/intensive"
      operator: In
      # This select both light and medium intensity rules
      values: [light, medium]
EOF
```

This selection can be replicated in kubectl using:

```bash
kubectl get CascadingRules -l "securecodebox.io/intensive in (light,medium)"
NAME             STARTS              INVASIVENESS   INTENSIVENESS
https-tls-scan   sslyze              non-invasive   light
imaps-tls-scan   sslyze              non-invasive   light
nikto-http       nikto               non-invasive   medium
nmap-smb         nmap                non-invasive   light
pop3s-tls-scan   sslyze              non-invasive   light
smtps-tls-scan   sslyze              non-invasive   light
ssh-scan         ssh-scan            non-invasive   light
zap-http         zap-baseline-scan   non-invasive   medium
```

## Chart Configuration

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| hookJob.ttlSecondsAfterFinished | string | `nil` | Seconds after which the kubernetes job for the hook will be deleted. Requires the Kubernetes TTLAfterFinished controller: https://kubernetes.io/docs/concepts/workloads/controllers/ttlafterfinished/ |
| image.repository | string | `"docker.io/securecodebox/declarative-subsequent-scans"` | Hook image repository |
| image.tag | string | defaults to the charts version | The image Tag defaults to the charts version if not defined. |
