import * as github from '@actions/github'
import _ from 'lodash'

export type Context = {
  actor: string
  commitMessage?: string
  ref: string
  repo: string
  runId: string
  sha: string
  workflow: string
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

export function getContext(values?: Partial<Context>): Context {
  const actor = values?.actor ?? evalOrThrows(() => github.context.actor, 'actor')
  const commitMessage = values?.commitMessage ?? _.get(github.context.payload, 'head_commit.message', '<no commit message>')
  const ref = values?.ref ?? evalOrThrows(() => github.context.ref, 'ref')
  const repo = values?.repo ?? evalOrThrows(() => `${github.context.repo.owner}/${github.context.repo.repo}`, 'repo')
  const runId = values?.runId ?? evalOrThrows(() => isNaN(github.context.runId) ? undefined : github.context.runId.toString(), 'run-id')
  const sha = values?.sha ?? evalOrThrows(() => github.context.sha, 'sha')
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
