from bs4 import BeautifulSoup
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import concurrent.futures
from player import Player, Prop


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
            con = prop.find_elements(By.CLASS_NAME, "odds-offer__item")[-1]
            line = con.find_element(By.CLASS_NAME,
                                    "odds-cell__line").text.split()[1]
            costs = [
                c.text
                for c in con.find_elements(By.CLASS_NAME, "odds-cell__cost")
            ]
            if display:
                print(
                    f"{pname.split()[0]}:\t{line} (O {costs[0]}) (U {costs[1]})"
                )
            # Add the prop to the player
            player.add_prop(
                Prop(name=pname.split()[0],
                     line=line,
                     over_cost=costs[0],
                     under_cost=costs[1]))
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

    # Use concurrent.futures to scrape each player's props
    with concurrent.futures.ThreadPoolExecutor() as executor:
        players = list(
            executor.map(
                lambda href: scrape_player_props(href + date, display=display),
                hrefs))
        executor.shutdown(wait=True)

    # Close the browser instance
    browser.quit()

    return [p for p in players if p.has_props()]