const mockGetSession = jest.fn();
const mockOnAuthStateChange = jest.fn();
const mockSignOut = jest.fn();
const mockFrom = jest.fn();

jest.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      getSession: mockGetSession,
      onAuthStateChange: mockOnAuthStateChange,
      signOut: mockSignOut,
    },
    from: mockFrom,
  }),
}));

import { renderHook, waitFor } from "@testing-library/react";
import { useAuth } from "@/hooks/useAuth";

const mockUser = {
  id: "user-123",
  email: "test@example.com",
  app_metadata: {},
  user_metadata: {},
  aud: "authenticated",
  created_at: "2024-01-01T00:00:00Z",
};

const mockProfile = {
  id: "user-123",
  email: "test@example.com",
  full_name: "Test User",
  avatar_url: null,
  updated_at: null,
};

function setupMocks({ user = null, profile = null }: { user?: typeof mockUser | null; profile?: typeof mockProfile | null } = {}) {
  mockGetSession.mockResolvedValue({
    data: { session: user ? { user } : null },
  });
  mockOnAuthStateChange.mockReturnValue({
    data: { subscription: { unsubscribe: jest.fn() } },
  });
  const singleMock = jest.fn().mockResolvedValue({ data: profile });
  const eqMock = jest.fn().mockReturnValue({ single: singleMock });
  const selectMock = jest.fn().mockReturnValue({ eq: eqMock });
  mockFrom.mockReturnValue({ select: selectMock });
}

beforeEach(() => jest.clearAllMocks());

describe("useAuth()", () => {
  it("starts in a loading state", () => {
    setupMocks();
    const { result } = renderHook(() => useAuth());
    expect(result.current.loading).toBe(true);
  });
  it("resolves with null user when not authenticated", async () => {
    setupMocks({ user: null });
    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toBeNull();
  });
  it("resolves with user and profile when authenticated", async () => {
    setupMocks({ user: mockUser, profile: mockProfile });
    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.profile).toEqual(mockProfile);
  });
  it("exposes a signOut function", async () => {
    mockSignOut.mockResolvedValue({});
    setupMocks();
    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await result.current.signOut();
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });
});