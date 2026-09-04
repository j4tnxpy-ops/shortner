import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const bodySchema = z.object({ token: z.string().min(10), url: z.string().url(), alias: z.string().regex(/^[a-zA-Z0-9-_]{3,32}$/).optional(), title: z.string().max(120).optional() });

export const Route = createFileRoute("/api/public/shorten")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, Authorization" } }),
      POST: async ({ request }) => {
        try {
          const body = bodySchema.parse(await request.json());
          const { collections } = await import("@/lib/db.server");
          const { users, links } = await collections();
          const user = await users.findOne({ api_key: body.token });
          if (!user) return Response.json({ success: false, error: "Invalid API token" }, { status: 401, headers: { "Access-Control-Allow-Origin": "*" } });
          let alias = body.alias?.trim();
          if (!alias) {
            const alphabet = "abcdefghijkmnpqrstuvwxyz23456789";
            for (let attempt = 0; attempt < 10; attempt++) {
              const bytes = crypto.getRandomValues(new Uint8Array(6));
              alias = Array.from(bytes, b => alphabet[b % alphabet.length]).join("");
              if (!(await links.findOne({ alias }))) break;
            }
          }
          if (!alias || await links.findOne({ alias })) return Response.json({ success: false, error: "Alias unavailable" }, { status: 409, headers: { "Access-Control-Allow-Origin": "*" } });
          const doc = { user_id: String(user._id), alias, destination: body.url, title: body.title?.trim() || null, is_active: true, clicks: 0, earnings: 0, created_at: new Date() };
          await links.insertOne(doc as never);
          const origin = new URL(request.url).origin;
          return Response.json({ success: true, alias, short_url: `${origin}/${alias}` }, { headers: { "Access-Control-Allow-Origin": "*" } });
        } catch (e) {
          return Response.json({ success: false, error: e instanceof Error ? e.message : "Invalid request" }, { status: 400, headers: { "Access-Control-Allow-Origin": "*" } });
        }
      },
    },
  },
});
