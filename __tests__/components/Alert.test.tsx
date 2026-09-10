import { render, screen } from "@testing-library/react";
import { Alert } from "@/components/ui/Alert";

describe("<Alert />", () => {
  it("renders children", () => {
    render(<Alert>Something went wrong</Alert>);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });
  it("has role=alert for screen readers", () => {
    render(<Alert>Error</Alert>);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
  it("applies error variant styles", () => {
    render(<Alert variant="error">Error</Alert>);
    expect(screen.getByRole("alert")).toHaveClass("bg-red-50");
  });
  it("applies success variant styles", () => {
    render(<Alert variant="success">Success</Alert>);
    expect(screen.getByRole("alert")).toHaveClass("bg-green-50");
  });
  it("defaults to info variant", () => {
    render(<Alert>Info</Alert>);
    expect(screen.getByRole("alert")).toHaveClass("bg-blue-50");
  });
});