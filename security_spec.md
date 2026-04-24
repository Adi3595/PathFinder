# Pathfinder AI Security Specification

## Data Invariants
1. A user can only access their own profile, interviews, roadmaps, and resume analyses.
2. An interview cannot be changed once its status is 'completed' (except by system/admin if applicable, but we'll stick to user-only for now).
3. Timestamps `createdAt` must match `request.time`.
4. Confidence scores and level scores must be between 0 and 100.

## The Dirty Dozen Payloads (Rejection Targets)
1. **Identity Theft**: User A tries to read User B's profile.
2. **Profile Hijack**: User A tries to update User B's target roles.
3. **Spoofed Ownership**: User A creates a Roadmap with `userId` of User B.
4. **Large Payload Attack**: Sending a 1MB string in `skills.name`.
5. **Shadow Field Injection**: Adding an `isAdmin` field to a User profile.
6. **State Skip**: Marking an interview as `completed` without any transcript parts.
7. **Future Dating**: Setting `createdAt` to a future date instead of server time.
8. **ID Poisoning**: Using a 2KB string as a `userId`.
9. **Role Escalation**: Attempting to set high confidence score without performing any activities.
10. **Orphaned Writes**: Creating a resume analysis without it being linked to a valid authenticated user.
11. **Email Overwrite**: Changing own email to someone else's in the profile.
12. **Array Blast**: Adding 10,000 skills to the skills array.

## Test Runner
The tests will verify that `PERMISSION_DENIED` is returned for all of the above.
