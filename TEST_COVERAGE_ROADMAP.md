# Test Coverage Improvement Roadmap

**Current:** 61.55% | **Target:** 75-80% | **Effort:** 26-40 hours

---

## Quick Reference

### Coverage by Priority

| Module | Current | Target | Effort | Priority | Status |
|--------|---------|--------|--------|----------|--------|
| OAuth Service | 1.96% | 95% | 0h | P0 | ✅ DONE (20 tests) |
| Validators | 57.14% | 95% | 2h | P1 | 🔄 TODO |
| Services | 61.89% | 75% | 4h | P1 | 🔄 TODO |
| Repositories | 69.44% | 80% | 3h | P1 | 🔄 TODO |
| OAuth Controller | 3.22% | 60% | 5h | P1 | 🔄 TODO (integration) |
| Context Creation | 36.91% | 70% | 6h | P1 | 🔄 TODO (refactor first) |
| Resolvers | 74.83% | 85% | 4h | P2 | 🔄 TODO |
| App/Server | 64.61% | 75% | 3h | P2 | 🔄 TODO |

---

## 4-Week Plan

### Week 1: Quick Wins → 70% Coverage
**Effort:** 12 hours | **Impact:** +8-9% coverage

#### Day 1-2: Validators (2 hours)
```bash
# Create: invoice-backend/src/validators/__tests__/auth.validator.test.ts
```

**Tests to add:**
- ✅ Valid registration input
- ✅ Invalid email formats
- ✅ Weak passwords
- ✅ Missing required fields
- ✅ SQL injection attempts
- ✅ XSS in inputs
- ✅ Length validations
- ✅ Sanitization

**Expected coverage:** 57% → 95% (+0.5% total)

---

#### Day 3-4: Service Edge Cases (4 hours)
**Expand existing test files:**
- `tests/unit/services/invoiceService.test.ts`
- `tests/unit/services/userService.test.ts`

