from supabase import create_client, Client
import requests
import time

# Configurazione Supabase
SUPABASE_URL = 'https://xdgduhjdwazviraadyja.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkZ2R1aGpkd2F6dmlyYWFkeWphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk3ODYyNTEsImV4cCI6MjA1NTM2MjI1MX0.TQSHFCQIdimQt3mOeBPea1BqPy0Ywli1fxrVXg537AU'
API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImY3NGJhNzUwLWFjY2ItNDdlMC04MWJjLTIyMGQ0NDQzMTc3OSIsImlhdCI6MTczOTc4MzY3OSwic3ViIjoiZGV2ZWxvcGVyL2E0ZDZjNzUyLTUwMmMtOGE0Yi1iMDc5LWYxMmM1Yjk1YmM0NyIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyIyMTMuMjE1LjE2My4xODYiXSwidHlwZSI6ImNsaWVudCJ9XX0.w2ixjEWJ6TOGvGtLZVNUx3RNeCQHpCPX8G79D15pll2apxd7p4EV3YnA6QbaF93G7vTtuxX-sh91nznKwbS8lw'

# Inizializzazione client Supabase
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Headers per Clash Royale API
headers = {
    'Authorization': f'Bearer {API_KEY}',
    'Accept': 'application/json'
}

def save_profile(player_data):
    player_tag = player_data.get("tag", "").strip("#")
    name = player_data.get("name", "Unknown")
    trophies = player_data.get("trophies", 0)
    best_trophies = player_data.get("bestTrophies", 0)
    wins = player_data.get("wins", 0)
    losses = player_data.get("losses", 0)
    exp_level = player_data.get("expLevel", 0)
    medals = player_data.get("currentPathOfLegendSeasonResult", {}).get("medals", 0)
    rank = player_data.get("currentPathOfLegendSeasonResult", {}).get("rank", 0)
    league_number = player_data.get("currentPathOfLegendSeasonResult", {}).get("leagueNumber", 0)

    existing_profile = supabase.table('profiles').select("player_tag").eq("player_tag", player_tag).execute()

    if existing_profile.data:
        print(f"✅ Profilo già presente: {player_tag}")
        return

    profile_data = {
        "player_tag": player_tag,
        "name": name,
        "trophies": trophies,
        "best_trophies": best_trophies,
        "wins": wins,
        "losses": losses,
        "exp_level": exp_level,
        "medals": medals,
        "rank": rank,
        "leagueNumber": league_number
    }

    supabase.table('profiles').insert(profile_data).execute()
    print(f"🆕 Inserito profilo: {player_tag} - {name}")

def retrieve_and_save_opponents(player_tag):
    url = f'https://api.clashroyale.com/v1/players/%23{player_tag}/battlelog'
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        matches = response.json()

        for match in matches:
            opponents = match.get("opponent", [])
            for opponent in opponents:
                opponent_tag = opponent.get("tag", "").strip("#")
                if opponent_tag:
                    opponent_profile_url = f'https://api.clashroyale.com/v1/players/%23{opponent_tag}'
                    opponent_response = requests.get(opponent_profile_url, headers=headers)

                    if opponent_response.status_code == 200:
                        opponent_data = opponent_response.json()
                        save_profile(opponent_data)
                    else:
                        print(f"❌ Errore nel recupero dati per {opponent_tag}: {opponent_response.status_code}")
            time.sleep(0.5)  # Ritardo per evitare il rate limit
    else:
        print(f"❌ Errore nel recupero dati partite per {player_tag}: {response.status_code}")

def main():
    profiles_response = supabase.table('profiles').select('player_tag').execute()
    profiles = profiles_response.data

    if not profiles:
        print("⚠️ Nessun profilo trovato in 'profiles'.")
        return

    for profile in profiles:
        player_tag = profile["player_tag"].strip("#")
        retrieve_and_save_opponents(player_tag)
        time.sleep(1)  # Ritardo per evitare il rate limit

if __name__ == "__main__":
    main()
