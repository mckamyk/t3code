import { GitContinuationRequiredError, MessageId } from "@t3tools/contracts";
import * as Schema from "effect/Schema";
import type { EnvironmentThreadShell } from "./shell.ts";

export const isContinuationRequired = Schema.is(GitContinuationRequiredError);

export function continuationPreparationInput(
  thread: Pick<EnvironmentThreadShell, "environmentId" | "id" | "runtimeMode" | "interactionMode">,
  messageId: string,
) {
  return {
    environmentId: thread.environmentId,
    input: {
      threadId: thread.id,
      runtimeMode: thread.runtimeMode,
      interactionMode: thread.interactionMode,
      dispatchMode: "queue" as const,
      message: {
        messageId: MessageId.make(messageId),
        role: "user" as const,
        text: "Prepare continuation after the merged PR. Preserve all existing work, inspect the current base and reconcile only follow-up changes onto a fresh branch. Resolve conflicts and test. Do not commit, push, or create a PR; leave changes for review.",
        attachments: [],
      },
    },
  };
}
