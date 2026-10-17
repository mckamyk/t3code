import * as Schema from "effect/Schema";
import type { OrchestrationV2TurnItem } from "@t3tools/contracts";

// Written before switching: Git and the event store cannot commit atomically.
export const ContinuationReceipt = Schema.Struct({
  threadId: Schema.String,
  requestId: Schema.String,
  oldBranch: Schema.String,
  branch: Schema.String,
  pullRequestNumber: Schema.Number,
  pullRequestUrl: Schema.String,
  pullRequestTitle: Schema.String,
  repositoryKey: Schema.String,
  mergedHeadSha: Schema.String,
  baseBranch: Schema.String,
  baseSha: Schema.String,
  contextDelivered: Schema.Boolean,
});
export type ContinuationReceipt = typeof ContinuationReceipt.Type;

export interface ThreadContinuationResult {
  readonly branch?: string;
  readonly context?: string;
  readonly notice?: string;
  readonly divider?: Extract<OrchestrationV2TurnItem, { type: "system_notice" }>["divider"];
  readonly previousPullRequest?: {
    readonly number: number;
    readonly url: string;
    readonly title: string;
    readonly repositoryKey: string;
    readonly headBranch: string;
    readonly baseBranch: string;
  };
}

export function preparedContinuation(receipt: ContinuationReceipt): ThreadContinuationResult {
  return {
    branch: receipt.branch,
    previousPullRequest: {
      number: receipt.pullRequestNumber,
      url: receipt.pullRequestUrl,
      title: receipt.pullRequestTitle,
      repositoryKey: receipt.repositoryKey,
      headBranch: receipt.oldBranch,
      baseBranch: receipt.baseBranch,
    },
    notice: `PR #${receipt.pullRequestNumber} merged. Continuing on ${receipt.branch} from origin/${receipt.baseBranch}.`,
    divider: {
      label: `Continued after PR #${receipt.pullRequestNumber}`,
      detail: `${receipt.branch} · from ${receipt.baseBranch}`,
    },
    context: `Post-merge continuation: PR #${receipt.pullRequestNumber} (${receipt.pullRequestUrl}) merged. This same worktree moved from ${receipt.oldBranch} to ${receipt.branch}, based on freshly fetched origin/${receipt.baseBranch} at ${receipt.baseSha}. The old branch is preserved. Earlier conversation describes the old checkout. Inspect current files before making changes; do not replay the old PR. Then address the user message.`,
  };
}
