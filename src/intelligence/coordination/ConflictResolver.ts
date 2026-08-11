import { AgentProposal } from '../types';

export class ConflictResolver {
  /**
   * Takes a list of proposals and returns the winning proposal per intersection.
   * Deterministic resolution based on priority weights.
   */
  public resolveConflicts(proposals: AgentProposal[]): AgentProposal[] {
    const resolved: Map<string, AgentProposal> = new Map();

    for (const proposal of proposals) {
      const existing = resolved.get(proposal.intersectionId);

      if (!existing) {
        resolved.set(proposal.intersectionId, proposal);
      } else {
        // Tie-breaking rules
        if (proposal.priority > existing.priority) {
          resolved.set(proposal.intersectionId, proposal);
        } else if (proposal.priority === existing.priority) {
          // If priority is exactly identical, tie-break by confidence
          if (proposal.confidence > existing.confidence) {
            resolved.set(proposal.intersectionId, proposal);
          }
          // If still tied, the existing one naturally wins (first-in)
        }
      }
    }

    return Array.from(resolved.values());
  }
}
