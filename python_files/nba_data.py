# Before using, make sure you pip3 install nba_api
from nba_api.stats.static import players
from nba_api.stats.endpoints import LeagueGameFinder, BoxScoreTraditionalV2
import datetime
import pandas as pd

# Set how many rows to print out
pd.set_option('display.max_rows', None)
pd.set_option('display.max_columns', None)

def get_player_stats(date):
    player_list = players.get_players()

    # change yesterday to whatever day's games we want
    yesterday = datetime.datetime.now() - datetime.timedelta(days=1)
    date = datetime.datetime.strptime(date, "%Y-%m-%d")

    gamefinder = LeagueGameFinder(date_from_nullable=date.strftime('%m/%d/%Y'),
                                date_to_nullable=date.strftime('%m/%d/%Y'),
                                league_id_nullable='00')
    games = gamefinder.get_data_frames()[0]

    # Get stats for each player for each game that happened that day
    player_stats = []
    for game_id in games['GAME_ID']:
        boxscore = BoxScoreTraditionalV2(game_id=game_id)
        players_stats = boxscore.get_data_frames()[0]
        player_stats.append(players_stats)
    player_stats = pd.concat(player_stats)

    player_stats = player_stats[['PLAYER_NAME', 'TEAM_CITY', 'MIN', 'REB', 'AST', 'PTS', 'FGM', 'FGA']]

    return player_stats

if __name__ == "__main__":
    # input all dates this way
    pass
    # print(get_player_stats("2023-04-18"))