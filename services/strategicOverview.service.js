"use server";

export const getBankMentions = async () => {
  try {
    const response = await fetch(`${process.env.API_URL}/bank-mentions`, {
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

export const getGeolocation = async () => {
  try {
    const response = await fetch(`${process.env.API_URL}/geolocation `, {
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
