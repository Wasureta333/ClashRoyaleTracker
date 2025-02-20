from supabase import create_client, Client
import requests
import time

 #region Configurazione Supabase
SUPABASE_URL = 'https://xdgduhjdwazviraadyja.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkZ2R1aGpkd2F6dmlyYWFkeWphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk3ODYyNTEsImV4cCI6MjA1NTM2MjI1MX0.TQSHFCQIdimQt3mOeBPea1BqPy0Ywli1fxrVXg537AU'
API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjQzMjQyNjRkLTU2MDAtNDg2MS05NDY2LWM4Mzg2MzM2MmRiOSIsImlhdCI6MTczOTQ4MTk2Niwic3ViIjoiZGV2ZWxvcGVyL2E0ZDZjNzUyLTUwMmMtOGE0Yi1iMDc5LWYxMmM1Yjk1YmM0NyIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyI0Ni4xMDIuNjQuNzQiXSwidHlwZSI6ImNsaWVudCJ9XX0.QohLou7RpYu2y0unotliB4AyLrNTmFVnVA48LEAF7cAeu5P4J-kXX8D5ZDGBfqaPL6BKK1u8e9Uk6BsVYqDq4w'


supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
#endregion

# Headers per Clash Royale API
headers = {
    'Authorization': f'Bearer {API_KEY}',
    'Accept': 'application/json'
}

profiles_response = supabase.table('profiles').select('player_tag').execute()
profiles = profiles_response.data

if not profiles:
    print("⚠️ Nessun profilo trovato in 'profiles'.")
    exit()

existing_matches = supabase.table('matches') \
    .select('battletime, player_tag') \
    .in_('player_tag', [p["player_tag"] for p in profiles]) \
    .execute()

existing_set = {(m['player_tag'], m['battletime']) for m in existing_matches.data}
print(f"ℹ️ Recuperati {len(existing_set)} match già esistenti.")

# 🚀 Elaborazione dei profili
for profile in profiles:
    tag = profile["player_tag"].strip("#")
    url = f'https://api.clashroyale.com/v1/players/%23{tag}/battlelog'
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        matches = response.json()
        matches_to_insert = []
        cards_to_insert = []

        # 🔍 Filtra i match già presenti nel database
        matches_to_process = [m for m in matches if (tag, m.get("battleTime")) not in existing_set]

        print(f"🎮 {tag}: {len(matches_to_process)} nuovi match da inserire.")

        for match in matches_to_process:
            battle_time = match.get("battleTime")
            opponent_tag = match.get("opponent", [{}])[0].get("tag", "Unknown").strip("#")
            player_win = match.get("team", [{}])[0].get("trophyChange", 0) > 0
            match_type = match.get("type", "Unknown")

            # 🔥 Costruzione del match
            match_data = {
                "battletime": battle_time,
                "player_tag": tag,
                "opponent_tag": opponent_tag,
                "player_win": player_win,
                "type": match_type
            }
            matches_to_insert.append(match_data)

        # ⚡ Inserimento bulk dei match con upsert
        if matches_to_insert:
            inserted = supabase.table('matches').upsert(matches_to_insert).execute()
            if not inserted.data:
                print(f"❌ Errore nell'inserimento per {tag}.")
                continue

            print(f"✅ {len(matches_to_insert)} match inseriti per {tag}.")

            # 🔄 Recupero dei match_id dopo inserimento per le carte
            match_ids = inserted.data
            for idx, match in enumerate(matches_to_process):
                match_id = match_ids[idx]['match_id']
                match_type = match.get("type", "Unknown")
                player_win = match.get("team", [{}])[0].get("trophyChange", 0) > 0

                # 🃏 Carte del player
                for card in match.get("team", [{}])[0].get("cards", []):
                    cards_to_insert.append({
                        "match_id": match_id,
                        "card_id": card.get("id", 0),
                        "card_name": card.get("name", "Unknown"),
                        "level": card.get("level", 0),
                        "evolution_level": card.get("evolutionLevel", 0),
                        "win": player_win,
                        "match_type": match_type
                    })

                # 🃏 Carte dell'opponente
                for card in match.get("opponent", [{}])[0].get("cards", []):
                    cards_to_insert.append({
                        "match_id": match_id,
                        "card_id": card.get("id", 0),
                        "card_name": card.get("name", "Unknown"),
                        "level": card.get("level", 0),
                        "evolution_level": card.get("evolutionLevel", 0),
                        "win": not player_win,
                        "match_type": match_type
                    })

            # ⚡ Inserimento bulk delle carte
            if cards_to_insert:
                supabase.table('match_cards').insert(cards_to_insert).execute()
                print(f"🃏 {len(cards_to_insert)} carte inserite per i match di {tag}.")

    else:
        print(f"❌ Errore per {tag}: {response.status_code}")

    # ⏱ Ridotto per aumentare la velocità senza sforare il rate limit
    time.sleep(0.2)
