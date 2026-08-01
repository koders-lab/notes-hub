---
publish: true
---

Preventing a malicious pull request from compromising your cloud network when using public self-hosted runners requires

- strict network isolation,
- ephemeral compute instances and
- mandatory manual workflow approvals.

Avoid running persistent self-hosted runners directly on public repositories if possible. \[1]

# Network and Infrastructure Isolation

> [!NOTE]+ Zero internal access:
> Place runners in a dedicated, firewalled Virtual Private Cloud (VPC) with zero routing or peering to your corporate network, production environments, or internal databases. \[1, 2, 3, 4]

> [!NOTE]+ Strict egress filtering:
> Block all outbound traffic by default, allowing only explicit outbound ports/IPs required for package downloads or reporting back to the CI provider. \[5, 6]
>
> > Restrict internet access. Use a NAT Gateway or firewall to whitelist only required package registries (e.g., npm, PyPI) and GitHub IPs

> [!NOTE]+ Network micro-segmentation:
>
> > Place runners in an isolated VPC subnet. Block all internal traffic to other cloud services using security groups or network policies.

> [!NOTE]+ Ephemeral architecture:
> Spin up clean runner instances (such as short-lived container instances or VMs) for a single job and automatically destroy them immediately after completion. \[1, 7]
>
> > Deploy tools like **Actions Runner Controller (ARC)** on Kubernetes or ephemeral cloud VMs. They spin up for one job and destroy themselves immediately

> [!NOTE]+ Disable host access:
> Run the actions runner inside an unprivileged container. Never map the host's Docker socket (`/var/run/docker.sock`) into the runner container

# Access Control and Configuration

> [!NOTE]+ Require manual approval:
> Configure repository settings to require explicit manual approval for any workflow triggered by first-time contributors or external fork pull requests. \[1, 5]
>
> > Set **Repository Settings** > **Actions** > **General** to require approval for all outside contributors

> [!NOTE]+ Least privilege tokens:
> Enforce read-only default permissions for the orchestrator token (`GITHUB_TOKEN`) and avoid exposing long-lived cloud credentials or secrets to public fork builds. \[3, 8, 9]
>
> > Change the default `GITHUB_TOKEN` permissions to **Read-only** under the workflow settings

> [!NOTE]+ No root execution:
> Ensure runner daemon processes and container tasks never run with `root` or `sudo` privileges on the host machine. \[7, 10]
>
> > Bind sensitive deployment targets to a GitHub **Environment** that mandates a manual review before execution.
