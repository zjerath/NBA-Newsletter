from nba_data import *
from player import *
from csv_reader import *
# from scraper import *
from scraper_no_threading import *
from player_averages import *
from datetime import time
import json
import sys
import numpy as np
# change back to 4/22
# can make these be asynch as they are pinging different databases

def convert_to_time(time_string):
    if time_string is not None:
        try:
            minutes, seconds = time_string.split(':')
            minutes = int(minutes)
            seconds = int(seconds)
            return pd.Timestamp(year=1900, month=1, day=1, minute=minutes, second=seconds).time()
        except ValueError:
            pass
    return None

arg1 = sys.argv[1]
arg2 = sys.argv[2]
arg3 = sys.argv[3]
arg4 = sys.argv[4]


player_stats = get_player_stats("2023-04-29")
bets = {}
bets[arg1] = []
bets[arg1].append((arg2, arg3, arg4))

with open('players.json', 'r') as file:
    json_data = file.read()
player_props = json.loads(json_data)

# Have all info we need, now feed information from this into prompt
# Get the value of all stats from day's game of players whose bets were taken
bets_results = {}

for player in bets:
    # order of values being placed in there are points, rebounds, assists, FGM, FGA, time played
    curr_row = player_stats[player_stats['PLAYER_NAME'] == player]
    bets_results[player] = [int(curr_row['PTS'].tolist()[0]), int(curr_row['REB'].tolist()[0]), int(curr_row['AST'].tolist()[0]), int(curr_row['FGM'].tolist()[0]), int(curr_row['FGA'].tolist()[0]), (curr_row['MIN'].tolist()[0])]

# dictionary of averages of players who got bet, order = points, rebounds, assists, fgm, fga, time_played
season_averages = {}
for player in bets:
    season_averages[player] = player_year_stats(player)

teams = []
# Now get teammates stats for the game of each player we bet on
for player in bets:
    city = bets[player][0][0]
    if city not in teams:
        teams.append(city)
        
# Convert 'MIN' column to a numeric type (float) and handle any errors
player_stats['MIN'] = player_stats['MIN'].astype(str)

# Split the 'MIN' column values by ':'
player_stats['MIN'] = player_stats['MIN'].str.split(':')
player_stats['MIN'] = player_stats['MIN'].apply(lambda x: int(float(x[0])) if x[0] != 'None' else 0)

# print(player_stats)

# dictionary of cities to list of players and their stats
teammate_stats = {}
for city in teams:
    if city not in teammate_stats:
        # select rows where the 'TEAM_CITY' column is 'Phoenix' and the 'MIN' column is greater than 5 minutes
        # df_filtered = player_stats[(player_stats['MIN'] != '00:00')]
        df_filtered = player_stats[(player_stats['TEAM_CITY'] == city) & (player_stats['MIN'] > 19.9)]
        # Loop over rows and put into the dictionary
        teammate_stats[city] = {}
        for index, row in df_filtered.iterrows():
            teammate_stats[city][row['PLAYER_NAME']] = [row['PTS'], row['REB'], row['AST'], row['FGM'], row['FGA']]
            

prompt = """
Ignore all previous instructions. I am going to give you context of what you are going to do. I will give you specific stats of NBA players and their predicted stats from before the game. Given certain criteria, you will infer why one player did better or worse than predicted lines based upon the criteria I give you.

You will be given the following predicted stats of the players from before the game:
Each player's predicted points, rebounds, and assists.

You will be given averages for each player that are from their past history:
Each player's average points per game, average rebounds per game, average assists per game, average field goals attempted per game, average field goals made per game, average time played per game, and average team shot equity.

You will also be given the actual stats of each player that were recorded after the game concludes:
Each player's points, rebounds, assists, field goals attempted, field goals made, time played

Here is your given persona: You are an NBA stats reporter focused on delivering analysis on professional basketball player's stats to your audience. You are writing to a single individual whose bets I have given you. Your job is to give a report of the bets, whether they wonor lost and break down the stats of the players based on their career averages. \n

"""

# Need the prop values for the guys we took
bet_lines = {}
for player in bets:
    bet_lines[player] = {}

for player_object in player_props:
    if player_object['name'] not in bets.keys():
        continue
    #player we care about, go into their props and fill out bet_lines dictionary
    for prop in player_object['props']:
        bet_lines[player_object['name']][prop['name']] = prop['over_line']
    
# Now generate for each bet the required info

bets_sentence = "I bet on "
for player in bets:
    for bet in bets[player]:
        val = bet_lines[player][bet[1]]
        temp = player + " " + bet[2] + " " + str(val) + " " + bet[1] + ". "
        prompt += bets_sentence + temp

# Now start getting the actual stats of the players we bet on

for player in bets:
    points = bets_results[player][0]
    rebounds = bets_results[player][1]
    assists = bets_results[player][2]
    fgm = bets_results[player][3]
    fga = bets_results[player][4]
    shooting_perc = round(fgm/fga,2) * 100 
    prompt += player + " had " + str(points) + " points, " + str(rebounds) + " rebounds, and "+ str(assists) + " assists on " + str(shooting_perc)+ "% shooting.\n"

for player in bets:
    # Need player's city
    prompt += " Here are the stats for " + player + "'s teammates if this helps you with your analysis:\n\n"
    city = bets[player][0][0]
    teammates = teammate_stats[city]
    for mate in teammates:
        if mate == player:
            continue
        prompt += (mate + ": " + str(teammates[mate][0]) + " points, " + str(teammates[mate][1]) + " assists, and " + str(teammates[mate][2]) + " rebounds on " + str(teammates[mate][-2]) + " field goals made of " + str(teammates[mate][-1]) + " field goals attempted.\n\n")
    
    # Add players averages below this each time
    p_avg = season_averages[player]
    prompt += (player + " averaged " + str(p_avg[0]) + " points, " + str(p_avg[1]) + " rebounds, and " + str(p_avg[2]) + " assists so far this season.")

prompt += """\nMake sure you do not say anything that is too big of a logical leap, 
use the other teammates data to infer things about why things happened for my bets. We 
want to understand based on the numbers why my bets hit or missed. Use their season averages to 
give a full picture of what happened

"""
print(prompt)