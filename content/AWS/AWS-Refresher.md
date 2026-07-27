---
publish: true
title: AWS — Interview Refresher
tags:
  - aws
  - refresher
  - flashcards
---

> [!abstract] Quick brush-up. Anchored to what's on your resume (Lambda, VPC, IAM, SQS/SNS, RDS).

## Compute

> [!question]- EC2 vs Lambda vs Beanstalk?
> **EC2** = raw VMs (you manage). **Lambda** = serverless functions (event-driven, pay-per-invoke, no servers). **Beanstalk** = PaaS (deploy an app, it manages EC2/scaling/LB for you).

> [!danger]- Lambda cold start (your story — know cold)
> New execution env must init (for Spring Boot, slow context startup) → adds latency + can hit ~10s init timeout. **Fixes:** slim the JAR, **Provisioned Concurrency** (pre-warmed envs), **SnapStart** (Java snapshot restore). _(It's **SAM** not SAML.)_

## Networking & security

> [!question]- What is a VPC?
> Your isolated virtual network in AWS — subnets (public/private), route tables, security groups (instance firewall), NACLs (subnet firewall).

> [!question]- IAM — roles vs policies vs users?
> **Policy** = permissions document (JSON). **Role** = assumable identity with policies (services use roles, e.g. Lambda→S3). **User** = a person/app identity. Principle: **least privilege**.

## Messaging & storage

> [!question]- SQS vs SNS?
> **SQS** = queue (point-to-point, one consumer pulls). **SNS** = pub/sub (fan-out to many subscribers). Common combo: **SNS→SQS fan-out**.

> [!question]- S3 basics?
> Object storage, 11 9's durability, buckets/keys, storage classes (Standard/IA/Glacier), versioning, lifecycle policies.

> [!question]- RDS vs DynamoDB?
> **RDS** = managed relational (Postgres/MySQL/Oracle). **DynamoDB** = managed NoSQL key-value, single-digit-ms, scales huge. Your resume = **PostgreSQL on RDS**.

## Ops

> [!question]- CloudWatch vs CloudTrail?
> **CloudWatch** = metrics/logs/alarms (observability). **CloudTrail** = API audit log (who did what).

## Drill cards

EC2 vs Lambda vs Beanstalk?::EC2 = raw VMs; Lambda = serverless functions (event-driven); Beanstalk = PaaS that manages the infra for your app.
Lambda cold start fixes?::Slim the JAR, provisioned concurrency (pre-warmed), SnapStart (Java snapshot). It's SAM not SAML.
SQS vs SNS?::SQS = queue, one consumer pulls; SNS = pub/sub fan-out to many. Combine as SNS→SQS.
IAM role vs policy vs user?::Policy = permissions JSON; role = assumable identity (services use these); user = person/app identity. Least privilege.
CloudWatch vs CloudTrail?::CloudWatch = metrics/logs/alarms; CloudTrail = API audit trail (who did what).
