import * as github from '@actions/github'

export type Context = {
  actor: string
  commitMessage?: string
  ref: string
  repo: string
  runId: string
  sha?: string
  workflow: string
}

export function getContext(values?: Partial<Context>): Context {
  const actor = values?.actor ?? evalOrThrows(() => github.context.actor, 'actor')
  const commitMessage = values?.commitMessage ?? getCommitMessage() ?? '<no commit message>'
  const ref = values?.ref ?? evalOrThrows(() => github.context.ref, 'ref')
  const repo = values?.repo ?? evalOrThrows(() => `${github.context.repo.owner}/${github.context.repo.repo}`, 'repo')
  const runId = values?.runId ?? evalOrThrows(() => isNaN(github.context.runId) ? undefined : github.context.runId.toString(), 'run-id')
  const sha = values?.sha ?? getSHA()
  const workflow = values?.workflow ?? evalOrThrows(() => github.context.workflow, 'workflow')

  return {
    actor,
    commitMessage,
    ref,
    repo,
    runId,
    sha,
    workflow,
  }
}

function getSHA(): string | undefined {
  if (github.context.ref.startsWith('refs/pull/')) {
    return github.context.payload['pull_request']?.['head']?.['sha']
  }
  else {
    return github.context.sha
  }
}

function getCommitMessage(): string | undefined {
  if (github.context.ref.startsWith('refs/pull/')) {
    return github.context.payload['pull_request']?.title
  }
  else {
    return github.context.payload['head_commit']?.['message']
  }
}

function evalOrThrows(expression: () => string | undefined, id: string): string {
  try {
    const value = expression()
    if (value === undefined) throw Error(`Expression with ID <${id}> evaluated to undefined value`)

    return value
  }
  catch (err) {
    throw Error(`Error evaluating expression with ID <${id}>`)
  }
}
