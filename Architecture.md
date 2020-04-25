Tasks
- start server
- provide 200
- connect to mongo
- create a game in monog



Features


# Add players to the game


# Deal the cards
https://www.npmjs.com/package/shuffle

# Track Score


Data Model

## Games Collection
Game{
	seats: [Seat]
	rounds: [Round]
}

Round { 
	number
	startingHands: [Hand]
	dealer: Seat
	bids: [Bid]
	tricks: [Trick]
	currHand: [Hand]
}

Bid {
	player_id
	position
	bid
}

Trick {
	player_id
	[Card]
}

Seat {
	Player_id
	Position
}

Hand {
	player_id
	[Cards]
}



Card {
	Suite
	Number			
}

## Players Collection

Player {
	id
	Name
}


## Create a game by:
POST /games/
	{
		gameName: "Best Game"
		numberSeats: 3
	}

Create this record in the DB
Game {
	seats: [
		{
			position: 0
		},
		{
			position: 1
		},
		{
			position: 2
		}
	]
}

Return Game ID

## A player claims a seat
This is when the UI will establish a WS with that API.

WS Event
{
	playerName: "matthew"
	seatId: 0
}

Update the games collection

Game {
	seats: [
		{
			position: 0
			player_id: "a"
		},
		{
			position: 1
		},
		{
			position: 2
		}
	]
}

Update the players collection

{
	id: "a"
	name: "Matthew"
}
## Start the game


Message
```
{
  clientId: state.clientId,
  action: "StartGame",
  data: {
    gameId: state.game._id
  }
}
```

Once all of the seats have been claimed, we can start the game.
API will deal the hands to all the players

Game {
	seats: [
		{
			position: 0
			player_id: "a"
			hand: [Card]
		},
		{
			position: 1
			player_id: "b"
			hand: [Card]
		},
		{
			position: 2
			player_id: "c"
			hand: [Card]
		}
	]
}

update the players collection
{
	id: "a"
	name: "Matthew"
},
{
	id: "b"
	name: "keldon"
},
{
	id: "c"
	name: "jameson"
}

## Bidding process
Every player goes around and bids the number of tricks they would like to take.

- The API needs to ensure that the players bid in the correct order
- The API needs to ensure that the sum of the bids does not equal the number of tricks in that round







Once people have placed their bids
POST .... TODO... Web Socket?



## First turn
Once everyone has played their cards, we will record a completed turn.

API Computations
- Who won the trick

In the db we need to both:
- updated everyone's hand 
- create a turn

Game {
	...seats
	rounds: [
		{
			position: 0
			bids: [
				{
					player_id: "a"
					bid: 1
				},
				{
					player_id: "b"
					bid: 2
				},
				{
					player_id: "c"
					bid: 0
				},
			]
			tricks: [
				{
					player: "a"
					cards: [card]
				}
			]
		}
	]
}

## Who has the lead
You can tell who has the leed by computing the number of seats and the number of turns and then determining what seat has the respective position. Moduls computation.