**Tests to add:**
- Authorization edge cases (accessing other user's invoices)
- Invalid ID formats
- Concurrent modifications
- Transaction rollback scenarios
- Database constraint violations
- Null/undefined handling

**Expected coverage:** 61.89% → 72% (+3% total)

---

#### Day 5: Repository Tests (3 hours)
**Expand existing test files:**
- `tests/unit/prismaInvoiceRepo.test.ts`
- `tests/unit/prismaUserRepo.test.ts`

**Tests to add:**
- Empty result sets
- Large result sets (performance)
- Unique constraint violations
- Foreign key violations
- Transaction boundaries
- Connection errors

**Expected coverage:** 69.44% → 78% (+2% total)

---

#### Day 6: Resolver Edge Cases (3 hours)
**Expand:** `tests/unit/resolvers/invoiceResolvers.test.ts`

**Tests to add:**
- Unauthorized access attempts
- Invalid GraphQL input types
- Missing required arguments
- Field-level authorization
- Error response formats
- Context injection errors

**Expected coverage:** 74.83% → 85% (+2% total)

---

### Week 2: Integration → 75% Coverage
**Effort:** 14 hours | **Impact:** +5-6% coverage

#### Day 7-9: OAuth Integration Tests (5 hours)
```bash
# Create: invoice-backend/tests/integration/oauthFlow.test.ts
```

**Tests to add:**
- Complete Google OAuth flow
  - Redirect to Google
  - Callback with valid code
  - Token exchange
  - User creation/login
  - Frontend redirect with tokens
- Complete Microsoft OAuth flow
- Complete Apple OAuth flow
- OAuth error handling
  - Invalid callback data
  - Expired OAuth tokens
  - Network errors
- Linking multiple providers to same user
- Provider unlinking

**Expected coverage:** OAuth controller 3.22% → 60% (+3% total)

---

#### Day 10-12: Context Refactoring + Tests (6 hours)

**Step 1: Refactor (3 hours)**
```bash
# Create new files:
# - src/services/tokenVerification.service.ts
# - src/services/userResolution.service.ts
# - src/factories/context.factory.ts
```

Extract from `createContext.ts`:
```typescript
// tokenVerification.service.ts
class TokenVerificationService {
  async verifyAuth0Token(token: string): Promise<TokenPayload>;
  async verifyNewSystemToken(token: string): Promise<TokenPayload>;
  async verifyDemoToken(token: string): Promise<TokenPayload>;
}

// userResolution.service.ts
class UserResolutionService {
  async resolveOrCreateUser(payload: TokenPayload): Promise<User>;
}

// context.factory.ts
class ContextFactory {
  async createContext(req: Request): Promise<Context> {
    const tokenService = new TokenVerificationService();
    const userService = new UserResolutionService();
    // Simple orchestration
  }
}
```

**Step 2: Test (3 hours)**
```bash
# Create test files:
# - src/services/__tests__/tokenVerification.service.test.ts
# - src/services/__tests__/userResolution.service.test.ts
```

**Tests to add:**
- Token verification for each auth system
- User resolution for existing users
- User creation for new users
- Error handling for invalid tokens
- Demo/test mode handling

**Expected coverage:** Context 36.91% → 70% (+2% total)

---

#### Day 13: App Startup Tests (3 hours)
```bash
# Create: invoice-backend/tests/integration/app.test.ts
```

**Tests to add:**
- Server starts successfully
- All routes registered correctly
- Middleware applied in correct order
- CORS configured correctly
- GraphQL endpoint responds
- WebSocket endpoint connects
- Health check endpoint works
- Graceful shutdown works

**Expected coverage:** App/Server 64.61% → 75% (+1.5% total)

---

### Week 3: Frontend + E2E → 78% Coverage
**Effort:** 14 hours | **Impact:** Frontend + integration coverage

#### Day 14-17: Frontend Hook Tests (6 hours)
```bash
# Expand/create frontend test files
```

**Priority hooks:**
1. `useAddInvoice` - full error scenarios
2. `useUpdateInvoice` - optimistic updates
3. `useDeleteInvoice` - confirmation flow
4. `useInvoices` - filtering, sorting
5. `useAuth` - login, logout, refresh
6. `useUnifiedAuth` - auth system switching

**Tests to add (per hook):**
- Success scenarios
- Network errors
- Validation errors
- Loading states
- Optimistic UI updates
- Cache updates
- Error recovery

**Expected impact:** Frontend coverage significantly improved

---

#### Day 18-21: E2E OAuth Tests (8 hours)
```bash
# Create: invoice-frontend/qa/oauth.e2e.spec.ts
```

**Playwright E2E tests:**
```typescript
test('User can login with Google', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Login with Google');
  // Mock OAuth flow or use test credentials
  await expect(page).toHaveURL('/invoices');
  await expect(page.locator('text=Logout')).toBeVisible();
});
```

**Test scenarios:**
- Google OAuth complete flow
- Microsoft OAuth complete flow
- Apple OAuth complete flow
- OAuth error handling
- Token refresh flow
- Session persistence
- Logout flow
- Multiple browser tabs

**Expected impact:** Integration confidence, counts toward coverage

---

### Week 4: Polish → 80% Coverage
**Effort:** 6 hours | **Impact:** +2% coverage

#### Day 22-23: Final Resolver Edge Cases (3 hours)
- Subscription authorization
- Nested query complexity
- Mutation rollback scenarios
- Field resolver errors

**Expected coverage:** Resolvers 85% → 90% (+1% total)

---

#### Day 24: CI/CD Coverage Enforcement (3 hours)
```yaml
# Add to .github/workflows/ci.yml
- name: Check Coverage
  run: |
    yarn coverage
    # Fail if coverage < 75%
```

**Tasks:**
- Add coverage threshold checks
- Generate coverage reports as artifacts
- Add coverage badge to README
- Set up coverage trend tracking

**Expected impact:** Prevent coverage regressions

---

## Test Templates

### Unit Test Template (Services)
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';

describe('ServiceName', () => {
  let service: ServiceName;
  let mockDependency: MockType;

  beforeEach(() => {
    mockDependency = mockDeep<DependencyType>();
    service = new ServiceName(mockDependency);
  });

  describe('methodName', () => {
    it('should handle success case', async () => {
      // Arrange
      mockDependency.method.mockResolvedValue(expectedValue);

      // Act
      const result = await service.methodName(input);

      // Assert
      expect(result).toEqual(expectedOutput);
      expect(mockDependency.method).toHaveBeenCalledWith(expectedArgs);
    });

    it('should handle error case', async () => {
      // Arrange
      mockDependency.method.mockRejectedValue(new Error('Test error'));

      // Act & Assert
      await expect(service.methodName(input)).rejects.toThrow('Expected error');
    });
  });
});
```

---

### Integration Test Template
```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { startTestServer, stopTestServer } from './testHelpers';
import request from 'supertest';

describe('Integration: Feature', () => {
  let server: TestServer;

  beforeAll(async () => {
    server = await startTestServer();
  });

  afterAll(async () => {
    await stopTestServer(server);
  });

  it('should complete full user flow', async () => {
    // Step 1: Create resource
    const createRes = await request(server.app)
      .post('/graphql')
      .send({ query: CREATE_MUTATION })
      .expect(200);

    // Step 2: Fetch resource
    const fetchRes = await request(server.app)
      .post('/graphql')
      .send({ query: GET_QUERY })
      .expect(200);

    // Step 3: Verify
    expect(fetchRes.body.data).toMatchObject(expected);
  });
});
```

---

### E2E Test Template (Playwright)
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Setup: Login, seed data, etc.
  });

  test('should allow user to complete workflow', async ({ page }) => {
    // Step 1: Navigate
    await page.click('text=Action Button');

    // Step 2: Fill form
    await page.fill('input[name="field"]', 'value');

    // Step 3: Submit
    await page.click('button[type="submit"]');

    // Step 4: Verify
    await expect(page.locator('text=Success')).toBeVisible();
  });

  test('should handle error gracefully', async ({ page }) => {
    // Simulate error condition
    await page.route('**/api/**', route => route.abort());

    // Attempt action
    await page.click('text=Action Button');

    // Verify error handling
    await expect(page.locator('text=Error occurred')).toBeVisible();
  });
});
```

---

## Coverage Tracking

### Weekly Check-ins
```bash
# Run coverage report
yarn coverage

# Expected progression:
Week 0: 61.55% (baseline)
Week 1: 70% (quick wins)
Week 2: 75% (integration)
Week 3: 78% (frontend + E2E)
Week 4: 80% (polish)
```

### Metrics to Track
1. **Line coverage** (primary)
2. **Branch coverage** (important for error handling)
3. **Function coverage** (ensure all public APIs tested)
4. **File coverage** (identify untested files)

### Red Flags
- Coverage decreases (new code without tests)
- Branch coverage < 70% (missing error cases)
- Critical files with < 50% coverage

---

## When to Stop

### 75% Coverage is Excellent If:
✅ All business logic has tests
✅ All critical user paths tested (E2E)
✅ All security-critical code tested
✅ All error handling tested
✅ Untested code is low-risk (config, framework boilerplate)

### Don't Test (Pragmatic Exceptions):
❌ Framework boilerplate (Passport.js wrappers)
❌ Type definitions (GraphQL schema, interfaces)
❌ Configuration files (unless complex logic)
❌ Generated code (Prisma client)
❌ Simple getters/setters
❌ Logging statements

### Diminishing Returns After 80%:
At 80%+ coverage, you're often:
- Testing framework code
- Testing trivial code
- Writing tests for completeness, not confidence
- Spending 2-3 hours per 1% coverage gain

**Recommendation: 75-80% is the sweet spot.**

---

## Maintenance Plan

### After Reaching Target Coverage

1. **Enforce Coverage Thresholds**
   ```json
   // vitest.config.ts
   coverage: {
     statements: 75,
     branches: 70,
     functions: 75,
     lines: 75
   }
   ```

2. **Require Tests for New Code**
   - All new features must include tests
   - All bug fixes must include regression test
   - PR review checklist includes test coverage

3. **Monthly Coverage Reviews**
   - Identify new gaps
   - Refactor problematic areas
   - Update tests for changed requirements

4. **Continuous Improvement**
   - Gradually increase threshold (75% → 77% → 80%)
   - Refactor hard-to-test code
   - Add E2E tests for new user flows

---

## Resources Needed

### Tools (Already Available)
- ✅ Vitest (unit tests)
- ✅ Playwright (E2E tests)
- ✅ vitest-mock-extended (mocking)
- ✅ @testing-library/react (frontend)

### Potential Additions
- [ ] Coverage badge (shields.io)
- [ ] Coverage trend dashboard (Codecov, Coveralls)
- [ ] Test data factories (Faker.js already installed)

### Time Investment
- Week 1: 12 hours (1.5 days)
- Week 2: 14 hours (1.75 days)
- Week 3: 14 hours (1.75 days)
- Week 4: 6 hours (0.75 days)

**Total: 46 hours (5.75 days) → 80% coverage**

---

## Success Criteria

### ✅ 70% Coverage (Minimum Viable)
- All services tested comprehensively
- All repositories handle edge cases
- All validators tested
- Core business logic covered

### ✅ 75% Coverage (Recommended Target)
- Everything from 70%
- OAuth flow integration tested
- Context creation refactored and tested
- App startup tested

### ✅ 80% Coverage (Excellent)
- Everything from 75%
- Full E2E test suite
- Frontend hooks fully tested
- All edge cases covered

---

## Quick Start

**Want to start improving coverage today?**

### Option 1: Easiest (2 hours)
```bash
# Add validator tests
cd invoice-backend
touch src/validators/__tests__/auth.validator.test.ts
# Copy validator test template from above
yarn test:unit
```

### Option 2: Highest Impact (4 hours)
```bash
# Expand service tests
cd invoice-backend/tests/unit/services
# Add edge cases to existing test files
yarn test:unit
```

### Option 3: Most Valuable (5 hours)
```bash
# Add OAuth integration tests
cd invoice-backend/tests/integration
touch oauthFlow.test.ts
# Copy integration test template from above
yarn test:integration
```

---

**Generated:** 2025-12-03
**Next Review:** End of Week 1 (target: 70%)
**Owner:** Development Team
**Status:** Ready to implement
