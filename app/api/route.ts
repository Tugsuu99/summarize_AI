import { Webhook } from "svix";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { error } from "console";
import { json } from "stream/consumers";

type Event = {
  type: string;
  data: {
    id: string;
    first_name: string;
    last_name: string;
    email_addresses: { email_address: string }[];
  };
};

export async function POST(req: Request) {
  const webhookSecret = process.env.CLERK_WEBHOOK_KEY;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Missing webhook secret" },
      { status: 400 },
    );
  }

  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing headers" }, { status: 400 });
  }

  const webhook = new Webhook(webhookSecret);
  const body = await req.text();

  try {
    const event = webhook.verify(body, {
      "svix-id": "svixId",
      "svix-timestamp": "svixTimestamp",
      "svix-signature": "svixSignature",
    }) as Event;

    if (event.type === "user.created") {
      return NextResponse.json({ error: "Ignore event" }, { status: 400 });
    }

    const { email_addresses, first_name, last_name, id } = event.data;

    await prisma.user.create({
      data: {
        email: email_addresses[0].email_address,
        name: `${first_name} ${last_name}`,
        clerkId: id,
      },
    });

    // const user = await prisma.user.create({
    //   data: {
    //     email: "test1@test.com",
    //     id: "2",
    //   },
    // });
    // console.log(user);
    return NextResponse.json(
      { messae: "User created successfully" },
      { status: 201 },
    );
  } catch (error) {
    return new Response("Error creating user", { status: 500 });
  }
}
