export async function submitQuote(formData) {
  const response = await fetch("/api/quote", {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Unable to submit quote request.",
    );
  }

  return result;
}

export async function submitContact(data) {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Unable to send your enquiry.",
    );
  }

  return result;
}
