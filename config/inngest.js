import { inngest } from "@/lib/inngest";
import dbConnect from "@/lib/db";
import User from "@/models/user";

// -------------------- USER CREATION --------------------
export const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
  },
  {
    event: "clerk/user.created",
  },
  async ({ event }) => {
    const {
      id,
      first_name,
      last_name,
      email_addresses,
      image_url,
    } = event.data;

    const userData = {
      _id: id,
      name: `${first_name} ${last_name}`,
      email: email_addresses?.[0]?.email_address,
      imageUrl: image_url,
    };

    await dbConnect();
    await User.create(userData);

    return { message: "User synced successfully" };
  }
);


// -------------------- USER UPDATE --------------------
export const syncUserUpdation = inngest.createFunction(
  {
    id: "update-user-from-clerk",
  },
  {
    event: "clerk/user.updated",
  },
  async ({ event }) => {
    const {
      id,
      first_name,
      last_name,
      email_addresses,
      image_url,
    } = event.data;

    const userData = {
      _id: id,
      name: `${first_name} ${last_name}`,
      email: email_addresses?.[0]?.email_address,
      imageUrl: image_url,
    };

    await dbConnect();
    await User.findByIdAndUpdate(id, userData);

    return { message: "User updated successfully" };
  }
);


// -------------------- USER DELETION --------------------
export const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-from-clerk",
  },
  {
    event: "clerk/user.deleted",
  },
  async ({ event }) => {
    const { id } = event.data;

    await dbConnect();
    await User.findByIdAndDelete(id);

    return { message: "User deleted successfully" };
  }
);
