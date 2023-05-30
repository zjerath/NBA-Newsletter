from nba_api.stats.endpoints import playercareerstats
from nba_api.stats.static import players

def player_year_stats(name):
    player_id = str(players.find_players_by_full_name(name)[0]['id'])
    # Nikola Jokić
    career = playercareerstats.PlayerCareerStats(player_id) 

    # pandas data frames (optional: pip install pandas)
    career.get_data_frames()[0]

    # json
    career.get_json()

    # dictionary
    averages = career.get_dict()['resultSets'][0]['rowSet'][-1]

    points = averages[-1]
    rebounds = averages[-7]
    assists = averages[-6]
    fgm = averages[9]
    fga = averages[10]
    time_played = averages[8]
    res = [points, rebounds, assists, fgm, fga, time_played]
    res = list(map(lambda x: x / averages[6], res))
    res = [round(x, 1) for x in res]
    return res