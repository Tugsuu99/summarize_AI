"use client";

export const CreateUser = () => {
  const handleClick = async () => {
    const user = await fetch("https://localhost:3000/api/user", {
      method: "POST",
      body: JSON.stringify({
        email: "test@test@.com",
        id: "1",
      }),
    });
    console.log(user);
  };
  return <button onClick={handleClick}>Create User</button>;
};
