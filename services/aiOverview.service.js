"use server";

export const getAiOverview = async () => {
  try {
    const response = await fetch(`${process.env.API_URL}/ai-overview`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
};
