import User from "../models/User";

export const ensureDefaultAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminUsername = process.env.ADMIN_USERNAME || process.env.ADMIN_USEERNAME || "admin";

  if (!adminEmail || !adminPassword) {
    console.warn("Admin bootstrap skipped: ADMIN_EMAIL or ADMIN_PASSWORD is missing");
    return;
  }

  const existingByEmail = await User.findOne({ email: adminEmail }).select("_id role username");

  if (existingByEmail) {
    let dirty = false;

    if (existingByEmail.role !== "admin") {
      existingByEmail.role = "admin";
      dirty = true;
    }

    if (existingByEmail.username !== adminUsername) {
      existingByEmail.username = adminUsername;
      dirty = true;
    }

    if (dirty) {
      await existingByEmail.save();
      console.log("Default admin updated");
    } else {
      console.log("Default admin verified");
    }

    return;
  }

  await User.create({
    username: adminUsername,
    email: adminEmail,
    password: adminPassword,
    role: "admin",
  });

  console.log("Default admin created");
};
