import mailchimp from "@mailchimp/mailchimp_marketing";

mailchimp.setConfig({
  apiKey: import.meta.env.MAILCHIMP_API_KEY, // Set your API Key in environment variables
  server: import.meta.env.SERVER_PREFIX, // e.g., "us6"
});

export async function post({ request }) {
  try {
    // Parse form data
    const formData = await request.formData();
    const email = formData.get("email");

    if (!email) {
      return new Response(
        JSON.stringify({ success: false, message: "Email is required." }),
        { status: 400 }
      );
    }

    // Mailchimp audience/list ID
    const listId = import.meta.env.MAILCHIMP_LIST_ID;

    // Get subscriber's hashed email (required by Mailchimp)
    const emailHash = crypto.createHash("md5").update(email.toLowerCase()).digest("hex");

    // Retrieve current subscriber data
    const subscriber = await mailchimp.lists.getListMember(listId, emailHash);

    // Add 40 points to the existing 'cpoints' value or start with 40 if undefined
    const currentPoints = subscriber.merge_fields.CPOINTS || 0;
    const updatedPoints = parseInt(currentPoints, 10) + 40;

    // Update the subscriber's merge field
    await mailchimp.lists.updateListMember(listId, emailHash, {
      merge_fields: {
        CPOINTS: updatedPoints,
      },
    });

    return new Response(
      JSON.stringify({ success: true, message: "Points updated successfully." }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}
