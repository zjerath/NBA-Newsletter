from bs4 import BeautifulSoup
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from player import Player, Prop
import json

class CustomEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Player):
            # Serialize the CustomClass object
            return {'value': obj.value}
        return super().default(obj)
    
def scrape_player_props(player_href, display=False):

    # Create a new player object
    name = " ".join(n.capitalize()
                    for n in player_href.split("/")[-2].split("-"))
    if display: print(f"Scraping {name}")
    player = Player(name)

    # Configure Chrome options and create instance
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    browser = webdriver.Chrome(options=chrome_options)

    # Navigate to the URL and get the props
    browser.get(player_href)
    wait = WebDriverWait(browser, 20)
    props = wait.until(
        EC.presence_of_all_elements_located(
            (By.CLASS_NAME, "grouped-items-with-sticky-footer__content")))

    # Loop through the props and get the consensus
    for prop in props:
        try:
            # Get the name of the prop
            pname = prop.find_element(By.TAG_NAME, "span").text
            if pname not in [
                    "Points Over/Under", "Assists Over/Under",
                    "Rebounds Over/Under"
            ]:
                continue

            # Get the consensus lines and costs
            con = prop.find_elements(By.CLASS_NAME, "odds-offer__item")[1]
            lines = [
                l.text
                for l in con.find_elements(By.CLASS_NAME, "odds-cell__line")
            ]
            costs = [
                c.text
                for c in con.find_elements(By.CLASS_NAME, "odds-cell__cost")
            ]

            # Add the prop to the player
            prop = Prop(pname.split()[0], float(lines[0][2:]), costs[0],
                     (costs[1]))
            player.add_prop(prop)
        except:
            continue

    # Close the browser instance
    browser.quit()

    if display: print(f"Finished scraping {name}.")
    return player


def scrape(url, date, display=False):

    # Configure Chrome options and create instance
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    browser = webdriver.Chrome(options=chrome_options)

    # Navigate to the URL and get the player cards
    browser.get(url + date)
    wait = WebDriverWait(browser, timeout=10)
    player_cards = wait.until(
        EC.presence_of_all_elements_located((By.CLASS_NAME, "player-card")))

    # Get hrefs for each player
    hrefs = [
        p.find_element(By.TAG_NAME, 'a').get_attribute('href')
        for p in player_cards
    ]

    players = []
    for href in hrefs:
        player = scrape_player_props(href + date, display=display)
        print(player)
        players.append(player)

    # Close the browser instance
    browser.quit()
    json_data = json.dumps(players, default=lambda obj: obj.__dict__, indent=4)

    # Save JSON data to a file
    with open("players.json", "w") as file:
        file.write(json_data)
    return players






# Convert the dictionary to JSON