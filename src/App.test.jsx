import {render, screen, waitFor} from '@testing-library/react';
import App from './App';
import userEvent from "@testing-library/user-event";

test('async update counter', async () => {
  render(<App />);
  const button = screen.getByText("Async update counter");
  userEvent.click(button)
  await waitFor(() => {
    expect(screen.getByTestId("counter")).toHaveTextContent(1)
  })
});
