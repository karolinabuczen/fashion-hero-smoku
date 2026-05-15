import { render, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "../auth-provider";

// Pomocniczy komponent do odczytu stanu auth w testach
function AuthConsumer({
  onUser,
}: {
  onUser: (user: ReturnType<typeof useAuth>["user"]) => void;
}) {
  const { user, login, register } = useAuth();
  onUser(user);
  return (
    <div>
      <button onClick={() => login("anna@avintage.pl", "pass")}>loginSeller</button>
      <button onClick={() => login("zwykly@example.com", "pass")}>loginUser</button>
      <button
        onClick={() =>
          register({
            email: "nowy@example.com",
            password: "pass",
            firstName: "Jan",
            lastName: "Kowalski",
          })
        }
      >
        register
      </button>
    </div>
  );
}

function renderAuth(onUser: (u: ReturnType<typeof useAuth>["user"]) => void) {
  return render(
    <AuthProvider>
      <AuthConsumer onUser={onUser} />
    </AuthProvider>
  );
}

describe("AuthProvider — logika sellera", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("login emailem z MOCK_SELLER_EMAILS ustawia isSeller: true", async () => {
    let capturedUser: ReturnType<typeof useAuth>["user"] = null;
    const { getByText } = renderAuth((u) => { capturedUser = u; });

    await act(async () => {
      getByText("loginSeller").click();
    });

    expect(capturedUser).not.toBeNull();
    expect(capturedUser!.isSeller).toBe(true);
    expect(capturedUser!.email).toBe("anna@avintage.pl");
  });

  it("login zwykłym emailem ustawia isSeller: false", async () => {
    let capturedUser: ReturnType<typeof useAuth>["user"] = null;
    const { getByText } = renderAuth((u) => { capturedUser = u; });

    await act(async () => {
      getByText("loginUser").click();
    });

    expect(capturedUser).not.toBeNull();
    expect(capturedUser!.isSeller).toBe(false);
  });

  it("rejestracja ustawia isSeller: false domyślnie", async () => {
    let capturedUser: ReturnType<typeof useAuth>["user"] = null;
    const { getByText } = renderAuth((u) => { capturedUser = u; });

    await act(async () => {
      getByText("register").click();
    });

    expect(capturedUser).not.toBeNull();
    expect(capturedUser!.isSeller).toBe(false);
    expect(capturedUser!.email).toBe("nowy@example.com");
  });
});
