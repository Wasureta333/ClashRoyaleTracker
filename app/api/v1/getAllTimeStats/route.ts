import { supabase } from "@/lib/supabaseClient";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const playerTag = searchParams.get("playerTag");

  const { data, error } = await supabase
    .from("matches")
    .select("player_win")
    .eq("player_tag", playerTag);

  if (error) return new Response(JSON.stringify({ error }), { status: 500 });

  const total = data.length;
  const wins = data.filter((match) => match.player_win).length;
  const losses = total - wins;
  const winrate = total > 0 ? (wins / total) * 100 : 0;

  return new Response(JSON.stringify({ total, wins, losses, winrate }), { status: 200 });
}
