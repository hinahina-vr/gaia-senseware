# GAIA SENSEWARE Codex workflow

This workflow was agreed with the project owner to prevent silent stops and duplicated coordination work.

## Delegation boundary

- Do not start a new sub-agent for implementation, integration, QA, review approval, release approval, push, or deployment.
- A new sub-agent is allowed only for a bounded, independent task such as read-only history research or asset discovery whose result does not itself require an implementation branch merge.
- Do not interrupt an already-running agent solely because this policy was adopted. Let that agent finish its current bounded assignment, collect the result once, and then return ownership to the primary task.
- A permitted helper must not create further sub-agents.

## Primary-task ownership

- The primary task owns the continuous path: inspect -> implement -> integrate -> verify -> release when authorized -> production smoke -> report.
- Helper output is an input to this path, not a completion state and not a reason to wait for another user message.
- The primary task must collect completed helper work and start the next in-scope step without asking the user to coordinate tasks.
- Do not end the active turn while requested integration, required QA, an authorized release, or production smoke remains pending.

## Existing task history

- Preserve existing tasks and their artifacts. Do not delete or rewrite their history.
- Recover unique unfinished artifacts from an existing task once when needed. Do not resume PMO -> implementer -> reviewer -> release-executor message chains.
- Do not create new persistent PMO, reviewer, approval, or deploy-executor tasks. These are responsibilities of the primary task.

## Approval and evidence

- Do not invent approval gates for ordinary in-scope edits, non-destructive integration, focused tests, or a release already authorized by the project owner.
- Stop only for a material unresolved product choice, a missing secret or authority, a destructive/costly external action, or meaningful scope expansion.
- Replace repeated GO/HOLD handoffs with repository checks and focused desktop/mobile browser evidence.
- Report status to the user during long work, but a status message does not replace continuing the work.

## Release default

- Keep implementation work local unless the project owner explicitly requests a push or deployment in the current task.
- Never push, deploy, or publish changes based on a standing assumption or an earlier release request. Each release requires a fresh, explicit instruction from the project owner.
- A local implementation is complete after proportionate verification and a clear report of the files changed and checks run.
- Never use force push, rebase published history, or deploy a different tree from the reviewed commit.

## Token discipline

- Do not repeat the same inspection or QA across multiple agents unless a distinct high-risk failure mode requires independent verification.
- Reuse completed evidence, resume from the current SHA, and avoid restarting finished work after interruptions.
- Keep one canonical integration candidate based on the current public/main ancestor. Do not strand related requested fixes on separate branches.
