# Classes

from typing import Callable
from rich.console import Console

class Protagonist:
    def __init__(self, name: str="Henry", age: int=13) -> None:
        self.name = name
        self.age =  age
        self.gender = "boy"
        self.balance = 120
        self.social_credit = 700
        self.health_percent = 85
        self.inventory: list[str] = []
    
    def __str__(self) -> str:
        return f"{self.name} is a {self.age}-year old {self.gender}, who is living in poverty."

    def show_stats(self) -> None:
        print("\n~ STATS ~\n")
        print(f"Money: ${self.balance}")
        print(f"Social Credit: {self.social_credit} pts")
        print(f"Health: {self.health_percent}")
        print(f"Inventory: {self.inventory}")
        print("\n~ ~~~~~ ~\n")

# Variables

protag = Protagonist()
query: str
console = Console()

# Functions
user_desision: Callable[[], bool] = lambda: input("(y/n): ").lower().startswith("y")

# Main code

print(protag)
print(f"You will make choices that will impact {protag.name} in different ways.")

protag.show_stats()

print("It's morning. You open the fridge, and see one box of ceral.")
print("Do you choose to eat it now? If so, you will have to buy lunch later.")
if user_desision():
    print("Your hunger is satisfied.")
    protag.inventory.append("breakfast")
    protag.show_stats()
else:
    print("You go on feeling hungry, saving your money.")
    protag.health_percent -= 5
    protag.show_stats()
print("FACT: Nearly 1 in 4 children in Canada lived in a food-insecure household recently, \nmeaning they didn't always have enough food for a healthy diet.")

print("You head over to your wardrobe. All you see is last year's jacket and a newer hoodie. \nThe hoodie is too thin for today's weather, but your friends will make fun of you for wearing that jacket.")
print("Do you wear last year's jacket?")
if user_desision():
    print("The jacket feels small, but you're happy that your health is fine.")
    protag.social_credit -= 120
    protag.inventory.append("jacket")
    protag.show_stats()
else:
    print("You wear the sweater to avoid being teased.")
    protag.health_percent -= 10
    protag.inventory.append("hoodie")
    protag.show_stats()
print("FACT: When income is limited, families must choose between essentials like warm clothing, \nfood, rent, or transport — all part of everyday hardship for children in poverty")

print("You head over to your table. You see a broken pencil and ripped notebook. You wonder if you should take these, or ask the teacher for supplies.")
print("Do you live with these supplies?")
if user_desision():
    print("You take these materials.")
    protag.inventory.append("broken-pencil")
else:
    print("You'll ask for materials from the teacher later.")
print("FACT: Kids in low-income families often struggle to afford school necessities, \nand poverty affects about 1 in 5 children in Canada.")

print("You step outside, sighing. Your school is far from you, and it'll take awhile to get there by walking.")
print("You could instead use the money meant for lunch to take the bus.")
print("Do you take the bus?")
if user_desision():
    print("You take the bus, costing you $5, and you arrive on time.")
    protag.inventory.append("ticket")
    protag.balance -= 5
else:
    print("You walk to school, ending up being an hour late. Your teacher sighs as you walk in.")
    if "breakfast" not in protag.inventory:
        print("You feel extra fatuiged by the 40 minute walk.")
        protag.health_percent -= 5
    protag.social_credit -= 150
protag.show_stats()

print("In your next class, your teacher reminds you of the assingment due in a few days, and reccomends working at home.")
print("You don't have internet and technology to work on this project. \nShould you ask for an extension?")
if user_desision():
    print("You ask the teacher for an extention. You get sideyes from peers and the teachers sighs, \nbut she understands your situation and gives you an extension.")
    protag.social_credit -= 100
    if protag.social_credit < 50:
        print("You're starting to get builled and teased by your peers...")
else:
    print("Your mental health suffers from the anxiety knowing you will have to find a way to complete your assignment.")
    protag.health_percent -= 10
protag.show_stats()
print("FACT: Students without home internet or supplies may fall behind, a known education gap linked to poverty.")

print("It's break!")
if "ticket" in protag.inventory:
    print("You don't have enough money with you to buy lunch. You suffer from hunger.")
    protag.health_percent -= 15
elif "breakfast" not in protag.inventory:
    print("You enjoy a light snack.")
    protag.health_percent += 5
else:
    print("You buy and enjoy a light snack.")
    protag.health_percent += 5
    protag.balance -= 5
protag.show_stats()
print("FACT: Skipping meals is a reality for some children facing food insecurity.")

print("Your friends are going out tonight. The price is $50 if you want to come with them.")
print("Will you go?")

if user_desision():
    print("You and your friends had a great time!")
    protag.social_credit += 150
    protag.balance -= 50
else:
    print("You tell them that you can't come, and they sigh and walk away.")
    protag.social_credit -= 100

protag.show_stats()

print("Your home feels messy, but you need to get grocieries. Should you clean up your home?")
if user_desision():
    print("You feel great now that it's clean! However, you loose this time to get grocieres and will have to live with no food tomorrow.\n")
    protag.health_percent += 5 # mental health
else:
    print("You sigh, thinking there'll be time to clean up later, and walk to the grocerry store.\n")

    print("~~~")

    print("You see a nice, healthy frozen dinner that will cost you $15, and a few unhealthy comfort foods that cost $5.")
    print("Should you get the healthy meal?")
    if user_desision():
        print("You feel satisfied with your purchase of the healthy meal, along with your other groceries.")
        protag.balance -= 30
        protag.inventory.append("healthy-dinner")
        protag.health_percent += 10
    else:
        print("You save your money being satsfied with the snack, along with your other groceries.")
        protag.balance -= 15
        protag.health_percent -= 10
        protag.inventory.append("chips")

    print("~~~ You head home... ~~~")
    print("You enjoy your meal.", end="\n\n")

if "hoodie" in protag.inventory or "chips" in protag.inventory:
    print("You're feeling a bit sick.")

    print("Should you take a day off?")
    if user_desision():
        print("You take a day off to recover. Your teachers are dissapointed as you are falling behind.")
        protag.health_percent += 25
        protag.social_credit -= 15
    else:
        print("You don't take the day off at the cost of your health.")
        protag.health_percent -= 10

protag.show_stats()

print("~~~")
print("No matter the descision you take, you will always loose in the end.")
print(f"10-11% of children have to live in poverty.")
print(f"45% of children growing up in lone-parent familes live in poverty.")
print("~~~")
print("Most children who live in poverty in Canada have to work multiple jobs and end up leaving school early.")
console.print('[i]"Having to work multiple jobs while doing fulltime school is so hard and defeating."[/i]')
console.print('[i]"I was forced to work extra hours to afford food and housing, \nleading me to being unable to dedicate time to school and being forced to drop out of my college courses."[/i]')

console.print("Poverty also has an extreme social impact. The impacts on social life occur during middle school. This starts with exclusion, as you can never be as popular as people who have more money. They’ll always have the latest fashion trends, technology, and toys. It also means you are restricted to sports, clubs, and other activities that your peers are able to do. Because of this, you would be likely to be bullied, which can lead to depression. This is why poverty is associated with higher rates of dropout, increased participation in crime, as well as increased rates of hospital admission.")