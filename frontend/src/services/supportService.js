
const supportService = {
  submitContactForm: async (formData) => {
    try {
      // Add the Web3Forms access key
      const data = {
        ...formData,
        access_key: "5ffd1b15-b2de-49f3-9ca7-f4c74659a14f",
        subject: `[Support Center] ${formData.subject}`
      };

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || "Failed to send message.");
      }

      return result;
    } catch (error) {
      console.error("Error submitting to Web3Forms:", error);
      throw error.message || "Failed to send message. Please try again later.";
    }
  },
};

export default supportService;
