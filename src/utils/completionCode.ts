// Must match COMPLETION_CODE_PREFIX in hongkong-3d-web (src/lib/completionCode.ts).
// Participants see and type "NK" + order_id into the survey, so the dashboard
// shows the same string to make matching survey responses a direct comparison.
export const COMPLETION_CODE_PREFIX = 'NK'

export function formatCompletionCode(orderId: number | null): string {
  return orderId === null ? '' : `${COMPLETION_CODE_PREFIX}${orderId}`
}
